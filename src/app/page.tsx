import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { CoreLanding } from "@/components/landing/CoreLanding";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Visible answers and FAQ structured data share one source. Search-intent
// research is documented in docs/seo-research.md; no FAQ rich result is promised.
const faqs: Array<{ q: string; a: string }> = [
  {
    q: "What is a WhatsApp AI chatbot?",
    a: "A WhatsApp AI chatbot replies automatically to incoming customer messages using an AI model. Wapzen uses your instructions, business documents, and FAQs to help answer support questions and respond to leads on WhatsApp, even outside office hours.",
  },
  {
    q: "How does WhatsApp AI auto-reply differ from a greeting or away message?",
    a: "A greeting or away message sends a preset response. Wapzen's WhatsApp AI auto-reply uses the customer's question, your instructions, and your knowledge base to generate a relevant answer. With API request tools configured, it can also look up information in your own systems.",
  },
  {
    q: "Can I automate appointment booking and customer support on WhatsApp?",
    a: "Yes. Add your services, opening hours, and support FAQs to a knowledge base for chat and voice agents. To check live availability, book an appointment, or look up an order, configure an API request tool connected to your booking or order system. These actions require that integration to be set up.",
  },
  {
    q: "How do I create a WhatsApp AI chatbot for my business?",
    a: "Sign up, create a chat agent, choose an OpenAI or Anthropic model, and write its instructions. Attach a knowledge base with your FAQs, prices, or documents, then connect your WhatsApp number by scanning a QR code. The chatbot starts replying to incoming messages right away, with no coding required.",
  },
  {
    q: "Do I need the WhatsApp Business API?",
    a: "No. Wapzen connects your existing WhatsApp or WhatsApp Business number by QR code, the same way you link WhatsApp Web. There is no Business API application, template approval, or developer setup.",
  },
  {
    q: "Can AI answer WhatsApp calls?",
    a: "Yes. A Wapzen AI voice agent picks up inbound WhatsApp voice calls, understands the caller, and replies in a natural voice in real time. It can look up answers in your knowledge base during the call, and every call is saved with a transcript.",
  },
  {
    q: "Can the AI make outbound WhatsApp calls?",
    a: "Yes. Set a voice agent to outbound (or both directions) and place calls from the dashboard, or run an outbound calling campaign: each lead you add is called on WhatsApp by your AI voice agent, and results appear in campaign analytics.",
  },
  {
    q: "What can I use a WhatsApp AI agent for?",
    a: "Use a WhatsApp AI agent for customer support, receptionist calls, sales questions, and outbound follow-ups. Appointment booking and live order lookups work through API tools you connect. These workflows can help real estate teams, clinics, e-commerce stores, education providers, and local services respond to enquiries.",
  },
  {
    q: "Which languages does the AI chatbot and voice agent support?",
    a: "The chatbot replies in the language your customer writes in. For voice calls you choose the agent's language from dozens of options, including English, Arabic, Hindi, Bengali, Spanish, and French, and pick a voice that speaks it.",
  },
  {
    q: "Can I train the AI on my business data and connect my own tools?",
    a: "Yes. Add text or files such as PDFs and Word documents to a knowledge base and attach it to any chat or voice agent. You can also create API request tools, for example to check an order or book an appointment in your own system, and the agent uses them during chats and calls.",
  },
  {
    q: "Where can I review WhatsApp chats and AI calls?",
    a: "The dashboard includes every WhatsApp chat conversation, call history with transcripts, and outbound campaign activity and analytics, so your team always has the context to follow up.",
  },
  {
    q: "What is Wapzen?",
    a: "Wapzen is a no-code builder for WhatsApp AI chatbots and AI voice call agents. Connect your WhatsApp number, configure chat and voice agents with your knowledge and tools, and manage messages, inbound and outbound calls, and campaigns from one dashboard.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/brand/wapzen-logo.png`,
        width: 1200,
        height: 323,
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: "+8801701750469",
        url: "https://wa.me/8801701750469",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      inLanguage: "en",
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/#webpage`,
      url: siteConfig.url,
      name: siteConfig.title,
      description: siteConfig.description,
      inLanguage: "en",
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      about: { "@id": `${siteConfig.url}/#software` },
      mainEntity: { "@id": `${siteConfig.url}/#software` },
      hasPart: { "@id": `${siteConfig.url}/#faq` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteConfig.url}/#software`,
      name: siteConfig.name,
      alternateName: "Wapzen WhatsApp AI Chatbot & Voice Agent",
      url: siteConfig.url,
      description: siteConfig.description,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "WhatsApp AI chatbot and AI voice call agent",
      operatingSystem: "Web",
      publisher: { "@id": `${siteConfig.url}/#organization` },
      keywords: siteConfig.keywords.join(", "),
      featureList: [
        "WhatsApp AI chatbot that auto-replies to incoming messages",
        "WhatsApp AI voice agent that answers inbound WhatsApp calls",
        "AI outbound calling and WhatsApp call campaigns",
        "Knowledge base training from text, PDF, and Word documents",
        "API request tools for bookings, orders, and CRM actions",
        "OpenAI and Anthropic models",
        "Multilingual voice agents",
        "Connect your WhatsApp number by QR code, no Business API setup",
        "Chat history, call transcripts, and campaign analytics",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${siteConfig.url}/#faq`,
      isPartOf: { "@id": `${siteConfig.url}/#webpage` },
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};

export default function Home() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    <CoreLanding faqs={faqs} />
  </>;
}
