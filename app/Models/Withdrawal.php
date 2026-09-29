<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Withdrawal extends Model
{
    use HasFactory;

    /** Not final yet: money is on its way or waiting for admin. */
    public const OPEN_STATUSES = ['pending', 'processing'];

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
        // Keep showing the account on old withdrawals after the user deletes it.
        return $this->belongsTo(UserBankAccount::class, 'user_bank_account_id')->withTrashed();
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
