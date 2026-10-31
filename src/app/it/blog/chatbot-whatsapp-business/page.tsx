import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Steps } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Ricerche obiettivo: "chatbot whatsapp business" (56, 3/3), "bot whatsapp"
// (30, 3/3), "chatbot whatsapp business gratis" (29, 3/3), "come creare un
// bot su whatsapp" (20), "chatbot per whatsapp" (20), "bot whatsapp business"
// (17), "chatbot whatsapp n8n" (14), "bot whatsapp github" (15),
// autocomplete IT 2026-10-28. "chatbot whatsapp gratis" resta alla pagina
// /it/chatbot-whatsapp-gratis, a cui questo articolo rimanda. Versione
// inglese: /blog/what-is-a-whatsapp-chatbot.
const href = "/it/blog/chatbot-whatsapp-business";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "it", article: { publishedTime: post.published, modifiedTime: post.updated } });

const kinds = [
  ["Come risponde", "Testo fisso uguale per tutti", "Menu a pulsanti e percorsi prestabiliti", "Capisce la domanda e risponde con le tue informazioni"],
  ["Domande fuori dallo schema", "Non le gestisce", "Rimanda al menu o a un operatore", "Risponde, o passa a una persona"],
  ["Dove si imposta", "App WhatsApp Business", "Piattaforma con l’API", "Piattaforma AI"],
  ["Costo tipico", "Gratis", "Canone + tariffe Meta", "Da gratis a canone + tariffe Meta"],
];

const ways = [
  ["Cosa serve", "Account Meta, numero sull’API, fornitore", "Server, n8n o codice, chiave AI, numero sull’API", "Un account e un codice QR"],
  ["Tempo di attivazione", "Da poche ore a qualche giorno, più l’approvazione dei modelli", "Giorni di lavoro tecnico", "Circa 15 minuti"],
  ["Costo", "Canone del fornitore + tariffe Meta", "Hosting + AI + tariffe Meta", "Gratis per ora"],
  ["Tipo di bot", "Menu e flussi, AI spesso a parte", "Quello che costruisci", "AI con le tue informazioni"],
  ["Invii massivi", "Sì", "Sì", "No"],
  ["Ufficiale Meta", "Sì", "Sì (con l’API)", "No, si collega come WhatsApp Web"],
];

const steps = [
  { title: "Crea un account gratis", body: "Registrati su Wapzen. Non servono carta di credito, account Meta o API ufficiale." },
  { title: "Crea un agente di chat", body: "Dagli un nome e scrivi le istruzioni: chi è, che tono usa, cosa può dire e cosa no, quando passare la chat a una persona. Scegli un modello GPT di OpenAI o Claude di Anthropic." },
  { title: "Aggiungi una knowledge base", body: "Incolla domande frequenti, prezzi, orari e condizioni, o carica PDF e documenti Word. L’AI risponde a partire da qui." },
  { title: "Collega il tuo WhatsApp", body: "Inquadra il codice QR con il telefono, come per WhatsApp Web. Funziona con WhatsApp Business o con il WhatsApp normale." },
  { title: "Prova e correggi", body: "Scrivi al tuo numero da un altro telefono e fai le domande dei tuoi clienti. Se una risposta non va, sistema istruzioni o knowledge base e riprova." },
];

const faqs = [
  { q: "Cos’è un chatbot WhatsApp Business?", a: "È un programma che risponde in automatico ai messaggi che i clienti mandano al numero WhatsApp di un'attività. Può essere un menu a pulsanti con percorsi prestabiliti oppure un'AI che capisce la domanda e risponde con le informazioni dell'attività, come prezzi, orari e disponibilità." },
  { q: "Come si crea un bot su WhatsApp?", a: "Ci sono tre strade: una piattaforma che usa l'API ufficiale di WhatsApp (per esempio Spoki, Callbell o WATI), un bot fai da te con n8n o codice da GitHub, oppure un'AI collegata al tuo numero con un codice QR, come fa Wapzen. L'ultima è la più rapida: circa 15 minuti, senza codice." },
  { q: "Esiste un chatbot per WhatsApp Business gratis?", a: "Sì. Wapzen è gratuito al momento, con chatbot AI, knowledge base e agente vocale inclusi, senza carta di credito. L'app WhatsApp Business ha anche messaggi automatici gratuiti, ma sono testi fissi che non rispondono alle domande." },
  { q: "Serve l’API ufficiale per avere un chatbot su WhatsApp?", a: "No. L'API serve per invii massivi, team numerosi e integrazioni. Per rispondere con l'AI ai clienti che ti scrivono puoi collegare il numero come dispositivo, con un codice QR. Wapzen non è un prodotto ufficiale Meta: se ti serve la piattaforma ufficiale, scegli un fornitore dell'API." },
  { q: "Il chatbot risponde anche ai messaggi vocali e nei gruppi?", a: "Dipende dalla piattaforma. L'agente di chat di Wapzen risponde ai messaggi di testo nelle chat singole: gruppi, vocali e foto restano a te. Per parlare a voce con i clienti c'è l'agente vocale, che risponde alle chiamate WhatsApp." },
  { q: "Devo dire ai clienti che parlano con un’AI?", a: "È buona pratica e, con l'AI Act europeo, sta diventando un obbligo: le persone devono sapere quando interagiscono con un sistema di AI, a meno che non sia evidente. Basta una riga nel messaggio di benvenuto o nelle istruzioni dell'agente." },
];

const sources = [
  { label: "Meta: WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/" },
  { label: "Meta: prezzi della WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Commissione europea: AI Act", href: "https://digital-strategy.ec.europa.eu/it/policies/regulatory-framework-ai" },
  { label: "Centro assistenza WhatsApp: collegare un dispositivo", href: "https://faq.whatsapp.com/1317564962315842" },
];

const sections = [
  {
    id: "cos-e",
    title: "Cos’è un chatbot WhatsApp Business",
    body: <>
      <p>Un <strong>chatbot WhatsApp Business</strong> è un programma che risponde da solo ai messaggi che i clienti mandano al numero WhatsApp della tua attività. Il cliente scrive come scriverebbe a una persona, e il bot risponde in pochi secondi, anche di notte e nei festivi.</p>
      <p>Sotto lo stesso nome stanno però tre cose molto diverse:</p>
      <Comparison caption="Messaggi automatici, bot a menu e chatbot AI a confronto" columns={["Messaggio automatico", "Bot a menu", "Chatbot AI"]} rows={kinds} />
      <p>I <Link href="/it/blog/messaggi-automatici-whatsapp-business">messaggi automatici</Link> dell’app WhatsApp Business non sono un vero chatbot: mandano sempre lo stesso testo. I bot a menu (“scrivi 1 per gli orari, 2 per i prezzi”) funzionano finché il cliente segue il percorso. Un <strong>chatbot AI</strong> invece capisce la domanda, anche scritta male o in un’altra lingua, e risponde con le tue informazioni.</p>
    </>,
  },
  {
    id: "come-funziona",
    title: "Come funziona un chatbot su WhatsApp",
    body: <>
      <p>Dietro ogni risposta succedono quattro cose:</p>
      <ol>
        <li><strong>Il cliente scrive</strong> al tuo numero WhatsApp, come sempre.</li>
        <li><strong>Il messaggio arriva alla piattaforma del bot</strong>, attraverso l’API ufficiale di WhatsApp oppure tramite il numero collegato come dispositivo, nello stesso modo in cui funziona WhatsApp Web.</li>
        <li><strong>Il bot decide la risposta.</strong> Un bot a menu segue le regole che hai impostato. Un chatbot AI legge la domanda, cerca nella tua knowledge base (prezzi, orari, condizioni) e scrive una risposta con un modello come GPT o Claude.</li>
        <li><strong>La risposta parte dal tuo numero</strong>, e il cliente la riceve nella stessa chat. Tu vedi tutta la conversazione e puoi intervenire quando vuoi.</li>
      </ol>
      <p>Il secondo passaggio è quello che cambia di più costi e tempi: con l’API paghi a messaggio e passi da un fornitore, con il numero collegato tramite codice QR no. Lo spieghiamo nel dettaglio nella guida su <Link href="/it/blog/whatsapp-business-costo">quanto costa WhatsApp Business</Link>.</p>
    </>,
  },
  {
    id: "tre-modi",
    title: "Come creare un bot WhatsApp: i tre modi",
    body: <>
      <h3>1. Una piattaforma con l’API ufficiale</h3>
      <p>È la strada classica per le aziende medio-grandi. Fornitori come Spoki e Callbell in Italia, o WATI e respond.io all’estero, collegano il numero all’API e offrono un editor di flussi, una inbox per il team e gli invii massivi. In cambio servono un account Meta, una verifica del numero, modelli approvati per scrivere per primi, un canone mensile e le tariffe Meta a messaggio. L’AI, quando c’è, spesso è un componente aggiuntivo.</p>
      <h3>2. Un bot fai da te con n8n o GitHub</h3>
      <p>Chi sa programmare può costruirsi il bot: con <strong>n8n</strong> colleghi la Cloud API di Meta a un modello AI con un flusso visuale; su <strong>GitHub</strong> si trovano librerie open source che si collegano a WhatsApp Web. È flessibile ma richiede tempo, un server sempre acceso e manutenzione. Le librerie non ufficiali, inoltre, possono smettere di funzionare a ogni aggiornamento di WhatsApp.</p>
      <h3>3. Un’AI collegata al tuo numero con un codice QR</h3>
      <p>È la strada più rapida per una piccola attività: non serve l’API, non serve programmare e non cambi numero. Colleghi il WhatsApp che già usi come faresti con WhatsApp Web, e un agente AI risponde ai messaggi in arrivo. È il modo in cui funziona Wapzen.</p>
      <Comparison caption="Tre modi per creare un chatbot WhatsApp a confronto" columns={["Piattaforma API", "Fai da te (n8n)", "AI con codice QR"]} rows={ways} />
    </>,
  },
  {
    id: "crearlo-gratis",
    title: "Come creare un chatbot WhatsApp Business gratis in 5 passi",
    body: <>
      <p>Con Wapzen il chatbot è pronto in circa un quarto d’ora:</p>
      <Steps items={steps} />
      <InlineCta title="Crea il tuo chatbot WhatsApp" body="Un agente AI che risponde ai clienti con le informazioni della tua attività, sul tuo numero di sempre. Al momento è gratis, senza carta di credito." label="Inizia gratis" />
      <p>Tutte le conversazioni restano salvate nella dashboard. Se metti in pausa l’agente, smette di rispondere e torni a gestire tu le chat. Trovi tutte le funzioni nella pagina del <Link href="/it/chatbot-whatsapp-gratis">chatbot WhatsApp gratis</Link>.</p>
      <p>Quando il chatbot è attivo, fallo conoscere ai clienti: con il nostro <Link href="/tools/whatsapp-qr-code-generator">generatore di codici QR per WhatsApp</Link>, gratuito e in inglese, crei un codice da stampare che apre la chat con il tuo numero.</p>
    </>,
  },
  {
    id: "esempi",
    title: "Esempi di chatbot WhatsApp per settore",
    body: <>
      <ul>
        <li><strong>Ristoranti e pizzerie.</strong> Risponde su menu, allergeni, orari e asporto, e raccoglie le richieste di prenotazione con giorno, ora e numero di persone.</li>
        <li><strong>Parrucchieri e centri estetici.</strong> Spiega servizi e prezzi e raccoglie le richieste di appuntamento. Con uno strumento API collegato all’agenda può controllare gli orari liberi e prenotare.</li>
        <li><strong>Negozi online.</strong> Risponde su taglie, spedizioni, resi e metodi di pagamento, anche il contrassegno. Con uno strumento API può verificare lo stato di un ordine.</li>
        <li><strong>Studi medici e dentistici.</strong> Dà orari, indirizzo, costi delle prime visite e documenti da portare. Non deve fare diagnosi: istruiscilo a passare a una persona per tutto ciò che è clinico.</li>
        <li><strong>Agenzie immobiliari.</strong> Risponde sugli annunci, raccoglie budget e zona di chi cerca casa e propone una visita.</li>
        <li><strong>Hotel e B&B.</strong> Risponde su check-in, parcheggio, colazione e servizi, in italiano, inglese o tedesco a seconda di chi scrive.</li>
      </ul>
    </>,
  },
  {
    id: "buone-pratiche",
    title: "Limiti e buone pratiche",
    body: <>
      <ul>
        <li><strong>Di’ che è un’AI.</strong> L’AI Act europeo chiede di far sapere alle persone quando interagiscono con un sistema di AI. Una riga nel primo messaggio basta.</li>
        <li><strong>Prevedi il passaggio a una persona.</strong> Scrivi nelle istruzioni quando l’AI deve fermarsi e dire che risponderà qualcuno del team: reclami, pagamenti, casi particolari.</li>
        <li><strong>Tieni aggiornata la knowledge base.</strong> L’AI risponde con quello che le dai: prezzi vecchi diventano risposte sbagliate.</li>
        <li><strong>Attenzione ai dati personali.</strong> Valgono le regole del GDPR: indica nell’informativa privacy che usi un assistente AI e non chiedere in chat dati che non ti servono.</li>
        <li><strong>Non usarlo per lo spam.</strong> Un chatbot risponde a chi ti scrive. Per le promozioni a molti contatti servono il consenso e l’API ufficiale.</li>
      </ul>
      <Note>L’agente di chat di Wapzen risponde ai messaggi di testo nelle chat singole, non nei gruppi. Vocali, foto e documenti restano a te.</Note>
    </>,
  },
];

export default function ChatbotWhatsAppBusinessPage() {
  return <BlogPost
    href={href}
    heading={<>Chatbot WhatsApp Business.<br /><span>Cos’è e come crearlo gratis.</span></>}
    lead="Un chatbot su WhatsApp risponde ai clienti al posto tuo, giorno e notte. Ecco cos’è, come funziona dietro le quinte, i tre modi per creare un bot WhatsApp, quanto costa ed esempi per ristoranti, negozi e studi."
    summary={{
      title: "In breve",
      items: [
        <><strong>Un chatbot WhatsApp Business</strong> risponde in automatico ai messaggi che arrivano al numero della tua attività.</>,
        <><strong>Ne esistono di tre tipi:</strong> messaggi automatici fissi, bot a menu e chatbot AI che capiscono la domanda.</>,
        <><strong>Puoi crearlo</strong> con una piattaforma API (Spoki, Callbell, WATI), con n8n o codice, oppure collegando un’AI al tuo numero con un codice QR.</>,
        <><strong>Con l’API</strong> paghi canone e tariffe Meta; con un’AI collegata tramite QR, come Wapzen, oggi puoi farlo gratis.</>,
        <><strong>Di’ ai clienti che parlano con un’AI</strong> e prevedi sempre il passaggio a una persona.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/it/blog/whatsapp-business-costo", "/it/blog/chatgpt-whatsapp"]}
    product="/it/chatbot-whatsapp-gratis"
    cta={{ heading: <>Il tuo chatbot WhatsApp Business.<br /><span>Pronto in 15 minuti.</span></>, body: "Crea l’agente, insegnagli come funziona la tua attività e collega il tuo numero con un codice QR. Al momento è gratis." }}
  />;
}
