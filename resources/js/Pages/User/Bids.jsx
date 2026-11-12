import React, { useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Ban, Clock, Flag, Gavel, Lock, PauseCircle, Search, ShieldCheck, TrendingUp, Trophy, Wallet, BadgeCheck, CircleAlert } from "lucide-react";
import PublicLayout from "@/Layouts/PublicLayout";
import { formatRupiah } from "@/lib/money";

const dateTime = (iso) =>
    iso ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(iso)) + " WIB" : "-";

const tones = {
    success: "bg-status-success-bg text-status-success",
    danger: "bg-status-danger-bg text-status-danger",
    warn: "bg-status-warn-bg text-status-warn",
    neutral: "bg-cream-sink text-ink-soft",
};

const isLeading = (item) => item.state === "bidding" && item.top_is_mine;
const isOutbid = (item) => item.state === "bidding" && !!item.my_last_bid && !item.top_is_mine;

/** One row of My Bids, from the auction page state (AuctionService::stateFor). */
function describe(item) {
    const leading = isLeading(item);
    const outbid = isOutbid(item);
    const deposit = item.deposit?.amount ? formatRupiah(item.deposit.amount) : "-";
    const opensLater = item.opens_at && new Date(item.opens_at) > new Date();

    const map = {
        deposit_pending: {
            badge: ["warn", Clock, "Menunggu deposit"],
            line: `Bayar sebelum ${dateTime(item.deposit?.expires_at)}`,
            rows: [["Nilai limit", formatRupiah(item.open_bid)], ["Deposit", deposit]],
            cta: ["primary", Lock, "Bayar deposit", item.deposit?.invoice_url, true],
            group: ["live", "action"],
        },
        // The last invoice lapsed while the auction still takes deposits.
        deposit: {
            badge: ["warn", Clock, "Deposit belum dibayar"],
            line: `Batas deposit ${dateTime(item.deposit_deadline)}`,
            rows: [["Nilai limit", formatRupiah(item.open_bid)], ["Deposit", formatRupiah(item.deposit_amount)]],
            cta: ["primary", Lock, "Bayar deposit"],
            group: ["live", "action"],
        },
        deposit_closed: {
            badge: ["neutral", Clock, "Deposit ditutup"],
            line: `Ditutup ${dateTime(item.closes_at)}`,
            rows: [["Deposit", "Tidak dibayar"]],
            cta: ["ghost", null, "Lihat lelang"],
            group: ["live"],
        },
        ready: {
            badge: ["neutral", ShieldCheck, opensLater ? "Siap menawar" : "Menunggu hasil"],
            line: opensLater ? `Dibuka ${dateTime(item.opens_at)}` : `Ditutup ${dateTime(item.closes_at)}`,
            rows: [["Nilai limit", formatRupiah(item.open_bid)], ["Deposit", "Diterima"]],
            cta: ["ghost", null, "Lihat lelang"],
            group: ["live"],
        },
        bidding: {
            badge: leading ? ["success", Trophy, "Unggul"] : outbid ? ["danger", TrendingUp, "Tersalip"] : ["neutral", Gavel, "Belum menawar"],
            line: `Ditutup ${dateTime(item.closes_at)}`,
            rows: [
                ["Penawaranmu", item.my_last_bid ? formatRupiah(item.my_last_bid) : "-"],
                ["Tertinggi", item.top_bid ? formatRupiah(item.top_bid) : "-"],
                ["Deposit", "Diterima"],
            ],
            cta: leading ? ["ghost", null, "Lihat lelang"] : ["primary", Gavel, outbid ? "Tawar lagi" : "Ajukan penawaran"],
            group: outbid || !item.my_last_bid ? ["live", "action"] : ["live"],
        },
        won: {
            badge: ["success", Trophy, "Menang · belum lunas"],
            line: `Lunasi sebelum ${dateTime(item.settlement?.due_at)}`,
            rows: [
                ["Harga menang", formatRupiah(item.settlement?.price)],
                ["Deposit", `− ${formatRupiah(item.settlement?.deposit_amount)}`],
                ["Sisa pelunasan", formatRupiah(item.settlement?.amount)],
            ],
            cta: ["primary", Wallet, "Bayar pelunasan"],
            group: ["action"],
        },
        paid: {
            badge: ["success", BadgeCheck, "Lunas"],
            line: `Dibayar ${dateTime(item.settlement?.paid_at)}`,
            rows: [["Harga menang", formatRupiah(item.settlement?.price)], ["Deposit", "Dipotong dari harga"]],
            cta: ["ghost", null, "Lihat lelang"],
            group: ["done"],
        },
        default: {
            badge: ["danger", CircleAlert, "Gagal bayar"],
            line: `Batas pelunasan ${dateTime(item.settlement?.due_at)} terlewat`,
            rows: [["Harga menang", formatRupiah(item.settlement?.price)], ["Deposit", "Hangus"]],
            cta: ["ghost", null, "Lihat lelang"],
            group: ["done"],
        },
        lost: {
            badge: ["neutral", Flag, "Tidak menang"],
            line: `Ditutup ${dateTime(item.closes_at)}`,
            rows: [
                ["Penawaranmu", item.my_last_bid ? formatRupiah(item.my_last_bid) : "-"],
                ["Harga akhir", item.top_bid ? formatRupiah(item.top_bid) : "-"],
                ["Deposit", "Kembali ke saldo"],
            ],
            cta: ["ghost", Wallet, "Lihat saldo", route("user.wallet")],
            group: ["done"],
        },
        cancelled: {
            badge: ["neutral", Ban, "Dibatalkan"],
            line: item.cancel_reason || "Dibatalkan oleh admin",
            rows: [["Deposit", item.deposit?.paid_at ? "Kembali ke saldo" : "-"]],
            cta: ["ghost", null, "Lihat lelang"],
            group: ["done"],
        },
        draft: {
            badge: ["neutral", PauseCircle, "Belum dipublikasikan"],
            line: "Lelang sedang disiapkan ulang oleh admin",
            rows: [["Deposit", item.deposit?.status === "paid" ? "Ditahan" : "-"]],
            cta: ["ghost", null, "Lihat lelang"],
            group: ["live"],
        },
        suspended: {
            badge: ["warn", PauseCircle, "Ditangguhkan"],
            line: "Penawaran dihentikan sementara",
            rows: [["Deposit", item.deposit?.status === "paid" ? "Ditahan" : "-"]],
            cta: ["ghost", null, "Lihat lelang"],
            group: ["live"],
        },
    };

    return (
        map[item.state] ?? {
            badge: ["neutral", Flag, "Selesai"],
            line: `Ditutup ${dateTime(item.closes_at)}`,
            rows: [["Deposit", deposit]],
            cta: ["ghost", null, "Lihat lelang"],
            group: ["done"],
        }
    );
}

const TABS = [
    ["all", "Semua"],
    ["live", "Berlangsung"],
    ["action", "Perlu tindakan"],
    ["done", "Selesai"],
];

export default function Bids({ items = [], held = { amount: 0, auctions: 0 } }) {
    const [tab, setTab] = useState("all");
    const rows = useMemo(() => items.map((item) => ({ item, view: describe(item) })), [items]);
    const shown = tab === "all" ? rows : rows.filter((r) => r.view.group.includes(tab));
    const leading = items.filter(isLeading).length;
    const outbid = items.filter(isOutbid).length;

    const stats = [
        ["Lelang diikuti", items.length, ""],
        ["Sedang unggul", leading, "text-status-success"],
        ["Tersalip", outbid, "text-status-danger"],
    ];

    return (
        <PublicLayout>
            <Head title="My Bids" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[1.3px] text-gold-ink">Akun saya</p>
                        <h1 className="mt-1 text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold tracking-[-0.02em] text-ink">My Bids</h1>
                        <p className="mt-1 text-[14px] text-ink-soft">Semua lelang &amp; cessie yang kamu ikuti, status deposit, dan posisi penawaranmu.</p>
                    </div>
                    <Link href={route("auctions.index")} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-bold text-cream">
                        <Search size={16} aria-hidden="true" /> Cari lelang
                    </Link>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {stats.map(([label, value, tone]) => (
                        <div key={label} className="rounded-3xl border border-gold-line bg-paper p-5">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">{label}</p>
                            <p className={`mt-2 text-2xl font-extrabold ${tone || "text-ink"}`}>{value}</p>
                        </div>
                    ))}
                    <div className="rounded-3xl border border-gold-line bg-paper p-5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">Deposit tertahan</p>
                        <p className="mt-2 text-xl font-extrabold text-ink tabular-nums">{formatRupiah(held.amount)}</p>
                        <p className="mt-0.5 text-[11px] text-ink-soft">di lelang yang belum selesai</p>
                    </div>
                </div>

                <div role="tablist" aria-label="Filter" className="mt-8 flex flex-wrap gap-2">
                    {TABS.map(([key, label]) => (
                        <button
                            key={key}
                            role="tab"
                            aria-selected={tab === key}
                            onClick={() => setTab(key)}
                            className={`rounded-full px-4 py-2 text-[13px] font-bold transition ${tab === key ? "bg-ink text-cream" : "border border-gold-line text-ink hover:border-ink"}`}
                        >
                            {label}
                            <span className="ml-1.5 tabular-nums opacity-70">
                                {key === "all" ? rows.length : rows.filter((r) => r.view.group.includes(key)).length}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="mt-5 space-y-4">
                    {shown.map(({ item, view }) => {
                        const [tone, Icon, label] = view.badge;
                        const [kind, CtaIcon, ctaLabel, ctaHref, external] = view.cta;
                        const CtaTag = external && ctaHref ? "a" : Link;
                        const ended = view.group.includes("done");
                        return (
                            <article key={item.id} className="flex flex-col gap-5 rounded-3xl border border-gold-line bg-paper p-5 md:flex-row md:items-center">
                                {item.image ? (
                                    <img className={`h-28 w-full flex-none rounded-2xl object-cover md:w-40 ${ended ? "grayscale" : ""}`} src={item.image} alt="" />
                                ) : (
                                    <div className="h-28 w-full flex-none rounded-2xl bg-cream-sink md:w-40" />
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-cream-sink px-2.5 py-1 text-[11px] font-bold text-ink-soft">{item.type_label}</span>
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[tone]}`}>
                                            <Icon size={12} aria-hidden="true" /> {label}
                                        </span>
                                    </div>
                                    <h3 className="mt-2 truncate text-[17px] font-extrabold text-ink">{item.name}</h3>
                                    <p className="text-[13px] text-ink-soft">
                                        {item.location} · {view.line}
                                    </p>
                                </div>
                                <dl className="grid flex-none grid-cols-2 gap-x-6 gap-y-1 text-[13px] md:w-[300px]">
                                    {view.rows.map(([k, v]) => (
                                        <React.Fragment key={k}>
                                            <dt className="text-ink-soft">{k}</dt>
                                            <dd className="text-right font-extrabold text-ink tabular-nums">{v}</dd>
                                        </React.Fragment>
                                    ))}
                                </dl>
                                <CtaTag
                                    href={ctaHref || route("auctions.show", item.id)}
                                    className={`flex flex-none items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-5 py-3 text-[13px] font-bold md:w-44 ${
                                        kind === "primary" ? "bg-ink text-cream hover:bg-gold-ink" : "border border-gold-line text-ink hover:border-ink"
                                    }`}
                                >
                                    {CtaIcon && <CtaIcon size={16} aria-hidden="true" />} {ctaLabel}
                                </CtaTag>
                            </article>
                        );
                    })}

                    {shown.length === 0 && (
                        <div className="rounded-3xl border border-dashed border-gold-line py-14 text-center">
                            <Gavel size={40} className="mx-auto text-ink-soft/40" aria-hidden="true" />
                            <p className="mt-3 font-bold text-ink">{items.length ? "Tidak ada lelang di filter ini" : "Kamu belum ikut lelang"}</p>
                            <p className="mt-1 text-[13px] text-ink-soft">Bayar deposit di halaman lelang untuk mulai menawar.</p>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
