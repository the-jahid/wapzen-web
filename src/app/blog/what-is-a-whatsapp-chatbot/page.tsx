import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note, ProsCons, Screenshot } from "@/components/blog/BlogPost";

// Pillar post for the informational cluster: "what is whatsapp chatbot" (170),
// "how whatsapp chatbot works" (102), "how does whatsapp chatbot work" (99),
// "is whatsapp chatbot free" (96), "whatsapp chatbot examples" (45),
// autocomplete 2026-10-27. It links out to every guide and comparison, so keep
// it the hub when new posts are added. Screenshots are reused from the
// chatbot-without-API guide (demo data).
const href = "/blog/what-is-a-whatsapp-chatbot";
const post = blogPost(href);
const img = (file: string) => `/blog/whatsapp-chatbot-without-business-api/${file}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const kinds = [
  ["How it understands", "Matches keywords, numbers, or button taps", "Reads the whole message in plain language"],
  ["How it answers", "Sends replies you wrote in advance", "Writes a reply from your instructions and knowledge base"],
  ["Typos, slang, other languages", "Usually breaks", "Handles them"],
  ["Questions you didn’t plan for", "“Sorry, I didn’t understand”", "Answers if the information is in its knowledge base"],
  ["Setup", "Draw every path of the flow", "Write instructions, upload documents"],
  ["Best for", "Fixed menus and forms", "Customer questions in any wording"],
];

const routes = [
  ["How the bot connects", "Your number is registered on Meta’s WhatsApp Business Platform, usually through a provider", "Your number is linked as a device with a QR code, like WhatsApp Web"],
  ["Meta’s message fees", "Yes, per message, by country and category", "None"],
  ["Broadcasts to big lists", "Yes, with approved templates", "No"],
  ["Keep using the WhatsApp app", "Only with Meta’s coexistence setup", "Yes"],
  ["Official Meta route", "Yes", "No"],
];

const faqs = [
  { q: "What is a WhatsApp chatbot in simple words?", a: "It's software that answers the messages your WhatsApp number receives, so customers get a reply in seconds even when nobody is at the phone. Simple chatbots send replies you wrote in advance; AI chatbots read the question and write an answer from your business information." },
  { q: "How does a WhatsApp chatbot work?", a: "A customer messages your number. The message reaches the chatbot software, either through Meta's WhatsApp Business API or through a linked device. A rule-based bot matches a keyword or button and sends a stored reply; an AI bot searches your knowledge base and writes an answer with a language model. The reply goes back to the customer in the same WhatsApp chat." },
  { q: "Is a WhatsApp chatbot free?", a: "WhatsApp doesn't charge for chatbots as such, but the official Business API charges per message: for templates, and since 1 October 2026 also for service replies beyond 1,000 a month per number. Providers add their own plans. Wapzen is currently free, including the AI models, and it doesn't use the Business API, so there are no Meta message fees." },
  { q: "Do I need the WhatsApp Business API for a chatbot?", a: "No. You can link an existing WhatsApp or WhatsApp Business number as a device with a QR code, and an AI agent answers the messages it receives. The API is the better route if you need bulk broadcasts, a large team inbox, or Meta's official platform." },
  { q: "Can a WhatsApp chatbot answer voice notes and calls?", a: "Most text chatbots answer text only. Wapzen's chat agent answers one-to-one text messages, not voice notes, images, or group chats. For calls, a separate AI voice agent can answer and make WhatsApp calls on the same number." },
  { q: "Is a WhatsApp chatbot the same as Meta AI?", a: "No. Meta AI is Meta's own general assistant inside WhatsApp for personal use. A business chatbot answers your customers on your number, using your prices, policies, and instructions." },
  { q: "Will customers know they're talking to a bot?", a: "They should. Tell the chatbot to introduce itself as your store's assistant and to say when a person will follow up. Customers mind slow or wrong answers far more than they mind a clearly labelled assistant." },
];

const sources = [
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "WhatsApp Help Center: How to link a device", href: "https://faq.whatsapp.com/1317564962315842" },
];

const sections = [
  {
    id: "definition",
    title: "What is a WhatsApp chatbot?",
    body: <>
      <p>A <strong>WhatsApp chatbot</strong> is software that automatically replies to the messages a WhatsApp number receives. Customers chat with it the way they chat with a person, and it answers in seconds, at any hour, so questions about prices, stock, delivery, or opening times don’t wait for someone to pick up the phone.</p>
      <p>There are two kinds, and the difference matters more than any feature list:</p>
      <Comparison caption="Rule-based WhatsApp chatbots compared with AI chatbots" columns={["Rule-based chatbot", "AI chatbot"]} rows={kinds} />
      <p>Rule-based bots are menus: “Reply 1 for prices, 2 for delivery.” They work until a customer types something the menu didn’t expect, which is most of the time. AI chatbots use a large language model, such as OpenAI’s GPT or Anthropic’s Claude, to understand the question and write an answer, and a knowledge base to make sure that answer comes from your information rather than a guess.</p>
    </>,
  },
  {
    id: "how-it-works",
    title: "How a WhatsApp chatbot works",
    body: <>
      <p>Behind every reply, the same five things happen, usually in a second or two:</p>
      <ol>
        <li><strong>A customer messages your number,</strong> for example “Do you deliver to Pune, and can I pay cash?”</li>
        <li><strong>The message reaches the chatbot software,</strong> through Meta’s Business API or through a linked device (more on that below).</li>
        <li><strong>The bot looks up what it needs.</strong> An AI chatbot searches your knowledge base, the price list, delivery rules, and FAQ you gave it, for the parts that match the question.</li>
        <li><strong>It writes the reply,</strong> following your instructions: answer in the customer’s language, keep it short, never invent prices.</li>
        <li><strong>The reply lands in the same chat,</strong> and the conversation is saved so you can read it and step in yourself.</li>
      </ol>
      <Screenshot src={img("conversation.webp")} width={1832} height={1472} alt="A WhatsApp conversation where an AI chatbot answers questions about cash on delivery, a product and returns" caption="An AI chatbot answering three questions from its knowledge base: COD limits, a product recommendation, and the return window. Wapzen dashboard, demo data." />
      <p>Some chatbots can also <strong>take actions</strong> mid-conversation, such as looking up an order in your store or checking a free slot in a calendar, by calling your systems through an API. That part needs your systems to have an API; the answering part doesn’t.</p>
      <h3>Where the chatbot plugs in: API or linked device</h3>
      <p>Step 2 hides the biggest choice you’ll make. There are two ways to connect software to a WhatsApp number:</p>
      <Comparison caption="The two ways to connect a chatbot to a WhatsApp number" columns={["WhatsApp Business API", "Linked device (QR code)"]} rows={routes} />
      <p>The API is Meta’s official route and the right one for broadcasts at scale. The linked-device route is faster and has no Meta fees, which suits businesses whose WhatsApp is mostly customers asking questions. The full trade-off is in <Link href="/blog/whatsapp-business-app-vs-api">WhatsApp Business app vs API</Link>. For voice calls, Meta’s official route is the <Link href="/blog/whatsapp-business-calling-api">WhatsApp Business Calling API</Link>, and the WhatsApp Business app now has an AI agent of its own, <Link href="/blog/whatsapp-business-ai-agent">Meta Business Agent</Link>.</p>
    </>,
  },
  {
    id: "examples",
    title: "WhatsApp chatbot examples by industry",
    body: <>
      <p>What a chatbot handles depends on what your customers ask. Six common setups:</p>
      <h3>Online store</h3>
      <p>Stock, sizes, delivery areas and times, cash on delivery, and returns, which make up most of a store’s WhatsApp. A good store bot answers these from the catalogue and policies, and leaves refunds and complaints to a person.</p>
      <blockquote>“Is the vitamin C serum good for oily skin, and can I pay on delivery?” → “Yes, it’s oil-free and suits oily skin. Cash on delivery is available on orders up to ₹5,000.”</blockquote>
      <h3>Clinic or dental practice</h3>
      <p>Opening hours, consultation fees, which doctor sees what, and how to prepare for a visit. The bot can collect booking requests; confirming a slot automatically needs a connection to your booking system. <Link href="/blog/whatsapp-appointment-booking">WhatsApp appointment booking</Link> shows both setups.</p>
      <h3>Restaurant</h3>
      <p>Menu questions, vegetarian and allergy options, delivery radius, and table requests, answered from the menu you upload, at the hours people actually ask: late evening. A bot can take the order itself, too: see <Link href="/blog/whatsapp-food-ordering-system">WhatsApp food ordering</Link>.</p>
      <h3>Real estate</h3>
      <p>Answers about listings, price, location, and amenities, plus a few qualifying questions (budget, area, move-in date) before an agent calls. See <Link href="/ai-calling-agent-for-real-estate">AI for real estate</Link>.</p>
      <h3>Coaching and education</h3>
      <p>Course fees, batch timings, syllabus, and demo-class requests, the same ten questions every parent asks, in every language they ask in.</p>
      <h3>Local services</h3>
      <p>Salons, repair shops, and travel agents: prices, availability, and directions, with anything unusual handed to the owner. For tone and handoff rules, see <Link href="/blog/zen-whatsapp-workflow">a calmer WhatsApp workflow</Link>.</p>
    </>,
  },
  {
    id: "pros-cons",
    title: "What chatbots do well, and where they fail",
    body: <>
      <ProsCons
        pros={["Replies in seconds, day and night", "Gives the same correct answer every time", "Answers in the customer’s language", "Clears the repeat questions so people handle the hard ones", "Keeps every conversation saved and searchable"]}
        cons={["Only as good as its knowledge base: missing info means vague answers", "Upset customers usually want a person", "Needs a weekly read-through to stay sharp", "Unofficial routes put a number at risk if you use them to spam", "Text bots don’t answer voice notes or images"]}
      />
      <p>The failure that hurts most is a confident wrong answer. Prevent it with one line in the instructions, “if the knowledge base doesn’t say, tell the customer a person will reply”, and by adding an answer to the knowledge base every time you spot a gap.</p>
    </>,
  },
  {
    id: "cost",
    title: "How much does a WhatsApp chatbot cost?",
    body: <>
      <p>The bill has up to three parts, and comparisons that show only the first are misleading:</p>
      <ul>
        <li><strong>The platform’s plan.</strong> Most chatbot platforms charge monthly, often with AI agents or the chatbot builder as paid add-ons. Our <Link href="/blog/wati-alternatives">WATI alternatives</Link> list compares real prices.</li>
        <li><strong>Meta’s message fees,</strong> if the platform uses the Business API. Meta charges per delivered template message, and since <strong>1 October 2026</strong> also for service replies beyond 1,000 a month per number. The rates by country are in <Link href="/blog/whatsapp-business-api-pricing">WhatsApp Business API pricing</Link>.</li>
        <li><strong>AI usage.</strong> Some platforms count AI replies separately or ask for your own OpenAI key, so a busy month costs more.</li>
      </ul>
      <p><strong>Wapzen is currently free</strong>, with the AI models (GPT and Claude) included and no keys of your own. It links your number by QR code rather than the Business API, so Meta’s message fees don’t apply either. See the <Link href="/pricing">pricing page</Link>.</p>
      <InlineCta title="Try an AI chatbot on your own number" body="Create a free chat agent, upload your price list, scan a QR code. No credit card, no Business API." />
    </>,
  },
  {
    id: "set-up",
    title: "How to set one up in about 15 minutes",
    body: <>
      <p>With Wapzen, the whole setup is four steps:</p>
      <ol>
        <li><strong>Make a knowledge base.</strong> Paste or upload your price list, delivery and payment rules, return policy, and FAQ (text, PDF, or Word).</li>
        <li><strong>Create a chat agent.</strong> Write a short system prompt: who it works for, what it helps with, and its rules. Pick a GPT or Claude model and attach the knowledge base.</li>
        <li><strong>Connect your number.</strong> Scan a QR code from WhatsApp’s Linked devices screen and choose the agent for that number.</li>
        <li><strong>Test it,</strong> by messaging your number from another phone with the questions customers ask most.</li>
      </ol>
      <Screenshot src={img("chat-agent.webp")} width={2392} height={1656} alt="Wapzen chat agent editor with a system prompt, a Claude model and an attached knowledge base" caption="A chat agent: instructions, model, and knowledge base on one screen. Wapzen dashboard, demo data." />
      <p>The step-by-step version with every screen is <Link href="/blog/whatsapp-chatbot-without-business-api">How to create a WhatsApp chatbot without the Business API</Link>. If you’d rather build it yourself, <Link href="/blog/n8n-whatsapp-ai-agent">the n8n guide</Link> shows that route.</p>
      <p>Once it’s live, tell customers it’s there. A free <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR code generator</Link> makes a printable code for your shop, menu, or packaging that opens a chat with your new chatbot.</p>
    </>,
  },
  {
    id: "do-you-need-one",
    title: "Does your business need one?",
    body: <>
      <p>A chatbot pays off quickly if two or more of these are true:</p>
      <ul>
        <li>You answer the <strong>same ten questions</strong> every day.</li>
        <li>Messages arrive <strong>after hours</strong> and wait until morning.</li>
        <li>Customers <strong>buy from whoever replies first</strong>, so slow replies cost sales.</li>
        <li>You get questions in <strong>more than one language</strong>.</li>
      </ul>
      <p>If you get a handful of messages a day and each one is a custom quote, the free <Link href="/whatsapp-auto-reply">away message in WhatsApp Business</Link> and a good <Link href="/blog/whatsapp-business-greeting-message">greeting message</Link> may be all you need for now.</p>
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. It links your number as a linked device. Use the chatbot to answer people who message you, never to message people who didn’t: WhatsApp restricts numbers that send bulk or unwanted messages.</Note>
    </>,
  },
];

export default function WhatIsAWhatsAppChatbotPage() {
  return <BlogPost
    href={href}
    heading={<>What is a WhatsApp chatbot?<br /><span>And how does it work?</span></>}
    lead="A plain-English explainer: what a WhatsApp chatbot is, the difference between menu bots and AI bots, what happens behind every reply, real examples by industry, what it costs in 2026, and how to set one up."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>A WhatsApp chatbot</strong> is software that automatically answers the messages your WhatsApp number receives, in seconds, at any hour.</>,
        <><strong>Rule-based bots</strong> send replies you wrote in advance; <strong>AI chatbots</strong> understand free text and answer from your own business information.</>,
        <><strong>It connects</strong> through Meta’s Business API (official, per-message fees) or as a linked device by QR code (no Meta fees, no broadcasts).</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-chatbot-without-business-api", "/blog/whatsapp-business-api-pricing"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>See one answer your customers.<br /><span>Free, in 15 minutes.</span></>, body: "Create an AI chat agent, add your business info, and scan a QR code. It starts answering your WhatsApp right away." }}
  />;
}
