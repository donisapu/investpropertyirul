# GAIN Properties — Use case & kondisi alur Penjualan + Lelang

Versi 8 Nov 2026. Sumber keputusan: chat klien (Mas Doni) 5 & 7 Nov 2026.
Status tiap baris: **✅ disepakati**, **🟡 asumsi kami (perlu dikonfirmasi)**, **❓ menunggu klien**.
Mockup terkait ada di kolom paling kanan (`penjualan`, `lelang`, `my-bids`, `wallet`, `admin-booking`, `admin-lelang`).

Aktor: **Pengunjung** (belum login), **Member** (pembeli / peserta lelang), **Admin**, **Sistem** (scheduler + webhook), **Xendit**.

---

## 0. Ringkasan keputusan

| Topik | Keputusan | Status |
|---|---|---|
| Produk aktif | Penjualan + Lelang + Cessie. Investasi & Crowdfunding disembunyikan (flag) | ✅ |
| Penjualan | Pembeli bayar **booking fee** lewat Xendit | ✅ |
| Booking fee % | Diatur admin **per properti** | ✅ |
| Lelang | **Deposit wajib**, % diatur admin per properti, **minimal 5%** | ✅ |
| Deposit kalah | Masuk **saldo (wallet)**, ditarik sendiri | ✅ |
| Pelunasan pemenang | **Lewat web** | ✅ |
| Cessie | Alur sama dengan lelang | ✅ |
| Dasar hitung deposit | % × **nilai limit** (open bid) | 🟡 |
| Booking fee batal | Refund atau hangus? | ❓ |
| Booking fee memotong harga | Ya/tidak? | ❓ |
| Sisa bayar penjualan | Lewat web atau di luar web? | ❓ |
| Deposit pemenang | Memotong pelunasan? | ❓ (🟡 ya) |
| Batas pelunasan | Berapa hari? | ❓ (🟡 7 hari) |
| Pemenang gagal bayar | Deposit hangus? Tawarkan ke penawar ke-2? | ❓ |
| Deposit | Per lelang atau sekali untuk semua? | ❓ (🟡 per lelang) |
| Anti-sniping | Perpanjang waktu jika ada bid di menit terakhir? | ❓ |
| Data & saldo investasi lama | Diapakan? | ❓ |
| Biaya Xendit | Ditanggung pembeli atau perusahaan? | ❓ (🟡 perusahaan) |

---

## A. Prasyarat akun (berlaku untuk booking & deposit)

| ID | Kondisi | Perilaku | Status | Mockup |
|---|---|---|---|---|
| A1 | Pengunjung klik **Booking** / **Bayar Deposit** | Diarahkan ke login/daftar, setelah login kembali ke halaman properti yang sama | 🟡 | penjualan, lelang (state "Belum login") |
| A2 | Email belum diverifikasi | Diminta verifikasi dulu (middleware `verified` yang sudah ada) | ✅ (sudah ada) | – |
| A3 | Profil belum lengkap (nama sesuai KTP, no. HP) | Diminta melengkapi profil sebelum bayar. Nama dipakai untuk dokumen jual-beli & pencocokan rekening penarikan | 🟡 | – |
| A4 | Akun admin mencoba booking / bid | Ditolak (hanya role `user`) | 🟡 | – |
| A5 | Perlu KTP/NPWP peserta lelang (KYC)? | Banyak balai lelang mewajibkan. Belum diputuskan | ❓ | – |

## B. Penjualan (booking fee)

**Status listing:** `draft` → `active` (tersedia) → `on_hold` (dikunci, menunggu pembayaran) → `booked` → `sold`; atau `inactive` (ditarik admin).
**Status booking:** `pending` → `paid` → `completed`; atau `expired` / `cancelled` (refund / hangus) / `conflict`.

| ID | Kondisi | Perilaku | Status | Mockup |
|---|---|---|---|---|
| B1 | Admin mengisi **booking fee %** di form properti | Wajib > 0. Form menampilkan pratinjau nominal (harga × %), dibulatkan ke rupiah | ✅ | admin-booking ("Form properti") |
| B2 | Admin mengubah harga / % saat sudah ada booking pending / aktif | Nominal booking yang sudah dibuat **tidak berubah** (disimpan saat booking dibuat). Form menampilkan peringatan | 🟡 | admin-booking ("Form properti") |
| B3 | Member klik Booking → konfirmasi | Booking `pending` + invoice Xendit dibuat. Listing jadi `on_hold` sampai invoice kedaluwarsa | ✅ | penjualan (2–3) |
| B4 | Dua member booking hampir bersamaan | Kunci di database: hanya satu yang dapat `on_hold`, yang lain melihat "sedang dalam proses pembayaran pembeli lain" | 🟡 | penjualan ("Sudah dibooking orang lain") |
| B5 | Member yang sama klik Booking lagi saat masih `pending` | Dipakai ulang invoice yang sama, tidak membuat invoice baru | 🟡 | penjualan (3) |
| B6 | Invoice kedaluwarsa (default 24 jam) | Booking `expired`, listing kembali `active`. Member bisa booking lagi | 🟡 | penjualan ("Kedaluwarsa"), admin-booking |
| B7 | Pembayaran diterima (webhook) | Booking `paid`, listing `booked`. Email ke pembeli & admin | ✅ | penjualan (4), admin-booking |
| B8 | Pembayaran masuk terlambat setelah kunci dilepas dan properti sudah dibooking orang lain | Booking ditandai `conflict`, muncul di admin untuk di-refund ke saldo | 🟡 | admin-booking (tab "Perlu tindakan") |
| B9 | Webhook dobel / datang tidak berurutan | Diproses sekali saja (idempotent, pola yang sudah ada) | ✅ (sudah ada) | – |
| B10 | Pembeli membatalkan setelah bayar | Admin "Batalkan booking" → refund ke saldo **atau** hangus, sesuai kebijakan | ❓ | admin-booking (aksi) |
| B11 | Admin membatalkan karena pemilik menarik properti | Booking `cancelled` + refund penuh ke saldo; listing `inactive` | 🟡 | admin-booking (aksi) |
| B12 | Transaksi selesai (AJB) | Admin "Tandai terjual" → booking `completed`, listing `sold` (tampil label "Terjual" atau disembunyikan) | 🟡 | admin-booking (aksi) |
| B13 | Sisa pembayaran lewat web | Invoice pelunasan seperti lelang (lihat C14–C16) | ❓ | – |
| B14 | Admin menghapus properti yang punya booking | Ditolak; hanya bisa dinonaktifkan | 🟡 | – |
| B15 | Admin menonaktifkan listing tanpa booking | Listing hilang dari halaman publik | ✅ (sudah ada) | – |
| B16 | Kartu listing di halaman daftar | Menampilkan "Booking fee X%" dan label "Sudah dibooking" / "Terjual" | 🟡 | – (perubahan kecil) |

## C. Lelang & Cessie

**Status lelang:** `draft` → `upcoming` (pendaftaran/deposit dibuka) → `active` (bid dibuka) → `closed` (hitung pemenang) → `awaiting_payment` → `completed`; atau `no_winner`, `defaulted` (pemenang gagal bayar), `cancelled`, `suspended`.
**Status deposit per peserta:** `pending` → `paid` (tertahan) → `refunded` (ke saldo) / `applied` (memotong pelunasan) / `forfeited` (hangus); atau `expired`.

| ID | Kondisi | Perilaku | Status | Mockup |
|---|---|---|---|---|
| C1 | Admin mengisi **deposit %** | Wajib ≥ 5%. Nominal = % × nilai limit, ditampilkan di form | ✅ | admin-lelang ("Form lelang") |
| C2 | Admin mengubah % / nilai limit setelah ada deposit dibayar | Ditolak (field terkunci) agar deposit semua peserta sama | 🟡 | admin-lelang ("Form lelang") |
| C3 | **Waktu mulai & selesai butuh jam**, bukan hanya tanggal | Kolom `date_start`/`date_finish` saat ini **DATE** → diubah ke DATETIME (WIB) | 🟡 temuan teknis | admin-lelang ("Form lelang") |
| C4 | Kapan deposit bisa dibayar | Saat `upcoming` dan `active`, sampai batas waktu (🟡 1 jam sebelum tutup) | 🟡 | lelang ("Belum dibuka") |
| C5 | Deposit `pending`, klik lagi | Invoice yang sama dipakai ulang | 🟡 | lelang (2) |
| C6 | Invoice deposit kedaluwarsa | Deposit `expired`, peserta bisa bayar ulang selama masih dalam batas | 🟡 | – |
| C7 | Deposit terbayar setelah lelang ditutup | Otomatis dikembalikan ke saldo | 🟡 | – |
| C8 | Validasi bid | Lelang `active` & dalam jam; deposit `paid`; nominal ≥ tertinggi + kelipatan (bid pertama ≥ limit); kelipatan sesuai `bid_increment`; tidak bisa menyalip diri sendiri | 🟡 | lelang (3–4) |
| C9 | Dua bid nominal sama hampir bersamaan | Kunci baris lelang: yang pertama diterima, yang kedua mendapat pesan "sudah ada penawaran yang sama" | 🟡 | – |
| C10 | Salah ketik nominal (mis. kelebihan nol) | Dialog konfirmasi menampilkan nominal + terbilang; bid > 3× limit butuh konfirmasi tambahan | 🟡 | – |
| C11 | Bid tidak bisa ditarik | Ditulis di S&K lelang | 🟡 | – |
| C12 | Tersalip | Email "penawaranmu tersalip" | 🟡 | lelang (4), my-bids |
| C13 | Bid di menit terakhir (sniping) | Opsi: perpanjang 5 menit jika ada bid dalam 5 menit terakhir | ❓ | – |
| C14 | Waktu habis, **ada bid** | Scheduler menutup: pemenang = bid tertinggi; deposit peserta lain → saldo; deposit pemenang tertahan; invoice pelunasan dibuat dengan batas waktu | ✅/🟡 | lelang (5–6), admin-lelang |
| C15 | Waktu habis, **tidak ada bid** | Status `no_winner`; semua deposit → saldo | 🟡 | admin-lelang ("Tanpa pemenang") |
| C16 | Pemenang membayar pelunasan | Lelang `completed`, deposit `applied`, properti `sold`. Email ke pemenang & admin | ✅ | lelang ("Lunas"), admin-lelang |
| C17 | Nominal pelunasan miliaran (batas VA/QRIS Xendit) | Opsi: dicicil beberapa invoice, atau transfer langsung + admin **"Tandai lunas manual"** dengan bukti | ❓ (perlu dicek batas akun Xendit) | admin-lelang (aksi) |
| C18 | Pemenang **tidak melunasi** sampai batas waktu | Status `defaulted`; deposit `forfeited` (🟡); admin memilih: tawarkan ke penawar ke-2, lelang ulang, atau tutup | ❓ | lelang ("Gagal bayar"), admin-lelang |
| C19 | Admin membatalkan / menangguhkan lelang | Semua bid batal, semua deposit → saldo, email ke peserta | 🟡 | lelang ("Dibatalkan"), admin-lelang (aksi) |
| C20 | Admin mengubah jadwal saat `active` | Hanya boleh **memperpanjang**, tidak boleh memajukan waktu tutup | 🟡 | – |
| C21 | Admin menghapus lelang yang punya deposit | Ditolak; hanya bisa dibatalkan (C19) | 🟡 | – |
| C22 | Riwayat bid publik | Nama disamarkan ("Peserta #3"); member melihat "Kamu" untuk bid-nya sendiri | 🟡 | lelang |
| C23 | Cessie | Alur sama; label "Cessie" + teks penjelasan (pengalihan hak tagih) & dokumen pendukung | ✅ | lelang (catatan) |
| C24 | Admin menutup lelang lebih awal | Tidak diizinkan (hanya batalkan); mencegah kecurangan | 🟡 | – |

## D. Wallet (saldo)

| ID | Kondisi | Perilaku | Status | Mockup |
|---|---|---|---|---|
| D1 | Deposit dikembalikan | Masuk saldo dengan jenis "Pengembalian deposit lelang/cessie" + nama properti | ✅ | wallet |
| D2 | Refund booking fee (jika diputuskan) | Masuk saldo dengan jenis "Pengembalian booking fee" | ❓ | – |
| D3 | Deposit yang masih tertahan | Ditampilkan terpisah ("Deposit tertahan"), **tidak bisa ditarik** | 🟡 | wallet, my-bids |
| D4 | Tarik saldo | Fitur penarikan yang sudah ada (approve admin → payout Xendit) | ✅ (sudah ada) | wallet |
| D5 | Bayar deposit lelang berikutnya pakai saldo | Opsi tambahan: potong saldo tanpa invoice Xendit | ❓ | – |
| D6 | Deposit hangus | Menjadi pendapatan perusahaan; bisa ditarik lewat Company Cash-out yang sudah ada | 🟡 | – |
| D7 | Saldo lama dari investasi | Tetap bisa ditarik (wallet tidak di-flag) | ❓ | – |

## E. Pembayaran & Xendit (sistem)

| ID | Kondisi | Perilaku | Status |
|---|---|---|---|
| E1 | Setiap invoice | `external_id` unik per jenis (BK-/DP-/PL-), deskripsi nama produk + properti, email pembeli, masa berlaku, redirect sukses/gagal ke halaman properti | 🟡 |
| E2 | Webhook | Token diverifikasi, idempotent, `external_id` tidak dikenal diabaikan (pola yang sudah ada) | ✅ |
| E3 | Metode bayar | Nominal besar hanya bisa lewat VA/transfer; QRIS & e-wallet punya batas nominal → disaring per invoice | 🟡 |
| E4 | Biaya Xendit | Ditanggung perusahaan (tidak ditambahkan ke tagihan) | ❓ |
| E5 | Rekonsiliasi | Halaman Xendit Transactions yang sudah ada | ✅ |
| E6 | Kunci API | Staging pakai **kunci test**, production pakai **kunci live**; webhook URL berbeda per lingkungan | ✅ |

## F. Admin

| ID | Fitur | Status | Mockup |
|---|---|---|---|
| F1 | Field booking fee % (penjualan) & deposit % + jam mulai/selesai (lelang) | ✅ | admin-booking, admin-lelang |
| F2 | **Kelola Booking**: antrean per status, detail, aksi tandai terjual / batalkan (refund / hangus) / lepas kunci | 🟡 | admin-booking |
| F3 | **Kelola Lelang**: peserta & status deposit, riwayat bid, aksi batalkan, tandai lunas manual, nyatakan gagal bayar, tawarkan ke penawar ke-2 | 🟡 | admin-lelang |
| F4 | Notifikasi admin: booking baru, lelang selesai, pelunasan masuk, konflik | 🟡 | – |
| F5 | Log aksi manual admin (siapa, kapan, alasan) | 🟡 | admin-booking, admin-lelang (riwayat) |
| F6 | Dashboard: jumlah booking aktif, lelang berjalan, deposit tertahan, pelunasan jatuh tempo | 🟡 | – |

## G. Konten & kepatuhan (syarat review Xendit)

| ID | Item | Status |
|---|---|---|
| G1 | Tidak ada kata investasi / return / imbal hasil di halaman publik (copy dari DB diedit admin) | ✅ (kode) / ❓ (konten DB) |
| G2 | Halaman **S&K Booking**, **S&K Lelang**, **Kebijakan Refund**, Privasi, Kontak + alamat PT | ❓ (isi dari klien) |
| G3 | Cessie: penjelasan + disclaimer; pertimbangkan disembunyikan sampai akun Xendit live | ❓ |

## H. Lingkungan & rilis

| ID | Item | Status |
|---|---|---|
| H1 | **Staging** di subdomain terpisah (mis. `staging.gainproperties.id`), DB & storage terpisah, Xendit **test mode** | 🟡 |
| H2 | Staging tidak terindeks Google (`noindex` + basic auth) & email tidak terkirim ke user asli (log / Mailtrap) | 🟡 |
| H3 | Production `gainproperties.id` baru di-update setelah klien menyetujui di staging | 🟡 |
| H4 | Backup DB production sebelum migrasi (kolom DATETIME, tabel booking/deposit) | 🟡 |

---

## Belum termasuk (di luar lingkup tahap ini)

- Cicilan / KPR, negosiasi harga online, chat dalam aplikasi.
- Investasi & Crowdfunding (disembunyikan, kode tetap ada).
