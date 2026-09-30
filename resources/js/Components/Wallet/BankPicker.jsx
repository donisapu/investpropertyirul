import { useId, useMemo, useRef, useState } from "react";
import { Check, Search } from "lucide-react";
import BankBadge from "@/Components/Wallet/BankBadge";

export const bankBadgeCode = (code = "") =>
    code.replace(/^ID_/, "").replace(/[^A-Z]/g, "").slice(0, 4) || "BANK";

/**
 * Inline, searchable bank list (mockup "Tambah rekening · cari bank").
 * `banks` = [{ code, name }] from the Xendit catalog; value = channel code.
 */
export default function BankPicker({ banks = [], value, onChange, error, autoFocus = false }) {
    const id = useId();
    const listRef = useRef(null);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = q
            ? banks.filter(
                  (b) =>
                      b.name.toLowerCase().includes(q) ||
                      b.code.toLowerCase().includes(q),
              )
            : banks;
        // Keep the chosen bank visible at the top when not searching.
        if (!q && value) {
            const chosen = list.find((b) => b.code === value);
            if (chosen) return [chosen, ...list.filter((b) => b.code !== value)];
        }
        return list;
    }, [banks, query, value]);

    const choose = (bank) => {
        onChange(bank.code);
        setQuery("");
        setActive(0);
    };

    const move = (delta) => {
        const next = Math.max(0, Math.min(results.length - 1, active + delta));
        setActive(next);
        listRef.current
            ?.querySelector(`[data-index="${next}"]`)
            ?.scrollIntoView({ block: "nearest" });
    };

    const onKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            move(1);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            move(-1);
        } else if (e.key === "Enter" && results[active]) {
            e.preventDefault();
            choose(results[active]);
        }
    };

    return (
        <div>
            <label htmlFor={`${id}-search`} className="sr-only">
                Cari bank
            </label>
            <div
                className={`flex h-12 items-center gap-2.5 rounded-xl border bg-paper px-3.5 transition-colors focus-within:border-ink ${
                    error ? "border-status-danger" : "border-gold-line"
                }`}
            >
                <Search size={16} className="shrink-0 text-ink-soft" aria-hidden="true" />
                <input
                    id={`${id}-search`}
                    type="search"
                    role="combobox"
                    aria-expanded="true"
                    aria-controls={`${id}-list`}
                    aria-activedescendant={results[active] ? `${id}-${results[active].code}` : undefined}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setActive(0);
                    }}
                    onKeyDown={onKeyDown}
                    placeholder="Cari bank, mis. BCA atau syariah"
                    autoComplete="off"
                    autoFocus={autoFocus}
                    className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-ink placeholder:font-medium placeholder:text-ink-soft outline-none focus:outline-none focus:ring-0"
                />
            </div>

            <p className="mt-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-soft">
                {query ? `Hasil · ${results.length} bank` : `${banks.length} bank · dari daftar Xendit`}
            </p>

            <ul
                id={`${id}-list`}
                ref={listRef}
                role="listbox"
                aria-label="Daftar bank"
                className="max-h-56 overflow-y-auto overscroll-contain rounded-2xl border border-gold-line bg-paper"
            >
                {results.length === 0 ? (
                    <li className="px-4 py-4 text-sm text-ink-soft">
                        Bank tidak ditemukan. Coba nama lain.
                    </li>
                ) : (
                    results.map((bank, index) => {
                        const selected = bank.code === value;
                        return (
                            <li
                                key={bank.code}
                                id={`${id}-${bank.code}`}
                                data-index={index}
                                role="option"
                                aria-selected={selected}
                                onPointerDown={(e) => e.preventDefault()}
                                onClick={() => choose(bank)}
                                onMouseEnter={() => setActive(index)}
                                className={`flex cursor-pointer items-center gap-3 border-b border-gold-line px-3.5 py-3 last:border-b-0 transition-colors ${
                                    selected ? "bg-cream-deep" : index === active ? "bg-cream" : ""
                                }`}
                            >
                                <BankBadge code={bankBadgeCode(bank.code)} active={selected} />
                                <span className={`flex-1 text-[13px] text-ink ${selected ? "font-extrabold" : "font-semibold"}`}>
                                    {bank.name}
                                </span>
                                {selected && <Check size={16} className="text-ink" aria-hidden="true" />}
                            </li>
                        );
                    })
                )}
            </ul>

            {error && <p className="mt-1.5 text-xs font-semibold text-status-danger">{error}</p>}
        </div>
    );
}
