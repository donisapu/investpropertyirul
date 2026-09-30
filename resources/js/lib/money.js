// Rupiah helpers for the Wallet. Amounts are whole Rupiah integers.

export const formatRupiah = (value) =>
    `Rp ${Math.round(Number(value) || 0).toLocaleString("id-ID")}`;

/** Signed amount for ledger rows: "+ Rp 1.000" / "− Rp 1.000". */
export const formatSignedRupiah = (value) => {
    const n = Number(value) || 0;
    return `${n < 0 ? "−" : "+"} ${formatRupiah(Math.abs(n))}`;
};

/** "Rp 1 jt", "Rp 500 rb" for quick-amount chips. */
export const formatCompactRupiah = (value) => {
    const n = Number(value) || 0;
    if (n >= 1_000_000 && n % 1_000_000 === 0) return `Rp ${n / 1_000_000} jt`;
    if (n >= 1_000 && n % 1_000 === 0) return `Rp ${n / 1_000} rb`;
    return formatRupiah(n);
};

/** Keep digits only; drop leading zeros. "5.000.000" -> "5000000". */
export const digitsOnly = (text) =>
    String(text ?? "").replace(/\D/g, "").replace(/^0+(?=\d)/, "");

/** "5000000" -> "5.000.000" for the amount field. */
export const groupDigits = (digits) =>
    digits ? Number(digits).toLocaleString("id-ID") : "";

export const formatShortDate = (iso) => {
    if (!iso) return "";
    const date = new Date(iso);
    const today = new Date();
    const sameDay = date.toDateString() === today.toDateString();
    const time = date
        .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        .replace(":", ".");
    if (sameDay) return `Hari ini ${time}`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
};
