<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\UuidTrait;

class HelpArticle extends Model
{
    use HasFactory, UuidTrait;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'summary',
        'content',
        'tags',
        'is_published',
        'is_popular',
        'views',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_popular' => 'boolean',
    ];

    public function getRouteKeyName(): string
    {
        // Utiliser le slug pour le binding implicite
        return 'slug';
    }
}
