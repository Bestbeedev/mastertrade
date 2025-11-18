import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Key, Calendar, Download, Copy, AlertCircle, Users, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { route } from "ziggy-js";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type LicenseItem = {
    id: string;
    product?: { name?: string; version?: string };
    key: string;
    type?: string;
    seats: number;
    usedSeats: number;
    expires: string | null;
    status: string;
};

export default function License({ licenses: initialLicenses }: { licenses?: LicenseItem[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Licenses',
            href: '/client/license',
        },
    ];

    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const licenses: LicenseItem[] = (initialLicenses && initialLicenses.length ? initialLicenses : []);

    const expiringSoonCount = licenses.filter(l =>
        l.expires &&
        (new Date(l.expires).getTime() - Date.now()) / 86400000 <= 30 &&
        (new Date(l.expires).getTime() - Date.now()) > 0
    ).length;

    const stats = [
        {
            title: "Licences actives",
            value: `${licenses.filter(l => l.status === 'active').length}`,
            description: "En cours de validité",
            icon: Key,
            trend: "up"
        },
        {
            title: "Expirent bientôt",
            value: `${expiringSoonCount}`,
            description: "Dans 30 jours",
            icon: Calendar,
            trend: "neutral"
        },
        {
            title: "Utilisateurs totaux",
            value: `${licenses.reduce((acc, l) => acc + l.usedSeats, 0)}`,
            description: `Sur ${licenses.reduce((acc, l) => acc + l.seats, 0)} sièges`,
            icon: Users,
            trend: "up"
        },
        {
            title: "Produits",
            value: `${new Set(licenses.map(l => l.product?.name)).size}`,
            description: "Sous licence",
            icon: "📦",
            trend: "stable"
        }
    ];

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };
    type Status = "active" | "expired" | "suspended" | "pending";
    type Support = "Premium" | "Standard" | "Basic";

    const getStatusConfig = (status: Status) => {
        const config: Record<Status, { variant: "default" | "destructive" | "secondary" | "outline"; text: string }> = {
            active: { variant: "default", text: "Active" },
            expired: { variant: "destructive", text: "Expirée" },
            suspended: { variant: "secondary", text: "Suspendue" },
            pending: { variant: "outline", text: "En attente" }
        };

        return config[status];
    };

    const getSupportConfig = (support: Support) => {
        const config: Record<Support, { variant: "default" | "outline" | "secondary"; class: string }> = {
            Premium: { variant: "default", class: "bg-gradient-to-r from-yellow-500 to-orange-500" },
            Standard: { variant: "outline", class: "" },
            Basic: { variant: "secondary", class: "" }
        };

        return config[support];
    };

    const [openPreview, setOpenPreview] = useState(false);
    const [previewLicense, setPreviewLicense] = useState<LicenseItem | null>(null);

    // Helpers: jours restants avant expiration
    const getDaysRemaining = (dateStr?: string | null) => {
        if (!dateStr) return null;
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const end = new Date(dateStr);
        const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        const MS = 24 * 60 * 60 * 1000;
        return Math.round((endDate.getTime() - start.getTime()) / MS);
    };
    const DaysRemaining: React.FC<{ date?: string | null }> = ({ date }) => {
        const d = getDaysRemaining(date);
        if (d === null) return null;
        if (d < 0) return <span className="text-xs text-destructive">Expirée il y a {Math.abs(d)} j</span>;
        if (d === 0) return <span className="text-xs text-amber-600">Expire aujourd’hui</span>;
        if (d <= 30) return <span className="text-xs text-amber-600">Reste {d} j</span>;
        return <span className="text-xs text-emerald-600">Reste {d} j</span>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes Licenses" />

            {/* En-tête */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Gestion des Licenses</h1>
                            <p className="text-muted-foreground mt-2">
                                Consultez et gérez vos licences logicielles
                            </p>
                        </div>
                        <Button>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Actualiser les licences
                        </Button>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Alertes */}
                {expiringSoonCount > 0 && (
                    <div className="mb-8">
                        <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                                    <div>
                                        <h3 className="font-medium text-orange-900 dark:text-orange-100">
                                            Licences expirant bientôt
                                        </h3>
                                        <p className="text-orange-700 dark:text-orange-300 text-sm mt-1">
                                            {expiringSoonCount === 1
                                                ? "Une de vos licences expire dans moins de 30 jours. Pensez à la renouveler."
                                                : `${expiringSoonCount} licences expirent dans moins de 30 jours. Pensez à les renouveler.`}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                {typeof stat.icon === 'string' ? (
                                    <span className="text-muted-foreground text-lg">{stat.icon}</span>
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

                {/* Liste des licences */}
                <div className="space-y-6">
                    {licenses.length === 0 && (
                        <Card className="border-dashed">
                            <CardContent className="py-8 flex flex-col items-center justify-center text-center gap-2">
                                <Key className="h-8 w-8 text-muted-foreground mb-1" />
                                <p className="text-sm text-muted-foreground max-w-md">
                                    Vous n'avez encore aucune licence associée à votre compte. Lorsque vous achèterez un produit avec licence, il apparaîtra ici.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                    {licenses.map((license) => {
                        const statusConfig = getStatusConfig(license.status as Status);
                        const supportConfig = getSupportConfig(license.support as Support);
                        const usagePercentage = (license.usedSeats / license.seats) * 100;

                        const daysLeft = license.expires ? getDaysRemaining(license.expires) : null;
                        return (
                            <Card key={license.id} className="hover:shadow-lg transition-all">
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="p-3 bg-primary/10 rounded-lg">
                                                <Key className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="space-y-4 flex-1">
                                                {/* En-tête */}
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div>
                                                        <h3 className="font-semibold text-xl mb-2">
                                                            {license.product?.name ?? 'Produit'}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                            <span>Version: {license.product?.version ?? '—'}</span>
                                                            <span>Type: {license.type}</span>
                                                            <Badge variant='default'>Support</Badge>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <Badge variant={statusConfig.variant}>
                                                            {statusConfig.text}
                                                        </Badge>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Expire le: {license.expires ? new Date(license.expires).toLocaleDateString('fr-FR') : '—'}{" "}
                                                            {license.expires ? <span className="mx-1">•</span> : null}
                                                            {license.expires ? <DaysRemaining date={license.expires} /> : null}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Utilisation des sièges */}
                                                <div>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span>Utilisation des sièges</span>
                                                        <span className="font-medium">
                                                            {license.usedSeats}/{license.seats} utilisateurs
                                                        </span>
                                                    </div>
                                                    <Progress value={usagePercentage} className="h-2" />
                                                </div>

                                                {/* Clé de licence */}
                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">Clé de licence</label>
                                                    <div className="flex items-center gap-2">
                                                        <code className="bg-muted px-3 py-2 rounded text-sm font-mono flex-1 border">
                                                            {license.key}
                                                        </code>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => copyToClipboard(license.key, license.key)}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                            {copiedKey === license.key ? 'Copié!' : 'Copier'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Actions */}
                                        <div className="flex flex-col gap-2 lg:w-48">
                                            <Button className="w-full" onClick={() => { setPreviewLicense(license); setOpenPreview(true); }}>
                                                <Download className="h-4 w-4 mr-2" /> Certificat
                                            </Button>
                                            <Button variant="outline" className="w-full">Renouveler</Button>
                                            <Button variant="secondary" className="w-full">Gérer les sièges</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Sections complémentaires */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions rapides</CardTitle>
                            <CardDescription>Gestion simplifiée de vos licences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">Demander une extension de licence</Button>
                            <Button variant="outline" className="w-full justify-start">Ajouter des sièges supplémentaires</Button>
                            <Button variant="outline" className="w-full justify-start">Télécharger tous les certificats</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Support licence</CardTitle>
                            <CardDescription>Assistance dédiée aux questions de licence</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">Pour toute question concernant vos licences, transferts ou modifications.</p>
                            <Button variant="outline" className="w-full">Contacter le support licence</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Modal de prévisualisation du certificat */}
                <Dialog open={openPreview} onOpenChange={setOpenPreview}>
                    <DialogContent className="sm:max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Certificat de licence</DialogTitle>
                        </DialogHeader>
                        <div className="rounded-md border overflow-hidden" style={{ height: '70vh' }}>
                            {previewLicense ? (
                                <iframe
                                    src={`${route('licenses.certificate', { license: previewLicense.id })}`}
                                    className="w-full h-full"
                                />
                            ) : null}
                        </div>
                        <DialogFooter>
                            {previewLicense ? (
                                <Button asChild>
                                    <a href={`${route('licenses.certificate', { license: previewLicense.id })}?download=1`} target="_blank" rel="noopener">
                                        Télécharger le PDF
                                    </a>
                                </Button>
                            ) : null}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    )
}
