<?php

namespace App\Observers;

use App\Models\CrowdfundingFinancial;
use App\Services\CrowdfundingDistributionService;

class CrowdfundingFinancialObserver
{
    /**
     * Handle the CrowdfundingFinancial "created" event.
     */
    public function created(CrowdfundingFinancial $crowdfundingFinancial): void
    {
        //
    }

    /**
     * Handle the CrowdfundingFinancial "updated" event.
     */
    public function updated(CrowdfundingFinancial $financial)
    {
        if ($financial->isDirty('status') && $financial->status === 'FINAL' && !$financial->is_distributed) {
            app(CrowdfundingDistributionService::class)->distributeFlippingReturn($financial->id);
        }
    }

    /**
     * Handle the CrowdfundingFinancial "deleted" event.
     */
    public function deleted(CrowdfundingFinancial $crowdfundingFinancial): void
    {
        //
    }

    /**
     * Handle the CrowdfundingFinancial "restored" event.
     */
    public function restored(CrowdfundingFinancial $crowdfundingFinancial): void
    {
        //
    }

    /**
     * Handle the CrowdfundingFinancial "force deleted" event.
     */
    public function forceDeleted(CrowdfundingFinancial $crowdfundingFinancial): void
    {
        //
    }
}
