import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BreadcrumbItem } from '@/types';
import { ArrowLeft, BookOpen, HelpCircle, FileText, Eye, ChevronRight } from 'lucide-react';

function categoryLabel(category: string): string {
    if (category === 'faq') return 'FAQ';
    if (category === 'documentation') return 'Documentation';
    if (category === 'tutorial') return 'Tutoriel';
    return category || 'Général';
}

function categoryRoute(category: string): string {
    if (category === 'faq') return route('helps.faq');
    if (category === 'documentation') return route('helps.documentation');
    if (category === 'tutorial') return route('helps.tutorials');
    return route('helps');
}

function categoryIcon(category: string) {
    if (category === 'faq') return HelpCircle;
    if (category === 'documentation') return BookOpen;
    if (category === 'tutorial') return FileText;
    return HelpCircle;
}

interface HelpArticle {
    id?: string;
    title?: string;
    content?: string;
    category?: string;
    tags?: string;
    slug?: string;
    created_at?: string;
    updated_at?: string;
    views?: number;
    summary?: string;
}

interface RelatedArticle {
    id: string;
    slug: string;
    title?: string;
    category?: string;
    summary?: string;
}

export default function HelpArticlePage() {
    const { article, related = [] } = usePage().props as { article?: HelpArticle; related?: RelatedArticle[] };
    const CatIcon = categoryIcon(article?.category || '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Aide', href: route('helps') },
        { title: categoryLabel(article?.category || ''), href: categoryRoute(article?.category || '') },
        { title: article?.title || 'Article', href: route('helps.article', article?.slug) },
    ];

    const tags: string[] = (article?.tags || '')
        .toString()
        .split(',')
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Centre d'aide • ${article?.title || ''}`} />

            <div className="w-full px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8">
                {/* Colonne principale */}
                <div className="space-y-6">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour
                    </button>

                    <Card>
                        <CardHeader className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-2">
                                    <CatIcon className="h-5 w-5 text-primary" />
                                    {categoryLabel(article?.category || '')}
                                </span>
                                {article && typeof article.views === 'number' && (
                                    <span className="inline-flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        {article.views || 0} vues
                                    </span>
                                )}
                            </div>
                            <div className="space-y-2">
                                <CardTitle className="text-2xl sm:text-3xl leading-tight">
                                    {article?.title}
                                </CardTitle>
                                {article?.summary && (
                                    <CardDescription className="text-base">
                                        {article?.summary || ''}
                                    </CardDescription>
                                )}
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {tags.map((tag) => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
                                {/* Le contenu est stocké comme texte long. On l'affiche en gardant les retours à la ligne. */}
                                {String(article?.content || '')
                                    .split(/\n{2,}/)
                                    .map((block: string, idx: number) => (
                                        <p key={idx}>{block}</p>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Colonne latérale : articles liés */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Articles liés</CardTitle>
                            <CardDescription>
                                Autres contenus utiles dans cette catégorie.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {related.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Aucun article lié n'est disponible pour le moment.
                                </p>
                            )}
                            {related.map((rel: RelatedArticle) => (
                                <Link
                                    key={rel.id}
                                    href={route('helps.article', rel.slug)}
                                    className="flex items-start justify-between gap-2 py-2 px-2 rounded-md hover:bg-accent/60 transition-colors group"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className="text-[11px]">
                                                {categoryLabel(rel.category || '')}
                                            </Badge>
                                        </div>
                                        <div className="text-sm font-medium group-hover:text-primary line-clamp-2">
                                            {rel.title}
                                        </div>
                                        {rel.summary && (
                                            <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                                {rel.summary}
                                            </div>
                                        )}
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
