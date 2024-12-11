<?php

use Illuminate\Http\Request;
use App\Http\Middleware\VerifyAuthToken;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController;

// Public Routes
Route::post('/admin/login', [AuthController::class, 'adminLogin']);
Route::post('/admin/logout', [AuthController::class, 'adminLogout']);
Route::get('/getallcategories', [CategoryController::class, 'index']); // Fetching categories can be public
Route::get('/getallbrands', [BrandController::class, 'getAllBrands']);

// Protected Routes
Route::middleware([VerifyAuthToken::class])->group(function () {
    Route::post('/addcategories', [CategoryController::class, 'store']);
    Route::put('/updatecategories/{id}', [CategoryController::class, 'update']);
    Route::delete('/deletecategories/{id}', [CategoryController::class, 'destroy']);
    Route::post('/addbrand', [BrandController::class, 'addBrand']);
});


