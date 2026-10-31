import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { BlogPost, Note, Screenshot } from "@/components/blog/BlogPost";

// Targets the navigational query "whatsapp zen" seen in Search Console on
// 2026-10-25. Answer the spelling question immediately; do not imply that
// "WhatsApp Zen" is a separate Meta product or an official product name.
const href = "/blog/whatsapp-zen";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const faqs = [
  { q: "What is WhatsApp Zen?", a: "If you searched for WhatsApp Zen while looking for an AI chatbot or calling agent, you may mean Wapzen. Wapzen connects to an existing WhatsApp number and lets AI agents answer incoming messages and WhatsApp voice calls." },
  { q: "Is WhatsApp Zen the same as Wapzen?", a: "WhatsApp Zen is not Wapzen's product name. Wapzen is the name of the platform. People may type the words separately after hearing the brand name or while trying to find it again." },
  { q: "Is Wapzen made by WhatsApp or Meta?", a: "No. Wapzen is an independent product and is not affiliated with, endorsed by, or made by WhatsApp or Meta." },
  { q: "What can Wapzen do on WhatsApp?", a: "It can auto-reply to incoming messages with an AI chat agent, answer inbound WhatsApp voice calls, make outbound WhatsApp calls, use your business documents as a knowledge base, and save conversations and call transcripts in a dashboard." },
  { q: "Do I need the WhatsApp Business API?", a: "No. Wapzen links your personal WhatsApp or WhatsApp Business number by QR code, like a linked device. That makes setup quick, but it is not Meta's official Business Platform route and it is not intended for bulk broadcasts." },
  { q: "Is Wapzen free?", a: "Yes. Wapzen is currently free, including chat agents, voice agents, knowledge bases, API tools, and WhatsApp calling campaigns. No credit card is required." },
];

const sections = [
  {
    id: "short-answer",
    title: "The short answer: WhatsApp Zen means Wapzen here",
    body: <>
      <p>If you typed <strong>WhatsApp Zen</strong> into Google, the page you probably want is <strong>Wapzen</strong>. Wapzen is a free, no-code platform that puts an AI chatbot and an AI voice agent on the WhatsApp number your business already uses.</p>
      <p>The names are easy to separate when you hear them: &ldquo;WhatsApp&rdquo; plus &ldquo;Zen.&rdquo; The actual brand is one word: <strong>Wapzen</strong>. WhatsApp Zen is not a second Wapzen product, and it is not the name of an official WhatsApp feature.</p>
      <Note>Wapzen is an independent product. It is not affiliated with, endorsed by, or made by WhatsApp or Meta.</Note>
    </>,
  },
  {
    id: "what-it-does",
    title: "What Wapzen does on WhatsApp",
    body: <>
      <p>Wapzen gives one WhatsApp number two kinds of AI agent:</p>
      <ul>
        <li><strong>A chat agent</strong> reads incoming messages and writes a relevant reply using your instructions, business documents, and connected tools.</li>
        <li><strong>A voice agent</strong> answers incoming WhatsApp calls and can call leads on WhatsApp in a natural voice.</li>
      </ul>
      <p>Both agents can use the same knowledge base, so a customer asking about a return in chat and another asking about it on a call can get an answer from the same policy. You can review chat history, call recordings, and transcripts from the dashboard.</p>
      <Screenshot src="/blog/whatsapp-chatbot-without-business-api/conversation.webp" width={1832} height={1472} alt="A Wapzen AI agent answering customer questions in a WhatsApp conversation" caption="A Wapzen chat agent answers three different questions from the business knowledge base." />
    </>,
  },
  {
    id: "how-it-works",
    title: "How it works in four steps",
    body: <>
      <ol>
        <li><strong>Create an agent.</strong> Choose chat, voice, or both, then describe how the agent should speak and what it should do.</li>
        <li><strong>Add your business knowledge.</strong> Paste your FAQs or upload PDF and Word files with your prices, services, delivery rules, or policies.</li>
        <li><strong>Connect your number.</strong> Scan a QR code from WhatsApp&apos;s Linked devices screen, just as you would for WhatsApp Web.</li>
        <li><strong>Test and go live.</strong> Send a few real questions from another number, correct any gaps, then activate the agent.</li>
      </ol>
      <p>The <Link href="/blog/whatsapp-chatbot-without-business-api">step-by-step chatbot guide</Link> shows the complete setup with dashboard screenshots.</p>
      <Screenshot src="/blog/whatsapp-chatbot-without-business-api/connected-number.webp" width={2560} height={660} alt="Connected WhatsApp numbers in the Wapzen dashboard" caption="A connected number can be assigned a chat agent and a voice agent." />
    </>,
  },
  {
    id: "personal-or-business",
    title: "Personal WhatsApp or WhatsApp Business?",
    body: <>
      <p>Either works. Wapzen can link a number from the regular WhatsApp app or the WhatsApp Business app. You keep the app on your phone, and the agent operates as a linked device beside it.</p>
      <p>A personal number is useful if customers already contact you there and you do not want to switch apps. A WhatsApp Business number is usually the clearer choice for a company because its profile can show your business name, category, hours, and catalogue.</p>
      <p>If all you need is a fixed greeting or away message, WhatsApp Business already includes those for free. Use an AI agent when the reply needs to understand and answer each customer&apos;s actual question. See the <Link href="/blog/whatsapp-auto-reply-personal-account">personal WhatsApp auto-reply guide</Link> for the trade-offs.</p>
    </>,
  },
  {
    id: "api",
    title: "Do you need the WhatsApp Business API?",
    body: <>
      <p>Not with Wapzen. Your number connects by QR code rather than through Meta&apos;s WhatsApp Business Platform. There is no Business API application, display-name review, template approval, or per-message API fee.</p>
      <p>That convenience has a trade-off. A linked-device product is not Meta&apos;s official API route. Wapzen is designed to answer people who contact your business and to make expected follow-up calls, not to send bulk promotional messages. If you need high-volume broadcasts, a shared inbox with many human seats, or the official platform behind a business-critical number, use a Business API provider instead.</p>
    </>,
  },
  {
    id: "who-it-is-for",
    title: "Who Wapzen fits best",
    body: <>
      <p>Wapzen fits a small business whose customers already use WhatsApp and whose team keeps answering the same questions: prices, availability, opening hours, delivery, returns, appointments, or order status.</p>
      <p>It is especially useful when missed calls and slow replies cost you leads. A clinic can answer questions after hours, a property agent can call a new enquiry back, and an online store can handle routine delivery questions while a person takes over the unusual cases.</p>
      <p>It works for walk-in customers too: print a free <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR code with your logo</Link> for the counter or a flyer, and anyone who scans it lands in a chat your agent can answer.</p>
      <p>If that sounds like the WhatsApp Zen you were searching for, start with the <Link href="/free-whatsapp-chatbot">free WhatsApp chatbot</Link> or the <Link href="/free-ai-calling-agent">free AI calling agent</Link>.</p>
    </>,
  },
];

export default function WhatsAppZenPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp Zen?<br /><span>You probably mean Wapzen.</span></>}
    lead="If you searched for WhatsApp Zen, you may be looking for Wapzen: a free AI chatbot and voice agent for your existing WhatsApp number. Here is the quick, plain-English explanation."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>The product is called Wapzen.</strong> &ldquo;WhatsApp Zen&rdquo; is a natural way people separate or remember the name.</>,
        <><strong>It handles chat and voice.</strong> AI can reply to incoming WhatsApp messages, answer calls, and call leads back.</>,
        <><strong>Setup uses a QR code.</strong> It works with personal WhatsApp or WhatsApp Business, without the Business API.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={[{ label: "WhatsApp Help Center: how to link a device", href: "https://faq.whatsapp.com/1317564962315842" }]}
    related={["/blog/zen-whatsapp-workflow", "/blog/whatsapp-chatbot-without-business-api"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Make WhatsApp feel lighter.<br /><span>Start with Wapzen.</span></>, body: "Create an AI chat or voice agent, connect your number with a QR code, and test it for free. No credit card or Business API setup." }}
  />;
}
