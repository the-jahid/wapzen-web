import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { LocaleBlogIndex } from "@/components/blog/LocaleBlogIndex";

const path = "/it/blog";
const title = "Blog WhatsApp: guide, prezzi ed esempi per la tua attività";
const description = "Guide su WhatsApp Business in italiano: quanto costa l’API in Italia, differenze con WhatsApp, chatbot, messaggi automatici da copiare e ChatGPT su WhatsApp.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "it" });

export default function BlogItPage() {
  return <LocaleBlogIndex
    locale="it"
    description={description}
    heading={["Blog", "Wapzen"]}
    intro="Guide pratiche su WhatsApp Business per le attività italiane: costi e tariffe Meta in euro, chatbot e AI, messaggi automatici da copiare e le novità che cambiano le regole."
    postsHeading="Articoli"
    solutionsHeading="Soluzioni"
  />;
}
