import type { Metadata } from "next";
import { BadgeCheck, FileCheck, Receipt } from "lucide-react";
import { pageMetadata } from "@/lib/pageMetadata";
import { Cards, Comparison, MarketingPage, Section, Steps } from "@/components/marketing/MarketingPage";

// Targets "whatsapp business api free", "what is whatsapp business api", "is
// whatsapp business api free", "whatsapp business api pricing", "free
// whatsapp api", "unofficial whatsapp api", "whatsapp chatbot without api"
// (docs/seo-research.md). Be fair to the API: Wapzen is not an official Meta
// product, and the API is the right tool for broadcasts at scale.
const path = "/whatsapp-business-api-alternative";
const title = "WhatsApp Business API Alternative: Free AI Chatbot";
const description = "Is the WhatsApp Business API free? Not quite. See what it involves, and how to run a free WhatsApp AI chatbot and voice agent without the API, using a QR code.";

export const metadata: Metadata = pageMetadata({ title, description, path });

const apiFacts = [
  { icon: BadgeCheck, title: "Meta setup", body: "You need a Meta business account and a phone number registered to the platform, usually through a provider (a BSP) that connects it for you." },
  { icon: FileCheck, title: "Approved templates", body: "Messages you start, or send more than 24 hours after the customer's last message, must use message templates that Meta has approved." },
  { icon: Receipt, title: "Per-message fees", body: "Meta charges for template messages, with rates by country and message category, and most providers add a monthly plan on top." },
];

const comparison = [
  ["Setup", "Meta business account, registered number, usually a provider", "Scan a QR code"],
  ["Approval", "Meta reviews templates and your display name", "None"],
  ["Cost", "Template-message fees plus provider plans", "Free right now"],
  ["Built for", "Notifications and broadcasts at scale", "AI answers to customer messages and calls"],
  ["AI chatbot", "Build one or buy a platform", "Included"],
  ["AI voice calls", "Through a calling-enabled provider", "Included, inbound and outbound"],
  ["Official Meta platform", "Yes", "No: links like WhatsApp Web does"],
];

const steps = [
  { title: "Sign up for free", body: "Create a Wapzen account. No Meta business verification, provider, or credit card needed." },
  { title: "Create a chat agent", body: "Write its instructions, choose an OpenAI GPT or Anthropic Claude model, and attach a knowledge base with your FAQs and documents." },
  { title: "Scan the QR code", body: "Link your WhatsApp or WhatsApp Business number from your phone, the same way you link WhatsApp Web." },
  { title: "Go live", body: "The AI chatbot replies to incoming messages. Add a voice agent to answer and make WhatsApp calls too." },
];

const faqs = [
  { q: "What is the WhatsApp Business API?", a: "It's Meta's official interface, now called the WhatsApp Business Platform, that lets companies send and receive WhatsApp messages from their own software, usually through a provider. It's built for messaging at scale and uses approved templates for messages the business starts." },
  { q: "Is the WhatsApp Business API free?", a: "Not entirely. Meta's Cloud API has no access fee, but Meta charges for template messages at rates that depend on the country and category, and most providers charge a monthly plan. Free-form replies within 24 hours of a customer's last message are generally not charged by Meta." },
  { q: "Can I use WhatsApp for business without the API?", a: "Yes. The WhatsApp Business app is free for manual chats and simple away messages. Wapzen adds an AI chatbot and an AI voice agent to a WhatsApp or WhatsApp Business number without the API, by linking it with a QR code." },
  { q: "Is there a free WhatsApp API?", a: "Meta's own Cloud API has no access fee, though template messages cost money. If what you need is AI that answers messages and calls, rather than an API to build on, Wapzen is currently free and needs no API at all." },
  { q: "Is Wapzen an unofficial WhatsApp API?", a: "Wapzen isn't an API you build on. It's a ready-made product that links your number the way WhatsApp Web does and runs AI agents on it. It isn't an official Meta product, so for high-volume broadcasts or enterprise-scale messaging, the official Business API is the better fit." },
  { q: "How do I set up a WhatsApp chatbot without the API?", a: "Sign up for Wapzen, create a chat agent with instructions and a knowledge base, and scan the QR code with WhatsApp on your phone. The chatbot starts replying to incoming messages." },
];

export default function BusinessApiAlternativePage() {
  return <MarketingPage
    path={path}
    name="WhatsApp Business API alternative"
    title={title}
    description={description}
    eyebrow="Business API alternative"
    heading={<>Skip the WhatsApp Business API.<br /><span>Run AI on your number instead.</span></>}
    lead="The WhatsApp Business API is built for large-scale messaging, with Meta approval, providers, and per-message fees. If you want AI to answer your customers' messages and calls, Wapzen does it on your existing number, linked by QR code, for free."
    perks={["No Meta approval", "No template fees", "Free to use", "Chat and voice"]}
    secondary={{ href: "#compare", label: "Compare with the API" }}
    related={["/free-whatsapp-chatbot", "/pricing"]}
    faq={{ heading: <>WhatsApp Business API.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>No API. No approval.<br /><span>Just AI on your WhatsApp.</span></>, body: "Sign up free, scan a QR code, and let an AI chatbot and voice agent handle your WhatsApp messages and calls." }}
  >
    <Section id="what-is" heading={<>What is the WhatsApp Business API?<br /><span>And what it takes.</span></>} intro="The WhatsApp Business API, now part of the WhatsApp Business Platform, is Meta's official way for businesses to send and receive WhatsApp messages from software. It suits companies that message customers at scale, and it comes with a few requirements.">
      <Cards items={apiFacts} />
    </Section>

    <Section id="compare" heading={<>Business API vs Wapzen.<br /><span>Pick the right tool.</span></>} intro="Need broadcasts and notifications at scale? Use the Business API. Want AI to answer the customers who message and call you? Wapzen does that without the API.">
      <Comparison caption="The WhatsApp Business API compared with Wapzen" columns={["WhatsApp Business API", "Wapzen (no API)"]} rows={comparison} />
    </Section>

    <Section id="how-to" heading={<>A WhatsApp chatbot without the API.<br /><span>Four steps.</span></>}>
      <Steps items={steps} />
    </Section>
  </MarketingPage>;
}
