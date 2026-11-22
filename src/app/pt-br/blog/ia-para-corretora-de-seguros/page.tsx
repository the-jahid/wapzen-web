import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { InlineCta, Note, RowTable } from "@/components/blog/BlogPost";
import { CallLog, CallTranscript, DoDont, JobBoard, PlaybookPost, PromptFile, SetupSteps, type CallLogItem, type CallTurn } from "@/components/blog/PlaybookPost";

// Um de dois posts do agente de voz para setores no Brasil (2026-11-22). Buscas de
// docs/seo-blog-br-voice-industries-research.mjs (Google, YouTube e DuckDuckGo no Brasil):
// "ia para corretora de seguros" 76 (3/3) e 30 (3/3) numa segunda rodada, a única frase de
// setor com 3/3 nas duas; "ia para corretores de seguros" 68 (2/3), "ia corretor de seguros"
// 42 (2/3), "ia para seguros" 30 (3/3), "agente de ia para corretora de seguros" 28,
// "ia para venda de seguros" 20 (2/3), "renovação de seguro auto" 20 (2/3).
// Fatos: Lei 15.040/2024 arts. 37, 40 par. único, 53 e 86 lidos no Planalto (texto até o
// art. 86); vigência dita só como "dezembro de 2025" (as fontes divergem entre 10 e 11/12);
// corretores ativos (66.120 empresas + 87.053 pessoas físicas) do CQCS de 03/11/2026 com dados
// da Susep; 71% dos carros sem seguro (CNseg/Senatran, julho de 2026, via CQCS); Política de
// Mensagens do WhatsApp Business em pt-BR (23/09/2026): opt-in para mensagens ou ligações e
// proibição de pedir números de documentos, de conta e de cartão; Segura Conversas pela ENS
// (18/05/2026, republicada no Legismap): API oficial, assinatura mensal, sem preço; preços de
// Retell e Bland conferidos em 21/11/2026.
// Produto: mesmas regras do post de clínicas (um agente ativo por número, sem saber a direção
// da ligação; o agente não recebe nome do lead nem número de quem liga; leads um a um; no
// painel só se criam ferramentas de API; sem transferência ao vivo; transcrições em Call History).
const href = "/pt-br/blog/ia-para-corretora-de-seguros";
const post = blogPost(href);
const voiceAgents = "/dashboard/voice/agents";
const help = `https://wa.me/8801701750469?text=${encodeURIComponent("Olá! Quero ajuda para configurar o agente de voz da Wapzen na minha corretora de seguros.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "pt-BR", article: { publishedTime: post.published, modifiedTime: post.updated } });

const day: CallLogItem[] = [
  { time: "07:40", direction: "in", who: "Cliente com sinistro", said: "“Bati o carro agora há pouco. Ninguém se machucou. O que eu faço?”", outcome: "answered", result: "Perguntou se todos estavam em segurança, perguntou a seguradora e informou o telefone da assistência 24 horas que a corretora cadastrou. Anotou o ocorrido para o corretor." },
  { time: "09:15", direction: "in", who: "Novo contato", said: "“Quero cotar o seguro do meu carro novo.”", outcome: "saved", result: "Coletou modelo, ano, CEP onde o carro dorme, idade do principal condutor, uso particular ou por aplicativo e se tem garagem. Disse que o corretor manda a cotação por mensagem." },
  { time: "11:05", direction: "in", who: "Cliente", said: "“Preciso da segunda via do boleto.”", outcome: "answered", result: "Explicou como emitir a segunda via no aplicativo e no site da seguradora do cliente, com o passo a passo que a corretora cadastrou." },
  { time: "13:30", direction: "in", who: "Cliente", said: "“O meu seguro cobre carro reserva?”", outcome: "team", result: "Disse que a cobertura depende da apólice e que o corretor confere e responde. Não arriscou um sim nem um não." },
  { time: "15:10", direction: "out", who: "Cliente com renovação em dezembro", said: "“Olá! Aqui é a assistente virtual da Corretora Exemplo. Estou ligando porque o seu seguro vence em dezembro. Posso fazer algumas perguntas rápidas para preparar a cotação da renovação?”", outcome: "called", result: "Ligação da campanha de renovações, pelo segundo número da corretora. Perguntou o que mudou (carro, CEP, condutor e uso) e anotou para o corretor." },
  { time: "16:45", direction: "in", who: "Cliente", said: "“Quero cancelar o meu seguro.”", outcome: "saved", result: "Anotou o pedido e o motivo, sem insistir, e disse que o corretor retorna no próximo dia útil, como manda a instrução." },
  { time: "19:20", direction: "in", who: "Cliente desconfiado", said: "“Recebi mensagem de um corretor de vocês pedindo Pix para liberar a apólice. É verdade?”", outcome: "answered", result: "Seguiu a instrução da corretora: pagamento só pelos meios da própria seguradora, nunca para conta de pessoa física. Explicou como consultar o registro do corretor na Susep." },
  { time: "22:10", direction: "in", who: "Cliente na estrada", said: "“O carro quebrou na rodovia. Preciso de guincho.”", outcome: "answered", result: "Informou o telefone da assistência 24 horas da seguradora do cliente e explicou que o guincho é pedido por lá. Anotou para o corretor acompanhar." },
];

const call: CallTurn[] = [
  { who: "agent", text: "Boa noite! Você ligou para a Corretora Exemplo. Aqui é a assistente virtual. Como posso ajudar?" },
  { who: "caller", text: "Oi, acabei de bater o carro. Ninguém se machucou, mas o para-choque ficou bem amassado." },
  { who: "agent", text: "Que bom que ninguém se machucou. Você está num lugar seguro agora?" },
  { who: "caller", text: "Estou. Já tirei o carro da pista." },
  { who: "agent", text: "Ótimo. Para eu localizar o seu seguro, qual é a placa do carro?" },
  { who: "caller", text: "É ABC1D23." },
  { tool: "consultar_apolice", text: "Buscou a placa no sistema da corretora: apólice ativa na Seguradora Exemplo, com assistência 24 horas." },
  { who: "agent", text: "Encontrei. O seu seguro é da Seguradora Exemplo. Para abrir o aviso de sinistro e pedir guincho, se precisar, ligue para a assistência 24 horas deles, no [número da assistência]. Quer que eu repita?" },
  { who: "caller", text: "Repete, por favor." },
  { who: "agent", text: "Claro: [número da assistência]. Se puder, tire fotos dos dois carros e anote a placa do outro veículo. Quer que eu deixe o caso anotado para o seu corretor?" },
  { who: "caller", text: "Quero, sim." },
  { who: "agent", text: "Me conta rapidinho o que aconteceu e onde foi?" },
  { who: "caller", text: "Um carro bateu na minha traseira no semáforo da Avenida Central." },
  { tool: "registrar_ocorrencia", text: "Enviou para a planilha da corretora: placa, resumo do ocorrido, local e horário da ligação." },
  { who: "agent", text: "Pronto, anotei. O seu corretor fala com você amanhã, a partir das nove. Posso ajudar em mais alguma coisa?" },
  { who: "caller", text: "Não, obrigado." },
  { who: "agent", text: "Por nada. Se cuida, e boa noite!" },
];

const prompt = `Você é a assistente virtual da Corretora Exemplo, corretora de seguros, e atende as ligações de WhatsApp dos clientes.
Cumprimente conforme o horário e diga logo no início que é a assistente virtual da corretora.
Fale com calma e de forma breve: de uma a três frases por vez e uma pergunta de cada vez.
Responda só com as informações da corretora: seguradoras parceiras, telefones das assistências 24 horas, ramos que a corretora atende, como emitir segunda via em cada seguradora, documentos pedidos no sinistro e horário de atendimento. Se algo não estiver nessas informações, diga que não tem essa informação e que o corretor responde.
Sinistro ou pane: primeiro pergunte se todos estão bem e em lugar seguro. Se houver feridos, diga para ligar agora para o SAMU no 192 ou para os bombeiros no 193. Depois pergunte a placa ou a seguradora, informe o telefone da assistência 24 horas e explique que o aviso de sinistro e o guincho são pedidos por lá. Anote o ocorrido com registrar_ocorrencia.
Cobertura, franquia e indenização: nunca afirme nem negue. Diga que depende da apólice e que o corretor confere.
Cotação: colete os dados da lista do ramo, um de cada vez, repita tudo no fim e diga que o corretor envia a cotação por mensagem. Nunca diga preço nem prometa desconto.
Nunca peça CPF, RG, CNH, número de cartão ou dados bancários. Se o cliente quiser passar, diga que o corretor pede os documentos por um canal seguro.
Pagamentos: só pelos meios da própria seguradora. Se alguém contar que pediram pagamento para conta de pessoa física, diga que a corretora não cobra assim e explique como consultar o registro do corretor no site da Susep.
Cancelamento ou reclamação: anote o pedido e o motivo, sem insistir, e diga que o corretor retorna no próximo dia útil a partir das 9h.
Quando o cliente tiver o que precisa, agradeça e se despeça.`;

const renewalPrompt = `Você é a assistente virtual da Corretora Exemplo e liga pelo WhatsApp para clientes cujo seguro vence em dezembro.
A abertura já disse quem você é e por que ligou. Ouça a resposta da pessoa.
Se ela topar, pergunte uma coisa de cada vez: se continua com o mesmo carro, se mudou de endereço ou de CEP, se mudou o principal condutor e se passou a usar o carro para trabalho ou aplicativo. Repita as respostas no fim e diga que o corretor manda a cotação da renovação por mensagem.
Você não sabe o nome, a seguradora nem o valor do seguro de cada cliente. Nunca diga preço nem prometa desconto.
Se a pessoa não quiser renovar, agradeça, pergunte se pode anotar o motivo e se despeça, sem insistir.
Se a pessoa disser que não é cliente da corretora, peça desculpas e se despeça.
Nunca peça CPF, RG, CNH, cartão ou dados bancários.`;

const costs = [
  ["Segura (Conversas)", "Assinatura mensal; preço não divulgado", "Mensagens de WhatsApp, pela API oficial", "Feito para corretoras parceiras da Segura"],
  ["Retell AI", "US$ 0,07 a US$ 0,31 por minuto, pagos conforme o uso", "Linha telefônica", "Mostra um caso de uso de ligações de renovação de seguros; telefonia cobrada por minuto"],
  ["Bland AI", "US$ 0,14 por minuto no plano Start", "Linha telefônica", "Telefonia cobrada à parte"],
  ["Wapzen", "Grátis para começar, sem cartão; mais minutos combinados pelo WhatsApp", "Ligações de WhatsApp, no número da corretora", "Não calcula prêmio: coleta os dados e o corretor cota"],
];

export default function IaParaCorretoraDeSegurosPage() {
  return <PlaybookPost
    href={href}
    heading={<>IA para corretora de seguros, com voz.<br /><span>Um agente que atende e liga pelo WhatsApp.</span></>}
    lead="O cliente bate o carro às 22h e liga no WhatsApp do corretor. Outro quer cotar o seguro do carro novo num domingo. Dezenas de apólices vencem no mês que vem. Veja o que um agente de voz com IA faz numa corretora de seguros, uma ligação de sinistro completa, as ligações de renovação, o que a nova Lei do Contrato de Seguro muda, as regras do WhatsApp, como configurar e quanto custa."
    labels={{ chapters: "Neste guia", chapter: "Capítulo" }}
    answer={{
      title: "A resposta curta",
      body: <><strong>IA para corretora de seguros</strong>, na versão por voz, é um agente que atende as ligações de WhatsApp dos clientes a qualquer hora, responde com as informações da corretora, orienta o primeiro passo no sinistro (o telefone da assistência 24 horas de cada seguradora), coleta os dados para a cotação e liga para clientes com renovação chegando. A <strong>Wapzen</strong> coloca esse agente no número de WhatsApp que a corretora já usa, <strong>grátis para começar</strong>. Ele não calcula prêmio, não promete cobertura e não pede CPF na ligação.</>,
      specs: [["Preço", "Grátis para começar, sem cartão"], ["Ligações", "Recebe e faz ligações de WhatsApp"], ["Número", "O WhatsApp que a corretora já usa"], ["Não faz", "Cálculo de prêmio nem promessa de cobertura"]],
    }}
    chapters={[
      {
        id: "por-que",
        title: "Por que voz no WhatsApp faz sentido para corretoras",
        body: <>
          <p>Seguro é venda de confiança, e a hora em que o cliente mais precisa do corretor costuma ser fora do horário: o acidente no sábado, o carro quebrado na estrada à noite. Quase sempre ele liga no WhatsApp. No Panorama Mobile Time/Opinion Box de janeiro de 2025, com 2.099 entrevistados, <strong>77% dos usuários disseram fazer mais ligações de voz pelo WhatsApp</strong> do que pela operadora.</p>
          <p>Quem não atende, perde. A Susep tinha <strong>153.173 corretores com registro ativo</strong> no início de novembro de 2026, sendo 87.053 pessoas físicas e 66.120 empresas, segundo o CQCS. Ao mesmo tempo, <strong>71% dos carros do país circulam sem seguro</strong>, pelo levantamento da CNseg com dados da Senatran de julho de 2026. Há muito cliente para conquistar e muito corretor disputando cada um.</p>
          <p>Um <strong>agente de voz com IA</strong> resolve as duas pontas: atende na hora qualquer ligação de WhatsApp, com as informações da corretora, e faz as ligações repetitivas que ninguém tem tempo de fazer, como avisar a carteira que a renovação está chegando. O <strong>agente da Wapzen</strong> se conecta ao número que a corretora já usa como um dispositivo vinculado, do mesmo jeito que o WhatsApp Web, e o corretor continua usando o número no celular.</p>
        </>,
      },
      {
        id: "dia",
        title: "Um dia de ligações numa corretora",
        body: <>
          <p>Veja um dia de ligações de WhatsApp numa corretora fictícia de seguros de automóvel, residencial e vida, e o que o agente de voz fez em cada uma. Verde é resposta da IA sozinha, âmbar é pedido anotado para o corretor, índigo é assunto do corretor e laranja é uma ligação que a IA fez.</p>
          <CallLog locale="pt-BR" items={day} caption="Um dia ilustrativo numa corretora fictícia. As respostas vêm das informações que a corretora cadastrou, como os telefones das assistências 24 horas de cada seguradora." />
          <p>Duas ligações fora do horário foram atendidas na hora, com o número certo da assistência, e nenhuma pergunta de cobertura recebeu um chute. Cada ligação fica transcrita em <strong>Call History</strong>, no painel, para o corretor ler na manhã seguinte.</p>
        </>,
      },
      {
        id: "tarefas",
        title: "O que a IA faz e o que fica com o corretor",
        body: <>
          <JobBoard columns={[
            { tone: "ai", title: "A IA resolve sozinha", note: "Com as informações que a corretora cadastrou", items: ["Telefone da assistência 24 horas de cada seguradora", "Como emitir segunda via de boleto em cada seguradora", "Documentos pedidos no sinistro", "Horário de atendimento e ramos que a corretora atende", "Como consultar o registro do corretor na Susep", "Alertas contra golpes de pagamento"] },
            { tone: "request", title: "A IA faz e o corretor completa", note: "Com ferramentas de API ou lendo as transcrições", items: ["Coletar os dados de uma cotação", "Localizar a apólice pela placa, se o seu sistema tiver API", "Anotar sinistros, cancelamentos e reclamações", "Ligações de renovação para a carteira"] },
            { tone: "team", title: "Fica com o corretor", note: "A IA explica que o corretor responde", items: ["Calcular prêmio e comparar seguradoras", "Dizer se algo está coberto ou qual é a franquia", "Negociar preço e desconto", "Abrir o aviso de sinistro com a seguradora", "Receber documentos como CPF, RG e CNH", "Seguros de vida e saúde que envolvem dados de saúde"] },
          ]} />
          <p>A regra que separa as colunas: a IA informa o que está escrito e coleta o que o corretor precisa, mas nunca decide nada sobre a apólice. A Lei 15.040/2024 obriga os intervenientes do contrato, como o corretor, a <em>“agir com lealdade e boa-fé e prestar informações completas e verídicas”</em> (art. 37); uma resposta inventada sobre cobertura é exatamente o erro que ninguém quer ver em nome da corretora.</p>
          <InlineCta to={voiceAgents} title="Coloque um agente de voz no WhatsApp da corretora" body="Grátis para começar, sem cartão, no número que os seus clientes já chamam. Crie a conta, vincule o número e faça a primeira ligação de teste hoje." label="Comece grátis" />
        </>,
      },
      {
        id: "sinistro",
        title: "Uma ligação de sinistro, do começo ao fim",
        body: <>
          <p>É assim que soa a ligação mais delicada de uma corretora, fala por fala, com as ações que a IA fez no meio. O cliente fala com alguém na hora, mesmo às dez da noite.</p>
          <CallTranscript locale="pt-BR" title="Ligação de WhatsApp recebida · assistente virtual da Corretora Exemplo" meta="2 min 10 s · português · ferramentas: consultar_apolice, registrar_ocorrencia" turns={call} caption="Ligação ilustrativa. consultar_apolice e registrar_ocorrencia são ferramentas de API que a corretora cria para o próprio sistema e para uma planilha. O aviso de sinistro é feito com a seguradora; o agente só orienta o primeiro passo." />
          <p>Repare na ordem: primeiro a segurança, depois o seguro. A IA <strong>localiza a apólice pela placa</strong>, que não é documento pessoal, <strong>repete o número da assistência</strong> devagar e <strong>registra o caso</strong> para o corretor. Ela não diz se o conserto está coberto nem quanto será a franquia.</p>
          <p>Vale ter na base a lista de documentos que cada seguradora pede no sinistro. Pela Lei 15.040/2024, a seguradora tem até <strong>30 dias para se manifestar sobre a cobertura</strong>, contados da apresentação do aviso com os documentos necessários (art. 86). Com a lista em mãos, a IA ajuda o cliente a não perder tempo com papel faltando.</p>
        </>,
      },
      {
        id: "cotacao",
        title: "Cotação por voz: o que a IA coleta e o que ela não pede",
        body: <>
          <p>Boa parte das ligações de quem ainda não é cliente é “quanto fica o seguro do meu carro?”. A IA não calcula prêmio, mas faz a parte chata: coleta os dados, um de cada vez, e entrega tudo organizado para o corretor cotar no multicálculo. Coloque na base a lista de cada ramo, por exemplo:</p>
          <ul>
            <li><strong>Automóvel:</strong> modelo, ano, CEP onde o carro dorme, idade do principal condutor, uso particular ou por aplicativo e se tem garagem em casa e no trabalho.</li>
            <li><strong>Residencial:</strong> CEP, casa ou apartamento, se é próprio ou alugado e as coberturas que a pessoa quer.</li>
            <li><strong>Empresarial:</strong> ramo de atividade, CEP e o que precisa ser protegido.</li>
          </ul>
          <p>Seguro de vida e plano de saúde são diferentes: a contratação costuma envolver perguntas de saúde, que são dados sensíveis na LGPD. Deixe a IA anotar só o interesse e o corretor conduzir o resto.</p>
          <p><strong>O que a IA nunca pede:</strong> CPF, RG, CNH, cartão ou dados bancários. A Política de Mensagens do WhatsApp Business diz: <em>“Não divulgue nem peça às pessoas que divulguem números completos de cartão de pagamento individual, números de conta financeira, números de documentos de identidade ou outras informações confidenciais.”</em> Quando a cotação vira proposta, o corretor pede os documentos por um canal seguro.</p>
        </>,
      },
      {
        id: "renovacao",
        title: "Ligações de renovação: quem liga primeiro renova",
        body: <>
          <p>A Lei nº 15.040/2024, a nova Lei do Contrato de Seguro, vale desde dezembro de 2025 e mexe com a renovação em dois pontos:</p>
          <ul>
            <li><strong>Renovação automática:</strong> a seguradora deve avisar o contratante, até 30 dias antes do fim, se não vai renovar ou o que pretende mudar. Se ela ficar em silêncio, o contrato é renovado automaticamente (art. 53).</li>
            <li><strong>Renovação que não é automática:</strong> pode ser intermediada por outro corretor, <em>“de livre escolha do segurado ou do estipulante”</em> (art. 40, parágrafo único).</li>
          </ul>
          <p>Ou seja: no seguro que não renova sozinho, o cliente pode trocar de corretor na hora de renovar. Ligar antes, com a conversa já começada, faz diferença. É o trabalho repetitivo que uma IA de voz faz bem: uma ligação curta para cada cliente com seguro vencendo, perguntando o que mudou.</p>
          <p>Na Wapzen, essas ligações saem pelo menu <strong>Outbound</strong>: crie uma campanha como “Renovações de dezembro”, escolha o agente e adicione os clientes. Cada cliente recebe a ligação no WhatsApp assim que você o adiciona, e a campanha mostra quantos atenderam. Antes de começar, saiba como funciona:</p>
          <ul>
            <li><strong>Cada número tem um agente.</strong> O agente usa as mesmas instruções e a mesma abertura nas ligações que recebe e nas que faz, e não sabe sozinho de que lado a ligação começou. Para ter um roteiro de renovação, vincule um segundo número da corretora a um agente só de renovações e deixe o número principal atendendo.</li>
            <li><strong>A abertura vale para a campanha inteira.</strong> A IA não recebe o nome, a seguradora nem o valor de cada cliente. Por isso a abertura fala do mês do vencimento, e você atualiza o mês a cada campanha.</li>
            <li><strong>Um cliente por vez.</strong> Não há envio de planilha nem rediscagem automática. Funciona para as dezenas de renovações do mês de uma corretora pequena ou média.</li>
            <li><strong>Só quem autorizou.</strong> A política do WhatsApp só permite contatar quem deu o número e aceitou receber mensagens ou ligações da empresa. Peça aos clientes que salvem o número das renovações: o WhatsApp tem a opção de silenciar ligações de desconhecidos.</li>
          </ul>
          <p>No agente de renovações, use em <strong>Call Opening</strong> a opção “Agent speaks first” com a mensagem: “Olá! Aqui é a assistente virtual da Corretora Exemplo. Estou ligando porque o seu seguro vence em dezembro. Posso fazer algumas perguntas rápidas para preparar a cotação da renovação?”. E estas instruções:</p>
          <PromptFile locale="pt-BR" name="instrucoes-ligacoes-de-renovacao.txt" text={renewalPrompt} />
        </>,
      },
      {
        id: "regras",
        title: "Regras: Lei do Contrato de Seguro, Susep, LGPD e WhatsApp",
        body: <>
          <p>Além dos artigos acima, três cuidados valem para qualquer IA que fale em nome da corretora:</p>
          <ul>
            <li><strong>Susep:</strong> todo corretor precisa de registro na Susep, e o cliente pode conferir o registro no serviço “Consultar corretores Susep”, no gov.br. Ensinar isso por voz ajuda o cliente a fugir de golpes que usam o nome da corretora.</li>
            <li><strong>LGPD:</strong> colete só o necessário para a cotação ou o atendimento e explique na sua política de privacidade como usa esses dados. Dados de saúde, comuns em vida e saúde, são sensíveis e ficam com o corretor.</li>
            <li><strong>WhatsApp:</strong> contato só com quem deu o número e aceitou mensagens ou ligações, e nenhum pedido de números de documentos, de conta ou de cartão.</li>
          </ul>
          <DoDont
            titles={["Faça", "Não faça"]}
            dos={["Diga no início de toda ligação que é a assistente virtual da corretora", "Cadastre os telefones das assistências 24 horas de cada seguradora", "Mande a IA perguntar primeiro se todos estão bem num sinistro", "Use a placa, não documentos, para localizar a apólice", "Leia as transcrições toda semana e corrija as instruções", "Ligue nas renovações só para clientes que aceitaram ligações"]}
            donts={["Deixar a IA dizer se algo está coberto ou quanto é a franquia", "Deixar a IA dar preço ou prometer desconto", "Pedir CPF, RG, CNH, cartão ou dados bancários na ligação", "Fazer perguntas de saúde por voz", "Insistir com quem disse que não quer renovar", "Ligar para quem nunca pediu contato"]}
          />
          <p>Isto é orientação geral, não parecer jurídico. Para casos específicos, consulte o seu advogado ou o sindicato dos corretores do seu estado.</p>
        </>,
      },
      {
        id: "configurar",
        title: "Como configurar em uma tarde",
        body: <>
          <SetupSteps items={[
            { title: "Monte a base da corretora", time: "40 min", body: <>Seguradoras parceiras com o telefone da assistência 24 horas de cada uma, ramos que a corretora atende, a lista de dados de cotação de cada ramo, como emitir segunda via em cada seguradora, documentos de sinistro, horário de atendimento e a sua regra de pagamentos. Texto, PDF ou Word servem; uma base curta deixa as respostas mais rápidas.</> },
            { title: "Crie a conta e o agente de voz", time: "5 min", body: <>Crie a sua conta grátis e abra <strong>WhatsApp Voice Agents</strong> no menu. O painel é em inglês; a IA fala português.</> },
            { title: "Vincule o WhatsApp da corretora", time: "5 min", body: <>No cartão <strong>Phone Number</strong> do agente, leia o QR Code em WhatsApp › Dispositivos conectados ou use o código de pareamento. O corretor continua usando o número no celular.</> },
            { title: "Instruções, voz e abertura", time: "15 min", body: <>Cole as instruções abaixo e troque o nome e as regras pelos seus. Em idioma, escolha <strong>Portuguese (Brazil)</strong>. Em <strong>Call Opening</strong>, “Agent speaks first, own words” faz a IA cumprimentar conforme o horário, porque ela sabe a data e a hora.</> },
            { title: "Ferramentas de API, se quiser", time: "20 min", body: <>Em <strong>Tools</strong>, crie uma ferramenta que localiza a apólice pela placa, se o seu sistema de gestão tiver API, e outra que manda cada ocorrência para uma planilha ou um e-mail pelo Make ou Zapier. Teste cada uma no cartão <strong>Test tool</strong>.</> },
            { title: "Teste com os casos difíceis", time: "15 min", body: <>De outro celular, ligue para o número da corretora, ou digite o seu número no cartão <strong>Test call</strong> para a IA ligar para você. Simule um sinistro à noite, peça desconto, pergunte se algo está coberto, conte um golpe de Pix e tente passar o CPF. Leia as transcrições e ajuste.</> },
          ]} />
          <PromptFile locale="pt-BR" name="instrucoes-agente-de-voz-corretora.txt" text={prompt} />
          <Note>Cada ligação começa do zero: a IA não lembra ligações anteriores do mesmo cliente e não vê o número de quem liga, por isso pergunta a placa ou a seguradora. Ela também não transfere a ligação para o corretor; anota o assunto e diz quando ele retorna.</Note>
          <InlineCta href={help} title="Prefere configurar com ajuda?" body="A nossa equipe ajuda a montar a base, as instruções e as ferramentas da sua corretora, pelo WhatsApp." label="Falar no WhatsApp" />
        </>,
      },
      {
        id: "custo",
        title: "Quanto custa e como se compara",
        body: <>
          <RowTable caption="IA para corretoras de seguros comparada, preços conferidos em 21 de novembro de 2026" firstColumn="Opção" columns={["Quanto custa", "Atende por", "Bom saber"]} rows={costs} highlight="Wapzen" />
          <p>Plataformas de voz por linha telefônica cobram por minuto, em dólar: para 1.000 minutos por mês, a calculadora da Retell mostra cerca de <strong>US$ 110</strong> com as opções padrão, e o plano Start da Bland, <strong>US$ 140</strong>, antes da telefonia. A Segura vende o Conversas, de mensagens pela API oficial do WhatsApp, por assinatura mensal, sem preço publicado. Na Wapzen, a ligação passa pelo WhatsApp, sem custo de operadora, e o agente é grátis para começar; se a corretora precisar de mais minutos, combina com a nossa equipe pelo WhatsApp.</p>
          <p><strong>Escolha uma plataforma de telefonia</strong> se os seus clientes ligam para um número fixo ou se você precisa transferir ligações ao vivo. <strong>Escolha a Wapzen</strong> se eles já ligam no seu WhatsApp e você quer atender o sinistro das 22h hoje mesmo. Para atender também por mensagem de texto, veja <Link href="/pt-br/blog/ia-para-responder-whatsapp">IA para responder WhatsApp</Link>. A Wapzen é um produto independente: não é da Meta nem do WhatsApp.</p>
        </>,
      },
    ]}
    faq={[
      { q: "Qual a melhor IA para corretora de seguros?", a: "Depende de onde o cliente fala com você. Para mensagens de WhatsApp pela API oficial, a Segura vende o Conversas por assinatura mensal, sem preço publicado. Para ligações por linha telefônica, Retell e Bland cobram por minuto em dólar. Para atender e fazer ligações de WhatsApp no número que a corretora já usa, grátis para começar, existe a Wapzen, que é o nosso produto." },
      { q: "A IA consegue fazer cotação de seguro?", a: "Ela coleta os dados da cotação por voz, um de cada vez, como modelo, ano, CEP e idade do principal condutor, e entrega tudo ao corretor. Ela não calcula prêmio nem promete desconto, e não pede CPF, RG ou CNH na ligação, porque a política do WhatsApp proíbe pedir números de documentos." },
      { q: "A IA pode abrir um sinistro?", a: "Não. O aviso de sinistro é feito com a seguradora. A IA pergunta se todos estão bem, informa o telefone da assistência 24 horas da seguradora do cliente, explica os documentos e registra o caso para o corretor. Pela Lei 15.040/2024, a seguradora tem até 30 dias para se manifestar sobre a cobertura depois de receber o aviso com os documentos necessários." },
      { q: "A IA pode ligar para clientes na renovação?", a: "Pode. No menu Outbound da Wapzen você cria uma campanha de renovações e adiciona os clientes um a um; cada um recebe a ligação na hora. Como cada número tem um agente e a IA não recebe o nome nem a apólice de cada cliente, o ideal é um segundo número só para renovações, com uma abertura que fala do mês do vencimento." },
      { q: "O que a nova Lei do Contrato de Seguro muda na renovação?", a: "A Lei 15.040/2024, em vigor desde dezembro de 2025, manda a seguradora avisar até 30 dias antes do fim se não vai renovar um seguro com renovação automática; sem aviso, ele é renovado (art. 53). E a renovação que não é automática pode ser intermediada por outro corretor, de livre escolha do segurado (art. 40, parágrafo único)." },
      { q: "Ligar com IA pelo WhatsApp é permitido?", a: "A política do WhatsApp permite contatar só quem deu o número e aceitou receber mensagens ou ligações da empresa. As regras da Anatel, como o Não Me Perturbe e o prefixo 0303, foram feitas para ligações de telefonia. O caminho seguro é ligar só para clientes que autorizaram, dizer logo que é uma assistente virtual e seguir a LGPD." },
      { q: "A IA transfere a ligação para o corretor?", a: "Não. O WhatsApp não permite passar uma ligação em andamento para outra pessoa. A IA anota o assunto e diz quando o corretor retorna, e o corretor lê a transcrição de cada ligação em Call History, no painel." },
      { q: "Quanto custa um agente de voz para corretora de seguros?", a: "Na Wapzen é grátis para começar, sem cartão, e a ligação passa pelo WhatsApp, sem custo de operadora; mais minutos são combinados com a equipe pelo WhatsApp. Plataformas de voz por linha telefônica cobram por minuto: a Retell de US$ 0,07 a US$ 0,31 e a Bland US$ 0,14 no plano Start (preços de 21 de novembro de 2026)." },
    ]}
    sources={[
      { label: "Lei nº 15.040/2024 (Lei do Contrato de Seguro): arts. 37, 40, 53 e 86", href: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l15040.htm" },
      { label: "CQCS: mercado alcança marca histórica de 170 mil corretores registrados (03/11/2026)", href: "https://cqcs.com.br/noticia/mercado-alcanca-marca-historica-de-170-mil-corretores-registrados/" },
      { label: "CQCS: 71% dos carros no Brasil circulam sem seguro, aponta levantamento (julho de 2026)", href: "https://cqcs.com.br/noticia/71-dos-carros-no-brasil-circulam-sem-seguro-aponta-levantamento/" },
      { label: "Teletime: Panorama Mobile Time/Opinion Box sobre ligações pelo WhatsApp (2025)", href: "https://teletime.com.br/28/02/2025/77-dos-brasileiros-preferem-ligacoes-pelo-whatsapp-mostra-pesquisa/" },
      { label: "Política de Mensagens do WhatsApp Business (atualizada em 23/09/2026)", href: "https://whatsappbusiness.com/pt-br/policy/" },
      { label: "gov.br: consultar corretores Susep", href: "https://www.gov.br/pt-br/servicos/consultar-corretores-susep" },
      { label: "ENS, via Legismap: Segura leva IA operacional para o WhatsApp dos corretores (18/05/2026)", href: "https://legismap.com.br/conteudos/artigos-e-noticias/segura-leva-ia-operacional-para-o-whatsapp-dos-corretores-de-seguros" },
      { label: "Retell AI: preços", href: "https://www.retellai.com/pricing" },
      { label: "Bland AI: preços", href: "https://www.bland.ai/pricing" },
    ]}
    related={["/pt-br/blog/agente-de-voz-ia-whatsapp-gratis", "/pt-br/blog/ia-para-responder-whatsapp"]}
    product="/pt-br/ligacao-com-ia"
    cta={{ heading: <>Nenhum sinistro sem resposta.<br /><span>Grátis no WhatsApp da sua corretora.</span></>, body: "Crie a sua conta, vincule o número da corretora e faça a primeira ligação de teste hoje. Se preferir ajuda, a nossa equipe configura com você pelo WhatsApp." }}
    signUpTo={voiceAgents}
  />;
}
