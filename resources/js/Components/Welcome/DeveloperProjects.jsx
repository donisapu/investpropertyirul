import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function DeveloperProjects({ project, landings }) {
    return (
        <section id="developer-projects" className="bg-mono-900 text-mono-100">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <div className="flex gap-2 items-center justify-center">
                        <span className="inline-block text-mono-500 text-2xl sm:text-3xl font-semibold tracking-wide">
                            Developer
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-mono-100">
                            Project
                        </h2>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-mono-300 max-w-3xl mx-auto">
                        {landings.developer_project_desc}
                    </p>
                </div>

                <div className="mt-10 grid gap-8 md:grid-cols-2">
                    {project.map((item, index) => (
                        <a
                            key={item.id}
                            href={route("project.show", { slug: item.slug })}
                            className="group relative block overflow-hidden rounded-2xl border border-mono-700 bg-mono-900 shadow-sm hover:border-mono-500 transition"
                        >
                            <div className="aspect-[16/9] w-full">
                                <img
                                    src={`/storage/${item.banner_image}`}
                                    alt={item.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="absolute left-3 top-3 flex items-center gap-2">
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-mono-100 text-mono-900 text-xs font-bold">
                                    {index + 1}
                                </span>
                                <span className="rounded-full bg-mono-900/80 border border-mono-500 px-3 py-1 text-[0.7rem] font-semibold text-mono-100 backdrop-blur-sm">
                                    {item.title}
                                </span>
                            </div>

                            <div className="px-4 py-4 text-center text-mono-100 font-semibold">
                                {item.title}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
