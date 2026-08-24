import { route } from "ziggy-js";

export default function DeveloperProjects({ project, landings }) {
    return (
        <section
            id="developer-projects"
            className="relative isolate overflow-hidden bg-[#111111] text-white"
        >
            {/* =====================================================
                BALI LUXURY ORNAMENT
                INLINE SVG - NO EXTERNAL FILE
            ====================================================== */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                
                {/* Dark radial atmosphere */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-[radial-gradient(circle_at_50%_45%,#242424_0%,#151515_42%,#0d0d0d_100%)]
                    "
                />

                {/* =================================================
                    LEFT BALI ORNAMENT
                ================================================== */}
                <div
                    className="
                        absolute
                        -left-[190px]
                        top-1/2
                        h-[850px]
                        w-[650px]
                        -translate-y-1/2
                        opacity-70
                        sm:-left-[150px]
                        lg:-left-[100px]
                    "
                >
                    <svg
                        viewBox="0 0 650 850"
                        className="h-full w-full"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* =========================================
                            OUTER ARCH / CARVING
                        ========================================== */}
                        <path
                            d="
                                M530 35
                                C420 70 325 135 285 235
                                C245 335 285 415 235 505
                                C190 585 105 625 55 710
                            "
                            stroke="#C8A45D"
                            strokeWidth="4"
                            opacity="0.55"
                        />

                        <path
                            d="
                                M555 40
                                C450 95 360 160 320 250
                                C280 340 320 420 270 510
                                C220 600 130 640 75 730
                            "
                            stroke="#F2EFE6"
                            strokeWidth="1.5"
                            opacity="0.25"
                        />

                        <path
                            d="
                                M580 55
                                C490 125 410 185 370 270
                                C335 345 365 425 315 520
                                C270 610 185 670 110 750
                            "
                            stroke="#C8A45D"
                            strokeWidth="1"
                            opacity="0.35"
                        />

                        {/* =========================================
                            LARGE PATRA PUNGGEL
                        ========================================== */}
                        <path
                            d="
                                M390 115
                                C330 100 270 130 255 185
                                C245 225 270 260 310 258
                                C355 255 390 210 390 115
                                Z
                            "
                            stroke="#C8A45D"
                            strokeWidth="3"
                            opacity="0.75"
                        />

                        <path
                            d="
                                M370 135
                                C330 125 292 145 283 180
                                C277 205 293 225 318 225
                                C345 222 367 190 370 135
                                Z
                            "
                            stroke="#F2EFE6"
                            strokeWidth="1.5"
                            opacity="0.45"
                        />

                        {/* Inner leaf vein */}
                        <path
                            d="
                                M370 135
                                C350 160 330 190 318 225
                            "
                            stroke="#C8A45D"
                            strokeWidth="1.5"
                            opacity="0.8"
                        />

                        {/* =========================================
                            SECOND CURVED LEAF
                        ========================================== */}
                        <path
                            d="
                                M255 185
                                C205 165 155 185 145 225
                                C138 255 160 278 190 275
                                C225 270 250 235 255 185
                                Z
                            "
                            stroke="#C8A45D"
                            strokeWidth="2.5"
                            opacity="0.65"
                        />

                        <path
                            d="
                                M245 200
                                C210 190 180 205 172 230
                                C168 245 180 256 195 253
                                C218 247 237 225 245 200
                            "
                            stroke="#F2EFE6"
                            strokeWidth="1"
                            opacity="0.35"
                        />

                        {/* =========================================
                            BALI FLOWER / KEMBANG
                        ========================================== */}
                        <g transform="translate(165 355)">
                            <circle
                                cx="0"
                                cy="0"
                                r="24"
                                stroke="#C8A45D"
                                strokeWidth="3"
                                opacity="0.75"
                            />

                            <path
                                d="
                                    M0 -24
                                    C-28 -55 -65 -38 -54 -8
                                    C-88 -12 -94 28 -58 34
                                    C-78 58 -45 82 -20 58
                                    C-10 92 30 90 32 58
                                    C62 80 88 48 62 26
                                    C92 12 76 -25 43 -16
                                    C48 -48 15 -62 0 -24
                                "
                                stroke="#F2EFE6"
                                strokeWidth="2"
                                opacity="0.35"
                            />

                            <circle
                                cx="0"
                                cy="0"
                                r="7"
                                fill="#C8A45D"
                                opacity="0.8"
                            />
                        </g>

                        {/* =========================================
                            GEOMETRIC BALI DIAMONDS
                        ========================================== */}
                        <g stroke="#C8A45D" opacity="0.65">
                            <path
                                d="M465 300L500 335L465 370L430 335Z"
                                strokeWidth="3"
                            />

                            <path
                                d="M505 385L530 410L505 435L480 410Z"
                                strokeWidth="2"
                            />

                            <path
                                d="M405 455L440 490L405 525L370 490Z"
                                strokeWidth="2.5"
                            />

                            <path
                                d="M330 575L355 600L330 625L305 600Z"
                                strokeWidth="2"
                            />
                        </g>

                        {/* Diamond inner details */}
                        <g stroke="#F2EFE6" opacity="0.3">
                            <path d="M465 315L485 335L465 355L445 335Z" />
                            <path d="M405 470L425 490L405 510L385 490Z" />
                        </g>

                        {/* =========================================
                            LOWER PATRA
                        ========================================== */}
                        <path
                            d="
                                M235 505
                                C180 485 125 510 120 555
                                C115 600 155 625 195 605
                                C225 590 245 550 235 505
                                Z
                            "
                            stroke="#C8A45D"
                            strokeWidth="3"
                            opacity="0.65"
                        />

                        <path
                            d="
                                M220 520
                                C185 510 150 530 147 555
                                C145 580 166 590 188 578
                                C205 568 218 545 220 520
                            "
                            stroke="#F2EFE6"
                            strokeWidth="1.5"
                            opacity="0.35"
                        />

                        {/* =========================================
                            SMALL CURLS
                        ========================================== */}
                        <path
                            d="
                                M120 555
                                C75 530 35 550 40 590
                                C45 625 82 635 105 605
                            "
                            stroke="#C8A45D"
                            strokeWidth="3"
                            opacity="0.55"
                        />

                        <path
                            d="
                                M120 665
                                C70 660 35 690 55 725
                                C75 755 120 735 115 700
                            "
                            stroke="#F2EFE6"
                            strokeWidth="1.5"
                            opacity="0.25"
                        />

                        {/* =========================================
                            SMALL GOLD DOTS
                        ========================================== */}
                        <g fill="#C8A45D" opacity="0.75">
                            <circle cx="455" cy="250" r="4" />
                            <circle cx="485" cy="275" r="2.5" />
                            <circle cx="425" cy="405" r="3" />
                            <circle cx="375" cy="545" r="4" />
                            <circle cx="290" cy="650" r="2.5" />
                            <circle cx="250" cy="700" r="3" />
                        </g>
                    </svg>
                </div>

                {/* =================================================
                    RIGHT BALI ORNAMENT
                ================================================== */}
                <div
                    className="
                        absolute
                        -right-[190px]
                        top-1/2
                        h-[850px]
                        w-[650px]
                        -translate-y-1/2
                        scale-x-[-1]
                        opacity-70
                        sm:-right-[150px]
                        lg:-right-[100px]
                    "
                >
                    <svg
                        viewBox="0 0 650 850"
                        className="h-full w-full"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="
                                M530 35
                                C420 70 325 135 285 235
                                C245 335 285 415 235 505
                                C190 585 105 625 55 710
                            "
                            stroke="#C8A45D"
                            strokeWidth="4"
                            opacity="0.55"
                        />

                        <path
                            d="
                                M555 40
                                C450 95 360 160 320 250
                                C280 340 320 420 270 510
                                C220 600 130 640 75 730
                            "
                            stroke="#F2EFE6"
                            strokeWidth="1.5"
                            opacity="0.25"
                        />

                        <path
                            d="
                                M580 55
                                C490 125 410 185 370 270
                                C335 345 365 425 315 520
                                C270 610 185 670 110 750
                            "
                            stroke="#C8A45D"
                            strokeWidth="1"
                            opacity="0.35"
                        />

                        <path
                            d="
                                M390 115
                                C330 100 270 130 255 185
                                C245 225 270 260 310 258
                                C355 255 390 210 390 115
                                Z
                            "
                            stroke="#C8A45D"
                            strokeWidth="3"
                            opacity="0.75"
                        />

                        <path
                            d="
                                M370 135
                                C330 125 292 145 283 180
                                C277 205 293 225 318 225
                                C345 222 367 190 370 135
                                Z
                            "
                            stroke="#F2EFE6"
                            strokeWidth="1.5"
                            opacity="0.45"
                        />

                        <path
                            d="
                                M370 135
                                C350 160 330 190 318 225
                            "
                            stroke="#C8A45D"
                            strokeWidth="1.5"
                            opacity="0.8"
                        />

                        <path
                            d="
                                M255 185
                                C205 165 155 185 145 225
                                C138 255 160 278 190 275
                                C225 270 250 235 255 185
                                Z
                            "
                            stroke="#C8A45D"
                            strokeWidth="2.5"
                            opacity="0.65"
                        />

                        <g transform="translate(165 355)">
                            <circle
                                cx="0"
                                cy="0"
                                r="24"
                                stroke="#C8A45D"
                                strokeWidth="3"
                                opacity="0.75"
                            />

                            <path
                                d="
                                    M0 -24
                                    C-28 -55 -65 -38 -54 -8
                                    C-88 -12 -94 28 -58 34
                                    C-78 58 -45 82 -20 58
                                    C-10 92 30 90 32 58
                                    C62 80 88 48 62 26
                                    C92 12 76 -25 43 -16
                                    C48 -48 15 -62 0 -24
                                "
                                stroke="#F2EFE6"
                                strokeWidth="2"
                                opacity="0.35"
                            />

                            <circle
                                cx="0"
                                cy="0"
                                r="7"
                                fill="#C8A45D"
                                opacity="0.8"
                            />
                        </g>

                        <g stroke="#C8A45D" opacity="0.65">
                            <path
                                d="M465 300L500 335L465 370L430 335Z"
                                strokeWidth="3"
                            />

                            <path
                                d="M505 385L530 410L505 435L480 410Z"
                                strokeWidth="2"
                            />

                            <path
                                d="M405 455L440 490L405 525L370 490Z"
                                strokeWidth="2.5"
                            />

                            <path
                                d="M330 575L355 600L330 625L305 600Z"
                                strokeWidth="2"
                            />
                        </g>

                        <path
                            d="
                                M235 505
                                C180 485 125 510 120 555
                                C115 600 155 625 195 605
                                C225 590 245 550 235 505
                                Z
                            "
                            stroke="#C8A45D"
                            strokeWidth="3"
                            opacity="0.65"
                        />

                        <path
                            d="
                                M120 555
                                C75 530 35 550 40 590
                                C45 625 82 635 105 605
                            "
                            stroke="#C8A45D"
                            strokeWidth="3"
                            opacity="0.55"
                        />

                        <g fill="#C8A45D" opacity="0.75">
                            <circle cx="455" cy="250" r="4" />
                            <circle cx="485" cy="275" r="2.5" />
                            <circle cx="425" cy="405" r="3" />
                            <circle cx="375" cy="545" r="4" />
                            <circle cx="290" cy="650" r="2.5" />
                            <circle cx="250" cy="700" r="3" />
                        </g>
                    </svg>
                </div>

                {/* =================================================
                    CENTER DARK FADE
                ================================================== */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-[linear-gradient(90deg,rgba(17,17,17,0.15)_0%,rgba(17,17,17,0.65)_18%,rgba(17,17,17,0.96)_34%,rgba(17,17,17,1)_50%,rgba(17,17,17,0.96)_66%,rgba(17,17,17,0.65)_82%,rgba(17,17,17,0.15)_100%)]
                    "
                />

                <div
                    className="
                        absolute
                        inset-0
                        bg-[linear-gradient(180deg,rgba(0,0,0,0.65)_0%,transparent_25%,transparent_75%,rgba(0,0,0,0.7)_100%)]
                    "
                />
            </div>

            {/* =====================================================
                CONTENT
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
                    <div className="mb-4 flex items-center justify-center gap-4">
                        <span className="h-px w-10 bg-[#C8A45D]/70" />

                        <span
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.35em]
                                text-[#C8A45D]
                            "
                        >
                            Developer
                        </span>

                        <span className="h-px w-10 bg-[#C8A45D]/70" />
                    </div>

                    <h2
                        className="
                            text-3xl
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-[#F2EFE6]
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
                            text-white/50
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
                                border-white/10
                                bg-[#151515]/95
                                shadow-2xl
                                backdrop-blur-sm
                                transition-all
                                duration-500
                                hover:-translate-y-1
                                hover:border-[#C8A45D]/50
                                hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]
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
                                        from-black/85
                                        via-black/15
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
                                        border-[#C8A45D]/50
                                        bg-black/50
                                        text-xs
                                        font-semibold
                                        text-[#D4B875]
                                        backdrop-blur-md
                                    "
                                >
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                {/* Project Badge */}
                                <span
                                    className="
                                        absolute
                                        right-4
                                        top-4
                                        rounded-full
                                        border
                                        border-[#C8A45D]/40
                                        bg-black/45
                                        px-3
                                        py-1
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.2em]
                                        text-[#D4B875]
                                        backdrop-blur-md
                                    "
                                >
                                    Project
                                </span>
                            </div>

                            {/* CONTENT */}
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    px-5
                                    py-5
                                "
                            >
                                <div>
                                    <p
                                        className="
                                            text-[9px]
                                            uppercase
                                            tracking-[0.25em]
                                            text-[#C8A45D]/70
                                        "
                                    >
                                        Development
                                    </p>

                                    <h3
                                        className="
                                            mt-1
                                            text-base
                                            font-semibold
                                            text-[#F2EFE6]
                                        "
                                    >
                                        {item.title}
                                    </h3>
                                </div>

                                <span
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-white/10
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
            </div>
        </section>
    );
}