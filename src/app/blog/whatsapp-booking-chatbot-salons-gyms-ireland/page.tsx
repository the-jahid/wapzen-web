import type { Metadata } from "next";
import { blogPost } from "@/lib/blogPosts";
import { VerbatimPost, verbatimPostMetadata } from "@/components/blog/VerbatimPost";

// The owner's Irish text, published word for word: don't edit it without asking.
const href = "/blog/whatsapp-booking-chatbot-salons-gyms-ireland";
const post = blogPost(href);

export const metadata: Metadata = verbatimPostMetadata(post, "ga_IE", ["WhatsApp Booking Chatbot Ireland", "AI Receptionist Ireland", "WhatsApp Chatbot for Salons Ireland", "Gym Booking Chatbot Ireland"]);

const faqs = [
  { q: "An féidir le salon beag Wapzen a úsáid?", a: "Is féidir. Tá Wapzen oiriúnach do ghnólachtaí beaga chomh maith le gnólachtaí a bhfuil foirne níos mó acu." },
  { q: "An féidir le Wapzen coinní a chur in áirithe?", a: "Is féidir, má tá nasc oiriúnach le córas áirithinte curtha ar bun trí API." },
  { q: "An bhfuil cárta creidmheasa ag teastáil?", a: "Níl. Tá Wapzen saor in aisce faoi láthair agus ní gá cárta creidmheasa chun clárú." },
];

const sections = [
  {
    id: "cen-fath-a-bhfuil-whatsapp-ai",
    title: "Cén fáth a bhfuil WhatsApp AI úsáideach do salons agus do ghnólachtaí folláine?",
    body: <>
      <p>Nuair a bhíonn gruagaire ag obair le custaiméir, ní bhíonn sé éasca gach teachtaireacht a fhreagairt láithreach.</p>
      <p>Tá an dúshlán céanna ag teiripeoirí áilleachta, traenálaithe pearsanta agus foirne giomnáisiam.</p>
      <p>Má bhíonn custaiméir ag iarraidh coinne a dhéanamh ach nach bhfaigheann sé freagra, d&apos;fhéadfadh sé dul chuig gnólacht eile.</p>
      <p>Is féidir le comhrábot AI cabhrú trí fhreagraí uathoibríocha a sholáthar fiú nuair atá gach ball foirne gnóthach.</p>
    </>,
  },
  {
    id: "5-bhealach-a-chabhraionn-wapzen-le",
    title: "5 bhealach a chabhraíonn Wapzen le do ghnólacht",
    body: <>
      <h3>1. Ceisteanna faoi choinní a fhreagairt</h3>
      <p>Is féidir le custaiméirí fiafraí faoi infhaighteacht, uaireanta oscailte agus na seirbhísí atá ar fáil.</p>
      <p>Má nascann tú Wapzen le do chóras áirithinte trí API, is féidir leis infhaighteacht a sheiceáil agus coinne a chur in áirithe de réir chumraíocht do chórais.</p>
      <p>Mar shampla:</p>
      <p>Custaiméir: &quot;An bhfuil coinne ar fáil don Satharn?&quot;</p>
      <p>Comhrábot: &quot;Cén tseirbhís atá uait?&quot;</p>
      <p>Is féidir leis an gcomhrábot faisnéis a bhailiú sula seiceálann sé na hamanna atá ar fáil.</p>
      <h3>2. Liosta praghsanna a sholáthar</h3>
      <p>Is minic a chuireann custaiméirí ceisteanna faoi phraghsanna sula ndéanann siad coinne.</p>
      <p>Is féidir le Wapzen na praghsanna a chuir tú ar fáil a úsáid chun ceisteanna a fhreagairt faoi:</p>
      <ul>
        <li>Gearradh agus dathú gruaige</li>
        <li>Cóireálacha aghaidhe</li>
        <li>Suathaireacht agus cóireálacha spá</li>
        <li>Seirbhísí tairní</li>
        <li>Traenáil phearsanta</li>
        <li>Ballraíochtaí giomnáisiam</li>
      </ul>
      <p>Ní gá don fhoireann an liosta praghsanna céanna a sheoladh de láimh gach uair.</p>
      <h3>3. Freagraí a thabhairt lasmuigh d&apos;uaireanta oscailte</h3>
      <p>Samhlaigh go seolann custaiméir teachtaireacht chuig do salon i gCorcaigh ag 10:30 san oíche.</p>
      <p>Tá an salon dúnta, ach tá suim ag an gcustaiméir coinne a dhéanamh don tseachtain dár gcionn.</p>
      <p>Is féidir le Wapzen freagra a thabhairt láithreach, na seirbhísí a mhíniú agus cabhrú leis an gcustaiméir an chéad chéim eile a ghlacadh.</p>
      <p>Má tá córas áirithinte nasctha leis, is féidir leis an bpróiseas áirithinte a éascú freisin.</p>
      <h3>4. Ceisteanna faoi ranganna aclaíochta a fhreagairt</h3>
      <p>Má tá giomnáisiam nó stiúideo folláine á reáchtáil agat, is féidir leis an gcomhrábot faisnéis a thabhairt faoi ranganna agus faoi bhallraíocht.</p>
      <p>Mar shampla, d&apos;fhéadfadh custaiméir fiafraí:</p>
      <p>&quot;An bhfuil rang yoga ann maidin Dé Sathairn?&quot;</p>
      <p>Má tá sceideal na ranganna sa bhunachar eolais, is féidir leis an gcomhrábot an fhaisnéis ábhartha a thabhairt.</p>
      <p>Le nasc API cuí, féadfaidh sé infhaighteacht reatha a sheiceáil freisin.</p>
      <h3>5. Glaonna WhatsApp a fhreagairt le AI</h3>
      <p>Tairgeann Wapzen gníomhaire gutha AI a fhreagraíonn glaonna WhatsApp.</p>
      <p>Is féidir leis cabhrú le custaiméirí a bhfuil ceisteanna acu faoi sheirbhísí, uaireanta oscailte nó phraghsanna.</p>
      <p>Is rogha úsáideach é seo do ghnólachtaí nach mbíonn fáilteoir ar fáil acu i gcónaí.</p>
    </>,
  },
  {
    id: "conas-comhrabot-wapzen-a-chruthu-do",
    title: "Conas comhrábot Wapzen a chruthú do do salon",
    body: <>
      <p>Ní gá duit a bheith i do shaineolaí teicneolaíochta.</p>
      <p>Cruthaigh cuntas saor in aisce, roghnaigh gníomhaire AI agus cuir faisnéis faoi do ghnólacht leis.</p>
      <p>Ba cheart duit do liosta praghsanna, d&apos;uaireanta oscailte, na seirbhísí atá ar fáil agus do pholasaithe cealaithe a chur san áireamh.</p>
      <p>Ansin ceangail d&apos;uimhir WhatsApp trí chód QR.</p>
      <p>Sula dtéann tú beo, déan tástáil ar na ceisteanna is coitianta a fhaigheann tú ó chustaiméirí.</p>
    </>,
  },
];

export default function WhatsAppBookingChatbotSalonsGymsIrelandPage() {
  return <VerbatimPost
    href={href}
    heading={"Comhrábot WhatsApp Saor in Aisce do Salons, Spánna agus Giomnáisiamaí in Éirinn"}
    lead="An bhfuil salon gruaige, salon áilleachta, spá nó giomnáisiam agat in Éirinn?"
    intro={<>
      <p>Má tá, is dócha go bhfaigheann tú teachtaireachtaí ó chustaiméirí gach lá.</p>
      <p>&quot;An bhfuil coinne ar fáil amárach?&quot;</p>
      <p>&quot;Cé mhéad atá ar ghearradh gruaige?&quot;</p>
      <p>&quot;An féidir liom mo choinne a athrú?&quot;</p>
      <p>&quot;Cathain a thosaíonn an chéad rang aclaíochta?&quot;</p>
      <p>Tá na ceisteanna seo tábhachtach do do ghnólacht, ach is féidir go dtógfaidh siad cuid mhór ama ar d&apos;fhoireann.</p>
      <p>Le <strong>Wapzen</strong>, is féidir leat comhrábot WhatsApp AI saor in aisce a chruthú chun na ceisteanna coitianta sin a fhreagairt.</p>
    </>}
    sections={sections}
    faqTitle="Ceisteanna Coitianta"
    faq={faqs}
    closing={{
      heading: "Tosaigh ag Uathoibriú do WhatsApp Inniu",
      body: <>
        <p>Má tá salon, spá, giomnáisiam nó stiúideo folláine agat i mBaile Átha Cliath, i gCorcaigh, i nGaillimh, i bPort Láirge nó áit ar bith eile in Éirinn, is féidir leat tús a chur le Wapzen.</p>
        <p>Ná caith an oiread ama ag freagairt na gceisteanna céanna arís agus arís eile.</p>
        <p><strong>Cruthaigh do chomhrábot WhatsApp AI saor in aisce agus cuir seirbhís níos áisiúla ar fáil do do chustaiméirí.</strong></p>
      </>,
      label: "Cruthaigh do Chomhrábot Saor in Aisce le Wapzen",
    }}
  />;
}
