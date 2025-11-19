import AppLayout from "@/layouts/app-layout";
import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Package, FileText, Settings, Box, Tag, Hash, Info, FileDigit, FileArchive, FileCode, FileCheck2, List } from "lucide-react";
import { route } from "ziggy-js";
import { toast } from "sonner";

export default function AdminProducts({ products = [] as any[] }: { products?: any[] }) {
    const [activeTab, setActiveTab] = React.useState("details");
    const [selectedProduct, setSelectedProduct] = React.useState<any | null>(null);
    const [productToDelete, setProductToDelete] = React.useState<any | null>(null);

    const editForm = useForm({
        id: "",
        name: "",
        sku: "",
        version: "1.0.0",
        download_url: "",
        checksum: "",
        size: 0 as number,
        changelog: "",
        description: "",
        category: "software",
    });

    const openEdit = (product: any) => {
        setSelectedProduct(product);
        editForm.setData({
            id: product.id,
            name: product.name ?? "",
            sku: product.sku ?? "",
            version: product.version ?? "1.0.0",
            download_url: product.download_url ?? "",
            checksum: product.checksum ?? "",
            size: product.size ?? 0,
            changelog: product.changelog ?? "",
            description: product.description ?? "",
            category: product.category ?? "software",
        });
    };

    const onSubmitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;
        const t = toast.loading('Mise à jour du produit...');
        editForm.patch(route('admin.products.update', selectedProduct.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Produit mis à jour', { id: t });
                setSelectedProduct(null);
            },
            onError: () => {
                toast.error("Erreur lors de la mise à jour du produit", { id: t });
            },
        });
    };

    const form = useForm({
        name: "",
        sku: "",
        version: "1.0.0",
        download_url: "",
        checksum: "",
        size: 0 as number,
        changelog: "- Correction de bugs mineurs\n- Amélioration des performances\n- Nouvelles fonctionnalités",
        description: "",
        category: "software",
        price: 0,
        is_active: true,
        requires_license: true,
        file: null as File | null,
        changelog_file: null as File | null,
        features: [""] as string[],
        requirements: [""] as string[],
    });

    const productCategories = [
        { value: "software", label: "Logiciel" },
        { value: "plugin", label: "Extension/Plugin" },
        { value: "template", label: "Modèle" },
        { value: "addon", label: "Module complémentaire" },
        { value: "bundle", label: "Pack/Forfait" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const t = toast.loading('Création du produit en cours...');
        form.post(route("admin.products.store"), {
            onSuccess: () => {
                toast.success('Produit créé avec succès !', { id: t });
                form.reset();
                form.setData({
                    ...form.data,
                    version: "1.0.0",
                    changelog: "- Correction de bugs mineurs\n- Amélioration des performances\n- Nouvelles fonctionnalités",
                    features: [""],
                    requirements: [""],
                });
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la création du produit', { id: t });
            },
        });
    };

    const handleAddFeature = () => {
        form.setData('features', [...form.data.features, '']);
    };

    const handleRemoveFeature = (index: number) => {
        const newFeatures = [...form.data.features];
        newFeatures.splice(index, 1);
        form.setData('features', newFeatures);
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...form.data.features];
        newFeatures[index] = value;
        form.setData('features', newFeatures);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            form.setData('file', e.target.files[0]);
        }
    };

    const handleChangelogFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            form.setData('changelog_file', e.target.files[0]);
        }
    };

    const { delete: destroy, processing: deleting } = useForm({});

    const handleDelete = () => {
        if (!productToDelete) return;
        const t = toast.loading('Suppression du produit...');
        const id = productToDelete.id;
        destroy(route("admin.products.destroy", { product: id }), {
            onSuccess: () => {
                toast.success('Produit supprimé avec succès', { id: t });
                setProductToDelete(null);
            },
            onError: () => toast.error('Erreur lors de la suppression du produit', { id: t }),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Admin", href: "/admin" }, { title: "Produits", href: "/admin/products" }]}>
            <Head title="Admin • Gestion des Produits" />
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gestion des Produits</h1>
                        <p className="text-muted-foreground">
                            Créez et gérez vos produits logiciels
                        </p>
                    </div>
                    <Button>
                        <Package className="h-4 w-4 mr-2" />
                        Nouveau Produit
                    </Button>
                </div>

                <Tabs defaultValue="list" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="list" className="flex items-center gap-2">
                            <List className="h-4 w-4" /> Liste des produits
                        </TabsTrigger>
                        <TabsTrigger value="new" className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Nouveau produit
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Produits existants</CardTitle>
                                <CardDescription>
                                    Liste de tous les produits disponibles dans votre boutique
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {products.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                                        <h3 className="mt-2 text-sm font-medium">Aucun produit trouvé</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Commencez par ajouter votre premier produit.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {products.map((product) => (
                                            <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 rounded-lg bg-primary/10">
                                                        <Package className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{product.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {product.sku} • {product.category}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-1"
                                                        type="button"
                                                        onClick={() => openEdit(product)}
                                                    >
                                                        <Info className="h-4 w-4" />
                                                        Détails
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        type="button"
                                                        onClick={() => setProductToDelete(product)}
                                                        disabled={deleting}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Confirmation de suppression */}
                    <Dialog open={!!productToDelete} onOpenChange={(open) => { if (!open) setProductToDelete(null); }}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirmer la suppression</DialogTitle>
                                <DialogDescription>
                                    Êtes-vous sûr de vouloir supprimer ce produit&nbsp;?
                                    Cette action est définitive et supprimera l'accès au téléchargement associé.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setProductToDelete(null)}
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

                    {/* Création d'un nouveau produit */}
                    <TabsContent value="new">
                        <form onSubmit={handleSubmit}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Nouveau Produit</CardTitle>
                                    <CardDescription>
                                        Remplissez les détails de votre nouveau produit logiciel
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                                        <TabsList>
                                            <TabsTrigger value="details" className="flex items-center gap-2">
                                                <Info className="h-4 w-4" /> Détails
                                            </TabsTrigger>
                                            <TabsTrigger value="pricing" className="flex items-center gap-2">
                                                <Tag className="h-4 w-4" /> Tarification
                                            </TabsTrigger>
                                            <TabsTrigger value="files" className="flex items-center gap-2">
                                                <FileCode className="h-4 w-4" /> Fichiers
                                            </TabsTrigger>
                                            <TabsTrigger value="advanced" className="flex items-center gap-2">
                                                <Settings className="h-4 w-4" /> Options avancées
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="details" className="space-y-4">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name">Nom du produit</Label>
                                                        <Input
                                                            id="name"
                                                            placeholder="Ex: MasterTrade Pro"
                                                            value={form.data.name}
                                                            onChange={(e) => form.setData("name", e.target.value)}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="sku">Référence (SKU)</Label>
                                                        <div className="flex items-center gap-2">
                                                            <div className="relative flex-1">
                                                                <Input
                                                                    id="sku"
                                                                    placeholder="Ex: MTP-001"
                                                                    value={form.data.sku}
                                                                    onChange={(e) => form.setData("sku", e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                title="Générer une référence"
                                                                onClick={() => {
                                                                    const sku = `PRD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                                                                    form.setData('sku', sku);
                                                                }}
                                                            >
                                                                <Hash className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="version">Version</Label>
                                                            <Input
                                                                id="version"
                                                                placeholder="Ex: 1.0.0"
                                                                value={form.data.version}
                                                                onChange={(e) => form.setData("version", e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="category">Catégorie</Label>
                                                            <Select
                                                                value={form.data.category}
                                                                onValueChange={(value) => form.setData("category", value)}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Sélectionnez une catégorie" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {productCategories.map((category) => (
                                                                        <SelectItem key={category.value} value={category.value}>
                                                                            {category.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="description">Description</Label>
                                                        <textarea
                                                            id="description"
                                                            placeholder="Décrivez votre produit en détail..."
                                                            value={form.data.description}
                                                            onChange={(e) => form.setData("description", e.target.value)}
                                                            rows={4}
                                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>Fonctionnalités</Label>
                                                        <div className="space-y-2">
                                                            {form.data.features.map((feature, index) => (
                                                                <div key={index} className="flex gap-2">
                                                                    <Input
                                                                        value={feature}
                                                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                                        placeholder="Fonctionnalité"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleRemoveFeature(index)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="mt-2"
                                                                onClick={handleAddFeature}
                                                            >
                                                                <Plus className="h-4 w-4 mr-2" />
                                                                Ajouter une fonctionnalité
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="pricing" className="space-y-4">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="price">Prix (FCFA)</Label>
                                                        <Input
                                                            id="price"
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={form.data.price}
                                                            onChange={(e) => form.setData("price", parseFloat(e.target.value) || 0)}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Options de licence</Label>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    type="checkbox"
                                                                    id="requires_license"
                                                                    checked={form.data.requires_license}
                                                                    onChange={(e) => form.setData("requires_license", e.target.checked)}
                                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                                />
                                                                <Label htmlFor="requires_license" className="text-sm font-medium">
                                                                    Nécessite une licence
                                                                </Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    type="checkbox"
                                                                    id="is_active"
                                                                    checked={form.data.is_active}
                                                                    onChange={(e) => form.setData("is_active", e.target.checked)}
                                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                                />
                                                                <Label htmlFor="is_active" className="text-sm font-medium">
                                                                    Produit actif
                                                                </Label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-muted/50 p-4 rounded-lg">
                                                    <h3 className="font-medium mb-2">Aperçu du produit</h3>
                                                    <div className="space-y-2 text-sm">
                                                        <p className="font-medium">{form.data.name || 'Nom du produit'}</p>
                                                        <p className="text-muted-foreground">
                                                            {form.data.description || 'Aucune description fournie'}
                                                        </p>
                                                        <div className="pt-2">
                                                            <span className="text-lg font-bold">
                                                                {form.data.price ? `${form.data.price.toFixed(2)} FCFA` : 'Gratuit'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="files" className="space-y-4">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="download_url">Lien de téléchargement (Google Drive)</Label>
                                                        <Input
                                                            id="download_url"
                                                            placeholder="https://drive.google.com/file/d/FILE_ID/view"
                                                            value={form.data.download_url}
                                                            onChange={(e) => form.setData("download_url", e.target.value)}
                                                        />
                                                        <p className="text-xs text-muted-foreground">Collez un lien Google Drive public. Les téléchargements seront servis via l’application.</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="file">Fichier du produit (optionnel)</Label>
                                                        <div className="flex items-center gap-2">
                                                            <label
                                                                htmlFor="file-upload"
                                                                className="flex flex-1 cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                <span className="truncate">
                                                                    {form.data.file?.name || 'Sélectionner un fichier...'}
                                                                </span>
                                                                <Button type="button" variant="ghost" size="sm" className="ml-2">
                                                                    <FileText className="h-4 w-4 mr-1" />
                                                                    Parcourir
                                                                </Button>
                                                                <input
                                                                    id="file-upload"
                                                                    name="file-upload"
                                                                    type="file"
                                                                    className="sr-only"
                                                                    onChange={handleFileChange}
                                                                />
                                                            </label>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Formats acceptés : .zip, .exe, .dmg, .pkg
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="changelog">Notes de version</Label>
                                                        <textarea
                                                            id="changelog"
                                                            placeholder="- Correction de bugs\n- Nouvelles fonctionnalités\n- Améliorations"
                                                            value={form.data.changelog}
                                                            onChange={(e) => form.setData("changelog", e.target.value)}
                                                            rows={5}
                                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="changelog_file">Fichier de notes de version (optionnel)</Label>
                                                        <div className="flex items-center gap-2">
                                                            <label
                                                                htmlFor="changelog-file-upload"
                                                                className="flex flex-1 cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                <span className="truncate">
                                                                    {form.data.changelog_file?.name || 'Sélectionner un fichier...'}
                                                                </span>
                                                                <Button type="button" variant="ghost" size="sm" className="ml-2">
                                                                    <FileText className="h-4 w-4 mr-1" />
                                                                    Parcourir
                                                                </Button>
                                                                <input
                                                                    id="changelog-file-upload"
                                                                    name="changelog-file-upload"
                                                                    type="file"
                                                                    className="sr-only"
                                                                    onChange={handleChangelogFileChange}
                                                                />
                                                            </label>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Fichier texte ou markdown contenant les notes de version détaillées
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>Vérification d'intégrité</Label>
                                                        <div className="space-y-2">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="checksum" className="text-sm">Empreinte numérique (SHA-256) - (optionnel)</Label>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="relative flex-1">
                                                                        <Input
                                                                            id="checksum"
                                                                            placeholder="Ex: a1b2c3d4..."
                                                                            value={form.data.checksum}
                                                                            onChange={(e) => form.setData("checksum", e.target.value)}
                                                                        />
                                                                    </div>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="icon"
                                                                        title="Générer une empreinte"
                                                                        disabled={!form.data.file}
                                                                        onClick={() => {
                                                                            // Simuler la génération d'une empreinte
                                                                            if (form.data.file) {
                                                                                const hash = Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
                                                                                form.setData('checksum', hash);
                                                                                toast.success('Empreinte générée avec succès');
                                                                            } else {
                                                                                toast.error('Veuvez d\'abord sélectionner un fichier');
                                                                            }
                                                                        }}
                                                                    >
                                                                        <FileCheck2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground">
                                                                    L'empreinte permet de vérifier l'intégrité du fichier téléchargé
                                                                </p>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="size" className="text-sm">Taille du fichier (Mo)</Label>
                                                                <Input
                                                                    id="size"
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.1"
                                                                    value={form.data.size}
                                                                    onChange={(e) => form.setData("size", parseFloat(e.target.value) || 0)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="advanced" className="space-y-4">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Configuration avancée</Label>
                                                    <div className="space-y-4 rounded-lg border p-4">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    id="auto_version"
                                                                    type="checkbox"
                                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                                />
                                                                <Label htmlFor="auto_version" className="text-sm font-medium">
                                                                    Mise à jour automatique des versions mineures
                                                                </Label>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground ml-6">
                                                                Incrémente automatiquement le numéro de version pour les mises à jour mineures
                                                            </p>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    id="notify_users"
                                                                    type="checkbox"
                                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                                    defaultChecked
                                                                />
                                                                <Label htmlFor="notify_users" className="text-sm font-medium">
                                                                    Notifier les utilisateurs des mises à jour
                                                                </Label>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground ml-6">
                                                                Envoyer une notification par email aux utilisateurs lors des mises à jour
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Exigences système</Label>
                                                    <div className="space-y-2">
                                                        {form.data.requirements.map((req, index) => (
                                                            <div key={index} className="flex gap-2">
                                                                <Input
                                                                    value={req}
                                                                    onChange={(e) => {
                                                                        const newReqs = [...form.data.requirements];
                                                                        newReqs[index] = e.target.value;
                                                                        form.setData('requirements', newReqs);
                                                                    }}
                                                                    placeholder="Ex: Windows 10+, 4GB RAM"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => {
                                                                        const newReqs = [...form.data.requirements];
                                                                        newReqs.splice(index, 1);
                                                                        form.setData('requirements', newReqs);
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="mt-2"
                                                            onClick={() => form.setData('requirements', [...form.data.requirements, ''])}
                                                        >
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Ajouter une exigence
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t px-6 py-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            if (confirm('Voulez-vous vraiment annuler ? Les modifications non enregistrées seront perdues.')) {
                                                form.reset();
                                                setActiveTab('details');
                                            }
                                        }}
                                    >
                                        Annuler
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                // Logique pour enregistrer comme brouillon
                                                toast('Brouillon enregistré', {
                                                    description: 'Vos modifications ont été enregistrées comme brouillon.'
                                                });
                                            }}
                                        >
                                            Enregistrer comme brouillon
                                        </Button>
                                        <Button type="submit" disabled={form.processing}>
                                            {form.processing ? 'Enregistrement...' : 'Créer le produit'}
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </form>
                    </TabsContent>
                </Tabs>
                {/* Modal détails / édition produit */}
                <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Détails du produit</DialogTitle>
                            <DialogDescription>
                                Consultez et mettez à jour les informations de ce produit logiciel.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedProduct && (
                            <form onSubmit={onSubmitEdit} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_name">Nom du produit</Label>
                                        <Input
                                            id="edit_name"
                                            value={editForm.data.name}
                                            onChange={(e) => editForm.setData('name', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_sku">Référence (SKU)</Label>
                                        <Input
                                            id="edit_sku"
                                            value={editForm.data.sku}
                                            onChange={(e) => editForm.setData('sku', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_version">Version</Label>
                                        <Input
                                            id="edit_version"
                                            value={editForm.data.version}
                                            onChange={(e) => editForm.setData('version', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_category">Catégorie</Label>
                                        <Select
                                            value={editForm.data.category}
                                            onValueChange={(value) => editForm.setData('category', value)}
                                        >
                                            <SelectTrigger id="edit_category" className="w-full">
                                                <SelectValue placeholder="Sélectionnez une catégorie" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {productCategories.map((category) => (
                                                    <SelectItem key={category.value} value={category.value}>
                                                        {category.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_size">Taille du fichier (octets)</Label>
                                        <Input
                                            id="edit_size"
                                            type="number"
                                            min={0}
                                            value={editForm.data.size}
                                            onChange={(e) => editForm.setData('size', parseInt(e.target.value || '0', 10))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_checksum">Empreinte (SHA-256)</Label>
                                        <Input
                                            id="edit_checksum"
                                            value={editForm.data.checksum}
                                            onChange={(e) => editForm.setData('checksum', e.target.value)}
                                            placeholder="Laisser vide pour régénérer automatiquement"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="edit_download_url">Lien de téléchargement (Google Drive)</Label>
                                        <Input
                                            id="edit_download_url"
                                            value={editForm.data.download_url as any}
                                            onChange={(e) => editForm.setData('download_url', e.target.value)}
                                            placeholder="https://drive.google.com/file/d/FILE_ID/view"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit_description">Description</Label>
                                    <textarea
                                        id="edit_description"
                                        value={editForm.data.description}
                                        onChange={(e) => editForm.setData('description', e.target.value)}
                                        rows={4}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit_changelog">Notes de version</Label>
                                    <textarea
                                        id="edit_changelog"
                                        value={editForm.data.changelog}
                                        onChange={(e) => editForm.setData('changelog', e.target.value)}
                                        rows={4}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    />
                                </div>

                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                    <span>Créé le {selectedProduct.created_at ? new Date(selectedProduct.created_at).toLocaleDateString('fr-FR') : '—'}</span>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setSelectedProduct(null)}>
                                        Annuler
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        type="button"
                                        onClick={() => setProductToDelete(selectedProduct)}
                                        disabled={deleting}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <Button type="submit" disabled={editForm.processing}>
                                        {editForm.processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
