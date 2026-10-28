import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Buscas-alvo: "whatsapp business é pago ou gratuito" (36, 3/3), "whatsapp
// business é pago" (33, 3/3), "whatsapp business pago" (30, 3/3), "…pago como
// funciona" (27), "preço mensagem whatsapp api oficial" (29), "lista de
// transmissão whatsapp business é pago" (16), autocomplete BR 2026-10-28.
// Valores: tabela da Meta em reais (marketing R$ 0,3217; utilidade,
// autenticação e serviço R$ 0,035), em vigor em outubro de 2026 (várias
// reimpressões concordam); Meta One pelo anúncio da Meta de 15/09/2026. A Meta
// muda preços a cada trimestre (1º jan/abr/jul/out): revise tabela e exemplos e
// atualize `updated`. Versão em inglês: /blog/whatsapp-business-api-pricing.
const href = "/pt-br/blog/whatsapp-business-e-pago";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "pt-BR", article: { publishedTime: post.published, modifiedTime: post.updated } });

const whatCosts = [
  ["App WhatsApp Business", "Grátis", "Perfil, catálogo, mensagens automáticas, etiquetas, conversas e chamadas"],
  ["Lista de transmissão comum", "Grátis", "Até 256 contatos por lista; só recebe quem salvou o seu número"],
  ["Transmissão comercial", "R$ 0,3217 por mensagem entregue", "Chega também a quem não salvou o seu número e mostra quantos leram"],
  ["Meta One (planos para empresas)", "A partir de R$ 59 por mês", "Selo de verificação, proteção contra falsificação e, nos planos maiores, créditos de transmissão"],
  ["API oficial do WhatsApp", "Por mensagem, mais o plano do fornecedor", "Para disparos em escala, equipes grandes e integrações"],
];

const metaOne = [
  ["Essencial", "A partir de R$ 59", "Selo de verificação, canal verificado, proteção contra falsificação, mais acesso ao agente de IA da Meta"],
  ["Avançado", "A partir de R$ 199", "Mais dispositivos conectados, créditos de transmissão, acesso de equipe sem compartilhar senha"],
  ["Expert", "A partir de R$ 599", "Mais capacidade do agente de IA da Meta"],
  ["Máximo", "A partir de R$ 1.999", "A maior capacidade, para operações grandes"],
];

const categories = [
  ["O que é", "Ofertas, promoções, convites para voltar", "Confirmações, entregas, lembretes", "Códigos de verificação", "Respostas livres a um cliente"],
  ["Precisa de modelo aprovado", "Sim", "Sim", "Sim", "Não"],
  ["Quando pode enviar", "Sempre, para quem deu permissão", "Sempre, para quem deu permissão", "Sempre", "Só até 24 horas depois da última mensagem do cliente"],
  ["É cobrada", "Cada mensagem entregue", "Cada mensagem entregue", "Cada mensagem entregue", "Depois de 1.000 por mês por número"],
];

const rates = [
  ["Marketing", "R$ 0,3217"],
  ["Utilidade", "R$ 0,035"],
  ["Autenticação", "R$ 0,035"],
  ["Serviço", "Grátis nas primeiras 1.000 do mês por número, depois R$ 0,035"],
];

const faqs = [
  { q: "O WhatsApp Business é pago ou gratuito?", a: "O app WhatsApp Business é gratuito: baixar, usar, conversar e ligar para clientes não custa nada. São pagos à parte a transmissão comercial (R$ 0,3217 por mensagem entregue), os planos Meta One para empresas (a partir de R$ 59 por mês) e a API oficial do WhatsApp, que a Meta cobra por mensagem." },
  { q: "A lista de transmissão do WhatsApp Business é paga?", a: "A lista de transmissão comum continua grátis: até 256 contatos por lista, e só recebe quem salvou o seu número. A cobrança vale para a transmissão comercial, que chega também a quem não salvou o seu número e custa R$ 0,3217 por mensagem entregue, antes dos impostos." },
  { q: "Quanto custa uma mensagem na API oficial do WhatsApp?", a: "Na tabela da Meta em reais, em vigor em outubro de 2026: R$ 0,3217 por mensagem de marketing e R$ 0,035 por mensagem de utilidade, autenticação ou serviço, antes dos impostos e da taxa do fornecedor. As respostas a clientes são grátis até 1.000 por mês por número." },
  { q: "O que é o Meta One e preciso dele?", a: "É a assinatura da Meta lançada em setembro de 2026. Para empresas, os planos vão de R$ 59 a R$ 1.999 por mês e incluem selo de verificação, proteção contra falsificação, créditos de transmissão (a partir do Avançado) e mais respostas do agente de IA da Meta. Não é obrigatório: o WhatsApp Business funciona sem ele." },
  { q: "As mensagens que os clientes me mandam são cobradas?", a: "Não. A Meta não cobra as mensagens que os clientes enviam para a empresa, nem no app nem na API." },
  { q: "Existe um jeito grátis de responder clientes com IA no WhatsApp?", a: "Sim. A Wapzen conecta o seu número com um QR Code, como o WhatsApp Web, e deixa uma IA responder as mensagens que chegam, sem tarifa da Meta por mensagem. Por enquanto é grátis. Ela não faz disparos em massa: para campanhas para milhares de contatos, a API oficial continua sendo o caminho." },
];

const sources = [
  { label: "Meta: preços da WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Meta: apresentando o Meta One (set. 2026)", href: "https://about.fb.com/br/news/2026/09/apresentando-o-meta-one-um-servico-de-assinatura-com-mais-recursos-e-ia-para-criar-se-conectar-e-se-destacar/" },
  { label: "Central de Ajuda do WhatsApp: preços das transmissões comerciais", href: "https://faq.whatsapp.com/1356785542323967" },
  { label: "Reimpressão da tabela em reais: ChatSac (out. 2026)", href: "https://chatsac.com/blog/quanto-custa-api-oficial-whatsapp/" },
  { label: "Transmissão comercial no Brasil: Certu (out. 2026)", href: "https://certu.com.br/blog/ia/lista-de-transmissao-whatsapp-business-paga" },
];

const sections = [
  {
    id: "resposta-curta",
    title: "WhatsApp Business é pago? A resposta curta",
    body: <>
      <p><strong>O app WhatsApp Business é gratuito</strong>, como o WhatsApp normal: você baixa, cadastra o número e atende seus clientes sem pagar nada. O que gera tanta dúvida é que, de 2025 para cá, a Meta passou a cobrar por <strong>alguns recursos extras</strong> dentro e fora do app. Este é o mapa do que é grátis e do que é pago:</p>
      <Comparison caption="O que é grátis e o que é pago no WhatsApp Business em 2026" columns={["Preço", "O que é"]} rows={whatCosts} />
      <p>Se você só conversa com clientes, usa o catálogo e as mensagens automáticas, a sua conta continua em zero.</p>
    </>,
  },
  {
    id: "transmissao",
    title: "Lista de transmissão comum x transmissão comercial",
    body: <>
      <p>É aqui que mora a confusão do “WhatsApp Business pago”. Existem duas formas de mandar a mesma mensagem para muita gente pelo app:</p>
      <ul>
        <li><strong>Lista de transmissão comum: grátis.</strong> Até 256 contatos por lista, e a mensagem só chega para quem tem o seu número salvo na agenda. Quem não salvou não recebe, e você não é avisado.</li>
        <li><strong>Transmissão comercial: paga.</strong> Chega também a quem não salvou o seu número e mostra quantas pessoas leram e responderam. No Brasil custa <strong>R$ 0,3217 por mensagem entregue</strong>, antes dos impostos, o mesmo valor de uma mensagem de marketing na API. O pagamento é feito pelo próprio app.</li>
      </ul>
      <p>Mil mensagens de transmissão comercial custam cerca de <strong>R$ 321,70</strong>. Vale para promoções pontuais; para falar com clientes que já te conhecem, a lista comum, o status e os canais continuam grátis.</p>
      <Note>Mande transmissões só para quem pediu para receber. Se muita gente bloqueia ou denuncia o seu número, o WhatsApp pode restringir a sua conta, com ou sem pagamento.</Note>
    </>,
  },
  {
    id: "meta-one",
    title: "Meta One: o selo verificado e os planos pagos",
    body: <>
      <p>Em setembro de 2026 a Meta lançou o <strong>Meta One</strong>, uma assinatura com planos para pessoas e para empresas. Os planos para empresas reúnem o que antes se procurava como “selo verificado do WhatsApp Business”:</p>
      <Comparison caption="Planos Meta One para empresas e o que incluem no WhatsApp" columns={["Preço por mês", "O que inclui"]} rows={metaOne} />
      <p>Ninguém é obrigado a assinar: o WhatsApp Business funciona igual sem o Meta One. Ele faz sentido para marcas que sofrem com perfis falsos ou que mandam muitas transmissões comerciais todo mês.</p>
    </>,
  },
  {
    id: "api",
    title: "API oficial do WhatsApp: como a Meta cobra",
    body: <>
      <p>A <strong>API oficial</strong>, que a Meta chama de WhatsApp Business Platform, não é um app: é o acesso para sistemas, chatbots e plataformas de atendimento. Desde 1º de julho de 2025 a Meta cobra <strong>por mensagem entregue</strong>, de acordo com a categoria e o DDI de quem recebe. Para números brasileiros (+55), vale a tabela do Brasil. As mensagens que os clientes mandam são grátis.</p>
      <Comparison caption="As quatro categorias de mensagem da API oficial do WhatsApp" columns={["Marketing", "Utilidade", "Autenticação", "Serviço"]} rows={categories} />
      <p>Os valores da tabela da Meta em reais, em vigor em outubro de 2026, por mensagem entregue, antes dos impostos e da taxa do fornecedor:</p>
      <Comparison caption="Preço por mensagem da API oficial do WhatsApp no Brasil em outubro de 2026" columns={["Preço por mensagem"]} rows={rates} />
      <p>Desde <strong>1º de outubro de 2026</strong>, as respostas aos clientes, que eram grátis, passaram a ser cobradas depois de 1.000 por mês por número, e os modelos de utilidade enviados dentro da janela de 24 horas também. Utilidade e autenticação têm descontos por volume; marketing e serviço, não.</p>
      <Note>A Meta revisa os preços a cada trimestre (1º de janeiro, abril, julho e outubro). Confira a tabela oficial antes de fechar um orçamento e lembre que o fornecedor pode cobrar mais que a Meta.</Note>
    </>,
  },
  {
    id: "exemplos",
    title: "Quanto se paga de verdade: três exemplos no Brasil",
    body: <>
      <p>Três empresas típicas na API oficial, com a tabela em reais, contando só o que a Meta cobra:</p>
      <h3>Uma loja virtual de roupas em São Paulo</h3>
      <ul>
        <li>2.000 conversas com umas 4 respostas cada: 8.000 mensagens de serviço, 7.000 acima das grátis × R$ 0,035 = <strong>R$ 245,00</strong></li>
        <li>1.500 avisos de envio (utilidade) × R$ 0,035 = <strong>R$ 52,50</strong></li>
        <li>Duas promoções para 2.000 clientes: 4.000 mensagens de marketing × R$ 0,3217 = <strong>R$ 1.286,80</strong></li>
      </ul>
      <p>Cerca de <strong>R$ 1.584 por mês</strong> mais impostos, antes do plano do fornecedor.</p>
      <h3>Uma clínica odontológica em Belo Horizonte</h3>
      <ul>
        <li>600 conversas × 5 respostas: 3.000 mensagens, 2.000 pagas × R$ 0,035 = <strong>R$ 70,00</strong></li>
        <li>1.000 lembretes de consulta (utilidade) × R$ 0,035 = <strong>R$ 35,00</strong></li>
      </ul>
      <p>Cerca de <strong>R$ 105 por mês</strong>. Aqui o plano do fornecedor costuma pesar mais que a Meta.</p>
      <h3>Uma pizzaria em Recife</h3>
      <ul>
        <li>900 conversas de pedido × 3 respostas: 2.700 mensagens, 1.700 pagas × R$ 0,035 = <strong>R$ 59,50</strong></li>
        <li>400 confirmações de pedido (utilidade) × R$ 0,035 = <strong>R$ 14,00</strong></li>
      </ul>
      <p>Cerca de <strong>R$ 73,50 por mês</strong>. No app WhatsApp Business grátis, as mesmas conversas custariam zero, mas seriam respondidas à mão.</p>
      <p>Por cima disso vem o fornecedor (BSP), como Blip, Zenvia ou Umbler Talk, com plano mensal e às vezes taxa por mensagem.</p>
    </>,
  },
  {
    id: "economizar",
    title: "Como pagar menos (ou nada) para atender clientes",
    body: <>
      <ul>
        <li><strong>Use a lista de transmissão comum</strong> para quem já salvou o seu número, e deixe a transmissão comercial para promoções que valem o custo.</li>
        <li><strong>Responda em uma mensagem, não em três.</strong> Na API, cada resposta acima das grátis é cobrada.</li>
        <li><strong>Não contrate a API se você não faz disparos em escala.</strong> Se o trabalho é responder quem te procura, o app grátis basta. O problema é o tempo, não o custo.</li>
        <li><strong>Automatize no app, não na API.</strong> Um agente com IA conectado ao número por QR Code responde sem tarifa da Meta por mensagem.</li>
      </ul>
      <InlineCta title="Respostas com IA sem tarifa por mensagem" body="A Wapzen conecta seu número com um QR Code e responde seus clientes com as informações da sua empresa, 24 horas por dia. Grátis por enquanto." label="Comece grátis" />
      <p>A Wapzen não é um produto oficial da Meta: ela se conecta como um dispositivo, igual ao WhatsApp Web, e não faz disparos em massa. Veja <Link href="/pt-br/blog/como-criar-robo-whatsapp">como criar um robô no WhatsApp</Link> ou, se você ainda usa o WhatsApp normal, a <Link href="/pt-br/blog/diferenca-whatsapp-e-whatsapp-business">diferença entre WhatsApp e WhatsApp Business</Link>.</p>
    </>,
  },
];

export default function WhatsAppBusinessEPagoPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp Business é pago?<br /><span>O que é grátis e o que custa.</span></>}
    lead="O app WhatsApp Business é grátis, mas a transmissão comercial, o Meta One e a API oficial não são. Veja o que custa cada um em 2026, com a tabela da Meta em reais, o que mudou em 1º de outubro e três exemplos de conta mensal."
    summary={{
      title: "Resumo",
      items: [
        <><strong>O app WhatsApp Business é grátis</strong>, assim como a lista de transmissão comum para até 256 contatos.</>,
        <><strong>A transmissão comercial é paga:</strong> R$ 0,3217 por mensagem entregue no Brasil.</>,
        <><strong>O Meta One</strong>, com o selo de verificação, começa em R$ 59 por mês e é opcional.</>,
        <><strong>A API oficial cobra por mensagem:</strong> R$ 0,3217 marketing e R$ 0,035 utilidade, autenticação e serviço (serviço grátis até 1.000 por mês).</>,
        <><strong>Para responder com IA</strong> sem tarifa por mensagem, dá para conectar um agente ao seu número com um QR Code.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/pt-br/blog/diferenca-whatsapp-e-whatsapp-business", "/pt-br/blog/como-criar-robo-whatsapp"]}
    product="/pt-br/chatbot-whatsapp-com-ia"
    cta={{ heading: <>Atenda seus clientes com IA.<br /><span>Sem tarifa por mensagem.</span></>, body: "Crie seu agente, ensine como funciona a sua empresa e conecte o seu número de WhatsApp com um QR Code." }}
  />;
}
