import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Samples } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "ai receptionist for medical office" (59), "whatsapp chatbot for
// hospital" (57), "ai receptionist for dental office" (55), "…for dental
// clinics" (48), "…for clinics" / "whatsapp ai receptionist" (40), "whatsapp
// automation for clinics" (37), "ai front desk for medical office" (24),
// autocomplete 2026-10-30 (docs/seo-blog-industry-research.mjs). Most "AI
// receptionist" products answer a phone line; this one answers WhatsApp chats
// and calls only, and the post says so. Booking mechanics live in
// /blog/whatsapp-appointment-booking; this post links there, not repeats it.
const href = "/blog/whatsapp-ai-receptionist-for-clinics";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const desk = [
  ["Practical questions", "Questions about a patient’s own treatment or bill", "Hours, fees, which doctor is in when, insurance accepted, directions, parking"],
  ["Visit preparation", "Changing anything a doctor has advised", "What to bring, fasting, arriving early, aftercare instructions your dentist wrote"],
  ["Appointments", "Confirming the slot, unless your software has an API", "Booking, rescheduling, and cancellation requests, saved for the front desk"],
  ["Urgent cases", "Everything clinical: triage, diagnosis, medicine", "Sends the patient to your emergency number straight away"],
];

const channels = [
  ["Answers", "Calls to your clinic’s phone line", "WhatsApp chats and WhatsApp calls"],
  ["Suits", "Patients who ring the landline", "Patients who already message you on WhatsApp"],
  ["Setup", "Forward your line to the service, or port it", "Link your WhatsApp number; no new number"],
  ["Cost", "Usually a monthly plan, often with per-minute or per-call limits", "Wapzen is free right now"],
];

const clinicSheet = `CLINIC: Smile Dental Care, 2nd floor, Rose Plaza, MG Road (above the pharmacy).
PARKING: free in the basement, entry from the side lane.
HOURS: Mon–Sat 10:00–20:00. Closed Sunday. Emergencies: call 98XXXXXXXX.
DOCTORS: Dr. Mehta, general dentistry, Mon–Fri. Dr. Rao, braces and aligners, Tue, Thu, Sat.
FEES: consultation ₹500. Cleaning ₹1,500. Root canal from ₹6,000; final price after the X-ray.
INSURANCE: we accept [list]. Bring your card; claims are filed by the patient.
BEFORE A VISIT: bring old X-rays and a list of your medicines. Arrive 10 minutes early.
AFTER AN EXTRACTION: [your dentist's written aftercare instructions, word for word].`;

const prompt = `You are the WhatsApp receptionist for [Clinic], a [dental clinic] in [area]. You answer questions about our services, doctors, fees, timings, and location, and take appointment requests.

Use only the information in your knowledge base. If something isn't there, say the front desk will reply.

Never give medical advice. Never suggest a diagnosis or a medicine, and never say whether a symptom is serious. If someone describes severe pain, swelling, bleeding, or an injury, ask them to call [emergency number] now. For questions about their own treatment, say the doctor's team will reply.

Don't ask about symptoms or medical history. To book, ask only for the type of visit (check-up, cleaning, consultation, follow-up), the preferred doctor if any, a preferred day and time within our hours, the patient's name, and a contact number. Repeat it back, and after they confirm, use save_booking_request. Say the front desk will confirm the time on WhatsApp within [2 working hours].

To reschedule or cancel, ask for the patient's name, the current appointment, and the new preferred time, then use save_booking_request with the type "reschedule" or "cancel".

Rules: short, warm replies, one question at a time. Never promise a slot yourself.`;

const messages = [
  { title: "Greeting message", text: "Hello and welcome to [Clinic] 😊 Ask us about treatments, fees, or timings, or tell us when you’d like to come in and we’ll book you. For emergencies, please call [number]." },
  { title: "After hours", text: "Thanks for your message. The clinic is closed now and opens at [10 am]. Our assistant can answer questions and take a booking request here. If you’re in severe pain, please call [emergency number]." },
  { title: "Booking confirmation", text: "Your appointment is confirmed: [cleaning] with [Dr. Mehta] on [Thursday 5 Nov] at [4:30 pm]. Please bring any old X-rays. Reply here if you need to change it." },
  { title: "Day-before reminder", text: "Reminder: your appointment at [Clinic] is tomorrow, [Thu 5 Nov], at [4:30 pm]. Reply YES to confirm or tell us if you need a new time." },
  { title: "After the visit", text: "Thanks for visiting [Clinic] today! Your aftercare notes are here: [link]. If anything feels wrong, call us on [number]." },
  { title: "Six-month recall", text: "Hi [Name], it’s been six months since your last check-up at [Clinic]. Would you like us to book your next cleaning? Reply with a day that suits you." },
  { title: "Missed appointment", text: "Hi [Name], we missed you at your [4:30 pm] appointment today. Would you like to book a new time? Just reply with a day that works." },
];

const faqs = [
  { q: "What is an AI receptionist for a dental office or clinic?", a: "It's an AI agent that handles the front desk's repeat work: it answers questions about hours, fees, doctors, and insurance, takes booking, reschedule, and cancellation requests, and sends urgent cases to your emergency number. Wapzen's works on WhatsApp chats and WhatsApp calls, on your clinic's own number." },
  { q: "Can it answer my clinic's phone line?", a: "No. Wapzen answers WhatsApp chats and WhatsApp calls to your WhatsApp number, not calls to a landline or a regular mobile number. If most of your patients ring the landline, a phone-line AI receptionist service fits better." },
  { q: "Can it book appointments into my practice management software?", a: "If the software has an API, yes: connect an API request tool that checks free slots and one that books, and the agent books in the chat or on the call. Without an API, it saves each request to a sheet and your front desk confirms the time." },
  { q: "Will it give patients medical advice?", a: "Not if you set it up as shown here. The instructions forbid diagnoses, medicine suggestions, and judging symptoms, and send anyone describing an urgent problem to your emergency number. It answers from the clinic information you upload and nothing else." },
  { q: "Is a WhatsApp AI receptionist HIPAA compliant?", a: "Don't assume any WhatsApp tool is. Messages pass through the tool's servers and an AI model to get a reply. If you're a US covered entity, ask any vendor for a business associate agreement before patient health information goes through it. The safe setup keeps the agent to scheduling and general questions." },
  { q: "How much does it cost?", a: "Wapzen is currently free, including the chat agent, the voice agent that answers WhatsApp calls, and reminder calling campaigns. Reminder template messages on the Business API are charged per message by Meta." },
];

const sources = [
  { label: "Meta: WhatsApp template categorization", href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/template-categorization" },
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "U.S. HHS: Business associates under HIPAA", href: "https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates/index.html" },
];

const sections = [
  {
    id: "front-desk",
    title: "What an AI receptionist handles at a clinic",
    body: <>
      <p>Most of a clinic’s WhatsApp is the same few questions: “Are you open Saturday?”, “How much is a cleaning?”, “Is Dr. Rao in on Thursday?”, “Can I move my appointment?” They arrive while the front desk is checking someone in, and after closing. An AI receptionist answers those and leaves everything clinical to your team:</p>
      <Comparison caption="What a clinic AI receptionist handles and what stays with staff" columns={["Stays with your team", "The AI receptionist"]} rows={desk} />
      <p>The same setup works for dental offices, GP and specialist clinics, physiotherapy, aesthetic and laser clinics, and veterinary practices. Only the knowledge base changes.</p>
    </>,
  },
  {
    id: "whatsapp-or-phone",
    title: "WhatsApp receptionist or phone-line AI receptionist?",
    body: <>
      <p>Most products sold as an “AI receptionist for medical offices” answer your phone line. A WhatsApp AI receptionist answers where many patients now get in touch first: WhatsApp messages and WhatsApp calls. Which one you need depends on how your patients reach you:</p>
      <Comparison caption="WhatsApp AI receptionist compared with a phone-line AI receptionist" columns={["Phone-line AI receptionist", "WhatsApp AI receptionist"]} rows={channels} />
      <p>In India, the Gulf, Latin America, much of Europe, and Africa, the clinic’s WhatsApp is often busier than its phone. That’s where this setup pays off. If your patients mostly ring a landline, Wapzen won’t answer those calls.</p>
    </>,
  },
  {
    id: "setup",
    title: "Set up the receptionist in four steps",
    body: <>
      <h3>1. Write your clinic sheet</h3>
      <p>In Wapzen, create a <strong>knowledge base</strong> and add the facts the front desk repeats every day. Short and specific beats a brochure:</p>
      <pre><code>{clinicSheet}</code></pre>
      <p>Paste aftercare instructions exactly as your dentist or doctor wrote them, so the agent passes them on word for word instead of rephrasing them.</p>
      <h3>2. Create the chat agent</h3>
      <p>Create a <strong>chat agent</strong>, attach the knowledge base, and adapt these instructions. The medical-advice and emergency rules matter most, so keep them:</p>
      <pre><code>{prompt}</code></pre>
      <h3>3. Add the booking tool</h3>
      <p>The <code>save_booking_request</code> tool saves each request to a Google Sheet for the front desk. The Apps Script, the tool’s parameters, and a live-booking option for practice software with an API are all in <Link href="/blog/whatsapp-appointment-booking">WhatsApp appointment booking</Link>. For this receptionist, add one more parameter, <code>type</code>: “new”, “reschedule”, or “cancel”.</p>
      <h3>4. Add a voice agent and link the number</h3>
      <p>Create a <strong>voice agent</strong> with the same knowledge base, tool, and rules, and set its language to the one most of your patients speak. Then open <strong>Phone Numbers</strong>, link the clinic’s WhatsApp number, and assign the chat agent and the voice agent to it. From then on, WhatsApp messages get a reply in seconds and WhatsApp calls are answered by the AI.</p>
      <Note>The chat agent replies to text in one-to-one chats. Photos, voice notes, documents, and group chats get no AI reply, and wait for your staff in WhatsApp as usual. The agent answers every text message while it’s live; there’s no per-chat takeover switch yet, so pause it whenever the front desk would rather answer everything.</Note>
      <InlineCta title="Give your front desk a WhatsApp receptionist" body="Free right now: an AI receptionist on your clinic’s WhatsApp number that answers patient questions and takes bookings, by chat or call." />
    </>,
  },
  {
    id: "reminders",
    title: "Reminders, recalls, and no-shows",
    body: <>
      <p>A receptionist answers patients who get in touch. Reminders go the other way, and on WhatsApp that changes what you need:</p>
      <ul>
        <li><strong>Day-before reminders by hand.</strong> Save the reminder below as a quick reply in WhatsApp Business and send it to tomorrow’s list each evening. Free, but slow past twenty a day.</li>
        <li><strong>Template messages on the Business API.</strong> Practice software connected to the API sends reminders automatically. Meta’s <a href="https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/template-categorization" target="_blank" rel="nofollow noopener noreferrer">category rules</a> treat a reminder about a booked appointment as <strong>utility</strong> (₹0.115 in India, $0.0034 in the US per message), but a recall that invites patients to book again can be classed as <strong>marketing</strong>, which costs several times more. See <Link href="/blog/whatsapp-business-api-pricing">WhatsApp Business API pricing</Link>.</li>
        <li><strong>Reminder calls with Wapzen.</strong> Create an outbound campaign with a voice agent that confirms the visit and takes reschedule requests, and add tomorrow’s patients as leads. Each lead is called as soon as it’s added. A lead carries a name and number, not the appointment, so the agent says “your appointment with us tomorrow” instead of the time, and Wapzen doesn’t redial patients who don’t answer.</li>
      </ul>
    </>,
  },
  {
    id: "messages",
    title: "Clinic and dental WhatsApp messages to copy",
    body: <>
      <p>Use the first two as your greeting and away messages, and save the rest as quick replies. Change the parts in brackets:</p>
      <Samples items={messages} />
    </>,
  },
  {
    id: "privacy",
    title: "Patient privacy and safety rules",
    body: <>
      <ul>
        <li><strong>Keep it to logistics.</strong> The safest receptionist doesn’t collect health information at all. The instructions above ask only for the visit type, a time, a name, and a number.</li>
        <li><strong>Know where messages go.</strong> WhatsApp encrypts messages to each device, and Wapzen is one of your number’s linked devices: its servers read each message and send it to an AI model to write the reply. Tell patients an assistant answers first.</li>
        <li><strong>Check your local rules.</strong> GDPR in Europe, the DPDP Act in India, and HIPAA in the US all apply to patient data. A US covered entity needs a <a href="https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/business-associates/index.html" target="_blank" rel="nofollow noopener noreferrer">business associate agreement</a> with any vendor that handles protected health information.</li>
        <li><strong>Make emergencies one step.</strong> Put your emergency number in the greeting, the away message, and the instructions, so nobody waits on a bot when it matters.</li>
      </ul>
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. It links your number as a device, so there’s no Business API account and no Meta message fees for its replies.</Note>
    </>,
  },
];

export default function WhatsAppAIReceptionistForClinicsPage() {
  return <BlogPost
    href={href}
    heading={<>A WhatsApp AI receptionist.<br /><span>For clinics and dental offices.</span></>}
    lead="Set up an AI receptionist on your clinic’s WhatsApp: it answers questions about fees, doctors, and timings, takes booking and reschedule requests, answers WhatsApp calls, and sends urgent cases to your emergency number, without ever giving medical advice."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>What it does:</strong> answers the front desk’s repeat questions and takes booking, reschedule, and cancellation requests, by WhatsApp chat or call.</>,
        <><strong>What it never does:</strong> diagnose, suggest medicine, or judge symptoms. Urgent cases go straight to your emergency number.</>,
        <><strong>What it isn’t:</strong> a phone-line service. It answers WhatsApp, not your landline.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-appointment-booking", "/blog/what-is-a-whatsapp-chatbot"]}
    product="/ai-receptionist"
    cta={{ heading: <>Your front desk, on WhatsApp.<br /><span>Open around the clock.</span></>, body: "Create a free AI receptionist, add your clinic’s details, and link your WhatsApp number. It answers patients and takes bookings right away." }}
  />;
}
