// Playbook blog research (see seo-research.md, "Playbook blogs"). Run: node docs/seo-blog-playbook-research.mjs
// -> prints the top phrases per cluster and writes blog-playbook-kw.json in the cwd.
// Same five sources and rank-weighted scoring as seo-blog-topic-research.mjs, one
// cluster per how-to post (handoff, prompts, knowledge base, leads, away messages).
import fs from "node:fs";
const clusters = {
  handoff: ["chatbot human handoff", "chatbot to human handoff", "whatsapp chatbot human handover", "whatsapp bot transfer to agent", "live agent handoff", "human takeover chatbot", "chatbot escalation to human", "whatsapp live chat agent", "bot to human handoff best practices", "how to talk to a human on whatsapp chatbot", "whatsapp chatbot live agent"],
  prompts: ["ai agent system prompt", "chatbot prompt examples", "customer service chatbot prompt", "system prompt examples", "whatsapp chatbot prompt", "ai agent prompt examples", "chatbot instructions examples", "system prompt for customer support", "how to write a system prompt", "ai receptionist prompt", "voice agent prompt", "ai agent instructions"],
  knowledge: ["chatbot knowledge base", "knowledge base for chatbot", "how to build a knowledge base for ai chatbot", "ai knowledge base", "knowledge base examples", "rag chatbot", "chatbot training data", "how to train chatbot on your data", "train ai on your own data", "faq for chatbot", "knowledge base best practices", "whatsapp chatbot knowledge base"],
  leads: ["lead qualification questions", "whatsapp lead qualification", "ai lead qualification", "lead qualification chatbot", "whatsapp crm integration", "whatsapp to crm", "whatsapp hubspot integration", "whatsapp zoho crm integration", "whatsapp leads to google sheets", "bant questions", "lead qualification process", "whatsapp lead generation"],
  away: ["whatsapp away message", "whatsapp business away message", "away message examples", "whatsapp away message examples", "away message for whatsapp business", "whatsapp business away message not working", "whatsapp business auto reply", "out of office message whatsapp", "whatsapp holiday message", "away message vs greeting message", "auto reply message for business", "whatsapp ai auto reply"],
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
fs.writeFileSync("blog-playbook-kw.json", JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
for (const [c, list] of Object.entries(byCluster)) {
  const total = list.reduce((s, r) => s + r.score, 0);
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 22)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/5  ${r.phrase}`);
}
