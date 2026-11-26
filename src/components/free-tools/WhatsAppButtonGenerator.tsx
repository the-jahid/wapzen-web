"use client";

import { useId, useMemo, useState } from "react";
import { Check, Copy, Moon, Sun } from "lucide-react";
import { ChatFields } from "./ChatFields";
import { ColorPicker, Segmented } from "./Controls";
import { buttonSnippet, previewDocument, type ButtonOptions } from "./buttonSnippet";
import { parsePhone, waLink } from "./whatsapp";
import styles from "./FreeTools.module.css";

const colors = [
  { name: "WhatsApp green", value: "#25D366" },
  { name: "Teal", value: "#128C7E" },
  { name: "Dark green", value: "#075E54" },
  { name: "Blue", value: "#2563EB" },
  { name: "Black", value: "#111B21" },
];

// Until a real number is typed, the preview and snippet use this one so the
// design options can be tried straight away.
const EXAMPLE_NUMBER = "15551234567";

export function WhatsAppButtonGenerator() {
  const id = useId();
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [shape, setShape] = useState<ButtonOptions["shape"]>("label");
  const [label, setLabel] = useState("Chat with us");
  const [side, setSide] = useState<ButtonOptions["side"]>("right");
  const [color, setColor] = useState("#25D366");
  const [popup, setPopup] = useState(true);
  const [popupName, setPopupName] = useState("");
  const [popupStatus, setPopupStatus] = useState("Typically replies within minutes");
  const [popupMessage, setPopupMessage] = useState("Hi there 👋\nHow can we help you?");
  const [popupButton, setPopupButton] = useState("Start chat");
  const [credit, setCredit] = useState(true);
  const [dark, setDark] = useState(false);
  const [copied, setCopied] = useState(false);

  const { digits, error } = parsePhone(phone);
  const link = waLink(digits || EXAMPLE_NUMBER, message);
  const snippet = useMemo(
    () => buttonSnippet({ link, shape, label, side, color, popup, popupName, popupStatus, popupMessage, popupButton, credit }),
    [link, shape, label, side, color, popup, popupName, popupStatus, popupMessage, popupButton, credit],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
    } catch {
      window.prompt("Copy this code:", snippet);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return <div className={styles.toolCard}>
    <form className={styles.form} onSubmit={(event) => event.preventDefault()} noValidate>
      <ChatFields phone={phone} onPhoneChange={setPhone} phoneError={error} message={message} onMessageChange={setMessage} />

      <fieldset className={styles.design}>
        <legend>Button</legend>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Style</span>
          <Segmented label="Button style" value={shape} onChange={setShape} options={[{ value: "label", label: "Icon + text" }, { value: "round", label: "Round icon" }]} />
        </div>
        {shape === "label" && <div className={styles.field}>
          <label htmlFor={`${id}-label`}>Button text</label>
          <input id={`${id}-label`} className={styles.input} maxLength={30} value={label} onChange={(event) => setLabel(event.target.value)} />
        </div>}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Position</span>
          <Segmented label="Position" value={side} onChange={setSide} options={[{ value: "right", label: "Bottom right" }, { value: "left", label: "Bottom left" }]} />
        </div>
        <ColorPicker label="Colour" value={color} swatches={colors} onChange={setColor} />
      </fieldset>

      <fieldset className={styles.design}>
        <legend>Chat popup</legend>
        <label className={styles.checkRow}><input type="checkbox" checked={popup} onChange={(event) => setPopup(event.target.checked)} />Show a chat popup before opening WhatsApp</label>
        {popup && <>
          <div className={styles.field}>
            <label htmlFor={`${id}-name`}>Business or team name</label>
            <input id={`${id}-name`} className={styles.input} maxLength={40} value={popupName} placeholder="Chat with us" onChange={(event) => setPopupName(event.target.value)} />
          </div>
          <div className={styles.field}>
            <label htmlFor={`${id}-status`}>Status line <span>(optional)</span></label>
            <input id={`${id}-status`} className={styles.input} maxLength={50} value={popupStatus} onChange={(event) => setPopupStatus(event.target.value)} />
          </div>
          <div className={styles.field}>
            <label htmlFor={`${id}-welcome`}>Welcome message</label>
            <textarea id={`${id}-welcome`} className={`${styles.input} ${styles.textarea}`} rows={3} maxLength={200} value={popupMessage} onChange={(event) => setPopupMessage(event.target.value)} />
          </div>
          <div className={styles.field}>
            <label htmlFor={`${id}-go`}>Chat button text</label>
            <input id={`${id}-go`} className={styles.input} maxLength={30} value={popupButton} onChange={(event) => setPopupButton(event.target.value)} />
          </div>
          <label className={styles.checkRow}><input type="checkbox" checked={credit} onChange={(event) => setCredit(event.target.checked)} />Show a small &ldquo;Free WhatsApp button by Wapzen&rdquo; link</label>
        </>}
      </fieldset>
    </form>

    <section className={styles.result} aria-labelledby={`${id}-result`}>
      <div className={styles.qrSticky}>
        <div className={styles.labelRow}>
          <h2 id={`${id}-result`} className={styles.resultTitle}>Live preview {!digits && <span className={styles.badge}>Example number</span>}</h2>
          <button type="button" className={styles.textButton} onClick={() => setDark(!dark)} aria-label={dark ? "Preview on a light page" : "Preview on a dark page"}>{dark ? <Sun size={14} /> : <Moon size={14} />}</button>
        </div>
        <iframe className={styles.buttonPreview} title="Preview of the WhatsApp button on a web page" srcDoc={previewDocument(snippet, dark)} sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox" />
        <p className={styles.hint}>{popup ? "Click the button in the preview to open the popup." : "Click the button in the preview to test the chat."}</p>
        <textarea className={`${styles.input} ${styles.linkInput} ${styles.codeBox}`} value={snippet} readOnly rows={6} aria-label="Button HTML code" onFocus={(event) => event.target.select()} />
        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={copy} disabled={!digits}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copied!" : "Copy code"}</button>
        <p className={styles.hint}>{digits ? "Paste the code just before </body> on every page, or into your site builder's custom code or footer box." : "Enter your WhatsApp number to copy the code. Until then the preview uses an example number."}</p>
        <p className={styles.srOnly} aria-live="polite">{copied ? "Code copied to clipboard" : ""}</p>
      </div>
    </section>
  </div>;
}
