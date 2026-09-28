<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBankAccount extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'bank_code',
        'account_number',
        'account_holder_name',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
