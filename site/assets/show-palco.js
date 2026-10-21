(()=>{
 'use strict';
 const $=id=>document.getElementById(id),g=window.gsap,reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const tiers=[
  {symbol:'◇',title:'Aquecimento',description:'Identifique os cuidados básicos antes de entrar no jogo sério.'},
  {symbol:'ϟ',title:'Jogo sério',description:'Aplique o conhecimento às situações do dia a dia.'},
  {symbol:'✦',title:'Reta decisiva',description:'Analise as diferenças. As alternativas agora estão mais próximas.'},
  {symbol:'♛',title:'A pergunta do milhão',description:'Um caso integrado. Todo o caminho trouxe você até aqui.'}
 ];
 let result=null,hits=0,telon=false;
 function helps(used){$('stage-helps').textContent=`${4-Object.values(used).filter(Boolean).length} / 4`;}
 document.addEventListener('show:question',e=>{const d=e.detail,t=tiers[d.tier];if(d.level===0)hits=0;$('stage-hits').textContent=`${hits} / 10`;helps(d.helps);$('tier-label').textContent=d.freeRandom?`SORTEIO LIVRE · DIFICULDADE ${d.tier+1}/4`:`ETAPA ${d.tier+1} DE 4`;$('tier-title').textContent=t.title;$('round-symbol').textContent=t.symbol;$('tier-description').textContent=t.description;document.querySelector('.stage-bg').dataset.tier=d.tier;document.body.classList.toggle('million-round',d.level===9);document.body.classList.remove('answering');$('stage-reached').hidden=true;$('reveal-meter').hidden=true;
  if(g){g.killTweensOf('.reveal-meter>div');g.set('.reveal-meter>div',{width:'0%'});if(!reduced.matches)g.fromTo('.round-cue',{x:-12,opacity:.4},{x:0,opacity:1,duration:.45,clearProps:'transform,opacity'});}
 });
 document.addEventListener('show:helps',e=>helps(e.detail.helps));
 document.addEventListener('show:confirm',e=>{document.body.classList.add('answering');$('reveal-meter').hidden=false;if(g&&!reduced.matches)g.fromTo('.reveal-meter>div',{width:'0%'},{width:'100%',duration:(e.detail.duration||1000)/1000,ease:'power1.inOut'});});
 document.addEventListener('show:answer',e=>{const d=e.detail;document.body.classList.remove('answering');$('reveal-meter').hidden=true;hits=d.correct;$('stage-hits').textContent=`${hits} / 10`;if(d.hit&&[2,5,9].includes(d.level)){$('stage-reached').hidden=false;$('stage-reached').textContent=d.level===9?'♛ O palco inteiro comemora: um milhão de pontos conquistados!':`◆ Patamar protegido: ${d.guaranteed.toLocaleString('pt-BR')} pontos garantidos se você errar a próxima pergunta.`;if(g&&!reduced.matches)g.fromTo('#stage-reached',{scale:.97,opacity:.4},{scale:1,opacity:1,duration:.5,ease:'back.out(1.4)',clearProps:'transform,opacity'});}});
 document.addEventListener('show:result',e=>{result={...e.detail};document.body.classList.remove('answering');$('result-badge').textContent=result.validationMode?'PRÉVIA DE VALIDAÇÃO':result.reason==='won'?'LENDA DO PALCO':result.amount>=100000?'CONHECIMENTO DE PESO':result.amount>=10000?'PATAMAR CONQUISTADO':'CADA PERGUNTA, UMA DESCOBERTA';$('result-milestones').textContent=`${result.player} · ${result.correct} acertos · ${result.helps} ${result.helps===1?'ajuda utilizada':'ajudas utilizadas'}`;$('card-status').textContent='';if(g&&!reduced.matches)g.fromTo('.result-art,#show-result-title,.result-prize,.result-badge',{y:20,opacity:.2},{y:0,opacity:1,duration:.7,stagger:.08,clearProps:'transform,opacity'});});
 function setScreen(on){telon=on;document.body.classList.toggle('telon',on);$('screen-mode').setAttribute('aria-pressed',String(on));$('screen-mode').textContent=on?'Sair do telão':'Modo telão';}
 $('screen-mode').addEventListener('click',async()=>{setScreen(!telon);try{if(telon&&!document.fullscreenElement)await document.documentElement.requestFullscreen();else if(!telon&&document.fullscreenElement)await document.exitFullscreen();}catch{/* A apresentação ampliada continua disponível sem a API de tela cheia. */}});
 document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)setScreen(false)});
 function wrap(ctx,text,x,y,width,lineHeight){let line='',at=y;for(const word of text.split(' ')){const next=line?line+' '+word:word;if(ctx.measureText(next).width>width&&line){ctx.fillText(line,x,at);at+=lineHeight;line=word}else line=next}if(line)ctx.fillText(line,x,at);return at;}
 function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
 $('download-card').addEventListener('click',async()=>{if(!result)return;const data={...result};$('download-card').disabled=true;$('card-status').textContent='Preparando seu cartão de conquista…';try{
   const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=900;const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas indisponível');
   const bg=ctx.createLinearGradient(0,0,1600,900);bg.addColorStop(0,'#111a3b');bg.addColorStop(1,'#252443');ctx.fillStyle=bg;ctx.fillRect(0,0,1600,900);ctx.strokeStyle='#f7d98333';ctx.lineWidth=2;ctx.strokeRect(35,35,1530,830);
   const glow=ctx.createRadialGradient(1300,250,0,1300,250,550);glow.addColorStop(0,'#f7d98322');glow.addColorStop(1,'#f7d98300');ctx.fillStyle=glow;ctx.fillRect(0,0,1600,900);
   ctx.fillStyle='#f7d983';ctx.font='700 23px Segoe UI, Arial';ctx.fillText('SHOW DA FREQUÊNCIA',85,105);ctx.fillStyle='#a5b4d4';ctx.font='18px Segoe UI, Arial';ctx.fillText(data.validationMode?'HELP PONTO · PRÉVIA DE VALIDAÇÃO':'HELP PONTO · LEONOR APRESENTA',85,140);
   ctx.fillStyle='#eff1ff';ctx.font='700 52px Segoe UI, Arial';ctx.fillText(data.reason==='won'?'O milhão é seu!':'Minha conquista no palco.',85,252);
   let size=42;ctx.font=`600 ${size}px Segoe UI, Arial`;while(ctx.measureText(data.player).width>1000&&size>26){size--;ctx.font=`600 ${size}px Segoe UI, Arial`;}ctx.fillStyle='#b7c5db';ctx.fillText(data.player,85,325);
   ctx.fillStyle='#f7d983';ctx.font='800 125px Segoe UI, Arial';ctx.fillText(data.amount.toLocaleString('pt-BR'),80,493);ctx.font='700 19px Segoe UI, Arial';ctx.fillText('PONTOS FICTÍCIOS',85,536);
   ctx.fillStyle='#ffffff09';roundRect(ctx,85,585,1050,105,15);ctx.fillStyle='#f0efff';ctx.font='600 26px Segoe UI, Arial';ctx.fillText(`${data.correct}/10 acertos`,115,632);ctx.fillText(`${data.helps}/4 ajudas utilizadas`,470,632);ctx.fillStyle='#a6b6d5';ctx.font='18px Segoe UI, Arial';ctx.fillText('Conhecimento para levar à prática.',115,665);
   ctx.fillStyle='#f7d983';ctx.save();ctx.translate(1260,360);ctx.beginPath();ctx.moveTo(-95,-45);ctx.lineTo(-48,0);ctx.lineTo(0,-80);ctx.lineTo(48,0);ctx.lineTo(95,-45);ctx.lineTo(75,70);ctx.lineTo(-75,70);ctx.closePath();ctx.fill();ctx.fillRect(-75,82,150,15);ctx.restore();
   ctx.fillStyle='#d7d6e5';ctx.font='20px Segoe UI, Arial';wrap(ctx,'Uma lembrança da sua participação no jogo educativo. Pontos sem valor em dinheiro. Este cartão não representa certificação do curso.',85,765,1360,30);
   const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('Falha no PNG')),'image/png'));const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Minha_conquista_Help_Ponto.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);$('card-status').textContent='Seu cartão foi gerado em PNG. Confira os downloads do navegador.';
  }catch{$('card-status').textContent='Não foi possível gerar o cartão neste navegador. Você ainda pode copiar seu resultado.';}finally{$('download-card').disabled=false;}
 });
})();
