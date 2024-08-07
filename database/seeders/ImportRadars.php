<?php

namespace Database\Seeders;

use App\Models\Radar;
use App\Models\RadarUserStatus;
use App\Models\Status;
use Illuminate\Database\Seeder;

class ImportRadars extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $env = \App::Environment();

        $radarConfigs = config($env.'.radars');

        foreach($radarConfigs as $type => $radars) {

            foreach($radars["radars"] as $radar) {

                $data = ["name" => $radar, "category" => $type];

                $radar = Radar::updateOrCreate($data, $data);

                $status = [
                    "user_id" => null,
                    "radar_id" => $radar->id,
                    "status" => $radar->name == "mosaic" ? "active" : "under_development",
                ];

                $latest = Status::where('radar_id',  $radar->id)->orderBy("created_at", "desc")->first();

                if(is_null($latest) || ($latest && is_null($latest->user_id))) {

                    Status::updateOrCreate($status, $status);
                    
                }
            }
        }
    }
}
