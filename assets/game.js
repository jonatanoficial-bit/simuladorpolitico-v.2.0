const $  = (q)=>document.querySelector(q);
const $$ = (q)=>document.querySelectorAll(q);

/* telas & fade */
const screens = {}; let fadeEl;
function show(id){ Object.values(screens).forEach(s=>s && s.classList.remove("show")); if(screens[id]) screens[id].classList.add("show"); }
function fadeTo(id){ if(!fadeEl) return show(id); fadeEl.classList.remove("hidden"); fadeEl.classList.add("show"); setTimeout(()=>{ show(id); setTimeout(()=>{ fadeEl.classList.remove("show"); setTimeout(()=>fadeEl.classList.add("hidden"),280); },60); },220); }

/* dados fixos */
const parties=[
  {sigla:"PTM", nome:"Partido do Trabalhador Moderno", logo:"simulador_images/party_ptm.png",  forca:70},
  {sigla:"PSLB",nome:"Partido Social Liberal do Brasil",logo:"simulador_images/party_pslb.png", forca:65},
  {sigla:"MDBR",nome:"Movimento Democrático Brasileiro Real",logo:"simulador_images/party_mdbr.png",forca:60},
  {sigla:"PVG", nome:"Partido Verde Global",logo:"simulador_images/party_pvg.png",forca:55},
  {sigla:"PRP", nome:"Partido Republicano Popular",logo:"simulador_images/party_prp.png",forca:62},
];
const states=["Acre","Alagoas","Amapá","Amazonas","Bahia","Ceará","Distrito Federal","Espírito Santo","Goiás","Maranhão","Mato Grosso","Mato Grosso do Sul","Minas Gerais","Pará","Paraíba","Paraná","Pernambuco","Piauí","Rio de Janeiro","Rio Grande do Norte","Rio Grande do Sul","Rondônia","Roraima","Santa Catarina","São Paulo","Sergipe","Tocantins"];
const offices=[
  {name:"Vereador",type:"legislative",bg:"simulador_images/municipal.jpg"},
  {name:"Prefeito",type:"executive",bg:"simulador_images/cityhall.jpg"},
  {name:"Deputado Estadual",type:"legislative",bg:"simulador_images/assembly.jpg"},
  {name:"Prefeito",type:"executive",bg:"simulador_images/cityhall.jpg"},
  {name:"Governador",type:"executive",bg:"simulador_images/governor.jpg"},
  {name:"Deputado Federal",type:"legislative",bg:"simulador_images/federal.jpg"},
  {name:"Senador",type:"legislative",bg:"simulador_images/senate.jpg"},
  {name:"Presidente",type:"executive",bg:"simulador_images/president.jpg"},
];

/* estado */
const storeKey="simPoliticoDeluxe_ELEICAO";
let G={partyIdx:0,state:null,city:"",officeIdx:0,termTurn:1,approvals:0,popPeople:50,popMedia:50,popParty:50,feed:[], campaignLockMsg:""};

/* helpers */
const clamp=v=>Math.max(0,Math.min(100,Math.round(v)));
const randomRange=(a,b)=>a+Math.random()*(b-a);
const randomBool=p=>Math.random()<p;

function addFeed(tag,text){ G.feed.unshift({tag,text}); if(G.feed.length>40) G.feed.pop(); renderFeed(); }
function renderFeed(){ const f=$("#feed"); if(!f) return; f.innerHTML=G.feed.map(i=>`<div class="feed-item"><div class="feed-tag">${i.tag}</div><div class="feed-body">${i.text}</div></div>`).join(""); }
function setMain(t,h){ $("#mainTitle").textContent=t; $("#mainText").innerHTML=h; }

/* HUD + HERO + botões habilitados */
function updateHUD(){
  const office=offices[G.officeIdx], party=parties[G.partyIdx];
  $("#hudOffice").textContent=office.name;
  $("#hudLocation").textContent=`${G.city} - ${G.state} • Mandato ${G.termTurn}`;
  const logo=$("#partyLogo"); if(party?.logo){logo.src=party.logo; logo.style.display="block";} else logo.style.display="none";
  const pct=Math.min(100,Math.round((G.approvals/15)*100));
  $("#txtProgress").textContent=pct+"%"; $("#barProgress").style.width=pct+"%";
  $("#popPeople").textContent=clamp(G.popPeople)+"%";
  $("#popMedia").textContent =clamp(G.popMedia) +"%";
  $("#popParty").textContent =clamp(G.popParty) +"%";

  /* fundo e HERO */
  $("#screenGame").style.backgroundImage=`linear-gradient(180deg,rgba(0,0,0,.65),rgba(0,0,0,.78)),url('${office.bg}')`;
  $("#hero").style.backgroundImage=`url('${office.bg}')`;

  updateActionStates();
}

function updateActionStates(){
  const office=offices[G.officeIdx];
  const crisisBtn=$("#btnAction3");
  if(office.type!=="executive"){
    crisisBtn.disabled=true; crisisBtn.classList.add("disabled");
    crisisBtn.title="Crises: apenas cargos executivos (Prefeito, Governador, Presidente).";
  }else{
    crisisBtn.disabled=false; crisisBtn.classList.remove("disabled"); crisisBtn.title="Gerir crises & políticas";
  }

  const campBtn=$("#btnAction4");
  const ok = canRunForNext();
  campBtn.disabled = !ok.ok;
  campBtn.title    = ok.ok ? "Concorrer ao próximo cargo" : ok.reason;
}

/* regras de mérito para disputar próximo cargo */
function canRunForNext(){
  // Mérito base: aprovações (leis/projetos aprovados) + popularidade
  // Travamento mínimo: 15 aprovações OU (executivo com ≥10 aprovações e ≥60% de povo)
  const execOnly = ["Prefeito","Governador","Presidente"].includes(offices[G.officeIdx].name);
  if(execOnly){
    if(G.approvals>=10 && clamp(G.popPeople)>=60) return {ok:true};
    return {ok:false, reason:"Requisito: 10 aprovações e ≥ 60% de popularidade para cargos executivos."};
  }else{
    if(G.approvals>=15) return {ok:true};
    return {ok:false, reason:"Requisito: 15 aprovações (leis/projetos) para subir de cargo."};
  }
}

/* modal */
let modal,modalTitle,modalBody,modalActions;
function setupModal(){
  modal=$("#modal"); modalTitle=$("#modalTitle"); modalBody=$("#modalBody"); modalActions=$("#modalActions");
  if(modal){ if(!modal.classList.contains("hidden")) modal.classList.add("hidden"); modal.addEventListener("click",e=>{ if(e.target===modal) closeModal(); }); }
}
function openModal(title,html,actions){
  if(!modal){ alert(html.replace(/<[^>]+>/g,"")); return; }
  modalTitle.innerHTML=title||""; modalBody.innerHTML=html||""; modalActions.innerHTML="";
  (actions||[]).forEach(a=>{ const b=document.createElement("button"); b.className="btn "+(a.className||""); b.textContent=a.label; b.onclick=()=>a.onClick&&a.onClick(); modalActions.appendChild(b); });
  modal.classList.remove("hidden");
}
function closeModal(){ if(modal) modal.classList.add("hidden"); }
function toast(txt){ openModal("Informação",txt,[{label:"OK",className:"btn-gold",onClick:closeModal}]); }

/* save/load/reset */
function saveGame(){ localStorage.setItem(storeKey,JSON.stringify(G)); addFeed("Save","Progresso salvo."); }
function loadGame(){ try{ const raw=localStorage.getItem(storeKey); if(!raw) return; G=Object.assign(G,JSON.parse(raw)||{}); }catch{} }
function resetGame(){ G={partyIdx:0,state:null,city:"",officeIdx:0,termTurn:1,approvals:0,popPeople:50,popMedia:50,popParty:50,feed:[]}; saveGame(); }

/* —————— Ações do jogo —————— */

/* Votação (legislativo) */
function actVoteProjects(){
  const projetos=["Reforma da frota de ônibus","Programa de segurança nos bairros","Requalificação de escolas públicas","Incentivo fiscal para pequenas empresas","Criação de parque urbano"];
  const p=projetos[Math.floor(Math.random()*projetos.length)];
  const total=30+Math.floor(Math.random()*40); const baseYes=0.4+Math.random()*0.3; const yes=Math.round(total*baseYes); const no=total-yes; const passa=yes>no;

  openModal("Votação em plenário",
    `Em pauta: <b>${p}</b>.<br><br>Placar parcial: <b>${yes}</b> SIM • <b>${no}</b> NÃO.<br><br>Como você deseja votar?`,
    [
      {label:"Votar SIM",className:"btn-gold",onClick:()=>{closeModal();resolveVote(true,passa,p);}},
      {label:"Votar NÃO",onClick:()=>{closeModal();resolveVote(false,passa,p);}},
    ]);
}

function resolveVote(vSim,passou,proj){
  let dP=0,dM=0,dPart=0;
  if(passou && vSim){ dP+=3; dM+=2; dPart+=2; G.approvals++; addFeed("Votação",`Você apoiou <b>${proj}</b>, aprovado.`); }
  else if(!passou && !vSim){ dP+=1; dM+=2; dPart+=1; addFeed("Votação",`Você votou contra <b>${proj}</b>, rejeitado.`); }
  else{ dP-=2; dM-=1; addFeed("Votação",`Sua posição em <b>${proj}</b> dividiu o eleitorado.`); }
  G.popPeople+=dP; G.popMedia+=dM; G.popParty+=dPart; G.termTurn+=1;
  updateHUD();
  setMain("Resultado",`Impactos:<br>Povo: ${(dP>=0?"+":"")+dP}% • Mídia: ${(dM>=0?"+":"")+dM}% • Partido: ${(dPart>=0?"+":"")+dPart}%`);
}

/* Projetos de autoria */
function actProposeLaw(){
  const ideias=["Wi-Fi público nas praças","Corredor exclusivo de ônibus","Hortas comunitárias","Valorização do magistério","Lei anti-desperdício de alimentos"];
  const p=ideias[Math.floor(Math.random()*ideias.length)];

  openModal("Propor novo projeto",`Protocolar projeto:<br><b>${p}</b><br><br>Enviar para tramitação?`,[
    {label:"Protocolar",className:"btn-gold",onClick:()=>{closeModal();
      const aprovado=randomBool(0.5+(G.popParty-50)/200);
      if(aprovado){G.approvals++; G.popPeople+=3; G.popMedia+=2; G.popParty+=2; addFeed("Projeto aprovado",`<b>${p}</b> virou lei.`); setMain("Projeto aprovado","Boa articulação.");}
      else{G.popPeople-=1; G.popMedia-=2; addFeed("Projeto rejeitado",`<b>${p}</b> arquivado nas comissões.`); setMain("Projeto rejeitado","Críticas à articulação.");}
      G.termTurn++; updateHUD();
    }},
    {label:"Cancelar",onClick:closeModal}
  ]);
}

/* Crises (somente executivos) */
function actCrisis(){
  const office=offices[G.officeIdx];
  if(office.type!=="executive"){ toast("Crises só existem para cargos executivos."); return; }

  const crises=[
    {area:"Saúde",     op:["Mutirão de consultas","Construir nova UPA","Repassar recursos"],  impact:[+3,+4,+2]},
    {area:"Segurança", op:["Aumentar policiamento","Iluminação pública","Guarda comunitária"], impact:[+3,+2,+2]},
    {area:"Economia",  op:["Reduzir impostos","Atrair empresas","Qualificação"],              impact:[+2,+3,+3]},
    {area:"Educação",  op:["Ajuste salarial docente","Reforma de escolas","Metas de IDEB"],   impact:[+3,+2,+3]},
  ];
  const c=crises[Math.floor(Math.random()*crises.length)];
  let body=`Crise em <b>${c.area}</b>.<br><br>Escolha uma ação:<br><br>`; c.op.forEach((o,i)=>body+=`<b>${i+1}.</b> ${o}<br>`);
  openModal("Gestão de crise",body,c.op.map((o,i)=>({label:o,className:i===0?"btn-gold":"",onClick:()=>{closeModal();
    let d=c.impact[i]; if(randomBool(0.25)) d-=2;
    G.popPeople+=d; G.popMedia+=(d>0?1:-1); G.popParty+=(d>=0?1:-2); G.termTurn++;
    addFeed("Crise",`Ação em <b>${c.area}</b>: ${o}.`); setMain("Gestão de crise",`Impacto popular: ${(d>=0?"+":"")+d}%`);
    updateHUD(); checkImpeachment();
  }})));
}

/* ——— NOVA ELEIÇÃO REALISTA ——— */
function actCampaign(){
  const chk = canRunForNext();
  if(!chk.ok){ toast(chk.reason); return; }
  const next=offices[Math.min(offices.length-1,G.officeIdx+1)];

  // 1) Escolhas do jogador
  const temas=["Segurança","Economia","Educação","Saúde","Combate à corrupção","Infraestrutura"];
  const planos=["Corte de gastos e eficiência","Investimento social e inclusão","Inovação e tecnologia","Desenvolvimento verde","Valorização do servidor público","Desburocratização total"];

  let temaSel=temas[0], planoSel=planos[0];

  openModal("Campanha eleitoral",
`Você deseja disputar <b>${next.name}</b>.</b><br><br>
<b>Escolha seu foco de campanha</b> e um <b>plano de governo</b> inicial (isso afeta a aceitação no estado/cidade atual).
<br><br>
<label>Tema central:</label>
<select id="selTema">${temas.map(t=>`<option>${t}</option>`).join("")}</select>
<br><br>
<label>Plano de governo:</label>
<select id="selPlano">${planos.map(p=>`<option>${p}</option>`).join("")}</select>
`,[
    {label:"Iniciar campanha",className:"btn-gold",onClick:()=>{ 
      temaSel = $("#selTema").value; planoSel = $("#selPlano").value; 
      closeModal(); runElection(next,temaSel,planoSel);
    }},
    {label:"Cancelar",onClick:closeModal}
  ]);
}

/* motor de eleição */
function runElection(nextOffice, temaSel, planoSel){
  // 2) Gerar adversários
  const advCount = 3;
  const names = ["Silva","Souza","Oliveira","Santos","Lima","Costa","Almeida","Ribeiro","Barbosa","Cardoso"];
  const adv = Array.from({length:advCount}).map(()=>({
    nome: `${["Ana","Bruno","Carla","Diego","Érica","Felipe","Gustavo","Helena","Ígor","Júlia"][Math.floor(Math.random()*10)]} ${names[Math.floor(Math.random()*names.length)]}`,
    partido: parties[Math.floor(Math.random()*parties.length)],
    base: randomRange(35,65),      // força pessoal
    dinheiro: randomRange(0,10),   // 0-10
    rejeicao: randomRange(10,30),  // 10-30
    temaForte: ["Segurança","Economia","Educação","Saúde"][Math.floor(Math.random()*4)]
  }));

  // 3) Base do jogador
  const party = parties[G.partyIdx];
  let forçaPartido = party.forca; // força nacional/estadual simplificada
  // Base do candidato = popularidade média ponderada + bônus de força partidária
  let baseJog = clamp(G.popPeople*0.6 + G.popMedia*0.2 + G.popParty*0.2 + (forçaPartido-50)*0.3);

  // 4) Eventos de campanha (5 “rodadas”)
  // Cada escolha altera baseJog e também dá variações nos adversários
  const eventos = [
    { titulo:"Debate na TV",      escolhas:[
      {t:"Atacar corrupção", dJ:+3, dAdvAll:-1},
      {t:"Propor soluções técnicas", dJ:+2, dAdvAll:0},
      {t:"Discurso emocional", dJ:+1, dAdvAll:+1},
    ]},
    { titulo:"Comício regional",  escolhas:[
      {t:"Foco em "+temaSel, dJ:+3, dAdvAll:0},
      {t:"Prometer benefícios locais", dJ:+2, dAdvAll:+1},
      {t:"Encontro com líderes religiosos", dJ:+1, dAdvAll:0},
    ]},
    { titulo:"Entrevista no rádio", escolhas:[
      {t:"Defender "+planoSel, dJ:+2, dAdvAll:0},
      {t:"Prometer redução de impostos", dJ:+2, dAdvAll:+1},
      {t:"Plano de segurança total", dJ:+2, dAdvAll:+1},
    ]},
    { titulo:"Passeata", escolhas:[
      {t:"Mobilizar voluntários", dJ:+2, dAdvAll:0},
      {t:"Distribuir material", dJ:+1, dAdvAll:+1},
      {t:"Carreata silenciosa", dJ:+0, dAdvAll:0},
    ]},
    { titulo:"Debate final", escolhas:[
      {t:"Propostas concretas", dJ:+3, dAdvAll:0},
      {t:"Fala inspiradora", dJ:+2, dAdvAll:+1},
      {t:"Confronto direto", dJ:+1, dAdvAll:-1},
    ]},
  ];

  let etapa = 0;
  function etapaCampanha(){
    const ev = eventos[etapa];
    openModal(`Campanha • ${ev.titulo}`,
      `Pesquisas atuais (estimadas):<br>
       <b>Você</b>: ${Math.round(baseJog)}%<br>
       ${adv.map(a=>`${a.nome} (${a.partido.sigla}): ${Math.round(a.base)}%`).join("<br>")}
       <br><br>Escolha sua postura:`,
      ev.escolhas.map((e,i)=>({label:e.t, className: i===0?"btn-gold":"", onClick:()=>{
        closeModal();
        baseJog += e.dJ;
        adv.forEach(a=> a.base += e.dAdvAll + (a.temaForte===temaSel? +1 : 0) + (Math.random()*2-1)); // ruído leve
        etapa++;
        if(etapa<eventos.length) etapaCampanha();
        else finalApuracao();
      }}))
    );
  }

  // 5) Apuração final
  function finalApuracao(){
    // efeito do plano/tema escolhido na opinião popular do estado
    const sinergiaTema = (["Segurança","Economia"].includes(temaSel)? +2 : 0);
    const sinergiaPlano = (planoSel.includes("verde")? +1 : (planoSel.includes("desburocrat")? +1 : 0));
    baseJog += sinergiaTema + sinergiaPlano + (forçaPartido-50)/20;

    // escândalo aleatório pequeno
    if(randomBool(0.1)){ baseJog -= 3; addFeed("Campanha","Boato negativo circulou nas redes."); }

    // normaliza votos
    let votos = [{nome:"Você",partido:party, val: baseJog}];
    adv.forEach(a=>{
      const bonusTema = (a.temaForte===temaSel? -1 : 0); // você rouba o tema dele :)
      const val = clamp(a.base + a.dinheiro + (a.partido.forca-50)/10 - a.rejeicao*0.1 + bonusTema);
      votos.push({nome:a.nome, partido:a.partido, val});
    });

    // transformar em percentuais
    const soma = votos.reduce((s,v)=>s+Math.max(1,v.val),0);
    votos = votos.map(v=>({ ...v, pct: Math.round((Math.max(1,v.val)/soma)*100) }));
    votos.sort((a,b)=>b.pct-a.pct);

    const ganhou = votos[0].nome==="Você";

    openModal("Resultado da eleição",
      `<div style="max-height:50vh;overflow:auto">
         <table style="width:100%;border-collapse:collapse">
           <tr><th style="text-align:left;padding:6px">Candidato</th><th style="text-align:right;padding:6px">Partido</th><th style="text-align:right;padding:6px">Votos</th></tr>
           ${votos.map(v=>`<tr>
               <td style="padding:6px">${v.nome}</td>
               <td style="padding:6px;text-align:right">${v.partido.sigla}</td>
               <td style="padding:6px;text-align:right"><b>${v.pct}%</b></td>
             </tr>`).join("")}
         </table>
       </div>
       <br>${ganhou? "<b>Vitória!</b> Você foi eleito "+nextOffice.name+"." : "<b>Derrota.</b> Faltaram votos desta vez."}
      `,
      ganhou?[
        {label:"Assumir cargo", className:"btn-gold", onClick:()=>{ closeModal(); assumeNextOffice(nextOffice); }},
      ]:[
        {label:"Aceitar e continuar", onClick:()=>{ 
          closeModal(); 
          G.popPeople = clamp(G.popPeople-5); 
          G.popMedia  = clamp(G.popMedia -3);
          setMain("Derrota eleitoral","Continue trabalhando e tente novamente.");
          updateHUD();
        }}
      ]
    );
  }

  etapaCampanha();
}

function assumeNextOffice(nextOffice){
  addFeed("Eleições",`Eleito <b>${nextOffice.name}</b>!`);
  G.officeIdx = offices.indexOf(nextOffice);
  G.termTurn  = 1;
  G.approvals = 0;
  G.popMedia  = clamp(G.popMedia+2);
  setMain("Posse",`Você assumiu <b>${nextOffice.name}</b>. Um novo ciclo começa.`);
  updateHUD();
  saveGame();
}

/* impeachment */
function checkImpeachment(){ if(clamp(G.popPeople)<=0){ addFeed("Crise máxima","Popularidade chegou a 0%. Impeachment!"); setMain("Impeachment","Você retorna ao início como Vereador."); resetGame(); updateHUD(); } }

/* setup */
function mountSetup(){
  const selParty=$("#selParty"), selState=$("#selState");
  selParty.innerHTML=""; parties.forEach((p,i)=>{ const o=document.createElement("option"); o.value=i; o.textContent=`${p.sigla} - ${p.nome}`; selParty.appendChild(o); });
  selState.innerHTML=""; states.forEach(s=>{ const o=document.createElement("option"); o.value=s; o.textContent=s; selState.appendChild(o); });
}
function beginMandate(){
  renderFeed(); updateHUD();
  setMain("Início de mandato",`Você assumiu <b>${offices[G.officeIdx].name}</b> em <b>${G.city} - ${G.state}</b>, pelo <b>${parties[G.partyIdx].sigla}</b>.<br><br>Use as ações à esquerda. Cada decisão afeta Povo, Mídia e Partido.`);
  addFeed("Posse",`Novo mandato como <b>${offices[G.officeIdx].name}</b> em ${G.city}.`);
  fadeTo("game");
}

/* binds */
function bindButtons(){
  $("#btnStart").addEventListener("click",()=>fadeTo("setup"));
  $("#btnBegin").addEventListener("click",()=>{
    const city = ($("#inpCity").value||"").trim();
    if(!city) return toast("Digite a cidade.");
    G.partyIdx = parseInt($("#selParty").value||"0",10)||0;
    G.state    = $("#selState").value;
    G.city     = city;
    saveGame(); beginMandate();
  });
  $("#btnHome").addEventListener("click",()=>fadeTo("intro"));
  $("#btnSave").addEventListener("click",saveGame);

  $("#btnAction1").onclick=actVoteProjects;
  $("#btnAction2").onclick=actProposeLaw;
  $("#btnAction3").onclick=actCrisis;
  $("#btnAction4").onclick=actCampaign;
}

/* init */
document.addEventListener("DOMContentLoaded",()=>{
  screens.intro=$("#screenIntro"); screens.setup=$("#screenSetup"); screens.game=$("#screenGame");
  fadeEl=$("#cineFade"); if(fadeEl){ if(!fadeEl.classList.contains("hidden")) fadeEl.classList.add("hidden"); fadeEl.classList.remove("show"); fadeEl.style.pointerEvents="none"; }
  setupModal(); mountSetup(); loadGame(); show("intro"); bindButtons();
});
