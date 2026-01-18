<section id="our-villa" class="bg-white relative text-slate-900">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <h2 class="text-center text-2xl sm:text-3xl font-semibold tracking-wide uppercase">Our Villa Designs Development</h2>
        <div
            x-data="{
                i: 0,
                imgs: [
                    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    'https://images.unsplash.com/photo-1658280024253-34cafdfbb002?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1280&auto=format&fit=crop'
                ],
                dragging: false,
                startX: 0,
                deltaX: 0,
                width: 0,
                setW() { this.width = this.$refs.track.getBoundingClientRect().width },
                go(n) { const len = this.imgs.length; this.i = (n + len) % len },
                prev() { this.go(this.i - 1) },
                next() { this.go(this.i + 1) },
                start(e) { this.dragging = true; this.startX = (e.touches ? e.touches[0].clientX : e.clientX); this.deltaX = 0; this.setW() },
                move(e) { if (!this.dragging) return; const x = (e.touches ? e.touches[0].clientX : e.clientX); this.deltaX = x - this.startX },
                end() { if (!this.dragging) return; const t = this.width * 0.15; if (this.deltaX > t) this.prev(); else if (this.deltaX < -t) this.next(); this.dragging = false; this.deltaX = 0 }
            }"
            x-init="setW(); window.addEventListener('resize', () => setW())"
            class="mt-6"
        >
            <div
                x-ref="track"
                class="relative overflow-hidden rounded-md select-none touch-pan-x"
                @mousedown="start($event)"
                @mousemove="move($event)"
                @mouseup="end()"
                @mouseleave="end()"
                @touchstart.passive="start($event)"
                @touchmove.passive="move($event)"
                @touchend="end()"
            >
                <div
                    class="flex w-full"
                    :style="`transform: translateX(calc(${ -i * 100 }% + ${ dragging ? (deltaX / width * 100) : 0 }%)); transition: ${ dragging ? 'none' : 'transform 300ms ease' };`"
                >
                    <template x-for="src in imgs">
                        <img :src="src" alt="" class="w-full shrink-0 aspect-[16/6] object-cover">
                    </template>
                </div>

                <button
                    type="button"
                    @click="prev()"
                    class="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 text-slate-900 shadow hover:bg-white"
                >
                    <svg class="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.79 4.21a1 1 0 010 1.42L9.42 9l3.37 3.37a1 1 0 11-1.42 1.42l-4.08-4.09a1 1 0 010-1.42l4.08-4.09a1 1 0 011.42 0z" clip-rule="evenodd"/></svg>
                </button>
                <button
                    type="button"
                    @click="next()"
                    class="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 text-slate-900 shadow hover:bg-white"
                >
                    <svg class="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.21 15.79a1 1 0 010-1.42L10.58 11 7.21 7.63a1 1 0 111.42-1.42l4.08 4.09a1 1 0 010 1.42l-4.08 4.09a1 1 0 01-1.42 0z" clip-rule="evenodd"/></svg>
                </button>

                <div class="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
                    <template x-for="(src, idx) in imgs">
                        <button @click="go(idx)" class="h-1.5 w-1.5 rounded-full" :class="i === idx ? 'bg-slate-900' : 'bg-slate-400'"></button>
                    </template>
                </div>
            </div>
        </div>

        <div class="mt-20 grid gap-8 md:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)] items-start">
            <div>
                <h3 class="text-xl sm:text-2xl font-semibold uppercase">Nusa Dua Ocean Breeze</h3>
                <p class="mt-3 text-sm leading-relaxed text-slate-700">
                    A peaceful villa complex nestled in the heart of Nusa Dua, Bali. Our thoughtfully designed one- and two-bedroom villas offer a perfect blend of modern amenities and Bali’s natural surroundings. It offers a comfortable and serene living experience.
                </p>
                <ul class="mt-4 space-y-2 text-sm text-slate-700">
                    <li class="flex items-start gap-2"><span class="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900"></span><span>Topology: Villa Complex with 1–2 Bedrooms</span></li>
                    <li class="flex items-start gap-2"><span class="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900"></span><span>Land Size: 2500m²</span></li>
                    <li class="flex items-start gap-2"><span class="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900"></span><span>Building Size: 83m² & 108m²</span></li>
                    <li class="flex items-start gap-2"><span class="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900"></span><span>Location: Nusa Dua</span></li>
                    <li class="flex items-start gap-2"><span class="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900"></span><span>Status: Design finished & On progress</span></li>
                </ul>
                @php
                    $villa = \App\Models\Properties::where('property_name', 'Nusa Dua Ocean Breeze')->first();
                @endphp
                @if($villa)
                <a href="{{ route('property.show', ['property' => $villa->id]) }}" class="mt-6 inline-flex items-center rounded-full border border-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-900 hover:text-white transition">
                @else
                <a href="{{ route('villa.show', ['slug' => 'nusa-dua-penida']) }}" class="mt-6 inline-flex items-center rounded-full border border-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-900 hover:text-white transition">
                @endif
                    Details
                    <svg class="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10 10.293 6.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                </a>
            </div>

            <div class="rounded-md overflow-hidden">
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1280&auto=format&fit=crop" alt="Nusa Dua Ocean Breeze" class="w-full h-full object-cover">
            </div>
        </div>

        <div class="mt-20 grid gap-8 md:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)] items-start">
            <div class="rounded-md overflow-hidden">
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1280&auto=format&fit=crop" alt="Nusa Dua Ocean Breeze" class="w-full h-full object-cover">
            </div>
            <div>
                <h3 class="text-xl sm:text-2xl font-semibold uppercase">Nusa Dua Ocean Breeze</h3>
                <p class="mt-3 text-sm leading-relaxed text-slate-700">
                    A peaceful villa complex nestled in the heart of Nusa Dua, Bali. Our thoughtfully designed one- and two-bedroom villas offer a perfect blend of modern amenities and Bali’s natural surroundings. It offers a comfortable and serene living experience.
                </p>
                <ul class="mt-4 space-y-2 text-sm text-slate-700">
                    <li class="flex items-start gap-2"><span class="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900"></span><span>Topology: Villa Complex with 1–2 Bedrooms</span></li>
                    <li class="flex items-start gap-2"><span class="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900"></span><span>Land Size: 2500m²</span></li>
                    <li class="flex items-start gap-2"><span class="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900"></span><span>Building Size: 83m² & 108m²</span></li>
                    <li class="flex items-start gap-2"><span class="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900"></span><span>Location: Nusa Dua</span></li>
                    <li class="flex items-start gap-2"><span class="mt-2 h-1.5 w-1.5 rounded-full bg-slate-900"></span><span>Status: Design finished & On progress</span></li>
                </ul>
                @if($villa)
                <a href="{{ route('property.show', ['property' => $villa->id]) }}" class="mt-6 inline-flex items-center rounded-full border border-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-900 hover:text-white transition">
                @else
                <a href="{{ route('villa.show', ['slug' => 'nusa-dua-penida']) }}" class="mt-6 inline-flex items-center rounded-full border border-slate-900 px-4 py-2 text-sm font-semibold hover:bg-slate-900 hover:text-white transition">
                @endif
                    Details
                    <svg class="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10 10.293 6.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                </a>
            </div>
        </div>
    </div>
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10">
        <div class="mt-16 relative overflow-hidden rounded-3xl">
            <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1600&auto=format&fit=crop" alt="Holiday Home Villa" class="w-full h-[260px] sm:h-[340px] lg:h-[400px] object-cover">
            <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
            <div class="absolute inset-0 flex items-center">
                <div class="px-6 sm:px-10 lg:px-12">
                    <h3 class="text-white text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-wide uppercase max-w-2xl">
                        Holiday Home Villa Lokasi Strategis Bonus Private Pool
                    </h3>
                    @if($villa)
                    <a href="{{ route('property.show', ['property' => $villa->id]) }}" class="mt-4 inline-flex items-center rounded-full bg-white/90 text-slate-900 px-4 py-2 text-sm font-semibold hover:bg-white transition">
                    @else
                    <a href="{{ route('villa.show', ['slug' => 'nusa-dua-penida']) }}" class="mt-4 inline-flex items-center rounded-full bg-white/90 text-slate-900 px-4 py-2 text-sm font-semibold hover:bg-white transition">
                    @endif
                        Lihat Selengkapnya
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>
