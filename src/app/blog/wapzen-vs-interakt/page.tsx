import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, Note } from "@/components/blog/BlogPost";

// Targets "interakt alternative" (+ "free", "india", "best"), "interakt vs",
// "interakt pricing" (autocomplete, 2026-10-25). Interakt facts come from
// interakt.shop/pricing on the date in lib/blogPosts.ts. Be fair: Interakt is
// built for selling on WhatsApp (catalog, payments, Shopify, COD-to-prepaid).
const href = "/blog/wapzen-vs-interakt";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const comparison = [
  ["What it is", "WhatsApp Business API platform for selling: campaigns, catalog, payments, inbox", "AI agents that answer WhatsApp chats and calls on your own number"],
  ["Starting price", "Growth $55/month + taxes", "Free right now"],
  ["Free trial", "Yes", "No trial needed"],
  ["Team", "Unlimited agents", "One account; take over any chat yourself"],
  ["Chatbot", "Linear on Growth, branching with API calls on Advanced", "AI agent with your knowledge base"],
  ["AI agents", "Add-on: ₹2,499/month + taxes with 100 AI messages", "Included"],
  ["WhatsApp calls", "Agents call and receive calls in the inbox (Advanced)", "AI voice agent answers and makes calls"],
  ["Shopify and COD", "Abandoned checkout, order alerts, COD-to-prepaid flow", "AI calls to confirm COD orders (via API)"],
  ["Message charges", "Template charges above the free limit", "None"],
  ["Setup", "Business API onboarding, with help on Growth", "Scan a QR code"],
  ["Official Meta platform", "Yes", "No: links like WhatsApp Web"],
];

const faqs = [
  { q: "Is there a free alternative to Interakt?", a: "Yes, if you mainly need AI replies and calls rather than campaigns. Wapzen is currently free and runs an AI chatbot and AI voice agent on your existing WhatsApp number, without the Business API. For broadcasts, catalogs, and payments, a Business API platform such as Interakt, WATI, or AiSensy is still the better fit." },
  { q: "How much does Interakt cost?", a: "Interakt's WhatsApp plans are Growth at $55 a month and Advanced at $69 a month, plus taxes, with 8% off quarterly and 20% off yearly billing. Enterprise is priced on request. WhatsApp AI agents are an add-on at ₹2,499 a month plus taxes, and template charges above the free limit come on top." },
  { q: "Does Interakt have AI agents?", a: "Yes, as an add-on for the Growth and Advanced plans: Sales, Lead Qualification, and Customer Support agents that run around the clock. The add-on includes 100 AI messages a month, with more charged per message." },
  { q: "Can Interakt make WhatsApp calls?", a: "Interakt's Advanced plan lists outbound calling from the inbox and receiving inbound calls, which your team handles. Wapzen's calls are answered and made by an AI voice agent, so they work without anyone on your team picking up." },
  { q: "Which is better for a Shopify store, Interakt or Wapzen?", a: "For WhatsApp selling features such as catalog sync, abandoned checkout reminders, order notifications, and COD-to-prepaid flows, Interakt is built for Shopify. Wapzen fits alongside: an AI agent that answers product questions and calls COD buyers to confirm their orders." },
  { q: "Is Wapzen an official WhatsApp Business API platform?", a: "No. Wapzen is an independent product that links your number as a linked device, like WhatsApp Web. Interakt runs on Meta's official WhatsApp Business Platform, which is the right choice for opted-in broadcasts at scale." },
];

const sources = [
  { label: "Interakt pricing", href: "https://www.interakt.shop/pricing/" },
];

const sections = [
  {
    id: "at-a-glance",
    title: "Wapzen vs Interakt at a glance",
    body: <>
      <p>Interakt is a WhatsApp Business API platform built for selling: campaigns, a shared inbox, a WhatsApp catalog and checkout, payments, and deep Shopify features, especially popular with Indian D2C brands. Wapzen is an AI agent that answers your WhatsApp messages and calls on the number you already use. They overlap less than you’d think.</p>
      <Comparison caption="Interakt compared with Wapzen" columns={["Interakt", "Wapzen"]} rows={comparison} />
    </>,
  },
  {
    id: "pricing",
    title: "Pricing",
    body: <>
      <h3>Interakt</h3>
      <p>Interakt’s WhatsApp plans are <strong>Growth at $55 a month</strong> and <strong>Advanced at $69 a month</strong>, plus taxes, with 8% off quarterly and 20% off yearly billing. <strong>Enterprise</strong> is priced on request and is the plan that lists no markup on messages. Both include unlimited agents, which makes Interakt good value for teams.</p>
      <p>Two things sit on top. <strong>WhatsApp AI agents</strong> are an add-on at ₹2,499 a month plus taxes, including 100 AI messages, then $0.011 per AI message. And Interakt’s own pricing formula is the plan price plus <strong>template charges above the free limit</strong>, which depend on the message type and country.</p>
      <p>A store on Growth with AI agents pays $55 plus ₹2,499 a month, plus taxes and template charges.</p>
      <h3>Wapzen</h3>
      <p>Wapzen is currently free with everything included: the AI chat agent, the AI voice agent, knowledge bases, API tools, and outbound calling campaigns, along with the AI models and voices. There are no message or template fees, because it doesn’t use the Business API. See the <Link href="/pricing">pricing page</Link>.</p>
      <Note>Interakt’s prices are from its pricing page on the date at the top of this post; you may see local pricing in your country. Check them before you buy.</Note>
    </>,
  },
  {
    id: "ai",
    title: "Chatbots and AI agents",
    body: <>
      <p><strong>Interakt</strong> includes a linear chatbot on Growth and branching chatbots that can call APIs on Advanced. Its AI add-on gives you three ready-made agents (Sales, Lead Qualification, and Customer Support) that run around the clock. The 100 AI messages included each month go quickly for a busy store, so budget for the per-message rate.</p>
      <p><strong>Wapzen</strong> has no flow builder. Its chatbot is one AI agent that you instruct in plain language, with your choice of GPT or Claude and a knowledge base built from your own text, PDF, and Word files. It answers free-text questions in the customer’s language and can call your systems through API tools. There’s no AI message quota.</p>
    </>,
  },
  {
    id: "calls-and-cod",
    title: "Calls, Shopify, and cash on delivery",
    body: <>
      <p>Interakt’s Advanced plan lists <strong>outbound calling from the inbox</strong> and <strong>receiving inbound calls</strong>, so your team can talk to customers on WhatsApp from the same place they chat. Someone on your team takes those calls.</p>
      <p>Wapzen’s calls are handled by an <strong>AI voice agent</strong>. It answers incoming WhatsApp calls day and night, and places calls from outbound campaigns, with a transcript of each.</p>
      <p>For cash on delivery, the two approach the problem differently. Interakt’s Growth plan includes a Shopify <strong>COD-to-prepaid flow</strong> that nudges buyers to pay online, plus order notifications. Wapzen can <strong>call each COD buyer</strong> to confirm the order before you ship, and send a WhatsApp confirmation during the call; our <Link href="/blog/whatsapp-cod-order-confirmation">COD confirmation guide</Link> walks through it. Wapzen has no Shopify app, so orders reach it through the API and an automation tool.</p>
    </>,
  },
  {
    id: "which",
    title: "Which one should you choose?",
    body: <>
      <Choose items={[
        { name: "Interakt", points: [
          "You sell on WhatsApp with a catalog, checkout, and WhatsApp Pay",
          "You run a Shopify store and want abandoned checkout and COD-to-prepaid flows",
          "Several people answer chats and you want unlimited agents",
          "You send campaigns to opted-in customers on the official API",
        ] },
        { name: "Wapzen", points: [
          "You want AI to answer messages without paying per AI message",
          "You want an AI agent, not your team, to answer and make WhatsApp calls",
          "You want to confirm COD orders with an automatic call",
          "You’d rather keep your current number and skip Meta approvals",
        ] },
      ]} />
      <p>The short version: <strong>Interakt is a WhatsApp commerce platform with AI as an add-on; Wapzen is an AI agent for WhatsApp chats and calls.</strong> If selling features are the core of your WhatsApp, Interakt earns its price. If you want every customer who messages or calls to get an instant answer, Wapzen does that for free.</p>
      <p>Comparing more options? Read <Link href="/blog/wati-vs-aisensy-vs-interakt">WATI vs AiSensy vs Interakt</Link> or <Link href="/blog/wapzen-vs-aisensy">Wapzen vs AiSensy</Link>.</p>
      <Note>Wapzen links your number like WhatsApp Web, so it’s for answering people who contact you and calling people who expect your call. Bulk messaging to people who didn’t opt in breaks WhatsApp’s terms on any account.</Note>
    </>,
  },
];

export default function WapzenVsInteraktPage() {
  return <BlogPost
    href={href}
    heading={<>Wapzen vs Interakt.<br /><span>Selling vs answering.</span></>}
    lead="Interakt is a WhatsApp Business API platform for selling, with campaigns, a catalog, payments, and Shopify flows. Wapzen is a free AI agent that answers your WhatsApp messages and calls. Here’s how they compare on price, AI, calling, and cash on delivery."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Choose Interakt</strong> to sell on WhatsApp: catalog, checkout, payments, Shopify automations, and campaigns, with unlimited agents.</>,
        <><strong>Choose Wapzen</strong> if you want AI to answer messages and calls on your current number, including calls that confirm COD orders.</>,
        <><strong>Cost:</strong> Interakt starts at $55 a month plus taxes, with AI agents ₹2,499 a month extra. Wapzen is currently free.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/wapzen-vs-aisensy", "/blog/whatsapp-cod-order-confirmation"]}
    product="/whatsapp-ai-customer-service"
    cta={{ heading: <>AI answers on WhatsApp.<br /><span>Chats and calls, free.</span></>, body: "Sign up, scan a QR code, and let an AI agent answer your customers’ WhatsApp messages and calls." }}
  />;
}
