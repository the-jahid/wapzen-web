import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Buscas-alvo: "chatbot para delivery", "chatbot whatsapp para delivery", "anota ai",
// "alternativa ao ifood", "robô whatsapp restaurante". Sem versão em inglês. Os
// percentuais do iFood vêm de terceiros (Saipos, jun/2025): confira no Portal do
// Parceiro antes de editar. Preço do Anota AI fica de fora: o site bloqueia leitura e
// não achamos fonte. O que o artigo diz do Wapzen segue o whiskey-bailey-server: lê
// texto e legenda, não áudio; memória de poucos minutos; não escreve primeiro; sem
// pausa por conversa; pedido só no painel. Diálogos e cardápio são ilustrativos.
const href = "/pt-br/blog/chatbot-para-delivery-whatsapp";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "pt-BR", article: { publishedTime: post.published, modifiedTime: post.updated } });

const ifood = [
  ["Comissão", "12% (R$ 12,00)", "23% (R$ 23,00)", "Não tem"],
  ["Pagamento on-line", "3,2% (R$ 3,20)", "3,2% (R$ 3,20)", "A taxa do meio que você usar"],
  ["Quem entrega", "Sua loja", "Entregador do iFood", "Sua loja"],
  ["Sobra antes dos demais custos", "R$ 84,80", "R$ 73,80", "R$ 100,00 menos a taxa do meio de pagamento"],
];

const tasks = [
  ["“Vocês abrem hoje?”", "Responde com o horário e a data de hoje", "Nada"],
  ["“Quanto é a taxa para o meu bairro?”", "Consulta a tabela da base de conhecimento", "Manter a tabela atualizada"],
  ["“Tem meio a meio? Sem cebola?”", "Responde pelo cardápio e monta o pedido", "Conferir antes de produzir"],
  ["“Quero uma grande e um refri”", "Pede o que falta, mostra o resumo e salva depois do sim", "Acompanhar a lista de pedidos"],
  ["“Cadê meu pedido?”", "Sem integração, não sabe. Passa o telefone da loja", "Responder ao cliente"],
  ["“Tenho alergia a amendoim”", "Não garante nada. Passa o telefone da loja", "Responder com a cozinha"],
  ["Reclamação ou reembolso", "Passa o telefone da loja", "Resolver com o cliente"],
];

const limits = [
  ["Áudio", "O agente não ouve áudio e não responde a ele", "Peça “mande por texto” na bio, no status e nos anúncios, e tenha alguém olhando os áudios no pico"],
  ["Comprovante do Pix", "Foto é ignorada: só a legenda é lida", "A equipe confere o pagamento no banco antes de produzir"],
  ["Soma do pedido", "O total é calculado por IA e pode sair errado", "Escreva preços e taxas de forma simples e confira cada total"],
  ["Mudança depois do resumo", "Trocar a quantidade logo após o resumo pode salvar o pedido sem novo resumo", "Confira a conversa antes de produzir"],
  ["Memória", "O agente lembra só dos últimos minutos da conversa", "Quem volta depois recomeça do zero. O histórico fica no painel para a equipe"],
  ["Avisos de saída", "O agente só responde. Não escreve primeiro", "Mande “saiu para entrega” pelo celular ou pelo painel"],
  ["Equipe no mesmo chat", "O agente continua respondendo mesmo se a equipe entrar", "Não existe pausa por conversa. Pausar o agente interrompe todas"],
  ["Cozinha", "O pedido fica na lista do painel. Não vai para impressora nem PDV", "Deixe o painel aberto em uma tela ou conecte seu sistema por API"],
];

const tools = [
  ["Como o cliente pede", "Monta o pedido em uma página", "Robô no WhatsApp e cardápio digital", "Conversa por texto com um agente de IA"],
  ["Perguntas soltas", "Não responde", "Confirme na demonstração", "Responde com o que está na base de conhecimento"],
  ["Gestão de pedidos", "Depende do sistema", "Faz parte do produto", "Lista no painel e exportação em CSV"],
  ["Conexão com o iFood", "Depende do sistema", "Empresa do iFood desde 2022", "Nenhuma"],
  ["Preço", "Varia por fornecedor", "Consulte a Anota AI", "Grátis para começar, com limite de uso. Plano pago para volumes maiores"],
];

const faqs = [
  { q: "Qual é o melhor chatbot para delivery?", a: "Depende de como os pedidos chegam. Se você precisa de cardápio digital, gestão de pedidos e operação de alto volume, um sistema feito para restaurantes, como o Anota AI, tende a encaixar melhor. Se a maior parte dos pedidos já chega como conversa de texto no WhatsApp e você quer um agente que entenda frases soltas, vale testar um agente de IA como o Wapzen." },
  { q: "Existe chatbot para delivery grátis?", a: "O Wapzen é grátis para começar e não pede cartão de crédito. O início grátis tem limite de uso e volumes maiores pedem um plano pago. Quando o limite acaba, o agente para de responder, então a equipe precisa continuar olhando o WhatsApp." },
  { q: "O robô do WhatsApp é uma alternativa ao iFood?", a: "Não para conseguir clientes novos: o iFood tem a vitrine, e o WhatsApp não. O robô faz sentido para quem já conhece seu restaurante, porque um pedido direto não paga a comissão de 12% a 23% do iFood. O caminho mais realista é usar os dois." },
  { q: "O chatbot para delivery entende áudio?", a: "O agente do Wapzen não: ele lê mensagens de texto e legendas de foto ou vídeo. Quem manda áudio não recebe resposta. Avise que os pedidos são por texto e mantenha alguém olhando os áudios no horário de pico." },
  { q: "Dá para receber Pix pelo chatbot?", a: "O agente pode enviar a chave Pix que estiver nas instruções, mas não processa pagamentos nem confirma se o Pix caiu. Ele também não enxerga o comprovante enviado por foto. A equipe confere o recebimento." },
  { q: "O pedido vai direto para a cozinha?", a: "No Wapzen, não. O pedido fica na lista de pedidos do painel, que também exporta em CSV. Para mandar a outro sistema, é preciso conectar uma ferramenta de API, e uma ferramenta de API não roda em toda mensagem que deveria acioná-la." },
  { q: "Preciso da API oficial do WhatsApp?", a: "Para o Wapzen, não: ele conecta o número por QR Code ou código de pareamento, como um dispositivo vinculado. Essa conexão não é a API oficial, então avalie as condições de uso do WhatsApp e o risco de restrição antes de usar o número principal da loja." },
];

const sources = [
  { label: "Bloomberg Línea: iFood adquire empresas de gestão (dados do Anota AI)", href: "https://www.bloomberglinea.com.br/negocios/ifood-adquire-tres-empresas-de-gestao-e-avanca-pelo-salao-dos-restaurantes/" },
  { label: "Startups: iFood compra a Anota AI para atender pelo WhatsApp", href: "https://startups.com.br/noticias/exclusivo-ifood-compra-a-anota-ai-para-oferecer-atendimento-pelo-whatsapp/" },
  { label: "Saipos: planos iFood, comissões e taxas", href: "https://saipos.com/integracoes/ifood/planos-ifood" },
  { label: "Sebrae: Pulso dos Pequenos Negócios, WhatsApp nas vendas", href: "https://agenciasebrae.com.br/dados/whatsapp-se-consolida-nas-vendas-on-line-enquanto-facebook-e-lojas-proprias-perdem-folego/" },
  { label: "WhatsApp Business: política de mensagens", href: "https://whatsappbusiness.com/policy/" },
  { label: "Central de Ajuda do WhatsApp: conectar um dispositivo", href: "https://faq.whatsapp.com/1317564962315842" },
  { label: "ANPD: perguntas frequentes sobre a LGPD", href: "https://www.gov.br/anpd/pt-br/acesso-a-informacao/perguntas-frequentes/perguntas-frequentes" },
];

const sections = [
  {
    id: "por-que",
    title: "Por que restaurantes pagam por um robô de WhatsApp?",
    body: <>
      <p>Um chatbot para delivery é um atendente automático ligado ao WhatsApp do restaurante. Ele responde sobre cardápio, taxa e horário, monta o pedido na conversa e deixa tudo organizado para a equipe. Restaurantes pagam por isso por dois motivos: os pedidos chegam todos juntos no pico, e cada pedido feito direto no WhatsApp escapa da comissão do marketplace.</p>
      <p>O canal já existe. Segundo o Sebrae, o WhatsApp é o principal canal de comunicação e de vendas de 82% dos MEIs e das micro e pequenas empresas brasileiras (Pulso dos Pequenos Negócios, fevereiro e março de 2026).</p>
      <p>E existe gente pagando. Em 2022 o iFood comprou o Anota AI, startup que oferece um robô de WhatsApp para restaurantes. Segundo a Bloomberg Línea, de lá até abril de 2025 o Anota AI saltou de 3.000 para 70.000 restaurantes cadastrados, com receita cinco vezes maior. Poucas categorias de automação no Brasil têm uma prova tão clara de demanda.</p>
    </>,
  },
  {
    id: "conta",
    title: "Quanto custa um pedido de R$ 100 no iFood e no WhatsApp?",
    body: <>
      <p>A conta abaixo usa os percentuais publicados pela Saipos em junho de 2025. São valores de terceiros: confira os do seu contrato no Portal do Parceiro.</p>
      <Comparison caption="Quanto sobra de um pedido de R$ 100 no iFood e no WhatsApp direto" columns={["iFood Plano Básico", "iFood Plano Entrega", "WhatsApp direto"]} rows={ifood} />
      <p>A mesma fonte cita mensalidade de R$ 110 no Básico e R$ 150 no Entrega para quem fatura mais de R$ 1.800 por mês no iFood. Outras fontes citam valores menores, então use o número do seu contrato.</p>
      <p>Essa diferença não é lucro limpo. No pedido direto, o motoboy, a embalagem e o atendimento são por sua conta. E o iFood traz clientes novos, o que o seu WhatsApp não faz sozinho.</p>
      <p>A conta boa é outra: <strong>levar para o WhatsApp o cliente que já conhece você</strong>. Se o atendimento direto é lento no sábado à noite, ele volta para o aplicativo. Se é rápido, a comissão economizada paga a ferramenta. Antes de divulgar seu WhatsApp nas embalagens dos pedidos do iFood, leia as regras do contrato da plataforma.</p>
    </>,
  },
  {
    id: "exemplo",
    title: "Como é um pedido feito com um agente de IA",
    body: <>
      <Note>Diálogo ilustrativo, com cardápio, preços e bairro inventados. Um agente só responde bem com as informações do seu restaurante.</Note>
      <p><strong>Cliente:</strong> “Boa noite, tem pizza meio a meio?”</p>
      <p><strong>Agente:</strong> “Boa noite! Tem sim, e vale o preço do sabor mais caro. Quais sabores você quer?”</p>
      <p><strong>Cliente:</strong> “Calabresa e frango com catupiry, grande, sem cebola. Entrega no Jardim das Flores?”</p>
      <p><strong>Agente:</strong> “Entregamos, a taxa é R$ 8,00. A pizza grande sai por R$ 62,00, total de R$ 70,00. Qual é o seu nome e o endereço com número?”</p>
      <p><strong>Cliente:</strong> “Marina, rua das Acácias 120, casa azul”</p>
      <p><strong>Agente:</strong> “Obrigado, Marina. Vai pagar com Pix, cartão na entrega ou dinheiro?”</p>
      <p><strong>Cliente:</strong> “Pix”</p>
      <p><strong>Agente:</strong> “Confere: 1 pizza grande meio calabresa sem cebola, meio frango com catupiry. Entrega na rua das Acácias, 120, casa azul. Total de R$ 70,00 no Pix. Posso fazer o pedido?”</p>
      <p><strong>Cliente:</strong> “pode”</p>
      <p><strong>Agente:</strong> “Pedido nº 1024 feito! A chave Pix é [sua chave]. Se precisar falar com a loja, ligue para [telefone].”</p>
      <p>Um cardápio de botões teria travado em “sem cebola”. É aí que a IA ajuda: o cliente escreve do jeito dele. Veja o que automatizar e o que deixar com a equipe:</p>
      <Comparison caption="O que o agente faz e o que fica com a equipe em cada mensagem" columns={["O que o agente faz", "O que fica com a equipe"]} rows={tasks} />
    </>,
  },
  {
    id: "configurar",
    title: "Como configurar o chatbot do seu delivery em 5 passos",
    body: <>
      <p>O <Link href="/pt-br/chatbot-whatsapp-com-ia">Wapzen</Link> é uma plataforma sem código para criar agentes de IA no WhatsApp. O painel é em inglês, mas o agente responde em português se você pedir isso nas instruções.</p>
      <h3>1. Crie o agente e escreva as instruções</h3>
      <p>Crie a conta e um agente de chat. Você pode começar com este texto:</p>
      <blockquote>“Você é o atendente virtual da [nome do restaurante]. Responda em português do Brasil, em mensagens curtas e simpáticas. Use apenas o cardápio, os preços e as taxas da base de conhecimento. Nunca invente sabor, preço, prazo ou promoção. Pergunte um dado de cada vez. Se perguntarem sobre alergia, reclamação, reembolso ou andamento do pedido, não responda por conta própria: passe o telefone [telefone]. Diga que é um assistente virtual se perguntarem.”</blockquote>
      <h3>2. Coloque o cardápio na base de conhecimento</h3>
      <p>Adicione texto, PDF ou Word com cada item, tamanho e preço, a tabela de taxa por bairro, os horários e as formas de pagamento. Texto simples funciona melhor que a foto do cardápio transformada em PDF. Mudou um preço? Atualize aqui, senão o agente continua informando o antigo.</p>
      <h3>3. Ative a ferramenta Take Order</h3>
      <p>A Take Order é a ferramenta de pedidos do Wapzen. Escolha os campos: nome, itens, endereço, ponto de referência, forma de pagamento e troco. O número do WhatsApp do cliente entra sozinho. O pedido só é salvo depois que o cliente concorda com o resumo.</p>
      <h3>4. Conecte o número</h3>
      <p>Conecte um número pessoal ou do WhatsApp Business por QR Code ou código de pareamento, como ao vincular um dispositivo.</p>
      <h3>5. Faça 20 pedidos de teste</h3>
      <p>Teste como cliente de verdade: meio a meio, item fora do cardápio, bairro fora da área, troca de sabor, pergunta sobre alergia. Depois confira na lista se o pedido salvo bate com a conversa. Só então coloque o agente no ar, de preferência em um dia calmo.</p>
      <InlineCta title="Teste com o seu cardápio" body="Crie o agente, adicione o cardápio e faça você mesmo um pedido pelo WhatsApp. É grátis para começar." label="Comece grátis" />
    </>,
  },
  {
    id: "limites",
    title: "O que o chatbot não faz e como contornar",
    body: <>
      <p>Esta tabela é sobre o Wapzen. Ela importa mais que qualquer lista de vantagens, porque no sábado à noite são esses detalhes que viram cliente irritado.</p>
      <Comparison caption="Limites do agente do Wapzen em um delivery e como contornar" columns={["O que acontece", "Como contornar"]} rows={limits} />
      <p>Por isso, a equipe precisa conferir cada pedido antes de produzir. O agente tira o trabalho repetitivo, não a responsabilidade. Quando o limite de uso do início grátis acaba, ele para de responder, e o cliente fica sem retorno até a equipe assumir.</p>
    </>,
  },
  {
    id: "comparar",
    title: "Wapzen, Anota AI ou cardápio digital?",
    body: <>
      <p>São ferramentas para momentos diferentes da operação. Consultamos as fontes abaixo, mas o site do Anota AI bloqueia leitura automática, então confirme recursos e preços diretamente com a empresa.</p>
      <Comparison caption="Cardápio digital, Anota AI e Wapzen comparados para delivery" columns={["Cardápio digital", "Anota AI", "Wapzen"]} rows={tools} />
      <Choose locale="pt-BR" highlight="Wapzen" items={[
        { name: "um sistema para restaurantes", points: ["Você recebe muitos pedidos por dia", "Precisa de impressão, PDV ou gestão de entregas", "Quer tudo em um fornecedor só"] },
        { name: "Wapzen", points: ["Os pedidos já chegam como texto no WhatsApp", "Os clientes fazem muitas perguntas fora do script", "Você quer testar sem assinatura e sem programar"] },
      ]} />
      <p>Nada impede usar os dois: o agente responde as perguntas e manda o link do cardápio digital para quem prefere montar o pedido sozinho. Só não ligue dois robôs no mesmo número, ou os dois vão responder ao cliente.</p>
    </>,
  },
  {
    id: "numero",
    title: "Posso usar o número principal do restaurante?",
    body: <>
      <p>Pode, mas decida sabendo do risco. O Wapzen funciona como um dispositivo vinculado, não pela API oficial da Meta. Por isso, não há custo por mensagem da Meta, mas também não há garantia contra restrição ou queda da conta. O Wapzen é um produto independente, não é da Meta nem do WhatsApp.</p>
      <p>Se o WhatsApp é a principal fonte de pedidos, teste primeiro em um segundo número. Para quem precisa da API oficial, os valores no Brasil estão no nosso guia <Link href="/pt-br/blog/whatsapp-business-e-pago">WhatsApp Business é pago?</Link>.</p>
      <p>Nome, telefone e endereço são dados pessoais pela LGPD. Peça só o necessário para entregar o pedido e não use esses dados para outros fins sem base legal. A política do WhatsApp Business também exige um caminho claro até a equipe, como um telefone, quando o atendimento é automatizado.</p>
    </>,
  },
];

export default function ChatbotParaDeliveryWhatsAppPage() {
  return <BlogPost
    href={href}
    heading={<>Chatbot para delivery no WhatsApp.<br /><span>Como anotar pedidos com IA no pico da noite.</span></>}
    lead="São 20h40 de sexta. A cozinha está cheia, o WhatsApp acumula conversas e alguém pergunta pela terceira vez se a pizza pode vir sem cebola. Um chatbot para delivery responde essas mensagens, monta o pedido e entrega tudo organizado para a equipe conferir. Veja a conta, a configuração e o que ele ainda não resolve."
    summary={{
      title: "Resumo",
      items: [
        <><strong>O que é:</strong> um agente de IA no WhatsApp do restaurante que responde sobre o cardápio, monta o pedido por texto e salva os dados para a equipe.</>,
        <><strong>Por que vale pagar:</strong> no iFood, a comissão vai de 12% a 23%, mais 3,2% no pagamento on-line. Um pedido direto no WhatsApp não paga essa comissão.</>,
        <><strong>Quem já compra:</strong> o Anota AI, comprado pelo iFood em 2022, chegou a 70.000 restaurantes cadastrados.</>,
        <><strong>Limite principal:</strong> o agente do Wapzen lê texto, não áudio. Quem manda áudio fica sem resposta.</>,
        <><strong>Como testar:</strong> o Wapzen é grátis para começar, com limite de uso, e não exige programação.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/pt-br/blog/como-criar-robo-whatsapp", "/pt-br/blog/whatsapp-business-e-pago"]}
    product="/pt-br/chatbot-whatsapp-com-ia"
    cta={{ heading: <>Seu cardápio, respondendo no WhatsApp.<br /><span>Teste antes do próximo sábado.</span></>, body: "Crie um agente de IA, adicione o cardápio e conecte o seu número. É grátis para começar." }}
  />;
}
