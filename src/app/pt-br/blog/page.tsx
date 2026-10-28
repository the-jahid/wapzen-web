import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { LocaleBlogIndex } from "@/components/blog/LocaleBlogIndex";

const path = "/pt-br/blog";
const title = "Blog de WhatsApp para empresas: guias, preços e exemplos";
const description = "Guias de WhatsApp Business para empresas brasileiras: o que é pago, preços da API em reais, robôs com IA, agendamento e 40 mensagens de saudação para copiar.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "pt-BR" });

export default function BlogBrPage() {
  return <LocaleBlogIndex
    locale="pt-BR"
    description={description}
    heading={["Blog", "Wapzen"]}
    intro="Guias práticos de WhatsApp Business para empresas brasileiras: o que é grátis e o que é pago, robôs com IA, agendamento pelo WhatsApp e mensagens prontas para copiar."
    postsHeading="Artigos"
    solutionsHeading="Soluções"
  />;
}
