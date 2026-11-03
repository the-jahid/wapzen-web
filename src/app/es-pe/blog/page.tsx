import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { LocaleBlogIndex } from "@/components/blog/LocaleBlogIndex";

const path = "/es-pe/blog";
const title = "Blog de WhatsApp para negocios en Perú: guías con IA";
const description = "Guías de WhatsApp para negocios en Perú: chatbot con IA gratis para clínicas y consultorios, citas por WhatsApp, agente de voz y la Ley 29733.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "es-PE" });

export default function BlogPePage() {
  return <LocaleBlogIndex
    locale="es-PE"
    description={description}
    heading={["Blog", "Wapzen"]}
    intro="Guías prácticas de WhatsApp para negocios en Perú: cómo responder pacientes y clientes las 24 horas con IA, contestar llamadas de WhatsApp y cuidar los datos personales según la Ley 29733."
    postsHeading="Artículos"
    solutionsHeading="Soluciones"
  />;
}
