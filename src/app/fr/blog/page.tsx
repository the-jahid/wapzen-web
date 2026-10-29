import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { LocaleBlogIndex } from "@/components/blog/LocaleBlogIndex";

const path = "/fr/blog";
const title = "Blog WhatsApp : chatbots, prix et IA pour votre entreprise";
const description = "Des guides WhatsApp Business en français : comment fonctionne un chatbot WhatsApp, ce qu’il coûte en France et comment l’IA répond à vos clients.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "fr" });

export default function BlogFrPage() {
  return <LocaleBlogIndex
    locale="fr"
    description={description}
    heading={["Blog", "Wapzen"]}
    intro="Des guides pratiques sur WhatsApp Business pour les entreprises françaises : chatbots et IA, tarifs Meta en euros, solutions du marché et règles à respecter."
    postsHeading="Articles"
    solutionsHeading="Solutions"
  />;
}
