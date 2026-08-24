import { Link } from "@inertiajs/react";
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
                BALI BATIK SIDE ORNAMENT
            ====================================================== */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">

                {/* Left decorative area */}
                <div
                    className="
                        absolute
                        left-[-180px]
                        top-1/2
                        h-[620px]
                        w-[420px]
                        -translate-y-1/2
                        opacity-[0.12]
                    "
                >
                    <svg
                        viewBox="0 0 420 620"
                        className="h-full w-full"
                        fill="none"
                    >
                        {/* Large diamond */}
                        <path
                            d="
                                M210 20
                                L390 180
                                L210 340
                                L30 180
                                Z
                            "
                            stroke="#d6d6d2"
                            strokeWidth="2"
                        />

                        {/* Inner diamond */}
                        <path
                            d="
                                M210 70
                                L335 180
                                L210 290
                                L85 180
                                Z
                            "
                            stroke="#d6d6d2"
                            strokeWidth="1.5"
                        />

                        {/* Bali inspired central ornament */}
                        <path
                            d="
                                M210 105
                                C235 135 250 150 270 180
                                C250 210 235 225 210 255
                                C185 225 170 210 150 180
                                C170 150 185 135 210 105
                                Z
                            "
                            stroke="#d6d6d2"
                            strokeWidth="2"
                        />

                        {/* Decorative branches */}
                        <path
                            d="
                                M210 105
                                C190 90 175 72 170 50
                                M210 105
                                C230 90 245 72 250 50

                                M150 180
                                C120 175 95 160 75 140
                                M150 180
                                C120 185 95 200 75 220

                                M270 180
                                C300 175 325 160 345 140
                                M270 180
                                C300 185 325 200 345 220
                            "
                            stroke="#d6d6d2"
                            strokeWidth="1.5"
                        />

                        {/* Small ornamental diamonds */}
                        <path
                            d="M210 20 L235 42 L210 64 L185 42 Z"
                            stroke="#d6d6d2"
                        />

                        <path
                            d="M30 180 L55 202 L30 224 L5 202 Z"
                            stroke="#d6d6d2"
                        />

                        <path
                            d="M390 180 L415 202 L390 224 L365 202 Z"
                            stroke="#d6d6d2"
                        />

                        {/* Repeated contour diamonds */}
                        <path
                            d="
                                M210 -35
                                L445 180
                                L210 395
                                L-25 180
                                Z
                            "
                            stroke="#d6d6d2"
                            strokeWidth="1"
                            opacity="0.5"
                        />

                        <path
                            d="
                                M210 -85
                                L495 180
                                L210 445
                                L-75 180
                                Z
                            "
                            stroke="#d6d6d2"
                            strokeWidth="1"
                            opacity="0.35"
                        />
                    </svg>
                </div>

                {/* Right decorative area */}
                <div
                    className="
                        absolute
                        right-[-180px]
                        top-1/2
                        h-[620px]
                        w-[420px]
                        -translate-y-1/2
                        scale-x-[-1]
                        opacity-[0.12]
                    "
                >
                    <svg
                        viewBox="0 0 420 620"
                        className="h-full w-full"
                        fill="none"
                    >
                        <path
                            d="
                                M210 20
                                L390 180
                                L210 340
                                L30 180
                                Z
                            "
                            stroke="#d6d6d2"
                            strokeWidth="2"
                        />

                        <path
                            d="
                                M210 70
                                L335 180
                                L210 290
                                L85 180
                                Z
                            "
                            stroke="#d6d6d2"
                            strokeWidth="1.5"
                        />

                        <path
                            d="
                                M210 105
                                C235 135 250 150 270 180
                                C250 210 235 225 210 255
                                C185 225 170 210 150 180
                                C170 150 185 135 210 105
                                Z
                            "
                            stroke="#d6d6d2"
                            strokeWidth="2"
                        />

                        <path
                            d="
                                M210 105
                                C190 90 175 72 170 50
                                M210 105
                                C230 90 245 72 250 50

                                M150 180
                                C120 175 95 160 75 140
                                M150 180
                                C120 185 95 200 75 220

                                M270 180
                                C300 175 325 160 345 140
                                M270 180
                                C300 185 325 200 345 220
                            "
                            stroke="#d6d6d2"
                            strokeWidth="1.5"
                        />

                        <path
                            d="M210 20 L235 42 L210 64 L185 42 Z"
                            stroke="#d6d6d2"
                        />

                        <path
                            d="M30 180 L55 202 L30 224 L5 202 Z"
                            stroke="#d6d6d2"
                        />

                        <path
                            d="M390 180 L415 202 L390 224 L365 202 Z"
                            stroke="#d6d6d2"
                        />

                        <path
                            d="
                                M210 -35
                                L445 180
                                L210 395
                                L-25 180
                                Z
                            "
                            stroke="#d6d6d2"
                            strokeWidth="1"
                            opacity="0.5"
                        />

                        <path
                            d="
                                M210 -85
                                L495 180
                                L210 445
                                L-75 180
                                Z
                            "
                            stroke="#d6d6d2"
                            strokeWidth="1"
                            opacity="0.35"
                        />
                    </svg>
                </div>

                {/* Soft fade toward center */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-[linear-gradient(90deg,rgba(23,23,23,0.15)_0%,rgba(23,23,23,0.85)_18%,rgba(23,23,23,1)_35%,rgba(23,23,23,1)_65%,rgba(23,23,23,0.85)_82%,rgba(23,23,23,0.15)_100%)]
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
                {/* =================================================
                    HEADER
                ================================================== */}
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
                        <span className="h-px w-8 bg-mono-500" />

                        <span
                            className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.28em]
                                text-mono-400
                            "
                        >
                            Developer
                        </span>

                        <span className="h-px w-8 bg-mono-500" />
                    </div>

                    <h2
                        className="
                            text-3xl
                            font-semibold
                            uppercase
                            tracking-tight
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
                        {landings.developer_project_desc}
                    </p>
                </div>

                {/* =================================================
                    PROJECT CARDS
                ================================================== */}
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
                                bg-mono-900/80
                                shadow-xl
                                backdrop-blur-sm
                                transition-all
                                duration-500
                                hover:-translate-y-1
                                hover:border-mono-500
                                hover:shadow-2xl
                            "
                        >
                            {/* Image */}
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

                                {/* Image overlay */}
                                <div
                                    className="
                                        absolute
                                        inset-0
                                        bg-gradient-to-t
                                        from-black/75
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
                                        bg-black/30
                                        text-xs
                                        font-semibold
                                        text-white
                                        backdrop-blur-md
                                    "
                                >
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                {/* Title badge */}
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
                                        tracking-[0.12em]
                                        text-white
                                        backdrop-blur-md
                                    "
                                >
                                    {item.title}
                                </span>
                            </div>

                            {/* Bottom content */}
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    px-5
                                    py-4
                                "
                            >
                                <div>
                                    <p
                                        className="
                                            text-[9px]
                                            uppercase
                                            tracking-[0.2em]
                                            text-mono-500
                                        "
                                    >
                                        Development Project
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