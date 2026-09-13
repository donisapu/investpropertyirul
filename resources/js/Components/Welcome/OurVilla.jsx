import { useState, useRef, useEffect, useCallback } from "react";

export default function OurVilla({ villa, sliders, landings }) {
    const dummyImgs = [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1658280024253-34cafdfbb002?q=80&w=2960&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1280&auto=format&fit=crop",
    ];

    const activeImages =
        sliders && sliders.length > 0
            ? sliders.map((slider) => `/storage/${slider.image_path}`)
            : dummyImgs;

    const [i, setI] = useState(0);

    const go = useCallback((n) => {
        const len = activeImages.length;
        setI((n + len) % len);
    }, [activeImages.length]);

    const prev = useCallback(() => go(i - 1), [go, i]);
    const next = useCallback(() => go(i + 1), [go, i]);

    return (
        <section
            id="our-villa"
            className="relative isolate overflow-hidden bg-[#e5e5e3] text-mono-900"
        >
            {/* BACKGROUND ASLI PERTAHANKAN */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.95),transparent_42%),linear-gradient(180deg,#f2f2f0_0%,#e7e7e5_55%,#ddddda_100%)]" />
                <div className="absolute -right-[180px] -top-[220px] h-[560px] w-[560px] rounded-full border-[60px] border-black/[0.055]" />
                <div className="absolute right-[12%] top-[90px] h-[180px] w-[180px] rounded-full border border-black/[0.06]" />
            </div>

            {/* MAIN CONTENT */}
            <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
                
                {/* LAYOUT BARU: HEADER + COUNTER & NAVIGASI DALAM SATU BARIS */}
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
                    <div className="text-center sm:text-left">
                        <div className="mb-2 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-mono-500">
                            <span className="h-px w-8 bg-mono-400" />
                            Our Villa
                        </div>
                        <h2 className="text-3xl font-semibold uppercase leading-[1.1] tracking-tight text-mono-900 sm:text-4xl">
                            {landings?.slider_title ?? "Villa Collection"}
                        </h2>
                    </div>

                    {/* COUNTER & NAVIGATION BUTTONS (Ditaruh di kanan header) */}
                    {activeImages.length > 1 && (
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-xs font-medium tracking-widest text-mono-500">
                                <strong className="text-base font-bold text-mono-900">
                                    {String(i + 1).padStart(2, "0")}
                                </strong>
                                / {String(activeImages.length).padStart(2, "0")}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={prev}
                                    aria-label="Previous image"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 text-mono-900 shadow-sm transition-all hover:bg-mono-900 hover:text-white active:scale-95"
                                >
                                    &#8592;
                                </button>
                                <button
                                    type="button"
                                    onClick={next}
                                    aria-label="Next image"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 text-mono-900 shadow-sm transition-all hover:bg-mono-900 hover:text-white active:scale-95"
                                >
                                    &#8594;
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* MAIN CAROUSEL DISPLAY */}
                <div className="mt-8">
                    <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white/50 p-2 shadow-lg backdrop-blur-sm sm:rounded-3xl">
                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-mono-200 sm:rounded-2xl">
                            <img
                                src={activeImages[i]}
                                alt={`Villa preview ${i + 1}`}
                                className="h-full w-full object-cover transition-all duration-500 ease-in-out"
                            />
                        </div>
                    </div>
                </div>

                {/* THUMBNAILS PREVIEW BAR (Tambahan Tata Letak Baru di Bawah) */}
                {activeImages.length > 1 && (
                    <div className="mt-4 flex justify-center gap-3 overflow-x-auto py-2">
                        {activeImages.map((src, idx) => (
                            <button
                                key={idx}
                                onClick={() => go(idx)}
                                className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                                    i === idx
                                        ? "border-mono-900 opacity-100 scale-105 shadow-md"
                                        : "border-transparent opacity-50 hover:opacity-80"
                                }`}
                            >
                                <img
                                    src={src}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
}