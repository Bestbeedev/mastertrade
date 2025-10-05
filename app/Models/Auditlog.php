<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\UuidTrait;

class Auditlog extends Model
{
    use HasFactory, UuidTrait;
    public $timestamps = false;
    protected $fillable = ['user_id', 'action', 'target_type', 'target_id', 'details'];
    protected $casts = ['details' => 'array'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
