<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\UuidTrait;

class License extends Model
{
    use HasFactory, UuidTrait;
    protected $fillable = ['key', 'product_id', 'user_id', 'status', 'type', 'expiry_date', 'max_activations', 'activations_count', 'renewed_at', 'last_device_id', 'last_machine', 'last_mac_address', 'last_activated_at', 'devices'];
    protected $casts = [
        'devices' => 'array',
        'expiry_date' => 'date',
        'last_activated_at' => 'datetime',
    ];
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
