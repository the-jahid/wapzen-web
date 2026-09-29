import type { Metadata } from "next";
import { CalendarCheck, FileText, Languages, ListChecks, PhoneIncoming, PhoneOutgoing } from "lucide-react";
import { pageMetadata } from "@/lib/pageMetadata";
import { Cards, MarketingPage, Samples, Section, Steps } from "@/components/marketing/MarketingPage";

// Targets "ai calling agent for real estate" (+ india), "real estate ai
// agent", "whatsapp chatbot for real estate", "ai real estate assistant"
// (docs/seo-research.md). No native portal/CRM integration: leads arrive by
// hand or through the API (POST /v1/outbound-campaigns/{id}/leads).
const path = "/ai-calling-agent-for-real-estate";
const title = "AI Calling Agent & WhatsApp Chatbot for Real Estate";
const description = "A free AI calling agent and WhatsApp chatbot for real estate. Answer property enquiries 24/7, call new leads back, and qualify buyers and renters on WhatsApp.";

export const metadata: Metadata = pageMetadata({ title, description, path });

const features = [
  { icon: PhoneIncoming, title: "Answers listing enquiries", body: "Replies to WhatsApp messages and calls about price, location, size, and availability, straight from your listing documents." },
  { icon: PhoneOutgoing, title: "Calls new leads back", body: "Add a lead to an outbound campaign and your AI agent calls them on WhatsApp while their interest is fresh." },
  { icon: ListChecks, title: "Qualifies buyers and renters", body: "Asks about budget, preferred area, property type, and timeline, and the answers are saved in the call transcript." },
  { icon: CalendarCheck, title: "Takes viewing requests", body: "Collects preferred viewing times for your team to confirm, or books directly with an API tool connected to your calendar." },
  { icon: FileText, title: "Learns your listings", body: "Upload project brochures, price lists, and FAQs as text, PDF, or Word files to a knowledge base." },
  { icon: Languages, title: "Speaks your buyers' language", body: "Set the voice agent's language, such as English, Hindi, or Arabic. The chatbot replies in whatever language each lead writes in." },
];

const steps = [
  { title: "Upload your listings", body: "Add project brochures, price lists, and common questions to a knowledge base as text, PDF, or Word files." },
  { title: "Create your agents", body: "Create a voice agent for calls and a chat agent for messages, and tell them which questions qualify a lead." },
  { title: "Connect your WhatsApp number", body: "Scan a QR code to link the number your ads and listings already point to." },
  { title: "Call new leads back", body: "Create an outbound campaign and add leads as they arrive. Each one gets a WhatsApp call from your AI agent." },
  { title: "Focus on the best leads", body: "Read transcripts and campaign analytics to see who is ready for a viewing, and follow up in person." },
];

const scripts = [
  { title: "Voice agent instructions", text: "You are the assistant for [Agency name], a real estate agency in [City]. Answer questions about our listings using the knowledge base only.\nFor every new enquiry, politely find out:\n1. Buying or renting\n2. Budget range\n3. Preferred area\n4. Property type and size\n5. When they want to move\nNever guess prices or availability. If you're not sure, say a team member will confirm. Offer to arrange a viewing and ask for a preferred day and time." },
  { title: "Opening line for lead callbacks", text: "Hi, this is the assistant from [Agency name]. Thanks for your interest in [Project name]! Do you have a minute to tell me what you're looking for, so we can send you the best options?" },
];

const faqs = [
  { q: "What is an AI calling agent for real estate?", a: "It's an AI voice agent that talks to property leads for you: it answers questions about listings, asks qualifying questions, and takes viewing requests. Wapzen's works on WhatsApp calls and chats, on your own number." },
  { q: "Can it call my leads from ads, portals, or my CRM?", a: "Add each new lead to an outbound campaign and the AI agent calls them on WhatsApp right away. Wapzen doesn't connect to property portals by itself, but your CRM or website can add leads automatically through the Wapzen API with an API key." },
  { q: "Does it work for real estate in India or Dubai?", a: "Yes, anywhere your customers use WhatsApp. Set the voice agent's language, such as Hindi, Arabic, or English, and the chatbot replies in the language each lead writes in." },
  { q: "Can it book property viewings?", a: "It collects each lead's preferred day and time for your team to confirm. To book straight into your calendar, connect an API request tool to your booking system." },
  { q: "Will it make up prices or availability?", a: "It answers from the listing documents you upload, and you can instruct it to say a team member will confirm anything it can't find. Update your knowledge base when listings change." },
  { q: "How much does it cost?", a: "Wapzen is currently free, including AI calls, the WhatsApp chatbot, knowledge bases, and calling campaigns, with no per-minute charges." },
];

export default function RealEstatePage() {
  return <MarketingPage
    path={path}
    name="AI calling agent for real estate"
    title={title}
    description={description}
    eyebrow="Real estate"
    heading={<>An AI calling agent.<br /><span>Built for real estate.</span></>}
    lead="Wapzen answers every WhatsApp enquiry and call about your listings, calls new leads back, and asks the qualifying questions, so your agents spend their time with serious buyers and renters."
    perks={["Free to use", "Chat and voice", "English, Hindi, Arabic, and more", "Your own number"]}
    ctaLabel="Create my free real estate agent"
    secondary={{ href: "#scripts", label: "Copy the agent script" }}
    related={["/ai-calling-agent-india", "/free-ai-calling-agent"]}
    faq={{ heading: <>AI for real estate.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Call every lead back.<br /><span>In minutes, not days.</span></>, body: "Upload your listings, link your WhatsApp number, and let an AI calling agent answer enquiries and call new leads. Free, with no credit card." }}
  >
    <Section id="features" heading={<>What it does for your agency.<br /><span>From enquiry to viewing.</span></>}>
      <Cards items={features} />
    </Section>

    <Section id="how-to" heading={<>How to set up an AI calling agent for real estate.<br /><span>Five steps, no code.</span></>}>
      <Steps items={steps} />
    </Section>

    <Section id="scripts" heading={<>A ready-made agent script.<br /><span>Copy it into Wapzen.</span></>} intro="Paste these into your voice agent's instructions and greeting, then replace anything in [brackets] with your agency's details.">
      <Samples items={scripts} />
    </Section>
  </MarketingPage>;
}
