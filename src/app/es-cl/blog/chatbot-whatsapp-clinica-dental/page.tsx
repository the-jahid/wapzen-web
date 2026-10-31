import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Búsquedas: "chatbot para clínica dental", "whatsapp para dentistas", "software dental
// whatsapp", "agenda dental whatsapp". En Chile se dice "pedir hora", no "cita". Sin
// versión en inglés. Ley 21.719: estado al 1 de noviembre de 2026 (Senado aprobó el 28
// de octubre mover la vigencia al 15 de octubre de 2027, falta la Cámara). REVISAR tras
// el 30 de noviembre: si no se publicó, rige desde el 1 de diciembre de 2026. No se
// indica dónde están los datos porque /privacy puede estar desactualizada. Tarifas de
// Meta: tabla de un tercero que cita la lista del 1 de octubre. Lo que se dice de Wapzen
// sigue a whiskey-bailey-server. Diálogos ilustrativos.
const href = "/es-cl/blog/chatbot-whatsapp-clinica-dental";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es-CL", article: { publishedTime: post.published, modifiedTime: post.updated } });

const answers = [
  ["Horario, dirección y estacionamiento", "Responde desde tu información", "Nada"],
  ["“¿Atienden por Isapre o Fonasa?”", "Responde según tus convenios", "Mantener la lista al día"],
  ["“¿Cuánto sale una limpieza?”", "Da el valor si lo publicaste, o explica que depende de la evaluación", "Definir qué valores se informan"],
  ["“¿Tienen hora esta semana?”", "Toma día y horario preferidos", "Confirmar la hora en la agenda"],
  ["“Quiero cambiar mi hora”", "Toma la solicitud", "Hacer el cambio en el software"],
  ["“¿Qué tomo para el dolor?”", "No indica medicamentos y orienta a consultar", "Atender al paciente"],
];

const booking = [
  ["Solicitud", "El agente anota día y horario preferidos", "Recepción la confirma al abrir", "La opción para empezar"],
  ["Enlace de reserva", "El agente envía el enlace de tu sistema", "El paciente elige la hora", "Si tu software tiene reserva en línea"],
  ["Conexión por API", "El agente consulta y reserva", "Tu sistema confirma", "Si tu software ofrece API. Requiere trabajo técnico"],
];

const limits = [
  ["Recordatorios", "El agente no escribe primero, así que no envía recordatorios", "Déjalos en tu software de agenda"],
  ["Notas de voz", "No las escucha y no las contesta", "Pide texto en tu perfil y revisa los audios"],
  ["Fotos", "No ve radiografías ni fotos. Solo lee su texto", "Si llegan, responde una persona del equipo"],
  ["Memoria", "Recuerda solo los últimos minutos. Quien vuelve otro día parte de cero", "La conversación completa queda en el panel"],
  ["Recepción en el chat", "El agente sigue contestando. No hay pausa por conversación", "Pausar el agente detiene todas las conversaciones"],
  ["Ficha clínica", "No tiene acceso a la ficha, y no debe tenerlo", "Las consultas de un tratamiento las responde la clínica"],
];

const tools = [
  ["Para qué sirve", "Ficha, agenda y gestión de la clínica", "Reservas y gestión de negocios de belleza y bienestar", "Conversar por WhatsApp con tu información"],
  ["Confirmación de horas", "Incluida en sus planes (confirma el canal)", "Consulta con el proveedor", "No: no escribe primero"],
  ["Preguntas abiertas de noche", "Consulta con el proveedor", "Consulta con el proveedor", "Sí, por texto"],
  ["Precio", "Cotización", "No lo pudimos confirmar", "Gratis para empezar, con límite de uso. Plan de pago para más volumen"],
];

const faqs = [
  { q: "¿Un chatbot puede reservar horas en una clínica dental?", a: "Puede tomar la solicitud con el día y horario preferidos, o enviar el enlace de reserva de tu software. Para reservar directamente necesita una conexión por API con tu sistema, y hay que probarla varias veces, porque una herramienta de API no se ejecuta en todos los mensajes que deberían activarla." },
  { q: "¿Puede enviar recordatorios de hora?", a: "El agente de Wapzen no, porque solo contesta a quien le escribe. Los recordatorios deben seguir en tu software de agenda o en una herramienta conectada a la API oficial de WhatsApp." },
  { q: "¿Reemplaza a Dentalink o AgendaPro?", a: "No. Esos sistemas manejan agenda y gestión. Un agente de WhatsApp se ocupa de la conversación: contesta dudas y toma solicitudes. Lo razonable es usarlo junto a tu software, no en vez de él." },
  { q: "¿Es legal usar un chatbot en una clínica dental en Chile?", a: "No hay una regla específica sobre chatbots en clínicas dentales que hayamos encontrado, pero aplican las normas de datos personales y la Ley 20.584, que protege la ficha clínica. Usa el agente solo para temas administrativos, no le entregues datos de pacientes y consulta a tu asesor legal." },
  { q: "¿Cuándo entra en vigencia la Ley 21.719?", a: "Al 1 de noviembre de 2026, la fecha legal sigue siendo el 1 de diciembre de 2026. El Senado aprobó el 28 de octubre un proyecto que la movería al 15 de octubre de 2027, pero aún debe pasar por la Cámara y publicarse. Revisa el estado antes de decidir." },
  { q: "¿Qué pasa si un paciente tiene una urgencia?", a: "El agente debe decirlo claro: no puede atender urgencias por chat y el paciente debe llamar a la clínica o ir a urgencias. Si hay dificultad para respirar o tragar, debe llamar al SAMU 131. Déjalo por escrito en las instrucciones." },
  { q: "¿Sirve para una consulta con un solo dentista?", a: "Sí, y es donde más se nota, porque no hay recepción después de horario. Wapzen es gratis para empezar, con límite de uso. Cuando se acaba, el agente deja de contestar, así que sigue revisando tu WhatsApp." },
];

const sources = [
  { label: "Dentalink: planes", href: "https://www.softwaredentalink.com/planes" },
  { label: "Descubre.vc: AgendaPro cierra Serie B de US$35 millones", href: "https://www.descubre.vc/noticia/agendapro-cierra-serie-b-de-us-35m-liderada-por-riverwood-2025-08-19" },
  { label: "El Cronista México: Vambe, startup chilena de IA conversacional", href: "https://www.cronista.com/mexico/finanzas-economia/vambe-la-startup-chilena-de-ia-conversacional-que-aterriza-en-mexico-para-hiperpersonalizar-las-ventas-de-las-empresas" },
  { label: "La Tercera: Senado aprueba postergar la ley de datos personales", href: "https://www.latercera.com/nacional/noticia/senado-aprueba-postergacion-de-entrada-en-vigencia-de-ley-de-proteccion-de-datos-personales-iniciativa-pasa-a-la-camara/" },
  { label: "Garrigues: Senado aprueba postergar al 15 de octubre de 2027", href: "https://www.garrigues.com/es_ES/noticia/senado-chileno-aprueba-proyecto-ley-busca-postergar-15-octubre-2027-entrada-vigencia-nueva" },
  { label: "Usercentrics: Ley 21.719 en Chile, sanciones y plazos", href: "https://usercentrics.com/es/knowledge-hub/ley-proteccion-datos-chile/" },
  { label: "BCN: Ley 20.584, derechos y deberes de los pacientes", href: "https://www.bcn.cl/leychile/navegar?i=1039348" },
  { label: "Zernio: tarifas de WhatsApp por país, lista del 1 de octubre de 2026", href: "https://zernio.com/whatsapp-api-pricing" },
  { label: "WhatsApp Business: política de mensajes", href: "https://whatsappbusiness.com/policy/" },
];

const sections = [
  {
    id: "que-es",
    title: "¿Qué hace un chatbot de WhatsApp en una clínica dental?",
    body: <>
      <p>Un chatbot de WhatsApp para clínicas dentales contesta las preguntas administrativas de tus pacientes: valores, convenios, horarios, ubicación y solicitudes de hora. Si usa IA, entiende mensajes escritos con palabras propias y sigue la conversación, aunque la recepción ya haya cerrado. No diagnostica, no recomienda tratamientos y no entra a la ficha clínica.</p>
      <p>Su mayor valor está fuera de horario. Quien busca un dentista a las 21:15 suele escribirle a más de una clínica, y muchas veces se queda con la que contesta primero.</p>
    </>,
  },
  {
    id: "quien-paga",
    title: "Las clínicas ya pagan por software. ¿Qué falta?",
    body: <>
      <p>Chile es un buen lugar para ver este mercado, porque varias empresas del rubro nacieron aquí:</p>
      <ul>
        <li><strong>Dentalink:</strong> software dental con planes Esencial, Pro y Titanium, vendidos por cotización. La confirmación de citas aparece incluida en los tres.</li>
        <li><strong>AgendaPro:</strong> cerró una Serie B de US$35 millones liderada por Riverwood y reporta 20.000 comercios en la región, con foco en belleza y bienestar.</li>
        <li><strong>Vambe:</strong> startup chilena de IA conversacional, con una Serie A de US$14 millones y cerca de 2.000 empresas, según El Cronista.</li>
      </ul>
      <p>Lo importante es qué compra una clínica cuando paga por estas herramientas: orden en la agenda y menos horas perdidas. Lo que suele seguir sin dueño es la conversación abierta: el paciente que pregunta por un implante un domingo, con palabras que ningún menú anticipó.</p>
      <p><strong>Ahí encaja un agente de IA: junto a tu software, no en su lugar.</strong> Tu sistema agenda y recuerda. El agente conversa y le deja a recepción una solicitud ordenada.</p>
    </>,
  },
  {
    id: "ejemplo",
    title: "Qué responde y qué deriva",
    body: <>
      <Note>Diálogos ilustrativos. Valores, convenios y horarios son inventados. El agente solo debe responder con la información que tú le das.</Note>
      <h3>Paciente nuevo, fuera de horario</h3>
      <p><strong>Paciente:</strong> “Hola, ¿tienen hora para una evaluación de implante esta semana? ¿Atienden por Fonasa?”</p>
      <p><strong>Agente:</strong> “¡Hola! Soy la asistente virtual de [clínica]. La evaluación de implantes es con la Dra. Soto, y la atención es particular, sin convenio Fonasa. ¿Qué día te acomoda, y prefieres mañana o tarde?”</p>
      <p><strong>Paciente:</strong> “El jueves en la tarde.”</p>
      <p><strong>Agente:</strong> “Anoto jueves en la tarde. Recepción te confirma la hora mañana desde las 9:00. ¿A nombre de quién la dejo?”</p>
      <h3>Dolor o urgencia</h3>
      <p><strong>Paciente:</strong> “Me duele mucho una muela, ¿qué me tomo?”</p>
      <p><strong>Agente:</strong> “Lamento que tengas dolor. No puedo indicarte medicamentos por este chat. Llama a la clínica al [teléfono] o acude a una urgencia dental. Si se te hincha la cara o te cuesta respirar o tragar, llama al SAMU 131.”</p>
      <p>Así se reparte el trabajo:</p>
      <Comparison caption="Qué responde el agente y qué queda con la clínica" columns={["Qué hace el agente", "Qué queda con la clínica"]} rows={answers} />
    </>,
  },
  {
    id: "pedir-hora",
    title: "Tres formas de pedir hora por WhatsApp",
    body: <>
      <p>El agente no se conecta solo a tu agenda. Elige una de estas opciones:</p>
      <Comparison caption="Tres formas de pedir hora por WhatsApp con un agente de IA" columns={["Cómo funciona", "Quién confirma", "Cuándo usarla"]} rows={booking} />
      <p>Parte por la solicitud. Es la más simple, y recepción mantiene el control de la agenda. Si tu software ofrece reserva en línea, un enlace suele ser mejor que una conexión a medida.</p>
      <p>Cuidado con un detalle: el agente debe decir “recepción te confirma”, nunca “tu hora quedó reservada”, salvo que tu sistema lo haya confirmado.</p>
      <InlineCta title="Prueba con las preguntas de tu recepción" body="Crea un agente, súbele tus valores y horarios, y hazle las preguntas que recibes cada día. Es gratis para empezar." label="Empieza gratis" />
    </>,
  },
  {
    id: "configurar",
    title: "Cómo configurarlo en Wapzen",
    body: <>
      <p><Link href="/es/chatbot-whatsapp-gratis">Wapzen</Link> te permite crear el agente sin programar. El panel está en inglés, y el agente responde en español si se lo pides en las instrucciones.</p>
      <h3>1. Escribe las instrucciones</h3>
      <blockquote>“Eres la asistente virtual de [clínica], una clínica dental en [comuna]. Responde en español de Chile, en mensajes cortos, cordiales y claros. Tu rol es administrativo: horarios, ubicación, convenios, valores publicados y solicitudes de hora. Usa solo la base de conocimiento. Nunca diagnostiques, indiques medicamentos, recomiendes tratamientos ni prometas resultados. No pidas RUT, antecedentes de salud ni fotos. Nunca digas que una hora está reservada: di que recepción la confirma. Si hay dolor intenso, sangrado o hinchazón, indica llamar al [teléfono] o ir a urgencias. Di desde el inicio que eres una asistente virtual.”</blockquote>
      <h3>2. Sube solo información de la clínica</h3>
      <p>Agrega en texto, PDF o Word: especialidades, profesionales, horarios, convenios, valores que quieras publicar, formas de pago, estacionamiento y preguntas frecuentes. <strong>Nunca subas fichas, presupuestos con nombre, radiografías ni listas de pacientes.</strong></p>
      <h3>3. Conecta el número</h3>
      <p>Conecta un número personal o de WhatsApp Business con código QR o código de vinculación. Wapzen funciona como dispositivo vinculado, no por la API oficial de Meta, por lo que puede haber restricciones. Evalúa ese riesgo antes de usar el número principal de la clínica.</p>
      <h3>4. Decide cómo revisará recepción</h3>
      <p>Las conversaciones quedan en el panel. Define quién las revisa al abrir, y qué hacer con las solicitudes de la noche.</p>
      <h3>5. Pruébalo con casos delicados</h3>
      <p>Pregunta por dolor, pide un diagnóstico, escribe datos de salud, pide hablar con una persona. Corrige las instrucciones hasta que derive bien todas las veces.</p>
    </>,
  },
  {
    id: "ley",
    title: "Datos de pacientes: Ley 20.584 y Ley 21.719",
    body: <>
      <p><strong>Ley 20.584.</strong> Protege la reserva de la ficha clínica y limita quién puede acceder a ella. Por eso el agente no debe consultarla, y tu personal no debe pegar antecedentes clínicos en sus instrucciones.</p>
      <p><strong>Ley 21.719.</strong> Modifica a fondo la Ley 19.628, que ya trata los datos de salud como sensibles. Este es el estado al 1 de noviembre de 2026:</p>
      <ul>
        <li>La fecha legal de entrada en vigencia sigue siendo el <strong>1 de diciembre de 2026</strong>.</li>
        <li>El 28 de octubre, el Senado aprobó por 33 votos contra 6 un proyecto que la movería al <strong>15 de octubre de 2027</strong>.</li>
        <li>El proyecto pasó a la Cámara. Si no se publica como ley antes de diciembre, rige la fecha original.</li>
      </ul>
      <p>Las multas pueden llegar a 20.000 UTM, o a un 4% de los ingresos anuales en infracciones graves o reiteradas, según Usercentrics. Con cualquiera de las dos fechas, hay tiempo para ordenar esto: define qué datos pide tu WhatsApp, quién los ve y cuánto tiempo se guardan.</p>
      <p><strong>WhatsApp.</strong> La política de WhatsApp Business prohíbe usar el servicio para enviar o pedir información de salud cuando la normativa aplicable no lo permita, y exige un camino claro hacia una persona de tu equipo cuando la atención es automatizada.</p>
      <p><strong>Proveedores.</strong> Con Wapzen, los mensajes pasan por proveedores como OpenAI y pueden tratarse fuera de Chile. Las conversaciones se guardan hasta que las borres. Los detalles están en su <Link href="/privacy">política de privacidad</Link>, en inglés. Wapzen no publica un contrato estándar de encargo de tratamiento: si lo necesitas, pregúntalo antes de conectar tu número.</p>
      <p>Esto es orientación general, no asesoría legal. No encontramos una norma chilena específica sobre chatbots en clínicas dentales, así que valida tu caso con un abogado.</p>
    </>,
  },
  {
    id: "limites",
    title: "Los límites actuales de Wapzen",
    body: <>
      <Comparison caption="Límites del agente de Wapzen en una clínica dental y cómo resolverlos" columns={["Qué pasa", "Cómo resolverlo"]} rows={limits} />
      <p>Si conectas tu sistema por API, el agente tampoco recibe el número del paciente: debe preguntárselo. Y al terminar el límite de uso del inicio gratis, deja de contestar, así que recepción debe seguir revisando WhatsApp.</p>
    </>,
  },
  {
    id: "comparar",
    title: "Dentalink, AgendaPro o Wapzen",
    body: <>
      <p>La pregunta correcta no es cuál elegir, sino qué parte cubre cada uno. Revisamos las páginas públicas disponibles. Confirma funciones y valores con cada proveedor.</p>
      <Comparison caption="Dentalink, AgendaPro y Wapzen comparados para una clínica dental" columns={["Dentalink", "AgendaPro", "Wapzen"]} rows={tools} />
      <Choose locale="es-CL" highlight="Wapzen" items={[
        { name: "un software de gestión", points: ["Necesitas ficha, agenda y facturación", "Quieres confirmaciones automáticas de horas", "Tienes varios profesionales o sedes"] },
        { name: "Wapzen", points: ["Ya tienes agenda y te faltan respuestas fuera de horario", "Tu recepción repite las mismas respuestas", "Quieres probarlo sin contrato ni programación"] },
      ]} />
      <p>Si quisieras enviar recordatorios tú mismo por la API oficial, considera el costo. Zernio, citando la lista de Meta del 1 de octubre de 2026, da para Chile unos US$0,02 por mensaje de utilidad y US$0,0889 por mensaje de marketing, bastante más que en otros países de la región. Confirma las tarifas en Meta. Wapzen es un producto independiente, no es de Meta ni de WhatsApp.</p>
    </>,
  },
];

export default function ChatbotWhatsAppClinicaDentalPage() {
  return <BlogPost
    href={href}
    heading={<>Chatbot de WhatsApp para clínicas dentales en Chile.<br /><span>Responde pacientes y toma solicitudes de hora con IA.</span></>}
    lead="Son las 21:15 y alguien escribe: “¿Tienen hora para una evaluación de implante esta semana?”. Recepción cerró a las 19:00, y mañana esa persona quizás ya reservó en otra clínica. Un agente de IA en WhatsApp puede responder con tu información y dejar la solicitud lista. Aquí ves qué puede hacer, qué nunca debe hacer y cómo convive con tu software."
    summary={{
      title: "En resumen",
      items: [
        <><strong>Qué resuelve:</strong> preguntas administrativas y solicitudes de hora fuera de horario, por texto.</>,
        <><strong>Qué no hace:</strong> diagnosticar, indicar medicamentos ni entrar a la ficha clínica.</>,
        <><strong>Junto a tu software:</strong> Dentalink y AgendaPro manejan agenda y gestión. El agente conversa. Wapzen no envía recordatorios.</>,
        <><strong>Ley 21.719:</strong> rige desde el 1 de diciembre de 2026, salvo que se publique antes la postergación al 15 de octubre de 2027 que aprobó el Senado.</>,
        <><strong>Cómo probar:</strong> Wapzen es gratis para empezar, con límite de uso, y no requiere programar.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/es-mx/blog/agendar-citas-por-whatsapp", "/es-mx/blog/chatbot-para-whatsapp-business"]}
    product="/es/chatbot-whatsapp-gratis"
    cta={{ heading: <>Tu clínica, respondiendo después de las 19:00.<br /><span>Prueba con tus preguntas.</span></>, body: "Crea un agente de IA, súbele la información de tu clínica y conecta tu número. Es gratis para empezar." }}
  />;
}
