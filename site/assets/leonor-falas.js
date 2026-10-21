/* Falas da apresentadora: independentes da alternativa correta. */
(()=>{'use strict';const bags=new Map();
 const lines={
 opening:['O palco acendeu! Hoje o milhão é de conhecimento. Vamos começar?','Bem-vindo! Aqui a gente confere os detalhes antes de apertar o botão.','Leonor na área! Separe a atenção, porque o caso já vai entrar em cena.','Pode chegar! A única fila de hoje é a de perguntas rumo ao milhão.'],
 question:['Mais um caso na mesa. Qual detalhe faz a diferença?','Vamos ver quem está acompanhando a frequência e quem está só acompanhando a música!','A resposta está no caso. Leia sem pressa que eu seguro o suspense.','Agora quero ver esse olhar de chefia funcionando!','Essa parece tranquila… mas confira as condições antes de decidir.','Concentração no palco. O detalhe pequeno pode mudar o lançamento.','Se o código falasse, ele pediria: confira o vínculo primeiro!','O coração acelera, mas a conferência continua com calma.'],
 selection:['Você tem certeza disso? Ainda dá tempo de conferir.','Confiança bonita! Ela veio com leitura completa do caso?','É sua decisão… ou foi o botão que piscou mais bonito? Pode revisar!','Vai sustentar essa resposta? Eu espero você conferir.','O mouse escolheu. Agora quero saber se o raciocínio concorda.','Olha a responsabilidade desse clique! Ainda pode trocar.','Respira. Uma alternativa convincente também precisa combinar com o caso.','A bancada está olhando… mas quem decide é você!'],
 confirm:['Resposta na mesa. Vamos ver!','Agora é com o palco…','Confirmou. Respira comigo!','Silêncio na bancada… valendo!','O suspense entrou em serviço.','Vamos descobrir!'],
 correct:['Resposta certa! Esse clique veio com fundamento!','Boa! O conhecimento passou na conferência.','É isso! Pode comemorar sem abrir chamado!','Acertou! A Leonor gosta de ver esse cuidado com os detalhes.','Mais um degrau! Quem está só assistindo já pode aplaudir.','Olha só! Hoje o raciocínio veio de crachá e tudo.','Certa! Esse lançamento veio redondinho.','Muito bem! Confiança e atenção fizeram uma boa dupla.'],
 wrong:['Não foi dessa vez. Vamos entender o detalhe e voltar mais fortes.','A alternativa convenceu, mas o caso tinha outro caminho. Confira a explicação.','O palco fecha esta rodada, mas o aprendizado continua. Bora conferir?','Essa pegou a gente! A explicação mostra onde estava a diferença.'],
 protected:['Resposta certa e patamar protegido! Essa conquista já tem lugar garantido.','Pode respirar: patamar conquistado! Agora é atenção no próximo degrau.','Acertou e protegeu os pontos! Aplausos para essa conferência!'],
 million:['Um milhão! Pode comemorar: dez decisões levaram você até aqui!','É UM MILHÃO! O palco é seu e a bancada está de pé!','Dez acertos! Esse milhão veio de atenção, raciocínio e conhecimento!'],
 finalQuestion:['Chegamos ao milhão. A música faz suspense, mas quem decide é você.','Uma pergunta para o milhão. Leia cada detalhe: seu conhecimento trouxe você até aqui.','O palco inteiro está olhando. Um milhão de pontos, uma decisão com calma.'],
 half:['Duas saíram de cena. Agora é você, o caso e duas possibilidades.','Enxugamos a lista! Só não vale enxugar a leitura do caso.','Metade das alternativas foi passear. As outras duas esperam sua decisão.'],
 bench:['Marcelo, Lia e Kalil, chegou a hora! Palpite não é gabarito, combinado?','Vou chamar a bancada. Três cabeças ajudam… mas o clique continua seu!','Bancada, sem reunião de duas horas! Qual é o palpite de vocês?'],
 hint:['Uma pista para destravar o raciocínio. A decisão continua com você.','Leonor trouxe uma dica! Não é milagre, é atenção ao detalhe.','Vamos iluminar uma parte do caso? Confira a dica abaixo.']};
 function pick(key){let bag=bags.get(key);if(!bag?.length){bag=ShowDraw.shuffle(lines[key]);bags.set(key,bag);}return bag.pop();}
 function speakLine(text){document.getElementById('host-line').textContent=text;}
 document.addEventListener('show:question',e=>{speakLine(pick(e.detail.level===9?'finalQuestion':e.detail.level===0?'opening':'question'));});
 document.addEventListener('show:selection',()=>speakLine(pick('selection')));
 document.addEventListener('show:confirm',()=>speakLine(pick('confirm')));
 document.addEventListener('show:answer',e=>speakLine(pick(!e.detail.hit?'wrong':e.detail.level===9?'million':[2,5].includes(e.detail.level)?'protected':'correct')));
 document.addEventListener('show:half',()=>{speakLine(pick('half'));window.LeonorVoice?.readLine();});
 document.addEventListener('show:university',()=>{speakLine(pick('bench'));window.LeonorVoice?.readLine();});
 document.getElementById('help-leonor').addEventListener('click',()=>{speakLine(pick('hint'));window.LeonorVoice?.readLine(document.getElementById('host-line').textContent+' '+document.getElementById('show-hint').textContent);});
})();
