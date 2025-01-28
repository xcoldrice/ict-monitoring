<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RemarkUser extends Model
{
    use HasFactory;

    protected $fillable = [
        "remark_id",
        "user_id",
        "action",
        "before",
        "after"
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

}
