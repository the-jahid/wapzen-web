import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note, Screenshot } from "@/components/blog/BlogPost";

// Targets "chatgpt whatsapp number" (99), "how to use / add chatgpt on
// whatsapp" (50 each), "chatgpt whatsapp number 2026" (46), autocomplete
// 2026-10-27. Consumer intent, so the post answers the consumer question first
// and then turns to businesses. The status is region-by-region and still
// moving (EU investigation open, Brazil case open): recheck it before any edit
// and bump `updated`. Italy's separate order is left out on purpose; it wasn't
// confirmed when this was written.
const href = "/blog/chatgpt-on-whatsapp";
const post = blogPost(href);
const img = (file: string) => `/blog/whatsapp-chatbot-without-business-api/${file}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const status = [
  ["EU countries, Iceland, Liechtenstein, Norway", "Yes, again", "Back since 13 July 2026, after an EU order"],
  ["Brazil", "Reported yes", "Brazilian numbers were exempted after the competition regulator stepped in"],
  ["United States, UK, India, and most other countries", "No", "Gone since 15 January 2026"],
];

const faqs = [
  { q: "Is ChatGPT still available on WhatsApp?", a: "Only in some places. 1-800-ChatGPT stopped working on WhatsApp in most countries on 15 January 2026. It came back for numbers in the European Economic Area on 13 July 2026 after an EU order, and Brazilian numbers were reportedly exempted. In the US, UK, India, and most other countries it isn't available." },
  { q: "What is the ChatGPT WhatsApp number?", a: "OpenAI's number is 1-800-CHATGPT, which is +1 800 242 8478. Where the service is available, save it as a contact or open wa.me/18002428478 and send a message. Other numbers that call themselves ChatGPT are not run by OpenAI." },
  { q: "Why did ChatGPT leave WhatsApp?", a: "Meta changed its WhatsApp Business Solution terms in October 2025 to bar AI providers from using the WhatsApp Business API to offer general-purpose AI assistants. The rule took effect on 15 January 2026, so ChatGPT, Microsoft Copilot, and Perplexity left WhatsApp, while Meta's own Meta AI stayed." },
  { q: "Will ChatGPT come back to WhatsApp in the US or India?", a: "No date has been announced. In Europe and Brazil it took orders from competition regulators to bring third-party assistants back, and the EU case is still open. Until something changes, use the ChatGPT app or website instead." },
  { q: "Can my business still use ChatGPT on WhatsApp?", a: "Yes. Meta's rule targets general-purpose assistants offered by AI companies. Meta said businesses using AI to serve their own customers, such as a support bot, are not affected. Keep your assistant focused on your business, and it can run on a GPT model." },
  { q: "Are WhatsApp bots that say they're ChatGPT safe?", a: "Treat them with care. Only the verified 1-800-ChatGPT contact is OpenAI's. Other bots may use OpenAI's models, but OpenAI doesn't run them, and you don't know who reads or keeps your messages. Never send them passwords, codes, or payment details." },
];

const sources = [
  { label: "TechCrunch: WhatsApp bars general-purpose chatbots (Oct 2025)", href: "https://techcrunch.com/2025/10/18/whatssapp-changes-its-terms-to-bar-general-purpose-chatbots-from-its-platform/" },
  { label: "TechCrunch: Brazil orders Meta to suspend the policy (Jan 2026)", href: "https://techcrunch.com/2026/01/13/brazil-orders-meta-to-suspend-policy-banning-third-party-ai-chatbots-from-whatsapp" },
  { label: "TechCrunch: Meta's fee offer in Europe (Mar 2026)", href: "https://techcrunch.com/2026/03/05/meta-will-allow-rival-ai-chatbots-on-whatsapp-in-europe-but-for-a-fee/" },
  { label: "CNBC: EU warns of interim measures (Feb 2026)", href: "https://www.cnbc.com/2026/02/09/eu-interim-measures-meta-whatsapp-ai-policy-antritrust.html" },
  { label: "WinBuzzer: ChatGPT back on WhatsApp in Europe (Jul 2026)", href: "https://winbuzzer.com/2026/07/15/eu-order-brings-chatgpt-back-to-whatsapp-in-europe-xcxwbn/" },
];

const sections = [
  {
    id: "status",
    title: "Is ChatGPT still on WhatsApp?",
    body: <>
      <p>It depends on <strong>your WhatsApp number’s country</strong>, not on where you are. Reports say eligibility follows the number’s country code, so a US number in Paris still doesn’t get it.</p>
      <Comparison caption="Where ChatGPT works on WhatsApp in October 2026" columns={["Works?", "Details"]} rows={status} />
      <p>If you’re outside those regions and messages to 1-800-ChatGPT go unanswered, nothing is wrong with your phone: the service isn’t offered on your number. Use the ChatGPT app or chatgpt.com instead.</p>
    </>,
  },
  {
    id: "timeline",
    title: "What happened: the timeline",
    body: <>
      <ol>
        <li><strong>December 2024.</strong> OpenAI launches 1-800-ChatGPT: a phone line in the US and a WhatsApp contact worldwide.</li>
        <li><strong>October 2025.</strong> Meta changes its WhatsApp Business Solution terms. AI providers may no longer use the Business API to offer general-purpose assistants. The rule applies to new users at once and to everyone from 15 January 2026.</li>
        <li><strong>December 2025.</strong> The European Commission opens an antitrust investigation into the rule.</li>
        <li><strong>15 January 2026.</strong> ChatGPT, Microsoft Copilot, and Perplexity leave WhatsApp. Meta AI, Meta’s own assistant, stays.</li>
        <li><strong>January to March 2026.</strong> Brazil’s competition regulator, CADE, orders Meta to suspend the rule, and in March upholds that order. Brazilian numbers are exempted.</li>
        <li><strong>March 2026.</strong> Meta offers to let rival assistants back in Europe for a per-message fee. The Commission later finds the fee would work much like the ban.</li>
        <li><strong>9 June 2026.</strong> The Commission orders interim measures: Meta must restore free access for rival AI assistants, on the terms that applied before October 2025, while the investigation continues.</li>
        <li><strong>13 July 2026.</strong> ChatGPT returns to WhatsApp across the European Economic Area.</li>
      </ol>
      <p>The EU’s measures are temporary. There’s no final decision yet, so the situation can change again.</p>
    </>,
  },
  {
    id: "how-to-use",
    title: "How to use ChatGPT on WhatsApp where it works",
    body: <>
      <ol>
        <li>Save <strong>+1 800 242 8478</strong> (1-800-CHATGPT) as a contact, or open <code>wa.me/18002428478</code> on your phone.</li>
        <li>Open the chat and check it’s the <strong>official, verified</strong> ChatGPT account.</li>
        <li>Send any message to start. Where the service is still rolling out, it may not answer every number straight away.</li>
      </ol>
      <p>Be wary of other “ChatGPT on WhatsApp” numbers shared on social media. They’re third-party bots, not OpenAI, and you can’t know who reads your messages. Outside the regions above, <strong>Meta AI</strong> is built into WhatsApp in many countries, and the ChatGPT app works everywhere OpenAI does.</p>
    </>,
  },
  {
    id: "businesses",
    title: "Does the ban affect businesses that use AI on WhatsApp?",
    body: <>
      <p>No, and this is where a lot of coverage got it wrong. Meta’s rule is aimed at <strong>AI companies offering a general-purpose assistant</strong> through the Business API, the “ask me anything” kind. When the rule was announced, Meta said it doesn’t affect businesses that use AI to serve their own customers, giving a travel company’s customer-service bot as the example.</p>
      <p>So a store, clinic, or agency can keep using AI, including OpenAI’s GPT models, to answer customers on WhatsApp. The practical rule is to keep the assistant <strong>about your business</strong>: your products, bookings, orders, and policies. Write that into its instructions, so it politely declines unrelated requests like homework or essays.</p>
    </>,
  },
  {
    id: "your-own-number",
    title: "How to put GPT on your own business WhatsApp",
    body: <>
      <p>If what you actually want is ChatGPT-style answers for <strong>your customers</strong>, there are three routes:</p>
      <ul>
        <li><strong>A Business API provider with an AI add-on.</strong> Official, with broadcasts and team inboxes, but you pay a plan, AI add-ons, and Meta’s per-message fees. See <Link href="/blog/whatsapp-business-api-pricing">what the API costs</Link>.</li>
        <li><strong>Build it yourself</strong> with the Cloud API, an automation tool, and an OpenAI key. Flexible, but you set up Meta’s developer side and maintain it. The <Link href="/blog/n8n-whatsapp-ai-agent">n8n guide</Link> walks through it.</li>
        <li><strong>A no-code agent on your current number.</strong> With Wapzen you write instructions, upload your documents, choose an OpenAI GPT or Anthropic Claude model, and scan a QR code. The models are included, so you don’t need an OpenAI key.</li>
      </ul>
      <Screenshot src={img("chat-agent.webp")} width={2392} height={1656} alt="Wapzen chat agent editor with a system prompt, a model picker and an attached knowledge base" caption="Each agent has its own model: an OpenAI GPT or an Anthropic Claude. This demo agent uses Claude. Wapzen dashboard, demo data." />
      <p>Unlike a general chatbot, your agent answers from your <strong>knowledge base</strong>, your prices, delivery rules, and FAQ, so it says what’s true for your business instead of what’s true in general. The full setup is in <Link href="/blog/whatsapp-chatbot-without-business-api">this step-by-step guide</Link>.</p>
      <InlineCta title="Give your customers a GPT-powered assistant" body="Free right now, with the AI models included. Set it up on your existing WhatsApp number in about 15 minutes." />
      <Note>Wapzen is an independent product, not made by Meta, WhatsApp, or OpenAI. It links your number as a device, not through the Business API.</Note>
    </>,
  },
];

export default function ChatGptOnWhatsAppPage() {
  return <BlogPost
    href={href}
    heading={<>ChatGPT on WhatsApp.<br /><span>What works in 2026.</span></>}
    lead="1-800-ChatGPT left WhatsApp in most of the world on 15 January 2026, then came back in Europe. Here’s where it works today, why it left, how to use it, and how a business can still put a GPT-powered assistant on its own WhatsApp number."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>In the EU, Iceland, Liechtenstein, and Norway: yes.</strong> 1-800-ChatGPT (+1 800 242 8478) is back on WhatsApp since 13 July 2026.</>,
        <><strong>In the US, UK, India, and most other countries: no.</strong> It stopped on 15 January 2026, when Meta’s ban on general-purpose AI assistants took effect.</>,
        <><strong>Businesses aren’t affected:</strong> a GPT-powered assistant that answers your own customers is still allowed.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/what-is-a-whatsapp-chatbot", "/blog/n8n-whatsapp-ai-agent"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>ChatGPT-style answers.<br /><span>On your own number.</span></>, body: "Create a free AI chat agent with GPT or Claude, add your business info, and scan a QR code. No API key, no Business API." }}
  />;
}
