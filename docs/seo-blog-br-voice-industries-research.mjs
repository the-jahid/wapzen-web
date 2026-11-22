// Brazil WhatsApp voice agent industry posts (see seo-research.md, "Brazil voice agent
// industry posts (2026-11-22)"). Run: node docs/seo-blog-br-voice-industries-research.mjs [out.json]
// Google and YouTube autocomplete (hl=pt-BR, gl=br, ie/oe=utf-8 keeps accents) and DuckDuckGo
// (kl=br-pt), rank-weighted (10 points for the first suggestion down to 1), so a phrase's
// sources are out of 3. Three harvests in one run:
//   1. voice and virtual-attendant prefixes expanded with a-z: which industries Brazilians
//      attach to "agente de voz para", "secretária virtual para" and the like;
//   2. voice and AI phrases for 24 industries (template x industry word) plus job phrases
//      ("confirmação de consulta", "captação de alunos");
//   3. WhatsApp voice phrases and the questions people ask an assistant.
// Long voice phrases often return nothing on Google, and DuckDuckGo pads with unrelated
// fuzzy matches, so every list below keeps only phrases that name the industry.
import fs from "node:fs";

const prefixes = [
  "agente de voz para", "agente de ia para", "ia para atender ligações", "ia que atende ligação", "ia que faz ligação",
  "secretária virtual para", "atendente virtual para", "recepcionista virtual para", "ura inteligente para",
  "robô de ligação para", "ligação automática para", "ia de voz para", "assistente virtual para", "atendimento telefônico com ia",
];
const letters = ["", ..."abcdefghijlmnopqrstuv"];

const industries = {
  clinicas: ["clínica", "clínicas", "consultório", "clínica médica", "consultório médico"],
  odonto: ["clínica odontológica", "dentista", "consultório odontológico"],
  estetica: ["clínica de estética", "estética"],
  imobiliaria: ["imobiliária", "imobiliárias", "corretor de imóveis"],
  construtora: ["construtora", "incorporadora", "loteamento"],
  concessionaria: ["concessionária", "loja de carros", "revenda de veículos"],
  oficina: ["oficina mecânica", "auto center"],
  escolas: ["escola", "escolas", "cursos", "faculdade"],
  seguros: ["corretora de seguros", "seguros", "corretor de seguros"],
  planosaude: ["plano de saúde", "corretora de plano de saúde"],
  solar: ["energia solar", "empresa de energia solar"],
  restaurante: ["restaurante", "delivery", "pizzaria"],
  hotel: ["hotel", "pousada", "agência de viagens"],
  varejo: ["loja virtual", "e-commerce", "varejo", "loja"],
  advocacia: ["advocacia", "escritório de advocacia", "advogados"],
  contabilidade: ["contabilidade", "escritório de contabilidade"],
  academia: ["academia", "academias"],
  pet: ["pet shop", "clínica veterinária"],
  salao: ["salão de beleza", "barbearia"],
  laboratorio: ["laboratório", "clínica de exames"],
  provedor: ["provedor de internet"],
  autoescola: ["autoescola"],
  otica: ["ótica"],
  financeira: ["financeira", "correspondente bancário"],
};
const templates = [
  (x) => `agente de voz para ${x}`,
  (x) => `agente de ia para ${x}`,
  (x) => `ia para ${x}`,
  (x) => `atendente virtual para ${x}`,
  (x) => `secretária virtual para ${x}`,
  (x) => `atendimento telefônico ${x}`,
  (x) => `ura para ${x}`,
  (x) => `whatsapp para ${x}`,
  (x) => `chatbot para ${x}`,
];
// Phrases for the job rather than "<tool> para <industry>".
const jobs = {
  clinicas: ["confirmação de consulta", "confirmar consultas automaticamente", "lembrete de consulta", "ligação de confirmação de consulta", "agendamento de consultas", "faltas em consultas", "como reduzir faltas de pacientes", "secretária virtual médica"],
  imobiliaria: ["atendimento de leads imobiliária", "ia para corretor", "lead imobiliário", "agendar visita imóvel", "como atender leads de imóveis"],
  concessionaria: ["agendamento de revisão", "agendar test drive", "pós-venda concessionária", "leads de veículos"],
  escolas: ["captação de alunos", "matrícula escolar", "ia para captação de alunos", "rematrícula", "como captar alunos"],
  seguros: ["renovação de seguro", "cotação de seguro", "ia para corretor de seguros", "como vender seguro pelo whatsapp"],
  solar: ["leads energia solar", "orçamento energia solar", "como vender energia solar", "prospecção energia solar"],
  restaurante: ["pedido por telefone", "atendente virtual delivery", "ia para delivery", "reserva restaurante"],
  hotel: ["reserva por telefone", "ia para hotelaria", "atendimento pousada", "ia para turismo"],
  varejo: ["confirmação de pedido", "recuperação de carrinho abandonado", "pós-venda", "pesquisa de satisfação por ligação"],
  advocacia: ["ia para advogados", "atendimento escritório de advocacia", "captação de clientes advocacia"],
  financeira: ["robô de cobrança", "ia para cobrança", "ligação de cobrança automática"],
};
const general = [
  "agente de voz whatsapp", "ligação whatsapp ia", "ia que atende ligação do whatsapp", "atender ligação whatsapp automaticamente",
  "secretária eletrônica whatsapp", "chamada whatsapp business", "ia para atender chamadas", "agente de voz ia", "voicebot whatsapp",
  "ia de voz para atendimento", "secretária virtual whatsapp", "atendente virtual whatsapp", "como colocar ia no whatsapp",
  "existe ia que atende ligação", "ia que liga para clientes", "como automatizar ligações", "ligação automática whatsapp",
  "robô que liga", "ia para atender telefone", "qual a melhor ia para atendimento", "agente de voz gratuito", "agente de voz para empresas",
];

const sources = {
  google: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&hl=pt-BR&gl=br&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`,
  youtube: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=pt-BR&gl=br&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`,
  ddg: (q) => `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}&kl=br-pt&type=list`,
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function suggestions(url) {
  for (let a = 0; a < 3; a++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      const data = JSON.parse(await res.text());
      return Array.isArray(data?.[1]) ? data[1] : [];
    } catch { await sleep(600); }
  }
  return [];
}

const seeds = [];
for (const p of prefixes) for (const l of letters) seeds.push({ group: "prefix", seed: l ? `${p} ${l}` : `${p} ` });
for (const [industry, words] of Object.entries(industries)) for (const w of words) for (const t of templates) seeds.push({ group: industry, seed: t(w) });
for (const [industry, list] of Object.entries(jobs)) for (const s of list) seeds.push({ group: industry, seed: s });
for (const s of general) seeds.push({ group: "general", seed: s });

const tasks = [];
for (const { group, seed } of seeds) for (const [name, url] of Object.entries(sources)) tasks.push({ group, name, url: url(seed) });
console.error(`${seeds.length} seeds, ${tasks.length} requests`);

const phrases = new Map(); // phrase -> { score, sources:Set, groups:Set }
let done = 0;
async function worker() {
  while (tasks.length) {
    const { group, name, url } = tasks.shift();
    (await suggestions(url)).forEach((phrase, rank) => {
      const key = String(phrase).toLowerCase().trim();
      const e = phrases.get(key) ?? { score: 0, sources: new Set(), groups: new Set() };
      e.score += 10 - Math.min(rank, 9); e.sources.add(name); e.groups.add(group); phrases.set(key, e);
    });
    if (++done % 400 === 0) console.error(`${done} requests`);
    await sleep(90);
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

const rows = [...phrases].map(([phrase, e]) => ({ phrase, score: e.score, sources: e.sources.size, groups: [...e.groups].join("+") })).sort((a, b) => b.score - a.score);
fs.writeFileSync(process.argv[2] ?? "blog-kw-br-voice-industries.json", JSON.stringify(rows, null, 1));

// Every industry is scored on the phrases that name it, wherever they came from (a prefix
// expansion or the industry's own seeds), and split into voice phrases and the rest.
const names = {
  clinicas: /cl[íi]nica(?! (odonto|de est|veterin|de exame))|consult[óo]rio(?! odonto)|m[ée]dic|paciente|hospital|consulta/,
  odonto: /odonto|dentist|dental/,
  estetica: /est[ée]tica/,
  imobiliaria: /imobili|im[óo]ve|corretor de im/,
  construtora: /construtora|incorporadora|loteamento/,
  concessionaria: /concession|loja de carro|ve[íi]culo|revenda|autom[óo]v|test drive/,
  oficina: /oficina|auto ?center|mec[âa]nic/,
  escolas: /escola|curso|faculdade|universidade|aluno|matr[íi]cula/,
  seguros: /seguro|seguradora/,
  planosaude: /plano de sa[úu]de|planos de sa[úu]de/,
  solar: /solar|fotovolt/,
  restaurante: /restaurante|delivery|pizzaria|hamburgueria|lanchonete|card[áa]pio/,
  hotel: /hotel|hot[ée]is|pousada|viage|turismo|hospedagem|hotelaria/,
  varejo: /loja|e-?commerce|varejo|carrinho|p[óo]s-venda/,
  advocacia: /advoca|advogad|jur[íi]dic/,
  contabilidade: /cont[áa]b|contador/,
  academia: /academia|fitness|crossfit/,
  pet: /pet ?shop|veterin/,
  salao: /sal[ãa]o|barbearia|cabelei/,
  laboratorio: /laborat[óo]rio|exame/,
  provedor: /provedor|telecom/,
  autoescola: /auto ?escola|cnh/,
  otica: /[óo]tica\b/,
  financeira: /financeira|cr[ée]dito|empr[ée]stimo|consignado|banc[áa]rio|cobran[çc]a/,
};
const voice = /voz|liga[çc]|ligar|telefon|\bura\b|chamada|voicebot|discador|\bcall\b/;
const summary = [];
for (const [industry, re] of Object.entries(names)) {
  const list = rows.filter((r) => re.test(r.phrase));
  const voiceList = list.filter((r) => voice.test(r.phrase));
  const total = list.reduce((s, r) => s + r.score, 0);
  const voiceTotal = voiceList.reduce((s, r) => s + r.score, 0);
  summary.push({ industry, total, voiceTotal, phrases: list.length });
  console.log(`\n## ${industry}  (${list.length} phrases, total ${total}; voice ${voiceList.length} phrases, ${voiceTotal})`);
  for (const r of list.slice(0, 14)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${voice.test(r.phrase) ? "V " : "  "}${r.phrase}`);
}
console.log("\n## Ranking (total, voice total)");
for (const s of summary.sort((a, b) => b.total - a.total)) console.log(`${s.industry.padEnd(15)} ${String(s.total).padStart(5)} ${String(s.voiceTotal).padStart(5)}  (${s.phrases})`);
console.log("\n## Voice and WhatsApp phrases (any industry)");
for (const r of rows.filter((r) => voice.test(r.phrase) || /whatsapp/.test(r.phrase)).slice(0, 45)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${r.phrase}`);
