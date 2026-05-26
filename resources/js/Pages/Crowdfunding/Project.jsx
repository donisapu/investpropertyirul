import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Building2, SearchCheck, CheckCircle2, ArrowLeft } from "lucide-react";
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section dengan Search Bar (Seimbang / Gak Berat Kiri) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-5 border-b border-slate-100">
                    <div className="text-left">
                        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                            Property List
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                            Discover available property crowdfunding projects.
                        </p>
                    </div>

                    {/* Search Bar di Kanan */}
                    <div className="relative w-full sm:w-80 md:w-96">
                        <input
                            type="text"
                            placeholder="Search property..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-2.5 pl-4 pr-10 border border-slate-200 focus:border-[#24608B] focus:ring-2 focus:ring-blue-50/50 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none transition-all duration-200 shadow-sm"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-teal-600">
                            <SearchCheck className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Grid Card Properti */}
                {filteredProperties.length > 0 ? (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProperties.map((prop, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Image Section dengan Badge Status */}
                                    <div className="relative h-56 bg-slate-100 overflow-hidden group">
                                        <img
                                            src={
                                                prop.image ||
                                                `https://placehold.co/600x400?text=${encodeURIComponent(
                                                    prop.name,
                                                )}`
                                            }
                                            alt={prop.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {/* Badge Status (contoh: FLIPPING) */}
                                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-600 tracking-wide uppercase border border-slate-100 shadow-sm flex items-center gap-1.5">
                                            <Building2
                                                size={12}
                                                className="text-blue-600"
                                            />
                                            {prop.status || "Flipping"}
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-base font-bold text-slate-800 mb-4 leading-snug">
                                            {prop.name},{" "}
                                            <span className="text-slate-400 font-normal">
                                                {prop.loc}
                                            </span>
                                        </h3>

                                        {/* Progress Bar Premium Style */}
                                        <div className="mb-5 bg-slate-50/70 p-4 rounded-xl border border-slate-100/80">
                                            <div className="flex items-center justify-between text-xs font-semibold mb-2">
                                                <span className="text-slate-500 font-medium">
                                                    Funds Raised:
                                                </span>
                                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                                    {parseFloat(
                                                        prop.progress,
                                                    ).toFixed(2)}
                                                    %
                                                    {prop.progress >= 100 && (
                                                        <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                                                    )}
                                                </span>
                                            </div>

                                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full transition-all duration-700"
                                                    style={{
                                                        width: `${Math.min(prop.progress, 100)}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Info Grid (Sesuai Mockup Lu) */}
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-5 text-xs border-t border-dashed border-slate-100 pt-5 mb-6">
                                            <div>
                                                <span className="text-slate-400 block mb-1 font-medium">
                                                    Return (ROI)
                                                </span>
                                                <span className="font-extrabold text-slate-800 text-sm block">
                                                    {prop.roi} p.a
                                                </span>
                                            </div>

                                            <div>
                                                <span className="text-slate-400 block mb-1 font-medium">
                                                    Project Durations
                                                </span>
                                                <span className="font-extrabold text-slate-800 text-sm block">
                                                    {prop.tenor}
                                                </span>
                                            </div>

                                            <div>
                                                <span className="text-slate-400 block mb-1 font-medium">
                                                    Funds Raised
                                                </span>
                                                <span className="font-extrabold text-slate-800 text-sm block">
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
                                                <span className="text-slate-400 block mb-1 font-medium">
                                                    Target
                                                </span>
                                                <span className="font-extrabold text-slate-800 text-sm block">
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

                                        {/* Action Button */}
                                        <Link
                                            href={route(
                                                "crowdfunding.show",
                                                prop.crowdfunding_id,
                                            )}
                                            className="mt-auto w-full text-center bg-slate-50 hover:bg-[#24608B] text-[#24608B] hover:text-white font-bold py-3 rounded-xl transition-all duration-200 text-xs tracking-wide border border-slate-100 hover:border-[#24608B] shadow-sm"
                                        >
                                            Project Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Links (Standard Inertia/Laravel Paginator UI) */}
                        {properties.links && properties.links.length > 3 && (
                            <div className="mt-12 flex justify-center gap-1">
                                {properties.links.map((link, key) => (
                                    <Link
                                        key={key}
                                        href={link.url || "#"}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                                            link.active
                                                ? "bg-[#24608B] text-white border-[#24608B]"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 py-20 px-4 text-slate-400 text-sm shadow-inner">
                        No property projects found matching your criteria.
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
