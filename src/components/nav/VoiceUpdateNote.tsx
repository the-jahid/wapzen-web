import styles from "./VoiceUpdateNote.module.css";
import { VOICE_EARLY_ACCESS_WHATSAPP_URL, WhatsAppGlyph } from "./supportWhatsApp";

// Voice agents are not served while the next update is built, so the voice
// pages show this in place of the API error they would otherwise print.
export function VoiceUpdateNote() {
  return (
    <div className={styles.note} role="status">
      <p className={styles.title}>Voice agents are coming in our next update</p>
      <p className={styles.body}>
        We are working on the next update for voice. If you want early access, please send us a
        message on WhatsApp.
      </p>
      <a
        className={styles.whatsapp}
        href={VOICE_EARLY_ACCESS_WHATSAPP_URL}
        rel="noopener noreferrer"
        target="_blank"
      >
        <WhatsAppGlyph size={15} />
        Message us on WhatsApp
      </a>
    </div>
  );
}
