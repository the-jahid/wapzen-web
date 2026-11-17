import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { InlineCta, Note, RowTable } from "@/components/blog/BlogPost";
import { DayTimeline, JobBoard, PlaybookPost, PromptFile, SetupSteps, Templates, VoiceCard, type TimelineItem } from "@/components/blog/PlaybookPost";

// Industry picked 2026-11-17 by docs/seo-blog-industry-pick-research.mjs (16 industries,
// Google US/IN/GB/NG/ZA + DuckDuckGo US/IN/UK); hotels were second after schools on phrases
// that name the industry. Long tail from docs/seo-blog-three-industries-research.mjs:
// "ai front desk for hotels" 95, "ai chatbot for hotels" 80 (8/8), "ai for hotel booking" 80,
// "hotel chatbot" 80, "whatsapp chatbot for hotels", "ai receptionist for hotels", "whatsapp
// for hotels", "hotel booking confirmation message (sample)", "hotel guest message template",
// "ai concierge hotel", "best ai chatbot for hotels", "ai voice receptionist for hotels",
// "whatsapp hotel reservation scam". See docs/seo-research.md, "Industry pick 2026-11-17".
// Competitor facts read on their own pages 2026-11-17: Chatlab Hospitality Free (100 chatbot
// responses/month), Start $48 (20 rooms, 2,400), Grow $95, Scale $360; Runnr.ai Pro from
// €100/month, 12-month agreement, messaging fees charged on use.
// Copy rules (user, 2026-11-17): say it's free, say the WhatsApp voice agent works, no usage
// limits anywhere. Never "unlimited" or "free forever". The voice CTA opens the team's
// WhatsApp because the dashboard still shows VoiceUpdateNote. Honest product facts kept: the
// agent can't see a PMS or channel manager, replies only when someone writes, Take Order is
// the booking/maintenance request form (built for orders, so the post says to test it).
const href = "/blog/ai-chatbot-for-hotels";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to turn on the Wapzen voice agent for my hotel's WhatsApp number.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const day: TimelineItem[] = [
  { time: "00:47", channel: "chat", from: "Traveller in Germany, writing in German", message: "Haben Sie für Freitag ein Doppelzimmer frei? Was kostet es?", outcome: "request", reply: "Replied in German with the double room rate from the rate card, asked for the dates and number of guests, read them back and, after a yes, saved a booking request for the morning shift to confirm." },
  { time: "06:15", channel: "voice", from: "Guest arriving today, voice note", message: "🎤 “What time is check-in? Our flight lands at nine.”", outcome: "answered", reply: "Transcribed the voice note and answered: check-in is from 2 pm, bags can wait at reception, and the airport pickup costs $25." },
  { time: "08:30", channel: "chat", from: "Guest in room 12", message: "What time is breakfast and is it included?", outcome: "answered", reply: "Breakfast is 7 to 10 am on the terrace and included in every rate, as the hotel’s information says." },
  { time: "10:05", channel: "chat", from: "Family planning a holiday", message: "Can you send photos of the family room?", outcome: "sent", reply: "Sent the three family room photos and the rate card PDF the hotel uploaded." },
  { time: "12:40", channel: "chat", from: "Guest checking out", message: "Can I check out at 2 pm instead of 11?", outcome: "request", reply: "Explained the late check-out rule (until 1 pm for $15 when rooms allow) and saved the request so reception could say yes or no." },
  { time: "15:20", channel: "call", from: "Caller on WhatsApp", message: "📞 “Do you have parking, and how far is the beach?”", outcome: "call", reply: "The voice agent picked up the WhatsApp call and answered from the same hotel information: free parking behind the hotel, four minutes’ walk to the beach." },
  { time: "18:55", channel: "chat", from: "Guest who booked on Booking.com", message: "I booked through Booking.com. Can I pay at the hotel?", outcome: "answered", reply: "Gave the answer the hotel wrote for online travel agency bookings: pay as shown on the confirmation, card or cash accepted at check-in." },
  { time: "21:30", channel: "chat", from: "Guest in room 7", message: "The air conditioning isn’t working", outcome: "request", reply: "Said sorry, confirmed the room number and, after the guest said yes, sent a maintenance request that reached the duty manager’s WhatsApp at once. It didn’t promise a refund or a room change." },
  { time: "23:10", channel: "chat", from: "Guest from Saudi Arabia, writing in Arabic", message: "هل يوجد مطعم حلال قريب؟", outcome: "answered", reply: "Answered in Arabic with the two halal restaurants on the hotel’s list of local tips." },
];

const prompt = `You are the WhatsApp front desk assistant of Demo Bay Hotel, a 24-room hotel near the beach.
Say in your first message that you are the hotel's virtual assistant.
Reply in the guest's language, in two or three short sentences, and ask one question at a time.
Answer only from the hotel information you were given: rooms, rates, what is included, policies, facilities, directions and local tips. If something isn't there, say you will check with the front desk. Never invent prices, discounts or availability.
You can't see live availability. When someone wants to book, ask for the check-in and check-out dates, the number of adults and children, the room type and their name. Repeat the details back and send the booking request to the front desk only after they say yes. Say the front desk will confirm availability and the total price on this chat.
Never ask for card numbers, passwords or photos of ID in the chat.
For maintenance or housekeeping problems, say sorry, ask for the room number and send it to the front desk as a request.
Refunds, complaints about charges, changes to existing bookings and anything you can't answer: say a member of the team will reply on this chat soon.`;

const templates = [
  { title: "Booking confirmation message", when: "Your team sends it once the booking is confirmed", text: "Hi Maria, your booking at Demo Bay Hotel is confirmed ✅\nCheck-in: 12 December, from 2 pm\nCheck-out: 14 December, by 11 am\nRoom: Double with sea view, 2 adults, breakfast included\nTotal: $240, paid at check-in\nReply here with any question. See you soon!" },
  { title: "Pre-arrival message", when: "The day before arrival", text: "Hi Maria, we’re looking forward to welcoming you tomorrow! Check-in is from 2 pm. Would you like an airport pickup ($25)? Reply with your flight time and we’ll arrange it. Parking is free behind the hotel." },
  { title: "Welcome message at check-in", when: "When the guest arrives", text: "Welcome to Demo Bay Hotel, Maria! Breakfast is 7 to 10 am on the terrace. Message us here any time, day or night, for towels, taxis or tips on where to eat." },
  { title: "Reply to a booking enquiry", when: "When reception has checked the dates", text: "Hi Ali, thanks for asking about 20 to 22 December. A double room with breakfast is available at $110 a night, $220 in total. Shall we confirm it for you?" },
  { title: "Review request after check-out", when: "A few hours after the guest leaves", text: "Thank you for staying with us, Maria! If you enjoyed it, a short review would mean a lot to our small team: [review link]. Safe travels!" },
  { title: "Message for a guest who didn’t book", when: "A day after an enquiry went quiet", text: "Hi Ali, the sea view double you asked about is still free for 20 to 22 December. Book directly with us and breakfast is included. Shall we hold it for you?" },
];

const compare = [
  ["Chatlab (Hospitality plans)", "Free plan with 100 chatbot responses a month; Start $48/month for up to 20 rooms; Grow $95; Scale $360", "WhatsApp, Messenger, Instagram, web answers; voice from Grow", "Room limits per plan; VAT added where it applies"],
  ["Runnr.ai", "From €100/month (Pro), 12-month agreement", "WhatsApp, SMS, Booking.com/Expedia/Airbnb inboxes, web chat", "WhatsApp message fees charged on top, on use"],
  ["Wapzen", "Free, no card", "WhatsApp chats and WhatsApp calls, on your current number", "No PMS link by itself: your front desk confirms bookings"],
];

export default function AiChatbotForHotelsPage() {
  return <PlaybookPost
    href={href}
    heading={<>AI chatbot for hotels on WhatsApp.<br /><span>A front desk that never sleeps, for free.</span></>}
    lead="Guests message hotels on WhatsApp before they book, the night before they arrive and from their room. This playbook follows one day at a small hotel with an AI front desk on WhatsApp: what it answers, what it hands to your staff, how to set it up in an afternoon, guest messages to copy, and how it compares with paid hotel chatbots."
    answer={{
      title: "The short answer",
      body: <>An AI chatbot for hotels answers guests on WhatsApp in seconds, at any hour and in their own language: room rates, check-in times, breakfast, parking, directions and local tips. <strong>Wapzen</strong> puts one on the WhatsApp number your hotel already uses. It sends room photos and your rate card, takes booking requests for your front desk to confirm, and its voice agent answers WhatsApp calls. <strong>It’s free</strong>, with no Meta API key and no card.</>,
      specs: [["Price", "Free, no card"], ["Works on", "Your hotel’s current WhatsApp number"], ["Languages", "Replies in the guest’s language"], ["WhatsApp calls", "Answered by the AI voice agent"]],
    }}
    chapters={[
      {
        id: "what",
        title: "What an AI chatbot for hotels does",
        body: <>
          <p>A hotel’s WhatsApp gets four kinds of messages. <strong>Before booking:</strong> prices, availability, photos, location. <strong>Before arrival:</strong> check-in time, airport pickup, early check-in, parking. <strong>During the stay:</strong> breakfast, towels, late check-out, taxis, where to eat. <strong>After check-out:</strong> lost items, invoices, reviews. Most of them arrive when reception is busy or closed.</p>
          <p>An AI chatbot, sometimes called an AI front desk or AI concierge, reads each message the way the guest wrote it, including voice notes and photos, and answers from the information you give it. It isn’t a menu bot that makes guests press 1, 2 or 3. It’s closer to a trained receptionist who knows your rate card by heart and never goes off shift.</p>
          <p><strong>Wapzen</strong> links to your hotel’s existing WhatsApp number as a device, so your reception phone keeps working and staff can still reply themselves. It suits hotels, guest houses, B&amp;Bs, resorts, hostels, serviced apartments and homestays. To see how it works under the hood, read <Link href="/blog/what-is-a-whatsapp-chatbot">what a WhatsApp chatbot is</Link>.</p>
        </>,
      },
      {
        id: "day",
        title: "A day at the front desk, hour by hour",
        body: <>
          <p>Here is one day of WhatsApp messages at a made-up 24-room hotel by the sea, and what the AI did with each one. Green means it answered alone, amber means it saved a request for staff, blue means a WhatsApp call, and purple means it passed the chat to a person.</p>
          <DayTimeline items={day} caption="An illustrative day at a made-up hotel. Every answer comes from the information the hotel gave the agent; the guests and times are invented." />
          <p>Nine messages, five of them outside office hours, and nobody at reception had to type a reply. The two requests waited on the Orders page, and the maintenance alert reached the duty manager’s phone right away.</p>
        </>,
      },
      {
        id: "jobs",
        title: "Who does what: the AI, the AI with your team, your team",
        body: <>
          <JobBoard columns={[
            { tone: "ai", title: "The AI handles it", note: "From the information you give it", items: ["Room types, rates and what’s included", "Check-in, check-out and house rules", "Parking, pool, gym, breakfast and Wi-Fi questions", "Directions, airport pickup prices, local tips", "Room photos, rate card and menus", "Voice notes and photos, in any language"] },
            { tone: "request", title: "The AI takes it, your team confirms", note: "Saved on the Orders page and sent to a staff WhatsApp", items: ["Booking requests: dates, guests, room, name", "Early check-in and late check-out", "Airport pickups and taxis", "Maintenance and housekeeping problems", "Group, wedding and event enquiries"] },
            { tone: "team", title: "Your team does it", note: "The AI says someone will reply", items: ["Confirming availability for exact dates", "Payments, deposits and refunds", "Changing or cancelling a booking", "Complaints about charges", "Anything about a guest’s identity or bill"] },
          ]} />
          <p><strong>Why availability stays with your staff:</strong> Wapzen doesn’t connect to your property management system or channel manager by itself, so it can’t see which rooms are free. The AI collects the dates and your front desk confirms, which also protects you from double bookings across Booking.com, Expedia and walk-ins. If your booking engine has a public API, someone technical can connect it with an API tool so the agent checks real availability; the <Link href="/blog/whatsapp-appointment-booking">WhatsApp booking guide</Link> shows how.</p>
          <InlineCta title="Put an AI front desk on your hotel’s WhatsApp" body="Free: no card and no Meta API key, on the number your guests already have." label="Start free" />
        </>,
      },
      {
        id: "booking",
        title: "How the AI takes a booking request on WhatsApp",
        body: <>
          <p>Booking requests use Wapzen’s <strong>Take Order</strong> switch. It was built for shop orders, so here it works as a booking form; test it with a few made-up bookings before you rely on it. The flow:</p>
          <ol>
            <li><strong>The guest asks</strong> about a room. The AI quotes the rate from your rate card and offers to send a booking request.</li>
            <li><strong>It collects the details</strong> your instructions list: dates, adults and children, room type, name, arrival time.</li>
            <li><strong>It reads them back</strong> and asks the guest to confirm. Nothing is saved until the guest says yes.</li>
            <li><strong>The request is saved</strong> on your Orders page, and a WhatsApp alert goes to the number you chose, such as reception’s phone.</li>
            <li><strong>Reception checks the dates</strong> and replies on the same chat with the confirmation and how to pay.</li>
            <li><strong>If the guest writes again,</strong> the AI sees what reception said and carries on from there.</li>
          </ol>
          <p>The guest’s name and number come from WhatsApp, so they don’t have to type them. Every request also stays in the conversation history, so nobody has to scroll back to find what was asked.</p>
        </>,
      },
      {
        id: "setup",
        title: "Set it up in one afternoon",
        body: <>
          <SetupSteps items={[
            { title: "Write down your hotel’s information", time: "45 min", body: <>Rooms with prices per night and season, what’s included, check-in and check-out times, cancellation, child and pet policies, airport pickup prices, facilities, directions and your favourite local restaurants. Plain text, Word or PDF all work.</> },
            { title: "Sign up free and link your WhatsApp number", time: "5 min", body: <>On your phone open WhatsApp › Linked devices › Link a device › Link with phone number instead, and enter the 8-character code. On a computer you can scan the QR code instead. Your agent is created and starts answering straight away, so have step 1 ready first.</> },
            { title: "Paste your instructions", time: "10 min", body: <>Copy the instructions below, change the hotel name and rules to yours, and paste them into the agent’s prompt.</> },
            { title: "Add your information and photos", time: "15 min", body: <>Put your hotel information in the <strong>Knowledge Base</strong>. Upload room photos, the rate card and a map in <strong>Images &amp; Files</strong>, each with a note such as “send when someone asks for photos of the family room”. Add your website on the <strong>Web Search</strong> card.</> },
            { title: "Switch on Take Order for requests", time: "10 min", body: <>Write what a booking request needs, and add reception’s or the duty manager’s number under order alerts, so every request and maintenance problem pings a phone.</> },
            { title: "Test it like a guest", time: "15 min", body: <>From another phone: ask in another language, send a voice note, ask for photos, request a room, ask for a discount and complain about the air conditioning. Fix the instructions wherever an answer isn’t right.</> },
          ]} />
          <PromptFile name="hotel-front-desk-instructions.txt" text={prompt} />
          <Note>Give the agent only information you’re happy for anyone who messages to read. It can’t check who is really a guest, so keep door codes, safe codes and staff phone numbers out of it.</Note>
        </>,
      },
      {
        id: "templates",
        title: "Hotel guest message templates to copy",
        body: <>
          <p>The AI replies whenever a guest writes, but it doesn’t start conversations. Booking confirmations, pre-arrival messages and review requests come from your team, from the Wapzen dashboard or the hotel phone. When the guest replies, the AI answers with the whole conversation in view. Change the names, prices and dates to yours:</p>
          <Templates items={templates} />
          <Note>WhatsApp’s Business Messaging Policy asks businesses to message only people who gave them their number and agreed to hear from them. Message your own guests and enquiries, and stop if someone asks you to.</Note>
        </>,
      },
      {
        id: "trust",
        title: "WhatsApp booking scams: how to make guests trust your number",
        body: <>
          <p>People search for “hotel WhatsApp scam” for a reason: fraudsters pretend to be hotels on WhatsApp and ask for transfers to personal accounts. Guests are right to be careful, so make your real number easy to check.</p>
          <ul>
            <li><strong>Publish one number everywhere:</strong> your website, Google Business Profile, booking confirmations and the sign at reception.</li>
            <li><strong>Make it easy to start a chat</strong> with a link from our <Link href="/tools/whatsapp-link-generator">WhatsApp link generator</Link> on your website, and a <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR code</Link> in rooms and at reception.</li>
            <li><strong>Use your hotel’s name and logo</strong> on the WhatsApp profile, with your address and website.</li>
            <li><strong>Tell the AI never to ask for card details</strong> or ID photos in the chat, as the sample instructions do.</li>
            <li><strong>Say it in your confirmation:</strong> “We will never ask you to pay into a personal bank account.”</li>
          </ul>
        </>,
      },
      {
        id: "voice",
        title: "AI voice receptionist for hotels: WhatsApp calls",
        body: <>
          <p>Guests from abroad often call your WhatsApp number instead of typing, because it costs them nothing. Those calls ring while reception is checking someone in, or at 3 am.</p>
          <VoiceCard
            title="Let the AI answer your hotel’s WhatsApp calls"
            body="Wapzen’s voice agent picks up WhatsApp calls to your number in a natural voice and answers from the same hotel information as the chat agent."
            points={["Answers WhatsApp calls day and night", "Speaks the language you set for it","Answers rates, directions, check-in times and facilities", "Asks callers to send their dates on chat, where the booking request is saved"]}
            href={voiceAccess}
            label="Turn on the voice agent"
          />
          <p>Message our team on WhatsApp and we’ll switch the voice agent on for your number. It handles WhatsApp calls; calls to your landline stay with reception.</p>
        </>,
      },
      {
        id: "compare",
        title: "Best AI chatbot for hotels: how Wapzen compares",
        body: <>
          <RowTable caption="Hotel AI chatbots compared, prices checked 17 November 2026" firstColumn="Option" columns={["Price", "Channels", "Good to know"]} rows={compare} highlight="Wapzen" />
          <p><strong>Choose a hotel platform</strong> such as Chatlab or Runnr.ai if you want one inbox for Booking.com, Expedia, email and WhatsApp, or links to your hotel software across several properties. <strong>Choose Wapzen</strong> if your guests mostly write and call on WhatsApp and you want them answered tonight, on your own number, for free.</p>
          <p>Platforms built on the WhatsApp Business API pay Meta for template messages such as confirmations, and since 1 October 2026 also for service replies beyond the first 1,000 a month per number. Wapzen doesn’t use the API, so there are no Meta charges on top.</p>
        </>,
      },
    ]}
    faq={[
      { q: "What is the best free AI chatbot for hotels on WhatsApp?", a: "Wapzen is a free AI chatbot for hotels that runs on your hotel’s existing WhatsApp number. It answers guests 24/7 in their language from your rates and policies, sends room photos and the rate card, takes booking requests for your front desk to confirm, and answers WhatsApp calls with a voice agent. No Meta API key or card is needed." },
      { q: "Can an AI chatbot take hotel bookings on WhatsApp?", a: "Yes, as booking requests. The AI collects the dates, guests, room type and name, reads them back and saves the request once the guest confirms. Your front desk gets a WhatsApp alert, checks availability and confirms on the same chat, so you never get a double booking from the chatbot." },
      { q: "Does it connect to my PMS or channel manager?", a: "Not by itself. Wapzen answers from the information you give it and can’t see live availability. If your booking engine has a public API, it can be connected with an API tool; otherwise your team confirms each booking request." },
      { q: "Do I need the WhatsApp Business API for a hotel chatbot?", a: "Not with Wapzen. It links to the WhatsApp or WhatsApp Business app number you already use, like WhatsApp Web, so there is no Meta approval, no template fees and no new number." },
      { q: "Can the hotel chatbot reply in other languages?", a: "Yes. It replies in the language the guest writes or speaks in, including voice notes, so guests from abroad get answers in their own language." },
      { q: "Can my reception staff still reply on WhatsApp?", a: "Yes. The number keeps working on the hotel phone and in the Wapzen dashboard. Each conversation has its own AI switch, so staff can turn the AI off for one guest, reply personally and switch it back on." },
      { q: "Can AI answer hotel phone calls?", a: "Wapzen’s voice agent answers WhatsApp calls to your hotel’s number in a natural voice, from the same information as the chat agent. Calls to a landline or regular mobile line aren’t part of it." },
      { q: "How much does an AI chatbot for a hotel cost?", a: "Wapzen is free, with no card. Hotel chatbot platforms charge a monthly plan, for example Chatlab from $48 a month for up to 20 rooms and Runnr.ai from €100 a month on a 12-month agreement (checked 17 November 2026), and API platforms add Meta’s message fees." },
      { q: "Does it work for guest houses, B&Bs, hostels and resorts?", a: "Yes. Any place to stay that gets questions on WhatsApp can use it: hotels, resorts, guest houses, B&Bs, hostels, serviced apartments, villas and homestays." },
    ]}
    sources={[
      { label: "Chatlab: hospitality plans and prices", href: "https://www.chatlab.com/hospitality/" },
      { label: "Runnr.ai: pricing", href: "https://runnr.ai/pricing" },
      { label: "Meta for Developers: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
      { label: "WhatsApp Business Messaging Policy", href: "https://business.whatsapp.com/policy" },
    ]}
    related={["/blog/whatsapp-appointment-booking", "/blog/whatsapp-business-greeting-message"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Answer tonight’s guest messages.<br /><span>Free, on your hotel’s own WhatsApp number.</span></>, body: "Sign up, give the agent your rooms, rates and policies, and link your number. No card and no Meta API key." }}
  />;
}
