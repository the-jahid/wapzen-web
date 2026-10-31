import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { LocaleBlogIndex } from "@/components/blog/LocaleBlogIndex";

const path = "/es-cl/blog";
const title = "Blog de WhatsApp para negocios en Chile: guías con IA";
const description = "Guías de WhatsApp para negocios en Chile: atender pacientes y pedir hora con un chatbot de IA, cómo convive con tu software y qué cambia con la Ley 21.719.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "es-CL" });

export default function BlogClPage() {
  return <LocaleBlogIndex
    locale="es-CL"
    description={description}
    heading={["Blog", "Wapzen"]}
    intro="Guías prácticas de WhatsApp para negocios en Chile: cómo responder fuera de horario con un chatbot de IA, qué datos no deben pasar por el chat y cómo convive con tu software de agenda."
    postsHeading="Artículos"
    solutionsHeading="Soluciones"
  />;
}
