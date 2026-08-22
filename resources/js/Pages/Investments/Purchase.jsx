import React, { useState, useEffect } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Minus,
    Plus,
    Info,
    ShieldCheck,
    Tag,
    Calendar,
} from "lucide-react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function Show({ property }) {
    const minLot = parseInt(property.financials?.min_lot || 1);
    const [quantity, setQuantity] = useState(minLot);

    // 1. Cek apakah ada diskon dari campaign
    const hasDiscount = (property.financials?.discount_percent || 0) > 0;
    const originalPrice = parseFloat(property.financials.price_per_lot);

    // Jika ada diskon, gunakan discounted_price_per_lot
    const tokenPrice = hasDiscount
        ? parseFloat(property.financials.discounted_price_per_lot)
        : originalPrice;

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

    // 2. Tambahkan campaign_id ke payload form
    const { data, setData, post, processing } = useForm({
        lot: quantity,
        campaign_id: property.campaign?.id || null,
    });

    useEffect(() => {
        setData((prev) => ({ ...prev, lot: quantity }));
    }, [quantity]);

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        post(route("user.payment.investment", property.id));
    };

    // 3. Kalkulasi Total & Total Hemat
    const totalPayment = quantity * tokenPrice;
    const totalOriginalPayment = quantity * originalPrice;
    const totalSavings = totalOriginalPayment - totalPayment;

    return (
        <PublicLayout>
            <Head title={`Pembelian ${property.name}`} />

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

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* ================= KOLOM KIRI (Span 3) ================= */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Banner Promo Campaign Jika Ada */}
                        {hasDiscount && property.campaign && (
                            <div className="bg-gradient-to-r from-amber-500 to-red-500 rounded-3xl p-4 text-white shadow-lg flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
                                        <Tag className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-amber-100 uppercase tracking-wider">
                                            Promo Aktif Applied
                                        </div>
                                        <div className="text-sm font-bold">
                                            {property.campaign.title}
                                        </div>
                                    </div>
                                </div>
                                <span className="bg-white text-red-600 px-3 py-1 rounded-full text-xs font-black">
                                    Diskon {property.financials.discount_percent}%
                                </span>
                            </div>
                        )}

                        {/* Info Ringkas Produk */}
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

                        {/* Pemilih Kuantitas */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.03)]">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">
                                Tentukan Jumlah Pembelian
                            </h3>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                                <div>
                                    <div className="text-sm font-bold text-slate-900 mb-0.5">
                                        Kuantitas Lot (Token)
                                    </div>

                                    {/* Display Harga Normal vs Harga Diskon */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-900">
                                            IDR {tokenPrice.toLocaleString()}
                                        </span>
                                        {hasDiscount && (
                                            <span className="text-[11px] text-slate-400 line-through">
                                                IDR {originalPrice.toLocaleString()}
                                            </span>
                                        )}
                                        <span className="text-[10px] text-slate-400">
                                            / lot
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    {/* Counter Box */}
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

                                    {/* Quick Pick Presets */}
                                    <div className="flex gap-1.5">
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

                    {/* ================= KOLOM KANAN (Span 2) ================= */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 sticky top-24">
                            <h5 className="text-lg font-extrabold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                                Ringkasan Pembayaran
                            </h5>

                            <div className="space-y-4 text-sm font-medium">
                                <div className="flex justify-between items-center text-slate-500">
                                    <span>Harga Lot ({quantity} Lot)</span>
                                    <span className={`${hasDiscount ? 'line-through text-slate-400 text-xs' : 'text-slate-900 font-semibold'}`}>
                                        IDR {totalOriginalPayment.toLocaleString()}
                                    </span>
                                </div>

                                {/* Rincian Diskon Promo jika ada */}
                                {hasDiscount && (
                                    <div className="flex justify-between items-center text-red-600 font-semibold">
                                        <span className="flex items-center gap-1">
                                            Diskon Promo ({property.financials.discount_percent}%)
                                        </span>
                                        <span>
                                            - IDR {totalSavings.toLocaleString()}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-slate-500">
                                    <span className="flex items-center gap-1">
                                        Biaya Transaksi <Info className="w-3.5 h-3.5 text-slate-300" />
                                    </span>
                                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                        GRATIS
                                    </span>
                                </div>
                            </div>

                            <div className="my-5 border-t border-dashed border-slate-200"></div>

                            {/* Total Pembayaran */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <span className="text-sm font-bold text-slate-800 block">
                                        Total Pembayaran
                                    </span>
                                    {hasDiscount && (
                                        <span className="text-[11px] font-bold text-red-500">
                                            Hemat IDR {totalSavings.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                <span className="text-2xl font-black text-slate-950 tracking-tight">
                                    IDR {totalPayment.toLocaleString()}
                                </span>
                            </div>

                            {/* Terms Checkbox */}
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
                                    Saya menyatakan telah membaca dan menyetujui seluruh isi berkas{" "}
                                    <span className="text-emerald-600 font-bold underline hover:text-emerald-700">
                                        Surat Perjanjian Kepemilikan Fraksional
                                    </span>.
                                </label>
                            </div>

                            {/* Submit Button */}
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
                                    <span>Memproses...</span>
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
        </PublicLayout>
    );
}
