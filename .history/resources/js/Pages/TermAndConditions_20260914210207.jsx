import React from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ShieldCheck,
    FileText,
    Users,
    Coins,
    Building2,
    Gavel,
    AlertTriangle,
    Lock,
    Scale,
    HelpCircle,
} from "lucide-react";

export default function TermsAndConditions({ auth, settings }) {
    const sections = [
        {
            id: "definisi",
            icon: <Building2 className="w-6 h-6 text-amber-600" />,
            title: "1. Definisi & Ekosistem Layanan",
            content: (
                <div className="space-y-3 text-slate-600 leading-relaxed">
                    <p>
                        <strong>Gain Properties</strong> (
                        <a
                            href="https://gainproperties.id"
                            target="_blank"
                            rel="noreferrer"
                            className="text-amber-600 underline"
                        >
                            https://gainproperties.id
                        </a>
                        ) adalah platform teknologi finansial dan properti yang
                        memfasilitasi tokenisasi aset, urun dana kolektif, dan
                        transaksi lelang properti.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong>Ekuitas Ter-tokenisasi (Investasi Properti):</strong>{" "}
                            Kepemilikan fraksional digital atas ekuitas aset atau
                            entitas properti dengan target kenaikan nilai modal (
                            <em>capital appreciation</em>) dan potensi dividen
                            sewa.
                        </li>
                        <li>
                            <strong>Urun Dana (Crowdfunding Properti):</strong>{" "}
                            Skema pendanaan proyek properti secara kolektif
                            dengan imbal hasil (<em>yield</em>) atau bunga dalam
                            jangka waktu tertentu.
                        </li>
                        <li>
                            <strong>Lelang & Cessie:</strong> Fasilitasi penawaran
                            properti di bawah harga pasar melalui mekanisme lelang
                            transparan atau pengalihan hak tagih (<em>cessie</em>{" "}
                            bank) untuk kepemilikan penuh.
                        </li>
                        <li>
                            <strong>Token / Lot:</strong> Satuan unit kepemilikan
                            fraksional digital di dalam platform (contoh: IDR
                            10.000 per token).
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: "kyc",
            icon: <ShieldCheck className="w-6 h-6 text-amber-600" />,
            title: "2. Kelayakan Pengguna & Verifikasi (KYC)",
            content: (
                <div className="space-y-3 text-slate-600 leading-relaxed">
                    <p>
                        Untuk menjamin keamanan dan kepatuhan terhadap regulasi
                        keuangan, seluruh pengguna platform wajib memenuhi syarat
                        berikut:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            Berusia minimal <strong>21 tahun</strong> atau sudah
                            menikah, serta memiliki cakupan hukum sah untuk
                            membuat perjanjian mengikat.
                        </li>
                        <li>
                            Menyelesaikan prosedur <strong>KYC (Know Your Customer)</strong>{" "}
                            dengan mengunggah identitas resmi (KTP/Paspor, NPWP,
                            dan verifikasi wujud fisik/wajah) sebelum bertransaksi.
                        </li>
                        <li>
                            Menjamin bahwa seluruh data yang didaftarkan adalah
                            akurat, terkini, sah, dan milik Pengguna sendiri.
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: "produk",
            icon: <Coins className="w-6 h-6 text-amber-600" />,
            title: "3. Ketentuan Spesifik Produk & Layanan",
            content: (
                <div className="space-y-4 text-slate-600 leading-relaxed">
                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">
                            A. Investasi Properti & Tokenisasi Ekuitas
                        </h4>
                        <p className="text-sm">
                            Unit token yang dibeli mewakili kepemilikan proporsional
                            atas <em>Special Purpose Vehicle</em> (SPV) atau
                            struktur entitas hukum pengelola aset. Distribusi
                            dividen sewa bersifat proyeksi berdasarkan performa
                            okupansi riil dan bukan garansi mutlak.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">
                            B. Urun Dana (Crowdfunding)
                        </h4>
                        <p className="text-sm">
                            Dana pemodal akan disalurkan kepada pengembang atau
                            proyek properti terverifikasi. Imbal hasil dan jangka
                            waktu tenor mengacu pada lembar informasi detail (
                            <em>factsheet</em>) resmi masing-masing proyek.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 mb-1">
                            C. Lelang & Cessie
                        </h4>
                        <p className="text-sm">
                            Penawaran lelang atau pembelian hak <em>cessie</em>{" "}
                            bersifat mengikat dan tidak dapat dibatalkan secara
                            sepihak setelah pemenang atau pembeli ditetapkan oleh
                            platform/mitra.
                        </p>
                    </div>
                </div>
            ),
        },
        {
            id: "risiko",
            icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
            title: "4. Penyangkalan Risiko & Uji Tuntas (Due Diligence)",
            content: (
                <div className="space-y-3 text-slate-600 leading-relaxed">
                    <p>
                        Setiap kegiatan investasi properti dan urun dana mengandung
                        risiko pasar. Pengguna memahami dan menyetujui hal-hal
                        berikut:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong>Risiko Investasi:</strong> Nilai properti dan
                            pendapatan sewa dapat naik maupun turun tergantung pada
                            kondisi ekonomi makro, tingkat okupansi, dan likuiditas
                            pasar.
                        </li>
                        <li>
                            <strong>Bukan Nasihat Keuangan Resmi:</strong>{" "}
                            Fitur kalkulator imbal hasil (<em>Return Calculator</em>)
                            dan grafik proyeksi di situs ini hanya ditujukan untuk
                            simulasi/ilustrasi semata.
                        </li>
                        <li>
                            <strong>Tanggung Jawab Investor:</strong> Pengguna
                            diimbau melakukan uji tuntas independen (
                            <em>due diligence</em>) sebelum mengambil keputusan
                            investasi.
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: "pembayaran",
            icon: <Lock className="w-6 h-6 text-amber-600" />,
            title: "5. Transaksi, Dompet Digital & Perpajakan",
            content: (
                <div className="space-y-3 text-slate-600 leading-relaxed">
                    <p>
                        Seluruh alur transaksi finansial di dalam ekosistem Gain
                        Properties diatur sebagai berikut:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            Pembayaran deposit, pembelian token, dan penarikan hasil
                            diproses melalui pintu pembayaran (<em>payment gateway</em>)
                            dan lembaga keuangan resmi terdaftar.
                        </li>
                        <li>
                            Pajak atas penghasilan sewa, dividen, maupun kenaikan
                            harga aset (<em>capital gain</em>) dipotong dan dikelola
                            sesuai peraturan perpajakan yang berlaku di Republik
                            Indonesia (seperti PPh final sewa/penjualan properti).
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: "hukum",
            icon: <Scale className="w-6 h-6 text-amber-600" />,
            title: "6. Pembatasan Tanggung Jawab & Hukum Berlaku",
            content: (
                <div className="space-y-3 text-slate-600 leading-relaxed">
                    <p>
                        Gain Properties tidak bertanggung jawab atas kerugian akibat
                        gangguan sistem pihak ketiga, kegagalan koneksi Pengguna, atau
                        keadaan kahar (<em>force majeure</em>).
                    </p>
                    <p>
                        Syarat dan Ketentuan ini diatur dan ditafsirkan sesuai dengan
                        hukum Republik Indonesia. Setiap perselisihan akan
                        diselesaikan secara musyawarah mufakat atau melalui Badan
                        Arbitrase Nasional Indonesia (BANI) / Pengadilan Negeri yang
                        berwenang.
                    </p>
                </div>
            ),
        },
    ];

    return (
        <PublicLayout auth={auth} settings={settings}>
            <Head title="Syarat & Ketentuan - Gain Properties" />

            {/* Hero Section */}
            <div className="bg-slate-900 text-white pt-24 pb-16 px-4 border-b border-slate-800">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#BF953F]/20 to-[#AA771C]/20 border border-[#BF953F]/40 text-[#FCF6BA] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                        <FileText className="w-4 h-4 text-[#BF953F]" />
                        Legal Policy
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
                        Syarat &{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]">
                            Ketentuan Penggunaan
                        </span>
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
                        Harap baca dokumen ini secara cermat sebelum menggunakan
                        layanan tokenisasi, urun dana, dan lelang properti di Gain
                        Properties.
                    </p>
                    <p className="text-xs text-slate-500 mt-4 font-mono">
                        Terakhir Diperbarui: 13 September 2026
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="py-16 bg-slate-50 px-4">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Ringkasan Banner */}
                    <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                        <HelpCircle className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-950 leading-relaxed">
                            <strong className="font-bold">Pemberitahuan Penting:</strong> Dengan
                            membuat akun, membeli lot/token, atau menyalurkan dana pada proyek di{" "}
                            <strong>Gain Properties</strong>, Anda secara hukum menyatakan telah
                            membaca, memahami, dan menyetujui seluruh ketentuan yang tercantum pada
                            halaman ini.
                        </div>
                    </div>

                    {/* Loop Dokumen Legal */}
                    <div className="space-y-6">
                        {sections.map((section) => (
                            <div
                                key={section.id}
                                id={section.id}
                                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                                    <div className="p-2 bg-amber-50 rounded-xl">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                                        {section.title}
                                    </h2>
                                </div>
                                {section.content}
                            </div>
                        ))}
                    </div>

                    {/* Footer Contact Box */}
                    <div className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 text-center space-y-4">
                        <h3 className="text-xl font-bold text-slate-100">
                            Ada Pertanyaan Mengenai Legalitas Layanan Kami?
                        </h3>
                        <p className="text-slate-400 text-sm max-w-xl mx-auto">
                            Tim hukum dan dukungan pelanggan kami siap membantu memberikan
                            klarifikasi mengenai syarat transaksi, verifikasi KYC, maupun skema tokenisasi.
                        </p>
                        <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://gainproperties.id"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#BF953F] via-[#AA771C] to-[#865811] hover:brightness-110 text-white font-bold rounded-xl transition-all shadow-md text-sm uppercase tracking-wider"
                            >
                                Hubungi Tim Legal
                            </a>
                            <Link
                                href={route("register")}
                                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-slate-700 hover:border-amber-500 text-white font-bold rounded-xl transition-colors text-sm"
                            >
                                Daftar Akun
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}