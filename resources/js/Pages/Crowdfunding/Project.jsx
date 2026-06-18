import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Building2,
    SearchCheck,
    CheckCircle2,
    ArrowLeft,
    Search,
    MapPin,
} from "lucide-react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function Crowdfunding({ properties, settings }) {
    const [search, setSearch] = useState("");

    // Filter data properti secara lokal berdasarkan input search (opsional, sebagai pemanis sebelum disinkronkan ke backend)
    const filteredProperties = properties.data.filter(
        (prop) =>
            prop.name.toLowerCase().includes(search.toLowerCase()) ||
            prop.loc.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <PublicLayout>
            <Head title="All Crowdfunding Projects" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen bg-slate-50/30">
                {/* Header Section dengan Search Bar Keren */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="text-left max-w-xl">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                            Eksplorasi Proyek
                        </h2>
                        <p className="text-slate-500 text-base leading-relaxed">
                            Temukan peluang crowdfunding properti terbaik yang
                            sedang aktif dan siap untuk Anda danai hari ini.
                        </p>
                    </div>

                    {/* Search Bar Modern (Icon di Kiri, Shadow Glow di Hover) */}
                    <div className="relative w-full md:w-[380px] group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-[#24608B] transition-colors">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari nama properti atau lokasi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200/80 rounded-2xl text-sm text-slate-700 placeholder-slate-400 outline-none transition-all duration-300 shadow-sm focus:shadow-[0_8px_30px_rgb(36,96,139,0.12)] focus:border-[#24608B] focus:ring-0"
                        />
                        {/* Indikator "Ketik untuk mencari" mini */}
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">
                                Ketik
                            </span>
                        </div>
                    </div>
                </div>

                {/* Grid Card Properti (Styling sama persis kayak Homepage Slider biar konsisten) */}
                {filteredProperties.length > 0 ? (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
                            {filteredProperties.map((prop, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(36,96,139,0.12)] border border-slate-100 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-1.5 group"
                                >
                                    {/* Image Section */}
                                    <div className="relative h-56 bg-slate-100 overflow-hidden">
                                        <img
                                            src={
                                                prop.image ||
                                                `https://placehold.co/600x400?text=${encodeURIComponent(prop.name)}`
                                            }
                                            alt={prop.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                                        {/* Badge Glassmorphism */}
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-[#24608B] tracking-widest uppercase shadow-sm flex items-center gap-1.5 border border-white/50">
                                            <Building2 size={14} />{" "}
                                            {prop.status || "Flipping"}
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

                                        {/* Progress Bar Premium */}
                                        <div className="mb-6">
                                            <div className="flex items-end justify-between mb-2.5">
                                                <span className="text-xs font-bold text-slate-700">
                                                    Terkumpul
                                                </span>
                                                <span className="text-sm font-black text-emerald-600 flex items-center gap-1">
                                                    {parseFloat(
                                                        prop.progress,
                                                    ).toFixed(2)}
                                                    %
                                                    {prop.progress >= 100 && (
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
                                                    <div className="absolute inset-0 bg-white/20 w-full h-full skew-x-[-20deg] translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info Grid 4 Kotak */}
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
                                                    ).format(prop.collected)}
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
                                </div>
                            ))}
                        </div>

                        {/* Pagination Links yang Udah Di-Makeover (Pill Shape) */}
                        {properties.links && properties.links.length > 3 && (
                            <div className="mt-16 flex flex-wrap justify-center gap-2">
                                {properties.links.map((link, key) => {
                                    // Bersihin label bawaan Laravel kayak &laquo; Previous
                                    let label = link.label
                                        .replace("&laquo; Previous", "Prev")
                                        .replace("Next &raquo;", "Next");

                                    return (
                                        <Link
                                            key={key}
                                            href={link.url || "#"}
                                            disabled={!link.url}
                                            dangerouslySetInnerHTML={{
                                                __html: label,
                                            }}
                                            className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all duration-300 ${
                                                link.active
                                                    ? "bg-[#24608B] text-white shadow-md shadow-blue-900/20"
                                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
                                            } ${!link.url ? "opacity-40 cursor-not-allowed hover:bg-white hover:border-slate-200" : ""}`}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Empty State yang Lebih Niat */
                    <div className="text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 py-24 px-4 text-slate-500 text-sm shadow-sm max-w-2xl mx-auto flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <span className="font-bold text-slate-700 text-lg mb-2">
                            Pencarian Tidak Ditemukan
                        </span>
                        <p className="max-w-md">
                            Maaf, kami tidak dapat menemukan properti yang cocok
                            dengan kata kunci{" "}
                            <span className="font-bold text-slate-700">
                                "{search}"
                            </span>
                            . Coba gunakan kata kunci lain.
                        </p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
