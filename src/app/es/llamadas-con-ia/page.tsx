import type { Metadata } from "next";
import { BookOpen, CalendarCheck, FileText, PhoneIncoming, PhoneOutgoing, Radio } from "lucide-react";
import { pageMetadata } from "@/lib/pageMetadata";
import { Cards, Comparison, MarketingPage, Section, Steps } from "@/components/marketing/MarketingPage";

// España. Búsquedas objetivo: "llamadas con ia", "agente de voz ia",
// "recepcionista (virtual) ia", "asistente virtual ia", "secretaria virtual
// ia", "automatizar llamadas con ia" (docs/seo-research.md). Solo llamadas de
// WhatsApp, nunca línea telefónica. Versión en inglés: /free-ai-calling-agent.
const path = "/es/llamadas-con-ia";
const title = "Llamadas con IA por WhatsApp: Agente de Voz Gratis";
const description = "Un agente de voz con IA que atiende y hace llamadas de WhatsApp, como recepcionista o asistente virtual. Voz natural en español, gratis y sin coste por minuto.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "es" });

const features = [
  { icon: PhoneIncoming, title: "Recepcionista virtual con IA", body: "Atiende todas las llamadas de WhatsApp, informa de horarios, servicios y precios y anota lo que necesita cada cliente." },
  { icon: PhoneOutgoing, title: "Llamadas salientes a contactos", body: "Llama a los nuevos contactos en cuanto llegan, hace las preguntas que definas y guarda las respuestas en la transcripción." },
  { icon: CalendarCheck, title: "Solicitudes de cita", body: "Recoge el día y la hora que prefiere el cliente. Con una herramienta de API, reserva directamente en tu sistema." },
  { icon: Radio, title: "Campañas de llamadas", body: "Añade contactos a una campaña y la IA llama a cada uno. Sigue los resultados en las analíticas de la campaña." },
  { icon: BookOpen, title: "Respuestas de tu base de conocimiento", body: "Consulta tus precios, condiciones y preguntas frecuentes durante la llamada en lugar de inventar." },
  { icon: FileText, title: "Transcripción de cada llamada", body: "Todas las llamadas quedan guardadas con transcripción en el panel para que tu equipo haga el seguimiento." },
];

const steps = [
  { title: "Crea tu cuenta gratis", body: "Sin tarjeta y sin cuenta propia en OpenAI o ElevenLabs." },
  { title: "Crea un agente de voz", body: "Escribe sus instrucciones y el saludo, elige español (España) como idioma y escoge una voz." },
  { title: "Añade conocimiento y herramientas", body: "Adjunta una base de conocimiento y, si quieres, herramientas de API para consultar pedidos o reservar citas." },
  { title: "Conecta tu WhatsApp", body: "Escanea un código QR para vincular tu número y asígnale el agente de voz." },
  { title: "Atiende y llama", body: "La IA atiende las llamadas de WhatsApp entrantes. Para llamar, usa el panel o crea una campaña con tus contactos." },
];

const comparison = [
  ["Precio", "Normalmente por minuto", "Gratis por ahora"],
  ["Número", "A menudo un número nuevo", "Tu número de WhatsApp"],
  ["A quién llama", "A cualquier teléfono", "A quien tenga WhatsApp"],
  ["Mensajes", "Otra herramienta", "Chatbot con IA incluido"],
  ["Puesta en marcha", "A menudo un operador y una integración", "Escanear un código QR"],
];

const faqs = [
  { q: "¿Se pueden hacer llamadas con IA gratis?", a: "Sí. Wapzen es gratis por ahora, incluido el agente de voz con IA que atiende y hace llamadas de WhatsApp, sin coste por minuto." },
  { q: "¿La IA llama a números de teléfono normales?", a: "No. Wapzen atiende y hace llamadas de WhatsApp. La otra persona necesita WhatsApp, y tú no necesitas línea telefónica ni operador." },
  { q: "¿La IA habla español de España?", a: "Sí. Elige español (España) como idioma del agente y una voz que lo hable. También puedes usar catalán, inglés y decenas de idiomas más." },
  { q: "¿Puedo usarla como recepcionista virtual?", a: "Sí. Asigna el agente de voz a tu número y atenderá todas las llamadas de WhatsApp, resolverá dudas con tu base de conocimiento y guardará la transcripción para tu equipo." },
  { q: "¿Qué pasa si la IA no sabe responder?", a: "Tú decides en sus instrucciones, por ejemplo, que diga que alguien del equipo devolverá la llamada. La transcripción queda guardada para hacer el seguimiento." },
  { q: "¿Necesito una cuenta de OpenAI o ElevenLabs?", a: "No. El reconocimiento de voz, los modelos de IA y las voces ya están incluidos en Wapzen." },
];

export default function LlamadasConIaPage() {
  return <MarketingPage
    locale="es"
    path={path}
    name="Llamadas con IA"
    title={title}
    description={description}
    eyebrow="Agente de voz con IA"
    heading={<>Llamadas con IA.<br /><span>Por WhatsApp y gratis.</span></>}
    lead="Crea un agente de voz con IA que atiende las llamadas de WhatsApp de tu negocio y llama a tus contactos. Habla en español con voz natural, usa la información de tu negocio y guarda la transcripción de cada llamada."
    perks={["Gratis", "Voz natural en español", "Sin coste por minuto", "Tu número de WhatsApp"]}
    ctaLabel="Crear mi agente de voz gratis"
    secondary={{ href: "#como-funciona", label: "Ver cómo funciona" }}
    faq={{ heading: <>Llamadas con IA.<br /><span>Preguntas frecuentes.</span></>, items: faqs }}
    cta={{ heading: <>Llamadas con IA.<br /><span>En tu número de WhatsApp.</span></>, body: "Crea tu cuenta gratis, elige una voz y deja que la IA atienda y haga las llamadas de WhatsApp de tu negocio." }}
  >
    <Section id="funciones" heading={<>Recepcionista y asistente virtual.<br /><span>Un solo agente de voz.</span></>}>
      <Cards items={features} />
    </Section>

    <Section id="como-funciona" heading={<>Cómo automatizar llamadas con IA.<br /><span>Cinco pasos, sin programar.</span></>} intro="El agente de voz de Wapzen funciona con las llamadas de WhatsApp: no hay línea que contratar ni nada que instalar.">
      <Steps items={steps} />
    </Section>

    <Section id="comparar" heading={<>¿WhatsApp o línea telefónica?<br /><span>Qué cambia.</span></>}>
      <Comparison caption="IA de llamadas por línea telefónica comparada con Wapzen en WhatsApp" columns={["IA en línea telefónica", "Wapzen en WhatsApp"]} rows={comparison} />
    </Section>
  </MarketingPage>;
}
