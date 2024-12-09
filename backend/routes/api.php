<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Public login route
Route::post('/admin/login', [AuthController::class, 'adminLogin']);

//Logout Route
Route::post('/admin/logout', [AuthController::class, 'adminLogout']);

Route::middleware('auth:sanctum')->group(function () {
    
});

