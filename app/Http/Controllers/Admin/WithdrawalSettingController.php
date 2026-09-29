<?php

namespace App\Http\Controllers\Admin;

use App\Models\WithdrawalSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WithdrawalSettingController extends AdminController
{
    protected string $viewPath = 'withdrawal_settings';

    public function edit()
    {
        return $this->view('index', [
            'title' => 'Withdrawal Settings',
            'setting' => WithdrawalSetting::current()->load('updatedBy'),
        ]);
    }

    public function update(Request $request)
    {
        $ceiling = WithdrawalSetting::MAX_CONFIGURABLE_AMOUNT;

        $data = $request->validate([
            'admin_fee' => ['required', 'integer', 'min:0', "max:{$ceiling}"],
            'min_amount' => ['required', 'integer', 'min:1', "max:{$ceiling}"],
            'max_amount' => ['nullable', 'integer', 'gte:min_amount', "max:{$ceiling}"],
        ], [
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
            ]);
        });

        return redirect()
            ->route('admin.withdrawal-settings.edit')
            ->with('success', 'Withdrawal settings updated.');
    }
}
