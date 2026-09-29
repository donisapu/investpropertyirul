import React, { useEffect, useId, useMemo, useRef, useState } from "react";

/**
 * Searchable bank picker (combobox). `banks` is [{ code, name }] from the
 * backend Xendit bank catalog; `value` is the selected channel code.
 */
export default function BankSelect({ banks = [], value, onChange, error }) {
    const listId = useId();
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const selected = banks.find((b) => b.code === value) || null;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return banks;
        return banks.filter(
            (b) =>
                b.name.toLowerCase().includes(q) ||
                b.code.toLowerCase().includes(q),
        );
    }, [banks, query]);

    useEffect(() => setActiveIndex(0), [query]);

    // Close when clicking outside.
    useEffect(() => {
        if (!open) return undefined;
        const onPointerDown = (e) => {
            if (!wrapperRef.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [open]);

    const choose = (bank) => {
        onChange(bank.code);
        setQuery("");
        setOpen(false);
    };

    const onKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && open) {
            e.preventDefault();
            if (filtered[activeIndex]) choose(filtered[activeIndex]);
        } else if (e.key === "Escape") {
            setOpen(false);
            setQuery("");
        }
    };

    return (
        <div ref={wrapperRef} className="relative">
            <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={open}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={
                    open && filtered[activeIndex]
                        ? `${listId}-${filtered[activeIndex].code}`
                        : undefined
                }
                value={open ? query : selected?.name || ""}
                placeholder={selected ? selected.name : "Cari bank..."}
                onFocus={() => setOpen(true)}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                onKeyDown={onKeyDown}
                className={`w-full border rounded-lg p-2.5 ${error ? "border-red-400" : "border-gray-300"}`}
                autoComplete="off"
            />

            {open && (
                <ul
                    id={listId}
                    role="listbox"
                    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg"
                >
                    {filtered.length === 0 ? (
                        <li className="px-3 py-2 text-sm text-gray-500">
                            Bank tidak ditemukan
                        </li>
                    ) : (
                        filtered.map((bank, index) => (
                            <li
                                key={bank.code}
                                id={`${listId}-${bank.code}`}
                                role="option"
                                aria-selected={bank.code === value}
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    choose(bank);
                                }}
                                onMouseEnter={() => setActiveIndex(index)}
                                className={`cursor-pointer px-3 py-2 text-sm ${
                                    index === activeIndex ? "bg-blue-50" : ""
                                } ${bank.code === value ? "font-semibold" : ""}`}
                            >
                                {bank.name}
                            </li>
                        ))
                    )}
                </ul>
            )}

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
