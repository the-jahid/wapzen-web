import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { Bold, Code, Italic, List, SquareCode, Strikethrough } from "lucide-react";
import { ToolPage } from "@/components/free-tools/ToolPage";
import { WhatsAppTextFormatter } from "@/components/free-tools/WhatsAppTextFormatter";
import { fancyFonts } from "@/components/free-tools/whatsappFormat";

// Targets "whatsapp text formatting" (112, 5/5), "…tricks" (88), "whatsapp text
// formatter" (74), "…codes" (51), "whatsapp bold text" (50), "whatsapp fancy
// text" (47), "whatsapp font generator" / "whatsapp fonts" (40), autocomplete
// 2026-10-28. Syntax from WhatsApp's Help Center and its February 2024 launch
// of lists, quotes and inline code.
const path = "/tools/whatsapp-text-formatter";
const title = "WhatsApp Text Formatter: Bold, Italic, Lists & Fancy Fonts";
const description = "Format WhatsApp messages with bold, italic, strikethrough, monospace, lists and quotes, see a live WhatsApp preview, and copy fancy fonts. Free, no sign-up.";

export const metadata: Metadata = pageMetadata({ title, description, path });

const steps = [
  { title: "Write your message", body: "Type or paste it into the editor, or start from one of the examples: an order update, a price list or your opening hours." },
  { title: "Pick the formatting", body: "Select a few words and click Bold, Italic, Strikethrough or another button. Ctrl+B and Ctrl+I work too. Lines become lists or quotes in one click." },
  { title: "Copy it into WhatsApp", body: "Check the preview, then copy the text and paste it into any chat, or click Send in WhatsApp to choose the chat straight away." },
];

const codes = [
  { icon: Bold, title: "Bold: *text*", body: "Put an asterisk on both sides, with no space between the asterisks and the words: *Sale today* becomes bold." },
  { icon: Italic, title: "Italic: _text_", body: "Wrap the words in underscores: _closed on Sunday_. A word that has underscores inside it, like file_name, stays as it is." },
  { icon: Strikethrough, title: "Strikethrough: ~text~", body: "Wrap the words in tildes to cross them out, handy for old prices: ~$30~ $25." },
  { icon: SquareCode, title: "Monospace: ```text```", body: "Three backticks on each side switch to a fixed-width font. It's the one style that can run over several lines." },
  { icon: Code, title: "Inline code: `text`", body: "One backtick on each side highlights a short code, such as a discount code or an order number." },
  { icon: List, title: "Lists and quotes", body: "Start a line with a hyphen and a space for a bullet, a number, full stop and space (1. ) for a numbered list, or > and a space for a quote." },
];

const faqs = [
  { q: "How do I make text bold on WhatsApp?", a: "Put an asterisk on each side of the words, with no spaces inside the asterisks: *your text*. WhatsApp shows it in bold once the message is sent. On most phones you can also select the text while typing and choose Bold from the formatting menu." },
  { q: "How do I write italic, strikethrough or monospace on WhatsApp?", a: "Italic uses underscores (_text_), strikethrough uses tildes (~text~), and monospace uses three backticks on each side (```text```). You can combine them, for example *_bold italic_*, as long as each pair of markers is closed." },
  { q: "How do I make a list or a quote in a WhatsApp message?", a: "Start a line with a hyphen and a space (- ) for a bulleted list, or a number, a full stop and a space (1. ) for a numbered list. Start it with > and a space for a quote, and wrap a short code in single backticks (`text`). WhatsApp added these four in February 2024." },
  { q: "Why isn't my WhatsApp formatting working?", a: "Usually a space sits inside the markers (* sale *) or a letter or digit touches them from outside (50*off*). The markers must touch the words they wrap and sit next to a space, punctuation, or the start or end of a line. Bold, italic and strikethrough work line by line, so wrap each line separately. The preview above shows what WhatsApp will do." },
  { q: "How do I change the font on WhatsApp?", a: "WhatsApp has no font picker. Its formatting gives you bold, italic, strikethrough and monospace in WhatsApp's own font. The fancy fonts in this tool are Unicode characters that look like styled letters, so they paste into WhatsApp, your bio, or a status. Screen readers may skip or spell them out, and they don't show up when someone searches the chat, so keep them for a name or a heading." },
  { q: "Does formatting work in WhatsApp Business messages?", a: "Yes. The markers are part of the text, so they work wherever you send text, including WhatsApp Business quick replies and greeting and away messages. Keep it light: bold for a price or the key step, not whole paragraphs." },
  { q: "Is this WhatsApp text formatter free?", a: "Yes, it's free with no sign-up. Your text is formatted in your browser and isn't sent to or stored on our servers." },
];

export default function WhatsAppTextFormatterPage() {
  return <ToolPage
    path={path}
    name="WhatsApp text formatter"
    description={description}
    heading={<>WhatsApp text formatter.<br /><span>Bold, lists and fancy fonts.</span></>}
    lead="Write your message, add bold, italic, strikethrough, monospace, lists and quotes in one click, and see exactly how it looks in WhatsApp before you send it."
    perks={["Live WhatsApp preview", `${fancyFonts.length} fancy fonts`, "No sign-up"]}
    tool={<WhatsAppTextFormatter />}
    steps={{ heading: <>How to format WhatsApp text.<br /><span>Three quick steps.</span></>, items: steps }}
    cards={{ heading: <>WhatsApp formatting codes.<br /><span>The whole cheat sheet.</span></>, intro: "Every style WhatsApp supports comes from a few symbols typed around your words or at the start of a line. These are all of them.", items: codes }}
    faq={{ heading: <>WhatsApp text formatting.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Same questions, all day?<br /><span>Let AI answer them.</span></>, body: "Wapzen's AI chatbot answers your WhatsApp messages day and night from your own price list and FAQ. Free right now, with no Business API." }}
  />;
}
