import React, { useState, useEffect, useMemo } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
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
    FileText,
    Download,
    TrendingUp,
    DollarSign,
    Coins,
    BarChart3,
    Calendar,
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

    const extractMapUrl = (htmlString) => {
        if (!htmlString) return null;

        let url = htmlString.trim();

        // 1. Kalau input masih berupa tag iframe, ambil src-nya
        if (url.includes("<iframe")) {
            const match = url.match(/src=["'](.*?)["']/);
            url = match ? match[1] : null;
        }

        if (!url) return null;

        // 2. Logika baru: Handle googleusercontent atau link maps standar
        // Kalau sudah mengandung domain tersebut, langsung return apa adanya
        if (
            url.includes("googleusercontent.com") ||
            url.includes("maps.google.com")
        ) {
            return url;
        }

        // 3. Handle kalau user cuma input "www.google.com/maps..."
        if (url.startsWith("www.")) {
            return `https://${url}`;
        }

        return url;
    };

    const finalMapUrl = extractMapUrl(property.map_url);

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
        { name: "Jul 2025", text: 10.0, avg: 10 },
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
    const { auth } = usePage().props;

    const handleInvestClick = (e) => {
        if (!auth.user) {
            e.preventDefault();
            alert("Waduh, login dulu yuk bos biar bisa invest!");
            window.location.href = route("login");
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    // 1. Parsing ROI properti jadi angka murni (jaga-jaga kalau formatnya "9%" atau "12.5%")
    const roiPercentage = useMemo(() => {
        if (!property?.financials?.irr) return 9;
        const irrValue = String(property.financials.irr);
        return parseFloat(irrValue.replace(/[^0-9.-]/g, "")) || 9;
    }, [property?.financials?.irr]);

    // 2. State untuk nominal investasi (Default: 5 Juta, Min: 1 Juta, Max: 100 Juta)
    const [investmentAmount, setInvestmentAmount] = useState(5000000);

    // 3. Fungsi Helper buat nemproti format Rupiah biar rapi (Contoh: Rp 5.000.000)
    const formatRupiah = (val) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(val);
    };

    // 4. Hitung Proyeksi 5 Tahun ke depan pake logika Compound Interest (Bunga Berbunga)
    const dynamicChartData = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 6 }).map((_, index) => {
            // Tahun ke-0 adalah modal awal
            const futureValue =
                investmentAmount * Math.pow(1 + roiPercentage / 100, index);
            return {
                label: index === 0 ? "Modal" : `Thn ${index}`,
                yearNumber: currentYear + index,
                // Nilai estimasi dibuletin biar chart ga pusing
                "Estimasi Nilai": Math.round(futureValue),
            };
        });
    }, [investmentAmount, roiPercentage]);

    // 5. Hitung total profit bersih di tahun ke-5 buat di-highlight
    const finalValueYear5 = dynamicChartData[5]["Estimasi Nilai"];
    const totalProfitClean = finalValueYear5 - investmentAmount;

    const displayImages =
        property.images && property.images.length > 0
            ? property.images
            : [
                  `https://placehold.co/800x600?text=${encodeURIComponent(property.name)}`,
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
                        {/* Container utama tanpa padding/border putih biar edge-to-edge */}
                        <div className="mb-8 w-full h-[400px] md:h-[480px] rounded-2xl overflow-hidden shadow-md bg-slate-100">
                            {/* LAYOUT: 1 GAMBAR */}
                            {displayImages.length === 1 && (
                                <div
                                    className="w-full h-full relative group cursor-pointer"
                                    onClick={() => openLightbox(0)}
                                >
                                    <img
                                        src={displayImages[0]}
                                        alt={property.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            )}

                            {/* LAYOUT: 2 GAMBAR */}
                            {displayImages.length === 2 && (
                                <div className="grid grid-cols-2 gap-2 h-full">
                                    {displayImages.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="h-full relative group cursor-pointer overflow-hidden"
                                            onClick={() => openLightbox(idx)}
                                        >
                                            <img
                                                src={img}
                                                alt={`${property.name} ${idx + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* LAYOUT: 3 GAMBAR */}
                            {displayImages.length === 3 && (
                                <div className="grid grid-cols-3 gap-2 h-full">
                                    <div
                                        className="col-span-2 h-full relative group cursor-pointer overflow-hidden"
                                        onClick={() => openLightbox(0)}
                                    >
                                        <img
                                            src={displayImages[0]}
                                            alt={property.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="col-span-1 grid grid-rows-2 gap-2 h-full">
                                        {displayImages
                                            .slice(1, 3)
                                            .map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="h-full relative group cursor-pointer overflow-hidden"
                                                    onClick={() =>
                                                        openLightbox(idx + 1)
                                                    }
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`${property.name} ${idx + 2}`}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* LAYOUT: 4+ GAMBAR (Konsep 1 Kiri, 2 Atas Kanan, 2 Bawah Kanan) */}
                            {displayImages.length >= 4 && (
                                <div className="grid grid-cols-4 gap-2 h-full">
                                    {/* Gambar Utama Kiri (50% Lebar) */}
                                    <div
                                        className="col-span-2 h-full relative group cursor-pointer overflow-hidden"
                                        onClick={() => openLightbox(0)}
                                    >
                                        <img
                                            src={displayImages[0]}
                                            alt={property.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Gambar Kanan (Dibagi jadi Grid 2x2 kalau gambarnya 5+) */}
                                    <div
                                        className={`col-span-2 grid ${displayImages.length === 4 ? "grid-rows-2 grid-cols-1" : "grid-rows-2 grid-cols-2"} gap-2 h-full`}
                                    >
                                        {displayImages
                                            .slice(1, 5)
                                            .map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="h-full relative group cursor-pointer overflow-hidden"
                                                    onClick={() =>
                                                        openLightbox(idx + 1)
                                                    }
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`${property.name} ${idx + 2}`}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />

                                                    {/* Overlay "Lihat Semua Foto" di gambar terakhir (ke-5) */}
                                                    {idx === 3 &&
                                                        displayImages.length >
                                                            5 && (
                                                            <div className="absolute inset-0 bg-slate-900/40 hover:bg-slate-900/50 transition-colors flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                                                                <span className="text-2xl font-bold">
                                                                    +
                                                                    {displayImages.length -
                                                                        5}
                                                                </span>
                                                                <span className="text-xs font-medium uppercase tracking-wider mt-1">
                                                                    Foto Lainnya
                                                                </span>
                                                            </div>
                                                        )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Property Title & Status Section */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 mb-8">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                                {/* Bagian Kiri: Badge, Judul, Lokasi */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                                property.sold
                                                    ? "bg-slate-100 text-slate-500"
                                                    : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20"
                                            }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                    property.sold
                                                        ? "bg-slate-400"
                                                        : "bg-emerald-500 animate-pulse"
                                                }`}
                                            ></span>
                                            {property.sold
                                                ? "Sold Out"
                                                : "Available"}
                                        </span>
                                    </div>

                                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2.5">
                                        {property.name}
                                    </h1>

                                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                                        <MapPin className="w-4 h-4 text-emerald-600" />
                                        {property.location || property.loc}
                                    </div>
                                </div>

                                {/* Bagian Kanan: Tombol Airbnb */}
                                {property.listing_url && (
                                    <div className="mt-2 md:mt-0 flex-none">
                                        <a
                                            href={property.listing_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-sm font-bold px-5 py-3 rounded-xl text-sm transition-all w-full md:w-auto"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Lihat di Airbnb
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 mb-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-slate-100">
                                {/* BEDROOMS */}
                                <div className="flex flex-col items-center justify-center text-center px-4 group">
                                    {/* Ikon dibungkus kotak rounded biar ada "volume"-nya */}
                                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                                        <Bed className="w-6 h-6" />
                                    </div>
                                    {/* Angka / Value dibikin gede & tebal */}
                                    <div className="text-xl font-extrabold text-slate-900">
                                        {property.specs.bedroom}
                                    </div>
                                    {/* Label dibikin kecil, uppercase, dan renggang */}
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        Bedrooms
                                    </div>
                                </div>

                                {/* BATHROOMS */}
                                <div className="flex flex-col items-center justify-center text-center px-4 group">
                                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                                        <Bath className="w-6 h-6" />
                                    </div>
                                    <div className="text-xl font-extrabold text-slate-900">
                                        {property.specs.bathroom}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        Bathrooms
                                    </div>
                                </div>

                                {/* AREA */}
                                <div className="flex flex-col items-center justify-center text-center px-4 group">
                                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                                        <Maximize className="w-6 h-6" />
                                    </div>
                                    <div className="text-xl font-extrabold text-slate-900">
                                        {property.specs.area}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        Luas Area
                                    </div>
                                </div>

                                {/* TYPE */}
                                <div className="flex flex-col items-center justify-center text-center px-4 group">
                                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                                        <Home className="w-6 h-6" />
                                    </div>
                                    <div className="text-xl font-extrabold text-slate-900">
                                        {property.specs.type || "Villa"}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        Tipe Properti
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chart Section - SOON insyaallah */}
                        {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
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
                        </div> */}

                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 mb-8">
                            {/* Bagian Header Box Simulasi */}
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100">
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-1.5">
                                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                                        Kalkulator Proyeksi Investasi
                                    </h3>
                                    <p className="text-xs font-medium text-slate-500">
                                        Simulasi pertumbuhan dana berdasarkan
                                        target imbal hasil{" "}
                                        <span className="text-emerald-700 font-bold">
                                            {property.roi} / tahun
                                        </span>
                                    </p>
                                </div>

                                {/* Highlight Estimasi Keuntungan Akhir */}
                                <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-center gap-4 min-w-[240px]">
                                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm shadow-emerald-500/20">
                                        Rp
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-emerald-900/50 font-bold uppercase tracking-wider block">
                                            Total Hasil (5 Tahun)
                                        </span>
                                        <span className="text-lg font-black text-emerald-700">
                                            {formatRupiah(finalValueYear5)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Grid Kontrol (Slider) & Visual (Chart) */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-center">
                                {/* KOLOM KONTROL (Kiri / 1 Bagian) */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                                            Jumlah Investasi
                                        </label>
                                        <div className="text-3xl font-black text-slate-900 tracking-tight mb-4">
                                            {formatRupiah(investmentAmount)}
                                        </div>

                                        {/* Slider Input Tailwind Custom */}
                                        <input
                                            type="range"
                                            min="1000000"
                                            max="100000000"
                                            step="1000000"
                                            value={investmentAmount}
                                            onChange={(e) =>
                                                setInvestmentAmount(
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2">
                                            <span>{formatRupiah(1000000)}</span>
                                            <span>
                                                {formatRupiah(100000000)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info Card Kecil Khusus Profit */}
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <div className="flex justify-between text-xs font-medium text-slate-600 mb-2">
                                            <span>Modal Awal:</span>
                                            <span className="font-semibold text-slate-900">
                                                {formatRupiah(investmentAmount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs font-medium text-slate-600">
                                            <span>Estimasi Profit Bersih:</span>
                                            <span className="font-bold text-emerald-600">
                                                +
                                                {formatRupiah(totalProfitClean)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* KOLOM GRAFIK (Kanan / 2 Bagian) */}
                                <div className="xl:col-span-2 h-[260px] w-full">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart
                                            data={dynamicChartData}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: -10,
                                                bottom: 0,
                                            }}
                                        >
                                            <defs>
                                                <linearGradient
                                                    id="colorDynamicReturns"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#059669"
                                                        stopOpacity={0.15}
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
                                                dataKey="label"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fontSize: 11,
                                                    fill: "#64748b",
                                                    fontWeight: 600,
                                                }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fontSize: 11,
                                                    fill: "#64748b",
                                                }}
                                                tickFormatter={(value) =>
                                                    `${value / 1000000}M`
                                                } // Biar ringkes di Y-Axis jadi 5M, 10M, dst
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: "12px",
                                                    border: "1px solid #f1f5f9",
                                                    boxShadow:
                                                        "0 10px 15px -3px rgba(0,0,0,0.05)",
                                                    padding: "10px 14px",
                                                }}
                                                labelFormatter={(
                                                    label,
                                                    items,
                                                ) => {
                                                    if (items[0]) {
                                                        return `${items[0].payload.label} (${items[0].payload.yearNumber})`;
                                                    }
                                                    return label;
                                                }}
                                                formatter={(value) => [
                                                    formatRupiah(value),
                                                    "Nilai Aset",
                                                ]}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="Estimasi Nilai"
                                                stroke="#059669"
                                                strokeWidth={2.5}
                                                fillOpacity={1}
                                                fill="url(#colorDynamicReturns)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Content Tabs */}
                        <div className="bg-white rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100 overflow-hidden mb-8">
                            {/* Navigasi Tab - Dibuat scrollable halus di HP (scrollbar-none) */}
                            <div className="border-b border-slate-100 bg-slate-50/50 px-2 md:px-6">
                                <nav className="flex space-x-2 overflow-x-auto scrollbar-hide py-3">
                                    {[
                                        {
                                            id: "details",
                                            label: "Details",
                                            icon: Info,
                                        },
                                        {
                                            id: "financials",
                                            label: "Financials",
                                            icon: Coins,
                                        },
                                        {
                                            id: "documents",
                                            label: "Documents",
                                            icon: FileText,
                                        },
                                        {
                                            id: "market",
                                            label: "Market Analysis",
                                            icon: BarChart3,
                                        },
                                        {
                                            id: "timeline",
                                            label: "Timeline",
                                            icon: Calendar,
                                        },
                                    ].map((tab) => {
                                        const IconComponent = tab.icon;
                                        const isActive = activeTab === tab.id;

                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() =>
                                                    setActiveTab(tab.id)
                                                }
                                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-200 ${
                                                    isActive
                                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                                }`}
                                            >
                                                <IconComponent className="w-4 h-4 flex-none" />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Konten Tab dengan Animasi Fade-In Halus */}
                            <div className="p-6 md:p-8 transition-all duration-300">
                                {/* TAB 1: DETAILS */}
                                {activeTab === "details" && (
                                    <div className="space-y-8 animate-in fade-in duration-300">
                                        <div>
                                            <h3 className="text-lg font-extrabold text-slate-900 mb-3">
                                                Tentang Properti
                                            </h3>
                                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                                                {property.detail}
                                            </div>
                                        </div>

                                        {property.map_url && (
                                            <div>
                                                <h3 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                                                    <MapPin className="w-5 h-5 text-emerald-600" />
                                                    Lokasi & Sekitar
                                                </h3>
                                                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-inner">
                                                    {finalMapUrl ? (
                                                        <iframe
                                                            src={finalMapUrl}
                                                            width="100%"
                                                            height="100%"
                                                            style={{
                                                                border: 0,
                                                            }}
                                                            allowFullScreen=""
                                                            loading="lazy"
                                                            referrerPolicy="no-referrer-when-downgrade"
                                                        ></iframe>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">
                                                            Peta lokasi belum
                                                            tersedia
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 2: FINANCIALS */}
                                {activeTab === "financials" && (
                                    <div className="space-y-8 animate-in fade-in duration-300">
                                        {/* BAGIAN 1: PROYEKSI RETURN (Taruh paling atas biar eye-catching) */}
                                        <div>
                                            <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                                                <span className="w-1.5 h-5 bg-emerald-500 rounded-full"></span>
                                                Proyeksi Imbal Hasil Tahunan
                                                (Annual Returns)
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Card 1: Rental Yield (Passive Income) */}
                                                <div className="p-5 border border-slate-100 bg-slate-50/60 rounded-2xl shadow-sm hover:border-emerald-300 hover:bg-emerald-50/30 transition-all duration-300 group">
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 group-hover:text-emerald-700 transition-colors">
                                                        Annual Rental Yield
                                                    </div>
                                                    <div className="text-3xl font-black text-slate-900 tracking-tight">
                                                        {property.financials
                                                            .rental_yield ||
                                                            "0%"}
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                                                        Proyeksi keuntungan
                                                        pasif (*passive income*)
                                                        yang didapat dari bagi
                                                        hasil pembagian dividen
                                                        sewa properti ini.
                                                    </p>
                                                </div>

                                                {/* Card 2: Capital Appreciation (Kenaikan Harga Aset) */}
                                                <div className="p-5 border border-slate-100 bg-slate-50/60 rounded-2xl shadow-sm hover:border-blue-300 hover:bg-blue-50/20 transition-all duration-300 group">
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 group-hover:text-blue-600 transition-colors">
                                                        Capital Appreciation
                                                    </div>
                                                    <div className="text-3xl font-black text-slate-900 tracking-tight">
                                                        {property.financials
                                                            .appreciation_rate ||
                                                            "0%"}
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                                                        Estimasi kenaikan harga
                                                        nilai aset properti per
                                                        tahun berdasarkan tren
                                                        dan pertumbuhan pasar
                                                        real estate setempat.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* BAGIAN 2: BREAKDOWN NILAI ASET (Transparansi Biaya) */}
                                        <div>
                                            <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                                                <span className="w-1.5 h-5 bg-slate-400 rounded-full"></span>
                                                Rincian Nilai Aset Properti
                                                (Asset Breakdown)
                                            </h3>

                                            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm divide-y divide-slate-100">
                                                {/* Row Utama Total Pendanaan */}
                                                <div className="flex justify-between items-center p-4 bg-emerald-50/40">
                                                    <span className="font-bold text-slate-800 text-sm">
                                                        Total Nilai Investasi
                                                        (Target Penggalangan)
                                                    </span>
                                                    <span className="text-lg font-black text-emerald-700">
                                                        {formatCurrency(
                                                            property.financials
                                                                .investment_value,
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Row Detail Alokasi Dana */}
                                                {[
                                                    {
                                                        label: "Harga Pembelian Properti",
                                                        value: property
                                                            .financials
                                                            .asset_price,
                                                    },
                                                    {
                                                        label: "Biaya Renovasi, Furnishing & Upgrade",
                                                        value: property
                                                            .financials
                                                            .property_upgrades,
                                                    },
                                                    {
                                                        label: "Biaya Notaris, Pajak & Legalitas",
                                                        value: property
                                                            .financials
                                                            .notary_fee,
                                                    },
                                                    {
                                                        label: "Biaya Administrasi & Operasional Platform",
                                                        value: property
                                                            .financials
                                                            .platform_fee,
                                                    },
                                                ].map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex justify-between items-center p-4 text-sm hover:bg-slate-50/50 transition-colors"
                                                    >
                                                        <span className="text-slate-600 font-medium">
                                                            {item.label}
                                                        </span>
                                                        <span className="font-bold text-slate-900">
                                                            {formatCurrency(
                                                                item.value,
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 3: DOCUMENTS */}
                                {activeTab === "documents" && (
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                                            Dokumen Legalitas & Prospektus
                                        </h3>
                                        {property.documents &&
                                        property.documents.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {property.documents.map(
                                                    (doc, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={doc.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group shadow-sm"
                                                        >
                                                            <div className="flex items-center gap-3.5 min-w-0">
                                                                <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-slate-500 border border-slate-100 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-colors flex-none shadow-sm">
                                                                    <FileText className="w-5 h-5" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-900 truncate">
                                                                        {doc.name ||
                                                                            `Dokumen Legalitas ${idx + 1}`}
                                                                    </div>
                                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">
                                                                        Klik
                                                                        untuk
                                                                        Unduh
                                                                        PDF
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Download className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-y-0.5 transition-all flex-none mr-1" />
                                                        </a>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500">
                                                <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                                <p className="text-sm font-medium">
                                                    Dokumen legalitas belum
                                                    diunggah.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 4: MARKET */}
                                {activeTab === "market" && (
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        <h3 className="text-lg font-extrabold text-slate-900 mb-1">
                                            Analisis & Potensi Pasar
                                        </h3>
                                        <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                                            {property.market ||
                                                "Analisis wilayah sekitar dan potensi kenaikan harga (capital appreciation) untuk properti ini sedang disusun oleh tim ahli kami."}
                                        </div>
                                    </div>
                                )}

                                {/* TAB 5: TIMELINE */}
                                {activeTab === "timeline" && (
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        <h3 className="text-lg font-extrabold text-slate-900 mb-1">
                                            Timeline Proyek Pendanaan
                                        </h3>
                                        <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                                            {property.timeline ||
                                                "Jadwal tahapan mulai dari pembukaan crowdfunding, pembelian unit, renovasi interior, hingga estimasi pembagian dividen sewa pertama."}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1">
                        {/* Bikin card-nya nempel pas di-scroll (sticky) biar user selalu liat tombol beli */}
                        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sticky top-24">
                            {/* BAGIAN 1: URGENCY & PROGRESS */}
                            <div className="mb-6">
                                <div className="flex justify-between items-end mb-2.5">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                                            Terkumpul
                                        </span>
                                        <span className="text-xl font-black text-emerald-600">
                                            {property.financials.progress}%
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                                            Sisa Lot
                                        </span>
                                        <div className="text-slate-900 font-bold">
                                            {property.financials.tokens_left.toLocaleString()}{" "}
                                            <span className="text-xs font-normal text-slate-500">
                                                /{" "}
                                                {property.financials.total_tokens.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar Dibikin Sedikit Lebih Tebal (h-3) dan Rounded */}
                                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                                    <div
                                        className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out relative"
                                        style={{
                                            width: `${Math.max(property.financials.progress, 5)}%`,
                                        }}
                                    >
                                        {/* Efek kilap (shine) kecil di progress bar */}
                                        <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 blur-[2px]"></div>
                                    </div>
                                </div>
                            </div>

                            {/* BAGIAN 2: HIGHLIGHT KEUNTUNGAN (ROI) */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/50 flex flex-col items-center justify-center text-center">
                                    <div className="text-[10px] text-emerald-900/60 font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
                                        Est. ROI{" "}
                                        <Info className="w-3 h-3 text-emerald-600/50" />
                                    </div>
                                    <div className="text-2xl font-black text-emerald-700">
                                        {property.financials.irr}
                                    </div>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
                                        Periode{" "}
                                        <Info className="w-3 h-3 text-slate-400" />
                                    </div>
                                    <div className="text-xl font-bold text-slate-900">
                                        {property.financials.roi_period}{" "}
                                        <span className="text-xs font-medium text-slate-500">
                                            Bulan
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* BAGIAN 3: ACTION BUTTONS (Point of Sale) */}
                            <div className="space-y-3">
                                {/* Logika Tombol berdasarkan State User & Ketersediaan Token */}
                                {auth.user ? (
                                    <div
                                        className={`grid gap-3 ${auth.user ? "grid-cols-2" : "grid-cols-1"}`}
                                    >
                                        <Link
                                            href={
                                                property.sold
                                                    ? "#"
                                                    : route(
                                                          "investments.purchase",
                                                          property.id,
                                                      )
                                            }
                                            onClick={
                                                property.sold
                                                    ? (e) => e.preventDefault()
                                                    : handleInvestClick
                                            }
                                            className={`w-full py-4 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 ${
                                                property.sold
                                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                                    : "bg-emerald-600 hover:bg-emerald-700 shadow-[0_8px_20px_-6px_rgba(5,150,105,0.4)] hover:-translate-y-0.5"
                                            }`}
                                        >
                                            {property.sold
                                                ? "Pendanaan Ditutup"
                                                : "Beli Lot"}
                                        </Link>

                                        {/* Tombol Jual (Secondary Action) */}
                                        <Link
                                            href={route(
                                                "investments.sell",
                                                property.id,
                                            )}
                                            className="w-full py-4 rounded-xl font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-sm text-center block transition-all"
                                        >
                                            Jual Lot
                                        </Link>
                                    </div>
                                ) : (
                                    <a
                                        href={route("login")}
                                        className={`w-full py-4 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 ${
                                            property.sold
                                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                                : "bg-slate-900 hover:bg-emerald-600 shadow-md hover:shadow-emerald-500/25"
                                        }`}
                                    >
                                        {property.sold
                                            ? "Pendanaan Ditutup"
                                            : "Login untuk Investasi"}
                                    </a>
                                )}

                                {/* Trust Badge / Info Keamanan (Penting buat psikologi investor) */}
                                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
                                    <svg
                                        className="w-4 h-4 text-emerald-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                    Transaksi Aman & Terenkripsi
                                </div>
                            </div>
                        </div>

                        {/* Leaderboard Card */}
                        {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <div className="text-center mb-6">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
                                    <span className="text-amber-400">👑</span>{" "}
                                    Token Holders Leaderboard
                                </h3>
                                <div className="mb-14 font-bold text-slate-900 text-lg">
                                    {property.name}
                                </div>
                            </div>


                            <div className="flex items-end justify-center gap-4 mb-8 h-32">

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
                        </div> */}
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
