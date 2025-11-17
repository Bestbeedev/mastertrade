import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { PlayCircle, Clock, BookOpen, CheckCircle, Search, Filter, Award } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useIsAdmin } from "@/hooks/use-is-admin";

export default function Formation() {
    const isAdmin = useIsAdmin();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Formation',
            href: '/client/formation',
        },
    ];

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const { courses: realCourses = [] } = usePage().props as any;
    const courses = Array.isArray(realCourses) && realCourses.length ? realCourses : [];

    const categories = [
        { id: 'all', name: 'Tous les cours', count: courses.length },
    ];

    const avg = courses.length ? Math.round(courses.reduce((s: any, c: any) => s + (c.progress_percent || 0), 0) / courses.length) : 0;
    const stats = [
        {
            title: "Cours suivis",
            value: String(courses.filter((c: any) => (c.progress_percent || 0) > 0).length),
            description: "+1 cette semaine",
            icon: BookOpen
        },
        {
            title: "Progression moyenne",
            value: `${avg}%`,
            description: "En amélioration",
            icon: Award
        },
        {
            title: "Temps total",
            value: courses.reduce((s: any, c: any) => s + (c.duration_seconds || 0), 0) ? "~" + Math.round(courses.reduce((s: any, c: any) => s + (c.duration_seconds || 0), 0) / 3600) + "h" : "—",
            description: "Ce mois-ci",
            icon: Clock
        },
        {
            title: "Certificats",
            value: "—",
            description: "Obtenus",
            icon: CheckCircle
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Formation" />

            {/* En-tête */}
            <div className="border-b flex flex-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Centre de Formation</h1>
                            <p className="text-muted-foreground mt-2">
                                Améliorez vos compétences avec nos formations expertes
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher une formation..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Filtres
                            </Button>
                            {isAdmin && (
                                <Button asChild size="sm">
                                    <Link href={route('admin.courses')}>Ajouter une formation</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className=" w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Navigation par catégories */}
                <div className="flex flex-wrap justify-between gap-2 mb-8">
                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <Button
                                key={category.id}
                                variant={activeCategory === category.id ? "default" : "outline"}
                                onClick={() => setActiveCategory(category.id)}
                                className="relative"
                            >
                                {category.name}
                                <Badge
                                    variant="secondary"
                                    className="ml-2 bg-background text-foreground"
                                >
                                    {category.count}
                                </Badge>
                            </Button>
                        ))}
                    </div>
                    <Button variant="destructive" onClick={() => router.get(route('all-courses'))} className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Voir toutes les formations
                    </Button>
                </div>

                {/* Liste des cours */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {courses
                        .filter((c: any) => c.title.toLowerCase().includes(searchTerm.toLowerCase()) || (c.description || '').toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((course: any) => {
                            const firstBullet = String(course.what_you_will_learn || '').split('\n').filter(Boolean)[0] || '';
                            const audienceShort = (course.audience || '').length > 80 ? (course.audience || '').slice(0, 77) + '…' : (course.audience || '');
                            const tags = String(course.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean).slice(0, 3);
                            return (
                                <Card key={course.id} className="group hover:shadow-lg transition-all">
                                    <CardHeader className="pb-4">
                                        <div className="relative">
                                            {course.cover_image ? (
                                                <img src={`/storage/${course.cover_image}`} alt="Cover" className="aspect-video w-full object-cover rounded-lg mb-4" />
                                            ) : (
                                                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mb-4">
                                                    <PlayCircle className="h-12 w-12 text-primary/60 group-hover:text-primary transition-colors" />
                                                </div>
                                            )}
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2 flex items-center gap-2">
                                            {course.title}
                                            {course.level && (
                                                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border bg-background text-muted-foreground">
                                                    {course.level}
                                                </span>
                                            )}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {course.intro || course.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Informations du cours */}
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {course.duration_seconds ? Math.round(course.duration_seconds / 60) + ' min' : '—'}
                                            </span>
                                            <span>{course.lessons_count ?? 0} leçons</span>
                                        </div>

                                        {/* Aperçu pédagogique */}
                                        {(firstBullet || audienceShort || tags.length) && (
                                            <div className="space-y-1 text-xs text-muted-foreground">
                                                {firstBullet && (
                                                    <div>
                                                        <span className="font-medium">Vous apprendrez:&nbsp;</span>
                                                        <span>{firstBullet}</span>
                                                    </div>
                                                )}
                                                {audienceShort && (
                                                    <div>
                                                        <span className="font-medium">Pour:&nbsp;</span>
                                                        <span>{audienceShort}</span>
                                                    </div>
                                                )}
                                                {tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 pt-1">
                                                        {tags.map((t: string, idx: number) => (
                                                            <span key={idx} className="px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wide bg-background">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Barre de progression */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Progression</span>
                                                <span className="font-medium">{course.progress_percent ?? 0}%</span>
                                            </div>
                                            <Progress value={course.progress_percent ?? 0} className="h-2" />
                                            <div className="text-xs text-muted-foreground">
                                                {/* Optionnel: afficher complétées si disponibles côté back */}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button asChild className="w-full">
                                            <Link href={route('courses.show', course.id)}>
                                                <PlayCircle className="h-4 w-4 mr-2" />
                                                {(course.progress_percent ?? 0) > 0 ? 'Continuer' : 'Commencer'}
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })
                    }
                </div>

                {/* Cours récemment terminés */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold tracking-tight mb-6">Récemment terminés</h2>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-4">
                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                    <div>
                                        <h3 className="font-semibold text-green-900 dark:text-green-100">
                                            Introduction à la Sécurité
                                        </h3>
                                        <p className="text-green-700 dark:text-green-300 text-sm">
                                            Terminé le 12 Jan 2024 • Certificat obtenu
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-700">
                                    100% complété
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
