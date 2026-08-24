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

                    {/* BIG ORGANIC SHAPE - TOP RIGHT */}
                    <div
                        className="
                            absolute
                            -right-[180px]
                            -top-[180px]
                            h-[650px]
                            w-[850px]
                            rotate-[-18deg]
                            rounded-[48%_52%_60%_40%]
                            bg-[#c8c8c6]
                        "
                    />

                    {/* CUTOUT */}
                    <div
                        className="
                            absolute
                            -right-[80px]
                            -top-[80px]
                            h-[480px]
                            w-[680px]
                            rotate-[-18deg]
                            rounded-[48%_52%_60%_40%]
                            bg-[#e5e5e3]
                        "
                    />

                    {/* SECOND ORGANIC SHAPE - BOTTOM LEFT */}
                    <div
                        className="
                            absolute
                            -bottom-[280px]
                            -left-[180px]
                            h-[550px]
                            w-[800px]
                            rotate-[18deg]
                            rounded-[55%_45%_40%_60%]
                            bg-[#cececc]
                        "
                    />

                    {/* CUTOUT */}
                    <div
                        className="
                            absolute
                            -bottom-[190px]
                            -left-[80px]
                            h-[390px]
                            w-[650px]
                            rotate-[18deg]
                            rounded-[55%_45%_40%_60%]
                            bg-[#e5e5e3]
                        "
                    />

                    {/* LARGE CENTER CIRCLE */}
                    <div
                        className="
                            absolute
                            left-[-180px]
                            top-[35%]
                            h-[420px]
                            w-[420px]
                            rounded-full
                            border-[60px]
                            border-[#d0d0ce]
                        "
                    />

                    {/* SMALL DECORATIVE CIRCLE */}
                    <div
                        className="
                            absolute
                            right-[28%]
                            top-[18%]
                            h-24
                            w-24
                            rounded-full
                            border-[16px]
                            border-[#d0d0ce]
                        "
                    />

                    {/* SOFT SHADOW / DEPTH */}
                    <div
                        className="
                            absolute
                            right-[8%]
                            top-[10%]
                            h-[450px]
                            w-[450px]
                            rounded-full
                            bg-white/30
                            blur-[80px]
                        "
                    />

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