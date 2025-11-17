import AppLayout from "@/layouts/app-layout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { Play, BookOpen, Clock, ArrowLeft, CheckCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { route } from "ziggy-js";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function Course() {
    const { course, is_enrolled = false, progress_percent = 0, completed_lessons = [] } = usePage().props as any;

    const modules = course?.modules || [];
    const modulesCount = modules.length;
    const lessonsCount = useMemo(() => modules.reduce((sum: number, m: any) => sum + ((m.lessons || []).length), 0), [modules]);
    const flatLessons = useMemo(() => {
        const arr: any[] = [];
        modules.forEach((m: any) => (m.lessons || []).forEach((l: any) => arr.push({ ...l, moduleTitle: m.title })));
        return arr;
    }, [modules]);

    const firstUncompleted = flatLessons.find((l) => !(completed_lessons as any[])?.includes(l.id)) || flatLessons[0];
    const [activeLesson, setActiveLesson] = useState<any>(firstUncompleted || null);
    const [secondsWatched, setSecondsWatched] = useState<number>(0);
    const [timerOn, setTimerOn] = useState<boolean>(false);

    // Simple timer while viewing the lesson section (best-effort)
    useEffect(() => {
        setSecondsWatched(0);
        setTimerOn(true);
        const iv = setInterval(() => setSecondsWatched((s) => s + 1), 1000);
        return () => { clearInterval(iv); setTimerOn(false); };
    }, [activeLesson?.id]);

    const enrollForm = useForm({});
    const onEnroll = () => {
        const t = toast.loading("Inscription en cours...");
        enrollForm.post(route('courses.enroll', course.id), {
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
        completeForm.post(route('courses.complete-lesson', course.id), {
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
        <AppLayout breadcrumbs={[{ title: "Formations", href: route('courses') }, { title: course?.title || 'Formation', href: '' }]}>
            <Head title={course?.title || 'Formation'} />

            <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" asChild>
                        <Link href={route('courses')} className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" /> Retour
                        </Link>
                    </Button>
                    {!is_enrolled && (
                        <Button onClick={onEnroll}>
                            S'inscrire au cours
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 overflow-hidden">
                        <CardHeader>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <CardTitle className="text-2xl">{course?.title}</CardTitle>
                                    <CardDescription className="mt-2">{course?.description}</CardDescription>
                                    <div className="mt-2 text-xs text-muted-foreground flex flex-wrap gap-3">
                                        <span>Créée le {course?.created_at ? new Date(course.created_at).toLocaleDateString('fr-FR') : '—'}</span>
                                        <span>Modules: {modulesCount}</span>
                                        <span>Leçons: {lessonsCount}</span>
                                    </div>
                                </div>
                                <div className="hidden lg:flex flex-col items-end gap-2 min-w-[160px]">
                                    <div className="text-xs text-muted-foreground">Progression</div>
                                    <Progress value={progress_percent || 0} className="h-2 w-40" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Lecteur */}
                            {activeLesson ? (
                                <div className="space-y-3">
                                    <div className="text-sm text-muted-foreground">Leçon: <span className="font-medium text-foreground">{activeLesson.title}</span></div>
                                    <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                                        {activeLesson.type === 'video' && activeLesson.content_url ? (
                                            <iframe
                                                className="w-full h-full"
                                                src={ytEmbed(activeLesson.content_url) || ''}
                                                title={activeLesson.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            />
                                        ) : activeLesson.type === 'pdf' && activeLesson.content_url ? (
                                            <iframe className="w-full h-full" src={`/storage/${activeLesson.content_url}`} title={activeLesson.title} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <PlayCircle className="h-10 w-10 text-primary" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-muted-foreground">Temps suivi: {secondsWatched}s</div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => onComplete(false)}>Sauvegarder</Button>
                                            <Button size="sm" onClick={() => onComplete(true)} className="gap-2"><CheckCircle className="h-4 w-4" /> Marquer comme complétée</Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                                    <Play className="h-10 w-10 text-primary" />
                                </div>
                            )}
                            {/* Introduction */}
                            {course?.intro ? (
                                <div className="mt-6 space-y-2">
                                    <div className="text-sm font-medium">Introduction</div>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line">{course.intro}</p>
                                </div>
                            ) : null}

                            {/* Ce que vous apprendrez */}
                            {course?.what_you_will_learn ? (
                                <div className="mt-6 space-y-2">
                                    <div className="text-sm font-medium">Ce que vous apprendrez</div>
                                    <ul className="list-disc pl-5 text-sm text-muted-foreground whitespace-pre-line">
                                        {String(course.what_you_will_learn).split('\n').filter(Boolean).map((l: string, idx: number) => (
                                            <li key={idx}>{l}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}

                            {/* Prérequis */}
                            {course?.requirements ? (
                                <div className="mt-6 space-y-2">
                                    <div className="text-sm font-medium">Prérequis</div>
                                    <ul className="list-disc pl-5 text-sm text-muted-foreground whitespace-pre-line">
                                        {String(course.requirements).split('\n').filter(Boolean).map((l: string, idx: number) => (
                                            <li key={idx}>{l}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}

                            {/* Pour qui ? */}
                            {course?.audience ? (
                                <div className="mt-6 space-y-2">
                                    <div className="text-sm font-medium">Pour qui ?</div>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line">{course.audience}</p>
                                </div>
                            ) : null}

                            {/* Niveau et tags */}
                            {(course?.level || course?.tags) ? (
                                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                    {course?.level ? (
                                        <span className="px-2 py-1 rounded-full border">Niveau: {course.level}</span>
                                    ) : null}
                                    {course?.tags ? String(course.tags).split(',').map((t: string, idx: number) => (
                                        <span key={idx} className="px-2 py-1 rounded-full border">{t.trim()}</span>
                                    )) : null}
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>

                    {/* Panneau des leçons */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Contenu du cours</CardTitle>
                                <CardDescription>Cliquez pour ouvrir une leçon</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {(modules || []).map((m: any, mi: number) => (
                                    <div key={m.id || mi} className="space-y-2">
                                        <div className="text-sm font-medium">{m.title}</div>
                                        <div className="space-y-2">
                                            {(m.lessons || []).map((l: any, li: number) => {
                                                const completed = (completed_lessons || []).includes(l.id);
                                                const isActive = activeLesson?.id === l.id;
                                                return (
                                                    <button
                                                        key={l.id || li}
                                                        className={`w-full flex items-center justify-between p-3 rounded-lg border text-left ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`}
                                                        onClick={() => setActiveLesson(l)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                                                                <BookOpen className="h-4 w-4 text-primary" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-sm">{l.title}</div>
                                                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" /> {l.duration_seconds ? Math.round(l.duration_seconds / 60) + ' min' : '—'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {completed && <CheckCircle className="h-4 w-4 text-green-600" />}
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
