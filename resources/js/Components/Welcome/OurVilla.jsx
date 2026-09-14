import { useState, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useReveal from "@/hooks/useReveal";

/*
 * Our Villa — galeri desain villa, mengikuti mockup Figma.
 *
 * Susunan: judul + counter + panah dalam satu baris, satu gambar utama
 * besar, lalu strip thumbnail di bawahnya. Mockup menampilkan 6 thumbnail
 * sejajar; jumlah sebenarnya mengikuti isi slider dari admin.
 *
 * Latar dekoratif versi lama (gradien radial + lingkaran besar) dihapus
 * sesuai mockup — ground kini polos.
 */
export default function OurVilla({ sliders, landings }) {
    const reveal = useReveal();

    const images =
        sliders?.map((slider) => ({
            src: `/storage/${slider.image_path}`,
            id: slider.id,
        })) ?? [];

    const [active, setActive] = useState(0);

    const go = useCallback(
        (n) => setActive((n + images.length) % images.length),
        [images.length]
    );

    /*
     * Tanpa slider tidak ada yang bisa ditampilkan. Versi lama jatuh ke tiga
     * URL Unsplash, artinya halaman produksi bergantung pada CDN pihak
     * ketiga untuk gambar utamanya. Lebih baik section ini tidak dirender.
     */
    if (images.length === 0) return null;

    const onKeyDown = (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            go(active - 1);
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            go(active + 1);
        }
    };

    return (
        <section
            ref={reveal.ref}
            id="our-villa"
            aria-roledescription="carousel"
            aria-label="Galeri desain villa"
            onKeyDown={onKeyDown}
            className={`w-full bg-cream text-ink ${reveal.className}`}
        >
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-6 py-16 sm:px-10 lg:px-[72px] lg:py-20">
                {/* ============ JUDUL + KONTROL ============ */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-10">
                    <div className="flex flex-1 flex-col gap-2">
                        <p className="text-[11px] uppercase leading-[17px] tracking-[1.5px] text-gold-ink">
                            {landings?.slider_title ??
                                "Our Villa Designs Development"}
                        </p>
                        <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight text-ink">
                            Our Villa
                        </h2>
                    </div>

                    {images.length > 1 && (
                        <div className="flex items-center gap-4">
                            <p
                                aria-live="polite"
                                className="w-20 text-[14px] leading-[22px] text-ink"
                            >
                                <span className="font-semibold">
                                    {String(active + 1).padStart(2, "0")}
                                </span>
                                <span className="text-ink-soft">
                                    {" "}
                                    / {String(images.length).padStart(2, "0")}
                                </span>
                            </p>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => go(active - 1)}
                                    aria-label="Desain sebelumnya"
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-line text-ink transition-colors hover:bg-ink hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink"
                                >
                                    <ArrowLeft
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => go(active + 1)}
                                    aria-label="Desain berikutnya"
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-line text-ink transition-colors hover:bg-ink hover:text-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink"
                                >
                                    <ArrowRight
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ============ GAMBAR UTAMA ============ */}
                <div
                    aria-live="polite"
                    className="h-[240px] w-full overflow-hidden rounded-[14px] bg-cream-deep sm:h-[360px] lg:h-[490px]"
                >
                    <img
                        src={images[active].src}
                        alt={`Desain villa ${active + 1} dari ${images.length}`}
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* ============ STRIP THUMBNAIL ============ */}
                {images.length > 1 && (
                    <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
                        {images.map((image, index) => (
                            <li key={image.id ?? index}>
                                <button
                                    type="button"
                                    onClick={() => go(index)}
                                    aria-label={`Tampilkan desain villa ${
                                        index + 1
                                    }`}
                                    aria-current={
                                        index === active ? "true" : undefined
                                    }
                                    className={`group/thumb relative block h-[72px] w-full overflow-hidden rounded-[14px] transition-[opacity,box-shadow] duration-500 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold-ink sm:h-[96px] lg:h-[116px] ${
                                        index === active
                                            ? "opacity-100 shadow-[0_10px_28px_-16px_rgba(199,164,92,0.85)]"
                                            : "opacity-55 hover:opacity-90"
                                    }`}
                                >
                                    <img
                                        src={image.src}
                                        alt=""
                                        className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                                            index === active
                                                ? "scale-[1.03]"
                                                : "group-hover/thumb:scale-[1.03]"
                                        }`}
                                    />

                                    {/*
                                     * Penanda aktif: hairline emas di dalam
                                     * radius, bukan ring tebal dengan celah.
                                     * Dipisah sebagai lapisan sendiri supaya
                                     * garisnya menempel pada tepi foto dan
                                     * tidak menambah kotak di luar kartu.
                                     */}
                                    <span
                                        aria-hidden="true"
                                        className={`pointer-events-none absolute inset-0 rounded-[14px] ring-1 ring-inset transition-[box-shadow,--tw-ring-color] duration-500 ${
                                            index === active
                                                ? "ring-gold/80"
                                                : "ring-ink/10 group-hover/thumb:ring-gold/40"
                                        }`}
                                    />

                                    {/* Sapuan emas tipis di tepi bawah, hanya saat aktif */}
                                    <span
                                        aria-hidden="true"
                                        className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gold transition-transform duration-500 ease-out ${
                                            index === active
                                                ? "scale-x-100"
                                                : "scale-x-0"
                                        }`}
                                    />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
