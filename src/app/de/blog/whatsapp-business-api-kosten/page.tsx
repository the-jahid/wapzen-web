import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Zielsuchen: "whatsapp business api kosten" (37), "whatsapp business
// kostenpflichtig" (36), "whatsapp business kosten" (30, 3/3), "…kosten pro
// api" (28), "whatsapp business api anbieter" (20), "was kostet whatsapp
// business api" (15), Autocomplete DE 2026-10-30
// (docs/seo-blog-europe-research.mjs de). Die Preise sind Metas EUR-Preisliste
// für Deutschland ab 1. Oktober 2026 (FlowCall und Chatarmin stimmen überein),
// die Anbieterpreise stammen von deren eigenen Preisseiten. Meta ändert die
// Preise jedes Quartal (1. Jan/Apr/Jul/Okt): Tabellen und Beispiele prüfen und
// `updated` anpassen. Englische Version: /blog/whatsapp-business-api-pricing.
const href = "/de/blog/whatsapp-business-api-kosten";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "de", article: { publishedTime: post.published, modifiedTime: post.updated } });

const overview = [
  ["Was es ist", "Die App mit dem „B“ fürs Smartphone", "Der Zugang für Software, direkt bei Meta oder über einen Anbieter"],
  ["Kosten bei Meta", "Keine", "Pro zugestellter Nachricht, je nach Kategorie und Land"],
  ["Kosten beim Anbieter", "Keine", "Meist eine Monatsgebühr, oft mit Mindestlaufzeit"],
  ["Wer antwortet", "Du, von Hand", "Eine Software, ein Chatbot oder ein Team"],
  ["Passt zu", "Kleinen Betrieben", "Newslettern, großen Teams, Integrationen"],
];

const categories = [
  ["Was es ist", "Angebote, Aktionen, Newsletter", "Bestell- und Versandbestätigungen, Terminerinnerungen", "Einmalcodes (OTP)", "Freie Antworten an einen Kunden"],
  ["Vorlage nötig", "Ja", "Ja", "Ja", "Nein"],
  ["Wann erlaubt", "Jederzeit, mit Einwilligung (Opt-in)", "Jederzeit, mit Einwilligung (Opt-in)", "Jederzeit", "Nur innerhalb von 24 Stunden nach der letzten Kundennachricht"],
  ["Kostet", "Jede zugestellte Nachricht", "Jede zugestellte Nachricht", "Jede zugestellte Nachricht", "Ab der 1.001. im Monat pro Nummer"],
];

const rates = [
  ["Marketing", "0,1131 €"],
  ["Utility", "0,0456 €"],
  ["Authentifizierung", "0,0456 €"],
  ["Service", "Die ersten 1.000 im Monat pro Nummer gratis, danach 0,0456 €"],
];

const europe = [
  ["Niederlande", "0,1323 €", "0,0414 €"],
  ["Deutschland", "0,1131 €", "0,0456 €"],
  ["Frankreich", "0,0712 €", "0,0248 €"],
  ["Italien", "0,0658 €", "0,0248 €"],
  ["Spanien", "0,0585 €", "0,0166 €"],
];

const providers = [
  ["Was es ist", "Reiner API-Zugang, ohne eigenes Postfach im Einstiegstarif", "Postfach, Kampagnen und KI-Agent auf der API", "Postfach, Kampagnen und KI auf der API", "KI-Agent auf deiner bestehenden Nummer, ohne API"],
  ["Monatlich (netto)", "49 €, 99 € oder 500 € pro Nummer", "0 € (Free), 89 €, 149 € oder 299 €", "Auf Anfrage", "Kostenlos starten"],
  ["Mindestlaufzeit", "Keine Angabe", "12 Monate", "12 Monate", "Keine"],
  ["Meta-Gebühren", "Zusätzlich, pro Nachricht", "Zusätzlich, pro Nachricht", "Zusätzlich, direkt an Meta", "Keine: die Antworten laufen nicht über die API"],
  ["KI-Antworten", "Nicht enthalten, eigene Agenten anbindbar", "1 KI-Agent ab Professional, weitere je 49 €", "Chat- und Telefon-KI als Zusatzmodul", "Enthalten, für Chats und WhatsApp-Anrufe"],
  ["Newsletter", "Ja", "Ja", "Ja", "Nein"],
];

const faqs = [
  { q: "Ist WhatsApp Business kostenpflichtig?", a: "Nein. Die App WhatsApp Business ist kostenlos: Herunterladen, Nachrichten schreiben und telefonieren kostet nichts. Kostenpflichtig ist nur die WhatsApp Business API, also die Plattform für Software. Dort berechnet Meta jede zugestellte Nachricht, und meist kommt die Monatsgebühr eines Anbieters dazu." },
  { q: "Was kostet eine Nachricht über die WhatsApp Business API in Deutschland?", a: "Seit dem 1. Oktober 2026 berechnet Meta für deutsche Nummern 0,1131 € pro Marketing-Nachricht und 0,0456 € pro Utility- oder Authentifizierungsnachricht, netto und vor den Gebühren des Anbieters. Antworten an Kunden sind bis 1.000 im Monat pro Nummer gratis, danach kosten sie ebenfalls 0,0456 €." },
  { q: "Warum ist WhatsApp-Marketing in Deutschland so teuer?", a: "Meta legt die Preise pro Land fest, und Deutschland gehört in Europa zu den teuersten Märkten. Eine Marketing-Nachricht kostet hier 0,1131 €, fast doppelt so viel wie in Spanien (0,0585 €). Bezahlt wird nach der Vorwahl des Empfängers: Eine Nachricht an eine +49-Nummer kostet den deutschen Preis, egal wo dein Unternehmen sitzt." },
  { q: "Muss ich für Nachrichten bezahlen, die Kunden mir schicken?", a: "Nein. Meta berechnet keine eingehenden Nachrichten. Manche Anbieter zählen in ihren Tarifen aber Gespräche oder Nachrichten in beide Richtungen, schau also in die Preisliste deines Anbieters." },
  { q: "Was kostet ein WhatsApp Business API Anbieter im Monat?", a: "Bei 360dialog beginnt der reine API-Zugang bei 49 € pro Nummer und Monat, Superchat kostet 89 € bis 299 € im Monat bei 12 Monaten Mindestlaufzeit, andere Anbieter nennen Preise nur auf Anfrage. Metas Gebühren pro Nachricht kommen immer dazu." },
  { q: "Gibt es eine Alternative ohne API-Gebühren, die mit KI antwortet?", a: "Ja. Wapzen verbindet deine bestehende WhatsApp-Nummer per QR-Code als verknüpftes Gerät, wie WhatsApp Web, und lässt eine KI eingehende Chats und WhatsApp-Anrufe beantworten, ohne Metas Gebühren pro Nachricht. Du kannst kostenlos starten. Newsletter verschickt Wapzen nicht: dafür bleibt die offizielle API das richtige Werkzeug." },
];

const sources = [
  { label: "Meta: Preise der WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "EUR-Preisliste ab 1. Oktober 2026: FlowCall", href: "https://www.flowcall.co/blog/whatsapp-business-api-pricing" },
  { label: "Preise für Deutschland: Chatarmin", href: "https://chatarmin.com/en/blog/whatsapp-business-costs" },
  { label: "360dialog: Preise", href: "https://360dialog.com/pricing" },
  { label: "Superchat: Preise", href: "https://www.superchat.de/preise" },
  { label: "hellomateo: Preise", href: "https://www.hellomateo.de/preise" },
  { label: "WhatsApp Business Data Processing Terms", href: "https://www.whatsapp.com/legal/business-data-processing-terms" },
  { label: "Cookiebot: EU AI Act Artikel 50 ab August 2026", href: "https://www.cookiebot.com/en/eu-ai-act-article-50-transparency-compliance/" },
  { label: "GadgetScout: Meta One (September 2026)", href: "https://www.gadgetscout.co.uk/articles/meta-one-puts-paid-ai-features-inside-facebook-and-whatsapp.html" },
];

const sections = [
  {
    id: "kurz",
    title: "Ist WhatsApp Business kostenpflichtig? Die kurze Antwort",
    body: <>
      <p>Wer nach den Kosten von WhatsApp Business sucht, meint meist zwei verschiedene Produkte. Die <strong>App WhatsApp Business</strong>, die mit dem „B“ im Symbol, ist <strong>kostenlos</strong>: Du lädst sie herunter, registrierst deine Nummer und schreibst Kunden, ohne etwas zu bezahlen. Die <strong>WhatsApp Business API</strong>, die Meta heute WhatsApp Business Platform nennt, ist dagegen kostenpflichtig: Meta berechnet jede Nachricht, die dein Unternehmen verschickt, und fast immer kommt die Monatsgebühr eines Anbieters dazu.</p>
      <Comparison caption="WhatsApp Business App und WhatsApp Business API: die Kosten im Vergleich" columns={["WhatsApp Business App", "WhatsApp Business API"]} rows={overview} />
      <p>Die API brauchst du vor allem für Newsletter an Tausende Kontakte, für große Teams mit einem gemeinsamen Postfach und für Integrationen in Shop oder CRM. Viele kleine Betriebe kommen mit der kostenlosen App aus und brauchen höchstens jemanden, der schneller antwortet.</p>
    </>,
  },
  {
    id: "app",
    title: "Die WhatsApp Business App: was kostenlos ist",
    body: <>
      <p>Mit der kostenlosen App hast du schon alles, um Kunden von Hand zu betreuen und zu verkaufen:</p>
      <ul>
        <li>ein <strong>Unternehmensprofil</strong> mit Adresse, Öffnungszeiten, Website und E-Mail;</li>
        <li>einen <strong>Katalog</strong> mit Produkten oder Leistungen, Fotos und Preisen;</li>
        <li><strong>Begrüßungs- und Abwesenheitsnachrichten</strong> sowie <strong>Schnellantworten</strong>;</li>
        <li><strong>Labels</strong>, um Chats zu sortieren (neue Anfrage, bezahlt, Rückruf);</li>
        <li><strong>Broadcast-Listen</strong> mit bis zu 256 Kontakten, die nur bei Personen ankommen, die deine Nummer gespeichert haben.</li>
      </ul>
      <p>Nachrichten und Anrufe kosten nichts. Seit September 2026 bietet Meta zusätzlich das <strong>optionale Abo Meta One</strong> an, unter anderem mit Verifizierungs-Häkchen und mehr Antworten des Meta Business Agent. Preis und Verfügbarkeit hängen vom Land ab, schau dafür in der App nach. Nötig ist das Abo nicht.</p>
      <p>Die Grenze der App ist nicht der Preis, sondern die Zeit: Jede Antwort schreibt ein Mensch, und Abwesenheitsnachrichten sind feste Texte, die keine Fragen beantworten.</p>
    </>,
  },
  {
    id: "preismodell",
    title: "So funktionieren die Preise der WhatsApp Business API",
    body: <>
      <p>Seit dem 1. Juli 2025 berechnet Meta die API <strong>pro zugestellter Nachricht</strong>, nicht mehr pro Konversation. Der Preis hängt von zwei Dingen ab: der <strong>Kategorie</strong> der Nachricht und der <strong>Vorwahl des Empfängers</strong>. Eine Nachricht an eine deutsche Nummer (+49) kostet den deutschen Preis, auch wenn dein Unternehmen in Österreich oder der Schweiz sitzt. Nachrichten, die Kunden dir schicken, sind kostenlos.</p>
      <Comparison caption="Die vier Nachrichtenkategorien der WhatsApp Business API" columns={["Marketing", "Utility", "Authentifizierung", "Service"]} rows={categories} />
      <p>Für Utility- und Authentifizierungsnachrichten gibt es <strong>Mengenrabatte</strong>: Ab bestimmten monatlichen Schwellen pro Land und Kategorie sinkt der Preis. Für Marketing und Service gibt es keine Staffel.</p>
    </>,
  },
  {
    id: "preise-deutschland",
    title: "Metas Preise für Deutschland 2026",
    body: <>
      <p>Das sind Metas Preise aus der Euro-Preisliste für deutsche Nummern, gültig seit dem <strong>1. Oktober 2026</strong>, pro zugestellter Nachricht, vor Mengenrabatten, Mehrwertsteuer und Anbietergebühren:</p>
      <Comparison caption="Metas Preise pro Nachricht an deutsche Nummern ab 1. Oktober 2026" columns={["Preis pro Nachricht"]} rows={rates} />
      <p>Praktisch heißt das: <strong>Ein Newsletter kostet gut 11 Cent pro Empfänger</strong>, eine Versandbestätigung oder Terminerinnerung gut <strong>4,5 Cent</strong>. 1.000 Newsletter-Nachrichten kosten 113,10 €, 1.000 Erinnerungen 45,60 €.</p>
      <p>Im europäischen Vergleich ist Deutschland teuer. Nur die Niederlande verlangen für Marketing noch mehr:</p>
      <Comparison caption="Metas Preise pro Nachricht in fünf EU-Ländern ab 1. Oktober 2026" columns={["Marketing", "Utility und Service"]} rows={europe} />
      <Note>Meta ändert die Preise jedes Quartal (1. Januar, April, Juli und Oktober). Prüfe vor einer Kalkulation Metas offizielle Preisliste und denk daran, dass dein Anbieter mehr als Metas Preis berechnen kann.</Note>
    </>,
  },
  {
    id: "oktober-2026",
    title: "Was sich am 1. Oktober 2026 geändert hat",
    body: <>
      <p>Bis zum 30. September war jede freie Antwort innerhalb des 24-Stunden-Fensters kostenlos. Seit dem <strong>1. Oktober 2026</strong> gilt:</p>
      <ul>
        <li><strong>Antworten an Kunden kosten ab einer Schwelle.</strong> Jede Unternehmensnummer hat 1.000 kostenlose Service-Nachrichten im Monat, danach kostet jede so viel wie eine Utility-Nachricht, in Deutschland 0,0456 €. Ungenutzte Freinachrichten verfallen.</li>
        <li><strong>Utility-Vorlagen im 24-Stunden-Fenster kosten wieder.</strong> Seit Juli 2025 waren sie dort gratis.</li>
        <li><strong>Click-to-WhatsApp-Anzeigen behalten ihr Gratis-Fenster:</strong> Ein Gespräch, das über eine Anzeige oder einen Button auf deiner Facebook-Seite beginnt, ist bis zu 7 Tage kostenlos.</li>
      </ul>
      <p>Für einen Chatbot auf der API hat das direkte Folgen: Ein Bot, der Tausende Fragen im Monat beantwortet, hat früher keine Meta-Gebühren verursacht und kostet jetzt bei jeder Antwort. Ein Bot, der drei kurze Nachrichten statt einer schickt, kostet das Dreifache.</p>
    </>,
  },
  {
    id: "anbieter",
    title: "WhatsApp Business API Anbieter im Vergleich",
    body: <>
      <p>Die API nutzt du fast immer über einen Anbieter (Business Solution Provider, BSP). Alle schicken deine Nachrichten über dieselbe Cloud API von Meta, die Unterschiede liegen in Software, Support und Vertrag. Drei typische Anbieter aus dem deutschsprachigen Markt, mit Preisen von deren eigenen Seiten:</p>
      <Comparison caption="WhatsApp-Anbieter im Vergleich: 360dialog, Superchat, hellomateo und Wapzen" columns={["360dialog", "Superchat", "hellomateo", "Wapzen"]} rows={providers} />
      <ul>
        <li><strong>360dialog</strong> ist ein reiner API-Zugang für Entwickler und Agenturen: günstig pro Nummer, aber ohne Postfach im Einstiegstarif. Du brauchst eigene Software oder ein Tool wie n8n.</li>
        <li><strong>Superchat</strong> bietet ein fertiges Postfach für Teams mit Kampagnen und KI-Agent. Die Preise sind netto und gelten mit 12 Monaten Mindestlaufzeit.</li>
        <li><strong>hellomateo</strong> richtet sich an Betriebe mit vielen Nutzern und nennt den Preis erst im Beratungsgespräch, ebenfalls mit 12 Monaten Mindestlaufzeit.</li>
      </ul>
      <p>Rechne bei jedem Anbieter so: <strong>Monatsgebühr + Nutzer + Metas Gebühren pro Nachricht</strong>. Bei kleinen Volumen ist die Monatsgebühr oft der größere Posten.</p>
    </>,
  },
  {
    id: "beispiele",
    title: "Was es wirklich kostet: drei Rechenbeispiele",
    body: <>
      <p>Pro Nachricht wirken die Preise klein, auf der Monatsrechnung weniger. Drei typische Betriebe mit den Preisen ab 1. Oktober 2026, nur Metas Gebühren, netto:</p>
      <h3>Ein Online-Modeshop in Hamburg</h3>
      <ul>
        <li>2.000 Chats mit je etwa 4 Antworten: 8.000 Service-Nachrichten, davon 7.000 über dem Freikontingent × 0,0456 € = <strong>319,20 €</strong></li>
        <li>1.500 Versandbestätigungen (Utility) × 0,0456 € = <strong>68,40 €</strong></li>
        <li>Zwei Newsletter an 2.000 Abonnenten: 4.000 Marketing-Nachrichten × 0,1131 € = <strong>452,40 €</strong></li>
      </ul>
      <p>Rund <strong>840 € im Monat</strong> an Meta-Gebühren, vor der Monatsgebühr des Anbieters.</p>
      <h3>Eine Zahnarztpraxis in München</h3>
      <ul>
        <li>600 Patienten-Chats × 5 Antworten: 3.000 Service-Nachrichten, davon 2.000 kostenpflichtig × 0,0456 € = <strong>91,20 €</strong></li>
        <li>1.000 Terminerinnerungen (Utility) × 0,0456 € = <strong>45,60 €</strong></li>
      </ul>
      <p>Rund <strong>137 € im Monat</strong>. Dazu kommt die Software, die oft mehr kostet als Metas Gebühren.</p>
      <h3>Ein Elektrobetrieb in Köln</h3>
      <ul>
        <li>400 Kundenanfragen × 4 Antworten: 1.600 Nachrichten, davon 600 kostenpflichtig × 0,0456 € = <strong>27,36 €</strong></li>
        <li>300 Terminbestätigungen (Utility) × 0,0456 € = <strong>13,68 €</strong></li>
      </ul>
      <p>Rund <strong>41 € im Monat</strong> an Meta-Gebühren. Mit einem Anbieter ab 49 € bis 149 € im Monat zahlt der Betrieb vor allem für die Software, nicht für die Nachrichten.</p>
      <h3>So senkst du die Kosten</h3>
      <ul>
        <li><strong>Eine Antwort statt drei:</strong> Lass Bot und Team vollständige Antworten in einer Nachricht schreiben.</li>
        <li><strong>Die richtige Kategorie:</strong> Eine Versandbestätigung ist Utility, kein Marketing. Meta prüft Vorlagen und stuft falsch eingereichte um.</li>
        <li><strong>Gespräche über Anzeigen starten:</strong> Chats aus Click-to-WhatsApp-Anzeigen sind bis zu 7 Tage gratis.</li>
        <li><strong>Antworten ohne API:</strong> Wer keine Newsletter braucht, beantwortet Chats in der App oder mit einer KI auf der eigenen Nummer ohne Gebühren pro Nachricht.</li>
      </ul>
    </>,
  },
  {
    id: "dsgvo",
    title: "DSGVO und KI-Pflichten: was du wissen musst",
    body: <>
      <p>In Deutschland ist die Frage nach dem Datenschutz oft wichtiger als der Preis. Die wichtigsten Punkte, kurz:</p>
      <ul>
        <li><strong>Auftragsverarbeitung:</strong> Für die Business-Plattform gelten Metas WhatsApp Business Data Processing Terms, nach denen WhatsApp als Auftragsverarbeiter für dich handelt, soweit Metas Geschäftsbedingungen das vorsehen. Mit jedem weiteren Dienst, der Kundennachrichten für dich verarbeitet (Anbieter, KI-Dienst), brauchst du einen Auftragsverarbeitungsvertrag (AVV).</li>
        <li><strong>Einwilligung:</strong> Marketing-Nachrichten nur an Kontakte, die zugestimmt haben. Das verlangt Meta ohnehin, und es schützt deine Nummer vor Sperren.</li>
        <li><strong>Datenschutzerklärung:</strong> Nenne WhatsApp und jedes Tool, das Nachrichten verarbeitet, in deiner Datenschutzerklärung.</li>
        <li><strong>KI kennzeichnen:</strong> Seit dem 2. August 2026 verlangt der EU AI Act (Artikel 50), dass Menschen erfahren, wenn sie mit einer KI sprechen, sofern das nicht offensichtlich ist. Das Digital Omnibus hat diese Pflicht nicht verschoben. Ein Satz in der Begrüßung reicht: „Hier antwortet zuerst unser KI-Assistent.“</li>
      </ul>
      <Note>Dieser Abschnitt ist ein Überblick, keine Rechtsberatung. Für deinen Fall frag deinen Datenschutzbeauftragten.</Note>
    </>,
  },
  {
    id: "alternative",
    title: "Die Alternative ohne Meta-Gebühren: KI auf deiner bestehenden Nummer",
    body: <>
      <p>Wenn du die API nur willst, damit Kundenfragen schneller beantwortet werden, gibt es einen günstigeren Weg. <strong>Wapzen</strong> verbindet deine bestehende WhatsApp-Nummer per QR-Code als verknüpftes Gerät, so wie WhatsApp Web. Ein KI-Agent beantwortet dann jede eingehende Einzelnachricht auf Deutsch, mit den Informationen aus deiner Wissensdatenbank: Preise, Öffnungszeiten, Leistungen, Lieferzeiten. Ein Sprachagent nimmt WhatsApp-Anrufe an und ruft neue Interessenten zurück.</p>
      <ul>
        <li><strong>Keine Meta-Gebühren pro Antwort,</strong> weil die Antworten nicht über die API laufen.</li>
        <li><strong>Keine neue Nummer und kein API-Antrag:</strong> Deine Chats bleiben in der App, du kannst jederzeit selbst antworten.</li>
        <li><strong>Kostenlos starten,</strong> ohne Kreditkarte und ohne Mindestlaufzeit. Für größere Volumen schreib uns.</li>
      </ul>
      <InlineCta title="KI-Antworten ohne Gebühren pro Nachricht" body="Erstelle einen KI-Agenten, füge die Infos deines Betriebs hinzu und verbinde deine WhatsApp-Nummer per QR-Code. Er antwortet sofort." label="Kostenlos starten" />
      <p>Die Grenzen sagen wir offen: Wapzen ist kein offizielles Produkt von Meta. Es verschickt keine Newsletter, antwortet nicht in Gruppen und liest keine Fotos oder Sprachnachrichten. Als verknüpftes Gerät lesen seine Server jede eingehende Nachricht und schicken sie zur Antwort an ein KI-Modell. Sag deinen Kunden deshalb, dass zuerst ein Assistent antwortet.</p>
      <Choose locale="de" items={[
        { name: "die API", points: ["du regelmäßig Newsletter an Tausende Kontakte schickst", "ein großes Team ein gemeinsames Postfach braucht", "Shop oder CRM automatisch Nachrichten auslösen sollen"] },
        { name: "Wapzen", points: ["du vor allem Kundenfragen schneller beantworten willst", "du keine Gebühr pro Antwort und keinen Jahresvertrag willst", "auch WhatsApp-Anrufe angenommen werden sollen"] },
      ]} />
    </>,
  },
];

export default function WhatsAppBusinessApiKostenPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp Business API Kosten.<br /><span>Preise, Anbieter, Beispiele.</span></>}
    lead="Die App ist kostenlos, die API nicht. Hier sind Metas Preise für Deutschland seit dem 1. Oktober 2026, was die Anbieter zusätzlich verlangen, drei durchgerechnete Beispiele und der Weg, Kundenchats ohne Gebühren pro Nachricht mit KI zu beantworten."
    summary={{
      title: "Kurz gesagt",
      items: [
        <><strong>App:</strong> kostenlos, inklusive Katalog, Abwesenheitsnachrichten und Broadcast-Listen bis 256 Kontakte.</>,
        <><strong>API in Deutschland:</strong> 0,1131 € pro Marketing-Nachricht, 0,0456 € pro Utility-Nachricht. Seit 1. Oktober 2026 kosten auch Antworten ab der 1.001. im Monat.</>,
        <><strong>Anbieter:</strong> 49 € bis 299 € im Monat und mehr, oft mit 12 Monaten Laufzeit, plus Metas Gebühren.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-business-api-pricing", "/blog/whatsapp-business-app-vs-api"]}
    product="/whatsapp-business-api-alternative"
    cta={{ heading: <>Kundenchats mit KI beantworten.<br /><span>Ohne Gebühr pro Nachricht.</span></>, body: "Erstelle deinen KI-Agenten, füge die Infos deines Betriebs hinzu und verbinde deine WhatsApp-Nummer. Kostenlos starten, ohne Kreditkarte." }}
  />;
}
