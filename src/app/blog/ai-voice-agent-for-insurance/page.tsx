import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { InlineCta, Note, RowTable } from "@/components/blog/BlogPost";
import { CallTranscript, DoDont, JobBoard, PlaybookPost, PromptFile, SetupSteps, type CallTurn } from "@/components/blog/PlaybookPost";

// One of seven WhatsApp voice agent industry posts (2026-11-21). Keywords from
// docs/seo-blog-voice-seven-industries-research.mjs: "ai for insurance companies" 727 (8/9),
// "ai cold calling for insurance agents" 300, "ai for insurance agents" 281, "ai for insurance
// claims" 234, "ai for insurance agency" 215, "ai virtual assistant for insurance agents" 150,
// "voice ai for insurance agents" 145, "ai agent for insurance agency" 145, "best ai voice agents
// for insurance" 120, "ai voice agent for insurance" 100, "ai receptionist for insurance agents" 100.
// Facts: HBR 2011, "The Short Life of Online Sales Leads" (within an hour: nearly 7x as likely to
// qualify as an hour later, 60x vs 24 hours or more); WhatsApp Business Messaging Policy (updated
// 23 Sep 2026) opt-in and sensitive identifiers; FCC declaratory ruling of 8 Feb 2024 on AI
// voices. The cold-calling section says no, per the opt-in rule; no ban wording (user rule).
// Product facts: campaign leads are dialled as they're added, one at a time, same opening for
// every lead; no live transfer; API tools for CRM writes; send_text for document lists.
const href = "/blog/ai-voice-agent-for-insurance";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hi, I'd like to set up the Wapzen WhatsApp voice agent for my insurance agency.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const call: CallTurn[] = [
  { who: "agent", text: "Hello, this is the virtual assistant of Demo Insurance Agency. You recently asked for a car insurance quote on our website. Is now a good time for a few quick questions?" },
  { who: "caller", text: "Oh, yes. That was quick." },
  { who: "agent", text: "Great. What car is it, and which year?" },
  { who: "caller", text: "A 2021 Toyota Corolla." },
  { who: "agent", text: "Thank you. Is it for personal use, and roughly how many kilometres a year?" },
  { who: "caller", text: "Personal. Maybe twelve thousand." },
  { who: "agent", text: "And when does your current insurance end, if you have one?" },
  { who: "caller", text: "End of next month. Should I get comprehensive or just third party?" },
  { who: "agent", text: "In general, third-party cover pays for damage you cause to other people and their property, and comprehensive also covers your own car, for example after an accident, theft or fire. Which one suits you is something our licensed agent will go through with you. May I have your full name?" },
  { who: "caller", text: "Ana Pereira." },
  { who: "agent", text: "Thank you, Ana. Our agent can call you tomorrow with quotes from three insurers. Would you prefer the morning or the afternoon?" },
  { who: "caller", text: "Afternoon." },
  { who: "agent", text: "So that’s a 2021 Toyota Corolla for personal use, about twelve thousand kilometres a year, current policy ending next month, and a call tomorrow afternoon. Is that right?" },
  { who: "caller", text: "Yes." },
  { tool: "save_lead", text: "Saved to the agency’s CRM: name, car, use, mileage, renewal date, the cover question and a callback tomorrow afternoon." },
  { tool: "send_text", text: "Sent a WhatsApp message with what to have ready for the call: driving licence and current policy schedule." },
  { who: "agent", text: "Done. Our agent will call you tomorrow afternoon, and I’ve sent a short list of what to have ready to this chat. Anything else I can help with?" },
  { who: "caller", text: "No, that’s great. Thanks." },
  { who: "agent", text: "Thank you, Ana. Goodbye!" },
  { tool: "end_call", text: "Ended the call after the goodbye." },
];

const prompt = `You are the virtual assistant of Demo Insurance Agency, an independent agency selling car, home, health and life insurance from several insurers. You answer and make WhatsApp calls.
At the start of every call, say you are the agency's virtual assistant.
Speak warmly and briefly: one to three sentences, one question at a time.
Answer only from the information you were given: the types of cover we sell, the insurers we work with, what policies cover in general from the insurers' own summaries, documents needed, office hours and how to pay premiums.
You are not a licensed agent. Never recommend a policy for the caller, never compare quotes for them, never quote a final premium and never say cover is in place. Say a licensed agent will go through it with them.
New quote leads: ask the questions for that type of cover one at a time (car: make, model, year, use, yearly kilometres, current policy end date), then ask for their name and a morning or afternoon callback. Repeat the details back and save them with save_lead after they confirm. Send the "what to have ready" list with send_text.
Claims: if anyone is hurt, tell them to call the emergency services first. Otherwise ask, one at a time, for their name, what happened, the date, time and place, the car registration or home address, and any other party or police report reference. Read the details back, save them with save_claim after they confirm, and send the photo request with send_text. Never say whether a claim will be paid.
Never ask for full policy, ID or card numbers, and never take payments on the call.
When the caller has what they need, say goodbye and end the call.`;

const compare = [
  ["Retell AI", "$0.07–$0.31 a minute, pay as you go; $10 free credit", "Phone lines", "Has insurance lead follow-up and claims pages; telephony billed per minute"],
  ["Bland AI", "$0.14 a minute (Start), or $0.12 a minute + $299 a month (Build)", "Phone lines", "Phone billed separately"],
  ["Vapi", "$0.05 a minute platform fee + AI model, voice and transcription at cost", "Phone lines", "Build-your-own platform for developers"],
  ["WhatsApp Calling API platforms", "Calls clients make are free from Meta; calls you make are billed per minute; plus the platform’s fees", "WhatsApp, through the official API", "A client must grant call permission before you call"],
  ["Wapzen", "Free, no per-minute fees", "WhatsApp, on your agency’s current number", "No live transfer: books the licensed agent’s callback"],
];

export default function AiVoiceAgentForInsurancePage() {
  return <PlaybookPost
    href={href}
    heading={<>AI voice agent for insurance agents, on WhatsApp calls.<br /><span>Every new lead called back in seconds, for free.</span></>}
    lead="Insurance is sold and serviced over the phone, and more of those calls now happen on WhatsApp. This playbook shows how an AI voice agent calls new leads back within seconds, answers policyholders and takes the first details of a claim, where the rules stop it, and how to set it up, with a sample call and costs."
    answer={{
      title: "The short answer",
      body: <>An <strong>AI voice agent for insurance</strong> answers and makes calls for an agency or insurer in a natural voice. It calls new leads back within seconds and asks your qualifying questions. It answers cover and document questions from your material, takes the first details of a claim, and books a licensed agent for the quote. <strong>Wapzen</strong> runs one on your existing WhatsApp number, <strong>free</strong>, with no per-minute fees. It doesn’t recommend or bind cover, and it calls only people who asked you to.</>,
      specs: [["Price", "Free, no per-minute fees"], ["Calls", "New leads, policyholders, first notice of loss"], ["Works on", "Your agency’s current WhatsApp number"], ["Never does", "Bind cover, advise or cold call"]],
    }}
    chapters={[
      {
        id: "speed",
        title: "Why speed decides insurance leads",
        body: <>
          <p>Someone who asks for a quote usually asks several agencies at once, and the first useful conversation often wins. A Harvard Business Review study of 1.25 million sales leads put numbers on it. Companies that tried to reach a lead within an hour were nearly <strong>seven times</strong> as likely to have a meaningful conversation with the decision maker as those that waited even an hour longer. They were more than <strong>60 times</strong> as likely as those that waited a day or more.</p>
          <p>An agency can’t keep a person by the phone for every web form. An AI voice agent doesn’t need to be: in <strong>Wapzen</strong>, when you add a lead to a calling campaign, the agent calls them on WhatsApp straight away. It asks your qualifying questions, saves the answers to your CRM and books a licensed agent for the conversation that needs one.</p>
          <p>The same agent answers the calls clients make to your WhatsApp number: questions about cover, documents, renewals and claims, at 9 pm as readily as at 9 am. It links to your existing WhatsApp or WhatsApp Business number as a linked device, so your team keeps using the number too.</p>
        </>,
      },
      {
        id: "jobs",
        title: "What an AI voice agent does in an insurance agency",
        body: <>
          <JobBoard columns={[
            { tone: "ai", title: "The voice agent handles it", note: "From your material and the insurers’ summaries", items: ["Which types of cover you sell and which insurers you work with", "What a policy covers in general terms", "Documents needed for a quote or a claim", "Office hours and how to pay premiums", "Calls in the caller’s language"] },
            { tone: "request", title: "It does it through your system", note: "With API tools connected to your CRM or agency software", items: ["Qualifying new leads and saving the answers", "Booking a licensed agent’s callback", "Taking first notice of a claim as a claim record", "Sending claim forms and document lists on WhatsApp"] },
            { tone: "team", title: "Your licensed agents do it", note: "The agent books them in", items: ["Recommending a policy or comparing quotes for a person", "Final premiums and binding cover", "Policy changes and cancellations", "Claim decisions and payouts", "Complaints"] },
          ]} />
          <p>Selling and advising on insurance is licensed work in most countries, so the line is clear: the voice agent gathers facts and explains cover in general terms, and a licensed person gives the advice and the final quote.</p>
          <InlineCta href={voiceAccess} title="Call your next lead back in seconds" body="Free, on your agency’s WhatsApp number. Message our team and we’ll switch the voice agent on for you." label="Message us on WhatsApp" />
        </>,
      },
      {
        id: "call",
        title: "A sample call: a car insurance lead, called back at once",
        body: <>
          <CallTranscript title="Outgoing WhatsApp call · Demo Insurance Agency voice agent" meta="2 min 50 s · English · campaign: car insurance web leads · tools: save_lead, send_text, end_call" turns={call} caption="A sample outbound call. The agency added Ana to its “car insurance web leads” campaign after she filled in the website form, and the agent called at once. save_lead is an API request tool that writes to the agency’s CRM; send_text and end_call are built in." />
          <p>When Ana asked which cover to choose, the agent explained the difference in general terms and left the recommendation to a licensed agent. It didn’t quote a price either. It collected what the agent needs to quote and put the call in the diary.</p>
          <Note>Every lead in a campaign hears the same opening, and the agent doesn’t know the lead’s name until they say it. Run one campaign per kind of lead, such as car quotes, home quotes and renewals, so the opening always fits.</Note>
        </>,
      },
      {
        id: "claims",
        title: "First notice of loss: claim details by WhatsApp call",
        body: <>
          <p>Policyholders call at bad moments: after an accident, a break-in or a burst pipe, often outside office hours. The voice agent can take the first notice of loss calmly, one question at a time:</p>
          <ol>
            <li><strong>Safety first.</strong> If anyone is hurt, it tells them to call the emergency services before anything else.</li>
            <li><strong>Who and which policy.</strong> The policyholder’s name, and the car registration or home address. It never asks them to read out a full policy number.</li>
            <li><strong>What happened.</strong> Date, time, place, a short description, and any other party or police report reference.</li>
            <li><strong>Read back and save.</strong> It repeats the details, and after a yes saves them as a claim record through an API tool. Without a tool, the transcript in the Calls tab is the record.</li>
            <li><strong>Photos on WhatsApp.</strong> It sends a message asking for photos of the damage in the same WhatsApp chat, which is far easier than describing a dent on the phone.</li>
          </ol>
          <p>It never says whether a claim will be paid. That’s the insurer’s decision, and the instructions tell it to say so.</p>
        </>,
      },
      {
        id: "cold-calling",
        title: "AI cold calling for insurance agents: why not on WhatsApp",
        body: <>
          <p>“AI cold calling” is one of the most searched insurance AI topics, so here is the straight answer for WhatsApp: <strong>don’t</strong>. WhatsApp’s Business Messaging Policy lets a business contact people only if they gave it their number and agreed to receive messages or calls from it. A bought list or numbers copied from the web don’t meet that.</p>
          <p>Local law points the same way. In the US, the FCC ruled in February 2024 that AI-generated voices count as “artificial” voices under the TCPA, so AI calls need the person’s prior consent, and marketing calls need it in writing. Whether that law covers WhatsApp calls hasn’t been tested, so treat it as if it does.</p>
          <p>Warm leads are where an AI voice agent earns its keep anyway. The HBR figures above are about people who asked to be contacted. Call web-form leads at once, referrals who agreed to a call, and your own clients at renewal time.</p>
        </>,
      },
      {
        id: "renewals",
        title: "Renewal and policy review calls",
        body: <>
          <p>Each month, put the clients whose policies renew in a campaign such as “December renewals”, with an opening like: “Your policy with us renews this month. Would you like one of our agents to review it with you before then?” The agent answers general questions, books the review, and notes anything that changed, such as a new car or a house extension.</p>
          <p>Clients are added one at a time in the dashboard, with no spreadsheet upload or automatic redial yet, so this suits an agency’s dozens of renewals a month rather than a call centre’s thousands. Ask clients to save your number: WhatsApp lets people silence calls from numbers that aren’t in their contacts.</p>
        </>,
      },
      {
        id: "rules",
        title: "Rules for AI calls in insurance",
        body: <>
          <DoDont
            dos={["Say it’s a virtual assistant at the start of every call", "Call only people who asked for a quote or agreed to calls", "Explain cover in general terms from the insurers’ own summaries", "Pass every recommendation and final quote to a licensed agent", "Ask for photos of damage in the WhatsApp chat", "Tell anyone reporting an injury to call the emergency services first"]}
            donts={["Recommend a policy or compare quotes for a person", "Quote a final premium or say cover is in place", "Ask for full policy, ID or card numbers on the call", "Say whether a claim will be paid", "Cold call bought lists or scraped numbers", "Take premium payments on the call"]}
          />
          <p>WhatsApp’s policy also bans asking people to share <em>“full length individual payment card numbers, financial account numbers, personal ID card numbers, or other sensitive identifiers”</em>. In the EU, the AI Act has required since 2 August 2026 that people be told when they’re talking to an AI system, which the sample instructions do in the first sentence of every call.</p>
        </>,
      },
      {
        id: "setup",
        title: "Set up an insurance voice agent",
        body: <>
          <SetupSteps items={[
            { title: "Write down what you sell", time: "1 hour", body: <>Types of cover, the insurers you work with, each product’s summary in plain words, documents needed for quotes and claims, office hours, how premiums are paid, and the qualifying questions for each kind of lead.</> },
            { title: "Ask our team to switch voice on", time: "2 min", body: <>Message us on WhatsApp from the button on this page. We turn the voice agent on for your account.</> },
            { title: "Link your agency’s WhatsApp number", time: "5 min", body: <>Create a voice agent and link the number from its <strong>Phone Number</strong> card by QR code or pairing code. Set its calls to both directions, so it answers and calls.</> },
            { title: "Paste the instructions", time: "15 min", body: <>Copy the instructions below, change the agency details and questions to yours, choose a voice and set the language (one, or <strong>Multilingual</strong>).</> },
            { title: "Connect your CRM", time: "1 hour", body: <>Add API request tools that save a lead and a claim to your CRM or agency software, and send_text tools with your document lists. Test each with <strong>Test tool</strong>. No API? Start with the transcripts and add tools later.</> },
            { title: "Run a test campaign", time: "20 min", body: <>Create a campaign, add your own number as a lead and take the call. Then call the agency’s WhatsApp and report a made-up claim. Fix the instructions until both calls go right.</> },
          ]} />
          <PromptFile name="insurance-voice-agent-instructions.txt" text={prompt} />
          <Note>Each call starts fresh: the agent doesn’t remember an earlier call with the same person. Anything it needs about an existing client comes from your own system through an API tool, or your licensed agent handles it.</Note>
        </>,
      },
      {
        id: "cost",
        title: "What an AI voice agent for insurance costs",
        body: <>
          <RowTable caption="AI voice agents for insurance compared, prices checked 21 November 2026" firstColumn="Option" columns={["Price", "Calls on", "Good to know"]} rows={compare} highlight="Wapzen" />
          <p>An agency that calls back 300 leads a month for four minutes each uses 1,200 minutes. That’s about <strong>$132</strong> at Retell’s calculator default of $0.11 a minute, or <strong>$168</strong> on Bland’s Start plan, before phone costs. On Wapzen it’s free, because the calls run over WhatsApp.</p>
          <p><strong>Choose a phone-line platform</strong> if your leads give landline or mobile numbers they won’t answer on WhatsApp, or if you need live transfer to an agent. <strong>Choose Wapzen</strong> if your clients already use WhatsApp and you want every lead called back in seconds without paying by the minute. For leads who write instead of call, see the <Link href="/blog/whatsapp-ai-sales-agent">WhatsApp AI sales agent guide</Link>.</p>
        </>,
      },
    ]}
    faq={[
      { q: "What is an AI voice agent for insurance?", a: "An AI voice agent for insurance is software that answers and makes calls for an insurance agency or insurer in a natural voice. It calls new leads back, asks qualifying questions, answers cover and document questions, takes first notice of a claim and books licensed agents. Wapzen runs one on the agency’s existing WhatsApp number, free." },
      { q: "Can AI make cold calls for insurance agents?", a: "Not on WhatsApp. WhatsApp’s policy allows calls only to people who gave you their number and agreed to hear from you, and in the US the FCC treats AI voices as artificial voices that need prior consent. Use the AI to call web-form leads, referrals who agreed to a call and your own clients." },
      { q: "How fast can an AI voice agent call a new insurance lead?", a: "In Wapzen, the agent calls a lead on WhatsApp as soon as you add it to a campaign. Speed matters: a Harvard Business Review study found companies that tried to reach leads within an hour were nearly seven times as likely to qualify them as those that waited an hour longer." },
      { q: "Can an AI voice agent handle insurance claims?", a: "It can take the first notice of loss: the policyholder’s name, what happened, when and where, and other party details, read back and saved through an API tool, with a WhatsApp request for photos. It never decides or predicts whether a claim will be paid." },
      { q: "Can the AI give insurance quotes?", a: "It can say which types of cover you sell and explain them in general terms, but it shouldn’t recommend a policy or quote a final premium. Those need a licensed agent, so the AI collects the details and books the agent’s call." },
      { q: "Does it work with my CRM or agency management system?", a: "Through API request tools: if your CRM or agency software has an API, the agent can save leads and claims to it during the call. Without one, every call’s transcript is saved in the Wapzen dashboard." },
      { q: "Can the voice agent transfer a call to a licensed agent?", a: "Not live. It books a callback at a time the caller chooses and saves it to your CRM, sends your office details on WhatsApp, and your team can read the call transcript first." },
      { q: "Does it speak other languages?", a: "Yes. Set one language, or choose Multilingual and it replies in the language each caller speaks." },
      { q: "How much does an AI voice agent for an insurance agency cost?", a: "Wapzen is free, with no per-minute fees. Phone-line platforms charge by the minute: Retell AI $0.07–$0.31 and Bland AI $0.14 on its Start plan, plus phone costs (checked 21 November 2026)." },
    ]}
    sources={[
      { label: "Harvard Business Review: The Short Life of Online Sales Leads (Oldroyd, McElheran, Elkington, 2011)", href: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads" },
      { label: "WhatsApp Business Messaging Policy (updated 23 September 2026): opt-in and sensitive identifiers", href: "https://whatsappbusiness.com/policy/" },
      { label: "FCC: AI-generated voices in robocalls are artificial under the TCPA (February 2024)", href: "https://www.fcc.gov/document/fcc-makes-ai-generated-voices-robocalls-illegal" },
      { label: "EU AI Act, Article 50: transparency obligations", href: "https://artificialintelligenceact.eu/article/50/" },
      { label: "Retell AI: pricing", href: "https://www.retellai.com/pricing" },
      { label: "Bland AI: pricing", href: "https://www.bland.ai/pricing" },
      { label: "Vapi: pricing", href: "https://vapi.ai/pricing" },
    ]}
    related={["/blog/ai-voice-agent-for-financial-services", "/blog/whatsapp-ai-sales-agent"]}
    product="/free-ai-calling-agent"
    cta={{ heading: <>Call every new lead back in seconds.<br /><span>Free, on your agency’s own WhatsApp number.</span></>, body: "Message our team on WhatsApp. We’ll switch the voice agent on, and you can link your number, add your products and run your first lead campaign today." }}
    action={{ href: voiceAccess, label: "Message us on WhatsApp" }}
  />;
}
