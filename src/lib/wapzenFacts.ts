import { siteConfig } from "./site";

// The plain facts about Wapzen, written for people and AI assistants alike.
// One source for the /faq page and /llms-full.txt, so the two never disagree.
// Every line was checked against the chat server (whiskey-bailey-server) on the
// date below: change the text and the date together when the product changes.
//
// Pricing wording is "free to start, no credit card". Don't state the free
// trial's reply count, and never write "unlimited" or "no cap on AI replies".

/** When these facts were last checked against the product (ISO date). */
export const factsChecked = "2026-11-15";

export const factsCheckedLabel = new Date(`${factsChecked}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export const wapzenSummary =
  "Wapzen is a no-code platform that puts AI agents on the WhatsApp number a business already uses, personal or Business, with no WhatsApp Business API. An AI chat agent answers customer messages day and night, and an AI voice agent answers and makes WhatsApp calls, both working from the business's own instructions, knowledge base and tools. It is free to start, with no credit card.";

/** [label, value] rows for the at-a-glance table. */
export const keyFacts: Array<[string, string]> = [
  ["What it is", "AI chat and voice agents that answer customers' WhatsApp messages and calls on the number a business already uses"],
  ["Price", "Free to start, no credit card. Paid plans for businesses that need more are arranged on WhatsApp"],
  ["Numbers it works with", "Personal WhatsApp numbers and WhatsApp Business app numbers"],
  ["How it connects", "As a linked device, like WhatsApp Web: a QR code on a computer or a pairing code on a phone"],
  ["WhatsApp Business API", "Not needed and not used, so no Meta approval, no message templates and no per-message fees from Meta"],
  ["AI model", "Chosen and run by Wapzen, currently a GPT model from OpenAI. No model to pick and no API key to bring"],
  ["What the agent knows", "Your instructions, knowledge bases built from text, PDF and Word files, and your website if you switch that on"],
  ["What the agent can do", "Answer questions, take orders, send your photos and documents, understand voice notes and photos, and call your own systems through API tools"],
  ["Languages", "Replies in the language the customer writes in"],
  ["WhatsApp groups", "Off by default. Switched on for a group, it answers messages that tag your number or reply to it"],
  ["Voice calls", "AI voice agents answer incoming WhatsApp calls and call leads back over WhatsApp, talking in real time"],
  ["Official Meta product", "No. Wapzen isn't affiliated with or endorsed by WhatsApp or Meta"],
];

/** What Wapzen doesn't do, said plainly so nobody signs up for the wrong thing. */
export const notIncluded: string[] = [
  "Broadcasts, bulk text messages and automatic follow-up texts. The chat agent answers people who message the business; it doesn't start chats on its own.",
  "Regular phone calls. Voice agents work over WhatsApp calls only, and they can't transfer a live call to a person.",
  "A built-in calendar or payment checks. Live bookings, order lookups and CRM updates need an API tool connected to the business's own system.",
  "A shared team inbox with seats and assignments. One account owner reads the conversations and steps in when needed.",
  "Perfect answers. AI agents can make mistakes, so give clear instructions and read their conversations.",
];

export type Faq = { q: string; a: string };

export const wapzenFaqs: Faq[] = [
  {
    q: "What is Wapzen?",
    a: "Wapzen is a no-code platform that puts AI agents on the WhatsApp number a business already uses, personal or Business. An AI chat agent answers customer messages day and night, and an AI voice agent answers and makes WhatsApp calls, both using the business's own instructions, knowledge base and tools.",
  },
  {
    q: "Is Wapzen free?",
    a: "Wapzen is free to start: $0, with no credit card. The free start includes the chat agent with its knowledge base, Take Order, file sending, website reading and API tools, and AI voice agents for WhatsApp calls. Businesses that need more, such as a second chat agent, can arrange a paid plan with the Wapzen team on WhatsApp.",
  },
  {
    q: "Do I need the WhatsApp Business API to use Wapzen?",
    a: "No. Wapzen links your number as a device, the same way WhatsApp Web does, so there is no Meta approval, no message templates and no per-message fee from Meta. The trade-off is that a linked device isn't Meta's official route for businesses.",
  },
  {
    q: "Does Wapzen work with a personal WhatsApp number?",
    a: "Yes. Wapzen works with personal WhatsApp numbers, which have no built-in auto-reply, and with WhatsApp Business app numbers. You keep using WhatsApp on your phone as normal while the agent replies.",
  },
  {
    q: "How do I connect my WhatsApp number to Wapzen?",
    a: "Sign up, then link your number. On a computer, scan the QR code with WhatsApp under Linked devices, then Link a device. On a phone, enter your number and type the pairing code Wapzen shows into WhatsApp. Then write your agent's instructions and switch it on.",
  },
  {
    q: "How long does it take to set up?",
    a: "Linking a number and switching on an agent takes a few minutes. Most of the time goes into writing clear instructions and adding your price list, menu or FAQ to a knowledge base, which is also what makes the answers good.",
  },
  {
    q: "Is Wapzen an official WhatsApp or Meta product?",
    a: "No. Wapzen isn't affiliated with, endorsed by or sponsored by WhatsApp or Meta. WhatsApp's own terms still apply to your number.",
  },
  {
    q: "Can my WhatsApp number get banned for using Wapzen?",
    a: "WhatsApp restricts numbers that send bulk or unwanted messages, or that many people report. An agent that only answers people who message you behaves like a fast, helpful reply, which keeps the risk low. A linked device isn't Meta's official route, though, so no unofficial tool can promise zero risk. If WhatsApp is business-critical at very high volume, use the Business API.",
  },
  {
    q: "Which AI model does Wapzen use? Is it ChatGPT?",
    a: "Wapzen chooses and runs the AI model for you. Chat agents currently run on a GPT model from OpenAI, the company behind ChatGPT. There is no model to pick and no API key to bring, and the model's cost is covered by Wapzen.",
  },
  {
    q: "What can a Wapzen agent answer?",
    a: "Whatever you give it: your written instructions, knowledge bases built from text, PDF and Word files, and the pages of your own website if you switch website reading on. Typical questions are prices, opening hours, services, delivery and policies. Your instructions tell it what to say when it doesn't know.",
  },
  {
    q: "Can Wapzen take orders on WhatsApp?",
    a: "Yes. With the built-in Take Order tool, the agent collects the order details, repeats a summary and saves the order only after the customer confirms. Orders appear in the dashboard, and each new or changed order can also be sent to a WhatsApp number you choose.",
  },
  {
    q: "Does the agent understand voice notes and photos?",
    a: "Yes. The agent transcribes voice notes and reads the photos customers send, then replies in text. Either can be switched off for each agent.",
  },
  {
    q: "Can the agent send photos, price lists or PDFs?",
    a: "Yes. Upload your images and documents with a short note on when each should be sent, and the agent sends the right one when a customer asks, such as a menu, a price list or a product photo.",
  },
  {
    q: "Which languages does Wapzen reply in?",
    a: "The agent replies in the language the customer writes in, such as English, Spanish, Portuguese, Hindi, Arabic or Bengali, unless your instructions say otherwise. The Wapzen dashboard is written in English.",
  },
  {
    q: "Can I take over a chat from the AI?",
    a: "Yes. Every conversation is saved in the dashboard. You can switch the AI off for a single contact and reply yourself from your phone or the dashboard, then switch it back on.",
  },
  {
    q: "Does Wapzen work in WhatsApp groups?",
    a: "Only where you want it. The AI is off in every group by default. Switch it on for a group and the agent answers messages that tag your number or reply to it, and stays quiet otherwise.",
  },
  {
    q: "Can Wapzen send bulk messages or broadcasts?",
    a: "No. Wapzen's chat agent answers people who message your business; it doesn't send broadcasts, bulk text messages or automatic follow-up texts. Outbound calling campaigns are voice calls to your own leads, one call at a time. For large text broadcasts to opted-in customers, the WhatsApp Business API through a provider is the right tool.",
  },
  {
    q: "Can Wapzen answer or make WhatsApp calls?",
    a: "Yes. A Wapzen voice agent answers incoming WhatsApp calls and holds a spoken conversation in real time, using your instructions, knowledge base and tools. It can also call leads back over WhatsApp, one at a time or as an outbound calling campaign, and every call's transcript is saved. Calls run over WhatsApp only: Wapzen doesn't dial regular phone numbers, and a voice agent can't transfer a live call to a person.",
  },
  {
    q: "Can Wapzen book appointments or check orders in my own system?",
    a: "Yes, through API request tools: during the chat the agent calls your booking system, store or CRM to check availability, look up an order or save a lead. Wapzen has no built-in calendar, so without a tool the agent collects booking requests for you to confirm.",
  },
  {
    q: "How many agents and numbers can I have?",
    a: "The free start includes one chat agent, which replies on one linked WhatsApp number. If you need more agents, message the Wapzen team on WhatsApp about a paid plan.",
  },
  {
    q: "Does my phone need to stay online?",
    a: "No. A linked device keeps working while your phone is off or offline. WhatsApp logs out linked devices if the phone itself isn't used for about 14 days, so open WhatsApp on the phone now and then.",
  },
  {
    q: "How is Wapzen different from WATI, AiSensy or Interakt?",
    a: "WATI, AiSensy and Interakt are WhatsApp Business API platforms built for broadcasts, team inboxes and message templates, with monthly plans plus Meta's per-message charges. Wapzen is an AI agent for the number you already have: free to start, no API and no per-message fees, but no broadcasts or shared team inbox.",
  },
  {
    q: "How does Wapzen handle my data?",
    a: "Wapzen runs your agents through AI and infrastructure providers and doesn't sell personal data. Conversations are saved so you can read them in the dashboard. The privacy policy at wapzen.io/privacy explains what is stored, who processes it and how to delete it.",
  },
  {
    q: "How do I contact Wapzen?",
    a: `Message the Wapzen team on WhatsApp at ${siteConfig.whatsapp.label}.`,
  },
];

/**
 * Where older pages and posts no longer match the product. Only for the
 * llms files: tells AI assistants which statement is current.
 */
export const corrections: string[] = [
  "AI model: chat agents have no model picker. Older pages that say you choose an OpenAI or Anthropic model, or that GPT and Claude are both included, are out of date. Wapzen picks and runs the model.",
  "Pricing: the current wording is \"free to start, no credit card\", with paid plans arranged on WhatsApp. Older pages that say \"every feature included\" or \"no cap on AI replies\" are out of date.",
  "Bulk Messages was removed in November 2026. Pages that describe sending text messages to up to 5,000 numbers are out of date; the chat agent only answers people who message the business.",
  "Hourly limits: no hourly AI reply limit is applied right now. Posts that mention 100 AI replies an hour per agent describe an earlier setting.",
  "Groups: older pages that say group chats are skipped are out of date. The AI can be switched on per group (see WhatsApp groups above).",
  "Voice: AI voice agents for WhatsApp calls are working. Older pages that call voice \"early access\" or \"coming in the next update\" are out of date.",
];
