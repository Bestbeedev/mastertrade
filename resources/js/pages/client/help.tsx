import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Search, HelpCircle, BookOpen, MessageCircle, Phone, FileText, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { route } from 'ziggy-js';

export default function Help() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Aide',
            href: route('helps'),
        },
    ];

    const [searchQuery, setSearchQuery] = useState('');

    const { popularArticles: serverPopular = [] } = usePage().props as any;
    const popularArticles = Array.isArray(serverPopular) ? serverPopular : [];

    const helpCategories = [
        {
            icon: BookOpen,
            title: "Documentation",
            description: "Guides détaillés et manuels d'utilisation complets",
            link: route('helps.documentation'),
            color: "text-blue-600 dark:text-blue-400"
        },
        {
            icon: MessageCircle,
            title: "FAQ",
            description: "Réponses aux questions les plus fréquentes",
            link: route('helps.faq'),
            color: "text-green-600 dark:text-green-400"
        },
        {
            icon: FileText,
            title: "Tutoriels",
            description: "Vidéos et guides pas à pas interactifs",
            link: route('helps.tutorials'),
            color: "text-purple-600 dark:text-purple-400"
        },
    ];

    const categoryLabel = (category: string) => {
        if (category === 'faq') return 'FAQ';
        if (category === 'documentation') return 'Documentation';
        if (category === 'tutorial') return 'Tutoriel';
        return category || 'Général';
    };

    const contactMethods = [
        {
            icon: MessageCircle,
            title: "Chat en direct",
            description: "Disponible 24h/24, 7j/7",
            action: "Démarrer une conversation",
            color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
            
        },
        {
            icon: Phone,
            title: "Support téléphonique",
            description: "Lun-Ven: 9h-18h",
            action: "Nous appeler",
            color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
        },
        {
            icon: HelpCircle,
            title: "Ticket de support",
            description: "Réponse sous 24h",
            action: "Ouvrir un ticket",
            color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Centre d'Aide" />

            {/* En-tête avec recherche */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border-b">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Comment pouvons-nous vous aider ?</h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Trouvez des réponses à vos questions dans notre base de connaissances complète
                    </p>

                    <form
                        className="relative max-w-2xl mx-auto"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const q = searchQuery.trim();
                            if (!q) return;
                            router.get(route('helps.search'), { q });
                        }}
                    >
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Rechercher dans l'aide..."
                            className="w-full pl-12 pr-4 py-6 text-lg border-2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
                {/* Catégories d'aide */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {helpCategories.map((category, index) => (
                        <Card key={index} className="group hover:shadow-lg transition-all">
                            <CardHeader>
                                <div className={`p-3 rounded-lg w-fit mb-4 ${category.color} bg-opacity-10`}>
                                    <category.icon className="h-6 w-6" />
                                </div>
                                <CardTitle className="group-hover:text-primary transition-colors">
                                    {category.title}
                                </CardTitle>
                                <CardDescription>
                                    {category.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild variant="ghost" className="font-normal group">
                                    <Link href={category.link}>
                                        Explorer
                                        <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Articles populaires */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Articles populaires</CardTitle>
                            <CardDescription>
                                Les ressources les plus consultées
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {popularArticles.length === 0 ? (
                                <div className="p-6 text-sm text-muted-foreground">
                                    Aucun article n'est disponible pour le moment. Les contenus apparaîtront ici dès que des articles seront publiés.
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {popularArticles.map((article: any) => (
                                        <Link
                                            key={article.id}
                                            href={route('helps.article', article.slug)}
                                            className="block p-6 hover:bg-accent/50 transition-colors group"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium group-hover:text-primary transition-colors mb-2">
                                                        {article.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <Badge variant="outline">{categoryLabel(article.category)}</Badge>
                                                        {typeof article.views === 'number' && (
                                                            <span>{article.views} vues</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Contact support */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contactez le support</CardTitle>
                            <CardDescription>
                                Plusieurs moyens de nous contacter
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {contactMethods.map((method, index) => (
                                <div key={index} className={`p-4 rounded-lg border ${method.color} border-current border-opacity-20`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <method.icon className="h-5 w-5" />
                                        <h3 className="font-semibold">{method.title}</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {method.description}
                                    </p>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href="/client/ticket">
                                            {method.action}
                                        </Link>
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Ressources supplémentaires */}
                <div className="mt-12 bg-accent/50 rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Vous ne trouvez pas ce que vous cherchez ?</h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        Notre équipe de support dédiée est là pour vous aider rapidement et efficacement.
                        N'hésitez pas à nous contacter pour toute question supplémentaire.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg">
                            <Link href={route('supportsTickets')}>
                                Contacter le support
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href={route('courses')}>
                                Explorer les formations
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
