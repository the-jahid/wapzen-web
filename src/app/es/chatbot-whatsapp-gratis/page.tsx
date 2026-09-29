import type { Metadata } from "next";
import { BookOpen, Languages, MessageSquareReply, PhoneIncoming, Smartphone, Zap } from "lucide-react";
import { pageMetadata } from "@/lib/pageMetadata";
import { Cards, Comparison, MarketingPage, Section, Steps } from "@/components/marketing/MarketingPage";

// España. Búsquedas objetivo: "chatbot whatsapp gratis", "chatbot whatsapp
// con ia", "chatbot whatsapp business (gratis)", "agente ia whatsapp
// business", "ia en whatsapp", "chatbot para inmobiliarias", "chatbot
// whatsapp para agendar citas" (docs/seo-research.md). Español de España.
// Versión en inglés: /free-whatsapp-chatbot.
const path = "/es/chatbot-whatsapp-gratis";
const title = "Chatbot de WhatsApp Gratis con IA para tu Negocio";
const description = "Crea gratis un chatbot con IA para el WhatsApp de tu negocio. Responde a tus clientes 24 horas con tu propia información, sin programar y sin la API oficial.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "es" });

const steps = [
  { title: "Crea tu cuenta gratis", body: "Regístrate en Wapzen. No te pedimos tarjeta y no necesitas contratar la API oficial de WhatsApp." },
  { title: "Crea un agente de chat", body: "Ponle nombre, elige un modelo de OpenAI (GPT) o de Anthropic (Claude) y escribe sus instrucciones: el tono, qué puede responder y qué no." },
  { title: "Enséñale tu negocio", body: "Añade una base de conocimiento con preguntas frecuentes, precios, horarios y condiciones. Pega texto o sube archivos PDF y Word." },
  { title: "Conecta tu WhatsApp", body: "Escanea un código QR con el WhatsApp de tu móvil, igual que al vincular WhatsApp Web. Funciona con WhatsApp Business o con el WhatsApp de siempre." },
  { title: "Pruébalo y actívalo", body: "Escribe a tu número desde otro móvil. La IA responde al momento y todas las conversaciones quedan guardadas en el panel." },
];

const features = [
  { icon: MessageSquareReply, title: "Atención automática 24 horas", body: "Responde cada mensaje en segundos, también de noche, los fines de semana y en festivos." },
  { icon: BookOpen, title: "Respuestas con tu información", body: "Usa tus documentos, precios y preguntas frecuentes, así que las respuestas son de tu negocio y no genéricas." },
  { icon: Zap, title: "Acciones con herramientas de API", body: "Conecta herramientas de API para consultar un pedido, ver disponibilidad o reservar una cita en tu propio sistema." },
  { icon: Languages, title: "Responde en el idioma del cliente", body: "Si el cliente escribe en español, catalán o inglés, la IA le contesta en ese mismo idioma." },
  { icon: Smartphone, title: "En tu número de siempre", body: "Conecta un WhatsApp Business o personal con un código QR. Sin número nuevo y sin API oficial." },
  { icon: PhoneIncoming, title: "También atiende llamadas", body: "Añade un agente de voz con IA para atender y hacer llamadas de WhatsApp con voz natural." },
];

const comparison = [
  ["Precio", "Planes mensuales y tarifas de Meta por plantilla", "Gratis por ahora"],
  ["Puesta en marcha", "Cuenta de Meta, número registrado y, normalmente, un proveedor", "Escanear un código QR"],
  ["Respuestas", "A menudo menús de botones; la IA suele pagarse aparte", "IA incluida (GPT o Claude)"],
  ["Llamadas con IA", "Poco habituales o de pago", "Incluidas, entrantes y salientes"],
  ["Plataforma oficial de Meta", "Sí", "No: se vincula como WhatsApp Web"],
];

const faqs = [
  { q: "¿Hay algún chatbot de WhatsApp gratis?", a: "Sí. Wapzen es gratis por ahora, con todas las funciones: chatbot con IA, agente de voz, campañas de llamadas, bases de conocimiento y herramientas de API. No hace falta tarjeta." },
  { q: "¿Cómo pongo IA en el WhatsApp de mi negocio?", a: "Crea una cuenta en Wapzen, configura un agente de chat con tus instrucciones e información y conecta tu número escaneando un código QR. Desde ese momento, la IA responde a los mensajes que llegan." },
  { q: "¿Funciona con WhatsApp Business?", a: "Sí. Puedes conectar un número de WhatsApp Business o de WhatsApp personal. El WhatsApp personal no tiene respuestas automáticas, y Wapzen le añade respuestas con IA." },
  { q: "¿Necesito la API oficial de WhatsApp?", a: "No. Wapzen vincula tu número con un código QR, como WhatsApp Web, así que no hay alta en la API, aprobación de plantillas ni tarifas de Meta por mensaje. No es un producto oficial de Meta: para envíos masivos, la API oficial es la herramienta adecuada." },
  { q: "¿Qué IA usa? ¿Es ChatGPT?", a: "Tú eliges para cada agente: modelos GPT de OpenAI (la familia de ChatGPT) o modelos Claude de Anthropic. Los dos están incluidos y no necesitas tu propia clave de API." },
  { q: "¿Puede agendar citas por WhatsApp?", a: "Recoge el nombre, el servicio y la hora que prefiere el cliente durante la conversación. Para reservar directamente en tu agenda, conecta una herramienta de API; si no, tu equipo confirma desde el historial." },
  { q: "¿Sirve para inmobiliarias?", a: "Sí. Sube tus fichas de inmuebles y precios a una base de conocimiento y la IA responde a las consultas, pregunta por el presupuesto y la zona y recoge las solicitudes de visita." },
];

export default function ChatbotWhatsAppGratisEsPage() {
  return <MarketingPage
    locale="es"
    path={path}
    name="Chatbot de WhatsApp gratis"
    title={title}
    description={description}
    eyebrow="Chatbot con IA"
    heading={<>Chatbot de WhatsApp con IA.<br /><span>Gratis y sin API.</span></>}
    lead="Wapzen pone una IA a atender el WhatsApp de tu negocio. Responde a cada cliente con tu propia información, las 24 horas, y funciona en tu número de siempre: solo tienes que escanear un código QR. Sin programar y sin la API oficial."
    perks={["Gratis", "Sin programar", "Sin API oficial", "WhatsApp Business o personal"]}
    ctaLabel="Crear mi chatbot gratis"
    secondary={{ href: "#como-crear", label: "Ver cómo se crea" }}
    faq={{ heading: <>Chatbots de WhatsApp.<br /><span>Preguntas frecuentes.</span></>, items: faqs }}
    cta={{ heading: <>Tu chatbot de WhatsApp con IA.<br /><span>Gratis desde hoy.</span></>, body: "Crea tu cuenta, enseña a la IA cómo funciona tu negocio y conecta tu número con un código QR." }}
  >
    <Section id="como-crear" heading={<>Cómo crear un chatbot de WhatsApp gratis.<br /><span>Cinco pasos, sin programar.</span></>}>
      <Steps items={steps} />
    </Section>

    <Section id="funciones" heading={<>Lo que hace tu chatbot.<br /><span>Todo incluido.</span></>} intro="El plan gratis es el producto completo. Todas estas funciones van en tu número de WhatsApp desde el primer día.">
      <Cards items={features} />
    </Section>

    <Section id="comparar" heading={<>¿API oficial o Wapzen?<br /><span>Compara antes de elegir.</span></>}>
      <Comparison caption="Plataformas con la API oficial de WhatsApp comparadas con Wapzen" columns={["Plataformas con API oficial", "Wapzen"]} rows={comparison} />
    </Section>
  </MarketingPage>;
}
