// QR page harvest (see seo-research.md, "WhatsApp QR code page"). Run:
// node docs/seo-qr-research.mjs <out.json> -> prints the top phrases per cluster
// and writes the full list to <out.json>. Same sources and rank weighting as
// seo-blog-tool-research.mjs; clusters map to sections of the QR generator page.
import fs from "node:fs";
const clusters = {
  generator: ["whatsapp qr generator", "whatsapp qr code generator", "whatsapp qr code generator free", "qr code generator whatsapp", "qr code for whatsapp", "whatsapp qr code maker", "create whatsapp qr code", "make whatsapp qr code", "generate whatsapp qr code", "free whatsapp qr code", "wa.me qr code"],
  logo: ["whatsapp qr code logo", "whatsapp qr code with logo", "qr code with whatsapp logo", "whatsapp qr logo", "qr code whatsapp logo", "add logo to whatsapp qr code", "whatsapp qr code generator with logo", "qr code logo", "add logo to qr code", "logo size qr code"],
  business: ["whatsapp business qr code", "whatsapp business qr", "qr code for whatsapp business", "whatsapp business qr code generator", "how to get whatsapp business qr code", "whatsapp business short link", "whatsapp qr code for business", "whatsapp business qr code download"],
  print: ["whatsapp qr code print", "qr code size for print", "qr code minimum size", "qr code size business card", "qr code print size", "whatsapp qr code sticker", "whatsapp qr code poster", "whatsapp qr code template", "qr code scan distance"],
  format: ["qr code png", "qr code svg", "whatsapp qr code png", "whatsapp qr code svg", "svg qr code generator", "whatsapp qr code download", "whatsapp qr code image"],
  howTo: ["how to create whatsapp qr code", "how to make qr code for whatsapp", "how to get whatsapp qr code", "how to scan whatsapp qr code", "how to find whatsapp qr code", "how to share whatsapp qr code", "where is whatsapp qr code"],
  trouble: ["whatsapp qr code not working", "whatsapp qr code not scanning", "why can't i scan whatsapp qr code", "whatsapp qr code expired", "does whatsapp qr code expire", "whatsapp qr code invalid", "reset whatsapp qr code"],
  variants: ["whatsapp group qr code", "whatsapp channel qr code", "whatsapp catalog qr code", "whatsapp qr code with message", "whatsapp qr code for restaurant", "whatsapp qr code for shop", "whatsapp qr code for website", "dynamic whatsapp qr code", "whatsapp qr code tracking"],
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
fs.writeFileSync(process.argv[2] ?? "qr-kw.json", JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
for (const [c, list] of Object.entries(byCluster)) {
  const strong = list.filter((r) => r.sources >= 4);
  console.log(`\n## ${c}  (${list.length} phrases, ${strong.length} on 4+ sources, top-10 total ${list.slice(0, 10).reduce((s, r) => s + r.score, 0)})`);
  for (const r of list.slice(0, 16)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/5  ${r.phrase}`);
}
