import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Búsquedas (autocompletado Google, YouTube y DuckDuckGo con gl=es, 2026-11-04, ver
// docs/seo-research.md, "Spain buyer posts"): "marketing clinica dental" (30), "software
// clinica dental" (20), "chatbot clinica dental", "ia para clinicas dentales", "whatsapp
// clinica dental", "como captar pacientes para clinica dental" (10 cada una). A pedido del
// usuario (2026-11-04): Wapzen se presenta como siempre gratis y sin clave de API de Meta,
// el agente de voz como funcionando, sin nota sobre bloqueos de número y sin mencionar el
// límite por hora. El servidor mantiene HOURLY_REPLY_LIMIT = 100, así que el texto dice
// "conversaciones ilimitadas" y "sin límite mensual", nunca "respuestas ilimitadas". El CTA
// de voz abre WhatsApp porque el panel aún muestra VoiceUpdateNote. Precios de ejemplo
// inventados. Tarifas de Meta: lista del 1 oct 2026; se revisan cada trimestre.
const href = "/es/blog/chatbot-whatsapp-clinica-dental";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hola, quiero activar el agente de voz de Wapzen en mi clínica dental en España.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es", article: { publishedTime: post.published, modifiedTime: post.updated } });

const answers = [
  ["“¿Cuánto cuesta una limpieza?”", "Sí", "Con tu lista de precios"],
  ["“¿La primera visita es gratis?”", "Sí", "Con las condiciones de tu clínica"],
  ["“¿Financiáis la ortodoncia?”", "Sí", "Con tus plazos, sin prometer la aprobación"],
  ["“¿Trabajáis con mi seguro dental?”", "Sí", "Con tu lista de aseguradoras"],
  ["“¿Cuánto me costaría un implante?”", "En parte", "Da el precio orientativo y ofrece una valoración"],
  ["“Tengo un flemón, ¿qué me tomo?”", "No", "No recomienda medicación: ofrece que recepción busque una urgencia"],
  ["“Te mando una foto, ¿es una caries?”", "No", "No valora fotos: propone una visita"],
];

const software = [
  ["Responder en WhatsApp al momento, también de noche", "Según el programa y sus módulos", "Sí"],
  ["Contestar preguntas abiertas con tu información", "Según el programa y sus módulos", "Sí"],
  ["Atender llamadas de WhatsApp con voz de IA", "Según el programa y sus módulos", "Sí"],
  ["Agenda de gabinetes y doctores", "Sí", "No"],
  ["Historia clínica y odontograma", "Sí", "No"],
  ["Presupuestos y facturación", "Sí", "No"],
];

const costs = [
  ["Plataforma", "Según el proveedor. En Callbell: 93 € al mes con un agente, cuenta de WhatsApp y creador de bots", "0 €, siempre"],
  ["Respuestas a pacientes", "1.000 gratis al mes por número; después, 0,0166 € cada una", "0 €, sin límite mensual"],
  ["Recordatorios de cita", "0,0166 € cada uno", "0 €"],
  ["Promociones", "0,0585 € cada una", "0 €"],
  ["API de Meta y clave de acceso", "Necesarias", "No hacen falta"],
];

const fit = [
  ["Clínica con recepción que no da abasto entre mostrador, teléfono y WhatsApp", "Sí", "Atiende las preguntas repetidas mientras tu equipo está con pacientes"],
  ["Clínica que recibe consultas de noche o en fin de semana", "Sí", "Responde al momento y deja la solicitud lista para recepción"],
  ["Clínica con pacientes extranjeros, en la costa o las islas", "Sí", "Contesta en el idioma del paciente si se lo indicas en las instrucciones"],
  ["Clínica que quiere triaje o consejo clínico por chat", "No", "El agente hace de recepción: no diagnostica"],
  ["Cadena que quiere un agente distinto por sede", "Según el caso", "Cada cuenta tiene un agente de chat: reúne las sedes en su información o usa una cuenta por sede"],
  ["Cadena que necesita insignia verde o plantillas aprobadas", "No", "Eso solo existe en la API oficial de Meta"],
];

const prompt = `Eres el asistente virtual de Clínica Dental Demo, en Chamberí, Madrid.
Responde en el idioma del paciente (por defecto, español de España), con dos o tres frases, y haz una sola pregunta cada vez.
Di en tu primer mensaje que eres un asistente virtual, no un dentista.
Responde sobre tratamientos, precios, primera visita, financiación, aseguradoras, horarios y cómo llegar solo con la información que te hemos dado. Si no tienes un dato, dilo y ofrece que recepción le llame.
Si el precio depende de una valoración, da el precio orientativo si lo tienes y explica que el presupuesto final se da en la visita.
No diagnostiques, no recomiendes medicación, no valores fotos y no garantices resultados. Si alguien tiene dolor fuerte o inflamación, dile que recepción buscará el primer hueco de urgencia. Si describe algo grave, como dificultad para respirar o una hemorragia que no para, dile que llame al 112.
Para pedir cita, pregunta el nombre, el tipo de visita (revisión, limpieza, implantes, ortodoncia u otra) y el día y la franja que prefiere. Repite la solicitud y avisa de que recepción confirmará la hora por este chat.
No pidas DNI, historia clínica, radiografías ni detalles de salud.
Si alguien contesta a un recordatorio de cita, agradece la respuesta y, si quiere cambiarla, recoge el nuevo día y la franja.
Horario de recepción: de lunes a viernes, de 9:00 a 20:00.`;

const reminder = `Hola {{nombre}}, te recordamos tu cita en Clínica Dental Demo mañana a las {{hora}}. ¿Nos confirmas que vienes? Si necesitas cambiarla, respóndenos por aquí.`;

const sources = [
  { label: "PPC Land: Estudio de Redes Sociales 2026 de IAB Spain", href: "https://ppc.land/spains-social-media-users-jump-to-7-2-platforms-but-42-quit-at-least-one/" },
  { label: "Redacción Médica: dentistas colegiados en España, datos del INE de 2025", href: "https://www.redaccionmedica.com/profesionales/20260527/espana-registra-dentistas-colegiados-un-mas-que-hace-ano/272349_0.amp.html" },
  { label: "Redacción Médica: más de 23.000 clínicas dentales registradas (2022)", href: "https://www.redaccionmedica.com/profesionales/20220719/el-plan-de-salud-bucodental-del-gobierno-solo-cuenta-con-dentistas/188000_0.html" },
  { label: "El Independiente: lo que cuestan las ausencias a las clínicas privadas", href: "https://www.elindependiente.com/sociedad/2025/09/29/las-ausencias-a-citas-medicas-cuestan-hasta-7-500-euros-al-mes-a-las-clinicas-privadas/" },
  { label: "Meta: precios de la plataforma de WhatsApp Business", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Zernio: tarifas de WhatsApp por país, lista del 1 de octubre de 2026", href: "https://zernio.com/whatsapp-api-pricing" },
  { label: "Callbell: precios", href: "https://callbell.eu/en/pricing/" },
  { label: "Aurora Inbox: chatbot de WhatsApp para clínicas dentales", href: "https://www.aurorainbox.com/chatbot-clinicas-dentales-whatsapp/" },
  { label: "Clínica Universidad de Navarra: consentimiento para avisos por WhatsApp", href: "https://www.cun.es/consentimiento-whatsapp/firma" },
  { label: "EUR-Lex: Reglamento General de Protección de Datos", href: "https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=es" },
  { label: "EUR-Lex: Reglamento (UE) 2024/1689 de inteligencia artificial", href: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=es" },
  { label: "AEPD: protección de datos para pymes", href: "https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/directrices-de-aplicacion/pymes" },
  { label: "AEPD: derechos ante las llamadas comerciales no solicitadas", href: "https://www.aepd.es/documento/info-derechos-llamadas-comerciales-no-solicitadas.pdf" },
  { label: "BOE: Ley 34/2002 (LSSI)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758" },
];

const questions = [
  {
    id: "gratis",
    q: "¿Existe un chatbot de WhatsApp gratis para clínicas dentales en España?",
    answer: "Sí. Wapzen es un chatbot de WhatsApp con IA siempre gratis para clínicas dentales: conversaciones ilimitadas, sin cuota mensual, sin coste por mensaje, sin tarjeta y sin clave de API de Meta. Responde a los pacientes a cualquier hora en tu propio número, con tus tratamientos, precios y horarios, y su agente de voz contesta las llamadas de WhatsApp.",
    body: <>
      <p>Al buscar un “chatbot para clínicas dentales” casi siempre aparece una prueba de pocos días, un menú de botones sin IA o una plataforma de pago a la que se suman las tarifas de Meta. <Link href="/es/chatbot-whatsapp-gratis">Wapzen</Link> funciona de otra manera: vincula el número que ya usa tu clínica como un dispositivo, igual que WhatsApp Web. Por eso no necesitas la API de WhatsApp Business, un proveedor ni la aprobación de Meta.</p>
      <p>Los pacientes siguen escribiendo al número de siempre y tú sigues usando WhatsApp en el móvil. El modelo de IA viene incluido, así que tampoco necesitas una clave de OpenAI ni un programador. Las conversaciones son ilimitadas y no hay tope mensual de respuestas: una clínica no paga más porque le escriban más pacientes.</p>
    </>,
  },
  {
    id: "por-que",
    q: "¿Por qué una clínica dental necesita responder antes por WhatsApp?",
    answer: "Porque recepción no puede atender a la vez el mostrador, el teléfono y el WhatsApp, y muchos mensajes llegan con la clínica cerrada. En España hay 43.672 dentistas colegiados, según datos del INE de 2025, y el 94 % de los internautas usa WhatsApp cada mes: un paciente sin respuesta puede escribir a otra clínica en un minuto.",
    body: <>
      <p>Las cifras explican la presión. Los dentistas colegiados crecieron un 1,9 % en un año y hace ya tiempo que el sector superaba las 23.000 clínicas registradas, según el dato de 2022. Las clínicas invierten en anuncios, web y reseñas para que el teléfono suene, pero una parte de ese interés acaba hoy en WhatsApp: el Estudio de Redes Sociales 2026 de IAB Spain sitúa su alcance mensual en el 94 %, y el 97 % de sus usuarios lo abre a diario.</p>
      <p>La mayoría de esas preguntas se repiten y ya tienen respuesta en tu lista de precios. Un mensaje sobre un implante o una ortodoncia que se queda sin contestar hasta el día siguiente puede ser un tratamiento que empieza en otra clínica. Por eso el mejor primer uso de la IA no es sustituir a recepción, sino quitarle lo repetitivo para que pueda atender al paciente que tiene delante.</p>
    </>,
  },
  {
    id: "que-responde",
    q: "¿Qué puede responder el chatbot de una clínica dental y qué no?",
    answer: "Puede responder sobre tratamientos, precios orientativos, primera visita, financiación, aseguradoras, horarios y cómo llegar, y recoger solicitudes de cita. No debe diagnosticar, recomendar medicación ni valorar fotos de la boca: esos casos pasan a tu equipo, y ante una situación grave debe indicar que se llame al 112.",
    body: <>
      <Comparison caption="Qué responde un agente de IA en el WhatsApp de una clínica dental" columns={["¿Responde?", "Cómo"]} rows={answers} />
      <p>Así podría ser una conversación, a las diez de la noche y con la clínica cerrada:</p>
      <ChatExample
        business="Clínica Dental Demo"
        labels={{ subtitle: "WhatsApp · agente de IA", agent: "Agente: ", patient: "Paciente: " }}
        turns={[
          { from: "patient", text: "Hola, buenas noches. ¿Cuánto cuesta un implante? Me falta una muela de abajo." },
          { from: "agent", text: "¡Hola! Soy el asistente virtual de Clínica Dental Demo. El implante unitario parte de 950 €, pero el precio final depende de la valoración, que cuesta 30 € e incluye radiografía. ¿Quieres que te anote para una primera visita?" },
          { from: "patient", text: "Vale. ¿Tenéis financiación?" },
          { from: "agent", text: "Sí, hasta 24 meses, sujeta a la aprobación de la financiera. ¿Qué día te viene mejor, y prefieres mañana o tarde?" },
          { from: "patient", text: "El jueves por la tarde. Soy Lucía Ortega." },
          { from: "agent", text: "Gracias, Lucía. Te anoto: primera visita de implantes, jueves por la tarde. Recepción te confirmará la hora por este chat mañana a partir de las 9:00." },
        ]}
        caption="Conversación ilustrativa de una clínica inventada. Los precios saldrían de los documentos que sube la clínica."
        points={[
          { title: "Avisa de que es una IA", body: "Se presenta como asistente virtual desde el primer mensaje, porque así se lo indican las instrucciones." },
          { title: "No cierra un presupuesto", body: "Da el precio orientativo y deja el presupuesto final para la valoración." },
          { title: "Recepción confirma", body: "Recoge el tipo de visita, el día y la franja. La hora la confirma tu equipo desde el panel." },
          { title: "Tampoco pide datos de salud", body: "Le basta con el nombre y el tipo de visita. No pregunta síntomas ni historial." },
        ]}
      />
    </>,
  },
  {
    id: "citas",
    q: "¿Puede agendar citas en el programa de gestión de la clínica?",
    answer: "Sí, de dos formas. La sencilla: recoge la solicitud y recepción confirma la hora desde el panel. La conectada: consulta los huecos en tu programa de gestión con una herramienta de API, si ese programa ofrece una API. Wapzen no trae agenda propia ni sustituye a programas como Gesden o Clinic Cloud.",
    body: <>
      <ol>
        <li><strong>Solicitud que confirma recepción.</strong> Es la opción con la que conviene empezar. Cada conversación queda guardada en el panel de Wapzen y recepción responde desde ahí.</li>
        <li><strong>Agenda conectada.</strong> Pregunta a tu proveedor de software si ofrece una API. Si la tiene, el agente puede consultar huecos durante la conversación. Prueba cada caso varias veces y comprueba en la agenda que la cita se ha creado.</li>
        <li><strong>Lista de solicitudes.</strong> Take Order se pensó para pedidos, pero guarda en una lista cualquier solicitud que el paciente confirme, con su número. Pruébala antes de depender de ella para las citas.</li>
      </ol>
      <p>Si buscabas “software para clínica dental”, ten en cuenta que resuelven problemas distintos y funcionan bien juntos:</p>
      <Comparison caption="Un programa de gestión dental frente al agente de IA de Wapzen" columns={["Programa de gestión", "Wapzen"]} rows={software} />
      <p>Cuando un paciente prefiera hablar con una persona, apaga el <strong>interruptor de IA</strong> de esa conversación. El agente deja de contestar a ese paciente y sigue con los demás. No se apaga solo cuando respondes tú, así que acuérdate de usarlo.</p>
    </>,
  },
  {
    id: "ausencias",
    q: "¿Sirve para reducir las ausencias y los no-shows en una clínica dental?",
    answer: "Puede ayudar, porque hace muy fácil confirmar o cambiar una cita por WhatsApp. Cada tarde subes la lista de citas de mañana a Bulk Messages, cada paciente recibe un recordatorio con su nombre y su hora, y el agente atiende a quien responde. Un portavoz del sector estima que entre el 12 % y el 19 % de las citas no se atienden.",
    body: <>
      <p>Esa estimación, y la de que las ausencias cuestan entre 2.500 y 7.500 € al mes por clínica, vienen de Enrique Pizarro, consejero delegado de Klinikare, una empresa que vende software a clínicas. Se refieren a clínicas privadas en general y no son un estudio dental, así que lo más útil es medir tu propia tasa antes y después.</p>
      <p>Esta plantilla funciona con una hoja de Excel o CSV con las columnas <code>nombre</code> y <code>hora</code>:</p>
      <pre>{reminder}</pre>
      <p>Con la pausa predeterminada de 30 segundos entre envíos, 20 recordatorios tardan unos 10 minutos. Wapzen no los envía solo a una hora fija: alguien tiene que subir la lista cada día. Y el agente no ve el texto de los envíos masivos, así que el aviso sobre recordatorios debe estar en sus instrucciones, como en el ejemplo de esta guía.</p>
      <Note>Pon solo el nombre, la fecha, la hora y la dirección. Nunca el tratamiento ni el motivo de la visita: un recordatorio puede verse en la pantalla bloqueada del móvil.</Note>
    </>,
  },
  {
    id: "activar",
    q: "¿Cómo se configura sin clave de API de Meta?",
    answer: "Creas una cuenta gratis, pegas las instrucciones en el agente de chat que ya tienes en tu cuenta, subes tus precios y tratamientos, y vinculas el número con un código QR o un código de vinculación. No necesitas clave de API de Meta, proveedor ni programador. Son unos minutos, y luego lo pruebas desde otro número.",
    body: <>
      <ol>
        <li><strong>Crea tu cuenta gratis.</strong> Sin tarjeta y sin clave de API. Tu cuenta ya incluye un agente de chat listo para configurar.</li>
        <li><strong>Pega las instrucciones.</strong> Usa el ejemplo de abajo y cambia los datos por los de tu clínica.</li>
        <li><strong>Sube tu información.</strong> Precios, tratamientos, aseguradoras, condiciones de financiación y preguntas frecuentes, en texto, PDF o Word. Un PDF escaneado no se puede leer: usa una versión con texto seleccionable o escribe los datos clave.</li>
        <li><strong>Vincula el número.</strong> En un ordenador, abre WhatsApp en el móvil, ve a Dispositivos vinculados y escanea el código QR. En el móvil, introduce el código de vinculación de 8 caracteres.</li>
        <li><strong>Pruébalo.</strong> Escribe desde otro número lo que preguntan tus pacientes, incluidas las preguntas difíciles, como “¿qué me tomo para el dolor?”.</li>
      </ol>
      <pre>{prompt}</pre>
      <InlineCta title="Pon a tu clínica a responder esta misma noche" body="Siempre gratis, sin clave de API de Meta, sin tarjeta y sin coste por mensaje." label="Empieza gratis" />
    </>,
  },
  {
    id: "coste",
    q: "¿Cuánto cuesta un chatbot de WhatsApp para una clínica dental en España?",
    answer: "Con la API oficial y una plataforma como Callbell, una clínica con 30 consultas al día pagaría unos 173 € al mes sin IVA: 93 € de plataforma y unos 80 € de tarifas de Meta. Con Wapzen son 0 € al mes, siempre, porque no usa la API de Meta y no cobra por mensaje ni por respuesta.",
    body: <>
      <Comparison caption="Coste de atender a pacientes por WhatsApp en España: API oficial frente a Wapzen" columns={["API oficial de WhatsApp Business", "Wapzen"]} rows={costs} />
      <h3>Un ejemplo con números</h3>
      <p>Una clínica recibe 30 consultas al día, con 6 respuestas por consulta (<strong>5.400 respuestas al mes</strong>), y envía 20 recordatorios durante 22 días (<strong>440 al mes</strong>):</p>
      <ul>
        <li><strong>Respuestas:</strong> descontando las 1.000 gratis, 4.400 × 0,0166 € = <strong>73,04 €</strong>.</li>
        <li><strong>Recordatorios:</strong> 440 × 0,0166 € = <strong>7,30 €</strong>.</li>
        <li><strong>Plataforma:</strong> en Callbell, 14 € por agente + 20 € de cuenta de WhatsApp + 59 € del creador de bots = <strong>93 €</strong>.</li>
        <li><strong>Total:</strong> unos <strong>173 € al mes</strong> sin IVA, cerca de 2.080 € al año.</li>
        <li><strong>Con Wapzen:</strong> <strong>0 €</strong>.</li>
      </ul>
      <p>Otras opciones cuestan más: Aurora Inbox indica entre 99 y 179 dólares al mes según el volumen en su página para clínicas dentales.</p>
      <Note>Tarifas de Meta para España de la lista del 1 de octubre de 2026; cambian cada trimestre. Precios de Callbell consultados el 4 de noviembre de 2026: su página no da un precio aparte para la IA, y ChatGPT aparece solo en el plan Enterprise.</Note>
    </>,
  },
  {
    id: "voz",
    q: "¿El agente de voz también contesta las llamadas de los pacientes?",
    answer: "Sí, el agente de voz ya funciona. Contesta las llamadas de WhatsApp a tu número en español de España, responde con la misma información que el chatbot y recoge solicitudes de cita. También es gratis y no tiene coste por minuto. Atiende llamadas de WhatsApp, no de teléfono fijo, y no transfiere la llamada a una persona en directo.",
    body: <>
      <p>Muchos pacientes prefieren hablar, sobre todo los mayores o quienes tienen una duda sobre un tratamiento largo. Si llaman al WhatsApp de la clínica mientras recepción está ocupada, el agente contesta, resuelve lo básico y anota lo que necesitan.</p>
      <ul>
        <li><strong>Llamadas entrantes:</strong> precios, horarios, seguros y solicitudes de cita.</li>
        <li><strong>Llamadas salientes:</strong> en una campaña, añades el nombre y el número de una persona y el agente la llama por WhatsApp al momento. Con la API oficial, las llamadas que inicia la empresa cuestan 0,0129 dólares por minuto en España, más la plataforma de voz.</li>
        <li><strong>Sin transferencia en directo:</strong> el agente avisa de que recepción devolverá la llamada. Hay una pausa de uno o dos segundos antes de cada respuesta.</li>
      </ul>
      <p>Llama solo a quien lo haya pedido. La Ley General de Telecomunicaciones reconoce el derecho a no recibir llamadas comerciales no deseadas. No hemos encontrado un criterio específico sobre las llamadas de WhatsApp, así que no las trates como una excepción. Tienes más detalles en <Link href="/es/llamadas-con-ia">llamadas con IA</Link>.</p>
      <InlineCta href={voiceAccess} title="Añade el agente de voz para los pacientes que llaman" body="El agente de voz también es gratis. Escríbenos por WhatsApp y lo activamos en tu número." label="Escríbenos por WhatsApp" />
    </>,
  },
  {
    id: "audios",
    q: "¿El chatbot entiende audios y fotos?",
    answer: "Sí, si lo activas. En el agente hay dos interruptores, audios y fotos, que vienen apagados. Con el primero, transcribe la nota de voz y la contesta. Con el segundo, lee la imagen. En una clínica dental conviene activar los audios y dejar las fotos apagadas, porque una foto de la boca o una radiografía son datos de salud.",
    body: <>
      <p>En España se envían muchas notas de voz, así que el interruptor de audios suele merecer la pena. Ten en cuenta que un paciente también puede contar sus síntomas en un audio: las instrucciones deben indicar que no los valore y que proponga una visita.</p>
      <p>Si dejas las fotos apagadas, el agente no las interpreta. Tu equipo puede verlas en el móvil y decidir qué hacer.</p>
    </>,
  },
  {
    id: "rgpd",
    q: "¿Se puede usar un chatbot de WhatsApp en una clínica dental? RGPD y datos de salud",
    answer: "Sí, para tareas de recepción y con cuidado. Los datos de salud son una categoría especial del RGPD, así que el chatbot debe limitarse a gestiones como precios y citas, sin pedir síntomas ni historial. El Reglamento de IA exige además que el paciente sepa que habla con una IA. Revisa tu caso con tu delegado de protección de datos.",
    body: <>
      <p>Esto es información general, no asesoramiento legal:</p>
      <ul>
        <li><strong>Pide lo mínimo.</strong> Para una cita bastan el nombre, el tipo de visita, el día y la franja.</li>
        <li><strong>Avisa de que es una IA.</strong> El artículo 50 del Reglamento de IA lo exige salvo que resulte evidente. Wapzen no añade el aviso por su cuenta: inclúyelo en las instrucciones, como en el ejemplo.</li>
        <li><strong>Recoge el permiso para los avisos.</strong> La Clínica Universidad de Navarra, por ejemplo, pide consentimiento expreso a sus pacientes para enviar notificaciones por WhatsApp.</li>
        <li><strong>Separa promociones y citas.</strong> Que alguien pida cita no te autoriza por sí solo a enviarle publicidad. Revisa la LSSI antes de enviar promociones.</li>
        <li><strong>Debes saber dónde están los datos.</strong> La base de datos principal de Wapzen está en Singapur, sus servidores en Singapur y Alemania, y proveedores de IA como OpenAI pueden tratar los mensajes en Estados Unidos. Las conversaciones se guardan hasta que las borras. Los detalles están en la <Link href="/privacy">política de privacidad</Link>, en inglés.</li>
        <li><strong>Pide el contrato si lo necesitas.</strong> Wapzen no publica un contrato estándar de encargado del tratamiento. Si tu clínica lo requiere, pregúntanos por WhatsApp antes de conectar el número.</li>
      </ul>
      <p>La <a href="https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/directrices-de-aplicacion/pymes" target="_blank" rel="noopener noreferrer">Agencia Española de Protección de Datos</a> tiene recursos para pymes que te ayudarán a prepararlo.</p>
    </>,
  },
  {
    id: "limites",
    q: "¿Qué no puede hacer Wapzen en una clínica dental?",
    answer: "No sustituye a tu programa de gestión: no lleva historia clínica, agenda de gabinetes ni facturación. Responde con texto, no envía PDF ni imágenes, no contesta en grupos y cada cuenta tiene un agente de chat. Tampoco usa la API oficial de Meta, así que no incluye insignia verde ni plantillas aprobadas.",
    body: <>
      <Comparison caption="Para qué clínicas dentales encaja un chatbot de WhatsApp gratis" columns={["¿Te encaja?", "Por qué"]} rows={fit} />
      <ul>
        <li><strong>Los documentos van por enlace.</strong> Si quieres compartir una lista de precios o unas indicaciones generales, súbelas a tu web y añade el enlace a la información del agente.</li>
        <li><strong>Revisa lo que dice.</strong> Lee las conversaciones durante los primeros días y actualiza los documentos cuando cambien los precios.</li>
        <li><strong>El panel está en inglés.</strong> El agente responde en español.</li>
      </ul>
      <p>Wapzen es un producto independiente: no pertenece a Meta ni a WhatsApp.</p>
    </>,
  },
];

export default function ChatbotWhatsAppClinicaDentalPage() {
  return <QaPost
    href={href}
    heading={<>Chatbot de WhatsApp para clínicas dentales.<br /><span>Siempre gratis, sin API de Meta y con agente de voz.</span></>}
    lead="“¿Cuánto cuesta un implante?”, “¿trabajáis con mi seguro?”, “¿tenéis hueco el jueves?”. Estas preguntas llegan al WhatsApp de la clínica mientras recepción atiende el mostrador y el teléfono, y también de noche. Aquí respondemos, una a una, las dudas de las clínicas dentales españolas antes de poner una IA en su número: qué puede decir, cómo se configura sin clave de API de Meta, cuánto cuesta la alternativa y qué pide el RGPD."
    verdict={{
      title: "La respuesta corta",
      body: <><strong>Wapzen</strong> es un chatbot de WhatsApp con IA para clínicas dentales en España, <strong>siempre gratis, con conversaciones ilimitadas y sin clave de API de Meta</strong>. Responde en tu número a cualquier hora con tus tratamientos y precios, recoge solicitudes de cita y su agente de voz contesta las llamadas de WhatsApp. Se configura en unos minutos. No sustituye a tu programa de gestión y no da consejo clínico.</>,
    }}
    facts={[["Precio", "Siempre gratis"], ["Clave de API de Meta", "No hace falta"], ["Conversaciones", "Ilimitadas"], ["Llamadas", "Agente de voz funcionando"]]}
    indexTitle="Las 11 preguntas de esta guía"
    answerLabel="Respuesta corta"
    questions={questions}
    sources={sources}
    related={["/es/blog/whatsapp-hoteles-apartamentos-turisticos", "/es/blog/ia-para-inmobiliarias-whatsapp"]}
    product="/es/llamadas-con-ia"
    cta={{ heading: <>Tu recepción atiende al paciente que tiene delante.<br /><span>Wapzen responde el resto, gratis.</span></>, body: "Crea tu cuenta, dale la información de tu clínica y vincula tu número en unos minutos. Sin tarjeta, sin clave de API de Meta y sin coste por mensaje." }}
  />;
}
