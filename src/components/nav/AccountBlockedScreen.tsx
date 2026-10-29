"use client";

import { SignOutButton } from "@clerk/nextjs";
import { useSyncExternalStore } from "react";

import {
  getAccountBlocked,
  getAccountBlockedOnServer,
  subscribeAccountBlocked,
} from "@/lib/accountBlocked";

import styles from "./AccountBlockedScreen.module.css";
import { WhatsAppGlyph } from "./supportWhatsApp";

const SUPPORT_URL = "https://wa.me/8801701750469";

type Copy = { title: string; body: string; support: string; signOut: string };

const copy: Record<string, Copy> = {
  en: {
    title: "Your account has been blocked",
    body: "You can no longer use the dashboard, and your agents have stopped replying to messages and answering calls. If you think this is a mistake, please contact support.",
    support: "Contact support",
    signOut: "Sign out",
  },
  ar: {
    title: "تم حظر حسابك",
    body: "لم يعد بإمكانك استخدام لوحة التحكم، وقد توقف وكلاؤك عن الرد على الرسائل والمكالمات. إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الدعم.",
    support: "تواصل مع الدعم",
    signOut: "تسجيل الخروج",
  },
  fr: {
    title: "Votre compte a été bloqué",
    body: "Vous ne pouvez plus utiliser le tableau de bord, et vos agents ne répondent plus aux messages ni aux appels. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le support.",
    support: "Contacter le support",
    signOut: "Se déconnecter",
  },
  es: {
    title: "Tu cuenta ha sido bloqueada",
    body: "Ya no puedes usar el panel y tus agentes han dejado de responder mensajes y llamadas. Si crees que se trata de un error, contacta con soporte.",
    support: "Contactar con soporte",
    signOut: "Cerrar sesión",
  },
  pt: {
    title: "Sua conta foi bloqueada",
    body: "Você não pode mais usar o painel, e seus agentes pararam de responder mensagens e chamadas. Se você acha que isso é um erro, entre em contato com o suporte.",
    support: "Falar com o suporte",
    signOut: "Sair",
  },
  it: {
    title: "Il tuo account è stato bloccato",
    body: "Non puoi più usare la dashboard e i tuoi agenti hanno smesso di rispondere a messaggi e chiamate. Se pensi che si tratti di un errore, contatta l'assistenza.",
    support: "Contatta l'assistenza",
    signOut: "Esci",
  },
  id: {
    title: "Akun Anda telah diblokir",
    body: "Anda tidak dapat lagi menggunakan dasbor, dan agen Anda telah berhenti membalas pesan dan menjawab panggilan. Jika menurut Anda ini adalah kesalahan, silakan hubungi dukungan.",
    support: "Hubungi dukungan",
    signOut: "Keluar",
  },
  hi: {
    title: "आपका खाता ब्लॉक कर दिया गया है",
    body: "अब आप डैशबोर्ड का उपयोग नहीं कर सकते, और आपके एजेंटों ने संदेशों और कॉल का जवाब देना बंद कर दिया है। अगर आपको लगता है कि यह गलती है, तो कृपया सपोर्ट से संपर्क करें।",
    support: "सपोर्ट से संपर्क करें",
    signOut: "साइन आउट करें",
  },
  bn: {
    title: "আপনার অ্যাকাউন্ট ব্লক করা হয়েছে",
    body: "আপনি আর ড্যাশবোর্ড ব্যবহার করতে পারবেন না, এবং আপনার এজেন্টরা মেসেজ ও কলের উত্তর দেওয়া বন্ধ করে দিয়েছে। আপনার যদি মনে হয় এটি ভুল, অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন।",
    support: "সাপোর্টে যোগাযোগ করুন",
    signOut: "সাইন আউট",
  },
};

const rtl = new Set(["ar"]);

// The server's hint comes from the account's WhatsApp number, which says more
// about the person than a browser that is often left in English; the browser's
// own languages are the fallback.
function pickLanguage(hint: string | null): string {
  const candidates = [hint, ...(typeof navigator === "undefined" ? [] : navigator.languages)];
  for (const candidate of candidates) {
    const base = candidate?.toLowerCase().split("-")[0];
    if (base && base in copy) return base;
  }
  return "en";
}

export function AccountBlockedScreen() {
  const { blocked, lang: hint } = useSyncExternalStore(
    subscribeAccountBlocked,
    getAccountBlocked,
    getAccountBlockedOnServer,
  );
  if (!blocked) return null;

  const lang = pickLanguage(hint);
  const text = copy[lang];
  const english = lang === "en" ? null : copy.en;

  return (
    <div className={styles.backdrop} role="alertdialog" aria-modal="true" aria-labelledby="account-blocked-title">
      <div className={styles.card}>
        <div className={styles.icon} aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M5.6 5.6l12.8 12.8" />
          </svg>
        </div>
        <div lang={lang} dir={rtl.has(lang) ? "rtl" : "ltr"}>
          <h1 id="account-blocked-title" className={styles.title}>{text.title}</h1>
          <p className={styles.body}>{text.body}</p>
        </div>
        {english && (
          <div lang="en" dir="ltr" className={styles.secondary}>
            <p className={styles.secondaryTitle}>{english.title}</p>
            <p className={styles.body}>{english.body}</p>
          </div>
        )}
        <div className={styles.actions} dir={rtl.has(lang) ? "rtl" : "ltr"}>
          <a className={styles.primary} href={SUPPORT_URL} target="_blank" rel="noreferrer">
            <WhatsAppGlyph size={16} />
            {text.support}
          </a>
          <SignOutButton redirectUrl="/">
            <button className={styles.ghost} type="button">{text.signOut}</button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
