import React from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ShieldCheck,
    Lock,
    Database,
    Eye,
    UserCheck,
    Share2,
    HelpCircle,
} from "lucide-react";

export default function PrivacyPolicy({ auth, settings }) {
    const sections = [
        {
            id: "pengumpulan-data",
            icon: <Database className="w-6 h-6 text-gold-ink" />,
            title: "1. Informasi yang Kami Kumpulkan",
            content: (
                <div className="space-y-3 text-ink-soft leading-relaxed">
                    <p>
                        Untuk menyediakan layanan investasi properti ter-tokenisasi, urun dana (<em>crowdfunding</em>), 
                        serta transaksi lelang di <strong>Gain Properties</strong> (
                        <a
                            href="https://gainproperties.id"
                            target="_blank"
                            rel="noreferrer"
                            className="text-gold-ink underline"
                        >
                            https://gainproperties.id
                        </a>
                        ), kami mengumpulkan data pribadi berikut:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong>Data Identitas & KYC:</strong> Nama lengkap, foto KTP/Paspor, Nomor Pokok Wajib Pajak (NPWP), dan verifikasi wajah untuk kepatuhan hukum anti-pencucian uang.
                        </li>
                        <li>
                            <strong>Data Kontak:</strong> Alamat email aktif, nomor telepon/WhatsApp, dan alamat domisili.
                        </li>
                        <li>
                            <strong>Data Finansial & Transaksi:</strong> Riwayat pembelian lot/token, riwayat penyaluran dana proyek, serta informasi akun dompet digital/rekening bank penarikan hasil.
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: "penggunaan-data",
            icon: <Eye className="w-6 h-6 text-gold-ink" />,
            title: "2. Penggunaan Informasi Pengguna",
            content: (
                <div className="space-y-3 text-ink-soft leading-relaxed">
                    <p>
                        Seluruh data yang dikumpulkan akan digunakan secara profesional untuk keperluan operasional platform, antara lain:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Memproses verifikasi akun dan uji tuntas (<em>due diligence</em>) investor.</li>
                        <li>Mengelola pencatatan kepemilikan token ekuitas properti dan distribusi dividen/yield.</li>
                        <li>Mengirimkan pembaruan status proyek, laporan keuangan properti, dan pemberitahuan transaksi penting.</li>
                        <li>Mematuhi regulasi hukum dan pelaporan pajak yang berlaku di Indonesia.</li>
                    </ul>
                </div>
            ),
        },
        {
            id: "keamanan-data",
            icon: <Lock className="w-6 h-6 text-gold-ink" />,
            title: "3. Keamanan & Perlindungan Data",
            content: (
                <div className="space-y-3 text-ink-soft leading-relaxed">
                    <p>
                        Kami berkomitmen menjaga keamanan data pribadi Anda dengan menerapkan standar teknis yang ketat:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Enkripsi data sensitif (seperti dokumen KYC dan rincian finansial) saat transit maupun penyimpanan.</li>
                        <li>Pembatasan akses internal ketat hanya kepada petugas yang berwenang.</li>
                        <li>Penggunaan gerbang pembayaran (<em>payment gateway</em>) resmi dan terenkripsi untuk setiap transaksi keuangan.</li>
                    </ul>
                </div>
            ),
        },
        {
            id: "pembagian-data",
            icon: <Share2 className="w-6 h-6 text-gold-ink" />,
            title: "4. Pembagian Informasi kepada Pihak Ketiga",
            content: (
                <div className="space-y-3 text-ink-soft leading-relaxed">
                    <p>
                        Gain Properties tidak memperjualbelikan data pribadi Anda. Kami hanya membagikan informasi kepada pihak ketiga dalam kondisi berikut:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Mitra lembaga keuangan/payment gateway resmi untuk pemrosesan pembayaran.</li>
                        <li>Otoritas penegak hukum atau instansi pemerintah jika diwajibkan oleh undang-undang yang berlaku di Republik Indonesia.</li>
                    </ul>
                </div>
            ),
        },
        {
            id: "hak-pengguna",
            icon: <UserCheck className="w-6 h-6 text-gold-ink" />,
            title: "5. Hak Pengguna atas Data Pribadi",
            content: (
                <div className="space-y-3 text-ink-soft leading-relaxed">
                    <p>
                        Sebagai pengguna platform, Anda memiliki hak untuk:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Mengakses, memperbarui, atau memperbaiki kesalahan data profil Anda melalui pengaturan akun.</li>
                        <li>Mengajukan permohonan penutupan akun dan penghapusan data (dengan tetap tunduk pada ketentuan retensi arsip hukum keuangan).</li>
                    </ul>
                </div>
            ),
        },
    ];

    return (
        <PublicLayout auth={auth} settings={settings}>
            <Head title="Kebijakan Privasi - Gain Properties" />

            {/* Hero Section */}
            <div className="bg-ink text-cream pt-24 pb-16 px-4 border-b border-ink-soft/30">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-gold-line/10 border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                        <ShieldCheck className="w-4 h-4 text-gold" />
                        Privacy & Security
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
                        Kebijakan{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-ink via-gold to-gold-ink">
                            Privasi
                        </span>
                    </h1>
                    <p className="text-cream/70 text-base md:text-lg max-w-2xl mx-auto">
                        Komitmen kami dalam melindungi kerahasiaan, keamanan, dan privasi data pribadi Anda saat menggunakan platform Gain Properties.
                    </p>
                    <p className="text-xs text-cream/50 mt-4 font-mono">
                        Terakhir Diperbarui: 13 September 2026
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="py-16 bg-cream-deep px-4">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Ringkasan Banner */}
                    <div className="bg-cream-sink border border-gold-line rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                        <HelpCircle className="w-6 h-6 text-gold-ink flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-ink leading-relaxed">
                            <strong className="font-bold">Komitmen Privasi:</strong> Kami menghargai kepercayaan Anda. Seluruh informasi pribadi yang Anda berikan dikelola dengan prinsip transparansi dan perlindungan data yang ketat.
                        </div>
                    </div>

                    {/* Loop Dokumen Kebijakan */}
                    <div className="space-y-6">
                        {sections.map((section) => (
                            <div
                                key={section.id}
                                id={section.id}
                                className="bg-cream rounded-2xl p-6 md:p-8 shadow-sm border border-gold-line hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gold-line">
                                    <div className="p-2 bg-cream-sink rounded-xl">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-ink">
                                        {section.title}
                                    </h2>
                                </div>
                                {section.content}
                            </div>
                        ))}
                    </div>

                    {/* Footer Contact Box */}
                    <div className="bg-ink text-cream rounded-2xl p-8 border border-ink-soft/30 text-center space-y-4">
                        <h3 className="text-xl font-bold text-cream">
                            Ada Pertanyaan Terkait Keamanan Data?
                        </h3>
                        <p className="text-cream/70 text-sm max-w-xl mx-auto">
                            Jika Anda memiliki pertanyaan atau kekhawatiran mengenai pemrosesan data pribadi Anda, silakan hubungi tim privasi kami.
                        </p>
                        <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://gainproperties.id"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center px-6 py-3 bg-gold hover:bg-gold-ink text-ink font-bold rounded-xl transition-all shadow-md text-sm uppercase tracking-wider"
                            >
                                Hubungi Tim Privasi
                            </a>
                            <Link
                                href={route("terms")}
                                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-ink-soft/40 hover:border-gold text-cream font-bold rounded-xl transition-colors text-sm"
                            >
                                Lihat Syarat &amp; Ketentuan
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
