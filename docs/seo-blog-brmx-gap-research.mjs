// Brazil and Mexico gap research (see seo-research.md, "Brazil and Mexico gap posts").
// Run from a scratch folder: node "<path>/seo-blog-brmx-gap-research.mjs" br|mx -> prints
// top phrases per cluster and writes blog-kw-gap-<market>.json in the cwd. Same
// rank-weighted scoring as the other harvests: Google and YouTube with the market's hl/gl
// (ie/oe=utf-8 keeps accents) and DuckDuckGo with its kl region. Seeds skip the topics the
// two blogs already cover, except where a question is the point (free chatbot, AI agent).
import fs from "node:fs";

const markets = {
  br: {
    hl: "pt-BR", gl: "br", kl: "br-pt",
    clusters: {
      gratis: ["chatbot whatsapp grátis", "chatbot gratuito para whatsapp", "robô whatsapp grátis", "ia no whatsapp grátis", "atendente virtual whatsapp grátis", "chatbot whatsapp com ia grátis", "bot whatsapp gratuito"],
      agenteIa: ["agente de ia whatsapp", "agente de ia para atendimento", "agente de ia para whatsapp grátis", "atendente virtual whatsapp", "atendente ia whatsapp", "secretária virtual whatsapp", "secretária virtual ia", "ia para responder whatsapp", "ia para atendimento whatsapp", "como colocar ia no whatsapp", "como colocar chatgpt no whatsapp"],
      resposta: ["resposta automática whatsapp", "resposta automática whatsapp business", "como programar resposta automática whatsapp", "mensagem automática whatsapp", "whatsapp responder automaticamente", "ia responder mensagens whatsapp"],
      comparativos: ["botconversa preço", "botconversa alternativa", "botconversa é bom", "manychat preço", "manychat alternativa", "alternativa ao botconversa", "melhor chatbot para whatsapp", "melhores chatbots whatsapp", "typebot whatsapp", "kommo preço", "digisac preço", "blip preço", "umbler talk preço"],
      apiNaoOficial: ["api whatsapp não oficial", "z-api", "evolution api", "whatsapp sem api oficial", "chatbot sem api oficial", "api oficial whatsapp preço", "api oficial do whatsapp", "n8n whatsapp"],
      disparo: ["disparo em massa whatsapp", "disparo whatsapp grátis", "enviar mensagem para vários contatos whatsapp", "lista de transmissão whatsapp", "disparador whatsapp", "enviar mensagem em massa whatsapp"],
      vendas: ["whatsapp para vendas", "vender pelo whatsapp com ia", "funil de vendas whatsapp", "crm whatsapp", "crm whatsapp grátis", "recuperar clientes whatsapp", "atendimento whatsapp pequenas empresas"],
      estetica: ["chatbot para clínica de estética", "ia para clínica de estética", "whatsapp para clínica de estética", "secretária virtual clínica estética", "agendamento clínica estética whatsapp", "marketing para clínica de estética"],
      salao: ["chatbot para salão de beleza", "whatsapp para salão de beleza", "agendamento salão de beleza whatsapp", "ia para salão de beleza", "robô whatsapp salão", "chatbot barbearia", "whatsapp para barbearia", "agendamento barbearia whatsapp", "robô whatsapp barbearia", "ia para barbearia"],
      medicos: ["chatbot para clínica médica", "secretária virtual para médicos", "ia para clínica médica", "whatsapp para clínica médica", "secretária virtual clínica", "chatbot psicólogo", "whatsapp para psicólogos", "ia para psicólogos", "whatsapp nutricionista", "ia para nutricionista"],
      advocacia: ["chatbot para advogados", "ia para advogados whatsapp", "whatsapp para escritório de advocacia", "robô whatsapp advocacia", "ia para advogados", "atendimento whatsapp advocacia"],
      contabilidade: ["chatbot para contabilidade", "whatsapp para escritório de contabilidade", "ia para contador whatsapp", "ia para contabilidade", "robô whatsapp contabilidade"],
      seguros: ["chatbot para corretora de seguros", "ia para corretor de seguros", "whatsapp para corretor de seguros", "robô whatsapp seguros", "ia para corretora de seguros"],
      educacao: ["chatbot para escola", "chatbot para escola de inglês", "whatsapp para escolas", "ia para escolas", "chatbot para cursos", "whatsapp para cursos", "ia para vender cursos", "chatbot infoprodutos"],
      academia: ["chatbot para academia", "whatsapp para academia", "robô whatsapp academia", "ia para academia", "chatbot crossfit"],
      oficina: ["chatbot para oficina mecânica", "whatsapp para oficina mecânica", "chatbot para concessionária", "whatsapp para concessionária", "ia para loja de carros", "ia para oficina mecânica", "robô whatsapp loja de carros"],
      lojas: ["chatbot para loja de roupas", "whatsapp para loja de roupas", "ia para loja virtual", "chatbot loja virtual whatsapp", "chatbot para e-commerce", "whatsapp para lojas", "chatbot shopify whatsapp", "nuvemshop whatsapp"],
      petshop: ["chatbot para veterinária", "whatsapp para pet shop", "robô whatsapp pet shop", "ia para pet shop", "agendamento pet shop whatsapp"],
      solar: ["chatbot para energia solar", "ia para vendas de energia solar", "whatsapp energia solar", "ia para energia solar"],
      igreja: ["chatbot para igreja", "whatsapp para igreja", "robô whatsapp igreja"],
      hotel: ["chatbot para hotel", "whatsapp para pousada", "ia para hotel", "chatbot pousada", "ia para pousada"],
    },
  },
  mx: {
    hl: "es-419", gl: "mx", kl: "mx-es",
    clusters: {
      gratis: ["chatbot whatsapp gratis", "chatbot gratis para whatsapp", "bot de whatsapp gratis", "ia en whatsapp gratis", "chatbot con ia gratis whatsapp", "asistente virtual whatsapp gratis"],
      agenteIa: ["agente de ia whatsapp", "agente de ia para atención al cliente", "agente de ia para whatsapp gratis", "asistente virtual whatsapp", "recepcionista virtual ia", "ia para responder whatsapp", "ia para atención al cliente whatsapp", "cómo poner ia en whatsapp", "como poner chatgpt en whatsapp"],
      respuesta: ["respuesta automática whatsapp", "respuestas automáticas whatsapp business", "como programar respuestas automaticas whatsapp", "whatsapp responder automáticamente", "ia para contestar mensajes whatsapp"],
      comparativos: ["alternativas a manychat", "manychat precio", "manychat vs", "leadsales precios", "leadsales opiniones", "leadsales alternativas", "kommo precios", "kommo alternativas", "wati precios", "mejor chatbot para whatsapp", "mejores chatbots para whatsapp", "botmaker precios", "treble precios", "respond.io precios"],
      api: ["whatsapp api méxico", "api de whatsapp precio méxico", "whatsapp sin api", "chatbot sin api oficial", "api no oficial whatsapp", "n8n whatsapp", "api oficial whatsapp"],
      masivos: ["mensajes masivos whatsapp", "enviar mensajes masivos whatsapp gratis", "difusión whatsapp", "lista de difusión whatsapp business", "whatsapp masivo", "como enviar mensajes a varios contactos whatsapp"],
      ventas: ["whatsapp para ventas", "crm whatsapp", "crm para whatsapp gratis", "embudo de ventas whatsapp", "seguimiento de clientes whatsapp", "cobranza por whatsapp", "cobrar por whatsapp", "recordatorio de pago whatsapp"],
      restaurantes: ["chatbot para restaurantes", "bot whatsapp pedidos restaurante", "pedidos por whatsapp restaurante", "whatsapp para restaurantes", "menú whatsapp pedidos", "chatbot delivery whatsapp", "ia para restaurantes", "software para restaurantes", "alternativa a uber eats", "taquería whatsapp pedidos", "pedidos a domicilio whatsapp"],
      dental: ["chatbot para consultorio dental", "chatbot para clínica dental", "whatsapp para dentistas", "software dental", "recordatorio de citas dentales", "asistente virtual para dentistas", "agenda dental whatsapp", "marketing para dentistas", "ia para dentistas"],
      medicos: ["chatbot para médicos", "whatsapp para consultorio médico", "asistente virtual para médicos", "ia para médicos", "agenda médica whatsapp", "software para consultorio médico", "recordatorio de citas médicas whatsapp", "ia para psicólogos", "whatsapp para psicólogos", "whatsapp para nutriólogos"],
      estetica: ["chatbot para clínica estética", "whatsapp para clínicas estéticas", "ia para clínicas estéticas", "software para clínica estética", "marketing para clínicas estéticas", "chatbot para centro de estética"],
      salon: ["chatbot para salón de belleza", "whatsapp para salón de belleza", "agenda salón de belleza whatsapp", "software para salón de belleza", "ia para salón de belleza", "chatbot barbería", "whatsapp para barbería", "agenda barbería whatsapp", "software para barberías"],
      educacion: ["chatbot para escuelas", "whatsapp para escuelas", "chatbot para colegios", "chatbot para cursos", "ia para escuelas", "ia para academia de inglés", "whatsapp para academias", "cobranza colegiaturas whatsapp"],
      seguros: ["chatbot para seguros", "whatsapp para agentes de seguros", "ia para agentes de seguros", "chatbot aseguradora whatsapp", "crm para agentes de seguros"],
      legal: ["chatbot para abogados", "whatsapp para abogados", "ia para abogados whatsapp", "bot para despacho de abogados", "ia para abogados", "ia para contadores", "whatsapp para contadores", "chatbot para despacho contable"],
      gimnasios: ["chatbot para gimnasios", "whatsapp para gimnasios", "bot gimnasio whatsapp", "software para gimnasios", "ia para gimnasios"],
      veterinarias: ["chatbot para veterinarias", "whatsapp para veterinarias", "bot veterinaria whatsapp", "software para veterinarias", "ia para veterinarias"],
      autos: ["whatsapp para concesionarios", "chatbot para agencias de autos", "ia para agencias de autos", "whatsapp para venta de autos", "chatbot autos seminuevos", "crm automotriz whatsapp", "whatsapp para talleres mecánicos", "software para taller mecánico"],
      tiendas: ["chatbot para tienda en línea", "whatsapp para tienda en línea", "ia para tienda en línea", "chatbot shopify whatsapp", "tiendanube whatsapp", "mercado libre whatsapp", "chatbot para tienda de ropa", "whatsapp para tiendas de ropa"],
      hoteles: ["chatbot para hoteles", "whatsapp para hoteles", "ia para hoteles", "chatbot para hotel méxico", "whatsapp para agencias de viajes", "ia para agencias de viajes"],
    },
  },
};

const market = markets[process.argv[2]];
if (!market) throw new Error("usage: node seo-blog-brmx-gap-research.mjs br|mx");
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
fs.writeFileSync(`blog-kw-gap-${process.argv[2]}.json`, JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
const ranked = Object.entries(byCluster).map(([c, list]) => [c, list, list.reduce((s, r) => s + r.score, 0)]).sort((a, b) => b[2] - a[2]);
for (const [c, list, total] of ranked) {
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 14)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${r.phrase}`);
}
