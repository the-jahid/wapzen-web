"use client";

import { useId, useMemo, useRef, useState, type ChangeEvent } from "react";
import { AlertTriangle, Download, ImagePlus, X } from "lucide-react";
import { ChatFields } from "./ChatFields";
import { LinkBox } from "./LinkBox";
import { buildQrSvg, contrastWarning, defaultQrDesign, qrPngDataUrl, sizedSvg, type QrLogo, type QrStyle } from "./qrSvg";
import { downloadHref, parsePhone, waLink } from "./whatsapp";
import styles from "./FreeTools.module.css";

// Shown until a real number is entered, so design changes are visible straight away.
const EXAMPLE_LINK = "https://wa.me/15551234567";
const MAX_LOGO_BYTES = 1024 * 1024;
const MAX_CAPTION = 32;
const PNG_SIZES = [512, 1024, 2048];

const inks = [
  { name: "Ink", value: "#10131a" },
  { name: "Teal", value: "#075e54" },
  { name: "Green", value: "#0f8f68" },
  { name: "Blue", value: "#1d4ed8" },
  { name: "Purple", value: "#6d28d9" },
  { name: "Red", value: "#b91c1c" },
];
const papers = [
  { name: "White", value: "#ffffff" },
  { name: "Mint", value: "#ecfdf3" },
  { name: "Cream", value: "#fdf8e8" },
  { name: "Mist", value: "#eef2f7" },
];

type LogoChoice = "none" | "chat" | "image";

function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<{ value: T; label: string }>; onChange: (value: T) => void }) {
  return <div className={styles.segmented} role="radiogroup" aria-label={label}>
    {options.map((option) => <button key={option.value} type="button" role="radio" aria-checked={value === option.value} onClick={() => onChange(option.value)}>{option.label}</button>)}
  </div>;
}

function ColorPicker({ label, value, swatches, onChange }: { label: string; value: string; swatches: Array<{ name: string; value: string }>; onChange: (value: string) => void }) {
  const id = useId();
  return <div className={styles.field}>
    <span className={styles.fieldLabel} id={`${id}-label`}>{label}</span>
    <div className={styles.swatches} role="group" aria-labelledby={`${id}-label`}>
      {swatches.map((swatch) => <button key={swatch.value} type="button" className={styles.swatch} style={{ background: swatch.value }} aria-label={swatch.name} aria-pressed={value === swatch.value} title={swatch.name} onClick={() => onChange(swatch.value)} />)}
      <label className={styles.customColor} title="Custom colour">
        <input type="color" value={value} onChange={(event) => onChange(event.target.value)} aria-label={`Custom ${label.toLowerCase()}`} />
        <span>{value.toUpperCase()}</span>
      </label>
    </div>
  </div>;
}

export function WhatsAppQrGenerator() {
  const id = useId();
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [style, setStyle] = useState<QrStyle>("rounded");
  const [fg, setFg] = useState(defaultQrDesign.fg);
  const [bg, setBg] = useState(defaultQrDesign.bg);
  const [logoChoice, setLogoChoice] = useState<LogoChoice>("chat");
  const [logoImage, setLogoImage] = useState<{ name: string; href: string } | null>(null);
  const [logoError, setLogoError] = useState("");
  const [caption, setCaption] = useState("Scan to chat on WhatsApp");
  const [pngSize, setPngSize] = useState(1024);
  const fileInput = useRef<HTMLInputElement>(null);

  const { digits, error } = parsePhone(phone);
  const link = digits ? waLink(digits, message) : "";
  const logoHref = logoChoice === "image" ? logoImage?.href ?? "" : "";
  const qr = useMemo(() => {
    // An "image" choice without an uploaded file yet previews without a logo.
    const logo: QrLogo = logoChoice === "chat" ? { kind: "chat" } : logoHref ? { kind: "image", href: logoHref } : { kind: "none" };
    return buildQrSvg(link || EXAMPLE_LINK, { fg, bg, style, logo, caption });
  }, [link, fg, bg, style, logoChoice, logoHref, caption]);
  const warning = contrastWarning(fg, bg);

  function chooseLogo(choice: LogoChoice) {
    setLogoChoice(choice);
    setLogoError("");
    if (choice === "image" && !logoImage) fileInput.current?.click();
  }

  function onLogoFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(file.type)) return setLogoError("Use a PNG, JPG, WebP or SVG image.");
    if (file.size > MAX_LOGO_BYTES) return setLogoError("That image is over 1 MB. Try a smaller file.");
    const reader = new FileReader();
    reader.onload = () => {
      setLogoImage({ name: file.name, href: String(reader.result) });
      setLogoChoice("image");
      setLogoError("");
    };
    reader.onerror = () => setLogoError("Couldn't read that file. Try another image.");
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    setLogoImage(null);
    setLogoChoice("none");
  }

  async function downloadPng() {
    if (!link || !qr) return;
    try {
      downloadHref(await qrPngDataUrl(qr, pngSize), `whatsapp-qr-${digits}.png`);
    } catch {
      setLogoError("Couldn't create the PNG with this logo. Try a PNG or JPG logo, or download the SVG.");
    }
  }

  function downloadSvg() {
    if (!link || !qr) return;
    const url = URL.createObjectURL(new Blob([sizedSvg(qr, 1024)], { type: "image/svg+xml" }));
    downloadHref(url, `whatsapp-qr-${digits}.svg`);
    URL.revokeObjectURL(url);
  }

  return <div className={styles.toolCard}>
    <form className={styles.form} onSubmit={(event) => event.preventDefault()} noValidate>
      <ChatFields phone={phone} onPhoneChange={setPhone} phoneError={error} message={message} onMessageChange={setMessage} />

      <fieldset className={styles.design}>
        <legend>Design</legend>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Style</span>
          <Segmented label="Style" value={style} onChange={setStyle} options={[{ value: "square", label: "Square" }, { value: "rounded", label: "Rounded dots" }]} />
        </div>
        <ColorPicker label="Code colour" value={fg} swatches={inks} onChange={setFg} />
        <ColorPicker label="Background" value={bg} swatches={papers} onChange={setBg} />
        {warning && <p className={styles.warning}><AlertTriangle size={15} />{warning}</p>}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Centre logo</span>
          <Segmented label="Centre logo" value={logoChoice} onChange={chooseLogo} options={[{ value: "none", label: "None" }, { value: "chat", label: "Chat icon" }, { value: "image", label: "Your logo" }]} />
          <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden onChange={onLogoFile} />
          {logoChoice === "image" && (logoImage
            ? <div className={styles.fileRow}><ImagePlus size={15} /><span>{logoImage.name}</span><button type="button" onClick={() => fileInput.current?.click()}>Change</button><button type="button" onClick={removeLogo} aria-label="Remove logo"><X size={15} /></button></div>
            : <button type="button" className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`} onClick={() => fileInput.current?.click()}><ImagePlus size={15} />Upload logo</button>)}
          <p className={logoError ? styles.error : styles.hint}>{logoError || "PNG, JPG, WebP or SVG up to 1 MB. Square logos on a transparent background look best."}</p>
        </div>
        <div className={styles.field}>
          <div className={styles.labelRow}><label htmlFor={`${id}-caption`}>Caption <span>(optional)</span></label><span className={styles.counter}>{caption.length}/{MAX_CAPTION}</span></div>
          <input id={`${id}-caption`} className={styles.input} value={caption} maxLength={MAX_CAPTION} placeholder="Scan to chat on WhatsApp" onChange={(event) => setCaption(event.target.value)} />
        </div>
      </fieldset>
    </form>

    <section className={styles.result} aria-labelledby={`${id}-result`}><div className={styles.qrSticky}>
      <div className={styles.labelRow}><h2 id={`${id}-result`} className={styles.resultTitle}>Your WhatsApp QR code</h2>{!link && <span className={styles.badge}>Example</span>}</div>
      {qr ? <div className={`${styles.qrPreview} ${link ? "" : styles.qrExample}`} role="img" aria-label={link ? `QR code that opens a WhatsApp chat with +${digits}` : "Example QR code"} dangerouslySetInnerHTML={{ __html: qr.svg }} />
        : <p className={styles.warning}><AlertTriangle size={15} />This message is too long to fit in a QR code. Shorten it, or remove the logo to make more room.</p>}
      {link ? <>
        <div className={styles.downloadRow}>
          <label className={styles.sizeSelect}><span className={styles.srOnly}>PNG size</span>
            <select value={pngSize} onChange={(event) => setPngSize(Number(event.target.value))}>{PNG_SIZES.map((size) => <option key={size} value={size}>{size} px</option>)}</select>
          </label>
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={downloadPng} disabled={!qr}><Download size={16} />Download PNG</button>
          <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={downloadSvg} disabled={!qr}><Download size={16} />SVG</button>
        </div>
        <p className={styles.hint}>Always test-scan your code with a phone before printing it.</p>
        <div className={styles.linkSection}>
          <span className={styles.fieldLabel}>Link inside the code</span>
          <LinkBox link={link} />
        </div>
      </> : <p className={styles.hint}>Enter your WhatsApp number to download this QR code. Try the design options now; the preview updates as you go.</p>}
    </div></section>
  </div>;
}
