import AppLayout from "@/layouts/app-layout";
import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Package, ArrowLeft, Download, Receipt, FileText, Database, Zap } from "lucide-react";
import { route } from "ziggy-js";
import { toast } from "sonner";

// Données fictives pour la démonstration
const mockOrder = {
    id: "CMD-2024-001",
    product: "Application de Gestion Professionnelle",
    date: "15 Jan 2024",
    amount: 29900, // en centimes
    status: "completed",
    statusText: "Livrée",
    items: 1,
    licenseKey: "ABCD-EFGH-IJKL-MNOP",
    customer: {
        name: "Jean Dupont",
        email: "jean.dupont@example.com",
        company: "Entreprise ABC"
    },
    items: [
        {
            id: 1,
            name: "Application de Gestion Pro",
            price: 29900,
            quantity: 1,
            total: 29900
        }
    ],
    payment: {
        method: "Carte de crédit",
        transaction: "PAY-123456",
        status: "Payé",
        date: "15 Jan 2024 14:30"
    },
    shipping: {
        method: "Téléchargement",
        status: "Expédié",
        tracking: null
    }
};

export default function OrderPage({ order }: { order?: any }) {
    const realOrder = order ? {
        ...order,
        // Assurer que les montants sont au bon format
        amount: order.amount || 0,
        items: order.items?.map((item: any) => ({
            ...item,
            price: item.price || 0,
            total: (item.price || 0) * (item.quantity || 1)
        })) || []
    } : null;

    const [activeTab, setActiveTab] = React.useState(realOrder ? 'real' : 'mock');
    const currentOrder = activeTab === 'real' && realOrder ? realOrder : mockOrder;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount / 100);
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

    const handleDownload = (order: any) => {
        toast.success("Téléchargement en cours...");
        // Logique de téléchargement ici
        console.log("Téléchargement de la commande", order.id);
    };

    const renderOrderDetails = (order: any) => (
        <div className="space-y-8">
            {/* En-tête de la commande */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-muted/20 rounded-lg">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">Commande #{order.id}</h2>
                        <Badge variant={statusVariant[order.status as keyof typeof statusVariant] || 'default'}>
                            {order.statusText || order.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">
                        Passée le {order.date}
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
                    <Button onClick={() => handleDownload(order)}>
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger la facture
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
                            {order.items?.map((item: any) => (
                                <div key={item.id} className="flex items-start justify-between border-b pb-4">
                                    <div className="flex gap-4">
                                        <div className="p-2 bg-muted rounded-md">
                                            <Package className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">{item.name}</h4>
                                            <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{formatCurrency(item.total)}</p>
                                        {item.quantity > 1 && (
                                            <p className="text-sm text-muted-foreground">
                                                {formatCurrency(item.price)} l'unité
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-between pt-4">
                                <span className="font-medium">Total</span>
                                <span className="text-lg font-bold">{formatCurrency(order.amount)}</span>
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
                                    <span className="font-mono text-xs">{order.payment.transaction}</span>
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
                                                navigator.clipboard.writeText(order.licenseKey);
                                                toast.success('Clé de licence copiée !');
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

    return (
        <AppLayout breadcrumbs={[{ title: "Commandes", href: route('orders') }, { title: `Commande #${currentOrder.id}`, href: "" }]}>
            <Head title={`Commande #${currentOrder.id}`} />
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Button variant="ghost" asChild className="w-full sm:w-auto">
                        <a href={route('orders')} className="flex items-center justify-center sm:justify-start gap-2">
                            <ArrowLeft className="h-4 w-4" /> Retour aux commandes
                        </a>
                    </Button>

                    {realOrder && (
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full sm:w-auto"
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="real" className="flex items-center gap-2">
                                    <Database className="h-4 w-4" /> Données réelles
                                </TabsTrigger>
                                <TabsTrigger value="mock" className="flex items-center gap-2">
                                    <Zap className="h-4 w-4" /> Données fictives
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    )}
                </div>

                {activeTab === 'mock' && !realOrder && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Vous visualisez actuellement des données fictives. Aucune commande réelle n'a été trouvée.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Détails de la commande</CardTitle>
                        <CardDescription>
                            {activeTab === 'real' ? 'Données réelles de la commande' : 'Données fictives à titre d\'exemple'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderOrderDetails(currentOrder)}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
