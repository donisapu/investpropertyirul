import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Bed,
    Bath,
    Maximize,
    Building2,
    Calendar,
    Banknote,
    MonitorCheck,
    Settings2,
    SearchCheck,
    ChevronRight,
    LayoutGrid,
    CheckCircle2,
    ChevronLeft,
    ShieldCheck,
    TrendingUp,
    Users,
    ArrowUpRight,
    Percent,
    Sparkles,
    Flame,
    ArrowRight,
    MapPin,
} from "lucide-react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

export default function Crowdfunding({ properties, settings }) {
    return (
        <PublicLayout>
            <Head title="Crowdfunding" />

            {/* Hero Section dengan Background Gradient Lembut */}
            <div className="relative overflow-hidden bg-white border-b border-slate-100">
                {/* 1. KUNCI UTAMA: Subtle Grid Pattern Overlay (Biar background ga kosong & sepi) */}
                <div className="absolute inset-0 pointer-events-none opacity-60 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

                {/* Sorotan cahaya abstrak lembut */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-30 -z-10 translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-emerald-100 rounded-full blur-[100px] opacity-20 -z-10"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        {/* ================= KOLOM KIRI: TEKS & CALL TO ACTION ================= */}
                        <div className="flex-1 text-center lg:text-left space-y-8">
                            {/* Badge Tagline Premium */}
                            <div>
                                <span className="inline-flex items-center gap-2 bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-full border border-slate-200/60 shadow-sm">
                                    <Sparkles
                                        size={12}
                                        className="text-amber-500 animate-spin-[spin_3s_linear_infinite]"
                                    />
                                    Platform Crowdfunding Properti Berizin OJK
                                </span>
                            </div>

                            {/* Headline Dengan Gradasi yang Lebih Kontras */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                                Sekarang Semua Bisa{" "}
                                <br className="hidden md:block" />
                                <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                                    Patungan Properti
                                </span>
                            </h1>

                            {/* Sub-headline */}
                            <p className="text-slate-500 text-base sm:text-lg max-w-xl leading-relaxed mx-auto lg:mx-0">
                                Didukung teknologi tokenisasi, miliki
                                kepemilikan fraksional aset properti premium
                                secara aman dan transparan bersama ribuan
                                investor lainnya mulai dari{" "}
                                <span className="text-slate-900 font-bold">
                                    IDR 1 Juta
                                </span>
                                .
                            </p>

                            {/* Tombol Aksi Transaksi */}
                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:scale-98">
                                    Mulai Investasi
                                </button>
                                <a
                                    href="#projects"
                                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200/80 px-6 py-4 rounded-xl font-bold text-sm transition-all"
                                >
                                    Lihat Project Aktif{" "}
                                    <ArrowUpRight size={16} />
                                </a>
                            </div>

                            {/* 2. KUNCI KEDUA: Live Trust Stats Bar (Membunuh kesan sepi platform) */}
                            <div className="pt-8 border-t border-slate-100 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
                                <div>
                                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                        IDR 45B+
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                        Dana Tersalurkan
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                        12.8k+
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                        Investor Aktif
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                        0%
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                        Gagal Bayar
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ================= KOLOM KANAN: ILUSTRASI & LAYERED CARDS ================= */}
                        <div className="flex-1 relative flex justify-center items-center w-full max-w-lg lg:max-w-none">
                            {/* Lingkaran blur glow di balik gambar */}
                            <div className="absolute w-[350px] h-[350px] bg-blue-300 rounded-full -z-10 blur-[90px] opacity-30 animate-pulse"></div>

                            {/* Frame Utama Ilustrasi */}
                            <div className="relative w-full max-w-md p-4">
                                <img
                                    src="/crowdfunding.svg"
                                    alt="Ilustrasi Provesty"
                                    className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(36,96,139,0.15)]"
                                />

                                {/* Floating Card 1: Kiri Bawah (Min Pembelian) */}
                                <div className="absolute -bottom-2 -left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100 flex items-center gap-3.5 transition-all duration-300 hover:-translate-y-1">
                                    <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100/50 flex-none shadow-sm">
                                        <Banknote size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">
                                            Minimal Lot
                                        </div>
                                        <div className="text-sm font-black text-slate-800 mt-0.5">
                                            Mulai IDR 1 Juta
                                        </div>
                                    </div>
                                </div>

                                {/* 3. KUNCI KETIGA: Floating Card 2 - Kanan Atas (Rata-rata Dividen / ROI) */}
                                <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100 flex items-center gap-3.5 transition-all duration-300 hover:-translate-y-1">
                                    <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100/50 flex-none shadow-sm">
                                        <Percent size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">
                                            Rata-rata Imbal Hasil
                                        </div>
                                        <div className="text-sm font-black text-blue-700 mt-0.5">
                                            Up to 14.5% / Thn
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Keunggulan Platform dengan Main Title */}
            <div className="relative bg-slate-50/50 py-24 border-b border-slate-100 overflow-hidden">
                {/* Ornamen Background Biar Ga Sepi */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-50 to-transparent blur-3xl -z-10 opacity-60"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Header Section dengan Gaya Premium */}
                    <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
                        <span className="inline-flex items-center gap-1.5 text-blue-600 font-bold uppercase tracking-widest text-[10px] bg-blue-100/50 px-3 py-1.5 rounded-full mb-4">
                            <Sparkles size={14} /> Keunggulan Platform
                        </span>
                        <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-5 tracking-tight">
                            Mengapa Memilih Kami?
                        </h3>
                        <p className="text-slate-500 text-base leading-relaxed">
                            Kami menyediakan platform crowdfunding properti yang
                            aman, transparan, dan terpercaya untuk membantu Anda
                            membangun aset serta memperoleh pendapatan pasif.
                        </p>
                    </div>

                    {/* Grid Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
                        {/* CARD 1: Mudah */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200/60 hover:border-blue-200 shadow-sm hover:shadow-[0_8px_30px_rgb(36,96,139,0.06)] transition-all duration-500 group relative overflow-hidden text-left">
                            {/* Decorative Hover Blob */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl group-hover:bg-blue-200/60 transition-colors duration-500 z-0"></div>

                            {/* Icon Container */}
                            <div className="relative z-10 w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-sm">
                                <MonitorCheck className="w-6 h-6 text-slate-700 group-hover:text-white transition-colors duration-500" />
                            </div>

                            <div className="relative z-10">
                                <h4 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                                    Proses Mudah
                                </h4>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Registrasi cepat hanya dalam 5 menit dan
                                    mulai berinvestasi dari {""}
                                    <span className="font-bold text-slate-700">
                                        Rp1 juta
                                    </span>
                                    .
                                </p>
                            </div>
                        </div>

                        {/* CARD 2: Transparan */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200/60 hover:border-blue-200 shadow-sm hover:shadow-[0_8px_30px_rgb(36,96,139,0.06)] transition-all duration-500 group relative overflow-hidden text-left">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl group-hover:bg-emerald-200/60 transition-colors duration-500 z-0"></div>

                            <div className="relative z-10 w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm">
                                <Settings2 className="w-6 h-6 text-slate-700 group-hover:text-white transition-colors duration-500" />
                            </div>

                            <div className="relative z-10">
                                <h4 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                                    Transparansi Penuh
                                </h4>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Pantau kinerja investasi kapan saja melalui
                                    dashboard{" "}
                                    <span className="font-bold text-slate-700">
                                        real-time
                                    </span>{" "}
                                    tanpa biaya tersembunyi.
                                </p>
                            </div>
                        </div>

                        {/* CARD 3: Terjamin */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200/60 hover:border-blue-200 shadow-sm hover:shadow-[0_8px_30px_rgb(36,96,139,0.06)] transition-all duration-500 group relative overflow-hidden text-left">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-100/50 rounded-full blur-2xl group-hover:bg-indigo-200/60 transition-colors duration-500 z-0"></div>

                            <div className="relative z-10 w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-sm">
                                <SearchCheck className="w-6 h-6 text-slate-700 group-hover:text-white transition-colors duration-500" />
                            </div>

                            <div className="relative z-10">
                                <h4 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors">
                                    Keamanan Terjamin
                                </h4>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Setiap investasi didukung oleh aset properti
                                    riil sebagai jaminan utama.
                                </p>
                            </div>
                        </div>

                        {/* CARD 4: Diversifikasi */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-200/60 hover:border-blue-200 shadow-sm hover:shadow-[0_8px_30px_rgb(36,96,139,0.06)] transition-all duration-500 group relative overflow-hidden text-left">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-100/50 rounded-full blur-2xl group-hover:bg-amber-200/60 transition-colors duration-500 z-0"></div>

                            <div className="relative z-10 w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm">
                                <LayoutGrid className="w-6 h-6 text-slate-700 group-hover:text-white transition-colors duration-500" />
                            </div>

                            <div className="relative z-10">
                                <h4 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-amber-700 transition-colors">
                                    Diversifikasi Optimal
                                </h4>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Sebarkan investasi Anda ke berbagai proyek
                                    properti untuk mengoptimalkan potensi
                                    keuntungan dan mengurangi risiko.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How to Invest Section */}
            <div className="py-24 bg-white relative overflow-hidden">
                {/* Background Pattern Polkadot Tipis Biar Ga Polos */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    {/* Header Section */}
                    <div className="max-w-2xl mx-auto mb-20">
                        <span className="inline-flex items-center gap-1.5 text-blue-600 font-bold uppercase tracking-widest text-[10px] bg-blue-50 px-3 py-1.5 rounded-full mb-4 border border-blue-100">
                            <Sparkles size={14} /> Alur Sederhana
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-5 tracking-tight">
                            Cara Kerja Investasi
                        </h2>
                        <p className="text-slate-500 text-base leading-relaxed max-w-md mx-auto">
                            Mulai investasi properti dengan mudah melalui 3
                            langkah praktis dan transparan. Tanpa dokumen yang
                            berbelit-belit.
                        </p>
                    </div>

                    {/* Steps Container */}
                    <div className="relative max-w-5xl mx-auto">
                        {/* KUNCI 1: Connecting Dashed Line (Pengganti Chevron >) */}
                        {/* Garis ini ada di belakang (z-0) dan nyambungin dari card 1 ke card 3 */}
                        <div className="hidden lg:block absolute top-[4.5rem] left-[15%] right-[15%] border-t-2 border-dashed border-slate-200 z-0"></div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8 relative z-10">
                            {/* ================= LANGKAH 1 ================= */}
                            <div className="relative flex flex-col items-center text-center group">
                                {/* Glow effect pas di-hover */}
                                <div className="absolute top-4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

                                {/* Container Ikon */}
                                <div className="w-36 h-36 relative z-10 flex items-center justify-center mb-8">
                                    {/* Bentuk Squircle Miring (Berputar pas di-hover) */}
                                    <div className="absolute inset-0 bg-slate-50 rounded-[2.5rem] rotate-45 group-hover:rotate-90 group-hover:bg-blue-50 transition-all duration-700 ease-in-out border border-slate-100 shadow-sm"></div>

                                    {/* Lingkaran Dalam tempat Ikon berpijak */}
                                    <div className="absolute inset-2 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-500">
                                        <img
                                            src="assets/img/test.png"
                                            alt="Monitor Check"
                                            className="w-25 h-25 object-contain"
                                        />
                                    </div>

                                    {/* Floating Number Badge 3D */}
                                    <div className="absolute -top-1 -right-1 w-10 h-10 bg-slate-900 text-white font-black text-sm rounded-xl flex items-center justify-center shadow-lg transform rotate-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 border-2 border-white">
                                        01
                                    </div>
                                </div>

                                <h4 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                                    Pilih Properti
                                </h4>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-[260px] mx-auto">
                                    Temukan dan pelajari proyek properti yang
                                    sesuai dengan tujuan investasi Anda.
                                </p>
                            </div>

                            {/* ================= LANGKAH 2 ================= */}
                            <div className="relative flex flex-col items-center text-center group">
                                <div className="absolute top-4 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

                                <div className="w-36 h-36 relative z-10 flex items-center justify-center mb-8">
                                    <div className="absolute inset-0 bg-slate-50 rounded-[2.5rem] rotate-45 group-hover:rotate-90 group-hover:bg-emerald-50 transition-all duration-700 ease-in-out border border-slate-100 shadow-sm"></div>
                                    <div className="absolute inset-2 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-500">
                                        <img
                                            src="assets/img/digital-wallet.png"
                                            alt="Monitor Check"
                                            className="w-25 h-25 object-contain"
                                        />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-10 h-10 bg-slate-900 text-white font-black text-sm rounded-xl flex items-center justify-center shadow-lg transform rotate-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 border-2 border-white">
                                        02
                                    </div>
                                </div>

                                <h4 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                                    Investasikan Dana
                                </h4>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-[260px] mx-auto">
                                    Lakukan investasi secara aman dan mudah
                                    melalui platform kami.
                                </p>
                            </div>

                            {/* ================= LANGKAH 3 ================= */}
                            <div className="relative flex flex-col items-center text-center group">
                                <div className="absolute top-4 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

                                <div className="w-36 h-36 relative z-10 flex items-center justify-center mb-8">
                                    <div className="absolute inset-0 bg-slate-50 rounded-[2.5rem] rotate-45 group-hover:rotate-90 group-hover:bg-indigo-50 transition-all duration-700 ease-in-out border border-slate-100 shadow-sm"></div>
                                    <div className="absolute inset-2 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-500">
                                        <img
                                            src="assets/img/profit.png"
                                            alt="Monitor Check"
                                            className="w-25 h-25 object-contain"
                                        />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-10 h-10 bg-slate-900 text-white font-black text-sm rounded-xl flex items-center justify-center shadow-lg transform rotate-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 border-2 border-white">
                                        03
                                    </div>
                                </div>

                                <h4 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors">
                                    Terima Imbal Hasil
                                </h4>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-[260px] mx-auto">
                                    Dapatkan keuntungan sesuai performa proyek
                                    saat properti berhasil dijual atau investasi
                                    berakhir.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Proyek Section */}
            <div
                id="projects"
                className="relative py-24 bg-white overflow-hidden"
            >
                {/* Ornamen Background Biar Elegan */}
                <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-gradient-to-bl from-blue-50/50 to-transparent -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section Premium - Dibikin sejajar sama tombol View All (Desktop) */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
                        <div className="text-left max-w-2xl">
                            <span className="inline-flex items-center gap-1.5 text-rose-600 font-bold uppercase tracking-widest text-[10px] bg-rose-50 px-3 py-1.5 rounded-full mb-4 border border-rose-100">
                                <Flame size={14} className="animate-pulse" />{" "}
                                Sedang Berlangsung
                            </span>
                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                                Proyek Berjalan
                            </h3>
                            <p className="text-slate-500 text-base leading-relaxed">
                                Diversifikasikan portofolio Anda ke aset
                                properti pilihan terbaik dengan potensi imbal
                                hasil maksimal.
                            </p>
                        </div>

                        {/* Tombol View All pindah ke atas (Desktop) biar modern */}
                        <Link
                            href={route("crowdfunding.project")}
                            className="hidden md:inline-flex items-center gap-2 bg-white hover:bg-slate-900 text-slate-800 hover:text-white border-2 border-slate-200 hover:border-slate-900 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-xl"
                        >
                            Lihat Semua Proyek <ArrowRight size={16} />
                        </Link>
                    </div>

                    {properties.data.length > 0 ? (
                        /* Boks pembungkus abu-abu DIHAPUS. Biarkan slider bebas di ruang putih. */
                        <div className="relative w-full -mx-4 px-4 sm:mx-0 sm:px-0">
                            {/* Swiper Container */}
                            <Swiper
                                effect={"coverflow"}
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView={"auto"}
                                loop={properties.data.length > 3}
                                speed={800} // Dibikin agak lambat biar efek 3D-nya smooth
                                spaceBetween={32} // Jarak antar card dilebarin
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 80, // Depth ditambah biar efek 3D makin dalam
                                    modifier: 2, // Modifier dinaikin biar card belakang makin mengecil
                                    slideShadows: false,
                                }}
                                navigation={{
                                    nextEl: ".swiper-button-next-custom",
                                    prevEl: ".swiper-button-prev-custom",
                                }}
                                modules={[EffectCoverflow, Navigation]}
                                className="w-full py-10 !overflow-visible" // Overflow visible biar bayangan card ga kepotong
                            >
                                {properties.data.map((prop, index) => (
                                    <SwiperSlide
                                        key={index}
                                        className="!w-[320px] md:!w-[380px] bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_20px_60px_rgba(36,96,139,0.15)] group"
                                    >
                                        {/* Image Section Keren */}
                                        <div className="relative h-56 bg-slate-100 overflow-hidden">
                                            <img
                                                src={
                                                    prop.image ||
                                                    `https://placehold.co/600x400?text=${encodeURIComponent(prop.name)}`
                                                }
                                                alt={prop.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            {/* Gradasi bayangan dari bawah gambar biar teks nyatu */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            {/* Badge Glassmorphism */}
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-[#24608B] tracking-widest uppercase shadow-sm flex items-center gap-1.5 border border-white/50">
                                                <Building2 size={14} /> Flipping
                                            </div>
                                        </div>

                                        {/* Content Area Bawah */}
                                        <div className="p-6 md:p-8 flex-1 flex flex-col relative bg-white">
                                            <h3 className="text-xl font-extrabold text-slate-900 mb-1.5 line-clamp-1 group-hover:text-[#24608B] transition-colors">
                                                {prop.name}
                                            </h3>
                                            <p className="text-sm font-medium text-slate-500 mb-6 flex items-center gap-1.5">
                                                <MapPin
                                                    size={14}
                                                    className="text-slate-400"
                                                />{" "}
                                                {prop.loc}
                                            </p>

                                            {/* Progress Bar yang Nyatu & Elegan */}
                                            <div className="mb-6">
                                                <div className="flex items-end justify-between mb-2.5">
                                                    <span className="text-xs font-bold text-slate-700">
                                                        Terkumpul
                                                    </span>
                                                    <span className="text-sm font-black text-emerald-600 flex items-center gap-1">
                                                        {prop.progress}%
                                                        {prop.progress >=
                                                            100 && (
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                                                    <div
                                                        className="bg-emerald-500 h-full rounded-full relative transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${Math.min(prop.progress, 100)}%`,
                                                        }}
                                                    >
                                                        {/* Efek kilap berjalan di progress bar */}
                                                        <div className="absolute inset-0 bg-white/20 w-full h-full skew-x-[-20deg] translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Info Grid (Gaya Dashboard Modern) */}
                                            <div className="grid grid-cols-2 gap-3 bg-slate-50/80 p-4 rounded-2xl mb-8 border border-slate-100/80">
                                                <div>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-0.5">
                                                        ROI (p.a)
                                                    </span>
                                                    <span className="font-black text-[#24608B] text-base">
                                                        {prop.roi}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-0.5">
                                                        Tenor
                                                    </span>
                                                    <span className="font-black text-slate-800 text-base">
                                                        {prop.tenor}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-0.5">
                                                        Terkumpul
                                                    </span>
                                                    <span className="font-extrabold text-emerald-600 text-sm">
                                                        {new Intl.NumberFormat(
                                                            "id-ID",
                                                            {
                                                                style: "currency",
                                                                currency: "IDR",
                                                                minimumFractionDigits: 0,
                                                            },
                                                        ).format(
                                                            prop.collected,
                                                        )}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-0.5">
                                                        Target
                                                    </span>
                                                    <span className="font-extrabold text-slate-800 text-sm">
                                                        {new Intl.NumberFormat(
                                                            "id-ID",
                                                            {
                                                                style: "currency",
                                                                currency: "IDR",
                                                                minimumFractionDigits: 0,
                                                            },
                                                        ).format(prop.goal)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Premium Action Button */}
                                            <Link
                                                href={route(
                                                    "crowdfunding.show",
                                                    prop.crowdfunding_id,
                                                )}
                                                className="mt-auto w-full text-center bg-white border-2 border-slate-200 text-slate-700 hover:border-[#24608B] hover:bg-[#24608B] hover:text-white font-bold py-4 rounded-xl transition-all duration-300 text-sm shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                                            >
                                                Lihat Prospektus
                                            </Link>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Navigation Buttons Luar */}
                            <button className="swiper-button-prev-custom hidden md:flex absolute left-4 lg:-left-4 xl:-left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/90 backdrop-blur text-slate-700 hover:text-[#24608B] hover:scale-110 rounded-full items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 transition-all">
                                <ChevronLeft size={24} strokeWidth={2.5} />
                            </button>

                            <button className="swiper-button-next-custom hidden md:flex absolute right-4 lg:-right-4 xl:-right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/90 backdrop-blur text-slate-700 hover:text-[#24608B] hover:scale-110 rounded-full items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 transition-all">
                                <ChevronRight size={24} strokeWidth={2.5} />
                            </button>

                            {/* Bottom View All Button (Mobile Only) */}
                            <div className="mt-8 flex justify-center md:hidden relative z-10">
                                <Link
                                    href={route("crowdfunding.project")}
                                    className="w-full bg-[#24608B] hover:bg-[#1d4d70] text-white px-8 py-4 rounded-xl font-bold text-sm text-center transition-all shadow-md"
                                >
                                    Lihat Semua Proyek
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 py-24 px-4 text-slate-500 text-sm max-w-3xl mx-auto flex flex-col items-center">
                            <Building2
                                size={48}
                                className="text-slate-300 mb-4"
                            />
                            <span className="font-bold text-slate-700 text-lg mb-1">
                                Belum Ada Proyek
                            </span>
                            <p>
                                Saat ini belum ada proyek crowdfunding yang
                                tersedia. Silakan pantau kembali nanti.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
