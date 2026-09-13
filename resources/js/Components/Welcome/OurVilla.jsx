import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

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
    const [width, setWidth] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [deltaX, setDeltaX] = useState(0);
    const trackRef = useRef(null);

    // Gunakan ResizeObserver untuk menangani responsivitas elemen secara akurat
    useEffect(() => {
        if (!trackRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setWidth(entry.contentRect.width);
            }
        });

        observer.observe(trackRef.current);
        return () => observer.disconnect();
    }, []);

    const go = useCallback((n) => {
        const len = activeImages.length;
        setI((n + len) % len);
    }, [activeImages.length]);

    const prev = useCallback(() => go(i - 1), [go, i]);
    const next = useCallback(() => go(i + 1), [go, i]);

    const start = (e) => {
        setDragging(true);
        setStartX(e.touches ? e.touches[0].clientX : e.clientX);
        setDeltaX(0);
    };

    const move = (e) => {
        if (!dragging) return;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        setDeltaX(x - startX);
    };

    const end = () => {
        if (!dragging) return;

        const threshold = width * 0.15;

        if (deltaX > threshold) {
            prev();
        } else if (deltaX < -threshold) {
            next();
        }

        setDragging(false);
        setDeltaX(0);
    };

    // Mencegah drag slider terpicu saat mengklik tombol navigasi
    const stopPropagation = (e) => e.stopPropagation();

    return (
        <section
            id="our-villa"
            className="relative isolate overflow-hidden bg-[#e5e5e3] text-mono-900"
        >
            {/* ABSTRACT BACKGROUND */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.95),transparent_42%),linear-gradient(180deg,#f2f2f0_0%,#e7e7e5_55%,#ddddda_100%)]" />
                <div className="absolute -right-[180px] -top-[220px] h-[560px] w-[560px] rounded-full border-[60px] border-black/[0.055]" />
                <div className="absolute right-[12%] top-[90px] h-[180px] w-[180px] rounded-full border border-black/[0.06]" />
            </div>

            {/* MAIN CONTENT */}
            <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-24">
                {/* HEADER */}
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-mono-500">
                        <span className="h-px w-8 bg-mono-400" />
                        Our Villa
                        <span className="h-px w-8 bg-mono-400" />
                    </div>

                    <h2 className="text-3xl font-semibold uppercase leading-[1.1] tracking-tight text-mono-900 sm:text-4xl lg:text-5xl">
                        {landings?.slider_title ?? "Villa Collection"}
                    </h2>

                    <div className="mx-auto mt-5 h-px w-16 bg-mono-900/20" />

                    <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-mono-600">
                        Discover our villa collection through carefully selected views of the property.
                    </p>
                </div>

                {/* CAROUSEL */}
                <div className="mt-10 sm:mt-12">
                    <div className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white/70 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.10)] backdrop-blur-sm sm:rounded-3xl sm:p-2">
                        <div
                            ref={trackRef}
                            className="relative overflow-hidden rounded-xl select-none touch-pan-x bg-mono-200 sm:rounded-2xl cursor-grab active:cursor-grabbing"
                            onMouseDown={start}
                            onMouseMove={move}
                            onMouseUp={end}
                            onMouseLeave={end}
                            onTouchStart={start}
                            onTouchMove={move}
                            onTouchEnd={end}
                        >
                            <div
                                className="flex w-full"
                                style={{
                                    transform: `translateX(calc(${-i * 100}% + ${
                                        dragging && width ? (deltaX / width) * 100 : 0
                                    }%))`,
                                    transition: dragging ? "none" : "transform 300ms ease",
                                }}
                            >
                                {activeImages.map((src, idx) => (
                                    <img
                                        key={idx}
                                        src={src}
                                        alt={`Villa preview ${idx + 1}`}
                                        draggable="false"
                                        className="aspect-[16/6] w-full shrink-0 object-cover"
                                    />
                                ))}
                            </div>

                            {/* Image Overlay */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                            {/* PREVIOUS BUTTON */}
                            {activeImages.length > 1 && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        stopPropagation(e);
                                        prev();
                                    }}
                                    onMouseDown={stopPropagation}
                                    onTouchStart={stopPropagation}
                                    aria-label="Previous image"
                                    className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-black/60 sm:h-11 sm:w-11"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.79 4.21a1 1 0 010 1.42L9.42 9l3.37 3.37a1 1 0 11-1.42 1.42l-4.08-4.09a1 1 0 010-1.42l4.08-4.09a1 1 0 011.42 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}

                            {/* NEXT BUTTON */}
                            {activeImages.length > 1 && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        stopPropagation(e);
                                        next();
                                    }}
                                    onMouseDown={stopPropagation}
                                    onTouchStart={stopPropagation}
                                    aria-label="Next image"
                                    className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-black/60 sm:h-11 sm:w-11"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.21 15.79a1 1 0 010-1.42L10.58 11 7.21 7.63a1 1 0 111.42-1.42l4.08 4.09a1 1 0 010 1.42l-4.08 4.09a1 1 0 01-1.42 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}

                            {/* INDICATOR */}
                            {activeImages.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/20 bg-black/25 px-3 py-2 backdrop-blur-md">
                                    {activeImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={(e) => {
                                                stopPropagation(e);
                                                go(idx);
                                            }}
                                            onMouseDown={stopPropagation}
                                            onTouchStart={stopPropagation}
                                            aria-label={`Go to image ${idx + 1}`}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                i === idx
                                                    ? "w-6 bg-white"
                                                    : "w-1.5 bg-white/50 hover:bg-white/80"
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}