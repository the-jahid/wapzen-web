import type { Metadata } from "next";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { BlogPost, Choose, InlineCta, Note } from "@/components/blog/BlogPost";

// Zoektermen: "whatsapp business kosten" (30, 3/3), "whatsapp business api
// kosten" (28), "whatsapp zakelijk kosten" (24), "moet je betalen voor whatsapp
// business" (10), "wat kost whatsapp business" (10), autocomplete NL 2026-10-30
// (docs/seo-blog-europe-research.mjs nl). Tarieven: de EUR-prijslijst van Meta
// voor Nederland vanaf 1 oktober 2026 (FlowCall en go4whatsup komen overeen);
// prijzen van aanbieders van hun eigen prijspagina's. Meta past de tarieven elk
// kwartaal aan (1 jan/apr/jul/okt): controleer tabellen en voorbeelden en werk
// `updated` bij. Engelse versie: /blog/whatsapp-business-api-pricing.
const href = "/nl/blog/whatsapp-zakelijk-kosten";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "nl", article: { publishedTime: post.published, modifiedTime: post.updated } });

const overview = [
  ["Wat het is", "De app met de „B” voor je telefoon", "De koppeling voor software, via Meta of een aanbieder"],
  ["Kosten bij Meta", "Geen", "Per afgeleverd bericht, afhankelijk van categorie en land"],
  ["Kosten bij de aanbieder", "Geen", "Meestal een maandbedrag, vaak per gebruiker"],
  ["Wie antwoordt", "Jij, met de hand", "Software, een chatbot of een team"],
  ["Past bij", "Kleine bedrijven", "Nieuwsbrieven, grote teams, koppelingen"],
];

const categories = [
  ["Wat het is", "Aanbiedingen, acties, nieuwsbrieven", "Order- en verzendbevestigingen, afspraakherinneringen", "Inlogcodes (OTP)", "Vrije antwoorden aan een klant"],
  ["Sjabloon nodig", "Ja", "Ja", "Ja", "Nee"],
  ["Wanneer toegestaan", "Altijd, met toestemming (opt-in)", "Altijd, met toestemming (opt-in)", "Altijd", "Alleen binnen 24 uur na het laatste bericht van de klant"],
  ["Je betaalt", "Elk afgeleverd bericht", "Elk afgeleverd bericht", "Elk afgeleverd bericht", "Vanaf het 1.001e per maand per nummer"],
];

const rates = [
  ["Marketing", "€ 0,1323"],
  ["Utility", "€ 0,0414"],
  ["Authenticatie", "€ 0,0414"],
  ["Service", "De eerste 1.000 per maand per nummer gratis, daarna € 0,0414"],
];

const europe = [
  ["Nederland", "€ 0,1323", "€ 0,0414"],
  ["Duitsland", "€ 0,1131", "€ 0,0456"],
  ["Frankrijk", "€ 0,0712", "€ 0,0248"],
  ["Italië", "€ 0,0658", "€ 0,0248"],
  ["Spanje", "€ 0,0585", "€ 0,0166"],
];

const providers = [
  ["Wat het is", "Alleen API-toegang, zonder inbox in het instaptarief", "Gedeelde inbox voor WhatsApp, e-mail en meer, op de API", "AI-agent op je bestaande nummer, zonder API"],
  ["Per maand (excl. btw)", "€ 49, € 99 of € 500 per nummer", "Boost: € 299 bij jaarlijkse of € 349 bij maandelijkse betaling, 10 gebruikers", "Gratis starten"],
  ["Kosten van Meta", "Extra, per bericht", "Extra, per bericht", "Geen: de antwoorden gaan niet via de API"],
  ["AI-antwoorden", "Niet inbegrepen, eigen agents te koppelen", "AI-agent; gesprekken met AI € 0,25 tot € 0,30 per stuk", "Inbegrepen, voor chats en WhatsApp-gesprekken"],
  ["Nieuwsbrieven", "Ja", "Ja", "Nee"],
];

const faqs = [
  { q: "Moet je betalen voor WhatsApp Business?", a: "Nee. De app WhatsApp Business, die veel mensen WhatsApp Zakelijk noemen, is gratis: downloaden, berichten sturen en bellen kost niets. Je betaalt alleen voor de WhatsApp Business API, de koppeling voor software. Meta rekent daar per afgeleverd bericht, en meestal komt er een maandbedrag van een aanbieder bij." },
  { q: "Wat kost een WhatsApp-bericht via de API in Nederland?", a: "Sinds 1 oktober 2026 rekent Meta voor Nederlandse nummers € 0,1323 per marketingbericht en € 0,0414 per utility- of authenticatiebericht, exclusief btw en de kosten van je aanbieder. Antwoorden aan klanten zijn gratis tot 1.000 per maand per nummer; daarna kosten ze ook € 0,0414 per stuk." },
  { q: "Waarom is WhatsApp-marketing in Nederland zo duur?", a: "Meta bepaalt de prijs per land, en Nederland is voor marketing een van de duurste markten van Europa: € 0,1323 per bericht, meer dan twee keer zoveel als in Spanje (€ 0,0585). Je betaalt het tarief van het land van de ontvanger: een bericht naar een +31-nummer kost het Nederlandse tarief, waar je bedrijf ook zit." },
  { q: "Betaal je voor berichten die klanten jou sturen?", a: "Nee. Meta rekent niets voor inkomende berichten. Sommige aanbieders tellen in hun abonnement wel gesprekken in beide richtingen, dus kijk in de prijslijst van je aanbieder." },
  { q: "Wat kost een WhatsApp-aanbieder zoals Trengo per maand?", a: "Trengo Boost kost € 299 per maand bij jaarlijkse betaling of € 349 bij maandelijkse betaling, voor 10 gebruikers; Pro kost € 499 of € 599. 360dialog begint bij € 49 per nummer per maand, zonder inbox. De kosten van Meta per bericht komen er altijd bij." },
  { q: "Is er een alternatief zonder API-kosten dat met AI antwoordt?", a: "Ja. Wapzen koppelt je bestaande WhatsApp-nummer met een QR-code als gekoppeld apparaat, net als WhatsApp Web, en laat een AI je chats en WhatsApp-gesprekken beantwoorden, zonder kosten van Meta per bericht. Je kunt gratis starten. Nieuwsbrieven verstuurt Wapzen niet: daarvoor blijft de officiële API het juiste gereedschap." },
];

const sources = [
  { label: "Meta: prijzen van het WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "EUR-prijslijst vanaf 1 oktober 2026: FlowCall", href: "https://www.flowcall.co/blog/whatsapp-business-api-pricing" },
  { label: "Tarieven voor Nederland: go4whatsup", href: "https://www.go4whatsup.com/netherlands/whatsapp-business-api-pricing/" },
  { label: "360dialog: prijzen", href: "https://360dialog.com/pricing" },
  { label: "Trengo: prijzen", href: "https://trengo.com/nl/prijzen" },
  { label: "WhatsApp Business Data Processing Terms", href: "https://www.whatsapp.com/legal/business-data-processing-terms" },
  { label: "Cookiebot: artikel 50 van de AI Act vanaf augustus 2026", href: "https://www.cookiebot.com/en/eu-ai-act-article-50-transparency-compliance/" },
  { label: "GadgetScout: Meta One (september 2026)", href: "https://www.gadgetscout.co.uk/articles/meta-one-puts-paid-ai-features-inside-facebook-and-whatsapp.html" },
];

const sections = [
  {
    id: "kort",
    title: "Kost WhatsApp Business geld? Het korte antwoord",
    body: <>
      <p>Bij de vraag wat WhatsApp Zakelijk kost, gaat het eigenlijk om twee producten. De <strong>app WhatsApp Business</strong>, die met de „B” in het icoon, is <strong>gratis</strong>: je downloadt hem, registreert je nummer en appt met klanten zonder te betalen. De <strong>WhatsApp Business API</strong>, die Meta nu het WhatsApp Business Platform noemt, kost wel geld: Meta rekent voor elk bericht dat je bedrijf verstuurt, en bijna altijd betaal je ook een aanbieder.</p>
      <Comparison caption="De WhatsApp Business-app en de WhatsApp Business API vergeleken op kosten" columns={["WhatsApp Business-app", "WhatsApp Business API"]} rows={overview} />
      <p>De API heb je vooral nodig voor nieuwsbrieven aan duizenden contacten, voor grote teams met één gedeelde inbox en voor koppelingen met je webshop of CRM. Veel kleine bedrijven redden het prima met de gratis app, en zoeken vooral een manier om sneller te antwoorden.</p>
    </>,
  },
  {
    id: "app",
    title: "De WhatsApp Business-app: wat gratis is",
    body: <>
      <p>Met de gratis app heb je alles om klanten met de hand te helpen en te verkopen:</p>
      <ul>
        <li>een <strong>bedrijfsprofiel</strong> met adres, openingstijden, website en e-mail;</li>
        <li>een <strong>catalogus</strong> met producten of diensten, foto’s en prijzen;</li>
        <li><strong>begroetings- en afwezigheidsberichten</strong> en <strong>snelle antwoorden</strong>;</li>
        <li><strong>labels</strong> om chats te ordenen (nieuwe aanvraag, betaald, terugbellen);</li>
        <li><strong>verzendlijsten</strong> tot 256 contacten, die alleen aankomen bij mensen die jouw nummer hebben opgeslagen.</li>
      </ul>
      <p>Berichten en gesprekken kosten niets. Sinds september 2026 biedt Meta ook het <strong>optionele abonnement Meta One</strong>, onder meer met een verificatievinkje en meer antwoorden van de Meta Business Agent. Prijs en beschikbaarheid verschillen per land; kijk daarvoor in de app. Nodig is het niet.</p>
      <p>De grens van de app is niet de prijs, maar je tijd: elk antwoord typt iemand zelf, en een afwezigheidsbericht is een vaste tekst die geen vragen beantwoordt.</p>
    </>,
  },
  {
    id: "prijsmodel",
    title: "Zo werken de prijzen van de WhatsApp Business API",
    body: <>
      <p>Sinds 1 juli 2025 rekent Meta de API <strong>per afgeleverd bericht</strong>, niet meer per gesprek. De prijs hangt af van twee dingen: de <strong>categorie</strong> van het bericht en het <strong>landnummer van de ontvanger</strong>. Een bericht naar een Nederlands nummer (+31) kost het Nederlandse tarief, ook als je bedrijf in België zit. Berichten die klanten jou sturen zijn gratis.</p>
      <Comparison caption="De vier berichtcategorieën van de WhatsApp Business API" columns={["Marketing", "Utility", "Authenticatie", "Service"]} rows={categories} />
      <p>Voor utility- en authenticatieberichten gelden <strong>volumekortingen</strong>: boven bepaalde maandelijkse aantallen per land en categorie daalt het tarief. Voor marketing en service is er geen staffel.</p>
    </>,
  },
  {
    id: "tarieven",
    title: "De tarieven van Meta voor Nederland in 2026",
    body: <>
      <p>Dit zijn de tarieven uit de euro-prijslijst van Meta voor Nederlandse nummers, geldig sinds <strong>1 oktober 2026</strong>, per afgeleverd bericht, vóór volumekortingen, btw en de kosten van je aanbieder:</p>
      <Comparison caption="Tarieven van Meta per bericht naar Nederlandse nummers vanaf 1 oktober 2026" columns={["Prijs per bericht"]} rows={rates} />
      <p>In de praktijk: <strong>een nieuwsbrief kost ruim 13 cent per ontvanger</strong>, een verzendbevestiging of afspraakherinnering ruim <strong>4 cent</strong>. 1.000 nieuwsbrieven kosten € 132,30; 1.000 herinneringen € 41,40.</p>
      <p>Daarmee is Nederland voor marketing de duurste van deze vijf EU-landen:</p>
      <Comparison caption="Tarieven van Meta per bericht in vijf EU-landen vanaf 1 oktober 2026" columns={["Marketing", "Utility en service"]} rows={europe} />
      <Note>Meta past de tarieven elk kwartaal aan (1 januari, april, juli en oktober). Controleer de officiële prijslijst van Meta voordat je een begroting maakt, en houd er rekening mee dat je aanbieder meer kan rekenen dan Meta.</Note>
    </>,
  },
  {
    id: "oktober-2026",
    title: "Wat er op 1 oktober 2026 veranderde",
    body: <>
      <p>Tot 30 september was elk vrij antwoord binnen het venster van 24 uur gratis. Sinds <strong>1 oktober 2026</strong> geldt:</p>
      <ul>
        <li><strong>Antwoorden aan klanten kosten geld boven een drempel.</strong> Elk zakelijk nummer heeft 1.000 gratis serviceberichten per maand; daarna kost elk bericht evenveel als een utility-bericht, in Nederland € 0,0414. Wat je niet gebruikt, vervalt.</li>
        <li><strong>Utility-sjablonen binnen het venster van 24 uur kosten weer geld.</strong> Sinds juli 2025 waren ze daar gratis.</li>
        <li><strong>Click-to-WhatsApp-advertenties houden hun gratis venster:</strong> een gesprek dat begint via een advertentie of een knop op je Facebook-pagina is tot 7 dagen gratis.</li>
      </ul>
      <p>Voor een chatbot op de API heeft dat directe gevolgen: een bot die duizenden vragen per maand beantwoordt, kostte eerst niets aan Meta en kost nu bij elk antwoord. En een bot die drie korte berichten stuurt in plaats van één, kost het drievoudige.</p>
    </>,
  },
  {
    id: "aanbieders",
    title: "Wat kost een WhatsApp-aanbieder?",
    body: <>
      <p>De API gebruik je bijna altijd via een aanbieder (Business Solution Provider). Ze sturen je berichten allemaal via dezelfde Cloud API van Meta; de verschillen zitten in de software, de support en het contract. Twee voorbeelden met de prijzen van hun eigen sites, naast Wapzen:</p>
      <Comparison caption="WhatsApp-aanbieders vergeleken: 360dialog, Trengo en Wapzen" columns={["360dialog", "Trengo", "Wapzen"]} rows={providers} />
      <ul>
        <li><strong>360dialog</strong> is pure API-toegang voor ontwikkelaars en bureaus: goedkoop per nummer, maar zonder inbox in het instaptarief. Je hebt eigen software nodig of een tool als n8n.</li>
        <li><strong>Trengo</strong>, uit Utrecht, is een gedeelde inbox voor teams. Boost bevat 500 gesprekken per maand bij maandelijkse betaling; extra gesprekken en gebruikers kosten bij.</li>
      </ul>
      <p>Reken bij elke aanbieder zo: <strong>maandbedrag + gebruikers + kosten van Meta per bericht</strong>. Bij kleine volumes is het maandbedrag meestal de grootste post.</p>
    </>,
  },
  {
    id: "voorbeelden",
    title: "Wat betaal je echt: drie rekenvoorbeelden",
    body: <>
      <p>Per bericht lijken de tarieven klein, op de maandrekening minder. Drie typische bedrijven met de tarieven van 1 oktober 2026, alleen de kosten van Meta, exclusief btw:</p>
      <h3>Een webshop in Amsterdam</h3>
      <ul>
        <li>1.500 chats met elk ongeveer 4 antwoorden: 6.000 serviceberichten, waarvan 5.000 boven de gratis drempel × € 0,0414 = <strong>€ 207,00</strong></li>
        <li>1.200 verzendbevestigingen (utility) × € 0,0414 = <strong>€ 49,68</strong></li>
        <li>Eén nieuwsbrief aan 3.000 abonnees: 3.000 marketingberichten × € 0,1323 = <strong>€ 396,90</strong></li>
      </ul>
      <p>Ruim <strong>€ 650 per maand</strong> aan Meta, vóór het abonnement van de aanbieder.</p>
      <h3>Een tandartspraktijk in Utrecht</h3>
      <ul>
        <li>500 chats van patiënten × 5 antwoorden: 2.500 serviceberichten, waarvan 1.500 betaald × € 0,0414 = <strong>€ 62,10</strong></li>
        <li>800 afspraakherinneringen (utility) × € 0,0414 = <strong>€ 33,12</strong></li>
      </ul>
      <p>Ongeveer <strong>€ 95 per maand</strong>. De software kost hier vaak meer dan de berichten.</p>
      <h3>Een installatiebedrijf in Rotterdam</h3>
      <ul>
        <li>300 aanvragen × 4 antwoorden: 1.200 berichten, waarvan 200 betaald × € 0,0414 = <strong>€ 8,28</strong></li>
        <li>250 afspraakbevestigingen (utility) × € 0,0414 = <strong>€ 10,35</strong></li>
      </ul>
      <p>Nog geen <strong>€ 19 per maand</strong> aan Meta. Met een abonnement van € 299 betaalt dit bedrijf vooral voor de software.</p>
      <h3>Zo bespaar je</h3>
      <ul>
        <li><strong>Eén antwoord in plaats van drie:</strong> laat je bot en je team volledige antwoorden in één bericht schrijven.</li>
        <li><strong>De juiste categorie:</strong> een verzendbevestiging is utility, geen marketing. Meta controleert sjablonen en deelt verkeerd ingediende opnieuw in.</li>
        <li><strong>Gesprekken via advertenties starten:</strong> chats uit Click-to-WhatsApp-advertenties zijn tot 7 dagen gratis.</li>
        <li><strong>Antwoorden zonder API:</strong> wie geen nieuwsbrieven stuurt, beantwoordt chats in de app of met AI op het eigen nummer, zonder kosten per bericht.</li>
      </ul>
    </>,
  },
  {
    id: "avg",
    title: "AVG en AI-regels: wat je moet weten",
    body: <>
      <ul>
        <li><strong>Verwerkersovereenkomst:</strong> voor het Business Platform gelden de WhatsApp Business Data Processing Terms van Meta, waarin WhatsApp optreedt als verwerker voor jou, voor zover de voorwaarden van Meta dat bepalen. Met elke andere dienst die berichten van klanten voor je verwerkt (aanbieder, AI-dienst) heb je een verwerkersovereenkomst nodig.</li>
        <li><strong>Toestemming:</strong> marketingberichten alleen naar contacten die daarvoor gekozen hebben. Meta eist dat ook, en het beschermt je nummer tegen blokkades.</li>
        <li><strong>Privacyverklaring:</strong> noem WhatsApp en elke tool die berichten verwerkt in je privacyverklaring.</li>
        <li><strong>Zeg dat het AI is:</strong> sinds 2 augustus 2026 verplicht de Europese AI Act (artikel 50) je om mensen te laten weten dat ze met een AI praten, tenzij dat duidelijk is. De Digital Omnibus heeft die plicht niet uitgesteld. Eén zin in je begroeting is genoeg: „Je praat eerst met onze AI-assistent.”</li>
      </ul>
      <Note>Dit is een overzicht, geen juridisch advies. Voor jouw situatie vraag je het je privacy-adviseur of kijk je bij de Autoriteit Persoonsgegevens.</Note>
    </>,
  },
  {
    id: "alternatief",
    title: "Het alternatief zonder kosten van Meta: AI op je eigen nummer",
    body: <>
      <p>Wil je de API alleen om vragen van klanten sneller te beantwoorden? Dan kan het goedkoper. <strong>Wapzen</strong> koppelt je bestaande WhatsApp-nummer met een QR-code als gekoppeld apparaat, net als WhatsApp Web. Een AI-agent beantwoordt dan elk binnenkomend privébericht in het Nederlands, met de informatie uit je kennisbank: prijzen, openingstijden, levertijden, diensten. Een spraakagent neemt WhatsApp-gesprekken aan en belt nieuwe leads terug.</p>
      <ul>
        <li><strong>Geen kosten van Meta per antwoord,</strong> omdat de antwoorden niet via de API gaan.</li>
        <li><strong>Geen nieuw nummer en geen API-aanvraag:</strong> je chats blijven in de app en je kunt altijd zelf antwoorden.</li>
        <li><strong>Gratis starten,</strong> zonder creditcard en zonder contract. Voor grotere volumes stuur je ons een bericht.</li>
      </ul>
      <InlineCta title="AI-antwoorden zonder kosten per bericht" body="Maak een AI-agent, voeg de informatie van je bedrijf toe en koppel je WhatsApp-nummer met een QR-code. Hij antwoordt meteen." label="Gratis starten" />
      <p>De grenzen zeggen we eerlijk: Wapzen is geen product van Meta. Het verstuurt geen nieuwsbrieven, antwoordt niet in groepen en leest geen foto’s of spraakberichten. Als gekoppeld apparaat lezen de servers van Wapzen elk binnenkomend bericht en sturen het naar een AI-model om het antwoord te schrijven. Vertel je klanten daarom dat eerst een assistent antwoordt.</p>
      <Choose locale="nl" items={[
        { name: "de API", points: ["je regelmatig nieuwsbrieven naar duizenden contacten stuurt", "een groot team één gedeelde inbox nodig heeft", "je webshop of CRM automatisch berichten moet versturen"] },
        { name: "Wapzen", points: ["je vooral vragen van klanten sneller wilt beantwoorden", "je geen kosten per antwoord en geen jaarcontract wilt", "ook WhatsApp-gesprekken aangenomen moeten worden"] },
      ]} />
    </>,
  },
];

export default function WhatsAppZakelijkKostenPage() {
  return <BlogPost
    href={href}
    heading={<>WhatsApp Zakelijk kosten.<br /><span>Wat gratis is en wat je betaalt.</span></>}
    lead="De app is gratis, de API niet. Hier vind je de tarieven van Meta voor Nederland sinds 1 oktober 2026, wat aanbieders extra rekenen, drie uitgewerkte rekenvoorbeelden en hoe je klantchats met AI beantwoordt zonder kosten per bericht."
    summary={{
      title: "In het kort",
      items: [
        <><strong>App:</strong> gratis, inclusief catalogus, afwezigheidsberichten en verzendlijsten tot 256 contacten.</>,
        <><strong>API in Nederland:</strong> € 0,1323 per marketingbericht en € 0,0414 per utility-bericht. Sinds 1 oktober 2026 kosten ook antwoorden vanaf het 1.001e per maand.</>,
        <><strong>Aanbieders:</strong> van € 49 per nummer tot € 299 per maand en meer, plus de kosten van Meta.</>,
      ],
    }}
    sections={sections}
    faq={faqs}
    sources={sources}
    related={["/blog/whatsapp-business-api-pricing", "/blog/whatsapp-business-app-vs-api"]}
    product="/whatsapp-business-api-alternative"
    cta={{ heading: <>Klantchats beantwoorden met AI.<br /><span>Zonder kosten per bericht.</span></>, body: "Maak je AI-agent, voeg de informatie van je bedrijf toe en koppel je WhatsApp-nummer. Gratis starten, zonder creditcard." }}
  />;
}
