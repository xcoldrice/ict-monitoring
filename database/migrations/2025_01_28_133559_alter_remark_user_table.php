<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterRemarkUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table("remark_users", function(Blueprint $table) {
            $table->string("before")->nullable()->after("action");
            $table->string("after")->nullable()->after("before");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table("remark_users", function(Blueprint $table) {
            $table->dropColumn("before");
            $table->dropColumn("after");
        });
    }
}
