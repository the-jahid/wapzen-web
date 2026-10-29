import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Samples } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp chatbot for education" (63), "whatsapp for schools" /
// "whatsapp for education" (40), "ai chatbot for school" (39), "whatsapp
// message for tuition classes" (30) and "…sample" (24), "whatsapp chatbot for
// college" (30), "ai chatbot for school helpdesk" (27), "whatsapp business for
// schools" (24), autocomplete 2026-10-30 (docs/seo-blog-industry-research.mjs).
// The agent never answers groups, which the post leans on for schools, and
// Wapzen sends no broadcasts, so announcements and fee reminders point to
// Channels, Communities and the Business API.
const href = "/blog/whatsapp-chatbot-for-education";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const kinds = [
  ["Who writes", "Current parents, plus new families in admission season", "Prospective students and parents, mostly from ads and referrals"],
  ["Top questions", "Timings, holidays, transport, fees, documents", "Batches, fees and instalments, faculty, results, demo classes"],
  ["What matters most", "Accurate answers and a quick hand-off to the office", "Answering fast and booking the demo before they ask elsewhere"],
  ["Calls", "Parents calling the office’s WhatsApp", "Calling ad enquiries back within minutes"],
];

const prompt = `You are the WhatsApp assistant for [Institute], a [coaching centre for JEE and NEET] in [area]. You answer questions from parents and students about courses, batches, fees, admissions, and timings, and book demo classes.

Use only the information in your knowledge base. Never guess fees, dates, or seat availability: if it isn't there, say the office will confirm.

You can't see any student's records. For marks, attendance, fee dues, or a complaint, say the office will reply here, and don't ask for details.

To book a demo class, ask one at a time for: the student's name, their class or course, the parent's name, a contact number, and a preferred batch and day. Repeat it back, and after they confirm, use save_demo_request. Say the office will confirm the slot on WhatsApp by [6 pm today].

Don't help with homework or answer subject questions; invite them to a demo class instead.

Rules: short, friendly replies, in the language the parent or student writes in.`;

const demoParameters = [
  ["student_name", "string", "The student’s name."],
  ["class_or_course", "string", "Their class or the course they want, e.g. “Class 11, JEE”."],
  ["parent_name", "string", "The parent’s or guardian’s name."],
  ["contact_number", "string", "A phone number with the country code."],
  ["preferred_batch", "string", "Morning, evening, or weekend batch, as they said it."],
  ["preferred_day", "string", "The day for the demo class, e.g. “this Saturday”."],
];

const messages = [
  { title: "Admissions open", text: "📢 Admissions are open at [Institute] for [2027–28]! [Class 11 JEE and NEET batches] start on [1 April]. Fees, timings, and a free demo class: just reply to this message." },
  { title: "Reply to a fee enquiry", text: "Thanks for asking! The [Class 11 JEE] course fee is [₹85,000] a year, payable in [3 instalments]. It includes [study material and weekly tests]. Would you like to book a free demo class?" },
  { title: "Demo class confirmation", text: "Your free demo class is booked: [Physics], [Saturday 7 Nov] at [10 am], [Room 3, 2nd floor]. Please arrive 10 minutes early. Reply here if you need to change it." },
  { title: "Fee reminder", text: "Dear parent, this is a reminder that the [second] instalment of [₹28,000] for [Aarav, Class 11] is due on [15 Nov]. Pay at the office or by UPI to [ID]. Thank you!" },
  { title: "Welcome message for a parents’ group", text: "Welcome to the [Class 6B] parents’ group 👋 We’ll share homework, notices, and event updates here. For questions about your own child, please message the class teacher directly." },
  { title: "Holiday notice", text: "[Institute] will be closed on [Thursday 12 Nov] for [a public holiday]. Classes resume on [Friday 13 Nov] at the usual time." },
  { title: "Batch timing change", text: "Please note: from [Monday 9 Nov], the [evening batch] moves to [5:30–7:30 pm]. Reply here if the new time doesn’t work for you." },
];

const faqs = [
  { q: "Can a school or coaching centre use a WhatsApp chatbot for free?", a: "Yes. Wapzen is currently free: create a chat agent, add your prospectus, fees, and timetable to a knowledge base, and link your office's WhatsApp number. It answers parents and students right away, without the Business API." },
  { q: "Will the chatbot reply in our parent or class WhatsApp groups?", a: "No. Wapzen's chat agent only answers one-to-one text chats. It ignores groups, channels, and status updates, so your class groups on the same number carry on as before." },
  { q: "Can it send fee reminders or announcements to all parents?", a: "Not as a broadcast. Use a WhatsApp Channel or a Community announcement group for notices, or Business API templates for automatic reminders, which Meta charges per message. Wapzen answers the questions parents send back." },
  { q: "Does it reply in Hindi or regional languages?", a: "Yes. The chat agent answers in whatever language the parent or student writes in, and you set the voice agent's language for calls, such as Hindi, Tamil, or English." },
  { q: "Can it book demo classes and campus visits?", a: "It collects the student's details and a preferred day and saves the request to a sheet for the office to confirm. To book straight into a timetable, connect an API request tool to your system." },
  { q: "Can students use it for homework help?", a: "You decide. The instructions in this post tell it to stick to the institute's information and invite students to a demo class instead, which keeps it from answering exam questions or doing homework." },
];

const sources = [
  { label: "WhatsApp blog: Introducing WhatsApp Channels", href: "https://blog.whatsapp.com/introducing-whatsapp-channels-a-private-way-to-follow-what-matters" },
  { label: "Meta: WhatsApp template categorization", href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/template-categorization" },
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
];

const sections = [
  {
    id: "questions",
    title: "What a WhatsApp chatbot does for schools and coaching centres",
    body: <>
      <p>Every admissions office answers the same questions on WhatsApp, often in the evening, when parents finally have time: What are the fees? Is there a bus to our area? When does the new batch start? Can my son attend a demo class? A WhatsApp chatbot for education answers those from your prospectus and timetable, in the parent’s language, so the office handles only what needs a person.</p>
      <p>It does well with:</p>
      <ul>
        <li><strong>Admissions:</strong> eligibility, dates, the documents to bring, and the fee structure with instalments.</li>
        <li><strong>Courses and batches:</strong> subjects, timings, batch sizes, faculty, and study material.</li>
        <li><strong>Everyday logistics:</strong> holidays, transport routes, uniforms, books, and the academic calendar.</li>
        <li><strong>Demo classes and campus visits:</strong> it takes the request and saves it for the office.</li>
      </ul>
      <p>It should not handle anything about one particular student, such as marks, attendance, fee dues, or behaviour, or complaints and safeguarding concerns. Those go to a person, and the instructions below make sure of it.</p>
    </>,
  },
  {
    id: "schools-vs-coaching",
    title: "Schools and coaching centres need different things",
    body: <>
      <p>The setup is the same, but the goal differs:</p>
      <Comparison caption="How schools and coaching centres use a WhatsApp chatbot" columns={["School", "Coaching centre"]} rows={kinds} />
      <p>For a school, accuracy is everything: a wrong holiday date reaches hundreds of families. For a coaching centre, admissions are a race, because a student comparing three institutes usually joins the one whose demo class they attend first.</p>
    </>,
  },
  {
    id: "setup",
    title: "Set it up in four steps",
    body: <>
      <h3>1. Build the knowledge base</h3>
      <p>In Wapzen, create a <strong>knowledge base</strong> and upload your prospectus, fee structure, batch timetable, academic calendar, transport routes, and the questions your office answers most, as text, PDF, or Word files. Put the academic year on every fee sheet, and replace it when fees change.</p>
      <h3>2. Create the chat agent</h3>
      <p>Create a <strong>chat agent</strong>, attach the knowledge base, and adapt these instructions:</p>
      <pre><code>{prompt}</code></pre>
      <h3>3. Add the demo-class tool</h3>
      <p>The <code>save_demo_request</code> tool saves each request to a Google Sheet. Use the Apps Script from <Link href="/blog/whatsapp-appointment-booking">WhatsApp appointment booking</Link> with a <strong>Demo requests</strong> tab, then open <strong>Tools › Create Tool › API Request</strong>, set the method to POST and the URL to your web app, and add:</p>
      <Comparison caption="Parameters for the save_demo_request tool" columns={["Type", "Description to give the agent"]} rows={demoParameters} />
      <h3>4. Link the office number</h3>
      <p>Open <strong>Phone Numbers</strong>, link your admissions or office WhatsApp number, and pick the agent. It answers the next message.</p>
      <Note>The agent answers one-to-one text chats only. Class and parent groups on the same number are untouched, and so are voice notes and photos, which wait for your staff. While the agent is live it answers every text message; there’s no per-chat takeover yet, so pause it if the office wants to reply to everyone itself.</Note>
      <InlineCta title="Answer every admission enquiry on WhatsApp" body="Free right now: an AI agent on your school or institute’s WhatsApp number that answers parents and books demo classes." />
    </>,
  },
  {
    id: "calls",
    title: "Answer calls and call enquiries back",
    body: <>
      <p>Many parents would rather talk. A Wapzen <strong>voice agent</strong> on the same number answers WhatsApp calls with the same knowledge base, in the language you set, such as Hindi, Tamil, or English.</p>
      <p>For coaching centres running ads, an <strong>outbound campaign</strong> calls every new enquiry on WhatsApp as soon as it’s added, by hand or from your ad leads through an automation tool and the Wapzen API. The voice agent asks what the student is preparing for, answers fee and batch questions, and offers a demo class, and the transcript is waiting for your counsellor. The setup is the same as in <Link href="/blog/whatsapp-chatbot-for-real-estate">calling real estate leads back</Link>.</p>
      <Note>The voice agent isn’t told the enquirer’s name, so it asks. Wapzen doesn’t redial unanswered calls, and calls go out the moment a lead is added, so hold late-night leads until morning. It makes WhatsApp calls only, not regular phone calls.</Note>
    </>,
  },
  {
    id: "announcements",
    title: "Announcements, fee reminders, and results",
    body: <>
      <p>A chatbot answers people who write to you. Notices that go to every parent at once are a different job, and Wapzen doesn’t send broadcasts. Your options:</p>
      <ul>
        <li><strong>A WhatsApp Channel</strong> for one-way notices like holidays and events. It’s free and <a href="https://blog.whatsapp.com/introducing-whatsapp-channels-a-private-way-to-follow-what-matters" target="_blank" rel="nofollow noopener noreferrer">one-way</a>: followers can’t reply, and following doesn’t show their number to you or anyone else.</li>
        <li><strong>A Community</strong> with an announcement group for each class, also free, managed from the WhatsApp app.</li>
        <li><strong>Business API templates</strong> for automatic reminders from your fee or school software. A payment reminder for a student’s account is a utility message (₹0.115 in India from 1 October 2026), and an “admissions open” promotion is marketing (₹0.8631). See <Link href="/blog/whatsapp-business-api-pricing">WhatsApp Business API pricing</Link>.</li>
      </ul>
      <p>When parents reply to a notice with a question, the chatbot answers it.</p>
    </>,
  },
  {
    id: "messages",
    title: "WhatsApp messages for schools and tuition classes",
    body: <>
      <p>Copy and adapt these. The first three work as replies or status posts, and the rest as notices from the office:</p>
      <Samples items={messages} />
      <p>For more greeting and away messages, see <Link href="/blog/whatsapp-business-greeting-message">40 WhatsApp Business greeting message examples</Link>.</p>
    </>,
  },
  {
    id: "safety",
    title: "Children’s data and safety",
    body: <>
      <ul>
        <li><strong>Collect only what an enquiry form would.</strong> A name, a class, a parent’s name, and a number. Nothing about a child’s health, behaviour, or family.</li>
        <li><strong>Keep student records out of the chatbot.</strong> It can’t verify who is asking, so marks and attendance stay with the office or your parent portal.</li>
        <li><strong>Know the rules where you are.</strong> Data protection laws, such as India’s DPDP Act and the GDPR in Europe, set extra rules for children’s data. Ask your school’s data protection lead before you change what you collect.</li>
        <li><strong>Tell parents an assistant answers first</strong>, in your greeting message, with the office hours for anything personal.</li>
      </ul>
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. It links your number as a device, so there’s no Business API account and no Meta message fees for its replies.</Note>
    </>,
  },
];

export default function WhatsAppChatbotForEducationPage() {
  return <BlogPost
    href={href}
    heading={<>A WhatsApp chatbot for education.<br /><span>For schools and coaching centres.</span></>}
    lead="Set up an AI agent on your school or institute’s WhatsApp: it answers admission, fee, and batch questions in the parent’s language, books demo classes, answers WhatsApp calls, and leaves your class groups alone. With instructions and message samples to copy."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Answers enquiries:</strong> fees, batches, admissions, transport, and holidays, from your prospectus and timetable, at any hour.</>,
        <><strong>Books demo classes:</strong> it collects the student’s details and saves the request for your office to confirm.</>,
        <><strong>Stays out of groups:</strong> it only answers one-to-one chats. Notices to all parents go through Channels, Communities, or the Business API.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/what-is-a-whatsapp-chatbot", "/blog/whatsapp-business-greeting-message"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Every parent answered.<br /><span>Even after office hours.</span></>, body: "Create a free AI agent, upload your prospectus and fees, and link your office's WhatsApp number. It answers parents and students right away." }}
  />;
}
