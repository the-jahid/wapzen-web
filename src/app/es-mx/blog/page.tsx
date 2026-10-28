import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { LocaleBlogIndex } from "@/components/blog/LocaleBlogIndex";

const path = "/es-mx/blog";
const title = "Blog de WhatsApp para negocios en México: guías y ejemplos";
const description = "Guías de WhatsApp Business para negocios en México: precios de la API en dólares y pesos, chatbots con IA, cómo vender, agendar citas y 40 mensajes automáticos.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "es-MX" });

export default function BlogMxPage() {
  return <LocaleBlogIndex
    locale="es-MX"
    description={description}
    heading={["Blog", "Wapzen"]}
    intro="Guías prácticas de WhatsApp Business para negocios en México: cuánto cuesta, cómo vender y agendar citas por WhatsApp, chatbots con IA y mensajes listos para copiar."
    postsHeading="Artículos"
    solutionsHeading="Soluciones"
  />;
}
