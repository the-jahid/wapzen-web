import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { CreditCard, Package, Presentation, Receipt, Store, UtensilsCrossed } from "lucide-react";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import blog from "@/components/blog/Blog.module.css";
import { CopyButton } from "@/components/free-tools/CopyButton";
import { ToolPage } from "@/components/free-tools/ToolPage";
import { WhatsAppQrGenerator } from "@/components/free-tools/WhatsAppQrGenerator";
import styles from "@/components/free-tools/FreeTools.module.css";
import { QR_EXAMPLES_PATH, qrExamples, qrLogoSizes, qrModulesAcross, qrSampleSvg } from "@/components/free-tools/qrExamples";
import { Comparison, Section } from "@/components/marketing/MarketingPage";

const path = "/tools/whatsapp-qr-code-generator";
const updated = "2026-10-31";
const title = "Free WhatsApp QR Code Generator with Logo";
const description = "Make a free WhatsApp QR code with your logo, for WhatsApp or WhatsApp Business. Add a pre-filled message, colours and a caption, then download a PNG or SVG.";

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

const contents = [
  { href: "#how-title", label: "Make a code" },
  { href: "#logo", label: "Add a logo" },
  { href: "#business", label: "WhatsApp Business" },
  { href: "#kinds", label: "Which code you need" },
  { href: "#print", label: "Print sizes" },
  { href: "#formats", label: "PNG or SVG" },
  { href: "#not-working", label: "Fix a code" },
  { href: "#examples", label: "Examples" },
  { href: "#faq-title", label: "FAQ" },
];

// Share of test images read by all three decoders. Method in the notes below.
const logoResults = [
  ["15%", "100%", "99.5%"],
  ["20%", "100%", "99.5%"],
  ["24% (this generator)", "64%", "99.5%"],
  ["30%", "33%", "99%"],
  ["35%", "Not tested", "67%"],
  ["40%", "Not tested", "32%"],
  ["45%", "Not tested", "3%"],
  ["50%", "Not tested", "0%"],
];

const logoStyles = [
  ["Solid shape, such as a square or circle", "576 images", "99.5%"],
  ["The built-in chat icon", "192 images", "99.5%"],
  ["Thin dark line art", "960 images", "79%"],
  ["White line art on a solid circle", "960 images", "47%"],
];

const businessOptions = [
  ["Logo and colours", "No, a standard code", "No, edit the file yourself", "Yes, built in"],
  ["Pre-filled message", "Optional default message", "Up to 140 characters, editable after printing", "Set when you make the code; a change means a new code"],
  ["Link inside the code", "A short link from WhatsApp", "wa.me/message/ plus a short code", "wa.me/ plus your number"],
  ["Scan counts", "None", "None", "None"],
  ["Files", "An image to save or share", "PNG or SVG", "PNG up to 2048 px, or SVG"],
  ["What you need", "The WhatsApp Business app", "A Business Platform (API) account", "Your number, no sign-up"],
];

const kinds = [
  ["Click-to-chat code", "Opens a chat with your number, with an optional message ready to send", "This generator, or Short link in the WhatsApp Business app", "Yes, it’s made for print"],
  ["Personal contact code", "Lets someone add you as a contact", "Settings, then the QR icon next to your name", "Yes, until you reset it"],
  ["Group invite code", "Lets people join a group", "Group info, then Invite via link, then QR code (admins only)", "Yes, until the link is reset"],
  ["WhatsApp Web login code", "Links a computer to your account", "Shown on web.whatsapp.com, scanned from Linked devices", "No, it refreshes within seconds"],
];

const printSizes = [
  ["Business card", "15–20 cm", "SVG, or PNG at 1024 px", "2 cm (0.8 in)"],
  ["Product label", "20–30 cm", "SVG, or PNG at 1024 px", "3 cm (1.2 in)"],
  ["Table card or menu", "30–50 cm", "SVG, or PNG at 1024 px", "5 cm (2 in)"],
  ["Flyer or leaflet", "50–60 cm", "SVG, or PNG at 1024 px", "6 cm (2.4 in)"],
  ["Counter sign", "1 m", "SVG, or PNG at 2048 px", "10 cm (4 in)"],
  ["Window poster", "2 m", "SVG", "20 cm (8 in)"],
  ["Property sign", "3 m", "SVG", "30 cm (12 in)"],
  ["Event banner", "4 m", "SVG", "40 cm (16 in)"],
];

// 0.5 mm per module, never below the usual 2 cm floor.
function smallestWidth(modules: number) {
  const cm = Math.max(2, Math.ceil(modules * 0.5) / 10);
  return `${cm} cm (${(cm / 2.54).toFixed(1)} in)`;
}

const messageSizes = [
  { label: "No message", message: "" },
  { label: "Hi, I'd like to order.", message: "Hi, I'd like to order." },
  { label: "Hello, I'd like to book an appointment.", message: "Hello, I'd like to book an appointment." },
  { label: "A 104-character message", message: "Hi! I scanned the code on your shop window and I'd like to know your prices and opening hours this week." },
].map(({ label, message }) => {
  const modules = qrModulesAcross(message);
  return [label, `${message.length} characters`, `${modules} × ${modules}`, smallestWidth(modules)];
});

const formats = [
  ["Best for", "WhatsApp status, social posts, websites and documents", "Printers, signs, packaging and anything large"],
  ["When enlarged", "Blurs past its pixel size", "Stays sharp at any size"],
  ["Sizes here", "512, 1024 or 2048 px wide", "Any size, set by your print software"],
  ["Sharp print width at 300 DPI", "4.3 cm, 8.7 cm or 17.3 cm", "No limit"],
  ["Opens in", "Almost everything", "Browsers and design software; some office apps won’t"],
  ["Caption", "Part of the image", "Live Arial text, so ask your printer to outline it"],
];

const problems = [
  ["The camera won’t read it", "Too small, too far away, low contrast or glare", "Check the print table above, use a dark code on a light background, and print on matte stock"],
  ["It reads on screen but not in print", "The white border was cropped, or a small PNG was enlarged", "Keep the border and send your printer the SVG"],
  ["It stopped scanning after you edited the message", "More characters changed the pattern, leaving less margin for the logo", "Test the new code, then shorten the message or use a smaller logo"],
  ["WhatsApp says the number isn’t on WhatsApp", "A wrong country code, or a local number format", "Enter the full number with its country code and make a new code"],
  ["The wrong chat opens", "An old code, or a wrong digit", "Make a new code and test it. A printed code can’t be edited"],
  ["The message box is empty", "A third-party scanner dropped the message from the link", "Scan with the phone’s camera app instead"],
  ["A web page opens first", "WhatsApp isn’t installed, or the phone opened the link in a browser", "Install WhatsApp, or tap the button on the page to continue to the chat"],
  ["A login or transfer code won’t scan", "That’s a different kind of code, not one you can generate", "Follow WhatsApp’s steps for linked devices, linked below"],
];

const faqs = [
  { q: "What is a WhatsApp QR code?", a: "A WhatsApp QR code is a QR code that contains a click-to-chat link (https://wa.me/<number>). Scanning it opens a WhatsApp chat with that number, optionally with a message already typed, so customers don't have to save your number first." },
  { q: "Does WhatsApp have its own QR code?", a: "Yes. Every account has a personal QR code: open Settings and tap the QR icon next to your name. The WhatsApp Business app also has a short link with a QR code under Tools. Neither lets you add your own logo, which is why businesses use a generator like this one." },
  { q: "How do I get a QR code for WhatsApp Business?", a: "There are two free ways. Type your WhatsApp Business number into the generator on this page to get a code with your logo and colours. Or open the WhatsApp Business app, go to Tools (Settings > Business tools on older versions), tap Short link, then QR code. That gives you a standard code with no logo." },
  { q: "Will my QR code still scan with a logo in the middle?", a: "Yes, at the size this generator uses. With a logo, it switches to level H, the strongest error correction, and keeps the logo tile to about 24% of the code's width. In our test, all three decoders read 191 of 192 images with a solid logo at that size. Bold, solid logos do best: thin line art missed in about one image in five. Always test-scan before printing." },
  { q: "Can I put the WhatsApp logo on my QR code?", a: "Meta's brand guidelines don't mention QR codes, but they say you can't modify the WhatsApp logo or combine it with other logos or marks, can't make it the most prominent thing on your material, and can't imply that WhatsApp endorses you. This generator offers a plain green chat icon instead, or your own logo." },
  { q: "How do customers scan a WhatsApp QR code?", a: "Most phones scan QR codes with the built-in camera app: point the camera at the code and tap the link that appears. WhatsApp then opens a chat with your number. Dedicated QR scanner apps work too." },
  { q: "What colours work best for a QR code?", a: "A dark code on a light background, with strong contrast, scans most reliably. Bright colours are a trap: WhatsApp's own green (#25D366) on white read only 24 times out of 48 in one of our three decoders. Dark teal and dark green work well, and the generator warns you when your colours might be a problem." },
  { q: "What size should I print my WhatsApp QR code?", a: "Print it at least 2 × 2 cm (about 0.8 × 0.8 in), and larger if it carries a long pre-filled message. For codes scanned from further away, a good rule is a code width of about one tenth of the scanning distance, e.g. 20 cm wide for a poster read from 2 metres." },
  { q: "Should I download a PNG or an SVG?", a: "Use SVG for print, because it stays sharp at any size. Use PNG for screens, such as your website, social posts or a WhatsApp status. At 300 DPI, the 2048 px PNG stays sharp up to about 17 cm (6.8 in)." },
  { q: "Does the WhatsApp QR code expire?", a: "No. The code simply contains a link to your number, so it keeps working for as long as that number is on WhatsApp. Nothing runs through our servers, so there's nothing that can switch it off." },
  { q: "Can I change a QR code after printing it?", a: "No. This generator makes static codes: the number and message are stored in the pattern itself, so changing either one means making a new code. If you need to change the message after printing, QR codes from Meta's Business Platform allow that, but they need an API account." },
  { q: "Can I track how many people scan my code?", a: "Not directly. A static code has no server in the middle to count scans, and Meta says its own WhatsApp QR codes have no analytics either. A simple workaround is a different pre-filled message for each placement, such as “Hi, I saw your window poster”, so every chat tells you which code it came from." },
  { q: "Can people see my phone number?", a: "Yes. The link contains your number, and the chat shows it once opened, so use a number you're happy to publish. A QR code saves people from typing your number, but it doesn't hide it." },
  { q: "How long can the pre-filled message be?", a: "The generator accepts up to 1,000 characters and tells you if a message won't fit, but shorter is better because every extra character makes the code denser. Aim for under 40 characters on small prints. Customers can edit the message before they send it." },
  { q: "Can I make a QR code for a WhatsApp group?", a: "Not with this generator, which creates chat codes for a phone number. Group admins can get one inside WhatsApp: open Group info, tap Invite via link, then QR code. Resetting the group link turns off the old code." },
  { q: "Is this WhatsApp QR code generator free?", a: "Yes, it's completely free, with no sign-up, no watermark and no scan limits. The code is created in your browser; your number, message and logo aren't uploaded to our servers." },
];

const sources = [
  { label: "Meta for Developers: QR codes and short links", href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/qr-codes" },
  { label: "Meta: WhatsApp brand guidelines", href: "https://www.meta.com/brand/resources/whatsapp/whatsapp-brand/" },
  { label: "WhatsApp Help Center: How to use click to chat", href: "https://faq.whatsapp.com/5913398998672934" },
  { label: "WhatsApp Help Center: How to view your WhatsApp QR code", href: "https://faq.whatsapp.com/675736450543192" },
  { label: "WhatsApp Help Center: About QR code for WhatsApp Business", href: "https://faq.whatsapp.com/general/26000403/" },
  { label: "WhatsApp Help Center: How to link a device", href: "https://faq.whatsapp.com/1317564962315842" },
];

const guide = <>
  <Section id="logo" heading={<>How to add a logo to a WhatsApp QR code.<br /><span>Without breaking the scan.</span></>} intro="A QR code stores spare error-correction data, so it can lose part of its pattern and still read. Your logo uses up some of that spare data, which makes logo size the setting that matters most.">
    <div className={`${blog.prose} ${styles.guideBody}`}>
      <ol>
        <li>Enter your number in the generator at the top of this page.</li>
        <li>Under <strong>Centre logo</strong>, choose <strong>Your logo</strong> and upload a PNG, JPG, WebP or SVG up to 1 MB. Or choose <strong>Chat icon</strong> for a green speech bubble.</li>
        <li>The generator switches to level H, the strongest error correction, and clears a square in the middle of the code, about 24% of its width.</li>
        <li>Download the code, then scan it with a phone before you print it.</li>
      </ol>

      <h3>How big can a WhatsApp QR code logo be?</h3>
      <p>We measured it. We drew codes with this generator’s own code, using 8 phone numbers, 3 message lengths and both dot styles, then made sharp, blurred, tilted and skewed copies of each. Three independent decoders (jsQR, ZXing and ZBar) tried to read all of them. Each row below is 192 images using the built-in chat icon, and a pass means all three decoders read the image.</p>
      <Comparison caption="Share of test images read by all three decoders, by logo width and error correction level" columns={["Level M, a common default", "Level H, used here"]} rows={logoResults} />
      <p><strong>Keep your logo to 30% of the code’s width or less.</strong> This generator uses 24%, which leaves a margin. The 0.5% miss at small sizes is one long-message image that ZBar also missed with no logo at all.</p>
      <p>Two results surprised us. First, error correction matters as much as size: the same 24% logo passed only 64% of the time at level M. Second, above 30% <strong>the outcome depends on the message</strong>. At 35%, all 128 images with no message or a short one passed, and all 64 with a long one failed. A logo that scans today can stop scanning when you edit the message, so test again after every change.</p>
      <div className={styles.logoSizes}>
        {qrLogoSizes.map((sample) => {
          const { width, height } = qrSampleSvg(sample);
          return <figure key={sample.slug}>
            <Image className={styles.sampleCode} src={`${QR_EXAMPLES_PATH}/${sample.slug}.svg`} alt={sample.alt} width={width} height={height} unoptimized />
            <figcaption><strong>{sample.label}</strong>{sample.verdict}</figcaption>
          </figure>;
        })}
      </div>
      <Note>Software decoders aren’t phone cameras, and phones vary. Treat these numbers as a map of where the risk starts, and always test your own code.</Note>

      <h3>What makes a good QR code logo</h3>
      <p>Size isn’t the only risk. The style of the logo matters just as much, which we only found by testing. We ran the same check at the generator’s 24% size with six logo styles:</p>
      <Comparison caption="Share of test images read by all three decoders, by logo style" columns={["Tested", "All three decoders"]} rows={logoStyles} />
      <p><strong>Use a bold, simple mark.</strong> jsQR and ZXing read every image in this test, so the whole drop came from ZBar, which fine detail threw off. We expected a solid circle behind line art to help. It made things worse. Your phone may cope better than ZBar did, but a simple shape is the safe choice for any camera.</p>
      <ul>
        <li><strong>One solid shape, not thin lines.</strong> Avoid outline icons, stripes and small gaps, and don’t fix them by adding a coloured circle.</li>
        <li><strong>A square or round mark, not a wide wordmark.</strong> The space is square, so a wide logo shrinks to fit it.</li>
        <li><strong>An icon, not your full name.</strong> On a 2 cm code, the logo’s space is under 4 mm wide, too small for words.</li>
        <li><strong>A transparent background.</strong> Your code’s background colour then shows behind the logo, so it looks built in.</li>
        <li><strong>At least 300 px wide.</strong> That keeps a PNG logo crisp in the 2048 px download. An SVG logo is sharp at any size.</li>
      </ul>

      <h3>Can you use the WhatsApp logo in your QR code?</h3>
      <p>Meta’s <a href="https://www.meta.com/brand/resources/whatsapp/whatsapp-brand/" target="_blank" rel="nofollow noopener noreferrer">WhatsApp brand guidelines</a> don’t mention QR codes, but their general rules are strict. You can’t modify the logo or combine it with other logos or marks, it can’t be the most prominent thing on your material, and nothing may imply that WhatsApp endorses you.</p>
      <p>That’s why the <strong>Chat icon</strong> here is a plain green speech bubble rather than WhatsApp’s logo. Your own logo is the safer choice anyway, because it shows customers whose chat they’re about to open. This is our reading of the rules, not legal advice.</p>
    </div>
  </Section>

  <Section id="business" heading={<>WhatsApp Business QR codes.<br /><span>Three ways to get one.</span></>} intro="A QR code for WhatsApp Business works just like a personal one. The link only needs your number, so this generator works with the WhatsApp Business app, the Business Platform (API) and a regular account alike.">
    <div className={`${blog.prose} ${styles.guideBody}`}>
      <Comparison caption="Ways to get a WhatsApp Business QR code compared" columns={["Business app", "Business Platform (API)", "This generator"]} rows={businessOptions} />
      <p>Use the built-in code if you don’t need branding. Use this generator when you want your logo and colours, or a different message for each placement. The API route suits businesses that already run on the Business Platform and need to change messages after printing. Not sure which you’re on? Here’s <Link href="/blog/whatsapp-business-app-vs-api">the WhatsApp Business app vs the API</Link>.</p>
      <h3>How to find the QR code in the WhatsApp Business app</h3>
      <ol>
        <li>Open WhatsApp Business and go to the <strong>Tools</strong> tab. On older versions, go to <strong>Settings</strong>, then <strong>Business tools</strong>.</li>
        <li>Tap <strong>Short link</strong>. On Android, you may need to tap the three-dot menu first.</li>
        <li>Optionally, switch on a <strong>default message</strong> and write it.</li>
        <li>Tap <strong>QR code</strong>, then save or share the image.</li>
      </ol>
      <p>Menu names change between app versions. Resetting this code turns off the old one, so don’t reset it once it’s in print. If you only need something to paste into a bio or an email, a <Link href="/tools/whatsapp-link-generator">WhatsApp chat link</Link> does the same job without a code.</p>
      <InlineCta title="Who answers when you’re closed?" body="A printed code brings customers into your chat at any hour. Wapzen adds an AI agent to your WhatsApp or WhatsApp Business number, so they get an answer straight away. It’s free to start." />
    </div>
  </Section>

  <Section id="kinds" heading={<>Does WhatsApp have a QR code?<br /><span>Yes, four different kinds.</span></>} intro="Searching for a WhatsApp QR code can mean four different things. Only the first is the one you print for customers.">
    <div className={`${blog.prose} ${styles.guideBody}`}>
      <Comparison caption="The four kinds of WhatsApp QR code" columns={["What it does", "Where to get it", "Can you print it?"]} rows={kinds} />
      <p>One safety note: never scan a WhatsApp Web login code that someone sends you. It links their computer to your account, which is a known way to lose it.</p>
    </div>
  </Section>

  <Section id="print" heading={<>WhatsApp QR code print sizes.<br /><span>Let the scanning distance decide.</span></>} intro="Make the code about one tenth as wide as the distance it’s scanned from, and never below 2 cm (0.8 in). That 10:1 ratio is a rule of thumb, so go larger in dim light. Measure the full width of the download, white border included.">
    <div className={`${blog.prose} ${styles.guideBody}`}>
      <Comparison caption="WhatsApp QR code print sizes by placement" columns={["Scan distance", "File", "Smallest width"]} rows={printSizes} />
      <h3>Long messages need bigger codes</h3>
      <p>Most size charts miss this. Every extra character adds modules, the small squares that make up a code, so at the same print size each one gets smaller. A code with a logo and no message is {qrModulesAcross("")} modules across. Add the 22 characters of “Hi, I’d like to order.” and it jumps to {qrModulesAcross("Hi, I'd like to order.")}.</p>
      <p>The usual 2 cm minimum works out at about 0.5 mm per module on the shortest code. To keep that margin, we hold 0.5 mm as the message grows. These figures come from this generator, with a logo:</p>
      <Comparison caption="Smallest print width by pre-filled message length" columns={["Length", "Modules across", "Smallest width"]} rows={messageSizes} />
      <h3>Before you print</h3>
      <ul>
        <li><strong>Keep the white border.</strong> It’s called the quiet zone, and scanners use it to find the code. We pasted codes onto a dark flyer with the border removed: ZXing read 0 of 48, jsQR 7 and ZBar 32. Your download already has the standard four-module border, so don’t crop it.</li>
        <li><strong>Choose dark colours, not bright ones.</strong> WhatsApp’s own green (#25D366) on white read just 24 of 48 times in jsQR, while dark teal (#075E54) read all 48.</li>
        <li><strong>Keep the code darker than its background.</strong> ZBar read none of the 48 light-on-dark codes we tried, so some scanners will miss them too.</li>
        <li><strong>Choose matte over gloss.</strong> Glare can hide part of the code, especially on laminated menus and window stickers.</li>
        <li><strong>Print one test copy.</strong> Scan it at full size, from the real distance and in the real light, with both an iPhone and an Android phone.</li>
      </ul>
    </div>
  </Section>

  <Section id="formats" heading={<>PNG or SVG for a QR code?<br /><span>SVG for print, PNG for screens.</span></>} intro="A PNG is made of pixels, so it has a size limit. An SVG is made of shapes, so it can be printed at any size. Meta recommends SVG for its own WhatsApp QR codes too.">
    <div className={`${blog.prose} ${styles.guideBody}`}>
      <Comparison caption="PNG and SVG compared for WhatsApp QR codes" columns={["PNG", "SVG"]} rows={formats} />
      <p>To work out how large a PNG can go, divide its pixels by 300 and multiply by 2.54. That gives the width in centimetres at 300 DPI, the usual print resolution. So the 2048 px download covers everything up to about 17 cm. For anything larger, use the SVG rather than stretching the PNG.</p>
    </div>
  </Section>

  <Section id="not-working" heading={<>WhatsApp QR code not working?<br /><span>Find the fix by symptom.</span></>}>
    <div className={`${blog.prose} ${styles.guideBody}`}>
      <Comparison caption="WhatsApp QR code problems and how to fix them" columns={["Likely cause", "Fix"]} rows={problems} />
      <p>For number problems, the <Link href="/tools/whatsapp-country-code-finder">WhatsApp country code finder</Link> converts a local number into the format the link needs. For login codes, see WhatsApp’s guide on <a href="https://faq.whatsapp.com/1317564962315842" target="_blank" rel="nofollow noopener noreferrer">how to link a device</a>.</p>
    </div>
  </Section>

  <Section id="examples" heading={<>WhatsApp QR code examples.<br /><span>Six designs to copy.</span></>} intro="This generator drew every code here, and all three decoders read each one. They’re demonstrations, not customer work. They use reserved example numbers, so scanning one reads the code but won’t open a working chat.">
    <div className={styles.exampleGrid}>
      {qrExamples.map((example) => {
        const { width, height } = qrSampleSvg(example);
        return <article key={example.slug} className={styles.exampleCard}>
          <Image className={styles.sampleCode} src={`${QR_EXAMPLES_PATH}/${example.slug}.svg`} alt={example.alt} width={width} height={height} unoptimized />
          <h3 className={styles.exampleTitle}>{example.title}</h3>
          <div className={styles.exampleMessage}>
            <span>{example.message || "No pre-filled message"}</span>
            {example.message && <CopyButton value={example.message} label={`Copy the message for the ${example.title.toLowerCase()}`} />}
          </div>
          <p className={styles.exampleSpecs}><strong>Print at {example.printWidth}.</strong> {example.tip}</p>
        </article>;
      })}
    </div>
  </Section>
</>;

const notes = <aside className={styles.notes} aria-labelledby="notes-title"><div>
  <h2 id="notes-title" className={styles.notesTitle}>Sources and testing</h2>
  <p>Facts checked on 31 October 2026. Our scan tests ran this generator’s code through jsQR, ZXing and ZBar: 2,496 images for the logo size table, 2,688 for the logo style table, and 48 images for each colour and border check. WhatsApp menus change between app versions, so yours may differ slightly.</p>
  <ul>{sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="nofollow noopener noreferrer">{source.label}</a></li>)}</ul>
</div></aside>;

export default function WhatsAppQrCodeGeneratorPage() {
  return <ToolPage
    path={path}
    name="WhatsApp QR code generator"
    description={description}
    heading={<>WhatsApp QR code generator<br /><span>with your logo.</span></>}
    lead="This free WhatsApp QR generator makes a code that opens a chat with your number, on WhatsApp or WhatsApp Business. Add your logo, brand colours and a pre-filled message, then download it for print or screen."
    perks={["Free to use", "No sign-up or watermark", "PNG and SVG downloads"]}
    tool={<WhatsAppQrGenerator />}
    contents={contents}
    steps={{ heading: <>How to make a WhatsApp QR code.<br /><span>Three quick steps.</span></>, items: steps }}
    guide={guide}
    cards={{ heading: <>Where to put your QR code.<br /><span>Wherever customers see you.</span></>, intro: "A WhatsApp QR code bridges printed and in-person moments to a real conversation. One scan and the customer is in your chat.", items: places }}
    faq={{ heading: <>WhatsApp QR codes.<br /><span>Your questions, answered.</span></>, items: faqs }}
    notes={notes}
    updated={updated}
    cta={{ heading: <>Every scan starts a chat.<br /><span>Let AI answer it.</span></>, body: "Wapzen gives your WhatsApp number an AI chatbot and voice agent that reply to every customer instantly, day and night, using your own business knowledge." }}
  />;
}
