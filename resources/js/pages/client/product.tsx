import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Shield, Download, ArrowLeft } from "lucide-react";
import { route } from "ziggy-js";
import { formatCFA } from "@/lib/utils";

export default function Product({ product, canDownload = false, hasActiveLicense = false, hasPaidOrder = false }: { product?: any; canDownload?: boolean; hasActiveLicense?: boolean; hasPaidOrder?: boolean }) {
    if (!product) {
        return (
            <AppLayout breadcrumbs={[{ title: "Catalogue", href: route('catalogs') }, { title: "Produit", href: "" }]}>
                <Head title="Produit" />
                <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Produit introuvable</CardTitle>
                            <CardDescription>Revenez au catalogue pour sélectionner un produit.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline">
                                <Link href={route('catalogs')}>Retour au catalogue</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }
    const data = product;
    const categoryLabel = (cat?: string) => {
        const c = (cat || '').toLowerCase();
        if (c === 'software') return 'Logiciel';
        if (c === 'plugin') return 'Extension';
        if (c === 'template') return 'Modèle';
        if (c === 'addon') return 'Module';
        if (c === 'bundle') return 'Pack';
        return cat || 'Logiciels';
    };
    const priceCents = typeof data.price_cents === 'number' ? data.price_cents : 0;
    const isPaid = priceCents > 0;
    const requiresLicense = !!data.requires_license;

    const sizeLabel = data.size ? `${Math.round((data.size / (1024 * 1024)) * 10) / 10} Mo` : "—";

    return (
        <AppLayout breadcrumbs={[{ title: "Catalogue", href: route('catalogs') }, { title: data.name, href: "" }]}>
            <Head title={data.name} />

            <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" asChild>
                        <Link href={route('catalogs')} className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" /> Retour
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-2xl">{data.name}</CardTitle>
                            <CardDescription>{data.description}</CardDescription>
                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span>Catégorie : <span className="font-medium">{categoryLabel(data.category) || '—'}</span></span>
                                <span>Version : <span className="font-medium">{data.version || '—'}</span></span>
                                {data.sku && <span>SKU : <span className="font-medium">{data.sku}</span></span>}
                                <span>Taille : <span className="font-medium">{sizeLabel}</span></span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                <Package className="h-12 w-12 text-primary" />
                            </div>
                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <Badge variant="outline">Version {data.version}</Badge>
                                <Badge variant="outline">{categoryLabel(data.category)}</Badge>
                                {requiresLicense && <Badge variant="secondary">Nécessite une licence</Badge>}
                                {isPaid ? (
                                    <Badge variant="default">{formatCFA(priceCents)}</Badge>
                                ) : (
                                    <Badge variant="secondary">Gratuit</Badge>
                                )}
                                {data.tags?.map((t: string, i: number) => (
                                    <Badge key={i} variant="secondary">{t}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        {Array.isArray(data.security) && data.security.length > 0 ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Licence & Sécurité</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {data.security.map((s: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                                            <Shield className="h-4 w-4 text-primary" /> {s}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Licence & Sécurité</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                                        <Shield className="h-4 w-4 text-base" /> Téléchargement sécurisé
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {Array.isArray(data.features) && data.features.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Fonctionnalités</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    {data.features.map((f: string, i: number) => (
                                        <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardContent className="flex flex-col items-start p-6">
                                <div className="space-y-1">
                                    <div className="text-lg font-semibold">Téléchargement du logiciel</div>
                                    {requiresLicense ? (
                                        <div className="text-xs text-muted-foreground">Accès via une licence{isPaid ? ' (payante)' : ''}.</div>
                                    ) : isPaid ? (
                                        <div className="text-xs text-muted-foreground">Achat requis avant téléchargement.</div>
                                    ) : (
                                        <div className="text-xs text-muted-foreground">Téléchargement gratuit</div>
                                    )}
                                    <div className="text-xs text-muted-foreground">Taille : {sizeLabel}</div>
                                </div>
                                <div className="flex mt-4 items-center gap-4">
                                    {data.download_url ? (
                                        canDownload ? (
                                            <Button variant="outline" className="gap-2" asChild>
                                                <a href={route('downloads.start', data.id)}>
                                                    <Download className="h-4 w-4" /> Télécharger
                                                </a>
                                            </Button>
                                        ) : (
                                            <>
                                                <Button variant="outline" className="gap-2" disabled>
                                                    <Download className="h-4 w-4" /> Télécharger
                                                </Button>
                                                {(isPaid || requiresLicense) && (
                                                    <Button asChild>
                                                        <Link href={route('catalogs.purchase', data.id)} method="post">
                                                            Payer
                                                        </Link>
                                                    </Button>
                                                )}
                                            </>
                                        )
                                    ) : (
                                        <Button variant="outline" className="gap-2" disabled>
                                            <Download className="h-4 w-4" /> Téléchargement non disponible
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
