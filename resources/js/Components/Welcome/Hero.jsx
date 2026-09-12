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
     * Ambil index slide berikutnya
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
                overflow-hidden
                bg-white
                text-neutral-900
            "
        >
            {/* =====================================================
                SUBTLE BACKGROUND
            ====================================================== */}
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="
                        absolute
                        right-0
                        top-0
                        h-[500px]
                        w-[500px]
                        translate-x-1/3
                        -translate-y-1/3
                        rounded-full
                        bg-neutral-50
                    "
                />

                <div
                    className="
                        absolute
                        bottom-0
                        left-0
                        h-px
                        w-full
                        bg-neutral-200
                    "
                />
            </div>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}
            <div className="relative z-10">
                <div
                    className="
                        mx-auto
                        flex
                        min-h-[680px]
                        max-w-7xl
                        items-center
                        px-6
                        py-24
                        sm:px-8
                        lg:min-h-[760px]
                        lg:px-12
                    "
                >
                    <div
                        className="
                            grid
                            w-full
                            items-center
                            gap-14
                            lg:grid-cols-[minmax(0,1fr)_460px]
                            xl:grid-cols-[minmax(0,1fr)_520px]
                        "
                    >
                        {/* =================================================
                            LEFT CONTENT
                        ================================================== */}
                        <div className="max-w-2xl">
                            {/* Small label */}
                            <div
                                className="
                                    mb-6
                                    flex
                                    items-center
                                    gap-3
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.28em]
                                    text-neutral-500
                                "
                            >
                                <span className="h-px w-8 bg-neutral-400" />

                                <span>
                                    {landings?.subheader}
                                </span>
                            </div>

                            {/* Heading */}
                            <h1
                                className="
                                    max-w-3xl
                                    text-4xl
                                    font-semibold
                                    uppercase
                                    leading-[1.04]
                                    tracking-[0.045em]
                                    text-neutral-950
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
                                    mt-7
                                    max-w-xl
                                    text-sm
                                    leading-7
                                    text-neutral-500
                                    sm:text-base
                                "
                            >
                                {landings?.description}
                            </p>

                            {/* =================================================
                                INFORMATION STRIP
                            ================================================== */}
                            <div className="mt-10 max-w-3xl">
                                <div className="h-px w-full bg-neutral-200" />

                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        divide-x
                                        divide-neutral-200
                                        py-5
                                        sm:grid-cols-4
                                    "
                                >
                                    <div className="px-3 first:pl-0">
                                        <span className="text-[9px] text-neutral-400">
                                            01
                                        </span>

                                        <p
                                            className="
                                                mt-1
                                                text-[10px]
                                                uppercase
                                                tracking-[0.12em]
                                                text-neutral-700
                                                sm:text-xs
                                            "
                                        >
                                            Development
                                        </p>
                                    </div>

                                    <div className="px-3">
                                        <span className="text-[9px] text-neutral-400">
                                            02
                                        </span>

                                        <p
                                            className="
                                                mt-1
                                                text-[10px]
                                                uppercase
                                                tracking-[0.12em]
                                                text-neutral-700
                                                sm:text-xs
                                            "
                                        >
                                            Architecture
                                        </p>
                                    </div>

                                    <div className="px-3">
                                        <span className="text-[9px] text-neutral-400">
                                            03
                                        </span>

                                        <p
                                            className="
                                                mt-1
                                                text-[10px]
                                                uppercase
                                                tracking-[0.12em]
                                                text-neutral-700
                                                sm:text-xs
                                            "
                                        >
                                            Construction
                                        </p>
                                    </div>

                                    <div className="px-3">
                                        <span className="text-[9px] text-neutral-400">
                                            04
                                        </span>

                                        <p
                                            className="
                                                mt-1
                                                text-[10px]
                                                uppercase
                                                tracking-[0.12em]
                                                text-neutral-700
                                                sm:text-xs
                                            "
                                        >
                                            Real Estate Agency
                                        </p>
                                    </div>
                                </div>

                                <div className="h-px w-full bg-neutral-200" />
                            </div>

                            {/* =================================================
                                CTA
                            ================================================== */}
                            <div
                                className="
                                    mt-8
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
                                        bg-neutral-950
                                        px-6
                                        py-3
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-[0.16em]
                                        text-white
                                        shadow-sm
                                        transition-all
                                        duration-300
                                        hover:-translate-y-0.5
                                        hover:bg-neutral-800
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
                                            bg-white
                                            text-neutral-950
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
                                        text-neutral-400
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
                                    max-w-[520px]
                                    lg:mx-0
                                    lg:ml-auto
                                "
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                            >
                                {/* Small heading */}
                                <div
                                    className="
                                        mb-4
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            text-[9px]
                                            font-medium
                                            uppercase
                                            tracking-[0.28em]
                                            text-neutral-400
                                        "
                                    >
                                        <span>Selected View</span>

                                        <span className="h-px w-8 bg-neutral-300" />
                                    </div>

                                    <span
                                        className="
                                            text-[10px]
                                            font-medium
                                            tracking-[0.18em]
                                            text-neutral-400
                                        "
                                    >
                                        {String(activeSlide + 1).padStart(
                                            2,
                                            "0"
                                        )}
                                        {" / "}
                                        {String(totalSlides).padStart(2, "0")}
                                    </span>
                                </div>

                                {/* =================================================
                                    MAIN IMAGE
                                ================================================== */}
                                <div
                                    className="
                                        relative
                                        h-[340px]
                                        overflow-hidden
                                        rounded-xl
                                        bg-neutral-100
                                        sm:h-[420px]
                                        lg:h-[500px]
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
                                                        : "translate-x-6 opacity-0"
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
                                                    transition-transform
                                                    duration-[5000ms]
                                                "
                                            />

                                            {/* Very subtle image gradient */}
                                            <div
                                                className="
                                                    absolute
                                                    inset-x-0
                                                    bottom-0
                                                    h-32
                                                    bg-gradient-to-t
                                                    from-black/45
                                                    to-transparent
                                                "
                                            />
                                        </div>
                                    ))}

                                    {/* =================================================
                                        IMAGE INFORMATION
                                    ================================================== */}
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
                                                        text-white/60
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
                                                    {
                                                        heroSlides[
                                                            activeSlide
                                                        ]?.title
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div
                                        className="
                                            absolute
                                            bottom-0
                                            left-0
                                            z-20
                                            h-0.5
                                            bg-white
                                            transition-all
                                            duration-300
                                        "
                                        style={{
                                            width: `${
                                                ((activeSlide + 1) /
                                                    totalSlides) *
                                                100
                                            }%`,
                                        }}
                                    />
                                </div>

                                {/* =================================================
                                    PREVIEW + NAVIGATION
                                ================================================== */}
                                <div
                                    className="
                                        mt-4
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
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
                                                    border-neutral-200
                                                    bg-neutral-100
                                                    transition-all
                                                    duration-300
                                                    hover:-translate-y-0.5
                                                    hover:border-neutral-400
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
                                                        group-hover:scale-105
                                                        group-hover:opacity-100
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
                                                        text-white
                                                        drop-shadow
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
                                                border-neutral-200
                                                bg-white
                                                text-neutral-700
                                                transition
                                                hover:border-neutral-900
                                                hover:bg-neutral-950
                                                hover:text-white
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
                                                border-neutral-200
                                                bg-white
                                                text-neutral-700
                                                transition
                                                hover:border-neutral-900
                                                hover:bg-neutral-950
                                                hover:text-white
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
                                        text-neutral-400
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
