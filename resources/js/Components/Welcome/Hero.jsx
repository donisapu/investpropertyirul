export default function Hero({ landings, settings, sliders }) {
    // Ambil gambar dari landings.hero_path
    const heroImage = landings?.hero_path
        ? `/storage/${landings.hero_path}`
        : sliders && sliders.length > 0
        ? `/storage/${sliders[0].image_path}`
        : "/storage/default-hero.jpg";

    return (
        <section
            id="top"
            className="
                relative
                min-h-[600px]
                w-full
                overflow-hidden
                bg-white
                text-neutral-900
                lg:min-h-[720px]
            "
        >
            {/* =====================================================
                1. BACKGROUND IMAGE (Full Container, Focused Right)
            ====================================================== */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroImage}
                    alt={landings?.title || "Hero Background"}
                    draggable="false"
                    className="
                        h-full
                        w-full
                        object-cover
                        object-right
                        sm:object-right-top
                    "
                />
                
                {/* Gradient Soft Overlay agar teks kiri terbaca jelas */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-r
                        from-white
                        via-white/90
                        to-transparent
                        max-lg:bg-gradient-to-b
                        max-lg:from-white/95
                        max-lg:via-white/80
                        max-lg:to-white/20
                        lg:w-2/3
                    "
                />
            </div>

            {/* =====================================================
                2. HERO CONTENT (Left Side Overlay)
            ====================================================== */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-8 sm:px-8 lg:px-12 lg:pb-20 lg:pt-16">
                <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl">
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
                            text-neutral-600
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
                            text-4xl
                            font-semibold
                            leading-[1.05]
                            tracking-[-0.035em]
                            text-neutral-950
                            sm:text-5xl
                            md:text-6xl
                            xl:text-[70px]
                        "
                    >
                        {landings?.header}
                    </h1>

                    {/* Accent line */}
                    <div className="mt-5 h-1 w-20 rounded-full bg-neutral-900" />

                    {/* Description */}
                    <p
                        className="
                            mt-7
                            max-w-lg
                            text-sm
                            leading-7
                            text-neutral-600
                            sm:text-base
                        "
                    >
                        {landings?.description}
                    </p>

                    {/* CTA Button */}
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
                                shadow-md
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
                                text-neutral-500
                            "
                        >
                            Discover your next destination
                        </span>
                    </div>

                    {/* INFORMATION / STATISTICS CARD */}
                    <div
                        className="
                            mt-12
                            overflow-hidden
                            rounded-2xl
                            border
                            border-neutral-200/80
                            bg-white/90
                            backdrop-blur-sm
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
                            <div className="px-5 py-5 sm:px-4">
                                <span className="text-[9px] font-medium tracking-[0.12em] text-neutral-400">
                                    01
                                </span>

                                <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-800 sm:text-[11px]">
                                    Development
                                </p>
                            </div>

                            <div className="px-5 py-5 sm:px-4">
                                <span className="text-[9px] font-medium tracking-[0.12em] text-neutral-400">
                                    02
                                </span>

                                <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-800 sm:text-[11px]">
                                    Architecture
                                </p>
                            </div>

                            <div className="px-5 py-5 sm:px-4">
                                <span className="text-[9px] font-medium tracking-[0.12em] text-neutral-400">
                                    03
                                </span>

                                <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-800 sm:text-[11px]">
                                    Construction
                                </p>
                            </div>

                            <div className="px-5 py-5 sm:px-4">
                                <span className="text-[9px] font-medium tracking-[0.12em] text-neutral-400">
                                    04
                                </span>

                                <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-800 sm:text-[11px]">
                                    Real Estate Agency
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* DUMMY BUSINESS STATS */}
                    <div className="mt-5 grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
                                250+
                            </p>

                            <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-neutral-500">
                                Properties
                            </p>
                        </div>

                        <div>
                            <p className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
                                2.5K+
                            </p>

                            <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-neutral-500">
                                Property Users
                            </p>
                        </div>

                        <div>
                            <p className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
                                98%
                            </p>

                            <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-neutral-500">
                                Satisfaction
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}