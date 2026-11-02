import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Samples } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp bulk message sender free" (117, 6/6 sources), "whatsapp
// bulk message sender free extension" (69), "free whatsapp bulk sender" (60),
// "send bulk whatsapp messages free" (60), "whatsapp broadcast without saving
// number" (60), "whatsapp bulk message sender free unlimited" (53), "bulk
// whatsapp sender online free" (40), autocomplete 2026-11-02. Wapzen facts
// come from whiskey-bailey-server src/bulk-messages and the dashboard's
// BulkMessagesPage: up to 5,000 numbers per send, 10 s to 1 h gap (30 s
// default), text only, {{Column}} placeholders, one running send per number,
// numbers not on WhatsApp marked failed. The AI agent doesn't see the bulk text
// when a contact replies (open gap): rewrite the "replies" section if that's
// fixed. WhatsApp's terms quote (bulk messaging) from whatsapp.com/legal.
const href = "/blog/whatsapp-bulk-message-sender-free";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const options = [
  ["Cost", "Free", "Free tiers, paid upgrades", "Per delivered message (₹0.8631 per marketing message in India) plus a plan", "Free"],
  ["How many", "256 contacts per list", "Varies", "Rises with your number’s quality rating", "Up to 5,000 numbers per send"],
  ["Who receives it", "Only people who saved your number", "Anyone on WhatsApp", "Anyone who opted in", "Anyone on WhatsApp"],
  ["Personalised", "No", "Usually a name field", "Template variables", "Any column from your sheet"],
  ["Needs approval", "No", "No", "Each template, by Meta", "No"],
  ["Runs with your computer off", "Sent from your phone", "No: the browser tab must stay open", "Yes", "Yes"],
  ["Replies answered by AI", "No", "No", "With a chatbot add-on", "Yes, by your AI agent"],
  ["Risk to your number", "Low", "High", "Low with opt-in", "Real: send only to people who expect you"],
];

const templates = [
  { title: "Back in stock", text: "Hi {{Name}}, the {{Product}} you asked about is back in stock. Want me to keep one for you? Just reply here." },
  { title: "Order follow-up", text: "Hi {{Name}}, your order {{Order}} should have reached you by now. Is everything as expected? Reply if anything needs fixing." },
  { title: "Appointment reminder", text: "Hi {{Name}}, a reminder of your appointment on {{Date}} at {{Time}}. Reply YES to confirm or tell us a better time." },
  { title: "Event invitation", text: "Hi {{Name}}, we’re holding a {{Event}} on {{Date}} and saved a place for you. Reply YES and we’ll add your name to the list." },
  { title: "Festival offer for past customers", text: "Hi {{Name}}, thanks for shopping with us this year. For the festival, past customers get {{Discount}} off until {{Date}}. Reply STOP if you’d rather not hear about offers." },
  { title: "Feedback request", text: "Hi {{Name}}, how did you find your {{Service}}? A one-line reply helps us a lot, good or bad." },
  { title: "Payment reminder", text: "Hi {{Name}}, a friendly reminder that invoice {{Invoice}} for {{Amount}} is due on {{Date}}. Reply here if you have any questions." },
  { title: "Win-back", text: "Hi {{Name}}, it’s been a while! We’ve added {{New}} since your last visit. Want me to send the details? Reply STOP to opt out." },
];

const faqs = [
  { q: "Can I send bulk WhatsApp messages for free?", a: "Yes. WhatsApp Business broadcast lists are free but reach only people who saved your number, 256 per list. Wapzen's Bulk Messages is free too: upload a contact sheet and it sends a personalised message to up to 5,000 numbers, one at a time, from your own number. The official Business API charges per message." },
  { q: "How many WhatsApp messages can I send at once?", a: "A WhatsApp Business broadcast list holds 256 contacts. Wapzen sends up to 5,000 numbers per send, one message at a time with a gap you choose, 30 seconds by default. On the Business API, Meta sets a daily limit for each number that rises as its quality stays high." },
  { q: "Can I send bulk messages without saving numbers?", a: "Not with broadcast lists, which deliver only to people who saved your number. Wapzen sends to the numbers in your spreadsheet without saving them as contacts, and so does the Business API. People who don't know your number are more likely to block or report you, so keep to your own customers." },
  { q: "Will I get banned for sending bulk WhatsApp messages?", a: "You can be. WhatsApp's terms forbid bulk and automated messaging outside its Business Platform, and numbers that many people block or report get restricted. The risk is lowest when you message your own customers, personalise each message, leave a gap between sends, and stop when people ask." },
  { q: "What's a safe gap between bulk messages?", a: "WhatsApp doesn't publish one. Wapzen defaults to 30 seconds between messages and accepts anything from 10 seconds to an hour. For a new number or a list you haven't messaged before, a longer gap and a smaller first batch are safer." },
  { q: "Can I send images or PDFs in bulk?", a: "Wapzen's Bulk Messages sends text for now, up to 4,096 characters, with links if you need them. To share a catalogue or PDF, send a text that invites a reply, and send the file to the people who answer." },
  { q: "Is there an unlimited free WhatsApp bulk sender?", a: "No option is truly unlimited and safe. Wapzen charges nothing and has no monthly message cap, but each send holds up to 5,000 numbers and goes out one at a time, because sending faster is what gets numbers restricted." },
];

const sources = [
  { label: "WhatsApp Terms of Service", href: "https://www.whatsapp.com/legal/terms-of-service" },
  { label: "Meta: messaging limits", href: "https://developers.facebook.com/docs/whatsapp/messaging-limits" },
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
];

const sections = [
  {
    id: "options",
    title: "Four ways to send bulk WhatsApp messages",
    body: <>
      <p>There are four ways to send one message to many people on WhatsApp. Three of them can be free. They differ in how many people you reach, whether the message is personal, and how much risk you put on your number.</p>
      <Comparison caption="Ways to send bulk WhatsApp messages compared" columns={["Broadcast lists", "Browser extensions", "Business API", "Wapzen Bulk Messages"]} rows={options} />
    </>,
  },
  {
    id: "broadcast-lists",
    title: "1. WhatsApp Business broadcast lists",
    body: <>
      <p>The WhatsApp Business app has broadcast lists built in. Each person gets your message in a private chat, as if you’d sent it to them alone. It’s free, and it’s the safest route, with two limits:</p>
      <ul>
        <li><strong>256 contacts per list.</strong> You can make several lists, but each send goes to one list.</li>
        <li><strong>Only people who saved your number receive it.</strong> Everyone else gets nothing, and you aren’t told.</li>
      </ul>
      <p>To make one on Android, tap the three-dot menu and choose <strong>New broadcast</strong>; on iPhone, look for <strong>Broadcast lists</strong> in the Chats tab. Then pick your contacts. Broadcast lists work well for regular customers who already have you saved. They don’t reach new leads or anyone you haven’t saved yourself.</p>
    </>,
  },
  {
    id: "extensions",
    title: "2. Free browser extensions: why they’re risky",
    body: <>
      <p>Search for a free WhatsApp bulk sender and most results are Chrome extensions. They automate WhatsApp Web in your browser, typing and sending each message as if you clicked. They’re easy to start with, but:</p>
      <ul>
        <li><strong>They send at machine speed</strong> unless you slow them down, and a burst of identical messages is the pattern WhatsApp flags.</li>
        <li><strong>They read your WhatsApp.</strong> An extension that controls WhatsApp Web can see every chat in it.</li>
        <li><strong>Your browser must stay open</strong> for the whole send, on a computer that doesn’t sleep.</li>
        <li><strong>Free tiers are small,</strong> and the useful features such as attachments, gaps and personalisation usually sit behind a paid upgrade.</li>
      </ul>
    </>,
  },
  {
    id: "api",
    title: "3. The official WhatsApp Business API",
    body: <>
      <p>For marketing to large opted-in lists, the Business API is the official route. You send pre-approved templates through a provider such as WATI, AiSensy or Interakt. It isn’t free: Meta charges for <strong>every delivered marketing message</strong> (₹0.8631 per message in India, $0.025 in the US), on top of the provider’s plan. Meta also limits how many people a new number can message each day, and raises the limit as your quality rating stays high.</p>
      <p>If you send tens of thousands of offers a month, this is where you should be. See <Link href="/blog/is-whatsapp-business-api-free">is the WhatsApp Business API free?</Link> for what it costs.</p>
    </>,
  },
  {
    id: "wapzen",
    title: "4. Send bulk messages free with Wapzen",
    body: <>
      <p>Wapzen’s <strong>Bulk Messages</strong> sends one personalised message to everyone on a contact sheet, from your own WhatsApp number, one at a time. It runs on Wapzen’s servers, so you can close your laptop. It’s free, like the rest of Wapzen.</p>
      <ol>
        <li><strong>Link your WhatsApp number</strong> by QR code or pairing code, if you haven’t already.</li>
        <li><strong>Upload your contacts:</strong> Excel (.xlsx or .xls), CSV, OpenDocument, or a text file with one number per line. Wapzen finds the phone column and adds your country code to local numbers.</li>
        <li><strong>Write the message</strong> with placeholders from your sheet’s columns, such as <code>{"{{Name}}"}</code> or <code>{"{{Order}}"}</code>. Save it as a template to reuse.</li>
        <li><strong>Pick the gap</strong> between messages: 30 seconds by default, anywhere from 10 seconds to an hour.</li>
        <li><strong>Start the send.</strong> Watch each recipient’s status, and pause, resume or cancel at any time. Numbers that aren’t on WhatsApp are marked failed instead of retried.</li>
      </ol>
      <p>At the default gap, 500 contacts take a little over four hours. Each send holds up to 5,000 numbers, and every message is saved to that contact’s conversation in your dashboard.</p>
      <InlineCta title="Send your first bulk message free" body="Upload a contact sheet, personalise the message, and let your AI agent answer the replies." />
    </>,
  },
  {
    id: "avoid-ban",
    title: "How to send bulk messages without getting banned",
    body: <>
      <p>WhatsApp’s terms forbid bulk and automated messaging outside its Business Platform. That covers browser extensions, linked-device tools and Wapzen alike, so no free sender is risk-free. What gets numbers restricted in practice is people blocking and reporting them. This checklist keeps that low:</p>
      <ul>
        <li><strong>Message only people who know you:</strong> customers, enquiries, members, people who gave you their number for this.</li>
        <li><strong>Personalise every message.</strong> Use the person’s name and something specific to them. A thousand identical messages look like spam, because they are.</li>
        <li><strong>Keep a gap between sends,</strong> and use a longer one for a big list.</li>
        <li><strong>Start small</strong> on a new number or a new list: send to 50 people, watch the replies, then continue.</li>
        <li><strong>Ask something worth answering.</strong> Replies tell WhatsApp people want your messages.</li>
        <li><strong>Offer a way out.</strong> End promotional messages with “Reply STOP to opt out”, and remove those people from the list.</li>
        <li><strong>Skip bare links and URL shorteners</strong> in a first message.</li>
        <li><strong>Fill in your business profile</strong> with your name, logo and address, so people recognise you.</li>
        <li><strong>Don’t send late at night,</strong> and stop if blocks or angry replies pile up.</li>
      </ul>
      <Note>For large marketing campaigns to people who opted in, use the official Business API. Wapzen’s Bulk Messages is built for messaging your own customers, not for cold lists.</Note>
    </>,
  },
  {
    id: "templates",
    title: "8 bulk message templates to copy",
    body: <>
      <p>Each one uses placeholders from your sheet. Rename them to match your column headers, and keep the question at the end, because replies help your number’s standing.</p>
      <Samples items={templates} />
    </>,
  },
  {
    id: "replies",
    title: "What happens when people reply",
    body: <>
      <p>This is where a free bulk sender usually leaves you alone with hundreds of replies. On Wapzen, replies reach your <strong>AI agent</strong>, which answers each one from your instructions and knowledge base, in the customer’s language, and can take an order with the Take Order tool. Every reply also appears in your dashboard, so you can step in yourself.</p>
      <p>One thing to set up first: the AI agent doesn’t see the bulk message itself when a contact replies. Put the offer’s details, such as product, price and end date, in the agent’s instructions or knowledge base before you send, so it can answer “Is this still on?” correctly.</p>
      <p>New to the AI agent? Read <Link href="/blog/free-whatsapp-ai-agent">free WhatsApp AI agent</Link> to set it up.</p>
    </>,
  },
];

export default function WhatsAppBulkMessageSenderFreePage() {
  return <BlogPost
    href={href}
    heading={<>Free WhatsApp bulk message sender.<br /><span>Without losing your number.</span></>}
    lead="You can send one message to hundreds of customers on WhatsApp without paying per message, but the free routes differ a lot in reach and in risk. Here are the four options, how to avoid a ban, eight templates to copy, and how to let AI answer the replies."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Free options:</strong> WhatsApp Business broadcast lists (256 per list, only people who saved your number), browser extensions (risky), and Wapzen Bulk Messages (up to 5,000 numbers per send, personalised). The official API charges per message.</>,
        <><strong>Ban risk is real:</strong> WhatsApp’s terms forbid bulk messaging outside its Business Platform, and numbers get restricted when people block or report them. Message only your own customers.</>,
        <><strong>Send it safely:</strong> personalise each message, keep a gap between sends (Wapzen defaults to 30 seconds), start small, and let people opt out.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/free-whatsapp-ai-agent", "/blog/whatsapp-order-confirmation-messages"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Send bulk messages free.<br /><span>Let AI answer the replies.</span></>, body: "Upload your customer list, personalise one message, and send it from your own WhatsApp number. Your AI agent handles the conversations." }}
  />;
}
