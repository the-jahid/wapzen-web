import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Búsquedas objetivo: "recepcionista virtual" (30, 3/3), "agente de voz ia"
// (30, 3/3), "asistente telefónico ia" (20), "centralita virtual ia" (20),
// "secretaria virtual ia" (19), "recepcionista virtual ia" (18), autocompletado
// ES 2026-10-30 (docs/seo-blog-europe-research.mjs es). Quien busca una
// recepcionista virtual espera que atienda su teléfono; Wapzen solo atiende
// WhatsApp (chats y llamadas), y el artículo lo dice. Precios: Recepcionista.com
// de su propia web, servicios con personas de la comparativa de Minute Call
// (10 oct 2026). Sin versión en inglés: el post de Reino Unido
// (/blog/ai-receptionist-uk) usa precios y servicios británicos.
const href = "/es/blog/recepcionista-virtual-ia";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es", article: { publishedTime: post.published, modifiedTime: post.updated } });

const kinds = [
  ["Quién contesta", "Una persona de un equipo compartido", "Un agente de voz con IA", "Un agente con IA, por chat y por llamada"],
  ["Qué atiende", "Las llamadas a tu número", "Las llamadas a tu número, con desvío", "Los mensajes y las llamadas de WhatsApp"],
  ["Horario", "El del servicio; las 24 horas cuestan más", "24 horas", "24 horas"],
  ["Qué hace", "Toma recados, pasa llamadas, apunta citas", "Responde dudas, toma recados, agenda si se conecta a tu calendario", "Responde dudas con tu información, toma peticiones de cita y devuelve llamadas"],
  ["Precio habitual", "Desde unos 69–150 € al mes", "Desde 99 € al mes + IVA", "Gratis para empezar con Wapzen"],
];

const costs = [
  ["Recepcionista en plantilla", "Sueldo a jornada completa más Seguridad Social: fácilmente más de 1.500 € al mes", "Horario de oficina; vacaciones y bajas aparte"],
  ["Servicio con personas", "Secretaria.es desde 69 €/mes (bonos de llamadas); Fonvirtual desde 150 €/mes", "Recados y desvíos; el precio sube con el volumen"],
  ["IA para el teléfono", "Recepcionista.com: 99 € (200 min), 199 € (900 min) o 299 € (1.500 min) + IVA; 0,18 €/min extra", "24 horas, sin permanencia"],
  ["IA para WhatsApp", "Wapzen: gratis para empezar", "Chats y llamadas de WhatsApp, 24 horas"],
];

const faqs = [
  { q: "¿Cuánto cuesta una recepcionista virtual?", a: "Depende del tipo. Un servicio con personas compartidas empieza en unos 69–150 € al mes y sube con el número de llamadas. Una recepcionista con IA para el teléfono cuesta desde 99 € al mes + IVA con un límite de minutos, por ejemplo en Recepcionista.com. Una recepcionista con IA para WhatsApp, como Wapzen, es gratis para empezar." },
  { q: "¿Qué diferencia hay entre una centralita virtual y una recepcionista virtual?", a: "Una centralita virtual reparte las llamadas: el famoso «pulse 1 para ventas». Una recepcionista virtual las atiende: contesta, resuelve dudas, toma el recado o la cita. Muchas centralitas con IA ya mezclan las dos cosas." },
  { q: "¿Una recepcionista con IA habla bien español?", a: "Sí. Los modelos de voz actuales hablan un español natural, con acento de España si lo eliges, y entienden preguntas dichas de muchas formas. Antes de contratar, llama tú mismo varias veces con las preguntas reales de tus clientes." },
  { q: "¿Tiene que decir que es una inteligencia artificial?", a: "Sí. Desde el 2 de agosto de 2026, el artículo 50 del Reglamento europeo de IA obliga a informar a las personas de que hablan con una IA, salvo que sea evidente. El Digital Omnibus no ha retrasado esta obligación. Basta con una frase al inicio: «Hola, soy el asistente virtual de [negocio]»." },
  { q: "¿Puede atender las llamadas de mi teléfono fijo?", a: "Los servicios de IA para el teléfono, sí, desviando tu número. Wapzen no: atiende las llamadas de WhatsApp y los chats de WhatsApp, no las líneas fijas ni los móviles normales. Si tus clientes te llaman sobre todo al fijo, elige un servicio para el teléfono." },
  { q: "¿Puede reservar citas directamente en mi agenda?", a: "Los servicios para el teléfono suelen conectarse con Google Calendar u otras agendas. Wapzen toma la petición de cita con los datos del cliente para que tu equipo la confirme, o reserva directamente si tu sistema de citas tiene una API que puedas conectar como herramienta." },
];

const sources = [
  { label: "Recepcionista.com: precios", href: "https://www.recepcionista.com/precios" },
  { label: "Minute Call: empresas de recepcionista virtual en España (oct 2026)", href: "https://www.minute-call.com/articulos/mejores-empresas-recepcionista-virtual-espana" },
  { label: "Conversify: cuánto cuesta una recepcionista virtual", href: "https://conversify.app/es/cuanto-cuesta-recepcionista-virtual" },
  { label: "Modaes: Estudio de Redes Sociales 2025 de IAB Spain", href: "https://www.modaes.com/back-stage/radiografia-de-las-redes-sociales-en-espana-caen-x-y-facebook-frente-al-liderazgo-de-whatsapp" },
  { label: "Cookiebot: artículo 50 del Reglamento de IA desde agosto de 2026", href: "https://www.cookiebot.com/en/eu-ai-act-article-50-transparency-compliance/" },
];

const sections = [
  {
    id: "que-es",
    title: "¿Qué es una recepcionista virtual (y qué cambia con la IA)?",
    body: <>
      <p>Una <strong>recepcionista virtual</strong> atiende a tus clientes cuando tú no puedes: contesta, resuelve las dudas de siempre, toma el recado o la cita y te lo pasa. Hasta hace poco era un equipo de personas que compartías con otras empresas. Hoy hay tres opciones muy distintas:</p>
      <Comparison caption="Tres tipos de recepcionista virtual comparados" columns={["Servicio con personas", "IA para el teléfono", "IA para WhatsApp"]} rows={kinds} />
      <p>La diferencia importante no es la tecnología, sino <strong>por dónde te contactan tus clientes</strong>. Si llaman al fijo, necesitas algo que atienda el teléfono. Si te escriben y te llaman por WhatsApp, lo que necesitas es una recepcionista en WhatsApp.</p>
    </>,
  },
  {
    id: "precios",
    title: "¿Cuánto cuesta una recepcionista virtual en España?",
    body: <>
      <p>Estos son los rangos de precios que encontrarás en 2026, de la opción más cara a la más barata:</p>
      <Comparison caption="Cuánto cuesta cada tipo de recepcionista en España en 2026" columns={["Precio", "A tener en cuenta"]} rows={costs} />
      <p>Ojo con la letra pequeña: casi todos los servicios para el teléfono cobran por <strong>minutos</strong> o por <strong>llamadas</strong>, no por mes. Un ejemplo con una peluquería que recibe 15 llamadas al día de 2 minutos, 22 días al mes:</p>
      <ul>
        <li>15 × 2 × 22 = <strong>660 minutos al mes</strong>.</li>
        <li>Con el plan de 99 € (200 minutos): 99 € + 460 minutos extra × 0,18 € = <strong>181,80 € + IVA</strong>.</li>
        <li>Con el plan de 199 € (900 minutos): <strong>199 € + IVA</strong>, con margen para los meses fuertes.</li>
      </ul>
      <p>Aun así sale mucho más barato que una persona en plantilla, que además no contesta a las diez de la noche.</p>
      <Note>Los precios son de las webs de cada proveedor y de comparativas del sector, sin IVA salvo que se indique. Cambian a menudo: pide presupuesto antes de contratar.</Note>
    </>,
  },
  {
    id: "que-hace",
    title: "Qué puede hacer una recepcionista con IA (y qué no)",
    body: <>
      <p>Una buena recepcionista con IA resuelve la mayoría de llamadas y mensajes repetitivos:</p>
      <ul>
        <li><strong>Responder dudas frecuentes</strong>: horarios, precios, dirección, aparcamiento, formas de pago, servicios.</li>
        <li><strong>Tomar recados</strong> con nombre, teléfono y motivo, y avisarte.</li>
        <li><strong>Gestionar citas</strong>: tomar la petición o reservar directamente si se conecta a tu agenda.</li>
        <li><strong>Filtrar</strong>: separar al cliente que quiere un presupuesto del que vende publicidad.</li>
        <li><strong>Devolver llamadas</strong> a los contactos nuevos en cuanto llegan, mientras el interés está caliente.</li>
      </ul>
      <p>Lo que no debe hacer: dar consejo médico o legal, cerrar una queja complicada o cobrar. Para eso, la regla es simple: <strong>la IA lo dice y pasa el caso a una persona</strong>.</p>
    </>,
  },
  {
    id: "whatsapp",
    title: "Por qué en España la recepcionista también tiene que estar en WhatsApp",
    body: <>
      <p>WhatsApp es la red social favorita de los españoles según el Estudio de Redes Sociales 2025 de IAB Spain: la eligen como preferida el 37 % de los usuarios, por delante de Instagram (16 %). Para muchos negocios, la mitad de las consultas ya no llegan al fijo, sino por WhatsApp: un mensaje a las once de la noche preguntando si queda hueco el sábado, o una llamada de WhatsApp mientras estás con otro cliente.</p>
      <p>Una recepcionista solo para el teléfono no ve esos mensajes. Y los mensajes de ausencia de WhatsApp Business son textos fijos que no responden a nada. Por eso tiene sentido tener una recepcionista con IA <strong>en tu propio número de WhatsApp</strong>, que conteste el chat y también las llamadas de WhatsApp.</p>
    </>,
  },
  {
    id: "como-elegir",
    title: "Cómo elegir: 7 preguntas antes de contratar",
    body: <>
      <ol>
        <li><strong>¿Cobra por minuto, por llamada o tarifa plana?</strong> Calcula tus minutos reales, como en el ejemplo de arriba.</li>
        <li><strong>¿El precio lleva IVA?</strong> La mayoría de servicios lo suman aparte.</li>
        <li><strong>¿Hay permanencia?</strong> Algunos piden 12 meses; otros se cancelan de un mes para otro.</li>
        <li><strong>¿Qué pasa cuando se acaban los minutos?</strong> ¿Deja de contestar o te cobra el exceso?</li>
        <li><strong>¿Se conecta con tu agenda?</strong> Si no, solo toma la petición y tu equipo confirma.</li>
        <li><strong>¿Pasa a una persona?</strong> Pregunta cómo te avisa cuando un cliente necesita hablar contigo.</li>
        <li><strong>¿Cumple el RGPD y el Reglamento de IA?</strong> Pide el contrato de encargado del tratamiento y comprueba que la IA se presenta como tal, obligatorio desde el 2 de agosto de 2026.</li>
      </ol>
    </>,
  },
  {
    id: "wapzen",
    title: "Una recepcionista con IA en tu WhatsApp, gratis para empezar",
    body: <>
      <p><strong>Wapzen</strong> conecta tu número de WhatsApp actual como un dispositivo vinculado, igual que WhatsApp Web, con un código QR. A partir de ahí, un agente con IA contesta cada chat con la información de tu negocio, y un agente de voz atiende las llamadas de WhatsApp en español y llama a los contactos nuevos que añades. Sigues usando WhatsApp en tu móvil y puedes contestar tú cuando quieras.</p>
      <ul>
        <li><strong>Sin número nuevo</strong> y sin solicitar la API de WhatsApp Business.</li>
        <li><strong>Sin coste por mensaje</strong> de Meta para sus respuestas.</li>
        <li><strong>Gratis para empezar</strong>, sin tarjeta y sin permanencia. Si tu volumen es grande, escríbenos.</li>
      </ul>
      <InlineCta title="Tu recepcionista en WhatsApp, abierta 24 horas" body="Crea un agente con IA, añade la información de tu negocio y vincula tu número con un código QR. Empieza a contestar al momento." label="Empieza gratis" />
      <p>Sus límites, sin rodeos: Wapzen <strong>no atiende tu teléfono fijo</strong>, solo WhatsApp. No es un producto de Meta, no contesta en grupos y no lee fotos ni audios. Como dispositivo vinculado, sus servidores leen cada mensaje que recibes y lo envían a un modelo de IA para escribir la respuesta, así que avisa a tus clientes de que primero contesta un asistente. Si quieres que reserve en tu agenda, mira <Link href="/es-mx/blog/agendar-citas-por-whatsapp">cómo agendar citas por WhatsApp</Link>.</p>
      <Choose locale="es" items={[
        { name: "un servicio para el teléfono", points: ["tus clientes llaman sobre todo al fijo", "necesitas desviar llamadas a distintas personas", "quieres que una persona real conteste en horario de oficina"] },
        { name: "Wapzen", points: ["tus clientes te escriben y te llaman por WhatsApp", "quieres contestar a cualquier hora sin pagar por minuto", "quieres devolver la llamada a cada contacto nuevo al momento"] },
      ]} />
    </>,
  },
];

export default function RecepcionistaVirtualIaPage() {
  return <BlogPost
    href={href}
    heading={<>Recepcionista virtual con IA.<br /><span>Precios y opciones reales.</span></>}
    lead="Cuánto cuesta en España una recepcionista virtual, de un servicio con personas a una IA que atiende el teléfono por minutos o tu WhatsApp las 24 horas, con un ejemplo de cálculo y las preguntas que debes hacer antes de contratar."
    summary={{
      title: "En resumen",
      items: [
        <><strong>Tres opciones:</strong> un servicio con personas (desde unos 69–150 €/mes), una IA para el teléfono (desde 99 €/mes + IVA) o una IA para WhatsApp.</>,
        <><strong>Cuidado con los minutos:</strong> la mayoría cobra por minuto o por llamada. Calcula tu volumen real antes de elegir plan.</>,
        <><strong>Obligatorio desde agosto de 2026:</strong> la IA tiene que decir que es una IA.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/es-mx/blog/agendar-citas-por-whatsapp", "/es-mx/blog/chatbot-para-whatsapp-business"]}
    product="/es/llamadas-con-ia"
    cta={{ heading: <>Tu recepcionista en WhatsApp.<br /><span>Contesta chats y llamadas.</span></>, body: "Crea tu agente con IA, añade la información de tu negocio y vincula tu número de WhatsApp. Gratis para empezar, sin tarjeta." }}
  />;
}
