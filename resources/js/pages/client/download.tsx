import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { DownloadCloud, Search, Calendar, FileText, Package, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Download() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Téléchargements',
            href: '/client/download',
        },
    ];

    const [activeTab, setActiveTab] = useState<'software' | 'documents' | 'updates'>('software');
    const [searchTerm, setSearchTerm] = useState('');

    const downloads = {
        software: [
            {
                id: 1,
                name: "Application de Gestion v2.1",
                version: "2.1.0",
                fileSize: "156 MB",
                date: "15 Jan 2024",
                type: "Installeur Windows",
                icon: Package,
                category: "Stable",
                updates: false
            },
            {
                id: 2,
                name: "Outil Productivité v1.5",
                version: "1.5.2",
                fileSize: "89 MB",
                date: "10 Jan 2024",
                type: "Archive ZIP",
                icon: Package,
                category: "Stable",
                updates: true
            },
        ],
        documents: [
            {
                id: 1,
                name: "Guide d'installation complet",
                type: "PDF",
                fileSize: "2.4 MB",
                date: "15 Jan 2024",
                icon: FileText,
                category: "Documentation"
            },
            {
                id: 2,
                name: "Manuel utilisateur détaillé",
                type: "PDF",
                fileSize: "5.1 MB",
                date: "10 Jan 2024",
                icon: FileText,
                category: "Documentation"
            },
        ],
        updates: [
            {
                id: 1,
                name: "Application de Gestion v2.2",
                version: "2.2.0",
                fileSize: "162 MB",
                date: "Disponible",
                type: "Mise à jour",
                icon: Package,
                category: "Nouveauté",
                description: "Nouvelles fonctionnalités et corrections de bugs"
            }
        ]
    };

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
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="software" className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Logiciels
                        </TabsTrigger>
                        <TabsTrigger value="documents" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Documents
                        </TabsTrigger>
                        <TabsTrigger value="updates" className="flex items-center gap-2">
                            <DownloadCloud className="h-4 w-4" />
                            Mises à jour
                        </TabsTrigger>
                    </TabsList>

                    {/* Contenu des onglets */}
                    <TabsContent value="software" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Logiciels disponibles</CardTitle>
                                <CardDescription>
                                    Téléchargez vos logiciels sous licence
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {downloads.software.map((item) => (
                                        <div key={item.id} className="p-6 hover:bg-accent/50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-primary/10 rounded-lg">
                                                        <item.icon className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="font-semibold text-lg">{item.name}</h3>
                                                            <Badge variant="outline">{item.category}</Badge>
                                                            {item.updates && (
                                                                <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                                                    Mise à jour disponible
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <span>Version: {item.version}</span>
                                                            <span>Taille: {item.fileSize}</span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {item.date}
                                                            </span>
                                                            <span>{item.type}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Button>
                                                    <DownloadCloud className="h-4 w-4 mr-2" />
                                                    Télécharger
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="documents" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Documentation</CardTitle>
                                <CardDescription>
                                    Guides, manuels et ressources
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {downloads.documents.map((item) => (
                                        <div key={item.id} className="p-6 hover:bg-accent/50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                                        <item.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <span>Format: {item.type}</span>
                                                            <span>Taille: {item.fileSize}</span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {item.date}
                                                            </span>
                                                            <Badge variant="outline">{item.category}</Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Button variant="outline">
                                                    <DownloadCloud className="h-4 w-4 mr-2" />
                                                    Télécharger
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="updates" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mises à jour disponibles</CardTitle>
                                <CardDescription>
                                    Restez à jour avec les dernières versions
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {downloads.updates.map((item) => (
                                        <div key={item.id} className="p-6 hover:bg-accent/50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                                        <item.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="font-semibold text-lg">{item.name}</h3>
                                                            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                                Nouveau
                                                            </Badge>
                                                        </div>
                                                        <p className="text-muted-foreground mb-2">{item.description}</p>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <span>Version: {item.version}</span>
                                                            <span>Taille: {item.fileSize}</span>
                                                            <span>{item.type}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Button>
                                                    <DownloadCloud className="h-4 w-4 mr-2" />
                                                    Mettre à jour
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

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
