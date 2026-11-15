import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Pencarian (autocomplete Google, YouTube dan DuckDuckGo, gl=id, 2026-11-03, lihat
// docs/seo-research.md): "chatbot whatsapp gratis" (56), "ai untuk sekolah" (30),
// "chatbot kampus" (20), "spmb sekolah swasta" (20). Atas permintaan user: semua
// fitur disebut gratis sekarang dan agen suara berfungsi (2026-11-03). Klaim produk
// mengikuti whiskey-bailey-server: 1 agen chat per akun, 100 balasan AI per agen per
// jam, hanya chat pribadi (bukan grup), VN dan foto lewat sakelar per agen (mati
// secara default). SPMB: Permendikdasmen No. 3 Tahun 2025. Tarif Meta Indonesia dari
// daftar 1 Okt 2026 via Zernio: cek ulang tiap kuartal.
const href = "/id/blog/chatbot-whatsapp-sekolah-gratis";
const post = blogPost(href);

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "id", article: { publishedTime: post.published, modifiedTime: post.updated } });

const costs = [
  ["Biaya langganan", "Tergantung vendor, biasanya per bulan", "Rp 0"],
  ["Balasan ke orang tua", "1.000 balasan pertama per bulan per nomor gratis, lalu US$0,025 per pesan", "Tanpa biaya"],
  ["Pengumuman dan pengingat (template)", "US$0,025 (utilitas) atau US$0,0411 (marketing) per pesan", "Tanpa biaya, lewat pesan massal"],
  ["Telepon WhatsApp", "Masuk gratis, keluar US$0,0242 per menit, plus platform suara", "Agen suara gratis"],
  ["AI", "Biasanya paket tambahan atau per balasan", "Termasuk dan gratis"],
];

const fit = [
  ["Sekolah swasta, pesantren, atau bimbel yang dibanjiri chat saat pendaftaran", "Ya", "Menjawab dalam hitungan detik, siang dan malam"],
  ["Sekolah yang orang tuanya sering telepon WA", "Ya", "Agen suara menjawab telepon dan pertanyaan umum"],
  ["Sekolah yang ingin bot membalas di grup wali murid", "Tidak", "Agen hanya membalas chat pribadi, bukan grup"],
  ["Yayasan yang butuh centang hijau atau template resmi Meta", "Tidak", "Itu butuh WhatsApp Business API resmi"],
  ["Kampus dengan ribuan chat per jam saat pengumuman", "Belum tentu", "Batasnya 100 balasan AI per agen per jam"],
];

const prompt = `Kamu adalah asisten virtual SMP Tunas Harapan, sekolah swasta di Bekasi Timur.
Jawab dalam bahasa Indonesia yang sopan dan singkat, dua sampai tiga kalimat. Jika orang tua menulis dalam bahasa Inggris, jawab dalam bahasa Inggris.
Sebutkan di pesan pertama bahwa kamu asisten virtual sekolah.
Jawab soal biaya, jadwal pendaftaran, syarat dokumen, program, ekstrakurikuler, dan lokasi hanya dari basis pengetahuan. Jangan menebak angka atau tanggal.
Untuk pendaftaran: tanyakan nama orang tua, nama calon siswa, dan kelas yang dituju, lalu kirim link formulir resmi sekolah.
Jangan meminta NIK, KK, akta kelahiran, rapor, atau foto dokumen lewat chat. Semua dokumen diunggah di formulir resmi.
Jika orang tua ingin bicara dengan petugas, berikan nomor tata usaha: Senin–Jumat 07.00–15.00, Sabtu 07.00–12.00.`;

const turns = [
  { from: "patient" as const, text: "Assalamualaikum, mau tanya pendaftaran kelas 7 tahun depan sudah buka? Biayanya berapa ya?" },
  { from: "agent" as const, text: "Waalaikumsalam, saya asisten virtual SMP Tunas Harapan. Pendaftaran kelas 7 gelombang 1 dibuka 5 Januari 2027. Uang pangkal Rp 6.500.000 dan SPP Rp 750.000 per bulan. Ada potongan 10% untuk pendaftar gelombang 1." },
  { from: "patient" as const, text: "Bisa dicicil gak uang pangkalnya? Terus syaratnya apa aja?" },
  { from: "agent" as const, text: "Bisa, uang pangkal boleh dicicil 3 kali. Syaratnya: rapor kelas 5 dan 6 SD, akta kelahiran, dan KK, semuanya diunggah lewat formulir online, tidak perlu dikirim di chat ini. Boleh saya catat nama Bapak/Ibu dan nama calon siswa?" },
  { from: "patient" as const, text: "Ibu Rina, anaknya Naufal" },
  { from: "agent" as const, text: "Terima kasih, Bu Rina. Ini link formulir pendaftaran resmi untuk Naufal: [link formulir sekolah]. Kalau ada kendala, tata usaha siap membantu Senin–Sabtu pagi." },
];

const sources = [
  { label: "Meta: harga WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Zernio: tarif WhatsApp per negara, daftar 1 Oktober 2026", href: "https://zernio.com/whatsapp-api-pricing" },
  { label: "BPK: UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi", href: "https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022" },
  { label: "Antara: Kemendikdasmen umumkan Sistem Penerimaan Murid Baru", href: "https://papuabarat.antaranews.com/berita/60593/kemendikdasmen-umumkan-sistem-penerimaan-murid-baru-2025-2026" },
  { label: "WhatsApp: kebijakan pesan bisnis", href: "https://whatsappbusiness.com/policy/" },
  { label: "DataReportal: Digital 2026 Indonesia", href: "https://datareportal.com/reports/digital-2026-indonesia" },
];

const questions = [
  {
    id: "gratis",
    q: "Apakah ada chatbot WhatsApp gratis untuk sekolah?",
    answer: "Ada. Wapzen memberi chatbot WhatsApp dengan AI yang saat ini sepenuhnya gratis: membalas orang tua 24 jam, menjawab soal biaya dan pendaftaran, mengirim pesan massal, dan agen suara yang menjawab telepon WhatsApp. Tanpa langganan, tanpa kartu kredit, dan tanpa biaya Meta per pesan, karena memakai nomor sekolah yang sudah ada.",
    body: <>
      <p>Indonesia punya 230 juta pengguna internet (DataReportal, Oktober 2025), dan bagi orang tua, WhatsApp adalah cara utama menghubungi sekolah. Saat musim pendaftaran, admin tata usaha bisa menerima ratusan chat dengan pertanyaan yang sama: “biayanya berapa?”, “syaratnya apa?”, “kapan tes?”. Banyak yang masuk malam hari, saat kantor sudah tutup.</p>
      <p>Kebanyakan yang muncul saat mencari “chatbot WhatsApp gratis” hanya gratis 7 sampai 14 hari, berupa menu tombol tanpa AI, atau menjual balasan AI per kuota. Belum lagi tarif Meta per pesan jika memakai API resmi.</p>
      <p>Di Wapzen, <strong>semuanya gratis sekarang</strong>: chatbot, agen suara, basis pengetahuan, tools API, dan pesan massal. Model AI sudah termasuk, jadi tidak perlu API key OpenAI atau programmer.</p>
    </>,
  },
  {
    id: "menjawab-apa",
    q: "Apa saja yang bisa dijawab chatbot WhatsApp sekolah?",
    answer: "Semua pertanyaan rutin yang jawabannya ada di dokumen sekolah: biaya (uang pangkal, SPP, cicilan), jadwal dan gelombang pendaftaran, syarat dokumen, program dan ekstrakurikuler, seragam, antar-jemput, dan lokasi. Untuk pendaftaran, chatbot mencatat nama dan mengirim link formulir resmi.",
    body: <>
      <p>Contoh percakapan dengan sekolah fiktif:</p>
      <ChatExample
        business="SMP Tunas Harapan"
        labels={{ subtitle: "WhatsApp · agen AI", agent: "Agen: ", patient: "Orang tua: " }}
        turns={turns}
        caption="Percakapan ilustrasi untuk sekolah fiktif. Biaya dan jadwal diambil dari basis pengetahuan yang diunggah sekolah."
        points={[
          { title: "Jawaban dari dokumen sekolah", body: "Tata usaha mengunggah brosur, rincian biaya, dan jadwal. Agen mencari di sana setiap ada pesan, dan bilang terus terang jika informasinya tidak ada." },
          { title: "Paham bahasa sehari-hari", body: "“Gak”, “berapa ya”, “anaknya Naufal”: agen memahami bahasa chat orang tua dan menjawab dengan bahasa yang sopan." },
          { title: "Tahu tanggal hari ini", body: "Agen tahu hari dan tanggal, jadi paham “minggu depan” atau “gelombang yang masih buka”." },
          { title: "Dokumen tetap di formulir resmi", body: "Agen tidak meminta KK atau akta di chat. Orang tua diarahkan ke formulir online sekolah." },
        ]}
      />
    </>,
  },
  {
    id: "spmb",
    q: "Bagaimana chatbot membantu saat SPMB dan pendaftaran siswa baru?",
    answer: "Saat SPMB, orang tua bertanya hal yang sama ribuan kali: jadwal, jalur, syarat, dan biaya. Chatbot menjawabnya dalam hitungan detik dari juknis dan brosur sekolah, 24 jam, sehingga tata usaha bisa fokus memverifikasi berkas dan melayani yang benar-benar butuh bantuan.",
    body: <>
      <p>Sejak tahun ajaran 2025/2026, PPDB diganti Sistem Penerimaan Murid Baru (SPMB) berdasarkan Permendikdasmen No. 3 Tahun 2025. Jadwal dan aturan teknisnya berbeda di tiap daerah, dan sebagian sekolah swasta ikut program daerah. Hasilnya: orang tua bingung, dan pertanyaan menumpuk di WhatsApp sekolah.</p>
      <ul>
        <li><strong>Unggah juknis daerah dan brosur sekolah</strong> ke basis pengetahuan, agar jawaban soal jadwal dan syarat sesuai aturan terbaru.</li>
        <li><strong>Perbarui setiap ada perubahan</strong>, misalnya perpanjangan jadwal atau gelombang baru. Agen hanya tahu apa yang Anda unggah.</li>
        <li><strong>Arahkan ke kanal resmi.</strong> Untuk jalur negeri, agen memberi link portal SPMB daerah. Untuk sekolah Anda sendiri, link formulir sekolah.</li>
        <li><strong>Bimbel dan kampus swasta</strong> bisa memakai cara yang sama untuk info kelas, jadwal tes, biaya kuliah, dan beasiswa.</li>
      </ul>
    </>,
  },
  {
    id: "biaya-api",
    q: "Berapa biaya WhatsApp Business API untuk sekolah di Indonesia?",
    answer: "Di API resmi, setelah 1.000 balasan gratis per bulan, sekolah membayar Meta US$0,025 per pesan layanan atau utilitas, dan US$0,0411 per pesan marketing, belum termasuk biaya platform. Indonesia termasuk pasar dengan tarif layanan tertinggi. Wapzen tidak memakai API resmi, jadi tidak ada biaya per pesan.",
    body: <>
      <Comparison caption="Biaya WhatsApp untuk sekolah di Indonesia: API resmi dibanding Wapzen" columns={["WhatsApp Business API resmi", "Wapzen"]} rows={costs} />
      <h3>Contoh hitungan saat musim pendaftaran</h3>
      <p>Sekolah menerima 150 chat orang tua per hari, rata-rata 5 balasan per chat, berarti <strong>22.500 balasan per bulan</strong>:</p>
      <ul>
        <li><strong>API resmi:</strong> setelah 1.000 balasan gratis, sisa 21.500 × US$0,025 = <strong>US$537,50 per bulan</strong>, hanya untuk Meta. Dengan kurs Rp 15.000 per dolar pun sudah lebih dari Rp 8 juta, sebelum biaya platform dan AI.</li>
        <li><strong>Wapzen:</strong> Rp 0.</li>
      </ul>
      <Note>Tarif Meta dalam dolar AS dari daftar 1 Oktober 2026 dan berubah tiap kuartal. Cek tarif terbaru di Meta.</Note>
    </>,
  },
  {
    id: "telepon",
    q: "Apakah bisa menjawab telepon WhatsApp? Agen suara AI",
    answer: "Bisa. Agen suara Wapzen menjawab telepon WhatsApp yang masuk ke nomor sekolah dengan suara natural dalam bahasa Indonesia, memakai informasi yang sama dengan chatbot, dan bisa menelepon balik calon pendaftar. Gratis seperti fitur lainnya, dan hanya untuk telepon WhatsApp, bukan telepon biasa.",
    body: <>
      <p>Banyak orang tua lebih suka “telepon WA” daripada mengetik panjang. Telepon yang tidak diangkat sering berarti orang tua memilih sekolah lain.</p>
      <ul>
        <li><strong>Menjawab telepon masuk</strong> soal biaya, jadwal, dan syarat, dalam bahasa Indonesia.</li>
        <li><strong>Menelepon calon pendaftar.</strong> Dalam kampanye, Anda menambahkan nama dan nomor, lalu agen langsung menelepon.</li>
        <li><strong>Tanpa biaya per menit.</strong> Di API resmi, telepon keluar dari sekolah dikenai US$0,0242 per menit, ditambah platform suara AI. Di Wapzen tidak ada.</li>
      </ul>
      <p>Perlu diketahui: agen butuh satu sampai dua detik sebelum menjawab setiap kalimat, dan tidak bisa mengalihkan telepon ke petugas saat panggilan berlangsung. Untuk hal yang rumit, agen memberikan nomor tata usaha.</p>
      <InlineCta title="WhatsApp sekolah Anda menjawab 24 jam" body="Chatbot dan agen suara AI, gratis sekarang. Tanpa biaya Meta dan tanpa kartu kredit." label="Mulai gratis" />
    </>,
  },
  {
    id: "vn-foto",
    q: "Apakah chatbot bisa membalas voice note dan foto?",
    answer: "Bisa, jika diaktifkan. Di pengaturan agen ada dua sakelar, voice note dan foto, yang mati secara default. Jika voice note aktif, agen mengubah VN menjadi teks lalu membalasnya. Jika foto aktif, agen membaca gambar dan menjawab berdasarkan isinya.",
    body: <>
      <p>Voice note sangat umum di Indonesia, jadi sakelar VN sebaiknya diaktifkan. Untuk foto, berhati-hatilah: orang tua bisa saja mengirim foto KK atau rapor. Tulis di instruksi agen agar tidak membahas isi dokumen pribadi dan mengarahkan ke formulir resmi.</p>
    </>,
  },
  {
    id: "grup",
    q: "Bagaimana dengan grup wali murid dan pengumuman sekolah?",
    answer: "Agen AI hanya membalas chat pribadi, tidak membalas di grup, jadi grup wali murid tetap seperti biasa. Untuk pengumuman, fitur pesan massal Wapzen yang gratis mengirim pesan personal ke setiap orang tua dari daftar Excel atau CSV, dengan jeda antar pesan.",
    body: <>
      <ul>
        <li><strong>Grup tetap dikelola wali kelas.</strong> Agen tidak ikut membalas, jadi tidak ada risiko bot menjawab di depan semua orang tua.</li>
        <li><strong>Pengumuman personal.</strong> Unggah daftar orang tua, tulis pesan dengan nama masing-masing, lalu kirim. Jika orang tua membalas, agen siap menjawab.</li>
        <li><strong>Jaga nomor sekolah.</strong> Kirim hanya ke orang tua yang memang terdaftar, biarkan jeda antar pesan, dan jangan membeli daftar nomor.</li>
      </ul>
    </>,
  },
  {
    id: "uu-pdp",
    q: "Apa kata UU PDP soal data siswa di chatbot?",
    answer: "UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi mewajibkan pemrosesan data pribadi anak dilakukan secara khusus dan dengan persetujuan orang tua atau wali (Pasal 25). Cara aman: chatbot berbicara dengan orang tua, hanya mencatat nama, dan semua dokumen diunggah di formulir resmi sekolah.",
    body: <>
      <p>Ini panduan umum, bukan nasihat hukum:</p>
      <ul>
        <li><strong>Kumpulkan seperlunya.</strong> Nama orang tua, nama calon siswa, dan kelas tujuan sudah cukup. Jangan minta NIK, NISN, KK, atau foto dokumen di chat.</li>
        <li><strong>Terbuka.</strong> Agen menyebut dirinya asisten virtual dan selalu memberi kontak petugas.</li>
        <li><strong>Ketahui ke mana data pergi.</strong> Database utama Wapzen ada di Singapura, server aplikasinya di Singapura dan Jerman, dan penyedia AI bisa memproses pesan di Amerika Serikat. Artinya data keluar dari Indonesia. Detailnya ada di <Link href="/privacy">kebijakan privasi</Link> (bahasa Inggris).</li>
        <li><strong>Akun Wapzen untuk sekolah, bukan siswa.</strong> Wapzen adalah alat bisnis dan tidak ditujukan untuk pengguna di bawah 16 tahun.</li>
      </ul>
    </>,
  },
  {
    id: "batasan",
    q: "Apa batasan Wapzen yang perlu diketahui?",
    answer: "Satu akun punya satu agen chat, dan setiap agen membalas hingga 100 balasan AI per jam. Agen hanya membalas chat pribadi, tidak bisa dijeda untuk satu chat saja, dan karena bukan API resmi, tidak ada centang hijau atau template resmi Meta.",
    body: <>
      <Comparison caption="Untuk siapa chatbot WhatsApp gratis seperti Wapzen cocok, dan untuk siapa tidak" columns={["Cocok?", "Alasannya"]} rows={fit} />
      <ul>
        <li><strong>100 balasan AI per jam per agen.</strong> Jika batas tercapai, agen diam sampai jamnya habis. Pesan masuk tetap tersimpan untuk dibalas petugas.</li>
        <li><strong>Terhubung sebagai perangkat tertaut</strong>, seperti WhatsApp Web, lewat kode QR atau kode tautan. Karena bukan API resmi, WhatsApp bisa membatasi nomor yang berperilaku tidak wajar.</li>
        <li><strong>Tidak ada jeda per chat.</strong> Menjeda agen berarti berhenti di semua chat. Balasan Anda dari dasbor masuk ke riwayat agen, balasan dari HP tidak.</li>
        <li><strong>Dasbor berbahasa Inggris</strong>, agen membalas dalam bahasa Indonesia.</li>
        <li>Wapzen adalah produk independen, bukan milik Meta atau WhatsApp.</li>
      </ul>
    </>,
  },
  {
    id: "cara-pasang",
    q: "Bagaimana cara memasang chatbot WhatsApp sekolah secara gratis?",
    answer: "Sekitar sepuluh menit: buat akun gratis, tulis instruksi agen, unggah brosur dan rincian biaya, lalu hubungkan nomor sekolah dengan kode QR dari komputer atau kode tautan dari HP. Setelah itu uji dari nomor lain.",
    body: <>
      <ol>
        <li><strong>Buat akun gratis.</strong> Saat mendaftar, satu agen sudah disiapkan.</li>
        <li><strong>Tulis instruksi.</strong> Nama sekolah, gaya bahasa, apa yang boleh dan tidak boleh ditanyakan, dan kontak tata usaha.</li>
        <li><strong>Unggah informasi sekolah.</strong> Brosur, rincian biaya, jadwal pendaftaran, juknis SPMB daerah, dan FAQ, dalam teks, PDF, atau Word. Lalu pasang ke agen.</li>
        <li><strong>Hubungkan nomor.</strong> Dari komputer: WhatsApp → Perangkat tertaut → Tautkan perangkat, lalu pindai kode QR. Dari HP: masukkan nomor dan ketik kode tautan 8 karakter di WhatsApp.</li>
        <li><strong>Uji.</strong> Kirim pertanyaan nyata orang tua dari nomor lain, lalu perbaiki instruksi sampai jawabannya pas.</li>
      </ol>
      <p>Contoh instruksi untuk sekolah fiktif. Ganti dengan data sekolah Anda:</p>
      <pre>{prompt}</pre>
    </>,
  },
];

export default function ChatbotSekolahPage() {
  return <QaPost
    href={href}
    heading={<>Chatbot WhatsApp untuk sekolah.<br /><span>Gratis, 24 jam, dan bisa menjawab telepon.</span></>}
    lead="Setiap musim pendaftaran, WhatsApp sekolah dibanjiri pertanyaan yang sama: biaya, jadwal, syarat. Di sini kami menjawab satu per satu apa yang bisa dilakukan chatbot WhatsApp dengan AI untuk sekolah, bimbel, dan kampus, berapa biaya alternatifnya, apa kata UU PDP, dan cara memasangnya gratis, lengkap dengan agen suara."
    verdict={{
      title: "Jawaban singkat",
      body: <>Ya, sekolah bisa memakai chatbot WhatsApp dengan AI secara gratis lewat <strong>Wapzen</strong>: menjawab orang tua 24 jam dari brosur dan rincian biaya sekolah, mengirim link pendaftaran resmi, dan agen suaranya menjawab telepon WhatsApp. <strong>Semua fitur gratis sekarang</strong>, tanpa biaya Meta per pesan, karena terhubung ke nomor sekolah sebagai perangkat tertaut.</>,
    }}
    facts={[["Harga", "Gratis sekarang"], ["Biaya Meta", "Tidak ada"], ["Telepon", "Agen suara gratis"], ["Koneksi", "Kode QR atau kode tautan"]]}
    indexTitle="10 pertanyaan dalam panduan ini"
    answerLabel="Jawaban"
    questions={questions}
    sources={sources}
    related={["/id/blog/chatbot-whatsapp-travel-umroh", "/blog/free-whatsapp-ai-agent"]}
    cta={{ heading: <>WhatsApp sekolah yang selalu menjawab.<br /><span>Gratis, siang dan malam.</span></>, body: "Buat agen AI, unggah informasi sekolah, dan hubungkan nomor dalam hitungan menit. Tanpa kartu kredit dan tanpa API Meta." }}
  />;
}
