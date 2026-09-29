import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { Comparison, MarketingPage, Samples, Section, Steps } from "@/components/marketing/MarketingPage";

// Brasil. Busca-alvo: "resposta automática whatsapp business", "... normal",
// "... pessoal", "mensagem automática whatsapp", "... iphone", "... como
// fazer" (docs/seo-research.md). Versão em inglês: /whatsapp-auto-reply.
const path = "/pt-br/resposta-automatica-whatsapp";
const title = "Resposta Automática WhatsApp: Como Fazer e Modelos";
const description = "Como fazer resposta automática no WhatsApp Business e no WhatsApp normal, com modelos de mensagem para copiar e uma IA grátis que responde cada cliente.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "pt-BR" });

const businessSteps = [
  { title: "Abra as Ferramentas comerciais", body: "No WhatsApp Business, toque em Configurações (iPhone) ou em Mais opções (Android) e depois em Ferramentas comerciais." },
  { title: "Escolha ausência ou saudação", body: "A mensagem de ausência responde quando você está indisponível. A de saudação recebe quem fala com você pela primeira vez ou depois de 14 dias sem conversa." },
  { title: "Escreva a mensagem", body: "Ative a opção e edite o texto. Os modelos mais abaixo são um bom ponto de partida." },
  { title: "Defina horário e destinatários", body: "Envie sempre, em um horário personalizado ou fora do horário comercial, escolha quem recebe e toque em Salvar." },
];

const comparison = [
  ["O que envia", "O mesmo texto fixo para todos", "Uma resposta de verdade para cada mensagem"],
  ["Responde perguntas", "Não", "Sim, com a sua base de conhecimento"],
  ["WhatsApp normal", "Não, só no WhatsApp Business", "Sim, normal ou Business"],
  ["Quando responde", "Fora do horário ou na primeira mensagem", "Toda mensagem, 24 horas"],
  ["Custo", "Grátis", "Grátis no momento"],
];

const samples = [
  { title: "Fora do horário", text: "Olá! Obrigado pela mensagem. No momento estamos fechados. Nosso horário é de segunda a sábado, das 9h às 18h, e respondemos assim que voltarmos." },
  { title: "Saudação", text: "Olá, seja bem-vindo(a) à [Nome da empresa]! Como podemos ajudar? Pergunte sobre produtos, preços ou horários." },
  { title: "Em atendimento", text: "Oi! Estou atendendo outro cliente agora e respondo você em até uma hora." },
  { title: "Feriado", text: "Olá! Estaremos fechados de [data] a [data] por causa do feriado. Responderemos todas as mensagens na volta. Obrigado pela paciência!" },
  { title: "Fim de semana", text: "Obrigado pela mensagem! Nossa equipe está de folga no fim de semana e responde na segunda-feira de manhã." },
  { title: "Consulta de pedido", text: "Obrigado por falar com a [Nome da empresa]! Para consultar o seu pedido, envie o número do pedido e retornamos em breve." },
  { title: "Agendamento", text: "Olá! Obrigado pelo interesse. Informe o dia e o horário de sua preferência e confirmamos o agendamento o quanto antes." },
  { title: "Ligação perdida", text: "Desculpe, não conseguimos atender a sua ligação! Como podemos ajudar? Mande uma mensagem aqui e respondemos logo." },
];

const faqs = [
  { q: "Como fazer resposta automática no WhatsApp Business?", a: "Toque em Configurações (iPhone) ou em Mais opções (Android), abra Ferramentas comerciais e escolha Mensagem de ausência ou Mensagem de saudação. Ative, escreva o texto, defina horário e destinatários e toque em Salvar." },
  { q: "Dá para ter resposta automática no WhatsApp normal?", a: "O WhatsApp normal não tem essa função. Você pode migrar o número para o WhatsApp Business, que é gratuito, ou conectar o número ao Wapzen para ter respostas com IA sem trocar de aplicativo." },
  { q: "A resposta automática funciona no iPhone?", a: "Sim. No WhatsApp Business para iPhone, o caminho é Configurações > Ferramentas comerciais. Com o Wapzen, as respostas saem da nuvem, então funcionam com qualquer celular." },
  { q: "Qual o melhor app para resposta automática no WhatsApp?", a: "Para mensagens fixas, o próprio WhatsApp Business resolve. Para responder perguntas de verdade, use uma IA: o Wapzen lê cada mensagem e responde com base nas informações da sua empresa, e está gratuito no momento." },
  { q: "Resposta automática com IA é grátis?", a: "No Wapzen, sim: ele está gratuito no momento, sem cartão de crédito e sem API oficial do WhatsApp." },
  { q: "Preciso deixar o WhatsApp Web aberto no computador?", a: "Não. Depois que o número é conectado, o Wapzen responde pela nuvem, sem aba aberta nem computador ligado." },
];

export default function RespostaAutomaticaPage() {
  return <MarketingPage
    locale="pt-BR"
    path={path}
    name="Resposta automática no WhatsApp"
    title={title}
    description={description}
    eyebrow="Resposta automática"
    heading={<>Resposta automática no WhatsApp.<br /><span>Como fazer, modelos e IA.</span></>}
    lead="Tudo sobre resposta automática no WhatsApp: como ativar no WhatsApp Business, o que fazer no WhatsApp normal, modelos de mensagem para copiar e uma IA grátis que responde cada cliente de verdade."
    perks={["Modelos para copiar", "Business e normal", "Resposta com IA grátis"]}
    ctaLabel="Ativar resposta com IA grátis"
    secondary={{ href: "#modelos", label: "Ver os modelos" }}
    faq={{ heading: <>Resposta automática.<br /><span>Perguntas frequentes.</span></>, items: faqs }}
    cta={{ heading: <>Respostas que resolvem.<br /><span>Não só “estamos ausentes”.</span></>, body: "Conecte o seu WhatsApp ao Wapzen e deixe a IA responder cada mensagem de verdade, dia e noite. Grátis e sem cartão de crédito." }}
  >
    <Section id="whatsapp-business" heading={<>Como fazer resposta automática no WhatsApp Business.<br /><span>Nativo, grátis e com texto fixo.</span></>} intro="O WhatsApp Business tem duas mensagens automáticas. Elas enviam sempre o mesmo texto, o que funciona bem para avisar que você está ausente.">
      <Steps items={businessSteps} />
    </Section>

    <Section id="whatsapp-normal" heading={<>Resposta automática no WhatsApp normal.<br /><span>Não existe. Mas tem solução.</span></>} intro="O WhatsApp normal não tem resposta automática. Você pode passar o número para o WhatsApp Business, que é gratuito e pode levar o seu histórico de conversas, ou conectar o número ao Wapzen, que adiciona respostas com IA sem trocar de aplicativo.">
      <Comparison caption="Mensagem de ausência comparada com a resposta com IA do Wapzen" columns={["Mensagem de ausência", "Resposta com IA do Wapzen"]} rows={comparison} />
    </Section>

    <Section id="modelos" heading={<>Modelos de mensagem automática.<br /><span>Copie e cole.</span></>} intro="Troque o que estiver entre [colchetes] pelos seus dados. Os modelos servem como mensagem de ausência ou de saudação, ou como exemplo nas instruções do seu agente de IA.">
      <Samples items={samples} locale="pt-BR" />
    </Section>
  </MarketingPage>;
}
