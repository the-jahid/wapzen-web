import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Buscas-alvo: "ia para corretor de imóveis", "chatbot para imobiliária", "ia para
// imobiliária", "agente de ia para corretor de imóveis", "whatsapp para imobiliária".
// Sem versão em inglês. Lastro e Morada.ai são dados das próprias empresas ou da
// imprensa; não achamos preço público de nenhuma. Comissão de 6% é referência de
// tabela, não regra. A Take Order foi feita para pedidos de compra: usá-la para pedido
// de visita não foi testado em produção, por isso o artigo manda testar. O que o
// artigo diz do Wapzen segue o whiskey-bailey-server. Diálogos são ilustrativos.
const href = "/pt-br/blog/ia-para-imobiliaria-whatsapp";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "pt-BR", article: { publishedTime: post.published, modifiedTime: post.updated } });

const money = [
  ["Valor do negócio", "R$ 500.000", "Aluguel de R$ 3.000"],
  ["Referência de honorários", "6% do valor", "Um aluguel"],
  ["Honorários do exemplo", "R$ 30.000", "R$ 3.000"],
  ["Divisão", "Conforme acordo entre corretores e imobiliária", "Conforme contrato"],
];

const qualify = [
  ["Objetivo", "Comprar para morar ou investir?", "Para quando precisa do imóvel?"],
  ["Região", "Quais bairros servem?", "Quais bairros servem? Perto do trabalho ou da escola?"],
  ["Imóvel", "Tipo, quartos e vagas", "Tipo, quartos, vagas e se tem pet"],
  ["Valor", "Até quanto pretende investir?", "Até quanto com condomínio e IPTU?"],
  ["Pagamento ou garantia", "À vista, financiamento, FGTS ou tem imóvel para dar na troca?", "Fiador, seguro-fiança, caução ou título de capitalização?"],
  ["Prazo", "Em quanto tempo quer fechar?", "Qual é a data da mudança?"],
];

const limits = [
  ["Áudio", "O agente não ouve áudio e não responde a ele", "Peça texto nos anúncios e acompanhe os áudios no celular"],
  ["Fotos", "O agente não envia fotos nem enxerga as que recebe", "Inclua o link do anúncio em cada imóvel da base de conhecimento"],
  ["Memória", "Lembra só dos últimos minutos da conversa. Quem volta no dia seguinte recomeça", "O corretor lê o histórico completo no painel"],
  ["Retorno", "Só responde. Não escreve primeiro nem faz follow-up", "O follow-up continua com o corretor ou com o seu CRM"],
  ["Corretor no mesmo chat", "O agente continua respondendo se o corretor entrar. Não existe pausa por conversa", "Use um número só para leads e encaminhe para o WhatsApp do corretor"],
  ["Agenda", "Sem integração, não vê a agenda real", "Registre a preferência de dia e horário. Quem confirma é o corretor"],
];

const tools = [
  ["Para quem", "Imobiliárias", "Incorporadoras (mercado primário)", "Corretor autônomo e imobiliária pequena"],
  ["Escala informada", "Mais de 1.000 imobiliárias", "Cerca de 200 incorporadoras em 17 estados", "Sem números públicos"],
  ["Como conecta", "WhatsApp e sistema da imobiliária", "WhatsApp e automações próprias", "Número existente por QR Code ou código de pareamento"],
  ["Carteira de imóveis", "Confirme a integração com o seu sistema", "Confirme com o fornecedor", "Base de conhecimento que você mantém (texto, PDF ou Word)"],
  ["Preço", "Não encontramos preço público", "Não encontramos preço público", "Grátis para começar, com limite de uso. Plano pago para volumes maiores"],
];

const faqs = [
  { q: "Qual é a melhor IA para corretor de imóveis?", a: "Depende do tamanho da operação. Imobiliárias com CRM e carteira grande tendem a precisar de soluções integradas, como a Lais, da Lastro. Incorporadoras têm a Morada.ai. Um corretor autônomo ou uma imobiliária pequena pode começar com um agente mais simples, como o Wapzen, que é grátis para começar e usa uma base de conhecimento mantida por você." },
  { q: "A IA substitui o corretor de imóveis?", a: "Não. A intermediação é atividade do corretor de imóveis pela Lei 6.530/78. A IA faz a primeira resposta, tira dúvidas repetidas e organiza as informações do lead. Negociar, orientar sobre documentos e fechar continuam com um corretor habilitado." },
  { q: "Chatbot para imobiliária funciona com leads de portais?", a: "Funciona quando o lead chama no WhatsApp. O agente do Wapzen responde a quem escreve, mas não escreve primeiro, então um lead que chega só por e-mail ou pelo CRM não é contatado por ele." },
  { q: "A IA pode agendar visitas?", a: "Pode registrar o pedido de visita com dia e horário de preferência. Para reservar em uma agenda real, é preciso conectar um sistema por API, e essa integração deve ser testada, porque uma ferramenta de API não roda em toda mensagem que deveria acioná-la." },
  { q: "A IA pode analisar o crédito do cliente?", a: "Não deve. Ela pode perguntar se a pessoa pretende financiar ou usar FGTS, mas não deve prometer aprovação, taxa ou valor de parcela. Isso depende do banco. Também não peça CPF, holerite ou documentos pelo agente." },
  { q: "Preciso saber programar?", a: "Não para o básico. No Wapzen você escreve as instruções, envia a carteira de imóveis como texto, PDF ou Word e conecta o número. Integrações com CRM por API pedem mais conhecimento técnico." },
  { q: "Quanto custa uma IA para imobiliária?", a: "Lais e Morada.ai não publicam preço nas fontes que consultamos, então é preciso pedir proposta. O Wapzen é grátis para começar, com limite de uso, e volumes maiores pedem um plano pago." },
];

const sources = [
  { label: "Prosus: Series A de US$ 15 milhões na Lastro", href: "https://www.prosus.com/news-insights/2025/prosus-ventures-leads-us-dollar-15m-series-a-in-lastro-to-scale-ai-agent-transforming-real-estate-in-brazil" },
  { label: "Estado de Minas: Morada.ai capta R$ 17 milhões", href: "https://www.em.com.br/economia/economia-digital/2026/01/7337744-transformacao-digital-no-mercado-imobiliario-startup-capta-rs-17-milhoes.html" },
  { label: "Sebrae: Pulso dos Pequenos Negócios, WhatsApp nas vendas", href: "https://agenciasebrae.com.br/dados/whatsapp-se-consolida-nas-vendas-on-line-enquanto-facebook-e-lojas-proprias-perdem-folego/" },
  { label: "Jus.com.br: a corretagem de 6% do CRECI-SP é obrigatória?", href: "https://jus.com.br/artigos/113103/a-corretagem-de-6-do-creci-sp-e-obrigatoria" },
  { label: "Planalto: Lei 6.530/78, profissão de corretor de imóveis", href: "https://www.planalto.gov.br/ccivil_03/leis/l6530.htm" },
  { label: "ANPD: perguntas frequentes sobre a LGPD", href: "https://www.gov.br/anpd/pt-br/acesso-a-informacao/perguntas-frequentes/perguntas-frequentes" },
  { label: "WhatsApp Business: política de mensagens", href: "https://whatsappbusiness.com/policy/" },
];

const sections = [
  {
    id: "por-que",
    title: "Por que imobiliárias estão pagando por IA no WhatsApp?",
    body: <>
      <p>IA para imobiliária é um agente que atende os leads pelo WhatsApp: confirma se o imóvel está disponível, tira dúvidas, faz perguntas de qualificação e deixa o contato pronto para o corretor. Imobiliárias pagam por isso porque o lead chega a qualquer hora, costuma falar com mais de uma empresa, e o corretor passa boa parte do dia em visita.</p>
      <p>O mercado já mostrou que paga. Em outubro de 2025, a Prosus Ventures liderou uma rodada Série A de US$ 15 milhões na Lastro, dona da Lais, agente de IA para o setor imobiliário. Segundo a Prosus, a Lais atende mais de 1.000 imobiliárias e já conversou com mais de 2 milhões de compradores e inquilinos, a maioria pelo WhatsApp.</p>
      <p>Na mesma linha, a Morada.ai captou R$ 17 milhões em janeiro de 2026, segundo o Estado de Minas, e atende cerca de 200 incorporadoras em 17 estados.</p>
      <p>Esses números vêm das próprias empresas e da imprensa, e mostram demanda, não resultado garantido. Para quem está começando, a pergunta prática é outra: quanto vale responder um lead que hoje fica sem resposta?</p>
    </>,
  },
  {
    id: "conta",
    title: "Quanto vale um lead respondido a tempo?",
    body: <>
      <p>Tabelas regionais, como a do CRECI-SP, trazem 6% a 8% como referência para imóveis urbanos, e o aluguel costuma render o equivalente ao primeiro mês. Esses valores são referência, não obrigação: cada negócio define o seu.</p>
      <Comparison caption="Exemplo de honorários em uma venda e em uma locação" columns={["Venda", "Locação"]} rows={money} />
      <p>Os valores são um exemplo, não uma média do mercado. Mesmo assim, a conclusão muda pouco: uma única venda a mais cobre com folga o custo mensal de uma ferramenta desse tipo. A IA não vende o imóvel, mas impede que o lead esfrie antes de o corretor conseguir responder.</p>
    </>,
  },
  {
    id: "exemplo",
    title: "Como a IA atende um lead de imóvel",
    body: <>
      <Note>Diálogo ilustrativo. Imóvel, bairro e valores são inventados, e o agente só responde com o que está na sua base de conhecimento.</Note>
      <p><strong>Lead:</strong> “Oi, vi o apto de 2 quartos em Pinheiros, código 482. Ainda está disponível?”</p>
      <p><strong>Agente:</strong> “Oi! Sou a assistente virtual da [imobiliária]. O 482 está disponível para locação: R$ 3.800 mais condomínio de R$ 950. Fotos e detalhes aqui: [link do anúncio]. Você procura para quando?”</p>
      <p><strong>Lead:</strong> “Para dezembro. Aceita pet?”</p>
      <p><strong>Agente:</strong> “Aceita pet de pequeno porte. Qual garantia você pretende usar: fiador, seguro-fiança ou caução?”</p>
      <p><strong>Lead:</strong> “Seguro-fiança. Dá pra visitar no sábado?”</p>
      <p><strong>Agente:</strong> “Vou registrar sábado como preferência, e a corretora confirma o horário. Prefere de manhã ou à tarde? E qual é o seu nome?”</p>
      <p><strong>Lead:</strong> “De manhã. Sou o Rafael.”</p>
      <p><strong>Agente:</strong> “Obrigada, Rafael! Para combinar a visita, fale com a Ana aqui: [link do WhatsApp da corretora]. É só citar o código 482.”</p>
      <p>Duas decisões desse exemplo importam. O agente responde com o código do anúncio, porque o lead chegou por um link com mensagem pronta. E termina levando a conversa para o WhatsApp da corretora, assim ela assume sem o agente responder junto. Você cria links assim no nosso <Link href="/tools/whatsapp-link-generator">gerador de link do WhatsApp</Link>.</p>
    </>,
  },
  {
    id: "qualificar",
    title: "Perguntas para qualificar comprador e inquilino",
    body: <>
      <p>Três ou quatro perguntas bastam na primeira conversa. Um questionário longo afasta o lead. Escolha as que mais mudam a próxima ação do corretor:</p>
      <Comparison caption="Perguntas de qualificação para compra e locação" columns={["Compra", "Locação"]} rows={qualify} />
      <p>Deixe de fora CPF, renda exata, holerite e fotos de documentos. Na LGPD, a regra é coletar só o necessário para a finalidade, e isso o corretor pede depois, em um canal adequado, quando houver negócio em andamento.</p>
    </>,
  },
  {
    id: "configurar",
    title: "Como configurar um agente para imobiliária no Wapzen",
    body: <>
      <p>O <Link href="/pt-br/chatbot-whatsapp-com-ia">Wapzen</Link> permite criar o agente sem programar. O painel é em inglês, e o agente responde em português se você pedir nas instruções.</p>
      <h3>1. Escreva as instruções</h3>
      <blockquote>“Você é a assistente virtual da [imobiliária], em [cidade]. Responda em português do Brasil, em mensagens curtas. Use apenas as informações da base de conhecimento e nunca invente disponibilidade, preço ou condição. Se o imóvel não estiver na base, diga que vai confirmar. Faça uma pergunta de cada vez, no máximo quatro: objetivo, bairros, valor e prazo. Não prometa aprovação de crédito, parcela ou desconto. Não peça CPF, renda ou documentos. Quando o lead quiser visitar ou negociar, envie o link [WhatsApp do corretor]. Diga que é uma assistente virtual.”</blockquote>
      <h3>2. Suba a carteira na base de conhecimento</h3>
      <p>Para cada imóvel, escreva uma linha com código, tipo, bairro, quartos, vagas, metragem, valor, condomínio, IPTU, status e link do anúncio. Texto simples funciona melhor que um folder em PDF. <strong>Vendeu ou alugou? Tire da base no mesmo dia</strong>, senão o agente continua oferecendo o imóvel.</p>
      <h3>3. Conecte um número só para leads</h3>
      <p>Use esse número nos portais e anúncios, conectado por QR Code ou código de pareamento. Como não existe pausa por conversa, separar o número do agente do número do corretor evita duas pessoas, ou uma pessoa e um robô, respondendo ao mesmo cliente.</p>
      <h3>4. Decida onde o lead fica salvo</h3>
      <p>Todas as conversas ficam no painel. Se quiser cada pedido de visita como um registro, ative a ferramenta Take Order com campos próprios (nome, imóvel, dia preferido) e escreva nas instruções que “pedido” significa pedido de visita. Ela foi feita para pedidos de compra, então teste bem antes. Para enviar ao seu CRM, use uma ferramenta de API.</p>
      <h3>5. Teste com leads difíceis</h3>
      <p>Pergunte por um imóvel que não existe, peça desconto, pergunte sobre aprovação de financiamento. O agente precisa encaminhar, não improvisar.</p>
      <InlineCta title="Teste com a sua carteira" body="Crie o agente, envie alguns imóveis e mande uma mensagem como se fosse um lead. É grátis para começar." label="Comece grátis" />
    </>,
  },
  {
    id: "limites",
    title: "O que a IA não deve fazer na imobiliária",
    body: <>
      <p>A intermediação de compra, venda, permuta e locação é atividade do corretor de imóveis pela Lei 6.530/78. O agente informa e organiza. Quem negocia é o profissional com Creci.</p>
      <p>Regra prática para as instruções: nada de promessa de valorização, de aprovação de crédito ou de reserva de imóvel pelo chat. Anúncios e mensagens também precisam seguir as regras do seu Creci.</p>
      <p>Além disso, estes são os limites atuais do agente do Wapzen:</p>
      <Comparison caption="Limites do agente do Wapzen no atendimento imobiliário e como contornar" columns={["O que acontece", "Como contornar"]} rows={limits} />
      <p>Quando o limite de uso do início grátis acaba, o agente para de responder, então acompanhe o WhatsApp mesmo com ele ligado. Uma ferramenta de API também não roda em toda mensagem que deveria acioná-la: teste várias vezes e confira no CRM se o lead chegou.</p>
    </>,
  },
  {
    id: "comparar",
    title: "Lais, Morada.ai ou Wapzen?",
    body: <>
      <p>Lais e Morada.ai são produtos feitos para o setor. O Wapzen é uma ferramenta geral de agentes de IA para WhatsApp, que você adapta com instruções e base de conhecimento.</p>
      <Comparison caption="Lais, Morada.ai e Wapzen comparados para o mercado imobiliário" columns={["Lais (Lastro)", "Morada.ai", "Wapzen"]} rows={tools} />
      <Choose locale="pt-BR" highlight="Wapzen" items={[
        { name: "uma solução do setor", points: ["Você tem equipe grande e CRM imobiliário", "Precisa da carteira sincronizada com o sistema", "Quer implantação com acompanhamento"] },
        { name: "Wapzen", points: ["Você é autônomo ou tem poucos corretores", "Sua carteira cabe em uma lista que você atualiza", "Quer testar a primeira resposta sem contrato"] },
      ]} />
      <p>O Wapzen conecta o número como dispositivo vinculado, não pela API oficial da Meta. Isso dispensa custo por mensagem, mas não dá garantia contra restrição da conta. Se o número é a sua principal fonte de negócios, avalie esse risco, ou prefira a API oficial. O Wapzen é um produto independente, não é da Meta nem do WhatsApp.</p>
    </>,
  },
];

export default function IaParaImobiliariaWhatsAppPage() {
  return <BlogPost
    href={href}
    heading={<>IA para imobiliária no WhatsApp.<br /><span>Como responder o lead enquanto o corretor está em visita.</span></>}
    lead="Um lead pergunta às 19h se o apartamento do anúncio ainda está disponível. O corretor está em visita, dirigindo ou já em casa, e só vê a mensagem no dia seguinte. A essa altura, a pessoa já falou com outras imobiliárias. Uma IA no WhatsApp responde na hora, faz as primeiras perguntas e deixa o atendimento pronto para o corretor continuar."
    summary={{
      title: "Resumo",
      items: [
        <><strong>O que resolve:</strong> primeira resposta na hora, dúvidas repetidas e qualificação do lead, a qualquer hora do dia.</>,
        <><strong>Quem já paga:</strong> a Lastro, dona da Lais, captou US$ 15 milhões e informa mais de 1.000 imobiliárias atendidas.</>,
        <><strong>A conta:</strong> a 6% de referência, uma venda de R$ 500 mil rende R$ 30 mil em honorários. Uma venda a mais paga a ferramenta com folga.</>,
        <><strong>O que não faz:</strong> negociar, prometer crédito ou enviar fotos. A intermediação é do corretor.</>,
        <><strong>Como testar:</strong> o Wapzen é grátis para começar, com limite de uso, e funciona com a carteira que você enviar.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/pt-br/blog/como-criar-robo-whatsapp", "/pt-br/blog/agendamento-pelo-whatsapp"]}
    product="/pt-br/chatbot-whatsapp-com-ia"
    cta={{ heading: <>Nenhum lead sem resposta.<br /><span>Teste com a sua carteira.</span></>, body: "Crie um agente de IA, envie seus imóveis e conecte um número para leads. É grátis para começar." }}
  />;
}
