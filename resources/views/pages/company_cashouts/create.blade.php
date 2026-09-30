@extends('layouts.app')

@php
    $rupiah = fn ($v) => $v === null ? '—' : 'Rp ' . number_format((float) $v, 0, ',', '.');
    $categoryLabels = ['VIRTUAL_ACCOUNT' => 'VA', 'EWALLET' => 'e-Wallet', 'QR_CODE' => 'QRIS', 'RETAIL_OUTLET' => 'Retail', 'CARDS' => 'Kartu'];
    $selected = collect(old('transaction_ids', []))->map(fn ($id) => (int) $id)->all();
@endphp

@section('content')
    <style>
        .co-eyebrow { font-size: .75rem; font-weight: 600; color: #a1acb8; }
        .co-table th { font-size: .625rem; font-weight: 700; letter-spacing: .06em; color: #a1acb8; text-transform: uppercase; white-space: nowrap; }
        .co-table td { vertical-align: middle; font-size: .8125rem; }
        .co-table tr.co-off td { opacity: .6; }
        .co-table tr.co-on { background: #f5f8f3; }
        .co-main { font-weight: 700; color: #435971; }
        .co-sub { font-size: .6875rem; color: #697a8d; }
        .co-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .6875rem; }
        .co-in { color: #2f6b4f; font-weight: 800; white-space: nowrap; }
        .co-fee { font-size: .6875rem; color: #a1acb8; }
        .co-note { font-size: .6875rem; color: #a1acb8; }
        .co-table td, .co-table th { padding-left: .5rem; padding-right: .5rem; }
        .co-pill { display: inline-flex; align-items: center; gap: .35rem; font-size: .6875rem; font-weight: 700; border-radius: 1rem; padding: .15rem .6rem; white-space: nowrap; }
        .co-pill::before { content: ""; width: .35rem; height: .35rem; border-radius: 50%; background: currentColor; }
        .co-ok { background: #e3ede5; color: #2f6b4f; } .co-warn { background: #f5ead3; color: #8a5a12; } .co-muted { background: #ebeef0; color: #697a8d; }
        .co-panel { position: sticky; top: 6.5rem; }
        .co-total { font-size: 2rem; font-weight: 800; color: #435971; line-height: 1.1; }
        .co-panel.is-over .co-total { color: #9b3b2e; }
        .co-meter { height: .5rem; border-radius: 1rem; background: #ebeef0; overflow: hidden; }
        .co-meter > span { display: block; height: 100%; background: #71a35f; border-radius: 1rem; transition: width .2s ease; }
        .co-panel.is-over .co-meter > span { background: #9b3b2e; }
        .co-msg { border-radius: .375rem; padding: .6rem .75rem; font-size: .75rem; font-weight: 700; }
        .co-msg-ok { background: #e3ede5; color: #2f6b4f; } .co-msg-bad { background: #f4e1dc; color: #9b3b2e; } .co-msg-idle { background: #f5f6f8; color: #697a8d; }
        .co-picked { max-height: 12rem; overflow-y: auto; }
        .co-picked li { display: flex; justify-content: space-between; gap: 1rem; font-size: .75rem; padding: .3rem 0; border-bottom: 1px solid #f0f1f3; }
        .co-dest { background: #f5f6f8; border-radius: .375rem; padding: .75rem; }
        .co-bank { display: inline-flex; align-items: center; justify-content: center; min-width: 2.5rem; padding: 0 .35rem; height: 1.75rem; border-radius: .25rem; background: #435971; color: #71a35f; font-size: .625rem; font-weight: 800; }
    </style>

    <div class="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
            <div class="co-eyebrow">Keuangan / Xendit</div>
            <h4 class="fw-bolder mb-0" style="color:#435971">Company Cash-out</h4>
        </div>
        <div class="d-flex gap-2">
            <a href="{{ route('admin.company-cashouts.index') }}" class="btn btn-sm btn-outline-secondary bg-white"><i class="bx bx-history me-1"></i>Riwayat Cash-out</a>
            <a href="{{ route('admin.xendit-transactions') }}" class="btn btn-sm btn-text-secondary">Semua transaksi</a>
        </div>
    </div>

    @foreach (['success' => 'success', 'info' => 'info', 'warning' => 'warning', 'error' => 'danger'] as $key => $class)
        @if (session($key))
            <div class="alert alert-{{ $class }} alert-dismissible" role="{{ $key === 'error' ? 'alert' : 'status' }}">{{ session($key) }}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Tutup"></button></div>
        @endif
    @endforeach
    @if ($errors->any())
        <div class="alert alert-danger" role="alert">{{ $errors->first() }}</div>
    @endif

    <form method="POST" action="{{ route('admin.company-cashouts.store') }}" id="co-form" data-confirm-dialog="#co-dialog">
        @csrf
        <div class="row g-4">
            <div class="col-xl-8">
                <div class="card">
                    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 p-3 px-4 border-bottom">
                        <span class="co-sub fw-semibold">Pilih uang masuk yang sudah settle. Yang belum settle atau sudah dicairkan tidak bisa dipilih.</span>
                        <button type="button" class="btn btn-sm btn-outline-primary" id="co-auto" @disabled($max === null || $autoSelect === [])
                            title="Terlama dulu, sedekat mungkin ke batas tanpa melewatinya">
                            <i class="bx bx-magic-wand me-1"></i>Pilih otomatis sampai batas
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="table co-table mb-0">
                            <thead>
                                <tr>
                                    <th class="ps-4" style="width:2.5rem"><span class="visually-hidden">Pilih</span></th>
                                    <th>Waktu / Tipe</th>
                                    <th>User / Referensi</th>
                                    <th class="text-end">Masuk bersih</th>
                                    <th class="pe-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($rows as $t)
                                    @php
                                        $eligible = $t->isCashoutEligible();
                                        $user = $t->linkedUser();
                                        $property = $t->linkable instanceof \App\Models\Payment ? $t->linkable->payable?->property?->property_name : null;
                                        $channel = trim(preg_replace('/^ID_/', '', (string) $t->channel_code) . ' ' . ($categoryLabels[$t->channel_category] ?? ''));
                                    @endphp
                                    <tr class="{{ $eligible ? '' : 'co-off' }}">
                                        <td class="ps-4">
                                            @if ($eligible)
                                                <input class="form-check-input co-check" type="checkbox" name="transaction_ids[]" value="{{ $t->id }}"
                                                    data-net="{{ $t->netAmount() }}" data-label="{{ $user?->name ?? $t->reference_id ?? $t->xendit_id }}"
                                                    aria-label="Pilih {{ $t->reference_id ?? $t->xendit_id }}" @checked(in_array($t->id, $selected, true))>
                                            @endif
                                        </td>
                                        <td class="text-nowrap">
                                            <div class="co-main">{{ $t->type === 'PAYMENT' ? 'Invoice' : ucfirst(strtolower((string) $t->type)) }} <span class="co-sub fw-normal">· {{ $channel ?: '-' }}</span></div>
                                            <div class="co-sub">{{ $t->xendit_created_at?->timezone(config('app.timezone'))->locale('id')->translatedFormat('j M H.i') }}</div>
                                        </td>
                                        <td>
                                            <div class="co-main">{{ $user?->name ?? '—' }}</div>
                                            <div class="co-sub"><span class="co-mono">{{ $t->reference_id ?? $t->xendit_id }}</span>@if ($property) · {{ $property }}@endif</div>
                                        </td>
                                        <td class="text-end">
                                            <div class="co-in">+ {{ $rupiah($t->netAmount()) }}</div>
                                            @if ((float) $t->fee > 0)
                                                <div class="co-fee">{{ $rupiah($t->amount) }} − fee {{ $rupiah($t->fee) }}</div>
                                            @endif
                                        </td>
                                        <td class="pe-4">
                                            @if ($t->company_cashout_id)
                                                <span class="co-pill co-muted">Sudah dicairkan</span>
                                                <div class="co-fee mt-1">{{ $t->cashout?->external_id }}</div>
                                            @elseif ($eligible)
                                                <span class="co-pill co-ok">Settled</span>
                                            @else
                                                <span class="co-pill co-warn">Holding</span>
                                                <div class="co-fee mt-1">Belum bisa dipilih</div>
                                            @endif
                                        </td>
                                    </tr>
                                @empty
                                    <tr><td colspan="5" class="text-center co-sub py-5">Belum ada uang masuk yang sudah settle. Coba <a href="{{ route('admin.xendit-transactions') }}">sinkron transaksi</a>.</td></tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-xl-4">
                <div class="card co-panel" id="co-panel" data-max="{{ $max ?? '' }}">
                    <div class="card-body p-4 d-flex flex-column gap-3">
                        <div>
                            <h5 class="fw-bolder mb-0" style="color:#435971">Company Cash-out</h5>
                            <div class="co-sub fw-semibold" id="co-count">0 transaksi dipilih</div>
                        </div>
                        <div>
                            <div class="co-sub fw-semibold">Total dicairkan</div>
                            <div class="co-total" id="co-total" aria-live="polite">Rp 0</div>
                        </div>
                        <div>
                            <div class="co-meter" aria-hidden="true"><span id="co-bar" style="width:0%"></span></div>
                            <div class="d-flex justify-content-between mt-1 co-sub fw-bold">
                                <span id="co-share"></span>
                                <span>Batas {{ $rupiah($max) }}</span>
                            </div>
                        </div>
                        <div class="co-msg co-msg-idle" id="co-msg" role="status">
                            @if ($max === null)
                                Saldo Xendit belum bisa dibaca, jadi Cash-out diblokir.
                            @else
                                Pilih transaksi di kiri, atau pakai "Pilih otomatis sampai batas".
                            @endif
                        </div>

                        <ul class="list-unstyled mb-0 co-picked" id="co-picked"></ul>

                        <div>
                            <div class="co-eyebrow text-uppercase mb-1" style="letter-spacing:.06em;font-size:.625rem">Rekening tujuan</div>
                            @if ($account)
                                <div class="co-dest d-flex align-items-center gap-2">
                                    <span class="co-bank">{{ mb_substr(\Illuminate\Support\Str::after($account['bank_code'], 'ID_'), 0, 7) }}</span>
                                    <div class="flex-grow-1">
                                        <div class="co-main">{{ $account['account_holder'] }}</div>
                                        <div class="co-sub">{{ $accountBank }} · {{ substr($account['account_number'], 0, 4) }} •••• {{ substr($account['account_number'], -4) }}</div>
                                    </div>
                                    <i class="bx bx-lock-alt" style="color:#a1acb8" aria-label="Terkunci"></i>
                                </div>
                                <div class="co-fee mt-1">Diatur di Settings. Tidak bisa diubah di sini.</div>
                            @else
                                <div class="co-msg co-msg-bad">Rekening perusahaan belum diatur. <a href="{{ route('admin.withdrawal-settings.edit') }}">Atur di Settings</a>.</div>
                            @endif
                        </div>

                        <button type="submit" class="btn btn-primary w-100 py-2 fw-bolder" id="co-submit" disabled>Pilih transaksi dulu</button>
                        <div class="co-note text-center">Saldo Xendit dicek ulang saat kamu klik. Tercatat di riwayat atas nama {{ auth()->user()->name }}.</div>
                    </div>
                </div>
            </div>
        </div>
    </form>

    <x-admin.confirm-dialog id="co-dialog" title="Cairkan ke rekening perusahaan?" subtitle="Ke rekening perusahaan yang diatur di Settings" confirm-label="Cairkan">
        @if ($account)
            <div class="cd-dest">
                <span class="cd-bank">{{ mb_substr(\Illuminate\Support\Str::after($account['bank_code'], 'ID_'), 0, 7) }}</span>
                <div class="min-w-0">
                    <div class="cd-dest-name text-truncate">{{ $account['account_holder'] }}</div>
                    <div class="cd-dest-meta">{{ $accountBank }} · <span class="cd-mono">{{ trim(chunk_split($account['account_number'], 4, ' ')) }}</span></div>
                </div>
            </div>
        @endif
        <dl class="cd-rows">
            <div class="cd-row is-total"><dt>Dicairkan</dt><dd id="co-dialog-total">Rp 0</dd></div>
            <div class="cd-row"><dt>Transaksi</dt><dd id="co-dialog-count">0</dd></div>
            <div class="cd-row"><dt>Batas saat ini</dt><dd>{{ $rupiah($max) }}</dd></div>
            <div class="cd-row"><dt>Sisa batas setelah ini</dt><dd id="co-dialog-left">{{ $rupiah($max) }}</dd></div>
        </dl>
        <p class="cd-note"><i class="bx bx-info-circle" aria-hidden="true"></i><span>Saldo Xendit dicek ulang sebelum dikirim; kalau sudah tidak cukup, Cash-out ditolak dan tidak ada uang keluar. Reserve milik user tidak tersentuh.</span></p>
    </x-admin.confirm-dialog>
@endsection

@push('scripts')
    <script>
        (function () {
            var panel = document.getElementById('co-panel');
            var max = panel.dataset.max === '' ? null : Number(panel.dataset.max);
            var hasAccount = {{ $account ? 'true' : 'false' }};
            var auto = @json($autoSelect);
            var checks = Array.prototype.slice.call(document.querySelectorAll('.co-check'));
            var fmt = function (n) { return 'Rp ' + Math.round(n).toLocaleString('id-ID'); };
            var el = function (id) { return document.getElementById(id); };

            function render() {
                var picked = checks.filter(function (c) { return c.checked; });
                var total = picked.reduce(function (s, c) { return s + Number(c.dataset.net); }, 0);
                var over = max !== null && total > max;
                checks.forEach(function (c) { c.closest('tr').classList.toggle('co-on', c.checked); });

                el('co-count').textContent = picked.length + ' transaksi dipilih';
                el('co-total').textContent = fmt(total);
                el('co-bar').style.width = max ? Math.min(100, total / max * 100) + '%' : (total ? '100%' : '0%');
                el('co-share').textContent = over ? 'Lebih ' + fmt(total - max) : (max && total ? Math.round(total / max * 100) + '% dari batas' : '');
                el('co-share').style.color = over ? '#9b3b2e' : '#5b8a4b';
                panel.classList.toggle('is-over', over);

                var msg = el('co-msg');
                if (max === null) {
                    msg.className = 'co-msg co-msg-bad';
                    msg.textContent = 'Saldo Xendit belum bisa dibaca, jadi Cash-out diblokir.';
                } else if (over) {
                    msg.className = 'co-msg co-msg-bad';
                    msg.textContent = 'Diblokir. Kurangi ' + fmt(total - max) + ' atau tunggu transaksi lain settle. Reserve milik user tidak boleh dipakai.';
                } else if (total > 0) {
                    msg.className = 'co-msg co-msg-ok';
                    msg.textContent = 'Aman. Reserve milik user tidak tersentuh.';
                } else {
                    msg.className = 'co-msg co-msg-idle';
                    msg.textContent = 'Pilih transaksi di kiri, atau pakai "Pilih otomatis sampai batas".';
                }

                var list = el('co-picked');
                list.innerHTML = '';
                picked.slice(0, 8).forEach(function (c) {
                    var li = document.createElement('li');
                    var name = document.createElement('span');
                    name.className = 'co-sub text-truncate';
                    name.textContent = c.dataset.label; // textContent: never HTML
                    var amount = document.createElement('span');
                    amount.className = 'co-main';
                    amount.textContent = fmt(Number(c.dataset.net));
                    li.append(name, amount);
                    list.append(li);
                });
                if (picked.length > 8) {
                    var more = document.createElement('li');
                    more.className = 'co-sub';
                    more.textContent = '+ ' + (picked.length - 8) + ' transaksi lainnya';
                    list.append(more);
                }

                var submit = el('co-submit');
                var ok = picked.length > 0 && !over && max !== null && hasAccount;
                submit.disabled = !ok;
                submit.classList.toggle('btn-primary', !over);
                submit.classList.toggle('btn-secondary', over);
                submit.textContent = over ? 'Melebihi batas' : (picked.length ? 'Cairkan ' + fmt(total) : 'Pilih transaksi dulu');
            }

            checks.forEach(function (c) { c.addEventListener('change', render); });
            var autoBtn = el('co-auto');
            if (autoBtn) autoBtn.addEventListener('click', function () {
                checks.forEach(function (c) { c.checked = auto.indexOf(Number(c.value)) !== -1; });
                render();
            });
            // Fill the confirm dialog with the current selection right before it opens.
            el('co-form').addEventListener('confirm-dialog:open', function (e) {
                var picked = checks.filter(function (c) { return c.checked; });
                var total = picked.reduce(function (sum, c) { return sum + Number(c.dataset.net); }, 0);
                var modal = e.detail.modal;
                el('co-dialog-total').textContent = fmt(total);
                el('co-dialog-count').textContent = picked.length + ' transaksi';
                el('co-dialog-left').textContent = max === null ? '—' : fmt(Math.max(0, max - total));
                modal.querySelector('[data-confirm-title]').textContent = 'Cairkan ' + fmt(total) + '?';
                modal.dataset.idleLabel = 'Cairkan ' + fmt(total);
                modal.querySelector('[data-confirm-label]').textContent = modal.dataset.idleLabel;
            });
            el('co-form').addEventListener('submit', function (e) {
                if (el('co-submit').disabled) { e.preventDefault(); return; }
                el('co-submit').disabled = true;
                el('co-submit').textContent = 'Mengirim…';
            });
            render();
        })();
    </script>
@endpush
