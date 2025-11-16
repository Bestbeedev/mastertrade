import AppLayout from "@/layouts/app-layout";
import React from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { route } from "ziggy-js";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Dropzone from "@/components/ui/dropzone";
import type { BreadcrumbItem } from "@/types";

export default function AdminCourseEdit() {
    const { course, products = [] } = usePage().props as any;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Admin", href: "/admin" },
        { title: "Formations", href: "/admin/courses" },
        { title: course?.title || "Éditer", href: route('admin.courses.edit', course?.id) },
    ];

    const form = useForm({
        title: course?.title || "",
        description: course?.description || "",
        is_paid: !!course?.is_paid,
        price: course?.price ?? "",
        product_id: course?.product_id || "",
        cover_image: null as File | null,
        modules: (course?.modules || []).map((m: any, mi: number) => ({
            title: m.title,
            description: m.description || "",
            position: m.position ?? mi,
            lessons: (m.lessons || []).map((les: any, li: number) => ({
                title: les.title,
                type: les.type,
                content_url: les.content_url,
                is_preview: !!les.is_preview,
                duration_seconds: les.duration_seconds ?? "",
                position: les.position ?? li,
                // file?: new file to replace existing PDF
            })),
        })),
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
        lessons.push({ title: "", type: "video", content_url: "", is_preview: false, duration_seconds: "", position: lessons.length });
        modules[mi] = { ...modules[mi], lessons };
        form.setData("modules", modules);
    };
    const removeLesson = (mi: number, li: number) => {
        const modules = [...(form.data.modules || [])];
        const lessons = [...(modules[mi]?.lessons || [])];
        lessons.splice(li, 1);
        modules[mi] = { ...modules[mi], lessons: lessons.map((l, idx) => ({ ...l, position: idx })) };
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
        const t = toast.loading('Mise à jour de la formation...');
        // Method spoofing for PATCH
        const untransform = form.transform((data) => ({ ...data, _method: 'patch' }));
        form.post(route('admin.courses.update', course.id), {
            onSuccess: () => {
                toast.success('Formation mise à jour', { id: t });
            },
            onError: () => toast.error('Erreur lors de la mise à jour', { id: t }),
            onFinish: () => form.transform((d) => d),
            forceFormData: true,
        });
    };

    const { delete: destroy, processing: deleting } = useForm({});
    const onDelete = () => {
        const t = toast.loading('Suppression en cours...');
        destroy(route('admin.courses.destroy', course.id), {
            onSuccess: () => {
                toast.success('Formation supprimée', { id: t });
            },
            onError: () => toast.error('Erreur lors de la suppression', { id: t }),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Admin • Éditer ${course?.title || 'Formation'}`} />
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Button asChild variant="outline">
                        <Link href={route('admin.courses')}><ArrowLeft className="h-4 w-4 mr-2" />Retour</Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button variant="destructive" onClick={onDelete} disabled={deleting}><Trash2 className="h-4 w-4 mr-2" />Supprimer</Button>
                    </div>
                </div>

                <form onSubmit={onSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Éditer la Formation</CardTitle>
                            <CardDescription>Personnalisez les informations, modules et leçons</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Titre</Label>
                                        <Input id="title" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Payant ?</Label>
                                        <div className="flex items-center gap-2">
                                            <Checkbox id="is_paid" checked={!!form.data.is_paid} onCheckedChange={(v) => form.setData('is_paid', !!v)} />
                                            <Label htmlFor="is_paid" className="text-sm text-muted-foreground">Cocher si la formation est payante</Label>
                                        </div>
                                    </div>
                                    {form.data.is_paid && (
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Prix</Label>
                                            <Input id="price" type="number" min="0" step="0.01" value={form.data.price} onChange={(e) => form.setData('price', e.target.value)} />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="product_id">Produit lié (optionnel)</Label>
                                        <Select value={form.data.product_id} onValueChange={(v) => form.setData('product_id', v)}>
                                            <SelectTrigger className="w-full"><SelectValue placeholder="Sélectionnez un produit" /></SelectTrigger>
                                            <SelectContent>
                                                {products?.map((p: any) => (
                                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea id="description" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                            </div>

                            <div className="space-y-2">
                                <Label>Bannière de couverture</Label>
                                <Dropzone accept="image/*" multiple={false} onFiles={(files) => form.setData('cover_image', files[0] ?? null)}>
                                    <span>Glissez-déposez une image ou cliquez pour sélectionner</span>
                                </Dropzone>
                                {course?.cover_image && (
                                    <div className="text-xs text-muted-foreground">Image actuelle:</div>
                                )}
                                {course?.cover_image && (
                                    <img src={`/storage/${course.cover_image}`} alt="Cover" className="h-24 rounded border" />
                                )}
                                {form.data.cover_image && (
                                    <div className="text-xs text-muted-foreground">Nouvelle image: {form.data.cover_image.name}</div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Modules et Leçons</CardTitle>
                                        <CardDescription>Organisez la formation par étapes/modules</CardDescription>
                                    </div>
                                    <Button type="button" variant="outline" onClick={addModule} className="gap-2"><Plus className="h-4 w-4" /> Ajouter un module</Button>
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
                                                        <Input value={m.description || ''} onChange={(e) => updateModule(mi, { description: e.target.value })} placeholder="Description du module (optionnel)" />
                                                    </div>
                                                </div>
                                                <Button type="button" variant="destructive" size="icon" onClick={() => removeModule(mi)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label>Leçons</Label>
                                                    <Button type="button" variant="secondary" onClick={() => addLesson(mi)} className="gap-2"><Plus className="h-4 w-4" /> Ajouter une leçon</Button>
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
                                                                        <Select value={les.type} onValueChange={(v) => updateLesson(mi, li, { type: v, content_url: '', file: undefined })}>
                                                                            <SelectTrigger><SelectValue placeholder="Type de contenu" /></SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="video">Vidéo (YouTube)</SelectItem>
                                                                                <SelectItem value="pdf">PDF / Ebook</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    {les.type === 'video' ? (
                                                                        <div className="space-y-1 md:col-span-2">
                                                                            <Label>Lien YouTube</Label>
                                                                            <Input value={les.content_url || ''} onChange={(e) => updateLesson(mi, li, { content_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="space-y-1 md:col-span-2">
                                                                            <Label>Fichier PDF</Label>
                                                                            <Dropzone accept="application/pdf" multiple={false} onFiles={(files) => updateLesson(mi, li, { file: files[0] })}>
                                                                                <span>Glissez-déposez un PDF ou cliquez pour sélectionner</span>
                                                                            </Dropzone>
                                                                            {les.content_url && (
                                                                                <div className="text-xs text-muted-foreground">Fichier actuel: {les.content_url}</div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    <div className="space-y-1">
                                                                        <Label>Durée (secondes, optionnel)</Label>
                                                                        <Input type="number" min="0" value={les.duration_seconds || ''} onChange={(e) => updateLesson(mi, li, { duration_seconds: e.target.value })} />
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Checkbox id={`prev_${mi}_${li}`} checked={!!les.is_preview} onCheckedChange={(v) => updateLesson(mi, li, { is_preview: !!v })} />
                                                                        <Label htmlFor={`prev_${mi}_${li}`} className="text-sm">Leçon d'aperçu (gratuite)</Label>
                                                                    </div>
                                                                </div>
                                                                <Button type="button" variant="outline" size="icon" onClick={() => removeLesson(mi, li)}><Trash2 className="h-4 w-4" /></Button>
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
                            <Button type="button" variant="outline" asChild>
                                <Link href={route('admin.courses')}>Annuler</Link>
                            </Button>
                            <Button type="submit" disabled={form.processing}>{form.processing ? 'Enregistrement...' : 'Enregistrer'}</Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
