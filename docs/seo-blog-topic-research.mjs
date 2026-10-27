// Blog topic research (see seo-research.md, "Blog topics"). Run: node docs/seo-blog-topic-research.mjs
// -> prints the top phrases per cluster and writes blog-kw.json in the cwd. Same
// rank-weighted autocomplete scoring as seo-keyword-research.mjs, grouped by
// candidate blog topic so clusters can be compared before writing.
import fs from "node:fs";
const clusters = {
  chatgpt: ["chatgpt whatsapp", "chatgpt on whatsapp", "how to use chatgpt on whatsapp", "chatgpt whatsapp number", "1-800-chatgpt whatsapp", "chatgpt in whatsapp business", "how to add chatgpt to whatsapp", "ai chatbot for whatsapp"],
  apiPricing: ["whatsapp business api pricing", "whatsapp business api cost", "whatsapp api price", "whatsapp business api charges", "whatsapp marketing message cost", "whatsapp conversation pricing", "whatsapp api pricing india", "whatsapp business api free"],
  appVsApi: ["whatsapp business vs whatsapp business api", "whatsapp business app vs api", "difference between whatsapp business and api", "whatsapp business api vs app"],
  n8n: ["n8n whatsapp", "n8n whatsapp ai agent", "n8n whatsapp chatbot", "n8n whatsapp bot", "make.com whatsapp", "zapier whatsapp", "whatsapp ai agent n8n"],
  prompts: ["chatbot prompt", "customer service chatbot prompt", "system prompt for customer service", "ai agent system prompt", "chatbot script", "whatsapp chatbot script", "ai voice agent prompt", "ai calling script", "prompt for ai receptionist", "chatbot prompt examples"],
  leads: ["whatsapp lead follow up", "speed to lead", "facebook lead ads whatsapp", "ai lead qualification", "lead follow up automation", "how to follow up leads on whatsapp", "ai call new leads", "ai sdr"],
  autoAnswer: ["auto answer whatsapp call", "how to auto answer whatsapp call", "whatsapp call auto answer", "whatsapp voicemail", "whatsapp call answering machine", "ai answer my calls", "missed call auto reply whatsapp"],
  ban: ["whatsapp banned", "whatsapp business account banned", "how to avoid whatsapp ban", "whatsapp ban reason", "unofficial whatsapp api ban", "whatsapp automation ban", "whatsapp temporarily banned"],
  industries: ["whatsapp chatbot for restaurant", "whatsapp ordering system", "whatsapp chatbot for clinic", "whatsapp chatbot for doctors", "whatsapp appointment booking", "whatsapp chatbot for salon", "whatsapp chatbot for hotel", "whatsapp chatbot for school", "whatsapp chatbot for ecommerce", "whatsapp chatbot for shopify", "whatsapp chatbot for gym", "whatsapp chatbot for coaching"],
  examples: ["whatsapp chatbot examples", "whatsapp chatbot use cases", "whatsapp ai agent examples", "whatsapp business tips", "whatsapp customer support best practices", "how to get more customers on whatsapp", "whatsapp business ai", "meta ai whatsapp business"],
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
    const { cluster, q, name, url } = tasks.shift();
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
fs.writeFileSync("blog-kw.json", JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
for (const [c, list] of Object.entries(byCluster)) {
  const total = list.reduce((s, r) => s + r.score, 0);
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 14)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/5  ${r.phrase}`);
}
