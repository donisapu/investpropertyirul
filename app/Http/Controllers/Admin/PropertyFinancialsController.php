<?php

namespace App\Http\Controllers\Admin;

use App\Models\PropertyFinancial;
use App\Models\PropertyInvestment;
use App\Models\User;
use App\Services\DistributeProfitService;
use App\Services\ProfitDistributionRejected;
use App\Traits\AdminDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class PropertyFinancialsController extends AdminController
{
    /**
     * Display a listing of the resource.
     */
    protected string $viewPath = 'property_financial';

    use AdminDataTable;

    public function __construct(private DistributeProfitService $distributor)
    {
    }

    public function data()
    {
        $query = PropertyFinancial::with('property')->select('id', 'property_id', 'total_lot', 'status');

        return $this->dataTable($query, 'pages.property_investment.action');
    }

    public function index()
    {
        return $this->view('index', [
            'title' => 'Property Financials',
            'data'  => PropertyInvestment::with('property')->get()
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
        $request->validate($this->rules($id));

        DB::transaction(function () use ($request) {

            $income = $request->income ?? 0;
            $expense = $request->expense ?? 0;

            PropertyFinancial::create([
                'property_investment_id' => $request->property_investment_id,
                'year' => $request->year,
                'month' => $request->month,
                'income' => $income,
                'expense' => $expense,
                'net_profit' => $income - $expense,
                'status' => $request->status ?? null,
            ]);
        });

        return redirect()->route('admin.financials.show', $id);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $data = PropertyInvestment::with('property')->where('id', $id)->firstOrFail();
        $financials = PropertyFinancial::where('property_investment_id', $id)->orderBy('year')->orderBy('month')->get();

        // What "Bagikan Profit" would pay, shown in its confirm dialog.
        $previews = $financials
            ->filter(fn ($item) => $item->status === 'FINAL' && ! $item->is_distributed)
            ->mapWithKeys(fn ($item) => [$item->id => $this->distributor->preview($item)]);

        return $this->view('show', [
            'title' => $data->property->property_name . " Financials",
            'data'  => $financials,
            'id'    => $id,
            'previews' => $previews,
            'investorNames' => User::whereIn('id', $previews->flatMap(fn ($plan) => $plan['shares']->pluck('user_id')))->pluck('name', 'id'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PropertyFinancial $propertyFinancial)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id, $back)
    {
        $data = PropertyFinancial::findOrFail($id);

        if ($data->is_distributed) {
            return redirect()->route('admin.financials.show', $back)->with('error', 'Laporan yang profitnya sudah dibagikan tidak bisa diubah.');
        }

        $request->validate($this->rules($back, $data->id));

        $data->month = $request->month;
        $data->year = $request->year;
        $data->income = $request->income;
        $data->expense = $request->expense;
        $data->status = $request->status;
        $data->net_profit = $request->income - $request->expense;
        $data->save();
        return redirect()->route('admin.financials.show', $back);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id, $back)
    {
        $data = PropertyFinancial::findOrFail($id);

        if ($data->is_distributed) {
            return redirect()->route('admin.financials.show', $back)->with('error', 'Laporan yang profitnya sudah dibagikan tidak bisa dihapus.');
        }

        $data->delete();
        return redirect()->route('admin.financials.show', $back);
    }

    /**
     * Pay this month's net profit into the investors' wallets (admin decides when).
     */
    public function distribute($id, $back)
    {
        $financial = PropertyFinancial::where('property_investment_id', $back)->findOrFail($id);

        try {
            $result = $this->distributor->handle($financial);
        } catch (ProfitDistributionRejected $e) {
            return redirect()->route('admin.financials.show', $back)->with('error', $e->getMessage());
        }

        return redirect()->route('admin.financials.show', $back)->with('success', sprintf(
            'Profit Rp %s dibagikan ke %d investor.',
            number_format($result['total'], 0, ',', '.'),
            $result['investors'],
        ));
    }

    private function rules($investmentId, $ignoreId = null): array
    {
        return [
            'month' => [
                'required', 'integer', 'between:1,12',
                Rule::unique('property_financials')
                    ->where('property_investment_id', $investmentId)
                    ->where('year', request('year'))
                    ->ignore($ignoreId),
            ],
            'year' => ['required', 'integer', 'between:2000,2100'],
            'income' => ['nullable', 'numeric', 'min:0'],
            'expense' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['DRAFT', 'FINAL'])],
        ];
    }
}
