@extends('user.layout')
@section('content')
    <section class="bg-white relative text-slate-900">
        <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
            <h2 class="text-center text-2xl sm:text-3xl font-semibold tracking-wide uppercase">
                Dashboard
            </h2>

            {{-- Portfolio Summary --}}
            <div class="mt-16 grid gap-6 md:grid-cols-4">
                <div class="rounded-2xl bg-emerald-50 border border-emerald-100 p-6 shadow-sm">
                    <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                        Total Asset Value
                    </h5>
                    <h2 class="text-xl font-extrabold text-slate-900">IDR {{ number_format($totalAssetValue) }}</h2>
                </div>

                <div class="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
                    <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                        Total Invested
                    </h5>
                    <h2 class="text-xl font-extrabold text-slate-900">IDR {{ number_format($totalInvested) }}</h2>
                </div>

                <div class="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
                    <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                        Total Return
                    </h5>
                    <h2 class="text-xl font-extrabold text-emerald-600">IDR {{ number_format($totalReturn) }}</h2>
                </div>

                <div class="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
                    <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                        Available Balance
                    </h5>
                    <h2 class="text-xl font-extrabold text-slate-900">IDR {{ number_format($availableBalance) }}</h2>
                </div>
            </div>

            {{-- Chart Placeholder --}}
            {{-- <div class="mt-10 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold">Portfolio Performance</h3>
                <span class="text-xs text-slate-400">Last 6 months</span>
            </div>
            <div class="h-48 flex items-center justify-center text-slate-400 text-sm">
                Chart Placeholder (pakai Chart.js nanti, jangan males)
            </div>
        </div> --}}

            {{-- Active Investments Snapshot --}}
            <div class="mt-12">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold">Active Investments</h3>
                    <a href="{{ route('user.portfolio') }}" class="text-sm font-semibold text-emerald-600 hover:underline">
                        View All
                    </a>
                </div>

                <div class="grid gap-6 md:grid-cols-2">
                    @forelse ($activeInvestments as $inv)
                        <div class="rounded-2xl bg-emerald-50 border border-emerald-100 p-6 shadow-sm">
                            <h4 class="font-bold text-slate-900">{{ $inv->property_name }}</h4>
                            <p class="text-xs text-slate-500 mt-1">
                                Ownership: {{ $inv->total_lot }} Lots
                                • {{ number_format(($inv->total_lot / $inv->grand_total_lot) * 100, 4) }}%
                            </p>

                            <div class="mt-4 flex justify-between text-sm">
                                <span class="text-slate-500">Total Invested</span>
                                <span class="font-bold text-emerald-700">IDR {{ number_format($inv->amount) }}</span>
                            </div>
                        </div>
                    @empty
                        <div class="col-span-2 text-center py-6 bg-slate-50 rounded-xl border border-dashed">
                            <p class="text-slate-500 text-sm">Belum ada aset di portfolio lu, bre.</p>
                        </div>
                    @endforelse
                </div>
            </div>

            {{-- My Bids Snapshot --}}
            <div class="mt-12">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold">My Active Bids</h3>
                    <a href="{{ route('user.bid') }}" class="text-sm font-semibold text-emerald-600 hover:underline">
                        View All
                    </a>
                </div>

                <div class="grid gap-6 md:grid-cols-2">
                    @for ($i = 0; $i < 2; $i++)
                        <div class="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
                            <h4 class="font-bold text-slate-900">Auction: Apartment BSD Tower A</h4>
                            <p class="text-xs text-slate-500 mt-1">Your Bid: IDR 250,000</p>

                            <div class="mt-4 flex justify-between text-sm">
                                <span class="text-slate-500">Status</span>
                                <span class="font-bold text-amber-600">Outbid</span>
                            </div>
                        </div>
                    @endfor
                </div>
            </div>

            {{-- Recent Transactions --}}
            <div class="mt-12">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold">Recent Transactions</h3>
                    <a href="{{ route('user.transaction') }}" class="text-sm font-semibold text-emerald-600 hover:underline">
                        View All
                    </a>
                </div>

                <div class="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                    <div class="divide-y">
                        @foreach ($recentTransactions as $trx)
                            <div class="p-4 flex justify-between text-sm">
                                <span>{{ $trx->label }} ({{ $trx->type }})</span>
                                <span class="font-bold {{ $trx->type == 'SELL' ? 'text-emerald-600' : 'text-slate-900' }}">
                                    {{ $trx->type == 'SELL' ? '+' : '-' }} IDR {{ number_format($trx->amount) }}
                                </span>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>

            {{-- Quick Actions --}}
            <div class="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                <a href="{{ route('investments.index') }}"
                    class="text-center bg-emerald-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition">
                    Explore Properties
                </a>

                <a href="/crowdfunding"
                    class="text-center bg-white border border-emerald-200 text-emerald-700 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 transition">
                    Join Crowdfunding
                </a>

                <a href="/my-bids"
                    class="text-center bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition">
                    View My Bids
                </a>

                <a href="#deposit"
                    class="text-center bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition">
                    Deposit Funds
                </a>
            </div>
        </div>
    </section>
@endsection
