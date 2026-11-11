import PhoneNumbersPage from "@/components/phone-numbers/PhoneNumbersPage";

// One phone number on its own page, the way chat agents and conversation
// threads open. The list page links here when a number is clicked.
export default async function Page({ params }: { params: Promise<{ phoneNumberId: string }> }) {
  const { phoneNumberId } = await params;
  return <PhoneNumbersPage phoneNumberId={phoneNumberId} />;
}
