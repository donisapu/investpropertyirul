export default function Hero({ landings, settings }) {
    return (
        <section
            id="top"
            className="
                relative
                h-[78vh]
                min-h-[620px]
                overflow-hidden
                bg-mono-950
                text-white
                md:h-[92vh]
            "
        >
            {/* =====================================================
                BACKGROUND IMAGE
            ====================================================== */}
            <div className="absolute inset-0">

                <div
                    className="
                        absolute
                        inset-0
                        bg-cover
                        bg-center
                        scale-[1.02]
                        transition-transform
                        duration-[2000ms]
                    "
                    style={{
                        backgroundImage: `url(/storage/${landings.hero_path})`,
                    }}
                />

                {/* Overall dark overlay */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-black/35
                    "
                />

                {/* Bottom cinematic gradient */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/90
                        via-black/30
                        to-black/20
                    "
                />

                {/* Center atmospheric light */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.12),transparent_38%)]
                    "
                />

                {/* Subtle architectural frame */}
                <div
                    className="
                        absolute
                        inset-6
                        border
                        border-white/10
                        md:inset-8
                    "
                />
            </div>

            {/* =====================================================
                DECORATIVE CORNER ELEMENT
            ====================================================== */}
            <div
                className="
                    absolute
                    right-8
                    top-8
                    hidden
                    items-center
                    gap-3
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.25em]
                    text-white/50
                    md:flex
                "
            >
                <span>Est.</span>

                <span className="h-px w-8 bg-white/30" />

                <span>2026</span>
            </div>

            {/* =====================================================
                SIDE LABEL
            ====================================================== */}
            <div
                className="
                    absolute
                    left-6
                    top-1/2
                    hidden
                    -translate-y-1/2
                    -rotate-90
                    origin-center
                    items-center
                    gap-3
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.35em]
                    text-white/40
                    lg:flex
                "
            >
                Premium Property Development

                <span className="h-px w-10 bg-white/30" />
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
                        items-end
                        px-6
                        pb-14
                        sm:px-8
                        sm:pb-16
                        lg:px-12
                        lg:pb-20
                    "
                >
                    <div className="w-full">

                        {/* =================================================
                            SMALL LABEL
                        ================================================== */}
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
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/30 text-[8px]">
                                01
                            </span>

                            <span className="h-px w-8 bg-white/40" />

                            <span>
                                {landings?.subheader}
                            </span>
                        </div>

                        {/* =================================================
                            TITLE
                        ================================================== */}
                        <h1
                            className="
                                max-w-4xl
                                text-4xl
                                font-semibold
                                uppercase
                                leading-[1.05]
                                tracking-[0.08em]
                                text-white
                                drop-shadow-lg
                                sm:text-5xl
                                md:text-6xl
                                lg:text-7xl
                            "
                        >
                            {landings?.header}
                        </h1>

                        {/* =================================================
                            DESCRIPTION
                        ================================================== */}
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
                                    <p
                                        className="
                                            text-[9px]
                                            font-medium
                                            uppercase
                                            tracking-[0.18em]
                                            text-white/40
                                        "
                                    >
                                        01
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[10px]
                                            font-medium
                                            uppercase
                                            tracking-[0.12em]
                                            text-white/80
                                            sm:text-xs
                                        "
                                    >
                                        Development
                                    </p>
                                </div>

                                <div className="px-3">
                                    <p
                                        className="
                                            text-[9px]
                                            font-medium
                                            uppercase
                                            tracking-[0.18em]
                                            text-white/40
                                        "
                                    >
                                        02
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[10px]
                                            font-medium
                                            uppercase
                                            tracking-[0.12em]
                                            text-white/80
                                            sm:text-xs
                                        "
                                    >
                                        Architecture
                                    </p>
                                </div>

                                <div className="px-3">
                                    <p
                                        className="
                                            text-[9px]
                                            font-medium
                                            uppercase
                                            tracking-[0.18em]
                                            text-white/40
                                        "
                                    >
                                        03
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[10px]
                                            font-medium
                                            uppercase
                                            tracking-[0.12em]
                                            text-white/80
                                            sm:text-xs
                                        "
                                    >
                                        Construction
                                    </p>
                                </div>

                                <div className="px-3">
                                    <p
                                        className="
                                            text-[9px]
                                            font-medium
                                            uppercase
                                            tracking-[0.18em]
                                            text-white/40
                                        "
                                    >
                                        04
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[10px]
                                            font-medium
                                            uppercase
                                            tracking-[0.12em]
                                            text-white/80
                                            sm:text-xs
                                        "
                                    >
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
                                    border-white/40
                                    bg-white
                                    px-6
                                    py-3
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-mono-900
                                    shadow-xl
                                    transition-all
                                    duration-300
                                    hover:-translate-y-0.5
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
                                    text-white/40
                                "
                            >
                                Discover your next destination
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* =====================================================
                SCROLL INDICATOR
            ====================================================== */}
            <div
                className="
                    absolute
                    bottom-8
                    right-8
                    hidden
                    flex-col
                    items-center
                    gap-3
                    text-[9px]
                    uppercase
                    tracking-[0.25em]
                    text-white/40
                    md:flex
                "
            >
                <span>Scroll</span>

                <span className="h-10 w-px bg-gradient-to-b from-white/50 to-transparent" />
            </div>
        </section>
    );
}