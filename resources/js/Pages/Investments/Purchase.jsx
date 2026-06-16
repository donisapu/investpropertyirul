import React, { useState, useEffect } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Minus,
    Plus,
    Info,
    ShieldCheck,
    AlertCircle,
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
    const minLot = parseInt(property.financials?.min_lot || 1);
    const [quantity, setQuantity] = useState(minLot);
    const tokenPrice = parseFloat(property.financials.price_per_lot);

    const handleIncrement = () => setQuantity((prev) => prev + 1);
    const handleDecrement = () =>
        setQuantity((prev) => (prev > minLot ? prev - 1 : minLot));

    const handleInputChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        let numValue = value === "" ? 0 : parseInt(value);
        setQuantity(numValue);
    };

    const handleBlur = () => {
        if (quantity < minLot) {
            setQuantity(minLot);
        }
    };

    const { data, setData, post, processing } = useForm({
        lot: quantity,
    });

    useEffect(() => {
        setData("lot", quantity);
    }, [quantity]);

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        // Tembak ke route payment lu
        post(route("user.payment.investment", property.id));
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
                {/* Tombol Back & Judul Halaman */}
                <div className="mb-8">
                    <Link
                        href={route("investments.show", property.id)}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors mb-3"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Properti
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Konfirmasi Pembelian Lot
                    </h1>
                </div>

                {/* Grid Utama: Pembagian Asimetris (Kiri 3 Kolom, Kanan 2 Kolom) */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* ================= KOLOM KIRI: KONFIGURASI ORDER (Span 3) ================= */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Info Ringkas Produk (Ganti gaya hero banner lama dengan gaya list item e-commerce premium) */}
                        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] flex items-center gap-5">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-none">
                                <img
                                    src={
                                        property.main_image ||
                                        "https://placehold.co/150x150"
                                    }
                                    alt={property.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-lg font-extrabold text-slate-900 truncate mb-1">
                                    {property.name}
                                </h2>
                                <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    {property.location || property.loc}
                                </p>
                                <div className="inline-block bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold">
                                    {property.financials.tokens_left.toLocaleString()}{" "}
                                    lot tersedia
                                </div>
                            </div>
                        </div>

                        {/* Pemilih Jumlah Kuantitas Lot */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)]">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">
                                Tentukan Jumlah Pembelian
                            </h3>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                                <div>
                                    <div className="text-sm font-bold text-slate-900 mb-0.5">
                                        Kuantitas Lot (Token)
                                    </div>
                                    <div className="text-xs font-medium text-slate-500">
                                        IDR {tokenPrice.toLocaleString()}{" "}
                                        <span className="text-[10px] text-slate-400">
                                            / lot
                                        </span>
                                    </div>
                                </div>

                                {/* Widget Plus Minus & Preset Button disatuin biar ga makan tempat */}
                                <div className="flex flex-col items-end gap-3">
                                    {/* Counter Input Box */}
                                    <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm p-1">
                                        <button
                                            type="button"
                                            onClick={handleDecrement}
                                            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-colors"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <input
                                            type="number"
                                            min={minLot}
                                            className="w-16 text-center font-extrabold text-slate-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm"
                                            value={quantity}
                                            onChange={
                                                quantity <=
                                                property.financials.tokens_left
                                                    ? handleInputChange
                                                    : undefined
                                            }
                                            onBlur={handleBlur}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleIncrement}
                                            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-colors"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Preset Buttons Quick Pick */}
                                    <div className="flex gap-1.5 w-full sm:w-auto">
                                        {[25, 50, 100].map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => setQuantity(val)}
                                                className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${
                                                    quantity === val
                                                        ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                +{val}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= KOLOM KANAN: RINGKASAN & INVOICE (Span 2) ================= */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Sticky Order Summary Card */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 sticky top-24">
                            <h5 className="text-lg font-extrabold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                                Ringkasan Pembayaran
                            </h5>

                            {/* Rincian item nota */}
                            <div className="space-y-4 text-sm font-medium">
                                <div className="flex justify-between items-center text-slate-500">
                                    <span>Subtotal ({quantity} Lot)</span>
                                    <span className="text-slate-900 font-semibold">
                                        IDR {totalPayment.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500">
                                    <span className="flex items-center gap-1">
                                        Biaya Transaksi{" "}
                                        <Info className="w-3.5 h-3.5 text-slate-300" />
                                    </span>
                                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                        GRATIS
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500">
                                    <span className="flex items-center gap-1">
                                        Biaya Gerbang Pembayaran{" "}
                                        <Info className="w-3.5 h-3.5 text-slate-300" />
                                    </span>
                                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                        GRATIS
                                    </span>
                                </div>
                            </div>

                            <div className="my-5 border-t border-dashed border-slate-200"></div>

                            {/* Total Akhir Tagihan */}
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm font-bold text-slate-800">
                                    Total Pembayaran
                                </span>
                                <span className="text-2xl font-black text-slate-950 tracking-tight">
                                    IDR {totalPayment.toLocaleString()}
                                </span>
                            </div>

                            {/* Syarat & Ketentuan Perjanjian */}
                            <div className="flex gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-5">
                                <input
                                    type="checkbox"
                                    className="mt-1 w-4 h-4 accent-emerald-600 rounded flex-none cursor-pointer"
                                    id="agree"
                                />
                                <label
                                    htmlFor="agree"
                                    className="text-[11px] leading-relaxed text-slate-500 font-medium cursor-pointer"
                                >
                                    Saya menyatakan telah membaca dan menyetujui
                                    seluruh isi berkas{" "}
                                    <span className="text-emerald-600 font-bold underline hover:text-emerald-700">
                                        Surat Perjanjian Kepemilikan Fraksional
                                        Aset Properti (Tokenisasi)
                                    </span>{" "}
                                    yang berlaku.
                                </label>
                            </div>

                            {/* Info Banner Deviden - Diubah warnanya biar gak tabrakan jadi info card soft */}
                            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5 flex items-start gap-3 mb-6 text-blue-800 text-[11px] leading-relaxed">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm flex-none border border-blue-100">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <span className="font-bold text-blue-900 block text-xs mb-0.5">
                                        Siklus Bagi Hasil Bulanan
                                    </span>
                                    Dividen didistribusikan setiap{" "}
                                    <span className="font-bold text-blue-700 underline">
                                        tanggal 5 pada bulan berikutnya
                                    </span>
                                    . Nilai imbal hasil dihitung berdasarkan
                                    laporan pendapatan bersih properti bulanan
                                    yang proporsional dengan jumlah lot Anda.
                                </div>
                            </div>

                            {/* Tombol Utama Bayar */}
                            <button
                                onClick={handlePaymentSubmit}
                                disabled={processing}
                                className={`w-full py-4 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                                    processing
                                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                        : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10 hover:-translate-y-0.5"
                                }`}
                            >
                                {processing ? (
                                    <>
                                        <svg
                                            className="animate-spin h-4 w-4 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Memproses Transaksi...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-4 h-4" />
                                        Lanjutkan ke Pembayaran
                                    </>
                                )}
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
