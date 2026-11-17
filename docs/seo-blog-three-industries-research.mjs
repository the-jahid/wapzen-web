// Long-tail phrases for the three industry posts of 2026-11-17 (hotels, schools, car
// dealerships), picked by seo-blog-industry-pick-research.mjs. See seo-research.md,
// "Industry pick 2026-11-17". Run: node docs/seo-blog-three-industries-research.mjs [out.json]
// Same rank-weighted scoring; Google in the US, India, the UK, Nigeria and South Africa,
// DuckDuckGo in the US, India and the UK (8 sources).
import fs from "node:fs";

const clusters = {
  hotel: ["ai chatbot for hotels", "whatsapp chatbot for hotels", "ai receptionist for hotels", "whatsapp for hotels", "ai for hotel booking", "ai front desk for hotels", "hotel whatsapp booking", "hotel whatsapp message", "hotel booking confirmation message", "hotel guest message", "ai concierge hotel", "hotel chatbot", "whatsapp business for hotels", "guest house whatsapp", "resort whatsapp"],
  school: ["whatsapp for schools", "ai chatbot for school", "ai receptionist for schools", "whatsapp business for schools", "school admission enquiry", "school admission message", "school fees reminder message", "school chatbot", "ai for school admissions", "school whatsapp message to parents", "parent communication app", "school enquiry", "whatsapp chatbot for school", "ai for schools"],
  car: ["ai for car dealerships", "ai receptionist for car dealerships", "ai chatbot for car dealership", "whatsapp for car dealers", "car dealer whatsapp", "car dealership chatbot", "ai bdc", "car dealership lead follow up", "car dealer follow up message", "test drive booking", "used car dealer whatsapp", "car showroom whatsapp", "ai for car sales", "whatsapp chatbot for car dealers", "car dealership whatsapp marketing"],
};
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
for (const [cluster, seeds] of Object.entries(clusters))
  for (const q of seeds) for (const [name, url] of Object.entries(sources)) tasks.push({ cluster, name, url: url(q) });
const scores = new Map();
async function worker() {
  while (tasks.length) {
    const { cluster, name, url } = tasks.shift();
    (await suggestions(url)).forEach((phrase, rank) => {
      const key = String(phrase).toLowerCase().trim();
      const e = scores.get(key) ?? { score: 0, sources: new Set(), clusters: new Set() };
      e.score += 10 - Math.min(rank, 9); e.sources.add(name); e.clusters.add(cluster); scores.set(key, e);
    });
    await sleep(70);
  }
}
await Promise.all(Array.from({ length: 5 }, worker));
const rows = [...scores].map(([phrase, e]) => ({ phrase, score: e.score, sources: e.sources.size, cluster: [...e.clusters].join("+") })).sort((a, b) => b.score - a.score);
fs.writeFileSync(process.argv[2] ?? "blog-kw-three-industries.json", JSON.stringify(rows, null, 1));
// Only phrases that name the industry, so generic fallbacks don't fill the lists.
const names = { hotel: /hotel|guest|resort|concierge|front desk|hospitality/, school: /school|admission|parent|student|fee/, car: /car|dealer|auto|vehicle|test drive|bdc|showroom/ };
for (const [c, re] of Object.entries(names)) {
  console.log(`\n## ${c}`);
  for (const r of rows.filter((x) => x.cluster.split("+").includes(c) && re.test(x.phrase)).slice(0, 40)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/8  ${r.phrase}`);
}
