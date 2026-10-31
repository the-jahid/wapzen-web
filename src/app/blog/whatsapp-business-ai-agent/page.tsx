import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note, ProsCons } from "@/components/blog/BlogPost";

// Targets "whatsapp business ai agent" (96, 5/5), "meta ai whatsapp business"
// (56), "meta business ai" / "meta ai for business" / "whatsapp ai features"
// (50 each, 5/5), "whatsapp business ai agent turn off" (48), "whatsapp
// business ai" (47), autocomplete 2026-10-28. Meta is still rolling this out
// and changing its name, menus and pricing: the app's paid tiers weren't
// published when this was written, and the turn-off steps come from a
// third-party guide (Invent, Oct 2026). Recheck both before any edit.
const href = "/blog/whatsapp-business-ai-agent";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const versions = [
  ["Who it’s for", "Small businesses on the WhatsApp Business app", "Businesses on the Business API (Cloud API), directly or through a provider"],
  ["Where you set it up", "Tools tab › Meta Business Agent", "WhatsApp Manager › Meta Business Agent"],
  ["What it learns from", "Your business profile, catalog, and past chats", "Business info, FAQs, files, and website pages you add"],
  ["Connects to your systems", "No", "Yes, to your own APIs and webhooks"],
  ["Price", "Free to start; Meta says paid subscriptions are coming", "$2.00 per million tokens since 1 August 2026, about 4–5 US cents a message"],
];

const versus = [
  ["Answers WhatsApp chats", "Yes", "Yes"],
  ["Answers and makes WhatsApp calls", "Not described by Meta", "Yes, with an AI voice agent"],
  ["Works on a personal WhatsApp number", "No, WhatsApp Business only", "Yes, and on Business numbers"],
  ["Looks up orders or bookings in your systems", "Platform version only", "Yes, with API request tools"],
  ["Choice of AI model", "Meta’s", "OpenAI GPT or Anthropic Claude, per agent"],
  ["Price", "Free to start, paid tiers coming", "Free right now"],
  ["Official Meta product", "Yes", "No, it links as a device"],
];

const faqs = [
  { q: "What is the AI agent in WhatsApp Business?", a: "It's Meta Business Agent, Meta's own AI for business chats, first launched as Business AI. Once you set it up from the Tools tab, it answers customer messages for you, recommends products from your catalog, helps with bookings and leads, and hands the chat to you when it should." },
  { q: "Is Meta Business Agent free?", a: "In the WhatsApp Business app it's free to start, and Meta has said businesses will access it through paid subscriptions, without publishing every tier yet. On the Business API, the Meta Business Agent Platform costs $2.00 per million tokens from 1 August 2026, which Meta estimates at about 4 to 5 US cents a message." },
  { q: "How do I turn off the AI agent in WhatsApp Business?", a: "In the WhatsApp Business app, go to Tools › Meta Business Agent › Response settings › Disconnect AI (Delete your AI agent on iPhone), then choose Pause AI replies, or Disconnect and delete my AI. To remove it from one chat, open the chat, tap the contact's name, then Include your AI › Remove AI. Labels can differ between app versions." },
  { q: "Why don't I see Meta Business Agent in my WhatsApp Business app?", a: "Meta is rolling it out to eligible businesses, and eligibility depends on your country, your business category, and your account. Update the app and look under the Tools tab; older versions called it Your Business AI. If it isn't there, your account isn't eligible yet." },
  { q: "Is Meta Business Agent the same as Meta AI?", a: "No. Meta AI is Meta's general assistant that people chat with in WhatsApp. Meta Business Agent works for a business: it answers that business's customers using its catalog, profile, and past chats." },
  { q: "Can Meta Business Agent answer WhatsApp calls?", a: "Meta's announcements describe it answering chats, not voice calls. If you want AI to answer and make WhatsApp calls too, Wapzen's voice agent does that on your existing number." },
  { q: "Why did my greeting message stop working?", a: "WhatsApp's Help Center says greeting messages are switched off automatically while Meta Business Agent is connected. Disconnect the agent, then turn the greeting message back on in the Tools tab." },
];

const sources = [
  { label: "Meta: Introducing Meta Business Agent (3 June 2026)", href: "https://about.fb.com/news/2026/06/meta-business-agent/" },
  { label: "Meta: Business AI on WhatsApp for small businesses in India (May 2026)", href: "https://about.fb.com/news/2026/05/introducing-business-ai-on-whatsapp-for-small-businesses-in-india/" },
  { label: "TechCrunch: Meta’s AI agent for WhatsApp Business is now available globally", href: "https://techcrunch.com/2026/06/03/metas-ai-agent-for-whatsapp-business-is-now-available-globally/" },
  { label: "Meta for Developers: Meta Business Agent overview", href: "https://developers.facebook.com/documentation/meta-business-agent/overview" },
  { label: "Meta for Developers: pricing for non-template messages", href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages/" },
  { label: "WhatsApp Help Center: How to use greeting messages", href: "https://faq.whatsapp.com/501866148528310" },
  { label: "Invent: How to set up and turn off Meta Business Agent (Oct 2026)", href: "https://www.useinvent.com/blog/how-to-set-up-turn-off-meta-business-agent-whatsapp-app-api-invent" },
];

const sections = [
  {
    id: "what-it-is",
    title: "What is Meta Business Agent?",
    body: <>
      <p><strong>Meta Business Agent</strong> is the AI agent Meta built into WhatsApp Business. Once it’s switched on, it replies to customers who message your business: it answers questions, recommends products from your catalog, helps with appointments, qualifies leads, and hands the chat to you when a person is needed. Meta says it answers in customers’ local languages, in your business’s tone.</p>
      <p>It started as <strong>Business AI</strong>. Meta tested it for about two years in markets including India and Mexico, announced it for small businesses in India in May 2026, then renamed it and opened it to businesses of all sizes worldwide on <strong>3 June 2026</strong>. By then, Meta said, more than a million businesses were using it on WhatsApp and Messenger.</p>
      <p>Don’t confuse it with <strong>Meta AI</strong>, the general assistant people chat with in WhatsApp. Meta AI works for the user; Meta Business Agent works for a business and answers that business’s customers.</p>
      <h3>Two versions: the app and the Platform</h3>
      <Comparison caption="Meta Business Agent in the WhatsApp Business app compared with the Meta Business Agent Platform" columns={["WhatsApp Business app", "Meta Business Agent Platform"]} rows={versions} />
      <p>The Platform version isn’t open to every business: Meta excludes finance, government, health, alcohol, gambling, over-the-counter drugs, and matrimony services, and the number can’t already run another AI agent.</p>
    </>,
  },
  {
    id: "set-up",
    title: "How to set it up in the WhatsApp Business app",
    body: <>
      <ol>
        <li><strong>Update the WhatsApp Business app,</strong> then open the <strong>Tools</strong> tab.</li>
        <li>Tap <strong>Meta Business Agent</strong> (called <strong>Your Business AI</strong> in earlier versions). If it isn’t there, your account isn’t eligible yet.</li>
        <li><strong>Follow the guided steps.</strong> You may need to verify yourself and link your Meta account. The agent learns from your business profile, catalog, and past chats.</li>
        <li><strong>Check what it learned,</strong> fill the gaps, and choose the topics it should always hand to you.</li>
        <li><strong>Test it</strong> with the questions customers ask most, then switch it on.</li>
      </ol>
      <p>Meta says you can step in and reply yourself at any time. Before you switch it on, make sure your catalog prices and business hours are current: the agent repeats whatever it finds.</p>
      <p>On the Business API, the agent is set up per number in <strong>WhatsApp Manager › Meta Business Agent</strong>, after you accept Meta’s terms. You can test it on a few numbers first; a payment method is needed before it answers all your customers.</p>
    </>,
  },
  {
    id: "turn-off",
    title: "How to turn off the WhatsApp Business AI agent",
    body: <>
      <p>In the WhatsApp Business app, on Android or iPhone:</p>
      <ol>
        <li>Open <strong>Tools › Meta Business Agent › Response settings</strong>.</li>
        <li>Tap <strong>Disconnect AI</strong> (on iPhone, <strong>Delete your AI agent</strong>).</li>
        <li>Choose <strong>Pause AI replies</strong> to stop it for now, or <strong>Disconnect and delete my AI</strong> to remove it.</li>
      </ol>
      <p><strong>For one chat only:</strong> open the chat, tap the contact’s name, then <strong>Include your AI › Remove AI</strong>. You can’t pause or delete the agent from WhatsApp Web.</p>
      <p><strong>On the Business API:</strong> in WhatsApp Manager, open <strong>Meta Business Agent</strong>, find the number, and switch off <strong>Allow AI agent to respond</strong>. Repeat for each number.</p>
      <p>Then switch your <strong>greeting message</strong> back on if you used one: WhatsApp turns greeting messages off while the agent is connected. Our <Link href="/blog/whatsapp-business-greeting-message">greeting message examples</Link> have one for every kind of business.</p>
      <Note>Menu labels are from a third-party guide (October 2026) and can change between app versions. If yours differ, look for the agent under the Tools tab.</Note>
    </>,
  },
  {
    id: "limits",
    title: "What it does well, and where it falls short",
    body: <>
      <ProsCons
        pros={["Built into WhatsApp Business: nothing to install", "Free to start in the app", "Answers product questions from your catalog", "An official Meta product, so no linked device", "Answers in customers’ local languages"]}
        cons={["Chats only: Meta doesn’t describe it answering calls", "Switches off your greeting message while it’s on", "In the app, it can’t look up orders or bookings in your systems", "Not available to every business, country, or industry", "Paid tiers are coming, and their prices aren’t all public yet"]}
      />
      <p>On the Platform, the cost adds up per message. Meta’s own examples put a simple four-message conversation at about 16–20 US cents and a longer ten-message one at 40–50 cents, on top of any provider plan. The rest of the Business API’s costs are in <Link href="/blog/whatsapp-business-api-pricing">WhatsApp Business API pricing</Link>.</p>
    </>,
  },
  {
    id: "vs-wapzen",
    title: "Meta Business Agent vs Wapzen",
    body: <>
      <p>Both put AI on your WhatsApp, but they’re built differently. Meta’s agent lives inside the WhatsApp Business app; Wapzen links your number as a device and runs separate chat and voice agents that you configure in a dashboard:</p>
      <Comparison caption="Meta Business Agent compared with Wapzen" columns={["Meta Business Agent (app)", "Wapzen"]} rows={versus} />
      <Choose items={[
        { name: "Meta Business Agent", points: ["You want an official tool inside the app", "Your questions are mostly about catalog products", "Text replies are enough", "You can wait for it to reach your account"] },
        { name: "Wapzen", points: ["You want AI to answer calls as well as chats", "You use a personal WhatsApp number", "Your AI needs to look things up in your systems", "You want to choose GPT or Claude and write the instructions"] },
      ]} />
      <p>Whichever agent you pick, a <Link href="/tools/whatsapp-qr-code-generator">WhatsApp Business QR code</Link> on your counter or packaging sends customers straight to it. The generator is free and adds your logo.</p>
      <InlineCta title="AI for your WhatsApp chats and calls" body="Free right now: a chat agent and a voice agent on your existing number, set up in about 15 minutes." />
      <Note>Don’t run two AI agents on one number, or customers will get two answers to every message. Wapzen is an independent product, not made by Meta or WhatsApp. For how a chatbot works in general, see <Link href="/blog/what-is-a-whatsapp-chatbot">What is a WhatsApp chatbot?</Link></Note>
    </>,
  },
];

export default function WhatsAppBusinessAiAgentPage() {
  return <BlogPost
    href={href}
    heading={<>The WhatsApp Business AI agent.<br /><span>Meta Business Agent, explained.</span></>}
    lead="WhatsApp Business now has a built-in AI agent from Meta. Here’s what it does, how to set it up or switch it off, what it costs on the app and the API, where it falls short, and how it compares with Wapzen."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Meta Business Agent</strong> (first called Business AI) is Meta’s AI agent for WhatsApp Business. It answers customer chats, recommends products, and hands over to you.</>,
        <><strong>Set it up or turn it off</strong> under Tools › Meta Business Agent in the WhatsApp Business app. While it’s on, your greeting message is switched off.</>,
        <><strong>It’s free to start in the app;</strong> on the Business API it costs $2.00 per million tokens, about 4–5 US cents a message.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/what-is-a-whatsapp-chatbot", "/blog/whatsapp-business-greeting-message"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>AI that answers chats and calls.<br /><span>On the number you already use.</span></>, body: "Create a free AI chat agent and voice agent, add your business info, and scan a QR code. No Business API." }}
  />;
}
