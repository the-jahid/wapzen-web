import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { Choose, InlineCta, Note, RowTable } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Searches (Google, YouTube and DuckDuckGo autocomplete with gl=fi, 2026-11-11, see
// docs/seo-research.md, "Finland posts"): "whatsapp chatbot" (38, 3/3), "whatsapp chatbot
// free" (30, 3/3), "ilmainen tekoälyagentti" (20), "chatbot suomeksi" (20), "ai chatbot
// suomeksi" (18), "whatsapp asiakaspalvelu" (20), "tekoäly whatsapp" (20), "chatbot hinta"
// (10). Finnish results for these are machine-translated vendor pages, so the priced table is
// the main asset.
// Copy, by the user's decision (2026-11-11): free right now, no mention of the hourly or
// per-account caps, no ban wording either way. The server still has HOURLY_REPLY_LIMIT,
// GROUP_HOURLY_REPLY_LIMIT and MAX_CHAT_AGENTS_PER_USER, so write "keskusteluja rajattomasti"
// and "ei kuukausirajaa", never "rajattomat vastaukset" or "ei rajoituksia". Bulk Messages was
// removed on 2026-11-07, so nothing here says Wapzen sends campaigns. The voice CTA opens
// WhatsApp because the dashboard still shows VoiceUpdateNote.
// Prices read on each vendor's pricing page on 2026-11-11, except ManyChat (refuses automated
// reads; Kanal, read 4 Nov). Tidio's page doesn't say whether its figures are monthly or annual
// billing. Meta EUR rates for Finland (Rest of Western Europe, 1 Oct 2026 card) come from
// third-party reprints: recheck each quarter (1 Jan/Apr/Jul/Oct). Wapzen is our product and
// the post says so: it is not a ranking.
const href = "/fi/blog/ilmainen-whatsapp-chatbot";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Hei! Haluan ottaa Wapzenin ääniagentin käyttöön yrityksessäni Suomessa.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "fi", article: { publishedTime: post.published, modifiedTime: post.updated } });

const options = [
  ["Meta Business Agent", "Tuotesivu ei kerro hintaa. Vain ehdot täyttäville yrityksille valituilla markkinoilla", "Kyllä, WhatsApp Business -sovelluksessa", "Kyllä", "Meta One Essential alkaen 14,99 $ kuukaudessa"],
  ["Tidio", "50 keskustelua kuukaudessa ja 50 Lyro-tekoälykeskustelua yhteensä, ei kuukaudessa", "WhatsApp-integraatio on merkitty myös ilmaisversioon", "Lyro-tekoälyagentti, 50 ensimmäistä keskustelua ilmaiseksi", "Starter 24,17 $ kuukaudessa; Lyro alkaen 32,50 $ kuukaudessa"],
  ["Jotform AI Agents", "5 agenttia ja 100 keskustelua kuukaudessa", "WhatsApp-kanava on olemassa, mutta hinnoittelusivu ei kerro, kuuluuko se ilmaisversioon", "Kyllä", "Bronze 39 $ kuukaudessa, 1 000 keskustelua"],
  ["ManyChat", "25 aktiivista kontaktia kuukaudessa, ei WhatsAppia", "Vasta Pro-tilauksessa", "Pro-tilauksesta alkaen", "39 $ kuukaudessa (29 $ vuositilauksella) ja Metan viestimaksut"],
  ["Typebot", "200 keskustelua kuukaudessa, ei WhatsAppia", "Vasta Pro-tilauksessa", "Riippuu työnkulusta, jonka rakennat itse", "Pro 89 $ kuukaudessa"],
  ["Superchat", "30 aktiivista kontaktia kuukaudessa, ei tekoälyagenttia", "Kyllä, virallisen API:n kautta", "1 tekoälyagentti Professional-tilauksessa", "Basic 89 € ja Professional 149 € kuukaudessa, ilman ALV:a, 12 kuukauden sopimus"],
  ["Leadoo", "Leadoo Lite: kävijäanalytiikka ja yritystunnistus", "Hinnoittelusivu ei mainitse WhatsAppia", "Leadoo AI maksullisissa tilauksissa", "Hinta tarjouspyynnöllä"],
  ["Wapzen", "Tällä hetkellä kaikki: tekoälychat, tilausten vastaanotto, tietopankki, kuvien ja tiedostojen lähetys ja ääniagentti", "Kyllä, tavallinen WhatsApp tai WhatsApp Business", "Sisältyy", "Kuukausimaksua ei ole: 0 €"],
];

const included = [
  ["Kuukausimaksu", "Ei ole"],
  ["Maksu viestistä tai vastauksesta", "Ei ole"],
  ["Keskustelut ja yhteystiedot", "Rajattomasti"],
  ["Tekoälyvastaukset kuukaudessa", "Ei kuukausirajaa"],
  ["Luottokortti", "Ei tarvita"],
  ["Metan API-avain", "Ei tarvita"],
];

const fit = [
  ["Pienyritys tai toiminimi, joka palvelee ja myy WhatsAppissa", "Kyllä", "Vastaa sekunneissa omilla tiedoillasi, myös iltaisin ja viikonloppuisin"],
  ["Kauppa tai ravintola, joka ottaa tilauksia viestillä", "Kyllä", "Kirjaa tilauksen, varmistaa sen asiakkaalta ja tallentaa hallintapaneeliin"],
  ["Yksinyrittäjä, jolta viestit jäävät huomaamatta työn aikana", "Kyllä", "Agentti vastaa, kun olet asiakkaalla tai työmaalla"],
  ["Yritys, jolla on useita osastoja ja asiakaspalvelujono", "Ei", "Superchatin kaltaiset tiimialustat on tehty tähän"],
  ["Yritys, joka tarvitsee vihreän merkin tai Metan hyväksymät viestipohjat", "Ei", "Ne ovat vain Metan virallisessa API:ssa"],
  ["Yritys, joka haluaa chatin verkkosivuilleen", "Ei", "Wapzen toimii WhatsAppissa, ei sivuston chat-ikkunana"],
];

const prompt = `Olet Kukkakauppa Demon virtuaalinen avustaja. Kauppa on Tampereella.
Kerro ensimmäisessä viestissä, että olet virtuaalinen avustaja.
Vastaa suomeksi lyhyesti, kahdella tai kolmella lauseella, ja kysy yksi asia kerrallaan. Jos asiakas kirjoittaa ruotsiksi tai englanniksi, vastaa samalla kielellä.
Käytä hinnoissa, aukioloajoissa ja toimituksissa vain antamiamme tietoja. Jos et tiedä vastausta, sano se ja tarjoa yhteyttä henkilökuntaan.
Älä keksi alennuksia, toimitusaikoja tai saatavuutta.
Kotiinkuljetus Tampereella maksaa 9 € ja onnistuu samana päivänä, jos tilaus tulee ennen klo 14.
Maksu MobilePaylla tai kortilla noudettaessa. Et vahvista maksuja: pyydä kuitti ja kerro, että henkilökunta tarkistaa sen aukioloaikana.
Kun asiakas tilaa, kysy tuote, toimitusosoite, toimituspäivä ja kortin teksti. Toista tilaus ja loppusumma ja pyydä vahvistus.
Älä pyydä henkilötunnusta, salasanoja tai korttitietoja.
Jos asiakas haluaa puhua ihmisen kanssa, kerro, että henkilökunta vastaa arkisin klo 9–17 tässä samassa numerossa.`;

const sources = [
  { label: "Traficom: Kuluttajien nettikäytössä jyräävät WhatsApp, Yle Areena ja Netflix (10.7.2024)", href: "https://traficom.fi/fi/uutiset/kuluttajien-nettikaytossa-jyraavat-whatsapp-yle-areena-ja-netflix" },
  { label: "Harvard Business Review: The Short Life of Online Sales Leads", href: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads" },
  { label: "WhatsApp Business: Meta Business Agent sovelluksessa", href: "https://whatsappbusiness.com/products/business-app-ai-agent/" },
  { label: "Meta: Introducing Meta One (15.9.2026)", href: "https://about.fb.com/news/2026/09/introducing-meta-one/" },
  { label: "Meta: WhatsApp Business Platformin hinnoittelu", href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing" },
  { label: "DEV Community: Metan eurohinnat maittain 1.10.2026 alkaen (kolmannen osapuolen taulukko)", href: "https://dev.to/tobachat/how-meta-prices-whatsapp-api-messages-per-country-2026-with-code-to-estimate-your-bill-i26" },
  { label: "Tidio: hinnat", href: "https://www.tidio.com/pricing/" },
  { label: "Jotform: hinnat", href: "https://www.jotform.com/pricing/" },
  { label: "Kanal: ManyChatin hinnat 2026 (kolmannen osapuolen yhteenveto)", href: "https://getkanal.com/blog/manychat-pricing-explained.md" },
  { label: "Typebot: hinnat", href: "https://typebot.com/pricing" },
  { label: "Superchat: hinnat", href: "https://www.superchat.com/pricing" },
  { label: "Leadoo: hinnat", href: "https://leadoo.com/pricing/" },
  { label: "EUR-Lex: tekoälyasetus (EU) 2024/1689, 50 artikla", href: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj" },
];

const questions = [
  {
    id: "onko",
    q: "Onko ilmaista WhatsApp-chatbottia olemassa?",
    answer: "Kyllä. Wapzen tarjoaa tällä hetkellä ilmaisen tekoälychatbotin, joka vastaa asiakkaillesi omassa WhatsApp-numerossasi suomeksi. Kuukausimaksua, viestikohtaista maksua tai Metan API-avainta ei ole. Monessa muussa työkalussa ”ilmainen” tarkoittaa kokeilujaksoa, pientä keskustelumäärää tai versiota, jossa WhatsApp ei ole mukana.",
    body: <>
      <p>Kun etsit ilmaista WhatsApp-chatbottia, pienellä kirjoitettu teksti ratkaisee:</p>
      <ul>
        <li><strong>Kokeilu, ei ilmaisversio.</strong> Työkalu toimii pari viikkoa, ja sitten pitää maksaa.</li>
        <li><strong>Ilmaisversio ilman sitä, mitä haet.</strong> WhatsApp tai tekoäly kuuluu vasta maksulliseen tilaukseen.</li>
        <li><strong>Metan maksut erikseen.</strong> Jos työkalu käyttää virallista API:a, Meta veloittaa viesteistä, vaikka itse alusta olisi edullinen.</li>
      </ul>
      <p>Vaihtoehdot kannattaa käydä läpi huolella, koska asiakkaasi ovat jo WhatsAppissa. Traficomin kuluttajatutkimuksessa, johon vastasi joulukuussa 2023 yhteensä 2 162 täysi-ikäistä, <strong>81 % kuluttajista kertoi käyttävänsä WhatsAppia viikoittain viestien lähettämiseen</strong> ja 34 % puheluihin.</p>
    </>,
  },
  {
    id: "vertailu",
    q: "Mitkä WhatsApp-chatbotit ovat oikeasti ilmaisia?",
    answer: "Vertasimme kahdeksaa vaihtoehtoa. Wapzenissa tekoälychat omassa WhatsApp-numerossa on nyt ilmainen ilman kuukausimaksua. Tidio antaa ilmaiseksi 50 tekoälykeskustelua yhteensä ja Jotform 100 keskustelua kuukaudessa. ManyChatin ja Typebotin ilmaisversioissa ei ole WhatsAppia, eikä Superchatin ilmaisversiossa ole tekoälyagenttia.",
    body: <>
      <RowTable firstColumn="Työkalu" highlight="Wapzen" caption="WhatsApp-chatbotit: mikä on ilmaista, WhatsApp, tekoäly ja hinta" columns={["Mikä on ilmaista", "WhatsApp omassa numerossa", "Tekoäly", "Maksullinen alkaen"]} rows={options} />
      <Note>Hinnat on luettu kunkin palveluntarjoajan hinnoittelusivulta 11.11.2026. Poikkeus on ManyChat, jonka sivua ei voi lukea automaattisesti: tiedot ovat Kanalin yhteenvedosta, joka perustuu ManyChatin sivuun 4.11.2026. Tidion sivu ei kerro selvästi, ovatko luvut kuukausi- vai vuosilaskutuksen hintoja. Dollarihinnoissa ei ole mukana valuuttamuunnosta eikä arvonlisäveroa. Tarkista hinnat palveluntarjoajan sivulta ennen päätöstä.</Note>
    </>,
  },
  {
    id: "paras",
    q: "Mikä on paras WhatsApp-chatbot pienyritykselle?",
    answer: "Se riippuu tarpeesta. Jos haluat tekoälyn vastaamaan omassa numerossasi ilman maksuja, valitse Wapzen. Jos haluat Metan oman tuotteen, katso Meta Business Agent. Jos tarvitset tiimin yhteisen postilaatikon ja virallisen API:n, katso Superchat. Jos tärkein kanavasi on verkkosivujen chat, katso Tidio tai suomalaislähtöinen Leadoo. Wapzen on oma tuotteemme, joten näytämme hinnat ja lähteet emmekä paremmuusjärjestystä.",
    body: <>
      <p>Valitse oman tilanteesi mukaan:</p>
      <Choose locale="fi" items={[
        { name: "Wapzen", points: ["Haluat tekoälyn vastaamaan asiakkaille ilman kuukausimaksua", "Käytät tavallista WhatsAppia tai WhatsApp Business -sovellusta", "Haluat, että tekoäly vastaa myös WhatsApp-puheluihin"] },
        { name: "Meta Business Agent", points: ["Käytät jo WhatsApp Business -sovellusta ja agentti näkyy siinä", "Haluat Metan oman, virallisen tuotteen", "Sinulle riittää, että agentti oppii Facebook-sivustasi, aiemmista keskusteluista ja verkkosivuistasi"] },
        { name: "Superchat", points: ["Samaa numeroa hoitaa useampi työntekijä", "Tarvitset virallisen API:n ja hyväksytyt viestipohjat", "Kuukausimaksu ja 12 kuukauden sopimus sopivat sinulle"] },
        { name: "Tidio tai Leadoo", points: ["Tärkein kanavasi on verkkosivujen chat", "Haluat kerätä liidejä sivuston kävijöistä", "WhatsApp on sinulle lisäkanava, ei pääkanava"] },
      ]} />
      <p>Jos mietit ensin, mitä WhatsApp Business itsessään maksaa, lue <Link href="/fi/blog/onko-whatsapp-business-ilmainen">Onko WhatsApp Business ilmainen?</Link> Jos sinulle riittää kiinteä viesti, katso <Link href="/fi/blog/whatsapp-automaattinen-vastaus">WhatsAppin automaattinen vastaus</Link>.</p>
    </>,
  },
  {
    id: "ilmainen",
    q: "Onko Wapzen oikeasti ilmainen?",
    answer: "Kyllä, tällä hetkellä kaikki on ilmaista: ei kuukausimaksua, ei maksua viesteistä eikä luottokorttia. Keskusteluja ja yhteystietoja voi olla rajattomasti, eikä vastauksilla ole kuukausirajaa. Tämä koskee tekoälychattia, tilausten vastaanottoa, tietopankkia ja ääniagenttia. Kyse ei ole määräaikaisesta kokeilusta.",
    body: <>
      <Comparison caption="Mikä Wapzenissa on ilmaista" columns={["Wapzenissa"]} rows={included} />
      <p><strong>Miksi sanomme ”tällä hetkellä”.</strong> Maksullista tilausta ei nyt ole, mutta emme lupaa, että palvelu on ilmainen ikuisesti.</p>
    </>,
  },
  {
    id: "hinta",
    q: "Paljonko WhatsApp-chatbot maksaa, kun se ei ole ilmainen?",
    answer: "Esimerkki: yritys lähettää 3 000 vastausta kuukaudessa. Metan virallisessa API:ssa ensimmäiset 1 000 vastausta ovat ilmaisia ja loput maksavat suomalaisiin numeroihin noin 0,0142 € kappale, eli 28,40 € kuukaudessa. Päälle tulee alustan kuukausimaksu, esimerkiksi 149 € Superchatin Professional-tilauksesta. Wapzenissa sama maksaa 0 €, koska se ei käytä Metan API:a.",
    body: <>
      <p>Kauppa käy 20 keskustelua päivässä ja lähettää jokaisessa viisi vastausta: <strong>3 000 vastausta kuukaudessa</strong>.</p>
      <ul>
        <li><strong>Metan maksut virallisessa API:ssa:</strong> 1 000 ilmaisen vastauksen jälkeen 2 000 × 0,0142 € = <strong>28,40 € kuukaudessa</strong>.</li>
        <li><strong>Alusta, jossa on tekoälyagentti:</strong> Superchat Professional maksaa 149 € kuukaudessa. Jos Metan maksut laskutetaan sen päälle, yhteensä tulee <strong>noin 177 € kuukaudessa</strong> eli noin 2 129 € vuodessa.</li>
        <li><strong>ManyChat Pro:</strong> <strong>39 $ kuukaudessa ja Metan maksut</strong>.</li>
        <li><strong>Wapzen:</strong> <strong>0 €</strong>.</li>
      </ul>
      <Note>Hinnat ilman arvonlisäveroa. Suomi kuuluu Metan hinnastossa ryhmään Rest of Western Europe. Eurohinnat ovat Metan 1.10.2026 voimaan tulleesta hinnastosta, ja luimme ne kolmannen osapuolen taulukosta, joka toistaa hinnaston. Meta tarkistaa hinnat neljännesvuosittain. Koko hintakartta on artikkelissa <Link href="/fi/blog/onko-whatsapp-business-ilmainen">Onko WhatsApp Business ilmainen?</Link></Note>
      <p>Maksaminen kannattaa, kun tarvitset hyväksyttyjä viestipohjia, suuria lähetyksiä, monta työntekijää samaan numeroon tai Metan virallisen kanavan. Tärkeintä on tietää, mistä maksat.</p>
    </>,
  },
  {
    id: "luominen",
    q: "Miten luon ilmaisen WhatsApp-chatbotin vaihe vaiheelta?",
    answer: "Wapzenissa: luo ilmainen tili, kirjoita ohjeet valmiiksi, yhdistä numerosi yhdistämiskoodilla tai QR-koodilla, anna agentille nimi, liitä ohjeet ja lataa yrityksesi tiedot. Koodausta, luottokorttia tai Metan API-avainta ei tarvita. Testaa lopuksi toisesta numerosta asiakkaidesi oikeilla kysymyksillä.",
    body: <>
      <ol>
        <li><strong>Luo ilmainen tili.</strong> Korttia tai API-avainta ei kysytä. Hallintapaneeli on englanniksi, mutta agentti vastaa suomeksi.</li>
        <li><strong>Kirjoita ohjeet valmiiksi.</strong> Muokkaa alla olevaa mallia ennen kuin yhdistät numeron. Agentti alkaa vastata heti, kun numero on yhdistetty, ja vastaa yleisluontoisesti, kunnes saa ohjeesi.</li>
        <li><strong>Yhdistä numero.</strong> Valitse New chat agent ja kirjoita numerosi, niin saat 8-merkkisen koodin. Avaa puhelimen WhatsAppissa Linkitetyt laitteet › Linkitä laite, valitse linkitys puhelinnumerolla ja kirjoita koodi. Tietokoneella voit myös skannata QR-koodin.</li>
        <li><strong>Anna nimi ja liitä ohjeet.</strong> Tee tämä heti yhdistämisen jälkeen.</li>
        <li><strong>Lataa yrityksesi tiedot.</strong> Hinnasto, usein kysytyt kysymykset ja toimitusehdot käyvät tekstinä, PDF:nä tai Word-tiedostona. Skannattua PDF:ää agentti ei pysty lukemaan: käytä versiota, jonka tekstin voi maalata.</li>
        <li><strong>Ota käyttöön tarvitsemasi lisät.</strong> Tilausten vastaanotto (Take Order) ja agentin lähettämät tiedostot (Images &amp; Files) löytyvät agentin muokkausnäkymästä.</li>
        <li><strong>Testaa toisesta numerosta.</strong> Lähetä asiakkaidesi oikeita kysymyksiä, myös hankalia, ja hio ohjeita.</li>
      </ol>
      <p>Tämä malli on keksitylle kaupalle. Vaihda tilalle oman yrityksesi tiedot:</p>
      <pre>{prompt}</pre>
      <InlineCta title="Luo ilmainen WhatsApp-chatbot" body="Kaikki on nyt ilmaista. Metan API-avainta tai luottokorttia ei tarvita." label="Aloita ilmaiseksi" />
    </>,
  },
  {
    id: "suomeksi",
    q: "Vastaako tekoäly suomeksi?",
    answer: "Kyllä. Wapzenin agentti vastaa suomeksi, kun pyydät sitä ohjeissa, ja voit pyytää sitä vaihtamaan ruotsiin tai englantiin asiakkaan kielen mukaan. Vastaukset perustuvat yrityksesi ohjeisiin ja tiedostoihin. Agentit käyttävät OpenAI:n GPT-malleja, jotka sisältyvät palveluun, joten omaa OpenAI-tiliä ei tarvita.",
    body: <>
      <ul>
        <li><strong>Kirjoita kieli ohjeisiin.</strong> Wapzen ei lisää kieliohjetta puolestasi. Yllä olevassa mallissa se on mukana.</li>
        <li><strong>Sinuttelu vai teitittely.</strong> Kerro ohjeissa, kumpaa agentti käyttää.</li>
        <li><strong>Testaa puhekielellä.</strong> Kokeile asiakkaidesi tyypillisiä viestejä, myös puhekielisiä, ja lisää ohjeisiin se, mitä agentti ei osannut.</li>
      </ul>
      <ChatExample
        business="Kukkakauppa Demo"
        labels={{ subtitle: "WhatsApp · tekoälyagentti", agent: "Agentti: ", patient: "Asiakas: " }}
        turns={[
          { from: "patient", text: "Moi! Saako teiltä kimpun kotiinkuljetuksella vielä tänään Hervantaan?" },
          { from: "agent", text: "Hei! Olen Kukkakauppa Demon virtuaalinen avustaja. Kyllä onnistuu: kotiinkuljetus Tampereella maksaa 9 € ja ehtii tänään, kun tilaus tulee ennen klo 14. Millaisen kimpun haluaisit?" },
          { from: "patient", text: "Se 35 euron kauden kimppu. Korttiin teksti: Onnea, Liisa!" },
          { from: "agent", text: "Selvä. Mihin osoitteeseen kimppu toimitetaan?" },
          { from: "patient", text: "Esimerkkikatu 5 A 12, 33720 Tampere." },
          { from: "agent", text: "Vahvistan: kauden kimppu 35 € + kotiinkuljetus 9 € = 44 €, toimitus tänään osoitteeseen Esimerkkikatu 5 A 12, korttiin ”Onnea, Liisa!”. Onko tämä oikein?" },
          { from: "patient", text: "On!" },
          { from: "agent", text: "Tilaus on kirjattu. Voit maksaa MobilePaylla ja lähettää kuitin tähän. Henkilökunta tarkistaa maksun ennen toimitusta." },
        ]}
        caption="Keksityn kaupan esimerkkikeskustelu. Tiedot tulisivat kaupan antamista ohjeista ja tiedostoista."
        points={[
          { title: "Vastaa heti", body: "Asiakas saa vastauksen, vaikka olisit sitomassa kimppua tai kassalla." },
          { title: "Käyttää sinun tietojasi", body: "Hinta ja toimitusehdot tulevat ohjeista ja tiedostoista, jotka olet antanut." },
          { title: "Varmistaa ennen tallennusta", body: "Agentti toistaa tilauksen ja summan, ja asiakas vahvistaa." },
          { title: "Ei vahvista maksua", body: "Agentti ottaa kuitin vastaan, mutta maksun tarkistaa henkilökunta." },
        ]}
      />
    </>,
  },
  {
    id: "myynti",
    q: "Miten ilmainen chatbot auttaa myymään enemmän?",
    answer: "Se vastaa heti myös iltaisin, viikonloppuisin ja kiireaikoina, jolloin moni asiakas muuten ehtii kysyä kilpailijalta. Se kirjaa tilaukset ja yhteydenottopyynnöt sillä aikaa, kun teet muuta työtä. Koska kuukausimaksua tai viestimaksuja ei ole, säästynyt raha voi mennä vaikka mainontaan.",
    body: <>
      <ul>
        <li><strong>Vastaat ensimmäisenä.</strong> Harvard Business Review’n julkaisemassa tutkimuksessa yhdysvaltalaisyritykset, jotka ottivat yhteyttä tunnin sisällä, saivat liidin kelpuutettua lähes seitsemän kertaa todennäköisemmin kuin hitaammat. Tutkimus on vuodelta 2011 eikä Suomesta, mutta ajatus pätee: asiakas, joka kysyy sinulta, kysyy usein muiltakin.</li>
        <li><strong>Keskustelusta tulee tilaus.</strong> Take Order -työkalulla agentti kirjaa tilauksen, varmistaa sen asiakkaalta ja tallentaa sen hallintapaneeliin.</li>
        <li><strong>Lisää reittejä WhatsAppiin.</strong> Ilmaisilla työkaluilla, <Link href="/tools/whatsapp-link-generator">linkkigeneraattorilla</Link> ja <Link href="/tools/whatsapp-qr-code-generator">QR-koodigeneraattorilla</Link>, saat WhatsAppin Instagramiin, kassalle ja pakkauksiin. Työkalut ovat englanniksi.</li>
      </ul>
    </>,
  },
  {
    id: "numero",
    q: "Toimiiko chatbot tavallisessa WhatsAppissa ja WhatsApp Businessissa? Tarvitaanko API?",
    answer: "Toimii molemmissa, eikä virallista API:a tarvita. Wapzen yhdistää numerosi linkitettynä laitteena, samaan tapaan kuin WhatsApp Web: numero ei vaihdu, keskustelut säilyvät ja voit käyttää puhelintasi kuten ennenkin. Koska Wapzen ei ole Metan virallinen alusta, vihreää merkkiä tai hyväksyttyjä viestipohjia ei ole.",
    body: <>
      <ul>
        <li><strong>Sama numero.</strong> Asiakkaat kirjoittavat sinne, minne ennenkin.</li>
        <li><strong>Tekoäly sisältyy.</strong> Omaa OpenAI-tiliä ei tarvita.</li>
        <li><strong>Ei viestimaksuja.</strong> Meta veloittaa viesteistä API:ssa, eikä Wapzen käytä API:a.</li>
        <li><strong>Huomio henkilökohtaisessa numerossa.</strong> Agentti vastaa kaikkiin kahdenkeskisiin keskusteluihin, myös ystäville ja perheelle. Kytke tekoäly pois näiltä yhteystiedoilta hallintapaneelissa.</li>
      </ul>
      <p>Wapzen on itsenäinen tuote: se ei kuulu Metalle eikä WhatsAppille.</p>
    </>,
  },
  {
    id: "media",
    q: "Ymmärtääkö chatbot ääniviestejä ja kuvia? Vastaako se puheluihin?",
    answer: "Kyllä. Wapzenin agentti litteroi ääniviestit ja lukee kuvat, ja nämä ovat uusissa agenteissa valmiiksi päällä. Se voi myös lähettää lataamiasi kuvia ja tiedostoja, kuten hinnaston. Ääniagentti vastaa WhatsApp-puheluihin. Se ei vastaa tavallisiin puhelinverkon puheluihin eikä siirrä puhelua ihmiselle.",
    body: <>
      <ul>
        <li><strong>Ääniviestit.</strong> Agentti vastaa niihin tekstillä.</li>
        <li><strong>Kuvat.</strong> Agentti näkee kuvan vain siinä viestissä, jossa se saapui. Se voi lukea maksukuitin, mutta se ei näe pankkitiliäsi: maksun tarkistat sinä.</li>
        <li><strong>Tiedostot.</strong> Images &amp; Files -kohdassa lataat kuvia, PDF-tiedostoja ja taulukoita ja kirjoitat, milloin kukin lähetetään. Testaa tämä ennen kuin luotat siihen.</li>
        <li><strong>Puhelut.</strong> Ennen jokaista vastausta on sekunnin tai parin tauko, ja jokainen ääniagentti puhuu yhtä kieltä.</li>
      </ul>
      <InlineCta href={voiceAccess} title="Vastaa myös niille, jotka soittavat" body="Ääniagentti on nyt myös ilmainen. Laita meille viesti WhatsAppissa, niin otamme sen käyttöön numerossasi." label="Kysy WhatsAppissa" />
    </>,
  },
  {
    id: "ihminen",
    q: "Mitä tapahtuu, kun asiakas haluaa puhua ihmisen kanssa?",
    answer: "Otat keskustelun itse hoitaaksesi. Jokaisessa keskustelussa on Wapzenin hallintapaneelissa tekoälykytkin: kun kytket sen pois, agentti lakkaa vastaamasta vain tälle asiakkaalle ja jatkaa muiden palvelemista. Kytkin ei mene pois päältä itsestään, kun vastaat, ja ohjeissa määrität, milloin agentti tarjoaa yhteyttä ihmiseen.",
    body: <>
      <p>Agentti ei ilmoita sinulle, kun joku pyytää ihmistä. Sovi, että joku katsoo hallintapaneelia päivän mittaan, tai pyydä ohjeissa agenttia antamaan asiakaspalvelijan numero. Jos haluat pysäyttää kaiken kerralla, keskeytä agentti.</p>
    </>,
  },
  {
    id: "tietosuoja",
    q: "Mitä GDPR ja EU:n tekoälyasetus vaativat chatbotilta?",
    answer: "Nimet, puhelinnumerot ja tilaukset ovat henkilötietoja, joten tarvitset käsittelylle perusteen ja sinun on kerrottava siitä tietosuojaselosteessasi. EU:n tekoälyasetuksen 50 artikla edellyttää 2.8.2026 alkaen, että ihmiselle kerrotaan hänen asioivan tekoälyn kanssa. Käytännössä: pyydä vain tarpeelliset tiedot, kerro että vastaaja on virtuaalinen avustaja, äläkä pyydä terveystietoja, henkilötunnusta tai korttitietoja chatissa.",
    body: <>
      <p>Tämä on yleistä tietoa, ei oikeudellista neuvontaa:</p>
      <ul>
        <li><strong>Virtuaalinen avustaja.</strong> Wapzen ei lisää tätä ilmoitusta itse, joten kirjoita se ohjeisiin, kuten mallissa.</li>
        <li><strong>Missä tiedot sijaitsevat.</strong> Wapzenin päätietokanta on Singaporessa, palvelimet Singaporessa ja Saksassa ja agentille lataamasi tiedostot Soulissa. Tekoälypalveluntarjoajat, kuten OpenAI, voivat käsitellä viestejä Yhdysvalloissa. Tietoja siis siirtyy EU:n ja ETA:n ulkopuolelle. Wapzen ei julkaise valmista henkilötietojen käsittelysopimusta: jos tarvitset sellaisen, ota meihin yhteyttä ennen kuin yhdistät numeron. Lisätietoja on englanninkielisessä <Link href="/privacy">tietosuojakäytännössä</Link>.</li>
        <li><strong>Ajantasaiset tiedot.</strong> Pidä hinnat ja ehdot ajan tasalla, koska asiakas luottaa siihen, mitä agentti kertoo.</li>
      </ul>
    </>,
  },
  {
    id: "ei-tee",
    q: "Mitä ilmainen chatbot ei tee?",
    answer: "Wapzen ei vahvista maksuja, sillä ei ole omaa ajanvarauskalenteria, se ei aloita keskusteluja itse eikä se käytä Metan virallista API:a, joten vihreää merkkiä tai hyväksyttyjä viestipohjia ei ole. Siinä ei ole asiakaspalvelujonoa eikä myyntiputkea. Ryhmissä se vastaa vain, kun olet kytkenyt tekoälyn päälle kyseisessä ryhmässä ja joku mainitsee agentin tai vastaa sen viestiin.",
    body: <>
      <Comparison caption="Kenelle Wapzenin kaltainen ilmainen chatbot sopii ja kenelle ei" columns={["Sopiiko?", "Miksi"]} rows={fit} />
      <ul>
        <li><strong>Ajanvaraus vain integraatiolla.</strong> Agentti kirjaa varauspyynnön. Jos haluat varata oikean ajan, yhdistä oma järjestelmäsi API-työkalulla, jos järjestelmäsi tarjoaa rajapinnan.</li>
        <li><strong>Tarkista alussa.</strong> Lue keskustelut ensimmäisinä päivinä ja lisää ohjeisiin se, mitä agentti ei osannut.</li>
      </ul>
    </>,
  },
];

export default function IlmainenWhatsAppChatbotPage() {
  return <QaPost
    href={href}
    heading={<>Ilmainen WhatsApp-chatbot yritykselle.<br /><span>Kahdeksan vaihtoehtoa hintoineen ja lähteineen.</span></>}
    lead="Moni ”ilmainen” WhatsApp-chatbot on kahden viikon kokeilu, versio ilman WhatsAppia tai valikko ilman tekoälyä. Käymme kysymys kerrallaan läpi, mikä on oikeasti ilmaista, mitä muu maksaa, minkä valitset ja miten luot oman chatbotin vaihe vaiheelta."
    verdict={{
      title: "Lyhyt vastaus",
      body: <>Kyllä, ilmainen tekoälychatbot WhatsAppiin on olemassa. <strong>Wapzen</strong> toimii numerossa, jota jo käytät, tavallisessa WhatsAppissa tai WhatsApp Businessissa: se vastaa sekunneissa yrityksesi tiedoilla suomeksi, ymmärtää ääniviestit ja kuvat, kirjaa tilaukset ja vastaa WhatsApp-puheluihin ääniagentilla. <strong>Kaikki on nyt ilmaista, keskusteluja voi olla rajattomasti eikä Metan API-avainta tarvita.</strong> Wapzen on oma tuotteemme eikä Metan virallinen tuote: jos haluat virallisen reitin, katso Meta Business Agent.</>,
    }}
    facts={[["Hinta", "Ilmainen nyt"], ["Metan API-avain", "Ei tarvita"], ["Keskustelut", "Rajattomasti"], ["Kieli", "Vastaa suomeksi"]]}
    indexTitle="Tämän oppaan 13 kysymystä"
    answerLabel="Lyhyt vastaus"
    questions={questions}
    sources={sources}
    cta={{ heading: <>Chatbot, joka vastaa kellon ympäri.<br /><span>Ilmainen nyt, ilman Metan API:a.</span></>, body: "Luo tili, yhdistä numerosi ja opeta agentille yrityksesi tiedot. Luottokorttia ei tarvita, eikä viesteistä veloiteta." }}
  />;
}
