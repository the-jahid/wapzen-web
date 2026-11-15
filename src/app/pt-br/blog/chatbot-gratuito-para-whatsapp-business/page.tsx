import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { Choose, InlineCta, Note, RowTable } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Buscas (autocomplete Google, YouTube e DuckDuckGo com gl=br, 2026-11-06, ver
// docs/seo-research.md, "Brazil free chatbot and salon posts"): "chatbot gratuito para whatsapp
// business" (57, 3/3), "chatbot para whatsapp business" (49, 3/3), "chatbot gratis para whatsapp"
// (45), "melhor chatbot para whatsapp business" (42), "robô de atendimento whatsapp grátis"
// (39, 3/3), "melhor chatbot para whatsapp" (39, 3/3), "quanto custa um chatbot para whatsapp"
// (27), "criar chatbot whatsapp grátis" (26), "alternativa ao botconversa" (20). Os resultados
// são blogs de fornecedores e listas sem preço em reais, por isso a tabela é o ativo principal.
// Texto: grátis agora, agente de voz funcionando (a CTA abre o WhatsApp porque o painel ainda
// mostra VoiceUpdateNote), sem nota sobre banimento e sem os limites por hora e por conta, por
// decisão do usuário (2026-11-06). O servidor mantém HOURLY_REPLY_LIMIT = 100,
// GROUP_HOURLY_REPLY_LIMIT = 50 e MAX_CHAT_AGENTS_PER_USER = 1, então escreva "conversas
// ilimitadas" e "sem limite mensal", nunca "respostas ilimitadas" nem "sem limites".
// Preços lidos em cada página em 2026-11-06, salvo: ManyChat (recusa leitura; Kanal, 4 nov),
// Digisac (recusa leitura; trecho do blog deles) e Umbler Talk (trecho da Capterra, abr. 2026).
// O texto diz isso. Wapzen é nosso produto e o texto diz: não é um ranking. Tarifas da Meta e
// Meta One: rever a cada trimestre (1º de jan/abr/jul/out).
const href = "/pt-br/blog/chatbot-gratuito-para-whatsapp-business";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Olá! Quero ativar o agente de voz da Wapzen na minha empresa no Brasil.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "pt-BR", article: { publishedTime: post.published, modifiedTime: post.updated } });

const options = [
  ["Meta Business Agent", "A Meta diz que o uso é gratuito e que planos pagos virão. Só para empresas qualificadas, em mercados selecionados", "Sim, no app WhatsApp Business", "Sim", "Meta One Essencial: a partir de R$ 59 por mês, com mais acesso"],
  ["ManyChat", "25 contatos ativos por mês, sem WhatsApp", "Só a partir do Pro", "A partir do Pro", "US$ 39 por mês (US$ 29 no plano anual), mais tarifas da Meta"],
  ["SendPulse", "3 bots, 500 inscritos e 10 mil mensagens por mês. O plano grátis não lista WhatsApp", "No Pro", "Integração com ChatGPT no Pro", "US$ 12 por mês (US$ 9,60 no anual), mais tarifas da Meta"],
  ["Typebot", "200 chats por mês, sem WhatsApp", "No Pro", "Depende do fluxo que você monta", "US$ 89 por mês no Pro, o plano com WhatsApp"],
  ["BotConversa", "Sem plano grátis e sem teste. Tem garantia de devolução: 7 dias no mensal e 30 no anual", "Sim", "Só no Pro: até 5.000 interações por mês", "Starter: R$ 189 por mês, sem IA. Pro + API oficial: R$ 199 por mês. Preços do plano anual, mais tarifas da Meta"],
  ["Kommo", "Teste de 14 dias, sem cartão", "Sim", "Até 3 agentes no plano Avançado", "US$ 20 por usuário por mês; US$ 30 no Avançado. O preço varia por mercado"],
  ["Digisac", "Teste de 10 dias", "Sim", "Consulte a empresa", "Preço sob consulta"],
  ["Umbler Talk", "Não confirmamos plano grátis nem teste", "Sim", "Agentes de IA, segundo a empresa", "R$ 198 por usuário por mês no Professional, segundo a Capterra"],
  ["Wapzen", "Tudo, por enquanto: chat com IA, pedidos, base de conhecimento, envio em massa e agente de voz", "Sim, pessoal ou Business", "Incluída", "Não há mensalidade: R$ 0"],
];

const included = [
  ["Mensalidade", "Nenhuma"],
  ["Custo por mensagem ou por resposta", "Nenhum"],
  ["Conversas e contatos", "Ilimitados"],
  ["Respostas de IA por mês", "Sem limite mensal"],
  ["Cartão de crédito", "Não precisa"],
  ["Chave de API da Meta", "Não precisa"],
  ["Arquivos que o agente envia", "Até 20 por agente, com até 10 MB cada"],
];

const versus = [
  ["Preço", "R$ 199 por mês no plano anual, mais tarifas da Meta", "R$ 0 agora, sem mensalidade e sem tarifa por mensagem"],
  ["Como testar", "Garantia de devolução: 7 dias no mensal, 30 no anual", "Conta grátis, sem cartão"],
  ["Como conecta", "API oficial da Meta", "Como dispositivo conectado, igual ao WhatsApp Web. Não é oficial da Meta"],
  ["Como você monta", "Fluxos e agente de IA", "Instruções em texto e arquivos do negócio"],
  ["Respostas de IA", "Até 5.000 interações por mês. O que passar sai da sua Carteira", "Sem limite mensal e sem custo por resposta"],
  ["Áudio e imagem", "O agente entende texto, áudio e imagem", "O agente entende texto, áudio e foto"],
  ["Modelos aprovados pela Meta", "Sim, pela API", "Não"],
  ["Mensagem em massa", "Pela API, com tarifa da Meta por mensagem", "Bulk Messages, sem tarifa, com pausa padrão de 30 segundos"],
  ["Atender ligações por IA", "Não aparece na página de planos", "Agente de voz funcionando, sem cobrança por minuto"],
];

const fit = [
  ["Pequena empresa que atende e vende pelo WhatsApp", "Sim", "Responde em segundos, com as suas informações, a qualquer hora"],
  ["Loja ou delivery que recebe pedidos por mensagem", "Sim", "Anota o pedido, confirma com o cliente e salva no painel"],
  ["Profissional autônomo que perde mensagens durante o atendimento", "Sim", "O agente responde enquanto você está ocupado"],
  ["Empresa com vários departamentos e fila de atendentes", "Não", "Plataformas como Kommo, Digisac e Umbler Talk são feitas para isso"],
  ["Empresa que precisa de selo verde ou modelos aprovados", "Não", "Isso só existe na API oficial da Meta"],
  ["Empresa que quer escrever para listas compradas", "Não", "Essas pessoas nunca pediram contato com você"],
];

const prompt = `Você é a assistente virtual do Pet Demo, pet shop em Curitiba (PR).
Diga no primeiro contato que é uma assistente virtual.
Responda em português do Brasil, em mensagens curtas, de duas ou três frases, e faça uma pergunta por vez.
Para preços, estoque, horários e entregas, use só as informações que demos. Se não tiver o dado, diga que não sabe e ofereça falar com a equipe.
Nunca invente desconto, prazo ou disponibilidade.
Entrega em Curitiba no mesmo dia para pedidos até as 16h, por R$ 10.
Pagamento por Pix ou cartão na entrega. Você não confirma pagamentos: peça o comprovante e avise que a equipe confere no horário de atendimento.
Para comprar, pegue produto, quantidade, nome e endereço com CEP, repita o pedido com o total e peça confirmação.
Não dê orientação veterinária: se o animal estiver doente ou ferido, peça para procurar um veterinário.
Não peça CPF, senha nem dados de cartão.
Se pedirem uma pessoa, avise que a equipe responde de segunda a sábado, das 9h às 18h, neste mesmo número.
Se alguém responder a uma promoção nossa, pergunte qual produto interessou e continue a conversa.`;

const sources = [
  { label: "Agência Sebrae: WhatsApp se consolida nas vendas on-line (abr. 2026)", href: "https://agenciasebrae.com.br/dados/whatsapp-se-consolida-nas-vendas-on-line-enquanto-facebook-e-lojas-proprias-perdem-folego/" },
  { label: "Harvard Business Review: The Short Life of Online Sales Leads", href: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads" },
  { label: "Meta: Conversations 2026, apresentamos o Meta Business Agent", href: "https://about.fb.com/br/news/2026/06/conversations-2026-apresentamos-o-meta-business-agent/" },
  { label: "WhatsApp Business: agente de IA no app", href: "https://whatsappbusiness.com/pt-br/products/business-app-ai-agent/" },
  { label: "Meta: apresentando o Meta One (set. 2026)", href: "https://about.fb.com/br/news/2026/09/apresentando-o-meta-one-um-servico-de-assinatura-com-mais-recursos-e-ia-para-criar-se-conectar-e-se-destacar/" },
  { label: "Meta: preços da WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Central de Ajuda do WhatsApp: mensagens de saudação", href: "https://faq.whatsapp.com/501866148528310" },
  { label: "Kanal: preços do ManyChat em 2026 (análise de terceiros)", href: "https://getkanal.com/blog/manychat-pricing-explained.md" },
  { label: "SendPulse: preços de chatbots", href: "https://sendpulse.com/en/pricing/messengers" },
  { label: "Typebot: preços", href: "https://typebot.com/pricing" },
  { label: "BotConversa: planos e preços", href: "https://botconversa.com.br/#pricing" },
  { label: "Kommo: atualização de preços de 1º de setembro de 2026", href: "https://www.kommo.com/br/blog/atualizacao-precos-kommo/" },
  { label: "Digisac: quanto custa", href: "https://digisac.com.br/blog/quanto-custa-a-digisac" },
  { label: "Capterra: Umbler Talk", href: "https://www.capterra.com/p/10012853/Umbler-Talk/" },
  { label: "Portal do Franchising: Umbler", href: "https://franquias.portaldofranchising.com.br/franquia-umbler/" },
  { label: "TechCrunch: WhatsApp exclui o Brasil da proibição a chatbots rivais (jan. 2026)", href: "https://techcrunch.com/2026/01/15/after-italy-whatsapp-excludes-brazil-from-rival-chatbot-ban" },
  { label: "Planalto: Código de Defesa do Consumidor (Lei 8.078/1990)", href: "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm" },
  { label: "Planalto: Lei Geral de Proteção de Dados (Lei 13.709/2018)", href: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" },
];

const questions = [
  {
    id: "existe",
    q: "Existe chatbot gratuito para WhatsApp Business?",
    answer: "Sim. O Wapzen oferece hoje um chatbot com IA grátis no seu próprio número, com conversas ilimitadas, sem tarifa por mensagem e sem chave de API da Meta. O Meta Business Agent também é gratuito por enquanto, para empresas qualificadas. Nas outras sete opções que analisamos, não encontramos IA grátis no WhatsApp do seu número.",
    body: <>
      <p>Quem procura “chatbot gratuito para WhatsApp Business” encontra muita letra miúda:</p>
      <ul>
        <li><strong>Teste, não plano grátis.</strong> Funciona por 10 ou 14 dias e depois é preciso pagar.</li>
        <li><strong>Plano grátis sem o que você procura.</strong> Ele existe, mas sem WhatsApp no seu número ou sem IA.</li>
        <li><strong>Tarifas da Meta à parte.</strong> Se a ferramenta usa a API oficial, a Meta cobra por mensagem, mesmo com uma plataforma barata.</li>
      </ul>
      <p>Vale procurar direito porque o cliente já está lá: segundo a 12ª edição do Pulso dos Pequenos Negócios, do Sebrae, feita em fevereiro e março de 2026, o WhatsApp é o principal canal de comunicação e vendas de <strong>82% dos MEIs e das micro e pequenas empresas</strong>.</p>
    </>,
  },
  {
    id: "comparativo",
    q: "Quais chatbots para WhatsApp são grátis de verdade?",
    answer: "Das nove opções que analisamos, só o Wapzen e o Meta Business Agent deixam você responder com IA no seu número de WhatsApp sem pagar agora. ManyChat, SendPulse e Typebot têm plano grátis, mas sem WhatsApp. Kommo e Digisac dão testes de 14 e 10 dias. O BotConversa não tem plano grátis nem teste, só garantia de devolução.",
    body: <>
      <RowTable firstColumn="Ferramenta" highlight="Wapzen" caption="Chatbots para WhatsApp no Brasil: o que é grátis, WhatsApp, IA e preço" columns={["O que é grátis", "WhatsApp no seu número", "IA", "Se pagar, a partir de"]} rows={options} />
      <Note>Preços lidos na página de cada empresa em 6 de novembro de 2026, com três exceções. O ManyChat não permite leitura automática, então os dados vêm de uma análise da Kanal de 4 de novembro. A página da Digisac também recusa leitura automática, e o teste de 10 dias vem de um trecho do blog da empresa. O preço do Umbler Talk vem da Capterra, atualizada em abril. Confirme esses três no site de cada empresa. Os valores em dólar não incluem câmbio nem impostos.</Note>
    </>,
  },
  {
    id: "melhor",
    q: "Qual é o melhor chatbot para WhatsApp Business?",
    answer: "Depende do que você precisa. Para responder com IA sem pagar, em número pessoal ou Business, e também atender ligações: Wapzen. Para um produto oficial da Meta: Meta Business Agent. Para fluxos de botões com a API oficial: BotConversa. Para equipe de vendas com funil: Kommo. O Wapzen é nosso produto, por isso mostramos preços e fontes em vez de um ranking.",
    body: <>
      <p>Escolha pelo seu caso:</p>
      <Choose locale="pt-BR" items={[
        { name: "Wapzen", points: ["Você quer responder com IA sem pagar nada por enquanto", "Você usa número pessoal ou WhatsApp Business", "Você também quer atender ligações de WhatsApp com IA"] },
        { name: "Meta Business Agent", points: ["Você já usa o app WhatsApp Business e sua conta é qualificada", "Você prefere um produto oficial da Meta", "Basta que o agente aprenda com sua página, seu catálogo e conversas anteriores"] },
        { name: "BotConversa", points: ["Você quer desenhar fluxos e automações", "Você precisa da API oficial e de modelos aprovados", "Você pode pagar mensalidade e tarifas da Meta"] },
        { name: "Kommo, Digisac ou Umbler Talk", points: ["Você tem uma equipe que atende no mesmo número", "Você precisa de funil, filas ou departamentos", "Você pode pagar por usuário ou pedir uma proposta"] },
      ]} />
      <p>Se ainda está entendendo os tipos de robô, comece por <Link href="/pt-br/blog/como-criar-robo-whatsapp">como criar um robô no WhatsApp</Link>. Para ver só o caminho com IA, leia <Link href="/pt-br/blog/ia-para-responder-whatsapp">IA para responder WhatsApp</Link>.</p>
    </>,
  },
  {
    id: "gratuito",
    q: "O Wapzen é gratuito mesmo?",
    answer: "Sim, hoje tudo é grátis: sem mensalidade, sem tarifa por mensagem e sem cartão. Conversas e contatos são ilimitados, e não há limite mensal de respostas. Isso vale para o chat com IA, os pedidos, a base de conhecimento, o envio em massa e o agente de voz. Não é um teste com prazo para acabar.",
    body: <>
      <Comparison caption="O que é grátis no Wapzen" columns={["No Wapzen"]} rows={included} />
      <p><strong>Por que dizemos “agora”.</strong> Hoje não há plano pago para contratar, mas não prometemos que será grátis para sempre.</p>
    </>,
  },
  {
    id: "custo",
    q: "Quanto custa um chatbot para WhatsApp quando não é grátis?",
    answer: "Para uma loja com 4.500 respostas por mês, as tarifas da Meta na API oficial somam R$ 122,50. Com o BotConversa Pro, o total fica em R$ 321,50 por mês, no plano anual. Com o ManyChat Pro, são US$ 39 mais as tarifas. Uma promoção para 500 clientes soma R$ 160,85. No Wapzen, tudo isso é R$ 0, porque ele não usa a API da Meta.",
    body: <>
      <p>Uma loja recebe 25 conversas por dia, com 6 respostas por conversa: <strong>4.500 respostas por mês</strong>.</p>
      <ul>
        <li><strong>Tarifas da Meta na API oficial:</strong> tirando as 1.000 respostas grátis, 3.500 × R$ 0,035 = <strong>R$ 122,50</strong>.</li>
        <li><strong>Com o BotConversa Pro:</strong> R$ 199 + R$ 122,50 = <strong>R$ 321,50 por mês</strong>, ou R$ 3.858 por ano, se cada resposta contar como uma interação de IA.</li>
        <li><strong>Com o ManyChat Pro:</strong> <strong>US$ 39 + R$ 122,50</strong> por mês.</li>
        <li><strong>Com o Kommo Avançado e um usuário:</strong> <strong>US$ 30 + R$ 122,50</strong> por mês.</li>
        <li><strong>Uma promoção para 500 clientes na API oficial:</strong> 500 × R$ 0,3217 = <strong>R$ 160,85</strong> por envio.</li>
        <li><strong>Com o Wapzen:</strong> <strong>R$ 0</strong> em todos os casos. Com a pausa padrão de 30 segundos, 500 mensagens levam pouco mais de 4 horas.</li>
      </ul>
      <Note>Tarifas da Meta para o Brasil na tabela de 1º de outubro de 2026, que mudam a cada trimestre. Mais detalhes em <Link href="/pt-br/blog/whatsapp-business-e-pago">o WhatsApp Business é pago?</Link></Note>
      <p>Pagar faz sentido quando sua empresa precisa de modelos aprovados, envios em grande escala, várias pessoas no mesmo número ou um canal oficial da Meta. O importante é saber o que está comprando.</p>
    </>,
  },
  {
    id: "botconversa",
    q: "O BotConversa é grátis? Qual é a alternativa gratuita?",
    answer: "Não. O BotConversa não tem plano grátis nem teste: tem garantia de devolução de 7 dias no plano mensal e de 30 dias no anual. O plano com IA custa R$ 199 por mês no anual, mais tarifas da Meta. Como alternativas sem mensalidade, há o Wapzen, que não usa a API oficial, e o Meta Business Agent, para empresas qualificadas.",
    body: <>
      <Comparison caption="BotConversa Pro e Wapzen comparados" columns={["BotConversa Pro + API", "Wapzen"]} rows={versus} />
      <p>O BotConversa continua sendo uma boa escolha se você já tem fluxos prontos ou precisa da API oficial. O plano Starter, de R$ 189, não inclui IA nem a API oficial. A empresa não cobra adesão nem fidelidade, e diz que não adiciona taxa sobre as tarifas da Meta.</p>
    </>,
  },
  {
    id: "criar",
    q: "Como criar um chatbot grátis para WhatsApp com IA, passo a passo?",
    answer: "No Wapzen: crie a conta grátis, prepare as instruções, conecte o número com código de pareamento ou QR Code, dê um nome ao agente, cole as instruções e envie as informações do negócio. Não precisa programar, nem de cartão, nem de chave de API da Meta. Depois, teste de outro número com as perguntas reais dos seus clientes.",
    body: <>
      <ol>
        <li><strong>Crie sua conta grátis.</strong> Sem cartão e sem chave de API. O painel está em inglês; o agente responde em português.</li>
        <li><strong>Deixe as instruções prontas.</strong> Adapte o modelo abaixo antes de conectar. O agente entra em funcionamento assim que o número é conectado e, até receber suas instruções, responde de forma genérica.</li>
        <li><strong>Conecte o número.</strong> Em New chat agent, digite seu número para receber um código de 8 caracteres. No WhatsApp, vá em Dispositivos conectados › Conectar um dispositivo › Conectar com número de telefone e digite o código. No computador, você também pode escanear o QR Code.</li>
        <li><strong>Dê um nome e cole as instruções.</strong> Faça isso logo em seguida.</li>
        <li><strong>Envie suas informações.</strong> Preços, perguntas frequentes e políticas em texto, PDF ou Word. PDF escaneado não pode ser lido: use uma versão com texto selecionável.</li>
        <li><strong>Ligue o que precisar.</strong> A ferramenta de pedidos (Take Order) e os arquivos que o agente envia (Images &amp; Files) ficam no editor do agente.</li>
        <li><strong>Teste de outro número.</strong> Envie as perguntas reais dos seus clientes, inclusive as difíceis, e ajuste as instruções.</li>
      </ol>
      <p>Este modelo é de uma loja inventada. Troque pelos dados do seu negócio:</p>
      <pre>{prompt}</pre>
      <InlineCta title="Crie seu chatbot grátis para WhatsApp" body="Tudo grátis agora, sem chave de API da Meta e sem cartão." label="Comece grátis" />
    </>,
  },
  {
    id: "vender",
    q: "Como um chatbot gratuito ajuda a vender mais?",
    answer: "Ele responde quem chama na hora, inclusive à noite e nos picos, quando muitos clientes desistem ou procuram outra loja. Também anota pedidos e leads enquanto sua equipe faz outra coisa, e aproveita melhor os anúncios que abrem o WhatsApp. Como não há mensalidade nem tarifa por mensagem, esse dinheiro pode ir para anúncios ou estoque.",
    body: <>
      <ul>
        <li><strong>Você responde primeiro.</strong> Em uma pesquisa publicada na Harvard Business Review, empresas dos EUA que tentavam contato em até uma hora tinham quase sete vezes mais chance de qualificar o lead do que as que demoravam mais. O estudo é de 2011 e não é do Brasil, mas a lógica vale: quem chama você muitas vezes chama o concorrente também.</li>
        <li><strong>Seu anúncio rende mais.</strong> Cada mensagem sem resposta de um anúncio de clique para WhatsApp é um clique pago desperdiçado.</li>
        <li><strong>Conversa vira pedido.</strong> Com o Take Order, o agente anota produto, nome e endereço, confirma com o cliente e salva no painel.</li>
        <li><strong>Mais portas de entrada.</strong> Com o <Link href="/tools/whatsapp-link-generator">gerador de link</Link> e o <Link href="/tools/whatsapp-qr-code-generator">gerador de QR Code</Link> grátis, você coloca o WhatsApp no Instagram, no balcão e na embalagem.</li>
      </ul>
      <ChatExample
        business="Pet Demo"
        labels={{ subtitle: "WhatsApp · agente de IA", agent: "Agente: ", patient: "Cliente: " }}
        turns={[
          { from: "patient", text: "Oi, tem ração para cão adulto de 15 kg? Entrega no Água Verde hoje?" },
          { from: "agent", text: "Oi! Sou a assistente virtual do Pet Demo. Temos sim: custa R$ 189, e a entrega em Curitiba sai por R$ 10, no mesmo dia para pedidos até as 16h. Quer que eu anote?" },
          { from: "patient", text: "Quero. Pago no Pix." },
          { from: "agent", text: "Perfeito. Pode me passar seu nome e o endereço com CEP?" },
          { from: "patient", text: "Rafael Lima, Rua das Araucárias, 45, CEP 80000-000." },
          { from: "agent", text: "Confirmando: 1 ração de 15 kg, R$ 189 + R$ 10 de entrega = R$ 199, para Rafael Lima, Rua das Araucárias, 45. Está certo?" },
          { from: "patient", text: "Sim!" },
          { from: "agent", text: "Pedido anotado, Rafael. A chave Pix é o CNPJ 00.000.000/0001-00. Envie o comprovante aqui, e a equipe confere antes de sair a entrega." },
        ]}
        caption="Conversa ilustrativa de uma loja inventada, no pico do almoço. Os dados sairiam das instruções e dos arquivos enviados pela loja."
        points={[
          { title: "Atende no pico", body: "O cliente não fica esperando enquanto a equipe atende no balcão." },
          { title: "Usa os seus dados", body: "Preço e entrega vêm do que você informou." },
          { title: "Confirma antes de salvar", body: "O agente repete o pedido e o total, e o cliente confirma." },
          { title: "Não confirma o Pix", body: "O agente recebe o comprovante, mas quem confere o pagamento é a sua equipe." },
        ]}
      />
      <p>Para fazer a conta com os seus números, veja <Link href="/pt-br/blog/ia-para-responder-whatsapp">IA para responder WhatsApp</Link>.</p>
    </>,
  },
  {
    id: "numero",
    q: "Funciona no WhatsApp Business e no WhatsApp normal? Preciso da API?",
    answer: "Funciona nos dois, e você não precisa da API oficial. O Wapzen conecta seu número como dispositivo, igual ao WhatsApp Web: você não troca de número, mantém as conversas e continua usando o celular. Não há cadastro na Meta, modelos nem chave de API. Em troca, como não é a plataforma oficial, não há selo verde nem modelos aprovados.",
    body: <>
      <ul>
        <li><strong>Mesmo número.</strong> Os clientes chamam onde sempre chamaram.</li>
        <li><strong>IA incluída.</strong> Não precisa de conta na OpenAI.</li>
        <li><strong>Sem tarifa por mensagem.</strong> A Meta cobra por mensagem na API, e o Wapzen não usa a API.</li>
        <li><strong>Atenção no número pessoal.</strong> O agente responde todas as conversas individuais, inclusive de amigos e família. Desligue a IA nesses contatos pelo painel.</li>
      </ul>
      <p>O Wapzen é um produto independente: não pertence à Meta nem ao WhatsApp. Se estiver em dúvida sobre qual app usar, veja a <Link href="/pt-br/blog/diferenca-whatsapp-e-whatsapp-business">diferença entre WhatsApp e WhatsApp Business</Link>.</p>
    </>,
  },
  {
    id: "midia",
    q: "O chatbot entende áudio e foto? Envia arquivos e atende ligações?",
    answer: "Sim. O agente do Wapzen transcreve áudios e lê fotos, e essas opções já vêm ligadas. Ele também envia as imagens e os documentos que você subir, quando a conversa pede. O agente de voz atende ligações de WhatsApp em português e pode ligar para quem pediu contato, sem cobrança por minuto. Não funciona em linha fixa nem transfere a ligação para uma pessoa.",
    body: <>
      <ul>
        <li><strong>Áudio.</strong> O agente responde por texto. Áudios com mais de 5 minutos ficam sem resposta automática.</li>
        <li><strong>Foto.</strong> Ele vê a imagem só na mensagem em que ela chegou. Pode ler um comprovante, mas não acessa seu banco: quem confere o Pix é você.</li>
        <li><strong>Arquivos.</strong> Em Images &amp; Files, você sobe fotos, PDFs e planilhas, sem vídeo, e escreve quando cada um deve ser enviado. Teste antes de contar com isso.</li>
        <li><strong>Ligações.</strong> Há um ou dois segundos de pausa antes de cada resposta, e cada agente de voz fala um idioma. Ligue só para quem pediu contato.</li>
      </ul>
      <p>Mais detalhes em <Link href="/pt-br/ligacao-com-ia">ligação com IA</Link> e no guia do <Link href="/pt-br/blog/agente-de-voz-ia-whatsapp-gratis">agente de voz grátis</Link>.</p>
      <InlineCta href={voiceAccess} title="Atenda também quem prefere ligar" body="O agente de voz também é grátis agora. Fale com a gente no WhatsApp e ativamos no seu número." label="Fale no WhatsApp" />
    </>,
  },
  {
    id: "whatsapp-business",
    q: "O WhatsApp Business, a Meta AI ou o ChatGPT já não fazem isso?",
    answer: "Só em parte. O app WhatsApp Business tem saudação, ausência e respostas rápidas, que são textos fixos. O Meta Business Agent responde com IA, mas é para empresas qualificadas em mercados selecionados. A Meta AI e o ChatGPT conversam com quem fala com eles, e não atendem seus clientes no seu número.",
    body: <>
      <ul>
        <li><strong>Mensagens automáticas do app.</strong> São grátis e úteis, mas enviam sempre o mesmo texto. Veja 40 exemplos em <Link href="/pt-br/blog/mensagem-de-saudacao-whatsapp-business">mensagem de saudação</Link>.</li>
        <li><strong>Meta Business Agent.</strong> Aprende com sua página, conversas anteriores, catálogo e site. Segundo a Meta, o uso é gratuito e planos pagos virão. A Meta diz que alguns recursos podem não estar disponíveis para todas as empresas, então veja se ele aparece no seu app. Enquanto ele estiver conectado, o WhatsApp desliga sua mensagem de saudação.</li>
        <li><strong>ChatGPT.</strong> Desde janeiro de 2026, a regra da Meta barra chatbots de uso geral na API do WhatsApp Business. Segundo o TechCrunch, ela não impede empresas de atender os próprios clientes com robôs, e o Brasil tem uma disputa própria sobre o tema. Os agentes do Wapzen usam modelos GPT da OpenAI, já incluídos.</li>
      </ul>
    </>,
  },
  {
    id: "pessoa",
    q: "O que acontece quando o cliente quer falar com uma pessoa?",
    answer: "Você assume aquele contato. Cada conversa no painel do Wapzen tem um botão de IA: desligue e o agente para de responder só àquela pessoa, enquanto continua atendendo as demais. O botão não desliga sozinho quando você responde, e nas instruções você define quando o agente deve oferecer atendimento humano.",
    body: <>
      <p>O agente não avisa você quando alguém pede uma pessoa. Combine com a equipe de olhar o painel durante o dia, ou peça nas instruções que ele passe o número de um atendente. Para parar tudo de uma vez, pause o agente.</p>
    </>,
  },
  {
    id: "lgpd",
    q: "O que a LGPD e o Código de Defesa do Consumidor exigem de um chatbot?",
    answer: "Nomes, telefones e pedidos são dados pessoais pela LGPD, e o que o chatbot informa sobre preços e condições pode valer como oferta pelo artigo 30 do Código de Defesa do Consumidor. Na prática: peça só o necessário, mantenha as informações atualizadas, avise que é um assistente virtual e não peça dados de saúde, cartão ou senha pelo chat.",
    body: <>
      <p>Isto é uma orientação geral, não aconselhamento jurídico:</p>
      <ul>
        <li><strong>Base legal e transparência.</strong> Tenha base legal para usar os dados e explique o uso na sua política de privacidade.</li>
        <li><strong>Assistente virtual.</strong> O Wapzen não adiciona esse aviso sozinho, então coloque-o nas instruções, como no modelo.</li>
        <li><strong>Mensagens em massa.</strong> Envie só a quem autorizou o contato, dê uma forma simples de sair da lista e não use listas compradas.</li>
        <li><strong>Onde ficam os dados.</strong> O banco de dados principal do Wapzen fica em Singapura, os servidores em Singapura e na Alemanha, os arquivos que você sobe para o agente em Seul, e provedores de IA como a OpenAI podem tratar as mensagens nos EUA. O Wapzen não publica um contrato padrão de tratamento de dados: se precisar, fale com a gente antes de conectar o número. Detalhes na <Link href="/privacy">política de privacidade</Link>, em inglês.</li>
      </ul>
    </>,
  },
  {
    id: "nao-faz",
    q: "O que um chatbot gratuito como o Wapzen não faz?",
    answer: "Ele não confirma Pix, não tem agenda própria, não escreve primeiro por conta própria e não usa a API oficial da Meta, então não há selo verde nem modelos aprovados. Não tem fila de atendentes nem funil de vendas. Em grupos, ele só responde quando você liga a IA naquele grupo e alguém o marca ou responde a ele.",
    body: <>
      <Comparison caption="Para quem serve e para quem não serve um chatbot gratuito como o Wapzen" columns={["Serve?", "Por quê"]} rows={fit} />
      <ul>
        <li><strong>Agenda só com integração.</strong> O agente anota o pedido. Para reservar um horário real, conecte seu sistema com uma ferramenta de API. Veja <Link href="/pt-br/blog/agendamento-pelo-whatsapp">agendamento pelo WhatsApp</Link>.</li>
        <li><strong>O agente não vê seus envios em massa.</strong> Por isso, o modelo de instruções explica o que fazer quando alguém responde a uma promoção.</li>
        <li><strong>Revise no começo.</strong> Leia as conversas nos primeiros dias e acrescente o que o agente não soube responder.</li>
      </ul>
      <p>Há guias por segmento para <Link href="/pt-br/blog/chatbot-para-delivery-whatsapp">delivery</Link>, <Link href="/pt-br/blog/ia-para-imobiliaria-whatsapp">imobiliária</Link>, <Link href="/pt-br/blog/chatbot-whatsapp-clinica-odontologica">clínica odontológica</Link> e <Link href="/pt-br/blog/ia-para-barbearia-e-salao-de-beleza">barbearia e salão de beleza</Link>.</p>
    </>,
  },
];

export default function ChatbotGratuitoWhatsAppBusinessPage() {
  return <QaPost
    href={href}
    heading={<>Chatbot gratuito para WhatsApp Business.<br /><span>Nove opções comparadas, com preços e fontes.</span></>}
    lead="Muitos chatbots “grátis” para WhatsApp são um teste de 14 dias, um plano sem WhatsApp ou um menu sem IA. Aqui respondemos, uma a uma, as dúvidas de quem procura um chatbot no Brasil: o que é grátis de verdade, quanto custa o resto, qual escolher e como criar o seu passo a passo."
    verdict={{
      title: "A resposta curta",
      body: <>Sim, existe chatbot com IA grátis para WhatsApp Business. <strong>O Wapzen</strong> funciona no número que você já usa, pessoal ou Business: responde em segundos com as informações do seu negócio, entende áudios e fotos, anota pedidos e atende ligações de WhatsApp com um agente de voz. <strong>Tudo é grátis agora, com conversas ilimitadas e sem chave de API da Meta.</strong> O Wapzen é nosso produto e não é oficial da Meta: se você prefere o caminho oficial, veja o Meta Business Agent.</>,
    }}
    facts={[["Preço", "Grátis agora"], ["Chave de API da Meta", "Não precisa"], ["Conversas", "Ilimitadas"], ["Ligações", "Agente de voz funcionando"]]}
    indexTitle="As 14 perguntas deste guia"
    answerLabel="Resposta curta"
    questions={questions}
    sources={sources}
    related={["/pt-br/blog/como-criar-robo-whatsapp", "/pt-br/blog/whatsapp-business-e-pago"]}
    product="/pt-br/chatbot-whatsapp-com-ia"
    cta={{ heading: <>Seu chatbot respondendo a qualquer hora.<br /><span>Grátis agora, sem API da Meta.</span></>, body: "Crie sua conta, conecte seu número e ensine o agente sobre o seu negócio. Sem cartão e sem tarifa por mensagem." }}
  />;
}
