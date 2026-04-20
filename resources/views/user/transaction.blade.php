@extends('user.layout')

@section('content')
    <section id="transactions" class="bg-white relative text-slate-900">
        <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
            <h2 class="text-center text-2xl sm:text-3xl font-semibold tracking-wide uppercase">
                Transaction History
            </h2>

            {{-- Summary Cashflow --}}
            <div class="mt-20 grid gap-8 md:grid-cols-[1.2fr,2fr] items-stretch">
                {{-- Net Cashflow --}}
                <div
                    class="rounded-2xl overflow-hidden shadow-sm bg-emerald-50 border border-emerald-100 p-8 flex flex-col justify-between">
                    <div>
                        <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">
                            Net Cashflow
                        </h5>
                        <h2 class="text-4xl font-extrabold text-slate-900 leading-none">
                            <span class="text-lg font-bold text-emerald-600">IDR</span> {{ number_format($netCashflow) }}
                        </h2>
                    </div>

                    <div class="mt-10">
                        <a href="#export"
                            class="inline-block w-full md:w-auto bg-emerald-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg transition-all shadow-emerald-200 text-center text-sm">
                            Export Statement
                        </a>
                    </div>
                </div>

                {{-- In / Out Summary --}}
                <div
                    class="rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-100 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div class="grid grid-cols-2 gap-x-12 gap-y-8 flex-grow w-full">
                        <div>
                            <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                                Total In
                            </h5>
                            <h2 class="text-xl font-bold text-emerald-600">IDR {{ number_format($totalIn) }}</h2>
                        </div>

                        <div>
                            <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                                Total Out
                            </h5>
                            <h2 class="text-xl font-bold text-rose-600">IDR {{ number_format($totalOut) }}</h2>
                        </div>

                        <div>
                            <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                                Total Transactions
                            </h5>
                            <h2 class="text-xl font-bold text-slate-900">
                                24 <span class="text-xs font-normal text-slate-400">Records</span>
                            </h2>
                        </div>

                        <div>
                            <h5 class="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                                Last Activity
                            </h5>
                            <h2 class="text-xl font-bold text-slate-900">
                                2 hours ago
                            </h2>
                        </div>
                    </div>

                    <div class="flex flex-col gap-3 w-full md:w-auto text-center">
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter leading-tight">
                            Synced<br>Realtime
                        </p>
                        <div class="h-2 w-2 bg-emerald-500 rounded-full animate-pulse mx-auto"></div>
                    </div>
                </div>
            </div>

            {{-- Filter Tabs --}}
            {{-- <div class="mt-16 flex flex-wrap gap-3 justify-center">
                <button class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-800 text-white">
                    All
                </button>
                <button
                    class="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                    Deposit
                </button>
                <button
                    class="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                    Investment
                </button>
                <button
                    class="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                    Bidding
                </button>
                <button
                    class="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                    Rent Income
                </button>
                <button
                    class="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                    Withdraw
                </button>
            </div> --}}

            {{-- Transaction List --}}
            <div class="mt-12 grid gap-6">
                @foreach ($transactions as $item)
                    @php
                        $isIn = $item->trans_type == 'SELL'; // Tentukan warna berdasarkan tipe
                        $bgClass = $isIn ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100';
                        $textClass = $isIn ? 'text-emerald-700' : 'text-rose-700';
                        $label = $isIn ? 'IN' : 'OUT';
                    @endphp

                    <div
                        class="rounded-2xl border {{ $bgClass }} p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div class="flex items-center gap-4">
                            <div
                                class="h-12 w-12 rounded-xl {{ $isIn ? 'bg-emerald-100' : 'bg-rose-100' }} flex items-center justify-center {{ $textClass }} font-bold">
                                {{ $label }}
                            </div>
                            <div>
                                <h3 class="font-bold text-slate-900">{{ $item->title }}</h3>
                                <p class="text-xs text-slate-500">{{ $item->category }} •
                                    {{ \Carbon\Carbon::parse($item->date)->format('d M Y') }}</p>
                            </div>
                        </div>

                        <div class="text-right">
                            <h2 class="font-bold {{ $textClass }}">
                                {{ $isIn ? '+' : '-' }} IDR {{ number_format($item->amount) }}
                            </h2>
                            <p class="text-xs font-semibold {{ $isIn ? 'text-emerald-600' : 'text-rose-600' }}">Completed
                            </p>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </section>
@endsection
