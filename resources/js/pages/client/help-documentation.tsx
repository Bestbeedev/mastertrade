import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbItem } from '@/types';
import { useMemo, useState } from 'react';
import { Search, BookOpen, ChevronRight } from 'lucide-react';

export default function HelpDocumentation() {
    const { articles = [] } = usePage().props as any;
    const [query, setQuery] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Aide', href: route('helps') },
        { title: 'Documentation', href: route('helps.documentation') },
    ];

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return articles as any[];
        return (articles as any[]).filter((a) => {
            const hay = [a.title, a.summary, a.content, a.tags]
                .map((v) => (v ?? '').toString().toLowerCase())
                .join(' ');
            return hay.includes(q);
        });
    }, [articles, query]);

    const getPreview = (article: any): string => {
        const base = ((article.summary || article.content || '') as string).toString().trim();
        if (!base) return '';
        return base.length > 260 ? base.slice(0, 260) + '…' : base;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Centre d'aide • Documentation" />

            <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <BookOpen className="h-7 w-7 text-primary" />
                            Documentation
                        </h1>
                        <p className="text-muted-foreground mt-2 max-w-2xl">
                            Guides détaillés, procédures et manuels d'utilisation de la plateforme Mastertrade.
                        </p>
                    </div>
                    <div className="w-full md:w-80 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher dans la documentation..."
                            className="pl-9"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Articles de documentation</CardTitle>
                        <CardDescription>
                            Parcourez les guides d'utilisation et les procédures détaillées.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="divide-y">
                        {(filtered as any[]).length === 0 && (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                                Aucun article de documentation ne correspond à votre recherche.
                            </div>
                        )}
                        {(filtered as any[]).map((article) => (
                            <Link
                                key={article.id}
                                href={route('helps.article', article.slug)}
                                className="block py-4 px-1 hover:bg-accent/40 rounded-md transition-colors group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className="text-xs">Documentation</Badge>
                                            {typeof article.views === 'number' && article.views > 0 && (
                                                <span className="text-[11px] text-muted-foreground">{article.views} vues</span>
                                            )}
                                        </div>
                                        <h2 className="font-medium text-base group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h2>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                            {getPreview(article)}
                                        </p>
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
