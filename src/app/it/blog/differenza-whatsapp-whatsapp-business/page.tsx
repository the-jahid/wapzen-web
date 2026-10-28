import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Steps } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Ricerche obiettivo: "differenza tra whatsapp e whatsapp business" (30,
// 3/3), "whatsapp business vs whatsapp" (30, 3/3), "whatsapp business a cosa
// serve" (25), "whatsapp business o normale" (20), "come usare whatsapp
// business" (42), "esiste whatsapp business web" (27), "whatsapp business
// numero fisso" (YouTube), autocomplete IT 2026-10-28. Nessun equivalente
// inglese esatto (quello inglese confronta app e API), quindi niente hreflang.
const href = "/it/blog/differenza-whatsapp-whatsapp-business";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "it", article: { publishedTime: post.published, modifiedTime: post.updated } });

const compared = [
  ["Per chi è", "Uso personale", "Attività e professionisti", "Aziende con volumi alti o software"],
  ["Costo", "Gratis", "Gratis", "A messaggio, più il fornitore"],
  ["Profilo aziendale", "No", "Sì: indirizzo, orari, sito, email", "Sì"],
  ["Catalogo prodotti", "No", "Sì", "Sì, tramite il fornitore"],
  ["Messaggi automatici", "No", "Benvenuto, assenza, risposte rapide", "Chatbot e flussi"],
  ["Etichette per le chat", "No (solo liste)", "Sì", "Dipende dal fornitore"],
  ["Numero fisso", "No", "Sì, con verifica tramite chiamata", "Sì"],
  ["Più operatori", "Telefono + 4 dispositivi collegati", "Telefono + 4 dispositivi collegati", "Senza limiti pratici"],
  ["Invii a molti contatti", "Liste broadcast fino a 256", "Liste broadcast fino a 256", "Modelli approvati a chi ha dato il consenso"],
];

const switchSteps = [
  { title: "Fai un backup delle chat", body: "Su WhatsApp apri Impostazioni > Chat > Backup delle chat e avvia un backup. Non dovrebbe servire, ma è la tua rete di sicurezza." },
  { title: "Installa WhatsApp Business", body: "Scaricala gratis da Google Play o dall’App Store. Le due app possono stare sullo stesso telefono." },
  { title: "Usa lo stesso numero", body: "All’avvio l’app riconosce il numero già usato su WhatsApp e ti propone di usarlo. Conferma e verifica il numero con il codice." },
  { title: "Trasferisci le chat", body: "Accetta il trasferimento della cronologia: chat, foto e vocali passano su WhatsApp Business. Il numero smette di funzionare sul WhatsApp normale." },
  { title: "Completa il profilo", body: "Aggiungi nome dell’attività, categoria, indirizzo, orari e sito. Poi imposta catalogo, messaggi automatici e risposte rapide." },
];

const faqs = [
  { q: "Qual è la differenza tra WhatsApp e WhatsApp Business?", a: "WhatsApp è l'app per l'uso personale. WhatsApp Business è l'app gratuita per attività e professionisti: aggiunge un profilo aziendale con indirizzo e orari, il catalogo, i messaggi di benvenuto e di assenza, le risposte rapide e le etichette, e funziona anche con un numero fisso. Chat, chiamate e gruppi funzionano allo stesso modo." },
  { q: "WhatsApp Business è gratis?", a: "Sì. L'app WhatsApp Business è gratuita da scaricare e da usare, come WhatsApp. Si paga solo la WhatsApp Business API, la piattaforma per i software, che Meta fattura a messaggio." },
  { q: "Posso usare WhatsApp e WhatsApp Business sullo stesso telefono?", a: "Sì, ma con due numeri diversi, per esempio con un telefono dual SIM: un numero può essere attivo su una sola delle due app alla volta. Molti professionisti tengono il numero personale su WhatsApp e quello di lavoro su WhatsApp Business." },
  { q: "Se passo a WhatsApp Business perdo le chat?", a: "No. Quando registri su WhatsApp Business lo stesso numero usato su WhatsApp, l'app ti propone di trasferire la cronologia: chat, foto e messaggi vocali restano. Prima di iniziare conviene comunque fare un backup." },
  { q: "Si può usare WhatsApp Business con un numero fisso?", a: "Sì. Durante la verifica scegli di ricevere il codice con una chiamata invece che con un SMS: il numero fisso riceve una telefonata automatica che detta il codice." },
  { q: "Esiste WhatsApp Business Web?", a: "Sì. WhatsApp Business funziona con WhatsApp Web e con l'app desktop come il WhatsApp normale: inquadri il codice QR dal telefono e puoi collegare fino a quattro dispositivi." },
  { q: "I clienti capiscono che sono un’attività?", a: "Sì. Chi apre la tua chat vede che si tratta di un account business, con le informazioni del profilo aziendale come categoria, indirizzo e orari." },
];

const sources = [
  { label: "WhatsApp: app WhatsApp Business", href: "https://business.whatsapp.com/products/business-app" },
  { label: "Centro assistenza WhatsApp: collegare un dispositivo", href: "https://faq.whatsapp.com/1317564962315842" },
  { label: "Meta: WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/" },
];

const sections = [
  {
    id: "in-breve",
    title: "La differenza in un minuto",
    body: <>
      <p><strong>WhatsApp</strong> è l’app che usi con amici e famiglia. <strong>WhatsApp Business</strong> è un’app separata, anche lei gratuita, pensata per chi lavora con i clienti: ha la “B” nell’icona e aggiunge gli strumenti per presentare l’attività e rispondere più in fretta. Chat, chiamate, gruppi e stati funzionano allo stesso modo.</p>
      <p>Poi c’è un terzo prodotto con un nome simile, la <strong>WhatsApp Business API</strong>: non è un’app ma l’accesso per i software, e si paga a messaggio. Ecco le tre opzioni a confronto:</p>
      <Comparison caption="WhatsApp, WhatsApp Business e WhatsApp Business API a confronto" columns={["WhatsApp", "WhatsApp Business", "Business API"]} rows={compared} />
    </>,
  },
  {
    id: "a-cosa-serve",
    title: "Cos’è WhatsApp Business e a cosa serve",
    body: <>
      <p>WhatsApp Business serve a usare WhatsApp come canale di lavoro senza mescolarlo con il personale. Queste sono le funzioni che il WhatsApp normale non ha:</p>
      <ul>
        <li><strong>Profilo aziendale.</strong> Nome dell’attività, categoria, descrizione, indirizzo, orari di apertura, sito ed email, visibili a chi ti scrive.</li>
        <li><strong>Catalogo.</strong> Prodotti o servizi con foto, prezzo e descrizione, che il cliente sfoglia senza uscire dalla chat e può aggiungere al carrello.</li>
        <li><strong>Messaggi automatici.</strong> Un messaggio di benvenuto al primo contatto e un messaggio di assenza fuori orario. Abbiamo raccolto <Link href="/it/blog/messaggi-automatici-whatsapp-business">40 esempi da copiare</Link>.</li>
        <li><strong>Risposte rapide.</strong> Risposte salvate che richiami digitando “/”, per le domande che ricevi ogni giorno.</li>
        <li><strong>Etichette.</strong> Per ordinare le chat per stato: nuovo cliente, ordine in corso, pagato, da richiamare.</li>
        <li><strong>Link e codice QR.</strong> Un link wa.me e un codice QR che aprono la chat con te, da mettere su sito, vetrina o biglietti da visita.</li>
      </ul>
    </>,
  },
  {
    id: "quale-scegliere",
    title: "WhatsApp Business o normale: quale scegliere",
    body: <>
      <p>Se usi WhatsApp per lavoro anche solo una parte della giornata, WhatsApp Business conviene quasi sempre: costa uguale (niente), fa tutto quello che fa il WhatsApp normale e in più ti fa sembrare un’attività. Resta sul WhatsApp normale solo se il numero è davvero personale.</p>
      <Choose locale="it" highlight="WhatsApp Business" items={[
        { name: "WhatsApp", points: ["il numero è solo personale", "non ricevi richieste di clienti", "non ti servono orari, catalogo o risposte automatiche"] },
        { name: "WhatsApp Business", points: ["ricevi messaggi da clienti o pazienti", "vuoi mostrare orari, indirizzo e catalogo", "vuoi messaggi di benvenuto e di assenza", "hai un numero fisso per il lavoro"] },
        { name: "la Business API", points: ["invii promozioni a migliaia di contatti", "più operatori devono lavorare sulla stessa inbox", "devi collegare WhatsApp a CRM o e-commerce"] },
      ]} />
    </>,
  },
  {
    id: "passare-a-business",
    title: "Come passare a WhatsApp Business senza perdere le chat",
    body: <>
      <p>Il passaggio dal WhatsApp normale a WhatsApp Business con lo stesso numero richiede pochi minuti e conserva la cronologia:</p>
      <Steps items={switchSteps} />
      <Note>Un numero può essere attivo su una sola app alla volta. Se vuoi tenere separati personale e lavoro, usa due numeri: con un telefono dual SIM le due app convivono sullo stesso smartphone.</Note>
      <p>Si può anche tornare indietro, ma perdi profilo aziendale, catalogo ed etichette, quindi anche in quel caso fai prima un backup.</p>
    </>,
  },
  {
    id: "numero-fisso",
    title: "WhatsApp Business con il numero fisso",
    body: <>
      <p>Una differenza che interessa molti negozi e studi italiani: <strong>WhatsApp Business funziona con un numero fisso</strong>, il WhatsApp normale no. Durante la registrazione inserisci il numero del fisso, aspetta che scada il tempo per l’SMS e scegli <strong>Chiamami</strong>: il fisso riceve una chiamata automatica che detta il codice di verifica a sei cifre.</p>
      <p>L’app gira comunque su uno smartphone, che resta il dispositivo principale. Da lì puoi collegare WhatsApp Web o l’app desktop per lavorare dal computer del negozio o della reception.</p>
    </>,
  },
  {
    id: "api",
    title: "E quando serve la WhatsApp Business API?",
    body: <>
      <p>L’API non è una versione “pro” dell’app: è un modo per collegare il numero a un software. Serve quando hai bisogno di cose che l’app non fa:</p>
      <ul>
        <li><strong>invii massivi</strong> di promozioni o notifiche a chi ha dato il consenso, oltre i 256 contatti delle liste broadcast;</li>
        <li><strong>tanti operatori</strong> sulla stessa inbox, con assegnazione delle chat;</li>
        <li><strong>integrazioni</strong> con e-commerce, gestionale o CRM, per esempio le conferme d’ordine automatiche.</li>
      </ul>
      <p>In cambio paghi ogni messaggio inviato e quasi sempre il canone di un fornitore. Abbiamo fatto i conti, con le tariffe in euro, nella guida su <Link href="/it/blog/whatsapp-business-costo">quanto costa WhatsApp Business</Link>.</p>
    </>,
  },
  {
    id: "terza-via",
    title: "La terza via: l’AI sul tuo numero WhatsApp Business",
    body: <>
      <p>Il vero limite di WhatsApp Business non sono le funzioni, è il tempo: ogni risposta la scrive qualcuno, e i messaggi automatici sono testi fissi che non rispondono alle domande. Molte attività non passano all’API per fare promozioni, ma solo per avere un chatbot.</p>
      <p>Esiste un’alternativa più semplice: tieni l’app e affianca un <strong>agente AI</strong> collegato allo stesso numero con un codice QR, come WhatsApp Web. L’AI risponde a prezzi, orari, disponibilità e domande frequenti con le informazioni della tua attività, e tu continui a usare l’app come prima.</p>
      <InlineCta title="Aggiungi l’AI al tuo WhatsApp Business" body="Wapzen risponde ai clienti 24 ore su 24 con le tue informazioni e funziona sul tuo numero di sempre. Al momento è gratis, senza carta di credito." label="Inizia gratis" />
      <p>Wapzen non è un prodotto ufficiale Meta e non invia campagne broadcast. Risponde ai messaggi di testo nelle chat singole e può rispondere anche alle chiamate WhatsApp con un <Link href="/it/centralino-ai">centralino AI</Link>.</p>
    </>,
  },
];

export default function DifferenzaWhatsAppBusinessPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp o WhatsApp Business?<br /><span>Differenze e quale scegliere.</span></>}
    lead="Sono due app gratuite con nomi quasi uguali, ma servono a cose diverse. Ecco cosa cambia tra WhatsApp e WhatsApp Business, come passare all’app Business senza perdere le chat, come usarla con il numero fisso e quando serve davvero l’API."
    summary={{
      title: "In breve",
      items: [
        <><strong>WhatsApp</strong> è per l’uso personale, <strong>WhatsApp Business</strong> per attività e professionisti. Sono entrambe gratis.</>,
        <><strong>WhatsApp Business aggiunge</strong> profilo aziendale, catalogo, messaggi di benvenuto e di assenza, risposte rapide ed etichette.</>,
        <><strong>Puoi passare</strong> a WhatsApp Business con lo stesso numero e tenere tutte le chat.</>,
        <><strong>Solo WhatsApp Business</strong> funziona con un numero fisso, con la verifica tramite chiamata.</>,
        <><strong>La Business API</strong> è un’altra cosa: serve per invii massivi e software, e si paga a messaggio.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/it/blog/whatsapp-business-costo", "/it/blog/messaggi-automatici-whatsapp-business"]}
    product="/it/risposta-automatica-whatsapp"
    cta={{ heading: <>WhatsApp Business, con l’AI.<br /><span>Gratis, sul tuo numero.</span></>, body: "Collega il tuo WhatsApp Business con un codice QR e lascia che l’AI risponda ai clienti con le informazioni della tua attività." }}
  />;
}
