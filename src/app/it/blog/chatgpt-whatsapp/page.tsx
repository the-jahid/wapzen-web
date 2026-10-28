import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Steps } from "@/components/marketing/MarketingPage";
import { BlogPost, InlineCta, Note } from "@/components/blog/BlogPost";

// Ricerche obiettivo: "chatgpt whatsapp numero" (37), "chatgpt whatsapp"
// (30, 3/3), "intelligenza artificiale whatsapp" (30, 3/3), "meta ai
// whatsapp" (30, 3/3), "come togliere meta ai da whatsapp" (30, 3/3),
// "chatgpt su whatsapp" (20), "come usare chatgpt su whatsapp" (20), "come
// mettere chatgpt su whatsapp" (18), autocomplete IT 2026-10-28. La
// situazione cambia ancora (ricorso di Meta, indagine UE aperta): ricontrolla
// prima di ogni modifica e aggiorna `updated`. Fonti: AGCM, TechCrunch e
// testate italiane; la pagina di OpenAI non era leggibile. Versione inglese:
// /blog/chatgpt-on-whatsapp.
const href = "/it/blog/chatgpt-whatsapp";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "it", article: { publishedTime: post.published, modifiedTime: post.updated } });

const where = [
  ["Italia", "Sì", "Di nuovo da metà luglio 2026"],
  ["Altri Paesi UE, Islanda, Liechtenstein, Norvegia", "Sì", "Dopo l’ordine della Commissione europea"],
  ["Brasile", "Sì, secondo la stampa", "Dopo un provvedimento dell’antitrust brasiliano"],
  ["Stati Uniti, Regno Unito, India e resto del mondo", "No", "Fermo dal 15 gennaio 2026"],
];

const useSteps = [
  { title: "Salva il numero", body: "Aggiungi in rubrica il numero +1 800 242 8478 (si scrive anche 1-800-CHATGPT), con il prefisso +1 degli Stati Uniti." },
  { title: "Apri la chat", body: "Su WhatsApp cerca il contatto e controlla che il profilo si chiami 1-800-ChatGPT e abbia il segno di verifica." },
  { title: "Scrivi la tua domanda", body: "Puoi mandare testo, foto e messaggi vocali, e chiedere di generare immagini. Non serve un account OpenAI." },
  { title: "Collega il tuo account (facoltativo)", body: "Se usi già ChatGPT, collega l’account dalla chat: hai limiti di utilizzo più alti e la stessa cronologia su app e WhatsApp." },
];

const faqs = [
  { q: "Qual è il numero di ChatGPT su WhatsApp?", a: "Il numero ufficiale è +1 800 242 8478, che OpenAI scrive anche 1-800-CHATGPT. Salvalo in rubrica e cerca su WhatsApp il profilo verificato 1-800-ChatGPT. Non esiste un numero italiano ufficiale: diffida dei numeri +39 che dicono di essere ChatGPT." },
  { q: "ChatGPT su WhatsApp funziona in Italia?", a: "Sì. Dopo circa sei mesi di stop, ChatGPT è tornato su WhatsApp in Italia e nel resto dello Spazio economico europeo da metà luglio 2026, a seguito dell'ordine della Commissione europea che ha imposto a Meta di riaprire WhatsApp agli assistenti AI concorrenti. Il ritorno è stato graduale." },
  { q: "ChatGPT su WhatsApp è gratis?", a: "Sì, si usa gratis e non serve un account OpenAI. Ci sono però limiti di utilizzo: collegando il tuo account ChatGPT alla chat puoi ottenere limiti più alti e ritrovare la cronologia anche nell'app." },
  { q: "Perché ChatGPT non mi risponde su WhatsApp?", a: "Controlla di aver salvato il numero corretto, +1 800 242 8478, e che il profilo sia quello verificato. La disponibilità dipende dal prefisso del tuo numero: con un numero italiano funziona, con un numero di un Paese extra UE potrebbe no. Aggiorna WhatsApp e riprova." },
  { q: "Si può togliere Meta AI da WhatsApp?", a: "Al momento in Italia non c'è un'impostazione per disattivare o rimuovere del tutto Meta AI da WhatsApp. Puoi semplicemente non usarlo, silenziare la sua chat ed eliminarne la cronologia. Meta AI non legge le tue chat private: vede solo i messaggi che mandi a lui o in cui lo menzioni." },
  { q: "Posso mettere ChatGPT sul WhatsApp della mia attività?", a: "Non il numero 1-800-ChatGPT, che è un assistente personale di OpenAI. Puoi però far rispondere ai clienti un'AI basata sui modelli GPT di OpenAI sul tuo numero: Wapzen lo fa collegando il tuo WhatsApp con un codice QR, con le informazioni della tua attività, e al momento è gratis." },
];

const sources = [
  { label: "AGCM: misure cautelari su Meta AI e WhatsApp (dic. 2025)", href: "https://en.agcm.it/en/media/press-releases/2025/12/A576" },
  { label: "TechCrunch: l’Italia ordina a Meta di sospendere il divieto (dic. 2025)", href: "https://techcrunch.com/2025/12/24/italy-tells-meta-to-suspend-its-policy-that-bans-rival-ai-chatbots-from-whatsapp/" },
  { label: "Smartworld: esenzione per i numeri italiani (gen. 2026)", href: "https://www.smartworld.it/news/whatsapp-chatgpt-meta-italia-antitrust-ai.html" },
  { label: "TuttoTech: ChatGPT torna su WhatsApp in Europa (lug. 2026)", href: "https://www.tuttotech.net/news/2026/07/15/chatgpt-torna-su-whatsapp.html" },
  { label: "l’Adige: ChatGPT di nuovo disponibile in Italia (lug. 2026)", href: "https://www.ladige.it/tecnologia/chatgpt-torna-su-whatsapp-in-italia-di-nuovo-disponibile-dopo-sei-mesi-kuh7k7fj" },
  { label: "TechCrunch: WhatsApp vieta i chatbot generalisti (ott. 2025)", href: "https://techcrunch.com/2025/10/18/whatssapp-changes-its-terms-to-bar-general-purpose-chatbots-from-its-platform/" },
];

const sections = [
  {
    id: "funziona-in-italia",
    title: "ChatGPT su WhatsApp funziona in Italia?",
    body: <>
      <p><strong>Sì, di nuovo.</strong> Il 15 gennaio 2026 ChatGPT aveva smesso di rispondere su WhatsApp nella maggior parte del mondo, per una modifica delle regole di Meta. Da <strong>metà luglio 2026</strong> è tornato in Italia e nel resto dello Spazio economico europeo, dopo che la Commissione europea ha ordinato a Meta di riaprire WhatsApp agli assistenti AI concorrenti.</p>
      <p>La disponibilità dipende dal <strong>prefisso del tuo numero</strong> WhatsApp, non da dove ti trovi:</p>
      <Comparison caption="Dove funziona ChatGPT su WhatsApp a ottobre 2026" columns={["Funziona", "Note"]} rows={where} />
    </>,
  },
  {
    id: "come-usarlo",
    title: "Come usare ChatGPT su WhatsApp: il numero ufficiale",
    body: <>
      <Steps items={useSteps} />
      <Note>Il numero ufficiale è solo uno: +1 800 242 8478. Su WhatsApp e sui social girano numeri, anche italiani, che dicono di essere ChatGPT o un’“AI gratis”: non mandare a questi contatti dati personali, codici o pagamenti.</Note>
      <p>ChatGPT vede solo i messaggi che mandi alla sua chat: non legge le tue altre conversazioni e non può scrivere ai tuoi contatti. Puoi usarlo per tradurre, riassumere un testo, scrivere un messaggio o capire una foto, come faresti nell’app.</p>
    </>,
  },
  {
    id: "cosa-e-successo",
    title: "Perché ChatGPT era sparito da WhatsApp",
    body: <>
      <p>La storia passa in buona parte dall’Italia:</p>
      <ul>
        <li><strong>Luglio 2025.</strong> L’Autorità garante della concorrenza e del mercato (AGCM) apre un’istruttoria su Meta per l’integrazione di Meta AI in WhatsApp.</li>
        <li><strong>Ottobre 2025.</strong> Meta cambia le condizioni della WhatsApp Business Solution: dal 15 gennaio 2026 gli assistenti AI generalisti come ChatGPT, Copilot e Perplexity non possono più usare WhatsApp. OpenAI annuncia che lascerà WhatsApp in quella data.</li>
        <li><strong>4 dicembre 2025.</strong> La Commissione europea apre un’indagine antitrust sulla nuova regola.</li>
        <li><strong>Dicembre 2025.</strong> Pochi giorni prima di Natale, l’AGCM ordina in via cautelare a Meta di sospendere le clausole che escludono i chatbot concorrenti, per evitare un danno “serio e difficilmente reversibile”.</li>
        <li><strong>15 gennaio 2026.</strong> Le nuove regole entrano in vigore. Sulla carta Meta esenta i numeri italiani (+39) e brasiliani, ma secondo le testate italiane che a luglio ne hanno annunciato il ritorno, anche in Italia ChatGPT su WhatsApp si era fermato.</li>
        <li><strong>Marzo 2026.</strong> Meta propone di riammettere gli assistenti concorrenti in Europa a pagamento, per ogni messaggio. Per la Commissione equivale a un divieto di fatto.</li>
        <li><strong>Giugno 2026.</strong> La Commissione impone misure cautelari: Meta deve ripristinare entro cinque giorni lavorativi l’accesso gratuito per gli assistenti AI concorrenti, alle condizioni precedenti al 15 ottobre 2025.</li>
        <li><strong>Metà luglio 2026.</strong> ChatGPT torna gradualmente su WhatsApp in tutto lo Spazio economico europeo, Italia compresa.</li>
      </ul>
      <p>Meta ha annunciato ricorso e l’indagine europea è ancora aperta, quindi la situazione può cambiare di nuovo. Aggiorneremo questa pagina quando succede.</p>
    </>,
  },
  {
    id: "meta-ai",
    title: "Meta AI su WhatsApp: cos’è e si può togliere?",
    body: <>
      <p><strong>Meta AI</strong> è l’assistente di Meta integrato in WhatsApp: è il cerchio colorato nella scheda Chat e compare anche nella barra di ricerca e nei gruppi, dove puoi chiamarlo con @Meta AI. Fa più o meno quello che fa ChatGPT, ma è di Meta ed è già dentro l’app.</p>
      <p>A ottobre 2026, in Italia <strong>non c’è un’impostazione per disattivarlo o rimuoverlo del tutto</strong>. Puoi però:</p>
      <ul>
        <li><strong>non usarlo:</strong> se non gli scrivi e non lo menzioni, non vede le tue chat;</li>
        <li><strong>silenziare la sua chat</strong> e archiviarla, come qualsiasi altra conversazione;</li>
        <li><strong>eliminare la cronologia</strong> delle conversazioni che hai avuto con lui.</li>
      </ul>
      <p>Le chat personali restano protette dalla crittografia end-to-end: Meta AI legge solo i messaggi che mandi a lui o in cui lo menzioni.</p>
    </>,
  },
  {
    id: "per-la-tua-attivita",
    title: "ChatGPT per la tua attività: un’AI sul tuo numero",
    body: <>
      <p>1-800-ChatGPT è un assistente personale: risponde a te, dal numero di OpenAI. Non risponde ai tuoi clienti e non conosce prezzi, orari e regole della tua attività. Il divieto di Meta, del resto, non ha mai riguardato i <strong>chatbot aziendali</strong> che assistono i propri clienti: quelli si sono sempre potuti usare.</p>
      <p>Se vuoi che un’AI come GPT risponda ai clienti sul <strong>tuo</strong> numero WhatsApp, ti serve un agente AI collegato al tuo account. Con Wapzen scegli il modello (GPT di OpenAI o Claude di Anthropic, entrambi inclusi), gli dai le informazioni della tua attività e colleghi il tuo WhatsApp con un codice QR.</p>
      <InlineCta title="Un’AI che risponde ai tuoi clienti" body="Crea un agente con GPT o Claude, insegnagli come funziona la tua attività e collegalo al tuo WhatsApp con un codice QR. Al momento è gratis." label="Inizia gratis" />
      <p>Funziona con WhatsApp Business o con il WhatsApp normale, senza l’API ufficiale. Trovi i passaggi nella guida al <Link href="/it/blog/chatbot-whatsapp-business">chatbot WhatsApp Business</Link>, e se vuoi che l’AI risponda anche alle chiamate c’è il <Link href="/it/centralino-ai">centralino AI</Link>.</p>
    </>,
  },
];

export default function ChatGPTWhatsAppItPage() {
  return <BlogPost
    href={href}
    heading={<>ChatGPT su WhatsApp in Italia.<br /><span>Numero e come usarlo.</span></>}
    lead="ChatGPT era sparito da WhatsApp a gennaio 2026 ed è tornato in Italia a luglio. Ecco il numero ufficiale, come usarlo, cosa è successo tra Meta, l’antitrust italiano e la Commissione europea, cosa sapere su Meta AI e come mettere un’AI sul WhatsApp della tua attività."
    summary={{
      title: "In breve",
      items: [
        <><strong>Sì, ChatGPT funziona di nuovo su WhatsApp in Italia</strong>, da metà luglio 2026.</>,
        <><strong>Il numero ufficiale è +1 800 242 8478</strong> (1-800-CHATGPT): salvalo e scrivi al profilo verificato.</>,
        <><strong>Si usa gratis</strong>, senza account OpenAI; collegando l’account hai limiti più alti.</>,
        <><strong>Meta AI</strong> in Italia non si può disattivare del tutto, ma puoi ignorarlo, silenziarlo ed eliminarne la cronologia.</>,
        <><strong>Per la tua attività</strong> serve un’AI sul tuo numero, non 1-800-ChatGPT: Wapzen lo fa con GPT o Claude, gratis per ora.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/it/blog/chatbot-whatsapp-business", "/it/blog/whatsapp-business-costo"]}
    product="/it/chatbot-whatsapp-gratis"
    cta={{ heading: <>L’AI sul WhatsApp della tua attività.<br /><span>Con GPT o Claude, gratis.</span></>, body: "Crea il tuo agente, dagli le informazioni della tua attività e collega il tuo numero WhatsApp con un codice QR." }}
  />;
}
