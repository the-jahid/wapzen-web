import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "n8n whatsapp chatbot" (96), "n8n whatsapp bot" (80), "whatsapp ai
// agent n8n workflow" (51), "n8n whatsapp ai agent" (48), "n8n whatsapp
// automation" (39), autocomplete 2026-10-27. Builder intent: give a real
// tutorial first, then the no-code option. Node names and credential fields
// follow n8n's docs as of this date; n8n Cloud prices come from n8n's pricing
// page via third-party reprints, so they're worded "about".
const href = "/blog/n8n-whatsapp-ai-agent";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const expressions = `// Message text
{{ $json.messages[0].text.body }}

// Sender's number (the reply's recipient)
{{ $json.messages[0].from }}

// Memory session key
{{ $json.contacts[0].wa_id }}`;

const costs = [
  ["n8n", "Cloud Starter about €24 a month for 2,500 executions; Pro about €60 for 10,000. Self-hosting is free, plus your server."],
  ["Meta", "Per-message fees on the Cloud API: templates always, and service replies after 1,000 a month per number since 1 October 2026."],
  ["AI model", "Pay-as-you-go to OpenAI, Anthropic, or another provider, per token."],
  ["Knowledge base", "A vector database such as Pinecone, Supabase, or Qdrant, often free at small sizes."],
  ["Your time", "Building, monitoring, and fixing the workflow when tokens, webhooks, or APIs change."],
];

const compared = [
  ["Setup time", "An afternoon to a few days", "About 15 minutes"],
  ["Meta developer app and Business API", "Required", "Not needed"],
  ["Phone number", "A number on the Cloud API, or a Business app number through coexistence", "Your existing number, linked by QR code"],
  ["Knowledge base", "Build a vector store and an ingestion workflow", "Built in: upload text, PDF, or Word"],
  ["Conversation history", "Configure memory and storage", "Every thread saved in the dashboard"],
  ["WhatsApp calls", "A separate project", "AI voice agent answers and makes calls"],
  ["Custom logic", "Anything you can wire up", "API tools the agent calls mid-conversation"],
  ["Running cost", "n8n, Meta’s message fees, and AI usage", "Currently free, AI models included"],
  ["Official Meta route", "Yes", "No, it’s a linked device"],
];

const faqs = [
  { q: "Can n8n connect to WhatsApp?", a: "Yes. n8n's official WhatsApp Trigger and WhatsApp Business Cloud nodes connect to Meta's WhatsApp Cloud API. You need a Meta developer account, a Meta business portfolio, and a Meta app with the WhatsApp product, and your n8n instance must be reachable from the internet over HTTPS." },
  { q: "Can I use n8n with my existing WhatsApp number?", a: "With the official nodes, the number has to be on the Cloud API. A WhatsApp Business app number can join the API through Meta's coexistence feature and keep working in the app. Some people connect n8n to unofficial, self-hosted WhatsApp gateways instead; those aren't supported by Meta or n8n." },
  { q: "Is n8n free for a WhatsApp chatbot?", a: "Self-hosted n8n is free, and n8n Cloud starts at about €24 a month. Either way you also pay Meta's per-message fees on the Cloud API and your AI provider's usage, and a hosted server if you self-host." },
  { q: "How many executions does a WhatsApp bot use in n8n?", a: "Every webhook that starts the workflow is one execution. A customer message is one; if delivery status updates (sent, delivered, read) also reach the workflow, each reply can add up to three more. Filter status updates as early as possible so they don't use up your plan." },
  { q: "Can an n8n WhatsApp agent answer voice notes?", a: "Yes, with extra steps. Branch on the message type, download the audio with the WhatsApp node's media operation, send it to a speech-to-text model, and pass the text to the AI Agent." },
  { q: "Do I need to code to build a WhatsApp AI agent in n8n?", a: "Not much, but it's technical. You'll configure a Meta app, tokens, and webhooks, and write a few n8n expressions. If you want the agent without the build, a no-code tool such as Wapzen connects your number with a QR code." },
];

const sources = [
  { label: "n8n docs: WhatsApp Trigger node", href: "https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.whatsapptrigger/" },
  { label: "n8n docs: WhatsApp credentials", href: "https://docs.n8n.io/integrations/builtin/credentials/whatsapp/" },
  { label: "n8n pricing", href: "https://n8n.io/pricing/" },
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
];

const sections = [
  {
    id: "what-you-build",
    title: "What you’re building",
    body: <>
      <p>An n8n WhatsApp AI agent is a workflow that runs every time your number receives a message. Five pieces pass the message along:</p>
      <ol>
        <li><strong>Meta’s WhatsApp Cloud API</strong> receives the customer’s message and sends it to a webhook.</li>
        <li><strong>The WhatsApp Trigger node</strong> is that webhook, and starts the workflow.</li>
        <li><strong>An IF node</strong> lets real messages through and drops status updates.</li>
        <li><strong>The AI Agent node</strong> writes the reply, with a chat model, a memory per customer, and tools such as a knowledge base search.</li>
        <li><strong>The WhatsApp Business Cloud node</strong> sends the reply back to the customer.</li>
      </ol>
      <p>It’s a flexible setup, and the build is mostly on Meta’s side, not n8n’s. If you want the result without the build, skip to <a href="#no-code">the no-code option</a>.</p>
    </>,
  },
  {
    id: "prerequisites",
    title: "What you need first",
    body: <>
      <ul>
        <li><strong>A Meta developer account</strong> and a <strong>Meta business portfolio</strong> (formerly Business Manager).</li>
        <li><strong>A Meta app</strong> with the WhatsApp product added, switched to Live mode. Meta gives you a test number that can message a few recipient numbers you verify; for real customers you add your own number.</li>
        <li><strong>A phone number for the Cloud API.</strong> It can’t be active in the regular WhatsApp app at the same time, unless it’s a WhatsApp Business app number onboarded through coexistence.</li>
        <li><strong>n8n reachable over HTTPS,</strong> either n8n Cloud or a self-hosted instance with a domain and certificate, because Meta only sends webhooks to public HTTPS URLs.</li>
        <li><strong>An AI provider key,</strong> for example OpenAI or Anthropic, billed by usage.</li>
      </ul>
    </>,
  },
  {
    id: "build",
    title: "Build the workflow, step by step",
    body: <>
      <h3>1. Create the two credentials</h3>
      <p>The trigger and the sending node use different credentials. For the <strong>WhatsApp Trigger</strong>, create an OAuth credential: the Client ID is your Meta app’s App ID and the Client Secret is its App Secret, both under App settings › Basic. For the <strong>WhatsApp Business Cloud</strong> node, create an API credential with an access token and your WhatsApp Business Account ID, from WhatsApp › API Setup.</p>
      <p>The token on the API Setup page is temporary and expires within a day. For anything beyond a test, create a system user in your business portfolio and generate a permanent token with the WhatsApp messaging and management permissions.</p>
      <h3>2. Add the WhatsApp Trigger</h3>
      <p>Add the node, pick the OAuth credential, and choose the <strong>Messages</strong> update. Your Meta app must also be subscribed to your WhatsApp Business Account, or messages never reach n8n; when you check the subscription, use the Business Account ID, not the phone number ID.</p>
      <h3>3. Filter out status updates</h3>
      <p>Depending on your n8n version and trigger options, delivery updates (sent, delivered, read) can arrive on the same trigger as messages. Add an <strong>IF</strong> node that continues only when the item contains a message, or turn status updates off in the trigger if your version has that option. Otherwise the agent tries to answer its own receipts.</p>
      <h3>4. Add the AI Agent</h3>
      <p>Connect an <strong>AI Agent</strong> node and give it a chat model (OpenAI, Anthropic, or another), a system message, and a memory. Key the memory on the customer’s number so every customer gets their own conversation. In the trigger’s output, the fields usually look like this; check them against your own output panel:</p>
      <pre>{expressions}</pre>
      <p>For answers from your own documents, attach a vector store tool (Pinecone, Supabase, Qdrant, or n8n’s simple in-memory store for testing) and build a second workflow that loads your documents into it.</p>
      <h3>5. Send the reply</h3>
      <p>Add a <strong>WhatsApp Business Cloud</strong> node with the <strong>Send message</strong> operation. Choose your phone number ID, set the recipient to the sender’s number, and set the text to the agent’s output.</p>
      <h3>6. Publish and test</h3>
      <p>Activate the workflow so the production webhook is registered, then message your number from another phone. WhatsApp allows <strong>one webhook per Meta app</strong>, so switching between n8n’s test and production URLs overwrites the other: when you test, production stops receiving messages.</p>
    </>,
  },
  {
    id: "pitfalls",
    title: "Common problems and how to fix them",
    body: <>
      <ul>
        <li><strong>Nothing arrives.</strong> Usually the app isn’t subscribed to your WhatsApp Business Account. A test event from Meta’s dashboard can still reach n8n, so a passing test doesn’t rule this out.</li>
        <li><strong>It works in test but not in production, or the reverse.</strong> That’s the one-webhook-per-app limit. Re-activate the workflow you want live.</li>
        <li><strong>It stopped after a day.</strong> The temporary access token expired. Switch to a system user token.</li>
        <li><strong>Executions run out fast.</strong> Each webhook is an execution. If status updates reach the workflow, one customer message can cost up to four: the message plus sent, delivered, and read for the reply. At that rate, Starter’s 2,500 executions cover roughly 600 customer messages a month.</li>
        <li><strong>Voice notes and photos get no answer.</strong> Branch on the message type, download the media, and transcribe audio before the agent.</li>
        <li><strong>Can’t message a customer first.</strong> Outside the 24-hour window after a customer’s last message, the Cloud API only sends approved templates.</li>
      </ul>
    </>,
  },
  {
    id: "costs",
    title: "What it costs to run",
    body: <>
      <p>n8n is the smallest line on the bill. The full picture:</p>
      <Comparison caption="Monthly running costs of an n8n WhatsApp AI agent" columns={["What you pay"]} rows={costs} />
      <p>For Meta’s rates by country and three worked monthly bills, see <Link href="/blog/whatsapp-business-api-pricing">WhatsApp Business API pricing</Link>. n8n’s plans change too, so check n8n’s pricing page before you commit.</p>
    </>,
  },
  {
    id: "no-code",
    title: "The no-code option: the same agent, without the build",
    body: <>
      <p>If the goal is an AI agent that answers your WhatsApp from your own information, and not the workflow itself, Wapzen gives you that without a Meta app, webhooks, or a vector database. You create an agent, upload your documents, choose a GPT or Claude model, and scan a QR code with the number you already use.</p>
      <Comparison caption="Building a WhatsApp AI agent in n8n compared with Wapzen" columns={["Build it in n8n", "Wapzen"]} rows={compared} />
      <p>You can also use both. A Wapzen <strong>API tool</strong> can call an n8n webhook mid-conversation, so n8n handles the back office (checking an order, adding a row to a sheet, notifying your team) while Wapzen handles WhatsApp.</p>
      <p>Whichever route you build, customers still need a way in. A free <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR generator</Link> gives you a printable code that opens a chat with your agent’s number.</p>
      <InlineCta title="Skip the build" body="Your AI agent on WhatsApp in about 15 minutes, with knowledge base, memory, and calls built in. Free right now." />
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp, and isn’t Meta’s official API route: it links your number as a device. Use it to answer people who contact you, never to message people who didn’t.</Note>
    </>,
  },
  {
    id: "choose",
    title: "Which should you pick?",
    body: <>
      <Choose items={[
        { name: "n8n", points: ["You need custom, multi-step logic across many apps", "You want Meta’s official API, with templates and broadcasts", "You have the time to build and maintain the workflow"] },
        { name: "Wapzen", points: ["You want an AI agent answering your current number today", "You want AI to answer and make WhatsApp calls too", "You’d rather not run a Meta app, hosting, or pay per message"] },
      ]} />
      <p>New to chatbots? Start with <Link href="/blog/what-is-a-whatsapp-chatbot">what a WhatsApp chatbot is</Link>, or follow the <Link href="/blog/whatsapp-chatbot-without-business-api">no-API setup guide</Link>.</p>
    </>,
  },
];

export default function N8nWhatsAppAiAgentPage() {
  return <BlogPost
    href={href}
    heading={<>An n8n WhatsApp AI agent.<br /><span>Built step by step.</span></>}
    lead="How to build a WhatsApp AI agent in n8n, from the Meta app and credentials to the AI Agent node and the reply, with the pitfalls that catch most people and the real running costs. Plus a no-code option if you’d rather not build it."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Yes, n8n can run a WhatsApp AI agent:</strong> WhatsApp Trigger → IF (drop status updates) → AI Agent → WhatsApp Business Cloud “Send message”.</>,
        <><strong>Most of the work is on Meta’s side:</strong> a developer app, a business portfolio, a Cloud API number, a permanent token, and a public HTTPS webhook.</>,
        <><strong>Costs add up:</strong> n8n, Meta’s per-message fees, and AI usage. A no-code tool like Wapzen does the same job on your existing number, currently free.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-business-api-pricing", "/blog/chatgpt-on-whatsapp"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Want the agent, not the workflow?<br /><span>Set it up free.</span></>, body: "Create an AI chat agent, upload your documents, and scan a QR code. No Meta app, no webhooks, no per-message fees." }}
  />;
}
