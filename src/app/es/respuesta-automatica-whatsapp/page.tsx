import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { Comparison, MarketingPage, Samples, Section, Steps } from "@/components/marketing/MarketingPage";

// España. Búsquedas objetivo: "respuesta automática whatsapp business",
// "mensaje automático whatsapp", "... fuera de horario", "... personal",
// "... iphone", "configurar respuesta automática", "... vacaciones"
// (docs/seo-research.md). Versión en inglés: /whatsapp-auto-reply.
const path = "/es/respuesta-automatica-whatsapp";
const title = "Respuesta Automática WhatsApp: Configurar y Ejemplos";
const description = "Configura la respuesta automática en WhatsApp Business o personal, copia ejemplos de mensajes y activa una IA gratis que responde de verdad a cada cliente.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "es" });

const businessSteps = [
  { title: "Abre Herramientas para la empresa", body: "En WhatsApp Business, entra en Ajustes (iPhone) o en Más opciones (Android) y toca Herramientas para la empresa." },
  { title: "Elige ausencia o bienvenida", body: "El mensaje de ausencia responde cuando no estás disponible. El de bienvenida saluda a quien te escribe por primera vez o tras 14 días sin actividad." },
  { title: "Escribe el mensaje", body: "Actívalo y edita el texto. Los ejemplos de más abajo son un buen punto de partida." },
  { title: "Configura horario y destinatarios", body: "Envíalo siempre, con un horario personalizado o fuera del horario comercial, elige quién lo recibe y toca Guardar." },
];

const comparison = [
  ["Qué envía", "El mismo texto fijo a todos", "Una respuesta real a cada mensaje"],
  ["Responde preguntas", "No", "Sí, con tu base de conocimiento"],
  ["WhatsApp personal", "No, solo WhatsApp Business", "Sí, personal o Business"],
  ["Cuándo responde", "Fuera de horario o en el primer mensaje", "Cada mensaje, 24 horas"],
  ["Coste", "Gratis", "Gratis por ahora"],
];

const samples = [
  { title: "Fuera de horario", text: "¡Hola! Gracias por tu mensaje. Ahora mismo estamos cerrados. Nuestro horario es de lunes a viernes, de 9:00 a 18:00, y te responderemos en cuanto volvamos." },
  { title: "Bienvenida", text: "¡Hola! Bienvenido/a a [Nombre del negocio]. ¿En qué podemos ayudarte? Pregúntanos por productos, precios u horarios." },
  { title: "Ocupado", text: "¡Gracias por escribir! Ahora mismo estoy atendiendo a un cliente y te respondo en menos de una hora." },
  { title: "Vacaciones", text: "¡Hola! Estamos de vacaciones del [fecha] al [fecha]. Responderemos a todos los mensajes a la vuelta. ¡Gracias por tu paciencia!" },
  { title: "Fin de semana", text: "¡Gracias por tu mensaje! El equipo descansa el fin de semana y te responderá el lunes por la mañana." },
  { title: "Consulta de pedido", text: "¡Gracias por contactar con [Nombre del negocio]! Para consultar tu pedido, envíanos el número de pedido y te respondemos enseguida." },
  { title: "Solicitud de cita", text: "¡Hola! Gracias por tu interés. Dinos qué día y a qué hora te viene mejor y te confirmamos la cita lo antes posible." },
  { title: "Llamada perdida", text: "¡Perdona, no hemos podido atender tu llamada! ¿En qué te ayudamos? Escríbenos por aquí y te respondemos enseguida." },
];

const faqs = [
  { q: "¿Cómo configuro la respuesta automática en WhatsApp Business?", a: "Entra en Ajustes (iPhone) o en Más opciones (Android), abre Herramientas para la empresa y elige Mensaje de ausencia o Mensaje de bienvenida. Actívalo, escribe el texto, elige horario y destinatarios y toca Guardar." },
  { q: "¿Se puede poner respuesta automática en WhatsApp personal?", a: "El WhatsApp personal no tiene esa función. Puedes pasar el número a WhatsApp Business, que es gratis, o conectarlo a Wapzen para tener respuestas con IA sin cambiar de aplicación." },
  { q: "¿Cómo pongo un mensaje automático fuera de horario?", a: "En WhatsApp Business, define tu horario comercial en el perfil de empresa, activa el mensaje de ausencia y elige la opción de enviarlo fuera del horario comercial." },
  { q: "¿La respuesta automática funciona en iPhone?", a: "Sí. En WhatsApp Business para iPhone está en Ajustes > Herramientas para la empresa. Con Wapzen, las respuestas salen desde la nube, así que funcionan con cualquier móvil." },
  { q: "¿Hay alguna respuesta automática con IA gratis?", a: "Sí. Wapzen es gratis por ahora, sin tarjeta y sin la API oficial de WhatsApp. La IA lee cada mensaje y responde con la información de tu negocio." },
  { q: "¿Tengo que dejar WhatsApp Web abierto en el ordenador?", a: "No. Una vez vinculado tu número, Wapzen responde desde la nube, sin pestañas abiertas ni ordenador encendido." },
];

export default function RespuestaAutomaticaEsPage() {
  return <MarketingPage
    locale="es"
    path={path}
    name="Respuesta automática en WhatsApp"
    title={title}
    description={description}
    eyebrow="Respuesta automática"
    heading={<>Respuesta automática en WhatsApp.<br /><span>Configuración, ejemplos e IA.</span></>}
    lead="Todo sobre la respuesta automática en WhatsApp: cómo activarla en WhatsApp Business, qué hacer con el WhatsApp personal, ejemplos de mensajes para copiar y una IA gratis que responde de verdad a cada cliente."
    perks={["Ejemplos para copiar", "Business y personal", "Respuesta con IA gratis"]}
    ctaLabel="Activar respuestas con IA gratis"
    secondary={{ href: "#ejemplos", label: "Ver los ejemplos" }}
    faq={{ heading: <>Respuesta automática.<br /><span>Preguntas frecuentes.</span></>, items: faqs }}
    cta={{ heading: <>Respuestas que resuelven.<br /><span>No solo “estamos fuera”.</span></>, body: "Conecta tu WhatsApp a Wapzen y deja que la IA responda de verdad a cada mensaje, de día y de noche. Gratis y sin tarjeta." }}
  >
    <Section id="whatsapp-business" heading={<>Cómo configurar la respuesta automática en WhatsApp Business.<br /><span>Integrada, gratis y con texto fijo.</span></>} intro="WhatsApp Business incluye dos mensajes automáticos. Envían siempre el mismo texto, lo que va bien para avisar de que no estás disponible.">
      <Steps items={businessSteps} />
    </Section>

    <Section id="whatsapp-personal" heading={<>Respuesta automática en WhatsApp personal.<br /><span>No existe, pero tiene solución.</span></>} intro="El WhatsApp personal no tiene respuesta automática. Puedes pasar el número a WhatsApp Business, que es gratis y puede conservar tu historial de chats, o vincularlo a Wapzen, que añade respuestas con IA sin cambiar de aplicación.">
      <Comparison caption="Mensaje de ausencia comparado con la respuesta con IA de Wapzen" columns={["Mensaje de ausencia", "Respuesta con IA de Wapzen"]} rows={comparison} />
    </Section>

    <Section id="ejemplos" heading={<>Ejemplos de mensajes automáticos.<br /><span>Copia y pega.</span></>} intro="Cambia lo que va entre [corchetes] por tus datos. Sirven como mensaje de ausencia o de bienvenida, o como ejemplo en las instrucciones de tu agente de IA.">
      <Samples items={samples} locale="es" />
    </Section>
  </MarketingPage>;
}
