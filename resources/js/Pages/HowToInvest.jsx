import React from "react";
import { Link } from "@inertiajs/react";
import {
    Wallet,
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

export default function OurVilla({ auth, villa, sliders, landings }) {
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

    // Map class warna Tailwind agar tidak ter-purge saat build
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

    // Data Metode-metode Investasi
    const methods = [
        {
            title: "Investasi Properti",
            icon: <Building2 className="w-12 h-12 text-emerald-600 mb-4" />,
            description:
                "Beli lot properti untuk kepemilikan ekuitas langsung. Dapatkan keuntungan dari kenaikan nilai modal (capital appreciation) dan potensi dividen sewa.",
            features: [
                "Ekuitas ter-tokenisasi",
                "Kenaikan nilai modal",
                "Jangka menengah-panjang",
                "Porsi kepemilikan langsung",
            ],
            colorKey: "emerald",
            link: route("investments.index"),
        },
        {
            title: "Urun Dana (Crowdfunding)",
            icon: <Users className="w-12 h-12 text-blue-600 mb-4" />,
            description:
                "Berpartisipasi dalam pendanaan properti secara kolektif. Dapatkan imbal hasil pasti dalam jangka waktu tertentu dengan berkontribusi pada pengembangan.",
            features: [
                "Tenor & ROI pasti",
                "Minimum investasi rendah",
                "Passive income",
                "Jangka pendek-menengah",
            ],
            colorKey: "blue",
            link: route("crowdfunding.index"),
        },
        {
            title: "Lelang & Cessie",
            icon: <Gavel className="w-12 h-12 text-amber-600 mb-4" />,
            description:
                "Ajukan penawaran untuk properti di bawah harga pasar. Dapatkan hak kepemilikan penuh melalui proses lelang yang transparan atau hak cessie bank.",
            features: [
                "Di bawah harga pasar",
                "Kepemilikan penuh",
                "Potensi imbal hasil tinggi",
                "Jual beli aset cepat",
            ],
            colorKey: "amber",
            link: route("property-for-sale.index"),
        },
    ];

    return (
        <section className="w-full">
            {/* ========================================================= */}
            {/* SECTION 1: BANNER / HEADER INVESTASI                       */}
            {/* ========================================================= */}
            <div className="bg-slate-900 text-white py-14 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Mulai <span className="text-emerald-400">Perjalanan Investasi</span> Properti Anda
                    </h2>
                    <p className="text-slate-300 max-w-2xl mx-auto mb-6 text-base md:text-lg">
                        Kami membuat investasi properti menjadi mudah diakses, transparan, dan menguntungkan. Pilih jalur yang sesuai dengan tujuan Anda.
                    </p>
                    {auth && !auth.user && (
                        <Link
                            href={route("register")}
                            className="inline-flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-colors"
                        >
                            Buat Akun Gratis
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    )}
                </div>
            </div>

            {/* ========================================================= */}
            {/* SECTION 2: METODE INVESTASI (CARA BERINVESTASI)           */}
            {/* ========================================================= */}
            <div className="py-16 bg-slate-50 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Cara Berinvestasi</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Baik Anda ingin mulai dari nominal kecil atau besar, kami memiliki model investasi yang tepat untuk Anda.
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
                                        <div className={`p-3 rounded-xl inline-block ${style.bg} mb-4`}>
                                            {method.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                            {method.title}
                                        </h3>
                                        <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                            {method.description}
                                        </p>
                                        <ul className="space-y-2 mb-6">
                                            {method.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center text-slate-700 text-sm">
                                                    <CheckCircle2 className={`w-4 h-4 ${style.icon} mr-2 flex-shrink-0`} />
                                                    {feature}
                                                </li>
                                            ))}
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

            {/* ========================================================= */}
            {/* SECTION 3: LANGKAH CARA KERJA                              */}
            {/* ========================================================= */}
            <div className="py-16 bg-white px-4 border-b border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Cara Kerja</h2>
                        <p className="text-slate-600">Langkah mudah untuk membangun portofolio properti Anda.</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-100 transition-colors">
                                    {step.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-slate-600 text-xs leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ========================================================= */}
            {/* SECTION 4: TRUST & KEUNGGULAN                              */}
            {/* ========================================================= */}
            <div className="py-16 bg-slate-900 text-white px-4">
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
                                        Uji Tuntas Terlebih Dahulu (Due Diligence)
                                    </h4>
                                    <p className="text-slate-400 text-sm">
                                        Setiap properti melewati pemeriksaan hukum dan keuangan yang ketat sebelum terdaftar di platform.
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
                                        Akses ke properti eksklusif dan peluang imbal hasil tinggi yang biasanya hanya tersedia untuk institusi.
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
                                        Semua transaksi keuangan dienkripsi dan diproses melalui gerbang pembayaran terregulasi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full">
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

            {/* ========================================================= */}
            {/* SECTION 5: DAFTAR PROPERTI / KATALOG VILLA UTAMA          */}
            {/* ========================================================= */}
            <div className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">
                            Pilihan Properti & Villa
                        </h2>
                        <p className="text-slate-600">
                            Jelajahi daftar properti unggulan yang siap untuk diinvestasikan.
                        </p>
                    </div>

                    {/* Rendering Daftar Villa/Properti */}
                    {villa && villa.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-8">
                            {villa.map((item, idx) => (
                                <div
                                    key={item.id || idx}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                                >
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.title || "Villa"}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                                            {item.title || item.name}
                                        </h3>
                                        <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                                            {item.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-emerald-600 font-bold text-lg">
                                                {item.price ? `Rp ${Number(item.price).toLocaleString("id-ID")}` : ""}
                                            </span>
                                            {item.slug && (
                                                <Link
                                                    href={route("investments.show", item.slug)}
                                                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors"
                                                >
                                                    Detail
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
                            <p className="text-slate-500">Belum ada data properti yang ditampilkan.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}