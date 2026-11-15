import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Buscas (autocomplete Google, YouTube e DuckDuckGo com gl=br, 2026-11-06, ver
// docs/seo-research.md, "Brazil free chatbot and salon posts"): "ia para barbearia" (30, 3/3),
// "sistema para barbearia" (30, 3/3), "app para barbearia" (30, 3/3), "sistema para salão de
// beleza" (30, 3/3), "sistema para barbearia grátis" (29), "sistema para salão de beleza grátis"
// (29), "agente de ia para barbearia" (28), "agente de ia para salão de beleza" (28). Quem busca
// um sistema grátis não encontra um sistema no Wapzen: o texto diz isso e aponta onde procurar.
// Texto: grátis agora, agente de voz funcionando (a CTA abre o WhatsApp porque o painel ainda
// mostra VoiceUpdateNote), sem nota sobre banimento e sem os limites por hora e por conta, por
// decisão do usuário (2026-11-06). O servidor mantém HOURLY_REPLY_LIMIT = 100 e
// MAX_CHAT_AGENTS_PER_USER = 1, então escreva "conversas ilimitadas" e "sem limite mensal", nunca
// "respostas ilimitadas" nem "sem limites". Não há dado brasileiro independente sobre faltas (a busca achou só um TCC sem
// número e uma estatística estrangeira sem método), então o texto não promete percentual. Nenhum
// estudo mede o uso de WhatsApp só em salões: os 91% atribuídos ao Sebrae-PR não foram
// confirmados e ficaram de fora, assim como 1,06 milhão de MEIs do CNAE 9602-5/01. Preços lidos
// em 2026-11-06. AppBarber: só a App Store dos EUA, sem preço em reais. Trinks: a página mostra
// R$ 38 e R$ 55 sem dizer qual é o anual, por isso "a partir de". Tarifas da Meta: rever a cada
// trimestre (1º de jan/abr/jul/out).
const href = "/pt-br/blog/ia-para-barbearia-e-salao-de-beleza";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Olá! Quero ativar o agente de voz da Wapzen na minha barbearia ou salão no Brasil.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "pt-BR", article: { publishedTime: post.published, modifiedTime: post.updated } });

const answers = [
  ["“Quanto fica corte e barba?”", "Sim", "Com a sua tabela de preços"],
  ["“Quanto tempo leva uma progressiva?”", "Sim", "Com os tempos que você informar, como estimativa"],
  ["“Vocês abrem na segunda?”", "Sim", "Com seus horários e folgas"],
  ["“Aceita Pix?”", "Sim", "Com as formas de pagamento que você informar"],
  ["“Manda foto dos cortes?”", "Sim", "Se você subir as fotos em Images & Files"],
  ["“Tem horário sábado às 10h?”", "Em parte", "Anota o pedido ou envia o link da sua agenda"],
  ["“Preciso remarcar”", "Em parte", "Pega nome, dia e hora, e você confirma"],
  ["“Sou alérgica a tintura, posso fazer?”", "Não", "Não orienta: passa para uma pessoa"],
  ["“Que dia a Carla costuma vir?”", "Não", "Nunca fala sobre outros clientes"],
];

const booking = [
  ["Pedido que você confirma", "Agenda de papel ou Google Agenda", "Hoje", "Você, na conversa"],
  ["Link da sua agenda", "Sistema ou página de agendamento", "Hoje", "O cliente, na página"],
  ["Ferramenta de API ligada ao sistema", "Sistema que ofereça API", "Precisa de um técnico", "O agente, se a ferramenta responder"],
];

const software = [
  ["Responder perguntas livres no WhatsApp", "Depende do produto. A Trinks anuncia uma IA que conversa 24 horas e agenda, sem dizer o canal nem o preço na página", "Sim"],
  ["Atender ligações de WhatsApp por voz", "Não vimos nas páginas consultadas", "Sim"],
  ["Agenda por profissional", "Sim", "Não"],
  ["Página para o cliente agendar", "Sim", "Não"],
  ["Lembretes ligados à agenda", "Sim. Na Trinks, a rotina no WhatsApp é um adicional", "Não. Você envia uma planilha pelo Bulk Messages"],
  ["Caixa, comissão e estoque", "Em geral, sim", "Não"],
  ["Preço de entrada", "Trinks: a partir de R$ 38 por mês. Booksy: R$ 99,99 por mês mais impostos", "R$ 0 agora"],
];

const systems = [
  ["Trinks", "A partir de R$ 38 por mês, para 1 ou 2 profissionais", "5 dias", "Rotina de mensagens no WhatsApp é um adicional, sem preço na página"],
  ["Booksy", "R$ 99,99 por mês mais impostos, e R$ 20 por agenda extra", "7 dias", "Sem fidelidade. Diz que não cobra comissão sobre clientes novos no Brasil"],
  ["AppBarber PRO", "Assinatura mensal no app. Na App Store dos EUA, a partir de US$ 10,49 para 1 profissional", "Não confirmamos", "Veja o preço em reais no próprio app"],
  ["Google Agenda", "Grátis com conta Google", "Não precisa", "Página de agendamento simples, sem caixa nem comissão"],
  ["Koalendar", "Plano grátis, segundo a empresa", "Não precisa", "Páginas de agendamento, sem pagamentos integrados no plano grátis"],
];

const costs = [
  ["Plataforma", "Depende da empresa. No BotConversa Pro: R$ 199 por mês no plano anual", "R$ 0"],
  ["Respostas às clientes", "1.000 grátis por mês por número, depois R$ 0,035 cada", "R$ 0, sem limite mensal"],
  ["Lembretes", "R$ 0,035 cada", "R$ 0"],
  ["Promoções", "R$ 0,3217 cada", "R$ 0"],
  ["API da Meta e chave de acesso", "Necessárias", "Não precisa"],
];

const fit = [
  ["Barbeiro, cabeleireira, manicure ou esteticista que trabalha sozinho", "Sim", "Responde enquanto suas mãos estão ocupadas"],
  ["Negócio com tabela clara e perguntas repetidas", "Sim", "Responde preço, duração e horário a qualquer hora"],
  ["Quem marca pelo WhatsApp e quer pedidos organizados", "Sim", "Pega serviço, dia e nome, e você confirma"],
  ["Quem quer horário confirmado sem olhar a conversa", "Não sozinho", "Precisa de uma agenda conectada ou de um link de agendamento"],
  ["Quem procura agenda, caixa, comissão e estoque", "Não", "Isso é um sistema de gestão: o Wapzen não substitui"],
  ["Rede que exige selo verde ou modelos aprovados", "Não", "Só existem na API oficial da Meta"],
];

const prompt = `Você é a assistente virtual do Studio Demo, barbearia e salão de beleza em Belo Horizonte (MG).
No primeiro contato, diga que é uma assistente virtual.
Responda em português do Brasil, em duas ou três frases, e faça uma pergunta por vez.
Responda sobre serviços, preços, duração, horário de funcionamento, endereço e formas de pagamento só com as informações que demos. Se o preço for “a partir de”, diga isso e explique que o valor final é definido no atendimento. Nunca invente preço, desconto ou horário livre.
Para marcar, pergunte serviço, dia, período, nome e se prefere algum profissional. Depois, avise que o Studio confirma o horário nesta conversa. Nunca diga que o horário está confirmado.
Para remarcar ou cancelar, peça nome, dia e hora do atendimento e avise que o Studio confirma.
Você não vê as mensagens em massa que enviamos. Se alguém responder a um lembrete ou a uma promoção, pergunte o que a pessoa precisa e siga estas regras.
Você não confirma pagamentos: se alguém enviar um comprovante, avise que a equipe confere.
Sobre alergia, gravidez, irritação ou problemas de pele e couro cabeludo, não dê orientação e não peça detalhes: diga que uma pessoa do Studio vai responder. Se alguém descrever uma reação grave, oriente a ligar para o SAMU, no 192.
Nunca fale sobre outros clientes nem sobre os horários deles.
Não peça CPF, senha nem dados de cartão.`;

const reminder = `Oi, {{Nome}}! Lembrando do seu horário no Studio Demo: {{Data}}, às {{Hora}}. Se precisar remarcar, é só responder aqui.`;

const comeback = `Oi, {{Nome}}! Faz um tempo que você não vem ao Studio Demo. Quer que a gente veja um horário para esta semana? Se preferir não receber estas mensagens, é só avisar.`;

const sources = [
  { label: "Agência Sebrae: a cada hora, 27 negócios de beleza são abertos no país (jan. 2026)", href: "https://agenciasebrae.com.br/cultura-empreendedora/a-cada-hora-27-negocios-de-beleza-sao-abertos-no-pais-crescimento-foi-de-185-em-2025/" },
  { label: "Agência Sebrae: negócios da beleza e o Caderno de Tendências 2026 (set. 2026)", href: "https://agenciasebrae.com.br/inovacao-e-tecnologia/negocios-da-beleza-serao-mais-personalizados-tecnologicos-e-conscientes-aponta-estudo/" },
  { label: "Agência Sebrae SP: pesquisa com 800 profissionais de beleza e estética (nov. 2025)", href: "https://sp.agenciasebrae.com.br/dados/paixao-oportunidade-e-autonomia-impulsionam-empreendedores-do-setor-de-beleza-e-estetica/" },
  { label: "Agência Sebrae: WhatsApp se consolida nas vendas on-line (abr. 2026)", href: "https://agenciasebrae.com.br/dados/whatsapp-se-consolida-nas-vendas-on-line-enquanto-facebook-e-lojas-proprias-perdem-folego/" },
  { label: "Teletime: Panorama Mobile Time/Opinion Box sobre ligações pelo WhatsApp (2025)", href: "https://teletime.com.br/28/02/2025/77-dos-brasileiros-preferem-ligacoes-pelo-whatsapp-mostra-pesquisa/" },
  { label: "Trinks: planos", href: "https://negocios.trinks.com/planos/" },
  { label: "Trinks: página para negócios", href: "https://negocios.trinks.com/" },
  { label: "Booksy Brasil: preços", href: "https://biz.booksy.com/pt-br/precos" },
  { label: "App Store: AppBarber PRO", href: "https://apps.apple.com/app/id1602535418" },
  { label: "Koalendar: softwares de agendamento para salões (guia de um fornecedor)", href: "https://koalendar.com/pt-br/blog/melhor-aplicativo-de-agendamento-para-salao" },
  { label: "Google: páginas de agendamento no Google Agenda", href: "https://support.google.com/calendar/answer/10729749?hl=pt-BR" },
  { label: "BotConversa: planos e preços", href: "https://botconversa.com.br/#pricing" },
  { label: "Meta: preços da WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Meta: Conversations 2026, apresentamos o Meta Business Agent", href: "https://about.fb.com/br/news/2026/06/conversations-2026-apresentamos-o-meta-business-agent/" },
  { label: "Planalto: Código de Defesa do Consumidor (Lei 8.078/1990)", href: "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm" },
  { label: "Planalto: Lei Geral de Proteção de Dados (Lei 13.709/2018)", href: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" },
];

const questions = [
  {
    id: "existe",
    q: "Existe IA para barbearia e salão de beleza no WhatsApp?",
    answer: "Sim. O Wapzen é um agente de IA grátis para barbearias, salões de beleza, manicures e esteticistas: responde no seu número de WhatsApp sobre preços, duração e horários, recebe pedidos de agendamento e atende ligações de WhatsApp. Não precisa de chave de API da Meta nem de cartão. Tudo é grátis agora, com conversas ilimitadas.",
    body: <>
      <p>Um agente de IA é diferente de uma mensagem automática. A <Link href="/pt-br/blog/mensagem-de-saudacao-whatsapp-business">mensagem de saudação</Link> do WhatsApp Business envia sempre o mesmo texto. O agente lê “quanto fica corte e barba?” e responde com o preço da sua tabela.</p>
      <p>O <Link href="/pt-br/chatbot-whatsapp-com-ia">Wapzen</Link> conecta o número que você já usa como dispositivo, igual ao WhatsApp Web. Você continua com o WhatsApp no celular, e o cliente chama no mesmo número de sempre. Não é um produto oficial da Meta, e por isso não precisa de cadastro na API.</p>
    </>,
  },
  {
    id: "por-que",
    q: "Por que barbearias e salões perdem tanto tempo no WhatsApp?",
    answer: "Porque a mensagem chega com a máquina ou a tinta na mão, e a maioria desses negócios é muito pequena. Segundo o Sebrae, o Brasil abriu cerca de 236 mil negócios de beleza em 2025, alta de 18,5%, e 94% eram MEIs. E o WhatsApp é o principal canal de 82% dos pequenos negócios, em todos os setores.",
    body: <>
      <ul>
        <li><strong>Um setor grande.</strong> O Sebrae coloca o Brasil como o terceiro maior mercado consumidor de beleza e cuidados pessoais do mundo, com cerca de R$ 140 bilhões previstos para 2026.</li>
        <li><strong>Muita gente nova no ramo.</strong> Em 2025, foram em média 646 novos negócios de beleza por dia, ou 27 por hora. Foram 221.585 MEIs entre eles.</li>
        <li><strong>O Instagram puxa as mensagens.</strong> Em uma pesquisa do Sebrae-SP com 800 MEIs de cabeleireiros, manicure, pedicure e estética, feita em 2025, 79% divulgam no Instagram e 23% trabalham em casa. No estado de São Paulo, são 304,2 mil MEIs do setor.</li>
      </ul>
      <p>Uma ressalva: não encontramos um estudo que meça o uso do WhatsApp só em barbearias e salões, nem quantas mensagens são perdidas. O número de 82% vem da pesquisa Pulso dos Pequenos Negócios, do Sebrae, feita com vários setores.</p>
    </>,
  },
  {
    id: "responde",
    q: "O que a IA responde para os clientes?",
    answer: "Preços, duração dos serviços, horários de funcionamento, endereço e formas de pagamento, sempre com as informações que você der. Ela também recebe pedidos de agendamento: serviço, dia, período, nome e profissional preferido. Pode enviar sua tabela e fotos de cortes, se você subir os arquivos. Não deve orientar sobre alergia ou pele, nem falar de outros clientes.",
    body: <>
      <Comparison caption="O que um agente de IA responde no WhatsApp de uma barbearia ou salão" columns={["Responde?", "Como"]} rows={answers} />
      <p>Veja uma conversa com um pedido de horário e uma pergunta delicada:</p>
      <ChatExample
        business="Studio Demo"
        labels={{ subtitle: "WhatsApp · agente de IA", agent: "Agente: ", patient: "Cliente: " }}
        turns={[
          { from: "patient", text: "Oi! Quanto fica uma progressiva? Meu cabelo é longo" },
          { from: "agent", text: "Oi! Sou a assistente virtual do Studio Demo. A progressiva em cabelo longo fica a partir de R$ 180 e leva cerca de 3 horas. O valor final é definido no atendimento. Quer marcar?" },
          { from: "patient", text: "Quero. Tem sábado de manhã?" },
          { from: "agent", text: "Vou anotar o pedido para sábado de manhã. Qual é o seu nome? Prefere algum profissional?" },
          { from: "patient", text: "Juliana, com a Bia se der. Estou grávida, posso fazer?" },
          { from: "agent", text: "Obrigada, Juliana. Anotei a Bia para sábado de manhã, e o Studio confirma o horário aqui. Sobre a gravidez, prefiro que uma pessoa do Studio responda: ela vai falar com você nesta conversa." },
        ]}
        caption="Conversa ilustrativa de um salão inventado. Preços e tempos sairiam da tabela enviada pelo salão."
        points={[
          { title: "Preço claro", body: "Diz “a partir de” e explica que o valor final é definido no atendimento." },
          { title: "Uma pergunta por vez", body: "Pega nome e profissional sem formulário." },
          { title: "Não promete horário", body: "Sem agenda conectada, o pedido fica para você confirmar." },
          { title: "Para na questão de saúde", body: "Não orienta sobre gravidez e passa a conversa para uma pessoa." },
        ]}
      />
    </>,
  },
  {
    id: "agenda",
    q: "A IA agenda horário sozinha?",
    answer: "Não sem uma agenda conectada. O Wapzen não tem calendário próprio: o agente pega serviço, dia, período e nome, e você confirma na conversa. Ele também pode enviar o link da sua página de agendamento. Com um sistema que ofereça API, uma ferramenta pode consultar horários e marcar, mas isso precisa ser configurado e testado antes.",
    body: <>
      <Comparison caption="Três formas de cuidar dos horários com o agente de IA" columns={["O que precisa", "Quando começa", "Quem marca"]} rows={booking} />
      <p>Para quem trabalha sozinho, a primeira opção costuma bastar: o pedido chega completo e você só escreve “confirmado”. Quando for responder, desligue o <strong>botão de IA</strong> daquele contato para o agente não entrar na conversa. O botão não desliga sozinho.</p>
      <p>Na sua tabela, informe durações realistas. Uma descoloração não ocupa o mesmo tempo que uma escova, e o agente só sabe disso se você escrever. Veja mais em <Link href="/pt-br/blog/agendamento-pelo-whatsapp">agendamento pelo WhatsApp</Link>.</p>
    </>,
  },
  {
    id: "sistema",
    q: "A IA substitui um sistema para barbearia ou salão? Existe sistema grátis?",
    answer: "Não substitui, porque faz outro trabalho. O Wapzen não tem agenda, caixa, comissão nem estoque: ele responde no WhatsApp e nas ligações, e pode trabalhar junto com o sistema que você usa. Não encontramos sistema completo totalmente grátis entre os que consultamos: Trinks dá 5 dias de teste, e Booksy, 7. Para só agendar, o Google Agenda é grátis.",
    body: <>
      <Comparison caption="Sistema de gestão e agente de IA comparados" columns={["Sistema de gestão", "Wapzen"]} rows={software} />
      <h3>Quanto custam os sistemas e agendas</h3>
      <Comparison caption="Preços de sistemas e agendas para barbearia e salão no Brasil" columns={["Preço", "Teste", "Observação"]} rows={systems} />
      <Note>Preços lidos em 6 de novembro de 2026. A página da Trinks mostra R$ 38 e R$ 55 para 1 ou 2 profissionais, sem dizer qual valor é de qual forma de pagamento. Os dados do Koalendar vêm de um guia da própria empresa. Confirme tudo antes de contratar.</Note>
      <p><strong>Qual escolher?</strong> Se o problema é organizar agenda, comissão e caixa, comece por um sistema. Se o problema é responder o WhatsApp com as mãos ocupadas, comece pelo agente. Muitos negócios vão precisar dos dois: o agente responde e envia o link, e o sistema guarda a agenda.</p>
    </>,
  },
  {
    id: "faturar",
    q: "Como a IA ajuda a barbearia ou o salão a faturar mais?",
    answer: "De três jeitos. Você perde menos clientes, porque quem chama à noite ou no meio de um corte recebe resposta na hora. Traz clientes de volta, com mensagens para quem sumiu. E gasta menos, porque o Wapzen não cobra mensalidade nem tarifa por mensagem. Não prometemos resultado: faça a conta abaixo com os seus números.",
    body: <>
      <ul>
        <li><strong>Resposta na hora.</strong> Quem procura um horário costuma chamar mais de um lugar. Ganha vantagem quem responde primeiro.</li>
        <li><strong>Instagram que vira conversa.</strong> Coloque um <Link href="/tools/whatsapp-link-generator">link do WhatsApp</Link> na bio e um <Link href="/tools/whatsapp-qr-code-generator">QR Code</Link> no espelho ou no balcão. O agente responde quem chegar por ali.</li>
        <li><strong>Cliente sumido volta.</strong> Com o Bulk Messages, você envia uma mensagem personalizada para quem não aparece há um tempo. Use só com quem autorizou o contato.</li>
        <li><strong>Mais tempo para atender.</strong> O agente cuida das perguntas repetidas, e você fica com o cliente na cadeira.</li>
      </ul>
      <p>Um modelo para clientes sumidos:</p>
      <pre>{comeback}</pre>
      <h3>Faça a conta com os seus números</h3>
      <p>Este é um exemplo, não uma promessa. Veja quantas mensagens chegaram fora do horário na última semana e troque os valores:</p>
      <ul>
        <li>5 mensagens fora de hora por dia × 26 dias = <strong>130 mensagens por mês</strong>.</li>
        <li>Se 1 em cada 5 virar atendimento = <strong>26 atendimentos</strong>.</li>
        <li>Com tíquete médio de R$ 60 = <strong>R$ 1.560 por mês</strong> que hoje dependem de alguém responder a tempo.</li>
      </ul>
    </>,
  },
  {
    id: "faltas",
    q: "A IA reduz faltas? Ela envia lembretes?",
    answer: "Pode ajudar, mas não envia sozinha lembretes ligados a uma agenda. Com o Bulk Messages, você envia lembretes a partir de uma planilha com telefone, nome, data e hora, e o agente atende quem responder para remarcar. Para lembretes automáticos, é preciso um sistema. Não encontramos dado brasileiro confiável sobre faltas, então não prometemos percentual.",
    body: <>
      <p>O jeito mais simples é preparar toda noite a planilha dos horários do dia seguinte:</p>
      <pre>{reminder}</pre>
      <ul>
        <li><strong>O agente não vê o lembrete.</strong> Por isso, o modelo de instruções manda perguntar o que a pessoa precisa quando alguém responde.</li>
        <li><strong>Tempo de envio.</strong> Com a pausa padrão de 30 segundos entre mensagens, 30 lembretes levam 15 minutos.</li>
        <li><strong>Sinal por Pix.</strong> Se você cobra sinal, escreva a regra e a chave Pix nas instruções. O agente informa, mas não confere o pagamento. Avise a regra de cancelamento antes de marcar, e não depois.</li>
      </ul>
    </>,
  },
  {
    id: "arquivos",
    q: "A IA envia tabela de preços e fotos? Entende áudio?",
    answer: "Sim. Em Images & Files, você sobe fotos de cortes, a tabela em PDF e outros arquivos, e escreve quando cada um deve ser enviado. O agente envia quando a conversa pede. Ele também transcreve áudios e lê fotos, como a do corte que o cliente quer, e responde por texto. Essas duas opções já vêm ligadas, e você pode desligar.",
    body: <>
      <ul>
        <li><strong>Limites de arquivo.</strong> Até 20 por agente, com até 10 MB cada, sem vídeo. Teste antes de contar com isso.</li>
        <li><strong>Autorização de imagem.</strong> Se a foto mostra um cliente, peça autorização antes de usá-la.</li>
        <li><strong>Áudio.</strong> Áudios com mais de 5 minutos ficam sem resposta automática.</li>
        <li><strong>Foto do cliente.</strong> O agente vê a imagem só na mensagem em que ela chegou. Não peça que ele avalie pele ou couro cabeludo: nesses casos, responde uma pessoa.</li>
      </ul>
    </>,
  },
  {
    id: "ligacoes",
    q: "A IA atende ligação enquanto estou atendendo um cliente?",
    answer: "Sim, se a ligação for de WhatsApp. O agente de voz do Wapzen atende no seu número, em português, com as mesmas informações do chat: passa preços e horários e anota pedidos de agendamento. É grátis agora, sem cobrança por minuto. Não atende linha fixa nem chamada comum de celular, e não transfere a ligação para uma pessoa.",
    body: <>
      <p>No Panorama Mobile Time/Opinion Box de janeiro de 2025, com 2.099 entrevistados, 77% dos usuários disseram fazer mais ligações de voz pelo WhatsApp do que pelos minutos da operadora.</p>
      <ul>
        <li><strong>Só ligações de WhatsApp.</strong> Mostre seu WhatsApp no Instagram, no Google e na fachada.</li>
        <li><strong>Sem transferência.</strong> Peça que o agente diga que você vai retornar.</li>
        <li><strong>Pequena pausa.</strong> Há um ou dois segundos antes de cada resposta.</li>
      </ul>
      <p>Mais detalhes em <Link href="/pt-br/ligacao-com-ia">ligação com IA</Link>.</p>
      <InlineCta href={voiceAccess} title="Não perca ligação com as mãos ocupadas" body="O agente de voz também é grátis agora. Fale com a gente no WhatsApp e ativamos no seu número." label="Fale no WhatsApp" />
    </>,
  },
  {
    id: "numero",
    q: "Dá para usar no meu número pessoal? E com vários profissionais?",
    answer: "Sim. O Wapzen funciona no WhatsApp normal e no Business, mas o agente responde todas as conversas individuais, inclusive de amigos e família, e você desliga a IA nesses contatos pelo painel. Com vários profissionais, um número e um agente atendem o negócio todo e anotam o profissional preferido.",
    body: <>
      <ul>
        <li><strong>Trabalha sozinho no número pessoal?</strong> O ideal é ter um número só para o negócio. Se não der, desligue a IA nos contatos pessoais logo no começo.</li>
        <li><strong>Tem equipe?</strong> Cada um pode continuar respondendo pelo celular ou pelo painel. O agente não distribui as conversas entre profissionais.</li>
        <li><strong>Sem API.</strong> Você não troca de número nem faz cadastro na Meta. Em troca, não há selo verde nem modelos aprovados.</li>
      </ul>
    </>,
  },
  {
    id: "custo",
    q: "Quanto custa um agente de IA para barbearia ou salão?",
    answer: "No Wapzen, R$ 0 agora, sem mensalidade e sem tarifa por mensagem. Com a API oficial e uma plataforma como o BotConversa Pro, um salão com 10 conversas por dia e 8 lembretes diários pagaria cerca de R$ 217 por mês: R$ 199 da plataforma no plano anual e R$ 17,78 de tarifas da Meta. Ou seja, cerca de R$ 2.600 por ano.",
    body: <>
      <Comparison caption="Custo de responder clientes no WhatsApp no Brasil: API oficial e Wapzen" columns={["API oficial do WhatsApp", "Wapzen"]} rows={costs} />
      <h3>Um exemplo com números</h3>
      <p>Um salão aberto 26 dias por mês recebe 10 conversas por dia, com 5 respostas por conversa (<strong>1.300 respostas por mês</strong>), e envia 8 lembretes por dia (<strong>208 por mês</strong>):</p>
      <ul>
        <li><strong>Respostas:</strong> tirando as 1.000 grátis, 300 × R$ 0,035 = <strong>R$ 10,50</strong>.</li>
        <li><strong>Lembretes:</strong> 208 × R$ 0,035 = <strong>R$ 7,28</strong>.</li>
        <li><strong>Plataforma:</strong> BotConversa Pro no plano anual = <strong>R$ 199</strong>.</li>
        <li><strong>Total:</strong> <strong>R$ 216,78 por mês</strong>, ou cerca de R$ 2.600 por ano.</li>
        <li><strong>Com o Wapzen:</strong> <strong>R$ 0</strong>.</li>
      </ul>
      <p>Com esse volume, as tarifas da Meta pesam pouco: o maior custo é a mensalidade. Para comparar outras ferramentas, veja o <Link href="/pt-br/blog/chatbot-gratuito-para-whatsapp-business">comparativo de chatbots gratuitos para WhatsApp</Link>.</p>
      <Note>Tarifas da Meta para o Brasil na tabela de 1º de outubro de 2026, que mudam a cada trimestre. Preço do BotConversa lido em 6 de novembro de 2026.</Note>
    </>,
  },
  {
    id: "como-colocar",
    q: "Como colocar IA no WhatsApp da barbearia ou do salão?",
    answer: "Crie uma conta grátis no Wapzen, prepare as instruções, conecte o número com código de pareamento ou QR Code, dê um nome ao agente, cole as instruções e envie sua tabela de serviços. Não precisa de chave de API da Meta, cartão nem programador. Faça isso fora do horário de pico e teste de outro número antes de divulgar.",
    body: <>
      <ol>
        <li><strong>Crie sua conta grátis.</strong> Sem cartão e sem chave de API. O painel está em inglês; o agente responde em português.</li>
        <li><strong>Deixe as instruções prontas.</strong> Adapte o modelo abaixo antes de conectar. O agente entra em funcionamento assim que o número é conectado e, até receber suas instruções, responde de forma genérica.</li>
        <li><strong>Conecte o número.</strong> Em New chat agent, digite seu número para receber um código de 8 caracteres. No WhatsApp, vá em Dispositivos conectados › Conectar um dispositivo › Conectar com número de telefone e digite o código. No computador, você também pode escanear o QR Code.</li>
        <li><strong>Dê um nome e cole as instruções.</strong> Faça isso logo em seguida.</li>
        <li><strong>Envie sua tabela.</strong> Serviços, preços, duração, horários, folgas, endereço, estacionamento e regra de cancelamento, em texto, PDF ou Word. PDF escaneado não pode ser lido: use uma versão com texto selecionável.</li>
        <li><strong>Desligue a IA nos contatos pessoais,</strong> se o número não for só do negócio.</li>
        <li><strong>Teste de outro número.</strong> Tente as perguntas difíceis, como “sou alérgica a tintura” ou “que dia a Carla costuma vir?”.</li>
      </ol>
      <p>Este modelo é de um salão inventado. Troque pelos dados do seu negócio:</p>
      <pre>{prompt}</pre>
      <InlineCta title="Seu WhatsApp responde enquanto você atende" body="Tudo grátis agora, sem chave de API da Meta e sem cartão." label="Comece grátis" />
    </>,
  },
  {
    id: "lgpd",
    q: "O que a LGPD exige em barbearias e salões?",
    answer: "Nome e telefone são dados pessoais, e informações de saúde, como alergia ou gravidez, são dados sensíveis, com proteção maior. Peça pelo chat só o necessário e deixe as questões de saúde para uma pessoa. Envie promoções só a quem autorizou, e lembre que o preço informado pelo agente pode valer como oferta, pelo artigo 30 do Código de Defesa do Consumidor.",
    body: <>
      <p>Isto é uma orientação geral, não aconselhamento jurídico:</p>
      <ul>
        <li><strong>Assistente virtual.</strong> O Wapzen não adiciona esse aviso sozinho, então coloque-o nas instruções, como no modelo.</li>
        <li><strong>Lista de clientes.</strong> Dê uma forma simples de sair e tire da planilha quem pedir. O agente não faz isso por você.</li>
        <li><strong>Tabela atualizada.</strong> Trate o que o agente diz como um anúncio. Mudou o preço, atualize as informações dele.</li>
        <li><strong>Onde ficam os dados.</strong> O banco de dados principal do Wapzen fica em Singapura, os servidores em Singapura e na Alemanha, os arquivos que você sobe para o agente em Seul, e provedores de IA como a OpenAI podem tratar as mensagens nos EUA. O Wapzen não publica um contrato padrão de tratamento de dados: se precisar, fale com a gente antes de conectar o número. Detalhes na <Link href="/privacy">política de privacidade</Link>, em inglês.</li>
      </ul>
    </>,
  },
  {
    id: "nao-faz",
    q: "O que o Wapzen não faz por uma barbearia ou salão?",
    answer: "O Wapzen não é um sistema de gestão: não tem agenda, caixa, comissão nem estoque, e não confirma horário sozinho sem um sistema conectado. Não confere Pix, não escreve primeiro por conta própria e não traz clientes novos como um marketplace. Também não usa a API oficial da Meta, então não há selo verde nem modelos aprovados.",
    body: <>
      <Comparison caption="Para quais negócios de beleza serve um agente de IA gratuito" columns={["Serve?", "Por quê"]} rows={fit} />
      <ul>
        <li><strong>Grupos.</strong> O agente só responde em um grupo se você ligar a IA nele e alguém o marcar ou responder a ele.</li>
        <li><strong>Alternativa oficial.</strong> O <Link href="/pt-br/blog/chatbot-gratuito-para-whatsapp-business">Meta Business Agent</Link> é gratuito por enquanto para empresas qualificadas, e a Meta diz que ele marca horários. Se aparecer no seu app, compare.</li>
        <li><strong>Revise no começo.</strong> Leia as conversas dos primeiros dias e corrija as instruções.</li>
      </ul>
      <p>O Wapzen é um produto independente: não pertence à Meta nem ao WhatsApp.</p>
    </>,
  },
];

export default function IaParaBarbeariaESalaoPage() {
  return <QaPost
    href={href}
    heading={<>IA para barbearia e salão de beleza.<br /><span>Seu WhatsApp responde enquanto você atende.</span></>}
    lead="“Quanto fica corte e barba?”, “tem horário sábado?”, “vocês fazem progressiva?”. As mensagens chegam com a máquina na mão ou a tinta no cabelo da cliente, e à noite sobra uma fila para responder. Aqui respondemos, uma a uma, as dúvidas de barbeiros, cabeleireiras, manicures e esteticistas: o que a IA faz, como fica a agenda, quanto custa e o que ela não substitui."
    verdict={{
      title: "A resposta curta",
      body: <><strong>O Wapzen</strong> é um agente de IA para barbearia e salão de beleza que funciona no número de WhatsApp que você já usa. Ele responde preços, duração e horários, envia sua tabela e fotos, entende áudios e recebe pedidos de agendamento que você confirma. O agente de voz atende ligações de WhatsApp. <strong>Tudo é grátis agora, com conversas ilimitadas e sem chave de API da Meta.</strong> Ele não é um sistema de gestão: não tem agenda, caixa nem comissão.</>,
    }}
    facts={[["Preço", "Grátis agora"], ["Chave de API da Meta", "Não precisa"], ["Conversas", "Ilimitadas"], ["Ligações", "Agente de voz funcionando"]]}
    indexTitle="As 14 perguntas deste guia"
    answerLabel="Resposta curta"
    questions={questions}
    sources={sources}
    related={["/pt-br/blog/agendamento-pelo-whatsapp", "/pt-br/blog/chatbot-gratuito-para-whatsapp-business"]}
    product="/pt-br/chatbot-whatsapp-com-ia"
    cta={{ heading: <>Seus clientes têm resposta enquanto você trabalha.<br /><span>Grátis agora, sem API da Meta.</span></>, body: "Crie sua conta, conecte seu número e ensine o agente com a sua tabela. Sem cartão e sem tarifa por mensagem." }}
  />;
}
