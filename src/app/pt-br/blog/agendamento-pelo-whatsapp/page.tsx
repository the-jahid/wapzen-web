import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Buscas-alvo: "agendamento pelo whatsapp" (30, 3/3), "agenda whatsapp" (30,
// 3/3), "agenda whatsapp business" (26), "agendamento automático whatsapp"
// (10), "lembrete de consulta whatsapp" (10), "robô de agendamento whatsapp"
// (10), autocomplete BR 2026-10-28; resultados de fornecedores (SleekFlow,
// WATI, AgendaPro), sem portais grandes. Limites do produto (iguais ao post em
// inglês): o agente não vê o número do cliente, não sabe a data de hoje, lê os
// primeiros 3.000 caracteres de uma ferramenta, e adicionar um lead a uma
// campanha liga na hora. Versão em inglês: /blog/whatsapp-appointment-booking.
const href = "/pt-br/blog/agendamento-pelo-whatsapp";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "pt-BR", article: { publishedTime: post.published, modifiedTime: post.updated } });

const ways = [
  ["Como funciona", "Você responde e anota na agenda", "Você manda um link e o cliente escolhe o horário", "A IA responde, pede os dados e registra ou agenda o horário"],
  ["Custo", "Grátis", "Grátis ou o plano do seu sistema de agendamento", "Grátis por enquanto com a Wapzen"],
  ["Responde de madrugada", "Não", "O link sim; as dúvidas não", "Sim, 24 horas"],
  ["Risco de horário duplicado", "Alto com muito movimento", "Baixo: o sistema bloqueia o horário", "Baixo, se consulta a sua agenda real"],
  ["Ideal para", "Poucos atendimentos por dia", "Quem já usa um sistema de agendamento", "Muito volume ou atendimento fora do horário"],
];

const reminders = [
  ["À mão, com resposta rápida", "Grátis", "Dez horários por dia; cansativo com cinquenta"],
  ["Modelos pela API oficial", "R$ 0,035 por mensagem", "Automático, pelo seu sistema de agendamento"],
  ["Ligação de lembrete com IA", "Grátis por enquanto com a Wapzen", "Confirma por voz; cada ligação sai quando você adiciona o contato"],
];

const faqs = [
  { q: "Como fazer agendamento pelo WhatsApp?", a: "Existem três jeitos: responder você mesmo e anotar na agenda, mandar um link do seu sistema de agendamento para o cliente escolher o horário, ou deixar um agente com IA responder, pedir os dados e registrar ou agendar o horário no seu sistema. Os dois primeiros são grátis; o terceiro também, por enquanto, com a Wapzen." },
  { q: "Como mandar lembrete de consulta pelo WhatsApp?", a: "Salve o lembrete como resposta rápida no WhatsApp Business e envie toda tarde para os agendamentos do dia seguinte. É grátis, mas manual. Os lembretes automáticos são enviados como modelos pela API oficial, que a Meta cobra por mensagem: R$ 0,035 cada no Brasil, em outubro de 2026." },
  { q: "Um robô de WhatsApp consegue agendar horários?", a: "Sim. Um agente com IA responde dúvidas, pede nome, serviço e horário e, com ferramentas de API, consulta os horários livres do seu sistema e cria o agendamento. Se você não tem sistema, ele pode salvar cada pedido numa planilha do Google para você confirmar." },
  { q: "O WhatsApp Business tem agenda?", a: "O WhatsApp Business não foi feito para ser agenda. O mais comum é manter os horários no Google Agenda ou num sistema de agendamento e usar o WhatsApp para receber pedidos, confirmar e lembrar." },
  { q: "Serve para clínica e consultório?", a: "Sim, para agendar, confirmar e responder dúvidas sobre horários, endereço, convênios e valores. Oriente o agente a nunca dar orientação médica e a pedir que o paciente ligue para a clínica em caso de urgência. Dados de saúde são dados sensíveis pela LGPD: não peça pelo chat o que não precisa." },
];

const sources = [
  { label: "Meta: preços da WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Google: agendamento de horários no Google Agenda", href: "https://support.google.com/calendar/answer/10729749?hl=pt-BR" },
  { label: "Central de Ajuda do WhatsApp: conectar um dispositivo", href: "https://faq.whatsapp.com/1317564962315842" },
];

const sections = [
  {
    id: "tres-jeitos",
    title: "Três jeitos de fazer agendamento pelo WhatsApp",
    body: <>
      <p>Clínicas, salões, barbearias, estúdios e escritórios recebem a maioria dos agendamentos pelo WhatsApp. Existem três jeitos de cuidar disso, do mais simples ao mais automático:</p>
      <Comparison caption="Três jeitos de fazer agendamento pelo WhatsApp comparados" columns={["À mão", "Link de agendamento", "Agente com IA"]} rows={ways} />
    </>,
  },
  {
    id: "a-mao",
    title: "1. À mão, grátis, com o WhatsApp Business",
    body: <>
      <p>Com poucos atendimentos por dia, o app grátis dá conta se você se organizar:</p>
      <ul>
        <li><strong>Mensagem de saudação</strong> que já pede o que você precisa: nome, serviço e dia de preferência. Temos <Link href="/pt-br/blog/mensagem-de-saudacao-whatsapp-business">exemplos para copiar</Link>.</li>
        <li><strong>Respostas rápidas</strong> com horários, preços e endereço, para não digitar dez vezes por dia.</li>
        <li><strong>Etiquetas</strong> como “A confirmar”, “Confirmado” e “Faltou”.</li>
        <li><strong>Uma agenda só</strong>, no papel ou no Google Agenda, onde você anota tudo na hora para não marcar dois clientes no mesmo horário.</li>
      </ul>
      <p>O limite é o tempo: se você demora para responder, o cliente agenda com outro.</p>
    </>,
  },
  {
    id: "link",
    title: "2. Com um link de agendamento",
    body: <>
      <p>Se você já usa um sistema de agendamento, ou as <strong>páginas de agendamento do Google Agenda</strong>, mande o link na mensagem de saudação ou numa resposta rápida. O cliente vê só os horários livres, escolhe um e recebe a confirmação. O sistema bloqueia o horário e evita duplicidade.</p>
      <p>A desvantagem é o passo a mais: tem cliente que não sai da conversa para preencher formulário e prefere perguntar “tem horário na quinta?”. É aí que a IA ajuda.</p>
      <p>Para quem já está no consultório ou na loja, imprima um <Link href="/tools/whatsapp-qr-code-generator">QR Code do WhatsApp</Link> com uma mensagem pronta, como “Oi, quero agendar um horário”. É grátis, e a ferramenta está em inglês.</p>
    </>,
  },
  {
    id: "com-ia",
    title: "3. Com um agente de IA que agenda por você",
    body: <>
      <p>Um agente com IA no seu WhatsApp atende como a sua recepcionista faria: tira dúvidas, pede nome, serviço, dia e horário, e depois faz uma de duas coisas:</p>
      <ul>
        <li><strong>Registra o pedido</strong> numa planilha do Google com uma ferramenta de API, para você confirmar depois. Não precisa de sistema de agendamento.</li>
        <li><strong>Agenda no seu sistema</strong>, se ele tiver API: com uma ferramenta consulta os horários livres do dia que o cliente pediu e com outra cria o agendamento no horário escolhido.</li>
      </ul>
      <Note>O agente não vê o número de WhatsApp do cliente, então peça nas instruções para ele perguntar. Ele também não sabe a data de hoje: se o seu sistema devolve a data atual junto com os horários livres, ele entende “terça que vem”. E ele lê os primeiros 3.000 caracteres de cada resposta: devolva uma lista curta de horários, não a agenda inteira.</Note>
      <InlineCta title="Deixe a IA agendar pelo WhatsApp" body="A Wapzen tira dúvidas e marca horários no seu número de sempre, por mensagem ou ligação de WhatsApp, a qualquer hora. Grátis por enquanto." label="Comece grátis" />
      <p>Muitos clientes preferem ligar. Um agente de voz da Wapzen atende as ligações de WhatsApp no mesmo número e pode usar as mesmas ferramentas para marcar o horário em voz alta. Veja <Link href="/pt-br/blog/como-criar-robo-whatsapp">como criar um robô no WhatsApp</Link>.</p>
    </>,
  },
  {
    id: "lembretes",
    title: "Lembretes de consulta e de horário pelo WhatsApp",
    body: <>
      <p>Lembretes diminuem as faltas. Existem três jeitos de enviar:</p>
      <Comparison caption="Formas de enviar lembretes de consulta pelo WhatsApp" columns={["Custo", "Ideal para"]} rows={reminders} />
      <ul>
        <li><strong>À mão.</strong> Salve o lembrete como resposta rápida e envie toda tarde para os horários do dia seguinte.</li>
        <li><strong>Modelos pela API oficial.</strong> Sistemas de agendamento ligados à API enviam sozinhos, como modelos de utilidade que a Meta cobra por mensagem. Mais detalhes em <Link href="/pt-br/blog/whatsapp-business-e-pago">WhatsApp Business é pago?</Link></li>
        <li><strong>Ligações de lembrete com a Wapzen.</strong> Crie uma campanha com um agente de voz que confirma o horário e adicione os pacientes do dia seguinte como contatos quando quiser que as ligações saiam: cada contato recebe a ligação assim que é adicionado.</li>
      </ul>
      <p>Atenção à terceira opção: um contato de campanha tem nome e número, não os dados do agendamento, então o agente confirma “o seu horário de amanhã com a gente” sem falar a hora. Se ninguém atende, o contato fica como sem sucesso e a Wapzen não liga de novo sozinha.</p>
      <Note>A Wapzen é um produto independente, não é da Meta nem do WhatsApp. Mande mensagens e ligue só para quem espera o seu contato: o WhatsApp restringe números que enviam mensagens ou ligações indesejadas.</Note>
    </>,
  },
];

export default function AgendamentoPeloWhatsAppPage() {
  return <BlogPost
    href={href}
    heading={<>Agendamento pelo WhatsApp.<br /><span>Automático e com lembretes.</span></>}
    lead="Três jeitos de fazer agendamento pelo WhatsApp Business, do manual e grátis ao automático com IA, e como enviar lembretes de consulta para reduzir as faltas na clínica, no salão ou no escritório."
    summary={{
      title: "Resumo",
      items: [
        <><strong>À mão e grátis:</strong> WhatsApp Business com respostas rápidas, etiquetas e uma agenda só.</>,
        <><strong>Com um link:</strong> você manda a sua página de agendamento e o cliente escolhe um horário livre.</>,
        <><strong>Com IA:</strong> um agente responde, pede os dados e registra ou agenda o horário, de dia e de noite.</>,
        <><strong>Lembretes:</strong> grátis à mão, R$ 0,035 por mensagem pela API ou por ligação com um agente de voz.</>,
        <><strong>Para clínicas:</strong> nada de orientação médica pelo chat e cuidado com os dados de saúde (LGPD).</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/pt-br/blog/como-criar-robo-whatsapp", "/pt-br/blog/mensagem-de-saudacao-whatsapp-business"]}
    product="/pt-br/ligacao-com-ia"
    cta={{ heading: <>Agendamentos pelo WhatsApp, dia e noite.<br /><span>Feitos por IA.</span></>, body: "Crie um agente grátis, adicione seus serviços e horários e conecte o seu número com um QR Code. Ele responde e agenda desde o primeiro dia." }}
  />;
}
