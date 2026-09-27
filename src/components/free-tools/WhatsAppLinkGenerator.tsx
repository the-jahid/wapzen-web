"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, QrCode } from "lucide-react";
import { ChatFields } from "./ChatFields";
import { LinkBox } from "./LinkBox";
import { buildQrSvg, defaultQrDesign, qrPngDataUrl, sizedSvg } from "./qrSvg";
import { downloadHref, parsePhone, waLink } from "./whatsapp";
import styles from "./FreeTools.module.css";

export function WhatsAppLinkGenerator() {
  const id = useId();
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const { digits, error } = parsePhone(phone);
  const link = digits ? waLink(digits, message) : "";
  const qr = useMemo(() => (link ? buildQrSvg(link, defaultQrDesign) : null), [link]);

  async function downloadPng() {
    if (qr) downloadHref(await qrPngDataUrl(qr, 1024), `whatsapp-qr-${digits}.png`);
  }

  function downloadSvg() {
    if (!qr) return;
    const url = URL.createObjectURL(new Blob([sizedSvg(qr, 1024)], { type: "image/svg+xml" }));
    downloadHref(url, `whatsapp-qr-${digits}.svg`);
    URL.revokeObjectURL(url);
  }

  return <div className={styles.toolCard}>
    <form className={styles.form} onSubmit={(event) => event.preventDefault()} noValidate>
      <ChatFields phone={phone} onPhoneChange={setPhone} phoneError={error} message={message} onMessageChange={setMessage} />
    </form>

    <section className={styles.result} aria-labelledby={`${id}-result`}>
      <h2 id={`${id}-result`} className={styles.resultTitle}>Your WhatsApp link</h2>
      {link ? <>
        <LinkBox link={link} />
        {qr ? <div className={styles.qrBox}>
          {/* The SVG is built from escaped, validated input in qrSvg.ts. */}
          <div className={styles.qr} role="img" aria-label={`QR code that opens a WhatsApp chat with +${digits}`} dangerouslySetInnerHTML={{ __html: qr.svg }} />
          <div className={styles.qrCopy}>
            <strong>QR code</strong>
            <p>Scanning it opens this chat. Print it on flyers, packaging or your shop window.</p>
            <div className={styles.qrActions}>
              <button type="button" className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`} onClick={downloadPng}><Download size={15} />PNG</button>
              <button type="button" className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSmall}`} onClick={downloadSvg}><Download size={15} />SVG</button>
            </div>
            <Link href="/tools/whatsapp-qr-code-generator" className={styles.inlineLink}>Add colours, a logo or a caption<ArrowRight size={14} /></Link>
          </div>
        </div> : <p className={styles.hint}>This message is too long to fit in a QR code. The link still works; shorten the message to get a QR code.</p>}
      </> : <div className={styles.empty}>
        <QrCode size={34} strokeWidth={1.4} />
        <p>Enter a WhatsApp number with its country code, and your link and QR code appear here.</p>
      </div>}
    </section>
  </div>;
}
