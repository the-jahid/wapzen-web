// Finland research (see seo-research.md, "Finland posts"). Run from a scratch folder:
// node "<path>/seo-blog-finland-research.mjs" -> prints top phrases per cluster and writes
// blog-kw-finland.json in the cwd. Same rank-weighted scoring as the other harvests:
// Google and YouTube with hl=fi, gl=fi (ie/oe=utf-8 keeps ä and ö) and DuckDuckGo with
// kl=fi-fi.
import fs from "node:fs";

const clusters = {
  ilmainen: ["ilmainen chatbot", "ilmainen whatsapp chatbot", "whatsapp chatbot ilmainen", "ilmainen tekoäly chatbot", "ilmainen chatbotti", "chatbot ilmaiseksi", "tekoäly chatbot ilmainen", "ilmainen tekoälyagentti", "ilmainen asiakaspalvelubotti", "chatbot hinta", "chatbotin hinta", "paras chatbot yritykselle"],
  whatsappBot: ["whatsapp chatbot", "whatsapp chatbotti", "whatsapp botti", "whatsapp tekoäly", "tekoäly whatsapp", "whatsapp tekoälyagentti", "whatsapp ai agentti", "whatsapp chatbot yritykselle", "whatsapp asiakaspalvelu", "whatsapp asiakaspalvelu tekoäly", "chatbot whatsappiin", "whatsapp automaatio"],
  business: ["whatsapp business", "whatsapp business hinta", "onko whatsapp business ilmainen", "whatsapp business maksullinen", "whatsapp business ilmainen", "whatsapp business yritykselle", "whatsapp yrityskäyttöön", "whatsapp business api", "whatsapp business api hinta", "whatsapp business ero", "whatsapp business käyttöönotto", "whatsapp business kokemuksia", "whatsapp yritystili"],
  automaattinen: ["whatsapp automaattinen vastaus", "whatsapp business automaattinen vastaus", "whatsapp automaattiviesti", "whatsapp poissaoloviesti", "whatsapp tervetuloviesti", "whatsapp pikavastaukset", "automaattinen vastaus whatsapp", "whatsapp viestien automatisointi", "whatsapp ajastettu viesti", "whatsapp business viestipohjat"],
  tekoaly: ["tekoäly asiakaspalvelu", "tekoäly asiakaspalvelussa", "tekoälyagentti", "tekoälyagentti yritykselle", "tekoäly pienyritykselle", "tekoäly yrittäjälle", "tekoälyavustaja yritykselle", "ai agentti", "ai asiakaspalvelu", "tekoäly puhelinvastaaja", "tekoäly vastaa puhelimeen", "chatgpt whatsapp", "chatgpt whatsapp suomi", "meta ai whatsapp"],
  kauneus: ["kampaamo ajanvaraus whatsapp", "ajanvaraus whatsapp", "whatsapp ajanvaraus", "kampaamo tekoäly", "kampaamo chatbot", "parturi ajanvaraus", "kauneushoitola ajanvaraus", "ajanvarausjärjestelmä ilmainen", "ilmainen ajanvarausjärjestelmä", "ajanvarausjärjestelmä kampaamo", "ajanvarausjärjestelmä hinta", "timma hinta", "ajanvaraus tekoäly"],
  matkailu: ["mökkivuokraus whatsapp", "majoitus chatbot", "hotelli chatbot", "matkailuyritys tekoäly", "tekoäly matkailu", "safari varaus whatsapp", "airbnb automaattiviestit", "airbnb viestit automaattisesti", "majoitusyritys asiakaspalvelu", "ravintola pöytävaraus whatsapp", "ravintola chatbot", "ravintola tekoäly"],
  kauppa: ["verkkokauppa chatbot", "verkkokauppa asiakaspalvelu tekoäly", "verkkokauppa whatsapp", "whatsapp verkkokauppa", "whatsapp tilaus", "tilaukset whatsapp", "whatsapp myynti", "whatsapp markkinointi", "whatsapp kanava yritykselle", "whatsapp massaviesti", "whatsapp ryhmäviesti yritys"],
  palvelut: ["kiinteistönvälittäjä tekoäly", "kiinteistönvälitys chatbot", "hammaslääkäri chatbot", "autokorjaamo ajanvaraus", "siivousyritys asiakashankinta", "remonttifirma asiakashankinta", "yrittäjä puhelut jää vastaamatta", "puhelinvastaaja yritykselle", "puhelinpalvelu yritykselle hinta", "vastaamattomat puhelut yritys", "toiminimi asiakaspalvelu", "yksinyrittäjä tekoäly"],
  kilpailijat: ["leadoo hinta", "giosg hinta", "getjenny hinta", "ninchat hinta", "smartsupp hinta", "tidio hinta", "tidio suomi", "manychat suomi", "chatbot suomeksi", "suomenkielinen chatbot", "suomenkielinen tekoäly", "tekoäly suomeksi"],
  english: ["whatsapp chatbot finland", "ai chatbot finland", "whatsapp business finland", "free whatsapp chatbot", "whatsapp ai agent finland", "customer service chatbot finland", "whatsapp api finland"],
};

const hl = "fi";
const gl = "fi";
const kl = "fi-fi";
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
for (const [cluster, seeds] of Object.entries(clusters)) for (const q of seeds) for (const [name, url] of Object.entries(sources)) tasks.push({ cluster, name, url: url(q) });
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
fs.writeFileSync("blog-kw-finland.json", JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
const ranked = Object.entries(byCluster).map(([c, list]) => [c, list, list.reduce((s, r) => s + r.score, 0)]).sort((a, b) => b[2] - a[2]);
for (const [c, list, total] of ranked) {
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 24)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${r.phrase}`);
}
