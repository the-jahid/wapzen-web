import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Ricerche obiettivo: "whatsapp business costo" (30, 3/3), "…costo italia"
// (25), "costo whatsapp business api" (25), "quanto costa whatsapp business
// api" (20), "whatsapp business è a pagamento" (20), "whatsapp business è
// gratis" (13), autocomplete IT 2026-10-28. Le tariffe sono il listino Meta in
// euro per l'Italia in vigore dal 1° ottobre 2026 (due ristampe indipendenti
// concordano). Meta aggiorna i prezzi ogni trimestre (1 gen/apr/lug/ott):
// ricontrolla tabella ed esempi e aggiorna `updated`. Versione inglese:
// /blog/whatsapp-business-api-pricing.
const href = "/it/blog/whatsapp-business-costo";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "it", article: { publishedTime: post.published, modifiedTime: post.updated } });

const overview = [
  ["Cos’è", "L’app con la “B” per smartphone", "L’accesso per software, tramite Meta o un fornitore"],
  ["Costo di Meta", "Gratis", "A messaggio, in base a categoria e Paese"],
  ["Costo del fornitore", "Nessuno", "Di solito un canone mensile, a volte un ricarico a messaggio"],
  ["Chi risponde", "Tu, a mano", "Un software, un chatbot o un team"],
  ["Adatto a", "Piccole attività", "Invii massivi, team numerosi, integrazioni"],
];

const categories = [
  ["Cos’è", "Offerte, promozioni, inviti a tornare", "Conferme d’ordine, spedizioni, promemoria", "Codici di verifica (OTP)", "Risposte libere a un cliente"],
  ["Serve un modello approvato", "Sì", "Sì", "Sì", "No"],
  ["Quando puoi inviarlo", "Sempre, a chi ha dato il consenso", "Sempre, a chi ha dato il consenso", "Sempre", "Solo entro 24 ore dall’ultimo messaggio del cliente"],
  ["Si paga", "Ogni messaggio consegnato", "Ogni messaggio consegnato", "Ogni messaggio consegnato", "Oltre i primi 1.000 al mese per numero"],
];

const rates = [
  ["Marketing", "0,0658 €"],
  ["Utility", "0,0248 €"],
  ["Autenticazione", "0,0248 €"],
  ["Servizio", "Gratis i primi 1.000 al mese per numero, poi 0,0248 €"],
];

const faqs = [
  { q: "WhatsApp Business è a pagamento?", a: "No, l'app WhatsApp Business è gratuita: scaricarla, usarla e scrivere ai clienti non costa nulla, come il WhatsApp normale. Si paga solo la WhatsApp Business API (la piattaforma per i software), che Meta fattura a messaggio, più l'eventuale canone del fornitore." },
  { q: "Quanto costa un messaggio WhatsApp Business API in Italia?", a: "Dal 1° ottobre 2026 Meta applica, per i numeri italiani, 0,0658 € per un messaggio marketing e 0,0248 € per un messaggio utility o di autenticazione, prima delle imposte e delle commissioni del fornitore. Le risposte ai clienti sono gratis fino a 1.000 al mese per numero, poi costano 0,0248 € l'una." },
  { q: "Le risposte ai clienti su WhatsApp sono ancora gratis?", a: "Con l'app WhatsApp Business sì. Con l'API solo le prime 1.000 al mese per numero aziendale: dal 1° ottobre 2026 Meta fa pagare le risposte oltre questa soglia alla tariffa utility, cioè 0,0248 € in Italia. La soglia non si accumula da un mese all'altro." },
  { q: "Si pagano i messaggi che mi mandano i clienti?", a: "No. Meta non fa pagare i messaggi che i clienti inviano all'azienda. Alcuni fornitori però contano i messaggi in entrambe le direzioni nei loro piani, quindi controlla il listino del fornitore." },
  { q: "Quanto costa WhatsApp Business API al mese?", a: "Dipende dai volumi. Uno studio con un migliaio di promemoria al mese spende meno di 100 € di tariffe Meta, un negozio online con promozioni regolari può superare i 400 €. A questo si aggiunge il canone del fornitore, spesso tra le decine e le centinaia di euro al mese." },
  { q: "Esiste un’alternativa gratis all’API per rispondere con l’AI?", a: "Sì. Wapzen collega il tuo numero WhatsApp con un codice QR, come WhatsApp Web, e lascia rispondere un'AI ai messaggi in arrivo senza tariffe Meta a messaggio. Al momento è gratuito. Non invia messaggi massivi: per le campagne broadcast l'API ufficiale resta lo strumento giusto." },
];

const sources = [
  { label: "Meta: prezzi della WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Ristampa del listino in euro: FlowCall", href: "https://www.flowcall.co/blog/whatsapp-business-api-pricing" },
  { label: "Ristampa del listino per l’Italia: Tissquad", href: "https://tissquad.com/it/blog/whatsapp-business-api-costi-notifiche-ordini/" },
  { label: "Meta: limiti di messaggistica", href: "https://developers.facebook.com/docs/whatsapp/messaging-limits" },
];

const sections = [
  {
    id: "in-breve",
    title: "WhatsApp Business è gratis? La risposta breve",
    body: <>
      <p>Quando si chiede quanto costa WhatsApp Business si parla in realtà di due prodotti diversi. L’<strong>app WhatsApp Business</strong>, quella con la “B” nell’icona, è <strong>gratuita</strong>: la scarichi, registri il numero e rispondi ai clienti senza pagare nulla. La <strong>WhatsApp Business API</strong>, che Meta oggi chiama WhatsApp Business Platform, è invece a pagamento: Meta fa pagare ogni messaggio inviato dall’azienda, e quasi sempre c’è anche il canone di un fornitore.</p>
      <Comparison caption="App WhatsApp Business e WhatsApp Business API a confronto sui costi" columns={["App WhatsApp Business", "WhatsApp Business API"]} rows={overview} />
      <p>Se non sai quale delle due ti serve, parti dalla <Link href="/it/blog/differenza-whatsapp-whatsapp-business">differenza tra WhatsApp e WhatsApp Business</Link>: la maggior parte delle piccole attività italiane lavora benissimo con l’app gratuita.</p>
    </>,
  },
  {
    id: "app",
    title: "L’app WhatsApp Business: cosa è gratis",
    body: <>
      <p>Con l’app gratuita hai già tutto quello che serve per vendere e assistere i clienti a mano:</p>
      <ul>
        <li>un <strong>profilo aziendale</strong> con indirizzo, orari, sito ed email;</li>
        <li>un <strong>catalogo</strong> di prodotti o servizi con foto e prezzi;</li>
        <li><strong>messaggi automatici</strong> di benvenuto e di assenza e <strong>risposte rapide</strong> (trovi <Link href="/it/blog/messaggi-automatici-whatsapp-business">40 esempi da copiare</Link>);</li>
        <li><strong>etichette</strong> per ordinare le chat (nuovo ordine, pagato, da richiamare);</li>
        <li>un <strong>link e un codice QR</strong> che aprono la chat con te; se lo vuoi con il tuo logo, usa il nostro <Link href="/tools/whatsapp-qr-code-generator">generatore di codici QR per WhatsApp</Link> gratuito (in inglese);</li>
        <li><strong>liste broadcast</strong> fino a 256 contatti, che arrivano solo a chi ha salvato il tuo numero.</li>
      </ul>
      <p>Non ci sono costi nascosti per i messaggi né per le chiamate. Paghi solo se scegli di farlo: per esempio gli annunci Facebook e Instagram che aprono una chat WhatsApp si pagano come qualsiasi altra pubblicità di Meta.</p>
      <p>Il limite dell’app non è il prezzo ma il tempo: ogni risposta la scrive una persona, e i messaggi automatici sono testi fissi che non rispondono alle domande.</p>
    </>,
  },
  {
    id: "come-funziona-api",
    title: "Come funzionano i prezzi della WhatsApp Business API",
    body: <>
      <p>Dal 1° luglio 2025 Meta fa pagare l’API <strong>a messaggio consegnato</strong>, non più a conversazione. Il prezzo dipende da due cose: la <strong>categoria</strong> del messaggio e il <strong>prefisso del destinatario</strong>. Un messaggio a un numero italiano (+39) segue il listino dell’Italia, anche se l’azienda ha sede altrove. I messaggi che i clienti mandano a te sono gratis.</p>
      <Comparison caption="Le quattro categorie di messaggi della WhatsApp Business API" columns={["Marketing", "Utility", "Autenticazione", "Servizio"]} rows={categories} />
      <p>Per i messaggi utility e di autenticazione ci sono anche <strong>sconti a scaglioni</strong>: oltre certe soglie mensili, calcolate per Paese e per categoria, la tariffa scende. Per marketing e servizio non ci sono scaglioni.</p>
    </>,
  },
  {
    id: "tariffe-italia",
    title: "Le tariffe Meta per l’Italia nel 2026",
    body: <>
      <p>Queste sono le tariffe del listino Meta in euro per i numeri italiani, in vigore dal <strong>1° ottobre 2026</strong>, per messaggio consegnato, prima degli scaglioni, delle imposte e delle commissioni del fornitore:</p>
      <Comparison caption="Tariffe Meta per messaggio verso numeri italiani dal 1° ottobre 2026" columns={["Prezzo per messaggio"]} rows={rates} />
      <p>In pratica: <strong>una promozione costa circa 6,6 centesimi</strong> a destinatario, una conferma d’ordine o un promemoria circa <strong>2,5 centesimi</strong>. Mille promozioni fanno 65,80 €; mille promemoria 24,80 €.</p>
      <Note>Meta aggiorna i prezzi ogni trimestre (1° gennaio, aprile, luglio e ottobre). Controlla il listino ufficiale prima di fare un preventivo e ricorda che il tuo fornitore può applicare una tariffa più alta di quella di Meta.</Note>
    </>,
  },
  {
    id: "ottobre-2026",
    title: "Cosa è cambiato il 1° ottobre 2026",
    body: <>
      <p>Fino al 30 settembre ogni risposta libera dentro la finestra di 24 ore era gratis. Dal <strong>1° ottobre 2026</strong>:</p>
      <ul>
        <li><strong>Le risposte ai clienti si pagano oltre una soglia.</strong> Ogni numero aziendale ha 1.000 messaggi di servizio gratis al mese; dopo, ognuno costa quanto un utility (0,0248 € in Italia). La soglia non si accumula.</li>
        <li><strong>I modelli utility inviati dentro la finestra di 24 ore si pagano</strong>. Dal luglio 2025 erano gratuiti.</li>
        <li><strong>Gli annunci Click-to-WhatsApp mantengono la finestra gratuita</strong>: una conversazione aperta da un annuncio o da un pulsante di una Pagina Facebook è gratis fino a 7 giorni.</li>
      </ul>
      <p>Per un chatbot sull’API la conseguenza è diretta: un bot che risponde a migliaia di domande al mese, che prima non costava nulla di tariffe Meta, ora ha un costo per ogni risposta. E un bot che manda tre messaggi brevi al posto di uno costa il triplo.</p>
    </>,
  },
  {
    id: "esempi",
    title: "Quanto si spende davvero: tre esempi italiani",
    body: <>
      <p>Le tariffe a messaggio sembrano minime, le bollette mensili un po’ meno. Tre attività tipo con le tariffe del 1° ottobre 2026, contando solo i costi di Meta:</p>
      <h3>Un negozio online di abbigliamento a Milano</h3>
      <ul>
        <li>2.000 chat con circa 4 risposte ciascuna: 8.000 messaggi di servizio, 7.000 oltre la soglia × 0,0248 € = <strong>173,60 €</strong></li>
        <li>1.500 conferme di spedizione (utility) × 0,0248 € = <strong>37,20 €</strong></li>
        <li>Due promozioni a 2.000 clienti iscritti: 4.000 messaggi marketing × 0,0658 € = <strong>263,20 €</strong></li>
      </ul>
      <p>Circa <strong>474 € al mese</strong> di tariffe Meta, prima del canone del fornitore.</p>
      <h3>Uno studio dentistico a Bologna</h3>
      <ul>
        <li>600 chat di pazienti × 5 risposte: 3.000 messaggi di servizio, 2.000 a pagamento × 0,0248 € = <strong>49,60 €</strong></li>
        <li>1.000 promemoria degli appuntamenti (utility) × 0,0248 € = <strong>24,80 €</strong></li>
      </ul>
      <p>Circa <strong>74 € al mese</strong>. Qui il canone del fornitore pesa spesso più delle tariffe Meta.</p>
      <h3>Una pizzeria a Napoli</h3>
      <ul>
        <li>900 chat per ordini e prenotazioni × 3 risposte: 2.700 messaggi, 1.700 a pagamento × 0,0248 € = <strong>42,16 €</strong></li>
        <li>400 conferme di prenotazione (utility) × 0,0248 € = <strong>9,92 €</strong></li>
      </ul>
      <p>Circa <strong>52 € al mese</strong>. Con l’app WhatsApp Business gratuita, le stesse conversazioni costerebbero zero, ma andrebbero gestite a mano.</p>
    </>,
  },
  {
    id: "fornitori",
    title: "Il costo dei fornitori, oltre a Meta",
    body: <>
      <p>Poche aziende usano l’API direttamente con Meta. Quasi tutte passano da un fornitore (un BSP, Business Solution Provider): in Italia sono diffusi Spoki e Callbell, oltre a piattaforme internazionali come WATI o respond.io. Il fornitore di solito aggiunge una o più di queste voci:</p>
      <ul>
        <li><strong>un canone mensile</strong>, spesso in base al numero di operatori o di contatti;</li>
        <li><strong>un ricarico a messaggio</strong> sopra la tariffa Meta;</li>
        <li><strong>componenti aggiuntivi a pagamento</strong> per il chatbot, l’AI o le integrazioni, che a volte costano più del piano base.</li>
      </ul>
      <p>Usare direttamente la Cloud API di Meta evita il ricarico, ma allora inbox, chatbot e integrazioni li devi costruire e ospitare tu, per esempio con n8n. Ne parliamo nella guida al <Link href="/it/blog/chatbot-whatsapp-business">chatbot WhatsApp Business</Link>.</p>
    </>,
  },
  {
    id: "risparmiare",
    title: "Come spendere meno (o niente) per rispondere ai clienti",
    body: <>
      <ul>
        <li><strong>Rispondi con un messaggio, non con tre.</strong> Sull’API ogni risposta oltre la soglia si paga: una risposta completa costa meno di tre messaggi brevi.</li>
        <li><strong>Sfrutta la finestra degli annunci.</strong> Le chat aperte da un annuncio Click-to-WhatsApp sono gratuite per 7 giorni.</li>
        <li><strong>Non pagare l’API se non fai invii massivi.</strong> Se la maggior parte del lavoro è rispondere a chi ti scrive, l’app gratuita basta. Il problema diventa il tempo, non il costo.</li>
        <li><strong>Automatizza le risposte sull’app, non sull’API.</strong> Un agente AI collegato al numero WhatsApp Business con un codice QR risponde ai clienti senza tariffe Meta a messaggio.</li>
      </ul>
      <InlineCta title="Risposte AI su WhatsApp, senza tariffe a messaggio" body="Wapzen collega il tuo numero con un codice QR e risponde ai clienti con le informazioni della tua attività, 24 ore su 24. Al momento è gratis." label="Inizia gratis" />
      <p>Wapzen non è un prodotto ufficiale Meta: si collega come dispositivo, come WhatsApp Web, e non invia campagne broadcast. Per le promozioni a migliaia di contatti l’API resta lo strumento giusto; per rispondere a chi ti scrive, spesso non serve. Scopri come funziona il <Link href="/it/chatbot-whatsapp-gratis">chatbot WhatsApp gratis</Link>.</p>
    </>,
  },
];

export default function WhatsAppBusinessCostoPage() {
  return <BlogPost
    href={href}
    heading={<>Quanto costa WhatsApp Business?<br /><span>App, API e tariffe in Italia.</span></>}
    lead="L’app WhatsApp Business è gratuita, la WhatsApp Business API no. Ecco cosa si paga davvero nel 2026, con le tariffe Meta in euro per l’Italia, cosa è cambiato il 1° ottobre e tre esempi di spesa mensile."
    summary={{
      title: "In breve",
      items: [
        <><strong>L’app WhatsApp Business è gratis</strong>, come il WhatsApp normale: niente costi per messaggi e chiamate.</>,
        <><strong>L’API si paga a messaggio</strong>: in Italia 0,0658 € per un marketing e 0,0248 € per un utility o un’autenticazione.</>,
        <><strong>Le risposte ai clienti sull’API</strong> sono gratis fino a 1.000 al mese per numero, poi 0,0248 € l’una (dal 1° ottobre 2026).</>,
        <><strong>I fornitori aggiungono</strong> un canone mensile e spesso un ricarico a messaggio.</>,
        <><strong>Per rispondere con l’AI</strong> senza tariffe a messaggio puoi collegare un agente al numero con un codice QR.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/it/blog/differenza-whatsapp-whatsapp-business", "/it/blog/chatbot-whatsapp-business"]}
    product="/it/chatbot-whatsapp-gratis"
    cta={{ heading: <>Rispondi ai clienti con l’AI.<br /><span>Senza tariffe a messaggio.</span></>, body: "Crea il tuo agente, insegnagli come funziona la tua attività e collega il tuo numero WhatsApp con un codice QR." }}
  />;
}
