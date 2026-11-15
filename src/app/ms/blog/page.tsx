import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { LocaleBlogIndex } from "@/components/blog/LocaleBlogIndex";

const path = "/ms/blog";
const title = "Blog WhatsApp untuk perniagaan di Malaysia";
const description = "Panduan WhatsApp dan AI untuk peniaga dan PKS di Malaysia: cara buat auto reply WhatsApp Business, contoh mesej dalam Bahasa Melayu dan bot AI yang membalas sendiri.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "ms" });

export default function BlogMsPage() {
  return <LocaleBlogIndex
    locale="ms"
    description={description}
    heading={["Wapzen", "Blog"]}
    intro="Panduan praktikal untuk peniaga, kedai dan PKS di Malaysia: cara membalas mesej WhatsApp dengan automatik, contoh mesej yang boleh disalin dan cara AI menjawab pelanggan 24 jam."
    postsHeading="Artikel"
    solutionsHeading="Penyelesaian"
  />;
}
