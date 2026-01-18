<header
    x-data="{ open: false, scrolled: false }"
    x-init="window.addEventListener('scroll', () => { scrolled = window.scrollY > 40 })"
    class="sticky top-0 z-50 transition-colors duration-300"
    :class="(scrolled || open) ? 'bg-white border-b border-slate-200 shadow-sm' : 'bg-slate-700/15 border-b border-transparent'"
>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-20 items-center justify-between">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
                <a href="{{ url('/') }}">
                    <img src="{{ asset('assets/img/logo.png') }}" alt="logo" class="h-10 w-auto sm:h-12 lg:h-14 object-contain max-w-[150px] sm:max-w-[200px]">
                </a>
            </div>

            <!-- Desktop Menu -->
            <nav
                class="hidden min-[900px]:flex items-center gap-2 xl:gap-3 text-[0.7rem] xl:text-sm font-medium uppercase tracking-wide"
                :class="(scrolled || open) ? 'text-slate-900' : 'text-white'"
            >
                <a href="#top" class="hover:text-emerald-600 transition-colors">HOME</a>
                <span class="text-slate-300">|</span>
                <a href="#properti" class="hover:text-emerald-600 transition-colors">INVESTMENT</a>
                <span class="text-slate-300">|</span>
                <a href="#properti" class="hover:text-emerald-600 transition-colors">CROWDFUNDING</a>
                <span class="text-slate-300">|</span>
                <a href="#properti" class="hover:text-emerald-600 transition-colors">PROPERTY FOR SALE</a>
                <span class="text-slate-300">|</span>
                <a href="#properti" class="hover:text-emerald-600 transition-colors">LELANG/CESSIE</a>
                <span class="text-slate-300">|</span>
                <a href="#fitur" class="hover:text-emerald-600 transition-colors">HOW TO INVEST</a>
                <span class="text-slate-300">|</span>
                <a href="#properti" class="hover:text-emerald-600 transition-colors">DEVELOPER</a>
                <span class="text-slate-300">|</span>
                
                @auth
                    <a href="{{ url('/dashboard') }}" class="hover:text-emerald-600 transition-colors font-bold text-emerald-700">MY ACCOUNT</a>
                @else
                    @if (Route::has('login'))
                        <a href="{{ route('login') }}" class="hover:text-emerald-600 transition-colors font-bold">MY ACCOUNT</a>
                    @else
                        <a href="#account" class="hover:text-emerald-600 transition-colors font-bold">MY ACCOUNT</a>
                    @endif
                @endauth
            </nav>

            <!-- Mobile Menu Button -->
            <div class="flex min-[900px]:hidden">
                <button @click="open = ! open" type="button" class="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500" aria-controls="mobile-menu" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <!-- Icon: Menu -->
                    <svg x-show="!open" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    <!-- Icon: X -->
                    <svg x-show="open" style="display: none;" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile Menu -->
    <div x-show="open" style="display: none;" class="min-[900px]:hidden bg-white border-t border-slate-200" id="mobile-menu">
        <div class="space-y-1 px-4 py-6">
            <a href="#top" class="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">HOME</a>
            <a href="#properti" class="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">INVESTMENT</a>
            <a href="#properti" class="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">CROWDFUNDING</a>
            <a href="#properti" class="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">PROPERTY FOR SALE</a>
            <a href="#properti" class="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">LELANG/CESSIE</a>
            <a href="#fitur" class="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">HOW TO INVEST</a>
            <a href="#properti" class="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">DEVELOPER</a>
            
            <div class="mt-4 border-t border-slate-100 pt-4">
                @auth
                    <a href="{{ url('/dashboard') }}" class="block rounded-md py-2 px-3 text-base font-bold text-emerald-700 hover:bg-emerald-50">MY ACCOUNT</a>
                @else
                    @if (Route::has('login'))
                        <a href="{{ route('login') }}" class="block rounded-md py-2 px-3 text-base font-bold text-slate-900 hover:bg-slate-50 hover:text-emerald-600">MY ACCOUNT</a>
                    @else
                        <a href="#account" class="block rounded-md py-2 px-3 text-base font-bold text-slate-900 hover:bg-slate-50 hover:text-emerald-600">MY ACCOUNT</a>
                    @endif
                @endauth
            </div>
        </div>
    </div>
</header>
