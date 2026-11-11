import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Searches (Google, YouTube and DuckDuckGo autocomplete with gl=fi, 2026-11-11, see
// docs/seo-research.md, "Finland posts"): "whatsapp business api" (41, 3/3), "whatsapp
// business" (30, 3/3), "onko whatsapp business ilmainen" (20), "whatsapp yritystili" (20),
// "whatsapp business hinta" (17), "whatsapp business kokemuksia" (16), "whatsapp business
// tietokoneelle" (13), "onko whatsapp business maksullinen" (10), "whatsapp business
// käyttöönotto" (10). The Finnish result for the main question is a machine-translated page.
// Not registered as a translation of /blog/is-whatsapp-business-free: the content differs
// (Finnish rates in euros, set-up steps) and it would change that page's hreflang.
// Meta One and Premium figures match the English post (about.fb.com, 15 Sep 2026; Premium has
// no official price sheet). Meta EUR rates from the 1 Oct 2026 card through third-party
// reprints: Finland sits in "Rest of Western Europe" on Meta's own pricing page. Recheck each
// quarter (1 Jan/Apr/Jul/Oct). Copy rules as in the other Finnish posts: free right now, no
// caps mentioned, no ban wording, nothing about Wapzen sending campaigns.
const href = "/fi/blog/onko-whatsapp-business-ilmainen";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "fi", article: { publishedTime: post.published, modifiedTime: post.updated } });

const costs = [
  ["WhatsApp Business -sovellus", "Ilmainen", "Yritysprofiili, tuoteluettelo, tervehdys- ja poissaoloviestit, pikavastaukset, tunnisteet, viestit ja puhelut"],
  ["Tavalliset lähetyslistat", "Ilmainen", "Enintään 256 yhteystietoa listalla; viestin saavat vain ne, jotka ovat tallentaneet numerosi"],
  ["Yritysten joukkoviestit (business broadcasts)", "Maksu toimitetusta viestistä, maakohtainen", "Tavoittaa myös ne, jotka eivät ole tallentaneet numeroasi; mukana raportointi"],
  ["WhatsApp Business Premium", "Ei virallista hinnastoa; tietojen mukaan noin 5–15 $ kuukaudessa", "Oma verkkosivu ja lyhytlinkki, enintään 10 linkitettyä laitetta, keskustelujen jako työntekijöille"],
  ["Meta One -yritystilaukset", "Alkaen 14,99 $ kuukaudessa", "Vahvistettu merkki, suoja toisena esiintymistä vastaan, Meta Business Agent"],
  ["WhatsApp Business API", "Maksu viestistä, yleensä lisäksi alustan kuukausimaksu", "Suuret kampanjat, isot tiimit, integraatiot"],
];

const apps = [
  ["Hinta", "Ilmainen", "Ilmainen"],
  ["Yritysprofiili ja aukioloajat", "Ei", "Kyllä"],
  ["Tuoteluettelo", "Ei", "Kyllä"],
  ["Tervehdys- ja poissaoloviesti", "Ei", "Kyllä"],
  ["Pikavastaukset ja tunnisteet", "Ei", "Kyllä"],
  ["Tekoäly, joka vastaa asiakkaille", "Ei sisälly", "Meta Business Agent ehdot täyttäville yrityksille valituilla markkinoilla"],
];

const metaOne = [
  ["Essential", "Alkaen 14,99 $", "Meta Business Agent, vahvistettu merkki, vahvistettu kanava, suoja toisena esiintymistä vastaan"],
  ["Advanced", "Alkaen 49,99 $", "Lisää linkitettyjä laitteita, joukkoviestikrediittejä, enemmän agentin vastauksia"],
  ["Expert", "Alkaen 149 $", "Laajempi käyttö ja enemmän agentin kapasiteettia tiimeille"],
  ["Max", "Alkaen 499 $", "Laajin käyttö ja suurin agentin kapasiteetti"],
];

const rates = [
  ["Suomi, Ruotsi, Norja ja Tanska", "0,0490 €", "0,0142 €"],
  ["Espanja", "0,0585 €", "0,0166 €"],
  ["Ranska", "0,0712 €", "0,0248 €"],
  ["Saksa", "0,1131 €", "0,0456 €"],
  ["Alankomaat", "0,1323 €", "0,0414 €"],
];

const versus = [
  ["Kuukausimaksu", "Alustan tilaus, esimerkiksi 89–299 € kuukaudessa Superchatissa", "Ei ole"],
  ["Maksu vastauksista", "1 000 ilmaista kuukaudessa, sitten noin 0,0142 € kappale", "Ei ole"],
  ["Yhdistäminen", "Metan yritystili ja API:n käyttöönotto", "Linkitetty laite, kuten WhatsApp Web"],
  ["Vihreä merkki ja hyväksytyt viestipohjat", "Kyllä", "Ei"],
  ["Tekoäly", "Usein lisämaksullinen tai vasta kalliimmassa tilauksessa", "Sisältyy"],
];

const sources = [
  { label: "Meta: WhatsApp Business Platformin hinnoittelu", href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing" },
  { label: "DEV Community: Metan eurohinnat maittain 1.10.2026 alkaen (kolmannen osapuolen taulukko)", href: "https://dev.to/tobachat/how-meta-prices-whatsapp-api-messages-per-country-2026-with-code-to-estimate-your-bill-i26" },
  { label: "Voltade: Metan hinnat 1.10.2026 alkaen markkinoittain (kolmannen osapuolen yhteenveto)", href: "https://voltade.com/learn/whatsapp/whatsapp-api-pricing-changes-october-2026" },
  { label: "Meta: Introducing Meta One (15.9.2026)", href: "https://about.fb.com/news/2026/09/introducing-meta-one/" },
  { label: "SleekFlow: WhatsApp Business Premium", href: "https://sleekflow.io/blog/whatsapp-business-premium" },
  { label: "WhatsAppin ohjekeskus: yritysten joukkoviestien hinnoittelu", href: "https://faq.whatsapp.com/1356785542323967" },
  { label: "WhatsApp Business: Meta Business Agent sovelluksessa", href: "https://whatsappbusiness.com/products/business-app-ai-agent/" },
  { label: "Superchat: hinnat", href: "https://www.superchat.com/pricing" },
  { label: "Traficom: Kuluttajien nettikäytössä jyräävät WhatsApp, Yle Areena ja Netflix (10.7.2024)", href: "https://traficom.fi/fi/uutiset/kuluttajien-nettikaytossa-jyraavat-whatsapp-yle-areena-ja-netflix" },
  { label: "EUR-Lex: tekoälyasetus (EU) 2024/1689, 50 artikla", href: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj" },
];

const questions = [
  {
    id: "lyhyesti",
    q: "Onko WhatsApp Business ilmainen?",
    answer: "Kyllä. WhatsApp Business -sovellus on ilmainen ladata ja käyttää: viestit, puhelut, yritysprofiili, tuoteluettelo, tervehdys- ja poissaoloviestit, pikavastaukset ja tunnisteet eivät maksa mitään. Maksat vain, jos otat käyttöön lisäpalveluja: yritysten joukkoviestit, Premium- tai Meta One -tilauksen tai WhatsApp Business API:n.",
    body: <>
      <p>Hämmennys johtuu sovelluksen ympärille tulleista maksullisista lisistä. Tässä koko kartta:</p>
      <Comparison caption="Mikä WhatsApp Businessissa on ilmaista ja mikä maksullista vuonna 2026" columns={["Hinta", "Mitä saat"]} rows={costs} />
      <p>Jos vain viestit asiakkaiden kanssa ja käytät tuoteluetteloa ja automaattisia viestejä, laskusi pysyy nollassa.</p>
    </>,
  },
  {
    id: "kuukausimaksu",
    q: "Onko WhatsApp Business maksullinen yritykselle? Onko siinä kuukausimaksua?",
    answer: "Ei ole. Itse sovelluksessa ei ole kuukausimaksua, eikä yritys maksa sen käytöstä Suomessa. Kuukausimaksu koskee vain valinnaisia tilauksia, kuten Meta One -yritystilauksia, jotka alkavat 14,99 dollarista kuukaudessa, sekä API-palveluntarjoajien omia tilauksia. Asiakkaiden sinulle lähettämät viestit ovat aina maksuttomia.",
    body: <>
      <p>Tarvitset vain puhelinnumeron ja nettiyhteyden. Meta ei veloita viesteistä, joita asiakkaat lähettävät yritykselle, ei sovelluksessa eikä API:ssa.</p>
      <p>Sovellus kannattaa ottaa käyttöön, koska asiakkaat ovat jo WhatsAppissa: Traficomin kuluttajatutkimuksessa (joulukuu 2023, 2 162 täysi-ikäistä vastaajaa) <strong>81 % kuluttajista käytti WhatsAppia viikoittain viestien lähettämiseen</strong> ja 34 % puheluihin.</p>
    </>,
  },
  {
    id: "ero",
    q: "Mitä eroa on WhatsAppilla ja WhatsApp Businessilla? Tarvitseeko yritys yritystilin?",
    answer: "WhatsApp Business on erillinen, ilmainen sovellus, jossa on yrityksille tehtyjä työkaluja: yritysprofiili aukioloaikoineen, tuoteluettelo, automaattiset viestit, pikavastaukset ja tunnisteet. Viestit ja puhelut toimivat samoin kuin tavallisessa WhatsAppissa. Yritystili ei ole pakollinen, mutta se on ilmainen ja antaa asiakkaalle enemmän tietoa yrityksestäsi.",
    body: <>
      <Comparison caption="Tavallinen WhatsApp ja WhatsApp Business rinnakkain" columns={["WhatsApp", "WhatsApp Business"]} rows={apps} />
      <p>Yksi puhelinnumero voi olla kerrallaan käytössä vain toisessa sovelluksessa. Voit vaihtaa tavallisesta WhatsAppista WhatsApp Businessiin samalla numerolla.</p>
    </>,
  },
  {
    id: "kayttoonotto",
    q: "Miten WhatsApp Business otetaan käyttöön?",
    answer: "Lataa WhatsApp Business App Storesta tai Google Playsta, rekisteröi yrityksesi puhelinnumero, täytä yritysprofiili ja aseta aukioloajat. Lisää sitten tuoteluettelo ja automaattiset viestit. Tietokoneella käytät samaa tiliä WhatsApp Webissä tai työpöytäsovelluksessa, kun linkität sen laitteeksi.",
    body: <>
      <ol>
        <li><strong>Lataa sovellus.</strong> WhatsApp Business on eri sovellus kuin tavallinen WhatsApp.</li>
        <li><strong>Rekisteröi numero.</strong> Vahvista numero koodilla, jonka saat tekstiviestillä tai puhelulla.</li>
        <li><strong>Täytä yritysprofiili.</strong> Lisää nimi, kuvaus, osoite, aukioloajat ja verkkosivu.</li>
        <li><strong>Lisää tuoteluettelo,</strong> jos myyt tuotteita tai palveluja.</li>
        <li><strong>Aseta automaattiset viestit.</strong> Ohjeet ja 15 valmista mallia ovat artikkelissa <Link href="/fi/blog/whatsapp-automaattinen-vastaus">WhatsAppin automaattinen vastaus</Link>.</li>
        <li><strong>Linkitä tietokone.</strong> Avaa puhelimessa Linkitetyt laitteet › Linkitä laite ja skannaa tietokoneen näytöllä näkyvä QR-koodi.</li>
      </ol>
    </>,
  },
  {
    id: "premium",
    q: "Mitä WhatsApp Business Premium ja Meta One maksavat?",
    answer: "Meta One -yritystilaukset maksavat Metan mukaan alkaen 14,99 dollaria kuukaudessa (Essential), 49,99 dollaria (Advanced), 149 dollaria (Expert) ja 499 dollaria (Max). WhatsApp Business Premiumille Meta ei ole julkaissut hinnastoa; tietojen mukaan se maksaa noin 5–15 dollaria kuukaudessa. Kumpaakaan ei tarvita WhatsApp Businessin käyttöön.",
    body: <>
      <p><strong>Meta One</strong> on Metan tilaus, joka kattaa sen sovellukset. Yritystilaukset julkistettiin 15.9.2026:</p>
      <Comparison caption="Meta One -yritystilaukset Yhdysvaltain dollareissa" columns={["Hinta kuukaudessa", "Mitä se lisää WhatsAppiin"]} rows={metaOne} />
      <p>Metan mukaan tilaukset, hinnat ja saatavuus voivat vaihdella alueen, sovelluksen ja tilin mukaan. Tarkista siis sovelluksesta, mitä sinulle tarjotaan ja mihin hintaan.</p>
      <p><strong>WhatsApp Business Premium</strong> on sovelluksen sisäinen lisä: oma verkkosivu ja lyhytlinkki, enintään 10 linkitettyä laitetta ja keskustelujen jako työntekijöille. Se ei saa sovellusta vastaamaan asiakkaille puolestasi.</p>
    </>,
  },
  {
    id: "api",
    q: "Paljonko WhatsApp Business API maksaa Suomessa?",
    answer: "Meta veloittaa API:ssa toimitetusta viestistä vastaanottajan maan mukaan. Suomalaiseen numeroon markkinointiviesti maksaa noin 0,049 € ja asiointi-, todennus- tai maksullinen palveluviesti noin 0,0142 €, ilman arvonlisäveroa. Vastaukset asiakkaiden viesteihin ovat ilmaisia ensimmäiset 1 000 kappaletta kuukaudessa numeroa kohden. Lisäksi useimmat maksavat palveluntarjoajan kuukausimaksun.",
    body: <>
      <p>API on erillinen tuote ohjelmistoille, ei sovellus, jonka avaat puhelimessa. Suomi kuuluu Metan hinnastossa ryhmään Rest of Western Europe yhdessä muiden Pohjoismaiden kanssa. Metan listahinnat 1.10.2026 alkaen:</p>
      <Comparison caption="Metan listahinnat viestiä kohden vastaanottajan maan mukaan" columns={["Markkinointi", "Asiointi, todennus ja maksullinen palveluvastaus"]} rows={rates} />
      <p>Hinta määräytyy vastaanottajan numeron maatunnuksen mukaan. Jos esimerkiksi matkailuyritys viestii saksalaisille asiakkaille, viestit maksavat Saksan hinnan.</p>
      <p>Esimerkki suomalaisille asiakkaille viestivästä yrityksestä:</p>
      <ul>
        <li><strong>5 000 vastausta kuukaudessa:</strong> 1 000 ilmaisen jälkeen 4 000 × 0,0142 € = <strong>56,80 €</strong>.</li>
        <li><strong>Kampanjaviesti 500 asiakkaalle:</strong> 500 × 0,049 € = <strong>24,50 €</strong>.</li>
        <li><strong>Yhteensä Metalle:</strong> <strong>81,30 € kuukaudessa</strong>, ja päälle tulee alustan kuukausimaksu.</li>
      </ul>
      <Note>Hinnat ilman arvonlisäveroa. Luimme eurohinnat kolmannen osapuolen taulukoista, jotka toistavat Metan 1.10.2026 hinnaston. Meta tarkistaa hinnat neljännesvuosittain, 1.1., 1.4., 1.7. ja 1.10., joten katso ajantasainen hinnasto Metan sivulta ennen budjetointia.</Note>
    </>,
  },
  {
    id: "vastaaminen",
    q: "Maksaako asiakkaiden viesteihin vastaaminen?",
    answer: "Sovelluksessa ei koskaan. API:ssa Meta alkoi 1.10.2026 veloittaa myös palveluvastauksista: jokainen yritysnumero saa 1 000 ilmaista palveluviestiä kuukaudessa, ja sen jälkeen vastaus maksaa suomalaiseen numeroon noin 0,0142 €. Käyttämättömät ilmaisviestit eivät siirry seuraavalle kuulle.",
    body: <>
      <p>Viesteistä, joita asiakkaat lähettävät sinulle, Meta ei veloita missään tilanteessa. Maksu koskee vain yrityksen lähettämiä viestejä API:ssa.</p>
    </>,
  },
  {
    id: "joukkoviestit",
    q: "Ovatko WhatsAppin joukkoviestit ilmaisia?",
    answer: "Tavalliset lähetyslistat ovat ilmaisia: yhdellä listalla voi olla enintään 256 yhteystietoa, ja viestin saavat vain ne, jotka ovat tallentaneet numerosi. Yritysten joukkoviestit tavoittavat myös ne, jotka eivät ole tallentaneet numeroasi, ja niistä maksetaan toimitetun viestin mukaan.",
    body: <>
      <p>Lähetä viestejä vain asiakkaille, jotka ovat antaneet siihen luvan, ja kerro jokaisessa viestissä, miten listalta pääsee pois.</p>
    </>,
  },
  {
    id: "tarve",
    q: "Mistä pienyrityksen kannattaa maksaa?",
    answer: "Useimmille pienyrityksille ilmainen sovellus riittää. Meta One Essential on perusteltu, jos haluat vahvistetun merkin. Premium tai Meta One Advanced auttaa, kun samaa numeroa hoitaa moni työntekijä. API kannattaa, kun lähetät suuria kampanjoita luvan antaneille asiakkaille. Tekoälyn vastaamiseen et tarvitse maksullista tasoa.",
    body: <>
      <ul>
        <li><strong>Viestit vain asiakkaiden kanssa:</strong> pysy ilmaisessa sovelluksessa.</li>
        <li><strong>Haluat vahvistetun merkin:</strong> katso Meta One Essential.</li>
        <li><strong>Samaa numeroa hoitaa moni:</strong> katso Premium tai Meta One Advanced.</li>
        <li><strong>Suuret kampanjat luvan antaneille:</strong> vertaa yritysten joukkoviestejä ja API:a.</li>
        <li><strong>Haluat tekoälyn vastaamaan viesteihin:</strong> maksullista tasoa ei tarvita. Wapzen tekee sen nyt ilmaiseksi.</li>
      </ul>
    </>,
  },
  {
    id: "tekoaly",
    q: "Miten saan tekoälyn vastaamaan WhatsAppissa ilman maksuja?",
    answer: "Wapzenissa kaikki on tällä hetkellä ilmaista. Se yhdistää numeron, jota jo käytät, yhdistämiskoodilla tai QR-koodilla, ja tekoälyagentti vastaa viesteihin suomeksi yrityksesi ohjeiden ja tiedostojen pohjalta. Metan viestimaksuja ei tule, koska Wapzen ei käytä Business API:a. Wapzen on itsenäinen tuote, ei Metan tai WhatsAppin tekemä.",
    body: <>
      <Comparison caption="Virallinen API alustan kanssa ja Wapzen rinnakkain" columns={["Virallinen API ja alusta", "Wapzen"]} rows={versus} />
      <p>Wapzen toimii tavallisessa WhatsAppissa ja WhatsApp Businessissa. Numero ei vaihdu, ja voit käyttää puhelintasi kuten ennenkin. Vaiheittainen ohje, valmis ohjepohja ja kahdeksan vaihtoehdon vertailu ovat artikkelissa <Link href="/fi/blog/ilmainen-whatsapp-chatbot">Ilmainen WhatsApp-chatbot yritykselle</Link>.</p>
      <InlineCta title="Lisää tekoäly WhatsAppiisi ilmaiseksi" body="Yhdistä numerosi, kerro agentille yrityksestäsi ja anna sen vastata asiakkaille." label="Aloita ilmaiseksi" />
    </>,
  },
  {
    id: "tietosuoja",
    q: "Mitä tietosuojasta pitää tietää, kun yritys käyttää WhatsAppia?",
    answer: "Asiakkaiden nimet, numerot ja viestit ovat henkilötietoja, joten yrityksen pitää kertoa niiden käsittelystä tietosuojaselosteessaan ja pyytää vain tarpeelliset tiedot. Jos lisäät WhatsAppiin kolmannen osapuolen työkalun, tarkista, missä se säilyttää tietoja. Wapzenissa tietoja käsitellään osin EU:n ulkopuolella.",
    body: <>
      <p>Tämä on yleistä tietoa, ei oikeudellista neuvontaa:</p>
      <ul>
        <li><strong>Wapzenin tiedot.</strong> Päätietokanta on Singaporessa, palvelimet Singaporessa ja Saksassa ja agentille lataamasi tiedostot Soulissa. Tekoälypalveluntarjoajat, kuten OpenAI, voivat käsitellä viestejä Yhdysvalloissa. Wapzen ei julkaise valmista henkilötietojen käsittelysopimusta. Lisätietoja on englanninkielisessä <Link href="/privacy">tietosuojakäytännössä</Link>.</li>
        <li><strong>Kerro tekoälystä.</strong> EU:n tekoälyasetuksen 50 artikla edellyttää 2.8.2026 alkaen, että ihmiselle kerrotaan hänen asioivan tekoälyn kanssa. Kirjoita agentin ohjeisiin, että se esittäytyy virtuaaliseksi avustajaksi.</li>
      </ul>
    </>,
  },
];

export default function OnkoWhatsAppBusinessIlmainenPage() {
  return <QaPost
    href={href}
    heading={<>Onko WhatsApp Business ilmainen?<br /><span>Mikä on ilmaista ja mikä maksaa Suomessa.</span></>}
    lead="Sovellus on ilmainen, mutta Premium, Meta One, yritysten joukkoviestit ja API maksavat. Käymme läpi, mitä kukin maksaa vuonna 2026, mitä Metan viestimaksut ovat suomalaisiin numeroihin euroissa ja mitä pienyritys oikeasti tarvitsee."
    verdict={{
      title: "Lyhyt vastaus",
      body: <><strong>WhatsApp Business -sovellus on ilmainen, eikä siinä ole kuukausimaksua.</strong> Asiakkaiden viestit sinulle ovat aina maksuttomia. Rahaa kuluu vain valinnaisiin lisiin: Meta One alkaen 14,99 $ kuukaudessa, yritysten joukkoviestit viestikohtaisesti ja API, jossa Meta veloittaa viesteistä. Jos haluat tekoälyn vastaamaan viesteihin, se onnistuu ilman maksullista tasoa: <strong>Wapzenissa kaikki on nyt ilmaista.</strong></>,
    }}
    facts={[["Sovellus", "Ilmainen"], ["Kuukausimaksu", "Ei ole"], ["API Suomessa", "n. 0,0142–0,049 € viestiltä"], ["Tekoäly", "Ilmainen Wapzenissa nyt"]]}
    indexTitle="Tämän oppaan 11 kysymystä"
    answerLabel="Lyhyt vastaus"
    questions={questions}
    sources={sources}
    cta={{ heading: <>Pidä WhatsApp ilmaisena.<br /><span>Lisää tekoäly, joka vastaa puolestasi.</span></>, body: "Wapzenissa kaikki on nyt ilmaista: tekoälyagentti nykyiseen WhatsApp-numeroosi ilman Business API:a ja ilman luottokorttia." }}
  />;
}
