import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { InlineCta, Note, RowTable } from "@/components/blog/BlogPost";
import { DayTimeline, JobBoard, PlaybookPost, PromptFile, SetupSteps, Templates, VoiceCard, type TimelineItem } from "@/components/blog/PlaybookPost";

// Industry picked 2026-11-17 by docs/seo-blog-industry-pick-research.mjs: schools scored
// highest of 16 industries on phrases that name the industry ("whatsapp for schools" 178,
// 8/8 sources). Long tail from docs/seo-blog-three-industries-research.mjs: "school admission
// enquiry form (format)" 94 (8/8), "whatsapp business for schools" 90, "whatsapp for schools"
// 80, "school fees reminder message (to parents, sample)" 80, "ai for schools" 80, "school
// enquiry" 79, "ai chatbot for school" 77, "school chatbot" 76, "whatsapp business api for
// schools" 75, "ai receptionist for schools", "school admission message to parents", "ai for
// school admissions", "ai chatbot for school helpdesk", "ai chatbot for school free",
// "whatsapp for school groups". See docs/seo-research.md, "Industry pick 2026-11-17".
// Competitor fact read 2026-11-17 on trengo.com/pricing: Base €149/month billed yearly or
// €199 monthly (FAQ figures), AI agent "playground only" on Base, Meta fees extra.
// Copy rules (user, 2026-11-17): free, WhatsApp voice agent works, no usage limits anywhere;
// never "unlimited" or "free forever". Voice CTA opens the team's WhatsApp (dashboard still
// shows VoiceUpdateNote). Honest product facts kept: no ERP/fee records, the agent never
// messages first (so reminders go out from the school), Take Order is the admission
// enquiry form (built for orders: the post says to test it), groups off unless switched on.
const href = "/blog/whatsapp-for-schools";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to turn on the Wapzen voice agent for my school's WhatsApp number.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const day: TimelineItem[] = [
  { time: "06:40", channel: "chat", from: "Parent of a new applicant", message: "Are admissions open for class 1 for next year? What is the fee?", outcome: "answered", reply: "Shared the admission dates, the age rule for class 1 and the fee structure from the school’s fee list, then offered to take an admission enquiry." },
  { time: "07:05", channel: "voice", from: "Parent, voice note in Hindi", message: "🎤 “Does the school bus come to Sector 21?”", outcome: "answered", reply: "Transcribed the voice note and replied in Hindi with the bus route that covers Sector 21 and the transport fee for that area." },
  { time: "08:15", channel: "chat", from: "Current parent", message: "Friday is a half day, right? What time is pickup?", outcome: "answered", reply: "Confirmed the half day from the school calendar: pickup at 12:30." },
  { time: "10:20", channel: "photo", from: "Current parent", message: "📷 Photo of a fee receipt: “Paid the term fee, please confirm”", outcome: "handover", reply: "Read the receipt, but it can’t see the school’s fee records, so it thanked the parent and said the accounts office will confirm on this chat." },
  { time: "11:30", channel: "chat", from: "Family moving to the city", message: "Please send the prospectus", outcome: "sent", reply: "Sent the prospectus PDF and the fee structure the school uploaded." },
  { time: "14:10", channel: "chat", from: "Same family", message: "We’d like to visit the school on Saturday", outcome: "request", reply: "Took the child’s name, date of birth, class applied for, current school, parent’s name and preferred visit time, read them back and, after a yes, sent the enquiry to the admissions office’s WhatsApp." },
  { time: "16:45", channel: "call", from: "Grandparent calling on WhatsApp", message: "📞 “What documents do we need for admission?”", outcome: "call", reply: "The voice agent picked up and read out the document list, then asked the caller to send the child’s details on chat." },
  { time: "20:30", channel: "chat", from: "Parent of a class 6 student", message: "My son says he was bullied in class today", outcome: "handover", reply: "Replied with care, didn’t discuss the matter, and said the class coordinator will contact the parent tomorrow morning." },
  { time: "22:50", channel: "chat", from: "Family abroad, writing in Arabic", message: "هل تقبلون الطلاب في منتصف العام الدراسي؟", outcome: "answered", reply: "Answered in Arabic from the school’s mid-year admission policy and offered to take an enquiry." },
];

const prompt = `You are the WhatsApp assistant of Demo Public School, a day school from nursery to class 12.
Say in your first message that you are the school's virtual assistant.
Reply in the parent's language, in two or three short sentences, and ask one question at a time.
Answer only from the school information you were given: fees, admission process, age rules, documents, timings, calendar, transport and uniform. If something isn't there, say the school office will reply. Never invent fees, dates, seats or discounts.
For new admissions, offer to take an admission enquiry. Ask for the student's name, date of birth, the class and year they are applying for, their current school, the parent's name and a preferred day to visit. Repeat the details back and send the enquiry only after the parent says yes. Say the admissions office will call or reply on this chat.
Never say that a seat is confirmed, a fee is paid or a student is admitted.
Don't discuss any student's marks, attendance, behaviour or health. For complaints, safety concerns, fee payments and anything about one student, reply kindly and say the right person from the school will contact them.`;

const enquiryFields = `Admission enquiry: collect these, one or two at a time
1. Student's full name
2. Date of birth
3. Class applying for, and the academic year
4. Current school and class
5. Parent or guardian's name and relationship
6. Email address
7. Area of residence, and whether school transport is needed
8. Preferred day and time for a school visit
9. How they heard about the school
The parent's WhatsApp name and number are saved automatically: don't ask for the phone number.`;

const templates = [
  { title: "Fee reminder message to parents", when: "A week before the due date", text: "Dear parent, a gentle reminder that the term 2 fee for Aarav (class 4B) is due on 10 January. You can pay at the school office or online at [payment link]. Please ignore this if you have already paid. Thank you, Demo Public School" },
  { title: "Overdue fee reminder", when: "After the due date", text: "Dear parent, our records show the term 2 fee for Aarav (class 4B) is still pending. Kindly pay by 20 January to avoid a late fee. If you have already paid, please share the receipt here and our accounts office will update it." },
  { title: "Admissions open message", when: "At the start of admission season", text: "Admissions are now open at Demo Public School for nursery to class 9. Reply here to get the prospectus and fee structure, or to book a school visit. Our assistant answers day and night." },
  { title: "Reply after an admission enquiry", when: "When the office has a visit slot", text: "Dear Mrs Sharma, thank you for your interest in Demo Public School. Your school visit is booked for Saturday at 10 am. Please bring Aarav’s birth certificate and latest report card. We look forward to meeting you!" },
  { title: "Admission confirmation message", when: "When the seat is offered", text: "Congratulations! Aarav’s admission to class 1 at Demo Public School is confirmed. Please complete the admission fee payment by 15 March to secure the seat. Welcome to our school family!" },
  { title: "School closure notice", when: "For a sudden holiday", text: "Dear parents, the school will be closed tomorrow because of heavy rain. Online classes will run as per the timetable. Please stay safe." },
];

const compare = [
  ["Trengo (Base plan)", "€149/month billed yearly, €199 monthly (from its pricing FAQ)", "WhatsApp Business API inbox, email and other channels", "The AI agent is playground only on Base; Meta charges for messages on top"],
  ["WhatsApp API chatbot platforms", "A monthly plan, plus Meta’s charge for each template message", "WhatsApp Business API", "Can broadcast fee reminders with approved templates"],
  ["School apps and ERPs", "Priced per school or per student by each vendor", "Their own parent app, SMS, sometimes WhatsApp", "Hold fee records, attendance and circulars"],
  ["Wapzen", "Free, no card", "WhatsApp chats and WhatsApp calls on your school’s current number", "Answers parents and takes admission enquiries; no fee records"],
];

export default function WhatsAppForSchoolsPage() {
  return <PlaybookPost
    href={href}
    heading={<>WhatsApp for schools.<br /><span>Answer every parent and admission enquiry, free.</span></>}
    lead="Parents ask schools the same questions on WhatsApp all year: fees, admissions, transport, timings, holidays. This playbook follows one day at a school office with a free AI chatbot on its WhatsApp: what it answers, how it fills the admission enquiry form in the chat, what stays with your staff, how to set it up, and fee reminder and admission messages to copy."
    answer={{
      title: "The short answer",
      body: <>A WhatsApp AI chatbot answers parents for your school in seconds, day and night, from your own fee structure, admission process, timings and calendar. <strong>Wapzen</strong> runs it on the number your school office already uses: it collects admission enquiries in the chat and sends them to your admissions team, shares the prospectus and fee PDF, understands voice notes in any language, and its voice agent answers WhatsApp calls. <strong>It’s free</strong>, with no WhatsApp Business API needed.</>,
      specs: [["Price", "Free, no card"], ["Works on", "Your school office’s WhatsApp number"], ["Admission enquiries", "Collected in chat, sent to your team"], ["WhatsApp calls", "Answered by the AI voice agent"]],
    }}
    chapters={[
      {
        id: "what",
        title: "What WhatsApp and AI can do for a school",
        body: <>
          <p>A school’s WhatsApp serves two groups of parents. <strong>New families</strong> ask about seats, fees, age rules, documents, school visits and bus routes. <strong>Current parents</strong> ask about timings, holidays, fee due dates, uniforms, exams and transport. In admission season the office phone and WhatsApp can get more messages in a day than staff can answer.</p>
          <p>An AI chatbot answers both groups from the information you give it. It reads each message as the parent wrote it, in any language, including voice notes and photos, and it never puts a parent on hold. For school-wide announcements, keep using WhatsApp Communities, broadcast lists or your school app; the AI takes care of the one-to-one questions those announcements start.</p>
          <p><strong>Wapzen</strong> links to the school office’s existing WhatsApp or WhatsApp Business number as a device, so the office phone keeps working. It suits schools, preschools and nurseries, colleges, tuition and <Link href="/blog/whatsapp-chatbot-coaching-institute-india">coaching institutes</Link>, language schools and academies.</p>
        </>,
      },
      {
        id: "day",
        title: "One admissions day at a school office, hour by hour",
        body: <>
          <p>Here is one day of WhatsApp messages at a made-up day school, and what the AI did with each one. Green means it answered alone, amber means it saved an enquiry for staff, blue means a WhatsApp call, and purple means it passed the chat to a person.</p>
          <DayTimeline items={day} caption="An illustrative day at a made-up school. Every answer comes from the information the school gave the agent; the families and times are invented." />
          <p>The office opened at 8 am to one admission enquiry already waiting on the Orders page, two chats marked for a person, and no unanswered parents.</p>
        </>,
      },
      {
        id: "jobs",
        title: "Who does what: the AI, the AI with your office, your staff",
        body: <>
          <JobBoard columns={[
            { tone: "ai", title: "The AI handles it", note: "From the information you give it", items: ["Fee structure by class", "Admission dates, age rules and documents", "School timings, holidays and calendar", "Bus routes and transport fees", "Uniform, books and supplies", "Prospectus and fee PDF, in any language"] },
            { tone: "request", title: "The AI takes it, your office confirms", note: "Saved on the Orders page and sent to a staff WhatsApp", items: ["Admission enquiries", "School visit and tour requests", "Call-back requests from the admissions counsellor", "Transport registration requests", "Certificate requests"] },
            { tone: "team", title: "Your staff do it", note: "The AI says the right person will reply", items: ["Offering seats and admission decisions", "Entrance test results", "Fee payments, dues and receipts", "Complaints, bullying and safety concerns", "Anything about one student’s marks or attendance"] },
          ]} />
          <p><strong>Why fees and student records stay with your staff:</strong> Wapzen doesn’t connect to your school management software or fee records by itself, so it can’t see whether a fee is paid or how a child is doing. That is a good thing: the AI can never tell a parent something about a student that it shouldn’t. Upload only information that any parent may read, never student records.</p>
          <InlineCta title="Put a free AI assistant on your school’s WhatsApp" body="No card and no API: it runs on the number parents already have saved." label="Start free" />
        </>,
      },
      {
        id: "form",
        title: "The school admission enquiry form, inside WhatsApp",
        body: <>
          <p>Most schools send parents a PDF or a web form, and many never fill it in. With Wapzen’s <strong>Take Order</strong> switch, the AI asks the form’s questions in the chat, one or two at a time, reads the answers back and saves the enquiry once the parent confirms. It lands on your Orders page and a WhatsApp alert goes to the admissions office. You can export the enquiries as a CSV file.</p>
          <p>Take Order was built for shop orders, so here it works as an enquiry form; test it with a few made-up enquiries first. This is the admission enquiry form format to paste into its instructions; change the fields to yours:</p>
          <PromptFile name="admission-enquiry-form.txt" text={enquiryFields} />
          <p>The parent’s WhatsApp name and number are saved with every enquiry, so the counsellor can call back from the Orders page without asking for a phone number.</p>
        </>,
      },
      {
        id: "setup",
        title: "Set up a school chatbot in one afternoon",
        body: <>
          <SetupSteps items={[
            { title: "Gather the school’s information", time: "45 min", body: <>Fee structure by class, admission dates and process, age rules, documents, timings, the year’s calendar and holidays, bus routes and fees, uniform and book lists. Plain text, Word or PDF all work.</> },
            { title: "Sign up free and link the office’s WhatsApp number", time: "5 min", body: <>On the office phone open WhatsApp › Linked devices › Link a device › Link with phone number instead, and enter the 8-character code. On a computer you can scan the QR code instead. The agent starts answering straight away, so have step 1 ready first.</> },
            { title: "Paste your instructions", time: "10 min", body: <>Copy the instructions below, change the school’s name and rules, and paste them into the agent’s prompt.</> },
            { title: "Add your documents", time: "15 min", body: <>Put the fee structure, calendar and policies in the <strong>Knowledge Base</strong>. Upload the prospectus, fee PDF and bus route map in <strong>Images &amp; Files</strong>, each with a note such as “send when a parent asks for the prospectus”. Add the school website on the <strong>Web Search</strong> card.</> },
            { title: "Switch on Take Order for admission enquiries", time: "10 min", body: <>Paste the enquiry form above into its instructions and add the admissions office’s number under order alerts.</> },
            { title: "Test it like a parent", time: "15 min", body: <>From another phone: ask about fees in another language, send a voice note, ask for the prospectus, make an admission enquiry and ask whether your fee is paid. Fix the instructions wherever an answer isn’t right.</> },
          ]} />
          <PromptFile name="school-office-instructions.txt" text={prompt} />
          <Note>When the calendar, fees or timings change, update the Knowledge Base the same day. The AI answers from what it was given, so an old fee list means old fees.</Note>
        </>,
      },
      {
        id: "templates",
        title: "School fee reminder and admission messages to copy",
        body: <>
          <p>The AI replies whenever a parent writes, but it doesn’t send messages on its own. Fee reminders and admission messages come from your office: one parent at a time from the Wapzen dashboard or the office phone, or to many parents at once with a WhatsApp broadcast list (only parents who saved your number receive it) or your school app. When a parent replies, the AI answers with the whole conversation in view. Change the names, classes and dates to yours:</p>
          <Templates items={templates} />
          <Note>WhatsApp’s Business Messaging Policy asks organisations to message only people who gave them their number and agreed to hear from them. Message your own parents and applicants, and stop if someone asks you to.</Note>
        </>,
      },
      {
        id: "groups",
        title: "Class WhatsApp groups and Communities",
        body: <>
          <p>Many schools run a WhatsApp group for each class, or a Community with an announcements channel. On Wapzen the AI stays quiet in groups unless you switch it on for a group in the Groups tab. Then it answers only when someone tags it or replies to one of its messages, so it never floods a class group.</p>
          <ul>
            <li><strong>Good group questions:</strong> “What time is the annual day rehearsal?”, “Is Monday a holiday?”, “What’s the uniform for sports day?”</li>
            <li><strong>Start with one group,</strong> and tell parents how to ask the assistant.</li>
            <li><strong>Keep individual matters out of groups.</strong> The sample instructions already tell the AI not to discuss any one student.</li>
          </ul>
        </>,
      },
      {
        id: "voice",
        title: "AI receptionist for schools: answering WhatsApp calls",
        body: <>
          <p>In admission season the office phone rings all day, and many parents and grandparents call the school’s WhatsApp instead of typing.</p>
          <VoiceCard
            title="Let the AI answer calls to your school’s WhatsApp"
            body="Wapzen’s voice agent picks up WhatsApp calls to the school’s number in a natural voice and answers from the same information as the chat agent."
            points={["Answers WhatsApp calls during and after office hours", "Speaks the language you set for it", "Answers fees, timings, documents and transport", "Can call parents back on WhatsApp in a calling campaign, for example everyone who asked about admissions this week"]}
            href={voiceAccess}
            label="Turn on the voice agent"
          />
          <p>Message our team on WhatsApp and we’ll switch the voice agent on for your school’s number. It handles WhatsApp calls; calls to the office landline stay with your staff.</p>
        </>,
      },
      {
        id: "compare",
        title: "Free school chatbot vs paid WhatsApp platforms",
        body: <>
          <RowTable caption="WhatsApp options for schools compared, checked 17 November 2026" firstColumn="Option" columns={["Price", "Channel", "Good to know"]} rows={compare} highlight="Wapzen" />
          <p><strong>Use the WhatsApp Business API</strong> through a platform if you must send thousands of fee reminders with approved templates every month, and are ready to pay Meta for each one. <strong>Use your school app or ERP</strong> for fee records, report cards and attendance. <strong>Use Wapzen</strong> to answer parents and applicants on the WhatsApp number they already have saved, for free.</p>
          <p>Since 1 October 2026, Meta also charges API users for service replies beyond the first 1,000 a month per number. Wapzen doesn’t use the API, so there are no Meta charges on top.</p>
        </>,
      },
    ]}
    faq={[
      { q: "Is there a free AI chatbot for schools on WhatsApp?", a: "Yes. Wapzen is a free AI chatbot that runs on your school’s existing WhatsApp number. It answers parents 24/7 from your fees, admission process, timings and calendar, sends the prospectus, takes admission enquiries for your office and answers WhatsApp calls with a voice agent. No card and no WhatsApp Business API are needed." },
      { q: "Can WhatsApp Business be used for schools?", a: "Yes. Many schools use the free WhatsApp Business app for the office number, with a profile, broadcast lists and Communities. Wapzen adds an AI assistant to that same number, so parents get instant answers without the school moving to the paid API." },
      { q: "Can a chatbot collect school admission enquiries?", a: "Yes. With Take Order switched on, the AI asks for the student’s name, date of birth, class, current school, parent’s name and a visit time, reads them back and saves the enquiry once the parent confirms. The admissions office gets a WhatsApp alert and can export the enquiries as a CSV file." },
      { q: "Can it send school fee reminders automatically?", a: "No. The AI replies when parents write; it doesn’t send messages on its own. Send fee reminders from the office phone, a WhatsApp broadcast list or your school app, and the AI will answer the questions parents reply with." },
      { q: "Does it connect to our school ERP or fee software?", a: "Not by itself. It answers from the documents you give it and can’t see fee records, marks or attendance. If your software has a public API, it can be connected with an API tool." },
      { q: "Can the school chatbot reply in Hindi, Arabic or other languages?", a: "Yes. It replies in the language the parent writes in, and it understands voice notes, so parents can ask in the language they’re most comfortable with." },
      { q: "Is a WhatsApp chatbot safe for student data?", a: "Give it only information any parent may read, such as fees, timings and policies, and never upload student records. The sample instructions tell it not to discuss any student’s marks, attendance, behaviour or health and to pass those chats to staff. Check your country’s data rules before you start." },
      { q: "Can AI answer the school’s phone calls?", a: "Wapzen’s voice agent answers WhatsApp calls to the school’s number in a natural voice, from the same information as the chat agent, and can call parents back on WhatsApp. Calls to a landline aren’t part of it." },
      { q: "Does it work for preschools, coaching centres and colleges?", a: "Yes. Any place of learning that gets questions on WhatsApp can use it: schools, preschools, nurseries, colleges, coaching and tuition centres, language schools and training academies." },
    ]}
    sources={[
      { label: "Trengo: pricing", href: "https://trengo.com/pricing" },
      { label: "Meta for Developers: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
      { label: "WhatsApp Business Messaging Policy", href: "https://business.whatsapp.com/policy" },
    ]}
    related={["/blog/whatsapp-chatbot-coaching-institute-india", "/blog/whatsapp-business-greeting-message"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Answer every parent tonight.<br /><span>Free, on your school’s own WhatsApp number.</span></>, body: "Sign up, give the agent your fees, calendar and admission process, and link the office number. No card and no API." }}
  />;
}
