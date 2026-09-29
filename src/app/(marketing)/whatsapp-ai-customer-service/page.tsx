import type { Metadata } from "next";
import { Clock, Languages, Package, PhoneIncoming, RotateCcw, Tag } from "lucide-react";
import { pageMetadata } from "@/lib/pageMetadata";
import { Cards, Comparison, MarketingPage, Section, Steps } from "@/components/marketing/MarketingPage";

// Targets "ai voice agent for customer service", "ai customer service agent",
// "whatsapp ai customer service", "whatsapp customer service automation"
// (docs/seo-research.md). Order lookups need a configured API tool.
const path = "/whatsapp-ai-customer-service";
const title = "WhatsApp AI Customer Service Agent for Chat & Calls";
const description = "Automate WhatsApp customer service with a free AI agent that answers chats and voice calls 24/7 from your knowledge base, in your customer's language.";

export const metadata: Metadata = pageMetadata({ title, description, path });

const handles = [
  { icon: Package, title: "Orders and delivery", body: "Answers delivery times and shipping questions from your policies, and checks a specific order with an API tool connected to your store." },
  { icon: Tag, title: "Prices and products", body: "Shares prices, sizes, and availability from the catalogue or price list you upload." },
  { icon: RotateCcw, title: "Returns and refunds", body: "Explains your return and refund policy clearly, the same way every time." },
  { icon: Clock, title: "Hours and locations", body: "Tells customers where and when you're open, including holiday hours." },
  { icon: PhoneIncoming, title: "Support calls", body: "Customers who prefer to talk can call your WhatsApp number and get the same answers by voice." },
  { icon: Languages, title: "Any language", body: "The chatbot replies in the language each customer writes in, and voice agents speak the language you choose." },
];

const steps = [
  { title: "Gather your support answers", body: "Collect your FAQs, return policy, shipping details, and price lists as text, PDF, or Word files." },
  { title: "Create a knowledge base", body: "Upload them to a Wapzen knowledge base. Your agents search it during every chat and call." },
  { title: "Create chat and voice agents", body: "Write instructions for tone and scope, such as what to answer and when to tell customers a team member will follow up." },
  { title: "Connect API tools (optional)", body: "Let the agent look up an order or a booking in your own system with an API request tool." },
  { title: "Link your number and review", body: "Connect your WhatsApp number by QR code, then read chats and call transcripts to improve answers over time." },
];

const comparison = [
  ["First response", "Minutes to hours", "Seconds"],
  ["Availability", "Working hours", "24/7"],
  ["Repeated questions", "Typed out by hand every time", "Answered from your knowledge base"],
  ["Support calls", "Missed when the team is busy", "Answered by an AI voice agent"],
  ["Tricky cases", "Your team", "Still your team, with the full history"],
];

const faqs = [
  { q: "Can AI handle customer service on WhatsApp?", a: "Yes. An AI agent can answer the routine questions that fill most support chats: orders, delivery, returns, prices, and hours. Wapzen does this on WhatsApp messages and voice calls, using your own knowledge base." },
  { q: "What is an AI customer service agent?", a: "It's software that answers customer questions on its own, using an AI model and your business information. Wapzen's agents work on WhatsApp chats and WhatsApp voice calls." },
  { q: "Can the AI check a customer's order status?", a: "Yes, if you connect it. Create an API request tool that calls your store or order system, and the agent uses it during chats and calls. Without a tool, it answers from your policies and FAQs." },
  { q: "What happens when the AI can't answer?", a: "You decide in the agent's instructions, for example asking the customer to wait for a team member. Every chat and call is saved in the dashboard, so your team can follow up with full context." },
  { q: "Does it work for voice support too?", a: "Yes. Assign a voice agent to your number and customers who call you on WhatsApp get answers in a natural voice, with a transcript saved for every call." },
  { q: "How much does WhatsApp AI customer service cost?", a: "Wapzen is currently free, with every feature included. There are no WhatsApp Business API message fees, because your number is linked by QR code." },
];

export default function WhatsAppAiCustomerServicePage() {
  return <MarketingPage
    path={path}
    name="WhatsApp AI customer service"
    title={title}
    description={description}
    eyebrow="AI customer service"
    heading={<>WhatsApp customer service.<br /><span>Answered by AI, 24/7.</span></>}
    lead="Give customers instant answers on WhatsApp. Wapzen's AI customer service agent replies to messages and answers voice calls using your FAQs, policies, and documents, and can check orders through your own systems."
    perks={["Chat and voice", "Open 24/7", "Your knowledge base", "Free to use"]}
    secondary={{ href: "/pricing", label: "See pricing" }}
    related={["/whatsapp-auto-reply", "/ai-receptionist"]}
    faq={{ heading: <>AI customer service.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Faster answers for customers.<br /><span>Less typing for your team.</span></>, body: "Upload your support knowledge, link your WhatsApp number, and let AI handle the routine questions. Free, with no credit card." }}
  >
    <Section id="handles" heading={<>What it answers.<br /><span>The questions you get every day.</span></>}>
      <Cards items={handles} />
    </Section>

    <Section id="how-to" heading={<>How to automate WhatsApp customer service.<br /><span>Five steps, no code.</span></>}>
      <Steps items={steps} />
    </Section>

    <Section id="compare" heading={<>Your team, plus AI.<br /><span>What changes.</span></>}>
      <Comparison caption="Human-only support compared with Wapzen AI plus your team" columns={["Human-only support", "Wapzen AI + your team"]} rows={comparison} />
    </Section>
  </MarketingPage>;
}
