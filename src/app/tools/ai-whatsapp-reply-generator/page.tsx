import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { BadgePercent, Briefcase, CircleHelp, HeartHandshake, Languages, ThumbsDown } from "lucide-react";
import { ToolPage } from "@/components/free-tools/ToolPage";
import { AiReplyGenerator } from "@/components/free-tools/AiReplyGenerator";

// Targets "ai whatsapp reply generator" (+ free), "whatsapp reply generator",
// "whatsapp message reply generator", "ai reply generator free",
// autocomplete 2026-11-26. Writes through whiskey /v1/free-tools/ai.
const path = "/tools/ai-whatsapp-reply-generator";
const title = "AI WhatsApp Reply Generator: Free Replies in Any Tone";
const description = "Paste a WhatsApp message and get 3 ready-to-send replies written by AI. Pick a tone and language, then copy a reply or send it in WhatsApp. Free, no sign-up.";

export const metadata: Metadata = pageMetadata({ title, description, path });

const steps = [
  { title: "Paste the message", body: "Copy the WhatsApp message you need to answer and paste it in. Add a few facts if you like, such as your prices or opening hours." },
  { title: "Pick a tone and language", body: "Friendly, professional, short, apologetic, persuasive or formal, in the message's own language or one of 16 others." },
  { title: "Copy or send a reply", body: "You get three different replies in a WhatsApp preview. Copy the one you like, or tap Send in WhatsApp to choose the chat." },
];

const uses = [
  { icon: CircleHelp, title: "Customer questions", body: "Price, stock, delivery and opening-hours questions, answered clearly with the facts you add, and a [placeholder] wherever a fact is missing." },
  { icon: HeartHandshake, title: "Complaints", body: "A late order or an unhappy customer: replies that apologise, explain what happens next and keep the customer, without sounding defensive." },
  { icon: BadgePercent, title: "Discount requests", body: "Answer \"can you do a better price?\" with a firm but friendly reply, or a counter-offer, whichever tone you pick." },
  { icon: ThumbsDown, title: "Saying no politely", body: "Turn down an invitation, a request or a deal in a way that stays kind and leaves the door open." },
  { icon: Briefcase, title: "Work messages", body: "Reply to your boss, a client or a colleague in a professional or formal tone, short and to the point." },
  { icon: Languages, title: "Other languages", body: "Got a message in Spanish, Hindi or Arabic? Get the replies in that language, or pick the language you'd like to answer in." },
];

const faqs = [
  { q: "Is the AI WhatsApp reply generator free?", a: "Yes. It's free with no sign-up and no credit card. To keep it free for everyone, each visitor can write up to 20 sets of replies an hour." },
  { q: "How does the AI write the replies?", a: "Your message, any facts you added and your chosen tone go to an AI language model, which writes three different replies that answer what the message actually asks. It uses only the facts you give it. Anything it would need but doesn't have, such as a price or a date, comes back as a [placeholder] for you to fill in." },
  { q: "Do you save the messages I paste?", a: "No. The text is sent to our server and the AI model only to write your replies, and we don't save it or use it for anything else. Avoid pasting passwords, card numbers or other private details all the same." },
  { q: "Which languages does it support?", a: "By default the replies are in the same language as the message you paste. You can also choose English, Spanish, Portuguese, French, German, Italian, Hindi, Hinglish, Bengali, Urdu, Arabic, Indonesian, Turkish, Russian, Swahili or Tagalog." },
  { q: "Can the AI reply on WhatsApp for me automatically?", a: "This tool writes replies for you to copy and send. If you'd like a WhatsApp number to answer customers on its own, day and night, Wapzen's AI chatbot does that from your prices, FAQ and documents, without the WhatsApp Business API." },
  { q: "Can the AI get a reply wrong?", a: "Yes, AI can make mistakes or misread a message. Read each reply before you send it, fill in any [placeholders], and change anything that doesn't sound like you." },
];

export default function AiWhatsAppReplyGeneratorPage() {
  return <ToolPage
    path={path}
    name="AI WhatsApp reply generator"
    description={description}
    heading={<>AI WhatsApp reply generator.<br /><span>The right reply, in seconds.</span></>}
    lead="Paste any WhatsApp message, choose a tone and language, and get three ready-to-send replies written by AI. Copy one, or send it straight from WhatsApp."
    perks={["3 replies each time", "16+ languages", "No sign-up"]}
    tool={<AiReplyGenerator />}
    steps={{ heading: <>How to write a WhatsApp reply with AI.<br /><span>Three quick steps.</span></>, items: steps }}
    cards={{ heading: <>What people use it for.<br /><span>From customers to colleagues.</span></>, items: uses }}
    faq={{ heading: <>AI WhatsApp replies.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Answering the same questions?<br /><span>Let AI reply for you.</span></>, body: "Wapzen's AI chatbot answers your WhatsApp messages automatically, day and night, from your own price list and FAQ. Free to start, no credit card, no Business API." }}
  />;
}
