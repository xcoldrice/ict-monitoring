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
}
