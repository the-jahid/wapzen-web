import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Búsquedas (docs/seo-blog-voice-research.mjs mx, 2026-11-01): "agente de voz ia" (40),
// "call center con ia" (39), "agente de ia gratis" (37), "llamadas con ia" (30), "bot de
// llamadas" (30), "ia para prospectar clientes" (30), "cobranza por whatsapp" (30),
// "desactivar llamadas whatsapp business" (28), "agente de voz ia gratis" (26). Sin
// versión en inglés. La voz de Wapzen está en acceso anticipado, por eso el CTA abre
// WhatsApp y no el registro. Lo que se dice del agente sigue el servidor Go
// (voicecall): no transfiere, sin remarcado, sin importar CSV, solo WhatsApp. Precios
// de Bland y Vapi revisados el 25/10/2026 (post bland-ai-vs-vapi). La reforma contra el
// acoso telefónico pasó el Senado el 8/10/2026: revisar si Diputados la aprobó.
const href = "/es-mx/blog/agente-de-voz-ia-whatsapp-gratis";
const post = blogPost(href);
const earlyAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hola, quiero acceso anticipado al agente de voz de Wapzen para mi negocio en México.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es-MX", article: { publishedTime: post.published, modifiedTime: post.updated } });

const does = [
  ["Contestar llamadas de WhatsApp", "Sí, a cualquier hora, en el número que ya usas", "El cliente toca “llamar” en el chat y contesta la IA"],
  ["Llamar a prospectos por WhatsApp", "Sí, cuando agregas el prospecto a una campaña", "Marca al momento, también si tu formulario o CRM lo agrega por API"],
  ["Contestar con tu información", "Sí, con tu base de conocimiento (texto, PDF o Word)", "Precios, horarios, requisitos, ubicación, políticas"],
  ["Mandar un mensaje durante la llamada", "Sí", "Una liga, una ubicación o el WhatsApp del asesor"],
  ["Consultar tu agenda o sistema", "Con una herramienta de API", "Pruébala varias veces antes de confiar en ella"],
  ["Guardar la conversación", "Sí, historial y transcripción en el panel", "Las campañas muestran cuántas llamadas se contestaron"],
  ["Transferir a un asesor", "No", "Termina la llamada y manda por mensaje el contacto del asesor"],
  ["Marcar a fijo o celular normal", "No", "Solo llamadas de WhatsApp"],
];

const costs = [
  ["Cómo cobra", "Personas con sueldo, por turno", "Por minuto, en dólares", "Gratis para empezar en acceso anticipado"],
  ["Ejemplo de precio", "Depende de tu equipo", "Bland: US$0.14 por minuto. Vapi: unos US$82 a US$129 por 1,000 minutos", "Sin costo por minuto"],
  ["Por dónde llama", "Teléfono o WhatsApp", "Línea telefónica", "WhatsApp, en tu número"],
  ["Horario", "El de tu equipo", "24 horas", "24 horas"],
  ["Transferir a una persona", "Sí", "Sí, con la configuración adecuada", "No"],
];

const limits = [
  ["Solo WhatsApp", "Quien llama necesita WhatsApp. La IA no marca a fijo ni a celular normal", "Conserva tu línea para quien no usa la app"],
  ["Sin transferencia", "No pasa la llamada a una persona", "Pide que mande el WhatsApp del asesor y anote el motivo"],
  ["Pausa antes de contestar", "De uno a dos segundos por respuesta", "Pide frases cortas en las instrucciones"],
  ["Dispositivo vinculado", "No es la API oficial de Meta", "Llama solo a quien espera tu llamada, para que no restrinjan tu número"],
  ["Campañas sencillas", "Sin remarcado automático y sin importar Excel", "Agrega prospectos uno por uno o por API"],
  ["Acceso anticipado", "La voz se configura con nuestro equipo", "Escríbenos por WhatsApp para empezar"],
];

const faqs = [
  { q: "¿Hay un agente de voz con IA gratis?", a: "Sí. El agente de voz de Wapzen está en acceso anticipado y es gratis para empezar: las llamadas pasan por WhatsApp, sin costo por minuto. Para volumen alto de llamadas acordamos un plan de pago. Las plataformas de llamadas telefónicas, como Bland AI y Vapi, cobran por minuto." },
  { q: "¿Una IA puede hacer llamadas por WhatsApp?", a: "Sí. Con Wapzen, la IA llama desde el WhatsApp de tu número a cada prospecto que agregas a una campaña, y contesta las llamadas de WhatsApp que te hacen tus clientes. No marca a teléfonos fijos ni a celulares fuera de WhatsApp." },
  { q: "¿Qué es un bot de llamadas?", a: "Es un programa que hace o contesta llamadas por sí solo. Los antiguos reproducían grabaciones o menús de “marque 1”. Un agente de voz con IA conversa: entiende lo que dice la persona y le responde con la información de tu negocio." },
  { q: "¿Un call center con IA reemplaza a mis asesores?", a: "No del todo. La IA contesta lo repetitivo, devuelve llamadas al instante y deja los datos ordenados. Negociar, resolver quejas y cerrar ventas sigue en manos de tu equipo, que recibe el contacto por WhatsApp." },
  { q: "¿Puedo usar la IA para cobranza?", a: "Para recordar pagos a tus clientes, con respeto y con una liga de pago por mensaje, sí. Si cobras a nombre de una entidad financiera, también aplican las reglas de Condusef para despachos de cobranza. Una IA que amenaza o presiona es un riesgo legal y hace que restrinjan tu número." },
  { q: "¿Necesito la API oficial de WhatsApp?", a: "No. Wapzen vincula el número que ya usas, como WhatsApp Web. No es la API oficial de Meta, así que no hay garantía contra restricciones: llama solo a quien pidió o espera tu llamada." },
  { q: "¿El REPEP aplica a llamadas por WhatsApp?", a: "El REPEP de Profeco se creó para la publicidad por teléfono y mensajes de texto, y no está claro cómo aplica a llamadas de WhatsApp. Lo más seguro es no llamar a nadie que no te haya dado permiso, y respetar a quien te pida no volver a llamarle." },
];

const sources = [
  { label: "Forbes México: Estudio sobre los hábitos de los usuarios de internet (Asociación de Internet MX)", href: "https://forbes.com.mx/mexico-supera-los-100-millones-de-internautas/" },
  { label: "Bland AI: precios", href: "https://www.bland.ai/pricing" },
  { label: "Vapi: precios", href: "https://vapi.ai/pricing" },
  { label: "Meta: precios de la WhatsApp Business Calling API", href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/pricing/" },
  { label: "Profeco: Registro Público para Evitar Publicidad (REPEP)", href: "https://repep.profeco.gob.mx/" },
  { label: "Publimetro: el Senado aprueba multas contra el acoso telefónico (octubre de 2026)", href: "https://www.publimetro.com.mx/nacional/2026/10/08/te-llaman-a-cada-rato-para-venderte-algo-senado-aprueba-multas/" },
  { label: "Garrigues: la nueva ley de datos personales en México", href: "https://www.garrigues.com/es_ES/noticia/mexico-nueva-ley-federal-proteccion-datos-personales-posesion-particulares-introduce" },
];

const sections = [
  {
    id: "que-es",
    title: "¿Qué es un agente de voz con IA para WhatsApp?",
    body: <>
      <p>Un <strong>agente de voz con IA</strong> es una recepcionista virtual que habla. Contesta las llamadas de WhatsApp de tu negocio, entiende lo que dice el cliente, le responde con voz natural usando tu información y también hace llamadas por WhatsApp a los prospectos que pidieron que les llamaras. Sin conmutador, sin menú de “marque 1”.</p>
      <p>Detrás de cada respuesta hay tres piezas: una transcripción que convierte la voz en texto, un modelo de lenguaje que decide qué contestar y una voz sintética que lo dice. En <strong>Wapzen</strong> no armas nada de eso: escribes las instrucciones, subes la información de tu negocio y vinculas el número de WhatsApp que ya usas.</p>
    </>,
  },
  {
    id: "por-que-whatsapp",
    title: "¿Por qué llamadas con IA por WhatsApp en México?",
    body: <>
      <p>Porque ahí están tus clientes. Según el estudio de hábitos de la Asociación de Internet MX publicado en 2024, México llegó a <strong>101.9 millones de internautas</strong>, y el <strong>88% manda mensajes por apps de mensajería instantánea</strong>. En la práctica, eso es WhatsApp.</p>
      <p>Y del chat a la llamada hay un toque. El cliente que no quiere escribir le da a “llamar” en tu conversación. Si nadie contesta, se va con otro. Muchos negocios terminan desactivando las llamadas de WhatsApp Business porque no tienen quién conteste: “desactivar llamadas WhatsApp Business” es de lo más buscado sobre llamadas en la app.</p>
      <p>Un agente de voz hace lo contrario: contesta, también de noche y en fin de semana, y deja por escrito qué quería cada cliente.</p>
    </>,
  },
  {
    id: "que-hace",
    title: "Qué hace el agente de voz y qué no",
    body: <>
      <p>Revisa lo que hace de verdad antes de elegir. En el caso de Wapzen:</p>
      <Comparison caption="Qué hace el agente de voz de Wapzen en WhatsApp" columns={["¿Lo hace?", "Cómo funciona"]} rows={does} />
      <p>Para prospectar, lo más valioso es la llamada inmediata. Cuando tu formulario, tu landing o tu CRM agrega un prospecto a la campaña por API, la IA le llama por WhatsApp en ese momento, mientras todavía está interesado. Esa persona dejó sus datos pidiendo informes, así que espera la llamada.</p>
    </>,
  },
  {
    id: "usos",
    title: "Ejemplos por tipo de negocio",
    body: <>
      <ul>
        <li><strong>Consultorios y clínicas:</strong> contestar fuera de horario, dar precios de consulta, ubicación y requisitos, y anotar la solicitud de cita. La IA nunca da orientación médica. Los datos de salud son sensibles, así que pide solo lo necesario.</li>
        <li><strong>Inmobiliarias:</strong> llamar en segundos al prospecto que llegó de Inmuebles24 o de un anuncio, confirmar la propiedad, preguntar si es compra o renta y el presupuesto, y mandarle el WhatsApp del asesor. Más en <Link href="/es-mx/blog/ia-para-inmobiliarias-whatsapp">IA para inmobiliarias en México</Link>.</li>
        <li><strong>Agencias de autos y talleres:</strong> contestar sobre servicio, horarios y requisitos, y anotar la cita o agendarla en tu sistema con una herramienta de API.</li>
        <li><strong>Escuelas y cursos:</strong> devolver la llamada a quien pidió informes de inscripción, explicar horarios y colegiaturas, y mandar la liga de inscripción durante la llamada.</li>
        <li><strong>Recordatorios de pago:</strong> avisar a tus clientes del vencimiento con buen trato y mandar la liga de pago o la CLABE por mensaje. Nada de amenazas: además de ser ilegal en cobranza, hace que restrinjan tu número.</li>
      </ul>
    </>,
  },
  {
    id: "ejemplo",
    title: "Así suena una llamada que contesta la IA",
    body: <>
      <Note>Diálogo ilustrativo. La agencia, el auto y los horarios son inventados. La IA solo contesta con lo que hay en tu base de conocimiento.</Note>
      <p><strong>Cliente:</strong> “Hola, ¿todavía tienen el Versa 2022 gris que publicaron?”</p>
      <p><strong>IA:</strong> “¡Hola! Soy la asistente virtual de Autos [nombre]. Sí, el Versa 2022 gris sigue disponible en $259,000, con 38,000 kilómetros. ¿Te gustaría venir a verlo?”</p>
      <p><strong>Cliente:</strong> “Sí, ¿el sábado abren?”</p>
      <p><strong>IA:</strong> “Abrimos el sábado de 9 a 2. Anoto que quieres verlo el sábado. ¿Me dices tu nombre?”</p>
      <p><strong>Cliente:</strong> “Jorge Ramírez.”</p>
      <p><strong>IA:</strong> “Gracias, Jorge. Te acabo de mandar la ubicación y el WhatsApp de Ana, tu asesora. Ella te confirma la hora. ¿Algo más en lo que te ayude?”</p>
      <p>Fíjate en lo que no hizo: no ofreció descuento, no prometió crédito y no inventó una hora libre, porque no estaba conectada a la agenda.</p>
    </>,
  },
  {
    id: "cuanto-cuesta",
    title: "¿Cuánto cuesta un call center con IA?",
    body: <>
      <p>Hay tres caminos, y cobran de forma muy distinta:</p>
      <Comparison caption="Call center humano, plataformas de IA telefónica y Wapzen comparados" columns={["Call center con personas", "IA por teléfono (Bland, Vapi)", "Wapzen"]} rows={costs} />
      <p>Bland y Vapi marcan a cualquier teléfono, y eso vale si tus clientes no usan WhatsApp. Pero cobran cada minuto en dólares, más la línea telefónica. Si casi todos tus clientes ya están en WhatsApp, ahí la llamada no tiene costo de operador.</p>
      <p>También existe la ruta oficial de Meta, la <Link href="/blog/whatsapp-business-calling-api">WhatsApp Business Calling API</Link> (en inglés): las llamadas que te hacen los clientes son gratis, pero las que hace tu negocio se cobran por minuto, necesitan permiso previo del cliente y requieren un proveedor y desarrollo.</p>
      <InlineCta href={earlyAccess} title="¿Quieres probar el agente de voz?" body="La voz de Wapzen está en acceso anticipado y es gratis para empezar. Escríbenos por WhatsApp y la configuramos contigo." label="Pedir acceso anticipado" />
    </>,
  },
  {
    id: "reglas",
    title: "Reglas en México: REPEP, datos personales y lo que viene",
    body: <>
      <p><strong>REPEP.</strong> El Registro Público para Evitar Publicidad de Profeco permite inscribir un número para dejar de recibir publicidad por teléfono y mensajes. Se creó para llamadas telefónicas, y no está claro cómo aplica a WhatsApp. No lo tomes como hueco legal: si alguien te pide no volver a llamarle, no le llames.</p>
      <p><strong>Lo que viene.</strong> En octubre de 2026 el Senado aprobó una reforma para sancionar el acoso telefónico comercial. Todavía le falta la Cámara de Diputados, así que revisa si ya se aprobó antes de lanzar campañas grandes.</p>
      <p><strong>Datos personales.</strong> La nueva Ley Federal de Protección de Datos Personales en Posesión de los Particulares se publicó el 20 de marzo de 2025, y la Secretaría Anticorrupción y Buen Gobierno sustituyó al INAI. Ten tu aviso de privacidad al día y di para qué usas el teléfono del prospecto.</p>
      <p><strong>En cada llamada,</strong> la IA debe decir que es una asistente virtual y avisar que la conversación queda registrada. Wapzen guarda la transcripción en el panel.</p>
      <p>Esto es orientación general, no asesoría legal. Revísalo con tu abogado antes de llamar a escala.</p>
    </>,
  },
  {
    id: "como-empezar",
    title: "Cómo empezar con el agente de voz de Wapzen",
    body: <>
      <p>La voz está en acceso anticipado, así que la configuramos contigo:</p>
      <h3>1. Escríbenos por WhatsApp</h3>
      <p>Cuéntanos tu giro, cuántas llamadas recibes y si también quieres llamar a prospectos.</p>
      <h3>2. Escribe las instrucciones y el saludo</h3>
      <blockquote>“Eres la asistente virtual de [negocio], en [ciudad]. Habla en español de México, con frases cortas y amables. Di al inicio que eres una asistente virtual. Usa solo la información de tu base de conocimiento y nunca inventes precios, disponibilidad ni horarios. Haz una pregunta a la vez. Si el cliente quiere negociar, quejarse o hablar con una persona, mándale por mensaje el WhatsApp de [nombre]. Nunca pidas contraseñas ni datos de tarjeta.”</blockquote>
      <h3>3. Sube la información de tu negocio</h3>
      <p>Precios, horarios, ubicación, requisitos, preguntas frecuentes y políticas, en texto, PDF o Word. Actualízala cada vez que algo cambie.</p>
      <h3>4. Vincula un número</h3>
      <p>Mejor uno solo para atención, separado del WhatsApp personal del dueño, porque la IA contesta todas las llamadas que entren a ese número.</p>
      <h3>5. Pruébalo antes de anunciarlo</h3>
      <p>Llama tú, pide descuento y pregunta algo que no esté en tu información. La IA debe decir que no lo sabe y pasar el contacto de tu equipo, no improvisar.</p>
    </>,
  },
  {
    id: "limites",
    title: "Límites que debes conocer",
    body: <>
      <p>Mejor conocerlos ahora que descubrirlos con un cliente en la línea:</p>
      <Comparison caption="Límites del agente de voz de Wapzen y cómo resolverlos" columns={["Qué pasa", "Cómo resolverlo"]} rows={limits} />
      <Choose locale="es-MX" highlight="Wapzen" items={[
        { name: "una plataforma de IA telefónica", points: ["Tus clientes llaman a un número fijo", "Necesitas transferir llamadas a asesores", "Tienes desarrolladores para armar los flujos"] },
        { name: "Wapzen", points: ["Tus clientes ya te buscan por WhatsApp", "Quieres contestar y devolver llamadas sin pagar por minuto", "Quieres empezar sin programar"] },
      ]} />
      <p>Wapzen es un producto independiente, no es de Meta ni de WhatsApp. Si también quieres contestar por texto, ve el <Link href="/es-mx/blog/chatbot-para-whatsapp-business">chatbot para WhatsApp Business</Link>.</p>
    </>,
  },
];

export default function AgenteDeVozIaWhatsAppMxPage() {
  return <BlogPost
    href={href}
    heading={<>Agente de voz con IA para WhatsApp.<br /><span>Contesta y haz llamadas con IA, gratis para empezar.</span></>}
    lead="Tus clientes ya te llaman por WhatsApp, y muchas veces nadie contesta. Un agente de voz con IA contesta esas llamadas a cualquier hora, responde con la información de tu negocio y le marca al momento al prospecto que pidió informes. Aquí ves cómo funciona, cuánto cuesta y qué no hace."
    summary={{
      title: "En resumen",
      items: [
        <><strong>Qué es:</strong> una IA que contesta y hace llamadas de WhatsApp con voz natural, usando la información que tú le das.</>,
        <><strong>Por qué en México:</strong> el 88% de los 101.9 millones de internautas manda mensajes por apps de mensajería (Asociación de Internet MX, 2024).</>,
        <><strong>Cuánto cuesta:</strong> las plataformas telefónicas cobran por minuto, en dólares. En Wapzen la llamada pasa por WhatsApp y el agente es gratis para empezar.</>,
        <><strong>Qué no hace:</strong> no marca a fijos, no transfiere la llamada y no debe llamar a quien no lo pidió.</>,
        <><strong>Cómo empezar:</strong> la voz está en acceso anticipado. Escríbenos por WhatsApp.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/es-mx/blog/ia-para-inmobiliarias-whatsapp", "/es-mx/blog/agendar-citas-por-whatsapp"]}
    product="/es/llamadas-con-ia"
    cta={{ heading: <>Ninguna llamada sin contestar.<br /><span>Prueba el agente de voz en tu WhatsApp.</span></>, body: "La voz de Wapzen está en acceso anticipado y es gratis para empezar. Escríbenos por WhatsApp y configuramos tu agente." }}
    action={{ href: earlyAccess, label: "Pedir acceso anticipado" }}
  />;
}
