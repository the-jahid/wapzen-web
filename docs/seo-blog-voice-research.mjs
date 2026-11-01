// Voice-agent buyer research for five markets (see seo-research.md, "Voice agent
// posts"). Run: node docs/seo-blog-voice-research.mjs br|mx|de|ae|in -> prints the
// top phrases per cluster and writes blog-kw-voice-<market>.json in the cwd.
// Same rank-weighted scoring as seo-blog-latam-verticals-research.mjs: Google and
// YouTube with the market's hl/gl (ie/oe=utf-8 keeps accents) and DuckDuckGo with
// its kl region.
import fs from "node:fs";

const englishClusters = {
  generic: ["ai voice agent", "ai calling agent", "ai voice bot", "ai calling software", "ai phone agent", "voice ai agent for business"],
  receptionist: ["ai receptionist", "ai call answering", "ai phone answering", "virtual receptionist ai"],
  outbound: ["ai cold calling", "ai sales calls", "ai outbound calling", "ai telecaller", "ai lead qualification call", "ai calling for lead generation"],
  callCenter: ["ai call center", "ai call center software", "replace call center with ai", "ai customer support calls"],
  whatsapp: ["whatsapp ai calling", "whatsapp voice bot", "whatsapp ai voice agent", "whatsapp call ai", "whatsapp business calling"],
  industries: ["ai voice agent for real estate", "ai calling for real estate", "ai receptionist for clinic", "ai calling for cod confirmation", "ai voice agent for hotels", "ai voice agent for car dealership", "ai calling for collections"],
  price: ["ai voice agent pricing", "ai calling agent cost", "ai calling agent price", "ai voice agent free"],
};

const markets = {
  br: {
    hl: "pt-BR", gl: "br", kl: "br-pt",
    clusters: {
      agenteVoz: ["agente de voz ia", "agente de voz com ia", "ia de voz para atendimento", "voicebot", "ia que faz ligação", "ia que atende ligação", "ligação com ia"],
      atendente: ["atendente virtual com ia", "secretária virtual ia", "recepcionista virtual ia", "ia para atendimento telefônico", "ura inteligente", "ura com ia"],
      vendas: ["ia para ligações de vendas", "robô de ligação", "robô que liga para clientes", "ligação automática para clientes", "ia para prospecção por ligação", "discador automático com ia"],
      cobranca: ["robô de cobrança", "ia para cobrança", "ligação de cobrança automática", "cobrança por whatsapp com ia"],
      whatsapp: ["ligação whatsapp ia", "ia que liga pelo whatsapp", "atendimento por voz whatsapp", "chamada whatsapp business", "agente de voz whatsapp"],
      setores: ["ia para clínica atender ligação", "ia para imobiliária ligação", "ia para confirmar consultas", "ia para call center", "call center com ia", "ia para concessionária"],
      preco: ["agente de voz ia preço", "quanto custa um agente de ia", "agente de ia grátis", "ia para atendimento preço"],
    },
  },
  mx: {
    hl: "es-419", gl: "mx", kl: "mx-es",
    clusters: {
      agenteVoz: ["agente de voz ia", "agente de voz con ia", "ia que hace llamadas", "ia que contesta llamadas", "llamadas con ia", "voicebot"],
      recepcion: ["recepcionista virtual ia", "asistente virtual telefónico", "conmutador virtual con ia", "conmutador inteligente", "contestadora con ia"],
      ventas: ["llamadas automaticas ia", "bot de llamadas", "ia para ventas por teléfono", "ia para prospectar clientes", "marcador automatico con ia", "ia para call center"],
      cobranza: ["ia para cobranza", "bot de cobranza", "llamadas de cobranza automatizadas", "cobranza por whatsapp"],
      whatsapp: ["llamadas whatsapp ia", "llamadas whatsapp business", "agente de voz whatsapp", "bot de voz whatsapp", "ia que llama por whatsapp"],
      sectores: ["ia para consultorios llamadas", "ia para inmobiliarias llamadas", "confirmar citas por llamada", "call center con ia", "ia para agencias de autos"],
      precio: ["agente de voz ia precio", "cuanto cuesta un agente de ia", "agente de ia gratis", "ia para llamadas precio"],
    },
  },
  de: {
    hl: "de", gl: "de", kl: "de-de",
    clusters: {
      telefonassistent: ["ki telefonassistent", "ki telefonie", "ki anrufe", "telefon ki", "ki sprachassistent telefon", "ki telefonagent", "voicebot"],
      rezeption: ["ki rezeption", "ki telefonzentrale", "virtuelle telefonzentrale ki", "ki anrufbeantworter", "telefonservice ki"],
      branchen: ["ki telefonassistent arztpraxis", "ki telefonassistent handwerker", "ki telefonassistent autohaus", "ki telefonassistent hotel", "ki telefonassistent immobilien", "ki telefonassistent steuerberater"],
      vertrieb: ["ki kaltakquise telefon", "ki vertrieb telefon", "ki outbound calls", "ki terminvereinbarung telefon"],
      whatsapp: ["whatsapp anruf ki", "whatsapp business anrufe", "whatsapp ki agent", "whatsapp telefonie business", "whatsapp sprachassistent"],
      kosten: ["ki telefonassistent kosten", "ki telefonassistent kostenlos", "ki telefonassistent test", "ki telefonassistent dsgvo"],
    },
  },
  ae: { hl: "en", gl: "ae", kl: "xa-en", clusters: { ...englishClusters, local: ["ai voice agent dubai", "ai calling agent uae", "ai receptionist dubai", "arabic ai voice agent", "ai voice agent arabic", "ai call center dubai", "whatsapp ai agent dubai"] } },
  in: { hl: "en", gl: "in", kl: "in-en", clusters: { ...englishClusters, local: ["ai calling agent india", "ai voice agent india", "hindi ai voice agent", "ai telecaller india", "ai calling software india", "ai voice bot india", "ai calling agent for enterprise"] } },
};

const market = markets[process.argv[2]];
if (!market) throw new Error("usage: node docs/seo-blog-voice-research.mjs br|mx|de|ae|in");
const { hl, gl, kl, clusters } = market;
const sources = {
  google: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&hl=${hl}&gl=${gl}&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`,
  youtube: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=${hl}&gl=${gl}&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`,
  ddg: (q) => `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}&kl=${kl}&type=list`,
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function suggestions(url) {
  for (let a = 0; a < 3; a++) { try { const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } }); return JSON.parse(await res.text())[1] ?? []; } catch { await sleep(500); } }
  return [];
}
const tasks = [];
for (const [cluster, seeds] of Object.entries(clusters)) for (const q of seeds) for (const [name, url] of Object.entries(sources)) tasks.push({ cluster, q, name, url: url(q) });
const scores = new Map();
async function worker() {
  while (tasks.length) {
    const { cluster, q, name, url } = tasks.shift();
    (await suggestions(url)).forEach((phrase, rank) => {
      const key = phrase.toLowerCase().trim();
      const e = scores.get(key) ?? { score: 0, sources: new Set(), clusters: new Set() };
      e.score += 10 - Math.min(rank, 9); e.sources.add(name); e.clusters.add(cluster); scores.set(key, e);
    });
    await sleep(80);
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
const rows = [...scores].map(([phrase, e]) => ({ phrase, score: e.score, sources: e.sources.size, cluster: [...e.clusters].join("+") })).sort((a, b) => b.score - a.score);
fs.writeFileSync(`blog-kw-voice-${process.argv[2]}.json`, JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
const ranked = Object.entries(byCluster).map(([c, list]) => [c, list, list.reduce((s, r) => s + r.score, 0)]).sort((a, b) => b[2] - a[2]);
for (const [c, list, total] of ranked) {
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 10)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${r.phrase}`);
}
