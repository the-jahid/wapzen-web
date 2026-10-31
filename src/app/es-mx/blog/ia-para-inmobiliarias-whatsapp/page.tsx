import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Búsquedas: "ia para inmobiliarias", "chatbot para inmobiliarias", "whatsapp business
// para inmobiliarias", "asistente virtual inmobiliaria", "crm inmobiliario whatsapp".
// Sin versión en inglés. No encontramos una fuente seria de la comisión "típica" en
// México: el 5% es un ejemplo y así se dice. Los datos de Vambe y Lastro vienen de las
// propias empresas. Take Order está hecha para pedidos de compra: usarla para citas no
// se probó en producción, por eso el artículo pide probarla. Lo que se dice de Wapzen
// sigue a whiskey-bailey-server. Diálogos ilustrativos.
const href = "/es-mx/blog/ia-para-inmobiliarias-whatsapp";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es-MX", article: { publishedTime: post.published, modifiedTime: post.updated } });

const handled = [
  ["“¿Sigue disponible?”", "Revisa tu lista y responde con precio y liga del anuncio", "Mantener la lista al día"],
  ["“¿Aceptan Infonavit?”", "Responde lo que tú le indicaste para esa propiedad", "Revisar el crédito con el cliente"],
  ["“¿Cuánto es el mantenimiento?”", "Responde si el dato está en tu lista", "Completar lo que falte"],
  ["“¿Puedo ir a verlo el sábado?”", "Anota día y horario de preferencia", "Confirmar la cita"],
  ["“¿Me hacen un descuento?”", "No negocia: pasa con el asesor", "Negociar"],
  ["“¿Te deposito para apartar?”", "No acepta pagos: pasa con el asesor", "Atender el apartado por un canal seguro"],
];

const profile = [
  ["Operación", "¿Compra para vivir o para invertir?", "¿Para cuándo necesita mudarse?"],
  ["Zona", "¿Qué colonias le interesan?", "¿Qué colonias le interesan?"],
  ["Propiedad", "Casa o depa, recámaras, estacionamiento", "Recámaras, estacionamiento y mascotas"],
  ["Presupuesto", "¿Hasta cuánto quiere invertir?", "¿Hasta cuánto al mes, con mantenimiento?"],
  ["Forma de pago o requisitos", "Contado, crédito bancario, Infonavit o Fovissste", "¿Tiene aval o prefiere póliza jurídica?"],
];

const limits = [
  ["Notas de voz", "No las escucha y no las contesta", "Pide “escríbenos” en tus anuncios y revisa las notas de voz en el celular"],
  ["Fotos", "No manda fotos ni ve las que le envían", "Incluye la liga del anuncio en cada propiedad de tu lista"],
  ["Memoria", "Recuerda solo los últimos minutos del chat", "Tu asesor lee la conversación completa en el panel"],
  ["Seguimiento", "Solo contesta. No escribe primero", "El seguimiento sigue a cargo del asesor o de tu CRM"],
  ["Asesor en el mismo chat", "El agente sigue contestando. No hay pausa por conversación", "Usa un número solo para prospectos y pasa al cliente al WhatsApp del asesor"],
  ["Agenda", "Sin integración no ve tu agenda", "Anota la preferencia. El asesor confirma"],
];

const tools = [
  ["Para quién", "Empresas con cientos de clientes ya en un CRM o ERP", "Inmobiliarias que quieren perfilar por operación, zona y presupuesto", "Asesores independientes e inmobiliarias chicas"],
  ["Qué hace", "IA conversacional para ventas", "Agente de IA que entrega el prospecto al CRM, según su guía", "Agente de IA por texto con tu información"],
  ["Inventario", "Confírmalo con el proveedor", "Precio y estado salen de tu inventario", "Lista que tú mantienes (texto, PDF o Word)"],
  ["Precio", "No encontramos precio público", "No encontramos precio público", "Gratis para empezar, con límite de uso. Plan de pago para más volumen"],
];

const faqs = [
  { q: "¿Qué IA conviene para una inmobiliaria en México?", a: "Depende del tamaño. Una empresa con CRM y volumen alto suele necesitar una plataforma integrada, como Vambe o Cliengo. Un asesor independiente o una inmobiliaria chica puede empezar con un agente más simple, como Wapzen, que es gratis para empezar y usa la lista de propiedades que tú le das." },
  { q: "¿La IA reemplaza al asesor inmobiliario?", a: "No. Contesta primero, resuelve dudas repetidas y ordena los datos del prospecto. Negociar, explicar contratos y cerrar sigue en manos del asesor, que responde por la información que da al cliente." },
  { q: "¿Funciona con prospectos de Inmuebles24 o Facebook?", a: "Funciona cuando el prospecto te escribe por WhatsApp, por ejemplo desde un botón del portal o un anuncio. El agente de Wapzen contesta, pero no escribe primero, así que no contacta a quien solo dejó un correo o un formulario." },
  { q: "¿La IA puede decirme si un cliente califica para Infonavit?", a: "No debe. Puede preguntar si piensa usar crédito Infonavit, Fovissste o bancario, y decir si esa propiedad lo acepta. La precalificación, los montos y los plazos los define cada institución." },
  { q: "¿El chatbot puede agendar visitas?", a: "Puede anotar el día y horario que prefiere el cliente. Reservar en una agenda real requiere conectar un sistema por API, y hay que probarlo varias veces, porque una herramienta de API no se ejecuta en todos los mensajes que deberían activarla." },
  { q: "¿Qué tiene que ver la NOM-247 con mi chatbot?", a: "La NOM-247-SE-2021 regula la información comercial y la publicidad de casas habitación, y aplica también a quienes asesoran y venden. Si un agente da precios o condiciones a tus clientes, esa información debe coincidir con la que ya revisaste. Consulta a tu asesor legal." },
  { q: "¿Necesito la API oficial de WhatsApp?", a: "No para usar Wapzen, que conecta tu número con código QR o código de vinculación. Esa conexión no es la API oficial, así que evalúa las condiciones de uso de WhatsApp y el riesgo de restricción antes de usar tu número principal." },
];

const sources = [
  { label: "El Cronista México: Vambe aterriza en México", href: "https://www.cronista.com/mexico/finanzas-economia/vambe-la-startup-chilena-de-ia-conversacional-que-aterriza-en-mexico-para-hiperpersonalizar-las-ventas-de-las-empresas" },
  { label: "Prosus: Serie A de US$15 millones en Lastro (Brasil)", href: "https://www.prosus.com/news-insights/2025/prosus-ventures-leads-us-dollar-15m-series-a-in-lastro-to-scale-ai-agent-transforming-real-estate-in-brazil" },
  { label: "Guía de Cliengo: WhatsApp para inmobiliarias", href: "https://guiawabusiness.cliengo.com/whatsapp-para-inmobiliarias" },
  { label: "Secretaría de Economía: NOM-247-SE-2021", href: "https://platiica.economia.gob.mx/normalizacion/nom-247-se-2021/" },
  { label: "Expansión: la NOM que protege al comprar casa", href: "https://expansion.mx/finanzas-personales/2022/03/23/comprar-casa-nom-protege-fraudes-enganos" },
  { label: "Garrigues: la nueva ley de datos personales en México", href: "https://www.garrigues.com/es_ES/noticia/mexico-nueva-ley-federal-proteccion-datos-personales-posesion-particulares-introduce" },
  { label: "UnoTV: AMPI advierte sobre fraudes inmobiliarios", href: "https://www.unotv.com/nacional/evita-fraudes-inmobiliarios-las-recomendaciones-clave-de-ampi/" },
  { label: "WhatsApp Business: política de mensajes", href: "https://whatsappbusiness.com/policy/" },
];

const sections = [
  {
    id: "que-es",
    title: "¿Qué hace la IA en el WhatsApp de una inmobiliaria?",
    body: <>
      <p>La IA para inmobiliarias más útil hoy es un agente que contesta a tus prospectos por WhatsApp: confirma si la propiedad sigue disponible, resuelve dudas, hace las primeras preguntas y deja al cliente listo para tu asesor. No cierra ventas. Evita que el prospecto se enfríe mientras tu asesor está en una visita o manejando.</p>
      <p>El patrón se repite cada semana. Publicas un depa en Inmuebles24, Lamudi o Facebook Marketplace, y los mensajes llegan de noche o en domingo. Muchos repiten las mismas preguntas: precio, mantenimiento, si aceptan crédito. Y el prospecto suele escribirle a varias inmobiliarias a la vez.</p>
    </>,
  },
  {
    id: "quien-paga",
    title: "¿Quién está pagando por esto en América Latina?",
    body: <>
      <p>Las señales más claras vienen de empresas que levantaron capital para vender exactamente esto:</p>
      <ul>
        <li><strong>Lastro (Brasil):</strong> en octubre de 2025, Prosus Ventures lideró una Serie A de US$15 millones. Su agente Lais atiende a más de 1,000 inmobiliarias y ha hablado con más de 2 millones de compradores e inquilinos, sobre todo por WhatsApp, según Prosus.</li>
        <li><strong>Vambe (Chile, ya en México):</strong> levantó una Serie A de US$14 millones y dice trabajar con cerca de 2,000 empresas, según El Cronista. No es exclusiva de inmobiliarias, y pide tener cientos de clientes en un CRM o ERP.</li>
        <li><strong>Cliengo:</strong> su guía para inmobiliarias describe un agente que perfila por operación, zona y presupuesto, y entrega el prospecto al CRM. La guía aclara que no es documentación del producto, así que confírmalo con ellos.</li>
      </ul>
      <p>Son datos de las propias empresas, y demuestran demanda, no resultados en tu negocio. Por eso conviene hacer tu propia cuenta. Si cobras 5% en una venta de $4,000,000, son $200,000 antes de repartir con tu equipo. Es un ejemplo: tu comisión depende de lo que acuerdes. En renta, si cobras un mes de $18,000, son $18,000. Con cualquiera de los dos números, una sola operación recuperada paga muchos meses de una herramienta de este tipo.</p>
      <InlineCta title="Prueba con tus propiedades" body="Crea un agente, súbele tu lista y escríbele como si fueras un prospecto. Es gratis para empezar." label="Empieza gratis" />
    </>,
  },
  {
    id: "ejemplo",
    title: "Cómo contesta un agente de IA a un prospecto",
    body: <>
      <Note>Diálogo ilustrativo. Propiedad, colonia y precios son inventados. El agente solo contesta con lo que hay en tu lista.</Note>
      <p><strong>Prospecto:</strong> “Hola, me interesa el depa de la Narvarte, código 214. ¿Sigue disponible?”</p>
      <p><strong>Agente:</strong> “¡Hola! Soy la asistente virtual de [inmobiliaria]. Sí, el 214 sigue en venta en $3,950,000, con mantenimiento de $2,300 al mes. Aquí están las fotos: [liga del anuncio]. ¿Lo buscas para vivir o para invertir?”</p>
      <p><strong>Prospecto:</strong> “Para vivir. ¿Aceptan Infonavit?”</p>
      <p><strong>Agente:</strong> “Sí, esta propiedad acepta crédito Infonavit. El monto depende de tu precalificación, y eso lo revisas con la asesora. ¿Para cuándo te gustaría mudarte?”</p>
      <p><strong>Prospecto:</strong> “Antes de marzo. ¿Puedo ir el sábado?”</p>
      <p><strong>Agente:</strong> “Anoto el sábado como preferencia. ¿En la mañana o en la tarde? Y dime tu nombre, por favor.”</p>
      <p><strong>Prospecto:</strong> “En la mañana. Soy Daniela.”</p>
      <p><strong>Agente:</strong> “Gracias, Daniela. Para confirmar tu cita, escríbele a Laura aquí: [WhatsApp de la asesora]. Solo menciónale el código 214.”</p>
      <p>El código funciona porque el anuncio abre WhatsApp con un mensaje ya escrito. Crea esas ligas con nuestro <Link href="/tools/whatsapp-link-generator">generador de enlaces de WhatsApp</Link>. Y el cierre manda al cliente al WhatsApp de la asesora para que el agente no conteste junto con ella.</p>
      <Comparison caption="Qué contesta el agente y qué queda con tu equipo" columns={["Qué hace el agente", "Qué queda con tu equipo"]} rows={handled} />
    </>,
  },
  {
    id: "perfilar",
    title: "Preguntas para perfilar compra y renta",
    body: <>
      <p>Con tres o cuatro preguntas basta. Si el chat parece un formulario, el prospecto se va. Quédate con las que cambian lo que hará tu asesor:</p>
      <Comparison caption="Preguntas para perfilar prospectos de compra y de renta" columns={["Compra", "Renta"]} rows={profile} />
      <p>No le pidas al agente que solicite identificaciones, comprobantes de ingresos ni CURP. Tu asesor los recaba después, por el canal adecuado y con tu aviso de privacidad a la mano.</p>
    </>,
  },
  {
    id: "configurar",
    title: "Cómo configurarlo en Wapzen",
    body: <>
      <p><Link href="/es/chatbot-whatsapp-gratis">Wapzen</Link> te deja crear el agente sin programar. El panel está en inglés, y el agente contesta en español si se lo pides en las instrucciones.</p>
      <h3>1. Escribe las instrucciones</h3>
      <blockquote>“Eres la asistente virtual de [inmobiliaria], en [ciudad]. Contesta en español de México, con mensajes cortos. Usa solo la información de tu base de conocimiento y nunca inventes disponibilidad, precios ni condiciones. Si una propiedad no aparece, di que un asesor lo confirma. Haz una pregunta a la vez y máximo cuatro. No prometas crédito, descuentos ni plusvalía. Nunca pidas ni aceptes depósitos, apartados, datos bancarios o identificaciones por este chat. Cuando el cliente quiera visitar o negociar, comparte [WhatsApp del asesor]. Di que eres una asistente virtual.”</blockquote>
      <h3>2. Sube tu lista de propiedades</h3>
      <p>Para cada propiedad escribe una línea con código, tipo, colonia, recámaras, estacionamiento, metros, precio, mantenimiento, créditos que acepta, estado y liga del anuncio. El agente lee texto, PDF y Word. <strong>Si se vendió o se rentó, bórrala ese mismo día</strong>, o el agente la seguirá ofreciendo.</p>
      <h3>3. Conecta un número solo para prospectos</h3>
      <p>Usa ese número en anuncios y portales, y conéctalo con código QR o código de vinculación. No existe una pausa por conversación, así que separar el número del agente y el del asesor evita que el cliente reciba dos respuestas.</p>
      <h3>4. Decide dónde guardar los prospectos</h3>
      <p>Todas las conversaciones quedan en el panel. Si quieres cada solicitud de cita como un registro, activa la herramienta Take Order con campos propios (nombre, propiedad, día preferido) y aclara en las instrucciones que “pedido” significa solicitud de cita. Está pensada para pedidos de compra, así que pruébala bien. Para mandar datos a tu CRM, usa una herramienta de API.</p>
      <h3>5. Pruébalo con preguntas difíciles</h3>
      <p>Pregunta por una propiedad que no existe, pide descuento y ofrece apartar con un depósito. El agente debe pasar con un asesor, no improvisar.</p>
    </>,
  },
  {
    id: "reglas",
    title: "Qué debes cuidar en México: NOM-247, datos y fraudes",
    body: <>
      <p><strong>NOM-247-SE-2021.</strong> Regula la información comercial y la publicidad de inmuebles destinados a casa habitación, y los contratos. Es exigible desde septiembre de 2022, Profeco la verifica, y alcanza a promotores, constructores y a quienes intervienen en la asesoría y venta al público. En la práctica, lo que diga tu agente debe coincidir con la información que ya revisaste. No lo dejes improvisar precios ni condiciones.</p>
      <p><strong>Datos personales.</strong> La nueva Ley Federal de Protección de Datos Personales en Posesión de los Particulares se publicó el 20 de marzo de 2025, y la Secretaría Anticorrupción y Buen Gobierno sustituyó al INAI como autoridad. Si tu aviso de privacidad aún menciona al INAI, actualízalo, y compártelo en tu perfil o en el primer mensaje del agente.</p>
      <p><strong>Fraudes.</strong> AMPI ha advertido sobre fraudes en rentas y ventas anunciadas en plataformas digitales. Un chat automático que pide depósitos se parece demasiado a uno. Por eso las instrucciones de arriba prohíben hablar de pagos.</p>
      <p>Esto es orientación general, no asesoría legal. Revísalo con tu abogado antes de activar el agente.</p>
    </>,
  },
  {
    id: "limites",
    title: "Los límites actuales de Wapzen",
    body: <>
      <p>Mejor conocerlos antes que descubrirlos con un prospecto:</p>
      <Comparison caption="Límites del agente de Wapzen en una inmobiliaria y cómo resolverlos" columns={["Qué pasa", "Cómo resolverlo"]} rows={limits} />
      <p>Al terminar el límite de uso del inicio gratis, el agente deja de contestar, así que sigue revisando tu WhatsApp. Las herramientas de API tampoco se ejecutan en todos los mensajes que deberían activarlas: pruébalas varias veces y confirma en tu CRM que llegó el prospecto.</p>
    </>,
  },
  {
    id: "comparar",
    title: "Vambe, Cliengo o Wapzen: cuál te conviene",
    body: <>
      <p>Vambe y Cliengo son plataformas para equipos de venta. Wapzen es una herramienta general de agentes para WhatsApp que adaptas con instrucciones y tu lista. Confirma funciones y precios con cada proveedor, porque no encontramos tarifas públicas.</p>
      <Comparison caption="Vambe, Cliengo y Wapzen comparados para una inmobiliaria" columns={["Vambe", "Cliengo", "Wapzen"]} rows={tools} />
      <Choose locale="es-MX" highlight="Wapzen" items={[
        { name: "una plataforma con CRM", points: ["Tienes equipo de ventas y volumen alto", "Necesitas el inventario sincronizado", "Quieres implementación acompañada"] },
        { name: "Wapzen", points: ["Eres asesor independiente o tienes pocos asesores", "Tu inventario cabe en una lista que tú actualizas", "Quieres probar sin contrato ni programación"] },
      ]} />
      <p>Si eliges Wapzen, ten presente que conecta tu número como dispositivo vinculado, no por la API oficial de Meta. Por eso no hay costo de Meta por mensaje, pero tampoco una garantía contra restricciones de la cuenta. Si prefieres la API oficial, revisa las <Link href="/es-mx/blog/whatsapp-business-precio">tarifas para México</Link>. Wapzen es un producto independiente, no es de Meta ni de WhatsApp.</p>
    </>,
  },
];

export default function IaParaInmobiliariasWhatsAppPage() {
  return <BlogPost
    href={href}
    heading={<>IA para inmobiliarias en México.<br /><span>Contesta a tus prospectos de WhatsApp al momento.</span></>}
    lead="Un prospecto ve tu depa en Inmuebles24 un domingo en la noche y pregunta si sigue disponible. Tu asesor lo ve el lunes, pero ya le contestó otra inmobiliaria. Un agente de IA en WhatsApp responde al momento con tu información, hace las primeras preguntas y deja al cliente listo para tu asesor."
    summary={{
      title: "En resumen",
      items: [
        <><strong>Qué resuelve:</strong> primera respuesta inmediata, preguntas repetidas y perfilado de compra y renta.</>,
        <><strong>Quién paga ya:</strong> Lastro levantó US$15 millones y atiende a más de 1,000 inmobiliarias en Brasil. Vambe, de Chile, ya vende en México.</>,
        <><strong>Qué no hace:</strong> negociar, prometer crédito ni aceptar depósitos. Eso queda con tu asesor.</>,
        <><strong>Qué cuidar:</strong> la NOM-247, tu aviso de privacidad y los fraudes por chat.</>,
        <><strong>Cómo probar:</strong> Wapzen es gratis para empezar, con límite de uso, y funciona con la lista de propiedades que tú le das.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/es-mx/blog/chatbot-para-whatsapp-business", "/es-mx/blog/agendar-citas-por-whatsapp"]}
    product="/es/chatbot-whatsapp-gratis"
    cta={{ heading: <>Que ningún prospecto se quede sin respuesta.<br /><span>Prueba con tus propiedades.</span></>, body: "Crea un agente de IA, sube tu lista y conecta un número para prospectos. Es gratis para empezar." }}
  />;
}
