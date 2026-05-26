@extends('user.layout')
@section('content')
    <section id="our-villa" class="bg-white relative text-slate-900">
        <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
            <h2 class="text-center text-2xl sm:text-3xl font-semibold tracking-wide uppercase">Asset Overview</h2>

            <div class="mt-20 grid gap-8 md:grid-cols-[1.2fr,2fr] items-stretch">

                <div
                    class="rounded-2xl overflow-hidden shadow-sm bg-emerald-50 border border-emerald-100 p-8 flex flex-col justify-between">
                    <div>
                        <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">
                            My Balance
                        </h5>
                        <h2 class="text-4xl font-extrabold text-slate-900 leading-none">
                            <span class="text-lg font-bold text-emerald-600">IDR</span> {{ number_format($wallet->balance) }}
                        </h2>
                    </div>

                    <div class="mt-10">
                        <a href="#withdraw"
                            class="inline-block w-full md:w-auto bg-emerald-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg transition-all shadow-emerald-200 text-center text-sm">
                            Withdraw Funds
                        </a>
                    </div>
                </div>

                <div
                    class="rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-100 p-8 flex flex-col md:flex-row items-center justify-between gap-8">

                    <div class="grid grid-cols-2 gap-x-12 gap-y-8 flex-grow w-full">
                        <div>
                            <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                                Current Account Value
                            </h5>
                            <h2 class="text-xl font-bold text-slate-900">
                                IDR 30,000
                            </h2>
                        </div>

                        <div>
                            <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                                Total Rent Earned
                            </h5>
                            <h2 class="text-xl font-bold text-emerald-600">
                                IDR 30,000
                            </h2>
                        </div>

                        <div>
                            <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                                Total Property Value
                            </h5>
                            <h2 class="text-xl font-bold text-slate-900">
                                IDR 100,000
                            </h2>
                        </div>

                        <div>
                            <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                                Properties Owned
                            </h5>
                            <h2 class="text-xl font-bold text-slate-900">
                                {{ count($investments) }} <span class="text-xs font-normal text-slate-400">Unit</span>
                            </h2>
                        </div>
                    </div>

                    <div class="flex flex-col gap-3 w-full md:w-auto">
                        <a href="#share"
                            class="bg-white text-emerald-700 border border-emerald-200 px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-50 transition-all text-center text-sm whitespace-nowrap">
                            Share Portfolio
                        </a>
                        <a href="#history"
                            class="text-slate-400 text-xs font-semibold hover:text-emerald-600 transition-colors text-center">
                            View History
                        </a>
                    </div>
                </div>

            </div>

            <div class="mt-10 grid gap-8 grid-cols-1 items-start">
                <div class="max-w-xl">
                    <h2 class="text-3xl text-slate-900 font-bold">
                        Property List
                    </h2>
                    <p class="text-slate-500 text-sm">You have {{ count($investments) }} active investments</p>
                </div>

                @foreach ($investments as $prop)
                    <div class="w-full">
                        <div
                            class="mb-6 rounded-2xl overflow-hidden shadow-sm bg-emerald-50 border border-emerald-100 p-6 flex flex-col lg:flex-row items-center gap-8 hover:border-emerald-300 transition-all">

                            <div class="flex items-center gap-6 min-w-[300px] w-full lg:w-1/3">
                                <div
                                    class="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-200 shadow-inner">
                                    @foreach ($prop->ip->property->images as $img)
                                        {{-- Asumsi di tabel property_images ada kolom 'file_path' atau 'url' --}}
                                        <img src="{{ asset('storage/' . $img->image_url) ?? 'https://placehold.co/600x400?text=' . urlencode($prop->ip->property->property_name) }}"
                                            alt="{{ $prop->ip->property->property_name }}"
                                            class="w-full h-full object-cover">
                                    @endforeach
                                </div>

                                <div>
                                    <div class="flex items-center gap-1 text-xs font-semibold text-emerald-600 mb-1">
                                        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {{ $prop->ip->property->property_location }}
                                    </div>
                                    <h3 class="text-lg font-bold text-slate-900 leading-tight">
                                        {{ $prop->ip->property->property_name }}
                                    </h3>
                                </div>
                            </div>

                            <div
                                class="grid grid-cols-2 md:grid-cols-3 gap-6 flex-grow w-full border-t lg:border-t-0 lg:border-l border-emerald-100 pt-6 lg:pt-0 lg:pl-8">
                                <div>
                                    <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Ownership
                                    </h5>
                                    <h2 class="text-sm font-bold text-slate-900">{{ $prop->total_lot }} Lots</h2>
                                    <p class="text-[11px] text-slate-500">{{ $prop->total_lot / $prop->ip->total_lot }}%
                                        Share
                                    </p>

                                    <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-4 mb-1">
                                        Current Value</h5>
                                    <h2 class="text-sm font-bold text-emerald-700">IDR
                                        {{ number_format($prop->total_invested) }}</h2>
                                </div>

                                <div>
                                    <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Status
                                    </h5>
                                    <h2 class="text-sm font-bold {{ $prop->sold ? 'text-amber-600' : 'text-emerald-600' }}">
                                        {{ $prop->sold ? 'Locked' : 'Active' }}
                                    </h2>

                                    <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-4 mb-1">Last
                                        Rent</h5>
                                    <h2 class="text-sm font-bold text-slate-900">IDR 215 <span
                                            class="text-emerald-500 text-[10px]">(8.01%)</span></h2>
                                </div>

                                <div class="hidden md:block">
                                    <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Available
                                        to Sell</h5>
                                    <h2 class="text-sm font-bold text-slate-900">{{ $prop->total_lot }} Lots</h2>

                                    <h5
                                        class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-4 mb-1 text-nowrap">
                                        Total Earned</h5>
                                    <h2 class="text-sm font-bold text-emerald-700">IDR 2,415 <span
                                            class="text-[10px] font-normal text-slate-400">Total</span></h2>
                                </div>
                            </div>

                            <div class="flex flex-col gap-2 w-full lg:w-auto min-w-[140px]">
                                <a href="{{ route('investments.show', $prop->id) }}"
                                    class="bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all text-center shadow-sm shadow-emerald-200">
                                    Swap Lots
                                </a>
                                <a href="{{ route('investments.sell',$prop->ip->property_id) }}" class="bg-white text-emerald-800 border border-emerald-200 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-50 transition-all text-center">Sell Asset</a>
                            </div>
                        </div>
                    </div>
                @endforeach

                {{-- Tampilan jika data kosong --}}
                @if (count($investments) == 0 || count($crowdfundings) == 0)
                    <div class="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <p class="text-slate-500">No properties found in your portfolio.</p>
                        <a href="{{ route('investments.index') }}" class="text-emerald-600 font-bold mt-2 inline-block">Start Investing →</a>
                    </div>
                @endif
            </div>
            <div class="mt-20 grid gap-8 grid-cols-1 items-start">
                <div class="max-w-xl">
                    <h2 class="text-3xl text-slate-900 font-bold">
                        Crowdfunding Projects
                    </h2>
                    <p class="text-slate-500 text-sm">You funded {{ count($crowdfundings) }} projects</p>
                </div>

                @foreach ($crowdfundings as $cf)
                    <div
                        class="rounded-2xl overflow-hidden shadow-sm bg-indigo-50 border border-indigo-100 p-6 flex flex-col lg:flex-row items-center gap-8 hover:border-indigo-300 transition-all">

                        {{-- Info kiri --}}
                        <div class="flex items-center gap-6 min-w-[300px] w-full lg:w-1/3">
                           <div
                                    class="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-200 shadow-inner">
                                    @foreach ($cf->cp->property->images as $img)
                                        {{-- Asumsi di tabel property_images ada kolom 'file_path' atau 'url' --}}
                                        <img src="{{ asset('storage/' . $img->image_url) ?? 'https://placehold.co/600x400?text=' . urlencode($prop->ip->property->property_name) }}"
                                            alt="{{ $cf->cp->property->property_name }}"
                                            class="w-full h-full object-cover">
                                    @endforeach
                                </div>

                            <div>
                                <div class="flex items-center gap-1 text-xs font-semibold text-indigo-600 mb-1">
                                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {{ $cf->category }}{{ $cf->cp->property->property_location }}
                                </div>
                                <h3 class="text-lg font-bold text-slate-900 leading-tight">
                                    {{ $cf->cp->property->property_name }}
                                </h3>
                            </div>
                        </div>

                        {{-- Metrics --}}
                        <div
                            class="grid grid-cols-2 md:grid-cols-3 gap-6 flex-grow w-full border-t lg:border-t-0 lg:border-l border-indigo-100 pt-6 lg:pt-0 lg:pl-8">
                            <div>
                                <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                                    Your Contribution
                                </h5>
                                <h2 class="text-sm font-bold text-slate-900">
                                    IDR {{ number_format($cf->total_amount) }}
                                </h2>

                                <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-4 mb-1">
                                    Est. Return
                                </h5>
                                <h2 class="text-sm font-bold text-emerald-600">
                                    {{ $cf->cp->estimated_roi }}%
                                </h2>
                            </div>

                            <div>
                                <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                                    Funding Progress
                                </h5>
                                <h2 class="text-sm font-bold text-indigo-600">
                                    {{ ($cf->cp->collected_amount/$cf->cp->funding_goal)*100 }}%
                                </h2>

                                <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-4 mb-1">
                                    Status
                                </h5>
                                <h2
                                    class="text-sm font-bold {{ $cf->status == 'Completed' ? 'text-emerald-600' : 'text-amber-600' }}">
                                    {{ $cf->cp->status }}
                                </h2>
                            </div>

                            <div class="hidden md:block">
                                <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                                    Project Type
                                </h5>
                                <h2 class="text-sm font-bold text-slate-900">
                                    Crowdfunding
                                </h2>

                                <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-4 mb-1">
                                    Exit Strategy
                                </h5>
                                <h2 class="text-sm font-bold text-slate-900">
                                    Flipping
                                </h2>
                            </div>
                        </div>

                        {{-- Actions --}}
                        <div class="flex flex-col gap-2 w-full lg:w-auto min-w-[140px]">
                            <a href="{{ route('crowdfunding.show',$cf->cp->id) }}"
                                class="bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-600 transition-all text-center shadow-sm shadow-indigo-200">
                                View Project
                            </a>
                            <a href="{{ route('crowdfunding.purchase',$cf->cp->id) }}"
                                class="bg-white text-indigo-700 border border-indigo-200 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-50 transition-all text-center">
                                Add More Fund
                        </a>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>

    </section>
@endsection
