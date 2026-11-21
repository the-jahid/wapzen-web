import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { InlineCta, Note, RowTable } from "@/components/blog/BlogPost";
import { CallLog, CallTranscript, DoDont, JobBoard, PlaybookPost, PromptFile, SetupSteps, type CallLogItem, type CallTurn } from "@/components/blog/PlaybookPost";

// One of seven WhatsApp voice agent industry posts (2026-11-21). Keywords from
// docs/seo-blog-voice-seven-industries-research.mjs: "ai voice agent for healthcare" 795 (8/9,
// the strongest phrase of the run), "ai voice assistant for healthcare" 135, "voice ai for
// healthcare" 125 (8/9), "ai voice agent for clinics" 125, "ai phone agent for healthcare" 100,
// "best ai voice agent for healthcare" 85. "ai receptionist for medical office" is left to
// /ai-receptionist on purpose.
// Facts: WhatsApp Business Messaging Policy (updated 23 Sep 2026) section 3 on health
// information and section 1 on opt-in; Meta's WhatsApp Business Platform terms (Meta is not a
// HIPAA business associate); vendor prices read on their own pricing pages 2026-11-21 (Retell
// $0.07-$0.31/min, Bland $0.14/min Start or $0.12 + $299/month Build, Vapi $0.05/min + models
// at cost and a $2,000/month HIPAA add-on).
// Product facts from the Go voicecall server: WhatsApp calls only, no live transfer, each call
// starts fresh, the agent doesn't see the caller's number or a lead's name, campaign leads are
// added one at a time (no CSV import, no redial), lookups and bookings only through API request
// tools, send_text and end_call built in, transcripts in the Calls tab. No BAA. The CTA opens
// the team's WhatsApp, as on the other voice posts.
const href = "/blog/ai-voice-agent-for-healthcare";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to set up the Wapzen WhatsApp voice agent for my clinic.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const day: CallLogItem[] = [
  { time: "06:50", direction: "in", who: "Parent of a young patient", said: "“Are you open today? When does the children’s doctor start?”", outcome: "answered", result: "Gave today’s hours, 8 am to 8 pm, and said Dr. Rao sees children from 10 am, straight from the clinic’s timetable." },
  { time: "08:15", direction: "in", who: "New patient", said: "“I need to see a dentist this week. What do you have?”", outcome: "booked", result: "Checked the clinic’s booking software through an API tool, offered Thursday 11:30 am or 4 pm, booked 4 pm after the caller said yes, and sent the time and the map link on WhatsApp." },
  { time: "10:40", direction: "in", who: "Caller speaking Hindi", said: "“Full body checkup ka kitna charge hai?” (How much is a full-body check-up?)", outcome: "answered", result: "Answered in Hindi from the price list: the full-body check-up package costs ₹1,999 and reports are ready in 24 hours." },
  { time: "12:20", direction: "in", who: "Patient with a booking", said: "“Can I move Friday’s appointment to next week?”", outcome: "booked", result: "Asked for the booking reference from the WhatsApp confirmation, found the appointment through the API tool and moved it to Tuesday 9 am." },
  { time: "14:05", direction: "in", who: "Worried caller", said: "“My father has chest pain and he’s sweating. What should we do?”", outcome: "urgent", result: "Said it can’t give medical advice and told the caller to ring the emergency number now. It asked nothing about symptoms and ended the call so the line was free." },
  { time: "16:45", direction: "in", who: "Patient", said: "“Are my blood test results ready? Can you read them to me?”", outcome: "team", result: "Said results are never given over the phone and explained how the clinic shares them, as its instructions say." },
  { time: "18:30", direction: "out", who: "Patient due a dental check-up", said: "“Hello, this is the virtual assistant of Demo Family Clinic. You’re due for your six-month check-up. Would you like to book it?”", outcome: "called", result: "Called from the clinic’s recall campaign, offered three free slots and booked Saturday 10 am." },
  { time: "21:15", direction: "in", who: "Caller", said: "“Are you open on Sunday? Do you take my insurance?”", outcome: "answered", result: "Gave Sunday hours, 9 am to 1 pm, and named the insurers the clinic accepts, from its list." },
];

const call: CallTurn[] = [
  { who: "agent", text: "Hello, you’ve reached Demo Family Clinic. I’m the clinic’s virtual assistant. How can I help you today?" },
  { who: "caller", text: "Hi, I’d like to book a dental cleaning. Do you have anything this week?" },
  { who: "agent", text: "Of course. A cleaning with Dr. Silva takes about 40 minutes and costs 45 dollars. Would you prefer a morning or an afternoon?" },
  { who: "caller", text: "Afternoon, after three if possible." },
  { tool: "check_slots", text: "Asked the clinic’s booking software for cleaning slots after 3 pm this week: Thursday 3:30 pm and Friday 4:15 pm are free." },
  { who: "agent", text: "I have Thursday at half past three, or Friday at a quarter past four. Which suits you better?" },
  { who: "caller", text: "Thursday’s good." },
  { who: "agent", text: "Great. May I have your full name, please?" },
  { who: "caller", text: "Daniel Costa." },
  { who: "agent", text: "Thank you, Daniel. So that’s a dental cleaning with Dr. Silva on Thursday at 3:30 in the afternoon. Shall I book it?" },
  { who: "caller", text: "Yes, please." },
  { tool: "book_appointment", text: "Booked Thursday 3:30 pm for Daniel Costa. Booking reference DFC-2817." },
  { tool: "send_text", text: "Sent the time, the booking reference and the clinic’s map link to this WhatsApp chat." },
  { who: "agent", text: "You’re booked. I’ve sent the details and a map to this WhatsApp chat. Is there anything else I can help with?" },
  { who: "caller", text: "No, that’s all. Thanks!" },
  { who: "agent", text: "You’re welcome. See you on Thursday, Daniel. Goodbye!" },
  { tool: "end_call", text: "Ended the call after the goodbye." },
];

const prompt = `You are the virtual receptionist of Demo Family Clinic, answering and making WhatsApp calls.
At the start of every call, say you are the clinic's virtual assistant.
Speak warmly and briefly: one to three sentences, one question at a time.
Answer only from the clinic information you were given: doctors and their days, opening hours, services and prices, insurers we accept, payment methods, directions and parking. If something isn't there, say you don't have that information and give the reception hours.
You are not a doctor. Never give medical advice, never ask about symptoms, never suggest medicines and never discuss test results, prescriptions or diagnoses. If asked, say a doctor or nurse will help at the clinic.
Emergencies: if the caller mentions chest pain, trouble breathing, heavy bleeding, a stroke, someone who won't wake up or anything else that sounds urgent, tell them to call 112 or go to the nearest emergency department now, then end the call politely. Ask no further questions.
Bookings: ask which service they need and whether they prefer mornings or afternoons, find free times with check_slots, repeat the service, day, time and name back, and book with book_appointment only after they say yes. Then send the details with send_text.
To move or cancel a booking, ask for the booking reference from their WhatsApp confirmation.
Never ask for ID numbers, insurance policy numbers or card numbers.
When the caller has what they need, say goodbye and end the call.`;

const compare = [
  ["Retell AI", "$0.07–$0.31 a minute, pay as you go; $10 free credit", "Phone lines", "Phone numbers from $2 a month; telephony billed per minute"],
  ["Bland AI", "$0.14 a minute (Start), or $0.12 a minute + $299 a month (Build)", "Phone lines", "Phone billed separately"],
  ["Vapi", "$0.05 a minute platform fee + AI model, voice and transcription at cost", "Phone lines", "HIPAA add-on $2,000 a month"],
  ["WhatsApp Calling API platforms", "Calls patients make are free from Meta; calls you make are billed per minute; plus the platform’s fees", "WhatsApp, through the official API", "A patient must grant call permission before you call"],
  ["Wapzen", "Free, no per-minute fees", "WhatsApp, on your clinic’s current number", "No BAA: not for US patient health information"],
];

export default function AiVoiceAgentForHealthcarePage() {
  return <PlaybookPost
    href={href}
    heading={<>AI voice agent for healthcare, on WhatsApp calls.<br /><span>Every patient call answered, for free.</span></>}
    lead="Patients call clinics on WhatsApp to ask about hours, prices and appointments, often while the front desk is busy or closed. This playbook shows what an AI voice agent can safely handle in a clinic, a day of calls and one call in full, the health-data rules to follow, how to set it up, and what it costs next to phone-line voice AI."
    answer={{
      title: "The short answer",
      body: <>An <strong>AI voice agent for healthcare</strong> answers and makes patient calls in a natural voice: opening hours, services and prices, directions, appointment bookings and recall calls, in the patient’s language. <strong>Wapzen</strong> runs one on the WhatsApp number your clinic already uses, <strong>free</strong> and with no per-minute fees. Keep it to front-desk work: it isn’t for symptoms, diagnoses or test results, and Wapzen doesn’t sign a HIPAA business associate agreement.</>,
      specs: [["Price", "Free, no per-minute fees"], ["Calls", "Incoming and outgoing WhatsApp calls"], ["Works on", "Your clinic’s current WhatsApp number"], ["Best for", "Front-desk calls, never clinical advice"]],
    }}
    chapters={[
      {
        id: "what",
        title: "What an AI voice agent for healthcare does",
        body: <>
          <p>An AI voice agent, also called healthcare voice AI or an AI phone agent, is software that holds a real phone conversation. It listens to what the caller says, answers from the information you give it, and can take actions such as booking a slot in your appointment system. Unlike a phone menu, nobody has to press 1 for appointments: the patient simply says what they need.</p>
          <p>Most calls to a clinic’s front desk are the same few questions: Are you open? How much is it? Which doctor is in today? Can I come this week? Where do I park? Those are exactly the calls an AI voice agent handles well, at 7 am, during the lunchtime rush and on Sunday evening.</p>
          <p><strong>Wapzen’s voice agent works on WhatsApp calls.</strong> It links to your clinic’s existing WhatsApp or WhatsApp Business number as a linked device, the way WhatsApp Web does, so reception can keep using the number on its phone. When a patient taps the call button in your WhatsApp chat, the agent picks up. It can also call patients who agreed to hear from you, for example when they’re due a check-up. Calls to your landline aren’t part of it; they stay with reception.</p>
        </>,
      },
      {
        id: "day",
        title: "A day of patient calls on WhatsApp",
        body: <>
          <p>Here is one day of WhatsApp calls at a made-up family and dental clinic, and what the voice agent did with each. Green means it answered alone, blue means it used the clinic’s booking software, red means it sent the caller to emergency help, indigo means it left the matter for staff, and orange is a call the agent made.</p>
          <CallLog items={day} caption="An illustrative day at a made-up clinic. Answers come from the information the clinic gave the agent; bookings need an API tool connected to the clinic’s booking software." />
          <p>Eight calls, two of them outside opening hours, and reception didn’t pick up the phone once. Every call’s transcript is saved in the dashboard’s <strong>Calls</strong> tab, so staff can see what was said and what the agent did.</p>
        </>,
      },
      {
        id: "jobs",
        title: "What it handles, and what stays with your staff",
        body: <>
          <JobBoard columns={[
            { tone: "ai", title: "The voice agent handles it", note: "From your timetable, price list and policies", items: ["Opening hours, holidays and which doctor is in on which day", "Services and prices from your list", "Directions, parking and landmarks", "Insurers and payment methods you accept", "What to bring to a first visit", "Calls in the patient’s language"] },
            { tone: "request", title: "It does it through your system", note: "With API tools connected to your booking software", items: ["Booking, moving and cancelling appointments", "Recall calls to patients due a check-up", "Sending the address, map or booking link on WhatsApp during the call"] },
            { tone: "team", title: "Your staff do it", note: "The agent tells the caller how", items: ["Symptoms, diagnoses and medical advice", "Test results and prescriptions", "Emergencies: the agent sends callers to emergency services", "Bills, refunds and complaints", "Anything in a patient’s records"] },
          ]} />
          <p>The line between the columns is the line between front-desk information and clinical care. The agent never sees a patient’s file, and it shouldn’t: what it knows comes from your written information and, for bookings, from your booking software.</p>
          <InlineCta href={voiceAccess} title="Put an AI voice agent on your clinic’s WhatsApp" body="Free, on the number your patients already call. Message our team and we’ll switch the voice agent on for you." label="Message us on WhatsApp" />
        </>,
      },
      {
        id: "call",
        title: "A sample call: booking a dental cleaning",
        body: <>
          <p>This is what a booking call sounds like, turn by turn, with the actions the agent took in between. The patient never waits on hold and never presses a key.</p>
          <CallTranscript title="Incoming WhatsApp call · Demo Family Clinic voice agent" meta="2 min 05 s · English · tools: check_slots, book_appointment, send_text, end_call" turns={call} caption="A sample call. check_slots and book_appointment are API request tools the clinic set up for its own booking software; send_text and end_call are built in. The agent doesn’t see the caller’s phone number by itself, so if your booking software needs one, add it to the questions." />
          <p>Three details make calls like this work. The agent <strong>repeats the booking back</strong> and books only after a clear yes. It <strong>sends the details on WhatsApp</strong>, so the patient has the time and map in writing. And it <strong>ends the call politely</strong> once the patient has what they need, instead of leaving the line open.</p>
        </>,
      },
      {
        id: "booking",
        title: "Three ways to handle appointment bookings",
        body: <>
          <ol>
            <li><strong>Live booking in your software.</strong> If your appointment system has an API, add two API request tools: one that finds free slots and one that books. The agent then books into your real calendar during the call. If your system has no API, a no-code service such as Make or Zapier can sit in between. Test each tool with the dashboard’s <strong>Test tool</strong> button before a patient ever uses it.</li>
            <li><strong>Send your booking link.</strong> A send_text tool can carry a fixed message, such as your online booking page. The agent sends it to the caller’s WhatsApp while they’re still on the line.</li>
            <li><strong>Take the request.</strong> With no tools at all, the agent can collect the service, the preferred day and the name, and tell the caller that reception will confirm on WhatsApp. Your staff read the transcripts in the Calls tab and confirm. There’s no alert for each call, so check the tab a few times a day.</li>
          </ol>
          <p>Most clinics start with the second or third way on day one and connect their booking software later. The <Link href="/blog/whatsapp-appointment-booking">WhatsApp appointment booking guide</Link> covers the same three options for chat.</p>
        </>,
      },
      {
        id: "recall",
        title: "Recall calls to patients who are due a visit",
        body: <>
          <p>The voice agent can also make calls. In <strong>Outbound</strong>, create a campaign such as “six-month dental recall”, pick the voice agent, and add patients who agreed to be called. Each patient is called on WhatsApp as soon as you add them, and the campaign shows who answered, who didn’t and how long each call took.</p>
          <ul>
            <li><strong>Keep the message general.</strong> Every patient in a campaign hears the same opening, such as “you’re due for your check-up”, and the agent doesn’t see their file. It can’t read out a specific appointment time unless an API tool looks it up from a booking reference.</li>
            <li><strong>Add patients one at a time.</strong> There’s no spreadsheet upload or automatic redial yet, so recall campaigns suit dozens of calls a day, not thousands.</li>
            <li><strong>Ask patients to save your number.</strong> WhatsApp lets people silence calls from numbers that aren’t in their contacts, and a silenced call doesn’t ring. A saved number avoids that.</li>
          </ul>
        </>,
      },
      {
        id: "rules",
        title: "Health-data rules for AI calls on WhatsApp",
        body: <>
          <p>WhatsApp’s Business Messaging Policy, updated 23 September 2026, says: <em>“Don’t use WhatsApp for telemedicine or to send or request any health related information, if applicable regulations prohibit distribution of such information to systems that do not meet heightened requirements to handle health related information.”</em> The same policy lets you contact people only if they gave you their number and agreed to hear from you.</p>
          <p><strong>In the United States,</strong> Meta’s terms for the WhatsApp Business Platform say Meta isn’t a business associate under HIPAA, and Wapzen doesn’t sign business associate agreements either. Practices covered by HIPAA should keep patient health information off WhatsApp and use a voice AI vendor that signs a BAA. <strong>Elsewhere,</strong> follow your own country’s health-data law. The EU’s GDPR, for example, treats health data as a special category. Since 2 August 2026, the EU AI Act has also required that people be told when they’re talking to an AI system.</p>
          <DoDont
            dos={["Say at the start of every call that the caller is talking to the clinic’s virtual assistant", "Give it your timetable, prices, services, insurers and directions in writing", "Tell it exactly what to say in an emergency, with your country’s emergency number", "Keep bookings in your own appointment system and let the agent use it through API tools", "Read the call transcripts every week and fix wrong answers in the instructions", "Call only patients who gave you their number and agreed to calls"]}
            donts={["Let it give medical advice, assess symptoms or suggest medicines", "Let it read out test results, prescriptions or diagnoses", "Let it ask for ID, insurance policy or card numbers", "Use it for telemedicine or remote consultations", "Put patient health information through it as a HIPAA-covered practice in the US", "Let it promise anything your staff haven’t agreed to, such as same-day slots"]}
          />
        </>,
      },
      {
        id: "setup",
        title: "Set up a healthcare voice agent in an afternoon",
        body: <>
          <SetupSteps items={[
            { title: "Write down your clinic’s information", time: "45 min", body: <>Doctors and their days, opening hours and holidays, services with prices, the insurers you accept, payment methods, the address with a landmark, parking, what to bring to a first visit, and how you share results. Plain text, PDF or Word all work.</> },
            { title: "Ask our team to switch voice on", time: "2 min", body: <>Message us on WhatsApp from the button on this page. We turn the voice agent on for your account.</> },
            { title: "Link your clinic’s WhatsApp number", time: "5 min", body: <>Create a voice agent, then link the number from the agent’s <strong>Phone Number</strong> card: scan the QR code from WhatsApp › Linked devices, or use a pairing code. Reception keeps the number on its phone.</> },
            { title: "Paste the instructions and set the voice", time: "15 min", body: <>Copy the instructions below and change the clinic name, rules and emergency number to yours. Pick a voice, set the language (one language, or <strong>Multilingual</strong> to follow the caller), and write the opening line the agent says when it picks up.</> },
            { title: "Add your information and tools", time: "15 min", body: <>Put the clinic information in a <strong>Knowledge Base</strong> and attach it to the agent. Add a send_text tool with your map or booking link, and the booking tools if your software has an API.</> },
            { title: "Call it yourself", time: "15 min", body: <>From another phone, call the clinic’s WhatsApp: ask prices in another language, book and move a slot, ask for test results, and describe an emergency. Read the transcripts and fix the instructions wherever an answer isn’t right.</> },
          ]} />
          <PromptFile name="clinic-voice-agent-instructions.txt" text={prompt} />
          <Note>Change 112 to your country’s emergency number, such as 911 in the US and Canada or 999 in the UK. Each call starts fresh: the agent doesn’t remember earlier calls from the same patient, which also keeps one patient’s details out of another’s call.</Note>
        </>,
      },
      {
        id: "cost",
        title: "What a healthcare AI voice agent costs",
        body: <>
          <RowTable caption="AI voice agents for clinics compared, prices checked 21 November 2026" firstColumn="Option" columns={["Price", "Calls on", "Good to know"]} rows={compare} highlight="Wapzen" />
          <p>For a clinic with 1,000 minutes of calls a month, Retell’s pricing calculator shows $0.11 a minute with its default settings, about <strong>$110</strong> before telephony. Bland’s Start plan comes to <strong>$140</strong>, and Vapi’s own calculator estimates <strong>$82–$129</strong>. Wapzen costs nothing, because the calls run over WhatsApp. The <Link href="/blog/whatsapp-calling-api-pricing">WhatsApp Calling API pricing guide</Link> has Meta’s per-minute rates if you’re weighing the official API.</p>
          <p><strong>Choose a phone-line platform</strong> if patients mostly ring your landline, if you’re a US practice that needs a BAA, or if calls must be transferred live to a nurse. <strong>Choose Wapzen</strong> if your patients already call your WhatsApp and you want those calls answered tonight, for free. For written messages on the same number, see the <Link href="/industries/healthcare">WhatsApp chatbot for healthcare</Link>.</p>
        </>,
      },
    ]}
    faq={[
      { q: "What is an AI voice agent for healthcare?", a: "An AI voice agent for healthcare is software that answers and makes patient phone calls in a natural voice. It gives opening hours, prices and directions, books or moves appointments through the practice’s booking software, and calls patients who are due a visit. Wapzen runs one on a clinic’s existing WhatsApp number, free, with no per-minute fees." },
      { q: "Can an AI voice agent book patient appointments?", a: "Yes, if your appointment software has an API. The agent finds free slots and books them during the call through API request tools, then sends the details on WhatsApp. Without an API it can send your online booking link or take the request for your staff to confirm." },
      { q: "Is an AI voice agent on WhatsApp HIPAA compliant?", a: "Not with Wapzen. Meta’s terms say Meta isn’t a business associate under HIPAA for the WhatsApp Business Platform, and Wapzen doesn’t sign business associate agreements. US practices covered by HIPAA should keep patient health information off it and use a vendor that signs a BAA." },
      { q: "What does the agent do if a caller describes an emergency?", a: "It follows your instructions. The sample instructions tell it to stop, tell the caller to ring the emergency number or go to the nearest emergency department at once, and end the call. It never assesses symptoms." },
      { q: "Can the voice agent speak to patients in other languages?", a: "Yes. Set one language for the agent, or choose Multilingual and it replies in whatever language the caller speaks, switching if they switch." },
      { q: "Can it call patients to remind them about appointments?", a: "It can make recall calls, such as ringing patients who are due a check-up and booking them in. Every patient in a campaign hears the same opening and the agent doesn’t see their file, so it can only tell someone their appointment time if an API tool looks it up from a booking reference." },
      { q: "Does it answer the clinic’s landline?", a: "No. Wapzen’s voice agent answers and makes WhatsApp calls only. Calls to a landline or a regular mobile line stay with your reception." },
      { q: "Can a patient ask to speak to a person?", a: "The agent can’t transfer a live call. It can say when reception is open, send your phone number or address on WhatsApp during the call, and your staff can read every call’s transcript in the dashboard." },
      { q: "How much does an AI voice agent for a clinic cost?", a: "Wapzen is free, with no per-minute fees. Phone-line platforms charge by the minute: Retell AI $0.07–$0.31, Bland AI $0.14 on its Start plan, and Vapi $0.05 plus the AI model’s cost, with a $2,000-a-month add-on for HIPAA (prices checked 21 November 2026)." },
    ]}
    sources={[
      { label: "WhatsApp Business Messaging Policy (updated 23 September 2026): opt-in and health information", href: "https://whatsappbusiness.com/policy/" },
      { label: "Meta Terms for WhatsApp Business Platform (HIPAA)", href: "https://www.facebook.com/legal/Meta-Terms-for-WhatsApp-Business-Platform" },
      { label: "US HHS: the HIPAA Privacy Rule", href: "https://www.hhs.gov/hipaa/for-professionals/privacy/index.html" },
      { label: "EU AI Act, Article 50: transparency obligations", href: "https://artificialintelligenceact.eu/article/50/" },
      { label: "Retell AI: pricing", href: "https://www.retellai.com/pricing" },
      { label: "Bland AI: pricing", href: "https://www.bland.ai/pricing" },
      { label: "Vapi: pricing", href: "https://vapi.ai/pricing" },
    ]}
    related={["/blog/whatsapp-appointment-booking", "/blog/whatsapp-calling-api-pricing"]}
    product="/industries/healthcare"
    cta={{ heading: <>Answer tonight’s patient calls.<br /><span>Free, on your clinic’s own WhatsApp number.</span></>, body: "Message our team on WhatsApp. We’ll switch the voice agent on, and you can link your number, add your clinic information and take the first call today." }}
    action={{ href: voiceAccess, label: "Message us on WhatsApp" }}
  />;
}
