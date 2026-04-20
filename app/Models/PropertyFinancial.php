<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyFinancial extends Model
{
    use HasFactory;
    protected $fillable = [
        'property_investment_id',
        'year',
        'month',
        'income',
        'expense',
        'net_profit',
        'status'
    ];
}
