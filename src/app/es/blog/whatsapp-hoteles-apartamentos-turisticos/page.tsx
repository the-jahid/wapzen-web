import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Búsquedas (autocompletado Google, YouTube y DuckDuckGo con gl=es, 2026-11-04, ver
// docs/seo-research.md, "Spain buyer posts"): "ia para hoteles" (30, 3/3), "whatsapp para
// hoteles" (20), "chatbot whatsapp hotel", "whatsapp casa rural", "software apartamentos
// turisticos" (10 cada una). Demanda menor (219) que otros sectores: elegido por capacidad
// de pago (comisiones de Booking, reclamación de CEHAT) y encaje (huéspedes extranjeros a
// cualquier hora). A pedido del usuario (2026-11-04): siempre gratis, sin clave de API de
// Meta, agente de voz funcionando, sin nota sobre bloqueos de número y sin mencionar el
// límite por hora. El servidor mantiene HOURLY_REPLY_LIMIT = 100, así que el texto dice
// "conversaciones ilimitadas" y "sin límite mensual", nunca "respuestas ilimitadas". RD
// 933/2021 leído en el BOE. No hay cifra verificada de la comisión de Booking: el 15 % es
// un supuesto y el texto lo dice. El agente de voz tiene un idioma por agente
// (agents.language); el de chat sigue el idioma del huésped si se le indica.
const href = "/es/blog/whatsapp-hoteles-apartamentos-turisticos";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hola, quiero activar el agente de voz de Wapzen en mi alojamiento en España.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es", article: { publishedTime: post.published, modifiedTime: post.updated } });

const answers = [
  ["“What time is check-in?”", "Sí", "Con tus horarios de entrada y salida"],
  ["“How do we get there from the airport?”", "Sí", "Con tus indicaciones"],
  ["“Y a-t-il un parking ?”", "Sí", "Con precios y ubicación, si se los das"],
  ["“Gibt es eine Kurtaxe?”", "Sí", "Con la tasa turística que corresponda a tu destino"],
  ["“¿Puedo salir más tarde el domingo?”", "En parte", "Anota la petición y tu equipo la confirma"],
  ["“¿Tenéis libre del 12 al 15?”", "En parte", "Comparte tu motor de reservas o consulta tu PMS con una herramienta de API"],
  ["“What's the door code?”", "No", "Los códigos los envías tú o tu PMS"],
];

const pms = [
  ["Responder en WhatsApp a preguntas abiertas, en varios idiomas", "Según el programa y sus módulos", "Sí"],
  ["Atender llamadas de WhatsApp con voz de IA", "Según el programa y sus módulos", "Sí"],
  ["Calendario, tarifas y sincronización con Booking y Airbnb", "Sí", "No"],
  ["Mensajes dentro de Booking y Airbnb", "Según el programa", "No"],
  ["Registro de viajeros y cobros", "Sí, directamente o con un socio", "No"],
];

const costs = [
  ["Plataforma", "Según el proveedor. En Callbell: 93 € al mes con un agente, cuenta de WhatsApp y creador de bots", "0 €, siempre"],
  ["Respuestas a huéspedes", "1.000 gratis al mes por número; después, 0,0166 € cada una", "0 €, sin límite mensual"],
  ["Avisos antes de la llegada", "0,0166 € cada uno", "0 €"],
  ["Ofertas a antiguos huéspedes", "0,0585 € cada una", "0 €"],
  ["API de Meta y clave de acceso", "Necesarias", "No hacen falta"],
];

const fit = [
  ["Gestor de apartamentos turísticos con preguntas repetidas", "Sí", "Contesta en varios idiomas y a cualquier hora"],
  ["Hotel pequeño, hostal o casa rural sin recepción las 24 horas", "Sí", "Atiende de noche y deja las peticiones para tu equipo"],
  ["Alojamiento que quiere más consultas directas", "Sí", "Responde al momento y comparte tu motor de reservas"],
  ["Hotel que quiere reservar y cobrar sin pasar por un sistema", "No", "El agente no cobra ni confirma reservas por sí solo"],
  ["Quien busca responder dentro de Booking o Airbnb", "No", "Wapzen atiende tu número de WhatsApp, no esas bandejas"],
  ["Cadena que necesita insignia verde o plantillas aprobadas", "No", "Eso solo existe en la API oficial de Meta"],
];

const prompt = `Eres el asistente virtual de Apartamentos Demo, en el centro de Málaga.
Responde siempre en el idioma en que te escriba el huésped: español, inglés, francés, alemán u otro. Usa dos o tres frases y haz una sola pregunta cada vez.
Di en tu primer mensaje que eres un asistente virtual.
Responde sobre horarios de entrada y salida, cómo llegar, aparcamiento, equipaje, normas, servicios, tasa turística y la zona solo con la información que te hemos dado. Si no tienes un dato, dilo y avisa de que el equipo responderá por este chat.
Para salidas tardías, entradas anticipadas, cunas o averías, anota la petición y avisa de que el equipo la confirmará. No la des por confirmada.
Si te piden disponibilidad o precio, comparte este enlace de reservas: [enlace]. No inventes precios ni confirmes reservas.
Para el registro de viajeros, comparte este enlace: [enlace]. No pidas pasaporte, DNI ni datos de tarjeta por este chat.
Nunca des códigos de puerta, datos de llaves ni información de otras reservas.
Si alguien describe una emergencia, dile que llame al 112. Teléfono del equipo: [teléfono].
Si alguien contesta a un aviso de llegada, ayúdale con su pregunta.`;

const preArrival = `Hi {{nombre}}, we're looking forward to seeing you at Apartamentos Demo on {{fecha}}. Reply here with your arrival time, or ask us anything about parking, luggage or the area. Our virtual assistant answers at any hour.`;

const sources = [
  { label: "INE: Frontur, turistas internacionales en 2025", href: "https://ine.es/dyngs/Prensa/FRONTUR1225.htm" },
  { label: "PPC Land: Estudio de Redes Sociales 2026 de IAB Spain", href: "https://ppc.land/spains-social-media-users-jump-to-7-2-platforms-but-42-quit-at-least-one/" },
  { label: "CEHAT: reclamación frente a Booking, diciembre de 2025", href: "https://cehat.com/wp-content/uploads/2025/12/17122025-Reclamacion-frente-a-Booking.pdf" },
  { label: "Genbeta: la demanda de los hoteles y la multa de la CNMC a Booking", href: "https://www.genbeta.com/actualidad/booking-web-usada-para-buscar-alojamientos-hoteles-estan-hartos-espana-se-han-unido-para-demandarla" },
  { label: "BOE: Real Decreto 933/2021 sobre registro de viajeros", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2021-17461" },
  { label: "Chekin: registro de huéspedes en SES.Hospedajes", href: "https://chekin.com/blog/guia-completa-del-registro-de-huespedes-en-ses-hospedajes-todo-lo-que-debes-saber/" },
  { label: "Smoobu: precios", href: "https://www.smoobu.com/es/precios/" },
  { label: "Meta: precios de la plataforma de WhatsApp Business", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Zernio: tarifas de WhatsApp por país, lista del 1 de octubre de 2026", href: "https://zernio.com/whatsapp-api-pricing" },
  { label: "Callbell: precios", href: "https://callbell.eu/en/pricing/" },
  { label: "BOE: Ley 34/2002 (LSSI)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758" },
  { label: "EUR-Lex: Reglamento (UE) 2024/1689 de inteligencia artificial", href: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=es" },
];

const questions = [
  {
    id: "gratis",
    q: "¿Hay un chatbot de WhatsApp gratis para hoteles y apartamentos turísticos?",
    answer: "Sí. Wapzen es un chatbot de WhatsApp con IA siempre gratis para hoteles, apartamentos turísticos, hostales y casas rurales: conversaciones ilimitadas, sin cuota, sin coste por mensaje y sin clave de API de Meta. Responde a tus huéspedes a cualquier hora y en su idioma, en tu propio número, y su agente de voz contesta las llamadas de WhatsApp.",
    body: <>
      <p>Las herramientas para hoteles suelen venderse con presupuesto a medida o suman una plataforma y las tarifas de Meta. <Link href="/es/chatbot-whatsapp-gratis">Wapzen</Link> vincula el número que ya usa tu alojamiento como un dispositivo, igual que WhatsApp Web. Por eso no necesitas la API de WhatsApp Business, un proveedor ni la aprobación de Meta.</p>
      <p>Tu equipo sigue usando WhatsApp en el móvil, y los huéspedes escriben al número de siempre. La IA viene incluida, las conversaciones son ilimitadas y no hay tope mensual de respuestas: una temporada alta con más preguntas no te cuesta más.</p>
    </>,
  },
  {
    id: "por-que",
    q: "¿Por qué necesita WhatsApp con IA un alojamiento en España?",
    answer: "Porque los huéspedes preguntan a cualquier hora y en varios idiomas. España recibió 96,8 millones de turistas internacionales en 2025, según el INE, un récord, con Reino Unido, Francia y Alemania a la cabeza. Un alojamiento sin recepción permanente no puede contestar a todos a medianoche, y muchas de esas preguntas se repiten.",
    body: <>
      <p>Esos turistas gastaron 134.712 millones de euros en 2025, un 6,8 % más que el año anterior. Para un hotel pequeño o un gestor de apartamentos, ese volumen se traduce en muchas dudas iguales: a qué hora se entra, dónde aparcar, dónde dejar las maletas, cómo llegar desde el aeropuerto.</p>
      <p>Muchos huéspedes ya usan WhatsApp a diario. En España, el Estudio de Redes Sociales 2026 de IAB Spain le da un alcance mensual del 94 % de los internautas. Un viajero que aterriza a las once de la noche y escribe “we’re lost” necesita una respuesta entonces, no cuando abra la oficina.</p>
    </>,
  },
  {
    id: "preguntas",
    q: "¿Qué preguntas de los huéspedes puede responder la IA?",
    answer: "Horarios de entrada y salida, cómo llegar, aparcamiento, consigna de equipaje, normas, servicios, tasa turística y recomendaciones de la zona, siempre con la información que le des. Anota peticiones como una salida tardía o una avería para que tu equipo las confirme. No debe dar códigos de puerta ni cerrar reservas por su cuenta.",
    body: <>
      <Comparison caption="Qué responde un agente de IA en el WhatsApp de un alojamiento turístico" columns={["¿Responde?", "Cómo"]} rows={answers} />
      <p>Prepara un único documento con todo lo que preguntan tus huéspedes. Si tienes varios alojamientos, indica a cuál corresponde cada dato y pide al agente que pregunte primero en cuál se aloja el huésped. Sube también enlaces a tus mapas y fotos, porque el agente responde con texto.</p>
    </>,
  },
  {
    id: "idiomas",
    q: "¿Responde a los huéspedes en inglés, francés y alemán?",
    answer: "Sí, si se lo indicas en sus instrucciones. El agente de chat puede contestar en el idioma en que le escriba cada huésped, sin que tengas que traducir tus documentos a todos los idiomas. Conviene comprobar la calidad con frases reales en cada idioma que recibas antes de ponerlo a trabajar con clientes.",
    body: <>
      <p>Así podría contestar a un huésped británico, con los datos escritos en español en la información del alojamiento:</p>
      <ChatExample
        business="Apartamentos Demo"
        labels={{ subtitle: "WhatsApp · agente de IA", agent: "Agente: ", patient: "Huésped: " }}
        turns={[
          { from: "patient", text: "Hi! We land at 11pm on Friday. Can we still check in?" },
          { from: "agent", text: "Hi! I'm the virtual assistant for Apartamentos Demo in Málaga. Yes, check-in is self-service from 16:00, so arriving late is fine. Our team sends your access details on the day you arrive. Will you need parking?" },
          { from: "patient", text: "Yes please. Is there anywhere nearby?" },
          { from: "agent", text: "Yes, there's a public car park 200 metres away at about €18 a day. You can't reserve a space through us. Is there anything else you'd like to know?" },
          { from: "patient", text: "Can we leave our bags after check-out on Sunday?" },
          { from: "agent", text: "I've noted your request for Sunday. Luggage storage depends on the next booking, so our team will confirm it in this chat tomorrow morning." },
        ]}
        caption="Conversación ilustrativa de un alojamiento inventado. Los datos saldrían de la información que sube el alojamiento."
        points={[
          { title: "Cambia de idioma", body: "Las instrucciones le piden responder en el idioma del huésped, sin que traduzcas nada." },
          { title: "No revela el acceso", body: "Explica que el equipo enviará los datos, sin dar códigos por este chat." },
          { title: "Anota, no promete", body: "Las peticiones que dependen de otra reserva quedan pendientes de confirmar." },
          { title: "Tu equipo lo ve todo", body: "Cada conversación queda en el panel, para confirmar peticiones por la mañana." },
        ]}
      />
    </>,
  },
  {
    id: "seguridad",
    q: "¿Puedo dar códigos de acceso y wifi por el chatbot?",
    answer: "Los códigos de acceso, no. El agente responde a cualquiera que escriba a tu número y no puede comprobar si tiene una reserva, así que puede repetir a cualquier persona lo que pongas en su información. Envía los códigos tú o desde tu PMS o tu sistema de cerradura. Tampoco incluyas contraseñas de wifi que no quieras compartir fuera del alojamiento.",
    body: <>
      <p>Regla sencilla: <strong>pon en la información del agente solo lo que publicarías en tu web</strong>. Esto vale también para los datos de otros huéspedes, sus fechas o sus teléfonos.</p>
      <p>Si conectas una herramienta de API con tu PMS, haz que pida un dato que solo conozca el huésped y limita lo que devuelve. Prueba varios casos, incluso alguien que pregunta por la reserva de otra persona, antes de ponerla en marcha.</p>
    </>,
  },
  {
    id: "directa",
    q: "¿Ayuda a conseguir reservas directas y pagar menos comisiones?",
    answer: "Puede ayudar cuando un cliente ya te escribe: responde al momento y le comparte tu motor de reservas, en lugar de dejarle sin respuesta hasta que vuelva a Booking. No cierra la venta ni cobra por sí solo. Cuánto ahorras depende de tu comisión: con una del 15 %, una estancia de 400 € directa evitaría 60 €.",
    body: <>
      <p>Las comisiones ya preocupan al sector. La CNMC multó a Booking con 413,24 millones de euros en 2024 por abuso de posición dominante en España, una decisión que la empresa ha recurrido. CEHAT, la confederación hotelera española, habla de “comisiones muy elevadas” y dice que más de 900 empresas españolas se han sumado a su reclamación.</p>
      <p>El agente puede ayudar en tres momentos:</p>
      <ul>
        <li><strong>Antes de reservar.</strong> Si alguien llega por tu web, Google Maps o Instagram, responde sus dudas y le pasa tu enlace de reservas.</li>
        <li><strong>Durante la estancia.</strong> Resuelve lo cotidiano y deja una buena impresión con tu propio número.</li>
        <li><strong>Después.</strong> Con su autorización, puedes avisar a antiguos huéspedes de fechas o promociones directas con Bulk Messages.</li>
      </ul>
      <p>El 15 % es un supuesto para el ejemplo: mira tu contrato para saber tu comisión real y lo que te permite ofrecer en tu canal directo.</p>
    </>,
  },
  {
    id: "pms",
    q: "¿Se conecta con mi PMS, con Booking o con Airbnb?",
    answer: "No directamente. Wapzen atiende tu número de WhatsApp, no las bandejas de Booking ni de Airbnb. Los huéspedes te escriben si les das el número: inclúyelo en el correo de confirmación, en tu web y en un código QR dentro del alojamiento. Si tu PMS ofrece una API, una herramienta puede consultar datos durante la conversación.",
    body: <>
      <Comparison caption="Un PMS para alojamientos frente al agente de IA de Wapzen" columns={["PMS", "Wapzen"]} rows={pms} />
      <p>Un PMS como Smoobu parte de 29 € al mes con comisión por reserva, o 35 € sin ella, y cuesta más según las unidades. Wapzen no lo sustituye: te sigue haciendo falta para el calendario y los canales.</p>
      <p>Para que te escriban, crea un <Link href="/tools/whatsapp-link-generator">enlace de WhatsApp</Link> para tu web y tu correo de confirmación, y un <Link href="/tools/whatsapp-qr-code-generator">código QR de WhatsApp</Link> para la habitación o la entrada. Revisa las normas de cada plataforma antes de compartir tu número con alguien que todavía no ha reservado.</p>
      <p>Cuando tu equipo atienda a un huésped en persona, apaga el <strong>interruptor de IA</strong> de esa conversación. El agente deja de contestarle y sigue con los demás. No se apaga solo cuando respondes tú, así que acuérdate de usarlo.</p>
    </>,
  },
  {
    id: "registro",
    q: "¿Puede recoger los datos del registro de viajeros para SES.Hospedajes?",
    answer: "No es buena idea. El Real Decreto 933/2021 obliga a registrar y comunicar datos como el documento de identidad y el medio de pago, y eso pide un sistema preparado, no un chat. Usa tu PMS o una herramienta de check-in como Chekin, y deja que la IA comparta el enlace y explique por qué se piden esos datos.",
    body: <>
      <p>El Real Decreto 933/2021 exige a los alojamientos registrar estos datos, conservarlos tres años y comunicarlos en un plazo máximo de 24 horas. Según Chekin, esa comunicación se hace a través de SES.Hospedajes desde el 2 de diciembre de 2024. Los huéspedes suelen preguntar por qué se les pide tanta información, y ahí el agente sí ayuda: puede explicar el motivo en su idioma y enviar el enlace correcto.</p>
      <ul>
        <li><strong>No pidas pasaportes ni tarjetas por WhatsApp.</strong> Las instrucciones de ejemplo se lo prohíben al agente.</li>
        <li><strong>Deja las fotos apagadas.</strong> Los interruptores de audios y fotos vienen apagados. Activa los audios si los usan tus huéspedes, pero con las fotos podrías recibir un pasaporte.</li>
        <li><strong>Avisa de que es una IA.</strong> El artículo 50 del Reglamento de IA lo exige salvo que resulte evidente, y Wapzen no añade el aviso por su cuenta: inclúyelo en las instrucciones.</li>
        <li><strong>Debes saber dónde están los datos.</strong> La base de datos principal de Wapzen está en Singapur, sus servidores en Singapur y Alemania, y proveedores de IA como OpenAI pueden tratar los mensajes en Estados Unidos. Wapzen no publica un contrato estándar de encargado del tratamiento: si lo necesitas, pregúntanos antes de conectar el número. Más detalles en la <Link href="/privacy">política de privacidad</Link>, en inglés.</li>
      </ul>
      <p>Esto es información general, no asesoramiento legal. La tasa turística y otras normas varían según la comunidad y el municipio.</p>
    </>,
  },
  {
    id: "activar",
    q: "¿Cómo se configura sin clave de API de Meta?",
    answer: "Creas una cuenta gratis, pegas las instrucciones en el agente de chat que ya tienes, subes la información de tu alojamiento y vinculas el número con un código QR o un código de vinculación. No necesitas clave de API de Meta, proveedor ni programador. Son unos minutos, y luego lo pruebas desde otro número y en varios idiomas.",
    body: <>
      <ol>
        <li><strong>Crea tu cuenta gratis.</strong> Sin tarjeta y sin clave de API.</li>
        <li><strong>Pega las instrucciones.</strong> Usa el ejemplo de abajo y cambia los datos.</li>
        <li><strong>Sube tu información.</strong> Horarios, cómo llegar, aparcamiento, normas, servicios, tasa turística y recomendaciones, en texto, PDF o Word. Un PDF escaneado no se puede leer: usa una versión con texto seleccionable.</li>
        <li><strong>Vincula el número.</strong> En un ordenador, abre WhatsApp en el móvil, ve a Dispositivos vinculados y escanea el código QR. En el móvil, introduce el código de vinculación de 8 caracteres.</li>
        <li><strong>Pruébalo.</strong> Escribe desde otro número en inglés, francés y alemán, y prueba las preguntas delicadas, como “what’s the door code?”.</li>
      </ol>
      <pre>{prompt}</pre>
      <p>También puedes enviar un aviso unos días antes de la llegada con Bulk Messages, para que tus huéspedes guarden el número:</p>
      <pre>{preArrival}</pre>
      <InlineCta title="Atiende a tus huéspedes también de madrugada" body="Siempre gratis, sin clave de API de Meta, sin tarjeta y sin coste por mensaje." label="Empieza gratis" />
    </>,
  },
  {
    id: "coste",
    q: "¿Cuánto cuesta un chatbot de WhatsApp para un hotel en España?",
    answer: "Con la API oficial y una plataforma como Callbell, un alojamiento con 15 conversaciones al día pagaría unos 136 € al mes sin IVA: 93 € de plataforma y unos 43 € de tarifas de Meta. Con Wapzen son 0 € al mes, siempre, porque no usa la API de Meta y no cobra por mensaje ni por respuesta.",
    body: <>
      <Comparison caption="Coste de atender a huéspedes por WhatsApp en España: API oficial frente a Wapzen" columns={["API oficial de WhatsApp Business", "Wapzen"]} rows={costs} />
      <h3>Un ejemplo con números</h3>
      <p>Un alojamiento recibe 15 conversaciones al día, con 8 respuestas por conversación (<strong>3.600 respuestas al mes</strong>):</p>
      <ul>
        <li><strong>Respuestas:</strong> descontando las 1.000 gratis, 2.600 × 0,0166 € = <strong>43,16 €</strong>.</li>
        <li><strong>Plataforma:</strong> en Callbell, 14 € por agente + 20 € de cuenta de WhatsApp + 59 € del creador de bots = <strong>93 €</strong>.</li>
        <li><strong>Total:</strong> unos <strong>136 € al mes</strong> sin IVA, más de 1.630 € al año.</li>
        <li><strong>Con Wapzen:</strong> <strong>0 €</strong>.</li>
      </ul>
      <Note>Tarifas de Meta para España de la lista del 1 de octubre de 2026; cambian cada trimestre. Precios de Callbell y Smoobu consultados el 4 de noviembre de 2026. La página de Callbell no da un precio aparte para la IA, y ChatGPT aparece solo en el plan Enterprise.</Note>
    </>,
  },
  {
    id: "voz",
    q: "¿El agente de voz contesta a los huéspedes que llaman por WhatsApp?",
    answer: "Sí, el agente de voz ya funciona. Contesta las llamadas de WhatsApp a tu número, en el idioma que le configures, con la misma información que el chatbot. Una llamada de WhatsApp usa internet, así que al huésped le evita marcar un número extranjero. También es gratis y sin coste por minuto. No atiende teléfono fijo ni transfiere llamadas en directo.",
    body: <>
      <p>Muchos viajeros prefieren llamar cuando tienen prisa: acaban de aterrizar, no encuentran la entrada o van conduciendo. Si llaman al WhatsApp del alojamiento, el agente responde, resuelve lo básico y toma nota.</p>
      <ul>
        <li><strong>Un idioma por agente de voz.</strong> Elige el que más usan tus huéspedes. En el chat, en cambio, el agente responde en el idioma de cada uno.</li>
        <li><strong>Sin transferencia en directo.</strong> Avisa de que tu equipo devolverá la llamada, y en una urgencia indica el 112. Mantén un teléfono del equipo visible para lo que no pueda esperar.</li>
        <li><strong>Sin coste por minuto.</strong> Con la API oficial, las llamadas que inicia la empresa cuestan 0,0129 dólares por minuto en España, más la plataforma de voz. Hay una pausa de uno o dos segundos antes de cada respuesta.</li>
      </ul>
      <p>Tienes más detalles en <Link href="/es/llamadas-con-ia">llamadas con IA</Link>.</p>
      <InlineCta href={voiceAccess} title="Añade el agente de voz para los huéspedes que llaman" body="El agente de voz también es gratis. Escríbenos por WhatsApp y lo activamos en tu número." label="Escríbenos por WhatsApp" />
    </>,
  },
  {
    id: "limites",
    q: "¿Qué no puede hacer Wapzen en un alojamiento turístico?",
    answer: "Wapzen no sustituye a tu PMS ni a tu motor de reservas: no gestiona calendario, tarifas, cobros ni registro de viajeros, y no responde dentro de Booking o Airbnb. Contesta con texto, no envía archivos ni imágenes, no atiende grupos y cada cuenta tiene un agente de chat. Tampoco usa la API oficial de Meta, así que no incluye insignia verde.",
    body: <>
      <Comparison caption="Para qué alojamientos encaja un chatbot de WhatsApp gratis" columns={["¿Te encaja?", "Por qué"]} rows={fit} />
      <ul>
        <li><strong>Los mapas y las fotos van por enlace.</strong> Añade los enlaces a la información del agente.</li>
        <li><strong>Escribe el huésped primero.</strong> El agente contesta a quien le escribe. Para escribir tú primero, usa Bulk Messages y limítate a huéspedes que esperen ese aviso.</li>
        <li><strong>Revisa lo que dice.</strong> Lee las conversaciones durante los primeros días, sobre todo en los idiomas que no dominas.</li>
        <li><strong>El panel está en inglés.</strong> El agente responde en el idioma de tus huéspedes.</li>
      </ul>
      <p>Wapzen es un producto independiente: no pertenece a Meta ni a WhatsApp.</p>
    </>,
  },
];

export default function WhatsAppHotelesApartamentosPage() {
  return <QaPost
    href={href}
    heading={<>WhatsApp con IA para hoteles y apartamentos turísticos.<br /><span>Siempre gratis, sin API de Meta y con agente de voz.</span></>}
    lead="“What time is check-in?”, “¿dónde aparco?”, “wo lassen wir das Gepäck?”. Tus huéspedes preguntan a cualquier hora y en varios idiomas, también cuando no hay nadie en recepción. Aquí respondemos, una a una, las dudas de hoteles, gestores de apartamentos turísticos, hostales y casas rurales de España antes de poner una IA en su WhatsApp, sin clave de API de Meta."
    verdict={{
      title: "La respuesta corta",
      body: <><strong>Wapzen</strong> es un chatbot de WhatsApp con IA para hoteles y apartamentos turísticos en España, <strong>siempre gratis, con conversaciones ilimitadas y sin clave de API de Meta</strong>. Responde en tu número a cualquier hora y en el idioma de cada huésped, anota peticiones para tu equipo y comparte tu enlace de reservas. Su agente de voz contesta las llamadas de WhatsApp. No sustituye a tu PMS y no responde dentro de Booking ni de Airbnb.</>,
    }}
    facts={[["Precio", "Siempre gratis"], ["Clave de API de Meta", "No hace falta"], ["Conversaciones", "Ilimitadas"], ["Llamadas", "Agente de voz funcionando"]]}
    indexTitle="Las 12 preguntas de esta guía"
    answerLabel="Respuesta corta"
    questions={questions}
    sources={sources}
    related={["/es/blog/ia-para-inmobiliarias-whatsapp", "/es/blog/chatbot-whatsapp-clinica-dental"]}
    product="/es/llamadas-con-ia"
    cta={{ heading: <>Tus huéspedes reciben respuesta a cualquier hora.<br /><span>Siempre gratis, sin API de Meta.</span></>, body: "Crea tu cuenta, dale la información de tu alojamiento y vincula tu número en unos minutos. Sin tarjeta y sin coste por mensaje." }}
  />;
}
