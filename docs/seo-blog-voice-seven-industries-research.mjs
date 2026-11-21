// Seven WhatsApp voice agent industry posts (see seo-research.md, "Voice agent posts for seven
// industries (2026-11-21)"). Run: node docs/seo-blog-voice-seven-industries-research.mjs [out.json]
// Same rank-weighted scoring as seo-blog-industry-pick-research.mjs (10 points for the first
// suggestion down to 1), summed over Google in the US, India, the UK, Nigeria and South Africa,
// DuckDuckGo in the US, India and the UK, and Bing, so a phrase's sources are out of 9.
// Every seed is a voice or calling phrase for one industry, because the posts are about the
// WhatsApp AI voice agent only.
import fs from "node:fs";

const industries = {
  healthcare: ["healthcare", "hospitals", "clinics", "medical practice", "patients"],
  finance: ["banks", "banking", "financial services", "fintech", "lending", "loans"],
  insurance: ["insurance", "insurance agents", "insurance agency", "insurance claims"],
  logistics: ["logistics", "delivery", "courier", "trucking", "freight"],
  retail: ["retail", "ecommerce", "retail stores", "consumer goods", "d2c brands"],
  travel: ["travel", "travel agency", "hospitality", "hotels", "tour operators"],
  collections: ["debt collection", "collections", "loan recovery", "payment reminders"],
};
const templates = [
  (x) => `ai voice agent for ${x}`,
  (x) => `voice ai for ${x}`,
  (x) => `ai calling for ${x}`,
  (x) => `ai phone agent for ${x}`,
  (x) => `conversational ai for ${x}`,
  (x) => `voice bot for ${x}`,
  (x) => `ai voice assistant for ${x}`,
  (x) => `ai receptionist for ${x}`,
  (x) => `ai calls for ${x}`,
  (x) => `whatsapp ai for ${x}`,
];
// Phrases people use for the job rather than "<tool> for <industry>".
const extra = {
  healthcare: ["patient appointment reminder calls", "ai appointment reminder calls", "ai medical receptionist", "ai voice agent healthcare", "healthcare voice ai", "ai voice agent for doctors", "ai voice agent for dental"],
  finance: ["ai voice agent banking", "voice bot banking", "ai voice agent for credit unions", "ai voice agent for nbfc", "ai calling for loan", "ai voice agent for mortgage", "ai voice agent for microfinance"],
  insurance: ["ai voice agent insurance", "insurance voice bot", "ai calling insurance leads", "ai voice agent for insurance claims", "fnol ai", "insurance renewal reminder call", "ai telecaller insurance"],
  logistics: ["ai voice agent logistics", "delivery confirmation call", "ai voice agent for delivery", "ndr calling", "address verification call", "ai dispatcher", "ai voice agent for freight brokers", "cod confirmation call"],
  retail: ["ai voice agent retail", "ai voice agent ecommerce", "order confirmation call", "abandoned cart call", "ai calling ecommerce", "cod verification call", "ai voice agent for shopify"],
  travel: ["ai voice agent travel", "ai voice agent for hotels", "ai voice agent hospitality", "hotel ai phone agent", "ai voice agent for travel agency", "ai booking agent travel", "ai voice agent for airlines"],
  collections: ["ai voice agent for debt collection", "ai debt collection calls", "ai collection calls", "ai payment reminder calls", "emi reminder call", "ai voice agent collections", "voice bot for collections", "ai debt collector"],
};
const whatsapp = ["whatsapp ai voice agent", "whatsapp voice agent", "whatsapp ai call", "ai calling on whatsapp", "whatsapp ai calling agent", "whatsapp voice bot", "ai voice agent whatsapp"];

const google = (gl, hl) => (q) => `https://suggestqueries.google.com/complete/search?client=firefox&hl=${hl}&gl=${gl}&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`;
const ddg = (kl) => (q) => `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}&kl=${kl}&type=list`;
const sources = {
  "google-us": google("us", "en"), "google-in": google("in", "en-IN"), "google-gb": google("gb", "en-GB"),
  "google-ng": google("ng", "en-NG"), "google-za": google("za", "en-ZA"),
  "ddg-us": ddg("us-en"), "ddg-in": ddg("in-en"), "ddg-uk": ddg("uk-en"),
  bing: (q) => `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(q)}`,
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function suggestions(url) {
  for (let a = 0; a < 3; a++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      const data = JSON.parse(await res.text());
      return Array.isArray(data) ? (Array.isArray(data[1]) ? data[1] : data.map((d) => d.phrase).filter(Boolean)) : [];
    } catch { await sleep(600); }
  }
  return [];
}

const seeds = [];
for (const [industry, words] of Object.entries(industries)) {
  for (const w of words) for (const t of templates) seeds.push({ industry, seed: t(w) });
  for (const s of extra[industry]) seeds.push({ industry, seed: s });
}
for (const s of whatsapp) seeds.push({ industry: "whatsapp", seed: s });
const tasks = [];
for (const { industry, seed } of seeds) for (const [name, url] of Object.entries(sources)) tasks.push({ industry, seed, name, url: url(seed) });

const phrases = new Map(); // phrase -> { score, sources:Set, industries:Set }
let done = 0;
async function worker() {
  while (tasks.length) {
    const { industry, name, url } = tasks.shift();
    (await suggestions(url)).forEach((phrase, rank) => {
      const key = String(phrase).toLowerCase().trim();
      const e = phrases.get(key) ?? { score: 0, sources: new Set(), industries: new Set() };
      e.score += 10 - Math.min(rank, 9); e.sources.add(name); e.industries.add(industry); phrases.set(key, e);
    });
    if (++done % 500 === 0) console.error(`${done} requests`);
    await sleep(90);
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

const rows = [...phrases].map(([phrase, e]) => ({ phrase, score: e.score, sources: e.sources.size, industry: [...e.industries].join("+") })).sort((a, b) => b.score - a.score);
fs.writeFileSync(process.argv[2] ?? "blog-kw-voice-seven-industries.json", JSON.stringify(rows, null, 1));

// Generic phrases ("ai receptionist for small business") leak into every seed, so each
// industry is listed by the phrases that name it.
const names = {
  healthcare: /health|hospital|clinic|medical|patient|doctor|dental|dentist|physician|pharma/,
  finance: /bank|financ|fintech|lend|loan|credit union|nbfc|mortgage|microfinance|wealth/,
  insurance: /insur|claim|fnol|policy/,
  logistics: /logist|deliver|courier|truck|freight|dispatch|ndr|shipping|shipment|address verification|last mile/,
  retail: /retail|ecommerce|e-commerce|store|shop|consumer|d2c|cart|order confirmation|cod /,
  travel: /travel|hotel|hospitality|tour|airline|resort|booking agent/,
  collections: /collect|debt|recovery|reminder|emi|overdue|receivable/,
  whatsapp: /whatsapp/,
};
for (const [industry, re] of Object.entries(names)) {
  const list = rows.filter((r) => r.industry.split("+").includes(industry) && re.test(r.phrase));
  const total = list.reduce((s, r) => s + r.score, 0);
  console.log(`\n## ${industry}  (${list.length} phrases naming it, total ${total})`);
  for (const r of list.slice(0, 22)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/9  ${r.phrase}`);
}
