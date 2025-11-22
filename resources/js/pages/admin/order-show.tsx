import AppLayout from "@/layouts/app-layout";
import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { route } from "ziggy-js";
import { formatCFA } from "@/lib/utils";
import { ArrowLeft, FileText, UserRound, Package } from "lucide-react";

export default function AdminOrderShow({ order }: { order: any }) {
    if (!order) {
        return (
            <AppLayout breadcrumbs={[{ title: "Admin", href: route("admin") }, { title: "Commandes", href: route("admin.orders") }, { title: "Commande", href: "" }]}>
                <Head title="Admin • Commande" />
                <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Commande introuvable</CardTitle>
                            <CardDescription>Retournez à la liste des commandes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline">
                                <Link href={route("admin.orders")}>Retour aux commandes</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    const edit = useForm({
        status: order.status as string,
        amount: (typeof order.amount === "number" ? order.amount : 0) / 100,
    });

    const save = () => {
        edit.setData("amount", Math.round((Number(edit.data.amount) || 0) * 100) as any);
        edit.patch(route("admin.orders.update", order.id), { preserveScroll: true });
    };

    const StatusBadge = ({ s }: { s: string }) => {
        const map: Record<string, any> = {
            pending: "secondary",
            paid: "default",
            failed: "destructive",
            refunded: "outline",
        };
        const label = ({ pending: "En attente", paid: "Payée", failed: "Échouée", refunded: "Remboursée" } as any)[s] || s;
        return <Badge variant={map[s] || "outline"}>{label}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Admin", href: route("admin") }, { title: "Commandes", href: route("admin.orders") }, { title: `Commande #${order.id?.slice(0, 8)}`, href: "" }]}>
            <Head title={`Admin • Commande #${order.id}`} />
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Button asChild variant="ghost">
                        <Link href={route("admin.orders")} className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" /> Retour
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                            <a href={route("orders.invoice", order.id)} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Facture PDF
                            </a>
                        </Button>
                        <Button onClick={save} disabled={edit.processing}>
                            {edit.processing ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Détails de la commande</CardTitle>
                        <CardDescription>Référence #{order.id}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex flex-wrap items-center gap-3">
                                    <StatusBadge s={edit.data.status} />
                                    <span className="text-sm">Créée le {order.created_at ? new Date(order.created_at).toLocaleString("fr-FR") : ""}</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="text-sm text-muted-foreground">Montant</div>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                value={edit.data.amount as any}
                                                onChange={(e) => edit.setData("amount", parseFloat(e.target.value || "0") || 0)}
                                                className="w-40"
                                            />
                                            <div className="text-xs text-muted-foreground">{formatCFA(order.amount || 0)}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm text-muted-foreground">Statut</div>
                                        <Select value={edit.data.status} onValueChange={(v) => edit.setData("status", v)}>
                                            <SelectTrigger className="w-48">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">En attente</SelectItem>
                                                <SelectItem value="paid">Payée</SelectItem>
                                                <SelectItem value="failed">Échouée</SelectItem>
                                                <SelectItem value="refunded">Remboursée</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 border rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <UserRound className="h-4 w-4" />
                                            <div className="font-medium">Client</div>
                                        </div>
                                        <div className="text-sm">{order.user?.name || "—"}</div>
                                        <div className="text-xs text-muted-foreground">{order.user?.email || ""}</div>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Package className="h-4 w-4" />
                                            <div className="font-medium">Produit</div>
                                        </div>
                                        <div className="text-sm">{order.product?.name || "—"}</div>
                                        {order.product?.download_url ? (
                                            <div className="text-xs text-muted-foreground truncate">{order.product.download_url}</div>
                                        ) : (
                                            <div className="text-xs text-muted-foreground">Aucun lien de téléchargement</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Button asChild variant="outline" className="w-full">
                                            <a href={route("orders.invoice", order.id)} target="_blank" rel="noreferrer" className="flex items-center gap-2 justify-center">
                                                <FileText className="h-4 w-4" /> Télécharger la facture
                                            </a>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
