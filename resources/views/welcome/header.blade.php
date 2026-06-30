<header x-data="{ open: false, scrolled: {{ request()->is('/') ? 'false' : 'true' }} }" x-init="window.addEventListener('scroll', () => { scrolled = {{ request()->is('/') ? 'window.scrollY > 40' : 'true' }} })" class="sticky top-0 z-50 transition-colors duration-300"
    :class="(scrolled || open) ? 'bg-white border-b border-slate-200 shadow-sm' : 'bg-slate-700/20 border-b border-transparent'">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-20 items-center justify-between">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
                <a href="{{ url('/') }}">
                    <img src="{{ asset('storage/' . $setting->logo) }}" alt="logo"
                        class="h-10 w-auto sm:h-12 lg:h-14 object-contain max-w-[150px] sm:max-w-[200px]">
                </a>
            </div>

            <!-- Desktop Menu -->
            <nav class="hidden min-[900px]:flex items-center gap-2 xl:gap-3 text-[0.7rem] xl:text-sm font-medium uppercase tracking-wide"
                :class="(scrolled || open) ? 'text-slate-900' : 'text-white'">
                <a href="{{ url('/') }}" class="hover:text-emerald-600 transition-colors">HOME</a>
                <span class="text-slate-300">|</span>
                <a href="{{ route('investments.index') }}"
                    class="hover:text-emerald-600 transition-colors">INVESTMENT</a>
                <span class="text-slate-300">|</span>
                <a href="{{ route('crowdfunding.index') }}"
                    class="hover:text-emerald-600 transition-colors">CROWDFUNDING</a>
                <span class="text-slate-300">|</span>
                <a href="#properti" class="hover:text-emerald-600 transition-colors">PROPERTY FOR SALE</a>
                <span class="text-slate-300">|</span>
                <a href="#fitur" class="hover:text-emerald-600 transition-colors">HOW TO INVEST</a>
                <span class="text-slate-300">|</span>
                <a href="#properti" class="hover:text-emerald-600 transition-colors">DEVELOPER</a>
                <span class="text-slate-300">|</span>

                @auth
                    <div class="relative" x-data="{ accountOpen: false }" @click.away="accountOpen = false">
                        <button @click="accountOpen = !accountOpen" type="button"
                            class="flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-600 transition-colors focus:outline-none">
                            MY ACCOUNT
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div x-show="accountOpen" x-transition style="display: none;"
                            class="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                            <a href="{{ route('user.dashboard') }}"
                                class="block px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600">
                                Dashboard
                            </a>

                            <a href="{{ route('user.portfolio') }}"
                                class="block px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600">
                                My Portfolio
                            </a>
                            <a href="{{ route('user.bid') }}"
                                class="block px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600">
                                My Bids
                            </a>
                            <a href="{{ route('user.transaction') }}"
                                class="block px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600">
                                Transactions
                            </a>
                            <a href="{{ route('user.portfolio') }}"
                                class="block px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600">
                                Account Setting
                            </a>

                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit"
                                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                @endauth

            </nav>

            <!-- Mobile Menu Button -->
            <div class="flex min-[900px]:hidden">
                <button @click="open = ! open" type="button"
                    class="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                    aria-controls="mobile-menu" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <!-- Icon: Menu -->
                    <svg x-show="!open" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    <!-- Icon: X -->
                    <svg x-show="open" style="display: none;" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile Menu -->
    <div x-show="open" style="display: none;" class="min-[900px]:hidden bg-white border-t border-slate-200"
        id="mobile-menu">
        <div class="space-y-1 px-4 py-6">
            <a href="{{ url('/') }}"
                class="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">HOME</a>
            <a href="{{ route('investments.index') }}"
                class="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">INVESTMENT</a>
            <a href="{{ route('crowdfunding.index') }}"
                class="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">CROWDFUNDING</a>
            <a href="#properti"
                class="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">PROPERTY
                FOR SALE</a>
            <a href="#fitur"
                class="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">HOW
                TO INVEST</a>
            <a href="#properti"
                class="block rounded-md py-2 px-3 text-base font-medium text-slate-900 hover:bg-slate-50 hover:text-emerald-600">DEVELOPER</a>

            <div class="mt-4 border-t border-slate-100 pt-4">
                @auth
                    <div x-data="{ mobileAccount: false }">
                        <button @click="mobileAccount = !mobileAccount"
                            class="w-full text-left rounded-md py-2 px-3 text-base font-bold text-emerald-700 hover:bg-emerald-50">
                            MY ACCOUNT
                        </button>

                        <div x-show="mobileAccount" class="ml-4 mt-2 space-y-1">
                            <a href="{{ route('user.dashboard') }}"
                                class="block py-2 px-3 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600">
                                Dashboard
                            </a>

                            <a href="{{ route('user.portfolio') }}"
                                class="block py-2 px-3 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600">
                                My Portfolio
                            </a>
                            <a href="{{ route('user.bid') }}"
                                class="block py-2 px-3 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600">
                                My Bids
                            </a>
                            <a href="{{ route('user.transaction') }}"
                                class="block py-2 px-3 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600">
                                Transactions
                            </a>
                            <a href="{{ route('user.portfolio') }}"
                                class="block py-2 px-3 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600">
                                Account Setting
                            </a>

                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit" class="block py-2 px-3 text-sm text-red-600">
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                @endauth
            </div>
        </div>
    </div>
</header>
