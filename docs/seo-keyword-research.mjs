// Autocomplete keyword research for the landing page (see seo-research.md).
// Run: node docs/seo-keyword-research.mjs  -> writes kw-scored.json in the cwd.
//
// Autocomplete has no volumes. A phrase scores higher the nearer the top it is
// suggested, and the more sources and seeds suggest it, which works as a proxy
// for search demand. Seeds are limited to what Wapzen actually does.
import fs from "node:fs";

const seeds = [
  "whatsapp ai chatbot", "whatsapp chatbot", "whatsapp ai agent", "whatsapp ai voice agent",
  "whatsapp ai calling", "whatsapp ai call", "whatsapp ai voice", "whatsapp voice bot",
  "whatsapp call bot", "whatsapp calling agent", "ai calling agent", "ai voice agent",
  "ai receptionist", "ai phone agent", "ai calling", "ai cold calling", "outbound ai calling",
  "ai call center", "ai voice assistant for business", "whatsapp automation", "whatsapp auto reply",
  "whatsapp bot", "whatsapp business automation", "whatsapp business chatbot",
  "whatsapp chatbot for business", "whatsapp customer service", "whatsapp customer support",
  "ai customer service", "whatsapp chatbot builder", "whatsapp chatbot without api",
  "whatsapp without api", "whatsapp chatbot free", "whatsapp chatbot pricing", "whatsapp ai assistant",
  "whatsapp ai bot", "chatgpt whatsapp", "chatgpt on whatsapp", "whatsapp gpt", "claude whatsapp",
  "how to create whatsapp chatbot", "how to add ai to whatsapp", "how to make whatsapp ai",
  "best whatsapp chatbot", "whatsapp ai sales agent", "whatsapp lead generation",
  "whatsapp appointment booking", "ai appointment booking", "ai appointment setter",
  "whatsapp business api alternative", "auto answer whatsapp call", "ai answer whatsapp calls",
  "whatsapp call automation", "whatsapp bulk call", "ai dialer", "voice ai agent",
  "no code whatsapp chatbot", "whatsapp ai auto reply", "ai auto reply whatsapp",
  "whatsapp chatbot for real estate", "whatsapp chatbot for clinic", "whatsapp chatbot for ecommerce",
  "whatsapp chatbot for restaurant", "whatsapp chatbot for education", "wati alternative",
  "interakt alternative", "aisensy alternative", "whatsapp ai customer service",
  "whatsapp ai receptionist", "whatsapp knowledge base chatbot", "train chatbot on your data",
  "whatsapp ai agent builder", "ai agent for whatsapp business", "whatsapp business ai",
  "whatsapp marketing automation", "whatsapp bot for business",
];
// Seeds expanded with " a" ... " z" to surface long-tail phrasing.
const azSeeds = ["whatsapp ai", "whatsapp chatbot", "whatsapp ai agent", "ai calling agent", "whatsapp ai call", "whatsapp auto reply", "ai voice agent", "whatsapp bot"];
const questionSeeds = ["whatsapp ai", "whatsapp chatbot", "ai calling agent"];

const sources = {
  gUS: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=${encodeURIComponent(q)}`,
  gIN: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=in&q=${encodeURIComponent(q)}`,
  gGB: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=gb&q=${encodeURIComponent(q)}`,
  bing: (q) => `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(q)}`,
  yt: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=en&q=${encodeURIComponent(q)}`,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function suggestions(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      return JSON.parse(await res.text())[1] ?? [];
    } catch {
      await sleep(500);
    }
  }
  return [];
}

const queries = [...seeds];
for (const seed of azSeeds) for (const letter of "abcdefghijklmnopqrstuvwxyz") queries.push(`${seed} ${letter}`);
for (const seed of questionSeeds) for (const prefix of ["how to", "can", "best", "what is", "is"]) queries.push(`${prefix} ${seed}`);

const scores = new Map();
const tasks = queries.flatMap((q, qi) => Object.entries(sources).map(([name, url]) => ({ q, qi, name, url: url(q) })));
async function worker() {
  while (tasks.length) {
    const { q, qi, name, url } = tasks.shift();
    (await suggestions(url)).forEach((phrase, rank) => {
      const key = phrase.toLowerCase().trim();
      const entry = scores.get(key) ?? { score: 0, sources: new Set(), seeds: new Set() };
      // Direct seeds count fully; A-Z and question expansions count 0.6.
      entry.score += (10 - Math.min(rank, 9)) * (qi < seeds.length ? 1 : 0.6);
      entry.sources.add(name);
      entry.seeds.add(q);
      scores.set(key, entry);
    });
    await sleep(60);
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

const rows = [...scores.entries()]
  .map(([phrase, e]) => ({ phrase, score: Math.round(e.score), sources: [...e.sources].sort().join(","), seeds: e.seeds.size }))
  .sort((a, b) => b.score - a.score);
fs.writeFileSync("kw-scored.json", JSON.stringify(rows, null, 1));
console.log(`${queries.length} queries, ${rows.length} phrases -> kw-scored.json`);
