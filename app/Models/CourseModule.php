<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\UuidTrait;

class CourseModule extends Model
{
    use HasFactory, UuidTrait;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'position',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class, 'module_id')->orderBy('position');
    }
}
