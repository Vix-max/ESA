<?php

use Illuminate\Http\Request;
use App\Http\Middleware\VerifyAuthToken;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\StockController;




// Public Routes
Route::post('/admin/login', [AuthController::class, 'adminLogin']);
Route::post('/admin/logout', [AuthController::class, 'adminLogout']);
Route::get('/getallcategories', [CategoryController::class, 'index']); // Fetching categories can be public
Route::get('/getallbrands', [BrandController::class, 'getAllBrands']);
Route::get('/getallitems', [ItemController::class, 'index']);
Route::get('/getitemdetails/{itemId}/{variantId}', [ItemController::class, 'show']);
Route::get('/items/{itemId}/variants/{variantId}/stocks', [StockController::class, 'getStockDetails']);

//Route::get('/itemstock/{id}', [StockController::class, 'getStocksByItem']);



// Protected Routes
Route::middleware([VerifyAuthToken::class])->group(function () {
    Route::post('/addcategories', [CategoryController::class, 'store']);
    Route::put('/updatecategories/{id}', [CategoryController::class, 'update']);
    Route::delete('/deletecategories/{id}', [CategoryController::class, 'destroy']);
    Route::post('/additems', [ItemController::class, 'store']);  // Now protected
    Route::post('/addbrand', [BrandController::class, 'addBrand']);
    Route::post('/additemstock', [StockController::class, 'store']);

});


