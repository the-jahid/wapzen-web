// Healthcare industry page research (see seo-research.md, "Healthcare industry page").
// Run: node docs/seo-healthcare-research.mjs
// -> prints the top phrases per cluster and writes healthcare-kw.json in the cwd.
// Same five sources and rank-weighted scoring as seo-blog-industry-research.mjs,
// one cluster per section of the page, so its title, headings and FAQ can be
// picked from the phrasing people actually type.
import fs from "node:fs";
const clusters = {
  whatsapp: ["whatsapp chatbot for healthcare", "whatsapp for healthcare", "whatsapp chatbot for hospital", "whatsapp chatbot for clinic", "whatsapp chatbot for doctors", "whatsapp for doctors", "whatsapp for clinics", "whatsapp for hospitals", "whatsapp automation for clinics", "whatsapp business for doctors", "whatsapp healthcare use cases", "whatsapp patient communication"],
  aiAgent: ["ai agent for healthcare", "ai agents in healthcare", "healthcare ai agent", "ai chatbot for healthcare", "healthcare chatbot", "medical chatbot", "ai for clinics", "ai for medical practice", "ai assistant for doctors", "conversational ai healthcare", "patient engagement ai", "ai patient communication"],
  voice: ["ai voice agent for healthcare", "voice ai healthcare", "ai phone agent for healthcare", "ai calling agent for healthcare", "healthcare voice ai", "ai receptionist for medical office", "ai receptionist for clinic", "ai receptionist for doctors office", "medical answering service ai", "ai medical receptionist", "ai front desk medical", "ai phone answering for doctors"],
  scheduling: ["patient appointment reminders", "appointment reminder whatsapp", "whatsapp appointment booking", "clinic appointment booking whatsapp", "patient scheduling ai", "ai appointment scheduling healthcare", "reduce no shows clinic", "patient no show", "doctor appointment reminder message", "automated patient reminders", "online appointment booking for clinic", "appointment reminder message for patients"],
  specialties: ["whatsapp chatbot for dental clinic", "ai receptionist for dental office", "whatsapp for dentists", "whatsapp for pharmacy", "pharmacy whatsapp chatbot", "whatsapp for physiotherapy clinic", "whatsapp for diagnostic lab", "lab report whatsapp", "whatsapp for eye clinic", "whatsapp for veterinary clinic", "whatsapp for skin clinic", "whatsapp for ivf clinic"],
  trust: ["is whatsapp hipaa compliant", "whatsapp hipaa", "hipaa compliant chatbot", "is whatsapp safe for patient information", "whatsapp gdpr healthcare", "whatsapp patient data", "ai hipaa compliant", "whatsapp for healthcare india"],
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
fs.writeFileSync("healthcare-kw.json", JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
for (const [c, list] of Object.entries(byCluster)) {
  const total = list.reduce((s, r) => s + r.score, 0);
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 25)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/5  ${r.phrase}`);
}
