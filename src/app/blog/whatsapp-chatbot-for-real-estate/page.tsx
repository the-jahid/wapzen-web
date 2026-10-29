import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Samples } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp chatbot for real estate" (72, 5/5), "whatsapp automation
// for real estate" (71), "ai chatbot for real estate" (50, 5/5), "real estate
// whatsapp marketing" (40), "real estate lead follow up system" (39), "real
// estate whatsapp greeting message" / "…lead follow up schedule" (24) and
// "…scripts" (21), autocomplete 2026-10-30 (docs/seo-blog-industry-research.mjs).
// /ai-calling-agent-for-real-estate is the product page; this post is the
// how-to. Keep in step with the server: a lead carries phone, name and email
// but the voice agent hears none of it, adding a lead dials at once, there's no
// redial, and the chat agent reads text only (no voice notes or photos).
const href = "/blog/whatsapp-chatbot-for-real-estate";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const jobs = [
  ["Listing questions", "Anything not in the documents: the AI says an agent will confirm", "Price, size, floor, amenities, possession date, and pet or parking rules, answered from your brochures"],
  ["Qualifying", "Judging whether a buyer is serious", "Buy or rent, budget, area, property type, and timeline, one question at a time"],
  ["Viewings", "Confirming the slot, unless your calendar has an API", "Takes a preferred day and time and saves the request"],
  ["Lead callbacks", "Negotiation, offers, and paperwork", "Calls each new lead on WhatsApp the moment it arrives"],
];

const listing = `PROJECT: Skyline Residences, Baner, Pune. Updated 30 Oct 2026.
STATUS: 2 BHK available, 3 BHK sold out.
2 BHK: 1,050 sq ft carpet, ₹1.12–1.25 crore, floors 4–18.
POSSESSION: December 2027. RERA: P521000XXXXX.
AMENITIES: pool, gym, covered parking (1 per flat), 24h security.
LOCATION: 5 min to Baner metro, 15 min to Hinjewadi IT park.
PAYMENT: 10% on booking, the rest linked to construction.
VIEWINGS: show flat open daily 10 am–7 pm. Pets allowed.`;

const chatPrompt = `You are the WhatsApp assistant for [Agency], a real estate agency in [City]. You answer questions about our listings and help buyers and renters find the right one.

Use only the listings in your knowledge base. Never guess a price, size, or availability: if it isn't there, say an agent will confirm. Never negotiate prices or offer discounts.

For a new enquiry, find out, one question at a time:
1. Buying or renting
2. Budget range
3. Preferred area
4. Property type and size, e.g. a 2-bed apartment
5. When they want to move
Then suggest up to three matching listings, with the price and one line each.

If they want a viewing, ask for a preferred day and time, their name, and a contact number. Repeat the details back, and after they confirm, use save_lead. Say an agent will confirm the viewing on WhatsApp within [2 working hours].

Describe properties and areas by facts (size, price, distance to the metro), never by the kind of people who live there.

Rules: short replies. If someone asks for a person, say [Agent name] will reply here soon.`;

const script = `// In your Leads sheet: Extensions › Apps Script. Paste this, change KEY,
// then Deploy › New deployment › Web app (Execute as: Me, Who has access: Anyone).
const KEY = "replace-with-a-long-random-word";

function doPost(e) {
  if (e.parameter.key !== KEY) return reply({ ok: false, error: "wrong key" });
  const b = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads").appendRow(
    [new Date(), b.name, b.contact_number, b.looking_to, b.budget, b.area,
      b.property_type, b.timeline, b.viewing || "", "New"].map(safe));
  return reply({ ok: true });
}

// Leads type this text: never let it start a formula.
function safe(value) {
  return typeof value === "string" && /^[=+\\-@]/.test(value) ? "'" + value : value;
}

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}`;

const leadParameters = [
  ["name", "string", "The lead’s name."],
  ["contact_number", "string", "A phone number with the country code."],
  ["looking_to", "string", "“buy” or “rent”."],
  ["budget", "string", "The budget as they said it, e.g. “up to ₹1.2 crore”."],
  ["area", "string", "Preferred areas or neighbourhoods."],
  ["property_type", "string", "Type and size, e.g. “2-bed apartment”."],
  ["timeline", "string", "When they want to move or buy."],
  ["viewing", "string (optional)", "The listing and preferred day and time for a viewing, if they asked for one."],
];

const callPrompt = `You are calling on behalf of [Agency], a real estate agency in [City]. The person you're calling has just enquired about a property through our [ads / website]. You don't know which property, so ask.

1. Greet them, say you're calling from [Agency] about their property enquiry, and ask if it's a good time. If not, ask when to call back, thank them, and use end_call.
2. Ask which property or area they enquired about, and answer their questions from the knowledge base only.
3. Ask: buying or renting, budget, preferred area, property type and size, and when they want to move.
4. If they'd like a viewing, ask for a preferred day and time, repeat it back, and say an agent will confirm it on WhatsApp today.
5. Offer to send our listings link on WhatsApp, and use send_listings if they say yes. Thank them and use end_call.

Rules: one or two short sentences per reply. Never guess prices or availability. If they're not interested, apologise for the interruption and end the call.`;

const request = `POST /v1/outbound-campaigns/{campaign_id}/leads
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{ "phone_number": "+9198XXXXXXXX", "first_name": "Rohan", "last_name": "Kulkarni", "email": "rohan@example.com" }`;

const schedule = [
  ["Within a minute", "AI call on WhatsApp", "Wapzen, automatically"],
  ["Same day", "2–3 matching listings with photos and prices", "Your agent, from the call transcript"],
  ["Day 2–3", "A check-in with viewing slots for the week", "Your agent"],
  ["Day 7", "New listings that match their brief", "Your agent"],
  ["Monthly", "New listings or a price update, until they say stop", "Your agent"],
];

const messages = [
  { title: "Greeting message", text: "Hi! 👋 Thanks for contacting [Agency]. Tell us what you’re looking for (buy or rent, area, and budget) and we’ll send matching properties right away." },
  { title: "Away message", text: "Thanks for your message! Our office is closed right now, but our assistant can answer questions about our listings here, and an agent will call you back from [9 am] tomorrow." },
  { title: "Same-day follow-up", text: "Hi [Name], thanks for speaking with us earlier! Here are three [2-bed] homes in [area] within your budget:\n1. [Listing], [price]\n2. [Listing], [price]\n3. [Listing], [price]\nWould you like to see any of them this week?" },
  { title: "Viewing confirmation", text: "Your viewing is confirmed: [Property], [Saturday 7 Nov] at [11 am]. [Agent name] will meet you at [the main gate]. Reply here if you need to change the time." },
  { title: "New listing alert", text: "Hi [Name], a new [3-bed] just came up in [area] at [price], close to what you asked for. Photos and details: [link]. Shall I book a viewing before it goes?" },
  { title: "Polite close", text: "Hi [Name], are you still looking for a home in [area]? If your plans have changed, no problem: reply STOP and we won’t message again." },
];

const faqs = [
  { q: "What can a WhatsApp chatbot do for a real estate business?", a: "It answers listing questions (price, size, location, amenities, possession date) from the brochures and price lists you upload, asks buyers and renters the qualifying questions, and takes viewing requests. With Wapzen it can also call every new lead back on WhatsApp while their interest is fresh." },
  { q: "Can it call leads from Facebook lead ads, property portals, or my CRM?", a: "Not by itself. Connect the source to Wapzen's API through Zapier, Make, n8n, or your CRM's own automation: each new lead is added to an outbound campaign, and the AI calls them on WhatsApp straight away. You can also add leads by hand." },
  { q: "Will the AI make up prices or availability?", a: "It answers from your knowledge base, and the instructions tell it to say an agent will confirm anything it can't find there. Keep a date on every price list, mark sold-out units, and remove old projects, because the agent trusts whatever you upload." },
  { q: "Can it book site visits and viewings?", a: "It collects a preferred day and time and saves the request, for example to a Google Sheet, so an agent can confirm it. To book straight into a calendar, connect an API request tool to your booking system." },
  { q: "Does it work in Hindi, Arabic, or other languages?", a: "Yes. The chat agent replies in whatever language the lead writes in, and you set the voice agent's language for calls, such as English, Hindi, or Arabic." },
  { q: "How much does a real estate WhatsApp chatbot cost?", a: "Wapzen is currently free, including the chat agent, AI calls on WhatsApp, knowledge bases, and calling campaigns. Business API platforms charge a monthly plan plus Meta's per-message fees." },
];

const sources = [
  { label: "Harvard Business Review: The Short Life of Online Sales Leads (2011)", href: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads" },
  { label: "U.S. Department of Justice: The Fair Housing Act", href: "https://www.justice.gov/crt/fair-housing-act-1" },
];

const sections = [
  {
    id: "what-it-does",
    title: "What a real estate WhatsApp chatbot does",
    body: <>
      <p>Most property enquiries now start on WhatsApp: a click from a portal listing, a “Send message” button on an ad, a number on a hoarding. The same questions arrive all day and late into the night, and the lead usually messages three other agencies at the same time. A WhatsApp chatbot for real estate takes the repeat work off your team:</p>
      <Comparison caption="What a real estate WhatsApp chatbot handles and what stays with your agents" columns={["Stays with your agents", "The AI handles"]} rows={jobs} />
      <p>The rest of this post sets that up in Wapzen: a knowledge base with your listings, a chat agent that answers and qualifies, and a voice agent that calls every new lead back on WhatsApp. It’s free right now and runs on the number your ads already point to.</p>
    </>,
  },
  {
    id: "speed-to-lead",
    title: "Why calling leads back fast matters",
    body: <>
      <p>A <a href="https://hbr.org/2011/03/the-short-life-of-online-sales-leads" target="_blank" rel="nofollow noopener noreferrer">2011 Harvard Business Review study</a> of 1.25 million sales leads found that firms that tried to contact a lead within an hour were nearly seven times as likely to qualify it as firms that waited an hour longer, and over 60 times as likely as those that waited a day or more. In real estate the gap is sharper still, because portal leads enquire with several agencies at once, and the first one to call usually gets the viewing.</p>
      <p>Nobody on your team can call back within a minute at 10 pm or during a site visit. An AI agent can, and the agent who picks up the lead next morning has the transcript.</p>
    </>,
  },
  {
    id: "listings",
    title: "Step 1: Put your listings in a knowledge base",
    body: <>
      <p>The AI only knows what you give it. In Wapzen, open <strong>Knowledge Base</strong>, create one, and add your listings as text, PDF, or Word files: project brochures, price lists, floor plans described in words, and your most common questions. A short, dated sheet per project works better than a glossy brochure, because the facts the AI needs are easy to find in it:</p>
      <pre><code>{listing}</code></pre>
      <ul>
        <li><strong>Date every price list</strong> and replace it when prices change. The agent repeats whatever is in the file.</li>
        <li><strong>Mark sold-out units and old projects</strong>, or delete them, so the agent stops offering them.</li>
        <li><strong>Write out what the brochure shows in pictures</strong>, such as the floor plan, the view, or parking. The agent reads text, not images.</li>
      </ul>
    </>,
  },
  {
    id: "chat-agent",
    title: "Step 2: A chat agent that answers and qualifies",
    body: <>
      <p>Create a <strong>chat agent</strong>, attach the knowledge base, and adapt these instructions. They make it ask the qualifying questions one at a time, suggest only listings that match, and never invent a price:</p>
      <pre><code>{chatPrompt}</code></pre>
      <h3>Save each lead to a Google Sheet</h3>
      <p>The <code>save_lead</code> tool sends the answers to a sheet your team works from. Create a Google Sheet with a tab named <strong>Leads</strong>, open <strong>Extensions › Apps Script</strong>, paste this, change <code>KEY</code>, deploy it as a <strong>Web app</strong>, and copy its URL with <code>?key=</code> and your key on the end:</p>
      <pre><code>{script}</code></pre>
      <p>Then open <strong>Tools › Create Tool › API Request</strong> in Wapzen, name it <code>save_lead</code>, set the method to POST and the URL to your web app, add these parameters, and attach the tool to the chat agent:</p>
      <Comparison caption="Parameters for the save_lead tool" columns={["Type", "Description to give the agent"]} rows={leadParameters} />
      <p>Finally, open <strong>Phone Numbers</strong>, link your WhatsApp number (by QR code, or a pairing code on a phone), and pick the agent for it. It starts answering the next message.</p>
      <Note>The agent can’t see the lead’s WhatsApp number, which is why it asks for one. It replies to text messages in one-to-one chats only: voice notes, photos, and groups get no AI reply and wait for your team as usual.</Note>
    </>,
  },
  {
    id: "callbacks",
    title: "Step 3: Call every new lead back on WhatsApp",
    body: <>
      <p>Leads from forms and ads don’t message you first; they leave a number. A Wapzen <strong>outbound campaign</strong> calls each one on WhatsApp the moment it’s added:</p>
      <ol>
        <li>Create a <strong>voice agent</strong> on the same number, attach the same knowledge base, and set its language. Give it these instructions:</li>
      </ol>
      <pre><code>{callPrompt}</code></pre>
      <ol start={2}>
        <li>Create two tools for it: <strong>End Call</strong> (<code>end_call</code>), and <strong>Send Text</strong> named <code>send_listings</code>, with a message such as “Here are our current listings: [link]”. The message is sent to the person on the call, in the same WhatsApp chat.</li>
        <li>Open <strong>Outbound › New campaign</strong>, pick the voice agent, and set the campaign to Running.</li>
        <li>Add leads. By hand, it’s <strong>Leads › Add Lead</strong>. Automatically, have Zapier, Make, n8n, or your CRM call the API when a lead comes in, for example from Facebook lead ads or your website form:</li>
      </ol>
      <pre><code>{request}</code></pre>
      <p>The call goes out as soon as the lead is added. Afterwards the campaign’s <strong>Calls</strong> tab has the transcript, with the budget, area, and viewing request in the lead’s own words, and the <strong>Leads</strong> tab shows who picked up.</p>
      <Note>Plan around three limits. The voice agent isn’t told the lead’s name or which listing they saw, which is why the script asks. Wapzen doesn’t redial leads who don’t answer. And calls go out the moment a lead is added, so have your automation hold leads that arrive late at night until the morning.</Note>
      <InlineCta title="Call every property lead back in a minute" body="Free right now: an AI agent on your own WhatsApp number that answers listing questions and calls new leads back." />
    </>,
  },
  {
    id: "follow-up",
    title: "A real estate lead follow-up schedule",
    body: <>
      <p>The first call qualifies the lead. Most deals still take several touches after it. A simple schedule many agencies use:</p>
      <Comparison caption="A suggested real estate lead follow-up schedule" columns={["What to send", "Who sends it"]} rows={schedule} />
      <p>Wapzen places the first call. The follow-ups are messages your agents send from the same WhatsApp number, using the transcript, and when the lead replies, the chat agent answers their questions until an agent takes over. Stop as soon as someone says they’re not interested.</p>
      <h3>Real estate WhatsApp messages to copy</h3>
      <p>Save these as quick replies in WhatsApp Business, or use the first two as your greeting and away messages. Fill in the parts in brackets:</p>
      <Samples items={messages} />
      <p>More greeting messages for other industries are in <Link href="/blog/whatsapp-business-greeting-message">40 WhatsApp Business greeting message examples</Link>.</p>
    </>,
  },
  {
    id: "limits",
    title: "Rules to set before you go live",
    body: <>
      <ul>
        <li><strong>Only call people who asked to hear from you.</strong> Call leads who just enquired, not an old database. WhatsApp restricts numbers whose calls and messages people report as unwanted.</li>
        <li><strong>Keep to facts about the property.</strong> In the US, the <a href="https://www.justice.gov/crt/fair-housing-act-1" target="_blank" rel="nofollow noopener noreferrer">Fair Housing Act</a> bars statements that show a preference based on race, colour, religion, sex, disability, familial status, or national origin, and that covers what your chatbot says. The instructions above tell it to describe areas by facts only.</li>
        <li><strong>Decide how a person takes over.</strong> The chat agent answers every text message while it’s live, and there’s no per-chat switch yet. Tell it what to hand off (“say [Agent name] will reply”), or pause the agent when your team wants to answer everything themselves.</li>
        <li><strong>It only works on WhatsApp.</strong> The voice agent makes and answers WhatsApp calls, not regular phone calls, so leads need WhatsApp on the number they give you.</li>
      </ul>
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. It links your number as a device, like WhatsApp Web, so there’s no Business API account and no Meta message fees.</Note>
    </>,
  },
];

export default function WhatsAppChatbotForRealEstatePage() {
  return <BlogPost
    href={href}
    heading={<>A WhatsApp chatbot for real estate.<br /><span>That calls leads back, too.</span></>}
    lead="Set up an AI agent that answers listing questions from your brochures, qualifies buyers and renters, takes viewing requests, and calls every new lead back on WhatsApp within a minute. With copyable instructions, a lead sheet, and a follow-up schedule."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Answers listings questions:</strong> upload brochures and price lists, and a chat agent answers price, size, and location questions around the clock.</>,
        <><strong>Qualifies every lead:</strong> it asks buy or rent, budget, area, type, and timeline, and saves the answers to a sheet.</>,
        <><strong>Calls new leads back:</strong> add a lead from your ads or CRM and an AI voice agent calls them on WhatsApp straight away.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/what-is-a-whatsapp-chatbot", "/blog/whatsapp-appointment-booking"]}
    product="/ai-calling-agent-for-real-estate"
    cta={{ heading: <>Every enquiry answered.<br /><span>Every lead called back.</span></>, body: "Create a free AI agent, upload your listings, and link your WhatsApp number. It answers property questions and calls new leads back right away." }}
  />;
}
