import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Buscas (docs/seo-blog-voice-research.mjs br, 2026-11-01): "agente de voz ia" (40),
// "ia que faz ligação" (40), "ligação com ia" (30), "ura com ia" (30), "quanto custa um
// agente de ia" (30), "secretaria virtual ia" (28), "agente de voz ia gratis" (21),
// "robo de cobrança" (20). Sem versão em inglês. A voz da Wapzen está em acesso
// antecipado (o painel mostra "coming in our next update"), por isso o CTA abre o
// WhatsApp e não o cadastro. O que se diz do agente segue o servidor Go (voicecall):
// transfer_call não transfere, sem rediscagem, sem importação de CSV, só WhatsApp.
// Preços da Bland e da Vapi conferidos em 25/10/2026 (post bland-ai-vs-vapi).
const href = "/pt-br/blog/agente-de-voz-ia-whatsapp-gratis";
const post = blogPost(href);
const earlyAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Olá! Quero acesso antecipado ao agente de voz da Wapzen para minha empresa no Brasil.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "pt-BR", article: { publishedTime: post.published, modifiedTime: post.updated } });

const does = [
  ["Atender ligações de WhatsApp", "Sim, 24 horas, no número que você já usa", "O cliente toca em “ligar” na conversa e a IA atende"],
  ["Ligar para leads pelo WhatsApp", "Sim, quando você adiciona o lead a uma campanha", "A ligação sai na hora, inclusive quando um formulário ou CRM adiciona o lead pela API"],
  ["Responder com as suas informações", "Sim, com a base de conhecimento (texto, PDF ou Word)", "Preços, horários, convênios, endereço, políticas"],
  ["Mandar mensagem durante a ligação", "Sim", "Um link, um endereço ou o WhatsApp do vendedor"],
  ["Consultar a sua agenda ou sistema", "Com uma ferramenta de API", "Teste várias vezes antes de confiar"],
  ["Registrar a conversa", "Sim, com histórico e transcrição no painel", "Campanhas têm números de ligações atendidas"],
  ["Transferir para um atendente", "Não", "Ela encerra e manda o contato da pessoa por mensagem"],
  ["Ligar para fixo ou celular comum", "Não", "Só ligações de WhatsApp"],
];

const costs = [
  ["Como cobra", "US$ 0,14 por minuto no plano Start", "US$ 0,05 por minuto da Vapi, mais cada provedor", "Grátis para começar no acesso antecipado"],
  ["1.000 minutos", "Cerca de US$ 140", "Cerca de US$ 82 a US$ 129, pela calculadora da Vapi", "Sem custo por minuto"],
  ["Por onde liga", "Linha telefônica", "Linha telefônica (Twilio ou outra operadora)", "WhatsApp, no seu número"],
  ["Precisa programar?", "Fluxos no painel", "Sim, é feito para desenvolvedores", "Não"],
];

const limits = [
  ["Só WhatsApp", "Quem liga precisa estar no WhatsApp. A IA não liga para fixo nem celular comum", "Mantenha o telefone fixo para quem não usa o app"],
  ["Sem transferência", "Não passa a ligação para uma pessoa", "Peça para a IA mandar o WhatsApp do atendente e anotar o assunto"],
  ["Pausa antes de responder", "Cerca de um a dois segundos por resposta", "Peça frases curtas nas instruções"],
  ["Dispositivo vinculado", "Não é a API oficial da Meta", "Ligue só para quem espera a sua ligação, para não ter o número restrito"],
  ["Campanhas simples", "Sem rediscagem automática e sem importar planilha", "Adicione os leads um a um ou pela API"],
  ["Acesso antecipado", "A voz é configurada com a nossa equipe", "Fale com a gente no WhatsApp para começar"],
];

const faqs = [
  { q: "Existe agente de voz com IA grátis?", a: "Sim. O agente de voz da Wapzen está em acesso antecipado e é grátis para começar: as ligações passam pelo WhatsApp, sem custo por minuto. Para volume alto de ligações, combinamos um plano pago. Plataformas de ligação por telefone, como Bland AI e Vapi, cobram por minuto." },
  { q: "Uma IA consegue fazer ligações pelo WhatsApp?", a: "Sim. Com a Wapzen, a IA liga pelo WhatsApp do seu número para cada lead que você adiciona a uma campanha, e atende as ligações de WhatsApp que os clientes fazem para você. Ela não liga para fixo nem para celular comum." },
  { q: "Qual a diferença entre agente de voz e URA?", a: "A URA tradicional pede para o cliente apertar números ou dizer palavras fixas. O agente de voz conversa: entende a pergunta falada e responde com as informações da sua empresa, sem menu." },
  { q: "Quanto custa um agente de voz com IA?", a: "Plataformas de ligação telefônica cobram por minuto, em dólar. A Bland AI cobra US$ 0,14 por minuto no plano Start, e a calculadora da Vapi estima de US$ 82 a US$ 129 por 1.000 minutos. Na Wapzen, as ligações passam pelo WhatsApp, e o agente é grátis para começar." },
  { q: "A IA pode transferir a ligação para um atendente?", a: "Não na Wapzen. O WhatsApp não oferece uma forma de passar a ligação para outra pessoa. A IA encerra a ligação e manda por mensagem o contato de quem vai continuar o atendimento." },
  { q: "Preciso da API oficial do WhatsApp?", a: "Não. A Wapzen vincula o número que você já usa, como o WhatsApp Web faz. Isso não é a API oficial da Meta, então não existe garantia contra restrições: ligue só para quem pediu ou espera o seu contato." },
  { q: "É permitido ligar com robô no Brasil?", a: "As regras da Anatel, como o Não Me Perturbe e o prefixo 0303, foram feitas para ligações de telefonia. Para ligações de WhatsApp, o mais seguro é ligar só para quem pediu contato, dizer que é uma assistente virtual e tratar os dados conforme a LGPD." },
];

const sources = [
  { label: "Teletime: Panorama Mobile Time/Opinion Box sobre ligações pelo WhatsApp (2025)", href: "https://teletime.com.br/28/02/2025/77-dos-brasileiros-preferem-ligacoes-pelo-whatsapp-mostra-pesquisa/" },
  { label: "Bland AI: preços", href: "https://www.bland.ai/pricing" },
  { label: "Vapi: preços", href: "https://vapi.ai/pricing" },
  { label: "Meta: preços da WhatsApp Business Calling API", href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/pricing/" },
  { label: "Não Me Perturbe", href: "https://www.naomeperturbe.com.br/" },
  { label: "Lei Geral de Proteção de Dados (Lei 13.709/2018)", href: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" },
  { label: "Código de Defesa do Consumidor (Lei 8.078/1990)", href: "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm" },
];

const sections = [
  {
    id: "o-que-e",
    title: "O que é um agente de voz com IA no WhatsApp?",
    body: <>
      <p>Um <strong>agente de voz com IA</strong> é um atendente virtual que fala. Ele atende as ligações de WhatsApp da sua empresa, entende o que o cliente diz, responde em voz natural com as informações que você deu e também faz ligações pelo WhatsApp para quem pediu contato. É a mesma ideia de uma secretária virtual, só que ela conversa de verdade, sem menu de “aperte 1”.</p>
      <p>Por trás de cada resposta há três peças: a transcrição, que transforma a fala em texto, um modelo de linguagem, que decide o que responder, e uma voz sintética, que fala a resposta. Na <strong>Wapzen</strong>, você não monta nada disso: escreve as instruções, envia os documentos da empresa e vincula o número de WhatsApp que já usa.</p>
    </>,
  },
  {
    id: "por-que-whatsapp",
    title: "Por que ligação com IA pelo WhatsApp faz sentido no Brasil",
    body: <>
      <p>Porque o brasileiro já liga pelo WhatsApp. No Panorama Mobile Time/Opinion Box de janeiro de 2025, com 2.099 entrevistados, <strong>77% dos usuários do app disseram fazer mais ligações de voz pelo WhatsApp</strong> do que pelos minutos da operadora, e <strong>60% ligam pelo app todo dia ou quase todo dia</strong>.</p>
      <p>Para a empresa, isso cria um problema conhecido: o cliente toca em “ligar” na sua conversa às 21h, ninguém atende, e ele liga para o concorrente. Tanto que “bloquear chamada WhatsApp Business” está entre as buscas mais comuns sobre ligações no app. Muita empresa desliga as chamadas porque não tem quem atenda.</p>
      <p>Um agente de voz faz o contrário: atende as ligações, inclusive à noite e no fim de semana, e deixa por escrito o que cada cliente queria.</p>
    </>,
  },
  {
    id: "o-que-faz",
    title: "O que o agente de voz faz, e o que não faz",
    body: <>
      <p>Antes de escolher qualquer ferramenta, confira o que ela faz de verdade. No caso da Wapzen:</p>
      <Comparison caption="O que o agente de voz da Wapzen faz no WhatsApp" columns={["Faz?", "Como funciona"]} rows={does} />
      <p>O ponto mais forte para vendas é a ligação imediata. Quando o seu formulário, a sua landing page ou o seu CRM adiciona um lead à campanha pela API, a IA liga para ele no WhatsApp na mesma hora, enquanto o interesse ainda está quente. A pessoa preencheu o formulário pedindo contato, então espera a ligação.</p>
    </>,
  },
  {
    id: "usos",
    title: "Exemplos de uso por segmento",
    body: <>
      <ul>
        <li><strong>Clínicas e consultórios:</strong> atender fora do horário, informar convênios, preparo de exames e endereço, e anotar o pedido de consulta. A IA nunca orienta sobre sintomas. Dados de saúde são sensíveis na LGPD, então peça só o necessário.</li>
        <li><strong>Imobiliárias e corretores:</strong> ligar em segundos para o lead que veio do portal ou do anúncio, confirmar o imóvel de interesse, perguntar se é compra ou aluguel e a faixa de preço, e mandar por mensagem o WhatsApp do corretor. Veja também <Link href="/pt-br/blog/ia-para-imobiliaria-whatsapp">IA para imobiliária no WhatsApp</Link>.</li>
        <li><strong>Concessionárias e oficinas:</strong> responder sobre revisão, horário e documentos, e anotar o agendamento, ou marcar direto na agenda com uma ferramenta de API.</li>
        <li><strong>Escolas e cursos:</strong> retornar quem pediu informação sobre matrícula, explicar turmas e valores, e mandar o link de inscrição durante a ligação.</li>
        <li><strong>Lembretes e cobrança:</strong> lembrar o cliente do vencimento, com educação, e mandar o link de pagamento por mensagem. O Código de Defesa do Consumidor (art. 42) proíbe expor o consumidor a ridículo, constrangimento ou ameaça na cobrança. Um “robô de cobrança” que pressiona é um risco jurídico, além de queimar o seu número.</li>
      </ul>
    </>,
  },
  {
    id: "exemplo",
    title: "Como soa uma ligação atendida pela IA",
    body: <>
      <Note>Diálogo ilustrativo. A clínica, o horário e o convênio são inventados. A IA responde só com o que está na sua base de conhecimento.</Note>
      <p><strong>Cliente:</strong> “Oi, vocês atendem pelo convênio da minha empresa? É o [convênio].”</p>
      <p><strong>IA:</strong> “Olá! Aqui é a assistente virtual da Clínica [nome]. Sim, atendemos esse convênio para consultas de clínica geral. Quer marcar uma consulta?”</p>
      <p><strong>Cliente:</strong> “Quero. Tem sábado de manhã?”</p>
      <p><strong>IA:</strong> “Atendemos aos sábados das 8h às 12h. Vou anotar o seu pedido para sábado de manhã, e a recepção confirma o horário pelo WhatsApp. Qual é o seu nome completo?”</p>
      <p><strong>Cliente:</strong> “Mariana Souza.”</p>
      <p><strong>IA:</strong> “Obrigada, Mariana. Acabei de mandar o nosso endereço por mensagem. A recepção confirma o horário até as 10h de amanhã. Posso ajudar com mais alguma coisa?”</p>
      <p>Repare no que a IA não fez: não inventou horário livre, porque não estava conectada à agenda, e não prometeu nada que não estivesse nas instruções.</p>
    </>,
  },
  {
    id: "quanto-custa",
    title: "Quanto custa um agente de voz com IA?",
    body: <>
      <p>Plataformas de IA para ligações telefônicas cobram por minuto, em dólar, e a conta cresce com o volume. Compare com a Wapzen:</p>
      <Comparison caption="Bland AI, Vapi e Wapzen comparados em custo e forma de ligar" columns={["Bland AI", "Vapi", "Wapzen"]} rows={costs} />
      <p>Bland e Vapi ligam para qualquer telefone, e isso tem valor: se o seu cliente não usa WhatsApp, você precisa de uma linha telefônica. Mas, no Brasil, quase todo cliente está no WhatsApp, e lá a ligação não tem custo de operadora.</p>
      <p>Existe ainda a rota oficial da Meta, a <Link href="/blog/whatsapp-business-calling-api">WhatsApp Business Calling API</Link> (em inglês): ligações que o cliente faz para você são grátis, mas as ligações que a empresa faz são cobradas por minuto, exigem permissão prévia do cliente e precisam de um provedor e de desenvolvimento.</p>
      <InlineCta href={earlyAccess} title="Quer testar o agente de voz?" body="A voz da Wapzen está em acesso antecipado e é grátis para começar. Fale com a gente no WhatsApp e configuramos com você." label="Pedir acesso antecipado" />
    </>,
  },
  {
    id: "regras",
    title: "Regras no Brasil: Não Me Perturbe, 0303 e LGPD",
    body: <>
      <p>O Não Me Perturbe e o prefixo 0303 da Anatel foram criados para o telemarketing por telefonia: o primeiro deixa o consumidor bloquear ofertas das operadoras e empresas aderentes, o segundo identifica ligações de telemarketing ativo. Ligações de WhatsApp passam pelo aplicativo, não pela rede de voz da operadora, e não está claro como essas regras se aplicam a elas. <strong>Não trate isso como brecha.</strong> Siga quatro regras:</p>
      <ol>
        <li><strong>Ligue só para quem pediu ou espera o contato:</strong> lead que preencheu formulário, cliente com pedido aberto, paciente que pediu retorno. O próprio WhatsApp restringe números que fazem ligações indesejadas.</li>
        <li><strong>Diga que é uma assistente virtual</strong> logo na saudação. O cliente tem direito à informação clara, e evita a sensação de enganação.</li>
        <li><strong>Tenha base legal na LGPD</strong> para usar o telefone e os dados do lead, como consentimento ou legítimo interesse, e explique isso na sua política de privacidade.</li>
        <li><strong>Avise que a ligação fica registrada.</strong> A Wapzen guarda a transcrição de cada ligação no painel.</li>
      </ol>
      <p>Isto é orientação geral, não parecer jurídico. Revise com o seu advogado antes de ligar em escala.</p>
    </>,
  },
  {
    id: "como-comecar",
    title: "Como começar com o agente de voz da Wapzen",
    body: <>
      <p>A voz está em acesso antecipado, então a configuração é feita junto com a nossa equipe. O caminho:</p>
      <h3>1. Fale com a gente no WhatsApp</h3>
      <p>Conte o seu segmento, quantas ligações recebe e se quer também ligar para leads.</p>
      <h3>2. Escreva as instruções e a saudação</h3>
      <blockquote>“Você é a assistente virtual da [empresa], em [cidade]. Fale português do Brasil, com frases curtas e simpáticas. Diga logo no começo que é uma assistente virtual. Use só a informação da sua base de conhecimento e nunca invente preços, prazos ou horários livres. Faça uma pergunta por vez. Se o cliente quiser negociar, reclamar ou falar com uma pessoa, mande por mensagem o WhatsApp de [nome] e diga que ele retorna. Nunca peça senhas ou dados de cartão.”</blockquote>
      <h3>3. Envie as informações da empresa</h3>
      <p>Preços, horários, endereço, convênios, perguntas frequentes e políticas, em texto, PDF ou Word. Atualize sempre que algo mudar.</p>
      <h3>4. Vincule um número</h3>
      <p>De preferência um número só para atendimento, separado do WhatsApp pessoal do dono, porque a IA atende todas as ligações que chegam nele.</p>
      <h3>5. Teste antes de divulgar</h3>
      <p>Ligue você mesmo, faça perguntas difíceis, peça desconto e pergunte algo que não está na base. A IA deve dizer que não sabe e passar o contato da equipe, não improvisar.</p>
    </>,
  },
  {
    id: "limites",
    title: "Limites que você precisa conhecer",
    body: <>
      <p>Melhor saber agora do que descobrir com um cliente na linha:</p>
      <Comparison caption="Limites do agente de voz da Wapzen e como contornar" columns={["O que acontece", "Como contornar"]} rows={limits} />
      <Choose locale="pt-BR" highlight="Wapzen" items={[
        { name: "uma plataforma de telefonia com IA", points: ["Os seus clientes ligam para um número fixo", "Você precisa transferir ligações para atendentes", "Você tem desenvolvedores para montar os fluxos"] },
        { name: "Wapzen", points: ["Os seus clientes já falam com você pelo WhatsApp", "Você quer atender ligações e retornar leads sem custo por minuto", "Você quer começar sem programar"] },
      ]} />
      <p>A Wapzen é um produto independente, não é da Meta nem do WhatsApp. Para atender por texto também, veja o <Link href="/pt-br/chatbot-whatsapp-com-ia">chatbot de WhatsApp com IA</Link>.</p>
    </>,
  },
];

export default function AgenteDeVozIaWhatsAppPage() {
  return <BlogPost
    href={href}
    heading={<>Agente de voz com IA no WhatsApp.<br /><span>Atenda e faça ligações com IA, grátis para começar.</span></>}
    lead="Os seus clientes já ligam pelo WhatsApp, e muitas vezes ninguém atende. Um agente de voz com IA atende essas ligações a qualquer hora, responde com as informações da sua empresa e liga na hora para o lead que pediu contato. Veja como funciona, quanto custa e o que ele não faz."
    summary={{
      title: "Em resumo",
      items: [
        <><strong>O que é:</strong> uma IA que atende e faz ligações de WhatsApp com voz natural, usando as informações que você dá.</>,
        <><strong>Por que agora:</strong> 77% dos usuários do WhatsApp no Brasil fazem mais ligações pelo app do que pela operadora (Panorama Mobile Time/Opinion Box, 2025).</>,
        <><strong>Quanto custa:</strong> plataformas de telefonia cobram por minuto, em dólar. Na Wapzen, a ligação passa pelo WhatsApp, e o agente é grátis para começar.</>,
        <><strong>O que não faz:</strong> não liga para fixo, não transfere a ligação e não deve ligar para quem não pediu.</>,
        <><strong>Como começar:</strong> a voz está em acesso antecipado. Fale com a gente no WhatsApp.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/pt-br/blog/ia-para-imobiliaria-whatsapp", "/pt-br/blog/chatbot-whatsapp-clinica-odontologica"]}
    product="/pt-br/ligacao-com-ia"
    cta={{ heading: <>Nenhuma ligação sem resposta.<br /><span>Teste o agente de voz no seu WhatsApp.</span></>, body: "A voz da Wapzen está em acesso antecipado e é grátis para começar. Fale com a gente no WhatsApp e configuramos o seu agente." }}
    action={{ href: earlyAccess, label: "Pedir acesso antecipado" }}
  />;
}
