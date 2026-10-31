import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { LocaleBlogIndex } from "@/components/blog/LocaleBlogIndex";

const path = "/es-co/blog";
const title = "Blog de WhatsApp para negocios en Colombia: guías con IA";
const description = "Guías de WhatsApp para negocios en Colombia: vender contraentrega, tomar pedidos con un chatbot de IA, qué pide la ley y cómo se comparan las herramientas.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "es-CO" });

export default function BlogCoPage() {
  return <LocaleBlogIndex
    locale="es-CO"
    description={description}
    heading={["Blog", "Wapzen"]}
    intro="Guías prácticas de WhatsApp para negocios en Colombia: cómo vender contraentrega, qué automatizar con un chatbot de IA y qué debe seguir en manos de tu equipo."
    postsHeading="Artículos"
    solutionsHeading="Soluciones"
  />;
}
