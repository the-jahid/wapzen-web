import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Samples } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp business greeting message example" (76), "whatsapp
// business greeting message" (68, 5/5), "…welcome message example" (56),
// "…greeting message not working" (54), "…welcome message" (53, 5/5),
// autocomplete 2026-10-28. The title promises 40 examples: `general` plus
// every list in `industries` must add up to that. Setup steps and the
// "not working" causes come from WhatsApp's Help Center.
const href = "/blog/whatsapp-business-greeting-message";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

type Sample = { title: string; text: string };

const general: Sample[] = [
  { title: "Friendly and simple", text: "Hi there 👋 Thanks for messaging [Business]! How can we help you today?" },
  { title: "With your reply time", text: "Hello and welcome to [Business]! We usually reply within [1 hour] during business hours ([9 am–6 pm], Mon–Sat). Tell us what you need and we’ll get back to you soon." },
  { title: "With options", text: "Hi! 👋 Welcome to [Business]. To help us reply faster, tell us what you’re looking for:\n- Prices\n- Delivery or pickup\n- Something else" },
  { title: "Personal touch", text: "Hi, this is [Name] from [Business]. Thanks for reaching out! Send me your question and I’ll get back to you personally." },
  { title: "With a link", text: "Thanks for contacting [Business]! While you wait for our reply, you can browse everything we offer here: [link]" },
  { title: "Short and formal", text: "Thank you for contacting [Business]. A member of our team will reply shortly." },
  { title: "Two languages", text: "Hi! 👋 Welcome to [Business]. We reply in English and [Hindi]: write in whichever you prefer." },
  { title: "Holiday season", text: "Hi! Thanks for messaging [Business] 🎄 We’re open through the holidays with shorter hours: [hours]. How can we help?" },
];

const industries: Array<{ name: string; samples: Sample[] }> = [
  {
    name: "Online store",
    samples: [
      { title: "Product questions", text: "Hi! Welcome to [Store] 🛍️ Ask us anything about our products, sizes or delivery, and we’ll help you find the right one." },
      { title: "Order status", text: "Hello! Thanks for messaging [Store]. If it’s about an order, please share your *order number* and we’ll check it right away." },
      { title: "First-order offer", text: "Welcome to [Store]! 🎉 New customers get [10% off] their first order with code *WELCOME10*. What can we help you find today?" },
      { title: "Delivery and COD", text: "Hi there! We deliver across [city] in [2–4 days], and cash on delivery is available. What would you like to order?" },
      { title: "Catalog", text: "Hi! 👋 Tap the shop icon at the top of this chat to see our catalog with prices. Questions about a product? Just ask here." },
    ],
  },
  {
    name: "Restaurant and café",
    samples: [
      { title: "Menu and orders", text: "Hi! Welcome to [Restaurant] 🍽️ Here’s our menu: [link]. Send your order with your address and we’ll confirm it with the total." },
      { title: "Table bookings", text: "Hello! Thanks for messaging [Restaurant]. To book a table, send the date, time and number of guests, and we’ll confirm availability." },
      { title: "Hours and delivery", text: "Hi! [Restaurant] is open [11 am–11 pm] every day, with delivery within [5 km]. What can we get you?" },
      { title: "Café pickup", text: "Hey! ☕ Welcome to [Café]. Ask about today’s specials, or place a pickup order and we’ll have it ready in [15 minutes]." },
    ],
  },
  {
    name: "Clinic and dental practice",
    samples: [
      { title: "Appointments", text: "Hello, thank you for contacting [Clinic]. To book an appointment, please share the patient’s name, the service you need, and a preferred day and time." },
      { title: "Emergency notice", text: "Welcome to [Clinic]. We reply to messages during clinic hours ([9 am–7 pm]).\n\n*For a medical emergency, call [emergency number] instead of messaging.*" },
      { title: "Dental practice", text: "Hi! Thanks for reaching out to [Dental Clinic] 🦷 Ask us about treatments, prices or appointments, and our team will reply shortly." },
      { title: "Test reports", text: "Hello from [Clinic]. If you’re asking about test reports, please share the patient’s full name and the test date so we can find them." },
    ],
  },
  {
    name: "Salon and spa",
    samples: [
      { title: "Salon booking", text: "Hi there! 💇 Welcome to [Salon]. Tell us the service and the day you’d like, and we’ll find you a slot." },
      { title: "Price list", text: "Welcome to [Salon]! ✨ Here’s our price list: [link]. Reply with the service you’d like to book." },
      { title: "Spa", text: "Thank you for contacting [Spa] 🌿 Share your preferred treatment, date and time, and we’ll confirm your booking." },
    ],
  },
  {
    name: "Real estate",
    samples: [
      { title: "Buy, rent or sell", text: "Hello! Thanks for contacting [Agency]. Are you looking to *buy*, *rent* or *sell*? Share your budget and preferred area, and we’ll send matching listings." },
      { title: "Listing enquiry", text: "Hi! Thanks for your interest in our listing. Please tell us which property you saw and a good time to call you." },
      { title: "Site visits", text: "Welcome to [Agency] 🏡 To arrange a site visit, share the property you’re interested in and your preferred date." },
    ],
  },
  {
    name: "Education and coaching",
    samples: [
      { title: "Course enquiries", text: "Hi! Welcome to [Institute] 📚 Ask us about courses, fees and batch timings. Which course are you interested in?" },
      { title: "Free demo class", text: "Hello! Thanks for messaging [Academy]. Would you like to book a free demo class? Share the student’s name, grade and a preferred time." },
      { title: "Admissions", text: "Welcome to [School] admissions. Our team replies [Mon–Fri, 9 am–4 pm]. Please share the student’s name and the grade you’re applying for." },
    ],
  },
  {
    name: "Travel and hotels",
    samples: [
      { title: "Hotel bookings", text: "Hello and welcome to [Hotel] 🏨 For bookings, share your check-in and check-out dates and the number of guests." },
      { title: "Tour packages", text: "Hi! Thanks for contacting [Travel Agency] ✈️ Where would you like to go, and when? We’ll send you our best packages." },
      { title: "Guest information", text: "Welcome to [Guesthouse]! Check-in is from [2 pm] and check-out by [11 am]. Ask us anything about your stay." },
    ],
  },
  {
    name: "Home and local services",
    samples: [
      { title: "Quotes", text: "Hi! Thanks for contacting [Business]. Describe the problem, send a photo if you can, and tell us your area, and we’ll share a quote." },
      { title: "Visit booking", text: "Hello from [Business] 🔧 We’re available [Mon–Sat, 8 am–8 pm]. Share your address and a preferred time for the visit." },
      { title: "Urgent jobs", text: "Thanks for your message! For urgent repairs, call us on [phone number]. For quotes and bookings, reply here and we’ll get back to you within [2 hours]." },
    ],
  },
  {
    name: "Gym and fitness",
    samples: [
      { title: "Memberships", text: "Hey! 💪 Welcome to [Gym]. Ask us about memberships, class timings or a free trial session." },
      { title: "Classes", text: "Hi! Thanks for reaching out to [Studio]. Want to try a class? Tell us which one and a day that suits you." },
    ],
  },
  {
    name: "Agencies and professional services",
    samples: [
      { title: "Consultations", text: "Hello, thank you for contacting [Firm]. Please briefly describe what you need help with, and we’ll arrange a call with the right person." },
      { title: "New projects", text: "Welcome to [Agency]. We’d love to hear about your project. Share a few details and your budget, and we’ll reply within one working day." },
    ],
  },
];

const kinds = [
  ["When it’s sent", "A customer’s first message, or their first after 14 days of no messages", "Messages that arrive outside the hours you set", "Every message"],
  ["What it says", "The same fixed text", "The same fixed text", "A reply to that customer’s question"],
  ["Answers the question", "No", "No", "Yes, from your knowledge base"],
  ["Where you set it", "WhatsApp Business app › Tools", "WhatsApp Business app › Tools", "An AI agent such as Wapzen, on Business or personal numbers"],
];

const faqs = [
  { q: "What is a greeting message in WhatsApp Business?", a: "It's an automatic message the WhatsApp Business app sends when a customer messages you for the first time, or for the first time after 14 days without messages. It welcomes them and tells them what happens next, while you get to the chat." },
  { q: "How do I set up a greeting message on WhatsApp Business?", a: "Open the Tools tab in the WhatsApp Business app, tap Greeting message, and turn on Send greeting message. Tap the message to edit it, tap OK, choose who receives it under Recipients, and save." },
  { q: "Why is my WhatsApp Business greeting message not working?", a: "Most often the customer has messaged you in the last 14 days, so they don't get it again, or your Recipients setting leaves them out. WhatsApp also switches greeting messages off while Meta Business Agent is connected, and your phone needs an internet connection. Updating the app and turning the greeting off and on again can help." },
  { q: "What's the difference between a greeting message and an away message?", a: "A greeting message welcomes customers on their first message, or their first after 14 quiet days. An away message replies when someone messages outside the hours you set. Both are fixed text set in the WhatsApp Business app's Tools tab, and you can use both." },
  { q: "Can I set a greeting message on personal WhatsApp?", a: "No. Greeting and away messages are WhatsApp Business features, and personal WhatsApp has no auto reply. To reply automatically on a personal number, link it to an AI agent such as Wapzen." },
  { q: "Can I use bold text and emojis in a greeting message?", a: "Yes. Emojis work as normal, and WhatsApp's formatting markers work too: *bold*, _italic_, and a hyphen and space for bullet points. Our free WhatsApp text formatter previews them before you paste." },
  { q: "How long should a greeting message be?", a: "Short: two to four lines. Welcome the customer, say when you'll reply, and ask what they need. Customers read greetings on a phone, and long ones get skipped." },
];

const sources = [
  { label: "WhatsApp Help Center: How to use greeting messages", href: "https://faq.whatsapp.com/501866148528310" },
];

const sections = [
  {
    id: "what-it-is",
    title: "What is a WhatsApp Business greeting message?",
    body: <>
      <p>A <strong>greeting message</strong> is an automatic message the WhatsApp Business app sends when a customer messages you <strong>for the first time</strong>, or for the first time <strong>after 14 days</strong> without messages. Someone who has messaged you in the last 14 days won’t get it again.</p>
      <p>It does one job: tell the customer they’re in the right place and what happens next, while you get to the chat. It doesn’t answer their question. That’s the difference from the other two kinds of automatic reply:</p>
      <Comparison caption="WhatsApp Business greeting messages compared with away messages and AI replies" columns={["Greeting message", "Away message", "AI agent"]} rows={kinds} />
    </>,
  },
  {
    id: "set-up",
    title: "How to set up a greeting message",
    body: <>
      <ol>
        <li>Open the <strong>WhatsApp Business</strong> app and go to the <strong>Tools</strong> tab. In some versions, it’s under Settings › Business tools.</li>
        <li>Tap <strong>Greeting message</strong> and turn on <strong>Send greeting message</strong>.</li>
        <li>Tap the message to edit it, paste one of the examples below, fill in the brackets, and tap <strong>OK</strong>.</li>
        <li>Tap <strong>Recipients</strong> and choose who gets it: everyone, everyone not in your address book, or everyone except the contacts you pick.</li>
        <li>Tap <strong>Save</strong>, then test it by messaging your business number from a phone that hasn’t messaged it in the last 14 days.</li>
      </ol>
      <p>“Everyone not in your address book” is a good default: new customers get the welcome, while friends and suppliers you’ve saved don’t.</p>
      <p>It’s also the first reply a new customer gets after scanning a <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR code</Link> on your menu, shop window, or packaging, so it’s worth getting right. You can make that code for free, with your logo.</p>
    </>,
  },
  {
    id: "tips",
    title: "How to write a good greeting message",
    body: <>
      <ul>
        <li><strong>Name your business</strong> in the first line, so the customer knows they reached the right place.</li>
        <li><strong>Say when you’ll reply,</strong> such as “within an hour during business hours”. It stops people sending “hello?” three times.</li>
        <li><strong>Ask for what you need</strong> to answer: an order number, a date, the service. It saves a round of messages.</li>
        <li><strong>Keep it to two to four lines,</strong> with one link at most.</li>
        <li><strong>Use formatting sparingly:</strong> bold for the one thing that matters, a short bulleted list for options. The free <Link href="/tools/whatsapp-text-formatter">WhatsApp text formatter</Link> shows how it will look before you paste it.</li>
      </ul>
    </>,
  },
  {
    id: "examples",
    title: "General greeting message examples",
    body: <>
      <p>Replace anything in [brackets] with your own details. Each one is short enough to read at a glance on a phone.</p>
      <Samples items={general} />
    </>,
  },
  {
    id: "by-industry",
    title: "Greeting message examples by industry",
    body: <>
      <p>Thirty-two more, written for what customers in each kind of business usually ask first.</p>
      {industries.map((industry) => <div key={industry.name}>
        <h3>{industry.name}</h3>
        <Samples items={industry.samples} />
      </div>)}
    </>,
  },
  {
    id: "not-working",
    title: "Greeting message not working? Check these",
    body: <>
      <ol>
        <li><strong>The 14-day rule.</strong> Anyone who messaged you in the last 14 days won’t get the greeting. Testing from your own second phone usually trips this: use a number that hasn’t messaged you in two weeks.</li>
        <li><strong>Recipients.</strong> With “Everyone not in your address book”, saved contacts never get it, and that includes your test phone if it’s saved.</li>
        <li><strong>Meta Business Agent.</strong> WhatsApp turns greeting messages off while Meta’s AI agent is connected. Disconnect it, then turn the greeting back on. Our <Link href="/blog/whatsapp-business-ai-agent">guide to the WhatsApp Business AI agent</Link> shows how.</li>
        <li><strong>Internet connection.</strong> Your phone needs to be online for the greeting to go out.</li>
        <li><strong>The app itself.</strong> Update WhatsApp Business, turn the greeting off and on again, and restart the phone.</li>
      </ol>
    </>,
  },
  {
    id: "beyond-greetings",
    title: "When a greeting message isn’t enough",
    body: <>
      <p>A greeting buys you time, but the customer’s question is still waiting. If the same questions arrive every day (prices, delivery, timings, availability), an <strong>AI agent</strong> can answer the question itself, in seconds, from your own price list and FAQ.</p>
      <p>Wapzen does this on the number you already use, linked by QR code, and it works on personal WhatsApp numbers too, which have no greeting or away messages at all. See <Link href="/whatsapp-auto-reply">WhatsApp auto reply</Link> for away message samples and the AI option side by side.</p>
      <InlineCta title="Go beyond a greeting" body="An AI agent that answers your customers’ actual questions on WhatsApp. Free right now, set up in about 15 minutes." />
      <Note>If an AI agent answers your chats, switch the greeting off or keep it to one line, so customers don’t get two messages at once.</Note>
    </>,
  },
];

export default function WhatsAppBusinessGreetingMessagePage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp Business greeting messages.<br /><span>{general.length + industries.reduce((sum, industry) => sum + industry.samples.length, 0)} examples to copy.</span></>}
    lead="Copy-and-paste greeting messages for every kind of business, from online stores and restaurants to clinics, salons and real estate agents. Plus how to set one up in WhatsApp Business, and what to check when it isn’t sending."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>A greeting message</strong> is sent automatically when a customer messages your WhatsApp Business number for the first time, or after 14 days without messages.</>,
        <><strong>Set it up</strong> in the WhatsApp Business app under Tools › Greeting message › Send greeting message.</>,
        <><strong>A good one</strong> names your business, says when you’ll reply, and asks what the customer needs, in two to four lines.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/what-is-a-whatsapp-chatbot", "/blog/whatsapp-auto-reply-personal-account"]}
    product="/whatsapp-auto-reply"
    cta={{ heading: <>Greet them, then answer them.<br /><span>Automatically.</span></>, body: "Create a free AI agent that replies to your customers’ WhatsApp questions from your own business info. No Business API, no credit card." }}
  />;
}
