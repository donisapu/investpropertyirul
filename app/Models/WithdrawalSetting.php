<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Admin-editable Withdrawal rules. One row; the backend is the source of truth
 * and the Withdraw form reads the same values (see toFrontend()).
 */
class WithdrawalSetting extends Model
{
    public const DEFAULT_ADMIN_FEE = 5000;

    public const DEFAULT_MIN_AMOUNT = 50000;

    /** Hard ceiling for any configured amount (IDR), to catch typos. */
    public const MAX_CONFIGURABLE_AMOUNT = 1_000_000_000_000;

    protected $fillable = ['admin_fee', 'min_amount', 'max_amount', 'updated_by'];

    protected $casts = [
        'admin_fee' => 'integer',
        'min_amount' => 'integer',
        'max_amount' => 'integer',
    ];

    protected $attributes = [
        'admin_fee' => self::DEFAULT_ADMIN_FEE,
        'min_amount' => self::DEFAULT_MIN_AMOUNT,
        'max_amount' => null,
    ];

    /**
     * The active settings. Falls back to the defaults (unsaved) if the row is missing.
     */
    public static function current(): self
    {
        return static::query()->orderBy('id')->first() ?? new static;
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function totalDeduction(int $amount): int
    {
        return $amount + $this->admin_fee;
    }

    /**
     * Validation rules for a requested Withdrawal amount.
     */
    public function amountRules(): array
    {
        $rules = ['required', 'integer', 'min:'.$this->min_amount];

        if ($this->max_amount !== null) {
            $rules[] = 'max:'.$this->max_amount;
        }

        return $rules;
    }

    /**
     * @return array{admin_fee: int, min_amount: int, max_amount: int|null}
     */
    public function toFrontend(): array
    {
        return [
            'admin_fee' => $this->admin_fee,
            'min_amount' => $this->min_amount,
            'max_amount' => $this->max_amount,
        ];
    }
}
