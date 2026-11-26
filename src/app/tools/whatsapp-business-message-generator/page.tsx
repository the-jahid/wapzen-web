import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { BellRing, Hand, Megaphone, MoonStar, Store, Zap } from "lucide-react";
import { ToolPage } from "@/components/free-tools/ToolPage";
import { AiBusinessMessageGenerator } from "@/components/free-tools/AiBusinessMessageGenerator";

// Targets "whatsapp greeting message for business" / "…for customers",
// "whatsapp away message sample / for business", "whatsapp message template
// generator (free)", "whatsapp business description generator / samples",
// "whatsapp quick replies", autocomplete 2026-11-26.
const path = "/tools/whatsapp-business-message-generator";
const title = "WhatsApp Business Message Generator: Free AI Templates";
const description = "Write WhatsApp Business greeting and away messages, quick replies, a profile description, offers and reminders with free AI. Three options each, in your language.";

export const metadata: Metadata = pageMetadata({ title, description, path });

const steps = [
  { title: "Pick the message type", body: "Greeting, away message, quick replies, business description, an offer, an order confirmation, a reminder, a follow-up or a review request." },
  { title: "Describe your business", body: "Add your business name, what you do, and the details that matter, such as opening hours, prices or the offer. The AI uses only what you write." },
  { title: "Copy it into WhatsApp", body: "Choose from three options (five for quick replies), copy it, and paste it into WhatsApp Business. Fill in any [placeholders] first." },
];

const types = [
  { icon: Hand, title: "Greeting message", body: "Sent automatically when a customer messages you for the first time, or after 14 days without messages. Set it in the WhatsApp Business app under Business tools › Greeting message." },
  { icon: MoonStar, title: "Away message", body: "Sent automatically outside your hours, so customers know when you'll reply. Set it under Business tools › Away message, with a schedule or always on." },
  { icon: Zap, title: "Quick replies", body: "Saved answers to the questions you get most. Add them under Business tools › Quick replies, then type / in any chat to pick one, such as /prices." },
  { icon: Store, title: "Business description", body: "The text on your WhatsApp Business profile, up to 512 characters. The tool counts the characters for you, so it fits first time." },
  { icon: Megaphone, title: "Offers and broadcasts", body: "Announce a sale or news to customers. A broadcast only reaches contacts who have saved your number, so each message includes an easy way to opt out." },
  { icon: BellRing, title: "Reminders and follow-ups", body: "Order confirmations, payment and appointment reminders, gentle follow-ups and review requests: polite, short and ready to send." },
];

const faqs = [
  { q: "What is a good WhatsApp Business greeting message?", a: "A good greeting is short: welcome the customer by your business name, say what you can help with, and invite them to tell you what they need. For example: \"Hi, thanks for messaging Bella Pizza! 🍕 Tell us what you'd like to order and your address, and we'll confirm the total.\" The generator writes three versions in the tone you pick." },
  { q: "How do I set a greeting or away message in WhatsApp Business?", a: "In the WhatsApp Business app, open Settings › Business tools, then Greeting message or Away message. Turn it on, paste your text, choose who receives it, and for the away message pick a schedule such as outside business hours." },
  { q: "How long can a WhatsApp Business description be?", a: "The business description on a WhatsApp Business profile can be up to 512 characters. When you choose Business description, the tool shows the character count under each option and warns you if one is too long." },
  { q: "Is the WhatsApp Business message generator free?", a: "Yes. It's free with no sign-up and no credit card. To keep it free for everyone, each visitor can write up to 20 sets of messages an hour." },
  { q: "Can I write WhatsApp Business messages in other languages?", a: "Yes. Leave Language on \"Same as my details\" to write in the language you used, or choose English, Spanish, Portuguese, French, German, Italian, Hindi, Hinglish, Bengali, Urdu, Arabic, Indonesian, Turkish, Russian, Swahili or Tagalog." },
  { q: "Are these the same as WhatsApp Business API message templates?", a: "No. API templates have to be submitted to Meta and approved before a business can send them through the WhatsApp Business API. These messages are for the free WhatsApp Business app: greeting and away messages, quick replies, broadcasts and messages you send yourself." },
  { q: "Can WhatsApp Business reply to every customer question automatically?", a: "The app's greeting and away messages send the same fixed text to everyone. To answer each customer's actual question, about prices, stock or bookings, Wapzen's AI chatbot can reply on your WhatsApp number day and night, without the Business API." },
];

export default function WhatsAppBusinessMessageGeneratorPage() {
  return <ToolPage
    path={path}
    name="WhatsApp Business message generator"
    description={description}
    heading={<>WhatsApp Business message generator.<br /><span>Greeting, away and more, by AI.</span></>}
    lead="Write your greeting message, away message, quick replies and business description, plus offers, reminders and follow-ups, with free AI. Three ready-to-use options every time."
    perks={["10 message types", "16+ languages", "No sign-up"]}
    tool={<AiBusinessMessageGenerator />}
    steps={{ heading: <>How to write WhatsApp Business messages.<br /><span>Three quick steps.</span></>, items: steps }}
    cards={{ heading: <>Every WhatsApp Business message.<br /><span>And where to set it up.</span></>, items: types }}
    faq={{ heading: <>WhatsApp Business messages.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Fixed replies not enough?<br /><span>Let AI answer every question.</span></>, body: "Wapzen's AI chatbot reads each customer's message and answers it from your own prices, FAQ and documents, day and night. Free to start, no credit card, no Business API." }}
  />;
}
