import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "ai voice agent india", "ai telecaller", "ai calling software india", "hindi ai
// voice agent", "free ai voice agent", aimed at mid-size and enterprise sales and support
// teams (the user's brief, 2026-11-01). /ai-calling-agent-india already ranks for "ai
// calling agent india", so this post takes the telecalling-team angle and links to it
// rather than repeating it. Voice is in early access, so the CTA opens WhatsApp. Bolna
// prices read from bolna.ai/pricing on 2026-11-01; TRAI from PR No. 11/2025; DPDP dates
// from secondary sources (check the Gazette before quoting them more precisely). Never
// claim a concurrent-calls figure: the server doesn't enforce or verify one.
const href = "/blog/ai-voice-agent-whatsapp-india";
const post = blogPost(href);
const earlyAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like early access to Wapzen voice agents for my business in India.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const compare = [
  ["Price", "Per minute: ₹5.52 pay-as-you-go on Bolna (6¢), about ₹4.15 with larger top-ups, plus telephony and a platform fee", "Free to start in early access; no per-minute charge"],
  ["Calling number", "A telecom number; commercial calls must come from the 140 or 1600 series", "Your business WhatsApp number, the one customers already chat with"],
  ["Reach", "Any mobile or landline", "Anyone on WhatsApp"],
  ["Live transfer to an agent", "Usually available", "Not available: it sends your agent’s contact by message"],
  ["Follow-up in the same thread", "A separate SMS or WhatsApp tool", "Sends a WhatsApp message during the call"],
  ["Official route", "Licensed telecom route", "Linked device, not Meta’s official API"],
];

const uses = [
  ["Lead call-back", "Form, portal or ad lead added to a campaign by API", "Agent calls on WhatsApp within seconds, qualifies, sends the sales rep’s contact"],
  ["COD confirmation", "New cash-on-delivery order", "Agent confirms the order and address, the result is in the transcript or your store via an API tool"],
  ["Admissions and enquiries", "Student or parent asked for a call-back", "Agent explains courses, fees and batches, sends the application link"],
  ["Payment reminders", "Existing customer near a due date", "Agent reminds politely and sends the payment link; never threatens"],
  ["Inbound support", "Customer taps “call” in your WhatsApp chat", "Agent answers order, delivery and return questions 24/7"],
];

const limits = [
  ["WhatsApp only", "It can’t dial mobiles or landlines outside WhatsApp", "Keep a telecom route for customers who aren’t reachable on WhatsApp"],
  ["No live transfer", "It can’t hand a live call to a telecaller", "It sends the telecaller’s contact and notes the request"],
  ["Short pause", "About one to two seconds before each answer", "Keep its answers short in the instructions"],
  ["Linked device", "Not Meta’s official API, so no guarantee against restrictions", "Call only customers who expect it, and spread volume across numbers we size with you"],
  ["Simple campaigns", "No automatic redial and no CSV import (CSV export only)", "Add leads by API from your CRM"],
  ["Early access", "Voice is set up with our team", "Message us on WhatsApp to start"],
];

const faqs = [
  { q: "What is an AI telecaller?", a: "An AI telecaller is a voice agent that does the calls a telecalling team makes and takes: calling back leads, confirming orders, sending reminders and answering enquiries, in a natural voice and in the customer's language. It reads from your information and logs every call, so your team spends its time on the calls that need a person." },
  { q: "How much does an AI voice agent cost in India?", a: "Phone-line platforms charge per minute. Bolna's pricing page lists ₹5.52 a minute (6 US cents) pay-as-you-go, falling to about ₹4.15 with larger top-ups, with telephony and a platform fee added per minute. Wapzen's voice agent runs on WhatsApp, has no per-minute charge, and is free to start in early access; high-volume use is on a paid plan agreed with you." },
  { q: "Can the AI voice agent speak Hindi and regional languages?", a: "Yes. It speaks Hindi, English (India), Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi and Urdu. Pick a voice that speaks the language, and write the instructions in the language the agent should use." },
  { q: "Do TRAI's 140 and 1600 series rules apply to WhatsApp calls?", a: "TRAI's rules require promotional calls on phone lines to come from the 140 series and service and transactional calls from the 1600 series. WhatsApp calls run over the app, and it isn't settled how these rules apply to them. Don't treat WhatsApp as a way around them: call only customers who asked, and keep your consent records." },
  { q: "Can it handle high call volumes?", a: "Voice is in early access, so we size high-volume set-ups with you, including how many WhatsApp numbers to use. Spreading calls across numbers and calling only people who expect your call protects the numbers from restrictions." },
  { q: "Can it update our CRM?", a: "Yes, with an API tool: the agent can send call details to your CRM or order system during the call. Leads can also be pushed in by API, so a form submission triggers a call within seconds. Test each tool a few times before relying on it." },
  { q: "Is there a free AI calling agent for Indian businesses?", a: "Yes. Wapzen's voice agent is free to start in early access, with no per-minute charge, because calls run over WhatsApp on your own number. Message us on WhatsApp to get it set up." },
];

const sources = [
  { label: "Bolna AI pricing", href: "https://www.bolna.ai/pricing" },
  { label: "TRAI press release No. 11/2025: amendments to the TCCCPR", href: "https://cms.trai.gov.in/sites/default/files/2025-02/PR_No.11of2025.pdf" },
  { label: "YourStory: DPDP Rules 2025 notified, rollout over 18 months", href: "https://yourstory.com/2025/11/digital-personal-data-protection-dpdp-rules-2025-rollout-over-18-months" },
  { label: "Meta: WhatsApp Business Calling API pricing", href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/pricing/" },
];

const sections = [
  {
    id: "what-it-is",
    title: "What is an AI voice agent on WhatsApp?",
    body: <>
      <p>An <strong>AI voice agent on WhatsApp</strong> is an AI telecaller that works on your business WhatsApp number. It answers the WhatsApp calls your customers make, calls back leads who asked for a call, speaks Hindi, English and regional languages, answers from your own information, and logs every call with a transcript.</p>
      <p>For a sales or support team, the change is where the call happens. Phone-line AI calling runs over telecom networks, which means per-minute charges, the 140 and 1600 number series, and calls customers often ignore as spam. A WhatsApp call comes from the business number the customer already chats with, at no per-minute cost.</p>
      <p><strong>Wapzen</strong> links your existing WhatsApp number as a device, so there’s no Business API setup. For an overview of AI calling for Indian businesses, see <Link href="/ai-calling-agent-india">AI calling agent in India</Link>. This guide is for teams that run telecalling at volume.</p>
    </>,
  },
  {
    id: "cost",
    title: "Phone-line AI calling vs WhatsApp: cost and reach",
    body: <>
      <p>Indian voice AI platforms price per minute. Bolna, for example, lists <strong>₹5.52 a minute</strong> (6 US cents) pay-as-you-go, falling to about <strong>₹4.15 a minute</strong> with larger top-ups, with telephony and a platform fee added per minute. At 50,000 minutes a month, that’s roughly ₹2 lakh to ₹2.8 lakh before telephony.</p>
      <Comparison caption="Phone-line AI calling compared with Wapzen's WhatsApp voice agent" columns={["Phone-line AI platform", "Wapzen on WhatsApp"]} rows={compare} />
      <p>Phone-line AI is the right choice when you must reach every customer, including those without WhatsApp, or need live transfers to telecallers. WhatsApp wins when your customers already talk to you on WhatsApp, which in India is most of them, and when per-minute cost is what limits how many calls you make.</p>
      <p>Meta’s official <Link href="/blog/whatsapp-business-calling-api">WhatsApp Business Calling API</Link> is a third route: customer-initiated calls are free, but business-initiated calls are billed per minute at Meta’s INR rates, and each customer must grant call permission first.</p>
    </>,
  },
  {
    id: "use-cases",
    title: "What Indian sales and support teams use it for",
    body: <>
      <Comparison caption="AI voice agent use cases for Indian sales and support teams" columns={["Trigger", "What the agent does"]} rows={uses} />
      <p>Speed is the main win in lead call-back. When your website form or CRM adds a lead to a campaign by API, the agent calls on WhatsApp straight away, while the person is still on your page or in your ad’s app, instead of when a telecaller gets to the list. For COD, see the step-by-step <Link href="/blog/whatsapp-cod-order-confirmation">COD order confirmation on WhatsApp</Link> guide.</p>
      <InlineCta href={earlyAccess} title="Run a pilot with your team" body="Wapzen’s voice agent is in early access and free to start. Message us on WhatsApp with your call volumes and we’ll set it up with you." label="Request early access" />
    </>,
  },
  {
    id: "sample",
    title: "A sample lead call-back in Hindi",
    body: <>
      <Note>Illustrative call, shown in English. The project and prices are made up; the agent answers only from your knowledge base.</Note>
      <p><strong>Agent:</strong> “Namaste, main [developer] ki virtual assistant bol rahi hoon. Aapne abhi [project] ke liye enquiry ki thi. Kya abhi do minute baat ho sakti hai?” (Hello, I’m [developer]’s virtual assistant. You just enquired about [project]. Do you have two minutes?)</p>
      <p><strong>Lead:</strong> “Haan, 2BHK ka price kya hai?” (Yes, what’s the price of a 2BHK?)</p>
      <p><strong>Agent:</strong> “2BHK ₹78 lakh se shuru hote hain, possession December 2027. Aap khud rehne ke liye dekh rahe hain ya investment?” (2BHKs start at ₹78 lakh, possession December 2027. Are you buying to live in or to invest?)</p>
      <p><strong>Lead:</strong> “Khud ke liye. Site visit kab ho sakta hai?” (To live in. When can I visit the site?)</p>
      <p><strong>Agent:</strong> “Main aapka request note kar rahi hoon. Hamare sales advisor Rohit aapko aaj sham tak call karenge. Maine brochure aur location WhatsApp par bhej diya hai.” (I’m noting your request. Our sales adviser Rohit will call you by this evening. I’ve sent the brochure and location on WhatsApp.)</p>
      <p>The transcript lands in the dashboard, and an API tool can push the budget, purpose and visit request into your CRM.</p>
    </>,
  },
  {
    id: "rules",
    title: "TRAI, DPDP and RBI rules for AI calling in India",
    body: <>
      <p><strong>TRAI (phone lines).</strong> Under the February 2025 amendments to the TCCCPR, commercial calls on telecom networks must come from designated number series: <strong>140</strong> for promotional calls and <strong>1600</strong> for service and transactional calls, and ordinary 10-digit numbers can no longer be used for telemarketing. WhatsApp calls run over the app, and it isn’t settled how these rules apply to them. Don’t treat WhatsApp as a loophole. WhatsApp itself restricts numbers that make unwanted calls, so cold-calling purchased lists risks your number.</p>
      <p><strong>DPDP Act and Rules.</strong> The Digital Personal Data Protection Rules were notified in November 2025 with an 18-month rollout. Consent-manager provisions start in November 2026, and most obligations, including notice and consent, apply from May 2027. Build call consent into your forms now: say that you’ll call on WhatsApp, who is calling, and why, and keep the record.</p>
      <p><strong>Collections.</strong> If you’re a lender or work for one, the RBI’s rules on recovery apply, including not calling borrowers before 8 a.m. or after 7 p.m. Keep reminders polite, and never threaten.</p>
      <p><strong>Tell people it’s an AI.</strong> Have the agent introduce itself as a virtual assistant and say the call is transcribed, as in the sample above. Wapzen doesn’t add that line for you.</p>
      <p>This is general information, not legal advice.</p>
    </>,
  },
  {
    id: "setup",
    title: "How a pilot works",
    body: <>
      <ol>
        <li><strong>Message us on WhatsApp</strong> with your use case, monthly call volume, languages and CRM. Voice is in early access, so we set it up with you.</li>
        <li><strong>Write the script as instructions:</strong> who the agent is, what it may and may not say, the questions to ask, and when to hand over to a person.</li>
        <li><strong>Add your knowledge:</strong> products, projects, prices, policies and FAQs, as text, PDF or Word files.</li>
        <li><strong>Connect your systems:</strong> push leads in by API and add API tools that write results back to your CRM.</li>
        <li><strong>Start with one number and one use case,</strong> read the transcripts for a week, tighten the instructions, then scale.</li>
      </ol>
    </>,
  },
  {
    id: "limits",
    title: "Limits to plan around",
    body: <>
      <Comparison caption="Limits of Wapzen's voice agent for Indian teams and how to handle them" columns={["What happens", "How to handle it"]} rows={limits} />
      <Choose highlight="Wapzen" items={[
        { name: "a phone-line AI platform", points: ["You must reach customers who aren’t on WhatsApp", "You need live transfers to telecallers", "You already run DLT-registered 140 or 1600 series calling"] },
        { name: "Wapzen", points: ["Your customers already chat with you on WhatsApp", "Per-minute cost limits how many calls you make", "You want calls and follow-up messages in the same WhatsApp thread"] },
      ]} />
      <p>Wapzen is an independent product, not made by Meta or WhatsApp.</p>
    </>,
  },
];

export default function AiVoiceAgentWhatsAppIndiaPage() {
  return <BlogPost
    href={href}
    heading={<>An AI voice agent on WhatsApp for India.<br /><span>An AI telecaller for sales and support teams.</span></>}
    lead="Phone-line AI calling in India is priced per minute and tied to the 140 and 1600 series. A WhatsApp voice agent calls from the business number your customers already chat with, in Hindi or their own language, with no per-minute charge. Here’s what it costs, what teams use it for, the TRAI and DPDP rules, and the limits."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>What it is:</strong> an AI telecaller on your WhatsApp number that answers calls, calls back leads and logs every call.</>,
        <><strong>Cost:</strong> phone-line platforms charge per minute (Bolna lists ₹5.52 pay-as-you-go). Wapzen’s voice agent is free to start in early access.</>,
        <><strong>Languages:</strong> Hindi, English and nine more Indian languages.</>,
        <><strong>Rules:</strong> TRAI’s number series govern phone lines; DPDP consent obligations apply from May 2027; call only people who asked.</>,
        <><strong>Limits:</strong> WhatsApp only, no live transfer, linked device rather than Meta’s API.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-cod-order-confirmation", "/blog/whatsapp-business-calling-api"]}
    product="/ai-calling-agent-india"
    cta={{ heading: <>More calls, no per-minute bill.<br /><span>Pilot the voice agent on WhatsApp.</span></>, body: "Wapzen’s voice agent is in early access and free to start. Message us on WhatsApp with your call volumes and we’ll set it up with your team." }}
    action={{ href: earlyAccess, label: "Request early access" }}
  />;
}
