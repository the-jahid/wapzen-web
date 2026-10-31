import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { BlogPost, Note, RowTable, ToolReview } from "@/components/blog/BlogPost";

// Targets "wati alternative(s)", "best wati alternative", "wati alternative
// free", "wati alternatives india", "wati competitors" (autocomplete,
// 2026-10-25). Every price comes from the vendor's pricing page on the date in
// lib/blogPosts.ts; recheck them all when updating the post.
const href = "/blog/wati-alternatives";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const table = [
  ["WATI", "$39/mo, billed annually", "Yes", "Astra (add-on)", "Business Calling, Astra voice AI"],
  ["Wapzen", "Free", "Not needed", "Included", "AI voice agent, included"],
  ["AiSensy", "Free plan; from ₹1,500/mo", "Yes", "Add-on, ₹1,350/mo", "Not listed"],
  ["Interakt", "$55/mo", "Yes", "Add-on", "Advanced plan"],
  ["respond.io", "$79/mo, billed annually", "Yes", "Growth plan and up", "Voice AI for inbound calls"],
  ["Gallabox", "₹2,399/mo, billed annually", "Yes", "Essential plan and up", "AI voice on Advanced"],
  ["Periskope", "$25 per user/mo", "Not needed", "Included (credits)", "Not listed"],
  ["Twilio", "$0.005 per message + Meta fees", "Yes", "Build your own", "Build your own"],
];

const faqs = [
  { q: "What is the best free alternative to WATI?", a: "If you want AI to answer WhatsApp messages and calls, Wapzen is currently free with every feature included and needs no Business API. If you want a Business API platform, AiSensy has a Free Forever plan, though WhatsApp message charges still apply and its chatbot and AI agent builders are paid add-ons." },
  { q: "What is cheaper than WATI?", a: "Wapzen is free right now. Among Business API platforms, AiSensy starts at ₹1,500 a month and has a free plan, and Interakt's plans start at $55 a month. Remember to add WhatsApp's per-message charges, extra seats, and AI add-ons when you compare, not just the plan price." },
  { q: "Is there a WATI alternative that doesn't need the WhatsApp Business API?", a: "Yes. Wapzen links your existing WhatsApp or WhatsApp Business number by QR code and runs AI agents on it. Periskope also works with regular WhatsApp numbers for team inboxes. Neither is an official Meta platform, so they aren't suited to large opt-in broadcasts." },
  { q: "Which WATI alternative is best in India?", a: "AiSensy, Interakt, and Gallabox are popular Business API platforms with rupee pricing. If you want AI calls and chats in Hindi and other Indian languages without the API, Wapzen's voice agents speak Hindi, Tamil, Telugu, Bengali, and more, for free." },
  { q: "Which WATI alternatives include AI voice calls on WhatsApp?", a: "Wapzen includes an AI voice agent that answers and makes WhatsApp calls. respond.io offers a voice AI agent for inbound WhatsApp calls, and Gallabox lists AI voice on WhatsApp and phone on its Advanced plan. Interakt's Advanced plan adds calling from the inbox for your team." },
];

const sources = [
  { label: "WATI pricing", href: "https://www.wati.io/pricing/" },
  { label: "AiSensy pricing", href: "https://aisensy.com/pricing" },
  { label: "Interakt pricing", href: "https://www.interakt.shop/pricing/" },
  { label: "respond.io pricing", href: "https://respond.io/pricing" },
  { label: "respond.io voice AI agents", href: "https://respond.io/blog/respond-io-voice-ai-agents" },
  { label: "Gallabox pricing", href: "https://gallabox.com/pricing" },
  { label: "Periskope pricing", href: "https://periskope.app/pricing" },
  { label: "Twilio WhatsApp pricing", href: "https://www.twilio.com/en-us/whatsapp/pricing" },
];

const sections = [
  {
    id: "why-switch",
    title: "Why people look for a WATI alternative",
    body: <>
      <p>WATI is one of the best-known WhatsApp Business API platforms, with a polished team inbox, broadcasts, a chatbot builder, and newer AI agents. The reasons people shop around are usually these:</p>
      <ul>
        <li><strong>The total cost.</strong> Plans start at $39 a month billed annually, but WhatsApp message charges, AI credits, Astra AI agents, and extra seats ($24 to $59 per user a month) are all added on top.</li>
        <li><strong>Seat limits.</strong> Growth includes 3 users and can’t add more, so a fourth person means moving to Pro.</li>
        <li><strong>The Business API itself.</strong> Templates need Meta’s approval, messages you start are charged, and the number has to be registered on Meta’s platform.</li>
        <li><strong>Wanting AI, not flows.</strong> Many small businesses don’t need a flow builder or broadcasts. They just want every message and call answered well.</li>
      </ul>
      <p>So the right alternative depends on which of these is your reason. The table below gives the overview; each tool is reviewed after it.</p>
    </>,
  },
  {
    id: "compared",
    title: "WATI alternatives compared",
    body: <>
      <RowTable caption="WATI and seven alternatives compared" columns={["Starting price", "Business API", "AI agent", "WhatsApp calls"]} rows={table} highlight="Wapzen" />
      <Note>Starting prices are the lowest plan that includes WhatsApp, as listed by each vendor. All Business API tools add WhatsApp’s per-message charges for templates on top.</Note>
    </>,
  },
  {
    id: "reviews",
    title: "The 7 best WATI alternatives",
    body: <>
      <ToolReview rank={1} name="Wapzen" href="/" facts={[["Best for", "Free AI chats and calls"], ["Starting price", "Free right now"], ["Business API", "Not needed"]]}
        pros={["Free, with AI models and voices included", "No Business API, Meta approval, or template fees", "AI voice agent for incoming and outgoing WhatsApp calls, plus calling campaigns", "Keeps your existing number and WhatsApp app"]}
        cons={["Not an official Meta platform", "No bulk broadcasts or template campaigns", "No multi-seat team inbox with chat assignment", "Calls are WhatsApp calls only, not phone lines"]}>
        <p>Wapzen links the WhatsApp or WhatsApp Business number you already use by QR code and runs two kinds of AI agents on it: a chatbot that replies to incoming messages and a voice agent that answers and makes WhatsApp calls. You write the instructions, choose a GPT or Claude model, attach knowledge bases from your documents, and add API tools for things like order lookups or booking requests.</p>
        <p>It’s the best fit if WATI felt like more platform than you need, and what you want is for every customer who messages or calls to get a real answer. Full comparison: <Link href="/blog/wapzen-vs-wati">Wapzen vs WATI</Link>.</p>
      </ToolReview>

      <ToolReview rank={2} name="AiSensy" href="https://aisensy.com/" facts={[["Best for", "Low-cost broadcasts in India"], ["Starting price", "Free plan; Basic ₹1,500/mo"], ["Business API", "Yes"]]}
        pros={["Free Forever plan and a low entry price", "Unlimited users, under a fair-use policy", "Strong broadcast and Click-to-WhatsApp ads tools"]}
        cons={["Chatbot builder (₹2,500/mo) and AI agents (₹1,350/mo) are add-ons", "Prepaid per-message WhatsApp charges", "Calling isn’t listed on its pricing page"]}>
        <p>AiSensy is an Indian Business API platform known for broadcasts and marketing. Paid plans run from Basic at ₹1,500 a month and Pro at ₹3,200 to Premium at ₹9,100 and Unlimited at ₹45,000, with discounts for quarterly and yearly billing. Chatbots and AI are charged separately on top of any plan: the drag-and-drop builder covers 5 chatbots, and the AI agent builder includes 1,000 AI messages a month, with knowledge-base answers and tool calling.</p>
      </ToolReview>

      <ToolReview rank={3} name="Interakt" href="https://www.interakt.shop/" facts={[["Best for", "Selling with catalogs and Shopify"], ["Starting price", "Growth $55/mo + taxes"], ["Business API", "Yes"]]}
        pros={["Unlimited agents on Growth and Advanced", "Catalogs, native payments, and Shopify features", "Outbound and inbound calling from the inbox on Advanced"]}
        cons={["WhatsApp AI agents are an add-on", "Branching chatbots only on Advanced ($69/mo)", "Template charges above the free limit"]}>
        <p>Interakt combines a WhatsApp team inbox with campaigns, catalogs, and commerce features. Growth includes campaigns with click tracking, a basic linear chatbot, and catalogs; Advanced adds branching chatbot flows, chat auto-assignment, advanced webhooks, and calling from the inbox. Its pricing page lists WhatsApp AI agents as an add-on for both plans, and a separate Sales CRM product.</p>
      </ToolReview>

      <ToolReview rank={4} name="respond.io" href="https://respond.io/" facts={[["Best for", "Omnichannel support teams"], ["Starting price", "$79/mo, billed yearly"], ["Business API", "Yes"]]}
        pros={["WhatsApp, Instagram, Messenger, email and more in one inbox", "AI agents and AI credits from Growth up", "Voice AI agent for inbound WhatsApp calls"]}
        cons={["Higher entry price than most ($99/mo billed monthly)", "AI agents aren’t on Starter", "WhatsApp fees are paid separately"]}>
        <p>respond.io is built for teams that support customers across many channels, with workflows and routing at its core. Starter is $79 a month billed yearly, Growth $159, and Advanced $279; AI agents arrive with Growth. It also offers a voice AI agent that answers WhatsApp calls and hands over to a person with the transcript. There’s a 7-day trial without a card.</p>
      </ToolReview>

      <ToolReview rank={5} name="Gallabox" href="https://gallabox.com/" facts={[["Best for", "AI voice on WhatsApp and phone"], ["Starting price", "₹2,399/mo, billed annually"], ["Business API", "Yes"]]}
        pros={["AI credits on every plan", "AI voice on WhatsApp and phone lines on Advanced", "Free trial with 500 AI credits, no card needed"]}
        cons={["Basic is capped at 3 users", "WhatsApp AI agents start on Essential (₹5,599/mo annually)", "AI voice only on Advanced (₹13,599/mo annually)"]}>
        <p>Gallabox is a WhatsApp Business API platform that leans into AI. Basic includes web AI agents; Essential adds AI agents on WhatsApp and Instagram plus an inbox copilot; Advanced adds AI voice on WhatsApp and regular phone lines. It’s one of the few tools here with AI voice on both, if you’re ready for the Advanced plan. Messaging charges are billed separately.</p>
      </ToolReview>

      <ToolReview rank={6} name="Periskope" href="https://periskope.app/" facts={[["Best for", "Teams working in WhatsApp groups"], ["Starting price", "$25 per user/mo"], ["Business API", "Not needed"]]}
        pros={["Works with regular WhatsApp and WhatsApp Business numbers", "Built for group and community management", "AI agent that replies from your knowledge base on every plan"]}
        cons={["Per-user pricing adds up for larger teams", "Doesn’t support Business API numbers", "No AI voice calling listed"]}>
        <p>Periskope is a shared inbox for WhatsApp that connects normal numbers instead of the Business API, which suits sales, customer success, and operations teams that run their work in WhatsApp groups. Starter is $25 per user a month and Pro $35, with AI summaries, suggested replies, and an AI agent included. Like Wapzen, it isn’t an official Meta platform.</p>
      </ToolReview>

      <ToolReview rank={7} name="Twilio" href="https://www.twilio.com/en-us/whatsapp" facts={[["Best for", "Developers building their own"], ["Starting price", "$0.005 per message + Meta fees"], ["Business API", "Yes"]]}
        pros={["Complete flexibility over what you build", "Pay as you go, no monthly plan", "Global scale and reliability"]}
        cons={["Needs developers to build and host everything", "No ready-made inbox or AI agent", "Twilio’s fee applies to inbound and outbound messages"]}>
        <p>Twilio isn’t a ready-made platform but an API. You build the chatbot, the inbox, and any AI yourself, and pay Twilio $0.005 for every inbound or outbound WhatsApp message, plus Meta’s fees. It’s the right choice when you have engineers and very specific needs, and the wrong one if you want something working this afternoon.</p>
      </ToolReview>
    </>,
  },
  {
    id: "how-to-choose",
    title: "How to choose the right WATI alternative",
    body: <>
      <p>Answer these five questions and the list narrows quickly:</p>
      <ol>
        <li><strong>Do you need to broadcast?</strong> Marketing campaigns to thousands of opted-in contacts need a Business API platform such as AiSensy, Interakt, Gallabox, or respond.io.</li>
        <li><strong>Who answers, people or AI?</strong> A team of human agents needs seats and assignment. If AI should answer most messages, Wapzen or a platform’s AI add-on is the deciding feature.</li>
        <li><strong>Do calls matter?</strong> For an AI receptionist or lead call-backs on WhatsApp, look at Wapzen, respond.io’s voice agent, or Gallabox Advanced.</li>
        <li><strong>What’s the real budget?</strong> Add the plan, seats, AI add-ons, and per-message charges. A “cheap” plan with paid add-ons can cost more than a pricier all-in-one.</li>
        <li><strong>Must you keep your number in the app?</strong> Wapzen and Periskope work on numbers that stay in WhatsApp or WhatsApp Business on your phone.</li>
      </ol>
      <p>If you’re choosing between the big three Indian platforms, read <Link href="/blog/wati-vs-aisensy-vs-interakt">WATI vs AiSensy vs Interakt</Link>. If AI on your existing number is what you’re after, Wapzen’s <Link href="/free-whatsapp-chatbot">free chatbot</Link> takes a few minutes to set up.</p>
      <p>Whichever platform you choose, your printed materials keep working: a <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR code with your logo</Link> points at your number, not at the platform, so it survives a switch as long as the number stays the same.</p>
    </>,
  },
];

export default function WatiAlternativesPage() {
  return <BlogPost
    href={href}
    heading={<>The 7 best WATI alternatives.<br /><span>Free and paid, compared.</span></>}
    lead="WATI is a solid WhatsApp Business API platform, but plans, per-message charges, seats, and AI add-ons add up, and not every business needs a full team inbox. Here are seven alternatives, what each costs, and who each one suits."
    summary={{
      title: "Quick picks",
      items: [
        <><strong>Best free option:</strong> Wapzen, for an AI chatbot and AI WhatsApp calls on your own number, without the API.</>,
        <><strong>Best budget API platform:</strong> AiSensy, with a free plan and paid plans from ₹1,500 a month.</>,
        <><strong>Best for selling on WhatsApp:</strong> Interakt, with catalogs, payments, and Shopify.</>,
        <><strong>Best for omnichannel teams:</strong> respond.io.</>,
        <><strong>Best for AI voice on WhatsApp and phone:</strong> Gallabox, on its Advanced plan.</>,
        <><strong>Best for WhatsApp groups:</strong> Periskope. <strong>Best for developers:</strong> Twilio.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Try the free alternative.<br /><span>No API, no card.</span></>, body: "Connect your WhatsApp number with a QR code and let an AI chatbot and voice agent answer your customers." }}
  />;
}
