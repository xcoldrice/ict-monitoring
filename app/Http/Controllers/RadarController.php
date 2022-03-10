<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RadarController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $env = \App::Environment();

        $radars = config($env.'.radars');

        $tmp = [];
        if($radars == null) return response()->json([]);

        foreach($radars as $key => $value) {
            foreach($value['radars'] as $radar) {
                $cackeKey = $radar.'-'.$key;
                $data = \Cache::get($cackeKey) ?? [];
                $tmp[] = [
                            'name'=> $radar,
                            'category'=> $key,
                            'status' => 1,
                            'remarks' => '',
                            'data' => $data,
                ];
            }
        }
        return response()->json($tmp);
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // $radars = config();
        // dd($radars);
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
        //
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
