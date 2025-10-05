<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\UuidTrait;
class Order extends Model
{
    use HasFactory, UuidTrait;
    protected $fillable = ['user_id', 'product_id', 'status', 'amount', 'payment_method', 'payment_id'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
