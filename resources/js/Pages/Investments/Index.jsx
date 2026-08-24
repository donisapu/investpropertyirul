import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Bed,
    Bath,
    Maximize,
    Building2,
    MapPin,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import PublicLayout from "@/Layouts/PublicLayout";
import RentalCalculator from "@/Components/RentalCalculator";

export default function Investments({ properties, settings, partners }) {
    return (
        <PublicLayout>
            <Head title="Investments" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Banner */}
                <div className="group relative mb-12 overflow-hidden rounded-2xl border border-white/10 bg-[#1b1916] shadow-xl">

                    {/* ==================== BACKGROUND IMAGE ==================== */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]"
                        style={{
                            backgroundImage:
                                "url('https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1600')",
                        }}
                    />

                    {/* Warm Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#171512]/95 via-[#1c1a16]/90 to-[#211f1b]/55" />

                    {/* Soft Warm Light */}
                    <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#c9a45c]/10 blur-3xl" />

                    <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-[#e2c681]/[0.04] blur-3xl" />


                    {/* ==================== CONTENT ==================== */}
                    <div className="relative z-10 flex min-h-[400px] items-center px-7 py-14 md:px-12 md:py-16 lg:px-16">

                        <div className="max-w-2xl">

                            {/* Eyebrow */}
                            <div className="mb-6 flex items-center gap-3">

                                <span className="h-px w-10 bg-[#c9a45c]/70" />

                                <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-[#d5b66f]">
                                    Property Investment
                                </span>

                            </div>


                            {/* ==================== HEADING ==================== */}
                            <h2 className="font-serif text-[2.15rem] leading-[1.08] tracking-[-0.02em] text-[#f5f1e8] md:text-5xl lg:text-[3.5rem]">

                                Mulai Investasi Properti
                                <span className="mt-2 block text-[#d8d0c2]">
                                    Bersama{" "}
                                    <span className="text-[#d1ad62]">
                                        {settings?.site_name}
                                    </span>
                                </span>

                            </h2>


                            {/* Gold Divider */}
                            <div className="mt-7 flex items-center gap-3">

                                <span className="h-px w-14 bg-[#c9a45c]/60" />

                                <span className="h-1.5 w-1.5 rotate-45 border border-[#c9a45c]/70" />

                            </div>


                            {/* Description */}
                            <p className="mt-6 max-w-xl text-sm leading-7 text-[#c9c2b6] md:text-[15px]">

                                Temukan peluang investasi properti premium dengan
                                potensi imbal hasil yang menarik, didukung oleh
                                aset properti nyata dan proses investasi yang
                                transparan.

                            </p>


                            {/* ==================== CTA ==================== */}
                            <div className="mt-9 flex flex-wrap items-center gap-5">

                                <a
                                    href="#investment-projects"
                                    className="inline-flex items-center gap-3 rounded-full bg-[#c9a45c] px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#171512] transition duration-300 hover:bg-[#e0c27a]"
                                >
                                    Jelajahi Investasi

                                    <span className="text-sm">
                                        →
                                    </span>
                                </a>


                                <a
                                    href="#how-it-works"
                                    className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d4cdc0]/70 transition duration-300 hover:text-[#d8b96d]"
                                >
                                    Cara Berinvestasi

                                    <span className="text-sm">
                                        →
                                    </span>
                                </a>

                            </div>

                        </div>


                        {/* ==================== DECORATIVE ELEMENT ==================== */}
                        <div className="pointer-events-none absolute right-8 top-1/2 hidden h-[270px] w-[230px] -translate-y-1/2 md:block lg:right-14">

                            {/* Outer Frame */}
                            <div className="absolute inset-0 rotate-3 border border-[#d1ad62]/20" />

                            {/* Inner Frame */}
                            <div className="absolute inset-5 -rotate-3 border border-[#d1ad62]/10" />


                            {/* Number */}
                            <div className="absolute right-7 top-1/2 -translate-y-1/2 text-right">

                                <div className="font-serif text-[90px] leading-none text-[#d1ad62]/15">
                                    01
                                </div>

                                <div className="mt-4 text-[9px] font-medium uppercase tracking-[0.35em] text-[#e4ded3]/30">
                                    Investment
                                </div>

                            </div>


                            {/* Decorative Accent */}
                            <div className="absolute bottom-8 left-8 flex items-center gap-3">

                                <span className="h-px w-14 bg-[#d1ad62]/30" />

                                <span className="h-1.5 w-1.5 rotate-45 border border-[#d1ad62]/50" />

                            </div>

                        </div>

                    </div>

                </div>

                {/* Grid */}
                {properties.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.data.map((prop, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                            >
                                {/* Image Section - Ditambah tingginya (h-60) biar visual properti dominan */}
                                <div className="relative h-60 bg-slate-200 overflow-hidden flex-none">
                                    <img
                                        src={
                                            prop.image ||
                                            `https://placehold.co/600x400?text=${encodeURIComponent(prop.name)}`
                                        }
                                        alt={prop.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Badge Lokasi */}
                                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-700 flex items-center gap-1 shadow-sm">
                                        <MapPin className="w-3 h-3 text-emerald-600" />
                                        {prop.loc}
                                    </div>

                                    {/* Badge Sold Out */}
                                    {prop.sold && (
                                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-10">
                                            <span className="bg-red-500 text-white px-3 py-1.5 rounded-md font-bold tracking-wider uppercase text-xs shadow-md">
                                                Sold Out
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content Section - Padding dikecilkan (p-4) biar lebih ketat */}
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    {/* Baris Atas: Judul & Keterangan Singkat */}
                                    <div className="mb-3">
                                        <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                                            {prop.name}
                                        </h3>

                                        {/* Specs Mikro */}
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Bed className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                                {prop.specs.bedroom}
                                            </span>
                                            <span className="text-slate-300">
                                                •
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Bath className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                                {prop.specs.bathroom}
                                            </span>
                                            <span className="text-slate-300">
                                                •
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Maximize className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                                {prop.specs.area}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info Matrix (ROI & Progress Berjajaran Kiri-Kanan) */}
                                    {/* Ini kunci biar compact: menghemat 1 baris penuh */}
                                    <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 mb-4 mt-auto">
                                        {/* Kolom Kiri: ROI & Periode */}
                                        <div className="flex flex-col justify-center">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-black text-emerald-600 tracking-tight">
                                                    {prop.roi}
                                                </span>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                                    ROI
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-slate-500 font-medium">
                                                Tenor: {prop.roi_period} Bln
                                            </span>
                                        </div>

                                        {/* Kolom Kanan: Progress & Sisa Token */}
                                        <div className="border-l border-slate-100 pl-3 flex flex-col justify-center space-y-1">
                                            <div className="flex justify-between items-center text-[11px] font-bold">
                                                <span className="text-emerald-700">
                                                    {prop.progress}%
                                                </span>
                                                <span className="text-slate-400 font-normal">
                                                    {prop.tokens} Lot Terisa
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-emerald-500 h-full rounded-full"
                                                    style={{
                                                        width: `${Math.max(prop.progress, 5)}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tombol Aksi Tinggi Dipersempit (py-2.5) */}
                                    <Link
                                        href={route(
                                            "investments.show",
                                            prop.id,
                                        )}
                                        className={`w-full block text-center font-bold text-xs py-2.5 rounded-lg transition-all duration-200 ${
                                            prop.sold
                                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                : "bg-slate-900 hover:bg-emerald-600 text-white shadow-sm"
                                        }`}
                                    >
                                        {prop.sold ? "Ditutup" : "Lihat Detail"}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-4">
                        <div className="bg-slate-50 rounded-2xl p-8 max-w-lg mx-auto border border-slate-100">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-slate-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                No Investment Properties Found
                            </h3>
                            <p className="text-slate-600 mb-6">
                                We currently don't have any investment
                                properties available. Please check back later
                                for new opportunities.
                            </p>
                            <a
                                href="/"
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                Return Home
                            </a>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-14 mb-8 flex justify-center items-center gap-2.5">
                    {properties.links.map((link, index) => {
                        const isFirst = index === 0;
                        const isLast = index === properties.links.length - 1;

                        let content;
                        if (isFirst) {
                            content = <ChevronLeft className="w-5 h-5" />;
                        } else if (isLast) {
                            content = <ChevronRight className="w-5 h-5" />;
                        } else {
                            content = (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            );
                        }

                        return link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                className={`min-w-[2.75rem] h-11 px-3 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 ${
                                    link.active
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                                        : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 hover:-translate-y-0.5"
                                }`}
                            >
                                {content}
                            </Link>
                        ) : (
                            <span
                                key={index}
                                className="min-w-[2.75rem] h-11 px-3 flex items-center justify-center rounded-xl text-sm font-bold bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed"
                            >
                                {content}
                            </span>
                        );
                    })}
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <RentalCalculator />
                </div>
            </div>
        </PublicLayout>
    );
}
