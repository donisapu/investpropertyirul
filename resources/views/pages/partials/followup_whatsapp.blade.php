{{-- WhatsApp follow-up for buyers who paid. $model: the listing or null on create. --}}
<hr>
<h6 class="mb-1">WhatsApp setelah bayar</h6>
<p class="text-muted small mb-3">{{ $intro }} Kosongkan keduanya untuk memakai nomor follow-up di <a href="{{ route('admin.website-settings.edit') }}">Website Settings</a>.</p>
<div class="row g-3 mb-3">
    <div class="col-md-5">
        <label for="followup_whatsapp" class="form-label">Nomor WhatsApp khusus listing ini</label>
        <input type="text" class="form-control" name="followup_whatsapp" id="followup_whatsapp" maxlength="20" inputmode="tel"
            placeholder="mis. 0812xxxxxxx" value="{{ old('followup_whatsapp', $model?->followup_whatsapp) }}">
    </div>
    <div class="col-md-7">
        <label for="followup_group_url" class="form-label">Atau link grup WhatsApp</label>
        <input type="url" class="form-control" name="followup_group_url" id="followup_group_url" maxlength="255"
            placeholder="https://chat.whatsapp.com/…" value="{{ old('followup_group_url', $model?->followup_group_url) }}">
        <div class="form-text">Bila diisi, pembeli diarahkan ke grup ini (bukan chat pribadi).</div>
    </div>
</div>
