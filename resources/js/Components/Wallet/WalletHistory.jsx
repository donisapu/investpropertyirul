import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, RotateCcw, TrendingUp } from "lucide-react";
import StatusBadge from "@/Components/Wallet/StatusBadge";
import { formatShortDate, formatSignedRupiah } from "@/lib/money";

const FILTERS = [
    { key: "all", label: "Semua", match: () => true },
    { key: "withdraw", label: "Penarikan", match: (r) => r.kind === "withdraw" || r.kind === "refund" },
    { key: "profit", label: "Bagi hasil", match: (r) => r.kind === "profit" },
];

const ICONS = {
    withdraw: ArrowUpRight,
    refund: RotateCcw,
    payment_refund: RotateCcw,
    profit: TrendingUp,
    sell: ArrowDownLeft,
};

export default function WalletHistory({ rows = [], onFixAccount }) {
    const [filter, setFilter] = useState("all");
    const visible = useMemo(
        () => rows.filter(FILTERS.find((f) => f.key === filter).match),
        [rows, filter],
    );

    return (
        <section aria-labelledby="wallet-history-title" className="overflow-hidden rounded-[20px] border border-gold-line bg-paper">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-6">
                <h2 id="wallet-history-title" className="text-[15px] font-extrabold text-ink">
                    Riwayat wallet
                </h2>
                <div role="group" aria-label="Filter riwayat" className="flex gap-0.5 rounded-[9px] bg-cream-deep p-[3px]">
                    {FILTERS.map((f) => (
                        <button
                            key={f.key}
                            type="button"
                            aria-pressed={filter === f.key}
                            onClick={() => setFilter(f.key)}
                            className={`rounded-[7px] px-2.5 py-[5px] text-xs transition-colors ${
                                filter === f.key ? "bg-paper font-bold text-ink shadow-sm" : "font-semibold text-ink-soft hover:text-ink"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {visible.length === 0 ? (
                <p className="border-t border-gold-line px-6 py-10 text-center text-sm text-ink-soft">
                    {rows.length === 0 ? "Belum ada transaksi di wallet kamu." : "Tidak ada transaksi untuk filter ini."}
                </p>
            ) : (
                <ul role="list">
                    {visible.map((row) => {
                        const Icon = ICONS[row.kind] || ArrowDownLeft;
                        const danger = row.status?.tone === "danger";
                        return (
                            <li key={row.id} className="flex items-center gap-3.5 border-t border-gold-line px-5 py-4 sm:px-6">
                                <span
                                    aria-hidden="true"
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${
                                        danger ? "bg-status-danger-bg text-status-danger" : "bg-cream-deep text-ink"
                                    }`}
                                >
                                    <Icon size={16} />
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[13px] font-bold text-ink">{row.title}</p>
                                    <p className={`truncate text-xs font-medium ${danger ? "text-status-danger" : "text-ink-soft"}`}>
                                        {[formatShortDate(row.date), row.subtitle].filter(Boolean).join(" · ")}
                                    </p>
                                </div>

                                {row.fix_account && (
                                    <button
                                        type="button"
                                        onClick={onFixAccount}
                                        className="hidden shrink-0 rounded-lg border border-gold-edge px-2.5 py-1.5 text-[11px] font-bold text-ink hover:border-ink sm:inline-flex"
                                    >
                                        Perbaiki rekening
                                    </button>
                                )}

                                <div className="flex shrink-0 flex-col items-end gap-1">
                                    <span
                                        className={`text-sm font-extrabold tabular-nums ${
                                            row.amount > 0 ? "text-status-success" : "text-ink"
                                        }`}
                                    >
                                        {formatSignedRupiah(row.amount)}
                                    </span>
                                    <StatusBadge status={row.status} />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
