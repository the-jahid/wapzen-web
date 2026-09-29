import type { Metadata } from "next";
import { Building2, GraduationCap, Headphones, PhoneOutgoing, ShoppingBag, Stethoscope } from "lucide-react";
import { pageMetadata } from "@/lib/pageMetadata";
import { Cards, Comparison, MarketingPage, Pills, Section, Steps } from "@/components/marketing/MarketingPage";

// Targets "ai voice calling agent india", "ai calling agent india" (+ price /
// free / hindi / with indian number) (docs/seo-research.md). Languages match
// the agent language list in components/agents/AgentsPage.tsx.
const path = "/ai-calling-agent-india";
const title = "AI Voice Calling Agent in India: Free, Hindi & More";
const description = "A free AI calling agent for Indian businesses. Answer and make WhatsApp calls in Hindi, Tamil, Telugu, Bengali, and more, on your own Indian number.";

export const metadata: Metadata = pageMetadata({ title, description, path });

const languages = ["Hindi", "English", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi", "Urdu"];

const uses = [
  { icon: ShoppingBag, title: "COD order confirmation", body: "Call cash-on-delivery customers on WhatsApp to confirm the order and address before you ship. Read the result in the transcript, or update your store with an API tool." },
  { icon: Building2, title: "Real estate lead calls", body: "Call property leads back while they're interested, answer questions about projects, and ask about budget and location." },
  { icon: GraduationCap, title: "Coaching and admissions", body: "Answer questions about courses, fees, and batches, and call back students and parents who enquire." },
  { icon: Stethoscope, title: "Clinics and diagnostics", body: "Share timings, services, and prices, and take appointment requests on calls and chats." },
  { icon: Headphones, title: "Customer support", body: "Answer order, delivery, and return questions 24/7, in the language each customer prefers." },
  { icon: PhoneOutgoing, title: "Payment and renewal reminders", body: "Remind customers about upcoming payments or renewals with a friendly WhatsApp call." },
];

const steps = [
  { title: "Sign up for free", body: "Create a Wapzen account. There's no credit card, and nothing to pay per minute." },
  { title: "Create a voice agent", body: "Write its instructions and greeting, set the language to Hindi or another Indian language, and pick a voice that speaks it." },
  { title: "Link your Indian number", body: "Scan a QR code to connect your existing WhatsApp or WhatsApp Business number." },
  { title: "Take and make calls", body: "Your AI agent answers incoming WhatsApp calls. Add leads to a campaign and it calls each one." },
];

const comparison = [
  ["Price", "Usually per minute or per call", "Free right now (₹0)"],
  ["Number", "Often a new virtual number", "Your existing WhatsApp number"],
  ["Reach", "Any phone", "Anyone on WhatsApp"],
  ["Messages", "A separate tool", "AI chatbot included"],
  ["Setup", "Often a telephony provider and setup", "Scan a QR code"],
];

const faqs = [
  { q: "Is there a free AI calling agent in India?", a: "Yes. Wapzen is currently free for businesses in India and everywhere else, including the AI voice agent, the AI chatbot, and calling campaigns. There's no credit card and no per-minute charge." },
  { q: "What does an AI calling agent cost in India?", a: "Many AI calling services charge per minute or per call, often with a setup fee. Wapzen is currently ₹0, because calls run over WhatsApp on your own number." },
  { q: "Can the AI calling agent speak Hindi?", a: "Yes. Set the voice agent's language to Hindi and choose a voice that speaks it. Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and Urdu are also available." },
  { q: "Can I use my own Indian number?", a: "Yes. Link your existing Indian WhatsApp or WhatsApp Business number by scanning a QR code. Customers see your business's own number when your AI agent calls them." },
  { q: "Can it call regular mobile numbers?", a: "No. It places WhatsApp calls, so the customer needs WhatsApp on their phone. It can't dial a regular mobile or landline number." },
  { q: "Can it confirm COD orders?", a: "Yes. Add each new cash-on-delivery order as a lead in an outbound campaign, and the AI agent calls the customer on WhatsApp to confirm. Check the result in the transcript, or connect an API tool to update the order in your store." },
];

export default function AiCallingAgentIndiaPage() {
  return <MarketingPage
    path={path}
    name="AI calling agent in India"
    title={title}
    description={description}
    eyebrow="AI calling agent · India"
    heading={<>An AI calling agent for India.<br /><span>Free, in Hindi and more.</span></>}
    lead="Wapzen gives Indian businesses an AI voice agent that answers and makes WhatsApp calls on your existing Indian number. It speaks Hindi, English, and major Indian languages, and it's currently free, with no per-minute charges."
    perks={["₹0 per month", "Your Indian WhatsApp number", "Hindi and 9 more Indian languages", "No per-minute fees"]}
    ctaLabel="Create my free AI calling agent"
    secondary={{ href: "/pricing", label: "See pricing" }}
    related={["/ai-calling-agent-for-real-estate", "/ai-receptionist"]}
    faq={{ heading: <>AI calling in India.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Your AI calling agent.<br /><span>Speaking your customers’ language.</span></>, body: "Sign up free, set the language to Hindi or any Indian language, link your number, and let AI handle your WhatsApp calls." }}
  >
    <Section id="languages" heading={<>Speaks your customers’ language.<br /><span>Across India.</span></>} intro="Set the voice agent's language and pick a voice that speaks it. The chatbot replies in whatever language each customer writes in. Voice choices vary by language.">
      <Pills items={languages} />
    </Section>

    <Section id="uses" heading={<>How Indian businesses use it.<br /><span>Calls your team no longer makes.</span></>}>
      <Cards items={uses} />
    </Section>

    <Section id="how-to" heading={<>How to start AI calling in India.<br /><span>Four steps, free.</span></>}>
      <Steps items={steps} />
    </Section>

    <Section id="compare" heading={<>WhatsApp calls vs phone-line AI calling.<br /><span>What changes.</span></>}>
      <Comparison caption="Typical AI calling in India compared with Wapzen on WhatsApp" columns={["Typical AI calling service", "Wapzen on WhatsApp"]} rows={comparison} />
    </Section>
  </MarketingPage>;
}
