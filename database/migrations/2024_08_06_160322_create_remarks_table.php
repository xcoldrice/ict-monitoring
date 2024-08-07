<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRemarksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('remarks', function (Blueprint $table) {
            $table->id();
            $table->foreignId("radar_id");
            $table->string("title");
            $table->text("description")->nullable();
            $table->enum("priority_level", ["low","high"]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('remarks');
    }
}
