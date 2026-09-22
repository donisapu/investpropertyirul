import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    History,
    ArrowUpRight,
    ArrowDownLeft,
    Download,
    Wallet,
    TrendingUp,
    TrendingDown,
    Clock,
} from "lucide-react";
import PublicLayout from "@/Layouts/PublicLayout";

function formatCurrency(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function TransactionItem({ item }) {
    const transType = (item.trans_type || item.type || "").toUpperCase();
    const isIn =
        transType === "SELL" ||
        transType === "DEPOSIT" ||
        transType === "IN" ||
        transType === "ROI" ||
        transType === "TOPUP";

    const title = item.title || item.description || item.label || transType;
    const category = item.category || transType;
    const date = item.date || item.created_at;

    return (
        <div className="bg-cream rounded-2xl border border-gold-line p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-gold transition-all">
            <div className="flex items-center gap-4">
                <div
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        isIn
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                    }`}
                >
                    {isIn ? (
                        <ArrowDownLeft size={22} />
                    ) : (
                        <ArrowUpRight size={22} />
                    )}
                </div>
                <div>
                    <h4 className="font-black text-ink text-base">{title}</h4>
                    <p className="text-xs font-bold text-ink-soft uppercase tracking-wider mt-0.5">
                        {category} • {formatDate(date)}
                    </p>
                </div>
            </div>

            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-dashed border-gold-line/60 pt-3 md:pt-0">
                <h3
                    className={`text-lg font-black ${
                        isIn ? "text-emerald-600" : "text-rose-600"
                    }`}
                >
                    {isIn ? "+" : "-"} {formatCurrency(item.amount)}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full mt-1">
                    Berhasil
                </span>
            </div>
        </div>
    );
}

export default function TransactionHistory({
    netCashflow = 0,
    totalIn = 0,
    totalOut = 0,
    transactions = [],
}) {
    const [filter, setFilter] = useState("ALL");

    const filteredTransactions = transactions.filter((item) => {
        const type = (item.trans_type || item.type || "").toUpperCase();
        const isIn =
            type === "SELL" ||
            type === "DEPOSIT" ||
            type === "IN" ||
            type === "ROI" ||
            type === "TOPUP";

        if (filter === "IN") return isIn;
        if (filter === "OUT") return !isIn;
        return true;
    });

    return (
        <PublicLayout>
            <Head title="Riwayat Transaksi" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Banner Header */}
                <div className="relative mb-12 rounded-[2.5rem] overflow-hidden bg-ink border border-white/10 p-8 md:p-12">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/20 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full mb-4 border border-white/10">
                                <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                    Aktivitas Keuangan
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                Riwayat{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-ink">
                                    Transaksi
                                </span>
                            </h1>
                            <p className="text-cream/75 text-sm mt-2">
                                Pantau seluruh catatan arus kas, dana masuk, dan
                                transaksi keluar dalam satu ringkasan.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-ink px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0"
                        >
                            <Download size={16} /> Cetak Laporan
                        </button>
                    </div>
                </div>

                {/* Summary Cashflow Grid */}
                <div className="grid gap-6 md:grid-cols-[1.2fr,2fr] items-stretch mb-12">
                    {/* Net Cashflow Card */}
                    <div className="bg-cream rounded-[2.5rem] border border-gold-line p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest">
                                    Net Cashflow
                                </span>
                                <div className="w-10 h-10 rounded-xl bg-cream-deep flex items-center justify-center text-gold-ink">
                                    <Wallet size={20} />
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-ink tracking-tight">
                                {formatCurrency(netCashflow)}
                            </h2>
                        </div>

                        <div className="mt-8 pt-6 border-t border-dashed border-gold-line flex items-center gap-2 text-xs font-bold text-ink-soft">
                            <Clock size={16} className="text-gold-ink" />
                            <span>Diperbarui secara otomatis (Realtime)</span>
                        </div>
                    </div>

                    {/* In / Out Summary Card */}
                    <div className="bg-cream rounded-[2.5rem] border border-gold-line p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-grow">
                            <div>
                                <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mb-2 flex items-center gap-1">
                                    <TrendingUp
                                        size={14}
                                        className="text-emerald-600"
                                    />{" "}
                                    Total Masuk
                                </span>
                                <h3 className="text-xl font-black text-emerald-600">
                                    {formatCurrency(totalIn)}
                                </h3>
                            </div>

                            <div>
                                <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mb-2 flex items-center gap-1">
                                    <TrendingDown
                                        size={14}
                                        className="text-rose-600"
                                    />{" "}
                                    Total Keluar
                                </span>
                                <h3 className="text-xl font-black text-rose-600">
                                    {formatCurrency(totalOut)}
                                </h3>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mb-2 flex items-center gap-1">
                                    <History
                                        size={14}
                                        className="text-gold-ink"
                                    />{" "}
                                    Total Catatan
                                </span>
                                <h3 className="text-xl font-black text-ink">
                                    {transactions.length}{" "}
                                    <span className="text-xs font-bold text-ink-soft uppercase">
                                        Transaksi
                                    </span>
                                </h3>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-dashed border-gold-line">
                            <span className="text-xs font-bold text-ink-soft">
                                Status Sinkronisasi
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-emerald-700">
                                    Aktif
                                </span>
                                <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div>
                        <h3 className="text-xl font-black text-ink">
                            Daftar Transaksi
                        </h3>
                        <p className="text-xs font-bold text-ink-soft uppercase tracking-widest">
                            Menampilkan {filteredTransactions.length} dari{" "}
                            {transactions.length} Data
                        </p>
                    </div>

                    <div className="flex gap-2 bg-cream p-1.5 rounded-2xl border border-gold-line">
                        <button
                            type="button"
                            onClick={() => setFilter("ALL")}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                filter === "ALL"
                                    ? "bg-ink text-cream shadow-md"
                                    : "text-ink-soft hover:text-ink"
                            }`}
                        >
                            Semua
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter("IN")}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                filter === "IN"
                                    ? "bg-emerald-600 text-white shadow-md"
                                    : "text-ink-soft hover:text-ink"
                            }`}
                        >
                            Masuk (IN)
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter("OUT")}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                filter === "OUT"
                                    ? "bg-rose-600 text-white shadow-md"
                                    : "text-ink-soft hover:text-ink"
                            }`}
                        >
                            Keluar (OUT)
                        </button>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="grid gap-4">
                    {filteredTransactions && filteredTransactions.length > 0 ? (
                        filteredTransactions.map((item) => (
                            <TransactionItem key={item.id} item={item} />
                        ))
                    ) : (
                        <div className="text-center py-16 bg-cream rounded-[2.5rem] border-2 border-dashed border-gold-line">
                            <History
                                size={32}
                                className="mx-auto text-ink-soft mb-3 opacity-50"
                            />
                            <p className="text-ink-soft text-sm font-bold">
                                Tidak ada riwayat transaksi yang ditemukan.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
