<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\UuidTrait;

class Product extends Model
{
    use HasFactory, UuidTrait;
    protected $fillable = ['name', 'sku', 'version', 'checksum', 'size', 'changelog', 'description', 'category'];
    public function licenses()
    {
        return $this->hasMany(License::class);
    }
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    public function downloads()
    {
        return $this->hasMany(Download::class);
    }
    public function courses()
    {
        return $this->hasMany(Course::class);
    }
}
