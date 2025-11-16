import AppLayout from "@/layouts/app-layout";
import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { route } from "ziggy-js";

export default function AdminLicenses({ licenses = [], products = [], users = [], filters = {} as any }: { licenses?: any[]; products?: any[]; users?: any[]; filters?: any }) {
    const [activeTab, setActiveTab] = React.useState("list");
    const [query, setQuery] = React.useState(filters.q ?? "");
    const [status, setStatus] = React.useState(filters.status ?? "");
    const [editing, setEditing] = React.useState<any | null>(null);

    const statusOptions = [
        { value: "all", label: "Tous" },
        { value: "active", label: "Actives" },
        { value: "expired", label: "Expirées" },
        { value: "inactive", label: "Inactives" },
    ];
    const typeOptions = [
        { value: "subscription", label: "Abonnement" },
        { value: "perpetual", label: "Perpétuelle" },
    ];

    const createForm = useForm({
        user_id: "",
        product_id: "",
        type: "subscription",
        status: "active",
        expiry_date: "",
        max_activations: 1 as number | string,
    });

    const editForm = useForm({
        status: "",
        type: "",
        expiry_date: "",
        max_activations: "" as any,
        user_id: "",
        product_id: "",
        regenerate_key: false,
    });

    const { delete: destroy, processing: deleting } = useForm({});

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route("admin.licenses"), { q: query, status }, { preserveState: true, replace: true });
    };

    const onCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const t = toast.loading("Création de la licence...");
        createForm.post(route("admin.licenses.store"), {
            onSuccess: () => {
                toast.success("Licence créée", { id: t });
                createForm.reset();
                setActiveTab("list");
            },
            onError: () => toast.error("Erreur lors de la création", { id: t }),
        });
    };

    const startEdit = (l: any) => {
        setEditing(l);
        editForm.setData({
            status: l.status ?? "",
            type: l.type ?? "",
            expiry_date: l.expiry_date ? new Date(l.expiry_date).toISOString().slice(0, 10) : "",
            max_activations: l.max_activations ?? "",
            user_id: l.user_id ?? "",
            product_id: l.product_id ?? "",
            regenerate_key: false,
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        const t = toast.loading("Mise à jour de la licence...");
        editForm.patch(route("admin.licenses.update", { license: editing.id }), {
            onSuccess: () => {
                toast.success("Licence mise à jour", { id: t });
                setEditing(null);
            },
            onError: () => toast.error("Erreur lors de la mise à jour", { id: t }),
            preserveScroll: true,
        });
    };

    const onDelete = (id: string) => {
        const t = toast.loading("Suppression de la licence...");
        destroy(route("admin.licenses.destroy", { license: id }), {
            onSuccess: () => toast.success("Licence supprimée", { id: t }),
            onError: () => toast.error("Erreur lors de la suppression", { id: t }),
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Admin", href: "/admin" }, { title: "Licences", href: "/admin/licenses" }]}>
            <Head title="Admin • Licences" />
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gestion des Licences</h1>
                        <p className="text-muted-foreground">Créer, filtrer et administrer les licences</p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="list">Liste</TabsTrigger>
                        <TabsTrigger value="new">Nouvelle</TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Licences</CardTitle>
                                <CardDescription>Liste des licences</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={onSearch} className="flex items-center gap-2 mb-4">
                                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Recherche clé, email ou produit" />
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((s) => (
                                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button type="submit" variant="outline">Filtrer</Button>
                                </form>
                                <div>
                                    <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Clé</TableHead>
                                                    <TableHead>Produit</TableHead>
                                                    <TableHead>Utilisateur</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Statut</TableHead>
                                                    <TableHead>Expire</TableHead>
                                                    <TableHead>Activations</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {licenses.map((l) => (
                                                    <TableRow key={l.id}>
                                                        <TableCell className="font-mono text-xs">{l.key}</TableCell>
                                                        <TableCell>{l.product?.name ?? "—"}{l.product?.version ? ` • v${l.product.version}` : ""}</TableCell>
                                                        <TableCell>{l.user?.name ?? "—"}</TableCell>
                                                        <TableCell className="uppercase text-xs">{l.type}</TableCell>
                                                        <TableCell className="uppercase text-xs">{l.status}</TableCell>
                                                        <TableCell>{l.expiry_date ? new Date(l.expiry_date).toLocaleDateString('fr-FR') : "—"}</TableCell>
                                                        <TableCell>{(l.activations_count ?? 0)}/{(l.max_activations ?? 1)}</TableCell>
                                                        <TableCell className="space-x-2">
                                                            <Button size="sm" variant="outline" onClick={() => startEdit(l)}>Éditer</Button>
                                                            <Button size="sm" variant="destructive" onClick={() => onDelete(l.id)} disabled={deleting}>Supprimer</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                            {licenses.length === 0 && <TableCaption>Aucune licence</TableCaption>}
                                        </Table>
                                    </div>

                                <Dialog open={!!editing} onOpenChange={(open) => { if (!open) setEditing(null); }}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Modifier la licence</DialogTitle>
                                            <DialogDescription>Mettre à jour les informations de la licence sélectionnée.</DialogDescription>
                                        </DialogHeader>
                                        {editing && (
                                            <form onSubmit={submitEdit} className="space-y-3">
                                                <div className="space-y-2">
                                                    <Label>Utilisateur</Label>
                                                    <Select value={editForm.data.user_id || ""} onValueChange={(v) => editForm.setData("user_id", v)}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Sélectionner" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {users.map((u: any) => (
                                                                <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Produit</Label>
                                                    <Select value={editForm.data.product_id || ""} onValueChange={(v) => editForm.setData("product_id", v)}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Sélectionner" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {products.map((p: any) => (
                                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-2">
                                                        <Label>Type</Label>
                                                        <Select value={editForm.data.type || "subscription"} onValueChange={(v) => editForm.setData("type", v)}>
                                                            <SelectTrigger className="w-full" >
                                                                <SelectValue placeholder="Type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {typeOptions.map((t) => (
                                                                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Statut</Label>
                                                        <Select value={editForm.data.status || "active"} onValueChange={(v) => editForm.setData("status", v)}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Statut" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {statusOptions.filter(s => s.value !== "all").map((s) => (
                                                                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="e_expiry">Expiration</Label>
                                                        <Input id="e_expiry" type="date" value={editForm.data.expiry_date || ""} onChange={(e) => editForm.setData("expiry_date", e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="e_max">Max activations</Label>
                                                        <Input id="e_max" type="number" min={1} value={editForm.data.max_activations ?? ""} onChange={(e) => editForm.setData("max_activations", e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input id="regen" type="checkbox" checked={!!editForm.data.regenerate_key} onChange={(e) => editForm.setData("regenerate_key", e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                                    <Label htmlFor="regen">Régénérer la clé</Label>
                                                </div>
                                                <div className="flex gap-2 justify-end">
                                                    <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Annuler</Button>
                                                    <Button type="submit">Enregistrer</Button>
                                                </div>
                                            </form>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="new">
                        <form onSubmit={onCreate}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Nouvelle licence</CardTitle>
                                    <CardDescription>Créer une licence</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label>Utilisateur</Label>
                                            <Select value={createForm.data.user_id || ""} onValueChange={(v) => createForm.setData("user_id", v)}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {users.map((u: any) => (
                                                        <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Produit</Label>
                                            <Select value={createForm.data.product_id || ""} onValueChange={(v) => createForm.setData("product_id", v)}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map((p: any) => (
                                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Type</Label>
                                            <Select value={createForm.data.type} onValueChange={(v) => createForm.setData("type", v)}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {typeOptions.map((t) => (
                                                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Statut</Label>
                                            <Select value={createForm.data.status} onValueChange={(v) => createForm.setData("status", v)}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Statut" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {statusOptions.filter(s => s.value !== "").map((s) => (
                                                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="c_expiry">Expiration</Label>
                                            <Input id="c_expiry" type="date" value={createForm.data.expiry_date} onChange={(e) => createForm.setData("expiry_date", e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="c_max">Max activations</Label>
                                            <Input id="c_max" type="number" min={1} value={createForm.data.max_activations} onChange={(e) => createForm.setData("max_activations", e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit">Créer</Button>
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
