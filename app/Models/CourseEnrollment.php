<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\UuidTrait;

class CourseEnrollment extends Model
{
    use HasFactory, UuidTrait;

    protected $fillable = [
        'user_id',
        'course_id',
        'started_at',
        'completed_at',
        'progress_percent',
        'last_lesson_id',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function lastLesson()
    {
        return $this->belongsTo(Lesson::class, 'last_lesson_id');
    }
}
