import type { Metadata } from "next";
import { BookOpen, CalendarCheck, FileText, PhoneIncoming, PhoneOutgoing, Radio } from "lucide-react";
import { pageMetadata } from "@/lib/pageMetadata";
import { Cards, Comparison, MarketingPage, Section, Steps } from "@/components/marketing/MarketingPage";

// Brasil. Busca-alvo: "ligação com ia", "agente de voz ia", "secretária
// virtual ia", "sdr ia (ligação / whatsapp)", "atendente virtual whatsapp"
// (docs/seo-research.md). Só ligações de WhatsApp, nunca linha telefônica:
// deixar isso claro. Versão em inglês: /free-ai-calling-agent.
const path = "/pt-br/ligacao-com-ia";
const title = "Ligação com IA pelo WhatsApp: Agente de Voz Grátis";
const description = "Um agente de voz com IA que atende e faz ligações pelo WhatsApp, como secretária virtual ou SDR. Voz natural em português, grátis e sem custo por minuto.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "pt-BR" });

const features = [
  { icon: PhoneIncoming, title: "Secretária virtual com IA", body: "Atende todas as ligações de WhatsApp, informa horários, serviços e preços e anota o que cada cliente precisa." },
  { icon: PhoneOutgoing, title: "SDR com IA", body: "Liga para novos leads assim que eles chegam, faz as perguntas de qualificação que você definir e registra as respostas na transcrição." },
  { icon: CalendarCheck, title: "Pedidos de agendamento", body: "Coleta o dia e o horário preferidos. Com uma ferramenta de API, agenda direto no seu sistema." },
  { icon: Radio, title: "Campanhas de ligação", body: "Adicione leads a uma campanha e a IA liga para cada um. Acompanhe os resultados nas análises da campanha." },
  { icon: BookOpen, title: "Respostas da sua base", body: "Consulta os seus preços, políticas e perguntas frequentes durante a chamada, em vez de inventar." },
  { icon: FileText, title: "Transcrição de cada chamada", body: "Todas as ligações ficam salvas com transcrição no painel, para a sua equipe dar sequência." },
];

const steps = [
  { title: "Crie sua conta grátis", body: "Sem cartão de crédito e sem precisar de conta própria na OpenAI ou na ElevenLabs." },
  { title: "Crie um agente de voz", body: "Escreva as instruções e a saudação, defina o idioma como português (Brasil) e escolha uma voz." },
  { title: "Adicione conhecimento e ferramentas", body: "Anexe uma base de conhecimento e, se quiser, ferramentas de API para consultar pedidos ou agendar." },
  { title: "Conecte o seu WhatsApp", body: "Escaneie um QR Code para conectar o seu número e atribua o agente de voz a ele." },
  { title: "Atenda e ligue", body: "A IA atende as ligações recebidas no WhatsApp. Para ligar, use o painel ou crie uma campanha com os seus leads." },
];

const comparison = [
  ["Preço", "Normalmente por minuto", "Grátis no momento"],
  ["Número", "Muitas vezes um número novo", "O seu número de WhatsApp"],
  ["Para quem liga", "Qualquer telefone", "Quem tem WhatsApp"],
  ["Mensagens", "Outra ferramenta", "Chatbot com IA incluído"],
  ["Configuração", "Muitas vezes operadora e integração", "Escanear um QR Code"],
];

const faqs = [
  { q: "Existe ligação com IA grátis?", a: "Sim. O Wapzen está gratuito no momento, incluindo o agente de voz com IA que atende e faz ligações pelo WhatsApp, sem cobrança por minuto." },
  { q: "A IA liga para números de telefone comuns?", a: "Não. O Wapzen faz e atende ligações de WhatsApp. A pessoa do outro lado precisa ter WhatsApp, e você não precisa de linha telefônica nem de operadora." },
  { q: "A IA fala português do Brasil?", a: "Sim. Defina o idioma do agente como português (Brasil) e escolha uma voz que fale o idioma. Você também pode usar espanhol, inglês e dezenas de outros idiomas." },
  { q: "Posso usar como secretária virtual?", a: "Sim. Atribua o agente de voz ao seu número e ele atende todas as ligações de WhatsApp, tira dúvidas com a sua base de conhecimento e salva a transcrição para a sua equipe." },
  { q: "Funciona como SDR para qualificar leads?", a: "Sim. Crie uma campanha, adicione os leads e a IA liga para cada um pelo WhatsApp, faz as perguntas de qualificação que você definir e registra as respostas. O seu CRM também pode enviar leads automaticamente pela API do Wapzen." },
  { q: "Preciso de conta na OpenAI ou na ElevenLabs?", a: "Não. O reconhecimento de fala, os modelos de IA e as vozes já estão incluídos no Wapzen." },
];

export default function LigacaoComIaPage() {
  return <MarketingPage
    locale="pt-BR"
    path={path}
    name="Ligação com IA"
    title={title}
    description={description}
    eyebrow="Agente de voz com IA"
    heading={<>Ligação com IA.<br /><span>Pelo WhatsApp, grátis.</span></>}
    lead="Crie um agente de voz com IA que atende as ligações de WhatsApp da sua empresa e liga para os seus leads. Ele conversa em português com voz natural, usa as informações do seu negócio e salva a transcrição de cada chamada."
    perks={["Grátis", "Voz natural em português", "Sem custo por minuto", "Seu número de WhatsApp"]}
    ctaLabel="Criar meu agente de voz grátis"
    secondary={{ href: "#como-fazer", label: "Veja como funciona" }}
    faq={{ heading: <>Ligações com IA.<br /><span>Perguntas frequentes.</span></>, items: faqs }}
    cta={{ heading: <>Sua ligação com IA.<br /><span>No seu número de WhatsApp.</span></>, body: "Crie sua conta grátis, escolha uma voz e deixe a IA atender e fazer as ligações de WhatsApp da sua empresa." }}
  >
    <Section id="recursos" heading={<>Secretária virtual e SDR com IA.<br /><span>Um só agente de voz.</span></>}>
      <Cards items={features} />
    </Section>

    <Section id="como-fazer" heading={<>Como fazer ligações com IA pelo WhatsApp.<br /><span>Cinco passos, sem código.</span></>} intro="O agente de voz do Wapzen funciona nas ligações de WhatsApp: não há linha para contratar nem nada para instalar.">
      <Steps items={steps} />
    </Section>

    <Section id="comparar" heading={<>WhatsApp ou linha telefônica?<br /><span>O que muda.</span></>}>
      <Comparison caption="Ligação com IA por linha telefônica comparada com o Wapzen no WhatsApp" columns={["IA em linha telefônica", "Wapzen no WhatsApp"]} rows={comparison} />
    </Section>
  </MarketingPage>;
}
