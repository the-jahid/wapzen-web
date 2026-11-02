import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note, RowTable } from "@/components/blog/BlogPost";

// Targets "ai agent for whatsapp" (83), "ai agent for whatsapp business" (80),
// "whatsapp ai agent free" (64), "free whatsapp ai agent" (60), "whatsapp ai
// agent" (60), "free unlimited chatbot on whatsapp" (40), "whatsapp ai agent
// price" (36), autocomplete 2026-11-02. Competitor AI quotas are from
// aisensy.com/pricing/usd, interakt.shop/pricing and wati.io/pricing on the
// `updated` date; Meta's free tier from its pricing docs. Product claims come
// from whiskey-bailey-server: no reply cap (removed 2026-11-02), last 20
// exchanges remembered, text and captions only, groups skipped. Voice is
// described as working at the user's request (2026-11-02).
const href = "/blog/free-whatsapp-ai-agent";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const kinds = [
  ["How it replies", "The same fixed text to everyone", "Buttons and menus you design in advance", "Reads the message and writes an answer"],
  ["Understands free text", "No", "Only keywords it was built for", "Yes, in any wording"],
  ["Answers from your documents", "No", "No", "Yes, from a knowledge base"],
  ["Takes actions", "No", "Inside the flow you built", "Saves orders, calls your systems"],
  ["Languages", "The one you wrote", "The ones you built", "Replies in the customer’s language"],
  ["Setup", "Two minutes", "Hours of flow building", "Write instructions, add documents"],
];

const quotas = [
  ["AiSensy", "Free Forever plan (no broadcasts)", "AI agent add-on: $50 a month for 1,000 AI messages", "Separate charges past 1,000"],
  ["Interakt", "Free trial", "AI agents add-on: $74.99 a month with 100 AI messages, on Growth or Advanced", "$0.011 per extra AI message"],
  ["WATI", "7-day trial", "250 AI credits a month on Growth ($49 a month)", "Credit packs from $20 a month; Astra agents priced separately"],
  ["Meta’s Business API", "1,000 service replies a month per number", "Every AI reply is a service message", "Utility rate per reply: ₹0.115 in India, $0.0034 in the US"],
  ["Wapzen", "Everything", "No cap on AI replies", "No message fees"],
];

const prompt = `You are the WhatsApp assistant for Sunleaf Skincare, an online store in Pune.
Answer questions about products, prices, delivery and returns from the knowledge base.
Delivery takes 2 to 4 days across India and is free above ₹999. Cash on delivery is available.
Keep replies short: two or three sentences.
When someone wants to order, collect the product, quantity, name, address and phone,
read the order back and ask them to confirm.
If someone is upset or asks for a person, say a team member will reply between
10am and 7pm, Monday to Saturday.`;

const faqs = [
  { q: "Is there a free WhatsApp AI agent?", a: "Yes. Wapzen gives you a free AI agent that answers the WhatsApp messages on your own number, from your instructions and knowledge base, with no cap on AI replies. Most other tools sell AI as a paid add-on with a monthly message allowance." },
  { q: "Is Wapzen really free, with no message limit?", a: "Yes. Wapzen is free right now: no plan fee, no per-message fee and no cap on the number of AI replies. The AI models are included, so you don't need an OpenAI or other API key, and there's no credit card at sign-up." },
  { q: "Do I need the WhatsApp Business API for an AI agent?", a: "No. Wapzen links your number as a device, the way WhatsApp Web does, by QR code or pairing code. There's no Meta application, no template approval and no per-message fee. The trade-off is that it isn't Meta's official platform." },
  { q: "Can the AI agent work on my personal WhatsApp number?", a: "Yes. You can link a personal WhatsApp or a WhatsApp Business number. You keep using WhatsApp on your phone as usual, and the agent answers alongside you." },
  { q: "Which languages does the AI agent speak?", a: "It replies in the language the customer writes in, including English, Hindi, Bengali, Urdu, Arabic, Spanish, Portuguese and Italian. You can write its instructions in one language and still serve customers in others." },
  { q: "Can the AI agent answer WhatsApp calls too?", a: "Yes. Wapzen's AI voice agent answers incoming WhatsApp calls in a natural voice and can call leads back. It works for WhatsApp calls only, not regular phone lines." },
  { q: "What happens when the AI doesn't know an answer?", a: "It says it doesn't have that information instead of guessing. It only states prices, stock, delivery times and policies that are in its instructions, its knowledge base or a tool result, so add the facts you want it to use." },
  { q: "Will my WhatsApp number get banned?", a: "Answering people who message you is normal WhatsApp use. The risk comes from messaging people who didn't ask to hear from you, which WhatsApp restricts. Keep bulk messages to customers who expect them, and give people a way to opt out." },
];

const sources = [
  { label: "AiSensy pricing (USD)", href: "https://aisensy.com/pricing/usd" },
  { label: "Interakt pricing", href: "https://www.interakt.shop/pricing/" },
  { label: "WATI pricing", href: "https://www.wati.io/pricing/" },
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
];

const sections = [
  {
    id: "what-it-is",
    title: "What a WhatsApp AI agent does",
    body: <>
      <p>A WhatsApp AI agent is software that answers your WhatsApp for you. A menu bot asks customers to “press 1 for prices”. An AI agent reads what the customer actually wrote, in their own words and language, and replies in plain language from what you’ve told it about your business. Good ones also act: they save an order, look something up in your system, or send a follow-up.</p>
      <Comparison caption="Away messages, menu chatbots and AI agents compared" columns={["Away message", "Menu chatbot", "AI agent"]} rows={kinds} />
      <p>The difference shows on the questions nobody planned for. “Do you deliver to Gurgaon on Sunday, and is the 50 ml in stock?” breaks a menu bot. An AI agent answers it from your delivery rules and product list, or says plainly that it doesn’t know.</p>
      <Note>Meta also sells an AI agent inside the WhatsApp Business app and on the API, billed by usage. Our <Link href="/blog/whatsapp-business-ai-agent">Meta Business Agent explainer</Link> covers what it does and costs.</Note>
    </>,
  },
  {
    id: "free-limits",
    title: "What “free” usually means: AI message caps",
    body: <>
      <p>The AI part is what WhatsApp platforms meter. Plans advertise a free tier or a trial, then sell AI replies as an add-on with a monthly allowance. Here is what each one includes, from their pricing pages:</p>
      <RowTable caption="AI reply allowances on WhatsApp platforms" columns={["What’s free", "AI replies", "After that"]} rows={quotas} highlight="Wapzen" />
      <p>Allowances sound generous until you count. A shop that gets 100 chats a day, with four AI replies each, sends about <strong>12,000 AI replies a month</strong>:</p>
      <ul>
        <li><strong>Interakt:</strong> 100 included, then 11,900 × $0.011 = <strong>$130.90</strong>, on top of the $74.99 add-on and the $55 Growth plan.</li>
        <li><strong>AiSensy:</strong> the $50 add-on covers 1,000, a twelfth of the month, and the rest is charged separately.</li>
        <li><strong>Meta’s fees on the API:</strong> 11,000 replies past the free 1,000 cost about <strong>₹1,265</strong> in India or <strong>$37.40</strong> in the US, before any provider fee.</li>
        <li><strong>Wapzen:</strong> <strong>$0</strong>. There is no reply cap and no Meta message fee, because it doesn’t use the API.</li>
      </ul>
      <Note>Prices are from each vendor’s pricing page on the date at the top of this post, in the currency they show outside India. You may see local prices. See <Link href="/blog/is-whatsapp-business-api-free">is the WhatsApp Business API free?</Link> for Meta’s side of the bill.</Note>
    </>,
  },
  {
    id: "what-wapzen-does",
    title: "What Wapzen’s AI agent can do",
    body: <>
      <p>Wapzen is a free AI agent for WhatsApp. It links to the number you already use and answers your customers day and night. Here’s what it does:</p>
      <ul>
        <li><strong>Answers every one-to-one message,</strong> including photo and video captions, in the customer’s language, usually within a few seconds.</li>
        <li><strong>Answers from your knowledge base.</strong> Paste your FAQ or price list, or upload PDF and Word files. For each message, the agent pulls the passages that match.</li>
        <li><strong>Remembers the conversation.</strong> It keeps the last 20 exchanges word for word and a summary of anything older, so customers don’t repeat themselves.</li>
        <li><strong>Doesn’t make things up.</strong> If a price, delivery time or policy isn’t in its instructions or knowledge, it says so instead of guessing.</li>
        <li><strong>Takes orders.</strong> With the built-in Take Order tool, it collects the items, name and address, reads the order back, and saves it once the customer confirms. See the <Link href="/blog/whatsapp-order-taking-chatbot">order-taking guide</Link>.</li>
        <li><strong>Calls your systems.</strong> API request tools let it check an order status or a free slot in your own software.</li>
        <li><strong>Sends bulk messages.</strong> Upload a contact sheet and send one personalised message to each person, with a gap between sends. See the <Link href="/blog/whatsapp-bulk-message-sender-free">bulk message guide</Link>.</li>
        <li><strong>Answers calls.</strong> The AI voice agent picks up WhatsApp calls in a natural voice and can call leads back. See the <Link href="/free-ai-calling-agent">free AI calling agent</Link>.</li>
        <li><strong>Saves every chat</strong> in your dashboard, where you can read along and reply yourself.</li>
      </ul>
      <InlineCta title="Get a free AI agent on your WhatsApp" body="No reply cap, no Business API, no credit card. Link your number and the agent starts answering." />
    </>,
  },
  {
    id: "setup",
    title: "Set it up in about ten minutes",
    body: <>
      <ol>
        <li><strong>Sign up for free.</strong> A starter agent is already waiting in your account.</li>
        <li><strong>Write its instructions.</strong> Say who it speaks for, what you sell, your prices and hours, how long replies should be, and what to do when someone wants a person.</li>
        <li><strong>Add your knowledge.</strong> Upload your FAQ, price list or policies, then attach the knowledge base to the agent.</li>
        <li><strong>Link your number.</strong> On a computer, scan the QR code from WhatsApp → Linked devices → Link a device. On a phone, enter your number and type the 8-character pairing code into WhatsApp.</li>
        <li><strong>Test it, then switch it on.</strong> Message your number from another phone and ask the questions your customers ask. Fix the instructions wherever an answer is off.</li>
      </ol>
      <p>Instructions don’t need to be long. Here is a complete example for a small online store:</p>
      <pre>{prompt}</pre>
      <p>For more starting points, see our <Link href="/blog/whatsapp-ai-auto-reply-customer-conversations">12 AI auto-reply examples</Link>.</p>
    </>,
  },
  {
    id: "limits",
    title: "What it doesn’t do",
    body: <>
      <p>Knowing the limits up front saves surprises:</p>
      <ul>
        <li><strong>It isn’t Meta’s official API.</strong> Wapzen links your number as a device, like WhatsApp Web. You don’t get a green tick or template broadcasts at API scale.</li>
        <li><strong>One-to-one chats only.</strong> It doesn’t reply in groups, and it skips voice notes and photos sent without a caption.</li>
        <li><strong>No flow builder.</strong> You guide the agent with plain-language instructions, not buttons and menus.</li>
        <li><strong>No live transfer on calls.</strong> The voice agent handles the call itself; it can’t put the caller through to a person.</li>
        <li><strong>WhatsApp calls only.</strong> The voice agent answers and makes WhatsApp calls, not regular phone calls.</li>
        <li><strong>Your phone keeps the link alive.</strong> WhatsApp logs linked devices out when the phone isn’t used for about two weeks, so open WhatsApp on it now and then.</li>
      </ul>
    </>,
  },
  {
    id: "safe",
    title: "Is it safe for your number?",
    body: <>
      <p>Answering people who message you is ordinary WhatsApp use, and that’s most of what an AI agent does. The risk comes from the other direction: messaging people who didn’t ask to hear from you. WhatsApp’s terms forbid bulk and automated messaging outside its Business Platform, and numbers that get blocked or reported are restricted.</p>
      <p>So keep any bulk messages to customers who know you and expect them, leave a gap between sends, and give people a way to opt out. The <Link href="/blog/whatsapp-bulk-message-sender-free">bulk sending checklist</Link> covers it in detail.</p>
    </>,
  },
  {
    id: "other-tools",
    title: "When another tool is the better pick",
    body: <>
      <p>A free AI agent isn’t the answer to everything:</p>
      <ul>
        <li><strong>Large broadcast campaigns</strong> to opted-in lists, a verified green tick, or a team inbox for many agents: use a Business API platform. Compare the main ones in <Link href="/blog/aisensy-vs-interakt">AiSensy vs Interakt</Link> and <Link href="/blog/wati-pricing">WATI pricing</Link>.</li>
        <li><strong>Strict step-by-step flows</strong> with buttons, such as a loan application form: a flow builder is more predictable.</li>
        <li><strong>A custom build</strong> with your own model and hosting: see the <Link href="/blog/n8n-whatsapp-ai-agent">n8n WhatsApp AI agent guide</Link>.</li>
      </ul>
      <p>If what you need is an assistant that answers customers well, around the clock, without counting messages, start with Wapzen.</p>
    </>,
  },
];

export default function FreeWhatsAppAiAgentPage() {
  return <BlogPost
    href={href}
    heading={<>Free WhatsApp AI agent.<br /><span>No cap on AI replies.</span></>}
    lead="Most WhatsApp AI agents are free only until you reach a message quota. This guide covers what a WhatsApp AI agent does, what those quotas cost, and how to put one on your own number with Wapzen for free, with no limit on AI replies."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>A WhatsApp AI agent</strong> reads each customer message, answers from your instructions and knowledge base, and can act, for example by saving an order, at any hour.</>,
        <><strong>Most tools cap AI replies:</strong> AiSensy’s AI agent is $50 a month for 1,000 AI messages, Interakt’s includes 100, and Meta charges for API replies after 1,000 a month per number.</>,
        <><strong>Wapzen is free with no cap on AI replies.</strong> It links to your existing number by QR code, so there are no Meta message fees, and its voice agent answers WhatsApp calls too.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/is-whatsapp-business-api-free", "/blog/whatsapp-bulk-message-sender-free"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Put an AI agent on your WhatsApp.<br /><span>Free, with no reply limit.</span></>, body: "Sign up, tell the agent about your business, and link your number. It answers chats and calls day and night." }}
  />;
}
