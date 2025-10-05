<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\UuidTrait;
class Lesson extends Model
{
     use HasFactory, UuidTrait;
    protected $fillable = ['course_id', 'title', 'content_url', 'type'];
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
