import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { InlineCta, Note, RowTable } from "@/components/blog/BlogPost";
import { CallTranscript, DoDont, JobBoard, PlaybookPost, PromptFile, SetupSteps, type CallTurn } from "@/components/blog/PlaybookPost";

// One of seven WhatsApp voice agent industry posts (2026-11-21). Keywords from
// docs/seo-blog-voice-seven-industries-research.mjs: "how to use ai in banking" 337 (8/9),
// "ai agents for financial services" 156, "ai voice agent for banking" 140,
// "ai powered voice assistant for banking system" 135, "ai voice agents for financial services"
// 130, "ai voice agents for banks" 90, "whatsapp ai banking" 50.
// Facts: WhatsApp Business Messaging Policy (updated 23 Sep 2026): section 4 prohibits "Payday
// loans, paycheck advances, peer-to-peer lending, debt collection, and bail bonds" whatever the
// licence, and "Real, virtual, or fake currency, including ICOs and binary options"; section 3
// bans asking for full card, financial account or ID numbers; section 1 opt-in. The policy covers
// the WhatsApp Business app and the Platform. Avista story read on whatsappbusiness.com
// 2026-11-21 (79% less customer time, 340 staff hours in two months, self-reported). FCC
// declaratory ruling of 8 Feb 2024 (AI voices are "artificial" under the TCPA). Vendor prices
// read 2026-11-21. Product facts as in the healthcare post: no live transfer, no memory between
// calls, the agent doesn't know who it's calling, leads one at a time, API tools for lookups.
const href = "/blog/ai-voice-agent-for-financial-services";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to set up the Wapzen WhatsApp voice agent for my financial services business.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const call: CallTurn[] = [
  { who: "agent", text: "Hello, you’ve reached Demo Credit Union. I’m the virtual assistant. I’ll never ask for your PIN, password or one-time code. How can I help?" },
  { who: "caller", text: "Hi. I’m looking for a personal loan of about five thousand dollars. What’s the interest rate?" },
  { who: "agent", text: "Our personal loans start at 9.9 percent a year, for one to five years. Your exact rate depends on your application, and a loan officer confirms it. Would you like to know what you’ll need to apply?" },
  { who: "caller", text: "Yes. And how long does approval take?" },
  { who: "agent", text: "Usually two working days once everything is in. You’ll need a photo ID, your last three payslips and three months of bank statements. Shall I send that checklist to this WhatsApp chat?" },
  { who: "caller", text: "Please do." },
  { tool: "send_text", text: "Sent the personal loan checklist and the link to the online application on the credit union’s own website." },
  { who: "agent", text: "Done, it’s in the chat. Would you like a loan officer to call you back to go through it?" },
  { who: "caller", text: "Yes, tomorrow morning if possible." },
  { who: "agent", text: "Of course. May I have your full name?" },
  { who: "caller", text: "Grace Mensah." },
  { who: "agent", text: "Thank you, Grace. What’s the best number for the call back?" },
  { who: "caller", text: "It’s 024 555 0137." },
  { who: "agent", text: "That’s 0 2 4, 5 5 5, 0 1 3 7, for a call tomorrow morning about a personal loan of around five thousand dollars. Is that right?" },
  { who: "caller", text: "That’s right." },
  { tool: "save_callback", text: "Saved the callback request in the credit union’s CRM: name, number, product, amount and preferred time." },
  { who: "agent", text: "All set. A loan officer will call you tomorrow morning. Is there anything else I can help with?" },
  { who: "caller", text: "No, thanks." },
  { who: "agent", text: "Thank you for calling Demo Credit Union, Grace. Goodbye!" },
  { tool: "end_call", text: "Ended the call after the goodbye." },
];

const prompt = `You are the virtual assistant of Demo Credit Union, answering and making WhatsApp calls.
At the start of every call, say you are a virtual assistant and that we will never ask for a PIN, password or one-time code.
Speak calmly and briefly: one to three sentences, one question at a time.
Answer only from the information you were given: branches and hours, products, published rates and fees, eligibility in general terms and document checklists. Say that rates are starting rates and a loan officer confirms the final offer after an application. Never invent a rate, fee or rule.
Never ask for or accept a PIN, password, one-time code, CVV, or a full card or account number. If a caller starts reading one out, stop them politely.
Never approve, decline or promise a loan, limit or exception. Never give personal investment, tax or debt advice. Never discuss a customer's account or balance on the call.
Lost or stolen card, or a suspected fraud: give the 24-hour card hotline 0800 555 0100 and tell them to call it now.
To check an application, ask for the application reference and use check_application.
When someone wants a loan officer, ask for their name, the best number to call and a preferred time, repeat them back, and save them with save_callback after they confirm.
Offer to send checklists and the online application link with send_text.
When the caller has what they need, say goodbye and end the call.`;

const compare = [
  ["Retell AI", "$0.07–$0.31 a minute, pay as you go; $10 free credit", "Phone lines", "Phone numbers from $2 a month; telephony billed per minute"],
  ["Bland AI", "$0.14 a minute (Start), or $0.12 a minute + $299 a month (Build)", "Phone lines", "Phone billed separately"],
  ["Vapi", "$0.05 a minute platform fee + AI model, voice and transcription at cost", "Phone lines", "Build-your-own platform for developers"],
  ["Synthflow", "Annual enterprise agreement; no per-minute price or free plan", "Phone lines", "Sold through sales, scoped to call volume"],
  ["WhatsApp Calling API platforms", "Calls customers make are free from Meta; calls you make are billed per minute; plus the platform’s fees", "WhatsApp, through the official API", "The route Avista took; customers grant call permission first"],
  ["Wapzen", "Free, no per-minute fees", "WhatsApp, on your current number", "No live transfer; lookups only through your own API"],
];

export default function AiVoiceAgentForFinancialServicesPage() {
  return <PlaybookPost
    href={href}
    heading={<>AI voice agent for financial services, on WhatsApp calls.<br /><span>For banks, lenders and fintechs, free.</span></>}
    lead="Customers already call banks, credit unions, microfinance lenders and fintechs on WhatsApp. This playbook covers the calls an AI voice agent can take for you, one loan enquiry in full, WhatsApp’s rules for financial businesses, how to keep callers safe from scams, setup, and what it costs next to phone-line voice AI."
    answer={{
      title: "The short answer",
      body: <>An <strong>AI voice agent for financial services</strong> answers and makes customer calls in a natural voice: branch hours, loan and account products, published rates and fees, document checklists, application status and callbacks for people who asked about a product. <strong>Wapzen</strong> runs one on the WhatsApp number you already use, <strong>free</strong>, with no per-minute fees. It never asks for one-time codes, PINs, passwords or full card and account numbers, and it doesn’t give personal financial advice.</>,
      specs: [["Price", "Free, no per-minute fees"], ["Calls", "Incoming and outgoing WhatsApp calls"], ["Works on", "Your current WhatsApp number"], ["Never asks for", "One-time codes, PINs or full card numbers"]],
    }}
    chapters={[
      {
        id: "what",
        title: "What an AI voice agent does for a bank or lender",
        body: <>
          <p>An AI voice agent is software that holds a real phone conversation: it listens, answers from the information you give it, and can take actions in your systems, such as saving a callback request. In banking it takes the routine calls that fill a contact centre’s day. When are you open? What’s the rate on a personal loan? What do I need to apply? Has my application gone through?</p>
          <p>WhatsApp calling is already part of this. In September 2025, the Colombian financial services provider <strong>Avista</strong> started answering WhatsApp calls with AI voice agents built by Atomchat on Meta’s WhatsApp Business Calling API. In Meta’s case study, the agent answers questions, collects information from the customer’s profile and routes the call to an adviser when needed. Avista reports a <strong>79% decrease in customer time spent</strong> and 340 hours of staff time saved in the first two months (self-reported).</p>
          <p><strong>Wapzen</strong> gives smaller financial businesses the same kind of agent without the API. It links to your existing WhatsApp or WhatsApp Business number as a linked device, the way WhatsApp Web does. It answers the calls customers make to that number and calls customers who asked to hear from you. It suits credit unions, cooperative and community banks, microfinance institutions, non-bank lenders, money transfer and payment businesses, and advisers’ offices.</p>
        </>,
      },
      {
        id: "calls",
        title: "The calls it takes, and the calls it never takes",
        body: <>
          <JobBoard columns={[
            { tone: "ai", title: "The voice agent handles it", note: "From your product sheets and fee schedule", items: ["Branch and office hours, addresses and holidays", "Savings, loan and card products with published rates", "Who can apply, in general terms", "Documents needed for an application", "Fees, transfer limits and ways to pay", "Calls in the customer’s language"] },
            { tone: "request", title: "It does it through your system", note: "With API tools connected to your own software", items: ["Application status, looked up by application reference", "Booking a branch or adviser appointment", "Saving a callback request in your CRM", "Calling back people who asked about a product"] },
            { tone: "team", title: "Your people do it", note: "The agent tells the caller how", items: ["Approving loans, limits or exceptions", "Anything that needs identity checks or account access", "Fraud, disputes and blocked cards (the agent gives your hotline)", "Personal investment, tax or debt advice", "Hardship requests and complaints"] },
          ]} />
          <p>The rule of thumb: <strong>the agent talks about your products, never about a customer’s money.</strong> A WhatsApp call can be answered by anyone holding the phone, and the agent can’t check who that is. Balances, statements and transactions stay in your app, online banking and branches.</p>
          <InlineCta href={voiceAccess} title="Put an AI voice agent on your WhatsApp number" body="Free, with no per-minute fees. Message our team and we’ll switch the voice agent on for you." label="Message us on WhatsApp" />
        </>,
      },
      {
        id: "call",
        title: "A sample call: a personal loan enquiry",
        body: <>
          <CallTranscript title="Incoming WhatsApp call · Demo Credit Union voice agent" meta="2 min 40 s · English · tools: send_text, save_callback, end_call" turns={call} caption="A sample call. The rate and the checklist come from the credit union’s own documents. save_callback is an API request tool that writes to its CRM; send_text and end_call are built in. The agent quoted the published starting rate, not a personal offer." />
          <p>Notice what the agent didn’t do. It didn’t ask for an account number or a date of birth, didn’t promise approval, and didn’t try to work out a monthly payment for this caller. It gave published facts, sent the checklist in writing, and booked a loan officer for the part that needs a person.</p>
        </>,
      },
      {
        id: "rules",
        title: "WhatsApp’s rules for financial businesses",
        body: <>
          <p>WhatsApp’s Business Messaging Policy (updated 23 September 2026) covers both the WhatsApp Business app and the WhatsApp Business Platform. Three parts matter for financial services:</p>
          <ul>
            <li><strong>Prohibited businesses.</strong> The policy prohibits <em>“Payday loans, paycheck advances, peer-to-peer lending, debt collection, and bail bonds”</em> and adds: <em>“These prohibitions apply irrespective of the global or local licenses, registrations, or other approvals your business may hold.”</em> It also prohibits <em>“Real, virtual, or fake currency, including ICOs and binary options”</em>. Ordinary banking, lending and insurance aren’t on the list. If you collect debts, read <Link href="/blog/ai-voice-agent-for-debt-collection">AI voice agents for debt collection</Link> first.</li>
            <li><strong>No sensitive numbers.</strong> <em>“Don’t share or ask people to share full length individual payment card numbers, financial account numbers, personal ID card numbers, or other sensitive identifiers.”</em> That rules out identity checks by account number on a WhatsApp call.</li>
            <li><strong>Opt-in.</strong> You may contact people only if they gave you their number and agreed to receive messages or calls from you, and you must stop when they ask.</li>
          </ul>
          <p>Your own regulator’s rules apply on top. In the US, the FCC ruled in February 2024 that AI-generated voices count as “artificial” voices under the TCPA, so AI calls need the person’s prior consent. Whether that law covers WhatsApp calls hasn’t been settled, so get consent anyway. In the EU, the AI Act has required since 2 August 2026 that people be told when they’re talking to an AI system. Rules on financial advice still apply, which is why the agent sticks to published facts.</p>
          <DoDont
            dos={["Say at the start of every call that it’s a virtual assistant and that you’ll never ask for a PIN, password or one-time code", "Quote only published rates and fees, and say the final offer comes after an application", "Send checklists, branch addresses and application links on WhatsApp during the call", "Give your official card hotline to anyone reporting a lost card or fraud", "Look up applications by application reference, never by account number", "Call only customers who asked to hear from you, and stop when they say so"]}
            donts={["Ask for one-time codes, PINs, passwords, CVVs or full card and account numbers", "Take payments or card details on the call", "Approve, decline or promise a loan or credit limit", "Give personal investment, tax or debt advice", "Discuss balances or transactions with whoever answers", "Use it for payday loans, peer-to-peer lending, debt collection, ICOs or binary options"]}
          />
        </>,
      },
      {
        id: "trust",
        title: "Make your AI calls easy to trust, and hard to fake",
        body: <>
          <p>Fraudsters pretend to be banks on calls and on WhatsApp, usually to get a one-time code. An AI voice agent shouldn’t make that easier, so make your real calls easy to recognise:</p>
          <ul>
            <li><strong>Call from one number only,</strong> and publish it on your website, app, statements and branch posters.</li>
            <li><strong>Use your official name and logo</strong> on the WhatsApp profile, with your website and address.</li>
            <li><strong>Open every call with the same promise:</strong> “We will never ask for your PIN, password or one-time code.” The sample instructions do.</li>
            <li><strong>Send only links to your own website</strong> during calls, never shortened or third-party links.</li>
            <li><strong>Give customers a way to check:</strong> hang up and call the number on the back of their card or on your website.</li>
          </ul>
        </>,
      },
      {
        id: "outbound",
        title: "Outbound calls: callbacks and due-date reminders",
        body: <>
          <p>In <strong>Outbound</strong>, a campaign pairs a group of customers with the voice agent. Each customer is called on WhatsApp the moment you add them. Two campaigns work well in financial services:</p>
          <ol>
            <li><strong>Product callbacks.</strong> Someone asks about a loan on your website or at a branch and agrees to a call. Add them, and the agent calls within seconds, answers their questions and books a loan officer.</li>
            <li><strong>Due-date reminders for your own customers.</strong> For example, “a reminder that loan payments are due on the 5th, and how to pay”. Keep it to a reminder and how to pay: chasing overdue debts is collections, which WhatsApp prohibits.</li>
          </ol>
          <p>Be clear about the limits. Every customer in a campaign hears the same opening, and the agent doesn’t know who it’s calling. So it must never mention an amount or a balance unless your own system looks it up after the customer gives an application reference. Customers are added one at a time in the dashboard, with no spreadsheet upload or automatic redial yet, so campaigns suit dozens of calls a day, not a contact centre’s thousands.</p>
        </>,
      },
      {
        id: "setup",
        title: "Set up a financial services voice agent",
        body: <>
          <SetupSteps items={[
            { title: "Gather your published information", time: "1 hour", body: <>Branches and hours, products, current starting rates, the fee schedule, eligibility in general terms, document checklists, your card hotline, and your complaints process. Use only what you already publish.</> },
            { title: "Ask our team to switch voice on", time: "2 min", body: <>Message us on WhatsApp from the button on this page. We turn the voice agent on for your account.</> },
            { title: "Link your WhatsApp number", time: "5 min", body: <>Create a voice agent and link the number from its <strong>Phone Number</strong> card by QR code or pairing code. The number keeps working on your phone.</> },
            { title: "Paste the instructions", time: "15 min", body: <>Copy the instructions below and change the name, rates, hotline and rules to yours. Write the opening line, including the “we’ll never ask for your PIN” promise, and set the language (one, or <strong>Multilingual</strong>).</> },
            { title: "Connect your systems", time: "1–2 hours", body: <>Add a send_text tool with your checklist or application link. If your systems have APIs, add a callback tool that writes to your CRM and an application-status tool that takes an application reference. Test each with <strong>Test tool</strong>.</> },
            { title: "Test it like a customer, then like a fraudster", time: "30 min", body: <>Ask about rates in another language, request a callback, report a lost card, try to read out a card number, and ask for a balance. Fix the instructions until every answer is right.</> },
          ]} />
          <PromptFile name="financial-services-voice-agent-instructions.txt" text={prompt} />
          <Note>Each call starts fresh: the agent doesn’t remember earlier calls from the same person, so nothing one customer says can come up in another customer’s call. Your team can read every call’s transcript in the Calls tab.</Note>
        </>,
      },
      {
        id: "cost",
        title: "What an AI voice agent for banking costs",
        body: <>
          <RowTable caption="AI voice agents for financial services compared, prices checked 21 November 2026" firstColumn="Option" columns={["Price", "Calls on", "Good to know"]} rows={compare} highlight="Wapzen" />
          <p>At 2,000 minutes of calls a month, a small branch network, Bland’s Start plan comes to <strong>$280</strong> before phone costs. Retell’s calculator default of $0.11 a minute comes to about <strong>$220</strong>. Wapzen costs nothing, because the calls run over WhatsApp. For the official route, the <Link href="/blog/whatsapp-business-calling-api">WhatsApp Business Calling API guide</Link> explains permissions and per-minute pricing.</p>
          <p><strong>Choose an enterprise platform</strong> if you need live transfer into your contact centre, identity checks with your core banking system, or call recording for compliance. <strong>Choose Wapzen</strong> if your customers already call your WhatsApp number and you want the routine product calls answered, for free.</p>
        </>,
      },
    ]}
    faq={[
      { q: "What is an AI voice agent for financial services?", a: "An AI voice agent for financial services is software that answers and makes customer calls in a natural voice for a bank, credit union, lender or fintech. It answers questions about products, rates, fees and documents, checks application status through the firm’s systems, and books callbacks. Wapzen runs one on an existing WhatsApp number, free." },
      { q: "How do banks use AI voice agents?", a: "Banks use AI voice agents for the routine calls that fill a contact centre: opening hours, product and rate questions, fees, document checklists, application status and appointment booking, with complex cases routed to staff. Colombia’s Avista answers WhatsApp calls with AI voice agents and reports a 79% decrease in customer time spent (self-reported)." },
      { q: "Can a bank use WhatsApp for AI calls?", a: "Yes, with the customer’s opt-in. WhatsApp’s policy allows banking, lending and insurance, but prohibits payday loans, paycheck advances, peer-to-peer lending, debt collection, bail bonds and currency products such as ICOs and binary options, and it bans asking for full card, account or ID numbers." },
      { q: "Will the AI voice agent ask customers for their PIN or one-time code?", a: "No. The sample instructions make it say at the start of every call that the business will never ask for a PIN, password or one-time code, and it stops callers who start reading out card or account numbers." },
      { q: "Can the agent check a customer’s balance?", a: "It shouldn’t. A WhatsApp call can be answered by anyone holding the phone, and WhatsApp’s policy bans asking for account numbers, so balances and transactions stay in your app and branches. The agent can check an application’s status from an application reference through your own API." },
      { q: "Can the agent transfer a caller to a person?", a: "Not live. It saves a callback request in your CRM through an API tool, sends your branch or hotline details on WhatsApp, and your team can read every call’s transcript in the dashboard." },
      { q: "Which financial businesses can’t use WhatsApp?", a: "WhatsApp’s Business Messaging Policy prohibits payday loans, paycheck advances, peer-to-peer lending, debt collection and bail bonds, whatever licences the business holds, plus real, virtual or fake currency including ICOs and binary options. The policy covers both the WhatsApp Business app and the Business Platform." },
      { q: "Does the voice agent speak other languages?", a: "Yes. Set one language, or choose Multilingual and it replies in the language each caller speaks." },
      { q: "How much does an AI voice agent for banking cost?", a: "Wapzen is free, with no per-minute fees. Phone-line platforms charge by the minute, for example Retell AI $0.07–$0.31 and Bland AI $0.14 on its Start plan, while Synthflow sells annual enterprise agreements only (checked 21 November 2026)." },
    ]}
    sources={[
      { label: "WhatsApp Business Messaging Policy (updated 23 September 2026): prohibited businesses, sensitive identifiers, opt-in", href: "https://whatsappbusiness.com/policy/" },
      { label: "WhatsApp Business: Avista success story (AI voice agents on the Calling API)", href: "https://whatsappbusiness.com/resources/success-stories/avista/" },
      { label: "FCC: AI-generated voices in robocalls are artificial under the TCPA (February 2024)", href: "https://www.fcc.gov/document/fcc-makes-ai-generated-voices-robocalls-illegal" },
      { label: "EU AI Act, Article 50: transparency obligations", href: "https://artificialintelligenceact.eu/article/50/" },
      { label: "Retell AI: pricing", href: "https://www.retellai.com/pricing" },
      { label: "Bland AI: pricing", href: "https://www.bland.ai/pricing" },
      { label: "Vapi: pricing", href: "https://vapi.ai/pricing" },
      { label: "Synthflow: pricing", href: "https://synthflow.ai/pricing" },
    ]}
    related={["/blog/whatsapp-business-calling-api", "/blog/ai-voice-agent-for-insurance"]}
    product="/free-ai-calling-agent"
    cta={{ heading: <>Answer your customers’ WhatsApp calls.<br /><span>Free, on your own number.</span></>, body: "Message our team on WhatsApp. We’ll switch the voice agent on, and you can link your number, add your product information and take the first call today." }}
    action={{ href: voiceAccess, label: "Message us on WhatsApp" }}
  />;
}
