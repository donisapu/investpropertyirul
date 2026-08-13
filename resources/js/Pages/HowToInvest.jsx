import React from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Wallet,
    Coins,
    Building2,
    Gavel,
    Users,
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    TrendingUp,
    Search,
    FileText,
    CreditCard,
} from "lucide-react";

export default function HowToInvest({ auth }) {
    const steps = [
        {
            icon: <Search className="w-8 h-8 text-emerald-600" />,
            title: "1. Jelajahi Properti",
            description:
                "Telusuri pilihan properti pilihan kami yang berpotensi tinggi. Filter berdasarkan lokasi, harga, dan jenis investasi (Investasi, Crowdfunding, atau Lelang).",
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
                "Tentukan apakah Anda ingin berinvestasi melalui ekuitas ter-tokenisasi (Investasi), pinjaman fraksional (Crowdfunding), atau kepemilikan penuh (Lelang)",
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-emerald-600" />,
            title: "4. Investasikan & Dapatkan Hasil",
            description:
                "Selesaikan transaksi Anda dengan aman. Pantau performa portofolio Anda dan terima imbal hasil langsung ke dompet digital Anda.",
        },
    ];

    const methods = [
        {
            title: "Investasi Properti",
            icon: <Building2 className="w-12 h-12 text-emerald-600 mb-4" />,
            description:
                "Beli lot properti untuk kepemilikan ekuitas langsung. Dapatkan keuntungan dari kenaikan nilai modal (capital appreciation) dan potensi dividen sewa dengan target ROI yang jelas.",
            features: [
                "Tenor & ROI pasti",
                "Minimum investasi rendah",
                "Passive income",
                "Jangka pendek-menengah",
                "Ekuitas ter-tokenisasi",
                "Kenaikan nilai modal",
                "Jangka menengah-panjang",
                "Porsi kepemilikan langsung",
            ],
            color: "emerald",
            link: route("investments.index"),
        },
        // {
        //     title: "Urun Dana (Crowdfunding)",
        //     icon: <Users className="w-12 h-12 text-blue-600 mb-4" />,
        //     description:
        //         "Berpartisipasi dalam pendanaan properti secara kolektif. Dapatkan imbal hasil pasti dalam jangka waktu tertentu dengan berkontribusi pada pengembangan atau akuisisi properti.",
        //     features: [
        //         "Ekuitas ter-tokenisasi",
        //         "Kenaikan nilai modal",
        //         "Jangka menengah-panjang",
        //         "Porsi kepemilikan langsung",
        //     ],
        //     color: "blue",
        //     link: route("crowdfunding.index"),
        // },
        // {
        //     title: "Lelang & Cessie",
        //     icon: <Gavel className="w-12 h-12 text-amber-600 mb-4" />,
        //     description:
        //         "Ajukan penawaran untuk properti di bawah harga pasar. Dapatkan hak kepemilikan penuh melalui proses lelang yang transparan atau hak cessie bank.",
        //     features: [
        //         "Di bawah harga pasar",
        //         "Kepemilikan penuh",
        //         "Potensi imbal hasil tinggi",
        //         "Jual beli aset cepat",
        //     ],
        //     color: "amber",
        //     link: route("property-for-sale.index"),
        // },
    ];

    return (
        <PublicLayout auth={auth}>
            <Head title="How to Invest" />

            {/* Hero Section */}
            <div className="bg-slate-900 text-white pt-24 pb-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Mulai{" "}
                        <span className="text-emerald-400">
                            Perjalanan Investasi
                        </span>{" "}
                        Properti Anda
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                        Kami membuat investasi properti menjadi mudah diakses,
                        transparan, dan menguntungkan. Pilih jalur yang sesuai
                        dengan tujuan Anda
                    </p>
                    {!auth.user && (
                        <Link
                            href={route("register")}
                            className="inline-flex items-center px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-colors"
                        >
                            Create Free Account
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Investment Methods */}
            <div className="py-20 bg-slate-50 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Tiga Cara Berinvestasi
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Baik Anda ingin mulai dari nominal kecil atau besar,
                            kami memiliki model investasi yang tepat untuk Anda.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {methods.map((method, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-shadow"
                            >
                                <div
                                    className={`p-3 rounded-xl inline-block bg-${method.color}-50 mb-6`}
                                >
                                    {method.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                                    {method.title}
                                </h3>
                                <p className="text-slate-600 mb-8 leading-relaxed">
                                    {method.description}
                                </p>
                                <ul className="space-y-3 mb-8">
                                    {method.features.map((feature, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center text-slate-700"
                                        >
                                            <CheckCircle2
                                                className={`w-5 h-5 text-${method.color}-500 mr-3`}
                                            />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={method.link}
                                    className={`block w-full text-center py-3 rounded-xl font-semibold border-2 border-${method.color}-500 text-${method.color}-600 hover:bg-${method.color}-50 transition-colors`}
                                >
                                    Lihat {method.title}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Step by Step */}
            <div className="py-20 bg-white px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Cara Kerja
                        </h2>
                        <p className="text-slate-600">
                            Langkah mudah untuk membangun portofolio properti
                            Anda.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-100 transition-colors">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Trust Section */}
            <div className="py-20 bg-slate-900 text-white px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold mb-6">
                            Mengapa Berinvestasi Bersama Kami?
                        </h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                                <div>
                                    <h4 className="text-lg font-bold mb-1">
                                        Uji Tuntas Terlebih Dahulu (Due
                                        Diligence)
                                    </h4>
                                    <p className="text-slate-400 text-sm">
                                        Setiap properti melewati pemeriksaan
                                        hukum dan keuangan yang ketat sebelum
                                        terdaftar di platform.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Building2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                                <div>
                                    <h4 className="text-lg font-bold mb-1">
                                        Aset Premium
                                    </h4>
                                    <p className="text-slate-400 text-sm">
                                        Akses ke properti eksklusif dan peluang
                                        imbal hasil tinggi yang biasanya hanya
                                        tersedia untuk institusi.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <CreditCard className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                                <div>
                                    <h4 className="text-lg font-bold mb-1">
                                        Transaksi Aman
                                    </h4>
                                    <p className="text-slate-400 text-sm">
                                        Semua transaksi keuangan dienkripsi dan
                                        diproses melalui gerbang pembayaran
                                        (payment gateway) yang terregulasi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 bg-slate-800 p-8 rounded-2xl border border-slate-700">
                        <h3 className="text-2xl font-bold mb-4">
                            Siap untuk memulai?
                        </h3>
                        <p className="text-slate-400 mb-6">
                            Bergabunglah dengan ribuan investor yang sedang membangun kekayaan melalui properti hari ini.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href={route("register")}
                                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-center font-bold rounded-xl transition-colors"
                            >
                                Daftar Sekarang
                            </Link>
                            <Link
                                href={route("investments.index")}
                                className="flex-1 py-3 bg-transparent border border-slate-600 hover:border-emerald-500 text-white text-center font-bold rounded-xl transition-colors"
                            >
                                Jelajahi Properti
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
