import AppLayout from "@/layouts/app-layout";
import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { route } from "ziggy-js";
import { toast } from "sonner";
import { BookOpen, Plus, Trash2, Info, Image, Tag, FileText } from "lucide-react";
import Dropzone from "@/components/ui/dropzone";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type LessonDraft = {
    title: string;
    type: 'video' | 'pdf';
    content_url?: string;
    file?: File | undefined;
    is_preview: boolean;
    duration_seconds?: string | number;
};

type ModuleDraft = {
    title: string;
    description?: string;
    position: number;
    lessons: LessonDraft[];
};

type CourseForm = {
    title: string;
    description: string;
    intro: string;
    what_you_will_learn: string;
    requirements: string;
    audience: string;
    level: string;
    tags: string;
    is_paid: boolean;
    price: string | number;
    product_id: string;
    modules: ModuleDraft[];
    cover_image: File | null;
};

interface CourseItem {
    id: string;
    title: string;
    description?: string;
    cover_image?: string;
    is_paid?: boolean;
    price?: number;
    level?: string;
    tags?: string;
    status?: string;
    created_at?: string;
    product?: { id: string; name: string };
    modules_count?: number;
    lessons_count?: number;
    enrollments_count?: number;
    duration_seconds?: number;
}

export default function AdminCourses({ courses = [], products = [] }: { courses?: CourseItem[]; products?: { id: string; name: string }[] }) {
    const [activeTab, setActiveTab] = React.useState("list");
    const [selectedCourse, setSelectedCourse] = React.useState<CourseItem | null>(null);
    const [createTab, setCreateTab] = React.useState("info");

    const form = useForm<CourseForm>({
        title: "",
        description: "",
        intro: "",
        what_you_will_learn: "",
        requirements: "",
        audience: "",
        level: "",
        tags: "",
        is_paid: false,
        price: "",
        product_id: "",
        modules: [],
        cover_image: null,
    });

    React.useEffect(() => {
        if (activeTab === 'new') setCreateTab('info');
    }, [activeTab]);

    const addModule = () => {
        const modules = ([...(form.data.modules || [])] as ModuleDraft[]);
        modules.push({ title: "", description: "", position: modules.length, lessons: [] });
        form.setData("modules", modules);
    };
    const removeModule = (mi: number) => {
        const modules = ([...(form.data.modules || [])] as ModuleDraft[]);
        modules.splice(mi, 1);
        form.setData("modules", modules.map((m, i) => ({ ...m, position: i })) as ModuleDraft[]);
    };
    const updateModule = (mi: number, patch: Partial<ModuleDraft>) => {
        const modules = ([...(form.data.modules || [])] as ModuleDraft[]);
        modules[mi] = { ...modules[mi], ...patch };
        form.setData("modules", modules);
    };
    const addLesson = (mi: number) => {
        const modules = ([...(form.data.modules || [])] as ModuleDraft[]);
        const lessons = ([...(modules[mi]?.lessons || [])] as LessonDraft[]);
        lessons.push({ title: "", type: "video", content_url: "", is_preview: false, duration_seconds: "" });
        modules[mi] = { ...modules[mi], lessons };
        form.setData("modules", modules);
    };
    const removeLesson = (mi: number, li: number) => {
        const modules = ([...(form.data.modules || [])] as ModuleDraft[]);
        const lessons = ([...(modules[mi]?.lessons || [])] as LessonDraft[]);
        lessons.splice(li, 1);
        modules[mi] = { ...modules[mi], lessons };
        form.setData("modules", modules);
    };
    const updateLesson = (mi: number, li: number, patch: Partial<LessonDraft>) => {
        const modules = ([...(form.data.modules || [])] as ModuleDraft[]);
        const lessons = ([...(modules[mi]?.lessons || [])] as LessonDraft[]);
        lessons[li] = { ...lessons[li], ...patch };
        modules[mi] = { ...modules[mi], lessons };
        form.setData("modules", modules);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const t = toast.loading('Création de la formation...');
        form.post(route("admin.courses.store"), {
            onSuccess: () => {
                toast.success('Formation créée avec succès', { id: t });
                form.reset();
                setActiveTab('list');
            },
            onError: () => toast.error('Erreur lors de la création', { id: t }),
            forceFormData: true,
        });
    };

    const { delete: destroy, processing: deleting } = useForm({});
    const [courseToDelete, setCourseToDelete] = React.useState<CourseItem | null>(null);

    const handleDelete = () => {
        if (!courseToDelete) return;
        const t = toast.loading('Suppression en cours...');
        destroy(route("admin.courses.destroy", { course: courseToDelete.id }), {
            onSuccess: () => {
                toast.success('Formation supprimée', { id: t });
                setCourseToDelete(null);
            },
            onError: () => toast.error('Erreur lors de la suppression', { id: t }),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Admin", href: "/admin" }, { title: "Formations", href: "/admin/courses" }]}>
            <Head title="Admin • Gestion des Formations" />
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gestion des Formations</h1>
                        <p className="text-muted-foreground">Créez et gérez vos formations</p>
                    </div>
                    <Button onClick={() => setActiveTab('new')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle Formation
                    </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="list" className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" /> Liste des formations
                        </TabsTrigger>
                        <TabsTrigger value="new" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Nouvelle formation
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Formations existantes</CardTitle>
                                <CardDescription>Couverture, modules, inscrits et métadonnées</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {courses?.length ? (
                                    <div className="divide-y rounded-md border">
                                        {courses.map((c: CourseItem) => (
                                            <div key={c.id} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-start gap-4 flex-1 sm:items-center">
                                                    {c.cover_image ? (
                                                        <img
                                                            src={`/storage/${c.cover_image}`}
                                                            alt={c.title}
                                                            className="h-16 w-24 rounded-md object-cover flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="h-16 w-24 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                                                            <Image />
                                                        </div>
                                                    )}
                                                    <div className="space-y-2 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-bold truncate">{c.title}</div>
                                                            {c.is_paid ? (
                                                                <span className="text-xs px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200">
                                                                    Payante{c.price ? ` ${(Number(c.price) || 0).toFixed(2)} FCFA` : ""}
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                    Gratuite
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground flex flex-wrap gap-3">
                                                            <span>{c.product?.name ? `Produit : ${c.product.name}` : "Sans produit lié"}</span>
                                                            <span>Modules : {c.modules_count ?? 0}</span>
                                                            <span>Leçons : {c.lessons_count ?? 0}</span>
                                                            <span>Inscrits : {c.enrollments_count ?? 0}</span>
                                                            <span>
                                                                Créée le {c.created_at ? new Date(c.created_at).toLocaleDateString('fr-FR') : "—"}
                                                            </span>
                                                            {c.duration_seconds ? (
                                                                <span>
                                                                    Durée ~ {Math.round((c.duration_seconds / 60) || 0)} min
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap justify-end sm:flex-nowrap sm:justify-end flex-shrink-0">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-1"
                                                        onClick={() => setSelectedCourse(c)}
                                                    >
                                                        <Info className="h-4 w-4" />
                                                        Détails
                                                    </Button>
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={route('admin.courses.edit', c.id)}>Éditer</Link>
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        type="button"
                                                        onClick={() => setCourseToDelete(c)}
                                                        disabled={deleting}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground">Aucune formation pour l’instant.</div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="new">
                        <form onSubmit={onSubmit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Nouvelle Formation</CardTitle>
                                    <CardDescription>Renseignez les informations de votre formation</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <Tabs value={createTab} onValueChange={setCreateTab} className="space-y-4">
                                        <TabsList>
                                            <TabsTrigger value="info" className="flex items-center gap-2">
                                                <Info className="h-4 w-4" /> Infos
                                            </TabsTrigger>
                                            <TabsTrigger value="pricing" className="flex items-center gap-2">
                                                <Tag className="h-4 w-4" /> Tarification
                                            </TabsTrigger>
                                            <TabsTrigger value="content" className="flex items-center gap-2">
                                                <FileText className="h-4 w-4" /> Contenu
                                            </TabsTrigger>
                                            <TabsTrigger value="media" className="flex items-center gap-2">
                                                <Image className="h-4 w-4" /> Médias
                                            </TabsTrigger>
                                            <TabsTrigger value="modules" className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4" /> Modules
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="info" className="space-y-6">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="title">Titre</Label>
                                                        <Input id="title" value={form.data.title} onChange={(e) => form.setData("title", e.target.value)} placeholder="Titre de la formation" required />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="product_id">Produit lié (optionnel)</Label>
                                                        <Select value={form.data.product_id} onValueChange={(v) => form.setData("product_id", v)}>
                                                            <SelectTrigger className="w-full"><SelectValue placeholder="Sélectionnez un produit" /></SelectTrigger>
                                                            <SelectContent>
                                                                {products?.map((p) => (
                                                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="pricing" className="space-y-6">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>Payant ?</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox id="is_paid" checked={!!form.data.is_paid} onCheckedChange={(v) => form.setData("is_paid", !!v)} />
                                                            <Label htmlFor="is_paid" className="text-sm text-muted-foreground">Cocher si la formation est payante</Label>
                                                        </div>
                                                    </div>
                                                    {form.data.is_paid && (
                                                        <div className="space-y-2">
                                                            <Label htmlFor="price">Prix</Label>
                                                            <Input id="price" type="number" min="0" step="0.01" value={form.data.price}
                                                                onChange={(e) => form.setData("price", e.target.value)} placeholder="0.00" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="content" className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="intro">Introduction (optionnel)</Label>
                                                <textarea
                                                    id="intro"
                                                    value={form.data.intro}
                                                    onChange={(e) => form.setData("intro", e.target.value)}
                                                    placeholder="Texte d’introduction, points clés, bénéfices..."
                                                    rows={3}
                                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="description">Description</Label>
                                                <textarea
                                                    id="description"
                                                    value={form.data.description}
                                                    onChange={(e) => form.setData("description", e.target.value)}
                                                    placeholder="Décrivez la formation"
                                                    rows={4}
                                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                />
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="what_you_will_learn">Ce que vous apprendrez</Label>
                                                    <textarea id="what_you_will_learn" value={form.data.what_you_will_learn} onChange={(e) => form.setData('what_you_will_learn', e.target.value)} rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder={"Point 1\nPoint 2\nPoint 3"} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="requirements">Prérequis</Label>
                                                    <textarea id="requirements" value={form.data.requirements} onChange={(e) => form.setData('requirements', e.target.value)} rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder={"Compétence A\nOutil B"} />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label htmlFor="audience">Pour qui ?</Label>
                                                    <textarea id="audience" value={form.data.audience} onChange={(e) => form.setData('audience', e.target.value)} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder={"Débutants, Étudiants, Professionnels..."} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="level">Niveau</Label>
                                                    <Input id="level" value={form.data.level} onChange={(e) => form.setData('level', e.target.value)} placeholder="Débutant / Intermédiaire / Avancé" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="tags">Tags</Label>
                                                    <Input id="tags" value={form.data.tags} onChange={(e) => form.setData('tags', e.target.value)} placeholder="ex: sécurité, windows, réseau" />
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="media" className="space-y-6">
                                            <div className="space-y-2">
                                                <Label>Bannière de couverture</Label>
                                                <Dropzone
                                                    accept="image/*"
                                                    multiple={false}
                                                    value={form.data.cover_image ? [form.data.cover_image] : []}
                                                    onFiles={(files) => form.setData('cover_image', files[0] ?? null)}
                                                    className="min-h-[100px]"
                                                >
                                                    <div className="text-center p-4">
                                                        <p className="text-muted-foreground">Glissez-déposez une image ou cliquez pour sélectionner</p>
                                                        <p className="text-xs text-muted-foreground mt-1">Formats acceptés: .jpg, .jpeg, .png</p>
                                                    </div>
                                                </Dropzone>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="modules" className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle>Modules et Leçons</CardTitle>
                                                    <CardDescription>Organisez la formation par étapes/modules</CardDescription>
                                                </div>
                                                <Button type="button" variant="outline" onClick={addModule} className="gap-2">
                                                    <Plus className="h-4 w-4" /> Ajouter un module
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                {(form.data.modules || []).map((m: ModuleDraft, mi: number) => (
                                                    <div key={mi} className="rounded-md border p-4 space-y-4">
                                                        <div className="flex items-start gap-4">
                                                            <div className="flex-1 grid gap-3 md:grid-cols-2">
                                                                <div className="space-y-1">
                                                                    <Label>Titre du module</Label>
                                                                    <Input value={m.title} onChange={(e) => updateModule(mi, { title: e.target.value })} placeholder={`Module ${mi + 1}`} />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label>Description</Label>
                                                                    <Input value={m.description || ""} onChange={(e) => updateModule(mi, { description: e.target.value })} placeholder="Description du module (optionnel)" />
                                                                </div>
                                                            </div>
                                                            <Button type="button" variant="destructive" size="icon" onClick={() => removeModule(mi)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <Label>Leçons</Label>
                                                                <Button type="button" variant="secondary" onClick={() => addLesson(mi)} className="gap-2">
                                                                    <Plus className="h-4 w-4" /> Ajouter une leçon
                                                                </Button>
                                                            </div>
                                                            <div className="space-y-3">
                                                                {(m.lessons || []).map((les: LessonDraft, li: number) => (
                                                                    <div key={li} className="rounded border p-3 space-y-3">
                                                                        <div className="flex items-start gap-3">
                                                                            <div className="grid gap-3 md:grid-cols-2 flex-1">
                                                                                <div className="space-y-1">
                                                                                    <Label>Titre</Label>
                                                                                    <Input value={les.title} onChange={(e) => updateLesson(mi, li, { title: e.target.value })} placeholder="Titre de la leçon" />
                                                                                </div>
                                                                                <div className="space-y-1">
                                                                                    <Label>Type</Label>
                                                                                    <Select value={les.type} onValueChange={(v) => updateLesson(mi, li, { type: v as LessonDraft['type'], content_url: "", file: undefined })}>
                                                                                        <SelectTrigger className="w-full"><SelectValue placeholder="Type de contenu" /></SelectTrigger >
                                                                                        <SelectContent>
                                                                                            <SelectItem value="video">Vidéo (YouTube)</SelectItem>
                                                                                            <SelectItem value="pdf">PDF / Ebook</SelectItem>
                                                                                        </SelectContent>
                                                                                    </Select>
                                                                                </div>
                                                                                {les.type === 'video' ? (
                                                                                    <div className="space-y-1 md:col-span-2">
                                                                                        <Label>Lien YouTube</Label>
                                                                                        <Input value={les.content_url || ""} onChange={(e) => updateLesson(mi, li, { content_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="space-y-1 md:col-span-2">
                                                                                        <Label>Fichier PDF</Label>
                                                                                        <Dropzone accept="application/pdf" multiple={false} onFiles={(files) => updateLesson(mi, li, { file: files[0] })}>
                                                                                            <span>Glissez-déposez un PDF ou cliquez pour sélectionner</span>
                                                                                        </Dropzone>
                                                                                    </div>
                                                                                )}
                                                                                <div className="space-y-1">
                                                                                    <Label>Durée (secondes, optionnel)</Label>
                                                                                    <Input type="number" min="0" value={les.duration_seconds || ""} onChange={(e) => updateLesson(mi, li, { duration_seconds: e.target.value })} />
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <Checkbox id={`prev_${mi}_${li}`} checked={!!les.is_preview} onCheckedChange={(v) => updateLesson(mi, li, { is_preview: !!v })} />
                                                                                    <Label htmlFor={`prev_${mi}_${li}`} className="text-sm">Leçon d'aperçu (gratuite)</Label>
                                                                                </div>
                                                                            </div>
                                                                            <Button type="button" variant="outline" size="icon" onClick={() => removeLesson(mi, li)}>
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t px-6 py-4">
                                    <Button type="button" variant="outline" onClick={() => form.reset()}>Annuler</Button>
                                    <Button type="submit" disabled={form.processing}>{form.processing ? 'Enregistrement...' : 'Créer la formation'}</Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </TabsContent>
                </Tabs >
                <Dialog open={!!selectedCourse} onOpenChange={(open) => { if (!open) setSelectedCourse(null); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Détails de la formation</DialogTitle>
                            <DialogDescription>Vue détaillée de la formation sélectionnée.</DialogDescription>
                        </DialogHeader>
                        {selectedCourse && (
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    {selectedCourse.cover_image ? (
                                        <img
                                            src={`/storage/${selectedCourse.cover_image}`}
                                            alt={selectedCourse.title}
                                            className="h-24 w-40 rounded-md object-cover flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="h-24 w-40 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                                            Pas de cover
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-base">{selectedCourse.title}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            Créée le {selectedCourse.created_at ? new Date(selectedCourse.created_at).toLocaleDateString('fr-FR') : "—"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {selectedCourse.product?.name ? `Produit lié : ${selectedCourse.product.name}` : "Aucun produit lié"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Modules : {selectedCourse.modules_count ?? 0} • Leçons : {selectedCourse.lessons_count ?? 0} • Inscrits : {selectedCourse.enrollments_count ?? 0}
                                        </p>
                                        {selectedCourse.duration_seconds ? (
                                            <p className="text-xs text-muted-foreground">
                                                Durée estimée ~ {Math.round((selectedCourse.duration_seconds / 60) || 0)} minutes
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                                {selectedCourse.description && (
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-medium">Description</h4>
                                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                                            {selectedCourse.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
                <Dialog open={!!courseToDelete} onOpenChange={(open) => { if (!open) setCourseToDelete(null); }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmer la suppression</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer cette formation&nbsp;?
                                Cette action est définitive et supprimera également les modules, leçons et inscriptions associées.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setCourseToDelete(null)}
                            >
                                Annuler
                            </Button>
                            <Button
                                variant="destructive"
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                Supprimer
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div >
        </AppLayout >
    );
}
