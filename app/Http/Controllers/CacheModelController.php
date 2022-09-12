<?php

namespace App\Http\Controllers;

use App\Models\CacheModel;
use Illuminate\Http\Request;
use DB;

class CacheModelController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $models = CacheModel::with('latest')->get()->map(function($query) {

            $query['status'] = $query->latest;
            unset($query['latest']);
            
            return $query;
        });

        return response()->json($models);
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
        // try {
            $inputs = $request->all();
            $response = [
                'success' => true,
                'type'    => $inputs['id']? 'update':'create',
            ];
            
            DB::transaction(function() use ($inputs, &$response){
                $model = CacheModel::updateOrCreate([
                    'id'       => $inputs['id'],
                ], $inputs);

                $model->status()->create([
                    'status'  => $inputs['status'], 
                    'remarks' => $inputs['remarks']
                ]);


                $response['data'] = $model;
                $response['data']['status']['status']  = $inputs['status'];
                $response['data']['status']['remarks'] = $inputs['remarks'];
            });

            event(new \App\Events\AddNewModel($response));


            return response()->json($response);

        // } catch (\Throwable $th) {
        //     return response()->json(['success' => false]);
        // }

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\CacheModel  $cacheModel
     * @return \Illuminate\Http\Response
     */
    public function show(CacheModel $cacheModel)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\CacheModel  $cacheModel
     * @return \Illuminate\Http\Response
     */
    public function edit(CacheModel $cacheModel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\CacheModel  $cacheModel
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, CacheModel $cacheModel)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\CacheModel  $cacheModel
     * @return \Illuminate\Http\Response
     */
    public function destroy(CacheModel $cacheModel)
    {
        //
    }
}
