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
    public function index(Request $request)
    {   

        $env = \App::Environment();

        if($request->recache) {
            \Cache::forget("site-info");
        }

        $sites = \Cache::get('site-info') ?? [];
        
        if(empty($sites)) {
            $sites = DB::connection('dserv')->table('site_info')
                ->where([['siteType','like','A%'], ['siteID', '<' , 6000]])
                ->orderBy('siteID','ASC')
                ->get()
                ->toArray();

            \Cache::forever('site-info', $sites);
        }

        $array = []; 

        $excludedAws = ['70','71','72','79','81','95','96','113','117','121','124','138',"5083", "5011", "5008", "4009"];

        $aws = config("{$env}.aws");

        $args = config("{$env}.arg");

        foreach($sites as $site) {
            $id = $site->siteID;
            $type = strtolower($site->siteType);

            if(in_array($id, $excludedAws)) {
                continue;
            }

            switch ($id) {
                case in_array($id, $aws["northern luzon"]) || in_array($id, $args["northern luzon"]):
                    $prsd = "NLPRSD";
                    break;
                case in_array($id, $aws["national capital region"]) || in_array($id, $args["national capital region"]):
                    $prsd = "NCRPRSD";
                    break;
                case in_array($id, $aws["southern luzon"]) || in_array($id, $args["southern luzon"]):
                    $prsd = "SLPRSD";
                    break;
                case in_array($id, $aws["visayas"]) || in_array($id, $args["visayas"]):
                    $prsd = "VISPRSD";
                    break;
                case in_array($id, $aws["mindanao"]) || in_array($id, $args["mindanao"]):
                    $prsd = "MINPRSD";
                    break;
                default:
                    $prsd = "";
                    break;
            }

            $cachedData = \Cache::get("{$type}-{$id}");



            if(is_null($cachedData)) {
                $array[] = [
                    'siteId'   => $id, 
                    'siteName' => $site->siteName,  
                    'type'     => $type,  
                    'prsd'     => $prsd,
                    'class'    => "{$type}-{$id}", 
                    'time'     => null,  
                ];

                continue;
            }

            if(array_key_exists("category", $cachedData)) {
                $cachedData = [
                    'siteId'   => $cachedData["type"], 
                    'siteName' => $cachedData["file"],  
                    'type'     => $cachedData["category"],  
                    'prsd'     => $prsd,
                    'class'    => "{$type}-{$id}", 
                    'time'     => $cachedData["time"],  
                ];
            }

            $cachedData["prsd"] = $prsd;
            
            $array[] = $cachedData;

        } 

        $filteredAws = array_filter($array, function($aws) {
            return $aws["type"] == "aws" || (array_key_exists("category", $aws) && $aws["category"] == "aws");
        });

        $filteredArgs = array_filter($array, function($arg) {
            return $arg["type"] == "arg" || (array_key_exists("category", $arg) && $arg["category"] == "arg");
        });

        return response()->json(array_merge($filteredAws, $filteredArgs));

        // foreach($sites as $key => $site) {
        //     $category = strtolower($site->siteType);
        //     $cacheKey = $category . '-' . $site->siteID;
        //     $prsd = "";

        //     if(in_array($site->siteID, config($env.".aws")["northern luzon"]) || in_array($site->siteID, config($env.".arg")["northern luzon"])) {
        //         $prsd = "NLPRSD";
        //     }else if(in_array($site->siteID, config($env.".aws")["national capital region"]) || in_array($site->siteID, config($env.".arg")["national capital region"])) {
        //         $prsd = "NCRPRSD";
        //     }else if(in_array($site->siteID, config($env.".aws")["southern luzon"]) || in_array($site->siteID, config($env.".arg")["southern luzon"])) {
        //         $prsd = "SLPRSD";
        //     }else if(in_array($site->siteID, config($env.".aws")["visayas"]) || in_array($site->siteID, config($env.".arg")["visayas"])) {
        //         $prsd = "VISPRSD";
        //     }else if(in_array($site->siteID, config($env.".aws")["mindanao"]) || in_array($site->siteID, config($env.".arg")["mindanao"])) {
        //         $prsd = "MINPRSD";
        //     }


        //     $default = [
        //         'type'     => $category,  
        //         'siteName'     => $site->siteName,  
        //         'siteId'     => $site->siteID, 
        //         'prsd'     => $prsd, 
        //         'time'     => null,  
        //     ];

        //     $data = \Cache::get($cacheKey);

        //     if($data == null) {
        //         $tmp[] = $default;
        //         continue;
        //     }

        //     $data['prsd'] = $prsd;

        //     $tmp[] = $data;
        // } 
        // $arg = array_filter($tmp,function($d)  {
        //     return $d['type'] == 'arg';
        // });

        // $aws = array_filter($tmp,function($d) use ($awsIgnore){
        //     return $d['type'] == 'aws' && !in_array($d['siteId'], $awsIgnore);
        // });
        // dd($tmp);
        // dd(count($tmp),count($arg),count($aws));

        // return response()->json(array_merge($arg,$aws));
    }
}
