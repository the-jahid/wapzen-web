import type { Metadata } from "next";
import { BookOpen, Languages, MessageSquareReply, PhoneIncoming, Smartphone, Zap } from "lucide-react";
import { pageMetadata } from "@/lib/pageMetadata";
import { Cards, Comparison, MarketingPage, Section, Steps } from "@/components/marketing/MarketingPage";

// Italia. Ricerche obiettivo: "chatbot whatsapp gratis/gratuito", "chatbot
// whatsapp business", "ai whatsapp business", "chatbot whatsapp con ia",
// "intelligenza artificiale whatsapp", "chatbot per ristoranti"
// (docs/seo-research.md). Versione inglese: /free-whatsapp-chatbot.
const path = "/it/chatbot-whatsapp-gratis";
const title = "Chatbot WhatsApp Gratis con Intelligenza Artificiale";
const description = "Crea gratis un chatbot AI per il WhatsApp della tua attività: risponde ai clienti 24 ore su 24 con le tue informazioni. Senza codice e senza API ufficiale.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "it" });

const steps = [
  { title: "Crea un account gratis", body: "Registrati su Wapzen. Non serve la carta di credito e non devi attivare l'API ufficiale di WhatsApp." },
  { title: "Crea un agente di chat", body: "Dagli un nome, scegli un modello di OpenAI (GPT) o di Anthropic (Claude) e scrivi le istruzioni: il tono, cosa può rispondere e cosa no." },
  { title: "Insegnagli la tua attività", body: "Aggiungi una knowledge base con domande frequenti, prezzi, orari e condizioni. Incolla del testo o carica file PDF e Word." },
  { title: "Collega il tuo WhatsApp", body: "Scansiona un codice QR con il WhatsApp del telefono, come quando colleghi WhatsApp Web. Funziona con WhatsApp Business o con il WhatsApp normale." },
  { title: "Provalo e attivalo", body: "Scrivi al tuo numero da un altro telefono. L'AI risponde subito e tutte le conversazioni restano salvate nella dashboard." },
];

const features = [
  { icon: MessageSquareReply, title: "Risposte automatiche 24 ore su 24", body: "Risponde a ogni messaggio in pochi secondi, anche di notte, nel weekend e nei giorni festivi." },
  { icon: BookOpen, title: "Risposte con le tue informazioni", body: "Usa i tuoi documenti, prezzi e domande frequenti, quindi le risposte parlano della tua attività e non sono generiche." },
  { icon: Zap, title: "Azioni con strumenti API", body: "Collega strumenti API per verificare un ordine, controllare la disponibilità o prenotare nel tuo gestionale." },
  { icon: Languages, title: "Risponde nella lingua del cliente", body: "Se il cliente scrive in italiano, inglese o tedesco, l'AI risponde nella stessa lingua." },
  { icon: Smartphone, title: "Sul tuo numero di sempre", body: "Collega un WhatsApp Business o personale con un codice QR. Nessun numero nuovo e nessuna API ufficiale." },
  { icon: PhoneIncoming, title: "Risponde anche alle chiamate", body: "Aggiungi un agente vocale AI che risponde ed effettua chiamate WhatsApp con una voce naturale." },
];

const comparison = [
  ["Prezzo", "Piani mensili e tariffe Meta per messaggio template", "Gratis per ora"],
  ["Attivazione", "Account Meta, numero registrato e, di solito, un fornitore", "Scansionare un codice QR"],
  ["Risposte", "Spesso menu a pulsanti; l'AI di solito si paga a parte", "AI inclusa (GPT o Claude)"],
  ["Chiamate con AI", "Rare o a pagamento", "Incluse, in entrata e in uscita"],
  ["Piattaforma ufficiale Meta", "Sì", "No: si collega come WhatsApp Web"],
];

const faqs = [
  { q: "Esiste un chatbot WhatsApp gratis?", a: "Sì. Wapzen è gratuito per ora, con tutte le funzioni: chatbot AI, agente vocale, campagne di chiamate, knowledge base e strumenti API. Non serve la carta di credito." },
  { q: "Come si usa l'intelligenza artificiale su WhatsApp per un'attività?", a: "Crea un account Wapzen, configura un agente di chat con le tue istruzioni e informazioni e collega il tuo numero scansionando un codice QR. Da quel momento l'AI risponde ai messaggi in arrivo." },
  { q: "Funziona con WhatsApp Business?", a: "Sì. Puoi collegare un numero WhatsApp Business o un WhatsApp personale. Il WhatsApp normale non ha risposte automatiche e Wapzen gli aggiunge risposte con l'AI." },
  { q: "Serve l'API ufficiale di WhatsApp?", a: "No. Wapzen collega il tuo numero con un codice QR, come WhatsApp Web, quindi niente attivazione dell'API, approvazione dei template o tariffe Meta per messaggio. Non è un prodotto ufficiale Meta: per gli invii massivi l'API ufficiale è lo strumento giusto." },
  { q: "Che AI usa? È ChatGPT?", a: "Scegli tu per ogni agente: modelli GPT di OpenAI (la famiglia di ChatGPT) o modelli Claude di Anthropic. Sono entrambi inclusi, senza bisogno di una tua chiave API." },
  { q: "Va bene per ristoranti e prenotazioni?", a: "Sì. L'AI risponde su menu, orari e disponibilità e raccoglie le richieste di prenotazione. Per prenotare direttamente nel tuo gestionale, collega uno strumento API." },
];

export default function ChatbotWhatsAppGratisItPage() {
  return <MarketingPage
    locale="it"
    path={path}
    name="Chatbot WhatsApp gratis"
    title={title}
    description={description}
    eyebrow="Chatbot AI"
    heading={<>Chatbot WhatsApp con AI.<br /><span>Gratis e senza API.</span></>}
    lead="Wapzen mette un'intelligenza artificiale a rispondere al WhatsApp della tua attività. Risponde a ogni cliente con le tue informazioni, 24 ore su 24, e funziona sul tuo numero di sempre: basta scansionare un codice QR. Senza programmare e senza API ufficiale."
    perks={["Gratis", "Senza codice", "Senza API ufficiale", "WhatsApp Business o personale"]}
    ctaLabel="Crea il mio chatbot gratis"
    secondary={{ href: "#come-creare", label: "Scopri come si crea" }}
    faq={{ heading: <>Chatbot WhatsApp.<br /><span>Domande frequenti.</span></>, items: faqs }}
    cta={{ heading: <>Il tuo chatbot WhatsApp con AI.<br /><span>Gratis, da oggi.</span></>, body: "Crea il tuo account, insegna all'AI come funziona la tua attività e collega il tuo numero con un codice QR." }}
  >
    <Section id="come-creare" heading={<>Come creare un chatbot WhatsApp gratis.<br /><span>Cinque passaggi, senza codice.</span></>}>
      <Steps items={steps} />
    </Section>

    <Section id="funzioni" heading={<>Cosa fa il tuo chatbot.<br /><span>Tutto incluso.</span></>} intro="Il piano gratuito è il prodotto completo. Tutte queste funzioni sono attive sul tuo numero WhatsApp fin dal primo giorno.">
      <Cards items={features} />
    </Section>

    <Section id="confronto" heading={<>API ufficiale o Wapzen?<br /><span>Confronta prima di scegliere.</span></>}>
      <Comparison caption="Piattaforme con l'API ufficiale di WhatsApp a confronto con Wapzen" columns={["Piattaforme con API ufficiale", "Wapzen"]} rows={comparison} />
    </Section>
  </MarketingPage>;
}
