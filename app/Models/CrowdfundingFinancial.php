<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CrowdfundingFinancial extends Model
{
    use HasFactory;
    protected $fillable = [
        'crowdfunding_id',
        'income',
        'expense',
        'net_profit',
        'status',
        'is_distributed'
    ];

    public function crowdfunding()
    {
        return $this->belongsTo(PropertyCrowdfunding::class, 'crowdfunding_id');
    }
}
