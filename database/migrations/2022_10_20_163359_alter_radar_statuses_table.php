<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterRadarStatusesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('radar_statuses', function (Blueprint $table) {
            $table->string('posted_by')->nullable()->default(null)->after('remarks');
        });
        //
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('radar_statuses', function (Blueprint $table) {
            $table->dropColumn(['posted_by']);
        });
        //
    }
}
