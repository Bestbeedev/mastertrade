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
import { BookOpen, Plus, Trash2, Info } from "lucide-react";
import Dropzone from "@/components/ui/dropzone";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminCourses({ courses = [], products = [] as { id: string; name: string }[] }: { courses?: any[]; products?: { id: string; name: string }[] }) {
    const [activeTab, setActiveTab] = React.useState("list");
    const [selectedCourse, setSelectedCourse] = React.useState<any | null>(null);

    const form = useForm({
        title: "",
        description: "",
        is_paid: false as boolean,
        price: "" as any,
        product_id: "" as string,
        modules: [] as any[],
        cover_image: null as File | null,
    });

    const addModule = () => {
        const modules = [...(form.data.modules || [])];
        modules.push({ title: "", description: "", position: modules.length, lessons: [] });
        form.setData("modules", modules);
    };
    const removeModule = (mi: number) => {
        const modules = [...(form.data.modules || [])];
        modules.splice(mi, 1);
        form.setData("modules", modules.map((m, i) => ({ ...m, position: i })));
    };
    const updateModule = (mi: number, patch: any) => {
        const modules = [...(form.data.modules || [])];
        modules[mi] = { ...modules[mi], ...patch };
        form.setData("modules", modules);
    };
    const addLesson = (mi: number) => {
        const modules = [...(form.data.modules || [])];
        const lessons = [...(modules[mi]?.lessons || [])];
        lessons.push({ title: "", type: "video", content_url: "", is_preview: false, duration_seconds: "" });
        modules[mi] = { ...modules[mi], lessons };
        form.setData("modules", modules);
    };
    const removeLesson = (mi: number, li: number) => {
        const modules = [...(form.data.modules || [])];
        const lessons = [...(modules[mi]?.lessons || [])];
        lessons.splice(li, 1);
        modules[mi] = { ...modules[mi], lessons };
        form.setData("modules", modules);
    };
    const updateLesson = (mi: number, li: number, patch: any) => {
        const modules = [...(form.data.modules || [])];
        const lessons = [...(modules[mi]?.lessons || [])];
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
    const onDelete = (id: string) => {
        const t = toast.loading('Suppression en cours...');
        destroy(route("admin.courses.destroy", { course: id }), {
            onSuccess: () => toast.success('Formation supprimée', { id: t }),
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
                                        {courses.map((c: any) => (
                                            <div key={c.id} className="flex items-center justify-between p-3 gap-4">
                                                <div className="flex items-center gap-4 flex-1">
                                                    {c.cover_image ? (
                                                        <img
                                                            src={`/storage/${c.cover_image}`}
                                                            alt={c.title}
                                                            className="h-16 w-24 rounded-md object-cover flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="h-16 w-24 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                                                            Pas de cover
                                                        </div>
                                                    )}
                                                    <div className="space-y-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-medium truncate">{c.title}</div>
                                                            {c.is_paid && (
                                                                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                    Payante{c.price ? ` • ${(Number(c.price) || 0).toFixed(2)} €` : ""}
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
                                                <div className="flex items-center gap-2 flex-shrink-0">
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
                                                    <Button variant="destructive" size="sm" onClick={() => onDelete(c.id)} disabled={deleting}>
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
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title">Titre</Label>
                                                <Input id="title" value={form.data.title} onChange={(e) => form.setData("title", e.target.value)} placeholder="Titre de la formation" required />
                                            </div>
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

                                    <div className="space-y-2">
                                        <Label>Bannière de couverture</Label>
                                        <Dropzone accept="image/*" multiple={false} onFiles={(files) => form.setData('cover_image', files[0] ?? null)}>
                                            <span>Glissez-déposez une image ou cliquez pour sélectionner</span>
                                        </Dropzone>
                                        {form.data.cover_image && (
                                            <div className="text-xs text-muted-foreground">{form.data.cover_image.name}</div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
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
                                            {(form.data.modules || []).map((m: any, mi: number) => (
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

                                                    {/* Leçons */}
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <Label>Leçons</Label>
                                                            <Button type="button" variant="secondary" onClick={() => addLesson(mi)} className="gap-2">
                                                                <Plus className="h-4 w-4" /> Ajouter une leçon
                                                            </Button>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {(m.lessons || []).map((les: any, li: number) => (
                                                                <div key={li} className="rounded border p-3 space-y-3">
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="grid gap-3 md:grid-cols-2 flex-1">
                                                                            <div className="space-y-1">
                                                                                <Label>Titre</Label>
                                                                                <Input value={les.title} onChange={(e) => updateLesson(mi, li, { title: e.target.value })} placeholder="Titre de la leçon" />
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <Label>Type</Label>
                                                                                <Select value={les.type} onValueChange={(v) => updateLesson(mi, li, { type: v, content_url: "", file: undefined })}>
                                                                                    <SelectTrigger className="w-full"><SelectValue placeholder="Type de contenu" /></SelectTrigger>
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
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t px-6 py-4">
                                    <Button type="button" variant="outline" onClick={() => form.reset()}>Annuler</Button>
                                    <Button type="submit" disabled={form.processing}>{form.processing ? 'Enregistrement...' : 'Créer la formation'}</Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </TabsContent>
                </Tabs>
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
            </div>
        </AppLayout>
    );
}
