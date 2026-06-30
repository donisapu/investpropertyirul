import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function DeveloperProjects({ project }) {
    return (
        <section id="developer-projects" className="bg-white text-slate-900">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <div className="flex gap-2 items-center justify-center">
                        <span className="inline-block rounded-lg bg-amber-200 px-2 py-1 text-amber-900 text-2xl sm:text-3xl font-semibold tracking-wide">
                            Developer
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-semibold">
                            Project
                        </h2>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-slate-700 max-w-3xl mx-auto">
                        Konsep pengembangan properti kami berfokus pada inovasi
                        berkelanjutan, menjangkau segmen perumahan dan villa.
                        Kami memastikan setiap proyek terbukti mengikuti tren
                        pasar terkini dan menawarkan fleksibilitas desain untuk
                        selaras dengan kebutuhan spesifik klien. Nikmati
                        keuntungan dari lokasi proyek yang strategis dengan
                        jaminan harga properti yang kompetitif dan terjangkau.
                        Untuk mengakomodasi berbagai kebutuhan investasi, kami
                        secara konsisten menyediakan opsi kepemilikan Freehold
                        dan Leasehold pada seluruh portofolio proyek kami.
                    </p>
                </div>

                <div className="mt-10 grid gap-8 md:grid-cols-2">
                    {project.map((item, index) => (
                        <a
                            key={item.id}
                            href={route("project.show", { slug: item.slug })}
                            className="group relative block overflow-hidden rounded-2xl border-2 border-amber-300 bg-white shadow-sm"
                        >
                            <div className="aspect-[16/9] w-full">
                                <img
                                    src={`/storage/${item.banner_image}`}
                                    alt={item.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="absolute left-3 top-3 flex items-center gap-2">
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-900 text-xs font-bold">
                                    {index + 1}
                                </span>
                                <span className="rounded-full bg-white/90 px-2 py-1 text-[0.7rem] font-semibold">
                                    {item.title}
                                </span>
                            </div>

                            <div className="px-4 py-3 text-center text-amber-900 font-semibold">
                                {item.title}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
