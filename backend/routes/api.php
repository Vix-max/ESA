<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;

// Public login route
Route::post('/admin/login', [AuthController::class, 'adminLogin']);

//Logout Route
Route::post('/admin/logout', [AuthController::class, 'adminLogout']);

//Category Routes


Route::get('/getallcategories', [CategoryController::class, 'index']);
Route::post('/addcategories', [CategoryController::class, 'store']);
Route::put('/updatecategories/{id}', [CategoryController::class, 'update']);
Route::delete('/deletecategories/{id}', [CategoryController::class, 'destroy']);


Route::middleware('auth:sanctum')->group(function () {
    
});

