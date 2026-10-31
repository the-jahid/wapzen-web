import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp business vs whatsapp business api" (83), "difference
// between whatsapp business app and whatsapp business api" (63), "what is
// whatsapp business api" (51), "whatsapp business app vs api" (47),
// autocomplete 2026-10-27. Coexistence limits come from providers' docs, not
// Meta's, so they're worded as "providers report".
const href = "/blog/whatsapp-business-app-vs-api";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const compared = [
  ["What it is", "A free app on your phone", "Access for software, through Meta or a provider", "The app, plus an AI agent linked by QR code"],
  ["Cost", "Free", "Meta’s per-message fees plus the provider’s plan", "Free app; Wapzen is currently free"],
  ["Who replies", "You, by hand", "Your software, bot, or team inbox", "An AI agent, and you whenever you want"],
  ["Setup", "Install and verify your number", "Business portfolio, provider, display name review, templates", "Scan a QR code"],
  ["Automation", "Greeting and away messages, quick replies", "Chatbots, flows, integrations", "AI replies from your knowledge base, AI WhatsApp calls, API tools"],
  ["Broadcasts", "Lists of up to 256 people who saved your number", "Templates to opted-in contacts, within messaging limits", "No"],
  ["Messaging first", "Anyone, one by one", "Approved templates only, outside the 24-hour window", "Answers people who contact you"],
  ["Keep the phone app", "Yes", "Only with coexistence", "Yes"],
  ["Official Meta route", "Yes", "Yes", "No, it’s a linked device"],
];

const faqs = [
  { q: "What is the difference between WhatsApp Business and the WhatsApp Business API?", a: "The WhatsApp Business app is a free phone app for small businesses that reply by hand, with greeting and away messages, quick replies, labels, and a catalogue. The WhatsApp Business API, now called the WhatsApp Business Platform, has no app of its own: it lets software send and receive messages at scale, for chatbots, broadcasts, team inboxes, and integrations, and Meta charges per message." },
  { q: "Is the WhatsApp Business API free?", a: "No. Access to Meta's Cloud API costs nothing, but Meta charges per delivered template message and, since 1 October 2026, for service replies beyond 1,000 a month per number. Most businesses also pay a provider's monthly plan." },
  { q: "Can I use the WhatsApp Business app and the API on the same number?", a: "Yes, through Meta's coexistence feature, available through many providers. A number already on the WhatsApp Business app is onboarded to the Cloud API and keeps working in the app. Providers report some limits: group chats don't sync, disappearing messages and delete-for-everyone are turned off, and it isn't offered in every country." },
  { q: "Do I need the Business API to put a chatbot on WhatsApp?", a: "No. You can link a WhatsApp Business number as a device with a QR code, the way WhatsApp Web works, and let an AI agent answer the messages it receives. You need the API for bulk broadcasts, a large team inbox, or Meta's official platform." },
  { q: "Which is better for a small business?", a: "Start with the free WhatsApp Business app. If you spend hours answering the same questions, add an AI agent to the app's number rather than moving to the API. Move to the API when you need broadcasts to thousands of contacts or a team of agents in one inbox." },
  { q: "Can I go back from the API to the WhatsApp Business app?", a: "Yes, but plan for it. A number fully moved to the API has to be disconnected from the API before it can be registered in the app again, and coexistence only works in the other direction, from the app to the API." },
];

const sources = [
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Meta: messaging limits", href: "https://developers.facebook.com/docs/whatsapp/messaging-limits" },
  { label: "360dialog: WhatsApp coexistence", href: "https://docs.360dialog.com/partner/onboarding/whatsapp-coexistence" },
  { label: "WhatsApp Help Center: How to link a device", href: "https://faq.whatsapp.com/1317564962315842" },
];

const sections = [
  {
    id: "short-answer",
    title: "The difference in one minute",
    body: <>
      <p>The <strong>WhatsApp Business app</strong> is the free app with the “B” in its icon. You install it, verify your number, and reply to customers yourself. The <strong>WhatsApp Business API</strong>, which Meta now calls the WhatsApp Business Platform, isn’t an app at all. It’s a way for software to send and receive messages on a number, which is how chatbots, broadcast tools, and shared team inboxes work.</p>
      <p>One is built for a person replying by hand. The other is built for software working at scale, and it charges per message. In between sits a third option many businesses miss: keep the app and add AI to it.</p>
      <Comparison caption="WhatsApp Business app, WhatsApp Business API, and the app with an AI agent compared" columns={["Business app", "Business API", "App + AI agent"]} rows={compared} />
    </>,
  },
  {
    id: "app",
    title: "The WhatsApp Business app: free, manual, limited",
    body: <>
      <p>For most small businesses, the app is where WhatsApp starts, and it does a lot for free:</p>
      <ul>
        <li>A <strong>business profile</strong> with your address, hours, and website.</li>
        <li>A <strong>catalogue</strong> of products or services, with prices and photos.</li>
        <li><strong>Labels</strong> to sort chats (new order, paid, follow up).</li>
        <li><strong>Quick replies</strong>: saved answers you send with a shortcut.</li>
        <li><strong>Greeting and away messages</strong>: fixed texts sent automatically. See <Link href="/whatsapp-auto-reply">auto reply samples</Link>.</li>
        <li>A <strong>short link and QR code</strong> that open a chat with you. To add your logo, use a free <Link href="/tools/whatsapp-qr-code-generator#business">WhatsApp Business QR code generator</Link>.</li>
        <li><strong>Broadcast lists</strong> of up to 256 contacts, which only reach people who saved your number.</li>
      </ul>
      <p>Its limits show up as you grow. Every real answer is typed by a person, and the only automation is a fixed greeting or away text that can’t answer a question. It runs on one phone plus up to four linked devices, so a team shares one account. And broadcasts are small by design.</p>
    </>,
  },
  {
    id: "api",
    title: "The WhatsApp Business API: built for scale",
    body: <>
      <p>The API connects your number to software instead of an app. You reach it either directly through Meta’s Cloud API, where you build everything yourself, or, more commonly, through a provider such as WATI, AiSensy, Interakt, or respond.io, which gives you an inbox, a chatbot builder, and broadcast tools on top.</p>
      <p>What you get: broadcasts to opted-in contacts, chatbots and flows, many agents in one inbox, and integrations with your CRM or store. What comes with it:</p>
      <ul>
        <li><strong>Setup.</strong> A Meta business portfolio, a number that isn’t active in the app (unless you use coexistence), a display name review, and templates that Meta approves before you can use them.</li>
        <li><strong>The 24-hour rule.</strong> You can reply freely within 24 hours of a customer’s last message. Outside that window, only approved templates.</li>
        <li><strong>Messaging limits.</strong> A new business portfolio can message 250 unique people a day outside the window. Business verification raises it to 2,000, and good quality takes it to 10,000, 100,000, and then unlimited.</li>
        <li><strong>Per-message fees.</strong> Meta charges for every template, and since 1 October 2026 for service replies after 1,000 a month per number. The numbers are in <Link href="/blog/whatsapp-business-api-pricing">WhatsApp Business API pricing</Link>.</li>
      </ul>
    </>,
  },
  {
    id: "coexistence",
    title: "Can you use both on one number?",
    body: <>
      <p>Yes, with <strong>coexistence</strong>. Meta lets a number that’s already on the WhatsApp Business app be onboarded to the Cloud API through a provider, and keep working in the app. You keep chatting from your phone while software sends campaigns and runs a chatbot, and messages sync between the two.</p>
      <p>Providers report a few catches:</p>
      <ul>
        <li><strong>Some app features turn off,</strong> such as disappearing messages and delete for everyone.</li>
        <li><strong>Group chats don’t sync</strong> to the API side.</li>
        <li><strong>It isn’t offered in every country.</strong></li>
        <li><strong>It only works from the app to the API.</strong> A number that’s already on the API can’t be brought back into the app this way.</li>
        <li><strong>API messages are still charged</strong> at Meta’s rates.</li>
      </ul>
    </>,
  },
  {
    id: "third-route",
    title: "The third route: the app, plus an AI agent",
    body: <>
      <p>Many businesses look at the API for one reason: they want customers answered faster than a person can type. That doesn’t need the API.</p>
      <p>WhatsApp lets you link a number to other devices with a QR code, the same way WhatsApp Web works. Wapzen uses that link. You keep your WhatsApp Business app exactly as it is, and an <strong>AI agent</strong> answers the one-to-one messages your number receives, using your price list, policies, and FAQ. A <strong>voice agent</strong> can also answer and make WhatsApp calls on the same number, which the app can’t do on its own.</p>
      <ul>
        <li><strong>No API setup,</strong> templates, or display name review.</li>
        <li><strong>No Meta message fees,</strong> because the number isn’t on the API. Wapzen itself is <Link href="/pricing">currently free</Link>.</li>
        <li><strong>You stay in control:</strong> replies show up in your app, every conversation is saved, and you can jump in or pause the agent at any time.</li>
      </ul>
      <p>What it doesn’t do: bulk broadcasts, a large team inbox, or Meta’s official platform. If those are what you need, the API is the right call.</p>
      <InlineCta title="Keep your app. Add an AI agent." body="Link your WhatsApp Business number with a QR code and let AI answer messages and calls. Free right now." />
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. Use the agent to answer people who contact you, never to message people who didn’t: WhatsApp restricts numbers that send bulk or unwanted messages.</Note>
    </>,
  },
  {
    id: "choose",
    title: "Which one should you choose?",
    body: <>
      <Choose items={[
        { name: "the Business app alone", points: ["You get a few chats a day and like replying yourself", "Your budget for WhatsApp is zero", "Small broadcasts to saved contacts are enough"] },
        { name: "the Business API", points: ["You broadcast to thousands of opted-in contacts", "Several agents share one inbox, with roles and assignment", "You need deep CRM or store integrations on Meta’s official platform"] },
        { name: "Wapzen", points: ["You answer the same questions all day and want AI to do it", "You want AI to answer WhatsApp calls too", "You’d rather keep your number and app, with no API fees"] },
      ]} />
      <p>Still deciding? Our <Link href="/blog/what-is-a-whatsapp-chatbot">WhatsApp chatbot explainer</Link> covers how chatbots work, and <Link href="/blog/wati-alternatives">WATI alternatives</Link> compares the main API providers.</p>
    </>,
  },
];

export default function WhatsAppBusinessAppVsApiPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp Business app vs API.<br /><span>Which one do you need?</span></>}
    lead="The WhatsApp Business app is free and manual; the Business API is built for software and charges per message. Here’s how they really differ in 2026, what coexistence changes, and a third route if all you want is faster answers."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Business app:</strong> free, on your phone, you reply by hand. Fixed greeting and away messages are the only automation.</>,
        <><strong>Business API:</strong> for software at scale (chatbots, broadcasts, team inboxes), with Meta approval and per-message fees.</>,
        <><strong>Third route:</strong> keep the app and link an AI agent by QR code for instant answers, without the API or its fees.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-business-api-pricing", "/blog/whatsapp-chatbot-without-business-api"]}
    product="/whatsapp-business-api-alternative"
    cta={{ heading: <>Faster answers, same app.<br /><span>No Business API.</span></>, body: "Add a free AI agent to your WhatsApp Business number with a QR code. It answers messages and calls while you keep using the app." }}
  />;
}
