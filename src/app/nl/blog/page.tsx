import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { LocaleBlogIndex } from "@/components/blog/LocaleBlogIndex";

const path = "/nl/blog";
const title = "WhatsApp-blog: kosten, aanbieders en AI voor je bedrijf";
const description = "Artikelen over WhatsApp Zakelijk in het Nederlands: wat de app en de API kosten, de tarieven van Meta voor Nederland en wanneer een AI-assistent loont.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "nl" });

export default function BlogNlPage() {
  return <LocaleBlogIndex
    locale="nl"
    description={description}
    heading={["Blog", "Wapzen"]}
    intro="Praktische uitleg over WhatsApp Zakelijk voor Nederlandse bedrijven: kosten en tarieven van Meta in euro’s, aanbieders en AI die je chats en gesprekken beantwoordt."
    postsHeading="Artikelen"
    solutionsHeading="Oplossingen"
  />;
}
