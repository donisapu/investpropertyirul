export default function OurLocation() {
    return (
        <section id="our-location" className="bg-white text-slate-900">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-center text-2xl sm:text-3xl font-semibold uppercase">Berada di Lokasi Strategis</h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-700 max-w-3xl mx-auto text-center">
                    Kuta Selatan – Bali, adalah lokasi dengan potensi luar biasa dalam pariwisata, menjadikannya pilihan strategis untuk hunian atau investasi properti.
                    Dikelilingi oleh spot wisata terkenal dan ramai oleh wisatawan, daerah ini menawarkan perkembangan pesat yang mendukung pertumbuhan nilai properti Anda.
                    Tidak hanya sebagai tempat tinggal di kawasan elite, properti di Bali Selatan memberikan peluang besar untuk investasi yang terus meningkat seiring waktu.
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-xl overflow-hidden bg-white shadow-sm">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ngurah_Rai_Internasional_Airport_Welcome_Sign.jpg/2560px-Ngurah_Rai_Internasional_Airport_Welcome_Sign.jpg" alt="" className="h-36 w-full object-cover" />
                        <div className="px-4 py-3">
                            <div className="font-semibold">Ngurah Rai International Airport</div>
                            <div className="text-slate-600 text-sm">12 KM</div>
                        </div>
                    </div>
                    <div className="rounded-xl overflow-hidden bg-white shadow-sm">
                        <img src="https://akcdn.detik.net.id/visual/2021/06/08/pantai-pandawa-bali_169.jpeg?w=1200" alt="" className="h-36 w-full object-cover" />
                        <div className="px-4 py-3">
                            <div className="font-semibold">Pantai Pandawa</div>
                            <div className="text-slate-600 text-sm">7 KM</div>
                        </div>
                    </div>
                    <div className="rounded-xl overflow-hidden bg-white shadow-sm">
                        <img src="https://www.gwkbali.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fhelyis1v%2Fproduction%2Ff151c34e22d2dfa7b06f593f4d14ed22214e0a16-1920x1080.jpg&w=3840&q=75" alt="" className="h-36 w-full object-cover" />
                        <div className="px-4 py-3">
                            <div className="font-semibold">Garuda Wisnu Kencana Cultural Park</div>
                            <div className="text-slate-600 text-sm">3 KM</div>
                        </div>
                    </div>
                    <div className="rounded-xl overflow-hidden bg-white shadow-sm">
                        <img src="https://www.theungasan.com/wp-content/uploads/2020/01/bali-uluwatu-temple-goibibo.jpg" alt="" className="h-36 w-full object-cover" />
                        <div className="px-4 py-3">
                            <div className="font-semibold">Pura Luhur Uluwatu</div>
                            <div className="text-slate-600 text-sm">7 KM</div>
                        </div>
                    </div>
                    <div className="rounded-xl overflow-hidden bg-white shadow-sm">
                        <img src="https://bali.com/wp-content/uploads/2020/09/omnia-1.jpg" alt="" className="h-36 w-full object-cover" />
                        <div className="px-4 py-3">
                            <div className="font-semibold">Savaya Club</div>
                            <div className="text-slate-600 text-sm">4 KM</div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-center">
                    <a href="#properties" className="inline-flex items-center rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-600 transition">Lihat Unit Tersedia</a>
                </div>

                <div className="mt-10 rounded-2xl overflow-hidden relative">
                    <img src="/assets/img/elements/location-highlight.png" alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-4 flex items-center justify-center">
                        <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold">Samani Villa Ungasan</div>
                    </div>
                </div>

                <h3 className="mt-10 text-center text-xl sm:text-2xl font-semibold uppercase">Lokasi</h3>
                <div className="mt-4 rounded-2xl overflow-hidden bg-slate-100">
                    <iframe
                        src="https://www.google.com/maps?q=-8.802645,115.165608&z=13&output=embed"
                        className="w-full h-[340px] sm:h-[420px] lg:h-[520px]"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </section>
    );
}
