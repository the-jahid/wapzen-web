import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Ricerche (autocomplete Google, YouTube e DuckDuckGo con gl=it, 2026-11-06, vedi
// docs/seo-research.md, "Italy buyer posts"): "chatbot hotel" (30, 3/3), "whatsapp hotel"
// (20), "intelligenza artificiale per hotel" (14), "ia per hotel", "whatsapp b&b", "software
// casa vacanza" (10 ciascuna). Settore scelto per domanda e per il WhatsApp Marketing Report
// Italia 2026 (turismo 69,2 su 100, secondo). Non esiste una classifica ufficiale per volume
// d'uso: il testo lo dice.
// Su richiesta dell'utente (2026-11-06): chat gratis e illimitata, nessun limite nascosto,
// agente vocale funzionante. Il server mantiene HOURLY_REPLY_LIMIT = 100,
// GROUP_HOURLY_REPLY_LIMIT = 50 e MAX_CHAT_AGENTS_PER_USER = 1, quindi "nessun limite
// nascosto" è vero solo perché il testo li dichiara: non togliere quelle righe finché
// esistono, e scrivi "conversazioni illimitate", mai "risposte illimitate". La CTA vocale
// apre WhatsApp perché il pannello mostra ancora VoiceUpdateNote. Nessuna nota sui blocchi
// del numero, per decisione dell'utente. Il 15% di commissione Booking è un'ipotesi. BuddyChat
// non si apre da qui: prezzo letto solo come estratto nei risultati di ricerca. Spoki: le FAQ
// citano prezzi più bassi del listino, qui c'è il listino. Il pannello è in inglese finché
// non esce il lavoro di traduzione.
const href = "/it/blog/chatbot-whatsapp-hotel-bb-case-vacanza";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Ciao, voglio attivare l'agente vocale di Wapzen per la mia struttura in Italia.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "it", article: { publishedTime: post.published, modifiedTime: post.updated } });

const free = [
  ["Wapzen", "Chat AI con conversazioni illimitate, senza canone e senza costo a messaggio", "Non è una prova a tempo"],
  ["BuddyChat", "500 messaggi, senza carta", "9 € al mese per unità, fino a 10 unità"],
  ["Chat4Hotel", "Prova di 60 giorni", "Piani a pagamento, con i prezzi su una pagina a parte"],
  ["Spoki", "Piano Free con API ufficiale, tariffe Meta a parte", "Il piano Service con AI parte da 39 € al mese con pagamento annuale"],
  ["Callbell", "Prova di 7 giorni", "93 € al mese con agente, account WhatsApp e creatore di bot, più le tariffe Meta"],
];

const limits = [
  ["Conversazioni e contatti", "Illimitati"],
  ["Risposte AI al mese", "Nessun limite mensile"],
  ["Costo a messaggio o a risposta", "Nessuno"],
  ["Risposte AI all’ora", "100 per agente"],
  ["Risposte AI nei gruppi", "50 all’ora per agente, in totale. I gruppi sono spenti di default"],
  ["Agenti di chat", "1 per account"],
];

const answers = [
  ["“What time is check-in?”", "Sì", "Con gli orari che gli dai"],
  ["“Wie kommen wir vom Flughafen zu Ihnen?”", "Sì", "Con le tue indicazioni"],
  ["“Y a-t-il un parking ?”", "Sì", "Con prezzi e posizione, se glieli dai"],
  ["“Quanto si paga di tassa di soggiorno?”", "Sì", "Con l’importo del tuo Comune e le esenzioni"],
  ["“Qual è il vostro CIN?”", "Sì", "Se lo metti nelle informazioni"],
  ["“Possiamo lasciare le valigie domenica?”", "In parte", "Annota la richiesta e il tuo team la conferma"],
  ["“Avete una doppia dal 12 al 15?”", "In parte", "Condivide il tuo motore di prenotazione, o lo consulta con uno strumento API"],
  ["“Ti mando qui il passaporto?”", "No", "Spiega come funziona il riconoscimento all’arrivo, senza raccogliere documenti"],
  ["“Qual è il codice della porta?”", "No", "I codici li mandi tu o il tuo PMS"],
];

const pms = [
  ["Rispondere su WhatsApp a domande libere, in più lingue", "Dipende dal programma e dai moduli", "Sì"],
  ["Rispondere alle chiamate WhatsApp con voce AI", "Dipende dal programma e dai moduli", "Sì"],
  ["Calendario, tariffe e sincronizzazione con Booking e Airbnb", "Sì", "No"],
  ["Messaggi dentro Booking e Airbnb", "Dipende dal programma", "No"],
  ["Alloggiati Web, tassa di soggiorno e incassi", "Spesso, direttamente o con un partner", "No"],
];

const costs = [
  ["Piattaforma", "Dipende dal fornitore. In Callbell: 93 € al mese con agente, account WhatsApp e creatore di bot", "0 €"],
  ["Risposte agli ospiti", "1.000 gratis al mese per numero, poi 0,0248 € l’una", "0 €, nessun limite mensile"],
  ["Avvisi prima dell’arrivo", "0,0248 € l’uno", "0 €"],
  ["Offerte ai vecchi ospiti", "0,0658 € l’una", "0 €"],
  ["API di Meta e chiave di accesso", "Necessarie", "Non servono"],
];

const fit = [
  ["B&B, casa vacanza o affittacamere con domande ripetute", "Sì", "Risponde in più lingue e a qualsiasi ora"],
  ["Piccolo hotel o agriturismo senza reception 24 ore", "Sì", "Risponde di notte e lascia le richieste al tuo team"],
  ["Struttura che vuole più richieste dirette", "Sì", "Risponde subito e condivide il tuo motore di prenotazione"],
  ["Hotel che vuole prenotare e incassare senza un altro sistema", "No", "L’agente non incassa e non conferma prenotazioni da solo"],
  ["Chi vuole rispondere dentro Booking o Airbnb", "No", "Wapzen lavora sul tuo numero WhatsApp, non su quelle caselle"],
  ["Catena che richiede badge verde o modelli approvati", "No", "Esistono solo con l’API ufficiale di Meta"],
];

const prompt = `Sei l’assistente virtuale di Casa Demo, un B&B nel centro di Lecce.
Rispondi sempre nella lingua in cui ti scrive l’ospite: italiano, inglese, tedesco, francese o altre. Usa due o tre frasi e fai una sola domanda per volta.
Nel primo messaggio di’ che sei un assistente virtuale.
Rispondi su orari di check-in e check-out, come arrivare, parcheggio, deposito bagagli, regole, servizi, tassa di soggiorno e dintorni solo con le informazioni che ti abbiamo dato. Se un dato ti manca, dillo e avvisa che il team risponderà in questa chat.
Per late check-out, early check-in, culle o guasti, annota la richiesta e avvisa che il team la confermerà. Non darla per confermata.
Se chiedono disponibilità o prezzi, condividi questo link di prenotazione: [link]. Non inventare prezzi e non confermare prenotazioni.
All’arrivo controlliamo di persona il documento di ogni ospite: se te lo chiedono, spiega che è un obbligo di legge. Non chiedere passaporti, carte d’identità o dati di carte di pagamento in questa chat.
Non dare mai codici della porta, dati delle chiavi o informazioni su altre prenotazioni.
Se qualcuno descrive un’emergenza, digli di chiamare il 112. Telefono del team: [telefono].
Se qualcuno risponde a un avviso di arrivo, aiutalo con la sua domanda.`;

const preArrival = `Hi {{Nome}}, we look forward to welcoming you to Casa Demo on {{Data}}. Reply here with your arrival time, or ask us anything about parking, luggage or the area. Our virtual assistant answers at any hour. Please bring your ID: Italian law requires us to check it in person when you arrive.`;

const sources = [
  { label: "Inside Marketing: WhatsApp Marketing Report Italia 2026 di Le Gallucci", href: "https://www.insidemarketing.it/whatsapp-marketing-italia-73percento-aziende-usa-ma-solo-l8percento-raggiunge-leccellenza/" },
  { label: "BitMAT: WhatsApp in azienda, il 60% lo usa in modo reattivo", href: "https://www.bitmat.it/internet/digital-marketing/whatsapp-in-azienda-il-60-lo-usa-in-modo-reattivo/" },
  { label: "Istat: i flussi turistici nel 2024", href: "https://www.istat.it/wp-content/uploads/2026/03/Statistica-Today_Turismo-2024.pdf" },
  { label: "Istat: flussi turistici, IV trimestre 2025 (dati provvisori)", href: "https://www.istat.it/wp-content/uploads/2026/03/Stat_Flash_IV_Trim_2025.pdf" },
  { label: "Diritto.it: Consiglio di Stato n. 9101/2025 sull’identificazione de visu", href: "https://www.diritto.it/obbligo-identificazione-de-visu-check-in-remoto/" },
  { label: "Informazione Fiscale: CIN, banca dati e sanzioni", href: "https://www.informazionefiscale.it/CIN-Banca-Dati-Strutture-Ricettive-sanzioni-avviso-MITUR-Gazzetta-Ufficiale" },
  { label: "AGI: la causa collettiva degli hotel contro Booking", href: "https://www.agi.it/economia/news/2025-08-29/class-action-contro-booking-32913501/" },
  { label: "BuddyChat", href: "https://buddychat.it/" },
  { label: "EasyEntry: Chat4Hotel", href: "https://easyentry.it/chat4hotel/" },
  { label: "Spoki: prezzi", href: "https://spoki.com/en/pricing/" },
  { label: "Callbell: prezzi", href: "https://callbell.eu/en/pricing/" },
  { label: "Smoobu: prezzi", href: "https://www.smoobu.com/it/prezzi/" },
  { label: "Meta: prezzi della WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "FlowCall: ristampa del listino Meta in euro", href: "https://www.flowcall.co/blog/whatsapp-business-api-pricing" },
  { label: "Zernio: tariffe WhatsApp per Paese, listino del 1° ottobre 2026", href: "https://zernio.com/whatsapp-api-pricing" },
  { label: "Garante privacy: linee guida su attività promozionale e spam, 2013", href: "https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/2542348" },
  { label: "EUR-Lex: Regolamento (UE) 2024/1689 sull’intelligenza artificiale", href: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=it" },
  { label: "Ropes & Gray: gli obblighi di trasparenza dell’art. 50 dopo l’Omnibus", href: "https://www.ropesgray.com/en/insights/viewpoints/102nfqm/you-talkin-to-me-operationalising-the-eu-ai-acts-transparency-obligations" },
];

const questions = [
  {
    id: "gratis",
    q: "Esiste un chatbot WhatsApp gratis per hotel, B&B e case vacanza?",
    answer: "Sì. Wapzen è un chatbot WhatsApp con AI gratis per hotel, B&B, case vacanza e agriturismi in Italia: conversazioni illimitate, nessun canone, nessun costo a messaggio e nessuna chiave API di Meta. Risponde agli ospiti a qualsiasi ora e nella loro lingua, sul tuo numero, e il suo agente vocale risponde alle chiamate WhatsApp.",
    body: <>
      <p>Molti strumenti per le strutture ricettive sono gratis per un certo periodo o per un certo numero di messaggi. <Link href="/it/chatbot-whatsapp-gratis">Wapzen</Link> collega il numero che la tua struttura usa già come un dispositivo, proprio come WhatsApp Web. Per questo non servono l’API di WhatsApp Business, un fornitore o l’approvazione di Meta.</p>
      <Comparison caption="Cosa significa gratis nei chatbot WhatsApp per strutture ricettive" columns={["Cosa è gratis", "Dopo"]} rows={free} />
      <p>Il tuo team continua a usare WhatsApp sul telefono e gli ospiti scrivono al solito numero. In alta stagione, con più domande, non paghi di più.</p>
      <Note>Prezzi letti il 6 novembre 2026 sulle pagine dei fornitori. Il dato di BuddyChat viene dall’estratto del suo sito nei risultati di ricerca, e le FAQ di Spoki citano cifre più basse del suo listino, che è quello riportato qui. Controlla sempre prima di scegliere.</Note>
    </>,
  },
  {
    id: "limiti",
    q: "Ci sono limiti nascosti?",
    answer: "No. Su Wapzen la chat è gratis, con conversazioni e contatti illimitati, nessun limite mensile di risposte e nessun costo a messaggio. I limiti che esistono li scriviamo qui: 100 risposte AI all’ora per agente, 50 all’ora in totale nei gruppi e un agente di chat per account. Passata l’ora, l’agente riprende da solo.",
    body: <>
      <Comparison caption="Cosa è illimitato e cosa ha un limite su Wapzen" columns={["Su Wapzen"]} rows={limits} />
      <p><strong>Cosa succede a quota 100.</strong> L’agente si ferma fino alla fine dell’ora e poi riprende da solo. Nel frattempo il pannello mostra il conto alla rovescia e chi scrive non riceve una risposta automatica: il messaggio resta salvato e puoi rispondere tu.</p>
      <p><strong>Quanto sono 100 risposte l’ora.</strong> Con 8 risposte a conversazione sono circa 12 conversazioni ogni ora. Bastano a un B&B, a una casa vacanza o a un piccolo hotel. Un grande albergo con molte richieste nella stessa ora può arrivarci nei picchi, quindi è meglio saperlo prima.</p>
    </>,
  },
  {
    id: "voce",
    q: "L’agente vocale risponde agli ospiti che chiamano su WhatsApp?",
    answer: "Sì, l’agente vocale funziona. Risponde alle chiamate WhatsApp sul tuo numero, nella lingua che imposti, con le stesse informazioni del chatbot. La chiamata passa da internet, quindi l’ospite straniero non deve comporre un numero estero. È gratis, senza costo al minuto. Non risponde al telefono fisso e non trasferisce le chiamate in diretta.",
    body: <>
      <p>Molti viaggiatori preferiscono chiamare quando hanno fretta: sono appena atterrati, non trovano l’ingresso o stanno guidando. Se chiamano il WhatsApp della struttura, l’agente risponde, risolve le cose semplici e prende nota del resto.</p>
      <ul>
        <li><strong>Una lingua per agente vocale.</strong> Scegli quella più usata dai tuoi ospiti, per esempio l’italiano o il tedesco. In chat, invece, l’agente risponde nella lingua di ciascuno.</li>
        <li><strong>Solo chiamate WhatsApp.</strong> Il fisso della reception continua a squillare come prima.</li>
        <li><strong>Nessun trasferimento in diretta.</strong> Fagli dire che il team richiamerà e, in un’emergenza, che bisogna chiamare il 112. Tieni in vista un numero del team per ciò che non può aspettare.</li>
        <li><strong>Nessun costo al minuto.</strong> Con l’API ufficiale, le chiamate avviate dall’azienda costano 0,0121 dollari al minuto in Italia, più la piattaforma vocale. Prima di ogni risposta c’è una pausa di uno o due secondi.</li>
      </ul>
      <p>Trovi più dettagli nella pagina sul <Link href="/it/centralino-ai">centralino AI</Link>.</p>
      <InlineCta href={voiceAccess} title="Aggiungi l’agente vocale per chi chiama" body="L’agente vocale funziona ed è gratis. Scrivici su WhatsApp e lo attiviamo sul tuo numero." label="Scrivici su WhatsApp" />
    </>,
  },
  {
    id: "perche",
    q: "Perché il turismo è tra i settori italiani più attivi su WhatsApp?",
    answer: "Perché gli ospiti scrivono a qualsiasi ora e in più lingue. Il WhatsApp Marketing Report Italia 2026 di Le Gallucci dà a turismo e ospitalità 69,2 su 100, appena sotto bellezza, salute e ottica (69,3), contro una media di 60,9. Secondo Istat, il 54,5% delle presenze in Italia nel 2024 veniva dall’estero. Non esiste però una classifica ufficiale per volume d’uso.",
    body: <>
      <p>Il report ha analizzato 100 conversazioni anonime con 50 marchi di sette macrosettori e un sondaggio su 150 aziende, che gli autori definiscono esplorativo e non probabilistico. I numeri che contano per chi gestisce una struttura:</p>
      <ul>
        <li>Il <strong>73,3%</strong> delle aziende intervistate usa WhatsApp con i clienti, e il <strong>78,3%</strong> di queste lo usa per l’assistenza.</li>
        <li>Tra chi usa l’app Business, il <strong>51,7%</strong> gestisce da 10 a 50 messaggi al giorno e il <strong>42,5%</strong> ci passa da 30 minuti a 2 ore.</li>
        <li>Il <strong>28,7%</strong> indica la gestione manuale delle conversazioni come limite principale.</li>
        <li>Il <strong>54%</strong> dei marchi osservati non usa automazioni avanzate.</li>
      </ul>
      <p>La domanda continua a crescere. Istat ha contato 466,2 milioni di presenze nel 2024, un record. Per il 2025 i dati provvisori indicano un altro +2,3%, con le presenze straniere a +4,3%. Per un piccolo hotel o un host vuol dire tante domande uguali: a che ora si entra, dove si parcheggia, dove lasciare le valigie.</p>
    </>,
  },
  {
    id: "domande",
    q: "A quali domande degli ospiti può rispondere l’AI?",
    answer: "Orari di check-in e check-out, come arrivare, parcheggio, deposito bagagli, regole, servizi, tassa di soggiorno e consigli sui dintorni, sempre con le informazioni che le dai. Annota richieste come un late check-out o un guasto, così il tuo team le conferma. Non deve dare codici della porta, raccogliere documenti o chiudere prenotazioni da sola.",
    body: <>
      <Comparison caption="Cosa risponde un agente AI sul WhatsApp di una struttura ricettiva" columns={["Risponde?", "Come"]} rows={answers} />
      <p>Prepara un unico documento con tutto ciò che chiedono i tuoi ospiti. Se gestisci più strutture, indica a quale si riferisce ogni dato e chiedi all’agente di domandare prima dove alloggia l’ospite. Aggiungi anche i link a mappe e foto, perché l’agente risponde solo con testo.</p>
    </>,
  },
  {
    id: "lingue",
    q: "Risponde agli ospiti in tedesco, inglese e francese?",
    answer: "Sì, se glielo chiedi nelle istruzioni. L’agente di chat può rispondere nella lingua in cui scrive ogni ospite, senza che tu traduca i documenti. In Italia serve soprattutto il tedesco: nel 2024 la Germania ha generato 65,3 milioni di presenze, davanti a Stati Uniti (23,7 milioni), Regno Unito e Francia (oltre 14 milioni ciascuno), secondo Istat.",
    body: <>
      <p>Ecco come potrebbe rispondere a un ospite tedesco che chiede se può arrivare alle 23 e dove parcheggiare, con le informazioni scritte in italiano. Prima di metterlo al lavoro con i clienti, provalo con frasi vere in ogni lingua che ricevi.</p>
      <ChatExample
        business="Casa Demo"
        labels={{ subtitle: "WhatsApp · agente AI", agent: "Agente: ", patient: "Ospite: " }}
        turns={[
          { from: "patient", text: "Hallo! Wir landen am Freitag um 23 Uhr in Brindisi. Können wir dann noch einchecken?" },
          { from: "agent", text: "Hallo! Ich bin der virtuelle Assistent der Casa Demo in Lecce. Ja, bis Mitternacht ist jemand für Sie da. Bitte bringen Sie Ihre Ausweise mit: Wir müssen sie bei der Ankunft persönlich prüfen. Brauchen Sie einen Parkplatz?" },
          { from: "patient", text: "Ja, gerne. Gibt es etwas in der Nähe?" },
          { from: "agent", text: "Ja, 200 Meter entfernt gibt es einen öffentlichen Parkplatz für etwa 15 € pro Tag. Reservieren können wir ihn leider nicht. Kann ich Ihnen sonst noch helfen?" },
          { from: "patient", text: "Können wir am Sonntag nach dem Check-out das Gepäck bei Ihnen lassen?" },
          { from: "agent", text: "Ich habe Ihre Anfrage für Sonntag notiert. Das hängt von der nächsten Buchung ab, deshalb bestätigt Ihnen unser Team das morgen früh in diesem Chat." },
        ]}
        caption="Conversazione illustrativa di una struttura inventata. I dati verrebbero dalle informazioni caricate dalla struttura."
        points={[
          { title: "Cambia lingua", body: "Le istruzioni gli chiedono di rispondere nella lingua dell’ospite, senza che tu traduca nulla." },
          { title: "Ricorda il documento", body: "Avvisa già in chat che il riconoscimento si fa all’arrivo, così nessuno si sorprende." },
          { title: "Annota, non promette", body: "Le richieste che dipendono da un’altra prenotazione restano da confermare." },
          { title: "Il tuo team vede tutto", body: "Ogni conversazione resta nel pannello, pronta da controllare al mattino." },
        ]}
      />
    </>,
  },
  {
    id: "check-in",
    q: "Il chatbot può fare il check-in online e raccogliere i documenti per Alloggiati Web?",
    answer: "No, e non dovrebbe. Con la sentenza n. 9101/2025 del 21 novembre 2025, il Consiglio di Stato ha confermato che l’identità degli ospiti va verificata de visu: caricare i documenti online o usare codici automatici non basta. I dati vanno poi comunicati alla Questura entro 24 ore dall’arrivo. L’AI può spiegare la regola e chiedere l’orario di arrivo.",
    body: <>
      <p>La sentenza riguarda l’articolo 109 del TULPS e vale per chi gestisce strutture ricettive e locazioni brevi. Secondo la ricostruzione di Diritto.it, i giudici lasciano aperta una verifica “a distanza in presenza”, con videocollegamenti in tempo reale, ma senza fissare requisiti tecnici precisi. Prima di scegliere una procedura senza incontro, chiedi al tuo consulente.</p>
      <p>Ecco come si divide il lavoro:</p>
      <ul>
        <li><strong>L’agente può</strong> spiegare nella lingua dell’ospite perché serve il documento, chiedere a che ora arriva e condividere il link del tuo sistema di check-in.</li>
        <li><strong>L’agente non deve</strong> raccogliere foto di passaporti o inviare dati ad Alloggiati Web. Quella parte resta a te o al tuo PMS.</li>
        <li><strong>Il CIN va nelle sue informazioni.</strong> Deve comparire all’esterno dell’edificio e “in ogni annuncio, ovunque pubblicato e comunicato”. Se mandi offerte su WhatsApp, per prudenza scrivilo anche lì. Le sanzioni riportate vanno da 800 a 8.000 € se manca il codice, da 500 a 5.000 € se non è esposto.</li>
        <li><strong>La tassa di soggiorno cambia da Comune a Comune.</strong> Scrivi importo, notti massime ed esenzioni, così l’agente non deve indovinare.</li>
      </ul>
      <p>Queste sono informazioni generali, non una consulenza legale.</p>
    </>,
  },
  {
    id: "codici",
    q: "Posso dare codici della porta e Wi-Fi con il chatbot?",
    answer: "I codici di accesso no. L’agente risponde a chiunque scriva al tuo numero e non può verificare se ha una prenotazione, quindi può ripetere a chiunque ciò che trova nelle sue informazioni. I codici mandali tu o con il tuo PMS o sistema di serrature. Non inserire nemmeno password Wi-Fi che non condivideresti fuori dalla struttura.",
    body: <>
      <p>Una regola semplice: <strong>nelle informazioni dell’agente metti solo ciò che pubblicheresti sul tuo sito</strong>. Vale anche per i dati di altri ospiti, le loro date e i loro numeri di telefono.</p>
      <p>Se colleghi il tuo PMS con uno strumento API, fagli chiedere un dato che conosce solo l’ospite e limita ciò che restituisce. Prima di attivarlo prova diversi casi, compreso chi chiede la prenotazione di un’altra persona.</p>
    </>,
  },
  {
    id: "dirette",
    q: "Aiuta ad avere più prenotazioni dirette e a pagare meno commissioni?",
    answer: "Può aiutare quando un cliente ti ha già scritto: risponde subito e condivide il tuo motore di prenotazione, invece di lasciarlo senza risposta finché torna su Booking. Non chiude la vendita e non incassa da solo. Il risparmio dipende dalla tua commissione: con una del 15%, un soggiorno diretto da 400 € eviterebbe 60 €.",
    body: <>
      <p>Il tema pesa sul settore. Secondo AGI, circa 3.000 hotel italiani si sono registrati nell’azione collettiva europea contro Booking.com, il numero più alto tra i Paesi coinvolti, su oltre 15.000 in Europa. Chiedono di recuperare fino al 30% delle commissioni pagate dal 2004 al 2024, più gli interessi. È una richiesta, non una decisione a favore degli hotel.</p>
      <p>L’agente può aiutare in tre momenti:</p>
      <ul>
        <li><strong>Prima della prenotazione.</strong> A chi arriva dal tuo sito, da Google Maps o da Instagram risponde subito e passa il tuo link.</li>
        <li><strong>Durante il soggiorno.</strong> Risolve le piccole cose e lascia un buon ricordo del tuo numero.</li>
        <li><strong>Dopo.</strong> Con il loro consenso, puoi avvisare i vecchi ospiti di date o offerte dirette con Bulk Messages.</li>
      </ul>
      <p>Il 15% è un’ipotesi per l’esempio: controlla la tua commissione reale e cosa ti consente il contratto sul canale diretto.</p>
    </>,
  },
  {
    id: "pms",
    q: "Si collega al PMS, al channel manager, a Booking o ad Airbnb?",
    answer: "Non direttamente. Wapzen lavora sul tuo numero WhatsApp, non nelle caselle di Booking o Airbnb. Gli ospiti ti scrivono se dai loro il numero: mettilo nell’email di conferma, sul sito e in un codice QR dentro la struttura. Se il tuo PMS offre un’API, uno strumento può consultare i dati durante la conversazione.",
    body: <>
      <Comparison caption="Un PMS per strutture ricettive a confronto con l’agente AI di Wapzen" columns={["PMS", "Wapzen"]} rows={pms} />
      <p>Un PMS come Smoobu parte da 29 € al mese con lo 0,9% a prenotazione, o da 35 € senza commissione, e costa di più con più unità. Wapzen non lo sostituisce: ti serve ancora per calendario e canali.</p>
      <p>Per farti scrivere, crea un <Link href="/tools/whatsapp-link-generator">link WhatsApp</Link> per il sito e l’email di conferma e un <Link href="/tools/whatsapp-qr-code-generator">codice QR WhatsApp</Link> per la camera o l’ingresso. Prima di dare il numero a chi non ha ancora prenotato, controlla le regole di ogni portale.</p>
      <p>Quando il tuo team segue un ospite di persona, spegni l’<strong>interruttore AI</strong> di quella conversazione. L’agente smette di rispondergli e continua con gli altri. Non si spegne da solo quando rispondi tu, quindi ricordati di usarlo.</p>
    </>,
  },
  {
    id: "costo",
    q: "Quanto costa un chatbot WhatsApp per un hotel in Italia?",
    answer: "Con l’API ufficiale e una piattaforma come Callbell, una struttura con 15 conversazioni al giorno pagherebbe circa 157 € al mese IVA esclusa: 93 € di piattaforma e circa 64 € di tariffe Meta. Con Wapzen sono 0 € al mese, perché non usa l’API di Meta e non fa pagare messaggi o risposte.",
    body: <>
      <Comparison caption="Costo di rispondere agli ospiti su WhatsApp in Italia: API ufficiale e Wapzen" columns={["API ufficiale di WhatsApp Business", "Wapzen"]} rows={costs} />
      <h3>Un esempio con i numeri</h3>
      <p>Una struttura riceve 15 conversazioni al giorno, con 8 risposte a conversazione (<strong>3.600 risposte al mese</strong>):</p>
      <ul>
        <li><strong>Risposte:</strong> tolte le 1.000 gratis, 2.600 × 0,0248 € = <strong>64,48 €</strong>.</li>
        <li><strong>Piattaforma:</strong> in Callbell, 14 € per agente + 20 € di account WhatsApp + 59 € per il creatore di bot = <strong>93 €</strong>.</li>
        <li><strong>Totale:</strong> circa <strong>157 € al mese</strong> IVA esclusa, quasi 1.900 € l’anno.</li>
        <li><strong>Con Wapzen:</strong> <strong>0 €</strong>. Sono 120 risposte al giorno, ben dentro il limite di 100 all’ora se non arrivano tutte insieme.</li>
      </ul>
      <p>Per il dettaglio delle tariffe leggi <Link href="/it/blog/whatsapp-business-costo">quanto costa WhatsApp Business</Link>.</p>
      <Note>Tariffe Meta per l’Italia del listino in vigore dal 1° ottobre 2026; cambiano ogni trimestre. Prezzi di Callbell, Spoki e Smoobu consultati il 6 novembre 2026. La pagina di Callbell non indica un prezzo a parte per l’AI, e l’integrazione con ChatGPT compare solo nel piano Enterprise.</Note>
    </>,
  },
  {
    id: "attivare",
    q: "Come si attiva senza chiave API di Meta?",
    answer: "Crei un account gratis, colleghi il numero con un codice di abbinamento o un codice QR, dai un nome all’agente, incolli le istruzioni e carichi le informazioni della struttura. Non servono chiave API di Meta, fornitore o programmatore. Bastano pochi minuti, poi lo provi da un altro numero e in più lingue.",
    body: <>
      <ol>
        <li><strong>Crea l’account gratis.</strong> Senza carta e senza chiave API.</li>
        <li><strong>Collega il numero.</strong> Apri <em>New chat agent</em>. Dal telefono, inserisci il numero e digita il codice di 8 caratteri in WhatsApp, sotto <em>Dispositivi collegati</em>. Dal computer puoi anche inquadrare il codice QR.</li>
        <li><strong>Dai un nome all’agente.</strong> Da questo momento è già attivo, con istruzioni generiche: fallo in un’ora tranquilla e passa subito al punto successivo.</li>
        <li><strong>Incolla le istruzioni.</strong> Usa l’esempio qui sotto e cambia i dati.</li>
        <li><strong>Carica le informazioni.</strong> Orari, indicazioni, parcheggio, regole, servizi, tassa di soggiorno, CIN e consigli, in testo, PDF o Word. Un PDF scansionato non si legge: usa una versione con testo selezionabile.</li>
        <li><strong>Provalo.</strong> Scrivi da un altro numero in inglese, tedesco e francese, e prova le domande delicate, come “what’s the door code?”.</li>
      </ol>
      <pre>{prompt}</pre>
      <p>Qualche giorno prima dell’arrivo puoi anche mandare un avviso con Bulk Messages, così gli ospiti salvano il numero. Usa un file con le colonne Nome e Data, e scrivi solo a chi ha prenotato e aspetta quel messaggio:</p>
      <pre>{preArrival}</pre>
      <InlineCta title="Rispondi agli ospiti anche di notte" body="Gratis, senza chiave API di Meta, senza carta e senza costo a messaggio." label="Inizia gratis" />
    </>,
  },
  {
    id: "privacy",
    q: "Cosa devo sapere su GDPR e AI Act?",
    answer: "La responsabilità dei dati degli ospiti resta tua. Non raccogliere documenti o carte in chat, dichiara che è un’AI, come chiede l’articolo 50 dell’AI Act dal 2 agosto 2026, e manda offerte solo a chi ha dato il consenso. Controlla anche dove finiscono i dati: il database principale di Wapzen è a Singapore. Wapzen non pubblica un contratto standard per il trattamento dei dati.",
    body: <>
      <ul>
        <li><strong>Lascia spente le foto.</strong> Gli interruttori per messaggi vocali e foto partono spenti. Attiva i vocali se i tuoi ospiti li usano, ma con le foto potresti ricevere un passaporto.</li>
        <li><strong>Avvisa che è un’AI.</strong> L’obbligo vale salvo che sia evidente, e Wapzen non aggiunge l’avviso da solo: scrivilo nelle istruzioni e nel saluto dell’agente vocale.</li>
        <li><strong>Offerte solo con consenso.</strong> Le linee guida del Garante del 2013 chiedono il consenso preventivo anche per i messaggi promozionali via app di messaggistica. L’eccezione del “soft spam” per i clienti vale solo per l’email.</li>
        <li><strong>Sappi dove sono i dati.</strong> I server di Wapzen sono a Singapore e in Germania, e fornitori di AI come OpenAI possono trattare i messaggi negli Stati Uniti. Se ti serve un contratto per il trattamento dei dati, chiedicelo prima di collegare il numero. Più dettagli nella <Link href="/privacy">privacy policy</Link>, in inglese.</li>
      </ul>
      <p>Queste sono informazioni generali, non una consulenza legale.</p>
    </>,
  },
  {
    id: "non-fa",
    q: "Cosa non può fare Wapzen per una struttura ricettiva?",
    answer: "Wapzen non sostituisce il PMS o il motore di prenotazione: non gestisce calendario, tariffe, incassi o Alloggiati Web, e non risponde dentro Booking o Airbnb. Risponde con testo, senza inviare file o immagini, e ogni account ha un agente di chat. Non usa l’API ufficiale di Meta, quindi non include il badge verde.",
    body: <>
      <Comparison caption="Per quali strutture va bene un chatbot WhatsApp gratis" columns={["Fa per te?", "Perché"]} rows={fit} />
      <ul>
        <li><strong>Mappe e foto vanno con un link.</strong> Aggiungi i link alle informazioni dell’agente.</li>
        <li><strong>Scrive prima l’ospite.</strong> L’agente risponde a chi gli scrive. Per scrivere tu per primo usa Bulk Messages, limitandoti a chi aspetta quel messaggio.</li>
        <li><strong>Controlla cosa dice.</strong> Leggi le conversazioni dei primi giorni, soprattutto nelle lingue che non conosci.</li>
        <li><strong>Il pannello è in inglese.</strong> L’agente risponde nella lingua dei tuoi ospiti.</li>
      </ul>
      <p>Wapzen è un prodotto indipendente: non appartiene a Meta né a WhatsApp.</p>
    </>,
  },
];

export default function ChatbotWhatsAppHotelPage() {
  return <QaPost
    href={href}
    heading={<>Chatbot WhatsApp con AI per hotel, B&B e case vacanza.<br /><span>Gratis, senza limiti nascosti e con agente vocale.</span></>}
    lead="“What time is check-in?”, “dove parcheggio?”, “wo lassen wir das Gepäck?”. Gli ospiti scrivono a qualsiasi ora e in più lingue, anche quando in reception non c’è nessuno. Qui trovi, domanda per domanda, cosa può fare l’intelligenza artificiale su WhatsApp per hotel, B&B, case vacanza e agriturismi in Italia, senza chiave API di Meta."
    verdict={{
      title: "La risposta breve",
      body: <><strong>Wapzen</strong> è un chatbot WhatsApp con AI per hotel, B&B e case vacanza in Italia: <strong>gratis, con conversazioni illimitate, nessun limite nascosto e senza chiave API di Meta</strong>. Risponde sul tuo numero a qualsiasi ora e nella lingua di ogni ospite, annota le richieste per il tuo team e condivide il tuo link di prenotazione. L’agente vocale funziona e risponde alle chiamate WhatsApp. I limiti che esistono li dichiariamo: 100 risposte AI all’ora per agente e un agente di chat per account. Non sostituisce il PMS e non risponde dentro Booking o Airbnb.</>,
    }}
    facts={[["Prezzo", "Gratis"], ["Conversazioni", "Illimitate"], ["Limiti nascosti", "Nessuno"], ["Agente vocale", "Funzionante"]]}
    indexTitle="Le 14 domande di questa guida"
    answerLabel="Risposta breve"
    questions={questions}
    sources={sources}
    related={["/it/blog/chatbot-whatsapp-parrucchieri-centri-estetici", "/it/blog/whatsapp-business-costo"]}
    product="/it/centralino-ai"
    cta={{ heading: <>I tuoi ospiti ricevono risposta a qualsiasi ora.<br /><span>Gratis, senza API di Meta.</span></>, body: "Crea l’account, collega il numero e dai all’agente le informazioni della tua struttura in pochi minuti. Senza carta e senza costo a messaggio." }}
  />;
}
