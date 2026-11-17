// Which industries get the next three English posts (see seo-research.md, "Industry pick
// 2026-11-17"). Run: node docs/seo-blog-industry-pick-research.mjs [out.json]
// Same rank-weighted scoring as seo-blog-gym-research.mjs (10 points for the first
// suggestion down to 1), summed over Google in the US, India, the UK, Nigeria and South Africa
// plus DuckDuckGo in the US, India and the UK, so a phrase's sources are out of 8.
// Industries already covered in English (gyms, clinics, real estate, coaching, restaurants,
// travel agents, food ordering) and the three removed on 2026-11-17 (restaurants, dental,
// salons) are left out on purpose.
import fs from "node:fs";

const industries = {
  hotel: ["hotel", "hotels"],
  carDealer: ["car dealership", "car dealers"],
  autoRepair: ["auto repair shop", "car service center"],
  insurance: ["insurance agents", "insurance agency"],
  clothing: ["clothing store", "boutique"],
  pharmacy: ["pharmacy", "pharmacies"],
  school: ["schools", "school"],
  lawFirm: ["law firms", "lawyers"],
  homeServices: ["cleaning business", "plumbers"],
  vet: ["veterinary clinic", "pet shop"],
  bakery: ["bakery", "cake shop"],
  tourOperator: ["tour operators", "tour company"],
  events: ["wedding planners", "event planners"],
  jewelry: ["jewelry store", "jewellery shop"],
  furniture: ["furniture store", "furniture business"],
  grocery: ["grocery store", "supermarket"],
};
const templates = [
  (x) => `whatsapp chatbot for ${x}`,
  (x) => `ai chatbot for ${x}`,
  (x) => `ai for ${x}`,
  (x) => `ai receptionist for ${x}`,
  (x) => `whatsapp for ${x}`,
  (x) => `${x} whatsapp`,
];

const google = (gl, hl) => (q) => `https://suggestqueries.google.com/complete/search?client=firefox&hl=${hl}&gl=${gl}&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`;
const ddg = (kl) => (q) => `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}&kl=${kl}&type=list`;
const sources = {
  "google-us": google("us", "en"), "google-in": google("in", "en-IN"), "google-gb": google("gb", "en-GB"),
  "google-ng": google("ng", "en-NG"), "google-za": google("za", "en-ZA"),
  "ddg-us": ddg("us-en"), "ddg-in": ddg("in-en"), "ddg-uk": ddg("uk-en"),
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function suggestions(url) {
  for (let a = 0; a < 3; a++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      const data = JSON.parse(await res.text());
      return Array.isArray(data) ? (Array.isArray(data[1]) ? data[1] : data.map((d) => d.phrase).filter(Boolean)) : [];
    } catch { await sleep(500); }
  }
  return [];
}

const tasks = [];
for (const [industry, words] of Object.entries(industries))
  for (const w of words) for (const t of templates) for (const [name, url] of Object.entries(sources)) tasks.push({ industry, seed: t(w), name, url: url(t(w)) });

const phrases = new Map(); // phrase -> { score, sources:Set, industries:Set }
const seedHits = new Map(); // industry -> seeds that returned anything
async function worker() {
  while (tasks.length) {
    const { industry, seed, name, url } = tasks.shift();
    const list = await suggestions(url);
    if (list.length) (seedHits.get(industry) ?? seedHits.set(industry, new Set()).get(industry)).add(seed);
    list.forEach((phrase, rank) => {
      const key = String(phrase).toLowerCase().trim();
      const e = phrases.get(key) ?? { score: 0, sources: new Set(), industries: new Set() };
      e.score += 10 - Math.min(rank, 9); e.sources.add(name); e.industries.add(industry); phrases.set(key, e);
    });
    await sleep(70);
  }
}
await Promise.all(Array.from({ length: 5 }, worker));

const rows = [...phrases].map(([phrase, e]) => ({ phrase, score: e.score, sources: e.sources.size, industry: [...e.industries].join("+") })).sort((a, b) => b.score - a.score);
fs.writeFileSync(process.argv[2] ?? "blog-kw-industry-pick.json", JSON.stringify(rows, null, 1));

// Industry ranking: total score, and the part that names WhatsApp or AI chat (buyer intent).
const intent = /whatsapp|chatbot|chat bot|\bai\b|receptionist|automation|bot\b/;
const byIndustry = {};
for (const r of rows) for (const i of r.industry.split("+")) (byIndustry[i] ??= []).push(r);
const ranked = Object.entries(byIndustry).map(([i, list]) => ({
  i, list,
  total: list.reduce((s, r) => s + r.score, 0),
  intent: list.filter((r) => intent.test(r.phrase)).reduce((s, r) => s + r.score, 0),
  whatsapp: list.filter((r) => r.phrase.includes("whatsapp")).reduce((s, r) => s + r.score, 0),
  seeds: seedHits.get(i)?.size ?? 0,
})).sort((a, b) => b.intent - a.intent);
console.log("industry        intent  whatsapp  total  seeds-with-results/12");
for (const r of ranked) console.log(`${r.i.padEnd(15)} ${String(r.intent).padStart(6)} ${String(r.whatsapp).padStart(9)} ${String(r.total).padStart(6)}  ${r.seeds}`);
for (const r of ranked.slice(0, 8)) {
  console.log(`\n## ${r.i}`);
  for (const p of r.list.filter((x) => intent.test(x.phrase)).slice(0, 14)) console.log(`${String(p.score).padStart(4)}  ${p.sources}/8  ${p.phrase}`);
}
