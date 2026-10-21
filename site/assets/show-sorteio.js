/* Sorteio por baralho: usa todos os elegíveis antes de repetir entre partidas. */
window.ShowDraw = (()=>{
 const memory=new Map();
 function randomInt(max){if(max<=1)return 0;if(globalThis.crypto?.getRandomValues){const a=new Uint32Array(1),limit=Math.floor(4294967296/max)*max;do{crypto.getRandomValues(a)}while(a[0]>=limit);return a[0]%max;}return Math.floor(Math.random()*max);}
 function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=randomInt(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
 function load(key){try{const raw=localStorage.getItem(key);if(!raw)return memory.get(key)||{};const value=JSON.parse(raw);return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}catch{return memory.get(key)||{}}}
 function save(key,value){memory.set(key,value);try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
 function create({validation=false,free=false}={}){
  const bank=validation?[...SHOW_QUESTIONS,...PROPOSED_QUESTIONS]:[...SHOW_QUESTIONS];
  const key=`help-ponto-show-decks-v3-${validation?'draft':'normal'}-${free?'free':'tiers'}`;
  const state=load(key),sessionIds=new Set(),recentCategories=[];
  return {next(tier){const group=free?'all':String(tier),eligible=bank.filter(q=>(free||q.tier===tier)&&!sessionIds.has(q.id));if(!eligible.length)return null;
   const allIds=new Set(bank.filter(q=>free||q.tier===tier).map(q=>q.id));let deck=Array.isArray(state[group])?[...new Set(state[group].filter(id=>allIds.has(id)))]:[];
   if(!deck.some(id=>eligible.some(q=>q.id===id)))deck=shuffle(eligible.map(q=>q.id));
   const eligibleIds=new Set(eligible.map(q=>q.id));const positions=deck.map((id,i)=>({q:eligible.find(q=>q.id===id),i})).filter(item=>item.q&&eligibleIds.has(item.q.id));
   const different=positions.filter(item=>!recentCategories.slice(-2).includes(item.q.category));const candidates=different.length?different:positions;
   // Reembaralha também a escolha entre assuntos disponíveis; não usa sequência fixa.
   const selected=candidates[randomInt(candidates.length)],q=selected.q;deck.splice(selected.i,1);state[group]=deck;save(key,state);sessionIds.add(q.id);recentCategories.push(q.category);return q;
  },validation,free,bankSize:bank.length};
 }
 return {create,shuffle};
})();
