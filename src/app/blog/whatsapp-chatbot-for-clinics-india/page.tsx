import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Topic from the India industry harvest (2026-11-14, docs/seo-research.md, "India industry
// posts", docs/seo-blog-india-industries-research.mjs): clinics were the strongest
// industry, 719. Targets: "whatsapp automation for clinics" (19), "ai receptionist for
// dental clinics" (18), "whatsapp business for doctors" (16), "clinic management software
// india" (20), "whatsapp appointment booking system" (20), "doctor appointment whatsapp
// message" (10). /blog/whatsapp-appointment-booking and /industries/healthcare are
// worldwide; this one is India's rules and rupees.
// Facts: NMC "Guidelines on Ethical Advertising and Public Communication" dated 6 Oct 2026,
// read through Medical Dialogues' report (the PDF itself wasn't read); Telemedicine
// Practice Guidelines of 25 March 2020 on AI (secondary summaries, PSA Legal); DPDP Rules
// via YourStory. Copy: "fully free" at the user's request (2026-11-14), although the server still
// gives each account a free trial (FREE_TRIAL_REPLIES) before a paid plan; never "unlimited". No limit
// and no ban wording, at the user's request. Voice is described as working and its CTA
// opens WhatsApp, because the dashboard still shows VoiceUpdateNote. Take Order for
// appointment requests is untested, and the copy says to test it.
const href = "/blog/whatsapp-chatbot-for-clinics-india";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to turn on the Wapzen voice agent for my clinic in India.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const answers = [
  ["“Doctor sahab kab baithte hain?”", "Yes", "From the OPD timings you give it, day by day"],
  ["“What is the consultation fee?”", "Yes", "Quotes your fee list, for new and follow-up visits"],
  ["“Can I get an appointment tomorrow evening?”", "Yes, as a request", "Takes the patient’s details; your front desk confirms the slot"],
  ["“Where is the clinic? Is there parking?”", "Yes", "Sends your address, map link or a photo of the building"],
  ["“Do I need to fast before the blood test?”", "Yes, from your sheet", "Repeats your written preparation instructions, nothing else"],
  ["“I have fever since 3 days, which medicine should I take?”", "No", "Gives no medical advice and offers an appointment"],
  ["“Chest pain, what should I do?”", "No", "Tells the patient to call 112 or go to the nearest emergency"],
  ["“Send my blood report”", "No", "Your staff send reports to the patient themselves"],
];

const rules = [
  ["No guarantee of cure or outcome", "Never promise a cure, a result or a painless treatment."],
  ["No “best”, “No. 1” or “most trusted” unless independently verifiable", "Don’t call the clinic or any doctor the best, top or No. 1."],
  ["No patient testimonials, even with consent", "Never quote patients, reviews or success stories."],
  ["No before-and-after photos or promoted cases", "Don’t describe other patients’ treatments or results."],
  ["No discounts or offers that push unnecessary tests or treatment", "Don’t offer discounts or packages unless your information lists them."],
  ["Fees may be stated if factual and not misleading", "Quote fees only from the current fee list."],
  ["AI-generated promotion must be marked as AI", "Say in the first message that you are a virtual assistant."],
];

const software = [
  ["Answer WhatsApp questions with AI, day and night", "Rarely; usually reminders only", "Yes"],
  ["Collect appointment requests on WhatsApp", "Through a booking link or app", "Yes, by chat"],
  ["Answer patients’ WhatsApp calls", "No", "Yes, with the voice agent"],
  ["Live slot calendar and queue", "Yes", "No, unless your software has an API"],
  ["Patient records and prescriptions (EMR)", "Yes", "No"],
  ["Billing, pharmacy and lab reports", "Yes", "No"],
];

const fit = [
  ["Single-doctor clinic where the doctor also answers WhatsApp", "Yes", "The agent replies while you’re with patients"],
  ["Dental, skin, eye or physiotherapy clinic with many repeat questions", "Yes", "Fees, timings and preparation answered in seconds"],
  ["Diagnostic centre taking home-collection requests", "Yes", "Collects the address and preferred time for your team"],
  ["Hospital that needs live slot booking across departments", "With software", "Wapzen handles the chat; the slots stay in your system"],
  ["Anyone wanting the bot to triage symptoms or suggest medicines", "No", "AI may not counsel patients or prescribe in India"],
  ["Brand that needs a green tick or approved templates", "No", "Those exist only on Meta’s official API"],
];

const prompt = `You are the virtual receptionist of Demo Child Care Clinic, a paediatric clinic in Jaipur.
Say in your first message that you are a virtual assistant, not a doctor.
Reply in the language the patient uses: Hindi, Hinglish or English. Use two or three short sentences and ask one question at a time.
Answer only from the clinic information you were given: doctors, OPD timings, fees, address, services and test preparation. If you don't have the answer, say so and offer a call from the front desk.
Never give medical advice, never suggest or name a medicine or dose, and never comment on symptoms, reports or prescriptions. Offer an appointment instead.
If someone mentions chest pain, breathing trouble, unconsciousness, heavy bleeding, seizures or any emergency, tell them to call 112 (or 108 for an ambulance) or go to the nearest emergency department now.
To request an appointment, ask for the patient's name, age, the doctor or department, and the preferred day and time. Repeat the details and ask the patient to confirm. Say that the front desk will confirm the slot on this chat.
Never promise a cure or result. Never call the clinic or a doctor the best or No. 1. Never quote patients or reviews. Quote fees only from the fee list.
Don't ask for Aadhaar numbers, insurance numbers or medical reports in this chat.
Front desk hours: Monday to Saturday, 9 am to 8 pm. Sunday closed.`;

const turns = [
  { from: "patient" as const, text: "Namaste, Dr. Sharma kal sham ko baithenge? Mere bete ko 2 din se khansi hai" },
  { from: "agent" as const, text: "Namaste! Main Demo Child Care Clinic ki virtual assistant hoon, doctor nahi. Dr. Sharma kal sham 5 se 8 baje OPD mein hain. Consultation fee ₹600 hai. Kya main appointment request note kar loon?" },
  { from: "patient" as const, text: "Haan. Koi syrup de sakte hain tab tak?" },
  { from: "agent" as const, text: "Maaf kijiye, dawai ki salah sirf doctor de sakte hain. Agar saans lene mein dikkat ho ya tez bukhar ho, to turant 112 par call kijiye ya nazdeeki emergency jaiye. Bachche ka naam aur umar bata dijiye?" },
  { from: "patient" as const, text: "Vihaan, 6 saal. 6 baje ke aas paas" },
  { from: "agent" as const, text: "Please check kar lijiye: Vihaan, 6 saal, Dr. Sharma, kal sham lagbhag 6 baje. Sahi hai?" },
  { from: "patient" as const, text: "Haan sahi hai" },
  { from: "agent" as const, text: "Dhanyavaad! Front desk aaj 8 baje se pehle isi chat par slot confirm kar dega." },
];

const sources = [
  { label: "Medical Dialogues: NMC issues Guidelines on Ethical Advertising and Public Communication for doctors and hospitals (October 2026)", href: "https://medicaldialogues.in/health-news/nmc/nmc-issues-ethical-advertising-public-communication-guidelines-for-doctors-hospitals-details-180731" },
  { label: "Ministry of Health and Family Welfare: Telemedicine Practice Guidelines (25 March 2020)", href: "https://covid19dashboard.mohfw.gov.in/pdf/Telemedicine.pdf" },
  { label: "PSA Legal: Telemedicine Practice Guidelines, 2020 FAQ", href: "https://psalegal.com/telemedicine-guidelines-2020-faq/" },
  { label: "YourStory: DPDP Rules 2025 notified, rollout over 18 months", href: "https://yourstory.com/2025/11/digital-personal-data-protection-dpdp-rules-2025-rollout-over-18-months" },
  { label: "AiSensy: pricing and India message charges", href: "https://aisensy.com/pricing" },
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
];

const questions = [
  {
    id: "free",
    q: "Is there a free WhatsApp chatbot for clinics and doctors in India?",
    answer: "Yes. Wapzen gives Indian clinics a fully free AI receptionist on their own WhatsApp number. It answers OPD timings, fees, doctors and directions in seconds, in Hindi, Hinglish, English or regional languages, and takes appointment requests for your front desk. You don’t need a Meta API key, a developer or a credit card, and there are no per-message charges from Meta.",
    body: <>
      <p>Most Indian patients already message their clinic on WhatsApp, and they ask the same questions every day: is the doctor in today, what’s the fee, can I come at 6? The questions peak when the reception is busiest, during OPD hours, and keep coming after the clinic closes.</p>
      <p>An AI agent on your WhatsApp number answers those questions from your own clinic information, at any hour. <strong>Wapzen</strong> links the number you already use as a device, the way WhatsApp Web does, so your phone keeps working as normal and your staff can still reply themselves. <strong>It’s fully free</strong>, and the AI is included: no OpenAI account and no coding.</p>
      <p>It suits single-doctor clinics, dental, skin, eye, ENT, physiotherapy and paediatric practices, polyclinics and diagnostic centres. It is a receptionist, not a doctor, and this guide shows how to keep it that way.</p>
    </>,
  },
  {
    id: "answers",
    q: "What can an AI receptionist answer on a clinic’s WhatsApp?",
    answer: "Anything that’s in your clinic information: OPD timings for each doctor, consultation and follow-up fees, services, address and parking, test preparation, documents to bring, and holidays. It takes appointment requests and sends your map or fee list. It doesn’t give medical advice, comment on symptoms or reports, or suggest medicines.",
    body: <>
      <p>Here’s how a chat with a parent could go:</p>
      <ChatExample
        business="Demo Child Care Clinic, Jaipur"
        labels={{ subtitle: "WhatsApp · AI receptionist", agent: "AI agent: ", patient: "Parent: " }}
        turns={turns}
        caption="An illustrative chat for a made-up clinic. Timings and fees come from the information the clinic gave the agent."
        points={[
          { title: "Says it isn’t a doctor", body: "The first message makes clear that a virtual assistant is replying, in line with the NMC’s call to disclose AI." },
          { title: "No medicine advice", body: "Asked for a syrup, it refuses and points to emergency help for danger signs. That’s written into the prompt." },
          { title: "Details one at a time", body: "It collects the name, age, doctor and time as the chat goes on, then repeats them for the parent to confirm." },
          { title: "Your desk confirms", body: "The agent doesn’t see your appointment book, so the front desk confirms the slot on the same chat." },
        ]}
      />
      <Comparison caption="Common clinic questions on WhatsApp and what the AI agent does with them" columns={["Does it answer?", "How"]} rows={answers} />
    </>,
  },
  {
    id: "appointments",
    q: "Can it book doctor appointments on WhatsApp?",
    answer: "It takes appointment requests: the patient’s name, age, doctor and preferred time, repeated back for the patient to confirm. Your front desk then confirms the slot. With Take Order switched on, each confirmed request is saved on your Orders page and can be sent to a staff member’s WhatsApp. Wapzen has no appointment calendar of its own.",
    body: <>
      <ol>
        <li><strong>The agent collects the request</strong> in the chat, one question at a time.</li>
        <li><strong>Take Order saves it.</strong> Take Order was built for product orders, so here it acts as an appointment request form. The patient’s WhatsApp name and number are added on their own. Test it with a few made-up appointments before you rely on it.</li>
        <li><strong>Your desk gets an alert.</strong> Under <strong>Order alerts on WhatsApp</strong>, enter the receptionist’s number, and each saved request is sent there.</li>
        <li><strong>Your desk confirms the slot</strong> on the same chat, from the phone or the Wapzen dashboard.</li>
      </ol>
      <p>If you already use clinic software with a public API, an <strong>API tool</strong> can let the agent check free slots or create a booking there. That needs someone technical, and you should test it well. For other ways to take bookings, see our <Link href="/blog/whatsapp-appointment-booking">WhatsApp appointment booking guide</Link>.</p>
      <h3>Appointment confirmation message you can send</h3>
      <pre>{`Namaste {name} ji, your appointment with Dr. {doctor} is confirmed for {day} at {time}, at Demo Child Care Clinic, [address]. Please bring old prescriptions and reports, and arrive 10 minutes early. To change the time, reply on this chat.`}</pre>
    </>,
  },
  {
    id: "medical-advice",
    q: "Can a clinic’s AI chatbot give medical advice or suggest medicines?",
    answer: "No. India’s Telemedicine Practice Guidelines of March 2020 say AI and machine-learning platforms are not allowed to counsel patients or prescribe medicines; only a registered medical practitioner can. Keep the chatbot to timings, fees, directions and appointment requests, and have it send emergencies to 112 or the nearest emergency department.",
    body: <>
      <p>An AI model will happily answer “which syrup for cough?” if nothing stops it. Your instructions must stop it, in plain words, and you must test that they work:</p>
      <ul>
        <li><strong>No medicines, doses or diagnoses.</strong> The sample prompt forbids naming any medicine and commenting on symptoms, reports or prescriptions.</li>
        <li><strong>Emergencies go to emergency services.</strong> List the danger signs and give the numbers: 112, or 108 for an ambulance in most states.</li>
        <li><strong>Teleconsultation stays with the doctor.</strong> The guidelines let a registered doctor consult over WhatsApp. If you offer that, the agent can book it, but the doctor talks to the patient.</li>
        <li><strong>Test the hard questions.</strong> From another number, ask “can I take paracetamol?”, “is this report normal?” and “my father has chest pain”. Fix the prompt until every answer is safe.</li>
      </ul>
      <p>This is general information, not legal or medical advice.</p>
    </>,
  },
  {
    id: "nmc",
    q: "What do the NMC’s 2026 advertising guidelines mean for a clinic chatbot?",
    answer: "Treat what the chatbot says as your clinic’s public communication. The NMC’s guidelines of 6 October 2026 bar guarantees of cure, unverifiable “best” or “No. 1” claims, patient testimonials, before-and-after photos and offers that push unnecessary tests. Factual fees are allowed, and AI-generated promotion must be marked as AI.",
    body: <>
      <p>The National Medical Commission’s Ethics and Medical Registration Board issued its <strong>Guidelines on Ethical Advertising and Public Communication</strong> with immediate effect. They apply to registered medical practitioners and hospitals, and publishing through a platform or agency doesn’t move the responsibility away from the doctor. Here’s how the main points translate into lines for your agent’s instructions:</p>
      <Comparison caption="NMC advertising rules turned into instructions for a clinic’s AI agent" columns={["Line for your prompt"]} rows={rules} />
      <p><strong>The penalties are graded.</strong> According to the reported text, a State Medical Council can go from a warning and ethics training for a first violation to suspension of registration for repeat or serious ones, such as misleading cure claims or “digital mass solicitation”. Don’t use the agent to message people who haven’t contacted you.</p>
      <p>We read these guidelines through Medical Dialogues’ report, not the notice itself, so check the full text on the NMC’s website. This is general information, not legal advice.</p>
    </>,
  },
  {
    id: "files",
    q: "Can it send reports, prescriptions or other files?",
    answer: "It can send your clinic’s own files: the fee list, a map, preparation instructions for a test or procedure, or a photo of the entrance. Upload them in Images & Files with a note on when to send each one. Don’t upload patients’ reports or prescriptions there; your staff should send those to each patient directly.",
    body: <>
      <ul>
        <li><strong>Good files for the agent:</strong> “how to prepare for an ultrasound” as a PDF, your fee list, a photo of the building, a map, your list of empanelled insurers if you have one.</li>
        <li><strong>The note decides when it’s sent:</strong> for example, “send this when someone asks how to reach the clinic”.</li>
        <li><strong>Never patient files.</strong> The agent sends a file to anyone whose question matches its note, so a report placed there could reach the wrong person. Keep reports, prescriptions and bills between your staff and the patient.</li>
        <li><strong>Your website as a source.</strong> On the <strong>Web Search</strong> card, enter your clinic’s website and the agent reads it to answer. Check that its answers match the site.</li>
      </ul>
    </>,
  },
  {
    id: "languages",
    q: "Does it reply in Hindi and regional languages, and understand voice notes?",
    answer: "Yes. Tell the agent which languages to use and it replies in Hindi, Hinglish, English, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada and others, following the patient’s language. With Reply to voice messages on, it transcribes voice notes and replies in text. Read photos lets it read pictures such as your own pamphlet.",
    body: <>
      <p>Older patients and parents often send a voice note rather than type. The agent transcribes it and replies in text, in the same language. Test it with real notes from your patients’ area, because accents and background noise affect accuracy.</p>
      <p>Patients will also send photos of prescriptions and reports, asking “is this okay?”. The sample prompt tells the agent not to comment on them and to offer an appointment instead. Keep that line, and test it.</p>
      <Note>The Wapzen dashboard is in English. The agent replies in whichever languages your instructions name.</Note>
    </>,
  },
  {
    id: "calls",
    q: "Can it answer patients’ WhatsApp calls?",
    answer: "Yes, voice is working. Wapzen’s voice agent answers WhatsApp calls on your clinic’s number in a natural voice, in Hindi, English and nine more Indian languages, with the same clinic information as the chatbot. It handles WhatsApp calls only, not mobile or landline calls, and it can’t transfer a live call to your staff.",
    body: <>
      <p>Many patients would rather call than type, and the clinic phone is often busy during OPD. The voice agent answers timings, fees and directions, and takes the caller’s details. It pauses for a second or two before each answer.</p>
      <p>Give it the same medical-safety rules as the chatbot: no advice, no medicines, and emergencies to 112. See <Link href="/ai-calling-agent-india">AI calling for Indian businesses</Link> for more.</p>
      <InlineCta href={voiceAccess} title="Let the AI pick up patients’ WhatsApp calls" body="Message our team on WhatsApp and we’ll switch the voice agent on for your clinic’s number." label="Message us on WhatsApp" />
    </>,
  },
  {
    id: "software",
    q: "Does it replace clinic management software?",
    answer: "No. Clinic management software handles appointment calendars, patient records, prescriptions, billing and lab reports. Wapzen handles the WhatsApp conversation: answers, appointment requests and calls. A small clinic can start with Wapzen and an appointment register; a busy one can use both, connected through an API tool if its software allows.",
    body: <>
      <Comparison caption="Clinic management software compared with a WhatsApp AI agent" columns={["Clinic software", "Wapzen"]} rows={software} />
      <p>Many clinic systems send appointment reminders by SMS or WhatsApp templates, but few answer a patient’s free-text question. That’s the gap the agent fills.</p>
    </>,
  },
  {
    id: "cost",
    q: "What does a WhatsApp chatbot cost a clinic in India?",
    answer: "On an API platform such as AiSensy, a clinic sending about 6,000 replies a month would pay roughly ₹3,575 plus GST for the Basic plan, the AI add-on and Meta’s message charges, with more for AI messages past the first 1,000. Wapzen is fully free and has no Meta per-message charges, because it doesn’t use the API.",
    body: <>
      <p>Take a clinic with 40 patient chats a day and about 5 replies per chat: <strong>6,000 replies a month</strong>, of which the first 1,000 are free under Meta’s pricing.</p>
      <ul>
        <li><strong>AiSensy:</strong> ₹1,500 plan + ₹1,350 AI add-on + 5,000 replies × ₹0.145 (₹725) = <strong>₹3,575 + 18% GST</strong>, about ₹4,219. The add-on covers 1,000 AI messages, so the rest cost extra.</li>
        <li><strong>Meta’s Cloud API directly:</strong> 5,000 × ₹0.115 = ₹575 + GST in message charges, but you build, host and pay for the AI yourself.</li>
        <li><strong>Wapzen:</strong> <strong>fully free</strong>, with no card and no Meta message charges. The trade-off is that it isn’t Meta’s official platform, so there are no approved templates and no green tick.</li>
      </ul>
      <p>Prices are from AiSensy’s pages and Meta’s India rates of 1 October 2026; both change every quarter. For other platforms, see <Link href="/blog/free-whatsapp-ai-chatbot-india">what a WhatsApp chatbot costs in India</Link>.</p>
    </>,
  },
  {
    id: "dpdp",
    q: "What does the DPDP Act mean for patient chats on WhatsApp?",
    answer: "Health details shared on WhatsApp are personal data under the Digital Personal Data Protection Act. Ask only for what an appointment needs, keep reports and ID numbers out of the AI chat, use the data only for the visit, and tell patients where it goes. The DPDP Rules were notified in November 2025, with most duties applying from May 2027.",
    body: <>
      <ul>
        <li><strong>Collect the minimum.</strong> Name, age, doctor and preferred time are enough for a request. The sample prompt tells the agent not to ask for Aadhaar, insurance numbers or reports.</li>
        <li><strong>A WhatsApp number doesn’t prove identity.</strong> That’s another reason the agent shouldn’t discuss any patient’s reports or history.</li>
        <li><strong>Children’s data needs a parent.</strong> Under the DPDP Act, anyone under 18 is a child, so speak with the parent or guardian.</li>
        <li><strong>Know where the data goes.</strong> Wapzen’s main database is in Singapore, its servers in Singapore and Germany, files in Images & Files are stored in South Korea, and AI providers may process messages in the United States. Our <Link href="/privacy">privacy policy</Link> has the details.</li>
        <li><strong>Delete what you don’t need.</strong> Chats stay stored until you delete them from the dashboard.</li>
      </ul>
      <p>This is general information, not legal advice.</p>
    </>,
  },
  {
    id: "setup",
    q: "How do I set up a WhatsApp AI receptionist for my clinic?",
    answer: "Sign up free, click New chat agent, link your clinic’s WhatsApp number with an 8-character pairing code on your phone or a QR code on a computer, name the agent and paste your instructions. Then add your doctors, timings and fees, switch on Take Order for appointment requests, and test it from another number.",
    body: <>
      <ol>
        <li><strong>Sign up free.</strong> No card and no API key.</li>
        <li><strong>Prepare your instructions first.</strong> The agent starts replying as soon as the number is linked, so adapt the sample below before you link.</li>
        <li><strong>Link the number.</strong> In WhatsApp: Linked devices → Link a device → Link with phone number instead, and enter the code. On a computer you can scan the QR code.</li>
        <li><strong>Add your clinic information.</strong> Doctors, OPD timings, fees, services, address and test preparation, as text, PDF or Word. Scanned documents can’t be read, so use files with selectable text.</li>
        <li><strong>Switch on Take Order</strong> and list the details to ask for. Add the receptionist’s number under Order alerts on WhatsApp.</li>
        <li><strong>Test the hard questions</strong> from another number, including medicines, reports and an emergency.</li>
      </ol>
      <p>These instructions are for a made-up clinic. Change them to yours:</p>
      <pre>{prompt}</pre>
      <InlineCta title="Answer every patient on WhatsApp, even after OPD hours" body="Fully free: no card, no Meta API key, on the number your patients already have." label="Start free" />
    </>,
  },
  {
    id: "not-do",
    q: "What doesn’t Wapzen do for a clinic?",
    answer: "It doesn’t give medical advice, see your appointment calendar, keep patient records, send reports, take payments or check UPI transfers, and it doesn’t message patients first. It isn’t Meta’s official platform, so there are no approved templates or green tick. In WhatsApp groups it stays quiet unless you switch it on for a group.",
    body: <>
      <Comparison caption="Which clinics a WhatsApp AI receptionist suits" columns={["Good fit?", "Why"]} rows={fit} />
      <ul>
        <li><strong>You can take over any chat.</strong> Each conversation in the dashboard has an AI switch. Turn it off and the agent stops replying to that patient only. It doesn’t switch off on its own when you reply.</li>
        <li><strong>It doesn’t alert you to a complaint.</strong> Agree with your staff who checks the chats during the day.</li>
        <li><strong>It works on your current number,</strong> personal or WhatsApp Business, as a linked device.</li>
        <li>Wapzen is an independent product, not made by Meta or WhatsApp.</li>
      </ul>
    </>,
  },
];

export default function WhatsAppChatbotClinicsIndiaPage() {
  return <QaPost
    href={href}
    heading={<>A WhatsApp chatbot for clinics in India.<br /><span>A fully free AI receptionist.</span></>}
    lead="Patients in India message their clinic on WhatsApp all day: is the doctor in, what’s the fee, can I come at 6? Here are 13 questions clinics and doctors ask before putting an AI receptionist on their number, answered one by one: what it handles, how appointment requests work, what the Telemedicine Guidelines and the NMC’s October 2026 advertising rules mean for it, what it costs, and how to start free."
    verdict={{
      title: "The short answer",
      body: <>A clinic in India can put an AI receptionist on its WhatsApp with <strong>Wapzen</strong>. It answers timings, fees, doctors and directions in seconds, in Hindi, Hinglish or English, takes appointment requests for your front desk, understands voice notes and can answer WhatsApp calls. It gives no medical advice. <strong>It’s fully free</strong>, on the number you already use, with no Meta API key and no Meta per-message charges.</>,
    }}
    facts={[["Price", "Fully free"], ["Meta API key", "Not needed"], ["Languages", "Hindi, English and more"], ["Patients’ calls", "Voice agent working"]]}
    indexTitle="The 13 questions in this guide"
    answerLabel="Short answer"
    questions={questions}
    sources={sources}
    related={["/blog/free-whatsapp-ai-chatbot-india", "/blog/whatsapp-appointment-booking"]}
    product="/ai-receptionist"
    cta={{ heading: <>Never leave a patient waiting for a reply.<br /><span>Fully free, with no Meta API key.</span></>, body: "Sign up, give the agent your doctors, timings and fees, and link your clinic’s number. No card and no per-message charge." }}
  />;
}
