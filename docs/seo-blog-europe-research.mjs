// European blog topic research, one post per market (see seo-research.md,
// "European blogs"). Run: node docs/seo-blog-europe-research.mjs uk|de|fr|es|nl
// -> prints the top phrases per cluster and writes blog-kw-<market>.json in the
// cwd. Same rank-weighted scoring as seo-blog-it-research.mjs. The seeds lean to
// buyer intent (prices, providers, GDPR, software for a business) because these
// posts are for businesses ready to pay for a tool, not for app how-tos.
import fs from "node:fs";

const markets = {
  uk: {
    hl: "en-GB", gl: "gb", kl: "uk-en",
    clusters: {
      apiPricing: ["whatsapp business api pricing uk", "whatsapp business api cost uk", "whatsapp business pricing uk", "how much does whatsapp business api cost", "whatsapp business api providers uk", "whatsapp marketing message cost uk"],
      receptionist: ["ai receptionist uk", "virtual receptionist uk", "ai receptionist for small business uk", "ai call answering service uk", "ai phone answering uk", "virtual receptionist cost uk", "telephone answering service uk"],
      chatbot: ["whatsapp chatbot uk", "whatsapp chatbot for business uk", "ai chatbot for small business uk", "whatsapp ai agent", "whatsapp business automation uk", "whatsapp ai assistant for business"],
      gdpr: ["whatsapp gdpr", "is whatsapp gdpr compliant", "whatsapp business gdpr uk", "whatsapp for business data protection", "ico whatsapp guidance", "whatsapp chatbot gdpr"],
      industries: ["whatsapp for estate agents", "whatsapp for dentists uk", "whatsapp for salons uk", "ai receptionist for dentists uk", "ai receptionist for tradesmen", "ai receptionist for plumbers uk"],
      calling: ["ai voice agent uk", "ai calling agent uk", "ai phone agent", "whatsapp business calling", "ai answering machine for business"],
    },
  },
  de: {
    hl: "de", gl: "de", kl: "de-de",
    clusters: {
      kosten: ["whatsapp business api kosten", "whatsapp business kosten", "whatsapp business api preise", "whatsapp business api anbieter", "whatsapp business kostenpflichtig", "whatsapp marketing kosten", "whatsapp business api anbieter vergleich"],
      dsgvo: ["whatsapp business dsgvo", "whatsapp dsgvo konform", "whatsapp business dsgvo konform nutzen", "whatsapp unternehmen dsgvo", "whatsapp chatbot dsgvo", "whatsapp business datenschutz", "whatsapp business api dsgvo"],
      chatbot: ["whatsapp chatbot", "whatsapp chatbot erstellen", "whatsapp chatbot für unternehmen", "whatsapp bot", "whatsapp ki chatbot", "whatsapp business automatisierung", "whatsapp ki assistent"],
      telefon: ["ki telefonassistent", "ki telefonassistent kosten", "ki telefonie", "ki telefonbot", "ki anrufbeantworter", "telefonassistent ki für unternehmen", "ki sekretärin telefon", "virtuelle telefonassistenz"],
      branchen: ["ki telefonassistent arztpraxis", "ki telefonassistent handwerk", "whatsapp für arztpraxen", "whatsapp für handwerker", "ki telefonassistent zahnarzt", "whatsapp immobilienmakler"],
      marketing: ["whatsapp marketing", "whatsapp newsletter", "whatsapp business broadcast", "whatsapp für unternehmen", "whatsapp business tipps"],
    },
  },
  fr: {
    hl: "fr", gl: "fr", kl: "fr-fr",
    clusters: {
      prix: ["whatsapp business api prix", "whatsapp business api tarif", "whatsapp business payant", "prix whatsapp business", "whatsapp business api fournisseur", "coût message whatsapp business", "whatsapp business api solution"],
      rgpd: ["whatsapp rgpd", "whatsapp business rgpd", "whatsapp entreprise rgpd", "whatsapp professionnel rgpd", "chatbot rgpd", "whatsapp cnil"],
      chatbot: ["chatbot whatsapp", "chatbot whatsapp business", "créer un chatbot whatsapp", "chatbot whatsapp gratuit", "bot whatsapp", "chatbot whatsapp ia", "automatisation whatsapp business"],
      telephone: ["agent vocal ia", "standard téléphonique ia", "agent ia téléphonique", "standard téléphonique virtuel", "secrétariat téléphonique ia", "répondeur ia", "assistant vocal ia entreprise", "standardiste virtuelle"],
      secteurs: ["secrétariat médical ia", "agent vocal ia restaurant", "standard téléphonique ia cabinet médical", "whatsapp immobilier", "whatsapp restaurant", "whatsapp artisan"],
      marketing: ["whatsapp marketing", "whatsapp business entreprise", "whatsapp pour les entreprises", "campagne whatsapp", "whatsapp business conseils"],
    },
  },
  es: {
    hl: "es", gl: "es", kl: "es-es",
    clusters: {
      precio: ["whatsapp business api precio", "whatsapp business api precios españa", "cuanto cuesta whatsapp business api", "whatsapp business de pago", "proveedores whatsapp business api", "precio mensajes whatsapp business", "whatsapp business api coste"],
      rgpd: ["whatsapp rgpd", "whatsapp business rgpd", "whatsapp empresa rgpd", "whatsapp lopd", "whatsapp business protección de datos", "chatbot rgpd"],
      chatbot: ["chatbot whatsapp", "chatbot para whatsapp", "chatbot whatsapp business", "crear chatbot whatsapp", "bot whatsapp", "chatbot whatsapp ia", "automatizar whatsapp business"],
      telefono: ["recepcionista virtual", "recepcionista virtual ia", "asistente telefónico ia", "agente de voz ia", "centralita virtual ia", "contestador automático ia", "secretaria virtual ia", "atención telefónica ia"],
      sectores: ["recepcionista virtual clínica", "whatsapp para clínicas", "whatsapp para inmobiliarias", "whatsapp para restaurantes", "asistente ia para clínica dental", "whatsapp peluquería"],
      marketing: ["whatsapp marketing", "whatsapp para empresas", "whatsapp business empresa", "campañas whatsapp", "whatsapp business consejos"],
    },
  },
  nl: {
    hl: "nl", gl: "nl", kl: "nl-nl",
    clusters: {
      kosten: ["whatsapp business api kosten", "whatsapp business kosten", "whatsapp zakelijk kosten", "whatsapp business api aanbieders", "whatsapp business betalen", "whatsapp business api prijs", "kosten whatsapp berichten zakelijk"],
      avg: ["whatsapp avg", "whatsapp zakelijk avg", "whatsapp business avg", "mag whatsapp zakelijk", "whatsapp privacy zakelijk", "chatbot avg"],
      chatbot: ["whatsapp chatbot", "whatsapp chatbot maken", "whatsapp bot", "chatbot whatsapp zakelijk", "whatsapp ai chatbot", "whatsapp automatiseren", "whatsapp business automatisch antwoord"],
      telefoon: ["ai telefoonassistent", "ai receptionist", "ai telefonist", "virtuele receptionist", "telefoon beantwoorden ai", "ai voicebot", "ai telefoon bot", "telefonische bereikbaarheid ai"],
      branches: ["ai receptionist tandarts", "ai telefoonassistent huisarts", "whatsapp makelaar", "whatsapp kapper afspraak", "whatsapp restaurant reserveren", "ai telefoonassistent installateur"],
      marketing: ["whatsapp marketing", "whatsapp zakelijk", "whatsapp voor bedrijven", "whatsapp business tips", "whatsapp nieuwsbrief"],
    },
  },
};

const market = process.argv[2];
const config = markets[market];
if (!config) throw new Error(`Usage: node docs/seo-blog-europe-research.mjs ${Object.keys(markets).join("|")}`);
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
fs.writeFileSync(`blog-kw-${market}.json`, JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
for (const [c, list] of Object.entries(byCluster)) {
  const total = list.reduce((s, r) => s + r.score, 0);
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 14)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${r.phrase}`);
}
