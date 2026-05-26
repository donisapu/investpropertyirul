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
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                            {/* Jika cuma ada 1 gambar */}
                            {displayImages.length === 1 && (
                                <div
                                    className="w-full h-[400px] relative group cursor-pointer overflow-hidden rounded-xl"
                                    onClick={() => openLightbox(0)}
                                >
                                    <img
                                        src={displayImages[0]}
                                        alt={property.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            )}

                            {/* Jika ada 2 gambar */}
                            {displayImages.length === 2 && (
                                <div className="grid grid-cols-2 gap-4 h-[400px]">
                                    {displayImages.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="h-full relative group cursor-pointer overflow-hidden rounded-xl"
                                            onClick={() => openLightbox(idx)}
                                        >
                                            <img
                                                src={img}
                                                alt={`${property.name} ${idx + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Jika ada 3 gambar */}
                            {displayImages.length === 3 && (
                                <div className="grid grid-cols-3 gap-4 h-[400px]">
                                    <div
                                        className="col-span-2 h-full relative group cursor-pointer overflow-hidden rounded-xl"
                                        onClick={() => openLightbox(0)}
                                    >
                                        <img
                                            src={displayImages[0]}
                                            alt={property.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="col-span-1 grid grid-rows-2 gap-4 h-full">
                                        {displayImages
                                            .slice(1, 3)
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
                                                        alt={`${property.name} ${idx + 2}`}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Jika gambar 4 atau lebih */}
                            {displayImages.length >= 4 && (
                                <div className="grid grid-cols-4 gap-4 h-[400px]">
                                    <div
                                        className="col-span-3 h-full relative group cursor-pointer overflow-hidden rounded-xl"
                                        onClick={() => openLightbox(0)}
                                    >
                                        <img
                                            src={displayImages[0]}
                                            alt={property.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
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
                                                        alt={`${property.name} ${idx + 2}`}
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
                                </div>
                            )}
                        </div>

                        {/* Property Details */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            {/* Tabs */}
                            <div className="flex border-b border-slate-200">
                                <button
                                    onClick={() => setActiveTab("details")}
                                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                                        activeTab === "details"
                                            ? "text-blue-600 border-b-2 border-blue-600"
                                            : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    Project Details
                                </button>
                                <button
                                    onClick={() => setActiveTab("financials")}
                                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                                        activeTab === "financials"
                                            ? "text-blue-600 border-b-2 border-blue-600"
                                            : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    Financials
                                </button>
                                <button
                                    onClick={() => setActiveTab("documents")}
                                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                                        activeTab === "documents"
                                            ? "text-blue-600 border-b-2 border-blue-600"
                                            : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    Documents
                                </button>
                                <button
                                    onClick={() => setActiveTab("location")}
                                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                                        activeTab === "location"
                                            ? "text-blue-600 border-b-2 border-blue-600"
                                            : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    Location
                                </button>
                            </div>

                            <div className="p-6">
                                {activeTab === "details" && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                                About the Project
                                            </h3>
                                            <div
                                                className="prose prose-slate max-w-none text-slate-600"
                                                dangerouslySetInnerHTML={{
                                                    __html: property.description,
                                                }}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl">
                                            <div>
                                                <div className="text-xs text-slate-500 mb-1">
                                                    Bedrooms
                                                </div>
                                                <div className="font-semibold flex items-center gap-2">
                                                    <Bed className="w-4 h-4 text-blue-500" />
                                                    {property.specs.bedroom}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 mb-1">
                                                    Bathrooms
                                                </div>
                                                <div className="font-semibold flex items-center gap-2">
                                                    <Bath className="w-4 h-4 text-blue-500" />
                                                    {property.specs.bathroom}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 mb-1">
                                                    Building Area
                                                </div>
                                                <div className="font-semibold flex items-center gap-2">
                                                    <Maximize className="w-4 h-4 text-blue-500" />
                                                    {property.specs.area}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500 mb-1">
                                                    Floors
                                                </div>
                                                <div className="font-semibold flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-blue-500" />
                                                    {property.specs.floors || 1}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "financials" && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-4 border border-slate-200 rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                                    <span className="font-semibold text-slate-700">
                                                        Est. ROI
                                                    </span>
                                                </div>
                                                <div className="text-2xl font-bold text-slate-900">
                                                    {property.roi}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    Annualized return
                                                </div>
                                            </div>
                                            <div className="p-4 border border-slate-200 rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock className="w-5 h-5 text-blue-500" />
                                                    <span className="font-semibold text-slate-700">
                                                        Project Durations
                                                    </span>
                                                </div>
                                                <div className="text-2xl font-bold text-slate-900">
                                                    {property.tenor}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    Project duration
                                                </div>
                                            </div>
                                            <div className="p-4 border border-slate-200 rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Banknote className="w-5 h-5 text-purple-500" />
                                                    <span className="font-semibold text-slate-700">
                                                        Min. Invest
                                                    </span>
                                                </div>
                                                <div className="text-2xl font-bold text-slate-900">
                                                    {formatCurrency(
                                                        property.min_contribution,
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    Minimum contribution
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 p-6 rounded-xl">
                                            <h4 className="font-bold text-blue-900 mb-2">
                                                Why invest in this project?
                                            </h4>
                                            <ul className="space-y-2">
                                                <li className="flex items-start gap-2 text-sm text-blue-800">
                                                    <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                                                    High potential for capital
                                                    appreciation due to
                                                    strategic location.
                                                </li>
                                                <li className="flex items-start gap-2 text-sm text-blue-800">
                                                    <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                                                    Secured by underlying
                                                    property asset.
                                                </li>
                                                <li className="flex items-start gap-2 text-sm text-blue-800">
                                                    <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                                                    Managed by experienced
                                                    property developers.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "documents" && (
                                    <div className="space-y-4">
                                        {property.documents &&
                                        property.documents.length > 0 ? (
                                            property.documents.map(
                                                (doc, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-blue-200 group-hover:text-blue-700 transition-colors">
                                                                <FileText className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-slate-900 group-hover:text-blue-800">
                                                                    {doc.name ||
                                                                        `Document ${idx + 1}`}
                                                                </div>
                                                                <div className="text-xs text-slate-500">
                                                                    PDF Document
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Download className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                                                    </a>
                                                ),
                                            )
                                        ) : (
                                            <div className="text-center py-12 text-slate-500">
                                                <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                                <p>
                                                    No documents available for
                                                    this project yet.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "location" && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4 text-slate-700">
                                            <MapPin className="w-5 h-5 text-blue-500" />
                                            <span className="font-medium">
                                                {property.loc}
                                            </span>
                                        </div>
                                        <div className="bg-slate-100 rounded-xl h-[400px] flex items-center justify-center text-slate-500">
                                            {property.map_url ? (
                                                <iframe
                                                        src={property.map_url}
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: 0 }}
                                                        allowFullScreen=""
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                    ></iframe>
                                            ) : (
                                                <div className="text-center">
                                                    <MapPin className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                                    <p>
                                                        Map location not
                                                        available
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
                        {/* Investment Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-24">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="text-sm text-slate-500 mb-1">
                                        Funding Goal
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900">
                                        {formatCurrency(property.goal)}
                                    </div>
                                </div>
                                <div
                                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        property.status === "Open"
                                            ? "bg-green-100 text-green-700"
                                            : property.status === "Success"
                                              ? "bg-blue-100 text-blue-700"
                                              : "bg-slate-100 text-slate-700"
                                    }`}
                                >
                                    {property.status}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
                                    <span className="text-blue-600">
                                        {property.progress}% Funded
                                    </span>
                                    <span>
                                        {formatCurrency(property.collected)}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${Math.max(property.progress, 0)}%`,
                                        }}
                                    ></div>
                                </div>
                                <div className="text-xs text-slate-500 mt-2 text-right">
                                    from {formatCurrency(property.goal)} goal
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-slate-50 rounded-lg text-center">
                                    <div className="text-xs text-slate-500 mb-1">
                                        Min. Invest
                                    </div>
                                    <div className="font-bold text-slate-900">
                                        {formatCurrency(
                                            property.min_contribution,
                                        )}
                                    </div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg text-center">
                                    <div className="text-xs text-slate-500 mb-1">
                                        Est. ROI
                                    </div>
                                    <div className="font-bold text-green-600">
                                        {property.roi}
                                    </div>
                                </div>
                            </div>

                            {auth.user ? (
                                <Link
                                    href={route(
                                        "crowdfunding.purchase",
                                        property.id,
                                    )}
                                    className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 active:translate-y-0"
                                >
                                    Invest Now
                                </Link>
                            ) : (
                                <a
                                    href={route("login")}
                                    className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 active:translate-y-0"
                                >
                                    Login to Invest
                                </a>
                            )}

                            <p className="text-xs text-slate-400 text-center mt-4">
                                By clicking "Invest Now", you agree to our Terms
                                of Service and Risk Disclosure.
                            </p>
                        </div>

                        {/* Help Card */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-500" />
                                Need Help?
                            </h4>
                            <p className="text-sm text-slate-600 mb-4">
                                Have questions about this project? Our
                                investment team is here to help.
                            </p>
                            <a
                                href="#"
                                className="text-blue-600 text-sm font-semibold hover:underline"
                            >
                                Contact Support &rarr;
                            </a>
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

function Building2({ className }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
            <path d="M10 6h4" />
            <path d="M10 10h4" />
            <path d="M10 14h4" />
            <path d="M10 18h4" />
        </svg>
    );
}
