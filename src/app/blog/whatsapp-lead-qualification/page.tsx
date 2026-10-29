import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp zoho crm integration" (57), "whatsapp crm integration" /
// "whatsapp hubspot integration" / "lead qualification process" / "whatsapp
// lead generation" (50, 5/5), "whatsapp to google sheets" (46, 5/5), "ai lead
// qualification chatbot" (45), "lead qualification questions" / "whatsapp lead
// qualification" / "bant questions" (40), autocomplete 2026-10-30
// (docs/seo-blog-playbook-research.mjs). An api_request tool POSTs its declared
// parameters as one flat JSON object, which is why CRMs (nested bodies, OAuth)
// are reached through a Zapier/Make/n8n webhook rather than directly.
const href = "/blog/whatsapp-lead-qualification";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const bant = [
  ["Need", "What problem are they solving?", "“What are you looking for help with?”"],
  ["Timeline", "How soon do they want it?", "“When would you like to start?”"],
  ["Budget", "Can they afford what fits?", "“Roughly what budget do you have in mind: under ₹50k, ₹50k–1 lakh, or more?”"],
  ["Authority", "Do they decide, or someone else?", "“Will anyone else be part of the decision?”"],
];

const sets = [
  ["Real estate", "Buy or rent; budget; area; property type and size; move-in date"],
  ["Coaching and courses", "Course or exam; student’s class; batch preference; when they want to start"],
  ["Agencies and B2B services", "Service needed; company and role; monthly budget range; start date"],
  ["Home services", "The job; address or area; urgency; best time for a visit"],
  ["Clinics and aesthetics", "Treatment of interest; first visit or returning; preferred days"],
  ["Car dealers", "New or used; model or budget; trade-in; finance or cash; timeframe"],
  ["Travel agents", "Destination; dates; number of travellers; budget per person"],
];

const prompt = `You are the WhatsApp assistant for [Business], a [type of business] in [city]. You answer questions about [services] and help new enquiries find the right option.

Answer the customer's question first, from your knowledge base only. Then, one question at a time, ask:
1. What they need: [the main options]
2. When they want to start
3. Their budget, offering ranges: [under X / X–Y / over Y]
4. Their name, and a contact number and email for our team

Then score the lead:
- hot: needs something we offer, wants to start within [2 weeks], budget fits
- warm: a good fit, but later or unsure about budget
- cold: just looking, or needs something we don't offer

Repeat the details back. After they confirm, use save_lead with a one-sentence summary. For hot leads, say [Name] will reply here within [1 hour]; for the others, say we'll send options here.

If they don't want to answer something, skip it. Never push.`;

const fields = [
  ["name", "string", "The lead’s name."],
  ["contact_number", "string", "Phone number with the country code."],
  ["email", "string (optional)", "Email address, if they gave one."],
  ["need", "string", "What they’re looking for, in a few words."],
  ["timeline", "string", "When they want to start, as they said it."],
  ["budget", "string", "Their budget or range."],
  ["lead_score", "string", "“hot”, “warm”, or “cold”, following the scoring rules."],
  ["summary", "string", "One sentence the sales team can act on."],
];

const routes = [
  ["Google Sheets", "Free", "An Apps Script web app appends each lead as a row", "Small teams, and a first version"],
  ["HubSpot, Zoho, Pipedrive, Salesforce", "Your automation tool’s plan", "A Zapier, Make, or n8n webhook creates the contact or lead", "Teams already working in a CRM"],
  ["A CRM with a flat JSON webhook", "Free", "Point the tool straight at the CRM’s webhook URL", "CRMs that accept plain field names in one JSON object"],
];

const faqs = [
  { q: "How do I qualify leads on WhatsApp?", a: "Have an AI agent answer the lead's question first, then ask three or four qualifying questions one at a time: what they need, when, their budget, and how to reach them. It scores the lead hot, warm, or cold and saves it to your sheet or CRM, so your team calls the hot ones first." },
  { q: "What are good lead qualification questions?", a: "Need, timeline, budget, and decision-maker, the BANT questions, asked in plain words. Keep it to four or five, offer budget ranges rather than asking for a number, and make each question specific to your business, like 'buy or rent?' for real estate." },
  { q: "What is BANT?", a: "A classic sales checklist: Budget (can they afford it), Authority (do they decide), Need (do they have a problem you solve), and Timeline (when). Most chat-based qualification asks need and timeline first, because they're the easiest to answer." },
  { q: "How do I connect WhatsApp to HubSpot or Zoho CRM?", a: "With Wapzen, create an API request tool that posts each qualified lead to a webhook in Zapier, Make, or n8n, then add a step there that creates the contact or lead in HubSpot or Zoho CRM, mapping the fields. Business API platforms often offer a built-in CRM sync instead." },
  { q: "Can I send WhatsApp leads to Google Sheets for free?", a: "Yes. A short Google Apps Script deployed as a web app receives each lead from the AI agent's tool and adds it as a row, at no cost. The script is in our real estate guide, and the same pattern works for any business." },
  { q: "Can AI score leads?", a: "Yes, if you give it clear rules. Define hot, warm, and cold in the agent's instructions using your own thresholds, and have it send the score with each lead. Check a sample each week and adjust the rules if hot leads aren't converting." },
];

const sources = [
  { label: "Zapier: Webhooks integrations", href: "https://zapier.com/apps/webhook/integrations" },
  { label: "n8n docs: Webhook node", href: "https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/" },
];

const sections = [
  {
    id: "what",
    title: "What lead qualification on WhatsApp looks like",
    body: <>
      <p>A lead from an ad, a listing, or your website writes “Hi, interested” on WhatsApp. An AI agent can turn that into a qualified lead in two minutes: it answers their question, asks a few qualifying questions, scores the answers, and saves everything to your sheet or CRM. Your team starts the day with a list sorted by who’s ready, instead of thirty chats that all say “hi”.</p>
      <p>The same works on calls: a voice agent can call each new lead back on WhatsApp and ask the same questions out loud. That setup is in <Link href="/blog/whatsapp-chatbot-for-real-estate">calling leads back</Link>.</p>
    </>,
  },
  {
    id: "questions",
    title: "The lead qualification questions to ask",
    body: <>
      <p>The classic framework is <strong>BANT</strong>: budget, authority, need, and timeline. In a chat, ask them in a friendlier order, starting with the easy ones:</p>
      <Comparison caption="The BANT lead qualification questions, reworded for WhatsApp" columns={["What you learn", "How to ask on WhatsApp"]} rows={bant} />
      <ul>
        <li><strong>Answer first, then ask.</strong> Someone who asked a price and got three questions back leaves. Give the answer, then “Can I ask a couple of quick questions to send you the best options?”</li>
        <li><strong>One question per message,</strong> four or five in all. Each extra question loses people.</li>
        <li><strong>Offer ranges for budget.</strong> “Under ₹50k, ₹50k–1 lakh, or more?” gets answers that “What’s your budget?” doesn’t.</li>
        <li><strong>Make skipping easy.</strong> A lead who won’t share a budget is still a lead.</li>
      </ul>
    </>,
  },
  {
    id: "by-industry",
    title: "Question sets by industry",
    body: <>
      <p>Swap the generic questions for the ones your team actually asks on the first call:</p>
      <Comparison caption="Lead qualification questions by industry" columns={["Questions to ask"]} rows={sets} />
      <p>Authority rarely needs its own question outside business sales. When it matters, “Will anyone else be part of the decision?” is enough.</p>
    </>,
  },
  {
    id: "instructions",
    title: "The agent instructions, with lead scoring",
    body: <>
      <p>Create a <strong>chat agent</strong> in Wapzen, attach a knowledge base with your services and prices, and adapt these instructions. The scoring rules are the part to tune to your business:</p>
      <pre><code>{prompt}</code></pre>
      <p>Hot, warm, and cold are deliberately simple: your team needs to know who to call first, not a score out of 100. If you’re new to writing agent instructions, see <Link href="/blog/ai-agent-system-prompt-examples">AI agent instructions: system prompt examples</Link>.</p>
      <Note>The agent can’t see the lead’s WhatsApp number, which is why the instructions ask for a contact number. It reads text messages in one-to-one chats; voice notes and photos wait for your team.</Note>
    </>,
  },
  {
    id: "crm",
    title: "Send each lead to your CRM or a Google Sheet",
    body: <>
      <p>The <code>save_lead</code> tool is an <strong>API Request</strong> tool. Wapzen sends its parameters as one JSON object to the URL you set, so you need something at that URL to receive it:</p>
      <Comparison caption="Three ways to send WhatsApp leads to a CRM or sheet" columns={["Cost", "How", "Best for"]} rows={routes} />
      <h3>The tool</h3>
      <p>Open <strong>Tools › Create Tool › API Request</strong>, name it <code>save_lead</code>, set the method to POST, and add these parameters:</p>
      <Comparison caption="Parameters for the save_lead tool" columns={["Type", "Description to give the agent"]} rows={fields} />
      <h3>To Google Sheets</h3>
      <p>Use the Apps Script from <Link href="/blog/whatsapp-chatbot-for-real-estate">the real estate guide</Link>, change the fields in its <code>appendRow</code> line to the ones above, and paste the web app’s URL into the tool.</p>
      <h3>To HubSpot, Zoho CRM, or another CRM</h3>
      <ol>
        <li>In Zapier, Make, or n8n, start a workflow with a <strong>webhook</strong> trigger (Zapier calls it Catch Hook) and copy its URL into the tool.</li>
        <li>Press <strong>Test tool</strong> in Wapzen so the webhook receives a sample lead.</li>
        <li>Add a step that creates or updates the contact or lead in HubSpot, Zoho CRM, or your CRM, and map each field to it. Match on the phone number, so a lead who writes twice isn’t added twice.</li>
        <li>Add a filter: if <code>lead_score</code> is “hot”, also send your sales team an email, a Slack message, or a WhatsApp group alert.</li>
      </ol>
      <p>CRMs expect their own data formats and sign-in tokens, so an automation tool in the middle is the simplest reliable route. If your CRM has a webhook that takes plain field names, point the tool straight at it.</p>
      <InlineCta title="Qualify every WhatsApp lead automatically" body="Free right now: an AI agent on your WhatsApp number that asks the right questions and sends each lead to your sheet or CRM." />
    </>,
  },
  {
    id: "follow-up",
    title: "After the lead is saved",
    body: <>
      <ul>
        <li><strong>Hot leads:</strong> a person replies in the same WhatsApp chat within the hour, with the answers already in front of them. See <Link href="/blog/whatsapp-chatbot-human-handoff">handing a chat from AI to a person</Link>.</li>
        <li><strong>Warm leads:</strong> follow up in a few days with options that match what they said.</li>
        <li><strong>Cold leads:</strong> a polite “we’re here when you’re ready”, and no chasing.</li>
      </ul>
      <p>Message and call only people who contacted you or asked to hear from you. WhatsApp restricts numbers that people report for unwanted messages, and a qualified lead list is worth more than a long one.</p>
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. It links your number as a device, so there’s no Business API account and no Meta message fees for its replies.</Note>
    </>,
  },
];

export default function WhatsAppLeadQualificationPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp lead qualification.<br /><span>The questions, and the CRM.</span></>}
    lead="How to qualify leads on WhatsApp with an AI agent: which questions to ask and in what order, question sets by industry, simple hot-warm-cold scoring, and how to send each lead to Google Sheets, HubSpot, Zoho CRM, or another CRM."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Ask four things:</strong> what they need, when, their budget (as ranges), and how to reach them, one question at a time, after answering theirs.</>,
        <><strong>Score simply:</strong> hot, warm, or cold, by rules you write into the agent’s instructions.</>,
        <><strong>Save every lead:</strong> an API request tool sends it to a Google Sheet, or through Zapier, Make, or n8n to your CRM.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-chatbot-for-real-estate", "/blog/ai-agent-system-prompt-examples"]}
    product="/free-ai-calling-agent"
    cta={{ heading: <>Every lead qualified.<br /><span>Every answer saved.</span></>, body: "Create a free AI agent, add your qualifying questions, and link your WhatsApp number. It starts sorting your leads right away." }}
  />;
}
