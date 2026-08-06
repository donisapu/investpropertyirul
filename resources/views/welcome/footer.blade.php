<footer class="bg-white text-slate-900">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
            <div class="flex gap-2 items-center justify-center">
                <span
                    class="inline-block rounded-lg bg-amber-200 px-2 py-1 text-amber-900 text-2xl sm:text-3xl font-semibold tracking-wide">Partner</span>
                <h2 class="text-2xl sm:text-3xl font-semibold">Kami</h2>
            </div>
            <p class="mt-3 text-sm leading-relaxed text-slate-700">
                Kami memiliki beberapa partner yang membantu kami dalam membangun rumah untuk klien-klien kami.
            </p>
        </div>

        <div class="mt-10 flex flex-wrap items-center justify-center gap-12">
            @foreach ($partner as $partner)
                <div class="flex-shrink-0">
                    <img src="{{ asset('storage/' . $partner->image_url) }}" alt="{{ $partner->name }}"
                        class="h-16 object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition duration-300" />
                </div>
            @endforeach
        </div>

        <div class="mt-10 grid gap-8 md:grid-cols-3">
            <div>
                <h3 class="text-base font-semibold">Tentang Kami</h3>
                <p class="mt-2 text-sm text-slate-700">
                    {{ $setting->description }}
                </p>
                <div class="mt-2 text-sm text-slate-700">
                    <span class="mr-2">📍</span> {{ $setting->address }}
                </div>
            </div>
            <div>
                <h3 class="text-base font-semibold">Beranda</h3>
                <ul class="mt-2 space-y-1 text-sm">
                    <li><a href="#properti" class="hover:text-emerald-600">Investment</a></li>
                    <li><a href="#properti" class="hover:text-emerald-600">Crowdfunding</a></li>
                    <li><a href="#properti" class="hover:text-emerald-600">Lelang/Cessie</a></li>
                    <li><a href="#properti" class="hover:text-emerald-600">Property for Sale</a></li>
                    <li><a href="#fitur" class="hover:text-emerald-600">How to Invest</a></li>
                    <li><a href="#properti" class="hover:text-emerald-600">Development</a></li>
                    <li><a href="#properti" class="hover:text-emerald-600">ROI Simulator</a></li>
                </ul>
            </div>
            <div>
                <h3 class="text-base font-semibold">Hubungi Kami</h3>
                <ul class="mt-2 space-y-1 text-sm">
                    <li class="flex items-center gap-2"><span class="text-slate-500">📞</span><a href="tel:+62818580891"
                            class="hover:text-emerald-600">+62818580891</a></li>
                    <li class="flex items-center gap-2"><span class="text-slate-500">✉️</span><a
                            href="mailto:umahbalimesari@gmail.com"
                            class="hover:text-emerald-600">umahbalimesari@gmail.com</a></li>
                </ul>
                <div class="mt-4 flex items-center gap-3">
                    <a href="#"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-emerald-600"
                        aria-label="Facebook">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.3 3h-1.9v7A10 10 0 0022 12z" />
                        </svg>
                    </a>
                    <a href="#"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-emerald-600"
                        aria-label="Instagram">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm6-1a1 1 0 100 2 1 1 0 000-2z" />
                        </svg>
                    </a>
                    <a href="#"
                        class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-emerald-600"
                        aria-label="YouTube">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M23.5 6.2a3 3 0 00-2.1-2.1C19.8 3.6 12 3.6 12 3.6s-7.8 0-9.4.5A3 3 0 00.6 6.2 31.6 31.6 0 000 12a31.6 31.6 0 00.6 5.8 3 3 0 002.1 2.1c1.6.5 9.4.5 9.4.5s7.8 0 9.4-.5a3 3 0 002.1-2.1c.4-1.9.6-3.8.6-5.8s-.2-3.9-.6-5.8zM9.7 15.5V8.5l6.2 3.5-6.2 3.5z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="border-t border-slate-200 bg-slate-50">
        <div
            class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-600">
            <p class="text-[0.8rem]">
                © {{ date('Y') }} {{ $setting->site_name }}. All rights reserved.
            </p>
            <p class="text-[0.8rem]">
                Laravel v{{ Illuminate\Foundation\Application::VERSION }} · PHP v{{ PHP_VERSION }}
            </p>
        </div>
    </div>
</footer>
