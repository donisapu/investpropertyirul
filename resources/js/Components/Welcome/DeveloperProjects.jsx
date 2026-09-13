import { useState } from "react";
import { route } from "ziggy-js";

export default function DeveloperProjects({ project = [], landings }) {
    // State untuk filter kategori (Opsional, menyesuaikan layout gambar)
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Mengambil daftar kategori unik dari data project
    const categories = ["All", ...new Set(project.map((item) => item.category_name || item.type).filter(Boolean))];

    const filteredProjects = selectedCategory === "All" 
        ? project 
        : project.filter((item) => (item.category_name || item.type) === selectedCategory);

    return (
        <section
            id="developer-projects"
            className="relative isolate overflow-hidden bg-[#F9F9FB] text-slate-900"
        >
            <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                {/* =================================================
                    HEADER WITH FILTER BUTTONS (Layout mirip gambar)
                ================================================== */}
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D]">
                            Featured Projects
                        </span>
                        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#F4F0E6] sm:text-4xl lg:text-5xl">
                            Developer Projects
                        </h2>
                        {landings?.developer_project_desc && (
                            <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
                                {landings.developer_project_desc}
                            </p>
                        )}
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`rounded-full px-5 py-2 text-xs font-medium transition-all duration-300 ${
                                    selectedCategory === cat
                                        ? "bg-[#C8A45D] text-black font-semibold shadow-md"
                                        : "border border-white/10 bg-white/5 text-white/70 hover:border-[#C8A45D]/50 hover:text-white"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* =================================================
                    PROJECT GRID (Vertical Cards 3 Column)
                ================================================== */}
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((item) => (
                        <a
                            key={item.id}
                            href={route("project.show", { slug: item.slug })}
                            className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#161616] p-3 transition-all duration-500 hover:-translate-y-1 hover:border-[#C8A45D]/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                        >
                            {/* IMAGE CONTAINER (Vertical Aspect Ratio like Image Reference) */}
                            <div className="relative aspect-[4/4.5] w-full overflow-hidden rounded-2xl bg-neutral-900">
                                <img
                                    src={`/storage/${item.banner_image}`}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Subtle Gradient Layer */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                            </div>

                            {/* CARD CONTENT */}
                            <div className="flex items-center justify-between px-2 pt-4 pb-2">
                                <div>
                                    <h3 className="text-base font-semibold text-[#F4F0E6] transition-colors duration-300 group-hover:text-[#D4B875]">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1 text-xs text-white/45">
                                        {item.location || item.subtitle || "Development"}
                                    </p>
                                </div>

                                {/* Arrow Icon */}
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/70 transition-all duration-300 group-hover:border-[#C8A45D] group-hover:bg-[#C8A45D] group-hover:text-black">
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