<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CrowdfundingTransaction extends Model
{
    use HasFactory;
     protected $fillable = [
        'user_id',
        'crowdfunding_id',
        'payment_id',
        'amount',
        'transacted_at'
    ];
}
