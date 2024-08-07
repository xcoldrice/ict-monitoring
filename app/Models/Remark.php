<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Remark extends Model
{
    use HasFactory;

    protected $fillable = [
        'radar_id',
        'title',
        'description',
        'priority_level',
    ];

    public function status() {
        return $this->hasMany(RemarkUser::class);
    }

    public function latestStatus() {
        return $this->hasOne(RemarkUser::class)->with("user")->latestOfMany();
    }

}
