<?php

namespace App\Http\Controllers\Admin;

use App\Models\CrowdfundingFinancial;
use App\Models\PropertyCrowdfunding;
use App\Models\User;
use App\Services\CrowdfundingDistributionService;
use App\Services\ProfitDistributionRejected;
use App\Traits\AdminDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CrowdfundingFinancialsController extends AdminController
{

    protected string $viewPath = 'crowdfunding_financial';

    use AdminDataTable;

    public function __construct(private CrowdfundingDistributionService $distributor)
    {
    }

    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        return $this->view('index', [
            'title' => 'Crowdfunding Financials',
            'data'  => PropertyCrowdfunding::with('property')->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $id)
    {
        PropertyCrowdfunding::findOrFail($id);
        $request->validate($this->rules());

        DB::transaction(function () use ($request, $id) {

            $income = $request->income ?? 0;
            $expense = $request->expense ?? 0;

            CrowdfundingFinancial::create([
                'crowdfunding_id' => $id,
                'income' => $income,
                'expense' => $expense,
                'net_profit' => $income - $expense,
                'status' => $request->status ?? null,
            ]);
        });

        return redirect()->route('admin.cw_financials.show', $id);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $data = PropertyCrowdfunding::with('property')->where('id', $id)->firstOrFail();
        $financials = CrowdfundingFinancial::where('crowdfunding_id', $id)->orderBy('id')->get();

        // What "Bagikan Hasil" would pay, shown in its confirm dialog.
        $previews = $financials
            ->filter(fn ($item) => $item->status === 'FINAL' && ! $item->is_distributed)
            ->mapWithKeys(fn ($item) => [$item->id => $this->distributor->preview($item)]);

        return $this->view('show', [
            'title' => $data->property->property_name . " Financials",
            'data'  => $financials,
            'id'    => $id,
            'crowdfunding' => $data,
            'previews' => $previews,
            'investorNames' => User::whereIn('id', $previews->flatMap(fn ($plan) => $plan['shares']->pluck('user_id')))->pluck('name', 'id'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CrowdfundingFinancial $crowdfundingFinancial)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id, $back)
    {
        $data = CrowdfundingFinancial::where('crowdfunding_id', $back)->findOrFail($id);

        if ($data->is_distributed) {
            return redirect()->route('admin.cw_financials.show', $back)->with('error', 'Laporan yang hasilnya sudah dibagikan tidak bisa diubah.');
        }

        $request->validate($this->rules());

        $data->income = $request->income;
        $data->expense = $request->expense;
        $data->status = $request->status;
        $data->net_profit = $request->income - $request->expense;
        $data->save();
        return redirect()->route('admin.cw_financials.show', $back);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id, $back)
    {
        $data = CrowdfundingFinancial::where('crowdfunding_id', $back)->findOrFail($id);

        if ($data->is_distributed) {
            return redirect()->route('admin.cw_financials.show', $back)->with('error', 'Laporan yang hasilnya sudah dibagikan tidak bisa dihapus.');
        }

        $data->delete();
        return redirect()->route('admin.cw_financials.show', $back);
    }

    /**
     * Return the principal plus the share of net profit to each investor's wallet (admin decides when).
     */
    public function distribute($id, $back)
    {
        $financial = CrowdfundingFinancial::where('crowdfunding_id', $back)->findOrFail($id);

        try {
            $result = $this->distributor->handle($financial);
        } catch (ProfitDistributionRejected $e) {
            return redirect()->route('admin.cw_financials.show', $back)->with('error', $e->getMessage());
        }

        return redirect()->route('admin.cw_financials.show', $back)->with('success', sprintf(
            'Rp %s (modal + profit) dibagikan ke %d investor.',
            number_format($result['total'], 0, ',', '.'),
            $result['investors'],
        ));
    }

    private function rules(): array
    {
        return [
            'income' => ['nullable', 'numeric', 'min:0'],
            'expense' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['DRAFT', 'FINAL'])],
        ];
    }


}
