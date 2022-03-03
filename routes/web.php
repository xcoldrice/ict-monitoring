<?php

use Illuminate\Support\Facades\Route;
use Redis;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [\App\Http\Controllers\DashboardController::class,'index']);

Route::group(['prefix'=>'/react'],function(){
    Route::get('/{any?}', [\App\Http\Controllers\DashboardController::class,'index']);
});


Route::get('/test', function(){
    $redis = Redis::connection();
    dd($redis);
    Redis::psubscribe(['WEATHER-STATION'],function($message,$channel){
        var_dump($message);
        // (new RadarParser(json_decode($message)))->process();
    });
    
});