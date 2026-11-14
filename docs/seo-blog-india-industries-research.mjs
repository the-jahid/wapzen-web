// India industry posts, round 2 (see seo-research.md, "India industry posts"). Run:
// node docs/seo-blog-india-industries-research.mjs -> prints the top phrases per industry
// and writes blog-kw-india-industries.json in the cwd. Same rank-weighted scoring as
// seo-blog-india-research.mjs: Google and YouTube with hl=en-IN, gl=in, and DuckDuckGo
// with its in-en region. Real estate and coaching already have posts, so they're left out.
import fs from "node:fs";

const industries = {
  clinics: ["whatsapp for doctors", "whatsapp for clinic", "clinic appointment whatsapp", "doctor appointment booking whatsapp", "ai receptionist for clinic", "ai chatbot for hospital", "clinic management software india", "dental clinic whatsapp"],
  diagnostics: ["diagnostic lab whatsapp", "pathology lab software", "lab report on whatsapp", "home sample collection booking", "diagnostic centre marketing"],
  restaurants: ["whatsapp ordering for restaurants", "restaurant whatsapp ordering india", "cloud kitchen whatsapp", "whatsapp food ordering system", "direct orders without zomato", "zomato commission", "restaurant marketing ideas india", "tiffin service whatsapp"],
  salons: ["salon whatsapp booking", "salon appointment booking whatsapp", "salon marketing ideas", "salon software india", "beauty parlour whatsapp", "spa booking whatsapp"],
  gyms: ["gym whatsapp", "gym membership reminder", "gym management software india", "gym marketing ideas india", "fitness studio whatsapp"],
  travel: ["whatsapp for travel agents", "travel agency whatsapp", "ai for travel agents", "travel agent crm india", "tour package enquiry", "travel agency marketing india", "holiday package whatsapp"],
  hotels: ["hotel whatsapp booking", "whatsapp for hotels", "homestay booking whatsapp", "hotel chatbot", "resort booking whatsapp"],
  insurance: ["whatsapp for insurance agents", "lic agent whatsapp", "insurance agent marketing", "insurance agent crm india", "lic agent software", "policy renewal reminder"],
  ecommerce: ["whatsapp for shopify", "whatsapp for instagram sellers", "whatsapp for online store", "cod confirmation whatsapp", "rto reduction", "whatsapp for d2c brands", "how to sell on whatsapp"],
  jewellery: ["whatsapp for jewellery shop", "jewellery shop marketing ideas", "jewellery business whatsapp", "gold rate whatsapp", "jewellery shop software"],
  retail: ["whatsapp for kirana store", "whatsapp for retail shop", "whatsapp for garment shop", "whatsapp for wholesale business", "whatsapp catalogue for business", "whatsapp business for shop"],
  autos: ["car dealer whatsapp", "car showroom whatsapp", "two wheeler dealer crm", "car service booking whatsapp", "automobile dealer marketing"],
  schools: ["school whatsapp", "school admission enquiry", "school admission whatsapp", "school management software india", "preschool marketing ideas"],
  ca: ["whatsapp for ca firm", "ca firm software", "tax consultant whatsapp", "gst consultant marketing", "ai for chartered accountants"],
  interiors: ["interior designer whatsapp", "interior designer leads", "solar company whatsapp", "solar leads india", "interior designer crm"],
  events: ["wedding planner whatsapp", "event management whatsapp", "banquet hall booking", "wedding planner marketing", "photographer whatsapp"],
};

const hl = "en-IN", gl = "in", kl = "in-en";
const sources = {
  google: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&hl=${hl}&gl=${gl}&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`,
  youtube: (q) => `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=${hl}&gl=${gl}&ie=utf-8&oe=utf-8&q=${encodeURIComponent(q)}`,
  ddg: (q) => `https://duckduckgo.com/ac/?q=${encodeURIComponent(q)}&kl=${kl}&type=list`,
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
for (const [cluster, seeds] of Object.entries(industries)) for (const q of seeds) for (const [name, url] of Object.entries(sources)) tasks.push({ cluster, name, url: url(q) });
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
fs.writeFileSync("blog-kw-india-industries.json", JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
const ranked = Object.entries(byCluster).map(([c, list]) => [c, list, list.reduce((s, r) => s + r.score, 0)]).sort((a, b) => b[2] - a[2]);
for (const [c, list, total] of ranked) {
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 14)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${r.phrase}`);
}
