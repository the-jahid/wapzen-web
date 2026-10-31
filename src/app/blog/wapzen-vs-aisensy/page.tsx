import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, Note } from "@/components/blog/BlogPost";

// Targets "aisensy alternative" (+ "best", "in india"), "aisensy vs", "aisensy
// pricing", "aisensy free plan" (autocomplete, 2026-10-25). AiSensy facts come
// from aisensy.com/pricing and its Free Forever help article on the date in
// lib/blogPosts.ts. Be fair: AiSensy's free plan gets you the official API, and
// it's strong at broadcasts and Click-to-WhatsApp ads.
const href = "/blog/wapzen-vs-aisensy";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const comparison = [
  ["What it is", "WhatsApp Business API platform for broadcasts, a team inbox, and chatbots", "AI agents that answer WhatsApp chats and calls on your own number"],
  ["Free plan", "Free Forever: Business API access, 1 agent, no broadcasts", "Free right now, every feature included"],
  ["Paid plans", "From ₹1,500/month (Basic)", "None at the moment"],
  ["AI agent", "AI Agent Builder add-on, ₹1,350/month for 1,000 AI messages", "Included: GPT or Claude with your knowledge base"],
  ["Chatbot flows", "Drag-and-drop builder add-on, ₹2,500/month", "No flow builder; the AI agent replies in free text"],
  ["WhatsApp calls", "Not listed on its pricing page", "AI voice agent answers and makes WhatsApp calls"],
  ["Message charges", "Per message, e.g. ₹1.09 marketing, ₹0.145 utility in India", "None"],
  ["Broadcasts", "Yes, on paid plans", "No"],
  ["Team inbox", "1 agent free; 5 on Basic and Pro, then ₹750/agent", "One account; take over any chat yourself"],
  ["Setup", "Apply for the Business API; Meta reviews templates", "Scan a QR code"],
  ["Official Meta platform", "Yes", "No: links like WhatsApp Web"],
];

const faqs = [
  { q: "Is AiSensy free?", a: "AiSensy has a Free Forever plan that gives you WhatsApp Business API access, a blue tick application, a Click-to-WhatsApp ads manager, and a live chat inbox for one agent. It doesn't include broadcasts, chatbot flows, or AI agents, and WhatsApp's message charges still apply after the free service messages each month." },
  { q: "What is the best AiSensy alternative?", a: "It depends on what you use AiSensy for. For broadcasts and campaigns on the official API, WATI and Interakt are the closest alternatives. If you mainly want AI to answer customer messages and calls, Wapzen does that for free on your existing number, without the Business API." },
  { q: "Does AiSensy have an AI chatbot?", a: "Yes, as an add-on. AiSensy's WhatsApp AI Agent Builder costs ₹1,350 a month with 1,000 AI messages, and includes a knowledge base, long-term user memory, and tool calling. The drag-and-drop chatbot flow builder is a separate add-on at ₹2,500 a month." },
  { q: "Can AiSensy make WhatsApp calls?", a: "AiSensy's pricing page doesn't list WhatsApp calling. Voice AI tools such as Callkaro integrate with AiSensy to send WhatsApp messages around their phone calls, but the calls run on those tools. Wapzen's voice agent answers and makes WhatsApp calls itself." },
  { q: "Is Wapzen cheaper than AiSensy?", a: "Right now, yes: Wapzen is free with every feature included, and there are no per-message charges because it doesn't use the Business API. AiSensy's free plan costs nothing too, but AI agents, chatbot flows, and broadcasts need paid plans or add-ons." },
  { q: "Is Wapzen an official WhatsApp Business API provider?", a: "No. Wapzen is an independent product that links your number as a linked device, like WhatsApp Web. AiSensy is built on Meta's official WhatsApp Business Platform, which is the better route for large opt-in broadcasts." },
];

const sources = [
  { label: "AiSensy pricing", href: "https://aisensy.com/pricing" },
  { label: "AiSensy: Forever Free plan", href: "https://wiki.aisensy.com/en/articles/11478270-aisensy-forever-free-plan-everything-you-need-to-know" },
  { label: "AiSensy: Callkaro integration", href: "https://wiki.aisensy.com/en/articles/13366634-connect-callkaro-with-aisensy-to-automate-whatsapp-messages" },
];

const sections = [
  {
    id: "at-a-glance",
    title: "Wapzen vs AiSensy at a glance",
    body: <>
      <p>AiSensy is one of India’s most popular WhatsApp Business API platforms: it gets businesses onto Meta’s official API, then sells broadcasts, retargeting, Click-to-WhatsApp ads, and chatbots on top. Wapzen starts from the other end. It’s an AI agent that answers your WhatsApp messages and calls, on the number you already use, without the Business API.</p>
      <Comparison caption="AiSensy compared with Wapzen" columns={["AiSensy", "Wapzen"]} rows={comparison} />
    </>,
  },
  {
    id: "free-plans",
    title: "Both have a free plan. They’re not the same thing",
    body: <>
      <p>“Free” is why many people search for both, so it’s worth being precise.</p>
      <p><strong>AiSensy’s Free Forever plan</strong> gets you onto the official WhatsApp Business API at no cost, with a verified blue tick application, a Click-to-WhatsApp ads manager, ₹50 of conversation credits, and a live chat inbox for one agent. What it leaves out is most of the automation: no broadcasts or retargeting, no chatbot flows, no AI agent, and no Shopify or WooCommerce integrations. After 1,000 free service messages a month, each costs ₹0.145 for Indian numbers.</p>
      <p><strong>Wapzen</strong> is currently free with everything included: the AI chat agent, the AI voice agent, knowledge bases, API tools, and outbound calling campaigns. The AI models and voices are included too. What it doesn’t have is AiSensy’s marketing side: there are no broadcasts, and no Business API behind your number.</p>
      <p>In short: AiSensy’s free plan is a <em>free Business API account</em>. Wapzen is a <em>free AI agent</em>.</p>
    </>,
  },
  {
    id: "pricing",
    title: "What AiSensy costs once you need automation",
    body: <>
      <p>AiSensy’s paid plans are <strong>Basic at ₹1,500</strong>, <strong>Pro at ₹3,200</strong>, <strong>Premium at ₹9,100</strong>, and <strong>Unlimited at ₹45,000</strong> a month, prepaid, with 5% off quarterly and 10% off yearly billing. Basic and Pro include five agents, and each extra agent costs ₹750 a month.</p>
      <p>Automation is sold on top of any plan:</p>
      <ul>
        <li><strong>WhatsApp AI Agent Builder:</strong> ₹1,350 a month for 1,000 AI messages, with a knowledge base, long-term user memory, and tool calling.</li>
        <li><strong>Drag-and-drop chatbot builder:</strong> ₹2,500 a month for 5 chatbot flows.</li>
      </ul>
      <p>Then there are WhatsApp’s own charges, deducted from prepaid credits: for Indian numbers AiSensy lists ₹1.09 per marketing message and ₹0.145 per utility, authentication, or service message beyond the free allowance. AI agent replies count as service messages.</p>
      <p>A small store on Basic with the AI Agent Builder pays <strong>₹2,850 a month</strong> before message charges. Add the chatbot builder and it’s ₹5,350.</p>
      <Note>Prices are from AiSensy’s pricing page and help centre on the date at the top of this post, for Indian pricing. They change, so check them before you buy.</Note>
    </>,
  },
  {
    id: "ai",
    title: "AI agents: an add-on vs the whole product",
    body: <>
      <p>AiSensy’s AI Agent Builder is capable: a no-code builder, answers from a knowledge base, memory of each customer, and tool calling to reach your APIs. Its 500 free AI messages let you test before paying. It sits inside a broadcast-first platform, so you’ll set it up alongside templates, campaigns, and flows.</p>
      <p>In Wapzen, the AI agent is the product. You write its instructions, choose a GPT or Claude model, and attach knowledge bases built from text, PDF, or Word files. It answers in the customer’s language, and API tools let it look things up in your own systems. There’s no message quota to watch. Our <Link href="/blog/whatsapp-chatbot-without-business-api">step-by-step chatbot guide</Link> shows the whole setup with screenshots.</p>
    </>,
  },
  {
    id: "calls",
    title: "WhatsApp calls",
    body: <>
      <p>This is the clearest difference. AiSensy’s pricing page doesn’t list WhatsApp calling. Voice AI tools such as Callkaro and Bolna integrate with AiSensy, but there the AI call runs on the voice tool and AiSensy sends the WhatsApp messages around it.</p>
      <p>Wapzen’s voice agent answers incoming WhatsApp calls on your number around the clock, and calls people from outbound campaigns: lead call-backs, appointment reminders, or <Link href="/blog/whatsapp-cod-order-confirmation">COD order confirmation</Link>. Each call has a transcript, and the agent can send a WhatsApp message during the call. Calls are WhatsApp-only; Wapzen doesn’t dial regular phone numbers.</p>
    </>,
  },
  {
    id: "which",
    title: "Which one should you choose?",
    body: <>
      <Choose items={[
        { name: "AiSensy", points: [
          "Broadcasts and retargeting to opted-in contacts are your main use of WhatsApp",
          "You run Click-to-WhatsApp ads and want them in one place",
          "You want the official Business API and a blue tick application at no cost",
          "Several people answer chats from a shared inbox",
        ] },
        { name: "Wapzen", points: [
          "You want AI to answer customer messages without add-on fees or message quotas",
          "You want an AI agent to answer and make WhatsApp calls",
          "You’d rather keep your number on the app your customers already know",
          "You don’t want to wait for Meta approvals or manage templates",
        ] },
      ]} />
      <p>The short version: <strong>AiSensy is a WhatsApp marketing platform with AI as an add-on; Wapzen is an AI agent for WhatsApp chats and calls.</strong> You can also use both: AiSensy for campaigns on an API number, and Wapzen to answer and call on the number customers already message.</p>
      <p>Comparing more options? Read <Link href="/blog/wati-vs-aisensy-vs-interakt">WATI vs AiSensy vs Interakt</Link> or <Link href="/blog/wapzen-vs-interakt">Wapzen vs Interakt</Link>.</p>
      <Note>Wapzen links your number like WhatsApp Web, so it’s for answering people who contact you and calling people who expect your call. Bulk messages to people who didn’t opt in break WhatsApp’s terms on any account; use an official API platform for broadcasts.</Note>
    </>,
  },
];

export default function WapzenVsAiSensyPage() {
  return <BlogPost
    href={href}
    heading={<>Wapzen vs AiSensy.<br /><span>Two kinds of free.</span></>}
    lead="AiSensy gives you the official WhatsApp Business API for free, then charges for broadcasts, chatbots, and AI. Wapzen gives you a free AI agent for WhatsApp chats and calls on your own number. Here’s how they compare on price, AI, calling, and setup."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Choose AiSensy</strong> for broadcasts, retargeting, and Click-to-WhatsApp ads on Meta’s official API, especially if you’re in India.</>,
        <><strong>Choose Wapzen</strong> if you mainly want AI to answer your WhatsApp messages and calls, on your current number, with nothing to pay.</>,
        <><strong>Cost:</strong> AiSensy is free to start, but AI agents (₹1,350/month), chatbot flows (₹2,500/month), and broadcasts are paid. Wapzen is currently free.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/wati-vs-aisensy-vs-interakt", "/blog/whatsapp-chatbot-without-business-api"]}
    product="/whatsapp-business-api-alternative"
    cta={{ heading: <>A free AI agent.<br /><span>On your own number.</span></>, body: "Sign up, scan a QR code, and let an AI chatbot and voice agent answer your WhatsApp messages and calls." }}
  />;
}
