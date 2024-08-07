<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RadarStatus extends Model
{
    use HasFactory;

    protected $fillable = [
            'radar_id',
            'user_id',
            'status',
            'description',
    ];
}
