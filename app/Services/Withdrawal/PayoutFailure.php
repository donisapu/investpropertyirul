<?php

namespace App\Services\Withdrawal;

/**
 * Plain-language text for Xendit payout failure codes. Unknown codes get a
 * generic message: Xendit may add new codes at any time.
 */
final class PayoutFailure
{
    private const MESSAGES = [
        'ACCOUNT_NAME_MISMATCH' => 'Nama rekening tidak cocok dengan data bank',
        'INVALID_DESTINATION' => 'Nomor rekening tidak ditemukan di bank',
        'DESTINATION_MAXIMUM_LIMIT' => 'Melebihi batas penerimaan rekening tujuan',
        'REJECTED_BY_CHANNEL' => 'Ditolak oleh bank tujuan',
        'TEMPORARY_TRANSFER_ERROR' => 'Gangguan sementara di bank tujuan',
        'TRANSFER_ERROR' => 'Transfer gagal di bank tujuan',
        'INSUFFICIENT_BALANCE' => 'Transfer tertunda di sisi kami',
        'UNKNOWN_BANK_NETWORK_ERROR' => 'Gangguan jaringan bank',
    ];

    /** Codes where the user must change the saved account before retrying. */
    private const ACCOUNT_PROBLEMS = ['ACCOUNT_NAME_MISMATCH', 'INVALID_DESTINATION'];

    public static function message(?string $code): ?string
    {
        if ($code === null || $code === '') {
            return null;
        }

        return self::MESSAGES[strtoupper($code)] ?? 'Transfer gagal diproses bank';
    }

    public static function isAccountProblem(?string $code): bool
    {
        return in_array(strtoupper((string) $code), self::ACCOUNT_PROBLEMS, true);
    }
}
