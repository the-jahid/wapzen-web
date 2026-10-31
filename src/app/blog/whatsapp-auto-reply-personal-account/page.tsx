import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Note, Screenshot } from "@/components/blog/BlogPost";

// Targets "how to set auto reply in whatsapp personal" (+ android / iphone /
// "without business account"), autocomplete 2026-10-25. /whatsapp-auto-reply
// already owns the generic "whatsapp auto reply" phrases and the message
// samples, so this post stays on the personal-account angle and links there.
// The AI method's limits (answers every 1:1 text, never groups) come from
// whatsapplogin.handleIncomingMessage; keep them in step with it.
const href = "/blog/whatsapp-auto-reply-personal-account";
const post = blogPost(href);
const img = (file: string) => `/blog/whatsapp-auto-reply-personal-account/${file}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const methods = [
  ["Works on", "Android and iPhone", "Android only", "Android and iPhone"],
  ["Keeps the regular WhatsApp app", "No, the number moves to WhatsApp Business", "Yes", "Yes"],
  ["What it sends", "One fixed message", "Fixed text or keyword rules", "A written answer to each message"],
  ["Answers questions", "No", "Only ones you wrote rules for", "Yes, from your instructions"],
  ["Phone must be online", "Yes", "Yes, with notifications on", "No"],
  ["Cost", "Free", "Free, with paid upgrades", "Free right now"],
];

const faqs = [
  { q: "Can I set auto reply on normal WhatsApp?", a: "Not inside the app. Regular WhatsApp has no away message or auto reply setting on Android or iPhone. You can move the number to the free WhatsApp Business app, use an Android auto-reply app, or link the number to an AI agent such as Wapzen, which keeps you on regular WhatsApp." },
  { q: "How do I set auto reply on WhatsApp on iPhone?", a: "iPhone has no auto-reply apps for WhatsApp, because iOS doesn't let apps reply to other apps' notifications. Your options are the WhatsApp Business app's away message, or linking your number to Wapzen by QR code from WhatsApp's Linked devices screen, which works the same on iPhone." },
  { q: "How do I set auto reply in WhatsApp without a business account?", a: "Link your personal number to an AI agent. In Wapzen you create a chat agent, scan a QR code from WhatsApp's Linked devices screen, and switch the agent on. Your number stays a personal account and you keep using the regular app." },
  { q: "Does WhatsApp auto reply work when my phone is off?", a: "The WhatsApp Business away message and Android auto-reply apps both need your phone online. A linked AI agent replies from the cloud, so it keeps answering while your phone is off. Open WhatsApp on your phone at least every couple of weeks, or WhatsApp signs linked devices out." },
  { q: "Will people know the reply is automatic?", a: "They see a normal message from your number. We'd recommend saying so: tell the agent in its instructions to introduce itself as your assistant. People are more forgiving of an assistant than of a reply that pretends to be you." },
  { q: "Will the AI reply in my WhatsApp groups?", a: "No. Wapzen's chat agent only answers one-to-one chats and never posts in groups. It does answer everyone who messages you one-to-one, so pause it when you're back or use it on the number you use for work." },
];

const sources = [
  { label: "WhatsApp Help Center: How to use away messages", href: "https://faq.whatsapp.com/2565868990219715" },
  { label: "WhatsApp Help Center: How to link a device", href: "https://faq.whatsapp.com/1317564962315842" },
];

const sections = [
  {
    id: "can-you",
    title: "Does personal WhatsApp have auto reply?",
    body: <>
      <p>No. The regular WhatsApp app, on Android or iPhone, has no away message, greeting message, or auto reply setting. Those live in the separate <strong>WhatsApp Business</strong> app. That leaves three ways to answer people automatically while you’re busy, asleep, or away:</p>
      <Comparison caption="Three ways to auto reply on a personal WhatsApp number" columns={["WhatsApp Business app", "Android auto-reply app", "AI agent (Wapzen)"]} rows={methods} />
      <p>If one polite “I’ll get back to you” is enough, the Business app is the simplest. If people ask you the same questions (prices, availability, where you are), an AI agent can answer them properly. The sections below walk through each method.</p>
    </>,
  },
  {
    id: "business-app",
    title: "Method 1: Switch to WhatsApp Business",
    body: <>
      <p>WhatsApp Business is free, runs on the same phone number, and can bring your chats across when you switch. Once your number is in WhatsApp Business, it’s no longer on the regular app, so this is a real move, not an add-on.</p>
      <ol>
        <li><strong>Install WhatsApp Business</strong> and verify your existing number. It offers to transfer your chat history from WhatsApp.</li>
        <li>Open <strong>Settings</strong> on iPhone, or <strong>More options</strong> on Android, then <strong>Business tools › Away message</strong>.</li>
        <li><strong>Turn on</strong> “Send away message” and write your message.</li>
        <li>Pick a <strong>schedule</strong> (always, a custom schedule, or outside business hours) and the <strong>recipients</strong>, then tap Save.</li>
      </ol>
      <p>The away message is the same text for everyone, and it only goes out while your phone has an internet connection. For wording ideas, copy one of the <Link href="/whatsapp-auto-reply#samples">WhatsApp auto reply samples</Link>.</p>
    </>,
  },
  {
    id: "android-apps",
    title: "Method 2: An auto-reply app on Android",
    body: <>
      <p>Android apps such as AutoResponder for WA or WhatsAuto read your incoming WhatsApp notifications and answer through the notification’s reply button. You keep the regular WhatsApp app and set rules like “reply to everyone” or “reply when the message contains <em>price</em>”.</p>
      <p>They work, with limits worth knowing before you install one:</p>
      <ul>
        <li><strong>Android only.</strong> iPhone doesn’t let apps reply to another app’s notifications.</li>
        <li><strong>Your phone has to be on</strong>, online, and showing WhatsApp notifications. Battery savers that close the app stop the replies.</li>
        <li><strong>They need notification access</strong>, which means they can read every notification on your phone, not just WhatsApp’s.</li>
        <li><strong>Replies are rules you write.</strong> Some apps add AI replies as a paid extra.</li>
      </ul>
      <p>These apps are made by third parties, not by WhatsApp.</p>
    </>,
  },
  {
    id: "ai-auto-reply",
    title: "Method 3: AI auto reply with Wapzen, step by step",
    body: <>
      <p>Wapzen links your number the way WhatsApp Web does and runs an AI chat agent on it. Instead of a fixed away message, every person who messages you gets a short, written answer to what they actually asked. You keep the regular WhatsApp app on your phone. It’s free right now, and the screenshots below are from the real dashboard with a demo account: Maya, a photographer, who gets booking questions while she’s out on shoots.</p>

      <h3>1. Create a free account</h3>
      <p>Click <strong>Start free</strong> at the bottom of this page. There’s no card and no WhatsApp Business API to apply for.</p>

      <h3>2. Create a chat agent and tell it what to say</h3>
      <p>Switch the dashboard to <strong>Chat</strong>, open <strong>Chat Agents</strong>, and click <strong>New chat agent</strong>. The system prompt is where the agent learns who you are and what it may say. A good one covers three things:</p>
      <ul>
        <li><strong>Who it speaks for</strong> and that you’re away: “You reply for Maya Sen, a wedding and portrait photographer, while she’s busy shooting.”</li>
        <li><strong>The facts people ask about</strong>: prices, area, hours, how fast you reply.</li>
        <li><strong>What not to promise</strong>: dates, discounts, anything you want to confirm yourself.</li>
      </ul>
      <Screenshot src={img("agent-instructions.webp")} width={2392} height={1656} alt="Wapzen chat agent editor with a system prompt for a photographer's WhatsApp auto reply" caption="The chat agent’s system prompt and model. Pick an OpenAI GPT or Anthropic Claude model; both are included." />

      <h3>3. Link your WhatsApp number with a QR code</h3>
      <p>Open <strong>Phone Numbers</strong>, click <strong>New Number</strong>, give it a label, and click Create. A QR code appears. On your phone, open WhatsApp and go to <strong>Settings › Linked devices</strong> on iPhone, or <strong>⋮ › Linked devices</strong> on Android, tap <strong>Link a device</strong>, and scan it. In the same window, pick your chat agent under <strong>Selected Agents</strong>.</p>
      <Screenshot src={img("scan-qr-code.webp")} width={1392} height={1210} alt="Wapzen phone number window showing a WhatsApp QR code to scan and the assigned chat agent" caption="Scan this code from WhatsApp’s Linked devices screen. (The code in this demo opens our blog; yours links your number.)" />

      <h3>4. Switch the agent on and test it</h3>
      <p>Back in the agent, click <strong>Activate</strong> so it shows as Live. Then message your number from another phone. Within a few seconds you’ll get an answer, and the whole thread appears under <strong>Conversations</strong>, where you can read what the agent said and reply yourself.</p>
      <Screenshot src={img("ai-reply-conversation.webp")} width={1832} height={1472} alt="A WhatsApp conversation in the Wapzen dashboard where the AI answers a wedding booking question" caption="A booking question answered while Maya was out: it asks for the details she needs and promises nothing she hasn’t approved." />
    </>,
  },
  {
    id: "good-to-know",
    title: "Before you switch AI auto reply on",
    body: <>
      <ul>
        <li><strong>It answers everyone who messages you one-to-one</strong>, friends and family included, but never posts in groups. It works best on the number you use for work. Click <strong>Pause</strong> in the agent when you’re back.</li>
        <li><strong>It answers text messages.</strong> Voice notes and photos still reach your phone as usual but don’t get an AI reply.</li>
        <li><strong>Your phone can be off.</strong> Replies come from the cloud, not your phone. Open WhatsApp on your phone at least every couple of weeks, because WhatsApp signs out linked devices on a phone that hasn’t been used for a while.</li>
        <li><strong>Wapzen isn’t made by WhatsApp.</strong> It links your number as a linked device, like WhatsApp Web. Use it to answer people who contact you, not to send bulk messages, which breaks WhatsApp’s terms on any account.</li>
      </ul>
      <p>Once auto reply is running, new chats are less work. A free <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR code</Link> lets people message you without saving your number, and the AI answers them straight away.</p>
      <Note>Want the agent to answer WhatsApp calls too? The same number can have a voice agent. See the <Link href="/ai-receptionist">AI receptionist</Link> page.</Note>
    </>,
  },
];

export default function WhatsAppAutoReplyPersonalPage() {
  return <BlogPost
    href={href}
    heading={<>Auto reply on personal WhatsApp.<br /><span>Three ways that work.</span></>}
    lead="Regular WhatsApp has no away message or auto reply setting. You can still have one: move the number to WhatsApp Business, use an Android auto-reply app, or link it to an AI agent that writes a real answer. Here’s how each works, step by step."
    summary={{
      title: "Quick answer",
      items: [
        <>Personal WhatsApp has <strong>no built-in auto reply</strong>, on Android or iPhone.</>,
        <><strong>Simplest fix:</strong> move the number to the free WhatsApp Business app and turn on an away message. It sends the same fixed text to everyone.</>,
        <><strong>For real answers:</strong> link your number to an AI agent like Wapzen with a QR code. It replies to each message from the cloud, keeps you on the regular app, and is free right now.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-chatbot-without-business-api", "/blog/whatsapp-cod-order-confirmation"]}
    product="/whatsapp-auto-reply"
    cta={{ heading: <>Replies that answer.<br /><span>On your own number.</span></>, body: "Create a free chat agent, scan a QR code, and let AI answer your WhatsApp messages while you’re busy." }}
  />;
}
