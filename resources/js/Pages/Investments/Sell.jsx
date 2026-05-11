import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";
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

export default function Show({ property }) {
    const minLot = 1;
    const maxLot = Number(property?.portfolio?.lot_held ?? 0);
    const [quantity, setQuantity] = useState(minLot);
    const tokenPrice = parseFloat(property.financials.price_per_lot);
    const tokenHeld = Number(property?.portfolio?.lot_held ?? 0);
    console.log(property.portfolio.lot_held);

    const handleIncrement = () => {
        setQuantity((prev) => (prev < tokenHeld ? prev + 1 : prev));
    };
    const handleDecrement = () =>
        setQuantity((prev) => (prev > minLot ? prev - 1 : minLot));

    const handleInputChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        let numValue = value === "" ? 0 : parseInt(value);

        if (numValue > tokenHeld) {
            numValue = tokenHeld;
        }

        setQuantity(numValue);
    };

    const handleBlur = () => {
        if (quantity < minLot) {
            setQuantity(minLot);
        }
    };

    const totalPayment = quantity * tokenPrice;

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
                        Request Sell Token
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
                                    </h2>
                                    <h2 className="text-white text-xl font-bold">
                                        <span className="font-normal text-sm opacity-80">
                                            {property.loc}
                                        </span>
                                    </h2>
                                </div>
                            </div>

                            {/* Quantity Selector Section */}
                            <div className="p-6 space-y-4">
                                {/* Baris 1: Token Owned */}
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <h3 className="font-semibold text-slate-700">
                                        Token owned
                                    </h3>
                                    <div className="flex items-center gap-1 text-slate-600">
                                        <span className="font-medium">
                                            {tokenHeld} tokens available
                                        </span>
                                        <svg
                                            className="w-4 h-4 text-slate-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Baris 2: Token Quantity */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-semibold text-slate-700">
                                            Token Quantity
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            IDR {tokenPrice.toLocaleString()}
                                            /token
                                        </p>
                                    </div>

                                    {/* Input Group dengan tombol MAX */}
                                    <div className="flex items-center gap-2 p-1.5 border border-emerald-600 rounded-lg bg-white">
                                        <div className="flex items-center">
                                            <button
                                                onClick={handleDecrement}
                                                className="w-8 h-8 flex items-center justify-center rounded-full text-emerald-600 hover:bg-emerald-50 font-bold"
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max={tokenHeld}
                                                className="w-16 text-center font-bold text-slate-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                value={quantity}
                                                onChange={handleInputChange}
                                                onBlur={handleBlur}
                                            />
                                            <button
                                                onClick={handleIncrement}
                                                className="w-8 h-8 flex items-center justify-center rounded-full text-emerald-600 hover:bg-emerald-50 font-bold"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() =>
                                                setQuantity(tokenHeld)
                                            }
                                            className="bg-emerald-800 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-emerald-900 transition-colors"
                                        >
                                            MAX
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan (Order Summary) */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h5 className="text-xl font-bold text-slate-900 mb-6">
                                Summary
                            </h5>

                            <div className="space-y-4 text-sm font-medium">
                                <div className="flex justify-between text-slate-500">
                                    <span>Lot Quantity</span>
                                    <span className="text-slate-900">
                                        {quantity} Lots
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span className="flex items-center gap-1">
                                        Price per Lot
                                    </span>
                                    <span className="text-slate-900">
                                        IDR {tokenPrice.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span className="flex items-center gap-1">
                                        Subtotal
                                    </span>
                                    <span className="text-slate-900">
                                        IDR {totalPayment.toLocaleString()}
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
                            </div>

                            <hr className="my-6 border-slate-100" />

                            <div className="flex justify-between items-center mb-8">
                                <span className="text-lg font-bold text-slate-900">
                                    Total Receive
                                </span>
                                <span className="text-2xl font-black text-slate-900">
                                    IDR {totalPayment.toLocaleString()}
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
                            <button
                                onClick={() =>
                                    router.post(
                                        route(
                                            "user.sell.investment",
                                            property.id,
                                        ),
                                        {
                                            lot: quantity,
                                        },
                                        {
                                            onSuccess: () => {
                                                window.location.href =
                                                    route("user.portfolio");
                                            },
                                        },
                                    )
                                }
                                className="w-full py-4 rounded-lg font-bold text-white bg-emerald-900 hover:bg-emerald-800"
                            >
                                Next
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
