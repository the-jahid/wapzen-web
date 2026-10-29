import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Samples } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp business away message not working" (105, 5/5), "whatsapp
// away message example" (73), "whatsapp business away message" (65, 5/5),
// "…example" (54), "whatsapp business auto reply" / "whatsapp ai auto reply"
// (50, 5/5), "whatsapp away message" (49, 5/5), "…not showing" (42), "away
// message examples" / "out of office message whatsapp" / "whatsapp holiday
// message" (40), "…copy and paste" (36), autocomplete 2026-10-30
// (docs/seo-blog-playbook-research.mjs). The title promises 30 examples: the
// five lists in `groups` must add up to that. Setup facts come from WhatsApp's
// Help Center; Wapzen has no reply schedule, so it answers until paused.
const href = "/blog/whatsapp-away-message";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const compare = [
  ["What it sends", "The same text you wrote, every time", "An answer to what the customer asked"],
  ["When", "Always, on a schedule, or outside business hours", "Every text message, day and night, until you pause it"],
  ["Answers questions", "No: it says you’ll reply later", "Yes, from your knowledge base"],
  ["Takes bookings or orders", "No", "Yes, with a tool that saves them"],
  ["Personal WhatsApp", "No, WhatsApp Business app only", "Yes, personal or Business number"],
  ["Cost", "Free", "Wapzen is free right now"],
];

type Sample = { title: string; text: string };

const groups: Array<{ name: string; samples: Sample[] }> = [
  {
    name: "After hours and weekends",
    samples: [
      { title: "Closed for the day", text: "Thanks for your message! We’re closed for today and back at [9 am] tomorrow. Leave your question here and we’ll reply first thing." },
      { title: "With your hours", text: "Hi! You’ve reached [Business] outside our hours. We’re open [Mon–Sat, 10 am–7 pm] and will answer as soon as we’re back." },
      { title: "Weekend", text: "Thanks for getting in touch! Our team is off for the weekend. We’ll reply on [Monday] morning; your message is safe with us." },
      { title: "Late night", text: "It’s late here, so we’re offline 🌙 We’ll reply from [9 am]. If it’s about an order, send your order number and we’ll check it first." },
      { title: "With a link", text: "We’re closed right now, but you can browse our [prices / catalogue / menu] here: [link]. We’ll reply to your message when we open at [10 am]." },
      { title: "With an urgent number", text: "Thanks for your message. We’re closed until [8 am]. For anything urgent, please call [number]; otherwise we’ll reply here in the morning." },
    ],
  },
  {
    name: "Holidays, vacations and festivals",
    samples: [
      { title: "Public holiday", text: "Hi! We’re closed today for [the public holiday] and back on [Thursday]. We’ll reply to every message then. Enjoy the day!" },
      { title: "Holiday season", text: "Happy holidays from [Business]! 🎄 We’re closed from [24 Dec] to [1 Jan]. Orders placed now ship on [2 Jan], and we’ll answer messages then." },
      { title: "Annual vacation", text: "Thanks for your message! We’re on our annual break until [date]. We’ll reply as soon as we’re back, in the order messages arrived." },
      { title: "Festival", text: "Wishing you a happy [festival]! ✨ We’re closed on [date] and back on [date]. Your message is saved and we’ll reply then." },
      { title: "Special hours", text: "Hi! During [Ramadan / the festive season] our hours are [11 am–5 pm and 9 pm–1 am]. We’ll reply within those times." },
      { title: "Out of office", text: "I’m travelling until [date] with limited access to messages. For anything urgent, please contact [Name] on [number]. I’ll reply when I’m back." },
    ],
  },
  {
    name: "Busy and short breaks",
    samples: [
      { title: "With a customer", text: "Thanks for your message! I’m with a customer right now and will reply within [30 minutes]." },
      { title: "Lunch break", text: "We’re on our lunch break until [2 pm]. We’ll reply as soon as we’re back!" },
      { title: "In a meeting", text: "I’m in meetings for the next couple of hours. I’ll read your message and reply by [4 pm]." },
      { title: "On site", text: "Hi! I’m out on a job and can’t type right now. I’ll reply when I’m done, usually within [2 hours]. For emergencies, please call." },
      { title: "Sale day", text: "Thanks for your patience! It’s [sale day] and we’re getting lots of messages, so replies may take a little longer. Every message will be answered." },
    ],
  },
  {
    name: "By industry",
    samples: [
      { title: "Online store", text: "Thanks for messaging [Store]! We’re offline now and back at [10 am]. For an order, send your order number and we’ll check it first thing. Shop anytime: [link]" },
      { title: "Restaurant", text: "Thanks for your message! The kitchen is closed for now. We’re open [12–11 pm] daily, and you can see the menu here: [link]." },
      { title: "Clinic", text: "Thank you for contacting [Clinic]. We’re closed now and open at [9 am]. For emergencies, please call [emergency number] right away." },
      { title: "Salon", text: "Hi! 💇 We’re closed right now. Tell us the service and day you’d like, and we’ll confirm your booking when we open at [10 am]." },
      { title: "Real estate", text: "Thanks for your enquiry! Our agents are out right now. Tell us what you’re looking for (buy or rent, area, budget) and we’ll call you back by [time]." },
      { title: "Travel agency", text: "Thanks for contacting [Agency]! We’re away until [9 am]. Share your destination, dates and number of travellers, and we’ll send options in the morning." },
      { title: "Coaching centre", text: "Thank you for contacting [Institute]! The office is closed now and opens at [10 am]. Share the course you’re interested in, and we’ll send the fees and batch timings." },
      { title: "Repairs and home services", text: "Thanks for your message! We’re off for the night. Describe the problem and your area, and we’ll reply with a visit time at [8 am]. Gas leak? Call [number] now." },
    ],
  },
  {
    name: "Personal and freelancers",
    samples: [
      { title: "Personal busy", text: "Hey! Can’t reply right now, but I’ll get back to you soon. Call if it’s urgent." },
      { title: "Freelancer", text: "Thanks for reaching out! I’m working on a project deadline and reply to new messages by [6 pm]. Feel free to send the details of what you need." },
      { title: "Sick day", text: "Hi, I’m off sick today and not checking messages. I’ll reply when I’m back, hopefully [tomorrow]. Thanks for understanding!" },
      { title: "Focus time", text: "I’m in focus mode until [3 pm] and not checking WhatsApp. I’ll reply after that." },
      { title: "New number", text: "Thanks for your message! Please note I now use [new number] for [work]. Message me there and I’ll reply sooner." },
    ],
  },
];

const faqs = [
  { q: "How do I set an away message on WhatsApp Business?", a: "Open the WhatsApp Business app, go to the Tools tab (in some versions, Settings › Business tools), tap Away message, and turn on Send away message. Edit the text, pick a schedule (always, a custom schedule, or outside business hours), choose recipients, and tap Save." },
  { q: "Why is my WhatsApp Business away message not working?", a: "Most often the schedule doesn't match: 'Outside of business hours' only works once your business hours are set in your profile. Also check the Recipients setting, because a saved test phone is excluded by 'Everyone not in address book', and that your phone is online, since WhatsApp needs an internet connection to send it." },
  { q: "Can I set an away message on personal WhatsApp?", a: "No. Away and greeting messages are WhatsApp Business features; the regular WhatsApp app has no auto reply. You can move the number to the free WhatsApp Business app, or link it to an AI agent such as Wapzen, which replies on personal numbers too." },
  { q: "What's the difference between an away message and a greeting message?", a: "An away message replies when someone writes while you're away, on the schedule you set. A greeting message welcomes people who message you for the first time or after 14 days of no messages. Both send fixed text you write in advance." },
  { q: "Can an away message answer customers' questions?", a: "No, it sends the same text to everyone. To answer questions like prices, stock, and timings automatically, use an AI auto-reply that reads your knowledge base and replies to what each customer actually asked." },
  { q: "Will customers get two replies if I use an away message and an AI agent?", a: "Yes, if both are on: WhatsApp sends your away text and the AI sends its answer. When an AI agent is answering your number, turn the away message off, or keep the AI paused during the hours you want the away message to cover." },
];

const sources = [
  { label: "WhatsApp Help Center: How to use away messages", href: "https://faq.whatsapp.com/smbi/account-and-profile/how-to-use-away-messages" },
  { label: "WhatsApp Help Center: How to use greeting messages", href: "https://faq.whatsapp.com/501866148528310" },
];

const sections = [
  {
    id: "difference",
    title: "Away message vs AI auto-reply",
    body: <>
      <p>An <strong>away message</strong> is the WhatsApp Business app’s built-in auto reply: a fixed text it sends when someone writes while you’re away. An <strong>AI auto-reply</strong> reads the message and answers it. Both reply instantly; only one of them answers the question:</p>
      <Comparison caption="WhatsApp away message compared with an AI auto-reply" columns={["Away message", "AI auto-reply"]} rows={compare} />
      <p>An away message is the right tool when your answers are always custom, like quotes or bookings that need you, and people only need to know you’ll reply. When most messages are the same few questions, an AI auto-reply answers them before morning.</p>
    </>,
  },
  {
    id: "setup",
    title: "How to set up an away message in WhatsApp Business",
    body: <>
      <ol>
        <li>Open the <strong>WhatsApp Business</strong> app and go to the <strong>Tools</strong> tab. In some versions, it’s under <strong>Settings › Business tools</strong>.</li>
        <li>Tap <strong>Away message</strong> and turn on <strong>Send away message</strong>.</li>
        <li>Tap the message to edit it. Paste one of the examples below and fill in the brackets.</li>
        <li>Tap <strong>Schedule</strong>: <strong>Always send</strong>, <strong>Custom schedule</strong> for set dates and times, or <strong>Outside of business hours</strong>, which appears once you’ve set your hours in the business profile.</li>
        <li>Tap <strong>Recipients</strong>: everyone, everyone not in your address book, everyone except the contacts you pick, or only the contacts you pick.</li>
        <li>Tap <strong>Save</strong>, then test it from a phone that isn’t excluded by your recipients setting.</li>
      </ol>
      <p>“Outside of business hours” is the set-and-forget option: set your opening hours once in the profile, and the away message covers every evening, weekend, and closed day.</p>
    </>,
  },
  {
    id: "examples",
    title: "30 WhatsApp away message examples",
    body: <>
      <p>Copy any of these and change the parts in brackets. Keep yours short: say when you’ll reply, and give people something useful to do meanwhile, like a link or the details to send.</p>
      {groups.map((group) => <div key={group.name}>
        <h3>{group.name}</h3>
        <Samples items={group.samples} />
      </div>)}
      <p>For greeting messages, the welcome new customers get, see <Link href="/blog/whatsapp-business-greeting-message">40 WhatsApp Business greeting message examples</Link>.</p>
    </>,
  },
  {
    id: "not-working",
    title: "WhatsApp Business away message not working? Check these",
    body: <>
      <ol>
        <li><strong>The schedule.</strong> “Outside of business hours” needs business hours in your profile, and a day marked open all day never triggers it. With a custom schedule, check the dates and the time and time zone on your phone.</li>
        <li><strong>The recipients.</strong> With “Everyone not in your address book”, saved contacts never get it, and that includes your own test phone if it’s saved.</li>
        <li><strong>Your phone is offline.</strong> WhatsApp says the phone needs an internet connection for away messages to send. A phone that’s switched off or out of data sends nothing.</li>
        <li><strong>Meta Business Agent.</strong> WhatsApp switches greeting messages off while Meta’s AI agent is connected. If you’ve connected it, check that your away message is still on. See <Link href="/blog/whatsapp-business-ai-agent">the WhatsApp Business AI agent</Link>.</li>
        <li><strong>The option isn’t there.</strong> Away messages exist only in the <strong>WhatsApp Business</strong> app, not in regular WhatsApp. If you’re on personal WhatsApp, see <Link href="/blog/whatsapp-auto-reply-personal-account">auto reply on a personal account</Link>.</li>
        <li><strong>The app itself.</strong> Update WhatsApp Business, turn the away message off and on, and restart the phone.</li>
      </ol>
    </>,
  },
  {
    id: "ai-auto-reply",
    title: "When an AI auto-reply works better",
    body: <>
      <p>Here is the same late-night message, answered both ways:</p>
      <blockquote>“Do you have the black runners in size 9, and can you deliver to Pune by Friday?”</blockquote>
      <p><strong>Away message:</strong> “Thanks for your message! We’re closed now and will reply from 10 am.” The customer waits, and may buy elsewhere tonight.</p>
      <p><strong>AI auto-reply:</strong> “Yes, the black runners are in stock in size 9 at ₹2,499. Delivery to Pune takes 2–3 days, so an order tonight should arrive by Friday. Want the link?”</p>
      <p>Wapzen does the second one. Upload your prices and policies to a knowledge base, create a chat agent, and link your WhatsApp number, Business or personal. It answers every text message from the knowledge base and says a person will reply when it doesn’t know.</p>
      <ul>
        <li><strong>Turn the away message off</strong> when the AI is live, or customers get both: your away text and the AI’s answer.</li>
        <li><strong>There’s no schedule yet.</strong> The AI answers day and night until you pause it. To use it only after hours, pause it when you open and switch it back on when you close.</li>
        <li><strong>It reads text only.</strong> Voice notes, photos, and group chats get no AI reply, and wait for you as usual.</li>
      </ul>
      <InlineCta title="Replies that answer, not just “we’re away”" body="Free right now: an AI auto-reply on your WhatsApp number that answers customers’ questions, day and night." />
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. It links your number as a device, so there’s no Business API account and no Meta message fees for its replies.</Note>
    </>,
  },
];

export default function WhatsAppAwayMessagePage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp away message vs AI auto-reply.<br /><span>30 examples, and the fixes.</span></>}
    lead="30 WhatsApp away message examples to copy, for after hours, holidays, busy times, and every kind of business. Plus how to set one up in WhatsApp Business, why it stops working, and when an AI auto-reply that answers the question works better."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Away message:</strong> fixed text the WhatsApp Business app sends when you’re away. Free, but it only says you’ll reply later.</>,
        <><strong>Not working?</strong> Check the schedule and business hours, the recipients setting, and that your phone is online.</>,
        <><strong>AI auto-reply:</strong> answers each question from your knowledge base, on Business or personal WhatsApp. Turn the away message off when it’s live.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-business-greeting-message", "/blog/whatsapp-auto-reply-personal-account"]}
    product="/whatsapp-auto-reply"
    cta={{ heading: <>Away from your phone.<br /><span>Not away from customers.</span></>, body: "Create a free AI agent, add your prices and policies, and link your WhatsApp number. It answers every message right away." }}
  />;
}
