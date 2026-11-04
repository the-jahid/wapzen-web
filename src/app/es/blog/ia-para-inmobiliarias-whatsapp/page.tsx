import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Búsquedas (autocompletado Google, YouTube y DuckDuckGo con gl=es, 2026-11-04, ver
// docs/seo-research.md, "Spain buyer posts"): el sector con más demanda limpia, 530: "ia
// para inmobiliarias" (30, 3/3), "crm inmobiliario" (30, 3/3), "crm inmobiliario gratis"
// (27), "captar clientes inmobiliaria" (20), "agente ia para inmobiliarias" (16),
// "whatsapp business inmobiliaria" (16). A pedido del usuario (2026-11-04): siempre gratis,
// sin clave de API de Meta, agente de voz funcionando, sin nota sobre bloqueos de número y
// sin mencionar el límite por hora. El servidor mantiene HOURLY_REPLY_LIMIT = 100, así que
// el texto dice "sin límite mensual", no "ilimitado": no lo cambies sin quitar antes ese
// límite. Coste de Idealista: estimación sin fuente de un boletín del sector, y el texto
// lo dice. LAU art. 20, Ley 12/2023 art. 31 y RD 515/1989 leídos en el BOE. Wapzen no se
// integra con portales, no envía archivos y no escribe primero: el texto lo dice.
const href = "/es/blog/ia-para-inmobiliarias-whatsapp";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hola, quiero activar el agente de voz de Wapzen en mi inmobiliaria en España.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es", article: { publishedTime: post.published, modifiedTime: post.updated } });

const qualify = [
  ["¿Comprar o alquilar?", "Lleva al cliente al inmueble y a las condiciones correctas"],
  ["Zona y tipo de vivienda", "Permite ofrecer otra opción si esta no encaja"],
  ["Presupuesto", "Distingue a quien está decidido de quien solo mira"],
  ["Plazo o fecha de entrada", "Le dice a tu equipo a quién llamar primero"],
  ["Hipoteca aprobada o vivienda que vender", "Prepara la conversación de tu agente"],
  ["Cuándo puede visitar", "Deja la visita casi cerrada para que tu agente la confirme"],
];

const crm = [
  ["Responder cada consulta en segundos, de día y de noche", "Según el CRM y sus módulos", "Sí"],
  ["Cualificar por WhatsApp con preguntas naturales", "Según el CRM y sus módulos", "Sí"],
  ["Atender llamadas de WhatsApp con voz de IA", "Según el CRM y sus módulos", "Sí"],
  ["Publicar inmuebles en portales", "Sí", "No"],
  ["Cartera de inmuebles y cruces con demandas", "Sí", "No"],
  ["Repartir contactos y recordar seguimientos", "Sí", "No"],
];

const costs = [
  ["Plataforma", "Según el proveedor. En Callbell: 93 € al mes con un agente, cuenta de WhatsApp y creador de bots", "0 €, siempre"],
  ["Respuestas a clientes", "1.000 gratis al mes por número; después, 0,0166 € cada una", "0 €, sin límite mensual"],
  ["Avisos de visita", "0,0166 € cada uno", "0 €"],
  ["Promociones a tu lista", "0,0585 € cada una", "0 €"],
  ["API de Meta y clave de acceso", "Necesarias", "No hacen falta"],
];

const fit = [
  ["Agente independiente o agencia pequeña que vive en WhatsApp", "Sí", "Responde mientras estás en una visita y evita que se enfríe el contacto"],
  ["Agencia que paga por portales y recibe muchos contactos", "Sí", "Da la primera respuesta en segundos a quien te escribe"],
  ["Agencia de costa o islas con compradores extranjeros", "Sí", "Contesta en su idioma y fuera de tu horario"],
  ["Equipo que necesita cartera, cruces y reparto de contactos", "Junto a un CRM", "Una herramienta de API puede enviar los datos a tu CRM"],
  ["Quien quiere escribir a listas compradas", "No", "Esas personas nunca te pidieron información"],
  ["Red que necesita insignia verde o plantillas aprobadas", "No", "Eso solo existe en la API oficial de Meta"],
];

const prompt = `Eres el asistente virtual de Inmobiliaria Demo, en Ruzafa, Valencia.
Responde en el idioma del cliente (por defecto, español de España), con dos o tres frases, y haz una sola pregunta cada vez.
Di en tu primer mensaje que eres un asistente virtual.
Para precios, superficies, gastos de comunidad, certificado energético y disponibilidad, usa solo la información de los inmuebles que te hemos dado. Si no tienes un dato, dilo y ofrece que un agente le llame.
Averigua: si quiere comprar o alquilar, zona, presupuesto, plazo, si tiene hipoteca aprobada o una vivienda que vender, y cuándo puede visitar.
Propón una visita y pregunta qué día le viene bien. Avisa de que un agente confirmará la hora.
En alquileres de vivienda, no digas que el inquilino paga honorarios de agencia ni gastos de formalización del contrato.
Nunca prometas rentabilidad, subidas de precio, la concesión de una hipoteca ni una rebaja. No digas que hay otros interesados si no consta en tu información.
No preguntes nacionalidad, origen, religión ni situación familiar. No pidas nóminas, DNI ni documentos por este chat.
Si alguien quiere vender o alquilar su vivienda, pregunta la zona, el tipo de inmueble y cuándo prefiere que le llamemos.
Si alguien contesta a un mensaje sobre un inmueble de Idealista o Fotocasa, sigue la conversación sobre ese inmueble.`;

const firstMessage = `Hola {{nombre}}, soy Marta, de Inmobiliaria Demo. Nos escribiste por Idealista sobre el piso de {{calle}}. Puedo contarte los detalles por aquí y organizar una visita. ¿Lo buscas para vivir o como inversión?`;

const newListing = `Hola {{nombre}}, nos preguntaste por pisos en {{zona}}. Acabamos de incorporar uno de 3 habitaciones por [precio]: [enlace]. ¿Quieres verlo esta semana? Si prefieres no recibir más avisos, respóndenos BAJA.`;

const sources = [
  { label: "Harvard Business Review: The Short Life of Online Sales Leads", href: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads" },
  { label: "PPC Land: Estudio de Redes Sociales 2026 de IAB Spain", href: "https://ppc.land/spains-social-media-users-jump-to-7-2-platforms-but-42-quit-at-least-one/" },
  { label: "Diario de un Personal Shopper Inmobiliario: lo que pagan las agencias a Idealista", href: "https://diariodeunpsi.substack.com/p/como-acabar-con-idealista" },
  { label: "Merca2: las agencias moderan sus expectativas para 2026, según Idealista", href: "https://www.merca2.es/2026/07/17/agencias-inmobiliarias-expectativas-2026-idealista-2419228/" },
  { label: "idealista/tools: ayuda sobre el Inbox", href: "https://www.idealista.com/tools/centrodeayuda/etiquetas/inbox/" },
  { label: "Capterra: Mobilia", href: "https://www.capterra.es/software/198549/mobilia-gestion-crm" },
  { label: "Hackceleration: comparativa de CRM inmobiliarios", href: "https://hackceleration.com/es/labs/mejor/crm-inmobiliario" },
  { label: "Meta: precios de la plataforma de WhatsApp Business", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Zernio: tarifas de WhatsApp por país, lista del 1 de octubre de 2026", href: "https://zernio.com/whatsapp-api-pricing" },
  { label: "Callbell: precios", href: "https://callbell.eu/en/pricing/" },
  { label: "BOE: Ley de Arrendamientos Urbanos, artículo 20", href: "https://www.boe.es/buscar/act.php?id=BOE-A-1994-26003" },
  { label: "BOE: Ley 12/2023 por el derecho a la vivienda, artículo 31", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2023-12203" },
  { label: "BOE: Real Decreto 515/1989", href: "https://www.boe.es/buscar/act.php?id=BOE-A-1989-11181" },
  { label: "Generalitat de Catalunya: Registro de agentes inmobiliarios", href: "https://tramits.gencat.cat/es/tramits/tramits-temes/Registre_Agents_Immobiliaris_Catalunya" },
  { label: "BOE: Ley 34/2002 (LSSI)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758" },
  { label: "AEPD: derechos ante las llamadas comerciales no solicitadas", href: "https://www.aepd.es/documento/info-derechos-llamadas-comerciales-no-solicitadas.pdf" },
  { label: "EUR-Lex: Reglamento (UE) 2024/1689 de inteligencia artificial", href: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=es" },
];

const questions = [
  {
    id: "gratis",
    q: "¿Hay una IA gratis para inmobiliarias en WhatsApp en España?",
    answer: "Sí. Wapzen es un chatbot de WhatsApp con IA siempre gratis para inmobiliarias y agentes: sin cuota, sin coste por mensaje y sin clave de API de Meta. Responde en segundos en tu propio número, contesta con la información de tus inmuebles, cualifica a compradores e inquilinos y recoge solicitudes de visita. Su agente de voz atiende las llamadas de WhatsApp.",
    body: <>
      <p>Una inmobiliaria encaja muy bien con un agente de IA, porque casi todas las consultas se parecen: “¿sigue disponible?”, “¿cuánto paga de comunidad?”, “¿tiene ascensor?”, “¿cuándo se puede ver?”. Esas respuestas ya están en tu ficha del inmueble, y el agente puede darlas a las once de la noche, cuando el comprador por fin tiene tiempo para mirar pisos.</p>
      <p>No necesitas la API de WhatsApp Business, un proveedor ni la aprobación de Meta. <Link href="/es/chatbot-whatsapp-gratis">Wapzen</Link> vincula tu número actual como un dispositivo, igual que WhatsApp Web, así que los clientes ven el número de siempre y tú sigues usando WhatsApp en el móvil. No hay tope mensual de respuestas, y la IA viene incluida.</p>
    </>,
  },
  {
    id: "leads",
    q: "¿Por qué se enfrían los leads de Idealista y Fotocasa?",
    answer: "Porque quien busca piso suele consultar varios anuncios a la vez, a menudo fuera del horario de oficina, y la primera respuesta útil puede llevarse la conversación. Un estudio de Harvard Business Review sobre empresas de EE. UU. halló que las que intentaban contactar en menos de una hora tenían casi siete veces más probabilidades de cualificar el contacto.",
    body: <>
      <p>Ese estudio no es del sector inmobiliario español, pero la lógica se parece. Mientras enseñas un piso, firmas una reserva o conduces hasta la siguiente visita, entran consultas que nadie contesta. Con el 94 % de los internautas españoles usando WhatsApp cada mes, según IAB Spain, muchos compradores esperan una respuesta por ahí.</p>
      <p>Además, cada contacto cuesta dinero. David Alonso García, autor de un boletín del sector, estima que una agencia paga a Idealista unos 1.000 € al mes de media, y más de 3.000 € en zonas muy disputadas. Es una estimación sin fuente publicada, así que usa tu propia factura: divídela entre los contactos que recibes y sabrás cuánto te cuesta cada uno que se queda sin responder.</p>
      <p>Y el mercado aprieta: la encuesta de Idealista a las agencias refleja previsiones más moderadas para 2026, con menos ventas y más tiempo de negociación. Cuando hay menos operaciones, no conviene perder ninguna por tardar en contestar.</p>
    </>,
  },
  {
    id: "portales",
    q: "¿Cómo funciona con los leads de Idealista, Fotocasa y Habitaclia?",
    answer: "Wapzen no se conecta directamente a los portales. Idealista, por ejemplo, entrega los contactos en su Inbox y por correo, y el agente de IA responde a quien escribe a tu WhatsApp. Por eso envías un primer mensaje a cada contacto, o pones tu enlace de WhatsApp donde lo vea el comprador, y la IA continúa la conversación.",
    body: <>
      <p>Hay tres maneras prácticas de hacerlo:</p>
      <ol>
        <li><strong>Envía un primer mensaje a cada contacto.</strong> Hazlo desde el móvil o sube los contactos del día a Bulk Messages con una plantilla personalizada. Cuando el comprador responde, el agente sigue con la conversación.</li>
        <li><strong>Haz que te escriban a ti.</strong> Pon un <Link href="/tools/whatsapp-link-generator">enlace de WhatsApp</Link> en tu web, anuncios y redes, y un <Link href="/tools/whatsapp-qr-code-generator">código QR de WhatsApp</Link> en el escaparate y en el cartel de “Se vende”. Revisa las normas de cada portal antes de añadir un enlace a un anuncio.</li>
        <li><strong>Deja que el agente de voz llame.</strong> Añade a un contacto que haya pedido una llamada a una campaña de voz y el agente le llamará por WhatsApp al momento. Si tu CRM recibe los contactos de los portales, puede añadirlos mediante nuestra API.</li>
      </ol>
      <p>Este es un primer mensaje para alguien que preguntó por un piso en un portal:</p>
      <pre>{firstMessage}</pre>
      <Note>El agente no ve el texto de los envíos masivos. Por eso el ejemplo de instrucciones de esta guía le explica qué hacer cuando alguien contesta a un mensaje sobre un inmueble.</Note>
    </>,
  },
  {
    id: "cualificar",
    q: "¿Qué debe preguntar la IA para cualificar a un comprador o inquilino?",
    answer: "Seis cosas, de una en una: si quiere comprar o alquilar, zona y tipo de vivienda, presupuesto, plazo o fecha de entrada, si tiene hipoteca aprobada o una vivienda que vender, y cuándo puede visitar. Nunca debe preguntar por nacionalidad, origen, religión o situación familiar. Después propone una visita para que tu agente la confirme.",
    body: <>
      <Comparison caption="Seis preguntas para cualificar a un comprador o inquilino por WhatsApp" columns={["Por qué importa"]} rows={qualify} />
      <p>Si lo pregunta todo en un solo mensaje, la conversación parece un formulario y el cliente se va. Así podría ser en un caso real:</p>
      <ChatExample
        business="Inmobiliaria Demo"
        labels={{ subtitle: "WhatsApp · agente de IA", agent: "Agente: ", patient: "Cliente: " }}
        turns={[
          { from: "patient", text: "Hola, ¿sigue disponible el piso de 3 habitaciones de Ruzafa?" },
          { from: "agent", text: "¡Hola! Soy el asistente virtual de Inmobiliaria Demo. Sí, sigue disponible: 92 m², 3 habitaciones, ascensor y 289.000 €. ¿Lo buscas para vivir o como inversión?" },
          { from: "patient", text: "Para vivir. ¿Se puede negociar el precio?" },
          { from: "agent", text: "Eso lo trata nuestro agente con la propiedad, así que no puedo darte otra cifra. ¿Ya tienes la hipoteca aprobada o la estás mirando?" },
          { from: "patient", text: "La estoy mirando. Podría ir a verlo el sábado por la mañana." },
          { from: "agent", text: "Perfecto. Te anoto: visita el sábado por la mañana, para vivir, hipoteca en estudio. ¿Me dices tu nombre? Nuestro agente te confirmará la hora hoy mismo." },
        ]}
        caption="Conversación ilustrativa de una agencia inventada. Los datos del piso saldrían de las fichas que sube la agencia."
        points={[
          { title: "Una pregunta cada vez", body: "Reúne la intención, la hipoteca y la disponibilidad sin que parezca un formulario." },
          { title: "No promete lo que no puede", body: "Ante una rebaja, remite a tu agente. Las instrucciones le prohíben prometer precios, rentabilidad o hipotecas." },
          { title: "Tu agente confirma la visita", body: "El agente de IA anota la solicitud. No tiene calendario propio salvo que conectes uno con una herramienta de API." },
          { title: "Todo queda en una conversación", body: "Tu comercial lee el chat en el panel antes de llamar, y el cliente no tiene que repetir nada." },
        ]}
      />
    </>,
  },
  {
    id: "activar",
    q: "¿Cómo se pone en marcha sin clave de API de Meta?",
    answer: "Creas una cuenta gratis, pegas las instrucciones en el agente de chat que ya tienes, subes las fichas de tus inmuebles y vinculas tu número con un código QR o un código de vinculación. No necesitas clave de API de Meta, proveedor ni programador. Son unos minutos, y luego lo pruebas desde otro número.",
    body: <>
      <ol>
        <li><strong>Crea tu cuenta gratis.</strong> Sin tarjeta y sin clave de API.</li>
        <li><strong>Pega las instrucciones.</strong> Usa el ejemplo de abajo y cambia los datos.</li>
        <li><strong>Sube tus inmuebles.</strong> Fichas con precio, superficie, comunidad, certificado energético y enlace al anuncio, en texto, PDF o Word. Un folleto escaneado no se puede leer: usa una versión con texto seleccionable o escribe los datos clave.</li>
        <li><strong>Vincula el número.</strong> En un ordenador, abre WhatsApp en el móvil, ve a Dispositivos vinculados y escanea el código QR. En el móvil, introduce el código de vinculación de 8 caracteres.</li>
        <li><strong>Pruébalo.</strong> Escribe desde otro número las preguntas de tus clientes, incluidas las difíciles, como “¿cuánto se va a revalorizar?”.</li>
      </ol>
      <pre>{prompt}</pre>
      <p>Cada cuenta tiene un agente de chat, así que reúne toda tu cartera en su información y quita los inmuebles en cuanto se vendan o se alquilen, para que no ofrezca lo que ya no tienes.</p>
      <InlineCta title="Responde a tu próximo contacto en segundos" body="Siempre gratis, sin clave de API de Meta, sin tarjeta y sin coste por mensaje." label="Empieza gratis" />
    </>,
  },
  {
    id: "coste",
    q: "¿Cuánto cuesta un chatbot de WhatsApp para una inmobiliaria en España?",
    answer: "Con la API oficial y una plataforma como Callbell, una agencia con 20 contactos al día pagaría unos 156 € al mes sin IVA: 93 € de plataforma y unos 63 € de tarifas de Meta. Con Wapzen son 0 € al mes, siempre, porque no usa la API de Meta y no cobra por mensaje ni por respuesta.",
    body: <>
      <Comparison caption="Coste de atender a clientes inmobiliarios por WhatsApp en España: API oficial frente a Wapzen" columns={["API oficial de WhatsApp Business", "Wapzen"]} rows={costs} />
      <h3>Un ejemplo con números</h3>
      <p>Una agencia recibe 20 contactos al día, con 8 respuestas por contacto (<strong>4.800 respuestas al mes</strong>):</p>
      <ul>
        <li><strong>Respuestas:</strong> descontando las 1.000 gratis, 3.800 × 0,0166 € = <strong>63,08 €</strong>.</li>
        <li><strong>Plataforma:</strong> en Callbell, 14 € por agente + 20 € de cuenta de WhatsApp + 59 € del creador de bots = <strong>93 €</strong>.</li>
        <li><strong>Total:</strong> unos <strong>156 € al mes</strong> sin IVA.</li>
        <li><strong>Un aviso a 500 contactos:</strong> 500 × 0,0585 € = <strong>29,25 €</strong> de Meta por cada envío, y 0,02 € por contacto alcanzado en Callbell.</li>
        <li><strong>Con Wapzen:</strong> <strong>0 €</strong> en todo. La diferencia está en la velocidad: con la pausa predeterminada de 30 segundos, 500 mensajes tardan algo más de 4 horas, y no son plantillas aprobadas.</li>
      </ul>
      <Note>Tarifas de Meta para España de la lista del 1 de octubre de 2026; cambian cada trimestre. Precios de Callbell consultados el 4 de noviembre de 2026: su página no da un precio aparte para la IA, y ChatGPT aparece solo en el plan Enterprise.</Note>
    </>,
  },
  {
    id: "voz",
    q: "¿La IA también contesta las llamadas de compradores?",
    answer: "Sí, el agente de voz ya funciona. Contesta las llamadas de WhatsApp a tu número en español de España, con la misma información de tus inmuebles, y anota lo que busca cada cliente. También es gratis y no tiene coste por minuto. Atiende llamadas de WhatsApp, no de teléfono fijo, y no transfiere la llamada a una persona en directo.",
    body: <>
      <p>Muchos compradores llaman en cuanto un piso les interesa de verdad. Si lo hacen por WhatsApp mientras estás en una visita, el agente contesta, da los datos básicos y recoge su interés. Como no puede pasarte la llamada en directo, avisa de que tu comercial le llamará.</p>
      <ul>
        <li><strong>Llamadas entrantes:</strong> disponibilidad, precio, características y solicitudes de visita.</li>
        <li><strong>Llamadas salientes:</strong> en una campaña, añades el nombre y el número de un contacto y el agente le llama por WhatsApp al momento. Con la API oficial, las llamadas que inicia la empresa cuestan 0,0129 dólares por minuto en España, más la plataforma de voz.</li>
        <li><strong>Una pausa breve:</strong> hay uno o dos segundos antes de cada respuesta.</li>
      </ul>
      <p>Llama solo a quien te lo haya pedido, y nunca a listas compradas. La Ley General de Telecomunicaciones reconoce el derecho a no recibir llamadas comerciales no deseadas. No hemos encontrado un criterio específico sobre las llamadas de WhatsApp, así que no las trates como una excepción. Tienes más detalles en <Link href="/es/llamadas-con-ia">llamadas con IA</Link>.</p>
      <InlineCta href={voiceAccess} title="Añade el agente de voz para quien prefiere llamar" body="El agente de voz también es gratis. Escríbenos por WhatsApp y lo activamos en tu número." label="Escríbenos por WhatsApp" />
    </>,
  },
  {
    id: "crm",
    q: "¿Necesito además un CRM inmobiliario?",
    answer: "Si tienes equipo, probablemente sí. Un CRM como Inmovilla, Witei o Mobilia gestiona la cartera, las demandas, los cruces y la publicación en portales. Wapzen atiende y cualifica por WhatsApp y guarda cada conversación, pero no es un CRM. Un agente independiente puede empezar sin él, y una herramienta de API puede enviar datos al CRM de tu agencia.",
    body: <>
      <Comparison caption="Un CRM inmobiliario frente al agente de IA de Wapzen" columns={["CRM inmobiliario", "Wapzen"]} rows={crm} />
      <p>Si buscabas un “CRM inmobiliario gratis”, Wapzen no lo sustituye: es la primera conversación, no la gestión de la agencia. Mobilia publica precios desde 49 € al mes sin IVA, mientras que Inmovilla no los muestra en su web, según una comparativa reciente, así que tendrás que pedir presupuesto.</p>
      <p>Una <strong>herramienta de API</strong> puede enviar a tu CRM el presupuesto, la zona y la solicitud de visita durante la conversación, si tu CRM ofrece una API. Pruébala varias veces antes de confiar en ella.</p>
      <p>Cuando tu comercial se ocupe de un cliente, apaga el <strong>interruptor de IA</strong> de esa conversación. El agente deja de contestar a esa persona y sigue con las demás. No se apaga solo cuando respondes tú, así que acuérdate de usarlo.</p>
    </>,
  },
  {
    id: "captar",
    q: "¿Cómo ayuda a captar clientes y propietarios?",
    answer: "Te da un canal abierto a todas horas allí donde te ven: un código QR de WhatsApp en el cartel de “Se vende”, en el escaparate y en tus buzoneos, y un enlace en tu web y tus redes. La IA recoge los datos del propietario que quiere vender y tu comercial le llama. A quien te consultó puedes avisarle de novedades si lo ha autorizado.",
    body: <>
      <p>Captar propietarios es el trabajo más valioso de muchas agencias, y a menudo empieza con una duda fuera de horario: “¿cuánto vale mi piso?”. El agente no debe dar una valoración, pero sí puede recoger la zona, el tipo de inmueble y la mejor hora para llamar.</p>
      <p>Bulk Messages acepta una hoja de Excel o CSV y rellena los campos como <code>{"{{nombre}}"}</code> con tus columnas. Por ejemplo, para avisar de un inmueble nuevo:</p>
      <pre>{newListing}</pre>
      <p>Antes de enviar promociones, revisa la LSSI: en general necesitas una autorización previa o una relación contractual anterior con esa persona. No uses bases de datos compradas. Tienes más información en nuestra <Link href="/blog/whatsapp-bulk-message-sender-free">guía de envíos masivos</Link>, en inglés.</p>
    </>,
  },
  {
    id: "normativa",
    q: "¿Qué normas debe respetar el chatbot de una inmobiliaria en España?",
    answer: "Tres sobre todo: lo que se anuncia de una vivienda puede ser exigible aunque no esté en el contrato (Real Decreto 515/1989), el comprador o inquilino puede pedir información antes de pagar nada (artículo 31 de la Ley 12/2023) y los gastos de gestión no se repercuten al inquilino de vivienda (artículo 20 de la LAU).",
    body: <>
      <p>Esto es información general, no asesoramiento legal:</p>
      <ul>
        <li><strong>Datos exactos.</strong> Según el Real Decreto 515/1989, la publicidad debe ajustarse a las características reales de la vivienda, y sus datos son exigibles aunque no aparezcan en el contrato. Trata lo que diga el agente con el mismo cuidado que un anuncio y mantén sus fichas al día.</li>
        <li><strong>Información previa.</strong> El artículo 31 de la Ley 12/2023 permite pedir, antes de pagar ninguna cantidad, el precio total, la superficie, el certificado energético, las cargas y otros datos. Ten a mano un enlace o documento para entregarlos: el agente de chat responde con texto.</li>
        <li><strong>Alquiler de vivienda.</strong> Según el artículo 20 de la LAU, los gastos de gestión inmobiliaria y de formalización del contrato no se pueden repercutir al inquilino. Por eso aparece en las instrucciones de ejemplo.</li>
        <li><strong>Cataluña.</strong> La inscripción en el Registro de Agentes Inmobiliarios es obligatoria. Conviene añadir tu número a la información del agente.</li>
        <li><strong>IA y datos.</strong> El artículo 50 del Reglamento de IA exige que el cliente sepa que habla con una IA, salvo que resulte evidente, y Wapzen no añade el aviso por su cuenta. Nombres, teléfonos y solicitudes son datos personales sujetos al RGPD. La base de datos principal de Wapzen está en Singapur, sus servidores en Singapur y Alemania, y proveedores de IA como OpenAI pueden tratar los mensajes en Estados Unidos. Wapzen no publica un contrato estándar de encargado del tratamiento: si lo necesitas, pregúntanos antes de conectar el número. Más detalles en la <Link href="/privacy">política de privacidad</Link>, en inglés.</li>
      </ul>
    </>,
  },
  {
    id: "limites",
    q: "¿Qué no puede hacer una IA gratis en una inmobiliaria?",
    answer: "Wapzen no envía PDF ni imágenes, no contesta en grupos, no se conecta directamente a los portales, no lleva cartera ni seguimientos, y no reserva una hora en un calendario sin una herramienta de API. Cada cuenta tiene un agente de chat. Tampoco usa la API oficial de Meta, así que no incluye insignia verde ni plantillas aprobadas.",
    body: <>
      <Comparison caption="Para qué inmobiliarias encaja un chatbot de WhatsApp gratis" columns={["¿Te encaja?", "Por qué"]} rows={fit} />
      <ul>
        <li><strong>Las fotos y los planos van por enlace.</strong> El agente no adjunta archivos, así que añade el enlace del anuncio a cada ficha.</li>
        <li><strong>Tus grupos quedan al margen.</strong> El agente ignora los grupos, de modo que tus colaboradores no recibirán respuestas de IA.</li>
        <li><strong>Revisa lo que dice.</strong> Lee las conversaciones durante los primeros días y actualiza las fichas cuando cambien los precios.</li>
        <li><strong>El panel está en inglés.</strong> El agente responde en español.</li>
      </ul>
      <p>Wapzen es un producto independiente: no pertenece a Meta ni a WhatsApp.</p>
    </>,
  },
];

export default function IaParaInmobiliariasWhatsAppPage() {
  return <QaPost
    href={href}
    heading={<>IA para inmobiliarias en WhatsApp.<br /><span>Siempre gratis, sin API de Meta y con agente de voz.</span></>}
    lead="Quien te escribe por un piso a las nueve de la noche suele estar escribiendo también a otras agencias. Aquí respondemos, una a una, las dudas de las inmobiliarias y los agentes de España antes de poner una IA en su WhatsApp: cómo funciona con los contactos de Idealista y Fotocasa, qué preguntar, cuánto cuesta la alternativa y qué normas debe respetar, sin clave de API de Meta."
    verdict={{
      title: "La respuesta corta",
      body: <><strong>Wapzen</strong> es una IA para inmobiliarias en WhatsApp, <strong>siempre gratis y sin clave de API de Meta</strong>. Responde a cada consulta en segundos en tu número, contesta con tus fichas de inmuebles, pregunta presupuesto, zona y plazo, y anota las solicitudes de visita. Su agente de voz atiende las llamadas de WhatsApp. No sustituye a un CRM y no se conecta directamente a los portales.</>,
    }}
    facts={[["Precio", "Siempre gratis"], ["Clave de API de Meta", "No hace falta"], ["Respuestas", "Sin límite mensual"], ["Llamadas", "Agente de voz funcionando"]]}
    indexTitle="Las 11 preguntas de esta guía"
    answerLabel="Respuesta corta"
    questions={questions}
    sources={sources}
    related={["/es/blog/chatbot-whatsapp-clinica-dental", "/es/blog/whatsapp-hoteles-apartamentos-turisticos"]}
    product="/es/llamadas-con-ia"
    cta={{ heading: <>No pierdas compradores por tardar en responder.<br /><span>Siempre gratis, sin API de Meta.</span></>, body: "Crea tu cuenta, dale las fichas de tus inmuebles y vincula tu número en unos minutos. Sin tarjeta y sin coste por mensaje." }}
  />;
}
