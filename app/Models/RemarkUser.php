<?php

namespace App\Models;

use App\Traits\HasObserver;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RemarkUser extends Model
{
    use HasFactory, HasObserver;

    protected $fillable = [
        "remark_id",
        "user_id",
        "action",
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

}
