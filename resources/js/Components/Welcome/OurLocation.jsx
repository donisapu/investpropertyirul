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
            url.includes("maps.google.com")
        ) {
            return url;
        }

        if (url.startsWith("www.")) {
            return `https://${url}`;
        }

        return url;
    };

    const finalMapUrl = extractMapUrl(landings.location);

    return (
        <section id="our-location" className="bg-white text-slate-900">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-center text-2xl sm:text-3xl font-semibold uppercase">
                    Berada di Lokasi Strategis
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-700 max-w-3xl mx-auto text-center">
                    {landings.location_desc}
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    {landmarks &&
                        landmarks.map((landmark, index) => (
                            <div
                                key={index}
                                className="rounded-xl overflow-hidden bg-white shadow-sm"
                            >
                                <img
                                    src={`/storage/${landmark.image_path}`}
                                    alt={landmark.name}
                                    className="h-36 w-full object-cover"
                                />
                                <div className="px-4 py-3">
                                    <div className="font-semibold">
                                        {landmark.name}{" "}
                                    </div>
                                    <div className="text-slate-600 text-sm">
                                        {landmark.distance}{" "}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                <div className="mt-6 flex items-center justify-center">
                    <a
                        href={route("property-for-sale.index")}
                        className="inline-flex items-center rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-600 transition"
                    >
                        Lihat Unit Tersedia
                    </a>
                </div>

                <div className="mt-10 rounded-2xl overflow-hidden relative">
                    <img
                        src="/assets/img/elements/location-highlight.png"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-4 flex items-center justify-center">
                        <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold">
                            Samani Villa Ungasan
                        </div>
                    </div>
                </div>

                <h3 className="mt-10 text-center text-xl sm:text-2xl font-semibold uppercase">
                    Lokasi
                </h3>
                <div className="mt-4 rounded-2xl overflow-hidden bg-slate-100">
                    {/* <iframe
                        src="https://www.google.com/maps?q=-8.802645,115.165608&z=13&output=embed"
                        className="w-full h-[340px] sm:h-[420px] lg:h-[520px]"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe> */}
                    {finalMapUrl ? (
                        <iframe
                            src={finalMapUrl}
                            width="100%"
                            height="520px"
                            style={{
                                border: 0,
                            }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">
                            Peta lokasi belum tersedia
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
