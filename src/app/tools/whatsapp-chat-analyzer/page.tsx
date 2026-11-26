import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { CalendarDays, Clock, MessageCircleMore, Smile, Timer, Users } from "lucide-react";
import { ToolPage } from "@/components/free-tools/ToolPage";
import { WhatsAppChatAnalyzer } from "@/components/free-tools/ChatAnalyzer";

// Targets "whatsapp chat analyzer" (+ free / online / ai), "whatsapp chat
// export viewer", autocomplete 2026-11-26. Parsing is client-side only.
const path = "/tools/whatsapp-chat-analyzer";
const title = "WhatsApp Chat Analyzer: Free Chat Stats Online";
const description = "Analyze an exported WhatsApp chat for free: who texts the most, busiest hours and days, reply times, top words and emojis. It runs in your browser, so your chat is never uploaded.";

export const metadata: Metadata = pageMetadata({ title, description, path });

const steps = [
  { title: "Export the chat", body: "In WhatsApp, open the chat or group, tap Export chat and choose Without media. Android makes a .txt file, iPhone a .zip." },
  { title: "Open the file here", body: "Drop the file onto the box above or click Choose file. It's read inside your browser, so nothing is uploaded." },
  { title: "Read the report", body: "See the totals, who sends the most, reply times, the busiest hours, days and months, and the words and emojis you use most." },
];

const shows = [
  { icon: Users, title: "Who talks the most", body: "Messages and share per person, words per message, media and emojis sent. Groups show the top ten, with everyone else in the table." },
  { icon: Timer, title: "Reply times", body: "How quickly each person typically answers someone else, as a median, so one reply sent a day later doesn't skew it." },
  { icon: MessageCircleMore, title: "Who starts the chats", body: "How often each person writes first after six hours or more of silence, a good sign of who keeps the conversation going." },
  { icon: Clock, title: "Busiest hours and days", body: "Messages by hour of the day and day of the week, with the busiest one highlighted. Handy for knowing when customers write." },
  { icon: CalendarDays, title: "Activity over time", body: "Messages per month across the whole chat, days active, the longest streak of days in a row, and the single busiest day." },
  { icon: Smile, title: "Top words and emojis", body: "The words and emojis used most, with common filler words like \"the\" and \"and\" left out so the interesting ones show." },
];

const faqs = [
  { q: "Is this WhatsApp chat analyzer safe to use?", a: "Yes. The file is opened and analyzed by JavaScript in your own browser. Your messages are never uploaded to, sent to, or stored on our servers, and closing the page clears everything." },
  { q: "How do I export a WhatsApp chat?", a: "On Android, open the chat, tap ⋮ › More › Export chat, and choose Without media. On iPhone, open the chat, tap the contact or group name at the top, scroll down to Export chat, and choose Without media. Save or send the file to yourself, then open it here." },
  { q: "Does it work for WhatsApp group chats?", a: "Yes. Group exports work the same way as one-to-one chats. The bar chart shows the ten most active members and the table lists everyone." },
  { q: "Why doesn't my chat file open?", a: "Make sure you picked the file WhatsApp exported: a .txt file on Android, or the .zip (or the _chat.txt inside it) on iPhone. The analyzer reads the date formats WhatsApp uses in different languages and countries. If yours still shows no messages, check that the file wasn't edited or saved in another format." },
  { q: "How is the typical reply time worked out?", a: "Every time someone writes after a message from someone else, the gap counts as a reply time. The tool shows each person's median, ignoring gaps over 12 hours, which are usually just the next day's chat rather than a reply." },
  { q: "Does it count photos, videos and voice notes?", a: "If you export with media, or WhatsApp writes <Media omitted> in the file, those messages count as media. They're counted per person but left out of word counts. Exporting Without media is faster and gives the same stats." },
  { q: "Is the WhatsApp chat analyzer free?", a: "Yes, it's free with no sign-up and no limit on how many chats you analyze." },
];

export default function WhatsAppChatAnalyzerPage() {
  return <ToolPage
    path={path}
    name="WhatsApp chat analyzer"
    description={description}
    heading={<>WhatsApp chat analyzer.<br /><span>Stats for any chat, kept private.</span></>}
    lead="Open an exported WhatsApp chat and see who texts the most, how fast people reply, when the chat is busiest, and your top words and emojis. All in your browser."
    perks={["Nothing uploaded", "Works for groups", "No sign-up"]}
    tool={<WhatsAppChatAnalyzer />}
    steps={{ heading: <>How to analyze a WhatsApp chat.<br /><span>Three quick steps.</span></>, items: steps }}
    cards={{ heading: <>What the report shows.<br /><span>Every number explained.</span></>, items: shows }}
    faq={{ heading: <>WhatsApp chat analysis.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Slow to reply to customers?<br /><span>Let AI answer in seconds.</span></>, body: "Wapzen's AI chatbot answers your WhatsApp customers day and night from your own prices and FAQ, so nobody waits for a reply. Free to start, no credit card." }}
  />;
}
