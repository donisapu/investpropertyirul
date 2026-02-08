export default function Hero() {
    return (
        <section id="top" className="static h-[70vh] md:h-[90vh] overflow-hidden">
            <div className="absolute inset-0">
                <div className="h-full w-full bg-gray-500/60">
                    <div 
                        className="h-full w-full bg-cover bg-center mix-blend-overlay"
                        style={{ backgroundImage: "url('/assets/img/elements/hero.jpg')" }}
                    ></div>
                </div>
            </div>

            <div className="relative h-full">
                <div className="flex h-full items-center justify-center">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-[0.75rem] font-semibold tracking-[0.25em] text-slate-200 uppercase">
                            Platform Developer & Investasi Properti
                        </p>

                        <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[0.16em] text-white uppercase">
                            Developer Terpercaya
                        </h1>

                        <p className="mt-4 text-[0.8rem] sm:text-sm leading-relaxed text-slate-200 max-w-xl mx-auto">
                            Kolaborasi bersama tim profesional untuk mengembangkan, memasarkan, dan mengelola
                            proyek properti dengan transparan dan terstruktur.
                        </p>

                        <div className="mt-10 mx-auto max-w-2xl">
                            <div className="h-px w-full bg-white/60"></div>
                            <div className="flex flex-wrap items-center justify-between gap-4 py-3 text-[0.7rem] sm:text-[0.75rem] font-medium text-slate-50">
                                <div className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                                    <span>Development</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                                    <span>Architecture</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                                    <span>Construction</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                                    <span>Real Estate Agency</span>
                                </div>
                            </div>
                            <div className="h-px w-full bg-white/60"></div>
                        </div>

                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                            <a href="#properti"
                               className="inline-flex items-center justify-center rounded-full border border-white px-7 py-2.5 text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase bg-white/5 hover:bg-white hover:text-slate-900 transition">
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
