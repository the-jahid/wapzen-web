// Sixth harvest (see seo-research.md, "Blog posts and a tool, Oct 28"). Run:
// node docs/seo-blog-tool-research.mjs -> prints the top phrases per cluster and
// writes blog-tool-kw.json in the cwd. Same sources and rank weighting as
// seo-blog-topic-research.mjs; `blog:` clusters are post candidates, `tool:`
// clusters are free-tool candidates for /tools.
import fs from "node:fs";
const clusters = {
  "blog:ban": ["whatsapp banned", "how to avoid whatsapp ban", "whatsapp business account banned", "whatsapp temporarily banned", "whatsapp account banned how to recover", "whatsapp ban reason", "is whatsapp automation allowed", "whatsapp linked device banned"],
  "blog:prompts": ["chatbot prompt", "customer service chatbot prompt", "ai agent system prompt", "chatbot prompt examples", "ai voice agent prompt", "ai receptionist prompt", "system prompt examples", "whatsapp chatbot prompt"],
  "blog:booking": ["whatsapp appointment booking", "whatsapp booking system", "whatsapp appointment reminder", "whatsapp booking bot", "appointment booking chatbot", "whatsapp appointment booking free"],
  "blog:ordering": ["whatsapp ordering system", "whatsapp order bot", "whatsapp restaurant ordering", "whatsapp food ordering", "whatsapp ordering system free", "how to take orders on whatsapp"],
  "blog:features": ["whatsapp business greeting message", "whatsapp business catalog", "whatsapp business quick replies", "whatsapp business labels", "whatsapp business features", "whatsapp business tips", "whatsapp business welcome message"],
  "blog:verification": ["whatsapp green tick", "whatsapp blue tick business", "meta verified whatsapp business", "whatsapp business verification", "how to get green tick on whatsapp business", "whatsapp official business account"],
  "blog:marketing": ["whatsapp marketing", "whatsapp marketing strategy", "whatsapp marketing ideas", "whatsapp broadcast", "whatsapp broadcast list", "how to send bulk message on whatsapp", "whatsapp channel for business", "whatsapp marketing tips"],
  "blog:multiuser": ["whatsapp multiple devices", "whatsapp linked devices", "whatsapp business multiple users", "whatsapp shared inbox", "whatsapp web multiple users", "how many devices can use whatsapp", "whatsapp business multi agent"],
  "blog:templates": ["whatsapp message templates", "whatsapp business message templates", "whatsapp template examples", "whatsapp marketing message examples", "whatsapp template approval", "whatsapp utility template examples"],
  "blog:automation": ["whatsapp automation", "how to automate whatsapp messages", "whatsapp automation free", "schedule whatsapp message", "how to schedule whatsapp message", "whatsapp business automation"],
  "blog:metaAi": ["meta ai whatsapp business", "whatsapp business ai", "meta business ai", "whatsapp business ai agent", "meta ai for business", "whatsapp ai features"],
  "blog:calling": ["whatsapp business calling", "whatsapp business calling api", "whatsapp call recording", "ai voice agent for small business", "ai cold calling", "whatsapp calling api pricing"],
  "tool:formatter": ["whatsapp text formatter", "whatsapp font generator", "whatsapp fonts", "whatsapp bold text", "whatsapp text format", "whatsapp fancy text", "whatsapp strikethrough", "whatsapp text formatting"],
  "tool:widget": ["whatsapp button for website", "whatsapp chat widget", "whatsapp widget for website", "add whatsapp to website", "whatsapp floating button", "whatsapp chat button html", "whatsapp widget free"],
  "tool:pricingCalc": ["whatsapp api pricing calculator", "whatsapp cost calculator", "whatsapp business api cost calculator", "whatsapp pricing calculator", "whatsapp message cost calculator", "whatsapp conversation cost calculator"],
  "tool:groupLink": ["whatsapp group link generator", "whatsapp group link", "whatsapp group invite link", "whatsapp group qr code"],
  "tool:messageGen": ["whatsapp greeting message generator", "whatsapp away message generator", "whatsapp business message generator", "whatsapp auto reply generator", "whatsapp business description generator", "whatsapp bio generator", "whatsapp message generator"],
  "tool:chatAnalyzer": ["whatsapp chat analyzer", "whatsapp chat export viewer", "whatsapp chat to pdf", "whatsapp chat stats", "whatsapp wrapped", "whatsapp chat analysis"],
  "tool:promptGen": ["ai voice agent prompt generator", "chatbot prompt generator", "system prompt generator", "ai agent prompt generator", "customer service prompt generator"],
  "tool:misc": ["whatsapp blank message", "whatsapp empty message", "whatsapp dp size", "whatsapp profile picture resizer", "whatsapp link preview", "whatsapp message counter", "whatsapp character limit"],
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
fs.writeFileSync("blog-tool-kw.json", JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
for (const [c, list] of Object.entries(byCluster)) {
  const strong = list.filter((r) => r.sources >= 4);
  console.log(`\n## ${c}  (${list.length} phrases, ${strong.length} on 4+ sources, top-10 total ${list.slice(0, 10).reduce((s, r) => s + r.score, 0)})`);
  for (const r of list.slice(0, 12)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/5  ${r.phrase}`);
}
