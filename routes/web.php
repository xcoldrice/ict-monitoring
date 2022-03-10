<?php

use Illuminate\Support\Facades\Route;
use App\Models\Parsers\RadarParser;
use App\Models\Parsers\RadarTransfer;

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


Route::get('/test', function(){
    // dd(phpinfo());
    

    $ssss =    [
                        '{"radar":"bohol","file":"1860BOH20220309151000.vol","type":"vol","location":"dic"}',

                        '{"radar":"bohol","file":"1860BOH20220309151000.uf","type":"uf","location":"dic"}',
                    ];
    foreach($ssss as $testData) {
        $message = json_decode($testData);
        (new RadarParser($message))->process();
    }


    // (new \App\Models\Parsers\RadarTransfer())->process();
    

});