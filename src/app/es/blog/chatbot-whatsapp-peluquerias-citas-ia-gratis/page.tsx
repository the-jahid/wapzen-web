import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Búsquedas objetivo: "chatbot whatsapp para peluquerías", "citas peluquería
// whatsapp", "agenda de citas peluquería", "ia para peluquerías", "recepcionista
// virtual peluquería", "automatizar citas peluquería". Sin versión en inglés.
// Los diálogos, precios y cálculos son ilustrativos. Lo que se dice de Wapzen
// sigue al whiskey-bailey-server: "gratis para empezar" con límite de uso, un
// solo modelo (sin elegir GPT o Claude), sin voz, sin pausa por conversación,
// memoria de pocos minutos y herramientas que no se ejecutan en todos los mensajes.
const href = "/es/blog/chatbot-whatsapp-peluquerias-citas-ia-gratis";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "es", article: { publishedTime: post.published, modifiedTime: post.updated } });

const services = [
  ["Corte de caballero", "Precio, duración y profesional"],
  ["Corte de mujer", "Tarifa y condiciones del servicio"],
  ["Corte infantil", "Tarifa, condiciones y horarios"],
  ["Tinte de raíces", "Tipo de servicio y duración prevista"],
  ["Coloración completa", "Necesidad de consulta o valoración"],
  ["Mechas balayage", "Presupuesto y evaluación previa"],
  ["Alisado y tratamientos", "Características, requisitos y tiempo"],
  ["Peinados de evento", "Fecha, tipo de peinado y prueba previa"],
];

const compare = [
  ["Responder preguntas escritas libremente", "No necesariamente", "Sí, según configuración"],
  ["Explicar servicios y precios", "Puede mostrar un catálogo", "Sí"],
  ["Comprender solicitudes incompletas", "Depende de la herramienta", "Sí"],
  ["Gestionar disponibilidad real", "Sí, si está configurado", "Requiere integración"],
  ["Reservar con varios profesionales", "Según capacidades", "Requiere integración"],
  ["Controlar caja y facturación", "Según el software", "No es su función principal"],
  ["Registrar y revisar conversaciones", "No siempre", "Según plataforma"],
];

const faqs = [
  { q: "¿Hay chatbots de WhatsApp gratis para peluquerías?", a: "Sí. Wapzen es gratis para empezar, con chatbot con inteligencia artificial, base de conocimiento y conexión por código QR o código de vinculación a un número de WhatsApp existente. El inicio gratuito tiene un límite de uso y los volúmenes mayores necesitan un plan de pago." },
  { q: "¿Cómo automatizar las citas de mi peluquería por WhatsApp?", a: "Puedes utilizar un chatbot para recoger las solicitudes y conectarlo por API a un software de reservas para consultar disponibilidad y confirmar citas. La integración debe configurarse y probarse antes de utilizarla con clientes." },
  { q: "¿Una IA puede responder sobre el precio de unas mechas?", a: "Sí, si dispone de información verificada. Cuando un precio dependa de una valoración profesional, debe explicarlo sin inventar un presupuesto definitivo." },
  { q: "¿Puede un chatbot gestionar citas de varios peluqueros?", a: "Puede recoger las preferencias del cliente. Para confirmar horarios con distintos profesionales, necesitará acceder a una agenda que gestione esas disponibilidades." },
  { q: "¿Sirve también para barberías?", a: "Sí. Puedes configurarlo con cortes de caballero, arreglo de barba, degradados y los servicios específicos de tu barbería." },
  { q: "¿Se puede utilizar el mismo número de WhatsApp Business?", a: "Sí. Wapzen permite conectar un número existente mediante un código QR o un código de vinculación. Conviene revisar las limitaciones y condiciones de este tipo de conexión antes de utilizarlo." },
  { q: "¿Puede contestar en inglés a los turistas?", a: "Sí, si se lo pides en las instrucciones del agente. La calidad debe comprobarse con ejemplos reales, especialmente si tu peluquería atiende a clientes internacionales." },
  { q: "¿El chatbot confirma automáticamente las citas?", a: "Solo si existe un sistema de reservas correctamente conectado que compruebe y confirme la operación. Sin integración, el chatbot puede recoger la solicitud para que la recepción la gestione." },
];

const sources = [
  { label: "WhatsApp Business: funciones de la aplicación", href: "https://whatsappbusiness.com/es-la/products/business-app-features/" },
  { label: "SalonBot: software para peluquerías", href: "https://www.salonbot.es/blog/mejor-programa-peluquerias-2026" },
  { label: "Daltira: agenda para peluquerías", href: "https://daltira.com/" },
  { label: "AEPD: protección de datos para pymes", href: "https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/directrices-de-aplicacion/pymes" },
  { label: "BOE: Ley 34/2002 (LSSI)", href: "https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758" },
  { label: "EUR-Lex: Reglamento (UE) 2024/1689 de inteligencia artificial", href: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=es" },
];

const sections = [
  {
    id: "que-es",
    title: "¿Qué es un chatbot de WhatsApp para peluquerías?",
    body: <>
      <p>Un <strong>chatbot de WhatsApp para peluquerías</strong> permite automatizar parte de las conversaciones del salón mediante inteligencia artificial: interpreta los mensajes de los clientes y responde automáticamente basándose en la información de tu negocio.</p>
      <p>Puede explicar servicios, informar de tus tarifas y horarios y recoger solicitudes de reserva.</p>
      <p>Con herramientas como <Link href="/es/chatbot-whatsapp-gratis">Wapzen</Link>, que es gratis para empezar, puedes crear un asistente virtual para tu peluquería sin programar y configurarlo con tus horarios, tarifas y condiciones.</p>
      <p>Por ejemplo, una persona escribe:</p>
      <blockquote>“¿Tenéis cita para mechas el sábado?”</blockquote>
      <p>Un asistente con IA puede preguntar qué tipo de mechas quiere, si necesita una valoración previa, qué longitud de cabello tiene y si prefiere algún profesional concreto.</p>
      <p>Un chatbot básico basado en respuestas fijas no siempre puede gestionar esa conversación con la misma flexibilidad.</p>
      <p><strong>La función principal de una recepcionista virtual con IA es convertir una consulta incompleta en una solicitud clara, sin inventar precios ni confirmar horarios que no están disponibles.</strong></p>
      <p>Para comprobar huecos y reservar realmente, debe trabajar con una agenda externa o un sistema de reservas.</p>
    </>,
  },
  {
    id: "por-que",
    title: "¿Por qué automatizar las citas de peluquería por WhatsApp?",
    body: <>
      <p>Las reservas de peluquería pueden requerir más información que simplemente elegir una fecha y una hora.</p>
      <p>No es lo mismo solicitar un corte de caballero que unas mechas con matización, un alisado o una corrección de color.</p>
      <p>Los tiempos, los materiales y los profesionales necesarios pueden ser diferentes.</p>
      <p>La automatización puede ayudar en cinco situaciones especialmente habituales.</p>

      <h3>1. Cuando los clientes escriben fuera del horario comercial</h3>
      <p>Muchas personas buscan una peluquería al terminar su jornada laboral.</p>
      <p>Un chatbot puede responder a preguntas administrativas y recoger solicitudes mientras el establecimiento está cerrado.</p>

      <h3>2. Cuando no puedes atender el teléfono</h3>
      <p>Durante un corte o una coloración, no siempre puedes contestar una llamada.</p>
      <p>La IA puede encargarse de las consultas frecuentes que llegan por WhatsApp.</p>

      <h3>3. Cuando necesitas saber qué servicio quiere el cliente</h3>
      <p>Un mensaje como “Quiero hacerme el pelo” no basta para preparar una cita.</p>
      <p>El asistente puede preguntar si se trata de corte, color, mechas, peinado o tratamiento.</p>

      <h3>4. Cuando los precios requieren valoración</h3>
      <p>Algunos tratamientos dependen de la longitud, la cantidad de cabello, el estado del pelo y el trabajo necesario.</p>
      <p>La IA puede explicar las tarifas publicadas y orientar hacia una valoración sin prometer precios que no puede verificar.</p>

      <h3>5. Cuando tienes varios profesionales</h3>
      <p>Si el salón dispone de estilistas especializados, el chatbot puede recoger las preferencias del cliente.</p>
      <p>Una integración con la agenda puede permitir comprobar qué profesional está disponible para cada servicio.</p>
    </>,
  },
  {
    id: "ejemplos",
    title: "6 ejemplos de automatización con IA para peluquerías",
    body: <>
      <Note>Estos diálogos muestran situaciones ilustrativas de una peluquería española. Los precios y las condiciones deben adaptarse a la información real del negocio.</Note>

      <h3>Ejemplo 1: Reservar un corte de pelo</h3>
      <p><strong>Cliente:</strong> “Hola, quiero pedir cita para corte de hombre mañana por la tarde.”</p>
      <p><strong>Asistente IA:</strong> “¡Hola! Claro, ¿prefieres alguna hora concreta y quieres reservar con algún peluquero en especial?”</p>
      <p><strong>Cliente:</strong> “A partir de las seis, me da igual quién.”</p>
      <p><strong>Asistente IA:</strong> “Perfecto. Anoto tu preferencia para mañana a partir de las 18:00 para que el equipo confirme la hora.”</p>
      <p>Si existe una agenda conectada, el asistente puede comprobar horarios. Sin integración, la solicitud debe confirmarla la recepción.</p>

      <h3>Ejemplo 2: Preguntar el precio de unas mechas balayage</h3>
      <p><strong>Clienta:</strong> “¿Cuánto cuesta hacerse un balayage en pelo largo?”</p>
      <p><strong>Asistente IA:</strong> “¡Hola! El presupuesto depende del trabajo necesario, la longitud, el color de partida y el resultado que busques. Podemos ayudarte a solicitar una valoración para que nuestro equipo te indique las opciones y el precio.”</p>
      <p><strong>Clienta:</strong> “Tengo el pelo teñido de negro.”</p>
      <p><strong>Asistente IA:</strong> “Gracias por comentarlo. Es importante que el profesional conozca tu historial de coloración antes de valorar el tratamiento. ¿Quieres que te explique cómo solicitar una consulta?”</p>
      <p>Así se evita ofrecer un presupuesto cerrado sin información suficiente.</p>

      <h3>Ejemplo 3: Corte y tinte en una misma cita</h3>
      <p><strong>Clienta:</strong> “Hola, ¿puedo reservar corte y tinte juntos?”</p>
      <p><strong>Asistente IA:</strong> “¡Claro! ¿Buscas retocar raíces, aplicar un color completo o realizar otro cambio de color? Así podremos preparar correctamente tu solicitud.”</p>
      <p><strong>Clienta:</strong> “Solo raíces y cortar un poco las puntas.”</p>
      <p><strong>Asistente IA:</strong> “Perfecto. ¿Qué día y horario te vienen mejor? Puedo recoger tu solicitud de retoque de raíces y corte de puntas.”</p>
      <p>Este tipo de preguntas ayuda a identificar la combinación correcta de servicios.</p>

      <h3>Ejemplo 4: Reserva para una boda</h3>
      <p><strong>Clienta:</strong> “Me caso el 19 de diciembre. ¿Hacéis recogidos de novia?”</p>
      <p><strong>Asistente IA:</strong> “¡Enhorabuena! Podemos ayudarte con información sobre nuestros servicios de peinado para novias. ¿Necesitas también una prueba de peinado o quieres conocer primero cómo funciona la valoración?”</p>
      <p><strong>Clienta:</strong> “Quiero una prueba antes.”</p>
      <p><strong>Asistente IA:</strong> “Perfecto. Puedo ayudarte a solicitar información sobre la prueba y la disponibilidad del equipo para las fechas que necesitas.”</p>
      <p>El chatbot puede organizar una consulta inicial sin comprometer la disponibilidad de una fecha especial.</p>

      <h3>Ejemplo 5: Clienta interesada en alisado de keratina</h3>
      <p><strong>Clienta:</strong> “¿Tenéis alisado de keratina? ¿Cuánto dura el resultado?”</p>
      <p><strong>Asistente IA:</strong> “Nuestro salón ofrece información sobre tratamientos de alisado. La duración y el resultado dependen del producto utilizado, las características del cabello y los cuidados posteriores. Nuestro equipo podrá valorar qué opción es adecuada. ¿Quieres solicitar una consulta?”</p>
      <p>La IA debe basarse en la información técnica aprobada por el salón y evitar garantizar resultados.</p>

      <h3>Ejemplo 6: Cambio de una cita de última hora</h3>
      <p><strong>Cliente:</strong> “Tengo cita mañana con Ana, pero me ha surgido algo. ¿Podemos pasarla al viernes?”</p>
      <p><strong>Asistente IA:</strong> “Puedo ayudarte a solicitar el cambio. ¿Quieres mantener el mismo servicio y seguir con Ana?”</p>
      <p><strong>Cliente:</strong> “Sí, igual que estaba.”</p>
      <p><strong>Asistente IA:</strong> “Entendido. Anoto que quieres pasarla al viernes con Ana. La modificación quedará confirmada únicamente cuando la agenda o nuestro equipo lo verifique.”</p>
    </>,
  },
  {
    id: "organizar-agenda",
    title: "Cómo organizar una agenda de peluquería para que la IA entienda tus servicios",
    body: <>
      <p>Antes de automatizar las citas, necesitas que tu asistente conozca el catálogo de servicios.</p>
      <p>Por ejemplo, una peluquería puede dividir su agenda en estas categorías:</p>
      <Comparison caption="Información que necesita el asistente para cada servicio de peluquería" columns={["Información que necesita el asistente"]} rows={services} />
      <p><strong>La mejor automatización de citas de peluquería empieza por tener una agenda bien definida.</strong></p>
      <p>No sirve de mucho que una IA responda inmediatamente si reserva un tratamiento de tres horas en un hueco de treinta minutos.</p>
    </>,
  },
  {
    id: "planificacion",
    title: "Agenda de citas de peluquería: un ejemplo de planificación",
    body: <>
      <p>Imagina un salón que trabaja con varios profesionales.</p>
      <p>Una cita de corte puede ocupar un bloque relativamente corto. Sin embargo, un servicio técnico puede incluir aplicación, tiempo de exposición, lavado, matización, secado y acabado.</p>
      <p>Algunas fases pueden permitir atender a otra persona, pero otras requieren la presencia de un profesional o un recurso concreto del salón.</p>
      <p>Por eso hay que diferenciar entre:</p>
      <ul>
        <li><strong>Duración total del servicio:</strong> el tiempo durante el cual el cliente ocupa una cita.</li>
        <li><strong>Tiempo de atención activa:</strong> el periodo en el que un profesional debe trabajar directamente con el cliente.</li>
        <li><strong>Recursos necesarios:</strong> estilista, lavacabezas, zona de trabajo u otros elementos.</li>
        <li><strong>Preferencias del cliente:</strong> horario, profesional y servicios adicionales.</li>
      </ul>
      <p>Un chatbot puede recoger esos datos, mientras que el software de agenda debe aplicar las reglas de disponibilidad.</p>
      <p>Esta separación ayuda a evitar conflictos entre reservas.</p>
    </>,
  },
  {
    id: "chatbot-o-software",
    title: "¿Es mejor un chatbot de WhatsApp o un software de reservas para peluquerías?",
    body: <>
      <p>Depende del problema que quieras resolver.</p>
      <p>Si tu principal dificultad es organizar citas, necesitas una agenda.</p>
      <p>Si el problema es responder continuamente preguntas sobre horarios, precios y servicios, puede ayudarte un chatbot conversacional.</p>
      <p>Y si quieres automatizar el proceso completo, puedes combinar ambos mediante una integración adecuada.</p>
      <Comparison caption="Programa de reservas y chatbot con IA para una peluquería" columns={["Programa de reservas", "Chatbot con IA"]} rows={compare} />
      <p>Algunos programas de peluquería, como SalonBot, combinan gestión del negocio y funciones de comunicación. Otros, como Daltira, están orientados a agenda, reservas y administración del salón.</p>
      <p>Wapzen se centra en crear el agente conversacional y permite añadir herramientas de API para trabajar con sistemas externos.</p>
      <p>No debe confundirse con un programa de gestión de peluquería que incluya por defecto facturación, inventario y calendario completo.</p>
      <InlineCta title="Prueba una recepcionista virtual en tu peluquería" body="Crea un agente de IA, añade tus servicios y tarifas y comprueba cómo responde a las preguntas de tus clientes. Gratis para empezar." label="Empieza gratis" />
    </>,
  },
  {
    id: "crear",
    title: "Cómo poner un chatbot de WhatsApp en tu peluquería con Wapzen",
    body: <>
      <p><Link href="/es/chatbot-whatsapp-gratis">Wapzen</Link> es una plataforma que permite crear chatbots con inteligencia artificial para WhatsApp sin necesidad de programar.</p>
      <p>Es gratis para empezar y no pide tarjeta de crédito. El inicio gratuito tiene un límite de uso y los volúmenes mayores necesitan un plan de pago: al llegar al límite, el agente deja de responder, así que conviene seguir pendiente del WhatsApp del salón.</p>

      <h3>Paso 1. Crea una cuenta gratuita</h3>
      <p>Accede a la plataforma de Wapzen. No necesitas contratar por tu cuenta una clave de API de inteligencia artificial.</p>

      <h3>Paso 2. Configura una recepcionista virtual</h3>
      <p>Define el nombre, el tono y las instrucciones del chatbot.</p>
      <p>Puedes crear un agente que utilice español de España y se comunique de manera natural con tus clientes.</p>

      <h3>Paso 3. Añade la información de la peluquería</h3>
      <p>Introduce tus tarifas, servicios, horarios, dirección, condiciones de reserva y preguntas frecuentes.</p>
      <p>También puedes añadir información a través de documentos PDF o Word.</p>

      <h3>Paso 4. Conecta tu WhatsApp</h3>
      <p>Wapzen permite conectar un número personal o de WhatsApp Business utilizando un código QR o un código de vinculación.</p>
      <p>Esta conexión se realiza mediante un dispositivo vinculado y no utiliza la plataforma oficial WhatsApp Business API.</p>
      <p>Es importante evaluar sus riesgos de disponibilidad, privacidad y condiciones de uso antes de utilizarla para las comunicaciones esenciales del salón.</p>

      <h3>Paso 5. Prueba consultas reales</h3>
      <p>Envía preguntas sobre cortes, tintes, mechas, servicios combinados y citas con profesionales específicos.</p>
      <p>Comprueba que el chatbot responde con información correcta y reconoce cuándo necesita intervención humana.</p>
      <p>Las conversaciones quedan guardadas en el panel: sin agenda conectada, las solicitudes de cita están ahí y tu equipo debe revisarlas para confirmarlas.</p>
      <p>Si deseas que el asistente confirme citas automáticamente, tendrás que configurar una integración con el sistema de reservas de tu peluquería, y ese sistema debe ofrecer una API. Esa parte puede requerir conocimientos técnicos.</p>
      <p>Una herramienta de API no se ejecuta en todos los mensajes que deberían activarla, así que pruébala varias veces y comprueba en la agenda que la reserva se ha creado. El agente tampoco recibe el número del cliente: si tu sistema lo necesita, indícale en las instrucciones que lo pregunte.</p>
      <Note>El agente de chat de Wapzen lee texto: no entiende audios ni el contenido de las imágenes, y no responde en grupos. Solo recuerda los últimos minutos de cada conversación, así que un cliente que vuelve al día siguiente empieza de cero. Tampoco se detiene cuando contestas desde el móvil: no hay pausa por conversación, y pausar el agente detiene todas las conversaciones. Contesta cuando alguien escribe, pero no envía recordatorios por su cuenta. Wapzen es un producto independiente: no pertenece a Meta ni a WhatsApp.</Note>
    </>,
  },
  {
    id: "prompt",
    title: "Prompt para crear una recepcionista virtual de peluquería",
    body: <>
      <p>Puedes utilizar estas instrucciones como punto de partida:</p>
      <blockquote>“Eres la recepcionista virtual de una peluquería española. Atiendes a los clientes por WhatsApp, utilizando un tono cercano, natural y profesional. Deja claro que eres un asistente virtual, no una persona. Responde en español de España y utiliza exclusivamente la información verificada sobre servicios, tarifas, horarios y condiciones de nuestro salón. Cuando alguien solicite una cita, pregunta qué servicio necesita, qué día prefiere, en qué franja horaria quiere acudir y si desea un estilista concreto. Para servicios de coloración, mechas o tratamientos complejos, no prometas presupuestos ni resultados sin la valoración correspondiente. No inventes disponibilidad ni confirmes reservas sin una respuesta válida del sistema de agenda. Si el cliente solicita atención humana, explícale cómo contactar con el equipo: [teléfono]. No realices diagnósticos ni recomendaciones de salud individualizadas. Evita recopilar datos personales que no sean necesarios para gestionar la consulta.”</blockquote>
      <p>Adapta el texto a los procedimientos reales de tu negocio.</p>
    </>,
  },
  {
    id: "ahorro",
    title: "Cuánto tiempo puede ahorrar una peluquería automatizando WhatsApp",
    body: <>
      <p>El resultado depende del número de mensajes, el tiempo que tardas en contestarlos y cuántas consultas pueda resolver la IA correctamente.</p>
      <p>Vamos a utilizar un ejemplo hipotético.</p>
      <p>Supongamos que una peluquería recibe 30 consultas administrativas diarias por WhatsApp, y responder cada una requiere una media de dos minutos.</p>
      <p>Eso representa una hora al día.</p>
      <p>Si un chatbot resolviera correctamente la mitad, se liberarían aproximadamente 30 minutos diarios de atención.</p>
      <p>Durante 22 jornadas laborables, serían unas 11 horas de capacidad al mes.</p>
      <p><strong>Esto no es una estadística del sector ni una promesa de resultados de Wapzen.</strong> Es un cálculo ilustrativo.</p>
      <p>Para estimar el beneficio real, debes medir las consultas resueltas, el tiempo de supervisión del chatbot y las reservas finalmente confirmadas.</p>
    </>,
  },
  {
    id: "whatsapp-business",
    title: "WhatsApp Business e inteligencia artificial: ¿qué debes tener en cuenta?",
    body: <>
      <p>La aplicación WhatsApp Business ofrece herramientas básicas como mensajes de bienvenida, respuestas rápidas y mensajes de ausencia.</p>
      <p>Estas funciones pueden ser suficientes para una peluquería que recibe pocas consultas.</p>
      <p>Sin embargo, un chatbot con IA permite responder de manera más flexible usando las preguntas y el contexto de cada cliente.</p>
      <p>Antes de utilizar un proveedor externo, revisa su modalidad de conexión y la normativa aplicable.</p>
      <p>En España, los nombres, teléfonos y reservas de los clientes son datos personales, por lo que deben tratarse conforme al RGPD y la LOPDGDD.</p>
      <p>En el caso de Wapzen, la base de datos principal está en Singapur, los servidores de aplicación en Singapur y Alemania, y proveedores como OpenAI pueden tratar la información en Estados Unidos. Las conversaciones se conservan hasta que las borres. Los detalles están en su <Link href="/privacy">política de privacidad</Link>, en inglés. Wapzen no publica un contrato estándar de encargado del tratamiento: si lo necesitas, pregunta antes de conectar tu número.</p>
      <p>También debes tener en cuenta los requisitos de la LSSI para enviar publicidad electrónica.</p>
      <p>El hecho de que un cliente solicite una cita no significa que hayas obtenido automáticamente autorización para enviarle promociones.</p>
      <p>El artículo 50 del Reglamento europeo de inteligencia artificial exige, además, que las personas sepan que están hablando con una IA, salvo que resulte evidente. Wapzen no añade ese aviso por sí solo, así que inclúyelo en las instrucciones del agente.</p>
      <p>Para preparar tu negocio, puedes consultar los recursos para pymes de la <a href="https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/directrices-de-aplicacion/pymes" target="_blank" rel="noopener noreferrer">Agencia Española de Protección de Datos</a>.</p>
    </>,
  },
  {
    id: "conclusion",
    title: "Conclusión: una peluquería más organizada empieza por atender mejor",
    body: <>
      <p>Tus clientes no siempre necesitan hablar con un profesional para conocer un horario, consultar una tarifa o saber cómo solicitar una cita.</p>
      <p>Muchas de esas preguntas pueden resolverse automáticamente si la IA dispone de la información correcta.</p>
      <p>Un chatbot de WhatsApp puede ayudarte a reducir interrupciones, organizar solicitudes y responder consultas mientras trabajas.</p>
      <p>Y con un sistema de reservas conectado, es posible ampliar el proceso hasta la gestión de citas verificadas.</p>
      <p>La clave está en comenzar con conversaciones sencillas y mejorar el asistente a partir de lo que realmente preguntan tus clientes.</p>
      <p>Con Wapzen puedes empezar gratis y descubrir cómo encaja esta tecnología en la rutina de tu peluquería.</p>
      <p><strong>¿Quieres dejar de interrumpir tus cortes y coloraciones para responder siempre los mismos mensajes?</strong> <Link href="/es/chatbot-whatsapp-gratis">Crea tu chatbot de WhatsApp para peluquerías con Wapzen</Link>, configúralo con los servicios de tu salón y empieza a probar las consultas que más tiempo te ocupan cada día.</p>
    </>,
  },
];

export default function ChatbotWhatsAppPeluqueriasPage() {
  return <BlogPost
    href={href}
    heading={<>Chatbot WhatsApp para peluquerías.<br /><span>Cómo automatizar citas y atender clientes con IA en 2026.</span></>}
    lead="“Hola, ¿tenéis hueco mañana para corte y tinte?” “¿Cuánto me costaría hacerme unas mechas balayage?” “¿Puedo cambiar mi cita del viernes?” Son mensajes que llegan todos los días al WhatsApp de muchas peluquerías españolas. El problema no es contestar una pregunta. El problema es responder a todas mientras estás cortando el pelo, preparando un color o atendiendo a un cliente. Y cuando el salón está cerrado, las consultas no se detienen."
    summary={{
      title: "Resumen",
      items: [
        <><strong>Qué resuelve:</strong> un chatbot con IA responde sobre cortes, tintes, mechas y horarios, y recoge solicitudes de cita mientras trabajas.</>,
        <><strong>Qué no es:</strong> una agenda. Comprobar huecos con varios profesionales exige un software de reservas.</>,
        <><strong>Citas:</strong> sin integración, tu equipo confirma; la reserva automática necesita una agenda conectada por API.</>,
        <><strong>Legal:</strong> revisa el RGPD, la LSSI y el aviso de que el cliente habla con una IA.</>,
        <><strong>Cómo probarlo:</strong> Wapzen es gratis para empezar, sin programar y con límite de uso.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    product="/es/chatbot-whatsapp-gratis"
    cta={{ heading: <>Tu peluquería responde.<br /><span>Tú sigues cortando.</span></>, body: "Crea un agente de IA, añade tus servicios y conecta tu número. Es gratis para empezar." }}
  />;
}
