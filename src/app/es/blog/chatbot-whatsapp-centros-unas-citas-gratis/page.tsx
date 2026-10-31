import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Búsquedas objetivo: "chatbot whatsapp para centro de uñas", "agenda de citas
// para centro de uñas", "chatbot para manicura", "reservas whatsapp centro de
// uñas", "ia para centros de uñas". Sin versión en inglés. Los diálogos, precios
// y tiempos son ilustrativos. Lo que se dice de Wapzen sigue al
// whiskey-bailey-server: "gratis para empezar" con límite de uso, un solo modelo
// (sin elegir GPT o Claude), sin voz, sin pausa por conversación, memoria de
// pocos minutos y herramientas que no se ejecutan en todos los mensajes.
const href = "/es/blog/chatbot-whatsapp-centros-unas-citas-gratis";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es", article: { publishedTime: post.published, modifiedTime: post.updated } });

const questions = [
  ["Manicura semipermanente", "¿Llevas esmalte anterior que haya que retirar?"],
  ["Uñas de gel", "¿Quieres una primera puesta o un relleno?"],
  ["Uñas acrílicas", "¿Llevas producto de otro centro?"],
  ["Nail art", "¿Quieres decoración sencilla o un diseño elaborado?"],
  ["Pedicura", "¿Qué tipo de pedicura necesitas?"],
  ["Reparación", "¿Cuántas uñas necesitan reparación?"],
  ["Reserva para varias personas", "¿Cuántas personas sois y qué servicio quiere cada una?"],
];

const durations = [
  ["Manicura tradicional", "30 minutos"],
  ["Manicura semipermanente", "45 minutos"],
  ["Retirada de esmalte", "15 minutos adicionales"],
  ["Primera puesta de gel", "90 minutos"],
  ["Relleno de gel", "60 minutos"],
  ["Nail art elaborado", "30 minutos adicionales"],
];

const needs = [
  ["Contestar cuánto cuesta una manicura", "Chatbot con información de tarifas"],
  ["Explicar gel frente a semipermanente", "Chatbot con base de conocimiento"],
  ["Consultar horas realmente disponibles", "Agenda o sistema de reservas"],
  ["Confirmar una reserva automáticamente", "Integración entre chatbot y agenda"],
  ["Enviar recordatorios programados", "Sistema de recordatorios configurado"],
  ["Gestionar cobros e inventario", "Software de gestión del salón"],
];

const faqs = [
  { q: "¿Existe un chatbot de WhatsApp gratis para centros de uñas?", a: "Sí. Wapzen es gratis para empezar: puedes crear un chatbot con IA, añadir la información de tu salón y conectarlo a WhatsApp por código QR o código de vinculación. El inicio gratuito tiene un límite de uso y los volúmenes mayores necesitan un plan de pago." },
  { q: "¿Puede la IA reservar una cita de manicura automáticamente?", a: "Puede preparar la solicitud de forma conversacional. Para confirmar una cita real necesita una integración con una agenda que compruebe la disponibilidad y registre la reserva." },
  { q: "¿Puede responder cuánto cuestan las uñas de gel?", a: "Sí, si proporcionas las tarifas del centro. Cuando el precio dependa de una valoración o de extras, el chatbot debe explicar las condiciones en lugar de inventar un importe final." },
  { q: "¿Sirve para manicuristas autónomas?", a: "Sí. Puede ser útil cuando trabajas sola, atiendes a domicilio o no tienes una recepcionista que responda al WhatsApp durante los tratamientos." },
  { q: "¿Puede gestionar citas de dos personas?", a: "Puede preguntar qué servicio necesita cada persona y cuáles son sus preferencias. Para confirmar una reserva simultánea debe comprobarse la disponibilidad de las profesionales correspondientes." },
  { q: "¿Necesito cambiar el número de WhatsApp?", a: "No. Wapzen permite vincular números existentes de WhatsApp personal o Business por código QR o código de vinculación. Es importante evaluar antes las limitaciones de esta conexión." },
  { q: "¿Wapzen es gratis para siempre?", a: "No. Es gratis para empezar, con un límite de uso. Cuando se alcanza, el agente deja de responder hasta contratar un plan de pago." },
];

const sources = [
  { label: "ManiAgenda: agenda para manicuristas", href: "https://maniagenda.com/?lang=es" },
  { label: "AEPD: orientación para pymes", href: "https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/directrices-de-aplicacion/pymes" },
  { label: "BOE: Ley 34/2002 (LSSI)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758" },
  { label: "EUR-Lex: Reglamento (UE) 2024/1689 de inteligencia artificial", href: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=es" },
];

const sections = [
  {
    id: "que-es",
    title: "¿Qué es un chatbot de WhatsApp para centros de uñas?",
    body: <>
      <p>La solución no siempre es contratar a otra persona o pagar un programa de gestión completo. Un <strong>chatbot de WhatsApp para centros de uñas</strong> puede responder consultas frecuentes, explicar tus servicios y recoger solicitudes de cita automáticamente.</p>
      <p>Con herramientas como <Link href="/es/chatbot-whatsapp-gratis">Wapzen</Link> puedes empezar gratis a crear un asistente de inteligencia artificial, configurarlo con las tarifas de tu salón y conectarlo a tu WhatsApp sin conocimientos de programación.</p>
      <p>Pero hay algo importante: una buena automatización para manicura no consiste simplemente en contestar “¿Tienes hueco?”. Debe entender qué tratamiento necesita cada clienta, porque no todas las citas requieren el mismo tiempo.</p>
      <p>Un chatbot de este tipo es un asistente virtual que utiliza inteligencia artificial para responder preguntas de las clientas y ayudar con la gestión de solicitudes de cita.</p>
      <p>Puede proporcionar información sobre manicura semipermanente, uñas de gel, uñas acrílicas, pedicura, retirada de esmalte, rellenos y nail art.</p>
      <p>También puede preguntar qué tratamiento desea la clienta, cuándo quiere acudir y si necesita algún servicio adicional.</p>
      <p>Por ejemplo, si alguien escribe:</p>
      <blockquote>“Hola, quiero hacerme las uñas el viernes por la tarde.”</blockquote>
      <p>Un chatbot bien configurado no debería limitarse a contestar “Perfecto, ¿a qué hora?”.</p>
      <p>Primero necesita saber qué servicio quiere, si lleva producto anterior y si desea algún diseño especial.</p>
      <p>Así se puede preparar correctamente la solicitud y evitar reservar menos tiempo del necesario.</p>
      <Note><strong>Respuesta rápida:</strong> la IA puede gestionar la conversación. Para consultar huecos reales, bloquear horarios y confirmar citas automáticamente, necesita una integración con una agenda.</Note>
    </>,
  },
  {
    id: "agenda",
    title: "Por qué la agenda de un centro de uñas necesita algo más que respuestas automáticas",
    body: <>
      <p>En manicura, pequeños detalles pueden cambiar la duración de una cita.</p>
      <p>Una clienta puede reservar una semipermanente sencilla, pero cuando llega explica que necesita retirar unas uñas de gel realizadas en otro centro y quiere añadir decoración.</p>
      <p>Ese cambio puede afectar al tiempo necesario para el servicio y a las siguientes citas.</p>
      <p>Por eso, antes de automatizar las reservas por WhatsApp, conviene definir las preguntas adecuadas.</p>
      <Comparison caption="Qué debe preguntar el chatbot antes de cada servicio de un centro de uñas" columns={["Pregunta que debe hacer el chatbot"]} rows={questions} />
      <p>Con estas preguntas, el asistente puede recopilar información útil antes de que intervenga una profesional.</p>
    </>,
  },
  {
    id: "conversaciones",
    title: "5 conversaciones que puedes automatizar en tu salón de manicura",
    body: <>
      <p>A continuación encontrarás ejemplos de cómo podría responder una IA configurada para un centro de uñas en España.</p>
      <Note>Los importes y las condiciones son ficticios: cada salón debe utilizar sus tarifas y políticas reales.</Note>

      <h3>1. Reservar manicura semipermanente con retirada</h3>
      <p><strong>Clienta:</strong> “Hola, ¿cuánto cuesta la semipermanente?”</p>
      <p><strong>Asistente IA:</strong> “¡Hola! Nuestra manicura semipermanente cuesta 25 €, según nuestra tarifa actual. ¿Llevas esmalte anterior que tengamos que retirar?”</p>
      <p><strong>Clienta:</strong> “Sí, de otro centro.”</p>
      <p><strong>Asistente IA:</strong> “Perfecto. En ese caso, la retirada tiene un suplemento de 5 €, según nuestras tarifas. ¿Quieres que te ayude a solicitar una cita?”</p>
      <p>La IA identifica un servicio adicional antes de continuar con la reserva.</p>

      <h3>2. Solicitar un relleno de uñas de gel</h3>
      <p><strong>Clienta:</strong> “Necesito un relleno de gel para la semana que viene.”</p>
      <p><strong>Asistente IA:</strong> “¡Claro! ¿El gel que llevas está realizado en nuestro centro o en otro salón? Te lo pregunto porque las condiciones del servicio pueden variar.”</p>
      <p><strong>Clienta:</strong> “Es vuestro, de hace tres semanas.”</p>
      <p><strong>Asistente IA:</strong> “Perfecto. ¿Qué día de la próxima semana te viene mejor? Puedo ayudarte a preparar la solicitud.”</p>
      <p>Este tipo de conversación es relevante para negocios con clientas recurrentes.</p>

      <h3>3. Pedir una cita con nail art personalizado</h3>
      <p><strong>Clienta:</strong> “Quiero unas uñas con dibujos de flores y efecto cromado. ¿Tenéis hueco el sábado?”</p>
      <p><strong>Asistente IA:</strong> “¡Hola! Los diseños personalizados pueden requerir más tiempo que una manicura sencilla. ¿Quieres que recoja los detalles para que el equipo valore el diseño antes de confirmar la duración y el presupuesto?”</p>
      <p>La IA evita prometer un precio cerrado para un servicio que puede necesitar valoración.</p>

      <h3>4. Reservar manicura y pedicura juntas</h3>
      <p><strong>Clienta:</strong> “¿Puedo hacerme manos y pies en la misma cita?”</p>
      <p><strong>Asistente IA:</strong> “Podemos ayudarte con la solicitud de ambos servicios. ¿Qué tipo de manicura y pedicura necesitas y qué día prefieres venir?”</p>
      <p><strong>Clienta:</strong> “Semipermanente en manos y pedicura completa el jueves.”</p>
      <p><strong>Asistente IA:</strong> “Entendido. Registraré los dos servicios para que se compruebe el tiempo necesario y la disponibilidad del jueves.”</p>
      <p>Esta información ayuda a organizar mejor los tratamientos combinados.</p>

      <h3>5. Cambiar una cita de última hora</h3>
      <p><strong>Clienta:</strong> “Mañana no puedo ir a hacerme las uñas. ¿Me cambias la cita al viernes?”</p>
      <p><strong>Asistente IA:</strong> “Claro, puedo ayudarte con la solicitud de cambio. ¿Quieres mantener el mismo servicio y prefieres el viernes por la mañana o por la tarde?”</p>
      <p>Si existe una integración con agenda, el agente podrá intentar comprobar el nuevo horario. Si no, la solicitud queda guardada en la conversación y el equipo debe confirmar el cambio.</p>
      <p>Nunca debería afirmar que ha modificado una cita sin verificarlo.</p>
    </>,
  },
  {
    id: "preparar-agenda",
    title: "Cómo preparar tu agenda de citas de uñas para utilizar inteligencia artificial",
    body: <>
      <p>Antes de activar cualquier automatización, crea una ficha de servicios.</p>
      <p>Por ejemplo, un centro puede utilizar estos tiempos como punto de partida para organizar su agenda:</p>
      <Comparison caption="Duraciones ilustrativas de los tratamientos de un centro de uñas" columns={["Duración ilustrativa"]} rows={durations} />
      <p><strong>Estos tiempos son ejemplos de planificación, no estándares del sector.</strong> Cada profesional debe establecer los suyos según la técnica, el servicio y las necesidades de su centro.</p>
      <p>Imagina que una clienta solicita una manicura semipermanente con retirada y decoración elaborada.</p>
      <p>Con los tiempos ilustrativos anteriores:</p>
      <p>45 minutos de manicura + 15 minutos de retirada + 30 minutos de decoración = <strong>90 minutos de trabajo previsto</strong>.</p>
      <p>Si el chatbot solo registra “manicura semipermanente”, la solicitud estará incompleta.</p>
      <p>Por eso es útil que la IA recopile detalles antes de consultar una agenda.</p>
    </>,
  },
  {
    id: "chatbot-o-agenda",
    title: "Chatbot para uñas, agenda de citas y software de reservas: ¿son lo mismo?",
    body: <>
      <p>No. Son herramientas distintas, aunque pueden trabajar juntas.</p>
      <p>Un chatbot conversacional atiende mensajes y recoge información.</p>
      <p>Una agenda digital organiza horarios, profesionales y reservas.</p>
      <p>Un sistema de recordatorios comunica información sobre citas existentes, cuando está configurado para ello.</p>
      <p>Y un software de gestión puede incluir funciones adicionales de caja, inventario y fichas de clientas.</p>
      <Comparison caption="Qué herramienta resuelve cada necesidad de un centro de uñas" columns={["Herramienta adecuada"]} rows={needs} />
      <p>Si buscas una <strong>agenda de citas para centro de uñas gratis</strong>, comprueba qué funciones incluye realmente.</p>
      <p>Por ejemplo, ManiAgenda ofrece un enlace de reservas para manicuristas, mientras que otras soluciones combinan agenda y mensajería con planes de pago.</p>
      <p>Wapzen se centra en el asistente conversacional. Puede conectarse a herramientas externas mediante API, pero no debes confundir esa posibilidad con tener una agenda de manicura completamente configurada desde el primer momento.</p>
      <InlineCta title="Prueba un asistente en tu centro de uñas" body="Crea un agente de IA, añade tus servicios y tarifas y comprueba cómo responde a las preguntas de tus clientas. Gratis para empezar." label="Empieza gratis" />
    </>,
  },
  {
    id: "crear",
    title: "Cómo crear un chatbot de WhatsApp para tu centro de uñas con Wapzen",
    body: <>
      <p><Link href="/es/chatbot-whatsapp-gratis">Wapzen</Link> permite crear agentes con inteligencia artificial para responder mensajes de WhatsApp sin programar.</p>
      <p>Es gratis para empezar y no pide tarjeta de crédito. El inicio gratuito tiene un límite de uso y los volúmenes mayores necesitan un plan de pago: al llegar al límite, el agente deja de responder, así que conviene seguir pendiente del WhatsApp del centro.</p>

      <h3>Paso 1. Crea tu cuenta</h3>
      <p>Accede a Wapzen y regístrate. No necesitas contratar por tu cuenta una clave de API de inteligencia artificial.</p>

      <h3>Paso 2. Configura un asistente para manicura</h3>
      <p>Puedes ponerle un nombre relacionado con tu centro y definir un tono amable, claro y profesional.</p>

      <h3>Paso 3. Introduce los servicios y sus condiciones</h3>
      <p>Añade tus tarifas, horarios, políticas de cancelación, ubicación y preguntas frecuentes.</p>
      <p>Puedes utilizar texto, documentos PDF y archivos Word como base de conocimiento.</p>
      <p>Incluye también las preguntas que deben hacerse antes de cada cita, como si la clienta necesita retirada, relleno o decoración.</p>

      <h3>Paso 4. Conecta tu número de WhatsApp</h3>
      <p>Wapzen permite conectar un WhatsApp personal o WhatsApp Business mediante un código QR o un código de vinculación.</p>
      <p>Este método funciona mediante vinculación de dispositivo, no mediante la plataforma oficial WhatsApp Business API de Meta. Antes de utilizar el número principal de tu salón, revisa las condiciones de uso, la privacidad y los posibles riesgos de desconexión o restricciones.</p>

      <h3>Paso 5. Prueba las solicitudes antes de activar el agente</h3>
      <p>Comprueba qué sucede cuando alguien pide un servicio sencillo, varios tratamientos, dos personas en la misma reserva o un cambio de cita.</p>
      <p>Las conversaciones quedan guardadas en el panel: sin agenda conectada, las solicitudes de cita están ahí y tu equipo debe revisarlas para confirmarlas.</p>
      <p>Si quieres que el chatbot confirme reservas en una agenda real, tendrás que configurar las correspondientes herramientas de API, y tu agenda debe ofrecer una API. Esa parte puede requerir conocimientos técnicos.</p>
      <p>Una herramienta de API no se ejecuta en todos los mensajes que deberían activarla, así que pruébala varias veces y comprueba en la agenda que la reserva se ha creado. El agente tampoco recibe el número de la clienta: si tu sistema lo necesita, indícale en las instrucciones que lo pregunte.</p>
      <Note>El agente de chat de Wapzen lee texto: no entiende audios ni el contenido de las imágenes, de modo que no verá la foto de un diseño, y no responde en grupos. Solo recuerda los últimos minutos de cada conversación, así que una clienta que vuelve al día siguiente empieza de cero. Tampoco se detiene cuando contestas desde el móvil: no hay pausa por conversación, y pausar el agente detiene todas las conversaciones. Contesta cuando alguien escribe, pero no envía recordatorios por su cuenta. Wapzen es un producto independiente: no pertenece a Meta ni a WhatsApp.</Note>
    </>,
  },
  {
    id: "instrucciones",
    title: "Instrucciones para tu chatbot de manicura",
    body: <>
      <p>Puedes adaptar este texto para crear el comportamiento inicial de tu asistente:</p>
      <blockquote>“Eres la recepcionista virtual de un centro de uñas situado en España. Hablas en español de España y atiendes con un tono cercano y profesional. Deja claro que eres un asistente virtual, no una persona. Respondes preguntas sobre manicura, pedicura, semipermanente, uñas de gel, acrílico y nail art usando exclusivamente las tarifas y condiciones proporcionadas por el salón. Cuando alguien solicite una cita, pregunta qué servicio necesita, si lleva producto anterior, si quiere retirada o decoración adicional y qué día y horario prefiere. No inventes precios, descuentos, tiempos ni disponibilidad. No confirmes reservas sin una verificación válida de la agenda. Si una consulta requiere valoración profesional o atención humana, explica cómo contactar con el equipo: [teléfono]. No solicites información personal innecesaria ni ofrezcas diagnósticos sobre problemas de las uñas o la piel.”</blockquote>
    </>,
  },
  {
    id: "medir",
    title: "¿Cómo puede ayudarte a reducir consultas repetidas y errores en la agenda?",
    body: <>
      <p>El beneficio más inmediato es reducir el tiempo dedicado a responder siempre las mismas preguntas.</p>
      <p>Pero también puede ayudarte a estructurar mejor la información antes de una cita.</p>
      <p>Puedes medir los resultados con cuatro indicadores:</p>
      <ul>
        <li><strong>Consultas resueltas:</strong> preguntas administrativas contestadas correctamente sin intervención humana.</li>
        <li><strong>Solicitudes completas:</strong> peticiones de cita que contienen servicio, extras y preferencia horaria.</li>
        <li><strong>Reservas confirmadas:</strong> citas verificadas realmente en tu agenda, no solo solicitudes.</li>
        <li><strong>Errores de planificación:</strong> reservas a las que les faltaba tiempo por no incluir retirada, relleno o decoración.</li>
      </ul>
      <p>No necesitas prometer un porcentaje de ahorro para saber si la automatización merece la pena.</p>
      <p>Compara el funcionamiento antes y después de activar el chatbot utilizando datos reales de tu propio centro.</p>
    </>,
  },
  {
    id: "legal",
    title: "¿Es legal utilizar un chatbot de WhatsApp en un salón de uñas en España?",
    body: <>
      <p>La automatización de atención al cliente debe cumplir la normativa aplicable de protección de datos, especialmente el RGPD y la LOPDGDD.</p>
      <p>Revisa qué información personal recopila el sistema, con qué finalidad, durante cuánto tiempo se conserva y qué terceros pueden acceder a ella.</p>
      <p>Si utilizas un proveedor externo, comprueba también las garantías y los contratos de tratamiento de datos que correspondan.</p>
      <p>En el caso de Wapzen, la base de datos principal está en Singapur, los servidores de aplicación en Singapur y Alemania, y proveedores como OpenAI pueden tratar la información en Estados Unidos. Las conversaciones se conservan hasta que las borres. Los detalles están en su <Link href="/privacy">política de privacidad</Link>, en inglés. Wapzen no publica un contrato estándar de encargado del tratamiento: si lo necesitas, pregunta antes de conectar tu número.</p>
      <p>No debes confundir responder a una clienta que solicita una cita con tener autorización para enviarle promociones. Las comunicaciones comerciales electrónicas están sujetas a la LSSI y sus requisitos de consentimiento o excepciones legales.</p>
      <p>El artículo 50 del Reglamento europeo de inteligencia artificial exige, además, que las personas sepan que están hablando con una IA, salvo que resulte evidente. Wapzen no añade ese aviso por sí solo, así que inclúyelo en las instrucciones del agente.</p>
      <p>La <a href="https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/directrices-de-aplicacion/pymes" target="_blank" rel="noopener noreferrer">Agencia Española de Protección de Datos</a> ofrece recursos para pequeñas empresas y autónomos.</p>
    </>,
  },
  {
    id: "conclusion",
    title: "Conclusión: convierte tu WhatsApp en una ayuda para tu centro de uñas",
    body: <>
      <p>Si trabajas haciendo manicuras, sabes que tus manos no pueden estar atendiendo un tratamiento y respondiendo el móvil al mismo tiempo.</p>
      <p>Pero eso no significa que las clientas tengan que esperar horas para recibir información.</p>
      <p>Un chatbot de WhatsApp puede ayudarte a responder sobre semipermanentes, uñas de gel, retiradas, nail art y solicitudes de cita, mientras tú te concentras en el servicio.</p>
      <p>La clave es configurar un asistente que entienda realmente cómo funciona tu centro de uñas, con sus propios servicios, tiempos y condiciones.</p>
      <p>Con Wapzen puedes empezar gratis, añadir la información de tu negocio y probar conversaciones antes de ampliar la automatización.</p>
      <p><strong>¿Quieres responder a tus clientas sin interrumpir cada manicura?</strong> <Link href="/es/chatbot-whatsapp-gratis">Crea tu chatbot de WhatsApp con Wapzen</Link> y comprueba cómo puede ayudarte a organizar las consultas y solicitudes de cita de tu centro de uñas.</p>
    </>,
  },
];

export default function ChatbotWhatsAppCentrosUnasPage() {
  return <BlogPost
    href={href}
    heading={<>Chatbot WhatsApp para centros de uñas.<br /><span>Cómo gestionar citas de manicura con IA en 2026.</span></>}
    lead="¿Tienes un centro de uñas y pasas demasiado tiempo respondiendo mensajes de WhatsApp para dar citas? Una clienta te pregunta por la manicura semipermanente, otra quiere saber cuánto cuestan las uñas de gel y una tercera necesita retirar el producto que lleva antes de reservar. Mientras tanto, tú estás trabajando y no puedes contestar."
    summary={{
      title: "Resumen",
      items: [
        <><strong>Qué resuelve:</strong> un chatbot con IA responde sobre manicuras, precios y horarios, y recoge solicitudes de cita mientras trabajas.</>,
        <><strong>Clave en manicura:</strong> debe preguntar por retiradas, rellenos y decoración, porque cambian la duración de la cita.</>,
        <><strong>Citas:</strong> sin integración, tu equipo confirma; la reserva automática necesita una agenda conectada por API.</>,
        <><strong>Legal:</strong> revisa el RGPD, la LSSI y el aviso de que la clienta habla con una IA.</>,
        <><strong>Cómo probarlo:</strong> Wapzen es gratis para empezar, sin programar y con límite de uso.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    product="/es/chatbot-whatsapp-gratis"
    cta={{ heading: <>Responde a tus clientas.<br /><span>Sin interrumpir cada manicura.</span></>, body: "Crea un agente de IA, añade tus servicios y conecta tu número. Es gratis para empezar." }}
  />;
}
