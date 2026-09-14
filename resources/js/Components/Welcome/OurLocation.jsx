import { ArrowRight, MapPin } from "lucide-react";
import useReveal from "@/hooks/useReveal";

export default function OurLocation({ landings, landmarks }) {
    const reveal = useReveal();

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
            ref={reveal.ref}
            id="our-location"
            className={`w-full bg-cream py-16 text-ink lg:py-20 ${reveal.className}`}
        >
            {/* =====================================================
                MAIN CONTAINER
            ====================================================== */}
            <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-[72px]">
                
                {/* 1. INTRO — judul kiri, deskripsi + CTA kanan (sejajar atas) */}
                <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-20">
                    <div className="lg:col-span-6">
                        <p className="text-[12px] uppercase leading-[19px] tracking-[1.5px] text-gold-ink">
                            Prime Location
                        </p>
                        <h2 className="mt-[18px] text-[clamp(1.75rem,4vw,2.5rem)] font-semibold uppercase leading-[1.2] tracking-tight text-ink">
                            We only choose <br />
                            hot spot tourism area.
                        </h2>
                    </div>

                    <div className="flex flex-col items-start gap-6 lg:col-span-6">
                        <p className="max-w-[70ch] text-[15px] leading-[23px] text-ink-soft">
                            {landings?.location_desc ||
                                "Nikmati kemudahan akses menuju berbagai destinasi wisata utama dan pusat hiburan terbaik di sekitarnya."}
                        </p>

                        <a
                            href={route("property-for-sale.index")}
                            className="group inline-flex items-center gap-[22px] rounded-[40px] bg-ink px-[23px] py-4 text-[13px] font-semibold leading-5 text-cream transition-colors hover:bg-ink-soft"
                        >
                            Lihat Unit Tersedia
                            <ArrowRight
                                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                                aria-hidden="true"
                            />
                        </a>
                    </div>
                </div>

                {/* 2. LANDMARKS SECTION (Asymmetric Staggered Grid) */}
                {landmarks?.length > 0 && (
                    <div className="mt-20">
                        <div className="mb-7 flex flex-col gap-2">
                            <p className="text-[12px] uppercase leading-[19px] tracking-[1.5px] text-gold-ink">
                                Surroundings
                            </p>
                            <h3 className="text-2xl font-semibold text-ink">
                                Nearby Destinations
                            </h3>
                            <p className="text-[13px] leading-5 text-ink-soft">
                                Terhubung langsung dengan lokasi-lokasi strategis
                            </p>
                        </div>

                        {/*
                         * Caption ditaruh DI BAWAH foto, sesuai mockup.
                         * Versi lama menumpuk nama & jarak di atas foto dengan
                         * hanya scrim gradien, sehingga keterbacaannya
                         * bergantung pada foto yang diunggah admin.
                         */}
                        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
                            {landmarks.map((landmark, index) => (
                                <li key={index} className="group flex flex-col gap-3">
                                    <div className="h-[180px] w-full overflow-hidden rounded-[10px] bg-cream-deep sm:aspect-[243/191] sm:h-auto">
                                        <img
                                            src={`/storage/${landmark.image_path}`}
                                            alt={landmark.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="flex items-baseline gap-3">
                                        <span className="text-[13px] leading-5 text-gold-ink">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <h4 className="text-[19px] font-semibold leading-[29px] text-ink">
                                            {landmark.name}
                                        </h4>
                                    </div>

                                    <p className="flex items-center gap-1.5 text-[13px] leading-5 text-ink-soft">
                                        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                        {landmark.distance}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/*
                 * 3. MASTER PLAN + PETA
                 * Mockup menaruh keduanya sebagai kolom polos di atas ground,
                 * bukan kartu putih bersayap bayangan. Judul dan keterangan
                 * berada di atas gambar, gambar diberi garis rambut saja.
                 */}
                <div className="mt-16 grid gap-8 lg:mt-20 lg:grid-cols-2">
                    {landings?.mapping_path && (
                        <div className="flex flex-col gap-3">
                            <p className="text-[12px] uppercase leading-[19px] tracking-[1.5px] text-gold-ink">
                                Master Plan
                            </p>
                            <h3 className="text-2xl font-semibold text-ink">
                                Location Overview
                            </h3>
                            <p className="text-[13px] leading-5 text-ink-soft">
                                Gambaran peta kawasan dan aksesibilitas di
                                sekitar properti.
                            </p>

                            <div className="mt-2 h-64 overflow-hidden rounded-[10px] border border-gold-line bg-cream-deep sm:h-80 lg:h-[308px]">
                                <img
                                    src={`/storage/${landings.mapping_path}`}
                                    alt="Peta kawasan dan aksesibilitas di sekitar properti"
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                    <div
                        className={`flex flex-col gap-3 ${
                            landings?.mapping_path ? "" : "lg:col-span-2"
                        }`}
                    >
                        <p className="text-[12px] uppercase leading-[19px] tracking-[1.5px] text-gold-ink">
                            Interactive Map
                        </p>
                        <h3 className="text-2xl font-semibold text-ink">
                            Find Us on Map
                        </h3>
                        <p className="text-[13px] leading-5 text-ink-soft">
                            Live Google Maps
                        </p>

                        <div className="mt-2 h-64 w-full overflow-hidden rounded-[10px] border border-gold-line bg-cream-deep sm:h-80 lg:h-[308px]">
                            {finalMapUrl ? (
                                <iframe
                                    src={finalMapUrl}
                                    className="h-full w-full"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Peta lokasi properti"
                                />
                            ) : (
                                /* Keadaan kosong, bukan kotak abu tanpa penjelasan */
                                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center">
                                    <MapPin
                                        className="h-6 w-6 text-gold-ink"
                                        aria-hidden="true"
                                    />
                                    <p className="text-[15px] leading-[23px] text-ink">
                                        Live Google Maps
                                    </p>
                                    <p className="text-[12px] leading-[19px] text-ink-soft">
                                        Peta interaktif dimuat di website
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}