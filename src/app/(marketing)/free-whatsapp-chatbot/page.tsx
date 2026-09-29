import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { BookOpen, History, Languages, MessageSquareReply, Smartphone, Zap } from "lucide-react";
import { Cards, Comparison, MarketingPage, Section, Steps } from "@/components/marketing/MarketingPage";

// Targets "how to make whatsapp chatbot for free", "create whatsapp chatbot
// free", "free whatsapp chatbot builder", "is whatsapp chatbot free"
// (docs/seo-research.md).
const path = "/free-whatsapp-chatbot";
const title = "Free WhatsApp Chatbot Builder: Create an AI Chatbot";
const description = "Make a WhatsApp chatbot for free. Connect your number by QR code, add your business info, and an AI chatbot auto-replies 24/7. No code, no Business API.";

export const metadata: Metadata = pageMetadata({ title, description, path: path });

const steps = [
  { title: "Sign up for free", body: "Create a Wapzen account. There is no credit card to enter and no WhatsApp Business API application to file." },
  { title: "Create a chat agent", body: "Name your chatbot, choose an OpenAI GPT or Anthropic Claude model, and write its instructions: who it speaks for, its tone, and what it should or shouldn't answer." },
  { title: "Add your business knowledge", body: "Attach a knowledge base with your FAQs, prices, opening hours, or policies. Paste text or upload PDF and Word files, and the chatbot answers from them." },
  { title: "Connect your WhatsApp number", body: "Scan a QR code with WhatsApp on your phone, the same way you link WhatsApp Web. It works with a personal WhatsApp or a WhatsApp Business number." },
  { title: "Test it and go live", body: "Message your number from another phone. The AI chatbot replies right away, and every conversation is saved in your dashboard." },
];

const features = [
  { icon: MessageSquareReply, title: "24/7 AI auto-reply", body: "Replies to every incoming WhatsApp message in seconds, day or night, weekends included." },
  { icon: BookOpen, title: "Answers from your knowledge", body: "Uses your documents, FAQs, and prices, so answers are specific to your business instead of generic." },
  { icon: Languages, title: "Your customer's language", body: "Customers write in their own language and the chatbot answers in the same one." },
  { icon: Zap, title: "Actions with API tools", body: "Connect API request tools to check an order, look up availability, or book an appointment in your own system." },
  { icon: Smartphone, title: "Your existing number", body: "Link a personal WhatsApp or WhatsApp Business number by QR code. No new number, no Business API." },
  { icon: History, title: "Saved conversations", body: "Review every chat in the dashboard, so your team can follow up with full context." },
];

const comparison = [
  ["Cost", "Free", "Free software; you pay for hosting and AI usage", "Free right now"],
  ["AI answers", "No: fixed greeting and away messages", "Yes, if you build it", "Yes"],
  ["Coding or setup", "None", "Workflows, hosting, and API setup", "None"],
  ["WhatsApp connection", "Business app only", "Usually the Business API", "QR code, personal or Business number"],
  ["Answers calls with AI", "No", "Rarely", "Yes, with a voice agent"],
];

const faqs = [
  { q: "Is a WhatsApp chatbot free?", a: "It can be. The WhatsApp Business app's greeting and away messages are free, but they send fixed text. Wapzen is currently free and gives you a real AI chatbot that answers each question from your business information." },
  { q: "How do I make a WhatsApp chatbot for free?", a: "Sign up for Wapzen, create a chat agent with your instructions, attach your FAQs or documents, and connect your WhatsApp number by scanning a QR code. The chatbot then replies to incoming messages, with no coding and no cost." },
  { q: "Can I create a WhatsApp chatbot without coding?", a: "Yes. Wapzen is a no-code WhatsApp chatbot builder. You set up the chatbot with plain-language instructions and your own documents instead of flow diagrams or code." },
  { q: "Do I need the WhatsApp Business API for a chatbot?", a: "Not with Wapzen. It links your number by QR code, like WhatsApp Web, so there is no Business API application, template approval, or per-message fee." },
  { q: "Does it work with a personal WhatsApp account?", a: "Yes. You can link a personal WhatsApp or a WhatsApp Business number. The personal app has no built-in auto-reply, and Wapzen adds AI auto-reply to it." },
  { q: "Which AI powers the chatbot?", a: "You choose for each chat agent: OpenAI GPT models, the model family behind ChatGPT, or Anthropic Claude models. Both are included, so you don't need your own API key." },
  { q: "Can the chatbot also answer WhatsApp calls?", a: "Chat agents handle messages. For calls, create a free AI voice agent in the same account: it answers inbound WhatsApp calls in a natural voice and can make outbound calls." },
];

export default function FreeWhatsAppChatbotPage() {
  return <MarketingPage
    path={path}
    name="Free WhatsApp chatbot"
    title={title}
    description={description}
    eyebrow="Free WhatsApp chatbot"
    heading={<>Make a WhatsApp chatbot.<br /><span>Free, with AI built in.</span></>}
    lead="Wapzen is a free WhatsApp chatbot builder. Create an AI chatbot that answers customers from your own business information, then connect your WhatsApp number by QR code. No coding and no WhatsApp Business API."
    perks={["Free to use", "No code", "No Business API", "Personal or Business number"]}
    ctaLabel="Build my free chatbot"
    secondary={{ href: "/pricing", label: "See pricing" }}
    related={["/whatsapp-auto-reply", "/whatsapp-business-api-alternative"]}
    faq={{ heading: <>Free WhatsApp chatbots.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Build your free WhatsApp chatbot.<br /><span>No code, no card.</span></>, body: "Sign up, add your business information, scan a QR code, and let AI answer your WhatsApp messages day and night." }}
  >
    <Section id="how-to" heading={<>How to make a WhatsApp chatbot for free.<br /><span>Five steps, no code.</span></>}>
      <Steps items={steps} />
    </Section>

    <Section id="features" heading={<>What your free chatbot does.<br /><span>Everything, included.</span></>} intro="The free plan is the full product. Every feature below works on your own WhatsApp number from day one.">
      <Cards items={features} />
    </Section>

    <Section id="compare" heading={<>Free WhatsApp chatbot options.<br /><span>Compared honestly.</span></>} intro="There are three common ways to automate WhatsApp replies without paying for a chatbot platform. Here's how they differ.">
      <Comparison caption="Free WhatsApp chatbot options compared" columns={["WhatsApp Business app", "DIY with n8n or code", "Wapzen"]} rows={comparison} />
    </Section>
  </MarketingPage>;
}
