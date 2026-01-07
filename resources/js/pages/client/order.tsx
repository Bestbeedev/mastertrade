import AppLayout from "@/layouts/app-layout";
import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Package, ArrowLeft, Download, Receipt, FileText } from "lucide-react";
import { route } from "ziggy-js";
import { toast } from "sonner";
import { formatCFA } from "@/lib/utils";

interface OrderItem {
    id: string;
    status: string;
    amount?: number;
    items?: OrderItem[];
    customer?: { name?: string; email?: string; company?: string };
    product?: { name?: string; id?: string; download_url?: string };
    name?: string;
    quantity: number;
    created_at?: string;
    total?: number;
    price?: number;
    payment?: { method?: string; status?: string; transaction?: { id?: string; status?: string } };
    shipping?: { address?: string; method?: string; cost?: number; status?: string };
    licenseKey?: string;
    download_url?: string;
    product_id?: string;
}

// Cette page utilise uniquement la commande réelle fournie par le serveur.

export default function OrderPage({ order }: { order?: OrderItem | null }) {
    const currentOrder = order ? {
        ...order,
        amount: order.amount || 0,
        items: Array.isArray(order.items) ? order.items : [],
    } : null;

    const formatCurrency = (amount: number) => {
        return formatCFA(amount ?? 0);
    };

    const statusVariant = {
        completed: "default",
        pending: "secondary",
        processing: "outline",
        cancelled: "destructive",
        delivered: "default",
        shipped: "outline",
        paid: "default"
    } as const;


    const renderOrderDetails = (order: OrderItem) => (
        <div className="space-y-8">
            {/* En-tête de la commande */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-muted/20 rounded-lg">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">Commande #{order.id}</h2>
                        <Badge variant={statusVariant[order.status as keyof typeof statusVariant] || 'default'}>
                            {order.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">
                        Passée le {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : ''}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => {
                        navigator.clipboard.writeText(order.id);
                        toast.success("Numéro de commande copié !");
                    }}>
                        <FileText className="h-4 w-4 mr-2" />
                        Copier la référence
                    </Button>
                    <Button asChild>
                        <a href={route('orders.invoice', order.id)}>
                            <Receipt className="h-4 w-4 mr-2" />
                            Télécharger la facture
                        </a>
                    </Button>
                </div>
            </div>

            {/* Détails de la commande */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Articles */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Articles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Array.isArray(order.items) && order.items.length > 0 ? (
                                order.items.map((item: OrderItem) => (
                                    <div key={item.id} className="flex items-start justify-between border-b pb-4">
                                        <div className="flex gap-4">
                                            <div className="p-2 bg-muted rounded-md">
                                                <Package className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">{item.name || order.product?.name || 'Article'}</h4>
                                                {item.quantity || 0 > 0 && <p className="text-sm text-muted-foreground">Quantité: {item.quantity || 0}</p>}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {typeof item.total === 'number' && <p className="font-medium">{formatCurrency(item.total || 0)}</p>}
                                            {(item.quantity || 0) > 1 && typeof item.price === 'number' && (
                                                <p className="text-sm text-muted-foreground">
                                                    {formatCurrency(item.price || 0)} l'unité
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-muted-foreground">Aucun article détaillé</div>
                            )}

                            <div className="flex justify-between pt-4">
                                <span className="font-medium">Total</span>
                                <span className="text-lg font-bold">{formatCurrency(order.amount || 0)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Informations supplémentaires */}
                <div className="space-y-6">
                    {/* Client */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Client</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p className="font-medium">{order.customer?.name || 'Non spécifié'}</p>
                            <p className="text-muted-foreground">{order.customer?.email}</p>
                            {order.customer?.company && (
                                <p className="text-muted-foreground">{order.customer.company}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Paiement */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Paiement</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Méthode</span>
                                <span>{order.payment?.method || 'Non spécifié'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Statut</span>
                                <Badge variant={order.payment?.status === 'Payé' ? 'default' : 'outline'}>
                                    {order.payment?.status || 'En attente'}
                                </Badge>
                            </div>
                            {order.payment?.transaction && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Transaction</span>
                                    <span className="font-mono text-xs">{order.payment.transaction.id}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Livraison */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Livraison</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Méthode</span>
                                <span>{order.shipping?.method || 'Téléchargement'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Statut</span>
                                <Badge variant={order.shipping?.status === 'Livré' ? 'default' : 'outline'}>
                                    {order.shipping?.status || 'En préparation'}
                                </Badge>
                            </div>
                            {order.licenseKey && (
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-sm font-medium mb-2">Clé de licence</p>
                                    <div className="flex items-center gap-2">
                                        <code className="px-3 py-2 bg-muted rounded-md font-mono text-sm">
                                            {order.licenseKey}
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                if (order.licenseKey) {
                                                    navigator.clipboard.writeText(order.licenseKey);
                                                    toast.success('Clé de licence copiée !');
                                                }
                                            }}
                                        >
                                            <FileText className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );

    if (!currentOrder) {
        return (
            <AppLayout breadcrumbs={[{ title: "Commandes", href: route('orders') }, { title: `Commande`, href: "" }]}>
                <Head title={`Commande`} />
                <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Commande introuvable</CardTitle>
                            <CardDescription>Réessayez depuis la liste des commandes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline">
                                <Link href={route('orders')}>Retour aux commandes</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={[{ title: "Commandes", href: route('orders') }, { title: `Commande #${currentOrder.id}`, href: "" }]}>
            <Head title={`Commande #${currentOrder.id}`} />
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Button variant="ghost" asChild className="w-full sm:w-auto">
                        <Link href={route('orders')} className="flex items-center justify-center sm:justify-start gap-2">
                            <ArrowLeft className="h-4 w-4" /> Retour aux commandes
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Détails de la commande</CardTitle>
                        <CardDescription>Données réelles de la commande</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderOrderDetails(currentOrder)}
                        {currentOrder.status === 'completed' && currentOrder.product?.download_url && (
                            <div className="mt-4 flex justify-end">
                                <Button asChild>
                                    <a href={route('downloads.start', currentOrder.product_id)}>
                                        <Download className="h-4 w-4 mr-2" /> Télécharger le produit
                                    </a>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
