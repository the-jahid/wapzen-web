import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Samples } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Searches (Google, YouTube and DuckDuckGo autocomplete with gl=fi, 2026-11-11, see
// docs/seo-research.md, "Finland posts"): "whatsapp ajastettu viesti" (20, 2/3), "whatsapp
// business automaattinen vastaus" (19), "whatsapp automaattinen vastaus" (10), "automaattinen
// vastaus whatsapp" (10), "whatsapp automaattiviesti" (10), "whatsapp poissaoloviesti" (10).
// A search for the main phrase returned no Finnish guide at all, only English vendor posts.
// WhatsApp's help pages are not translated into Finnish, so menu names are given in Finnish
// with the English label beside them and a note that they vary: only "Linkitetyt laitteet"
// was seen in WhatsApp's own Finnish text. Greeting-message facts match
// /blog/whatsapp-business-greeting-message. Scheduled messages: WABetaInfo, 22 Oct 2026 (iOS
// beta, no public date); recheck before editing. Quick-reply shortcuts are written without a
// leading slash on purpose: Google reads "/hinnat" in page data as a path and reports a 404.
// Copy rules as in the other Finnish posts: free right now, no caps mentioned, no ban wording.
const href = "/fi/blog/whatsapp-automaattinen-vastaus";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "fi", article: { publishedTime: post.published, modifiedTime: post.updated } });

const tools = [
  ["Tervehdysviesti", "Kun asiakas kirjoittaa ensimmäisen kerran tai 14 päivän tauon jälkeen", "Tervetulotoivotus ja ohjeet"],
  ["Poissaoloviesti", "Aina, valitsemanasi aikana tai aukioloaikojen ulkopuolella", "Illat, viikonloput ja lomat"],
  ["Pikavastaus", "Kun valitset sen itse kirjoittamalla vinoviivan ja lyhenteen", "Toistuvat kysymykset"],
];

const greetings = [
  { title: "Tervehdys: yleinen", text: "Hei, ja kiitos viestistäsi! Olemme [Yrityksen nimi]. Vastaamme yleensä [aika] kuluessa arkisin klo 9–17. Kerro, miten voimme auttaa." },
  { title: "Tervehdys: kampaamo tai kauneushoitola", text: "Hei! Tervetuloa [Kampaamon nimi] WhatsAppiin. Ajan voit varata osoitteessa [linkki] tai kertomalla tässä toivomasi palvelun ja ajankohdan. Vastaamme asiakkaiden välissä." },
  { title: "Tervehdys: ravintola", text: "Moi! Kiitos viestistä, [Ravintolan nimi] tässä. Pöytävarausta varten kerro päivä, kellonaika ja henkilömäärä. Lounaslista: [linkki]." },
  { title: "Tervehdys: verkkokauppa", text: "Hei! Kiitos, että otit yhteyttä [Kaupan nimi] asiakaspalveluun. Jos asiasi koskee tilausta, kerro tilausnumero, niin pääsemme heti asiaan." },
];

const away = [
  { title: "Poissa: aukioloaikojen ulkopuolella", text: "Kiitos viestistäsi! Olemme juuri nyt kiinni. Palvelemme arkisin klo 9–17 ja vastaamme sinulle seuraavana arkipäivänä." },
  { title: "Poissa: työmaalla tai asiakkaalla", text: "Hei! Olen juuri työmaalla enkä pääse vastaamaan heti. Kerro lyhyesti, mitä työ koskee ja missä kohde sijaitsee, niin palaan asiaan tänään klo 16 jälkeen." },
  { title: "Poissa: loma", text: "Hei! [Yrityksen nimi] on lomalla [pvm]–[pvm]. Luemme viestit palattuamme ja vastaamme saapumisjärjestyksessä. Kiireellisissä asioissa: [yhteystieto]." },
  { title: "Poissa: pyhäpäivä", text: "Hyvää juhannusta! Olemme kiinni [pvm]–[pvm] ja palaamme viesteihin heti sen jälkeen." },
  { title: "Poissa: autokorjaamo", text: "Kiitos viestistä! Korjaamo on auki ma–pe klo 7.30–16.30. Jos asia koskee huoltoa, kerro rekisterinumero ja toivottu ajankohta, niin vastaamme aamulla." },
  { title: "Poissa: mökkivuokraus tai majoitus", text: "Hei! Kiitos kyselystä. Vastaamme varauskyselyihin päivittäin klo 8–20. Kerro toivomasi päivät ja henkilömäärä, niin tarkistamme saatavuuden. Saapumisohjeet: [linkki]." },
];

const quick = [
  { title: "Pikavastaus: hinnat", text: "Hinnastomme löytyy täältä: [linkki]. Kerro, mistä palvelusta olet kiinnostunut, niin kerron tarkemman hinnan." },
  { title: "Pikavastaus: osoite ja aukiolo", text: "Löydät meidät osoitteesta [osoite]. Olemme auki ma–pe klo 9–17 ja la klo 10–14." },
  { title: "Pikavastaus: maksutavat", text: "Meillä voi maksaa kortilla, MobilePaylla ja laskulla. Yritysasiakkaille lähetämme verkkolaskun." },
  { title: "Pikavastaus: tarjouspyyntö", text: "Kiitos tarjouspyynnöstä! Jotta voin laskea hinnan, tarvitsen: 1) kohteen osoitteen, 2) työn kuvauksen ja 3) muutaman kuvan. Tarjous tulee [aika] kuluessa. Erittelemme laskulle työn osuuden kotitalousvähennystä varten." },
  { title: "Pikavastaus: kiitos ja palaute", text: "Kiitos käynnistä! Jos olit tyytyväinen, arvostelu Googlessa auttaa pientä yritystä paljon: [linkki]." },
];

const versus = [
  ["Mitä se lähettää", "Saman tekstin kaikille", "Vastauksen juuri siihen, mitä asiakas kysyi"],
  ["Milloin", "Ensimmäiseen viestiin tai kun olet poissa", "Kun asiakas kirjoittaa, myös iltaisin ja viikonloppuisin"],
  ["Hinnat, aukiolo ja saatavuus", "Vain jos kirjoitit ne viestiin", "Vastaa ohjeidesi ja tiedostojesi pohjalta"],
  ["Tilauksen kirjaaminen", "Ei", "Kyllä, Take Order -työkalulla"],
  ["Ääniviestit ja kuvat", "Ei", "Litteroi ääniviestit ja lukee kuvat"],
  ["Hinta", "Ilmainen WhatsApp Business -sovelluksessa", "Ilmainen Wapzenissa nyt"],
];

const prompt = `Olet Autohuolto Demon virtuaalinen avustaja. Korjaamo on Oulussa.
Kerro ensimmäisessä viestissä, että olet virtuaalinen avustaja.
Vastaa suomeksi lyhyesti ja kysy yksi asia kerrallaan.
Käytä hinnoissa ja aukioloajoissa vain antamiamme tietoja. Jos et tiedä vastausta, sano se.
Et näe kalenteria etkä vahvista aikoja. Kirjaa varauspyyntö: palvelu, toivottu päivä ja kellonaika sekä rekisterinumero. Kerro, että henkilökunta vahvistaa ajan viestillä aukioloaikana.
Älä arvioi vikoja äläkä lupaa korjauksen hintaa näkemättä autoa.
Korjaamo on auki ma–pe klo 7.30–16.30.`;

const sources = [
  { label: "WhatsAppin ohjekeskus: tervehdysviestien käyttö (englanniksi)", href: "https://faq.whatsapp.com/501866148528310" },
  { label: "WhatsAppin ohjekeskus: laitteen linkittäminen (englanniksi)", href: "https://faq.whatsapp.com/1317564962315842" },
  { label: "WABetaInfo: ajastetut viestit iOS:n beetaversiossa (22.10.2026)", href: "https://wabetainfo.com/whatsapp-is-rolling-out-scheduled-messages-on-ios-beta/" },
  { label: "WhatsApp Business: Meta Business Agent sovelluksessa", href: "https://whatsappbusiness.com/products/business-app-ai-agent/" },
  { label: "Traficom: Kuluttajien nettikäytössä jyräävät WhatsApp, Yle Areena ja Netflix (10.7.2024)", href: "https://traficom.fi/fi/uutiset/kuluttajien-nettikaytossa-jyraavat-whatsapp-yle-areena-ja-netflix" },
  { label: "EUR-Lex: tekoälyasetus (EU) 2024/1689, 50 artikla", href: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj" },
];

const questions = [
  {
    id: "voiko",
    q: "Voiko WhatsAppiin asettaa automaattisen vastauksen?",
    answer: "Kyllä, ilmaisessa WhatsApp Business -sovelluksessa. Siinä on kolme työkalua: tervehdysviesti uusille asiakkaille, poissaoloviesti silloin kun et ole paikalla, ja pikavastaukset usein toistuviin kysymyksiin. Tavallisessa WhatsAppissa automaattista vastausta ei ole. Jos haluat, että vastaus vaihtelee kysymyksen mukaan, tarvitset tekoälyagentin.",
    body: <>
      <Comparison caption="WhatsApp Businessin kolme automaattista viestityökalua" columns={["Milloin lähtee", "Mihin sopii"]} rows={tools} />
      <p>Nopea vastaus kannattaa, koska WhatsApp on suomalaisten arkikanava: Traficomin kuluttajatutkimuksessa (joulukuu 2023, 2 162 täysi-ikäistä vastaajaa) 81 % kuluttajista käytti WhatsAppia viikoittain viestien lähettämiseen.</p>
      <p>Jos sinulla ei vielä ole yrityssovellusta, lue ensin <Link href="/fi/blog/onko-whatsapp-business-ilmainen">Onko WhatsApp Business ilmainen?</Link></p>
    </>,
  },
  {
    id: "poissaoloviesti",
    q: "Miten WhatsApp Businessin poissaoloviesti asetetaan?",
    answer: "Avaa WhatsApp Business, siirry työkaluihin ja valitse poissaoloviesti. Kytke se päälle, kirjoita viesti ja valitse aikataulu: aina, itse määrittämänäsi aikana tai aukioloaikojen ulkopuolella. Valitse lopuksi vastaanottajat ja tallenna. Viimeinen aikatauluvaihtoehto näkyy vasta, kun olet lisännyt aukioloajat yritysprofiiliin.",
    body: <>
      <ol>
        <li><strong>Avaa työkalut.</strong> Siirry WhatsApp Businessissa Työkalut-välilehdelle (Tools).</li>
        <li><strong>Valitse Poissaoloviesti</strong> (Away message) ja kytke se päälle.</li>
        <li><strong>Kirjoita viesti.</strong> Kerro, milloin vastaat ja mitä tietoja tarvitset. Malleja on alempana.</li>
        <li><strong>Valitse aikataulu.</strong> Vaihtoehdot ovat aina, mukautettu aikataulu ja aukioloaikojen ulkopuolella.</li>
        <li><strong>Valitse vastaanottajat ja tallenna.</strong></li>
      </ol>
      <Note>WhatsAppin ohjesivuja ei ole käännetty suomeksi, ja valikkojen nimet voivat vaihdella sovelluksen version mukaan. Englanninkielisessä sovelluksessa polku on Tools › Away message.</Note>
    </>,
  },
  {
    id: "tervehdysviesti",
    q: "Miten tervehdysviesti asetetaan?",
    answer: "Valitse WhatsApp Businessin työkaluista tervehdysviesti, kytke se päälle, muokkaa teksti, valitse vastaanottajat ja tallenna. Viesti lähtee automaattisesti, kun asiakas kirjoittaa sinulle ensimmäisen kerran tai ensimmäisen kerran 14 päivän hiljaisuuden jälkeen. Viimeisten 14 päivän aikana kirjoittanut asiakas ei saa sitä uudelleen.",
    body: <>
      <ol>
        <li><strong>Avaa Työkalut-välilehti</strong> ja valitse Tervehdysviesti (Greeting message).</li>
        <li><strong>Kytke päälle</strong> tervehdysviestin lähetys.</li>
        <li><strong>Muokkaa viesti</strong> ja hyväksy se.</li>
        <li><strong>Valitse vastaanottajat</strong> (Recipients).</li>
        <li><strong>Tallenna.</strong></li>
      </ol>
      <p>Testaa viesti numerosta, josta ei ole kirjoitettu yrityksellesi viimeisten 14 päivän aikana. Jos Meta Business Agent on yhdistetty sovellukseen, WhatsApp kytkee tervehdysviestin pois.</p>
    </>,
  },
  {
    id: "pikavastaukset",
    q: "Mitä pikavastaukset ovat ja miten niitä käytetään?",
    answer: "Pikavastaus on tallennettu viesti, jonka lisäät keskusteluun kirjoittamalla vinoviivan ja valitsemalla lyhenteen. Se ei lähde itsestään, vaan säästää kirjoittamista: hinnasto, osoite, maksutavat ja tarjouspyynnön vastaus kannattaa tallentaa. Pikavastaukset luodaan WhatsApp Businessin työkaluissa.",
    body: <>
      <ul>
        <li><strong>Anna lyhenteelle selkeä nimi,</strong> esimerkiksi hinnat, osoite tai tarjous, jotta löydät sen nopeasti.</li>
        <li><strong>Pidä viestit ajan tasalla.</strong> Vanhentunut hinta pikavastauksessa on yhtä harmillinen kuin väärä hinta verkkosivulla.</li>
        <li><strong>Muokkaa ennen lähetystä.</strong> Pikavastaus tulee viestikenttään, joten voit lisätä asiakkaan nimen tai tarkentaa vastausta.</li>
      </ul>
    </>,
  },
  {
    id: "mallit",
    q: "Millainen on hyvä automaattinen vastaus? 15 valmista viestimallia",
    answer: "Hyvä automaattinen vastaus on lyhyt, kertoo milloin vastaat ja pyytää asiakkaalta tiedot, joita tarvitset jatkoon. Alla on 15 kopioitavaa mallia suomeksi: neljä tervehdysviestiä, kuusi poissaoloviestiä ja viisi pikavastausta. Vaihda hakasulkeissa olevat kohdat oman yrityksesi tietoihin.",
    body: <>
      <p><strong>Tervehdysviestit</strong></p>
      <Samples locale="fi" items={greetings} />
      <p><strong>Poissaoloviestit</strong></p>
      <Samples locale="fi" items={away} />
      <p><strong>Pikavastaukset</strong></p>
      <Samples locale="fi" items={quick} />
    </>,
  },
  {
    id: "ei-toimi",
    q: "Miksi automaattinen vastaus ei lähde?",
    answer: "Yleisimmät syyt: asiakas on kirjoittanut sinulle viimeisten 14 päivän aikana, joten tervehdysviesti ei lähde uudelleen; vastaanottaja-asetus rajaa hänet pois; poissaoloviestin aikataulu ei ole voimassa; tai puhelimessasi ei ole nettiyhteyttä. Tarkista myös, että tallensit muutokset ja että aukioloajat on asetettu yritysprofiiliin.",
    body: <>
      <ul>
        <li><strong>14 päivän sääntö.</strong> Tervehdysviesti lähtee vain ensimmäiseen viestiin tai 14 päivän tauon jälkeen.</li>
        <li><strong>Vastaanottajat.</strong> Katso, ettei asetus rajaa pois esimerkiksi tallennettuja yhteystietoja.</li>
        <li><strong>Aikataulu.</strong> Jos poissaoloviesti on ajastettu aukioloaikojen ulkopuolelle, se ei lähde aukioloaikana.</li>
        <li><strong>Nettiyhteys.</strong> Viestit lähtevät puhelimestasi, joten puhelimen pitää olla verkossa.</li>
        <li><strong>Meta Business Agent.</strong> Kun se on yhdistetty, WhatsApp kytkee tervehdysviestin pois.</li>
      </ul>
    </>,
  },
  {
    id: "ajastus",
    q: "Voiko WhatsApp-viestin ajastaa?",
    answer: "WhatsApp on testannut viestien ajastusta beetaversioissa vuonna 2026, mutta ei ole ilmoittanut, milloin ominaisuus tulee kaikille. WABetaInfon mukaan viestin voi beetassa ajastaa aikaisintaan 10 minuutin ja enintään kahden viikon päähän. Tarkista, löytyykö ajastus jo sovelluksestasi. Poissaoloviestin aikataulu on eri asia: se vastaa saapuviin viesteihin.",
    body: <>
      <p>WABetaInfo kertoi 22.10.2026, että ajastetut viestit olivat tulossa osalle iOS:n beetatestaajista. Ajastetut viestit näkyvät keskustelun tietonäkymässä omassa osiossaan.</p>
      <p>Wapzenin tekoälyagentti ei ajasta viestejä eikä aloita keskusteluja: se vastaa, kun asiakas kirjoittaa.</p>
    </>,
  },
  {
    id: "tekoaly-ero",
    q: "Mitä eroa on automaattisella vastauksella ja tekoälyvastauksella?",
    answer: "Automaattinen viesti lähettää kaikille saman tekstin. Tekoälyagentti lukee asiakkaan kysymyksen ja vastaa siihen yrityksesi ohjeiden ja tiedostojen pohjalta: se kertoo esimerkiksi hinnan, aukioloajan tai toimitusehdon ja voi kirjata tilauksen. Automaattinen viesti kertoo, että vastaat myöhemmin; tekoäly vastaa heti.",
    body: <>
      <Comparison caption="Automaattinen viesti ja tekoälyagentti rinnakkain" columns={["Automaattinen viesti", "Tekoälyagentti"]} rows={versus} />
      <ChatExample
        business="Autohuolto Demo"
        labels={{ subtitle: "WhatsApp · tekoälyagentti", agent: "Agentti: ", patient: "Asiakas: " }}
        turns={[
          { from: "patient", text: "Moi, paljonko maksaa renkaiden vaihto ja onko aikoja tällä viikolla?" },
          { from: "agent", text: "Hei! Olen Autohuolto Demon virtuaalinen avustaja. Renkaiden vaihto maksaa 35 €. Vapaita aikoja en näe, mutta kirjaan varauspyyntösi: mikä päivä ja kellonaika sopisi, ja mikä on auton rekisterinumero?" },
          { from: "patient", text: "Torstai aamu, ABC-123." },
          { from: "agent", text: "Kiitos! Kirjasin pyynnön: renkaiden vaihto torstaina aamulla, ABC-123. Henkilökunta vahvistaa ajan viestillä, kun korjaamo aukeaa klo 7.30." },
        ]}
        caption="Keksityn korjaamon esimerkkikeskustelu illalla klo 21.30. Poissaoloviesti olisi kertonut vain, että korjaamo on kiinni."
        points={[
          { title: "Vastaa kysymykseen", body: "Hinta tulee korjaamon antamasta hinnastosta." },
          { title: "Ei keksi vapaita aikoja", body: "Agentilla ei ole kalenteria, joten se kirjaa pyynnön ja ihminen vahvistaa ajan." },
          { title: "Kerää tarvittavat tiedot", body: "Aamulla henkilökunnan ei tarvitse kysyä rekisterinumeroa erikseen." },
        ]}
      />
    </>,
  },
  {
    id: "ilmainen-tekoaly",
    q: "Miten saan tekoälyn vastaamaan WhatsApp-viesteihin ilmaiseksi?",
    answer: "Wapzenissa kaikki on tällä hetkellä ilmaista. Luo tili, yhdistä numerosi yhdistämiskoodilla tai QR-koodilla, kirjoita agentille ohjeet ja lataa hinnasto ja usein kysytyt kysymykset. Agentti vastaa suomeksi tavallisessa WhatsAppissa tai WhatsApp Businessissa. Metan API-avainta tai luottokorttia ei tarvita, eikä viesteistä veloiteta.",
    body: <>
      <ol>
        <li><strong>Luo ilmainen tili.</strong> Hallintapaneeli on englanniksi, mutta agentti vastaa suomeksi.</li>
        <li><strong>Kirjoita ohjeet valmiiksi.</strong> Agentti alkaa vastata heti, kun numero on yhdistetty, joten muokkaa alla oleva malli ensin.</li>
        <li><strong>Yhdistä numero.</strong> Saat 8-merkkisen koodin, jonka kirjoitat puhelimen WhatsAppissa kohdassa Linkitetyt laitteet › Linkitä laite. Tietokoneella voit myös skannata QR-koodin.</li>
        <li><strong>Liitä ohjeet ja lataa tiedot.</strong> Hinnasto ja usein kysytyt kysymykset käyvät tekstinä, PDF:nä tai Word-tiedostona.</li>
        <li><strong>Testaa toisesta numerosta.</strong></li>
      </ol>
      <p>Malli keksitylle korjaamolle. Vaihda tilalle oman yrityksesi tiedot:</p>
      <pre>{prompt}</pre>
      <InlineCta title="Vaihda kiinteä viesti tekoälyyn" body="Kaikki on nyt ilmaista. Metan API-avainta tai luottokorttia ei tarvita." label="Aloita ilmaiseksi" />
      <p>Koko ohje ja kahdeksan työkalun vertailu ovat artikkelissa <Link href="/fi/blog/ilmainen-whatsapp-chatbot">Ilmainen WhatsApp-chatbot yritykselle</Link>.</p>
    </>,
  },
  {
    id: "yhdessa",
    q: "Voinko käyttää poissaoloviestiä ja tekoälyä yhtä aikaa?",
    answer: "Voit, mutta asiakas voi silloin saada kaksi vastausta: sovelluksen poissaoloviestin ja tekoälyagentin vastauksen. Selkeintä on kytkeä poissaoloviesti pois, kun agentti on käytössä, ja pitää tervehdysviesti lyhyenä tai kytkeä sekin pois. Pikavastauksia voit käyttää kuten ennenkin, kun vastaat itse.",
    body: <>
      <p>Kun haluat hoitaa jonkin keskustelun itse, kytke tekoäly pois kyseiseltä yhteystiedolta Wapzenin hallintapaneelissa. Agentti jatkaa muiden asiakkaiden palvelemista.</p>
    </>,
  },
  {
    id: "rajat",
    q: "Mitä tekoälyagentti ei tee, ja mitä tietosuojasta pitää muistaa?",
    answer: "Wapzenin agentti ei aloita keskusteluja itse, ei ajasta viestejä, ei vahvista maksuja eikä sillä ole omaa kalenteria. Se ei ole Metan virallinen tuote. Kerro ohjeissa, että vastaaja on virtuaalinen avustaja: EU:n tekoälyasetuksen 50 artikla edellyttää sitä 2.8.2026 alkaen. Wapzenissa tietoja käsitellään osin EU:n ulkopuolella.",
    body: <>
      <p>Tämä on yleistä tietoa, ei oikeudellista neuvontaa. Wapzenin päätietokanta on Singaporessa, palvelimet Singaporessa ja Saksassa ja agentille lataamasi tiedostot Soulissa, ja tekoälypalveluntarjoajat, kuten OpenAI, voivat käsitellä viestejä Yhdysvalloissa. Wapzen ei julkaise valmista henkilötietojen käsittelysopimusta. Lisätietoja on englanninkielisessä <Link href="/privacy">tietosuojakäytännössä</Link>.</p>
    </>,
  },
];

export default function WhatsAppAutomaattinenVastausPage() {
  return <QaPost
    href={href}
    heading={<>WhatsAppin automaattinen vastaus.<br /><span>Ohje, 15 viestimallia ja ilmainen tekoäly.</span></>}
    lead="Asiakas kirjoittaa illalla, ja sinä olet työmaalla, kassalla tai jo kotona. Käymme kysymys kerrallaan läpi, miten WhatsApp Businessin poissaoloviesti, tervehdysviesti ja pikavastaukset asetetaan, annamme 15 valmista viestimallia suomeksi ja näytämme, milloin tekoäly on kiinteää viestiä parempi."
    verdict={{
      title: "Lyhyt vastaus",
      body: <>Automaattisen vastauksen saat ilmaisessa <strong>WhatsApp Business -sovelluksessa</strong>: tervehdysviesti uusille asiakkaille, poissaoloviesti kun olet kiinni ja pikavastaukset toistuviin kysymyksiin. Ne lähettävät kaikille saman tekstin. Jos haluat, että asiakas saa vastauksen juuri omaan kysymykseensä, <strong>Wapzenin tekoälyagentti vastaa suomeksi kellon ympäri, ja kaikki on nyt ilmaista.</strong> Wapzen on oma tuotteemme eikä Metan virallinen tuote.</>,
    }}
    facts={[["Automaattiset viestit", "Ilmaisia"], ["Missä", "WhatsApp Business"], ["Viestimalleja", "15 suomeksi"], ["Tekoäly", "Ilmainen Wapzenissa nyt"]]}
    indexTitle="Tämän oppaan 11 kysymystä"
    answerLabel="Lyhyt vastaus"
    questions={questions}
    sources={sources}
    cta={{ heading: <>Vastaa silloinkin, kun et ehdi.<br /><span>Tekoäly WhatsAppiin, ilmainen nyt.</span></>, body: "Luo tili, yhdistä numerosi ja kerro agentille yrityksestäsi. Luottokorttia tai Metan API-avainta ei tarvita." }}
  />;
}
