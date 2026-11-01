import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Suchanfragen (docs/seo-blog-voice-research.mjs de, 2026-11-01): „ki telefonassistent
// kostenlos" (81, stärkste Phrase), „ki telefonassistent arztpraxis" (38), „ki
// telefonassistent" (30), „ki anrufe" (30), „ki telefonassistent test" (30), „ki
// rezeptionist" (30), „whatsapp ki agent" (30), „ki telefonassistent handwerk" (28),
// „ki telefonassistent kosten" (27), „ki telefonassistent dsgvo" (25). Wer so sucht,
// will meist die Festnetznummer beantwortet haben: Wapzen beantwortet nur
// WhatsApp-Anrufe, das steht deshalb ganz oben. Die Sprachfunktion ist im Early Access,
// darum führt der CTA zu WhatsApp statt zur Registrierung. Preise von IONOS (inkl.
// MwSt.) und fonio (netto) am 01.11.2026 auf den Anbieterseiten geprüft. Kein AVV
// veröffentlicht, kein Impressum: nichts davon behaupten.
const href = "/de/blog/ki-telefonassistent-whatsapp-kostenlos";
const post = blogPost(href);
const earlyAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hallo, ich möchte frühen Zugang zum Wapzen-Sprachagenten für mein Unternehmen in Deutschland.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "de", article: { publishedTime: post.published, modifiedTime: post.updated } });

const routes = [
  ["Welche Anrufe", "Anrufe auf Ihre Festnetz- oder Mobilnummer", "WhatsApp-Anrufe auf Ihre WhatsApp-Nummer"],
  ["Wer erreicht Sie", "Jeder mit Telefon", "Nur Kunden mit WhatsApp"],
  ["Weiterleiten an Mitarbeiter", "Meist möglich", "Nicht möglich: Der Assistent schickt den Kontakt per Nachricht"],
  ["Kosten", "Monatspreis, oft mit Anruf- oder Minutenkontingent", "Ohne Minutenpreis, kostenlos starten im Early Access"],
  ["Einrichtung", "Rufumleitung beim Anbieter einstellen", "WhatsApp-Nummer als verknüpftes Gerät verbinden"],
];

const prices = [
  ["IONOS KI-Telefonassistent", "Flex 39 € (30 Anrufe, danach 0,49 € pro Anruf), Flex Pro 69 € (100 Anrufe, danach 0,39 €), All-Flat Advanced 99 €", "Inkl. MwSt., monatlich kündbar, derzeit 1 Monat gratis testen"],
  ["fonio.ai", "Solo 99 € (1.000 Minuten), Team 299 € (3.600 Minuten), Scale ab 539 €", "Netto bei jährlicher Abrechnung, monatlich 119 € bzw. 359 €. 30 Tage Geld-zurück-Garantie"],
  ["Wapzen", "Kostenlos starten im Early Access, ohne Minutenpreis", "Nur WhatsApp-Anrufe. Für hohes Anrufvolumen vereinbaren wir einen bezahlten Tarif"],
];

const does = [
  ["WhatsApp-Anrufe annehmen", "Ja, rund um die Uhr, auf Ihrer bestehenden Nummer"],
  ["Interessenten per WhatsApp anrufen", "Ja, sobald Sie einen Kontakt einer Kampagne hinzufügen, auch per API aus Ihrem Formular oder CRM"],
  ["Mit Ihrem Wissen antworten", "Ja, aus Ihrer Wissensdatenbank (Text, PDF oder Word)"],
  ["Während des Anrufs eine Nachricht schicken", "Ja, etwa einen Link, die Adresse oder die Bitte um Fotos"],
  ["Termine in Ihrem System prüfen", "Mit einem API-Tool. Testen Sie es mehrmals, bevor Sie sich darauf verlassen"],
  ["Gespräche festhalten", "Ja, Anrufliste und Transkript im Dashboard"],
  ["An einen Mitarbeiter durchstellen", "Nein. Der Assistent beendet das Gespräch und schickt den Kontakt per Nachricht"],
  ["Festnetz oder Mobilfunk anrufen", "Nein, nur WhatsApp-Anrufe"],
];

const limits = [
  ["Nur WhatsApp", "Kunden ohne WhatsApp erreicht der Assistent nicht", "Behalten Sie Ihre Festnetznummer, mit Mailbox oder einem Festnetz-Assistenten"],
  ["Keine Weiterleitung", "Kein Durchstellen an Mitarbeiter", "Der Assistent schickt die Durchwahl oder den WhatsApp-Kontakt und notiert das Anliegen"],
  ["Kurze Pause", "Etwa ein bis zwei Sekunden vor jeder Antwort", "Kurze Sätze in den Anweisungen verlangen"],
  ["Verknüpftes Gerät", "Nicht die offizielle API von Meta", "Nur Menschen anrufen, die Ihren Anruf erwarten, sonst droht eine Sperre der Nummer"],
  ["Einfache Kampagnen", "Keine automatische Wahlwiederholung, kein Tabellen-Import", "Kontakte einzeln oder per API hinzufügen"],
  ["Early Access", "Die Sprachfunktion wird mit unserem Team eingerichtet", "Schreiben Sie uns auf WhatsApp"],
];

const faqs = [
  { q: "Gibt es einen KI-Telefonassistenten kostenlos?", a: "Für die Festnetznummer kaum dauerhaft: IONOS bietet derzeit einen Gratismonat, fonio eine 30-Tage-Geld-zurück-Garantie, danach zahlen Sie monatlich. Für WhatsApp-Anrufe können Sie den Sprachagenten von Wapzen im Early Access kostenlos starten, ohne Minutenpreis. Für hohes Anrufvolumen vereinbaren wir einen bezahlten Tarif." },
  { q: "Kann ein KI-Telefonassistent meine Festnetznummer beantworten?", a: "Wapzen nicht: Der Sprachagent beantwortet nur WhatsApp-Anrufe auf Ihre WhatsApp-Nummer. Für das Festnetz brauchen Sie einen Anbieter mit Rufumleitung, etwa IONOS oder fonio. Viele Betriebe nutzen beides." },
  { q: "Was kostet ein KI-Telefonassistent?", a: "Bei IONOS 39 € bis 99 € im Monat inklusive MwSt., je nach Anrufkontingent. Bei fonio ab 99 € netto im Monat bei jährlicher Abrechnung, mit 1.000 Minuten. Auf WhatsApp entfällt der Minutenpreis, und Wapzen ist im Early Access kostenlos zu starten." },
  { q: "Ist ein KI-Telefonassistent DSGVO-konform?", a: "Das hängt vom Anbieter und von Ihrem Einsatz ab: Sie brauchen einen Auftragsverarbeitungsvertrag und müssen Anrufer informieren. Wapzen speichert Daten in Singapur, nutzt Server in Singapur und Deutschland und KI-Anbieter in den USA. Einen AVV veröffentlichen wir nicht. Fragen Sie uns auf WhatsApp, bevor Sie personenbezogene Daten verarbeiten." },
  { q: "Eignet sich ein KI-Telefonassistent für die Arztpraxis?", a: "Für allgemeine Auskünfte wie Sprechzeiten, Urlaubsvertretung oder Adresse ja. Gesundheitsdaten sind nach Art. 9 DSGVO besonders geschützt. Ohne AVV und Datenschutz-Folgenabschätzung sollte ein Assistent keine Symptome, Diagnosen oder Patientendaten aufnehmen." },
  { q: "Darf eine KI Kunden anrufen?", a: "Nur mit Einwilligung. Werbeanrufe bei Verbrauchern brauchen nach § 7 UWG eine vorherige ausdrückliche Einwilligung. Ruft eine KI selbstständig an, kann sie als automatische Anrufmaschine gelten, und dann gilt das auch gegenüber Unternehmen. Die Bundesnetzagentur kann Bußgelder bis 300.000 € verhängen. Rufen Sie nur an, wer darum gebeten hat, und dokumentieren Sie das." },
  { q: "Muss der Assistent sagen, dass er eine KI ist?", a: "Ja. Seit dem 2. August 2026 gilt Art. 50 des AI Act: Menschen müssen erfahren, dass sie mit einer KI sprechen, wenn das nicht offensichtlich ist. Wapzen fügt keinen Hinweis automatisch hinzu, schreiben Sie ihn deshalb in die Begrüßung." },
];

const sources = [
  { label: "IONOS: KI-Telefonassistent, Tarife", href: "https://www.ionos.de/telefon" },
  { label: "fonio.ai: Preise", href: "https://www.fonio.ai/de/preise" },
  { label: "Gesetz gegen den unlauteren Wettbewerb, § 7", href: "https://www.gesetze-im-internet.de/uwg_2004/__7.html" },
  { label: "Gesetz gegen den unlauteren Wettbewerb, § 7a", href: "https://www.gesetze-im-internet.de/uwg_2004/__7a.html" },
  { label: "Bundesnetzagentur: Unerlaubte Telefonwerbung", href: "https://www.bundesnetzagentur.de/DE/Vportal/TK/Aerger/Faelle/UEW/start.html" },
  { label: "EUR-Lex: Verordnung (EU) 2024/1689 (AI Act)", href: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj" },
];

const sections = [
  {
    id: "kurze-antwort",
    title: "Gibt es einen KI-Telefonassistenten kostenlos?",
    body: <>
      <p>Für Ihre <strong>Festnetznummer</strong> kaum dauerhaft. Die bekannten Anbieter kosten monatlich: IONOS ab 39 € inklusive MwSt., fonio ab 99 € netto bei jährlicher Abrechnung. Kostenlos sind dort nur Testphasen, etwa ein Gratismonat bei IONOS.</p>
      <p>Für <strong>WhatsApp-Anrufe</strong> sieht es anders aus. Dort fallen keine Telefonminuten an, und der Sprachagent von <strong>Wapzen</strong> lässt sich im Early Access kostenlos starten. Er nimmt WhatsApp-Anrufe auf Ihrer bestehenden Nummer an, antwortet mit dem Wissen Ihres Betriebs und ruft Interessenten per WhatsApp zurück. Ihr Festnetz beantwortet er nicht.</p>
      <p>Dieser Ratgeber zeigt, wann sich ein KI-Telefonassistent für WhatsApp lohnt, was er kann, was er kostet und was UWG, DSGVO und AI Act verlangen.</p>
    </>,
  },
  {
    id: "festnetz-oder-whatsapp",
    title: "Festnetz oder WhatsApp: Welche Anrufe soll die KI annehmen?",
    body: <>
      <p>Ein KI-Telefonassistent für das Festnetz hängt an Ihrer Rufnummer: Sie leiten Anrufe bei Ihrem Anbieter um, und die KI nimmt ab. Ein Sprachagent für WhatsApp hängt an Ihrer WhatsApp-Nummer: Er nimmt die Anrufe an, die Kunden über den Anruf-Button im Chat starten.</p>
      <Comparison caption="KI-Telefonassistent für das Festnetz und Sprachagent für WhatsApp im Vergleich" columns={["Festnetz-Assistent", "WhatsApp-Sprachagent"]} rows={routes} />
      <p>WhatsApp lohnt sich, wenn Ihre Kunden ohnehin dort schreiben: Handwerksbetriebe mit Anfragen per WhatsApp, Werkstätten, die den Status per Chat schicken, oder Ferienwohnungen mit Gästen aus dem Ausland. Wer schon im Chat ist, tippt auf „Anrufen“, statt die Festnetznummer herauszusuchen. Und wer bisher WhatsApp-Anrufe abgeschaltet hat, weil niemand rangehen konnte, verliert diese Kunden nicht mehr.</p>
    </>,
  },
  {
    id: "kosten",
    title: "Was kostet ein KI-Telefonassistent 2026?",
    body: <>
      <p>Die Preise der bekannten Anbieter, geprüft am 1. November 2026:</p>
      <Comparison caption="Preise von IONOS, fonio und Wapzen im Vergleich" columns={["Tarife", "Hinweise"]} rows={prices} />
      <p>IONOS rechnet nach Anrufen ab, fonio nach Minuten. Bei 60 Anrufen im Monat zahlen Sie bei IONOS im Flex-Tarif 39 € plus 30 × 0,49 €, also 53,70 €. Ein KI-Telefonassistent fürs Festnetz bleibt sinnvoll, wenn viele Kunden klassisch anrufen. Die WhatsApp-Anrufe können Sie zusätzlich ohne Minutenpreis abdecken.</p>
      <InlineCta href={earlyAccess} title="Sprachagent für WhatsApp testen" body="Die Sprachfunktion von Wapzen ist im Early Access und kostenlos zu starten. Schreiben Sie uns auf WhatsApp, wir richten sie mit Ihnen ein." label="Frühen Zugang anfragen" />
    </>,
  },
  {
    id: "funktionen",
    title: "Was der Sprachagent kann, und was nicht",
    body: <>
      <Comparison caption="Was der Sprachagent von Wapzen auf WhatsApp kann" columns={["Kann er das?"]} rows={does} />
      <p>Besonders nützlich im Vertrieb ist der sofortige Rückruf. Wenn Ihr Kontaktformular oder CRM einen Interessenten per API zur Kampagne hinzufügt, ruft der Agent ihn sofort per WhatsApp an. Der Interessent hat um Kontakt gebeten, er erwartet den Anruf, und Sie haben seine Einwilligung dokumentiert.</p>
    </>,
  },
  {
    id: "branchen",
    title: "Für welche Betriebe lohnt sich das?",
    body: <>
      <ul>
        <li><strong>Handwerk:</strong> Notdienst-Anfragen annehmen, Ort und Problem aufnehmen und per Nachricht um Fotos bitten. Der Meister ruft zurück, wenn er von der Baustelle kommt. Mehr im Artikel <Link href="/de/blog/whatsapp-chatbot-handwerker-kostenlos">WhatsApp Chatbot für Handwerker</Link>.</li>
        <li><strong>Autohaus und Kfz-Werkstatt:</strong> Fragen zu Inspektion, Öffnungszeiten und Ersatzwagen beantworten und den Terminwunsch notieren, oder ihn per API-Tool direkt im Werkstattsystem eintragen.</li>
        <li><strong>Steuerberater und Kanzleien:</strong> Erreichbarkeit, Fristen-Grundinfos und die Liste der benötigten Unterlagen, per Nachricht hinterher. Keine Steuerberatung durch die KI.</li>
        <li><strong>Hotels und Ferienwohnungen:</strong> Gäste aus dem Ausland erreichen Sie per WhatsApp ohne Auslandstarif. Der Agent antwortet in ihrer Sprache zu Anreise, Check-in und Parken.</li>
        <li><strong>Arztpraxis:</strong> nur für allgemeine Auskünfte wie Sprechzeiten, Urlaubsvertretung und Adresse. Für Termine nutzen Sie besser Ihr Praxissystem, und Gesundheitsdaten gehören ohne AVV nicht in einen KI-Assistenten.</li>
      </ul>
    </>,
  },
  {
    id: "beispiel",
    title: "So klingt ein Anruf beim Sprachagenten",
    body: <>
      <Note>Beispielgespräch. Betrieb, Name und Zeiten sind erfunden. Der Agent antwortet nur mit dem, was in Ihrer Wissensdatenbank steht.</Note>
      <p><strong>Kunde:</strong> „Hallo, bei uns tropft seit heute früh der Heizkörper im Bad. Kommen Sie da noch diese Woche?“</p>
      <p><strong>Agent:</strong> „Guten Tag, hier ist der digitale Assistent von Haustechnik [Name]. Das Gespräch wird als Text festgehalten. Ich nehme Ihr Anliegen gern auf. In welchem Ort sind Sie?“</p>
      <p><strong>Kunde:</strong> „In Bochum-Linden.“</p>
      <p><strong>Agent:</strong> „Danke. Das liegt in unserem Einsatzgebiet. Ich schicke Ihnen gleich eine Nachricht. Wenn Sie dort ein Foto vom Heizkörper senden, kann Herr Krüger besser einschätzen, was er mitbringen muss. Er meldet sich heute bis 17 Uhr. Wie ist Ihr Name?“</p>
      <p><strong>Kunde:</strong> „Weber.“</p>
      <p><strong>Agent:</strong> „Vielen Dank, ich habe alles notiert. Die Nachricht ist unterwegs. Kann ich sonst noch helfen?“</p>
      <p>Was der Agent nicht getan hat: Er hat keinen Termin zugesagt und keinen Preis genannt, weil beides nicht in seinen Anweisungen stand.</p>
    </>,
  },
  {
    id: "recht",
    title: "UWG, DSGVO und AI Act: Was Sie beachten müssen",
    body: <>
      <p><strong>Anrufe bei Kunden (UWG).</strong> Werbeanrufe bei Verbrauchern sind nach § 7 Abs. 2 Nr. 1 UWG nur mit vorheriger ausdrücklicher Einwilligung erlaubt, bei sonstigen Marktteilnehmern genügt dort eine mutmaßliche Einwilligung. Ruft aber eine KI selbstständig an, kann das als Werbung mit einer automatischen Anrufmaschine nach § 7 Abs. 2 Nr. 2 UWG gelten, und dann braucht es auch bei Unternehmen eine vorherige ausdrückliche Einwilligung. Gerichtlich geklärt ist das für KI-Agenten noch nicht, gehen Sie also vom strengeren Fall aus. Nach § 7a UWG müssen Sie die Einwilligung dokumentieren und fünf Jahre aufbewahren. Die Bundesnetzagentur kann für unerlaubte Werbeanrufe Bußgelder bis 300.000 € verhängen, für fehlende Dokumentation bis 50.000 €. Behandeln Sie einen WhatsApp-Anruf wie einen Telefonanruf. Kaltakquise per KI ist tabu.</p>
      <p><strong>Datenschutz (DSGVO).</strong> Informieren Sie Anrufer, dass ein KI-System das Gespräch führt und dass es als Transkript gespeichert wird. Wapzen speichert Daten in Singapur, nutzt Server in Singapur und Deutschland und KI-Anbieter in den USA. Einen Auftragsverarbeitungsvertrag (AVV) veröffentlichen wir nicht. Fragen Sie uns auf WhatsApp, bevor Sie personenbezogene Kundendaten verarbeiten, und verarbeiten Sie keine Gesundheitsdaten ohne passende Grundlage.</p>
      <p><strong>KI-Hinweis (AI Act).</strong> Seit dem 2. August 2026 gilt Art. 50 der KI-Verordnung: Menschen müssen erfahren, dass sie mit einer KI sprechen, wenn das nicht offensichtlich ist. Wapzen fügt keinen solchen Hinweis automatisch hinzu, also gehört er in Ihre Begrüßung, wie im Beispiel oben.</p>
      <p>Das ist eine allgemeine Orientierung, keine Rechtsberatung. Lassen Sie Ihren Einsatz von Ihrer Kanzlei oder Ihrem Datenschutzbeauftragten prüfen.</p>
    </>,
  },
  {
    id: "einrichten",
    title: "So richten Sie den Sprachagenten ein",
    body: <>
      <p>Die Sprachfunktion ist im Early Access und wird gemeinsam mit unserem Team eingerichtet:</p>
      <h3>1. Schreiben Sie uns auf WhatsApp</h3>
      <p>Nennen Sie Ihre Branche, wie viele WhatsApp-Anrufe Sie bekommen und ob der Agent auch Interessenten zurückrufen soll.</p>
      <h3>2. Anweisungen und Begrüßung schreiben</h3>
      <blockquote>„Du bist der digitale Assistent von [Betrieb] in [Ort]. Sprich Deutsch und sieze die Anrufer. Sag zu Beginn, dass du ein digitaler Assistent bist und das Gespräch als Text festgehalten wird. Antworte nur mit dem Wissen aus deiner Wissensdatenbank und erfinde keine Preise, Termine oder Zusagen. Stell eine Frage nach der anderen. Wenn jemand verhandeln, sich beschweren oder mit einem Menschen sprechen möchte, schick ihm per Nachricht die Nummer von [Name] und sag, dass er zurückruft. Frag nie nach Bankdaten oder Passwörtern.“</blockquote>
      <h3>3. Wissen hinterlegen</h3>
      <p>Leistungen, Einsatzgebiet, Öffnungszeiten, häufige Fragen und Preisrahmen, als Text, PDF oder Word. Aktualisieren Sie es, sobald sich etwas ändert.</p>
      <h3>4. Nummer verbinden</h3>
      <p>Am besten eine eigene WhatsApp-Nummer für den Kundendienst, denn der Agent nimmt alle WhatsApp-Anrufe auf dieser Nummer an.</p>
      <h3>5. Testen, bevor Sie die Nummer bewerben</h3>
      <p>Rufen Sie selbst an, fragen Sie nach einem Rabatt und nach etwas, das nicht in Ihrem Wissen steht. Der Agent soll sagen, dass er es nicht weiß, und den Kontakt weitergeben, statt zu improvisieren.</p>
    </>,
  },
  {
    id: "grenzen",
    title: "Die Grenzen von Wapzen",
    body: <>
      <Comparison caption="Grenzen des Sprachagenten von Wapzen und wie Sie damit umgehen" columns={["Was passiert", "So gehen Sie damit um"]} rows={limits} />
      <Choose locale="de" highlight="Wapzen" items={[
        { name: "einen Festnetz-Assistenten", points: ["Die meisten Kunden rufen Ihre Festnetznummer an", "Anrufe sollen an Mitarbeiter durchgestellt werden", "Sie brauchen Termine direkt im Kalender"] },
        { name: "Wapzen", points: ["Ihre Kunden schreiben Ihnen schon auf WhatsApp", "Sie wollen WhatsApp-Anrufe ohne Minutenpreis annehmen", "Sie wollen Interessenten sofort zurückrufen, die darum gebeten haben"] },
      ]} />
      <p>Wapzen ist ein unabhängiges Produkt und gehört weder zu Meta noch zu WhatsApp.</p>
    </>,
  },
];

export default function KiTelefonassistentWhatsAppPage() {
  return <BlogPost
    href={href}
    heading={<>KI-Telefonassistent kostenlos?<br /><span>Für WhatsApp-Anrufe geht das.</span></>}
    lead="Ein KI-Telefonassistent für die Festnetznummer kostet monatlich. Für die Anrufe, die Kunden über WhatsApp starten, gibt es einen Weg ohne Minutenpreis: einen KI-Sprachagenten auf Ihrer WhatsApp-Nummer. Hier sehen Sie, was er kann, was die bekannten Anbieter kosten und was UWG, DSGVO und AI Act verlangen."
    summary={{
      title: "Das Wichtigste in Kürze",
      items: [
        <><strong>Festnetz:</strong> IONOS kostet 39 € bis 99 € im Monat inkl. MwSt., fonio ab 99 € netto. Kostenlos sind nur Testphasen.</>,
        <><strong>WhatsApp:</strong> Der Sprachagent von Wapzen nimmt WhatsApp-Anrufe an und ist im Early Access kostenlos zu starten.</>,
        <><strong>Grenzen:</strong> kein Festnetz, kein Durchstellen an Mitarbeiter, nur Kunden mit WhatsApp.</>,
        <><strong>Recht:</strong> Werbeanrufe nur mit Einwilligung (§ 7 UWG), KI-Hinweis in der Begrüßung (AI Act), Datenschutz vorab klären.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/de/blog/whatsapp-chatbot-handwerker-kostenlos", "/de/blog/whatsapp-ki-chatbot-autohaus-kfz-werkstatt"]}
    product="/free-ai-calling-agent"
    cta={{ heading: <>Kein WhatsApp-Anruf mehr ohne Antwort.<br /><span>Testen Sie den Sprachagenten.</span></>, body: "Die Sprachfunktion von Wapzen ist im Early Access und kostenlos zu starten. Schreiben Sie uns auf WhatsApp, wir richten Ihren Agenten mit Ihnen ein." }}
    action={{ href: earlyAccess, label: "Frühen Zugang anfragen" }}
  />;
}
