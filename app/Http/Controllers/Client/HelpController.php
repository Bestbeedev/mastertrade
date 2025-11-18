<?php

namespace App\Http\Controllers\Client;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\HelpArticle;

class HelpController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $popular = HelpArticle::where('is_published', true)
            ->orderByDesc('is_popular')
            ->orderByDesc('views')
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'slug', 'category', 'summary', 'views']);

        return Inertia::render('client/help', [
            'popularArticles' => $popular,
        ]);
    }

    public function faq()
    {
        $articles = HelpArticle::where('category', 'faq')
            ->where('is_published', true)
            ->orderBy('title')
            ->get();

        return Inertia::render('client/help-faq', [
            'articles' => $articles,
        ]);
    }

    public function documentation()
    {
        $articles = HelpArticle::where('category', 'documentation')
            ->where('is_published', true)
            ->orderBy('title')
            ->get();

        return Inertia::render('client/help-documentation', [
            'articles' => $articles,
        ]);
    }

    public function tutorials()
    {
        $articles = HelpArticle::where('category', 'tutorial')
            ->where('is_published', true)
            ->orderBy('title')
            ->get();

        return Inertia::render('client/help-tutorials', [
            'articles' => $articles,
        ]);
    }

    public function article(HelpArticle $article)
    {
        if ($article->is_published) {
            $article->increment('views');
        }

        $related = HelpArticle::where('category', $article->category)
            ->where('is_published', true)
            ->where('id', '!=', $article->id)
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'slug', 'category', 'summary']);

        return Inertia::render('client/help-article', [
            'article' => $article,
            'related' => $related,
        ]);
    }

    public function search(Request $request)
    {
        $q = trim((string) $request->input('q', ''));

        $results = collect();
        if ($q !== '') {
            $results = HelpArticle::where('is_published', true)
                ->where(function ($query) use ($q) {
                    $query->where('title', 'like', "%{$q}%")
                        ->orWhere('summary', 'like', "%{$q}%")
                        ->orWhere('content', 'like', "%{$q}%")
                        ->orWhere('tags', 'like', "%{$q}%");
                })
                ->latest()
                ->take(50)
                ->get(['id', 'title', 'slug', 'category', 'summary', 'views']);
        }

        return Inertia::render('client/help-search', [
            'results' => $results,
            'q' => $q,
        ]);
    }
}
