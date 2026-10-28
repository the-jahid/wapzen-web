import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Steps } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Búsquedas objetivo: "cómo vender por whatsapp business" (44, 3/3), "cómo
// vender por whatsapp" (41, 3/3), "vender por whatsapp business" (33),
// "catálogo whatsapp business" (30), "pedidos por whatsapp" (30), "tienda en
// whatsapp" (30), "cobrar por whatsapp" (20), autocompletado MX 2026-10-28.
// Sin equivalente en inglés, así que no hay hreflang.
const href = "/es-mx/blog/como-vender-por-whatsapp";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es-MX", article: { publishedTime: post.published, modifiedTime: post.updated } });

const setup = [
  { title: "Usa WhatsApp Business con un número de trabajo", body: "Descarga la app gratis y regístrala con el número del negocio. Si hoy vendes desde tu WhatsApp personal, puedes pasar ese número a WhatsApp Business sin perder tus chats." },
  { title: "Completa tu perfil", body: "Nombre del negocio, categoría, descripción corta, dirección, horario, correo y sitio web. Es lo primero que ve un cliente nuevo y le dice que eres un negocio serio." },
  { title: "Arma tu catálogo", body: "Sube cada producto o servicio con foto, nombre, precio y una descripción breve. Agrúpalos en colecciones (por ejemplo, Novedades, Ofertas, Regalos) para que sea fácil encontrarlos." },
  { title: "Comparte tu enlace en todos lados", body: "Pon el enlace wa.me de tu número y el de tu catálogo en Instagram, Facebook, tu sitio, tus tickets y tus empaques. Un código QR en el mostrador también funciona." },
];

const labels = [
  ["Cliente nuevo", "Primera vez que escribe", "Contesta rápido y pregunta qué busca"],
  ["Pedido nuevo", "Ya eligió productos", "Confirma productos, envío y total"],
  ["Pago pendiente", "Le mandaste los datos de pago", "Recuérdale una vez, sin presionar"],
  ["Pagado", "Ya te mandó el comprobante", "Confirma y prepara el envío"],
  ["Enviado", "El pedido va en camino", "Manda la guía de rastreo"],
];

const payments = [
  ["Transferencia SPEI", "Sin comisión para ti en la mayoría de los bancos", "Pide el comprobante y revisa que el dinero llegó antes de enviar"],
  ["Enlace de pago", "El cliente paga con tarjeta, a meses o en efectivo, según el proveedor", "El proveedor cobra una comisión por venta"],
  ["Pago en tienda de conveniencia", "Para quien no usa tarjeta", "Necesitas un proveedor que genere la referencia"],
  ["Contra entrega", "Da confianza a clientes nuevos", "Más riesgo de pedidos que no se reciben"],
];

const faqs = [
  { q: "¿Cómo vender por WhatsApp Business paso a paso?", a: "Usa WhatsApp Business con un número de trabajo, completa tu perfil, arma tu catálogo con fotos y precios, comparte tu enlace wa.me en redes y tickets, contesta rápido con mensajes de bienvenida y respuestas rápidas, ordena los pedidos con etiquetas, cobra por transferencia o enlace de pago y da seguimiento sin mandar spam." },
  { q: "¿Se puede cobrar por WhatsApp?", a: "Sí, pero el cobro normalmente se hace fuera del chat: compartes tu CLABE para una transferencia SPEI, un enlace de pago de tu proveedor (tarjeta, meses o efectivo) o una referencia para pagar en tienda. Antes de enviar, confirma que el pago llegó." },
  { q: "¿Cómo hago un catálogo en WhatsApp Business?", a: "En WhatsApp Business abre Herramientas para la empresa y entra a Catálogo. Agrega cada producto con foto, nombre, precio y descripción, y ordénalos en colecciones. Luego comparte el enlace del catálogo en tus redes o mándalo en un chat." },
  { q: "¿Cómo mando promociones por WhatsApp sin que me bloqueen?", a: "Manda promociones solo a quien te dio permiso, no muy seguido y con algo útil. Las listas de difusión de la app llegan solo a quien guardó tu número. Si muchas personas te bloquean o reportan, WhatsApp puede restringir tu cuenta. Para promociones a miles de contactos se usa la API oficial con plantillas aprobadas." },
  { q: "¿Puedo automatizar las ventas por WhatsApp?", a: "Puedes automatizar las respuestas: un agente con IA contesta precios, existencias, envíos y formas de pago a cualquier hora y toma los datos del pedido. Wapzen lo hace en tu número de siempre con un código QR, gratis por ahora. El cobro y el envío los sigues revisando tú." },
];

const sources = [
  { label: "WhatsApp: app WhatsApp Business", href: "https://business.whatsapp.com/products/business-app" },
  { label: "Centro de ayuda de WhatsApp: listas de difusión", href: "https://faq.whatsapp.com/861663048350950" },
  { label: "Centro de ayuda de WhatsApp: vincular un dispositivo", href: "https://faq.whatsapp.com/1317564962315842" },
];

const sections = [
  {
    id: "preparar",
    title: "Antes de vender: prepara tu WhatsApp Business",
    body: <>
      <p>Vender por WhatsApp funciona porque tus clientes ya están ahí. Pero un WhatsApp personal con fotos sueltas y precios en notas de voz se queda corto. Estos cuatro pasos convierten tu número en una tienda:</p>
      <Steps items={setup} />
      <p>Para crear tu enlace con un mensaje ya escrito (por ejemplo, “Hola, quiero hacer un pedido”), usa nuestro <Link href="/tools/whatsapp-link-generator">generador de enlaces de WhatsApp</Link>. Si todavía dudas entre la app normal y la de negocios, mira primero <Link href="/es-mx/blog/whatsapp-business-precio">qué cuesta WhatsApp Business</Link>: la app es gratis.</p>
    </>,
  },
  {
    id: "catalogo",
    title: "Tu catálogo y el carrito: la tienda dentro del chat",
    body: <>
      <p>El <strong>catálogo</strong> de WhatsApp Business es tu vitrina: el cliente toca el ícono de la tienda en tu chat, ve tus productos con foto y precio y puede agregarlos al <strong>carrito</strong>. Cuando termina, te manda el carrito como mensaje y tú ya sabes qué quiere, sin preguntar diez veces.</p>
      <ul>
        <li><strong>Fotos claras</strong> con fondo limpio. Una buena foto vende más que una descripción larga.</li>
        <li><strong>Precio siempre visible.</strong> “Pregunta por precio” hace que muchos se vayan sin escribir.</li>
        <li><strong>Descripciones cortas</strong> con lo que más preguntan: medidas, tallas, sabores, tiempo de entrega.</li>
        <li><strong>Colecciones</strong> por temporada o por tipo de producto, y quita lo que ya no tienes.</li>
      </ul>
    </>,
  },
  {
    id: "atender",
    title: "Contesta rápido: bienvenida, respuestas rápidas y etiquetas",
    body: <>
      <p>En WhatsApp gana quien contesta primero. La app trae tres herramientas gratis para eso:</p>
      <ul>
        <li><strong>Mensaje de bienvenida</strong> para el primer mensaje de cada cliente, con tu horario y un enlace al catálogo.</li>
        <li><strong>Mensaje de ausencia</strong> fuera de horario, para que nadie se quede sin respuesta.</li>
        <li><strong>Respuestas rápidas</strong> para lo que contestas diario: formas de pago, envíos, ubicación.</li>
      </ul>
      <p>Tenemos <Link href="/es-mx/blog/mensajes-automaticos-whatsapp-business">40 ejemplos listos para copiar</Link>. Y para no perder ningún pedido, ordena tus chats con <strong>etiquetas</strong>:</p>
      <Comparison caption="Etiquetas de WhatsApp Business para dar seguimiento a cada venta" columns={["Cuándo usarla", "Qué hacer"]} rows={labels} />
    </>,
  },
  {
    id: "cobrar",
    title: "Cómo cobrar por WhatsApp en México",
    body: <>
      <p>Lo más común en México es cerrar la venta en el chat y <strong>cobrar fuera de él</strong>. Las opciones más usadas:</p>
      <Comparison caption="Formas de cobrar una venta hecha por WhatsApp en México" columns={["Ventaja", "Ojo con"]} rows={payments} />
      <Note>Nunca envíes un pedido solo porque te mandaron una captura de pantalla: revisa en tu banca o en tu proveedor que el pago realmente llegó. Las capturas falsas son el fraude más común en ventas por WhatsApp.</Note>
    </>,
  },
  {
    id: "seguimiento",
    title: "Seguimiento y promociones sin ser spam",
    body: <>
      <ul>
        <li><strong>Usa los estados</strong> para novedades y ofertas: los ve quien tiene tu número guardado, sin mandar un solo mensaje.</li>
        <li><strong>Listas de difusión</strong> de hasta 256 contactos, que solo llegan a quien guardó tu número. Úsalas poco y con algo útil.</li>
        <li><strong>Pide permiso</strong> antes de mandar promociones, y respeta a quien te pide no escribirle más.</li>
        <li><strong>Da seguimiento una vez</strong> a quien preguntó y no compró: “¿Te quedó alguna duda sobre el pedido?” funciona mejor que tres recordatorios.</li>
      </ul>
      <p>Si mucha gente te bloquea o reporta, WhatsApp puede restringir tu número. Para promociones a miles de clientes existe la API oficial, que cobra por mensaje; los números están en <Link href="/es-mx/blog/whatsapp-business-precio">la guía de precios</Link>.</p>
    </>,
  },
  {
    id: "automatizar",
    title: "Automatiza las respuestas con IA",
    body: <>
      <p>Llega un punto en que contestar “¿cuánto cuesta?”, “¿hacen envíos?” y “¿tienen en talla M?” te come el día. Un <strong>agente con IA</strong> puede contestar esas preguntas con tu información, a cualquier hora, y tomar los datos del pedido para que tú solo confirmes y cobres.</p>
      <InlineCta title="Un vendedor con IA en tu WhatsApp" body="Wapzen contesta a tus clientes con tus precios y políticas, 24/7, en tu número de siempre con un código QR. Gratis por ahora." label="Empieza gratis" />
      <p>Si tus clientes prefieren llamar, un agente de voz contesta también las llamadas de WhatsApp. Lee cómo funciona un <Link href="/es-mx/blog/chatbot-para-whatsapp-business">chatbot para WhatsApp Business</Link>.</p>
      <Note>Wapzen no es un producto oficial de Meta: se conecta como dispositivo, igual que WhatsApp Web, y no manda envíos masivos. El agente contesta mensajes de texto en chats individuales.</Note>
    </>,
  },
];

export default function ComoVenderPorWhatsAppPage() {
  return <BlogPost
    href={href}
    heading={<>Cómo vender por WhatsApp Business.<br /><span>Guía paso a paso.</span></>}
    lead="Tus clientes ya están en WhatsApp. Esta guía te lleva paso a paso: perfil, catálogo y carrito, respuestas rápidas, etiquetas para no perder pedidos, cómo cobrar en México y cómo dar seguimiento sin que te bloqueen."
    summary={{
      title: "En resumen",
      items: [
        <><strong>Usa WhatsApp Business</strong> con un número de trabajo: es gratis y trae catálogo, carrito y etiquetas.</>,
        <><strong>Arma tu catálogo</strong> con fotos claras y precios visibles, y comparte tu enlace wa.me en redes y tickets.</>,
        <><strong>Contesta rápido</strong> con mensajes de bienvenida, respuestas rápidas y etiquetas por etapa de venta.</>,
        <><strong>Cobra fuera del chat</strong> por transferencia SPEI o enlace de pago, y confirma el pago antes de enviar.</>,
        <><strong>Automatiza las respuestas</strong> con un agente con IA cuando las preguntas repetidas te coman el día.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/es-mx/blog/mensajes-automaticos-whatsapp-business", "/es-mx/blog/chatbot-para-whatsapp-business"]}
    product="/es/chatbot-whatsapp-gratis"
    cta={{ heading: <>Vende más por WhatsApp.<br /><span>Con IA, gratis.</span></>, body: "Crea tu agente, dale tus precios y políticas y conecta tu número con un código QR. Contesta a tus clientes mientras tú cierras ventas." }}
  />;
}
