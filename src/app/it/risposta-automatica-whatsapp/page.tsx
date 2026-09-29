import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { Comparison, MarketingPage, Samples, Section, Steps } from "@/components/marketing/MarketingPage";

// Italia. Ricerche obiettivo: "risposta automatica whatsapp", "messaggio
// automatico whatsapp (business)", "... non business", "... solo per alcuni
// contatti", "... non funziona", "automazione messaggi whatsapp"
// (docs/seo-research.md). Versione inglese: /whatsapp-auto-reply.
const path = "/it/risposta-automatica-whatsapp";
const title = "Risposta Automatica WhatsApp: Guida ed Esempi";
const description = "Come impostare la risposta automatica su WhatsApp Business e normale, con esempi di messaggi da copiare e un'AI gratuita che risponde davvero ai clienti.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "it" });

const businessSteps = [
  { title: "Apri gli Strumenti di lavoro", body: "In WhatsApp Business, tocca Impostazioni (iPhone) o Altre opzioni (Android) e poi Strumenti di lavoro." },
  { title: "Scegli assenza o benvenuto", body: "Il messaggio di assenza risponde quando non sei disponibile. Quello di benvenuto accoglie chi ti scrive per la prima volta o dopo 14 giorni di inattività." },
  { title: "Scrivi il messaggio", body: "Attivalo e modifica il testo. Gli esempi più in basso sono un buon punto di partenza." },
  { title: "Imposta orari e destinatari", body: "Invialo sempre, con orari personalizzati o fuori dall'orario di lavoro, scegli chi lo riceve e tocca Salva." },
];

const comparison = [
  ["Cosa invia", "Lo stesso testo fisso a tutti", "Una risposta vera a ogni messaggio"],
  ["Risponde alle domande", "No", "Sì, con la tua knowledge base"],
  ["WhatsApp normale", "No, solo WhatsApp Business", "Sì, normale o Business"],
  ["Quando risponde", "Fuori orario o al primo messaggio", "A ogni messaggio, 24 ore su 24"],
  ["Costo", "Gratis", "Gratis per ora"],
];

const samples = [
  { title: "Fuori orario", text: "Ciao, grazie per il messaggio! In questo momento siamo chiusi. Siamo aperti dal lunedì al sabato, dalle 9:00 alle 19:00, e ti risponderemo appena possibile." },
  { title: "Benvenuto", text: "Ciao e benvenuto/a da [Nome attività]! Come possiamo aiutarti? Chiedici pure di prodotti, prezzi o orari." },
  { title: "Occupato", text: "Grazie per averci scritto! Sono con un cliente in questo momento e ti rispondo entro un'ora." },
  { title: "Ferie", text: "Ciao! Siamo in ferie dal [data] al [data]. Risponderemo a tutti i messaggi al nostro rientro. Grazie per la pazienza!" },
  { title: "Weekend", text: "Grazie per il messaggio! Il nostro team è in pausa per il weekend e ti risponderà lunedì mattina." },
  { title: "Richiesta ordine", text: "Grazie per aver contattato [Nome attività]! Per verificare il tuo ordine, inviaci il numero d'ordine e ti rispondiamo a breve." },
  { title: "Prenotazione", text: "Ciao! Grazie per l'interesse. Indicaci il giorno e l'orario che preferisci e ti confermiamo la prenotazione il prima possibile." },
  { title: "Chiamata persa", text: "Scusa, non siamo riusciti a rispondere alla tua chiamata! Come possiamo aiutarti? Scrivici qui e ti rispondiamo subito." },
];

const faqs = [
  { q: "Come si imposta la risposta automatica su WhatsApp Business?", a: "Tocca Impostazioni (iPhone) o Altre opzioni (Android), apri Strumenti di lavoro e scegli Messaggio di assenza o Messaggio di benvenuto. Attivalo, scrivi il testo, imposta orari e destinatari e tocca Salva." },
  { q: "Si può avere la risposta automatica su WhatsApp normale?", a: "Il WhatsApp normale non ha questa funzione. Puoi passare il numero a WhatsApp Business, che è gratuito, oppure collegarlo a Wapzen per avere risposte con l'AI senza cambiare app." },
  { q: "Si può inviare la risposta automatica solo ad alcuni contatti?", a: "Sì. In WhatsApp Business puoi scegliere i destinatari del messaggio di assenza: tutti, solo chi non è in rubrica, tutti tranne alcuni contatti oppure solo alcuni contatti." },
  { q: "Perché la risposta automatica di WhatsApp Business non funziona?", a: "Controlla che il messaggio sia attivo e che orari e destinatari siano impostati correttamente. I messaggi di assenza partono solo quando il telefono è connesso a internet. Con Wapzen le risposte partono dal cloud." },
  { q: "Esiste una risposta automatica con AI gratis?", a: "Sì. Wapzen è gratuito per ora, senza carta di credito e senza l'API ufficiale di WhatsApp. L'AI legge ogni messaggio e risponde con le informazioni della tua attività." },
  { q: "Devo tenere WhatsApp Web aperto sul computer?", a: "No. Una volta collegato il numero, Wapzen risponde dal cloud, senza schede aperte né computer acceso." },
];

export default function RispostaAutomaticaItPage() {
  return <MarketingPage
    locale="it"
    path={path}
    name="Risposta automatica WhatsApp"
    title={title}
    description={description}
    eyebrow="Risposta automatica"
    heading={<>Risposta automatica su WhatsApp.<br /><span>Guida, esempi e AI.</span></>}
    lead="Tutto sulla risposta automatica di WhatsApp: come attivarla su WhatsApp Business, cosa fare con il WhatsApp normale, esempi di messaggi da copiare e un'AI gratuita che risponde davvero a ogni cliente."
    perks={["Esempi da copiare", "Business e normale", "Risposte AI gratis"]}
    ctaLabel="Attiva le risposte AI gratis"
    secondary={{ href: "#esempi", label: "Vai agli esempi" }}
    faq={{ heading: <>Risposta automatica.<br /><span>Domande frequenti.</span></>, items: faqs }}
    cta={{ heading: <>Risposte che risolvono.<br /><span>Non solo “siamo assenti”.</span></>, body: "Collega il tuo WhatsApp a Wapzen e lascia che l'AI risponda davvero a ogni messaggio, giorno e notte. Gratis e senza carta di credito." }}
  >
    <Section id="whatsapp-business" heading={<>Come impostare la risposta automatica su WhatsApp Business.<br /><span>Integrata, gratis, a testo fisso.</span></>} intro="WhatsApp Business include due messaggi automatici. Inviano sempre lo stesso testo, che va bene per avvisare che non sei disponibile.">
      <Steps items={businessSteps} />
    </Section>

    <Section id="whatsapp-normale" heading={<>Risposta automatica su WhatsApp normale.<br /><span>Non c’è, ma c’è una soluzione.</span></>} intro="Il WhatsApp normale non ha la risposta automatica. Puoi passare il numero a WhatsApp Business, che è gratuito e può mantenere la cronologia delle chat, oppure collegarlo a Wapzen, che aggiunge risposte con l'AI senza cambiare app.">
      <Comparison caption="Messaggio di assenza a confronto con le risposte AI di Wapzen" columns={["Messaggio di assenza", "Risposte AI di Wapzen"]} rows={comparison} />
    </Section>

    <Section id="esempi" heading={<>Esempi di messaggi automatici.<br /><span>Copia e incolla.</span></>} intro="Sostituisci il testo tra [parentesi quadre] con i tuoi dati. Funzionano come messaggio di assenza o di benvenuto, oppure come esempio nelle istruzioni del tuo agente AI.">
      <Samples items={samples} locale="it" />
    </Section>
  </MarketingPage>;
}
