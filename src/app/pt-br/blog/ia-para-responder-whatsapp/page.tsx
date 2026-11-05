import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note, RowTable } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Buscas (autocomplete Google, YouTube e DuckDuckGo com gl=br, 2026-11-06, ver
// docs/seo-research.md, "Brazil and Mexico gap posts"): o maior grupo ainda sem post, 1.318:
// "ia para responder whatsapp" (40, 3/3), "ia para atendimento whatsapp" (37, 3/3), "como
// colocar ia no whatsapp" (30, 3/3), "atendente virtual whatsapp" (30, 3/3), "agente de ia
// whatsapp" (29, 3/3). Formato QaPost para o Google e para assistentes que citam respostas
// diretas. Texto segue o pedido do usuário (2026-11-05): tudo grátis, agente de voz
// funcionando, sem nota sobre banimento e sem o limite por hora. O servidor mantém
// HOURLY_REPLY_LIMIT = 100, então o texto diz "conversas ilimitadas" e "sem limite mensal",
// nunca "respostas ilimitadas". Preço do BotConversa lido na página deles em 2026-11-06. O
// agente fica ativo assim que o número é vinculado, por isso o passo a passo manda preparar
// as instruções antes. O que se diz do Wapzen segue o whiskey-bailey-server de 2026-11-05.
// Tarifas da Meta e Meta One: rever a cada trimestre (1º de jan/abr/jul/out).
const href = "/pt-br/blog/ia-para-responder-whatsapp";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Olá! Quero ativar o agente de voz da Wapzen na minha empresa no Brasil.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "pt-BR", article: { publishedTime: post.published, modifiedTime: post.updated } });

const kinds = [
  ["O que faz", "Envia sempre o mesmo texto", "Segue opções e botões", "Lê a pergunta e responde"],
  ["Pergunta fora do roteiro", "Não entende", "Volta ao menu ou trava", "Responde se a informação existir"],
  ["Áudio e foto", "Não", "Depende da plataforma", "No Wapzen, sim, depois que você liga"],
  ["Para montar", "Alguns minutos", "Desenhar cada caminho", "Escrever instruções e enviar informações"],
  ["Principal cuidado", "Soa robótico", "O cliente desiste no menu", "Pode errar se as instruções forem fracas"],
];

const options = [
  ["Meta Business Agent", "Grátis para começar. Mais capacidade no Meta One, a partir de R$ 59 por mês", "App WhatsApp Business, se a conta for elegível. É oficial da Meta", "Quem quer o caminho oficial e simples"],
  ["BotConversa Pro + API Oficial", "R$ 199 por mês no plano anual, com até 5.000 interações do agente de IA, mais tarifas da Meta", "API oficial com coexistência", "Quem quer automações em fluxo e a API oficial"],
  ["Montagem própria: n8n + API oficial", "Servidor, uso de IA e tarifas da Meta, mais o tempo de um desenvolvedor", "Número na API oficial", "Empresas com desenvolvedor e necessidades específicas"],
  ["Z-API ou Evolution API + n8n", "A Z-API exige conta paga. A Evolution API é código aberto e roda no seu servidor. Some o uso de IA", "Sessão do WhatsApp Web, não oficial. A Evolution também aceita a API oficial", "Desenvolvedores"],
  ["Wapzen", "Grátis agora: sem mensalidade e sem tarifa por mensagem", "Número pessoal ou Business, como dispositivo conectado. Não é oficial da Meta", "Pequenas empresas que querem começar hoje, sem código"],
];

const fit = [
  ["Pequena empresa que atende e vende pelo WhatsApp", "Sim", "Responde em segundos, com as suas informações, a qualquer hora"],
  ["Loja ou delivery que recebe pedidos por mensagem", "Sim", "Anota o pedido, confirma com o cliente e salva no painel"],
  ["Profissional autônomo que perde mensagens durante o atendimento", "Sim", "O agente responde enquanto você está ocupado"],
  ["Empresa que precisa de selo verde ou modelos aprovados", "Não", "Isso só existe na API oficial da Meta"],
  ["Empresa que quer escrever para listas compradas", "Não", "Essas pessoas nunca pediram contato com você"],
];

const prompt = `Você é a assistente virtual do Ateliê Demo, loja de moda feminina em Campinas (SP).
Diga no primeiro contato que é uma assistente virtual.
Responda em português do Brasil, em mensagens curtas, de duas ou três frases, e faça uma pergunta por vez.
Para preços, tamanhos, estoque e prazos, use só as informações que demos. Se não tiver o dado, diga que não sabe e ofereça falar com a equipe.
Nunca invente desconto, prazo, garantia ou disponibilidade.
Entrega em Campinas em até 2 dias úteis, por R$ 12. Para outras cidades, a equipe informa prazo e valor.
Pagamento por Pix ou link de cartão. Você não confirma pagamentos: peça o comprovante e avise que a equipe confere no horário de atendimento.
Para comprar, pegue produto, tamanho, nome e endereço com CEP, repita o pedido com o total e peça confirmação.
Não peça CPF, senha, dados de cartão nem informações de saúde.
Se pedirem uma pessoa, avise que a equipe responde de segunda a sábado, das 9h às 18h, neste mesmo número.
Se alguém responder a uma promoção nossa, pergunte qual produto interessou e continue a conversa.`;

const sources = [
  { label: "Agência Sebrae: WhatsApp se consolida nas vendas on-line (abr. 2026)", href: "https://agenciasebrae.com.br/dados/whatsapp-se-consolida-nas-vendas-on-line-enquanto-facebook-e-lojas-proprias-perdem-folego/" },
  { label: "Harvard Business Review: The Short Life of Online Sales Leads", href: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads" },
  { label: "Teletime: Panorama Mobile Time/Opinion Box sobre ligações pelo WhatsApp (2025)", href: "https://teletime.com.br/28/02/2025/77-dos-brasileiros-preferem-ligacoes-pelo-whatsapp-mostra-pesquisa/" },
  { label: "Meta: apresentando o Meta Business Agent (jun. 2026)", href: "https://about.fb.com/news/2026/06/meta-business-agent/" },
  { label: "Meta: apresentando o Meta One (set. 2026)", href: "https://about.fb.com/br/news/2026/09/apresentando-o-meta-one-um-servico-de-assinatura-com-mais-recursos-e-ia-para-criar-se-conectar-e-se-destacar/" },
  { label: "Meta: preços da WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "BotConversa: planos e preços", href: "https://botconversa.com.br/#pricing" },
  { label: "Zaia: documentação da integração com a Z-API", href: "https://zaiadocs.gitbook.io/recursos/agentes/integracoes-e-canais/z-api" },
  { label: "Evolution API no GitHub", href: "https://github.com/EvolutionAPI/evolution-api" },
  { label: "TechCrunch: WhatsApp exclui o Brasil da proibição a chatbots rivais (jan. 2026)", href: "https://techcrunch.com/2026/01/15/after-italy-whatsapp-excludes-brazil-from-rival-chatbot-ban" },
  { label: "Olhar Digital: Justiça suspende decisão do Cade contra a Meta (jan. 2026)", href: "https://olhardigital.com.br/2026/01/23/pro/justica-suspende-decisao-do-cade-contra-meta-sobre-ia-no-whatsapp/" },
  { label: "Planalto: Código de Defesa do Consumidor (Lei 8.078/1990)", href: "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm" },
  { label: "Planalto: Lei Geral de Proteção de Dados (Lei 13.709/2018)", href: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" },
];

const questions = [
  {
    id: "existe",
    q: "Existe IA para responder WhatsApp automaticamente?",
    answer: "Sim. Um agente de IA lê a mensagem do cliente e responde em segundos, de dia e de noite, com as informações do seu negócio. No Brasil há quatro caminhos principais: o Meta Business Agent, plataformas como o BotConversa, uma montagem própria com n8n e o Wapzen, que é grátis agora e funciona no número que você já usa.",
    body: <>
      <p>A <Link href="/pt-br/blog/mensagem-de-saudacao-whatsapp-business">mensagem de saudação e a mensagem de ausência</Link> do WhatsApp Business são textos fixos: enviam sempre a mesma coisa, sem ler a pergunta. A IA lê “vocês entregam em Osasco?” e responde sobre Osasco.</p>
      <p>Para pequenas empresas, isso pesa. Segundo a 12ª edição da pesquisa Pulso dos Pequenos Negócios, do Sebrae, feita em fevereiro e março de 2026 com mais de 8,2 mil empreendedores, o WhatsApp é o principal canal de comunicação e vendas de <strong>82% dos MEIs e das micro e pequenas empresas</strong>. Quando tudo passa por um só aplicativo, responder vira uma tarefa de tempo integral. É esse trabalho repetido que o agente assume.</p>
    </>,
  },
  {
    id: "como-colocar",
    q: "Como colocar IA no WhatsApp da minha empresa?",
    answer: "O caminho mais rápido é conectar um agente de IA ao seu número. No Wapzen: crie a conta grátis, prepare as instruções, conecte o número com código de pareamento ou QR Code, dê um nome ao agente, cole as instruções e envie as informações do negócio. Não precisa de chave de API da Meta, cartão nem programador.",
    body: <>
      <ol>
        <li><strong>Crie sua conta grátis.</strong> Sem cartão e sem chave de API. O painel está em inglês; o agente responde em português.</li>
        <li><strong>Deixe as instruções prontas.</strong> Adapte o modelo abaixo antes de conectar. O agente entra em funcionamento assim que o número é conectado e, até receber suas instruções, responde de forma genérica.</li>
        <li><strong>Conecte o número.</strong> Em New chat agent, digite seu número para receber um código de 8 caracteres. No WhatsApp, vá em Dispositivos conectados › Conectar um dispositivo › Conectar com número de telefone e digite o código. No computador, você também pode escanear o QR Code.</li>
        <li><strong>Dê um nome e cole as instruções.</strong> Faça isso logo em seguida.</li>
        <li><strong>Envie suas informações.</strong> Preços, perguntas frequentes e políticas em texto, PDF ou Word. PDF escaneado não pode ser lido: use uma versão com texto selecionável.</li>
        <li><strong>Ligue o que você precisa.</strong> Áudio, fotos e a ferramenta de pedidos (Take Order) ficam no editor do agente.</li>
        <li><strong>Teste de outro número.</strong> Envie as perguntas reais dos seus clientes, inclusive as difíceis, e ajuste as instruções.</li>
      </ol>
      <p>Este modelo é de uma loja inventada. Troque pelos dados do seu negócio:</p>
      <pre>{prompt}</pre>
      <InlineCta title="Coloque IA no seu WhatsApp hoje" body="Tudo grátis agora, sem chave de API da Meta e sem cartão." label="Comece grátis" />
    </>,
  },
  {
    id: "crescer",
    q: "Como o Wapzen ajuda minha empresa a crescer?",
    answer: "De três jeitos. Você vende mais, porque cada interessado recebe resposta em segundos, a qualquer hora. Atende mais gente, porque o agente cuida de várias conversas ao mesmo tempo e anota pedidos e leads. E gasta menos, porque o Wapzen não tem mensalidade nem tarifa por mensagem, então esse dinheiro pode ir para anúncios ou estoque.",
    body: <>
      <h3>Vender mais</h3>
      <ul>
        <li><strong>Você responde primeiro.</strong> Em uma pesquisa publicada na Harvard Business Review, empresas dos EUA que tentavam contato em até uma hora tinham quase sete vezes mais chance de qualificar o lead do que as que demoravam mais. O estudo é de 2011 e não é do Brasil, mas a lógica vale: quem chama você muitas vezes chama o concorrente também.</li>
        <li><strong>Seu anúncio rende mais.</strong> Se você paga anúncios de clique para WhatsApp no Instagram ou no Facebook, cada mensagem sem resposta é um clique pago desperdiçado. Com o agente, quem clica às 23h recebe resposta na hora.</li>
        <li><strong>Mais portas de entrada.</strong> Com o <Link href="/tools/whatsapp-link-generator">gerador de link</Link> e o <Link href="/tools/whatsapp-qr-code-generator">gerador de QR Code</Link> grátis, você coloca o WhatsApp no Instagram, no balcão, no cardápio e na embalagem.</li>
        <li><strong>Cliente antigo volta.</strong> Em Bulk Messages, você envia uma planilha Excel ou CSV e manda uma mensagem personalizada para cada cliente, com pausa padrão de 30 segundos entre os envios. Use só com quem autorizou o contato.</li>
      </ul>
      <Note>O agente não vê o texto dos envios em massa. Por isso, o modelo de instruções explica o que fazer quando alguém responde a uma promoção.</Note>
      <h3>Atender mais</h3>
      <ul>
        <li><strong>O pico não trava a loja.</strong> Na hora do almoço ou em uma promoção, o agente cuida de várias conversas ao mesmo tempo. Você e sua equipe ficam com o que precisa de uma pessoa.</li>
        <li><strong>Conversa vira pedido.</strong> Com a ferramenta Take Order, o agente anota produto, nome e endereço, confirma o resumo com o cliente e salva o pedido no seu painel.</li>
        <li><strong>Lead chega organizado.</strong> Você define o que perguntar, como orçamento, prazo ou bairro. Quando sua equipe abre a conversa, os dados já estão ali.</li>
        <li><strong>Áudio e foto têm resposta.</strong> Quem prefere mandar áudio ou a foto de um produto também é atendido.</li>
      </ul>
      <h3>Gastar menos e aprender com as conversas</h3>
      <ul>
        <li><strong>R$ 0 de ferramenta.</strong> O que iria para mensalidade e tarifa por mensagem pode ir para anúncios ou estoque. Veja a <a href="#opcoes">conta com outras opções</a>.</li>
        <li><strong>Você descobre o que falta.</strong> Todas as conversas ficam no painel. As perguntas que mais se repetem mostram o que falta no seu anúncio, catálogo ou site.</li>
      </ul>
      <ChatExample
        business="Ateliê Demo"
        labels={{ subtitle: "WhatsApp · agente de IA", agent: "Agente: ", patient: "Cliente: " }}
        turns={[
          { from: "patient", text: "Oi, ainda tem o vestido azul no M? Entrega em Campinas?" },
          { from: "agent", text: "Oi! Sou a assistente virtual do Ateliê Demo. Tem sim: o vestido azul M custa R$ 129, e a entrega em Campinas sai por R$ 12, em até 2 dias úteis. Quer que eu anote o pedido?" },
          { from: "patient", text: "Quero. Pago no Pix." },
          { from: "agent", text: "Perfeito. Pode me passar seu nome e o endereço com CEP?" },
          { from: "patient", text: "Marina Souza, Rua das Acácias, 120, CEP 13000-000." },
          { from: "agent", text: "Confirmando: 1 vestido azul M, R$ 129 + R$ 12 de entrega = R$ 141, para Marina Souza, Rua das Acácias, 120. Está certo?" },
          { from: "patient", text: "Sim!" },
          { from: "agent", text: "Pedido anotado, Marina. A chave Pix é o CNPJ 00.000.000/0001-00. Envie o comprovante aqui, e a equipe confere amanhã a partir das 9h." },
        ]}
        caption="Conversa ilustrativa de uma loja inventada, às 22h40. Os dados sairiam das instruções e dos arquivos enviados pela loja."
        points={[
          { title: "Atende fora do horário", body: "A venda não precisa esperar até a loja abrir no dia seguinte." },
          { title: "Usa os seus dados", body: "Preço, tamanho e entrega vêm do que você informou." },
          { title: "Confirma antes de salvar", body: "O agente repete o pedido e o total, e o cliente confirma." },
          { title: "Não confirma o Pix", body: "O agente recebe o comprovante, mas quem confere o pagamento é a sua equipe." },
        ]}
      />
      <h3>Faça a conta com os seus números</h3>
      <p>Este é um exemplo, não uma promessa. Veja quantas mensagens chegaram depois do expediente na última semana e troque os valores:</p>
      <ul>
        <li>10 mensagens fora do horário por dia × 30 dias = <strong>300 mensagens por mês</strong>.</li>
        <li>Se 1 em cada 10 virar venda = <strong>30 vendas</strong>.</li>
        <li>Com tíquete médio de R$ 80 = <strong>R$ 2.400 por mês</strong> que hoje dependem de alguém acordado para responder.</li>
      </ul>
    </>,
  },
  {
    id: "diferenca",
    q: "Qual a diferença entre mensagem automática, robô de menu e agente de IA?",
    answer: "A mensagem automática envia sempre o mesmo texto. O robô de menu segue botões que você desenhou e trava quando o cliente foge do roteiro. O agente de IA entende a pergunta escrita do jeito do cliente e responde com as suas informações. Para a maioria das pequenas empresas, é o agente que tira mais trabalho repetido.",
    body: <>
      <Comparison caption="Mensagem automática, robô de menu e agente de IA no WhatsApp" columns={["Mensagem automática", "Robô de menu", "Agente de IA"]} rows={kinds} />
      <p>Um robô de menu ainda faz sentido quando o caminho é sempre igual, como escolher um setor. Compare em <Link href="/pt-br/blog/como-criar-robo-whatsapp">como criar um robô no WhatsApp</Link>. Para colocar <Link href="/pt-br/resposta-automatica-whatsapp">resposta automática no WhatsApp</Link> com IA, o que conta é a qualidade das instruções: por isso o modelo acima manda não inventar.</p>
    </>,
  },
  {
    id: "chatgpt",
    q: "Dá para usar o ChatGPT ou a Meta AI para responder meus clientes?",
    answer: "Não diretamente. A Meta AI e o número do ChatGPT no WhatsApp conversam com quem fala com eles, não com os seus clientes no seu número. Para atender clientes, você precisa de um agente ligado ao seu número, como o Meta Business Agent ou o Wapzen, cujos agentes usam modelos GPT da OpenAI sem você criar conta nem pagar por uso.",
    body: <>
      <ul>
        <li><strong>Meta AI:</strong> é o assistente geral do WhatsApp. Ajuda você a escrever, mas não atende os seus clientes por você. Quem faz isso é o Meta Business Agent, outro produto.</li>
        <li><strong>ChatGPT:</strong> o número dele no WhatsApp é um assistente pessoal. Para ligar um modelo de IA ao número da empresa, é preciso uma ferramenta como o Wapzen ou uma <Link href="/blog/n8n-whatsapp-ai-agent">montagem com n8n</Link> (guia em inglês).</li>
      </ul>
      <h3>A Meta proibiu IA no WhatsApp?</h3>
      <p>Não para o atendimento de empresas. Desde 15 de janeiro de 2026, a regra da Meta barra chatbots de uso geral, como o ChatGPT, na API do WhatsApp Business. Segundo o TechCrunch, ela não impede que empresas atendam os próprios clientes com robôs.</p>
      <p>No Brasil, o Cade mandou suspender a regra em janeiro, e a Meta avisou os provedores de IA de que ela deixava de valer para números +55. Depois, a Justiça Federal suspendeu a ordem do Cade. Não encontramos uma decisão final até a data deste artigo.</p>
    </>,
  },
  {
    id: "opcoes",
    q: "Quais são as opções de IA para WhatsApp e quanto custa cada uma?",
    answer: "O Wapzen é grátis agora. O Meta Business Agent é grátis para começar no app WhatsApp Business, com mais capacidade no Meta One, a partir de R$ 59 por mês. O BotConversa com IA custa R$ 199 por mês no plano anual, mais tarifas da Meta. Uma montagem própria soma servidor, uso de IA, tarifas e o tempo de um desenvolvedor.",
    body: <>
      <RowTable firstColumn="Opção" highlight="Wapzen" caption="Opções de IA para responder WhatsApp no Brasil: custo, onde funciona e para quem serve" columns={["Custo", "Onde funciona", "Melhor para"]} rows={options} />
      <h3>Um exemplo com números</h3>
      <p>Uma loja recebe 25 conversas por dia, com 6 respostas por conversa: <strong>4.500 respostas por mês</strong>.</p>
      <ul>
        <li><strong>Tarifas da Meta na API oficial:</strong> tirando as 1.000 respostas grátis, 3.500 × R$ 0,035 = <strong>R$ 122,50</strong>.</li>
        <li><strong>Com o BotConversa Pro:</strong> R$ 199 + R$ 122,50 = <strong>R$ 321,50 por mês</strong>, ou R$ 3.858 por ano.</li>
        <li><strong>Uma promoção para 500 clientes na API oficial:</strong> 500 × R$ 0,3217 = <strong>R$ 160,85</strong> por envio.</li>
        <li><strong>Com o Wapzen:</strong> <strong>R$ 0</strong> nos três casos. Com a pausa padrão de 30 segundos, 500 mensagens levam pouco mais de 4 horas.</li>
      </ul>
      <Note>Tarifas da Meta para o Brasil na tabela de 1º de outubro de 2026: mudam a cada trimestre. Preços do BotConversa lidos na página deles em 6 de novembro de 2026; o plano Starter, de R$ 189, não inclui IA. Saiba mais em <Link href="/pt-br/blog/whatsapp-business-e-pago">o WhatsApp Business é pago?</Link></Note>
      <h3>Quando vale pagar</h3>
      <p>Se sua empresa precisa de modelos aprovados, envios em grande escala ou um canal oficial da Meta, a API tem valor e vale o custo. O agente do BotConversa também lida com texto, áudio e imagem, e o Meta Business Agent aprende com seu perfil, seu catálogo e conversas anteriores. Como o Wapzen é nosso produto, confira as fontes no fim deste artigo e compare por conta própria.</p>
    </>,
  },
  {
    id: "audio-foto",
    q: "A IA entende áudio e foto no WhatsApp?",
    answer: "Sim, no Wapzen, depois que você liga cada opção. Com Reply to voice messages, o agente transcreve o áudio e responde por texto. Com Read photos, ele lê a imagem, como a foto de um produto. As duas opções vêm desligadas. Áudios com mais de 5 minutos ficam sem resposta automática.",
    body: <>
      <p>As duas opções ficam no cartão Voice &amp; Photos, no editor do agente. Antes de confiar nelas, teste com os áudios e as fotos que seus clientes costumam mandar.</p>
      <ul>
        <li><strong>A resposta é sempre por texto.</strong> O agente de chat não envia áudio.</li>
        <li><strong>Comprovante não é pagamento confirmado.</strong> O agente pode ler a foto de um comprovante, mas não acessa seu banco. Quem confere o Pix é você.</li>
        <li><strong>Foto antiga sai da memória.</strong> Ele vê a imagem só na mensagem em que ela chegou. Se o cliente perguntar sobre ela depois, pode ser preciso reenviar.</li>
      </ul>
    </>,
  },
  {
    id: "ligacoes",
    q: "A IA também atende ligações do WhatsApp?",
    answer: "Sim. O agente de voz do Wapzen atende as ligações de WhatsApp em português, com as mesmas informações do seu negócio, e pode ligar para quem pediu contato. Também é grátis agora, sem cobrança por minuto. Funciona só em ligações de WhatsApp, não em linha fixa ou chamada comum de celular, e não transfere a ligação para uma pessoa.",
    body: <>
      <p>O brasileiro já liga pelo WhatsApp: no Panorama Mobile Time/Opinion Box de janeiro de 2025, com 2.099 entrevistados, 77% dos usuários disseram fazer mais ligações de voz pelo app do que pelos minutos da operadora.</p>
      <ul>
        <li><strong>Ligações recebidas:</strong> o agente responde preço, horário, endereço e outras dúvidas comuns.</li>
        <li><strong>Ligações feitas:</strong> em uma campanha, você adiciona nome e número, e o agente liga na hora. Ligue só para quem pediu contato.</li>
        <li><strong>Pequena pausa:</strong> há um ou dois segundos antes de cada resposta.</li>
        <li><strong>Um idioma por agente:</strong> o agente de voz fala o idioma que você escolher.</li>
      </ul>
      <p>Mais detalhes em <Link href="/pt-br/ligacao-com-ia">ligação com IA</Link> e no guia do <Link href="/pt-br/blog/agente-de-voz-ia-whatsapp-gratis">agente de voz grátis</Link>.</p>
      <InlineCta href={voiceAccess} title="Atenda também quem prefere ligar" body="O agente de voz também é grátis agora. Fale com a gente no WhatsApp e ativamos no seu número." label="Fale no WhatsApp" />
    </>,
  },
  {
    id: "pessoa",
    q: "O que acontece quando o cliente quer falar com uma pessoa?",
    answer: "Você assume aquele contato. Cada conversa no painel do Wapzen tem um botão de IA: desligue e o agente para de responder só àquela pessoa, enquanto continua atendendo as demais. O botão não desliga sozinho quando você responde, e nas instruções você define quando o agente deve oferecer atendimento humano.",
    body: <>
      <ol>
        <li><strong>Defina os casos nas instruções:</strong> reclamação, troca, reembolso, negociação ou um pedido direto para falar com alguém.</li>
        <li><strong>Diga como será o atendimento:</strong> por exemplo, “a equipe responde neste número, de segunda a sábado, das 9h às 18h”.</li>
        <li><strong>Desligue a IA naquele contato</strong> e responda pelo painel ou pelo celular. Quando terminar, ligue de novo.</li>
      </ol>
      <p>O agente não avisa você quando alguém pede uma pessoa. Combine com a equipe de olhar o painel durante o dia, ou peça nas instruções que ele passe o número de um atendente. Para parar tudo de uma vez, pause o agente.</p>
    </>,
  },
  {
    id: "numero",
    q: "Funciona no WhatsApp normal? Vou perder minhas conversas?",
    answer: "Funciona no WhatsApp normal e no WhatsApp Business, e você não perde suas conversas. O Wapzen conecta seu número como dispositivo, igual ao WhatsApp Web: você não troca de número nem migra nada, continua usando o celular e os clientes veem o mesmo número. Não precisa da API oficial nem de aprovação da Meta.",
    body: <>
      <ul>
        <li><strong>Sem migração.</strong> Quem passa para a API oficial normalmente precisa de cadastro e aprovação. Aqui, o número continua no app que você já usa.</li>
        <li><strong>Sem chave de API.</strong> A IA já vem incluída, sem conta na OpenAI.</li>
        <li><strong>Sem tarifa por mensagem.</strong> A Meta cobra por mensagem na API, e o Wapzen não usa a API.</li>
      </ul>
      <p>A contrapartida: como não é a plataforma oficial, não há selo verde nem modelos aprovados. O Wapzen é um produto independente: não pertence à Meta nem ao WhatsApp. Se está em dúvida sobre qual app usar, veja a <Link href="/pt-br/blog/diferenca-whatsapp-e-whatsapp-business">diferença entre WhatsApp e WhatsApp Business</Link>.</p>
    </>,
  },
  {
    id: "lgpd",
    q: "A IA no WhatsApp precisa seguir a LGPD?",
    answer: "Sim. Nomes, telefones e pedidos são dados pessoais pela LGPD, e o que o agente informa sobre preços e condições pode valer como oferta pelo artigo 30 do Código de Defesa do Consumidor. Na prática: peça só o necessário, avise que é um assistente virtual, mantenha as informações atualizadas e não peça dados de saúde, cartão ou senha pelo chat.",
    body: <>
      <p>Isto é uma orientação geral, não aconselhamento jurídico:</p>
      <ul>
        <li><strong>Oferta vincula.</strong> Pelo artigo 30 do CDC, informação suficientemente precisa sobre um produto ou serviço obriga o fornecedor. Trate o que o agente diz como um anúncio e atualize preços e prazos.</li>
        <li><strong>Base legal e transparência.</strong> Tenha base legal para usar os dados e explique o uso na sua política de privacidade.</li>
        <li><strong>Assistente virtual.</strong> O Wapzen não adiciona esse aviso sozinho, então coloque-o nas instruções, como no modelo.</li>
        <li><strong>Mensagens em massa.</strong> Envie só a quem autorizou o contato, dê uma forma simples de sair da lista e não use listas compradas.</li>
        <li><strong>Onde ficam os dados.</strong> O banco de dados principal do Wapzen fica em Singapura, os servidores em Singapura e na Alemanha, e provedores de IA como a OpenAI podem tratar as mensagens nos EUA. Considere isso na sua política de privacidade. O Wapzen não publica um contrato padrão de tratamento de dados: se precisar, fale com a gente antes de conectar o número. Detalhes na <Link href="/privacy">política de privacidade</Link>, em inglês.</li>
      </ul>
    </>,
  },
  {
    id: "limites",
    q: "O que a IA do Wapzen não faz?",
    answer: "O agente de chat não envia PDF nem imagem, não confirma Pix, não tem agenda própria, não escreve primeiro por conta própria e não usa a API oficial da Meta, então não há selo verde nem modelos aprovados. Cada conta tem um agente de chat. Em grupos, ele só responde quando você liga a IA naquele grupo e alguém o marca ou responde a ele.",
    body: <>
      <Comparison caption="Para quem serve e para quem não serve uma IA grátis como o Wapzen no WhatsApp" columns={["Serve?", "Por quê"]} rows={fit} />
      <ul>
        <li><strong>Fotos e catálogos vão por link.</strong> Coloque o link do produto nas informações do agente.</li>
        <li><strong>Agenda só com integração.</strong> O agente anota o pedido. Para reservar um horário real, conecte seu sistema com uma ferramenta de API. Veja <Link href="/pt-br/blog/agendamento-pelo-whatsapp">agendamento pelo WhatsApp</Link>.</li>
        <li><strong>Revise no começo.</strong> Leia as conversas nos primeiros dias e acrescente o que o agente não soube responder.</li>
      </ul>
      <p>Há guias por segmento para <Link href="/pt-br/blog/chatbot-para-delivery-whatsapp">delivery</Link>, <Link href="/pt-br/blog/ia-para-imobiliaria-whatsapp">imobiliária</Link> e <Link href="/pt-br/blog/chatbot-whatsapp-clinica-odontologica">clínica odontológica</Link>.</p>
    </>,
  },
];

export default function IaParaResponderWhatsAppPage() {
  return <QaPost
    href={href}
    heading={<>IA para responder WhatsApp.<br /><span>Como colocar um agente de IA no seu número, grátis.</span></>}
    lead="Quem manda mensagem às 22h e só recebe resposta no dia seguinte pode já ter comprado de outra loja. Aqui respondemos, uma a uma, as dúvidas de quem quer colocar IA no WhatsApp da empresa: como funciona, quanto custa cada opção, como isso ajuda a vender mais e o que a IA ainda não faz."
    verdict={{
      title: "A resposta curta",
      body: <>Dá para ter IA respondendo seu WhatsApp hoje. <strong>O Wapzen</strong> é um agente de IA que funciona no número que você já usa, pessoal ou Business: responde em segundos com as informações do seu negócio, entende áudios e fotos, anota pedidos e atende ligações de WhatsApp com um agente de voz. <strong>Tudo é grátis agora, com conversas ilimitadas e sem chave de API da Meta.</strong> Se você prefere o caminho oficial, a alternativa mais simples é o Meta Business Agent.</>,
    }}
    facts={[["Preço", "Grátis agora"], ["Chave de API da Meta", "Não precisa"], ["Conversas", "Ilimitadas"], ["Ligações", "Agente de voz funcionando"]]}
    indexTitle="As 12 perguntas deste guia"
    answerLabel="Resposta curta"
    questions={questions}
    sources={sources}
    related={["/pt-br/blog/chatbot-para-delivery-whatsapp", "/pt-br/blog/agente-de-voz-ia-whatsapp-gratis"]}
    product="/pt-br/chatbot-whatsapp-com-ia"
    cta={{ heading: <>Seu WhatsApp respondendo a qualquer hora.<br /><span>Grátis agora, sem API da Meta.</span></>, body: "Crie sua conta, conecte seu número e ensine o agente sobre o seu negócio. Sem cartão e sem tarifa por mensagem." }}
  />;
}
