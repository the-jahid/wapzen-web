// Italy industry research (see seo-research.md, "Italy buyer posts"). Run from a scratch
// folder: node "<path>/seo-blog-it-verticals-research.mjs" -> prints the top phrases per
// vertical and writes blog-kw-it-verticals.json in the cwd. Same rank-weighted scoring as
// seo-blog-spain-research.mjs: Google and YouTube with hl=it, gl=it, and DuckDuckGo with its
// it-it region. Seeds use the words the owners search for, plus a WhatsApp phrase.
import fs from "node:fs";

const verticals = {
  ristoranti: ["chatbot ristorante", "prenotazioni ristorante whatsapp", "whatsapp ristorante", "ia per ristoranti", "intelligenza artificiale ristoranti", "software prenotazioni ristorante", "ordini whatsapp ristorante", "ordini whatsapp senza commissioni", "gestionale prenotazioni ristorante", "alternativa thefork"],
  pizzerie: ["whatsapp pizzeria", "ordini whatsapp pizzeria", "chatbot pizzeria", "software pizzeria asporto", "gestionale pizzeria", "pizzeria asporto whatsapp"],
  parrucchieri: ["chatbot parrucchieri", "whatsapp parrucchiere", "prenotazioni parrucchiere whatsapp", "gestionale parrucchieri", "software parrucchieri", "app prenotazioni parrucchiere", "ia per parrucchieri", "marketing parrucchieri"],
  estetica: ["chatbot centro estetico", "whatsapp centro estetico", "gestionale centro estetico", "software centro estetico", "prenotazioni centro estetico", "ia per centri estetici", "marketing centro estetico", "app prenotazioni centro estetico"],
  dentisti: ["chatbot studio dentistico", "whatsapp studio dentistico", "gestionale studio dentistico", "software studio dentistico", "ia per dentisti", "intelligenza artificiale studio dentistico", "segretaria virtuale studio dentistico", "promemoria appuntamenti dentista whatsapp", "marketing studio dentistico"],
  medici: ["whatsapp studio medico", "segretaria virtuale studio medico", "chatbot studio medico", "ia per medici", "software studio medico", "whatsapp medico di base"],
  fisioterapia: ["whatsapp fisioterapista", "gestionale fisioterapisti", "software fisioterapia", "ia per fisioterapisti", "marketing fisioterapisti"],
  immobiliare: ["chatbot agenzia immobiliare", "ia per agenzie immobiliari", "intelligenza artificiale immobiliare", "whatsapp agenzia immobiliare", "gestionale immobiliare", "crm immobiliare", "acquisizione clienti immobiliare", "agente ai immobiliare"],
  hotel: ["chatbot hotel", "whatsapp hotel", "ia per hotel", "intelligenza artificiale hotel", "chatbot b&b", "whatsapp b&b", "software case vacanza", "whatsapp case vacanze", "ia per strutture ricettive", "whatsapp agriturismo"],
  negozi: ["whatsapp negozio", "whatsapp per negozi", "chatbot negozio", "vendere su whatsapp", "catalogo whatsapp negozio", "ia per negozi", "ordini whatsapp negozio"],
  ecommerce: ["chatbot whatsapp ecommerce", "whatsapp ecommerce", "whatsapp shopify", "woocommerce whatsapp", "carrello abbandonato whatsapp", "assistenza clienti ecommerce whatsapp"],
  officine: ["whatsapp officina", "chatbot officina", "gestionale officina", "software officina meccanica", "ia per officine", "marketing officina meccanica", "appuntamento officina whatsapp"],
  concessionarie: ["chatbot concessionaria", "whatsapp concessionaria", "crm concessionaria", "ia per concessionarie", "autosalone whatsapp"],
  palestre: ["chatbot palestra", "whatsapp palestra", "gestionale palestra", "software palestra", "ia per palestre", "marketing palestra", "whatsapp centro pilates"],
  scuole: ["whatsapp scuola guida", "gestionale autoscuola", "marketing autoscuola", "whatsapp scuola di lingue", "ia per scuole di formazione", "chatbot scuola", "whatsapp ente di formazione"],
  commercialisti: ["whatsapp commercialista", "ia per commercialisti", "chatbot commercialista", "software studio commercialista", "intelligenza artificiale commercialisti"],
  avvocati: ["whatsapp avvocato", "ia per avvocati", "chatbot studio legale", "intelligenza artificiale avvocati", "segretaria virtuale avvocati"],
  assicurazioni: ["whatsapp agenzia assicurativa", "chatbot assicurazioni", "ia per agenti assicurativi", "crm agenzia assicurativa", "whatsapp assicurazione"],
  farmacie: ["whatsapp farmacia", "chatbot farmacia", "ia per farmacie", "prenotazione farmaci whatsapp", "marketing farmacia"],
  artigiani: ["whatsapp idraulico", "whatsapp per artigiani", "gestionale artigiani", "ia per artigiani", "preventivi whatsapp", "ia per imprese edili", "chatbot impresa edile"],
  veterinari: ["whatsapp veterinario", "gestionale veterinario", "ia per veterinari", "promemoria vaccini whatsapp"],
  generic: ["chatbot whatsapp gratis", "chatbot whatsapp italiano", "chatbot per whatsapp business", "whatsapp business ia", "whatsapp intelligenza artificiale", "agente ai whatsapp", "agente vocale ai", "segretaria virtuale ai", "centralino ai", "centralino virtuale ai", "chiamate con ai", "risposta automatica whatsapp", "automatizzare whatsapp", "whatsapp per aziende", "receptionist ai"],
};

const hl = "it", gl = "it", kl = "it-it";
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
for (const [cluster, seeds] of Object.entries(verticals)) for (const q of seeds) for (const [name, url] of Object.entries(sources)) tasks.push({ cluster, name, url: url(q) });
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
fs.writeFileSync("blog-kw-it-verticals.json", JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
const ranked = Object.entries(byCluster).map(([c, list]) => [c, list, list.reduce((s, r) => s + r.score, 0)]).sort((a, b) => b[2] - a[2]);
for (const [c, list, total] of ranked) {
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 14)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${r.phrase}`);
}
