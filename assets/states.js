/* ============================================================
   state.js — Sistema de Estado Global
   Versão 3.0 (Simulador Político Deluxe)
   ============================================================ */

/* --------------------------
   1. ESTRUTURA DO JOGADOR
   -------------------------- */

export const Player = {
    name: "Jogador",
    party: null,
    city: "",
    state: "",
    officeIndex: 0,         // cargo atual (0 vereador → 7 presidente)
    term: 1,                // mandato atual
    xp: 0,                  // pontos de experiência
    traits: {               // "RPG político"
        carisma: 50,
        negociacao: 50,
        gestao: 50,
        etica: 50,
        oratoria: 50
    },
    promises: [],           // promessas feitas na campanha
    scandals: [],           // escândalos associados ao jogador
    history: [],            // linha do tempo
    approvals: {            // aprovação por segmento social
        geral: 50,
        midia: 50,
        partido: 50,
        empresarios: 50,
        trabalhadores: 50,
        periferia: 50,
        jovens: 50,
        ambientalistas: 50,
        religiosos: 50,
        funcionalismo: 50,
        rural: 50
    },
    budget: {               // orçamento (ativos só quando executivo)
        total: 0,
        saude: 0,
        educacao: 0,
        seguranca: 0,
        infra: 0,
        social: 0,
        economia: 0,
        cultura: 0,
        meioambiente: 0
    },
    works: []               // obras em execução / concluídas
};


/* --------------------------
   2. ESTRUTURA DOS PARTIDOS
   -------------------------- */

export const Parties = [
    {
        sigla: "PTM",
        nome: "Partido do Trabalhador Moderno",
        cor: "#ff2d2d",
        plataforma: ["Saúde", "Trabalho", "Social"],
        apoio: 55
    },
    {
        sigla: "PSLB",
        nome: "Partido Social Liberal do Brasil",
        cor: "#1e90ff",
        plataforma: ["Economia", "Privatizações"],
        apoio: 45
    },
    {
        sigla: "MDBR",
        nome: "Movimento Democrático Brasileiro Real",
        cor: "#ffc107",
        plataforma: ["Centro", "Coalizão", "Pragmatismo"],
        apoio: 40
    },
    {
        sigla: "PVG",
        nome: "Partido Verde Global",
        cor: "#00c851",
        plataforma: ["Meio Ambiente", "Sustentabilidade"],
        apoio: 52
    },
    {
        sigla: "PRP",
        nome: "Partido Republicano Popular",
        cor: "#6a1b9a",
        plataforma: ["Segurança", "Costumes"],
        apoio: 58
    }
];


/* --------------------------
   3. ESTRUTURA DE ELEITORES
   -------------------------- */

export const ElectorGroups = {
    empresarios:   { peso: 8,  opiniao: {} },
    trabalhadores: { peso: 14, opiniao: {} },
    periferia:     { peso: 18, opiniao: {} },
    jovens:        { peso: 12, opiniao: {} },
    ambientalistas:{ peso: 6,  opiniao: {} },
    religiosos:    { peso: 16, opiniao: {} },
    funcionalismo: { peso: 10, opiniao: {} },
    rural:         { peso: 8,  opiniao: {} }
};


/* --------------------------
   4. ESTRUTURA DE ADVERSÁRIOS
   -------------------------- */

export const Opponents = [
    {
        nome: "Carlos Ventura",
        estilo: "Populista",
        atributos: { carisma: 80, oratoria: 75, etica: 40, gestao: 45, negociacao: 55 },
        ideologia: ["Segurança", "Social"],
        partido: "PRP"
    },
    {
        nome: "Helena Duarte",
        estilo: "Técnica",
        atributos: { carisma: 50, oratoria: 60, etica: 95, gestao: 90, negociacao: 70 },
        ideologia: ["Educação", "Economia"],
        partido: "PSLB"
    },
    {
        nome: "Rafael Monteiro",
        estilo: "Ambientalista",
        atributos: { carisma: 60, oratoria: 55, etica: 85, gestao: 70, negociacao: 50 },
        ideologia: ["Meio Ambiente", "Saúde"],
        partido: "PVG"
    }
];


/* --------------------------
   5. ESTRUTURA DE ESCÂNDALOS
   -------------------------- */

export const Scandals = [
    { tipo:"Investigação do Tribunal de Contas", impacto:-12, chance:0.10 },
    { tipo:"Denúncia de adversário", impacto:-6, chance:0.18 },
    { tipo:"Fake news viral", impacto:-4, chance:0.22 },
    { tipo:"Erro de comunicação", impacto:-2, chance:0.30 },
    { tipo:"Escândalo grave envolvendo assessor", impacto:-16, chance:0.07 }
];


/* --------------------------
   6. ESTRUTURA DE PROMESSAS
   -------------------------- */

export const CampaignPromises = [
    { tema:"Segurança", impactoPositivo:4, impactoNegativo:-6 },
    { tema:"Educação", impactoPositivo:5, impactoNegativo:-4 },
    { tema:"Economia", impactoPositivo:6, impactoNegativo:-8 },
    { tema:"Saúde", impactoPositivo:5, impactoNegativo:-5 },
    { tema:"Meio Ambiente", impactoPositivo:3, impactoNegativo:-3 }
];


/* --------------------------
   7. HISTÓRICO (timeline)
   -------------------------- */

export function addHistory(evento) {
    Player.history.push({
        data: new Date().toLocaleDateString(),
        evento
    });
}


/* --------------------------
   8. RESET DE CARREIRA
   -------------------------- */

export function resetCareer() {
    Player.party = null;
    Player.city = "";
    Player.state = "";
    Player.officeIndex = 0;
    Player.term = 1;
    Player.traits = { carisma:50, negociacao:50, gestao:50, etica:50, oratoria:50 };
    Player.promises = [];
    Player.scandals = [];
    Player.history = [];
    Player.approvals = {
        geral:50, midia:50, partido:50, empresarios:50, trabalhadores:50,
        periferia:50, jovens:50, ambientalistas:50, religiosos:50,
        funcionalismo:50, rural:50
    };
}
