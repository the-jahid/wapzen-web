import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { Choose, InlineCta, Note, RowTable } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Búsquedas (autocompletado Google, YouTube y DuckDuckGo con gl=mx, 2026-11-06, ver
// docs/seo-research.md, "Brazil and Mexico gap posts"): "chatbot gratis para whatsapp
// business" (34, 3/3), "chatbot con ia para whatsapp gratis" (31, 3/3), "chatbot whatsapp
// gratis" (30, 3/3), "bot de whatsapp gratis" (30, 3/3), "mejor chatbot para whatsapp gratis"
// (25), "agente de ia para whatsapp gratis" (25). "agente de ia whatsapp" tiene demanda
// parecida, pero esos resultados los dominan medios mexicanos por el lanzamiento de Meta.
// A pedido del usuario (2026-11-05): todo gratis, agente de voz funcionando, sin nota sobre
// bloqueos y sin el límite por hora. El servidor mantiene HOURLY_REPLY_LIMIT = 100, así que
// el texto dice "conversaciones ilimitadas" y "sin límite mensual", nunca "respuestas
// ilimitadas". Precios leídos en cada página el 2026-11-06, salvo ManyChat, que rechaza
// lecturas automáticas: sale de Kanal (4 nov) y Hyperleap (26 oct), y el texto lo dice. Wapzen
// es producto propio y el texto lo dice: no es una clasificación. Tarifas de Meta y Meta One:
// revisar cada trimestre (1 de ene/abr/jul/oct).
const href = "/es-mx/blog/chatbot-gratis-whatsapp";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hola, quiero activar el agente de voz de Wapzen en mi negocio en México.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es-MX", article: { publishedTime: post.published, modifiedTime: post.updated } });

const options = [
  ["Meta Business Agent", "Empieza sin pago en la app, si tu cuenta es elegible", "Sí, en la app de WhatsApp Business", "Sí", "Meta One Essential: desde MXN 229 al mes, con mayor acceso"],
  ["ManyChat", "25 contactos activos al mes, sin WhatsApp", "Solo desde Pro", "Desde Pro", "US$39 al mes (US$29 pagando anual), más tarifas de Meta"],
  ["SendPulse", "3 bots, 500 suscriptores y 10,000 mensajes al mes. El plan gratis no lista WhatsApp", "En Pro", "Integración con ChatGPT en Pro", "US$12 al mes (US$9.60 pagando anual), más tarifas de Meta"],
  ["Landbot", "100 chats al mes, solo en web", "En el plan gratis, solo con número de prueba", "No en el plan gratis", "€160 al mes con WhatsApp y 500 chats con IA"],
  ["Kommo", "Prueba de 14 días, sin plan gratis", "Sí", "Agentes desde Advanced", "US$25 por usuario al mes; US$35 con agentes de IA. Mínimo 6 meses"],
  ["WATI", "Prueba de 7 días, sin plan gratis", "Sí, con la API", "2,000 créditos en Growth", "US$39 al mes con pago anual, más tarifas de Meta"],
  ["Leadsales", "Prueba de 14 días, sin plan gratis", "El plan Básico no trae la API. La API empieza en Profesional", "Lead Agent, sin costo el primer mes", "MXN 3,239.88 al mes + Lead Agent desde MXN 2,119.32"],
  ["Wapzen", "Todo, por ahora: chat con IA, pedidos, base de conocimiento, envíos masivos y agente de voz", "Sí, personal o Business", "Incluida", "No hay cuota: MXN 0"],
];

const versus = [
  ["Tipo de número", "Solo WhatsApp Business", "Personal o Business"],
  ["Producto oficial de Meta", "Sí", "No, se vincula como dispositivo"],
  ["Aprende de", "Tu perfil, catálogo y chats anteriores", "Tus instrucciones y documentos"],
  ["Se conecta a tus sistemas", "En la app, no", "Sí, con herramientas de API"],
  ["Llamadas de WhatsApp", "Meta describe chats, no llamadas", "Su agente de voz contesta y llama"],
  ["Costo", "Empieza sin pago. Mayor acceso desde MXN 229 al mes", "Gratis por ahora"],
];

const fit = [
  ["Tienda o pyme que vende y atiende por WhatsApp", "Sí", "Contesta en segundos con tu información, a cualquier hora"],
  ["Restaurante o negocio que recibe pedidos por mensaje", "Sí", "Anota el pedido, lo confirma con el cliente y lo guarda en tu panel"],
  ["Profesional independiente que no puede contestar mientras atiende", "Sí", "El agente responde mientras estás ocupado"],
  ["Empresa que necesita insignia verde o plantillas aprobadas", "No", "Eso solo existe en la API oficial de Meta"],
  ["Negocio que quiere escribirle a listas compradas", "No", "Esas personas nunca pidieron tu información"],
];

const prompt = `Eres la asistente virtual de Tienda Demo, ropa de mujer en Guadalajara, Jalisco.
Di en tu primer mensaje que eres una asistente virtual.
Contesta en español de México, con mensajes cortos de dos o tres frases, y haz una sola pregunta a la vez. Si el cliente escribe en inglés, contesta en inglés.
Para precios, tallas, existencias y tiempos de envío, usa solo la información que te dimos. Si no tienes un dato, dilo y ofrece que alguien del equipo le conteste.
Nunca inventes descuentos, fechas de entrega, garantías ni existencias.
En Guadalajara y Zapopan, entrega al día siguiente por $60. Al resto de México, el equipo confirma el costo y el tiempo de envío.
Formas de pago: transferencia SPEI, depósito en OXXO o liga de pago que manda el equipo. Tú no confirmas pagos: pide el comprobante y avisa que el equipo lo revisa en horario de atención.
Para comprar, pide producto, talla, nombre y dirección con código postal, repite el pedido con el total y pide que lo confirme.
No pidas CURP, contraseñas, datos de tarjeta ni información de salud.
Si alguien pide hablar con una persona, avisa que el equipo contesta de lunes a sábado, de 10:00 a 19:00, en este mismo número.
Si alguien contesta a una promoción nuestra, pregunta qué producto le interesó y sigue la conversación.`;

const sources = [
  { label: "SDP Noticias: Estudio sobre los Hábitos de Usuarios de Internet en México 2026 (AIMX)", href: "https://www.sdpnoticias.com/estados/aimx-revela-habitos-digitales-de-mexicanos-en-2026-ia-redes-sociales-y-compras-online/" },
  { label: "Harvard Business Review: The Short Life of Online Sales Leads", href: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads" },
  { label: "Meta: Introducing Meta Business Agent (junio de 2026)", href: "https://about.fb.com/news/2026/06/meta-business-agent/" },
  { label: "Meta: presentamos Meta One (septiembre de 2026)", href: "https://about.fb.com/ltam/news/2026/09/presentamos-meta-one-un-servicio-de-suscripcion-con-mas-funciones-e-ia-para-crear-conectar-y-destacar/" },
  { label: "Xataka México: precios de Meta One en México", href: "https://www.xataka.com.mx/aplicaciones/estabas-harto-suscripciones-llega-meta-one-a-mexico-reune-instagram-facebook-whatsapp-plus-ia" },
  { label: "Xataka México: los asistentes con IA llegan a WhatsApp Business en México", href: "https://www.xataka.com.mx/aplicaciones/asistentes-ia-llegan-a-whatsapp-business-mexico-asi-nueva-herramienta-pymes-automaticen-sus-ventas" },
  { label: "Meta: precios de la plataforma de WhatsApp Business", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Kanal: precios de ManyChat en 2026", href: "https://getkanal.com/blog/manychat-pricing-explained.md" },
  { label: "Hyperleap: precios de ManyChat en 2026", href: "https://hyperleap.ai/comparison/manychat-pricing" },
  { label: "SendPulse: precios de chatbots", href: "https://sendpulse.com/en/pricing/messengers" },
  { label: "Landbot: precios", href: "https://landbot.io/pricing" },
  { label: "Kommo: precios", href: "https://www.kommo.com/pricing/" },
  { label: "WATI: precios", href: "https://www.wati.io/pricing/" },
  { label: "Leadsales: precios", href: "https://leadsales.io/precios/" },
  { label: "Centro de Ayuda de WhatsApp: cómo usar los mensajes de bienvenida", href: "https://faq.whatsapp.com/501866148528310" },
  { label: "TechCrunch: la regla de Meta sobre chatbots de uso general (enero de 2026)", href: "https://techcrunch.com/2026/01/15/after-italy-whatsapp-excludes-brazil-from-rival-chatbot-ban" },
  { label: "Cámara de Diputados: Ley Federal de Protección al Consumidor", href: "https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPC.pdf" },
  { label: "Cámara de Diputados: Ley Federal de Protección de Datos Personales en Posesión de los Particulares", href: "https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf" },
  { label: "Profeco: Registro Público para Evitar Publicidad (REPEP)", href: "https://repep.profeco.gob.mx/" },
];

const questions = [
  {
    id: "existe",
    q: "¿Hay un chatbot para WhatsApp realmente gratis en México?",
    answer: "Sí. Wapzen te da hoy un chatbot con IA gratis en tu propio número, con conversaciones ilimitadas, sin tarifa por mensaje y sin clave de API de Meta. Meta Business Agent también se puede empezar sin pago en la app de WhatsApp Business. Las demás opciones que revisamos cobran por usar WhatsApp en tu número o solo dan una prueba.",
    body: <>
      <p>Si buscas “chatbot gratis para WhatsApp Business”, casi todo lo que aparece tiene letra chiquita:</p>
      <ul>
        <li><strong>Prueba, no plan gratis:</strong> sirve 7 o 14 días y luego te pide una tarjeta.</li>
        <li><strong>Plan gratis sin lo que buscas:</strong> no incluye WhatsApp, no incluye IA o solo funciona con un número de prueba.</li>
        <li><strong>Tarifas de Meta aparte:</strong> si la herramienta usa la API oficial, Meta cobra por mensaje aunque la plataforma sea barata.</li>
      </ul>
      <p>Vale la pena buscar una opción que funcione: según el estudio de hábitos de internet 2026 de la Asociación de Internet MX, <strong>WhatsApp tiene 91% de presencia activa</strong> entre los usuarios de internet en México. Tus clientes ya están ahí.</p>
    </>,
  },
  {
    id: "comparativa",
    q: "¿Qué chatbots de WhatsApp son gratis y cuáles solo lo parecen?",
    answer: "De las ocho opciones que revisamos, solo Wapzen y Meta Business Agent te dejan contestar con IA en tu número de WhatsApp sin pagar. ManyChat, SendPulse y Landbot tienen planes gratis, pero sin WhatsApp en tu número o sin IA. Kommo, WATI y Leadsales ofrecen pruebas de 7 a 14 días y después cobran una cuota.",
    body: <>
      <RowTable firstColumn="Herramienta" highlight="Wapzen" caption="Chatbots para WhatsApp en México: qué es gratis, WhatsApp, IA y precio" columns={["Lo gratis", "WhatsApp en tu número", "IA", "Si pagas, desde"]} rows={options} />
      <Note>Precios leídos en la página de cada proveedor el 6 de noviembre de 2026, con dos excepciones. ManyChat no permite la lectura automática de su página, así que sus datos vienen de dos análisis publicados en octubre y noviembre de 2026: confírmalos en su sitio. El precio de Meta One en pesos viene de Xataka México, y Meta aclara que puede variar según la cuenta.</Note>
    </>,
  },
  {
    id: "crecer",
    q: "¿Cómo ayuda Wapzen a que tu negocio crezca?",
    answer: "De tres formas. Vendes más, porque cada interesado recibe respuesta en segundos, a cualquier hora. Atiendes a más clientes, porque el agente lleva varias conversaciones a la vez y anota pedidos y prospectos. Y gastas menos, porque Wapzen no cobra cuota ni tarifa por mensaje, así que ese dinero puede ir a anuncios o inventario.",
    body: <>
      <h3>Vender más</h3>
      <ul>
        <li><strong>Contestas primero.</strong> En un estudio publicado en Harvard Business Review, las empresas de EE. UU. que intentaban contactar en menos de una hora tenían casi siete veces más probabilidades de calificar al prospecto que las que tardaban más. Es de 2011 y no es de México, pero la lógica aplica: quien te escribe muchas veces le escribe también a tu competencia.</li>
        <li><strong>Tus anuncios rinden más.</strong> Si pagas anuncios de Facebook o Instagram que abren WhatsApp, cada mensaje sin contestar es un clic pagado que se desperdicia. Con el agente, quien da clic a las 11 de la noche recibe respuesta al momento.</li>
        <li><strong>Más puertas de entrada.</strong> Con el <Link href="/tools/whatsapp-link-generator">generador de ligas</Link> y el <Link href="/tools/whatsapp-qr-code-generator">generador de códigos QR</Link> gratis, pones tu WhatsApp en Instagram, en el mostrador, en el menú y en tus empaques.</li>
        <li><strong>Vuelven los clientes de antes.</strong> En Bulk Messages subes un Excel o CSV y mandas un mensaje personalizado a cada cliente, con una pausa predeterminada de 30 segundos entre envíos. Úsalo solo con quienes aceptaron recibirlos.</li>
      </ul>
      <Note>El agente no ve el texto de los envíos masivos. Por eso las instrucciones de ejemplo le explican qué hacer cuando alguien contesta a una promoción.</Note>
      <h3>Atender a más clientes</h3>
      <ul>
        <li><strong>Las horas pico no te frenan.</strong> A la hora de la comida o durante una promoción, el agente lleva varias conversaciones a la vez. Tú y tu equipo se quedan con lo que requiere a una persona.</li>
        <li><strong>La conversación se vuelve pedido.</strong> Con la herramienta Take Order, el agente anota producto, nombre y dirección, confirma el resumen con el cliente y guarda el pedido en tu panel.</li>
        <li><strong>Los prospectos llegan ordenados.</strong> Tú decides qué preguntar, como presupuesto, colonia o fecha. Cuando tu equipo abre el chat, los datos ya están ahí.</li>
        <li><strong>Notas de voz y fotos tienen respuesta.</strong> También atiende a quien prefiere mandar audio o la foto de un producto.</li>
      </ul>
      <h3>Gastar menos y aprender de tus conversaciones</h3>
      <ul>
        <li><strong>MXN 0 de herramienta.</strong> Lo que iría a cuotas y tarifas por mensaje puede ir a anuncios o inventario. Revisa <a href="#costo">la cuenta frente a otras opciones</a>.</li>
        <li><strong>Descubres qué falta.</strong> Todas las conversaciones quedan en tu panel. Las preguntas que más se repiten te dicen qué falta en tu anuncio, catálogo o página.</li>
      </ul>
      <ChatExample
        business="Tienda Demo"
        labels={{ subtitle: "WhatsApp · agente de IA", agent: "Agente: ", patient: "Cliente: " }}
        turns={[
          { from: "patient", text: "Hola, ¿todavía tienen el vestido azul en mediana? ¿Cuánto sale el envío a Zapopan?" },
          { from: "agent", text: "¡Hola! Soy la asistente virtual de Tienda Demo. Sí lo tenemos en mediana, cuesta $590. A Zapopan el envío es de $60 y llega al día siguiente. ¿Te anoto el pedido?" },
          { from: "patient", text: "Sí. ¿Puedo pagar por transferencia?" },
          { from: "agent", text: "Claro, por SPEI. ¿Me pasas tu nombre y tu dirección con código postal?" },
          { from: "patient", text: "Mariana Ruiz, Av. de las Rosas 120, Zapopan, 45000." },
          { from: "agent", text: "Confirmo: 1 vestido azul mediana, $590 + $60 de envío = $650, a nombre de Mariana Ruiz, en Av. de las Rosas 120, Zapopan, 45000. ¿Todo bien?" },
          { from: "patient", text: "Sí, todo bien." },
          { from: "agent", text: "Listo, Mariana. La CLABE es 000000000000000000. Manda tu comprobante por aquí y el equipo lo revisa mañana a partir de las 10:00." },
        ]}
        caption="Conversación ilustrativa de una tienda inventada, a las 10:40 de la noche. Los datos saldrían de las instrucciones y los archivos de la tienda."
        points={[
          { title: "Atiende fuera de horario", body: "La venta no tiene que esperar a que abras al día siguiente." },
          { title: "Usa tus datos", body: "El precio, la talla y el envío salen de lo que le diste." },
          { title: "Confirma antes de guardar", body: "Repite el pedido y el total, y el cliente lo confirma." },
          { title: "No confirma el pago", body: "Recibe el comprobante, pero tu equipo revisa la transferencia." },
        ]}
      />
      <h3>Haz la cuenta con tus números</h3>
      <p>Esto es un ejemplo, no una promesa. Revisa cuántos mensajes te llegaron fuera de horario la semana pasada y cambia los valores:</p>
      <ul>
        <li>10 mensajes fuera de horario al día × 30 días = <strong>300 mensajes al mes</strong>.</li>
        <li>Si 1 de cada 10 se vuelve venta = <strong>30 ventas</strong>.</li>
        <li>Con un ticket promedio de $350 = <strong>$10,500 al mes</strong> que hoy dependen de que alguien esté despierto para contestar.</li>
      </ul>
    </>,
  },
  {
    id: "mejor",
    q: "¿Cuál es el mejor chatbot gratis para WhatsApp en español?",
    answer: "Depende de tu número y de lo que necesitas. Para contestar con IA en español en cualquier número, con agente de voz, Wapzen. Si ya usas WhatsApp Business y prefieres una herramienta oficial, Meta Business Agent. Si vendes sobre todo por Instagram con flujos, ManyChat. Si tienes equipo de ventas con embudos, Kommo o Leadsales, que son de pago.",
    body: <>
      <p>Wapzen es nuestro producto, así que tómalo en cuenta. Por eso publicamos los precios y las fuentes en vez de hacer un ranking. Elige según tu caso:</p>
      <Choose locale="es-MX" items={[
        { name: "Wapzen", points: ["Quieres contestar con IA sin pagar nada por ahora", "Usas un número personal o de WhatsApp Business", "También quieres contestar llamadas de WhatsApp con IA"] },
        { name: "Meta Business Agent", points: ["Ya usas la app de WhatsApp Business y tu cuenta es elegible", "Prefieres una herramienta oficial de Meta", "Te basta con que aprenda de tu perfil y tu catálogo"] },
        { name: "ManyChat", points: ["Vendes sobre todo por Instagram", "Prefieres diseñar flujos con botones", "Puedes pagar el plan Pro para usar WhatsApp"] },
        { name: "Kommo o Leadsales", points: ["Tienes un equipo de ventas que necesita embudos", "Necesitas la API oficial y campañas masivas", "Puedes pagar una cuota mensual"] },
      ]} />
      <p>Si todavía estás entendiendo qué es un bot y qué tipos hay, empieza por la guía de <Link href="/es-mx/blog/chatbot-para-whatsapp-business">chatbot para WhatsApp Business</Link>.</p>
    </>,
  },
  {
    id: "costo",
    q: "¿Cuánto cuesta un chatbot de WhatsApp en México si no es gratis?",
    answer: "Para un negocio con 4,500 respuestas al mes, entre unos MXN 1,265 y MXN 5,660 al mes, según la herramienta. MXN 547.75 corresponden a tarifas de Meta y el resto a la plataforma: unos MXN 717 con ManyChat Pro, o MXN 5,359.20 con Leadsales Profesional y Lead Agent. Con Wapzen son MXN 0, porque no usa la API de Meta.",
    body: <>
      <p>Una tienda recibe 25 conversaciones al día, con 6 respuestas por conversación: <strong>4,500 respuestas al mes</strong>.</p>
      <ul>
        <li><strong>Tarifas de Meta en la API oficial:</strong> quitando las primeras 1,000 respuestas gratis, 3,500 × MXN 0.1565 = <strong>MXN 547.75</strong>.</li>
        <li><strong>Con ManyChat Pro:</strong> US$39, unos MXN 717 al tipo de cambio de la tabla de Meta (18.38). En total, unos <strong>MXN 1,265 al mes</strong>.</li>
        <li><strong>Con Leadsales Profesional y Lead Agent Starter:</strong> MXN 3,239.88 + MXN 2,119.32 + MXN 547.75 de Meta, menos el saldo incluido de MXN 245. En total, unos <strong>MXN 5,660 al mes</strong>, si ese nivel te alcanza.</li>
        <li><strong>Una promoción a 500 clientes en la API oficial:</strong> 500 × MXN 0.7298 = <strong>MXN 364.90</strong> por envío.</li>
        <li><strong>Con Wapzen:</strong> <strong>MXN 0</strong> en todo. Con la pausa predeterminada de 30 segundos, 500 mensajes tardan poco más de 4 horas.</li>
      </ul>
      <Note>Tarifas de Meta para México de la lista del 1 de octubre de 2026: cambian cada trimestre. Más detalle en <Link href="/es-mx/blog/whatsapp-business-precio">¿WhatsApp Business tiene costo?</Link></Note>
      <p>Si necesitas plantillas aprobadas, envíos a gran escala o un canal oficial de Meta, pagar por la API tiene sentido. Lo importante es saber qué estás comprando.</p>
    </>,
  },
  {
    id: "crear",
    q: "¿Cómo crear un chatbot gratis para WhatsApp con IA, paso a paso?",
    answer: "Con Wapzen: crea tu cuenta gratis, prepara las instrucciones, vincula tu número con un código de vinculación o un código QR, ponle nombre al agente, pega las instrucciones y sube la información de tu negocio. No necesitas programar, ni tarjeta, ni clave de API de Meta. Luego pruébalo desde otro número.",
    body: <>
      <ol>
        <li><strong>Crea tu cuenta gratis.</strong> Sin tarjeta y sin clave de API. El panel está en inglés; el agente contesta en español.</li>
        <li><strong>Ten listas las instrucciones.</strong> Adapta el ejemplo de abajo antes de vincular. El agente empieza a funcionar en cuanto vinculas el número y, hasta recibir tus instrucciones, contesta de forma genérica.</li>
        <li><strong>Vincula tu número.</strong> En New chat agent, escribe tu número para recibir un código de 8 caracteres. En WhatsApp, ve a Dispositivos vinculados › Vincular un dispositivo › Vincular con el número de teléfono y escribe el código. En una computadora, también puedes escanear el código QR.</li>
        <li><strong>Ponle nombre y pega las instrucciones.</strong> Hazlo enseguida.</li>
        <li><strong>Sube tu información.</strong> Precios, preguntas frecuentes y políticas en texto, PDF o Word. Un PDF escaneado no se puede leer: usa una versión con texto seleccionable.</li>
        <li><strong>Activa lo que necesites.</strong> Notas de voz, fotos y la herramienta de pedidos (Take Order) están en el editor del agente.</li>
        <li><strong>Pruébalo desde otro número.</strong> Escribe las preguntas reales de tus clientes, incluidas las difíciles, y ajusta las instrucciones.</li>
      </ol>
      <p>Este ejemplo es de una tienda inventada. Cámbialo por los datos de tu negocio:</p>
      <pre>{prompt}</pre>
      <InlineCta title="Crea tu chatbot de WhatsApp gratis" body="Todo es gratis por ahora, sin clave de API de Meta y sin tarjeta." label="Empieza gratis" />
    </>,
  },
  {
    id: "meta-chatgpt",
    q: "¿No basta con el agente de Meta o con ChatGPT?",
    answer: "Meta Business Agent puede bastarte: es oficial y México fue el primer país donde llegó, en noviembre de 2025. Pero solo funciona en WhatsApp Business, depende de que tu cuenta sea elegible y Meta describe chats, no llamadas. ChatGPT no sirve para esto: no atiende a tus clientes en tu número. Los agentes de Wapzen usan modelos GPT de OpenAI, incluidos.",
    body: <>
      <Comparison caption="Meta Business Agent frente a Wapzen en México" columns={["Meta Business Agent", "Wapzen"]} rows={versus} />
      <p>Mientras Meta Business Agent está conectado, WhatsApp apaga automáticamente tus mensajes de bienvenida. Si los usas, tómalo en cuenta.</p>
      <p>En cuanto a ChatGPT, desde enero de 2026 una regla de Meta prohíbe los chatbots de uso general en la API de WhatsApp Business, y su número dejó de funcionar en México. Esa regla no impide que un negocio atienda a sus clientes con un bot, según TechCrunch. <strong>Meta AI</strong> tampoco sirve para esto: es un asistente para quien chatea con él, no un agente de tu negocio.</p>
    </>,
  },
  {
    id: "numero",
    q: "¿Necesito la API de WhatsApp Business o cambiar de número?",
    answer: "No. Wapzen vincula tu número actual como un dispositivo, igual que WhatsApp Web. Funciona con WhatsApp normal y con WhatsApp Business, conservas tus chats y sigues usando tu celular. No hay solicitud a Meta, plantillas ni clave de API. A cambio, no es la plataforma oficial, así que no trae insignia verde ni plantillas aprobadas.",
    body: <>
      <ul>
        <li><strong>Mismo número.</strong> Tus clientes te escriben donde siempre.</li>
        <li><strong>Sin clave de API.</strong> La IA viene incluida, sin cuenta en OpenAI.</li>
        <li><strong>Sin tarifa por mensaje.</strong> Meta cobra por mensaje en su API, y Wapzen no la usa.</li>
      </ul>
      <p>Wapzen es un producto independiente: no pertenece a Meta ni a WhatsApp.</p>
    </>,
  },
  {
    id: "voz-fotos-llamadas",
    q: "¿El chatbot entiende notas de voz y fotos? ¿También contesta llamadas?",
    answer: "Sí. Si activas cada opción, el agente de Wapzen transcribe las notas de voz y lee las fotos, y responde por texto. Ambas vienen apagadas. Su agente de voz contesta las llamadas de WhatsApp en español y puede llamar a quien pidió contacto, sin costo por minuto. Solo funciona con llamadas de WhatsApp y no transfiere la llamada a una persona.",
    body: <>
      <ul>
        <li><strong>Notas de voz:</strong> las de más de 5 minutos no reciben respuesta automática.</li>
        <li><strong>Fotos:</strong> las ve solo en el mensaje en que llegan. Puede leer un comprobante, pero no entra a tu banco: la transferencia la revisas tú.</li>
        <li><strong>Llamadas:</strong> hay una pausa de uno o dos segundos antes de cada respuesta, y cada agente de voz habla un idioma.</li>
        <li><strong>Llamadas salientes:</strong> en una campaña agregas nombre y número, y el agente llama al momento. Llama solo a quien te pidió contacto.</li>
      </ul>
      <p>Más detalles en el <Link href="/es-mx/blog/agente-de-voz-ia-whatsapp-gratis">agente de voz con IA para WhatsApp</Link>.</p>
      <InlineCta href={voiceAccess} title="Contesta también a quien prefiere llamar" body="El agente de voz también es gratis por ahora. Escríbenos por WhatsApp y lo activamos en tu número." label="Escríbenos por WhatsApp" />
    </>,
  },
  {
    id: "persona",
    q: "¿Qué pasa cuando un cliente quiere hablar con una persona?",
    answer: "Tú tomas ese chat. Cada conversación en el panel de Wapzen tiene un interruptor de IA: lo apagas y el agente deja de contestarle solo a esa persona, mientras sigue con los demás. No se apaga solo cuando contestas tú, y en las instrucciones defines cuándo debe ofrecer atención humana.",
    body: <>
      <ol>
        <li><strong>Define los casos en las instrucciones:</strong> quejas, cambios, devoluciones, negociaciones o quien pida hablar con alguien.</li>
        <li><strong>Di cómo se le atenderá:</strong> por ejemplo, “el equipo contesta en este número, de lunes a sábado, de 10:00 a 19:00”.</li>
        <li><strong>Apaga la IA en ese contacto</strong> y contesta desde el panel o el celular. Al terminar, vuelve a encenderla.</li>
      </ol>
      <p>El agente no te avisa cuando alguien pide a una persona. Acuerda con tu equipo revisar el panel durante el día, o pide en las instrucciones que comparta el número de un asesor. Para detenerlo en todos los chats, pausa el agente.</p>
    </>,
  },
  {
    id: "leyes",
    q: "¿Qué leyes aplican a un chatbot de WhatsApp en México?",
    answer: "Principalmente tres. La Ley Federal de Protección de Datos Personales en Posesión de los Particulares de 2025 pide un aviso de privacidad. La Ley Federal de Protección al Consumidor te obliga a respetar los precios y condiciones que ofreces (artículo 7) y permite exigir no recibir publicidad (artículo 17). Además existe el REPEP de Profeco.",
    body: <>
      <p>Esto es información general, no asesoría legal:</p>
      <ul>
        <li><strong>Datos personales.</strong> La ley se publicó el 20 de marzo de 2025, y la Secretaría Anticorrupción y Buen Gobierno sustituyó al INAI. Ten al día tu aviso de privacidad y pide solo los datos que necesitas.</li>
        <li><strong>Precios y condiciones.</strong> Lo que el agente ofrece puede obligarte. Trátalo como un anuncio y mantén sus datos al día.</li>
        <li><strong>Promociones.</strong> Envíalas solo a quien aceptó recibirlas, y deja de escribirle a quien te lo pida. El REPEP se creó para llamadas y mensajes de texto, y no está claro cómo aplica a WhatsApp: no lo tomes como un hueco legal.</li>
        <li><strong>Asistente virtual.</strong> Wapzen no agrega ese aviso por su cuenta, así que ponlo en las instrucciones, como en el ejemplo.</li>
        <li><strong>Dónde están los datos.</strong> La base de datos principal de Wapzen está en Singapur, sus servidores en Singapur y Alemania, y proveedores de IA como OpenAI pueden tratar los mensajes en Estados Unidos. Tómalo en cuenta en tu aviso de privacidad. Wapzen no publica un contrato estándar de encargado: si lo necesitas, escríbenos antes de vincular tu número. Más detalles en la <Link href="/privacy">política de privacidad</Link>, en inglés.</li>
      </ul>
    </>,
  },
  {
    id: "limites",
    q: "¿Qué no puede hacer un chatbot gratis como Wapzen?",
    answer: "El agente de chat no envía PDF ni imágenes, no confirma pagos por SPEI u OXXO, no tiene agenda propia, no escribe primero por su cuenta y no usa la API oficial de Meta, así que no trae insignia verde ni plantillas aprobadas. Cada cuenta tiene un agente de chat. En grupos, solo responde si activas la IA en ese grupo y alguien lo etiqueta o le contesta.",
    body: <>
      <Comparison caption="Para quién sirve y para quién no un chatbot gratis como Wapzen" columns={["¿Te sirve?", "Por qué"]} rows={fit} />
      <ul>
        <li><strong>Fotos y catálogos por liga.</strong> Agrega la liga de cada producto a la información del agente.</li>
        <li><strong>Agenda con integración.</strong> El agente anota la solicitud. Para reservar en una agenda real, conecta tu sistema con una herramienta de API. Revisa <Link href="/es-mx/blog/agendar-citas-por-whatsapp">cómo agendar citas por WhatsApp</Link>.</li>
        <li><strong>Revisa al principio.</strong> Lee los chats de los primeros días y agrega lo que el agente no supo contestar.</li>
      </ul>
      <p>También puedes leer <Link href="/es-mx/blog/como-vender-por-whatsapp">cómo vender por WhatsApp</Link> y la guía de <Link href="/es-mx/blog/ia-para-inmobiliarias-whatsapp">IA para inmobiliarias</Link>.</p>
    </>,
  },
];

export default function ChatbotGratisWhatsAppMxPage() {
  return <QaPost
    href={href}
    heading={<>Chatbot gratis para WhatsApp en México.<br /><span>Ocho opciones comparadas, con precios en pesos.</span></>}
    lead="Muchos chatbots “gratis” para WhatsApp son una prueba de 14 días, un plan sin WhatsApp o un menú sin IA. Aquí respondemos, una por una, las dudas de los negocios en México: qué es gratis de verdad, cuánto cuesta lo demás, cómo crear tu chatbot paso a paso y cómo puede ayudarte a vender más."
    verdict={{
      title: "La respuesta corta",
      body: <>Sí hay un chatbot con IA gratis para WhatsApp en México. <strong>Wapzen</strong> funciona en el número que ya usas, personal o Business: contesta en segundos con la información de tu negocio, entiende notas de voz y fotos, anota pedidos y atiende llamadas de WhatsApp con un agente de voz. <strong>Todo es gratis por ahora, con conversaciones ilimitadas y sin clave de API de Meta.</strong> Si prefieres una herramienta oficial, revisa Meta Business Agent.</>,
    }}
    facts={[["Precio", "Gratis por ahora"], ["Clave de API de Meta", "No hace falta"], ["Conversaciones", "Ilimitadas"], ["Llamadas", "Agente de voz funcionando"]]}
    indexTitle="Las 12 preguntas de esta guía"
    answerLabel="Respuesta corta"
    questions={questions}
    sources={sources}
    related={["/es-mx/blog/como-vender-por-whatsapp", "/es-mx/blog/agente-de-voz-ia-whatsapp-gratis"]}
    product="/es/chatbot-whatsapp-gratis"
    cta={{ heading: <>Tu WhatsApp contestando a cualquier hora.<br /><span>Gratis por ahora, sin API de Meta.</span></>, body: "Crea tu cuenta, vincula tu número y enséñale al agente cómo funciona tu negocio. Sin tarjeta y sin tarifa por mensaje." }}
  />;
}
