import { useState, useRef, useEffect, useCallback } from "react";

export default function OurVilla({ villa, sliders, landings }) {
    const dummyImgs = [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1658280024253-34cafdfbb002?q=80&w=2960&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1280&auto=format&fit=crop",
    ];

    const activeImages =
        sliders && sliders.length > 0
            ? sliders.map((slider) => ({
                  src: `/storage/${slider.image_path}`,
                  title: slider.title || "Villa Showcase",
              }))
            : dummyImgs.map((src, index) => ({
                  src,
                  title: `Villa View ${index + 1}`,
              }));

    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto Play Slider (5 detik)
    useEffect(() => {
        if (isHovered || activeImages.length <= 1) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % activeImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isHovered, activeImages.length]);

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length);
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % activeImages.length);
    };

    return (
        <section
            id="our-villa"
            className="relative isolate overflow-hidden bg-[#111111] py-20 text-white sm:py-28"
        >
            {/* AMBIENT GLOW BACKGROUND */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
                <div className="absolute left-1/2 top-1/4 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* HEADER SECTION */}
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                            Exclusive Experience
                        </span>
                        <h2 className="mt-2 text-3xl font-light uppercase tracking-wide sm:text-4xl lg:text-5xl">
                            {landings?.slider_title ?? "Our Villa Spaces"}
                        </h2>
                    </div>

                    {/* COUNTER NUMBERS */}
                    <div className="flex items-center gap-4 text-sm font-mono tracking-widest text-neutral-400">
                        <span className="text-2xl font-bold text-white">
                            {String(activeIndex + 1).padStart(2, "0")}
                        </span>
                        <div className="h-px w-10 bg-neutral-700" />
                        <span>{String(activeImages.length).padStart(2, "0")}</span>
                    </div>
                </div>

                {/* SLIDER CONTAINER */}
                <div
                    className="relative mt-12 overflow-hidden"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* MAIN IMAGE DISPLAY WITH FADE EFFECT */}
                    <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-2xl">
                        {activeImages.map((img, idx) => (
                            <div
                                key={idx}
                                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                                    idx === activeIndex
                                        ? "opacity-100 scale-100"
                                        : "opacity-0 scale-105 pointer-events-none"
                                }`}
                            >
                                <img
                                    src={img.src}
                                    alt={img.title}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* CAPTION OVERLAY */}
                                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                                    <h3 className="text-xl font-medium tracking-wide sm:text-2xl text-white">
                                        {img.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* NAVIGATION CONTROLS */}
                    <div className="absolute bottom-8 right-8 z-20 flex gap-3">
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black active:scale-95"
                            aria-label="Previous Slide"
                        >
                            &#8592;
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-all hover:bg-white hover:text-black active:scale-95"
                            aria-label="Next Slide"
                        >
                            &#8594;
                        </button>
                    </div>
                </div>

                {/* THUMBNAIL PREVIEW TRACK */}
                <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                    {activeImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                                idx === activeIndex
                                    ? "border-amber-400 opacity-100 scale-105"
                                    : "border-transparent opacity-40 hover:opacity-80"
                            }`}
                        >
                            <img
                                src={img.src}
                                alt={`Thumbnail ${idx + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}