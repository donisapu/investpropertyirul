@extends('user.layout')

@section('content')
    <section id="my-bids" class="bg-white relative text-slate-900">
        <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
            <h2 class="text-center text-2xl sm:text-3xl font-semibold tracking-wide uppercase">Bidding Overview</h2>

            {{-- Bagian Atas: Statistik (Sama persis stylenya sama Asset Overview lu) --}}
            <div class="mt-20 grid gap-8 md:grid-cols-[1.2fr,2fr] items-stretch">

                {{-- Card Kiri: Total Exposure / Saldo Terkunci --}}
                <div
                    class="rounded-2xl overflow-hidden shadow-sm bg-emerald-50 border border-emerald-100 p-8 flex flex-col justify-between">
                    <div>
                        <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">
                            Active Bid Exposure
                        </h5>
                        <h2 class="text-4xl font-extrabold text-slate-900 leading-none">
                            <span class="text-lg font-bold text-emerald-600">IDR</span>
                            {{ number_format($bids->sum('user_bid') / 1000000, 1) }}M
                        </h2>
                    </div>

                    <div class="mt-10">
                        <a href="/properties"
                            class="inline-block w-full md:w-auto bg-emerald-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg transition-all shadow-emerald-200 text-center text-sm">
                            Find More Auctions
                        </a>
                    </div>
                </div>

                {{-- Card Kanan: Ringkasan Status --}}
                <div
                    class="rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-100 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div class="grid grid-cols-2 gap-x-12 gap-y-8 flex-grow w-full">
                        <div>
                            <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Total Active Bids
                            </h5>
                            <h2 class="text-xl font-bold text-slate-900">{{ $stats['total_active'] }} <span
                                    class="text-xs font-normal text-slate-400">Items</span></h2>
                        </div>

                        <div>
                            <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Winning Now</h5>
                            <h2 class="text-xl font-bold text-emerald-600">{{ $stats['winning'] }} <span
                                    class="text-xs font-normal text-slate-400">Items</span></h2>
                        </div>

                        <div>
                            <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1 text-rose-500">
                                Outbid (Action Needed)</h5>
                            <h2 class="text-xl font-bold text-rose-600">{{ $stats['outbid'] }} <span
                                    class="text-xs font-normal text-slate-400">Items</span></h2>
                        </div>

                        <div>
                            <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Avg. Bid Value
                            </h5>
                            <h2 class="text-xl font-bold text-slate-900">
                                IDR {{ number_format(($bids->avg('user_bid') ?? 0) / 1000000, 1) }}M
                            </h2>
                        </div>
                    </div>

                    <div class="flex flex-col gap-3 w-full md:w-auto text-center">
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter leading-tight">Live
                            Updates<br>Enabled</p>
                        <div class="h-2 w-2 bg-emerald-500 rounded-full animate-pulse mx-auto"></div>
                    </div>
                </div>
            </div>

            {{-- List Bids (Stylenya sama dengan Property List lu) --}}
            <div class="mt-16 grid gap-8 grid-cols-1 items-start">
                <div class="max-w-xl">
                    <h2 class="text-3xl text-slate-900 font-bold">Active Bid List</h2>
                    <p class="text-slate-500 text-sm">You are currently participating in {{ $stats['total_active'] }}
                        auctions</p>
                </div>

                @forelse ($bids as $bid)
                    <div class="w-full">
                        <div
                            class="mb-6 rounded-2xl overflow-hidden shadow-sm p-6 flex flex-col lg:flex-row items-center gap-8 transition-all border
                            {{ $bid->is_outbid ? 'bg-rose-50 border-rose-100 hover:border-rose-300' : 'bg-emerald-50 border-emerald-100 hover:border-emerald-300' }}">

                            {{-- Gambar --}}
                            <div class="flex items-center gap-6 min-w-[300px] w-full lg:w-1/3">
                                <div
                                    class="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-200 shadow-inner border border-white/50">
                                    <img src="{{ $bid->image }}" alt="{{ $bid->name }}"
                                        class="w-full h-full object-cover">
                                    <div
                                        class="absolute inset-x-0 bottom-0 bg-slate-900/60 py-1 text-center text-[9px] text-white font-bold uppercase tracking-tighter">
                                        Ends: {{ $bid->ends_at }}
                                    </div>
                                </div>

                                <div>
                                    <div
                                        class="flex items-center gap-1 text-xs font-semibold {{ $bid->is_outbid ? 'text-rose-600' : 'text-emerald-600' }} mb-1">
                                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        {{ $bid->loc }}
                                    </div>
                                    <h3 class="text-lg font-bold text-slate-900 leading-tight">{{ $bid->name }}</h3>
                                </div>
                            </div>

                            {{-- Data Bid --}}
                            <div
                                class="grid grid-cols-2 md:grid-cols-3 gap-6 flex-grow w-full border-t lg:border-t-0 lg:border-l border-emerald-100 pt-6 lg:pt-0 lg:pl-8">
                                <div>
                                    <h5
                                        class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1 text-nowrap">
                                        Current Highest</h5>
                                    <h2 class="text-sm font-bold text-slate-900">IDR
                                        {{ number_format($bid->current_price / 1000000, 1) }}M</h2>

                                    <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-4 mb-1">
                                        Increment</h5>
                                    <h2 class="text-sm font-bold text-slate-500">IDR 10M</h2>
                                </div>

                                <div>
                                    <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Your Last
                                        Bid</h5>
                                    <h2
                                        class="text-sm font-bold {{ $bid->is_outbid ? 'text-rose-600' : 'text-emerald-700' }}">
                                        IDR {{ number_format($bid->user_bid / 1000000, 1) }}M
                                    </h2>

                                    <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-4 mb-1">
                                        Position</h5>
                                    <h2
                                        class="text-sm font-bold {{ $bid->is_outbid ? 'text-rose-600 font-black' : 'text-emerald-600' }}">
                                        {{ $bid->is_outbid ? 'Outbid' : 'Highest Bidder' }}
                                    </h2>
                                </div>

                                <div class="hidden md:block">
                                    <h5
                                        class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1 text-nowrap">
                                        Property Type</h5>
                                    <h2 class="text-sm font-bold text-slate-900 text-nowrap">Auction Property</h2>

                                    <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-4 mb-1">Time
                                        Left</h5>
                                    <h2 class="text-sm font-bold text-slate-900">{{ $bid->ends_at }}</h2>
                                </div>
                            </div>

                            {{-- Tombol Aksi --}}
                            <div class="flex flex-col gap-2 w-full lg:w-auto min-w-[140px]">
                                <a href="/auction/{{ $bid->id }}"
                                    class="px-4 py-2.5 rounded-xl font-bold text-xs text-center shadow-sm transition-all
                                    {{ $bid->is_outbid ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-emerald-800 text-white hover:bg-emerald-700' }}">
                                    {{ $bid->is_outbid ? 'Place New Bid' : 'Increase Bid' }}
                                </a>
                                <button
                                    class="bg-white text-slate-500 border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all text-center">
                                    View Detail
                                </button>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <p class="text-slate-500">You haven't placed any bids yet.</p>
                        <a href="/lelang" class="text-emerald-600 font-bold mt-2 inline-block">Explore Auctions →</a>
                    </div>
                @endforelse
            </div>
        </div>
    </section>
@endsection
