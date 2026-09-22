import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Wallet,
    TrendingUp,
    Coins,
    Building2,
    MapPin,
    Share2,
    History,
    ArrowUpRight,
    ArrowRight,
    Layers,
    Percent,
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

function getPropertyImageUrl(property) {
    const img = property?.images?.[0];
    if (img?.image_url) {
        return `/storage/${img.image_url}`;
    }
    return `https://placehold.co/600x400?text=${encodeURIComponent(
        property?.property_name || property?.name || "Properti",
    )}`;
}

function PropertyCard({ prop }) {
    const property = prop.ip?.property || prop.property;
    const propertyName =
        property?.property_name || property?.name || "Properti Proyek";
    const propertyLocation =
        property?.property_location ||
        property?.location ||
        "Lokasi Tidak Tersedia";
    const totalIpLot = prop.ip?.total_lot || property?.total_lots || 1;
    const sharePercent = ((prop.total_lot / totalIpLot) * 100).toFixed(1);

    return (
        <div className="bg-cream rounded-[2rem] border border-gold-line p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-gold transition-all">
            <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Gambar & Judul */}
                <div className="flex items-center gap-5 w-full lg:w-1/3">
                    <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-cream-deep border border-gold-line/50">
                        <img
                            src={getPropertyImageUrl(property)}
                            alt={propertyName}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-1 text-xs font-bold text-gold-ink mb-1">
                            <MapPin size={14} />
                            <span>{propertyLocation}</span>
                        </div>
                        <h3 className="text-lg font-black text-ink leading-tight">
                            {propertyName}
                        </h3>
                    </div>
                </div>

                {/* Metrik Data */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-grow w-full border-t lg:border-t-0 lg:border-l border-gold-line/60 pt-6 lg:pt-0 lg:pl-8">
                    <div>
                        <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mb-1">
                            Kepemilikan
                        </span>
                        <h4 className="text-sm font-black text-ink">
                            {prop.total_lot} Lot
                        </h4>
                        <p className="text-[11px] font-semibold text-ink-soft">
                            {sharePercent}% Share
                        </p>

                        <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mt-4 mb-1">
                            Nilai Saat Ini
                        </span>
                        <h4 className="text-sm font-black text-gold-ink">
                            {formatCurrency(prop.total_invested)}
                        </h4>
                    </div>

                    <div>
                        <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mb-1">
                            Status
                        </span>
                        <span
                            className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                                prop.sold
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-emerald-100 text-emerald-800"
                            }`}
                        >
                            {prop.sold ? "Locked" : "Active"}
                        </span>

                        <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mt-4 mb-1">
                            Sewa Terakhir
                        </span>
                        <h4 className="text-sm font-black text-ink">
                            {formatCurrency(prop.last_rent ?? 0)}{" "}
                            <span className="text-emerald-600 text-[10px] font-bold">
                                ({prop.rent_yield ?? 0}%)
                            </span>
                        </h4>
                    </div>

                    <div className="hidden md:block">
                        <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mb-1">
                            Siap Dijual
                        </span>
                        <h4 className="text-sm font-black text-ink">
                            {prop.total_lot} Lot
                        </h4>

                        <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mt-4 mb-1">
                            Total Earning
                        </span>
                        <h4 className="text-sm font-black text-emerald-600">
                            {formatCurrency(prop.total_earned ?? 0)}
                        </h4>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 w-full lg:w-auto min-w-[140px]">
                    <Link
                        href={`/investments/${prop.id}/swap`}
                        className="flex items-center justify-center gap-1.5 bg-ink hover:bg-ink-soft text-cream px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-md"
                    >
                        Swap Lot
                    </Link>
                    <Link
                        href={`/investments/${prop.ip?.property_id || prop.property_id}/sell`}
                        className="flex items-center justify-center gap-1.5 bg-cream hover:bg-cream-deep text-ink border border-gold-line px-4 py-2.5 rounded-xl font-black text-xs transition-all"
                    >
                        Sell Asset
                    </Link>
                </div>
            </div>
        </div>
    );
}

function CrowdfundingCard({ cf }) {
    const property = cf.cp?.property || cf.property;
    const propertyName =
        property?.property_name || property?.name || "Proyek Crowdfunding";
    const propertyLocation =
        property?.property_location ||
        property?.location ||
        "Lokasi Tidak Tersedia";
    const goal = cf.cp?.funding_goal || 1;
    const collected = cf.cp?.collected_amount || 0;
    const fundingProgress = Math.min(100, (collected / goal) * 100).toFixed(1);

    return (
        <div className="bg-cream rounded-[2rem] border border-gold-line p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-gold transition-all">
            <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Gambar & Judul */}
                <div className="flex items-center gap-5 w-full lg:w-1/3">
                    <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-cream-deep border border-gold-line/50">
                        <img
                            src={getPropertyImageUrl(property)}
                            alt={propertyName}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-1 text-xs font-bold text-gold-ink mb-1">
                            <MapPin size={14} />
                            <span>{propertyLocation}</span>
                        </div>
                        <h3 className="text-lg font-black text-ink leading-tight">
                            {propertyName}
                        </h3>
                    </div>
                </div>

                {/* Metrik Data */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-grow w-full border-t lg:border-t-0 lg:border-l border-gold-line/60 pt-6 lg:pt-0 lg:pl-8">
                    <div>
                        <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mb-1">
                            Kontribusi Kamu
                        </span>
                        <h4 className="text-sm font-black text-ink">
                            {formatCurrency(cf.total_amount)}
                        </h4>

                        <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mt-4 mb-1">
                            Estimasi ROI
                        </span>
                        <h4 className="text-sm font-black text-emerald-600">
                            {cf.cp?.estimated_roi ?? 0}%
                        </h4>
                    </div>

                    <div>
                        <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mb-1">
                            Progres Pendanaan
                        </span>
                        <h4 className="text-sm font-black text-gold-ink">
                            {fundingProgress}%
                        </h4>

                        <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mt-4 mb-1">
                            Status
                        </span>
                        <span
                            className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                                cf.cp?.status === "Completed"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                            }`}
                        >
                            {cf.cp?.status || "Active"}
                        </span>
                    </div>

                    <div className="hidden md:block">
                        <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mb-1">
                            Tipe Proyek
                        </span>
                        <h4 className="text-sm font-black text-ink">
                            Crowdfunding
                        </h4>

                        <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mt-4 mb-1">
                            Strategi Exit
                        </span>
                        <h4 className="text-sm font-black text-ink">
                            {cf.cp?.exit_strategy || "Flipping"}
                        </h4>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 w-full lg:w-auto min-w-[140px]">
                    <Link
                        href={`/crowdfunding/${cf.cp?.id || cf.crowdfunding_project_id}`}
                        className="flex items-center justify-center gap-1.5 bg-gold hover:bg-gold/90 text-ink px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-md"
                    >
                        Lihat Detail <ArrowUpRight size={14} />
                    </Link>
                    <Link
                        href={`/crowdfunding/${cf.cp?.id || cf.crowdfunding_project_id}`}
                        className="flex items-center justify-center gap-1.5 bg-cream hover:bg-cream-deep text-ink border border-gold-line px-4 py-2.5 rounded-xl font-black text-xs transition-all"
                    >
                        Tambah Dana
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function Portfolio({
    wallet = { balance: 0 },
    investments = [],
    crowdfundings = [],
    summary = {},
}) {
    const totalInvestmentValue = investments.reduce(
        (sum, item) => sum + Number(item.total_invested || 0),
        0,
    );
    const totalCrowdfundingValue = crowdfundings.reduce(
        (sum, item) => sum + Number(item.total_amount || 0),
        0,
    );
    const totalPortfolioValue =
        summary.total_portfolio_value ??
        totalInvestmentValue + totalCrowdfundingValue;

    return (
        <PublicLayout>
            <Head title="Portofolio Aset Saya" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Banner Header */}
                <div className="relative mb-12 rounded-[2.5rem] overflow-hidden bg-ink border border-white/10 p-8 md:p-12">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/20 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full mb-4 border border-white/10">
                                <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                    Ikhtisar Portofolio
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                Aset &{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-ink">
                                    Investasi Saya
                                </span>
                            </h1>
                            <p className="text-cream/75 text-sm mt-2">
                                Kelola kepemilikan lot properti, pendanaan
                                crowdfunding, dan arus kas portofolio kamu.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Balance & Overview Metrics */}
                <div className="grid gap-6 md:grid-cols-[1.2fr,2fr] items-stretch mb-12">
                    {/* Balance Card */}
                    <div className="bg-cream rounded-[2.5rem] border border-gold-line p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest">
                                    Saldo Dompet
                                </span>
                                <div className="w-10 h-10 rounded-xl bg-cream-deep flex items-center justify-center text-gold-ink">
                                    <Wallet size={20} />
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-ink tracking-tight">
                                {formatCurrency(wallet?.balance)}
                            </h2>
                        </div>

                        <div className="mt-8">
                            <Link
                                href="/wallet/withdraw"
                                className="flex items-center justify-center gap-2 w-full bg-ink hover:bg-ink-soft text-cream py-3.5 rounded-2xl font-black text-sm transition-all shadow-md"
                            >
                                Penarikan Dana <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Summary Metrics */}
                    <div className="bg-cream rounded-[2.5rem] border border-gold-line p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
                        <div className="grid grid-cols-2 gap-6 flex-grow">
                            <div>
                                <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mb-1">
                                    Nilai Akun Portofolio
                                </span>
                                <h3 className="text-xl font-black text-ink">
                                    {formatCurrency(totalPortfolioValue)}
                                </h3>
                            </div>

                            <div>
                                <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mb-1">
                                    Total Sewa Diterima
                                </span>
                                <h3 className="text-xl font-black text-emerald-600">
                                    {formatCurrency(
                                        summary.total_rent_earned ?? 0,
                                    )}
                                </h3>
                            </div>

                            <div>
                                <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mb-1">
                                    Total Nilai Properti
                                </span>
                                <h3 className="text-xl font-black text-ink">
                                    {formatCurrency(
                                        summary.total_property_value ??
                                            totalPortfolioValue,
                                    )}
                                </h3>
                            </div>

                            <div>
                                <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest block mb-1">
                                    Unit Dikuasai
                                </span>
                                <h3 className="text-xl font-black text-ink">
                                    {investments.length + crowdfundings.length}{" "}
                                    <span className="text-xs font-bold text-ink-soft uppercase">
                                        Unit
                                    </span>
                                </h3>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-8 pt-6 border-t border-dashed border-gold-line">
                            <button
                                type="button"
                                onClick={() =>
                                    navigator.clipboard?.writeText(
                                        window.location.href,
                                    )
                                }
                                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-cream hover:bg-cream-deep border border-gold-line text-ink px-6 py-2.5 rounded-xl font-black text-xs transition-all"
                            >
                                <Share2 size={14} /> Bagikan Portofolio
                            </button>
                            <Link
                                href="/transaction"
                                className="flex items-center justify-center gap-1.5 text-xs font-bold text-gold-ink hover:text-ink transition-colors"
                            >
                                <History size={14} /> Riwayat Transaksi
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Investasi Lot Properti */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-black text-ink">
                                Investasi Lot Properti
                            </h3>
                            <p className="text-xs font-bold text-ink-soft uppercase tracking-widest">
                                {investments.length} Aset Lot Aktif
                            </p>
                        </div>
                        <Link
                            href="/investments"
                            className="flex items-center gap-1 text-xs font-bold text-gold-ink hover:text-ink transition-colors"
                        >
                            Cari Properti <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid gap-6 grid-cols-1">
                        {investments && investments.length > 0 ? (
                            investments.map((prop) => (
                                <PropertyCard key={prop.id} prop={prop} />
                            ))
                        ) : (
                            <div className="text-center py-12 bg-cream rounded-[2rem] border-2 border-dashed border-gold-line">
                                <p className="text-ink-soft text-sm font-medium">
                                    Belum ada investasi lot properti.
                                </p>
                                <Link
                                    href="/property-for-sale"
                                    className="text-gold-ink font-black text-xs uppercase tracking-wider mt-2 inline-block hover:underline"
                                >
                                    Jelajahi Properti →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Proyek Crowdfunding */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-black text-ink">
                                Proyek Crowdfunding
                            </h3>
                            <p className="text-xs font-bold text-ink-soft uppercase tracking-widest">
                                {crowdfundings.length} Proyek Didanai
                            </p>
                        </div>
                        <Link
                            href="/crowdfunding"
                            className="flex items-center gap-1 text-xs font-bold text-gold-ink hover:text-ink transition-colors"
                        >
                            Cari Properti <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid gap-6 grid-cols-1">
                        {crowdfundings && crowdfundings.length > 0 ? (
                            crowdfundings.map((cf) => (
                                <CrowdfundingCard key={cf.id} cf={cf} />
                            ))
                        ) : (
                            <div className="text-center py-12 bg-cream rounded-[2rem] border-2 border-dashed border-gold-line">
                                <p className="text-ink-soft text-sm font-medium">
                                    Belum ada proyek crowdfunding yang kamu
                                    ikuti.
                                </p>
                                <Link
                                    href="/crowdfunding"
                                    className="text-gold-ink font-black text-xs uppercase tracking-wider mt-2 inline-block hover:underline"
                                >
                                    Jelajahi Crowdfunding →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
