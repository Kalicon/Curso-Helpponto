(()=>{'use strict';const config=window.HELP_ONLINE_CONFIG||{},base=(config.apiUrl||'').replace(/\/$/,''),$=id=>document.getElementById(id);let session=null,last=null,sending=false;
 async function api(path,body){if(!base)throw Error('O ranking online ainda está em preparação.');const response=await fetch(base+path,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15000)});const data=await response.json();if(!response.ok)throw Error(data.error||'Serviço indisponível.');return data;}
 window.HelpOnline={api,configured:!!base};
 if(!$('start-show'))return;
 const name=$('stage-name');name.required=true;name.minLength=2;name.maxLength=40;name.addEventListener('input',()=>name.setCustomValidity(''));
 for(const id of ['start-show','again-show'])$(id).addEventListener('click',e=>{const value=name.value.replace(/\s+/g,' ').trim();if(value.length<2||value.toLocaleLowerCase('pt-BR')==='participante'){e.preventDefault();e.stopImmediatePropagation();name.setCustomValidity('Informe seu nome ou apelido para jogar e aparecer no ranking.');document.getElementById('show-welcome').hidden=false;document.getElementById('show-result').hidden=true;name.focus();name.reportValidity();return;}session=null;last=null;},true);
 const authKey='help-ponto-online-session-v1',queueKey='help-ponto-envios-v1';let authPromise=null;
 function load(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')||fallback;}catch{return fallback;}}
 let pending=load(queueKey,[]);if(!Array.isArray(pending))pending=[];
 function persist(){try{localStorage.setItem(queueKey,JSON.stringify(pending));return true;}catch{return false;}}
 async function auth(){const saved=load(authKey,null);if(saved?.token&&Date.now()-saved.time<86400000)return saved.token;if(!authPromise)authPromise=api('/sessions',{}).then(r=>{const value={token:r.token,time:Date.now()};try{localStorage.setItem(authKey,JSON.stringify(value));}catch{}return r.token;}).finally(()=>authPromise=null);return authPromise;}
 for(const id of ['start-show','again-show'])$(id).addEventListener('click',()=>{try{localStorage.removeItem(authKey);}catch{}},true);
 document.addEventListener('show:question',()=>auth().catch(()=>{}));
 const retry=document.createElement('button');retry.type='button';retry.className='secondary';retry.textContent='Reenviar resultados pendentes';retry.hidden=true;$('ranking-share-status').after(retry);
 const notice=document.createElement('p');notice.className='pending-notice';notice.setAttribute('role','status');$('show-welcome').prepend(notice);
 function summary(){notice.hidden=!pending.length;notice.textContent=pending.length+' resultado(s) aguardando envio. A tentativa será refeita automaticamente quando a conexão voltar.';retry.hidden=!pending.length;}
 async function flush(){if(sending||!pending.length||!base)return;sending=true;
 try{for(const item of [...pending]){try{if(!item.token){item.token=await api('/sessions',{}).then(r=>r.token);persist();}const data=await api('/results',{token:item.token,result:item.row});pending=pending.filter(p=>p.row.id!==item.row.id);persist();if(last?.id===item.row.id){$('ranking-share-status').textContent='Desempenho salvo no ranking da turma! Veja sua posição.';$('ranking-open').href='ranking.html';}}catch(e){if(last?.id===item.row.id)$('ranking-share-status').textContent=e.message+' Resultado pendente. Tentaremos novamente quando a conexão voltar.';break;}}}finally{sending=false;summary();}}
 retry.onclick=flush;
 document.addEventListener('help:result-stored',async e=>{last=e.detail;if(last.validationMode)return;$('ranking-open').href='ranking.html';if(!pending.some(p=>p.row.id===last.id)){const saved=load(authKey,null);pending.push({row:last,token:saved?.token||null});}const saved=persist();$('ranking-share-status').textContent=saved?'Resultado guardado. Enviando ao ranking da turma…':'O navegador não permitiu guardar o resultado. Mantenha esta página aberta até concluir o envio.';summary();flush();});
 window.addEventListener('online',flush);document.addEventListener('visibilitychange',()=>{if(!document.hidden)flush();});summary();flush();setInterval(flush,30000);
 // Nome é fixado antes da partida para o ranking; evita renomear um resultado já enviado.
 $('ranking-player-name').readOnly=true;$('ranking-player-name').setAttribute('aria-label','Nome informado para esta partida');$('ranking-share').hidden=true;
 const box=document.querySelector('.ranking-invite');box.querySelector('div>p:not(.eyebrow)').textContent='Seu desempenho será enviado ao ranking compartilhado da turma. Use um nome ou apelido que diferencie você dos demais participantes.';
})();
