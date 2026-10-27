import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Note, Screenshot } from "@/components/blog/BlogPost";

// Targets "whatsapp chatbot without api", "how to create whatsapp chatbot"
// (+ "for business", "without business api"), autocomplete 2026-10-25. The
// landing pages /free-whatsapp-chatbot and /whatsapp-business-api-alternative
// sell the idea; this is the hands-on tutorial with screenshots. Stay honest
// that a linked device is not Meta's official route.
const href = "/blog/whatsapp-chatbot-without-business-api";
const post = blogPost(href);
const img = (file: string) => `/blog/whatsapp-chatbot-without-business-api/${file}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const routes = [
  ["How it connects", "Your number is registered to Meta’s platform, usually through a provider", "Your number is linked by QR code, like WhatsApp Web"],
  ["Setup", "Business account, display name review, template approval", "Scan a QR code"],
  ["Cost", "Provider plan plus Meta’s per-message fees", "Free right now with Wapzen"],
  ["Who it can message", "Anyone opted in, using approved templates", "Replies to people who message you"],
  ["Bulk broadcasts", "Yes, to opted-in contacts", "No"],
  ["Official Meta route", "Yes", "No"],
];

const faqs = [
  { q: "Can I make a WhatsApp chatbot without the Business API?", a: "Yes. Instead of registering your number with Meta's Business Platform, you link it as a device, the way WhatsApp Web works, and software answers the messages it receives. Wapzen does this with an AI agent: you create the agent, scan a QR code, and it starts replying." },
  { q: "Can I use my existing WhatsApp number?", a: "Yes. A regular WhatsApp or WhatsApp Business number works, and you keep using the app on your phone. The chatbot runs as a linked device next to it." },
  { q: "Do I need to know how to code?", a: "No. You write the agent's instructions in plain language, upload your documents to a knowledge base, and scan a QR code. Coding only comes in if you want the agent to call your own systems through an API tool, such as an order lookup." },
  { q: "Can my number get banned?", a: "WhatsApp restricts numbers that send bulk or unwanted messages, or that many people report. An agent that only answers people who message you behaves like a fast, helpful reply, which keeps the risk low. A linked device isn't Meta's official route, though, so no unofficial tool can promise zero risk. If WhatsApp is business-critical at high volume, use the Business API." },
  { q: "How much does a WhatsApp chatbot without the API cost?", a: "Wapzen is currently free, including the AI models, the knowledge base, and the WhatsApp connection. Because there's no Business API, there are no per-message or template fees either." },
  { q: "What should go in the chatbot's knowledge base?", a: "Whatever customers ask about: your price list or catalogue, delivery and payment rules, return policy, opening hours, and a short FAQ. Plain text, PDF, and Word files all work, and you can add more sources whenever the agent can't answer something." },
];

const sources = [
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "WhatsApp Help Center: How to link a device", href: "https://faq.whatsapp.com/1317564962315842" },
];

const sections = [
  {
    id: "two-routes",
    title: "Two ways to put a chatbot on WhatsApp",
    body: <>
      <p>There are two ways to connect software to a WhatsApp number. The <strong>WhatsApp Business API</strong> (now the WhatsApp Business Platform) is Meta’s official route. You reach it through a provider such as WATI, AiSensy, or Interakt, or through Meta’s Cloud API directly. The other route is the one WhatsApp Web uses: <strong>linking the number as a device</strong> with a QR code. This guide uses the second.</p>
      <Comparison caption="The WhatsApp Business API compared with a QR-linked number" columns={["Business API", "QR-linked number"]} rows={routes} />
      <p>If your WhatsApp is mostly people asking questions (prices, stock, delivery, bookings), the linked route gets an AI chatbot answering them today, on the number they already have saved. If you need to broadcast to thousands of contacts, the API is the right tool; see <a href="#when-api">when to use the API instead</a>.</p>
    </>,
  },
  {
    id: "before-you-start",
    title: "What you need before you start",
    body: <>
      <ul>
        <li><strong>Your phone</strong> with WhatsApp or WhatsApp Business on the number you want the chatbot to answer.</li>
        <li><strong>Your business information</strong> as text, PDF, or Word files: a price list or catalogue, delivery and payment rules, return policy, and a short FAQ.</li>
        <li><strong>About fifteen minutes.</strong> The screenshots below are from Wapzen’s dashboard, set up for Sunleaf, a demo skincare store.</li>
      </ul>
    </>,
  },
  {
    id: "knowledge-base",
    title: "Step 1: Put your business info in a knowledge base",
    body: <>
      <p>A chatbot is only as good as what it knows. Open <strong>Knowledge Base</strong>, click <strong>New</strong>, and name it. Then use <strong>Add sources</strong> to paste text or upload files. Wapzen splits each source into chunks and indexes them, and the knowledge base shows <strong>Ready</strong> when it’s done. When a customer asks something, the agent searches these chunks and answers from them instead of guessing.</p>
      <Screenshot src={img("knowledge-base.webp")} width={1380} height={1244} alt="A Wapzen knowledge base with a product catalogue PDF, shipping and cash on delivery text, and a returns policy document" caption="Sunleaf’s knowledge base: the catalogue PDF, two short texts on shipping and cash on delivery, and the returns policy." />
      <p>Short, specific sources work better than one giant document. A separate “Cash on delivery rules” text gets found more reliably than a paragraph buried on page 30 of a catalogue.</p>
    </>,
  },
  {
    id: "chat-agent",
    title: "Step 2: Create the chat agent",
    body: <>
      <p>Switch the dashboard to <strong>Chat</strong>, open <strong>Chat Agents</strong>, and click <strong>New chat agent</strong>. Three settings matter:</p>
      <ul>
        <li><strong>System prompt.</strong> Say who the agent works for, what it helps with, and its rules: reply in the customer’s language, keep it short, never invent prices or dates, and hand over to a person when it doesn’t know.</li>
        <li><strong>Model.</strong> Choose an OpenAI GPT or Anthropic Claude model. Both are included, so you don’t need API keys of your own.</li>
        <li><strong>Knowledge Base.</strong> Attach the knowledge base from step 1.</li>
      </ul>
      <Screenshot src={img("chat-agent.webp")} width={2392} height={1656} alt="Wapzen chat agent editor with a store's system prompt, Claude model and an attached knowledge base" caption="The Sunleaf Support agent: a short system prompt, Claude as the model, and the store FAQ attached." />
      <p>Under <strong>Tools</strong> you can later give the agent actions, such as an API request that looks up an order in your store. Start without them and add tools once the basics work.</p>
    </>,
  },
  {
    id: "connect",
    title: "Step 3: Connect your WhatsApp number",
    body: <>
      <p>Open <strong>Phone Numbers</strong> and click <strong>New Number</strong>. Give it a label and click Create, and a QR code appears. On your phone, open WhatsApp, go to <strong>Settings › Linked devices</strong> on iPhone or <strong>⋮ › Linked devices</strong> on Android, tap <strong>Link a device</strong>, and scan the code. Then pick your chat agent for the number. Once it shows <strong>Connected</strong>, the agent receives the number’s messages.</p>
      <Screenshot src={img("connected-number.webp")} width={2560} height={660} alt="Wapzen Phone Numbers list with two connected WhatsApp numbers, each assigned a chat agent" caption="Each connected number shows the chat agent that answers it." />
      <p>Your phone keeps working as normal. You’ll see the customer’s message and the agent’s reply in the chat, just as you see messages sent from WhatsApp Web.</p>
    </>,
  },
  {
    id: "go-live",
    title: "Step 4: Go live and test it",
    body: <>
      <p>In the agent, click <strong>Activate</strong>. Then message your number from another phone and ask the questions your customers ask most. Every thread is saved under <strong>Conversations</strong>, so you can check each answer, and reply yourself from the dashboard when a customer needs a person.</p>
      <Screenshot src={img("conversation.webp")} width={1832} height={1472} alt="A WhatsApp conversation in Wapzen where the AI chatbot answers questions about cash on delivery, a product and returns" caption="Three questions, three answers, all taken from the knowledge base: COD limits, which serum suits oily skin, and the return window." />
    </>,
  },
  {
    id: "improve",
    title: "Step 5: Make it better every week",
    body: <>
      <p>The first version won’t be perfect, and it doesn’t need to be. Once a week, read through Conversations and look for three things:</p>
      <ul>
        <li><strong>Questions it couldn’t answer.</strong> Add the answer to the knowledge base as a short text source.</li>
        <li><strong>Answers that were too long or too vague.</strong> Tighten the system prompt, for example “answer in two sentences”.</li>
        <li><strong>Moments a person should have stepped in.</strong> Add a rule such as “if someone is upset or asks for a refund, say the team will reply soon”.</li>
      </ul>
      <p>Want to go further? The same number can have a <Link href="/free-ai-calling-agent">voice agent that answers WhatsApp calls</Link>, and the <Link href="/blog/whatsapp-cod-order-confirmation">COD confirmation guide</Link> shows how to call buyers to confirm their orders.</p>
    </>,
  },
  {
    id: "when-api",
    title: "When to use the Business API instead",
    body: <>
      <p>A QR-linked chatbot is the fastest, cheapest way to answer customers on WhatsApp. It isn’t the right tool for everything. Choose the official Business API, through a provider, if you need:</p>
      <ul>
        <li><strong>Broadcasts and campaigns</strong> to large lists of opted-in contacts.</li>
        <li><strong>A shared team inbox</strong> with several agents, assignment rules, and roles.</li>
        <li><strong>A verified business profile</strong> and Meta’s official platform behind your number.</li>
        <li><strong>Very high volume</strong>, where your whole business depends on WhatsApp staying connected.</li>
      </ul>
      <p>For a side-by-side look at those platforms, read <Link href="/blog/wati-alternatives">the best WATI alternatives</Link> or <Link href="/blog/wapzen-vs-aisensy">Wapzen vs AiSensy</Link>, and for what Meta charges per message, <Link href="/blog/whatsapp-business-api-pricing">WhatsApp Business API pricing</Link>.</p>
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. It links your number as a linked device. WhatsApp restricts numbers that send bulk or unwanted messages, so use the chatbot to answer people who contact you, never to message people who didn’t.</Note>
    </>,
  },
];

export default function WhatsAppChatbotWithoutApiPage() {
  return <BlogPost
    href={href}
    heading={<>A WhatsApp chatbot without the API.<br /><span>Step by step.</span></>}
    lead="You don’t need Meta’s WhatsApp Business API, a developer, or template approvals to put an AI chatbot on WhatsApp. This guide builds one on an existing number in five steps, with screenshots, and is honest about when the official API is the better choice."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Yes, you can.</strong> Link your number with a QR code, the way WhatsApp Web works, and let an AI agent answer the messages it receives.</>,
        <><strong>What you skip:</strong> the Business API account, Meta’s display name review, template approval, and per-message fees.</>,
        <><strong>What you give up:</strong> bulk broadcasts, a multi-agent team inbox, and Meta’s official platform. If you need those, use the API.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-auto-reply-personal-account", "/blog/wapzen-vs-aisensy"]}
    product="/whatsapp-business-api-alternative"
    cta={{ heading: <>Your chatbot, live today.<br /><span>No API needed.</span></>, body: "Create a free AI chat agent, add your business info, and scan a QR code. It starts answering your WhatsApp in minutes." }}
  />;
}
