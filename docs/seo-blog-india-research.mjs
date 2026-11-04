// India blog topic research (see seo-research.md, "India posts"). Run:
// node docs/seo-blog-india-research.mjs -> prints the top phrases per cluster and writes
// blog-kw-india.json in the cwd. Same rank-weighted scoring as
// seo-blog-voice-research.mjs: Google and YouTube with hl=en-IN, gl=in, and DuckDuckGo
// with its in-en region.
import fs from "node:fs";

const clusters = {
  generic: ["whatsapp chatbot india", "free whatsapp chatbot india", "whatsapp ai chatbot india", "whatsapp automation india", "whatsapp automation free", "ai chatbot for whatsapp business", "whatsapp ai agent india"],
  noApi: ["whatsapp chatbot without api", "whatsapp automation without api", "whatsapp without meta api", "whatsapp business api alternative india", "whatsapp bot without business api", "whatsapp api free india", "whatsapp api provider india"],
  hinglish: ["whatsapp auto reply kaise kare", "whatsapp business me auto reply kaise lagaye", "whatsapp chatbot kaise banaye", "whatsapp bot kaise banaye", "whatsapp par business kaise kare", "whatsapp business kaise use kare"],
  coaching: ["whatsapp chatbot for coaching institute", "coaching institute whatsapp", "coaching institute lead generation", "coaching institute management software", "whatsapp for tuition classes", "admission enquiry whatsapp", "whatsapp marketing for coaching classes"],
  realEstate: ["whatsapp chatbot for real estate india", "real estate whatsapp marketing india", "real estate lead management india", "property dealer whatsapp", "channel partner whatsapp", "real estate crm india free"],
  retail: ["whatsapp for kirana store", "whatsapp order kirana", "whatsapp business for small business india", "whatsapp for retail shop", "whatsapp for boutique", "whatsapp for jewellery business", "whatsapp for garment business", "whatsapp for wholesale business"],
  d2c: ["whatsapp for shopify india", "whatsapp for d2c brands", "rto reduction whatsapp", "reduce rto india", "abandoned cart whatsapp india", "whatsapp for instagram sellers", "whatsapp for meesho sellers"],
  food: ["whatsapp for restaurant india", "whatsapp ordering for cloud kitchen", "tiffin service whatsapp", "whatsapp ordering without zomato", "reduce zomato commission", "direct orders restaurant india"],
  services: ["whatsapp for ca firm", "whatsapp for insurance agents", "lic agent whatsapp", "whatsapp for travel agents india", "whatsapp for salon india", "whatsapp for gym", "whatsapp for clinic india", "whatsapp for doctors india", "whatsapp for interior designers", "whatsapp for solar business", "whatsapp for loan agents", "whatsapp for dsa"],
  money: ["whatsapp business api cost india", "whatsapp marketing cost india", "whatsapp marketing india", "whatsapp lead generation india", "whatsapp crm india", "whatsapp crm free", "best whatsapp crm india", "whatsapp business tools india"],
  alternatives: ["aisensy alternative", "interakt alternative", "wati alternative india", "gallabox alternative", "doubletick alternative", "kommo alternative india", "free alternative to aisensy"],
  voice: ["ai calling agent for small business india", "ai telecaller free", "ai receptionist india", "hindi voice bot", "whatsapp call ai agent", "ai calling hindi"],
  howTo: ["how to automate whatsapp business", "how to connect chatgpt to whatsapp business", "how to reply customers automatically on whatsapp", "how to get more customers on whatsapp india", "how to sell on whatsapp india", "how to create ai agent for whatsapp"],
};

// Second pass (node docs/seo-blog-india-research.mjs verticals): the "whatsapp for x"
// seeds above mostly returned generic WhatsApp phrases, so this one measures each
// vertical's demand with the words its owners search for.
const verticals = {
  coaching: ["coaching institute software", "coaching class app", "coaching institute marketing", "ai for coaching institutes", "ai chatbot for education india", "admission enquiry software", "how to get students for coaching", "fee reminder message"],
  realEstate: ["real estate crm india", "real estate lead generation", "ai for real estate india", "ai chatbot for real estate", "99acres leads", "magicbricks leads", "real estate agent software india", "whatsapp marketing for real estate"],
  clinics: ["clinic management software india", "ai chatbot for hospitals india", "appointment booking software india", "doctor appointment whatsapp"],
  salon: ["salon software india", "salon appointment app", "salon marketing ideas india", "gym management software india"],
  insurance: ["insurance agent crm india", "lic agent software", "lic agent marketing", "ai for insurance agents", "insurance agent app"],
  travel: ["travel agency software india", "travel agent crm india", "ai for travel agents", "tour operator software india"],
  ca: ["ca firm software", "ca office management software", "ai for chartered accountants", "tax consultant crm"],
  d2c: ["rto reduction", "reduce rto in ecommerce", "ai chatbot for ecommerce india", "shopify whatsapp automation", "instagram seller whatsapp"],
  food: ["restaurant whatsapp ordering", "cloud kitchen software india", "tiffin service app", "restaurant crm india"],
  retail: ["kirana store software", "small shop billing app", "jewellery shop software", "wholesale order app", "boutique marketing ideas"],
  solar: ["solar crm india", "solar lead generation india", "interior designer crm india"],
  finance: ["loan dsa software", "dsa lead management", "ai for loan agents", "nbfc whatsapp bot"],
};

const hl = "en-IN", gl = "in", kl = "in-en";
const sources = {
  google: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&hl=${hl}&gl=${gl}&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`,
  youtube: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=${hl}&gl=${gl}&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`,
  ddg: (q) => `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}&kl=${kl}&type=list`,
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function suggestions(url) {
  for (let a = 0; a < 3; a++) { try { const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } }); return JSON.parse(await res.text())[1] ?? []; } catch { await sleep(500); } }
  return [];
}
const tasks = [];
const pass = process.argv[2] === "verticals" ? "verticals" : "clusters";
for (const [cluster, seeds] of Object.entries(pass === "verticals" ? verticals : clusters)) for (const q of seeds) for (const [name, url] of Object.entries(sources)) tasks.push({ cluster, q, name, url: url(q) });
const scores = new Map();
async function worker() {
  while (tasks.length) {
    const { cluster, name, url } = tasks.shift();
    (await suggestions(url)).forEach((phrase, rank) => {
      const key = phrase.toLowerCase().trim();
      const e = scores.get(key) ?? { score: 0, sources: new Set(), clusters: new Set() };
      e.score += 10 - Math.min(rank, 9); e.sources.add(name); e.clusters.add(cluster); scores.set(key, e);
    });
    await sleep(80);
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
const rows = [...scores].map(([phrase, e]) => ({ phrase, score: e.score, sources: e.sources.size, cluster: [...e.clusters].join("+") })).sort((a, b) => b.score - a.score);
fs.writeFileSync(pass === "verticals" ? "blog-kw-india-verticals.json" : "blog-kw-india.json", JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
const ranked = Object.entries(byCluster).map(([c, list]) => [c, list, list.reduce((s, r) => s + r.score, 0)]).sort((a, b) => b[2] - a[2]);
for (const [c, list, total] of ranked) {
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 14)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${r.phrase}`);
}
