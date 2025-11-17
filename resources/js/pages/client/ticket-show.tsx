import AppLayout from "@/layouts/app-layout";
import React from "react";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { route } from "ziggy-js";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Clock, ArrowLeft, Paperclip } from "lucide-react";
import Dropzone from "@/components/ui/dropzone";
import { BreadcrumbItem } from "@/types";

export default function TicketShow() {
    const { ticket } = usePage().props as any;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Tickets", href: "/client/ticket" },
        { title: ticket?.subject || "Ticket", href: route('supportsTickets.show', ticket?.id) },
    ];

    type TicketStatus = "open" | "pending" | "closed";
    const statusConfig: Record<TicketStatus, { variant: "destructive" | "default" | "secondary"; text: string; icon: any }> = {
        open: { variant: "destructive", text: "Ouvert", icon: AlertCircle },
        pending: { variant: "default", text: "En cours", icon: Clock },
        closed: { variant: "secondary", text: "Fermé", icon: CheckCircle },
    };

    const statusKey = ((ticket?.status === 'in_progress') ? 'pending' : (ticket?.status ?? 'open')) as TicketStatus;
    const StatusIcon = statusConfig[statusKey].icon;

    const replyForm = useForm<{ message: string; attachments: File[] }>({ message: "", attachments: [] });
    const onReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyForm.data.message.trim()) {
            toast.error("Merci d'ajouter un message");
            return;
        }
        const t = toast.loading("Envoi de la réponse...");
        replyForm.post(route('supportsTickets.reply', ticket.id), {
            onSuccess: () => {
                toast.success("Réponse envoyée", { id: t });
                replyForm.reset('message');
            },
            onError: () => toast.error("Impossible d'envoyer la réponse", { id: t }),
            forceFormData: true,
        });
    };

    const { post: postAction, processing } = useForm({});
    const onClose = () => {
        const t = toast.loading("Fermeture du ticket...");
        postAction(route('supportsTickets.close', ticket.id), {
            onSuccess: () => toast.success("Ticket fermé", { id: t }),
            onError: () => toast.error("Erreur lors de la fermeture", { id: t })
        });
    };
    const onReopen = () => {
        const t = toast.loading("Réouverture du ticket...");
        postAction(route('supportsTickets.reopen', ticket.id), {
            onSuccess: () => toast.success("Ticket rouvert", { id: t }),
            onError: () => toast.error("Erreur lors de la réouverture", { id: t })
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Ticket • ${ticket?.subject ?? ''}`} />
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Button asChild variant="ghost">
                        <Link href={route('supportsTickets')} className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" /> Retour
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        {statusKey !== 'closed' ? (
                            <Button variant="outline" onClick={onClose} disabled={processing}>Fermer</Button>
                        ) : (
                            <Button variant="outline" onClick={onReopen} disabled={processing}>Rouvrir</Button>
                        )}
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <CardTitle>{ticket?.subject}</CardTitle>
                                <CardDescription>Ticket #{ticket?.id}</CardDescription>
                            </div>
                            <Badge variant={statusConfig[statusKey].variant} className="flex items-center gap-1">
                                <StatusIcon className="h-3 w-3" /> {statusConfig[statusKey].text}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {(ticket?.order || ticket?.license) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {ticket.order && (
                                    <div className="rounded-lg border p-4">
                                        <div className="text-sm text-muted-foreground">Commande liée</div>
                                        <div className="font-medium">{ticket.order.id} • {ticket.order.product?.name ?? 'Produit'}</div>
                                    </div>
                                )}
                                {ticket.license && (
                                    <div className="rounded-lg border p-4">
                                        <div className="text-sm text-muted-foreground">Licence liée</div>
                                        <div className="font-medium">{ticket.license.id} • {ticket.license.product?.name ?? 'Produit'}</div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-3">
                            <div className="text-sm text-muted-foreground">Fil de discussion</div>
                            <div className="space-y-2">
                                {Array.isArray(ticket?.messages) && ticket.messages.length > 0 ? (
                                    ticket.messages
                                        .slice()
                                        .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                                        .map((msg: any) => (
                                            <div key={msg.id} className="rounded-lg border p-3">
                                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                                    <span>{msg.user?.name ?? 'Utilisateur'}</span>
                                                    <span>{msg.created_at ? new Date(msg.created_at).toLocaleString('fr-FR') : ''}</span>
                                                </div>
                                                <div className="whitespace-pre-wrap text-sm">
                                                    {msg.message}
                                                </div>
                                                {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {msg.attachments.map((att: any) => (
                                                            <a
                                                                key={att.id}
                                                                href={`/storage/${att.path}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border hover:bg-accent"
                                                            >
                                                                <Paperclip className="h-3 w-3" /> {att.original_name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                ) : (
                                    <div className="rounded-lg border p-3">
                                        <div className="text-xs text-muted-foreground mb-1">Message initial</div>
                                        <div className="whitespace-pre-wrap text-sm">{ticket?.message}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <form onSubmit={onReply} className="space-y-3">
                            <Label htmlFor="reply">Votre réponse</Label>
                            <textarea
                                id="reply"
                                rows={5}
                                placeholder="Écrivez votre message..."
                                value={replyForm.data.message}
                                onChange={(e) => replyForm.setData('message', e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                            <div>
                                <Label htmlFor="reply_attachments">Pièces jointes (optionnel)</Label>
                                <Dropzone
                                    multiple
                                    accept="image/*,application/pdf,text/plain,application/zip"
                                    value={replyForm.data.attachments || []}
                                    onFiles={(files) => replyForm.setData('attachments', files)}
                                    className="min-h-[100px]"
                                >
                                    <div className="text-center p-4">
                                        <p className="text-muted-foreground">Glissez-déposez des fichiers ici ou cliquez pour sélectionner</p>
                                        <p className="text-xs text-muted-foreground mt-1">Formats acceptés: images, PDF, texte, ZIP</p>
                                    </div>
                                </Dropzone>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={replyForm.processing}>Envoyer</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
