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
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-slate-500 mb-6">
                    <Link
                        href="/investments"
                        className="hover:text-emerald-600"
                    >
                        Investments
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-slate-900 font-medium">
                        {property.name}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Gallery Section */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                            <div className="grid grid-cols-4 gap-4">
                                <div
                                    className="col-span-3 h-full relative group cursor-pointer"
                                    onClick={() => openLightbox(0)}
                                >
                                    <img
                                        src={
                                            property.main_image ||
                                            `https://placehold.co/800x600?text=${encodeURIComponent(property.name)}`
                                        }
                                        alt={property.name}
                                        className="w-full h-full object-cover rounded-xl transition-opacity hover:opacity-95"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span
                                            className={`px-3 py-1 rounded-lg text-sm font-bold shadow-sm ${property.sold ? "bg-slate-800 text-white" : "bg-lime-400 text-slate-900"}`}
                                        >
                                            {property.sold
                                                ? "Sold Out"
                                                : "Available"}
                                        </span>
                                    </div>
                                    <a
                                        href={property.listing_url || "#"}
                                        target="_blank"
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Airbnb Listing
                                    </a>
                                </div>
                                <div className="col-span-1 flex flex-col gap-4 h-full">
                                    {property.images &&
                                        property.images
                                            .slice(1, 3)
                                            .map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="h-1/2 relative cursor-pointer"
                                                    onClick={() =>
                                                        openLightbox(idx + 1)
                                                    }
                                                >
                                                    <img
                                                        src={img}
                                                        className="w-full h-full object-cover rounded-xl transition-opacity hover:opacity-95"
                                                        alt=""
                                                    />
                                                </div>
                                            ))}
                                    {(!property.images ||
                                        property.images.length < 2) && (
                                        <>
                                            <div className="h-1/2 bg-slate-100 rounded-xl"></div>
                                            <div className="h-1/2 bg-slate-100 rounded-xl relative flex items-center justify-center text-slate-400 font-bold">
                                                +2
                                            </div>
                                        </>
                                    )}
                                    {property.images &&
                                        property.images.length > 3 && (
                                            <div
                                                className="h-1/2 bg-slate-100 rounded-xl relative overflow-hidden cursor-pointer group"
                                                onClick={() => openLightbox(3)}
                                            >
                                                <img
                                                    src={property.images[3]}
                                                    className="w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-40"
                                                    alt=""
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-700 text-xl">
                                                    +
                                                    {property.images.length - 3}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                    {property.name}
                                </h1>
                                <div className="flex items-center text-slate-500 font-medium">
                                    <MapPin className="w-5 h-5 mr-1 text-emerald-600" />
                                    {property.loc}
                                </div>
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 grid grid-cols-4 divide-x divide-slate-100">
                            <div className="flex flex-col items-center justify-center text-center px-4">
                                <Bed className="w-8 h-8 text-emerald-600 mb-2" />
                                <div className="font-bold text-slate-900">
                                    {property.specs.bedroom} Bedrooms
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center px-4">
                                <Bath className="w-8 h-8 text-emerald-600 mb-2" />
                                <div className="font-bold text-slate-900">
                                    {property.specs.bathroom} Bathrooms
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center px-4">
                                <Maximize className="w-8 h-8 text-emerald-600 mb-2" />
                                <div className="font-bold text-slate-900">
                                    {property.specs.area}
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center px-4">
                                <Home className="w-8 h-8 text-emerald-600 mb-2" />
                                <div className="font-bold text-slate-900">
                                    {property.specs.type || "Villa"}
                                </div>
                            </div>
                        </div>

                        {/* Chart Section */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">
                                Monthly Annualized Net Rental Yields
                            </h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient
                                                id="colorReturns"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#059669"
                                                    stopOpacity={0.1}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#059669"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="#f1f5f9"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fontSize: 12,
                                                fill: "#64748b",
                                            }}
                                            interval={1}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{
                                                fontSize: 12,
                                                fill: "#64748b",
                                            }}
                                            unit="%"
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: "8px",
                                                border: "none",
                                                boxShadow:
                                                    "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                            }}
                                            formatter={(value) => [
                                                `${value}%`,
                                                "Yield",
                                            ]}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="returns"
                                            stroke="#059669"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorReturns)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="avg"
                                            stroke="#94a3b8"
                                            strokeDasharray="5 5"
                                            fill="none"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Content Tabs */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="border-b border-slate-200">
                                <nav className="flex overflow-x-auto">
                                    {[
                                        "Details",
                                        "Financials",
                                        "Documents",
                                        "Market",
                                        "Timeline",
                                    ].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() =>
                                                setActiveTab(tab.toLowerCase())
                                            }
                                            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                                activeTab === tab.toLowerCase()
                                                    ? "border-emerald-600 text-emerald-600"
                                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                            <div className="p-6">
                                {activeTab === "details" && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-emerald-800 mb-3">
                                                About the Property
                                            </h3>
                                            <div className="prose prose-slate max-w-none text-slate-600">
                                                <p className="whitespace-pre-line">
                                                    {property.detail}
                                                </p>
                                            </div>
                                        </div>

                                        {property.map_url && (
                                            <div>
                                                <h3 className="text-lg font-bold text-emerald-800 mb-3">
                                                    Location
                                                </h3>
                                                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100">
                                                    <iframe
                                                        src={property.map_url}
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: 0 }}
                                                        allowFullScreen=""
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                    ></iframe>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === "financials" && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-emerald-800 mb-3">
                                                Financial Overview
                                            </h3>
                                            <div className="prose prose-slate max-w-none text-slate-600">
                                                {property.financial ? (
                                                    <p className="whitespace-pre-line">
                                                        {property.financial}
                                                    </p>
                                                ) : (
                                                    <p className="text-slate-400 italic">
                                                        No financial details
                                                        available.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "market" && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-emerald-800 mb-3">
                                                Market Analysis
                                            </h3>
                                            <div className="prose prose-slate max-w-none text-slate-600">
                                                {property.market ? (
                                                    <p className="whitespace-pre-line">
                                                        {property.market}
                                                    </p>
                                                ) : (
                                                    <p className="text-slate-400 italic">
                                                        No market analysis
                                                        available.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "timeline" && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-emerald-800 mb-3">
                                                Project Timeline
                                            </h3>
                                            <div className="prose prose-slate max-w-none text-slate-600">
                                                {property.timeline ? (
                                                    <p className="whitespace-pre-line">
                                                        {property.timeline}
                                                    </p>
                                                ) : (
                                                    <p className="text-slate-400 italic">
                                                        No timeline available.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {![
                                    "details",
                                    "financials",
                                    "market",
                                    "timeline",
                                ].includes(activeTab) && (
                                    <div className="text-center py-12 text-slate-500">
                                        Content for {activeTab} coming soon...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Financial Card */}
                        <div className="bg-white z-50 rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-24">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full text-xs">
                                    {property.financials.progress}% Funded
                                </span>
                                <span className="text-slate-500 text-xs font-medium">
                                    {property.financials.tokens_left.toLocaleString()}{" "}
                                    /{" "}
                                    {property.financials.total_tokens.toLocaleString()}{" "}
                                    tokens left
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
                                <div
                                    className="bg-emerald-500 h-2 rounded-full"
                                    style={{
                                        width: `${Math.max(property.financials.progress, 2)}%`,
                                    }}
                                ></div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-6 text-center">
                                <div className="p-2 rounded-lg bg-slate-50">
                                    <div className="text-emerald-600 font-bold text-lg">
                                        {property.financials.irr}
                                    </div>
                                    <div className="text-[0.6rem] text-slate-500 font-bold uppercase flex items-center justify-center gap-1">
                                        ROI <Info className="w-3 h-3" />
                                    </div>
                                </div>
                                <div className="p-2 rounded-lg bg-slate-50">
                                    <div className="text-slate-900 font-bold text-lg">
                                        {property.financials.roi_period} Months
                                    </div>
                                    <div className="text-[0.6rem] text-slate-500 font-bold uppercase flex items-center justify-center gap-1">
                                        ROI Period <Info className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <Link
                                    href={route(
                                        "investments.purchase",
                                        property.id,
                                    )}
                                    className={`w-full py-3 rounded-lg font-bold text-white mb-3 shadow-lg flex items-center justify-center ${
                                        property.sold
                                            ? "bg-slate-400 cursor-not-allowed"
                                            : "bg-emerald-800 hover:bg-emerald-700 shadow-emerald-900/20"
                                    }`}
                                >
                                    {property.sold ? "Sold Out" : "Invest"}
                                </Link>

                                <button className="w-full py-3 rounded-lg font-bold text-white mb-3 shadow-lg bg-rose-600 hover:bg-rose-700 shadow-rose-900/20">
                                    Sell
                                </button>
                            </div>

                            <div className="text-center text-xs text-slate-500">
                                If you invest 1,000 tokens, you could earn an
                                estimated annual return of:
                                <div className="text-slate-900 font-bold text-lg mt-1">
                                    IDR 958,000
                                </div>
                            </div>
                        </div>

                        {/* Leaderboard Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <div className="text-center mb-6">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
                                    <span className="text-amber-400">👑</span>{" "}
                                    Token Holders Leaderboard
                                </h3>
                                <div className="mb-14 font-bold text-slate-900 text-lg">
                                    {property.name}
                                </div>
                            </div>

                            {/* Top 3 Podium */}
                            <div className="flex items-end justify-center gap-4 mb-8 h-32">
                                {/* 2nd Place */}
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full border-2 border-slate-200 overflow-hidden mb-1">
                                        <img
                                            src={leaderboard[2].avatar}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="text-[0.6rem] font-bold text-slate-900">
                                        {leaderboard[2].name}
                                    </div>
                                    <div className="h-12 w-12 bg-slate-100 rounded-t-lg flex items-center justify-center font-bold text-slate-400 text-sm mt-1">
                                        2
                                    </div>
                                </div>
                                {/* 1st Place */}
                                <div className="flex flex-col items-center z-10">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-full border-4 border-amber-100 overflow-hidden mb-1">
                                            <img
                                                src={leaderboard[1].avatar}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">
                                            👑
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-slate-900">
                                        {leaderboard[1].name}
                                    </div>
                                    <div className="text-[0.6rem] text-emerald-600 font-bold mb-1">
                                        ID: {leaderboard[1].id}
                                    </div>
                                    <div className="h-16 w-16 bg-gradient-to-b from-amber-100 to-white rounded-t-lg flex items-center justify-center font-bold text-amber-500 text-xl mt-1 border-t border-amber-200">
                                        1
                                    </div>
                                </div>
                                {/* 3rd Place */}
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full border-2 border-slate-200 overflow-hidden mb-1">
                                        <img
                                            src={leaderboard[0].avatar}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="text-[0.6rem] font-bold text-slate-900">
                                        {leaderboard[0].name}
                                    </div>
                                    <div className="h-8 w-12 bg-slate-50 rounded-t-lg flex items-center justify-center font-bold text-slate-400 text-sm mt-1">
                                        3
                                    </div>
                                </div>
                            </div>

                            {/* List */}
                            <div className="space-y-3">
                                {leaderboard.slice(3).map((user, idx) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="font-bold text-slate-400 w-4">
                                                {idx + 4}.
                                            </div>
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="font-bold text-emerald-700 flex items-center gap-1">
                                                {user.name}
                                                <CheckCircle className="w-3 h-3 text-emerald-500" />
                                            </div>
                                        </div>
                                        <div className="text-slate-400 text-xs">
                                            GORO ID: {user.id * 1234}
                                        </div>
                                    </div>
                                ))}
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
