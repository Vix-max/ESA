<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAverageCostToVariantsTable extends Migration
{
    public function up()
    {
        Schema::table('variants', function (Blueprint $table) {
            $table->decimal('average_cost', 10, 2)->default(0)->after('stock_amount');
        });
    }

    public function down()
    {
        Schema::table('variants', function (Blueprint $table) {
            $table->dropColumn('average_cost');
        });
    }
}
