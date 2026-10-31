import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Buscas-alvo: "chatbot para clínica odontológica", "chatbot whatsapp dentista",
// "ia para clínica odontológica", "recepcionista virtual para dentistas",
// "agendamento odontológico whatsapp", "chatbot odontológico grátis". Sem
// versão em inglês. Todos os diálogos são ilustrativos. O que o artigo diz do
// Wapzen segue o whiskey-bailey-server: "grátis para começar" com limite de uso,
// sem voz, sem pausa por conversa, memória de poucos minutos e ferramentas que
// não rodam em toda mensagem. Aviso do CFO sobre IA ficou de fora: não achamos
// a fonte. Os números da OdontoPrev são autodeclarados e da API oficial.
const href = "/pt-br/blog/chatbot-whatsapp-clinica-odontologica";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "pt-BR", article: { publishedTime: post.published, modifiedTime: post.updated } });

const situations = [
  ["Novo paciente pedindo informações", "Explica serviços, localização e funcionamento da clínica"],
  ["Solicitação de consulta", "Coleta preferências e orienta sobre agendamento"],
  ["Dúvidas sobre tratamentos", "Apresenta informações gerais aprovadas pela clínica"],
  ["Perguntas sobre convênios", "Informa planos aceitos conforme cadastro atualizado"],
  ["Mensagens fora do expediente", "Responde às dúvidas administrativas disponíveis"],
  ["Solicitações de remarcação", "Registra o pedido ou usa uma integração autorizada"],
  ["Paciente pedindo atendimento humano", "Informa o canal de contato da equipe"],
];

const booking = [
  ["Solicitação de agendamento", "A IA coleta o dia e o período desejados para a recepção confirmar"],
  ["Link de agendamento", "A IA orienta o paciente a utilizar um sistema de reservas"],
  ["Integração com agenda", "A IA consulta horários e pode reservar mediante confirmação do sistema"],
];

const faqs = [
  { q: "Qual é o melhor chatbot para clínica odontológica?", a: "Depende das necessidades da clínica. Para responder perguntas administrativas, é importante ter uma base de conhecimento, respostas em português brasileiro, histórico de conversas e um caminho claro até a equipe. O Wapzen é uma opção grátis para começar a testar um chatbot com IA no WhatsApp, com limite de uso." },
  { q: "Existe chatbot para dentista grátis?", a: "Sim. O Wapzen é grátis para começar e não pede cartão de crédito. A plataforma permite configurar o agente com informações da clínica e conectar o WhatsApp por QR Code ou código de pareamento. O início grátis tem limite de uso, e volumes maiores pedem um plano pago." },
  { q: "O chatbot consegue marcar consultas odontológicas?", a: "Ele pode coletar solicitações, informar links de agendamento e, quando conectado a um sistema compatível por API, realizar operações de reserva. O agendamento em tempo real depende da integração configurada e deve ser testado várias vezes." },
  { q: "O chatbot funciona no WhatsApp Business?", a: "Sim. O Wapzen conecta números do WhatsApp Business e do WhatsApp pessoal por QR Code ou código de pareamento. Essa conexão não utiliza a API oficial da Meta, portanto é importante analisar suas limitações e riscos." },
  { q: "A IA pode substituir a secretária da clínica odontológica?", a: "Um chatbot pode automatizar parte do atendimento repetitivo, mas não substitui todas as responsabilidades de uma recepcionista. Situações delicadas, questões clínicas, decisões que exigem autorização e pedidos de atendimento humano continuam precisando de processos adequados e supervisão." },
  { q: "O chatbot pode responder sobre dor de dente ou indicar tratamentos?", a: "Ele pode fornecer informações gerais aprovadas e orientar o paciente a procurar atendimento profissional. Não deve realizar diagnósticos individualizados, prescrever medicamentos ou substituir a avaliação do cirurgião-dentista." },
  { q: "Preciso saber programar para criar um chatbot odontológico?", a: "Não necessariamente. O Wapzen oferece um ambiente sem código para configurar agentes e bases de conhecimento. Integrações mais avançadas com sistemas de gestão podem exigir conhecimentos técnicos." },
];

const sources = [
  { label: "Meta: caso OdontoPrev", href: "https://whatsappbusiness.com/resources/success-stories/odontoprev/" },
  { label: "ANPD: perguntas frequentes sobre a LGPD", href: "https://www.gov.br/anpd/pt-br/acesso-a-informacao/perguntas-frequentes/perguntas-frequentes" },
  { label: "CFO: normas éticas para conteúdos nas redes sociais", href: "https://website.cfo.org.br/redes-sociais-na-odontologia-fique-atento-as-normas-eticas-e-acerte-na-publicacao-dos-conteudos/" },
  { label: "WhatsApp Business: política de mensagens", href: "https://whatsappbusiness.com/policy/" },
  { label: "Central de Ajuda do WhatsApp: conectar um dispositivo", href: "https://faq.whatsapp.com/1317564962315842" },
];

const sections = [
  {
    id: "o-que-e",
    title: "O que é um chatbot para clínica odontológica?",
    body: <>
      <p>Clínicas e consultórios conhecem bem esse problema: a equipe precisa atender quem está na recepção, organizar a agenda, confirmar horários e ainda responder às mensagens que chegam pelo WhatsApp.</p>
      <p>Um chatbot odontológico é um sistema que conversa automaticamente com pacientes por canais digitais, como o WhatsApp.</p>
      <p>Os modelos mais simples funcionam com menus e respostas previamente cadastradas. Já um chatbot com inteligência artificial consegue interpretar perguntas escritas de maneiras diferentes e formular respostas usando as informações fornecidas pela clínica.</p>
      <p>Imagine que um paciente pergunte:</p>
      <blockquote>“Vocês trabalham com aparelho invisível?”</blockquote>
      <p>Depois, continue:</p>
      <blockquote>“E quanto tempo demora para começar?”</blockquote>
      <p>Um chatbot tradicional pode não conseguir acompanhar a conversa se essas perguntas não corresponderem às opções do seu menu.</p>
      <p>Um chatbot com IA, devidamente configurado, pode explicar que a clínica oferece avaliação ortodôntica, apresentar informações gerais sobre os serviços disponíveis e orientar sobre os próximos passos para uma consulta.</p>
      <p>Ele não deve, porém, definir a duração de um tratamento individual sem avaliação profissional.</p>
      <p>Na prática, a ferramenta funciona como uma <strong>recepcionista virtual para clínica odontológica</strong>, auxiliando no atendimento administrativo e encaminhando questões clínicas para os profissionais responsáveis.</p>
    </>,
  },
  {
    id: "o-que-faz",
    title: "O que um chatbot com IA pode fazer no WhatsApp de um dentista?",
    body: <>
      <p>A automação pode ser utilizada em diferentes etapas do relacionamento com o paciente.</p>
      <Comparison caption="O que um chatbot com IA pode fazer em cada situação de uma clínica odontológica" columns={["Como a IA pode ajudar"]} rows={situations} />
      <p>O objetivo não é substituir o cirurgião-dentista ou a equipe de atendimento.</p>
      <p>É reduzir o tempo gasto com perguntas repetitivas e tornar a comunicação mais organizada.</p>
    </>,
  },
  {
    id: "exemplos",
    title: "5 exemplos de atendimento com IA para clínicas odontológicas brasileiras",
    body: <>
      <p>Para entender melhor, veja como uma inteligência artificial configurada com as informações corretas poderia conversar com pacientes.</p>
      <Note>Os diálogos abaixo são exemplos ilustrativos. Os serviços, as condições e os horários precisam corresponder à realidade da clínica.</Note>

      <h3>1. Paciente interessado em implante dentário</h3>
      <p><strong>Paciente:</strong> “Olá! Quanto custa um implante dentário?”</p>
      <p><strong>Chatbot:</strong> “Olá! Seja bem-vindo à nossa clínica. Trabalhamos com avaliação para implantes dentários. Como o planejamento depende das condições de cada paciente, os valores do tratamento são definidos após avaliação profissional. Gostaria de saber como solicitar um horário?”</p>
      <p><strong>Paciente:</strong> “Sim, pode ser na sexta?”</p>
      <p><strong>Chatbot:</strong> “Claro! Você prefere pela manhã ou à tarde? Posso registrar sua preferência para que nossa equipe confirme a disponibilidade.”</p>
      <p>Nesse caso, o chatbot não inventa preços nem promete que um tratamento será indicado.</p>
      <p>Ele oferece informações administrativas e encaminha o paciente para uma avaliação.</p>

      <h3>2. Paciente interessado em clareamento dental</h3>
      <p><strong>Paciente:</strong> “Vocês fazem clareamento dental? Posso fazer antes do meu casamento?”</p>
      <p><strong>Chatbot:</strong> “Nossa clínica oferece avaliação para clareamento dental. A indicação e o planejamento dependem de uma avaliação feita pelo dentista. Posso ajudar você a solicitar uma consulta?”</p>
      <p><strong>Paciente:</strong> “Meu casamento é no próximo mês.”</p>
      <p><strong>Chatbot:</strong> “Entendi! Você pode informar à equipe a data do evento durante o agendamento. O profissional poderá avaliar as opções adequadas e os prazos possíveis.”</p>
      <p>A IA consegue manter uma conversa contextualizada sem oferecer recomendações clínicas individuais.</p>

      <h3>3. Paciente perguntando sobre convênios</h3>
      <p><strong>Paciente:</strong> “Boa tarde! Vocês aceitam Bradesco Dental?”</p>
      <p><strong>Chatbot:</strong> “Boa tarde! Vou consultar as informações cadastradas sobre os convênios atendidos pela clínica.”</p>
      <p>Se a lista estiver atualizada, o chatbot poderá informar se aquele convênio é aceito e orientar sobre o processo de confirmação de cobertura.</p>
      <p>Isso evita que a recepcionista precise responder repetidamente à mesma pergunta.</p>

      <h3>4. Solicitação de agendamento fora do expediente</h3>
      <p><strong>Paciente:</strong> “Tem dentista disponível sábado?”</p>
      <p><strong>Chatbot:</strong> “Olá! Posso ajudar com informações sobre nossos horários. Nossa clínica atende aos sábados conforme a agenda cadastrada. Você gostaria de solicitar uma avaliação?”</p>
      <p><strong>Paciente:</strong> “Quero, de manhã.”</p>
      <p><strong>Chatbot:</strong> “Certo. Vou registrar sua preferência para sábado pela manhã. A confirmação depende da disponibilidade da agenda.”</p>
      <p>Se o chatbot estiver conectado a um sistema de agendamento, poderá consultar horários em tempo real e efetuar uma reserva, desde que a integração esteja configurada e a operação seja confirmada pelo sistema.</p>
      <p>Sem integração, o pedido fica salvo na conversa, e a recepção precisa acompanhar o painel para confirmar.</p>

      <h3>5. Paciente relatando dor de dente</h3>
      <p><strong>Paciente:</strong> “Estou com muita dor de dente. O que eu posso tomar?”</p>
      <p><strong>Chatbot:</strong> “Sinto muito pelo desconforto. Não posso indicar medicamentos ou fazer uma avaliação clínica por mensagem. É importante procurar um cirurgião-dentista para receber orientação adequada. Se a dor for intensa ou houver sinais preocupantes, procure atendimento odontológico de urgência. Posso informar os canais de atendimento da clínica?”</p>
      <p>Esse exemplo mostra um limite essencial.</p>
      <p><strong>O chatbot pode apoiar o atendimento administrativo, mas não deve realizar diagnósticos, prescrever medicamentos ou substituir a avaliação de um profissional de saúde.</strong></p>
    </>,
  },
  {
    id: "rotina",
    title: "Como a IA pode melhorar a rotina da recepção odontológica?",
    body: <>
      <p>Uma clínica pode receber mensagens sobre limpeza dental, aparelhos ortodônticos, implantes, avaliações, horários de funcionamento, estacionamento e convênios.</p>
      <p>Muitas dessas perguntas se repetem diariamente.</p>
      <p>Enquanto a recepcionista responde a uma mensagem sobre o endereço da clínica, outro paciente pode estar tentando remarcar uma consulta e uma terceira pessoa pode querer informações sobre uma primeira avaliação.</p>
      <p>Com um chatbot configurado corretamente, parte das dúvidas administrativas pode ser respondida automaticamente.</p>
      <p>A equipe passa a ter mais disponibilidade para acolher pacientes presencialmente, resolver casos especiais e organizar a agenda.</p>
      <p>Entre os possíveis benefícios estão o menor tempo de primeira resposta, a padronização das informações, o atendimento inicial fora do expediente e o registro organizado das conversas.</p>
      <p>Esses resultados dependem da qualidade da configuração, das integrações e da supervisão humana.</p>
      <InlineCta title="Teste uma recepcionista virtual na sua clínica" body="Crie um agente de IA, adicione as informações da clínica e veja como ele responde às perguntas da sua recepção. Grátis para começar." label="Comece grátis" />
    </>,
  },
  {
    id: "funciona",
    title: "Atendimento odontológico automatizado realmente funciona no Brasil?",
    body: <>
      <p>Existem casos reais de organizações brasileiras de saúde odontológica utilizando o WhatsApp para melhorar o relacionamento com pacientes.</p>
      <p>O Grupo OdontoPrev, por exemplo, usou a plataforma oficial WhatsApp Business Platform, em parceria com a Twilio, para retomar o contato com pacientes. Os pacientes também podiam falar com um atendente humano pelo WhatsApp.</p>
      <p>Segundo os resultados informados pela própria organização, entre janeiro e março de 2024 foram mais de 97 mil interações, com 44% menos tempo gasto para retomar o contato e um NPS 5% maior, ambos em comparação com ligações telefônicas.</p>
      <p>Esses números são autodeclarados e correspondem ao projeto específico da OdontoPrev, feito com a API oficial. Não são resultados de usuários do Wapzen e não devem ser interpretados como uma previsão para qualquer clínica.</p>
      <p>O caso demonstra que o WhatsApp pode fazer parte de uma estratégia estruturada de relacionamento com pacientes.</p>
    </>,
  },
  {
    id: "como-criar",
    title: "Como criar um chatbot para clínica odontológica usando o Wapzen",
    body: <>
      <p>Uma das opções para testar essa automação é o <Link href="/pt-br/chatbot-whatsapp-com-ia">Wapzen</Link>, plataforma que permite criar chatbots com inteligência artificial para WhatsApp sem precisar programar.</p>
      <p>O Wapzen é grátis para começar, com chatbot com IA, base de conhecimento e ferramentas de integração. O início grátis tem limite de uso e volumes maiores pedem um plano pago: quando o limite é atingido, o agente para de responder, então a recepção precisa continuar acompanhando o WhatsApp.</p>
      <p>Veja como começar.</p>

      <h3>Passo 1: Crie uma conta gratuita</h3>
      <p>Acesse o site do Wapzen e crie sua conta.</p>
      <p>Não é necessário informar cartão de crédito nem contratar uma chave separada de API da OpenAI ou Anthropic.</p>

      <h3>Passo 2: Configure a recepcionista virtual</h3>
      <p>Crie um agente de chat e defina suas instruções.</p>
      <p>Por exemplo:</p>
      <blockquote>“Você é a assistente virtual de uma clínica odontológica brasileira. Seu papel é fornecer informações administrativas sobre serviços, horários, localização, convênios e solicitações de agendamento. Responda em português brasileiro, com linguagem cordial, clara e profissional. Nunca faça diagnósticos, prescreva medicamentos ou prometa resultados clínicos. Quando o paciente pedir uma pessoa ou fizer uma pergunta clínica, informe o telefone da recepção: [telefone].”</blockquote>
      <p>Esse é apenas um ponto de partida. A clínica deve revisar as instruções e definir regras adicionais de segurança, privacidade e encaminhamento.</p>

      <h3>Passo 3: Adicione as informações da clínica</h3>
      <p>No Wapzen, é possível criar uma base de conhecimento a partir de textos, PDFs e documentos Word.</p>
      <p>Para uma clínica odontológica, essa base pode incluir:</p>
      <ul>
        <li>Nome, endereço e horário de funcionamento.</li>
        <li>Especialidades e serviços efetivamente oferecidos.</li>
        <li>Convênios atendidos e regras administrativas.</li>
        <li>Orientações sobre agendamento e remarcação.</li>
        <li>Informações de contato da recepção.</li>
        <li>Perguntas frequentes aprovadas pela equipe.</li>
      </ul>
      <p>Evite inserir prontuários, exames ou outros dados sensíveis identificáveis apenas para treinar o chatbot.</p>

      <h3>Passo 4: Conecte o número do WhatsApp</h3>
      <p>O Wapzen utiliza uma conexão por QR Code ou código de pareamento, semelhante ao processo de vincular um dispositivo ao WhatsApp Web.</p>
      <p>É possível conectar um número pessoal ou do WhatsApp Business.</p>
      <p>É importante saber que essa conexão não é a API oficial do WhatsApp Business Platform. Antes de usar o número principal da clínica, avalie as condições de uso do WhatsApp, a segurança, a privacidade e os riscos de indisponibilidade ou restrição da conta.</p>

      <h3>Passo 5: Teste o atendimento antes de ativar</h3>
      <p>Envie mensagens de teste para verificar como a IA responde.</p>
      <p>Faça perguntas sobre horários, localização, convênios, consultas e remarcações.</p>
      <p>Também simule situações em que o paciente solicita um ser humano ou faz perguntas clínicas que precisam ser encaminhadas a um profissional.</p>
      <p>No Wapzen, as conversas ficam registradas no painel, permitindo que a clínica revise o comportamento do agente.</p>
      <p><strong>A recomendação é começar automatizando apenas perguntas administrativas simples e ampliar o uso após os testes de qualidade e privacidade.</strong></p>
      <Note>O agente de chat do Wapzen lê texto: não entende áudios nem o conteúdo de imagens e não responde em grupos. Ele lembra só dos últimos minutos de cada conversa, então um paciente que volta no dia seguinte começa do zero. Ele também não para quando a recepção responde pelo celular: não existe pausa por conversa, e pausar o agente interrompe todas as conversas. O Wapzen é um produto independente, não é da Meta nem do WhatsApp.</Note>
    </>,
  },
  {
    id: "agendar",
    title: "É possível agendar consultas odontológicas automaticamente com IA?",
    body: <>
      <p>Sim, desde que exista uma estrutura adequada para realizar a operação.</p>
      <p>Há três formas diferentes de usar o chatbot no agendamento.</p>
      <Comparison caption="Três formas de usar um chatbot no agendamento odontológico" columns={["Como funciona"]} rows={booking} />
      <p>No Wapzen, integrações de agendamento podem ser configuradas com ferramentas de API, caso o sistema da clínica seja compatível.</p>
      <p>Isso significa que o agendamento automático em tempo real não acontece simplesmente por criar uma conta.</p>
      <p>É necessário configurar a integração, verificar disponibilidade e confirmar cada operação. Uma ferramenta de API não roda em toda mensagem que deveria acioná-la, então teste cada uma várias vezes e confira na agenda se a reserva foi mesmo criada.</p>
      <p>O agente também não recebe o número do paciente: se o seu sistema precisar dele, peça nas instruções para o agente perguntar. Mais detalhes no nosso guia de <Link href="/pt-br/blog/agendamento-pelo-whatsapp">agendamento pelo WhatsApp</Link>.</p>
    </>,
  },
  {
    id: "lgpd",
    title: "Chatbot para dentista precisa seguir a LGPD?",
    body: <>
      <p>Sim. A automação de mensagens em uma clínica odontológica precisa considerar a Lei Geral de Proteção de Dados Pessoais (LGPD), a ética profissional e as regras aplicáveis ao WhatsApp.</p>
      <p>Informações relacionadas à saúde de uma pessoa são consideradas dados pessoais sensíveis pela legislação brasileira.</p>
      <p>Antes de utilizar uma plataforma externa, a clínica deve verificar quais dados serão compartilhados, a finalidade do tratamento, a base legal aplicável, o armazenamento, os controles de acesso e os procedimentos de segurança.</p>
      <p>O consentimento pode ser necessário em determinadas situações, mas não é a única hipótese legal prevista na LGPD para o tratamento de dados sensíveis. A base legal precisa ser avaliada conforme a finalidade e o contexto.</p>
      <p>Além disso, clínicas e profissionais devem observar as regras do Conselho Federal de Odontologia sobre comunicação profissional, publicidade e responsabilidade clínica. As normas do conselho vedam, por exemplo, expressões que caracterizem sensacionalismo, autopromoção ou promessa de resultado.</p>
      <p>O chatbot não deve prometer resultados, oferecer diagnóstico individual sem avaliação ou criar expectativas enganosas sobre tratamentos.</p>
      <p>A política de mensagens do WhatsApp Business também importa aqui. Ela proíbe usar o WhatsApp para telemedicina ou para enviar e pedir informações de saúde quando a regulamentação aplicável não permitir, e exige que o atendimento automatizado ofereça um caminho claro até a equipe, como um telefone ou e-mail. Ela também restringe itens como medicamentos e produtos médicos: confira a lista antes de falar deles pelo chat.</p>
      <p>Antes da implantação, a clínica deve avaliar o contrato e as práticas do fornecedor, incluindo o tratamento de dados, a eventual transferência internacional, a retenção de mensagens e os mecanismos de exclusão e proteção.</p>
    </>,
  },
  {
    id: "medir",
    title: "Como medir se o chatbot está ajudando sua clínica?",
    body: <>
      <p>Depois de configurar o atendimento, acompanhe os resultados.</p>
      <p>Você pode começar observando quatro indicadores:</p>
      <p><strong>Tempo de primeira resposta:</strong> quanto tempo o paciente espera para receber uma resposta inicial?</p>
      <p><strong>Solicitações de agendamento:</strong> quantas conversas geraram pedidos de consulta e quantos deles foram confirmados pela equipe ou pelo sistema?</p>
      <p><strong>Resolução de dúvidas administrativas:</strong> quantas perguntas foram respondidas corretamente sem necessidade de intervenção humana?</p>
      <p><strong>Encaminhamento para a recepção:</strong> quando a IA não sabe responder ou o paciente pede atendimento humano, o encaminhamento funciona?</p>
      <p>Esses indicadores ajudam a identificar onde a automação está realmente contribuindo.</p>
      <p>O objetivo não é fazer o chatbot conversar o máximo possível.</p>
      <p>É oferecer respostas corretas e facilitar o acesso do paciente ao atendimento adequado.</p>
    </>,
  },
  {
    id: "conclusao",
    title: "Conclusão: uma recepção mais ágil começa com um atendimento melhor",
    body: <>
      <p>Para uma clínica odontológica, cada contato no WhatsApp representa uma pessoa que precisa de informação, orientação ou acesso a um profissional.</p>
      <p>Responder rapidamente é importante, mas responder corretamente é ainda mais.</p>
      <p>Um chatbot com IA pode ajudar a organizar esse primeiro contato, esclarecer dúvidas administrativas e registrar solicitações de agendamento enquanto a equipe se concentra nas atividades que realmente exigem atendimento humano.</p>
      <p>Com plataformas como o Wapzen, é possível experimentar essa tecnologia sem começar por uma assinatura paga ou um projeto de programação.</p>
      <p>O segredo é configurar o assistente com informações confiáveis, estabelecer limites para questões clínicas e respeitar a privacidade dos pacientes.</p>
      <p>Quer experimentar uma recepcionista virtual com inteligência artificial no WhatsApp da sua clínica odontológica? <Link href="/pt-br/chatbot-whatsapp-com-ia">Acesse o Wapzen e crie seu chatbot</Link>, comece pelas dúvidas mais frequentes da sua recepção, teste as respostas e veja como a automação pode tornar o atendimento mais organizado e acessível.</p>
    </>,
  },
];

export default function ChatbotWhatsAppClinicaOdontologicaPage() {
  return <BlogPost
    href={href}
    heading={<>Chatbot para clínica odontológica no WhatsApp.<br /><span>Como atender pacientes com IA em 2026.</span></>}
    lead="São 20h30 de uma terça-feira. Uma pessoa encontra sua clínica odontológica no Google, entra no WhatsApp e pergunta: “Boa noite! Vocês fazem avaliação para implante dentário? Tem horário disponível nesta semana?” A recepcionista já encerrou o expediente, e a mensagem fica sem resposta até o dia seguinte. Enquanto isso, o possível paciente continua pesquisando outras clínicas."
    summary={{
      title: "Resumo",
      items: [
        <><strong>O que resolve:</strong> um chatbot com IA responde dúvidas, apresenta os serviços da clínica e organiza pedidos de agendamento, mesmo fora do horário comercial.</>,
        <><strong>O que não faz:</strong> diagnóstico, prescrição de medicamentos ou promessa de resultado. Questões clínicas vão para os profissionais.</>,
        <><strong>Agendamento:</strong> sem integração, a recepção confirma; a reserva em tempo real depende de um sistema conectado por API.</>,
        <><strong>LGPD:</strong> dados de saúde são dados sensíveis, então avalie o fornecedor antes de ativar.</>,
        <><strong>Como testar:</strong> o Wapzen é grátis para começar, sem programação e com limite de uso.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/pt-br/blog/agendamento-pelo-whatsapp", "/pt-br/blog/como-criar-robo-whatsapp"]}
    product="/pt-br/chatbot-whatsapp-com-ia"
    cta={{ heading: <>Uma recepcionista virtual para a sua clínica.<br /><span>Teste com as suas perguntas.</span></>, body: "Crie um agente de IA, adicione as informações da clínica e conecte o seu número. É grátis para começar." }}
  />;
}
