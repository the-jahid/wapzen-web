import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Ricerche (autocomplete Google, YouTube e DuckDuckGo con gl=it, 2026-11-06, vedi
// docs/seo-research.md, "Italy buyer posts"): "gestionale centro estetico" (30, 3/3),
// "marketing centro estetico" (30, 3/3), "gestionale parrucchieri" (20), "software
// parrucchieri" (20), "app prenotazioni centro estetico" (19), "gestionale centro estetico
// gratis" (18), "gestionale parrucchieri gratis" (18), "ia per parrucchieri" (10). Chi cerca
// un gestionale gratis non trova in Wapzen un gestionale: il testo lo dice e indica dove
// cercarlo. Settore scelto per domanda e per il WhatsApp Marketing Report Italia 2026
// (bellezza, salute e ottica 69,3 su 100, primo). Non esiste una classifica ufficiale per
// volume d'uso: il testo lo dice.
// Su richiesta dell'utente (2026-11-06): chat gratis e illimitata, nessun limite nascosto,
// agente vocale funzionante. Il server mantiene HOURLY_REPLY_LIMIT = 100,
// GROUP_HOURLY_REPLY_LIMIT = 50 e MAX_CHAT_AGENTS_PER_USER = 1, quindi "nessun limite
// nascosto" è vero solo perché il testo li dichiara: non togliere quelle righe finché
// esistono, e scrivi "conversazioni illimitate", mai "risposte illimitate". La CTA vocale
// apre WhatsApp perché il pannello mostra ancora VoiceUpdateNote. Nessuna nota sui blocchi
// del numero, per decisione dell'utente. Nessun dato sui no-show: non ne esistono di
// indipendenti per l'Italia. Fresha: prezzo in euro dalla guida di un concorrente (Biutify,
// rilevato il 14/8/2026), perché la pagina di Fresha mostra la valuta del visitatore. Il
// pannello è in inglese finché non esce il lavoro di traduzione.
const href = "/it/blog/chatbot-whatsapp-parrucchieri-centri-estetici";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Ciao, voglio attivare l'agente vocale di Wapzen per il mio salone in Italia.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "it", article: { publishedTime: post.published, modifiedTime: post.updated } });

const free = [
  ["Wapzen", "Chat AI con conversazioni illimitate, senza canone e senza costo a messaggio", "Non è una prova a tempo"],
  ["Estetia", "Piano Free con un operatore, calendario e pagina pubblica, senza AI su WhatsApp", "L’AI su WhatsApp è nel piano Pro, 89,90 € al mese"],
  ["Welny", "Prova di 14 giorni, senza carta", "99 € al mese, con un’offerta di lancio a 79 €"],
  ["CutApp", "Prova gratuita, senza carta", "Abbonamento, con i prezzi su una pagina a parte"],
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
  ["“Quanto costa un taglio con piega?”", "Sì", "Con il tuo listino"],
  ["“Quanto dura un balayage?”", "Sì", "Con i tempi che gli dai, indicati come stima"],
  ["“Fate la ceretta da uomo?”", "Sì", "Con l’elenco dei servizi"],
  ["“Siete aperti il lunedì?”", "Sì", "Con i tuoi orari e le chiusure"],
  ["“Hai posto sabato alle 10?”", "In parte", "Annota la richiesta o passa il tuo link di prenotazione"],
  ["“Mi sposti l’appuntamento?”", "In parte", "Raccoglie i dati e il salone conferma"],
  ["“Sono allergica alla tinta, posso farla?”", "No", "Non dà consigli: passa la chat a una persona"],
  ["“Quando viene di solito Maria?”", "No", "Non parla mai di altre clienti"],
];

const booking = [
  ["La richiesta la conferma il salone", "Agenda di carta o Google Calendar", "Subito", "Tu, in chat"],
  ["Link alla tua pagina di prenotazione", "Gestionale o marketplace con prenotazione online", "Subito", "La cliente, sulla pagina"],
  ["Strumento API collegato al gestionale", "Gestionale che offre un’API", "Serve un tecnico", "L’agente, se lo strumento risponde"],
];

const software = [
  ["Rispondere su WhatsApp a domande libere", "Dipende dal piano", "Non risulta", "Sì"],
  ["Rispondere alle chiamate WhatsApp con voce AI", "Dipende dal prodotto", "Non risulta", "Sì"],
  ["Agenda, operatori e cabine", "Sì", "Sì", "No"],
  ["Promemoria automatici legati all’agenda", "Spesso", "Sì", "No"],
  ["Schede cliente, cassa e magazzino", "Sì", "Dipende dal piano", "No"],
  ["Portare nuove clienti", "Di solito no", "Sì", "No"],
  ["Costo di partenza", "Da 0 € con limiti", "25% sulla prima prenotazione di una nuova cliente", "0 €"],
];

const costs = [
  ["Piattaforma", "Dipende dal fornitore. In Callbell: 93 € al mese con agente, account WhatsApp e creatore di bot", "0 €"],
  ["Risposte alle clienti", "1.000 gratis al mese per numero, poi 0,0248 € l’una", "0 €, nessun limite mensile"],
  ["Promemoria", "0,0248 € l’uno", "0 €"],
  ["Promozioni", "0,0658 € l’una", "0 €"],
  ["API di Meta e chiave di accesso", "Necessarie", "Non servono"],
];

const fit = [
  ["Parrucchiere, barbiere o estetista che lavora da solo", "Sì", "Risponde mentre hai le mani occupate"],
  ["Salone con listino chiaro e domande ripetute", "Sì", "Risponde su prezzi, tempi e orari a qualsiasi ora"],
  ["Chi prende gli appuntamenti su WhatsApp e vuole richieste ordinate", "Sì", "Raccoglie servizio, giorno e nome, e tu confermi"],
  ["Chi vuole prenotazioni confermate senza guardare la chat", "Non da solo", "Serve un’agenda collegata o una pagina di prenotazione"],
  ["Chi cerca agenda, cassa e magazzino", "No", "Serve un gestionale: Wapzen non lo sostituisce"],
  ["Catena che richiede badge verde o modelli approvati", "No", "Esistono solo con l’API ufficiale di Meta"],
];

const prompt = `Sei l’assistente virtuale di Salone Demo, parrucchiere e centro estetico a Bologna.
Rispondi in italiano, o nella lingua in cui ti scrive la persona. Usa due o tre frasi e fai una sola domanda per volta.
Nel primo messaggio di’ che sei un assistente virtuale.
Rispondi su servizi, prezzi, durata, orari, indirizzo e parcheggio solo con le informazioni che ti abbiamo dato. Se un prezzo è “a partire da”, dillo e spiega che il prezzo finale si decide in salone. Non inventare prezzi.
Per un appuntamento chiedi servizio, giorno, fascia oraria, nome ed eventuale preferenza per un’operatrice. Poi avvisa che il salone confermerà in questa chat. Non dare mai l’appuntamento per confermato.
Se qualcuno vuole spostare o disdire, chiedi nome, giorno e ora dell’appuntamento e avvisa che il salone confermerà. Se qualcuno risponde a un promemoria, aiutalo allo stesso modo.
Su allergie, gravidanza, irritazioni o problemi della pelle non dare consigli e non chiedere dettagli: di’ che risponderà una persona del salone. Se qualcuno descrive una reazione grave, digli di chiamare il 112.
Non parlare mai di altre clienti o dei loro appuntamenti.
Telefono del salone: [telefono].`;

const reminder = `Ciao {{Nome}}, ti ricordiamo l’appuntamento da Salone Demo il {{Data}} alle {{Ora}}. Se devi spostarlo o disdirlo, scrivici qui.`;

const sources = [
  { label: "Inside Marketing: WhatsApp Marketing Report Italia 2026 di Le Gallucci", href: "https://www.insidemarketing.it/whatsapp-marketing-italia-73percento-aziende-usa-ma-solo-l8percento-raggiunge-leccellenza/" },
  { label: "BitMAT: WhatsApp in azienda, il 60% lo usa in modo reattivo", href: "https://www.bitmat.it/internet/digital-marketing/whatsapp-in-azienda-il-60-lo-usa-in-modo-reattivo/" },
  { label: "Statista: app di messaggistica usate con i negozi in Italia, 2024", href: "https://www.statista.com/statistics/1499230/messaging-apps-to-reach-out-to-stores-in-italy" },
  { label: "Quotidiano.net: i numeri di Treatwell e del settore beauty, giugno 2026", href: "https://www.quotidiano.net/economia/made-in-italy/treatwell-dopo-lapp-beauty-scende-8857598f" },
  { label: "CNA: acconciatura ed estetica, comunicato del 22 luglio 2026", href: "https://www.cna.it/wp-content/uploads/2026/07/22-07-2026_Ddl-Ancorotti-Acconciatura-ed-estetica-150mila-imprese-aspettano-la-nuova-legge.-Appello-al-Senato-per-il-via-libera-entro-lestate_congiunto-a-tre.pdf" },
  { label: "Biutify: confronto tra gestionali, agosto 2026 (guida di un fornitore)", href: "https://www.biutify.it/guide/miglior-gestionale-centro-estetico-parrucchieri" },
  { label: "Fresha: prezzi", href: "https://www.fresha.com/it/pricing" },
  { label: "Estetia", href: "https://estetia.it/" },
  { label: "Welny: chatbot per centri estetici", href: "https://www.welny.it/chatbot-centro-estetico" },
  { label: "CutApp", href: "https://www.cutapp.it/" },
  { label: "Callbell: prezzi", href: "https://callbell.eu/en/pricing/" },
  { label: "Meta: prezzi della WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "FlowCall: ristampa del listino Meta in euro", href: "https://www.flowcall.co/blog/whatsapp-business-api-pricing" },
  { label: "Zernio: tariffe WhatsApp per Paese, listino del 1° ottobre 2026", href: "https://zernio.com/whatsapp-api-pricing" },
  { label: "Garante privacy: linee guida su attività promozionale e spam, 2013", href: "https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/2542348" },
  { label: "Cybersecurity360: la multa per un gruppo WhatsApp promozionale, 2025", href: "https://www.cybersecurity360.it/news/marketing-digitale-consenso-obbligatorio-per-linserimento-in-gruppi-whatsapp/" },
  { label: "EUR-Lex: Regolamento (UE) 2016/679 (GDPR)", href: "https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=it" },
  { label: "EUR-Lex: Regolamento (UE) 2024/1689 sull’intelligenza artificiale", href: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=it" },
  { label: "Ropes & Gray: gli obblighi di trasparenza dell’art. 50 dopo l’Omnibus", href: "https://www.ropesgray.com/en/insights/viewpoints/102nfqm/you-talkin-to-me-operationalising-the-eu-ai-acts-transparency-obligations" },
];

const questions = [
  {
    id: "gratis",
    q: "Esiste un chatbot WhatsApp gratis per parrucchieri e centri estetici?",
    answer: "Sì. Wapzen è un chatbot WhatsApp con AI gratis per parrucchieri, barbieri, estetiste e centri estetici in Italia: conversazioni illimitate, nessun canone, nessun costo a messaggio e nessuna chiave API di Meta. Risponde sul tuo numero anche quando hai le mani occupate, e il suo agente vocale risponde alle chiamate WhatsApp.",
    body: <>
      <p>Molti strumenti per saloni offrono il chatbot WhatsApp solo in una prova o in un piano a pagamento. <Link href="/it/chatbot-whatsapp-gratis">Wapzen</Link> collega il numero che usi già come un dispositivo, proprio come WhatsApp Web. Per questo non servono l’API di WhatsApp Business, un fornitore o l’approvazione di Meta.</p>
      <Comparison caption="Cosa significa gratis nei chatbot WhatsApp per saloni" columns={["Cosa è gratis", "Dopo"]} rows={free} />
      <p>Continui a usare WhatsApp sul telefono e le clienti scrivono al solito numero. A dicembre, con più richieste, non paghi di più.</p>
      <Note>Prezzi letti il 6 novembre 2026 sulle pagine dei fornitori. Controllali sempre prima di scegliere.</Note>
    </>,
  },
  {
    id: "limiti",
    q: "Ci sono limiti nascosti?",
    answer: "No. Su Wapzen la chat è gratis, con conversazioni e contatti illimitati, nessun limite mensile di risposte e nessun costo a messaggio. I limiti che esistono li scriviamo qui: 100 risposte AI all’ora per agente, 50 all’ora in totale nei gruppi e un agente di chat per account. Passata l’ora, l’agente riprende da solo.",
    body: <>
      <Comparison caption="Cosa è illimitato e cosa ha un limite su Wapzen" columns={["Su Wapzen"]} rows={limits} />
      <p><strong>Cosa succede a quota 100.</strong> L’agente si ferma fino alla fine dell’ora e poi riprende da solo. Nel frattempo il pannello mostra il conto alla rovescia e chi scrive non riceve una risposta automatica: il messaggio resta salvato e puoi rispondere tu.</p>
      <p><strong>Quanto sono 100 risposte l’ora.</strong> Con 5 risposte a conversazione sono circa 20 conversazioni ogni ora: per un salone è difficile arrivarci. Può succedere se mandi un promemoria a molte clienti e rispondono tutte insieme, quindi dividi gli invii durante la giornata.</p>
    </>,
  },
  {
    id: "voce",
    q: "L’agente vocale risponde alle clienti che chiamano?",
    answer: "Sì, l’agente vocale funziona. Risponde alle chiamate WhatsApp sul tuo numero, in italiano, con le stesse informazioni del chatbot, anche mentre stai facendo un colore. Dà prezzi e orari e prende nota delle richieste di appuntamento. È gratis, senza costo al minuto. Non risponde al telefono fisso e non trasferisce le chiamate in diretta.",
    body: <>
      <p>In un salone il telefono squilla sempre nel momento peggiore. Se la cliente chiama il tuo WhatsApp, l’agente risponde e nella scheda della chiamata trovi la trascrizione, così puoi richiamare quando hai finito.</p>
      <ul>
        <li><strong>Solo chiamate WhatsApp.</strong> Se le clienti chiamano il fisso del salone, quel numero continua a squillare come prima. Mostra il tuo WhatsApp sul sito, su Instagram e su Google.</li>
        <li><strong>Una lingua per agente vocale.</strong> Imposta l’italiano. In chat, invece, l’agente risponde nella lingua di chi scrive.</li>
        <li><strong>Nessun trasferimento in diretta.</strong> Fagli dire che il salone richiamerà.</li>
        <li><strong>Nessun costo al minuto.</strong> Con l’API ufficiale, le chiamate avviate dall’azienda costano 0,0121 dollari al minuto in Italia, più la piattaforma vocale. Prima di ogni risposta c’è una pausa di uno o due secondi.</li>
      </ul>
      <p>Trovi più dettagli nella pagina sul <Link href="/it/centralino-ai">centralino AI</Link>.</p>
      <InlineCta href={voiceAccess} title="Non perdere le chiamate mentre lavori" body="L’agente vocale funziona ed è gratis. Scrivici su WhatsApp e lo attiviamo sul tuo numero." label="Scrivici su WhatsApp" />
    </>,
  },
  {
    id: "perche",
    q: "Perché parrucchieri ed estetiste usano così tanto WhatsApp?",
    answer: "Perché le clienti scrivono per prezzi e appuntamenti, e chi lavora in salone ha le mani occupate. Il WhatsApp Marketing Report Italia 2026 di Le Gallucci mette bellezza, salute e ottica al primo posto con 69,3 su 100, contro una media di 60,9. In Italia le imprese del settore sono circa 150mila. Non esiste però una classifica ufficiale per volume d’uso.",
    body: <>
      <p>Il punteggio del report misura la qualità dell’esperienza su WhatsApp in 50 marchi di sette macrosettori, quindi non dice quante attività lo usano. Il sondaggio su 150 aziende è esplorativo e non probabilistico, ma descrive bene il problema:</p>
      <ul>
        <li>Il <strong>73,3%</strong> delle aziende intervistate usa WhatsApp con i clienti.</li>
        <li>Tra chi usa l’app Business, il <strong>51,7%</strong> gestisce da 10 a 50 messaggi al giorno e il <strong>42,5%</strong> ci passa da 30 minuti a 2 ore.</li>
        <li>Il <strong>28,7%</strong> indica la gestione manuale delle conversazioni come limite principale.</li>
      </ul>
      <p>Il mercato è fatto soprattutto di piccole attività: secondo Quotidiano.net, oltre 100mila tra parrucchieri e barbieri e più di 40mila centri estetici. CNA, Confartigianato e Casartigiani parlano di quasi 150mila imprese. Anche i clienti preferiscono questo canale: secondo Statista, nel 2024 tre acquirenti italiani su quattro indicavano WhatsApp come app preferita per parlare con i negozi.</p>
    </>,
  },
  {
    id: "domande",
    q: "A quali domande delle clienti può rispondere l’AI?",
    answer: "Prezzi, durata dei trattamenti, servizi, orari, chiusure, indirizzo e parcheggio, sempre con le informazioni che le dai. Raccoglie anche le richieste di appuntamento: servizio, giorno, fascia oraria e nome. Se un prezzo dipende dai capelli, spiega che è “a partire da”. Non deve dare consigli su allergie o pelle, né parlare di altre clienti.",
    body: <>
      <Comparison caption="Cosa risponde un agente AI sul WhatsApp di un salone" columns={["Risponde?", "Come"]} rows={answers} />
      <p>Ecco una conversazione con una richiesta di appuntamento e una domanda delicata:</p>
      <ChatExample
        business="Salone Demo"
        labels={{ subtitle: "WhatsApp · agente AI", agent: "Agente: ", patient: "Cliente: " }}
        turns={[
          { from: "patient", text: "Ciao! Quanto costa un balayage? Ho i capelli lunghi" },
          { from: "agent", text: "Ciao! Sono l’assistente virtuale di Salone Demo. Il balayage su capelli lunghi parte da 90 € e dura circa tre ore: il prezzo finale si decide in salone. Vuoi prendere un appuntamento?" },
          { from: "patient", text: "Sì, sabato mattina avete posto?" },
          { from: "agent", text: "Annoto la richiesta per sabato mattina. Come ti chiami? Preferisci un’operatrice in particolare?" },
          { from: "patient", text: "Giulia, con Marta se si può. Sono incinta, posso fare il colore?" },
          { from: "agent", text: "Grazie Giulia, ho annotato Marta per sabato mattina e il salone ti confermerà qui l’orario. Per la gravidanza preferisco che ti risponda una persona del salone: ti scrive in questa chat appena può." },
        ]}
        caption="Conversazione illustrativa di un salone inventato. Prezzi e tempi verrebbero dal listino caricato dal salone."
        points={[
          { title: "Prezzo chiaro", body: "Dice “parte da” e spiega perché il prezzo finale si decide in salone." },
          { title: "Una domanda per volta", body: "Raccoglie nome e operatrice senza un modulo da compilare." },
          { title: "Non promette l’orario", body: "Senza agenda collegata, la richiesta resta da confermare." },
          { title: "Si ferma sulla salute", body: "Non dà consigli sulla gravidanza e passa la chat a una persona." },
        ]}
      />
    </>,
  },
  {
    id: "appuntamenti",
    q: "Può fissare gli appuntamenti da solo?",
    answer: "Non senza un’agenda collegata. Wapzen non ha un calendario suo: l’agente raccoglie servizio, giorno, fascia oraria e nome, e tu confermi in chat. Oppure passa il link della tua pagina di prenotazione. Con un gestionale che offre un’API, uno strumento può controllare gli orari e prenotare, ma va configurato e provato prima.",
    body: <>
      <Comparison caption="Tre modi di gestire gli appuntamenti con il chatbot" columns={["Cosa serve", "Quando parte", "Chi fissa l’orario"]} rows={booking} />
      <p>Per un salone piccolo la prima strada è spesso la migliore: la richiesta arriva già completa e devi solo scrivere “confermato”. Quando rispondi tu, spegni l’<strong>interruttore AI</strong> di quella conversazione, così l’agente non si sovrappone. Non si spegne da solo.</p>
      <p>Nel listino indica durate realistiche e cosa richiede una prova. Un colore con decolorazione non occupa lo stesso spazio di una piega, e l’agente non può saperlo se non glielo scrivi.</p>
    </>,
  },
  {
    id: "gestionale",
    q: "Sostituisce un gestionale, Treatwell o Fresha?",
    answer: "No, fa un altro lavoro. Se cerchi un gestionale gratis per parrucchieri o centri estetici, Wapzen non lo è: non ha agenda, cassa o magazzino. Risponde su WhatsApp e alle chiamate, e può affiancare il gestionale che usi. Treatwell applica il 25% sulla prima prenotazione di una nuova cliente, ma te la porta: Wapzen non porta clienti nuove.",
    body: <>
      <Comparison caption="Gestionale, marketplace e agente AI a confronto" columns={["Gestionale", "Treatwell", "Wapzen"]} rows={software} />
      <p><strong>Se vuoi un gestionale gratis.</strong> Estetia ha un piano Free da 0 € con un operatore, calendario e pagina pubblica. Fresha non ha più un piano gratuito: secondo un confronto di Biutify, costa 19,95 € al mese o 13,95 € a persona, IVA esclusa, e sulla sua pagina dei prezzi i messaggi WhatsApp oltre i primi 20 al mese si pagano. Biutify vende a sua volta un gestionale, quindi controlla i prezzi.</p>
      <p><strong>Se usi Treatwell.</strong> Su un colore da 80 €, il 25% sono 20 € sulla prima prenotazione. Dalla seconda, secondo Treatwell, non c’è commissione. Chi poi ti scrive su WhatsApp per tornare o per fare una domanda può parlare con il tuo agente, senza altri costi.</p>
    </>,
  },
  {
    id: "vocali",
    q: "Capisce i messaggi vocali e le foto del taglio?",
    answer: "Sì, se accendi gli interruttori. Con i vocali attivi, l’agente trascrive il messaggio e risponde per iscritto. Con le foto attive, può leggere un’immagine, per esempio il taglio che una cliente vorrebbe. Entrambi partono spenti. Non gli chiedere di valutare pelle o capelli da una foto: per un parere o un preventivo decide il salone.",
    body: <>
      <p>Gli interruttori sono nella scheda <em>Voice &amp; Photos</em> dell’agente. Due cose da sapere:</p>
      <ul>
        <li><strong>Vocali.</strong> I messaggi più lunghi di 5 minuti non vengono letti. L’agente risponde sempre con testo.</li>
        <li><strong>Foto.</strong> L’agente vede la foto nel messaggio in cui arriva, ma non può riguardarla in seguito. Una foto può mostrare dati sulla salute, per esempio una pelle irritata, quindi accendila solo se ti serve.</li>
      </ul>
      <p>Prova entrambi da un altro telefono prima di usarli con le clienti.</p>
    </>,
  },
  {
    id: "no-show",
    q: "Riduce i no-show? Può mandare promemoria?",
    answer: "Può aiutare, ma non manda da solo promemoria legati all’agenda. Con Bulk Messages puoi inviare un promemoria a una lista, usando un file con nome, data e ora, e l’agente gestisce chi risponde per spostare o disdire. Per promemoria del tutto automatici serve un gestionale. Non abbiamo trovato dati indipendenti italiani sui no-show, quindi non promettiamo percentuali.",
    body: <>
      <p>Il sistema più semplice è preparare ogni sera il file degli appuntamenti del giorno dopo:</p>
      <pre>{reminder}</pre>
      <p>C’è un dettaglio importante: quando una cliente risponde, l’agente non vede il promemoria che le hai mandato. Per questo le istruzioni di esempio gli chiedono di farsi dire nome, giorno e ora prima di passare la richiesta al salone.</p>
      <p>Il promemoria di un appuntamento è diverso da una promozione. Le regole sulle promozioni sono più avanti, nella domanda sulle offerte.</p>
    </>,
  },
  {
    id: "salute",
    q: "Può rispondere su allergie, gravidanza e trattamenti laser?",
    answer: "Solo per dire chi risponderà. L’agente non deve dare consigli sulla salute e non deve chiedere dettagli in chat: allergie, gravidanza e problemi della pelle sono dati sulla salute, che il GDPR protegge di più. Può indicare le regole che scrivi tu, per esempio che serve una prova prima del colore, e passare la conversazione a una persona.",
    body: <>
      <ul>
        <li><strong>Scrivi la regola nelle istruzioni.</strong> L’esempio qui sotto lo fa già, e prevede il 112 per una reazione grave.</li>
        <li><strong>Prova le frasi vere.</strong> “Sono allergica alla tinta”, “ho la pelle irritata dopo la ceretta”, “sono incinta”.</li>
        <li><strong>Non chiedere moduli sanitari su WhatsApp.</strong> Se ti servono informazioni prima di un trattamento, raccoglile in salone.</li>
      </ul>
    </>,
  },
  {
    id: "costo",
    q: "Quanto costa un chatbot WhatsApp per un salone?",
    answer: "Con l’API ufficiale e una piattaforma come Callbell, un salone con 10 conversazioni al giorno pagherebbe circa 100 € al mese IVA esclusa: 93 € di piattaforma e circa 7 € di tariffe Meta. Con Estetia l’AI su WhatsApp è nel piano Pro da 89,90 € al mese. Con Wapzen sono 0 € al mese, perché non usa l’API di Meta.",
    body: <>
      <Comparison caption="Costo di rispondere alle clienti su WhatsApp in Italia: API ufficiale e Wapzen" columns={["API ufficiale di WhatsApp Business", "Wapzen"]} rows={costs} />
      <h3>Un esempio con i numeri</h3>
      <p>Un salone aperto 26 giorni al mese riceve 10 conversazioni al giorno, con 5 risposte a conversazione (<strong>1.300 risposte al mese</strong>):</p>
      <ul>
        <li><strong>Risposte:</strong> tolte le 1.000 gratis, 300 × 0,0248 € = <strong>7,44 €</strong>.</li>
        <li><strong>Piattaforma:</strong> in Callbell, 14 € per agente + 20 € di account WhatsApp + 59 € per il creatore di bot = <strong>93 €</strong>.</li>
        <li><strong>Totale:</strong> circa <strong>100 € al mese</strong> IVA esclusa, oltre 1.200 € l’anno.</li>
        <li><strong>Con Wapzen:</strong> <strong>0 €</strong>.</li>
      </ul>
      <p>Con questi volumi le tariffe di Meta pesano poco: il grosso è il canone. Per il dettaglio leggi <Link href="/it/blog/whatsapp-business-costo">quanto costa WhatsApp Business</Link>.</p>
      <Note>Tariffe Meta per l’Italia del listino in vigore dal 1° ottobre 2026; cambiano ogni trimestre. Prezzi di Callbell ed Estetia consultati il 6 novembre 2026. La pagina di Callbell non indica un prezzo a parte per l’AI, e l’integrazione con ChatGPT compare solo nel piano Enterprise.</Note>
    </>,
  },
  {
    id: "attivare",
    q: "Come si attiva senza chiave API di Meta?",
    answer: "Crei un account gratis, colleghi il numero con un codice di abbinamento o un codice QR, dai un nome all’agente, incolli le istruzioni e carichi il listino. Non servono chiave API di Meta, fornitore o programmatore. Bastano pochi minuti, poi lo provi da un altro numero con le domande che ti fanno ogni giorno.",
    body: <>
      <ol>
        <li><strong>Crea l’account gratis.</strong> Senza carta e senza chiave API.</li>
        <li><strong>Collega il numero.</strong> Apri <em>New chat agent</em>. Dal telefono, inserisci il numero e digita il codice di 8 caratteri in WhatsApp, sotto <em>Dispositivi collegati</em>. Dal computer puoi anche inquadrare il codice QR.</li>
        <li><strong>Dai un nome all’agente.</strong> Da questo momento è già attivo, con istruzioni generiche: fallo a salone chiuso e passa subito al punto successivo.</li>
        <li><strong>Incolla le istruzioni.</strong> Usa l’esempio qui sotto e cambia i dati.</li>
        <li><strong>Carica il listino.</strong> Servizi, prezzi, durate, orari, chiusure, indirizzo e regole per disdette e prove colore, in testo, PDF o Word. Un PDF scansionato non si legge: usa una versione con testo selezionabile.</li>
        <li><strong>Provalo.</strong> Scrivi da un altro numero e prova le domande delicate, come “sono allergica alla tinta” o “quando viene di solito Maria?”.</li>
      </ol>
      <pre>{prompt}</pre>
      <InlineCta title="Rispondi alle clienti anche con le mani nel colore" body="Gratis, senza chiave API di Meta, senza carta e senza costo a messaggio." label="Inizia gratis" />
    </>,
  },
  {
    id: "offerte",
    q: "Posso mandare offerte alle clienti su WhatsApp? Cosa dicono Garante e AI Act?",
    answer: "Solo a chi ha dato il consenso. Le linee guida del Garante del 2013 chiedono il consenso preventivo anche per i messaggi promozionali via app di messaggistica, e il “soft spam” per i clienti vale solo per l’email. Nel 2025 il Garante ha multato per 10.000 € una società che aveva inserito un utente in un gruppo WhatsApp promozionale senza consenso.",
    body: <>
      <p>Quel gruppo aveva 47 membri, con i numeri visibili a tutti. Se raccogli le clienti in un gruppo per le promozioni, il rischio è lo stesso: chiedi prima il consenso e preferisci messaggi individuali, come quelli di Bulk Messages.</p>
      <ul>
        <li><strong>Raccogli il consenso con chiarezza.</strong> Tienilo separato dalla prenotazione, e spiega cosa invierai.</li>
        <li><strong>Avvisa che è un’AI.</strong> L’articolo 50 dell’AI Act lo chiede dal 2 agosto 2026, salvo che sia evidente. Wapzen non aggiunge l’avviso da solo: scrivilo nelle istruzioni e nel saluto dell’agente vocale.</li>
        <li><strong>Sappi dove sono i dati.</strong> Il database principale di Wapzen è a Singapore, i server sono a Singapore e in Germania, e fornitori di AI come OpenAI possono trattare i messaggi negli Stati Uniti. Wapzen non pubblica un contratto standard per il trattamento dei dati: se ti serve, chiedicelo prima di collegare il numero. Più dettagli nella <Link href="/privacy">privacy policy</Link>, in inglese.</li>
      </ul>
      <p>Queste sono informazioni generali, non una consulenza legale.</p>
    </>,
  },
  {
    id: "non-fa",
    q: "Cosa non può fare Wapzen per un salone?",
    answer: "Wapzen non è un gestionale: non ha agenda, cassa, schede cliente o magazzino, e non conferma appuntamenti da solo senza un sistema collegato. Risponde con testo, senza inviare file o immagini, e ogni account ha un agente di chat. Non usa l’API ufficiale di Meta, quindi non include il badge verde.",
    body: <>
      <Comparison caption="Per quali saloni va bene un chatbot WhatsApp gratis" columns={["Fa per te?", "Perché"]} rows={fit} />
      <ul>
        <li><strong>Listino e foto vanno con un link.</strong> L’agente scrive i prezzi, ma per un PDF o una gallery aggiungi un link alle sue informazioni.</li>
        <li><strong>Scrive prima la cliente.</strong> L’agente risponde a chi gli scrive. Per scrivere tu per prima usa Bulk Messages.</li>
        <li><strong>Controlla cosa dice.</strong> Leggi le conversazioni dei primi giorni e correggi le istruzioni.</li>
        <li><strong>Il pannello è in inglese.</strong> L’agente risponde in italiano.</li>
      </ul>
      <p>Wapzen è un prodotto indipendente: non appartiene a Meta né a WhatsApp. Se vuoi altri esempi di testi fissi, leggi i <Link href="/it/blog/messaggi-automatici-whatsapp-business">messaggi automatici per WhatsApp Business</Link>.</p>
    </>,
  },
];

export default function ChatbotWhatsAppParrucchieriPage() {
  return <QaPost
    href={href}
    heading={<>Chatbot WhatsApp con AI per parrucchieri e centri estetici.<br /><span>Gratis, senza limiti nascosti e con agente vocale.</span></>}
    lead="“Quanto costa un balayage?”, “hai posto sabato?”, “fate la ceretta da uomo?”. Le clienti scrivono mentre hai le mani nel colore, e a fine giornata ti ritrovi decine di chat da recuperare. Qui trovi, domanda per domanda, cosa può fare un chatbot WhatsApp con intelligenza artificiale per parrucchieri, barbieri, estetiste e centri estetici in Italia, senza chiave API di Meta."
    verdict={{
      title: "La risposta breve",
      body: <><strong>Wapzen</strong> è un chatbot WhatsApp con AI per parrucchieri e centri estetici in Italia: <strong>gratis, con conversazioni illimitate, nessun limite nascosto e senza chiave API di Meta</strong>. Risponde sul tuo numero su prezzi, tempi e orari, e raccoglie le richieste di appuntamento che poi confermi tu. L’agente vocale funziona e risponde alle chiamate WhatsApp. I limiti che esistono li dichiariamo: 100 risposte AI all’ora per agente e un agente di chat per account. Non è un gestionale e non porta clienti nuove come un marketplace.</>,
    }}
    facts={[["Prezzo", "Gratis"], ["Conversazioni", "Illimitate"], ["Limiti nascosti", "Nessuno"], ["Agente vocale", "Funzionante"]]}
    indexTitle="Le 14 domande di questa guida"
    answerLabel="Risposta breve"
    questions={questions}
    sources={sources}
    related={["/it/blog/chatbot-whatsapp-hotel-bb-case-vacanza", "/it/blog/messaggi-automatici-whatsapp-business"]}
    product="/it/centralino-ai"
    cta={{ heading: <>Le tue clienti ricevono risposta anche mentre lavori.<br /><span>Gratis, senza API di Meta.</span></>, body: "Crea l’account, collega il numero e dai all’agente il tuo listino in pochi minuti. Senza carta e senza costo a messaggio." }}
  />;
}
