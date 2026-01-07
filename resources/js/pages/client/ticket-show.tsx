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
import { Separator } from "@/components/ui/separator";

interface Ticket {
    id?: string;
    subject?: string;
    status?: string;
    priority?: string;
    description?: string;
    message?: string;
    created_at?: string;
    updated_at?: string;
    user?: { id: string; name: string; email: string };
    order?: { id: string; amount?: number; product?: { name: string } };
    license?: { id: string; key?: string; product?: { name: string } };
    replies?: Array<{ message: string; user?: { name: string; email: string }; created_at?: string }>;
    messages?: Array<{ message: string; user?: { name: string; email: string }; created_at?: string }>;
}

interface Auth {
    user?: { id: string; name: string; email: string };
}

export default function TicketShow() {
    const { ticket, isAdmin = false, auth } = usePage().props as { ticket?: Ticket; isAdmin?: boolean; auth?: Auth };
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Tickets", href: "/client/ticket" },
        { title: ticket?.subject || "Ticket", href: route('supportsTickets.show', ticket?.id || '') },
    ];

    type TicketStatus = "open" | "pending" | "closed";
    const statusConfig: Record<TicketStatus, { variant: "destructive" | "default" | "secondary"; text: string; icon: React.ComponentType<Record<string, unknown>> }> = {
        open: { variant: "destructive", text: "Ouvert", icon: AlertCircle },
        pending: { variant: "default", text: "En cours", icon: Clock },
        closed: { variant: "secondary", text: "Fermé", icon: CheckCircle },
    };

    const currentUserId = auth?.user?.id;

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
        replyForm.post(route('supportsTickets.reply', ticket?.id || ''), {
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
        postAction(route('supportsTickets.close', ticket?.id || ''), {
            onSuccess: () => toast.success("Ticket fermé", { id: t }),
            onError: () => toast.error("Erreur lors de la fermeture", { id: t })
        });
    };
    const onReopen = () => {
        const t = toast.loading("Réouverture du ticket...");
        postAction(route('supportsTickets.reopen', ticket?.id || ''), {
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
                                <CardTitle className="mb-2">{ticket?.subject}</CardTitle>
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
                                        .map((msg: any) => {
                                            const roleName = (msg?.user?.role?.name || '').toLowerCase();
                                            const isAdminMsg = roleName.includes('admin');
                                            const isMine = msg?.user_id === currentUserId;
                                            return (
                                                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[85%] rounded-xl border p-4 shadow-sm transition-all duration-200 ${isAdminMsg
                                                            ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 dark:from-emerald-950/40 dark:to-green-950/40 dark:border-emerald-600/30'
                                                            : isMine
                                                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/40 dark:to-indigo-950/40 dark:border-blue-600/30'
                                                                : 'bg-gradient-to-r from-slate-50 to-gray-50 border-border dark:from-slate-800 dark:to-gray-800 dark:border-slate-600'
                                                        }`}>
                                                        {/* En-tête du message */}
                                                        <div className="flex items-center justify-between text-[11px] mb-2">
                                                            {isAdminMsg ? (
                                                                <Badge variant="outline" className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600 truncate mr-2">
                                                                    👨‍💻 Support Client
                                                                </Badge>
                                                            ) : (
                                                                <span className={`truncate mr-2 font-medium ${isMine
                                                                        ? 'text-blue-700 dark:text-blue-300'
                                                                        : 'text-slate-700 dark:text-slate-300'
                                                                    }`}>
                                                                    {msg.user?.name} - {msg.user?.email}
                                                                </span>
                                                            )}
                                                            <span className={`text-xs ${isAdminMsg
                                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                                    : isMine
                                                                        ? 'text-blue-600 dark:text-blue-400'
                                                                        : 'text-slate-500 dark:text-slate-400'
                                                                }`}>
                                                                {msg.created_at ? new Date(msg.created_at).toLocaleString('fr-FR') : ''}
                                                            </span>
                                                        </div>

                                                        {/* Séparateur */}
                                                        <Separator className={
                                                            isAdminMsg
                                                                ? 'bg-emerald-200 dark:bg-emerald-600/30'
                                                                : isMine
                                                                    ? 'bg-blue-200 dark:bg-blue-600/30'
                                                                    : 'bg-slate-200 dark:bg-slate-600'
                                                        } />

                                                        {/* Contenu du message */}
                                                        <div className={`whitespace-pre-wrap mt-3 text-sm font-medium ${isAdminMsg
                                                                ? 'text-emerald-900 dark:text-emerald-100'
                                                                : isMine
                                                                    ? 'text-blue-900 dark:text-blue-100'
                                                                    : 'text-slate-900 dark:text-slate-100'
                                                            }`}>
                                                            {msg.message}
                                                        </div>

                                                        {/* Pièces jointes */}
                                                        {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                                                            <div className="mt-3 flex flex-col gap-2">
                                                                {msg.attachments.map((att: any) => {
                                                                    const isImage = typeof att.mime_type === 'string' && att.mime_type.startsWith('image/');
                                                                    return (
                                                                        <div key={att.id} className="group">
                                                                            {isImage ? (
                                                                                <a href={`/storage/${att.path}`} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg border-2 border-transparent hover:border-current transition-all duration-200">
                                                                                    <img
                                                                                        src={`/storage/${att.path}`}
                                                                                        alt={att.original_name}
                                                                                        className="max-h-64 w-auto rounded-lg object-contain transition-transform duration-200 hover:scale-105"
                                                                                    />
                                                                                </a>
                                                                            ) : (
                                                                                <a
                                                                                    href={`/storage/${att.path}`}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className={`inline-flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-all duration-200 hover:shadow-md ${isAdminMsg
                                                                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-600'
                                                                                            : isMine
                                                                                                ? 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-600'
                                                                                                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
                                                                                        }`}
                                                                                >
                                                                                    <Paperclip className="h-3 w-3" />
                                                                                    <span className="max-w-32 truncate">{att.original_name}</span>
                                                                                </a>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
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
                                <Label className="mb-2" htmlFor="reply_attachments">Pièces jointes (optionnel)</Label>
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
