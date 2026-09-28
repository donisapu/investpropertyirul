<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Withdrawal extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'user_bank_account_id',
        'external_id',
        'amount',
        'fee',
        'status',
        'xendit_id',
        'failure_reason',
    ];

    public function bankAccount()
    {
        return $this->belongsTo(UserBankAccount::class, 'user_bank_account_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
