<?php

namespace App\Http\Controllers;

use App\Models\WeatherStation;
use Illuminate\Http\Request;

class WeatherStationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = \Cache::get('weather-station-data');
        $tmp = [];

        if(empty($data)) return response()->json($tmp);

        $arg = array_filter($data,function($d){
            return $d['category'] == 'arg';
        });
        usort($arg,function($a,$b){ return $a['type'] - $b['type']; });

        $aws = array_filter($data,function($d){
            return $d['category'] == 'aws';
        });

        usort($aws,function($a,$b){ return $a['type'] - $b['type']; });


        return response()->json(array_merge($arg,$aws));


    }

    private function sortByTime($array) {
        
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\WeatherStation  $weatherStation
     * @return \Illuminate\Http\Response
     */
    public function show(WeatherStation $weatherStation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\WeatherStation  $weatherStation
     * @return \Illuminate\Http\Response
     */
    public function edit(WeatherStation $weatherStation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\WeatherStation  $weatherStation
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, WeatherStation $weatherStation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\WeatherStation  $weatherStation
     * @return \Illuminate\Http\Response
     */
    public function destroy(WeatherStation $weatherStation)
    {
        //
    }
}
