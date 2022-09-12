<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CacheModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
    ];  

    public function status() {
        return $this->hasMany(\App\Models\CacheModelStatus::class);
    }

    public function latest() {
        return $this->hasOne(\App\Models\CacheModelStatus::class)->latest();
    }
}
