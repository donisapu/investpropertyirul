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
                w-full
                overflow-hidden
                bg-white
                text-neutral-900
            "
        >
            {/* =====================================================
                CONTAINER DENGAN SPACE KIRI-KANAN (max-w-7xl & px)
            ====================================================== */}
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                <div
                    className="
                        grid
                        min-h-[600px]
                        items-center
                        gap-8
                        lg:grid-cols-12
                        lg:min-h-[700px]
                        xl:gap-12
                    "
                >
                    {/* =================================================
                        KOLOM KIRI: TEKS (7 COLS)
                    ================================================== */}
                    <div className="relative z-10 py-10 lg:col-span-7 lg:py-16">
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
                                    "Platform Developer & Investasi Properti"}
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
                                xl:text-[68px]
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
                                max-w-xl
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

                    {/* =================================================
                        KOLOM KANAN: GAMBAR DENGAN MASKING TRANSPARAN (5 COLS)
                    ================================================== */}
                    <div
                        className="
                            relative
                            flex
                            h-full
                            w-full
                            items-end
                            justify-end
                            lg:col-span-5
                        "
                    >
                        <img
                            src={heroImage}
                            alt={landings?.title || "Hero Image"}
                            draggable="false"
                            className="
                                h-full
                                max-h-[600px]
                                w-full
                                object-contain
                                object-bottom-right
                                [mask-image:linear-gradient(to_right,transparent_0%,black_20%)]
                                max-lg:[mask-image:linear-gradient(to_bottom,transparent_0%,black_20%)]
                            "
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}