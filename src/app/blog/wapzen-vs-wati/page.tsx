import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, Note } from "@/components/blog/BlogPost";

// Targets "wati vs", "wati alternative", "wati alternative free", "wati
// pricing" (Google/Bing autocomplete, 2026-10-25). WATI facts come from
// wati.io/pricing and WATI's help centre on the date in lib/blogPosts.ts. Be
// fair: WATI is the official-API choice for broadcasts and team inboxes.
const href = "/blog/wapzen-vs-wati";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const comparison = [
  ["What it is", "WhatsApp Business API platform: team inbox, broadcasts, chatbots", "AI agents that answer WhatsApp chats and calls on your own number"],
  ["Starting price", "$39/month (Growth, billed annually)", "Free right now"],
  ["Free trial", "7 days", "No trial needed"],
  ["WhatsApp message fees", "Per message for templates, from WATI's rate card", "None"],
  ["Setup", "Connect a number to the WhatsApp Business API", "Scan a QR code, like WhatsApp Web"],
  ["Meta review", "Message templates and display name", "None"],
  ["AI chatbot", "Flow builder, AI Co-pilot credits, Astra AI agents (add-on)", "GPT or Claude agent with your knowledge base, included"],
  ["WhatsApp calls", "Business Calling in the inbox, Astra voice AI agents", "AI voice agent answers and makes calls, included"],
  ["Broadcasts", "15k a month on Growth, unlimited on Pro", "Not built for bulk messaging"],
  ["Team seats", "3 users on Growth, 5 on Pro, then $24 per user", "One account; take over any chat yourself"],
  ["Integrations", "Shopify, HubSpot (Pro), Salesforce (Business), API", "API tools that call your own systems"],
  ["Official Meta platform", "Yes", "No: links like WhatsApp Web"],
];

const faqs = [
  { q: "Is Wapzen a good WATI alternative?", a: "It is if what you need is AI that answers your customers' WhatsApp messages and calls. Wapzen runs an AI chatbot and an AI voice agent on your existing number for free, without the Business API. It is not a replacement for WATI's broadcasts, multi-seat team inbox, or native CRM integrations." },
  { q: "Is WATI free?", a: "No. WATI offers a 7-day free trial. Its plans start at $39 a month for Growth and $79 a month for Pro, both billed annually, with Business priced on request. WhatsApp message charges and some AI features, such as Astra AI agents, cost extra." },
  { q: "Does WATI support WhatsApp calls?", a: "Yes. WATI lists WhatsApp Business Calling in its team inbox, and its Astra platform can run AI voice agents that answer and place WhatsApp calls. WATI says AI features roll out in phases, so check availability for your workspace and plan." },
  { q: "Do I need the WhatsApp Business API to use Wapzen?", a: "No. Wapzen links a WhatsApp or WhatsApp Business number by QR code, the way WhatsApp Web does, so there's no Business API account, Meta approval, or template fee." },
  { q: "Which is better for a small business, Wapzen or WATI?", a: "If you want to send marketing broadcasts or have several people answering chats, WATI fits better. If you mainly want AI to reply to messages and answer calls without a monthly bill, Wapzen fits better, and you can start in a few minutes." },
  { q: "Is Wapzen an official WhatsApp product?", a: "No. Wapzen is an independent product and isn't affiliated with Meta or WhatsApp. It links your number as a linked device, like WhatsApp Web. WATI, by contrast, is built on Meta's official WhatsApp Business Platform." },
];

const sources = [
  { label: "WATI pricing", href: "https://www.wati.io/pricing/" },
  { label: "WATI: Astra voice AI agent for WhatsApp calling", href: "https://support.wati.io/en/articles/13193217-how-to-enable-astra-voice-ai-agent-for-whatsapp-calling-in-wati" },
  { label: "WATI product updates", href: "https://feedback.wati.io/" },
];

const sections = [
  {
    id: "at-a-glance",
    title: "Wapzen vs WATI at a glance",
    body: <>
      <p>WATI and Wapzen both put automation on WhatsApp, but they start from different places. WATI is a platform built on Meta’s official <strong>WhatsApp Business API</strong>, designed for teams that broadcast, sell, and support customers at volume. Wapzen is built around <strong>AI agents</strong>: a chatbot that replies to incoming messages and a voice agent that answers and makes WhatsApp calls, running on the number you already use.</p>
      <Comparison caption="WATI compared with Wapzen" columns={["WATI", "Wapzen"]} rows={comparison} />
    </>,
  },
  {
    id: "pricing",
    title: "Pricing: what you’ll actually pay",
    body: <>
      <h3>WATI</h3>
      <p>WATI has three plans. <strong>Growth</strong> is $39 a month and <strong>Pro</strong> is $79 a month, both billed annually; <strong>Business</strong> is priced on request. WATI says annual billing saves up to about 25% compared with monthly. Growth includes 3 users with no option to add more; Pro includes 5, and extra users cost $24 each per month ($59 on Business).</p>
      <p>The plan is only part of the bill. WhatsApp charges per message for marketing, utility, and authentication templates, at rates that depend on the recipient’s country, and WATI bills these from its own rate card. AI is metered too: Growth includes 250 AI Co-pilot credits a month and Pro 500, extra credits start at $20 a month, and Astra AI agents are priced separately.</p>
      <p>A five-person team on Pro pays $948 a year for the plan alone, before message charges and AI add-ons.</p>
      <h3>Wapzen</h3>
      <p>Wapzen is currently free, with every feature included: the AI chatbot, the AI voice agent, outbound calling campaigns, knowledge bases, and API tools. The AI models (OpenAI GPT and Anthropic Claude) and the voices are included, so you don’t need your own API keys. Because your number is linked by QR code rather than the Business API, there are no per-message fees, and calls have no per-minute charge. See the <Link href="/pricing">pricing page</Link> for details.</p>
      <Note>WATI’s prices are from its pricing page on the date at the top of this post. If Wapzen introduces paid plans, they’ll be listed on its pricing page.</Note>
    </>,
  },
  {
    id: "ai-chatbot",
    title: "AI chatbot: flows vs an AI agent",
    body: <>
      <p>WATI’s chatbot builder is flow-based: you design paths with keywords, buttons, and forms, with advanced chatbots on Pro. AI comes on top of that. <strong>AI Co-pilot</strong> helps your human agents write replies, and <strong>Astra</strong> lets you describe an AI agent in plain language and deploy it on WhatsApp once Astra is connected to your WATI account.</p>
      <p>In Wapzen, the chatbot <em>is</em> an AI agent. You write its instructions, choose a GPT or Claude model, and attach knowledge bases built from text, PDF, or Word files. It answers free-text questions in the customer’s own words and language, and API tools let it look up an order or request a booking in your own systems. When you want to step in, you reply from the dashboard and take the conversation over.</p>
      <p>Which is better depends on the conversation. For strict, menu-driven journeys (“reply 1 for sales, 2 for support”), a flow builder like WATI’s gives you exact control. For open questions about prices, opening hours, delivery, or your services, an AI agent trained on your documents handles far more without you mapping every path. Wapzen’s <Link href="/free-whatsapp-chatbot">free WhatsApp chatbot guide</Link> shows the setup.</p>
    </>,
  },
  {
    id: "calling",
    title: "WhatsApp calls and AI voice agents",
    body: <>
      <p>Both products handle WhatsApp voice calls, in different ways.</p>
      <p><strong>WATI</strong> lists WhatsApp Business Calling in its team inbox, so your team can take customers’ WhatsApp calls, and its Astra platform can run voice AI agents that answer and start WhatsApp calls, with settings for voice, call length, and silence handling. WATI notes that AI features roll out in phases, so confirm they’re enabled for your plan.</p>
      <p><strong>Wapzen</strong> was built around calling from the start. A voice agent answers incoming WhatsApp calls on your linked number around the clock and can call people back. You can also run outbound calling campaigns: add leads to a campaign and each one gets a call from your agent, with transcripts and campaign analytics in the dashboard. Voice agents can speak dozens of languages. Wapzen’s calls are WhatsApp calls only; it doesn’t dial regular phone numbers. More in the <Link href="/free-ai-calling-agent">AI calling agent guide</Link>.</p>
    </>,
  },
  {
    id: "setup",
    title: "Setup: Business API vs a QR code",
    body: <>
      <p>With WATI, you connect a number to the WhatsApp Business API, which WATI sets up without a setup fee. That means a Meta business account, a display name that Meta reviews, and approved templates for any message you start or send more than 24 hours after the customer’s last message. Then you build your flows and invite your team.</p>
      <p>With Wapzen, setup takes four steps:</p>
      <ol>
        <li><strong>Sign up</strong> for free, without a card.</li>
        <li><strong>Create an agent:</strong> a chat agent, a voice agent, or both, with your instructions and knowledge base.</li>
        <li><strong>Scan the QR code</strong> with WhatsApp on your phone, the same way you link WhatsApp Web.</li>
        <li><strong>Go live:</strong> the agent starts replying to messages and answering calls.</li>
      </ol>
      <p>The trade-off is the one in the table: the Business API is Meta’s official route and suits high-volume messaging, while a QR-linked number gets you going in minutes, with no approval or fees, on a product that isn’t an official Meta platform.</p>
      <p>Don’t confuse that QR code with the one customers scan. The first links your number to Wapzen. The second opens a chat with you, and you can make one with the free <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR code generator</Link> for either platform.</p>
    </>,
  },
  {
    id: "which",
    title: "Which one should you choose?",
    body: <>
      <Choose items={[
        { name: "WATI", points: [
          "You send broadcasts or template campaigns to opted-in contacts",
          "Several people answer chats and need seats, roles, and assignment",
          "You want native Shopify, HubSpot, or Salesforce integrations",
          "You need Meta’s official API, for volume or a verified business profile",
        ] },
        { name: "Wapzen", points: [
          "You want AI to answer messages and calls now, without a monthly bill",
          "You want to keep the number and app your customers already use",
          "You’d rather skip Meta approval and per-message fees",
          "Calls matter: an AI receptionist, lead call-backs, or reminders",
        ] },
      ]} />
      <p>The short version: <strong>WATI is a messaging platform with AI added; Wapzen is an AI agent for WhatsApp chats and calls.</strong> If broadcasts and a human team inbox are the core of your WhatsApp strategy, WATI is worth its price. If you want customers who message or call you to get an instant, useful answer, Wapzen does that for free.</p>
      <p>Comparing more options? See the <Link href="/blog/wati-alternatives">7 best WATI alternatives</Link> or <Link href="/blog/wati-vs-aisensy-vs-interakt">WATI vs AiSensy vs Interakt</Link>.</p>
      <Note>Wapzen links your number like WhatsApp Web, so it’s meant for answering people who contact you and calling leads who expect your call. Mass unsolicited messaging breaks WhatsApp’s terms on any account; use an official API platform for large opt-in broadcasts.</Note>
    </>,
  },
];

export default function WapzenVsWatiPage() {
  return <BlogPost
    href={href}
    heading={<>Wapzen vs WATI.<br /><span>Which one fits your business?</span></>}
    lead="WATI is a full WhatsApp Business API platform for teams that broadcast, sell, and support at scale. Wapzen puts a free AI chatbot and AI voice agent on the number you already use. Here’s how they compare on price, AI, calling, and setup."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Choose WATI</strong> for official Business API features: broadcasts, a shared inbox for a team, and Shopify, HubSpot, or Salesforce integrations.</>,
        <><strong>Choose Wapzen</strong> if you mainly want AI to answer your WhatsApp messages and calls on your current number, without a plan or per-message fees.</>,
        <><strong>Cost:</strong> WATI starts at $39 a month billed annually, plus message charges and AI add-ons. Wapzen is currently free.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    product="/whatsapp-business-api-alternative"
    cta={{ heading: <>AI on your WhatsApp.<br /><span>Free, in minutes.</span></>, body: "Sign up, scan a QR code, and let an AI chatbot and voice agent answer your WhatsApp messages and calls." }}
  />;
}
