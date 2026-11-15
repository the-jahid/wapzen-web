import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "ai auto reply whatsapp" (64, 5/5), "can ai reply to whatsapp messages"
// (51), "ai reply whatsapp" (50, 5/5), "whatsapp ai reply" (50, 5/5), "can ai answer
// whatsapp messages" (42), "whatsapp ai reply off" (36), autocomplete 2026-11-05.
// Search Console: "can ai reply to whatsapp messages" 2 impressions at 10.5, "ai auto
// reply whatsapp" 2 at 7. Meta Business Agent facts follow /blog/whatsapp-business-ai-agent
// (recheck turn-off steps there); Meta One from about.fb.com. Wapzen facts: whiskey
// responder, per-contact switch, media toggles and groups as of 2026-11-05.
const href = "/blog/can-ai-reply-to-whatsapp-messages";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const ways = [
  ["Works on", "WhatsApp Business app", "Cloud API number", "Cloud API number", "Personal or Business number"],
  ["Setup", "A few taps, if your account is eligible", "Provider sign-up and Meta verification", "Developer work", "Link by QR code or pairing code"],
  ["Answers from", "Your profile, catalog and past chats", "Your flows and knowledge base", "Whatever you build", "Your instructions and documents"],
  ["Cost", "Free to start; more capacity with Meta One", "Plan, AI add-on and message fees", "Hosting, AI usage and message fees", "Everything is free right now"],
  ["WhatsApp calls", "Chats described, not calls", "On some platforms, by your team", "If you build it", "AI voice agent answers and calls"],
  ["Official Meta route", "Yes", "Yes", "Yes", "No, it links as a device"],
];

const faqs = [
  { q: "Can AI reply to WhatsApp messages?", a: "Yes. Meta Business Agent can answer on the WhatsApp Business app, chatbot platforms can answer through the Business API, developers can build their own agent, and Wapzen can answer on an existing personal or Business number." },
  { q: "Can AI reply on a personal WhatsApp account?", a: "WhatsApp has no built-in auto reply for personal accounts, and Meta Business Agent is for Business numbers. A tool that links as a device, such as Wapzen, can reply on a personal number." },
  { q: "Is Meta AI the same as an AI auto reply?", a: "No. Meta AI is an assistant you chat with, or ask for help writing. It doesn't answer your customers for you. Meta Business Agent is the separate product that does that for businesses." },
  { q: "How do I turn off AI replies on WhatsApp?", a: "For Meta Business Agent, go to Tools › Meta Business Agent › Response settings › Disconnect AI, or remove it from one chat through the contact's Include your AI option. Labels can differ by app version. In Wapzen, switch AI off for one contact in their conversation, or pause the agent to stop it everywhere." },
  { q: "Can ChatGPT reply to my WhatsApp messages?", a: "ChatGPT's own WhatsApp number can't answer your customers. A business can connect a GPT-powered agent to its own number, though. Wapzen's chat agents run on OpenAI's GPT models." },
  { q: "Will AI reply in my customer's language?", a: "It can. Tell the agent to answer in the customer's language in its instructions. This suits Hindi, Hinglish, Spanish, Arabic and other markets where customers mix languages." },
  { q: "Can AI answer voice notes, photos and calls too?", a: "In Wapzen, yes. Switch on voice notes and photos for the agent, and it transcribes and reads them. Its AI voice agent also answers and makes WhatsApp calls." },
  { q: "Is there a free AI that replies to WhatsApp messages?", a: "Yes. Everything in Wapzen is free right now, with no credit card and no Meta per-message fees. Meta Business Agent is also free to start in the WhatsApp Business app." },
];

const sources = [
  { label: "Meta: Introducing Meta Business Agent (3 June 2026)", href: "https://about.fb.com/news/2026/06/meta-business-agent/" },
  { label: "Meta: Introducing Meta One (15 Sep 2026)", href: "https://about.fb.com/news/2026/09/introducing-meta-one/" },
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
];

const sections = [
  {
    id: "short-answer",
    title: "Can AI reply to WhatsApp messages?",
    body: <>
      <p><strong>Yes.</strong> An AI agent can read an incoming WhatsApp message and send a useful reply within seconds, day and night, using your prices, hours and policies. The difference between tools is which number they work on, what they cost, and how much they can do.</p>
      <p>WhatsApp’s older features aren’t AI. Greeting messages, away messages and quick replies send fixed text. Meta AI’s writing help drafts text for you to send. Neither reads the question and answers the customer by itself.</p>
    </>,
  },
  {
    id: "four-ways",
    title: "Four ways to get AI replies on WhatsApp",
    body: <>
      <Comparison caption="Four ways to get AI replies on WhatsApp" columns={["Meta Business Agent", "API chatbot platform", "Build your own", "Wapzen"]} rows={ways} />
      <h3>1. Meta Business Agent</h3>
      <p>Meta’s own agent lives in the Tools tab of the WhatsApp Business app, if your account is eligible. It’s the simplest official route. Read more in <Link href="/blog/whatsapp-business-ai-agent">WhatsApp Business AI agent</Link>.</p>
      <h3>2. A Business API chatbot platform</h3>
      <p>Platforms such as WATI and AiSensy add AI to the API, along with broadcasts and a team inbox. They suit larger teams, and the costs add up. See <Link href="/blog/wati-vs-aisensy">WATI vs AiSensy</Link>.</p>
      <h3>3. Build your own</h3>
      <p>Developers can join the API to an AI model with a tool like n8n. You get full control and all the maintenance. See <Link href="/blog/n8n-whatsapp-ai-agent">n8n WhatsApp AI agent</Link>.</p>
      <h3>4. Wapzen</h3>
      <p>Wapzen links the number you already use, like WhatsApp Web does, and an AI agent answers from your instructions. It works on personal and Business numbers, needs no code, and <strong>everything is free right now</strong>.</p>
    </>,
  },
  {
    id: "what-it-can-do",
    title: "What an AI agent can answer",
    body: <>
      <ul>
        <li><strong>Common questions:</strong> prices, hours, location, delivery and returns.</li>
        <li><strong>Questions from your documents:</strong> upload text, PDF or Word files as a knowledge base.</li>
        <li><strong>Orders:</strong> collect details, confirm a summary with the customer, and save the order.</li>
        <li><strong>Leads and bookings:</strong> ask for what you need, and connect your own systems with API tools.</li>
        <li><strong>Voice notes and photos:</strong> transcribe and read them, once you switch that on.</li>
        <li><strong>Groups:</strong> reply when tagged, in groups where you’ve turned AI on.</li>
        <li><strong>Calls:</strong> Wapzen’s AI voice agent answers and makes WhatsApp calls.</li>
      </ul>
      <p>For real conversations, see <Link href="/blog/whatsapp-ai-auto-reply-customer-conversations">12 customer chats you can automate</Link>.</p>
    </>,
  },
  {
    id: "set-up",
    title: "How to set it up in Wapzen",
    body: <>
      <ol>
        <li><strong>Sign up free.</strong> No credit card.</li>
        <li><strong>Create a chat agent and link your number</strong> with a pairing code or QR code. The agent goes live once linked, so do the next step straight away.</li>
        <li><strong>Write its instructions:</strong> who it speaks for, what you sell, your prices and hours, and what to do when it doesn’t know.</li>
        <li><strong>Attach your documents</strong> as a knowledge base.</li>
        <li><strong>Send a test message</strong> from another phone, and improve the instructions from what you see.</li>
      </ol>
      <InlineCta title="Let AI answer your WhatsApp" body="Everything is free right now. Link your number and your agent starts replying." />
    </>,
  },
  {
    id: "turn-off",
    title: "How to turn AI replies off",
    body: <>
      <ul>
        <li><strong>Meta Business Agent, everywhere:</strong> Tools › Meta Business Agent › Response settings › Disconnect AI. Labels can differ by app version.</li>
        <li><strong>Meta Business Agent, one chat:</strong> open the chat, tap the contact’s name, then Include your AI › Remove AI.</li>
        <li><strong>Wapzen, one contact:</strong> use the AI switch on that conversation, then reply yourself.</li>
        <li><strong>Wapzen, everywhere:</strong> pause the agent in the dashboard.</li>
      </ul>
    </>,
  },
  {
    id: "good-replies",
    title: "How to get good AI replies",
    body: <>
      <ul>
        <li><strong>Give it facts.</strong> An agent is only as accurate as your instructions and documents.</li>
        <li><strong>Tell it what not to do,</strong> such as never promising a discount or a delivery date.</li>
        <li><strong>Say when a person takes over,</strong> for complaints, refunds and medical or legal questions.</li>
        <li><strong>Say it’s an assistant</strong> if a customer asks.</li>
        <li><strong>Read the chats weekly</strong> and add whatever it couldn’t answer.</li>
      </ul>
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. It links your number as a device rather than using the Business API.</Note>
    </>,
  },
];

export default function CanAiReplyToWhatsAppMessagesPage() {
  return <BlogPost
    href={href}
    heading={<>Can AI reply to WhatsApp messages?<br /><span>Yes. Four ways compared.</span></>}
    lead="AI can answer your WhatsApp customers around the clock, on a Business number or a personal one. Here’s how the four main options compare on setup and cost, what an agent can handle, and how to turn it off when you want to reply yourself."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Yes, AI can reply for you,</strong> through Meta Business Agent, a Business API platform, your own build, or Wapzen.</>,
        <><strong>On a personal number,</strong> you need a tool that links as a device, because WhatsApp has no built-in auto reply there.</>,
        <><strong>For free:</strong> everything in Wapzen is free right now, including AI chat replies and a voice agent for calls.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-ai-auto-reply-customer-conversations", "/blog/whatsapp-business-ai-agent"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Stop typing the same answers.<br /><span>Let AI reply for free.</span></>, body: "Everything in Wapzen is free right now: AI that answers WhatsApp messages and calls on your own number, with no code and no Business API." }}
  />;
}
