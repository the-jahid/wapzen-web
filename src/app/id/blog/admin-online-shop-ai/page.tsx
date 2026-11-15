import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/pageMetadata";
import { blogPost } from "@/lib/blogPosts";
import { Comparison, Samples } from "@/components/marketing/MarketingPage";
import { ChatExample } from "@/components/marketing/IndustryBlocks";
import { InlineCta, Note } from "@/components/blog/BlogPost";
import { QaPost } from "@/components/blog/QaPost";

// Topik dari riset Indonesia (2026-11-15, docs/seo-blog-indonesia-research.mjs, autocomplete
// Google, YouTube dan DuckDuckGo, gl=id, lihat docs/seo-research.md "Indonesia business
// posts"): klaster online shop 1.049, terkuat setelah klaster umum "gratis"; "contoh format
// order whatsapp" 34, "admin online shop" 30 (3/3), "ai untuk jualan online" 20, "cara jualan
// di whatsapp (business)" 19, "admin olshop" 19. Belum ada posting Indonesia untuk olshop.
// Fakta: BPS Statistik E-Commerce 2023 via GoodStats (28 Feb 2025): 95,33% usaha e-commerce
// berjualan lewat aplikasi pesan instan, 3,82 juta usaha, COD dipakai 75,19%. Potongan
// marketplace dari Katadata 22 Mei 2026 (mengutip Bisnison): Shopee 10-18%, Tokopedia
// 5-15,8%, TikTok Shop dengan afiliasi 20-35%. Tarif Meta Indonesia: daftar 1 Okt 2026 via
// Zernio, sama dengan posting umroh.
// Aturan copy: "gratis" atas permintaan user (sama seperti posting India 2026-11-14), meski
// server punya free trial (FREE_TRIAL_REPLIES); tidak pernah "unlimited" atau "selamanya";
// tanpa kata batas balasan dan tanpa kata blokir. Agen tidak mengirim broadcast atau
// follow-up sendiri (Bulk Messages sudah dihapus), tidak cek resi atau mutasi rekening, dan
// tidak membaca halaman marketplace (pembaca website tidak menjalankan JavaScript). Take Order
// mencatat pesanan setelah pembeli mengonfirmasi. Suara disebut berfungsi, dengan CTA WhatsApp.
const href = "/id/blog/admin-online-shop-ai";
const post = blogPost(href);
const voiceAccess = `https://wa.me/8801701750469?text=${encodeURIComponent("Halo, saya ingin mengaktifkan agen suara Wapzen untuk nomor WhatsApp toko online saya.")}`;

export const metadata: Metadata = pageMetadata({ title: post.title, description: post.description, path: href, locale: "id", article: { publishedTime: post.published, modifiedTime: post.updated } });

const handles = [
  ["“Kak, gamis yang hitam ready?”", "Ya", "Dari daftar stok yang Anda tulis. Perbarui setiap stok berubah"],
  ["“Harganya berapa, ada promo?”", "Ya", "Hanya harga dan promo yang tertulis, tidak mengarang diskon"],
  ["“Minta foto aslinya dong”", "Ya", "Mengirim foto produk yang Anda unggah"],
  ["“Tinggi 160 cm cocoknya ukuran apa?”", "Ya", "Mengirim size chart dan menyarankan ukuran dari tabel Anda"],
  ["Screenshot produk dari Instagram atau TikTok", "Ya", "Membaca fotonya, lalu menjawab dari katalog Anda"],
  ["Voice note pembeli", "Ya", "Mengubahnya jadi teks, lalu menjawab"],
  ["“Ongkir ke Medan berapa?”", "Sebagian", "Dari tabel ongkir yang Anda tulis. Tanpa tabel, agen tidak menebak"],
  ["“Bisa COD?”", "Ya", "Menjelaskan aturan COD Anda dan mencatat pesanannya"],
  ["Foto bukti transfer", "Tidak memastikan", "Bilang admin akan mengecek mutasi. Tidak pernah menyatakan dana sudah masuk"],
  ["“Paket saya sudah sampai mana?”", "Tidak", "Agen tidak bisa cek resi, kecuali dihubungkan ke sistem Anda lewat tool API"],
  ["“Barangnya cacat, mau retur”", "Diserahkan", "Menjelaskan kebijakan retur Anda, admin yang membalas"],
];

const turns = [
  { from: "patient" as const, text: "Kak, gamis Aira warna sage ready? Tinggi aku 158" },
  { from: "agent" as const, text: "Halo Kak, saya admin virtual Sekar Hijab. Gamis Aira warna sage ready ukuran M dan L, harganya Rp 189.000. Untuk tinggi 158 cm biasanya pas ukuran M. Ini size chart-nya ya, Kak." },
  { from: "agent" as const, text: "📷 Size chart gamis Aira" },
  { from: "patient" as const, text: "Oke M satu. Kirim ke Bekasi ongkirnya berapa? Bisa COD?" },
  { from: "agent" as const, text: "Ongkir reguler ke Bekasi Rp 12.000, estimasi 2–3 hari. COD bisa, bayar ke kurir saat paket sampai. Boleh minta nama penerima dan alamat lengkapnya, Kak?" },
  { from: "patient" as const, text: "Rina, Jl. Melati No. 12 RT 03/05, Bekasi Timur" },
  { from: "agent" as const, text: "Saya cek dulu ya: Gamis Aira sage M, 1 pcs, Rp 189.000 + ongkir Rp 12.000 = Rp 201.000, COD, a.n. Rina, Jl. Melati No. 12 RT 03/05, Bekasi Timur. Sudah benar, Kak?" },
  { from: "patient" as const, text: "Benar kak" },
  { from: "agent" as const, text: "Pesanan #1024 sudah tercatat. Admin kami akan mengirim nomor resi di chat ini setelah paket dikirim. Terima kasih, Kak Rina!" },
];

const formats = [
  { title: "Format order untuk pembeli", text: "FORMAT ORDER SEKAR HIJAB\nNama penerima:\nNo. HP:\nAlamat lengkap (jalan, RT/RW, kelurahan, kecamatan, kota, kode pos):\nPesanan (produk, warna, ukuran, jumlah):\nPembayaran: transfer / COD\nCatatan:" },
  { title: "Konfirmasi order (transfer)", text: "Terima kasih, Kak Rina! Pesanan Kakak: Gamis Aira sage M, 1 pcs. Total Rp 201.000 sudah termasuk ongkir. Silakan transfer ke rekening a.n. Sekar Hijab yang tertera di profil kami dalam 1×24 jam, lalu kirim bukti transfer di chat ini." },
  { title: "Konfirmasi COD sebelum kirim", text: "Halo Kak Rina, pesanan COD Kakak senilai Rp 201.000 siap kami kirim besok. Mohon balas YA jika pesanan dan alamat sudah benar, supaya paket tidak kembali di jalan. Terima kasih!" },
  { title: "Info resi", text: "Paket Kakak sudah dikirim lewat J&T, nomor resi JT0123456789. Bisa dicek di situs atau aplikasi kurirnya. Terima kasih sudah belanja di Sekar Hijab!" },
  { title: "Pesanan belum dibayar", text: "Halo Kak Dewi, pesanan Pashmina Nara 2 pcs masih kami simpan sampai pukul 21.00 hari ini. Jika masih berminat, silakan selesaikan pembayarannya ya. Jika tidak jadi, cukup balas BATAL." },
  { title: "Pembeli lama, produk baru", text: "Halo Kak Maya, gamis Aira yang Kakak tanyakan bulan lalu sekarang ada warna baru: dusty pink dan navy. Mau saya kirim fotonya?" },
];

const orderInstructions = `Untuk setiap pesanan, minta: nama penerima, alamat lengkap sampai kecamatan dan kota, produk dengan warna dan ukuran, jumlah, dan cara bayar (transfer atau COD).
Hitung total dari harga produk dan tabel ongkir. Ulangi semua rinciannya, lalu catat pesanan hanya setelah pembeli menjawab benar.`;

const prompt = `Kamu adalah admin virtual Sekar Hijab, toko online gamis, hijab dan pashmina.
Sebutkan di pesan pertama bahwa kamu admin virtual. Panggil pembeli "Kak".
Jawab dalam bahasa pembeli, ramah dan singkat, dua sampai tiga kalimat, satu pertanyaan sekali kirim.
Jawab harga, stok, warna, ukuran, bahan, ongkir dan promo hanya dari informasi toko. Jangan mengarang harga, diskon, stok atau estimasi pengiriman.
Jika pembeli bertanya ukuran, kirim size chart dan sarankan ukuran dari tabelnya.
Jika pembeli mengirim foto produk, cari produk yang sama di katalog. Jika tidak ada, bilang terus terang.
Pembayaran hanya ke rekening atas nama Sekar Hijab yang tertulis di informasi toko. Jangan pernah memberi nomor rekening lain.
Jika pembeli mengirim bukti transfer, ucapkan terima kasih dan bilang admin akan mengecek mutasi. Jangan pernah menyatakan pembayaran sudah diterima.
Untuk retur, barang cacat, paket hilang, cek resi dan komplain, jelaskan kebijakan toko jika ada, lalu bilang admin akan membalas di chat ini.`;

const costs = [
  ["Biaya langganan", "Tergantung vendor, biasanya per bulan", "Gratis"],
  ["Balasan ke pembeli", "1.000 balasan pertama per bulan per nomor gratis, lalu US$0,025 per pesan", "Tanpa biaya per pesan"],
  ["Pesan promo (marketing)", "US$0,0411 per pesan, dengan template yang disetujui Meta", "Tidak ada fitur broadcast, Anda kirim sendiri"],
  ["Pemasangan", "Akun Meta Business, penyedia platform, dan template yang harus disetujui", "Tautkan nomor toko dengan kode tautan atau kode QR"],
];

const fit = [
  ["Olshop rumahan yang kewalahan membalas chat", "Ya", "Menjawab harga, stok, ukuran dan ongkir dalam hitungan detik, 24 jam"],
  ["Toko fashion, hijab, skincare atau aksesori", "Ya", "Mengirim foto, size chart dan katalog, membaca screenshot pembeli"],
  ["Reseller dan dropshipper", "Ya", "Menjawab dari daftar harga dan mencatat pesanan untuk Anda proses"],
  ["Toko yang juga jualan di Shopee atau TikTok Shop", "Ya, untuk chat WhatsApp", "Pembeli yang menghubungi lewat WhatsApp terlayani tanpa potongan marketplace"],
  ["Toko dengan ribuan produk dan stok yang berubah tiap jam", "Perlu tool API", "Tanpa sistem stok yang tersambung, agen hanya tahu daftar yang Anda unggah"],
  ["Toko yang ingin broadcast promo otomatis", "Tidak", "Pakai WhatsApp Business API resmi dengan template berbayar"],
];

const sources = [
  { label: "GoodStats: 95% usaha e-commerce berjualan lewat aplikasi pesan instan (BPS, Statistik E-Commerce 2023)", href: "https://goodstats.id/article/mayoritas-usaha-e-commerce-berjualan-lewat-aplikasi-pesan-instan-HmFph" },
  { label: "Katadata: biaya admin marketplace naik, seller mulai lirik kanal penjualan mandiri (22 Mei 2026)", href: "https://katadata.co.id/digital/e-commerce/6a1025262a9ca/biaya-admin-marketplace-naik-seller-mulai-lirik-kanal-penjualan-mandiri" },
  { label: "Katadata: biaya di marketplace bisa tembus 30%, seller UMKM keluhkan margin (13 Mei 2026)", href: "https://katadata.co.id/digital/e-commerce/6a0448d937533/biaya-di-marketplace-bisa-tembus-30-seller-umkm-keluhkan-margin-kian-tipis" },
  { label: "Meta: harga WhatsApp Business Platform", href: "https://developers.facebook.com/docs/whatsapp/pricing" },
  { label: "Zernio: tarif WhatsApp per negara, daftar 1 Oktober 2026", href: "https://zernio.com/whatsapp-api-pricing" },
  { label: "WhatsApp Business Messaging Policy", href: "https://business.whatsapp.com/policy" },
  { label: "BPK: UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi", href: "https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022" },
];

const questions = [
  {
    id: "gratis",
    q: "Apakah ada admin online shop AI yang gratis di WhatsApp?",
    answer: "Ada. Wapzen memasang admin AI di nomor WhatsApp toko Anda, gratis: menjawab harga, stok, ukuran, ongkir dan COD 24 jam dari informasi toko Anda, mengirim foto produk dan size chart, memahami voice note dan screenshot, lalu mencatat pesanan setelah pembeli mengonfirmasi. Tanpa kartu kredit, tanpa API Meta, dan tanpa biaya per pesan.",
    body: <>
      <p>Chat olshop hampir selalu sama: “ready kak?”, “harganya berapa?”, “ukuran apa yang cocok?”, “ongkir ke sini berapa?”, “bisa COD?”. Admin manusia membalas satu per satu, sering terlambat saat malam atau saat chat menumpuk setelah live. Pembeli yang menunggu terlalu lama biasanya pindah ke toko lain.</p>
      <p><strong>Wapzen</strong> menghubungkan nomor toko sebagai perangkat tertaut, seperti WhatsApp Web, jadi HP Anda tetap bisa dipakai dan admin tetap bisa ikut membalas. <strong>Semuanya gratis</strong>: model AI sudah termasuk, tidak perlu API key atau programmer.</p>
      <p>Cocok untuk toko fashion, hijab, skincare, aksesori, reseller, dropshipper, dan toko yang juga berjualan di marketplace tetapi menerima banyak chat di WhatsApp. Ingin tahu cara kerjanya di balik layar? Baca <Link href="/blog/what-is-a-whatsapp-chatbot">apa itu chatbot WhatsApp</Link> (bahasa Inggris).</p>
    </>,
  },
  {
    id: "tugas-admin",
    q: "Apa saja tugas admin olshop yang bisa dikerjakan AI?",
    answer: "Hampir semua chat rutin: cek stok dan harga, mengirim foto produk dan size chart, menyarankan ukuran, menghitung total dengan ongkir, menjelaskan cara bayar dan COD, dan mencatat pesanan. Yang tetap dikerjakan admin: mengecek mutasi rekening, packing, input resi, retur dan komplain.",
    body: <>
      <Comparison caption="Chat online shop sehari-hari dan cara admin AI menanganinya" columns={["Bisa?", "Caranya"]} rows={handles} />
      <p>Agen hanya menjawab dari informasi yang Anda berikan. Jika suatu produk, harga atau ongkir tidak ada di sana, agen bilang terus terang dan tidak menebak. Jadi perbarui daftar stok dan harga setiap ada perubahan.</p>
    </>,
  },
  {
    id: "kenapa-whatsapp",
    q: "Kenapa jualan lewat WhatsApp masih penting untuk online shop?",
    answer: "Karena di sanalah pembeli bertanya dan memesan. Menurut Statistik E-Commerce 2023 BPS, 95,33% dari 3,82 juta usaha e-commerce di Indonesia berjualan lewat aplikasi pesan instan seperti WhatsApp. Sejak Mei 2026, biaya marketplace juga naik, sehingga pesanan langsung lewat WhatsApp, terutama dari pembeli lama, menjaga margin.",
    body: <>
      <p>Angka BPS itu jauh di atas media sosial (33,29%) dan website sendiri (1,77%). Banyak pembeli tetap ingin bertanya dulu ke penjual sebelum membayar, bahkan saat produknya ada di marketplace.</p>
      <p>Di sisi lain, Katadata (22 Mei 2026, mengutip Bisnison) mencatat potongan efektif di Shopee kini bisa mencapai <strong>10–18%</strong> dari harga jual, di Tokopedia <strong>5–15,8%</strong>, dan di TikTok Shop dengan afiliasi yang agresif <strong>20–35%</strong>. Untuk gamis seharga Rp 189.000, potongan 10–18% berarti sekitar Rp 19.000 sampai Rp 34.000 per potong.</p>
      <ul>
        <li><strong>Marketplace tetap berguna</strong> untuk menjangkau pembeli baru.</li>
        <li><strong>WhatsApp cocok untuk pembeli lama</strong> dan pembeli yang ingin bertanya dulu: tidak ada potongan per transaksi, dan Anda memegang kontak mereka.</li>
        <li><strong>Masalahnya hanya kecepatan membalas.</strong> Itulah tugas admin AI.</li>
      </ul>
    </>,
  },
  {
    id: "format-order",
    q: "Apa contoh format order WhatsApp untuk online shop?",
    answer: "Format order yang baik meminta nama penerima, nomor HP, alamat lengkap sampai kecamatan, kota dan kode pos, produk dengan warna, ukuran dan jumlah, cara bayar, dan catatan. Dengan admin AI, pembeli tidak perlu mengisi format: agen menanyakan rinciannya satu per satu, mengulanginya, lalu mencatat pesanan setelah pembeli menjawab benar.",
    body: <>
      <p>Contoh format dan pesan yang bisa disalin. Ganti nama toko, produk dan rekening dengan milik Anda:</p>
      <Samples items={formats} locale="id" />
      <p>Format order tetap berguna untuk pembeli yang suka mengisi sendiri: simpan di informasi toko, dan agen akan mengirimkannya jika diminta. Pesan konfirmasi COD, resi dan pengingat pembayaran Anda kirim sendiri. Jika pembeli membalas, agen melanjutkan percakapannya.</p>
    </>,
  },
  {
    id: "pesanan",
    q: "Bagaimana admin AI mencatat pesanan sampai selesai?",
    answer: "Aktifkan Take Order (catat pesanan) dan tulis rincian yang harus ditanyakan. Agen mengumpulkan rinciannya, menghitung total, mengulangi pesanan, dan baru mencatatnya setelah pembeli menjawab benar. Pesanan masuk ke halaman Orders di dasbor, dan pemberitahuan bisa dikirim ke WhatsApp admin.",
    body: <>
      <p>Contoh percakapan dengan toko fiktif:</p>
      <ChatExample
        business="Sekar Hijab"
        labels={{ subtitle: "WhatsApp · admin AI", agent: "Admin AI: ", patient: "Pembeli: " }}
        turns={turns}
        caption="Percakapan ilustrasi untuk toko fiktif. Harga, stok dan ongkir diambil dari informasi yang diunggah toko; baris 📷 adalah gambar size chart yang dikirim agen."
        points={[
          { title: "Jawaban dari katalog Anda", body: "Harga, warna dan ukuran yang disebut agen adalah yang Anda tulis. Agen tidak mengarang promo demi menutup penjualan." },
          { title: "Mengirim size chart", body: "Gambar yang Anda unggah dikirim saat pembeli bertanya soal ukuran." },
          { title: "Konfirmasi sebelum mencatat", body: "Agen mengulangi produk, total, cara bayar dan alamat, lalu mencatat pesanan hanya setelah pembeli menjawab benar." },
          { title: "Pesanan tidak dobel", body: "Jika pembeli menambah atau mengubah pesanan sesaat kemudian, pesanan yang sama diperbarui, bukan dibuat baru." },
        ]}
      />
      <p>Contoh instruksi pesanan untuk Take Order:</p>
      <pre>{orderInstructions}</pre>
      <ul>
        <li><strong>Nama dan nomor WhatsApp pembeli</strong> tersimpan otomatis bersama pesanan.</li>
        <li><strong>Pemberitahuan pesanan:</strong> isi nomor admin atau bagian packing di pengaturan Order alerts on WhatsApp, dan setiap pesanan baru atau yang berubah dikirim ke sana.</li>
        <li><strong>Uji dulu</strong> dengan beberapa pesanan buatan dari nomor lain sebelum dipakai untuk pembeli sungguhan.</li>
      </ul>
      <InlineCta title="Admin AI untuk olshop Anda" body="Gratis, tanpa kartu kredit dan tanpa API Meta, di nomor WhatsApp yang sudah dikenal pembeli Anda." label="Mulai gratis" />
    </>,
  },
  {
    id: "katalog",
    q: "Bagaimana agen mengirim foto produk, katalog dan size chart?",
    answer: "Ada dua tempat. Basis pengetahuan (Knowledge Base) berisi daftar produk, harga, stok, bahan, tabel ongkir dan aturan toko dalam teks, PDF atau Word, untuk dibaca agen. Images & Files berisi foto produk, size chart, katalog PDF dan gambar QRIS, masing-masing dengan catatan kapan dikirim. Agen juga bisa membaca website toko Anda.",
    body: <>
      <ul>
        <li><strong>Basis pengetahuan adalah yang dibaca agen.</strong> Tulis satu baris per produk: nama, warna, ukuran, harga, stok dan bahan. Teks biasa lebih akurat daripada poster yang didesain.</li>
        <li><strong>Images & Files adalah yang dikirim agen.</strong> Foto JPG dan PNG terkirim sebagai foto WhatsApp, PDF sebagai dokumen, saat pesan pembeli cocok dengan catatan Anda, misalnya “kirim saat pembeli minta foto gamis Aira”.</li>
        <li><strong>Untuk katalog besar,</strong> gabungkan dalam satu PDF katalog, dan simpan foto terpisah untuk produk terlaris.</li>
        <li><strong>Website toko:</strong> masukkan alamatnya di kartu Web Search, dan agen membaca halaman di situs itu. Halaman toko di marketplace seperti Shopee atau TikTok Shop biasanya tidak bisa dibaca, jadi unggah daftar produknya.</li>
        <li><strong>PDF hasil scan tidak terbaca.</strong> Pakai file yang teksnya bisa diseleksi, atau ketik ulang daftarnya.</li>
      </ul>
    </>,
  },
  {
    id: "stok-ongkir",
    q: "Bisakah AI mengecek stok dan menghitung ongkir sendiri?",
    answer: "Hanya dari data yang Anda berikan. Agen membaca daftar stok dan tabel ongkir per kota yang Anda unggah, jadi jawabannya setepat data itu. Agen tidak terhubung otomatis ke marketplace, ekspedisi atau aplikasi kasir. Jika sistem stok atau ongkir Anda punya API, orang teknis bisa menghubungkannya lewat tool API request.",
    body: <>
      <ul>
        <li><strong>Stok:</strong> perbarui daftar di basis pengetahuan saat ada produk habis. Tulis “habis” daripada menghapus produknya, supaya agen bisa menawarkan warna atau ukuran lain.</li>
        <li><strong>Ongkir:</strong> tabel sederhana per kota atau per pulau, dengan berat standar dan estimasi hari, sudah cukup untuk kebanyakan olshop. Tulis juga bahwa ongkir bisa berbeda untuk paket berat.</li>
        <li><strong>Resi:</strong> agen tidak bisa melacak paket. Kirim nomor resi sendiri di chat pembeli, dan agen bisa menjelaskan cara mengeceknya.</li>
      </ul>
    </>,
  },
  {
    id: "pembayaran",
    q: "Bagaimana dengan transfer, QRIS, COD dan bukti transfer palsu?",
    answer: "Agen menjelaskan cara bayar dari informasi toko dan bisa mengirim gambar QRIS atau nomor rekening atas nama toko. Agen tidak menerima pembayaran dan tidak bisa melihat mutasi, jadi instruksikan agar tidak pernah menyatakan pembayaran sudah masuk. Untuk COD, yang menurut BPS dipakai 75,19% usaha e-commerce, minta pembeli mengonfirmasi sebelum paket dikirim.",
    body: <>
      <ul>
        <li><strong>Satu rekening resmi.</strong> Tulis rekening atas nama toko di basis pengetahuan, dan larang agen memberi nomor lain. Penipu yang menyamar sebagai admin jadi lebih mudah dikenali pembeli.</li>
        <li><strong>Bukti transfer:</strong> agen bisa membaca foto, tetapi foto bisa diedit. Agen cukup berterima kasih dan bilang admin akan mengecek mutasi.</li>
        <li><strong>COD:</strong> kirim pesan konfirmasi sebelum pengiriman (contohnya ada di atas). Paket COD yang ditolak berarti ongkir bolak-balik untuk Anda.</li>
      </ul>
    </>,
  },
  {
    id: "komplain",
    q: "Apa yang terjadi saat ada komplain, retur atau pembeli marah?",
    answer: "Tulis kebijakan retur Anda di instruksi: agen menjelaskannya dan bilang admin akan membalas. Setiap percakapan di Wapzen punya sakelar AI, jadi admin bisa mematikan AI untuk pembeli itu saja, membalas sendiri, lalu menyalakannya lagi. Agen tidak memberi tahu Anda saat menyerahkan chat, jadi tentukan siapa yang memeriksa chat dan seberapa sering.",
    body: <>
      <ul>
        <li><strong>Komplain butuh manusia.</strong> Pembeli yang kecewa ingin didengar, dan keputusan refund atau tukar barang adalah keputusan Anda.</li>
        <li><strong>Balasan admin tersimpan di percakapan.</strong> Saat AI dinyalakan lagi, agen tahu apa yang sudah Anda sampaikan.</li>
        <li><strong>Grup WhatsApp reseller:</strong> agen diam di grup kecuali Anda mengaktifkannya untuk grup itu, dan di sana agen hanya membalas saat disebut (tag) atau dibalas.</li>
      </ul>
    </>,
  },
  {
    id: "broadcast",
    q: "Bisakah AI mengirim broadcast promo atau follow-up otomatis?",
    answer: "Tidak di Wapzen. Agen membalas saat pembeli menulis, dan tidak mengirim promo, pengingat pembayaran atau follow-up sendiri. Anda mengirimnya dari HP atau dasbor, dan saat pembeli membalas, agen melanjutkan percakapan. Broadcast otomatis butuh WhatsApp Business API resmi dengan template yang disetujui Meta, dan setiap pesan promo dikenakan biaya.",
    body: <>
      <p>Kebijakan WhatsApp meminta bisnis hanya mengirim pesan ke orang yang memberikan nomornya dan setuju dihubungi. Kirim promo hanya ke pembeli dan calon pembeli yang pernah menghubungi Anda, jangan membeli daftar nomor, dan berhenti jika seseorang meminta.</p>
      <Note>Pesan personal yang singkat, dengan alasan untuk membalas, biasanya lebih efektif daripada broadcast panjang. Lihat contoh “Pembeli lama, produk baru” di bagian format order.</Note>
    </>,
  },
  {
    id: "biaya",
    q: "Berapa biaya admin online shop AI dibanding WhatsApp Business API?",
    answer: "Wapzen gratis dan tidak memakai API resmi, jadi tidak ada biaya Meta per pesan. Di API resmi, setelah 1.000 balasan gratis per bulan per nomor, toko membayar Meta US$0,025 per balasan dan US$0,0411 per pesan promo, belum termasuk langganan platform chatbot.",
    body: <>
      <Comparison caption="Biaya WhatsApp untuk online shop: API resmi dibanding Wapzen" columns={["WhatsApp Business API resmi", "Wapzen"]} rows={costs} />
      <h3>Contoh hitungan</h3>
      <p>Toko menerima 60 chat per hari dengan rata-rata 5 balasan (<strong>9.000 balasan per bulan</strong>):</p>
      <ul>
        <li><strong>API resmi:</strong> setelah 1.000 gratis, 8.000 × US$0,025 = <strong>US$200 per bulan</strong> hanya untuk Meta. Dengan kurs Rp 15.000 per dolar pun sudah Rp 3 juta, belum termasuk langganan platform.</li>
        <li><strong>Wapzen:</strong> tanpa biaya per pesan.</li>
      </ul>
      <Note>Tarif Meta dalam dolar AS dari daftar 1 Oktober 2026 dan berubah tiap kuartal. Cek tarif terbaru di halaman harga Meta.</Note>
    </>,
  },
  {
    id: "telepon",
    q: "Bisakah menjawab telepon WhatsApp pembeli juga?",
    answer: "Bisa, agen suara sudah berfungsi. Agen suara Wapzen menjawab telepon WhatsApp ke nomor toko dengan suara natural dalam bahasa Indonesia, memakai informasi toko yang sama. Hanya untuk telepon WhatsApp, bukan telepon biasa, dan tidak bisa mengalihkan panggilan ke admin. Untuk pesanan, minta penelepon mengirim rinciannya lewat chat.",
    body: <>
      <p>Sebagian pembeli, terutama yang lebih tua, lebih suka menelepon daripada mengetik. Agen suara bisa menjawab soal produk, harga dan ongkir, lalu agen chat mencatat pesanannya secara tertulis, tempat pesanan dikonfirmasi dan disimpan.</p>
      <InlineCta href={voiceAccess} title="Jawab telepon pembeli yang terlewat" body="Kirim pesan ke tim kami di WhatsApp, dan kami aktifkan agen suara untuk nomor toko Anda." label="Hubungi kami di WhatsApp" />
    </>,
  },
  {
    id: "data-pembeli",
    q: "Bagaimana dengan data pribadi pembeli?",
    answer: "Nama, nomor HP dan alamat pembeli adalah data pribadi menurut UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi. Kumpulkan seperlunya untuk pengiriman, jangan meminta foto KTP lewat chat, dan beri tahu pembeli bahwa mereka dilayani admin virtual.",
    body: <>
      <p>Ini panduan umum, bukan nasihat hukum:</p>
      <ul>
        <li><strong>Kumpulkan seperlunya.</strong> Nama penerima, nomor HP dan alamat sudah cukup untuk mengirim paket.</li>
        <li><strong>Terbuka.</strong> Agen menyebut dirinya admin virtual, dan pembeli selalu bisa meminta admin manusia.</li>
        <li><strong>Ketahui ke mana data pergi.</strong> Database utama Wapzen ada di Singapura, server aplikasinya di Singapura dan Jerman, dan penyedia AI bisa memproses pesan di Amerika Serikat. Detailnya ada di <Link href="/privacy">kebijakan privasi</Link> (bahasa Inggris).</li>
      </ul>
    </>,
  },
  {
    id: "cara-pasang",
    q: "Bagaimana cara memasang admin AI WhatsApp untuk online shop?",
    answer: "Sekitar sepuluh menit: daftar gratis, klik New chat agent, tautkan nomor toko dengan kode tautan 8 karakter dari HP atau kode QR dari komputer, lalu beri nama agen. Tempel instruksi, unggah daftar produk, harga, stok dan ongkir, tambahkan foto dan size chart, aktifkan Take Order, lalu uji dari nomor lain.",
    body: <>
      <ol>
        <li><strong>Siapkan instruksi lebih dulu.</strong> Agen mulai membalas begitu nomor tertaut.</li>
        <li><strong>Daftar gratis.</strong> Tanpa kartu kredit dan tanpa API key.</li>
        <li><strong>Tautkan nomor.</strong> Di HP: WhatsApp › Perangkat tertaut › Tautkan perangkat › Tautkan dengan nomor telepon saja, lalu masukkan kode 8 karakter. Di komputer: pindai kode QR.</li>
        <li><strong>Isi informasi toko:</strong> produk, harga, stok, bahan, tabel ongkir, cara bayar dan kebijakan retur di Knowledge Base; foto produk, size chart, katalog dan QRIS di Images & Files; website toko di kartu Web Search.</li>
        <li><strong>Aktifkan Take Order,</strong> tulis instruksi pesanan, dan isi nomor admin di Order alerts on WhatsApp.</li>
        <li><strong>Uji seperti pembeli rewel</strong> dari nomor lain: tanya stok, kirim screenshot, kirim voice note, tawar harga, pesan COD, kirim “bukti transfer”, dan minta retur.</li>
      </ol>
      <p>Nama menu di atas dalam bahasa Inggris. Jika dasbor tampil dalam bahasa Indonesia lewat terjemahan otomatis, namanya bisa sedikit berbeda. Contoh instruksi untuk toko fiktif, ganti dengan data toko Anda:</p>
      <pre>{prompt}</pre>
    </>,
  },
  {
    id: "tidak-bisa",
    q: "Apa yang tidak bisa dilakukan admin AI di Wapzen?",
    answer: "Agen tidak mengirim pesan duluan atau broadcast, tidak melihat mutasi rekening, tidak menerima pembayaran, tidak melacak resi, dan tidak terhubung sendiri ke marketplace atau aplikasi kasir. Karena bukan API resmi Meta, tidak ada centang hijau atau template resmi. Wapzen adalah produk independen, bukan milik Meta atau WhatsApp.",
    body: <>
      <Comparison caption="Untuk online shop mana admin AI WhatsApp gratis seperti Wapzen cocok" columns={["Cocok?", "Alasannya"]} rows={fit} />
      <ul>
        <li><strong>Bekerja di nomor yang sudah ada,</strong> WhatsApp biasa atau WhatsApp Business, sebagai perangkat tertaut.</li>
        <li><strong>Membalas dalam bahasa pembeli,</strong> termasuk bahasa Inggris untuk pembeli dari luar negeri.</li>
      </ul>
    </>,
  },
];

export default function AdminOnlineShopAiPage() {
  return <QaPost
    href={href}
    heading={<>Admin online shop AI di WhatsApp.<br /><span>Balas setiap “ready kak?” dalam hitungan detik, gratis.</span></>}
    lead="Pembeli olshop bertanya dulu lewat WhatsApp: ready atau tidak, harga, ukuran, ongkir, bisa COD atau tidak. Di sini kami menjawab 15 pertanyaan pemilik online shop sebelum menyerahkan chat ke AI: tugas admin apa yang bisa diambil alih, contoh format order WhatsApp yang bisa disalin, cara agen mengirim foto dan size chart, mencatat pesanan dan menangani COD, biayanya dibanding API resmi, dan cara memasangnya gratis."
    verdict={{
      title: "Jawaban singkat",
      body: <>Online shop bisa memakai admin AI di WhatsApp secara gratis lewat <strong>Wapzen</strong>, di nomor toko yang sudah ada: menjawab stok, harga, ukuran dan ongkir 24 jam dari informasi toko, mengirim foto dan size chart, memahami voice note dan screenshot, lalu mencatat pesanan setelah pembeli mengonfirmasi. Mutasi, packing, resi dan komplain tetap di tangan admin. <strong>Gratis</strong>, tanpa API Meta.</>,
    }}
    facts={[["Harga", "Gratis, tanpa kartu"], ["API Meta", "Tidak perlu"], ["Nomor", "Nomor toko yang sudah ada"], ["Pesanan", "Dicatat setelah dikonfirmasi"]]}
    indexTitle="15 pertanyaan dalam panduan ini"
    answerLabel="Jawaban"
    questions={questions}
    sources={sources}
    related={["/id/blog/order-makanan-via-whatsapp", "/blog/whatsapp-ai-sales-agent"]}
    cta={{ heading: <>Setiap pembeli langsung dibalas.<br /><span>Gratis, siang dan malam.</span></>, body: "Buat agen AI, unggah katalog dan harga, dan tautkan nomor toko dalam hitungan menit. Tanpa kartu kredit dan tanpa API Meta." }}
  />;
}
