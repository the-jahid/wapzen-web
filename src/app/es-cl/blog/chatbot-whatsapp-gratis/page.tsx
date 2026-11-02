import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Búsquedas (autocompletado Google, YouTube y DuckDuckGo con gl=cl, 2026-11-02):
// "chatbot whatsapp gratis" (54), "chatbot con ia para whatsapp gratis" (53),
// "chatbot para whatsapp gratis" (48), "agente de ia whatsapp" (43), "agente de voz
// ia" (30). "ilimitado" no tiene búsquedas: va en el texto, no en el título. Formato
// de preguntas y respuestas (QaPost) a pedido del usuario, distinto de los demás posts.
// Precios: superpyme.cl/precios-bot-whatsapp y wati.io/pricing; tarifas de Meta para
// Chile de Zernio, citando la lista del 1 de octubre de 2026. Lo que se dice de Wapzen
// sigue a whiskey-bailey-server: sin tope de respuestas (quitado el 2026-11-02), 1
// agente de chat por cuenta, últimos 20 intercambios, solo texto y leyendas, sin
// grupos. La voz se describe como funcionando a pedido del usuario (2026-11-02). Ley
// 21.719: REVISAR tras el 30 de noviembre, igual que el post de clínicas dentales.
const href = "/es-cl/blog/chatbot-whatsapp-gratis";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es-CL", article: { publishedTime: post.published, modifiedTime: post.updated } });

const costs = [
  ["Cuota mensual", "$29.990", "US$49 (US$39 pagando anual)", "No hay: pagas por mensaje", "$0"],
  ["Respuestas de IA incluidas", "Hasta 500 al mes", "250 créditos de IA al mes", "No trae IA: la pones tú", "Ilimitadas"],
  ["Tarifas de Meta", "Aparte, si usa la API oficial", "Aparte", "1.000 respuestas gratis al mes por número, luego US$0,02 cada una", "No aplican"],
  ["Agente de voz", "No aparece en sus precios", "Astra, con precio aparte", "Llamadas que recibes, gratis; las que haces, US$0,0121 por minuto. Más la plataforma de voz", "Incluido"],
];

const fit = [
  ["Pyme que recibe consultas todo el día", "Sí", "Responde en segundos con tu información, de día y de noche"],
  ["Tienda que vende por Instagram y WhatsApp", "Sí", "Toma pedidos y los guarda en tu panel"],
  ["Negocio que recibe llamadas por WhatsApp", "Sí", "El agente de voz contesta y responde dudas"],
  ["Empresa que necesita la insignia verde o plantillas aprobadas", "No", "Eso exige la API oficial de Meta"],
  ["Equipo que quiere tomar un chat y silenciar al bot solo ahí", "Todavía no", "Hoy se pausa el agente completo, no una conversación"],
  ["Marca que quiere escribir a contactos que nunca le escribieron", "No", "WhatsApp lo restringe y arriesgas el número"],
];

const prompt = `Eres la asistente virtual de Tienda Lirio, ropa de mujer en Ñuñoa, Santiago.
Responde en español de Chile, con mensajes cortos y cordiales: dos o tres frases.
Usa solo la información de la base de conocimiento para precios, tallas y stock.
Despachamos a todo Chile por Starken en 2 a 5 días hábiles. En Santiago, el despacho es gratis sobre $40.000.
Pagos: transferencia, tarjeta con link de pago o efectivo al retirar en tienda.
Si alguien quiere comprar, pide producto, talla, nombre, dirección y comuna, repite el pedido y pide que lo confirme.
Si no sabes algo, dilo y ofrece que una persona del equipo responda de lunes a sábado, de 10:00 a 19:00.
Di desde el primer mensaje que eres una asistente virtual.`;

const sources = [
  { label: "Superpyme: precios del bot de WhatsApp", href: "https://superpyme.cl/precios-bot-whatsapp/" },
  { label: "WATI: precios", href: "https://www.wati.io/pricing/" },
  { label: "Zernio: tarifas de WhatsApp por país, lista del 1 de octubre de 2026", href: "https://zernio.com/whatsapp-api-pricing" },
  { label: "Meta: precios de la plataforma de WhatsApp Business", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "La Tercera: Senado aprueba postergar la ley de datos personales", href: "https://www.latercera.com/nacional/noticia/senado-aprueba-postergacion-de-entrada-en-vigencia-de-ley-de-proteccion-de-datos-personales-iniciativa-pasa-a-la-camara/" },
  { label: "WhatsApp Business: política de mensajes", href: "https://whatsappbusiness.com/policy/" },
];

const questions = [
  {
    id: "existe",
    q: "¿Existe un chatbot de WhatsApp con IA realmente gratis en Chile?",
    answer: "Sí. Wapzen te da un chatbot de WhatsApp con IA gratis, con respuestas ilimitadas y sin tarifas por mensaje. Contesta en tu propio número, con tu información, y también atiende llamadas de WhatsApp con un agente de voz. La mayoría de las otras opciones son gratis solo como prueba o cobran la IA por cupo de respuestas.",
    body: <>
      <p>Si buscas “chatbot WhatsApp gratis”, casi todo lo que aparece tiene una trampa. Algunos son gratis solo por 7 o 14 días. Otros tienen un plan gratis sin IA, que solo envía menús con botones. Y los que sí traen IA la venden por cupo: 250, 500 o 1.000 respuestas al mes, y después pagas más.</p>
      <p>En Chile se suma otro costo: las tarifas de Meta. Quien usa la API oficial de WhatsApp paga por cada respuesta después de las primeras 1.000 del mes, y Chile tiene de las tarifas más altas de la región.</p>
      <p><Link href="/es/chatbot-whatsapp-gratis">Wapzen</Link> funciona distinto: no cobra cuota, no pone tope a las respuestas de IA y no usa la API oficial, así que tampoco hay tarifas de Meta. No necesitas tarjeta de crédito ni una clave de OpenAI: los modelos de IA vienen incluidos.</p>
    </>,
  },
  {
    id: "ilimitado",
    q: "¿Qué significa que sea ilimitado?",
    answer: "Que no hay tope de respuestas de IA: el agente contesta cada mensaje que te llegue, sean 50 o 50.000 al mes, sin costo por mensaje. Lo que sí tiene un límite es la cantidad de agentes de chat: uno por cuenta.",
    body: <>
      <p>En la práctica, “ilimitado” quiere decir tres cosas:</p>
      <ul>
        <li><strong>Sin cupo de respuestas.</strong> No hay un contador que se acabe a mitad de mes y deje a tus clientes sin respuesta.</li>
        <li><strong>Sin cobro por mensaje.</strong> No pagas a Wapzen ni a Meta por cada respuesta.</li>
        <li><strong>Sin horario.</strong> El agente contesta a las 3:00 de la madrugada igual que a mediodía, incluso un domingo o un feriado.</li>
      </ul>
      <p>Para que sepas exactamente qué recibes: cada cuenta tiene <strong>un agente de chat</strong>, que contesta los chats uno a uno (no los grupos). Lee mensajes de texto y el texto que acompaña a fotos y videos, pero no escucha notas de voz.</p>
    </>,
  },
  {
    id: "cuanto-cuesta",
    q: "¿Cuánto cuesta un chatbot de WhatsApp con IA en Chile?",
    answer: "En un plan chileno como Superpyme, entre $29.990 y $79.990 al mes por 500 a 5.000 respuestas de IA. En una plataforma internacional como WATI, desde US$39 al mes con 250 créditos de IA. En ambos casos, casi siempre más las tarifas de Meta. Con Wapzen cuesta $0, sin cupo.",
    body: <>
      <p>Comparamos un plan chileno, una plataforma internacional, la API oficial de Meta y Wapzen, con los precios publicados en sus páginas:</p>
      <Comparison caption="Costo de un chatbot de WhatsApp con IA en Chile: Superpyme, WATI, API oficial de Meta y Wapzen" columns={["Superpyme IA Starter", "WATI Growth", "API oficial de Meta", "Wapzen"]} rows={costs} />
      <h3>Un ejemplo con números</h3>
      <p>Una tienda que recibe 60 conversaciones al día, con unas 4 respuestas cada una, envía cerca de <strong>7.200 respuestas de IA al mes</strong>:</p>
      <ul>
        <li><strong>Superpyme:</strong> necesitas al menos el plan Pro Integrado de <strong>$79.990</strong>, que cubre 5.000 respuestas. Las otras 2.200 se pagan como uso extra, desde $9.990, más las tarifas de Meta si usa la API oficial.</li>
        <li><strong>WATI:</strong> el plan Growth trae 250 créditos de IA al mes. Aunque cada crédito fuera una respuesta, alcanzan para un día de consultas. El resto se compra en paquetes de créditos, más las tarifas de Meta.</li>
        <li><strong>API oficial de Meta:</strong> descontando las 1.000 respuestas gratis, quedan 6.200 × US$0,02 = <strong>US$124 al mes</strong>, solo en tarifas de Meta, antes de pagar cualquier plataforma.</li>
        <li><strong>Wapzen:</strong> <strong>$0</strong>.</li>
      </ul>
      <Note>Precios de Superpyme en pesos chilenos con IVA, y de WATI en dólares, según sus páginas en la fecha de este artículo. Las tarifas de Meta cambian cada trimestre: confírmalas en Meta.</Note>
    </>,
  },
  {
    id: "por-que-gratis",
    q: "¿Por qué Wapzen no paga tarifas de Meta?",
    answer: "Porque no usa la API oficial. Wapzen conecta tu número como un dispositivo vinculado, igual que WhatsApp Web, con un código QR o un código de vinculación. Meta cobra por mensaje solo en su API, así que aquí no hay tarifa por respuesta.",
    body: <>
      <p>La API oficial de WhatsApp Business es la puerta que Meta vende a las empresas: exige aprobación, plantillas revisadas y un cobro por mensaje. Wapzen entra por la otra puerta, la misma que usas cuando abres WhatsApp en el computador.</p>
      <p>Eso trae ventajas concretas:</p>
      <ul>
        <li>Usas <strong>el número que ya tienes</strong>, personal o de WhatsApp Business, sin migrarlo ni perder tus chats.</li>
        <li>Sigues usando WhatsApp en tu celular como siempre. El agente responde a tu lado.</li>
        <li>No hay solicitud a Meta, ni verificación de empresa, ni plantillas por aprobar.</li>
      </ul>
      <p>También tiene un costo que debes conocer: no es la plataforma oficial de Meta, y no trae la insignia verde ni las plantillas aprobadas. Wapzen es un producto independiente, no es de Meta ni de WhatsApp.</p>
    </>,
  },
  {
    id: "funciones",
    q: "¿Qué puede hacer el chatbot de Wapzen?",
    answer: "Responde cada mensaje con tu información, recuerda la conversación, toma pedidos, consulta tus sistemas, envía mensajes masivos y guarda todos los chats en tu panel. Además, el agente de voz contesta las llamadas de WhatsApp.",
    body: <>
      <ul>
        <li><strong>Responde con tu información.</strong> Sube tus preguntas frecuentes, lista de precios o políticas en texto, PDF o Word. En cada mensaje, el agente busca los fragmentos que corresponden.</li>
        <li><strong>No adivina.</strong> Está instruido para decir que no tiene el dato cuando un precio, un plazo o una política no está en tus instrucciones ni en tu información. Igual conviene probarlo con tus preguntas reales.</li>
        <li><strong>Recuerda la conversación.</strong> Guarda los últimos 20 intercambios palabra por palabra y un resumen de lo anterior, para que el cliente no tenga que repetir nada.</li>
        <li><strong>Habla el idioma del cliente.</strong> Contesta en español de Chile, y también en inglés o portugués si el turista o el cliente escribe así.</li>
        <li><strong>Toma pedidos.</strong> Con la herramienta Take Order (tomar pedido), anota productos, nombre y dirección, repite el pedido y lo guarda cuando el cliente confirma.</li>
        <li><strong>Consulta tus sistemas.</strong> Con herramientas de API, revisa el estado de un pedido o una hora libre en tu propio software.</li>
        <li><strong>Envía mensajes masivos.</strong> Sube una planilla con tus contactos y envía un mensaje personalizado a cada uno, con una pausa entre envíos.</li>
        <li><strong>Guarda cada chat</strong> en tu panel, donde puedes leer las conversaciones y responder tú mismo.</li>
      </ul>
      <InlineCta title="Tu chatbot de WhatsApp con IA, gratis y sin tope" body="Sin cupo de respuestas, sin API de Meta y sin tarjeta. Conecta tu número y el agente empieza a responder." label="Empieza gratis" />
    </>,
  },
  {
    id: "voz",
    q: "¿También contesta llamadas? El agente de voz con IA",
    answer: "Sí. El agente de voz de Wapzen contesta las llamadas de WhatsApp con una voz natural, responde con tu información y puede llamar de vuelta a tus clientes potenciales. Funciona solo con llamadas de WhatsApp, no con teléfonos fijos ni líneas móviles normales.",
    body: <>
      <p>En Chile mucha gente prefiere llamar por WhatsApp antes que escribir, sobre todo para preguntas rápidas: “¿están abiertos?”, “¿tienen mi talla?”, “¿cuánto sale el despacho a Viña?”. Si nadie contesta, ese cliente llama a la competencia.</p>
      <p>El agente de voz se encarga de esas llamadas:</p>
      <ul>
        <li><strong>Contesta las llamadas entrantes</strong> de WhatsApp en tu número, en español, con la misma información que usa el chat.</li>
        <li><strong>Llama a tus clientes potenciales.</strong> En una campaña, agregas a una persona y el agente la llama de inmediato.</li>
        <li><strong>Sin cobro por minuto.</strong> En la API oficial, las llamadas que recibes son gratis, pero Meta cobra por minuto las que hace tu empresa (US$0,0121 en Chile), y la plataforma de voz con IA se paga aparte. Con Wapzen, ninguna llamada tiene cobro por minuto.</li>
      </ul>
      <p>Hay dos cosas que conviene saber: el agente se toma uno o dos segundos antes de responder cada frase, y no transfiere la llamada a una persona en vivo. Para conversaciones largas o delicadas, deja un número donde atienda tu equipo.</p>
      <p>Más detalles en <Link href="/es/llamadas-con-ia">llamadas con IA por WhatsApp</Link>.</p>
    </>,
  },
  {
    id: "activar",
    q: "¿Cómo activo un chatbot de WhatsApp gratis con Wapzen?",
    answer: "En unos diez minutos: creas tu cuenta gratis, escribes las instrucciones del agente, subes tu información y conectas tu número con un código QR desde el computador o con un código de vinculación desde el celular.",
    body: <>
      <ol>
        <li><strong>Crea tu cuenta gratis.</strong> Al registrarte ya tienes un agente listo para configurar. El panel está en inglés; el agente responde en español si se lo pides.</li>
        <li><strong>Escribe las instrucciones.</strong> Di a quién representa, qué vendes, tus horarios, cómo deben ser las respuestas y qué hacer cuando alguien pide hablar con una persona.</li>
        <li><strong>Sube tu información.</strong> Preguntas frecuentes, precios, tallas, despacho y políticas de cambio. Luego asígnala al agente.</li>
        <li><strong>Conecta tu número.</strong> En el computador, escanea el código QR desde WhatsApp → Dispositivos vinculados → Vincular un dispositivo. En el celular, ingresa tu número y escribe en WhatsApp el código de vinculación de 8 caracteres.</li>
        <li><strong>Pruébalo.</strong> Escríbele desde otro número con preguntas reales de tus clientes y ajusta las instrucciones hasta que responda como quieres.</li>
      </ol>
      <p>Estas instrucciones de ejemplo son para una tienda inventada. Cámbialas por las de tu negocio:</p>
      <pre>{prompt}</pre>
    </>,
  },
  {
    id: "riesgo",
    q: "¿Me pueden bloquear el número por usar un chatbot?",
    answer: "Responder a quienes te escriben es un uso normal de WhatsApp. El riesgo aparece cuando envías mensajes a personas que no te los pidieron, algo que WhatsApp restringe. Escribe solo a clientes que esperan tu mensaje y dales una forma de no recibir más.",
    body: <>
      <p>Como Wapzen se conecta como dispositivo vinculado y no por la API oficial, WhatsApp puede aplicar restricciones a un número que se comporta de forma rara. Para cuidar el tuyo:</p>
      <ul>
        <li>Deja que el agente <strong>responda</strong>, que es lo que mejor hace.</li>
        <li>En los envíos masivos, escribe solo a tus clientes, deja la pausa entre mensajes y no compres listas de contactos.</li>
        <li>Si tu negocio depende de un solo número, pruébalo primero con un número secundario.</li>
      </ul>
    </>,
  },
  {
    id: "cuando-no",
    q: "¿Cuándo no te conviene Wapzen?",
    answer: "Cuando necesitas la API oficial de Meta: la insignia verde, plantillas aprobadas o escribir primero a miles de clientes. Tampoco si tu equipo necesita silenciar al bot en una sola conversación, porque hoy se pausa el agente completo.",
    body: <>
      <p>Preferimos decirlo claro, para que elijas bien:</p>
      <Comparison caption="Para quién sirve un chatbot de WhatsApp gratis como Wapzen y para quién no" columns={["¿Te sirve?", "Por qué"]} rows={fit} />
      <p>Si estás en el segundo grupo, una plataforma sobre la API oficial es lo correcto, aunque cueste más.</p>
    </>,
  },
  {
    id: "ley",
    q: "¿Qué dice la ley chilena sobre los datos de un chatbot?",
    answer: "Hoy rige la Ley 19.628 de datos personales. La Ley 21.719, que la modifica a fondo, entra en vigencia el 1 de diciembre de 2026, salvo que antes se publique la postergación al 15 de octubre de 2027 que aprobó el Senado. Pide solo los datos que necesitas para atender y vender.",
    body: <>
      <p>Para un chatbot de ventas o atención, lo práctico es:</p>
      <ul>
        <li>Pide solo lo necesario: nombre, dirección y comuna para un despacho. No pidas RUT ni datos de salud si no los necesitas.</li>
        <li>Di desde el inicio que es una asistente virtual, y ofrece siempre el contacto de una persona.</li>
        <li>Revisa qué hace Wapzen con los mensajes: pasan por proveedores de IA y se guardan hasta que los borres. Los detalles están en la <Link href="/privacy">política de privacidad</Link>, en inglés.</li>
      </ul>
      <p>Esto es orientación general, no asesoría legal. Si manejas datos sensibles, valida tu caso con un abogado.</p>
    </>,
  },
];

export default function ChatbotWhatsAppGratisClPage() {
  return <QaPost
    href={href}
    heading={<>Chatbot de WhatsApp gratis en Chile.<br /><span>Con IA, sin tope de respuestas y con agente de voz.</span></>}
    lead="La mayoría de los chatbots “gratis” para WhatsApp son una prueba de 14 días, un menú sin IA o un cupo de respuestas que se acaba a mitad de mes. Aquí respondemos, una por una, las preguntas que hacen las pymes chilenas antes de elegir: qué es gratis de verdad, cuánto cuesta lo demás y qué hace Wapzen, incluido su agente de voz."
    verdict={{
      title: "La respuesta corta",
      body: <>Sí hay un chatbot de WhatsApp con IA gratis en Chile: <strong>Wapzen</strong>. No cobra cuota, no tiene tope de respuestas de IA y no paga tarifas de Meta, porque conecta tu número como dispositivo vinculado. Responde mensajes, toma pedidos y, con su agente de voz, contesta las llamadas de WhatsApp.</>,
    }}
    facts={[["Precio", "$0"], ["Respuestas de IA", "Ilimitadas"], ["Tarifas de Meta", "No aplican"], ["Llamadas", "Agente de voz incluido"]]}
    indexTitle="Las 10 preguntas de esta guía"
    answerLabel="Respuesta"
    questions={questions}
    sources={sources}
    related={["/es-cl/blog/chatbot-whatsapp-clinica-dental", "/es-mx/blog/agente-de-voz-ia-whatsapp-gratis"]}
    product="/es/chatbot-whatsapp-gratis"
    cta={{ heading: <>Tu WhatsApp, respondiendo solo.<br /><span>Gratis y sin tope de respuestas.</span></>, body: "Crea tu agente de IA, súbele la información de tu negocio y conecta tu número en minutos. Sin tarjeta y sin API de Meta." }}
  />;
}
