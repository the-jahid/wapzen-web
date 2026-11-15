import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Topic from the India industry harvest (2026-11-14, docs/seo-research.md, "India industry
// posts"): travel was third, 564, led by "ai for travel agents" (30, 3/3), then "ai for
// travel agency" (18), "ai tools for travel agents" (14), "best ai for travel agents" (13),
// "claude ai for travel agents" (12), "whatsapp business for travel agency" (10), "crm for
// travel agency" (10). Facts: India Tourism Data Compendium 2025 (Ministry of Tourism) via
// Deccan Herald for the 2024 figures; the official PDF wasn't opened. The Budget 2026 TCS
// change on overseas tour packages (flat 2% from 1 April 2026) comes from tax
// practitioners' summaries, not the Finance Act text, and the copy says to confirm it with
// a CA. Copy: "fully free" at the user's request (2026-11-14), although the server still
// gives each account a free trial (FREE_TRIAL_REPLIES) before a paid plan; never "unlimited". No limit and no ban wording, at the
// user's request. Voice is described as working and its CTA opens WhatsApp, because the
// dashboard still shows VoiceUpdateNote. Take Order as an enquiry form is untested, and the
// copy says to test it.
const href = "/blog/ai-for-travel-agents-india";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to turn on the Wapzen voice agent for my travel agency in India.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const answers = [
  ["“Dubai 4 nights package kitne ka hai?”", "Yes", "From your package sheet, with what’s included and what isn’t"],
  ["“Send the Kerala itinerary”", "Yes", "Sends the PDF you uploaded in Images & Files"],
  ["“Is breakfast included? Which hotel?”", "Yes", "From the package details you give it"],
  ["“Can you do a custom Europe trip for 6?”", "Yes, as an enquiry", "Collects dates, cities, budget and travellers for your quote"],
  ["“What’s the flight fare on 20 December?”", "No", "Fares change by the hour: your team quotes them"],
  ["“Will my visa be approved?”", "No", "Explains you help with documents, but can’t guarantee a visa"],
  ["“Is the hotel available on those dates?”", "No", "Your team checks availability before confirming"],
  ["“I want to cancel and get a refund”", "Partly", "Explains your written policy and hands over to a person"],
];

const tools = [
  ["Drafting itineraries, descriptions and social posts", "ChatGPT, Claude or Gemini", "No"],
  ["Answering customers on WhatsApp, day and night", "Rarely; you copy and paste", "Yes"],
  ["Sending itinerary PDFs and hotel photos in the chat", "No", "Yes, from Images & Files"],
  ["Collecting enquiry details for your sales team", "No", "Yes, with Take Order and alerts"],
  ["Answering WhatsApp calls", "No", "Yes, with the voice agent"],
  ["Booking flights and hotels, invoices and payments", "No; use your B2B portals and software", "No"],
];

const fit = [
  ["Agency selling domestic and international holiday packages", "Yes", "Answers package questions at any hour and sends itineraries"],
  ["Tour operator running fixed departures and pilgrimages", "Yes", "Dates, prices and inclusions answered from your sheet"],
  ["Agent who is out with groups or at airports all day", "Yes", "The agent replies while you’re travelling"],
  ["Agency that needs live fares and instant booking in chat", "No", "That needs a booking engine connected to suppliers"],
  ["Brand that needs a green tick or approved templates", "No", "Those exist only on Meta’s official API"],
];

const prompt = `You are the virtual travel assistant of Demo Holidays, a travel agency in Ahmedabad, Gujarat.
Say in your first message that you are a virtual assistant.
Reply in the customer's language: English, Hindi, Hinglish or Gujarati. Use two or three short sentences and ask one question at a time.
For packages, prices, inclusions, hotels and policies, use only the information you were given. If something isn't there, say so and offer a reply from our travel expert.
Never quote flight fares, never confirm availability of flights, hotels or seats, and never promise a visa approval. Say our team checks and confirms.
Never quote tax amounts such as GST or TCS. Say they will be on the final quote.
To record an enquiry, ask for the destination, travel dates, departure city, number of adults and children with ages, hotel category and budget. Repeat the details and ask the customer to confirm.
Don't ask for passport numbers, photos of passports or card details in this chat. Our team collects documents when the booking is confirmed.
For cancellations, refunds and complaints, explain the written policy and say a team member will reply.
Office hours: Monday to Saturday, 10 am to 7 pm.`;

const turns = [
  { from: "patient" as const, text: "Hi, Dubai 4 nights package for 2 adults and 1 child, December mein kitna hoga?" },
  { from: "agent" as const, text: "Hi! Main Demo Holidays ki virtual assistant hoon. Dubai 4N/5D package ₹54,900 per adult se shuru hai (twin sharing): 4-star hotel, breakfast, airport transfers, desert safari aur city tour. Flights alag se. Bachche ki umar kya hai?" },
  { from: "patient" as const, text: "7 saal. 20 Dec se, Ahmedabad se. Visa ho jayega na?" },
  { from: "agent" as const, text: "Visa ka faisla UAE authorities karti hain, isliye hum guarantee nahi de sakte. Hamari team documents mein poori madad karti hai. Main itinerary PDF bhej rahi hoon. Aapka naam bata dijiye?" },
  { from: "patient" as const, text: "Mehul Patel" },
  { from: "agent" as const, text: "Please check: Dubai 4N/5D, 20 December se, Ahmedabad se, 2 adults aur 1 child (7 saal), 4-star hotel. Mehul Patel. Sahi hai?" },
  { from: "patient" as const, text: "Yes" },
  { from: "agent" as const, text: "Dhanyavaad! Hamare travel expert flights ke saath final quote kal 11 baje tak isi chat par bhejenge." },
];

const sources = [
  { label: "Ministry of Tourism: India Tourism Data Compendium 2025", href: "https://tourism.gov.in/sites/default/files/2025-09/India%20Tourism%20Data%20Compendium%202025_1.pdf" },
  { label: "Deccan Herald: domestic tourist visits and outbound travel in the 2025 compendium", href: "https://www.deccanherald.com/amp/story/india%2Ftourism-in-india-accounts-for-140-of-total-international-arrivals-3745477" },
  { label: "Patron Accounting: TCS rate changes from April 2026 for overseas travel", href: "https://www.patronaccounting.com/blog/tcs-rate-changes-april-2026-overseas-travel-lrs-education-liquor" },
  { label: "YourStory: DPDP Rules 2025 notified, rollout over 18 months", href: "https://yourstory.com/2025/11/digital-personal-data-protection-dpdp-rules-2025-rollout-over-18-months" },
  { label: "AiSensy: pricing and India message charges", href: "https://aisensy.com/pricing" },
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
];

const questions = [
  {
    id: "use-ai",
    q: "How can travel agents in India use AI?",
    answer: "The biggest win is answering WhatsApp enquiries the moment they arrive, because travellers message several agents and book with the one who replies first with clear details. An AI agent on your WhatsApp does that day and night. AI writing tools such as ChatGPT or Claude help draft itineraries and posts, and your booking portals stay as they are.",
    body: <>
      <p>Demand is growing fast. According to the Ministry of Tourism’s India Tourism Data Compendium 2025, Indian nationals made <strong>30.89 million departures abroad in 2024</strong>, up 10.79% on 2023, and there were <strong>2,948 million domestic tourist visits</strong>, up 17.5%. Most of those trips start with a question on WhatsApp.</p>
      <p>The trouble is timing. Families plan trips in the evening and on Sundays, when your office is closed, and NRIs write from other time zones. A traveller who hears nothing for twelve hours has usually asked two other agents by then.</p>
      <p>That’s where an AI agent helps most: <strong>Wapzen</strong> answers on your own WhatsApp number from your package sheet, sends itineraries and records each enquiry for your team.</p>
    </>,
  },
  {
    id: "free",
    q: "Is there a free AI agent for travel agencies on WhatsApp?",
    answer: "Yes. Wapzen is a fully free AI agent that works on your travel agency’s own WhatsApp number. It answers package questions in seconds, in Hindi, English, Hinglish or Gujarati, sends itinerary PDFs and records each enquiry for your sales team. You don’t need a Meta API key, a developer or a credit card, and there are no Meta per-message charges.",
    body: <>
      <p>Wapzen links the number you already use as a device, the way WhatsApp Web does, so your phone keeps working and your team can still reply. The AI is included: no OpenAI account and no coding. Set it up once with your packages, and it replies while you’re on a site visit, at the airport or asleep.</p>
    </>,
  },
  {
    id: "enquiries",
    q: "What can an AI agent answer for a travel agency?",
    answer: "Everything in your package information: prices per person, inclusions and exclusions, hotels, meal plans, sightseeing, durations, departure dates, documents needed and your cancellation policy. It sends itineraries and records enquiries. It doesn’t quote live airfares, confirm availability or promise visas; your team does that.",
    body: <>
      <p>Here’s how a chat with a family could go:</p>
      <ChatExample
        business="Demo Holidays, Ahmedabad"
        labels={{ subtitle: "WhatsApp · AI agent", agent: "AI agent: ", patient: "Traveller: " }}
        turns={turns}
        caption="An illustrative chat for a made-up agency on a Sunday evening. Prices and inclusions come from the package sheet the agency gave the agent."
        points={[
          { title: "Price from your sheet", body: "The package price and inclusions come from your information, with flights clearly marked as extra." },
          { title: "An honest visa answer", body: "The prompt forbids promising a visa, so the agent explains what you do and what you can’t guarantee." },
          { title: "Sends the itinerary", body: "The PDF goes from Images & Files, the moment the traveller is interested." },
          { title: "Your expert closes", body: "The enquiry is recorded with every detail, so your team quotes flights and confirms in one message." },
        ]}
      />
      <Comparison caption="What a WhatsApp AI agent does with a travel agency’s everyday questions" columns={["Does it answer?", "How"]} rows={answers} />
    </>,
  },
  {
    id: "itineraries",
    q: "Can it send itineraries, hotel photos and package PDFs?",
    answer: "Yes. Upload itineraries as PDFs and hotel or destination photos in Images & Files, each with a note on when to send it, such as “send when someone asks about the Kashmir package”. The agent sends them in the chat. On the Web Search card you can also add your website, and the agent reads it to answer.",
    body: <>
      <ul>
        <li><strong>One PDF per package,</strong> with a clear note, so the agent sends the right one.</li>
        <li><strong>Real photos</strong> of the hotels you use, not stock images.</li>
        <li><strong>Seasonal prices change.</strong> Replace the file and update the package sheet when they do. The agent only knows what you gave it.</li>
        <li><strong>Your website as a source.</strong> If your packages are published on your site, the agent can read them. Ask test questions to check that its answers match the site.</li>
      </ul>
    </>,
  },
  {
    id: "leads",
    q: "Can it qualify leads and collect enquiry details?",
    answer: "Yes. Tell the agent which details to ask for: destination, dates, departure city, adults and children with ages, hotel category and budget. It asks one question at a time and repeats the summary for the traveller to confirm. With Take Order switched on, each enquiry is saved on your Orders page and can be sent to your sales team’s WhatsApp.",
    body: <>
      <ol>
        <li><strong>The agent qualifies the lead</strong> in the chat, without sending a long form.</li>
        <li><strong>Take Order saves it.</strong> Take Order was built for product orders, so here it acts as an enquiry form. Test it with a few made-up enquiries before you rely on it.</li>
        <li><strong>Your sales team gets an alert</strong> on WhatsApp, under Order alerts on WhatsApp, with every detail.</li>
        <li><strong>Your expert sends the quote</strong> on the same chat, from the phone or the dashboard.</li>
      </ol>
      <p>If you use a travel CRM with a public API, an <strong>API tool</strong> can send each enquiry there too. That needs someone technical, and you should test it a few times before relying on it.</p>
    </>,
  },
  {
    id: "quotes",
    q: "Can it give quotes and confirm bookings?",
    answer: "It gives the fixed package prices in your information and records what the traveller wants. Custom quotes, airfares, availability and payment stay with your team, because they change daily and need supplier checks. Tell the agent to say clearly that a booking is confirmed only when your team confirms it and payment is received.",
    body: <>
      <ul>
        <li><strong>Fixed packages and departures:</strong> the agent quotes them from your sheet.</li>
        <li><strong>Custom trips:</strong> the agent collects the details; your team builds the quote.</li>
        <li><strong>Flights and hotels:</strong> your team checks your portals and confirms.</li>
        <li><strong>Payment:</strong> the agent can share your bank or UPI details if you want, but it doesn’t take payments or check that they arrived.</li>
      </ul>
      <Note>Write “a booking is confirmed only when our team confirms it” into the instructions. Then the agent never promises a room or a seat you don’t have.</Note>
    </>,
  },
  {
    id: "ai-tools",
    q: "Which AI tools should a travel agent use?",
    answer: "Most agents use two kinds. A general AI assistant such as ChatGPT, Claude or Gemini helps write itineraries, package descriptions and social media posts. A WhatsApp AI agent such as Wapzen talks to your customers: it answers, sends files, records enquiries and picks up calls. Your booking portals and accounting software stay as they are.",
    body: <>
      <Comparison caption="General AI assistants compared with a WhatsApp AI agent for travel agents" columns={["ChatGPT, Claude or Gemini", "Wapzen"]} rows={tools} />
      <p>A practical routine: draft a new itinerary with an AI assistant, check every hotel, timing and price yourself, save it as a PDF, then upload it to Wapzen so the agent sends it to every traveller who asks.</p>
    </>,
  },
  {
    id: "languages",
    q: "Does it reply in Hindi, Gujarati and other languages?",
    answer: "Yes. Tell the agent which languages to use and it replies in English, Hindi, Hinglish, Gujarati, Marathi, Tamil, Telugu, Bengali, Malayalam and others, following the traveller’s language. With Reply to voice messages on, it transcribes voice notes and replies in text. Your package information can stay in English.",
    body: <>
      <ul>
        <li><strong>One line in the instructions:</strong> “Reply in the customer’s language.” List the languages your customers use.</li>
        <li><strong>Test each language</strong> with someone who speaks it, especially place names and package terms.</li>
        <li><strong>Voice notes:</strong> many families send them. Test with real ones, because accents and background noise affect accuracy.</li>
      </ul>
    </>,
  },
  {
    id: "never-promise",
    q: "What should a travel agent’s chatbot never promise?",
    answer: "Visa approvals, availability of flights, hotels or seats, airfares, refunds outside your written policy, and tax amounts. Those depend on embassies, suppliers and the law, and a wrong promise in writing is hard to take back. The sample instructions forbid each one and hand the question to your team.",
    body: <>
      <ul>
        <li><strong>Visas:</strong> the embassy decides. The agent can list documents from your information and offer help, never a guarantee.</li>
        <li><strong>Taxes on the quote:</strong> rules change. Budget 2026 replaced the 5% and 20% TCS slabs on overseas tour packages with a flat 2% from 1 April 2026, according to tax practitioners’ summaries. Confirm the current rule with your CA, and let your team put taxes on the final quote.</li>
        <li><strong>Prices that move:</strong> airfares and peak-season hotel rates. The agent says your team will quote them.</li>
        <li><strong>Trust:</strong> travellers worry about fake agents on WhatsApp. Put your registered business name, office address and website in the information, so the agent can share them when asked.</li>
      </ul>
      <p>This is general information, not tax or legal advice.</p>
    </>,
  },
  {
    id: "documents",
    q: "Is it safe to collect passport details on WhatsApp?",
    answer: "Don’t collect them through the AI chat. Passport numbers and scans are personal data under the Digital Personal Data Protection Act, and costly if they leak, so ask only for what an enquiry needs: names, dates, travellers and budget. Your team collects documents once the booking is confirmed. Most DPDP duties apply from May 2027.",
    body: <>
      <ul>
        <li><strong>Collect the minimum.</strong> The sample prompt tells the agent not to ask for passport numbers, passport photos or card details.</li>
        <li><strong>A WhatsApp number doesn’t prove identity.</strong> Don’t let the agent discuss someone’s existing booking or documents.</li>
        <li><strong>Know where the data goes.</strong> Wapzen’s main database is in Singapore, its servers in Singapore and Germany, files in Images & Files are stored in South Korea, and AI providers may process messages in the United States. Our <Link href="/privacy">privacy policy</Link> has the details.</li>
      </ul>
      <p>This is general information, not legal advice.</p>
    </>,
  },
  {
    id: "calls",
    q: "Can it answer travellers’ WhatsApp calls?",
    answer: "Yes, voice is working. Wapzen’s voice agent answers WhatsApp calls on your number in a natural voice, in Hindi, English and nine more Indian languages, with the same package information as the chatbot. It handles WhatsApp calls only, not mobile or landline calls, and it can’t transfer a live call to your team.",
    body: <>
      <p>Many travellers, especially older ones, prefer to call. When you’re busy, the voice agent answers package questions, explains what’s included and takes the caller’s details. It pauses for a second or two before each answer. See <Link href="/ai-calling-agent-india">AI calling for Indian businesses</Link> for more.</p>
      <InlineCta href={voiceAccess} title="Let the AI pick up when you can’t" body="Message our team on WhatsApp and we’ll switch the voice agent on for your agency’s number." label="Message us on WhatsApp" />
    </>,
  },
  {
    id: "cost",
    q: "What does a WhatsApp AI agent cost a travel agency in India?",
    answer: "On an API platform such as AiSensy, an agency sending about 5,400 replies a month would pay roughly ₹3,488 plus GST for the Basic plan, the AI add-on and Meta’s message charges, with more for AI messages past the first 1,000. Wapzen is fully free and has no Meta per-message charges, because it doesn’t use the API.",
    body: <>
      <p>Take an agency with 30 enquiries a day and about 6 replies each: <strong>5,400 replies a month</strong>, of which the first 1,000 are free under Meta’s pricing.</p>
      <ul>
        <li><strong>AiSensy:</strong> ₹1,500 plan + ₹1,350 AI add-on + 4,400 replies × ₹0.145 (₹638) = <strong>₹3,488 + 18% GST</strong>, about ₹4,116. The add-on covers 1,000 AI messages, so the rest cost extra.</li>
        <li><strong>Meta’s Cloud API directly:</strong> 4,400 × ₹0.115 = ₹506 + GST in message charges, but you build, host and pay for the AI yourself.</li>
        <li><strong>Wapzen:</strong> <strong>fully free</strong>, with no card and no Meta message charges. It isn’t Meta’s official platform, so there are no approved templates and no green tick.</li>
      </ul>
      <p>Prices are from AiSensy’s pages and Meta’s India rates of 1 October 2026; both change every quarter. For other platforms, see <Link href="/blog/free-whatsapp-ai-chatbot-india">what a WhatsApp chatbot costs in India</Link>.</p>
    </>,
  },
  {
    id: "setup",
    q: "How do I set up a WhatsApp AI agent for my travel agency?",
    answer: "Sign up free, click New chat agent, link your agency’s WhatsApp number with an 8-character pairing code on your phone or a QR code on a computer, name the agent and paste your instructions. Add your package sheet, upload itineraries in Images & Files, switch on Take Order for enquiries, and test it from another number.",
    body: <>
      <ol>
        <li><strong>Sign up free.</strong> No card and no API key.</li>
        <li><strong>Prepare your instructions first.</strong> The agent starts replying as soon as the number is linked.</li>
        <li><strong>Link the number.</strong> In WhatsApp: Linked devices → Link a device → Link with phone number instead, and enter the code. On a computer you can scan the QR code.</li>
        <li><strong>Add your packages</strong> with prices, inclusions, exclusions and policies, as text, PDF or Word. Scanned brochures can’t be read, so use files with selectable text.</li>
        <li><strong>Upload itineraries and photos</strong> in Images & Files, each with its note.</li>
        <li><strong>Switch on Take Order</strong> with your enquiry questions, and add your sales number under Order alerts on WhatsApp.</li>
        <li><strong>Test it</strong> from another number, including “will my visa be approved?” and “what’s the airfare?”.</li>
      </ol>
      <p>These instructions are for a made-up agency. Change them to yours:</p>
      <pre>{prompt}</pre>
      <InlineCta title="Reply to every traveller first, even on Sunday night" body="Fully free: no card, no Meta API key, on the number your customers already have." label="Start free" />
    </>,
  },
  {
    id: "not-do",
    q: "What doesn’t Wapzen do for a travel agency?",
    answer: "It doesn’t search live fares, book flights or hotels, check availability, take payments, issue invoices or process visas, and it doesn’t message travellers first. It isn’t Meta’s official platform, so there are no approved templates or green tick. In WhatsApp groups it stays quiet unless you switch it on for a group.",
    body: <>
      <Comparison caption="Which travel businesses a WhatsApp AI agent suits" columns={["Good fit?", "Why"]} rows={fit} />
      <ul>
        <li><strong>You can take over any chat.</strong> Each conversation in the dashboard has an AI switch. Turn it off and the agent stops replying to that traveller only.</li>
        <li><strong>Your tour groups stay as they are.</strong> The agent doesn’t reply in WhatsApp groups unless you switch that on for a group.</li>
        <li><strong>It works on your current number,</strong> personal or WhatsApp Business, as a linked device.</li>
        <li>Wapzen is an independent product, not made by Meta or WhatsApp.</li>
      </ul>
    </>,
  },
];

export default function AiForTravelAgentsIndiaPage() {
  return <QaPost
    href={href}
    heading={<>AI for travel agents in India.<br /><span>A fully free WhatsApp AI agent.</span></>}
    lead="Travellers message several agents at once and book with the one who replies first. Here are 14 questions Indian travel agents and tour operators ask about using AI, answered one by one: what an AI agent answers on WhatsApp, how it sends itineraries and qualifies leads, what it must never promise, how it compares with ChatGPT, what it costs, and how to start free."
    verdict={{
      title: "The short answer",
      body: <>The most useful AI for a travel agent in India is one that answers WhatsApp. <strong>Wapzen</strong> replies to package enquiries in seconds, in Hindi, English, Hinglish or Gujarati, sends itinerary PDFs and hotel photos, records each enquiry for your sales team and can answer WhatsApp calls. It never quotes live fares or promises visas. <strong>It’s fully free</strong>, with no Meta API key and no Meta per-message charges.</>,
    }}
    facts={[["Price", "Fully free"], ["Meta API key", "Not needed"], ["Itineraries", "Sent as PDF in the chat"], ["Travellers’ calls", "Voice agent working"]]}
    indexTitle="The 14 questions in this guide"
    answerLabel="Short answer"
    questions={questions}
    sources={sources}
    related={["/blog/free-whatsapp-ai-chatbot-india", "/blog/can-ai-reply-to-whatsapp-messages"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Be the agent who replies first.<br /><span>Fully free, with no Meta API key.</span></>, body: "Sign up, give the agent your packages and itineraries, and link your agency’s number. No card and no per-message charge." }}
  />;
}
