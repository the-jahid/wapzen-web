// Malaysia research (see seo-research.md, "Malaysia posts"). Run from a scratch folder:
// node "<path>/seo-blog-malaysia-research.mjs" -> prints top phrases per cluster and writes
// blog-kw-malaysia.json in the cwd. Same rank-weighted scoring as the other harvests.
// Malaysians search in both Malay and English, so every seed runs through Google and
// YouTube twice (hl=ms and hl=en, both gl=my, ie/oe=utf-8) and DuckDuckGo twice
// (kl=my-ms and kl=my-en). Max score per suggestion slot is 10, so 6 sources.
import fs from "node:fs";

const clusters = {
  percuma: ["chatbot whatsapp percuma", "whatsapp bot percuma", "bot whatsapp percuma", "chatbot percuma", "ai chatbot percuma", "auto reply whatsapp percuma", "cara buat chatbot whatsapp", "cara buat bot whatsapp", "cara buat auto reply whatsapp", "free whatsapp chatbot malaysia", "chatbot ai malaysia"],
  whatsappBot: ["whatsapp chatbot malaysia", "whatsapp ai chatbot malaysia", "whatsapp bot malaysia", "chatbot whatsapp", "bot whatsapp", "ai whatsapp", "whatsapp ai", "ai whatsapp malaysia", "whatsapp automation malaysia", "whatsapp ai agent malaysia", "chatbot malaysia"],
  autoReply: ["auto reply whatsapp", "auto reply whatsapp business", "whatsapp business auto reply", "cara set auto reply whatsapp business", "mesej automatik whatsapp", "balasan automatik whatsapp", "contoh auto reply whatsapp business", "contoh greeting message whatsapp business", "greeting message whatsapp business", "away message whatsapp business", "quick reply whatsapp business"],
  business: ["whatsapp business", "whatsapp business malaysia", "cara guna whatsapp business", "whatsapp business percuma", "whatsapp business berbayar", "whatsapp business api malaysia", "whatsapp business api malaysia price", "whatsapp business api harga", "whatsapp api malaysia", "whatsapp crm malaysia", "whatsapp marketing malaysia", "whatsapp business account malaysia"],
  jualan: ["cara jual di whatsapp", "cara berniaga di whatsapp", "jualan online whatsapp", "order whatsapp", "sistem order whatsapp", "whatsapp order system malaysia", "kedai online whatsapp", "whatsapp catalogue", "dropship whatsapp", "cara dapatkan customer whatsapp", "whatsapp sales malaysia", "ai untuk bisnes"],
  makanan: ["order makanan whatsapp", "restoran whatsapp order", "kedai makan order whatsapp", "whatsapp ordering system for restaurant malaysia", "food delivery whatsapp malaysia", "catering whatsapp", "kek order whatsapp", "home baker whatsapp", "restaurant chatbot malaysia", "cloud kitchen malaysia"],
  servis: ["salon booking whatsapp", "booking system malaysia", "whatsapp booking system malaysia", "appointment booking whatsapp", "klinik whatsapp", "klinik gigi whatsapp", "clinic chatbot malaysia", "chatbot klinik", "tuition centre whatsapp", "pusat tuisyen", "workshop kereta booking", "car wash booking whatsapp"],
  hartanah: ["property agent malaysia ai", "ejen hartanah whatsapp", "real estate chatbot malaysia", "property chatbot", "ai for property agent", "hartanah ai", "homestay booking whatsapp", "homestay malaysia whatsapp", "hotel chatbot malaysia", "umrah travel agency malaysia whatsapp", "agensi pelancongan whatsapp"],
  aiBisnes: ["ai customer service malaysia", "ai receptionist malaysia", "ai agent malaysia", "ai for sme malaysia", "ai untuk perniagaan", "ai untuk peniaga", "chatgpt whatsapp", "chatgpt whatsapp malaysia", "meta ai whatsapp", "ai customer service", "khidmat pelanggan ai"],
  pesaing: ["wati malaysia", "wati pricing", "sleekflow malaysia", "sleekflow pricing", "respond.io malaysia", "respond.io pricing", "aisensy malaysia", "manychat whatsapp", "manychat malaysia", "whatsapp blast malaysia", "onsend malaysia", "whatsapp chatbot price malaysia"],
};

const google = (hl) => (q) => `https://suggestqueries.google.com/complete/search?client=firefox&hl=${hl}&gl=my&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`;
const youtube = (hl) => (q) => `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=${hl}&gl=my&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`;
const ddg = (kl) => (q) => `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}&kl=${kl}&type=list`;
const sources = {
  "google-ms": google("ms"),
  "google-en": google("en"),
  "youtube-ms": youtube("ms"),
  "youtube-en": youtube("en"),
  "ddg-ms": ddg("my-ms"),
  "ddg-en": ddg("my-en"),
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
fs.writeFileSync("blog-kw-malaysia.json", JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
const ranked = Object.entries(byCluster).map(([c, list]) => [c, list, list.reduce((s, r) => s + r.score, 0)]).sort((a, b) => b[2] - a[2]);
for (const [c, list, total] of ranked) {
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 22)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/6  ${r.phrase}`);
}
