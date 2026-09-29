/** Small dark tile with the bank's short code, as in the mockup (no logos available). */
export default function BankBadge({ code, active = true }) {
    return (
        <span
            aria-hidden="true"
            className={`inline-flex h-7 w-10 shrink-0 items-center justify-center rounded-md text-[8px] font-extrabold tracking-wide ${
                active ? "bg-ink text-gold" : "bg-cream-sink text-ink-soft"
            }`}
        >
            {code}
        </span>
    );
}
