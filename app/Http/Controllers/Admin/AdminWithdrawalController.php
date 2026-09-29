<?php

namespace App\Http\Controllers\Admin;

use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;
use App\Traits\AdminDataTable;

// --- SESUAIKAN DENGAN SDK v7.0.0 (PAUSE/PAYOUT) ---
use Xendit\Configuration;
use Xendit\Payout\PayoutApi;
use Xendit\Payout\CreatePayoutRequest;

class AdminWithdrawalController extends AdminController
{

    protected string $viewPath = 'withdrawals';
    protected PayoutApi $payoutApi;

    use AdminDataTable;

    public function __construct()
    {
        // 1. Set API Key di Configuration SDK v7.0.0
        Configuration::setXenditKey(config('xendit.secret_key'));

        // 2. Inisialisasi PayoutApi
        $this->payoutApi = new PayoutApi();
    }

    public function getData()
    {
        $withdrawals = Withdrawal::with(['user', 'bankAccount'])->latest();

        return DataTables::of($withdrawals)
            ->addIndexColumn()
            ->addColumn('bank_detail', function ($row) {
                if (!$row->bankAccount) return '<span class="text-muted">-</span>';
                // User-entered values: escape, this column is rendered as raw HTML.
                return '<strong>' . e($row->bankAccount->bank_name) . '</strong><br>' .
                    e($row->bankAccount->account_number) . '<br>' .
                    "<small class='text-muted'>a.n " . e($row->bankAccount->account_holder_name) . '</small>';
            })
            ->addColumn('formatted_amount', function ($row) {
                return 'Rp ' . number_format($row->amount, 0, ',', '.');
            })
            ->addColumn('formatted_fee', function ($row) {
                return 'Rp ' . number_format($row->fee, 0, ',', '.');
            })
            ->addColumn('total_deduction', function ($row) {
                return '<strong>Rp ' . number_format($row->amount + $row->fee, 0, ',', '.') . '</strong>';
            })
            ->addColumn('status_badge', function ($row) {
                $badges = [
                    'pending' => '<span class="badge badge-warning">Pending</span>',
                    'processing' => '<span class="badge badge-info">Processing (Xendit)</span>',
                    'succeeded' => '<span class="badge badge-success">Succeeded</span>',
                    'failed' => '<span class="badge badge-danger">Failed</span>',
                    'rejected' => '<span class="badge badge-danger">Rejected</span>',
                    'reversed' => '<span class="badge badge-secondary">Reversed</span>',
                ];
                return $badges[$row->status] ?? e($row->status);
            })
            ->addColumn('action', function ($row) {
                if ($row->status !== 'pending') {
                    return '<span class="text-muted">-</span>';
                }

                $approveUrl = route('admin.user-withdrawals.approve', $row->id);
                $rejectUrl = route('admin.user-withdrawals.reject', $row->id);

                return '
                    <form action="' . $approveUrl . '" method="POST" class="d-inline" onsubmit="return confirm(\'Approve dan proses transfer via Xendit?\')">
                        ' . csrf_field() . '
                        <button type="submit" class="btn btn-sm btn-success" title="Approve">
                            <i class="bx bx-check"></i>
                        </button>
                    </form>
                    <button type="button" class="btn btn-sm btn-danger" onclick="openRejectModal(\'' . $rejectUrl . '\')" title="Decline">
                        <i class="bx bx-x"></i>
                    </button>
                ';
            })
            ->rawColumns(['bank_detail', 'total_deduction', 'status_badge', 'action'])
            ->make(true);
    }

    public function index()
    {
        $withdrawals = Withdrawal::with('user', 'bankAccount')
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->view('index', [
            'title' => 'User Withdrawals',
            'withdrawals' => $withdrawals,
        ]);
    }

    // APPROVE WITHDRAWAL BY ADMIN
    public function approve(Withdrawal $withdrawal)
    {
        if ($withdrawal->status !== 'pending') {
            return back()->withErrors(['message' => 'Transaksi ini sudah diproses sebelumnya.']);
        }

        $bankAccount = $withdrawal->bankAccount;

        if (!$bankAccount) {
            return back()->withErrors(['message' => 'Data rekening bank user tidak ditemukan.']);
        }

        try {
            // bank_code is a Xendit channel code (ID_BCA); older rows stored BCA.
            $bankCode = strtoupper($bankAccount->bank_code);
            $channelCode = str_starts_with($bankCode, 'ID_') ? $bankCode : 'ID_' . $bankCode;

            $createPayoutRequest = new CreatePayoutRequest([
                'reference_id' => $withdrawal->external_id,
                'channel_code' => $channelCode,
                'channel_properties' => [
                    'account_number' => $bankAccount->account_number,
                    'account_holder_name' => $bankAccount->account_holder_name,
                ],
                'amount' => (float) $withdrawal->amount,
                'currency' => 'IDR',
                'description' => 'Pencairan Saldo Property Crowdfunding',
            ]);

            $result = $this->payoutApi->createPayout(
                $withdrawal->external_id,
                null,
                $createPayoutRequest
            );

            $withdrawal->update([
                'status' => 'processing',
                'xendit_id' => $result->getId(),
            ]);

            return back()->with('success', 'Withdrawal disetujui dan sedang diproses Xendit!');
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => 'Gagal menghubungi Xendit: ' . $e->getMessage()
            ]);
        }
    }

    // REJECT WITHDRAWAL BY ADMIN
    public function reject(Request $request, Withdrawal $withdrawal)
    {
        $request->validate([
            'failure_reason' => 'required|string|max:255',
        ]);

        if ($withdrawal->status !== 'pending') {
            return back()->withErrors(['message' => 'Transaksi ini sudah diproses sebelumnya.']);
        }

        DB::beginTransaction();
        try {
            $withdrawal->update([
                'status' => 'failed',
                'failure_reason' => $request->failure_reason,
            ]);

            // Rollback saldo + fee ke user
            $user = $withdrawal->user;
            $refundAmount = $withdrawal->amount + $withdrawal->fee;
            $user->balance += $refundAmount;
            $user->save();

            DB::commit();

            return back()->with('success', 'Withdrawal ditolak dan saldo berhasil dikembalikan ke user.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => 'Gagal menolak transaksi.']);
        }
    }
}
