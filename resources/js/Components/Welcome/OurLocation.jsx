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
            className="relative overflow-hidden bg-mono-100 text-mono-900"
        >
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                {/* Soft blobs */}
                <div className="absolute -left-40 -top-40 h-[550px] w-[550px] rounded-full bg-white/80 blur-3xl" />

                <div className="absolute -right-40 top-[-120px] h-[600px] w-[600px] rounded-full bg-mono-300/40 blur-3xl" />

                <div className="absolute bottom-[-250px] left-[20%] h-[600px] w-[800px] rounded-full bg-mono-200/70 blur-3xl" />

                {/* Topographic circles */}
                <div className="absolute right-[-120px] top-[5%] h-[700px] w-[700px] rounded-full border border-mono-500/10" />

                <div className="absolute right-[-70px] top-[10%] h-[600px] w-[600px] rounded-full border border-mono-500/10" />

                <div className="absolute right-[-20px] top-[15%] h-[500px] w-[500px] rounded-full border border-mono-500/10" />

                <div className="absolute right-[30px] top-[20%] h-[400px] w-[400px] rounded-full border border-mono-500/10" />

                <div className="absolute right-[80px] top-[25%] h-[300px] w-[300px] rounded-full border border-mono-500/10" />

                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage: `
                            linear-gradient(#525252 1px, transparent 1px),
                            linear-gradient(90deg, #525252 1px, transparent 1px)
                        `,
                        backgroundSize: "80px 80px",
                    }}
                />
            </div>
            {/* Decorative background */}
            <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-mono-200/60 blur-3xl" />
            <div className="pointer-events-none absolute -left-32 bottom-20 h-72 w-72 rounded-full bg-mono-200/50 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
                {/* ================= HEADER ================= */}
                <div className="mx-auto max-w-3xl text-center">
                    <span className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-mono-500">
                        <span className="h-px w-8 bg-mono-400" />
                        Our Location
                        <span className="h-px w-8 bg-mono-400" />
                    </span>

                    <h2 className="text-3xl font-semibold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                        We only choose
                        <span className="block text-mono-500">
                            hot spot tourism area.
                        </span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-mono-600 sm:text-base">
                        {landings?.location_desc}
                    </p>
                </div>

                {/* ================= LANDMARKS ================= */}
                {landmarks?.length > 0 && (
                    <div className="mt-14">
                        <div className="mb-5 flex items-end justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mono-500">
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
                                    className="group relative overflow-hidden rounded-2xl border border-mono-300/60 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    {/* Image */}
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={`/storage/${landmark.image_path}`}
                                            alt={landmark.name}
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                        />

                                        {/* Image overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                        {/* Number */}
                                        <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-mono-900 backdrop-blur">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        {/* Content on image */}
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

                {/* ================= CTA ================= */}
                <div className="mt-10 flex justify-center">
                    <a
                        href={route("property-for-sale.index")}
                        className="group inline-flex items-center gap-3 rounded-full bg-mono-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-mono-700 hover:shadow-xl"
                    >
                        <span>Lihat Unit Tersedia</span>

                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-1">
                            →
                        </span>
                    </a>
                </div>

                {/* ================= MAPPING ================= */}
                {landings?.mapping_path && (
                    <div className="mt-20">
                        <div className="mb-6 text-center">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mono-500">
                                Location Overview
                            </p>

                            <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">
                                Discover the area
                            </h3>
                        </div>

                        <div className="group relative overflow-hidden rounded-3xl border border-mono-300/60 bg-white p-2 shadow-xl">
                            <div className="relative overflow-hidden rounded-2xl">
                                <img
                                    src={`/storage/${landings.mapping_path}`}
                                    alt="Mapping"
                                    className="h-auto max-h-[650px] w-full object-cover transition duration-700 group-hover:scale-[1.01]"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= GOOGLE MAP ================= */}
                <div className="mt-20">
                    <div className="mb-6 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mono-500">
                            Find Us
                        </p>

                        <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">
                            Our exact location
                        </h3>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-mono-300/60 bg-white p-2 shadow-xl">
                        {finalMapUrl ? (
                            <iframe
                                src={finalMapUrl}
                                className="h-[360px] w-full rounded-2xl sm:h-[450px] lg:h-[550px]"
                                style={{
                                    border: 0,
                                }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        ) : (
                            <div className="flex h-[360px] items-center justify-center rounded-2xl bg-mono-200 text-sm font-medium text-mono-500 sm:h-[450px] lg:h-[550px]">
                                Peta lokasi belum tersedia
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}