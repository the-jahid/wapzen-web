"use client";

import { SignOutButton, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import { listPhoneNumbers } from "@/lib/phoneNumbers";

import styles from "./AccountBlockedScreen.module.css";
import { WhatsAppGlyph } from "./supportWhatsApp";

// While true, every dashboard page sits behind this notice: nobody can scan a
// QR code, link a number or switch an agent back on. The server keeps every
// agent inactive on its own (migration 00061), so turning this off only hides
// the notice; it does not take any agent live.
export const MAINTENANCE_MODE = false;

const EARLY_ACCESS_URL = `https://wa.me/8801701750469?text=${encodeURIComponent(
  "Hi, I'd like early access to the next Wapzen update.",
)}`;

type Copy = { title: string; body: string; cta: string; signOut: string };

const copy: Record<string, Copy> = {
  en: {
    title: "Wapzen is paused for now",
    body: "The application is stopped while we work on our next update, so your agents are not replying to messages or calls. If you want early access, message us on WhatsApp.",
    cta: "Get early access on WhatsApp",
    signOut: "Sign out",
  },
  ar: {
    title: "تم إيقاف Wapzen مؤقتًا",
    body: "التطبيق متوقف الآن بينما نعمل على التحديث القادم، لذلك لا يرد وكلاؤك على الرسائل أو المكالمات. إذا كنت تريد الوصول المبكر، راسلنا على واتساب.",
    cta: "احصل على الوصول المبكر عبر واتساب",
    signOut: "تسجيل الخروج",
  },
  fr: {
    title: "Wapzen est en pause pour le moment",
    body: "L'application est arrêtée pendant que nous préparons notre prochaine mise à jour : vos agents ne répondent plus aux messages ni aux appels. Si vous souhaitez un accès anticipé, écrivez-nous sur WhatsApp.",
    cta: "Accès anticipé sur WhatsApp",
    signOut: "Se déconnecter",
  },
  es: {
    title: "Wapzen está en pausa por ahora",
    body: "La aplicación está detenida mientras preparamos nuestra próxima actualización, así que tus agentes no responden mensajes ni llamadas. Si quieres acceso anticipado, escríbenos por WhatsApp.",
    cta: "Acceso anticipado por WhatsApp",
    signOut: "Cerrar sesión",
  },
  pt: {
    title: "O Wapzen está pausado por enquanto",
    body: "O aplicativo está parado enquanto preparamos a nossa próxima atualização, por isso os seus agentes não estão respondendo mensagens nem chamadas. Se quiser acesso antecipado, fale conosco no WhatsApp.",
    cta: "Acesso antecipado no WhatsApp",
    signOut: "Sair",
  },
  it: {
    title: "Wapzen è in pausa per ora",
    body: "L'applicazione è ferma mentre lavoriamo al prossimo aggiornamento, quindi i tuoi agenti non rispondono a messaggi e chiamate. Se vuoi l'accesso anticipato, scrivici su WhatsApp.",
    cta: "Accesso anticipato su WhatsApp",
    signOut: "Esci",
  },
  id: {
    title: "Wapzen dijeda untuk sementara",
    body: "Aplikasi dihentikan selagi kami menyiapkan pembaruan berikutnya, jadi agen Anda tidak membalas pesan atau panggilan. Jika Anda ingin akses lebih awal, kirim pesan kepada kami di WhatsApp.",
    cta: "Dapatkan akses awal via WhatsApp",
    signOut: "Keluar",
  },
  hi: {
    title: "Wapzen फ़िलहाल रोका गया है",
    body: "हम अपने अगले अपडेट पर काम कर रहे हैं, इसलिए ऐप अभी बंद है और आपके एजेंट संदेशों या कॉल का जवाब नहीं दे रहे हैं। अगर आप जल्दी एक्सेस चाहते हैं, तो हमें WhatsApp पर मैसेज करें।",
    cta: "WhatsApp पर जल्दी एक्सेस पाएं",
    signOut: "साइन आउट करें",
  },
  bn: {
    title: "Wapzen আপাতত বন্ধ আছে",
    body: "আমরা আমাদের পরবর্তী আপডেটের কাজ করছি, তাই অ্যাপটি এখন বন্ধ এবং আপনার এজেন্টরা মেসেজ বা কলের উত্তর দিচ্ছে না। আগেভাগে ব্যবহারের সুযোগ চাইলে আমাদের WhatsApp-এ মেসেজ করুন।",
    cta: "WhatsApp-এ আর্লি অ্যাক্সেস নিন",
    signOut: "সাইন আউট",
  },
  ur: {
    title: "Wapzen فی الحال روک دیا گیا ہے",
    body: "ہم اپنی اگلی اپ ڈیٹ پر کام کر رہے ہیں، اس لیے ایپ ابھی بند ہے اور آپ کے ایجنٹ پیغامات یا کالز کا جواب نہیں دے رہے۔ اگر آپ جلد رسائی چاہتے ہیں تو ہمیں واٹس ایپ پر پیغام بھیجیں۔",
    cta: "واٹس ایپ پر جلد رسائی حاصل کریں",
    signOut: "سائن آؤٹ",
  },
  si: {
    title: "Wapzen දැනට නවතා ඇත",
    body: "අපි අපගේ ඊළඟ යාවත්කාලීන කිරීම සඳහා වැඩ කරන නිසා යෙදුම දැනට නවතා ඇති අතර, ඔබේ නියෝජිතයන් පණිවිඩ හෝ ඇමතුම්වලට පිළිතුරු නොදේ. ඔබට කලින්ම ප්‍රවේශය අවශ්‍ය නම්, WhatsApp හරහා අපට පණිවිඩයක් එවන්න.",
    cta: "WhatsApp හරහා කලින් ප්‍රවේශය ලබාගන්න",
    signOut: "ඉවත් වන්න",
  },
  tr: {
    title: "Wapzen şimdilik durduruldu",
    body: "Bir sonraki güncellememiz üzerinde çalışırken uygulama durduruldu, bu yüzden ajanlarınız mesajlara ve aramalara yanıt vermiyor. Erken erişim istiyorsanız bize WhatsApp'tan yazın.",
    cta: "WhatsApp'tan erken erişim alın",
    signOut: "Çıkış yap",
  },
  de: {
    title: "Wapzen ist vorübergehend pausiert",
    body: "Die Anwendung ist angehalten, während wir an unserem nächsten Update arbeiten. Deine Agenten beantworten daher keine Nachrichten oder Anrufe. Wenn du frühen Zugang möchtest, schreib uns auf WhatsApp.",
    cta: "Frühen Zugang über WhatsApp",
    signOut: "Abmelden",
  },
};

const rtl = new Set(["ar", "ur"]);

// Same table as the server's languageByCallingCode (middleware/blocked.go),
// plus the languages only this notice speaks.
const languageByCallingCode: Record<string, string> = {
  "20": "ar", "212": "ar", "213": "ar", "216": "ar", "218": "ar", "249": "ar",
  "961": "ar", "962": "ar", "963": "ar", "964": "ar", "965": "ar", "966": "ar",
  "967": "ar", "968": "ar", "970": "ar", "971": "ar", "973": "ar", "974": "ar",
  "33": "fr", "221": "fr", "223": "fr", "225": "fr", "226": "fr", "227": "fr",
  "228": "fr", "229": "fr", "237": "fr", "241": "fr", "242": "fr", "243": "fr",
  "34": "es", "51": "es", "52": "es", "53": "es", "54": "es", "56": "es",
  "57": "es", "58": "es", "502": "es", "503": "es", "504": "es", "505": "es",
  "506": "es", "507": "es", "591": "es", "593": "es", "595": "es", "598": "es",
  "55": "pt", "351": "pt", "244": "pt", "258": "pt",
  "39": "it", "62": "id", "91": "hi", "880": "bn",
  "92": "ur", "94": "si", "90": "tr", "49": "de", "43": "de",
};

function languageForPhone(phone: string | null | undefined): string | null {
  const digits = (phone ?? "").trim().replace(/^\+/, "");
  for (let n = 3; n >= 1; n--) {
    if (digits.length > n && languageByCallingCode[digits.slice(0, n)]) {
      return languageByCallingCode[digits.slice(0, n)];
    }
  }
  return null;
}

// The account's WhatsApp number says more about the person than a browser
// that is often left in English; the browser's own languages are the fallback.
function pickLanguage(hint: string | null): string {
  const candidates = [hint, ...(typeof navigator === "undefined" ? [] : navigator.languages)];
  for (const candidate of candidates) {
    const base = candidate?.toLowerCase().split("-")[0];
    if (base && base in copy) return base;
  }
  return "en";
}

export function MaintenanceScreen() {
  const { getToken, isSignedIn } = useAuth();
  const [hint, setHint] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // navigator.languages only exists in the browser, so the first render
    // (which must match the server's) waits for this.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!MAINTENANCE_MODE || !isSignedIn) return;
    let cancelled = false;
    listPhoneNumbers(getToken)
      .then((numbers) => {
        const lang = numbers.map((number) => languageForPhone(number.phone_number)).find(Boolean);
        if (!cancelled && lang) setHint(lang);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [getToken, isSignedIn]);

  if (!MAINTENANCE_MODE || !mounted) return null;

  const lang = pickLanguage(hint);
  const text = copy[lang];
  const english = lang === "en" ? null : copy.en;
  const dir = rtl.has(lang) ? "rtl" : "ltr";

  return (
    <div className={styles.backdrop} role="alertdialog" aria-modal="true" aria-labelledby="maintenance-title">
      <div className={styles.card}>
        <div className={`${styles.icon} ${styles.iconPaused}`} aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M10 9v6M14 9v6" />
          </svg>
        </div>
        <div lang={lang} dir={dir}>
          <h1 id="maintenance-title" className={styles.title}>{text.title}</h1>
          <p className={styles.body}>{text.body}</p>
        </div>
        {english && (
          <div lang="en" dir="ltr" className={styles.secondary}>
            <p className={styles.secondaryTitle}>{english.title}</p>
            <p className={styles.body}>{english.body}</p>
          </div>
        )}
        <div className={styles.actions} dir={dir}>
          <a className={styles.primary} href={EARLY_ACCESS_URL} target="_blank" rel="noreferrer">
            <WhatsAppGlyph size={16} />
            {text.cta}
          </a>
          <SignOutButton redirectUrl="/">
            <button className={styles.ghost} type="button">{text.signOut}</button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
