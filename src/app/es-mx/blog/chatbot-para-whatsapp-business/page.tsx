import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Steps } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Búsquedas objetivo: "chatbot para whatsapp business" (34, 3/3), "chatbot
// whatsapp business gratis" (31, 3/3), "bot de whatsapp" (30, 3/3), "chatbot
// con ia para whatsapp" (30, 3/3), "bot para whatsapp business" (29), "cómo
// crear un bot de whatsapp" (26), autocompletado MX 2026-10-28. Resultados sin
// sitios grandes (sendpulse, respond.io, kommo, clientify). Versión en inglés:
// /blog/what-is-a-whatsapp-chatbot.
const href = "/es-mx/blog/chatbot-para-whatsapp-business";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es-MX", article: { publishedTime: post.published, modifiedTime: post.updated } });

const kinds = [
  ["Cómo responde", "El mismo texto fijo para todos", "Menú de botones y rutas fijas", "Entiende la pregunta y responde con tu información"],
  ["Preguntas fuera del guion", "No las atiende", "Regresa al menú o pasa a un asesor", "Responde, o pasa a una persona"],
  ["Dónde se configura", "App de WhatsApp Business", "Plataforma con la API", "Plataforma de IA"],
  ["Costo típico", "Gratis", "Plan mensual + tarifas de Meta", "De gratis a plan + tarifas de Meta"],
];

const ways = [
  ["Qué necesitas", "Cuenta de Meta, número en la API y un proveedor", "Servidor, n8n o código, llave de IA y número en la API", "Una cuenta y un código QR"],
  ["Tiempo para activarlo", "De unas horas a unos días, más la aprobación de plantillas", "Días de trabajo técnico", "Unos 15 minutos"],
  ["Costo", "Plan del proveedor + tarifas de Meta", "Hosting + IA + tarifas de Meta", "Gratis por ahora"],
  ["Tipo de bot", "Menús y flujos; la IA muchas veces se paga aparte", "Lo que tú construyas", "IA con tu información"],
  ["Envíos masivos", "Sí", "Sí", "No"],
  ["Oficial de Meta", "Sí", "Sí (con la API)", "No, se conecta como WhatsApp Web"],
];

const steps = [
  { title: "Crea una cuenta gratis", body: "Regístrate en Wapzen. No necesitas tarjeta de crédito, cuenta de Meta ni la API oficial." },
  { title: "Crea un agente de chat", body: "Ponle nombre y escribe sus instrucciones: quién es, qué tono usa, qué puede decir y cuándo pasar la conversación a una persona. Elige un modelo GPT de OpenAI o Claude de Anthropic." },
  { title: "Agrega una base de conocimiento", body: "Pega tus preguntas frecuentes, precios, horarios y políticas, o sube archivos PDF y Word. La IA responde a partir de ahí." },
  { title: "Conecta tu WhatsApp", body: "Escanea el código QR con tu celular, igual que con WhatsApp Web. Funciona con WhatsApp Business o con WhatsApp normal." },
  { title: "Pruébalo y ajústalo", body: "Escríbele a tu número desde otro celular y hazle las preguntas de tus clientes. Si una respuesta no te convence, ajusta las instrucciones o la base de conocimiento." },
];

const faqs = [
  { q: "¿Qué es un chatbot para WhatsApp Business?", a: "Es un programa que contesta solo los mensajes que tus clientes mandan al WhatsApp de tu negocio. Puede ser un menú de botones con rutas fijas o una IA que entiende la pregunta y responde con la información de tu negocio, como precios, horarios y disponibilidad." },
  { q: "¿Cómo creo un bot de WhatsApp?", a: "Hay tres caminos: una plataforma que usa la API oficial de WhatsApp (como Kommo, ManyChat, Botmaker o WATI), un bot hecho por ti con n8n o código de GitHub, o una IA conectada a tu número con un código QR, como Wapzen. El último es el más rápido: unos 15 minutos y sin programar." },
  { q: "¿Hay un chatbot para WhatsApp Business gratis?", a: "Sí. Wapzen es gratis por ahora, con chatbot con IA, base de conocimiento y agente de voz incluidos, sin tarjeta de crédito. La app de WhatsApp Business también tiene mensajes automáticos gratis, pero son textos fijos que no contestan preguntas." },
  { q: "¿Necesito la API oficial para tener un chatbot en WhatsApp?", a: "No. La API sirve para envíos masivos, equipos grandes e integraciones. Para que una IA conteste a los clientes que te escriben, puedes conectar tu número como dispositivo con un código QR. Wapzen no es un producto oficial de Meta: si necesitas la plataforma oficial, elige un proveedor de la API." },
  { q: "¿El chatbot contesta notas de voz y grupos?", a: "Depende de la plataforma. El agente de chat de Wapzen contesta mensajes de texto en chats individuales: grupos, notas de voz y fotos se quedan contigo. Para hablar con tus clientes por voz está el agente de voz, que contesta llamadas de WhatsApp." },
  { q: "¿Tengo que avisar que es una IA?", a: "Es buena práctica y genera confianza: basta una línea en el primer mensaje que diga que contesta un asistente virtual y que el cliente puede pedir una persona. Si guardas datos de tus clientes, menciónalo también en tu aviso de privacidad." },
];

const sources = [
  { label: "Meta: WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/" },
  { label: "Meta: precios de WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Centro de ayuda de WhatsApp: vincular un dispositivo", href: "https://faq.whatsapp.com/1317564962315842" },
];

const sections = [
  {
    id: "que-es",
    title: "Qué es un chatbot para WhatsApp Business",
    body: <>
      <p>Un <strong>chatbot para WhatsApp Business</strong> es un programa que contesta solo los mensajes que llegan al WhatsApp de tu negocio. El cliente escribe como le escribiría a una persona y el bot responde en segundos, también de noche, en fin de semana y en días festivos.</p>
      <p>Con el mismo nombre se venden tres cosas muy distintas:</p>
      <Comparison caption="Mensajes automáticos, bots de menú y chatbots con IA comparados" columns={["Mensaje automático", "Bot de menú", "Chatbot con IA"]} rows={kinds} />
      <p>Los <Link href="/es-mx/blog/mensajes-automaticos-whatsapp-business">mensajes automáticos</Link> de la app no son un chatbot de verdad: mandan siempre el mismo texto. Los bots de menú (“escribe 1 para horarios, 2 para precios”) funcionan mientras el cliente siga la ruta. Un <strong>chatbot con IA</strong> entiende la pregunta, aunque venga mal escrita o con faltas de ortografía, y contesta con tu información.</p>
    </>,
  },
  {
    id: "como-funciona",
    title: "Cómo funciona un bot de WhatsApp",
    body: <>
      <p>Detrás de cada respuesta pasan cuatro cosas:</p>
      <ol>
        <li><strong>El cliente escribe</strong> a tu número de WhatsApp, como siempre.</li>
        <li><strong>El mensaje llega a la plataforma del bot</strong>, por la API oficial de WhatsApp o por el número vinculado como dispositivo, igual que funciona WhatsApp Web.</li>
        <li><strong>El bot decide la respuesta.</strong> Un bot de menú sigue las reglas que configuraste. Un chatbot con IA lee la pregunta, busca en tu base de conocimiento y redacta la respuesta con un modelo como GPT o Claude.</li>
        <li><strong>La respuesta sale desde tu número</strong> y el cliente la recibe en el mismo chat. Tú ves toda la conversación y puedes entrar cuando quieras.</li>
      </ol>
      <p>El segundo paso es el que más cambia el costo: con la API pagas por mensaje y casi siempre a un proveedor; con el número vinculado por código QR, no. Lo explicamos con números en <Link href="/es-mx/blog/whatsapp-business-precio">¿WhatsApp Business tiene costo?</Link></p>
    </>,
  },
  {
    id: "tres-formas",
    title: "Cómo crear un bot de WhatsApp: las tres formas",
    body: <>
      <h3>1. Una plataforma con la API oficial</h3>
      <p>Es el camino clásico para empresas medianas y grandes. Proveedores como Kommo, ManyChat, Botmaker, Treble o WATI conectan tu número a la API y te dan un editor de flujos, una bandeja para tu equipo y envíos masivos. A cambio necesitas una cuenta de Meta, verificar el número, plantillas aprobadas para escribir primero, un plan mensual y las tarifas de Meta por mensaje. La IA, cuando existe, muchas veces se cobra aparte.</p>
      <h3>2. Un bot hecho por ti con n8n o GitHub</h3>
      <p>Si sabes programar, puedes armarlo tú: con <strong>n8n</strong> conectas la Cloud API de Meta a un modelo de IA con un flujo visual, y en <strong>GitHub</strong> hay librerías de código abierto que se conectan a WhatsApp Web. Es flexible, pero pide tiempo, un servidor siempre encendido y mantenimiento. Además, las librerías no oficiales pueden dejar de funcionar con cada actualización de WhatsApp.</p>
      <h3>3. Una IA conectada a tu número con un código QR</h3>
      <p>Es el camino más rápido para un negocio pequeño: sin API, sin programar y sin cambiar de número. Vinculas el WhatsApp que ya usas, como harías con WhatsApp Web, y un agente con IA contesta los mensajes que llegan. Así funciona Wapzen.</p>
      <Comparison caption="Tres formas de crear un chatbot de WhatsApp comparadas" columns={["Plataforma con API", "Hecho por ti (n8n)", "IA con código QR"]} rows={ways} />
    </>,
  },
  {
    id: "crearlo-gratis",
    title: "Cómo crear un chatbot para WhatsApp Business gratis en 5 pasos",
    body: <>
      <p>Con Wapzen tu chatbot queda listo en unos 15 minutos:</p>
      <Steps items={steps} />
      <InlineCta title="Crea tu chatbot de WhatsApp" body="Un agente con IA que contesta a tus clientes con la información de tu negocio, en tu número de siempre. Gratis por ahora, sin tarjeta de crédito." label="Empieza gratis" />
      <p>Todas las conversaciones se guardan en el panel. Si pausas el agente, deja de contestar y vuelves a atender tú. Conoce todas las funciones en la página del <Link href="/es/chatbot-whatsapp-gratis">chatbot de WhatsApp gratis</Link>.</p>
      <p>Cuando tu chatbot ya esté activo, dalo a conocer: con nuestro <Link href="/tools/whatsapp-qr-code-generator">generador de códigos QR para WhatsApp</Link>, gratis y en inglés, creas un código para imprimir que abre el chat con tu número.</p>
    </>,
  },
  {
    id: "ejemplos",
    title: "Ejemplos de chatbot de WhatsApp por giro",
    body: <>
      <ul>
        <li><strong>Restaurantes y taquerías.</strong> Contesta sobre el menú, horarios, entregas a domicilio y para llevar, y toma los datos del pedido o de la reservación.</li>
        <li><strong>Consultorios médicos y dentales.</strong> Da horarios, dirección, costo de la consulta y qué llevar. No debe dar diagnósticos: indícale que pase a una persona todo lo clínico.</li>
        <li><strong>Estéticas y barberías.</strong> Explica servicios y precios y toma solicitudes de cita. Con una herramienta de API conectada a tu agenda puede ver horarios libres y agendar.</li>
        <li><strong>Tiendas en línea.</strong> Contesta sobre tallas, envíos, devoluciones y formas de pago, como transferencia, tarjeta o pago en OXXO. Con una herramienta de API puede consultar el estatus de un pedido.</li>
        <li><strong>Inmobiliarias.</strong> Responde sobre las propiedades, pregunta presupuesto y zona y propone una visita.</li>
        <li><strong>Escuelas y cursos.</strong> Informa colegiaturas, horarios, fechas de inscripción y requisitos, en español o en inglés según quién escriba.</li>
      </ul>
      <p>Si tu negocio agenda citas, en <Link href="/es-mx/blog/agendar-citas-por-whatsapp">cómo agendar citas por WhatsApp</Link> explicamos cómo conectar el bot a tu agenda.</p>
    </>,
  },
  {
    id: "buenas-practicas",
    title: "Límites y buenas prácticas",
    body: <>
      <ul>
        <li><strong>Di que es un asistente virtual.</strong> Una línea en el primer mensaje basta, y evita malos entendidos.</li>
        <li><strong>Deja una salida a una persona.</strong> Escribe en las instrucciones cuándo debe detenerse y avisar que alguien del equipo contestará: quejas, pagos, casos especiales.</li>
        <li><strong>Mantén al día tu información.</strong> La IA responde con lo que le das: precios viejos se vuelven respuestas equivocadas.</li>
        <li><strong>Cuida los datos personales.</strong> Si guardas datos de tus clientes, tu aviso de privacidad debe decirlo. No pidas por chat datos que no necesitas.</li>
        <li><strong>No lo uses para spam.</strong> Un chatbot contesta a quien te escribe. Para promociones a muchos contactos necesitas su consentimiento y la API oficial.</li>
      </ul>
      <Note>El agente de chat de Wapzen contesta mensajes de texto en chats individuales, no en grupos. Notas de voz, fotos y documentos se quedan contigo.</Note>
    </>,
  },
];

export default function ChatbotWhatsAppBusinessMxPage() {
  return <BlogPost
    href={href}
    heading={<>Chatbot para WhatsApp Business.<br /><span>Cómo crearlo gratis con IA.</span></>}
    lead="Un chatbot en WhatsApp contesta a tus clientes por ti, de día y de noche. Te explicamos qué es, cómo funciona, las tres formas de crear un bot de WhatsApp, cuánto cuesta y ejemplos para restaurantes, consultorios y tiendas en línea."
    summary={{
      title: "En resumen",
      items: [
        <><strong>Un chatbot para WhatsApp Business</strong> contesta solo los mensajes que llegan al número de tu negocio.</>,
        <><strong>Hay tres tipos:</strong> mensajes automáticos fijos, bots de menú y chatbots con IA que entienden la pregunta.</>,
        <><strong>Puedes crearlo</strong> con una plataforma de la API (Kommo, ManyChat, Botmaker), con n8n o código, o conectando una IA a tu número con un código QR.</>,
        <><strong>Con la API</strong> pagas plan y tarifas de Meta; con una IA conectada por QR, como Wapzen, hoy puedes hacerlo gratis.</>,
        <><strong>Avisa que es un asistente virtual</strong> y deja siempre una salida a una persona.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/es-mx/blog/whatsapp-business-precio", "/es-mx/blog/como-vender-por-whatsapp"]}
    product="/es/chatbot-whatsapp-gratis"
    cta={{ heading: <>Tu chatbot para WhatsApp Business.<br /><span>Listo en 15 minutos.</span></>, body: "Crea el agente, enséñale cómo funciona tu negocio y conecta tu número con un código QR. Gratis por ahora." }}
  />;
}
