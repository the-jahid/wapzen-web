import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Samples } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Topik dari riset Indonesia (2026-11-15, docs/seo-blog-indonesia-research.mjs, lihat
// docs/seo-research.md "Indonesia business posts"): klaster kuliner 551; "cara pesan makanan
// di whatsapp" 30, "contoh format order whatsapp makanan" 18, "pesan makanan lewat whatsapp",
// "whatsapp restoran", "chatbot cafe". Penyediaan akomodasi dan makan-minum adalah kelompok
// UMKM non-pertanian terbesar kedua: 6,41 juta dari 30,21 juta unit per 31 Desember 2025
// (Kementerian UMKM via Databoks, 22 April 2026). Wajib halal UMK makanan dan minuman mulai
// 18 Oktober 2026 (BPJPH, PP 42/2024). Komisi GoFood 20% + Rp 1.000 per produk sejak 2021
// (Kontan, 20 Maret 2021); angka 2026 untuk merchant belum terkonfirmasi, jadi posting
// menyebut tahunnya dan meminta pembaca mengecek aplikasi mitra.
// Aturan copy sama dengan posting olshop: "gratis" atas permintaan user, tidak pernah
// "unlimited" atau "selamanya", tanpa kata batas balasan dan blokir. Wapzen tidak memesan
// kurir, tidak menerima pembayaran, tidak punya kalender reservasi (Take Order dipakai sebagai
// permintaan pesanan atau reservasi, posting meminta pembaca mengujinya), dan tidak tahu status
// dapur. Suara disebut berfungsi, dengan CTA WhatsApp.
const href = "/id/blog/order-makanan-via-whatsapp";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Halo, saya ingin mengaktifkan agen suara Wapzen untuk nomor WhatsApp usaha kuliner saya.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "id", article: { publishedTime: post.published, modifiedTime: post.updated } });

const handles = [
  ["“Menu hari ini apa aja?”", "Ya", "Dari menu harian yang Anda tulis, plus foto menunya"],
  ["“Ayam geprek masih ada?”", "Ya", "Dari daftar menu. Tulis “habis” saat stok habis"],
  ["“Antar ke Rungkut ongkirnya berapa?”", "Ya", "Dari tabel ongkir per area atau jarak yang Anda tulis"],
  ["“Hari Minggu buka? Sampai jam berapa?”", "Ya", "Dari jam buka Anda"],
  ["“Pesan nasi kotak 100 untuk Sabtu”", "Ya, sebagai permintaan", "Mencatat pesanan, Anda yang mengonfirmasi tanggal dan DP"],
  ["“Sudah bersertifikat halal?”", "Ya", "Hanya dari keterangan halal yang Anda tulis, misalnya nomor sertifikat"],
  ["“Pedas gak? Ada yang tanpa kacang?”", "Sebagian", "Dari keterangan menu. Alergi berat diserahkan ke Anda"],
  ["Voice note berisi pesanan", "Ya", "Mengubahnya jadi teks, lalu memproses pesanannya"],
  ["“Pesanan saya kok belum sampai?”", "Diserahkan", "Agen tidak tahu status dapur atau kurir. Admin yang membalas"],
  ["“Bisa lewat GoFood aja?”", "Ya", "Mengirim link toko Anda di aplikasi pesan-antar, jika Anda tulis"],
];

const turns = [
  { from: "patient" as const, text: "Kak, nasi bakar cumi masih ada? Mau 3 porsi diantar ke Rungkut" },
  { from: "agent" as const, text: "Halo Kak, saya admin virtual Dapur Ratna. Nasi bakar cumi masih ada, Rp 28.000 per porsi, dan ongkir ke Rungkut Rp 10.000. Mau sekalian minumnya? Es teh Rp 5.000." },
  { from: "patient" as const, text: "Tambah es teh 3. Bayar QRIS bisa?" },
  { from: "agent" as const, text: "Bisa, Kak. Boleh minta nama dan alamat lengkap untuk pengantaran?" },
  { from: "patient" as const, text: "Andi, Perum Rungkut Asri blok C-7" },
  { from: "agent" as const, text: "Saya cek ya: 3 nasi bakar cumi Rp 84.000 + 3 es teh Rp 15.000 + ongkir Rp 10.000 = Rp 109.000, bayar QRIS, diantar ke Andi, Perum Rungkut Asri blok C-7. Sudah benar, Kak?" },
  { from: "patient" as const, text: "Iya bener" },
  { from: "agent" as const, text: "📷 QRIS Dapur Ratna" },
  { from: "agent" as const, text: "Pesanan #1057 sudah kami catat dan diteruskan ke dapur. Silakan bayar lewat QRIS di atas. Admin kami akan mengabari di chat ini saat pesanan diantar." },
];

const formats = [
  { title: "Format order makanan (antar)", text: "FORMAT ORDER DAPUR RATNA\nNama:\nNo. HP:\nAlamat lengkap + patokan:\nPesanan (menu + jumlah):\nCatatan (level pedas, tanpa sambal, dll.):\nJam antar: secepatnya / jam ...\nPembayaran: transfer / QRIS / bayar di tempat" },
  { title: "Format pre-order kue atau katering", text: "FORMAT PRE-ORDER DAPUR RATNA\nNama:\nNo. HP:\nTanggal dan jam acara:\nMenu + jumlah porsi atau kotak:\nDiambil / diantar (alamat):\nCatatan:\nPre-order paling lambat H-3, DP 50% untuk mengunci tanggal." },
  { title: "Konfirmasi pesanan", text: "Terima kasih, Kak Andi! Pesanan Kakak: 3 nasi bakar cumi dan 3 es teh, total Rp 109.000 termasuk ongkir. Pesanan diantar sekitar 45 menit lagi ke Perum Rungkut Asri blok C-7." },
  { title: "Pesanan sedang diantar", text: "Kak Andi, pesanan Kakak sudah dalam perjalanan bersama kurir kami, Mas Budi. Selamat menikmati!" },
  { title: "Menu habis", text: "Mohon maaf, Kak, nasi bakar cumi hari ini sudah habis. Yang masih ada nasi bakar ayam suwir dan nasi bakar teri, harganya sama. Mau diganti salah satunya?" },
  { title: "Pelanggan lama, menu baru", text: "Halo Kak Sari, mulai minggu ini Dapur Ratna punya menu baru: rawon daging Rp 32.000. Mau dicoba untuk makan siang besok?" },
];

const orderInstructions = `Untuk setiap pesanan, minta: menu dan jumlah, catatan (level pedas, tanpa sambal), diambil atau diantar, alamat lengkap dengan patokan jika diantar, jam antar, dan cara bayar (transfer, QRIS, atau bayar di tempat).
Untuk pre-order dan katering, minta juga tanggal dan jam acara. Sampaikan aturan minimal H-3 dan DP 50%, dan bilang tanggalnya dikonfirmasi admin.
Hitung total dari harga menu dan tabel ongkir. Ulangi semua rinciannya, lalu catat pesanan hanya setelah pelanggan menjawab benar.`;

const prompt = `Kamu adalah admin virtual Dapur Ratna, rumah makan dan katering rumahan di Surabaya.
Sebutkan di pesan pertama bahwa kamu admin virtual. Panggil pelanggan "Kak".
Jawab dalam bahasa pelanggan, ramah dan singkat, dua sampai tiga kalimat, satu pertanyaan sekali kirim.
Jawab menu, harga, ketersediaan, jam buka, ongkir dan area antar hanya dari informasi Dapur Ratna. Menu hari ini tertulis di bawah. Jangan mengarang menu, harga, promo atau waktu antar.
Jika ada menu yang habis, tawarkan menu lain yang mirip.
Jika ditanya halal, jawab hanya dari keterangan halal di informasi Dapur Ratna.
Jika pelanggan menyebut alergi, jelaskan bahan menu yang tertulis, lalu bilang admin akan memastikan. Jangan pernah menjamin makanan bebas alergen.
Pembayaran hanya ke rekening atau QRIS atas nama Dapur Ratna. Jangan pernah menyatakan pembayaran sudah diterima, admin yang mengecek.
Untuk pesanan yang terlambat, komplain dan pembatalan, minta maaf singkat dan bilang admin akan membalas di chat ini.

Menu hari ini: (perbarui setiap pagi)`;

const costs = [
  ["Komisi per pesanan", "Persentase dari setiap pesanan (GoFood: 20% + Rp 1.000 per produk sejak 2021)", "Tidak ada", "Tidak ada"],
  ["Biaya per pesan", "Tidak ada", "1.000 balasan pertama per bulan per nomor gratis, lalu US$0,025 per pesan", "Tidak ada"],
  ["Pengantaran", "Driver aplikasi", "Kurir Anda sendiri", "Kurir Anda sendiri atau pesan driver manual"],
  ["Hubungan dengan pelanggan", "Lewat aplikasi", "Langsung dengan Anda", "Langsung dengan Anda, di nomor yang sudah ada"],
  ["Pelanggan baru", "Ya, dari pencarian di aplikasi", "Tidak, pelanggan harus menghubungi Anda", "Tidak, pelanggan harus menghubungi Anda"],
];

const fit = [
  ["Warung, rumah makan atau kedai yang menerima pesanan lewat WhatsApp", "Ya", "Menjawab menu, harga dan ongkir, lalu mencatat pesanan saat dapur sibuk"],
  ["Katering, nasi kotak dan tumpeng", "Ya", "Menjelaskan aturan pre-order dan DP, lalu mencatat permintaannya"],
  ["Toko kue, frozen food dan makanan rumahan", "Ya", "Mengirim katalog dan mencatat pre-order"],
  ["Kafe dan kedai kopi", "Ya", "Menjawab menu, jam buka dan permintaan reservasi meja"],
  ["Restoran yang ingin pesanan masuk otomatis ke mesin kasir", "Perlu tool API", "Tanpa sambungan ke sistem kasir, pesanan dicatat di dasbor Wapzen"],
  ["Usaha yang mengandalkan pelanggan baru dari aplikasi pesan-antar", "Sebagai tambahan", "WhatsApp tidak mendatangkan pembeli baru sendiri; aplikasi tetap berguna untuk itu"],
];

const sources = [
  { label: "Databoks: 30,21 juta UMKM non-pertanian pada 2025 dan sektornya (Kementerian UMKM, 22 April 2026)", href: "https://databoks.katadata.co.id/ekonomi-makro/statistik/69e8550c3162d/ada-30-juta-umkm-non-pertanian-di-indonesia-pada-2025-ini-sektor-usahanya" },
  { label: "BPJPH: sambut Wajib Halal Oktober 2026", href: "https://bpjph.halal.go.id/read/sambut-wajib-halal-oktober-2026-kepala-bpjph-serukan-tertib-halal-sebagai-strategi-penguatan-bisnis" },
  { label: "Kontan: komisi platform antar makanan naik (20 Maret 2021)", href: "https://insight.kontan.co.id/news/komisi-platorm-antar-makanan-naik-pemerintah-berencana-mengatur-besaran" },
  { label: "Meta: harga WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Zernio: tarif WhatsApp per negara, daftar 1 Oktober 2026", href: "https://zernio.com/whatsapp-api-pricing" },
  { label: "WhatsApp Business Messaging Policy", href: "https://business.whatsapp.com/policy" },
];

const questions = [
  {
    id: "gratis",
    q: "Apakah ada chatbot WhatsApp gratis untuk usaha kuliner?",
    answer: "Ada. Wapzen memasang admin AI di nomor WhatsApp usaha kuliner Anda, gratis: menjawab menu, harga, jam buka dan ongkir 24 jam, mengirim foto menu dan QRIS, memahami voice note, lalu mencatat pesanan setelah pelanggan mengonfirmasi dan meneruskannya ke WhatsApp dapur. Tanpa kartu kredit, tanpa API Meta, dan tanpa komisi per pesanan.",
    body: <>
      <p>Saat jam makan siang, chat datang bersamaan dengan pelanggan yang antre di depan. Yang memegang HP biasanya juga yang memasak atau melayani, jadi chat terlambat dibalas dan pesanan hilang. Admin AI membalas setiap chat dalam hitungan detik, dari menu dan harga yang Anda berikan.</p>
      <p><strong>Wapzen</strong> menghubungkan nomor usaha sebagai perangkat tertaut, seperti WhatsApp Web, jadi HP Anda tetap bisa dipakai dan Anda tetap bisa ikut membalas. <strong>Semuanya gratis</strong>: model AI sudah termasuk, tidak perlu API key atau programmer.</p>
      <p>Cocok untuk warung, rumah makan, katering, nasi kotak, toko kue, frozen food, kafe dan kedai kopi. Penyediaan makan-minum dan akomodasi adalah kelompok UMKM non-pertanian terbesar kedua di Indonesia: 6,41 juta dari 30,21 juta unit usaha per akhir 2025, menurut data Kementerian UMKM.</p>
    </>,
  },
  {
    id: "kenapa-whatsapp",
    q: "Kenapa usaha kuliner perlu menerima order makanan via WhatsApp?",
    answer: "Karena pesanan langsung tidak dipotong komisi. Aplikasi pesan-antar memotong persentase dari setiap pesanan: pada 2021 GoFood menaikkan komisinya menjadi 20% + Rp 1.000 per produk. Pelanggan yang sudah kenal Anda bisa memesan langsung lewat WhatsApp, dan kontak mereka menjadi milik Anda.",
    body: <>
      <p>Contoh sederhana: 300 pesanan per bulan dengan rata-rata Rp 60.000 adalah omzet Rp 18 juta. Dengan komisi 20%, sekitar <strong>Rp 3,6 juta per bulan</strong> berpindah ke aplikasi, belum termasuk biaya per produk. Setiap pelanggan lama yang beralih memesan langsung lewat WhatsApp mengurangi angka itu.</p>
      <ul>
        <li><strong>Aplikasi pesan-antar tetap berguna</strong> untuk pelanggan baru yang mencari makanan di aplikasi.</li>
        <li><strong>WhatsApp untuk pelanggan tetap</strong>, pesanan kantor, katering dan pre-order: tidak ada komisi, dan Anda bisa menyapa mereka lagi.</li>
        <li><strong>Masalahnya hanya kecepatan membalas</strong> saat dapur sibuk. Itulah tugas admin AI.</li>
      </ul>
      <Note>Besaran komisi berbeda per platform, kota dan paket mitra, dan bisa berubah. Cek angka terbaru di aplikasi mitra Anda.</Note>
    </>,
  },
  {
    id: "tugas",
    q: "Pertanyaan pelanggan apa saja yang bisa dijawab chatbot restoran?",
    answer: "Pertanyaan yang setiap hari diulang: menu hari ini, harga, ketersediaan, jam buka, area antar dan ongkir, cara bayar, halal, level pedas dan bahan, serta aturan pre-order dan katering. Agen memahami voice note dan foto, dan mencatat pesanan. Status dapur, kurir dan komplain tetap dijawab admin.",
    body: <>
      <Comparison caption="Chat usaha kuliner sehari-hari dan cara admin AI menanganinya" columns={["Bisa?", "Caranya"]} rows={handles} />
      <p>Agen hanya menjawab dari informasi yang Anda berikan. Jika suatu menu atau harga tidak tertulis, agen bilang terus terang dan tidak menebak.</p>
    </>,
  },
  {
    id: "format-order",
    q: "Apa contoh format order WhatsApp untuk makanan?",
    answer: "Format order makanan meminta nama, nomor HP, alamat lengkap dengan patokan, menu dan jumlah, catatan seperti level pedas, jam antar, dan cara bayar. Untuk pre-order kue dan katering, tambahkan tanggal acara dan aturan DP. Dengan admin AI, pelanggan cukup menulis seperti biasa: agen menanyakan yang kurang lalu mengulang pesanannya.",
    body: <>
      <p>Contoh format dan pesan yang bisa disalin. Ganti nama usaha, menu dan harga dengan milik Anda:</p>
      <Samples items={formats} locale="id" />
      <p>Simpan format order di informasi usaha Anda, dan agen akan mengirimkannya jika pelanggan meminta. Pesan “sedang diantar” dan info menu baru Anda kirim sendiri. Saat pelanggan membalas, agen melanjutkan percakapannya.</p>
    </>,
  },
  {
    id: "terima-pesanan",
    q: "Bagaimana AI menerima pesanan makanan sampai masuk ke dapur?",
    answer: "Aktifkan Take Order (catat pesanan) dan tulis rincian yang harus ditanyakan. Agen menanyakan menu, jumlah, alamat dan cara bayar, menghitung total, mengulang pesanan, dan baru mencatatnya setelah pelanggan menjawab benar. Pesanan masuk ke halaman Orders, dan pemberitahuan bisa dikirim ke WhatsApp dapur atau kasir.",
    body: <>
      <p>Contoh percakapan dengan usaha fiktif:</p>
      <ChatExample
        business="Dapur Ratna"
        labels={{ subtitle: "WhatsApp · admin AI", agent: "Admin AI: ", patient: "Pelanggan: " }}
        turns={turns}
        caption="Percakapan ilustrasi untuk usaha fiktif. Menu, harga dan ongkir diambil dari informasi yang diberikan pemilik; baris 📷 adalah gambar QRIS yang dikirim agen."
        points={[
          { title: "Menawarkan pelengkap", body: "Jika Anda menulis dalam instruksi untuk menawarkan minuman, agen menawarkannya sekali, tanpa memaksa." },
          { title: "Total yang jelas", body: "Agen menghitung menu dan ongkir dari daftar Anda, lalu mengulang semuanya sebelum mencatat." },
          { title: "Langsung ke dapur", body: "Setiap pesanan baru atau yang berubah dikirim ke nomor WhatsApp dapur atau kasir yang Anda isi." },
          { title: "Pembayaran tetap dicek admin", body: "Agen mengirim QRIS atas nama usaha Anda, tetapi tidak menyatakan pembayaran sudah masuk." },
        ]}
      />
      <p>Contoh instruksi pesanan untuk Take Order:</p>
      <pre>{orderInstructions}</pre>
      <ul>
        <li><strong>Nama dan nomor WhatsApp pelanggan</strong> tersimpan otomatis bersama pesanan.</li>
        <li><strong>Pesanan tidak dobel:</strong> jika pelanggan menambah menu sesaat setelah memesan, pesanan yang sama diperbarui.</li>
        <li><strong>Uji dulu</strong> dengan beberapa pesanan buatan dari nomor lain sebelum jam ramai.</li>
      </ul>
      <InlineCta title="Terima pesanan saat dapur sibuk" body="Gratis, tanpa kartu kredit, tanpa API Meta, dan tanpa komisi per pesanan." label="Mulai gratis" />
    </>,
  },
  {
    id: "menu",
    q: "Bagaimana dengan menu harian, menu habis dan foto menu?",
    answer: "Menu tetap dan harga ditulis di basis pengetahuan (Knowledge Base). Menu harian yang berganti setiap hari lebih cepat ditulis di akhir instruksi agen setiap pagi. Foto menu, daftar harga dan QRIS diunggah di Images & Files, masing-masing dengan catatan kapan dikirim. Saat menu habis, tulis “habis” agar agen menawarkan pengganti.",
    body: <>
      <ul>
        <li><strong>Basis pengetahuan adalah yang dibaca agen.</strong> Satu baris per menu: nama, harga, porsi, level pedas dan bahan utama. Teks biasa lebih akurat daripada poster menu.</li>
        <li><strong>Images & Files adalah yang dikirim agen.</strong> Foto menu terkirim sebagai foto WhatsApp, PDF katalog katering sebagai dokumen, saat pesan pelanggan cocok dengan catatan Anda.</li>
        <li><strong>Menu habis:</strong> perbarui begitu stok habis. Agen tidak tahu isi dapur dengan sendirinya.</li>
        <li><strong>Website atau link menu:</strong> masukkan alamat website usaha Anda di kartu Web Search, dan agen membaca halaman di situs itu.</li>
      </ul>
    </>,
  },
  {
    id: "antar",
    q: "Bagaimana dengan ongkir dan pengantaran?",
    answer: "Tulis tabel ongkir per area atau per jarak, area yang dilayani, dan minimal pesanan. Agen menghitung ongkir dari tabel itu. Wapzen tidak memesan driver: Anda mengantar dengan kurir sendiri, atau memesan GoSend atau GrabExpress secara manual. Agen juga tidak tahu posisi kurir.",
    body: <>
      <ul>
        <li><strong>Tabel sederhana sudah cukup:</strong> misalnya “Rungkut dan Tenggilis Rp 10.000, Gubeng Rp 15.000, di luar itu ambil sendiri atau pakai ojek online”.</li>
        <li><strong>Minimal pesanan dan jam antar:</strong> tulis dengan jelas, misalnya “gratis ongkir minimal Rp 150.000” atau “antar terakhir pukul 20.00”.</li>
        <li><strong>Ambil sendiri:</strong> tulis alamat dan link Google Maps, dan agen akan mengirimkannya.</li>
      </ul>
    </>,
  },
  {
    id: "katering",
    q: "Bisakah AI menerima pre-order katering, nasi kotak dan reservasi meja?",
    answer: "Bisa sebagai permintaan. Agen menjelaskan aturan Anda, misalnya minimal H-3, minimal 30 kotak dan DP 50%, lalu mencatat tanggal, jumlah dan menu setelah pelanggan mengonfirmasi. Wapzen tidak punya kalender, jadi Anda yang mengonfirmasi tanggal, kapasitas dapur dan DP. Reservasi meja dicatat dengan cara yang sama.",
    body: <>
      <p>Take Order dibuat untuk pesanan, jadi untuk katering dan reservasi ia berfungsi sebagai formulir permintaan. Uji dulu dengan beberapa permintaan buatan sebelum dipakai.</p>
      <ul>
        <li><strong>Kirim katalog katering</strong> dalam satu PDF berisi paket, harga per kotak dan foto.</li>
        <li><strong>Konfirmasi cepat:</strong> pemberitahuan pesanan ke WhatsApp Anda membantu membalas permintaan katering besar sebelum pelanggan mencari tempat lain.</li>
        <li><strong>DP tetap dicek admin.</strong> Agen tidak pernah menyatakan tanggal sudah terkunci.</li>
      </ul>
    </>,
  },
  {
    id: "halal",
    q: "Bagaimana chatbot menjawab pertanyaan halal?",
    answer: "Hanya dari keterangan yang Anda tulis. Mulai 18 Oktober 2026, seluruh produk makanan dan minuman usaha mikro dan kecil wajib bersertifikat halal, menurut BPJPH berdasarkan PP 42/2024. Tulis nomor sertifikat halal Anda di basis pengetahuan, dan agen menyebutnya saat ditanya. Jangan biarkan agen menjawab “halal” tanpa dasar.",
    body: <>
      <ul>
        <li><strong>Sudah bersertifikat:</strong> tulis nomor sertifikat dan menu yang tercakup.</li>
        <li><strong>Ada menu yang tidak halal:</strong> tulis dengan jelas, dan agen akan menyampaikannya apa adanya.</li>
        <li><strong>Sedang diproses:</strong> tulis statusnya dengan jujur, dan instruksikan agen untuk tidak menyebut “halal” sebelum sertifikat terbit.</li>
      </ul>
      <Note>Ini panduan umum, bukan nasihat hukum. Cek kewajiban dan cara pengurusan sertifikat halal untuk usaha Anda di BPJPH.</Note>
    </>,
  },
  {
    id: "telepon",
    q: "Bisakah menjawab pelanggan yang menelepon untuk pesan makanan?",
    answer: "Bisa, agen suara sudah berfungsi. Agen suara Wapzen menjawab telepon WhatsApp ke nomor usaha dengan suara natural dalam bahasa Indonesia, memakai menu dan harga yang sama dengan agen chat. Hanya untuk telepon WhatsApp, bukan telepon biasa, dan tidak bisa mengalihkan panggilan ke admin. Untuk pesanan, minta penelepon mengirim rinciannya lewat chat.",
    body: <>
      <p>Pelanggan yang lebih tua dan pesanan kantor sering datang lewat telepon. Agen suara menjawab soal menu, harga dan jam buka, lalu agen chat mencatat pesanannya secara tertulis, tempat pesanan dikonfirmasi dan disimpan.</p>
      <InlineCta href={voiceAccess} title="Jawab telepon saat dapur sibuk" body="Kirim pesan ke tim kami di WhatsApp, dan kami aktifkan agen suara untuk nomor usaha Anda." label="Hubungi kami di WhatsApp" />
    </>,
  },
  {
    id: "biaya",
    q: "Berapa biaya order makanan via WhatsApp dibanding aplikasi pesan-antar dan API resmi?",
    answer: "Dengan Wapzen gratis: tanpa komisi per pesanan dan tanpa biaya Meta per pesan, karena tidak memakai API resmi. Aplikasi pesan-antar memotong komisi dari setiap pesanan tetapi menyediakan driver dan pelanggan baru. API resmi tidak memotong komisi, tetapi Meta menagih US$0,025 per balasan setelah 1.000 balasan gratis per bulan, ditambah langganan platform.",
    body: <>
      <Comparison caption="Order makanan: aplikasi pesan-antar, WhatsApp Business API resmi dan Wapzen" columns={["Aplikasi pesan-antar", "WhatsApp Business API resmi", "Wapzen"]} rows={costs} />
      <p>Ketiganya bisa berjalan bersama: aplikasi untuk pelanggan baru, WhatsApp untuk pelanggan tetap, katering dan pesanan besar.</p>
      <Note>Tarif Meta dalam dolar AS dari daftar 1 Oktober 2026 dan berubah tiap kuartal. Komisi aplikasi pesan-antar berbeda per platform dan paket mitra.</Note>
    </>,
  },
  {
    id: "promo",
    q: "Bisakah AI mengirim promo dan menu baru ke pelanggan secara otomatis?",
    answer: "Tidak di Wapzen. Agen membalas saat pelanggan menulis, dan tidak mengirim promo atau pengingat sendiri. Kirim info menu baru dari HP atau dasbor ke pelanggan yang pernah memesan, dan saat mereka membalas, agen melanjutkan percakapan dan mencatat pesanannya. Broadcast otomatis butuh WhatsApp Business API resmi dengan template berbayar.",
    body: <>
      <p>Kebijakan WhatsApp meminta bisnis hanya mengirim pesan ke orang yang memberikan nomornya dan setuju dihubungi. Kirim ke pelanggan sendiri, jangan membeli daftar nomor, dan berhenti jika seseorang meminta. Status WhatsApp dengan foto menu hari ini juga cara gratis untuk mengingatkan pelanggan.</p>
      <ul>
        <li><strong>Link dan kode QR:</strong> buat link WhatsApp dengan pesan otomatis “Halo, saya mau pesan” lewat <Link href="/tools/whatsapp-link-generator">pembuat link WhatsApp</Link> kami, dan cetak kode QR-nya untuk meja, kemasan dan stiker lewat <Link href="/tools/whatsapp-qr-code-generator">pembuat kode QR WhatsApp</Link> (bahasa Inggris).</li>
      </ul>
    </>,
  },
  {
    id: "cara-pasang",
    q: "Bagaimana cara memasang chatbot order makanan di WhatsApp?",
    answer: "Sekitar sepuluh menit: daftar gratis, klik New chat agent, tautkan nomor usaha dengan kode tautan 8 karakter dari HP atau kode QR dari komputer, lalu beri nama agen. Tempel instruksi, unggah menu, harga dan tabel ongkir, tambahkan foto menu dan QRIS, aktifkan Take Order dengan nomor dapur, lalu uji dari nomor lain.",
    body: <>
      <ol>
        <li><strong>Siapkan instruksi lebih dulu.</strong> Agen mulai membalas begitu nomor tertaut.</li>
        <li><strong>Daftar gratis.</strong> Tanpa kartu kredit dan tanpa API key.</li>
        <li><strong>Tautkan nomor.</strong> Di HP: WhatsApp › Perangkat tertaut › Tautkan perangkat › Tautkan dengan nomor telepon saja, lalu masukkan kode 8 karakter. Di komputer: pindai kode QR.</li>
        <li><strong>Isi informasi usaha:</strong> menu, harga, jam buka, area dan tabel ongkir, cara bayar, keterangan halal dan aturan katering di Knowledge Base; foto menu, katalog dan QRIS di Images & Files.</li>
        <li><strong>Aktifkan Take Order,</strong> tulis instruksi pesanan, dan isi nomor dapur atau kasir di Order alerts on WhatsApp.</li>
        <li><strong>Uji seperti pelanggan sungguhan</strong> dari nomor lain: pesan lewat voice note, ganti menu di tengah jalan, tanya halal, pesan katering untuk besok, dan komplain soal keterlambatan.</li>
      </ol>
      <p>Nama menu di atas dalam bahasa Inggris. Jika dasbor tampil dalam bahasa Indonesia lewat terjemahan otomatis, namanya bisa sedikit berbeda. Contoh instruksi untuk usaha fiktif, ganti dengan data usaha Anda:</p>
      <pre>{prompt}</pre>
    </>,
  },
  {
    id: "tidak-bisa",
    q: "Apa yang tidak bisa dilakukan chatbot kuliner di Wapzen?",
    answer: "Agen tidak memesan driver, tidak tahu status dapur atau posisi kurir, tidak menerima pembayaran atau melihat mutasi, tidak mengirim promo sendiri, dan tidak terhubung sendiri ke mesin kasir atau aplikasi pesan-antar. Karena bukan API resmi Meta, tidak ada centang hijau. Wapzen adalah produk independen, bukan milik Meta atau WhatsApp.",
    body: <>
      <Comparison caption="Untuk usaha kuliner mana chatbot WhatsApp gratis seperti Wapzen cocok" columns={["Cocok?", "Alasannya"]} rows={fit} />
      <ul>
        <li><strong>Bekerja di nomor yang sudah ada,</strong> WhatsApp biasa atau WhatsApp Business, sebagai perangkat tertaut.</li>
        <li><strong>Grup WhatsApp pelanggan atau kantor:</strong> agen diam di grup kecuali Anda mengaktifkannya untuk grup itu, dan di sana agen hanya membalas saat disebut (tag) atau dibalas.</li>
        <li><strong>Pelanggan bisa meminta admin.</strong> Setiap percakapan punya sakelar AI, jadi Anda bisa mematikan AI untuk satu pelanggan, membalas sendiri, lalu menyalakannya lagi.</li>
      </ul>
    </>,
  },
];

export default function OrderMakananViaWhatsAppPage() {
  return <QaPost
    href={href}
    heading={<>Order makanan via WhatsApp.<br /><span>Chatbot gratis yang mencatat pesanan saat dapur sibuk.</span></>}
    lead="Pelanggan warung, rumah makan, katering dan kedai kopi memesan lewat WhatsApp, sering kali tepat saat dapur paling sibuk. Di sini kami menjawab 14 pertanyaan pemilik usaha kuliner sebelum menyerahkan chat ke AI: kenapa pesanan langsung lebih menguntungkan, contoh format order makanan yang bisa disalin, cara AI mencatat pesanan sampai ke dapur, ongkir, katering, pertanyaan halal, biaya dan cara memasangnya gratis."
    verdict={{
      title: "Jawaban singkat",
      body: <>Usaha kuliner bisa menerima order makanan via WhatsApp dengan admin AI gratis lewat <strong>Wapzen</strong>, di nomor yang sudah dikenal pelanggan: menjawab menu, harga dan ongkir 24 jam, mengirim foto menu dan QRIS, memahami voice note, lalu mencatat pesanan setelah dikonfirmasi dan meneruskannya ke WhatsApp dapur. Pengantaran dan cek pembayaran tetap di tangan Anda. <strong>Gratis</strong>, tanpa komisi dan tanpa API Meta.</>,
    }}
    facts={[["Harga", "Gratis, tanpa kartu"], ["Komisi", "Tidak ada"], ["Nomor", "Nomor usaha yang sudah ada"], ["Pesanan", "Dikirim ke WhatsApp dapur"]]}
    indexTitle="14 pertanyaan dalam panduan ini"
    answerLabel="Jawaban"
    questions={questions}
    sources={sources}
    related={["/id/blog/admin-online-shop-ai", "/blog/whatsapp-order-taking-chatbot"]}
    cta={{ heading: <>Setiap pesanan langsung dibalas.<br /><span>Gratis, tanpa komisi.</span></>, body: "Buat agen AI, unggah menu dan harga, dan tautkan nomor usaha Anda dalam hitungan menit. Tanpa kartu kredit dan tanpa API Meta." }}
  />;
}
