import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { route } from "ziggy-js";
import { useState } from "react";
import { BookOpen, Clock, Filter, PlayCircle, Video, FileText, ArrowLeft, Award } from "lucide-react";
import { toast } from "sonner";

interface AllCourseItem {
    id: string;
    title: string;
    description?: string | null;
    intro?: string | null;
    what_you_will_learn?: string | null;
    audience?: string | null;
    level?: string | null;
    tags?: string | null;
    is_paid: boolean;
    price?: number | null;
    cover_image?: string | null;
    duration_seconds?: number | null;
    lessons_count?: number | null;
    primary_type?: "video" | "pdf" | "mixte" | null;
    progress_percent?: number;
    is_enrolled?: boolean;
    completed_at?: string | null;
}

export default function AllCoursesPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Formation", href: route("courses") },
        { title: "Toutes les formations", href: route("all-courses") },
    ];

    const { courses: serverCourses = [] } = usePage().props as { courses?: AllCourseItem[] };
    const courses: AllCourseItem[] = Array.isArray(serverCourses) ? serverCourses : [];

    const [searchTerm, setSearchTerm] = useState("");
    const [levelFilter, setLevelFilter] = useState<string | "all">("all");
    const [typeFilter, setTypeFilter] = useState<string | "all">("all");
    const [courseToJoin, setCourseToJoin] = useState<AllCourseItem | null>(null);

    const enrollForm = useForm({});

    const handleEnroll = (course: AllCourseItem, simulatePayment: boolean) => {
        const actionLabel = simulatePayment ? "Paiement simul   en cours..." : "Inscription en cours...";
        const t = toast.loading(actionLabel);
        enrollForm.post(route("courses.enroll", course.id), {
            onSuccess: () => {
                toast.success("Inscription effectuée", { id: t });
                router.visit(route("courses.show", course.id));
            },
            onError: () => {
                toast.error("Impossible de s'inscrire", { id: t });
            },
            preserveScroll: true,
        });
    };

    const filteredCourses = courses.filter((c) => {
        const matchesSearch = !searchTerm
            ? true
            : c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.description || "").toLowerCase().includes(searchTerm.toLowerCase());

        const courseLevel = (c.level || "").toLowerCase();
        const filterLevel = levelFilter.toLowerCase();

        const matchesLevel =
            levelFilter === "all"
                ? true
                : !courseLevel || courseLevel === "tous niveaux" // cours sans niveau explicite = visible dans tous les filtres
                    ? true
                    : courseLevel === filterLevel;
        const matchesType =
            typeFilter === "all" ? true : (c.primary_type || "").toLowerCase() === typeFilter.toLowerCase();

        return matchesSearch && matchesLevel && matchesType;
    });

    const typeLabel = (type?: string | null) => {
        if (type === "video") return "Vid  o";
        if (type === "pdf") return "PDF";
        if (type === "mixte") return "Mixte";
        return "Non defini";
    };

    const priceLabel = (course: AllCourseItem) => {
        if (!course.is_paid) return "Gratuit";
        if (typeof course.price === "number") {
            return `${course.price.toLocaleString("fr-FR")} FCFA`;
        }
        return "Payant";
    };

    const levelLabel = (level?: string | null) => level || "Tous niveaux";

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Toutes les formations" />

            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* En-t  te */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b pb-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                                <Link href={route("courses")} className="flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4" /> Retour au centre de formation
                                </Link>
                            </Button>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Toutes les formations</h1>
                            <p className="text-muted-foreground mt-1">
                                D  couvrez l'ensemble des formations disponibles et rejoignez celles qui vous int  ressent.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        <div className="relative w-full sm:w-72">
                            <Input
                                placeholder="Rechercher une formation..."
                                className="pl-3 pr-3"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Filtres simples */}
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Filter className="h-4 w-4" />
                            Filtres
                        </span>
                        <Button
                            size="sm"
                            variant={levelFilter === "all" ? "default" : "outline"}
                            onClick={() => setLevelFilter("all")}
                        >
                            Tous niveaux
                        </Button>
                        <Button
                            size="sm"
                            variant={levelFilter === "Débutant" ? "default" : "outline"}
                            onClick={() => setLevelFilter("Débutant")}
                        >
                            Débutant
                        </Button>
                        <Button
                            size="sm"
                            variant={levelFilter === "Intermédiaire" ? "default" : "outline"}
                            onClick={() => setLevelFilter("Intermédiaire")}
                        >
                            Intermédiaire
                        </Button>
                        <Button
                            size="sm"
                            variant={levelFilter === "Avancé" ? "default" : "outline"}
                            onClick={() => setLevelFilter("Avancé")}
                        >
                            Avancé  
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                        <Button
                            size="sm"
                            variant={typeFilter === "all" ? "default" : "outline"}
                            onClick={() => setTypeFilter("all")}
                        >
                            Tous les types
                        </Button>
                        <Button
                            size="sm"
                            variant={typeFilter === "video" ? "default" : "outline"}
                            onClick={() => setTypeFilter("video")}
                        >
                            Video
                        </Button>
                        <Button
                            size="sm"
                            variant={typeFilter === "pdf" ? "default" : "outline"}
                            onClick={() => setTypeFilter("pdf")}
                        >
                            PDF
                        </Button>
                        <Button
                            size="sm"
                            variant={typeFilter === "mixte" ? "default" : "outline"}
                            onClick={() => setTypeFilter("mixte")}
                        >
                            Mixte
                        </Button>
                    </div>
                </div>

                {/* Stats rapides */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <BookOpen className="h-4 w-4" /> Formations disponibles
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{courses.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Award className="h-4 w-4" /> Formations suivies
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {courses.filter((c) => (c.progress_percent || 0) > 0).length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4" /> Temps total estim  
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {courses.reduce((s, c) => s + (c.duration_seconds || 0), 0)
                                    ? `~${Math.round(
                                        courses.reduce((s, c) => s + (c.duration_seconds || 0), 0) / 3600
                                    )}h`
                                    : "   "}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Liste des formations */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredCourses.map((course) => {
                        const level = levelLabel(course.level);
                        const type = typeLabel(course.primary_type);
                        const lessonsCount = course.lessons_count ?? 0;
                        const progress = course.progress_percent ?? 0;

                        const isEnrolled = !!course.is_enrolled || progress > 0;

                        return (
                            <Card key={course.id} className="group hover:shadow-lg transition-all">
                                <CardHeader className="pb-4">
                                    {course.cover_image ? (
                                        <img
                                            src={`/storage/${course.cover_image}`}
                                            alt="Cover"
                                            className="aspect-video w-full object-cover rounded-lg mb-4"
                                        />
                                    ) : (
                                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mb-4">
                                            <BookOpen className="h-12 w-12 text-primary/60 group-hover:text-primary transition-colors" />
                                        </div>
                                    )}
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors flex items-center gap-2">
                                        {course.title}
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                                            {level}
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2 mt-1">
                                        {course.intro || course.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {course.duration_seconds ? `${Math.round(course.duration_seconds / 60)} min` : "Dur  e inconnue"}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="h-3 w-3" /> {lessonsCount} le  on{lessonsCount > 1 ? "s" : ""}
                                        </span>
                                        <Badge variant="destructive" className="flex items-center gap-1">
                                            {course.primary_type === "video" && <Video className="h-3 w-3" />}
                                            {course.primary_type === "pdf" && <FileText className="h-3 w-3" />}
                                            {course.primary_type === "mixte" && (
                                                <>
                                                    <Video className="h-3 w-3" />
                                                    <FileText className="h-3 w-3" />
                                                </>
                                            )}
                                            {type}
                                        </Badge>
                                        <Badge className="font-semibold bg-green-600 shadow-lg text-xs">
                                            {priceLabel(course)}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span>Progression</span>
                                            <span className="font-medium">{progress}%</span>
                                        </div>
                                        <Progress value={progress} className="h-2" />
                                    </div>
                                </CardContent>
                                <CardContent className="border-t pt-4 flex flex-col sm:flex-row gap-2 justify-between items-center">
                                    <Button
                                        variant={course.is_paid ? "destructive" : "default"}
                                        className="w-full sm:w-auto flex-1"
                                        onClick={() => {
                                            if (course.is_paid) {
                                                setCourseToJoin(course);
                                            } else {
                                                handleEnroll(course, false);
                                            }
                                        }}
                                    >
                                        <PlayCircle className="h-4 w-4 mr-2" />
                                        {course.is_paid ? "Rejoindre (payant)" : isEnrolled ? "Continuer gratuitement" : "Commencer gratuitement"}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full sm:w-auto"
                                        asChild
                                    >
                                        <Link href={route("courses.show", course.id)}>
                                            D  tail du cours
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {filteredCourses.length === 0 && (
                        <Card className="col-span-full">
                            <CardContent className="py-8 text-center text-sm text-muted-foreground">
                                Aucune formation ne correspond à vos critères de recherche.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Paiement simul   pour les formations payantes */}
            <Dialog open={!!courseToJoin} onOpenChange={(open) => { if (!open) setCourseToJoin(null); }}>
                <DialogContent className="max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Paiement simul  </DialogTitle>
                        <DialogDescription>
                            Vous êtes sur le point de rejoindre la formation
                            {courseToJoin ? ` "${courseToJoin.title}"` : ""}. Aucun paiement réel ne sera effectué : il s'agit
                            uniquement d'une simulation, vous serez inscrit imm  diatement.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => setCourseToJoin(null)}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            type="button"
                            onClick={() => {
                                if (courseToJoin) {
                                    const course = courseToJoin;
                                    setCourseToJoin(null);
                                    handleEnroll(course, true);
                                }
                            }}
                        >
                            Confirmer l'inscription
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
