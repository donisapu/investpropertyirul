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
    Info,
    CheckCircle,
    ExternalLink,
    X,
    Download,
    FileText,
    Banknote,
    Clock,
    TrendingUp,
    Image as ImageIcon,
    Building2,
    Zap,
    ShieldCheck,
    CheckCircle2,
    ArrowRight,
    Lock
} from "lucide-react";
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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const { auth } = usePage().props;

    const handleInvestClick = (e) => {
        if (!auth.user) {
            e.preventDefault();
            alert("Waduh, login dulu yuk bos biar bisa invest!");
            window.location.href = route("login");
        }
    };

    // Use property images or fallback if empty
    const displayImages =
        property.images && property.images.length > 0
            ? property.images
            : [
                  `https://placehold.co/800x600?text=${encodeURIComponent(property.name)}`,
              ];

    const tabMenus = [
        { id: "details", label: "Detail Proyek", icon: Info },
        { id: "financials", label: "Finansial", icon: TrendingUp },
        { id: "documents", label: "Dokumen", icon: FileText },
        { id: "location", label: "Lokasi", icon: MapPin },
    ];

    return (
        <PublicLayout>
            <Head title={property.name} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-slate-500 mb-6">
                    <Link href="/crowdfunding" className="hover:text-blue-600">
                        Crowdfunding
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
                        <div className="w-full relative rounded-[2rem] overflow-hidden bg-slate-100/50">
                            {/* Jika cuma ada 1 gambar */}
                            {displayImages.length === 1 && (
                                <div
                                    className="w-full h-[300px] md:h-[400px] lg:h-[480px] relative group cursor-pointer overflow-hidden"
                                    onClick={() => openLightbox(0)}
                                >
                                    <img
                                        src={displayImages[0]}
                                        alt={property.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Soft overlay on hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                </div>
                            )}

                            {/* Jika ada 2 gambar */}
                            {displayImages.length === 2 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px] lg:h-[480px]">
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
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Jika ada 3 gambar */}
                            {displayImages.length === 3 && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[400px] lg:h-[480px]">
                                    <div
                                        className="md:col-span-2 h-full relative group cursor-pointer overflow-hidden"
                                        onClick={() => openLightbox(0)}
                                    >
                                        <img
                                            src={displayImages[0]}
                                            alt={property.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                    </div>
                                    <div className="hidden md:grid grid-rows-2 gap-2 h-full">
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
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Jika gambar 4 atau lebih */}
                            {displayImages.length >= 4 && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] lg:h-[480px] relative">
                                    <div
                                        className="md:col-span-3 h-full relative group cursor-pointer overflow-hidden"
                                        onClick={() => openLightbox(0)}
                                    >
                                        <img
                                            src={displayImages[0]}
                                            alt={property.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                    </div>
                                    <div className="hidden md:grid grid-rows-3 gap-2 h-full">
                                        {displayImages
                                            .slice(1, 4)
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

                                                    {/* Overlay "Lihat Foto Lainnya" Keren untuk foto terakhir */}
                                                    {idx === 2 &&
                                                    displayImages.length > 4 ? (
                                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white transition-colors group-hover:bg-slate-900/50">
                                                            <span className="text-2xl font-black mb-1">
                                                                +
                                                                {displayImages.length -
                                                                    4}
                                                            </span>
                                                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                                                Foto Lainnya
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                                    )}
                                                </div>
                                            ))}
                                    </div>

                                    {/* Tombol Floating Floating Khusus (Pilihan Opsional, Tapi Bikin Mevvah) */}
                                    <button
                                        onClick={() => openLightbox(0)}
                                        className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-md hover:bg-white text-slate-800 border border-slate-200/50 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all hover:scale-105 hover:-translate-y-0.5 active:scale-95 hidden sm:flex"
                                    >
                                        <ImageIcon
                                            size={16}
                                            className="text-[#24608B]"
                                        />
                                        Lihat Semua Foto
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Property Details */}
                        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                            {/* ================= HEADER TABS (Model Segmented Control) ================= */}
                            <div className="p-2 border-b border-slate-100 bg-slate-50/50 overflow-x-auto no-scrollbar">
                                <div className="flex gap-2 min-w-max">
                                    {tabMenus.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;

                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() =>
                                                    setActiveTab(tab.id)
                                                }
                                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                                                    isActive
                                                        ? "bg-white text-[#24608B] shadow-sm ring-1 ring-slate-200/50"
                                                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/80"
                                                }`}
                                            >
                                                <Icon
                                                    size={16}
                                                    className={
                                                        isActive
                                                            ? "text-[#24608B]"
                                                            : "text-slate-400"
                                                    }
                                                />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ================= ISI KONTEN TABS ================= */}
                            <div className="p-6 md:p-8">
                                {/* TAB 1: DETAILS */}
                                {activeTab === "details" && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        {/* Spesifikasi Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                                    Kamar Tidur
                                                </span>
                                                <div className="font-black text-slate-800 text-lg flex items-center gap-2">
                                                    <Bed className="w-5 h-5 text-blue-500" />{" "}
                                                    {property.specs.bedroom}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                                    Kamar Mandi
                                                </span>
                                                <div className="font-black text-slate-800 text-lg flex items-center gap-2">
                                                    <Bath className="w-5 h-5 text-blue-500" />{" "}
                                                    {property.specs.bathroom}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                                    Luas Bangunan
                                                </span>
                                                <div className="font-black text-slate-800 text-lg flex items-center gap-2">
                                                    <Maximize className="w-5 h-5 text-blue-500" />{" "}
                                                    {property.specs.area}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                                    Lantai
                                                </span>
                                                <div className="font-black text-slate-800 text-lg flex items-center gap-2">
                                                    <Building2 className="w-5 h-5 text-blue-500" />{" "}
                                                    {property.specs.floors || 1}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Deskripsi */}
                                        <div>
                                            <h3 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                                                Tentang Proyek Ini
                                            </h3>
                                            {/* Prose styling biar teks HTML dari backend keliatan rapi (butuh @tailwindcss/typography) */}
                                            <div
                                                className="prose prose-slate prose-p:text-slate-500 prose-p:leading-relaxed prose-headings:font-bold prose-a:text-[#24608B] max-w-none text-sm md:text-base"
                                                dangerouslySetInnerHTML={{
                                                    __html: property.description,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* TAB 2: FINANCIALS */}
                                {activeTab === "financials" && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="p-5 border border-slate-100 bg-emerald-50/50 rounded-2xl relative overflow-hidden group hover:border-emerald-200 transition-colors">
                                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-100 rounded-full blur-xl group-hover:bg-emerald-200 transition-colors"></div>
                                                <div className="flex flex-col relative z-10">
                                                    <span className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5">
                                                        <TrendingUp className="w-4 h-4 text-emerald-600" />{" "}
                                                        Estimasi ROI
                                                    </span>
                                                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                                                        {property.roi}
                                                    </span>
                                                    <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">
                                                        Per Tahun (Annualized)
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-5 border border-slate-100 bg-blue-50/50 rounded-2xl relative overflow-hidden group hover:border-blue-200 transition-colors">
                                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-100 rounded-full blur-xl group-hover:bg-blue-200 transition-colors"></div>
                                                <div className="flex flex-col relative z-10">
                                                    <span className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5">
                                                        <Clock className="w-4 h-4 text-blue-600" />{" "}
                                                        Tenor Proyek
                                                    </span>
                                                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                                                        {property.tenor}
                                                    </span>
                                                    <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">
                                                        Durasi Pendanaan
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-5 border border-slate-100 bg-indigo-50/50 rounded-2xl relative overflow-hidden group hover:border-indigo-200 transition-colors">
                                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-100 rounded-full blur-xl group-hover:bg-indigo-200 transition-colors"></div>
                                                <div className="flex flex-col relative z-10">
                                                    <span className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5">
                                                        <Banknote className="w-4 h-4 text-indigo-600" />{" "}
                                                        Min. Pembelian
                                                    </span>
                                                    <span className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                                                        {formatCurrency(
                                                            property.min_contribution,
                                                        )}
                                                    </span>
                                                    <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">
                                                        Per 1 Lot/Token
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-900 p-6 rounded-2xl text-white relative overflow-hidden">
                                            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                                                <Building2
                                                    size={120}
                                                    className="-mb-4 -mr-4"
                                                />
                                            </div>
                                            <h4 className="font-extrabold text-lg mb-4 relative z-10">
                                                Kenapa Investasi di Proyek Ini?
                                            </h4>
                                            <ul className="space-y-3 relative z-10">
                                                <li className="flex items-start gap-3 text-sm text-slate-300">
                                                    <CheckCircle className="w-5 h-5 mt-0.5 text-emerald-400 flex-shrink-0" />
                                                    Potensi kenaikan harga modal
                                                    (Capital Gain) tinggi karena
                                                    lokasi strategis di pusat
                                                    kota.
                                                </li>
                                                <li className="flex items-start gap-3 text-sm text-slate-300">
                                                    <CheckCircle className="w-5 h-5 mt-0.5 text-emerald-400 flex-shrink-0" />
                                                    Dana dilindungi dengan
                                                    underlying asset berupa
                                                    fisik properti (Aman).
                                                </li>
                                                <li className="flex items-start gap-3 text-sm text-slate-300">
                                                    <CheckCircle className="w-5 h-5 mt-0.5 text-emerald-400 flex-shrink-0" />
                                                    Dikelola penuh oleh
                                                    developer dan operator
                                                    properti berpengalaman.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 3: DOCUMENTS */}
                                {activeTab === "documents" && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
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
                                                            className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-[#24608B] hover:shadow-[0_8px_30px_rgba(36,96,139,0.08)] transition-all group"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                                                                    <FileText className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-900 group-hover:text-[#24608B] transition-colors line-clamp-1">
                                                                        {doc.name ||
                                                                            `Dokumen Legalitas ${idx + 1}`}
                                                                    </div>
                                                                    <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mt-0.5">
                                                                        PDF •
                                                                        Disahkan
                                                                        Notaris
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#24608B] group-hover:text-white transition-all">
                                                                <Download className="w-4 h-4" />
                                                            </div>
                                                        </a>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                                                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                                <h4 className="font-bold text-slate-700 mb-1">
                                                    Dokumen Belum Tersedia
                                                </h4>
                                                <p className="text-sm text-slate-500">
                                                    Prospektus dan legalitas
                                                    sedang dalam proses unggah.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 4: LOCATION */}
                                {activeTab === "location" && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="flex items-center gap-2 mb-4 bg-slate-50 w-fit px-4 py-2 rounded-xl border border-slate-100">
                                            <MapPin className="w-5 h-5 text-rose-500" />
                                            <span className="font-bold text-slate-700 text-sm">
                                                {property.loc}
                                            </span>
                                        </div>

                                        <div className="bg-slate-200 rounded-2xl h-[400px] flex items-center justify-center text-slate-500 overflow-hidden shadow-inner relative border border-slate-200">
                                            {property.map_url ? (
                                                <>
                                                    <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-slate-900/10 z-10"></div>
                                                    <iframe
                                                        src={property.map_url}
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: 0 }}
                                                        allowFullScreen=""
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                        className="grayscale-[20%] contrast-125" // Filter CSS biar mapnya keliatan lebih "aesthetic"
                                                    ></iframe>
                                                </>
                                            ) : (
                                                <div className="text-center">
                                                    <MapPin className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                                    <p className="font-medium">
                                                        Pin lokasi peta belum
                                                        ditambahkan.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 sticky top-24">
                            {/* Status Badge + Funding Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        Target Pendanaan
                                    </div>
                                    <div className="text-3xl font-black text-slate-900 tracking-tight">
                                        {formatCurrency(property.goal)}
                                    </div>
                                </div>
                                {/* Status Badge Modern */}
                                <span
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                        property.status === "Open"
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                            : "bg-slate-100 text-slate-600 border-slate-200"
                                    }`}
                                >
                                    {property.status}
                                </span>
                            </div>

                            {/* Progres Bar Dinamis */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center text-xs font-bold mb-3">
                                    <span className="text-[#24608B] flex items-center gap-1.5">
                                        <Zap
                                            size={14}
                                            className="fill-[#24608B]"
                                        />{" "}
                                        {property.progress}% Terkumpul
                                    </span>
                                    <span className="text-slate-900 font-black">
                                        {formatCurrency(property.collected)}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                                    <div
                                        className="bg-gradient-to-r from-blue-600 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${Math.min(property.progress, 100)}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Grid Info Keuangan (Dibuat lebih rapi dan ikonik) */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        Min. Investasi
                                    </div>
                                    <div className="font-black text-slate-900 text-sm">
                                        {formatCurrency(
                                            property.min_contribution,
                                        )}
                                    </div>
                                </div>
                                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                                    <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
                                        Est. ROI
                                    </div>
                                    <div className="font-black text-emerald-700 text-sm">
                                        {property.roi}
                                    </div>
                                </div>
                            </div>

                            {/* Tombol CTA Utama */}
                            {auth.user ? (
                                <Link
                                    href={route(
                                        "crowdfunding.purchase",
                                        property.id,
                                    )}
                                    className="w-full group flex items-center justify-center gap-2 bg-slate-900 hover:bg-[#24608B] text-white font-black py-4 rounded-2xl transition-all shadow-lg hover:shadow-blue-900/20 hover:-translate-y-0.5"
                                >
                                    Invest Sekarang{" "}
                                    <ChevronRight
                                        size={18}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                </Link>
                            ) : (
                                <Link
                                    href={route("login")}
                                    className="w-full flex items-center justify-center gap-2 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-black py-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    <Lock size={16} /> Login untuk Investasi
                                </Link>
                            )}

                            {/* Trust Markers */}
                            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <ShieldCheck
                                    size={14}
                                    className="text-emerald-500"
                                />{" "}
                                Transaksi Terenkripsi
                            </div>
                        </div>

                        {/* Help Card */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 flex-none">
                                <Info size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">
                                    Butuh Bantuan?
                                </h4>
                                <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                                    Tim investasi kami siap membantu pertanyaan
                                    Anda.
                                </p>
                                <a
                                    href="#"
                                    className="text-xs font-bold text-[#24608B] hover:underline flex items-center gap-1"
                                >
                                    Kontak Support <ArrowRight size={12} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
                    >
                        <X className="w-10 h-10" />
                    </button>

                    <button
                        onClick={prevImage}
                        className="absolute left-6 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </button>

                    <img
                        src={displayImages[currentImageIndex]}
                        alt={`Gallery ${currentImageIndex + 1}`}
                        className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <button
                        onClick={nextImage}
                        className="absolute right-6 text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    >
                        <ChevronRight className="w-10 h-10" />
                    </button>

                    <div className="absolute bottom-6 left-0 right-0 text-center text-white/50 font-medium">
                        {currentImageIndex + 1} / {displayImages.length}
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
