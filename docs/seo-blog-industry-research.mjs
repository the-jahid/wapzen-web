// Industry blog research (see seo-research.md, "Industry blogs"). Run: node docs/seo-blog-industry-research.mjs
// -> prints the top phrases per cluster and writes blog-industry-kw.json in the cwd.
// Same five sources and rank-weighted scoring as seo-blog-topic-research.mjs,
// one cluster per industry post so the posts' titles and headings can be picked
// from the phrasing people actually type.
import fs from "node:fs";
const clusters = {
  realEstate: ["whatsapp chatbot for real estate", "real estate whatsapp chatbot", "whatsapp for real estate", "whatsapp automation for real estate", "real estate whatsapp marketing", "ai chatbot for real estate", "real estate lead follow up", "real estate whatsapp message", "whatsapp real estate leads", "ai for real estate agents", "real estate ai calling", "property enquiry whatsapp"],
  clinics: ["whatsapp chatbot for clinic", "whatsapp chatbot for doctors", "whatsapp chatbot for dental clinic", "whatsapp for dentists", "whatsapp for clinics", "whatsapp for doctors", "ai receptionist for dental office", "ai receptionist for clinic", "ai receptionist for medical office", "whatsapp chatbot for hospital", "whatsapp chatbot for healthcare", "dental clinic whatsapp message", "whatsapp ai receptionist"],
  ecommerce: ["whatsapp chatbot for ecommerce", "whatsapp automation for ecommerce", "whatsapp for ecommerce", "whatsapp abandoned cart", "abandoned cart whatsapp message", "whatsapp order status", "whatsapp order tracking", "whatsapp chatbot for shopify", "whatsapp for shopify", "woocommerce whatsapp", "whatsapp returns", "whatsapp ecommerce customer support"],
  schools: ["whatsapp chatbot for school", "whatsapp chatbot for education", "whatsapp for schools", "whatsapp for education", "whatsapp chatbot for coaching", "whatsapp for coaching institute", "whatsapp chatbot for college", "whatsapp chatbot for university", "whatsapp admission enquiry", "school whatsapp message to parents", "whatsapp for tuition classes", "ai chatbot for school"],
};
const sources = {
  gUS: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=${encodeURIComponent(q)}`,
  gIN: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=in&q=${encodeURIComponent(q)}`,
  gGB: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=gb&q=${encodeURIComponent(q)}`,
  bing: (q) => `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(q)}`,
  yt: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=en&q=${encodeURIComponent(q)}`,
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
    await sleep(60);
  }
}
await Promise.all(Array.from({ length: 6 }, worker));
const rows = [...scores].map(([phrase, e]) => ({ phrase, score: e.score, sources: e.sources.size, cluster: [...e.clusters].join("+") })).sort((a, b) => b.score - a.score);
fs.writeFileSync("blog-industry-kw.json", JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
for (const [c, list] of Object.entries(byCluster)) {
  const total = list.reduce((s, r) => s + r.score, 0);
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 22)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/5  ${r.phrase}`);
}
