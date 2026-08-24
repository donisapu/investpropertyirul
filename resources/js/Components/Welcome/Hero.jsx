import { useEffect, useState } from "react";

export default function Hero({ landings, settings, sliders }) {
    const heroSlides =
        sliders && sliders.length > 0
            ? sliders.map((slider) => ({
                  image: `/storage/${slider.image_path}`,
                  title: slider.title || "Villa Collection",
              }))
            : [];

    const [activeSlide, setActiveSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const totalSlides = heroSlides.length;

    const nextSlide = () => {
        if (!totalSlides) return;

        setActiveSlide((current) =>
            current === totalSlides - 1 ? 0 : current + 1
        );
    };

    const prevSlide = () => {
        if (!totalSlides) return;

        setActiveSlide((current) =>
            current === 0 ? totalSlides - 1 : current - 1
        );
    };

    const goToSlide = (index) => {
        setActiveSlide(index);
    };

    /*
     * Auto slide
     */
    useEffect(() => {
        if (!totalSlides || isPaused) return;

        const timer = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(timer);
    }, [activeSlide, isPaused, totalSlides]);

    /*
     * Ambil preview slide berikutnya
     */
    const getNextIndex = (offset) => {
        if (!totalSlides) return 0;

        return (activeSlide + offset) % totalSlides;
    };

    return (
        <section
            id="top"
            className="
                relative
                min-h-[760px]
                overflow-hidden
                bg-mono-950
                text-white
                md:h-[92vh]
                md:min-h-[680px]
            "
        >
            {/* =====================================================
                BACKGROUND
            ====================================================== */}
            <div className="absolute inset-0">

                {/* Main hero image */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-cover
                        bg-center
                        scale-[1.02]
                        transition-all
                        duration-[2000ms]
                    "
                    style={{
                        backgroundImage: `url(/storage/${landings.hero_path})`,
                    }}
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/45" />

                {/* Cinematic gradient */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-r
                        from-black/85
                        via-black/55
                        to-black/25
                    "
                />

                {/* Bottom cinematic gradient */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/90
                        via-transparent
                        to-black/30
                    "
                />

                {/* Atmospheric light */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-[radial-gradient(circle_at_70%_40%,rgba(255,255,255,0.12),transparent_32%)]
                    "
                />

                {/* Architectural frame */}
                <div
                    className="
                        absolute
                        inset-5
                        border
                        border-white/10
                        md:inset-8
                    "
                />

                {/* Decorative circle */}
                <div
                    className="
                        absolute
                        -right-[300px]
                        -top-[280px]
                        h-[700px]
                        w-[700px]
                        rounded-full
                        border
                        border-white/[0.06]
                    "
                />

                <div
                    className="
                        absolute
                        -right-[240px]
                        -top-[220px]
                        h-[580px]
                        w-[580px]
                        rounded-full
                        border
                        border-white/[0.04]
                    "
                />
            </div>

            {/* =====================================================
                TOP RIGHT LABEL
            ====================================================== */}
            <div
                className="
                    absolute
                    right-8
                    top-8
                    z-20
                    hidden
                    items-center
                    gap-3
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.3em]
                    text-white/40
                    lg:flex
                "
            >
                <span>Premium Property</span>

                <span className="h-px w-8 bg-white/30" />

                <span>Est. 2026</span>
            </div>

            {/* =====================================================
                SIDE LABEL
            ====================================================== */}
            <div
                className="
                    absolute
                    left-6
                    top-1/2
                    z-20
                    hidden
                    -translate-y-1/2
                    -rotate-90
                    items-center
                    gap-4
                    text-[9px]
                    uppercase
                    tracking-[0.35em]
                    text-white/30
                    lg:flex
                "
            >
                Architecture

                <span className="h-px w-10 bg-white/30" />

                Development
            </div>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}
            <div className="relative z-10 h-full">

                <div
                    className="
                        mx-auto
                        flex
                        h-full
                        max-w-7xl
                        items-center
                        px-6
                        py-24
                        sm:px-8
                        lg:px-12
                    "
                >
                    <div
                        className="
                            grid
                            w-full
                            items-center
                            gap-12
                            lg:grid-cols-[1fr_420px]
                            xl:grid-cols-[1fr_500px]
                        "
                    >

                        {/* =================================================
                            LEFT CONTENT
                        ================================================== */}
                        <div className="max-w-3xl">

                            {/* Label */}
                            <div
                                className="
                                    mb-5
                                    flex
                                    items-center
                                    gap-3
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.3em]
                                    text-white/60
                                "
                            >
                                <span className="h-px w-8 bg-white/40" />

                                <span>
                                    {landings?.subheader}
                                </span>
                            </div>

                            {/* Heading */}
                            <h1
                                className="
                                    max-w-4xl
                                    text-4xl
                                    font-semibold
                                    uppercase
                                    leading-[1.02]
                                    tracking-[0.08em]
                                    text-white
                                    drop-shadow-2xl
                                    sm:text-5xl
                                    md:text-6xl
                                    xl:text-7xl
                                "
                            >
                                {landings?.header}
                            </h1>

                            {/* Description */}
                            <p
                                className="
                                    mt-6
                                    max-w-xl
                                    text-sm
                                    leading-7
                                    text-white/65
                                    sm:text-base
                                "
                            >
                                {landings?.description}
                            </p>

                            {/* =================================================
                                INFORMATION STRIP
                            ================================================== */}
                            <div className="mt-8 max-w-4xl">

                                <div className="h-px w-full bg-white/20" />

                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        divide-x
                                        divide-white/10
                                        py-4
                                        sm:grid-cols-4
                                    "
                                >
                                    <div className="px-3 first:pl-0">
                                        <span className="text-[9px] text-white/35">
                                            01
                                        </span>

                                        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/75 sm:text-xs">
                                            Development
                                        </p>
                                    </div>

                                    <div className="px-3">
                                        <span className="text-[9px] text-white/35">
                                            02
                                        </span>

                                        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/75 sm:text-xs">
                                            Architecture
                                        </p>
                                    </div>

                                    <div className="px-3">
                                        <span className="text-[9px] text-white/35">
                                            03
                                        </span>

                                        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/75 sm:text-xs">
                                            Construction
                                        </p>
                                    </div>

                                    <div className="px-3">
                                        <span className="text-[9px] text-white/35">
                                            04
                                        </span>

                                        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/75 sm:text-xs">
                                            Real Estate Agency
                                        </p>
                                    </div>
                                </div>

                                <div className="h-px w-full bg-white/10" />
                            </div>

                            {/* =================================================
                                CTA
                            ================================================== */}
                            <div
                                className="
                                    mt-7
                                    flex
                                    flex-col
                                    items-start
                                    gap-5
                                    sm:flex-row
                                    sm:items-center
                                "
                            >
                                <a
                                    href={`https://wa.me/${settings?.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        group
                                        inline-flex
                                        items-center
                                        gap-4
                                        rounded-full
                                        border
                                        border-white/30
                                        bg-white
                                        px-6
                                        py-3
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-[0.16em]
                                        text-mono-900
                                        shadow-2xl
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:bg-white/90
                                    "
                                >
                                    <span>Contact Us</span>

                                    <span
                                        className="
                                            flex
                                            h-7
                                            w-7
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-mono-900
                                            text-white
                                            transition-transform
                                            duration-300
                                            group-hover:translate-x-1
                                        "
                                    >
                                        →
                                    </span>
                                </a>

                                <span
                                    className="
                                        text-[10px]
                                        uppercase
                                        tracking-[0.2em]
                                        text-white/35
                                    "
                                >
                                    Discover your next destination
                                </span>
                            </div>
                        </div>

                        {/* =================================================
                            RIGHT SIDE SLIDER
                        ================================================== */}
                        {totalSlides > 0 && (
                            <div
                                className="
                                    relative
                                    mx-auto
                                    w-full
                                    max-w-[500px]
                                    lg:mx-0
                                    lg:ml-auto
                                "
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                            >

                                {/* Decorative number */}
                                <div
                                    className="
                                        absolute
                                        -left-10
                                        top-4
                                        z-20
                                        hidden
                                        text-[9px]
                                        font-medium
                                        uppercase
                                        tracking-[0.3em]
                                        text-white/40
                                        lg:block
                                    "
                                >
                                    Selected View
                                </div>

                                {/* Main slider image */}
                                <div
                                    className="
                                        relative
                                        h-[300px]
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-white/20
                                        bg-black/30
                                        shadow-2xl
                                        backdrop-blur-sm
                                        sm:h-[360px]
                                        lg:h-[430px]
                                    "
                                >
                                    {heroSlides.map((slide, index) => (
                                        <div
                                            key={index}
                                            className={`
                                                absolute
                                                inset-0
                                                transition-all
                                                duration-700
                                                ease-out
                                                ${
                                                    activeSlide === index
                                                        ? "translate-x-0 opacity-100"
                                                        : "translate-x-8 opacity-0"
                                                }
                                            `}
                                        >
                                            <img
                                                src={slide.image}
                                                alt={slide.title}
                                                draggable="false"
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                "
                                            />

                                            {/* Image overlay */}
                                            <div
                                                className="
                                                    absolute
                                                    inset-0
                                                    bg-gradient-to-t
                                                    from-black/70
                                                    via-transparent
                                                    to-black/10
                                                "
                                            />
                                        </div>
                                    ))}

                                    {/* Image information */}
                                    <div
                                        className="
                                            absolute
                                            bottom-0
                                            left-0
                                            right-0
                                            z-10
                                            p-5
                                            sm:p-6
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                items-end
                                                justify-between
                                                gap-4
                                            "
                                        >
                                            <div>
                                                <p
                                                    className="
                                                        text-[9px]
                                                        uppercase
                                                        tracking-[0.25em]
                                                        text-white/50
                                                    "
                                                >
                                                    Villa Collection
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-sm
                                                        font-medium
                                                        uppercase
                                                        tracking-[0.12em]
                                                        text-white
                                                    "
                                                >
                                                    {heroSlides[activeSlide]?.title}
                                                </p>
                                            </div>

                                            <div
                                                className="
                                                    text-xs
                                                    font-medium
                                                    tracking-[0.2em]
                                                    text-white/60
                                                "
                                            >
                                                {String(
                                                    activeSlide + 1
                                                ).padStart(2, "0")}
                                                {" / "}
                                                {String(
                                                    totalSlides
                                                ).padStart(2, "0")}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress line */}
                                    <div
                                        className="
                                            absolute
                                            bottom-0
                                            left-0
                                            h-0.5
                                            bg-white
                                            transition-all
                                            duration-300
                                        "
                                        style={{
                                            width: `${((activeSlide + 1) / totalSlides) * 100}%`,
                                        }}
                                    />
                                </div>

                                {/* =================================================
                                    PREVIEW CARDS
                                ================================================== */}
                                <div className="mt-4 flex items-center gap-3">

                                    {[1, 2].map((offset) => {
                                        const index =
                                            getNextIndex(offset);

                                        return (
                                            <button
                                                key={offset}
                                                type="button"
                                                onClick={() =>
                                                    goToSlide(index)
                                                }
                                                className="
                                                    group
                                                    relative
                                                    h-16
                                                    w-24
                                                    overflow-hidden
                                                    rounded-lg
                                                    border
                                                    border-white/15
                                                    bg-black/30
                                                    shadow-lg
                                                    transition-all
                                                    duration-300
                                                    hover:-translate-y-1
                                                    hover:border-white/40
                                                    sm:h-20
                                                    sm:w-28
                                                "
                                            >
                                                <img
                                                    src={
                                                        heroSlides[index]
                                                            ?.image
                                                    }
                                                    alt={
                                                        heroSlides[index]
                                                            ?.title
                                                    }
                                                    className="
                                                        h-full
                                                        w-full
                                                        object-cover
                                                        opacity-60
                                                        transition
                                                        duration-500
                                                        group-hover:scale-110
                                                        group-hover:opacity-100
                                                    "
                                                />

                                                <div
                                                    className="
                                                        absolute
                                                        inset-0
                                                        bg-black/30
                                                    "
                                                />

                                                <span
                                                    className="
                                                        absolute
                                                        bottom-2
                                                        left-2
                                                        text-[9px]
                                                        font-medium
                                                        tracking-[0.15em]
                                                        text-white/70
                                                    "
                                                >
                                                    {String(
                                                        index + 1
                                                    ).padStart(2, "0")}
                                                </span>
                                            </button>
                                        );
                                    })}

                                    {/* Navigation */}
                                    <div
                                        className="
                                            ml-auto
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <button
                                            type="button"
                                            onClick={prevSlide}
                                            aria-label="Previous slide"
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                border-white/20
                                                bg-black/20
                                                text-white
                                                backdrop-blur-md
                                                transition
                                                hover:bg-white
                                                hover:text-black
                                            "
                                        >
                                            ←
                                        </button>

                                        <button
                                            type="button"
                                            onClick={nextSlide}
                                            aria-label="Next slide"
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                border-white/20
                                                bg-black/20
                                                text-white
                                                backdrop-blur-md
                                                transition
                                                hover:bg-white
                                                hover:text-black
                                            "
                                        >
                                            →
                                        </button>
                                    </div>
                                </div>

                                {/* Auto play indicator */}
                                <div
                                    className="
                                        mt-3
                                        flex
                                        items-center
                                        justify-between
                                        text-[9px]
                                        uppercase
                                        tracking-[0.2em]
                                        text-white/30
                                    "
                                >
                                    <span>
                                        {isPaused
                                            ? "Paused"
                                            : "Auto Preview"}
                                    </span>

                                    <span>
                                        Explore Collection
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </section>
    );
}