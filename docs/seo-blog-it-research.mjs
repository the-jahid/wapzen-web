// Italian blog topic research (see seo-research.md, "Italian blog"). Run: node docs/seo-blog-it-research.mjs
// -> prints the top phrases per cluster and writes blog-kw-it.json in the cwd. Same
// rank-weighted scoring as seo-blog-topic-research.mjs, with Italian sources:
// Google and YouTube with hl/gl=it (ie/oe=utf-8 or accents come back mangled)
// and DuckDuckGo with kl=it-it. Bing's osjson ignores the market, so it is left out.
import fs from "node:fs";
const clusters = {
  prezziApi: ["whatsapp business api prezzi", "whatsapp business api costi", "quanto costa whatsapp business api", "whatsapp business è a pagamento", "whatsapp business costo", "costo messaggi whatsapp business", "tariffe whatsapp business", "whatsapp api costo"],
  appVsApi: ["differenza tra whatsapp e whatsapp business", "whatsapp business vs whatsapp", "whatsapp business o normale", "whatsapp business api cos'è", "whatsapp business platform", "whatsapp business app o api", "whatsapp business conviene"],
  chatbot: ["chatbot whatsapp", "come creare un chatbot whatsapp", "chatbot whatsapp cos'è", "chatbot whatsapp business", "chatbot whatsapp come funziona", "bot whatsapp", "come creare un bot su whatsapp", "chatbot per whatsapp"],
  chatgpt: ["chatgpt whatsapp", "chatgpt su whatsapp", "chatgpt whatsapp numero", "come usare chatgpt su whatsapp", "numero chatgpt whatsapp italia", "intelligenza artificiale whatsapp", "meta ai whatsapp", "come togliere meta ai da whatsapp"],
  messaggi: ["messaggio di benvenuto whatsapp business", "messaggio di assenza whatsapp business", "messaggi automatici whatsapp business", "risposte rapide whatsapp business", "messaggio di benvenuto whatsapp business esempi", "messaggio di assenza whatsapp esempi", "frasi benvenuto whatsapp business"],
  prenotazioni: ["prenotazioni whatsapp", "prenotazione appuntamenti whatsapp", "whatsapp per ristoranti", "prenotazioni ristorante whatsapp", "whatsapp parrucchiere prenotazioni", "agenda appuntamenti whatsapp", "promemoria appuntamenti whatsapp", "ordini su whatsapp"],
  ban: ["whatsapp bannato", "numero bannato whatsapp", "whatsapp business bannato", "come evitare ban whatsapp", "account whatsapp bloccato", "whatsapp account sospeso"],
  marketing: ["whatsapp marketing", "whatsapp marketing italia", "lista broadcast whatsapp", "messaggi broadcast whatsapp business", "come usare whatsapp business per vendere", "whatsapp per aziende", "whatsapp business consigli"],
  competitors: ["spoki", "spoki prezzi", "spoki whatsapp", "callbell", "callbell prezzi", "alternative a spoki", "wati whatsapp", "piattaforma whatsapp business api"],
  chiamate: ["chiamate whatsapp business", "segreteria telefonica whatsapp", "rispondere automaticamente chiamate whatsapp", "assistente vocale ai", "segretaria virtuale ai", "risponditore automatico ai", "intelligenza artificiale che risponde al telefono"],
  catalogo: ["catalogo whatsapp business", "come creare catalogo whatsapp business", "carrello whatsapp business", "vendere su whatsapp", "negozio whatsapp"],
};
const sources = {
  gIT: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&hl=it&gl=it&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`,
  ytIT: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=it&gl=it&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`,
  ddgIT: (q) => `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}&kl=it-it&type=list`,
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
fs.writeFileSync("blog-kw-it.json", JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
for (const [c, list] of Object.entries(byCluster)) {
  const total = list.reduce((s, r) => s + r.score, 0);
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 14)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${r.phrase}`);
}
