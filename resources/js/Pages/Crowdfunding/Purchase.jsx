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
    const [investAmount, setInvestAmount] = useState(100000);
    const minAmount = 100000;

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
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
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            {/* Image with Overlay Text */}
                            <div className="h-[300px] w-full relative">
                                <img
                                    src={
                                        property.main_image ||
                                        "https://placehold.co/800x600"
                                    }
                                    alt={property.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay Text ala Gambar 1 */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                    <h2 className="text-white text-xl font-bold">
                                        {property.name}{" "}
                                        <span className="font-normal text-sm opacity-80">
                                            {property.loc}
                                        </span>
                                    </h2>
                                </div>
                            </div>

                            {/* Quantity Selector Section */}
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            Investment Amount
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Min IDR 100,000
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <input
                                                type="number"
                                                name="total_amount"
                                                className="w-50 px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={investAmount}
                                                min={minAmount}
                                                onChange={(e) =>
                                                    setInvestAmount(
                                                        Number(e.target.value),
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-6 border-slate-100" />

                                {/* Use Balance Toggle */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                            <Wallet className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900">
                                                Use Balance
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                IDR 1,886 available
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan (Order Summary) */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h5 className="text-xl font-bold text-slate-900 mb-6">
                                Order Summary
                            </h5>

                            <div className="space-y-4 text-sm font-medium">
                                <div className="flex justify-between text-slate-500">
                                    <span>Total Amount</span>
                                    <span className="text-slate-900">
                                        {formatRupiah(investAmount)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span className="flex items-center gap-1">
                                        Transaction Fee{" "}
                                        <Info className="w-3 h-3" />
                                    </span>
                                    <span className="text-emerald-500 font-bold">
                                        FREE
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span className="flex items-center gap-1">
                                        Payment Processing Fee{" "}
                                        <Info className="w-3 h-3" />
                                    </span>
                                    <span className="text-emerald-500 font-bold">
                                        FREE
                                    </span>
                                </div>
                            </div>

                            <hr className="my-6 border-slate-100" />

                            <div className="flex justify-between items-center mb-8">
                                <span className="text-lg font-bold text-slate-900">
                                    Total Payment
                                </span>
                                <span className="text-2xl font-black text-slate-900">
                                    {formatRupiah(investAmount)}
                                </span>
                            </div>

                            {/* Agreement Checkbox */}
                            <div className="flex gap-3 mb-6">
                                <input
                                    type="checkbox"
                                    className="mt-1 w-4 h-4 accent-emerald-600"
                                    id="agree"
                                />
                                <label
                                    htmlFor="agree"
                                    className="text-[11px] leading-relaxed text-slate-600"
                                >
                                    By checking the box, I acknowledge that I
                                    have read and understood the{" "}
                                    <span className="text-emerald-600 underline cursor-pointer">
                                        Fractional Property (Token) Transaction
                                        Agreement
                                    </span>
                                    ...
                                </label>
                            </div>

                            {/* Info Banner */}
                            <div className="bg-orange-500 text-white text-[11px] font-bold py-2 px-4 rounded-lg text-center mb-4">
                                The next rent distribution is no later than Apr
                                21, 2026
                            </div>

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
                                className="w-full py-4 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg transition-all"
                            >
                                Continue to Payment
                            </button>
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
