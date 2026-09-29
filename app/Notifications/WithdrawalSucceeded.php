<?php

namespace App\Notifications;

use App\Models\Withdrawal;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WithdrawalSucceeded extends Notification
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
            ->subject('Dana sudah masuk rekening: '.WithdrawalApproved::rupiah($w->amount))
            ->greeting('Halo '.($notifiable->name ?: 'Investor').',')
            ->line('Penarikan dana kamu sudah berhasil dikirim.')
            ->line('Nominal: **'.WithdrawalApproved::rupiah($w->amount).'**')
            ->line('Rekening: '.($account ? $account->bank_name.' •••• '.substr($account->account_number, -4) : '-'))
            ->action('Lihat Wallet', route('user.wallet'))
            ->line('Referensi: '.$w->external_id);
    }
}
