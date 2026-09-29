import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { AtSign, Globe, Headphones, Mail, Megaphone, Printer } from "lucide-react";
import { ToolPage } from "@/components/free-tools/ToolPage";
import { WhatsAppLinkGenerator } from "@/components/free-tools/WhatsAppLinkGenerator";

const path = "/tools/whatsapp-link-generator";
const title = "Free WhatsApp Link Generator with QR Code";
const description = "Create a free WhatsApp click-to-chat link (wa.me) with a pre-filled message in seconds. Copy the link or download a QR code. No sign-up needed.";

export const metadata: Metadata = pageMetadata({ title, description, path: path });

const steps = [
  { title: "Enter your number", body: "Type your WhatsApp number with its country code, for example +44 7700 900123. Spaces, dashes and the + sign are fine." },
  { title: "Add a message", body: "Optionally write the text customers see ready to send, like “Hi, I'd like to book an appointment.” It saves them typing." },
  { title: "Share it anywhere", body: "Copy your link or download the QR code. Anyone who opens it lands in a WhatsApp chat with you, without saving your number." },
];

const places = [
  { icon: Globe, title: "Website and landing pages", body: "Add a “Chat on WhatsApp” button so visitors can ask questions the moment they're interested." },
  { icon: AtSign, title: "Social media bios", body: "Put the link in your Instagram, TikTok or Facebook bio so followers can message you in one tap." },
  { icon: Megaphone, title: "Ads and campaigns", body: "Send people from ads, newsletters and SMS straight into a conversation instead of a contact form." },
  { icon: Printer, title: "Printed QR codes", body: "Print the QR code on flyers, menus, packaging, receipts or your shop window for offline customers." },
  { icon: Mail, title: "Email signatures", body: "Give clients a faster way to reach you than replying to an email thread." },
  { icon: Headphones, title: "Support and order pages", body: "Pre-fill messages like “Question about my order” so every chat starts with context." },
];

const faqs = [
  { q: "What is a WhatsApp link?", a: "A WhatsApp link, also called a click-to-chat link, is a URL in the form https://wa.me/<number> that opens a WhatsApp chat with that number. The person doesn't need to save your number as a contact first. It works on phones, WhatsApp Desktop and WhatsApp Web." },
  { q: "How do I create a WhatsApp link with a pre-filled message?", a: "Enter your number with its country code and type your message in the generator above. The tool adds the message to the link as ?text=, encoded so spaces, emoji and other languages work. When someone opens the link, the message appears in their chat box, ready to send." },
  { q: "Which phone number format should I use?", a: "Use the full international number: country code followed by the number, without a leading 0. For example, a UK mobile 07700 900123 becomes 447700900123. The generator removes spaces, dashes, brackets and the + sign for you." },
  { q: "Does the link work with WhatsApp Business?", a: "Yes. Click-to-chat links work with both WhatsApp and WhatsApp Business numbers, as long as the number is registered on WhatsApp." },
  { q: "Does the WhatsApp link or QR code expire?", a: "No. The link and QR code simply point to your number, so they keep working for as long as that number is on WhatsApp. If you change the message, generate a new link and QR code." },
  { q: "Is this WhatsApp link generator free?", a: "Yes, it's completely free with no sign-up and no limits. The link is built in your browser; your number and message aren't sent to or stored on our servers." },
];

export default function WhatsAppLinkGeneratorPage() {
  return <ToolPage
    path={path}
    name="WhatsApp link generator"
    description={description}
    heading={<>WhatsApp link generator.<br /><span>With a QR code.</span></>}
    lead="Create a click-to-chat link for your WhatsApp number in seconds. Add a pre-filled message, copy the link, and download a QR code customers can scan."
    perks={["Free forever", "No sign-up", "Works with WhatsApp Business"]}
    tool={<WhatsAppLinkGenerator />}
    steps={{ heading: <>How to create a WhatsApp link.<br /><span>Three quick steps.</span></>, items: steps }}
    cards={{ heading: <>Where to share your link.<br /><span>Anywhere customers find you.</span></>, intro: "A click-to-chat link removes the “save the number, open WhatsApp, find the contact” steps, so more people actually start the conversation.", items: places }}
    faq={{ heading: <>WhatsApp links.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Your link brings the chats.<br /><span>Let AI answer them.</span></>, body: "Wapzen gives your WhatsApp number an AI chatbot and voice agent that reply instantly, day and night, using your own business knowledge." }}
  />;
}
