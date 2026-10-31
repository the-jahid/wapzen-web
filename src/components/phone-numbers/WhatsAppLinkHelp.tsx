"use client";

import { parsePhoneNumberFromString } from "libphonenumber-js/min";
import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import type { ApiPhoneNumber } from "@/lib/phoneNumbers";

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
// WhatsApp can't resolve without the country code.
export function normalizePhone(value: string): { phone: string } | { error: string } {
  const compact = value.replace(/[\s().-]/g, "");
  if (!compact) return { error: "Enter the WhatsApp number on your phone." };
  const digits = compact.startsWith("+") ? compact.slice(1) : compact.replace(/^00/, "");
  if (!/^\d+$/.test(digits)) return { error: "Use digits only, starting with your country code." };
  if (digits.startsWith("0")) return { error: "Add your country code first, for example +880 or +1." };
  if (digits.length < 7 || digits.length > 15) return { error: "That number looks too short or too long." };
  // A local 0 kept after the country code (+880 01639…) is a different number,
  // and WhatsApp gives out a code for it that no phone can use. This only ever
  // corrects: it calls some working numbers invalid, so those go through as typed.
  const parsed = parsePhoneNumberFromString(`+${digits}`);
  return { phone: parsed?.isValid() ? parsed.number : `+${digits}` };
}

function formatCountdown(ms: number) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// WhatsAppLinkHelp sits under a login's QR code. It says where to scan in
// WhatsApp, and offers the way in for anyone who can't scan: an 8-character
// code typed into WhatsApp › Linked devices › Link with phone number instead.
//
// onRequestCode starts that login (it replaces the QR login, so the page must
// swap in the login it returns) and throws with a message to show on failure.
export function WhatsAppLinkHelp({
  disabled = false,
  login,
  onRequestCode,
}: {
  disabled?: boolean;
  login: ApiPhoneNumber | null;
  onRequestCode: (phone: string) => Promise<void>;
}) {
  const isPhone = useIsPhone();
  const [formOpen, setFormOpen] = useState<boolean | null>(null);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
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
    const normalized = normalizePhone(value);
    if ("error" in normalized) {
      setError(normalized.error);
      return;
    }
    setPhone(normalized.phone);
    setError("");
    setResent(false);
    setIsRequesting(true);
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

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isRequesting && !disabled) void requestCode(phone);
  }

  if (pairingCode) {
    const remaining = codeDeadlineKnown ? codeLeft : null;
    const expired = remaining !== null && remaining <= 0;
    const number = login?.phone_number || phone;
    const canRenew = !disabled && !isRequesting && Boolean(number);
    const renew = () => void requestCode(number);
    return (
      <div className="wa-link">
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
        <div
          className={`wa-link-code${expired ? " is-expired" : ""}`}
          aria-label={`Pairing code ${pairingCode.split("").join(" ")}`}
        >
          {pairingCode}
        </div>
        <button
          className={`wa-link-btn wa-link-btn-wide${expired ? "" : " wa-link-btn-quiet"}`}
          disabled={!canRenew}
          onClick={renew}
          type="button"
        >
          {isRequesting ? "Sending a new code…" : "Send a new code"}
        </button>
        {resent ? (
          <div className="wa-link-sent" role="status">
            New code sent. Type this one — the last code no longer works.
          </div>
        ) : null}
        {error ? <div className="wa-link-error">{error}</div> : null}
        <ol className="wa-link-steps">
          <li>
            Open <b>WhatsApp</b> on the phone with {number || "this number"}. If you see the
            notification <b>&ldquo;Enter code to link new device&rdquo;</b>, tap it and skip to step 4.
          </li>
          <li>
            Tap <b>⋮ Menu</b> (Android) or <b>Settings</b> (iPhone) › <b>Linked devices</b> ›{" "}
            <b>Link a device</b>.
          </li>
          <li>
            The camera opens. Don&rsquo;t scan — tap <b>Link with phone number instead</b> at the bottom of
            the screen.
          </li>
          <li>Type the 8 characters above. The number connects by itself — keep this page open.</li>
        </ol>
        <p className="wa-link-note">
          Nothing on your phone, or it says the code is wrong? This code only works for{" "}
          {number || "the number you entered"}, so check that is the WhatsApp number on the phone.
        </p>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </div>
    );
  }

  const showForm = formOpen ?? (isPhone || isRetry);
  // Only the first code outlives 20s, so a reading above that is the first.
  const qrLifetime = qrExpiresIn !== null && qrExpiresIn > 20_000 ? 60_000 : 20_000;

  return (
    <div className="wa-link">
      {qrExpiresIn !== null && qrLeft !== null ? (
        <div className={`wa-link-timer${qrLeft <= 5_000 ? " is-ending" : ""}`} role="timer">
          <span>{qrLeft > 0 ? `New code in ${formatCountdown(qrLeft)}` : "Getting a new code…"}</span>
          <span className="wa-link-timer-track" aria-hidden="true">
            <span style={{ transform: `scaleX(${Math.min(1, qrLeft / qrLifetime)})` }} />
          </span>
        </div>
      ) : null}
      {isPhone ? (
        <p className="wa-link-note">
          <b>On your phone?</b> It can&rsquo;t scan its own screen. Enter the number below and WhatsApp
          gives you a code to type in — no scan needed.
        </p>
      ) : (
        <ol className="wa-link-steps">
          <li>Open WhatsApp on your phone.</li>
          <li>
            Tap <b>Settings</b> (iPhone) or <b>⋮ Menu</b> (Android) › <b>Linked devices</b> ›{" "}
            <b>Link a device</b>.
          </li>
          <li>Point the phone&rsquo;s camera at this QR code.</li>
        </ol>
      )}
      {isPhone ? null : (
        <details className="wa-link-trouble" open={isRetry}>
          <summary>Scan not working?</summary>
          <ul>
            <li>
              <b>Phone shows an error?</b> WhatsApp links at most 4 devices. Open <b>Linked devices</b>,
              log out one you no longer use, then scan again.
            </li>
            <li>Update WhatsApp on the phone — an old version can refuse new links.</li>
            <li>Camera won&rsquo;t read it? Make this window bigger, or hold the phone a little further back.</li>
            <li>Still stuck? Link with your phone number instead — no scan needed.</li>
          </ul>
        </details>
      )}

      {showForm ? (
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
      ) : (
        <button className="wa-link-text-btn" disabled={disabled} onClick={() => setFormOpen(true)} type="button">
          Can&rsquo;t scan? Link with phone number instead
        </button>
      )}
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </div>
  );
}

const css = `
.wa-link { display: grid; gap: 10px; min-width: 0; text-align: left; }
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
