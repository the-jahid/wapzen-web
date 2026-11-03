import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Búsquedas (autocompletado Google, YouTube y DuckDuckGo con gl=pe, 2026-11-03, ver
// docs/seo-research.md): "chatbot para clínicas" (20), "ia para clinicas" (20),
// "chatbot whatsapp para clínicas" (16), "agente de voz ia" (30), "llamadas con ia"
// (30), "software dental" (30). A pedido del usuario (2026-11-03): todo se presenta
// como gratis por ahora y el agente de voz como funcionando. Lo que se dice de Wapzen
// sigue a whiskey-bailey-server: 1 agente de chat por cuenta, 100 respuestas de IA por
// agente por hora, solo chats individuales, audios y fotos con interruptores por agente
// (apagados por defecto). Ley 29733 y su reglamento DS 016-2024-JUS (vigente desde el
// 30 de marzo de 2025). Tarifas de Meta para Perú: lista del 1 oct 2026 vía Zernio.
const href = "/es-pe/blog/chatbot-whatsapp-para-clinicas";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es-PE", article: { publishedTime: post.published, modifiedTime: post.updated } });

const costs = [
  ["Cuota mensual", "Según la plataforma, casi siempre en dólares", "S/ 0"],
  ["Respuestas a pacientes", "1.000 gratis al mes por número, luego US$0,030 cada una", "Sin costo"],
  ["Recordatorios de cita (plantillas)", "US$0,030 cada uno", "Sin costo, con mensajes masivos"],
  ["Campañas y promociones", "US$0,0703 por mensaje", "Sin costo"],
  ["Llamadas de WhatsApp", "Entrantes gratis, salientes US$0,0121 por minuto, más la plataforma de voz", "Agente de voz gratis"],
];

const fit = [
  ["Clínica o consultorio con decenas de consultas diarias por WhatsApp", "Sí", "Responde en segundos con tu información, de día y de noche"],
  ["Centro médico cuyos pacientes llaman por WhatsApp", "Sí", "El agente de voz contesta y responde dudas"],
  ["Clínica que necesita historia clínica, caja y facturación", "No", "Eso es trabajo de tu software clínico"],
  ["Clínica que quiere orientación médica o triaje por chat", "No", "El agente es solo recepción: no diagnostica"],
  ["Red que necesita la insignia verde o plantillas aprobadas", "No", "Eso exige la API oficial de Meta"],
];

const prompt = `Eres la asistente virtual del Policlínico San Gabriel, en Santiago de Surco, Lima.
Responde en español, con mensajes cortos y amables: dos o tres frases.
Di desde el primer mensaje que eres una asistente virtual, no una médica.
Responde sobre especialidades, precios de consulta, horarios, seguros y EPS aceptados, y ubicación, solo con la base de conocimiento. No inventes precios ni horarios.
No des diagnósticos, ni tratamientos, ni medicamentos. Si alguien describe una emergencia (dolor fuerte en el pecho, dificultad para respirar, sangrado abundante), pídele llamar al SAMU 106 o ir a la emergencia más cercana.
Para pedir una cita: pregunta nombre, especialidad, y día y turno preferidos. Repite el pedido, pide que lo confirme y avisa que admisión confirmará la hora por este chat.
No pidas DNI, historia clínica, resultados ni fotos de exámenes por WhatsApp.
Horario de admisión: lunes a sábado de 8:00 a 20:00.`;

const turns = [
  { from: "patient" as const, text: "Hola, buenas noches. ¿Cuánto cuesta la consulta con pediatra? ¿Aceptan Pacífico EPS?" },
  { from: "agent" as const, text: "¡Hola! Soy la asistente virtual del Policlínico San Gabriel. La consulta de pediatría particular cuesta S/ 120 y sí trabajamos con Pacífico EPS; el copago depende de tu plan. ¿Quieres pedir una cita?" },
  { from: "patient" as const, text: "Sí, para mi hijo, mañana en la tarde si se puede" },
  { from: "agent" as const, text: "Perfecto. ¿Me das el nombre del paciente? Te anoto: pediatría, mañana miércoles por la tarde. ¿Es correcto?" },
  { from: "patient" as const, text: "Sí, se llama Mateo Quispe" },
  { from: "agent" as const, text: "Gracias. Ya tenemos tu pedido para Mateo. Admisión te confirmará la hora exacta por este chat mañana desde las 8:00." },
];

const sources = [
  { label: "Meta: precios de la plataforma de WhatsApp Business", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Zernio: tarifas de WhatsApp por país, lista del 1 de octubre de 2026", href: "https://zernio.com/whatsapp-api-pricing" },
  { label: "Gob.pe: Ejecutivo aprueba nuevo reglamento de la Ley de Protección de Datos Personales", href: "https://www.gob.pe/institucion/minjus/noticias/1067368-ejecutivo-aprueba-nuevo-reglamento-de-la-ley-de-proteccion-de-datos-personales" },
  { label: "Gob.pe: Decreto Supremo N.° 016-2024-JUS", href: "https://www.gob.pe/institucion/anpd/normas-legales/6554453-16-2024-jus" },
  { label: "WhatsApp Business: política de mensajes", href: "https://whatsappbusiness.com/policy/" },
  { label: "DataReportal: Digital 2026 Perú", href: "https://datareportal.com/reports/digital-2026-peru" },
];

const questions = [
  {
    id: "gratis",
    q: "¿Existe un chatbot de WhatsApp con IA gratis para clínicas en Perú?",
    answer: "Sí. Wapzen ofrece un chatbot de WhatsApp con IA que por ahora es completamente gratis: responde a los pacientes las 24 horas, toma pedidos de cita, envía mensajes masivos y tiene un agente de voz que contesta las llamadas de WhatsApp. Sin cuota, sin tarjeta y sin tarifas de Meta por mensaje.",
    body: <>
      <p>En Perú hay 28,4 millones de usuarios de internet (DataReportal, octubre de 2025), y para pedir una cita casi todos escriben primero por WhatsApp: “¿cuánto cuesta la consulta?”, “¿atienden con mi EPS?”, “¿hay cita para hoy?”. Muchos de esos mensajes llegan de noche o cuando admisión está atendiendo en ventanilla.</p>
      <p>Casi todo lo que aparece al buscar “chatbot para clínicas” es gratis solo por unos días, un menú de botones sin IA, o cobra la IA por paquetes de respuestas. Y si usa la API oficial, se suman las tarifas de Meta, que en Perú están entre las más altas de la región.</p>
      <p>En Wapzen, <strong>todo es gratis por ahora</strong>: el chatbot, el agente de voz, la base de conocimiento, las herramientas de API y los mensajes masivos. Los modelos de IA vienen incluidos: no necesitas una clave de OpenAI ni un programador.</p>
    </>,
  },
  {
    id: "que-hace",
    q: "¿Qué hace un chatbot de WhatsApp en una clínica?",
    answer: "Hace de recepción en WhatsApp: responde sobre especialidades, precios de consulta, horarios, seguros y EPS, y ubicación; toma el pedido de cita (nombre, especialidad, día y turno) y lo repite para que el paciente lo confirme; y deriva las emergencias al SAMU 106. No diagnostica ni da indicaciones médicas.",
    body: <>
      <p>Así conversa el agente, en el ejemplo de un policlínico inventado:</p>
      <ChatExample
        business="Policlínico San Gabriel"
        labels={{ subtitle: "WhatsApp · agente de IA", agent: "Agente: ", patient: "Paciente: " }}
        turns={turns}
        caption="Conversación ilustrativa de una clínica ficticia. Precios y seguros salen de la base de conocimiento que sube la clínica."
        points={[
          { title: "Precios y EPS de tus archivos", body: "Admisión sube el tarifario y la lista de seguros y EPS. El agente busca ahí en cada mensaje y, si no encuentra el dato, lo dice en lugar de inventarlo." },
          { title: "Sabe qué día es", body: "El agente conoce la fecha, así que entiende “mañana en la tarde” o “el sábado” sin preguntar." },
          { title: "Admisión confirma", body: "Cada conversación queda guardada en el panel. Admisión revisa los pedidos y confirma la hora desde ahí." },
          { title: "Nada de datos médicos", body: "Las instrucciones le prohíben pedir DNI, historia clínica o resultados por WhatsApp." },
        ]}
      />
    </>,
  },
  {
    id: "citas",
    q: "¿Cómo agenda citas por WhatsApp?",
    answer: "De dos formas: toma el pedido de cita y lo repite hasta que el paciente lo confirma, y luego admisión confirma la hora desde el panel; o consulta los horarios libres directamente en tu sistema de citas, si este tiene una API. También puedes probar la herramienta Take Order para guardar los pedidos en una lista.",
    body: <>
      <ol>
        <li><strong>Pedido que confirma admisión.</strong> Lo más simple y seguro: el agente reúne nombre, especialidad, día y turno, repite el pedido y avisa que admisión confirmará.</li>
        <li><strong>Agenda conectada.</strong> Si tu sistema de citas tiene API, el agente revisa los cupos libres y se los ofrece al paciente.</li>
        <li><strong>Lista de pedidos.</strong> Take Order (tomar pedido) se pensó para pedidos de productos, pero guarda cualquier pedido que el paciente confirme, con su número. Pruébala con citas antes de depender de ella.</li>
      </ol>
      <h3>¿Y los recordatorios?</h3>
      <p>Wapzen no envía recordatorios automáticos a una hora fija. Lo que sí puedes hacer: cada tarde subes la lista de citas del día siguiente a <strong>Mensajes masivos</strong> y se envía un recordatorio con el nombre y la hora de cada paciente, con una pausa entre envíos. Si alguien responde para reprogramar, el agente lo atiende.</p>
      <Note>En el recordatorio pon solo nombre, fecha, hora y dirección. Nunca la especialidad sensible, el diagnóstico ni el tipo de examen.</Note>
    </>,
  },
  {
    id: "software",
    q: "¿Reemplaza al software de la clínica?",
    answer: "No. El software clínico maneja la historia clínica, la caja, la facturación electrónica y las EPS; el chatbot de WhatsApp es la recepción que contesta mensajes y llamadas. Funcionan juntos: si tu software tiene API, el agente puede consultarle los horarios disponibles.",
    body: <>
      <p>Muchos que buscan “software para clínicas” o “software dental” en realidad quieren resolver un problema: los mensajes que nadie contesta. La diferencia es esta:</p>
      <ul>
        <li><strong>Software clínico:</strong> historia clínica, agenda de médicos, caja, facturación y convenios con aseguradoras.</li>
        <li><strong>Chatbot de WhatsApp:</strong> responde al paciente antes de que llegue, toma el pedido de cita y quita presión a admisión.</li>
      </ul>
      <p>Para conectarlos, agregas en Wapzen una herramienta de “solicitud a API”. Nunca pases historias clínicas al chatbot: no las necesita y no debería verlas.</p>
    </>,
  },
  {
    id: "costo",
    q: "¿Cuánto cuesta la API de WhatsApp Business para una clínica en Perú?",
    answer: "Con la API oficial, después de las primeras 1.000 respuestas gratis al mes, la clínica paga a Meta US$0,030 por cada respuesta o recordatorio, y US$0,0703 por mensaje promocional, más la plataforma. Wapzen no usa la API oficial, así que no hay tarifa por mensaje, y todo es gratis por ahora.",
    body: <>
      <Comparison caption="Costo de atender pacientes por WhatsApp en Perú: API oficial frente a Wapzen" columns={["API oficial de WhatsApp Business", "Wapzen"]} rows={costs} />
      <h3>Un ejemplo con números</h3>
      <p>Un policlínico que recibe 50 conversaciones al día, con 4 respuestas en promedio (<strong>6.000 respuestas al mes</strong>), y envía 30 recordatorios diarios (900 al mes):</p>
      <ul>
        <li><strong>Respuestas:</strong> descontando las 1.000 gratis, 5.000 × US$0,030 = <strong>US$150</strong>.</li>
        <li><strong>Recordatorios:</strong> 900 × US$0,030 = <strong>US$27</strong>.</li>
        <li><strong>Total:</strong> <strong>US$177 al mes solo para Meta</strong>, unos S/ 660 con el dólar a S/ 3,75, antes de pagar la plataforma y la IA.</li>
        <li><strong>Con Wapzen:</strong> S/ 0.</li>
      </ul>
      <Note>Tarifas de Meta en dólares de la lista del 1 de octubre de 2026; cambian cada trimestre. El tipo de cambio es referencial. Confirma las tarifas vigentes en Meta.</Note>
    </>,
  },
  {
    id: "voz",
    q: "¿También contesta llamadas? El agente de voz con IA",
    answer: "Sí. El agente de voz de Wapzen contesta las llamadas de WhatsApp al número de la clínica con una voz natural en español, responde con la misma información del chatbot y puede llamar a quienes pidieron información. Es gratis como lo demás y funciona solo con llamadas de WhatsApp, no con teléfono fijo.",
    body: <>
      <p>Muchos pacientes, sobre todo los mayores, prefieren llamar por WhatsApp antes que escribir. Si nadie contesta, llaman a otra clínica.</p>
      <ul>
        <li><strong>Contesta las llamadas entrantes</strong> sobre especialidades, precios, horarios y EPS, y toma el pedido de cita.</li>
        <li><strong>Llama a los interesados.</strong> En una campaña, agregas nombre y número, y el agente llama al instante.</li>
        <li><strong>Sin cobro por minuto.</strong> En la API oficial, las llamadas que hace la clínica cuestan US$0,0121 por minuto en Perú, más la plataforma de voz. En Wapzen no.</li>
      </ul>
      <p>Dos cosas que debes saber: el agente tarda uno o dos segundos antes de cada respuesta, y no transfiere la llamada a una persona en vivo. Para emergencias, siempre indica el SAMU 106.</p>
      <InlineCta title="Tu clínica contesta WhatsApp las 24 horas" body="Chatbot y agente de voz con IA, gratis por ahora. Sin tarifas de Meta y sin tarjeta." label="Empieza gratis" />
    </>,
  },
  {
    id: "audios",
    q: "¿Entiende audios y fotos?",
    answer: "Sí, si lo activas. En la configuración del agente hay dos interruptores, audios y fotos, que vienen apagados. Con el de audios, el agente transcribe la nota de voz y la responde; con el de fotos, lee la imagen y contesta según lo que ve.",
    body: <>
      <p>En Perú se mandan muchísimos audios, así que vale la pena activar ese interruptor. Con las fotos ten cuidado en una clínica: un paciente puede enviar una receta, un resultado o una foto de una lesión, que son datos de salud.</p>
      <ul>
        <li>Activa los <strong>audios</strong> si tus pacientes los usan.</li>
        <li>Deja las <strong>fotos</strong> apagadas, o actívalas con una instrucción clara: “No comentes recetas, resultados ni fotos médicas; pide al paciente que los traiga a su consulta”.</li>
      </ul>
    </>,
  },
  {
    id: "ley",
    q: "¿Qué dice la Ley 29733 sobre un chatbot de clínica?",
    answer: "La Ley 29733 de Protección de Datos Personales trata los datos de salud como datos sensibles, y su nuevo reglamento (Decreto Supremo 016-2024-JUS) rige desde el 30 de marzo de 2025. Lo práctico: usa el chatbot solo como recepción y no pidas síntomas, historia clínica ni resultados por WhatsApp.",
    body: <>
      <p>Esto es orientación general, no asesoría legal:</p>
      <ul>
        <li><strong>Pide lo mínimo.</strong> Nombre, especialidad y turno bastan para una cita. Ni DNI ni detalles médicos.</li>
        <li><strong>Sé transparente.</strong> El agente se presenta como asistente virtual y siempre ofrece un contacto humano.</li>
        <li><strong>Sabe adónde van los datos.</strong> La base de datos principal de Wapzen está en Singapur, sus servidores en Singapur y Alemania, y los proveedores de IA pueden procesar mensajes en Estados Unidos. Es una transferencia fuera del Perú. Los detalles están en la <Link href="/privacy">política de privacidad</Link>, en inglés.</li>
        <li><strong>Política de WhatsApp.</strong> La política de mensajes de WhatsApp Business no permite usarlo para telemedicina ni para pedir información de salud donde la ley exige sistemas especiales.</li>
      </ul>
      <p>Si tu clínica maneja datos sensibles a gran escala, revisa tu caso con un abogado y con la Autoridad Nacional de Protección de Datos Personales.</p>
    </>,
  },
  {
    id: "limites",
    q: "¿Qué límites tiene Wapzen?",
    answer: "Cada cuenta tiene un agente de chat, y cada agente envía hasta 100 respuestas de IA por hora. Contesta chats individuales, no grupos, y no se puede pausar en una sola conversación. Como no usa la API oficial, no trae insignia verde ni plantillas aprobadas.",
    body: <>
      <Comparison caption="Para qué clínicas sirve un chatbot de WhatsApp gratis como Wapzen" columns={["¿Te sirve?", "Por qué"]} rows={fit} />
      <ul>
        <li><strong>100 respuestas por hora por agente.</strong> Si se llega al límite, el agente espera a que pase la hora; los mensajes entrantes se guardan igual.</li>
        <li><strong>Se conecta como dispositivo vinculado</strong>, igual que WhatsApp Web, con código QR o código de vinculación, en el número que ya tienes. WhatsApp puede restringir números que se comportan de forma rara: no escribas a quien no te lo pidió.</li>
        <li><strong>Sin pausa por chat.</strong> Pausar el agente lo detiene en todos los chats. Lo que respondes desde el panel entra en el historial del agente; lo que respondes desde el celular, no.</li>
        <li><strong>El panel está en inglés</strong>; el agente responde en español.</li>
        <li>Wapzen es un producto independiente, no es de Meta ni de WhatsApp.</li>
      </ul>
    </>,
  },
  {
    id: "activar",
    q: "¿Cómo activo un chatbot de WhatsApp gratis para mi clínica?",
    answer: "En unos diez minutos: creas tu cuenta gratis, escribes las instrucciones del agente, subes tarifario, especialidades y EPS, y conectas el número de la clínica con un código QR desde la computadora o con un código de vinculación desde el celular. Luego lo pruebas desde otro número.",
    body: <>
      <ol>
        <li><strong>Crea tu cuenta gratis.</strong> Al registrarte ya tienes un agente listo para configurar.</li>
        <li><strong>Escribe las instrucciones.</strong> A quién representa, especialidades, horarios, qué hacer con emergencias y qué datos nunca pedir.</li>
        <li><strong>Sube la información de la clínica.</strong> Tarifario, médicos y horarios, seguros y EPS, ubicación y preguntas frecuentes, en texto, PDF o Word. Luego asígnala al agente.</li>
        <li><strong>Conecta el número.</strong> En la computadora: WhatsApp → Dispositivos vinculados → Vincular un dispositivo, y escaneas el QR. En el celular: ingresas el número y escribes en WhatsApp el código de vinculación de 8 caracteres.</li>
        <li><strong>Pruébalo.</strong> Escríbele desde otro número con preguntas reales de tus pacientes y ajusta las instrucciones hasta que responda como quieres.</li>
      </ol>
      <p>Estas instrucciones de ejemplo son de una clínica inventada. Cámbialas por las de la tuya:</p>
      <pre>{prompt}</pre>
    </>,
  },
];

export default function ChatbotClinicasPePage() {
  return <QaPost
    href={href}
    heading={<>Chatbot de WhatsApp para clínicas en Perú.<br /><span>Gratis, con IA y con agente de voz.</span></>}
    lead="Los pacientes en Perú escriben por WhatsApp antes de pedir una cita: precio, EPS, horario, ubicación. Aquí respondemos, una por una, las preguntas que hacen clínicas y consultorios antes de usar un chatbot con IA: qué hace, cómo agenda, cuánto cuesta la alternativa, qué dice la Ley 29733 y cómo activarlo gratis, con agente de voz incluido."
    verdict={{
      title: "La respuesta corta",
      body: <>Sí, una clínica en Perú puede tener un chatbot de WhatsApp con IA gratis con <strong>Wapzen</strong>: responde a los pacientes las 24 horas con tu tarifario y tus EPS, toma pedidos de cita y su agente de voz contesta las llamadas de WhatsApp. <strong>Todo es gratis por ahora</strong>, y no hay tarifas de Meta, porque conecta tu número como dispositivo vinculado.</>,
    }}
    facts={[["Precio", "Gratis por ahora"], ["Tarifas de Meta", "No aplican"], ["Llamadas", "Agente de voz gratis"], ["Conexión", "QR o código de vinculación"]]}
    indexTitle="Las 10 preguntas de esta guía"
    answerLabel="Respuesta"
    questions={questions}
    sources={sources}
    related={["/es-cl/blog/chatbot-whatsapp-clinica-dental", "/es-mx/blog/agente-de-voz-ia-whatsapp-gratis"]}
    product="/es/chatbot-whatsapp-gratis"
    cta={{ heading: <>Tu clínica responde WhatsApp sola.<br /><span>Gratis, de día y de noche.</span></>, body: "Crea tu agente de IA, súbele la información de tu clínica y conecta tu número en minutos. Sin tarjeta y sin API de Meta." }}
  />;
}
