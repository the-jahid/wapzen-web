import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Topic from the voice industry harvest (2026-11-16, docs/seo-research.md, "Voice agent industry
// posts", docs/seo-blog-voice-industries-research.mjs, US/IN/GB x Google/YouTube/DuckDuckGo,
// scores out of 9 sources). Dental was the second industry cluster (1,021): "dental ai
// receptionist" 90 (9/9), "ai receptionist for dental office" 80 (6/9), "ai receptionist for
// dental clinics" 50 (6/9), "ai front desk receptionist for dental office" 44, "ai voice agent
// for dental clinic(s)" 30, "ai answering service for dental office" 30, "dental office phone
// answering service" 30. /industries/healthcare covers clinics on WhatsApp chat and
// /blog/whatsapp-chatbot-for-clinics-india covers Indian clinics on chat; this post is the
// voice / front-desk-calls angle for dental practices.
// Competitor facts read 2026-11-16: arini.ai shows no price and no pricing page (book a demo),
// describes inbound and outbound calls, scheduling and reminders, no WhatsApp. Viva AI's homepage:
// Gold $349, Platinum $899, Diamond $1,199 a month (4,000/7,000/12,000 credits), or Unlimited $350
// for the first provider + $150 per extra provider; "fully HIPAA compliant, with a BAA signed for
// every practice"; books into the PMS ("all major", none named); live call transfer on Platinum. Smith.ai AI receptionist: Free (25
// calls, $3 overage), Pro $150/month. None mentions WhatsApp.
// Health rules, same as /industries/healthcare: Meta Terms for WhatsApp Business Platform §4.2
// (Meta not a business associate, not HIPAA compliant); Wapzen signs no BAA; front-desk work
// only, no triage, no symptoms collected. Voice limits: WhatsApp calls only, no live transfer,
// ~1-2 s pause, leads carry only name/number/email (so recall calls are generic, never
// per-patient appointment reminders), no auto redial, no CSV import. Voice described as working
// (user rule 2026-11-15) and switched on over WhatsApp. "Free to start, no card".
const href = "/blog/dental-ai-receptionist";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like the Wapzen AI voice agent to answer WhatsApp calls for my dental clinic.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const handles = [
  ["“Are you open on Saturday?”", "Yes", "From your opening hours; it knows today’s date and time"],
  ["“How much is a scale and polish, or whitening?”", "Yes", "From your fee list, including “from” prices for treatments that vary"],
  ["“Do you take my insurance? Do you have payment plans?”", "Yes", "From the insurers and finance options you list"],
  ["“I’d like to register as a new patient”", "Yes", "Takes the name and preferred times, and sends your registration form link"],
  ["“Can I book a check-up next week?”", "Yes", "Takes the request; books it through an API tool or your staff confirm"],
  ["“I need to move my appointment”", "Yes", "Takes the change request and explains your cancellation policy"],
  ["“I have terrible toothache”", "Carefully", "Gives your emergency instructions word for word and never diagnoses"],
  ["“Is an implant better than a bridge for me?”", "No", "Clinical questions go to the dentist, who calls back"],
  ["“What were my X-ray results?”", "No", "It has no access to patient records, and shouldn’t"],
  ["“I want to complain about my treatment”", "Hands over", "Notes the request and says the practice manager will call back"],
];

const turns = [
  { from: "patient" as const, text: "Hi, I’d like to book a check-up. I haven’t been in about two years." },
  { from: "agent" as const, text: "Hello, you’re through to Demo Dental’s virtual assistant. Happy to help. Are you already registered with us, or would you be a new patient?" },
  { from: "patient" as const, text: "New, I just moved to the area." },
  { from: "agent" as const, text: "Welcome. A new patient exam with X-rays is from $90. Which days and times suit you best?" },
  { from: "patient" as const, text: "Weekday mornings, before ten. I’m Daniel." },
  { from: "agent" as const, text: "So that’s a new patient exam for Daniel, on a weekday morning before 10 am. Shall I send that to our reception team?" },
  { from: "patient" as const, text: "Yes please." },
  { from: "agent" as const, text: "Done. Reception will confirm a time with you on WhatsApp today, and I’ve sent you our new patient form and a map pin. Anything else?" },
];

const prompt = `You are the virtual assistant that answers WhatsApp calls for Demo Dental, a general and cosmetic dental practice.
Say at the start of each call that you are a virtual assistant and that calls are transcribed.
Speak in short sentences and ask one question at a time. This is a phone call: never read out long lists; offer to send them by WhatsApp instead.
Answer only from the opening hours, fees, insurers, payment plans and policies you were given. For treatments whose price depends on an exam, give the "from" price and say the dentist confirms the cost after the exam. Never invent prices or offers.
Appointment requests: ask whether they are a new or existing patient, the type of visit (check-up, hygiene, consultation, whitening), their name and the days and times that suit them. Don't ask about symptoms or medical history. Repeat the request back, send it only after the caller confirms, and say reception will confirm the time on WhatsApp. Never say a slot is free.
Emergencies: if the caller mentions pain, swelling, bleeding, a broken or knocked-out tooth, read the emergency instructions exactly as written. If they mention swelling spreading to the eye or neck, difficulty breathing or swallowing, or bleeding that won't stop, tell them to call the local emergency number now. Never diagnose or suggest medicine.
Clinical questions, treatment advice, records, results, complaints and anything you can't answer: say the dentist or practice manager will call back, and note the caller's name and best time to call.`;

const compare = [
  ["Which calls it answers", "Calls to the practice phone line, plus texts", "WhatsApp calls to the clinic’s WhatsApp number"],
  ["Price, from their own sites", "Arini: no price shown, book a demo. Viva AI: $349 to $1,199 a month by credits, or $350 for the first provider on its Unlimited plan", "Free to start, no card, and no per-minute fees"],
  ["Booking", "Books into the practice management system", "Takes the request; books through an API tool or your staff confirm"],
  ["HIPAA", "Viva AI says it is HIPAA compliant and signs a BAA", "No BAA: front-desk questions only"],
  ["Outbound calls", "Recall and reactivation campaigns", "Calling campaigns to patients who agreed, with a general message"],
  ["Live transfer", "Viva AI lists live call transfer", "Not available: staff call back"],
];

const fit = [
  ["Clinic whose patients call and message on WhatsApp", "Yes", "Answers the calls reception misses while the team is chairside"],
  ["Solo dentist or small practice with no full-time receptionist", "Yes", "Covers lunch breaks, evenings and weekends"],
  ["Cosmetic, orthodontic or implant clinic with international patients", "Yes", "Patients abroad can call free over WhatsApp, in the language you set"],
  ["US practice that needs HIPAA and a signed BAA", "No", "Use a HIPAA-compliant phone AI; Wapzen signs no BAA"],
  ["Practice that wants calls booked straight into its software with no setup", "Not out of the box", "Needs an API tool to your system, or a dental-specific product"],
];

const sources = [
  { label: "Meta Terms for WhatsApp Business Platform, section 4.2 (health information, HIPAA)", href: "https://www.facebook.com/legal/Meta-Terms-for-WhatsApp-Business-Platform" },
  { label: "WhatsApp Business Messaging Policy", href: "https://business.whatsapp.com/policy" },
  { label: "US HHS: the HIPAA Privacy Rule", href: "https://www.hhs.gov/hipaa/for-professionals/privacy/index.html" },
  { label: "Arini: AI receptionist for dental practices", href: "https://www.arini.ai/" },
  { label: "Viva AI: plans, HIPAA and BAA", href: "https://www.getviva.ai" },
  { label: "Smith.ai: AI receptionist pricing", href: "https://smith.ai/pricing/ai-receptionist" },
];

const questions = [
  {
    id: "what",
    q: "What is a dental AI receptionist?",
    answer: "A dental AI receptionist is a voice agent that answers your practice’s calls when reception can’t: opening hours, fees, insurance and payment plans, new patient registration and appointment requests. It hands clinical questions to the dentist. Wapzen’s version answers WhatsApp calls on the number your patients already message, and it’s free to start.",
    body: <>
      <p>Reception is busy with the patient in front of them, the hygienist needs a hand chairside, and the phone keeps ringing. Patients who reach no one often book with the next clinic on the list. An <strong>AI receptionist for dental offices</strong> answers those calls straight away, from the hours, fees and rules you give it, and passes everything clinical to your team.</p>
      <p>US products such as Arini and Viva AI answer the practice phone line. <strong>Wapzen</strong> answers <strong>WhatsApp calls</strong>: it links your clinic’s WhatsApp number as a device, so the AI voice agent picks up calls to that number while your phone keeps working. There’s no WhatsApp Business API to set up, and it’s free to start, with no credit card.</p>
      <p>The same number can run an AI chat agent for messages too. The <Link href="/industries/healthcare">WhatsApp for healthcare</Link> page covers the chat side for clinics.</p>
    </>,
  },
  {
    id: "why-whatsapp",
    q: "Why should a dental clinic answer WhatsApp calls?",
    answer: "Because many patients call the clinic on WhatsApp. They find you on Google or Instagram and tap the WhatsApp button, the call is free over data, and patients abroad can reach you without international rates. The call happens in the same chat where you send the form, the map pin and the confirmed time. It doesn’t answer landline calls.",
    body: <>
      <ul>
        <li><strong>Patients already use it.</strong> In India, the UK, the Middle East, Latin America and much of Africa and Europe, many clinics put their WhatsApp number on Google, Instagram and their signs.</li>
        <li><strong>One chat for everything.</strong> The confirmation, the new patient form and the directions arrive in the same WhatsApp chat as the call.</li>
        <li><strong>Dental tourism.</strong> Cosmetic, implant and orthodontic clinics with patients abroad get free calls instead of missed international ones.</li>
        <li><strong>No per-minute cost.</strong> WhatsApp calls run over the internet.</li>
      </ul>
      <p>The limit: Wapzen answers WhatsApp calls only. If most patients call your landline, a phone-line AI suits you better, or you can add “Call us on WhatsApp” to your Google Business Profile and website.</p>
    </>,
  },
  {
    id: "handles",
    q: "What can a dental AI receptionist answer?",
    answer: "Front-desk calls: opening hours, location and parking, fees and “from” prices for treatments, insurers and payment plans, new patient registration, appointment, reschedule and cancellation requests. It gives your emergency instructions word for word. It doesn’t diagnose, give treatment advice or see records; those calls go to the dentist.",
    body: <>
      <Comparison caption="How a WhatsApp dental AI receptionist handles everyday calls" columns={["Does it handle it?", "How"]} rows={handles} />
      <p>The agent answers from the information you upload as text, PDF or Word. If a fee or policy isn’t there, it says so and offers a call back. For treatments priced after an exam, give it the “from” price and tell it to say the dentist confirms the cost.</p>
    </>,
  },
  {
    id: "appointments",
    q: "Can it book dental appointments?",
    answer: "It takes the request, reads it back and confirms. The agent asks whether the caller is a new or existing patient, the type of visit, their name and the times that suit them, then sends the request after they say yes. With an API tool it can book in your practice software; without one, reception confirms the slot on WhatsApp.",
    body: <>
      <p>Here’s how a new patient call could go at a made-up clinic:</p>
      <ChatExample
        business="Demo Dental"
        labels={{ subtitle: "WhatsApp call · AI voice agent", agent: "AI agent: ", patient: "Caller: " }}
        turns={turns}
        caption="An illustrative call transcript for a made-up clinic. The fee comes from the information the clinic gave the agent."
        points={[
          { title: "Says it’s a virtual assistant", body: "And that the call is transcribed, as the instructions tell it to." },
          { title: "Asks about the visit, not symptoms", body: "A type of visit and preferred times are enough to book a check-up." },
          { title: "Reads the request back", body: "It waits for a clear yes before sending it to reception." },
          { title: "Sends the form and map", body: "WhatsApp messages during the call, so the patient has them in writing." },
        ]}
      />
      <p>Wapzen has no calendar of its own. If your practice software has an API, someone technical can connect it as an API tool so the agent checks real free slots; the <Link href="/blog/whatsapp-appointment-booking">WhatsApp appointment booking guide</Link> shows how a booking tool works. Test it with made-up bookings before patients use it.</p>
    </>,
  },
  {
    id: "emergencies",
    q: "How should a dental AI receptionist handle emergencies?",
    answer: "By reading your emergency instructions exactly as written, and never diagnosing. Write what to do for toothache, a broken or knocked-out tooth and swelling, with your emergency number or out-of-hours service. Tell it to direct callers with swelling near the eye or neck, trouble breathing or swallowing, or heavy bleeding to emergency services at once.",
    body: <>
      <ul>
        <li><strong>Write the words you want said.</strong> “For severe pain out of hours, call our emergency line on…” is safer than letting the AI improvise.</li>
        <li><strong>Red flags go to emergency services.</strong> Spreading facial swelling, difficulty breathing or swallowing and bleeding that won’t stop are medical emergencies, not booking requests.</li>
        <li><strong>No medicine advice.</strong> The sample instructions below tell the agent never to suggest painkillers or antibiotics.</li>
        <li><strong>Read the transcripts.</strong> Check every call where emergency instructions were given, so someone follows up.</li>
      </ul>
    </>,
  },
  {
    id: "hipaa",
    q: "Is a WhatsApp dental AI receptionist HIPAA compliant?",
    answer: "No. Meta’s terms say the WhatsApp Business Platform isn’t HIPAA compliant and that Meta isn’t a business associate, and Wapzen doesn’t sign business associate agreements. US practices covered by HIPAA should use a HIPAA-compliant phone AI or ask their compliance officer. Elsewhere, keep calls to front-desk tasks and tell patients calls are AI-answered and transcribed.",
    body: <>
      <p>In the US, even a name with an appointment time can be protected health information for a covered dental practice. Viva AI, for example, says it is HIPAA compliant and signs a BAA; Wapzen doesn’t.</p>
      <p>Outside the US, data protection laws still treat health information as sensitive: the GDPR in the UK and Europe, and the DPDP Act in India. Keep the agent to front-desk work:</p>
      <ul>
        <li><strong>Don’t collect symptoms or medical history on the call.</strong> The type of visit is enough to book.</li>
        <li><strong>Say it’s an AI and the call is transcribed,</strong> at the start of every call, and mention it in your privacy notice.</li>
        <li><strong>Keep clinical conversations with your team</strong> on the systems you already use for them.</li>
      </ul>
      <Note>This is general information, not legal advice. Ask your adviser what your country’s rules require.</Note>
    </>,
  },
  {
    id: "recalls",
    q: "Can it call patients for check-up recalls?",
    answer: "Yes, with a general message. Add patients who agreed to hear from you to an outbound calling campaign, and the agent calls each one on WhatsApp, says it’s the clinic’s virtual assistant, offers a check-up and takes the request. Each patient carries only a name, number and email, so it can’t read out individual appointment times.",
    body: <>
      <p>Recall calls work well for “it’s been a while since your last check-up, would you like to book?” They don’t work for “your appointment is on Tuesday at 10”, because the campaign doesn’t hold each patient’s appointment. Send those reminders from your practice software or by message.</p>
      <ul>
        <li><strong>Only patients who opted in.</strong> WhatsApp restricts numbers that make unwanted calls.</li>
        <li><strong>Add patients one by one or by API.</strong> There’s no CSV import, and no automatic redial for unanswered calls.</li>
        <li><strong>Every call has a transcript,</strong> so reception can see who asked to book.</li>
      </ul>
    </>,
  },
  {
    id: "send",
    q: "Can it send forms and directions during the call?",
    answer: "Yes. With a send-message tool, the voice agent sends a WhatsApp message to the caller while the call is still going: your new patient form, a Google Maps pin, your fee list, a finance application link or a summary of their appointment request. Set up one message per job and say in the instructions when to send each.",
    body: <>
      <p>A caller who asks about whitening doesn’t need every price read aloud. The agent can give the starting price and say “I’ve sent you our cosmetic price list on WhatsApp.” It’s there in the chat when they hang up.</p>
    </>,
  },
  {
    id: "instructions",
    q: "What should a dental AI receptionist’s instructions say?",
    answer: "Who it is and that it’s a virtual assistant, to speak briefly because it’s a call, to answer only from your hours and fees, how to take an appointment request without asking about symptoms, your emergency wording and red flags, what never to do (diagnose, suggest medicine, promise a slot), and when the dentist or manager calls back.",
    body: <>
      <p>These instructions are for a made-up clinic. Change them to yours:</p>
      <pre>{prompt}</pre>
      <ul>
        <li><strong>Keep answers short.</strong> There’s a pause of about one to two seconds before each answer, so long replies make a call feel slow.</li>
        <li><strong>Test it like a nervous patient.</strong> Ask about a toothache at 11 pm, ask for a cheaper price, ask whether you need a root canal, and read each transcript.</li>
      </ul>
      <InlineCta href={voiceAccess} title="Answer every WhatsApp call to your clinic" body="Free to start, no card. Message our team on WhatsApp and we’ll switch the voice agent on for your number." label="Message us on WhatsApp" />
    </>,
  },
  {
    id: "compare",
    q: "How does it compare with Arini, Viva AI and other dental AI receptionists?",
    answer: "Arini and Viva AI answer the practice phone line and book into dental scheduling software; Arini shows no price on its site, Viva AI lists plans from $349 a month, and Viva says it signs a BAA. Wapzen answers WhatsApp calls on your current number, is free to start, books through an API tool or your staff, and signs no BAA.",
    body: <>
      <Comparison caption="Dental AI receptionists compared with Wapzen’s WhatsApp voice agent" columns={["Dental phone AI (Arini, Viva AI)", "Wapzen"]} rows={compare} />
      <p>Choose a dental phone AI if you’re a US practice that needs HIPAA, most patients call your landline, and you want bookings in your software on day one. Choose Wapzen if your patients call and message you on WhatsApp and you want those calls answered today without a monthly fee. General AI receptionists such as Smith.ai are another option for phone lines.</p>
    </>,
  },
  {
    id: "cost",
    q: "How much does a dental AI receptionist cost?",
    answer: "Wapzen is free to start, with no card and no per-minute fees, because calls run over WhatsApp. Dental phone AI costs more: Viva AI lists plans from $349 a month, and Arini prices by demo. General AI receptionists such as Smith.ai start at $150 a month for 75 calls, with a free plan of 25 calls.",
    body: <>
      <ul>
        <li><strong>Wapzen:</strong> free to start on your current number. Clinics that need more can arrange a paid plan with our team on WhatsApp.</li>
        <li><strong>Viva AI:</strong> Gold $349, Platinum $899 and Diamond $1,199 a month, priced by credits, or Unlimited at $350 a month for the first provider plus $150 for each extra one.</li>
        <li><strong>Arini:</strong> no price on its site; you book a demo.</li>
        <li><strong>Smith.ai AI receptionist:</strong> free for 25 calls a month, then $3 a call, or Pro from $150 a month.</li>
      </ul>
      <p>Prices were read from each vendor’s site on 16 November 2026. Check them before you compare.</p>
    </>,
  },
  {
    id: "setup",
    q: "How do I set up an AI receptionist for my dental clinic?",
    answer: "Sign up free and link the clinic’s WhatsApp number with a pairing code or QR code. Message our team on WhatsApp to switch the voice agent on. Write its instructions with your emergency wording, upload your hours, fees, insurers and policies, add messages with your form and map links, and test it with calls from another phone.",
    body: <>
      <ol>
        <li><strong>Sign up free.</strong> No card and no API key.</li>
        <li><strong>Link the number.</strong> In WhatsApp: Linked devices › Link a device › Link with phone number instead, and enter the code. On a computer you can scan the QR code.</li>
        <li><strong>Switch on voice.</strong> <a href={voiceAccess} target="_blank" rel="noopener noreferrer">Message our team on WhatsApp</a> and we’ll set up the voice agent for your number.</li>
        <li><strong>Upload what it reads:</strong> opening hours, fees and “from” prices, insurers, payment plans, cancellation policy and emergency instructions.</li>
        <li><strong>Add tools:</strong> a message with your new patient form, one with the map pin, and an API tool to your practice software if it has an API.</li>
        <li><strong>Test it after hours.</strong> Call from another phone, book a check-up, report a toothache, ask a clinical question, and read the transcripts.</li>
      </ol>
    </>,
  },
  {
    id: "not-do",
    q: "What doesn’t a WhatsApp dental AI receptionist do?",
    answer: "It doesn’t answer landline calls, transfer a live call, diagnose, give treatment or medicine advice, read patient records, sign a BAA, or book into your practice software unless an API tool connects it. It pauses briefly before each answer. It isn’t Meta’s official API, so it should only call patients who agreed.",
    body: <>
      <Comparison caption="Which dental practices a WhatsApp AI receptionist suits" columns={["Good fit?", "Why"]} rows={fit} />
      <ul>
        <li><strong>It works on your current number,</strong> personal or WhatsApp Business, as a linked device.</li>
        <li>Wapzen is an independent product, not made by Meta or WhatsApp.</li>
      </ul>
    </>,
  },
];

export default function DentalAiReceptionistPage() {
  return <QaPost
    href={href}
    heading={<>Dental AI receptionist on WhatsApp.<br /><span>Answer every patient call, even mid-treatment.</span></>}
    lead="Patients who can’t get through often book with the next clinic. Here are 13 questions dentists and practice managers ask before handing calls to AI: what a dental AI receptionist answers, how it takes appointment requests, how it should handle emergencies, whether it’s HIPAA compliant, recall calls, how it compares with Arini and Viva AI, what it costs and how to set it up."
    verdict={{
      title: "The short answer",
      body: <>A dental AI receptionist answers your clinic’s calls from your own hours, fees and policies. With <strong>Wapzen</strong> it answers <strong>WhatsApp calls</strong> on the number your patients already use: it quotes fees, registers new patients, takes appointment requests for reception to confirm, reads your emergency instructions and sends forms and directions by WhatsApp. It never diagnoses, and it signs no HIPAA BAA. <strong>It’s free to start</strong>, with no per-minute fees.</>,
    }}
    facts={[["Price", "Free to start, no card"], ["Calls it answers", "WhatsApp calls to your number"], ["Appointments", "Requests read back, then confirmed"], ["HIPAA", "Not compliant, no BAA"]]}
    indexTitle="The 13 questions in this guide"
    answerLabel="Short answer"
    questions={questions}
    sources={sources}
    related={["/blog/whatsapp-appointment-booking", "/blog/whatsapp-chatbot-for-clinics-india"]}
    product="/ai-receptionist"
    cta={{ heading: <>Stop losing patients to voicemail.<br /><span>Free to start, with no per-minute fees.</span></>, body: "Message our team on WhatsApp and we’ll switch the AI voice agent on for your clinic’s number." }}
    action={{ href: voiceAccess, label: "Message us on WhatsApp" }}
  />;
}
