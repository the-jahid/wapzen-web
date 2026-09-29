import type { Metadata } from "next";
import { Clock, Globe, Languages, PhoneIncoming, QrCode, Sparkles } from "lucide-react";
import { pageMetadata } from "@/lib/pageMetadata";
import { Cards, Comparison, MarketingPage, Section, Steps } from "@/components/marketing/MarketingPage";

// US page. Targets "whatsapp in usa", "whatsapp for business", "whatsapp
// business usage", "whatsapp chatbot (free)", "spanish chatbot" (docs/
// seo-research.md, US harvest). Keep usage claims qualitative: no statistics
// without a source.
const path = "/whatsapp-for-business-usa";
const title = "WhatsApp for Business in the USA: Free AI Agent";
const description = "Serve US customers who prefer WhatsApp. Wapzen adds a free AI chatbot and voice agent to your WhatsApp number that answers in English or Spanish, 24/7.";

export const metadata: Metadata = pageMetadata({ title, description, path });

const why = [
  { icon: Globe, title: "International customers", body: "Clients abroad and travelers reach you on WhatsApp without international calling or texting charges." },
  { icon: Languages, title: "Spanish-speaking customers", body: "WhatsApp is an everyday app for many Spanish-speaking customers in the US. Meet them there, and answer in Spanish." },
  { icon: PhoneIncoming, title: "Calls without long distance", body: "Customers can call your business over WhatsApp from anywhere, using data instead of phone minutes." },
  { icon: QrCode, title: "One tap to start", body: "A click-to-chat link or QR code on your website, menu, or storefront opens a chat instantly. Our free tools make both." },
  { icon: Sparkles, title: "AI that answers for you", body: "A chat agent and a voice agent answer from your FAQs, prices, and policies, so you're not glued to your phone." },
  { icon: Clock, title: "Open around the clock", body: "Nights, weekends, and time zones stop mattering: every message and call gets an answer." },
];

const steps = [
  { title: "Pick your number", body: "Use your existing WhatsApp or WhatsApp Business number, including a US mobile number." },
  { title: "Sign up for Wapzen free", body: "No credit card and no WhatsApp Business API application." },
  { title: "Create your AI agents", body: "A chat agent for messages and a voice agent for calls, in English or Spanish, trained on your FAQs and prices." },
  { title: "Link your number", body: "Scan a QR code with WhatsApp on your phone, the same way you link WhatsApp Web." },
  { title: "Share your WhatsApp link", body: "Add a click-to-chat link or QR code to your website, social profiles, packaging, and receipts." },
];

const comparison = [
  ["International customers", "International rates, or not supported", "Free for customers over the internet"],
  ["Registration", "10DLC registration for business texting", "None: scan a QR code"],
  ["AI replies", "Usually an add-on", "Included"],
  ["Voice calls", "A separate phone line", "WhatsApp calls answered by AI"],
  ["Cost", "Usually per-message fees", "Free right now"],
];

const faqs = [
  { q: "Is WhatsApp popular in the USA?", a: "WhatsApp is less universal in the US than in many other countries, but it's widely used by people with family or clients abroad, by travelers, and by many Spanish-speaking customers. For businesses serving them, it's often the easiest way to be reached." },
  { q: "Can US businesses use WhatsApp for free?", a: "Yes. The WhatsApp Business app is free, and Wapzen adds an AI chatbot and voice agent to your number, which is also free right now." },
  { q: "Do I need the WhatsApp Business API in the US?", a: "Not with Wapzen. It links your number by QR code, so there's no API application, template approval, or per-message fee. For large-scale broadcasts, the official API is the better tool." },
  { q: "Can the AI answer in Spanish?", a: "Yes. The chatbot replies in the language each customer writes in, and you can set a voice agent's language to Spanish (US)." },
  { q: "Can I use a US phone number?", a: "Yes. Link any number that's registered on WhatsApp, including a US mobile number." },
  { q: "How do customers find my WhatsApp?", a: "Share a click-to-chat link or QR code on your website, social profiles, packaging, and receipts. Wapzen's free WhatsApp tools create both." },
];

export default function WhatsAppForBusinessUsaPage() {
  return <MarketingPage
    path={path}
    name="WhatsApp for business in the USA"
    title={title}
    description={description}
    eyebrow="WhatsApp for business · USA"
    heading={<>WhatsApp for business in the USA.<br /><span>Answered by AI, 24/7.</span></>}
    lead="Plenty of your customers already use WhatsApp, especially international clients, travelers, and Spanish-speaking customers. Wapzen gives your WhatsApp number an AI chatbot and voice agent that answer them in English or Spanish, day or night, for free."
    perks={["Free to use", "English and Spanish", "Chat and voice", "Your existing number"]}
    secondary={{ href: "/tools", label: "Free WhatsApp link tools" }}
    related={["/ai-answering-service", "/free-whatsapp-chatbot"]}
    faq={{ heading: <>WhatsApp in the USA.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Meet customers on WhatsApp.<br /><span>Let AI answer them.</span></>, body: "Sign up free, set your agents to English or Spanish, and link your WhatsApp number with a QR code." }}
  >
    <Section id="why" heading={<>Why US businesses add WhatsApp.<br /><span>And why they add AI.</span></>}>
      <Cards items={why} />
    </Section>

    <Section id="how-to" heading={<>Set up WhatsApp for your US business.<br /><span>Five steps, no code.</span></>}>
      <Steps items={steps} />
    </Section>

    <Section id="compare" heading={<>Business texting vs WhatsApp.<br /><span>What changes.</span></>} intro="Many US businesses text customers over SMS. Here's how WhatsApp with Wapzen compares.">
      <Comparison caption="Business texting (SMS) compared with WhatsApp and Wapzen" columns={["Business texting (SMS)", "WhatsApp with Wapzen"]} rows={comparison} />
    </Section>
  </MarketingPage>;
}
