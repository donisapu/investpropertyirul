import React, { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import {
    Ban,
    BadgeCheck,
    CalendarClock,
    CircleAlert,
    Clock,
    ExternalLink,
    Flag,
    Gavel,
    Lock,
    LogIn,
    MessageCircle,
    PauseCircle,
    ShieldCheck,
    TrendingUp,
    Trophy,
    Undo2,
    Wallet,
    X,
} from "lucide-react";

const rupiah = (value) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value || 0);

const dateTime = (iso) =>
    iso
        ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(iso)) + " WIB"
        : "-";

const percent = (value) => `${Number(value).toLocaleString("id-ID", { maximumFractionDigits: 2 })}%`;

const UNITS = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];

/** Rupiah in words (C10: catch a typo such as an extra zero before the bid is sent). */
export function terbilang(n) {
    n = Math.floor(Math.abs(n));
    if (n < 12) return UNITS[n];
    if (n < 20) return `${terbilang(n - 10)} belas`;
    if (n < 100) return `${terbilang(Math.floor(n / 10))} puluh ${terbilang(n % 10)}`.trim();
    if (n < 200) return `seratus ${terbilang(n - 100)}`.trim();
    if (n < 1000) return `${terbilang(Math.floor(n / 100))} ratus ${terbilang(n % 100)}`.trim();
    if (n < 2000) return `seribu ${terbilang(n - 1000)}`.trim();
    const scales = [
        [1e12, "triliun"],
        [1e9, "miliar"],
        [1e6, "juta"],
        [1e3, "ribu"],
    ];
    for (const [size, word] of scales) {
        if (n >= size) return `${terbilang(Math.floor(n / size))} ${word} ${terbilang(n % size)}`.trim();
    }
    return "";
}

function useCountdown(target) {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        if (!target) return undefined;
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, [target]);
    const left = Math.max(0, (target ? new Date(target).getTime() : 0) - now);
    const s = Math.floor(left / 1000);
    return { done: left === 0, parts: [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60] };
}

function Notice({ tone = "neutral", icon: Icon, title, children }) {
    const tones = {
        neutral: "bg-cream-sink text-ink border-gold-line",
        success: "bg-green-50 text-green-800 border-green-200",
        warn: "bg-amber-50 text-amber-800 border-amber-200",
        danger: "bg-red-50 text-red-800 border-red-200",
    };
    return (
        <div className={`rounded-2xl border p-4 ${tones[tone]}`} role="status">
            <p className="flex items-center gap-2 text-[13px] font-extrabold">
                {Icon && <Icon size={16} aria-hidden="true" />} {title}
            </p>
            {children && <div className="mt-1 text-[12px] leading-relaxed">{children}</div>}
        </div>
    );
}

const Rows = ({ rows }) => (
    <div className="space-y-2.5 rounded-2xl bg-cream-sink p-4 text-sm">
        {rows.map(([label, value, strong]) => (
            <div key={label} className="flex justify-between gap-4">
                <span className={strong ? "font-extrabold text-ink" : "text-ink-soft font-medium"}>{label}</span>
                <span className="font-bold text-ink tabular-nums text-right">{value}</span>
            </div>
        ))}
    </div>
);

const primary =
    "w-full bg-ink hover:bg-gold-ink text-cream font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50";
const ghost =
    "w-full border border-gold-line hover:border-ink text-ink font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2";

function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" role="dialog" aria-modal="true" aria-labelledby="auction-modal-title">
            <div className="w-full max-w-md rounded-[2rem] bg-cream p-7 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                    <h2 id="auction-modal-title" className="text-xl font-extrabold text-ink">{title}</h2>
                    <button type="button" onClick={onClose} aria-label="Tutup" className="text-ink-soft hover:text-ink">
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

/**
 * The participation card on an auction page (USE-CASES.md §C, mockups/gainproperties/lelang.html).
 * `p` comes from AuctionService::stateFor.
 */
export default function AuctionPanel({ p, auctionId, typeLabel, whatsappUrl }) {
    const { errors, flash } = usePage().props;
    const [modal, setModal] = useState(null); // "deposit" | "bid"
    const [sending, setSending] = useState(false);
    const [amount, setAmount] = useState(p.minimum_bid);
    const upcoming = ["upcoming"].includes(p.status) || (p.status === "active" && new Date(p.opens_at) > new Date());
    const running = ["deposit", "deposit_pending", "bidding", "ready", "deposit_closed"].includes(p.state) && !upcoming;
    const countdown = useCountdown(upcoming ? p.opens_at : running ? p.closes_at : null);
    const outbid = p.state === "bidding" && p.my_last_bid && !p.top_is_mine;

    useEffect(() => setAmount(p.minimum_bid), [p.minimum_bid]);

    const post = (name, data = {}) =>
        router.post(route(name, auctionId), data, {
            preserveScroll: true,
            onStart: () => setSending(true),
            onFinish: () => setSending(false),
            onSuccess: () => setModal(null),
            onError: () => setModal(null),
        });

    const ended = ["won", "paid", "default", "lost", "finished"].includes(p.state);
    const headline = ended
        ? ["Harga akhir", p.settlement?.price ?? p.top_bid ?? p.open_bid]
        : p.top_bid && !upcoming
          ? ["Penawaran tertinggi", p.top_bid]
          : ["Nilai limit", p.open_bid];

    const depositRows = [
        ["Nilai limit", rupiah(p.open_bid)],
        [`Deposit (${percent(p.deposit_percent)})`, rupiah(p.deposit_amount)],
    ];
    const error = errors?.deposit || errors?.bid || errors?.settlement || errors?.bid_amount;
    const canAct = p.viewer === "buyer";

    return (
        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <div className="bg-ink p-7 text-cream">
                <p className="text-[11px] font-bold uppercase tracking-[1.3px] text-cream/60">{headline[0]}</p>
                <p className="mt-1 text-[30px] font-extrabold tracking-[-0.02em] text-gold tabular-nums">{rupiah(headline[1])}</p>
                {(upcoming || running) && (
                    <>
                        <p className="mt-4 text-[11px] font-bold uppercase tracking-[1.3px] text-cream/60">{upcoming ? "Dibuka dalam" : "Ditutup dalam"}</p>
                        <div className="mt-2 grid grid-cols-4 gap-2 text-center" aria-live="off">
                            {countdown.parts.map((v, i) => (
                                <div key={i} className="rounded-xl bg-white/10 py-2">
                                    <p className="text-lg font-extrabold tabular-nums">{String(v).padStart(2, "0")}</p>
                                    <p className="text-[10px] text-cream/60">{["hari", "jam", "menit", "detik"][i]}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                <p className="mt-3 text-[12px] text-cream/60">
                    {upcoming ? `Penawaran ${dateTime(p.opens_at)} – ${dateTime(p.closes_at)}` : `Ditutup ${dateTime(p.closes_at)}`}
                    {p.participants > 0 && ` · ${p.participants} peserta`}
                </p>
            </div>

            <div className="space-y-3 p-7">
                {flash?.success && <Notice tone="success" icon={BadgeCheck} title={flash.success} />}
                {error && (
                    <Notice tone="danger" icon={CircleAlert} title="Belum berhasil">
                        {error}
                    </Notice>
                )}

                {p.state === "deposit" && (
                    <>
                        <p className="flex items-center gap-2 text-[15px] font-extrabold text-ink">
                            <ShieldCheck size={18} className="text-gold-ink" aria-hidden="true" /> Deposit dulu untuk ikut menawar
                        </p>
                        <Rows rows={depositRows} />
                        <ul className="space-y-1.5 text-[12px] text-ink-soft">
                            <li>Tidak menang? Deposit kembali ke saldo Wallet-mu dan bisa ditarik ke rekening.</li>
                            <li>Menang? Deposit memotong pelunasan.</li>
                            <li>Bayar deposit paling lambat {dateTime(p.deposit_deadline)}.</li>
                        </ul>
                        {p.viewer === "guest" && (
                            <a href={route("auctions.join", auctionId)} className={primary}>
                                <LogIn size={18} aria-hidden="true" /> Masuk untuk Bayar Deposit
                            </a>
                        )}
                        {canAct && (
                            <button type="button" className={primary} onClick={() => setModal("deposit")}>
                                <Lock size={18} aria-hidden="true" /> Bayar Deposit {rupiah(p.deposit_amount)}
                            </button>
                        )}
                    </>
                )}

                {p.viewer === "unverified" && ["deposit", "bidding"].includes(p.state) && (
                    <Notice tone="warn" icon={CircleAlert} title="Verifikasi email dulu">
                        Deposit dan penawaran hanya untuk akun yang emailnya sudah diverifikasi.
                    </Notice>
                )}
                {p.viewer === "staff" && ["deposit", "bidding"].includes(p.state) && <Notice tone="neutral" icon={Lock} title="Lelang hanya untuk akun member" />}

                {p.state === "deposit_closed" && (
                    <Notice tone="neutral" icon={Lock} title="Pendaftaran deposit sudah ditutup">
                        Deposit ditutup 1 jam sebelum {typeLabel.toLowerCase()} berakhir.
                    </Notice>
                )}

                {p.state === "deposit_pending" && (
                    <>
                        <Notice tone="warn" icon={Clock} title="Menunggu pembayaran deposit">
                            Bayar <b>{rupiah(p.deposit?.amount)}</b> sebelum <b>{dateTime(p.deposit?.expires_at)}</b>. Form penawaran terbuka otomatis setelah pembayaran diterima.
                        </Notice>
                        {p.deposit?.invoice_url && (
                            <a href={p.deposit.invoice_url} className={primary}>
                                <ExternalLink size={18} aria-hidden="true" /> Lanjutkan Pembayaran
                            </a>
                        )}
                    </>
                )}

                {p.state === "ready" && (
                    <Notice tone="success" icon={ShieldCheck} title="Deposit diterima">
                        Kamu siap menawar saat {typeLabel.toLowerCase()} dibuka {dateTime(p.opens_at)}.
                    </Notice>
                )}

                {p.state === "bidding" && (
                    <>
                        {p.top_is_mine && (
                            <Notice tone="success" icon={Trophy} title="Kamu penawar tertinggi">
                                Kalau ada yang menyalip, kamu bisa menawar lagi sebelum ditutup.
                            </Notice>
                        )}
                        {outbid && (
                            <Notice tone="danger" icon={TrendingUp} title="Penawaranmu tersalip">
                                Penawaran tertinggi sekarang <b>{rupiah(p.top_bid)}</b>. Ajukan lagi sebelum ditutup.
                            </Notice>
                        )}
                        {canAct && !p.top_is_mine && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    setModal("bid");
                                }}
                            >
                                <label htmlFor="bid-amount" className="text-[12px] font-bold text-ink-soft">Penawaranmu</label>
                                <div className="mt-1.5 flex items-center rounded-2xl border border-gold-line bg-paper focus-within:border-ink">
                                    <span className="pl-4 font-bold text-ink-soft">Rp</span>
                                    <input
                                        id="bid-amount"
                                        inputMode="numeric"
                                        className="w-full border-0 bg-transparent px-2 py-3.5 text-[17px] font-extrabold tabular-nums outline-none focus:ring-0"
                                        value={amount ? Number(amount).toLocaleString("id-ID") : ""}
                                        onChange={(e) => setAmount(Number(e.target.value.replace(/\D/g, "")) || 0)}
                                    />
                                </div>
                                <p className="mt-1.5 text-[12px] text-ink-soft">
                                    Minimal <b>{rupiah(p.minimum_bid)}</b>, naik kelipatan {rupiah(p.bid_increment)}
                                </p>
                                <div className="mt-3 flex gap-2">
                                    {[1, 5, 10].map((k) => (
                                        <button
                                            key={k}
                                            type="button"
                                            className="flex-1 rounded-xl border border-gold-line py-2 text-[12px] font-bold text-ink hover:border-ink"
                                            onClick={() => setAmount(Math.max(amount || 0, p.minimum_bid - p.bid_increment) + k * p.bid_increment)}
                                        >
                                            +{rupiah(k * p.bid_increment)}
                                        </button>
                                    ))}
                                </div>
                                <button type="submit" className={`${primary} mt-4`} disabled={!amount || amount < p.minimum_bid}>
                                    <Gavel size={18} aria-hidden="true" /> Ajukan Penawaran
                                </button>
                            </form>
                        )}
                        <p className="flex items-center justify-center gap-2 text-[12px] font-semibold text-green-700">
                            <ShieldCheck size={14} aria-hidden="true" /> Deposit {rupiah(p.deposit?.amount)} sudah diterima
                        </p>
                    </>
                )}

                {p.state === "won" && (
                    <>
                        <Notice tone="success" icon={Trophy} title={`Selamat, kamu memenangkan ${typeLabel.toLowerCase()} ini!`}>
                            Lunasi sebelum <b>{dateTime(p.settlement.due_at)}</b>. Lewat dari itu, kemenangan batal dan deposit hangus.
                        </Notice>
                        <Rows
                            rows={[
                                ["Harga menang", rupiah(p.settlement.price)],
                                ["Deposit dibayar", `− ${rupiah(p.settlement.deposit_amount)}`],
                                ["Sisa pelunasan", rupiah(p.settlement.amount), true],
                            ]}
                        />
                        <button type="button" className={primary} disabled={sending} onClick={() => post("auctions.settle")}>
                            <Wallet size={18} aria-hidden="true" /> {sending ? "Memproses…" : "Bayar Pelunasan"}
                        </button>
                        <p className="text-center text-[12px] text-ink-soft">Mau bayar lewat transfer bank? Hubungi tim kami.</p>
                    </>
                )}

                {p.state === "paid" && (
                    <>
                        <Notice tone="success" icon={BadgeCheck} title="Pelunasan diterima">
                            Terima kasih. Tim kami menghubungimu untuk jadwal serah terima dan dokumen.
                        </Notice>
                        <Rows
                            rows={[
                                ["Harga menang", rupiah(p.settlement.price)],
                                ["Deposit (dipotong)", rupiah(p.settlement.deposit_amount)],
                                ["Pelunasan", rupiah(p.settlement.amount)],
                                ["Dibayar", dateTime(p.settlement.paid_at)],
                            ]}
                        />
                    </>
                )}

                {p.state === "default" && (
                    <Notice tone="danger" icon={CircleAlert} title="Batas pelunasan terlewat">
                        Pelunasan tidak diterima sampai {dateTime(p.settlement.due_at)}. Sesuai syarat, kemenanganmu dibatalkan dan deposit {rupiah(p.settlement.deposit_amount)} hangus.
                    </Notice>
                )}

                {p.state === "lost" && (
                    <>
                        <Notice tone="neutral" icon={Flag} title={`${typeLabel} selesai, kamu belum menang`}>
                            {p.my_last_bid ? <>Penawaran terakhirmu {rupiah(p.my_last_bid)}.</> : "Kamu tidak mengajukan penawaran."}
                        </Notice>
                        <Notice tone="success" icon={Undo2} title="Deposit dikembalikan ke saldo">
                            {rupiah(p.deposit?.amount)} sudah masuk ke saldo Wallet-mu dan bisa ditarik ke rekening.
                        </Notice>
                        <a href={route("user.wallet")} className={primary}>
                            <Wallet size={18} aria-hidden="true" /> Lihat Saldo &amp; Tarik
                        </a>
                    </>
                )}

                {p.state === "finished" && <Notice tone="neutral" icon={Flag} title={`${typeLabel} sudah selesai`} />}

                {p.state === "suspended" && (
                    <Notice tone="warn" icon={PauseCircle} title={`${typeLabel} sedang ditangguhkan`}>
                        Penawaran dihentikan sementara. Deposit yang sudah dibayar tetap aman.
                    </Notice>
                )}

                {p.state === "cancelled" && (
                    <>
                        <Notice tone="neutral" icon={Ban} title={`${typeLabel} dibatalkan`}>
                            {p.cancel_reason} Semua penawaran dibatalkan.
                        </Notice>
                        {p.deposit?.paid_at && (
                            <Notice tone="success" icon={Undo2} title="Deposit dikembalikan ke saldo">
                                {rupiah(p.deposit.amount)} sudah masuk ke saldo Wallet-mu.
                            </Notice>
                        )}
                    </>
                )}

                <a href={whatsappUrl} target="_blank" rel="noreferrer" className={ghost}>
                    <MessageCircle size={18} aria-hidden="true" /> Hubungi tim kami
                </a>
            </div>

            {modal === "deposit" && (
                <Modal title="Bayar deposit" onClose={() => setModal(null)}>
                    <div className="mt-5">
                        <Rows rows={depositRows} />
                    </div>
                    {p.terms && (
                        <div className="mt-4">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">Syarat &amp; ketentuan</p>
                            <p className="mt-1 max-h-48 overflow-y-auto whitespace-pre-line text-[13px] leading-relaxed text-ink-soft">{p.terms}</p>
                        </div>
                    )}
                    <p className="mt-4 text-[12px] text-ink-soft">
                        Penawaran tidak bisa ditarik. Kamu akan diarahkan ke halaman pembayaran Xendit; tagihan berlaku {p.invoice_hours} jam.
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button type="button" className={ghost} onClick={() => setModal(null)}>Batal</button>
                        <button type="button" className={primary} disabled={sending} onClick={() => post("auctions.deposit")}>
                            {sending ? "Memproses…" : "Setuju & Bayar"}
                        </button>
                    </div>
                </Modal>
            )}

            {modal === "bid" && (
                <Modal title="Konfirmasi penawaran" onClose={() => setModal(null)}>
                    <p className="mt-5 text-[30px] font-extrabold text-ink tabular-nums">{rupiah(amount)}</p>
                    <p className="text-[13px] capitalize text-ink-soft">{terbilang(amount)} rupiah</p>
                    {amount > 3 * p.open_bid && (
                        <div className="mt-4">
                            <Notice tone="warn" icon={CircleAlert} title="Lebih dari 3× nilai limit">
                                Pastikan jumlah nol sudah benar sebelum melanjutkan.
                            </Notice>
                        </div>
                    )}
                    <p className="mt-4 text-[12px] text-ink-soft">Penawaran yang sudah diajukan tidak bisa ditarik kembali.</p>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button type="button" className={ghost} onClick={() => setModal(null)}>Ubah</button>
                        <button type="button" className={primary} disabled={sending} onClick={() => post("auctions.bid", { bid_amount: amount })}>
                            {sending ? "Memproses…" : "Ajukan"}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

/** C22: the public bid history, names hidden. */
export function BidHistory({ bids, upcoming, opensAt }) {
    return (
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-ink">Riwayat penawaran</h2>
                <span className="text-[12px] font-semibold text-ink-soft">Nama peserta disamarkan</span>
            </div>
            <table className="mt-4 w-full text-[14px]">
                <thead>
                    <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                        <th className="pb-2">Peserta</th>
                        <th className="pb-2">Waktu</th>
                        <th className="pb-2 text-right">Penawaran</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gold-line">
                    {bids.map((b) => (
                        <tr key={b.id}>
                            <td className={`py-3 ${b.mine ? "font-bold" : ""}`}>
                                {b.who}
                                {b.top && <span className="ml-2 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-800">Tertinggi</span>}
                            </td>
                            <td className="py-3 text-ink-soft">{dateTime(b.at)}</td>
                            <td className="py-3 text-right font-bold tabular-nums">{rupiah(b.amount)}</td>
                        </tr>
                    ))}
                    {bids.length === 0 && (
                        <tr>
                            <td colSpan={3} className="py-8 text-center text-ink-soft">
                                {upcoming ? (
                                    <span className="inline-flex items-center gap-2">
                                        <CalendarClock size={16} aria-hidden="true" /> Penawaran dibuka {dateTime(opensAt)}.
                                    </span>
                                ) : (
                                    "Belum ada penawaran."
                                )}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
