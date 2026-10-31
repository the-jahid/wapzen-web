import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { LocaleBlogIndex } from "@/components/blog/LocaleBlogIndex";

const path = "/de/blog";
const title = "WhatsApp-Blog für Unternehmen in Deutschland";
const description = "Ratgeber zu WhatsApp KI-Chatbots für Unternehmen in Deutschland: Handwerk, Autohäuser, Kfz-Werkstätten, Solarfirmen und Wärmepumpen-Anbieter.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "de" });

export default function BlogDePage() {
  return <LocaleBlogIndex
    locale="de"
    description={description}
    heading={["Blog", "Wapzen"]}
    intro="Ratgeber zu WhatsApp KI-Chatbots für Unternehmen in Deutschland, nach Branche."
    postsHeading="Artikel"
    solutionsHeading="Lösungen"
  />;
}
