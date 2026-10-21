(()=>{'use strict';const config=window.HELP_ONLINE_CONFIG||{},base=(config.apiUrl||'').replace(/\/$/,''),$=id=>document.getElementById(id);let session=null,last=null,sending=false;
 async function api(path,body){if(!base)throw Error('O ranking online ainda está em preparação.');const response=await fetch(base+path,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15000)});const data=await response.json();if(!response.ok)throw Error(data.error||'Serviço indisponível.');return data;}
 window.HelpOnline={api,configured:!!base};
 if(!$('start-show'))return;
 const name=$('stage-name');name.required=true;name.minLength=2;name.maxLength=40;name.addEventListener('input',()=>name.setCustomValidity(''));
 for(const id of ['start-show','again-show'])$(id).addEventListener('click',e=>{const value=name.value.replace(/\s+/g,' ').trim();if(value.length<2||value.toLocaleLowerCase('pt-BR')==='participante'){e.preventDefault();e.stopImmediatePropagation();name.setCustomValidity('Informe seu nome ou apelido para jogar e aparecer no ranking.');document.getElementById('show-welcome').hidden=false;document.getElementById('show-result').hidden=true;name.focus();name.reportValidity();return;}session=null;last=null;},true);
 document.addEventListener('show:question',()=>{if(!session)session=api('/sessions',{}).then(r=>({token:r.token}),e=>({error:e.message}));});
 const retry=document.createElement('button');retry.type='button';retry.className='secondary';retry.textContent='Tentar salvar no ranking novamente';retry.hidden=true;$('ranking-share-status').after(retry);
 async function send(row){if(sending)return;sending=true;retry.hidden=true;const status=$('ranking-share-status');status.textContent='Salvando seu desempenho no ranking da turma…';
  try{const auth=await session;if(!auth?.token)throw Error(auth?.error||'Não foi possível iniciar a conexão com o ranking.');const data=await api('/results',{token:auth.token,result:row});status.textContent='Desempenho salvo no ranking da turma! Veja sua posição.';$('ranking-open').href='ranking.html';last={...row,...data.result};}
  catch(e){status.textContent=e.message+' Seu resultado ainda não foi publicado no ranking. Mantenha esta página aberta e tente novamente.';retry.hidden=!base;}
  finally{sending=false;}
 }
 retry.onclick=()=>{if(last)send(last);};
 document.addEventListener('help:result-stored',e=>{last=e.detail;if(last.validationMode)return;$('ranking-open').href='ranking.html';send(last);});
 // Nome é fixado antes da partida para o ranking; evita renomear um resultado já enviado.
 $('ranking-player-name').readOnly=true;$('ranking-player-name').setAttribute('aria-label','Nome informado para esta partida');$('ranking-share').hidden=true;
 const box=document.querySelector('.ranking-invite');box.querySelector('div>p:not(.eyebrow)').textContent='Seu desempenho será enviado ao ranking compartilhado da turma. Use um nome ou apelido que diferencie você dos demais participantes.';
})();
