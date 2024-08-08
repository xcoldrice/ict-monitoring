<?php

namespace App\Http\Controllers;

use App\Models\Remark;
use Illuminate\Http\Request;

class RemarkController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $inputs = [];
            $inputs['radar_id'] = $request->radar_id;
            $inputs["title"] = $request->title ?? "remark";
            $inputs["description"] = $request->description == "null" ? NULL : $request->description;
            $inputs["priority_level"] = $request->priority_level;
    
            $remark = Remark::create($inputs);
    
            $status = $remark->status()->create([
                "user_id" => auth()->user()->id,
                "action"  => "create",
            ]);

            $response = [
                "success"        => true,
                "id"             => $remark->id,
                "radar_id"       => $remark->radar_id,
                "title"          => $remark->title,
                "description"    => $remark->description,
                "priority_level" => $remark->priority_level,
                "latest_status"  => [
                    "action" => "create",
                    "created_at" => $status->created_at,
                    "user"       => [
                        "name" => $status->user->name,
                    ]
                ],
            ];
            
            // event(new \App\Events\CreateRadarRemark($response));

            return response()->json($response);

        } catch (\Throwable $th) {

            return response()->json(["success" => false]);

        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $remark = Remark::find($id);
            if($request->type == "update") {
                $inputs                   = [];
                $inputs["title"]          = $request->title;
                $inputs['description']    = $request->description == "null" ? NULL : $request->description; 
                $inputs["priority_level"] = $request->priority_level;
                $inputs["type"]           = $request->type;
    
                $remark->update($inputs);
    
                $status = $remark->status()->create([
                    "user_id" => auth()->user()->id,
                    "action"  => $inputs["type"],
                ]);
    
                $response = [
                    "success"       => true,
                    "id"            => $remark->id,
                    "radar_id"      => $remark->radar_id,
                    "latest_status" => [
                        "action"     => "update",
                        "created_at" => $status->created_at,
                        "user"       => [
                            "name" => $status->user->name,
                        ]
                    ],
                    ...$inputs,
                ];
            }else{
                $status = $remark->status()->create([
                    "user_id" => auth()->user()->id,
                    "action" => $request->type,
                ]);

                $response = [
                    "success" => true,
                    "remark_id" => $remark->id,
                    "radar_id" => $remark->radar_id,
                    "type" => $status->action,
                ];
            }

            event(new \App\Events\UpdateRadarRemark($response));

            return response()->json($response);

        } catch (\Throwable $th) {

            return response()->json(["success" => false]);

        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
