<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ \Illuminate\Support\Str::of($slug)->replace('-', ' ')->title() }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>

<body class="font-sans antialiased bg-slate-950">
    <div class="min-h-screen flex flex-col">
        @include('welcome.header')

        @php
            $heroImages = collect([$project->banner_image])
                ->merge($image->pluck('image_path'))
                ->filter()
                ->values();
        @endphp
        <section id="top" class="relative h-[60vh] md:h-[70vh] overflow-hidden">
            <div class="absolute inset-0">
                @foreach ($heroImages as $index => $heroImage)
                    <img src="{{ asset('storage/' . $heroImage) }}"
                        class="hero-slide absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 {{ $index == 0 ? 'opacity-100' : 'opacity-0' }}"
                        alt="">
                @endforeach
            </div>
            <div class="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>

            <div class="relative h-full">
                <div class="flex h-full items-center">
                    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
                        <div class="max-w-2xl">
                            <h1
                                class="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[0.16em] text-white uppercase">
                                {{ \Illuminate\Support\Str::of($slug)->replace('-', ' ')->upper() }}
                            </h1>
                            <div class="mt-6 flex items-center gap-3 text-white/90 uppercase tracking-[0.25em] text-xs">
                                <span>Project</span>
                                <span class="w-8 h-px bg-white/40"></span>
                                <span>{{ $project->type }}</span>
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
                        {{ $project->description }}
                    </p>
                    <div class="mt-6">
                        <a href="#details"
                            class="inline-flex items-center rounded-full border border-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-900 hover:text-white transition">
                            Explore
                            <svg class="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z"
                                    clip-rule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div id="details" class="mt-10">
                    <div class="grid gap-8 md:grid-cols-2 items-start">
                        <div class="rounded-2xl overflow-hidden bg-black/5">
                            <div class="aspect-[16/9]" id="youtubePreviewWrapper">
                                <iframe id="youtubePreview" class="w-full h-full" src="" title="Ocean Breeze"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowfullscreen></iframe>
                            </div>
                        </div>
                        <div class="text-slate-700 text-sm">
                            {{ $project->description_1 }}
                        </div>
                    </div>

                    <div class="mt-12 text-center">
                        <h2 class="text-2xl sm:text-3xl font-semibold tracking-[0.2em] uppercase text-slate-900">
                            {{ \Illuminate\Support\Str::of($slug)->replace('-', ' ')->upper() }}
                        </h2>
                        <p class="mt-4 text-sm leading-relaxed text-slate-700 max-w-3xl mx-auto">
                            {{ $project->description_2 }}
                        </p>

                        <div class="mt-8 max-w-3xl mx-auto">
                            <div class="border-t border-slate-200"></div>
                            <div class="py-4 flex items-center justify-center gap-6 text-slate-700 text-sm">
                                <span>Residential</span>
                                <span class="text-slate-400">•</span>
                                <span>Multiple Unit Types</span>
                                <span class="text-slate-400">•</span>
                                <span>Strategic Location</span>
                            </div>
                            <div class="border-t border-slate-200"></div>
                        </div>

                        <div class="mt-6">
                            <a href="mailto:umahbalimesari@gmail.com"
                                class="inline-flex items-center rounded-full border border-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-900 hover:text-white transition">
                                Contact Us Now!
                            </a>
                        </div>
                    </div>
                </div>

                <div class="mt-14 rounded-2xl overflow-hidden">
                    <img src="{{ asset('storage/' . $project->highlight_path) }}" alt=""
                        class="w-full h-auto object-cover">
                </div>

                <div class="mt-10 grid gap-8 md:grid-cols-[minmax(0,1fr),minmax(0,1fr)] items-start">
                    <div class="grid gap-4">
                        <img src="{{ asset('storage/' . $project->highlight_2_path) }}" alt=""
                            class="rounded-xl w-full h-auto object-cover">
                    </div>
                    <div class="text-slate-700 text-sm leading-relaxed">
                        {{ $project->description_3 }}
                        <div class="mt-6">
                            <a href="mailto:umahbalimesari@gmail.com"
                                class="inline-flex items-center rounded-full border border-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-900 hover:text-white transition">
                                Contact Us Now!
                            </a>
                        </div>
                    </div>
                </div>

                <div class="mt-14">
                    <h3 class="text-center text-sm font-semibold tracking-[0.35em] uppercase text-slate-900">Gallery
                    </h3>
                    <div class="mt-6 columns-2 md:columns-3 gap-4">
                        @foreach ($image as $image)
                            <img class="mb-4 w-full rounded-lg" src="{{ asset('storage/' . $image->image_path) }}"
                                alt="">
                        @endforeach
                    </div>
                </div>
            </section>
        </main>

        @include('welcome.footer')
    </div>
</body>

</html>

<script>
    const ytUrl = @json($project->youtube_url);

    const ytPreview = document.getElementById('youtubePreview');
    const ytWrapper = document.getElementById('youtubePreviewWrapper');

    function extractYoutubeId(url) {
        if (!url) return null;

        const regExp = /(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
        const match = url.match(regExp);

        return match ? match[1] : null;
    }

    function updateYoutubePreview() {
        const videoId = extractYoutubeId(ytUrl);

        if (videoId) {
            ytPreview.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
            ytWrapper.classList.remove('hidden');
        } else {
            ytPreview.src = '';
            ytWrapper.classList.add('hidden');
        }
    }

    updateYoutubePreview();

    const slides = document.querySelectorAll(".hero-slide");

    let currentSlide = 0;

    if (slides.length > 1) {
        setInterval(() => {
            slides[currentSlide].classList.remove("opacity-100");
            slides[currentSlide].classList.add("opacity-0");

            currentSlide = (currentSlide + 1) % slides.length;

            slides[currentSlide].classList.remove("opacity-0");
            slides[currentSlide].classList.add("opacity-100");
        }, 10000);
    }
</script>
