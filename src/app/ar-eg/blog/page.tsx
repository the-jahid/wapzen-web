import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { LocaleBlogIndex } from "@/components/blog/LocaleBlogIndex";

const path = "/ar-eg/blog";
const title = "مدونة واتساب للأعمال في مصر";
const description = "أدلة عملية لاستخدام واتساب والذكاء الاصطناعي في الأعمال بمصر: شات بوت يرد على العملاء، يجمع بيانات المهتمين، ووكيل صوتي لمكالمات واتساب، مجانًا.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "ar-EG" });

export default function BlogEgPage() {
  return <LocaleBlogIndex
    locale="ar-EG"
    description={description}
    heading={["مدونة", "Wapzen"]}
    intro="أدلة عملية للشركات في مصر: كيف ترد على كل رسالة واتساب في ثوانٍ بالذكاء الاصطناعي، وتفرز العملاء الجادين، وترد على المكالمات، وما الذي يقوله قانون حماية البيانات الشخصية."
    postsHeading="المقالات"
    solutionsHeading="الحلول"
  />;
}
