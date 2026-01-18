<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Nusa Dua Ocean Breeze</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="font-sans antialiased bg-slate-950">
    <div class="min-h-screen flex flex-col">
        @include('welcome.header')
        
        <section id="top" class="relative h-[60vh] md:h-[70vh] overflow-hidden">
            <img src="{{ asset('assets/img/elements/hero.jpg') }}" alt="" class="absolute inset-0 w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
            
            <div class="relative h-full">
                <div class="flex h-full items-center">
                    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
                        <div class="max-w-2xl">
                            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[0.16em] text-white uppercase">
                                Nusa Dua Ocean Breeze
                            </h1>
                            <div class="mt-6 flex items-center gap-3">
                                <span class="inline-flex items-center rounded-full bg-white/90 text-slate-900 px-4 py-1.5 text-xs font-semibold shadow">
                                    Loft
                                </span>
                                <span class="inline-flex items-center rounded-full border border-white/70 text-white px-4 py-1.5 text-xs font-semibold">
                                    1 & 2 Bedroom
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <main class="bg-white">
            <section class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
                <div class="max-w-3xl mx-auto text-center">
                    <p class="text-sm leading-relaxed text-slate-700">
                        A peaceful villa complex nestled in the heart of Nusa Dua, Bali. Our one and two-bedroom villas are thoughtfully designed to provide a comfortable and serene living experience, blending modern amenities with the beauty of Bali’s natural surroundings.
                    </p>
                    <div class="mt-6">
                        <a href="#details" class="inline-flex items-center rounded-full border border-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-900 hover:text-white transition">
                            Explore
                            <svg class="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
                        </a>
                    </div>
                </div>

                <div id="details" class="mt-10">
                    <div class="grid gap-8 md:grid-cols-2 items-start">
                        <div class="rounded-2xl overflow-hidden bg-black/5">
                            @php $yt = \App\Models\WebsiteSetting::getSettings()?->youtube_video_url; @endphp
                            <div class="aspect-[16/9]">
                                <iframe
                                    class="w-full h-full"
                                    src="{{ $yt ?: 'https://www.youtube.com/embed/ysz5S6PUM-U' }}"
                                    title="Ocean Breeze"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowfullscreen
                                ></iframe>
                            </div>
                        </div>
                        <div class="text-slate-700 text-sm">
                            With the design phase complete and construction well underway, these villas are perfect for anyone
                            looking to enjoy a laid-back, luxurious lifestyle in one of Bali’s most sought-after locations.
                        </div>
                    </div>

                    <div class="mt-12 text-center">
                        <h2 class="text-2xl sm:text-3xl font-semibold tracking-[0.2em] uppercase text-slate-900">
                            Nusa Dua Ocean Breeze
                        </h2>
                        <p class="mt-4 text-sm leading-relaxed text-slate-700 max-w-3xl mx-auto">
                            Designed to maximize privacy while offering stunning views of the ocean. The architecture blends modern
                            design with luxury elements, featuring clean lines and natural materials that complement the surrounding
                            landscape. Large windows and outdoor terraces provide breathtaking views of the ocean, allowing you to
                            enjoy the beauty of Bali’s coastline from the comfort of your villa.
                        </p>

                        <div class="mt-8 max-w-3xl mx-auto">
                            <div class="border-t border-slate-200"></div>
                            <div class="py-4 flex items-center justify-center gap-6 text-slate-700 text-sm">
                                <span>1 &amp; 2 Bedroom</span>
                                <span class="text-slate-400">•</span>
                                <span>83m² &amp; 108m² Building Size</span>
                                <span class="text-slate-400">•</span>
                                <span>Nusa Dua</span>
                            </div>
                            <div class="border-t border-slate-200"></div>
                        </div>

                        <div class="mt-6">
                            <a href="mailto:umahbalimesari@gmail.com" class="inline-flex items-center rounded-full border border-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-900 hover:text-white transition">
                                Contact Us Now!
                            </a>
                        </div>
                    </div>
                </div>

                <div class="mt-6 grid gap-6 md:grid-cols-2">
                    <div class="rounded-lg overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1280&auto=format&fit=crop" alt="" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <ul class="space-y-2 text-sm text-slate-700">
                            <li>Topology: Villa Complex with 1–2 Bedrooms</li>
                            <li>Land Size: 2500m²</li>
                            <li>Building Size: 83m² & 108m²</li>
                            <li>Location: Nusa Dua</li>
                            <li>Status: Design finished & On progress</li>
                        </ul>

                        <div class="mt-6">
                            <a href="mailto:umahbalimesari@gmail.com" class="inline-flex items-center rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-600 transition">
                                Contact Sales
                            </a>
                        </div>
                    </div>
                </div>

                <div class="mt-14 rounded-2xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1920&auto=format&fit=crop" alt="" class="w-full h-auto object-cover">
                </div>

                <div class="mt-10 grid gap-8 md:grid-cols-[minmax(0,1fr),minmax(0,1fr)] items-start">
                    <div class="grid gap-4">
                        <img src="https://images.unsplash.com/photo-1614149162883-504ce63356ea?q=80&w=1280&auto=format&fit=crop" alt="" class="rounded-xl w-full h-auto object-cover">
                        <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1280&auto=format&fit=crop" alt="" class="rounded-xl w-full h-auto object-cover">
                    </div>
                    <div class="text-slate-700 text-sm leading-relaxed">
                        Offering a perfect blend of comfort and style. Each villa features an open-plan living area with modern furnishings, large windows that flood the space with natural light, and seamless access to the outdoor terrace, allowing for a smooth indoor-outdoor living experience. The fully equipped kitchen is both functional and stylish, with high-end appliances and plenty of storage.
                        <br><br>
                        In the bedrooms, privacy and peaceful retreat await with cozy beds, ambient decor, and views of the garden or ocean. The bathrooms are designed with relaxation in mind, featuring rain showers, premium fixtures, and a spa-like ambiance that enhances your overall experience in the villa.
                        <div class="mt-6">
                            <a href="mailto:umahbalimesari@gmail.com" class="inline-flex items-center rounded-full border border-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-900 hover:text-white transition">
                                Contact Us Now!
                            </a>
                        </div>
                    </div>
                </div>

                <div class="mt-14">
                    <h3 class="text-center text-sm font-semibold tracking-[0.35em] uppercase text-slate-900">Gallery</h3>
                    <div class="mt-6 columns-2 md:columns-3 gap-4">
                        <img class="mb-4 w-full rounded-lg" src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1280&auto=format&fit=crop" alt="">
                        <img class="mb-4 w-full rounded-lg" src="https://images.unsplash.com/photo-1614149162883-504ce63356ea?q=80&w=1280&auto=format&fit=crop" alt="">
                        <img class="mb-4 w-full rounded-lg" src="https://images.unsplash.com/photo-1560448070-432999fb2e4d?q=80&w=1280&auto=format&fit=crop" alt="">
                        <img class="mb-4 w-full rounded-lg" src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1280&auto=format&fit=crop" alt="">
                        <img class="mb-4 w-full rounded-lg" src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1280&auto=format&fit=crop" alt="">
                        <img class="mb-4 w-full rounded-lg" src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1280&auto=format&fit=crop" alt="">
                        <img class="mb-4 w-full rounded-lg" src="https://images.unsplash.com/photo-1658280024253-34cafdfbb002?q=80&w=1280&auto=format&fit=crop" alt="">
                        <img class="mb-4 w-full rounded-lg" src="https://images.unsplash.com/photo-1560448070-432999fb2e4d?q=80&w=1280&auto=format&fit=crop" alt="">
                        <img class="mb-4 w-full rounded-lg" src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1280&auto=format&fit=crop" alt="">
                        <img class="mb-4 w-full rounded-lg" src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1280&auto=format&fit=crop" alt="">
                        <img class="mb-4 w-full rounded-lg" src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1280&auto=format&fit=crop" alt="">
                        <img class="mb-4 w-full rounded-lg" src="https://images.unsplash.com/photo-1658280024253-34cafdfbb002?q=80&w=1280&auto=format&fit=crop" alt="">
                    </div>
                </div>
            </section>
        </main>

        @include('welcome.footer')
    </div>
</body>
</html>
