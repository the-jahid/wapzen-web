import type { Metadata } from "next";
import { BookOpen, Languages, MessageSquareReply, PhoneIncoming, Smartphone, Zap } from "lucide-react";
import { pageMetadata } from "@/lib/pageMetadata";
import { Cards, Comparison, MarketingPage, Section, Steps } from "@/components/marketing/MarketingPage";

// Brasil. Busca-alvo: "chatbot whatsapp com ia", "atendimento whatsapp com
// ia", "chatbot whatsapp grátis", "ia para whatsapp business", "chatbot
// whatsapp sem api" (docs/seo-research.md). Versão em inglês:
// /free-whatsapp-chatbot (hreflang em lib/marketingPages.ts).
const path = "/pt-br/chatbot-whatsapp-com-ia";
const title = "Chatbot WhatsApp com IA Grátis para Atendimento";
const description = "Crie grátis um chatbot com IA para o WhatsApp da sua empresa. Atendimento automático 24h com as informações do seu negócio, sem código e sem API oficial.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "pt-BR" });

const steps = [
  { title: "Crie sua conta grátis", body: "Cadastre-se no Wapzen. Não pedimos cartão de crédito e você não precisa contratar a API oficial do WhatsApp." },
  { title: "Crie um agente de chat", body: "Dê um nome ao seu chatbot, escolha um modelo da OpenAI (GPT) ou da Anthropic (Claude) e escreva as instruções: tom de voz, o que ele pode responder e o que não deve." },
  { title: "Ensine sobre o seu negócio", body: "Adicione uma base de conhecimento com perguntas frequentes, preços, horários e políticas. Cole textos ou envie arquivos PDF e Word." },
  { title: "Conecte o seu WhatsApp", body: "Escaneie um QR Code com o WhatsApp do celular, do mesmo jeito que você conecta o WhatsApp Web. Funciona com o WhatsApp Business ou com o WhatsApp normal." },
  { title: "Teste e ative", body: "Mande uma mensagem de outro celular para o seu número. A IA responde na hora, e todas as conversas ficam salvas no painel." },
];

const features = [
  { icon: MessageSquareReply, title: "Atendimento automático 24h", body: "Responde cada mensagem em segundos, inclusive à noite, nos fins de semana e nos feriados." },
  { icon: BookOpen, title: "Respostas com as suas informações", body: "Usa os seus documentos, preços e perguntas frequentes, então as respostas são do seu negócio, e não genéricas." },
  { icon: Zap, title: "Ações com ferramentas de API", body: "Conecte ferramentas de API para consultar um pedido, ver horários livres ou agendar no seu próprio sistema." },
  { icon: Languages, title: "Responde no idioma do cliente", body: "Se o cliente escrever em português, espanhol ou inglês, a IA responde no mesmo idioma." },
  { icon: Smartphone, title: "No seu número atual", body: "Conecte um WhatsApp Business ou pessoal por QR Code. Sem número novo e sem API oficial." },
  { icon: PhoneIncoming, title: "Também atende ligações", body: "Adicione um agente de voz com IA para atender e fazer ligações pelo WhatsApp com voz natural." },
];

const comparison = [
  ["Preço", "Planos mensais e taxas da Meta por mensagem de modelo", "Grátis no momento"],
  ["Configuração", "Conta na Meta, número registrado e, em geral, um provedor", "Escanear um QR Code"],
  ["Respostas", "Muitas vezes menus de botões; a IA costuma ser cobrada à parte", "IA incluída (GPT ou Claude)"],
  ["Ligações com IA", "Raras ou pagas à parte", "Incluídas, recebidas e feitas"],
  ["Plataforma oficial da Meta", "Sim", "Não: conecta como o WhatsApp Web"],
];

const faqs = [
  { q: "Existe chatbot para WhatsApp grátis?", a: "Sim. O Wapzen está gratuito no momento, com todos os recursos: chatbot com IA, agente de voz, campanhas de ligação, bases de conhecimento e ferramentas de API. Não precisa de cartão de crédito." },
  { q: "Como colocar IA no WhatsApp da minha empresa?", a: "Crie uma conta no Wapzen, configure um agente de chat com as suas instruções e informações e conecte o seu número escaneando um QR Code. A partir daí, a IA responde as mensagens que chegam." },
  { q: "Funciona no WhatsApp Business?", a: "Sim. Você pode conectar um número do WhatsApp Business ou do WhatsApp normal. O WhatsApp normal não tem resposta automática, e o Wapzen adiciona respostas com IA a ele." },
  { q: "Preciso da API oficial do WhatsApp?", a: "Não. O Wapzen conecta o seu número por QR Code, como o WhatsApp Web, então não há cadastro na API oficial, aprovação de modelos de mensagem nem taxas da Meta por mensagem. Ele não é um produto oficial da Meta: para disparos em massa, a API oficial é a ferramenta certa." },
  { q: "Qual IA o chatbot usa? É o ChatGPT?", a: "Você escolhe para cada agente: modelos GPT da OpenAI (a mesma família do ChatGPT) ou modelos Claude da Anthropic. Os dois estão incluídos, sem precisar de uma chave de API própria." },
  { q: "A IA consegue agendar horários?", a: "Ela coleta o nome, o serviço e o horário preferido do cliente durante a conversa. Para agendar direto na sua agenda ou sistema, conecte uma ferramenta de API; sem isso, a sua equipe confirma pelo histórico." },
  { q: "Consigo ver as conversas?", a: "Sim. Todas as conversas ficam salvas no painel do Wapzen, e as ligações ficam registradas com transcrição." },
];

export default function ChatbotWhatsAppComIaPage() {
  return <MarketingPage
    locale="pt-BR"
    path={path}
    name="Chatbot WhatsApp com IA"
    title={title}
    description={description}
    eyebrow="Chatbot com IA"
    heading={<>Chatbot WhatsApp com IA.<br /><span>Grátis e sem API.</span></>}
    lead="O Wapzen coloca uma IA para atender o WhatsApp da sua empresa. Ela responde cada cliente com base nas suas informações, 24 horas por dia, e funciona no seu número atual: é só escanear um QR Code. Sem programação e sem API oficial."
    perks={["Grátis", "Sem código", "Sem API oficial", "WhatsApp Business ou pessoal"]}
    ctaLabel="Criar meu chatbot grátis"
    secondary={{ href: "#como-criar", label: "Veja como criar" }}
    faq={{ heading: <>Chatbot com IA no WhatsApp.<br /><span>Perguntas frequentes.</span></>, items: faqs }}
    cta={{ heading: <>Seu chatbot com IA no WhatsApp.<br /><span>Grátis, a partir de hoje.</span></>, body: "Crie sua conta, ensine a IA sobre o seu negócio e conecte o seu número com um QR Code." }}
  >
    <Section id="como-criar" heading={<>Como criar um chatbot com IA para WhatsApp.<br /><span>Grátis, em cinco passos.</span></>}>
      <Steps items={steps} />
    </Section>

    <Section id="recursos" heading={<>O que o seu chatbot faz.<br /><span>Tudo incluído.</span></>} intro="O plano grátis é o produto completo. Todos os recursos abaixo funcionam no seu número de WhatsApp desde o primeiro dia.">
      <Cards items={features} />
    </Section>

    <Section id="comparar" heading={<>API oficial ou Wapzen?<br /><span>Compare antes de escolher.</span></>}>
      <Comparison caption="Plataformas com API oficial do WhatsApp comparadas com o Wapzen" columns={["Plataformas com API oficial", "Wapzen"]} rows={comparison} />
    </Section>
  </MarketingPage>;
}
