<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvestmentTransaction extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'investment_id',
        'payment_id',
        'price_per_lot',
        'lot',
        'amount',
        'transacted_at',
        'type',
        'status'
    ];

    public function ip()
    {
        return $this->belongsTo(PropertyInvestment::class, 'investment_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }
}
