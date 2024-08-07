<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    use HasFactory;

    protected $fillable = [
        'radar_id',
        'user_id',
        'status',
        'description'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function radar() {
        return $this->belongsTo(Radar::class);
    }

}
