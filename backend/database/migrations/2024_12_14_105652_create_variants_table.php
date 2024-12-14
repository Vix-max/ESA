<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVariantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('variants', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('item_id')->constrained()->onDelete('cascade'); // Foreign key for item
            $table->json('attributes'); // Store variant-specific attributes
            $table->decimal('sell_price', 10, 2); // Selling price for the variant
            $table->decimal('market_price', 10, 2); // Market price for the variant
            $table->integer('stock_amount')->default(0); // Stock amount for the variant
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('variants');
    }
}
