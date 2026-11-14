// Gym and fitness post (see seo-research.md, "Gym post"). Run:
// node docs/seo-blog-gym-research.mjs -> prints the top phrases per cluster
// and writes blog-kw-gym.json in the cwd. Same rank-weighted scoring as
// seo-blog-india-industries-research.mjs, run for the US, India and the UK on Google,
// YouTube and DuckDuckGo, so a phrase's score is summed across 9 source/market pairs.
import fs from "node:fs";

const clusters = {
  gymWhatsapp: ["whatsapp for gym", "gym whatsapp", "whatsapp chatbot for gym", "whatsapp bot for gym", "whatsapp ai for gym", "whatsapp automation for gym", "gym whatsapp marketing"],
  gymAi: ["ai for gyms", "ai chatbot for gym", "gym chatbot", "ai receptionist for gym", "ai for fitness business", "ai for personal trainers", "fitness chatbot"],
  gymMessages: ["gym membership renewal message", "gym whatsapp message", "gym reminder message", "gym welcome message", "gym follow up message", "gym enquiry reply"],
  gymOps: ["gym lead management", "gym membership software", "gym automation", "gym marketing ideas", "how to get more gym members", "gym class booking"],
  studio: ["yoga studio whatsapp", "personal trainer whatsapp", "fitness studio automation", "pilates studio chatbot", "crossfit box software"],
};

const markets = [
  { hl: "en", gl: "us", kl: "us-en" },
  { hl: "en-IN", gl: "in", kl: "in-en" },
  { hl: "en-GB", gl: "gb", kl: "uk-en" },
];
const sources = {
  google: (q, m) => `https://suggestqueries.google.com/complete/search?client=firefox&hl=${m.hl}&gl=${m.gl}&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`,
  youtube: (q, m) => `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=${m.hl}&gl=${m.gl}&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`,
  ddg: (q, m) => `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}&kl=${m.kl}&type=list`,
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
  for (const q of seeds) for (const m of markets) for (const [name, url] of Object.entries(sources)) tasks.push({ cluster, name: `${name}-${m.gl}`, url: url(q, m) });
const scores = new Map();
async function worker() {
  while (tasks.length) {
    const { cluster, name, url } = tasks.shift();
    (await suggestions(url)).forEach((phrase, rank) => {
      const key = String(phrase).toLowerCase().trim();
      const e = scores.get(key) ?? { score: 0, sources: new Set(), clusters: new Set() };
      e.score += 10 - Math.min(rank, 9); e.sources.add(name); e.clusters.add(cluster); scores.set(key, e);
    });
    await sleep(80);
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
const rows = [...scores].map(([phrase, e]) => ({ phrase, score: e.score, sources: e.sources.size, cluster: [...e.clusters].join("+") })).sort((a, b) => b.score - a.score);
fs.writeFileSync("blog-kw-gym.json", JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
const ranked = Object.entries(byCluster).map(([c, list]) => [c, list, list.reduce((s, r) => s + r.score, 0)]).sort((a, b) => b[2] - a[2]);
for (const [c, list, total] of ranked) {
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 18)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/9  ${r.phrase}`);
}
