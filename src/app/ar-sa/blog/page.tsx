import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { LocaleBlogIndex } from "@/components/blog/LocaleBlogIndex";

const path = "/ar-sa/blog";
const title = "مدونة واتساب للأعمال في السعودية";
const description = "أدلة عملية لاستخدام واتساب والذكاء الاصطناعي في الأعمال بالسعودية: الرد الآلي، حجز المواعيد، ووكيل صوتي يرد على مكالمات واتساب، مجانًا.";

export const metadata: Metadata = pageMetadata({ title, description, path, locale: "ar-SA" });

export default function BlogSaPage() {
  return <LocaleBlogIndex
    locale="ar-SA"
    description={description}
    heading={["مدونة", "Wapzen"]}
    intro="أدلة عملية للعيادات والمتاجر والشركات في السعودية: كيف ترد على واتساب على مدار الساعة بالذكاء الاصطناعي، وتحجز المواعيد، وترد على المكالمات، وما الذي يقوله نظام حماية البيانات الشخصية."
    postsHeading="المقالات"
    solutionsHeading="الحلول"
  />;
}
