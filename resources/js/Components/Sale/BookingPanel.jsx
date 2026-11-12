import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
    BadgeCheck,
    CalendarCheck,
    Clock,
    ExternalLink,
    Lock,
    LogIn,
    MessageCircle,
    TimerOff,
    TriangleAlert,
    Undo2,
    X,
} from "lucide-react";

const rupiah = (value) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value || 0);

const dateTime = (iso) =>
    iso
        ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(iso)) + " WIB"
        : "-";

const percent = (value) => `${Number(value).toLocaleString("id-ID", { maximumFractionDigits: 2 })}%`;

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

const primary =
    "w-full bg-ink hover:bg-gold-ink text-cream font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50";
const ghost =
    "w-full border border-gold-line hover:border-ink text-ink font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2";

/**
 * The booking part of the price card on a property for sale (USE-CASES.md §B,
 * mockups/gainproperties/penjualan.html). `booking` comes from SaleBookingService::stateFor.
 */
export default function BookingPanel({ booking, consignmentId, whatsappUrl }) {
    const { errors } = usePage().props;
    const [confirming, setConfirming] = useState(false);
    const [sending, setSending] = useState(false);
    const mine = booking.booking;
    const canBook = ["available", "mine_expired", "mine_cancelled"].includes(booking.state);

    const submit = () => {
        router.post(route("property-for-sale.book", consignmentId), {}, {
            onStart: () => setSending(true),
            onFinish: () => setSending(false),
            onError: () => setConfirming(false),
        });
    };

    const feeRow = (
        <div className="rounded-2xl bg-cream-sink p-4">
            <div className="flex justify-between text-sm">
                <span className="text-ink-soft font-medium">Booking fee ({percent(booking.fee_percent)})</span>
                <span className="font-bold text-ink tabular-nums">{rupiah(booking.fee_amount)}</span>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-ink-soft">
                Bayar booking fee untuk mengunci properti ini. Selama booking berlaku, properti tidak bisa dibooking orang lain.
            </p>
        </div>
    );

    return (
        <div className="space-y-3 mb-8">
            {errors?.booking && (
                <Notice tone="danger" icon={TriangleAlert} title="Booking belum berhasil">
                    {errors.booking}
                </Notice>
            )}

            {booking.state === "mine_expired" && (
                <Notice tone="danger" icon={TimerOff} title="Waktu pembayaran habis">
                    Booking {mine?.code} dibatalkan otomatis karena tidak dibayar sampai {dateTime(mine?.expires_at)}. Tidak ada dana yang terpotong.
                </Notice>
            )}

            {booking.state === "mine_cancelled" && (
                <Notice tone="neutral" icon={Undo2} title="Booking kamu dibatalkan">
                    {mine?.cancel_reason}{" "}
                    {mine?.fee_outcome === "refunded"
                        ? `Booking fee ${rupiah(mine?.amount)} sudah dikembalikan ke saldo Wallet.`
                        : "Booking fee tidak dikembalikan sesuai syarat booking."}
                </Notice>
            )}

            {canBook && (
                <>
                    {feeRow}
                    {booking.viewer === "buyer" && (
                        <button type="button" className={primary} onClick={() => setConfirming(true)}>
                            <CalendarCheck size={18} aria-hidden="true" /> {booking.state === "available" ? "Booking Sekarang" : "Booking Lagi"}
                        </button>
                    )}
                    {booking.viewer === "guest" && (
                        <a href={route("property-for-sale.book.login", consignmentId)} className={primary}>
                            <LogIn size={18} aria-hidden="true" /> Masuk untuk Booking
                        </a>
                    )}
                    {booking.viewer === "unverified" && (
                        <Notice tone="warn" icon={TriangleAlert} title="Verifikasi email dulu">
                            Booking hanya untuk akun yang emailnya sudah diverifikasi.{" "}
                            <Link href={route("verification.notice")} className="font-bold underline">Kirim ulang email verifikasi</Link>
                        </Notice>
                    )}
                    {booking.viewer === "staff" && (
                        <Notice tone="neutral" icon={Lock} title="Booking hanya untuk akun member" />
                    )}
                </>
            )}

            {booking.state === "mine_pending" && (
                <>
                    <Notice tone="warn" icon={Clock} title="Menunggu pembayaran">
                        Selesaikan pembayaran <b>{rupiah(mine?.amount)}</b> sebelum <b>{dateTime(mine?.expires_at)}</b>. Jika lewat, booking dibatalkan otomatis.
                    </Notice>
                    {mine?.invoice_url && (
                        <a href={mine.invoice_url} className={primary}>
                            <ExternalLink size={18} aria-hidden="true" /> Lanjutkan Pembayaran
                        </a>
                    )}
                    <p className="text-center text-[12px] text-ink-soft">Halaman pembayaran aman oleh Xendit</p>
                </>
            )}

            {booking.state === "mine_paid" && (
                <>
                    <Notice tone="success" icon={BadgeCheck} title="Booking berhasil">
                        Booking fee <b>{rupiah(mine?.amount)}</b> diterima {dateTime(mine?.paid_at)}. Tim kami akan menghubungimu untuk survei, cek dokumen, dan jadwal transaksi.
                    </Notice>
                    <div className="rounded-2xl bg-cream-sink p-4 text-sm">
                        <div className="flex justify-between"><span className="text-ink-soft">No. booking</span><span className="font-bold">{mine?.code}</span></div>
                    </div>
                </>
            )}

            {booking.state === "mine_conflict" && (
                <Notice tone="warn" icon={TriangleAlert} title="Pembayaranmu sedang kami tinjau">
                    Pembayaran {rupiah(mine?.amount)} masuk saat properti sudah dibooking pembeli lain. Tim kami akan mengembalikannya ke saldo Wallet-mu.
                </Notice>
            )}

            {booking.state === "mine_completed" && (
                <Notice tone="success" icon={BadgeCheck} title="Transaksi selesai">
                    Properti ini sudah resmi menjadi milikmu. Terima kasih telah bertransaksi bersama kami.
                </Notice>
            )}

            {booking.state === "taken" && (
                <Notice tone="neutral" icon={Lock} title="Properti sedang dibooking">
                    Properti ini sedang dalam proses pembelian oleh pembeli lain. Hubungi kami jika ingin masuk daftar tunggu.
                </Notice>
            )}

            {booking.state === "sold" && <Notice tone="neutral" icon={Lock} title="Properti sudah terjual" />}

            <a href={whatsappUrl} target="_blank" rel="noreferrer" className={canBook || booking.state === "mine_pending" ? ghost : primary}>
                <MessageCircle size={18} aria-hidden="true" /> {booking.state === "unavailable" ? "Contact Agent" : "Tanya via WhatsApp"}
            </a>

            {confirming && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" role="dialog" aria-modal="true" aria-labelledby="booking-confirm-title">
                    <div className="w-full max-w-md rounded-[2rem] bg-cream p-7 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <h2 id="booking-confirm-title" className="text-xl font-extrabold text-ink">Konfirmasi booking</h2>
                            <button type="button" onClick={() => setConfirming(false)} aria-label="Tutup" className="text-ink-soft hover:text-ink">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mt-5">{feeRow}</div>
                        {booking.terms && (
                            <div className="mt-4">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">Syarat booking</p>
                                <p className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-ink-soft">{booking.terms}</p>
                            </div>
                        )}
                        <p className="mt-4 text-[12px] text-ink-soft">Kamu akan diarahkan ke halaman pembayaran Xendit. Tagihan berlaku {booking.invoice_hours} jam.</p>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button type="button" className={ghost} onClick={() => setConfirming(false)}>Batal</button>
                            <button type="button" className={primary} onClick={submit} disabled={sending}>
                                {sending ? "Memproses…" : `Bayar ${rupiah(booking.fee_amount)}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
