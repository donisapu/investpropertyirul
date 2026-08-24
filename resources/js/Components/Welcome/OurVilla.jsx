import { useState, useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function OurVilla({ villa, sliders, landings }) {
    const CountUp = ({ end, suffix = "", duration = 1800 }) => {
        const [count, setCount] = useState(0);
        const [started, setStarted] = useState(false);
        const ref = useRef(null);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setStarted(true);
                        observer.disconnect();
                    }
                },
                { threshold: 0.3 }
            );

            if (ref.current) {
                observer.observe(ref.current);
            }

            return () => observer.disconnect();
        }, []);

        useEffect(() => {
            if (!started) return;

            let startTime;
            let animationFrame;

            const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;

                const progress = Math.min(
                    (timestamp - startTime) / duration,
                    1
                );

                // easeOutCubic
                const eased = 1 - Math.pow(1 - progress, 3);

                setCount(Math.floor(eased * end));

                if (progress < 1) {
                    animationFrame = requestAnimationFrame(animate);
                } else {
                    setCount(end);
                }
            };

            animationFrame = requestAnimationFrame(animate);

            return () => cancelAnimationFrame(animationFrame);
        }, [started, end, duration]);

        return (
            <span ref={ref}>
                {count}
                {suffix}
            </span>
        );
    };
    
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
        setStartX(
            e.touches
                ? e.touches[0].clientX
                : e.clientX
        );
        setDeltaX(0);
        updateWidth();
    };

    const move = (e) => {
        if (!dragging) return;

        const x = e.touches
            ? e.touches[0].clientX
            : e.clientX;

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
        <section className="relative overflow-hidden py-20 md:py-28">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a45c]/[0.04] blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

                {/* Section Heading */}
                <div className="mb-12 text-center md:mb-16">
                    <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c9a45c]">
                        Our Experience
                    </div>

                    <h2 className="font-serif text-3xl text-white md:text-4xl lg:text-5xl">
                        A Stay Beyond Expectations
                    </h2>

                    <div className="mx-auto mt-5 h-px w-16 bg-[#c9a45c]/60" />
                </div>

                {/* Counting Cards */}
                <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] backdrop-blur-sm md:grid-cols-4">

                    {/* Card 1 */}
                    <div className="group relative flex flex-col items-center justify-center px-5 py-10 text-center md:py-14">
                        <div className="pointer-events-none absolute inset-0 bg-[#c9a45c]/[0.03] opacity-0 transition duration-500 group-hover:opacity-100" />

                        <div className="relative">
                            <div className="font-serif text-4xl font-medium tracking-tight text-[#c9a45c] md:text-5xl lg:text-6xl">
                                <CountUp end={12} suffix="+" />
                            </div>

                            <div className="mt-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50 md:text-[10px]">
                                Years Experience
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="group relative flex flex-col items-center justify-center border-l border-white/10 px-5 py-10 text-center md:py-14">
                        <div className="pointer-events-none absolute inset-0 bg-[#c9a45c]/[0.03] opacity-0 transition duration-500 group-hover:opacity-100" />

                        <div className="relative">
                            <div className="font-serif text-4xl font-medium tracking-tight text-[#c9a45c] md:text-5xl lg:text-6xl">
                                <CountUp end={25} suffix="+" />
                            </div>

                            <div className="mt-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50 md:text-[10px]">
                                Luxury Villas
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="group relative flex flex-col items-center justify-center border-t border-white/10 px-5 py-10 text-center md:border-l md:border-t-0 md:py-14">
                        <div className="pointer-events-none absolute inset-0 bg-[#c9a45c]/[0.03] opacity-0 transition duration-500 group-hover:opacity-100" />

                        <div className="relative">
                            <div className="font-serif text-4xl font-medium tracking-tight text-[#c9a45c] md:text-5xl lg:text-6xl">
                                <CountUp end={98} suffix="%" />
                            </div>

                            <div className="mt-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50 md:text-[10px]">
                                Guest Satisfaction
                            </div>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="group relative flex flex-col items-center justify-center border-l border-t border-white/10 px-5 py-10 text-center md:py-14">
                        <div className="pointer-events-none absolute inset-0 bg-[#c9a45c]/[0.03] opacity-0 transition duration-500 group-hover:opacity-100" />

                        <div className="relative">
                            <div className="font-serif text-4xl font-medium tracking-tight text-[#c9a45c] md:text-5xl lg:text-6xl">
                                <CountUp end={15} suffix="+" />
                            </div>

                            <div className="mt-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50 md:text-[10px]">
                                Destinations
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );

    return (
        <section
            id="our-villa"
            className="
                relative
                isolate
                overflow-hidden
                bg-[#e5e5e3]
                text-mono-900
            "
        >
            {/* =====================================================
                ABSTRACT BACKGROUND
            ====================================================== */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">

                {/* Soft base gradient */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.95),transparent_42%),linear-gradient(180deg,#f2f2f0_0%,#e7e7e5_55%,#ddddda_100%)]
                    "
                />

                {/* Large architectural circle */}
                <div
                    className="
                        absolute
                        -right-[180px]
                        -top-[220px]
                        h-[560px]
                        w-[560px]
                        rounded-full
                        border-[60px]
                        border-black/[0.055]
                    "
                />

                {/* Small secondary circle */}
                <div
                    className="
                        absolute
                        right-[12%]
                        top-[90px]
                        h-[180px]
                        w-[180px]
                        rounded-full
                        border
                        border-black/[0.06]
                    "
                />

                {/* Architectural blocks */}
                <div
                    className="
                        absolute
                        bottom-0
                        left-[-40px]
                        h-[360px]
                        w-[380px]
                        opacity-[0.10]
                    "
                >
                    <div
                        className="
                            absolute
                            bottom-0
                            left-8
                            h-[220px]
                            w-[100px]
                            skew-x-[-8deg]
                            bg-gradient-to-t
                            from-black/40
                            to-black/5
                        "
                    />

                    <div
                        className="
                            absolute
                            bottom-0
                            left-[125px]
                            h-[300px]
                            w-[130px]
                            skew-x-[-5deg]
                            bg-gradient-to-t
                            from-black/45
                            to-black/5
                        "
                    />

                    <div
                        className="
                            absolute
                            bottom-0
                            left-[240px]
                            h-[190px]
                            w-[95px]
                            skew-x-[8deg]
                            bg-gradient-to-t
                            from-black/35
                            to-black/5
                        "
                    />
                </div>

                {/* Fine contour lines */}
                <div
                    className="
                        absolute
                        -left-20
                        top-[40%]
                        h-[300px]
                        w-[430px]
                        opacity-[0.08]
                    "
                >
                    <div
                        className="
                            absolute
                            inset-0
                            rounded-[48%]
                            border
                            border-black/40
                            rotate-[-18deg]
                        "
                    />

                    <div
                        className="
                            absolute
                            inset-[28px]
                            rounded-[48%]
                            border
                            border-black/30
                            rotate-[-18deg]
                        "
                    />

                    <div
                        className="
                            absolute
                            inset-[56px]
                            rounded-[48%]
                            border
                            border-black/20
                            rotate-[-18deg]
                        "
                    />
                </div>

                {/* Dot grid */}
                <div
                    className="
                        absolute
                        right-[7%]
                        top-[35%]
                        h-24
                        w-24
                        opacity-30
                    "
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, #777 1.4px, transparent 1.4px)",
                        backgroundSize: "13px 13px",
                    }}
                />

                {/* Flowing lines */}
                <svg
                    className="
                        absolute
                        bottom-0
                        left-0
                        h-[200px]
                        w-full
                        opacity-[0.16]
                    "
                    viewBox="0 0 1440 220"
                    fill="none"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M-40 150C220 30 330 210 590 120C830 40 1010 35 1490 125"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        className="text-black"
                    />

                    <path
                        d="M-80 185C180 75 340 250 620 155C900 60 1110 70 1510 165"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-black"
                    />

                    <path
                        d="M-80 210C190 105 350 270 650 180C940 85 1130 100 1510 195"
                        stroke="currentColor"
                        strokeWidth="0.8"
                        className="text-black"
                    />
                </svg>
            </div>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}
            <div
                className="
                    relative
                    z-10
                    mx-auto
                    max-w-6xl
                    px-4
                    py-14
                    sm:px-6
                    sm:py-18
                    lg:px-8
                    lg:py-24
                "
            >

                {/* =================================================
                    HEADER
                ================================================== */}
                <div className="mx-auto max-w-3xl text-center">

                    <div
                        className="
                            mb-4
                            inline-flex
                            items-center
                            gap-3
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-[0.28em]
                            text-mono-500
                        "
                    >
                        <span className="h-px w-8 bg-mono-400" />

                        Our Villa

                        <span className="h-px w-8 bg-mono-400" />
                    </div>

                    <h2
                        className="
                            text-3xl
                            font-semibold
                            uppercase
                            leading-[1.1]
                            tracking-tight
                            text-mono-900
                            sm:text-4xl
                            lg:text-5xl
                        "
                    >
                        {landings?.slider_title}
                    </h2>

                    <div
                        className="
                            mx-auto
                            mt-5
                            h-px
                            w-16
                            bg-mono-900/20
                        "
                    />

                    <p
                        className="
                            mx-auto
                            mt-5
                            max-w-xl
                            text-sm
                            leading-7
                            text-mono-600
                        "
                    >
                        Discover our villa collection through
                        carefully selected views of the property.
                    </p>
                </div>

                {/* =================================================
                    CAROUSEL
                ================================================== */}
                <div className="mt-10 sm:mt-12">

                    <div
                        className="
                            group
                            relative
                            overflow-hidden
                            rounded-2xl
                            border
                            border-black/10
                            bg-white/70
                            p-1.5
                            shadow-[0_20px_60px_rgba(0,0,0,0.10)]
                            backdrop-blur-sm
                            sm:rounded-3xl
                            sm:p-2
                        "
                    >

                        <div
                            ref={trackRef}
                            className="
                                relative
                                overflow-hidden
                                rounded-xl
                                select-none
                                touch-pan-x
                                bg-mono-200
                                sm:rounded-2xl
                            "
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
                                    transform: `translateX(calc(${
                                        -i * 100
                                    }% + ${
                                        dragging && width
                                            ? (deltaX / width) * 100
                                            : 0
                                    }%))`,
                                    transition: dragging
                                        ? "none"
                                        : "transform 300ms ease",
                                }}
                            >
                                {activeImages.map((src, idx) => (
                                    <img
                                        key={idx}
                                        src={src}
                                        alt=""
                                        draggable="false"
                                        className="
                                            aspect-[16/6]
                                            w-full
                                            shrink-0
                                            object-cover
                                        "
                                    />
                                ))}
                            </div>

                            {/* Image overlay */}
                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    bg-gradient-to-t
                                    from-black/20
                                    via-transparent
                                    to-transparent
                                "
                            />

                            {/* =================================================
                                PREVIOUS BUTTON
                            ================================================== */}
                            <button
                                type="button"
                                onClick={prev}
                                aria-label="Previous image"
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    flex
                                    h-10
                                    w-10
                                    -translate-y-1/2
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-white/40
                                    bg-black/30
                                    text-white
                                    shadow-lg
                                    backdrop-blur-md
                                    transition-all
                                    duration-300
                                    hover:scale-105
                                    hover:bg-black/60
                                    sm:h-11
                                    sm:w-11
                                "
                            >
                                <svg
                                    className="h-5 w-5"
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

                            {/* =================================================
                                NEXT BUTTON
                            ================================================== */}
                            <button
                                type="button"
                                onClick={next}
                                aria-label="Next image"
                                className="
                                    absolute
                                    right-4
                                    top-1/2
                                    flex
                                    h-10
                                    w-10
                                    -translate-y-1/2
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-white/40
                                    bg-black/30
                                    text-white
                                    shadow-lg
                                    backdrop-blur-md
                                    transition-all
                                    duration-300
                                    hover:scale-105
                                    hover:bg-black/60
                                    sm:h-11
                                    sm:w-11
                                "
                            >
                                <svg
                                    className="h-5 w-5"
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

                            {/* =================================================
                                INDICATOR
                            ================================================== */}
                            {activeImages.length > 1 && (
                                <div
                                    className="
                                        absolute
                                        bottom-4
                                        left-1/2
                                        flex
                                        -translate-x-1/2
                                        items-center
                                        gap-1.5
                                        rounded-full
                                        border
                                        border-white/20
                                        bg-black/25
                                        px-3
                                        py-2
                                        backdrop-blur-md
                                    "
                                >
                                    {activeImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => go(idx)}
                                            aria-label={`Go to image ${idx + 1}`}
                                            className={`
                                                h-1.5
                                                rounded-full
                                                transition-all
                                                duration-300
                                                ${
                                                    i === idx
                                                        ? "w-6 bg-white"
                                                        : "w-1.5 bg-white/50 hover:bg-white/80"
                                                }
                                            `}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* =================================================
                    BOTTOM DECORATIVE INFO
                ================================================== */}
                <div
                    className="
                        mt-8
                        flex
                        flex-col
                        items-center
                        justify-between
                        gap-4
                        text-center
                        sm:flex-row
                        sm:text-left
                    "
                >
                    <div>
                        <p
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.25em]
                                text-mono-500
                            "
                        >
                            Curated Collection
                        </p>

                        <p className="mt-1 text-sm text-mono-600">
                            Experience the character of our villa.
                        </p>
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-xs
                            font-medium
                            uppercase
                            tracking-[0.15em]
                            text-mono-500
                        "
                    >
                        <span className="h-px w-8 bg-mono-400" />
                        {String(i + 1).padStart(2, "0")} /{" "}
                        {String(activeImages.length).padStart(2, "0")}
                    </div>
                </div>
            </div>
        </section>
    );
}