import { useCallback, useEffect, useRef, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { ArrowUpRight, CheckCircle2, X } from "lucide-react";
import PublicLayout from "@/Layouts/PublicLayout";
import WithdrawForm from "@/Components/Wallet/WithdrawForm";
import AddBankAccountForm from "@/Components/Wallet/AddBankAccountForm";
import WalletHistory from "@/Components/Wallet/WalletHistory";
import { formatRupiah } from "@/lib/money";

const DESKTOP_QUERY = "(min-width: 1024px)";

function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(
        () => typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches,
    );
    useEffect(() => {
        const mq = window.matchMedia(DESKTOP_QUERY);
        const onChange = (e) => setIsDesktop(e.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);
    return isDesktop;
}

export default function Wallet({
    balance = 0,
    summary = {},
    bankAccounts = [],
    history = [],
    banks = [],
    withdrawalSettings,
}) {
    const { flash = {}, errors = {} } = usePage().props;
    const isDesktop = useIsDesktop();
    const amountRef = useRef(null);
    const panelRef = useRef(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [mode, setMode] = useState("withdraw");
    const [notice, setNotice] = useState(flash.success || null);

    useEffect(() => setNotice(flash.success || null), [flash.success]);

    const focusAmount = useCallback(() => {
        // Wait for the sheet to slide in before moving focus.
        window.setTimeout(() => amountRef.current?.focus({ preventScroll: !isDesktop }), isDesktop ? 0 : 280);
    }, [isDesktop]);

    const openWithdraw = useCallback(
        (nextMode = "withdraw") => {
            setMode(bankAccounts.length === 0 ? "add" : nextMode);
            if (isDesktop) {
                panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                setSheetOpen(true);
            }
            if (nextMode === "withdraw") focusAmount();
        },
        [bankAccounts.length, isDesktop, focusAmount],
    );

    // D4: Portfolio links to /user/wallet#tarik (also works for a #tarik link on this page).
    const openWithdrawRef = useRef(openWithdraw);
    openWithdrawRef.current = openWithdraw;
    useEffect(() => {
        const openFromHash = () => window.location.hash === "#tarik" && openWithdrawRef.current();
        openFromHash();
        window.addEventListener("hashchange", openFromHash);
        return () => window.removeEventListener("hashchange", openFromHash);
    }, []);

    // Mobile sheet: Escape closes, the page behind does not scroll.
    useEffect(() => {
        if (!sheetOpen || isDesktop) return undefined;
        const onKey = (e) => e.key === "Escape" && setSheetOpen(false);
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = overflow;
            document.removeEventListener("keydown", onKey);
        };
    }, [sheetOpen, isDesktop]);

    useEffect(() => {
        if (isDesktop) setSheetOpen(false);
    }, [isDesktop]);

    const sheetHidden = !isDesktop && !sheetOpen;

    return (
        <PublicLayout>
            <Head title="Wallet" />

            <div className="mx-auto max-w-[1296px] px-4 pb-32 pt-8 sm:px-6 lg:px-8 lg:pb-16">
                <header className="hero-step hero-step-1 mb-6 lg:mb-8">
                    <h1 className="text-2xl font-extrabold text-ink sm:text-[30px]">Wallet</h1>
                    <p className="mt-2 max-w-xl text-sm font-medium text-ink-soft">
                        Saldo dari bagi hasil dan penjualan lot. Tarik ke rekening bank kamu kapan saja.
                    </p>
                </header>

                {notice && (
                    <div
                        role="status"
                        className="mb-6 flex items-center gap-3 rounded-2xl border border-status-success/20 bg-status-success-bg px-4 py-3 text-sm font-semibold text-status-success"
                    >
                        <CheckCircle2 size={18} aria-hidden="true" />
                        <span className="flex-1">{notice}</span>
                        <button type="button" onClick={() => setNotice(null)} aria-label="Tutup pesan" className="rounded p-1 hover:bg-status-success/10">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {errors.bank_account && (
                    <div role="alert" className="mb-6 rounded-2xl bg-status-danger-bg px-4 py-3 text-sm font-semibold text-status-danger">
                        {errors.bank_account}
                    </div>
                )}

                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-10">
                    <div className="flex min-w-0 flex-col gap-6">
                        <BalanceBlock balance={balance} summary={summary} />
                        <div className="hero-step hero-step-3">
                            <WalletHistory rows={history} onFixAccount={() => openWithdraw("add")} />
                        </div>
                    </div>

                    {/* Scrim (mobile only) */}
                    <div
                        aria-hidden="true"
                        onClick={() => setSheetOpen(false)}
                        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-300 lg:hidden ${
                            sheetOpen ? "opacity-100" : "pointer-events-none opacity-0"
                        }`}
                    />

                    {/* One withdraw panel: inline card on desktop, bottom sheet on mobile. */}
                    <aside
                        id="tarik"
                        ref={panelRef}
                        aria-labelledby="withdraw-title"
                        role={isDesktop ? "region" : "dialog"}
                        aria-modal={isDesktop ? undefined : true}
                        inert={sheetHidden ? true : undefined}
                        className={`fixed inset-x-0 bottom-0 z-[70] max-h-[92dvh] overflow-y-auto overscroll-contain rounded-t-3xl bg-paper px-5 pb-7 pt-2.5 shadow-[0_-12px_40px_rgba(36,38,32,0.18)] transition-transform duration-300 ease-out-quint lg:sticky lg:top-[128px] lg:z-auto lg:max-h-none lg:translate-y-0 lg:scroll-mt-[128px] lg:overflow-visible lg:rounded-3xl lg:border lg:border-gold-line lg:p-7 lg:shadow-none ${
                            sheetOpen ? "translate-y-0" : "translate-y-full"
                        }`}
                    >
                        <div className="hero-step hero-step-2">
                            <div aria-hidden="true" className="mx-auto mb-4 h-1 w-9 rounded-full bg-gold-edge lg:hidden" />

                            {mode === "add" ? (
                                <>
                                    <span id="withdraw-title" className="sr-only">
                                        Tambah rekening
                                    </span>
                                    <AddBankAccountForm
                                        banks={banks}
                                        onBack={() => setMode("withdraw")}
                                        onSaved={() => {
                                            setMode("withdraw");
                                            focusAmount();
                                        }}
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="mb-[22px] flex items-center justify-between">
                                        <h2 id="withdraw-title" className="text-lg font-extrabold text-ink">
                                            Tarik dana
                                        </h2>
                                        <button
                                            type="button"
                                            onClick={() => setSheetOpen(false)}
                                            aria-label="Tutup"
                                            className="rounded-lg p-1 text-ink-soft hover:bg-cream-deep lg:hidden"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <WithdrawForm
                                        ref={amountRef}
                                        balance={balance}
                                        accounts={bankAccounts}
                                        banks={banks}
                                        settings={withdrawalSettings}
                                        collapseAccounts={!isDesktop}
                                        onAddAccount={() => setMode("add")}
                                        onSubmitted={() => setSheetOpen(false)}
                                    />
                                </>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            {/* Mobile entry point to the sheet */}
            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold-line bg-cream/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
                <button
                    type="button"
                    onClick={() => openWithdraw()}
                    aria-controls="tarik"
                    aria-expanded={sheetOpen}
                    className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-ink text-[15px] font-extrabold text-cream"
                >
                    <ArrowUpRight size={16} aria-hidden="true" /> Tarik dana
                </button>
            </div>
        </PublicLayout>
    );
}

function BalanceBlock({ balance, summary }) {
    const stats = [
        ["Sedang diproses", formatRupiah(summary.processing)],
        ["Ditarik bulan ini", formatRupiah(summary.withdrawn_this_month)],
        ["Bagi hasil bulan ini", `+ ${formatRupiah(summary.profit_this_month)}`],
    ];

    return (
        <section
            aria-label="Saldo"
            className="hero-step hero-step-2 relative overflow-hidden rounded-[20px] bg-ink p-[22px] sm:rounded-3xl sm:p-8"
        >
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/15 blur-[90px]" />
            <p className="relative text-xs font-bold text-gold sm:text-[13px]">Saldo bisa ditarik</p>
            <p className="relative mt-1.5 text-[32px] font-extrabold leading-tight tracking-tight text-cream tabular-nums sm:text-[44px]">
                {formatRupiah(balance)}
            </p>
            <dl className="relative mt-6 hidden gap-8 border-t border-cream/10 pt-5 sm:flex">
                {stats.map(([label, value]) => (
                    <div key={label}>
                        <dt className="text-[11px] font-semibold text-cream/65">{label}</dt>
                        <dd className="mt-1 text-[15px] font-extrabold text-cream tabular-nums">{value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
