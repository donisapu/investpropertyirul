<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PropertiesController;
use App\Http\Controllers\Admin\PropertyAuctionController;
use App\Http\Controllers\Admin\PropertyConsignmentController;
use App\Http\Controllers\Admin\PropertyCrowdfundingController;
use App\Http\Controllers\Admin\PropertyInvestmentController;
use App\Http\Controllers\Admin\DeveloperController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

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

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('admin.dashboard');
    }

    return view('pages.auth.admin');
});

Route::prefix('admin')->name('admin.')->middleware(['auth', 'role:admin'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Properties Master
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
    Route::get('investment-properties/show/{id}',[PropertyInvestmentController::class,'show'])->name('investment-properties.show');
    Route::get('investment-properties/edit/{id}',[PropertyInvestmentController::class,'edit'])->name('investment-properties.edit');
    Route::post('investment-properties/store', [PropertyInvestmentController::class, 'store'])->name('investment-properties.store');
    Route::post('investment-properties/update/{id}',[PropertyInvestmentController::class,'update'])->name('investment-properties.update');
    Route::delete('investment-properties/destroy/{id}', [PropertyInvestmentController::class, 'destroy'])->name('investment-properties.destroy');
    // Consigntment
    Route::get('consignment-properties', [PropertyConsignmentController::class, 'index'])->name('consignment-properties');
    Route::get('consignment-properties/data', [PropertyConsignmentController::class, 'data'])->name('consignment-properties.data');
    Route::get('consignment-properties/create', [PropertyConsignmentController::class, 'create'])->name('consignment-properties.create');
    Route::get('consignment-properties/show/{id}',[PropertyConsignmentController::class,'show'])->name('consignment-properties.show');
    Route::get('consignment-properties/edit/{id}',[PropertyConsignmentController::class,'edit'])->name('consignment-properties.edit');
    Route::post('consignment-properties/store', [PropertyConsignmentController::class, 'store'])->name('consignment-properties.store');
    Route::post('consignment-properties/update/{id}',[PropertyConsignmentController::class,'update'])->name('consignment-properties.update');
    Route::delete('consignment-properties/destroy/{id}', [PropertyConsignmentController::class, 'destroy'])->name('consignment-properties.destroy');
    // Crowdfunding
    Route::get('crowdfunding-properties', [PropertyCrowdfundingController::class, 'index'])->name('crowdfunding-properties');
    Route::get('crowdfunding-properties/data', [PropertyCrowdfundingController::class, 'data'])->name('crowdfunding-properties.data');
    Route::get('crowdfunding-properties/create', [PropertyCrowdfundingController::class, 'create'])->name('crowdfunding-properties.create');
    Route::get('crowdfunding-properties/show/{id}',[PropertyCrowdfundingController::class,'show'])->name('crowdfunding-properties.show');
    Route::get('crowdfunding-properties/edit/{id}',[PropertyCrowdfundingController::class,'edit'])->name('crowdfunding-properties.edit');
    Route::post('crowdfunding-properties/store', [PropertyCrowdfundingController::class, 'store'])->name('crowdfunding-properties.store');
    Route::post('crowdfunding-properties/update/{id}',[PropertyCrowdfundingController::class,'update'])->name('crowdfunding-properties.update');
    Route::delete('crowdfunding-properties/destroy/{id}', [PropertyCrowdfundingController::class, 'destroy'])->name('crowdfunding-properties.destroy');
    // Auction
    Route::get('auction-properties', [PropertyAuctionController::class, 'index'])->name('auction-properties');
    Route::get('auction-properties/data', [PropertyAuctionController::class, 'data'])->name('auction-properties.data');
    Route::get('auction-properties/create', [PropertyAuctionController::class, 'create'])->name('auction-properties.create');
    Route::get('auction-properties/show/{id}',[PropertyAuctionController::class,'show'])->name('auction-properties.show');
    Route::get('auction-properties/edit/{id}',[PropertyAuctionController::class,'edit'])->name('auction-properties.edit');
    Route::post('auction-properties/store', [PropertyAuctionController::class, 'store'])->name('auction-properties.store');
    Route::post('auction-properties/update/{id}',[PropertyAuctionController::class,'update'])->name('auction-properties.update');
    Route::delete('auction-properties/destroy/{id}', [PropertyAuctionController::class, 'destroy'])->name('auction-properties.destroy');
    //Developer Master
    Route::get('developers', [DeveloperController::class, 'index'])->name('developers');
    Route::get('developers/data', [DeveloperController::class, 'data'])->name('developers.data');
    Route::get('developers/edit/{id}', [DeveloperController::class, 'edit'])->name('developers.edit');
    Route::get('developers/create', [DeveloperController::class, 'create'])->name('developers.create');
    Route::get('developers/show/{id}', [DeveloperController::class, 'show'])->name('developers.show');
    Route::get('developers/search', [DeveloperController::class, 'search'])->name('developers.search');
    Route::post('developers/store', [DeveloperController::class, 'store'])->name('developers.store');
    Route::post('developers/update/{id}', [DeveloperController::class, 'update'])->name('developers.update');
    Route::delete('developers/destroy/{id}', [DeveloperController::class, 'destroy'])->name('developers.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
