// Indonesia business posts research (see seo-research.md, "Indonesia business posts"). Run:
// node docs/seo-blog-indonesia-research.mjs -> prints the top phrases per cluster and writes
// blog-kw-indonesia.json in the cwd. Same rank-weighted scoring as
// seo-blog-peru-research.mjs: Google and YouTube autocomplete with hl=id, gl=id
// (ie/oe=utf-8) and DuckDuckGo with kl=id-en. The clusters follow Indonesia's largest
// groups of small businesses (UMKM): food and drink, online shops, beauty, property,
// health, workshops and rentals. Schools and Umrah travel already have posts (2026-11-03).
import fs from "node:fs";

const clusters = {
  kuliner: ["chatbot restoran", "chatbot whatsapp restoran", "pesan makanan lewat whatsapp", "order makanan via whatsapp", "whatsapp untuk restoran", "bot whatsapp warung makan", "aplikasi pesan antar makanan sendiri", "chatbot untuk usaha kuliner", "ai untuk usaha kuliner", "format order makanan whatsapp", "katering whatsapp", "chatbot cafe", "pre order makanan whatsapp"],
  olshop: ["chatbot olshop", "chatbot online shop", "chatbot whatsapp jualan", "cara jualan di whatsapp", "jualan online lewat whatsapp", "auto reply whatsapp olshop", "admin olshop", "admin online shop", "ai untuk jualan online", "bot whatsapp jualan", "format order whatsapp", "cs online shop", "chatbot toko online", "ai customer service olshop"],
  kecantikan: ["chatbot klinik kecantikan", "whatsapp klinik kecantikan", "chatbot salon", "booking salon whatsapp", "chatbot barbershop", "reservasi via whatsapp", "admin klinik kecantikan", "chatbot skincare", "ai untuk klinik kecantikan", "booking barbershop online"],
  properti: ["chatbot properti", "whatsapp marketing properti", "ai untuk agen properti", "chatbot real estate", "admin properti", "chatbot perumahan", "cara jualan rumah lewat whatsapp", "crm properti", "ai marketing properti"],
  kesehatan: ["chatbot klinik", "chatbot klinik gigi", "whatsapp klinik", "pendaftaran pasien via whatsapp", "chatbot rumah sakit", "admin klinik", "chatbot apotek", "reservasi dokter whatsapp", "ai untuk klinik"],
  wisata: ["chatbot hotel", "whatsapp hotel", "chatbot villa bali", "booking villa whatsapp", "chatbot tour travel", "ai untuk travel agent", "admin travel", "chatbot homestay", "reservasi hotel via whatsapp"],
  jasa: ["chatbot bengkel", "booking servis bengkel whatsapp", "chatbot laundry", "laundry whatsapp", "chatbot rental mobil", "rental mobil whatsapp", "chatbot kost", "chatbot ekspedisi", "chatbot toko bangunan", "chatbot gym", "chatbot kursus", "chatbot percetakan"],
  gratis: ["chatbot whatsapp", "chatbot whatsapp gratis", "bot whatsapp gratis", "bot whatsapp", "ai whatsapp", "ai untuk whatsapp", "auto reply whatsapp", "auto reply whatsapp ai", "cara membuat chatbot whatsapp", "chatbot whatsapp ai gratis", "chatbot ai indonesia", "aplikasi chatbot whatsapp", "ai customer service", "ai cs whatsapp"],
  bisnis: ["whatsapp business", "whatsapp business api", "harga whatsapp business api", "whatsapp business api gratis", "pesan otomatis whatsapp business", "balas otomatis whatsapp business", "whatsapp business berbayar", "biaya whatsapp business api"],
};

const hl = "id", gl = "id", kl = "id-en";
const sources = {
  google: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&hl=${hl}&gl=${gl}&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`,
  youtube: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=${hl}&gl=${gl}&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`,
  ddg: (q) => `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}&kl=${kl}&type=list`,
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function suggestions(url) {
  for (let a = 0; a < 3; a++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      const data = JSON.parse(await res.text());
      return (Array.isArray(data) ? data[1] : null) ?? (Array.isArray(data) ? data.map((d) => d.phrase).filter(Boolean) : []);
    } catch { await sleep(500); }
  }
  return [];
}
const tasks = [];
for (const [cluster, seeds] of Object.entries(clusters)) for (const q of seeds) for (const [name, url] of Object.entries(sources)) tasks.push({ cluster, q, name, url: url(q) });
const scores = new Map();
async function worker() {
  while (tasks.length) {
    const { cluster, name, url } = tasks.shift();
    (await suggestions(url)).forEach((phrase, rank) => {
      if (typeof phrase !== "string") return;
      const key = phrase.toLowerCase().trim();
      const e = scores.get(key) ?? { score: 0, sources: new Set(), clusters: new Set() };
      e.score += 10 - Math.min(rank, 9); e.sources.add(name); e.clusters.add(cluster); scores.set(key, e);
    });
    await sleep(80);
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
const rows = [...scores].map(([phrase, e]) => ({ phrase, score: e.score, sources: e.sources.size, cluster: [...e.clusters].join("+") })).sort((a, b) => b.score - a.score);
fs.writeFileSync("blog-kw-indonesia.json", JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
const ranked = Object.entries(byCluster).map(([c, list]) => [c, list, list.reduce((s, r) => s + r.score, 0)]).sort((a, b) => b[2] - a[2]);
for (const [c, list, total] of ranked) {
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 16)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${r.phrase}`);
}
