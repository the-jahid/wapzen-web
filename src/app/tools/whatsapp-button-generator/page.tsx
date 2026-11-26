import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { Code, Globe, LayoutTemplate, ShoppingBag, Square, Wand } from "lucide-react";
import { ToolPage } from "@/components/free-tools/ToolPage";
import { WhatsAppButtonGenerator } from "@/components/free-tools/WhatsAppButtonGenerator";

// Targets "whatsapp button for website" (+ html / free / code), "whatsapp
// widget for website", "whatsapp chat widget for website free", autocomplete
// 2026-11-26. The snippet is self-contained: nothing loads from wapzen.io.
const path = "/tools/whatsapp-button-generator";
const title = "WhatsApp Button for Website: Free Chat Widget Generator";
const description = "Create a free WhatsApp chat button for your website. Pick the colour, position and a chat popup, preview it live, then copy the HTML code for WordPress, Shopify, Wix or any site.";

export const metadata: Metadata = pageMetadata({ title, description, path });

const steps = [
  { title: "Add your WhatsApp number", body: "Type the number customers should reach, with the country code, and an optional message that's ready to send when the chat opens." },
  { title: "Design the button", body: "Choose a round icon or a button with text, the corner, the colour, and whether a small chat popup with a welcome message opens first." },
  { title: "Copy the code to your site", body: "Copy the HTML and paste it before the closing </body> tag, or into your site builder's custom code or footer box. It shows on every page." },
];

const platforms = [
  { icon: Globe, title: "WordPress", body: "Install a header-and-footer code plugin such as WPCode and paste the code into the footer box. Avoid editing your theme's footer.php directly, because a theme update replaces it." },
  { icon: ShoppingBag, title: "Shopify", body: "Go to Online Store › Themes, open ⋯ › Edit code, open layout/theme.liquid and paste the code on the line just above </body>. Save, and it appears in your whole store." },
  { icon: Square, title: "Wix", body: "Open Settings › Custom code, click Add custom code, paste it, choose All pages and place it in Body – end. Wix only runs custom code on sites with a premium plan and a connected domain." },
  { icon: LayoutTemplate, title: "Squarespace", body: "Go to Settings › Advanced › Code injection and paste the code into the Footer box. Code injection is only available on Squarespace plans that include it." },
  { icon: Wand, title: "Webflow", body: "Open Site settings › Custom code, paste the code into Footer code, save, and publish the site. Custom code needs a paid Webflow site plan." },
  { icon: Code, title: "Any HTML site", body: "Paste the code just before </body> in your page template or in each page. It's plain HTML, CSS and a few lines of JavaScript, with no library to load." },
];

const faqs = [
  { q: "How do I add a WhatsApp button to my website?", a: "Enter your WhatsApp number above, design the button, and click Copy code. Then paste the code just before the closing </body> tag of your site, or into the custom code, footer code or code injection box of your website builder. The button appears in the corner of every page and opens a chat with your number." },
  { q: "Is this WhatsApp chat widget free?", a: "Yes. The generator is free with no sign-up, and the button you copy keeps working with no account, no subscription and no monthly limit, because all of its code is in the snippet you paste." },
  { q: "Will the WhatsApp button slow down my website?", a: "No. The code is a few kilobytes of HTML, CSS and JavaScript, with the WhatsApp icon drawn inline. It loads no fonts, images or scripts from other servers, so it adds no extra requests." },
  { q: "What happens when a visitor clicks the button?", a: "On a phone, WhatsApp opens straight to a chat with your number, with your pre-filled message ready to send. On a computer, it opens WhatsApp Desktop if it's installed, or WhatsApp Web. With the popup turned on, visitors first see your welcome message and a Start chat button." },
  { q: "Does it work with a WhatsApp Business number?", a: "Yes. The button uses a standard wa.me click-to-chat link, which works with any number on WhatsApp or the WhatsApp Business app. You don't need the WhatsApp Business API." },
  { q: "Can I remove the Wapzen link from the popup?", a: "Yes. Untick \"Show a small Free WhatsApp button by Wapzen link\" before you copy the code. Leaving it on helps us keep these tools free, but it's your choice." },
  { q: "Can the WhatsApp button answer customers automatically?", a: "The button starts the chat; someone still has to reply. If you'd like replies to go out automatically, day and night, Wapzen's AI chatbot can answer those WhatsApp messages from your own prices and FAQ." },
];

export default function WhatsAppButtonGeneratorPage() {
  return <ToolPage
    path={path}
    name="WhatsApp button generator"
    description={description}
    heading={<>WhatsApp button for your website.<br /><span>Free chat widget, ready in a minute.</span></>}
    lead="Design a floating WhatsApp chat button with an optional welcome popup, see it live on a sample page, and copy one piece of code for WordPress, Shopify, Wix or any website."
    perks={["Live preview", "No external scripts", "No sign-up"]}
    tool={<WhatsAppButtonGenerator />}
    steps={{ heading: <>How to add a WhatsApp button.<br /><span>Three quick steps.</span></>, items: steps }}
    cards={{ heading: <>Where to paste the code.<br /><span>Every popular website builder.</span></>, intro: "The code works on any website that lets you add custom HTML. These are the exact places to paste it on the most common platforms.", items: platforms }}
    faq={{ heading: <>WhatsApp website button.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>More chats coming in?<br /><span>Let AI answer them.</span></>, body: "Wapzen's AI chatbot replies to your WhatsApp messages day and night from your own price list and FAQ. Free to start, no credit card, no Business API." }}
  />;
}
