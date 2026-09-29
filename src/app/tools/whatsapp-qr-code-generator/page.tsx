import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { CreditCard, Package, Presentation, Receipt, Store, UtensilsCrossed } from "lucide-react";
import { ToolPage } from "@/components/free-tools/ToolPage";
import { WhatsAppQrGenerator } from "@/components/free-tools/WhatsAppQrGenerator";

const path = "/tools/whatsapp-qr-code-generator";
const title = "Free WhatsApp QR Code Generator with Logo";
const description = "Create a free WhatsApp QR code that opens a chat with your number. Add a pre-filled message, your logo, colours and a caption, then download a PNG or SVG.";

export const metadata: Metadata = pageMetadata({ title, description, path: path });

const steps = [
  { title: "Enter your number", body: "Type your WhatsApp number with its country code, and optionally a message customers see ready to send, like “Hi, I'd like to order.”" },
  { title: "Design your code", body: "Pick square or rounded dots, match your brand colours, put your logo or a chat icon in the middle, and add a short caption." },
  { title: "Download and print", body: "Download a PNG up to 2048 px, or an SVG that stays sharp at any size. Test-scan it with your phone, then print or share it." },
];

const places = [
  { icon: Store, title: "Shop counters and windows", body: "Let walk-in customers ask about stock, prices or opening hours, even after you've closed for the day." },
  { icon: Package, title: "Product packaging", body: "Put support one scan away for questions, reorders and feedback, with a pre-filled message naming the product." },
  { icon: UtensilsCrossed, title: "Menus and tables", body: "Take reservations, takeaway orders and feedback from diners without them hunting for your number." },
  { icon: CreditCard, title: "Business cards and flyers", body: "Turn printed material into a conversation starter that doesn't depend on someone typing your number correctly." },
  { icon: Presentation, title: "Events and trade shows", body: "Collect leads at your stand: visitors scan and message you, so you have their number to follow up." },
  { icon: Receipt, title: "Receipts and deliveries", body: "Add the code to invoices and delivery slips so customers can reach you about their order in seconds." },
];

const faqs = [
  { q: "What is a WhatsApp QR code?", a: "A WhatsApp QR code is a QR code that contains a click-to-chat link (https://wa.me/<number>). Scanning it opens a WhatsApp chat with that number, optionally with a message already typed, so customers don't have to save your number first." },
  { q: "How do customers scan a WhatsApp QR code?", a: "Most phones scan QR codes with the built-in camera app: point the camera at the code and tap the link that appears. WhatsApp then opens a chat with your number. Dedicated QR scanner apps work too." },
  { q: "Will my QR code still scan with a logo in the middle?", a: "Yes. When you add a logo, the generator uses the highest QR error correction level, which can rebuild up to 30% of a damaged or covered code, and keeps the logo to a small area in the middle. Always test-scan before printing." },
  { q: "What colours work best for a QR code?", a: "A dark code on a light background, with strong contrast, scans most reliably. Light codes on dark backgrounds and low-contrast pairs can fail with some camera apps; the generator warns you when your colours might be a problem." },
  { q: "What size should I print my WhatsApp QR code?", a: "Print it at least 2 × 2 cm (about 0.8 × 0.8 in). For codes scanned from further away, a good rule is a code width of about one tenth of the scanning distance, e.g. 20 cm wide for a poster read from 2 metres. Use the SVG download for large prints." },
  { q: "Does the WhatsApp QR code expire?", a: "No. The code simply contains a link to your number, so it keeps working for as long as that number is on WhatsApp. If you want a different pre-filled message, generate and print a new code." },
  { q: "Is this WhatsApp QR code generator free?", a: "Yes, it's completely free, with no sign-up, no watermark and no scan limits. The code is created in your browser; your number, message and logo aren't uploaded to our servers." },
];

export default function WhatsAppQrCodeGeneratorPage() {
  return <ToolPage
    path={path}
    name="WhatsApp QR code generator"
    description={description}
    heading={<>WhatsApp QR code generator.<br /><span>Make it yours.</span></>}
    lead="Create a QR code that opens a WhatsApp chat with your business. Add a pre-filled message, your logo, brand colours and a caption, then download it for print or screen."
    perks={["Free forever", "No sign-up or watermark", "PNG and SVG downloads"]}
    tool={<WhatsAppQrGenerator />}
    steps={{ heading: <>How to make a WhatsApp QR code.<br /><span>Three quick steps.</span></>, items: steps }}
    cards={{ heading: <>Where to put your QR code.<br /><span>Wherever customers see you.</span></>, intro: "A WhatsApp QR code bridges printed and in-person moments to a real conversation. One scan and the customer is in your chat.", items: places }}
    faq={{ heading: <>WhatsApp QR codes.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Every scan starts a chat.<br /><span>Let AI answer it.</span></>, body: "Wapzen gives your WhatsApp number an AI chatbot and voice agent that reply to every customer instantly, day and night, using your own business knowledge." }}
  />;
}
