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
            className="relative isolate overflow-hidden bg-[#e5e5e3] py-24 text-[#171717] lg:py-32"
        >
            {/* =====================================================
                ABSTRACT MONOCHROME BACKGROUND
            ====================================================== */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(255,255,255,0.95),transparent_40%),linear-gradient(180deg,#f3f3f1_0%,#e8e8e6_55%,#ddddda_100%)]" />

                {/* Decorative Architectural Elements */}
                <div className="absolute -right-[140px] -top-[180px] h-[560px] w-[560px] rounded-full border-[55px] border-black/[0.05]" />
                <div className="absolute left-[-100px] top-[40%] h-[400px] w-[400px] rounded-full border border-black/[0.04]" />

                {/* Dot grid subtle background */}
                <div
                    className="absolute right-[5%] top-[10%] h-32 w-32 opacity-30"
                    style={{
                        backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
                        backgroundSize: "16px 16px",
                    }}
                />
            </div>

            {/* =====================================================
                MAIN CONTAINER
            ====================================================== */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                
                {/* 1. HEADER & QUICK HIGHLIGHTS */}
                <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-7">
                        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-mono-600 backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Prime Location
                        </div>

                        <h2 className="mt-6 text-4xl font-light uppercase leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                            We only choose <br />
                            <span className="font-semibold text-black underline decoration-black/20 underline-offset-8">
                                hot spot tourism area.
                            </span>
                        </h2>
                    </div>

                    <div className="lg:col-span-5">
                        <p className="text-base leading-relaxed text-mono-600 sm:text-lg">
                            {landings?.location_desc || "Nikmati kemudahan akses menuju berbagai destinasi wisata utama dan pusat hiburan terbaik di sekitarnya."}
                        </p>

                        <div className="mt-8 flex items-center gap-4">
                            <a
                                href={route("property-for-sale.index")}
                                className="group inline-flex items-center gap-3 rounded-full bg-mono-900 px-7 py-3.5 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:bg-black hover:shadow-2xl hover:scale-[1.02]"
                            >
                                <span>Lihat Unit Tersedia</span>
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-1">
                                    →
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* 2. LANDMARKS SECTION (Asymmetric Staggered Grid) */}
                {landmarks?.length > 0 && (
                    <div className="mt-20">
                        <div className="mb-10 flex flex-col justify-between border-b border-black/10 pb-6 sm:flex-row sm:items-end">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-mono-500">
                                    Surroundings
                                </span>
                                <h3 className="mt-1 text-2xl font-semibold sm:text-3xl">
                                    Nearby Destinations
                                </h3>
                            </div>
                            <p className="mt-2 text-sm text-mono-500 sm:mt-0">
                                Terhubung langsung dengan lokasi-lokasi strategis
                            </p>
                        </div>

                        {/* Staggered Grid Layout */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                            {landmarks.map((landmark, index) => {
                                // Memberikan variasi margin-top pada layar laptop/desktop untuk efek staggered
                                const isStaggered = index % 2 !== 0 ? "lg:translate-y-6" : "";

                                return (
                                    <div
                                        key={index}
                                        className={`group relative overflow-hidden rounded-3xl border border-white/60 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${isStaggered}`}
                                    >
                                        <div className="relative h-72 w-full overflow-hidden sm:h-80">
                                            <img
                                                src={`/storage/${landmark.image_path}`}
                                                alt={landmark.name}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />

                                            {/* Subtle vignette gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-75" />

                                            {/* Distance Pill / Badge */}
                                            <div className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-mono-900 shadow-md backdrop-blur-md">
                                                📍 {landmark.distance}
                                            </div>

                                            {/* Index number tag */}
                                            <span className="absolute top-4 left-4 text-xs font-extrabold tracking-widest text-white/50">
                                                0{index + 1}
                                            </span>

                                            {/* Floating Info Container */}
                                            <div className="absolute bottom-0 inset-x-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                                                <h4 className="text-xl font-semibold leading-snug">
                                                    {landmark.name}
                                                </h4>
                                                <div className="mt-2 flex items-center gap-2 text-xs text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                    <span>Jelajahi lokasi</span>
                                                    <span>→</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 3. SPLIT SECTION: OVERVIEW MAP + GOOGLE MAP */}
                <div className="mt-28 grid gap-10 lg:grid-cols-12 lg:items-stretch">
                    
                    {/* Left Column: Custom Site Plan / Mapping Image */}
                    {landings?.mapping_path && (
                        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-white/80 bg-white/80 p-6 shadow-xl backdrop-blur-sm">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-mono-500">
                                    Master Plan
                                </span>
                                <h3 className="mt-1 text-2xl font-semibold text-mono-900">
                                    Location Overview
                                </h3>
                                <p className="mt-2 text-xs text-mono-600">
                                    Gambaran peta kawasan dan aksesibilitas di sekitar properti.
                                </p>
                            </div>

                            <div className="relative mt-6 overflow-hidden rounded-2xl border border-mono-200 bg-mono-100">
                                <img
                                    src={`/storage/${landings.mapping_path}`}
                                    alt="Mapping Site Plan"
                                    className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105 sm:h-80 lg:h-96"
                                />
                            </div>
                        </div>
                    )}

                    {/* Right Column: Google Maps (Full Interactive Container) */}
                    <div className={`${landings?.mapping_path ? "lg:col-span-7" : "lg:col-span-12"} flex flex-col justify-between rounded-3xl border border-white/80 bg-white/80 p-6 shadow-xl backdrop-blur-sm`}>
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-mono-500">
                                    Interactive Map
                                </span>
                                <h3 className="mt-1 text-2xl font-semibold text-mono-900">
                                    Find Us on Map
                                </h3>
                            </div>
                            <div className="hidden sm:block">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-mono-100 px-3 py-1 text-xs font-medium text-mono-700">
                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                    Live Google Maps
                                </span>
                            </div>
                        </div>

                        <div className="relative h-[320px] w-full overflow-hidden rounded-2xl border border-mono-200 bg-mono-100 sm:h-[400px] lg:h-full lg:min-h-[380px]">
                            {finalMapUrl ? (
                                <iframe
                                    src={finalMapUrl}
                                    className="h-full w-full rounded-2xl filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Google Map Location"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-mono-400">
                                    Peta lokasi tidak tersedia
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}