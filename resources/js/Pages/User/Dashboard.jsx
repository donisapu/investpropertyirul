import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
  Wallet,
  TrendingUp,
  Coins,
  Building2,
  ArrowRight,
  History,
  PlusCircle,
  Search,
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

export default function Dashboard({
  totalAssetValue = 0,
  totalInvested = 0,
  totalReturn = 0,
  availableBalance = 0,
  activeInvestments = [],
  recentTransactions = [],
}) {
  return (
    <PublicLayout>
      <Head title="Dashboard Portfolio" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner Header */}
        <div className="relative mb-12 rounded-[2.5rem] overflow-hidden bg-ink border border-white/10 p-8 md:p-12">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full mb-4 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  Ringkasan Portofolio
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Dashboard{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-ink">
                  Investasi
                </span>
              </h1>
              <p className="text-cream/75 text-sm mt-2">
                Pantau perkembangan aset, return, dan riwayat transaksi kamu di satu tempat.
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Summary Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Asset Value */}
          <div className="bg-cream rounded-[2rem] p-6 border border-gold-line shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest">
                Total Asset Value
              </span>
              <div className="w-10 h-10 rounded-xl bg-cream-deep flex items-center justify-center text-gold-ink">
                <Building2 size={20} />
              </div>
            </div>
            <h2 className="text-2xl font-black text-ink">
              {formatCurrency(totalAssetValue)}
            </h2>
          </div>

          {/* Total Invested */}
          <div className="bg-cream rounded-[2rem] p-6 border border-gold-line shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest">
                Total Invested
              </span>
              <div className="w-10 h-10 rounded-xl bg-cream-deep flex items-center justify-center text-gold-ink">
                <Coins size={20} />
              </div>
            </div>
            <h2 className="text-2xl font-black text-ink">
              {formatCurrency(totalInvested)}
            </h2>
          </div>

          {/* Total Return */}
          <div className="bg-cream rounded-[2rem] p-6 border border-gold-line shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest">
                Total Return
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <TrendingUp size={20} />
              </div>
            </div>
            <h2 className="text-2xl font-black text-emerald-600">
              {formatCurrency(totalReturn)}
            </h2>
          </div>

          {/* Available Balance (Wallet) */}
          <div className="bg-cream rounded-[2rem] p-6 border border-gold-line shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest">
                Available Balance
              </span>
              <div className="w-10 h-10 rounded-xl bg-cream-deep flex items-center justify-center text-gold-ink">
                <Wallet size={20} />
              </div>
            </div>
            <h2 className="text-2xl font-black text-ink">
              {formatCurrency(availableBalance)}
            </h2>
          </div>
        </div>

        {/* Active Investments */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-ink">Active Investments</h3>
              <p className="text-xs font-bold text-ink-soft uppercase tracking-widest">
                Investasi Aktif Milikmu
              </p>
            </div>
            <Link
              href="/user/portfolio"
              className="flex items-center gap-1 text-xs font-bold text-gold-ink hover:text-ink transition-colors"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {activeInvestments && activeInvestments.length > 0 ? (
              activeInvestments.map((inv) => {
                // Sesuai relasi Eloquent: inv.property.name atau inv.property_name
                const propertyName = inv.property?.name || inv.property_name || "Properti Proyek";
                const totalLot = Number(inv.total_lot || inv.lots || 0);
                const grandTotalLot = Number(inv.grand_total_lot || inv.property?.total_lots || 1);
                const percentage = grandTotalLot > 0 ? ((totalLot / grandTotalLot) * 100).toFixed(2) : 0;
                const investedAmount = inv.amount || inv.total_price || 0;

                return (
                  <div
                    key={inv.id}
                    className="bg-cream rounded-[2rem] p-6 border border-gold-line shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-gold transition-all"
                  >
                    <h4 className="font-black text-ink text-lg">{propertyName}</h4>
                    <p className="text-xs font-bold text-ink-soft mt-1">
                      Kepemilikan: {totalLot} Lot • {percentage}%
                    </p>

                    <div className="mt-4 pt-4 border-t border-dashed border-gold-line flex justify-between items-center text-sm">
                      <span className="text-xs font-bold text-ink-soft uppercase tracking-wider">
                        Total Invested
                      </span>
                      <span className="font-black text-gold-ink">
                        {formatCurrency(investedAmount)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-12 bg-cream rounded-[2rem] border-2 border-dashed border-gold-line">
                <p className="text-ink-soft text-sm font-medium">
                  Belum ada investasi aktif.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-ink">Recent Transactions</h3>
              <p className="text-xs font-bold text-ink-soft uppercase tracking-widest">
                Aktivitas Terakhir
              </p>
            </div>
            <Link
              href="/user/transaction"
              className="flex items-center gap-1 text-xs font-bold text-gold-ink hover:text-ink transition-colors"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-cream rounded-[2rem] border border-gold-line shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden p-2">
            <div className="divide-y divide-gold-line/60">
              {recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.map((trx) => {
                  const isPositive =
                    trx.type === "SELL" ||
                    trx.type === "DEPOSIT" ||
                    trx.type === "ROI" ||
                    trx.type === "IN";

                  const labelText = trx.description || trx.label || trx.type;

                  return (
                    <div key={trx.id} className="p-4 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cream-deep flex items-center justify-center text-ink-soft">
                          <History size={16} />
                        </div>
                        <div>
                          <span className="font-bold text-ink block">{labelText}</span>
                          <span className="text-[10px] font-semibold text-ink-soft uppercase">
                            {trx.type}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`font-black ${
                          isPositive ? "text-emerald-600" : "text-ink"
                        }`}
                      >
                        {isPositive ? "+" : "-"} {formatCurrency(trx.amount)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-sm font-medium text-ink-soft">
                  Belum ada riwayat transaksi.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Link
            href="/property-for-sale"
            className="flex items-center justify-center gap-2 bg-ink hover:bg-ink-soft text-cream py-4 rounded-2xl font-black text-sm transition-all shadow-lg hover:shadow-gold/20"
          >
            <Search size={16} /> Explore Properties
          </Link>

          <Link
            href="/crowdfunding"
            className="flex items-center justify-center gap-2 bg-cream hover:bg-cream-deep border border-gold-line text-ink py-4 rounded-2xl font-black text-sm transition-all"
          >
            <Building2 size={16} /> Join Crowdfunding
          </Link>

          <Link
            href="/my-bids"
            className="flex items-center justify-center gap-2 bg-cream hover:bg-cream-deep border border-gold-line text-ink py-4 rounded-2xl font-black text-sm transition-all"
          >
            <Coins size={16} /> View My Bids
          </Link>

          <Link
            href="/wallet"
            className="flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-ink py-4 rounded-2xl font-black text-sm transition-all shadow-md"
          >
            <PlusCircle size={16} /> Deposit Funds
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
