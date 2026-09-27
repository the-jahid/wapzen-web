import type { Metadata } from "next";
import { Earth, Eraser, Flag, Plus, Smartphone, Users } from "lucide-react";
import { ToolPage } from "@/components/free-tools/ToolPage";
import { CountryCodeFinder } from "@/components/free-tools/CountryCodeFinder";
import { listCountries } from "@/components/free-tools/countries";

const path = "/tools/whatsapp-country-code-finder";
const title = "WhatsApp Country Code Finder & Number Formatter";
const description = "Find the WhatsApp country code for any country and convert a local phone number to the international format WhatsApp needs. Free, with a full country code list.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path },
  twitter: { title, description },
};

const steps = [
  { title: "Choose the country", body: "Pick the country from the list or search the table below by name or code. Its country code, like +44 or +880, appears straight away." },
  { title: "Enter the local number", body: "Type the number the way it's dialled locally, leading 0 and all. You can also paste a full number starting with +." },
  { title: "Copy the WhatsApp format", body: "Copy the international number for your contacts, or the digits-only version for wa.me links, then open the chat in one click." },
];

// Facts checked against libphonenumber's metadata and national numbering plans.
const tips = [
  { icon: Plus, title: "Start with + and the code", body: "WhatsApp needs every contact in international format: a +, the country code, then the number, e.g. +44 7400 123456." },
  { icon: Eraser, title: "Drop the leading 0", body: "Most countries dial a trunk prefix (usually 0) inside the country. Leave it out after the country code: UK 07400 123456 becomes +44 7400 123456." },
  { icon: Users, title: "Some countries share a code", body: "+1 covers the US, Canada and many Caribbean countries, and +7 covers Russia and Kazakhstan. The area code tells them apart." },
  { icon: Smartphone, title: "Argentina adds a 9", body: "Argentine mobiles need a 9 after +54 and drop the local 15, e.g. 011 15-2345-6789 becomes +54 9 11 2345 6789." },
  { icon: Flag, title: "Italy keeps its 0", body: "Italian landlines keep their leading 0 after +39 (e.g. +39 06 1234 5678). Italian mobiles start with 3 and have no 0 to drop." },
  { icon: Earth, title: "Mexico dropped the 1", body: "Mexican mobiles no longer need a 1 after +52. Use +52 followed by the 10-digit number, e.g. +52 222 123 4567." },
];

const faqs = [
  { q: "What is the WhatsApp country code?", a: "WhatsApp doesn't have codes of its own. It uses the standard international calling code of the country the number belongs to, such as +1 for the United States, +44 for the United Kingdom, +91 for India or +880 for Bangladesh. Every WhatsApp number must be saved with its country code." },
  { q: "How do I add an international number on WhatsApp?", a: "Save the number in your phone's contacts in international format: +, the country code, then the number without its leading 0. For example, a UK number 07400 123456 is saved as +44 7400 123456. WhatsApp then finds the contact automatically." },
  { q: "Why does WhatsApp say a number isn't on WhatsApp?", a: "Usually the number is saved without its country code or still has the local 0 after the code. Convert it with the tool above and update the contact. If the format is right, the person may not have a WhatsApp account on that number." },
  { q: "Which countries use the +1 country code?", a: "+1 is shared by the United States, Canada and many Caribbean countries and territories, including Jamaica, the Bahamas, Barbados, Trinidad and Tobago, and Puerto Rico. The three-digit area code after the +1 identifies the place. Search +1 in the table above to see them all." },
  { q: "Do I include the + in a wa.me link?", a: "No. wa.me links use digits only: the country code and number with no +, spaces, dashes or leading 0, e.g. https://wa.me/447400123456. The tool gives you this version to copy." },
  { q: "Is this country code finder free?", a: "Yes, it's free with no sign-up. Numbers are converted in your browser and aren't sent to or stored on our servers." },
];

export default function WhatsAppCountryCodeFinderPage() {
  const countries = listCountries();
  return <ToolPage
    path={path}
    name="WhatsApp country code finder"
    description={description}
    heading={<>WhatsApp country code finder.<br /><span>Every number, the right format.</span></>}
    lead="Look up the country code for any country and turn a local phone number into the international format WhatsApp needs, ready to save, share or open as a chat."
    perks={[`${countries.length} countries and territories`, "Converts local numbers", "No sign-up"]}
    tool={<CountryCodeFinder countries={countries} />}
    steps={{ heading: <>How to find a WhatsApp country code.<br /><span>Three quick steps.</span></>, items: steps }}
    cards={{ heading: <>Country code tips.<br /><span>Avoid the common mistakes.</span></>, intro: "Most “not on WhatsApp” problems come down to how the number is written. These rules cover the usual trip-ups.", items: tips }}
    faq={{ heading: <>WhatsApp country codes.<br /><span>Your questions, answered.</span></>, items: faqs }}
    cta={{ heading: <>Customers from every country.<br /><span>Answered in their language.</span></>, body: "Wapzen's AI chatbot replies to WhatsApp messages in the language each customer writes in, and its voice agent answers calls in dozens of languages, day and night." }}
  />;
}
