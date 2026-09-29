<?php

namespace App\Models;

use App\Services\Xendit\BankChannelCatalog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserBankAccount extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'bank_code',
        'account_number',
        'account_holder_name',
    ];

    protected $appends = ['bank_name'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function withdrawals()
    {
        return $this->hasMany(Withdrawal::class, 'user_bank_account_id');
    }

    /** True while a Withdrawal to this account is still open (not final). */
    public function hasOpenWithdrawal(): bool
    {
        return $this->withdrawals()->whereIn('status', Withdrawal::OPEN_STATUSES)->exists();
    }

    /** Human bank name from the Xendit catalog; falls back to the stored code. */
    public function getBankNameAttribute(): string
    {
        return app(BankChannelCatalog::class)->nameFor($this->bank_code) ?? (string) $this->bank_code;
    }
}
