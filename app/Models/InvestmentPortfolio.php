<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvestmentPortfolio extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'investment_id',
        'total_lot',
        'total_invested'
    ];

    public function ip()
    {
        return $this->belongsTo(PropertyInvestment::class, 'investment_id');
    }
}
