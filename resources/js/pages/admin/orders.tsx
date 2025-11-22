import AppLayout from "@/layouts/app-layout";
import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { route } from "ziggy-js";
import { formatCFA } from "@/lib/utils";

export default function AdminOrders({ orders, statusCounts = {}, filters = { status: "" } }: { orders: any; statusCounts?: Record<string, number>; filters?: { status?: string } }) {
    const rows = Array.isArray(orders?.data) ? orders.data : [];

    const statuses: Array<{ value: string; label: string; variant?: any }> = [
        { value: "pending", label: "En attente" },
        { value: "paid", label: "Payée" },
        { value: "failed", label: "Échouée" },
        { value: "refunded", label: "Remboursée" },
    ];

    const StatusBadge = ({ s }: { s: string }) => {
        const map: Record<string, any> = {
            pending: "secondary",
            paid: "default",
            failed: "destructive",
            refunded: "secondary",
        };
        const label = statuses.find((x) => x.value === s)?.label || s;
        return <Badge variant={map[s] || "outline"}>{label}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Admin", href: route("admin") }, { title: "Commandes", href: route("admin.orders") }]}>
            <Head title="Admin • Commandes" />
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gestion des commandes</h1>
                        <p className="text-muted-foreground">Consultez et mettez à jour les commandes.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Filtres rapides</CardTitle>
                        <CardDescription>Par statut</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {(["", "pending", "paid", "failed", "refunded"] as const).map((s) => (
                            <Button key={s || "all"} asChild variant={filters.status === s ? "default" : "outline"} size="sm">
                                <Link href={route("admin.orders", s ? { status: s } : {})}>
                                    {s ? (
                                        <>
                                            <StatusBadge s={s} />
                                            <span className="ml-2">{statusCounts?.[s] ?? 0}</span>
                                        </>
                                    ) : (
                                        <>
                                            Tous
                                            <span className="ml-2">{Object.values(statusCounts || {}).reduce((a: any, b: any) => a + (b as number), 0)}</span>
                                        </>
                                    )}
                                </Link>
                            </Button>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Liste des commandes</CardTitle>
                        <CardDescription>
                            {rows.length} résultat{rows.length > 1 ? "s" : ""}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left border-b">
                                        <th className="py-2 pr-4">Réf.</th>
                                        <th className="py-2 pr-4">Client</th>
                                        <th className="py-2 pr-4">Produit</th>
                                        <th className="py-2 pr-4">Montant</th>
                                        <th className="py-2 pr-4">Statut</th>
                                        <th className="py-2 pr-4">Date</th>
                                        <th className="py-2 pr-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((o: any) => (
                                        <OrderRow key={o.id} order={o} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function OrderRow({ order }: { order: any }) {
    const edit = useForm({
        status: order.status as string,
        amount: (typeof order.amount === "number" ? order.amount : 0) / 100,
    });

    const onSave = () => {
        // convert displayed amount (units) to cents for backend
        edit.setData("amount", Math.round((Number(edit.data.amount) || 0) * 100) as any);
        edit.patch(route("admin.orders.update", order.id), {
            preserveScroll: true,
        });
    };

    return (
        <tr className="border-b align-top">
            <td className="py-3 pr-4 font-mono text-xs">{order.id}</td>
            <td className="py-3 pr-4">
                <div className="font-medium">{order.user?.name || "—"}</div>
                <div className="text-muted-foreground text-xs">{order.user?.email}</div>
            </td>
            <td className="py-3 pr-4">{order.product?.name || "—"}</td>
            <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={edit.data.amount as any}
                        onChange={(e) => edit.setData("amount", parseFloat(e.target.value || "0") || 0)}
                        className="w-28"
                    />
                    <span className="text-xs text-muted-foreground">{formatCFA(order.amount || 0)}</span>
                </div>
            </td>
            <td className="py-3 pr-4">
                <Select value={edit.data.status} onValueChange={(v) => edit.setData("status", v)}>
                    <SelectTrigger className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="paid">Payée</SelectItem>
                        <SelectItem value="failed">Échouée</SelectItem>
                        <SelectItem value="refunded">Remboursée</SelectItem>
                    </SelectContent>
                </Select>
            </td>
            <td className="py-3 pr-4 text-xs">{order.created_at ? new Date(order.created_at).toLocaleString("fr-FR") : ""}</td>
            <td className="py-3 pr-0 text-right">
                <Button size="sm" onClick={onSave} disabled={edit.processing}>
                    {edit.processing ? "..." : "Enregistrer"}
                </Button>
            </td>
        </tr>
    );
}
