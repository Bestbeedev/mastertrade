import AppLayout from "@/layouts/app-layout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { Play, BookOpen, Clock, ArrowLeft, CheckCircle, PlayCircle, Download, Lock, Target, Shield, Circle, ListOrdered, FolderOpen, FileText, Calendar, Layers, Users, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { route } from "ziggy-js";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface Lesson {
    id: string;
    title?: string;
    type?: string;
    content_url?: string;
    duration_seconds?: number;
    position?: number;
    moduleTitle?: string;
}

interface Module {
    id?: string;
    title?: string;
    description?: string;
    position?: number;
    lessons?: Lesson[];
}

interface Course {
    id: string;
    title?: string;
    description?: string;
    intro?: string;
    what_you_will_learn?: string;
    requirements?: string;
    audience?: string;
    level?: string;
    tags?: string;
    is_paid?: boolean;
    price?: number;
    modules?: Module[];
    cover_image?: string;
    created_at?: string;
}

export default function Course() {
    const { course, is_enrolled = false, progress_percent = 0, completed_lessons = [] } = usePage().props as { course?: Course; is_enrolled?: boolean; progress_percent?: number; completed_lessons?: string[] };

    const modules = course?.modules || [];
    const modulesCount = modules.length;
    const lessonsCount = useMemo(() => modules.reduce((sum: number, m: Module) => sum + ((m.lessons || []).length), 0), [modules]);
    const flatLessons = useMemo(() => {
        const arr: Lesson[] = [];
        modules.forEach((m: Module) => (m.lessons || []).forEach((l: Lesson) => arr.push({ ...l, moduleTitle: m.title || '' })));
        return arr;
    }, [modules]);

    const firstUncompleted = flatLessons.find((l) => !(completed_lessons || []).includes(l.id)) || flatLessons[0];
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(firstUncompleted || null);
    const [secondsWatched, setSecondsWatched] = useState<number>(0);

    // Simple timer while viewing the lesson section (best-effort)
    useEffect(() => {
        setSecondsWatched(0);
        const iv = setInterval(() => setSecondsWatched((s) => s + 1), 1000);
        return () => { clearInterval(iv); };
    }, [activeLesson?.id]);

    const enrollForm = useForm({});
    const handleEnroll = () => {
        const t = toast.loading('Inscription...');
        enrollForm.post(route('courses.enroll', course?.id || ''), {
            onSuccess: () => toast.success("Inscription effectuée", { id: t }),
            onError: () => toast.error("Impossible de s'inscrire", { id: t }),
        });
    };

    const completeForm = useForm<{ lesson_id: string; position_seconds?: number; seconds_watched?: number; completed?: boolean }>({
        lesson_id: "",
        position_seconds: 0,
        seconds_watched: 0,
        completed: false,
    });
    const onComplete = (done = true) => {
        if (!activeLesson) return;
        const t = toast.loading("Mise à jour de la progression...");
        completeForm.setData({
            lesson_id: activeLesson.id,
            position_seconds: secondsWatched,
            seconds_watched: secondsWatched,
            completed: done,
        });
        completeForm.post(route('courses.complete-lesson', course?.id || ''), {
            preserveScroll: true,
            onSuccess: () => toast.success("Progression mise à jour", { id: t }),
            onError: () => toast.error("Erreur de progression", { id: t }),
        });
    };

    const ytEmbed = (url: string) => {
        try {
            if (!url) return null;
            let embed = url;
            if (url.includes('watch?v=')) {
                const id = new URL(url).searchParams.get('v');
                embed = `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&enablejsapi=1`;
            } else if (url.includes('youtu.be/')) {
                const id = url.split('youtu.be/')[1].split('?')[0];
                embed = `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&enablejsapi=1`;
            } else if (!url.includes('/embed/')) {
                // fallback
                embed = url;
            }
            return embed;
        } catch { return null; }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: "Formations", href: route('courses') },
            { title: course?.title || 'Formation', href: "" }
        ]}>
            <Head title={course?.title || 'Formation'} />

            <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" asChild>
                        <Link href={route('courses')} className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" /> Retour
                        </Link>
                    </Button>
                    {!is_enrolled && (
                        <Button onClick={handleEnroll}>
                            S'inscrire au cours
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Contenu principal - 2/3 de largeur */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-2xl font-bold">
                                        {course?.title}
                                    </CardTitle>
                                    <CardDescription className="mt-2 text-base">
                                        {course?.description}
                                    </CardDescription>

                                    {/* Métadonnées principales */}
                                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <p className="text-sm text-muted-foreground">Créé le {course?.created_at ? new Date(course.created_at).toLocaleDateString('fr-FR') : ''}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Layers className="h-4 w-4" />
                                            <span>{modulesCount} modules</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="h-4 w-4" />
                                            <span>{lessonsCount} leçons</span>
                                        </div>
                                        {course?.level && (
                                            <Badge variant="secondary">
                                                {course.level}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Progression */}
                                {is_enrolled && (
                                    <div className="flex flex-col items-end gap-2 min-w-[140px]">
                                        <div className="text-sm font-medium">Progression</div>
                                        <Progress value={progress_percent || 0} className="h-2 w-32" />
                                        <div className="text-xs text-muted-foreground">
                                            {Math.round(progress_percent || 0)}% complété
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-8">
                            {/* Lecteur de contenu */}
                            <div className="space-y-4">
                                <div className="text-lg font-semibold">
                                    {activeLesson ? activeLesson.title : 'Aperçu du cours'}
                                </div>

                                {activeLesson ? (
                                    is_enrolled ? (
                                        <div className="space-y-4">
                                            {/* Player */}
                                            <div className="aspect-video rounded-lg overflow-hidden bg-muted shadow-sm">
                                                {activeLesson.type === 'video' && activeLesson.content_url ? (
                                                    <iframe
                                                        className="w-full h-full"
                                                        src={ytEmbed(activeLesson.content_url) || ''}
                                                        title={activeLesson.title}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                        allowFullScreen
                                                    />
                                                ) : activeLesson.type === 'pdf' && activeLesson.content_url ? (
                                                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                                                        <FileText className="h-16 w-16 text-muted-foreground" />
                                                        <div className="text-center px-6">
                                                            <p className="text-sm font-medium mb-2">
                                                                Document PDF
                                                            </p>
                                                            <p className="text-sm text-muted-foreground mb-4">
                                                                Téléchargez ce document pour le consulter sur votre appareil.
                                                            </p>
                                                            <Button asChild className="gap-2">
                                                                <a href={`/storage/${activeLesson.content_url}`} target="_blank" rel="noopener noreferrer">
                                                                    <Download className="h-4 w-4" />
                                                                    Télécharger le PDF
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <PlayCircle className="h-16 w-16 text-primary" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="h-4 w-4" />
                                                    <span>Temps suivi: {secondsWatched}s</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => onComplete(false)}>
                                                        Sauvegarder
                                                    </Button>
                                                    <Button size="sm" onClick={() => onComplete(true)} className="gap-2">
                                                        <CheckCircle className="h-4 w-4" />
                                                        Terminer
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 text-center py-8">
                                            <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                                                <Lock className="h-16 w-16 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-medium mb-2">
                                                    Contenu verrouillé
                                                </p>
                                                <p className="text-muted-foreground max-w-md mx-auto">
                                                    Inscrivez-vous à cette formation pour accéder à tous les contenus.
                                                </p>
                                            </div>
                                            <Button onClick={handleEnroll} size="lg" className="gap-2">
                                                <PlayCircle className="h-5 w-5" />
                                                S'inscrire maintenant
                                            </Button>
                                        </div>
                                    )
                                ) : (
                                    <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                                        <Play className="h-16 w-16 text-primary" />
                                    </div>
                                )}
                            </div>

                            {/* Métadonnées structurées en cartes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Introduction */}
                                {course?.intro && (
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="flex items-center gap-2 font-semibold">
                                                <Info className="h-4 w-4 text-lg text-blue-600" />
                                                Introduction
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <p className="text-sm leading-relaxed whitespace-pre-line">
                                                {course.intro}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Public cible */}
                                {course?.audience && (
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="flex items-center gap-2  font-semibold">
                                                <Users className="h-4 w-4 text-lg text-green-600" />
                                                Public cible
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <p className="text-sm leading-relaxed whitespace-pre-line">
                                                {course.audience}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Objectifs d'apprentissage */}
                                {course?.what_you_will_learn && (
                                    <Card className="md:col-span-2">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="flex items-center gap-2  font-semibold">
                                                <Target className="h-4 w-4 text-lg text-purple-600" />
                                                Objectifs d'apprentissage
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {String(course.what_you_will_learn).split('\n').filter(Boolean).map((l: string, idx: number) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                        <span>{l}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Prérequis */}
                                {course?.requirements && (
                                    <Card className="md:col-span-2">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="flex items-center gap-2 font-semibold">
                                                <Shield className="h-4 w-4 text-orange-600 text-lg" />
                                                Prérequis
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {String(course.requirements).split('\n').filter(Boolean).map((l: string, idx: number) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                                        <Circle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                                        <span>{l}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Tags */}
                            {course?.tags && (
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-semibold">Tags</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex flex-wrap gap-2">
                                            {String(course.tags).split(',').map((t: string, idx: number) => (
                                                <Badge key={idx} variant="outline" className="px-3 py-1">
                                                    {t.trim()}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </CardContent>
                    </Card>

                    {/* Panneau des leçons - 1/3 de largeur */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                    <ListOrdered className="h-5 w-5 text-primary" />
                                    Plan du cours
                                </CardTitle>
                                <CardDescription>
                                    {modulesCount} modules • {lessonsCount} leçons
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                                {(modules || []).map((m: Module, mi: number) => (
                                    <div key={m.id || mi} className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <FolderOpen className="h-4 w-4 text-primary" />
                                            <h4 className="font-semibold text-sm">
                                                {m.title}
                                            </h4>
                                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                                {m.lessons?.length || 0} leçons
                                            </span>
                                        </div>
                                        <div className="space-y-2 ml-6">
                                            {(m.lessons || []).map((l: Lesson, li: number) => {
                                                const completed = (completed_lessons || []).includes(l.id);
                                                const isActive = activeLesson?.id === l.id;
                                                return (
                                                    <button
                                                        key={l.id || li}
                                                        className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${isActive
                                                                ? 'bg-accent border-primary shadow-sm'
                                                                : completed
                                                                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20'
                                                                    : 'hover:bg-accent border-border'
                                                            }`}
                                                        onClick={() => setActiveLesson(l)}
                                                    >
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div className={`h-8 w-8 rounded flex items-center justify-center flex-shrink-0 ${isActive
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : completed
                                                                        ? 'bg-green-100 text-green-600 dark:bg-green-800'
                                                                        : 'bg-muted text-muted-foreground'
                                                                }`}>
                                                                {completed ? (
                                                                    <CheckCircle className="h-4 w-4" />
                                                                ) : (
                                                                    <PlayCircle className="h-4 w-4" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className={`font-medium text-sm truncate ${isActive ? 'text-primary' : ''
                                                                    }`}>
                                                                    {l.title}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                    <Clock className="h-3 w-3" />
                                                                    <span>{l.duration_seconds ? Math.round(l.duration_seconds / 60) + ' min' : '—'}</span>
                                                                    {l.type && (
                                                                        <Badge variant="secondary" className="text-xs py-0 px-1.5">
                                                                            {l.type}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {completed && !isActive && (
                                                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>


            </div>
        </AppLayout>
    );
}
