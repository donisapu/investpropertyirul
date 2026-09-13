import { useState } from "react";
import { route } from "ziggy-js";

export default function DeveloperProjects({ project = [], landings }) {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", ...new Set(project.map((item) => item.category_name || item.type).filter(Boolean))];

    const filteredProjects = selectedCategory === "All" 
        ? project 
        : project.filter((item) => (item.category_name || item.type) === selectedCategory);

    return (
        <section
            id="developer-projects"
            className="relative isolate overflow-hidden bg-slate-50 text-slate-900"
        >
            <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
                {/* HEADER */}
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C8A45D]">
                            Featured Projects
                        </span>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            Developer Projects
                        </h2>
                        {landings?.developer_project_desc && (
                            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
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
                                className={`rounded-full px-5 py-2 text-xs font-semibold transition-all duration-300 ${
                                    selectedCategory === cat
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* PROJECT GRID */}
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((item) => (
                        <a
                            key={item.id}
                            href={route("project.show", { slug: item.slug })}
                            className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-xl"
                        >
                            {/* IMAGE CONTAINER */}
                            <div className="relative aspect-[4/4.5] w-full overflow-hidden rounded-2xl bg-slate-100">
                                <img
                                    src={`/storage/${item.banner_image}`}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* CARD CONTENT */}
                            <div className="flex items-center justify-between px-2 pt-4 pb-2">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 transition-colors duration-300 group-hover:text-amber-600">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1 text-xs font-medium text-slate-500">
                                        {item.location || item.subtitle || "Development"}
                                    </p>
                                </div>

                                {/* Arrow Icon */}
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition-all duration-300 group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white">
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