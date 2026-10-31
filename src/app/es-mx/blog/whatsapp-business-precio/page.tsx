import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Búsquedas objetivo: "whatsapp business es gratis" (30, 3/3), "whatsapp
// business tiene costo" (30, 3/3), "whatsapp business api costos" (30, 3/3),
// "cuánto cuesta whatsapp business" (26), "whatsapp business es gratis o de
// pago" (18), autocompletado MX 2026-10-28; además, la prensa mexicana ("WhatsApp
// va a cobrar", Proceso y Expansión, sep.–oct. 2026). Tarifas: tarjeta de Meta
// para México del 1 de octubre de 2026, en USD y MXN (dos reimpresiones
// coinciden). Meta cambia precios cada trimestre (1 ene/abr/jul/oct): revisa
// tabla y ejemplos y actualiza `updated`. Versión en inglés:
// /blog/whatsapp-business-api-pricing.
const href = "/es-mx/blog/whatsapp-business-precio";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es-MX", article: { publishedTime: post.published, modifiedTime: post.updated } });

const overview = [
  ["Qué es", "La app con la “B” para celular", "El acceso para software, con Meta o un proveedor"],
  ["Costo de Meta", "Gratis", "Por mensaje, según categoría y país"],
  ["Costo del proveedor", "Ninguno", "Casi siempre un plan mensual, a veces un cargo extra por mensaje"],
  ["Quién contesta", "Tú, a mano", "Un software, un chatbot o un equipo"],
  ["Ideal para", "Negocios pequeños", "Envíos masivos, equipos grandes, integraciones"],
];

const categories = [
  ["Qué es", "Ofertas, promociones, invitaciones a volver", "Confirmaciones, envíos, recordatorios", "Códigos de verificación", "Respuestas libres a un cliente"],
  ["Necesita plantilla aprobada", "Sí", "Sí", "Sí", "No"],
  ["Cuándo puedes mandarlo", "Siempre, a quien dio permiso", "Siempre, a quien dio permiso", "Siempre", "Solo 24 horas después del último mensaje del cliente"],
  ["Se cobra", "Cada mensaje entregado", "Cada mensaje entregado", "Cada mensaje entregado", "Después de 1,000 al mes por número"],
];

const rates = [
  ["Marketing", "MXN 0.7298", "US$0.0397"],
  ["Utilidad", "MXN 0.1565", "US$0.0085"],
  ["Autenticación", "MXN 0.1565", "US$0.0085"],
  ["Servicio", "Gratis los primeros 1,000 al mes por número, luego MXN 0.1565", "Luego US$0.0085"],
];

const faqs = [
  { q: "¿WhatsApp Business tiene costo?", a: "La app de WhatsApp Business es gratis: descargarla, usarla y escribirle a tus clientes no cuesta nada, igual que WhatsApp normal. Lo que se paga es la WhatsApp Business API, la plataforma para software, que Meta cobra por mensaje, más el plan del proveedor si usas uno." },
  { q: "¿WhatsApp va a cobrar por mensaje en México?", a: "Solo a las empresas que usan la API. Desde el 1 de octubre de 2026 Meta cobra también las respuestas a clientes que pasen de 1,000 al mes por número, además de las plantillas que ya cobraba. WhatsApp personal y la app de WhatsApp Business siguen siendo gratis." },
  { q: "¿Cuánto cuesta un mensaje de WhatsApp Business API en México?", a: "Desde el 1 de octubre de 2026, Meta cobra en México US$0.0397 (MXN 0.7298) por mensaje de marketing y US$0.0085 (MXN 0.1565) por mensaje de utilidad, autenticación o servicio, antes de IVA y del cargo del proveedor. Las respuestas a clientes son gratis hasta 1,000 al mes por número." },
  { q: "¿Se cobran los mensajes que me mandan mis clientes?", a: "No. Meta no cobra los mensajes que los clientes le mandan a tu negocio. Algunos proveedores sí cuentan los mensajes en ambos sentidos en sus planes, así que revisa su lista de precios." },
  { q: "¿Cuánto cuesta WhatsApp Business API al mes?", a: "Depende del volumen. Un consultorio con mil recordatorios al mes paga menos de MXN 500 en tarifas de Meta; una tienda en línea con promociones frecuentes puede pasar de MXN 4,000. A eso se suma el plan del proveedor." },
  { q: "¿Hay una alternativa gratis a la API para contestar con IA?", a: "Sí. Wapzen conecta tu número de WhatsApp con un código QR, como WhatsApp Web, y deja que una IA conteste los mensajes que llegan, sin tarifas de Meta por mensaje. Por ahora es gratis. No manda envíos masivos: para campañas a miles de contactos, la API oficial sigue siendo la herramienta correcta." },
];

const sources = [
  { label: "Meta: precios de WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Reimpresión de las tarifas para México: Eva", href: "https://www.goeva.ai/en/resources/whatsapp-business-api-pricing-mexico" },
  { label: "Proceso: WhatsApp cobrará por mensaje desde octubre (sep. 2026)", href: "https://www.proceso.com.mx/ciencia-tecnologia/2026/9/22/whatsapp-cobrara-por-mensaje-desde-octubre-quienes-deberan-pagar-380407.html" },
  { label: "Expansión: lo que pagan las empresas en México (oct. 2026)", href: "https://expansion.mx/tecnologia/2026/10/27/se-acabo-el-whatsapp-gratis-para-las-empresas-llegan-facturas-de-hasta-32-000-pesos-pero-tiene-sus-ventajas" },
];

const sections = [
  {
    id: "respuesta-corta",
    title: "¿WhatsApp Business es gratis? La respuesta corta",
    body: <>
      <p>Cuando se pregunta si WhatsApp Business tiene costo, en realidad se habla de dos productos. La <strong>app de WhatsApp Business</strong>, la de la “B” en el ícono, es <strong>gratis</strong>: la descargas, registras tu número y atiendes a tus clientes sin pagar nada. La <strong>WhatsApp Business API</strong>, que Meta ahora llama WhatsApp Business Platform, sí se paga: Meta cobra cada mensaje que manda la empresa, y casi siempre hay que sumar el plan de un proveedor.</p>
      <Comparison caption="App de WhatsApp Business y WhatsApp Business API comparadas por costo" columns={["App de WhatsApp Business", "WhatsApp Business API"]} rows={overview} />
    </>,
  },
  {
    id: "va-a-cobrar",
    title: "¿WhatsApp va a cobrar? Lo que es cierto",
    body: <>
      <p>En septiembre y octubre de 2026 circularon notas sobre que “se acabó el WhatsApp gratis para las empresas”. Esto es lo que cambió y lo que no:</p>
      <ul>
        <li><strong>WhatsApp personal sigue gratis</strong>, para mensajes y llamadas.</li>
        <li><strong>La app de WhatsApp Business sigue gratis.</strong> No se anunció ningún cobro para quien usa solo la app.</li>
        <li><strong>La API cobra más desde el 1 de octubre de 2026:</strong> las respuestas a clientes, que antes eran gratis, ahora se cobran después de 1,000 al mes por número, y el mensaje de marketing en México subió de US$0.0305 a US$0.0397.</li>
      </ul>
      <p>Si tu negocio solo usa la app, no te llega ninguna factura de Meta.</p>
    </>,
  },
  {
    id: "como-cobra-la-api",
    title: "Cómo cobra Meta la WhatsApp Business API",
    body: <>
      <p>Desde el 1 de julio de 2025, Meta cobra la API <strong>por mensaje entregado</strong>, ya no por conversación. El precio depende de la <strong>categoría</strong> del mensaje y de la <strong>lada del destinatario</strong>: un mensaje a un número mexicano (+52) usa la tarifa de México. Los mensajes que te mandan los clientes son gratis.</p>
      <Comparison caption="Las cuatro categorías de mensajes de la WhatsApp Business API" columns={["Marketing", "Utilidad", "Autenticación", "Servicio"]} rows={categories} />
      <p>Los mensajes de utilidad y autenticación tienen <strong>descuentos por volumen</strong> a partir de cierto número de mensajes al mes. Marketing y servicio no tienen escalones.</p>
    </>,
  },
  {
    id: "tarifas-mexico",
    title: "Las tarifas de Meta para México en 2026",
    body: <>
      <p>Estas son las tarifas de Meta para números mexicanos, vigentes desde el <strong>1 de octubre de 2026</strong>, por mensaje entregado, antes de descuentos por volumen, IVA y el cargo del proveedor. Meta publica la tarjeta de México en dólares y en pesos:</p>
      <Comparison caption="Tarifas de Meta por mensaje a números mexicanos desde el 1 de octubre de 2026" columns={["En pesos", "En dólares"]} rows={rates} />
      <p>En la práctica: <strong>mil promociones cuestan MXN 729.80</strong> (US$39.70) y mil recordatorios o confirmaciones, <strong>MXN 156.50</strong> (US$8.50).</p>
      <Note>Meta actualiza sus precios cada trimestre (1 de enero, abril, julio y octubre). Revisa la tarjeta oficial antes de hacer un presupuesto, y recuerda que tu proveedor puede cobrarte más que Meta.</Note>
    </>,
  },
  {
    id: "ejemplos",
    title: "Cuánto se paga de verdad: tres ejemplos en México",
    body: <>
      <p>Las tarifas por mensaje parecen mínimas; la factura del mes, no tanto. Tres negocios típicos con las tarifas del 1 de octubre de 2026, contando solo lo que cobra Meta:</p>
      <h3>Una tienda de ropa en línea en Guadalajara</h3>
      <ul>
        <li>2,000 chats con unas 4 respuestas cada uno: 8,000 mensajes de servicio, 7,000 por encima de los gratis × MXN 0.1565 = <strong>MXN 1,095.50</strong></li>
        <li>1,500 avisos de envío (utilidad) × MXN 0.1565 = <strong>MXN 234.75</strong></li>
        <li>Dos promociones a 2,000 clientes suscritos: 4,000 mensajes de marketing × MXN 0.7298 = <strong>MXN 2,919.20</strong></li>
      </ul>
      <p>Unos <strong>MXN 4,249 al mes</strong> (US$231) más IVA, antes del plan del proveedor.</p>
      <h3>Un consultorio dental en Monterrey</h3>
      <ul>
        <li>600 chats de pacientes × 5 respuestas: 3,000 mensajes, 2,000 de pago × MXN 0.1565 = <strong>MXN 313.00</strong></li>
        <li>1,000 recordatorios de cita (utilidad) × MXN 0.1565 = <strong>MXN 156.50</strong></li>
      </ul>
      <p>Unos <strong>MXN 470 al mes</strong> (US$25.50). Aquí el plan del proveedor suele pesar más que Meta.</p>
      <h3>Una taquería en la CDMX</h3>
      <ul>
        <li>900 chats de pedidos × 3 respuestas: 2,700 mensajes, 1,700 de pago × MXN 0.1565 = <strong>MXN 266.05</strong></li>
        <li>400 confirmaciones de pedido (utilidad) × MXN 0.1565 = <strong>MXN 62.60</strong></li>
      </ul>
      <p>Unos <strong>MXN 329 al mes</strong> (US$18). Con la app gratis de WhatsApp Business serían cero pesos, pero contestados a mano.</p>
    </>,
  },
  {
    id: "proveedores",
    title: "Lo que cobran los proveedores, además de Meta",
    body: <>
      <p>Pocas empresas usan la API directamente con Meta. La mayoría pasa por un proveedor (un BSP), como Kommo, ManyChat, Botmaker, Treble o WATI, que suele sumar:</p>
      <ul>
        <li><strong>un plan mensual</strong>, muchas veces por número de usuarios o de contactos;</li>
        <li><strong>un cargo extra por mensaje</strong> encima de la tarifa de Meta;</li>
        <li><strong>complementos de pago</strong> para el chatbot, la IA o las integraciones.</li>
      </ul>
      <p>Usar la Cloud API de Meta directo evita el cargo extra, pero entonces la bandeja, el chatbot y las integraciones los construyes y mantienes tú, por ejemplo con n8n. Lo comparamos en <Link href="/es-mx/blog/chatbot-para-whatsapp-business">chatbot para WhatsApp Business</Link>.</p>
    </>,
  },
  {
    id: "ahorrar",
    title: "Cómo pagar menos (o nada) por contestar a tus clientes",
    body: <>
      <ul>
        <li><strong>Contesta en un mensaje, no en tres.</strong> En la API cada respuesta por encima de los gratis se cobra.</li>
        <li><strong>Aprovecha los anuncios.</strong> Las conversaciones que empiezan desde un anuncio de clic a WhatsApp tienen una ventana gratis.</li>
        <li><strong>No pagues la API si no haces envíos masivos.</strong> Si casi todo tu trabajo es contestar a quien te escribe, la app gratis basta. El problema es el tiempo, no el costo.</li>
        <li><strong>Automatiza en la app, no en la API.</strong> Un agente con IA conectado a tu número con un código QR contesta sin tarifas de Meta por mensaje.</li>
      </ul>
      <InlineCta title="Respuestas con IA sin tarifas por mensaje" body="Wapzen conecta tu número con un código QR y contesta a tus clientes con la información de tu negocio, 24/7. Gratis por ahora." label="Empieza gratis" />
      <p>Wapzen no es un producto oficial de Meta: se conecta como dispositivo, igual que WhatsApp Web, y no manda campañas masivas. Para promociones a miles de contactos, la API sigue siendo lo correcto; para contestar a quien te escribe, muchas veces no hace falta. Si vendes por WhatsApp, sigue con <Link href="/es-mx/blog/como-vender-por-whatsapp">cómo vender por WhatsApp Business</Link>.</p>
    </>,
  },
];

export default function WhatsAppBusinessPrecioMxPage() {
  return <BlogPost
    href={href}
    heading={<>¿WhatsApp Business tiene costo?<br /><span>Precios 2026 en México.</span></>}
    lead="La app de WhatsApp Business es gratis; la WhatsApp Business API, no. Te explicamos qué se paga de verdad en 2026, con las tarifas de Meta para México en pesos y dólares, qué cambió el 1 de octubre y tres ejemplos de factura mensual."
    summary={{
      title: "En resumen",
      items: [
        <><strong>La app de WhatsApp Business es gratis</strong>, igual que WhatsApp normal: sin costo por mensajes ni llamadas.</>,
        <><strong>La API se cobra por mensaje:</strong> en México MXN 0.7298 por marketing y MXN 0.1565 por utilidad o autenticación.</>,
        <><strong>Las respuestas a clientes en la API</strong> son gratis hasta 1,000 al mes por número; después, MXN 0.1565 cada una (desde el 1 de octubre de 2026).</>,
        <><strong>Los proveedores suman</strong> un plan mensual y a veces un cargo extra por mensaje.</>,
        <><strong>Para contestar con IA</strong> sin tarifas por mensaje, puedes conectar un agente a tu número con un código QR.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/es-mx/blog/chatbot-para-whatsapp-business", "/es-mx/blog/como-vender-por-whatsapp"]}
    product="/es/chatbot-whatsapp-gratis"
    cta={{ heading: <>Contesta a tus clientes con IA.<br /><span>Sin tarifas por mensaje.</span></>, body: "Crea tu agente, enséñale cómo funciona tu negocio y conecta tu número de WhatsApp con un código QR." }}
  />;
}
