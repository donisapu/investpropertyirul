import React from "react";
import { Link } from "@inertiajs/react";
import {
    Wallet,
    Building2,
    Gavel,
    Users,
    ArrowRight,
    CheckCircle2,
    TrendingUp,
    Search,
    FileText,
} from "lucide-react";

export default function Howto({ auth, landings }) {
    // Helper fungsi aman untuk route Ziggy agar tidak bikin blank jika route belum terdefinisi
    const safeRoute = (routeName, fallback = "#") => {
        try {
            return typeof route === "function" ? route(routeName) : fallback;
        } catch (e) {
            return fallback;
        }
    };

    // Data Langkah-langkah Cara Kerja Investasi
    const steps = [
        {
            icon: <Search className="w-8 h-8 text-emerald-600" />,
            title: "1. Jelajahi Properti",
            description:
                "Telusuri pilihan properti pilihan kami yang berpotensi tinggi. Filter berdasarkan lokasi, harga, dan jenis investasi.",
        },
        {
            icon: <FileText className="w-8 h-8 text-emerald-600" />,
            title: "2. Tinjau Detail",
            description:
                "Analisis laporan terperinci, proyeksi keuangan, dan dokumen hukum untuk setiap properti. Kami menjamin transparansi penuh.",
        },
        {
            icon: <Wallet className="w-8 h-8 text-emerald-600" />,
            title: "3. Pilih Metode Anda",
            description:
                "Tentukan apakah Anda ingin berinvestasi melalui ekuitas ter-tokenisasi, pinjaman fraksional, atau kepemilikan penuh.",
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-emerald-600" />,
            title: "4. Investasikan & Dapatkan Hasil",
            description:
                "Selesaikan transaksi Anda dengan aman. Pantau performa portofolio Anda dan terima imbal hasil langsung ke dompet Anda.",
        },
    ];

    const colorStyles = {
        emerald: {
            bg: "bg-emerald-50",
            icon: "text-emerald-500",
            border: "border-emerald-500",
            text: "text-emerald-600",
            hoverBg: "hover:bg-emerald-50",
        },
        blue: {
            bg: "bg-blue-50",
            icon: "text-blue-500",
            border: "border-blue-500",
            text: "text-blue-600",
            hoverBg: "hover:bg-blue-50",
        },
        amber: {
            bg: "bg-amber-50",
            icon: "text-amber-500",
            border: "border-amber-500",
            text: "text-amber-600",
            hoverBg: "hover:bg-amber-50",
        },
    };

    const methods = [
        {
            title: "Investasi Properti",
            icon: <Building2 className="w-12 h-12 text-emerald-600 mb-4" />,
            description:
                "Beli lot properti untuk kepemilikan ekuitas langsung. Dapatkan keuntungan dari kenaikan nilai modal dan potensi dividen sewa.",
            features: [
                "Ekuitas ter-tokenisasi",
                "Kenaikan nilai modal",
                "Jangka menengah-panjang",
                "Porsi kepemilikan langsung",
            ],
            colorKey: "emerald",
            link: safeRoute("investments.index", "/investments"),
        },
        {
            title: "Urun Dana (Crowdfunding)",
            icon: <Users className="w-12 h-12 text-blue-600 mb-4" />,
            description:
                "Berpartisipasi dalam pendanaan properti secara kolektif. Dapatkan imbal hasil pasti dalam jangka waktu tertentu.",
            features: [
                "Tenor & ROI pasti",
                "Minimum investasi rendah",
                "Passive income",
                "Jangka pendek-menengah",
            ],
            colorKey: "blue",
            link: safeRoute("crowdfunding.index", "/crowdfunding"),
        },
        {
            title: "Lelang & Cessie",
            icon: <Gavel className="w-12 h-12 text-amber-600 mb-4" />,
            description:
                "Ajukan penawaran untuk properti di bawah harga pasar. Dapatkan hak kepemilikan penuh melalui proses lelang transparan.",
            features: [
                "Di bawah harga pasar",
                "Kepemilikan penuh",
                "Potensi imbal hasil tinggi",
                "Jual beli aset cepat",
            ],
            colorKey: "amber",
            link: safeRoute("property-for-sale.index", "/properties"),
        },
    ];

    return (
        <section className="w-full">
            {/* 1. BANNER MULAI PERJALANAN INVESTASI (DI ATAS, ABU-ABU GELAP + TOMBOL GOLD) */}
            <div className="bg-[#4A525D] text-white py-16 px-4 border-b border-slate-600/50 relative overflow-hidden">
                {/* Visual Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                        Mulai{" "}
                        <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                            Perjalanan Investasi
                        </span>{" "}
                        Properti Anda
                    </h2>
                    <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-base md:text-lg leading-relaxed">
                        Kami membuat investasi properti menjadi mudah diakses, transparan, dan menguntungkan.
                    </p>
                    {!auth?.user && (
                        <Link
                            href={safeRoute("register", "/register")}
                            className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 hover:from-amber-300 hover:via-amber-400 hover:to-yellow-500 text-slate-950 font-bold rounded-full transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transform hover:-translate-y-0.5"
                        >
                            Buat Akun Gratis
                            <ArrowRight className="w-5 h-5 ml-2 text-slate-950 stroke-[2.5]" />
                        </Link>
                    )}
                </div>
            </div>

            {/* 2. CARA KERJA (LANGKAH DEMI LANGKAH) */}
            <div className="py-16 bg-white px-4 border-b border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            Cara Kerja
                        </h2>
                        <p className="text-slate-600">
                            Langkah mudah untuk mulai berinvestasi.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-100 transition-colors">
                                    {step.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-slate-600 text-xs leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. CARA BERINVESTASI (METODE) */}
            <div className="py-16 bg-slate-50 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">
                            Cara Berinvestasi
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Pilih model investasi yang paling sesuai dengan profil risiko dan dana Anda.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {methods.map((method, index) => {
                            const style = colorStyles[method.colorKey];
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow flex flex-col justify-between"
                                >
                                    <div>
                                        <div
                                            className={`p-3 rounded-xl inline-block ${style.bg} mb-4`}
                                        >
                                            {method.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                            {method.title}
                                        </h3>
                                        <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                            {method.description}
                                        </p>
                                        <ul className="space-y-2 mb-6">
                                            {method.features.map(
                                                (feature, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="flex items-center text-slate-700 text-sm"
                                                    >
                                                        <CheckCircle2
                                                            className={`w-4 h-4 ${style.icon} mr-2 flex-shrink-0`}
                                                        />
                                                        {feature}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                    <Link
                                        href={method.link}
                                        className={`block w-full text-center py-2.5 rounded-xl font-semibold border-2 ${style.border} ${style.text} ${style.hoverBg} transition-colors text-sm`}
                                    >
                                        Lihat {method.title}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}