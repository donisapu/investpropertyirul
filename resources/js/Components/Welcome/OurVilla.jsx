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

export default function OurVilla({ auth, villa = [], sliders, landings }) {
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
            link: route("investments.index"),
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
            link: route("crowdfunding.index"),
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
            link: route("property-for-sale.index"),
        },
    ];

    return (
        <section className="w-full">
            {/* BANNER CARA BERINVESTASI */}
            <div className="bg-slate-200 text-white py-14 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Mulai <span className="bg-gradient-to-r from-[#8B5A10] 
                                via-[#D4AF37] to-[#F3E5AB] 
                                bg-clip-text 
                                text-transparent">Perjalanan Investasi</span> Properti Anda
                    </h2>
                    <p className="text-slate-300 max-w-2xl mx-auto mb-6 text-base md:text-lg">
                        Kami membuat investasi properti menjadi mudah diakses, transparan, dan menguntungkan.
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

            {/* CARA BERINVESTASI (METODE) */}
            <div className="py-16 bg-slate-50 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Cara Berinvestasi</h2>
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

            {/* CARA KERJA (LANGKAH DEMI LANGKAH) */}
            <div className="py-16 bg-white px-4 border-b border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Cara Kerja</h2>
                        <p className="text-slate-600">Langkah mudah untuk mulai berinvestasi.</p>
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

            {/* VILLA / KATALOG KODE KAMU */}
            <div className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">
                            Pilihan Properti & Villa
                        </h2>
                    </div>

                    {villa && Array.isArray(villa) && villa.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-8">
                            {villa.map((item, idx) => (
                                <div
                                    key={item.id || idx}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200"
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                            <section
                        id="our-villa"
                        className="relative isolate overflow-hidden bg-[#e5e5e3] text-mono-900"
                    >
                        {/* BACKGROUND ASLI PERTAHANKAN */}
                        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.95),transparent_42%),linear-gradient(180deg,#f2f2f0_0%,#e7e7e5_55%,#ddddda_100%)]" />
                            <div className="absolute -right-[180px] -top-[220px] h-[560px] w-[560px] rounded-full border-[60px] border-black/[0.055]" />
                            <div className="absolute right-[12%] top-[90px] h-[180px] w-[180px] rounded-full border border-black/[0.06]" />
                        </div>

                        {/* MAIN CONTENT */}
                        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
                            
                            {/* LAYOUT BARU: HEADER + COUNTER & NAVIGASI DALAM SATU BARIS */}
                            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
                                <div className="text-center sm:text-left">
                                    <div className="mb-2 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-mono-500">
                                        <span className="h-px w-8 bg-mono-400" />
                                        Our Villa
                                    </div>
                                    <h2 className="text-3xl font-semibold uppercase leading-[1.1] tracking-tight text-mono-900 sm:text-4xl">
                                        {landings?.slider_title ?? "Villa Collection"}
                                    </h2>
                                </div>

                                {/* COUNTER & NAVIGATION BUTTONS (Ditaruh di kanan header) */}
                                {activeImages.length > 1 && (
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-xs font-medium tracking-widest text-mono-500">
                                            <strong className="text-base font-bold text-mono-900">
                                                {String(i + 1).padStart(2, "0")}
                                            </strong>
                                            / {String(activeImages.length).padStart(2, "0")}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={prev}
                                                aria-label="Previous image"
                                                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 text-mono-900 shadow-sm transition-all hover:bg-mono-900 hover:text-white active:scale-95"
                                            >
                                                &#8592;
                                            </button>
                                            <button
                                                type="button"
                                                onClick={next}
                                                aria-label="Next image"
                                                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 text-mono-900 shadow-sm transition-all hover:bg-mono-900 hover:text-white active:scale-95"
                                            >
                                                &#8594;
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* MAIN CAROUSEL DISPLAY */}
                            <div className="mt-8">
                                <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white/50 p-2 shadow-lg backdrop-blur-sm sm:rounded-3xl">
                                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-mono-200 sm:rounded-2xl">
                                        <img
                                            src={activeImages[i]}
                                            alt={`Villa preview ${i + 1}`}
                                            className="h-full w-full object-cover transition-all duration-500 ease-in-out"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* THUMBNAILS PREVIEW BAR (Tambahan Tata Letak Baru di Bawah) */}
                            {activeImages.length > 1 && (
                                <div className="mt-4 flex justify-center gap-3 overflow-x-auto py-2">
                                    {activeImages.map((src, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => go(idx)}
                                            className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                                                i === idx
                                                    ? "border-mono-900 opacity-100 scale-105 shadow-md"
                                                    : "border-transparent opacity-50 hover:opacity-80"
                                            }`}
                                        >
                                            <img
                                                src={src}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                        </div>
                    </section>
                    )}
                </div>
            </div>
        </section>
    );
}