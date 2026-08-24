import { route } from "ziggy-js";

export default function DeveloperProjects({ project, landings }) {
    return (
        <section
            id="developer-projects"
            className="relative isolate overflow-hidden bg-[#111111] text-white"
        >
            {/* =====================================================
                BALI GATE ORNAMENT BACKGROUND
                Luxury Balinese Gate Inspired Pattern
            ====================================================== */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                {/* Base atmosphere */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-[radial-gradient(circle_at_center,#252525_0%,#171717_42%,#0d0d0d_100%)]
                    "
                />

                {/* =================================================
                    LEFT ORNAMENT
                ================================================== */}
                <div
                    className="
                        absolute
                        -left-[240px]
                        top-1/2
                        h-[900px]
                        w-[720px]
                        -translate-y-1/2
                        opacity-80
                        sm:-left-[190px]
                        lg:-left-[120px]
                    "
                >
                    <svg
                        viewBox="0 0 720 900"
                        className="h-full w-full"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* =========================================
                            MAIN GATE ARCH
                        ========================================== */}
                        <path
                            d="
                                M610 40
                                C470 75 350 165 300 295
                                C250 425 300 520 220 640
                                C175 710 110 755 45 820
                            "
                            stroke="#C8A45D"
                            strokeWidth="5"
                            strokeLinecap="round"
                            opacity="0.72"
                        />

                        <path
                            d="
                                M635 65
                                C505 110 390 190 340 310
                                C290 430 340 520 260 650
                                C205 740 125 780 65 850
                            "
                            stroke="#F4F0E6"
                            strokeWidth="1.5"
                            opacity="0.28"
                        />

                        <path
                            d="
                                M660 90
                                C545 140 430 220 385 325
                                C345 425 380 520 300 665
                                C245 755 170 805 100 865
                            "
                            stroke="#C8A45D"
                            strokeWidth="1.5"
                            opacity="0.38"
                        />

                        {/* =========================================
                            GATE TOP CROWN
                        ========================================== */}
                        <path
                            d="
                                M425 105
                                C390 75 345 70 315 92
                                C285 114 292 155 325 165
                                C365 178 405 150 425 105
                            "
                            stroke="#C8A45D"
                            strokeWidth="4"
                            opacity="0.8"
                        />

                        <path
                            d="
                                M405 112
                                C380 95 350 92 330 108
                                C313 122 318 142 338 147
                                C365 153 391 137 405 112
                            "
                            stroke="#F4F0E6"
                            strokeWidth="1.5"
                            opacity="0.38"
                        />

                        {/* =========================================
                            PADMA / LOTUS CENTER
                        ========================================== */}
                        <g transform="translate(350 230)">
                            {/* Outer petals */}
                            <path
                                d="
                                    M0 -65
                                    C-18 -38 -20 -15 0 0
                                    C20 -15 18 -38 0 -65
                                "
                                stroke="#C8A45D"
                                strokeWidth="3"
                            />

                            <path
                                d="
                                    M0 65
                                    C-18 38 -20 15 0 0
                                    C20 15 18 38 0 65
                                "
                                stroke="#C8A45D"
                                strokeWidth="3"
                            />

                            <path
                                d="
                                    M-65 0
                                    C-38 -18 -15 -20 0 0
                                    C-15 20 -38 18 -65 0
                                "
                                stroke="#C8A45D"
                                strokeWidth="3"
                            />

                            <path
                                d="
                                    M65 0
                                    C38 -18 15 -20 0 0
                                    C15 20 38 18 65 0
                                "
                                stroke="#C8A45D"
                                strokeWidth="3"
                            />

                            {/* Diagonal petals */}
                            <path
                                d="
                                    M-46 -46
                                    C-22 -48 -5 -30 0 0
                                    C-30 -5 -48 -22 -46 -46
                                "
                                stroke="#F4F0E6"
                                strokeWidth="1.5"
                                opacity="0.45"
                            />

                            <path
                                d="
                                    M46 -46
                                    C22 -48 5 -30 0 0
                                    C30 -5 48 -22 46 -46
                                "
                                stroke="#F4F0E6"
                                strokeWidth="1.5"
                                opacity="0.45"
                            />

                            <path
                                d="
                                    M-46 46
                                    C-22 48 -5 30 0 0
                                    C-30 5 -48 22 -46 46
                                "
                                stroke="#F4F0E6"
                                strokeWidth="1.5"
                                opacity="0.45"
                            />

                            <path
                                d="
                                    M46 46
                                    C22 48 5 30 0 0
                                    C30 5 48 22 46 46
                                "
                                stroke="#F4F0E6"
                                strokeWidth="1.5"
                                opacity="0.45"
                            />

                            <circle
                                cx="0"
                                cy="0"
                                r="10"
                                fill="#C8A45D"
                                opacity="0.9"
                            />
                        </g>

                        {/* =========================================
                            PATRA PUNGGEL - UPPER
                        ========================================== */}
                        <path
                            d="
                                M280 300
                                C225 270 170 285 155 330
                                C140 375 180 400 215 380
                                C250 360 270 330 280 300
                            "
                            stroke="#C8A45D"
                            strokeWidth="4"
                            strokeLinecap="round"
                            opacity="0.8"
                        />

                        <path
                            d="
                                M250 310
                                C215 295 180 310 175 335
                                C170 355 190 365 207 354
                                C225 343 240 325 250 310
                            "
                            stroke="#F4F0E6"
                            strokeWidth="1.5"
                            opacity="0.4"
                        />

                        {/* Leaf veins */}
                        <path
                            d="M250 310C225 325 205 340 185 355"
                            stroke="#C8A45D"
                            strokeWidth="1.5"
                            opacity="0.7"
                        />

                        {/* =========================================
                            PATRA PUNGGEL - LOWER
                        ========================================== */}
                        <path
                            d="
                                M235 470
                                C180 445 125 465 110 510
                                C95 555 135 580 175 555
                                C210 533 228 500 235 470
                            "
                            stroke="#C8A45D"
                            strokeWidth="4"
                            strokeLinecap="round"
                            opacity="0.75"
                        />

                        <path
                            d="
                                M210 480
                                C175 465 140 480 132 510
                                C127 530 145 540 162 530
                                C183 518 200 495 210 480
                            "
                            stroke="#F4F0E6"
                            strokeWidth="1.5"
                            opacity="0.35"
                        />

                        <path
                            d="M210 480C185 495 162 515 140 530"
                            stroke="#C8A45D"
                            strokeWidth="1.5"
                            opacity="0.65"
                        />

                        {/* =========================================
                            CURLED ROOT / GATE CARVING
                        ========================================== */}
                        <path
                            d="
                                M115 510
                                C65 490 25 515 30 555
                                C35 595 75 605 105 575
                                C120 560 125 535 115 510
                            "
                            stroke="#C8A45D"
                            strokeWidth="3"
                            opacity="0.65"
                        />

                        <path
                            d="
                                M105 520
                                C75 510 52 525 55 550
                                C58 570 78 575 92 560
                                C102 548 108 532 105 520
                            "
                            stroke="#F4F0E6"
                            strokeWidth="1"
                            opacity="0.3"
                        />

                        {/* =========================================
                            BALI CARVING CROWN
                        ========================================== */}
                        <path
                            d="
                                M455 395
                                C425 360 380 355 350 380
                                C320 405 330 440 365 450
                                C405 462 440 435 455 395
                            "
                            stroke="#C8A45D"
                            strokeWidth="3"
                            opacity="0.7"
                        />

                        <path
                            d="
                                M435 400
                                C415 380 385 378 365 395
                                C350 408 358 425 375 430
                                C398 437 422 420 435 400
                            "
                            stroke="#F4F0E6"
                            strokeWidth="1.3"
                            opacity="0.32"
                        />

                        {/* =========================================
                            SMALL ORNAMENTAL DOTS
                        ========================================== */}
                        <g fill="#C8A45D">
                            <circle cx="470" cy="205" r="4" opacity="0.8" />
                            <circle cx="500" cy="230" r="2.5" opacity="0.5" />
                            <circle cx="440" cy="280" r="3" opacity="0.7" />
                            <circle cx="470" cy="330" r="2" opacity="0.5" />
                            <circle cx="395" cy="500" r="4" opacity="0.65" />
                            <circle cx="350" cy="560" r="2.5" opacity="0.5" />
                            <circle cx="300" cy="640" r="3" opacity="0.7" />
                            <circle cx="250" cy="710" r="2" opacity="0.5" />
                        </g>

                        {/* =========================================
                            SMALL CARVED LINES
                        ========================================== */}
                        <path
                            d="M465 520C430 550 415 590 420 630"
                            stroke="#C8A45D"
                            strokeWidth="2"
                            opacity="0.5"
                        />

                        <path
                            d="M485 530C455 560 445 590 450 620"
                            stroke="#F4F0E6"
                            strokeWidth="1"
                            opacity="0.25"
                        />
                    </svg>
                </div>

                {/* =================================================
                    RIGHT ORNAMENT
                ================================================== */}
                <div
                    className="
                        absolute
                        -right-[240px]
                        top-1/2
                        h-[900px]
                        w-[720px]
                        -translate-y-1/2
                        scale-x-[-1]
                        opacity-80
                        sm:-right-[190px]
                        lg:-right-[120px]
                    "
                >
                    <svg
                        viewBox="0 0 720 900"
                        className="h-full w-full"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="
                                M610 40
                                C470 75 350 165 300 295
                                C250 425 300 520 220 640
                                C175 710 110 755 45 820
                            "
                            stroke="#C8A45D"
                            strokeWidth="5"
                            strokeLinecap="round"
                            opacity="0.72"
                        />

                        <path
                            d="
                                M635 65
                                C505 110 390 190 340 310
                                C290 430 340 520 260 650
                                C205 740 125 780 65 850
                            "
                            stroke="#F4F0E6"
                            strokeWidth="1.5"
                            opacity="0.28"
                        />

                        <path
                            d="
                                M660 90
                                C545 140 430 220 385 325
                                C345 425 380 520 300 665
                                C245 755 170 805 100 865
                            "
                            stroke="#C8A45D"
                            strokeWidth="1.5"
                            opacity="0.38"
                        />

                        {/* Crown */}
                        <path
                            d="
                                M425 105
                                C390 75 345 70 315 92
                                C285 114 292 155 325 165
                                C365 178 405 150 425 105
                            "
                            stroke="#C8A45D"
                            strokeWidth="4"
                            opacity="0.8"
                        />

                        {/* Padma */}
                        <g transform="translate(350 230)">
                            <path
                                d="M0 -65C-18 -38 -20 -15 0 0C20 -15 18 -38 0 -65"
                                stroke="#C8A45D"
                                strokeWidth="3"
                            />

                            <path
                                d="M0 65C-18 38 -20 15 0 0C20 15 18 38 0 65"
                                stroke="#C8A45D"
                                strokeWidth="3"
                            />

                            <path
                                d="M-65 0C-38 -18 -15 -20 0 0C-15 20 -38 18 -65 0"
                                stroke="#C8A45D"
                                strokeWidth="3"
                            />

                            <path
                                d="M65 0C38 -18 15 -20 0 0C15 20 38 18 65 0"
                                stroke="#C8A45D"
                                strokeWidth="3"
                            />

                            <circle
                                cx="0"
                                cy="0"
                                r="10"
                                fill="#C8A45D"
                                opacity="0.9"
                            />
                        </g>

                        {/* Patra */}
                        <path
                            d="
                                M280 300
                                C225 270 170 285 155 330
                                C140 375 180 400 215 380
                                C250 360 270 330 280 300
                            "
                            stroke="#C8A45D"
                            strokeWidth="4"
                            opacity="0.8"
                        />

                        <path
                            d="
                                M235 470
                                C180 445 125 465 110 510
                                C95 555 135 580 175 555
                                C210 533 228 500 235 470
                            "
                            stroke="#C8A45D"
                            strokeWidth="4"
                            opacity="0.75"
                        />

                        {/* Root curl */}
                        <path
                            d="
                                M115 510
                                C65 490 25 515 30 555
                                C35 595 75 605 105 575
                                C120 560 125 535 115 510
                            "
                            stroke="#C8A45D"
                            strokeWidth="3"
                            opacity="0.65"
                        />

                        {/* Lower crown */}
                        <path
                            d="
                                M455 395
                                C425 360 380 355 350 380
                                C320 405 330 440 365 450
                                C405 462 440 435 455 395
                            "
                            stroke="#C8A45D"
                            strokeWidth="3"
                            opacity="0.7"
                        />

                        <g fill="#C8A45D">
                            <circle cx="470" cy="205" r="4" opacity="0.8" />
                            <circle cx="500" cy="230" r="2.5" opacity="0.5" />
                            <circle cx="440" cy="280" r="3" opacity="0.7" />
                            <circle cx="470" cy="330" r="2" opacity="0.5" />
                            <circle cx="395" cy="500" r="4" opacity="0.65" />
                            <circle cx="350" cy="560" r="2.5" opacity="0.5" />
                            <circle cx="300" cy="640" r="3" opacity="0.7" />
                            <circle cx="250" cy="710" r="2" opacity="0.5" />
                        </g>
                    </svg>
                </div>

                {/* =================================================
                    CENTER VIGNETTE
                ================================================== */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-[radial-gradient(ellipse_at_center,rgba(17,17,17,0.96)_0%,rgba(17,17,17,0.84)_42%,rgba(17,17,17,0.35)_100%)]
                    "
                />

                {/* Top / bottom fade */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-[linear-gradient(180deg,#0d0d0d_0%,transparent_18%,transparent_82%,#0d0d0d_100%)]
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
                    <div className="mb-5 flex items-center justify-center gap-4">
                        <span className="h-px w-12 bg-[#C8A45D]/70" />

                        <span
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.4em]
                                text-[#C8A45D]
                            "
                        >
                            Developer
                        </span>

                        <span className="h-px w-12 bg-[#C8A45D]/70" />
                    </div>

                    <h2
                        className="
                            text-3xl
                            font-semibold
                            uppercase
                            tracking-[0.14em]
                            text-[#F4F0E6]
                            sm:text-4xl
                            lg:text-5xl
                        "
                    >
                        Project
                    </h2>

                    <div className="mx-auto mt-5 h-px w-16 bg-[#C8A45D]/60" />

                    <p
                        className="
                            mx-auto
                            mt-6
                            max-w-2xl
                            text-sm
                            leading-7
                            text-white/50
                        "
                    >
                        {landings?.developer_project_desc}
                    </p>
                </div>

                {/* =================================================
                    PROJECT GRID
                ================================================== */}
                <div className="mt-12 grid gap-7 md:grid-cols-2">
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
                                border-white/[0.08]
                                bg-[#151515]
                                shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                                transition-all
                                duration-500
                                hover:-translate-y-1
                                hover:border-[#C8A45D]/50
                                hover:shadow-[0_25px_70px_rgba(0,0,0,0.55)]
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

                                {/* Image darkness */}
                                <div
                                    className="
                                        absolute
                                        inset-0
                                        bg-gradient-to-t
                                        from-black/85
                                        via-black/15
                                        to-transparent
                                    "
                                />

                                {/* Number */}
                                <div
                                    className="
                                        absolute
                                        left-4
                                        top-4
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-[#C8A45D]/60
                                        bg-black/50
                                        text-xs
                                        font-semibold
                                        text-[#D4B875]
                                        backdrop-blur-md
                                    "
                                >
                                    {String(index + 1).padStart(2, "0")}
                                </div>

                                {/* Category */}
                                <div
                                    className="
                                        absolute
                                        right-4
                                        top-4
                                        rounded-full
                                        border
                                        border-[#C8A45D]/40
                                        bg-black/50
                                        px-3
                                        py-1.5
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.22em]
                                        text-[#D4B875]
                                        backdrop-blur-md
                                    "
                                >
                                    Development
                                </div>
                            </div>

                            {/* CARD CONTENT */}
                            <div className="flex items-center justify-between px-5 py-5">
                                <div>
                                    <h3
                                        className="
                                            text-base
                                            font-semibold
                                            tracking-wide
                                            text-[#F4F0E6]
                                            transition-colors
                                            duration-300
                                            group-hover:text-[#D4B875]
                                        "
                                    >
                                        {item.title}
                                    </h3>

                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="h-px w-6 bg-[#C8A45D]/60" />

                                        <span
                                            className="
                                                text-[9px]
                                                uppercase
                                                tracking-[0.25em]
                                                text-white/35
                                            "
                                        >
                                            Explore Project
                                        </span>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <span
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-white/10
                                        text-lg
                                        text-[#C8A45D]
                                        transition-all
                                        duration-300
                                        group-hover:translate-x-1
                                        group-hover:border-[#C8A45D]/60
                                        group-hover:bg-[#C8A45D]/10
                                    "
                                >
                                    →
                                </span>
                            </div>
                        </a>
                    ))}
                </div>

                {/* =================================================
                    BOTTOM ORNAMENT LINE
                ================================================== */}
                <div className="mt-14 flex items-center justify-center gap-4">
                    <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#C8A45D]/60" />

                    <span className="relative flex h-3 w-3 items-center justify-center">
                        <span className="absolute h-3 w-3 rotate-45 border border-[#C8A45D]/70" />
                        <span className="h-1 w-1 rounded-full bg-[#C8A45D]" />
                    </span>

                    <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#C8A45D]/60" />
                </div>
            </div>
        </section>
    );
}