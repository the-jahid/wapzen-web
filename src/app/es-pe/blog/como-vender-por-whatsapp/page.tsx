import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Búsquedas (autocompletado de Google, YouTube y DuckDuckGo con gl=pe, 2026-11-12, ver
// docs/seo-research.md, "Peru posts"): "como vender por whatsapp business" (40, 3/3), "como
// vender por whatsapp" (37, 3/3), "ventas por whatsapp" (30, 3/3), "vender por whatsapp" (29,
// 3/3), "catálogo whatsapp business" (29, 3/3), "bot de whatsapp gratis" (70, 3/3). El comercio
// es el grupo más grande de mypes del país (44.2%, Produce 2024).
// Texto: "gratis para empezar" y "empieza gratis", nunca "gratis para siempre", "ilimitado"
// ni "S/ 0 al mes": desde el 2026-11-12 el servidor da una prueba gratis por cuenta
// (FREE_TRIAL_REPLIES) y luego pide un plan de pago. A pedido del usuario no se menciona
// ningún límite ni riesgo de bloqueo. Sigue diciendo que Wapzen no es un producto oficial
// de Meta y que no envía campañas (Bulk Messages se quitó el 2026-11-07). Los nombres de
// menú de WhatsApp Business ("Herramientas para la empresa", "Respuestas rápidas") no se
// revisaron en un teléfono en esta fecha. La Ley 32495 se leyó en El Peruano; su reglamento
// seguía en proyecto en julio de 2026, por eso el texto pide consultar a Indecopi.
// Tarifas de Meta: lista del 1 de octubre de 2026 vía Zernio; revisar cada trimestre.
const href = "/es-pe/blog/como-vender-por-whatsapp";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es-PE", article: { publishedTime: post.published, modifiedTime: post.updated } });

const replies = [
  ["Respuestas rápidas", "Tú, con un atajo de teclado", "Un texto guardado", "Solo cuando estás con el celular en la mano"],
  ["Mensaje de ausencia", "WhatsApp Business, solo", "Siempre el mismo texto", "Avisa que no estás, pero no responde la pregunta"],
  ["Agente de IA", "El agente, solo", "La respuesta a lo que el cliente preguntó", "A toda hora, y con varios chats a la vez"],
];

const costs = [
  ["Para empezar", "Plataforma de pago, casi siempre en dólares, y aprobación de Meta", "Gratis y sin tarjeta"],
  ["Tarifa de Meta por respuesta al cliente", "1,000 gratis al mes por número; luego US$0.030 cada una", "No aplica: no usa la API de Meta"],
  ["Promoción a 500 clientes", "500 × US$0.0703 = US$35.15 por envío", "No envía campañas"],
  ["Tipo de número", "Número registrado en la API", "Personal o de WhatsApp Business"],
  ["Clave de API y plantillas aprobadas", "Necesarias", "No hacen falta"],
  ["Insignia verde y canal oficial de Meta", "Sí", "No"],
];

const fit = [
  ["Tienda de ropa, calzado o accesorios que vende por redes y WhatsApp", "Sí", "Responde tallas, precios y envíos a cualquier hora"],
  ["Emprendimiento de una persona que atiende mientras produce o despacha", "Sí", "El agente responde mientras tú trabajas"],
  ["Negocio que paga anuncios que abren WhatsApp", "Sí", "Cada clic recibe respuesta en segundos"],
  ["Tienda que quiere carrito, pasarela de pago y control de stock", "No", "Eso es una tienda online: el agente la complementa"],
  ["Empresa que quiere mandar campañas masivas con plantillas", "No", "Eso se hace con la API oficial de Meta"],
];

const prompt = `Eres la asistente virtual de Tienda Demo, ropa para mujer en Gamarra, La Victoria, Lima.
Di en tu primer mensaje que eres una asistente virtual.
Responde en español, con mensajes cortos de dos o tres frases, y haz una sola pregunta a la vez.
Para productos, precios, tallas, colores y stock, usa solo la lista que te dimos. Si no tienes un dato, dilo y ofrece que el equipo responda.
Nunca inventes descuentos, stock ni fechas de entrega.
Envíos: en Lima Metropolitana, delivery a S/ 10, de uno a dos días hábiles. A provincias, por agencia: S/ 12, de dos a tres días hábiles.
Formas de pago: Yape, Plin o transferencia. En Lima también contraentrega. Tú no confirmas pagos: pide la captura y avisa que el equipo la revisa en horario de atención.
Para tomar un pedido: pregunta producto, talla y color, nombre completo, y distrito o ciudad de entrega. Repite el pedido con el total y pide que lo confirme.
Cambios: dentro de los 7 días, con la prenda sin uso y con su etiqueta. Para un cambio o un reclamo, avisa que una persona del equipo responderá por este chat.
No pidas datos de tarjeta, contraseñas ni códigos de verificación.
Horario del equipo: lunes a sábado de 9:00 a 19:00.`;

const turns = [
  { from: "patient" as const, text: "Hola, ¿tienen la casaca jean en talla M? ¿Hacen envíos a Arequipa?" },
  { from: "agent" as const, text: "¡Hola! Soy la asistente virtual de Tienda Demo. Sí, tenemos la casaca jean en M y cuesta S/ 89. A Arequipa enviamos por agencia: S/ 12, y llega en dos a tres días hábiles. ¿Te la separo?" },
  { from: "patient" as const, text: "Sí. ¿Cómo pago?" },
  { from: "agent" as const, text: "Puedes pagar con Yape, Plin o transferencia. ¿Me das tu nombre completo y en qué ciudad recoges?" },
  { from: "patient" as const, text: "Lucía Mamani, recojo en agencia en Arequipa" },
  { from: "agent" as const, text: "Confirmo: 1 casaca jean talla M, S/ 89 + S/ 12 de envío = S/ 101, a nombre de Lucía Mamani, con recojo en agencia en Arequipa. ¿Está correcto?" },
  { from: "patient" as const, text: "Sí, correcto" },
  { from: "agent" as const, text: "¡Listo, Lucía! Tu pedido quedó anotado. Envía la captura de tu pago por aquí; el equipo la revisa mañana desde las 9:00 y te manda los datos de tu envío." },
];

const sources = [
  { label: "Andina: las mypes por sector en 2024, según el Ministerio de la Producción (mayo de 2025)", href: "https://andina.pe/agencia/noticia-peru-numero-empresas-formales-crecio-2024-y-suman-234-millones-1029970.aspx" },
  { label: "El Peruano: mypes impulsan el comercio digital, con datos del Observatorio Ecommerce de Capece (mayo de 2026)", href: "https://elperuano.pe/noticia/296015-mypes-impulsan-el-comercio-digital" },
  { label: "Gestión: estudio Comportamiento digital de Ipsos Perú (enero de 2024)", href: "https://gestion.pe/economia/empresas/ipsos-peru-internet-redes-sociales-facebook-tik-tok-whatsapp-redes-sociales-facebook-ya-no-es-el-favorito-y-uso-se-centra-al-amanecer-noticia/" },
  { label: "Forbes Perú: resultados de Credicorp y usuarios de Yape (mayo de 2026)", href: "https://forbes.pe/negocios/2026-05-15/utilidad-neta-de-credicorp-alcanzo-los-s-2-063-millones-durante-el-primer-trimestre-y-crecio-un-161/" },
  { label: "Meta: precios de la plataforma de WhatsApp Business", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Zernio: tarifas de WhatsApp por país, lista del 1 de octubre de 2026", href: "https://zernio.com/whatsapp-api-pricing" },
  { label: "El Peruano: Indecopi confirma multa por enviar publicidad sin consentimiento (marzo de 2026)", href: "https://elperuano.pe/noticia/292050-indecopi-confirma-multa-a-claro-por-enviar-publicidad-sin-consentimiento" },
  { label: "El Peruano: Ley N.° 32495, Libro de Reclamaciones en plataformas de comercio electrónico (noviembre de 2025)", href: "https://elperuano.pe/noticia/282787-plataformas-de-comercio-electronico-deberan-contar-con-libro-de-reclamaciones" },
  { label: "El Peruano: el Libro de Reclamaciones y la plataforma gratuita de Indecopi (diciembre de 2025)", href: "https://elperuano.pe/noticia/284176-mas-orden-mas-clientes-activa-tu-libro-de-reclamaciones-sin-pagar-un-sol" },
  { label: "Gob.pe: Decreto Supremo N.° 016-2024-JUS, reglamento de la Ley 29733", href: "https://www.gob.pe/institucion/anpd/normas-legales/6554453-16-2024-jus" },
];

const questions = [
  {
    id: "sin-tienda",
    q: "¿Se puede vender por WhatsApp en Perú sin tener tienda online?",
    answer: "Sí. Para vender por WhatsApp en Perú necesitas la app WhatsApp Business, que es gratis, un catálogo con fotos y precios, una forma de cobrar como Yape o Plin, y una forma de entregar. No hace falta una página web para empezar. Lo que más ventas decide es responder rápido, y eso se puede dejar a un agente de IA.",
    body: <>
      <p>El comercio es el grupo de negocios más grande del país: según el Ministerio de la Producción, el 44.2% de las mypes formales del Perú, más de un millón de empresas, se dedica a vender. Y la Cámara Peruana de Comercio Electrónico cuenta más de 335,000 empresas que ya venden en línea.</p>
      <p>El chat es donde se cierra la venta. En el estudio Comportamiento digital de Ipsos Perú (trabajo de campo de noviembre de 2023), el 98% de los peruanos urbanos que se conectan a diario usa WhatsApp. El cliente ve tu producto en TikTok, Instagram o Facebook, y te escribe para preguntar precio, talla y envío. Si la respuesta tarda, le escribe a otra tienda.</p>
      <p>Esta guía va en ese orden: primero cómo armar tu WhatsApp para vender, luego cómo cobrar y entregar, y al final cómo un agente de IA como <strong>Wapzen</strong>, que puedes <strong>empezar a usar gratis</strong>, responde por ti a cualquier hora.</p>
    </>,
  },
  {
    id: "pasos",
    q: "¿Cómo vender por WhatsApp Business paso a paso?",
    answer: "En siete pasos: instala WhatsApp Business y completa tu perfil, arma el catálogo con fotos y precios en soles, define cómo cobras, define cómo entregas, prepara tu mensaje de bienvenida y tus respuestas rápidas, lleva gente a tu chat con un enlace o un código QR, y responde rápido, con un agente de IA si no das abasto.",
    body: <>
      <ol>
        <li><strong>Instala WhatsApp Business y completa el perfil.</strong> Nombre del negocio, rubro, horario, dirección o distrito, y una descripción de lo que vendes. Puedes usar el número que ya tienes.</li>
        <li><strong>Arma el catálogo.</strong> Una foto clara por producto, precio en soles y una descripción con tallas, colores o medidas. Más abajo te decimos <a href="#catalogo">qué debe tener</a>.</li>
        <li><strong>Define cómo cobras.</strong> Yape, Plin, transferencia o contraentrega, y quién revisa los pagos.</li>
        <li><strong>Define cómo entregas.</strong> Delivery propio o por aplicativo en tu ciudad, y agencia o courier para provincias, con costos y plazos escritos.</li>
        <li><strong>Prepara tus respuestas.</strong> En Herramientas para la empresa activas el mensaje de bienvenida, guardas respuestas rápidas para precio, envío y formas de pago, y usas etiquetas como “nuevo”, “pago pendiente” y “enviado”.</li>
        <li><strong>Lleva gente a tu chat.</strong> Pon tu enlace de WhatsApp en la biografía de Instagram y TikTok, y un código QR en tu local, tus bolsas y tus volantes. Puedes crearlos gratis con el <Link href="/tools/whatsapp-link-generator">generador de enlaces</Link> y el <Link href="/tools/whatsapp-qr-code-generator">generador de QR</Link>, en inglés.</li>
        <li><strong>Responde rápido.</strong> Es el paso que más cuesta cuando el negocio crece. Mira <a href="#responder">las tres formas de hacerlo</a>.</li>
      </ol>
    </>,
  },
  {
    id: "catalogo",
    q: "¿Qué debe tener tu catálogo de WhatsApp Business?",
    answer: "Cada producto necesita una foto real y clara, un nombre que el cliente reconozca, el precio final en soles y una descripción con lo que siempre preguntan: tallas, colores, medidas, material y si hay stock. Agrupa los productos en colecciones y retira lo agotado, para que el cliente no pida algo que ya no tienes.",
    body: <>
      <ul>
        <li><strong>Fotos tuyas, no de internet.</strong> El cliente compra lo que ve. Una foto con buena luz vende más que un diseño recargado.</li>
        <li><strong>Precio final.</strong> Pon el precio que el cliente va a pagar, y aclara aparte el costo de envío.</li>
        <li><strong>La descripción responde antes que tú.</strong> Tallas disponibles, medidas en centímetros, colores y material.</li>
        <li><strong>Colecciones.</strong> “Casacas”, “Polos”, “Ofertas”: así el cliente encuentra sin preguntar.</li>
      </ul>
      <p>Un dato para cuando uses un agente de IA: el agente de Wapzen no lee el catálogo de tu app. Aprende de la lista de productos que le subes en texto, PDF o Word, y de tu página web si tienes una. Usa la misma lista para los dos, y actualízala cuando cambie un precio o se agote una talla.</p>
    </>,
  },
  {
    id: "cobrar",
    q: "¿Cómo cobrar por WhatsApp: Yape, Plin, transferencia o contraentrega?",
    answer: "Lo más común en Perú es cobrar con Yape o Plin: confirmas el total, el cliente paga, te envía la captura y tú revisas en tu aplicación que el dinero llegó antes de despachar. También puedes aceptar transferencia y, dentro de tu ciudad, contraentrega. Nunca despaches solo con la captura.",
    body: <>
      <p>Yape tiene 16.4 millones de usuarios activos al mes, según los resultados de Credicorp de 2026. Tu cliente casi seguro lo tiene. El flujo que funciona:</p>
      <ol>
        <li><strong>Confirma el pedido con el total,</strong> incluido el envío.</li>
        <li><strong>Envía tu número o tu código QR de cobro.</strong> Que el nombre que aparece al pagar sea el de tu negocio o el tuyo, y avísalo.</li>
        <li><strong>Pide la captura</strong> y revisa el abono en tu aplicación. Una captura se puede editar; el abono en tu app, no.</li>
        <li><strong>Despacha y avisa.</strong> Envía la foto del paquete y los datos del envío.</li>
      </ol>
      <Note>Un agente de IA puede recibir y leer la captura, pero no entra a tu Yape ni a tu banco. Confirmar el pago es siempre tarea de una persona. La boleta o factura también la emites tú, con tu sistema de siempre.</Note>
    </>,
  },
  {
    id: "responder",
    q: "¿Cómo responder rápido cuando llegan muchos mensajes?",
    answer: "Hay tres formas. Las respuestas rápidas de WhatsApp Business ahorran escribir, pero dependen de que estés con el celular. El mensaje de ausencia avisa que no estás, sin responder la pregunta. Un agente de IA lee lo que el cliente preguntó y responde con tus precios, tallas y envíos, a cualquier hora y en varios chats a la vez.",
    body: <>
      <Comparison caption="Tres formas de responder rápido en WhatsApp" columns={["Quién responde", "Qué envía", "Cuándo sirve"]} rows={replies} />
      <p>Así conversa un agente de IA, en el ejemplo de una tienda inventada:</p>
      <ChatExample
        business="Tienda Demo"
        labels={{ subtitle: "WhatsApp · agente de IA", agent: "Agente: ", patient: "Cliente: " }}
        turns={turns}
        caption="Conversación ilustrativa de una tienda ficticia, un domingo a las 10 de la noche. Los precios, las tallas y los envíos salen de la lista y las instrucciones que sube la tienda."
        points={[
          { title: "Vende fuera de horario", body: "La clienta escribió cuando la tienda estaba cerrada, y el pedido quedó anotado igual." },
          { title: "Usa tu lista", body: "Precio, talla y costo de envío salen de lo que le diste. Si no tiene el dato, lo dice." },
          { title: "Confirma antes de guardar", body: "Repite el pedido con el total, y solo lo guarda cuando la clienta confirma." },
          { title: "No confirma el pago", body: "Pide la captura, pero el equipo revisa el abono al día siguiente." },
        ]}
      />
    </>,
  },
  {
    id: "vender-mas",
    q: "¿Cómo ayuda Wapzen a vender más por WhatsApp?",
    answer: "De cuatro formas. Responde en segundos, también de noche y los domingos. Atiende varios chats a la vez en campañas y fechas pico. Anota cada pedido confirmado en tu panel, con el nombre y el número del cliente. Y envía fotos o el catálogo en PDF cuando se lo piden.",
    body: <>
      <ul>
        <li><strong>Tus anuncios rinden más.</strong> Si pagas anuncios de Facebook, Instagram o TikTok que abren WhatsApp, cada mensaje sin respuesta es un clic pagado que se pierde. Con el agente, quien escribe a las 11 de la noche recibe respuesta al momento.</li>
        <li><strong>Las fechas pico no te desbordan.</strong> En Día de la Madre, Fiestas Patrias, los Cyber o Navidad, el agente atiende varios chats a la vez mientras tú empacas.</li>
        <li><strong>La conversación se vuelve pedido.</strong> Con la herramienta Take Order, el agente reúne producto, talla, nombre y lugar de entrega, repite el resumen y lo guarda en la página Orders cuando el cliente confirma.</li>
        <li><strong>Envía fotos y archivos.</strong> En Images & Files subes fotos de tus productos, la guía de tallas o el catálogo en PDF, con una nota de cuándo enviarlos.</li>
        <li><strong>Entiende audios y fotos.</strong> Si el cliente manda un audio o la foto del modelo que vio en TikTok, el agente lo entiende y responde por texto.</li>
        <li><strong>Lee tu página web.</strong> Si ya tienes una tienda online, el agente puede leerla para responder con esos datos.</li>
        <li><strong>Aprendes de tus chats.</strong> Todas las conversaciones quedan en tu panel. Las preguntas que más se repiten te dicen qué falta en tus publicaciones.</li>
      </ul>
      <h3>Haz la cuenta con tus números</h3>
      <p>Esto es un ejemplo, no una promesa. Cuenta cuántos mensajes te llegaron fuera de horario la semana pasada y cambia los valores:</p>
      <ul>
        <li>12 consultas fuera de horario al día × 30 días = <strong>360 consultas al mes</strong>.</li>
        <li>Si 1 de cada 10 se vuelve venta = <strong>36 ventas</strong>.</li>
        <li>Con un ticket promedio de S/ 80 = <strong>S/ 2,880 al mes</strong> que hoy dependen de que alguien esté despierto para responder.</li>
      </ul>
      <InlineCta title="Tu WhatsApp vendiendo a cualquier hora" body="Empieza gratis: sin tarjeta, sin clave de API de Meta y en el número que ya tienes." label="Empieza gratis" />
    </>,
  },
  {
    id: "gratis",
    q: "¿Hay un chatbot gratis para vender por WhatsApp en Perú?",
    answer: "Sí. Wapzen es un agente de IA para WhatsApp que puedes empezar a usar gratis y sin tarjeta, en tu número personal o de WhatsApp Business. No usa la API oficial de Meta, así que no hay clave de API, plantillas ni tarifa de Meta por mensaje. Con la API oficial, Meta cobra en Perú US$0.030 por respuesta después de las primeras 1,000 al mes.",
    body: <>
      <Comparison caption="Responder a clientes por WhatsApp en Perú: API oficial frente a Wapzen" columns={["API oficial de WhatsApp Business", "Wapzen"]} rows={costs} />
      <h3>Un ejemplo con números</h3>
      <p>Una tienda que atiende 40 conversaciones al día, con 6 respuestas en promedio, envía <strong>7,200 respuestas al mes</strong>:</p>
      <ul>
        <li>Se descuentan las 1,000 gratis: quedan 6,200 respuestas.</li>
        <li>6,200 × US$0.030 = <strong>US$186 al mes solo para Meta</strong>, unos S/ 642 con el dólar a S/ 3.45, antes de pagar la plataforma y la IA.</li>
        <li><strong>Con Wapzen:</strong> US$0 en tarifas de Meta, porque tu número se conecta como dispositivo vinculado, igual que WhatsApp Web.</li>
      </ul>
      <Note>Tarifas de Meta en dólares de la lista del 1 de octubre de 2026; Meta las revisa cada trimestre. El tipo de cambio es referencial. Si necesitas campañas con plantillas aprobadas o la insignia verde, la API oficial es el camino.</Note>
    </>,
  },
  {
    id: "promociones",
    q: "¿Puedo enviar promociones por WhatsApp a mis clientes?",
    answer: "Sí, pero solo a quienes aceptaron recibirlas. El artículo 58.1, literal e, del Código de Protección y Defensa del Consumidor prohíbe enviar comunicaciones comerciales sin el consentimiento previo del consumidor. Pide ese permiso en el chat, guarda la respuesta y deja de escribirle a quien te lo pida.",
    body: <>
      <ul>
        <li><strong>Pide permiso al cerrar la venta.</strong> Por ejemplo: “¿Quieres que te avisemos por aquí cuando lleguen nuevos modelos?”.</li>
        <li><strong>Usa las herramientas de la app.</strong> Los estados y las listas de difusión de WhatsApp Business sirven para avisar a tus clientes. Una lista de difusión solo llega a quienes guardaron tu número.</li>
        <li><strong>Respeta el “no”.</strong> En marzo de 2026, Indecopi confirmó una multa de 10.44 UIT (S/ 57,420) a una operadora por enviar mensajes publicitarios a un cliente sin su consentimiento.</li>
      </ul>
      <p>Wapzen no envía campañas: su agente responde a quien te escribe. Cuando un cliente contesta a tu promoción, el agente sigue la conversación con tus precios y tus reglas.</p>
    </>,
  },
  {
    id: "persona",
    q: "¿Qué pasa con los cambios, los reclamos o el cliente que pide hablar con alguien?",
    answer: "Los atiendes tú. Cada conversación del panel de Wapzen tiene un interruptor de IA: lo apagas y el agente deja de responderle solo a ese cliente, mientras sigue con los demás. En las instrucciones defines qué pasa a una persona: cambios, devoluciones, reclamos y pedidos especiales.",
    body: <>
      <ol>
        <li><strong>Escribe tu política de cambios</strong> en las instrucciones, con plazos y condiciones. El agente la explica, pero no aprueba cambios por su cuenta.</li>
        <li><strong>Apaga la IA en ese contacto</strong> y responde tú, desde el panel o desde el celular. Al terminar, vuelve a encenderla.</li>
        <li><strong>Ten Libro de Reclamaciones.</strong> Los reclamos se responden en un plazo máximo de 15 días hábiles, y la plataforma “Tu Libro de Reclamaciones” de Indecopi permite tenerlo en formato virtual sin costo.</li>
      </ol>
      <p>El agente no te avisa cuando alguien pide a una persona. Revisa los chats varias veces al día, o indica en las instrucciones en qué horario responde el equipo.</p>
    </>,
  },
  {
    id: "reglas",
    q: "¿Qué reglas aplican en Perú a quien vende por WhatsApp?",
    answer: "Las del Código de Protección y Defensa del Consumidor, aunque vendas solo por chat: información cierta sobre precio y producto, consentimiento para la publicidad y Libro de Reclamaciones. Desde noviembre de 2025, la Ley 32495 extiende el Libro de Reclamaciones a las plataformas digitales de comercio electrónico. También aplica la Ley 29733 de datos personales.",
    body: <>
      <p>Esto es orientación general, no asesoría legal:</p>
      <ul>
        <li><strong>Lo que ofreces te compromete.</strong> El precio, el stock y el plazo de entrega que da tu agente son información al consumidor. Mantén la lista al día.</li>
        <li><strong>Libro de Reclamaciones.</strong> La Ley 32495, publicada el 11 de noviembre de 2025, obliga a las plataformas digitales de comercio electrónico a tener el libro con un enlace visible. Su reglamento todavía se estaba actualizando en 2026: si vendes solo por redes y WhatsApp, consulta a Indecopi cómo te aplica.</li>
        <li><strong>Datos personales.</strong> Pide solo lo que necesitas para vender y entregar. La base de datos principal de Wapzen está en Singapur, sus servidores en Singapur y Alemania, los archivos de Images & Files se guardan en Corea del Sur, y los proveedores de IA pueden procesar mensajes en Estados Unidos. Los detalles están en la <Link href="/privacy">política de privacidad</Link>, en inglés.</li>
        <li><strong>Asistente virtual.</strong> Wapzen no agrega ese aviso por su cuenta: ponlo en las instrucciones, como en el ejemplo de abajo.</li>
      </ul>
    </>,
  },
  {
    id: "no-hace",
    q: "¿Qué no hace Wapzen?",
    answer: "No confirma pagos de Yape, Plin ni transferencias, no emite boletas, no descuenta stock, no rastrea envíos y no escribe primero a tus clientes ni envía campañas. Tampoco es un producto oficial de Meta, así que no trae insignia verde ni plantillas aprobadas. Es un agente que responde y anota pedidos; cobrar y despachar sigue siendo tu trabajo.",
    body: <>
      <Comparison caption="Para qué negocios sirve un agente de IA de WhatsApp como Wapzen" columns={["¿Te sirve?", "Por qué"]} rows={fit} />
      <ul>
        <li><strong>Stock:</strong> el agente responde con la lista que le diste. Si se agota una talla, actualiza la lista.</li>
        <li><strong>Pedidos ya anotados:</strong> el agente no los consulta ni los cancela después. Eso lo ve tu equipo en Orders.</li>
        <li><strong>Se conecta como dispositivo vinculado,</strong> igual que WhatsApp Web. Conservas tus chats y sigues usando tu celular.</li>
        <li><strong>El panel está en inglés;</strong> el agente responde en español.</li>
        <li>Wapzen es un producto independiente: no pertenece a Meta ni a WhatsApp.</li>
      </ul>
    </>,
  },
  {
    id: "empezar",
    q: "¿Cómo empiezo a vender por WhatsApp con un agente de IA?",
    answer: "Creas tu cuenta gratis en Wapzen, vinculas tu número con un código de vinculación desde el celular o con un código QR desde la computadora, le pones nombre al agente, pegas tus instrucciones, subes tu lista de productos y activas Take Order. Después haces una compra de prueba desde otro número.",
    body: <>
      <ol>
        <li><strong>Crea tu cuenta gratis.</strong> Sin tarjeta y sin clave de API.</li>
        <li><strong>Ten listas las instrucciones.</strong> El agente empieza a responder en cuanto vinculas el número, así que adapta antes el ejemplo de abajo.</li>
        <li><strong>Vincula tu número.</strong> En New chat agent escribes tu número y recibes un código de 8 caracteres. En WhatsApp: Dispositivos vinculados → Vincular un dispositivo → Vincular con el número de teléfono. En una computadora también puedes escanear el código QR.</li>
        <li><strong>Sube tu lista de productos</strong> con precios, tallas y colores, en texto, PDF o Word. Las fotos y el catálogo para enviar van en Images & Files.</li>
        <li><strong>Activa Take Order</strong> y escribe qué datos debe pedir para cada venta.</li>
        <li><strong>Haz una compra de prueba</strong> desde otro número. Pregunta lo difícil: una talla agotada, un envío a provincia, un cambio. Ajusta las instrucciones hasta que responda como tú.</li>
      </ol>
      <p>Estas instrucciones son de una tienda inventada. Cámbialas por las de tu negocio:</p>
      <pre>{prompt}</pre>
    </>,
  },
];

export default function ComoVenderPorWhatsAppPePage() {
  return <QaPost
    href={href}
    heading={<>Cómo vender por WhatsApp Business en Perú.<br /><span>Paso a paso, con IA y gratis para empezar.</span></>}
    lead="En el Perú se vende por chat: el cliente ve el producto en redes y escribe por WhatsApp para preguntar precio, talla y envío. Aquí respondemos, una por una, las preguntas de tiendas y emprendedores: cómo armar el catálogo, cómo cobrar con Yape o Plin, cómo responder rápido y cómo un agente de IA atiende y anota pedidos mientras tú trabajas."
    verdict={{
      title: "La respuesta corta",
      body: <>Para vender por WhatsApp en Perú necesitas WhatsApp Business, un catálogo claro, un cobro simple con Yape o Plin y respuestas rápidas. Lo último es lo más difícil de sostener, y ahí ayuda <strong>Wapzen</strong>: un agente de IA que responde a tus clientes a cualquier hora con tus precios, envía fotos y anota los pedidos. <strong>Empiezas gratis y sin tarjeta</strong>, sin clave de API de Meta y sin tarifas de Meta por mensaje.</>,
    }}
    facts={[["Precio", "Gratis para empezar"], ["Tarjeta", "No hace falta"], ["Número", "Personal o Business"], ["Cobro", "Yape, Plin o como tú cobres"]]}
    indexTitle="Las 12 preguntas de esta guía"
    answerLabel="Respuesta"
    questions={questions}
    sources={sources}
    related={["/es-pe/blog/chatbot-whatsapp-para-restaurantes", "/es-pe/blog/ia-para-agencias-de-viajes-y-hoteles"]}
    product="/es/chatbot-whatsapp-gratis"
    cta={{ heading: <>Tu tienda responde WhatsApp sola.<br /><span>Empieza gratis hoy.</span></>, body: "Crea tu agente de IA, súbele tu lista de productos y vincula tu número en minutos. Sin tarjeta y sin API de Meta." }}
  />;
}
