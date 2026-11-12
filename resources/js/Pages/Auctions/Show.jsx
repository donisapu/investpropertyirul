import React, { useState, useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AuctionPanel, { BidHistory } from "@/Components/Auction/AuctionPanel";
import {
    Bed,
    Bath,
    Maximize,
    MapPin,
    ChevronRight,
    ChevronLeft,
    Banknote,
    X,
    Building2,
    Home,
    TrendingUp,
    FileText,
    ShieldCheck,
    Download,
} from "lucide-react";
import PublicLayout from "@/Layouts/PublicLayout";

const STATUS_LABELS = {
    upcoming: "Akan dibuka",
    active: "Berlangsung",
    closed: "Ditutup",
    awaiting_payment: "Selesai",
    completed: "Selesai",
    no_winner: "Selesai",
    defaulted: "Selesai",
    cancelled: "Dibatalkan",
    suspended: "Ditangguhkan",
};

export default function Show({ auction, participation }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const { settings } = usePage().props;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState("overview");

    const property = auction.property;

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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    // Use property images or fallback if empty
    const displayImages =
        property.images && property.images.length > 0
            ? property.images.map((img) => img.image_url)
            : [
                  `https://placehold.co/800x600?text=${encodeURIComponent(property.property_name)}`,
              ];

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

    const hargaProperti = auction.open_bid;
    const hargaPasar = auction.market_value;

    const perbedaanPersen = ((hargaProperti - hargaPasar) / hargaPasar) * 100;
    const isDiBawahPasar = perbedaanPersen < 0;
    const warnaPersen = isDiBawahPasar ? "text-green-600" : "text-red-600";
    const labelPersen = isDiBawahPasar
        ? "Di bawah harga pasar"
        : "Di atas harga pasar";

    const persentaseIsi = Math.abs(perbedaanPersen);
    const progressWidth = Math.min(100, Math.max(0, persentaseIsi));

    return (
        <PublicLayout>
            <Head title={property.property_name} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-slate-500 mb-6">
                    <Link href="/auctions" className="hover:text-emerald-600">
                        Lelang/Cessie
                    </Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-slate-900 font-medium">
                        {property.property_name}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Gallery Section */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                            <div className="grid grid-cols-4 gap-4 h-[400px]">
                                <div
                                    className={`h-full relative group cursor-pointer overflow-hidden rounded-xl ${
                                        displayImages.length === 1
                                            ? "col-span-4"
                                            : "col-span-3"
                                    }`}
                                    onClick={() => openLightbox(0)}
                                >
                                    <img
                                        src={displayImages[0]}
                                        alt={property.property_name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>
                                {displayImages.length > 1 && (
                                    <div className="col-span-1 grid grid-rows-3 gap-4 h-full">
                                        {displayImages
                                            .slice(1, 4)
                                            .map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="h-full relative group cursor-pointer overflow-hidden rounded-xl"
                                                    onClick={() =>
                                                        openLightbox(idx + 1)
                                                    }
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`${property.property_name} ${idx + 2}`}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    {idx === 2 &&
                                                        displayImages.length >
                                                            4 && (
                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                                                                +
                                                                {displayImages.length -
                                                                    4}
                                                            </div>
                                                        )}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Property Details */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                                        {property.property_name}
                                    </h1>
                                    <div className="flex items-center text-slate-500 text-sm">
                                        <MapPin className="w-4 h-4 mr-1 text-emerald-600" />
                                        {property.property_location}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                            auction.status === "active"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : ["upcoming", "suspended", "awaiting_payment"].includes(auction.status)
                                                  ? "bg-amber-100 text-amber-700"
                                                  : "bg-slate-100 text-slate-700"
                                        }`}
                                    >
                                        {STATUS_LABELS[auction.status] ?? auction.status}
                                    </span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                            auction.type === "cessie"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {auction.type_label ?? auction.type}
                                    </span>
                                </div>
                            </div>

                            {/* Key Specs */}
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-6 py-6 border-y border-slate-100 mb-8">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Bed className="w-5 h-5 text-emerald-600" />
                                        <span className="text-xl font-bold text-slate-900">
                                            {property.bedroom}
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                                        Bedroom
                                    </span>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Bath className="w-5 h-5 text-emerald-600" />
                                        <span className="text-xl font-bold text-slate-900">
                                            {property.bathroom}
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                                        Bathroom
                                    </span>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Maximize className="w-5 h-5 text-emerald-600" />
                                        <span className="text-xl font-bold text-slate-900">
                                            {property.land_area}m²
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                                        Land Area
                                    </span>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Building2 className="w-5 h-5 text-emerald-600" />
                                        <span className="text-xl font-bold text-slate-900">
                                            {property.building_area}m²
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                                        Build Area
                                    </span>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Home className="w-5 h-5 text-emerald-600" />
                                        <span className="text-lg font-bold text-slate-900 truncate max-w-[80px]">
                                            {property.property_type}
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                                        Type
                                    </span>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="border-b border-slate-200 mb-6">
                                <div className="flex space-x-8 overflow-x-auto no-scrollbar">
                                    {[
                                        "overview",
                                        "financials",
                                        "market",
                                        "documents",
                                    ].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`pb-4 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${
                                                activeTab === tab
                                                    ? "border-emerald-600 text-emerald-600"
                                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-[300px]">
                                {activeTab === "overview" && (
                                    <div className="space-y-8">
                                        <div className="prose prose-slate max-w-none">
                                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                                Description
                                            </h3>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: property.detail,
                                                }}
                                            />
                                        </div>

                                        {property.timeline && (
                                            <div className="prose prose-slate max-w-none">
                                                <h3 className="text-lg font-bold text-slate-900 mb-4">
                                                    Project Timeline
                                                </h3>
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: property.timeline,
                                                    }}
                                                />
                                            </div>
                                        )}

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

                                {activeTab === "financials" && (
                                    <div className="space-y-6">
                                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                                                    <Banknote className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                                                        Financial Analysis
                                                    </h3>
                                                    {property.financial ? (
                                                        <div
                                                            className="prose prose-slate prose-sm max-w-none"
                                                            dangerouslySetInnerHTML={{
                                                                __html: property.financial,
                                                            }}
                                                        />
                                                    ) : (
                                                        <p className="text-slate-500 italic">
                                                            No financial details
                                                            available.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "market" && (
                                    <div className="space-y-6">
                                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                                    <TrendingUp className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                                                        Market Analysis
                                                    </h3>
                                                    {property.market ? (
                                                        <div
                                                            className="prose prose-slate prose-sm max-w-none"
                                                            dangerouslySetInnerHTML={{
                                                                __html: property.market,
                                                            }}
                                                        />
                                                    ) : (
                                                        <p className="text-slate-500 italic">
                                                            No market analysis
                                                            available.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "documents" && (
                                    <div className="space-y-4">
                                        {property.documents &&
                                        property.documents.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {property.documents.map(
                                                    (doc, index) => (
                                                        <a
                                                            key={index}
                                                            href={
                                                                doc.document_url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group bg-white"
                                                        >
                                                            <div className="p-3 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors mr-4">
                                                                <FileText className="w-6 h-6" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-slate-900 truncate">
                                                                    {
                                                                        doc.document_name
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-slate-500">
                                                                    Click to
                                                                    view
                                                                </p>
                                                            </div>
                                                            <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                                                        </a>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                                <p className="text-slate-500">
                                                    No documents available for
                                                    this property.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <BidHistory
                            bids={participation.bids}
                            upcoming={participation.status === "upcoming"}
                            opensAt={participation.opens_at}
                        />
                    </div>

                    {/* Right Column - Auction Info */}
                    <div className="space-y-6">
                        <AuctionPanel
                            p={participation}
                            auctionId={auction.id}
                            typeLabel={auction.type_label ?? "Lelang"}
                            whatsappUrl={`https://wa.me/${settings?.whatsapp || "62818580891"}`}
                        />


                        <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
                            {/* 1. Header Harga */}
                            <div className="mb-8">
                                {/* Judul Section */}
                                <h3 className="text-lg font-bold text-slate-950 mb-5">
                                    Perbandingan Harga
                                </h3>

                                {/* Daftar Harga Berpasangan */}
                                <div className="space-y-3 mb-6">
                                    {/* Row Listing */}
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-medium">
                                            Listing:
                                        </span>
                                        {/* Harga Properti (Listing) - Pakai warna hijau buat indikator positif */}
                                        <span className="font-bold text-green-700 tabular-nums">
                                            {formatCurrency(hargaProperti)}
                                        </span>
                                    </div>

                                    {/* Row Harga Pasar */}
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-medium">
                                            Harga Pasar:
                                        </span>
                                        {/* Harga Pasar - Warna default */}
                                        <span className="font-bold text-slate-900 tabular-nums">
                                            {formatCurrency(hargaPasar)}
                                        </span>
                                    </div>
                                </div>

                                {/* Section Progress Bar & Analisis */}
                                <div className="space-y-2">
                                    {/* Progress Bar Container */}
                                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${isDiBawahPasar ? "bg-green-600" : "bg-red-600"}`}
                                            style={{
                                                width: `${progressWidth}%`,
                                            }}
                                        ></div>
                                    </div>

                                    {/* Teks Analisis Persentase */}
                                    <p
                                        className={`text-sm font-medium ${warnaPersen}`}
                                    >
                                        {labelPersen} (
                                        {perbedaanPersen.toFixed(1)}%)
                                    </p>
                                </div>
                            </div>

                            {/* 4. Trust Badge (Opsional, buat bikin makin Pro) */}
                            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400">
                                <ShieldCheck size={14} /> Terverifikasi Aman
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        onClick={prevImage}
                        className="absolute left-4 text-white/70 hover:text-white p-2"
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </button>

                    <img
                        src={displayImages[currentImageIndex]}
                        alt={property.property_name}
                        className="max-h-[90vh] max-w-[90vw] object-contain select-none"
                    />

                    <button
                        onClick={nextImage}
                        className="absolute right-4 text-white/70 hover:text-white p-2"
                    >
                        <ChevronRight className="w-10 h-10" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 font-medium">
                        {currentImageIndex + 1} / {displayImages.length}
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
