import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ShieldCheck, ArrowLeft, CreditCard } from "lucide-react";
import { route } from "ziggy-js";

export default function LicenseCheckout({ product, device_id, machine, mac_address }: { product: { id: string; name: string }; device_id?: string; machine?: string; mac_address?: string }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Licenses", href: route("licenses") },
        { title: "Activation", href: route("licenses.activation.start") },
    ];

    const { post, processing } = useForm({
        product_id: product?.id,
        device_id: device_id || "",
        machine: machine || "",
        mac_address: mac_address || "",
    });

    const onCheckout = () => {
        post(route("licenses.activation.checkout"));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activer la licence" />

            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-3">
                        <Link href={route("licenses")} className="inline-flex items-center text-sm hover:underline"><ArrowLeft className="h-4 w-4 mr-1" /> Retour</Link>
                    </div>
                    <div className="mt-3">
                        <h1 className="text-3xl font-bold tracking-tight">Activation de la licence</h1>
                        <p className="text-muted-foreground mt-2">Produit: <Badge variant="outline">{product?.name}</Badge></p>
                    </div>
                </div>
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-3xl mx-auto grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> Récapitulatif</CardTitle>
                            <CardDescription>Confirmez l’activation pour ce logiciel</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span>Produit</span>
                                <span className="font-medium">{product?.name}</span>
                            </div>
                            {device_id ? (
                                <div className="flex justify-between text-sm">
                                    <span>Identifiant appareil</span>
                                    <span className="font-mono">{device_id}</span>
                                </div>
                            ) : null}
                            {machine ? (
                                <div className="flex justify-between text-sm">
                                    <span>Machine</span>
                                    <span className="font-mono">{machine}</span>
                                </div>
                            ) : null}
                            {mac_address ? (
                                <div className="flex justify-between text-sm">
                                    <span>Adresse MAC</span>
                                    <span className="font-mono">{mac_address}</span>
                                </div>
                            ) : null}
                            <div className="pt-2">
                                <Button onClick={onCheckout} disabled={processing} className="w-full h-11 text-base">
                                    <CreditCard className="h-5 w-5 mr-2" /> Activer maintenant
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2 flex items-center"><ShieldCheck className="h-3.5 w-3.5 mr-1" /> Paiement simulé pour l’instant</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
