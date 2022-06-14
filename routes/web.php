<?php

use Illuminate\Support\Facades\Route;
use App\Models\Parsers\RadarParser;
use App\Models\Parsers\RadarTransfer;
use Illuminate\Support\Facades\DB;
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


Route::resource('/radars', \App\Http\Controllers\RadarController::class);
Route::get('/radar/{name}/{category}/{limit?}', [\App\Http\Controllers\RadarController::class,'logs']);
Route::resource('/weather-stations', \App\Http\Controllers\WeatherStationController::class);

Auth::routes();

