import AppLayout from "@/layouts/app-layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";
import { BreadcrumbItem } from "@/types";

interface CourseProgress {
    course_id: string;
    title: string;
    cover_image?: string;
    percent?: number;
    completed?: number;
    total?: number;
    last_accessed?: string;
    status?: 'completed' | 'in_progress' | 'not_started';
}

export default function CourseProgress() {
    const { progress = [] } = usePage().props as { progress?: CourseProgress[] };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Formations", href: route('courses') },
        { title: "Progression", href: route('courses.progress') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Progression des formations" />
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Progression</h1>
                    <p className="text-muted-foreground">Suivi de l'avancement de vos formations</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {progress.map((p: CourseProgress) => (
                        <Card key={p.course_id}>
                            <CardHeader className="flex flex-row items-start gap-4">
                                {p.cover_image ? (
                                    <img src={`/storage/${p.cover_image}`} alt="Cover" className="h-20 w-32 object-cover rounded border" />
                                ) : (
                                    <div className="h-20 w-32 rounded bg-muted" />
                                )}
                                <div>
                                    <CardTitle className="text-lg">{p.title}</CardTitle>
                                    <CardDescription>
                                        {p.completed}/{p.total} leçons • {p.percent}%
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Progress value={p.percent} />
                                <div className="flex justify-end">
                                    <Button asChild>
                                        <Link href={route('courses.show', p.course_id)}>Ouvrir</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {(!progress || progress.length === 0) && (
                        <Card>
                            <CardContent className="p-6 text-sm text-muted-foreground">
                                Aucune progression pour l'instant. Commencez une formation dans le catalogue.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
