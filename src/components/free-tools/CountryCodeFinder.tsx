"use client";

import { useDeferredValue, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Earth, ExternalLink, Search, SearchX } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { Flag } from "./Flag";
import { analysePhone, typeLabels } from "./phoneNumber";
import type { CountryInfo } from "./countries";
import styles from "./FreeTools.module.css";

const normalize = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function CountryCodeFinder({ countries }: { countries: CountryInfo[] }) {
  const id = useId();
  const [iso, setIso] = useState("");
  const [number, setNumber] = useState("");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const card = useRef<HTMLDivElement>(null);
  const numberInput = useRef<HTMLInputElement>(null);

  const byIso = useMemo(() => new Map(countries.map((country) => [country.iso, country])), [countries]);
  const searchable = useMemo(() => countries.map((country) => ({ country, text: normalize(`${country.name} ${country.aliases}`) })), [countries]);
  const selected = byIso.get(iso);
  const result = analysePhone(number, iso, byIso);

  const matches = useMemo(() => {
    const q = normalize(deferredQuery.trim());
    if (!q) return countries;
    const code = q.replace(/^(\+|00)/, "").replace(/[\s-]/g, "");
    if (/^\d+$/.test(code)) {
      // "+88" lists every code starting 88; exact matches (e.g. +1's many countries) come first.
      return countries.filter((c) => c.code.startsWith(code)).sort((a, b) => a.code.length - b.code.length || a.name.localeCompare(b.name, "en"));
    }
    return searchable.filter(({ country, text }) => country.iso.toLowerCase() === q || text.includes(q)).map(({ country }) => country);
  }, [deferredQuery, countries, searchable]);

  function pickCountry(next: string) {
    setIso(next);
    card.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    numberInput.current?.focus({ preventScroll: true });
  }

  return <>
    <div ref={card} className={`${styles.toolCard} ${styles.scrollTarget}`}>
      <form className={styles.form} onSubmit={(event) => event.preventDefault()} noValidate>
        <div className={styles.field}>
          <label htmlFor={`${id}-country`}>Country</label>
          <div className={styles.selectWrap}>
            {selected && <Flag iso={selected.iso} />}
            <select id={`${id}-country`} className={`${styles.input} ${styles.select} ${selected ? styles.selectWithFlag : ""}`} value={iso} onChange={(event) => setIso(event.target.value)}>
              <option value="">Choose a country…</option>
              {countries.map((country) => <option key={country.iso} value={country.iso}>{country.name} (+{country.code})</option>)}
            </select>
          </div>
          {selected && <p className={styles.codeBadge}>Country code <strong>+{selected.code}</strong><CopyButton value={`+${selected.code}`} label={`Copy +${selected.code}`} /></p>}
        </div>

        <div className={styles.field}>
          <label htmlFor={`${id}-number`}>Phone number <span>(optional)</span></label>
          <input
            ref={numberInput}
            id={`${id}-number`}
            className={`${styles.input} ${result.state === "error" ? styles.invalid : ""}`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={selected?.local || "+880 1812 345678"}
            value={number}
            onChange={(event) => setNumber(event.target.value)}
            aria-invalid={result.state === "error"}
            aria-describedby={`${id}-number-hint`}
          />
          <p id={`${id}-number-hint`} className={result.state === "error" ? styles.error : styles.hint}>
            {result.state === "error" ? result.message : "Type it the way you'd dial it locally, or paste a full number starting with +. We'll convert it to the format WhatsApp needs."}
          </p>
        </div>

        {selected && selected.local && <div className={styles.example}>
          <span className={styles.fieldLabel}>Example for {selected.name}</span>
          <div><span>Dialled locally</span><code>{selected.local}</code></div>
          <div><span>On WhatsApp</span><code>{selected.intl}</code></div>
        </div>}
      </form>

      <section className={styles.result} aria-labelledby={`${id}-result`}>
        <h2 id={`${id}-result`} className={styles.resultTitle}>WhatsApp format</h2>
        {result.state === "ok" ? <>
          <div className={styles.numberHero}>
            <span className={styles.numberCountry}>{result.country && <Flag iso={result.country.iso} />}{result.country ? result.country.name : "International number"} · +{result.callingCode}{result.detected && result.country && <em>detected from the number</em>}</span>
            <strong>{result.intl}</strong>
          </div>
          {result.valid
            ? <p className={styles.okNote}><CheckCircle2 size={15} />{(result.type && typeLabels[result.type]) || "Valid number"}{result.type === "FIXED_LINE" && ". Landlines only work if the number is registered with WhatsApp Business."}</p>
            : <p className={styles.warning}><AlertTriangle size={15} />The length looks right, but this isn&apos;t a number range in use{result.country ? ` in ${result.country.name}` : ""}. Double-check the digits.</p>}
          <dl className={styles.facts}>
            <div><dt>Save in your contacts as</dt><dd><code>{result.intl}</code><CopyButton value={result.intl} label={`Copy ${result.intl}`} /></dd></div>
            <div><dt>For wa.me links and APIs</dt><dd><code>{result.digits}</code><CopyButton value={result.digits} label={`Copy ${result.digits}`} /></dd></div>
          </dl>
          <div className={styles.actions}>
            <a className={`${styles.btn} ${styles.btnPrimary}`} href={`https://wa.me/${result.digits}`} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} />Open in WhatsApp</a>
            <Link className={`${styles.btn} ${styles.btnSecondary}`} href="/tools/whatsapp-qr-code-generator">Make a QR code<ArrowRight size={16} /></Link>
          </div>
        </> : <div className={styles.empty}>
          <Earth size={34} strokeWidth={1.4} />
          <p>{selected ? `The WhatsApp country code for ${selected.name} is +${selected.code}. Enter a number to convert it.` : "Choose a country to see its WhatsApp country code, then enter a number to convert it."}</p>
        </div>}
      </section>
    </div>

    <section className={styles.codeList} aria-labelledby={`${id}-list`}>
      <div className={styles.codeListHead}>
        <div><h2 id={`${id}-list`} className={styles.sectionTitle}>All WhatsApp country codes.</h2><p>{deferredQuery.trim() ? `${matches.length} ${matches.length === 1 ? "match" : "matches"}` : `${countries.length} countries and territories`}</p></div>
        <label className={styles.searchBox}><Search size={16} /><span className={styles.srOnly}>Search countries or codes</span><input type="search" placeholder="Search a country or code, e.g. India or +91" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      </div>
      <div className={styles.tableWrap}>
        {matches.length ? <table className={styles.codeTable}>
          <thead><tr><th scope="col">Country</th><th scope="col">Code</th><th scope="col">Example WhatsApp number</th><th scope="col"><span className={styles.srOnly}>Actions</span></th></tr></thead>
          <tbody>{matches.map((country) => <tr key={country.iso}>
            <th scope="row"><span className={styles.countryCell}><Flag iso={country.iso} />{country.name}</span></th>
            <td className={styles.codeCell}>+{country.code}</td>
            <td className={styles.exampleCell}>{country.intl}</td>
            <td className={styles.rowActions}><CopyButton value={`+${country.code}`} label={`Copy +${country.code}, the code for ${country.name}`} /><button type="button" className={styles.useButton} onClick={() => pickCountry(country.iso)} aria-label={`Convert a ${country.name} number`}>Use</button></td>
          </tr>)}</tbody>
        </table> : <div className={styles.noMatches}><SearchX size={26} strokeWidth={1.5} /><p>No country or code matches “{deferredQuery.trim()}”.</p></div>}
      </div>
    </section>
  </>;
}
