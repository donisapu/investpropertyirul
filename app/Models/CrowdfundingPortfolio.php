<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CrowdfundingPortfolio extends Model
{
    use HasFactory;
     protected $fillable = [
        'user_id',
        'crowdfunding_id',
        'total_amount'
    ];

    public function cp()
    {
        return $this->belongsTo(PropertyCrowdfunding::class, 'crowdfunding_id');
    }
}
