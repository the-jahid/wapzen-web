import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Búsquedas: "chatbot contraentrega", "bot whatsapp dropshipping", "confirmar pedidos
// whatsapp", "confirmación de pedidos contraentrega". Sin versión en inglés. La idea
// central: Wapzen no escribe primero, así que no confirma pedidos de formularios; sirve
// cuando el cliente abre el chat. Tasas de devolución: autodeclaradas por un afiliado de
// Dropi y por Dropi, y así se dice. Tarifas de Meta: tabla de un tercero que cita la
// lista del 1 de octubre de 2026. Art. 47 Ley 1480: no pudimos leer la norma vigente
// directamente, así que se cita prensa y sentencia y se pide revisarla. Lo que se dice de
// Wapzen sigue a whiskey-bailey-server. Diálogos y cifras de ejemplo son ilustrativos.
const href = "/es-co/blog/chatbot-whatsapp-contraentrega";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es-CO", article: { publishedTime: post.published, modifiedTime: post.updated } });

const example = [
  ["Pedidos despachados", "100", "100"],
  ["Devoluciones", "30", "20"],
  ["Flete perdido por devolución (ida y regreso)", "$25.000", "$25.000"],
  ["Costo de las devoluciones", "$750.000", "$500.000"],
];

const flows = [
  ["Cómo empieza", "El cliente llena un formulario en Shopify o en tu tienda", "El cliente te escribe desde un anuncio o un enlace"],
  ["Quién escribe primero", "Tu negocio", "El cliente"],
  ["Qué necesitas", "Una herramienta que envíe mensajes salientes o llamadas", "Un agente que conteste, venda y tome los datos"],
  ["¿Lo hace Wapzen?", "No: no escribe primero", "Sí"],
];

const address = [
  ["Nombre y apellido", "La transportadora entrega a una persona, no a un apodo"],
  ["Ciudad y departamento", "Hay nombres de municipios que se repiten"],
  ["Dirección con nomenclatura", "“Cra 15 # 93-47”, no “al lado de la panadería”"],
  ["Barrio", "Ayuda cuando la nomenclatura está incompleta"],
  ["Conjunto, torre y apartamento", "Evita una novedad por dirección incompleta"],
  ["Punto de referencia", "Sirve en veredas y zonas sin nomenclatura clara"],
  ["Producto, talla, color y cantidad", "Lo que luego no se puede corregir en la guía"],
  ["Total a pagar al recibir", "El cliente debe tener la plata lista cuando llegue el mensajero"],
];

const limits = [
  ["Pedidos de formulario", "No le escribe al comprador", "Usa Dropi, Lucid Bot o la API oficial para esa confirmación"],
  ["Notas de voz", "No las escucha y no las contesta", "Pide “escríbenos” en el anuncio y revisa las notas de voz"],
  ["Fotos", "No ve la foto. Solo lee su texto", "Si un cliente manda captura del anuncio, contesta tu equipo"],
  ["Subir a Dropi", "El pedido queda en el panel. No se sube solo", "Exporta el CSV y súbelo, o conecta una herramienta de API"],
  ["Novedades y guías", "Sin integración no ve el estado de la guía", "Tu equipo gestiona las novedades con la transportadora"],
  ["Memoria", "Recuerda solo los últimos minutos del chat", "El historial completo queda en el panel para tu equipo"],
  ["Cambios tras el resumen", "Si cambian la cantidad, el pedido se puede guardar sin un resumen nuevo", "Revisa cada pedido antes de despachar"],
  ["Tu equipo en el chat", "El agente sigue contestando. No hay pausa por conversación", "Pausar el agente detiene todas las conversaciones"],
];

const tools = [
  ["Qué hace", "La IA confirma cada pedido por IVR y WhatsApp antes de despachar", "Bot de WhatsApp que sube pedidos y envía seguimiento de guías", "Agente de IA que contesta y toma pedidos por texto"],
  ["Mensajes salientes", "Sí, dentro de Dropi", "Sí", "No"],
  ["Integraciones", "Es la plataforma", "Dropi, Effi, Mastershop y app de Shopify", "API por tu cuenta"],
  ["Precio publicado", "Consulta la plataforma", "US$44 al mes hasta 20.000 contactos", "Gratis para empezar, con límite de uso. Plan de pago para más volumen"],
];

const faqs = [
  { q: "¿Cuál es el mejor chatbot para contraentrega en Colombia?", a: "Depende de cómo entran tus pedidos. Si llegan por formulario y necesitas confirmarlos, Dropi y Lucid Bot están hechos para eso. Si la mayoría entra por chats de anuncios y necesitas contestar y tomar datos, puedes probar un agente de IA como Wapzen, que es gratis para empezar." },
  { q: "¿Wapzen confirma pedidos de Shopify o Dropi?", a: "No. El agente de Wapzen solo contesta a quien le escribe. No le manda el primer mensaje a un comprador que llenó un formulario. Para eso necesitas una herramienta con mensajes salientes o la API oficial de WhatsApp." },
  { q: "¿Un chatbot reduce las devoluciones?", a: "Puede ayudar a evitar direcciones malas y compras sin intención real, pero no hay un estudio independiente que dé una cifra confiable. Dropi afirma que la confirmación reduce entre 20% y 40% las devoluciones evitables, según el producto y el canal. Mide tu tasa antes y después." },
  { q: "¿Cómo paso los pedidos a Dropi?", a: "Los pedidos que toma Wapzen quedan en la lista del panel y se exportan en CSV. Desde ahí los pasas a tu plataforma. Para automatizarlo se necesita una herramienta de API, y hay que probarla porque no se ejecuta en todos los mensajes que deberían activarla." },
  { q: "¿El cliente tiene derecho a devolver un pedido contraentrega?", a: "Las ventas a distancia tienen derecho de retracto en Colombia: cinco días hábiles desde la entrega, con excepciones, según el artículo 47 de la Ley 1480. Revisa el texto vigente con tu asesor y deja tu respuesta aprobada en las instrucciones del agente." },
  { q: "¿Puedo usar el mismo número de mi pauta?", a: "Sí, pero ese número es el activo de tu tienda. Wapzen lo conecta como dispositivo vinculado, no por la API oficial, así que hay riesgo de restricción. Prueba primero con un segundo número y ten un plan si la cuenta se cae." },
  { q: "¿Qué pasa cuando se acaba el límite gratis?", a: "El agente deja de contestar y los clientes no reciben respuesta hasta que tu equipo tome el chat o actives un plan de pago. No lances una pauta grande confiando solo en el inicio gratis." },
];

const sources = [
  { label: "Dropi: vende contraentrega", href: "https://dropi.co/ec/vende-contraentrega" },
  { label: "Lucid Bot: precios e integraciones", href: "https://www.lucidbot.co/" },
  { label: "Fluxi: herramientas para dropshipping, revisadas el 13 de octubre de 2026", href: "https://fluxi.co/blog/dropshipping-con-ia/" },
  { label: "Andrey Business: dropshipping contraentrega en Colombia (cifras del autor)", href: "https://www.andreybusiness.com/blog/dropshipping-contraentrega-colombia-2026" },
  { label: "Asuntos Legales: derecho de retracto", href: "https://www.asuntoslegales.com.co/consumidor/lo-que-debe-saber-para-ejercer-el-derecho-de-retracto-si-se-arrepiente-de-una-compra-3785580" },
  { label: "Corte Constitucional: Sentencia C-192 de 2026 (Normograma JEP)", href: "https://jurinfo.jep.gov.co/Normograma/compilacion/docs/C-192_2026.htm" },
  { label: "Función Pública: Ley 1581 de 2012, protección de datos personales", href: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981" },
  { label: "Zernio: tarifas de WhatsApp por país, lista del 1 de octubre de 2026", href: "https://zernio.com/whatsapp-api-pricing" },
  { label: "Meta: precios de la plataforma de WhatsApp Business", href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing" },
  { label: "WhatsApp Business: política de mensajes", href: "https://whatsappbusiness.com/policy/" },
];

const sections = [
  {
    id: "que-es",
    title: "¿Qué hace un chatbot de WhatsApp en una tienda contraentrega?",
    body: <>
      <p>Un chatbot de WhatsApp para contraentrega contesta los chats que llegan de tu pauta, explica el producto, pide los datos de envío y deja el pedido listo para despachar. Con IA, entiende preguntas escritas de cualquier forma, a cualquier hora, sin que alguien de tu equipo esté pegado al celular.</p>
      <p>En una tienda contraentrega eso pesa más que en otras, porque cobras al final. Si el chat se enfría, pierdes lo que pagaste en publicidad. Si despachas con una dirección mala o a alguien que no estaba seguro, pierdes el flete de ida y el de regreso.</p>
    </>,
  },
  {
    id: "quien-paga",
    title: "¿Por qué las tiendas contraentrega ya pagan por automatizar WhatsApp?",
    body: <>
      <p>Porque cada devolución tiene un costo visible. Por eso existe un mercado de herramientas con precio público:</p>
      <ul>
        <li><strong>Lucid Bot:</strong> plan base de US$44 al mes hasta 20.000 contactos, con integración a Dropi, Effi y Mastershop.</li>
        <li><strong>Dropi:</strong> ofrece una IA que confirma cada pedido por IVR y WhatsApp antes de despachar.</li>
        <li><strong>Releasit y EasySell:</strong> según una tabla de Fluxi, formularios de pedido con planes pagos desde US$11,49 y US$9,95 al mes. Fluxi también vende en esta categoría.</li>
      </ul>
      <p>Sobre las devoluciones, las cifras que circulan son del propio sector. Un operador y afiliado de Dropi, Andrey Rojas, habla de devoluciones de 35% a 40% en operaciones sin proceso, y de 18% a 25% en operaciones serias. Dropi afirma que su confirmación reduce entre 20% y 40% las devoluciones evitables. Ninguna es un estudio independiente, así que tómalas como referencia y mide las tuyas.</p>
      <h3>Una cuenta rápida</h3>
      <p>Este es un ejemplo con cifras inventadas. Cambia el flete y la tasa por los tuyos:</p>
      <Comparison caption="Ejemplo del costo de devoluciones en 100 pedidos despachados" columns={["Sin proceso", "Con mejores datos"]} rows={example} />
      <p>Aquí son $250.000 de diferencia por cada 100 pedidos, sin contar la pauta que pagaste por esos clientes ni el producto que queda retenido en bodega.</p>
    </>,
  },
  {
    id: "dos-momentos",
    title: "Tomar el pedido y confirmarlo no son lo mismo",
    body: <>
      <p>Antes de comparar herramientas, mira por dónde entran tus pedidos. Esta es la decisión más importante del artículo:</p>
      <Comparison caption="Diferencias entre un pedido de formulario y un chat que abre el cliente" columns={["Pedido por formulario", "Chat que abre el cliente"]} rows={flows} />
      <p>Wapzen sirve para el segundo caso. <strong>Si casi todos tus pedidos entran por formulario, Wapzen no te resuelve la confirmación</strong>, y Dropi o Lucid Bot encajan mejor.</p>
      <p>Si en cambio pautas con anuncios de clic a WhatsApp, o tu cliente quiere preguntar antes de comprar, el problema es otro: contestar rápido, vender y tomar bien los datos. Para eso sirve un agente de IA.</p>
      <InlineCta title="Prueba con tu producto" body="Crea un agente, súbele la ficha del producto y hazte un pedido por WhatsApp. Es gratis para empezar." label="Empieza gratis" />
    </>,
  },
  {
    id: "datos",
    title: "Qué datos pedir para no despachar a ciegas",
    body: <>
      <p>En contraentrega, muchas novedades empiezan con una dirección incompleta. Estos son los datos que tu agente debe conseguir, uno a la vez:</p>
      <Comparison caption="Datos que debe pedir el agente en un pedido contraentrega" columns={["Por qué importa"]} rows={address} />
      <Note>El siguiente diálogo es ilustrativo. Producto, precio y datos son inventados.</Note>
      <p><strong>Cliente:</strong> “Hola, vi el anuncio de la freidora de aire. ¿Hacen envíos a Pereira contraentrega?”</p>
      <p><strong>Agente:</strong> “¡Hola! Sí, enviamos a Pereira y pagas al recibir. La freidora de 5 litros vale $189.900 con envío incluido. ¿La quieres en negro o en blanco?”</p>
      <p><strong>Cliente:</strong> “Negra. ¿Cuánto se demora?”</p>
      <p><strong>Agente:</strong> “Normalmente entre 2 y 4 días hábiles, según la transportadora. Para hacer el pedido necesito tu nombre completo y tu dirección.”</p>
      <p><strong>Cliente:</strong> “Carolina Giraldo, cra 7 # 22-15 apto 302, barrio Centro”</p>
      <p><strong>Agente:</strong> “Gracias, Carolina. Te confirmo: 1 freidora negra de 5 litros. Entrega en Cra 7 # 22-15, apto 302, Centro, Pereira. Pagas $189.900 al recibir. ¿Hago el pedido?”</p>
      <p><strong>Cliente:</strong> “Sí”</p>
      <p><strong>Agente:</strong> “Listo, tu pedido es el n.º 318. Ten a mano el valor cuando llegue el mensajero.”</p>
    </>,
  },
  {
    id: "configurar",
    title: "Cómo configurarlo en Wapzen",
    body: <>
      <p><Link href="/es/chatbot-whatsapp-gratis">Wapzen</Link> te deja crear el agente sin programar. El panel está en inglés, y el agente contesta en español si se lo pides en las instrucciones.</p>
      <h3>1. Escribe las instrucciones</h3>
      <blockquote>“Eres el asesor virtual de [tienda] en Colombia. Contesta en español, con mensajes cortos y amables, tuteando al cliente. Usa solo la información de la base de conocimiento: nunca inventes precios, tiempos de entrega, garantías ni resultados del producto. Pide los datos uno a la vez. Antes de hacer el pedido, muestra el resumen completo con el total a pagar al recibir y pide confirmación. No presiones al cliente. Si pregunta por devoluciones o garantías, usa el texto aprobado. Si hay un reclamo, pásale el número [número]. Di que eres un asistente virtual si te preguntan.”</blockquote>
      <h3>2. Sube la ficha del producto</h3>
      <p>Agrega en texto, PDF o Word: precio, tallas o colores, cobertura, tiempos de entrega, garantía, política de devolución y preguntas frecuentes. Si dejas de vender un producto, sácalo de ahí.</p>
      <h3>3. Activa Take Order</h3>
      <p>Take Order es la herramienta de pedidos de Wapzen. Elige los campos: nombre, ciudad, dirección, barrio, referencia, producto y cantidad. El número del cliente se guarda solo, y el pedido se guarda después de que confirma el resumen. Desde el panel exportas la lista en CSV.</p>
      <h3>4. Diferencia los anuncios con un mensaje ya escrito</h3>
      <p>Si vendes varios productos, cada anuncio o enlace debe abrir WhatsApp con un texto como “Hola, quiero la freidora”. Así el agente sabe de qué producto le hablan. Crea esos enlaces con nuestro <Link href="/tools/whatsapp-link-generator">generador de enlaces de WhatsApp</Link>.</p>
      <h3>5. Haz 20 pedidos de prueba antes de pautar</h3>
      <p>Prueba direcciones incompletas, un municipio fuera de cobertura, un cliente indeciso y uno que cambia la cantidad. Revisa que cada pedido guardado coincida con el chat.</p>
    </>,
  },
  {
    id: "ley",
    title: "Qué debes tener claro en Colombia",
    body: <>
      <p><strong>Retracto.</strong> El artículo 47 de la Ley 1480 de 2011 da derecho de retracto en ventas a distancia, y eso incluye comercio electrónico, teléfono y catálogo. Según Asuntos Legales, el plazo es de cinco días hábiles después de la entrega, y el consumidor devuelve el producto por los mismos medios, asumiendo el transporte. Hay excepciones, como perecederos, productos a medida y bienes de uso personal.</p>
      <p>El plazo para devolver el dinero merece un cuidado aparte. La Ley 2439 de 2024 modificó esa parte del artículo, y la Corte Constitucional se pronunció sobre la reforma en la Sentencia C-192 de 2026. Por eso el plazo que repiten muchas guías puede estar desactualizado. No lo escribas en las instrucciones del agente sin revisarlo antes con tu asesor.</p>
      <p><strong>Datos personales.</strong> Nombre, celular y dirección son datos personales bajo la Ley 1581 de 2012, y la Superintendencia de Industria y Comercio es la autoridad. Ten una política de tratamiento, y úsalos solo para lo que el cliente autorizó.</p>
      <p><strong>Productos restringidos.</strong> Si vendes suplementos o productos de salud, no dejes que el agente prometa resultados. La política de WhatsApp Business también restringe artículos como medicamentos y productos médicos: revísala antes de vender por este canal.</p>
      <p>Esto es orientación general, no asesoría legal.</p>
    </>,
  },
  {
    id: "limites",
    title: "Los límites actuales de Wapzen",
    body: <>
      <Comparison caption="Límites del agente de Wapzen en una tienda contraentrega y cómo resolverlos" columns={["Qué pasa", "Cómo resolverlo"]} rows={limits} />
      <p>Al terminar el límite de uso del inicio gratis, el agente deja de contestar. No lances una pauta grande sin revisar cuánto te queda, porque esos chats se quedarían sin respuesta.</p>
    </>,
  },
  {
    id: "comparar",
    title: "Dropi, Lucid Bot o Wapzen",
    body: <>
      <Comparison caption="Dropi, Lucid Bot y Wapzen comparados para contraentrega" columns={["Dropi", "Lucid Bot", "Wapzen"]} rows={tools} />
      <Choose locale="es-CO" highlight="Wapzen" items={[
        { name: "Dropi o Lucid Bot", points: ["Tus pedidos entran por formulario", "Necesitas confirmar y hacer seguimiento de guías", "Operas con Dropi, Effi o Mastershop"] },
        { name: "Wapzen", points: ["Tus ventas nacen en chats de anuncios", "Necesitas contestar preguntas abiertas a cualquier hora", "Quieres probar con un número sin integrar nada"] },
      ]} />
      <p>No conectes dos bots al mismo número: los dos le contestarían al cliente.</p>
      <p>Wapzen conecta tu número con código QR o código de vinculación, como dispositivo vinculado. No es la API oficial de Meta. Por eso no pagas tarifa por mensaje, pero tampoco tienes garantía contra restricciones de la cuenta. Si necesitas volumen de salida, la API oficial puede salir barata en Colombia: Zernio, citando la lista de Meta del 1 de octubre de 2026, da unos US$0,0125 por mensaje de marketing y US$0,0008 por mensaje de utilidad. Confirma las tarifas en Meta. Wapzen es un producto independiente, no es de Meta ni de WhatsApp.</p>
    </>,
  },
];

export default function ChatbotWhatsAppContraentregaPage() {
  return <BlogPost
    href={href}
    heading={<>Chatbot de WhatsApp para contraentrega.<br /><span>Cómo tomar pedidos en Colombia sin perder chats.</span></>}
    lead="Pautaste un producto, los chats entran a las 10 de la noche y nadie contesta hasta el otro día. Cuando respondes, el cliente ya no aparece o te da una dirección a medias, y esa guía termina en devolución. Esta guía explica qué parte puede hacer un agente de IA, cuál no, y qué herramienta te conviene según cómo entran tus pedidos."
    summary={{
      title: "En resumen",
      items: [
        <><strong>Qué resuelve:</strong> contesta chats de pauta a cualquier hora, pide los datos de envío completos y guarda el pedido.</>,
        <><strong>Quién paga ya:</strong> las tiendas contraentrega usan Lucid Bot, desde US$44 al mes, y la confirmación con IA de Dropi.</>,
        <><strong>La decisión clave:</strong> Wapzen solo contesta a quien le escribe. Si tus pedidos entran por formulario, no te sirve para confirmarlos.</>,
        <><strong>Qué exige la ley:</strong> derecho de retracto y tratamiento de datos. Deja las respuestas aprobadas en las instrucciones.</>,
        <><strong>Cómo probar:</strong> Wapzen es gratis para empezar, con límite de uso, y no requiere programar.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/es-mx/blog/como-vender-por-whatsapp", "/es-mx/blog/chatbot-para-whatsapp-business"]}
    product="/es/chatbot-whatsapp-gratis"
    cta={{ heading: <>Que tu pauta no se quede sin respuesta.<br /><span>Prueba con tu producto.</span></>, body: "Crea un agente de IA, sube la ficha del producto y conecta tu número. Es gratis para empezar." }}
  />;
}
