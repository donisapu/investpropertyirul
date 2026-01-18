<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $property->property_name }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="font-sans antialiased bg-white text-slate-900">
    <div class="min-h-screen flex flex-col">
        @include('welcome.header')

        <main class="flex-1">
            <section class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
                <h1 class="text-2xl sm:text-3xl font-semibold">{{ $property->property_name }}</h1>
                <p class="mt-3 text-sm leading-relaxed text-slate-700 max-w-3xl">
                    {{ $property->detail }}
                </p>

                <div class="mt-6 grid gap-6 md:grid-cols-2">
                    <div class="rounded-lg overflow-hidden">
                        @if($images->count())
                            <img src="{{ Storage::url($images->first()->image_url) }}" alt="" class="w-full h-full object-cover">
                        @else
                            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1280&auto=format&fit=crop" alt="" class="w-full h-full object-cover">
                        @endif
                    </div>
                    <div>
                        <ul class="space-y-2 text-sm text-slate-700">
                            <li>Location: {{ $property->property_location }}</li>
                            <li>Bedroom: {{ $property->bedroom }}</li>
                            <li>Bathroom: {{ $property->bathroom }}</li>
                            <li>Land Area: {{ $property->land_area }} m²</li>
                            <li>Building Area: {{ $property->building_area }} m²</li>
                        </ul>

                        <div class="mt-6 flex items-center gap-3">
                            @if($property->listing_url)
                                <a href="{{ $property->listing_url }}" target="_blank" class="inline-flex items-center rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-600 transition">
                                    Visit Listing
                                </a>
                            @endif
                            <a href="mailto:umahbalimesari@gmail.com" class="inline-flex items-center rounded-full border border-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-900 hover:text-white transition">
                                Contact Sales
                            </a>
                        </div>
                    </div>
                </div>

                @if($images->count() > 1)
                    <div class="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
                        @foreach($images->slice(1) as $img)
                            <img src="{{ Storage::url($img->image_url) }}" alt="" class="w-full h-40 object-cover rounded-md">
                        @endforeach
                    </div>
                @endif

                @if($docs->count())
                    <div class="mt-10">
                        <h2 class="text-lg font-semibold">Documents</h2>
                        <div class="mt-3 flex flex-wrap gap-3">
                            @foreach($docs as $doc)
                                <a href="{{ Storage::url($doc->document_url) }}" target="_blank" class="inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold hover:bg-slate-900 hover:text-white transition">
                                    {{ $doc->document_name }}
                                </a>
                            @endforeach
                        </div>
                    </div>
                @endif
            </section>
        </main>

        @include('welcome.footer')
    </div>
</body>
</html>

