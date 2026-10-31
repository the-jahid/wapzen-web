import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Samples, Steps } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Buscas-alvo: "mensagem de saudação whatsapp business" (47, 3/3), "mensagem
// automática whatsapp business" (30, 3/3), "mensagem de ausência whatsapp
// business" (30, 3/3), "respostas rápidas whatsapp business" (29), "mensagem de
// boas vindas whatsapp business" (29), "…saudação não funciona" (15),
// autocomplete BR 2026-10-28. O título promete 40 exemplos: welcome + away +
// quick + cada lista de `industries` devem somar 40, diferentes dos de
// /pt-br/resposta-automatica-whatsapp. Versão em inglês:
// /blog/whatsapp-business-greeting-message.
const href = "/pt-br/blog/mensagem-de-saudacao-whatsapp-business";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "pt-BR", article: { publishedTime: post.published, modifiedTime: post.updated } });

type Sample = { title: string; text: string };

const welcome: Sample[] = [
  { title: "Simples e simpática", text: "Oi! 👋 Obrigado por falar com a [Empresa]. Como podemos te ajudar hoje?" },
  { title: "Com o prazo de resposta", text: "Olá, seja bem-vindo(a)! Respondemos em até [1 hora], de segunda a sábado, das [9h] às [18h]. Conta pra gente o que você precisa." },
  { title: "Com opções", text: "Oi! 👋 Pra te atender mais rápido, diz pra gente o que você procura:\n- Preços e informações\n- Fazer um pedido\n- Acompanhar meu pedido\n- Outro assunto" },
  { title: "Toque pessoal", text: "Oi, aqui é a [Nome], da [Empresa]. Que bom que você mandou mensagem! Me conta o que precisa que eu mesma te respondo assim que possível." },
  { title: "Com link", text: "Obrigado pelo contato! Enquanto preparamos a resposta, dá uma olhada nos nossos produtos e preços aqui: [link]" },
  { title: "Formal", text: "Olá! Agradecemos o seu contato com a [Empresa]. Em instantes um de nossos atendentes falará com você." },
  { title: "Em dois idiomas", text: "Oi! 👋 Bem-vindo(a) à [Empresa]. Pode escrever em português ou em inglês.\nHi! Feel free to write to us in English." },
  { title: "Com o catálogo", text: "Oi! Toque no ícone da loja no topo desta conversa para ver o nosso catálogo com preços. Ficou com alguma dúvida sobre um produto? É só perguntar aqui." },
  { title: "Se você usa um assistente com IA", text: "Oi! 👋 Sou o assistente virtual da [Empresa] e respondo na hora sobre preços, horários e disponibilidade. Se preferir falar com uma pessoa, digite *atendente*." },
  { title: "Black Friday", text: "Oi! Obrigado por falar com a [Empresa] 🖤 Nesta Black Friday tem até [30%] de desconto em [produtos]. O que você quer ver?" },
];

const away: Sample[] = [
  { title: "Fechado, com horário", text: "Obrigado pela mensagem! Agora estamos fechados: voltamos [amanhã às 9h]. Deixa sua dúvida aqui que respondemos assim que voltarmos." },
  { title: "Horário de almoço", text: "Oi! Estamos no horário de almoço até as [14h]. Respondemos assim que voltarmos." },
  { title: "Feriado prolongado", text: "Oi! Por conta do feriado, estaremos fechados de [sexta] a [segunda] 🎉 Respondemos na [terça] logo cedo." },
  { title: "Com contato de urgência", text: "Obrigado por escrever. Estamos fora do horário: respondemos amanhã a partir das [8h30]. Em caso de urgência, ligue para [número]." },
  { title: "Com agendamento online", text: "Agora não conseguimos responder, mas você mesmo pode agendar seu horário aqui, 24 horas por dia: [link]. Obrigado!" },
  { title: "Férias coletivas", text: "Oi! Estamos em férias coletivas de [20/12] a [05/01] 🎄 Respondemos todas as mensagens na volta. Boas festas!" },
  { title: "Profissional ocupado", text: "Oi, neste momento estou [em reunião / atendendo um cliente] e não consigo responder. Te retorno até as [18h]." },
  { title: "Escritório, formal", text: "Agradecemos a sua mensagem. Nosso escritório está fechado; atendemos de [segunda a sexta, das 9h às 18h]. Retornaremos o mais breve possível." },
];

const quick: Sample[] = [
  { title: "/horario", text: "Funcionamos de segunda a sábado, das [9h] às [19h]. Aos domingos estamos fechados." },
  { title: "/endereco", text: "Estamos na [Rua Augusta, 1000, São Paulo]. Segue a localização: [link do Google Maps]. Tem estacionamento a [50 metros]." },
  { title: "/pagamento", text: "Aceitamos Pix, cartão de débito e crédito (em até [3x] sem juros) e dinheiro. Nos pedidos online também tem boleto." },
  { title: "/frete", text: "Entregamos para todo o Brasil em [3 a 7 dias úteis]. Frete grátis nas compras acima de [R$ 199]; abaixo disso, a partir de [R$ 19,90]." },
  { title: "/pix", text: "Segue a nossa chave Pix: [chave], em nome de [Empresa]. Depois do pagamento, manda o comprovante aqui na conversa, por favor." },
  { title: "/avaliacao", text: "Obrigado você! Se gostou, ajuda muito a gente deixar uma avaliação aqui: [link] 🙏" },
];

const industries: Array<{ name: string; samples: Sample[] }> = [
  {
    name: "Restaurantes, pizzarias e delivery",
    samples: [
      { title: "Saudação e pedidos", text: "Oi! Bem-vindo(a) à [Pizzaria] 🍕 Pra pedir, manda o sabor, o tamanho e o seu endereço. O cardápio está aqui: [link]" },
      { title: "Retirada no balcão", text: "Oi! Pra retirar no balcão, manda o seu pedido e o horário em que vai passar. Também entregamos em [bairros] das [18h] às [23h]." },
      { title: "Ausência com horário", text: "Obrigado pela mensagem! Agora estamos fechados: funcionamos de [terça a domingo, das 18h às 23h30]. Respondemos assim que abrirmos." },
      { title: "/reserva", text: "Claro! Pra reservar, diz o dia, o horário e para quantas pessoas, que a gente confirma aqui." },
    ],
  },
  {
    name: "Salões de beleza e barbearias",
    samples: [
      { title: "Saudação e horários", text: "Oi! 💇‍♀️ Obrigada por falar com o [Salão]. Diz qual serviço você quer e o melhor dia, que te passamos os horários livres." },
      { title: "Ausência durante o atendimento", text: "Oi! Agora estou atendendo uma cliente e não consigo responder. Te chamo assim que terminar, normalmente em menos de uma hora." },
      { title: "/lembrete", text: "Oi, [Nome]! Passando pra lembrar do seu horário [amanhã às 10h] para [serviço]. Se não puder vir, avisa aqui. Até amanhã!" },
      { title: "/precos", text: "Nossos principais preços: escova a partir de [R$ 50], corte a partir de [R$ 80], coloração a partir de [R$ 150]. Tabela completa: [link]" },
    ],
  },
  {
    name: "Lojas virtuais",
    samples: [
      { title: "Saudação da loja", text: "Oi! Bem-vindo(a) à [Loja] 🛍️ Pode perguntar sobre tamanhos, estoque e frete. Se for sobre um pedido, manda o *número do pedido*." },
      { title: "/pedido", text: "Obrigado! Seu pedido [número] já foi enviado pela [transportadora]. Acompanhe por aqui: [link de rastreio]" },
      { title: "/troca", text: "Você pode pedir troca ou devolução em até [7 dias] após receber o pedido. Manda o número do pedido e o que quer trocar, que te passamos o passo a passo." },
      { title: "Ausência do SAC", text: "Obrigado pela mensagem! Nosso atendimento funciona de segunda a sexta, das [9h às 18h]. Enquanto isso, as dúvidas mais comuns estão aqui: [link]" },
    ],
  },
  {
    name: "Clínicas e escritórios",
    samples: [
      { title: "Saudação da clínica", text: "Olá, obrigado por entrar em contato com a Clínica [Nome]. Para agendar uma consulta, informe seu nome completo e os dias de preferência. Em caso de urgência, ligue para [número]." },
      { title: "Ausência da clínica", text: "A clínica está fechada. Atendemos de [segunda a sexta, das 8h às 18h]: responderemos na reabertura. Em caso de emergência, ligue 192 (SAMU)." },
      { title: "/primeira-consulta", text: "Para a primeira consulta, traga um documento com foto, a carteirinha do convênio (se tiver) e exames anteriores. Chegue [15 minutos] antes." },
      { title: "Contador ou advogado", text: "Olá, obrigado pela mensagem. Atendo com horário marcado: me conta brevemente o assunto e dois ou três horários que funcionam pra você, que eu confirmo." },
    ],
  },
];

const tools = [
  ["Quando é enviada", "Na primeira mensagem de um cliente, ou na primeira depois de 14 dias sem conversa", "Quando chega uma mensagem no horário que você escolheu", "Quando você envia, digitando “/”"],
  ["Quem recebe", "Todos, quem não está nos contatos, todos exceto alguns ou só alguns", "Todos, quem não está nos contatos, todos exceto alguns ou só alguns", "O cliente da conversa aberta"],
  ["Serve para", "Receber e dizer o que acontece agora", "Avisar quando você responde", "Não digitar a mesma coisa dez vezes"],
  ["Limite", "Um texto fixo", "Um texto fixo", "Até 50 respostas salvas"],
];

const setupSteps = [
  { title: "Abra as Ferramentas comerciais", body: "No WhatsApp Business, toque em Mais opções (⋮) no Android ou em Configurações no iPhone, e depois em Ferramentas comerciais." },
  { title: "Escolha a mensagem", body: "Mensagem de saudação, Mensagem de ausência ou Respostas rápidas." },
  { title: "Ative e escreva o texto", body: "Ligue a chave e cole um dos exemplos abaixo, trocando o que está entre colchetes." },
  { title: "Defina horário e destinatários", body: "Para a ausência, escolha Sempre enviar, um horário personalizado ou fora do horário comercial. Depois escolha quem recebe e toque em Salvar." },
];

const faqs = [
  { q: "Como colocar mensagem de saudação no WhatsApp Business?", a: "Toque em Mais opções no Android ou em Configurações no iPhone e abra Ferramentas comerciais. Escolha Mensagem de saudação, ative, escreva o texto, escolha os destinatários e toque em Salvar." },
  { q: "Quando a mensagem de saudação é enviada?", a: "Quando um cliente manda mensagem pela primeira vez, ou pela primeira vez depois de 14 dias sem conversa. Quem falou com você nos últimos 14 dias não recebe de novo." },
  { q: "Qual a diferença entre mensagem de saudação e mensagem de ausência?", a: "A saudação recebe quem fala com você pela primeira vez ou depois de 14 dias. A ausência responde quem escreve no horário em que você não está atendendo. Dá para usar as duas ao mesmo tempo." },
  { q: "Como funcionam as respostas rápidas?", a: "São mensagens salvas com um atalho, como /horario. Na conversa, digite “/” e escolha a resposta. Você pode salvar até 50 em Ferramentas comerciais > Respostas rápidas." },
  { q: "Por que a mensagem de saudação do WhatsApp Business não funciona?", a: "Na maioria das vezes o cliente já falou com você nos últimos 14 dias ou ficou fora dos destinatários escolhidos. As mensagens só saem com o celular conectado à internet, e a opção fora do horário comercial precisa do horário no perfil. Atualizar o app e reativar a mensagem costuma resolver." },
  { q: "Dá para colocar mensagem automática no WhatsApp normal?", a: "Não, o WhatsApp normal não tem mensagens automáticas. Você pode migrar o número para o WhatsApp Business, que é grátis e mantém as conversas, ou conectar o número a uma IA como a Wapzen, que funciona também com o WhatsApp normal." },
];

const sources = [
  { label: "Central de Ajuda do WhatsApp: mensagens de saudação", href: "https://faq.whatsapp.com/501866148528310" },
  { label: "WhatsApp: app WhatsApp Business", href: "https://business.whatsapp.com/products/business-app" },
];

const sections = [
  {
    id: "tres-ferramentas",
    title: "As três mensagens automáticas do WhatsApp Business",
    body: <>
      <p>O WhatsApp Business tem três ferramentas grátis para você não digitar sempre a mesma coisa. Todas ficam em <strong>Ferramentas comerciais</strong>:</p>
      <Comparison caption="Mensagem de saudação, mensagem de ausência e respostas rápidas comparadas" columns={["Mensagem de saudação", "Mensagem de ausência", "Respostas rápidas"]} rows={tools} />
      <p>A saudação e a ausência saem sozinhas; as respostas rápidas você envia com um atalho. As três são <strong>textos fixos</strong>: dizem sempre a mesma coisa, seja qual for a pergunta.</p>
    </>,
  },
  {
    id: "como-configurar",
    title: "Como configurar a mensagem de saudação",
    body: <>
      <Steps items={setupSteps} />
      <p>Para as <strong>respostas rápidas</strong>, vá em Ferramentas comerciais &gt; Respostas rápidas, toque em + e escreva a mensagem e o atalho (por exemplo <em>horario</em>). Na conversa, é só digitar “/” para ver a lista.</p>
      <Note>Para testar a saudação, use um celular que não falou com você nos últimos 14 dias, senão ela não chega. Mais modelos no guia de <Link href="/pt-br/resposta-automatica-whatsapp">resposta automática no WhatsApp</Link>.</Note>
    </>,
  },
  {
    id: "saudacao",
    title: "10 exemplos de mensagem de saudação",
    body: <>
      <p>Uma boa mensagem de saudação agradece, diz quando você vai responder e já pede a informação que você precisa. Troque o que está entre colchetes; os asteriscos deixam o texto em negrito no WhatsApp.</p>
      <Samples locale="pt-BR" items={welcome} />
    </>,
  },
  {
    id: "ausencia",
    title: "8 exemplos de mensagem de ausência",
    body: <>
      <p>A mensagem de ausência precisa dizer duas coisas: que a mensagem chegou e quando você vai responder. Se puder, ofereça uma alternativa, como um link de agendamento ou um telefone de urgência.</p>
      <Samples locale="pt-BR" items={away} />
    </>,
  },
  {
    id: "respostas-rapidas",
    title: "6 respostas rápidas para salvar hoje",
    body: <>
      <p>As respostas rápidas são para o que te perguntam todo dia. O título de cada exemplo é o atalho.</p>
      <Samples locale="pt-BR" items={quick} />
    </>,
  },
  {
    id: "por-segmento",
    title: "16 exemplos por segmento",
    body: <>
      {industries.map((industry) => <div key={industry.name}>
        <h3>{industry.name}</h3>
        <Samples locale="pt-BR" items={industry.samples} />
      </div>)}
    </>,
  },
  {
    id: "nao-funciona",
    title: "Mensagem de saudação não funciona? Veja o motivo",
    body: <>
      <ul>
        <li><strong>A regra dos 14 dias.</strong> Quem falou com você nas últimas duas semanas não recebe a saudação. Acontece quase sempre quando você testa do seu outro celular.</li>
        <li><strong>Os destinatários.</strong> Se você escolheu “quem não está nos contatos” ou “só alguns”, os outros não recebem.</li>
        <li><strong>O horário em branco.</strong> A opção fora do horário comercial usa o horário do seu perfil: sem ele preenchido, a mensagem não sai.</li>
        <li><strong>O celular sem internet.</strong> As mensagens automáticas saem do seu celular: desligado ou sem conexão, nada é enviado.</li>
        <li><strong>O app desatualizado.</strong> Atualize o WhatsApp Business e desative e ative a mensagem de novo.</li>
      </ul>
    </>,
  },
  {
    id: "alem",
    title: "Além dos textos fixos: respostas com IA",
    body: <>
      <p>As mensagens automáticas avisam o cliente que você vai responder, mas não respondem à pergunta dele. Se todo dia chegam as mesmas dúvidas sobre preço, horário e estoque, um agente com IA pode responder de verdade, com as informações da sua empresa, a cada mensagem e a qualquer hora.</p>
      <InlineCta title="Respostas de verdade, não textos fixos" body="A Wapzen conecta uma IA ao seu WhatsApp com um QR Code: ela responde cada cliente com as suas informações, também no WhatsApp normal. Grátis por enquanto." label="Comece grátis" />
      <p>Você pode manter a sua saudação, por exemplo a “Se você usa um assistente com IA”, que avisa o cliente que ele pode pedir uma pessoa. Veja <Link href="/pt-br/blog/como-criar-robo-whatsapp">como criar um robô no WhatsApp</Link>.</p>
    </>,
  },
];

export default function MensagemDeSaudacaoPage() {
  return <BlogPost
    href={href}
    heading={<>Mensagem de saudação no WhatsApp Business.<br /><span>40 exemplos para copiar.</span></>}
    lead="Mensagens de saudação, de ausência e respostas rápidas prontas para copiar, por tipo e por segmento, mais como configurar no WhatsApp Business e o que verificar quando a mensagem não funciona."
    summary={{
      title: "Resumo",
      items: [
        <><strong>O WhatsApp Business tem três mensagens automáticas grátis:</strong> saudação, ausência e respostas rápidas, em Ferramentas comerciais.</>,
        <><strong>A saudação é enviada</strong> na primeira mensagem de um cliente, ou na primeira depois de 14 dias sem conversa.</>,
        <><strong>A ausência é enviada</strong> no horário que você escolher: sempre, personalizado ou fora do horário comercial.</>,
        <><strong>Aqui estão 40 exemplos:</strong> 10 de saudação, 8 de ausência, 6 respostas rápidas e 16 para restaurantes, salões, lojas virtuais e clínicas.</>,
        <><strong>São textos fixos:</strong> para responder de verdade às perguntas, você precisa de uma IA.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/pt-br/blog/como-criar-robo-whatsapp", "/pt-br/blog/agendamento-pelo-whatsapp"]}
    product="/pt-br/resposta-automatica-whatsapp"
    cta={{ heading: <>Responda de verdade aos seus clientes.<br /><span>Com IA, grátis.</span></>, body: "Conecte seu WhatsApp com um QR Code e deixe a IA responder cada mensagem com as informações da sua empresa." }}
  />;
}
