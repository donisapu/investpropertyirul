export default function Hero({ landings, settings, sliders }) {
    // Utamakan gambar dari landings.image (dari panel/form landing page)
    // Jika tidak ada, gunakan sliders[0] atau gambar fallback default
    const heroImage = landings?.image
        ? `/storage/${landings.image}`
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
                            lg:grid-cols-[minmax(0,1fr)_500px]
                            xl:gap-16
                        "
                    >
                        {/* =================================================
                            LEFT CONTENT
                        ================================================== */}
                        <div className="relative z-10 max-w-3xl">
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
                            RIGHT SINGLE IMAGE (UPDATABLE FROM LANDINGS)
                        ================================================== */}
                        <div
                            className="
                                relative
                                w-full
                                lg:pt-6
                            "
                        >
                            {/* FLOATING TOP CARD */}
                            <div
                                className="
                                    absolute
                                    -left-6
                                    top-0
                                    z-30
                                    hidden
                                    w-[210px]
                                    rounded-2xl
                                    border
                                    border-neutral-100
                                    bg-white
                                    p-4
                                    shadow-[0_15px_50px_rgba(0,0,0,0.10)]
                                    sm:block
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="
                                            h-10
                                            w-10
                                            overflow-hidden
                                            rounded-xl
                                            bg-neutral-100
                                        "
                                    >
                                        <img
                                            src={heroImage}
                                            alt={heroTitle}
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                            "
                                        />
                                    </div>

                                    <div>
                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                text-neutral-900
                                            "
                                        >
                                            {heroTitle}
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-[9px]
                                                text-neutral-400
                                            "
                                        >
                                            Premium Property
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center gap-1">
                                    <span className="text-[11px] text-neutral-800">
                                        ★★★★★
                                    </span>

                                    <span className="text-[9px] text-neutral-400">
                                        4.9 (120+)
                                    </span>
                                </div>
                            </div>

                            {/* MAIN HERO IMAGE */}
                            <div
                                className="
                                    relative
                                    h-[400px]
                                    overflow-hidden
                                    rounded-[28px]
                                    bg-neutral-100
                                    shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                                    sm:h-[500px]
                                    lg:h-[570px]
                                "
                            >
                                <img
                                    src={heroImage}
                                    alt={heroTitle}
                                    draggable="false"
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                    "
                                />

                                {/* Image gradient */}
                                <div
                                    className="
                                        absolute
                                        inset-0
                                        bg-gradient-to-t
                                        from-black/45
                                        via-transparent
                                        to-transparent
                                    "
                                />

                                {/* IMAGE TITLE */}
                                <div
                                    className="
                                        absolute
                                        bottom-0
                                        left-0
                                        right-0
                                        z-20
                                        p-6
                                        sm:p-8
                                    "
                                >
                                    <div className="max-w-[70%]">
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
                                                mt-2
                                                text-lg
                                                font-medium
                                                uppercase
                                                tracking-[0.05em]
                                                text-white
                                                sm:text-xl
                                            "
                                        >
                                            {heroTitle}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* FLOATING RIGHT STAT */}
                            <div
                                className="
                                    absolute
                                    -right-5
                                    top-[38%]
                                    z-30
                                    hidden
                                    rounded-2xl
                                    border
                                    border-neutral-100
                                    bg-white
                                    px-5
                                    py-4
                                    shadow-[0_15px_50px_rgba(0,0,0,0.10)]
                                    sm:block
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-neutral-100
                                            text-sm
                                            text-neutral-700
                                        "
                                    >
                                        ◎
                                    </div>

                                    <div>
                                        <p
                                            className="
                                                text-xl
                                                font-semibold
                                                tracking-tight
                                                text-neutral-900
                                            "
                                        >
                                            2.5K+
                                        </p>

                                        <p
                                            className="
                                                text-[9px]
                                                uppercase
                                                tracking-[0.1em]
                                                text-neutral-400
                                            "
                                        >
                                            Active Users
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM FLOATING CARD */}
                            <div
                                className="
                                    absolute
                                    -bottom-5
                                    -right-3
                                    z-30
                                    hidden
                                    w-[190px]
                                    rounded-2xl
                                    border
                                    border-neutral-100
                                    bg-white
                                    p-5
                                    shadow-[0_15px_50px_rgba(0,0,0,0.10)]
                                    sm:block
                                "
                            >
                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        leading-5
                                        text-neutral-900
                                    "
                                >
                                    Your Dream Property
                                    <br />
                                    Starts Here
                                </p>

                                <div
                                    className="
                                        mt-4
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >
                                    <span className="h-px w-8 bg-neutral-300" />

                                    <span
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-neutral-950
                                            text-sm
                                            text-white
                                        "
                                    >
                                        ↗
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}