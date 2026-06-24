import React, { useState, useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    Bed,
    Bath,
    Maximize,
    Home,
    MapPin,
    ChevronRight,
    ChevronLeft,
    ExternalLink,
    Phone,
    Mail,
    FileText,
    Download,
    X,
    Image as ImageIcon,
    CheckCircle,
    ShieldCheck,
} from "lucide-react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function Show({ property }) {
    const { settings } = usePage().props;
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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const extractMapUrl = (htmlString) => {
        if (!htmlString) return null;

        let url = htmlString.trim();

        if (url.includes("<iframe")) {
            const match = url.match(/src=["'](.*?)["']/);
            url = match ? match[1] : null;
        }

        if (!url) return null;

        if (url.startsWith("embed?pb=")) {
            return `https://www.google.com/maps/${url}`;
        }

        if (url.startsWith("www.")) {
            return `https://${url}`;
        }

        return url;
    };
    const finalMapUrl = extractMapUrl(property.map_url);

    return (
        <PublicLayout>
            <Head title={property.name} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-slate-500 mb-6">
                    <Link
                        href="/property-for-sale"
                        className="hover:text-indigo-600"
                    >
                        Property for Sale
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
                        <div className="space-y-6">
                            {/* 1. Header Section (Judul & Lokasi dipindah ke atas Galeri biar natural) */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span
                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                            property.sold
                                                ? "bg-slate-100 text-slate-500"
                                                : "bg-blue-50 text-[#24608B]"
                                        }`}
                                    >
                                        {property.sold
                                            ? "Terjual"
                                            : "Properti Tersedia"}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        {property.type}
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-2">
                                    {property.name}
                                </h1>
                                <div className="flex items-center text-slate-500 text-sm font-medium">
                                    <MapPin
                                        size={16}
                                        className="mr-1.5 text-rose-500"
                                    />
                                    {property.loc}
                                </div>
                            </div>

                            {/* 2. Gallery Section (Tanpa Border Wrapper yang Kaku) */}
                            {(() => {
                                const imageCount = property.images?.length || 0;

                                return (
                                    <div className="relative w-full rounded-[2rem] overflow-hidden bg-slate-100 group/gallery">
                                        {/* GRID DINAMIS */}
                                        <div
                                            className={`grid gap-2 ${imageCount > 1 ? "grid-cols-1 md:grid-cols-4" : "grid-cols-1"} h-[300px] md:h-[480px]`}
                                        >
                                            {/* Gambar Utama (Kiri) */}
                                            <div
                                                className={`${imageCount > 1 ? "md:col-span-3" : "col-span-1"} h-full relative cursor-pointer overflow-hidden group`}
                                                onClick={() => openLightbox(0)}
                                            >
                                                <img
                                                    src={
                                                        property.main_image ||
                                                        `https://placehold.co/800x600?text=${encodeURIComponent(property.name)}`
                                                    }
                                                    alt={property.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                {/* Hover Overlay Halus */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                            </div>

                                            {/* Gambar Samping (Kanan - Tumpuk 2 atau 3) */}
                                            {imageCount > 1 && (
                                                <div className="hidden md:flex flex-col gap-2 h-full">
                                                    {property.images
                                                        .slice(1, 4)
                                                        .map((img, idx) => {
                                                            // Logika untuk nampilin angka "+X" di gambar paling bawah
                                                            const isLastVisible =
                                                                idx === 2 ||
                                                                (imageCount <=
                                                                    3 &&
                                                                    idx ===
                                                                        imageCount -
                                                                            2);
                                                            const remainingCount =
                                                                imageCount - 4;

                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className="flex-1 relative cursor-pointer overflow-hidden group"
                                                                    onClick={() =>
                                                                        openLightbox(
                                                                            idx +
                                                                                1,
                                                                        )
                                                                    }
                                                                >
                                                                    <img
                                                                        src={
                                                                            img
                                                                        }
                                                                        alt=""
                                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                                    />

                                                                    {/* Overlay Teks "+X" */}
                                                                    {isLastVisible &&
                                                                    remainingCount >
                                                                        0 ? (
                                                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white transition-colors group-hover:bg-slate-900/50">
                                                                            <span className="text-xl font-black mb-0.5">
                                                                                +
                                                                                {
                                                                                    remainingCount
                                                                                }
                                                                            </span>
                                                                            <span className="text-[9px] font-bold uppercase tracking-widest">
                                                                                Lainnya
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            )}
                                        </div>

                                        {/* Tombol External Link (Floating Glassmorphism) */}
                                        {property.listing_url && (
                                            <a
                                                href={property.listing_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md hover:bg-white text-slate-800 border border-slate-200/50 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-105 hover:-translate-y-0.5"
                                            >
                                                <ExternalLink
                                                    size={14}
                                                    className="text-[#24608B]"
                                                />{" "}
                                                View Original Listing
                                            </a>
                                        )}

                                        {/* Tombol Lihat Semua Foto (Floating Bawah) */}
                                        {imageCount > 1 && (
                                            <button
                                                onClick={() => openLightbox(0)}
                                                className="absolute bottom-4 right-4 z-10 bg-slate-900/80 backdrop-blur-md hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all opacity-0 group-hover/gallery:opacity-100 translate-y-2 group-hover/gallery:translate-y-0"
                                            >
                                                <ImageIcon size={14} /> Lihat{" "}
                                                {imageCount} Foto
                                            </button>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Stats Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                {
                                    icon: Bed,
                                    label: "Kamar Tidur",
                                    value: property.specs.bedroom,
                                },
                                {
                                    icon: Bath,
                                    label: "Kamar Mandi",
                                    value: property.specs.bathroom,
                                },
                                {
                                    icon: Maximize,
                                    label: "Luas Bangunan",
                                    value: property.specs.area,
                                },
                                {
                                    icon: Home,
                                    label: "Tipe Properti",
                                    value: property.specs.type || "Villa",
                                },
                            ].map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="group bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:border-[#24608B] hover:shadow-[0_10px_25px_rgba(36,96,139,0.08)]"
                                    >
                                        {/* Ikon dengan background warna lembut */}
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#24608B] group-hover:text-white transition-all">
                                            <Icon size={20} />
                                        </div>

                                        {/* Text */}
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {item.label}
                                            </span>
                                            <span className="text-sm font-black text-slate-900 mt-0.5">
                                                {item.value}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Content Tabs */}
                        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden transition-all duration-300">
                            {/* Tab Navigation */}
                            <div className="px-2 border-b border-slate-100">
                                <nav className="flex gap-2 p-2">
                                    {["Details", "Documents"].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() =>
                                                setActiveTab(tab.toLowerCase())
                                            }
                                            className={`px-8 py-3.5 text-sm font-black rounded-2xl transition-all ${
                                                activeTab === tab.toLowerCase()
                                                    ? "bg-[#24608B] text-white shadow-lg"
                                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Content Area */}
                            <div className="p-8 md:p-10">
                                {activeTab === "details" && (
                                    <div className="space-y-10 animate-in fade-in duration-500">
                                        {/* About Section */}
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                                Tentang Properti
                                            </h3>
                                            <div className="prose prose-slate max-w-none text-slate-500 leading-relaxed text-sm md:text-base">
                                                <p className="whitespace-pre-line">
                                                    {property.detail}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Specs Grid (Upgrade) */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                {
                                                    label: "Ownership",
                                                    value: property.financials
                                                        .ownership,
                                                },
                                                {
                                                    label: "Lease Term",
                                                    value: property.financials
                                                        .lease_term
                                                        ? `${property.financials.lease_term} Years`
                                                        : "-",
                                                },
                                                {
                                                    label: "Land Area",
                                                    value: property.specs
                                                        .land_area,
                                                },
                                                {
                                                    label: "Building Area",
                                                    value: property.specs.area,
                                                },
                                            ].map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-[#24608B] transition-all"
                                                >
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                                        {item.label}
                                                    </p>
                                                    <p className="font-bold text-slate-900 text-sm">
                                                        {item.value}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Location Map */}
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

                                {activeTab === "documents" && (
                                    <div className="animate-in fade-in duration-500">
                                        <h3 className="text-xl font-black text-slate-900 mb-6">
                                            Dokumen Pendukung
                                        </h3>
                                        {property.documents?.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {property.documents.map(
                                                    (doc, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={doc.url}
                                                            target="_blank"
                                                            className="group flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#24608B] hover:shadow-lg transition-all"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#24608B] border border-slate-100">
                                                                    <FileText
                                                                        size={
                                                                            20
                                                                        }
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-black text-slate-900 group-hover:text-[#24608B]">
                                                                        {
                                                                            doc.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                        PDF
                                                                        Document
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#24608B] group-hover:text-white transition-all">
                                                                <Download
                                                                    size={16}
                                                                />
                                                            </div>
                                                        </a>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-slate-400 italic">
                                                No documents available.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Price Card */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 sticky top-24">
                            {/* 1. Header Harga */}
                            <div className="mb-8">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                                    Harga Properti
                                </span>
                                <div className="text-4xl font-black text-slate-900 tracking-tighter">
                                    {formatCurrency(property.financials.price)}
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600">
                                        {property.financials.ownership}
                                    </span>
                                    {property.financials.lease_term && (
                                        <span className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600">
                                            {property.financials.lease_term}{" "}
                                            Years
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* 2. Action Buttons */}
                            <div className="space-y-3 mb-8">
                                <a
                                    href={`https://wa.me/${settings?.whatsapp || "62818580891"}`}
                                    target="_blank"
                                    className="w-full bg-slate-900 hover:bg-[#24608B] text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-900/20"
                                >
                                    <Phone size={18} /> Contact Agent
                                </a>
                                <button className="w-full bg-white border-2 border-slate-100 hover:border-[#24608B] hover:text-[#24608B] text-slate-700 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                                    <Mail size={18} /> Request Info
                                </button>
                            </div>

                            {/* 3. Property Highlights (Sleek List) */}
                            <div className="pt-8 border-t border-slate-100 border-dashed">
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5">
                                    Highlights
                                </h4>
                                <ul className="space-y-4">
                                    {[
                                        `Lokasi Prime: ${property.loc}`,
                                        `${property.specs.bedroom} Kamar Tidur, ${property.specs.bathroom} Kamar Mandi`,
                                        `${property.specs.area} Luas Bangunan`,
                                    ].map((text, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3 text-sm font-medium text-slate-600"
                                        >
                                            <CheckCircle
                                                size={16}
                                                className="text-emerald-500 shrink-0 mt-0.5"
                                            />
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 4. Trust Badge (Opsional, buat bikin makin Pro) */}
                            <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400">
                                <ShieldCheck size={14} /> Terverifikasi Aman
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={closeLightbox}
                >
                    {/* Tombol Close */}
                    <button
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
                        onClick={closeLightbox}
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="relative max-w-5xl max-h-[85vh] flex items-center justify-center">
                        {/* Gambar Utama di Lightbox */}
                        <img
                            src={
                                (property.images &&
                                    property.images[currentImageIndex]) ||
                                property.main_image
                            }
                            alt={property.name}
                            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Navigasi & Indikator: Hanya muncul jika ada lebih dari 1 gambar */}
                        {(property.images?.length || 0) > 1 && (
                            <>
                                <button
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
                                    onClick={prevImage}
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>

                                <button
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
                                    onClick={nextImage}
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>

                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium px-4 py-2 bg-black/50 rounded-full backdrop-blur-sm">
                                    {currentImageIndex + 1} /{" "}
                                    {property.images?.length || 1}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
