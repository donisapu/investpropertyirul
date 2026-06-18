import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Bed,
    Bath,
    Maximize,
    Home,
    MapPin,
    ChevronRight,
    ChevronLeft,
    Info,
    CheckCircle,
    ExternalLink,
    X,
    Wallet,
    TrendingUp,
    ShieldCheck,
    Check,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import PublicLayout from "@/Layouts/PublicLayout";
import { router } from "@inertiajs/react";

export default function Show({ property }) {
    const [investAmount, setInvestAmount] = useState(0);

    const minAmount = Number(property?.min_contribution) || 0;

    useEffect(() => {
        setInvestAmount(minAmount);
    }, [minAmount]);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const [activeTab, setActiveTab] = useState("details");
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = "unset";
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) =>
            prev === (property.images?.length || 0) - 1 ? 0 : prev + 1,
        );
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) =>
            prev === 0 ? (property.images?.length || 0) - 1 : prev - 1,
        );
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightboxOpen) return;

            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") nextImage(e);
            if (e.key === "ArrowLeft") prevImage(e);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxOpen]);

    // Dummy chart data
    const chartData = [
        { name: "Jan 2025", returns: 8.5, avg: 10 },
        { name: "Feb 2025", returns: 8.8, avg: 10 },
        { name: "Mar 2025", returns: 9.2, avg: 10 },
        { name: "Apr 2025", returns: 9.0, avg: 10 },
        { name: "May 2025", returns: 9.5, avg: 10 },
        { name: "Jun 2025", returns: 9.8, avg: 10 },
        { name: "Jul 2025", returns: 10.0, avg: 10 },
        { name: "Aug 2025", returns: 10.2, avg: 10 },
        { name: "Sep 2025", returns: 10.1, avg: 10 },
        { name: "Oct 2025", returns: 9.5, avg: 10 },
        { name: "Nov 2025", returns: 8.0, avg: 10 },
        { name: "Dec 2025", returns: 9.5, avg: 10 },
    ];

    // Dummy leaderboard data
    const leaderboard = [
        {
            id: 1,
            name: "k3ptian",
            tokens: 50,
            avatar: "https://i.pravatar.cc/150?u=1",
        },
        {
            id: 2,
            name: "borkangvilla",
            tokens: 120,
            avatar: "https://i.pravatar.cc/150?u=2",
            rank: 1,
        },
        {
            id: 3,
            name: "0xdansk",
            tokens: 85,
            avatar: "https://i.pravatar.cc/150?u=3",
        },
        { id: 4, name: "GORO3214120795", tokens: 40 },
        { id: 5, name: "GORO2130274444", tokens: 35 },
        { id: 6, name: "GORO4726486714", tokens: 30 },
    ];

    return (
        <PublicLayout>
            <Head title={property.name} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex items-center text-sm text-slate-500 mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Crowdfunding Investment
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-10">
                    {/* Kolom Kiri */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden">
                        {/* Header Gambar (Cinematic) */}
                        <div className="h-64 w-full relative">
                            <img
                                src={
                                    property.main_image ||
                                    "https://placehold.co/800x600"
                                }
                                alt={property.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent p-8 flex flex-col justify-end">
                                <h2 className="text-white text-2xl font-black tracking-tight">
                                    {property.name}
                                </h2>
                                <p className="text-blue-200 text-sm font-medium flex items-center gap-1.5">
                                    <MapPin size={14} /> {property.loc}
                                </p>
                            </div>
                        </div>

                        {/* Form Input Area */}
                        <div className="p-8">
                            <div className="mb-8">
                                <h3 className="text-lg font-black text-slate-900 mb-1">
                                    Nominal Investasi
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Tentukan jumlah partisipasi Anda pada proyek
                                    ini.
                                </p>
                            </div>

                            {/* Input Terminal Styling */}
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-[#24608B] transition-colors">
                                    IDR
                                </div>
                                <input
                                    type="number"
                                    value={investAmount}
                                    min={minAmount}
                                    onChange={(e) =>
                                        setInvestAmount(Number(e.target.value))
                                    }
                                    className="w-full pl-16 pr-6 py-6 bg-slate-50 border-2 border-slate-100 rounded-3xl text-3xl font-black text-slate-900 placeholder-slate-300 outline-none transition-all focus:border-[#24608B] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    placeholder="1.000.000"
                                />
                                {/* Quick Select Nominal (Biar User Ga Capek Ngetik) */}
                                <div className="flex gap-2 mt-4">
                                    {[1000000, 5000000, 10000000].map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => setInvestAmount(amt)}
                                            className="text-[10px] font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-[#24608B] hover:text-[#24608B] transition-colors"
                                        >
                                            + {formatCurrency(amt)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Summary Mini (Biar Keren) */}
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        Estimasi Imbal Hasil
                                    </div>
                                    <div className="text-lg font-black text-emerald-600">
                                        {/* Logika hitung ROI sederhana */}
                                        {formatCurrency(investAmount * 0.12)}
                                    </div>
                                    <div className="text-[10px] text-slate-400">
                                        / Tahun
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        Status Proyek
                                    </div>
                                    <div className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                                        {property.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan (Order Summary) */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 sticky top-24">
                            {/* Header dengan Ikon Security Biar Mantap */}
                            <div className="flex items-center gap-3 mb-8 pb-3 border-b border-slate-100">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                    <ShieldCheck size={20} />
                                </div>
                                <h5 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                    Order Summary
                                </h5>
                            </div>

                            {/* Rincian Harga (Gaya Grid) */}
                            <div className="space-y-3 mb-8">
                                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <div>
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-0.5">
                                            Total Amount
                                        </span>
                                        <span className="font-extrabold text-slate-900 text-sm">
                                            {formatRupiah(investAmount)}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-0.5">
                                            Transaction Fee
                                        </span>
                                        <span className="font-extrabold text-emerald-600 text-sm flex items-center justify-end gap-1">
                                            <Check size={14} /> FREE
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                        <Info className="w-3.5 h-3.5 text-slate-400" />{" "}
                                        Payment Processing Fee
                                    </span>
                                    <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                                        <Check size={12} /> FREE
                                    </span>
                                </div>
                            </div>

                            {/* Total Payment (Besar & Sleek) */}
                            <div className="mb-8 text-center bg-blue-50/50 p-6 rounded-2xl border border-blue-100 relative overflow-hidden group">
                                {/* Ornamen blur di background */}
                                <div className="absolute -right-10 -top-10 w-24 h-24 bg-blue-100 rounded-full blur-xl group-hover:bg-blue-200 transition-colors"></div>
                                <div className="relative z-10">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#24608B] block mb-1">
                                        Total Pembayaran
                                    </span>
                                    <span className="text-4xl font-black text-[#24608B] tracking-tighter">
                                        {formatRupiah(investAmount)}
                                    </span>
                                </div>
                            </div>

                            {/* Agreement Checkbox (Rapi & Proposional) */}
                            <div className="flex gap-3 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <input
                                    type="checkbox"
                                    className="mt-1 w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                                    id="agree"
                                />
                                <label
                                    htmlFor="agree"
                                    className="text-[11px] leading-relaxed text-slate-600"
                                >
                                    By checking this box, I confirm I have read
                                    and agree to the{" "}
                                    <span className="font-bold text-emerald-600 underline cursor-pointer hover:text-emerald-700">
                                        Fractional Property Transaction
                                        Agreement
                                    </span>
                                    , and I acknowledge the risks associated
                                    with this investment.
                                </label>
                            </div>

                            {/* Tombol Final CTA (Gaya Premium) */}
                            <button
                                onClick={() =>
                                    router.post(
                                        route(
                                            "user.payment.crowdfunding",
                                            property.id,
                                        ),
                                        { total_amount: investAmount },
                                    )
                                }
                                className="w-full group flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-[#24608B] text-white font-black py-4.5 rounded-2xl transition-all shadow-lg hover:shadow-blue-900/20 hover:-translate-y-0.5 hover:-rotate-1"
                            >
                                Continue to Payment{" "}
                                <ChevronRight
                                    size={18}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            </button>
                            <div className="text-center mt-4">
                                <a
                                    href="#"
                                    className="text-xs text-slate-400 hover:text-slate-600 hover:underline"
                                >
                                    Cancel Order
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 z-50"
                    >
                        <X size={32} />
                    </button>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevImage}
                        className="absolute left-4 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full z-50"
                    >
                        <ChevronLeft size={48} />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full z-50"
                    >
                        <ChevronRight size={48} />
                    </button>

                    {/* Main Image */}
                    <div
                        className="relative max-w-7xl w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={property.images[currentImageIndex]}
                            alt={`Gallery image ${currentImageIndex + 1}`}
                            className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
                        />

                        {/* Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm font-medium">
                            {currentImageIndex + 1} / {property.images.length}
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
