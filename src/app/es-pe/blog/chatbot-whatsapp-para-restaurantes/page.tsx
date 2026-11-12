import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Búsquedas (autocompletado de Google, YouTube y DuckDuckGo con gl=pe, 2026-11-12, ver
// docs/seo-research.md, "Peru posts"): "chatbot para delivery" (30, 3/3), "ia para
// restaurantes" (30, 3/3), "pedidos por whatsapp" (30, 3/3), "sistema de pedidos por
// whatsapp" (25), "chatbot para restaurantes" (20), "whatsapp para restaurantes" (20).
// Texto: "gratis para empezar" y "empieza gratis", nunca "gratis para siempre", "ilimitado"
// ni "S/ 0 al mes": desde el 2026-11-12 el servidor da una prueba gratis por cuenta
// (FREE_TRIAL_REPLIES) y luego pide un plan de pago. A pedido del usuario no se menciona
// ningún límite ni riesgo de bloqueo. Sigue diciendo que Wapzen no es un producto oficial
// de Meta. No dice que Wapzen envíe campañas (Bulk Messages se quitó el 2026-11-07). El
// agente de voz se describe como funcionando y su CTA abre WhatsApp, porque el panel todavía
// muestra VoiceUpdateNote. La comisión de las apps de delivery (20% a 30%) viene de una nota
// de Perú Retail leída solo como extracto de búsqueda: el texto lo atribuye y pide confirmar.
// Tarifas de Meta: lista del 1 de octubre de 2026 vía Zernio; revisar cada trimestre.
const href = "/es-pe/blog/chatbot-whatsapp-para-restaurantes";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hola, quiero activar el agente de voz de Wapzen en mi restaurante en Perú.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es-PE", article: { publishedTime: post.published, modifiedTime: post.updated } });

const answers = [
  ["“¿Cuánto está el pollo entero?”", "Sí", "Con la carta y los precios que le diste"],
  ["“¿Hacen delivery a mi distrito?”", "Sí", "Con tus zonas, costos y tiempos de reparto"],
  ["“¿Hasta qué hora atienden?”", "Sí", "Con tu horario, y los feriados si se los indicas"],
  ["“Mándame la carta”", "Sí", "Envía el PDF o la foto que subiste en Images & Files"],
  ["“Quiero un pollo entero para delivery”", "Sí", "Anota el pedido, lo repite y lo guarda cuando el cliente confirma"],
  ["“Mesa para seis el sábado a las 8”", "En parte", "Toma el pedido de reserva; el local confirma si hay mesa"],
  ["“Ya yapeé, aquí está la captura”", "En parte", "Recibe la captura, pero el pago lo revisa tu caja"],
  ["“¿Dónde está mi pedido?”", "No", "No ve al motorizado: lo deriva al local"],
  ["“Soy alérgico al maní, ¿qué puedo comer?”", "No", "No da garantías sobre alérgenos: lo pasa a una persona"],
];

const costs = [
  ["Para empezar", "Plataforma de pago, casi siempre en dólares, y aprobación de Meta", "Gratis y sin tarjeta"],
  ["Tarifa de Meta por respuesta al cliente", "1,000 gratis al mes por número; luego US$0.030 cada una", "No aplica: no usa la API de Meta"],
  ["Mensajes de promoción (plantillas)", "US$0.0703 por mensaje", "No envía campañas"],
  ["Llamadas de WhatsApp", "Las que hace el negocio: US$0.0121 por minuto, más la plataforma de voz", "Agente de voz, sin tarifa de Meta por minuto"],
  ["Clave de API y plantillas aprobadas", "Necesarias", "No hacen falta"],
  ["Insignia verde y canal oficial de Meta", "Sí", "No"],
];

const fit = [
  ["Pollería, chifa, cevichería o sanguchería con pedidos por WhatsApp", "Sí", "Responde y anota pedidos mientras tu equipo cocina y despacha"],
  ["Dark kitchen o negocio de menú que vende solo por delivery", "Sí", "Atiende varios chats a la vez en la hora punta"],
  ["Restaurante que recibe consultas de reserva fuera de horario", "Sí", "Toma el pedido de reserva y tú lo confirmas al abrir"],
  ["Local que quiere asignar motorizados y rastrear pedidos", "No", "Eso lo hace un sistema de delivery o las apps"],
  ["Cadena que exige insignia verde o plantillas aprobadas", "No", "Solo existen en la API oficial de Meta"],
];

const prompt = `Eres el asistente virtual de Pollería Demo, en Los Olivos, Lima.
Di en tu primer mensaje que eres un asistente virtual.
Responde en español, con mensajes cortos de dos o tres frases, y haz una sola pregunta a la vez.
Para platos, precios, combos y promociones, usa solo la carta que te dimos. Si un plato no está en la carta o no tienes el dato, dilo y ofrece que el local responda.
Nunca inventes precios, descuentos ni tiempos de entrega.
Delivery: Los Olivos y San Martín de Porres, S/ 5, entre 35 y 50 minutos. A otros distritos no llegamos; ofrece recojo en el local.
Horario: todos los días de 12:00 a 23:00.
Formas de pago: Yape, Plin o efectivo contra entrega. Tú no confirmas pagos: pide la captura y avisa que caja la revisa.
Para tomar un pedido: pregunta qué desea, si es delivery o recojo, nombre, dirección con referencia y forma de pago. Repite el pedido con el total y pide que lo confirme.
Si preguntan por alergias o ingredientes que no están en la carta, no des garantías: di que una persona del local responderá.
Si alguien tiene un reclamo o pide hablar con una persona, pide disculpas, avisa que el encargado responderá por este chat y, si lo pide, indícale que contamos con Libro de Reclamaciones.
No pidas DNI, datos de tarjeta ni contraseñas.`;

const turns = [
  { from: "patient" as const, text: "Buenas noches, ¿cuánto está el pollo entero? ¿Hacen delivery a Los Olivos?" },
  { from: "agent" as const, text: "¡Hola! Soy el asistente virtual de Pollería Demo. El pollo entero con papas y ensalada está S/ 72.90. Sí llegamos a Los Olivos: el delivery cuesta S/ 5 y demora entre 35 y 50 minutos. ¿Te tomo el pedido?" },
  { from: "patient" as const, text: "Sí, uno entero. Pago con Yape" },
  { from: "agent" as const, text: "Perfecto. ¿Me das tu nombre y la dirección con una referencia?" },
  { from: "patient" as const, text: "Rosa Huamán, Av. Las Palmeras 450, frente al parque" },
  { from: "agent" as const, text: "Confirmo: 1 pollo entero con papas y ensalada, S/ 72.90 + S/ 5 de delivery = S/ 77.90, para Rosa Huamán en Av. Las Palmeras 450, frente al parque, Los Olivos. Pago con Yape. ¿Está correcto?" },
  { from: "patient" as const, text: "Sí, correcto" },
  { from: "agent" as const, text: "¡Listo, Rosa! Tu pedido quedó anotado. Yapea al número del local y envía la captura por aquí; caja la revisa y tu pedido sale a reparto." },
];

const sources = [
  { label: "Andina: las mypes por sector en 2024, según el Ministerio de la Producción (mayo de 2025)", href: "https://andina.pe/agencia/noticia-peru-numero-empresas-formales-crecio-2024-y-suman-234-millones-1029970.aspx" },
  { label: "Andina: la actividad de restaurantes creció 5.97% en enero de 2026, según el INEI", href: "https://andina.pe/agencia/noticia-actividad-del-sector-restaurantes-y-bebidas-peru-crecio-597-durante-enero-2026-1068142.aspx" },
  { label: "Gestión: estudio Comportamiento digital de Ipsos Perú (enero de 2024)", href: "https://gestion.pe/economia/empresas/ipsos-peru-internet-redes-sociales-facebook-tik-tok-whatsapp-redes-sociales-facebook-ya-no-es-el-favorito-y-uso-se-centra-al-amanecer-noticia/" },
  { label: "Forbes Perú: resultados de Credicorp y usuarios de Yape (mayo de 2026)", href: "https://forbes.pe/negocios/2026-05-15/utilidad-neta-de-credicorp-alcanzo-los-s-2-063-millones-durante-el-primer-trimestre-y-crecio-un-161/" },
  { label: "Perú Retail: comisiones de las apps de delivery a los restaurantes", href: "https://www.peru-retail.com/?p=239464" },
  { label: "Meta: precios de la plataforma de WhatsApp Business", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Zernio: tarifas de WhatsApp por país, lista del 1 de octubre de 2026", href: "https://zernio.com/whatsapp-api-pricing" },
  { label: "El Peruano: Indecopi confirma multa por enviar publicidad sin consentimiento (marzo de 2026)", href: "https://elperuano.pe/noticia/292050-indecopi-confirma-multa-a-claro-por-enviar-publicidad-sin-consentimiento" },
  { label: "El Peruano: el Libro de Reclamaciones y la plataforma gratuita de Indecopi (diciembre de 2025)", href: "https://elperuano.pe/noticia/284176-mas-orden-mas-clientes-activa-tu-libro-de-reclamaciones-sin-pagar-un-sol" },
  { label: "Gob.pe: Decreto Supremo N.° 016-2024-JUS, reglamento de la Ley 29733", href: "https://www.gob.pe/institucion/anpd/normas-legales/6554453-16-2024-jus" },
];

const questions = [
  {
    id: "gratis",
    q: "¿Existe un chatbot de WhatsApp gratis para restaurantes en Perú?",
    answer: "Sí. Wapzen es un chatbot de WhatsApp con IA para restaurantes que puedes empezar a usar gratis y sin tarjeta: responde a tus clientes las 24 horas con tu carta y tus precios, toma pedidos y los guarda en tu panel. Funciona en el número que ya tienes, sin clave de API de Meta y sin tarifas de Meta por mensaje.",
    body: <>
      <p>Los restaurantes son uno de los grupos de negocios más grandes del país. Según el Ministerio de la Producción, el Perú cerró 2024 con 2.3 millones de mypes formales, y el 41.6% son de servicios, el sector donde están restaurantes, pollerías y cevicherías. El INEI midió que la actividad de restaurantes creció 5.97% en enero de 2026, con las pollerías entre los rubros que más aportaron.</p>
      <p>Y el pedido casi siempre empieza por chat: en el estudio Comportamiento digital de Ipsos Perú (trabajo de campo de noviembre de 2023), el 98% de los peruanos urbanos que se conectan a diario usa WhatsApp. El problema llega en la hora punta: la cocina está llena, el teléfono suena y los mensajes se quedan sin responder.</p>
      <p>Ahí entra un agente de IA. En <strong>Wapzen</strong> lo conectas a tu número, le das tu carta y empieza a responder. <strong>Empiezas gratis y sin tarjeta</strong>, y los modelos de IA ya vienen incluidos: no necesitas una cuenta de OpenAI ni un programador.</p>
    </>,
  },
  {
    id: "que-hace",
    q: "¿Qué hace un chatbot de WhatsApp en un restaurante o pollería?",
    answer: "Atiende el WhatsApp del local: responde sobre la carta, los precios, las zonas y el costo de delivery, y los horarios; envía la carta en PDF o en foto; toma el pedido, lo repite con el total y lo guarda cuando el cliente confirma; y pasa a una persona los reclamos y las dudas sobre alergias.",
    body: <>
      <p>Así conversa el agente, en el ejemplo de una pollería inventada:</p>
      <ChatExample
        business="Pollería Demo"
        labels={{ subtitle: "WhatsApp · agente de IA", agent: "Agente: ", patient: "Cliente: " }}
        turns={turns}
        caption="Conversación ilustrativa de una pollería ficticia, un viernes a las 9 de la noche. Los precios y las zonas salen de la carta y las instrucciones que sube el local."
        points={[
          { title: "Precios de tu carta", body: "El agente busca en la carta que subiste. Si un plato no está, lo dice en lugar de inventarlo." },
          { title: "Confirma antes de guardar", body: "Repite el pedido con el total. Solo lo guarda cuando el cliente dice que está correcto." },
          { title: "No confirma el pago", body: "Recibe la captura de Yape o Plin, pero quien revisa que el dinero llegó es tu caja." },
          { title: "Queda en tu panel", body: "El pedido aparece en la página Orders con el nombre y el número de WhatsApp del cliente." },
        ]}
      />
      <p>Y esto es lo que responde, y lo que no, con las preguntas de todos los días:</p>
      <Comparison caption="Qué responde un chatbot de WhatsApp con IA en un restaurante" columns={["¿Responde?", "Cómo"]} rows={answers} />
    </>,
  },
  {
    id: "pedidos",
    q: "¿Cómo toma pedidos por WhatsApp?",
    answer: "Con la herramienta Take Order. Tú escribes qué datos pedir: platos, delivery o recojo, dirección con referencia y forma de pago. El agente los reúne en la conversación, repite el pedido con el total y, cuando el cliente confirma, lo guarda en la página Orders de tu panel, con su nombre y su número de WhatsApp.",
    body: <>
      <ol>
        <li><strong>Activas Take Order</strong> en el editor del agente y escribes tus instrucciones de pedido: qué preguntar y en qué orden.</li>
        <li><strong>El cliente pide como siempre,</strong> con texto o con un audio. El agente entiende “dos cuartos con papas y una Inca Kola de litro y medio” sin menús ni botones.</li>
        <li><strong>El agente repite y pide confirmación.</strong> Si el cliente agrega una gaseosa unos minutos después, actualiza ese mismo pedido en vez de crear otro.</li>
        <li><strong>Tu equipo lo ve en Orders,</strong> marcado como nuevo. Desde ahí lo pasan a cocina. Puedes descargar los pedidos en un archivo CSV.</li>
      </ol>
      <Note>El panel no te escribe por WhatsApp cuando entra un pedido: los nuevos aparecen marcados en Orders. Deja el panel abierto en la computadora o la tablet de caja durante el servicio.</Note>
      <p>El pago sigue siendo tuyo. Yape tiene 16.4 millones de usuarios activos al mes, según los resultados de Credicorp de 2026, así que casi todos tus clientes querrán yapear. El agente indica cómo pagar y recibe la captura, pero no entra a tu Yape ni a tu banco. Tampoco emite la boleta: eso lo hace tu sistema de siempre.</p>
    </>,
  },
  {
    id: "carta",
    q: "¿Puede enviar la carta, entender audios y leer fotos?",
    answer: "Sí. En Images & Files subes la carta en PDF o las fotos de tus platos y escribes cuándo enviarlas; el agente las manda cuando el cliente las pide. También transcribe los audios y lee las fotos que recibe, y responde por texto. Si tienes página web, puede leerla para responder.",
    body: <>
      <ul>
        <li><strong>La carta y las fotos.</strong> Sube la carta del día, la de promociones o la foto del combo familiar, cada una con una nota como “envíala cuando pidan la carta”.</li>
        <li><strong>Los audios.</strong> En el Perú se piden muchas cosas por audio. El agente lo convierte en texto y responde por escrito.</li>
        <li><strong>Las fotos.</strong> Si el cliente manda la foto de un plato o la captura de un pago, el agente la lee. Recuerda: leer una captura no es confirmar un pago.</li>
        <li><strong>Tu página web.</strong> En la tarjeta Web Search escribes la dirección de tu web y el agente la lee para responder. Si tu carta está ahí, pruébalo con preguntas reales antes de confiar en él.</li>
      </ul>
      <p>Cuando cambie un precio, cambia también el archivo: el agente responde con lo que le diste.</p>
    </>,
  },
  {
    id: "apps",
    q: "¿Reemplaza a Rappi o PedidosYa?",
    answer: "No, las complementa. Las apps de delivery te traen clientes nuevos y ponen el reparto, y cobran una comisión por cada pedido. El pedido directo por WhatsApp no paga esa comisión, y sirve sobre todo para quienes ya te conocen. El agente de IA hace que ese canal directo responda rápido, también en la hora punta.",
    body: <>
      <p>La prensa peruana ubica la comisión de las apps entre 20% y 30% de la venta. Pídele a cada app tu tasa exacta, porque depende del contrato. Con esa referencia, la cuenta es simple:</p>
      <ul>
        <li>Un pedido de S/ 80 con una comisión de 25% deja <strong>S/ 20 en la app</strong>.</li>
        <li>Si 15 de tus pedidos diarios pasan al WhatsApp del local, son <strong>S/ 300 al día</strong> que se quedan en caja, antes de pagar tu propio reparto.</li>
      </ul>
      <p>Lo que no cambia: en el pedido directo, el motorizado lo pones tú. Por eso muchos locales usan las dos vías: las apps para llegar a gente nueva, y un volante con su código QR de WhatsApp en cada bolsa para que el siguiente pedido llegue directo. Puedes crear ese código gratis con el <Link href="/tools/whatsapp-qr-code-generator">generador de QR de WhatsApp</Link>, en inglés.</p>
      <Note>Este cálculo es un ejemplo, no una promesa de ahorro. Cambia los números por los de tu local.</Note>
    </>,
  },
  {
    id: "costo",
    q: "¿Cuánto cuesta la API de WhatsApp Business para un restaurante en Perú?",
    answer: "Con la API oficial, Meta cobra en Perú US$0.030 por cada respuesta al cliente después de las primeras 1,000 gratis al mes por número, y US$0.0703 por cada mensaje de promoción, además de lo que cobre la plataforma que contrates. Wapzen no usa la API oficial: no hay tarifa de Meta por mensaje y empiezas gratis.",
    body: <>
      <Comparison caption="Atender pedidos por WhatsApp en Perú: API oficial frente a Wapzen" columns={["API oficial de WhatsApp Business", "Wapzen"]} rows={costs} />
      <h3>Un ejemplo con números</h3>
      <p>Una pollería que atiende 60 conversaciones al día, con 6 respuestas en promedio, envía <strong>10,800 respuestas al mes</strong>:</p>
      <ul>
        <li>Se descuentan las 1,000 gratis: quedan 9,800 respuestas.</li>
        <li>9,800 × US$0.030 = <strong>US$294 al mes solo para Meta</strong>, unos S/ 1,014 con el dólar a S/ 3.45.</li>
        <li>A eso se suma la plataforma que conecta la API y, casi siempre, la IA.</li>
        <li><strong>Con Wapzen:</strong> US$0 en tarifas de Meta, porque tu número se conecta como dispositivo vinculado.</li>
      </ul>
      <Note>Tarifas de Meta en dólares de la lista del 1 de octubre de 2026; Meta las revisa cada trimestre. El tipo de cambio es referencial. Si necesitas la insignia verde o plantillas aprobadas, la API oficial es el camino, y vale la pena pagarla.</Note>
    </>,
  },
  {
    id: "voz",
    q: "¿También contesta las llamadas de WhatsApp?",
    answer: "Sí. Wapzen tiene un agente de voz con IA que contesta las llamadas de WhatsApp al número del local, en español, con la misma información del chat: carta, precios, horarios y zonas de reparto. Funciona con llamadas de WhatsApp, no con el teléfono fijo, y no transfiere la llamada a una persona.",
    body: <>
      <p>Muchos clientes prefieren llamar para pedir. Si nadie contesta porque todos están en cocina, ese pedido se va a otro local. El agente de voz responde con una pausa de uno o dos segundos antes de cada frase.</p>
      <InlineCta href={voiceAccess} title="Que tu local conteste también las llamadas" body="Escríbenos por WhatsApp y activamos el agente de voz en tu número." label="Escríbenos por WhatsApp" />
    </>,
  },
  {
    id: "persona",
    q: "¿Qué pasa con los reclamos o cuando el cliente pide hablar con una persona?",
    answer: "Los tomas tú. Cada conversación del panel tiene un interruptor de IA: lo apagas y el agente deja de responderle solo a ese cliente, mientras sigue atendiendo a los demás. En las instrucciones defines qué casos pasan a una persona: reclamos, pedidos que llegaron mal, devoluciones de dinero y dudas sobre alergias.",
    body: <>
      <ol>
        <li><strong>Escribe los casos en las instrucciones.</strong> Por ejemplo: “si hay un reclamo, pide disculpas y avisa que el encargado responderá por este chat”.</li>
        <li><strong>Apaga la IA en ese contacto</strong> y responde tú, desde el panel o desde el celular. Al terminar, vuelve a encenderla.</li>
        <li><strong>Ten a la mano el Libro de Reclamaciones.</strong> Si el cliente lo pide, el agente puede decirle dónde encontrarlo, pero el reclamo lo responde el local.</li>
      </ol>
      <p>El agente no te avisa cuando alguien pide a una persona. Acuerda con tu equipo quién revisa los chats durante el servicio.</p>
    </>,
  },
  {
    id: "reglas",
    q: "¿Qué reglas aplican en Perú a un restaurante que atiende por WhatsApp?",
    answer: "Tres principales. El Código de Protección y Defensa del Consumidor exige consentimiento previo para enviar promociones (artículo 58.1, literal e) y que la información que das sea cierta. Todo local abierto al público debe tener Libro de Reclamaciones, físico o virtual. Y la Ley 29733 protege los datos personales de tus clientes.",
    body: <>
      <p>Esto es orientación general, no asesoría legal:</p>
      <ul>
        <li><strong>Promociones solo con permiso.</strong> Que alguien te haya pedido un pollo no te autoriza a mandarle ofertas. En 2026, Indecopi confirmó una multa de 10.44 UIT (S/ 57,420) a una operadora por enviar mensajes publicitarios a un cliente sin su consentimiento. Pregunta antes: “¿Quieres recibir nuestras promociones por este chat?”.</li>
        <li><strong>Lo que el agente dice te compromete.</strong> Precios, promociones y tiempos de entrega son información al consumidor. Mantén la carta al día y prohíbele inventar descuentos.</li>
        <li><strong>Libro de Reclamaciones.</strong> Los reclamos se responden en un plazo máximo de 15 días hábiles. Indecopi ofrece la plataforma gratuita “Tu Libro de Reclamaciones” para tenerlo en formato virtual.</li>
        <li><strong>Datos personales.</strong> Pide solo lo necesario: nombre, dirección y forma de pago. La base de datos principal de Wapzen está en Singapur, sus servidores en Singapur y Alemania, los archivos de Images & Files se guardan en Corea del Sur, y los proveedores de IA pueden procesar mensajes en Estados Unidos. Los detalles están en la <Link href="/privacy">política de privacidad</Link>, en inglés.</li>
      </ul>
    </>,
  },
  {
    id: "no-hace",
    q: "¿Qué no hace Wapzen en un restaurante?",
    answer: "No confirma pagos de Yape, Plin ni transferencias, no emite boletas, no asigna motorizados ni rastrea pedidos, no tiene un sistema de mesas propio y no escribe primero a tus clientes. Tampoco es un producto oficial de Meta, así que no trae insignia verde ni plantillas aprobadas.",
    body: <>
      <Comparison caption="Para qué restaurantes sirve un chatbot de WhatsApp como Wapzen" columns={["¿Te sirve?", "Por qué"]} rows={fit} />
      <ul>
        <li><strong>Reservas:</strong> toma el pedido de reserva con nombre, día, hora y número de personas, y tú confirmas si hay mesa. Para que consulte un sistema de reservas, ese sistema debe tener una API.</li>
        <li><strong>Pedidos ya enviados a cocina:</strong> el agente no los consulta ni los cancela. Si el cliente quiere un cambio tarde, lo atiende tu equipo.</li>
        <li><strong>Se conecta como dispositivo vinculado,</strong> igual que WhatsApp Web, en tu número personal o de WhatsApp Business. Sigues usando tu celular como siempre.</li>
        <li><strong>El panel está en inglés;</strong> el agente responde en español.</li>
        <li>Wapzen es un producto independiente: no pertenece a Meta ni a WhatsApp.</li>
      </ul>
    </>,
  },
  {
    id: "activar",
    q: "¿Cómo activo un chatbot de WhatsApp en mi restaurante?",
    answer: "En pocos pasos: creas tu cuenta gratis, vinculas el número del local con un código de vinculación desde el celular o con un código QR desde la computadora, le pones nombre al agente, pegas tus instrucciones, subes la carta y activas Take Order. Luego haces un pedido de prueba desde otro número.",
    body: <>
      <ol>
        <li><strong>Crea tu cuenta gratis.</strong> Sin tarjeta y sin clave de API.</li>
        <li><strong>Ten listas las instrucciones.</strong> El agente empieza a responder en cuanto vinculas el número, así que adapta antes el ejemplo de abajo.</li>
        <li><strong>Vincula el número.</strong> En New chat agent escribes tu número y recibes un código de 8 caracteres. En WhatsApp: Dispositivos vinculados → Vincular un dispositivo → Vincular con el número de teléfono. En una computadora también puedes escanear el código QR.</li>
        <li><strong>Pega las instrucciones y sube la carta.</strong> La carta con precios va en texto, PDF o Word; el PDF para enviar al cliente y las fotos van en Images & Files.</li>
        <li><strong>Activa Take Order</strong> y escribe qué datos debe pedir.</li>
        <li><strong>Haz un pedido de prueba</strong> desde otro número, con audio incluido, y revisa que llegue a Orders. Ajusta las instrucciones hasta que responda como tu mejor cajero.</li>
      </ol>
      <p>Estas instrucciones son de una pollería inventada. Cámbialas por las de tu local:</p>
      <pre>{prompt}</pre>
      <InlineCta title="Tu restaurante responde WhatsApp en la hora punta" body="Empieza gratis: sin tarjeta, sin clave de API de Meta y en el número que ya tienes." label="Empieza gratis" />
    </>,
  },
];

export default function ChatbotRestaurantesPePage() {
  return <QaPost
    href={href}
    heading={<>Chatbot de WhatsApp para restaurantes en Perú.<br /><span>Pedidos con IA, gratis para empezar.</span></>}
    lead="En el Perú el pedido empieza por WhatsApp: “¿cuánto está el pollo entero?”, “¿llegan a mi distrito?”, “mándame la carta”. Aquí respondemos, una por una, las preguntas que hacen restaurantes, pollerías, chifas y cevicherías antes de poner un agente de IA en su número: qué hace, cómo toma pedidos, cuánto cuesta la alternativa y cómo empezar gratis."
    verdict={{
      title: "La respuesta corta",
      body: <>Sí, un restaurante en Perú puede atender su WhatsApp con IA usando <strong>Wapzen</strong>: responde las 24 horas con tu carta y tus precios, envía la carta, entiende audios, toma pedidos y los guarda en tu panel. <strong>Empiezas gratis y sin tarjeta</strong>, en el número que ya usas, sin clave de API de Meta y sin tarifas de Meta por mensaje.</>,
    }}
    facts={[["Precio", "Gratis para empezar"], ["Tarjeta", "No hace falta"], ["API de Meta", "No hace falta"], ["Conexión", "Código de vinculación o QR"]]}
    indexTitle="Las 11 preguntas de esta guía"
    answerLabel="Respuesta"
    questions={questions}
    sources={sources}
    related={["/es-pe/blog/como-vender-por-whatsapp", "/es-pe/blog/ia-para-agencias-de-viajes-y-hoteles"]}
    product="/es/chatbot-whatsapp-gratis"
    cta={{ heading: <>Tu local responde WhatsApp solo.<br /><span>Empieza gratis hoy.</span></>, body: "Crea tu agente de IA, súbele tu carta y vincula tu número en minutos. Sin tarjeta y sin API de Meta." }}
  />;
}
