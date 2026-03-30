<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'payable_type',
        'payable_id',
        'amount',
        'external_id',
        'invoice_url',
        'status',
        'paid_at'
    ];

    public function payable()
    {
        return $this->morphTo();
    }
}
