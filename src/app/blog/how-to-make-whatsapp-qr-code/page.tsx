import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Targets "whatsapp qr code generator with logo free" (106, 4/5), "qr code for
// whatsapp business" (85), "how to make whatsapp qr code" (50, 5/5), "whatsapp
// business qr code" (50, 5/5), autocomplete 2026-11-05. Search Console: "whatsapp
// qr code generator" 19 impressions at 34.1, "whatsapp qr code logo" 7 at 41.
// Scan figures are our tests of 31 Oct 2026 (docs/seo-research.md, "WhatsApp QR
// code page"). qrSvg.ts has only lost its test hook since. If LOGO_SHARE, the error
// correction levels or MARGIN change, rerun the tests and update this post.
// The app's menu path comes from third-party guides: check it on a phone.
const href = "/blog/how-to-make-whatsapp-qr-code";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, article: { publishedTime: post.published, modifiedTime: post.updated } });

const routes = [
  ["Custom logo and colours", "No", "Yes"],
  ["Pre-filled message", "Set in the app’s short link", "Yes, any message for each code"],
  ["Print-ready files", "Save or share from the app", "PNG up to 2048 px, or SVG"],
  ["Sign-up", "Needs the app", "None"],
  ["Price", "Free", "Free"],
];

const logoTests = [
  ["15–24% of the code’s width", "99.5%"],
  ["30%", "99%"],
  ["35%", "67%"],
  ["40%", "32%"],
  ["45%", "3%"],
  ["50%", "0%"],
];

const fixes = [
  ["Opens the wrong chat or an error", "The number has a leading 0 or no country code", "Use country code + number, such as 919812345678"],
  ["Won’t scan with a logo", "The logo is too wide or made of thin lines", "Use a solid logo at about 24% width"],
  ["Scans on some phones only", "Low contrast or light code on dark", "Use a dark code on a light background"],
  ["Fails on a dark flyer", "No clear margin around the code", "Keep a light border of 4 dots on every side"],
  ["Fails when small", "A long message makes the dots tiny", "Shorten the message or print larger"],
];

const faqs = [
  { q: "How do I make a QR code for my WhatsApp number?", a: "Use a free generator: enter your number with its country code, add a message if you want one, then download the code. It holds a wa.me link, and scanning it opens a chat with you. The WhatsApp Business app can also make one under its short link settings, without a custom logo." },
  { q: "How do I make a WhatsApp QR code with a logo?", a: "In Wapzen's free WhatsApp QR code generator, choose Image under the logo options and upload a PNG, JPG, WebP or SVG up to 1 MB. The generator sizes the logo at about 24% of the code's width and uses the strongest error correction the link fits." },
  { q: "Does a WhatsApp QR code expire?", a: "A wa.me code doesn't expire. It works as long as the number is on WhatsApp. A code made in the WhatsApp Business app stops working if you reset it, so reprint it after a reset." },
  { q: "How do I create a QR code for a WhatsApp group?", a: "Group admins can open the group's invite settings in WhatsApp and share its invite link or QR code. A generator for your number opens a one-to-one chat, not a group." },
  { q: "Can I use the WhatsApp logo on my QR code?", a: "WhatsApp has its own brand rules for its logo, so check them before printing it. Wapzen's generator offers a generic chat bubble instead, or you can use your own business logo, which also tells people whose code it is." },
  { q: "What size should I print a WhatsApp QR code?", a: "At least 2 × 2 cm. For codes read from further away, make the code about one tenth of the scanning distance, such as 20 cm wide for a poster read from 2 metres." },
  { q: "Why is my WhatsApp QR code not working?", a: "The usual causes are a number without its country code, a logo that's too large, low contrast, a light code on a dark background, no margin around the code, or a code printed too small. Test-scan on a few phones before you print." },
];

const sources = [
  { label: "Wapzen: free WhatsApp QR code generator", href: "https://wapzen.io/tools/whatsapp-qr-code-generator" },
  { label: "Meta for Developers: QR codes and short links in WhatsApp", href: "https://developers.facebook.com/blog/post/2022/12/12/qr-codes-and-shortlinks-in-whatsapp/" },
  { label: "WhatsApp brand resources", href: "https://www.facebook.com/brand/resources/whatsapp/whatsapp-brand/" },
];

const sections = [
  {
    id: "two-ways",
    title: "Two ways to make a WhatsApp QR code",
    body: <>
      <p>A WhatsApp QR code is a normal QR code holding a chat link. Scanning it opens a WhatsApp chat with your number, so nobody has to type or save it. You can get one from the WhatsApp Business app, or from a generator if you want your logo on it.</p>
      <Comparison caption="WhatsApp Business app QR code compared with a free generator" columns={["WhatsApp Business app", "Wapzen generator"]} rows={routes} />
      <p><strong>In the WhatsApp Business app,</strong> go to <strong>Business tools › Short link</strong>, then open the QR code to save or share it. Menu names can differ between app versions. If you reset this code, the old one stops working.</p>
    </>,
  },
  {
    id: "steps",
    title: "How to make one with your logo, step by step",
    body: <>
      <ol>
        <li><strong>Open the <Link href="/tools/whatsapp-qr-code-generator">free WhatsApp QR code generator</Link>.</strong> There’s no sign-up or watermark, and the code is made in your browser.</li>
        <li><strong>Enter your number</strong> with its country code.</li>
        <li><strong>Add a pre-filled message,</strong> such as “Hi, I’d like to book a table.” It’s ready to send when the chat opens. Different messages on different codes also tell you which flyer or shelf a customer came from.</li>
        <li><strong>Pick a design:</strong> square or rounded dots, your colours, and a chat icon or your own logo (PNG, JPG, WebP or SVG up to 1 MB).</li>
        <li><strong>Add a short caption,</strong> such as “Scan to chat on WhatsApp”.</li>
        <li><strong>Download a PNG</strong> up to 2048 px for screens and small prints, or an <strong>SVG</strong> that stays sharp at any size.</li>
        <li><strong>Test-scan it</strong> on a few phones before you print.</li>
      </ol>
    </>,
  },
  {
    id: "logo-tests",
    title: "How big can a logo be? We tested it",
    body: <>
      <p>Most guides just say “keep the logo small”. We measured it, using our generator’s own code and 192 test images per row: different numbers, message lengths and dot styles, including blurred and tilted copies. A pass means three decoders (jsQR, ZXing and ZBar) all read the image.</p>
      <Comparison caption="Share of test images read by all three decoders, by logo width, at error correction level H" columns={["Images read"]} rows={logoTests} />
      <ul>
        <li><strong>Up to 30% is safe at the highest error correction.</strong> Our generator uses about 24%, which leaves a margin.</li>
        <li><strong>Long messages fail first.</strong> At 35%, every long-message image failed, while every shorter one passed.</li>
        <li><strong>Error correction matters.</strong> At the lower level M, a 24% logo passed only 64% of the time.</li>
        <li><strong>Solid logos beat thin lines.</strong> At 24%, solid shapes passed 99.5%, thin line art 79%, and white line art on a solid circle 47%.</li>
        <li><strong>WhatsApp green is risky for the dots.</strong> #25D366 on white was read by jsQR in only 24 of 48 images. The darker #075E54 was read in all 48.</li>
        <li><strong>Inverted codes are risky too.</strong> ZBar read 0 of 48 light-on-dark codes.</li>
      </ul>
      <Note>These tests ran on 31 October 2026 with software decoders, not phones. Real cameras can differ, so always test your final print.</Note>
    </>,
  },
  {
    id: "where",
    title: "Where to use it, and what message to pre-fill",
    body: <>
      <ul>
        <li><strong>Shop counter:</strong> “Hi, is this item in stock?”</li>
        <li><strong>Restaurant table or menu:</strong> “Hi, I’d like to place an order.”</li>
        <li><strong>Clinic or salon:</strong> “Hello, I’d like to book an appointment.”</li>
        <li><strong>Product packaging:</strong> “Hi, I have a question about my order.”</li>
        <li><strong>Business card or flyer:</strong> “Hi, I saw your flyer and I’d like to know more.”</li>
      </ul>
      <p>Need a link as well as a code? The <Link href="/tools/whatsapp-link-generator">WhatsApp link generator</Link> makes the same chat link for your website and social profiles.</p>
    </>,
  },
  {
    id: "fix",
    title: "WhatsApp QR code not working? How to fix it",
    body: <Comparison caption="Common WhatsApp QR code problems and fixes" columns={["Likely cause", "Fix"]} rows={fixes} />,
  },
  {
    id: "after-the-scan",
    title: "Answer every scan, even after closing time",
    body: <>
      <p>A QR code works day and night, so messages will arrive when nobody’s free to answer. <strong>Everything in Wapzen is free right now,</strong> including an AI chat agent that replies from your own business information and an AI voice agent for WhatsApp calls. It links the same number your QR code opens.</p>
      <InlineCta title="Let AI answer the chats your code starts" body="Link your WhatsApp number, add your business details, and every scan gets a reply." />
    </>,
  },
];

export default function HowToMakeWhatsAppQrCodePage() {
  return <BlogPost
    href={href}
    heading={<>How to make a WhatsApp QR code.<br /><span>With your logo, for free.</span></>}
    lead="A QR code lets customers open a chat with you in one scan. Here’s how to make one in the WhatsApp Business app or with your own logo, how big that logo can be according to our scan tests, and how to fix a code that won’t scan."
    summary={{
      title: "Quick answer",
      items: [
        <><strong>Fastest with a logo:</strong> enter your number in a <Link href="/tools/whatsapp-qr-code-generator">free generator</Link>, add your logo, and download a PNG or SVG.</>,
        <><strong>Keep the logo to 30% of the width or less,</strong> ideally solid and about 24%. In our tests, 35% passed only 67% of the time.</>,
        <><strong>Use a dark code on a light background,</strong> keep a clear margin, and test-scan before printing.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-business-greeting-message", "/blog/whatsapp-ai-auto-reply-customer-conversations"]}
    product="/free-whatsapp-chatbot"
    cta={{ heading: <>Every scan starts a chat.<br /><span>Let AI answer it.</span></>, body: "Everything in Wapzen is free right now: AI that answers WhatsApp messages and calls on your own number, day and night." }}
  />;
}
