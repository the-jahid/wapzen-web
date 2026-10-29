import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "ai receptionist for small business uk" (45), "ai receptionist uk"
// (30, 3/3), "ai phone answering service" (27), "virtual receptionist uk" (20),
// "ai answering machine for business" (20), "best telephone answering service
// uk" (16), autocomplete GB 2026-10-30 (docs/seo-blog-europe-research.mjs uk).
// UK searchers expect their phone line answered; Wapzen answers WhatsApp chats
// and calls only, and the post says so. Prices come from IONOS, Moneypenny and
// Connect Communications' own pages, the hire from GOV.UK's April 2026 National
// Living Wage. The general WhatsApp receptionist post is
// /blog/whatsapp-ai-receptionist-for-clinics; the Spanish market has its own
// post (/es/blog/recepcionista-virtual-ia), not a translation.
const href = "/blog/ai-receptionist-uk";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const options = [
  ["Who answers", "Your own receptionist", "A shared team of people", "An AI voice agent", "An AI agent, by chat and by call"],
  ["Hours", "Office hours", "Usually office hours; 24/7 costs more", "24/7", "24/7"],
  ["What it answers", "Your phone line and front desk", "Calls forwarded from your number", "Calls forwarded from your number", "WhatsApp chats and WhatsApp calls"],
  ["Typical cost", "About £2,065 a month in wages alone", "From £14.99 a month + VAT, priced by messages taken", "From £9 a month + VAT, priced by calls or minutes", "Free to start with Wapzen"],
];

const prices = [
  ["IONOS AI Receptionist", "£9 (30 calls), £19 (100 calls, then £0.39 a call) or £29 (unlimited calls) a month", "Answers your forwarded line; 30-day free trial"],
  ["Moneypenny AI Receptionist", "From £25 a month, on a quote", "Live Moneypenny receptionists can step in"],
  ["Connect Communications", "From £14.99 a month; £54.99 a month for 30 messages taken (Classic)", "People answer; you pay per message taken, not per call"],
  ["A full-time hire", "About £2,065 a month at the £12.71 National Living Wage, before employer NI and pension", "Office hours only; holidays and sick days need cover"],
  ["Wapzen", "Free to start", "WhatsApp chats and WhatsApp calls, 24/7"],
];

const faqs = [
  { q: "How much does an AI receptionist cost in the UK?", a: "Published UK prices start low. IONOS charges £9 a month for 30 calls, £19 for 100 calls, or £29 for unlimited calls, all plus VAT, and Moneypenny's AI receptionist starts from £25 a month on a quote. Most providers bill by calls or minutes, so work out your real call volume before you pick a plan." },
  { q: "Is there a free AI receptionist?", a: "For phone lines, mostly free trials: IONOS offers 30 days, for example. For WhatsApp, Wapzen is free to start: it answers your WhatsApp chats and WhatsApp calls with AI, on the number your customers already use." },
  { q: "Can an AI receptionist answer my existing business number?", a: "A phone-line service can: you forward your landline or mobile number to it, and it answers when you can't. Wapzen can't, because it only answers WhatsApp chats and WhatsApp calls on your WhatsApp number. Many UK small businesses use both." },
  { q: "Do I have to tell callers they're talking to an AI?", a: "If you serve customers in the EU, yes: since 2 August 2026, Article 50 of the EU AI Act requires it unless it's obvious. The AI Act doesn't apply to UK-only businesses, but UK GDPR expects you to be open about how you handle people's data, and callers trust a receptionist that says what it is. One line in the greeting does it." },
  { q: "Will an AI receptionist understand British accents?", a: "Today's speech models handle a wide range of accents well, but not perfectly, especially on a bad line or with local place names. Before you sign up, ring it yourself several times with your customers' real questions, and ask a colleague with a strong regional accent to try too." },
  { q: "Is an AI receptionist better than a telephone answering service?", a: "It's cheaper and never closes, and it can answer questions, not just take a message. A service with people is better for delicate calls, complaints, and callers who refuse to talk to a machine. Some providers, such as Moneypenny, combine the two." },
];

const sources = [
  { label: "IONOS: AI Receptionist (UK)", href: "https://www.ionos.co.uk/momentum/ai-receptionist" },
  { label: "IONOS: UK launch announcement", href: "https://www.ionos.co.uk/newsroom/news/ionos-offers-24-7-phone-support-to-smbs-with-its-new-ai-receptionist/" },
  { label: "Moneypenny: AI Receptionist", href: "https://www.moneypenny.com/uk/ai-receptionist/" },
  { label: "Connect Communications: call answering service costs", href: "https://www.connect-communications.co.uk/cost-calculator/call-answering-service-costs/" },
  { label: "GOV.UK: National Minimum Wage and National Living Wage rates", href: "https://www.gov.uk/national-minimum-wage-rates" },
  { label: "Euronews: Ofcom Online Nation 2025", href: "https://www.euronews.com/2025/12/11/people-in-the-uk-spend-half-their-online-lives-on-platforms-owned-by-meta-or-google-regula" },
  { label: "Cookiebot: EU AI Act Article 50 from August 2026", href: "https://www.cookiebot.com/en/eu-ai-act-article-50-transparency-compliance/" },
];

const sections = [
  {
    id: "what-it-does",
    title: "What an AI receptionist does (and doesn’t)",
    body: <>
      <p>An <strong>AI receptionist</strong> answers your customers when you can’t: up a ladder, with a client, or asleep. A good one handles the calls and messages that eat a small business’s day:</p>
      <ul>
        <li><strong>Answers the usual questions:</strong> opening hours, prices, areas you cover, parking, how long a job takes.</li>
        <li><strong>Takes messages</strong> with a name, a number, and what it’s about, and sends them to you.</li>
        <li><strong>Handles bookings:</strong> takes the request, or books it straight into your calendar if it’s connected.</li>
        <li><strong>Screens calls:</strong> tells a customer who needs a quote from someone selling advertising.</li>
        <li><strong>Calls new enquiries back</strong> straight away, while they’re still interested.</li>
      </ul>
      <p>What it shouldn’t do: give medical, legal, or financial advice, settle a tricky complaint, or take payments. The rule for those is simple: <strong>the AI says so and hands the customer to a person</strong>.</p>
    </>,
  },
  {
    id: "options",
    title: "Your four options, compared",
    body: <>
      <p>“AI receptionist” covers very different products. Here’s how they compare with the two traditional options:</p>
      <Comparison caption="Four ways to answer a UK small business’s customers" columns={["A hire", "Answering service", "AI for your phone line", "AI for WhatsApp"]} rows={options} />
      <p>The question that decides it isn’t the technology. It’s <strong>how your customers contact you</strong>. If they ring your landline, you need something that answers the phone. If they message and call you on WhatsApp, you need a receptionist on WhatsApp. Many businesses get both.</p>
    </>,
  },
  {
    id: "costs",
    title: "What an AI receptionist costs in the UK",
    body: <>
      <p>Prices from each provider’s own pages, excluding VAT, compared with a hire:</p>
      <Comparison caption="AI receptionist and answering service prices in the UK, 2026" columns={["Price a month", "What you get"]} rows={prices} />
      <p>Watch the billing unit. Most phone-line services charge by <strong>calls</strong>, <strong>minutes</strong>, or <strong>messages taken</strong>, and the cheapest plan isn’t always the cheapest bill. Take a plumber who gets 6 calls a day, 22 working days a month:</p>
      <ul>
        <li>6 × 22 = <strong>132 calls a month</strong>.</li>
        <li>On a 100-call plan at £19, plus 32 extra calls at £0.39: <strong>£31.48 + VAT</strong>.</li>
        <li>On an unlimited plan at £29: <strong>£29 + VAT</strong>, with room for busy months.</li>
      </ul>
      <p>Either way it’s a fraction of a hire. The National Living Wage is £12.71 an hour from April 2026, so a full-time receptionist on 37.5 hours a week costs about £2,065 a month in wages alone, before employer National Insurance, pension, and holiday cover.</p>
      <Note>Prices change often, and many UK providers quote excluding VAT. Check the provider’s page, and whether the plan books appointments or only takes messages, before you sign up.</Note>
    </>,
  },
  {
    id: "whatsapp",
    title: "Why your receptionist should answer WhatsApp too",
    body: <>
      <p>According to Ofcom’s Online Nation 2025 report, <strong>WhatsApp is used by 90% of UK adults who are online</strong>. Your customers already message tradespeople, salons, and clinics there: a 10 pm message asking if you’re free on Saturday, or a WhatsApp call while you’re with another customer.</p>
      <p>A phone-line receptionist never sees those. WhatsApp Business away messages are fixed texts that answer nothing. So it makes sense to put an AI receptionist on <strong>your own WhatsApp number</strong>, answering the chats and the WhatsApp calls.</p>
    </>,
  },
  {
    id: "how-to-choose",
    title: "How to choose: 8 questions to ask before you sign up",
    body: <>
      <ol>
        <li><strong>Does it charge per call, per minute, or a flat fee?</strong> Count your real calls, as in the example above.</li>
        <li><strong>Is VAT included?</strong> Usually not.</li>
        <li><strong>What happens past the allowance?</strong> Does it stop answering, or charge you the overage?</li>
        <li><strong>Is there a minimum term?</strong> Some plans are monthly; some lock you in for a year.</li>
        <li><strong>Does it connect to your calendar?</strong> If not, it takes requests and you confirm them.</li>
        <li><strong>How does it hand over to you?</strong> A text, an email, a live transfer? Test it.</li>
        <li><strong>How does it sound?</strong> Ring it several times with your customers’ real questions.</li>
        <li><strong>Where does the data go?</strong> Under UK GDPR you need a processing agreement with any provider that handles your customers’ details. If you serve EU customers, the EU AI Act also requires the AI to say it’s an AI.</li>
      </ol>
    </>,
  },
  {
    id: "who-its-for",
    title: "Who an AI receptionist suits",
    body: <>
      <ul>
        <li><strong>Trades:</strong> plumbers, electricians, and builders who can’t answer on a job. The AI takes the address, the problem, and a good time to call back.</li>
        <li><strong>Salons and barbers:</strong> prices, availability, and booking requests, including the late-night ones.</li>
        <li><strong>Clinics and dentists:</strong> practical questions and appointment requests, never medical advice. See <Link href="/blog/whatsapp-ai-receptionist-for-clinics">our clinic receptionist guide</Link>.</li>
        <li><strong>Estate agents:</strong> questions about listings from your brochures, and fast call-backs for new leads. See <Link href="/blog/whatsapp-chatbot-for-real-estate">WhatsApp for real estate</Link>.</li>
        <li><strong>Restaurants and takeaways:</strong> opening hours, menus, and table requests during the dinner rush.</li>
      </ul>
    </>,
  },
  {
    id: "whatsapp-receptionist",
    title: "A WhatsApp AI receptionist, free to start",
    body: <>
      <p><strong>Wapzen</strong> links your existing WhatsApp number as a device, the way WhatsApp Web does, with a QR code. Then an AI agent answers every one-to-one chat using your business details, and a voice agent picks up WhatsApp calls and rings new leads back as soon as you add them. You keep using WhatsApp on your phone and can reply yourself at any time.</p>
      <ul>
        <li><strong>No new number</strong> and no WhatsApp Business API application.</li>
        <li><strong>No per-message fees</strong> from Meta for its replies, and no per-minute call charges.</li>
        <li><strong>Free to start,</strong> with no card and no contract. Running at high volume? Message us.</li>
      </ul>
      <InlineCta title="A receptionist on your WhatsApp, open 24/7" body="Create an AI agent, add your business details, and link your number with a QR code. It starts answering right away." />
      <p>Its limits, plainly: Wapzen <strong>doesn’t answer your landline or ordinary mobile calls</strong>, only WhatsApp. It isn’t made by Meta, doesn’t reply in groups, and doesn’t read photos or voice notes. As a linked device, its servers read each incoming message and send it to an AI model to write the reply, so tell customers an assistant answers first.</p>
      <Choose items={[
        { name: "a phone-line service", points: ["most customers ring your landline", "you need calls transferred to different people", "you want a real person answering in office hours"] },
        { name: "Wapzen", points: ["your customers message and call you on WhatsApp", "you want answers at any hour without paying per call", "you want every new lead called back straight away"] },
      ]} />
    </>,
  },
];

export default function AIReceptionistUKPage() {
  return <BlogPost
    href={href}
    heading={<>An AI receptionist for UK small business.<br /><span>What it really costs.</span></>}
    lead="What an AI receptionist costs a UK small business in 2026, from phone-line AI at £9 a month to answering services and a full-time hire, with a worked example, the questions to ask before you sign up, and a free option for WhatsApp."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Phone-line AI:</strong> from £9 a month + VAT for 30 calls, or £29 for unlimited calls (IONOS); Moneypenny from £25.</>,
        <><strong>Watch the billing unit:</strong> most plans charge by calls, minutes, or messages taken. Count your real volume first.</>,
        <><strong>On WhatsApp:</strong> an AI receptionist on your own number answers chats and WhatsApp calls, free to start with Wapzen.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-ai-receptionist-for-clinics", "/blog/whatsapp-appointment-booking"]}
    product="/ai-receptionist"
    cta={{ heading: <>Your receptionist, on WhatsApp.<br /><span>Open around the clock.</span></>, body: "Create a free AI receptionist, add your business details, and link your WhatsApp number. It answers chats and calls right away." }}
  />;
}
