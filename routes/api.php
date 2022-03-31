<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/



Route::get('/reload', function(){
    event(new \App\Events\TriggerReload(true));
    return 'success';
});

Route::get('/recache/site-info',function() {
    Cache::forget('site-info');
    return 'success';
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
