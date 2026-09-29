<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Models\Withdrawal;
use App\Models\XenditWebhookEvent;
use App\Services\Withdrawal\PayoutResult;
use App\Services\Withdrawal\WithdrawalService;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * POST /xendit/webhook/payout (payout.succeeded / payout.failed / payout.reversed).
 *
 * 1. Verify x-callback-token (401 otherwise).
 * 2. Store the event, deduped by the webhook-id header: a replay of an event
 *    we already processed is a no-op.
 * 3. Apply it to the Withdrawal found by reference_id (= Withdrawal external_id).
 *
 * Replies 200 once the event is stored and handled. If handling throws, it
 * replies 500 so Xendit retries; the stored event is then processed again.
 */
class XenditPayoutWebhookController extends Controller
{
    public function __invoke(Request $request, WithdrawalService $withdrawals): JsonResponse
    {
        $expected = (string) config('xendit.callback_token');

        if ($expected === '' || ! hash_equals($expected, (string) $request->header('x-callback-token'))) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $body = $request->json()->all();
        // The envelope wraps the payout in "data"; published examples send it bare.
        $payout = is_array($body['data'] ?? null) ? $body['data'] : $body;
        $event = is_string($body['event'] ?? null) ? $body['event'] : null;
        $referenceId = is_string($payout['reference_id'] ?? null) ? $payout['reference_id'] : null;
        $payoutId = is_string($payout['id'] ?? null) ? $payout['id'] : null;
        $status = is_string($payout['status'] ?? null) ? strtoupper($payout['status']) : null;

        if ($referenceId === null || $status === null) {
            return response()->json(['message' => 'Ignored: not a payout event'], 200);
        }

        $webhookId = $this->webhookId($request, $event, $payoutId, $status, $payout);
        $record = $this->store($webhookId, $event, $referenceId, $payoutId, $status, $body);

        if ($record->processed_at !== null) {
            return response()->json(['message' => 'Duplicate: already processed'], 200);
        }

        $record->increment('attempts');

        try {
            $result = $this->apply($withdrawals, $referenceId, $payout);
        } catch (Throwable $e) {
            $record->forceFill(['result' => XenditWebhookEvent::RESULT_ERROR, 'error' => mb_substr($e->getMessage(), 0, 2000)])->save();
            Log::error('Xendit payout webhook failed, Xendit will retry', ['webhook_id' => $webhookId, 'reference_id' => $referenceId, 'error' => $e->getMessage()]);

            return response()->json(['message' => 'Error, please retry'], 500);
        }

        $record->forceFill(['result' => $result, 'error' => null, 'processed_at' => now()])->save();

        return response()->json(['message' => 'OK', 'result' => $result], 200);
    }

    private function apply(WithdrawalService $withdrawals, string $referenceId, array $payout): string
    {
        $withdrawal = Withdrawal::query()->where('external_id', $referenceId)->first();

        if (! $withdrawal) {
            // XW-10: Company Cash-out payouts will be routed here by their own reference prefix.
            Log::warning('Xendit payout webhook for unknown reference', ['reference_id' => $referenceId]);

            return XenditWebhookEvent::RESULT_UNKNOWN_REFERENCE;
        }

        return $withdrawals->applyPayoutResult($withdrawal, $payout) === PayoutResult::APPLIED
            ? XenditWebhookEvent::RESULT_APPLIED
            : XenditWebhookEvent::RESULT_IGNORED;
    }

    /** Xendit sends a webhook-id header; fall back to a stable fingerprint of the event. */
    private function webhookId(Request $request, ?string $event, ?string $payoutId, string $status, array $payout): string
    {
        $header = trim((string) $request->header('webhook-id'));

        if ($header !== '') {
            return mb_substr($header, 0, 191);
        }

        return 'fp:'.hash('sha256', implode('|', [$event, $payoutId, $status, $payout['updated'] ?? '', $payout['failure_code'] ?? '']));
    }

    private function store(string $webhookId, ?string $event, string $referenceId, ?string $payoutId, string $status, array $body): XenditWebhookEvent
    {
        try {
            return XenditWebhookEvent::firstOrCreate(['webhook_id' => $webhookId], [
                'event' => $event ? mb_substr($event, 0, 64) : null,
                'reference_id' => mb_substr($referenceId, 0, 255),
                'payout_id' => $payoutId ? mb_substr($payoutId, 0, 255) : null,
                'status' => mb_substr($status, 0, 64),
                'payload' => $body,
            ]);
        } catch (QueryException) {
            // Two deliveries of the same webhook raced on the unique index.
            return XenditWebhookEvent::where('webhook_id', $webhookId)->firstOrFail();
        }
    }
}
