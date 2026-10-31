// Latin America buyer-vertical research (see seo-research.md, "Latin America buyer
// posts"). Run: node docs/seo-blog-latam-verticals-research.mjs br|mx|co|cl -> prints
// the top phrases per vertical and writes blog-kw-verticals-<market>.json in the cwd.
// Same rank-weighted scoring as seo-blog-latam-research.mjs: Google and YouTube with
// the market's hl/gl (ie/oe=utf-8 keeps accents) and DuckDuckGo with its kl region.
import fs from "node:fs";

const spanishVerticals = {
  inmobiliaria: ["chatbot para inmobiliarias", "whatsapp para inmobiliarias", "ia para inmobiliarias", "crm inmobiliario whatsapp", "asistente virtual inmobiliaria", "whatsapp para corredores de propiedades", "bot whatsapp inmobiliaria"],
  autos: ["whatsapp para concesionarios", "chatbot para agencias de autos", "ia para concesionarios", "whatsapp para venta de autos", "chatbot autos seminuevos", "crm automotriz whatsapp"],
  contraentrega: ["confirmar pedidos whatsapp", "bot whatsapp dropshipping", "chatbot contraentrega", "automatizar whatsapp dropshipping", "chatbot para tienda online whatsapp", "ia para dropshipping whatsapp", "confirmación de pedidos contraentrega"],
  dental: ["chatbot para consultorio dental", "chatbot para clínica dental", "whatsapp para dentistas", "software dental whatsapp", "recordatorio de citas dentales", "asistente virtual para dentistas", "agenda dental whatsapp"],
  estetica: ["chatbot para clínica estética", "whatsapp para clínicas estéticas", "ia para clínicas estéticas", "agenda clínica estética whatsapp", "chatbot para centro de estética"],
  restaurantes: ["chatbot para restaurantes", "bot whatsapp pedidos restaurante", "pedidos por whatsapp restaurante", "whatsapp para restaurantes", "menú whatsapp pedidos", "chatbot delivery whatsapp"],
  educacion: ["chatbot para escuelas", "whatsapp para academias", "chatbot para colegios", "chatbot para cursos", "ia para academia de inglés"],
  seguros: ["chatbot para seguros", "whatsapp para agentes de seguros", "ia para corredores de seguros", "chatbot aseguradora whatsapp"],
  legal: ["chatbot para abogados", "whatsapp para abogados", "ia para abogados whatsapp", "bot para despacho de abogados"],
  gimnasios: ["chatbot para gimnasios", "whatsapp para gimnasios", "bot gimnasio whatsapp"],
  veterinarias: ["chatbot para veterinarias", "whatsapp para veterinarias", "bot veterinaria whatsapp"],
};

const markets = {
  br: {
    hl: "pt-BR", gl: "br", kl: "br-pt",
    clusters: {
      imobiliaria: ["chatbot para imobiliária", "whatsapp para imobiliária", "ia para imobiliária", "ia para corretor de imóveis", "robô whatsapp imobiliária", "crm imobiliário whatsapp", "atendimento imobiliária whatsapp"],
      delivery: ["robô whatsapp delivery", "chatbot para delivery", "robô whatsapp restaurante", "robô para pizzaria whatsapp", "pedidos pelo whatsapp restaurante", "alternativa ao ifood", "anota ai", "cardápio digital whatsapp"],
      estetica: ["chatbot para clínica de estética", "ia para clínica de estética", "whatsapp para clínica de estética", "secretária virtual clínica estética", "agendamento clínica estética whatsapp"],
      advocacia: ["chatbot para advogados", "ia para advogados whatsapp", "whatsapp para escritório de advocacia", "robô whatsapp advocacia"],
      seguros: ["chatbot para corretora de seguros", "ia para corretor de seguros", "whatsapp para corretor de seguros", "robô whatsapp seguros"],
      educacao: ["chatbot para escola", "chatbot para escola de inglês", "whatsapp para escolas", "ia para escola whatsapp", "chatbot para cursos"],
      academia: ["chatbot para academia", "whatsapp para academia de ginástica", "robô whatsapp academia"],
      oficina: ["chatbot para oficina mecânica", "whatsapp para oficina mecânica", "chatbot para concessionária", "whatsapp para concessionária", "ia para loja de carros"],
      contabilidade: ["chatbot para contabilidade", "whatsapp para escritório de contabilidade", "ia para contador whatsapp"],
      veterinaria: ["chatbot para veterinária", "whatsapp para pet shop", "robô whatsapp pet shop"],
      energiaSolar: ["chatbot para energia solar", "ia para vendas de energia solar", "whatsapp energia solar"],
    },
  },
  mx: { hl: "es-419", gl: "mx", kl: "mx-es", clusters: spanishVerticals },
  co: { hl: "es-419", gl: "co", kl: "co-es", clusters: spanishVerticals },
  cl: { hl: "es-419", gl: "cl", kl: "cl-es", clusters: spanishVerticals },
};

const market = markets[process.argv[2]];
if (!market) throw new Error("usage: node docs/seo-blog-latam-verticals-research.mjs br|mx|co|cl");
const { hl, gl, kl, clusters } = market;
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
    await sleep(80);
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
const rows = [...scores].map(([phrase, e]) => ({ phrase, score: e.score, sources: e.sources.size, cluster: [...e.clusters].join("+") })).sort((a, b) => b.score - a.score);
fs.writeFileSync(`blog-kw-verticals-${process.argv[2]}.json`, JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
const ranked = Object.entries(byCluster).map(([c, list]) => [c, list, list.reduce((s, r) => s + r.score, 0)]).sort((a, b) => b[2] - a[2]);
for (const [c, list, total] of ranked) {
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 8)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${r.phrase}`);
}
