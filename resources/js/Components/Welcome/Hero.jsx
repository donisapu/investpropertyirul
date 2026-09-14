import { Link } from "@inertiajs/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/*
 * Hero — mengikuti mockup Figma (export Pencil).
 *
 * Susunan: narasi kiri + foto kanan, lalu strip "capabilities" berpagar
 * garis atas-bawah, lalu strip statistik.
 *
 * Mockup hanya menyediakan frame desktop 1440px. Perilaku responsif di
 * bawah itu diturunkan dari struktur yang sama: komposisi menumpuk di
 * bawah lg, capabilities jadi 2 kolom, statistik jadi 3 kolom rapat.
 */

/* Layanan perusahaan — copy brand, bukan konten CMS. */
const CAPABILITIES = [
    "Development",
    "Architecture",
    "Construction",
    "Real Estate Agency",
];

export default function Hero({ landings, settings, sliders }) {
    const heroImage = landings?.hero_path
        ? `/storage/${landings.hero_path}`
        : sliders && sliders.length > 0
        ? `/storage/${sliders[0].image_path}`
        : "/storage/default-hero.jpg";

    /*
     * Statistik hero di-hardcode atas permintaan klien.
     *
     * Angka-angka ini belum diverifikasi dan berasal dari mockup referensi.
     * Ganti dengan angka yang dapat dibuktikan sebelum rilis publik.
     */
    const stats = [
        { value: "250+", label: "Properties" },
        { value: "2.5K+", label: "Property Users" },
        { value: "98%", label: "Satisfaction" },
    ];

    const whatsapp = settings?.whatsapp;

    return (
        <section
            id="top"
            className="w-full bg-cream text-ink"
        >
            <div className="mx-auto w-full max-w-[1440px] px-6 pb-9 pt-10 sm:px-10 lg:px-[72px] lg:pt-14">
                {/* ============ KOMPOSISI: NARASI + FOTO ============ */}
                <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
                    {/* ---- Narasi ---- */}
                    <div className="flex w-full flex-1 flex-col items-start gap-5">
                        <p className="text-[11px] font-bold uppercase leading-[17px] tracking-[1.5px] text-gold-ink">
                            {landings?.subheader ||
                                "Platform Developer & Investasi Properti"}
                        </p>

                        <h1 className="w-full font-semibold tracking-[-0.02em] text-ink">
                            <span className="block text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.12]">
                                {landings?.header}
                            </span>
                            {/*
                             * Kilau emas pada kata kunci, sesuai mockup.
                             * Stop warna digelapkan dari nilai mockup asli:
                             * 4 dari 6 stop aslinya di bawah 3:1 terhadap
                             * cream (yang paling terang hanya 1,40:1), jadi
                             * bagian tengah kata praktis lenyap. Ramp ini
                             * mempertahankan bentuk kilaunya, seluruh stop
                             * >= 3,77:1.
                             */}
                            <span
                                className="block bg-clip-text text-[clamp(2.1rem,5.7vw,3.375rem)] leading-[1.09] text-transparent"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(90deg,#6B4F21 4.685%,#8B6420 27.342%,#A8762F 44.562%,#8B6420 58.157%,#6B4F21 76.283%,#9C7030 95.315%)",
                                }}
                            >
                                Impianmu
                            </span>
                        </h1>

                        <p className="max-w-[46ch] text-[16px] leading-[25px] text-ink-soft">
                            {landings?.description}
                        </p>

                        {/* ---- Aksi ---- */}
                        <div className="flex flex-wrap items-center gap-[18px] pt-1">
                            {whatsapp && (
                                <a
                                    href={`https://wa.me/${whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-[22px] rounded-[40px] bg-ink px-[23px] py-4 text-[13px] font-semibold leading-5 text-cream transition-colors hover:bg-ink-soft"
                                >
                                    Contact Us
                                    <ArrowRight
                                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                                        aria-hidden="true"
                                    />
                                </a>
                            )}

                            <Link
                                href="/investments"
                                className="group inline-flex items-center gap-1.5 text-[13px] font-semibold leading-5 text-ink underline-offset-4 transition-colors hover:text-gold-ink hover:underline"
                            >
                                Jelajahi Properti
                                <ArrowUpRight
                                    className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    aria-hidden="true"
                                />
                            </Link>
                        </div>

                        <p className="text-[10px] uppercase leading-4 tracking-[1.5px] text-ink-soft">
                            Discover your next destination
                        </p>
                    </div>

                    {/* ---- Foto ---- */}
                    <div className="w-full shrink-0 lg:w-[608px]">
                        <img
                            src={heroImage}
                            alt={
                                landings?.header
                                    ? `${landings.header} — ${
                                          landings?.subheader ?? ""
                                      }`.trim()
                                    : "Properti unggulan"
                            }
                            draggable="false"
                            className="h-[280px] w-full rounded-2xl object-cover sm:h-[400px] lg:h-[558px]"
                        />
                    </div>
                </div>

                {/* ============ CAPABILITIES ============ */}
                <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-gold-line py-[26px] lg:mt-8 lg:grid-cols-4 lg:gap-6">
                    {CAPABILITIES.map((item, i) => (
                        <li key={item} className="flex items-center gap-3">
                            <span className="text-[11px] leading-[17px] text-gold-ink">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-[12px] font-bold uppercase leading-[19px] text-ink">
                                {item}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* ============ STATISTIK (hanya bila diisi admin) ============ */}
                {stats.length > 0 && (
                    <dl className="flex flex-wrap gap-x-12 gap-y-4 pb-3 pt-1">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="flex flex-1 basis-[8rem] items-center gap-3.5"
                            >
                                <dt className="sr-only">{stat.label}</dt>
                                <dd className="flex items-center gap-3.5">
                                    <span className="text-[clamp(1.5rem,3vw,1.875rem)] font-semibold leading-[1.5] text-ink">
                                        {stat.value}
                                    </span>
                                    <span className="text-[10px] uppercase leading-4 tracking-[1px] text-ink-soft">
                                        {stat.label}
                                    </span>
                                </dd>
                            </div>
                        ))}
                    </dl>
                )}
            </div>
        </section>
    );
}
