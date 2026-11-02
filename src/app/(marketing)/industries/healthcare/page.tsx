import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CalendarCheck, Clock, Database, FileSpreadsheet, Landmark, Languages, MessageSquareReply, Scale, ScrollText, ShieldAlert, Siren, Timer, Users, Webhook } from "lucide-react";
import { pageMetadata } from "@/lib/pageMetadata";
import { Cards, Comparison, MarketingPage, Pills, Samples, Section, Steps } from "@/components/marketing/MarketingPage";
import { ChatExample, InlineCta, JumpTags, MoreLink, Note, Sources, Stats } from "@/components/marketing/IndustryBlocks";

// Healthcare industry page, laid out like an industry landing page: hero with
// use-case tags, sourced stats, an example chat, one section per use case,
// trust, integrations, comparison, FAQ. Targets "whatsapp chatbot for
// healthcare" (57), "whatsapp automation for clinics" (80), "whatsapp business
// for doctors" (68), "ai agent for healthcare" (116), "is whatsapp hipaa
// compliant 2026" (54), autocomplete 2026-11-02 (docs/seo-research.md,
// "Healthcare industry page"). Chat first; voice is mentioned as available.
// Front-desk work only: Meta's terms say the WhatsApp Business Platform isn't
// HIPAA compliant, and Wapzen signs no BAA. Recheck the sources before editing.
const path = "/industries/healthcare";
const title = "WhatsApp Chatbot for Healthcare: Free AI Agent for Clinics";
const description = "A free WhatsApp AI agent for clinics and doctors: answers patient questions 24/7, takes appointment requests, sends reminders, and picks up WhatsApp calls.";

export const metadata: Metadata = pageMetadata({ title, description, path });

const stats = [
  { value: "3B+", label: "people use WhatsApp every month, so most of your patients already have it open.", source: "Meta, Q1 2025 results" },
  { value: "23%", label: "of booked appointments are missed on average, across 105 studies of no-shows.", source: "Dantas et al., Health Policy, 2018" },
  { value: "+14%", label: "more patients turned up when they got a text reminder than when they got none.", source: "Cochrane review, 2013" },
];

const practices = ["Dental clinics", "Family doctors and GPs", "Physiotherapy", "Skin and aesthetic clinics", "Eye clinics", "Diagnostic labs", "Hospital front desks", "Veterinary clinics"];

const exampleTurns = [
  { from: "patient", text: "Hi, are you open on Saturday? I need a check-up." },
  { from: "agent", text: "Hi! Yes, Brightside Dental is open on Saturday from 9 am to 1 pm, and Dr. Mehta is in that morning. Would you like to request a check-up?" },
  { from: "patient", text: "Yes please, Saturday morning. Do I need to bring anything?" },
  { from: "agent", text: "Just a photo ID and your insurance card if you have one. Can I have your full name, and is this your first visit with us?" },
  { from: "patient", text: "Sam Carter, first time." },
  { from: "agent", text: "Thanks, Sam. I've sent your request for Saturday morning to the front desk. They'll confirm the exact time in this chat." },
] as const;

const examplePoints = [
  { title: "Hours, doctors and what to bring", body: "All come from the clinic's knowledge base: a timetable and a visit checklist, uploaded once as PDFs." },
  { title: "\"Saturday\"", body: "The agent knows today's date in the clinic's time zone, so \"Saturday\" means the coming Saturday." },
  { title: "The request", body: "An API request tool sent the name, visit type and preferred time to the clinic's booking sheet." },
  { title: "The confirmation", body: "A receptionist replied from the Wapzen dashboard, in the same WhatsApp chat." },
];

const questions = [
  { icon: Clock, title: "Open when the front desk isn't", body: "Messages sent late at night or over the weekend get an answer in seconds, not on Monday morning." },
  { icon: BookOpen, title: "Answers from your own documents", body: "Upload PDFs, Word files or plain text: doctors' timetables, fees, insurance you accept, parking, what to bring. The agent answers from those, not from the internet." },
  { icon: Languages, title: "In the patient's language", body: "Patients write in English, Hindi, Spanish, Portuguese or Arabic, and the agent replies in the same language from the same knowledge base." },
];

const appointments = [
  { icon: CalendarCheck, title: "Takes the request", body: "It asks for the patient's name, the kind of visit and a preferred day and time. It knows today's date, so \"next Tuesday\" means the right Tuesday." },
  { icon: Webhook, title: "Books through your system", body: "Connect an API request tool and the agent sends each request to your booking system, to a Google Sheet through n8n, Make or Zapier, or to any HTTPS address." },
  { icon: Users, title: "Or hands it to your team", body: "Without a tool, every chat is saved in your dashboard. Staff read the thread and reply from there to confirm the slot, in the same WhatsApp chat." },
];

const reminders = [
  { icon: FileSpreadsheet, title: "Upload tomorrow's list", body: "Export upcoming appointments to Excel or CSV, upload the file, and write one message with placeholders such as {{name}} and {{time}}." },
  { icon: Timer, title: "Sent one at a time", body: "Messages go out from your clinic's number one by one, 30 seconds apart by default. You can pause or cancel a send at any time." },
  { icon: MessageSquareReply, title: "Replies land in the same chat", body: "When a patient answers \"can we move it?\", the reply arrives in their usual chat with you, where the agent answers and your team can see it." },
];

const setup = [
  { title: "Link your clinic's number", body: "Scan a QR code or enter a pairing code in WhatsApp on the clinic phone, as you would for WhatsApp Web. Your number, app and chats stay as they are." },
  { title: "Add your clinic's information", body: "Upload your timetable, fee list and visit instructions to a knowledge base, then attach it to your agent." },
  { title: "Write the ground rules", body: "Tell the agent what it may answer, how to take appointment requests, and to pass anything clinical to your staff. A sample is below." },
  { title: "Switch it on and read along", body: "Turn the agent on. Every conversation is saved in the dashboard, so you can check its answers in the first days and tighten the instructions." },
];

const samples = [
  { title: "Ground rules for a clinic agent", text: "You are the WhatsApp front desk for [clinic name]. Answer questions about opening hours, which doctor is in, fees, insurance, location and what to bring, using only the clinic information you have. If you don't know, say a team member will reply.\n\nTo request an appointment, ask for the patient's full name, the type of visit and a preferred day and time. Don't ask about symptoms or medical history.\n\nNever diagnose, suggest treatment or comment on test results. For any medical question, say a doctor or nurse will advise.\n\nIf someone describes an emergency, such as chest pain, trouble breathing or heavy bleeding, tell them to call [local emergency number] now.\n\nKeep replies short and friendly, in the patient's language." },
  { title: "Appointment reminder", text: "Hi {{name}}, this is a reminder from [clinic name]: your appointment is on {{date}} at {{time}}.\n\nPlease bring a photo ID. If you need to change the time, just reply here." },
];

const trust = [
  { icon: ShieldAlert, title: "Front-desk work only", body: "Use the agent for hours, fees, directions, appointment requests and reminders. Keep diagnoses, test results and prescriptions off WhatsApp." },
  { icon: Siren, title: "Not a clinician", body: "The agent follows your written instructions, but it is an AI and can be wrong. Read the conversations, and never make it the only way to reach you in an emergency." },
  { icon: ScrollText, title: "WhatsApp's own rules", body: "WhatsApp's Business Messaging Policy says not to use it for telemedicine, or to send or request health information where your regulations require a compliant system." },
  { icon: Landmark, title: "United States: HIPAA", body: "Wapzen signs no business associate agreement. For a HIPAA covered entity, even a name with an appointment time can be protected health information, so ask your compliance officer first." },
  { icon: Scale, title: "Europe and the UK: GDPR", body: "Health data is a special category under Article 9 of the GDPR. Check your lawful basis, and the processors involved, with your data protection officer." },
  { icon: Database, title: "What Wapzen keeps", body: "Chats are saved in your dashboard, and each message is sent to an AI model provider to write the reply. The privacy policy lists every provider." },
];

const integrations = ["n8n", "Make", "Zapier", "Google Sheets", "Cal.com", "Your practice software's API", "Any HTTPS webhook"];

const comparison = [
  ["Answers patient questions", "Greeting and away messages; Meta Business Agent if your account is eligible", "Chatbot flows, with AI on many plans", "An AI agent that answers from your clinic's documents"],
  ["Setup", "Built into the app", "A number on Meta's API through a provider, and approved templates for reminders", "Scan a QR code on your current number"],
  ["Reminders to a list", "Broadcast lists, delivered only to people who saved your number", "Template messages, with Meta's fee per message", "Bulk Messages from a spreadsheet"],
  ["Cost", "Free app", "A monthly plan plus Meta's per-message fees", "Free right now"],
  ["WhatsApp calls", "Answered by your staff", "Calling on some platforms", "An AI voice agent can answer"],
  ["HIPAA", "Not HIPAA compliant", "Meta's terms say not HIPAA compliant", "Not HIPAA compliant"],
];

const faqs = [
  { q: "What is an AI agent for healthcare?", a: "An AI agent for healthcare is software that answers patients the way a front desk would. It replies to questions, takes appointment requests and sends reminders without a person typing each answer. Wapzen runs one on a clinic's WhatsApp number, for administrative conversations, not clinical advice." },
  { q: "Can clinics and doctors use a WhatsApp chatbot?", a: "Yes, for front-desk work: opening hours, which doctor is in, fees, directions, appointment requests and reminders. WhatsApp's own policy says not to use it for telemedicine, or to request health information where your regulations require a compliant system, so keep clinical conversations on the systems you already use for them." },
  { q: "Is WhatsApp HIPAA compliant?", a: "No. Meta's terms for the WhatsApp Business Platform say it is not HIPAA compliant and that Meta is not a business associate, so Meta does not sign business associate agreements (BAAs) for WhatsApp. The WhatsApp and WhatsApp Business apps don't come with one either." },
  { q: "Is Wapzen HIPAA compliant?", a: "No. Wapzen doesn't sign business associate agreements and isn't built for protected health information. US practices covered by HIPAA should ask their compliance officer before using it with patients, because even a name with an appointment time can count as protected health information." },
  { q: "Can the AI agent book patient appointments?", a: "It takes the request: the patient's name, the type of visit and a preferred day and time. To book straight into your calendar or practice software, connect an API request tool. Otherwise your staff confirm the slot by replying in the saved chat from the dashboard." },
  { q: "Can it send appointment reminders on WhatsApp?", a: "Yes. Upload a spreadsheet of upcoming appointments to Bulk Messages and write one message with placeholders like {{name}} and {{time}}. Messages go out one at a time from your clinic's number. Only message patients who gave you their number and agreed to hear from you on WhatsApp." },
  { q: "Does it integrate with our EHR or practice management software?", a: "Not directly: there are no built-in EHR integrations. If your software, or an automation tool such as n8n, Make or Zapier, accepts requests at a public HTTPS address, an API request tool can send it the details the agent collects." },
  { q: "What does the agent do if a patient describes symptoms or an emergency?", a: "It does what your instructions say. We suggest telling it never to diagnose, to pass medical questions to staff, and to tell anyone describing an emergency to call your local emergency number. It is an AI following instructions, so read the conversations and keep a phone line open for urgent care." },
  { q: "Do we need the WhatsApp Business API?", a: "No. Wapzen links to your existing WhatsApp or WhatsApp Business number with a QR code or pairing code, the way WhatsApp Web does. There is no Meta approval or template review. Wapzen is not an official Meta product." },
  { q: "What languages does the agent speak?", a: "It replies in the language the patient writes in, such as English, Hindi, Spanish, Portuguese or Arabic, and answers from the same knowledge base whatever the language." },
  { q: "How much does a WhatsApp chatbot for a clinic cost?", a: "Wapzen is free right now, and you don't need a credit card. Because it doesn't use the Business API, Meta's per-message fees don't apply. Business API platforms usually charge a monthly plan plus Meta's fee for each template message." },
  { q: "Can it answer WhatsApp calls from patients?", a: "Yes, voice is also available. A voice agent can answer WhatsApp calls to your number using the same clinic information. It answers WhatsApp calls only, not calls to a landline or a regular mobile line." },
  { q: "How quickly can a clinic go live?", a: "Linking the number takes a minute. Most of the work is writing down your clinic's information: once your timetable, fees and instructions are in, you can switch the agent on the same day." },
];

const sources = [
  { label: "Meta Terms for WhatsApp Business Platform, section 4.2 (health information, HIPAA)", href: "https://www.facebook.com/legal/Meta-Terms-for-WhatsApp-Business-Platform" },
  { label: "WhatsApp Business Messaging Policy, sections 1 and 3 (opt-in, health information), updated 23 September 2026", href: "https://whatsappbusiness.com/policy/" },
  { label: "Dantas LF et al. No-shows in appointment scheduling: a systematic literature review. Health Policy, 2018", href: "https://pubmed.ncbi.nlm.nih.gov/29482948/" },
  { label: "Gurol-Urganci I et al. Mobile phone messaging reminders for attendance at healthcare appointments. Cochrane, 2013", href: "https://www.cochrane.org/CD007458" },
  { label: "TechCrunch: WhatsApp now has more than 3 billion users a month (1 May 2025)", href: "https://techcrunch.com/2025/05/01/whatsapp-now-has-more-than-3-billion-users/" },
  { label: "US HHS: the HIPAA Privacy Rule", href: "https://www.hhs.gov/hipaa/for-professionals/privacy/index.html" },
  { label: "GDPR, Article 9: processing of special categories of personal data", href: "https://eur-lex.europa.eu/eli/reg/2016/679/oj" },
];

export default function HealthcarePage() {
  return <MarketingPage
    path={path}
    name="Healthcare"
    title={title}
    description={description}
    eyebrow="Healthcare"
    heading={<>A WhatsApp AI agent for healthcare.<br /><span>Fewer missed messages, more booked visits.</span></>}
    lead="Wapzen puts an AI agent on your clinic's WhatsApp number. It answers patient questions about hours, fees, doctors and directions at any hour, takes appointment requests, and sends reminders to patients who asked for them. It does front-desk work, never diagnosis."
    perks={["Free right now", "No Business API", "Works on your current number", "Voice calls too"]}
    ctaLabel="Set up my clinic's agent"
    secondary={{ href: "#setup", label: "See how it works" }}
    hero={<>
      <JumpTags items={[{ href: "#patient-questions", label: "Patient questions" }, { href: "#appointments", label: "Appointment requests" }, { href: "#reminders", label: "Reminders" }, { href: "#voice", label: "WhatsApp calls" }, { href: "#hipaa", label: "HIPAA and privacy" }]} />
      <Stats items={stats} note="Published research, not Wapzen results. The studies measured missed appointments and SMS reminders in general, not WhatsApp. Sources are listed at the end of the page." />
    </>}
    related={["/ai-receptionist", "/free-whatsapp-chatbot"]}
    faq={{ heading: <>AI agents in healthcare.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Give your front desk a break.<br /><span>Start with WhatsApp.</span></>, body: "Sign up free, link your clinic's WhatsApp number, upload your timetable and fees, and let the agent answer patients while your team looks after the people in the room." }}
  >
    <Section id="practices" heading={<>Built for practices that run on WhatsApp.<br /><span>From one dentist to a hospital front desk.</span></>} intro="If your patients already message you on WhatsApp, the agent answers there: no new app for them, and no new number for you.">
      <Pills items={practices} />
    </Section>

    <Section id="example" heading={<>What a patient chat looks like.<br /><span>An example, step by step.</span></>}>
      <ChatExample business="Brightside Dental" turns={[...exampleTurns]} points={examplePoints} caption="An illustrative example with a fictional clinic, not a real patient conversation." />
    </Section>

    <Section id="patient-questions" heading={<>Patient questions, answered 24/7.<br /><span>From your own clinic information.</span></>} intro="Most messages to a clinic are the same few questions. Upload your timetable, fees and visit instructions once, and the agent answers from them day and night.">
      <Cards items={questions} />
    </Section>

    <Section id="appointments" heading={<>Appointment requests on WhatsApp.<br /><span>Booked in your system, or confirmed by your team.</span></>} intro="The agent collects what your front desk needs to book a visit. How the booking is made is up to you.">
      <Cards items={appointments} />
      <MoreLink href="/blog/whatsapp-appointment-booking">Read the full guide to WhatsApp appointment booking</MoreLink>
    </Section>

    <InlineCta title="How many WhatsApp messages wait for your clinic overnight?" body="Let the agent answer them while you're closed. It's free right now, and linking your number takes a minute." label="Start free" />

    <Section id="reminders" heading={<>Appointment reminders on WhatsApp.<br /><span>Sent from a spreadsheet.</span></>} intro="In a Cochrane review, text reminders raised attendance about 14% over no reminder at all. Bulk Messages sends yours from your clinic's own WhatsApp number.">
      <Cards items={reminders} />
      <Note>Only message patients who gave you their number and agreed to hear from you on WhatsApp: WhatsApp&apos;s Business Messaging Policy requires that opt-in. Keep reminders to the date, time and practical details, not the reason for the visit.</Note>
    </Section>

    <Section id="voice" heading={<>Voice is also available.<br /><span>The agent can answer WhatsApp calls.</span></>} intro="Some patients would rather talk. When they tap the call button in WhatsApp, a Wapzen voice agent can answer with the same clinic information and take their request. It answers WhatsApp calls only, not your landline.">
      <MoreLink href="/ai-receptionist">See the AI receptionist for WhatsApp calls</MoreLink>
    </Section>

    <Section id="setup" heading={<>WhatsApp automation for clinics.<br /><span>Live in four steps.</span></>}>
      <Steps items={setup} />
    </Section>

    <Section id="samples" heading={<>Copy these into your agent.<br /><span>Instructions and a reminder.</span></>} intro="Paste the ground rules into your agent's instructions and fill in the brackets. The reminder works in Bulk Messages, where {{name}}, {{date}} and {{time}} come from your spreadsheet's columns.">
      <Samples items={samples} />
    </Section>

    <Section id="hipaa" heading={<>Is WhatsApp HIPAA compliant?<br /><span>No. Here&apos;s what that means for your clinic.</span></>} intro="Meta's own terms say the WhatsApp Business Platform is not HIPAA compliant and that Meta is not a business associate. Wapzen doesn't sign business associate agreements either. Use it for front-desk work, and keep clinical care on the systems built for it.">
      <Cards items={trust} />
      <Note>Wapzen links to WhatsApp as a linked device, the way WhatsApp Web does, and is not an official Meta product. The <Link href="/privacy">privacy policy</Link> lists every provider that processes your chats.</Note>
    </Section>

    <Section id="integrations" heading={<>Connect your booking system.<br /><span>With one API request tool.</span></>} intro="Wapzen has no built-in EHR integrations. Instead, an API request tool sends what the agent collected, as JSON or a form, to any public HTTPS address. Anything with a webhook or an API can take it from there.">
      <Pills items={integrations} />
    </Section>

    <Section id="compare" heading={<>WhatsApp Business for doctors.<br /><span>Three ways to run it.</span></>}>
      <Comparison caption="The WhatsApp Business app, a WhatsApp Business API platform and Wapzen compared for a clinic" columns={["WhatsApp Business app", "Business API platform", "Wapzen"]} rows={comparison} />
    </Section>

    <Sources checked="2 November 2026" items={sources} />
  </MarketingPage>;
}
