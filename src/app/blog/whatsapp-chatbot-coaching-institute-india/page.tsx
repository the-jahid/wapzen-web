import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Topic found by the India vertical harvest (2026-11-04, docs/seo-research.md, "India
// posts"): coaching was the second vertical, 635, and is specific to India. Targets:
// "coaching institute management software" (26, 3/3), "whatsapp message for tuition
// classes" (20), "how to get students for coaching classes" (20), "coaching institute
// marketing strategy" (20), "fee reminder message" (19). No English post covers this.
// Facts: CCPA guidelines of 13 Nov 2024 via Medianama; Ministry of Education guidelines of
// January 2024 via India TV and Careers360 (the official PDF on education.gov.in wouldn't
// open, so its refund wording isn't quoted); DPDP via Medianama. Bulk placeholders follow
// whiskey-bailey-server (any sheet column, 30-second default gap). The agent doesn't know
// each student's dues, so the prompt sends those questions to the office. Voice is
// described as working at the user's request; its CTA opens WhatsApp because the
// dashboard still shows VoiceUpdateNote.
const href = "/blog/whatsapp-chatbot-coaching-institute-india";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to turn on the Wapzen voice agent for my coaching institute in India.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const enquiries = [
  ["“What are the fees? Can we pay in instalments?”", "Fee sheet per course and instalment plan", "Quotes the fee and the instalment options"],
  ["“What are the batch timings?”", "Current timetable", "Gives the timings and asks which batch suits the student"],
  ["“Is there a demo class?”", "Demo schedule", "Offers a slot and notes the request for your counsellor"],
  ["“Who teaches physics?”", "Faculty list with true qualifications", "Answers from your list, and doesn’t invent credentials"],
  ["“What were last year’s results?”", "Results you can verify", "Quotes only what you gave it"],
  ["“Is there a scholarship test or hostel?”", "Scholarship and hostel details", "Explains them, or offers a counsellor call if you haven’t added them"],
];

const software = [
  ["Answer admission enquiries with AI, day and night", "Depends on the product", "Yes"],
  ["Send fee reminders on WhatsApp", "Often, usually as a paid or API feature", "Yes, with Bulk Messages"],
  ["Answer parents’ WhatsApp calls", "Depends on the product", "Yes, with the voice agent"],
  ["Attendance and timetables", "Yes", "No"],
  ["Online tests and report cards", "Yes", "No"],
  ["Fee ledger and receipts", "Yes", "No"],
  ["Student app and recorded lectures", "Yes", "No"],
];

const rules = [
  ["No guaranteed ranks, selection or jobs", "Never guarantee a rank, selection, marks or a job."],
  ["No exaggerated results or faculty claims", "Quote results and faculty details only from your information."],
  ["No false urgency, such as invented seat limits", "Never say seats are running out unless your information says so."],
  ["No student name or photo without consent given after success", "Don’t name or describe successful students unless they’re in your approved list."],
  ["Accurate fees and course duration", "Quote fees and durations only from the current fee sheet."],
];

const fit = [
  ["Tuition class or coaching centre flooded with the same questions", "Yes", "Answers fees, batches and demo classes in seconds, at any hour"],
  ["Institute sending monthly fee reminders to parents", "Yes", "Bulk Messages personalises each one, at no charge per message"],
  ["Parents who would rather call than type", "Yes", "The voice agent answers WhatsApp calls in Hindi and more"],
  ["Institute wanting attendance, tests and fee ledgers", "Use with software", "Wapzen handles only the WhatsApp conversation"],
  ["Anyone messaging bought student databases", "No", "Those people never asked to hear from you"],
  ["Brand that needs a green tick or approved templates", "No", "Those exist only on the official API"],
];

const prompt = `You are the virtual admissions assistant of Demo Academy, a JEE and NEET coaching institute in Kota.
Reply in the language the parent or student uses: Hindi, Hinglish or English. Use two or three short sentences, and ask one question at a time.
Say in your first message that you are a virtual assistant.
For fees, batches, faculty and results, use only the information given to you. If you don't have it, say so and offer a call from our counsellor.
Find out the student's name, current class, target exam and preferred batch. Then offer the free demo class, and say our counsellor will call to confirm.
Never guarantee a rank, selection, marks or a job. Never say seats are running out unless your information says so. Quote results only from your information.
Don't discuss an individual student's dues, marks or attendance. Send those questions to the office, open Monday to Saturday, 9 am to 7 pm.`;

const feeEnglish = `Dear {{name}}, the {{month}} fee of ₹{{amount}} for {{student}} is due on {{due_date}}. You can pay by UPI to [your UPI ID] or at the office. Please ignore this message if you've already paid. Thank you, Demo Academy.`;

const feeHinglish = `Namaste {{name}} ji, {{student}} ki {{month}} ki fees ₹{{amount}} {{due_date}} tak jama karni hai. UPI: [your UPI ID], ya office mein jama kar sakte hain. Agar fees jama kar di hai to is message ko ignore kijiye. Dhanyavaad, Demo Academy.`;

const feeOverdue = `Namaste {{name}} ji, hamare record mein {{student}} ki ₹{{amount}} fees abhi baaki dikh rahi hai. Agar koi dikkat ho ya record galat ho to office se baat kar lijiye: [office number]. Dhanyavaad, Demo Academy.`;

const tuitionAdmission = `Namaste {{name}} ji, Demo Academy mein Class {{class}} {{subject}} ke naye batch ka admission shuru hai. Batch sham {{time}} baje, [area] mein. Free demo class ke liye yahin "DEMO" likh dijiye.`;

const tuitionDemo = `Hello {{name}}, you asked about Class {{class}} {{subject}} tuition. Our next free demo class is on {{day}} at {{time}}, at [address]. Would you like me to note {{student}}'s name for it?`;

const tuitionReferral = `Namaste {{name}} ji, {{student}} ki padhai mein hamara saath dene ke liye dhanyavaad. Agar aapke jaan-pehchan mein kisi ko Class {{class}} ki tuition chahiye, to yeh link share kar sakte hain: [your WhatsApp link].`;

const sources = [
  { label: "Medianama: CCPA guidelines to curb misleading coaching ads (November 2024)", href: "https://www.medianama.com/2024/11/223-ccpa-new-guidelines-curb-misleading-ads-coaching-sect/" },
  { label: "India TV: Ministry of Education releases guidelines to regulate coaching centres (January 2024)", href: "https://www.indiatvnews.com/education/news/ministry-of-education-releases-guidelines-to-regulate-coaching-centers-details-here-2024-01-18-912448" },
  { label: "Careers360: No enrolment below 16, no misleading promises in coaching guidelines", href: "https://news.careers360.com/cannot-enrol-students-below-16-years-no-misleading-promises-moe-guidelines-for-coaching-centres" },
  { label: "Medianama: Children’s data under the DPDP Rules", href: "https://www.medianama.com/2025/01/223-data-protection-rules-2025-children-data-india/" },
  { label: "Medianama: DPDP Rules on tracking children and the exemptions", href: "https://www.medianama.com/2025/11/223-dpdp-rules-real-time-child-tracking-without-consent/" },
  { label: "YourStory: DPDP Rules 2025 notified, rollout over 18 months", href: "https://yourstory.com/2025/11/digital-personal-data-protection-dpdp-rules-2025-rollout-over-18-months" },
  { label: "AiSensy: pricing and India message charges", href: "https://aisensy.com/pricing" },
];

const questions = [
  {
    id: "free",
    q: "Is there a free WhatsApp chatbot for coaching institutes in India?",
    answer: "Yes. Wapzen gives Indian coaching institutes and tuition classes an AI WhatsApp chatbot that is free right now, with no per-message charge and no Meta API key. It answers admission enquiries in seconds on your own number, in Hindi, Hinglish or English, offers demo classes and collects each student’s details for your counsellor.",
    body: <>
      <p>A coaching institute’s front desk answers the same questions over and over, and the volume peaks just when your staff are busiest: during admissions, and around results. Parents often message after work, when your office has closed.</p>
      <p>An AI agent on your WhatsApp number replies at those hours from your fee sheet and timetable. You don’t need the WhatsApp Business API, a provider or a developer. <Link href="/blog/free-whatsapp-ai-chatbot-india">Wapzen</Link> links the number you already use as a device, and your phone keeps working as normal.</p>
    </>,
  },
  {
    id: "admissions",
    q: "What can a chatbot answer for admission enquiries?",
    answer: "Fees and instalments, batch timings, courses, faculty, demo classes, scholarship tests, hostel and location: anything in its instructions or knowledge base. It replies in seconds, day or night, in Hindi, Hinglish, English or regional languages, and collects the student’s name, class and target exam for your counsellor.",
    body: <>
      <Comparison caption="Common coaching admission questions and what an AI agent does with them" columns={["What you give the agent", "What it does"]} rows={enquiries} />
      <p>Here’s how a chat with a parent could go:</p>
      <ChatExample
        business="Demo Academy, Kota"
        labels={{ subtitle: "WhatsApp · AI agent", agent: "AI agent: ", patient: "Parent: " }}
        turns={[
          { from: "patient", text: "Namaste, mere bete ko NEET coaching chahiye. Class 11 mein hai. Fees kitni hai?" },
          { from: "agent", text: "Namaste! Main Demo Academy ki virtual assistant hoon. Class 11 ke two-year NEET programme ki fees ₹1,10,000 hai, jo teen instalments mein de sakte hain. Aapko sham ka batch theek rahega?" },
          { from: "patient", text: "Haan. Selection ki guarantee hai?" },
          { from: "agent", text: "Selection ya rank ki guarantee hum nahi dete, kyunki result student ki mehnat aur exam par nirbhar karta hai. Regular tests aur doubt classes hote hain, aur aap free demo class dekh sakte hain. Is Sunday 11 baje ki class ke liye naam note kar loon?" },
          { from: "patient", text: "Haan, Aarav Verma." },
          { from: "agent", text: "Note kar liya: Aarav Verma, Class 11, NEET, Sunday 11 baje demo class. Hamari counsellor aaj sham tak call karke confirm karengi. Dhanyavaad!" },
        ]}
        caption="An illustrative chat for a made-up institute. Fees and demo timings come from the documents the institute uploaded."
        points={[
          { title: "An honest answer on guarantees", body: "The prompt forbids guaranteeing a rank or selection, which also keeps the reply in line with the CCPA’s advertising guidelines." },
          { title: "Fees from your sheet", body: "It quotes your current fee sheet, so update the sheet whenever fees change." },
          { title: "One question at a time", body: "It collects the student’s details as the chat goes on, without sending a long form." },
          { title: "Your counsellor closes", body: "The agent notes the demo request. Your counsellor reads the whole chat in the dashboard before calling." },
        ]}
      />
      <p>Parents often send voice notes. Turn on <strong>Reply to voice messages</strong> and the agent transcribes them and replies in text. It can also read photos, such as a picture of your pamphlet with “is this batch still open?”, once you turn on <strong>Read photos</strong>. Test both with real examples first.</p>
    </>,
  },
  {
    id: "setup",
    q: "How do I set it up in a minute without a Meta API key?",
    answer: "Sign up free, paste a prompt about your institute into the chat agent waiting in your account, and link your WhatsApp number with a QR code or pairing code. The agent goes live as soon as the number is linked, in about a minute. Then upload your fee sheet and timetable so it can answer properly.",
    body: <>
      <ol>
        <li><strong>Sign up free.</strong> No card and no API key.</li>
        <li><strong>Paste your prompt.</strong> Use the sample below and change the details to your own.</li>
        <li><strong>Link your number.</strong> Scan the QR code from WhatsApp’s Linked devices on a computer, or enter the 8-character pairing code on a phone.</li>
        <li><strong>Add your documents.</strong> Upload fees, batch timings, faculty details and FAQs as text, PDF or Word. Scanned prospectuses can’t be read, so type the key facts in or use a file with selectable text.</li>
        <li><strong>Test it.</strong> From another number, ask what parents ask, including “will my child definitely get selected?”</li>
      </ol>
      <pre>{prompt}</pre>
      <InlineCta title="Answer every admission enquiry, even after hours" body="Free right now, with no Meta API key, no card and no per-message charge. Set-up takes about a minute." label="Start free" />
    </>,
  },
  {
    id: "fee-reminder",
    q: "How do I send fee reminders on WhatsApp for free?",
    answer: "Use Wapzen’s Bulk Messages: upload an Excel or CSV sheet of parents with their name, amount and due date, write one message with placeholders, and each parent gets a personalised reminder from your number, 30 seconds apart by default. There’s no per-message charge. Send reminders only to parents of enrolled students.",
    body: <>
      <p>Your sheet’s column names become placeholders, so a column called <code>student</code> fills in <code>{"{{student}}"}</code>. Here are three fee reminder messages you can adapt.</p>
      <h3>Fee reminder before the due date (English)</h3>
      <pre>{feeEnglish}</pre>
      <h3>Fee reminder message in Hinglish</h3>
      <pre>{feeHinglish}</pre>
      <h3>Polite reminder after the due date</h3>
      <pre>{feeOverdue}</pre>
      <p>A few things to plan for:</p>
      <ul>
        <li><strong>Allow time.</strong> At the default 30-second gap, 400 parents take about 3 hours and 20 minutes. Start in the morning.</li>
        <li><strong>The agent doesn’t know individual dues.</strong> Your sheet goes to the sender, not to the agent’s knowledge. The sample prompt sends “how much do I owe?” to your office, and that’s the safe setup.</li>
        <li><strong>Double-check the sheet.</strong> A wrong amount is awkward to fix after 400 messages, so send a small test batch first.</li>
        <li><strong>Keep it polite.</strong> Never mention a student’s dues in a group, and don’t use a tone that could embarrass a family.</li>
      </ul>
      <Note>Fee reminders are cheap on API platforms too: 400 messages at AiSensy’s ₹0.145 is ₹58, plus GST, per round. The real saving is the monthly plan and the AI add-on. Read <Link href="/blog/whatsapp-bulk-message-sender-free">how to send bulk messages</Link> before your first send.</Note>
    </>,
  },
  {
    id: "get-students",
    q: "What WhatsApp message should a tuition class send to get students?",
    answer: "Send a short, personal message to people who already know you: past parents, enquiries and referrals. Include the class, subject, batch time, location and one next step, such as a free demo class. To reach new parents, put a WhatsApp link and QR code on pamphlets and posters, so they message you first.",
    body: <>
      <h3>Admission open (Hinglish)</h3>
      <pre>{tuitionAdmission}</pre>
      <h3>Demo class invitation</h3>
      <pre>{tuitionDemo}</pre>
      <h3>Referral request to current parents</h3>
      <pre>{tuitionReferral}</pre>
      <p>If you’re wondering how to get students for coaching classes without a big ad budget, these are low-cost places to start:</p>
      <ul>
        <li><strong>Pamphlets and posters with a QR code.</strong> Make a free <Link href="/tools/whatsapp-qr-code-generator">WhatsApp QR code</Link> with a pre-typed message, so a parent only has to tap send.</li>
        <li><strong>A WhatsApp link everywhere.</strong> Add a free <Link href="/tools/whatsapp-link-generator">WhatsApp link</Link> to your Google Business Profile, website and Instagram bio.</li>
        <li><strong>Referrals from current parents.</strong> They’re the most trusted source you have, and it’s one short message.</li>
        <li><strong>A free demo class or scholarship test.</strong> It gives a parent an easy reason to message you now, not next month.</li>
        <li><strong>A fast first reply.</strong> All of the above brings enquiries, and the agent makes sure none of them waits until morning.</li>
      </ul>
      <p>Don’t buy student databases. Those people didn’t ask to hear from you.</p>
    </>,
  },
  {
    id: "software",
    q: "Does it replace coaching institute management software?",
    answer: "No. Management software such as Classplus or Teachmint handles attendance, tests, fee ledgers and student apps. Wapzen handles the WhatsApp conversation: enquiries, answers, reminders and calls. Larger institutes may want both. A small tuition class can often start with WhatsApp and a spreadsheet, then add software when it needs it.",
    body: <>
      <Comparison caption="Coaching institute management software compared with Wapzen" columns={["Management software", "Wapzen"]} rows={software} />
      <p>If you already use software, Wapzen doesn’t need to replace anything. An <strong>API tool</strong> can send a new enquiry’s details to any system with a public HTTPS API, or through a connector such as Zapier. Test it a few times before relying on it.</p>
    </>,
  },
  {
    id: "cost",
    q: "What does a coaching institute’s WhatsApp chatbot cost?",
    answer: "An institute sending about 9,000 AI replies in an admission month would pay roughly ₹4,010 plus GST on AiSensy’s Basic plan and AI add-on, with more for AI messages past the first 1,000. On Wapzen those replies cost ₹0 right now, with no message charges, because it doesn’t use the API.",
    body: <>
      <p>Take an institute with 50 enquiries a day in admission season and about 6 AI replies per enquiry, which comes to <strong>9,000 replies a month</strong>:</p>
      <ul>
        <li><strong>AiSensy:</strong> ₹1,500 plan + ₹1,350 AI add-on + 8,000 replies × ₹0.145 (₹1,160) = <strong>₹4,010 + GST</strong>, about ₹4,732. The add-on includes 1,000 AI messages, so the rest cost extra.</li>
        <li><strong>Wapzen:</strong> <strong>₹0</strong>. The trade-off is that it isn’t Meta’s official platform, so you don’t get approved templates or a green-tick application.</li>
      </ul>
      <p>For other platforms and Meta’s own rates, see <Link href="/blog/free-whatsapp-ai-chatbot-india">what a WhatsApp chatbot costs in India</Link>.</p>
    </>,
  },
  {
    id: "voice",
    q: "Can the AI answer parents’ calls too?",
    answer: "Yes, voice is working. Wapzen’s voice agent answers WhatsApp calls on your number in a natural voice, in Hindi, English and nine more Indian languages, using the same information as the chatbot. There’s no per-minute charge. It handles WhatsApp calls only, not mobile network or landline calls, and it can’t transfer a live call to your counsellor.",
    body: <>
      <p>Some parents would rather call than type, especially for something as important as admission. When your phone line is busy during the admission rush, the voice agent can answer on WhatsApp, explain courses, fees and batches, and take the student’s details.</p>
      <p>It pauses for a second or two before each answer. For anything sensitive, have it say that a counsellor will call back, and share your office number. See <Link href="/ai-calling-agent-india">AI calling for Indian businesses</Link> for more.</p>
      <InlineCta href={voiceAccess} title="Add the voice agent for parents who call" body="Voice is free right now too. Message our team on WhatsApp and we’ll switch it on for your number." label="Message us on WhatsApp" />
    </>,
  },
  {
    id: "ccpa",
    q: "What can’t a coaching institute’s chatbot promise?",
    answer: "It can’t guarantee ranks, selections or jobs, exaggerate results or faculty, or invent seat shortages. The CCPA’s November 2024 guidelines cover all advertising by coaching centres, and using a student’s name or photo needs written consent given after their success. Put these rules in your agent’s instructions, then test them.",
    body: <>
      <p>Treat what your chatbot says as advertising. An AI agent can sound convincing, so if your prompt is loose, it could say things your institute would be responsible for. Here’s how the rules translate into instructions:</p>
      <Comparison caption="CCPA coaching guidelines turned into instructions for an AI agent" columns={["Line for your prompt"]} rows={rules} />
      <p><strong>The penalties are real.</strong> Violations count as contraventions of the Consumer Protection Act, 2019. When it issued the guidelines, the CCPA said it had already imposed ₹54.6 lakh in penalties on coaching institutes.</p>
      <p><strong>The Ministry of Education’s January 2024 guidelines</strong> are a model for states and UTs to adopt. They say centres shouldn’t enrol students below 16, make misleading promises or guarantee ranks, and they ask for a prospectus covering fees and refund procedures. Check what your own state has adopted, because the age rule affects what your agent should say about younger students’ batches.</p>
      <p>This is general information, not legal advice.</p>
    </>,
  },
  {
    id: "student-data",
    q: "What does the DPDP Act mean for student and parent data?",
    answer: "Anyone under 18 counts as a child under the DPDP Act, so consent generally has to come from a parent or guardian, and tracking children or targeting ads at them is barred. Educational institutions get narrow exemptions for teaching and safety, not marketing. Most duties apply from May 2027, so speak to parents now and collect only what you need.",
    body: <>
      <ul>
        <li><strong>Talk to the parent about under-18s.</strong> When a student writes in, have the agent answer general questions and ask for a parent’s number for the admission details.</li>
        <li><strong>Ask for the minimum.</strong> Name, class and target exam are enough for an enquiry. Keep Aadhaar numbers and health details out of chat.</li>
        <li><strong>Keep individual records off the chat.</strong> A WhatsApp number doesn’t prove who’s asking, which is why the sample prompt won’t discuss marks, attendance or dues.</li>
        <li><strong>Use data only for what it was given for.</strong> Records collected for teaching shouldn’t become a marketing list without fresh consent.</li>
        <li><strong>Know where the data goes.</strong> Chats pass through AI providers and stay stored until you delete them. Our <Link href="/privacy">privacy policy</Link> has the details.</li>
      </ul>
      <p>This is general information, not legal advice. Check the details with your adviser, especially for students under 18.</p>
    </>,
  },
  {
    id: "limits",
    q: "What can’t a free coaching chatbot do?",
    answer: "Wapzen can’t send PDFs or images, reply in groups, or take fee payments, and each account has one chat agent sending up to 100 AI replies an hour.",
    body: <>
      <Comparison caption="Who a free WhatsApp AI chatbot suits among Indian coaching institutes" columns={["Good fit?", "Why"]} rows={fit} />
      <ul>
        <li><strong>Your batch groups stay as they are.</strong> The agent doesn’t reply in groups, so it won’t interrupt your class announcements.</li>
        <li><strong>The prospectus goes as a link.</strong> The agent can’t attach a PDF, so host it online and put the link in its information.</li>
        <li><strong>Result days can be busy.</strong> Past 100 AI replies in an hour the agent goes quiet until the hour ends. Messages are still saved, so you can catch up from the dashboard.</li>
        <li><strong>Multiple branches share one agent.</strong> Each account has one chat agent, so put all branches in its information and have it ask which one the parent means.</li>
        <li><strong>You can take over a chat.</strong> Flip that conversation’s AI switch off when a counsellor steps in. It doesn’t switch off on its own when you reply.</li>
      </ul>
      <p>Wapzen is an independent product, not made by Meta or WhatsApp.</p>
    </>,
  },
];

export default function WhatsAppChatbotCoachingInstitutePage() {
  return <QaPost
    href={href}
    heading={<>A free WhatsApp chatbot for coaching institutes.<br /><span>Admission enquiries answered, day and night.</span></>}
    lead="In admission season, parents and students ask the same questions all day: fees, batch timings, faculty, results. Here’s how a coaching institute or tuition class in India can answer them for free with an AI agent on its own WhatsApp number, send fee reminders and stay within the CCPA’s advertising rules, with no Meta API key and about a minute of setup."
    verdict={{
      title: "The short answer",
      body: <><strong>Wapzen</strong> is a free AI WhatsApp chatbot that works for coaching institutes and tuition classes in India. It answers fee, batch and demo-class questions in seconds on your own number, in Hindi, Hinglish or English, and collects each student’s details for your counsellor. Bulk Messages sends personalised fee reminders, the voice agent answers WhatsApp calls, and 1,000 businesses already use Wapzen. You don’t need a Meta API key. It doesn’t replace your management software.</>,
    }}
    facts={[["Price", "₹0 right now"], ["Meta API key", "Not needed"], ["Setup", "About 1 minute"], ["Parents’ calls", "Voice agent working"]]}
    indexTitle="The 11 questions in this guide"
    answerLabel="Short answer"
    questions={questions}
    sources={sources}
    related={["/blog/free-whatsapp-ai-chatbot-india", "/blog/whatsapp-bulk-message-sender-free"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Never leave a parent waiting until morning.<br /><span>Free right now, with no Meta API key.</span></>, body: "Sign up, give the agent your fees and batches and link your number. It takes about a minute, with no card and no per-message charge." }}
  />;
}
