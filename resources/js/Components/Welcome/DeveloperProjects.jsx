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
                INLINE SVG - NO EXTERNAL FILE
            ====================================================== */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">

                {/* =================================================
                    LEFT ORNAMENT
                ================================================== */}
                <div
                    className="
                        absolute
                        left-[-170px]
                        top-1/2
                        h-[760px]
                        w-[620px]
                        -translate-y-1/2
                        opacity-[0.23]
                        sm:left-[-150px]
                        lg:left-[-120px]
                    "
                >
                    <svg
                        viewBox="0 0 620 760"
                        className="h-full w-full"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Outer decorative frame */}
                        <path
                            d="
                                M305 20
                                C245 55 195 100 165 155
                                C130 220 135 290 175 345
                                C205 385 210 425 180 470
                                C145 525 105 555 45 585
                            "
                            stroke="#F4F4F1"
                            strokeWidth="2"
                        />

                        <path
                            d="
                                M350 35
                                C285 85 250 125 225 175
                                C195 235 200 295 240 345
                                C275 390 275 425 240 475
                                C205 525 160 560 90 600
                            "
                            stroke="#CFCFCB"
                            strokeWidth="1"
                        />

                        {/* Large Patra-inspired leaf */}
                        <path
                            d="
                                M305 85
                                C255 125 230 175 245 220
                                C260 260 295 275 330 245
                                C350 225 355 190 345 155
                                C338 128 322 105 305 85
                                Z
                            "
                            stroke="#FFFFFF"
                            strokeWidth="2.5"
                        />

                        {/* Inner leaf */}
                        <path
                            d="
                                M305 115
                                C275 145 266 180 277 207
                                C287 230 307 237 324 220
                                C340 202 340 175 330 150
                                C323 134 314 122 305 115
                                Z
                            "
                            stroke="#D7D7D3"
                            strokeWidth="1.4"
                        />

                        {/* Leaf vein */}
                        <path
                            d="
                                M305 115
                                C307 155 310 190 324 220
                            "
                            stroke="#FFFFFF"
                            strokeWidth="1"
                        />

                        {/* Curved Bali leaves */}
                        <path
                            d="
                                M245 220
                                C205 195 170 205 155 235
                                C145 255 155 275 180 280
                                C205 285 230 265 245 220
                                Z
                            "
                            stroke="#EEEEEB"
                            strokeWidth="2"
                        />

                        <path
                            d="
                                M240 345
                                C195 330 160 345 150 375
                                C143 397 158 415 182 412
                                C210 408 232 385 240 345
                                Z
                            "
                            stroke="#D6D6D2"
                            strokeWidth="1.8"
                        />

                        {/* Flower ornament */}
                        <path
                            d="
                                M175 345
                                C155 325 125 330 120 350
                                C115 370 135 385 155 380
                                C140 405 155 425 177 418
                                C198 410 195 385 180 375
                                C205 380 220 360 210 342
                                C200 325 180 330 175 345
                                Z
                            "
                            stroke="#FFFFFF"
                            strokeWidth="2"
                        />

                        {/* Flower center */}
                        <circle
                            cx="172"
                            cy="365"
                            r="9"
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                        />

                        {/* Small petals */}
                        <path
                            d="M172 356C165 345 150 342 143 350"
                            stroke="#D2D2CE"
                            strokeWidth="1"
                        />

                        <path
                            d="M180 365C193 360 202 350 201 340"
                            stroke="#D2D2CE"
                            strokeWidth="1"
                        />

                        <path
                            d="M170 375C160 388 158 400 164 408"
                            stroke="#D2D2CE"
                            strokeWidth="1"
                        />

                        {/* Lower large leaf */}
                        <path
                            d="
                                M180 470
                                C130 450 90 470 85 510
                                C82 545 115 565 150 550
                                C180 537 195 505 180 470
                                Z
                            "
                            stroke="#F1F1EE"
                            strokeWidth="2.2"
                        />

                        <path
                            d="
                                M175 485
                                C140 480 115 495 110 520
                                C108 540 128 548 145 538
                                C162 528 174 505 175 485
                                Z
                            "
                            stroke="#CFCFCA"
                            strokeWidth="1.2"
                        />

                        {/* Decorative curls */}
                        <path
                            d="
                                M85 510
                                C45 490 20 505 25 535
                                C30 565 65 570 85 550
                            "
                            stroke="#FFFFFF"
                            strokeWidth="2"
                        />

                        <path
                            d="
                                M90 600
                                C45 620 30 650 55 670
                                C80 690 110 670 105 640
                                C102 625 95 612 90 600
                            "
                            stroke="#D5D5D1"
                            strokeWidth="1.5"
                        />

                        {/* Small diamonds / ornamental details */}
                        <path
                            d="M420 110L438 128L420 146L402 128Z"
                            stroke="#E8E8E4"
                            strokeWidth="1.5"
                        />

                        <path
                            d="M455 175L468 188L455 201L442 188Z"
                            stroke="#CFCFCB"
                        />

                        <path
                            d="M430 500L450 520L430 540L410 520Z"
                            stroke="#E8E8E4"
                        />

                        {/* Fine contour lines */}
                        <path
                            d="
                                M400 75
                                C470 140 500 220 470 295
                                C450 345 455 405 490 455
                                C520 500 525 550 500 600
                            "
                            stroke="#BDBDB8"
                            strokeWidth="1"
                        />

                        <path
                            d="
                                M430 55
                                C500 130 535 220 505 305
                                C485 365 490 425 525 475
                            "
                            stroke="#AAAAA5"
                            strokeWidth="0.8"
                        />
                    </svg>
                </div>

                {/* =================================================
                    RIGHT ORNAMENT
                ================================================== */}
                <div
                    className="
                        absolute
                        right-[-170px]
                        top-1/2
                        h-[760px]
                        w-[620px]
                        -translate-y-1/2
                        scale-x-[-1]
                        opacity-[0.23]
                        sm:right-[-150px]
                        lg:right-[-120px]
                    "
                >
                    <svg
                        viewBox="0 0 620 760"
                        className="h-full w-full"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="
                                M305 20
                                C245 55 195 100 165 155
                                C130 220 135 290 175 345
                                C205 385 210 425 180 470
                                C145 525 105 555 45 585
                            "
                            stroke="#F4F4F1"
                            strokeWidth="2"
                        />

                        <path
                            d="
                                M350 35
                                C285 85 250 125 225 175
                                C195 235 200 295 240 345
                                C275 390 275 425 240 475
                                C205 525 160 560 90 600
                            "
                            stroke="#CFCFCB"
                            strokeWidth="1"
                        />

                        <path
                            d="
                                M305 85
                                C255 125 230 175 245 220
                                C260 260 295 275 330 245
                                C350 225 355 190 345 155
                                C338 128 322 105 305 85
                                Z
                            "
                            stroke="#FFFFFF"
                            strokeWidth="2.5"
                        />

                        <path
                            d="
                                M305 115
                                C275 145 266 180 277 207
                                C287 230 307 237 324 220
                                C340 202 340 175 330 150
                                C323 134 314 122 305 115
                                Z
                            "
                            stroke="#D7D7D3"
                            strokeWidth="1.4"
                        />

                        <path
                            d="
                                M305 115
                                C307 155 310 190 324 220
                            "
                            stroke="#FFFFFF"
                            strokeWidth="1"
                        />

                        <path
                            d="
                                M245 220
                                C205 195 170 205 155 235
                                C145 255 155 275 180 280
                                C205 285 230 265 245 220
                                Z
                            "
                            stroke="#EEEEEB"
                            strokeWidth="2"
                        />

                        <path
                            d="
                                M240 345
                                C195 330 160 345 150 375
                                C143 397 158 415 182 412
                                C210 408 232 385 240 345
                                Z
                            "
                            stroke="#D6D6D2"
                            strokeWidth="1.8"
                        />

                        <path
                            d="
                                M175 345
                                C155 325 125 330 120 350
                                C115 370 135 385 155 380
                                C140 405 155 425 177 418
                                C198 410 195 385 180 375
                                C205 380 220 360 210 342
                                C200 325 180 330 175 345
                                Z
                            "
                            stroke="#FFFFFF"
                            strokeWidth="2"
                        />

                        <circle
                            cx="172"
                            cy="365"
                            r="9"
                            stroke="#FFFFFF"
                            strokeWidth="1.5"
                        />

                        <path
                            d="M172 356C165 345 150 342 143 350"
                            stroke="#D2D2CE"
                            strokeWidth="1"
                        />

                        <path
                            d="M180 365C193 360 202 350 201 340"
                            stroke="#D2D2CE"
                            strokeWidth="1"
                        />

                        <path
                            d="M170 375C160 388 158 400 164 408"
                            stroke="#D2D2CE"
                            strokeWidth="1"
                        />

                        <path
                            d="
                                M180 470
                                C130 450 90 470 85 510
                                C82 545 115 565 150 550
                                C180 537 195 505 180 470
                                Z
                            "
                            stroke="#F1F1EE"
                            strokeWidth="2.2"
                        />

                        <path
                            d="
                                M175 485
                                C140 480 115 495 110 520
                                C108 540 128 548 145 538
                                C162 528 174 505 175 485
                                Z
                            "
                            stroke="#CFCFCA"
                            strokeWidth="1.2"
                        />

                        <path
                            d="
                                M85 510
                                C45 490 20 505 25 535
                                C30 565 65 570 85 550
                            "
                            stroke="#FFFFFF"
                            strokeWidth="2"
                        />

                        <path
                            d="
                                M90 600
                                C45 620 30 650 55 670
                                C80 690 110 670 105 640
                                C102 625 95 612 90 600
                            "
                            stroke="#D5D5D1"
                            strokeWidth="1.5"
                        />

                        <path
                            d="M420 110L438 128L420 146L402 128Z"
                            stroke="#E8E8E4"
                            strokeWidth="1.5"
                        />

                        <path
                            d="M455 175L468 188L455 201L442 188Z"
                            stroke="#CFCFCB"
                        />

                        <path
                            d="M430 500L450 520L430 540L410 520Z"
                            stroke="#E8E8E4"
                        />

                        <path
                            d="
                                M400 75
                                C470 140 500 220 470 295
                                C450 345 455 405 490 455
                                C520 500 525 550 500 600
                            "
                            stroke="#BDBDB8"
                            strokeWidth="1"
                        />

                        <path
                            d="
                                M430 55
                                C500 130 535 220 505 305
                                C485 365 490 425 525 475
                            "
                            stroke="#AAAAA5"
                            strokeWidth="0.8"
                        />
                    </svg>
                </div>

                {/* =================================================
                    ADDITIONAL SMALL ORNAMENTS
                ================================================== */}

                {/* Left top flower */}
                <svg
                    className="
                        absolute
                        left-[2%]
                        top-[7%]
                        h-24
                        w-24
                        opacity-[0.18]
                        sm:h-32
                        sm:w-32
                    "
                    viewBox="0 0 120 120"
                    fill="none"
                >
                    <circle
                        cx="60"
                        cy="60"
                        r="22"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                    />

                    <path
                        d="
                            M60 38
                            C45 20 20 28 25 48
                            C5 43 0 68 20 72
                            C7 88 28 105 43 90
                            C50 110 75 110 77 90
                            C95 105 115 85 100 70
                            C120 62 108 38 88 46
                            C92 25 70 18 60 38
                        "
                        stroke="#DCDCD8"
                        strokeWidth="2"
                    />

                    <path
                        d="M60 15V38M60 82V105M15 60H38M82 60H105"
                        stroke="#BDBDB8"
                        strokeWidth="1"
                    />
                </svg>

                {/* Right top flower */}
                <svg
                    className="
                        absolute
                        right-[2%]
                        top-[7%]
                        h-24
                        w-24
                        opacity-[0.18]
                        sm:h-32
                        sm:w-32
                    "
                    viewBox="0 0 120 120"
                    fill="none"
                >
                    <circle
                        cx="60"
                        cy="60"
                        r="22"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                    />

                    <path
                        d="
                            M60 38
                            C45 20 20 28 25 48
                            C5 43 0 68 20 72
                            C7 88 28 105 43 90
                            C50 110 75 110 77 90
                            C95 105 115 85 100 70
                            C120 62 108 38 88 46
                            C92 25 70 18 60 38
                        "
                        stroke="#DCDCD8"
                        strokeWidth="2"
                    />

                    <path
                        d="M60 15V38M60 82V105M15 60H38M82 60H105"
                        stroke="#BDBDB8"
                        strokeWidth="1"
                    />
                </svg>

                {/* =================================================
                    CENTER FADE
                ================================================== */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-[linear-gradient(90deg,rgba(17,17,17,0.05)_0%,rgba(17,17,17,0.38)_14%,rgba(17,17,17,0.88)_29%,rgba(17,17,17,0.98)_42%,rgba(17,17,17,0.98)_58%,rgba(17,17,17,0.88)_71%,rgba(17,17,17,0.38)_86%,rgba(17,17,17,0.05)_100%)]
                    "
                />

                <div
                    className="
                        absolute
                        inset-0
                        bg-[linear-gradient(180deg,rgba(17,17,17,0.55)_0%,transparent_20%,transparent_80%,rgba(17,17,17,0.65)_100%)]
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
                                bg-mono-900/95
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

                                {/* Badge */}
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