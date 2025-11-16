<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\UuidTrait;

class Course extends Model
{
    use HasFactory, UuidTrait;
    protected $fillable = ['title', 'description', 'is_paid', 'price', 'product_id', 'cover_image', 'duration_seconds'];
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    public function modules()
    {
        return $this->hasMany(CourseModule::class);
    }

    public function enrollments()
    {
        return $this->hasMany(CourseEnrollment::class);
    }
}
