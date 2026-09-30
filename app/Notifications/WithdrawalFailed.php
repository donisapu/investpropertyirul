<?php

namespace App\Notifications;

use App\Models\Withdrawal;
use App\Services\Withdrawal\PayoutFailure;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WithdrawalFailed extends Notification
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
        $reason = PayoutFailure::message($w->failure_code) ?? ($w->failure_reason ?: 'Transfer gagal diproses bank');

        $mail = (new MailMessage)
            ->subject($w->status === Withdrawal::STATUS_REVERSED ? 'Transfer dibatalkan bank, saldo dikembalikan' : 'Penarikan gagal, saldo dikembalikan')
            ->greeting('Halo '.($notifiable->name ?: 'Investor').',')
            ->line('Penarikan dana sebesar '.WithdrawalApproved::rupiah($w->amount).' tidak berhasil masuk ke rekening kamu.')
            ->line('Alasan: '.$reason)
            ->line('Saldo '.WithdrawalApproved::rupiah($w->totalDeduction()).' (nominal + biaya admin) sudah dikembalikan ke wallet kamu.');

        if (PayoutFailure::isAccountProblem($w->failure_code)) {
            $mail->line('Periksa kembali nomor rekening dan nama pemilik (harus sama persis dengan buku tabungan), lalu ajukan lagi.');
        }

        return $mail->action('Buka Wallet', route('user.wallet'))->line('Referensi: '.$w->external_id);
    }
}
