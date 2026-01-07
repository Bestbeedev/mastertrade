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

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    country?: string;
    role_id?: string;
    role?: { id: string; name: string };
    created_at?: string;
    updated_at?: string;
}

interface Role {
    id: string;
    name: string;
}

interface UserFilters {
    q?: string;
}

export default function AdminUsers({ users = [], roles = [], filters = {} }: { users?: User[]; roles?: Role[]; filters?: UserFilters }) {
    const [activeTab, setActiveTab] = React.useState("list");
    const [query, setQuery] = React.useState(filters.q ?? "");
    const [editing, setEditing] = React.useState<User | null>(null);
    const [userToDelete, setUserToDelete] = React.useState<User | null>(null);

    const createForm = useForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        country: "",
        role_id: "",
    });

    const editForm = useForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        country: "",
        role_id: "",
    });

    const { delete: destroy, processing: deleting } = useForm({});

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route("admin.users"), { q: query }, { preserveState: true, replace: true });
    };

    const onCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const t = toast.loading("Création de l'utilisateur...");
        createForm.post(route("admin.users.store"), {
            onSuccess: () => {
                toast.success("Utilisateur créé", { id: t });
                createForm.reset();
                setActiveTab("list");
            },
            onError: () => toast.error("Erreur lors de la création", { id: t }),
        });
    };

    const startEdit = (u: User) => {
        setEditing(u);
        editForm.setData({
            name: u.name ?? "",
            email: u.email ?? "",
            password: "",
            phone: u.phone ?? "",
            country: u.country ?? "",
            role_id: u.role_id ?? "",
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        const t = toast.loading("Mise à jour de l'utilisateur...");
        editForm.patch(route("admin.users.update", { user: editing.id }), {
            onSuccess: () => {
                toast.success("Utilisateur mis à jour", { id: t });
                setEditing(null);
            },
            onError: () => toast.error("Erreur lors de la mise à jour", { id: t }),
            preserveScroll: true,
        });
    };

    const onDelete = () => {
        if (!userToDelete) return;
        const t = toast.loading("Suppression de l'utilisateur...");
        const id = userToDelete.id;
        destroy(route("admin.users.destroy", { user: id }), {
            onSuccess: () => {
                toast.success("Utilisateur supprimé", { id: t });
                setUserToDelete(null);
            },
            onError: () => toast.error("Erreur lors de la suppression", { id: t }),
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Admin", href: "/admin" }, { title: "Utilisateurs", href: "/admin/users" }]}>
            <Head title="Admin • Utilisateurs" />
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
                        <p className="text-muted-foreground">Créer, rechercher et administrer les utilisateurs</p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="list">Liste</TabsTrigger>
                        <TabsTrigger value="new">Nouveau</TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Utilisateurs</CardTitle>
                                <CardDescription>Liste des utilisateurs</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={onSearch} className="flex items-center gap-2 mb-4">
                                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Recherche nom ou email" />
                                    <Button type="submit" variant="outline">Rechercher</Button>
                                </form>
                                <div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nom</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Rôle</TableHead>
                                                <TableHead>Pays</TableHead>
                                                <TableHead>Téléphone</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.map((u) => (
                                                <TableRow key={u.id}>
                                                    <TableCell className="font-medium">{u.name}</TableCell>
                                                    <TableCell>{u.email}</TableCell>
                                                    <TableCell>{u.role?.name ?? "—"}</TableCell>
                                                    <TableCell>{u.country ?? "—"}</TableCell>
                                                    <TableCell>{u.phone ?? "—"}</TableCell>
                                                    <TableCell className="space-x-2">
                                                        <Button size="sm" variant="outline" onClick={() => startEdit(u)}>Éditer</Button>
                                                        <Button size="sm" variant="destructive" onClick={() => setUserToDelete(u)} disabled={deleting}>Supprimer</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        {users.length === 0 && <TableCaption>Aucun utilisateur</TableCaption>}
                                    </Table>
                                </div>

                                <Dialog open={!!editing} onOpenChange={(open) => { if (!open) setEditing(null); }}>
                                    <DialogContent className="max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Modifier l'utilisateur</DialogTitle>
                                            <DialogDescription>Mettez à jour les informations de l'utilisateur sélectionné.</DialogDescription>
                                        </DialogHeader>
                                        {editing && (
                                            <form onSubmit={submitEdit} className="space-y-3">
                                                <div className="space-y-2">
                                                    <Label htmlFor="e_name">Nom</Label>
                                                    <Input id="e_name" value={editForm.data.name} onChange={(e) => editForm.setData("name", e.target.value)} required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="e_email">Email</Label>
                                                    <Input id="e_email" type="email" value={editForm.data.email} onChange={(e) => editForm.setData("email", e.target.value)} required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="e_password">Mot de passe</Label>
                                                    <Input id="e_password" type="password" placeholder="Laisser vide pour conserver" value={editForm.data.password} onChange={(e) => editForm.setData("password", e.target.value)} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="e_phone">Téléphone</Label>
                                                        <Input id="e_phone" value={editForm.data.phone} onChange={(e) => editForm.setData("phone", e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="e_country">Pays</Label>
                                                        <Input id="e_country" value={editForm.data.country} onChange={(e) => editForm.setData("country", e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Rôle</Label>
                                                    <Select value={editForm.data.role_id || ""} onValueChange={(v) => editForm.setData("role_id", v)}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Sélectionner" />
                                                        </SelectTrigger>
                                                        <SelectContent>

                                                            {roles.map((r: Role) => (
                                                                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex gap-2 justify-end">
                                                    <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Annuler</Button>
                                                    <Button type="submit">Enregistrer</Button>
                                                </div>
                                            </form>
                                        )}
                                    </DialogContent>
                                </Dialog>

                                <Dialog open={!!userToDelete} onOpenChange={(open) => { if (!open) setUserToDelete(null); }}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Confirmer la suppression</DialogTitle>
                                            <DialogDescription>
                                                Êtes-vous sûr de vouloir supprimer cet utilisateur&nbsp;?
                                                Cette action est définitive et supprimera ses accès à la plateforme.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button
                                                variant="outline"
                                                type="button"
                                                onClick={() => setUserToDelete(null)}
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                type="button"
                                                onClick={onDelete}
                                                disabled={deleting}
                                            >
                                                Supprimer
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="new">
                        <form onSubmit={onCreate}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Nouvel utilisateur</CardTitle>
                                    <CardDescription>Créer un utilisateur</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nom</Label>
                                            <Input id="name" value={createForm.data.name} onChange={(e) => createForm.setData("name", e.target.value)} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" value={createForm.data.email} onChange={(e) => createForm.setData("email", e.target.value)} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Mot de passe</Label>
                                            <Input id="password" type="password" value={createForm.data.password} onChange={(e) => createForm.setData("password", e.target.value)} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Téléphone</Label>
                                            <Input id="phone" value={createForm.data.phone} onChange={(e) => createForm.setData("phone", e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="country">Pays</Label>
                                            <Input id="country" value={createForm.data.country} onChange={(e) => createForm.setData("country", e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Rôle</Label>
                                            <Select value={createForm.data.role_id || ""} onValueChange={(v) => createForm.setData("role_id", v)}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((r: { id?: string; name?: string }) => (
                                                        <SelectItem key={r.id || ''} value={r.id || ''}>{r.name || ''}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
