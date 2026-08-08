import { useState, useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function OurVilla({ villa, sliders, landings }) {
    const dummyImgs = [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1658280024253-34cafdfbb002?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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

    const updateWidth = () => {
        if (trackRef.current) {
            setWidth(trackRef.current.getBoundingClientRect().width);
        }
    };

    useEffect(() => {
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const go = (n) => {
        const len = activeImages.length;
        setI((n + len) % len);
    };

    const prev = () => go(i - 1);
    const next = () => go(i + 1);

    const start = (e) => {
        setDragging(true);
        setStartX(e.touches ? e.touches[0].clientX : e.clientX);
        setDeltaX(0);
        updateWidth();
    };

    const move = (e) => {
        if (!dragging) return;
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        setDeltaX(x - startX);
    };

    const end = () => {
        if (!dragging) return;
        const t = width * 0.15;
        if (deltaX > t) prev();
        else if (deltaX < -t) next();
        setDragging(false);
        setDeltaX(0);
    };

    return (
        <section
            id="our-villa"
            className="bg-[#E0E0E0] relative text-mono-900"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
                <h2 className="text-center text-2xl sm:text-3xl font-semibold tracking-wide uppercase text-mono-900">
                    {landings?.slider_title}
                </h2>
                {/* Carousel */}
                <div className="mt-6">
                    <div
                        ref={trackRef}
                        className="relative overflow-hidden rounded-md select-none touch-pan-x border border-mono-500/40"
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
                                transform: `translateX(calc(${-i * 100}% + ${dragging ? (deltaX / width) * 100 : 0}%))`,
                                transition: dragging
                                    ? "none"
                                    : "transform 300ms ease",
                            }}
                        >
                            {/* 3. Ganti imgs.map jadi activeImages.map */}
                            {activeImages.map((src, idx) => (
                                <img
                                    key={idx}
                                    src={src}
                                    alt=""
                                    className="w-full shrink-0 aspect-[16/6] object-cover"
                                />
                            ))}
                        </div>

                        {/* Tombol Navigasi Prev */}
                        <button
                            type="button"
                            onClick={prev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-mono-100/90 text-mono-900 shadow hover:bg-mono-900 hover:text-mono-100"
                        >
                            <svg
                                className="h-5 w-5 mx-auto"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12.79 4.21a1 1 0 010 1.42L9.42 9l3.37 3.37a1 1 0 11-1.42 1.42l-4.08-4.09a1 1 0 010-1.42l4.08-4.09a1 1 0 011.42 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        {/* Tombol Navigasi Next */}
                        <button
                            type="button"
                            onClick={next}
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 text-slate-900 shadow hover:bg-white"
                        >
                            <svg
                                className="h-5 w-5 mx-auto"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.21 15.79a1 1 0 010-1.42L10.58 11 7.21 7.63a1 1 0 111.42-1.42l4.08 4.09a1 1 0 010 1.42l-4.08 4.09a1 1 0 01-1.42 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        {/* 4. Indicator Dots: Ganti dari imgs.map ke activeImages.map */}
                        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
                            {activeImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => go(idx)}
                                    className={`h-1.5 w-1.5 rounded-full ${i === idx ? "bg-slate-900" : "bg-slate-400"}`}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
