import { useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import BankPicker from "@/Components/Wallet/BankPicker";

const fieldClass =
    "h-[46px] w-full rounded-xl border bg-paper px-3.5 text-sm font-bold text-ink placeholder:font-medium placeholder:text-ink-soft focus:border-ink focus:ring-0";

export default function AddBankAccountForm({ banks, onBack, onSaved }) {
    const form = useForm({ bank_code: "", account_number: "", account_holder_name: "" });

    const submit = (e) => {
        e.preventDefault();
        if (!form.data.bank_code) {
            form.setError("bank_code", "Pilih bank dari daftar.");
            return;
        }
        form.post(route("user.bank-accounts.store"), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onSaved?.();
            },
        });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="-ml-1 rounded-lg p-1 text-ink hover:bg-cream-deep"
                    aria-label="Kembali ke tarik dana"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-lg font-extrabold text-ink">Tambah rekening</h2>
            </div>

            <BankPicker
                banks={banks}
                value={form.data.bank_code}
                onChange={(code) => {
                    form.setData("bank_code", code);
                    form.clearErrors("bank_code");
                }}
                error={form.errors.bank_code}
                autoFocus
            />

            <div>
                <label htmlFor="account_number" className="mb-1.5 block text-xs font-bold text-ink-soft">
                    Nomor rekening
                </label>
                <input
                    id="account_number"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={24}
                    value={form.data.account_number}
                    onChange={(e) => form.setData("account_number", e.target.value.replace(/[^\d\s-]/g, ""))}
                    placeholder="Contoh 7123 4567 890"
                    aria-invalid={Boolean(form.errors.account_number)}
                    className={`${fieldClass} ${form.errors.account_number ? "border-status-danger" : "border-gold-line"}`}
                />
                {form.errors.account_number && (
                    <p className="mt-1.5 text-xs font-semibold text-status-danger">{form.errors.account_number}</p>
                )}
            </div>

            <div>
                <label htmlFor="account_holder_name" className="mb-1.5 block text-xs font-bold text-ink-soft">
                    Nama pemilik rekening
                </label>
                <input
                    id="account_holder_name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    value={form.data.account_holder_name}
                    onChange={(e) => form.setData("account_holder_name", e.target.value)}
                    placeholder="Sesuai buku tabungan"
                    aria-describedby="holder_hint"
                    aria-invalid={Boolean(form.errors.account_holder_name)}
                    className={`${fieldClass} ${form.errors.account_holder_name ? "border-status-danger" : "border-gold-line"}`}
                />
                {form.errors.account_holder_name ? (
                    <p className="mt-1.5 text-xs font-semibold text-status-danger">{form.errors.account_holder_name}</p>
                ) : (
                    <p id="holder_hint" className="mt-1.5 text-[11px] font-medium text-status-warn">
                        Harus sama persis dengan nama di buku tabungan.
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={form.processing}
                className="h-[52px] rounded-[14px] bg-ink text-[15px] font-extrabold text-cream transition-colors hover:bg-ink-soft disabled:opacity-60"
            >
                {form.processing ? "Menyimpan…" : "Simpan rekening"}
            </button>
        </form>
    );
}
