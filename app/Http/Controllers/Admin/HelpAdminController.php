<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\HelpArticle;
use Illuminate\Support\Str;

class HelpAdminController extends Controller
{
    public function index(Request $request)
    {
        $q = (string) $request->input('q', '');
        $category = (string) $request->input('category', '');
        $status = (string) $request->input('status', '');

        $articlesQuery = HelpArticle::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($s) use ($q) {
                    $s->where('title', 'like', "%$q%")
                        ->orWhere('summary', 'like', "%$q%")
                        ->orWhere('content', 'like', "%$q%")
                        ->orWhere('tags', 'like', "%$q%");
                });
            })
            ->when($category !== '' && $category !== 'all', function ($query) use ($category) {
                $query->where('category', $category);
            })
            ->when($status !== '' && $status !== 'all', function ($query) use ($status) {
                if ($status === 'published') {
                    $query->where('is_published', true);
                } elseif ($status === 'draft') {
                    $query->where('is_published', false);
                }
            })
            ->orderByDesc('created_at')
            ->take(200);

        $articles = $articlesQuery->get([
            'id',
            'title',
            'slug',
            'category',
            'summary',
            'content',
            'tags',
            'is_published',
            'is_popular',
            'views',
            'created_at',
        ]);

        return Inertia::render('admin/help-articles', [
            'articles' => $articles,
            'filters' => [
                'q' => $q,
                'category' => $category,
                'status' => $status,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:help_articles,slug'],
            'category' => ['required', 'string', 'max:50'],
            'summary' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'tags' => ['nullable', 'string', 'max:255'],
            'is_published' => ['nullable', 'boolean'],
            'is_popular' => ['nullable', 'boolean'],
        ]);

        $article = new HelpArticle();
        $article->title = $data['title'];
        $article->slug = $data['slug'] ?? $this->generateUniqueSlug($data['title']);
        $article->category = $data['category'];
        $article->summary = $data['summary'] ?? null;
        $article->content = $data['content'];
        $article->tags = $data['tags'] ?? null;
        $article->is_published = (bool) ($data['is_published'] ?? false);
        $article->is_popular = (bool) ($data['is_popular'] ?? false);
        $article->views = 0;
        $article->save();

        return back()->with('success', 'Article d\'aide créé');
    }

    public function update(Request $request, HelpArticle $article)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:help_articles,slug,' . $article->id . ',id'],
            'category' => ['required', 'string', 'max:50'],
            'summary' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'tags' => ['nullable', 'string', 'max:255'],
            'is_published' => ['nullable', 'boolean'],
            'is_popular' => ['nullable', 'boolean'],
        ]);

        $article->title = $data['title'];
        $article->slug = $data['slug'] ?? $this->generateUniqueSlug($data['title'], $article->id);
        $article->category = $data['category'];
        $article->summary = $data['summary'] ?? null;
        $article->content = $data['content'];
        $article->tags = $data['tags'] ?? null;
        $article->is_published = (bool) ($data['is_published'] ?? false);
        $article->is_popular = (bool) ($data['is_popular'] ?? false);
        $article->save();

        return back()->with('success', 'Article d\'aide mis à jour');
    }

    public function destroy(HelpArticle $article)
    {
        $article->delete();
        return back()->with('success', 'Article d\'aide supprimé');
    }

    protected function generateUniqueSlug(string $title, ?string $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'article';
        $slug = $base;
        $i = 2;

        while ($this->slugExists($slug, $ignoreId)) {
            $slug = $base . '-' . $i;
            $i++;
        }

        return $slug;
    }

    protected function slugExists(string $slug, ?string $ignoreId = null): bool
    {
        return HelpArticle::where('slug', $slug)
            ->when($ignoreId, function ($query) use ($ignoreId) {
                $query->where('id', '!=', $ignoreId);
            })
            ->exists();
    }
}
