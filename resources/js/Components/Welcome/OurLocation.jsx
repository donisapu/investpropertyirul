export default function OurLocation({ landings, landmarks }) {
    const extractMapUrl = (htmlString) => {
        if (!htmlString) return null;

        let url = htmlString.trim();

        if (url.includes("<iframe")) {
            const match = url.match(/src=["'](.*?)["']/);
            url = match ? match[1] : null;
        }

        if (!url) return null;

        if (
            url.includes("googleusercontent.com") ||
            url.includes("maps.google.com") ||
            url.includes("google.com/maps")
        ) {
            return url;
        }

        if (url.startsWith("www.")) {
            return `https://${url}`;
        }

        return url;
    };

    const finalMapUrl = extractMapUrl(landings?.location);

    return (
        <section
            id="our-location"
            className="relative isolate overflow-hidden bg-[#e5e5e3] text-[#171717]"
        >
            {/* =====================================================
                ABSTRACT MONOCHROME BACKGROUND
            ====================================================== */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">

                    {/* Soft atmospheric gradient */}
                    <div
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.95),transparent_48%),linear-gradient(180deg,#f2f2f0_0%,#e8e8e6_52%,#dededc_100%)]"
                    />

                    {/* Giant architectural arc */}
                    <div
                        className="absolute -right-[260px] -top-[300px] h-[760px] w-[760px] rounded-full border-[72px] border-black/[0.055]"
                    />

                    {/* Left architectural silhouette */}
                    <div className="absolute bottom-0 left-[-70px] h-[520px] w-[500px] opacity-[0.10]">
                        <div className="absolute bottom-0 left-8 h-[330px] w-[150px] skew-x-[-8deg] bg-gradient-to-t from-black/40 to-black/5" />

                        <div className="absolute bottom-0 left-[150px] h-[430px] w-[190px] skew-x-[-5deg] bg-gradient-to-t from-black/45 to-black/5" />

                        <div className="absolute bottom-0 left-[315px] h-[285px] w-[135px] skew-x-[8deg] bg-gradient-to-t from-black/35 to-black/5" />
                    </div>

                    {/* Contour lines */}
                    <div className="absolute -left-24 top-[-80px] h-[480px] w-[560px] opacity-[0.08]">
                        <div className="absolute inset-0 rounded-[48%] border border-black/40 rotate-[-18deg]" />
                        <div className="absolute inset-[28px] rounded-[48%] border border-black/30 rotate-[-18deg]" />
                        <div className="absolute inset-[56px] rounded-[48%] border border-black/25 rotate-[-18deg]" />
                        <div className="absolute inset-[84px] rounded-[48%] border border-black/20 rotate-[-18deg]" />
                    </div>

                    {/* Dot grid */}
                    <div
                        className="absolute right-[7%] top-[13%] h-28 w-28 opacity-30"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle, #777 1.5px, transparent 1.5px)",
                            backgroundSize: "14px 14px",
                        }}
                    />

                    {/* Flowing lines */}
                    <svg
                        className="absolute bottom-[-20px] left-0 h-[280px] w-full opacity-20"
                        viewBox="0 0 1440 280"
                        fill="none"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M-40 190C220 40 330 250 590 150C830 58 1010 42 1490 150"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            className="text-black"
                        />

                        <path
                            d="M-80 235C180 95 340 300 620 190C900 80 1110 90 1510 195"
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-black"
                        />

                        <path
                            d="M-80 265C190 130 350 320 650 220C940 120 1130 125 1510 225"
                            stroke="currentColor"
                            strokeWidth="0.8"
                            className="text-black"
                        />
                    </svg>

                </div>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">

                {/* =================================================
                    HEADER
                ================================================== */}
                <div className="mx-auto max-w-3xl text-center">
                    <span
                        className="
                            mb-4
                            inline-flex
                            items-center
                            gap-2
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.25em]
                            text-mono-500
                        "
                    >
                        <span className="h-px w-8 bg-mono-400" />

                        Our Location

                        <span className="h-px w-8 bg-mono-400" />
                    </span>

                    <h2
                        className="
                            text-3xl
                            font-semibold
                            uppercase
                            leading-tight
                            tracking-tight
                            sm:text-4xl
                            lg:text-5xl
                        "
                    >
                        We only choose

                        <span className="block text-mono-500">
                            hot spot tourism area.
                        </span>
                    </h2>

                    <p
                        className="
                            mx-auto
                            mt-6
                            max-w-2xl
                            text-sm
                            leading-7
                            text-mono-600
                            sm:text-base
                        "
                    >
                        {landings?.location_desc}
                    </p>
                </div>

                {/* =================================================
                    LANDMARKS
                ================================================== */}
                {landmarks?.length > 0 && (
                    <div className="mt-14">
                        <div className="mb-5 flex items-end justify-between">
                            <div>
                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-[0.2em]
                                        text-mono-500
                                    "
                                >
                                    Nearby
                                </p>

                                <h3 className="mt-1 text-xl font-semibold sm:text-2xl">
                                    Popular destinations
                                </h3>
                            </div>

                            <span className="hidden text-sm text-mono-500 sm:block">
                                Explore the surroundings
                            </span>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {landmarks.map((landmark, index) => (
                                <div
                                    key={index}
                                    className="
                                        group
                                        relative
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-mono-300/60
                                        bg-white
                                        shadow-sm
                                        transition-all
                                        duration-500
                                        hover:-translate-y-1
                                        hover:shadow-xl
                                    "
                                >
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={`/storage/${landmark.image_path}`}
                                            alt={landmark.name}
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                                transition
                                                duration-700
                                                group-hover:scale-110
                                            "
                                        />

                                        {/* Image overlay */}
                                        <div
                                            className="
                                                absolute
                                                inset-0
                                                bg-gradient-to-t
                                                from-black/70
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
                                                bg-white/90
                                                text-xs
                                                font-bold
                                                text-mono-900
                                                backdrop-blur
                                            "
                                        >
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                            <h4 className="text-lg font-semibold leading-tight">
                                                {landmark.name}
                                            </h4>

                                            <p className="mt-1 text-sm text-white/75">
                                                {landmark.distance}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* =================================================
                    CTA
                ================================================== */}
                <div className="mt-10 flex justify-center">
                    <a
                        href={route("property-for-sale.index")}
                        className="
                            group
                            inline-flex
                            items-center
                            gap-3
                            rounded-full
                            bg-mono-900
                            px-6
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            shadow-lg
                            transition-all
                            duration-300
                            hover:bg-mono-700
                            hover:shadow-xl
                        "
                    >
                        <span>Lihat Unit Tersedia</span>

                        <span
                            className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-full
                                bg-white/10
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                            "
                        >
                            →
                        </span>
                    </a>
                </div>

                {/* =================================================
                    MAPPING
                ================================================== */}
                {landings?.mapping_path && (
                    <div className="mt-20">
                        <div className="mb-6 text-center">
                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.2em]
                                    text-mono-500
                                "
                            >
                                Location Overview
                            </p>

                            <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">
                                Discover the area
                            </h3>
                        </div>

                        <div
                            className="
                                group
                                relative
                                overflow-hidden
                                rounded-3xl
                                border
                                border-mono-300/60
                                bg-white
                                p-2
                                shadow-xl
                            "
                        >
                            <div className="relative overflow-hidden rounded-2xl">
                                <img
                                    src={`/storage/${landings.mapping_path}`}
                                    alt="Mapping"
                                    className="
                                        h-auto
                                        max-h-[650px]
                                        w-full
                                        object-cover
                                        transition
                                        duration-700
                                        group-hover:scale-[1.01]
                                    "
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                        </div>
                    </div>
                )}

                {/* =================================================
                    GOOGLE MAP
                ================================================== */}
                <div className="mt-20">
                    <div className="mb-6 text-center">
                        <p
                            className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.2em]
                                text-mono-500
                            "
                        >
                            Find Us
                        </p>

                        <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">
                            Our exact location
                        </h3>
                    </div>

                    <div
                        className="
                            overflow-hidden
                            rounded-3xl
                            border
                            border-mono-300/60
                            bg-white
                            p-2
                            shadow-xl
                        "
                    >
                        {finalMapUrl ? (
                            <iframe
                                src={finalMapUrl}
                                className="
                                    h-[360px]
                                    w-full
                                    rounded-2xl
                                    sm:h-[450px]
                                    lg:h-[550px]
                                "
                                style={{
                                    border: 0,
                                }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        ) : (
                            <div
                                className="
                                    flex
                                    h-[360px]
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-mono-200
                                    text-sm
                                    font-medium
                                    text-mono-500
                                    sm:h-[450px]
                                    lg:h-[550px]
                                "
                            >
                                Peta lokasi belum tersedia
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}