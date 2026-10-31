import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Steps } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Buscas-alvo: "como criar um robô no whatsapp" (30, 3/3), "como fazer chatbot
// no whatsapp" (30, 3/3), "bot whatsapp" (30, 3/3), "robô para whatsapp" (29,
// 3/3), "robô para whatsapp gratuito" (29), "chatbot whatsapp gratuito" (28),
// "robô whatsapp business" (19), autocomplete BR 2026-10-28. "chatbot whatsapp
// com ia" fica com /pt-br/chatbot-whatsapp-com-ia, para onde este artigo
// aponta. Versão em inglês: /blog/what-is-a-whatsapp-chatbot.
const href = "/pt-br/blog/como-criar-robo-whatsapp";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "pt-BR", article: { publishedTime: post.published, modifiedTime: post.updated } });

const kinds = [
  ["Como responde", "O mesmo texto fixo para todos", "Menu de botões e caminhos fixos", "Entende a pergunta e responde com as suas informações"],
  ["Pergunta fora do roteiro", "Não atende", "Volta ao menu ou passa para um atendente", "Responde, ou passa para uma pessoa"],
  ["Onde se configura", "App WhatsApp Business", "Plataforma com a API", "Plataforma de IA"],
  ["Custo típico", "Grátis", "Plano mensal + tarifas da Meta", "De grátis a plano + tarifas da Meta"],
];

const ways = [
  ["O que precisa", "Conta Meta, número na API e um fornecedor", "Servidor, n8n ou código, chave de IA e uma conexão com o WhatsApp", "Uma conta e um QR Code"],
  ["Tempo para ativar", "De algumas horas a alguns dias, mais a aprovação dos modelos", "Dias de trabalho técnico", "Uns 15 minutos"],
  ["Custo", "Plano do fornecedor + tarifas da Meta", "Hospedagem + IA (+ tarifas da Meta, se usar a API)", "Grátis por enquanto"],
  ["Tipo de robô", "Menus e fluxos; IA muitas vezes cobrada à parte", "O que você construir", "IA com as suas informações"],
  ["Disparos em massa", "Sim", "Depende", "Não"],
  ["Oficial da Meta", "Sim", "Só com a API oficial", "Não, conecta como o WhatsApp Web"],
];

const steps = [
  { title: "Crie uma conta grátis", body: "Cadastre-se na Wapzen. Não precisa de cartão de crédito, conta na Meta nem API oficial." },
  { title: "Crie um agente de chat", body: "Dê um nome e escreva as instruções: quem ele é, que tom usa, o que pode responder e quando passar a conversa para uma pessoa. Escolha um modelo GPT, da OpenAI, ou Claude, da Anthropic." },
  { title: "Adicione uma base de conhecimento", body: "Cole perguntas frequentes, preços, horários e políticas, ou envie arquivos PDF e Word. A IA responde a partir daí." },
  { title: "Conecte o seu WhatsApp", body: "Leia o QR Code com o celular, como no WhatsApp Web. Funciona com o WhatsApp Business ou com o WhatsApp normal." },
  { title: "Teste e ajuste", body: "Mande mensagem para o seu número de outro celular e faça as perguntas dos seus clientes. Se uma resposta não ficar boa, ajuste as instruções ou a base de conhecimento." },
];

const faqs = [
  { q: "Como criar um robô no WhatsApp?", a: "Existem três caminhos: uma plataforma que usa a API oficial do WhatsApp (como Blip, Zenvia ou Umbler Talk), um robô feito por você com n8n ou código, ou uma IA conectada ao seu número com um QR Code, como a Wapzen. O último é o mais rápido: uns 15 minutos, sem programar." },
  { q: "Existe robô para WhatsApp grátis?", a: "Sim. A Wapzen é grátis por enquanto, com robô de IA, base de conhecimento e agente de voz incluídos, sem cartão de crédito. O WhatsApp Business também tem mensagens automáticas grátis, mas são textos fixos que não respondem perguntas." },
  { q: "Preciso da API oficial para ter um robô no WhatsApp?", a: "Não. A API oficial serve para disparos em escala, equipes grandes e integrações. Para uma IA responder quem manda mensagem para você, dá para conectar o número como dispositivo, com um QR Code. A Wapzen não é um produto oficial da Meta: se você precisa da plataforma oficial, escolha um fornecedor da API." },
  { q: "O robô responde áudios e grupos?", a: "Depende da plataforma. O agente de chat da Wapzen responde mensagens de texto em conversas individuais: grupos, áudios e fotos ficam com você. Para conversar por voz, existe o agente de voz, que atende as ligações do WhatsApp." },
  { q: "Preciso avisar que é um robô?", a: "É uma boa prática e passa confiança: basta uma linha na primeira mensagem dizendo que quem responde é um assistente virtual e que o cliente pode pedir uma pessoa. Se você guarda dados dos clientes, siga a LGPD e informe isso na sua política de privacidade." },
];

const sources = [
  { label: "Meta: WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/" },
  { label: "Meta: preços da WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Central de Ajuda do WhatsApp: conectar um dispositivo", href: "https://faq.whatsapp.com/1317564962315842" },
];

const sections = [
  {
    id: "o-que-e",
    title: "O que é um robô de WhatsApp",
    body: <>
      <p>Um <strong>robô de WhatsApp</strong>, ou chatbot, é um programa que responde sozinho as mensagens que chegam ao número da sua empresa. O cliente escreve como escreveria para uma pessoa e o robô responde em segundos, também de madrugada, no fim de semana e no feriado.</p>
      <p>Só que com o mesmo nome se vendem três coisas bem diferentes:</p>
      <Comparison caption="Mensagens automáticas, robôs de menu e robôs com IA comparados" columns={["Mensagem automática", "Robô de menu", "Robô com IA"]} rows={kinds} />
      <p>A <Link href="/pt-br/blog/mensagem-de-saudacao-whatsapp-business">mensagem de saudação</Link> do WhatsApp Business não é um robô de verdade: manda sempre o mesmo texto. O robô de menu (“digite 1 para horários, 2 para preços”) funciona enquanto o cliente segue o caminho. Um <strong>robô com IA</strong> entende a pergunta, mesmo escrita com erro ou abreviada, e responde com as suas informações.</p>
    </>,
  },
  {
    id: "como-funciona",
    title: "Como um robô de WhatsApp funciona",
    body: <>
      <p>Por trás de cada resposta acontecem quatro coisas:</p>
      <ol>
        <li><strong>O cliente manda mensagem</strong> para o seu número, como sempre.</li>
        <li><strong>A mensagem chega à plataforma do robô</strong>, pela API oficial do WhatsApp ou pelo número conectado como dispositivo, do mesmo jeito que o WhatsApp Web.</li>
        <li><strong>O robô decide a resposta.</strong> Um robô de menu segue as regras que você montou. Um robô com IA lê a pergunta, procura na sua base de conhecimento e escreve a resposta com um modelo como GPT ou Claude.</li>
        <li><strong>A resposta sai do seu número</strong> e o cliente recebe na mesma conversa. Você vê tudo e pode assumir quando quiser.</li>
      </ol>
      <p>O segundo passo é o que mais muda o custo: com a API oficial você paga por mensagem e quase sempre um fornecedor; com o número conectado por QR Code, não. As contas estão em <Link href="/pt-br/blog/whatsapp-business-e-pago">WhatsApp Business é pago?</Link></p>
    </>,
  },
  {
    id: "tres-caminhos",
    title: "Como criar um robô no WhatsApp: os três caminhos",
    body: <>
      <h3>1. Uma plataforma com a API oficial</h3>
      <p>É o caminho clássico das empresas médias e grandes. Fornecedores como Blip, Zenvia ou Umbler Talk conectam o seu número à API e oferecem um editor de fluxos, uma caixa de entrada para a equipe e disparos. Em troca você precisa de uma conta na Meta, verificar o número, modelos aprovados para iniciar conversas, um plano mensal e as tarifas da Meta por mensagem. A IA, quando existe, muitas vezes é cobrada à parte.</p>
      <h3>2. Um robô feito por você com n8n</h3>
      <p>Quem programa pode montar o próprio robô: com o <strong>n8n</strong> dá para ligar a Cloud API da Meta a um modelo de IA num fluxo visual. Há também APIs e bibliotecas não oficiais que se conectam ao WhatsApp Web. É flexível, mas exige tempo, um servidor sempre ligado e manutenção, e as conexões não oficiais podem parar a cada atualização do WhatsApp.</p>
      <h3>3. Uma IA conectada ao seu número com um QR Code</h3>
      <p>É o caminho mais rápido para uma empresa pequena: sem API, sem programar e sem trocar de número. Você conecta o WhatsApp que já usa, como faria com o WhatsApp Web, e um agente com IA responde as mensagens que chegam. É assim que a Wapzen funciona.</p>
      <Comparison caption="Três formas de criar um robô de WhatsApp comparadas" columns={["Plataforma com API", "Feito por você (n8n)", "IA com QR Code"]} rows={ways} />
    </>,
  },
  {
    id: "passo-a-passo",
    title: "Como criar um robô de WhatsApp grátis em 5 passos",
    body: <>
      <p>Com a Wapzen, o seu robô fica pronto em uns 15 minutos:</p>
      <Steps items={steps} />
      <InlineCta title="Crie o seu robô de WhatsApp" body="Um agente com IA que responde seus clientes com as informações da sua empresa, no seu número de sempre. Grátis por enquanto, sem cartão de crédito." label="Comece grátis" />
      <p>Todas as conversas ficam salvas no painel. Se você pausar o agente, ele para de responder e você volta a atender. Veja todos os recursos do <Link href="/pt-br/chatbot-whatsapp-com-ia">chatbot WhatsApp com IA</Link>.</p>
    </>,
  },
  {
    id: "exemplos",
    title: "Exemplos de robô de WhatsApp por segmento",
    body: <>
      <ul>
        <li><strong>Delivery, pizzarias e restaurantes.</strong> Responde sobre cardápio, taxa de entrega, horários e formas de pagamento, como Pix, e anota os dados do pedido.</li>
        <li><strong>Clínicas e consultórios.</strong> Informa horários, endereço, convênios aceitos e valor da consulta. Não deve dar diagnóstico: oriente o robô a passar para uma pessoa tudo o que for clínico.</li>
        <li><strong>Salões de beleza e barbearias.</strong> Explica serviços e preços e recebe pedidos de horário. Com uma ferramenta de API ligada à agenda, consulta os horários livres e agenda.</li>
        <li><strong>Lojas virtuais.</strong> Responde sobre tamanhos, frete, trocas e parcelamento. Com uma ferramenta de API, consulta o status de um pedido.</li>
        <li><strong>Imobiliárias.</strong> Responde sobre os imóveis, pergunta orçamento e bairro e propõe uma visita.</li>
        <li><strong>Escolas e cursos.</strong> Informa mensalidades, horários, matrículas e documentos, em português ou em inglês, conforme quem escreve.</li>
      </ul>
      <p>Se você trabalha com horário marcado, veja como montar o <Link href="/pt-br/blog/agendamento-pelo-whatsapp">agendamento pelo WhatsApp</Link>.</p>
    </>,
  },
  {
    id: "boas-praticas",
    title: "Limites e boas práticas",
    body: <>
      <ul>
        <li><strong>Diga que é um assistente virtual.</strong> Uma linha na primeira mensagem basta e evita mal-entendidos.</li>
        <li><strong>Deixe uma saída para uma pessoa.</strong> Escreva nas instruções quando o robô deve parar e avisar que alguém da equipe vai responder: reclamações, pagamentos, casos especiais.</li>
        <li><strong>Mantenha as informações atualizadas.</strong> A IA responde com o que você dá: preço antigo vira resposta errada.</li>
        <li><strong>Cuide dos dados pessoais.</strong> Siga a LGPD: informe na política de privacidade que usa um assistente com IA e não peça pelo chat dados de que não precisa.</li>
        <li><strong>Não use para spam.</strong> Um robô responde quem fala com você. Para promoções em massa, você precisa da permissão dos contatos e da API oficial ou da transmissão comercial.</li>
      </ul>
      <Note>O agente de chat da Wapzen responde mensagens de texto em conversas individuais, não em grupos. Áudios, fotos e documentos ficam com você.</Note>
    </>,
  },
];

export default function ComoCriarRoboWhatsAppPage() {
  return <BlogPost
    href={href}
    heading={<>Como criar um robô no WhatsApp.<br /><span>Grátis e com IA.</span></>}
    lead="Um robô no WhatsApp responde seus clientes por você, dia e noite. Veja o que é, como funciona, os três caminhos para criar um robô de WhatsApp, quanto custa e exemplos para delivery, clínicas e lojas virtuais."
    summary={{
      title: "Resumo",
      items: [
        <><strong>Um robô de WhatsApp</strong> responde sozinho as mensagens que chegam ao número da sua empresa.</>,
        <><strong>Existem três tipos:</strong> mensagens automáticas fixas, robôs de menu e robôs com IA que entendem a pergunta.</>,
        <><strong>Dá para criar</strong> com uma plataforma da API (Blip, Zenvia, Umbler Talk), com n8n ou código, ou conectando uma IA ao seu número com um QR Code.</>,
        <><strong>Na API</strong> você paga plano e tarifas da Meta; com uma IA conectada por QR Code, como a Wapzen, hoje dá para fazer de graça.</>,
        <><strong>Avise que é um assistente virtual</strong> e deixe sempre uma saída para uma pessoa.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/pt-br/blog/whatsapp-business-e-pago", "/pt-br/blog/mensagem-de-saudacao-whatsapp-business"]}
    product="/pt-br/chatbot-whatsapp-com-ia"
    cta={{ heading: <>O seu robô de WhatsApp.<br /><span>Pronto em 15 minutos.</span></>, body: "Crie o agente, ensine como funciona a sua empresa e conecte o seu número com um QR Code. Grátis por enquanto." }}
  />;
}
