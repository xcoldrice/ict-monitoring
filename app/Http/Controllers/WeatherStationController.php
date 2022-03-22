<?php

namespace App\Http\Controllers;

use App\Models\WeatherStation;
use Illuminate\Http\Request;
use DB;
class WeatherStationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {   
        // dd(\Cache::forget('site-info'));
        $activeSites = \Cache::get('site-info') ?? [];
        if(empty($activeSites)) {
            $activeSites = DB::connection('dserv')->table('site_info')
            ->where([['siteType','like','A%'],['siteID', '<' , 6000]])
            ->orderBy('siteID','ASC')
            ->get()
            ->toArray();
            \Cache::forever('site-info',$activeSites);
        }

        $tmp = [];


        foreach($activeSites as $key => $site) {
            $category = strtolower($site->siteType);
            $cacheKey = $category . '-' . $site->siteID;
            $default = [
                        'category' => $category,  
                        'file'     => $site->siteName,  
                        'type'     => $site->siteID,  
                        'time'     => null,  
            ];

            $data = \Cache::get($cacheKey);

            if($data == null) {
                $tmp[] = $default;
                continue;
            }
            $tmp[] = $data;
        } 

        $arg = array_filter($tmp,function($d){
            return $d['category'] == 'arg';
        });

        $aws = array_filter($tmp,function($d){
            return $d['category'] == 'aws';
        });

        return response()->json(array_merge($arg,$aws));
    }
}
