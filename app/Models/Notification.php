<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\UuidTrait;
class Notification extends Model
{
    use HasFactory, UuidTrait;
    protected $fillable = ['user_id', 'type', 'data', 'read_at'];
    protected $casts = ['data' => 'array'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
