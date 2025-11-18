import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { BreadcrumbItem } from '@/types';
import { useState } from 'react';
import { Search, HelpCircle, ChevronRight } from 'lucide-react';

function categoryLabel(category: string): string {
    if (category === 'faq') return 'FAQ';
    if (category === 'documentation') return 'Documentation';
    if (category === 'tutorial') return 'Tutoriel';
    return category || 'Général';
}

export default function HelpSearchPage() {
    const { results = [], q = '' } = usePage().props as any;
    const [query, setQuery] = useState<string>((q ?? '').toString());

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Aide', href: route('helps') },
        { title: 'Recherche', href: route('helps.search', { q: query || undefined }) },
    ];

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const value = query.trim();
        router.get(route('helps.search'), { q: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const effectiveResults: any[] = Array.isArray(results) ? results : [];
    const hasQuery = (q ?? '').toString().trim() !== '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Centre d'aide • Recherche" />

            <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div className="max-w-2xl">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <HelpCircle className="h-7 w-7 text-primary" />
                        Rechercher dans l'aide
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Recherchez dans toutes les FAQ, documentations et tutoriels.
                    </p>
                </div>

                <form onSubmit={onSubmit} className="max-w-2xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Mot-clé, fonctionnalité, erreur..."
                            className="pl-9"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </form>

                <Card>
                    <CardHeader>
                        <CardTitle>Résultats</CardTitle>
                        <CardDescription>
                            {hasQuery
                                ? effectiveResults.length === 0
                                    ? `Aucun résultat pour "${(q ?? '').toString()}".`
                                    : `${effectiveResults.length} résultat(s) pour "${(q ?? '').toString()}".`
                                : 'Saisissez un mot-clé pour lancer une recherche.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="divide-y">
                        {hasQuery && effectiveResults.length === 0 && (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                                Essayez d'autres mots-clés ou vérifiez l'orthographe.
                            </div>
                        )}
                        {effectiveResults.map((article: any) => (
                            <Link
                                key={article.id}
                                href={route('helps.article', article.slug)}
                                className="block py-4 px-1 hover:bg-accent/40 rounded-md transition-colors group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className="text-xs">
                                                {categoryLabel(article.category)}
                                            </Badge>
                                            {typeof article.views === 'number' && article.views > 0 && (
                                                <span className="text-[11px] text-muted-foreground">{article.views} vues</span>
                                            )}
                                        </div>
                                        <h2 className="font-medium text-base group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h2>
                                        {article.summary && (
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                {article.summary}
                                            </p>
                                        )}
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
