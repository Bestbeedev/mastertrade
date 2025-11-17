import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Search, Download, Eye, Calendar, Package, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function Commande() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Commandes',
            href: '/client/commande',
        },
    ];

    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const { orders: realOrders = [] } = usePage().props as any;

    const formatCurrency = (amountCents: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((amountCents ?? 0) / 100);

    type OrderStatus = 'completed' | 'pending' | 'processing' | 'cancelled';

    const statusConfig = {
        completed: { variant: "default" as const, text: "Livrée" },
        pending: { variant: "secondary" as const, text: "En traitement" },
        processing: { variant: "outline" as const, text: "En cours" },
        cancelled: { variant: "destructive" as const, text: "Annulée" }
    } as const;

    const totalOrders = realOrders.length;
    const pendingCount = realOrders.filter((o: any) => o.status === 'pending').length;
    const deliveredCount = realOrders.filter((o: any) => o.status === 'completed').length;
    const totalSpent = realOrders.reduce((s: number, o: any) => s + (o.amount || 0), 0);
    const stats = [
        { title: "Commandes totales", value: String(totalOrders), description: "", icon: Package, trend: "neutral" },
        { title: "En attente", value: String(pendingCount), description: "", icon: Calendar, trend: "neutral" },
        { title: "Livrées", value: String(deliveredCount), description: "", icon: Download, trend: "neutral" },
        { title: "Dépensé total", value: formatCurrency(totalSpent), description: "", icon: "€", trend: "neutral" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes Commandes" />

            {/* En-tête */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Mes Commandes</h1>
                            <p className="text-muted-foreground mt-2">
                                Suivez l'état de vos commandes et téléchargements
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher une commande..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                    <SelectItem value="completed">Livrées</SelectItem>
                                    <SelectItem value="pending">En traitement</SelectItem>
                                    <SelectItem value="processing">En cours</SelectItem>
                                    <SelectItem value="cancelled">Annulées</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                {typeof stat.icon === 'string' ? (
                                    <div className="h-4 w-4 text-muted-foreground font-bold">
                                        {stat.icon}
                                    </div>
                                ) : (
                                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Liste des commandes */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Historique des commandes</CardTitle>
                                <CardDescription>
                                    Consultez toutes vos commandes passées
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <ArrowUpDown className="h-4 w-4" />
                                    Trier
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {realOrders.map((order: any) => {
                                const productName = order.product?.name ?? order.product;
                                const date = order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : '';
                                const amount = typeof order.amount === 'number' ? formatCurrency(order.amount) : String(order.amount ?? '');
                                const status = order.status as OrderStatus;
                                const statusText = (statusConfig[status]?.text) || String(order.status);
                                return (
                                    <div key={order.id} className="p-6 hover:bg-accent/50 transition-colors">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="p-3 bg-primary/10 rounded-lg">
                                                    <Package className="h-6 w-6 text-primary" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{productName}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {order.id}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {date}
                                                        </span>
                                                        {order.licenseKey && <span>Clé de licence: {order.licenseKey}</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start lg:items-end xl:items-center gap-4">
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-foreground">
                                                        {amount}
                                                    </div>
                                                    <Badge variant={statusConfig[status]?.variant}>
                                                        {statusText}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Button asChild variant="outline" size="sm">
                                                        <Link href={route('orders.show', order.id)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Détails
                                                        </Link>
                                                    </Button>

                                                    {status === 'completed' && order.product?.download_url && (
                                                        <Button asChild variant="default" size="sm">
                                                            <a href={route('downloads.start', order.product_id)}>
                                                                <Download className="h-4 w-4 mr-2" />
                                                                Télécharger
                                                            </a>
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Aucune commande */}
                        {realOrders.length === 0 && (
                            <div className="p-12 text-center">
                                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Aucune commande trouvée</h3>
                                <p className="text-muted-foreground mb-6">
                                    {searchTerm || statusFilter !== 'all'
                                        ? "Aucune commande ne correspond à vos critères de recherche."
                                        : "Vous n'avez pas encore passé de commande."
                                    }
                                </p>
                                <Button asChild>
                                    <Link href={route('catalogs')}>
                                        Explorer le catalogue
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
