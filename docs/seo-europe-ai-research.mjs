// European WhatsApp automation demand, for the country pages in Europe (see
// seo-research.md, "European WhatsApp AI agent pages"). Unlike
// seo-blog-europe-research.mjs, which leans to buyer questions about prices and
// phone answering, this one asks how each market words "AI agent on WhatsApp",
// chat and voice, plus the local vendors people compare.
// Run: node docs/seo-europe-ai-research.mjs de|at|ch|it|fr|es|nl|uk|ie|pt|pl
// -> prints the top phrases per cluster and writes europe-kw-<market>.json in the
// cwd. Same rank-weighted scoring as the other harvests. Compare scores within a
// market, not across markets.
import fs from "node:fs";

const german = {
  agent: ["whatsapp ki agent", "whatsapp ki", "ki whatsapp", "whatsapp automatisierung", "whatsapp automatisieren", "whatsapp ki chatbot", "whatsapp ki assistent", "whatsapp ki kundenservice", "ki agent für unternehmen", "whatsapp bot für unternehmen"],
  voice: ["whatsapp anrufe ki", "whatsapp ki telefon", "ki telefonassistent whatsapp", "whatsapp anrufe automatisieren", "whatsapp sprachassistent", "ki anrufe", "ki voice agent", "voice agent", "voicebot", "ki telefonbot"],
  auto: ["whatsapp automatische antwort", "whatsapp business automatische antwort", "whatsapp abwesenheitsnachricht", "whatsapp auto reply", "whatsapp chatbot erstellen", "whatsapp chatbot kostenlos"],
  vendors: ["superchat alternative", "superchat kosten", "superchat erfahrungen", "chatarmin", "lime connect whatsapp", "userlike whatsapp", "trengo alternative", "wati alternative", "brevo whatsapp", "whatsapp business anbieter"],
  compare: ["beste whatsapp chatbot", "whatsapp chatbot vergleich", "whatsapp chatbot anbieter", "whatsapp ki anbieter", "whatsapp business tools", "ki telefonassistent vergleich"],
  privacy: ["whatsapp ki dsgvo", "whatsapp chatbot dsgvo", "ki telefonassistent dsgvo", "ki anruf dsgvo", "ki hinweis pflicht chatbot"],
};

const markets = {
  de: { hl: "de", gl: "de", kl: "de-de", clusters: german },
  at: { hl: "de", gl: "at", kl: "at-de", clusters: german },
  ch: { hl: "de", gl: "ch", kl: "ch-de", clusters: german },
  it: {
    hl: "it", gl: "it", kl: "it-it",
    clusters: {
      agent: ["agente ai whatsapp", "agente whatsapp", "ai whatsapp", "automazione whatsapp", "automatizzare whatsapp", "whatsapp ai", "assistente ai whatsapp", "assistente virtuale whatsapp", "chatbot ai whatsapp", "bot whatsapp aziende"],
      voice: ["agente vocale ai", "agente vocale whatsapp", "centralino ai", "centralino virtuale ai", "chiamate whatsapp ai", "assistente vocale ai", "voice agent", "voicebot", "segretaria virtuale ai", "telefonate con ai"],
      auto: ["risposte automatiche whatsapp", "risposta automatica whatsapp business", "messaggio di assenza whatsapp", "creare chatbot whatsapp", "chatbot whatsapp gratis"],
      vendors: ["spoki", "spoki prezzi", "spoki alternative", "callbell", "callbell prezzi", "callbell alternative", "wati alternative", "whatsapp business provider italia", "brevo whatsapp", "chatbot whatsapp italia"],
      compare: ["migliori chatbot whatsapp", "miglior chatbot whatsapp", "chatbot whatsapp confronto", "piattaforme whatsapp business", "migliori agenti ai", "miglior agente vocale ai"],
      privacy: ["whatsapp gdpr", "chatbot gdpr", "whatsapp business gdpr", "chiamate ai gdpr", "ai act chatbot obbligo"],
    },
  },
  fr: {
    hl: "fr", gl: "fr", kl: "fr-fr",
    clusters: {
      agent: ["agent ia whatsapp", "agent whatsapp", "ia whatsapp", "automatisation whatsapp", "automatiser whatsapp", "whatsapp ia", "assistant ia whatsapp", "chatbot ia whatsapp", "bot whatsapp entreprise"],
      voice: ["agent vocal ia", "agent vocal whatsapp", "appels whatsapp ia", "standard téléphonique ia", "assistant vocal ia", "voicebot", "répondeur ia", "secrétaire virtuelle ia", "agent téléphonique ia"],
      auto: ["réponse automatique whatsapp", "réponse automatique whatsapp business", "message d'absence whatsapp", "créer un chatbot whatsapp", "chatbot whatsapp gratuit"],
      vendors: ["kanal whatsapp", "alcmeon", "wati alternative", "landbot alternative", "brevo whatsapp", "crisp whatsapp", "solution whatsapp business", "whatsapp business france"],
      compare: ["meilleur chatbot whatsapp", "comparatif chatbot whatsapp", "meilleur agent vocal ia", "meilleur agent ia", "outil whatsapp business"],
      privacy: ["whatsapp rgpd", "chatbot rgpd", "agent vocal ia rgpd", "ia act chatbot obligation", "démarchage téléphonique ia"],
    },
  },
  es: {
    hl: "es", gl: "es", kl: "es-es",
    clusters: {
      agent: ["agente ia whatsapp", "agente whatsapp", "ia whatsapp", "automatización whatsapp", "automatizar whatsapp", "whatsapp ia", "asistente ia whatsapp", "chatbot ia whatsapp", "bot whatsapp empresas"],
      voice: ["agente de voz ia", "agente de voz whatsapp", "llamadas whatsapp ia", "llamadas con ia", "asistente de voz ia", "voicebot", "recepcionista virtual ia", "centralita virtual ia"],
      auto: ["respuesta automática whatsapp", "respuestas automáticas whatsapp business", "mensaje de ausencia whatsapp", "crear chatbot whatsapp", "chatbot whatsapp gratis"],
      vendors: ["landbot", "landbot precios", "landbot alternativas", "wati alternativas", "manychat alternativas", "kommo alternativas", "proveedor whatsapp business españa", "brevo whatsapp"],
      compare: ["mejores chatbots whatsapp", "mejor chatbot whatsapp", "comparativa chatbot whatsapp", "mejor agente de voz ia", "mejores agentes ia"],
      privacy: ["whatsapp rgpd", "chatbot rgpd", "whatsapp business rgpd", "llamadas ia rgpd", "ley ia chatbot obligación"],
    },
  },
  nl: {
    hl: "nl", gl: "nl", kl: "nl-nl",
    clusters: {
      agent: ["whatsapp ai agent", "ai agent whatsapp", "whatsapp ai", "whatsapp automatiseren", "whatsapp automatisering", "ai whatsapp", "whatsapp ai assistent", "whatsapp ai chatbot", "whatsapp bot bedrijf"],
      voice: ["ai voice agent", "ai voicebot", "ai telefoonassistent", "ai telefonist", "whatsapp bellen ai", "ai receptionist", "voicebot"],
      auto: ["whatsapp automatisch antwoord", "whatsapp business automatisch antwoord", "afwezigheidsbericht whatsapp", "whatsapp chatbot maken", "whatsapp chatbot gratis"],
      vendors: ["trengo", "trengo prijzen", "trengo alternatief", "wati alternatief", "chatwerk", "whatsapp business aanbieder", "brevo whatsapp"],
      compare: ["beste whatsapp chatbot", "whatsapp chatbot vergelijken", "beste ai voice agent", "whatsapp business tools"],
      privacy: ["whatsapp avg", "chatbot avg", "whatsapp zakelijk avg", "ai act chatbot verplichting"],
    },
  },
  uk: {
    hl: "en-GB", gl: "gb", kl: "uk-en",
    clusters: {
      agent: ["whatsapp ai agent", "whatsapp ai agent uk", "whatsapp automation", "whatsapp automation uk", "whatsapp business automation", "ai agent for whatsapp", "whatsapp ai assistant", "whatsapp chatbot uk"],
      voice: ["whatsapp voice agent", "ai voice agent", "ai voice agent uk", "ai calling agent uk", "whatsapp ai calls", "ai receptionist uk", "ai phone agent"],
      vendors: ["respond.io alternative", "wati alternative", "manychat whatsapp", "whatsapp business provider uk", "twilio whatsapp alternative"],
      compare: ["best whatsapp chatbot", "best whatsapp ai agent", "best whatsapp automation tool", "best ai voice agent", "whatsapp chatbot comparison"],
      privacy: ["whatsapp gdpr", "whatsapp chatbot gdpr", "is whatsapp gdpr compliant for business", "ai voice agent gdpr"],
    },
  },
  ie: {
    hl: "en-IE", gl: "ie", kl: "ie-en",
    clusters: {
      agent: ["whatsapp ai agent", "whatsapp automation", "whatsapp chatbot ireland", "whatsapp business ireland"],
      voice: ["ai receptionist ireland", "ai voice agent ireland", "whatsapp voice agent"],
    },
  },
  pt: {
    hl: "pt-PT", gl: "pt", kl: "pt-pt",
    clusters: {
      agent: ["agente ia whatsapp", "automatizar whatsapp", "chatbot whatsapp", "whatsapp ia", "assistente ia whatsapp"],
      voice: ["agente de voz ia", "chamadas whatsapp ia", "rececionista virtual", "assistente virtual telefónico"],
    },
  },
  pl: {
    hl: "pl", gl: "pl", kl: "pl-pl",
    clusters: {
      agent: ["chatbot whatsapp", "agent ai whatsapp", "automatyzacja whatsapp", "whatsapp ai", "whatsapp dla firm"],
      voice: ["agent głosowy ai", "voicebot", "asystent głosowy ai", "ai telefon"],
    },
  },
};

const market = process.argv[2];
const config = markets[market];
if (!config) throw new Error(`Usage: node docs/seo-europe-ai-research.mjs ${Object.keys(markets).join("|")}`);
const { hl, gl, kl, clusters } = config;
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
    const { cluster, name, url } = tasks.shift();
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
fs.writeFileSync(`europe-kw-${market}.json`, JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
for (const [c, list] of Object.entries(byCluster)) {
  const total = list.reduce((s, r) => s + r.score, 0);
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 12)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${r.phrase}`);
}
