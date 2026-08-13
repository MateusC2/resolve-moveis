const suppliers = [
  "A.D. MAIA INDUS","ABPEREIRA-ATUAL","AMERICANFLEX IN","ARAMOVEIS INDUS","ARAPLAC INDUSTR","ARTELY","ASCENSUS TRADIN","BECHARA","BOX TECNOLOGIA","CAEMMUN INDUSTR","CIPLAFE COMERCI","COMERCIO, INDUS","CONQUISTA INDUS","DDS INDUSTRIA E","DEMOBILE - INDU","DJ INDUSTRIA E","D'JUAN COLCHOES","DOBUE MOVELARIA","EDN MOVEIS INDU","ESTOF. HELLEN","ESTOFADOS LADD","FALCON","FIBRASCA QUIMIC","FLEXFORMA ESTOF","GAZIN INDUSTRIA","GNX INDUSTRIA E","GRALHA AZUL","GRUPO K1 S A","IND E COM DE CO","INDUSTRIA BRASI","INDUSTRIA DE MO","INDUSTRIA E COM","INOVE ANJOS","INTERNACIONAL F","ITATIAIA ELETRO","LINOFORTE MOVEI","LUCIANE INDUSTR","LUIZZI INDUSTRI","M. E. GONCALVES","MADEMARQUES MOV","MASTER COMFORT","MATRIX - INDUST","MOVEIS JAMES","MOVEIS LANZA EI","MOVEIS SAO CARL","NORDESTE FLEX I","OLIVAR MOVEIS L","OLIVINA","OTELLO","ORYON INDUSTRIA","PLUMATEX COLCHO","POLIMAN INDUSTR","POLITORNO MOVEI","PROVINCIA","RECONFLEX INDUS","ROMPINELI","SANTOS ANDIRA I","SIMBAL SP INDUS","SMP - INDUSTRIA","SOLAR MOVEIS LT","SOMOPAR-SOCIEDA","SONETTO MOVEIS","SONY BRASIL LTD","TELASUL INDUSTR","TRAMONTINA DELT","TUCANOS DISTRIB","UMAFLEX","UMAFLEX INDUSTR","V. E. F. DE BRI","VALDEMOVEIS IND","VIERO MOVEIS IN","V-JOY INDUSTRIA","W L DA SILVA PE","ZISSOU"
];
const exclusiveTerms = ["ASCENSUS","AC COMERCIAL","AC COMERCI","NELL","OTELLO","BRINOX"];
const issueMap = {
  colchao:[['afundamento','Afundamento','Produto cedeu ou deformou'],['barulho','Barulho ao usar','Ruídos, estalos ou rangidos'],['mola','Mola fazendo barulho','Ruído identificado nas molas'],['quebrada','Chegou quebrado','Dano percebido no recebimento'],['outro','Outro relato','Situação não listada']],
  estofado:[['afundamento','Afundamento','Assento ou encosto cedeu'],['barulho','Barulho ao usar','Ruídos, estalos ou rangidos'],['mola','Mola fazendo barulho','Ruído identificado nas molas'],['peca','Faltou ou quebrou uma peça','Componente isolado'],['outro','Outro relato','Situação não listada']],
  madeira:[['montagem','Não deu montagem','Peças não encaixam ou montagem inviável'],['estrutural','Faltou peça estrutural','Componente essencial ausente'],['mofo','Mofo em compra recente','Ocorrência próxima à entrega'],['mais50','Mais de 50% das peças quebradas','Dano predominante no produto'],['peca','Faltou ou quebrou uma peça','Componente isolado'],['outro','Outro relato','Situação não listada']],
  outro:[['peca','Faltou uma peça','Componente não enviado'],['quebrada','Uma peça quebrou/chegou quebrada','Dano isolado'],['mais50','Mais de 50% quebrado','Dano predominante'],['outro','Outro relato','Situação não listada']]
};
const state={step:1,supplier:'',product:'',issue:''};
const labels={colchao:'Colchão',estofado:'Estofado',madeira:'Móvel de madeira',outro:'Outro móvel'};
const input=document.querySelector('#supplierInput'), results=document.querySelector('#supplierResults');
const todayElement=document.querySelector('#today');
if(todayElement) todayElement.textContent=new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric'}).format(new Date()).replace('.','');

function normalize(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase()}
function showSuppliers(value=''){
  const q=normalize(value.trim()); if(!q){results.innerHTML='';return}
  const matches=suppliers.filter(s=>normalize(s).includes(q)).slice(0,8);
  if(exclusiveTerms.some(x=>x.includes(q)) && !matches.some(s=>normalize(s).includes(q))) matches.unshift(value.toUpperCase());
  results.innerHTML=matches.length?matches.map(s=>`<button type="button" data-supplier="${s}">${s}${isExclusive(s)?'<small style="margin-left:auto;color:#0878f9">Atendimento direto</small>':''}</button>`).join(''):'<button type="button" disabled>Nenhum fornecedor ativo encontrado</button>';
}
function isExclusive(s){return exclusiveTerms.some(x=>normalize(s).includes(x))}
input.addEventListener('input',e=>showSuppliers(e.target.value));
results.addEventListener('click',e=>{const btn=e.target.closest('[data-supplier]');if(!btn)return;state.supplier=btn.dataset.supplier;input.value='';results.innerHTML='';const box=document.querySelector('#selectedSupplier');box.classList.remove('hidden');box.innerHTML=`<span>✓ <strong>${state.supplier}</strong> selecionado</span>${isExclusive(state.supplier)?'<b>Atendimento Magalu</b>':''}`;document.querySelector('[data-panel="1"] [data-next]').disabled=false});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();goTo(1);input.focus()}});

document.querySelectorAll('[data-product]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-product]').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected');state.product=btn.dataset.product;document.querySelector('[data-panel="2"] [data-next]').disabled=false}));
function renderIssues(){document.querySelector('#issueChoices').innerHTML=issueMap[state.product].map(([id,title,desc])=>`<button type="button" class="choice" data-issue="${id}"><strong>${title}</strong><small>${desc}</small></button>`).join('')}
document.querySelector('#issueChoices').addEventListener('click',e=>{const btn=e.target.closest('[data-issue]');if(!btn)return;document.querySelectorAll('[data-issue]').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected');state.issue=btn.dataset.issue;document.querySelector('[data-panel="3"] [data-next]').disabled=false});

function getDecision(){
  const exchange=['afundamento','barulho','mola','montagem','estrutural','mofo','mais50'].includes(state.issue);
  const parts=['peca','quebrada'].includes(state.issue);
  if(exchange)return{type:'exchange',icon:'↔',title:'Realizar troca do produto',tag:'TRATATIVA · TROCA',desc:'O cenário está coberto pela tratativa direta do pós-venda. Não direcione ao fabricante.',script:'Entendi o que aconteceu. Neste caso, nós mesmos vamos conduzir a solução por aqui, sem necessidade de você entrar em contato com o fabricante. Vou seguir com a tratativa de troca do produto.',action:'Troca do produto',macro:'Aplicar fluxo de troca conforme política vigente'};
  if(parts)return{type:'parts',icon:'✓',title:'Solicitar envio de peça',tag:'TRATATIVA · PEÇAS',desc:'Atenda diretamente com o envio da peça necessária. Não direcione ao fabricante.',script:'Entendi. Como o problema está em uma peça específica, vamos solicitar essa peça para resolver a situação sem que você precise procurar o fabricante.',action:'Pedido de peça',macro:'BKO > peças'};
  return{type:'review',icon:'?',title:'Analisar o caso antes de direcionar',tag:'TRATATIVA · ANÁLISE',desc:'O relato não está entre os cenários automáticos. Consulte a política vigente e não descarte por conter a palavra “quebrou”.',script:'Vou analisar os detalhes do seu caso para indicar a solução correta. Você não precisa acionar o fabricante neste momento; vou verificar a tratativa disponível por aqui.',action:'Análise conforme política vigente',macro:'Validar fluxo com apoio operacional'};
}
function renderResult(){const d=getDecision();const issue=issueMap[state.product].find(x=>x[0]===state.issue)?.[1];const exclusive=isExclusive(state.supplier);document.querySelector('#resultCard').className=`result-card ${d.type}`;document.querySelector('#resultCard').innerHTML=`<div class="result-icon">${d.icon}</div><div><h2>${d.title}</h2><p>${d.desc}</p></div><span class="tag">${d.tag}</span>`;document.querySelector('#customerScript').textContent=d.script;document.querySelector('#zendeskNote').value=`TRIAGEM DE MÓVEL\nFornecedor: ${state.supplier}\nProduto: ${labels[state.product]}\nRelato: ${issue}\nTratativa: ${d.action}\nMacro/fluxo: ${d.macro}\nAtendimento direto Magalu: ${exclusive?'Sim — marca exclusiva':'Sim — categoria móveis em garantia'}\nOrientação ao cliente: não acionar fabricante.`}
function goTo(n){if(n===3)renderIssues();if(n===4)renderResult();state.step=n;document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',+p.dataset.panel===n));document.querySelectorAll('.step').forEach(s=>{const x=+s.dataset.step;s.classList.toggle('active',x===n);s.classList.toggle('done',x<n)});document.querySelector('.workspace').scrollIntoView({behavior:'smooth',block:'start'})}
document.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>goTo(state.step+1)));document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',()=>goTo(state.step-1)));
document.querySelectorAll('.step').forEach(b=>b.addEventListener('click',()=>{const n=+b.dataset.step;if(n<=state.step||n===2&&state.supplier||n===3&&state.product||n===4&&state.issue)goTo(n)}));
function toast(){const t=document.querySelector('#toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
async function copy(text){try{await navigator.clipboard.writeText(text)}catch{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}toast()}
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>{const el=document.querySelector(`#${b.dataset.copy}`);copy(el.value||el.textContent)}));
document.querySelector('#copyAll').addEventListener('click',()=>copy(`${document.querySelector('#customerScript').textContent}\n\n${document.querySelector('#zendeskNote').value}`));
document.querySelector('#restart').addEventListener('click',()=>{state.step=1;state.supplier=state.product=state.issue='';document.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));document.querySelectorAll('[data-next]').forEach(x=>x.disabled=true);document.querySelector('#selectedSupplier').classList.add('hidden');input.value='';goTo(1);input.focus()});

// Movimento progressivo: a página permanece funcional mesmo sem animações/JS moderno.
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.documentElement.classList.add('motion-ready');
  const revealItems=document.querySelectorAll('.quick-guide .guide-title,.guide-cards article,footer');
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:.14,rootMargin:'0px 0px -35px'});
  revealItems.forEach(item=>revealObserver.observe(item));
}

const deliveryTruck=document.querySelector('.delivery-truck');
if(deliveryTruck){
  let truckRepairTimer;
  let boxSpawnTimer;
  let lastTruckX=null;
  let truckDirection=0;
  let lastDriverPhrase=-1;
  const deliveryBoxes=document.querySelector('.delivery-boxes');
  const driverSpeech=deliveryTruck.querySelector('.driver-speech b');
  const driverPhrases=[
    'Ih, de novo não!',
    'Logo agora?!',
    'Esse buraco não estava aí!',
    'Minha entrega vai atrasar!',
    'Alguém chama o mecânico!',
    'Eu sabia que ouvi um barulho...',
    'Calma, eu conserto!',
    'Hoje não é meu dia!'
  ];

  function clearDeliveryBoxes(){
    deliveryBoxes.querySelectorAll('i').forEach(box=>{
      box.classList.add('leaving');
      setTimeout(()=>box.remove(),420);
    });
  }

  function scheduleBoxSpawn(){
    clearTimeout(boxSpawnTimer);
    // Intervalos variados criam pausas naturais entre uma entrega e outra.
    boxSpawnTimer=setTimeout(()=>{
      if(!deliveryTruck.classList.contains('crashed')){
        const trackRect=deliveryBoxes.getBoundingClientRect();
        const truckRect=deliveryTruck.getBoundingClientRect();
        const currentX=truckRect.left+truckRect.width/2-trackRect.left;
        if(lastTruckX!==null){
          const nextDirection=Math.sign(currentX-lastTruckX);
          if(truckDirection&&nextDirection&&nextDirection!==truckDirection)clearDeliveryBoxes();
          if(nextDirection)truckDirection=nextDirection;
        }
        lastTruckX=currentX;
        const box=document.createElement('i');
        box.style.left=`${Math.max(10,Math.min(trackRect.width-28,currentX-9))}px`;
        deliveryBoxes.appendChild(box);
        requestAnimationFrame(()=>box.classList.add('landed'));
      }
      scheduleBoxSpawn();
    },900+Math.random()*1900);
  }

  scheduleBoxSpawn();
  deliveryTruck.addEventListener('click',()=>{
    if(deliveryTruck.classList.contains('crashed'))return;
    let phraseIndex;
    do phraseIndex=Math.floor(Math.random()*driverPhrases.length);
    while(phraseIndex===lastDriverPhrase&&driverPhrases.length>1);
    lastDriverPhrase=phraseIndex;
    driverSpeech.textContent=driverPhrases[phraseIndex];
    const truckMatrix=new DOMMatrixReadOnly(getComputedStyle(deliveryTruck).transform);
    deliveryTruck.classList.toggle('facing-left',truckMatrix.a<0);
    deliveryTruck.classList.add('crashed');
    clearDeliveryBoxes();
    deliveryTruck.setAttribute('aria-label','Caminhão parado para conserto');
    clearTimeout(truckRepairTimer);
    truckRepairTimer=setTimeout(()=>{
      deliveryTruck.classList.remove('crashed');
      deliveryTruck.classList.remove('facing-left');
      lastTruckX=null;
      deliveryTruck.setAttribute('aria-label','Caminhão de entregas — clique para interagir');
    },3200);
  });
}

const contactCard=document.querySelector('.contact-card');
const hero=document.querySelector('.hero');
if(contactCard&&hero){
  let dragState=null;

  contactCard.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    const cardRect=contactCard.getBoundingClientRect();
    const heroRect=hero.getBoundingClientRect();
    dragState={
      pointerId:event.pointerId,
      offsetX:event.clientX-cardRect.left,
      offsetY:event.clientY-cardRect.top,
      heroRect
    };
    contactCard.setPointerCapture(event.pointerId);
    contactCard.classList.add('dragging');
    event.preventDefault();
  });

  contactCard.addEventListener('pointermove',event=>{
    if(!dragState||event.pointerId!==dragState.pointerId)return;
    const cardRect=contactCard.getBoundingClientRect();
    const maxX=dragState.heroRect.width-cardRect.width;
    const maxY=dragState.heroRect.height-cardRect.height;
    const x=Math.max(0,Math.min(maxX,event.clientX-dragState.heroRect.left-dragState.offsetX));
    const y=Math.max(0,Math.min(maxY,event.clientY-dragState.heroRect.top-dragState.offsetY));
    if(contactCard.parentElement!==hero)hero.appendChild(contactCard);
    contactCard.style.position='absolute';
    contactCard.style.left=`${x}px`;
    contactCard.style.top=`${y}px`;
    contactCard.style.margin='0';
  });

  function finishCardDrag(event){
    if(!dragState||event.pointerId!==dragState.pointerId)return;
    contactCard.releasePointerCapture(event.pointerId);
    contactCard.classList.remove('dragging');
    const heroVisual=document.querySelector('.hero-visual');
    const heroRect=hero.getBoundingClientRect();
    const visualRect=heroVisual.getBoundingClientRect();
    const cardRect=contactCard.getBoundingClientRect();
    const targetX=visualRect.left-heroRect.left+(visualRect.width-cardRect.width)/2;
    const targetY=visualRect.top-heroRect.top+(visualRect.height-cardRect.height)/2;
    contactCard.classList.add('returning-home');
    contactCard.style.left=`${targetX}px`;
    contactCard.style.top=`${targetY}px`;
    setTimeout(()=>{
      heroVisual.appendChild(contactCard);
      contactCard.removeAttribute('style');
      contactCard.classList.remove('returning-home');
    },520);
    dragState=null;
  }
  contactCard.addEventListener('pointerup',finishCardDrag);
  contactCard.addEventListener('pointercancel',finishCardDrag);
}

const magaluLetterLogo=document.querySelector('.magalu-letter-logo');
if(magaluLetterLogo){
  const logoLetters=[...magaluLetterLogo.querySelectorAll('.logo-letters i')];
  let visibleLogoLetters=logoLetters.length;

  function interactWithLogo(){
    if(visibleLogoLetters>1){
      const letter=logoLetters[visibleLogoLetters-1];
      letter.classList.add('falling');
      visibleLogoLetters--;
      magaluLetterLogo.setAttribute('aria-label',visibleLogoLetters===1?'Uma letra restante. Clique para remontar a logo.':'Logo Magalu interativa. Clique para derrubar outra letra.');
      return;
    }
    logoLetters.forEach((letter,index)=>{
      letter.classList.remove('falling');
      letter.style.setProperty('--return-delay',`${index*55}ms`);
      letter.classList.add('returning');
      setTimeout(()=>letter.classList.remove('returning'),650+index*55);
    });
    visibleLogoLetters=logoLetters.length;
    magaluLetterLogo.setAttribute('aria-label','Logo Magalu remontada. Clique para derrubar uma letra.');
  }

  magaluLetterLogo.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();
    interactWithLogo();
  });
  magaluLetterLogo.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){event.preventDefault();interactWithLogo()}
  });
}

const particleCanvas=document.querySelector('.hero-particles');
if(particleCanvas&&hero&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const particleContext=particleCanvas.getContext('2d');
  let particles=[];
  let particleWaves=[];
  let particleFrame;
  let particleLastTime=performance.now();

  function resizeParticles(){
    const rect=hero.getBoundingClientRect();
    const ratio=Math.min(window.devicePixelRatio||1,2);
    particleCanvas.width=Math.round(rect.width*ratio);
    particleCanvas.height=Math.round(rect.height*ratio);
    particleCanvas.style.width=`${rect.width}px`;
    particleCanvas.style.height=`${rect.height}px`;
    particleContext.setTransform(ratio,0,0,ratio,0,0);
    particles=[];
    const gap=70;
    for(let y=38;y<rect.height;y+=gap){
      for(let x=55;x<rect.width;x+=gap){
        const offset=(Math.floor(y/gap)%2)*9;
        particles.push({homeX:x+offset,homeY:y,x:x+offset,y,vx:0,vy:0,r:4+Math.random()*4,phase:Math.random()*Math.PI*2});
      }
    }
  }

  function animateParticles(now){
    const dt=Math.min((now-particleLastTime)/16.67,2);
    particleLastTime=now;
    particleContext.clearRect(0,0,particleCanvas.clientWidth,particleCanvas.clientHeight);
    particleWaves.forEach(wave=>{wave.radius+=7*dt;wave.life-=.022*dt});
    particleWaves=particleWaves.filter(wave=>wave.life>0);
    particles.forEach(particle=>{
      particleWaves.forEach(wave=>{
        const dx=particle.x-wave.x,dy=particle.y-wave.y;
        const distance=Math.hypot(dx,dy)||1;
        const edgeDistance=Math.abs(distance-wave.radius);
        if(edgeDistance<75){
          const force=(1-edgeDistance/75)*wave.life*1.15;
          particle.vx+=dx/distance*force;
          particle.vy+=dy/distance*force;
        }
      });
      particle.vx+=(particle.homeX-particle.x)*.018*dt;
      particle.vy+=(particle.homeY-particle.y)*.018*dt;
      particle.vx*=Math.pow(.91,dt);particle.vy*=Math.pow(.91,dt);
      particle.x+=particle.vx*dt;particle.y+=particle.vy*dt;
      const pulse=Math.sin(now*.0017+particle.phase)*.8;
      particleContext.beginPath();
      particleContext.arc(particle.x,particle.y,Math.max(2,particle.r+pulse),0,Math.PI*2);
      particleContext.fillStyle='rgba(255,255,255,.14)';
      particleContext.fill();
    });
    particleWaves.forEach(wave=>{
      particleContext.beginPath();particleContext.arc(wave.x,wave.y,wave.radius,0,Math.PI*2);
      particleContext.strokeStyle=`rgba(255,255,255,${wave.life*.18})`;particleContext.lineWidth=2;particleContext.stroke();
    });
    particleFrame=requestAnimationFrame(animateParticles);
  }

  hero.addEventListener('pointerdown',event=>{
    if(event.target.closest('button,a,input,textarea,.contact-card'))return;
    const rect=hero.getBoundingClientRect();
    particleWaves.push({x:event.clientX-rect.left,y:event.clientY-rect.top,radius:0,life:1});
  });
  new ResizeObserver(resizeParticles).observe(hero);
  resizeParticles();
  particleFrame=requestAnimationFrame(animateParticles);
  window.addEventListener('pagehide',()=>cancelAnimationFrame(particleFrame),{once:true});
}
