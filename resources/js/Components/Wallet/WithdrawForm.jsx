import { forwardRef, useEffect, useMemo, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Info, Plus, Trash2 } from "lucide-react";
import BankBadge from "@/Components/Wallet/BankBadge";
import { digitsOnly, formatCompactRupiah, formatRupiah, groupDigits } from "@/lib/money";

const newRequestKey = () =>
    window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const QUICK_AMOUNTS = [1_000_000, 5_000_000];

/**
 * The one Withdraw form (spec D4). Shown inline on desktop and inside the
 * bottom sheet on mobile. Fee and limits come from the backend; the server
 * re-checks everything, this only gives early feedback.
 */
const WithdrawForm = forwardRef(function WithdrawForm(
    { balance, accounts, banks, settings, onAddAccount, onSubmitted, collapseAccounts = false },
    amountRef,
) {
    const form = useForm({
        user_bank_account_id: accounts[0]?.id ?? "",
        amount: "",
        request_key: newRequestKey(),
    });
    const [showAllAccounts, setShowAllAccounts] = useState(!collapseAccounts);
    const [deletingId, setDeletingId] = useState(null);

    // The same form moves between the desktop panel and the mobile sheet.
    useEffect(() => setShowAllAccounts(!collapseAccounts), [collapseAccounts]);

    // Keep the selection valid when accounts are added or deleted.
    useEffect(() => {
        if (!accounts.some((a) => String(a.id) === String(form.data.user_bank_account_id))) {
            form.setData("user_bank_account_id", accounts[0]?.id ?? "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accounts]);

    const account = accounts.find((a) => String(a.id) === String(form.data.user_bank_account_id));
    const bank = banks.find((b) => b.code === account?.bank_code);

    const fee = settings?.admin_fee ?? 0;
    const minAmount = Math.max(settings?.min_amount ?? 1, bank?.min ?? 1);
    const maxAmount = [settings?.max_amount, bank?.max].filter((v) => v != null).reduce((a, b) => Math.min(a, b), Infinity);
    // Banks report huge technical maximums (Rp 999 M+); only mention a max a person could hit.
    const showMax = Number.isFinite(maxAmount) && maxAmount <= 10_000_000_000;
    const amount = Number(form.data.amount) || 0;
    const total = amount > 0 ? amount + fee : 0;
    const remaining = balance - total;
    const allBalance = Math.min(Math.max(balance - fee, 0), maxAmount);

    const chips = useMemo(() => {
        const list = QUICK_AMOUNTS.filter((v) => v >= minAmount && v <= allBalance).map((v) => ({
            label: formatCompactRupiah(v),
            value: v,
        }));
        if (allBalance >= minAmount) list.push({ label: collapseAccounts ? "Semua" : "Semua saldo", value: allBalance });
        return list;
    }, [minAmount, allBalance, collapseAccounts]);

    const clientError = (() => {
        if (!amount) return null;
        if (amount < minAmount) return `Nominal minimal ${formatRupiah(minAmount)}${bank && bank.min > (settings?.min_amount ?? 0) ? ` untuk ${account.bank_name}` : ""}.`;
        if (amount > maxAmount) return `Nominal maksimal ${formatRupiah(maxAmount)} per penarikan.`;
        if (total > balance) return "Saldo tidak cukup untuk nominal + biaya admin.";
        return null;
    })();

    const amountError = form.errors.amount || clientError;
    const canSubmit = amount > 0 && !clientError && account && !form.processing;

    const submit = (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        form.post(route("user.withdrawals.store"), {
            preserveScroll: true,
            onSuccess: () => {
                form.setData({ user_bank_account_id: form.data.user_bank_account_id, amount: "", request_key: newRequestKey() });
                onSubmitted?.();
            },
        });
    };

    const deleteAccount = (acc) => {
        if (!window.confirm(`Hapus rekening ${acc.bank_name} •••• ${acc.last4}?`)) return;
        setDeletingId(acc.id);
        router.delete(route("user.bank-accounts.destroy", acc.id), {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        });
    };

    const visibleAccounts = showAllAccounts ? accounts : accounts.filter((a) => a === account);

    return (
        <form onSubmit={submit} noValidate className="flex flex-col gap-[22px]">
            {/* Amount */}
            <div>
                <label htmlFor="withdraw-amount" className="mb-2 block text-xs font-bold text-ink-soft">
                    Nominal
                </label>
                <div
                    className={`flex h-[60px] items-center gap-2.5 rounded-[14px] border bg-cream px-4 transition-colors sm:h-16 sm:px-[18px] ${
                        amountError ? "border-status-danger" : "border-gold-line focus-within:border-ink"
                    }`}
                >
                    <span className="text-lg font-bold text-ink-faint sm:text-xl" aria-hidden="true">
                        Rp
                    </span>
                    <input
                        ref={amountRef}
                        id="withdraw-amount"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="0"
                        value={groupDigits(form.data.amount)}
                        onChange={(e) => {
                            form.setData("amount", digitsOnly(e.target.value).slice(0, 13));
                            form.clearErrors("amount");
                        }}
                        aria-invalid={Boolean(amountError)}
                        aria-describedby="withdraw-amount-hint"
                        className="w-full border-0 bg-transparent p-0 text-2xl font-extrabold tabular-nums text-ink caret-gold outline-none placeholder:text-ink-faint focus:outline-none focus:ring-0 sm:text-[26px]"
                    />
                </div>

                {chips.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2" role="group" aria-label="Nominal cepat">
                        {chips.map((chip) => {
                            const active = amount === chip.value;
                            return (
                                <button
                                    key={chip.label}
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => {
                                        form.setData("amount", String(chip.value));
                                        form.clearErrors("amount");
                                    }}
                                    className={`rounded-full px-3 py-[7px] text-xs font-bold transition-colors active:scale-[0.97] ${
                                        active ? "bg-ink text-cream" : "border border-gold-line bg-paper text-ink hover:border-ink"
                                    }`}
                                >
                                    {chip.label}
                                </button>
                            );
                        })}
                    </div>
                )}

                <p
                    id="withdraw-amount-hint"
                    className={`mt-2 text-[11px] font-medium ${amountError ? "font-semibold text-status-danger" : "text-ink-soft"}`}
                    aria-live="polite"
                >
                    {amountError ||
                        `Min ${formatRupiah(minAmount)}${showMax ? ` · maks ${formatRupiah(maxAmount)}` : ""} per penarikan`}
                </p>
            </div>

            {/* Destination account */}
            <fieldset className="min-w-0">
                <div className="mb-2 flex items-center justify-between">
                    <legend className="text-xs font-bold text-ink-soft">Ke rekening</legend>
                    {collapseAccounts && accounts.length > 1 && (
                        <button
                            type="button"
                            onClick={() => setShowAllAccounts((v) => !v)}
                            className="text-xs font-bold text-gold-ink hover:underline"
                        >
                            {showAllAccounts ? "Tutup" : "Ganti"}
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-2.5">
                    {visibleAccounts.map((acc) => {
                        const selected = acc === account;
                        return (
                            <div
                                key={acc.id}
                                className={`group flex items-center gap-3 rounded-[14px] border p-3.5 transition-colors ${
                                    selected ? "border-ink bg-cream-deep" : "border-gold-line bg-paper hover:border-gold-edge"
                                }`}
                            >
                                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                                    <input
                                        type="radio"
                                        name="user_bank_account_id"
                                        value={acc.id}
                                        checked={selected}
                                        onChange={() => {
                                            form.setData("user_bank_account_id", acc.id);
                                            form.clearErrors("user_bank_account_id");
                                            if (collapseAccounts) setShowAllAccounts(false);
                                        }}
                                        className="peer sr-only"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 ${
                                            selected ? "border-ink" : "border-gold-edge"
                                        }`}
                                    >
                                        {selected && <span className="h-2 w-2 rounded-full bg-ink" />}
                                    </span>
                                    <BankBadge code={acc.bank_badge} />
                                    <span className="min-w-0">
                                        <span className="block truncate text-[13px] font-bold text-ink">
                                            {acc.bank_name} •••• {acc.last4}
                                        </span>
                                        {acc.last_failure ? (
                                            <span className="block truncate text-[11px] font-bold text-status-warn">
                                                Terakhir gagal: {acc.last_failure.toLowerCase()}
                                            </span>
                                        ) : (
                                            <span className="block truncate text-[11px] font-medium text-ink-soft">a.n {acc.holder}</span>
                                        )}
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => deleteAccount(acc)}
                                    disabled={deletingId === acc.id}
                                    aria-label={`Hapus rekening ${acc.bank_name} •••• ${acc.last4}`}
                                    className="shrink-0 rounded-lg p-1.5 text-ink-soft opacity-100 transition hover:bg-status-danger-bg hover:text-status-danger focus-visible:opacity-100 disabled:opacity-40 sm:opacity-0 sm:group-hover:opacity-100"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        );
                    })}

                    {(showAllAccounts || accounts.length === 0) && (
                        <button
                            type="button"
                            onClick={onAddAccount}
                            className={`flex items-center gap-2 rounded-[14px] border px-3.5 py-3 text-left transition-colors ${
                                accounts.length === 0
                                    ? "border-ink bg-cream-deep"
                                    : "border-dashed border-gold-edge hover:border-ink"
                            }`}
                        >
                            <Plus size={14} className="text-ink" aria-hidden="true" />
                            <span className="flex-1 text-[13px] font-bold text-ink">
                                {accounts.length === 0 ? "Tambah rekening dulu" : "Tambah rekening"}
                            </span>
                            <span className="text-[11px] font-semibold text-ink-soft">{banks.length}+ bank</span>
                        </button>
                    )}
                </div>

                {form.errors.user_bank_account_id && (
                    <p className="mt-1.5 text-xs font-semibold text-status-danger">{form.errors.user_bank_account_id}</p>
                )}
            </fieldset>

            {/* Summary */}
            <dl className="flex flex-col gap-2.5 border-t border-gold-line pt-4 text-[13px]">
                <Row label="Masuk ke rekening" value={formatRupiah(amount)} />
                <Row label="Biaya admin" value={formatRupiah(fee)} />
                <Row label="Dipotong dari saldo" value={formatRupiah(total)} strong />
                {!collapseAccounts && (
                    <Row
                        label="Sisa saldo"
                        value={formatRupiah(Math.max(remaining, 0))}
                        muted={remaining < 0}
                    />
                )}
            </dl>

            <div className="flex flex-col gap-3">
                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="h-[52px] rounded-[14px] bg-ink text-[15px] font-extrabold text-cream transition-[background-color,transform] hover:bg-ink-soft active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-ink/40"
                >
                    {form.processing ? "Memproses…" : amount > 0 ? `Tarik ${formatRupiah(amount)}` : "Tarik dana"}
                </button>
                <p className="flex gap-2 text-[11px] font-medium leading-relaxed text-ink-soft">
                    <Info size={14} className="mt-px shrink-0" aria-hidden="true" />
                    <span>
                        {collapseAccounts
                            ? "Kalau gagal, saldo dan biaya kembali otomatis."
                            : "Dicek admin dulu, biasanya di hari kerja yang sama. Kamu dapat email di setiap langkah. Kalau gagal, saldo dan biaya kembali otomatis."}
                    </span>
                </p>
            </div>
        </form>
    );
});

function Row({ label, value, strong = false, muted = false }) {
    return (
        <div className="flex items-baseline justify-between gap-4">
            <dt className={strong ? "font-extrabold text-ink" : "font-semibold text-ink-soft"}>{label}</dt>
            <dd className={`tabular-nums ${strong ? "font-extrabold text-ink" : "font-bold text-ink"} ${muted ? "text-status-danger" : ""}`}>
                {value}
            </dd>
        </div>
    );
}

export default WithdrawForm;
