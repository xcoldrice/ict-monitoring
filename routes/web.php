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
Route::resource('/weather-stations', \App\Http\Controllers\WeatherStationController::class);


Route::get('/radar-test', function(){
    // dd(phpinfo());
    

    $ssss =    [        
                        '{"radar":"daet","file":"20220318052037.uf ","type":"uf","location":"dic","category":"selex"}'
                        // '{"radar":"bohol","file":"1860BOH20220309151000.vol","type":"vol","location":"dic"}',

                        // '{"radar":"bohol","file":"1860BOH20220309151000.uf","type":"uf","location":"dic"}',
                    ];
    foreach($ssss as $testData) {
        $message = json_decode($testData);
        (new RadarParser($message))->process();
    }


    // (new \App\Models\Parsers\RadarTransfer())->process();
    

});

Route::get('/aws-test',function(){
    $ssss = [
        '{"type":"arg","unix":1647412200,"station_id":"3001","location":"Mahaplag, Leyte"}',
        '{"type":"aws","unix":1647412200,"station_id":5017,"location":"Batac,Ilocos Norte AWS"}',
        '{"type":"aws","unix":1647487800,"station_id":5158,"location":"Tabuk, Kalinga"}'
    ];

    foreach($ssss as $data) {
        $message = json_decode($data);

        (new \App\Models\Parsers\WeatherStationParser($message))->process();

    }


});


Route::get('/db-test',function(){
    $con = DB::connection('Mactan')->select("SELECT host,max(sourcefile) as File FROM transferlist where state ='Success' and host != '192.168.30.11' GROUP BY password,host,targetdir");
    dd($con);
});