<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Radar;
use App\Models\RadarStatus;

class RadarController extends Controller
{
    
    public function index()
    {
        $env = \App::Environment();

        $radarConfig = config($env.'.radars');
        $tmp = [];
        if($radarConfig == null) return response()->json($tmp);

        foreach($radarConfig as $category => $radars) {

            foreach($radars['radars'] as $radar) {

                $cacheKey = $radar.'-'. $category;
                $status = self::getRadarStatus($radar,$category);
                $return = [
                            'name'     => $radar,
                            'category' => $category,
                            'data'     => \Cache::get($cacheKey) ?? (object) [],
                        ];
                $tmp[] = array_merge($return,$status);
            }
        }
        
        $tmp = self::sortByStatus($tmp);
        return response()->json($tmp);
    }

    public function store(Request $request)
    {
        try {
            $inputs = $request->all();
            $inputs['posted_by'] = auth()->user()->name;
            $inputs['status'] = (int) $inputs['status'];

            $data = [
                        'name' => $inputs['name'], 
                        'category' => $inputs['category']
                    ];

            $radar = Radar::updateOrCreate($data,$data);

            $radar->status()->create($inputs);

            $return = $radar->status()->orderBy('created_at','desc')->first();

            $response = [
                            'success'     => true,
                            'status'      => $return->status,
                            'remarks'     => $return->remarks,
                            'name'        => $inputs['name'],
                            'posted_by'   => $inputs['posted_by'],
                            'category'    => $inputs['category'],
                            'date_posted' => $return->created_at
                        ];

            event(new \App\Events\UpdateRadarStatus($response));
            return response()->json($response);

        } catch (\Throwable $th) {

            return response()->json(['success'=>false]);

        }
    }

    private function getRadarStatus($name,$category) {
        $condition = [ 'name' => $name, 'category' => $category ];

        $radar = Radar::where($condition)->first();

        if($radar) {
            $status = $radar->status()->orderBy('created_at','desc')->first();
            if($status) {
                $remarks = $status->remarks == null? '' : $status->remarks;
                $posted_by = $status->posted_by == null? '' : $status->posted_by;

                return [ 
                    'status'      => $status->status, 
                    'remarks'     => $remarks,
                    'posted_by'   => $posted_by,
                    'date_posted' => $status->created_at
                ];
            } 
        }

        return [ 'status' => 2, 'remarks' => '' ];

    }

    private function sortByStatus($radars) {
        
        $active = array_filter($radars,function($radar) { 
            return $radar['status'] == 1 && $radar['name'] != 'mosaic';
        });

        $down = array_filter($radars,function($radar){ 
            return $radar['status'] == 0 && $radar['name'] != 'mosaic'; 
        });

        $underDevelopment = array_filter($radars,function($radar){ 
            return $radar['status'] == 2 && $radar['name'] != 'mosaic'; 
        });

        $report = array_filter($radars,function($radar){ 
            return $radar['status'] == 3 && $radar['name'] != 'mosaic'; 
        });


        $mosaic = array_filter($radars,function($radar){
            return $radar['name'] == 'mosaic';
        });

        return array_merge($active, $report,$mosaic,$down,$underDevelopment);
    }


    public function logs($category,$name, $limit = null) {
        try {
            $radar = Radar::where([['name',$name],['category',$category]])->first();
            $status = $radar->status()->orderBy('created_at','asc')->get()->toArray();

            $status = array_map(function($stat){

                $text = 'Active';
                $remarks = '';
                $posted_by = $stat['posted_by'] == null? '': $stat['posted_by'];

                $date = date('m-d-Y h:i a', strtotime($stat['created_at']));

                if($stat['status'] == 2) $text = 'Under Development';

                if($stat['status'] == 3) { 
                    $text = 'Report';
                    $remarks = $stat['remarks'] == null? '': $stat['remarks'];
                }
                if($stat['status'] == 0) { 
                    $text = 'Down';
                    $remarks = $stat['remarks'] == null? '': $stat['remarks'];
                }
                

                return [
                    'date'      => $date,
                    'status'    => $text,
                    'remarks'   => $remarks,
                    'posted_by' => $posted_by,
                ];

            },$status);

            return response()->json(['success'=>true,'histories'=>$status]);
            
        } catch (\Throwable $th) {
            return response()->json(['success'=>false]);
        }

    }

}
