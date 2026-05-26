<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CrowdfundingReturn extends Model
{
    use HasFactory;
    protected $fillable = [
        'crowdfunding_financial_id',
        'user_id',
        'principal_returned',
        'profit_received',
        'ownership_percentage',
        'distributed_at'
    ];
}
