<?php

namespace App\Notifications;

use App\Models\Withdrawal;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WithdrawalRejected extends Notification
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

        return (new MailMessage)
            ->subject('Penarikan ditolak, saldo dikembalikan')
            ->greeting('Halo '.($notifiable->name ?: 'Investor').',')
            ->line('Maaf, penarikan dana sebesar '.WithdrawalApproved::rupiah($w->amount).' tidak dapat kami proses.')
            ->line('Alasan: '.$w->failure_reason)
            ->line('Saldo '.WithdrawalApproved::rupiah($w->totalDeduction()).' (nominal + biaya admin) sudah dikembalikan ke wallet kamu.')
            ->action('Buka Wallet', route('user.wallet'))
            ->line('Referensi: '.$w->external_id);
    }
}
