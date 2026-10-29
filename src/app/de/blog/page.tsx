import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { LocaleBlogIndex } from "@/components/blog/LocaleBlogIndex";

const path = "/de/blog";
const title = "WhatsApp-Blog: Kosten, Anbieter und KI für dein Unternehmen";
const description = "Ratgeber zu WhatsApp Business auf Deutsch: was die WhatsApp Business API in Deutschland kostet, welche Anbieter es gibt und wann sich ein KI-Assistent lohnt.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "de" });

export default function BlogDePage() {
  return <LocaleBlogIndex
    locale="de"
    description={description}
    heading={["Blog", "Wapzen"]}
    intro="Praxiswissen zu WhatsApp Business für Unternehmen in Deutschland: Metas Preise in Euro, Anbieter im Vergleich und KI-Assistenten, die Chats und Anrufe beantworten."
    postsHeading="Artikel"
    solutionsHeading="Lösungen"
  />;
}
