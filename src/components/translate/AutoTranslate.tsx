"use client";

import { useEffect, useSyncExternalStore, type ChangeEvent } from "react";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { languageName, languagesForCountry, pickLanguage } from "@/lib/countryLanguages";
import styles from "./AutoTranslate.module.css";

// Shows the site in the language of the visitor's country. A website can't
// start Chrome's own translate bar, so this runs Google's website translator,
// which works in every browser. The page's HTML never changes: all of this
// happens after hydration, and crawlers skip it, so search engines keep seeing
// the English page.
//
// Pages already written in another language wrap themselves in
// <div lang translate="no"> (PublicShell) and are left alone. Private text in
// the dashboard (customer messages, names, numbers) is marked "notranslate" where
// it renders, so it stays out of what the page sends to Google.

const CHOICE_KEY = "wapzen.translate"; // Set only when the visitor picks a language.
const COUNTRY_KEY = "wapzen.country"; // Per tab session, so travellers get re-checked.
const ENGLISH = "en";
const CRAWLER = /bot|crawl|spider|slurp|lighthouse|inspectiontool|headless|preview|facebookexternalhit/i;
const OWN_LANGUAGE_PAGE = 'div[lang][translate="no"]';

function readStored(storage: () => Storage, key: string): string | null {
  try {
    return storage().getItem(key);
  } catch {
    return null;
  }
}

function writeStored(storage: () => Storage, key: string, value: string) {
  try {
    storage().setItem(key, value);
  } catch {
    // Blocked storage only means the choice isn't remembered.
  }
}

async function detectCountry(): Promise<string | null> {
  const known = readStored(() => sessionStorage, COUNTRY_KEY);
  if (known) return known;
  let country: string | null = null;
  try {
    const response = await fetch("/api/geo");
    if (response.ok) country = ((await response.json()) as { country: string | null }).country;
  } catch {
    // Fall through to the browser's own region.
  }
  if (!country) {
    try {
      country = new Intl.Locale(navigator.language).maximize().region ?? null;
    } catch {
      country = null;
    }
  }
  if (country) writeStored(() => sessionStorage, COUNTRY_KEY, country);
  return country;
}

// The translator (Chrome's own translate bar too) puts a <font> right before each
// text node, then removes the text node. React still holds that node, so left
// alone it would throw when removing or inserting around it, and a value like
// "{sent} of {total}" would stop updating. Remembering which <font> took each
// node's place lets all three keep working. An updated value goes into the page
// as a new text node, because the translator won't touch one it has already seen.
function protectDomFromTranslation() {
  const replacedBy = new WeakMap<Node, ChildNode>();
  const { removeChild, insertBefore } = Node.prototype;
  const nodeValue = Object.getOwnPropertyDescriptor(Node.prototype, "nodeValue")!;

  // What is on the page in a node's place now: its <font>, or a newer text node
  // that may in turn have been translated.
  function shownFor(node: Node): ChildNode | undefined {
    let shown = replacedBy.get(node);
    while (shown && replacedBy.has(shown)) shown = replacedBy.get(shown);
    return shown;
  }

  Node.prototype.removeChild = function patched<T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      shownFor(child)?.remove();
      return child;
    }
    const previous = child.previousSibling;
    if (child.nodeType === Node.TEXT_NODE && previous?.nodeName === "FONT") replacedBy.set(child, previous);
    return removeChild.call(this, child) as T;
  };

  Node.prototype.insertBefore = function patched<T extends Node>(this: Node, node: T, before: Node | null): T {
    if (!before || before.parentNode === this) return insertBefore.call(this, node, before) as T;
    const shown = shownFor(before);
    return insertBefore.call(this, node, shown?.parentNode === this ? shown : null) as T;
  };

  Object.defineProperty(Node.prototype, "nodeValue", {
    ...nodeValue,
    set(this: Node, value: string | null) {
      nodeValue.set!.call(this, value);
      const shown = this.parentNode ? undefined : shownFor(this);
      if (!shown) return;
      // Translation can move a space into the neighbouring node's text; keep it.
      const [, before, after] = /^(\s*)[\s\S]*?(\s*)$/.exec(shown.textContent ?? "") ?? ["", "", ""];
      const text = `${before}${value ?? ""}${after}`;
      let fresh: ChildNode = document.createTextNode(text);
      // A number needs no translating, and translating one would drop that space.
      if (!/\p{L}/u.test(text)) {
        const untranslated = document.createElement("span");
        untranslated.className = "notranslate";
        untranslated.textContent = text;
        fresh = untranslated;
      }
      shown.replaceWith(fresh);
      replacedBy.set(this, fresh);
    },
  });
}

function setLanguageCookie(language: string | null) {
  const { hostname } = window.location;
  if (language) {
    document.cookie = `googtrans=/en/${language}; path=/; SameSite=Lax`;
    return;
  }
  // Google's script can also write the cookie on the parent domain.
  const expired = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = expired;
  document.cookie = `${expired}; domain=${hostname}`;
  document.cookie = `${expired}; domain=.${hostname}`;
  document.cookie = `${expired}; domain=.${hostname.replace(/^www\./, "")}`;
}

type GoogleTranslate = {
  translate: { TranslateElement: new (options: { pageLanguage: string; autoDisplay: boolean }, elementId: string) => unknown };
};

let translatorStarted = false;

function startTranslator(language: string, onFail: () => void) {
  if (translatorStarted) return;
  translatorStarted = true;
  setLanguageCookie(language);

  const target = document.createElement("div");
  target.id = "google_translate_element";
  target.hidden = true;
  document.body.append(target);

  const scope = window as unknown as { google?: GoogleTranslate; wapzenTranslateReady?: () => void };
  scope.wapzenTranslateReady = () => {
    if (scope.google) new scope.google.translate.TranslateElement({ pageLanguage: ENGLISH, autoDisplay: false }, target.id);
  };
  const script = document.createElement("script");
  script.src = "https://translate.google.com/translate_a/element.js?cb=wapzenTranslateReady";
  script.async = true;
  script.onerror = onFail; // Ad blockers and some countries block it: the page just stays English.
  document.body.append(script);
}

// Shared so the switch can sit in the dashboard sidebar while the detection runs
// once, from the root layout.
type Choice = { languages: string[]; active: string };
const NONE: Choice = { languages: [], active: ENGLISH };
let choice = NONE;
const listeners = new Set<() => void>();

function publish(next: Choice) {
  choice = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function useChoice() {
  return useSyncExternalStore(subscribe, () => choice, () => NONE);
}

export function AutoTranslate() {
  const pathname = usePathname();
  const { active } = useChoice();

  useEffect(() => {
    if (CRAWLER.test(navigator.userAgent)) return;
    protectDomFromTranslation();
    const saved = readStored(() => localStorage, CHOICE_KEY);
    void detectCountry().then((country) => {
      const forCountry = country ? languagesForCountry(country) : [];
      const language = saved ?? pickLanguage(forCountry, navigator.languages) ?? ENGLISH;
      publish({
        languages: forCountry.includes(language) || language === ENGLISH ? forCountry : [language, ...forCountry],
        active: language,
      });
    });
  }, []);

  useEffect(() => {
    if (active === ENGLISH || document.querySelector(OWN_LANGUAGE_PAGE)) return;
    startTranslator(active, () => publish(NONE));
  }, [active, pathname]);

  // The dashboard has controls in every corner, so its sidebar holds the switch.
  return pathname.startsWith("/dashboard") ? null : <LanguageSwitch floating />;
}

export function LanguageSwitch({ floating = false }: { floating?: boolean }) {
  const { languages, active } = useChoice();

  function choose(event: ChangeEvent<HTMLSelectElement>) {
    writeStored(() => localStorage, CHOICE_KEY, event.target.value);
    setLanguageCookie(event.target.value === ENGLISH ? null : event.target.value);
    // The only clean way back to the original text.
    window.location.reload();
  }

  const options = languages.filter((language) => language !== ENGLISH);
  if (options.length === 0) return null;

  return (
    <label className={`${floating ? styles.floating : styles.inline} notranslate`} translate="no">
      <Languages aria-hidden="true" size={14} />
      <span className={styles.srOnly}>Language</span>
      <select value={active} onChange={choose} className={styles.select}>
        <option value={ENGLISH}>English</option>
        {options.map((language) => (
          <option key={language} value={language}>{languageName(language)}</option>
        ))}
      </select>
    </label>
  );
}
