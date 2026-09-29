<?php

namespace App\Notifications;

use App\Models\Withdrawal;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WithdrawalApproved extends Notification
{
    use Queueable;

    public function __construct(public readonly Withdrawal $withdrawal) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $w = $this->withdrawal;
        $account = $w->bankAccount;

        return (new MailMessage)
            ->subject('Penarikan disetujui: '.self::rupiah($w->amount))
            ->greeting('Halo '.($notifiable->name ?: 'Investor').',')
            ->line('Penarikan dana kamu sudah disetujui admin dan sedang dikirim ke rekening kamu.')
            ->line('Nominal: **'.self::rupiah($w->amount).'**')
            ->line('Rekening: '.($account ? $account->bank_name.' •••• '.substr($account->account_number, -4) : '-'))
            ->line('Biasanya masuk dalam waktu kurang dari 1 jam. Kami kirim email lagi saat sudah masuk atau jika ada kendala.')
            ->action('Lihat Wallet', route('user.wallet'))
            ->line('Referensi: '.$w->external_id);
    }

    public static function rupiah(int|float|string|null $value): string
    {
        return 'Rp '.number_format((float) $value, 0, ',', '.');
    }
}
