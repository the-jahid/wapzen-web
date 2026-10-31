import type { Metadata } from "next";
import { blogPost } from "@/lib/blogPosts";
import { VerbatimPost, verbatimPostMetadata } from "@/components/blog/VerbatimPost";

// The owner's Irish text, published word for word: don't edit it without asking.
const href = "/blog/whatsapp-chatbot-travel-agencies-hotels-ireland";
const post = blogPost(href);

export const metadata: Metadata = verbatimPostMetadata(post, "ga_IE", ["WhatsApp Chatbot for Travel Agencies Ireland", "Hotel AI Chatbot Ireland", "WhatsApp Booking Automation Ireland"]);

const faqs = [
  { q: "An bhfuil gá le WhatsApp Business API?", a: "Níl. Ceanglaíonn Wapzen le huimhir WhatsApp phearsanta nó ghnó trí chód QR." },
  { q: "An féidir le Wapzen áirithintí óstáin a dhéanamh?", a: "Is féidir feidhmeanna áirithinte a chur ar fáil má nascann tú an gníomhaire leis an gcóras áirithinte cuí trí API." },
  { q: "An bhfuil Wapzen saor in aisce?", a: "Tá an t-ardán saor in aisce faoi láthair, agus tá na príomhghnéithe AI san áireamh." },
];

const sections = [
  {
    id: "cen-fath-a-bhfuil-whatsapp-usaideach",
    title: "Cén fáth a bhfuil WhatsApp úsáideach don turasóireacht?",
    body: <>
      <p>Is minic a bhíonn cuairteoirí ag iarraidh faisnéis a fháil go tapa agus iad ag taisteal.</p>
      <p>Ní bhíonn fonn orthu i gcónaí glaoch teileafóin a dhéanamh nó fanacht le freagra ar ríomhphost.</p>
      <p>Tugann WhatsApp bealach díreach dóibh chun teagmháil a dhéanamh le gnólacht.</p>
      <p>Trí chomhrábot AI a chur leis, is féidir le hóstáin, gníomhaireachtaí taistil agus oibreoirí turas freagraí a thabhairt ar cheisteanna coitianta gan idirghabháil láimhe i ngach comhrá.</p>
    </>,
  },
  {
    id: "conas-is-feidir-le-wapzen-cabhru",
    title: "Conas is féidir le Wapzen cabhrú le gnólachtaí taistil?",
    body: <>
      <h3>1. Fiosrúcháin faoi áirithintí a láimhseáil</h3>
      <p>Is féidir le comhrábot Wapzen ceisteanna faoi sheomraí, phraghsanna, sheirbhísí agus roghanna áirithinte a fhreagairt.</p>
      <p>Má tá nasc API leis an gcóras áirithinte curtha ar bun, is féidir leis infhaighteacht a sheiceáil agus cabhrú le háirithint a dhéanamh.</p>
      <p>Mar shampla, d&apos;fhéadfadh custaiméir fiafraí:</p>
      <p>&quot;An bhfuil seomra dúbailte ar fáil don Aoine seo chugainn?&quot;</p>
      <p>Is féidir leis an gcomhrábot an cheist a phróiseáil agus an chéad chéim eile a sholáthar bunaithe ar na córais atá nasctha leis.</p>
      <h3>2. Faisnéis faoi thurais a thabhairt</h3>
      <p>Is féidir le hoibreoirí turas faisnéis a chur ar fáil maidir le:</p>
      <ul>
        <li>Amanna imeachta agus áiteanna cruinnithe</li>
        <li>Praghsanna turas agus pacáistí</li>
        <li>Fad na dturas</li>
        <li>Polasaithe cealaithe</li>
        <li>Treoracha agus eolas ullmhúcháin</li>
        <li>Roghanna do ghrúpaí agus do theaghlaigh</li>
      </ul>
      <p>Is féidir leis an AI an fhaisnéis seo a úsáid chun freagraí a thabhairt do chustaiméirí.</p>
      <h3>3. Seirbhís 24/7 d&apos;aíonna óstáin</h3>
      <p>Samhlaigh go dtagann aoi chuig óstán i mBaile Átha Cliath go déanach san oíche.</p>
      <p>Tá ceist aige faoin bpáirceáil, faoin am seiceála isteach nó faoin mbricfeasta.</p>
      <p>In ionad fanacht go dtí an mhaidin, seolann sé teachtaireacht WhatsApp agus faigheann sé freagra ón gcomhrábot.</p>
      <p>Cabhraíonn sé seo le heispéireas níos áisiúla a chruthú d&apos;aíonna.</p>
      <h3>4. Freagraí i dteangacha éagsúla</h3>
      <p>Tagann turasóirí go hÉirinn ó go leor tíortha.</p>
      <p>Is féidir Wapzen a chumrú chun freagraí a thabhairt i dteangacha éagsúla, rud atá úsáideach do ghnólachtaí a fhreastalaíonn ar chuairteoirí idirnáisiúnta.</p>
      <h3>5. Glaonna WhatsApp le gníomhaire gutha AI</h3>
      <p>Ní comhrábot téacs amháin atá i Wapzen.</p>
      <p>Tairgeann sé gníomhaire gutha AI freisin atá in ann glaonna WhatsApp a fhreagairt agus glaonna amach a dhéanamh.</p>
      <p>D&apos;fhéadfadh gnólacht turasóireachta an ghné seo a úsáid chun ceisteanna coitianta a fhreagairt nó chun cumarsáid a dhéanamh le custaiméirí, faoi réir na gceadanna cuí.</p>
    </>,
  },
  {
    id: "an-bhfuil-wapzen-oiriunach-do-ghnolachtai",
    title: "An bhfuil Wapzen oiriúnach do ghnólachtaí beaga turasóireachta?",
    body: <>
      <p>Tá sé deartha le bheith inúsáidte gan scileanna ríomhchlárúcháin.</p>
      <p>Is féidir le gnólacht beag tosú trí na ceisteanna is coitianta óna chustaiméirí a chur isteach sa bhunachar eolais.</p>
      <p>Ina dhiaidh sin, is féidir feidhmeanna níos forbartha, amhail nascadh le córais áirithinte, a chur leis de réir riachtanais an ghnólachta.</p>
    </>,
  },
];

export default function WhatsAppChatbotTravelHotelsIrelandPage() {
  return <VerbatimPost
    href={href}
    heading={"Comhrábot WhatsApp AI do Ghníomhaireachtaí Taistil, Óstáin agus Oibreoirí Turas in Éirinn"}
    lead="Tá tionscal na turasóireachta in Éirinn ag brath ar chumarsáid mhaith le custaiméirí."
    intro={<>
      <p>Cibé an bhfuil óstán á reáchtáil agat i mBaile Átha Cliath, gníomhaireacht taistil i gCorcaigh nó gnólacht turasóireachta i nGaillimh, tá rud amháin i gcoiteann agaibh: bíonn ceisteanna ag custaiméirí i gcónaí.</p>
      <p>&quot;An bhfuil seomra ar fáil don deireadh seachtaine?&quot;</p>
      <p>&quot;Cén t-am a thosaíonn an turas?&quot;</p>
      <p>&quot;An féidir liom m&apos;áirithint a athrú?&quot;</p>
      <p>Is féidir leis na ceisteanna seo teacht isteach tráth ar bith, fiú nuair atá an oifig dúnta.</p>
      <p>Le <strong>Wapzen</strong>, is féidir le gnólachtaí taistil in Éirinn comhrábot WhatsApp AI saor in aisce a úsáid chun freagraí tapa a thabhairt agus an tseirbhís do chustaiméirí a fheabhsú.</p>
    </>}
    sections={sections}
    faqTitle="Ceisteanna Coitianta"
    faq={faqs}
    closing={{
      heading: "Cuir Feabhas ar Sheirbhís do Chustaiméirí le Wapzen",
      body: <>
        <p>Más óstán, gníomhaireacht taistil nó oibreoir turas in Éirinn tú, is féidir le Wapzen cabhrú leat freagraí níos tapa a thabhairt agus níos lú ama a chaitheamh ar cheisteanna athchleachtacha.</p>
        <p><strong>Cruthaigh do chomhrábot WhatsApp AI saor in aisce inniu.</strong></p>
      </>,
      label: "Bain Triail as Wapzen Saor in Aisce",
    }}
  />;
}
