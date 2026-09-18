import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import {
    ArrowLeft,
    Minus,
    Plus,
    Info,
    AlertTriangle,
    Coins,
    CheckCircle2,
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
                {/* Navigasi Back & Judul */}
                <div className="mb-8">
                    <Link
                        href={route("investments.show", property.id)}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-rose-600 transition-colors mb-3"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Properti
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Ajukan Penjualan Lot
                    </h1>
                </div>

                {/* Grid Asimetris: Kiri 3 Kolom (Form), Kanan 2 Kolom (Summary) */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* ================= KOLOM KIRI: KONFIGURASI PENJUALAN (Span 3) ================= */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Info Ringkas Properti */}
                        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)] flex items-center gap-5">
                            <div className="w-20 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-none">
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
                                <h2 className="text-base font-extrabold text-slate-900 truncate mb-1">
                                    {property.name}
                                </h2>
                                <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                    {property.location || property.loc}
                                </p>
                            </div>
                        </div>

                        {/* Info Kepemilikan Token (Dompet User) */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
                            {/* Watermark Dekoratif Ikon Koin di Background */}
                            <Coins className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 pointer-events-none" />

                            <div className="flex justify-between items-center relative z-10">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                                        Total Aset di Properti Ini
                                    </span>
                                    <div className="text-3xl font-black tracking-tight">
                                        {tokenHeld.toLocaleString()}{" "}
                                        <span className="text-sm font-medium text-slate-400">
                                            Lot
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                                        Estimasi Nilai
                                    </span>
                                    <div className="text-lg font-bold text-emerald-400">
                                        IDR{" "}
                                        {(
                                            tokenHeld * tokenPrice
                                        ).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Input Jumlah Penjualan */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)]">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">
                                Tentukan Jumlah Lot Yang Ingin Dijual
                            </h3>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                                <div>
                                    <div className="text-sm font-bold text-slate-900 mb-0.5">
                                        Jumlah Lot Dijual
                                    </div>
                                    <div className="text-xs font-medium text-slate-500">
                                        Nilai Jual: IDR{" "}
                                        {tokenPrice.toLocaleString()}{" "}
                                        <span className="text-[10px] text-slate-400">
                                            / lot
                                        </span>
                                    </div>
                                </div>

                                {/* Counter Widget & Button MAX Terintegrasi */}
                                <div className="flex items-center gap-3">
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
                                            min="1"
                                            max={tokenHeld}
                                            className="w-16 text-center font-extrabold text-slate-900 focus:outline-none text-sm"
                                            value={quantity}
                                            onChange={handleInputChange}
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

                                    <button
                                        type="button"
                                        onClick={() => setQuantity(tokenHeld)}
                                        className="bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                                    >
                                        JUAL SEMUA
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= KOLOM KANAN: RINGKASAN PENCAIRAN DANA (Span 2) ================= */}
                    <div className="lg:col-span-2">
                        {/* Sticky Order Summary Card */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 sticky top-24">
                            <h5 className="text-lg font-extrabold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                                Ringkasan Pencairan
                            </h5>

                            {/* Breakdown Rincian Nota */}
                            <div className="space-y-4 text-sm font-medium">
                                <div className="flex justify-between items-center text-slate-500">
                                    <span>Kuantitas Penjualan</span>
                                    <span className="text-slate-900 font-semibold">
                                        {quantity} Lot
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500">
                                    <span>Harga Per Lot</span>
                                    <span className="text-slate-900 font-semibold">
                                        IDR {tokenPrice.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500">
                                    <span className="flex items-center gap-1">
                                        Biaya Layanan platform{" "}
                                        <Info className="w-3.5 h-3.5 text-slate-300" />
                                    </span>
                                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                        GRATIS
                                    </span>
                                </div>
                            </div>

                            <div className="my-5 border-t border-dashed border-slate-200"></div>

                            {/* Total Uang Cair yang Diterima User */}
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm font-bold text-slate-800">
                                    Total Dana Diterima
                                </span>
                                <span className="text-2xl font-black text-slate-950 tracking-tight">
                                    IDR {totalPayment.toLocaleString()}
                                </span>
                            </div>

                            {/* Checkbox Persetujuan Likuidasi */}
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
                                    Saya menyetujui penjualan lot ini secara
                                    sadar dan memahami bahwa dana pencairan akan
                                    langsung dikirimkan ke saldo akun/rekening
                                    saya.
                                </label>
                            </div>

                            {/* Warning Card Psikologi Finansial (Sangat Penting pas Jual Aset) */}
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3.5 flex items-start gap-2.5 mb-6 text-amber-850 text-xs font-medium leading-relaxed">
                                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-none" />
                                <div>
                                    <span className="font-bold text-amber-900 block mb-0.5">
                                        Konsekuensi Penjualan
                                    </span>
                                    Setelah lot berhasil dijual, Anda **tidak
                                    akan lagi menerima** jatah dividen bagi
                                    hasil pendapatan bulanan dari lot tersebut
                                    untuk siklus ke depan.
                                </div>
                            </div>

                            {/* Tombol Utama Kirim Request Jual */}
                            <button
                                onClick={() =>
                                    router.post(
                                        route(
                                            "user.sell.investment",
                                            property.id,
                                        ),
                                        { lot: quantity },
                                        {
                                            onSuccess: () => {
                                                window.location.href =
                                                    route("user.portfolio");
                                            },
                                        },
                                    )
                                }
                                className="w-full py-4 rounded-xl font-bold text-white text-sm bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 hover:-translate-y-0.5"
                            >
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                Konfirmasi & Cairkan Dana
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
