"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import type { ApiPhoneNumber } from "@/lib/phoneNumbers";

// libphonenumber is ~115 KB, and only linking a number by code needs it. It is
// fetched when a form that takes a number appears (usePhoneNumberLib), so the
// pages around that form (an agent with a number already, the numbers list)
// don't download it, and it is in by the time anyone has typed a number.
type PhoneNumberLib = typeof import("libphonenumber-js/min");

let phoneNumberLib: PhoneNumberLib | null = null;
let phoneNumberLibLoad: Promise<PhoneNumberLib | null> | null = null;
const phoneNumberLibListeners = new Set<() => void>();

// Resolves to null if the download fails (offline, a stale deploy); callers
// then take the number as typed, as they do with one the library can't parse.
function loadPhoneNumberLib(): Promise<PhoneNumberLib | null> {
  phoneNumberLibLoad ??= import("libphonenumber-js/min").then(
    (lib) => {
      phoneNumberLib = lib;
      phoneNumberLibListeners.forEach((notify) => notify());
      return lib;
    },
    () => {
      phoneNumberLibLoad = null; // The next form to appear tries again.
      return null;
    }
  );
  return phoneNumberLibLoad;
}

function subscribePhoneNumberLib(onLoad: () => void) {
  phoneNumberLibListeners.add(onLoad);
  return () => {
    phoneNumberLibListeners.delete(onLoad);
  };
}

/**
 * Starts fetching libphonenumber (once `load` is true), and re-renders with it
 * once it is in.
 */
export function usePhoneNumberLib(load = true): PhoneNumberLib | null {
  useEffect(() => {
    if (load) void loadPhoneNumberLib();
  }, [load]);
  return useSyncExternalStore(subscribePhoneNumberLib, () => phoneNumberLib, () => null);
}

// WhatsApp closes a login's socket when its QR codes run out — 60s, then five
// more of 20s — and a pairing code dies with it.
const CODE_LIFETIME_MS = 160_000;

// The pairing countdown turns red with this long left: about what it takes to
// find Linked devices and type 8 characters.
const CODE_ENDING_MS = 30_000;

// A phone can't scan its own screen. Someone on a touch-first, phone-width
// screen almost certainly has WhatsApp on that same device, so the code form is
// what they see first.
const PHONE_QUERY = "(pointer: coarse) and (max-width: 820px)";
const TOUCH_QUERY = "(pointer: coarse)";

// Chrome's "Desktop site" on a phone widens the page past any width query and
// reports a desktop user agent, but the screen keeps a phone's short side —
// tablets start around 600px.
const PHONE_SCREEN_SHORT_SIDE = 600;

function subscribePhoneQuery(onChange: () => void) {
  const queries = [window.matchMedia(PHONE_QUERY), window.matchMedia(TOUCH_QUERY)];
  for (const query of queries) query.addEventListener("change", onChange);
  return () => {
    for (const query of queries) query.removeEventListener("change", onChange);
  };
}

function isPhoneScreen() {
  if (window.matchMedia(PHONE_QUERY).matches) return true;
  return (
    window.matchMedia(TOUCH_QUERY).matches &&
    Math.min(window.screen.width, window.screen.height) < PHONE_SCREEN_SHORT_SIDE
  );
}

// The setup cards ask this before starting a login: a phone gets no QR login
// unless asked for one, only the number form.
export function useIsPhone() {
  return useSyncExternalStore(subscribePhoneQuery, isPhoneScreen, () => false);
}

// normalizePhone turns what people type ("+880 1639-726992", "8801639726992")
// into E.164, or explains what is missing. A leading 0 is a local number, which
// WhatsApp can't resolve without the country code. It waits for libphonenumber,
// which a form has normally fetched long before it is submitted.
export async function normalizePhone(value: string): Promise<{ phone: string } | { error: string }> {
  const compact = value.replace(/[\s().-]/g, "");
  if (!compact) return { error: "Enter the WhatsApp number on your phone." };
  const digits = compact.startsWith("+") ? compact.slice(1) : compact.replace(/^00/, "");
  if (!/^\d+$/.test(digits)) return { error: "Use digits only, starting with your country code." };
  if (digits.startsWith("0")) return { error: "Add your country code first, for example +880 or +1." };
  if (digits.length < 7 || digits.length > 15) return { error: "That number looks too short or too long." };
  // A local 0 kept after the country code (+880 01639…) is a different number,
  // and WhatsApp gives out a code for it that no phone can use. This only ever
  // corrects: it calls some working numbers invalid, so those go through as typed.
  const lib = await loadPhoneNumberLib();
  try {
    const parsed = lib?.parsePhoneNumberFromString(`+${digits}`);
    return { phone: parsed?.isValid() ? parsed.number : `+${digits}` };
  } catch {
    return { phone: `+${digits}` };
  }
}

function formatCountdown(ms: number) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// WhatsAppLinkHelp lays out the two ways to link a number, side by side where
// there's room: get an 8-character code to type into WhatsApp › Linked devices ›
// Link with phone number instead, or scan the page's QR code (qr, left out when
// the screen can't use one). The code comes first because it links far more
// often. Once a code is out it shows that code alone.
//
// onRequestCode starts that login (it replaces the QR login, so the page must
// swap in the login it returns) and throws with a message to show on failure.
// onRequestQr is the same in the other direction, from a code back to a scan.
export function WhatsAppLinkHelp({
  disabled = false,
  login,
  onRequestCode,
  onRequestQr,
  qr,
}: {
  disabled?: boolean;
  login: ApiPhoneNumber | null;
  onRequestCode: (phone: string) => Promise<void>;
  onRequestQr: () => Promise<void>;
  qr: ReactNode;
}) {
  const isPhone = useIsPhone();
  const phoneNumberLib = usePhoneNumberLib();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [isRequestingQr, setIsRequestingQr] = useState(false);
  // When this page last got a code: the countdown's fallback for a server that
  // doesn't say how long the code has left.
  const [issuedAt, setIssuedAt] = useState<number | null>(null);
  // The code on screen replaced an earlier one, which no longer works.
  const [resent, setResent] = useState(false);

  // How many logins this card has shown. A second one means the first ran out
  // unscanned — or the phone refused it — so the help leads with what to try.
  const loginId = login?.id ?? null;
  const [seen, setSeen] = useState({ id: loginId, count: loginId ? 1 : 0 });
  if (seen.id !== loginId) {
    setSeen({ id: loginId, count: loginId ? seen.count + 1 : seen.count });
  }
  const isRetry = seen.count > 1;

  const pairingCode = login?.status === "pending_qr" ? login.pairing_code ?? null : null;
  const qrCode = login?.status === "pending_qr" && !pairingCode ? login.qr_code ?? null : null;
  const qrExpiresIn = qrCode ? login?.qr_expires_in_ms ?? null : null;
  const [qrLeft, setQrLeft] = useState<number | null>(null);

  // Every poll brings a fresh reading of the code's remaining life, so the
  // countdown is re-anchored to it rather than drifting from the first one.
  useEffect(() => {
    if (qrExpiresIn === null) return;
    const deadline = Date.now() + qrExpiresIn;
    const tick = () => setQrLeft(Math.max(0, deadline - Date.now()));
    const interval = window.setInterval(tick, 250);
    tick();
    return () => window.clearInterval(interval);
  }, [qrCode, qrExpiresIn]);

  // The pairing code's countdown, re-anchored to each poll the same way.
  const codeExpiresIn = pairingCode ? login?.pairing_expires_in_ms ?? null : null;
  const codeDeadlineKnown = codeExpiresIn !== null || issuedAt !== null;
  const [codeLeft, setCodeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!pairingCode) return;
    const deadline =
      codeExpiresIn !== null ? Date.now() + codeExpiresIn : issuedAt !== null ? issuedAt + CODE_LIFETIME_MS : null;
    if (deadline === null) return;
    const tick = () => setCodeLeft(Math.max(0, deadline - Date.now()));
    const interval = window.setInterval(tick, 250);
    tick();
    return () => window.clearInterval(interval);
  }, [pairingCode, codeExpiresIn, issuedAt]);

  async function requestCode(value: string) {
    // Busy from the first moment, so a second press while libphonenumber is
    // still arriving can't ask for two codes.
    setIsRequesting(true);
    const normalized = await normalizePhone(value);
    if ("error" in normalized) {
      setError(normalized.error);
      setIsRequesting(false);
      return;
    }
    setPhone(normalized.phone);
    setError("");
    setResent(false);
    try {
      await onRequestCode(normalized.phone);
      setIssuedAt(Date.now());
      setResent(Boolean(pairingCode));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not get a code. Try again.");
    } finally {
      setIsRequesting(false);
    }
  }

  async function requestQr() {
    setError("");
    setResent(false);
    setIsRequestingQr(true);
    try {
      await onRequestQr();
      // Waiting in the number form, to correct it or come back to a code.
      setPhone(login?.phone_number || phone);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not get a QR code. Try again.");
    } finally {
      setIsRequestingQr(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isRequesting && !disabled) void requestCode(phone);
  }

  if (pairingCode) {
    const remaining = codeDeadlineKnown ? codeLeft : null;
    const expired = remaining !== null && remaining <= 0;
    const number = login?.phone_number || phone;
    const canSwitch = !disabled && !isRequesting && !isRequestingQr;
    const canRenew = canSwitch && Boolean(number);
    const renew = () => void requestCode(number);
    const parsedNumber = number ? phoneNumberLib?.parsePhoneNumberFromString(number) : undefined;
    const shownNumber = parsedNumber?.formatInternational() ?? number;
    const half = Math.ceil(pairingCode.length / 2);
    const codeHalves = [pairingCode.slice(0, half), pairingCode.slice(half)];
    return (
      <div className="wa-link">
        <div className="wa-pair-head">
          <div className="wa-pair-title">Enter code on phone</div>
          <div className="wa-pair-account">
            Linking WhatsApp account <b>{shownNumber || "your number"}</b> (
            <button
              className="wa-pair-inline-link"
              disabled={!canSwitch}
              onClick={() => void requestQr()}
              type="button"
            >
              edit
            </button>
            )
          </div>
        </div>
        <div className="wa-pair-links">
          <button className="wa-pair-link" disabled={!canSwitch} onClick={() => void requestQr()} type="button">
            {isRequestingQr ? "Getting a QR code…" : "Log in with QR code"}
            <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 24 24" width="14">
              <path d="m9 6 6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </button>
          <button
            className={`wa-pair-link${expired ? " is-strong" : ""}`}
            disabled={!canRenew}
            onClick={renew}
            type="button"
          >
            {isRequesting ? "Sending a new code…" : "Send a new code"}
          </button>
        </div>
        <div
          className={`wa-pair-code${expired ? " is-expired" : ""}`}
          aria-label={`Pairing code ${pairingCode.split("").join(" ")}`}
          role="img"
        >
          {codeHalves.map((part, partIndex) => (
            <span className="wa-pair-code-group" key={partIndex}>
              {partIndex > 0 ? <span className="wa-pair-code-dash" aria-hidden="true">-</span> : null}
              {part.split("").map((char, index) => (
                <span className="wa-pair-code-box" aria-hidden="true" key={index}>
                  {char}
                </span>
              ))}
            </span>
          ))}
        </div>
        {remaining === null ? (
          <div className="wa-link-timer" role="timer">
            <span>The code works for about 2 minutes — enter it right away.</span>
          </div>
        ) : (
          <div className={`wa-link-timer${remaining <= CODE_ENDING_MS ? " is-ending" : ""}`} role="timer">
            <span>{expired ? "This code has expired." : `Code expires in ${formatCountdown(remaining)}`}</span>
            <span className="wa-link-timer-track" aria-hidden="true">
              <span style={{ transform: `scaleX(${Math.min(1, remaining / CODE_LIFETIME_MS)})` }} />
            </span>
          </div>
        )}
        {resent ? (
          <div className="wa-link-sent" role="status">
            New code sent. Type this one — the last code no longer works.
          </div>
        ) : null}
        {error ? <div className="wa-link-error">{error}</div> : null}
        <ol className="wa-pair-steps">
          <li>
            Open <b>WhatsApp</b> <WhatsAppIcon /> on your phone
          </li>
          <li>
            On Android tap <b>Menu</b> <MenuIcon /> · On iPhone tap <b>Settings</b> <SettingsIcon />
          </li>
          <li>
            Tap <b>Linked devices</b>, then <b>Link device</b>
          </li>
          <li>
            Tap <b>Link with phone number instead</b> and enter this code on your phone
          </li>
        </ol>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </div>
    );
  }

  // Only the first code outlives 20s, so a reading above that is the first.
  const qrLifetime = qrExpiresIn !== null && qrExpiresIn > 20_000 ? 60_000 : 20_000;

  return (
    <div className="wa-link">
      <div className={`wa-link-options${qr ? " has-qr" : ""}`}>
        <section aria-label="Use a pairing code" className="wa-link-option wa-link-option-code">
          <div className="wa-link-option-head">
            {qr ? <span className="wa-link-option-num">1</span> : null}
            Use a pairing code
          </div>
          {isPhone ? (
            <p className="wa-link-note">
              <b>On your phone?</b> It can&rsquo;t scan its own screen. Enter the number below and WhatsApp
              gives you a code to type in — no scan needed.
            </p>
          ) : (
            <p className="wa-link-note">
              No camera needed. Enter the number and WhatsApp gives you an 8-character code to type on your
              phone.
            </p>
          )}
          <form className="wa-link-form" noValidate onSubmit={onSubmit}>
            <label className="wa-link-label" htmlFor="wa-link-phone">
              WhatsApp number, with country code
            </label>
            <div className="wa-link-row">
              <input
                autoComplete="tel"
                className="wa-link-input"
                disabled={disabled || isRequesting}
                id="wa-link-phone"
                inputMode="tel"
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+880 1XXX XXXXXX"
                type="tel"
                value={phone}
              />
              <button className="wa-link-btn" disabled={disabled || isRequesting} type="submit">
                {isRequesting ? "Getting…" : "Get code"}
              </button>
            </div>
            {error ? <div className="wa-link-error">{error}</div> : null}
          </form>
        </section>

        {qr ? (
          <section aria-label="Scan a QR code" className="wa-link-option wa-link-option-qr">
            <div className="wa-link-option-head">
              <span className="wa-link-option-num">2</span>
              Scan a QR code
            </div>
            <div className="wa-link-qr">{qr}</div>
            {qrExpiresIn !== null && qrLeft !== null ? (
              <div className={`wa-link-timer${qrLeft <= 5_000 ? " is-ending" : ""}`} role="timer">
                <span>{qrLeft > 0 ? `New code in ${formatCountdown(qrLeft)}` : "Getting a new code…"}</span>
                <span className="wa-link-timer-track" aria-hidden="true">
                  <span style={{ transform: `scaleX(${Math.min(1, qrLeft / qrLifetime)})` }} />
                </span>
              </div>
            ) : null}
          </section>
        ) : null}

        {/* Beside the tall QR these fill the space under the short form; stacked,
            they follow the QR they explain. */}
        {qr ? (
          <div className="wa-link-scan-steps">
            <div className="wa-link-steps-title">How to scan the QR code</div>
            <ol className="wa-link-steps wa-link-steps-big">
              <li>
                Open <b>WhatsApp</b> on your phone.
              </li>
              <li>
                Tap <b>Settings</b> (iPhone) or <b>⋮ Menu</b> (Android) › <b>Linked devices</b> ›{" "}
                <b>Link a device</b>.
              </li>
              <li>
                Point the phone&rsquo;s camera at the <b>QR code</b>.
              </li>
            </ol>
          </div>
        ) : null}
      </div>

      {qr && !isPhone ? (
        <details className="wa-link-trouble" open={isRetry}>
          <summary>Scan not working?</summary>
          <ul>
            <li>
              <b>Phone shows an error?</b> WhatsApp links at most 4 devices. Open <b>Linked devices</b>,
              log out one you no longer use, then scan again.
            </li>
            <li>Update WhatsApp on the phone — an old version can refuse new links.</li>
            <li>Camera won&rsquo;t read it? Make this window bigger, or hold the phone a little further back.</li>
          </ul>
        </details>
      ) : null}
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </div>
  );
}

// Small inline pictures of what to tap, so the steps can be followed by eye.
function WhatsAppIcon() {
  return (
    <span className="wa-pair-icon is-whatsapp" aria-hidden="true">
      <svg fill="none" height="14" viewBox="0 0 24 24" width="14">
        <path
          d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M9.2 8.3c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.3.6.8 1.2 1.3 1.6.6.5 1.1.7 1.5.9.2.1.4 0 .5-.1l.6-.8c.2-.2.4-.2.6-.1l1.5.7c.2.1.4.2.4.4 0 .5-.1 1.1-.5 1.4-.5.4-1.3.7-2.2.5-1-.2-2.4-.8-3.7-2-1.4-1.3-2.2-2.7-2.4-3.6-.2-.9.1-1.7.4-2.2Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

function MenuIcon() {
  return (
    <span className="wa-pair-icon" aria-hidden="true">
      <svg height="14" viewBox="0 0 24 24" width="14">
        <circle cx="12" cy="5.5" fill="currentColor" r="1.8" />
        <circle cx="12" cy="12" fill="currentColor" r="1.8" />
        <circle cx="12" cy="18.5" fill="currentColor" r="1.8" />
      </svg>
    </span>
  );
}

function SettingsIcon() {
  return (
    <span className="wa-pair-icon" aria-hidden="true">
      <svg fill="none" height="14" viewBox="0 0 24 24" width="14">
        <path
          d="M10.3 3h3.4l.5 2.4 1.6.9 2.3-.8 1.7 2.9-1.8 1.6v1.9l1.8 1.6-1.7 2.9-2.3-.8-1.6.9-.5 2.4h-3.4l-.5-2.4-1.6-.9-2.3.8-1.7-2.9 1.8-1.6v-1.9L4.2 8.4l1.7-2.9 2.3.8 1.6-.9.5-2.4Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </span>
  );
}

const css = `
.wa-pair-head { display: grid; gap: 4px; }
.wa-pair-title { color: var(--app-text-strong); font-size: clamp(22px, 5vw, 28px); font-weight: 500; line-height: 1.2; }
.wa-pair-account { color: var(--app-text-soft); font-size: 14px; line-height: 1.45; }
.wa-pair-account b { color: var(--app-text-strong); font-weight: 800; }
.wa-pair-inline-link {
  background: none;
  border: 0;
  color: var(--app-primary-text);
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  padding: 0;
}
.wa-pair-inline-link:disabled { cursor: default; opacity: 0.6; }
.wa-pair-code {
  align-items: center;
  background: var(--app-inset);
  border-radius: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 6px;
  padding: 20px 10px;
  user-select: all;
}
.wa-pair-code-group { align-items: center; display: flex; gap: 6px; }
.wa-pair-code-box {
  align-items: center;
  background: var(--app-surface);
  border: 1px solid var(--app-border-strong);
  border-radius: 8px;
  color: var(--app-text-strong);
  display: inline-flex;
  font-size: clamp(16px, 4.5vw, 20px);
  font-weight: 700;
  height: clamp(38px, 10vw, 48px);
  justify-content: center;
  width: clamp(28px, 8vw, 38px);
}
.wa-pair-code-dash { color: var(--app-text-strong); font-size: 20px; font-weight: 700; margin-right: 2px; }
.wa-pair-code.is-expired .wa-pair-code-box { color: var(--app-muted); text-decoration: line-through; }
@container (max-width: 340px) {
  .wa-pair-code-dash { display: none; }
}
.wa-pair-steps { counter-reset: wa-pair; display: grid; list-style: none; margin: 4px 0 0; padding: 0; }
.wa-pair-steps > li {
  align-items: center;
  color: var(--app-text);
  counter-increment: wa-pair;
  display: block;
  font-size: 15px;
  line-height: 1.5;
  min-height: 26px;
  padding: 0 0 20px 40px;
  position: relative;
}
.wa-pair-steps > li:last-child { padding-bottom: 0; }
.wa-pair-steps > li::before {
  align-items: center;
  background: var(--app-surface);
  border: 1.5px solid var(--app-text);
  border-radius: 999px;
  color: var(--app-text);
  content: counter(wa-pair);
  display: flex;
  font-size: 12px;
  font-weight: 600;
  height: 24px;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 24px;
  z-index: 1;
}
.wa-pair-steps > li:not(:last-child)::after {
  background: var(--app-text);
  bottom: -1px;
  content: "";
  left: 12px;
  position: absolute;
  top: 24px;
  width: 1.5px;
}
.wa-pair-steps b { color: var(--app-text-strong); font-weight: 700; }
.wa-pair-icon {
  align-items: center;
  border: 1px solid var(--app-border-strong);
  border-radius: 6px;
  color: var(--app-text-soft);
  display: inline-flex;
  height: 22px;
  justify-content: center;
  vertical-align: -5px;
  width: 22px;
}
.wa-pair-icon.is-whatsapp { background: #25d366; border-color: #25d366; color: #fff; }
.wa-pair-links { display: flex; flex-wrap: wrap; gap: 10px 24px; margin: 0; }
.wa-pair-link {
  align-items: center;
  background: none;
  border: 0;
  border-bottom: 2px solid var(--app-primary);
  color: var(--app-text-strong);
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  font-weight: 600;
  gap: 4px;
  padding: 0 0 2px;
}
.wa-pair-link.is-strong { color: var(--app-primary-text); }
.wa-pair-link:disabled { cursor: default; opacity: 0.6; }
.wa-link { container-type: inline-size; display: grid; gap: 10px; min-width: 0; text-align: left; }
/* Side by side when the pane is wide enough for both, stacked when not. */
.wa-link-options { align-items: start; display: grid; gap: 18px; grid-template-columns: minmax(0, 1fr); }
@container (min-width: 518px) {
  .wa-link-options.has-qr {
    grid-template-areas: "code qr" "steps qr";
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: auto 1fr;
  }
  /* Only with the QR: without its template, a named area becomes an empty
     implicit column that pushes the code form sideways. */
  .has-qr > .wa-link-option-code { grid-area: code; }
  .has-qr > .wa-link-option-qr { grid-area: qr; }
  .has-qr > .wa-link-scan-steps { grid-area: steps; }
}
.wa-link-option, .wa-link-scan-steps { display: grid; gap: 10px; min-width: 0; }
.wa-link-option-head {
  align-items: center;
  color: var(--app-text);
  display: flex;
  font-size: 13px;
  font-weight: 800;
  gap: 8px;
}
.wa-link-option-num {
  align-items: center;
  background: var(--app-primary);
  border-radius: 999px;
  color: var(--app-on-accent);
  display: inline-flex;
  flex: none;
  font-size: 11px;
  height: 20px;
  justify-content: center;
  width: 20px;
}
.wa-link-qr { display: grid; justify-items: center; }
.wa-link-qr > * { max-width: 300px; width: 100%; }
.wa-link-steps {
  color: var(--app-muted);
  display: grid;
  font-size: 12.5px;
  gap: 4px;
  line-height: 1.45;
  margin: 0;
  padding-left: 18px;
}
.wa-link-steps b, .wa-link-note b { color: var(--app-text); font-weight: 700; }
.wa-link-btn-pair { display: grid; gap: 8px; grid-template-columns: 1fr 1fr; }
@media (max-width: 380px) { .wa-link-btn-pair { grid-template-columns: 1fr; } }
.wa-link-steps-title { color: var(--app-text); font-size: 13px; font-weight: 800; margin-top: 4px; }
.wa-link-steps-big {
  color: var(--app-text-soft);
  counter-reset: wa-step;
  font-size: 14px;
  gap: 8px;
  list-style: none;
  padding-left: 0;
}
.wa-link-steps-big > li {
  border: 1px solid var(--app-border);
  border-radius: 10px;
  counter-increment: wa-step;
  padding: 10px 12px 10px 46px;
  position: relative;
}
.wa-link-steps-big > li::before {
  align-items: center;
  background: var(--app-primary);
  border-radius: 999px;
  color: var(--app-on-accent);
  content: counter(wa-step);
  display: flex;
  font-size: 13px;
  font-weight: 800;
  height: 24px;
  justify-content: center;
  left: 12px;
  position: absolute;
  top: 9px;
  width: 24px;
}
.wa-link-steps-big b { font-weight: 800; }
.wa-link-step-hint { color: var(--app-muted); display: block; font-size: 12.5px; margin-top: 2px; }
.wa-link-step-code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 0.08em; white-space: nowrap; }
.wa-link-note { color: var(--app-muted); font-size: 12.5px; line-height: 1.45; margin: 0; }
.wa-link-trouble { color: var(--app-muted); font-size: 12.5px; line-height: 1.45; }
.wa-link-trouble summary { color: var(--app-text-soft); cursor: pointer; font-weight: 700; }
.wa-link-trouble ul { display: grid; gap: 4px; margin: 6px 0 0; padding-left: 18px; }
.wa-link-trouble b { color: var(--app-text); font-weight: 700; }
.wa-link-form { display: grid; gap: 6px; }
.wa-link-label { color: var(--app-text-soft); font-size: 12px; font-weight: 700; }
.wa-link-row { display: flex; gap: 8px; min-width: 0; }
.wa-link-input {
  background: var(--app-surface);
  border: 1px solid var(--app-border-strong);
  border-radius: 8px;
  color: var(--app-text);
  flex: 1;
  font-size: 16px;
  min-width: 0;
  padding: 8px 10px;
}
.wa-link-input:focus { border-color: var(--app-primary); box-shadow: 0 0 0 3px var(--app-primary-ring); outline: none; }
.wa-link-btn {
  background: var(--app-primary);
  border: 0;
  border-radius: 8px;
  color: var(--app-on-accent);
  cursor: pointer;
  flex: none;
  font-size: 13px;
  font-weight: 700;
  padding: 0 14px;
}
.wa-link-btn:disabled { cursor: default; opacity: 0.6; }
.wa-link-text-btn {
  background: none;
  border: 0;
  color: var(--app-primary-text);
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 700;
  justify-self: start;
  padding: 0;
  text-align: left;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.wa-link-text-btn:disabled { cursor: default; opacity: 0.6; }
.wa-link-error { color: var(--app-rose-text); font-size: 12.5px; line-height: 1.4; }
.wa-link-code {
  background: var(--app-inset);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  color: var(--app-text-strong);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: clamp(24px, 7vw, 32px);
  font-weight: 800;
  letter-spacing: 0.12em;
  padding: 16px 8px;
  text-align: center;
  user-select: all;
}
.wa-link-code.is-expired { color: var(--app-muted); text-decoration: line-through; }
.wa-link-btn-wide { justify-self: stretch; padding: 10px 14px; }
.wa-link-btn-quiet {
  background: none;
  border: 1px solid var(--app-border-strong);
  color: var(--app-text);
}
.wa-link-sent { color: var(--app-primary-text); font-size: 12.5px; line-height: 1.4; }
.wa-link-timer {
  color: var(--app-text-soft);
  display: grid;
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  gap: 6px;
}
.wa-link-timer.is-ending { color: var(--app-rose-text); }
.wa-link-timer-track {
  background: var(--app-inset);
  border-radius: 999px;
  height: 4px;
  overflow: hidden;
}
.wa-link-timer-track span {
  background: var(--app-primary);
  display: block;
  height: 100%;
  transform-origin: left;
  transition: transform 250ms linear;
}
.wa-link-timer.is-ending .wa-link-timer-track span { background: var(--app-rose-text); }
.wa-link-foot {
  align-items: center;
  color: var(--app-muted);
  display: flex;
  flex-wrap: wrap;
  font-size: 12.5px;
  gap: 6px 12px;
  justify-content: space-between;
}
`;
