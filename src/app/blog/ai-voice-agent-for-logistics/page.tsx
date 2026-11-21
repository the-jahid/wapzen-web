import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { InlineCta, Note, RowTable } from "@/components/blog/BlogPost";
import { CallLog, CallTranscript, JobBoard, PlaybookPost, PromptFile, SetupSteps, type CallLogItem, type CallTurn } from "@/components/blog/PlaybookPost";

// One of seven WhatsApp voice agent industry posts (2026-11-21). Keywords from
// docs/seo-blog-voice-seven-industries-research.mjs: "ai voice agent for logistics" 145,
// "how to use ai in logistics" 134 (6/9), "ai agents for logistics" 124, "ai voice assistant for
// logistics" 90, "ndr calling" 75 (8/9), "voice ai for logistics" 50, "address verification
// call" 50, "conversational ai delivery manager" 50.
// Facts read 2026-11-21 on ClickPost's own pages: FY2026 D2C network, COD orders ended as RTO at
// 37.51% vs 5.28% prepaid; Meesho RHP, H1 FY26, 24.15% of COD shipments didn't reach the customer
// vs 3.61% prepaid (ClickPost's reading of the filing). Vendor prices read 2026-11-21.
// Product facts: lookups and changes only through API request tools that take the tracking number
// the caller gives; campaign calls have one opening for every lead and the agent doesn't know which
// parcel, so outcomes are matched by the team from the campaign's lead list (CSV export exists,
// import doesn't); leads added one at a time, no redial; no live transfer.
const href = "/blog/ai-voice-agent-for-logistics";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to set up the Wapzen WhatsApp voice agent for my delivery business.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const day: CallLogItem[] = [
  { time: "08:05", direction: "in", who: "Customer", said: "“Where’s my parcel? The tracking number is DX 4417 2290.”", outcome: "checked", result: "Read the number back, looked it up in the courier’s system through an API tool and said: out for delivery, expected between 2 and 5 pm." },
  { time: "09:20", direction: "in", who: "Customer", said: "“I won’t be home today. Can you bring it tomorrow?”", outcome: "booked", result: "Asked for the tracking number, offered tomorrow morning or afternoon, and moved the delivery after the customer picked the morning." },
  { time: "11:30", direction: "in", who: "Online seller", said: "“I need 12 parcels picked up from my shop tomorrow.”", outcome: "booked", result: "Took the pickup address, the number of parcels and a time window, read them back and booked the pickup through an API tool." },
  { time: "13:10", direction: "in", who: "Caller speaking Arabic", said: "“كم سعر التوصيل إلى جدة؟” (How much is delivery to Jeddah?)", outcome: "answered", result: "Answered in Arabic from the rate card: the price and the usual two working days." },
  { time: "15:00", direction: "out", who: "Customer after a failed delivery", said: "“Hello, this is the virtual assistant of Demo Express. We tried to deliver your parcel today and couldn’t reach you. When should we come again?”", outcome: "called", result: "Called from the day’s NDR campaign. The customer asked for Saturday morning and gave a landmark; the ops team saw the answer in the campaign’s call list and updated the shipment." },
  { time: "17:40", direction: "in", who: "Upset customer", said: "“The driver says I wasn’t home, but I was here all day!”", outcome: "saved", result: "Apologised, took the tracking number and what happened, and saved a complaint for the ops team through an API tool. It didn’t promise compensation." },
  { time: "20:15", direction: "in", who: "Customer", said: "“Can I collect it from the depot instead? When are you open?”", outcome: "texted", result: "Gave the depot hours and sent the address with a map pin on WhatsApp during the call." },
];

const call: CallTurn[] = [
  { who: "agent", text: "Hello, you’ve reached Demo Express. I’m the virtual assistant. How can I help?" },
  { who: "caller", text: "Hi, I have a parcel coming today, but I won’t be home." },
  { who: "agent", text: "No problem, I can change the delivery. Could you tell me the tracking number? It’s in the message we sent you." },
  { who: "caller", text: "D X 4 4 1 7 2 2 9 0." },
  { who: "agent", text: "Thank you. That’s D X, 4 4 1 7, 2 2 9 0. Is that right?" },
  { who: "caller", text: "Yes." },
  { tool: "track_parcel", text: "Found it: out for delivery today, cash on delivery 1,250 rupees. Free slots tomorrow: 9 am to 1 pm, or 2 to 6 pm." },
  { who: "agent", text: "I can see it’s out for delivery today. We can bring it tomorrow between 9 and 1, or between 2 and 6. Which suits you?" },
  { who: "caller", text: "Tomorrow morning." },
  { who: "agent", text: "Should we deliver to the same address? And is there a landmark that would help the driver?" },
  { who: "caller", text: "Same address. It’s the blue gate opposite the temple." },
  { who: "agent", text: "Got it. Tomorrow between 9 am and 1 pm, same address, blue gate opposite the temple, and the cash on delivery is 1,250 rupees. Shall I confirm it?" },
  { who: "caller", text: "Yes, please." },
  { tool: "reschedule_delivery", text: "Moved the delivery to tomorrow, 9 am to 1 pm, and added the landmark as a note for the driver." },
  { who: "agent", text: "Done. The driver will come tomorrow morning and has the landmark. Is there anything else?" },
  { who: "caller", text: "No, thanks." },
  { who: "agent", text: "Thank you for calling Demo Express. Goodbye!" },
  { tool: "end_call", text: "Ended the call after the goodbye." },
];

const toolSetup = [
  ["Name", "track_parcel"],
  ["Description (what the agent reads)", "Look up a parcel by its tracking number. Use it when a caller asks where their parcel is or wants to change a delivery."],
  ["Request", "GET to your tracking system, for example https://ops.example.com/api/track"],
  ["Parameter the agent fills in", "tracking_number (text, required), taken from what the caller says and read back first"],
  ["Header", "Your system’s API key, sent with every request"],
  ["What to return", "Short fields only: status, expected window, next free slots, amount to collect. Leave out the address and phone number."],
];

const prompt = `You are the virtual assistant of Demo Express, a courier and parcel delivery company. You answer and make WhatsApp calls.
At the start of every call, say you are the company's virtual assistant.
Speak clearly and briefly: one to three sentences, one question at a time.
Answer from the information you were given: rates, delivery times, service areas, what can't be shipped, depot hours and addresses, and how cash on delivery and returns work.
Tracking and changes: ask for the tracking number, read it back in small groups and use track_parcel only after the caller confirms. Never read out the stored address or phone number; ask the caller to confirm the address instead. To change the day or add a landmark, offer the free slots, repeat the change back and use reschedule_delivery after they say yes.
Pickups: ask for the pickup address, the number of parcels and a time window, repeat them back and use book_pickup after they confirm.
Complaints, damaged or lost parcels: apologise, take the tracking number and what happened, and save it with save_complaint. Never promise a refund, compensation or a driver's punishment.
Calls after a failed delivery: ask whether they still want the parcel, when to try again, and for a landmark. Repeat the answer back. If they no longer want it, say it will be returned to the sender.
Offer to send depot addresses and map pins with send_text.
When the caller has what they need, say goodbye and end the call.`;

const compare = [
  ["Retell AI", "$0.07–$0.31 a minute, pay as you go; $10 free credit", "Phone lines", "Batch calling +$0.005 a dial; telephony billed per minute"],
  ["Bland AI", "$0.14 a minute (Start), or $0.12 a minute + $299 a month (Build)", "Phone lines", "Start plan capped at 100 calls a day"],
  ["Vapi", "$0.05 a minute platform fee + AI model, voice and transcription at cost", "Phone lines", "Build-your-own platform for developers"],
  ["WhatsApp Calling API platforms", "Calls customers make are free from Meta; calls you make are billed per minute; plus the platform’s fees", "WhatsApp, through the official API", "A customer must grant call permission before you call"],
  ["Wapzen", "Free, no per-minute fees", "WhatsApp, on your current number", "Customers added to a campaign one at a time"],
];

export default function AiVoiceAgentForLogisticsPage() {
  return <PlaybookPost
    href={href}
    heading={<>AI voice agent for logistics, on WhatsApp calls.<br /><span>Fewer wasted delivery trips, for free.</span></>}
    lead="Couriers, last-mile fleets, 3PLs and online sellers spend their days on the same calls: where’s my parcel, can you come tomorrow, how do I find the address. This playbook shows how an AI voice agent handles those calls on WhatsApp, runs NDR and delivery confirmation calls, what it needs from your tracking system, and what it costs."
    answer={{
      title: "The short answer",
      body: <>An <strong>AI voice agent for logistics</strong> answers and makes delivery calls in a natural voice. It tells callers where their parcel is by looking up the tracking number in your system, reschedules deliveries, takes landmarks for the driver and books pickups. It also calls customers after a failed delivery attempt (NDR calls) to agree on the next try. <strong>Wapzen</strong> runs one on your existing WhatsApp number, <strong>free</strong>, with no per-minute fees. Live tracking needs an API to your tracking or courier software.</>,
      specs: [["Price", "Free, no per-minute fees"], ["Calls", "Tracking, rescheduling, pickups, NDR"], ["Works on", "Your current WhatsApp number"], ["Needs", "An API for live tracking data"]],
    }}
    chapters={[
      {
        id: "what",
        title: "What an AI voice agent does in logistics",
        body: <>
          <p>An AI voice agent is software that holds a real phone conversation: it understands what the caller says, answers from your information and takes actions in your systems through API calls. In logistics, most calls fall into a handful of types: tracking (“where is my order?”), changing a delivery, finding the address, booking a pickup, and complaints. Each one is short, repetitive and urgent to the caller.</p>
          <p>The calls that matter most are about deliveries that may fail. Cash on delivery shows the cost: on ClickPost’s FY2026 network of Indian D2C brands, <strong>37.51% of cash-on-delivery orders ended as returns to origin, against 5.28% of prepaid ones</strong>. ClickPost also reads Meesho’s filing as 24.15% of COD shipments not reaching the customer in the six months to September 2025, against 3.61% prepaid. Every one of those is a wasted trip, and a call before the trip or after a failed attempt is how couriers catch them.</p>
          <p><strong>Wapzen</strong> runs the voice agent on WhatsApp calls, on the number your customers already message. It links as a linked device, the way WhatsApp Web does, so your team keeps the number on its phones. It suits courier and parcel companies, last-mile delivery fleets, online sellers who ship their own orders, 3PL warehouses, moving companies and freight forwarders that deal with customers on WhatsApp.</p>
        </>,
      },
      {
        id: "day",
        title: "A day of delivery calls on WhatsApp",
        body: <>
          <p>One day at a made-up courier. Green means the agent answered alone, blue means it used the courier’s system, purple means it sent a WhatsApp message during the call, amber means it saved something for the team, and orange is a call the agent made.</p>
          <CallLog items={day} caption="An illustrative day at a made-up courier. Tracking, rescheduling, pickups and complaints go through API tools connected to the courier’s own software; everything else comes from its written information." />
        </>,
      },
      {
        id: "jobs",
        title: "Which calls the AI takes, and which stay with your team",
        body: <>
          <JobBoard columns={[
            { tone: "ai", title: "The voice agent handles it", note: "From your rate card and written information", items: ["Rates, delivery times and service areas", "Depot hours, addresses and map pins", "What can and can’t be shipped", "How cash on delivery and returns work", "Calls in the customer’s language"] },
            { tone: "request", title: "It does it through your system", note: "With API tools connected to your tracking or courier software", items: ["Tracking status by tracking number", "Rescheduling a delivery and adding a landmark", "Booking pickups for senders", "Logging complaints and damaged-parcel reports", "Calls after a failed delivery attempt"] },
            { tone: "team", title: "Your team does it", note: "The agent saves the details for them", items: ["Refunds, claims and compensation", "Lost-parcel investigations", "Disputes about drivers", "Freight and bulk contract quotes"] },
          ]} />
          <InlineCta href={voiceAccess} title="Answer delivery calls on your WhatsApp" body="Free, with no per-minute fees. Message our team and we’ll switch the voice agent on for you." label="Message us on WhatsApp" />
        </>,
      },
      {
        id: "call",
        title: "A sample call: moving a cash-on-delivery parcel to tomorrow",
        body: <>
          <CallTranscript title="Incoming WhatsApp call · Demo Express voice agent" meta="1 min 55 s · English · tools: track_parcel, reschedule_delivery, end_call" turns={call} caption="A sample call. track_parcel and reschedule_delivery are API request tools connected to the courier’s own software. The agent reads the tracking number back before using it and doesn’t read the stored address to whoever is calling." />
          <p>The landmark is the part customers value most. In many cities, “blue gate opposite the temple” gets a driver to the door faster than the written address does, and the agent passes it to the driver through your system.</p>
        </>,
      },
      {
        id: "ndr",
        title: "NDR calling and delivery confirmation calls",
        body: <>
          <p><strong>NDR calling</strong> means calling a customer after a delivery attempt fails (a non-delivery report) to find out what happened and agree on the next step: a new day, an address fix, a pickup from the depot, or a return. In Wapzen, that’s an outbound campaign:</p>
          <ol>
            <li><strong>Create a campaign</strong> such as “today’s failed deliveries” and pick the voice agent.</li>
            <li><strong>Add each customer</strong> whose delivery failed. The agent calls them on WhatsApp straight away.</li>
            <li><strong>The agent asks</strong> whether they still want the parcel, when to try again and for a landmark, and repeats the answer back.</li>
            <li><strong>Your team matches the answers</strong> to shipments from the campaign’s call list and transcripts, and can download the list as a CSV.</li>
          </ol>
          <p>The same pattern works <strong>before dispatch</strong>: call cash-on-delivery buyers to confirm the order and that someone will be home. The <Link href="/blog/whatsapp-cod-order-confirmation">COD order confirmation guide</Link> walks through that flow step by step.</p>
          <Note>Be clear about the limits. Every customer in a campaign hears the same opening, and the agent doesn’t know which parcel it’s calling about. Customers are added one at a time, and there’s no spreadsheet upload or automatic redial yet. So campaigns suit the day’s exceptions, a few dozen failed or risky deliveries, rather than every parcel on the van. Ask customers to save your number in your order messages: WhatsApp lets people silence calls from numbers that aren’t in their contacts.</Note>
        </>,
      },
      {
        id: "api",
        title: "Connect your tracking system with an API tool",
        body: <>
          <p>Live answers about a parcel need your data. In Wapzen, that’s an <strong>API request tool</strong>: you describe a request to your tracking system, and the agent calls it during the call with the tracking number the customer gave. A tracking tool looks like this:</p>
          <RowTable caption="An example tracking tool for the voice agent" firstColumn="Setting" columns={["Example"]} rows={toolSetup} />
          <p>The <strong>Test tool</strong> button runs the request once and shows exactly what the agent will read, so you can check it before a customer calls. Keep the reply short and plain: the agent reads it in the middle of a conversation. A rescheduling tool and a pickup tool work the same way, with POST requests. If your courier software has no API, a no-code service such as Make or Zapier can sit in between, or start without tools and let the team act on the transcripts.</p>
        </>,
      },
      {
        id: "setup",
        title: "Set up a logistics voice agent",
        body: <>
          <SetupSteps items={[
            { title: "Write down your information", time: "45 min", body: <>Rates by zone or weight, delivery times, service areas, what you won’t carry, depot hours and addresses, how cash on delivery and returns work, and your complaint process.</> },
            { title: "Ask our team to switch voice on", time: "2 min", body: <>Message us on WhatsApp from the button on this page. We turn the voice agent on for your account.</> },
            { title: "Link your customer service WhatsApp number", time: "5 min", body: <>Create a voice agent and link the number from its <strong>Phone Number</strong> card by QR code or pairing code. Set calls to both directions for NDR campaigns.</> },
            { title: "Paste the instructions", time: "15 min", body: <>Copy the instructions below and change the names and rules to yours. Pick a voice and set the language (one, or <strong>Multilingual</strong> for mixed-language customers).</> },
            { title: "Add the tracking tools", time: "1–2 hours", body: <>Set up track_parcel, reschedule_delivery, book_pickup and save_complaint as API request tools, plus a send_text tool with your depot map pin. Test each one.</> },
            { title: "Call it with real tracking numbers", time: "20 min", body: <>Track a parcel, move a delivery, book a pickup, complain, and ask in another language. Then add yourself to a test NDR campaign and take the call.</> },
          ]} />
          <PromptFile name="courier-voice-agent-instructions.txt" text={prompt} />
        </>,
      },
      {
        id: "cost",
        title: "What an AI voice agent for logistics costs",
        body: <>
          <RowTable caption="AI voice agents for logistics compared, prices checked 21 November 2026" firstColumn="Option" columns={["Price", "Calls on", "Good to know"]} rows={compare} highlight="Wapzen" />
          <p>A courier taking 1,500 calls a month at two minutes each uses 3,000 minutes: about <strong>$330</strong> at Retell’s calculator default of $0.11 a minute, or <strong>$420</strong> on Bland’s Start plan, before phone costs. Wapzen charges nothing, because the calls run over WhatsApp.</p>
          <p><strong>Choose a phone-line platform</strong> if you need to call thousands of customers a day from an uploaded list, or reach people who don’t use WhatsApp. <strong>Choose Wapzen</strong> if your customers already call and message you on WhatsApp and you want tracking, rescheduling and NDR calls handled for free. For written messages on the same number, see the <Link href="/blog/whatsapp-order-confirmation-messages">order confirmation message templates</Link>.</p>
        </>,
      },
    ]}
    faq={[
      { q: "What is an AI voice agent for logistics?", a: "An AI voice agent for logistics is software that answers and makes delivery calls in a natural voice. It gives tracking updates by looking up the tracking number in the courier’s system, reschedules deliveries, books pickups, takes complaints, and calls customers after failed deliveries. Wapzen runs one on a business’s existing WhatsApp number, free." },
      { q: "What is NDR calling?", a: "NDR calling means phoning a customer after a delivery attempt fails (a non-delivery report) to find out why and agree on the next step: a new delivery day, an address fix, a depot pickup or a return. An AI voice agent can make these calls and repeat the customer’s answer back." },
      { q: "Can an AI voice agent tell customers where their parcel is?", a: "Yes, if your tracking system has an API. The agent asks for the tracking number, reads it back, looks it up through an API request tool and tells the caller the status and expected delivery window." },
      { q: "Can the AI reschedule a delivery?", a: "Yes, through an API tool connected to your courier software. It offers the free slots, takes a landmark for the driver, repeats the change back and makes it only after the customer says yes." },
      { q: "Can it confirm cash-on-delivery orders before dispatch?", a: "Yes. Add the buyers to an outbound campaign and the agent calls each one on WhatsApp to confirm the order and that someone will be home. Every buyer in a campaign hears the same opening, and your team matches the answers to orders from the campaign’s list." },
      { q: "Can it call hundreds of customers a day?", a: "Not yet with Wapzen. Customers are added to a campaign one at a time in the dashboard, and there’s no spreadsheet upload or automatic redial, so it suits a few dozen exception calls a day. Phone-line platforms such as Retell offer batch calling from a list." },
      { q: "Does the voice agent speak the customer’s language?", a: "Yes. Set one language, or choose Multilingual and it replies in the language each caller speaks." },
      { q: "Can a caller reach a person?", a: "The agent can’t transfer a live call. It saves complaints and requests for your team through API tools, sends your depot or office details on WhatsApp, and every call’s transcript is saved in the dashboard." },
      { q: "How much does an AI voice agent for logistics cost?", a: "Wapzen is free, with no per-minute fees. Phone-line platforms charge by the minute: Retell AI $0.07–$0.31 and Bland AI $0.14 on its Start plan, plus phone costs (checked 21 November 2026)." },
    ]}
    sources={[
      { label: "ClickPost: e-commerce RTO statistics in India (FY2026 D2C network)", href: "https://www.clickpost.ai/blog/ecommerce-rto-statistics-india" },
      { label: "ClickPost: cash on delivery statistics in India (Meesho filing figures)", href: "https://www.clickpost.ai/blog/cash-on-delivery-statistics-india" },
      { label: "WhatsApp Business Messaging Policy (updated 23 September 2026): opt-in", href: "https://whatsappbusiness.com/policy/" },
      { label: "Retell AI: pricing", href: "https://www.retellai.com/pricing" },
      { label: "Bland AI: pricing", href: "https://www.bland.ai/pricing" },
      { label: "Vapi: pricing", href: "https://vapi.ai/pricing" },
    ]}
    related={["/blog/whatsapp-cod-order-confirmation", "/blog/ai-voice-agent-for-retail"]}
    product="/free-ai-calling-agent"
    cta={{ heading: <>Answer every “where’s my parcel?” call.<br /><span>Free, on your own WhatsApp number.</span></>, body: "Message our team on WhatsApp. We’ll switch the voice agent on, and you can link your number, connect your tracking system and take the first call today." }}
    action={{ href: voiceAccess, label: "Message us on WhatsApp" }}
  />;
}
