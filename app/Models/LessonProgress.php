<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\UuidTrait;

class LessonProgress extends Model
{
    use HasFactory, UuidTrait;

    protected $table = 'lesson_progresses';

    protected $fillable = [
        'user_id',
        'course_id',
        'lesson_id',
        'last_position_seconds',
        'seconds_watched',
        'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
