// Spain industry research (see seo-research.md, "Spain buyer posts"). Run from a scratch
// folder: node "<path>/seo-blog-spain-research.mjs" -> prints the top phrases per vertical
// and writes blog-kw-spain.json in the cwd. Same rank-weighted scoring as
// seo-blog-india-research.mjs: Google and YouTube with hl=es, gl=es, and DuckDuckGo with
// its es-es region. Seeds use the words the owners search for, plus a WhatsApp phrase.
import fs from "node:fs";

const verticals = {
  dental: ["chatbot clinica dental", "ia para clinicas dentales", "whatsapp clinica dental", "software clinica dental", "recordatorio cita dentista whatsapp", "marketing clinica dental", "captar pacientes clinica dental", "recepcionista virtual clinica dental"],
  estetica: ["chatbot clinica estetica", "ia para clinicas de estetica", "whatsapp clinica estetica", "software clinica estetica", "marketing clinica estetica", "captar clientes clinica estetica", "whatsapp centro de estetica", "software centro de estetica"],
  fisio: ["chatbot fisioterapia", "whatsapp clinica fisioterapia", "software clinica fisioterapia", "ia para fisioterapeutas", "marketing para fisioterapeutas", "programa gestion fisioterapia"],
  inmobiliaria: ["chatbot inmobiliaria", "ia para inmobiliarias", "whatsapp inmobiliaria", "crm inmobiliario", "leads idealista", "captar clientes inmobiliaria", "agente ia inmobiliaria", "whatsapp para agentes inmobiliarios"],
  talleres: ["chatbot taller mecanico", "whatsapp taller mecanico", "software taller mecanico", "ia para talleres", "marketing taller mecanico", "cita previa taller whatsapp", "programa gestion taller"],
  concesionarios: ["chatbot concesionario", "whatsapp concesionario", "crm concesionario", "ia para concesionarios", "leads coches segunda mano", "compraventa coches whatsapp"],
  restaurantes: ["chatbot restaurante", "reservas restaurante whatsapp", "whatsapp restaurante", "ia para restaurantes", "software reservas restaurante", "pedidos por whatsapp restaurante", "pedidos whatsapp sin comision", "bot reservas restaurante"],
  turistico: ["chatbot apartamentos turisticos", "whatsapp apartamentos turisticos", "software apartamentos turisticos", "ia para alojamientos turisticos", "chatbot hotel whatsapp", "whatsapp para hoteles", "ia para hoteles", "whatsapp casa rural"],
  academias: ["chatbot academia", "whatsapp academia", "software academia", "captar alumnos academia", "marketing para academias", "ia para academias", "academia de ingles whatsapp", "centro de formacion whatsapp"],
  autoescuelas: ["chatbot autoescuela", "whatsapp autoescuela", "software autoescuela", "marketing autoescuela", "captar alumnos autoescuela", "programa gestion autoescuela"],
  gimnasios: ["chatbot gimnasio", "whatsapp gimnasio", "software gimnasio", "captar clientes gimnasio", "ia para gimnasios", "software centro de pilates", "whatsapp centro de pilates", "marketing para gimnasios"],
  veterinarias: ["chatbot clinica veterinaria", "whatsapp clinica veterinaria", "software veterinario", "ia para veterinarios", "recordatorio vacunas whatsapp", "marketing clinica veterinaria"],
  seguros: ["chatbot correduria de seguros", "whatsapp correduria de seguros", "software correduria seguros", "ia para corredores de seguros", "whatsapp agente de seguros", "crm corredurias"],
  gestorias: ["chatbot asesoria", "whatsapp gestoria", "software gestoria", "ia para asesorias", "ia para gestorias", "captar clientes asesoria", "whatsapp asesoria fiscal"],
  abogados: ["chatbot abogados", "whatsapp para abogados", "ia para abogados", "captar clientes abogado", "software despacho abogados", "recepcionista virtual abogados"],
  reformas: ["chatbot empresa de reformas", "whatsapp empresa reformas", "captar clientes reformas", "software empresa reformas", "presupuestos reformas whatsapp", "marketing empresa de reformas", "ia para instaladores", "software instaladores"],
  ecommerce: ["chatbot whatsapp tienda online", "whatsapp para tienda online", "whatsapp ecommerce", "whatsapp shopify", "woocommerce whatsapp", "carrito abandonado whatsapp", "atencion al cliente tienda online whatsapp"],
  psicologia: ["chatbot psicologos", "whatsapp psicologo", "software psicologos", "ia para psicologos", "captar pacientes psicologo"],
  opticas: ["whatsapp optica", "software optica", "marketing optica", "ia para opticas", "chatbot farmacia", "whatsapp farmacia"],
  generic: ["chatbot whatsapp gratis", "chatbot whatsapp españa", "chatbot para whatsapp business", "whatsapp business ia", "agente ia whatsapp", "agente de voz ia", "recepcionista virtual ia", "llamadas con ia", "contestador automatico whatsapp", "whatsapp api precio españa", "automatizar whatsapp pymes", "whatsapp para empresas"],
};

const hl = "es", gl = "es", kl = "es-es";
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
for (const [cluster, seeds] of Object.entries(verticals)) for (const q of seeds) for (const [name, url] of Object.entries(sources)) tasks.push({ cluster, name, url: url(q) });
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
fs.writeFileSync("blog-kw-spain.json", JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
const ranked = Object.entries(byCluster).map(([c, list]) => [c, list, list.reduce((s, r) => s + r.score, 0)]).sort((a, b) => b[2] - a[2]);
for (const [c, list, total] of ranked) {
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 12)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${r.phrase}`);
}
