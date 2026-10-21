import questions from './questions.json' with {type:'json'};
const bank=new Map(questions.map(q=>[q.id,q]));
const ladder=[1000,5000,10000,25000,50000,100000,250000,500000,750000,1000000];
export function validateResult(data){
 if(!data||data.validationMode!==false||data.schema!==1)throw Error('Resultado não elegível.');
 const player=typeof data.player==='string'?data.player.normalize('NFC').replace(/\s+/g,' ').trim():'';
 if(player.length<2||player.length>40||player.toLocaleLowerCase('pt-BR')==='participante'||/[\u0000-\u001f<>]/.test(player))throw Error('Informe um nome válido, entre 2 e 40 caracteres.');
 if(typeof data.id!=='string'||!/^[a-zA-Z0-9_-]{8,160}$/.test(data.id))throw Error('Identificador inválido.');
 if(!Number.isInteger(data.helps)||data.helps<0||data.helps>4||!Array.isArray(data.answers)||data.answers.length>11)throw Error('Partida inválida.');
 let correct=0,answered=0,skipped=0,wrong=false;const ids=new Set();
 for(const answer of data.answers){
  if(!answer||ids.has(answer.id)||wrong||correct===10)throw Error('Sequência inválida.');
  ids.add(answer.id);const q=bank.get(answer.id);if(!q)throw Error('Pergunta não pertence à versão publicada.');
  if(answer.skipped===true){if(++skipped>1)throw Error('Pulos inválidos.');continue;}
  if(!q.options.includes(answer.selected))throw Error('Alternativa inválida.');
  answered++;if(answer.selected===q.options[q.correct])correct++;else wrong=true;
 }
 if(skipped>data.helps||answered>10)throw Error('Ajudas inválidas.');
 const reason=correct===10?'won':wrong?'wrong':'stopped';
 const amount=wrong?(correct>=6?100000:correct>=3?10000:0):correct?ladder[correct-1]:0;
 if(data.correct!==correct||data.amount!==amount||data.reason!==reason||data.answered!==answered)throw Error('O placar não corresponde às respostas.');
 return {id:data.id,player,player_key:player.toLocaleLowerCase('pt-BR'),amount,correct,answered,helps:data.helps,reason};
}
const publicResult=r=>({schema:1,id:r.id,player:r.player,amount:r.amount,correct:r.correct,answered:r.answered,total:10,helps:r.helps,reason:r.reason,finishedAt:r.finished_at,validationMode:false});
export default {async fetch(request,env){
 const origin=request.headers.get('Origin')||'',allowed=(env.ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean),headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff'};
 if(allowed.includes(origin))headers['Access-Control-Allow-Origin']=origin;
 const reply=(value,status=200)=>new Response(JSON.stringify(value),{status,headers});
 if(origin&&!allowed.includes(origin))return reply({error:'Origem não autorizada.'},403);
 if(request.method==='OPTIONS'){if(!allowed.includes(origin))return reply({error:'Origem não autorizada.'},403);return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});}
 const url=new URL(request.url),path=url.pathname.replace(/\/$/,'');
 if(path==='/health'&&request.method==='GET')return reply({ok:true,version:1});
 try{
  if(path==='/sessions'&&request.method==='POST'){
   if(!allowed.includes(origin))return reply({error:'Origem obrigatória.'},403);
   if(!env.RATE_SALT)return reply({error:'Serviço ainda não configurado.'},503);
   const ip=request.headers.get('CF-Connecting-IP')||'unknown',bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(env.RATE_SALT+ip)),hash=Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join(''),now=Date.now();
   const token=crypto.randomUUID();
   // O limite é aplicado no próprio INSERT, evitando a janela entre consulta e gravação.
   const insert=await env.DB.prepare('INSERT INTO sessions(token,ip_hash,created_at) SELECT ?,?,? WHERE (SELECT COUNT(*) FROM sessions WHERE ip_hash=? AND created_at>?)<30').bind(token,hash,now,hash,now-60000).run();
   if(!insert.meta.changes)return reply({error:'Muitas partidas iniciadas. Aguarde um minuto.'},429);
   await env.DB.prepare('DELETE FROM sessions WHERE created_at<?').bind(now-86400000).run();
   return reply({token},201);
  }
  if(path==='/results'&&request.method==='POST'){
   if(!allowed.includes(origin))return reply({error:'Origem obrigatória.'},403);
   if(!request.headers.get('Content-Type')?.includes('application/json'))return reply({error:'Formato inválido.'},415);
   const reader=request.body?.getReader();let size=0,chunks=[];if(!reader)return reply({error:'Corpo obrigatório.'},400);
   while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>65536){await reader.cancel();return reply({error:'Resultado muito grande.'},413);}chunks.push(value);}
   const combined=new Uint8Array(size);let at=0;for(const c of chunks){combined.set(c,at);at+=c.byteLength;}let body;try{body=JSON.parse(new TextDecoder().decode(combined));}catch{return reply({error:'JSON inválido.'},400);}
   if(typeof body.token!=='string'||!/^[a-f0-9-]{36}$/.test(body.token))return reply({error:'Inicie uma nova partida.'},400);
   let r;try{r=validateResult(body.result);}catch(e){return reply({error:e.message},400);}
   const existing=await env.DB.prepare('SELECT * FROM results WHERE id=?').bind(r.id).first();
   if(existing){if(existing.session_token!==body.token)return reply({error:'Identificador já utilizado.'},409);return reply({result:publicResult(existing),duplicate:true});}
   const finished=new Date().toISOString();const write=await env.DB.prepare('INSERT OR IGNORE INTO results(id,session_token,player,player_key,amount,correct,answered,helps,reason,finished_at) SELECT ?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM sessions WHERE token=? AND used=0 AND created_at>?)').bind(r.id,body.token,r.player,r.player_key,r.amount,r.correct,r.answered,r.helps,r.reason,finished,body.token,Date.now()-86400000).run();
   if(!write.meta.changes)return reply({error:'Partida já enviada ou sessão expirada.'},409);
   await env.DB.prepare('UPDATE sessions SET used=1 WHERE token=?').bind(body.token).run();
   return reply({result:publicResult({...r,finished_at:finished})},201);
  }
  if(path==='/ranking'&&request.method==='GET'){
   const result=await env.DB.prepare('SELECT * FROM (SELECT *, ROW_NUMBER() OVER(PARTITION BY player_key ORDER BY amount DESC,correct DESC,helps ASC,finished_at ASC,id) AS position_for_name FROM results) WHERE position_for_name=1 ORDER BY amount DESC,correct DESC,helps ASC,finished_at ASC,id LIMIT 1000').all();
   const stats=await env.DB.prepare('SELECT COUNT(*) AS games,COUNT(DISTINCT player_key) AS players,COUNT(DISTINCT CASE WHEN amount=1000000 THEN player_key END) AS million FROM results').first();
   return reply({results:result.results.map(publicResult),stats,limit:1000});
  }
  return reply({error:'Recurso não encontrado.'},404);
 }catch{return reply({error:'Não foi possível concluir agora. Tente novamente.'},503);}
}};
