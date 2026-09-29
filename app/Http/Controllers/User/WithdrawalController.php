<?php

namespace App\Http\Controllers\User;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\UserBankAccount;
use App\Models\Wallet;
use App\Models\Withdrawal;
use App\Models\WithdrawalSetting;
use App\Services\Xendit\BankChannelCatalog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class WithdrawalController extends Controller
{
    // Halaman Utama Wallet
    public function index(Request $request, BankChannelCatalog $banks)
    {
        $user = $request->user();
        $wallet = Wallet::where('user_id', auth()->id())->first();
        $availableBalance = $wallet?->balance ?? 0;
        return Inertia::render('User/Wallet', [
            'balance' => $availableBalance,
            'bankAccounts' => $user->bankAccounts,
            'withdrawals' => $user->withdrawals()->with('bankAccount')->latest()->get(),
            'withdrawalSettings' => WithdrawalSetting::current()->toFrontend(),
            'banks' => array_map(fn (array $bank) => [
                'code' => $bank['code'],
                'name' => $bank['name'],
            ], $banks->all()),
        ]);
    }

    // Simpan Rekening Bank Baru
    public function storeBankAccount(Request $request, BankChannelCatalog $banks)
    {
        $request->merge([
            'bank_code' => strtoupper(trim((string) $request->input('bank_code'))),
            'account_number' => preg_replace('/[\s-]+/', '', (string) $request->input('account_number')),
            'account_holder_name' => preg_replace('/\s+/', ' ', trim((string) $request->input('account_holder_name'))),
        ]);

        $data = $request->validate([
            'bank_code' => ['required', 'string', Rule::in($banks->codes())],
            'account_number' => ['required', 'regex:/^\d{5,20}$/'],
            // Xendit: 1-100 chars and must match the bank's registered name.
            'account_holder_name' => ['required', 'string', 'max:100'],
        ], [
            'bank_code.in' => 'Bank ini tidak didukung. Pilih bank dari daftar.',
            'account_number.regex' => 'Nomor rekening harus 5-20 digit angka.',
        ]);

        $duplicate = $request->user()->bankAccounts()
            ->where('bank_code', $data['bank_code'])
            ->where('account_number', $data['account_number'])
            ->exists();

        if ($duplicate) {
            return back()->withErrors(['account_number' => 'Rekening ini sudah tersimpan.']);
        }

        $request->user()->bankAccounts()->create($data);

        return back()->with('success', 'Rekening berhasil ditambahkan!');
    }

    // Hapus Rekening Bank
    public function destroyBankAccount(Request $request, int $bankAccount)
    {
        $deleted = DB::transaction(function () use ($request, $bankAccount) {
            // Owner only: another user's id is a plain 404. Lock the row so a
            // Withdrawal cannot be submitted against it while we check.
            $account = $request->user()->bankAccounts()->whereKey($bankAccount)->lockForUpdate()->firstOrFail();

            if ($account->hasOpenWithdrawal()) {
                return false;
            }

            $account->delete();

            return true;
        });

        if (! $deleted) {
            return back()->withErrors([
                'bank_account' => 'Rekening ini masih dipakai penarikan yang sedang diproses. Tunggu sampai selesai.',
            ]);
        }

        return back()->with('success', 'Rekening berhasil dihapus.');
    }

    // Submit Request Withdraw
    public function store(Request $request)
    {
        $settings = WithdrawalSetting::current();

        $request->validate([
            'user_bank_account_id' => [
                'required',
                'integer',
                Rule::exists('user_bank_accounts', 'id')
                    ->where('user_id', $request->user()->id)
                    ->whereNull('deleted_at'),
            ],
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
