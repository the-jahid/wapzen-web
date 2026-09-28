import type { Metadata } from "next";
import { Briefcase, Home, Package, ShieldCheck, ShoppingBag, UserRoundX } from "lucide-react";
import { ToolPage } from "@/components/free-tools/ToolPage";
import { SendWithoutSaving } from "@/components/free-tools/SendWithoutSaving";
import { listCountries } from "@/components/free-tools/countries";

const path = "/tools/send-whatsapp-without-saving-number";
const title = "Send WhatsApp Message Without Saving Number";
const description = "Message any WhatsApp number without adding it to your contacts. Enter the number, add a message and open the chat on your phone or WhatsApp Web. Free, no sign-up.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path },
  twitter: { title, description },
};

const steps = [
  { title: "Enter the number", body: "Pick the country and type the number the way you'd dial it locally, or paste a full number starting with +. The tool fixes the format for you." },
  { title: "Add a message", body: "Optionally write what you want to say. It's typed into the chat box for you, and nothing is sent until you press send." },
  { title: "Open the chat", body: "Tap Open chat to jump into WhatsApp on your phone or desktop, or use WhatsApp Web. The number never lands in your contacts." },
];

const uses = [
  { icon: Package, title: "Couriers and deliveries", body: "Reply to a delivery driver or courier who called from a number you'll never need again." },
  { icon: ShoppingBag, title: "Marketplace sellers", body: "Message a seller or buyer from Facebook Marketplace, OLX or a classified ad without cluttering your phonebook." },
  { icon: Home, title: "Tradespeople and landlords", body: "Send photos and details to a plumber, electrician or agent you found online before deciding to hire them." },
  { icon: Briefcase, title: "Leads and customers", body: "Follow up on an enquiry, missed call or form submission straight from your laptop, before the lead goes cold." },
  { icon: UserRoundX, title: "One-off contacts", body: "Talk to a restaurant, clinic or event organiser once without keeping a number you'll have to delete later." },
  { icon: ShieldCheck, title: "Keep contacts private", body: "People you save can see your status updates and, depending on your settings, your profile photo. A chat without saving doesn't add them." },
];

const faqs = [
  { q: "Can I send a WhatsApp message without saving the number?", a: "Yes. WhatsApp's official click-to-chat feature opens a chat with any number from a link like https://wa.me/447400123456. This tool builds that link for you, in the right format, and opens it, so you never have to add the number to your contacts." },
  { q: "Does this work on iPhone, Android and computers?", a: "Yes. On a phone, Open chat launches the WhatsApp app. On a computer it opens WhatsApp Desktop if you have it, or you can use the WhatsApp Web button to chat in your browser. It works with both WhatsApp and WhatsApp Business." },
  { q: "Will the person know I didn't save their number?", a: "No. They receive a normal WhatsApp message from you. The only difference is on your side: they won't appear in your phone's contacts, and your chat list shows their number (or their WhatsApp name) instead of a saved name." },
  { q: "Why does WhatsApp say the number isn't on WhatsApp?", a: "Usually the country code is missing or a local 0 was left in. Choose the right country and the tool removes the trunk 0 and adds the code for you. If the format is right, that number simply doesn't have a WhatsApp account." },
  { q: "Is the message sent automatically?", a: "No. Your message is only typed into the chat box. You can edit it and you decide when to press send, so nothing is ever sent without you." },
  { q: "Is it safe and private?", a: "Yes. The tool runs in your browser and hands you straight to WhatsApp, so your messages stay end-to-end encrypted as usual. Numbers and messages aren't sent to or stored on our servers. Your recent numbers are kept only in this browser, and you can clear them any time." },
];

export default function SendWhatsAppWithoutSavingPage() {
  const countries = listCountries();
  return <ToolPage
    path={path}
    name="Send WhatsApp without saving number"
    description={description}
    heading={<>Send a WhatsApp message.<br /><span>Without saving the number.</span></>}
    lead="Chat with any WhatsApp number without adding it to your contacts. Enter the number, add a message if you like, and open the chat on your phone, WhatsApp Desktop or WhatsApp Web."
    perks={["Free forever", "No contact saved", "Phone, desktop and web"]}
    tool={<SendWithoutSaving countries={countries} />}
    steps={{ heading: <>How to message without saving.<br /><span>Three quick steps.</span></>, items: steps }}
    cards={{ heading: <>When it comes in handy.<br /><span>No more contact clutter.</span></>, intro: "Most numbers you message once don't belong in your phonebook. Skip the save-then-delete routine.", items: uses }}
    faq={{ heading: <>Messaging without saving.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Customers message you first?<br /><span>Let AI answer them.</span></>, body: "Wapzen gives your WhatsApp number an AI chatbot and voice agent that reply instantly, day and night, using your own business knowledge." }}
  />;
}
