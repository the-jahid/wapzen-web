import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { InlineCta, Note, RowTable } from "@/components/blog/BlogPost";
import { CallTranscript, DoDont, PlaybookPost, PromptFile, SetupSteps, type CallTurn } from "@/components/blog/PlaybookPost";

// One of seven WhatsApp voice agent industry posts (2026-11-21), the "Debt Collection" one.
// Keywords from docs/seo-blog-voice-seven-industries-research.mjs: "ai debt collection software"
// 291 (8/9), "ai for debt collections" 283, "ai voice agents for debt collection" 240, "how to
// improve debt collection by ai" 199, "voice bot for debt collection" 150, "how to send reminder
// for payment" 135, "ai debt collection calls" 110, "ai call for payment reminder" 100, "voice ai
// for debt collection" 95, "ai debt collector" 80 (8/9), "emi reminder call" 50.
// WHY THIS POST SAYS NO: WhatsApp's Business Messaging Policy (updated 23 Sep 2026, covers the
// Business app and the Platform) prohibits "Payday loans, paycheck advances, peer-to-peer lending,
// debt collection, and bail bonds ... irrespective of the global or local licenses". So the post
// doesn't sell Wapzen to collection agencies; it answers the question, explains phone-line
// collection voice AI, and offers first-party payment reminders to opted-in customers.
// Rules read on their own pages 2026-11-21: FDCPA s.805 (15 U.S.C. 1692c), Regulation F
// s.1006.14(b)(2), RBI circular RBI/2022-23/108 of 12 Aug 2022 (no recovery calls before 8 am or
// after 7 pm), FCC ruling of Feb 2024 on AI voices. Retell's debt collection page and prices read
// 2026-11-21. Not legal advice, and the post says so.
const href = "/blog/ai-voice-agent-for-debt-collection";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to set up Wapzen WhatsApp voice calls for payment reminders to my own customers.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const call: CallTurn[] = [
  { who: "agent", text: "Hello, this is the virtual assistant of Demo Public School, calling with a reminder that term two fees are due on the 10th of December. Do you have a moment?" },
  { who: "caller", text: "Yes. How much is it for my daughter? She’s in grade five." },
  { who: "agent", text: "Term two fees for grade five are 18,500 rupees, the same for every student in that grade. Would you like me to send the payment details to this chat?" },
  { who: "caller", text: "Yes. Can I pay in two parts this time?" },
  { who: "agent", text: "I can’t agree to that myself, but the accounts office can look at it. Shall I pass on your request? I’ll need your name and your daughter’s name." },
  { who: "caller", text: "Yes. I’m Priya Nair, and she’s Anika Nair, grade five B." },
  { who: "agent", text: "Thank you. So Priya Nair, for Anika Nair in grade five B, asking to pay term two fees in two parts. Is that right?" },
  { who: "caller", text: "That’s right." },
  { tool: "save_request", text: "Saved the request for the accounts office: parent’s name, student, class, and the request to pay in two parts." },
  { tool: "send_text", text: "Sent the school’s official payment link and the accounts office hours to this WhatsApp chat." },
  { who: "agent", text: "I’ve passed on your request, and the accounts office will reply on this chat. The payment link and their hours are in the chat now. Is there anything else?" },
  { who: "caller", text: "No, thank you." },
  { who: "agent", text: "Thank you, Priya. Have a good day. Goodbye!" },
  { tool: "end_call", text: "Ended the call after the goodbye." },
];

const prompt = `You are the virtual assistant of Demo Public School, making short payment reminder calls to parents on WhatsApp and answering their calls.
In your first sentence, say you are the school's virtual assistant and why you are calling.
Speak warmly and briefly: one to three sentences, one question at a time. You are giving a reminder, not chasing a debt.
Facts come only from the fee schedule and payment information you were given: fees by grade, due dates, payment methods, the accounts office hours. Never invent an amount, a fine or a deadline.
You don't know which family you are speaking to. Never mention a specific family's balance, arrears or history. Talk only about the fee schedule.
Never threaten, shame or pressure. Never mention late fines unless the fee schedule says so, and never mention legal action, debt collectors or a child's place at the school.
Never agree to discounts, delays or payment plans. Offer to pass the request to the accounts office: ask for the parent's and student's names and the class, read them back, and save them with save_request after they confirm.
Never ask for card or bank account numbers. Offer to send the official payment link with send_text.
If the person says they don't want these calls, apologise, say you'll pass that on, save it with save_request and end the call.
If someone other than a parent answers, ask them to pass on that the school called about term fees, and say nothing more.
When the caller has what they need, say goodbye and end the call.`;

const compare = [
  ["Retell AI", "$0.07–$0.31 a minute, pay as you go", "Phone lines", "Its debt collection page lists Reg F call limits, required disclosures, identity checks, SMS payment links and recorded calls"],
  ["Bland AI", "$0.14 a minute (Start), or $0.12 a minute + $299 a month (Build)", "Phone lines", "Phone billed separately"],
  ["Vapi", "$0.05 a minute platform fee + AI model, voice and transcription at cost", "Phone lines", "Build-your-own: you add the compliance logic"],
  ["Synthflow", "Annual enterprise agreement; no per-minute price", "Phone lines", "Sold through sales"],
  ["Wapzen", "Free, no per-minute fees", "WhatsApp, on your current number", "Not for debt collection; reminder calls to your own opted-in customers only"],
];

export default function AiVoiceAgentForDebtCollectionPage() {
  return <PlaybookPost
    href={href}
    heading={<>AI voice agents for debt collection, and what WhatsApp allows.<br /><span>The straight answer before you set anything up.</span></>}
    lead="AI voice agents now make collection calls for lenders and agencies, and many teams want to run them on WhatsApp, where their customers are. This guide explains what collection voice agents do, why WhatsApp’s own policy rules debt collection out, the calling rules that apply anyway, and the payment reminder calls a business can still make to its own customers."
    answer={{
      title: "The short answer",
      body: <>WhatsApp’s Business Messaging Policy <strong>prohibits debt collection on WhatsApp</strong>, whatever licence the business holds, on the WhatsApp Business app as well as the official API. Collection agencies, debt buyers and recovery firms shouldn’t run AI collection calls on WhatsApp, with Wapzen or any other tool. For them, the route is a phone-line voice AI platform built for collections compliance. What a business <em>can</em> do is remind its own customers, who agreed to hear from it, about a payment that’s coming due. Wapzen’s free WhatsApp voice agent can make those reminder calls.</>,
      specs: [["Debt collection on WhatsApp", "Prohibited, licence or not"], ["Allowed", "Reminders to your own opted-in customers"], ["Wapzen price", "Free, no per-minute fees"], ["Never", "Threats, pressure or telling others about a debt"]],
    }}
    chapters={[
      {
        id: "whatsapp",
        title: "Can you use WhatsApp for debt collection?",
        body: <>
          <p>No. WhatsApp’s Business Messaging Policy, updated 23 September 2026, lists among the prohibited products and services: <em>“Payday loans, paycheck advances, peer-to-peer lending, debt collection, and bail bonds.”</em> It goes on: <em>“These prohibitions apply irrespective of the global or local licenses, registrations, or other approvals your business may hold.”</em></p>
          <p>The policy governs “WhatsApp for Business services”, and it names both the WhatsApp Business app and the WhatsApp Business Platform, the official API. So the answer is the same whether a collector uses an API provider, the Business app or a tool linked to either. A licensed collection agency is still a collection agency under this rule.</p>
          <p>That’s why this guide doesn’t recommend Wapzen, or any WhatsApp tool, to collection agencies, debt buyers or recovery firms. The rest of it covers what those businesses can use instead, the rules every collection call must follow, and the reminder calls that ordinary businesses can still make on WhatsApp.</p>
        </>,
      },
      {
        id: "what",
        title: "What AI voice agents for debt collection do",
        body: <>
          <p>An AI voice agent for debt collection is software that makes and answers collection calls in a natural voice, usually on ordinary phone lines. The products on the market typically:</p>
          <ul>
            <li><strong>Call through a list of accounts</strong>, within the call-frequency and calling-hour limits the law sets.</li>
            <li><strong>Check they have the right person</strong> before saying anything about the debt, and give the required disclosures.</li>
            <li><strong>Remind and offer options:</strong> the amount due, a payment link by text message, and payment plans within limits the creditor approved in advance.</li>
            <li><strong>Hand over to people</strong> for disputes, hardship, complaints and anyone who asks for a human.</li>
            <li><strong>Keep a record:</strong> recordings and transcripts that show what was said, for audits.</li>
          </ul>
          <p>Retell AI’s debt collection page, for example, lists follow-ups with SMS payment links, settlements limited to pre-approved options, escalation to human collectors, and “Compliance Built Into Every Call”: required disclosures, identity checks, Reg F call-frequency limits, opt-out handling and a recorded, auditable record. When you compare platforms, check those features first and the voice quality second.</p>
        </>,
      },
      {
        id: "rules",
        title: "The calling rules collection calls must follow",
        body: <>
          <p>Whatever the channel, collection calls are among the most regulated calls a business makes. Three sets of rules show what regulators expect. This is a summary, not legal advice, so check the rules in your own country.</p>
          <ul>
            <li><strong>United States, FDCPA section 805:</strong> unless it knows otherwise, a debt collector must assume the convenient time to contact a consumer is after 8 am and before 9 pm, local time at the consumer’s location. It also may not discuss the debt with anyone other than the consumer, with narrow exceptions.</li>
            <li><strong>United States, Regulation F section 1006.14:</strong> a collector is presumed to comply with the ban on harassing calls if it calls about a debt no more than seven times within seven consecutive days, and not within seven days after a phone conversation about that debt.</li>
            <li><strong>United States, the FCC:</strong> since February 2024, AI-generated voices count as “artificial” voices under the TCPA, so AI calls need the person’s prior consent.</li>
            <li><strong>India, RBI circular of 12 August 2022:</strong> lenders and their recovery agents must not call borrowers before 8:00 am or after 7:00 pm to recover overdue loans, and must not intimidate or harass them.</li>
          </ul>
          <p>In the EU, the AI Act has also required since 2 August 2026 that people be told when they’re talking to an AI system. A good collection voice agent builds these limits into the platform instead of leaving them to each script.</p>
        </>,
      },
      {
        id: "reminders",
        title: "What you can do on WhatsApp: payment reminders to your own customers",
        body: <>
          <p>The policy prohibits debt collection as a business. It doesn’t stop an ordinary business from reminding its own customers about a payment, as long as they gave you their number and agreed to hear from you. That covers schools reminding parents about term fees, gyms and clubs about renewals, and clinics about an unpaid invoice. It also covers suppliers reminding shops that an invoice is due, landlords about rent, and banks and other licensed lenders about an instalment due date.</p>
          <p>The line between a reminder and collection isn’t drawn in the policy, so draw it conservatively:</p>
          <ul>
            <li><strong>Remind around the due date,</strong> once, with the facts and how to pay. Don’t call the same person about the same bill again and again.</li>
            <li><strong>Remind only for money owed to you,</strong> never for another business, and never for debts you bought.</li>
            <li><strong>Move overdue accounts to your normal process</strong> (a letter, the accounts office, a phone call from your staff) instead of chasing them on WhatsApp.</li>
            <li><strong>Payday lenders, paycheck advances and peer-to-peer lenders</strong> can’t use WhatsApp at all, reminders included.</li>
          </ul>
          <InlineCta href={voiceAccess} title="Make reminder calls to your own customers" body="Free, on your WhatsApp number, with no per-minute fees. Message our team and we’ll switch the voice agent on for you." label="Message us on WhatsApp" />
        </>,
      },
      {
        id: "call",
        title: "A sample reminder call: school term fees",
        body: <>
          <CallTranscript title="Outgoing WhatsApp call · Demo Public School voice agent" meta="1 min 50 s · English · campaign: term two fee reminder · tools: save_request, send_text, end_call" turns={call} caption="A sample reminder call to a parent who agreed to calls from the school. The agent talks only about the published fee schedule, because it doesn’t know which family it has called. save_request is an API request tool that sends requests to the accounts office; send_text and end_call are built in." />
          <p>This is what a reminder should sound like: who’s calling and why in the first sentence, facts from the fee schedule, a payment link in writing, and anything that needs a decision passed to a person. There’s no pressure, no mention of fines or consequences, and no promise the agent can’t keep.</p>
          <Note>Every parent in a campaign hears the same opening, and the agent doesn’t know whose phone it called, so it never mentions a family’s own balance or history. That limit is also a safeguard: it can’t tell a family’s money matters to whoever picks up the phone.</Note>
        </>,
      },
      {
        id: "dos",
        title: "Rules for payment reminder calls on WhatsApp",
        body: <>
          <DoDont
            dos={["Call only your own customers who agreed to calls, about money owed to you", "Say who’s calling, that it’s a virtual assistant and why, in the first sentence", "Keep to the facts: what’s due, when, and how to pay", "Send your official payment link on WhatsApp so they can pay in writing", "Call in daytime hours, and in India never before 8 am or after 7 pm about overdue loans", "Stop calling anyone who asks, and pass disputes and hardship to a person"]}
            donts={["Collect for other businesses, or buy debts and chase them on WhatsApp", "Threaten, shame or pressure, or mention legal action", "Mention a customer’s own balance to whoever answers", "Call the same person again and again about the same bill", "Ask for card or account numbers on the call", "Let the agent agree to plans, delays or discounts"]}
          />
        </>,
      },
      {
        id: "setup",
        title: "Set up a reminder campaign",
        body: <>
          <SetupSteps items={[
            { title: "Write down the facts", time: "30 min", body: <>Your fee or price schedule, due dates, payment methods with your official payment link, office hours, and who handles requests to pay late or in parts.</> },
            { title: "Ask our team to switch voice on", time: "2 min", body: <>Message us on WhatsApp from the button on this page. We turn the voice agent on for your account.</> },
            { title: "Link your WhatsApp number", time: "5 min", body: <>Create a voice agent with calls in both directions, and link your number from its <strong>Phone Number</strong> card by QR code or pairing code.</> },
            { title: "Paste the instructions", time: "15 min", body: <>Copy the instructions below and change them to your business. Write an opening that says who’s calling, that it’s a virtual assistant, and why.</> },
            { title: "Add the tools", time: "30 min", body: <>A send_text tool with your payment link and office hours, and an API request tool that sends requests and opt-outs to your accounts team, or a sheet through Make or Zapier.</> },
            { title: "Create the campaign and add customers", time: "per campaign", body: <>In <strong>Outbound</strong>, create a campaign such as “term two fees” and add customers who agreed to calls, one at a time. Each one is called as soon as you add them, so add them during daytime hours.</> },
          ]} />
          <PromptFile name="fee-reminder-voice-agent-instructions.txt" text={prompt} />
          <Note>There’s no automatic redial, which suits reminders: one call per customer, not repeated attempts. If someone doesn’t answer, the campaign’s call list shows it, and your staff decide what happens next.</Note>
        </>,
      },
      {
        id: "options",
        title: "If you’re a collection agency: your options",
        body: <>
          <p>Collection agencies, debt buyers and in-house recovery teams chasing overdue accounts need a phone-line platform with collection compliance built in. Here is how the main options compare, with Wapzen shown for what it is: a tool for reminders, not collections.</p>
          <RowTable caption="AI voice agents for collections compared, prices checked 21 November 2026" firstColumn="Option" columns={["Price", "Calls on", "Good to know"]} rows={compare} highlight="Wapzen" />
          <p>For an agency making 5,000 minutes of calls a month, Retell’s calculator default of $0.11 a minute comes to about <strong>$550</strong>, and Bland’s Start plan to <strong>$700</strong>, before phone costs. Whichever you choose, ask the vendor to show the call-frequency limits, calling-hour rules, disclosures and opt-out handling working for your country before you load a single account. For businesses reminding their own customers, the <Link href="/blog/ai-voice-agent-for-financial-services">AI voice agent for financial services</Link> guide covers bank and lender reminders in more detail.</p>
        </>,
      },
    ]}
    faq={[
      { q: "Can you use WhatsApp for debt collection?", a: "No. WhatsApp’s Business Messaging Policy prohibits debt collection, along with payday loans, paycheck advances, peer-to-peer lending and bail bonds, whatever licences the business holds. The policy covers both the WhatsApp Business app and the WhatsApp Business Platform (the official API)." },
      { q: "What is an AI voice agent for debt collection?", a: "An AI voice agent for debt collection is software that makes and answers collection calls in a natural voice. It checks it has the right person, gives required disclosures, reminds them of the amount due, sends payment links, offers pre-approved payment plans and hands disputes and hardship cases to people. These agents run on ordinary phone lines." },
      { q: "Are AI debt collection calls legal?", a: "In many countries, yes, within the rules for collection calls. In the US, the FDCPA presumes calls before 8 am or after 9 pm are inconvenient, Regulation F presumes compliance at no more than seven calls in seven days per debt, and the FCC requires consent for AI-voiced calls. In India, the RBI bars recovery calls before 8 am or after 7 pm. This isn’t legal advice." },
      { q: "Can a business send payment reminder calls on WhatsApp?", a: "Yes, to its own customers who gave it their number and agreed to hear from it, about money owed to that business. Keep it to a reminder around the due date and how to pay, and move overdue accounts to your normal process instead of chasing them on WhatsApp." },
      { q: "What is an EMI reminder call?", a: "An EMI reminder call tells a borrower that a loan instalment (an equated monthly instalment) is due and how to pay it. Banks and other licensed lenders can make reminders like this to their own borrowers who agreed to calls. In India, the RBI bars calls before 8 am or after 7 pm to recover overdue loans." },
      { q: "Can Wapzen’s voice agent negotiate payment plans?", a: "No. Wapzen’s voice agent isn’t for debt collection. On reminder calls it gives the facts from your schedule, sends your payment link and passes requests to pay late or in parts to your staff. It shouldn’t agree to plans or discounts itself." },
      { q: "Which financial businesses can’t use WhatsApp at all?", a: "WhatsApp’s policy prohibits payday loans, paycheck advances, peer-to-peer lending, debt collection and bail bonds, plus real, virtual or fake currency including ICOs and binary options. Licences don’t change that." },
      { q: "How much does an AI voice agent for debt collection cost?", a: "Phone-line platforms charge by the minute: Retell AI $0.07–$0.31, Bland AI $0.14 on its Start plan, and Vapi $0.05 plus the AI model’s cost, while Synthflow sells annual agreements (checked 21 November 2026). Wapzen is free, but only for reminder calls to your own customers, not collection." },
    ]}
    sources={[
      { label: "WhatsApp Business Messaging Policy (updated 23 September 2026): scope and prohibited businesses", href: "https://whatsappbusiness.com/policy/" },
      { label: "US Code: 15 U.S.C. 1692c (FDCPA section 805), communication in connection with debt collection", href: "https://www.law.cornell.edu/uscode/text/15/1692c" },
      { label: "CFPB: Regulation F, section 1006.14 (harassing, oppressive or abusive conduct)", href: "https://www.consumerfinance.gov/rules-policy/regulations/1006/14/" },
      { label: "RBI circular RBI/2022-23/108 (12 August 2022): responsibilities of regulated entities employing recovery agents", href: "https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12378&Mode=0" },
      { label: "FCC: AI-generated voices in robocalls are artificial under the TCPA (February 2024)", href: "https://www.fcc.gov/document/fcc-makes-ai-generated-voices-robocalls-illegal" },
      { label: "EU AI Act, Article 50: transparency obligations", href: "https://artificialintelligenceact.eu/article/50/" },
      { label: "Retell AI: AI phone agent for debt collection", href: "https://www.retellai.com/industry-pages/debt-collection" },
      { label: "Retell AI: pricing", href: "https://www.retellai.com/pricing" },
      { label: "Bland AI: pricing", href: "https://www.bland.ai/pricing" },
      { label: "Vapi: pricing", href: "https://vapi.ai/pricing" },
      { label: "Synthflow: pricing", href: "https://synthflow.ai/pricing" },
    ]}
    related={["/blog/ai-voice-agent-for-financial-services", "/blog/whatsapp-for-schools"]}
    product="/free-ai-calling-agent"
    cta={{ heading: <>Remind your own customers, the friendly way.<br /><span>Free WhatsApp reminder calls on your own number.</span></>, body: "Message our team on WhatsApp. We’ll switch the voice agent on for payment reminders to customers who agreed to hear from you. It isn’t for debt collection, because WhatsApp doesn’t allow it." }}
    action={{ href: voiceAccess, label: "Message us on WhatsApp" }}
  />;
}
