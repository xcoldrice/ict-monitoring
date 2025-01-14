<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Radar;
use App\Models\Status;

class RadarController extends Controller
{
    
    public function index()
    {
        $radars = self::sortByStatus(Radar::all());

        return response()->json($radars);
    }

    public function store(Request $request)
    {
        $userId = auth()->user()->id;

        try {

            $latestStatus = Status::where("radar_id", $request->radar_id)
                ->orderBy("created_at", "desc")->first();

            $latestStatus->load(["radar", "user"]);


            $response = [
                "name"        => $latestStatus->radar->name,
                "category"    => $latestStatus->radar->category,
                "type"        => $request->type,
                "status"      => $request->status,
                "description" => $request->description == "null" ? NULL : $request->description,
            ];
            
            if($latestStatus->status != $response["status"] || $latestStatus->description != $response["description"]) {
                
                $status = Status::create(array_merge([
                    "radar_id"    => $request->radar_id,
                    "user_id"     => $userId,
                ], $response));

                $status->load("user");
                $response["radar_id"]    = $request->radar_id;
                $response["type"]        = $request->type;
                $response["status"]      = $status->status;
                $response["description"] = $status->description;
                $response["created_at"]  = $status->created_at;
                $response["user"]        = $status->user;
            }

            $response["created_at"]  = $latestStatus->created_at;
            $response["user"]        = $latestStatus->user == NULL ? (object)[ 'name' => "admin"] : $latestStatus->user;
            $response["success"]     = true;

            event(new \App\Events\UpdateRadarStatus($response));

            return response()->json($response);

        } catch (\Throwable $th) {

            return response()->json(['success' => false]);
            
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

    private function sortByStatus($collection) {
        $merged = collect();

        $merged = $merged->merge(
            $collection->filter(function($col) {
                
                return $col->status->status == "active" && $col->name != "mosaic";

            })->values()
        );
        
        $merged = $merged->merge( 
            $collection->filter(function($col) {

                return $col->status->status == "warning" && $col->name != "mosaic";

            })->values()
        );

        $merged = $merged->merge(
            $collection->filter(function($col) {

                return $col->name == "mosaic" && $col->category == "mosaic";

            })->values()
        );

        $merged = $merged->merge( 
            $collection->filter(function($col) {

                return $col->status->status == "down" && $col->name != "mosaic";

            })->values()
        );

        $merged = $merged->merge(
            $collection->filter(function($col) {

                return $col->status->status == "under_development" && $col->name != "mosaic";

            })->values()
        );



        return $merged;
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
