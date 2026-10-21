/* Ranking offline: somente resultados compartilhados voluntariamente. */
window.HelpRanking=(()=>{
 const key='help-ponto-ranking-v1',scores=[0,1000,5000,10000,25000,50000,100000,250000,500000,750000,1000000];let memory=[],loaded=false;
 function validate(r){
  if(!r||typeof r!=='object'||r.validationMode!==false||r.schema!==1)return null;
  if(typeof r.id!=='string'||!/^[a-zA-Z0-9_-]{8,160}$/.test(r.id))return null;
  if(typeof r.player!=='string')return null;const player=r.player.replace(/\s+/g,' ').trim();
  if(!player||player.length>40||player.toLowerCase()==='participante'||!scores.includes(r.amount)||!['won','wrong','stopped'].includes(r.reason))return null;
  if(!Number.isInteger(r.correct)||r.correct<0||r.correct>10||!Number.isInteger(r.helps)||r.helps<0||r.helps>4||!Number.isInteger(r.answered)||r.answered<r.correct||r.answered>10||!Number.isFinite(Date.parse(r.finishedAt)))return null;
  if((r.reason==='won')!==(r.amount===1000000)||r.amount===1000000&&r.correct!==10)return null;
  return {schema:1,id:r.id,player,finishedAt:r.finishedAt,amount:r.amount,correct:r.correct,answered:r.answered,total:10,helps:r.helps,reason:r.reason,validationMode:false};
 }
 function read(){if(!loaded){try{const raw=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(raw))memory=raw.map(validate).filter(Boolean);}catch{}loaded=true;}return [...memory];}
 function merge(rows,{updateNames=false}={}){const old=read(),map=new Map(old.map(r=>[r.id,r]));let added=0,rejected=0,duplicates=0;
  for(const raw of rows){const r=validate(raw);if(!r){rejected++;continue;}if(map.has(r.id)){if(updateNames)map.set(r.id,{...map.get(r.id),player:r.player});duplicates++;continue;}if(map.size>=3000){rejected++;continue;}map.set(r.id,r);added++;}
  memory=[...map.values()];let saved=true;try{localStorage.setItem(key,JSON.stringify(memory));}catch{saved=false;}
  return {added,rejected,duplicates,saved};
 }
 function compare(a,b){return b.amount-a.amount||b.correct-a.correct||a.helps-b.helps||Date.parse(a.finishedAt)-Date.parse(b.finishedAt)||a.id.localeCompare(b.id);}
 function leaders(rows){const byName=new Map();for(const r of rows){const name=r.player.normalize('NFC').toLocaleLowerCase('pt-BR');if(!byName.has(name)||compare(r,byName.get(name))<0)byName.set(name,r);}return [...byName.values()].sort(compare);}
 return {validate,read,merge,leaders,compare};
})();
