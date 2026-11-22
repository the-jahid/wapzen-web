import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { InlineCta, Note, RowTable } from "@/components/blog/BlogPost";
import { CallLog, CallTranscript, DoDont, JobBoard, PlaybookPost, PromptFile, SetupSteps, type CallLogItem, type CallTurn } from "@/components/blog/PlaybookPost";

// Um de dois posts do agente de voz para setores no Brasil (2026-11-22). Buscas de
// docs/seo-blog-br-voice-industries-research.mjs (Google, YouTube e DuckDuckGo no Brasil):
// "secretária virtual para médicos" 70 (2/3), "agente de ia para clinica odontologica" 70 (2/3),
// "ia para consultório médico" 40 (2/3), "chatbot para clínicas" 40 (2/3), "agente de ia para
// clinica de estetica" 35, "ia para dentistas" 30 (3/3), "agente de ia para clinica" 29,
// "confirmação de consulta (pelo whatsapp)" e "lembrete de consulta" 20 (2/3) cada.
// Fatos: Resolução CFM 2.454/2026 pela notícia do CFM (o PDF recusa este computador); Política
// de Mensagens do WhatsApp Business em pt-BR, atualizada em 23/09/2026; LGPD arts. 5º II e 11;
// salário médio de recepcionista de consultório (CBO 4221-10) no Salario.com.br a partir do
// Novo CAGED, lido em 22/11/2026; preços de Retell e Bland conferidos em 21/11/2026.
// Produto, conforme o servidor Go (voicecall) e o painel em 22/11/2026: só ligações de WhatsApp;
// um agente ativo por número, com as mesmas instruções e abertura nas ligações recebidas e
// feitas, sem saber de que lado a ligação começou; o agente não recebe o nome do lead nem o
// número de quem liga; leads um a um (sem planilha, sem rediscagem); no painel só se criam
// ferramentas de API (sem enviar mensagem nem transferir no meio da ligação); transcrições em
// Call History; cada ligação começa do zero. Faltas: nenhum percentual citado (os estudos
// brasileiros não abriram neste computador). O CTA final leva ao cadastro e à página de agentes
// de voz, que já funciona sozinha em produção; a ajuda pelo WhatsApp fica como segunda opção.
const href = "/pt-br/blog/agente-de-voz-ia-para-clinicas";
const post = blogPost(href);
const voiceAgents = "/dashboard/voice/agents";
const help = `https://wa.me/8801701750469?text=${encodeURIComponent("Olá! Quero ajuda para configurar o agente de voz da Wapzen na minha clínica.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "pt-BR", article: { publishedTime: post.published, modifiedTime: post.updated } });

const day: CallLogItem[] = [
  { time: "07:05", direction: "in", who: "Mãe de paciente", said: "“Bom dia! A pediatra atende hoje? A partir de que horas?”", outcome: "answered", result: "Disse que a Dra. Luísa atende às segundas, quartas e sextas, das 8h às 12h, e que a recepção abre às 7h30, como está na agenda cadastrada." },
  { time: "08:20", direction: "in", who: "Paciente novo", said: "“Queria marcar com o dermatologista. Vocês aceitam o meu convênio?”", outcome: "booked", result: "Conferiu o convênio na lista da clínica, consultou a agenda por uma ferramenta de API e marcou quinta-feira às 9h depois que o paciente disse sim." },
  { time: "10:10", direction: "in", who: "Paciente particular", said: "“Quanto custa a consulta com o cardiologista? Aceita Pix?”", outcome: "answered", result: "Informou o valor da tabela da clínica, R$ 280, e as formas de pagamento: Pix, débito e crédito em até 3 vezes." },
  { time: "12:35", direction: "in", who: "Paciente com exame amanhã", said: "“Preciso ficar em jejum para o exame de sangue?”", outcome: "answered", result: "Repetiu a orientação de preparo que a clínica cadastrou para esse exame e lembrou de levar o pedido médico." },
  { time: "14:30", direction: "in", who: "Familiar preocupada", said: "“Meu pai está com dor no peito e suando frio. O que ele pode tomar?”", outcome: "urgent", result: "Disse que não pode orientar sobre sintomas e pediu para ligar agora para o SAMU, no 192. Não fez nenhuma pergunta sobre o caso." },
  { time: "16:05", direction: "in", who: "Paciente", said: "“Meu resultado já saiu? Você pode ler para mim?”", outcome: "team", result: "Explicou que resultados não são passados por telefone e como a clínica entrega cada exame, conforme as instruções." },
  { time: "17:30", direction: "out", who: "Paciente com consulta amanhã", said: "“Olá! Aqui é a assistente virtual da Clínica Exemplo. Estou ligando para confirmar a sua consulta de amanhã. Você vai conseguir vir?”", outcome: "called", result: "Ligação da campanha de confirmação, feita pelo segundo número da clínica. A paciente pediu para remarcar, e a IA anotou que ela prefere sexta à tarde." },
  { time: "21:40", direction: "in", who: "Paciente", said: "“Vocês abrem no sábado? Fazem limpeza de pele?”", outcome: "saved", result: "Disse que a clínica abre aos sábados das 8h às 12h, explicou o procedimento com o preço da tabela e anotou o pedido de horário para a recepção confirmar na segunda." },
];

const call: CallTurn[] = [
  { who: "agent", text: "Bom dia! Você ligou para a Clínica Exemplo. Aqui é a assistente virtual da clínica. Como posso ajudar?" },
  { who: "caller", text: "Bom dia! Queria marcar uma consulta com o dermatologista. Vocês atendem pelo Convênio Exemplo?" },
  { who: "agent", text: "Atendemos, sim. A Dra. Camila atende dermatologia às terças e quintas. Você prefere de manhã ou à tarde?" },
  { who: "caller", text: "De manhã, se tiver nesta semana." },
  { tool: "consultar_horarios", text: "Consultou a agenda da clínica: quinta-feira às 9h e às 10h30 estão livres com a Dra. Camila." },
  { who: "agent", text: "Tenho quinta-feira às nove ou às dez e meia. Qual fica melhor?" },
  { who: "caller", text: "Nove horas." },
  { who: "agent", text: "Perfeito. Qual é o seu nome completo?" },
  { who: "caller", text: "Rafael Moreira." },
  { who: "agent", text: "Obrigada, Rafael. Então fica assim: dermatologia com a Dra. Camila, quinta-feira às nove da manhã, pelo Convênio Exemplo. Posso confirmar?" },
  { who: "caller", text: "Pode." },
  { tool: "marcar_consulta", text: "Marcou quinta-feira, 9h, para Rafael Moreira, dermatologia. Código da consulta: CE-4821." },
  { who: "agent", text: "Pronto, está marcado. Traga a carteirinha do convênio e um documento com foto, e chegue quinze minutos antes. Posso ajudar em mais alguma coisa?" },
  { who: "caller", text: "Não, era só isso. Obrigado!" },
  { who: "agent", text: "Por nada, Rafael. Até quinta-feira!" },
];

const prompt = `Você é a assistente virtual da Clínica Exemplo e atende as ligações de WhatsApp dos pacientes.
Cumprimente com bom dia, boa tarde ou boa noite, conforme o horário, e diga logo no início que é a assistente virtual da clínica.
Fale de forma calorosa e breve: de uma a três frases por vez e uma pergunta de cada vez.
Responda só com as informações da clínica que você recebeu: médicos e dias de atendimento, horários e feriados, especialidades, convênios aceitos, preço da consulta particular, formas de pagamento, preparo de exames, endereço, estacionamento e como a clínica entrega resultados. Se algo não estiver nessas informações, diga que não tem essa informação e informe o horário da recepção.
Você não é médica nem enfermeira. Nunca oriente sobre sintomas, remédios, exames, resultados ou diagnósticos. Se perguntarem, diga que isso é com o médico, na consulta.
Urgência: se a pessoa falar de dor no peito, falta de ar, sangramento forte, desmaio, convulsão, sinais de AVC ou qualquer coisa que pareça grave, diga para ligar agora para o SAMU no 192 ou ir ao pronto-socorro mais próximo, e não faça mais perguntas.
Agendamento: pergunte a especialidade, o convênio ou se é particular, e se prefere manhã ou tarde. Veja os horários livres com consultar_horarios, repita especialidade, médico, dia, horário e nome completo, e só marque com marcar_consulta depois de um sim claro.
Sem a ferramenta de agenda: anote especialidade, período preferido e nome completo, e diga que a recepção confirma o horário por mensagem até o fim do próximo dia útil.
Nunca peça CPF, RG, número da carteirinha, cartão ou dados bancários.
Quando o paciente tiver o que precisa, agradeça e se despeça.`;

const confirmPrompt = `Você é a assistente virtual da Clínica Exemplo e liga pelo WhatsApp para pacientes que têm consulta marcada para amanhã.
A abertura já disse quem você é e por que ligou. Ouça a resposta da pessoa.
Se ela confirmar, agradeça, lembre de chegar quinze minutos antes com documento com foto e a carteirinha do convênio, e se despeça.
Se ela não puder ir, pergunte se quer remarcar e que dias e período prefere. Anote e diga que a recepção manda as opções de horário por mensagem até o meio-dia.
Você não sabe o horário nem o médico de cada paciente. Se perguntarem, diga que a recepção confirma por mensagem.
Se a pessoa disser que não tem consulta ou que não é a paciente, peça desculpas, não dê nenhum detalhe e se despeça.
Nunca fale de sintomas, exames ou diagnósticos. Nunca peça documentos, cartão ou dados bancários.`;

const costs = [
  ["Recepcionista contratada", "Média de R$ 1.814,67 de salário por mês, sem encargos (Salario.com.br, dados do Novo CAGED)", "Telefone, WhatsApp e balcão, no horário de trabalho", "Insubstituível no balcão; a IA cobre a noite, o fim de semana e os picos"],
  ["Retell AI", "US$ 0,07 a US$ 0,31 por minuto, pagos conforme o uso", "Linha telefônica", "Número a partir de US$ 2 por mês; telefonia cobrada por minuto"],
  ["Bland AI", "US$ 0,14 por minuto no plano Start", "Linha telefônica", "Telefonia cobrada à parte"],
  ["Plataformas da WhatsApp Business Calling API", "Ligações que o paciente faz são grátis na Meta; as que a clínica faz são cobradas por minuto, mais a plataforma", "WhatsApp, pela API oficial", "O paciente precisa autorizar antes de a clínica ligar"],
  ["Wapzen", "Grátis para começar, sem cartão; mais minutos combinados pelo WhatsApp", "WhatsApp, no número que a clínica já usa", "Sem custo de operadora: a ligação passa pela internet"],
];

export default function AgenteDeVozIaParaClinicasPage() {
  return <PlaybookPost
    href={href}
    heading={<>Agente de voz com IA para clínicas e consultórios.<br /><span>A secretária virtual que atende e liga pelo WhatsApp.</span></>}
    lead="Os pacientes ligam para a clínica pelo WhatsApp para saber de horários, convênios e preços, e para marcar consulta, muitas vezes quando a recepção está ocupada ou fechada. Veja o que uma secretária virtual com IA pode fazer com segurança, um dia de ligações, uma ligação completa, as regras do CFM, da LGPD e do WhatsApp, como configurar e quanto custa."
    labels={{ chapters: "Neste guia", chapter: "Capítulo" }}
    answer={{
      title: "A resposta curta",
      body: <>Um <strong>agente de voz com IA para clínicas</strong> é uma secretária virtual que fala: atende as ligações de WhatsApp dos pacientes a qualquer hora, responde com as informações da clínica (horários, convênios, preços, endereço, preparo de exames), marca consultas no seu sistema por API ou anota o pedido para a recepção, e liga para pacientes para confirmar consultas. A <strong>Wapzen</strong> coloca esse agente no número de WhatsApp que a clínica já usa, <strong>grátis para começar</strong>. Ele fica na recepção: não fala de sintomas, diagnósticos ou resultados de exames.</>,
      specs: [["Preço", "Grátis para começar, sem cartão"], ["Ligações", "Recebe e faz ligações de WhatsApp"], ["Número", "O WhatsApp que a clínica já usa"], ["Ideal para", "Recepção, nunca orientação clínica"]],
    }}
    chapters={[
      {
        id: "o-que-e",
        title: "O que é um agente de voz para clínicas",
        body: <>
          <p>Um agente de voz, também chamado de secretária virtual com IA ou atendente virtual, é um programa que conversa por telefone de verdade. Ele ouve o que o paciente diz, responde com as informações que você cadastrou e pode agir, por exemplo, marcando um horário no seu sistema de agenda. Não tem menu de “digite 1 para agendamento”: o paciente simplesmente fala o que precisa.</p>
          <p>Não confunda com os serviços de secretária virtual terceirizada, em que pessoas atendem o telefone em nome da clínica e cobram por pacote de ligações. Aqui quem atende é a IA, com as regras que você escreveu, a qualquer hora.</p>
          <p>A maioria das ligações para a recepção repete as mesmas perguntas: vocês abrem hoje, quanto custa, aceitam o meu convênio, tem horário nesta semana, onde eu estaciono. São exatamente as ligações que uma IA de voz resolve bem, às 7h, no horário de almoço e no domingo à noite.</p>
          <p><strong>O agente da Wapzen atende ligações de WhatsApp.</strong> Ele se conecta ao número de WhatsApp ou WhatsApp Business que a clínica já usa como um dispositivo vinculado, do mesmo jeito que o WhatsApp Web, e a recepção continua usando o número no celular. Quando o paciente toca em “ligar” na conversa com a clínica, a IA atende. Ela também liga para pacientes que aceitaram receber ligações. Ligações para o telefone fixo continuam com a recepção.</p>
          <p>Faz sentido no Brasil porque o paciente já liga pelo WhatsApp: no Panorama Mobile Time/Opinion Box de janeiro de 2025, com 2.099 entrevistados, <strong>77% dos usuários disseram fazer mais ligações de voz pelo WhatsApp</strong> do que pela operadora, e 60% ligam pelo app todo dia ou quase todo dia.</p>
        </>,
      },
      {
        id: "dia",
        title: "Um dia de ligações na recepção",
        body: <>
          <p>Veja um dia de ligações de WhatsApp numa clínica fictícia, com clínica médica, dermatologia e estética, e o que o agente de voz fez em cada uma. Verde é resposta da IA sozinha, azul é a agenda da clínica consultada por API, vermelho é urgência, índigo é assunto da equipe, âmbar é pedido anotado e laranja é uma ligação que a IA fez.</p>
          <CallLog locale="pt-BR" items={day} caption="Um dia ilustrativo numa clínica fictícia. As respostas vêm das informações que a clínica cadastrou; marcar na agenda exige uma ferramenta de API ligada ao sistema da clínica." />
          <p>Oito ligações, duas fora do horário, e só duas deixaram tarefa para a recepção: uma remarcação e um pedido de horário. A transcrição de cada ligação fica em <strong>Call History</strong>, no painel, com o que foi dito e o que a IA fez.</p>
        </>,
      },
      {
        id: "tarefas",
        title: "O que a IA resolve e o que fica com a recepção",
        body: <>
          <JobBoard columns={[
            { tone: "ai", title: "A IA resolve sozinha", note: "Com as informações que a clínica cadastrou", items: ["Horários, feriados e os dias de cada médico", "Convênios aceitos e preço da consulta particular", "Formas de pagamento, como Pix e cartão", "Endereço, estacionamento e ponto de referência", "Preparo de exames cadastrado pela clínica", "Ligações em outro idioma, no modo multilíngue"] },
            { tone: "request", title: "A IA faz com o seu sistema", note: "Por ferramentas de API ou com a recepção confirmando", items: ["Marcar, remarcar e cancelar consultas", "Anotar pedidos de horário para a recepção", "Ligações para confirmar consultas", "Ligações para pacientes que precisam voltar"] },
            { tone: "team", title: "Fica com a equipe", note: "A IA explica ao paciente como resolver", items: ["Sintomas, diagnósticos e qualquer orientação médica", "Resultados de exames e receitas", "Urgências: a IA indica o SAMU 192", "Autorização de guias do convênio", "Cobranças, reembolsos e reclamações", "Qualquer dado do prontuário"] },
          ]} />
          <p>A linha entre as colunas é a linha entre a informação da recepção e o cuidado clínico. A IA nunca vê o prontuário, e nem deve: o que ela sabe vem das informações escritas da clínica e, para marcar, do seu sistema de agenda.</p>
          <InlineCta to={voiceAgents} title="Coloque uma secretária virtual no WhatsApp da clínica" body="Grátis para começar, sem cartão, no número que os pacientes já chamam. Crie a conta, vincule o número e faça a primeira ligação de teste hoje." label="Comece grátis" />
        </>,
      },
      {
        id: "ligacao",
        title: "Uma ligação completa: marcando uma consulta",
        body: <>
          <p>É assim que soa uma ligação de agendamento, fala por fala, com as ações que a IA fez no meio. O paciente não espera na linha e não aperta nenhuma tecla.</p>
          <CallTranscript locale="pt-BR" names={{ caller: "Paciente" }} title="Ligação de WhatsApp recebida · assistente virtual da Clínica Exemplo" meta="1 min 50 s · português · ferramentas: consultar_horarios, marcar_consulta" turns={call} caption="Ligação ilustrativa. consultar_horarios e marcar_consulta são ferramentas de API que a clínica cria para o próprio sistema de agenda. O agente não vê o número de quem liga: se o seu sistema precisar do celular, inclua a pergunta nas instruções." />
          <p>Três detalhes fazem a diferença. A IA <strong>consulta a agenda</strong> em vez de inventar horário. <strong>Repete os dados</strong> e só marca depois de um sim claro. E <strong>lembra o que levar</strong>, tirado das informações da clínica. Se o seu sistema de agenda já manda confirmação por mensagem, o paciente também recebe tudo por escrito.</p>
        </>,
      },
      {
        id: "agenda",
        title: "Três formas de cuidar do agendamento",
        body: <>
          <ol>
            <li><strong>Agenda integrada.</strong> Se o seu sistema de agenda tem API, crie duas ferramentas de API: uma que consulta horários livres e outra que marca. A IA passa a marcar direto na agenda real durante a ligação. Se o sistema não tem API aberta, um serviço sem código como Make ou Zapier pode ficar no meio. Teste cada ferramenta no cartão <strong>Test tool</strong>, em Tools, antes de um paciente usar.</li>
            <li><strong>Pedido anotado.</strong> Sem ferramenta nenhuma, a IA anota especialidade, período preferido e nome, e avisa que a recepção confirma por mensagem. A recepção lê as transcrições em Call History e confirma. Não há alerta a cada ligação: confira algumas vezes por dia, ou crie uma ferramenta de API que mande cada pedido para uma planilha ou um e-mail pelo Make ou Zapier.</li>
            <li><strong>Começar simples.</strong> A maioria das clínicas começa pelo pedido anotado no primeiro dia e liga a agenda depois, quando já sabe o que os pacientes mais pedem.</li>
          </ol>
          <p>Para agendar também por mensagem de texto, veja o guia de <Link href="/pt-br/blog/agendamento-pelo-whatsapp">agendamento pelo WhatsApp</Link>.</p>
        </>,
      },
      {
        id: "confirmacao",
        title: "Ligações para confirmar consultas",
        body: <>
          <p>Falta sem aviso é horário perdido: o médico fica parado, e outro paciente poderia ter usado a vaga. Ligar na véspera para confirmar é a forma mais antiga de reduzir faltas, e é justamente o trabalho repetitivo que uma IA de voz faz bem.</p>
          <p>Na Wapzen, as ligações saem pelo menu <strong>Outbound</strong>: crie uma campanha, escolha o agente e adicione os pacientes de amanhã. Cada paciente recebe a ligação no WhatsApp assim que você o adiciona, e a campanha mostra quantos atenderam e quanto durou cada ligação. Antes, conheça quatro regras do jogo:</p>
          <ul>
            <li><strong>Um número, um agente.</strong> Cada número de WhatsApp tem um agente de voz, que usa as mesmas instruções e a mesma abertura nas ligações que recebe e nas que faz, e ele não sabe sozinho de que lado a ligação começou. Para confirmar consultas com um roteiro próprio, vincule um segundo número da clínica a um agente só de confirmações.</li>
            <li><strong>Abertura geral.</strong> A IA não recebe o nome nem o horário de cada paciente da campanha. Por isso a abertura fala da “consulta de amanhã”, e o horário vem da recepção, por mensagem, ou de uma ferramenta de API que consulta a agenda.</li>
            <li><strong>Um paciente por vez.</strong> Não há envio de planilha nem rediscagem automática: a confirmação diária funciona para dezenas de pacientes, não para milhares.</li>
            <li><strong>Só quem autorizou.</strong> A política do WhatsApp exige que o paciente tenha dado o número e aceitado receber mensagens ou ligações da clínica. Peça também que ele salve o número: o WhatsApp tem a opção de silenciar ligações de desconhecidos, e uma ligação silenciada não toca.</li>
          </ul>
          <p>No agente de confirmações, use em <strong>Call Opening</strong> a opção “Agent speaks first” com esta mensagem: “Olá! Aqui é a assistente virtual da Clínica Exemplo. Estou ligando para confirmar a sua consulta de amanhã. Você vai conseguir vir?”. E estas instruções:</p>
          <PromptFile locale="pt-BR" name="instrucoes-confirmacao-de-consultas.txt" text={confirmPrompt} />
        </>,
      },
      {
        id: "regras",
        title: "Regras para usar IA na clínica: CFM, LGPD e WhatsApp",
        body: <>
          <p>Desde 26 de agosto de 2026 vale a <strong>Resolução CFM nº 2.454/2026</strong>, a primeira norma do CFM só sobre inteligência artificial na medicina. Segundo o próprio CFM, ela proíbe delegar à IA a comunicação de diagnósticos sem mediação humana, exige informar o paciente de forma clara quando a IA apoia o atendimento e cobra sigilo e segurança dos dados de saúde. Uma secretária virtual que cuida de agenda e informações não faz ato médico, mas o caminho seguro segue o espírito da norma: ela se apresenta como assistente virtual e não fala de diagnóstico, exame ou tratamento.</p>
          <p>Na <strong>LGPD</strong>, dado de saúde é dado pessoal sensível (art. 5º, II) e só pode ser tratado nas hipóteses do art. 11. Peça só o necessário para marcar: nome, especialidade e horário. Os sintomas ficam para a consulta.</p>
          <p>A <strong>Política de Mensagens do WhatsApp Business</strong>, atualizada em 23 de setembro de 2026, diz: <em>“Não utilize o WhatsApp para fornecer telemedicina nem enviar ou solicitar informações relacionadas à saúde se as leis aplicáveis proibirem a distribuição dessas informações a sistemas que não cumprem os requisitos necessários para processar informações relacionadas à saúde.”</em> A mesma política proíbe pedir números completos de cartão, números de conta e números de documentos de identidade.</p>
          <DoDont
            titles={["Faça", "Não faça"]}
            dos={["Diga no início de toda ligação que é a assistente virtual da clínica", "Cadastre por escrito horários, convênios, preços, preparo de exames e endereço", "Escreva nas instruções o que fazer numa urgência, com o SAMU 192", "Mantenha a agenda no seu sistema e deixe a IA usá-la por ferramentas de API", "Leia as transcrições toda semana e corrija as instruções", "Ligue só para pacientes que deram o número e aceitaram ligações"]}
            donts={["Deixar a IA orientar sobre sintomas ou remédios", "Deixar a IA ler resultados, receitas ou diagnósticos", "Pedir CPF, RG, carteirinha, cartão ou dados bancários", "Usar a IA para teleconsulta", "Prometer encaixe ou horário que a recepção não confirmou", "Ligar para quem não pediu contato"]}
          />
          <p>Isto é orientação geral, não parecer jurídico. Na dúvida, fale com o advogado da clínica ou com o seu conselho regional.</p>
        </>,
      },
      {
        id: "configurar",
        title: "Como configurar em uma tarde",
        body: <>
          <SetupSteps items={[
            { title: "Junte as informações da clínica", time: "45 min", body: <>Médicos e dias de atendimento, horários e feriados, especialidades, convênios aceitos, preço da consulta particular, formas de pagamento, endereço com ponto de referência, estacionamento, preparo de exames e como a clínica entrega resultados. Texto, PDF ou Word servem. Uma base curta, de poucas páginas, entra inteira em cada ligação e deixa as respostas mais rápidas.</> },
            { title: "Crie a conta e o agente de voz", time: "5 min", body: <>Crie a sua conta grátis e abra <strong>WhatsApp Voice Agents</strong> no menu. O painel é em inglês; a IA fala português.</> },
            { title: "Vincule o WhatsApp da clínica", time: "5 min", body: <>No cartão <strong>Phone Number</strong> do agente, leia o QR Code em WhatsApp › Dispositivos conectados ou use o código de pareamento. A recepção continua usando o número no celular.</> },
            { title: "Cole as instruções e escolha a voz", time: "15 min", body: <>Copie as instruções abaixo e troque nome, regras e convênios pelos seus. Em idioma, escolha <strong>Portuguese (Brazil)</strong>, ou <strong>Multilingual</strong> para acompanhar o idioma do paciente. Em <strong>Call Opening</strong>, a opção “Agent speaks first, own words” faz a IA abrir a ligação com bom dia, boa tarde ou boa noite: ela sabe a data e a hora.</> },
            { title: "Adicione a base e as ferramentas", time: "15 min", body: <>Coloque as informações num <strong>Knowledge Base</strong> e ligue ao agente. Se a sua agenda tem API, crie as ferramentas de consultar e marcar horários em <strong>Tools</strong>.</> },
            { title: "Ligue você mesmo", time: "15 min", body: <>De outro celular, ligue para o WhatsApp da clínica. No cartão <strong>Test call</strong>, digite o seu número e a IA liga para você. Pergunte preço, convênio, peça para remarcar, peça um resultado de exame e descreva uma urgência. Leia as transcrições e ajuste as instruções onde a resposta não ficou boa.</> },
          ]} />
          <PromptFile locale="pt-BR" name="instrucoes-secretaria-virtual-clinica.txt" text={prompt} />
          <Note>Cada ligação começa do zero: a IA não lembra ligações anteriores do mesmo paciente, o que também mantém os dados de um paciente longe da ligação de outro. Ela também não transfere a ligação para uma pessoa; quando o paciente quer falar com alguém, informa o horário da recepção.</Note>
          <InlineCta href={help} title="Prefere configurar com ajuda?" body="A nossa equipe ajuda a montar as informações, as instruções e as ferramentas da sua clínica, pelo WhatsApp." label="Falar no WhatsApp" />
        </>,
      },
      {
        id: "custo",
        title: "Quanto custa uma secretária virtual com IA",
        body: <>
          <RowTable caption="Opções para atender as ligações da clínica, preços conferidos em 21 e 22 de novembro de 2026" firstColumn="Opção" columns={["Quanto custa", "Atende por", "Bom saber"]} rows={costs} highlight="Wapzen" />
          <p>Para 1.000 minutos de ligação por mês, a calculadora da Retell mostra US$ 0,11 por minuto com as opções padrão, cerca de <strong>US$ 110</strong> antes da telefonia, e o plano Start da Bland chega a <strong>US$ 140</strong>. As duas cobram em dólar e ligam por linha telefônica. Na Wapzen, a ligação passa pelo WhatsApp, sem custo de operadora, e o agente é grátis para começar; se a clínica precisar de mais minutos, combina com a nossa equipe pelo WhatsApp.</p>
          <p><strong>Escolha uma plataforma de telefonia</strong> se os pacientes ligam sobretudo para o fixo ou se as ligações precisam ser transferidas ao vivo. <strong>Escolha a Wapzen</strong> se eles já ligam no WhatsApp e você quer essas ligações atendidas hoje à noite. Para as mensagens de texto no mesmo número, veja o <Link href="/pt-br/blog/chatbot-whatsapp-clinica-odontologica">chatbot para clínicas no WhatsApp</Link>. A Wapzen é um produto independente: não é da Meta nem do WhatsApp.</p>
        </>,
      },
    ]}
    faq={[
      { q: "O que é um agente de voz para clínicas?", a: "É uma secretária virtual com IA que atende e faz ligações com voz natural. Ela informa horários, convênios, preços e endereço, marca consultas pelo sistema de agenda da clínica ou anota o pedido para a recepção, e liga para confirmar consultas. A Wapzen coloca esse agente no número de WhatsApp que a clínica já usa, grátis para começar." },
      { q: "A secretária virtual com IA consegue marcar consultas?", a: "Sim, se o sistema de agenda da clínica tiver API. A IA consulta os horários livres e marca durante a ligação por ferramentas de API. Sem API, ela anota especialidade, período preferido e nome, e a recepção confirma por mensagem." },
      { q: "A IA pode ligar para confirmar consultas?", a: "Pode. No menu Outbound da Wapzen você cria uma campanha e adiciona os pacientes de amanhã, um a um, e cada um recebe a ligação na hora. Como cada número tem um agente e a IA não recebe o nome nem o horário de cada paciente, o ideal é um segundo número só para confirmações, com uma abertura sobre a consulta de amanhã." },
      { q: "A IA pode falar de sintomas ou de resultados de exames?", a: "Não deve. Configure a IA para nunca orientar sobre sintomas, remédios, exames ou diagnósticos e para indicar o SAMU 192 em qualquer urgência. A Resolução CFM 2.454/2026 proíbe delegar à IA a comunicação de diagnósticos sem mediação humana." },
      { q: "O CFM permite usar IA no atendimento da clínica?", a: "A Resolução CFM 2.454/2026, em vigor desde 26 de agosto de 2026, regula a IA na prática médica: exige informar o paciente quando a IA apoia o atendimento e proíbe delegar a ela a comunicação de diagnósticos sem mediação humana. Uma secretária virtual que só cuida de agenda e informações não faz ato médico; mesmo assim, ela deve se apresentar como assistente virtual." },
      { q: "Ela atende o telefone fixo da clínica?", a: "Não. O agente de voz da Wapzen atende e faz apenas ligações de WhatsApp. As ligações para o fixo ou para uma linha de celular comum continuam com a recepção." },
      { q: "O paciente pode pedir para falar com uma pessoa?", a: "A IA não transfere a ligação ao vivo. Ela informa o horário da recepção e anota o assunto, e a equipe lê a transcrição de cada ligação em Call History, no painel." },
      { q: "Quanto custa uma secretária virtual com IA para clínica?", a: "Na Wapzen é grátis para começar, sem cartão, e a ligação passa pelo WhatsApp, sem custo de operadora; mais minutos são combinados com a equipe pelo WhatsApp. Plataformas de voz por linha telefônica cobram por minuto em dólar: a Retell de US$ 0,07 a US$ 0,31 e a Bland US$ 0,14 no plano Start (preços de 21 de novembro de 2026)." },
      { q: "Funciona para dentistas e clínicas de estética?", a: "Sim. A configuração é a mesma: cadastre procedimentos, preços, horários e preparo, e mantenha a IA longe de diagnósticos e promessas de resultado. Ela atende as ligações de WhatsApp e pode ligar para confirmar consultas e retornos." },
    ]}
    sources={[
      { label: "Teletime: Panorama Mobile Time/Opinion Box sobre ligações pelo WhatsApp (2025)", href: "https://teletime.com.br/28/02/2025/77-dos-brasileiros-preferem-ligacoes-pelo-whatsapp-mostra-pesquisa/" },
      { label: "CFM: regras sobre o uso da IA na medicina entram em vigor em 26 de agosto (Resolução 2.454/2026)", href: "https://portal.cfm.org.br/noticias/regras-sobre-uso-da-ia-na-medicina-entram-em-vigor-no-dia-26-de-agosto" },
      { label: "Política de Mensagens do WhatsApp Business (atualizada em 23/09/2026)", href: "https://whatsappbusiness.com/pt-br/policy/" },
      { label: "Lei Geral de Proteção de Dados (Lei 13.709/2018)", href: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" },
      { label: "Salario.com.br: recepcionista de consultório médico ou dentário (CBO 4221-10)", href: "https://www.salario.com.br/profissao/recepcionista-de-consultorio-medico-ou-dentario-cbo-422110/" },
      { label: "Meta: preços da WhatsApp Business Calling API", href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/pricing/" },
      { label: "Retell AI: preços", href: "https://www.retellai.com/pricing" },
      { label: "Bland AI: preços", href: "https://www.bland.ai/pricing" },
    ]}
    related={["/pt-br/blog/chatbot-whatsapp-clinica-odontologica", "/pt-br/blog/agente-de-voz-ia-whatsapp-gratis"]}
    product="/pt-br/ligacao-com-ia"
    cta={{ heading: <>Nenhum paciente sem resposta.<br /><span>Grátis no WhatsApp da sua clínica.</span></>, body: "Crie a sua conta, vincule o número da clínica e faça a primeira ligação de teste hoje. Se preferir ajuda, a nossa equipe configura com você pelo WhatsApp." }}
    signUpTo={voiceAgents}
  />;
}
