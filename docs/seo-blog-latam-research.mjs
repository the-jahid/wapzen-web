// Mexico and Brazil blog topic research (see seo-research.md, "Mexico and Brazil
// blogs"). Run: node docs/seo-blog-latam-research.mjs mx|br -> prints the top phrases
// per cluster and writes blog-kw-<market>.json in the cwd. Same rank-weighted scoring
// as seo-blog-it-research.mjs: Google and YouTube with the market's hl/gl (ie/oe=utf-8
// keeps accents) and DuckDuckGo with its kl region.
import fs from "node:fs";

const markets = {
  mx: {
    hl: "es-419", gl: "mx", kl: "mx-es",
    clusters: {
      precios: ["whatsapp business api precio", "cuánto cuesta whatsapp business", "whatsapp business es gratis", "whatsapp business api costo", "precio mensajes whatsapp business", "whatsapp business tiene costo", "costo whatsapp api"],
      chatbot: ["chatbot para whatsapp", "bot de whatsapp", "cómo crear un bot de whatsapp", "chatbot whatsapp gratis", "chatbot whatsapp business", "chatbot con ia para whatsapp", "bot para whatsapp business"],
      mensajes: ["mensaje de bienvenida whatsapp business", "mensaje de ausencia whatsapp business", "respuestas rápidas whatsapp business", "mensajes automáticos whatsapp business", "ejemplos de mensaje de bienvenida para whatsapp business", "mensaje automático whatsapp"],
      appVsNormal: ["diferencia entre whatsapp y whatsapp business", "whatsapp business vs whatsapp", "qué es whatsapp business", "para qué sirve whatsapp business", "whatsapp business o normal", "cómo usar whatsapp business"],
      chatgpt: ["chatgpt en whatsapp", "chatgpt whatsapp número", "cómo usar chatgpt en whatsapp", "meta ai whatsapp", "cómo quitar meta ai de whatsapp", "inteligencia artificial whatsapp"],
      ventas: ["cómo vender por whatsapp", "vender por whatsapp business", "catálogo whatsapp business", "pedidos por whatsapp", "tienda en whatsapp", "cobrar por whatsapp"],
      citas: ["agendar citas por whatsapp", "recordatorio de citas whatsapp", "agenda whatsapp business", "bot para agendar citas whatsapp", "whatsapp para consultorio"],
      competidores: ["leadsales", "leadsales precio", "kommo whatsapp", "manychat whatsapp", "wati whatsapp", "treble whatsapp", "botmaker", "alternativas a manychat"],
      llamadas: ["asistente virtual con ia", "recepcionista virtual", "contestadora automática whatsapp", "llamadas con ia", "agente de voz ia", "conmutador virtual"],
      ban: ["whatsapp baneado", "cuenta de whatsapp bloqueada", "número baneado whatsapp", "whatsapp business suspendido"],
      difusion: ["lista de difusión whatsapp", "whatsapp marketing", "mensajes masivos whatsapp", "envío masivo whatsapp"],
    },
  },
  br: {
    hl: "pt-BR", gl: "br", kl: "br-pt",
    clusters: {
      precos: ["whatsapp business api preço", "quanto custa whatsapp business api", "whatsapp business é pago", "whatsapp business api valor", "preço mensagem whatsapp api", "whatsapp api oficial preço", "whatsapp business pago"],
      chatbot: ["robô para whatsapp", "chatbot whatsapp", "como criar um robô no whatsapp", "chatbot para whatsapp grátis", "robô whatsapp business", "como fazer chatbot no whatsapp", "bot whatsapp"],
      mensagens: ["mensagem de saudação whatsapp business", "mensagem automática whatsapp business", "mensagem de ausência whatsapp business", "respostas rápidas whatsapp business", "exemplos de mensagem de saudação whatsapp business", "mensagem de boas vindas whatsapp"],
      appVsNormal: ["diferença entre whatsapp e whatsapp business", "whatsapp business ou normal", "o que é whatsapp business", "como usar whatsapp business", "whatsapp business vale a pena"],
      chatgpt: ["chatgpt no whatsapp", "chatgpt whatsapp número", "como usar chatgpt no whatsapp", "meta ai whatsapp", "como desativar meta ai whatsapp", "inteligência artificial whatsapp"],
      apiNaoOficial: ["api whatsapp não oficial", "api não oficial whatsapp é seguro", "z-api", "evolution api whatsapp", "api oficial vs não oficial whatsapp", "whatsapp business api oficial"],
      vendas: ["como vender pelo whatsapp", "catálogo whatsapp business", "pedidos pelo whatsapp", "cardápio digital whatsapp", "pagamento pelo whatsapp pix", "delivery whatsapp"],
      agendamento: ["agendamento pelo whatsapp", "agendamento automático whatsapp", "lembrete de consulta whatsapp", "robô de agendamento whatsapp", "agenda whatsapp"],
      concorrentes: ["botconversa", "botconversa preço", "blip whatsapp", "zenvia whatsapp", "digisac", "umbler talk", "alternativa ao botconversa"],
      ban: ["whatsapp banido", "número banido whatsapp", "whatsapp business banido", "como evitar banimento whatsapp", "conta whatsapp bloqueada"],
      disparo: ["disparo em massa whatsapp", "lista de transmissão whatsapp", "disparo whatsapp", "whatsapp marketing"],
    },
  },
};

const market = markets[process.argv[2]];
if (!market) throw new Error("usage: node docs/seo-blog-latam-research.mjs mx|br");
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
fs.writeFileSync(`blog-kw-${process.argv[2]}.json`, JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
for (const [c, list] of Object.entries(byCluster)) {
  const total = list.reduce((s, r) => s + r.score, 0);
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 12)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${r.phrase}`);
}
