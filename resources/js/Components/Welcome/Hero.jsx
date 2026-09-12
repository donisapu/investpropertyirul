export default function Hero({ landings, settings, sliders }) {
    // Ambil gambar dari landings.hero_path
    const heroImage = landings?.hero_path
        ? `/storage/${landings.hero_path}`
        : sliders && sliders.length > 0
        ? `/storage/${sliders[0].image_path}`
        : "/storage/default-hero.jpg";

    const heroTitle =
        landings?.title ||
        (sliders && sliders.length > 0 && sliders[0].title
            ? sliders[0].title
            : "Villa Collection");

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
                SUBTLE BACKGROUND DECORATION
            ====================================================== */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Soft circle */}
                <div
                    className="
                        absolute
                        -right-40
                        -top-40
                        h-[500px]
                        w-[500px]
                        rounded-full
                        bg-neutral-50
                    "
                />

                {/* Bottom subtle shape */}
                <div
                    className="
                        absolute
                        -bottom-40
                        -left-40
                        h-[400px]
                        w-[400px]
                        rounded-full
                        border
                        border-neutral-100
                    "
                />
            </div>

            {/* =====================================================
                HERO CONTENT
            ====================================================== */}
            <div className="relative z-10">
                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-6
                        pb-16
                        pt-8
                        sm:px-8
                        lg:px-12
                        lg:pb-20
                        lg:pt-10
                    "
                >
                    {/* =================================================
                        MAIN GRID
                    ================================================== */}
                    <div
                        className="
                            grid
                            items-center
                            gap-12
                            lg:grid-cols-12
                            xl:gap-16
                        "
                    >
                        {/* =================================================
                            LEFT CONTENT (7 COLS)
                        ================================================== */}
                        <div className="relative z-10 max-w-3xl lg:col-span-7">
                            {/* Eyebrow */}
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
                                <span className="h-px w-10 bg-neutral-400" />

                                <span>
                                    {landings?.subheader ||
                                        "Premium Property & Development"}
                                </span>
                            </div>

                            {/* Main Heading */}
                            <h1
                                className="
                                    max-w-4xl
                                    text-4xl
                                    font-semibold
                                    leading-[1.02]
                                    tracking-[-0.035em]
                                    text-neutral-950
                                    sm:text-5xl
                                    md:text-6xl
                                    xl:text-[72px]
                                "
                            >
                                {landings?.header}
                            </h1>

                            {/* Accent line */}
                            <div
                                className="
                                    mt-5
                                    h-1
                                    w-20
                                    rounded-full
                                    bg-neutral-900
                                "
                            />

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
                                        py-3.5
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-[0.14em]
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
                                        tracking-[0.18em]
                                        text-neutral-400
                                    "
                                >
                                    Discover your next destination
                                </span>
                            </div>

                            {/* =================================================
                                INFORMATION / STATISTICS
                            ================================================== */}
                            <div
                                className="
                                    mt-12
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-neutral-200
                                    bg-white
                                    shadow-[0_10px_40px_rgba(0,0,0,0.04)]
                                "
                            >
                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        divide-x
                                        divide-y
                                        divide-neutral-200
                                        sm:grid-cols-4
                                        sm:divide-y-0
                                    "
                                >
                                    {/* Existing data */}
                                    <div className="px-5 py-5 sm:px-4">
                                        <span
                                            className="
                                                text-[9px]
                                                font-medium
                                                tracking-[0.12em]
                                                text-neutral-400
                                            "
                                        >
                                            01
                                        </span>

                                        <p
                                            className="
                                                mt-2
                                                text-[10px]
                                                font-medium
                                                uppercase
                                                tracking-[0.08em]
                                                text-neutral-800
                                                sm:text-[11px]
                                            "
                                        >
                                            Development
                                        </p>
                                    </div>

                                    <div className="px-5 py-5 sm:px-4">
                                        <span
                                            className="
                                                text-[9px]
                                                font-medium
                                                tracking-[0.12em]
                                                text-neutral-400
                                            "
                                        >
                                            02
                                        </span>

                                        <p
                                            className="
                                                mt-2
                                                text-[10px]
                                                font-medium
                                                uppercase
                                                tracking-[0.08em]
                                                text-neutral-800
                                                sm:text-[11px]
                                            "
                                        >
                                            Architecture
                                        </p>
                                    </div>

                                    <div className="px-5 py-5 sm:px-4">
                                        <span
                                            className="
                                                text-[9px]
                                                font-medium
                                                tracking-[0.12em]
                                                text-neutral-400
                                            "
                                        >
                                            03
                                        </span>

                                        <p
                                            className="
                                                mt-2
                                                text-[10px]
                                                font-medium
                                                uppercase
                                                tracking-[0.08em]
                                                text-neutral-800
                                                sm:text-[11px]
                                            "
                                        >
                                            Construction
                                        </p>
                                    </div>

                                    <div className="px-5 py-5 sm:px-4">
                                        <span
                                            className="
                                                text-[9px]
                                                font-medium
                                                tracking-[0.12em]
                                                text-neutral-400
                                            "
                                        >
                                            04
                                        </span>

                                        <p
                                            className="
                                                mt-2
                                                text-[10px]
                                                font-medium
                                                uppercase
                                                tracking-[0.08em]
                                                text-neutral-800
                                                sm:text-[11px]
                                            "
                                        >
                                            Real Estate Agency
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* =================================================
                                DUMMY BUSINESS STATS
                            ================================================== */}
                            <div
                                className="
                                    mt-5
                                    grid
                                    grid-cols-3
                                    gap-4
                                "
                            >
                                <div>
                                    <p
                                        className="
                                            text-xl
                                            font-semibold
                                            tracking-tight
                                            text-neutral-950
                                            sm:text-2xl
                                        "
                                    >
                                        250+
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[9px]
                                            uppercase
                                            tracking-[0.12em]
                                            text-neutral-400
                                        "
                                    >
                                        Properties
                                    </p>
                                </div>

                                <div>
                                    <p
                                        className="
                                            text-xl
                                            font-semibold
                                            tracking-tight
                                            text-neutral-950
                                            sm:text-2xl
                                        "
                                    >
                                        2.5K+
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[9px]
                                            uppercase
                                            tracking-[0.12em]
                                            text-neutral-400
                                        "
                                    >
                                        Property Users
                                    </p>
                                </div>

                                <div>
                                    <p
                                        className="
                                            text-xl
                                            font-semibold
                                            tracking-tight
                                            text-neutral-950
                                            sm:text-2xl
                                        "
                                    >
                                        98%
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[9px]
                                            uppercase
                                            tracking-[0.12em]
                                            text-neutral-400
                                        "
                                    >
                                        Satisfaction
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* =================================================
                            RIGHT IMAGE (BORDERLESS / SEAMLESS LIKE REFERENCE)
                        ================================================== */}
                        <div
                            className="
                                relative
                                flex
                                w-full
                                items-center
                                justify-center
                                lg:col-span-5
                            "
                        >
                            <img
                                src={heroImage}
                                alt={heroTitle}
                                draggable="false"
                                className="
                                    h-auto
                                    max-h-[550px]
                                    w-full
                                    object-contain
                                    object-center
                                    lg:scale-105
                                "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}