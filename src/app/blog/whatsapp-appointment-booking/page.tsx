import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp appointment booking free" (70), "…bot" (59), "…system"
// (51), "whatsapp appointment booking" / "whatsapp booking system" /
// "whatsapp booking bot" (50 each, 5/5), "whatsapp appointment reminder" (40),
// autocomplete 2026-10-28. Keep in step with the server: agents aren't told
// today's date (hence the tip to return it from the availability API), a tool
// response is cut at 3,000 characters, and adding a campaign lead dials at once.
const href = "/blog/whatsapp-appointment-booking";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const options = [
  ["How it works", "The AI answers questions, then sends your scheduling page", "The AI collects the details; your team confirms the time", "The AI checks free slots and books one in the chat"],
  ["Setup", "Minutes", "About 30 minutes: a sheet and a short script", "Your booking system needs an API"],
  ["Double bookings", "Prevented by the scheduler", "Prevented by whoever confirms", "Prevented by the booking system"],
  ["Best for", "Solo practitioners and consultants", "Clinics and salons with a front desk", "Busy practices with booking software"],
];

const requestParameters = [
  ["name", "string", "The customer’s name."],
  ["contact_number", "string", "A phone number to confirm the booking on, with the country code."],
  ["service", "string", "The service or treatment, and the preferred staff member if any."],
  ["preferred_day", "string", "The day as the customer said it, e.g. “Thursday” or “4 November”."],
  ["preferred_time", "string", "The preferred time or part of the day, e.g. “after 5 pm”."],
  ["notes", "string (optional)", "Anything else the team should know."],
];

const script = `// In your Bookings sheet: Extensions › Apps Script. Paste this, change KEY,
// then Deploy › New deployment › Web app (Execute as: Me, Who has access: Anyone).
const KEY = "replace-with-a-long-random-word";

function doPost(e) {
  if (e.parameter.key !== KEY) return reply({ ok: false, error: "wrong key" });
  const b = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Requests").appendRow(
    [new Date(), b.name, b.contact_number, b.service, b.preferred_day,
      b.preferred_time, b.notes || "", "To confirm"].map(safe));
  return reply({ ok: true });
}

// Customers type this text: never let it start a formula.
function safe(value) {
  return typeof value === "string" && /^[=+\\-@]/.test(value) ? "'" + value : value;
}

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}`;

const prompt = `You are the WhatsApp assistant for [Clinic], a [dental clinic] in [area]. You answer questions about our services, prices, and timings, and take appointment requests.

Use only the information in your knowledge base. Never give medical advice: for pain, swelling, or emergencies, ask the patient to call [phone number].

To take a booking request:
1. Ask which service they need, and if they prefer a particular doctor.
2. Ask for a preferred day and time within our hours: [Mon–Sat, 10 am–7 pm].
3. Ask for their name and a contact number.
4. Repeat the request back and ask them to confirm.
5. After they confirm, use save_booking_request. Then say the front desk will confirm the exact time on WhatsApp within [2 working hours].

Rules: short replies, one question at a time. Never promise a slot yourself.`;

const availability = `Today is Tuesday 28 October 2026.
Free slots for cleaning (30 min):
Wed 29 Oct: 10:00, 11:30, 16:00
Thu 30 Oct: 12:00, 17:30`;

const faqs = [
  { q: "Can I take appointment bookings on WhatsApp for free?", a: "Yes. Send customers a free scheduling page such as Calendly, Cal.com, or a Google Calendar appointment schedule, or collect booking requests in a Google Sheet. Wapzen's AI chat agent, which answers the questions and handles either route, is currently free." },
  { q: "How do I add a booking link to WhatsApp Business?", a: "Put it in your greeting message, away message, and a quick reply, so it's one tap to send. With an AI agent, put the link in its instructions and tell it to send the link when someone wants to book, after answering their questions." },
  { q: "Can a WhatsApp bot check my calendar and book slots?", a: "Yes, if your booking system has an API. In Wapzen you create two API request tools, one that looks up free slots and one that creates the booking, and attach them to the agent. Without an API, use a booking link or collect requests instead." },
  { q: "Will a WhatsApp booking bot double-book appointments?", a: "Not if the booking happens in one place. A scheduling link and live API booking both rely on your booking system to block taken slots. With booking requests, the AI never promises a time, and your team confirms each one." },
  { q: "Can patients book by calling on WhatsApp?", a: "Yes. A Wapzen voice agent with the same tools answers WhatsApp calls, talks through the booking, and saves the request or books the slot. It can also send the details in a WhatsApp message during the call." },
  { q: "How do I send appointment reminders on WhatsApp?", a: "Three ways: send them yourself with a quick reply in the WhatsApp Business app; send automatic template messages through the Business API, which Meta charges per message; or have a Wapzen voice agent call the day's patients on WhatsApp to confirm they're coming." },
];

const sources = [
  { label: "Meta: WhatsApp Business Platform pricing", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Google Apps Script: Web apps", href: "https://developers.google.com/apps-script/guides/web" },
];

const sections = [
  {
    id: "options",
    title: "Three ways to take bookings on WhatsApp",
    body: <>
      <p>Clinics, salons, tutors, and consultants get most booking requests on WhatsApp already. The work is in the back-and-forth: “Do you have anything Thursday?”, “What does a cleaning cost?”, “Is Dr. Mehta in on Saturday?” An AI chat agent can handle all of that. How it then makes the booking is your choice:</p>
      <Comparison caption="Three ways to take appointment bookings on WhatsApp" columns={["Booking link", "Booking requests", "Live booking"]} rows={options} />
      <p>Start with the simplest one that fits. You can move up later without changing the agent’s knowledge base, just its instructions and tools.</p>
    </>,
  },
  {
    id: "booking-link",
    title: "Option 1: Answer questions, then send a booking link",
    body: <>
      <p>If you already use a scheduling page, such as Calendly, Cal.com, or Google Calendar’s appointment schedule, the agent’s job is to answer questions and hand over the link at the right moment:</p>
      <ol>
        <li>Add your services, prices, durations, and preparation notes to a <strong>knowledge base</strong> in Wapzen.</li>
        <li>Create a <strong>chat agent</strong> and add a line to its instructions: “When someone wants to book, answer their questions first, then send this link: [your booking page].”</li>
        <li>Connect your number by QR code and pick the agent for it.</li>
      </ol>
      <p>The scheduler shows only free slots, sends its own confirmation, and blocks double bookings. The downside is the extra step: some customers won’t leave the chat to fill in a form.</p>
    </>,
  },
  {
    id: "requests",
    title: "Option 2: Collect booking requests in a sheet",
    body: <>
      <p>For a practice with a front desk, the agent can take the whole request in the chat and save it, and a person confirms the exact time. It suits businesses whose diary is on paper or in software without an API.</p>
      <h3>The sheet and script</h3>
      <p>Create a Google Sheet with a tab named <strong>Requests</strong>, open <strong>Extensions › Apps Script</strong>, and paste this. Change <code>KEY</code>, deploy it as a <strong>Web app</strong> (Execute as: Me, Who has access: Anyone), and copy the URL with <code>?key=</code> and your key on the end.</p>
      <pre><code>{script}</code></pre>
      <h3>The tool</h3>
      <p>In Wapzen, open <strong>Tools › Create Tool › API Request</strong>. Name it <code>save_booking_request</code>, describe it as “Save a confirmed booking request”, set the method to POST and the URL to your web app, and add these parameters:</p>
      <Comparison caption="Parameters for the save_booking_request tool" columns={["Type", "Description to give the agent"]} rows={requestParameters} />
      <h3>The instructions</h3>
      <p>Then create a chat agent, attach your knowledge base and the tool, and adapt these instructions:</p>
      <pre><code>{prompt}</code></pre>
      <p>Each request lands in the sheet marked <strong>To confirm</strong>, with the time it came in, so your team can work out what “tomorrow” meant. Confirm it in the same WhatsApp chat.</p>
      <Note>The agent doesn’t see the customer’s WhatsApp number, so the instructions ask for one. It also doesn’t know today’s date, which is why it saves the day the way the customer said it.</Note>
    </>,
  },
  {
    id: "live-booking",
    title: "Option 3: Book live slots through your booking system",
    body: <>
      <p>If your booking software has an API, the agent can check the diary and book in the chat. You need two <strong>API Request</strong> tools:</p>
      <ul>
        <li><code>check_availability</code>: <strong>GET</strong> your system’s availability endpoint, with a <code>date</code> parameter (“Requested day in YYYY-MM-DD form”). Description: “Look up free times. Use before offering any slot.”</li>
        <li><code>create_booking</code>: <strong>POST</strong> to the booking endpoint, with the customer’s name, contact number, service, and the chosen slot exactly as <code>check_availability</code> returned it.</li>
      </ul>
      <p>Put your API key in the tool’s <strong>Headers</strong> (for example <code>Authorization</code>); it’s stored with the tool and never shown to the agent. If your system has no API but connects to Zapier, Make, or n8n, put a webhook there in between.</p>
      <h3>Two details that make or break it</h3>
      <ul>
        <li><strong>Return today’s date.</strong> The agent doesn’t know what day it is, so “next Tuesday” needs an anchor. Have the availability response start with it:</li>
      </ul>
      <pre><code>{availability}</code></pre>
      <ul>
        <li><strong>Keep responses short.</strong> The agent reads the response before replying, and Wapzen passes on the first 3,000 characters. Return a short list of free times, not the whole calendar.</li>
      </ul>
      <InlineCta title="Let AI take your WhatsApp bookings" body="Free right now: an AI agent on your existing number that answers questions and books appointments, by chat or call." />
    </>,
  },
  {
    id: "calls",
    title: "Bookings over WhatsApp calls",
    body: <>
      <p>Some customers will always call. A Wapzen <strong>voice agent</strong> answers WhatsApp calls on the same number and can use the same tools, so it can save a request or book a slot out loud. Give it a <strong>Send Text</strong> tool too, and it messages the booking details to the caller during the call, so they have them in writing.</p>
      <p>Voice agents speak dozens of languages: set the one most of your callers use. For a front-desk setup that answers every call, see <Link href="/ai-receptionist">AI receptionist</Link>.</p>
    </>,
  },
  {
    id: "reminders",
    title: "Appointment reminders on WhatsApp",
    body: <>
      <p>Reminders cut no-shows, and there are three ways to send them:</p>
      <ul>
        <li><strong>By hand, free.</strong> In the WhatsApp Business app, save the reminder as a quick reply and send it to the next day’s appointments each evening. Fine for ten a day, tedious for fifty.</li>
        <li><strong>Template messages on the Business API.</strong> Booking software that connects to the API can send them automatically, as utility templates that Meta charges per message. See <Link href="/blog/whatsapp-business-api-pricing">WhatsApp Business API pricing</Link>.</li>
        <li><strong>Reminder calls with Wapzen.</strong> Create an outbound campaign with a voice agent that confirms the visit, and add the next day’s patients as leads when you want the calls to go out. Adding a lead places the call straight away, so add them by hand or let your automation tool do it at a set time through the API.</li>
      </ul>
      <p>Know the limits of the third option: a lead carries a name and number, not the appointment, so the agent confirms “your appointment with us tomorrow” rather than reading out the time. Nobody answers? The lead is marked unsuccessful, and Wapzen doesn’t redial on its own. The same pattern is shown step by step in <Link href="/blog/whatsapp-cod-order-confirmation">COD order confirmation calls</Link>.</p>
      <Note>Wapzen is an independent product, not made by Meta or WhatsApp. It links your number as a device. Message and call only people who expect to hear from you: WhatsApp restricts numbers that send unwanted messages or calls.</Note>
    </>,
  },
];

export default function WhatsAppAppointmentBookingPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp appointment booking.<br /><span>Free, by chat or call.</span></>}
    lead="Three ways to take bookings on WhatsApp with an AI agent: send your booking link, collect requests in a Google Sheet, or book live slots through your booking system. Plus bookings over WhatsApp calls and reminders that cut no-shows."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Simplest:</strong> an AI agent answers questions about services and prices, then sends your free booking page link.</>,
        <><strong>No booking software?</strong> The agent takes the request in the chat and saves it to a Google Sheet for your team to confirm.</>,
        <><strong>Booking software with an API?</strong> The agent checks free slots and books one in the chat or on a WhatsApp call.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/what-is-a-whatsapp-chatbot", "/blog/whatsapp-food-ordering-system"]}
    product="/ai-receptionist"
    cta={{ heading: <>Bookings, day and night.<br /><span>Taken by AI on WhatsApp.</span></>, body: "Create a free AI agent, add your services and timings, and connect your number by QR code. It answers questions and takes bookings right away." }}
  />;
}
