import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { LocaleBlogIndex } from "@/components/blog/LocaleBlogIndex";

const path = "/fi/blog";
const title = "WhatsApp-blogi suomalaisille yrityksille";
const description = "WhatsApp- ja tekoälyoppaat suomalaisille yrityksille: ilmainen WhatsApp-chatbot, WhatsApp Businessin hinnat Suomessa ja automaattiset vastaukset malleineen.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "fi" });

export default function BlogFiPage() {
  return <LocaleBlogIndex
    locale="fi"
    description={description}
    heading={["Wapzen", "Blogi"]}
    intro="Käytännön oppaita yrittäjille ja pienyrityksille Suomessa: miten vastaat WhatsApp-viesteihin tekoälyllä kellon ympäri, mitä WhatsApp Business maksaa ja miten automaattiset vastaukset otetaan käyttöön."
    postsHeading="Artikkelit"
    solutionsHeading="Ratkaisut"
  />;
}
