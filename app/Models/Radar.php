<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Status;
use App\Traits\HasObserver;

class Radar extends Model
{
    use HasFactory, HasObserver;

    protected $fillable = [
        'name',
        'category',
    ];

    protected $appends = [
        'status',
        'data',
        'remarks',

    ];

    public function getDataAttribute() {

        $key = "{$this->name}-{$this->category}";

        return \Cache::get($key) ?? (object) [];

    }

    public function getStatusAttribute() {

        $status =  Status::with("user")->where('radar_id', $this->id)->orderBy("created_at", "desc")->first();
        
        return $status;
    }

    public function getRemarksAttribute() {
        $remarks = Remark::with("latestStatus")->where("radar_id", $this->id)->get();
        
        return $remarks->filter(function($remark) {
            return $remark->latestStatus->action != "delete";
        })->values();

    }

}
