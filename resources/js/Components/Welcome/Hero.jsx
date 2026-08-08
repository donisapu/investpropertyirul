export default function Hero({ landings, settings }) {
    return (
        <section
            id="top"
            className="relative h-[70vh] md:h-[90vh] overflow-hidden bg-mono-900"
        >
            <div className="absolute inset-0">
                <div className="h-full w-full bg-mono-900/70">
                    <div
                        className="h-full w-full bg-cover bg-center mix-blend-overlay"
                        style={{
                            backgroundImage: `url(/storage/${landings.hero_path})`,
                        }}
                    ></div>
                </div>
            </div>

            <div className="relative h-full">
                <div className="flex h-full items-center justify-center">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-[0.75rem] font-semibold tracking-[0.25em] text-mono-300 uppercase">
                            {landings?.subheader}
                        </p>

                        <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[0.16em] text-mono-100 uppercase">
                            {landings?.header}
                        </h1>

                        <p className="mt-4 text-[0.8rem] sm:text-sm leading-relaxed text-mono-300 max-w-xl mx-auto">
                            {landings?.description}
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
                            <div className="h-px w-full bg-mono-500/50"></div>
                        </div>

                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                            <a
                                href={`https://wa.me/${settings?.whatsapp}`}
                                className="inline-flex items-center justify-center rounded-full border border-mono-100 px-7 py-2.5 text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-mono-100 hover:bg-mono-100 hover:text-mono-900 transition"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
