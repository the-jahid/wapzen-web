import type { Metadata } from "next";
import { BookOpen, CalendarCheck, Clock, FileText, MessageCircle, PhoneIncoming } from "lucide-react";
import { pageMetadata } from "@/lib/pageMetadata";
import { Cards, Comparison, MarketingPage, Section, Steps } from "@/components/marketing/MarketingPage";

// Targets "ai receptionist for small business", "ai receptionist", "what is
// ai receptionist", "ai receptionist cost", plus the "auto answer whatsapp
// call" questions (docs/seo-research.md). WhatsApp calls only: say so.
const path = "/ai-receptionist";
const title = "Free AI Receptionist for Small Business, on WhatsApp";
const description = "A free AI receptionist that answers every WhatsApp call and message for your small business. It greets callers, answers questions, and takes details, 24/7.";

export const metadata: Metadata = pageMetadata({ title, description, path });

const handles = [
  { icon: PhoneIncoming, title: "Answers every call", body: "Picks up WhatsApp voice calls to your business number instantly, so no call goes unanswered while you're busy." },
  { icon: MessageCircle, title: "Replies to every message", body: "A chat agent answers WhatsApp messages in seconds, using the same knowledge as your voice receptionist." },
  { icon: Clock, title: "Open 24/7", body: "After hours, weekends, and holidays, customers still get an answer instead of silence." },
  { icon: BookOpen, title: "Knows your business", body: "Hours, services, prices, and policies come from your knowledge base, so answers stay accurate and consistent." },
  { icon: CalendarCheck, title: "Takes booking requests", body: "Collects the caller's name, need, and preferred time. Connect an API tool to book directly in your own calendar system." },
  { icon: FileText, title: "Saves every conversation", body: "Each call is saved with a transcript and each chat in your history, ready for your team to follow up." },
];

const autoAnswerSteps = [
  { title: "Link your number", body: "Scan a QR code with WhatsApp on your phone to connect your WhatsApp or WhatsApp Business number." },
  { title: "Create a voice agent", body: "Write a greeting and instructions, then choose the language and a voice that suits your business." },
  { title: "Assign it to your number", body: "From then on, incoming WhatsApp voice calls are answered by your AI receptionist automatically." },
  { title: "Review and follow up", body: "Read call transcripts in the dashboard and call back anyone who needs a person." },
];

const comparison = [
  ["Cost", "A salary", "Usually a monthly plan or per-minute fees", "Free right now"],
  ["Hours", "Working hours", "24/7", "24/7"],
  ["Channel", "Phone and front desk", "A phone line", "WhatsApp calls and chats"],
  ["Who can reach it", "Anyone", "Anyone with a phone", "Anyone on WhatsApp"],
  ["Setup", "Hiring and training", "Often call forwarding or a new number", "Scan a QR code"],
];

const faqs = [
  { q: "What is an AI receptionist?", a: "An AI receptionist is software that answers your business's calls and messages the way a front-desk receptionist would: it greets people, answers common questions, and takes details for your team. Wapzen's AI receptionist does this on WhatsApp calls and chats." },
  { q: "How much does an AI receptionist cost?", a: "Phone-line AI receptionists are usually billed monthly or by the minute. Wapzen's AI receptionist is currently free, including calls, chats, and transcripts, with no per-minute charges." },
  { q: "Is an AI receptionist worth it for a small business?", a: "It helps most when you miss calls while serving customers or after hours. It answers routine questions right away and saves every conversation, so you only follow up where it matters." },
  { q: "Can WhatsApp answer calls automatically?", a: "WhatsApp itself has no auto-answer setting. With Wapzen, you assign an AI voice agent to your number and it answers incoming WhatsApp voice calls automatically, then talks with the caller." },
  { q: "Can it answer regular phone calls?", a: "No. Wapzen answers WhatsApp calls to your WhatsApp number, not calls to a landline or a regular mobile line. Customers reach it with the call button in WhatsApp." },
  { q: "Can the AI receptionist book appointments?", a: "It collects the caller's name, reason, and preferred time during the conversation. To book straight into your calendar or booking system, connect an API request tool; otherwise your team confirms from the transcript." },
  { q: "Can clinics and medical offices use it?", a: "Yes, for opening hours, services, prices, and appointment requests. Don't let it give medical advice: instruct it to refer health questions to your staff." },
];

export default function AiReceptionistPage() {
  return <MarketingPage
    path={path}
    name="AI receptionist"
    title={title}
    description={description}
    eyebrow="AI receptionist"
    heading={<>An AI receptionist.<br /><span>Free, for small business.</span></>}
    lead="Wapzen's AI receptionist answers every WhatsApp call and message to your business number, day or night. It greets people, answers questions from your own information, and keeps a transcript for your team."
    perks={["Free to use", "Calls and chats", "Open 24/7", "Dozens of languages"]}
    ctaLabel="Get my free AI receptionist"
    secondary={{ href: "/pricing", label: "See pricing" }}
    related={["/free-ai-calling-agent", "/whatsapp-ai-customer-service"]}
    faq={{ heading: <>AI receptionists.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Never miss a customer.<br /><span>Even after hours.</span></>, body: "Sign up free, teach your AI receptionist about your business, and let it answer your WhatsApp calls and messages." }}
  >
    <Section id="handles" heading={<>What your AI receptionist handles.<br /><span>Calls, chats, and everything between.</span></>}>
      <Cards items={handles} />
    </Section>

    <Section id="auto-answer" heading={<>Auto-answer WhatsApp calls.<br /><span>With a voice that talks back.</span></>} intro="WhatsApp has no auto-answer setting of its own. Wapzen answers WhatsApp voice calls to your business number automatically, and an AI voice holds the conversation.">
      <Steps items={autoAnswerSteps} />
    </Section>

    <Section id="compare" heading={<>Three kinds of receptionist.<br /><span>Side by side.</span></>}>
      <Comparison caption="A human receptionist, a phone-line AI receptionist, and Wapzen compared" columns={["Human receptionist", "Phone-line AI receptionist", "Wapzen"]} rows={comparison} />
    </Section>
  </MarketingPage>;
}
