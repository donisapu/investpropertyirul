<?php

namespace App\Services\WhatsApp;

use App\Models\WebsiteSetting;

/**
 * The WhatsApp link a buyer gets once they paid (a booking, an auction deposit): a group
 * invite set on the listing, or a chat with a pre-filled message so the admin knows at once
 * who writes and about what. Numbers and texts are managed by the admin (Website Settings,
 * per listing), so no code change is needed when the client changes them.
 */
class FollowUpLink
{
    public const BOOKING_MESSAGE = 'Halo, saya {nama}. Saya sudah membayar booking {kode} untuk {properti}. Mohon info langkah selanjutnya.';

    public const AUCTION_MESSAGE = 'Halo, saya {nama}, peserta lelang {properti} (deposit {kode}). Mohon info langkah selanjutnya.';

    public const ACCESS_DEPOSIT = 'deposit';

    public const ACCESS_WINNER = 'winner';

    /**
     * @param  array{nama?: string|null, kode?: string|null, properti?: string|null}  $vars
     * @return array{url: string, kind: 'group'|'chat'}|null  null when no number is set anywhere
     */
    public function build(?string $groupUrl, ?string $listingNumber, string $kind, array $vars): ?array
    {
        if (filled($groupUrl)) {
            return ['url' => $groupUrl, 'kind' => 'group'];
        }

        $settings = WebsiteSetting::getSettings();
        $number = self::normalize($listingNumber)
            ?? self::normalize($settings?->wa_followup_number)
            ?? self::normalize($settings?->whatsapp);

        if (! $number) {
            return null;
        }

        $template = $kind === 'auction'
            ? ($settings?->wa_auction_message ?: self::AUCTION_MESSAGE)
            : ($settings?->wa_booking_message ?: self::BOOKING_MESSAGE);

        $text = strtr($template, [
            '{nama}' => (string) ($vars['nama'] ?? ''),
            '{kode}' => (string) ($vars['kode'] ?? ''),
            '{properti}' => (string) ($vars['properti'] ?? ''),
        ]);

        return ['url' => 'https://wa.me/'.$number.'?text='.rawurlencode($text), 'kind' => 'chat'];
    }

    /** Who may see the auction follow-up link (admin setting). */
    public static function auctionAccess(): string
    {
        return WebsiteSetting::getSettings()?->wa_auction_access === self::ACCESS_WINNER ? self::ACCESS_WINNER : self::ACCESS_DEPOSIT;
    }

    /** "0812-3456" / "+62 812…" → "628123456"; wa.me wants digits with the country code. */
    public static function normalize(?string $number): ?string
    {
        $digits = preg_replace('/\D/', '', (string) $number);
        if ($digits === '') {
            return null;
        }

        return str_starts_with($digits, '0') ? '62'.substr($digits, 1) : $digits;
    }
}
