// Saudi Arabia, Egypt, Indonesia and Peru vertical research (see seo-research.md,
// "Saudi Arabia, Egypt, Indonesia and Peru posts"). Run:
// node docs/seo-blog-mena-asia-research.mjs sa|eg|id|pe -> prints the top phrases per
// vertical and writes blog-kw-mena-asia-<market>.json in the cwd. Same rank-weighted
// scoring as seo-blog-latam-verticals-research.mjs: Google and YouTube with the
// market's hl/gl (ie/oe=utf-8 keeps Arabic and accents) and DuckDuckGo with its kl
// region. DuckDuckGo has no Egypt region, so Egypt shares Saudi Arabia's "xa-ar".
import fs from "node:fs";

const arabicVerticals = {
  dental: ["عيادة اسنان واتساب", "حجز موعد عيادة اسنان", "شات بوت عيادة اسنان", "برنامج عيادة اسنان", "تذكير مواعيد المرضى", "سكرتير عيادة اسنان"],
  clinics: ["شات بوت للعيادات", "حجز مواعيد العيادات واتساب", "واتساب للعيادات", "ذكاء اصطناعي للعيادات", "سكرتيرة افتراضية للعيادة", "نظام حجز مواعيد عيادة", "رد آلي للعيادات"],
  realEstate: ["شات بوت عقارات", "واتساب للعقارات", "ذكاء اصطناعي في العقارات", "تسويق عقاري واتساب", "crm عقاري", "رد آلي مكتب عقار", "برنامج مكتب عقاري"],
  education: ["شات بوت للمدارس", "واتساب للمدارس", "ذكاء اصطناعي للمدارس", "تسجيل الطلاب واتساب", "سنتر دروس واتساب", "شات بوت للجامعات", "رد آلي مركز تعليمي"],
  generic: ["شات بوت واتساب", "بوت واتساب", "رد آلي واتساب", "رد تلقائي واتساب بزنس", "ذكاء اصطناعي واتساب", "واتساب بزنس api", "شات بوت واتساب مجاني"],
  restaurants: ["بوت واتساب مطعم", "طلبات واتساب مطعم", "شات بوت مطاعم"],
  beauty: ["صالون تجميل واتساب", "حجز مواعيد صالون", "عيادة تجميل حجز موعد"],
  umrah: ["شركات عمرة واتساب", "حجز عمرة واتساب", "برنامج شركات السياحة"],
  ecommerce: ["متجر واتساب", "ربط سلة بالواتساب", "ربط زد بالواتساب", "تأكيد الطلبات واتساب"],
  voice: ["مساعد صوتي ذكاء اصطناعي", "الرد على المكالمات بالذكاء الاصطناعي", "مكالمات واتساب ذكاء اصطناعي", "وكيل صوتي ذكاء اصطناعي"],
};

const markets = {
  sa: { hl: "ar", gl: "sa", kl: "xa-ar", clusters: arabicVerticals },
  eg: { hl: "ar", gl: "eg", kl: "xa-ar", clusters: arabicVerticals },
  id: {
    hl: "id", gl: "id", kl: "id-en",
    clusters: {
      klinik: ["chatbot klinik", "whatsapp klinik", "aplikasi klinik whatsapp", "reservasi klinik whatsapp", "admin klinik ai", "pendaftaran pasien online whatsapp"],
      gigi: ["klinik gigi whatsapp", "chatbot klinik gigi", "reservasi dokter gigi online", "aplikasi klinik gigi"],
      properti: ["chatbot properti", "whatsapp untuk agen properti", "ai untuk properti", "crm properti", "admin properti whatsapp", "marketing properti whatsapp"],
      pendidikan: ["chatbot sekolah", "whatsapp sekolah", "chatbot bimbel", "pendaftaran siswa baru whatsapp", "ai untuk sekolah", "chatbot kampus", "spmb sekolah swasta"],
      umroh: ["chatbot travel umroh", "whatsapp travel umroh", "aplikasi travel umroh", "crm travel umroh", "admin travel umroh"],
      olshop: ["chatbot whatsapp online shop", "auto reply whatsapp olshop", "bot whatsapp jualan", "cs ai whatsapp", "admin olshop ai"],
      generic: ["chatbot whatsapp", "bot whatsapp gratis", "auto reply whatsapp business", "chatbot whatsapp ai", "whatsapp business api", "chatbot whatsapp gratis"],
      restoran: ["chatbot restoran whatsapp", "pesan makanan lewat whatsapp", "bot whatsapp katering"],
      salon: ["booking salon whatsapp", "chatbot salon", "reservasi barbershop whatsapp"],
      voice: ["ai voice agent", "ai telepon otomatis", "ai customer service telepon", "ai yang bisa menelepon"],
    },
  },
  pe: {
    hl: "es-419", gl: "pe", kl: "pe-es",
    clusters: {
      salud: ["chatbot para clínicas", "whatsapp para clínicas", "citas médicas por whatsapp", "ia para clínicas", "chatbot para consultorios", "agendar citas clínica whatsapp"],
      dental: ["chatbot para clínica dental", "whatsapp para dentistas", "software dental", "recordatorio de citas dentales", "asistente virtual para dentistas"],
      inmobiliaria: ["chatbot para inmobiliarias", "whatsapp para inmobiliarias", "ia para inmobiliarias", "crm inmobiliario", "asistente virtual inmobiliaria"],
      educacion: ["chatbot para colegios", "whatsapp para colegios", "chatbot para academias", "chatbot para universidades", "ia para colegios", "matrícula por whatsapp", "academia preuniversitaria"],
      generic: ["chatbot whatsapp", "chatbot para whatsapp gratis", "bot de whatsapp", "respuestas automáticas whatsapp business", "ia para whatsapp", "whatsapp business api"],
      restaurantes: ["chatbot para restaurantes", "pedidos por whatsapp restaurante", "whatsapp para restaurantes"],
      estetica: ["chatbot para clínica estética", "whatsapp para spa", "chatbot para salones de belleza"],
      tiendas: ["chatbot para tienda online", "vender por whatsapp", "confirmar pedidos whatsapp"],
      turismo: ["chatbot para agencias de viaje", "whatsapp para hoteles", "chatbot para hoteles"],
      voice: ["agente de voz ia", "ia que contesta llamadas", "llamadas con ia", "asistente de voz ia para negocios"],
    },
  },
};

const market = markets[process.argv[2]];
if (!market) throw new Error("usage: node docs/seo-blog-mena-asia-research.mjs sa|eg|id|pe");
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
fs.writeFileSync(`blog-kw-mena-asia-${process.argv[2]}.json`, JSON.stringify(rows, null, 1));
const byCluster = {};
for (const r of rows) for (const c of r.cluster.split("+")) (byCluster[c] ??= []).push(r);
const ranked = Object.entries(byCluster).map(([c, list]) => [c, list, list.reduce((s, r) => s + r.score, 0)]).sort((a, b) => b[2] - a[2]);
for (const [c, list, total] of ranked) {
  console.log(`\n## ${c}  (cluster total ${total}, ${list.length} phrases)`);
  for (const r of list.slice(0, 8)) console.log(`${String(r.score).padStart(4)}  ${r.sources}/3  ${r.phrase}`);
}
