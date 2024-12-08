<?php

namespace App\Providers;

use Illuminate\Support\Facades\Schema; // Add this line
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191); // Set default string length
    }

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }
}
