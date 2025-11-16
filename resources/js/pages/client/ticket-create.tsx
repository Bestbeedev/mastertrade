import AppLayout from "@/layouts/app-layout";
import React from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { route } from "ziggy-js";
import { toast } from "sonner";
import { BreadcrumbItem } from "@/types";
import Dropzone from "@/components/ui/dropzone";

export default function TicketCreate() {
    const { orders = [], licenses = [] } = usePage().props as any;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Tickets", href: "/client/ticket" },
        { title: "Nouveau", href: "/client/ticket/new" },
    ];

    const form = useForm({
        subject: "",
        message: "",
        order_id: "",
        license_id: "",
        priority: "medium" as 'low' | 'medium' | 'high',
        category: "",
        attachments: [] as File[],
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const t = toast.loading("Création du ticket...");
        form.post(route("supportsTickets.store"), {
            onSuccess: () => {
                toast.success("Ticket créé avec succès", { id: t });
            },
            onError: () => toast.error("Impossible de créer le ticket", { id: t }),
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nouveau ticket" />
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                <form onSubmit={onSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Nouveau ticket de support</CardTitle>
                            <CardDescription>
                                Décrivez votre problème ou votre demande. Joignez une commande ou une licence si pertinent.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Sujet</Label>
                                        <Input id="subject" value={form.data.subject} onChange={(e) => form.setData("subject", e.target.value)} placeholder="Sujet du ticket" required />
                                        {form.errors.subject && (
                                            <p className="text-sm text-destructive">{form.errors.subject}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Pièces jointes (optionnel)</Label>
                                        <Dropzone multiple accept="image/*,application/pdf,text/plain,application/zip" onFiles={(files) => form.setData('attachments', files)}>
                                            <span>Glissez-déposez ici ou cliquez pour sélectionner</span>
                                        </Dropzone>
                                        {form.data.attachments?.length > 0 && (
                                            <div className="text-xs text-muted-foreground">
                                                {form.data.attachments.map((f: File) => f.name).join(', ')}
                                            </div>
                                        )}
                                        <p className="text-xs text-muted-foreground">Formats acceptés: images/PDF/logs. Max selon configuration serveur.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="order_id">Commande liée (optionnel)</Label>
                                        <Select value={form.data.order_id} onValueChange={(v) => form.setData("order_id", v)} >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner une commande" />
                                            </SelectTrigger>
                                            <SelectContent className="w-full">
                                                {orders.map((o: any) => (
                                                    <SelectItem key={o.id} value={o.id}>
                                                        {o.id} • {o.product?.name ?? "Produit"}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="license_id">Licence liée (optionnel)</Label>
                                        <Select value={form.data.license_id} onValueChange={(v) => form.setData("license_id", v)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Sélectionner une licence" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {licenses.map((l: any) => (
                                                    <SelectItem key={l.id} value={l.id}>
                                                        {l.id} • {l.product?.name ?? "Produit"}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-1">
                                    <Label htmlFor="message">Message</Label>
                                    <textarea
                                        id="message"
                                        placeholder="Décrivez votre problème avec le plus de détails possible..."
                                        value={form.data.message}
                                        onChange={(e) => form.setData("message", e.target.value)}
                                        rows={10}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        required
                                    />
                                    {form.errors.message && (
                                        <p className="text-sm text-destructive">{form.errors.message}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t px-6 py-4">
                            <Button type="button" variant="outline" asChild>
                                <Link href={route('supportsTickets')}>Annuler</Link>
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                {form.processing ? "Création..." : "Créer le ticket"}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
