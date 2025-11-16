<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\UuidTrait;

class Ticket extends Model
{

    use HasFactory, UuidTrait;
    protected $fillable = ['user_id', 'license_id', 'order_id', 'subject', 'message', 'status', 'priority', 'category'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function license()
    {
        return $this->belongsTo(License::class);
    }
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
    public function messages()
    {
        return $this->hasMany(TicketMessage::class);
    }
}
