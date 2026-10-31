import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { LocaleBlogIndex } from "@/components/blog/LocaleBlogIndex";

const path = "/es/blog";
const title = "Blog de WhatsApp para negocios en España: guías y ejemplos";
const description = "Guías de WhatsApp para negocios en España: chatbots con IA para centros de uñas y peluquerías, citas por WhatsApp y ejemplos de conversaciones.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "es" });

export default function BlogEsPage() {
  return <LocaleBlogIndex
    locale="es"
    description={description}
    heading={["Blog", "Wapzen"]}
    intro="Guías prácticas de WhatsApp para negocios en España: chatbots con IA, citas por WhatsApp y ejemplos de conversaciones por sector."
    postsHeading="Artículos"
    solutionsHeading="Soluciones"
  />;
}
