<?php

namespace App\Services\Withdrawal;

/**
 * Helps the admin spot a bank holder name that differs from the user's
 * account name (Xendit v2 has no name check). Only a hint: the admin decides.
 */
final class AccountNameMatch
{
    public static function matches(?string $accountName, ?string $holderName): bool
    {
        $a = self::normalize($accountName);
        $b = self::normalize($holderName);

        return $a !== '' && $a === $b;
    }

    /** "  siti  RAHMA, " -> "SITI RAHMA" */
    public static function normalize(?string $name): string
    {
        $name = mb_strtoupper((string) $name);
        $name = preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $name);

        return trim(preg_replace('/\s+/', ' ', $name));
    }
}
