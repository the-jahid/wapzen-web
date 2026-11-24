"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// The "how to link your WhatsApp number" walkthrough, shared by the chat and
// voice agents' link-a-number cards. Desktop gets the landscape video; phones
// and tablets get the Short.
const SETUP_VIDEO_ID = "sVzHeUp6Pho";
const SETUP_SHORT_ID = "Lj6yex0_PXw";

const videoCSS = `
.chat-number-video-btn{align-items:center;background:transparent;border:1px solid var(--border,var(--app-border));border-radius:999px;color:var(--subtle,var(--app-subtle));cursor:pointer;display:none;flex:none;font-size:12px;font-weight:700;gap:6px;height:32px;padding:0 12px 0 10px;white-space:nowrap}
.chat-number-video-btn:hover{border-color:var(--app-primary-ring,var(--app-primary));color:var(--text,var(--app-text))}
.chat-number-video-btn svg{color:#ff3d3d;flex:none}
@media(min-width:901px){.chat-number-video-btn.is-desktop{display:inline-flex}}
@media(max-width:900px){.chat-number-video-btn.is-mobile{display:inline-flex}}
.chat-video-overlay{align-items:center;animation:chat-video-fade .16s ease;backdrop-filter:blur(3px);background:rgba(0,0,0,.72);display:flex;inset:0;justify-content:center;padding:32px;position:fixed;z-index:200}
.chat-video-box{display:grid;gap:10px;width:min(960px,100%)}
.chat-video-close{background:transparent;border:1px solid rgba(255,255,255,.3);border-radius:8px;color:#fff;cursor:pointer;font-size:12px;font-weight:700;justify-self:end;padding:5px 11px}
.chat-video-box.is-vertical{width:min(420px,100%,calc((100dvh - 110px) * 9 / 16))}
.chat-video-frame{aspect-ratio:16/9;background:#000;border:0;border-radius:12px;width:100%}
.chat-video-box.is-vertical .chat-video-frame{aspect-ratio:9/16}
@media(max-width:900px){.chat-video-overlay{padding:16px}}
@keyframes chat-video-fade{from{opacity:0}to{opacity:1}}
`;

/** Small "Watch video" pill that opens the setup walkthrough in a lightbox.
    `vertical` is the phone/tablet pill (shown up to 900px), the default the
    desktop one; render both and CSS shows the right one. Portalled to <body>
    so a dialog's own stacking or transform can't clip it. */
export default function SetupVideoButton({ vertical = false }: { vertical?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: videoCSS }} />
      <button
        className={`chat-number-video-btn ${vertical ? "is-mobile" : "is-desktop"}`}
        onClick={() => setOpen(true)}
        title="Watch how to link your number"
        type="button"
      >
        <svg aria-hidden="true" height="13" viewBox="0 0 24 24" width="13">
          <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8Z" fill="currentColor" />
          <path d="m9.75 15.02 5.75-3.02-5.75-3.02v6.04Z" fill="#fff" />
        </svg>
        Watch video
      </button>
      {open
        ? createPortal(
            <div
              aria-label="How to link your WhatsApp number"
              aria-modal="true"
              className="chat-video-overlay"
              onClick={() => setOpen(false)}
              role="dialog"
            >
              <div className={`chat-video-box${vertical ? " is-vertical" : ""}`} onClick={(e) => e.stopPropagation()}>
                <button className="chat-video-close" onClick={() => setOpen(false)} type="button">
                  Close ✕
                </button>
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="chat-video-frame"
                  referrerPolicy="strict-origin-when-cross-origin"
                  src={`https://www.youtube.com/embed/${vertical ? SETUP_SHORT_ID : SETUP_VIDEO_ID}?autoplay=1&rel=0&playsinline=1`}
                  title="How to link your WhatsApp number"
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
