import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Samples } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Searches (Google + YouTube autocomplete with hl=ms and hl=en, gl=my, and DuckDuckGo my-ms
// and my-en, 2026-11-15, docs/seo-blog-malaysia-research.mjs, docs/seo-research.md "Malaysia
// posts"; scores out of 6 sources): "auto reply whatsapp business" 139 (6/6), "cara buat auto
// reply whatsapp" 101 (6/6), "cara buat bot whatsapp" 91 (6/6), "cara buat chatbot whatsapp"
// 74 (6/6), "greeting message whatsapp business" 60, "quick reply whatsapp business" 60, "away
// message whatsapp business" 58, "auto reply whatsapp biasa" 44, "auto reply whatsapp
// personal" 39. The auto-reply cluster was the largest in the harvest. A search for "cara buat
// auto reply whatsapp business" returned Indonesian pages (Fortune IDN, detik, respond.io/id,
// SleekFlow id-id) and one machine-translated Malay page, so a Malaysian Malay guide is the gap.
// WhatsApp's menu names in Malay were not checked on a phone, so each step gives the English
// label too and a note says names vary. Quick-reply shortcuts are written without a leading
// slash on purpose: Google reads "/harga" in page data as a path and reports a 404.
// Copy rules: "mula percuma" / "percuma untuk bermula" because each account gets a free trial
// before a paid plan (FREE_TRIAL_REPLIES); never "percuma selamanya" or "tanpa had", no limit
// numbers and no ban wording. Says it isn't an official Meta product. Nothing about sending
// broadcasts: Wapzen doesn't send them.
const href = "/ms/blog/cara-buat-auto-reply-whatsapp";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "ms", article: { publishedTime: post.published, modifiedTime: post.updated } });

const tools = [
  ["Mesej sapaan (Greeting message)", "Bila pelanggan mesej kali pertama, atau selepas 14 hari tiada mesej", "Ucapan selamat datang dan maklumat asas"],
  ["Mesej tiada di tempat (Away message)", "Sentiasa, ikut jadual anda, atau di luar waktu operasi", "Malam, hujung minggu, cuti umum dan Hari Raya"],
  ["Balasan pantas (Quick replies)", "Hanya bila anda sendiri pilih dengan menaip garis miring dan kata pintas", "Soalan yang selalu berulang"],
];

const greetings = [
  { title: "Sapaan: umum", text: "Hai, terima kasih kerana menghubungi [Nama Kedai]! Kami biasanya membalas dalam masa [tempoh] pada waktu operasi, Isnin hingga Sabtu, 10 pagi hingga 7 malam. Boleh beritahu apa yang kami boleh bantu?" },
  { title: "Sapaan: kedai online", text: "Hai! Selamat datang ke [Nama Kedai]. Untuk tempahan, sila hantar nama produk, saiz atau warna, kuantiti dan poskod anda. Kami akan sahkan stok dan caj pos." },
  { title: "Sapaan: kedai makan atau katering", text: "Assalamualaikum dan hai! Terima kasih kerana mesej [Nama Kedai]. Menu hari ini: [pautan]. Untuk tempahan katering, sila nyatakan tarikh, jumlah pax dan lokasi." },
  { title: "Sapaan: salon atau spa", text: "Hai! Terima kasih kerana menghubungi [Nama Salon]. Untuk temujanji, beritahu servis yang anda mahu serta tarikh dan masa pilihan. Staf kami akan sahkan slot secepat mungkin." },
];

const away = [
  { title: "Tiada di tempat: luar waktu operasi", text: "Terima kasih atas mesej anda! Kami sudah tutup sekarang. Waktu operasi kami Isnin hingga Sabtu, 10 pagi hingga 7 malam. Kami akan membalas sebaik sahaja kami buka." },
  { title: "Tiada di tempat: rehat solat Jumaat", text: "Hai! Kami berehat untuk solat Jumaat dari 12.30 hingga 2.30 petang. Mesej anda akan dibalas selepas itu. Terima kasih kerana menunggu." },
  { title: "Tiada di tempat: Hari Raya", text: "Selamat Hari Raya Aidilfitri! [Nama Kedai] bercuti dari [tarikh] hingga [tarikh]. Semua mesej akan dibalas bila kami kembali. Maaf zahir dan batin." },
  { title: "Tiada di tempat: cuti umum", text: "Hai! Kami bercuti sempena [nama cuti] pada [tarikh]. Kami akan membalas mesej anda pada [tarikh]. Untuk hal kecemasan, hubungi [nombor]." },
  { title: "Tiada di tempat: sedang hantar barang", text: "Hai! Saya sedang dalam perjalanan menghantar tempahan dan tak dapat membalas sekarang. Sila tinggalkan pesanan, saya akan balas sebelum [masa]." },
  { title: "Tiada di tempat: temujanji", text: "Terima kasih kerana menghubungi kami! Untuk temujanji, sila hantar servis, tarikh dan masa pilihan anda. Staf kami akan sahkan slot dalam waktu operasi." },
];

const quick = [
  { title: "Balasan pantas: harga", text: "Ini senarai harga kami: [pautan]. Beritahu produk atau servis yang anda minat, saya akan bagi harga penuh termasuk caj pos." },
  { title: "Balasan pantas: cara bayaran", text: "Kami terima DuitNow QR, pindahan bank ke [nama bank, nombor akaun] dan tunai semasa ambil barang. Selepas bayar, sila hantar resit di sini." },
  { title: "Balasan pantas: caj pos", text: "Caj pos ke Semenanjung RM[x] dan ke Sabah atau Sarawak RM[y]. Penghantaran mengambil 2 hingga 4 hari bekerja selepas bayaran disahkan." },
  { title: "Balasan pantas: lokasi", text: "Kedai kami di [alamat]. Waze atau Google Maps: [pautan]. Kami buka Isnin hingga Sabtu, 10 pagi hingga 7 malam." },
  { title: "Balasan pantas: terima kasih", text: "Terima kasih kerana membeli dengan kami! Kalau anda puas hati, review di Google sangat membantu perniagaan kecil kami: [pautan]." },
];

const versus = [
  ["Apa yang dihantar", "Teks yang sama kepada semua orang", "Jawapan kepada soalan sebenar pelanggan"],
  ["Bila", "Mesej pertama, atau bila anda tiada", "Setiap kali pelanggan mesej, siang atau malam"],
  ["Harga, stok dan waktu operasi", "Hanya kalau anda tulis dalam mesej", "Dijawab daripada arahan dan fail yang anda beri"],
  ["Ambil tempahan", "Tidak", "Ya, dengan alat Take Order"],
  ["Nota suara dan gambar", "Tidak", "Memahami nota suara dan membaca gambar"],
  ["Bahasa", "Satu teks tetap", "Membalas dalam bahasa pelanggan, contohnya Bahasa Melayu atau English"],
  ["Kos", "Percuma dalam aplikasi WhatsApp Business", "Mula percuma di Wapzen, tanpa kad kredit"],
];

const ways = [
  ["Wapzen (AI pada nombor sedia ada)", "Pautkan nombor dengan kod, tulis arahan", "Tidak perlu", "Mula percuma, tiada caj Meta setiap mesej"],
  ["Platform WhatsApp Business API", "Daftar nombor pada API melalui vendor", "Ya", "Langganan bulanan, contohnya SleekFlow Pro RM 399 sebulan (bil tahunan), ditambah caj Meta"],
  ["Bina sendiri (n8n, kod, Cloud API)", "Buat aplikasi Meta, pelayan dan aliran sendiri", "Ya", "Kos pelayan dan model AI, ditambah caj Meta dan masa anda"],
];

const prompt = `Anda pembantu maya Kedai Kek Demo di Shah Alam.
Dalam mesej pertama, beritahu pelanggan bahawa anda pembantu maya.
Balas dalam bahasa yang pelanggan guna (Bahasa Melayu atau English). Balas ringkas dan tanya satu perkara pada satu masa.
Guna hanya harga dan maklumat yang kami beri. Kalau tak tahu, cakap begitu dan beritahu staf akan membalas.
Tempahan kek mesti dibuat sekurang-kurangnya 2 hari lebih awal. Untuk tempahan, dapatkan: jenis kek, saiz, tulisan atas kek, tarikh dan masa ambil atau hantar, alamat jika hantar, dan nama.
Ulang semula tempahan dengan jumlah harga sebelum simpan.
Jangan sahkan bayaran. Minta pelanggan hantar resit; staf akan semak.
Kedai buka Isnin hingga Sabtu, 10 pagi hingga 7 malam.`;

const sources = [
  { label: "Pusat Bantuan WhatsApp: cara menggunakan mesej sapaan (bahasa Inggeris)", href: "https://faq.whatsapp.com/501866148528310" },
  { label: "Pusat Bantuan WhatsApp: cara memautkan peranti (bahasa Inggeris)", href: "https://faq.whatsapp.com/1317564962315842" },
  { label: "Meta for Developers: harga WhatsApp Business Platform (berkuat kuasa 1 Okt 2026)", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "SleekFlow Malaysia: halaman harga (RM)", href: "https://sleekflow.io/en-my/pricing" },
  { label: "Sidley: perubahan penting undang-undang perlindungan data Malaysia (Ogos 2024)", href: "https://www.sidley.com/en/insights/newsupdates/2024/08/important-changes-to-malaysias-data-protection-laws" },
  { label: "Rajah & Tann Asia: tarikh kuat kuasa Akta Perlindungan Data Peribadi (Pindaan) 2024", href: "https://www.rajahtannasia.com/?p=161886" },
];

const questions = [
  {
    id: "boleh",
    q: "Boleh ke buat auto reply di WhatsApp?",
    answer: "Boleh, dalam aplikasi WhatsApp Business yang percuma. Ia ada tiga alat: mesej sapaan untuk pelanggan baharu, mesej tiada di tempat bila anda tak dapat membalas, dan balasan pantas untuk soalan yang selalu berulang. WhatsApp biasa (personal) tiada auto reply. Kalau anda mahu jawapan berbeza ikut soalan pelanggan, anda perlukan bot AI.",
    body: <>
      <Comparison caption="Tiga alat mesej automatik dalam WhatsApp Business" columns={["Bila dihantar", "Sesuai untuk"]} rows={tools} />
      <p>Ketiga-tiga alat ini percuma dan tidak perlukan WhatsApp Business API. Anda cuma perlu aplikasi WhatsApp Business di telefon, dan nombor yang anda guna untuk berniaga.</p>
    </>,
  },
  {
    id: "mesej-tiada",
    q: "Cara buat auto reply WhatsApp Business (mesej tiada di tempat), langkah demi langkah",
    answer: "Buka WhatsApp Business, pergi ke Tetapan › Alat perniagaan dan pilih mesej tiada di tempat (Away message). Hidupkan, tulis mesej anda dan pilih jadual: sentiasa, jadual sendiri, atau di luar waktu operasi. Kemudian pilih penerima dan simpan. Pilihan luar waktu operasi hanya muncul selepas anda isi waktu operasi dalam profil perniagaan.",
    body: <>
      <ol>
        <li><strong>Buka Alat perniagaan.</strong> Dalam WhatsApp Business, pergi ke Tetapan (Settings) › Alat perniagaan (Business tools).</li>
        <li><strong>Pilih mesej tiada di tempat</strong> (Away message) dan hidupkan suisnya.</li>
        <li><strong>Tulis mesej.</strong> Beritahu bila anda akan membalas dan maklumat apa yang pelanggan perlu hantar. Ada contoh di bawah.</li>
        <li><strong>Pilih jadual.</strong> Sentiasa hantar (Always send), jadual sendiri (Custom schedule) atau di luar waktu operasi (Outside of business hours).</li>
        <li><strong>Pilih penerima dan simpan.</strong> Semua orang, orang yang tiada dalam buku alamat, atau senarai yang anda pilih.</li>
      </ol>
      <Note>Nama menu dalam Bahasa Melayu mungkin berbeza sedikit ikut versi aplikasi dan telefon. Kalau tak jumpa, tukar bahasa telefon ke English sekejap: laluannya Settings › Business tools › Away message.</Note>
    </>,
  },
  {
    id: "mesej-sapaan",
    q: "Cara set greeting message (mesej sapaan) WhatsApp Business",
    answer: "Dalam Alat perniagaan, pilih mesej sapaan (Greeting message), hidupkan, ubah teks, pilih penerima dan simpan. Mesej ini dihantar secara automatik bila pelanggan mesej anda kali pertama, atau kali pertama selepas 14 hari tiada mesej. Pelanggan yang sudah mesej dalam 14 hari lepas tak akan menerimanya lagi.",
    body: <>
      <ol>
        <li><strong>Buka Tetapan › Alat perniagaan</strong> dan pilih mesej sapaan (Greeting message).</li>
        <li><strong>Hidupkan</strong> hantar mesej sapaan.</li>
        <li><strong>Ubah mesej</strong> dan tekan OK.</li>
        <li><strong>Pilih penerima</strong> (Recipients).</li>
        <li><strong>Simpan.</strong></li>
      </ol>
      <p>Untuk menguji, minta kawan mesej dari nombor yang belum pernah mesej perniagaan anda dalam 14 hari lepas. Kalau anda yang uji dari nombor sendiri yang baru berbual semalam, mesej sapaan memang tak akan keluar.</p>
    </>,
  },
  {
    id: "balasan-pantas",
    q: "Apa itu quick reply (balasan pantas) dan cara menggunakannya?",
    answer: "Balasan pantas ialah mesej yang disimpan, yang anda masukkan ke dalam chat dengan menaip garis miring dan memilih kata pintas. Ia tidak dihantar sendiri: ia menjimatkan masa menaip. Simpan senarai harga, cara bayaran, caj pos dan lokasi kedai. Balasan pantas dibuat dalam Tetapan › Alat perniagaan › Balasan pantas.",
    body: <>
      <ul>
        <li><strong>Pilih kata pintas yang mudah,</strong> contohnya harga, bayar, pos atau lokasi, supaya cepat dijumpai.</li>
        <li><strong>Kemas kini selalu.</strong> Harga lama dalam balasan pantas sama teruk dengan harga salah di Instagram.</li>
        <li><strong>Ubah sebelum hantar.</strong> Balasan pantas masuk ke kotak mesej, jadi anda boleh tambah nama pelanggan atau butiran lain dulu.</li>
      </ul>
    </>,
  },
  {
    id: "contoh",
    q: "Contoh auto reply WhatsApp Business: 15 mesej dalam Bahasa Melayu",
    answer: "Auto reply yang baik ringkas, memberitahu bila anda akan membalas, dan meminta maklumat yang anda perlukan untuk teruskan. Di bawah ada 15 contoh yang boleh disalin: empat mesej sapaan, enam mesej tiada di tempat (termasuk rehat solat Jumaat dan Hari Raya) dan lima balasan pantas. Tukar bahagian dalam kurungan dengan maklumat perniagaan anda.",
    body: <>
      <p><strong>Mesej sapaan</strong></p>
      <Samples locale="ms" items={greetings} />
      <p><strong>Mesej tiada di tempat</strong></p>
      <Samples locale="ms" items={away} />
      <p><strong>Balasan pantas</strong></p>
      <Samples locale="ms" items={quick} />
    </>,
  },
  {
    id: "tak-berfungsi",
    q: "Kenapa auto reply WhatsApp tak berfungsi?",
    answer: "Sebab paling biasa: pelanggan sudah mesej anda dalam 14 hari lepas, jadi mesej sapaan tak dihantar lagi; tetapan penerima tidak termasuk dia; jadual mesej tiada di tempat tidak aktif pada masa itu; atau telefon anda tiada internet. Pastikan juga anda tekan simpan, dan waktu operasi sudah diisi dalam profil perniagaan.",
    body: <>
      <ul>
        <li><strong>Peraturan 14 hari.</strong> Mesej sapaan hanya untuk mesej pertama, atau selepas 14 hari tiada mesej.</li>
        <li><strong>Penerima.</strong> Semak sama ada tetapan mengecualikan kenalan yang disimpan atau senarai tertentu.</li>
        <li><strong>Jadual.</strong> Kalau mesej tiada di tempat hanya untuk luar waktu operasi, ia tak keluar semasa kedai buka.</li>
        <li><strong>Internet.</strong> Auto reply dihantar dari telefon anda, jadi telefon perlu ada sambungan internet.</li>
        <li><strong>Aplikasi yang salah.</strong> Alat ini hanya ada dalam WhatsApp Business, bukan WhatsApp biasa.</li>
      </ul>
    </>,
  },
  {
    id: "whatsapp-biasa",
    q: "Boleh ke buat auto reply di WhatsApp biasa (personal)?",
    answer: "WhatsApp biasa tiada fungsi auto reply. Ada dua jalan: tukar ke aplikasi WhatsApp Business, yang boleh memindahkan nombor dan chat anda, atau pautkan nombor WhatsApp biasa anda kepada ejen AI seperti Wapzen. Wapzen berfungsi dengan WhatsApp biasa dan WhatsApp Business, dan membalas sendiri tanpa anda perlu tukar aplikasi.",
    body: <>
      <p>Ramai peniaga kecil masih guna nombor peribadi untuk berniaga. Kalau anda belum bersedia tukar aplikasi, ejen AI yang dipautkan sebagai peranti (seperti WhatsApp Web) boleh membalas pelanggan dari nombor yang sama. Anda masih boleh membaca dan membalas sendiri di telefon.</p>
    </>,
  },
  {
    id: "beza-ai",
    q: "Apa beza auto reply biasa dengan bot WhatsApp AI?",
    answer: "Auto reply menghantar teks yang sama kepada semua orang. Bot AI membaca soalan pelanggan dan menjawabnya berdasarkan arahan dan fail perniagaan anda: ia boleh memberitahu harga, stok, caj pos atau waktu operasi, dan boleh ambil tempahan. Auto reply hanya memberitahu anda akan membalas nanti; bot AI terus menjawab.",
    body: <>
      <Comparison caption="Auto reply biasa dan bot AI, sebelah-menyebelah" columns={["Auto reply biasa", "Bot WhatsApp AI"]} rows={versus} />
      <ChatExample
        business="Kedai Kek Demo"
        labels={{ subtitle: "WhatsApp · ejen AI", agent: "Ejen: ", patient: "Pelanggan: " }}
        turns={[
          { from: "patient", text: "Hai, kek coklat moist 1kg berapa? Boleh hantar Sabtu ni ke Seksyen 7?" },
          { from: "agent", text: "Hai! Saya pembantu maya Kedai Kek Demo. Kek coklat moist 1kg RM65, dan penghantaran ke Seksyen 7 RM8. Sabtu masih boleh sebab tempahan perlu 2 hari lebih awal. Nak tulis apa atas kek, dan pukul berapa nak terima?" },
          { from: "patient", text: "Tulis Happy Birthday Aina. Pukul 3 petang." },
          { from: "agent", text: "Baik! Tempahan anda: kek coklat moist 1kg, tulisan \"Happy Birthday Aina\", hantar Sabtu 3 petang ke Seksyen 7. Jumlah RM73. Boleh saya dapatkan nama dan alamat penuh untuk simpan tempahan?" },
        ]}
        caption="Contoh perbualan kedai kek rekaan, pukul 11 malam. Mesej tiada di tempat cuma akan memberitahu kedai sudah tutup."
        points={[
          { title: "Jawab soalan sebenar", body: "Harga dan caj pos datang daripada senarai harga yang kedai beri." },
          { title: "Ikut peraturan kedai", body: "Ejen tahu tempahan perlu 2 hari lebih awal kerana ia ditulis dalam arahan." },
          { title: "Ambil tempahan lengkap", body: "Esok pagi, staf tak perlu tanya semula tulisan, masa atau alamat." },
        ]}
      />
    </>,
  },
  {
    id: "cara-buat-bot",
    q: "Cara buat bot WhatsApp AI tanpa coding",
    answer: "Cara paling mudah: daftar Wapzen, pautkan nombor WhatsApp anda dengan kod 8 aksara atau kod QR, tulis arahan untuk ejen dan muat naik senarai harga. Ejen terus membalas dalam Bahasa Melayu atau English. Ia mula percuma, tanpa kad kredit dan tanpa WhatsApp Business API. Platform API seperti SleekFlow pula ada yuran bulanan dan caj Meta setiap mesej.",
    body: <>
      <Comparison caption="Tiga cara untuk dapatkan bot WhatsApp AI" columns={["Cara bermula", "Perlu WhatsApp Business API?", "Kos"]} rows={ways} />
      <ol>
        <li><strong>Tulis arahan dulu.</strong> Ejen mula membalas sebaik sahaja nombor dipautkan, jadi ubah contoh di bawah sebelum anda pautkan.</li>
        <li><strong>Daftar percuma.</strong> Papan pemuka dalam bahasa Inggeris, tetapi ejen membalas dalam bahasa pelanggan.</li>
        <li><strong>Pautkan nombor.</strong> Anda akan dapat kod 8 aksara. Di telefon, buka WhatsApp › Peranti dipautkan (Linked devices) › Pautkan peranti › Pautkan dengan nombor telefon, dan masukkan kod. Di komputer, anda juga boleh imbas kod QR.</li>
        <li><strong>Tampal arahan dan muat naik maklumat.</strong> Senarai harga dan soalan lazim boleh dalam bentuk teks, PDF atau Word. Gambar produk boleh dimuat naik supaya ejen boleh hantar kepada pelanggan.</li>
        <li><strong>Hidupkan Take Order</strong> kalau anda mahu ejen menyimpan tempahan, dan masukkan nombor WhatsApp untuk menerima notis setiap tempahan.</li>
        <li><strong>Uji dari nombor lain.</strong> Tanya harga, hantar nota suara dan buat satu tempahan.</li>
      </ol>
      <p>Contoh arahan untuk kedai kek rekaan. Tukar dengan maklumat perniagaan anda:</p>
      <pre>{prompt}</pre>
      <InlineCta title="Tukar auto reply kepada AI yang menjawab" body="Mula percuma. Tiada kad kredit dan tiada WhatsApp Business API." label="Mula percuma" />
      <p>Mahu tahu berapa kos jalan API di Malaysia? Baca <Link href="/blog/whatsapp-business-api-pricing-malaysia">WhatsApp Business API pricing in Malaysia</Link> (dalam bahasa Inggeris), dengan kadar Meta dalam ringgit dan contoh bil bulanan.</p>
    </>,
  },
  {
    id: "serentak",
    q: "Boleh guna auto reply dan bot AI serentak?",
    answer: "Boleh, tetapi pelanggan mungkin dapat dua balasan: mesej tiada di tempat dari aplikasi dan jawapan daripada ejen AI. Lebih kemas kalau anda matikan mesej tiada di tempat bila ejen AI aktif, dan pendekkan atau matikan mesej sapaan. Balasan pantas masih boleh digunakan seperti biasa bila anda membalas sendiri.",
    body: <>
      <p>Bila anda mahu uruskan satu perbualan sendiri, contohnya pelanggan yang komplen, matikan AI untuk kenalan itu dalam papan pemuka Wapzen. Ejen terus melayan pelanggan lain.</p>
    </>,
  },
  {
    id: "had-dan-pdpa",
    q: "Apa yang bot AI tak buat, dan apa perlu tahu tentang PDPA?",
    answer: "Ejen Wapzen tidak memulakan perbualan, tidak menghantar mesej berjadual atau broadcast, tidak menyemak bayaran dan tiada kalendar sendiri. Ia bukan produk rasmi Meta. Beritahu pelanggan bahawa mereka bercakap dengan pembantu maya, dan ingat Akta Perlindungan Data Peribadi 2010: data pelanggan Wapzen diproses di luar Malaysia.",
    body: <>
      <p>Ini maklumat am, bukan nasihat undang-undang. Pindaan 2024 kepada Akta Perlindungan Data Peribadi 2010 (PDPA) berkuat kuasa berperingkat: sejak 1 April 2025 senarai putih negara untuk pemindahan data ke luar negara dimansuhkan, dan pemindahan dibenarkan jika negara itu ada undang-undang yang hampir sama atau perlindungan yang setara; sejak 1 Jun 2025 ada kewajipan melantik pegawai perlindungan data (DPO) dan memaklumkan kebocoran data.</p>
      <p>Pangkalan data utama Wapzen di Singapura, pelayan di Singapura dan Jerman, fail yang anda muat naik di Seoul, dan penyedia AI seperti OpenAI mungkin memproses mesej di Amerika Syarikat. Wapzen tidak menerbitkan perjanjian pemprosesan data siap. Butiran lanjut dalam <Link href="/privacy">dasar privasi</Link> (bahasa Inggeris).</p>
    </>,
  },
];

export default function CaraBuatAutoReplyWhatsAppPage() {
  return <QaPost
    href={href}
    heading={<>Cara buat auto reply WhatsApp Business.<br /><span>Langkah demi langkah, 15 contoh mesej dan bot AI.</span></>}
    lead="Pelanggan mesej pukul 11 malam, dan anda sedang tidur, memandu atau melayan pelanggan lain. Panduan ini menjawab soalan demi soalan: cara set mesej tiada di tempat, mesej sapaan dan balasan pantas dalam WhatsApp Business, 15 contoh mesej dalam Bahasa Melayu yang boleh disalin, dan bila bot AI lebih baik daripada auto reply biasa."
    verdict={{
      title: "Jawapan ringkas",
      body: <>Auto reply ada dalam aplikasi <strong>WhatsApp Business</strong> yang percuma: mesej sapaan untuk pelanggan baharu, mesej tiada di tempat bila anda tutup dan balasan pantas untuk soalan yang berulang. Semuanya menghantar teks yang sama kepada semua orang. Kalau anda mahu setiap pelanggan dapat jawapan kepada soalan mereka sendiri, <strong>ejen AI Wapzen menjawab 24 jam dalam Bahasa Melayu atau English, dan anda boleh mula percuma.</strong> Wapzen produk kami sendiri, bukan produk rasmi Meta.</>,
    }}
    facts={[["Auto reply", "Percuma"], ["Di mana", "WhatsApp Business"], ["Contoh mesej", "15 dalam Bahasa Melayu"], ["Bot AI", "Mula percuma di Wapzen"]]}
    indexTitle="11 soalan dalam panduan ini"
    answerLabel="Jawapan ringkas"
    questions={questions}
    sources={sources}
    related={["/blog/whatsapp-business-api-pricing-malaysia", "/blog/whatsapp-business-greeting-message"]}
    cta={{ heading: <>Balas pelanggan walaupun anda sibuk.<br /><span>Bot AI untuk WhatsApp, mula percuma.</span></>, body: "Daftar, pautkan nombor anda dan beritahu ejen tentang perniagaan anda. Tiada kad kredit dan tiada WhatsApp Business API." }}
  />;
}
