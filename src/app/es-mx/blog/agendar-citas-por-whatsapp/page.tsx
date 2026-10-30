import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Búsquedas objetivo: "agendar citas por whatsapp" (39, 3/3), "…por whatsapp
// business" (37, 3/3), "agenda whatsapp business" (30), "recordatorio de citas
// por whatsapp gratis" (28, 3/3), "bot de whatsapp para agendar citas" (20),
// autocompletado MX 2026-10-28. Los resultados son apps de citas pequeñas.
// Límites del producto (igual que el post en inglés): el agente no ve el número
// del cliente, no sabe la fecha de hoy, lee los primeros 3,000 caracteres de una
// herramienta, y agregar un lead a una campaña llama al instante. Versión en
// inglés: /blog/whatsapp-appointment-booking.
const href = "/es-mx/blog/agendar-citas-por-whatsapp";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es-MX", article: { publishedTime: post.published, modifiedTime: post.updated } });

const ways = [
  ["Cómo funciona", "Contestas tú y anotas la cita en tu agenda", "Mandas un enlace y el cliente elige el horario", "La IA contesta, pide los datos y registra o agenda la cita"],
  ["Costo", "Gratis", "Gratis o el plan de tu sistema de citas", "Gratis por ahora con Wapzen"],
  ["Contesta de noche", "No", "El enlace sí; las dudas no", "Sí, 24/7"],
  ["Riesgo de empalmes", "Alto si hay mucho movimiento", "Bajo: el sistema bloquea horarios", "Bajo si consulta tu agenda real"],
  ["Ideal para", "Pocas citas al día", "Negocios que ya usan un sistema de citas", "Mucho volumen o atención fuera de horario"],
];

const reminders = [
  ["A mano, con respuesta rápida", "Gratis", "Diez citas al día; cansado con cincuenta"],
  ["Plantillas por la API", "US$0.0085 (MXN 0.1565) por mensaje", "Automático, desde tu sistema de citas"],
  ["Llamada de recordatorio con IA", "Gratis por ahora con Wapzen", "Confirma por voz; cada llamada sale al agregar el contacto"],
];

const faqs = [
  { q: "¿Cómo agendar citas por WhatsApp Business?", a: "Tienes tres opciones: contestar tú y anotar la cita en tu agenda, mandar un enlace a tu sistema de citas para que el cliente elija el horario, o dejar que un agente con IA conteste, pida los datos y registre o agende la cita en tu sistema. Las dos primeras son gratis; la tercera también, por ahora, con Wapzen." },
  { q: "¿Cómo mando recordatorios de citas por WhatsApp gratis?", a: "Guarda el recordatorio como respuesta rápida en WhatsApp Business y mándalo cada tarde a las citas del día siguiente. Es gratis, pero manual. Los recordatorios automáticos se mandan con plantillas por la API, que Meta cobra por mensaje: en México US$0.0085 (MXN 0.1565) cada uno desde el 1 de octubre de 2026." },
  { q: "¿Un bot de WhatsApp puede agendar citas?", a: "Sí. Un agente con IA puede contestar dudas, pedir nombre, servicio y horario, y con herramientas de API consultar los horarios libres de tu sistema y crear la cita. Si no tienes sistema, puede guardar cada solicitud en una hoja de Google para que tú la confirmes." },
  { q: "¿WhatsApp Business tiene agenda de citas?", a: "WhatsApp Business no está pensado como agenda. Lo normal es llevar las citas en Google Calendar o en un sistema de citas y usar WhatsApp para recibir las solicitudes, confirmar y recordar." },
  { q: "¿Sirve para un consultorio médico?", a: "Sí, para agendar, confirmar y contestar dudas de horarios, ubicación y costos. Indica al agente que nunca dé consejos médicos y que pida llamar al consultorio ante cualquier urgencia. Los datos de salud son datos sensibles: no los pidas por chat si no los necesitas." },
];

const sources = [
  { label: "Meta: precios de WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Google: agendas de citas en Google Calendar", href: "https://support.google.com/calendar/answer/10729749?hl=es-419" },
  { label: "Centro de ayuda de WhatsApp: vincular un dispositivo", href: "https://faq.whatsapp.com/1317564962315842" },
];

const sections = [
  {
    id: "tres-formas",
    title: "Tres formas de agendar citas por WhatsApp",
    body: <>
      <p>Consultorios, estéticas, barberías, talleres y despachos reciben la mayoría de sus citas por WhatsApp. Hay tres formas de manejarlas, de la más sencilla a la más automática:</p>
      <Comparison caption="Tres formas de agendar citas por WhatsApp comparadas" columns={["A mano", "Enlace de agenda", "Agente con IA"]} rows={ways} />
    </>,
  },
  {
    id: "a-mano",
    title: "1. A mano, gratis, con WhatsApp Business",
    body: <>
      <p>Si recibes pocas citas al día, la app gratis basta si te organizas:</p>
      <ul>
        <li><strong>Mensaje de bienvenida</strong> que pida de una vez lo que necesitas: nombre, servicio y día preferido. Tenemos <Link href="/es-mx/blog/mensajes-automaticos-whatsapp-business">ejemplos para copiar</Link>.</li>
        <li><strong>Respuestas rápidas</strong> con tus horarios, precios y dirección, para no escribirlos diez veces al día.</li>
        <li><strong>Etiquetas</strong> como “Cita por confirmar”, “Cita confirmada” y “No asistió”.</li>
        <li><strong>Una sola agenda</strong>, en papel o en Google Calendar, donde anotas todo en el momento para no empalmar citas.</li>
      </ul>
      <p>El límite es el tiempo: si contestas tarde, el cliente agenda con otro.</p>
    </>,
  },
  {
    id: "enlace",
    title: "2. Con un enlace a tu agenda",
    body: <>
      <p>Si ya usas un sistema de citas, o las <strong>agendas de citas de Google Calendar</strong>, manda el enlace en tu mensaje de bienvenida o como respuesta rápida. El cliente ve solo los horarios libres, elige uno y recibe la confirmación. El sistema bloquea el horario y evita empalmes.</p>
      <p>La desventaja es el paso extra: hay clientes que no salen del chat para llenar un formulario y prefieren preguntar “¿tienes lugar el jueves?”. Ahí es donde una IA ayuda.</p>
    </>,
  },
  {
    id: "con-ia",
    title: "3. Con un agente con IA que agenda por ti",
    body: <>
      <p>Un agente con IA en tu WhatsApp contesta como lo haría tu recepcionista: resuelve dudas, pide nombre, servicio, día y horario, y después hace una de dos cosas:</p>
      <ul>
        <li><strong>Registra la solicitud</strong> en una hoja de Google con una herramienta de API, para que tú confirmes después. No necesitas sistema de citas.</li>
        <li><strong>Agenda en tu sistema</strong>, si tiene API: con una herramienta consulta los horarios libres del día que pide el cliente y con otra crea la cita en el horario que eligió.</li>
      </ul>
      <Note>El agente no ve el número de WhatsApp del cliente, así que pídele en las instrucciones que lo solicite. Tampoco sabe la fecha de hoy: si tu sistema devuelve la fecha actual junto con los horarios libres, entiende bien “el próximo martes”. Y lee los primeros 3,000 caracteres de cada respuesta: devuelve una lista corta de horarios, no toda la agenda.</Note>
      <InlineCta title="Que la IA agende tus citas por WhatsApp" body="Wapzen contesta dudas y toma citas en tu número de siempre, por chat o por llamada de WhatsApp, a cualquier hora. Gratis por ahora." label="Empieza gratis" />
      <p>Muchos clientes prefieren llamar. Un agente de voz de Wapzen contesta las llamadas de WhatsApp en el mismo número y puede usar las mismas herramientas para tomar la cita en voz alta. Conoce cómo funciona un <Link href="/es-mx/blog/chatbot-para-whatsapp-business">chatbot para WhatsApp Business</Link>.</p>
    </>,
  },
  {
    id: "recordatorios",
    title: "Recordatorios de citas por WhatsApp",
    body: <>
      <p>Los recordatorios bajan las inasistencias. Hay tres formas de mandarlos:</p>
      <Comparison caption="Formas de mandar recordatorios de citas por WhatsApp" columns={["Costo", "Ideal para"]} rows={reminders} />
      <ul>
        <li><strong>A mano.</strong> Guarda el recordatorio como respuesta rápida y mándalo cada tarde a las citas del día siguiente.</li>
        <li><strong>Plantillas por la API.</strong> Los sistemas de citas conectados a la API los mandan solos, como plantillas de utilidad que Meta cobra por mensaje. Más detalles en <Link href="/es-mx/blog/whatsapp-business-precio">¿WhatsApp Business tiene costo?</Link></li>
        <li><strong>Llamadas de recordatorio con Wapzen.</strong> Crea una campaña con un agente de voz que confirme la cita y agrega a los pacientes del día siguiente como contactos cuando quieras que salgan las llamadas: cada contacto se llama en cuanto lo agregas.</li>
      </ul>
      <p>Ojo con la tercera opción: un contacto de campaña lleva nombre y número, no los datos de la cita, así que el agente confirma “su cita de mañana con nosotros” sin decir la hora. Si nadie contesta, el contacto queda como no exitoso y Wapzen no vuelve a marcar solo.</p>
      <Note>Wapzen es un producto independiente, no de Meta ni de WhatsApp. Escribe y llama solo a quien espera tu mensaje: WhatsApp restringe los números que mandan mensajes o llamadas no deseados.</Note>
    </>,
  },
];

export default function AgendarCitasPorWhatsAppPage() {
  return <BlogPost
    href={href}
    heading={<>Cómo agendar citas por WhatsApp.<br /><span>Y mandar recordatorios.</span></>}
    lead="Tres formas de agendar citas por WhatsApp Business, de gratis y a mano a automático con IA, y cómo mandar recordatorios para que tus pacientes y clientes no falten."
    summary={{
      title: "En resumen",
      items: [
        <><strong>A mano y gratis:</strong> WhatsApp Business con respuestas rápidas, etiquetas y una sola agenda.</>,
        <><strong>Con un enlace:</strong> mandas tu agenda en línea y el cliente elige un horario libre.</>,
        <><strong>Con IA:</strong> un agente contesta, pide los datos y registra o agenda la cita, de día y de noche.</>,
        <><strong>Recordatorios:</strong> gratis a mano, US$0.0085 por mensaje con la API o por llamada con un agente de voz.</>,
        <><strong>Para consultorios:</strong> nada de consejos médicos por chat y cuidado con los datos de salud.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/es-mx/blog/chatbot-para-whatsapp-business", "/es-mx/blog/mensajes-automaticos-whatsapp-business"]}
    product="/es/llamadas-con-ia"
    cta={{ heading: <>Citas por WhatsApp, día y noche.<br /><span>Agendadas por IA.</span></>, body: "Crea un agente gratis, agrega tus servicios y horarios y conecta tu número con un código QR. Contesta y agenda desde el primer día." }}
  />;
}
