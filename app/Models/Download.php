<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\UuidTrait;

class Download extends Model
{
    use HasFactory, UuidTrait;
    protected $fillable = ['user_id', 'product_id', 'license_id', 'ip_address', 'user_agent', 'file_version', 'timestamp'];
    public $timestamps = false; // on a déjà un champ timestamp
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function license()
    {
        return $this->belongsTo(License::class);
    }
}
