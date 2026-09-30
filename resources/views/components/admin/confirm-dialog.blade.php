{{--
    Confirmation step for admin actions that move money (approve, resend, cash-out).
    Replaces window.confirm(): the admin sees exactly where the money goes before it goes.

    Usage:
      <form ... data-confirm-dialog="#my-dialog"> ... </form>
      <x-admin.confirm-dialog id="my-dialog" title="Kirim Rp 100.000?" confirm-label="Kirim Rp 100.000">
          body (use x-admin.confirm-dialog rows / notes)
          <x-slot:ack>Saya sudah memastikan ...</x-slot:ack>   (optional: must be ticked before confirm)
      </x-admin.confirm-dialog>

    The form submits only after the confirm button is clicked; while it is being sent the
    dialog cannot be closed and both buttons are disabled (no double payout).
--}}
@props([
    'id',
    'title',
    'subtitle' => null,
    'confirmLabel' => 'Lanjutkan',
    'loadingLabel' => 'Mengirim ke Xendit…',
    'cancelLabel' => 'Batal',
])

<div class="modal fade cd-modal" id="{{ $id }}" tabindex="-1" aria-labelledby="{{ $id }}-title" aria-hidden="true" data-confirm-modal>
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="cd-head">
                <div>
                    <h5 class="cd-title" id="{{ $id }}-title" data-confirm-title>{{ $title }}</h5>
                    @if ($subtitle)
                        <p class="cd-subtitle" data-confirm-subtitle>{{ $subtitle }}</p>
                    @endif
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
            </div>

            <div class="cd-body">
                {{ $slot }}

                @isset($ack)
                    <label class="cd-ack">
                        <input type="checkbox" class="form-check-input" data-confirm-ack>
                        <span>{{ $ack }}</span>
                    </label>
                @endisset
            </div>

            <div class="cd-foot">
                <button type="button" class="btn cd-cancel" data-bs-dismiss="modal" data-confirm-cancel>{{ $cancelLabel }}</button>
                <button type="button" class="btn btn-primary cd-accept" data-confirm-accept data-loading-label="{{ $loadingLabel }}" @isset($ack) disabled @endisset>
                    <span class="spinner-border spinner-border-sm d-none" aria-hidden="true" data-confirm-spinner></span>
                    <span data-confirm-label>{{ $confirmLabel }}</span>
                </button>
            </div>
        </div>
    </div>
</div>

@once
    @push('scripts')
        <style>
            .cd-modal .modal-dialog { max-width: 28rem; }
            .cd-modal .modal-content { border: 0; border-radius: .75rem; box-shadow: 0 1.25rem 3rem rgba(67, 89, 113, .22); }
            .cd-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; padding: 1.5rem 1.5rem .75rem; }
            .cd-title { margin: 0; font-size: 1.25rem; font-weight: 800; color: #435971; line-height: 1.25; font-variant-numeric: tabular-nums; }
            .cd-subtitle { margin: .25rem 0 0; font-size: .8125rem; color: #697a8d; }
            .cd-body { padding: .25rem 1.5rem 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
            .cd-foot { display: flex; justify-content: flex-end; gap: .5rem; padding: 1rem 1.5rem 1.25rem; border-top: 1px solid #eceef1; }
            .cd-modal .btn-close { transform: none; box-shadow: none; background-color: transparent; padding: .5rem; margin: -.25rem -.5rem 0 0; opacity: .55; }
            .cd-modal .btn-close:hover, .cd-modal .btn-close:focus-visible { opacity: 1; background-color: #f0f1f3; }
            .cd-cancel { font-weight: 600; color: #566a7f; background: #f0f1f3; border: 0; }
            .cd-cancel:hover, .cd-cancel:focus-visible { color: #435971; background: #e4e7eb; }
            .cd-cancel:focus-visible, .cd-accept:focus-visible { outline: 2px solid #71a35f; outline-offset: 2px; box-shadow: none; }
            .cd-accept { min-width: 9.5rem; white-space: nowrap; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: .5rem; }

            /* Destination: who receives the money. */
            .cd-dest { display: flex; align-items: center; gap: .75rem; padding: .875rem 1rem; border-radius: .5rem; background: #f5f6f8; }
            .cd-bank { flex: none; display: inline-flex; align-items: center; justify-content: center; min-width: 2.75rem; height: 2rem; padding: 0 .4rem; border-radius: .375rem; background: #435971; color: #f5f5f9; font-size: .6875rem; font-weight: 800; letter-spacing: .02em; }
            .cd-dest-name { font-weight: 700; color: #435971; font-size: .9375rem; }
            .cd-dest-meta { font-size: .75rem; color: #697a8d; }
            .cd-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .02em; }

            /* Receipt rows. */
            .cd-rows { margin: 0; display: flex; flex-direction: column; }
            .cd-row { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; padding: .5rem 0; border-bottom: 1px dashed #e4e7eb; font-size: .8125rem; }
            .cd-row:last-child { border-bottom: 0; }
            .cd-row dt { font-weight: 500; color: #697a8d; }
            .cd-row dd { margin: 0; text-align: right; font-weight: 700; color: #435971; font-variant-numeric: tabular-nums; }
            .cd-row dd small { display: block; font-weight: 500; font-size: .6875rem; color: #a1acb8; }
            .cd-row.is-total dt, .cd-row.is-total dd { font-size: .9375rem; font-weight: 800; color: #435971; }

            .cd-pill { display: inline-flex; align-items: center; gap: .25rem; margin-left: .35rem; padding: .05rem .5rem; border-radius: 1rem; font-size: .6875rem; font-weight: 700; vertical-align: middle; }
            .cd-pill-ok { background: #e3ede5; color: #2f6b4f; }
            .cd-pill-warn { background: #f5ead3; color: #8a5a12; }

            .cd-note { display: flex; gap: .5rem; margin: 0; font-size: .75rem; color: #697a8d; line-height: 1.45; }
            .cd-note i { flex: none; font-size: 1rem; color: #a1acb8; margin-top: .05rem; }
            .cd-note.is-warn { padding: .75rem .875rem; border-radius: .5rem; background: #fbf4e6; color: #6f4a0f; }
            .cd-note.is-warn i { color: #b07a1c; }

            .cd-ack { display: flex; gap: .625rem; align-items: flex-start; padding: .75rem .875rem; border: 1px solid #e4e7eb; border-radius: .5rem; font-size: .8125rem; color: #435971; cursor: pointer; }
            .cd-ack:has(input:checked) { border-color: #71a35f; background: #f5f8f3; }
            .cd-ack .form-check-input { flex: none; margin-top: .15rem; }
            @media (max-width: 575.98px) {
                .cd-head, .cd-body, .cd-foot { padding-left: 1.25rem; padding-right: 1.25rem; }
                .cd-foot { flex-direction: column-reverse; }
                .cd-foot .btn { width: 100%; padding-top: .625rem; padding-bottom: .625rem; }
            }
        </style>
        <script>
            (function () {
                if (window.__confirmDialog) return;
                window.__confirmDialog = true;

                // Capture phase: runs before the page's own submit handlers (one-submit guard etc.).
                document.addEventListener('submit', function (e) {
                    var form = e.target;
                    if (!(form instanceof HTMLFormElement) || !form.dataset.confirmDialog) return;
                    if (form.dataset.confirmed === '1') return;
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (e.submitter && e.submitter.disabled) return;

                    var modal = document.querySelector(form.dataset.confirmDialog);
                    if (!modal || !window.bootstrap) return;
                    modal.__form = form;
                    modal.__trigger = e.submitter || form.querySelector('[type=submit], button:not([type=button])');
                    form.dispatchEvent(new CustomEvent('confirm-dialog:open', { detail: { modal: modal } }));
                    bootstrap.Modal.getOrCreateInstance(modal).show();
                }, true);

                document.querySelectorAll('[data-confirm-modal]').forEach(function (modal) {
                    var accept = modal.querySelector('[data-confirm-accept]');
                    var acks = Array.prototype.slice.call(modal.querySelectorAll('[data-confirm-ack]'));
                    var label = modal.querySelector('[data-confirm-label]');
                    var spinner = modal.querySelector('[data-confirm-spinner]');
                    var idleLabel = label.textContent;

                    function syncAck() {
                        if (modal.dataset.sending) return;
                        accept.disabled = acks.some(function (a) { return !a.checked; });
                    }
                    acks.forEach(function (a) { a.addEventListener('change', syncAck); });

                    function setSending(on) {
                        if (on) modal.dataset.sending = '1'; else delete modal.dataset.sending;
                        spinner.classList.toggle('d-none', !on);
                        label.textContent = on ? accept.dataset.loadingLabel : (modal.dataset.idleLabel || idleLabel);
                        modal.querySelectorAll('button').forEach(function (b) { b.disabled = on; });
                        if (!on) syncAck();
                    }

                    accept.addEventListener('click', function () {
                        var form = modal.__form;
                        if (!form || accept.disabled) return;
                        setSending(true);
                        form.dataset.confirmed = '1';
                        form.requestSubmit();
                    });

                    // Money is on its way: the dialog stays until the page reloads.
                    modal.addEventListener('hide.bs.modal', function (e) {
                        if (modal.dataset.sending) e.preventDefault();
                    });
                    modal.addEventListener('shown.bs.modal', function () {
                        (acks[0] || modal.querySelector('[data-confirm-cancel]')).focus();
                    });
                    modal.addEventListener('hidden.bs.modal', function () {
                        acks.forEach(function (a) { a.checked = false; });
                        syncAck();
                        if (modal.__trigger && document.contains(modal.__trigger)) modal.__trigger.focus();
                    });
                    // Back button (bfcache) must not leave a frozen dialog behind.
                    window.addEventListener('pageshow', function (e) {
                        if (!e.persisted) return;
                        setSending(false);
                        if (modal.__form) delete modal.__form.dataset.confirmed;
                        bootstrap.Modal.getOrCreateInstance(modal).hide();
                    });
                });
            })();
        </script>
    @endpush
@endonce
