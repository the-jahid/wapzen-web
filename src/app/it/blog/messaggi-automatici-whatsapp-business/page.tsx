import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Samples, Steps } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Ricerche obiettivo: "messaggi automatici whatsapp business" (39),
// "messaggio di benvenuto whatsapp business" (29), "risposte rapide whatsapp
// business" (20), "…messaggi preimpostati" (19), "esempio messaggio di
// benvenuto whatsapp business" (19), "messaggio di assenza whatsapp business
// esempi" (16), autocomplete IT 2026-10-28. Il titolo promette 40 esempi:
// welcome + away + quick + ogni lista di `industries` devono fare 40. Gli
// esempi sono diversi da quelli di /it/risposta-automatica-whatsapp. Versione
// inglese: /blog/whatsapp-business-greeting-message.
const href = "/it/blog/messaggi-automatici-whatsapp-business";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "it", article: { publishedTime: post.published, modifiedTime: post.updated } });

type Sample = { title: string; text: string };

const welcome: Sample[] = [
  { title: "Semplice e cordiale", text: "Ciao 👋 Grazie per aver scritto a [Nome attività]! Come possiamo aiutarti oggi?" },
  { title: "Con i tempi di risposta", text: "Ciao e benvenuto/a! Di solito rispondiamo entro [1 ora], dal lunedì al venerdì dalle [9:00] alle [18:00]. Scrivici pure la tua richiesta." },
  { title: "Con le opzioni", text: "Ciao! 👋 Per aiutarti più in fretta, dicci di cosa hai bisogno:\n- Informazioni e prezzi\n- Prenotazioni\n- Ordini e spedizioni\n- Altro" },
  { title: "Tocco personale", text: "Ciao, sono [Nome] di [Nome attività]. Grazie per avermi scritto! Raccontami pure e ti rispondo personalmente appena possibile." },
  { title: "Con un link", text: "Grazie per averci contattato! Mentre aspetti la nostra risposta, qui trovi prodotti e prezzi: [link]" },
  { title: "Formale, con il Lei", text: "Gentile cliente, grazie per aver contattato [Nome attività]. Un nostro collaboratore Le risponderà a breve." },
  { title: "In due lingue", text: "Ciao! 👋 Benvenuto/a da [Nome attività]: scrivici pure in italiano o in inglese.\nHi! Feel free to write to us in English." },
  { title: "Con il catalogo", text: "Ciao! Tocca l’icona del negozio in alto in questa chat per vedere il catalogo con i prezzi. Hai domande su un prodotto? Chiedi pure qui." },
  { title: "Se usi un assistente AI", text: "Ciao! 👋 Sono l’assistente virtuale di [Nome attività] e rispondo subito su prezzi, orari e disponibilità. Se preferisci parlare con una persona, scrivi *operatore*." },
  { title: "Durante le feste", text: "Ciao! Grazie per aver scritto a [Nome attività] 🎄 Durante le feste siamo aperti con orari ridotti: [orari]. Come possiamo aiutarti?" },
];

const away: Sample[] = [
  { title: "Chiusi, con la riapertura", text: "Grazie per il messaggio! Ora siamo chiusi: riapriamo [domani alle 9:00]. Lasciaci pure la tua richiesta e ti rispondiamo appena rientriamo." },
  { title: "Pausa pranzo", text: "Ciao! Siamo in pausa pranzo fino alle [15:00]. Ti rispondiamo appena torniamo." },
  { title: "Ferie d’agosto", text: "Ciao! Dal [10] al [25 agosto] siamo chiusi per ferie ☀️ Per urgenze scrivi a [email]. Risponderemo a tutti al rientro." },
  { title: "Con un numero per le urgenze", text: "Grazie per averci scritto. Siamo fuori orario: ti rispondiamo dalle [8:30] di domani. Per urgenze chiama il [numero]." },
  { title: "Con la prenotazione online", text: "Ora non possiamo rispondere, ma puoi prenotare in autonomia qui, 24 ore su 24: [link]. A presto!" },
  { title: "Giorno festivo", text: "Buone feste! Oggi siamo chiusi per [festività]. Riapriamo [giorno] e risponderemo a tutti i messaggi in ordine di arrivo." },
  { title: "Professionista impegnato", text: "Ciao, in questo momento sono [in riunione] e non posso rispondere. Ti scrivo o ti richiamo entro [le 18:00]." },
  { title: "Ufficio, formale", text: "Gentile cliente, il nostro ufficio è chiuso. Siamo aperti [lun–ven 9:00–13:00 e 14:30–18:30]. La ricontatteremo il prima possibile." },
];

const quick: Sample[] = [
  { title: "/orari", text: "Siamo aperti dal lunedì al sabato, dalle [9:00] alle [19:30]. La domenica siamo chiusi." },
  { title: "/dove", text: "Ci trovi in [Via Roma 10, Milano]. Ecco la posizione: [link Google Maps]. C’è un parcheggio a [100 metri]." },
  { title: "/pagamenti", text: "Accettiamo contanti, carte e bancomat e [Satispay]. Per gli ordini online anche [PayPal] e bonifico." },
  { title: "/spedizioni", text: "Spediamo in tutta Italia in [2–4 giorni lavorativi]. La spedizione è gratuita sopra i [50 €], altrimenti costa [5,90 €]." },
  { title: "/bonifico", text: "Ecco i dati per il bonifico: intestatario [Nome attività], IBAN [IBAN], causale [numero d’ordine]. Quando hai fatto, mandaci la ricevuta qui in chat." },
  { title: "/recensione", text: "Grazie a te! Se ti sei trovato/a bene, ci aiuti tantissimo con una recensione qui: [link] 🙏" },
];

const industries: Array<{ name: string; samples: Sample[] }> = [
  {
    name: "Ristoranti e pizzerie",
    samples: [
      { title: "Benvenuto e prenotazioni", text: "Ciao e benvenuto/a da [Ristorante] 🍝 Per prenotare scrivici giorno, ora e numero di persone. Il menu è qui: [link]" },
      { title: "Asporto e consegna", text: "Ciao! Per l’asporto scrivici cosa desideri e l’orario di ritiro. Consegniamo anche a domicilio in [zona] dalle [19:00] alle [22:30]." },
      { title: "Assenza con gli orari", text: "Grazie per il messaggio! Ora il locale è chiuso: siamo aperti a pranzo [12:00–14:30] e a cena [19:00–23:00], chiusi il [lunedì]. Ti rispondiamo appena apriamo." },
      { title: "/allergeni", text: "Nel menu ogni piatto riporta gli allergeni: [link]. Abbiamo anche opzioni senza glutine e vegane: dicci pure le tue esigenze." },
    ],
  },
  {
    name: "Parrucchieri e centri estetici",
    samples: [
      { title: "Benvenuto e appuntamenti", text: "Ciao! 💇‍♀️ Grazie per aver scritto a [Salone]. Dicci il servizio e il giorno che preferisci: ti proponiamo i primi orari liberi." },
      { title: "Assenza durante il lavoro", text: "Ciao! Ora sono con una cliente e non posso rispondere. Ti scrivo appena finisco, di solito entro un’ora." },
      { title: "/promemoria", text: "Ciao [Nome]! Ti ricordiamo l’appuntamento di [domani alle 10:30] per [servizio]. Se non riesci a venire, avvisaci qui. A domani!" },
      { title: "/prezzi", text: "Ecco i prezzi principali: piega da [20 €], taglio e piega da [35 €], colore da [45 €]. Il listino completo è qui: [link]" },
    ],
  },
  {
    name: "Negozi online",
    samples: [
      { title: "Benvenuto del negozio", text: "Ciao! Benvenuto/a su [Negozio] 🛍️ Chiedici pure di taglie, disponibilità e spedizioni. Se riguarda un ordine, mandaci il *numero d’ordine*." },
      { title: "/ordine", text: "Grazie! Il tuo ordine [numero] è stato spedito con [corriere]. Puoi seguirlo qui: [link tracking]" },
      { title: "/resi", text: "Puoi restituire i prodotti entro [14 giorni] dalla consegna. Scrivici il numero d’ordine e cosa vuoi rendere: ti mandiamo le istruzioni." },
      { title: "Assenza del servizio clienti", text: "Grazie per il messaggio! Il servizio clienti risponde dal lunedì al venerdì, [9:00–18:00]. Intanto qui trovi le risposte più comuni: [link FAQ]" },
    ],
  },
  {
    name: "Studi medici e professionisti",
    samples: [
      { title: "Benvenuto dello studio", text: "Buongiorno, grazie per aver contattato lo Studio [Nome]. Per prenotare una visita indichi nome, cognome e i giorni che preferisce. Per le urgenze chiami il [numero]." },
      { title: "Assenza dello studio", text: "Lo studio è chiuso. La segreteria risponde [lun–ven 9:00–12:30 e 15:00–19:00]: Le risponderemo alla riapertura. In caso di emergenza chiami il 112." },
      { title: "/documenti", text: "Per la prima visita porti un documento d’identità, la tessera sanitaria ed eventuali esami precedenti." },
      { title: "Commercialista o avvocato", text: "Buongiorno, grazie per il messaggio. Ricevo su appuntamento: mi indichi in breve l’argomento e due o tre disponibilità, e Le confermo l’orario." },
    ],
  },
];

const tools = [
  ["Quando parte", "Al primo messaggio di un cliente, o al primo dopo 14 giorni senza messaggi", "Quando arriva un messaggio negli orari che hai scelto", "Quando la invii tu, digitando “/”"],
  ["Chi lo riceve", "Tutti, chi non è in rubrica, tutti tranne alcuni o solo alcuni", "Tutti, chi non è in rubrica, tutti tranne alcuni o solo alcuni", "Il cliente della chat aperta"],
  ["Serve per", "Accogliere e dire cosa succede dopo", "Dire quando rispondi", "Non riscrivere le stesse risposte"],
  ["Limiti", "Un testo fisso", "Un testo fisso", "Fino a 50 risposte salvate"],
];

const setupSteps = [
  { title: "Apri gli Strumenti di lavoro", body: "In WhatsApp Business tocca Altre opzioni (⋮) su Android o Impostazioni su iPhone, poi Strumenti di lavoro." },
  { title: "Scegli il messaggio", body: "Messaggio di benvenuto, Messaggio di assenza o Risposte rapide." },
  { title: "Attivalo e scrivi il testo", body: "Attiva l’interruttore e incolla uno degli esempi qui sotto, sostituendo le parti tra parentesi quadre." },
  { title: "Imposta orari e destinatari", body: "Per l’assenza scegli Invia sempre, un orario personalizzato o fuori dall’orario di apertura. Poi scegli chi lo riceve e tocca Salva." },
];

const faqs = [
  { q: "Come si impostano i messaggi automatici su WhatsApp Business?", a: "Apri WhatsApp Business, tocca Altre opzioni su Android o Impostazioni su iPhone e vai in Strumenti di lavoro. Scegli Messaggio di benvenuto o Messaggio di assenza, attivalo, scrivi il testo, imposta orari e destinatari e tocca Salva." },
  { q: "Quando parte il messaggio di benvenuto di WhatsApp Business?", a: "Quando un cliente ti scrive per la prima volta, oppure per la prima volta dopo 14 giorni senza messaggi. Chi ti ha scritto negli ultimi 14 giorni non lo riceve di nuovo." },
  { q: "Che differenza c’è tra messaggio di benvenuto e messaggio di assenza?", a: "Il messaggio di benvenuto accoglie chi ti scrive per la prima volta o dopo 14 giorni. Il messaggio di assenza risponde a chi ti scrive negli orari in cui non ci sei. Puoi usarli entrambi." },
  { q: "Come funzionano le risposte rapide?", a: "Sono messaggi salvati con una scorciatoia, per esempio /orari. In chat digiti “/” e scegli la risposta da inviare. Puoi salvarne fino a 50, in Strumenti di lavoro > Risposte rapide." },
  { q: "Perché il messaggio automatico di WhatsApp Business non funziona?", a: "Di solito il cliente ti ha già scritto negli ultimi 14 giorni, oppure è escluso dai destinatari che hai scelto. I messaggi partono solo quando il telefono è connesso a internet, e l'opzione fuori dall'orario di apertura richiede gli orari nel profilo aziendale. Aggiornare l'app e riattivare il messaggio spesso risolve." },
  { q: "Si può mettere un messaggio automatico su WhatsApp normale?", a: "No, il WhatsApp normale non ha messaggi automatici. Puoi passare a WhatsApp Business, che è gratis e tiene le tue chat, oppure collegare il numero a un'AI come Wapzen, che funziona anche con il WhatsApp normale." },
];

const sources = [
  { label: "Centro assistenza WhatsApp: messaggi di benvenuto", href: "https://faq.whatsapp.com/501866148528310" },
  { label: "WhatsApp: app WhatsApp Business", href: "https://business.whatsapp.com/products/business-app" },
];

const sections = [
  {
    id: "tre-strumenti",
    title: "I tre messaggi automatici di WhatsApp Business",
    body: <>
      <p>L’app WhatsApp Business ha tre strumenti per non riscrivere sempre le stesse cose. Sono gratuiti e si trovano tutti in <strong>Strumenti di lavoro</strong>:</p>
      <Comparison caption="Messaggio di benvenuto, messaggio di assenza e risposte rapide a confronto" columns={["Messaggio di benvenuto", "Messaggio di assenza", "Risposte rapide"]} rows={tools} />
      <p>Il messaggio di benvenuto e quello di assenza partono da soli, le risposte rapide le mandi tu con una scorciatoia. Tutti e tre sono <strong>testi fissi</strong>: dicono sempre la stessa cosa, qualunque sia la domanda.</p>
    </>,
  },
  {
    id: "come-impostarli",
    title: "Come impostare i messaggi automatici",
    body: <>
      <Steps items={setupSteps} />
      <p>Per le <strong>risposte rapide</strong> vai in Strumenti di lavoro &gt; Risposte rapide, tocca + e scrivi il messaggio e la scorciatoia (per esempio <em>orari</em>). In chat ti basta digitare “/” per vedere l’elenco.</p>
      <p>Il messaggio di benvenuto è la prima cosa che vede chi ti scrive da un <Link href="/tools/whatsapp-qr-code-generator">codice QR per WhatsApp</Link> stampato su menu, vetrina o confezioni. Puoi crearne uno gratis con il tuo logo; lo strumento è in inglese.</p>
      <Note>Per provare il messaggio di benvenuto usa un telefono che non ti ha scritto negli ultimi 14 giorni, altrimenti non arriva. Più dettagli e altri esempi nella guida alla <Link href="/it/risposta-automatica-whatsapp">risposta automatica su WhatsApp</Link>.</Note>
    </>,
  },
  {
    id: "benvenuto",
    title: "10 esempi di messaggio di benvenuto",
    body: <>
      <p>Un buon messaggio di benvenuto ringrazia, dice quando risponderai e chiede subito l’informazione che ti serve. Sostituisci le parti tra parentesi quadre; gli asterischi mettono il testo in grassetto su WhatsApp.</p>
      <Samples locale="it" items={welcome} />
    </>,
  },
  {
    id: "assenza",
    title: "8 esempi di messaggio di assenza",
    body: <>
      <p>Il messaggio di assenza deve dire due cose: che hai ricevuto il messaggio e quando risponderai. Se puoi, aggiungi un’alternativa (un link per prenotare, un numero per le urgenze).</p>
      <Samples locale="it" items={away} />
    </>,
  },
  {
    id: "risposte-rapide",
    title: "6 risposte rapide da salvare subito",
    body: <>
      <p>Le risposte rapide servono per le domande che ricevi ogni giorno. Il titolo di ogni esempio è la scorciatoia da usare.</p>
      <Samples locale="it" items={quick} />
    </>,
  },
  {
    id: "per-settore",
    title: "16 esempi per settore",
    body: <>
      {industries.map((industry) => <div key={industry.name}>
        <h3>{industry.name}</h3>
        <Samples locale="it" items={industry.samples} />
      </div>)}
    </>,
  },
  {
    id: "non-funziona",
    title: "Perché il messaggio automatico non parte",
    body: <>
      <ul>
        <li><strong>La regola dei 14 giorni.</strong> Chi ti ha scritto nelle ultime due settimane non riceve il benvenuto. Succede quasi sempre quando lo provi dal tuo secondo telefono.</li>
        <li><strong>I destinatari.</strong> Se hai scelto “chi non è in rubrica” o “solo alcuni contatti”, gli altri non lo ricevono.</li>
        <li><strong>Gli orari mancanti.</strong> L’opzione fuori dall’orario di apertura usa gli orari del profilo aziendale: se non li hai inseriti, il messaggio non parte.</li>
        <li><strong>Il telefono offline.</strong> I messaggi automatici partono dal telefono: se è spento o senza internet, non vengono inviati.</li>
        <li><strong>L’app da aggiornare.</strong> Aggiorna WhatsApp Business, poi disattiva e riattiva il messaggio.</li>
      </ul>
    </>,
  },
  {
    id: "oltre",
    title: "Oltre i testi fissi: risposte con l’AI",
    body: <>
      <p>I messaggi automatici dicono al cliente che risponderai. Non rispondono alla sua domanda. Se ricevi ogni giorno le stesse richieste su prezzi, orari e disponibilità, un agente AI può rispondere davvero, con le informazioni della tua attività, a ogni messaggio e a qualsiasi ora.</p>
      <InlineCta title="Risposte vere, non testi fissi" body="Wapzen collega un’AI al tuo WhatsApp con un codice QR: risponde a ogni cliente con le tue informazioni, anche sul WhatsApp normale. Al momento è gratis." label="Inizia gratis" />
      <p>Puoi tenere anche il messaggio di benvenuto: per esempio quello per chi usa un assistente AI, che dice al cliente che può chiedere una persona. Scopri come funziona il <Link href="/it/blog/chatbot-whatsapp-business">chatbot WhatsApp Business</Link>.</p>
    </>,
  },
];

export default function MessaggiAutomaticiWhatsAppBusinessPage() {
  return <BlogPost
    href={href}
    heading={<>Messaggi automatici WhatsApp Business.<br /><span>40 esempi da copiare.</span></>}
    lead="Messaggi di benvenuto, messaggi di assenza e risposte rapide pronti da copiare, divisi per tipo e per settore, più come impostarli in WhatsApp Business e cosa controllare quando non partono."
    summary={{
      title: "In breve",
      items: [
        <><strong>WhatsApp Business ha tre messaggi automatici gratuiti:</strong> benvenuto, assenza e risposte rapide, in Strumenti di lavoro.</>,
        <><strong>Il benvenuto parte</strong> al primo messaggio di un cliente, o al primo dopo 14 giorni senza messaggi.</>,
        <><strong>L’assenza parte</strong> negli orari che scegli: sempre, con un orario personalizzato o fuori dall’orario di apertura.</>,
        <><strong>Qui trovi 40 esempi:</strong> 10 di benvenuto, 8 di assenza, 6 risposte rapide e 16 per ristoranti, saloni, negozi online e studi.</>,
        <><strong>Sono testi fissi:</strong> per rispondere davvero alle domande serve un’AI.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/it/blog/chatbot-whatsapp-business", "/it/blog/differenza-whatsapp-whatsapp-business"]}
    product="/it/risposta-automatica-whatsapp"
    cta={{ heading: <>Dai risposte vere ai tuoi clienti.<br /><span>Con l’AI, gratis.</span></>, body: "Collega il tuo WhatsApp con un codice QR e lascia che l’AI risponda a ogni messaggio con le informazioni della tua attività." }}
  />;
}
