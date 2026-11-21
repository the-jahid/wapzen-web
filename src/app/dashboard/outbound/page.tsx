import { redirect } from "next/navigation";

// Voice pages moved under /dashboard/voice; old links still land.
export default function Page() {
  redirect("/dashboard/voice/outbound");
}
