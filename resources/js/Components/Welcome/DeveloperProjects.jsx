import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function DeveloperProjects() {
    return (
        <section id="developer-projects" className="bg-white text-slate-900">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <div className="flex gap-2 items-center justify-center">
                        <span className="inline-block rounded-lg bg-amber-200 px-2 py-1 text-amber-900 text-2xl sm:text-3xl font-semibold tracking-wide">Developer</span>
                        <h2 className="text-2xl sm:text-3xl font-semibold">Project</h2>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-slate-700 max-w-3xl mx-auto">
                        Konsep pengembangan properti kami berfokus pada inovasi berkelanjutan, menjangkau segmen perumahan dan villa.
                        Kami memastikan setiap proyek terbukti mengikuti tren pasar terkini dan menawarkan fleksibilitas desain untuk selaras
                        dengan kebutuhan spesifik klien. Nikmati keuntungan dari lokasi proyek yang strategis dengan jaminan harga properti
                        yang kompetitif dan terjangkau. Untuk mengakomodasi berbagai kebutuhan investasi, kami secara konsisten menyediakan
                        opsi kepemilikan Freehold dan Leasehold pada seluruh portofolio proyek kami.
                    </p>
                </div>

                <div className="mt-10 grid gap-8 md:grid-cols-2">
                    <Link href={route('project.show', { slug: 'umah-melah-exclusive' })} className="group relative block overflow-hidden rounded-2xl border-2 border-amber-300 bg-white shadow-sm">
                        <div className="aspect-[16/9] w-full">
                            <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop" alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="absolute left-3 top-3 flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-900 text-xs font-bold">1</span>
                            <span className="rounded-full bg-white/90 px-2 py-1 text-[0.7rem] font-semibold">Umah Melah Exclusive</span>
                        </div>
                        <div className="px-4 py-3 text-center text-amber-900 font-semibold">Umah Melah Exclusive</div>
                    </Link>

                    <Link href={route('project.show', { slug: 'umah-melah-banyuning' })} className="group relative block overflow-hidden rounded-2xl border-2 border-amber-300 bg-white shadow-sm">
                        <div className="aspect-[16/9] w-full">
                            <img src="https://images.unsplash.com/photo-1658280024253-34cafdfbb002?q=80&w=1600&auto=format&fit=crop" alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="absolute left-3 top-3 flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-900 text-xs font-bold">2</span>
                            <span className="rounded-full bg-white/90 px-2 py-1 text-[0.7rem] font-semibold">Umah Melah Banyuning</span>
                        </div>
                        <div className="px-4 py-3 text-center text-amber-900 font-semibold">Umah Melah Banyuning</div>
                    </Link>

                    <Link href={route('project.show', { slug: 'umah-melah-panji-iii' })} className="group relative block overflow-hidden rounded-2xl border-2 border-amber-300 bg-white shadow-sm">
                        <div className="aspect-[16/9] w-full">
                            <img src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1600&auto=format&fit=crop" alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="absolute left-3 top-3 flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-900 text-xs font-bold">3</span>
                            <span className="rounded-full bg-white/90 px-2 py-1 text-[0.7rem] font-semibold">Umah Melah Panji III</span>
                        </div>
                        <div className="px-4 py-3 text-center text-amber-900 font-semibold">Umah Melah Panji III</div>
                    </Link>

                    <Link href={route('project.show', { slug: 'umah-melah-panji-ii' })} className="group relative block overflow-hidden rounded-2xl border-2 border-amber-300 bg-white shadow-sm">
                        <div className="aspect-[16/9] w-full">
                            <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="absolute left-3 top-3 flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-900 text-xs font-bold">4</span>
                            <span className="rounded-full bg-white/90 px-2 py-1 text-[0.7rem] font-semibold">Umah Melah Panji II</span>
                        </div>
                        <span className="absolute right-3 top-3 rounded-full bg-red-600 text-white px-2 py-1 text-[0.7rem] font-bold">SOLD OUT</span>
                        <div className="px-4 py-3 text-center text-amber-900 font-semibold">Umah Melah Panji II</div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
