<?php

namespace App\Http\Controllers\User;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\UserBankAccount;
use App\Models\Wallet;
use App\Models\Withdrawal;
use App\Models\WithdrawalSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WithdrawalController extends Controller
{
    // Halaman Utama Wallet
    public function index(Request $request)
    {
        $user = $request->user();
        $wallet = Wallet::where('user_id', auth()->id())->first();
        $availableBalance = $wallet?->balance ?? 0;
        return Inertia::render('User/Wallet', [
            'balance' => $availableBalance,
            'bankAccounts' => $user->bankAccounts,
            'withdrawals' => $user->withdrawals()->with('bankAccount')->latest()->get(),
            'withdrawalSettings' => WithdrawalSetting::current()->toFrontend(),
        ]);
    }

    // Simpan Rekening Bank Baru
    public function storeBankAccount(Request $request)
    {
        $request->validate([
            'bank_code' => 'required|string',
            'account_number' => 'required|numeric',
            'account_holder_name' => 'required|string|max:255',
        ]);

        $request->user()->bankAccounts()->create([
            'bank_code' => strtoupper($request->bank_code),
            'account_number' => $request->account_number,
            'account_holder_name' => $request->account_holder_name,
        ]);

        return back()->with('success', 'Rekening berhasil ditambahkan!');
    }

    // Submit Request Withdraw
    public function store(Request $request)
    {
        $settings = WithdrawalSetting::current();

        $request->validate([
            'user_bank_account_id' => 'required|exists:user_bank_accounts,id',
            'amount' => $settings->amountRules(),
        ], [
            'amount.integer' => 'Nominal harus berupa angka bulat (Rupiah).',
            'amount.min' => 'Nominal minimal Rp '.number_format($settings->min_amount, 0, ',', '.').'.',
            'amount.max' => 'Nominal maksimal Rp '.number_format((int) $settings->max_amount, 0, ',', '.').'.',
        ]);

        $amount = (int) $request->amount;

        $user = $request->user();

        // Pastikan rekening ini milik user yang sedang login
        $bankAccount = UserBankAccount::where('id', $request->user_bank_account_id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $adminFee = $settings->admin_fee;
        $totalDeduction = $settings->totalDeduction($amount);

        // Cek Saldo User
        $wallet = Wallet::where('user_id', auth()->id())->first();
        $availableBalance = $wallet?->balance ?? 0;
        if ($availableBalance < $totalDeduction) {
            return back()->withErrors([
                'amount' => 'Saldo wallet tidak mencukupi untuk penarikan dan biaya admin.'
            ]);
        }

        DB::beginTransaction();
        try {
            // 1. Potong Saldo Wallet User
            $wallet->balance -= $totalDeduction;
            $wallet->save();

            // 2. Simpan Transaksi Status Pending
            $externalId = 'WD-' . time() . '-' . Str::random(5);

            Withdrawal::create([
                'user_id' => $user->id,
                'user_bank_account_id' => $bankAccount->id,
                'external_id' => $externalId,
                'amount' => $amount,
                'fee' => $adminFee,
                'status' => 'pending',
            ]);

            DB::commit();

            return back()->with('success', 'Permintaan penarikan berhasil dibuat!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors([
                'general' => 'Terjadi kesalahan sistem, silakan coba lagi.'
            ]);
        }
    }
}
