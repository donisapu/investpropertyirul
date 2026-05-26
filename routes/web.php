<?php

use App\Http\Controllers\Admin\CampaignController;
use App\Http\Controllers\Admin\CrowdfundingFinancialsController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DeveloperController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\PropertiesController;
use App\Http\Controllers\Admin\PropertyAuctionController;
use App\Http\Controllers\Admin\PropertyConsignmentController;
use App\Http\Controllers\Admin\PropertyCrowdfundingController;
use App\Http\Controllers\Admin\PropertyFinancialsController;
use App\Http\Controllers\Admin\PropertyInvestmentController;
use App\Http\Controllers\Admin\SellRequestController;
use App\Http\Controllers\Admin\VillaController;
use App\Http\Controllers\Admin\WebsiteSettingController;
use App\Http\Controllers\PublicInvestmentController;
use App\Http\Controllers\PublicPropertyConsignmentController;
use App\Http\Controllers\PublicCrowdfundingController;
use App\Http\Controllers\AuctionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicProjectController;
use App\Http\Controllers\PublicPropertyController;
use App\Http\Controllers\User\BidController;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\user\PaymentController;
use App\Http\Controllers\User\PortfolioController;
use App\Http\Controllers\User\TransactionController;
use App\Models\WebsiteSetting;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    $user = $request->user();

    return redirect($user->redirectTo());
})->middleware(['auth', 'signed'])->name('verification.verify');
Route::get('/', function () {
    $settings = WebsiteSetting::getSettings();
    return Inertia::render('Welcome', [
        'settings' => $settings,
        'villa' => \App\Models\Properties::where('property_name', 'Nusa Dua Ocean Breeze')->first(),
        'laravelVersion' => Illuminate\Foundation\Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Public villa detail (example)
Route::get('/villa/{slug}', [VillaController::class, 'show'])->name('villa.show');

Route::get('/properties/{property}', [PublicPropertyController::class, 'show'])->name('property.show')->where('property', '[0-9]+');
Route::get('/projects/{slug}', [PublicProjectController::class, 'show'])->name('project.show');
Route::get('/investments', [PublicInvestmentController::class, 'index'])->name('investments.index');
Route::get('/investments/{id}', [PublicInvestmentController::class, 'show'])->name('investments.show')->where('id', '[0-9]+');
Route::get('/investments/purchase/{id}', [PublicInvestmentController::class, 'purchase'])->name('investments.purchase')->where('id', '[0-9]+');
Route::get('/investments/sell/{id}', [PublicInvestmentController::class, 'sell'])->name('investments.sell')->where('id', '[0-9]+');

Route::get('/property-for-sale', [PublicPropertyConsignmentController::class, 'index'])->name('property-for-sale.index');
Route::get('/property-for-sale/{id}', [PublicPropertyConsignmentController::class, 'show'])->name('property-for-sale.show')->where('id', '[0-9]+');

Route::get('/crowdfunding', [PublicCrowdfundingController::class, 'index'])->name('crowdfunding.index');
Route::get('/crowdfunding/project',[PublicCrowdfundingController::class,'project'])->name('crowdfunding.project');
Route::get('/crowdfunding/{id}', [PublicCrowdfundingController::class, 'show'])->name('crowdfunding.show');
Route::get('/crowdfunding/purchase/{id}', [PublicCrowdfundingController::class, 'purchase'])->name('crowdfunding.purchase');

Route::get('/auctions', [AuctionController::class, 'index'])->name('auctions.index');
Route::get('/auctions/{id}', [AuctionController::class, 'show'])->name('auctions.show');

Route::get('/how-to-invest', function () {
    $settings = WebsiteSetting::getSettings();
    return Inertia::render('HowToInvest', ['settings' => $settings]);
})->name('how-to-invest');

Route::post('/xendit/webhook', [PaymentController::class, 'callback']);

Route::prefix('admin')->name('admin.')->middleware(['auth', 'role:admin'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Property
    Route::get('properties', [PropertiesController::class, 'index'])->name('properties');
    Route::get('properties/data', [PropertiesController::class, 'data'])->name('properties.data');
    Route::get('properties/edit/{id}', [PropertiesController::class, 'edit'])->name('properties.edit');
    Route::get('properties/create', [PropertiesController::class, 'create'])->name('properties.create');
    Route::get('properties/show/{id}', [PropertiesController::class, 'show'])->name('properties.show');
    Route::get('properties/search', [PropertiesController::class, 'search'])->name('properties.search');
    Route::post('properties/store', [PropertiesController::class, 'store'])->name('properties.store');
    Route::post('properties/update/{id}', [PropertiesController::class, 'update'])->name('properties.update');
    Route::delete('properties/destroy/{id}', [PropertiesController::class, 'destroy'])->name('properties.destroy');
    Route::delete('properties-image/{id}', [PropertiesController::class, 'deleteImage']);
    Route::delete('properties-document/{id}', [PropertiesController::class, 'deleteDocument']);

    // Investment
    Route::get('investment-properties', [PropertyInvestmentController::class, 'index'])->name('investment-properties');
    Route::get('investment-properties/data', [PropertyInvestmentController::class, 'data'])->name('investment-properties.data');
    Route::get('investment-properties/create', [PropertyInvestmentController::class, 'create'])->name('investment-properties.create');
    Route::get('investment-properties/show/{id}', [PropertyInvestmentController::class, 'show'])->name('investment-properties.show');
    Route::get('investment-properties/edit/{id}', [PropertyInvestmentController::class, 'edit'])->name('investment-properties.edit');
    Route::post('investment-properties/store', [PropertyInvestmentController::class, 'store'])->name('investment-properties.store');
    Route::post('investment-properties/update/{id}', [PropertyInvestmentController::class, 'update'])->name('investment-properties.update');
    Route::delete('investment-properties/destroy/{id}', [PropertyInvestmentController::class, 'destroy'])->name('investment-properties.destroy');

    // Consigntment
    Route::get('consignment-properties', [PropertyConsignmentController::class, 'index'])->name('consignment-properties');
    Route::get('consignment-properties/data', [PropertyConsignmentController::class, 'data'])->name('consignment-properties.data');
    Route::get('consignment-properties/create', [PropertyConsignmentController::class, 'create'])->name('consignment-properties.create');
    Route::get('consignment-properties/show/{id}', [PropertyConsignmentController::class, 'show'])->name('consignment-properties.show');
    Route::get('consignment-properties/edit/{id}', [PropertyConsignmentController::class, 'edit'])->name('consignment-properties.edit');
    Route::post('consignment-properties/store', [PropertyConsignmentController::class, 'store'])->name('consignment-properties.store');
    Route::post('consignment-properties/update/{id}', [PropertyConsignmentController::class, 'update'])->name('consignment-properties.update');
    Route::delete('consignment-properties/destroy/{id}', [PropertyConsignmentController::class, 'destroy'])->name('consignment-properties.destroy');

    // Crowdfunding
    Route::get('crowdfunding-properties', [PropertyCrowdfundingController::class, 'index'])->name('crowdfunding-properties');
    Route::get('crowdfunding-properties/data', [PropertyCrowdfundingController::class, 'data'])->name('crowdfunding-properties.data');
    Route::get('crowdfunding-properties/create', [PropertyCrowdfundingController::class, 'create'])->name('crowdfunding-properties.create');
    Route::get('crowdfunding-properties/show/{id}', [PropertyCrowdfundingController::class, 'show'])->name('crowdfunding-properties.show');
    Route::get('crowdfunding-properties/edit/{id}', [PropertyCrowdfundingController::class, 'edit'])->name('crowdfunding-properties.edit');
    Route::post('crowdfunding-properties/store', [PropertyCrowdfundingController::class, 'store'])->name('crowdfunding-properties.store');
    Route::post('crowdfunding-properties/update/{id}', [PropertyCrowdfundingController::class, 'update'])->name('crowdfunding-properties.update');
    Route::delete('crowdfunding-properties/destroy/{id}', [PropertyCrowdfundingController::class, 'destroy'])->name('crowdfunding-properties.destroy');

    // Auction
    Route::get('auction-properties', [PropertyAuctionController::class, 'index'])->name('auction-properties');
    Route::get('auction-properties/data', [PropertyAuctionController::class, 'data'])->name('auction-properties.data');
    Route::get('auction-properties/create', [PropertyAuctionController::class, 'create'])->name('auction-properties.create');
    Route::get('auction-properties/show/{id}', [PropertyAuctionController::class, 'show'])->name('auction-properties.show');
    Route::get('auction-properties/edit/{id}', [PropertyAuctionController::class, 'edit'])->name('auction-properties.edit');
    Route::post('auction-properties/store', [PropertyAuctionController::class, 'store'])->name('auction-properties.store');
    Route::post('auction-properties/update/{id}', [PropertyAuctionController::class, 'update'])->name('auction-properties.update');
    Route::delete('auction-properties/destroy/{id}', [PropertyAuctionController::class, 'destroy'])->name('auction-properties.destroy');

    // Developer Master
    Route::get('developers', [DeveloperController::class, 'index'])->name('developers');
    Route::get('developers/data', [DeveloperController::class, 'data'])->name('developers.data');
    Route::get('developers/edit/{id}', [DeveloperController::class, 'edit'])->name('developers.edit');
    Route::get('developers/create', [DeveloperController::class, 'create'])->name('developers.create');
    Route::get('developers/show/{id}', [DeveloperController::class, 'show'])->name('developers.show');
    Route::get('developers/search', [DeveloperController::class, 'search'])->name('developers.search');
    Route::post('developers/store', [DeveloperController::class, 'store'])->name('developers.store');
    Route::post('developers/update/{id}', [DeveloperController::class, 'update'])->name('developers.update');
    Route::delete('developers/destroy/{id}', [DeveloperController::class, 'destroy'])->name('developers.destroy');

    // Campaign Master
    Route::get('campaigns', [CampaignController::class, 'index'])->name('campaigns');
    Route::get('campaigns/data', [CampaignController::class, 'data'])->name('campaigns.data');
    Route::get('campaigns/edit/{id}', [CampaignController::class, 'edit'])->name('campaigns.edit');
    Route::get('campaigns/create', [CampaignController::class, 'create'])->name('campaigns.create');
    Route::get('campaigns/show/{id}', [CampaignController::class, 'show'])->name('campaigns.show');
    Route::get('campaigns/search', [CampaignController::class, 'search'])->name('campaigns.search');
    Route::post('campaigns/store', [CampaignController::class, 'store'])->name('campaigns.store');
    Route::post('campaigns/update/{id}', [CampaignController::class, 'update'])->name('campaigns.update');
    Route::delete('campaigns/destroy/{id}', [CampaignController::class, 'destroy'])->name('campaigns.destroy');
    Route::put('{id}/publish', [CampaignController::class, 'publish'])->name('campaigns.publish');
    Route::put('{id}/activate', [CampaignController::class, 'activate'])->name('campaigns.activate');
    Route::put('{id}/deactivate', [CampaignController::class, 'deactivate'])->name('campaigns.deactivate');

    //Investment Financials
    Route::get('financials', [PropertyFinancialsController::class, 'index'])->name('financials');
    Route::get('financials/data', [PropertyFinancialsController::class, 'data'])->name('financials.data');
    Route::get('financials/show/{id}', [PropertyFinancialsController::class, 'show'])->name('financials.show');
    Route::post('financials/store/{id}', [PropertyFinancialsController::class, 'store'])->name('financials.store');
    Route::post('financials/update/{id}/{back}', [PropertyFinancialsController::class, 'update'])->name('financials.update');
    Route::get('financials/delete/{id}/{back}', [PropertyFinancialsController::class, 'destroy'])->name('financials.destroy');

    // Crowdfunding Financials
    Route::get('cw-financials', [CrowdfundingFinancialsController::class, 'index'])->name('cw_financials');
    Route::get('cw-financials/data', [CrowdfundingFinancialsController::class, 'data'])->name('cw_financials.data');
    Route::get('cw-financials/show/{id}', [CrowdfundingFinancialsController::class, 'show'])->name('cw_financials.show');
    Route::post('cw-financials/store/{id}', [CrowdfundingFinancialsController::class, 'store'])->name('cw_financials.store');
    Route::post('cw-financials/update/{id}/{back}', [CrowdfundingFinancialsController::class, 'update'])->name('cw_financials.update');
    Route::get('cw-financials/delete/{id}/{back}', [CrowdfundingFinancialsController::class, 'destroy'])->name('cw_financials.destroy');

    // Lot Sell Management
    Route::get('sell-request',[SellRequestController::class,'index'])->name('sell-request');
    Route::get('sell-request/data',[SellRequestController::class,'data'])->name('sell-request.data');
    Route::get('sell-request/accept/{id}',[SellRequestController::class,'accept'])->name('sell-request.accept');
    Route::get('sell-request/decline/{id}',[SellRequestController::class,'decline'])->name('sell-request.decline');

    // Website Settings
    Route::get('/website-settings', [WebsiteSettingController::class, 'edit'])->name('website-settings.edit');
    Route::put('/website-settings', [WebsiteSettingController::class, 'update'])->name('website-settings.update');

    // Profile
    Route::get('profile', [AdminProfileController::class, 'index'])->name('profile');
    Route::post('profile.update/{id}', [AdminProfileController::class, 'update'])->name('profile.update');
});

Route::prefix('user')->name('user.')->middleware(['auth', 'role:user', 'verified'])->group(function () {
    // Completion
    Route::get('/email-verification', [RegisteredUserController::class, 'email'])->name('email.verification');
    Route::get('/email-verify', [RegisteredUserController::class, 'email_verify'])->name('email.verify');
    Route::get('/complete-profile', [RegisteredUserController::class, 'profile'])->name('complete.profile');
    Route::post('/update-profile', [RegisteredUserController::class, 'profile_update'])->name('update.profile');
    Route::get('/user-profile', [ProfileController::class, 'index'])->name('profile');

    // Dashboard
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
    Route::get('/portfolio', [PortfolioController::class, 'index'])->name('portfolio');
    Route::get('/bid', [BidController::class, 'index'])->name('bid');
    Route::get('/transaction', [TransactionController::class, 'index'])->name('transaction');

    // Payment
    Route::post('payment/investment/{id}', [PaymentController::class, 'payInvestment'])->name('payment.investment');
    Route::post('payment/crowdfunding/{id}', [PaymentController::class, 'payCrowdfunding'])->name('payment.crowdfunding');

    // Sell
    Route::post('sell/investment/id/{id}',[PaymentController::class,'sellInvestment'])->name('sell.investment');
});


require __DIR__ . '/auth.php';
