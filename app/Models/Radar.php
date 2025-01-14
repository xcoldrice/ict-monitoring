<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Status;

class Radar extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
    ];

    protected $appends = [
        'status',
        'network',
        'work_station',
        'data',
        'remarks',

    ];

    public function getDataAttribute() {

        $key = "{$this->name}-{$this->category}";

        return \Cache::get($key) ?? (object) [];

    }

    private function defaultStatus($id, $type) {
        return (object) [
            "radar_id" => $id,
            "user_id" => null,
            "type" => $type,
            "status" => "under_development",
            "description" => "",
            "user" => null
        ];
    }

    public function getStatusAttribute() {
        $type = "radar";
        $status =  Status::with("user")
            ->where([['radar_id', $this->id], ['type', $type]])
            ->orderBy("created_at", "desc")
            ->first();
        
        return $status ?? $this->defaultStatus($this->id, $type);

    }

    public function getNetworkAttribute() {
        $type = "network";

        $status =  Status::with("user")
            ->where([['radar_id', $this->id], ['type', $type]])
            ->orderBy("created_at", "desc")
            ->first();

        return $status ?? $this->defaultStatus($this->id, $type);
    }

    public function getWorkStationAttribute() {
        $type = "work_station";

        $status =  Status::with("user")
            ->where([['radar_id', $this->id], ['type', $type]])
            ->orderBy("created_at", "desc")
            ->first();
        
            return $status ?? $this->defaultStatus($this->id, $type);
    }

    public function getRemarksAttribute() {
        $remarks = Remark::with("latestStatus")->where("radar_id", $this->id)->get();
        
        return $remarks->filter(function($remark) {
            return $remark->latestStatus->action != "delete";
        })->values();

    }

}
