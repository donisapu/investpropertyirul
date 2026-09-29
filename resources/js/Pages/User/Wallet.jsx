import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { Wallet, ArrowUpRight, History, Landmark, Trash2 } from "lucide-react";
import PublicLayout from "@/Layouts/PublicLayout";
import WithdrawModal from "@/Components/WithdrawModal";

function formatCurrency(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value ?? 0);
}

function formatDate(value) {
    if (!value) return "";
    return new Date(value).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

const STATUS_STYLES = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-emerald-100 text-emerald-700",
    SUCCESS: "bg-emerald-100 text-emerald-700",
    COMPLETED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-red-100 text-red-700",
    FAILED: "bg-red-100 text-red-700",
};

export default function Index({
    balance = 0,
    bankAccounts = [],
    withdrawals = [],
    withdrawalSettings,
    banks = [],
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const { errors = {} } = usePage().props;

    const deleteBankAccount = (account) => {
        if (
            !window.confirm(
                `Hapus rekening ${account.bank_name} ${account.account_number}?`,
            )
        )
            return;

        setDeletingId(account.id);
        router.delete(route("user.bank-accounts.destroy", account.id), {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        });
    };

    return (
        <PublicLayout>
            <Head title="Wallet" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Banner Header */}
                <div className="relative mb-12 rounded-[2.5rem] overflow-hidden bg-ink border border-white/10 p-8 md:p-12">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/20 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full mb-4 border border-white/10">
                                <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                    Saldo &amp; Penarikan
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                Wallet{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-ink">
                                    Kamu
                                </span>
                            </h1>
                            <p className="text-cream/75 text-sm mt-2">
                                Cek saldo dan tarik dana ke rekening bank kamu.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Balance Card */}
                <div className="mb-12">
                    <div className="bg-cream rounded-[2rem] p-6 md:p-8 border border-gold-line shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-cream-deep flex items-center justify-center text-gold-ink">
                                <Wallet size={24} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-ink-soft uppercase tracking-widest">
                                    Available Balance
                                </span>
                                <h2 className="text-3xl font-black text-ink">
                                    {formatCurrency(Number(balance))}
                                </h2>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center justify-center gap-2 bg-ink hover:bg-ink-soft text-cream px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-lg hover:shadow-gold/20"
                        >
                            <ArrowUpRight size={16} /> Withdraw
                        </button>
                    </div>
                </div>

                {/* Saved Bank Accounts */}
                <div className="mb-12">
                    <div className="mb-6">
                        <h3 className="text-xl font-black text-ink">
                            Bank Accounts
                        </h3>
                        <p className="text-xs font-bold text-ink-soft uppercase tracking-widest">
                            Rekening Tersimpan
                        </p>
                    </div>

                    {errors.bank_account && (
                        <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-700 text-sm">
                            {errors.bank_account}
                        </div>
                    )}

                    <div className="bg-cream rounded-[2rem] border border-gold-line shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden p-2">
                        {bankAccounts.length > 0 ? (
                            <ul className="divide-y divide-gold-line/60">
                                {bankAccounts.map((acc) => (
                                    <li
                                        key={acc.id}
                                        className="flex items-center justify-between gap-4 p-4"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 shrink-0 rounded-xl bg-cream-deep flex items-center justify-center text-gold-ink">
                                                <Landmark size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-black text-ink truncate">
                                                    {acc.bank_name}
                                                </p>
                                                <p className="text-xs text-ink-soft truncate">
                                                    {acc.account_number} · a.n{" "}
                                                    {acc.account_holder_name}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => deleteBankAccount(acc)}
                                            disabled={deletingId === acc.id}
                                            aria-label={`Hapus rekening ${acc.bank_name} ${acc.account_number}`}
                                            className="shrink-0 p-2 rounded-xl text-red-600 hover:bg-red-50 disabled:opacity-50"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="p-6 text-sm text-ink-soft">
                                Belum ada rekening. Tambahkan saat melakukan Withdraw.
                            </p>
                        )}
                    </div>
                </div>

                {/* Withdrawal History */}
                <div className="mb-12">
                    <div className="mb-6">
                        <h3 className="text-xl font-black text-ink">
                            Withdrawal History
                        </h3>
                        <p className="text-xs font-bold text-ink-soft uppercase tracking-widest">
                            Riwayat Penarikan
                        </p>
                    </div>

                    <div className="bg-cream rounded-[2rem] border border-gold-line shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden p-2">
                        <div className="divide-y divide-gold-line/60">
                            {withdrawals && withdrawals.length > 0 ? (
                                withdrawals.map((wd) => {
                                    const status = String(
                                        wd.status || "",
                                    ).toUpperCase();
                                    const bankName =
                                        wd.bank_account?.bank_name ||
                                        wd.bank_name ||
                                        "Penarikan";
                                    const accountNumber =
                                        wd.bank_account?.account_number ||
                                        wd.account_number ||
                                        "";

                                    return (
                                        <div
                                            key={wd.id}
                                            className="p-4 flex items-center justify-between gap-4 text-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-cream-deep flex items-center justify-center text-ink-soft">
                                                    <History size={16} />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-ink block">
                                                        {bankName}
                                                        {accountNumber &&
                                                            ` • ${accountNumber}`}
                                                    </span>
                                                    <span className="text-[10px] font-semibold text-ink-soft uppercase">
                                                        {formatDate(
                                                            wd.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {status && (
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                            STATUS_STYLES[
                                                                status
                                                            ] ||
                                                            "bg-cream-deep text-ink-soft"
                                                        }`}
                                                    >
                                                        {status}
                                                    </span>
                                                )}
                                                <span className="font-black text-ink">
                                                    -{" "}
                                                    {formatCurrency(wd.amount)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-6 text-center text-sm font-medium text-ink-soft">
                                    Belum ada riwayat penarikan.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Penarikan */}
            <WithdrawModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentBalance={balance}
                bankAccounts={bankAccounts}
                banks={banks}
                settings={withdrawalSettings}
            />
        </PublicLayout>
    );
}
