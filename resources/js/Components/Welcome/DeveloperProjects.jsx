import { route } from "ziggy-js";

export default function DeveloperProjects({ project, landings }) {
    return (
        <section
            id="developer-projects"
            className="
                relative
                isolate
                overflow-hidden
                bg-mono-900
                text-mono-100
            "
        >
            {/* =====================================================
                BALI ORNAMENT BACKGROUND
            ====================================================== */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">

                {/* ================= LEFT SIDE ================= */}

                {/* Main Patra Bunga */}
                <img
                    src="/images/ornaments/patra-bunga.svg"
                    alt=""
                    aria-hidden="true"
                    className="
                        absolute
                        left-[-170px]
                        top-[8%]
                        w-[600px]
                        rotate-[-10deg]
                        opacity-[0.10]
                        brightness-0
                        invert
                    "
                />

                {/* Kakul upper left */}
                <img
                    src="/images/ornaments/kakul-1.svg"
                    alt=""
                    aria-hidden="true"
                    className="
                        absolute
                        left-[-120px]
                        top-[28%]
                        w-[480px]
                        rotate-[8deg]
                        opacity-[0.12]
                        brightness-0
                        invert
                    "
                />

                {/* Kakul lower left */}
                <img
                    src="/images/ornaments/kakul-2.svg"
                    alt=""
                    aria-hidden="true"
                    className="
                        absolute
                        bottom-[8%]
                        left-[-80px]
                        w-[420px]
                        rotate-[-7deg]
                        opacity-[0.10]
                        brightness-0
                        invert
                    "
                />

                {/* Mas-masan vertical decoration */}
                <img
                    src="/images/ornaments/mas-masan.svg"
                    alt=""
                    aria-hidden="true"
                    className="
                        absolute
                        left-[-260px]
                        top-1/2
                        w-[600px]
                        -translate-y-1/2
                        rotate-90
                        opacity-[0.06]
                        brightness-0
                        invert
                    "
                />

                {/* ================= RIGHT SIDE ================= */}

                {/* Main Patra Bunga */}
                <img
                    src="/images/ornaments/patra-bunga.svg"
                    alt=""
                    aria-hidden="true"
                    className="
                        absolute
                        right-[-170px]
                        top-[8%]
                        w-[600px]
                        rotate-[10deg]
                        scale-x-[-1]
                        opacity-[0.10]
                        brightness-0
                        invert
                    "
                />

                {/* Kakul upper right */}
                <img
                    src="/images/ornaments/kakul-1.svg"
                    alt=""
                    aria-hidden="true"
                    className="
                        absolute
                        right-[-120px]
                        top-[28%]
                        w-[480px]
                        rotate-[-8deg]
                        scale-x-[-1]
                        opacity-[0.12]
                        brightness-0
                        invert
                    "
                />

                {/* Kakul lower right */}
                <img
                    src="/images/ornaments/kakul-2.svg"
                    alt=""
                    aria-hidden="true"
                    className="
                        absolute
                        bottom-[8%]
                        right-[-80px]
                        w-[420px]
                        rotate-[7deg]
                        scale-x-[-1]
                        opacity-[0.10]
                        brightness-0
                        invert
                    "
                />

                {/* Mas-masan vertical decoration */}
                <img
                    src="/images/ornaments/mas-masan.svg"
                    alt=""
                    aria-hidden="true"
                    className="
                        absolute
                        right-[-260px]
                        top-1/2
                        w-[600px]
                        -translate-y-1/2
                        -rotate-90
                        opacity-[0.06]
                        brightness-0
                        invert
                    "
                />

                {/* =================================================
                    SOFT CENTER FADE
                ================================================== */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-[linear-gradient(90deg,rgba(23,23,23,0.05)_0%,rgba(23,23,23,0.45)_14%,rgba(23,23,23,0.92)_30%,rgba(23,23,23,1)_50%,rgba(23,23,23,0.92)_70%,rgba(23,23,23,0.45)_86%,rgba(23,23,23,0.05)_100%)]
                    "
                />

                {/* Top / bottom fade */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-[linear-gradient(180deg,rgba(23,23,23,0.35)_0%,transparent_20%,transparent_80%,rgba(23,23,23,0.45)_100%)]
                    "
                />
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
                    lg:px-8
                    lg:py-20
                "
            >
                {/* HEADER */}
                <div className="mx-auto max-w-3xl text-center">

                    <div
                        className="
                            mb-4
                            flex
                            items-center
                            justify-center
                            gap-3
                        "
                    >
                        <span className="h-px w-10 bg-mono-600" />

                        <span
                            className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.3em]
                                text-mono-400
                            "
                        >
                            Developer
                        </span>

                        <span className="h-px w-10 bg-mono-600" />
                    </div>

                    <h2
                        className="
                            text-3xl
                            font-semibold
                            uppercase
                            tracking-[0.08em]
                            text-mono-100
                            sm:text-4xl
                        "
                    >
                        Project
                    </h2>

                    <p
                        className="
                            mx-auto
                            mt-5
                            max-w-3xl
                            text-sm
                            leading-7
                            text-mono-400
                        "
                    >
                        {landings?.developer_project_desc}
                    </p>
                </div>

                {/* PROJECTS */}
                <div className="mt-12 grid gap-6 md:grid-cols-2">
                    {project.map((item, index) => (
                        <a
                            key={item.id}
                            href={route("project.show", {
                                slug: item.slug,
                            })}
                            className="
                                group
                                relative
                                block
                                overflow-hidden
                                rounded-2xl
                                border
                                border-mono-700/80
                                bg-mono-900/90
                                shadow-xl
                                backdrop-blur-sm
                                transition-all
                                duration-500
                                hover:-translate-y-1
                                hover:border-mono-500
                                hover:shadow-2xl
                            "
                        >
                            {/* IMAGE */}
                            <div className="relative aspect-[16/9] w-full overflow-hidden">
                                <img
                                    src={`/storage/${item.banner_image}`}
                                    alt={item.title}
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                        transition
                                        duration-700
                                        group-hover:scale-105
                                    "
                                />

                                <div
                                    className="
                                        absolute
                                        inset-0
                                        bg-gradient-to-t
                                        from-black/80
                                        via-black/10
                                        to-transparent
                                    "
                                />

                                {/* Number */}
                                <span
                                    className="
                                        absolute
                                        left-4
                                        top-4
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-white/30
                                        bg-black/40
                                        text-xs
                                        font-semibold
                                        text-white
                                        backdrop-blur-md
                                    "
                                >
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                {/* Project badge */}
                                <span
                                    className="
                                        absolute
                                        right-4
                                        top-4
                                        rounded-full
                                        border
                                        border-white/20
                                        bg-black/40
                                        px-3
                                        py-1
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.15em]
                                        text-white
                                        backdrop-blur-md
                                    "
                                >
                                    Project
                                </span>
                            </div>

                            {/* CONTENT */}
                            <div className="flex items-center justify-between px-5 py-4">
                                <div>
                                    <p
                                        className="
                                            text-[9px]
                                            uppercase
                                            tracking-[0.2em]
                                            text-mono-500
                                        "
                                    >
                                        Development
                                    </p>

                                    <h3
                                        className="
                                            mt-1
                                            text-base
                                            font-semibold
                                            text-mono-100
                                        "
                                    >
                                        {item.title}
                                    </h3>
                                </div>

                                <span
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-mono-700
                                        text-mono-300
                                        transition-all
                                        duration-300
                                        group-hover:translate-x-1
                                        group-hover:border-mono-400
                                        group-hover:text-white
                                    "
                                >
                                    →
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}