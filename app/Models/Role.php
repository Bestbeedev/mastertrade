<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\UuidTrait;

class Role extends Model
{
    use HasFactory, UuidTrait;
    protected $fillable = ['name', 'permissions'];
    protected $casts = ['permissions' => 'array'];
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
