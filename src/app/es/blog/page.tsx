import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { LocaleBlogIndex } from "@/components/blog/LocaleBlogIndex";

const path = "/es/blog";
const title = "Blog de WhatsApp: IA, precios y atención al cliente para tu negocio";
const description = "Guías en español de España: cuánto cuesta una recepcionista virtual con IA, cómo atender llamadas y WhatsApp las 24 horas y qué opción conviene a tu negocio.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "es" });

export default function BlogEsPage() {
  return <LocaleBlogIndex
    locale="es"
    description={description}
    heading={["Blog", "Wapzen"]}
    intro="Guías prácticas para negocios en España: atención telefónica y por WhatsApp con IA, precios reales en euros y cómo elegir sin pagar de más."
    postsHeading="Artículos"
    solutionsHeading="Soluciones"
  />;
}
