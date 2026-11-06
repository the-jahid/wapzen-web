// Brazil free-chatbot and barbershop/salon research (see seo-research.md, "Brazil free
// chatbot and salon posts"). Run from a scratch folder:
// node "<path>/seo-blog-br-free-salon-research.mjs" -> prints top phrases per cluster and writes
// blog-kw-br-free-salon.json in the cwd. Same rank-weighted scoring as the other harvests:
// Google and YouTube with hl=pt-BR, gl=br (ie/oe=utf-8 keeps accents) and DuckDuckGo with
// kl=br-pt.
import fs from "node:fs";

const clusters = {
  gratis: ["chatbot grátis para whatsapp", "chatbot gratuito para whatsapp", "chatbot gratuito para whatsapp business", "bot whatsapp gratuito", "robô de atendimento whatsapp grátis", "melhor chatbot para whatsapp", "melhor chatbot whatsapp grátis", "melhor chatbot para whatsapp business", "criar chatbot whatsapp grátis", "chatbot whatsapp ia grátis", "quanto custa um chatbot para whatsapp", "chatbot whatsapp preço"],
  alternativas: ["alternativa ao botconversa", "botconversa alternativas", "botconversa preço", "botconversa é bom", "botconversa grátis", "manychat whatsapp preço", "manychat é grátis", "typebot whatsapp grátis", "umbler talk preço", "digisac preço", "kommo preço", "blip preço", "zenvia preço"],
  barbearia: ["ia para barbearia", "agente de ia para barbearia", "atendente virtual barbearia", "chatbot barbearia", "chatbot para barbearia", "robô whatsapp barbearia", "whatsapp para barbearia", "agendamento barbearia whatsapp", "automação whatsapp barbearia", "sistema para barbearia", "sistema para barbearia grátis", "app para barbearia", "app de agendamento barbearia grátis"],
  salao: ["ia para salão de beleza", "agente de ia para salão de beleza", "chatbot para salão de beleza", "whatsapp para salão de beleza", "agendamento salão de beleza whatsapp", "robô whatsapp salão de beleza", "mensagem para clientes salão de beleza whatsapp", "sistema para salão de beleza", "sistema para salão de beleza grátis", "app para salão de beleza", "confirmação de horário salão whatsapp"],
  manicure: ["ia para manicure", "agenda para manicure whatsapp", "whatsapp para manicure", "whatsapp para esteticista", "ia para esteticista", "ia para clínica de estética", "lash designer whatsapp", "agendamento manicure whatsapp", "nail designer whatsapp"],
  faltas: ["cliente falta horário barbearia", "como evitar faltas salão de beleza", "lembrete de horário whatsapp", "mensagem de confirmação de horário whatsapp", "cobrar sinal salão de beleza", "política de cancelamento salão de beleza", "trinks preço", "appbarber preço", "booksy preço", "avec salão preço"],
};

const hl = "pt-BR";
const gl = "br";
const kl = "br-pt";
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
for (const [cluster, seeds] of Object.entries(clusters)) for (const q of seeds) for (const [name, url] of Object.entries(sources)) tasks.push({ cluster, name, url: url(q) });
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
fs.writeFileSync("blog-kw-br-free-salon.json", JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
const ranked = Object.entries(byCluster).map(([c, list]) => [c, list, list.reduce((s, r) => s + r.score, 0)]).sort((a, b) => b[2] - a[2]);
for (const [c, list, total] of ranked) {
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 22)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${r.phrase}`);
}
