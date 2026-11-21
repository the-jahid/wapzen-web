import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { InlineCta, Note, RowTable } from "@/components/blog/BlogPost";
import { CallLog, CallTranscript, DoDont, JobBoard, PlaybookPost, PromptFile, SetupSteps, type CallLogItem, type CallTurn } from "@/components/blog/PlaybookPost";

// One of seven WhatsApp voice agent industry posts (2026-11-21), the "Travel & Hospitality"
// one. Keywords from docs/seo-blog-voice-seven-industries-research.mjs: "ai for hospitality
// industry" 241, "ai for travel agents" 227, "ai voice agent for hotels" 190, "ai voice assistant
// for hotels" 140, "ai voice agent for hospitality" 135, "ai voice agent for travel" 100, "ai voice
// assistant for travel" 95, "ai receptionist for hotels" 95, "voice ai for hotels" 90, "ai agent
// for travel agency" 85. The hotel chat playbook (/blog/ai-chatbot-for-hotels) covers chat; this
// post is calls only and links to it.
// Product facts: Multilingual replies in the caller's language and opens in the language of the
// welcome message (composeAgentInstructions); availability and enquiries only through API request
// tools; pre-arrival campaigns have one opening and the agent doesn't know guests' names or
// bookings; no live transfer; WhatsApp calls only. Vendor prices read 2026-11-21. WhatsApp policy
// (updated 23 Sep 2026): opt-in, no personal ID numbers.
const href = "/blog/ai-voice-agent-for-hotels-and-travel";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to set up the Wapzen WhatsApp voice agent for my hotel or travel business.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const day: CallLogItem[] = [
  { time: "02:10", direction: "in", who: "Traveller in Germany, speaking German", said: "“Haben Sie vom 12. bis 14. Dezember ein Doppelzimmer frei?” (Do you have a double room from 12 to 14 December?)", outcome: "checked", result: "Answered in German, checked the dates in the hotel’s booking engine through an API tool, quoted the double with breakfast and sent the booking link on WhatsApp." },
  { time: "07:30", direction: "in", who: "Guest arriving today", said: "“What time is check-in? Our flight lands at nine.”", outcome: "answered", result: "Check-in is from 2 pm, bags can wait at reception, and the airport pickup costs $25. It offered to send a pickup request." },
  { time: "09:45", direction: "out", who: "Guest arriving tomorrow", said: "“Hello, this is the virtual assistant of Demo Bay Hotel. We’re looking forward to welcoming you tomorrow. Would you like an airport pickup?”", outcome: "called", result: "Called from the pre-arrival campaign. The guest wanted a pickup at 11 am, so the agent read it back and saved the request for the front desk through an API tool." },
  { time: "11:20", direction: "in", who: "Couple on holiday nearby", said: "“Do you run snorkelling trips? How much are they?”", outcome: "answered", result: "Answered from the tour desk list: a half-day trip at 9 am for $45 a person, with gear included, and offered to send the details." },
  { time: "14:00", direction: "in", who: "Caller speaking Spanish", said: "“¿Tienen estacionamiento? ¿A qué distancia está la playa?” (Is there parking? How far is the beach?)", outcome: "answered", result: "Answered in Spanish: free parking behind the hotel, four minutes’ walk to the beach." },
  { time: "16:30", direction: "in", who: "Guest who booked online", said: "“I booked through Booking.com. Can I pay at the hotel?”", outcome: "answered", result: "Gave the hotel’s answer for online travel agency bookings: pay as the confirmation says, by card or cash at check-in." },
  { time: "23:40", direction: "in", who: "Guest in room 12", said: "“The air conditioning in my room isn’t working.”", outcome: "saved", result: "Apologised, confirmed the room number and saved a maintenance request through an API tool that alerts the duty manager. It didn’t promise a room change." },
];

const call: CallTurn[] = [
  { who: "agent", text: "Hello, you’ve reached Demo Holidays. I’m the agency’s virtual assistant. How can I help?" },
  { who: "caller", text: "Hi. How much is your Cancún package for two people in March?" },
  { who: "agent", text: "Our five-night Cancún package starts at 1,180 euros per person, with flights from Madrid, a beachfront hotel with breakfast and airport transfers. Prices depend on the dates. Which week are you thinking of?" },
  { who: "caller", text: "The 9th to the 14th." },
  { tool: "check_package", text: "Cancún, 5 nights, 9 to 14 March, 2 adults: available at 1,240 euros per person, transfers included." },
  { who: "agent", text: "For the 9th to the 14th of March it’s 1,240 euros per person, 2,480 for two, with flights, the hotel with breakfast and transfers. Would you like the full itinerary?" },
  { who: "caller", text: "Yes, please. Is travel insurance included?" },
  { who: "agent", text: "It isn’t included, but we can add it for 38 euros per person, and a consultant can explain the cover. I’m sending the itinerary now." },
  { tool: "send_text", text: "Sent the itinerary and the package terms to this WhatsApp chat." },
  { who: "agent", text: "It’s in the chat. Would you like a consultant to call you to book it?" },
  { who: "caller", text: "Yes, tomorrow after five." },
  { who: "agent", text: "Of course. May I have your name?" },
  { who: "caller", text: "Lucía Romero." },
  { who: "agent", text: "Thank you, Lucía. A consultant will call you tomorrow after 5 pm about the Cancún package for two, 9 to 14 March, with a question about insurance. Is that right?" },
  { who: "caller", text: "Yes, perfect." },
  { tool: "save_enquiry", text: "Saved the enquiry in the agency’s CRM: name, package, dates, two adults, insurance question, callback tomorrow after 5 pm." },
  { who: "agent", text: "All set. Thank you for calling Demo Holidays, Lucía. Goodbye!" },
  { tool: "end_call", text: "Ended the call after the goodbye." },
];

const prompt = `You are the virtual receptionist of Demo Bay Hotel, a 24-room hotel near the beach with a small tour desk. You answer and make WhatsApp calls.
At the start of every call, say you are the hotel's virtual assistant.
Speak warmly and briefly: one to three sentences, one question at a time. Say prices and dates the way a person says them aloud.
Answer only from the hotel information you were given: rooms, rates by season, what is included, check-in and check-out times, policies, facilities, parking, directions, airport pickup prices and the tour desk list.
Availability: ask for the check-in and check-out dates and the number of guests, then use check_availability. Quote only what it returns. Offer to send the booking link with send_text. Never say a room is booked unless the booking link was used or a tool confirmed it.
Requests (airport pickups, early check-in, late check-out, tours, maintenance): repeat the details back and save them with save_request after the guest confirms. Say the front desk will confirm on WhatsApp.
Never ask for card numbers or passport numbers. Never promise refunds, upgrades or discounts.
Calls to tomorrow's guests: welcome them, ask for their arrival time and whether they want an airport pickup, and save the answer with save_request.
When the caller has what they need, say goodbye and end the call.`;

const compare = [
  ["Retell AI", "$0.07–$0.31 a minute, pay as you go; $10 free credit", "Phone lines", "Phone numbers from $2 a month; telephony billed per minute"],
  ["Bland AI", "$0.14 a minute (Start), or $0.12 a minute + $299 a month (Build)", "Phone lines", "Phone billed separately"],
  ["Vapi", "$0.05 a minute platform fee + AI model, voice and transcription at cost", "Phone lines", "Build-your-own platform for developers"],
  ["WhatsApp Calling API platforms", "Calls guests make are free from Meta; calls you make are billed per minute; plus the platform’s fees", "WhatsApp, through the official API", "A guest must grant call permission before you call"],
  ["Wapzen", "Free, no per-minute fees", "WhatsApp, on your current number", "Availability only through your booking engine’s API"],
];

export default function AiVoiceAgentForHotelsAndTravelPage() {
  return <PlaybookPost
    href={href}
    heading={<>AI voice agent for hotels and travel, on WhatsApp calls.<br /><span>Every guest answered in their own language, for free.</span></>}
    lead="Travellers call hotels, tour operators and travel agencies on WhatsApp because it costs them nothing from anywhere in the world, and the calls arrive in every time zone. This playbook shows what an AI voice agent answers for hospitality and travel businesses, a sample call held in Spanish, pre-arrival and enquiry calls, setup and costs."
    answer={{
      title: "The short answer",
      body: <>An <strong>AI voice agent for hotels and travel</strong> answers and makes calls for hotels, guest houses, travel agencies and tour operators in a natural voice. It handles rates and availability, check-in times, directions and airport transfers, and package and itinerary questions. It also calls guests before they arrive and calls back people who asked about a trip. <strong>Wapzen</strong> runs one on your existing WhatsApp number, <strong>free</strong>, with no per-minute fees, and it can reply in each caller’s language. Live availability needs an API to your booking engine.</>,
      specs: [["Price", "Free, no per-minute fees"], ["Calls", "Rates, bookings, transfers, packages"], ["Languages", "One set language, or the caller’s"], ["Works on", "Your current WhatsApp number"]],
    }}
    chapters={[
      {
        id: "what",
        title: "What an AI voice agent does for hotels and travel businesses",
        body: <>
          <p>An AI voice agent is software that holds a real phone conversation: it understands the caller, answers from your information and takes actions in your systems, such as checking dates in your booking engine. In hospitality, that covers most of what reception and reservations hear all day: rates, availability, check-in times, parking, transfers, tours and “can I pay at the hotel?”.</p>
          <p>Travellers often call on WhatsApp rather than dial an international number, because a WhatsApp call costs them nothing beyond their data. That means calls from Germany at 2 am your time and from a guest at the airport who’s just landed. An AI voice agent answers them all, in the caller’s language, while your staff sleep or check guests in.</p>
          <p><strong>Wapzen</strong> runs the voice agent on your existing WhatsApp or WhatsApp Business number, linked as a device the way WhatsApp Web is, so reception keeps using the number. It suits hotels, resorts, guest houses, B&amp;Bs, hostels, serviced apartments, travel agencies, tour operators and transfer companies. For written messages on the same number, see the <Link href="/blog/ai-chatbot-for-hotels">AI chatbot for hotels playbook</Link>.</p>
        </>,
      },
      {
        id: "day",
        title: "A day of guest calls on WhatsApp",
        body: <>
          <p>One day at a made-up beach hotel with a small tour desk. Green means the agent answered alone, blue means it checked the booking engine, amber means it saved a request for staff, and orange is a call the agent made.</p>
          <CallLog items={day} caption="An illustrative day at a made-up hotel. Availability checks and saved requests go through API tools connected to the hotel’s own systems; everything else comes from its written information." />
          <p>Three of the seven calls came outside office hours and two weren’t in English. Every call’s transcript is in the dashboard’s Calls tab for the morning shift.</p>
        </>,
      },
      {
        id: "jobs",
        title: "What it handles for hotels and travel agencies",
        body: <>
          <JobBoard columns={[
            { tone: "ai", title: "The voice agent handles it", note: "From your rate card, brochure and house rules", items: ["Room types, rates and what’s included", "Check-in, check-out and house rules", "Directions, parking and airport transfer prices", "Tours and packages from your brochure", "Payment options for direct and online bookings", "Calls in the guest’s language"] },
            { tone: "request", title: "It does it through your system", note: "With API tools connected to your booking engine or CRM", items: ["Availability for exact dates", "Pickup, tour and maintenance requests", "Calls to tomorrow’s arriving guests", "Calling back people who asked about a package", "Saving enquiries for your consultants"] },
            { tone: "team", title: "Your staff do it", note: "The agent tells the guest who will reply", items: ["Confirming, changing and cancelling bookings", "Payments, deposits and refunds", "Group, wedding and event contracts", "Complaints about charges", "Visa and entry-rule questions"] },
          ]} />
          <InlineCta href={voiceAccess} title="Answer your guests’ WhatsApp calls with AI" body="Free, in their language, on the number they already have. Message our team and we’ll switch the voice agent on for you." label="Message us on WhatsApp" />
        </>,
      },
      {
        id: "call",
        title: "A sample call in Spanish: a travel package enquiry",
        body: <>
          <CallTranscript title="Incoming WhatsApp call · Demo Holidays voice agent" meta="3 min 10 s · held in Spanish, shown here in English · tools: check_package, send_text, save_enquiry, end_call" turns={call} caption="A sample call. The agent’s language was set to Multilingual, so it replied in Spanish from the caller’s first sentence. check_package and save_enquiry are API request tools connected to the agency’s own systems; the prices and dates are made up." />
          <p>The agent quoted the brochure’s starting price, then the real price for the real dates from the agency’s system. It sent the itinerary in writing and booked a consultant for the sale itself. That split works for most travel agencies: the AI handles the first call at any hour, and a person closes the booking.</p>
        </>,
      },
      {
        id: "languages",
        title: "Every guest in their own language",
        body: <>
          <p>Each voice agent has a language setting. Pick one language, and the agent speaks only that one, politely continuing in it even if a caller switches. Or pick <strong>Multilingual</strong>: the agent replies in whatever language the caller speaks and switches with them mid-call. It opens each call in the language of your welcome line, so write that line in the language most of your guests speak.</p>
          <p>Facts don’t change with the language. The agent answers from the same rate card and house rules whether the guest speaks German, Arabic or Spanish, and it says prices and times the way a person says them aloud. That’s why the information you give it matters more than the language list.</p>
        </>,
      },
      {
        id: "outbound",
        title: "Pre-arrival, enquiry and feedback calls",
        body: <>
          <p>The agent can call guests too. In <strong>Outbound</strong>, a campaign pairs a group of people with the voice agent, and each one is called on WhatsApp as soon as you add them. Three campaigns work well:</p>
          <ul>
            <li><strong>Tomorrow’s arrivals:</strong> welcome the guest, ask their arrival time and whether they need an airport pickup.</li>
            <li><strong>Package enquiries:</strong> call back people who asked about a trip on your website, answer their questions and book a consultant.</li>
            <li><strong>After the stay:</strong> thank the guest, ask how it went and pass any problem to the manager.</li>
          </ul>
          <Note>Every guest in a campaign hears the same opening, and the agent doesn’t know their name or booking unless they say it, so keep the opening general. Guests are added one at a time, with no spreadsheet upload or automatic redial yet, which suits a day’s arrivals rather than a chain’s whole guest list. Put your WhatsApp number in the booking confirmation and ask guests to save it: WhatsApp lets people silence calls from numbers that aren’t in their contacts.</Note>
        </>,
      },
      {
        id: "rules",
        title: "Rules for AI calls in hospitality and travel",
        body: <>
          <DoDont
            dos={["Say it’s the hotel’s or agency’s virtual assistant at the start of each call", "Quote rates and package prices from your price list, for the dates they apply to", "Let your booking engine or your staff confirm availability", "Send booking links, itineraries and maps on WhatsApp during the call", "Publish your WhatsApp number on your website and confirmations, so guests know it’s really you", "Call guests only about their stay or an enquiry they made"]}
            donts={["Take card or passport numbers on the call", "Say a booking is confirmed when your system hasn’t confirmed it", "Give visa or entry-rule advice beyond what you’ve written", "Promise refunds, upgrades or late check-outs staff haven’t approved", "Share door codes, safe codes or staff phone numbers", "Call travellers who never gave you their number"]}
          />
          <p>WhatsApp’s Business Messaging Policy (updated 23 September 2026) allows contact only with people who gave you their number and agreed to hear from you. It also bans asking people to share card numbers or personal ID numbers, which includes passport numbers. Fake hotel and travel accounts are common on WhatsApp, so a voice agent that never asks for payment details on a call is also how guests learn to trust your real number.</p>
        </>,
      },
      {
        id: "setup",
        title: "Set up a hotel voice agent",
        body: <>
          <SetupSteps items={[
            { title: "Write down your hotel or agency information", time: "45 min", body: <>Rooms or packages with prices by season, what’s included, check-in and check-out times, policies, facilities, directions, transfer prices, tours, and your answer for online travel agency bookings.</> },
            { title: "Ask our team to switch voice on", time: "2 min", body: <>Message us on WhatsApp from the button on this page. We turn the voice agent on for your account.</> },
            { title: "Link your reception’s WhatsApp number", time: "5 min", body: <>Create a voice agent and link the number from its <strong>Phone Number</strong> card by QR code or pairing code. Set calls to both directions for pre-arrival campaigns.</> },
            { title: "Paste the instructions and choose a language", time: "15 min", body: <>Copy the instructions below and change them to fit your property. Choose <strong>Multilingual</strong> if your guests come from many countries, and write the welcome line in the language most of them speak.</> },
            { title: "Connect your booking engine", time: "1–2 hours", body: <>If your booking engine or channel manager has an API, add check_availability and save_request as API request tools. Add send_text tools for the booking link and map. Without an API, start with the booking link and requests your staff confirm.</> },
            { title: "Call it from abroad", time: "20 min", body: <>Ask a friend to call in another language: ask rates for dates, request a pickup, ask about tours and report a broken air conditioner. Fix the instructions wherever an answer isn’t right.</> },
          ]} />
          <PromptFile name="hotel-voice-agent-instructions.txt" text={prompt} />
        </>,
      },
      {
        id: "cost",
        title: "What an AI voice agent for hotels costs",
        body: <>
          <RowTable caption="AI voice agents for hotels and travel compared, prices checked 21 November 2026" firstColumn="Option" columns={["Price", "Calls on", "Good to know"]} rows={compare} highlight="Wapzen" />
          <p>A hotel taking 600 calls a month at three minutes each uses 1,800 minutes: about <strong>$198</strong> at Retell’s calculator default of $0.11 a minute, or <strong>$252</strong> on Bland’s Start plan, before phone costs. On Wapzen it’s free, because guests call your WhatsApp.</p>
          <p><strong>Choose a phone-line platform</strong> if most bookings still come through your landline, or if calls must be transferred live to reservations. <strong>Choose Wapzen</strong> if guests already call your WhatsApp and you want those calls answered at any hour and in any language, for free.</p>
        </>,
      },
    ]}
    faq={[
      { q: "What is an AI voice agent for hotels?", a: "An AI voice agent for hotels is software that answers and makes guest calls in a natural voice. It handles rates, availability, check-in times, directions, transfers and requests, and calls guests before they arrive. Wapzen runs one on a hotel’s existing WhatsApp number, free, in the guest’s language." },
      { q: "Can an AI voice agent take hotel bookings by phone?", a: "If your booking engine has an API, the agent checks real availability for the guest’s dates and quotes it, then sends the booking link on WhatsApp. Without an API it takes a booking request for your front desk to confirm. It never says a booking is confirmed unless your system did it." },
      { q: "Can the voice agent speak to guests in their own language?", a: "Yes. Choose Multilingual and it replies in the language the caller speaks, switching if they switch. It opens each call in the language of your welcome line. You can also lock it to one language." },
      { q: "Can an AI voice agent handle travel agency enquiries?", a: "Yes. It answers package questions from your brochure, checks prices for exact dates through an API tool, sends itineraries on WhatsApp and books a consultant’s callback, so a person closes the sale." },
      { q: "Does it work with my PMS or booking engine?", a: "Through API request tools: if your booking engine or channel manager has an API, the agent can check availability and save requests during the call. There’s no built-in PMS connection." },
      { q: "Can it call guests before they arrive?", a: "Yes. Add tomorrow’s guests to an outbound campaign and the agent calls each on WhatsApp to welcome them, ask their arrival time and offer an airport pickup. Every guest in a campaign hears the same opening." },
      { q: "Does it answer the hotel’s landline?", a: "No. Wapzen’s voice agent answers and makes WhatsApp calls only. Landline calls stay with reception." },
      { q: "Can a guest reach a person?", a: "The agent can’t transfer a live call. It saves the guest’s request for the front desk, sends your contact details on WhatsApp, and staff can read every call’s transcript in the dashboard." },
      { q: "How much does an AI voice agent for a hotel cost?", a: "Wapzen is free, with no per-minute fees. Phone-line platforms charge by the minute: Retell AI $0.07–$0.31 and Bland AI $0.14 on its Start plan, plus phone costs (checked 21 November 2026)." },
    ]}
    sources={[
      { label: "WhatsApp Business Messaging Policy (updated 23 September 2026): opt-in and sensitive identifiers", href: "https://whatsappbusiness.com/policy/" },
      { label: "Retell AI: pricing", href: "https://www.retellai.com/pricing" },
      { label: "Bland AI: pricing", href: "https://www.bland.ai/pricing" },
      { label: "Vapi: pricing", href: "https://vapi.ai/pricing" },
    ]}
    related={["/blog/ai-chatbot-for-hotels", "/blog/ai-for-travel-agents-india"]}
    product="/free-ai-calling-agent"
    cta={{ heading: <>Answer every guest’s call, in their language.<br /><span>Free, on your own WhatsApp number.</span></>, body: "Message our team on WhatsApp. We’ll switch the voice agent on, and you can link your number, add your rates and take the first call today." }}
    action={{ href: voiceAccess, label: "Message us on WhatsApp" }}
  />;
}
