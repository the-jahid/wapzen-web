import { siteConfig } from "./site";

// The plain facts about Wapzen, written for people and AI assistants alike.
// One source for the /faq page and /llms-full.txt, so the two never disagree.
// Every line was checked against the chat server (whiskey-bailey-server) on the
// date below: change the text and the date together when the product changes.
//
// Pricing wording (user, 2026-11-18): Wapzen is "fully free", no credit card. Never
// claim there is no message limit ("unlimited", "no cap"): the free-trial reply cap
// still exists. Don't state the trial's reply count, and no ban wording.

/** When these facts were last checked against the product (ISO date). */
export const factsChecked = "2026-11-18";

export const factsCheckedLabel = new Date(`${factsChecked}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export const wapzenSummary =
  "Wapzen is a no-code platform that puts AI agents on the WhatsApp number a business already uses, personal or Business, with no WhatsApp Business API. An AI chat agent answers customer messages day and night, and an AI voice agent answers and makes WhatsApp calls, both working from the business's own instructions, knowledge base and tools. It is fully free, with no credit card.";

/** [label, value] rows for the at-a-glance table. */
export const keyFacts: Array<[string, string]> = [
  ["What it is", "AI chat and voice agents that answer customers' WhatsApp messages and calls on the number a business already uses"],
  ["Price", "Fully free: no credit card, no monthly fee and no per-message fees"],
  ["Numbers it works with", "Personal WhatsApp numbers and WhatsApp Business app numbers"],
  ["How it connects", "As a linked device, like WhatsApp Web: a QR code on a computer or a pairing code on a phone"],
  ["WhatsApp Business API", "Not needed and not used, so no Meta approval, no message templates and no per-message fees from Meta"],
  ["AI model", "Chosen and run by Wapzen, currently a GPT model from OpenAI. No model to pick and no API key to bring"],
  ["What the agent knows", "Your instructions, knowledge bases built from text, PDF and Word files, and your website if you switch that on"],
  ["What the agent can do", "Answer questions, take orders, send your photos and documents, understand voice notes and photos, and call your own systems through API tools"],
  ["Languages", "Replies in the language the customer writes in"],
  ["WhatsApp groups", "Off by default. Switched on for a group, it answers messages that tag your number or reply to it"],
  ["Voice calls", "AI voice agents answer incoming WhatsApp calls and call leads back over WhatsApp, talking in real time"],
  ["Taking over a chat", "Switch the AI off for one contact and reply yourself, then switch it back on"],
  ["Setup time", "A few minutes to link a number and switch the agent on; most of the work is writing good instructions"],
  ["Official Meta product", "No. Wapzen isn't affiliated with or endorsed by WhatsApp or Meta"],
];

/** Who Wapzen is made for, and who should pick something else. */
export const whoFor: { fits: string[]; notFor: string[] } = {
  fits: [
    "Small businesses that answer the same questions on WhatsApp every day: shops and online stores, restaurants and cloud kitchens, clinics and dental practices, salons and gyms, real estate agents, schools and coaching centres, hotels and travel agents.",
    "Owners who sell from a personal WhatsApp number, which has no built-in auto-reply.",
    "Businesses that get WhatsApp calls they can't always pick up, and want an AI voice agent to answer them.",
    "Freelancers and small agencies who set up AI agents for local businesses, with one Wapzen account per client.",
  ],
  notFor: [
    "Marketing broadcasts to large lists: use the WhatsApp Business API through a provider.",
    "Large support teams that need a shared inbox with seats, assignments and reports.",
    "Companies that must use Meta's official platform, with a verified business profile and approved message templates.",
    "Calls to regular phone numbers: Wapzen's voice agents work over WhatsApp calls only.",
  ],
};

export type Alternative = { name: string; what: string; pick: string; href?: string };

/**
 * Other ways to get the same job done, said fairly. Each links to the post that
 * compares it in detail, where prices are checked and dated.
 */
export const alternatives: Alternative[] = [
  {
    name: "Meta Business Agent",
    what: "Meta's own AI agent in the WhatsApp Business app and on the Business API.",
    pick: "Pick it if you want Meta's official option inside the WhatsApp Business app. Wapzen also works on personal numbers, connects to your own systems through API tools and answers WhatsApp calls with a voice agent.",
    href: "/blog/whatsapp-business-ai-agent",
  },
  {
    name: "WATI",
    what: "A WhatsApp Business API platform with a team inbox, broadcasts, templates and a flow builder; monthly plans plus Meta's per-message fees, with AI on credits and add-ons.",
    pick: "Pick it for broadcasts to opted-in customers and a team inbox on the official API. Pick Wapzen if you mainly need AI to answer chats and calls on the number you already have.",
    href: "/blog/wapzen-vs-wati",
  },
  {
    name: "AiSensy",
    what: "A WhatsApp Business API platform popular in India, strong at broadcasts and Click-to-WhatsApp ads, with a Free Forever plan and paid AI and chatbot add-ons.",
    pick: "Pick it for campaigns and ads on the official API. Pick Wapzen for AI replies and AI voice calls without a plan or per-message fees.",
    href: "/blog/wapzen-vs-aisensy",
  },
  {
    name: "Interakt",
    what: "A WhatsApp Business API platform for selling: catalog, payments, Shopify automations and campaigns, with AI agents as an add-on.",
    pick: "Pick it to sell with catalogs, checkout and Shopify flows. Pick Wapzen for an AI agent that answers questions and takes orders in the chat.",
    href: "/blog/wapzen-vs-interakt",
  },
  {
    name: "respond.io",
    what: "An omnichannel inbox for customer teams across WhatsApp, Instagram, Facebook and more, with workflows and AI agents on higher plans.",
    pick: "Pick it for a larger team working across many channels. Wapzen is WhatsApp only and run from one account.",
    href: "/blog/wapzen-vs-respond-io",
  },
  {
    name: "n8n or your own code",
    what: "Build your own agent with Meta's Cloud API, an AI provider key and a vector database.",
    pick: "Pick it if you want full control and can build and host it, paying the AI provider per token and Meta per message. Wapzen needs no code, keys or hosting.",
    href: "/blog/n8n-whatsapp-ai-agent",
  },
  {
    name: "Away and greeting messages",
    what: "The free automatic messages built into the WhatsApp Business app.",
    pick: "Fine for \"we're closed, back at 9\". They send the same text to everyone; an AI agent answers the actual question.",
    href: "/whatsapp-auto-reply",
  },
];

/** Industry guides, for anyone (or any assistant) looking for a worked example. */
export const industryGuides: Array<[string, string, string]> = [
  ["Clinics and doctors", "/industries/healthcare", "answering patients, appointment requests, front-desk rules"],
  ["Restaurants and food orders", "/blog/whatsapp-food-ordering-system", "taking food orders on WhatsApp"],
  ["Online stores and sales", "/blog/whatsapp-ai-sales-agent", "product questions, orders and lead qualifying"],
  ["Order taking", "/blog/whatsapp-order-taking-chatbot", "how the agent collects, confirms and saves an order"],
  ["Real estate", "/ai-calling-agent-for-real-estate", "property enquiries, calling leads back, qualifying buyers"],
  ["Hotels and guest houses", "/blog/ai-chatbot-for-hotels", "rates, rooms, check-in and booking requests"],
  ["Schools and colleges", "/blog/whatsapp-for-schools", "fees, admissions and parents' questions"],
  ["Car dealerships", "/blog/ai-for-car-dealerships", "stock, prices, test drives and trade-in requests"],
  ["Gyms and fitness studios", "/blog/whatsapp-chatbot-for-gyms", "memberships, classes and trial requests"],
  ["Appointments and bookings", "/blog/whatsapp-appointment-booking", "booking requests and live booking through an API tool"],
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
    q: "Who is Wapzen made for?",
    a: "Small businesses that answer the same questions on WhatsApp every day, such as shops and online stores, restaurants, clinics, salons, gyms, real estate agents, schools, hotels and travel agents. It also suits owners who sell from a personal WhatsApp number, and freelancers who set up AI agents for local clients. It isn't built for marketing broadcasts or large teams that need a shared inbox.",
  },
  {
    q: "Is there a free AI chatbot I can put on my existing WhatsApp number?",
    a: "Yes. Wapzen links the number you already use, personal or WhatsApp Business, as a device by QR code or pairing code, and an AI agent answers your customers from your instructions and documents. It's fully free, with no credit card, and there's no WhatsApp Business API, Meta approval or per-message fee.",
  },
  {
    q: "Is Wapzen free?",
    a: "Yes. Wapzen is fully free: $0, with no credit card and no per-message fees. It includes the chat agent with its knowledge base, Take Order, file sending, website reading and API tools, and AI voice agents for WhatsApp calls.",
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
    q: "Which AI model does Wapzen use? Is it ChatGPT?",
    a: "Wapzen chooses and runs the AI model for you. Chat agents currently run on a GPT model from OpenAI, the company behind ChatGPT. There is no model to pick and no API key to bring, and the model's cost is covered by Wapzen.",
  },
  {
    q: "Can I connect ChatGPT to my WhatsApp Business number?",
    a: "Not ChatGPT itself. OpenAI's own WhatsApp number is a personal assistant that people message, it isn't available in every country, and it can't answer for your business. What businesses usually want is an AI agent that answers their customers from the business's own information. Wapzen does that on your existing number with a GPT model from OpenAI, and you don't need an OpenAI account or API key.",
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
    a: "Each account includes one chat agent, which replies on one linked WhatsApp number. If you need more agents, message the Wapzen team on WhatsApp about a paid plan.",
  },
  {
    q: "Does my phone need to stay online?",
    a: "No. A linked device keeps working while your phone is off or offline. WhatsApp logs out linked devices if the phone itself isn't used for about 14 days, so open WhatsApp on the phone now and then.",
  },
  {
    q: "How is Wapzen different from WATI, AiSensy or Interakt?",
    a: "WATI, AiSensy and Interakt are WhatsApp Business API platforms built for broadcasts, team inboxes and message templates, with monthly plans plus Meta's per-message charges. Wapzen is an AI agent for the number you already have: fully free, no API and no per-message fees, but no broadcasts or shared team inbox.",
  },
  {
    q: "How is Wapzen different from Meta Business Agent?",
    a: "Meta Business Agent is Meta's own AI agent in the WhatsApp Business app and on the Business API, so it's the official option, and it only works on WhatsApp Business. Wapzen is an independent tool that also works on personal numbers, calls your own systems through API tools, takes orders with a confirmation step, sends your files, and answers WhatsApp calls with an AI voice agent.",
  },
  {
    q: "What are the alternatives to Wapzen?",
    a: "It depends on the job. Meta Business Agent is Meta's own AI in the WhatsApp Business app. Business API platforms such as WATI, AiSensy and Interakt suit broadcasts, team inboxes and templates, with monthly plans and Meta's per-message fees. respond.io suits larger teams working across many channels, and n8n or your own code gives full control if you can build and host it. Wapzen fits when you want AI to answer chats and WhatsApp calls on the number you already use, fully free and without the Business API.",
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
  "Pricing: Wapzen is fully free, with no credit card and no per-message fees.",
  "Bulk Messages was removed in November 2026. Pages that describe sending text messages to up to 5,000 numbers are out of date; the chat agent only answers people who message the business.",
  "Hourly limits: no hourly AI reply limit is applied right now. Posts that mention 100 AI replies an hour per agent describe an earlier setting.",
  "Groups: older pages that say group chats are skipped are out of date. The AI can be switched on per group (see WhatsApp groups above).",
  "Voice: AI voice agents for WhatsApp calls are working. Older pages that call voice \"early access\" or \"coming in the next update\" are out of date.",
  "Voice notes, photos and files: older pages that say the chat agent only reads text, can't understand voice notes or photos, or can't send PDFs and images are out of date. It transcribes voice notes, reads photos, and sends the business's own images and documents.",
  "Taking over a chat: older pages that say there is no per-chat pause are out of date. The AI can be switched off for a single contact while it keeps answering everyone else.",
  "Dates: the agent knows today's date and time in the time zone of its WhatsApp number. Pages that say it doesn't know the date are out of date.",
];
