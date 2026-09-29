import type { Metadata } from "next";
import { BookOpen, CalendarCheck, FileText, PhoneIncoming, PhoneOutgoing, Radio } from "lucide-react";
import { pageMetadata } from "@/lib/pageMetadata";
import { Cards, Comparison, MarketingPage, Section, Steps } from "@/components/marketing/MarketingPage";

// Italia. Ricerche obiettivo: "centralino ai", "centralino virtuale ai",
// "agente vocale ai", "assistente virtuale ai (cosa fa)", "segretaria
// virtuale ai" (docs/seo-research.md). Chi cerca "centralino" pensa alla
// linea telefonica: dire chiaramente che funziona solo con le chiamate
// WhatsApp. Versione inglese: /free-ai-calling-agent.
const path = "/it/centralino-ai";
const title = "Centralino AI e Agente Vocale per WhatsApp, Gratis";
const description = "Un centralino AI che risponde ed effettua chiamate WhatsApp per la tua attività, come assistente o segretaria virtuale. Voce naturale in italiano, gratis.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "it" });

const features = [
  { icon: PhoneIncoming, title: "Segretaria virtuale AI", body: "Risponde a tutte le chiamate WhatsApp, comunica orari, servizi e prezzi e annota le richieste dei clienti." },
  { icon: PhoneOutgoing, title: "Chiamate in uscita ai contatti", body: "Chiama i nuovi contatti appena arrivano, fa le domande che scegli tu e salva le risposte nella trascrizione." },
  { icon: CalendarCheck, title: "Richieste di appuntamento", body: "Raccoglie il giorno e l'ora preferiti. Con uno strumento API prenota direttamente nel tuo gestionale." },
  { icon: Radio, title: "Campagne di chiamate", body: "Aggiungi contatti a una campagna e l'AI chiama ciascuno. Segui i risultati nelle analisi della campagna." },
  { icon: BookOpen, title: "Risposte dalla tua knowledge base", body: "Consulta prezzi, condizioni e domande frequenti durante la chiamata, invece di inventare." },
  { icon: FileText, title: "Trascrizione di ogni chiamata", body: "Ogni chiamata resta salvata con la trascrizione nella dashboard, pronta per il tuo team." },
];

const steps = [
  { title: "Crea un account gratis", body: "Senza carta di credito e senza un tuo account OpenAI o ElevenLabs." },
  { title: "Crea un agente vocale", body: "Scrivi le istruzioni e il saluto, imposta l'italiano come lingua e scegli una voce." },
  { title: "Aggiungi conoscenze e strumenti", body: "Allega una knowledge base e, se vuoi, strumenti API per verificare ordini o prenotare appuntamenti." },
  { title: "Collega il tuo WhatsApp", body: "Scansiona un codice QR per collegare il tuo numero e assegnagli l'agente vocale." },
  { title: "Rispondi e chiama", body: "L'AI risponde alle chiamate WhatsApp in arrivo. Per chiamare, usa la dashboard o crea una campagna con i tuoi contatti." },
];

const comparison = [
  ["Prezzo", "Di solito un canone o una tariffa al minuto", "Gratis per ora"],
  ["Numero", "Spesso un numero nuovo o un inoltro di chiamata", "Il tuo numero WhatsApp"],
  ["Chi può chiamare", "Chiunque abbia un telefono", "Chi usa WhatsApp"],
  ["Messaggi", "Un altro strumento", "Chatbot AI incluso"],
  ["Attivazione", "Spesso un operatore e una configurazione", "Scansionare un codice QR"],
];

const faqs = [
  { q: "Cos'è un centralino AI?", a: "È un sistema che risponde alle chiamate con l'intelligenza artificiale: accoglie chi chiama, risponde alle domande più comuni e raccoglie le richieste per il tuo team. Il centralino AI di Wapzen funziona sulle chiamate WhatsApp." },
  { q: "Risponde anche al numero fisso o al cellulare?", a: "No. Wapzen risponde ed effettua chiamate WhatsApp. Chi chiama deve usare WhatsApp, ma a te non servono una linea telefonica né un operatore." },
  { q: "Quanto costa un centralino AI?", a: "I centralini AI su linea telefonica hanno di solito un canone o una tariffa al minuto. Wapzen è gratuito per ora, agente vocale compreso, senza costi al minuto." },
  { q: "Parla bene l'italiano?", a: "Sì. Imposta l'italiano come lingua dell'agente e scegli una voce che lo parli. Puoi usare anche inglese, tedesco e decine di altre lingue." },
  { q: "Cosa fa un assistente virtuale AI?", a: "Risponde ai clienti al telefono e in chat, dà informazioni su orari, servizi e prezzi, raccoglie richieste di appuntamento e salva ogni conversazione. Con Wapzen lo fa su WhatsApp, sia in chat sia in chiamata." },
  { q: "Serve un account OpenAI o ElevenLabs?", a: "No. Riconoscimento vocale, modelli AI e voci sono già inclusi in Wapzen." },
];

export default function CentralinoAiPage() {
  return <MarketingPage
    locale="it"
    path={path}
    name="Centralino AI"
    title={title}
    description={description}
    eyebrow="Agente vocale AI"
    heading={<>Centralino AI.<br /><span>Sulle chiamate WhatsApp, gratis.</span></>}
    lead="Crea un agente vocale AI che risponde alle chiamate WhatsApp della tua attività e richiama i tuoi contatti. Parla italiano con una voce naturale, usa le informazioni della tua attività e salva la trascrizione di ogni chiamata."
    perks={["Gratis", "Voce naturale in italiano", "Nessun costo al minuto", "Il tuo numero WhatsApp"]}
    ctaLabel="Crea il mio centralino AI gratis"
    secondary={{ href: "#come-attivarlo", label: "Scopri come funziona" }}
    faq={{ heading: <>Centralino AI.<br /><span>Domande frequenti.</span></>, items: faqs }}
    cta={{ heading: <>Il tuo centralino AI.<br /><span>Sul tuo numero WhatsApp.</span></>, body: "Crea un account gratis, scegli una voce e lascia che l'AI risponda ed effettui le chiamate WhatsApp della tua attività." }}
  >
    <Section id="funzioni" heading={<>Assistente e segretaria virtuale.<br /><span>Un solo agente vocale.</span></>}>
      <Cards items={features} />
    </Section>

    <Section id="come-attivarlo" heading={<>Come attivare un centralino AI su WhatsApp.<br /><span>Cinque passaggi, senza codice.</span></>} intro="Il centralino AI di Wapzen funziona sulle chiamate WhatsApp, non sulle linee telefoniche tradizionali: non c'è una linea da attivare né niente da installare.">
      <Steps items={steps} />
    </Section>

    <Section id="confronto" heading={<>WhatsApp o linea telefonica?<br /><span>Cosa cambia.</span></>}>
      <Comparison caption="Centralino AI su linea telefonica a confronto con Wapzen su WhatsApp" columns={["Centralino AI su linea telefonica", "Wapzen su WhatsApp"]} rows={comparison} />
    </Section>
  </MarketingPage>;
}
