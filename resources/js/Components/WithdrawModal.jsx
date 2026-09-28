import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

const LIST_BANK = [
    { code: "BCA", name: "Bank Central Asia (BCA)" },
    { code: "MANDIRI", name: "Bank Mandiri" },
    { code: "BRI", name: "Bank Rakyat Indonesia (BRI)" },
    { code: "BNI", name: "Bank Negara Indonesia (BNI)" },
    { code: "CIMB", name: "CIMB Niaga" },
];

export default function WithdrawModal({
    isOpen,
    onClose,
    currentBalance,
    bankAccounts = [],
}) {
    const [showAddBank, setShowAddBank] = useState(bankAccounts.length === 0);

    // Form 1: Tambah Rekening
    const bankForm = useForm({
        bank_code: "BCA",
        account_number: "",
        account_holder_name: "",
    });

    // Form 2: Submit Withdraw
    const withdrawForm = useForm({
        user_bank_account_id: bankAccounts.length > 0 ? bankAccounts[0].id : "",
        amount: "",
    });

    if (!isOpen) return null;

    const adminFee = 5000;
    const numAmount = Number(withdrawForm.data.amount) || 0;
    const totalDeduction = numAmount > 0 ? numAmount + adminFee : 0;

    // Handle Tambah Rekening Bank
    const handleAddBank = (e) => {
        e.preventDefault();
        bankForm.post(route("user.bank-accounts.store"), {
            onSuccess: () => {
                bankForm.reset();
                setShowAddBank(false);
            },
        });
    };

    // Handle Submit Withdraw
    const handleWithdrawSubmit = (e) => {
        e.preventDefault();

        if (totalDeduction > currentBalance) {
            withdrawForm.setError(
                "amount",
                "Total penarikan + fee melebihi saldo kamu.",
            );
            return;
        }

        withdrawForm.post(route("user.withdrawals.store"), {
            onSuccess: () => {
                withdrawForm.reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Pencairan Saldo (Withdraw)
                </h2>

                {/* --- FORM TAMBAH REKENING BARU --- */}
                {showAddBank ? (
                    <form onSubmit={handleAddBank} className="space-y-4">
                        <h3 className="font-semibold text-gray-700">
                            Tambah Rekening Bank Baru
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bank
                            </label>
                            <select
                                value={bankForm.data.bank_code}
                                onChange={(e) =>
                                    bankForm.setData(
                                        "bank_code",
                                        e.target.value,
                                    )
                                }
                                className="w-full border rounded-lg p-2.5 border-gray-300"
                                required
                            >
                                {LIST_BANK.map((b) => (
                                    <option key={b.code} value={b.code}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nomor Rekening
                            </label>
                            <input
                                type="number"
                                value={bankForm.data.account_number}
                                onChange={(e) =>
                                    bankForm.setData(
                                        "account_number",
                                        e.target.value,
                                    )
                                }
                                placeholder="1234567890"
                                className="w-full border rounded-lg p-2.5 border-gray-300"
                                required
                            />
                            {bankForm.errors.account_number && (
                                <p className="text-red-500 text-xs mt-1">
                                    {bankForm.errors.account_number}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Pemilik Rekening
                            </label>
                            <input
                                type="text"
                                value={bankForm.data.account_holder_name}
                                onChange={(e) =>
                                    bankForm.setData(
                                        "account_holder_name",
                                        e.target.value,
                                    )
                                }
                                placeholder="Sesuai buku tabungan / KTP"
                                className="w-full border rounded-lg p-2.5 border-gray-300"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            {bankAccounts.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setShowAddBank(false)}
                                    className="px-4 py-2 border rounded-lg text-gray-600"
                                >
                                    Batal
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={bankForm.processing}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {bankForm.processing
                                    ? "Simpan..."
                                    : "Simpan Rekening"}
                            </button>
                        </div>
                    </form>
                ) : (
                    /* --- FORM REQUEST WITHDRAW --- */
                    <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                        {/* Error umum jika ada */}
                        {withdrawForm.errors.general && (
                            <div className="p-3 bg-red-100 text-red-700 text-sm rounded">
                                {withdrawForm.errors.general}
                            </div>
                        )}

                        {/* Dropdown Rekening */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Rekening Tujuan
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowAddBank(true)}
                                    className="text-xs text-blue-600 hover:underline font-medium"
                                >
                                    + Tambah Rekening
                                </button>
                            </div>
                            <select
                                value={withdrawForm.data.user_bank_account_id}
                                onChange={(e) =>
                                    withdrawForm.setData(
                                        "user_bank_account_id",
                                        e.target.value,
                                    )
                                }
                                className="w-full border rounded-lg p-2.5 border-gray-300 bg-gray-50"
                                required
                            >
                                {bankAccounts.map((acc) => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.bank_code} - {acc.account_number}{" "}
                                        a.n {acc.account_holder_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Nominal Withdraw */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nominal Withdraw (Rp)
                            </label>
                            <input
                                type="number"
                                value={withdrawForm.data.amount}
                                onChange={(e) =>
                                    withdrawForm.setData(
                                        "amount",
                                        e.target.value,
                                    )
                                }
                                placeholder="Min. 50.000"
                                min="50000"
                                className="w-full border rounded-lg p-2.5 border-gray-300"
                                required
                            />
                            {withdrawForm.errors.amount && (
                                <p className="text-red-500 text-xs mt-1">
                                    {withdrawForm.errors.amount}
                                </p>
                            )}
                        </div>

                        {/* Rincian Biaya */}
                        <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1.5 border border-gray-200">
                            <div className="flex justify-between text-gray-600">
                                <span>Nominal Penarikan:</span>
                                <span>
                                    Rp {numAmount.toLocaleString("id-ID")}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Biaya Transaksi (Fee):</span>
                                <span>
                                    Rp {adminFee.toLocaleString("id-ID")}
                                </span>
                            </div>
                            <hr className="my-1 border-gray-200" />
                            <div className="flex justify-between font-bold text-gray-800">
                                <span>Total Saldo Dipotong:</span>
                                <span>
                                    Rp {totalDeduction.toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={withdrawForm.processing}
                                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={withdrawForm.processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {withdrawForm.processing
                                    ? "Memproses..."
                                    : "Konfirmasi Withdraw"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
