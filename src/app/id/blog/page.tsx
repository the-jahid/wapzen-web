import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { LocaleBlogIndex } from "@/components/blog/LocaleBlogIndex";

const path = "/id/blog";
const title = "Blog WhatsApp untuk Bisnis di Indonesia";
const description = "Panduan WhatsApp dan AI untuk bisnis di Indonesia: chatbot gratis untuk sekolah dan travel umroh, auto reply 24 jam, dan agen suara untuk telepon WhatsApp.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "id" });

export default function BlogIdPage() {
  return <LocaleBlogIndex
    locale="id"
    description={description}
    heading={["Blog", "Wapzen"]}
    intro="Panduan praktis untuk sekolah, travel umroh, dan bisnis di Indonesia: cara membalas WhatsApp 24 jam dengan AI, menjawab telepon WhatsApp, dan menjaga data pribadi sesuai UU PDP."
    postsHeading="Artikel"
    solutionsHeading="Solusi"
  />;
}
