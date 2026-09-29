import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { Comparison, MarketingPage, Samples, Section, Steps } from "@/components/marketing/MarketingPage";

// Targets "whatsapp auto reply message" (+ sample / setting / bot / personal
// account / feature), "can you auto reply on whatsapp" (docs/seo-research.md).
// The WhatsApp Business steps describe Meta's app; keep them generic enough to
// survive small menu renames.
const path = "/whatsapp-auto-reply";
const title = "WhatsApp Auto Reply: Message Samples, Setup & AI Bot";
const description = "Set up WhatsApp auto reply on Business and personal accounts, with copy-and-paste message samples and a free AI auto reply bot that answers every question.";

export const metadata: Metadata = pageMetadata({ title, description, path });

const businessSteps = [
  { title: "Open Business tools", body: "In the WhatsApp Business app, open Settings on iPhone or More options on Android, then go to Business tools." },
  { title: "Pick Away or Greeting message", body: "An away message replies while you're unavailable. A greeting message welcomes people who message you for the first time or after 14 days of no activity." },
  { title: "Write your message", body: "Turn the message on and edit its text. The samples further down this page are a good starting point." },
  { title: "Set schedule and recipients", body: "Send the away message always, on a custom schedule, or outside business hours, and choose who should receive it. Then tap Save." },
];

const samples = [
  { title: "After-hours away message", text: "Hi, thanks for your message! We're closed right now. Our hours are Monday to Saturday, 9am to 6pm, and we'll reply as soon as we're back." },
  { title: "Greeting message", text: "Hi there, welcome to [Business name]! How can we help you today? Ask us about our products, prices, or opening hours." },
  { title: "Busy message", text: "Thanks for reaching out! I'm with a customer at the moment and will get back to you within the hour." },
  { title: "Holiday message", text: "Hello! We're closed for the holidays from [date] to [date]. We'll reply to every message when we're back. Happy holidays!" },
  { title: "Weekend message", text: "Thanks for your message! Our team is off for the weekend and will reply on Monday morning." },
  { title: "Order enquiry reply", text: "Thanks for contacting [Business name]! To check your order, please send us your order number and we'll get back to you shortly." },
  { title: "Appointment request reply", text: "Hi! Thanks for your interest. Tell us your preferred day and time, and we'll confirm your appointment as soon as possible." },
  { title: "Missed call message", text: "Sorry we missed your call! How can we help? Send us a message here and we'll reply as soon as we can." },
  { title: "Personal away message", text: "Hey! I can't reply right now, but I'll get back to you soon." },
  { title: "Property enquiry reply", text: "Thanks for your interest in the property! Please share your budget and preferred location, and our agent will send you matching options." },
];

const comparison = [
  ["What it sends", "The same fixed text to everyone", "A real answer to each message"],
  ["Answers questions", "No", "Yes, from your knowledge base"],
  ["Personal WhatsApp", "No, WhatsApp Business app only", "Yes, personal or Business number"],
  ["When it replies", "Away hours, or the first message", "Every message, 24/7"],
  ["Language", "Only the text you wrote", "Replies in the customer's language"],
  ["Cost", "Free", "Free right now"],
];

const faqs = [
  { q: "Can you auto reply on WhatsApp?", a: "Yes. WhatsApp Business has built-in away and greeting messages that send fixed text. For replies that actually answer the question, including on a personal account, link your number to Wapzen and let its AI chatbot reply." },
  { q: "Is there auto reply on personal WhatsApp?", a: "No. The regular WhatsApp app has no auto reply setting. You can switch the number to the free WhatsApp Business app for away messages, or link it to Wapzen for AI auto reply without switching apps." },
  { q: "How do I set auto reply in WhatsApp Business?", a: "Open Settings on iPhone or More options on Android, go to Business tools, and choose Away message or Greeting message. Turn it on, write your message, pick a schedule and recipients, and tap Save." },
  { q: "What is a good WhatsApp auto reply message?", a: "Keep it short, say when you'll reply, and tell people what to send you, such as an order number or a preferred appointment time. The samples on this page cover after hours, holidays, orders, bookings, and missed calls." },
  { q: "What is a WhatsApp auto reply bot?", a: "An auto reply bot answers WhatsApp messages for you. Simple bots send fixed text or match keywords. An AI auto reply bot, like Wapzen's, reads each message and writes an answer from your business information." },
  { q: "Is there a free WhatsApp auto reply bot?", a: "Yes. Wapzen is currently free, including AI auto reply on a personal or WhatsApp Business number. There's no credit card and no WhatsApp Business API to set up." },
  { q: "Do I need to keep WhatsApp Web open on my computer?", a: "No. Once your number is linked, Wapzen replies from the cloud, so there's no browser tab or computer to keep running." },
];

export default function WhatsAppAutoReplyPage() {
  return <MarketingPage
    path={path}
    name="WhatsApp auto reply"
    title={title}
    description={description}
    eyebrow="WhatsApp auto reply"
    heading={<>WhatsApp auto reply.<br /><span>Samples, setup, and AI.</span></>}
    lead="Everything you need for WhatsApp auto reply: how to turn it on in WhatsApp Business, what to do on a personal account, message samples to copy, and a free AI bot that writes a real answer to every message."
    perks={["Copy-and-paste samples", "Personal and Business", "Free AI auto reply"]}
    ctaLabel="Set up free AI auto reply"
    secondary={{ href: "#samples", label: "Jump to message samples" }}
    related={["/free-whatsapp-chatbot", "/whatsapp-ai-customer-service"]}
    faq={{ heading: <>WhatsApp auto reply.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Replies that answer.<br /><span>Not just “we’re away.”</span></>, body: "Link your WhatsApp number to Wapzen and let AI reply to every message with a real answer, day and night. Free, with no credit card." }}
  >
    <Section id="business-app" heading={<>How to set auto reply in WhatsApp Business.<br /><span>Built in, free, fixed text.</span></>} intro="The WhatsApp Business app includes two automatic messages. They send the same text every time, which is fine for letting people know you're away.">
      <Steps items={businessSteps} />
    </Section>

    <Section id="personal" heading={<>Auto reply on a personal account.<br /><span>Not built in. Two ways around it.</span></>} intro="The regular WhatsApp app has no auto reply setting. You can move the number to the free WhatsApp Business app, which can bring your chat history along, and use the away message above. Or link the number to Wapzen, which adds AI auto reply to a personal or Business number without switching apps.">
      <Comparison caption="WhatsApp away messages compared with Wapzen AI auto reply" columns={["Away or greeting message", "Wapzen AI auto reply"]} rows={comparison} />
    </Section>

    <Section id="samples" heading={<>WhatsApp auto reply message samples.<br /><span>Copy, paste, done.</span></>} intro="Replace anything in [brackets] with your own details. Each sample works as an away or greeting message, or as an example reply in your AI agent's instructions.">
      <Samples items={samples} />
    </Section>
  </MarketingPage>;
}
