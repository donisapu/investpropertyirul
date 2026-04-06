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
        'lot',
        'amount',
        'transacted_at',
        'type'
    ];
}
