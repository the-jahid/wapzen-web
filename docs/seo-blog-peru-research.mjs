// Peru posts research (see seo-research.md, "Peru posts"). Run:
// node docs/seo-blog-peru-research.mjs -> prints the top phrases per cluster and writes
// blog-kw-peru.json in the cwd. Same rank-weighted scoring as
// seo-blog-mena-asia-research.mjs: Google and YouTube autocomplete with hl=es-419, gl=pe
// (ie/oe=utf-8 keeps the accents) and DuckDuckGo with kl=pe-es. The clusters follow
// Peru's largest groups of small businesses (Produce 2024: commerce 44.2%, services
// 41.6%; restaurants are the largest named service group).
import fs from "node:fs";

const clusters = {
  restaurantes: ["chatbot para restaurantes", "pedidos por whatsapp restaurante", "whatsapp para restaurantes", "bot de whatsapp para restaurantes", "ia para restaurantes", "pedidos por whatsapp", "menu por whatsapp", "chatbot para pollería", "sistema de pedidos por whatsapp", "delivery por whatsapp", "chatbot para delivery", "reservas por whatsapp restaurante"],
  tiendas: ["vender por whatsapp", "como vender por whatsapp", "chatbot para tienda online", "chatbot para ventas whatsapp", "ia para vender por whatsapp", "catálogo whatsapp business", "tienda de ropa whatsapp", "chatbot para tienda de ropa", "confirmar pedidos whatsapp", "bot de ventas whatsapp", "whatsapp para negocios", "ventas por whatsapp", "chatbot para ecommerce", "chatbot para emprendedores"],
  inmobiliaria: ["chatbot para inmobiliarias", "whatsapp para inmobiliarias", "ia para inmobiliarias", "crm inmobiliario", "asistente virtual inmobiliaria", "ia para agentes inmobiliarios", "chatbot inmobiliario", "bot inmobiliario whatsapp", "ia para corredores inmobiliarios", "crm inmobiliario gratis"],
  turismo: ["chatbot para agencias de viaje", "whatsapp para hoteles", "chatbot para hoteles", "ia para agencias de viaje", "chatbot turismo", "ia para hoteles", "whatsapp para agencias de viaje", "chatbot para hostales", "reservas por whatsapp hotel"],
  educacion: ["chatbot para colegios", "whatsapp para colegios", "chatbot para academias", "chatbot para universidades", "ia para colegios", "matrícula por whatsapp", "chatbot para institutos", "chatbot educativo whatsapp", "chatbot para academia preuniversitaria"],
  belleza: ["chatbot para salones de belleza", "whatsapp para salón de belleza", "chatbot para barbería", "ia para barbería", "chatbot para spa", "agendar citas por whatsapp", "citas por whatsapp", "sistema de citas por whatsapp", "chatbot para clínica estética", "ia para salón de belleza"],
  gratis: ["chatbot whatsapp", "chatbot para whatsapp gratis", "chatbot gratis whatsapp", "bot de whatsapp gratis", "bot de whatsapp", "ia para whatsapp", "ia para whatsapp gratis", "chatbot whatsapp gratis", "chatbot con ia para whatsapp", "agente de ia para whatsapp", "agente ia whatsapp gratis", "crear chatbot whatsapp gratis", "mejor chatbot para whatsapp", "chatbot whatsapp peru", "chatbot peru", "ia para responder whatsapp", "asistente virtual whatsapp"],
  business: ["whatsapp business", "whatsapp business precio", "whatsapp business es gratis", "whatsapp business api", "whatsapp business api precio", "whatsapp business api peru", "respuestas automáticas whatsapp business", "mensaje de bienvenida whatsapp business", "mensajes automáticos whatsapp", "respuestas rápidas whatsapp business", "cuánto cuesta whatsapp business", "whatsapp business cuesta"],
  servicios: ["chatbot para abogados", "ia para abogados", "chatbot para gimnasios", "chatbot para veterinarias", "chatbot para talleres mecánicos", "chatbot para ferreterías", "chatbot para farmacias", "chatbot para boticas", "chatbot para contadores", "chatbot para seguros", "chatbot para concesionarios", "chatbot para bodegas"],
  atencion: ["atención al cliente por whatsapp", "atención al cliente con ia", "chatbot atención al cliente", "automatizar whatsapp", "automatizar whatsapp business", "automatizar respuestas whatsapp", "responder whatsapp automáticamente", "ia atención al cliente whatsapp"],
  voz: ["agente de voz ia", "ia que contesta llamadas", "llamadas con ia", "asistente de voz ia para negocios", "agente de voz ia gratis", "recepcionista ia"],
};

const hl = "es-419", gl = "pe", kl = "pe-es";
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
fs.writeFileSync("blog-kw-peru.json", JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
const ranked = Object.entries(byCluster).map(([c, list]) => [c, list, list.reduce((s, r) => s + r.score, 0)]).sort((a, b) => b[2] - a[2]);
for (const [c, list, total] of ranked) {
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 14)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${r.phrase}`);
}
