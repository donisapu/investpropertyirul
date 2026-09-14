import { useState } from "react";
import { route } from "ziggy-js";

/*
 * Featured Developer Projects — mengikuti mockup Figma.
 *
 * Susunan: eyebrow, lalu baris intro (judul kiri + paragraf kanan), lalu
 * baris filter, lalu grid kartu. Kartu di mockup tidak memakai pembungkus
 * putih berbingkai — hanya foto, judul, lokasi, dan panah.
 *
 * Daftar filter diturunkan dari nilai `type` proyek yang benar-benar ada,
 * jadi tidak ada pill yang menghasilkan nol hasil.
 */
export default function DeveloperProjects({ project = [], landings }) {
    const [selected, setSelected] = useState("All");

    const typeOf = (item) => item.category_name || item.type;
    const categories = ["All", ...new Set(project.map(typeOf).filter(Boolean))];

    const filtered =
        selected === "All"
            ? project
            : project.filter((item) => typeOf(item) === selected);

    if (project.length === 0) return null;

    return (
        <section
            id="developer-projects"
            aria-labelledby="projects-heading"
            className="w-full bg-cream text-ink"
        >
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[30px] px-6 py-16 sm:px-10 lg:px-[72px] lg:pb-20 lg:pt-16">
                <p className="text-[11px] uppercase leading-[17px] tracking-[1.5px] text-gold-ink">
                    Featured Projects
                </p>

                {/* ============ INTRO ============ */}
                <div className="flex flex-col gap-4 lg:flex-row lg:gap-16">
                    <h2
                        id="projects-heading"
                        className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.2] text-ink lg:w-[380px] lg:shrink-0"
                    >
                        Developer Projects
                    </h2>
                    {landings?.developer_project_desc && (
                        <p className="max-w-[70ch] flex-1 text-[15px] leading-[23px] text-ink-soft">
                            {landings.developer_project_desc}
                        </p>
                    )}
                </div>

                {/* ============ FILTER ============ */}
                {categories.length > 2 && (
                    <div
                        role="group"
                        aria-label="Saring proyek berdasarkan tipe"
                        className="flex flex-wrap items-start gap-3"
                    >
                        {categories.map((category) => {
                            const active = selected === category;
                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setSelected(category)}
                                    aria-pressed={active}
                                    className={`rounded-[30px] px-5 py-[11px] text-[12px] leading-[19px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-ink ${
                                        active
                                            ? "bg-ink text-cream"
                                            : "bg-cream-deep text-ink hover:bg-gold-line"
                                    }`}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ============ DAFTAR PROYEK ============ */}
                <ul
                    aria-live="polite"
                    className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-4"
                >
                    {filtered.map((item) => (
                        <li key={item.id}>
                            <a
                                href={route("project.show", { slug: item.slug })}
                                className="group flex h-full flex-col gap-3 rounded-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-ink"
                            >
                                <div className="h-[200px] w-full overflow-hidden rounded-[14px] bg-cream-deep sm:h-[260px]">
                                    <img
                                        src={`/storage/${item.banner_image}`}
                                        alt={item.title}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                <h3 className="text-[19px] font-semibold leading-[29px] text-ink transition-colors group-hover:text-gold-ink">
                                    {item.title}
                                </h3>

                                <p className="text-[13px] leading-5 text-ink-soft">
                                    {item.location || item.subtitle || "Development"}
                                </p>

                                <span
                                    aria-hidden="true"
                                    className="mt-auto text-[22px] leading-[34px] text-ink transition-transform duration-300 group-hover:translate-x-1"
                                >
                                    &rarr;
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
