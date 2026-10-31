import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Steps } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Buscas-alvo: "diferença entre whatsapp e whatsapp business" (30, 3/3),
// "whatsapp business ou normal" (30, 3/3), "o que é whatsapp business" (30,
// 3/3), "como usar whatsapp business" (29), "…no pc" (24), "…em dois
// celulares" (22), "…no notebook" (20), "whatsapp business vale a pena" (20),
// autocomplete BR 2026-10-28. Sem equivalente exato em inglês (o post inglês
// compara app e API), então sem hreflang.
const href = "/pt-br/blog/diferenca-whatsapp-e-whatsapp-business";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "pt-BR", article: { publishedTime: post.published, modifiedTime: post.updated } });

const compared = [
  ["Para quem é", "Uso pessoal", "Empresas, autônomos e MEIs", "Empresas com alto volume ou sistemas"],
  ["Custo", "Grátis", "Grátis (transmissão comercial e Meta One à parte)", "Por mensagem, mais o fornecedor"],
  ["Perfil comercial", "Não", "Sim: endereço, horário, site, e-mail", "Sim"],
  ["Catálogo de produtos", "Não", "Sim", "Sim, pelo fornecedor"],
  ["Mensagens automáticas", "Não", "Saudação, ausência e respostas rápidas", "Robôs e fluxos"],
  ["Etiquetas", "Não (só listas)", "Sim", "Depende do fornecedor"],
  ["Telefone fixo", "Não", "Sim, com verificação por ligação", "Sim"],
  ["Vários aparelhos", "Celular + 4 dispositivos conectados", "Celular + 4 dispositivos conectados (mais com o Meta One)", "Sem limite prático"],
  ["Envio para muita gente", "Lista de transmissão de até 256", "Lista de até 256 grátis, ou transmissão comercial paga", "Modelos aprovados para quem deu permissão"],
];

const switchSteps = [
  { title: "Faça backup das conversas", body: "No WhatsApp, abra Configurações > Conversas > Backup de conversas e faça um backup. Não deve ser preciso, mas é a sua garantia." },
  { title: "Instale o WhatsApp Business", body: "Baixe grátis na Google Play ou na App Store. Os dois apps podem ficar no mesmo celular." },
  { title: "Use o mesmo número", body: "Ao abrir, o app reconhece o número que já está no WhatsApp e oferece usá-lo. Confirme e valide o número com o código." },
  { title: "Transfira as conversas", body: "Aceite a transferência do histórico: conversas, fotos e áudios vão para o WhatsApp Business. O número deixa de funcionar no WhatsApp normal." },
  { title: "Complete o perfil", body: "Coloque nome da empresa, categoria, endereço, horário e site. Depois configure catálogo, mensagens automáticas e respostas rápidas." },
];

const faqs = [
  { q: "Qual a diferença entre WhatsApp e WhatsApp Business?", a: "O WhatsApp é o app de uso pessoal. O WhatsApp Business é o app gratuito para empresas e autônomos: tem perfil comercial com endereço e horário, catálogo, mensagens de saudação e ausência, respostas rápidas e etiquetas, e funciona com telefone fixo. Conversas, ligações e grupos funcionam do mesmo jeito." },
  { q: "O WhatsApp Business é pago?", a: "O app é gratuito, como o WhatsApp normal. São pagos à parte a transmissão comercial (R$ 0,3217 por mensagem entregue), os planos Meta One e a API oficial do WhatsApp, que a Meta cobra por mensagem." },
  { q: "Como usar o WhatsApp Business em dois celulares?", a: "Conecte o segundo celular como dispositivo: instale o WhatsApp Business nele, escolha na tela inicial a opção de conectar a uma conta existente e leia o QR Code com o celular principal, em Dispositivos conectados. A conta funciona no celular principal e em até quatro dispositivos conectados." },
  { q: "Como usar o WhatsApp Business no PC ou notebook?", a: "Use o WhatsApp Web no navegador ou o app do WhatsApp para Windows ou Mac. Abra Dispositivos conectados no celular, toque em Conectar dispositivo e leia o QR Code que aparece na tela do computador." },
  { q: "Se eu mudar para o WhatsApp Business, perco as conversas?", a: "Não. Ao cadastrar no WhatsApp Business o mesmo número do WhatsApp, o app oferece transferir o histórico: conversas, fotos e áudios continuam. Mesmo assim, faça um backup antes." },
  { q: "Posso usar WhatsApp e WhatsApp Business no mesmo celular?", a: "Sim, com dois números diferentes, por exemplo num celular com dois chips: um número só pode estar ativo em um dos apps por vez. Muita gente deixa o número pessoal no WhatsApp e o do trabalho no WhatsApp Business." },
  { q: "O WhatsApp Business vale a pena?", a: "Para quem atende clientes, quase sempre: custa o mesmo que o WhatsApp normal (nada), faz tudo o que ele faz e ainda mostra que você é uma empresa, com horário, catálogo e mensagens automáticas." },
];

const sources = [
  { label: "WhatsApp: app WhatsApp Business", href: "https://business.whatsapp.com/products/business-app" },
  { label: "Central de Ajuda do WhatsApp: conectar um dispositivo", href: "https://faq.whatsapp.com/1317564962315842" },
  { label: "Meta: apresentando o Meta One (set. 2026)", href: "https://about.fb.com/br/news/2026/09/apresentando-o-meta-one-um-servico-de-assinatura-com-mais-recursos-e-ia-para-criar-se-conectar-e-se-destacar/" },
];

const sections = [
  {
    id: "resumo",
    title: "A diferença em um minuto",
    body: <>
      <p>O <strong>WhatsApp</strong> é o app que você usa com família e amigos. O <strong>WhatsApp Business</strong> é outro app, também gratuito, feito para quem atende clientes: tem o “B” no ícone e traz ferramentas para apresentar a empresa e responder mais rápido. Conversas, ligações, grupos e status funcionam igual.</p>
      <p>E existe um terceiro produto com nome parecido, a <strong>API oficial do WhatsApp</strong>: não é um app, é o acesso para sistemas, e é cobrada por mensagem. As três opções lado a lado:</p>
      <Comparison caption="WhatsApp, WhatsApp Business e API oficial comparados" columns={["WhatsApp", "WhatsApp Business", "API oficial"]} rows={compared} />
    </>,
  },
  {
    id: "o-que-e",
    title: "O que é o WhatsApp Business e para que serve",
    body: <>
      <p>O WhatsApp Business serve para usar o WhatsApp como canal de trabalho sem misturar com o pessoal. Estes são os recursos que o WhatsApp normal não tem:</p>
      <ul>
        <li><strong>Perfil comercial.</strong> Nome da empresa, categoria, descrição, endereço, horário de funcionamento, site e e-mail, visíveis para quem fala com você.</li>
        <li><strong>Catálogo.</strong> Produtos ou serviços com foto, preço e descrição, que o cliente vê sem sair da conversa e pode colocar no carrinho.</li>
        <li><strong>Mensagens automáticas.</strong> Saudação no primeiro contato e ausência fora do horário. Separamos <Link href="/pt-br/blog/mensagem-de-saudacao-whatsapp-business">40 exemplos para copiar</Link>.</li>
        <li><strong>Respostas rápidas.</strong> Respostas salvas que você chama digitando “/”.</li>
        <li><strong>Etiquetas.</strong> Para organizar as conversas: novo cliente, pedido em andamento, pago, retornar.</li>
        <li><strong>Link e QR Code.</strong> Um link wa.me e um QR Code que abrem a conversa com você, para colocar no Instagram, no site ou no balcão. Para um QR Code com a sua logo, use o nosso <Link href="/tools/whatsapp-qr-code-generator">gerador de QR Code para WhatsApp</Link> grátis (em inglês).</li>
      </ul>
    </>,
  },
  {
    id: "qual-usar",
    title: "WhatsApp Business ou normal: qual usar",
    body: <>
      <p>Se você usa o WhatsApp para trabalhar, mesmo que só parte do dia, o WhatsApp Business quase sempre vale a pena: custa o mesmo (nada), faz tudo o que o normal faz e ainda mostra que você é uma empresa. Fique no WhatsApp normal só se o número for mesmo pessoal.</p>
      <Choose locale="pt-BR" highlight="o WhatsApp Business" items={[
        { name: "o WhatsApp", points: ["o número é só pessoal", "você não recebe pedidos de clientes", "não precisa de horário, catálogo ou respostas automáticas"] },
        { name: "o WhatsApp Business", points: ["você atende clientes ou pacientes", "quer mostrar horário, endereço e catálogo", "quer mensagens de saudação e ausência", "tem um telefone fixo para o trabalho"] },
        { name: "a API oficial", points: ["você faz disparos para milhares de contatos", "várias pessoas atendem na mesma caixa de entrada", "precisa ligar o WhatsApp a CRM, ERP ou loja virtual"] },
      ]} />
    </>,
  },
  {
    id: "migrar",
    title: "Como passar para o WhatsApp Business sem perder as conversas",
    body: <>
      <p>A mudança do WhatsApp normal para o WhatsApp Business com o mesmo número leva poucos minutos e mantém o histórico:</p>
      <Steps items={switchSteps} />
      <Note>Um número só pode estar ativo em um app por vez. Para separar pessoal e trabalho, use dois números: num celular com dois chips, os dois apps convivem no mesmo aparelho.</Note>
      <p>Dá para voltar depois, mas você perde perfil comercial, catálogo e etiquetas, então faça um backup antes também nesse caso.</p>
    </>,
  },
  {
    id: "dois-celulares-e-pc",
    title: "WhatsApp Business em dois celulares, no PC e no notebook",
    body: <>
      <p>A mesma conta do WhatsApp Business funciona no <strong>celular principal e em até quatro dispositivos conectados</strong>, sem o celular principal precisar estar ligado o tempo todo:</p>
      <ul>
        <li><strong>No PC ou notebook:</strong> abra o WhatsApp Web no navegador ou o app para Windows ou Mac. No celular, vá em Dispositivos conectados, toque em Conectar dispositivo e leia o QR Code da tela.</li>
        <li><strong>Em um segundo celular:</strong> instale o WhatsApp Business no outro aparelho, escolha na tela inicial a opção de conectar a uma conta existente e leia o QR Code com o celular principal.</li>
        <li><strong>Mais aparelhos:</strong> o plano Avançado do Meta One inclui mais dispositivos conectados e acesso para a equipe sem compartilhar senha.</li>
      </ul>
      <p>E para quem tem <strong>telefone fixo</strong>: o WhatsApp Business funciona com número fixo, o normal não. No cadastro, espere o tempo do SMS acabar e escolha <strong>Me ligue</strong>: o fixo recebe uma ligação automática que dita o código de seis dígitos.</p>
    </>,
  },
  {
    id: "api",
    title: "E quando a API oficial faz sentido?",
    body: <>
      <p>A API não é uma versão “pro” do app: é um jeito de ligar o número a um sistema. Ela serve quando você precisa do que o app não faz:</p>
      <ul>
        <li><strong>disparos em escala</strong> para quem deu permissão, além das listas de 256 contatos;</li>
        <li><strong>muitos atendentes</strong> na mesma caixa de entrada, com distribuição das conversas;</li>
        <li><strong>integrações</strong> com loja virtual, ERP ou CRM, como confirmações de pedido automáticas.</li>
      </ul>
      <p>Em troca você paga cada mensagem enviada e, quase sempre, o plano de um fornecedor. As contas em reais estão em <Link href="/pt-br/blog/whatsapp-business-e-pago">WhatsApp Business é pago?</Link></p>
    </>,
  },
  {
    id: "terceiro-caminho",
    title: "O terceiro caminho: IA no seu WhatsApp Business",
    body: <>
      <p>O limite do WhatsApp Business não são os recursos, é o tempo: cada resposta é digitada por alguém, e as mensagens automáticas são textos fixos que não respondem perguntas. Muitas empresas não vão para a API para fazer disparos, só para ter um robô.</p>
      <p>Existe um caminho mais simples: mantenha o app e conecte um <strong>agente com IA</strong> ao mesmo número com um QR Code, como o WhatsApp Web. A IA responde preço, horário, disponibilidade e dúvidas frequentes com as informações da sua empresa, e você continua usando o app como sempre.</p>
      <InlineCta title="Coloque IA no seu WhatsApp Business" body="A Wapzen responde seus clientes 24 horas por dia com as suas informações, no seu número de sempre. Grátis por enquanto, sem cartão de crédito." label="Comece grátis" />
      <p>A Wapzen não é um produto oficial da Meta e não faz disparos em massa. Ela responde mensagens de texto em conversas individuais e também atende ligações de WhatsApp com um agente de <Link href="/pt-br/ligacao-com-ia">ligação com IA</Link>.</p>
    </>,
  },
];

export default function DiferencaWhatsAppBusinessBrPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp ou WhatsApp Business?<br /><span>A diferença e qual usar.</span></>}
    lead="São dois apps gratuitos com nomes quase iguais, mas para usos diferentes. Veja o que muda entre o WhatsApp e o WhatsApp Business, como migrar sem perder conversas, como usar em dois celulares e no PC, e quando a API oficial faz sentido."
    summary={{
      title: "Resumo",
      items: [
        <><strong>O WhatsApp</strong> é para uso pessoal, o <strong>WhatsApp Business</strong> para empresas e autônomos. Os dois são grátis.</>,
        <><strong>O WhatsApp Business tem</strong> perfil comercial, catálogo, mensagens de saudação e ausência, respostas rápidas e etiquetas.</>,
        <><strong>Dá para migrar</strong> para o WhatsApp Business com o mesmo número e manter todas as conversas.</>,
        <><strong>A mesma conta funciona</strong> em dois celulares e no PC, com até quatro dispositivos conectados, e também com telefone fixo.</>,
        <><strong>A API oficial</strong> é outra coisa: serve para disparos em escala e sistemas, e é cobrada por mensagem.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/pt-br/blog/whatsapp-business-e-pago", "/pt-br/blog/mensagem-de-saudacao-whatsapp-business"]}
    product="/pt-br/resposta-automatica-whatsapp"
    cta={{ heading: <>WhatsApp Business com IA.<br /><span>Grátis, no seu número.</span></>, body: "Conecte o seu WhatsApp Business com um QR Code e deixe a IA responder seus clientes com as informações da sua empresa." }}
  />;
}
