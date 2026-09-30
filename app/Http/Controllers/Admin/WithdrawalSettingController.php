<?php

namespace App\Http\Controllers\Admin;

use App\Models\WithdrawalSetting;
use App\Services\Xendit\BankChannelCatalog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class WithdrawalSettingController extends AdminController
{
    protected string $viewPath = 'withdrawal_settings';

    public function edit(BankChannelCatalog $banks)
    {
        return $this->view('index', [
            'title' => 'Withdrawal & Cash-out Settings',
            'setting' => WithdrawalSetting::current()->load('updatedBy'),
            'banks' => $banks->all(),
        ]);
    }

    public function update(Request $request, BankChannelCatalog $banks)
    {
        $request->merge([
            'company_bank_code' => $request->filled('company_bank_code') ? strtoupper(trim((string) $request->input('company_bank_code'))) : null,
            'company_account_number' => $request->filled('company_account_number') ? preg_replace('/[\s-]+/', '', (string) $request->input('company_account_number')) : null,
            'company_account_holder' => $request->filled('company_account_holder') ? preg_replace('/\s+/', ' ', trim((string) $request->input('company_account_holder'))) : null,
        ]);

        $ceiling = WithdrawalSetting::MAX_CONFIGURABLE_AMOUNT;

        $data = $request->validate([
            'admin_fee' => ['required', 'integer', 'min:0', "max:{$ceiling}"],
            'min_amount' => ['required', 'integer', 'min:1', "max:{$ceiling}"],
            'max_amount' => ['nullable', 'integer', 'gte:min_amount', "max:{$ceiling}"],
            // Company Bank Account: all three or none.
            'company_bank_code' => ['nullable', 'required_with:company_account_number,company_account_holder', Rule::in($banks->codes())],
            'company_account_number' => ['nullable', 'required_with:company_bank_code,company_account_holder', 'regex:/^\d{5,20}$/'],
            'company_account_holder' => ['nullable', 'required_with:company_bank_code,company_account_number', 'string', 'max:100'],
        ], [
            'company_bank_code.in' => 'Bank tidak didukung Xendit.',
            'company_account_number.regex' => 'Nomor rekening harus 5-20 digit angka.',
            'max_amount.gte' => 'Maximum amount must be greater than or equal to the minimum amount.',
        ]);

        DB::transaction(function () use ($data, $request) {
            $setting = WithdrawalSetting::query()->orderBy('id')->lockForUpdate()->first() ?? new WithdrawalSetting;
            $before = $setting->exists ? $setting->toFrontend() : null;

            $setting->fill([...$data, 'updated_by' => $request->user()->id])->save();

            Log::info('Withdrawal settings updated', [
                'admin_id' => $request->user()->id,
                'before' => $before,
                'after' => $setting->toFrontend(),
                'company_account' => $setting->companyAccount() ? $setting->company_bank_code.' ****'.substr($setting->company_account_number, -4) : null,
            ]);
        });

        return redirect()
            ->route('admin.withdrawal-settings.edit')
            ->with('success', 'Withdrawal settings updated.');
    }
}
