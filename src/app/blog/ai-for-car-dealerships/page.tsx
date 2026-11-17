import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { InlineCta, Note, RowTable } from "@/components/blog/BlogPost";
import { DayTimeline, JobBoard, PlaybookPost, PromptFile, SetupSteps, Templates, VoiceCard, type TimelineItem } from "@/components/blog/PlaybookPost";

// Industry picked 2026-11-17 by docs/seo-blog-industry-pick-research.mjs: car dealers were
// third of 16 industries on phrases that name the industry, with the strongest single phrase,
// "ai for car dealerships" (282 in the pick run, 139 in the long-tail run, 8/8 sources). Long
// tail from docs/seo-blog-three-industries-research.mjs: "car dealership ai chatbot" 93,
// "ai bdc (for car dealerships)" 80, "ai receptionist for car dealerships" 80, "test drive
// booking" 80, "ai for car salesman" 80, "ai for car sales" 72, "car dealer whatsapp", "car
// sales follow up template", "best ai for car dealerships", "we buy cars whatsapp". Heavy
// WhatsApp dealer demand in Nigeria and South Africa. See docs/seo-research.md, "Industry
// pick 2026-11-17".
// Competitor facts read 2026-11-17: dealerai.com/pricing, CAD per rooftop/month: Chatbot $599
// (web chat, SMS, Facebook and Instagram messaging), Reach Lite $1,199, Reach $1,899, Reach Pro
// $2,499, voice add-on from $499 for 400 minutes; WhatsApp not listed on any plan. Matador,
// Impel and DriveCentric don't publish prices (Nobi's roundup + Matador's site); Nobi itself
// is website-only from $29/month for 500 messages.
// Copy rules (user, 2026-11-17): free, WhatsApp voice agent works (inbound calls and calling
// campaigns), no usage limits anywhere; never "unlimited" or "free forever". Voice CTA opens
// the team's WhatsApp (dashboard still shows VoiceUpdateNote). Honest product facts kept: no
// DMS/CRM link by itself, the chat agent never messages first, no trade-in valuations or
// finance approvals, Take Order is the test drive/trade-in form (built for orders: test it).
const href = "/blog/ai-for-car-dealerships";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to turn on the Wapzen voice agent for my car dealership's WhatsApp number.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const day: TimelineItem[] = [
  { time: "07:10", channel: "chat", from: "Buyer who saw a listing online", message: "Is the 2021 Corolla still available? What’s the last price?", outcome: "answered", reply: "Confirmed it’s on this morning’s stock list: 1.8 hybrid, automatic, 48,000 km, one owner, $14,900. Said offers are discussed with a sales advisor and offered a test drive." },
  { time: "08:30", channel: "chat", from: "Same buyer", message: "Send more pictures of the inside", outcome: "sent", reply: "Sent the interior photos and the spec sheet uploaded for that car." },
  { time: "09:45", channel: "photo", from: "Customer with a trade-in", message: "📷 Four photos of a 2017 Honda Civic: “How much will you give me for this?”", outcome: "request", reply: "Read the photos, asked for the mileage, service history and city, and saved a trade-in valuation request for the appraiser. It didn’t guess a price." },
  { time: "11:15", channel: "voice", from: "First-time buyer, voice note", message: "🎤 “Do you do finance? How much deposit do I need?”", outcome: "answered", reply: "Explained the partner banks and the 20% deposit the dealership listed, and said approval is up to the lender." },
  { time: "12:10", channel: "call", from: "New lead from a Facebook ad", message: "📞 Added to a calling campaign at 12:09", outcome: "call", reply: "The voice agent called the lead on WhatsApp straight away, asked what kind of car and budget they had in mind, and invited them to message the showroom for photos." },
  { time: "13:00", channel: "chat", from: "Buyer from 07:10", message: "Can I test drive the Corolla on Saturday at 11?", outcome: "request", reply: "Took the name, car, day and time, checked they hold a licence, read it back and, after a yes, saved the test drive request and pinged the sales manager’s WhatsApp." },
  { time: "15:30", channel: "call", from: "Caller on WhatsApp", message: "📞 “Where is the showroom, and are you open on Sunday?”", outcome: "call", reply: "The voice agent answered with the address, a landmark and the Sunday opening hours." },
  { time: "18:20", channel: "chat", from: "Buyer comparing dealers", message: "Another dealer gave me a better price. Can you beat it?", outcome: "handover", reply: "Said a sales advisor handles offers, didn’t promise a discount, and asked when suits the buyer for a call back." },
  { time: "21:45", channel: "chat", from: "Customer who bought last month", message: "The check engine light came on. Is this under warranty?", outcome: "handover", reply: "Explained the warranty terms the dealership wrote and said the service team will call first thing tomorrow." },
];

const prompt = `You are the WhatsApp sales assistant of Demo Motors, a used and new car dealership.
Say in your first message that you are the dealership's virtual assistant.
Reply in the customer's language, in two or three short sentences, and ask one question at a time.
Answer only from the stock list, prices, finance options, warranty terms, opening hours and location you were given. If a car isn't on the stock list, say so and offer similar cars that are. Never invent a car, a price, a discount, mileage or a finance rate.
Quote the listed price. If someone asks for a lower price, say a sales advisor discusses offers at the showroom or on a call, and offer a test drive.
To book a test drive, ask for their name, the car, the day and time, and whether they hold a driving licence. Repeat it back and send the request only after they say yes. Say a sales advisor will confirm.
For a trade-in, ask for photos, the year, mileage, service history and their city, then send a valuation request. Never give a trade-in value yourself.
Never promise finance approval. Never ask for ID, bank or card details in the chat.
Complaints, warranty claims and after-sales problems: apologise and say the service team will contact them.`;

const stock = `STOCK LIST, updated today at 9 am
2021 Toyota Corolla 1.8 Hybrid | automatic | 48,000 km | silver | one owner, full service history | $14,900
2019 Honda CR-V EX | automatic | 71,000 km | white | AWD, leather seats | $18,500
2020 Hyundai Tucson | automatic | 55,000 km | grey | reverse camera | $16,200
2018 Ford Ranger XLT double cab | manual | 96,000 km | blue | towbar | $21,000 | RESERVED
Prices include registration transfer.
Finance: from a 20% deposit through our partner banks, subject to approval.
Warranty: 3 months or 5,000 km on engine and gearbox for every used car.
Trade-ins welcome: valuation by our appraiser after an inspection.`;

const templates = [
  { title: "Same-day follow-up after an enquiry", when: "A few hours after a buyer asked about a car", text: "Hi James, thanks for asking about the 2021 Corolla today. It’s still here, and I can keep a test drive slot for you this Saturday. Would 10 am or 2 pm suit you?" },
  { title: "After a test drive", when: "The evening of the test drive", text: "Hi James, great to meet you today! If the Corolla is the one, we can have it serviced and ready by Thursday. Any questions about finance or your trade-in, just reply here." },
  { title: "Price drop message", when: "When a car the buyer asked about gets cheaper", text: "Hi Ade, the 2019 CR-V you asked about is now $17,900 (was $18,500). Would you like to see it this week?" },
  { title: "Buyer who went quiet", when: "A week after the last message", text: "Hi Priya, are you still looking for an SUV? Two new arrivals this week fit your budget. Shall I send you photos?" },
  { title: "Trade-in valuation ready", when: "When the appraiser has a figure", text: "Hi Sam, thanks for the photos of your Civic. Our appraiser can offer $7,200 towards your next car, subject to an inspection. Shall we book the inspection?" },
  { title: "Service reminder for a past buyer", when: "Before the car’s first service", text: "Hi Tom, your Corolla is due its first service with us next month. Reply here and we’ll book a day that suits you." },
];

const compare = [
  ["DealerAI", "From $599 CAD per rooftop a month (Chatbot plan); voice is an add-on from $499 CAD for 400 minutes", "Web chat, SMS, Facebook and Instagram messaging, phone with the add-on", "WhatsApp isn’t listed on any plan"],
  ["Matador AI, Impel, DriveCentric", "Not published: quoted per rooftop", "Phone, text, email and web chat, depending on the product", "Built for dealerships with a DMS and CRM"],
  ["Nobi", "From $29/month for 500 messages", "Website chat only", "No phone, SMS or WhatsApp"],
  ["Wapzen", "Free, no card", "WhatsApp chats, WhatsApp calls and WhatsApp calling campaigns, on your current number", "No DMS or CRM link by itself; requests export as CSV"],
];

export default function AiForCarDealershipsPage() {
  return <PlaybookPost
    href={href}
    heading={<>AI for car dealerships on WhatsApp.<br /><span>Answer every buyer in minutes, free.</span></>}
    lead="Car buyers message dealers on WhatsApp at night and at weekends, about a car they saw online. This playbook follows one day at a dealership with a free AI agent on its WhatsApp: how it answers stock and price questions, sends car photos, books test drives and trade-in valuations for your team, calls new leads, and how it compares with dealership AI and AI BDC software."
    answer={{
      title: "The short answer",
      body: <>AI for car dealerships answers buyers on WhatsApp in seconds, from your own stock list and prices: which cars are in, the price, mileage, finance options and where you are. <strong>Wapzen</strong> runs on the number your showroom already uses. It sends car photos and spec sheets, takes test drive and trade-in requests for your sales team, reads photos of a customer’s car, and its voice agent answers WhatsApp calls and calls new leads on WhatsApp. <strong>It’s free</strong>, with no Meta API key.</>,
      specs: [["Price", "Free, no card"], ["Works on", "Your showroom’s current WhatsApp number"], ["Test drives", "Requests sent to your sales team"], ["WhatsApp calls", "Answered, and new leads called"]],
    }}
    chapters={[
      {
        id: "what",
        title: "What AI does for a car dealership",
        body: <>
          <p>Car buyers shortlist on their phone. They see a car on your website, a marketplace or Facebook, and message two or three dealers at once: is it still available, what’s the last price, can I see more photos, do you take trade-ins. The dealer who answers first with something useful usually gets the visit.</p>
          <p>Big dealer groups solve this with a <strong>BDC</strong>, a business development centre: a team that answers every lead, books appointments and follows up. <strong>AI BDC</strong> software does the same job by phone, text and email, and is usually priced per rooftop. In much of the world, though, the buyer’s first message isn’t a web form or an SMS. It’s WhatsApp.</p>
          <p><strong>Wapzen</strong> puts an AI agent on your showroom’s existing WhatsApp number, linked as a device, so your sales team keeps using the same phone. It suits used car dealers, franchised showrooms, motorbike dealers, car importers, trade-in buyers and car rental companies. For the wider sales playbook, read <Link href="/blog/whatsapp-ai-sales-agent">WhatsApp AI sales agent</Link>.</p>
        </>,
      },
      {
        id: "day",
        title: "A day at the showroom, hour by hour",
        body: <>
          <p>Here is one day of WhatsApp messages and calls at a made-up dealership, and what the AI did with each one. Green means it answered alone, amber means it saved a request for the sales team, blue means a WhatsApp call, and purple means it passed the chat to a person.</p>
          <DayTimeline items={day} caption="An illustrative day at a made-up dealership. Every answer comes from the information the dealer gave the agent; the buyers, cars and prices are invented." />
          <p>The 07:10 buyer booked a test drive by 13:00 without anyone at the showroom typing a word. The sales manager’s day started with a test drive and a trade-in already on the Orders page.</p>
        </>,
      },
      {
        id: "jobs",
        title: "Who does what: the AI, the AI with your team, your team",
        body: <>
          <JobBoard columns={[
            { tone: "ai", title: "The AI handles it", note: "From the information you give it", items: ["Which cars are in stock, with price, mileage and specs", "Photos and spec sheets of your featured cars", "Location, opening hours and directions", "Finance partners and deposit rules you list", "Warranty terms and documents needed", "Photos and voice notes, in any language"] },
            { tone: "request", title: "The AI takes it, your team confirms", note: "Saved on the Orders page and sent to a staff WhatsApp", items: ["Test drive bookings", "Trade-in valuation requests, with photos", "Call-back requests from a sales advisor", "Service bookings", "Holding a car until a deposit is paid"] },
            { tone: "team", title: "Your team does it", note: "The AI says an advisor will reply", items: ["Negotiating the final price", "Finance applications and approvals", "Deposits and payments", "Valuing trade-ins", "Complaints and warranty claims"] },
          ]} />
          <p><strong>Why prices and valuations stay with people:</strong> Wapzen doesn’t connect to your DMS or CRM by itself, and the sample instructions tell it never to invent a discount, a finance rate or a trade-in value. That protects your margins and keeps the AI from promising something your team can’t honour. If your DMS has a public API, someone technical can connect it with an API tool.</p>
          <InlineCta title="Put AI on your showroom’s WhatsApp today" body="Free: no card and no Meta API key, on the number buyers already message." label="Start free" />
        </>,
      },
      {
        id: "stock",
        title: "Keep the AI up to date with your stock",
        body: <>
          <p>The AI is only as good as its stock list. Keep one plain-text list in the <strong>Knowledge Base</strong>, one line per car, and update it when a car arrives, sells or is reserved. A format that works:</p>
          <PromptFile name="stock-list.txt" text={stock} />
          <ul>
            <li><strong>Photos of your featured cars</strong> go in Images &amp; Files, each with a note such as “send when someone asks for photos of the 2021 Corolla”. JPG and PNG arrive as WhatsApp photos, PDFs as documents.</li>
            <li><strong>Your website</strong> goes on the Web Search card, so the AI can read your stock pages too. Test it: listings that only appear after a page loads its scripts may not be readable, and the stock list is the safer source.</li>
            <li><strong>Mark sold and reserved cars</strong> the same day, or the AI will keep offering them.</li>
          </ul>
        </>,
      },
      {
        id: "setup",
        title: "Set up AI for your dealership in one afternoon",
        body: <>
          <SetupSteps items={[
            { title: "Write your stock list and dealership details", time: "30 min", body: <>The stock list above, plus finance partners and deposit rules, warranty terms, documents a buyer needs, opening hours, address and a landmark.</> },
            { title: "Sign up free and link the showroom’s WhatsApp number", time: "5 min", body: <>On the showroom phone open WhatsApp › Linked devices › Link a device › Link with phone number instead, and enter the 8-character code. On a computer you can scan the QR code instead. The agent starts answering straight away, so have step 1 ready first.</> },
            { title: "Paste your instructions", time: "10 min", body: <>Copy the instructions below, change the dealership’s name and rules, and paste them into the agent’s prompt.</> },
            { title: "Add your stock, photos and website", time: "20 min", body: <>Stock list and details in the <strong>Knowledge Base</strong>, featured car photos and spec sheets in <strong>Images &amp; Files</strong>, your website on the <strong>Web Search</strong> card.</> },
            { title: "Switch on Take Order for test drives and trade-ins", time: "10 min", body: <>Write what each request needs (name, car, day and time for a test drive; year, mileage and city for a trade-in) and add the sales manager’s number under order alerts. Take Order was built for shop orders, so test it with a few made-up requests.</> },
            { title: "Test it like a buyer", time: "15 min", body: <>From another phone: ask about a car you sold last week, send photos of a trade-in, ask for a discount, book a test drive and send a voice note in another language. Fix the instructions wherever an answer isn’t right.</> },
          ]} />
          <PromptFile name="dealership-instructions.txt" text={prompt} />
        </>,
      },
      {
        id: "follow-up",
        title: "Car sales follow-up messages to copy",
        body: <>
          <p>In chat, the AI replies whenever a buyer writes but doesn’t start conversations. Follow-ups come from your sales team, from the Wapzen dashboard or the showroom phone, and when the buyer replies, the AI carries on with the whole conversation in view. Change the names, cars and prices to yours:</p>
          <Templates items={templates} />
          <Note>WhatsApp’s Business Messaging Policy asks businesses to message only people who gave them their number and agreed to hear from them. Follow up with your own leads and customers, and stop if someone asks you to.</Note>
        </>,
      },
      {
        id: "voice",
        title: "AI receptionist and AI BDC calls on WhatsApp",
        body: <>
          <p>Speed matters most with a new lead. Wapzen’s voice agent covers both directions on WhatsApp calls.</p>
          <VoiceCard
            title="Your AI BDC on WhatsApp calls"
            body="It answers WhatsApp calls to your showroom’s number in a natural voice, even when the showroom is closed, and calls new leads on WhatsApp as soon as you add them to a calling campaign."
            points={["Answers WhatsApp calls day and night", "Answers stock, price, hours and directions from your information", "Calls each new lead on WhatsApp as soon as you add it","Speaks the language you set for it"]}
            href={voiceAccess}
            label="Turn on the voice agent"
          />
          <p>Message our team on WhatsApp and we’ll switch the voice agent on for your number. It works on WhatsApp calls; calls to your landline stay with your team.</p>
        </>,
      },
      {
        id: "compare",
        title: "Best AI for car dealerships: how Wapzen compares",
        body: <>
          <RowTable caption="AI for car dealerships compared, checked 17 November 2026" firstColumn="Option" columns={["Price", "Channels", "Good to know"]} rows={compare} highlight="Wapzen" />
          <p><strong>Choose dealership AI software</strong> if you run several rooftops on a DMS and CRM, your leads come mostly by phone, SMS and web forms, and you want the AI to write into your systems. <strong>Choose Wapzen</strong> if your buyers write and call on WhatsApp and you want every one answered tonight, on your own number, for free.</p>
        </>,
      },
    ]}
    faq={[
      { q: "What is the best AI for car dealerships on WhatsApp?", a: "Wapzen is a free AI agent for car dealerships that runs on the showroom’s existing WhatsApp number. It answers stock, price and finance questions from your own list, sends car photos, takes test drive and trade-in requests for your team, and its voice agent answers WhatsApp calls and calls new leads. Dealership AI tools such as DealerAI don’t list WhatsApp on their plans." },
      { q: "What is an AI BDC for car dealerships?", a: "A BDC (business development centre) is the team that answers a dealership’s leads, books appointments and follows up. An AI BDC does that work with AI, usually by phone, SMS and email, and is priced per rooftop. Wapzen does the same job on WhatsApp chats and calls, for free." },
      { q: "Can AI book test drives?", a: "Yes. The AI asks for the buyer’s name, the car, the day and time and whether they hold a licence, reads it back and saves the request once the buyer confirms. Your sales manager gets a WhatsApp alert and confirms the slot." },
      { q: "Can AI value a trade-in from photos?", a: "It can read the photos and collect the year, mileage, service history and city, then send a valuation request to your appraiser. The sample instructions tell it never to give a trade-in value itself." },
      { q: "Does it connect to our DMS or CRM?", a: "Not by itself. The AI answers from your stock list and documents, and requests are saved on the Orders page, where you can export them as a CSV file. If your DMS has a public API, it can be connected with an API tool." },
      { q: "Will the AI negotiate prices?", a: "No, if you tell it not to, as the sample instructions do. It quotes the listed price and passes discount requests to a sales advisor, so it never promises a deal you can’t honour." },
      { q: "Do I need the WhatsApp Business API?", a: "No. Wapzen links to the WhatsApp or WhatsApp Business app number your showroom already uses, like WhatsApp Web, so there is no Meta approval, no new number and no per-message fees." },
      { q: "Can the AI answer and make WhatsApp calls?", a: "Yes. Wapzen’s voice agent answers WhatsApp calls to your number and calls new leads on WhatsApp in calling campaigns, in a natural voice, from the same information as the chat agent." },
      { q: "How much does AI for a car dealership cost?", a: "Wapzen is free, with no card. Dealership AI software is usually priced per rooftop: DealerAI starts at $599 CAD a month for its Chatbot plan, and Matador, Impel and DriveCentric quote on request (checked 17 November 2026)." },
      { q: "Does it work for used car dealers, bike dealers and car rental?", a: "Yes. Any car business that gets questions on WhatsApp can use it: used and new car dealers, motorbike dealers, importers, trade-in buyers and car rental companies." },
    ]}
    sources={[
      { label: "DealerAI: pricing", href: "https://dealerai.com/pricing" },
      { label: "Nobi: the best AI assistants for car dealerships", href: "https://nobi.ai/blog/best-ai-assistants-for-car-dealerships" },
      { label: "Matador AI", href: "https://matador.ai/" },
      { label: "WhatsApp Business Messaging Policy", href: "https://business.whatsapp.com/policy" },
    ]}
    related={["/blog/whatsapp-ai-sales-agent", "/blog/whatsapp-order-taking-chatbot"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Answer every car buyer tonight.<br /><span>Free, on your showroom’s own WhatsApp number.</span></>, body: "Sign up, give the agent your stock list and prices, and link your number. No card and no Meta API key." }}
  />;
}
