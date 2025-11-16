<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\UuidTrait;

class TicketAttachment extends Model
{
    use HasFactory, UuidTrait;

    protected $fillable = [
        'ticket_message_id',
        'path',
        'original_name',
        'mime_type',
        'size',
    ];

    public function message()
    {
        return $this->belongsTo(TicketMessage::class, 'ticket_message_id');
    }
}
