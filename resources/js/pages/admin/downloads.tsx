import AppLayout from "@/layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import React, { useMemo, useState } from "react";

interface DownloadLog {
    id: string;
    user?: { name?: string; email?: string };
    product?: { name?: string; version?: string };
    ip_address?: string;
    user_agent?: string;
    downloaded_at?: string;
    file_size?: number;
    status?: string;
    file_version?: string;
    timestamp?: string;
}

export default function AdminDownloads() {
    const { logs = [] } = usePage().props as { logs?: DownloadLog[] };
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return logs;
        return logs.filter((l: DownloadLog) => {
            const user = `${l.user?.name ?? ""} ${l.user?.email ?? ""}`.toLowerCase();
            const product = `${l.product?.name ?? ""} ${l.product?.version ?? ""}`.toLowerCase();
            const ip = (l.ip_address ?? "").toLowerCase();
            const ua = (l.user_agent ?? "").toLowerCase();
            return user.includes(query) || product.includes(query) || ip.includes(query) || ua.includes(query);
        });
    }, [logs, q]);

    const formatDate = (d?: string) => (d ? new Date(d).toLocaleString("fr-FR") : "—");

    return (
        <AppLayout breadcrumbs={[{ title: "Admin", href: "/admin" }, { title: "Téléchargements", href: "/admin/downloads" }]}>
            <Head title="Logs de téléchargements" />
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Historique des téléchargements</CardTitle>
                        <CardDescription>Liste détaillée des téléchargements effectués par les utilisateurs</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-4 gap-3">
                            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher (utilisateur, produit, IP, user agent)" />
                            <Badge  className="text-sm shadow-lg bg-green-600 text-white px-3 py-1.5">{filtered.length} téléchargements</Badge>
                        </div>
                        <div className="border rounded-lg overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[180px]">Utilisateur</TableHead>
                                        <TableHead className="min-w-[180px]">Produit</TableHead>
                                        <TableHead className="min-w-[120px]">Version</TableHead>
                                        <TableHead className="min-w-[160px]">Adresse IP</TableHead>
                                        <TableHead className="min-w-[240px]">Navigateur</TableHead>
                                        <TableHead className="min-w-[180px]">Téléchargé le</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((l: DownloadLog) => (
                                        <TableRow key={l.id}>
                                            <TableCell>
                                                <div className="font-medium">{l.user?.name ?? "—"}</div>
                                                <div className="text-xs text-muted-foreground">{l.user?.email ?? ""}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{l.product?.name ?? "—"}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{l.file_version || l.product?.version || "—"}</Badge>
                                            </TableCell>
                                            <TableCell>{l.ip_address ?? "—"}</TableCell>
                                            <TableCell>
                                                <div className="max-w-[420px] truncate" title={l.user_agent}>{l.user_agent ?? "—"}</div>
                                            </TableCell>
                                            <TableCell>{formatDate(l.timestamp)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {filtered.length === 0 && (
                                <div className="p-6 text-sm text-muted-foreground">Aucun téléchargement trouvé.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
