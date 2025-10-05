<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\UuidTrait;

class License extends Model
{
    use HasFactory, UuidTrait;
    protected $fillable = ['key', 'product_id', 'user_id', 'status', 'type', 'expiry_date', 'max_activations', 'activations_count', 'renewed_at'];
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function downloads()
    {
        return $this->hasMany(Download::class);
    }
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
