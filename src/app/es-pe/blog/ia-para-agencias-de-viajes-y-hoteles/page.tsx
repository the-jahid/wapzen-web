import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Búsquedas (autocompletado de Google, YouTube y DuckDuckGo con gl=pe, 2026-11-12, ver
// docs/seo-research.md, "Peru posts"): "ia para agencias de viajes" (30, 3/3), "ia para
// hoteles" (30, 3/3), "whatsapp para hoteles" (20), "chatbot turismo" (20), "sistema de
// reservas por whatsapp" (13). Cifras de turismo: Mincetur vía El Peruano (15 de enero de 2026).
// Texto: "gratis para empezar" y "empieza gratis", nunca "gratis para siempre", "ilimitado"
// ni "S/ 0 al mes": desde el 2026-11-12 el servidor da una prueba gratis por cuenta
// (FREE_TRIAL_REPLIES) y luego pide un plan de pago. A pedido del usuario no se menciona
// ningún límite ni riesgo de bloqueo. Sigue diciendo que Wapzen no es un producto oficial
// de Meta y que no escribe primero (Bulk Messages se quitó el 2026-11-07). El agente de voz
// se describe como funcionando y su CTA abre WhatsApp, porque el panel todavía muestra
// VoiceUpdateNote. No se cita ningún porcentaje de comisión de Booking u otras plataformas:
// no se encontró una tasa verificada. La tarifa de Meta para Chile (US$0.02) viene de la
// misma lista del 1 de octubre de 2026 usada en /es-cl/blog/chatbot-whatsapp-gratis.
// Tarifas de Meta: revisar cada trimestre (1 de ene/abr/jul/oct).
const href = "/es-pe/blog/ia-para-agencias-de-viajes-y-hoteles";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hola, quiero activar el agente de voz de Wapzen en mi agencia u hotel en Perú.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es-PE", article: { publishedTime: post.published, modifiedTime: post.updated } });

const answers = [
  ["“¿Cuánto cuesta el tour a Machu Picchu?”", "Sí", "Con las tarifas y condiciones que le diste"],
  ["“¿Qué incluye el paquete?”", "Sí", "Con tu descripción: traslados, guía, entradas, comidas"],
  ["“¿A qué hora es el check-in? ¿Guardan equipaje?”", "Sí", "Con las reglas de tu hospedaje"],
  ["“¿Me envías el itinerario?”", "Sí", "Envía el PDF o las fotos que subiste en Images & Files"],
  ["“Do you speak English?”", "Sí", "Responde en el idioma del viajero, si se lo indicas"],
  ["“¿Tienen habitación doble del 14 al 17?”", "En parte", "Toma el pedido; solo ve la disponibilidad si tu sistema tiene una API"],
  ["“¿Hay entradas a Machu Picchu para el 16?”", "No", "No ve la venta oficial: tu equipo la verifica"],
  ["“Quiero cancelar y que me devuelvan el dinero”", "No", "Explica tu política y lo pasa a una persona"],
  ["“Tengo mal de altura, ¿qué tomo?”", "No", "No da consejos médicos: lo deriva"],
];

const costs = [
  ["Para empezar", "Plataforma de pago, casi siempre en dólares, y aprobación de Meta", "Gratis y sin tarjeta"],
  ["Respuesta a un viajero con número peruano", "1,000 gratis al mes por número; luego US$0.030 cada una", "No aplica: no usa la API de Meta"],
  ["Respuesta a un viajero con número chileno", "US$0.02 cada una, después de las gratis", "No aplica"],
  ["Llamadas de WhatsApp", "Las que hace el negocio a números peruanos: US$0.0121 por minuto, más la plataforma de voz", "Agente de voz, sin tarifa de Meta por minuto"],
  ["Clave de API y plantillas aprobadas", "Necesarias", "No hacen falta"],
  ["Insignia verde y canal oficial de Meta", "Sí", "No"],
];

const fit = [
  ["Agencia u operador que recibe consultas de viajeros de otros países", "Sí", "Responde de madrugada y en el idioma del viajero"],
  ["Hotel, hostal u hospedaje con reservas directas por WhatsApp", "Sí", "Contesta lo de siempre y recoge el pedido de reserva"],
  ["Negocio pequeño donde el dueño también guía o atiende recepción", "Sí", "El agente responde mientras estás con huéspedes o en ruta"],
  ["Hotel que quiere un motor de reservas con cobro en línea", "No", "Eso es un motor de reservas: el agente lo complementa"],
  ["Cadena que exige insignia verde o plantillas aprobadas", "No", "Solo existen en la API oficial de Meta"],
];

const prompt = `Eres la asistente virtual de Agencia Demo, agencia de viajes en Cusco, Perú.
Di en tu primer mensaje que eres una asistente virtual.
Responde en el idioma en que te escriba el viajero: español, inglés o portugués. Usa mensajes cortos de dos o tres frases y haz una sola pregunta a la vez.
Para tours, precios, qué incluye cada uno, horarios y condiciones, usa solo la información que te dimos. Si no tienes un dato, dilo y ofrece que el equipo responda.
Nunca inventes precios, descuentos ni horarios. Nunca confirmes disponibilidad de entradas, trenes ni cupos: di que el equipo la verifica y confirma por este chat.
Para tomar un pedido de reserva: pregunta el tour, la fecha, el número de personas, los nombres completos y la nacionalidad. Repite el pedido y pide que lo confirme. Avisa que la reserva queda firme solo cuando el equipo confirma y se recibe el pago.
No pidas números de pasaporte ni datos de tarjeta por este chat: el equipo los solicita al confirmar.
Si alguien pregunta por salud, mal de altura o medicamentos, no des consejos médicos: sugiere consultar a un médico y ofrece que el equipo lo contacte.
Para cambios, cancelaciones, devoluciones o reclamos, explica la política que te dimos y avisa que una persona del equipo responderá.
Horario del equipo: todos los días de 8:00 a 20:00, hora del Perú.`;

const turns = [
  { from: "patient" as const, text: "Hola, somos 2 y llegamos a Cusco el 14 de diciembre. ¿Cuánto cuesta el tour a Machu Picchu de un día?" },
  { from: "agent" as const, text: "¡Hola! Soy la asistente virtual de Agencia Demo, en Cusco. El tour de un día a Machu Picchu cuesta US$ 290 por persona e incluye traslados, tren, entrada y guía. ¿Para qué fecha lo quieren?" },
  { from: "patient" as const, text: "Para el 16 de diciembre. ¿Hay cupo?" },
  { from: "agent" as const, text: "La disponibilidad de entradas y trenes la verifica nuestro equipo. Para consultarla necesito los nombres completos y la nacionalidad de cada uno. ¿Me los das?" },
  { from: "patient" as const, text: "Camila Rojas y Diego Soto, chilenos" },
  { from: "agent" as const, text: "Gracias. Anoto: tour de un día a Machu Picchu para 2 personas, el 16 de diciembre, Camila Rojas y Diego Soto, de Chile. ¿Está correcto?" },
  { from: "patient" as const, text: "Sí, correcto" },
  { from: "agent" as const, text: "¡Listo! El equipo verifica la disponibilidad y les escribe por este chat desde las 8:00 de la mañana, hora del Perú, con la confirmación y la forma de pago." },
];

const sources = [
  { label: "El Peruano: el Perú recibió 4,157,469 visitantes internacionales en 2025, según el Mincetur (enero de 2026)", href: "https://elperuano.pe/noticia/287183-ministra-mera-peru-recibio-4-157-469-visitantes-internacionales-al-cierre-de-2025" },
  { label: "Andina: Reglamento de Agencias de Viajes y Turismo, Decreto Supremo N.° 005-2020-MINCETUR", href: "https://andina.pe/agencia/noticia-agencias-viajes-y-turismo-virtuales-deberan-formalizarse-797285.aspx" },
  { label: "Gob.pe: Directorio Nacional de Prestadores de Servicios Turísticos Calificados", href: "https://www.gob.pe/institucion/mincetur/campa%C3%B1as/266-directorio-nacional-de-prestadores-de-servicios-turisticos-calificados" },
  { label: "Meta: precios de la plataforma de WhatsApp Business", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Zernio: tarifas de WhatsApp por país, lista del 1 de octubre de 2026", href: "https://zernio.com/whatsapp-api-pricing" },
  { label: "El Peruano: Indecopi confirma multa por enviar publicidad sin consentimiento (marzo de 2026)", href: "https://elperuano.pe/noticia/292050-indecopi-confirma-multa-a-claro-por-enviar-publicidad-sin-consentimiento" },
  { label: "El Peruano: el Libro de Reclamaciones y la plataforma gratuita de Indecopi (diciembre de 2025)", href: "https://elperuano.pe/noticia/284176-mas-orden-mas-clientes-activa-tu-libro-de-reclamaciones-sin-pagar-un-sol" },
  { label: "Gob.pe: Decreto Supremo N.° 016-2024-JUS, reglamento de la Ley 29733", href: "https://www.gob.pe/institucion/anpd/normas-legales/6554453-16-2024-jus" },
];

const questions = [
  {
    id: "existe",
    q: "¿Existe una IA para agencias de viajes y hoteles en Perú que funcione en WhatsApp?",
    answer: "Sí. Wapzen es un agente de IA que responde en el WhatsApp de tu agencia, hotel u hospedaje: contesta precios, qué incluye cada tour, horarios y reglas de la casa, en el idioma del viajero y a cualquier hora, y recoge pedidos de reserva. Empiezas gratis y sin tarjeta, en el número que ya tienes y sin clave de API de Meta.",
    body: <>
      <p>El turismo es uno de los grandes negocios del país. Según el Mincetur, el Perú recibió <strong>4,157,469 visitantes internacionales en 2025</strong>, un 4.1% más que en 2024. Los principales países de origen fueron Chile (1,281,858), Estados Unidos (628,720), Ecuador, Bolivia, Brasil y Colombia. Sudamérica aportó el 58.8% de los visitantes, Norteamérica el 19.7% y Europa el 14.4%.</p>
      <p>Esos viajeros escriben por WhatsApp desde otro huso horario. Cuando en Madrid son las 9 de la mañana, en Lima y Cusco son las 2 o 3 de la madrugada. Y casi siempre le escriben a varias agencias y hospedajes a la vez: quien responde primero, con datos claros, lleva ventaja.</p>
      <p>Un agente de IA cubre ese vacío. En <strong>Wapzen</strong> lo conectas a tu número, le das tus tarifas y condiciones, y responde por ti. <strong>Empiezas gratis y sin tarjeta</strong>, y la IA ya viene incluida.</p>
    </>,
  },
  {
    id: "agencia",
    q: "¿Qué responde un agente de IA en una agencia de viajes?",
    answer: "Responde las preguntas que se repiten: precio de cada tour, qué incluye, duración, horarios de salida, punto de encuentro, formas de pago y política de cambios. También recoge el pedido de reserva con tour, fecha, número de personas y nombres. No confirma cupos de entradas ni de trenes: eso lo verifica tu equipo.",
    body: <>
      <p>Así conversa el agente, en el ejemplo de una agencia inventada:</p>
      <ChatExample
        business="Agencia Demo"
        labels={{ subtitle: "WhatsApp · agente de IA", agent: "Agente: ", patient: "Viajero: " }}
        turns={turns}
        caption="Conversación ilustrativa de una agencia ficticia, a las 2 de la madrugada, hora del Perú. Los precios y las condiciones salen de la información que sube la agencia."
        points={[
          { title: "Responde de madrugada", body: "El viajero escribió cuando la oficina estaba cerrada y recibió precio y condiciones al momento." },
          { title: "No promete cupos", body: "Las instrucciones le prohíben confirmar entradas o trenes. Dice que el equipo los verifica." },
          { title: "Deja el pedido listo", body: "Tour, fecha, personas y nombres quedan en el chat para que tu equipo cotice y confirme al abrir." },
          { title: "Usa tus tarifas", body: "El precio sale de tu información. Si un tour no está en ella, lo dice en lugar de inventar." },
        ]}
      />
      <Comparison caption="Qué responde un agente de IA de WhatsApp en una agencia de viajes o un hotel" columns={["¿Responde?", "Cómo"]} rows={answers} />
    </>,
  },
  {
    id: "hotel",
    q: "¿Y en un hotel, hostal u hospedaje?",
    answer: "Responde lo que recepción contesta decenas de veces al día: tarifas por tipo de habitación, horarios de check-in y check-out, desayuno, traslado desde el aeropuerto o la estación, estacionamiento, mascotas y cómo llegar. Recoge el pedido de reserva con fechas y número de huéspedes, y recepción confirma si hay habitación.",
    body: <>
      <ul>
        <li><strong>Antes de reservar:</strong> tarifas, tipos de habitación, qué incluye, formas de pago y política de cancelación.</li>
        <li><strong>Antes de llegar:</strong> cómo llegar desde el aeropuerto o el terminal, hora de check-in, si guardan equipaje.</li>
        <li><strong>Durante la estadía:</strong> horario del desayuno, clave del wifi si decides dársela, lavandería, tours que recomiendas.</li>
      </ul>
      <p>Lo que no hace solo: ver si hay habitación libre. El agente toma el pedido y recepción confirma. Si tu sistema de reservas tiene una API, puedes conectarlo con una herramienta de API para que el agente consulte la disponibilidad; eso necesita a alguien técnico.</p>
    </>,
  },
  {
    id: "idiomas",
    q: "¿Responde en inglés, portugués y otros idiomas?",
    answer: "Sí. El agente de chat responde en el idioma en que le escribe el viajero si se lo indicas en las instrucciones, por ejemplo español, inglés y portugués. Tu información puede estar en español: el agente la usa para responder en el otro idioma. Los nombres propios y los precios salen tal como los escribiste.",
    body: <>
      <ul>
        <li><strong>Una sola línea en las instrucciones:</strong> “Responde en el idioma en que te escriba el viajero”.</li>
        <li><strong>Prueba cada idioma</strong> antes de publicarlo. Pídele a alguien que lo hable que revise si los términos de tus tours se entienden.</li>
        <li><strong>Los audios también.</strong> El agente transcribe las notas de voz y responde por texto.</li>
      </ul>
      <p>Con 628,720 visitantes de Estados Unidos y 222,186 de Brasil en 2025, responder en inglés y en portugués a las 3 de la madrugada es una ventaja real frente a quien contesta al día siguiente.</p>
    </>,
  },
  {
    id: "reservar",
    q: "¿Puede cotizar y tomar reservas por WhatsApp?",
    answer: "Puede dar los precios que tú publicaste y recoger el pedido de reserva completo. La cotización a medida, la disponibilidad y el cobro los cierra tu equipo. Con la herramienta Take Order, cada pedido confirmado por el viajero se guarda en la página Orders de tu panel, con su nombre y su número de WhatsApp.",
    body: <>
      <ol>
        <li><strong>Precios fijos:</strong> el agente los responde con tu tarifario.</li>
        <li><strong>Viajes a medida:</strong> el agente reúne fechas, número de personas, intereses y presupuesto, y tu equipo arma la cotización.</li>
        <li><strong>Pedido de reserva:</strong> con Take Order, el agente repite los datos y los guarda cuando el viajero confirma. Take Order se pensó para pedidos de productos: pruébalo con una reserva antes de depender de él.</li>
        <li><strong>Pago:</strong> el agente indica las formas de pago, pero no cobra ni confirma abonos.</li>
      </ol>
      <Note>Deja claro en las instrucciones que una reserva queda firme solo cuando tu equipo la confirma. Así el agente nunca promete una habitación o una entrada que no tienes.</Note>
    </>,
  },
  {
    id: "itinerarios",
    q: "¿Puede enviar itinerarios y fotos, y leer mi página web?",
    answer: "Sí. En Images & Files subes itinerarios en PDF, fotos de las habitaciones o el mapa de cómo llegar, con una nota de cuándo enviarlos, y el agente los manda cuando el viajero los pide. En la tarjeta Web Search escribes la dirección de tu web y el agente la lee para responder con lo que está publicado ahí.",
    body: <>
      <ul>
        <li><strong>Itinerarios y condiciones</strong> en PDF, uno por tour, con su nota: “envíalo cuando pregunten por el Valle Sagrado”.</li>
        <li><strong>Fotos reales</strong> de habitaciones y áreas comunes.</li>
        <li><strong>Tu web como fuente.</strong> Si tus tarifas están en tu página, el agente puede leerlas. Haz preguntas de prueba y revisa que responda lo mismo que dice la web.</li>
      </ul>
      <p>Cuando cambie una tarifa de temporada, actualiza el archivo o la web: el agente responde con lo que le diste.</p>
    </>,
  },
  {
    id: "directas",
    q: "¿Ayuda a tener más reservas directas?",
    answer: "Sí, porque el canal directo depende de responder rápido. Las plataformas de reservas dan visibilidad y cobran una comisión por cada reserva. La reserva que se cierra por tu WhatsApp no paga esa comisión, pero exige que alguien conteste a toda hora. Un agente de IA cubre esas horas sin reemplazar a las plataformas.",
    body: <>
      <ul>
        <li><strong>Pon tu WhatsApp donde te buscan:</strong> en tu web, tu perfil de Google, Instagram y la firma de tus correos. Puedes crear el enlace y el código QR gratis con el <Link href="/tools/whatsapp-link-generator">generador de enlaces</Link> y el <Link href="/tools/whatsapp-qr-code-generator">generador de QR</Link>, en inglés.</li>
        <li><strong>Atiende a quien ya reservó.</strong> Muchas preguntas llegan después de la reserva: cómo llegar, a qué hora salir, qué llevar. El agente las responde y tu equipo se concentra en operar.</li>
        <li><strong>Revisa tus contratos.</strong> Cada plataforma tiene reglas sobre cómo contactas a los huéspedes que llegaron por ella. Respétalas.</li>
      </ul>
      <InlineCta title="Tu agencia u hotel responde WhatsApp a toda hora" body="Empieza gratis: sin tarjeta, sin clave de API de Meta y en el número que ya tienes." label="Empieza gratis" />
    </>,
  },
  {
    id: "costo",
    q: "¿Cuánto cuesta la API de WhatsApp Business para una agencia u hotel en Perú?",
    answer: "Con la API oficial, Meta cobra por mensaje según el país del número del viajero: US$0.030 por cada respuesta a un número peruano y US$0.02 a uno chileno, después de las primeras 1,000 gratis al mes por número, más la plataforma que contrates. Wapzen no usa la API oficial: no hay tarifa de Meta por mensaje y empiezas gratis.",
    body: <>
      <Comparison caption="Atender viajeros por WhatsApp desde Perú: API oficial frente a Wapzen" columns={["API oficial de WhatsApp Business", "Wapzen"]} rows={costs} />
      <h3>Un ejemplo con números</h3>
      <p>Un hospedaje que atiende 25 conversaciones al día, con 8 respuestas en promedio, sobre todo a viajeros peruanos, envía <strong>6,000 respuestas al mes</strong>:</p>
      <ul>
        <li>Se descuentan las 1,000 gratis: quedan 5,000 respuestas.</li>
        <li>5,000 × US$0.030 = <strong>US$150 al mes solo para Meta</strong>, unos S/ 518 con el dólar a S/ 3.45, antes de pagar la plataforma y la IA.</li>
        <li><strong>Con Wapzen:</strong> US$0 en tarifas de Meta, porque tu número se conecta como dispositivo vinculado, igual que WhatsApp Web.</li>
      </ul>
      <Note>Tarifas de Meta en dólares de la lista del 1 de octubre de 2026; Meta las revisa cada trimestre. El tipo de cambio es referencial. Si necesitas la insignia verde o plantillas aprobadas, la API oficial es el camino.</Note>
    </>,
  },
  {
    id: "voz",
    q: "¿También contesta las llamadas de WhatsApp?",
    answer: "Sí. Wapzen tiene un agente de voz con IA que contesta las llamadas de WhatsApp al número de tu agencia u hotel con la misma información del chat. Para el viajero, una llamada de WhatsApp desde otro país usa internet y no tiene costo de larga distancia. Funciona solo con llamadas de WhatsApp, cada agente de voz habla un idioma y no transfiere la llamada a una persona.",
    body: <>
      <p>Sirve sobre todo para quien prefiere llamar antes de pagar un viaje, y para huéspedes que llaman de camino al hospedaje. El agente responde con una pausa de uno o dos segundos antes de cada frase.</p>
      <InlineCta href={voiceAccess} title="Contesta también a quien prefiere llamar" body="Escríbenos por WhatsApp y activamos el agente de voz en tu número." label="Escríbenos por WhatsApp" />
    </>,
  },
  {
    id: "reglas",
    q: "¿Qué reglas aplican en Perú a una agencia u hotel que atiende por WhatsApp?",
    answer: "Tres normas principales. El Reglamento de Agencias de Viajes y Turismo (Decreto Supremo 005-2020-MINCETUR) regula la inscripción de las agencias en el directorio del Mincetur. El Código de Protección y Defensa del Consumidor exige información cierta, Libro de Reclamaciones y consentimiento para enviar publicidad. Y la Ley 29733 protege los datos personales de los viajeros.",
    body: <>
      <p>Esto es orientación general, no asesoría legal:</p>
      <ul>
        <li><strong>Formalidad que se puede comprobar.</strong> El Directorio Nacional de Prestadores de Servicios Turísticos Calificados es público. Si tu agencia está inscrita, dale ese dato al agente: muchos viajeros preguntan si eres una agencia formal antes de pagar.</li>
        <li><strong>Lo que el agente ofrece te compromete.</strong> Precio, qué incluye y condiciones de cancelación son información al consumidor. Mantén tu tarifario al día.</li>
        <li><strong>Libro de Reclamaciones.</strong> Los reclamos se responden en un plazo máximo de 15 días hábiles. El agente puede indicar dónde está el libro, pero el reclamo lo responde tu equipo.</li>
        <li><strong>Promociones solo con permiso.</strong> El artículo 58.1, literal e, del Código prohíbe enviar comunicaciones comerciales sin el consentimiento previo del consumidor.</li>
        <li><strong>Pasaportes y documentos.</strong> Son datos personales. Pídelos solo cuando hagan falta para emitir la reserva, y explica para qué. La base de datos principal de Wapzen está en Singapur, sus servidores en Singapur y Alemania, los archivos de Images & Files se guardan en Corea del Sur, y los proveedores de IA pueden procesar mensajes en Estados Unidos. Los detalles están en la <Link href="/privacy">política de privacidad</Link>, en inglés.</li>
      </ul>
    </>,
  },
  {
    id: "no-hace",
    q: "¿Qué no hace Wapzen en turismo?",
    answer: "No ve la disponibilidad de habitaciones, trenes ni entradas, no cobra ni confirma pagos, no emite boletos ni vouchers y no escribe primero al viajero, así que no envía recordatorios antes del viaje. Tampoco es un producto oficial de Meta: no trae insignia verde ni plantillas aprobadas.",
    body: <>
      <Comparison caption="Para qué negocios de turismo sirve un agente de IA de WhatsApp como Wapzen" columns={["¿Te sirve?", "Por qué"]} rows={fit} />
      <ul>
        <li><strong>Disponibilidad:</strong> solo la consulta si conectas tu sistema con una herramienta de API. Sin eso, toma el pedido y tu equipo confirma.</li>
        <li><strong>Emergencias en ruta:</strong> el agente no reemplaza a tu teléfono de emergencias. Indícale a qué número debe derivar.</li>
        <li><strong>Se conecta como dispositivo vinculado,</strong> igual que WhatsApp Web, en tu número personal o de WhatsApp Business.</li>
        <li><strong>El panel está en inglés;</strong> el agente responde en el idioma del viajero.</li>
        <li>Wapzen es un producto independiente: no pertenece a Meta ni a WhatsApp.</li>
      </ul>
    </>,
  },
  {
    id: "activar",
    q: "¿Cómo activo un agente de IA en el WhatsApp de mi agencia u hotel?",
    answer: "Creas tu cuenta gratis, vinculas tu número con un código de vinculación desde el celular o con un código QR desde la computadora, le pones nombre al agente, pegas tus instrucciones y subes tarifas, condiciones e itinerarios. Después lo pruebas desde otro número, en cada idioma que vayas a ofrecer.",
    body: <>
      <ol>
        <li><strong>Crea tu cuenta gratis.</strong> Sin tarjeta y sin clave de API.</li>
        <li><strong>Ten listas las instrucciones.</strong> El agente empieza a responder en cuanto vinculas el número, así que adapta antes el ejemplo de abajo.</li>
        <li><strong>Vincula tu número.</strong> En New chat agent escribes tu número y recibes un código de 8 caracteres. En WhatsApp: Dispositivos vinculados → Vincular un dispositivo → Vincular con el número de teléfono. En una computadora también puedes escanear el código QR.</li>
        <li><strong>Sube tu información.</strong> Tarifario, qué incluye cada tour o habitación, políticas de cambio y cancelación, y preguntas frecuentes, en texto, PDF o Word. Los itinerarios y las fotos para enviar van en Images & Files.</li>
        <li><strong>Pruébalo en cada idioma</strong> desde otro número, con las preguntas difíciles: una fecha sin cupo, una cancelación, un pedido de descuento.</li>
      </ol>
      <p>Estas instrucciones son de una agencia inventada. Cámbialas por las de tu negocio:</p>
      <pre>{prompt}</pre>
    </>,
  },
];

export default function IaAgenciasHotelesPePage() {
  return <QaPost
    href={href}
    heading={<>IA para agencias de viajes y hoteles en Perú.<br /><span>WhatsApp a toda hora, gratis para empezar.</span></>}
    lead="El viajero escribe por WhatsApp desde otro país y a otra hora: precio del tour, qué incluye, si hay habitación, cómo llegar. Aquí respondemos, una por una, las preguntas de agencias, operadores, hoteles y hospedajes del Perú antes de poner un agente de IA en su número: qué responde, en qué idiomas, qué no hace y cómo empezar gratis."
    verdict={{
      title: "La respuesta corta",
      body: <>Sí, una agencia de viajes o un hotel en Perú puede atender su WhatsApp con IA usando <strong>Wapzen</strong>: responde precios y condiciones en el idioma del viajero, de día y de madrugada, envía itinerarios y recoge pedidos de reserva que tu equipo confirma. <strong>Empiezas gratis y sin tarjeta</strong>, en el número que ya usas, sin clave de API de Meta y sin tarifas de Meta por mensaje.</>,
    }}
    facts={[["Precio", "Gratis para empezar"], ["Tarjeta", "No hace falta"], ["Idiomas", "El del viajero"], ["API de Meta", "No hace falta"]]}
    indexTitle="Las 12 preguntas de esta guía"
    answerLabel="Respuesta"
    questions={questions}
    sources={sources}
    related={["/es-pe/blog/chatbot-whatsapp-para-restaurantes", "/es-pe/blog/como-vender-por-whatsapp"]}
    product="/es/chatbot-whatsapp-gratis"
    cta={{ heading: <>Responde a cada viajero al momento.<br /><span>Empieza gratis hoy.</span></>, body: "Crea tu agente de IA, súbele tus tarifas y vincula tu número en minutos. Sin tarjeta y sin API de Meta." }}
  />;
}
