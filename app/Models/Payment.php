<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'payable_type',
        'payable_id',
        'campaign_id',
        'amount',
        'credited_amount',
        'external_id',
        'invoice_url',
        'status',
        'paid_at',
        'lot',
        'needs_refund',
    ];

    protected $casts = [
        'needs_refund' => 'boolean',
        'refunded_at' => 'datetime',
    ];

    // What a crowdfunding contribution counts for: its full value even when bought at a discount (PF-04).
    public function creditedAmount(): int
    {
        return (int) round($this->credited_amount ?? $this->amount);
    }

    // PENDING invoices that Xendit still accepts payment for: they hold their lots / amount.
    public function scopeReserving(Builder $query): Builder
    {
        return $query->where('status', 'PENDING')
            ->where('created_at', '>', now()->subSeconds(config('xendit.invoice_duration')));
    }

    public function payable()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
