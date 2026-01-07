import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { Search, FileText, Package, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DownloadHistory {
    id: string;
    product_name: string;
    product_version?: string;
    downloaded_at: string;
    file_size?: string;
    status?: 'completed' | 'failed' | 'pending';
    product?: { name?: string; version?: string };
    ip?: string;
}

export default function Download() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Téléchargements',
            href: '/client/download',
        },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const { history = [] } = usePage().props as { history?: DownloadHistory[] };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes Téléchargements" />

            {/* En-tête */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Téléchargements</h1>
                            <p className="text-muted-foreground mt-2">
                                Accédez à vos logiciels, documents et mises à jour
                            </p>
                        </div>

                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Historique des téléchargements */}
                <div className="mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Historique des téléchargements</CardTitle>
                            <CardDescription>Vos 50 derniers téléchargements</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {Array.isArray(history) && history.length > 0 ? (
                                <div className="divide-y">
                                    {history.map((h: DownloadHistory) => (
                                        <div key={h.id} className="py-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Package className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <div className="text-sm font-medium">
                                                        {h.product?.name || 'Produit'}{h.product?.version ? ` • v${h.product.version}` : ''}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">IP: {h.ip}</div>
                                                </div>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {h.downloaded_at ? new Date(h.downloaded_at).toLocaleString('fr-FR') : ''}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Aucun téléchargement enregistré pour le moment.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                {/* Suppression des listes fictives. La page se contente de l'historique réel et des infos ci-dessous. */}

                {/* Informations importantes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                            <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                            <CardTitle className="text-lg">Instructions importantes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• Sauvegardez vos données avant toute mise à jour</li>
                                <li>• Vérifiez la compatibilité système</li>
                                <li>• Consultez les notes de version</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                            <FileText className="h-5 w-5 text-blue-600 mr-2" />
                            <CardTitle className="text-lg">Support technique</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                                Besoin d'aide pour l'installation ou la mise à jour ?
                            </p>
                            <Button variant="outline" className="w-full">
                                Contacter le support
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
