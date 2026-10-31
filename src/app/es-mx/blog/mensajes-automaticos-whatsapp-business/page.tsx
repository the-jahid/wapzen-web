import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Samples, Steps } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Búsquedas objetivo: "mensaje de bienvenida whatsapp business" (30, 3/3),
// "mensaje de ausencia whatsapp business" (30, 3/3), "respuestas rápidas
// whatsapp business" (30, 3/3), "mensajes automáticos whatsapp business" (30,
// 3/3), "mensaje automático whatsapp business" (27), "respuestas rápidas …
// ejemplos" (18), autocompletado MX 2026-10-28. El título promete 40 ejemplos:
// welcome + away + quick + cada lista de `industries` deben sumar 40. Versión
// en inglés: /blog/whatsapp-business-greeting-message.
const href = "/es-mx/blog/mensajes-automaticos-whatsapp-business";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es-MX", article: { publishedTime: post.published, modifiedTime: post.updated } });

type Sample = { title: string; text: string };

const welcome: Sample[] = [
  { title: "Sencillo y amable", text: "¡Hola! 👋 Gracias por escribir a [Negocio]. ¿En qué te podemos ayudar hoy?" },
  { title: "Con tiempo de respuesta", text: "¡Hola, bienvenido/a! Normalmente contestamos en menos de [1 hora], de lunes a sábado de [9:00] a [19:00]. Cuéntanos qué necesitas." },
  { title: "Con opciones", text: "¡Hola! 👋 Para atenderte más rápido, dinos qué buscas:\n- Precios e información\n- Hacer un pedido\n- Estatus de mi pedido\n- Otra cosa" },
  { title: "Toque personal", text: "Hola, soy [Nombre] de [Negocio]. ¡Gracias por escribirme! Cuéntame en qué te ayudo y te contesto yo mismo/a en cuanto pueda." },
  { title: "Con enlace", text: "¡Gracias por contactarnos! Mientras te contestamos, aquí puedes ver nuestros productos y precios: [enlace]" },
  { title: "Formal, de usted", text: "Buen día. Gracias por comunicarse con [Negocio]. En breve uno de nuestros asesores le atenderá." },
  { title: "En dos idiomas", text: "¡Hola! 👋 Bienvenido/a a [Negocio]. Escríbenos en español o en inglés.\nHi! Feel free to write to us in English." },
  { title: "Con catálogo", text: "¡Hola! Toca el ícono de la tienda arriba en este chat para ver nuestro catálogo con precios. ¿Dudas sobre algún producto? Pregúntanos aquí." },
  { title: "Si usas un asistente con IA", text: "¡Hola! 👋 Soy el asistente virtual de [Negocio] y te contesto al momento sobre precios, horarios y disponibilidad. Si prefieres hablar con una persona, escribe *asesor*." },
  { title: "Buen Fin", text: "¡Hola! Gracias por escribir a [Negocio] 🛍️ Este Buen Fin tenemos [20%] de descuento en [productos]. ¿Qué te gustaría ver?" },
];

const away: Sample[] = [
  { title: "Cerrado, con horario", text: "¡Gracias por tu mensaje! Ahorita estamos cerrados: abrimos [mañana a las 9:00]. Déjanos tu pregunta y te contestamos en cuanto regresemos." },
  { title: "Hora de comida", text: "¡Hola! Estamos en hora de comida hasta las [16:00]. Te contestamos en cuanto regresemos." },
  { title: "Puente o fin de semana largo", text: "¡Hola! Por el puente estaremos cerrados del [sábado] al [lunes] 🎉 Te contestamos el [martes] a primera hora." },
  { title: "Con número para urgencias", text: "Gracias por escribirnos. Estamos fuera de horario: te contestamos mañana desde las [8:30]. Para urgencias llama al [número]." },
  { title: "Con agenda en línea", text: "Ahorita no podemos contestar, pero puedes agendar tu cita tú mismo/a aquí, 24/7: [enlace]. ¡Gracias!" },
  { title: "Día festivo", text: "¡Hola! Hoy cerramos por [día festivo]. Abrimos el [día] y contestaremos todos los mensajes en orden de llegada." },
  { title: "Profesionista ocupado", text: "Hola, en este momento estoy [en junta / con un cliente] y no puedo contestar. Te escribo o te llamo antes de las [18:00]." },
  { title: "Oficina, formal", text: "Gracias por su mensaje. Nuestra oficina está cerrada; atendemos de [lunes a viernes de 9:00 a 18:00]. Le contactaremos a la brevedad." },
];

const quick: Sample[] = [
  { title: "/horario", text: "Abrimos de lunes a sábado de [9:00] a [19:30]. Los domingos descansamos." },
  { title: "/ubicacion", text: "Estamos en [Av. Juárez 123, Col. Centro, Puebla]. Aquí la ubicación: [enlace de Google Maps]. Hay estacionamiento a [media cuadra]." },
  { title: "/pagos", text: "Aceptamos efectivo, tarjeta de débito y crédito y transferencia. Para pedidos en línea también [pago en OXXO] y [Mercado Pago]." },
  { title: "/envios", text: "Enviamos a toda la República en [3 a 5 días hábiles]. El envío es gratis en compras mayores a [$999]; si no, cuesta [$129]." },
  { title: "/transferencia", text: "Estos son los datos para la transferencia: [Banco], a nombre de [Negocio], CLABE [CLABE]. Cuando la hagas, mándanos el comprobante por aquí." },
  { title: "/resena", text: "¡Gracias a ti! Si te gustó, nos ayudas muchísimo dejándonos una reseña aquí: [enlace] 🙏" },
];

const industries: Array<{ name: string; samples: Sample[] }> = [
  {
    name: "Restaurantes y taquerías",
    samples: [
      { title: "Bienvenida y pedidos", text: "¡Hola! Bienvenido/a a [Restaurante] 🌮 Para pedir a domicilio dinos qué se te antoja y tu dirección. El menú está aquí: [enlace]" },
      { title: "Para llevar", text: "¡Hola! Para llevar, escríbenos tu pedido y la hora en que pasas. Entregamos a domicilio en [colonias] de [13:00] a [22:00]." },
      { title: "Ausencia con horario", text: "¡Gracias por tu mensaje! Ahorita estamos cerrados: abrimos de [martes a domingo de 13:00 a 23:00]. Te contestamos en cuanto abramos." },
      { title: "/reservacion", text: "Con gusto te reservamos. Dinos el día, la hora y para cuántas personas, y te confirmamos por aquí." },
    ],
  },
  {
    name: "Estéticas y barberías",
    samples: [
      { title: "Bienvenida y citas", text: "¡Hola! 💇 Gracias por escribir a [Estética]. Dinos qué servicio quieres y qué día te acomoda, y te pasamos los horarios libres." },
      { title: "Ausencia en servicio", text: "¡Hola! Ahorita estoy atendiendo a un cliente y no puedo contestar. Te escribo en cuanto termine, normalmente en menos de una hora." },
      { title: "/recordatorio", text: "¡Hola, [Nombre]! Te recordamos tu cita de [mañana a las 11:00] para [servicio]. Si no puedes venir, avísanos por aquí. ¡Te esperamos!" },
      { title: "/precios", text: "Estos son nuestros precios principales: corte desde [$150], corte y barba desde [$250], tinte desde [$450]. Lista completa: [enlace]" },
    ],
  },
  {
    name: "Tiendas en línea",
    samples: [
      { title: "Bienvenida de la tienda", text: "¡Hola! Bienvenido/a a [Tienda] 🛍️ Pregúntanos por tallas, existencias y envíos. Si es sobre un pedido, mándanos tu *número de pedido*." },
      { title: "/pedido", text: "¡Gracias! Tu pedido [número] ya salió con [paquetería]. Puedes rastrearlo aquí: [enlace de rastreo]" },
      { title: "/cambios", text: "Puedes hacer cambios o devoluciones dentro de [30 días] después de recibir tu pedido. Mándanos tu número de pedido y qué quieres cambiar, y te pasamos los pasos." },
      { title: "Ausencia de atención a clientes", text: "¡Gracias por escribirnos! Atención a clientes contesta de lunes a viernes de [9:00 a 18:00]. Mientras, aquí están las preguntas frecuentes: [enlace]" },
    ],
  },
  {
    name: "Consultorios y despachos",
    samples: [
      { title: "Bienvenida del consultorio", text: "Buen día, gracias por comunicarse al consultorio [Nombre]. Para agendar una consulta indíquenos su nombre completo y los días que le acomodan. Para urgencias, llame al [número]." },
      { title: "Ausencia del consultorio", text: "El consultorio está cerrado. Atendemos de [lunes a viernes de 9:00 a 14:00 y de 16:00 a 20:00]: le contestaremos al abrir. En caso de emergencia, llame al 911." },
      { title: "/primera-consulta", text: "Para su primera consulta traiga una identificación oficial, sus estudios previos si los tiene y llegue [10 minutos] antes." },
      { title: "Despacho contable o legal", text: "Buen día, gracias por su mensaje. Atiendo con cita previa: indíqueme brevemente el tema y dos o tres horarios que le acomoden, y le confirmo." },
    ],
  },
];

const tools = [
  ["Cuándo se envía", "Con el primer mensaje de un cliente, o el primero después de 14 días sin mensajes", "Cuando llega un mensaje en el horario que elegiste", "Cuando tú la mandas, escribiendo “/”"],
  ["Quién lo recibe", "Todos, quienes no están en tus contactos, todos excepto algunos o solo algunos", "Todos, quienes no están en tus contactos, todos excepto algunos o solo algunos", "El cliente del chat abierto"],
  ["Sirve para", "Dar la bienvenida y decir qué sigue", "Avisar cuándo contestas", "No escribir lo mismo diez veces"],
  ["Límite", "Un texto fijo", "Un texto fijo", "Hasta 50 respuestas guardadas"],
];

const setupSteps = [
  { title: "Abre Herramientas para la empresa", body: "En WhatsApp Business entra en Más opciones (⋮) en Android o en Configuración en iPhone, y toca Herramientas para la empresa." },
  { title: "Elige el mensaje", body: "Mensaje de bienvenida, Mensaje de ausencia o Respuestas rápidas." },
  { title: "Actívalo y escribe el texto", body: "Activa el interruptor y pega uno de los ejemplos de abajo, cambiando lo que está entre corchetes." },
  { title: "Configura horario y destinatarios", body: "Para la ausencia elige Enviar siempre, un horario personalizado o fuera del horario comercial. Después elige quién lo recibe y toca Guardar." },
];

const faqs = [
  { q: "¿Cómo pongo mensajes automáticos en WhatsApp Business?", a: "Entra en Más opciones en Android o en Configuración en iPhone y abre Herramientas para la empresa. Elige Mensaje de bienvenida o Mensaje de ausencia, actívalo, escribe el texto, configura horario y destinatarios y toca Guardar." },
  { q: "¿Cuándo se envía el mensaje de bienvenida de WhatsApp Business?", a: "Cuando un cliente te escribe por primera vez, o por primera vez después de 14 días sin mensajes. Quien te escribió en los últimos 14 días no lo vuelve a recibir." },
  { q: "¿Cuál es la diferencia entre mensaje de bienvenida y mensaje de ausencia?", a: "El de bienvenida saluda a quien te escribe por primera vez o después de 14 días. El de ausencia contesta a quien te escribe en el horario en que no atiendes. Puedes usar los dos al mismo tiempo." },
  { q: "¿Cómo funcionan las respuestas rápidas?", a: "Son mensajes guardados con un atajo, por ejemplo /horario. En el chat escribes “/” y eliges la respuesta. Puedes guardar hasta 50 en Herramientas para la empresa > Respuestas rápidas." },
  { q: "¿Por qué no se envía mi mensaje automático de WhatsApp Business?", a: "Casi siempre el cliente ya te escribió en los últimos 14 días o quedó fuera de los destinatarios que elegiste. Los mensajes solo salen si tu celular tiene internet, y la opción fuera del horario comercial necesita el horario en tu perfil. Actualizar la app y volver a activar el mensaje suele resolverlo." },
  { q: "¿Se puede poner mensaje automático en WhatsApp normal?", a: "No, WhatsApp normal no tiene mensajes automáticos. Puedes pasar tu número a WhatsApp Business, que es gratis y conserva tus chats, o conectarlo a una IA como Wapzen, que funciona también con WhatsApp normal." },
];

const sources = [
  { label: "Centro de ayuda de WhatsApp: mensajes de bienvenida", href: "https://faq.whatsapp.com/501866148528310" },
  { label: "WhatsApp: app WhatsApp Business", href: "https://business.whatsapp.com/products/business-app" },
];

const sections = [
  {
    id: "tres-herramientas",
    title: "Los tres mensajes automáticos de WhatsApp Business",
    body: <>
      <p>La app de WhatsApp Business trae tres herramientas gratis para no escribir siempre lo mismo. Están en <strong>Herramientas para la empresa</strong>:</p>
      <Comparison caption="Mensaje de bienvenida, mensaje de ausencia y respuestas rápidas comparados" columns={["Mensaje de bienvenida", "Mensaje de ausencia", "Respuestas rápidas"]} rows={tools} />
      <p>El de bienvenida y el de ausencia salen solos; las respuestas rápidas las mandas tú con un atajo. Los tres son <strong>textos fijos</strong>: dicen lo mismo sin importar la pregunta.</p>
    </>,
  },
  {
    id: "configurarlos",
    title: "Cómo configurar los mensajes automáticos",
    body: <>
      <Steps items={setupSteps} />
      <p>Para las <strong>respuestas rápidas</strong>, entra en Herramientas para la empresa &gt; Respuestas rápidas, toca + y escribe el mensaje y su atajo (por ejemplo <em>horario</em>). En el chat solo escribe “/” para ver la lista.</p>
      <Note>Para probar el mensaje de bienvenida usa un celular que no te haya escrito en los últimos 14 días; si no, no llega. Más ejemplos en la guía de <Link href="/es/respuesta-automatica-whatsapp">respuesta automática en WhatsApp</Link>.</Note>
    </>,
  },
  {
    id: "bienvenida",
    title: "10 ejemplos de mensaje de bienvenida",
    body: <>
      <p>Un buen mensaje de bienvenida agradece, dice cuándo vas a contestar y pide de una vez el dato que necesitas. Cambia lo que está entre corchetes; los asteriscos ponen el texto en negritas en WhatsApp.</p>
      <Samples locale="es-MX" items={welcome} />
    </>,
  },
  {
    id: "ausencia",
    title: "8 ejemplos de mensaje de ausencia",
    body: <>
      <p>El mensaje de ausencia tiene que decir dos cosas: que recibiste el mensaje y cuándo vas a contestar. Si puedes, da una alternativa, como un enlace para agendar o un número para urgencias.</p>
      <Samples locale="es-MX" items={away} />
    </>,
  },
  {
    id: "respuestas-rapidas",
    title: "6 respuestas rápidas para guardar hoy",
    body: <>
      <p>Las respuestas rápidas son para lo que te preguntan todos los días. El título de cada ejemplo es el atajo.</p>
      <Samples locale="es-MX" items={quick} />
    </>,
  },
  {
    id: "por-giro",
    title: "16 ejemplos por giro",
    body: <>
      {industries.map((industry) => <div key={industry.name}>
        <h3>{industry.name}</h3>
        <Samples locale="es-MX" items={industry.samples} />
      </div>)}
    </>,
  },
  {
    id: "no-se-envia",
    title: "Por qué no se envía el mensaje automático",
    body: <>
      <ul>
        <li><strong>La regla de los 14 días.</strong> Quien te escribió en las últimas dos semanas no recibe la bienvenida. Pasa casi siempre al probar desde tu otro celular.</li>
        <li><strong>Los destinatarios.</strong> Si elegiste “quienes no están en tus contactos” o “solo algunos”, los demás no lo reciben.</li>
        <li><strong>El horario vacío.</strong> La opción fuera del horario comercial usa el horario de tu perfil: si no lo llenaste, no se envía.</li>
        <li><strong>El celular sin internet.</strong> Los mensajes automáticos salen desde tu celular: si está apagado o sin datos, no se mandan.</li>
        <li><strong>La app sin actualizar.</strong> Actualiza WhatsApp Business y desactiva y activa otra vez el mensaje.</li>
      </ul>
    </>,
  },
  {
    id: "mas-alla",
    title: "Más allá de los textos fijos: respuestas con IA",
    body: <>
      <p>Los mensajes automáticos le dicen al cliente que vas a contestar, pero no contestan su pregunta. Si cada día te preguntan lo mismo sobre precios, horarios y existencias, un agente con IA puede responder de verdad, con la información de tu negocio, a cada mensaje y a cualquier hora.</p>
      <InlineCta title="Respuestas de verdad, no textos fijos" body="Wapzen conecta una IA a tu WhatsApp con un código QR: contesta a cada cliente con tu información, también en WhatsApp normal. Gratis por ahora." label="Empieza gratis" />
      <p>Puedes conservar tu mensaje de bienvenida, por ejemplo el de “Si usas un asistente con IA”, que avisa al cliente que puede pedir a una persona. Lee cómo funciona un <Link href="/es-mx/blog/chatbot-para-whatsapp-business">chatbot para WhatsApp Business</Link>.</p>
    </>,
  },
];

export default function MensajesAutomaticosMxPage() {
  return <BlogPost
    href={href}
    heading={<>Mensajes automáticos de WhatsApp Business.<br /><span>40 ejemplos para copiar.</span></>}
    lead="Mensajes de bienvenida, de ausencia y respuestas rápidas listos para copiar, por tipo y por giro, más cómo configurarlos en WhatsApp Business y qué revisar cuando no se envían."
    summary={{
      title: "En resumen",
      items: [
        <><strong>WhatsApp Business tiene tres mensajes automáticos gratis:</strong> bienvenida, ausencia y respuestas rápidas, en Herramientas para la empresa.</>,
        <><strong>La bienvenida se envía</strong> con el primer mensaje de un cliente, o el primero después de 14 días sin mensajes.</>,
        <><strong>La ausencia se envía</strong> en el horario que elijas: siempre, personalizado o fuera del horario comercial.</>,
        <><strong>Aquí tienes 40 ejemplos:</strong> 10 de bienvenida, 8 de ausencia, 6 respuestas rápidas y 16 para restaurantes, estéticas, tiendas en línea y consultorios.</>,
        <><strong>Son textos fijos:</strong> para contestar de verdad las preguntas necesitas una IA.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/es-mx/blog/como-vender-por-whatsapp", "/es-mx/blog/agendar-citas-por-whatsapp"]}
    product="/es/respuesta-automatica-whatsapp"
    cta={{ heading: <>Contesta de verdad a tus clientes.<br /><span>Con IA, gratis.</span></>, body: "Conecta tu WhatsApp con un código QR y deja que la IA conteste cada mensaje con la información de tu negocio." }}
  />;
}
