import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { AudioLines, BookOpen, FileText, Languages, PhoneIncoming, PhoneOutgoing } from "lucide-react";
import { Cards, Comparison, MarketingPage, Section, Steps } from "@/components/marketing/MarketingPage";

// Targets "free ai calling agent", "free ai phone agent", "free ai voice
// agent", "how to make ai calling agent for free" (docs/seo-research.md).
// Wapzen calls over WhatsApp only, never regular phone lines: say so plainly.
const path = "/free-ai-calling-agent";
const title = "Free AI Calling Agent & AI Voice Agent for WhatsApp";
const description = "Create a free AI calling agent that answers WhatsApp calls 24/7 and makes outbound calls in a natural voice. No code, no phone line, no per-minute fees.";

export const metadata: Metadata = pageMetadata({ title, description, path: path });

const steps = [
  { title: "Sign up for free", body: "Create a Wapzen account. No credit card, and no OpenAI or ElevenLabs account of your own." },
  { title: "Create a voice agent", body: "Write the agent's instructions and greeting, then choose its language and a natural voice that fits your business." },
  { title: "Give it knowledge and tools", body: "Attach a knowledge base so it can answer questions during the call, and optional API tools to look up orders or book appointments." },
  { title: "Connect your WhatsApp number", body: "Scan a QR code to link your WhatsApp or WhatsApp Business number, and assign the voice agent to it." },
  { title: "Take and make calls", body: "Your AI agent answers incoming WhatsApp calls. Place outbound calls from the dashboard, or add leads to a calling campaign." },
];

const features = [
  { icon: PhoneIncoming, title: "Answers every WhatsApp call", body: "Picks up inbound calls 24/7 like an AI receptionist: greets callers, answers their questions, and keeps a transcript for your team." },
  { icon: PhoneOutgoing, title: "Makes outbound calls", body: "Call a customer from the dashboard, or run a campaign where each lead you add gets a call from your AI agent." },
  { icon: AudioLines, title: "Natural, real-time voice", body: "Choose from natural-sounding voices. The agent listens and replies in real time, like a normal conversation." },
  { icon: Languages, title: "Speaks your customers' language", body: "Pick the agent's language from dozens of options, including English, Hindi, Bengali, Arabic, Spanish, and French." },
  { icon: BookOpen, title: "Answers from your knowledge base", body: "Looks up your prices, policies, and FAQs during the call instead of guessing." },
  { icon: FileText, title: "Transcripts and analytics", body: "Every call is saved with a transcript, and outbound campaigns show their results in analytics." },
];

const comparison = [
  ["Price", "Usually per minute, plus plan fees", "Free right now"],
  ["Phone number", "Rent a new number", "Your existing WhatsApp number"],
  ["Who it can call", "Any phone number", "Anyone on WhatsApp"],
  ["Text messages", "Often a separate tool", "AI chatbot included"],
  ["Setup", "Often telephony setup or developer work", "No code: link by QR code"],
];

const faqs = [
  { q: "Is there a free AI calling agent?", a: "Yes. Wapzen is currently free, and that includes the AI voice agent: it answers inbound WhatsApp calls and makes outbound WhatsApp calls, with no per-minute charges." },
  { q: "How do I make an AI calling agent for free?", a: "Sign up for Wapzen, create a voice agent with instructions, a language, and a voice, attach your knowledge base, and connect your WhatsApp number by QR code. Your AI agent then answers calls to that number." },
  { q: "Can the AI calling agent call regular phone numbers?", a: "No. Wapzen works over WhatsApp voice calls: it answers calls to your WhatsApp number and calls people on WhatsApp. The person on the other end needs WhatsApp, but you don't need a phone line or a telephony provider." },
  { q: "Can I use it as an AI receptionist?", a: "Yes. Assign the voice agent to your number and it answers every incoming WhatsApp call, shares your hours, services, and prices from your knowledge base, and saves each call with a transcript for your team." },
  { q: "Which languages can the AI voice agent speak?", a: "You choose the agent's language from dozens of options, including English, Hindi, Bengali, Arabic, Spanish, and French, and pick a voice that speaks it." },
  { q: "Do I need an OpenAI or ElevenLabs account?", a: "No. Speech recognition, the AI models, and the voices are included in Wapzen, so there is no separate API key or bill." },
  { q: "Can it call a list of leads?", a: "Yes. Create an outbound campaign, assign a voice agent, and add leads. Each lead you add is called on WhatsApp, and the results appear in the campaign's calls and analytics." },
];

export default function FreeAiCallingAgentPage() {
  return <MarketingPage
    path={path}
    name="Free AI calling agent"
    title={title}
    description={description}
    eyebrow="Free AI calling agent"
    heading={<>A free AI calling agent.<br /><span>For your WhatsApp calls.</span></>}
    lead="Create an AI voice agent that answers WhatsApp calls, speaks in a natural voice, and calls your leads back. It runs on your existing WhatsApp number, and Wapzen is currently free."
    perks={["Free to use", "No phone line needed", "No per-minute fees", "Dozens of languages"]}
    ctaLabel="Create my free voice agent"
    secondary={{ href: "/pricing", label: "See pricing" }}
    related={["/ai-receptionist", "/ai-calling-agent-india"]}
    faq={{ heading: <>Free AI calling agents.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Your free AI calling agent.<br /><span>On your WhatsApp number.</span></>, body: "Sign up free, choose a voice, and let AI answer and make your WhatsApp calls." }}
  >
    <Section id="how-to" heading={<>How to make an AI calling agent for free.<br /><span>Five steps, no code.</span></>} intro="Wapzen's AI calling agent works on WhatsApp voice calls, so there's no phone line to rent and nothing to install.">
      <Steps items={steps} />
    </Section>

    <Section id="features" heading={<>Inbound and outbound.<br /><span>One AI voice agent.</span></>}>
      <Cards items={features} />
    </Section>

    <Section id="compare" heading={<>WhatsApp calls vs a phone line.<br /><span>What changes.</span></>} intro="Most AI phone agents run on a rented phone number and bill by the minute. Wapzen's runs on WhatsApp instead. Here's the trade-off.">
      <Comparison caption="A typical AI phone agent compared with Wapzen on WhatsApp" columns={["Typical AI phone agent", "Wapzen on WhatsApp"]} rows={comparison} />
    </Section>
  </MarketingPage>;
}
