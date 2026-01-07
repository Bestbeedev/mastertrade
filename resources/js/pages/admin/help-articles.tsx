import AppLayout from "@/layouts/app-layout";
import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { route } from "ziggy-js";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

const categories = [
    { value: "faq", label: "FAQ" },
    { value: "documentation", label: "Documentation" },
    { value: "tutorial", label: "Tutoriel" },
];

const statusFilters = [
    { value: "all", label: "Tous" },
    { value: "published", label: "Publiés" },
    { value: "draft", label: "Brouillons" },
];

function categoryLabel(category: string): string {
    const found = categories.find((c) => c.value === category);
    return found ? found.label : (category || "Général");
}

interface HelpArticle {
    id: string;
    title?: string;
    slug?: string;
    category?: string;
    summary?: string;
    content?: string;
    tags?: string;
    is_published?: boolean;
    is_popular?: boolean;
    status?: string;
    views?: number;
    created_at?: string;
    updated_at?: string;
}

interface HelpFilters {
    q?: string;
    category?: string;
    status?: string;
}

export default function AdminHelpArticles({ articles = [], filters = {} }: { articles?: HelpArticle[]; filters?: HelpFilters }) {
    const [activeTab, setActiveTab] = React.useState("list");
    const [search, setSearch] = React.useState<string>(filters.q ?? "");
    const [filterCategory, setFilterCategory] = React.useState<string>(filters.category ?? "all");
    const [filterStatus, setFilterStatus] = React.useState<string>(filters.status ?? "all");

    const [editing, setEditing] = React.useState<HelpArticle | null>(null);
    const [articleToDelete, setArticleToDelete] = React.useState<HelpArticle | null>(null);

    const createForm = useForm({
        title: "",
        slug: "",
        category: "faq",
        summary: "",
        content: "",
        tags: "",
        is_published: true,
        is_popular: false,
    });

    const editForm = useForm({
        title: "",
        slug: "",
        category: "faq",
        summary: "",
        content: "",
        tags: "",
        is_published: false,
        is_popular: false,
    });

    const { delete: destroy, processing: deleting } = useForm({});

    const onFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("admin.help-articles"),
            { q: search, category: filterCategory, status: filterStatus },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    };

    const startEdit = (article: HelpArticle) => {
        setEditing(article);
        editForm.setData({
            title: article.title ?? "",
            slug: article.slug ?? "",
            category: article.category ?? "faq",
            summary: article.summary ?? "",
            content: article.content ?? "",
            tags: article.tags ?? "",
            is_published: !!article.is_published,
            is_popular: !!article.is_popular,
        });
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const t = toast.loading("Création de l'article d'aide...");
        createForm.post(route("admin.help-articles.store"), {
            onSuccess: () => {
                toast.success("Article créé", { id: t });
                createForm.reset();
                createForm.setData({
                    title: "",
                    slug: "",
                    category: "faq",
                    summary: "",
                    content: "",
                    tags: "",
                    is_published: true,
                    is_popular: false,
                });
                setActiveTab("list");
            },
            onError: () => toast.error("Erreur lors de la création", { id: t }),
            preserveScroll: true,
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        const t = toast.loading("Mise à jour de l'article d'aide...");
        editForm.patch(route("admin.help-articles.update", { article: editing.id }), {
            onSuccess: () => {
                toast.success("Article mis à jour", { id: t });
                setEditing(null);
            },
            onError: () => toast.error("Erreur lors de la mise à jour", { id: t }),
            preserveScroll: true,
        });
    };

    const confirmDelete = () => {
        if (!articleToDelete) return;
        const t = toast.loading("Suppression de l'article d'aide...");
        destroy(route("admin.help-articles.destroy", { article: articleToDelete.id }), {
            onSuccess: () => {
                toast.success("Article supprimé", { id: t });
                setArticleToDelete(null);
            },
            onError: () => toast.error("Erreur lors de la suppression", { id: t }),
            preserveScroll: true,
        });
    };

    const formatDate = (value?: string) => {
        if (!value) return "";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleDateString("fr-FR");
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Admin", href: "/admin" }, { title: "Articles d'aide", href: "/admin/help-articles" }]}>
            <Head title="Admin • Articles d'aide" />
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gestion des articles d'aide</h1>
                        <p className="text-muted-foreground">
                            Créez et organisez les contenus du centre d'aide (FAQ, documentation, tutoriels).
                        </p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="list">Liste des articles</TabsTrigger>
                        <TabsTrigger value="new">Nouvel article</TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Articles existants</CardTitle>
                                <CardDescription>Filtrez et gérez les contenus du centre d'aide.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={onFilterSubmit} className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] items-center">
                                    <Input
                                        placeholder="Recherche dans le titre, le résumé, le contenu..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Toutes les catégories</SelectItem>
                                            {categories.map((c) => (
                                                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusFilters.map((s) => (
                                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button type="submit" variant="outline">Filtrer</Button>
                                </form>

                                <div className="space-y-2">
                                    {articles.length === 0 && (
                                        <p className="text-sm text-muted-foreground py-4">
                                            Aucun article d'aide pour le moment. Créez votre premier contenu dans l'onglet "Nouvel article".
                                        </p>
                                    )}
                                    {articles.map((a: HelpArticle) => (
                                        <div key={a.id} className="flex items-start justify-between gap-4 p-3 border rounded-lg bg-card/50">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {categoryLabel(a.category || "")}
                                                    </Badge>
                                                    <Badge variant={a.is_published ? "default" : "outline"} className="text-xs">
                                                        {a.is_published ? "Publié" : "Brouillon"}
                                                    </Badge>
                                                    {a.is_popular && (
                                                        <Badge variant="secondary" className="text-xs">Populaire</Badge>
                                                    )}
                                                </div>
                                                <div className="font-medium">
                                                    {a.title}
                                                </div>
                                                {a.summary && (
                                                    <div className="text-xs text-muted-foreground line-clamp-2">
                                                        {a.summary}
                                                    </div>
                                                )}
                                                <div className="text-[11px] text-muted-foreground flex flex-wrap gap-3 mt-1">
                                                    <span>Créé le {formatDate(a.created_at)}</span>
                                                    {typeof a.views === 'number' && <span>{a.views} vues</span>}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 items-end">
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8"
                                                    onClick={() => startEdit(a)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="destructive"
                                                    className="h-8 w-8"
                                                    onClick={() => setArticleToDelete(a)}
                                                    disabled={deleting}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Dialog open={!!editing} onOpenChange={(open) => { if (!open) setEditing(null); }}>
                            <DialogContent className="max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Modifier l'article d'aide</DialogTitle>
                                    <DialogDescription>
                                        Mettez à jour le contenu de l'article sélectionné.
                                    </DialogDescription>
                                </DialogHeader>
                                {editing && (
                                    <form onSubmit={submitEdit} className="space-y-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="e_title">Titre</Label>
                                            <Input
                                                id="e_title"
                                                value={editForm.data.title}
                                                onChange={(e) => editForm.setData("title", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="e_slug">Slug (facultatif)</Label>
                                                <Input
                                                    id="e_slug"
                                                    value={editForm.data.slug || ""}
                                                    onChange={(e) => editForm.setData("slug", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Catégorie</Label>
                                                <Select
                                                    value={editForm.data.category}
                                                    onValueChange={(v) => editForm.setData("category", v)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Catégorie" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((c) => (
                                                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="e_summary">Résumé</Label>
                                            <textarea
                                                id="e_summary"
                                                rows={3}
                                                value={editForm.data.summary || ""}
                                                onChange={(e) => editForm.setData("summary", e.target.value)}
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="e_content">Contenu</Label>
                                            <textarea
                                                id="e_content"
                                                rows={8}
                                                value={editForm.data.content || ""}
                                                onChange={(e) => editForm.setData("content", e.target.value)}
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="e_tags">Tags (séparés par des virgules)</Label>
                                            <Input
                                                id="e_tags"
                                                value={editForm.data.tags || ""}
                                                onChange={(e) => editForm.setData("tags", e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            <label className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={!!editForm.data.is_published}
                                                    onChange={(e) => editForm.setData("is_published", e.target.checked)}
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <span>Publié</span>
                                            </label>
                                            <label className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={!!editForm.data.is_popular}
                                                    onChange={(e) => editForm.setData("is_popular", e.target.checked)}
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <span>Mettre en avant (article populaire)</span>
                                            </label>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Annuler</Button>
                                            <Button type="submit">Enregistrer</Button>
                                        </div>
                                    </form>
                                )}
                            </DialogContent>
                        </Dialog>

                        <Dialog open={!!articleToDelete} onOpenChange={(open) => { if (!open) setArticleToDelete(null); }}>
                            <DialogContent className="max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Confirmer la suppression</DialogTitle>
                                    <DialogDescription>
                                        Êtes-vous sûr de vouloir supprimer cet article d'aide ? Cette action est définitive.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setArticleToDelete(null)}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={confirmDelete}
                                        disabled={deleting}
                                    >
                                        Supprimer
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    <TabsContent value="new">
                        <form onSubmit={submitCreate}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Nouvel article d'aide</CardTitle>
                                    <CardDescription>
                                        Créez un article pour enrichir le centre d'aide.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="c_title">Titre</Label>
                                        <Input
                                            id="c_title"
                                            value={createForm.data.title}
                                            onChange={(e) => createForm.setData("title", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="c_slug">Slug (facultatif)</Label>
                                            <Input
                                                id="c_slug"
                                                value={createForm.data.slug || ""}
                                                onChange={(e) => createForm.setData("slug", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Catégorie</Label>
                                            <Select
                                                value={createForm.data.category}
                                                onValueChange={(v) => createForm.setData("category", v)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Catégorie" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((c) => (
                                                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="c_summary">Résumé</Label>
                                        <textarea
                                            id="c_summary"
                                            rows={3}
                                            value={createForm.data.summary || ""}
                                            onChange={(e) => createForm.setData("summary", e.target.value)}
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="c_content">Contenu</Label>
                                        <textarea
                                            id="c_content"
                                            rows={8}
                                            value={createForm.data.content || ""}
                                            onChange={(e) => createForm.setData("content", e.target.value)}
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="c_tags">Tags (séparés par des virgules)</Label>
                                        <Input
                                            id="c_tags"
                                            value={createForm.data.tags || ""}
                                            onChange={(e) => createForm.setData("tags", e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={!!createForm.data.is_published}
                                                onChange={(e) => createForm.setData("is_published", e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span>Publié</span>
                                        </label>
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={!!createForm.data.is_popular}
                                                onChange={(e) => createForm.setData("is_popular", e.target.checked)}
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span>Mettre en avant (article populaire)</span>
                                        </label>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit">Créer l'article</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
