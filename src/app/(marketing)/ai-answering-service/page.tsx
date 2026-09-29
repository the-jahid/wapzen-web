import type { Metadata } from "next";
import { Building2, CalendarCheck, ClipboardList, Clock, Languages, MessageCircle, PhoneIncoming, Scale, Scissors, Stethoscope, UtensilsCrossed, Wrench } from "lucide-react";
import { pageMetadata } from "@/lib/pageMetadata";
import { Cards, Comparison, MarketingPage, Section } from "@/components/marketing/MarketingPage";

// US page. Targets "ai answering service for small business", "... for
// business", "... free", "... for restaurants", "... for law firms", "ai
// call answering service" (docs/seo-research.md, US harvest). Most of those
// searchers want their phone line answered: say plainly it's WhatsApp only.
const path = "/ai-answering-service";
const title = "Free AI Answering Service for Small Business on WhatsApp";
const description = "A free AI answering service for US small businesses: answer every WhatsApp call and message 24/7, take messages, and share hours and prices. No per-minute fees.";

export const metadata: Metadata = pageMetadata({ title, description, path });

const does = [
  { icon: PhoneIncoming, title: "Answers every WhatsApp call", body: "No voicemail and no hold music. The AI picks up, greets the caller with your business name, and holds a real conversation." },
  { icon: MessageCircle, title: "Answers messages too", body: "A chat agent replies to WhatsApp messages in seconds, with the same knowledge as your voice agent." },
  { icon: ClipboardList, title: "Takes messages", body: "Collects the caller's name, reason for calling, and callback details, all saved in the call transcript for your team." },
  { icon: Clock, title: "After hours and overflow", body: "Covers nights, weekends, and busy moments, so customers don't wait until tomorrow for an answer." },
  { icon: Languages, title: "English or Spanish", body: "Set the voice agent to English (US) or Spanish (US). The chatbot replies in whichever language each customer writes in." },
  { icon: CalendarCheck, title: "Appointment requests", body: "Takes preferred times for your team to confirm, or books directly with an API tool connected to your scheduler." },
];

const industries = [
  { icon: UtensilsCrossed, title: "Restaurants", body: "Hours, menu, location, and reservation requests, even during the dinner rush when nobody can get to the phone." },
  { icon: Scale, title: "Law firms", body: "Intake questions, office hours, and consultation requests. Instruct it never to give legal advice." },
  { icon: Wrench, title: "Contractors and HVAC", body: "Service requests, service areas, and callback details, captured while your crew is on a job." },
  { icon: Stethoscope, title: "Dental and medical offices", body: "Hours, services, and appointment requests. Instruct it to pass any health question to your staff." },
  { icon: Building2, title: "Real estate", body: "Listing questions and showing requests from buyers and renters, day or night." },
  { icon: Scissors, title: "Salons and spas", body: "Prices, services, and booking requests, answered while you're with a client." },
];

const comparison = [
  ["Pricing", "Usually per minute or per call", "Usually a monthly plan or per minute", "Free right now"],
  ["Hours", "Often 24/7", "24/7", "24/7"],
  ["Answers questions", "From a script", "Yes", "Yes, from your knowledge base"],
  ["What it answers", "Your phone line", "Your phone line", "WhatsApp calls and messages"],
  ["Setup", "Call forwarding", "Call forwarding or a new number", "Scan a QR code"],
];

const faqs = [
  { q: "What is an AI answering service?", a: "An AI answering service answers your business calls with an AI voice instead of a live operator. It greets callers, answers common questions, and takes messages. Wapzen does this for WhatsApp calls and messages." },
  { q: "How much does an AI answering service cost?", a: "Traditional and AI answering services usually charge per minute, per call, or by monthly plan. Wapzen is currently free, with no per-minute fees, because calls run over WhatsApp." },
  { q: "Is there a free AI answering service?", a: "Yes. Wapzen is free right now, with every feature included and no credit card." },
  { q: "Can it answer my regular business phone line?", a: "No. Wapzen answers calls to your WhatsApp number, not your landline or carrier line, and it doesn't work through call forwarding. It fits businesses whose customers already call or message them on WhatsApp." },
  { q: "Can it answer in Spanish?", a: "Yes. Set a voice agent's language to Spanish (US), or run a Spanish-speaking agent on a second WhatsApp number. The chatbot replies in whatever language each customer writes in." },
  { q: "Is it a good fit for law firms and medical offices?", a: "It can handle intake questions, office hours, and appointment requests. Tell it in its instructions not to give legal or medical advice and to pass those questions to your team." },
  { q: "Can a restaurant use it for reservations?", a: "Yes. It answers questions about hours, the menu, and location, and takes reservation requests. Connect an API tool to book directly in your reservation system." },
];

export default function AiAnsweringServicePage() {
  return <MarketingPage
    path={path}
    name="AI answering service"
    title={title}
    description={description}
    eyebrow="AI answering service · USA"
    heading={<>An AI answering service.<br /><span>Free for small business.</span></>}
    lead="Wapzen answers your business's WhatsApp calls and messages around the clock, takes down what each caller needs, and answers common questions from your own information. It answers WhatsApp, not your landline, so it suits businesses whose customers already reach them there."
    perks={["$0 per month", "No per-minute fees", "English or Spanish", "Open 24/7"]}
    ctaLabel="Start my free answering service"
    secondary={{ href: "/whatsapp-for-business-usa", label: "Why WhatsApp in the US" }}
    related={["/whatsapp-for-business-usa", "/ai-receptionist"]}
    faq={{ heading: <>AI answering services.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Every WhatsApp call answered.<br /><span>Even at 2 a.m.</span></>, body: "Sign up free, teach the AI about your business, and link your WhatsApp number. No credit card, no per-minute fees." }}
  >
    <Section id="features" heading={<>What your AI answering service does.<br /><span>Calls, messages, and follow-up.</span></>}>
      <Cards items={does} />
    </Section>

    <Section id="industries" heading={<>Built for US small businesses.<br /><span>By industry.</span></>}>
      <Cards items={industries} />
    </Section>

    <Section id="compare" heading={<>Answering services compared.<br /><span>Side by side.</span></>} intro="Traditional and AI answering services answer your phone line. Wapzen answers WhatsApp, which is where international, traveling, and many Spanish-speaking customers already reach you.">
      <Comparison caption="A traditional answering service, a phone-line AI answering service, and Wapzen compared" columns={["Traditional answering service", "Phone-line AI service", "Wapzen"]} rows={comparison} />
    </Section>
  </MarketingPage>;
}
