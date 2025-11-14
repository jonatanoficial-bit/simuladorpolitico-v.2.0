// =====================
// Utils básicos
// =====================
const $  = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);

const clamp    = (v) => Math.max(0, Math.min(100, Math.round(v)));
const randomBool = (p) => Math.random() < p;
const randInt  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// =====================
// Telas & Fade
// =====================
const screens = {
  intro: $("#screenIntro"),
  setup: $("#screenSetup"),
  game:  $("#screenGame"),
};
const fadeEl = $("#cineFade");

function showScreen(id){
  Object.values(screens).forEach(s => s && s.classList.remove("show"));
  if (screens[id]) screens[id].classList.add("show");
}

function fadeTo(id){
  if (!fadeEl) { showScreen(id); return; }
  fadeEl.classList.remove("hidden");
  fadeEl.classList.add("show");
  setTimeout(()=>{
    showScreen(id);
    setTimeout(()=>{
      fadeEl.classList.remove("show");
      setTimeout(()=>fadeEl.classList.add("hidden"), 220);
    }, 80);
  }, 220);
}

// =====================
// Dados fixos
// =====================

// Partidos
const PARTIES = [
  { sigla:"PTM",  nome:"Partido do Trabalhador Moderno",        desc:"Programas sociais e trabalho.",      logo:"simulador_images/party_ptm.png"  },
  { sigla:"PSLB", nome:"Partido Social Liberal do Brasil",      desc:"Mercado e privatizações.",           logo:"simulador_images/party_pslb.png" },
  { sigla:"MDBR", nome:"Movimento Democrático Brasileiro Real", desc:"Pragmatismo e alianças.",            logo:"simulador_images/party_mdbr.png" },
  { sigla:"PVG",  nome:"Partido Verde Global",                  desc:"Sustentabilidade e inovação.",       logo:"simulador_images/party_pvg.png"  },
  { sigla:"PRP",  nome:"Partido Republicano Popular",           desc:"Costumes, segurança e ordem.",       logo:"simulador_images/party_prp.png"  },
];

// Estados
const STATES = [
  "Acre","Alagoas","Amapá","Amazonas","Bahia","Ceará","Distrito Federal","Espírito Santo","Goiás","Maranhão",
  "Mato Grosso","Mato Grosso do Sul","Minas Gerais","Pará","Paraíba","Paraná","Pernambuco","Piauí","Rio de Janeiro",
  "Rio Grande do Norte","Rio Grande do Sul","Rondônia","Roraima","Santa Catarina","São Paulo","Sergipe","Tocantins"
];

// Cargos
const OFFICES = [
  { name:"Vereador",          type:"legislative", bg:"simulador_images/municipal.jpg" },
  { name:"Prefeito",          type:"executive",   bg:"simulador_images/cityhall.jpg"  },
  { name:"Deputado Estadual", type:"legislative", bg:"simulador_images/assembly.jpg"  },
  { name:"Prefeito",          type:"executive",   bg:"simulador_images/cityhall.jpg"  },
  { name:"Governador",        type:"executive",   bg:"simulador_images/governor.jpg"  },
  { name:"Deputado Federal",  type:"legislative", bg:"simulador_images/federal.jpg"   },
  { name:"Senador",           type:"legislative", bg:"simulador_images/senate.jpg"    },
  { name:"Presidente",        type:"executive",   bg:"simulador_images/president.jpg" },
];

// Grupos sociais
const GROUPS_BASE = [
  { id:"trabalhadores", nome:"Trabalhadores urbanos", val:50 },
  { id:"periferia",     nome:"Periferia",             val:50 },
  { id:"empresarios",   nome:"Empresários",           val:50 },
  { id:"classe_media",  nome:"Classe média",          val:50 },
  { id:"servidores",    nome:"Servidores públicos",   val:50 },
  { id:"jovens",        nome:"Jovens",                val:50 },
  { id:"ambientalistas",nome:"Ambientalistas",        val:50 },
  { id:"igrejas",       nome:"Comunidade de fé",      val:50 },
];

// Temas de campanha
const CAMPAIGN_THEMES = [
  {
    id:"seguranca",
    nome:"Segurança pública e combate ao crime",
    texto:"Prometer mais policiamento, inteligência e proteção às famílias.",
    grupos:["periferia","classe_media","igrejas"],
    pesosGrupos:{ periferia:1.4, classe_media:1.2, igrejas:1.1 },
    pesosTraços:{ carisma:0.8, negociacao:0.6, etica:0.3 }
  },
  {
    id:"saude",
    nome:"Saúde e atendimento digno",
    texto:"Ampliar atendimento, reduzir filas e investir em hospitais.",
    grupos:["trabalhadores","periferia","servidores"],
    pesosGrupos:{ trabalhadores:1.3, periferia:1.2, servidores:1.1 },
    pesosTraços:{ tecnica:0.8, etica:0.5, negociacao:0.4 }
  },
  {
    id:"educacao",
    nome:"Educação de qualidade",
    texto:"Valorização de professores, estrutura de escolas e tecnologia.",
    grupos:["jovens","classe_media","servidores"],
    pesosGrupos:{ jovens:1.4, classe_media:1.2, servidores:1.1 },
    pesosTraços:{ tecnica:0.8, etica:0.5, oratoria:0.4 }
  },
  {
    id:"economia",
    nome:"Emprego, renda e desenvolvimento",
    texto:"Atrair empresas, desburocratizar e apoiar pequenos negócios.",
    grupos:["empresarios","trabalhadores","classe_media"],
    pesosGrupos:{ empresarios:1.4, trabalhadores:1.2, classe_media:1.1 },
    pesosTraços:{ negociacao:0.9, tecnica:0.7, carisma:0.4 }
  },
  {
    id:"meioambiente",
    nome:"Meio ambiente e cidades sustentáveis",
    texto:"Cuidar de parques, rios, mobilidade e energias limpas.",
    grupos:["ambientalistas","jovens","classe_media"],
    pesosGrupos:{ ambientalistas:1.5, jovens:1.2, classe_media:1.1 },
    pesosTraços:{ etica:0.9, tecnica:0.5, oratoria:0.4 }
  },
];

// Perfis de adversário
const ADV_PROFILES = [
  { tipo:"Populista",   foco:"Povo",      bonusBase:+5, pesosTraços:{carisma:1.0, oratoria:0.8} },
  { tipo:"Técnico",     foco:"Gestão",    bonusBase:+3, pesosTraços:{tecnica:1.0, negociacao:0.7} },
  { tipo:"Conservador", foco:"Costumes",  bonusBase:+4, pesosTraços:{etica:0.8, carisma:0.5} },
  { tipo:"Verde",       foco:"Ambiente",  bonusBase:+4, pesosTraços:{etica:0.8, tecnica:0.6} },
];

// Escândalos de campanha
const SCANDALS = [
  { nome:"Fake news nas redes sociais", impactoPop:-4, impactoMidia:-2, chance:0.25 },
  { nome:"Denúncia de adversário",      impactoPop:-7, impactoMidia:-4, chance:0.15 },
  { nome:"Erro grave em entrevista",    impactoPop:-5, impactoMidia:-3, chance:0.18 },
];

// Obras de longo prazo (apenas Executivo)
const WORKS_TEMPLATES = [
  { id:"hospital",   nome:"Construção de hospital regional", area:"saude",      minGain:4, maxGain:8 },
  { id:"escolas",    nome:"Reforma ampla de escolas",        area:"educacao",   minGain:4, maxGain:7 },
  { id:"viaduto",    nome:"Construção de viaduto/marginal",  area:"mobilidade", minGain:3, maxGain:6 },
  { id:"parques",    nome:"Revitalização de parques",        area:"lazer",      minGain:2, maxGain:5 },
  { id:"delegacia",  nome:"Novo complexo de segurança",      area:"seguranca",  minGain:4, maxGain:8 }
];

const WORKS_GROUP_EFFECTS = {
  saude:      ["trabalhadores","periferia","servidores"],
  educacao:   ["jovens","classe_media","servidores"],
  mobilidade: ["trabalhadores","periferia","classe_media"],
  lazer:      ["jovens","periferia","classe_media"],
  seguranca:  ["periferia","classe_media","igrejas"],
};

// =====================
// Estado global
// =====================
const STORE_KEY = "SimPolitico_3_1_Premium";

let G = {
  partyIdx: 0,
  state: "",
  city: "",
  officeIdx: 0,
  termTurn: 1,
  approvals: 0,
  popPeople: 50,
  popMedia:  50,
  popParty:  50,
  groups: GROUPS_BASE.map(g => ({...g})),
  traits: {
    carisma:     55,
    tecnica:     55,
    negociacao:  55,
    etica:       55,
    oratoria:    55,
  },
  feed: [],
  promises: [],
  scandals: [],
  lastTheme: null,
  works: [],   // obras em andamento/concluídas
};

// =====================
// Persistência
// =====================
function saveGame(){
  localStorage.setItem(STORE_KEY, JSON.stringify(G));
  toast("💾 Progresso salvo!");
}
function loadGame(){
  const raw = localStorage.getItem(STORE_KEY);
  if(!raw) return;
  try{
    const data = JSON.parse(raw);
    G = Object.assign(G, data || {});
  }catch(e){}
}
function resetGame(){
  G = {
    partyIdx: 0,
    state: "",
    city: "",
    officeIdx: 0,
    termTurn: 1,
    approvals: 0,
    popPeople: 50,
    popMedia:  50,
    popParty:  50,
    groups: GROUPS_BASE.map(g => ({...g})),
    traits: {
      carisma:     55,
      tecnica:     55,
      negociacao:  55,
      etica:       55,
      oratoria:    55,
    },
    feed: [],
    promises: [],
    scandals: [],
    lastTheme: null,
    works: [],
  };
  saveGame();
}

// =====================
// Feed / grupos / texto
// =====================
function addFeed(tag, text){
  G.feed.unshift({tag,text});
  if(G.feed.length>50) G.feed.pop();
  renderFeed();
}
function renderFeed(){
  const feed = $("#feed");
  if(!feed) return;
  feed.innerHTML = G.feed.map(i=>`
    <div class="feed-item">
      <div class="feed-tag">${i.tag}</div>
      <div class="feed-body">${i.text}</div>
    </div>
  `).join("");
}
function renderGroups(){
  const panel = $("#groupsPanel");
  if(!panel) return; // se não existir no HTML, ignora
  panel.innerHTML = G.groups.map(g=>`
    <div class="group-row">
      <span class="group-name">${g.nome}</span>
      <span class="group-val">${clamp(g.val)}%</span>
    </div>
  `).join("");
}
function setMain(title, html){
  const t = $("#mainTitle");
  const m = $("#mainText");
  if(t) t.textContent = title;
  if(m) m.innerHTML   = html;
}

// =====================
// Modal / Toast
// =====================
let modal, modalTitle, modalBody, modalActions;
function setupModal(){
  modal        = $("#modal");
  modalTitle   = $("#modalTitle");
  modalBody    = $("#modalBody");
  modalActions = $("#modalActions");
  if(modal){
    if(!modal.classList.contains("hidden")) modal.classList.add("hidden");
    modal.addEventListener("click",(e)=>{ if(e.target===modal) closeModal(); });
  }
}
function openModal(title, htmlBody, actions){
  if(!modal) return alert(htmlBody.replace(/<[^>]+>/g,""));
  modalTitle.innerHTML = title || "";
  modalBody.innerHTML  = htmlBody || "";
  modalActions.innerHTML = "";
  (actions||[]).forEach(a=>{
    const b = document.createElement("button");
    b.className = "btn " + (a.className||"");
    b.textContent = a.label;
    b.onclick = () => { if(a.onClick) a.onClick(); };
    modalActions.appendChild(b);
  });
  modal.classList.remove("hidden");
}
function closeModal(){
  if(modal) modal.classList.add("hidden");
}
function toast(text){
  openModal("Informação", text, [
    {label:"OK", className:"btn-gold", onClick:closeModal}
  ]);
}

// =====================
// HUD / cena
// =====================
function updateHUD(){
  const office = OFFICES[G.officeIdx];
  const party  = PARTIES[G.partyIdx];

  const hudOffice   = $("#hudOffice");
  const hudLocation = $("#hudLocation");
  if(hudOffice)   hudOffice.textContent   = office.name;
  if(hudLocation) hudLocation.textContent = `${G.city} - ${G.state} • Mandato ${G.termTurn}`;

  const partyLogo = $("#partyLogo");
  if(partyLogo){
    if(party && party.logo){
      partyLogo.src = party.logo;
      partyLogo.style.display="block";
    }else{
      partyLogo.style.display="none";
    }
  }

  const pct = Math.min(100, Math.round((G.approvals/15)*100));
  const txtProg = $("#txtProgress");
  const barProg = $("#barProgress");
  if(txtProg) txtProg.textContent = pct+"%";
  if(barProg) barProg.style.width = pct+"%";

  const elP = $("#popPeople");
  const elM = $("#popMedia");
  const elPar = $("#popParty");
  if(elP)   elP.textContent   = clamp(G.popPeople)+"%";
  if(elM)   elM.textContent   = clamp(G.popMedia)+"%";
  if(elPar) elPar.textContent = clamp(G.popParty)+"%";

  const elCar = $("#traitCarisma");
  const elTec = $("#traitTecnica");
  const elNeg = $("#traitNegociacao");
  const elEt  = $("#traitEtica");
  if(elCar) elCar.textContent = clamp(G.traits.carisma);
  if(elTec) elTec.textContent = clamp(G.traits.tecnica);
  if(elNeg) elNeg.textContent = clamp(G.traits.negociacao);
  if(elEt)  elEt.textContent  = clamp(G.traits.etica);

  const scene = $("#sceneImage");
  if(scene){
    scene.style.backgroundImage = `url('${office.bg}')`;
  }

  renderGroups();
}

// =====================
// Setup inicial
// =====================
function mountSetup(){
  const selParty = $("#selParty");
  const selState = $("#selState");

  if(selParty){
    selParty.innerHTML = "";
    PARTIES.forEach((p,i)=>{
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${p.sigla} - ${p.nome}`;
      selParty.appendChild(opt);
    });
  }
  if(selState){
    selState.innerHTML = "";
    STATES.forEach(s=>{
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      selState.appendChild(opt);
    });
  }
}

function beginMandate(){
  addFeed("Posse", `Você assumiu o cargo de <b>${OFFICES[G.officeIdx].name}</b> em ${G.city} - ${G.state}.`);
  setMain(
    "Início de mandato",
    `Você agora é <b>${OFFICES[G.officeIdx].name}</b> em <b>${G.city} - ${G.state}</b>, pelo partido <b>${PARTIES[G.partyIdx].sigla}</b>.<br><br>
     Use as ações para construir sua reputação com o povo, a mídia, o partido e os grupos sociais.`
  );
  updateHUD();
  renderFeed();
  fadeTo("game");
}

// =====================
// AÇÕES – Votar projetos
// =====================
function actVoteProjects(){
  const office = OFFICES[G.officeIdx];
  if(office.type !== "legislative"){
    toast("Votação de projetos só está disponível para cargos do Legislativo (vereador, deputados, senador).");
    return;
  }

  const projetos = [
    "Reforma da frota de ônibus",
    "Programa de segurança nos bairros",
    "Requalificação de escolas públicas",
    "Incentivo fiscal para pequenas empresas",
    "Criação de parque urbano",
  ];
  const p = projetos[randInt(0,projetos.length-1)];
  const total  = randInt(30,70);
  const baseYes = 0.4 + Math.random()*0.3;
  const yes = Math.round(total*baseYes);
  const no  = total-yes;
  const passa = yes>no;

  openModal(
    "Votação em plenário",
    `Em pauta: <b>${p}</b>.<br><br>
     Placar parcial:<br>
     <b>${yes}</b> votos SIM • <b>${no}</b> votos NÃO.<br><br>
     Como você deseja votar?`,
    [
      {label:"Votar SIM", className:"btn-gold", onClick:()=>{closeModal(); resolveVote(true, passa, p);}},
      {label:"Votar NÃO",                    onClick:()=>{closeModal(); resolveVote(false,passa, p);}},
    ]
  );
}

function resolveVote(votouSim, passou, projeto){
  let dPovo=0, dMidia=0, dPart=0;

  if(passou && votouSim){
    dPovo+=3; dMidia+=2; dPart+=2;
    G.approvals++;
    G.traits.negociacao += 1;
    addFeed("Votação", `Você apoiou <b>${projeto}</b>, aprovado em plenário.`);
  }else if(!passou && !votouSim){
    dPovo+=1; dMidia+=2; dPart+=1;
    addFeed("Votação", `Você votou contra <b>${projeto}</b>, rejeitado.`);
  }else{
    dPovo-=2; dMidia-=1;
    addFeed("Votação", `Sua posição em <b>${projeto}</b> dividiu o eleitorado.`);
  }

  G.popPeople += dPovo;
  G.popMedia  += dMidia;
  G.popParty  += dPart;
  G.termTurn++;

  setMain(
    "Resultado da votação",
    `Impactos:<br>
     Povo: ${(dPovo>=0?"+":"")+dPovo}%<br>
     Mídia: ${(dMidia>=0?"+":"")+dMidia}%<br>
     Partido: ${(dPart>=0?"+":"")+dPart}%`
  );
  updateHUD();
  saveGame();
}

// =====================
// AÇÕES – Propor lei
// =====================
function actProposeLaw(){
  const office = OFFICES[G.officeIdx];
  if(office.type !== "legislative"){
    toast("Proposição de novos projetos de lei é exclusiva dos cargos legislativos.");
    return;
  }

  const ideias = [
    "Wi-Fi público nas praças",
    "Corredor exclusivo de ônibus",
    "Hortas comunitárias",
    "Plano de valorização do magistério",
    "Lei anti-desperdício de alimentos"
  ];
  const p = ideias[randInt(0,ideias.length-1)];

  openModal(
    "Propor novo projeto",
    `Você vai protocolar o projeto:<br><br><b>${p}</b><br><br>Enviar para tramitação?`,
    [
      {label:"Protocolar", className:"btn-gold", onClick:()=>{
        closeModal();
        const chanceBase   = 0.48;
        const bonusPartido = (G.popParty - 50)/200;
        const bonusNeg     = (G.traits.negociacao - 50)/250;
        const aprovado = randomBool(chanceBase + bonusPartido + bonusNeg);

        if(aprovado){
          G.approvals++;
          G.popPeople += 3;
          G.popMedia  += 2;
          G.popParty  += 2;
          G.traits.tecnica += 1;
          addFeed("Projeto aprovado", `Seu projeto <b>${p}</b> foi aprovado e virou lei.`);
          setMain("Projeto aprovado", "A recepção foi positiva entre a população e os grupos interessados.");
        }else{
          G.popPeople -= 1;
          G.popMedia  -= 2;
          addFeed("Projeto rejeitado", `O projeto <b>${p}</b> foi travado nas comissões e arquivado.`);
          setMain("Projeto rejeitado", "A imprensa criticou a sua articulação política.");
        }
        G.termTurn++;
        updateHUD();
        saveGame();
      }},
      {label:"Cancelar", onClick:closeModal}
    ]
  );
}

// =====================
// AÇÕES – Crises (Executivo)
// =====================
function actCrisis(){
  const office = OFFICES[G.officeIdx];
  if(office.type !== "executive"){
    toast("Crises de gestão só aparecem para Prefeito, Governador e Presidente.");
    return;
  }

  const crises = [
    { area:"Saúde",     op:["Mutirão de consultas","Construir nova UPA","Repassar recursos aos hospitais"],  impact:[+3,+4,+2] },
    { area:"Segurança", op:["Aumentar policiamento","Melhorar iluminação pública","Criar guarda comunitária"], impact:[+3,+2,+2] },
    { area:"Economia",  op:["Reduzir impostos","Atrair novas empresas","Programa de qualificação profissional"], impact:[+2,+3,+3] },
    { area:"Educação",  op:["Reforma de escolas","Formação de professores","Ampliação de vagas em creches"], impact:[+3,+3,+2] },
  ];
  const c = crises[randInt(0,crises.length-1)];
  let body = `Crise em <b>${c.area}</b>.<br><br>Escolha uma estratégia:<br><br>`;
  c.op.forEach((o,i)=>{ body += `<b>${i+1}.</b> ${o}<br>`; });

  const actions = c.op.map((o,i)=>({
    label: o,
    className: i===0 ? "btn-gold" : "",
    onClick: ()=>{
      closeModal();
      let d = c.impact[i];

      d += (G.traits.tecnica - 50)/30;
      if(d>0 && randomBool(0.25)) d += 1;

      G.popPeople += d;
      G.popMedia  += (d>0 ? 1 : -1);
      G.popParty  += (d>=0 ? 1 : -2);

      G.traits.tecnica    += d>0 ? 1 : 0;
      G.traits.negociacao += d>=0 ? 1 : 0;

      G.termTurn++;

      addFeed("Crise", `Você atuou na área de <b>${c.area}</b> com a medida: ${o}.`);
      setMain(
        "Gestão de crise",
        `Sua decisão em <b>${c.area}</b> gerou impacto de ${(d>=0?"+":"")+Math.round(d)}% na percepção popular.<br><br>
         A mídia reagiu ${d>=0?"de forma positiva":"com duras críticas"}.`
      );
      updateHUD();
      checkImpeachment();
      saveGame();
    }
  }));

  openModal("Gestão de crise", body, actions);
}

// =====================
// AÇÕES – Campanha premium
// =====================
function actCampaign(){
  if(G.officeIdx >= OFFICES.length-1){
    toast("Você já está no cargo máximo (Presidente).");
    return;
  }
  if(G.approvals < 8){
    toast("Você precisa ter pelo menos 8 projetos/decisões bem-sucedidos antes de disputar um novo cargo.");
    return;
  }
  if(clamp(G.popPeople) < 60){
    toast("Sua popularidade com o povo precisa ser pelo menos 60% para se candidatar ao próximo cargo.");
    return;
  }

  const next = OFFICES[G.officeIdx+1];

  let body = `
    Você está prestes a lançar sua campanha para <b>${next.name}</b>.<br><br>
    Escolha o <b>tema central</b> da sua campanha. Ele define quais grupos sociais você conquista mais,
    e como seus atributos entram no cálculo da eleição.<br><br>
  `;
  CAMPAIGN_THEMES.forEach(t=>{
    body += `<b>${t.nome}</b><br><span style="font-size:12px;opacity:.85;">${t.texto}</span><br><br>`;
  });

  const actions = CAMPAIGN_THEMES.map(theme => ({
    label: theme.nome,
    className:"btn-gold",
    onClick: ()=>{
      closeModal();
      G.lastTheme = theme.id;
      addFeed("Campanha", `Você lança campanha para <b>${next.name}</b> com foco em <b>${theme.nome}</b>.`);
      runElection(next, theme);
    }
  }));

  openModal("Planejamento de campanha", body, actions);
}

function runElection(nextOffice, theme){
  // escândalos
  let escText = "";
  SCANDALS.forEach(s=>{
    if(randomBool(s.chance)){
      G.popPeople += s.impactoPop;
      G.popMedia  += s.impactoMidia;
      G.scandals.push({nome:s.nome, impacto:s.impactoPop});
      escText += `• ${s.nome} (-${Math.abs(s.impactoPop)}% de popularidade com o povo)<br>`;
    }
  });
  if(escText){
    addFeed("Escândalo", "Durante a campanha houve ruídos e crises de imagem.");
  }

  const baseOpinioes = (clamp(G.popPeople)+clamp(G.popMedia)+clamp(G.popParty))/3;

  // grupos
  let somaGrupos = 0;
  let pesoTotalGrupos = 0;
  G.groups.forEach(g=>{
    const peso = (theme.pesosGrupos && theme.pesosGrupos[g.id]) || 1.0;
    somaGrupos += clamp(g.val) * peso;
    pesoTotalGrupos += peso;
  });
  const mediaGrupos = pesoTotalGrupos>0 ? (somaGrupos/pesoTotalGrupos) : 50;

  // atributos
  let scoreAtributos = 0;
  for(const key in theme.pesosTraços){
    const peso = theme.pesosTraços[key];
    if(key==="carisma")    scoreAtributos += G.traits.carisma    * peso;
    if(key==="tecnica")    scoreAtributos += G.traits.tecnica    * peso;
    if(key==="negociacao") scoreAtributos += G.traits.negociacao * peso;
    if(key==="etica")      scoreAtributos += G.traits.etica      * peso;
    if(key==="oratoria")   scoreAtributos += G.traits.oratoria   * peso;
  }
  scoreAtributos = scoreAtributos / 3.5;

  let scorePlayer = baseOpinioes*0.5 + mediaGrupos*0.3 + scoreAtributos*0.2;
  scorePlayer += randInt(-5,5);

  function scoreAdv(adv){
    let base = randInt(38,60) + adv.bonusBase;
    let somaAttr = 0;
    for(const key in adv.pesosTraços){
      const peso = adv.pesosTraços[key];
      const fakeVal = randInt(45,85);
      somaAttr += fakeVal * peso;
    }
    somaAttr = somaAttr / 3.5;
    return base*0.6 + somaAttr*0.4 + randInt(-5,5);
  }

  const adv1 = ADV_PROFILES[randInt(0,ADV_PROFILES.length-1)];
  const adv2 = ADV_PROFILES[randInt(0,ADV_PROFILES.length-1)];
  const sAdv1 = scoreAdv(adv1);
  const sAdv2 = scoreAdv(adv2);

  const total = Math.max(1, scorePlayer + sAdv1 + sAdv2);
  const pctPlayer = Math.round((scorePlayer/total)*100);
  const pctOpp1   = Math.round((sAdv1/total)*100);
  const pctOpp2   = 100 - pctPlayer - pctOpp1;

  let winner = "player";
  if(pctOpp1>pctPlayer && pctOpp1>=pctOpp2) winner="opp1";
  else if(pctOpp2>pctPlayer && pctOpp2>=pctOpp1) winner="opp2";

  let escBlock = escText
    ? `<br><b>Durante a campanha ocorreram:</b><br>${escText}<br>`
    : "";

  let resumo = `
    <b>Corrida eleitoral para ${nextOffice.name}</b><br><br>
    Tema central da sua campanha: <b>${theme.nome}</b>.<br>
    ${escBlock}
    <b>Resultado aproximado das urnas:</b><br><br>
    Você: <b>${pctPlayer}%</b> dos votos válidos<br>
    Candidato A (${adv1.tipo}): <b>${pctOpp1}%</b><br>
    Candidato B (${adv2.tipo}): <b>${pctOpp2}%</b><br><br>
  `;

  if(winner==="player"){
    addFeed("Eleições", `Você foi eleito para o cargo de <b>${nextOffice.name}</b>!`);
    G.officeIdx++;
    G.termTurn = 1;
    G.approvals = 0;
    G.popMedia  += 3;
    G.popPeople += 4;
    G.traits.carisma    += 2;
    G.traits.negociacao += 2;

    resumo += `Você foi <b>eleito</b> e assume o novo cargo. Seu discurso em torno de <b>${theme.nome}</b> convenceu a maioria do eleitorado.`;

    theme.grupos.forEach(id=>{
      const g = G.groups.find(gr=>gr.id===id);
      if(g) g.val += randInt(3,8);
    });

    setMain("Vitória nas urnas", resumo);
  }else{
    addFeed("Eleições", `Você não conseguiu votos suficientes para <b>${nextOffice.name}</b>.`);
    G.popPeople -= 5;
    G.popMedia  -= 3;

    resumo += `Você <b>não foi eleito</b> desta vez. Os adversários conseguiram conectar melhor com o eleitorado.<br><br>
               Continue trabalhando no cargo atual, aprove projetos relevantes e mantenha alta popularidade para tentar novamente.`;
    setMain("Derrota eleitoral", resumo);
  }

  updateHUD();
  saveGame();
}

// =====================
// AÇÕES – Obras & plano
// =====================
function actWorksPanel(){
  const office = OFFICES[G.officeIdx];
  if(office.type !== "executive"){
    toast("Gestão de obras e plano de governo só está disponível para Prefeito, Governador e Presidente.");
    return;
  }

  let html = "";

  if(G.works.length === 0){
    html += `<b>Você ainda não iniciou nenhuma obra de grande porte.</b><br><br>`;
  }else{
    html += `<b>Obras em andamento:</b><br><br>`;
    G.works.forEach(w=>{
      html += `• ${w.nome} — progresso: <b>${w.progress}%</b> ${w.done ? "(concluída)" : "(em execução)"}<br>`;
    });
    html += `<br>`;
  }

  html += `<hr><b>Iniciar ou acelerar obra:</b><br><br>`;
  html += `<select id="selWorkType" style="width:100%;padding:6px;border-radius:8px;border:1px solid rgba(212,175,55,.5);background:#111;color:#f5f5f5;">`;
  WORKS_TEMPLATES.forEach(w=>{
    html += `<option value="${w.id}">${w.nome}</option>`;
  });
  html += `</select><br><br>`;
  html += `<span style="font-size:12px;opacity:.85;">Cada avanço de obra pode aumentar sua popularidade com grupos específicos 
           (trabalhadores, periferia, classe média, etc.). Quando uma obra é concluída, o impacto é ainda maior.</span>`;

  openModal(
    "Obras & plano de governo",
    html,
    [
      {label:"Iniciar/avançar obra", className:"btn-gold", onClick:()=>{
        const sel = $("#selWorkType");
        if(!sel){ closeModal(); return; }
        const workId = sel.value;
        const tmpl = WORKS_TEMPLATES.find(w=>w.id===workId);
        if(!tmpl){ closeModal(); return; }

        let work = G.works.find(w=>w.id===workId);
        if(!work){
          work = {
            id: tmpl.id,
            nome: tmpl.nome,
            area: tmpl.area,
            progress: randInt(15,30),
            done:false
          };
          G.works.push(work);
          addFeed("Obras", `Você iniciou a obra: <b>${work.nome}</b>.`);
        }else if(!work.done){
          work.progress += randInt(20,40);
        }

        if(work.progress >= 100 && !work.done){
          work.progress = 100;
          work.done = true;

          const gain = randInt(tmpl.minGain, tmpl.maxGain);
          G.popPeople += gain;
          G.popMedia  += Math.round(gain/2);
          G.approvals++;

          const groupsAffected = WORKS_GROUP_EFFECTS[work.area] || [];
          groupsAffected.forEach(id=>{
            const g = G.groups.find(gr=>gr.id===id);
            if(g) g.val += randInt(3,7);
          });

          addFeed("Obras concluídas", `A obra <b>${work.nome}</b> foi concluída e inaugurada com festa.`);
          setMain(
            "Obra concluída",
            `A obra <b>${work.nome}</b> foi entregue à população.<br><br>
             Isso gerou um aumento de popularidade e fortaleceu sua imagem de gestor que realiza entregas concretas.`
          );
        }else if(!work.done){
          addFeed("Obras", `A obra <b>${work.nome}</b> avançou para <b>${work.progress}%</b>.`);
          setMain(
            "Obra em andamento",
            `A obra <b>${work.nome}</b> continua em execução e já alcançou <b>${work.progress}%</b> de progresso.<br><br>
             Manter o ritmo das entregas ajuda a consolidar sua força nas próximas eleições.`
          );
        }

        updateHUD();
        saveGame();
        closeModal();
      }},
      {label:"Fechar", onClick:closeModal}
    ]
  );
}

// =====================
// Impeachment
// =====================
function checkImpeachment(){
  if(clamp(G.popPeople) <= 0){
    addFeed("Crise máxima","Popularidade com o povo chegou a 0%. Você sofreu impeachment!");
    setMain(
      "Impeachment",
      `Sua popularidade desabou e você sofreu <b>impeachment</b>.<br><br>
       Sua carreira política recomeça como vereador. Tente construir uma trajetória mais sólida desta vez.`
    );
    resetGame();
    updateHUD();
  }
}

// =====================
// Bind de botões
// =====================
function bindButtons(){
  const btnStart = $("#btnStart");
  const btnBegin = $("#btnBegin");
  const btnHome  = $("#btnHome");
  const btnSave  = $("#btnSave");

  if(btnStart){
    btnStart.style.pointerEvents = "auto";
    btnStart.style.position = "relative";
    btnStart.style.zIndex  = "10";
    btnStart.addEventListener("click",(e)=>{
      e.preventDefault();
      fadeTo("setup");
    });
  }

  if(btnBegin){
    btnBegin.addEventListener("click",(e)=>{
      e.preventDefault();
      const city     = ($("#inpCity")?.value || "").trim();
      const partyIdx = parseInt($("#selParty")?.value || "0",10) || 0;
      const state    = $("#selState")?.value || "";

      if(!city){
        toast("Digite o nome da cidade.");
        return;
      }

      G.city     = city;
      G.partyIdx = partyIdx;
      G.state    = state;
      saveGame();
      beginMandate();
    });
  }

  if(btnHome){
    btnHome.addEventListener("click",(e)=>{
      e.preventDefault();
      fadeTo("intro");
    });
  }
  if(btnSave){
    btnSave.addEventListener("click",(e)=>{
      e.preventDefault();
      saveGame();
    });
  }

  const a1 = $("#btnAction1");
  const a2 = $("#btnAction2");
  const a3 = $("#btnAction3");
  const a4 = $("#btnAction4");
  const a5 = $("#btnAction5"); // botão opcional de "Obras & plano"

  if(a1) a1.onclick = actVoteProjects;
  if(a2) a2.onclick = actProposeLaw;
  if(a3) a3.onclick = actCrisis;
  if(a4) a4.onclick = actCampaign;
  if(a5) a5.onclick = actWorksPanel; // só funciona se você criar esse botão no HTML
}

// =====================
// Init
// =====================
document.addEventListener("DOMContentLoaded",()=>{
  setupModal();
  mountSetup();
  loadGame();
  renderFeed();
  renderGroups();
  updateHUD();
  showScreen("intro");
  bindButtons();
});
