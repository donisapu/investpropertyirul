import { route } from "ziggy-js";

export default function DeveloperProjects({ project, landings }) {
    return (
        <section
            id="developer-projects"
            className="relative isolate overflow-hidden bg-[#111111] text-white"
        >
            

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}
            <div
                className="
                    relative
                    z-10
                    mx-auto
                    max-w-6xl
                    px-4
                    py-14
                    sm:px-6
                    lg:px-8
                    lg:py-20
                "
            >
                {/* =================================================
                    HEADER
                ================================================== */}
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mb-5 flex items-center justify-center gap-4">
                        <span className="h-px w-12 bg-[#C8A45D]/70" />

                        <span
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.4em]
                                text-[#C8A45D]
                            "
                        >
                            Developer
                        </span>

                        <span className="h-px w-12 bg-[#C8A45D]/70" />
                    </div>

                    <h2
                        className="
                            text-3xl
                            font-semibold
                            uppercase
                            tracking-[0.14em]
                            text-[#F4F0E6]
                            sm:text-4xl
                            lg:text-5xl
                        "
                    >
                        Project
                    </h2>

                    <div className="mx-auto mt-5 h-px w-16 bg-[#C8A45D]/60" />

                    <p
                        className="
                            mx-auto
                            mt-6
                            max-w-2xl
                            text-sm
                            leading-7
                            text-white/50
                        "
                    >
                        {landings?.developer_project_desc}
                    </p>
                </div>

                {/* =================================================
                    PROJECT GRID
                ================================================== */}
                <div className="mt-12 grid gap-7 md:grid-cols-2">
                    {project.map((item, index) => (
                        <a
                            key={item.id}
                            href={route("project.show", {
                                slug: item.slug,
                            })}
                            className="
                                group
                                relative
                                block
                                overflow-hidden
                                rounded-2xl
                                border
                                border-white/[0.08]
                                bg-[#151515]
                                shadow-[0_20px_60px_rgba(0,0,0,0.35)]
                                transition-all
                                duration-500
                                hover:-translate-y-1
                                hover:border-[#C8A45D]/50
                                hover:shadow-[0_25px_70px_rgba(0,0,0,0.55)]
                            "
                        >
                            {/* IMAGE */}
                            <div className="relative aspect-[16/9] w-full overflow-hidden">
                                <img
                                    src={`/storage/${item.banner_image}`}
                                    alt={item.title}
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                        transition
                                        duration-700
                                        group-hover:scale-105
                                    "
                                />

                                {/* Image darkness */}
                                <div
                                    className="
                                        absolute
                                        inset-0
                                        bg-gradient-to-t
                                        from-black/85
                                        via-black/15
                                        to-transparent
                                    "
                                />

                                {/* Number */}
                                <div
                                    className="
                                        absolute
                                        left-4
                                        top-4
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-[#C8A45D]/60
                                        bg-black/50
                                        text-xs
                                        font-semibold
                                        text-[#D4B875]
                                        backdrop-blur-md
                                    "
                                >
                                    {String(index + 1).padStart(2, "0")}
                                </div>

                                {/* Category */}
                                <div
                                    className="
                                        absolute
                                        right-4
                                        top-4
                                        rounded-full
                                        border
                                        border-[#C8A45D]/40
                                        bg-black/50
                                        px-3
                                        py-1.5
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.22em]
                                        text-[#D4B875]
                                        backdrop-blur-md
                                    "
                                >
                                    Development
                                </div>
                            </div>

                            {/* CARD CONTENT */}
                            <div className="flex items-center justify-between px-5 py-5">
                                <div>
                                    <h3
                                        className="
                                            text-base
                                            font-semibold
                                            tracking-wide
                                            text-[#F4F0E6]
                                            transition-colors
                                            duration-300
                                            group-hover:text-[#D4B875]
                                        "
                                    >
                                        {item.title}
                                    </h3>

                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="h-px w-6 bg-[#C8A45D]/60" />

                                        <span
                                            className="
                                                text-[9px]
                                                uppercase
                                                tracking-[0.25em]
                                                text-white/35
                                            "
                                        >
                                            Explore Project
                                        </span>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <span
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-white/10
                                        text-lg
                                        text-[#C8A45D]
                                        transition-all
                                        duration-300
                                        group-hover:translate-x-1
                                        group-hover:border-[#C8A45D]/60
                                        group-hover:bg-[#C8A45D]/10
                                    "
                                >
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