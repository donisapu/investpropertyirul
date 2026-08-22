import React, { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import {
    MapPin,
    ChevronRight,
    ChevronLeft,
    Info,
    X,
    ShieldCheck,
    Check,
    Tag,
} from "lucide-react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function Show({ property }) {
    const hasDiscount = (property.discount_percent || 0) > 0;

    // Batas minimal kontribusi (menggunakan nilai setelah diskon jika promo aktif)
    const minAmount = hasDiscount
        ? Number(property.discounted_min_contribution) || 0
        : Number(property.min_contribution) || 0;

    const [investAmount, setInvestAmount] = useState(0);

    useEffect(() => {
        setInvestAmount(minAmount);
    }, [minAmount]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Form Inertia untuk kirim data transaksi
    const { data, setData, post, processing } = useForm({
        total_amount: investAmount,
        campaign_id: property.campaign?.id || null,
    });

    useEffect(() => {
        setData("total_amount", investAmount);
    }, [investAmount]);

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        post(
            route(
                "user.payment.crowdfunding",
                property.crowdfunding_id || property.id,
            ),
        );
    };

    // Hitung nominal sebelum diskon dan total hemat
    const originalAmount = hasDiscount
        ? Math.round(investAmount / (1 - property.discount_percent / 100))
        : investAmount;
    const totalSavings = originalAmount - investAmount;

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

    return (
        <PublicLayout>
            <Head title={`Crowdfunding - ${property.name}`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center text-sm text-slate-500 mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Crowdfunding Investment
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-10">
                    {/* Kolom Kiri */}
                    <div className="space-y-6">
                        {/* Banner Promo Campaign Jika Ada */}
                        {hasDiscount && property.campaign && (
                            <div className="bg-gradient-to-r from-amber-500 to-red-500 rounded-[2rem] p-5 text-white shadow-lg flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
                                        <Tag className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-amber-100 uppercase tracking-wider">
                                            Promo Campaign Aktif
                                        </div>
                                        <div className="text-base font-bold">
                                            {property.campaign.title}
                                        </div>
                                    </div>
                                </div>
                                <span className="bg-white text-red-600 px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm">
                                    Diskon {property.discount_percent}%
                                </span>
                            </div>
                        )}

                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden">
                            {/* Header Gambar */}
                            <div className="h-64 w-full relative">
                                <img
                                    src={
                                        property.main_image ||
                                        "https://placehold.co/800x600"
                                    }
                                    alt={property.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent p-8 flex flex-col justify-end">
                                    <h2 className="text-white text-2xl font-black tracking-tight">
                                        {property.name}
                                    </h2>
                                    <p className="text-blue-200 text-sm font-medium flex items-center gap-1.5">
                                        <MapPin size={14} /> {property.loc}
                                    </p>
                                </div>
                            </div>

                            {/* Form Input Nominal */}
                            <div className="p-8">
                                <div className="mb-6">
                                    <h3 className="text-lg font-black text-slate-900 mb-1">
                                        Nominal Partisipasi
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Minimal investasi proyek ini adalah{" "}
                                        <span className="font-bold text-slate-800">
                                            {formatCurrency(minAmount)}
                                        </span>
                                    </p>
                                </div>

                                {/* Input Nominal */}
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-[#24608B] transition-colors">
                                        IDR
                                    </div>
                                    <input
                                        type="number"
                                        value={investAmount}
                                        min={minAmount}
                                        onChange={(e) =>
                                            setInvestAmount(
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-full pl-16 pr-6 py-6 bg-slate-50 border-2 border-slate-100 rounded-3xl text-3xl font-black text-slate-900 placeholder-slate-300 outline-none transition-all focus:border-[#24608B] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        placeholder="1.000.000"
                                    />

                                    {/* Preset Buttons */}
                                    <div className="flex gap-2 mt-4">
                                        {[1000000, 5000000, 10000000].map(
                                            (amt) => (
                                                <button
                                                    key={amt}
                                                    type="button"
                                                    onClick={() =>
                                                        setInvestAmount(amt)
                                                    }
                                                    className="text-[10px] font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-[#24608B] hover:text-[#24608B] transition-colors"
                                                >
                                                    + {formatCurrency(amt)}
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* Proyeksi ROI */}
                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                            Estimasi Imbal Hasil ({property.roi}
                                            )
                                        </div>
                                        <div className="text-lg font-black text-emerald-600">
                                            {formatCurrency(
                                                investAmount *
                                                    (parseFloat(property.roi) /
                                                        100),
                                            )}
                                        </div>
                                        <div className="text-[10px] text-slate-400">
                                            / Tenor ({property.tenor})
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                            Status Proyek
                                        </div>
                                        <div className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                                            {property.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan (Order Summary) */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 sticky top-24">
                            <div className="flex items-center gap-3 mb-8 pb-3 border-b border-slate-100">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                    <ShieldCheck size={20} />
                                </div>
                                <h5 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                    Order Summary
                                </h5>
                            </div>

                            {/* Rincian Tagihan */}
                            <div className="space-y-3 mb-8">
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                            Nominal Investasi
                                        </span>
                                        <span
                                            className={`font-extrabold text-sm ${hasDiscount ? "line-through text-slate-400" : "text-slate-900"}`}
                                        >
                                            {formatCurrency(originalAmount)}
                                        </span>
                                    </div>

                                    {/* Potongan promo */}
                                    {hasDiscount && (
                                        <div className="flex justify-between items-center text-red-600 font-bold text-xs">
                                            <span>
                                                Diskon Promo (
                                                {property.discount_percent}%)
                                            </span>
                                            <span>
                                                - {formatCurrency(totalSavings)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                        <Info className="w-3.5 h-3.5 text-slate-400" />{" "}
                                        Payment Processing Fee
                                    </span>
                                    <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                                        <Check size={12} /> FREE
                                    </span>
                                </div>
                            </div>

                            {/* Total Pembayaran */}
                            <div className="mb-8 text-center bg-blue-50/50 p-6 rounded-2xl border border-blue-100 relative overflow-hidden group">
                                <div className="relative z-10">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#24608B] block mb-1">
                                        Total Pembayaran
                                    </span>
                                    {hasDiscount && (
                                        <span className="text-[11px] font-bold text-red-500 block mb-1">
                                            Hemat {formatCurrency(totalSavings)}
                                        </span>
                                    )}
                                    <span className="text-4xl font-black text-[#24608B] tracking-tighter">
                                        {formatCurrency(investAmount)}
                                    </span>
                                </div>
                            </div>

                            {/* Agreement Checkbox */}
                            <div className="flex gap-3 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <input
                                    type="checkbox"
                                    className="mt-1 w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                                    id="agree"
                                />
                                <label
                                    htmlFor="agree"
                                    className="text-[11px] leading-relaxed text-slate-600 cursor-pointer"
                                >
                                    Saya menyetujui{" "}
                                    <span className="font-bold text-emerald-600 underline hover:text-emerald-700">
                                        Surat Perjanjian Crowdfunding Properti
                                    </span>{" "}
                                    serta memahami potensi risiko investasi ini.
                                </label>
                            </div>

                            {/* Tombol Lanjutkan Pembayaran */}
                            <button
                                onClick={handlePaymentSubmit}
                                disabled={
                                    processing || investAmount < minAmount
                                }
                                className={`w-full group flex items-center justify-center gap-2.5 text-white font-black py-4.5 rounded-2xl transition-all shadow-lg ${
                                    processing || investAmount < minAmount
                                        ? "bg-slate-300 cursor-not-allowed"
                                        : "bg-slate-900 hover:bg-[#24608B] hover:shadow-blue-900/20 hover:-translate-y-0.5"
                                }`}
                            >
                                {processing ? (
                                    <span>Memproses...</span>
                                ) : (
                                    <>
                                        Lanjutkan ke Pembayaran{" "}
                                        <ChevronRight
                                            size={18}
                                            className="group-hover:translate-x-1 transition-transform"
                                        />
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
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 z-50"
                    >
                        <X size={32} />
                    </button>
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
                    <div
                        className="relative max-w-7xl w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={property.images[currentImageIndex]}
                            alt={`Gallery image ${currentImageIndex + 1}`}
                            className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
                        />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm font-medium">
                            {currentImageIndex + 1} / {property.images.length}
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
