import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Topik yang belum dibahas blog mana pun (2026-11-03). Pencarian (autocomplete
// Google, YouTube dan DuckDuckGo, gl=id, lihat docs/seo-research.md): "admin travel
// umroh" (20), "aplikasi travel umroh" (20), "chatbot whatsapp gratis" (56). Atas
// permintaan user: semua fitur disebut gratis sekarang dan agen suara berfungsi.
// Pengawasan PPIU oleh Kementerian Haji dan Umrah (RRI, 26 Agustus 2026); "5 Pasti
// Umrah" dari kampanye Kemenag. Klaim produk mengikuti whiskey-bailey-server, sama
// seperti posting sekolah. Tarif Meta Indonesia: daftar 1 Okt 2026 via Zernio.
const href = "/id/blog/chatbot-whatsapp-travel-umroh";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "id", article: { publishedTime: post.published, modifiedTime: post.updated } });

const pasti = [
  ["Pasti travelnya berizin", "Nomor izin PPIU dan nama perusahaan resmi", "Agen menyebut nomor izin dan cara memeriksanya di kanal resmi Kementerian Haji dan Umrah"],
  ["Pasti jadwalnya", "Tanggal berangkat, pulang, dan itinerary", "Agen menjawab dari jadwal keberangkatan yang Anda unggah"],
  ["Pasti terbangnya", "Maskapai dan rute", "Agen menyebut maskapai sesuai paket, tanpa menebak"],
  ["Pasti hotelnya", "Nama hotel, bintang, dan jarak ke Masjidil Haram dan Masjid Nabawi", "Agen menjawab dari rincian paket"],
  ["Pasti visanya", "Proses dan status visa", "Agen menjelaskan prosesnya, status per jemaah dicek petugas"],
];

const fit = [
  ["Travel yang menerima puluhan chat calon jemaah per hari", "Ya", "Menjawab soal paket dalam hitungan detik, 24 jam"],
  ["Travel dengan banyak jemaah lansia yang lebih suka telepon", "Ya", "Agen suara menjawab telepon WhatsApp"],
  ["Travel yang butuh manifest, keuangan, dan kamar dalam satu aplikasi", "Tidak", "Itu tugas aplikasi manajemen travel umroh"],
  ["Travel yang ingin bot membalas di grup jemaah", "Tidak", "Agen hanya membalas chat pribadi"],
  ["Travel yang perlu centang hijau atau template resmi Meta", "Tidak", "Itu butuh WhatsApp Business API resmi"],
];

const prompt = `Kamu adalah admin virtual Baitul Ula Tour, penyelenggara perjalanan ibadah umrah di Depok.
Jawab dalam bahasa Indonesia yang sopan dan hangat, singkat, dua sampai tiga kalimat. Sapa dengan salam jika jemaah memberi salam.
Sebutkan di pesan pertama bahwa kamu admin virtual.
Jawab soal paket, harga, jadwal keberangkatan, sisa seat, maskapai, hotel, DP dan pelunasan hanya dari basis pengetahuan. Jangan menjanjikan harga, seat, atau tanggal yang tidak tertulis.
Jika ditanya izin, sebutkan nomor izin PPIU kami dari basis pengetahuan, dan sarankan jemaah memeriksanya di kanal resmi Kementerian Haji dan Umrah.
Untuk mendaftar: tanyakan nama, kota, jumlah jemaah, dan paket yang diminati, ulangi, lalu sampaikan bahwa petugas akan menghubungi.
Jangan meminta foto paspor, KTP, KK, atau data kesehatan lewat chat. Semua dokumen diserahkan di kantor atau formulir resmi.
Pembayaran hanya ke rekening atas nama perusahaan yang tertulis di basis pengetahuan. Jangan pernah memberi nomor rekening lain.`;

const turns = [
  { from: "patient" as const, text: "Assalamualaikum, paket umroh bulan Februari masih ada? Berapa harganya?" },
  { from: "agent" as const, text: "Waalaikumsalam warahmatullah. Saya admin virtual Baitul Ula Tour. Paket Februari berangkat 10 Februari 2027, 12 hari, harga mulai Rp 33.900.000 per orang (kamar quad). Seat tersisa 14." },
  { from: "patient" as const, text: "Hotelnya dekat gak? Terus travelnya resmi kan?" },
  { from: "agent" as const, text: "Di Makkah hotel bintang 4, sekitar 300 meter dari Masjidil Haram. Kami PPIU resmi dengan nomor izin tertulis di brosur. Bapak/Ibu bisa memeriksanya di kanal resmi Kementerian Haji dan Umrah sebelum membayar." },
  { from: "patient" as const, text: "Alhamdulillah. Saya mau daftar berdua sama ibu saya" },
  { from: "agent" as const, text: "Baik. Boleh saya catat nama Bapak/Ibu dan kota domisili? Petugas kami akan menghubungi untuk DP dan dokumen, pembayaran hanya ke rekening atas nama perusahaan." },
];

const costs = [
  ["Biaya langganan", "Tergantung vendor, biasanya per bulan", "Rp 0"],
  ["Balasan ke calon jemaah", "1.000 balasan pertama per bulan per nomor gratis, lalu US$0,025 per pesan", "Tanpa biaya"],
  ["Info promo paket (marketing)", "US$0,0411 per pesan", "Tanpa biaya, lewat pesan massal"],
  ["Telepon WhatsApp", "Masuk gratis, keluar US$0,0242 per menit, plus platform suara", "Agen suara gratis"],
];

const sources = [
  { label: "RRI: Indonesia perketat aturan izin penyelenggara umrah (26 Agustus 2026)", href: "https://rri.co.id/en/national/2681103/indonesia-tightens-licensing-rules-for-umrah-travel-organizers" },
  { label: "Antara: Kemenhaj akan tindak tegas travel umrah ilegal", href: "https://jogja.antaranews.com/berita/847955/kemenhaj-bakal-tindak-tegas-travel-umrah-ilegal" },
  { label: "NU Online: utamakan 5 Pasti Umrah agar tak alami penipuan", href: "https://nu.or.id/nasional/utamakan-5-pasti-umrah-agar-tak-alami-penipuan-hlwyS" },
  { label: "Meta: harga WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Zernio: tarif WhatsApp per negara, daftar 1 Oktober 2026", href: "https://zernio.com/whatsapp-api-pricing" },
  { label: "BPK: UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi", href: "https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022" },
];

const questions = [
  {
    id: "gratis",
    q: "Apakah ada chatbot WhatsApp gratis untuk travel umroh?",
    answer: "Ada. Wapzen memberi admin AI untuk WhatsApp travel umroh yang saat ini sepenuhnya gratis: menjawab pertanyaan paket 24 jam, mencatat calon jemaah, mengirim info ke jemaah lewat pesan massal, dan agen suara yang menjawab telepon WhatsApp. Tanpa langganan, tanpa kartu kredit, dan tanpa biaya Meta per pesan.",
    body: <>
      <p>Hampir semua calon jemaah umroh pertama kali menghubungi travel lewat WhatsApp, sering kali dari iklan atau rekomendasi keluarga. Pertanyaannya hampir selalu sama: harga paket, tanggal berangkat, hotel, maskapai, dan “travelnya resmi gak?”. Admin manusia tidak bisa membalas semuanya cepat, apalagi malam hari dan akhir pekan, saat banyak keluarga berdiskusi soal umroh.</p>
      <p>Di Wapzen, <strong>semuanya gratis sekarang</strong>: chatbot, agen suara, basis pengetahuan, tools API, dan pesan massal. Model AI sudah termasuk, jadi tidak perlu API key atau programmer.</p>
    </>,
  },
  {
    id: "tugas-admin",
    q: "Tugas admin travel umroh apa saja yang bisa dikerjakan AI?",
    answer: "Semua pertanyaan rutin: harga dan jenis paket, jadwal keberangkatan, sisa seat, maskapai, hotel dan jaraknya ke masjid, DP dan pelunasan, perlengkapan, dan jadwal manasik. AI juga mencatat nama, kota, dan jumlah jemaah yang ingin mendaftar. Verifikasi dokumen, pembayaran, dan visa tetap dikerjakan petugas.",
    body: <>
      <p>Contoh percakapan dengan travel fiktif:</p>
      <ChatExample
        business="Baitul Ula Tour"
        labels={{ subtitle: "WhatsApp · admin AI", agent: "Admin AI: ", patient: "Calon jemaah: " }}
        turns={turns}
        caption="Percakapan ilustrasi untuk travel fiktif. Harga, seat, dan hotel diambil dari basis pengetahuan yang diunggah travel."
        points={[
          { title: "Jawaban dari brosur Anda", body: "Unggah rincian paket per keberangkatan. Agen mencarinya di setiap pesan, dan bilang terus terang jika informasinya tidak ada." },
          { title: "Membalas salam dengan pantas", body: "Agen membalas “Assalamualaikum” dengan salam yang lengkap, lalu langsung menjawab pertanyaannya." },
          { title: "Membangun kepercayaan", body: "Saat ditanya “resmi gak?”, agen menyebut izin PPIU dan menyarankan jemaah memeriksanya sendiri. Itu justru meyakinkan." },
          { title: "Rekening hanya atas nama perusahaan", body: "Instruksi melarang agen memberi nomor rekening lain, sehingga jemaah tidak bingung dan penipu tidak bisa menyamar." },
        ]}
      />
    </>,
  },
  {
    id: "lima-pasti",
    q: "Bagaimana chatbot menjawab “5 Pasti Umrah” dari calon jemaah?",
    answer: "Kampanye 5 Pasti Umrah meminta jemaah memastikan travelnya berizin, jadwalnya, terbangnya, hotelnya, dan visanya. Calon jemaah yang cermat akan menanyakan kelimanya di WhatsApp. Jika jawabannya ada di basis pengetahuan, agen menjawab dengan jelas dan konsisten, kapan pun ditanya.",
    body: <>
      <p>Setelah banyak kasus jemaah gagal berangkat, Kementerian Haji dan Umrah memperketat pengawasan PPIU pada 2026: izin dan akreditasi wajib, dan menyewakan izin, paket palsu, iklan menyesatkan, atau kontrak yang tidak transparan dilarang. Jemaah juga diimbau memeriksa legalitas travel sebelum membayar. Travel yang menjawab pertanyaan ini dengan jelas akan lebih dipercaya.</p>
      <Comparison caption="5 Pasti Umrah dan cara chatbot WhatsApp travel menjawabnya" columns={["Yang ditanyakan jemaah", "Jawaban chatbot"]} rows={pasti} />
      <Note>Agen hanya tahu apa yang Anda unggah. Perbarui jadwal, seat, dan hotel setiap ada perubahan, terutama menjelang keberangkatan.</Note>
    </>,
  },
  {
    id: "aplikasi",
    q: "Apakah ini pengganti aplikasi travel umroh?",
    answer: "Bukan. Aplikasi manajemen travel umroh mengurus manifest, keuangan, kamar, dan dokumen jemaah. Chatbot WhatsApp adalah admin di depan: menjawab calon jemaah sebelum mereka mendaftar. Keduanya bisa bekerja sama: jika aplikasi Anda punya API, agen bisa mengecek sisa seat langsung dari sana.",
    body: <>
      <p>Banyak yang mencari “aplikasi travel umroh” padahal masalahnya adalah chat yang tidak terbalas. Pembagiannya:</p>
      <ul>
        <li><strong>Aplikasi travel umroh:</strong> data jemaah, manifest, pembayaran dan cicilan, pembagian kamar, laporan keuangan.</li>
        <li><strong>Chatbot WhatsApp:</strong> jawaban cepat 24 jam, pencatatan calon jemaah, dan agen suara untuk telepon.</li>
      </ul>
      <p>Untuk menghubungkan keduanya, tambahkan tool “API request” di Wapzen. Jika belum punya aplikasi, setiap percakapan tersimpan di dasbor Wapzen, dan tool Take Order (catat pesanan) bisa dicoba untuk menyimpan pendaftaran yang sudah dikonfirmasi jemaah.</p>
    </>,
  },
  {
    id: "biaya",
    q: "Berapa biaya WhatsApp Business API untuk travel umroh?",
    answer: "Di API resmi, setelah 1.000 balasan gratis per bulan, travel membayar Meta US$0,025 per pesan layanan dan US$0,0411 per pesan promo, belum termasuk biaya platform. Wapzen tidak memakai API resmi, jadi tidak ada biaya per pesan, dan semua fiturnya gratis sekarang.",
    body: <>
      <Comparison caption="Biaya WhatsApp untuk travel umroh: API resmi dibanding Wapzen" columns={["WhatsApp Business API resmi", "Wapzen"]} rows={costs} />
      <h3>Contoh hitungan</h3>
      <p>Travel menerima 80 chat calon jemaah per hari dengan rata-rata 6 balasan (<strong>14.400 balasan per bulan</strong>) dan mengirim promo paket ke 2.000 alumni jemaah sebulan sekali:</p>
      <ul>
        <li><strong>Balasan:</strong> setelah 1.000 gratis, 13.400 × US$0,025 = <strong>US$335</strong>.</li>
        <li><strong>Promo:</strong> 2.000 × US$0,0411 = <strong>US$82,20</strong>.</li>
        <li><strong>Total:</strong> sekitar <strong>US$417 per bulan</strong>, hanya untuk Meta. Dengan kurs Rp 15.000 per dolar pun sudah lebih dari Rp 6 juta.</li>
        <li><strong>Wapzen:</strong> Rp 0.</li>
      </ul>
      <Note>Tarif Meta dalam dolar AS dari daftar 1 Oktober 2026 dan berubah tiap kuartal. Cek tarif terbaru di Meta.</Note>
    </>,
  },
  {
    id: "telepon",
    q: "Apakah bisa menjawab telepon jemaah? Agen suara AI",
    answer: "Bisa. Agen suara Wapzen menjawab telepon WhatsApp ke nomor travel dengan suara natural dalam bahasa Indonesia, memakai informasi paket yang sama dengan chatbot, dan bisa menelepon calon jemaah yang baru mendaftar minat. Gratis seperti fitur lainnya, dan hanya untuk telepon WhatsApp.",
    body: <>
      <p>Banyak calon jemaah adalah orang tua dan lansia yang lebih nyaman menelepon daripada mengetik. Agen suara membuat mereka tetap terlayani di luar jam kantor:</p>
      <ul>
        <li><strong>Menjawab telepon masuk</strong> soal paket, jadwal, hotel, dan pendaftaran.</li>
        <li><strong>Menelepon calon jemaah</strong> dalam kampanye: tambahkan nama dan nomor, agen langsung menelepon saat minatnya masih hangat.</li>
        <li><strong>Tanpa biaya per menit</strong>, berbeda dengan telepon keluar di API resmi (US$0,0242 per menit di Indonesia).</li>
      </ul>
      <p>Perlu diketahui: agen butuh satu sampai dua detik sebelum menjawab setiap kalimat, dan tidak bisa mengalihkan telepon ke petugas saat panggilan berlangsung.</p>
      <InlineCta title="Admin AI untuk travel umroh Anda" body="Chatbot dan agen suara di WhatsApp, gratis sekarang. Tanpa biaya Meta dan tanpa kartu kredit." label="Mulai gratis" />
    </>,
  },
  {
    id: "jemaah-terdaftar",
    q: "Bisakah mengirim info manasik dan pengingat ke jemaah yang sudah daftar?",
    answer: "Bisa, dengan pesan massal Wapzen yang gratis: unggah daftar jemaah dari Excel atau CSV, tulis pesan dengan nama masing-masing, dan kirim dengan jeda antar pesan. Jika jemaah membalas dengan pertanyaan, agen AI langsung menjawab. Agen tidak membalas di grup WhatsApp jemaah.",
    body: <>
      <ul>
        <li><strong>Jadwal manasik, pelunasan, dan perlengkapan:</strong> pesan personal lebih jarang terlewat daripada pengumuman di grup yang ramai.</li>
        <li><strong>Voice note:</strong> aktifkan sakelar voice note di pengaturan agen (mati secara default), karena banyak jemaah lebih suka mengirim VN.</li>
        <li><strong>Jaga nomor travel:</strong> kirim hanya ke jemaah yang terdaftar atau yang pernah menghubungi Anda, dan jangan membeli daftar nomor.</li>
      </ul>
    </>,
  },
  {
    id: "data-jemaah",
    q: "Bagaimana dengan data paspor dan data pribadi jemaah?",
    answer: "Jangan kumpulkan lewat chatbot. UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi berlaku untuk data paspor dan KTP, dan data kesehatan seperti vaksin termasuk data pribadi yang bersifat spesifik. Biarkan agen mencatat nama dan kota saja, dan minta dokumen diserahkan di kantor atau formulir resmi.",
    body: <>
      <p>Ini panduan umum, bukan nasihat hukum:</p>
      <ul>
        <li><strong>Kumpulkan seperlunya.</strong> Nama, kota, jumlah jemaah, dan paket yang diminati sudah cukup untuk dihubungi petugas.</li>
        <li><strong>Terbuka.</strong> Agen menyebut dirinya admin virtual dan selalu memberi kontak petugas.</li>
        <li><strong>Ketahui ke mana data pergi.</strong> Database utama Wapzen ada di Singapura, server aplikasinya di Singapura dan Jerman, dan penyedia AI bisa memproses pesan di Amerika Serikat. Detailnya ada di <Link href="/privacy">kebijakan privasi</Link> (bahasa Inggris).</li>
      </ul>
    </>,
  },
  {
    id: "batasan",
    q: "Apa batasan Wapzen yang perlu diketahui?",
    answer: "Satu akun punya satu agen chat, dan setiap agen membalas hingga 100 balasan AI per jam. Agen hanya membalas chat pribadi, tidak bisa dijeda untuk satu chat saja, dan karena bukan API resmi, tidak ada centang hijau atau template resmi Meta.",
    body: <>
      <Comparison caption="Untuk travel umroh mana chatbot WhatsApp gratis seperti Wapzen cocok" columns={["Cocok?", "Alasannya"]} rows={fit} />
      <ul>
        <li><strong>100 balasan AI per jam per agen.</strong> Jika batas tercapai, agen diam sampai jamnya habis, dan pesan masuk tetap tersimpan.</li>
        <li><strong>Terhubung sebagai perangkat tertaut</strong>, seperti WhatsApp Web, lewat kode QR atau kode tautan, di nomor travel yang sudah ada.</li>
        <li><strong>Tidak ada jeda per chat.</strong> Menjeda agen berarti berhenti di semua chat. Balasan Anda dari dasbor masuk ke riwayat agen, balasan dari HP tidak.</li>
        <li><strong>Dasbor berbahasa Inggris</strong>, agen membalas dalam bahasa Indonesia.</li>
        <li>Wapzen adalah produk independen, bukan milik Meta atau WhatsApp.</li>
      </ul>
    </>,
  },
  {
    id: "cara-pasang",
    q: "Bagaimana cara memasang admin AI WhatsApp untuk travel umroh?",
    answer: "Sekitar sepuluh menit: buat akun gratis, tulis instruksi agen, unggah brosur paket, nomor izin PPIU, dan rekening resmi, lalu hubungkan nomor travel dengan kode QR dari komputer atau kode tautan dari HP. Setelah itu uji dari nomor lain.",
    body: <>
      <ol>
        <li><strong>Buat akun gratis.</strong> Saat mendaftar, satu agen sudah disiapkan.</li>
        <li><strong>Tulis instruksi.</strong> Nama travel, gaya bahasa, aturan soal harga dan rekening, dan kontak petugas.</li>
        <li><strong>Unggah informasi travel.</strong> Paket per keberangkatan, hotel, maskapai, syarat dokumen, nomor izin PPIU, dan rekening atas nama perusahaan, dalam teks, PDF, atau Word.</li>
        <li><strong>Hubungkan nomor.</strong> Dari komputer: WhatsApp → Perangkat tertaut → Tautkan perangkat, lalu pindai kode QR. Dari HP: masukkan nomor dan ketik kode tautan 8 karakter di WhatsApp.</li>
        <li><strong>Uji.</strong> Kirim pertanyaan nyata calon jemaah dari nomor lain, lalu perbaiki instruksi sampai jawabannya pas.</li>
      </ol>
      <p>Contoh instruksi untuk travel fiktif. Ganti dengan data travel Anda:</p>
      <pre>{prompt}</pre>
    </>,
  },
];

export default function ChatbotTravelUmrohPage() {
  return <QaPost
    href={href}
    heading={<>Chatbot WhatsApp untuk travel umroh.<br /><span>Admin AI gratis, 24 jam, juga untuk telepon.</span></>}
    lead="Calon jemaah umroh bertanya lewat WhatsApp sebelum mendaftar: harga paket, jadwal, hotel, dan apakah travelnya resmi. Di sini kami menjawab satu per satu apa yang bisa dikerjakan admin AI di WhatsApp travel umroh, bagaimana menjawab 5 Pasti Umrah, berapa biaya alternatifnya, dan cara memasangnya gratis, lengkap dengan agen suara."
    verdict={{
      title: "Jawaban singkat",
      body: <>Ya, travel umroh bisa memakai admin AI di WhatsApp secara gratis lewat <strong>Wapzen</strong>: menjawab soal paket, jadwal, hotel, dan izin PPIU 24 jam dari brosur Anda, mencatat calon jemaah, dan agen suaranya menjawab telepon WhatsApp. <strong>Semua fitur gratis sekarang</strong>, tanpa biaya Meta per pesan.</>,
    }}
    facts={[["Harga", "Gratis sekarang"], ["Biaya Meta", "Tidak ada"], ["Telepon", "Agen suara gratis"], ["Koneksi", "Kode QR atau kode tautan"]]}
    indexTitle="10 pertanyaan dalam panduan ini"
    answerLabel="Jawaban"
    questions={questions}
    sources={sources}
    related={["/id/blog/chatbot-whatsapp-sekolah-gratis", "/blog/free-whatsapp-ai-agent"]}
    cta={{ heading: <>Setiap calon jemaah langsung dijawab.<br /><span>Gratis, siang dan malam.</span></>, body: "Buat agen AI, unggah brosur paket, dan hubungkan nomor travel dalam hitungan menit. Tanpa kartu kredit dan tanpa API Meta." }}
  />;
}
