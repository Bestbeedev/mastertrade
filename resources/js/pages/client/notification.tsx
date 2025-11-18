import AppLayout from '@/layouts/app-layout'
import { BreadcrumbItem } from '@/types';
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePage, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import {
    IconBell,
    IconCheck,
    IconTrash,
    IconSettings,
    IconDownload,
    IconLicense,
    IconSchool,
    IconAlertTriangle,
    IconInfoCircle,
    IconMail,
    IconFilter,
    IconDotsVertical
} from '@tabler/icons-react'

export default function Notification() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Notifications',
            href: '/client/notification',
        },
    ];
    const { notifications: serverNotifications = [] } = usePage().props as any;
    const notifications = (serverNotifications as any[]).map((n) => {
        const type = n.type || 'info';
        const visuals: Record<string, { icon: any; iconColor: string; bgColor: string }> = {
            license: { icon: IconLicense, iconColor: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
            download: { icon: IconDownload, iconColor: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' },
            course: { icon: IconSchool, iconColor: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
            system: { icon: IconAlertTriangle, iconColor: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
            info: { icon: IconInfoCircle, iconColor: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' },
        };
        const v = visuals[type] || visuals.info;
        return {
            id: n.id,
            type,
            title: n.data?.title || (type === 'download' ? 'Téléchargement' : type === 'license' ? 'Informations de licence' : 'Notification'),
            description: n.data?.message || n.data?.description || '',
            time: n.created_at ? new Date(n.created_at).toLocaleString('fr-FR') : '',
            read: !!n.read_at,
            important: !!n.data?.important,
            icon: v.icon,
            iconColor: v.iconColor,
            bgColor: v.bgColor,
        };
    });

    const [filter, setFilter] = useState('all');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [notificationToDelete, setNotificationToDelete] = useState<any | null>(null);
    const [confirmClearOpen, setConfirmClearOpen] = useState(false);

    const markAsRead = (id: number) => {
        router.post(route('notifications.read', id), {}, { preserveScroll: true });
    };

    const deleteNotification = (id: number) => {
        router.delete(route('notifications.destroy', id), { preserveScroll: true });
    };

    const markAllAsRead = () => {
        router.post(route('notifications.read-all'), {}, { preserveScroll: true });
    };

    const clearAll = () => {
        notifications.forEach(n => router.delete(route('notifications.destroy', n.id), { preserveScroll: true }));
    };

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !notif.read;
        if (filter === 'important') return notif.important;
        return notif.type === filter;
    });

    const unreadCount = notifications.filter(notif => !notif.read).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                {/* En-tête */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <IconBell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
                            <p className="text-muted-foreground">
                                {unreadCount > 0
                                    ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                                    : 'Toutes vos notifications sont à jour'
                                }
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={markAllAsRead}>
                            <IconCheck className="h-4 w-4 mr-2" />
                            Tout marquer comme lu
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setConfirmClearOpen(true)}>
                            <IconTrash className="h-4 w-4 mr-2" />
                            Tout effacer
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar des filtres et paramètres */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Filtres */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <IconFilter className="h-4 w-4" />
                                    Filtres
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {[
                                    { key: 'all', label: 'Toutes', count: notifications.length },
                                    { key: 'unread', label: 'Non lues', count: unreadCount },
                                    { key: 'important', label: 'Importantes', count: notifications.filter(n => n.important).length },
                                    { key: 'license', label: 'Licences', count: notifications.filter(n => n.type === 'license').length },
                                    { key: 'download', label: 'Téléchargements', count: notifications.filter(n => n.type === 'download').length },
                                    { key: 'course', label: 'Formations', count: notifications.filter(n => n.type === 'course').length },
                                ].map((filterItem) => (
                                    <button
                                        key={filterItem.key}
                                        onClick={() => setFilter(filterItem.key)}
                                        className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${filter === filterItem.key
                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                            : 'hover:bg-muted/50 text-muted-foreground'
                                            }`}
                                    >
                                        <span>{filterItem.label}</span>
                                        <Badge variant="secondary" className="text-xs">
                                            {filterItem.count}
                                        </Badge>
                                    </button>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Confirmation suppression unique */}
                        <Dialog open={!!notificationToDelete} onOpenChange={(open) => { if (!open) setNotificationToDelete(null); }}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Supprimer la notification</DialogTitle>
                                    <DialogDescription>
                                        Êtes-vous sûr de vouloir supprimer cette notification&nbsp;?
                                        Cette action est définitive.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() => setNotificationToDelete(null)}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        type="button"
                                        onClick={() => {
                                            if (notificationToDelete) {
                                                deleteNotification(notificationToDelete.id);
                                                setNotificationToDelete(null);
                                            }
                                        }}
                                    >
                                        Supprimer
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Confirmation suppression de toutes les notifications */}
                        <Dialog open={confirmClearOpen} onOpenChange={(open) => { if (!open) setConfirmClearOpen(false); }}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Tout effacer</DialogTitle>
                                    <DialogDescription>
                                        Voulez-vous vraiment supprimer toutes vos notifications&nbsp;?
                                        Cette action est irréversible.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() => setConfirmClearOpen(false)}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        type="button"
                                        onClick={() => {
                                            setConfirmClearOpen(false);
                                            clearAll();
                                        }}
                                    >
                                        Tout effacer
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Paramètres de notification */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <IconSettings className="h-4 w-4" />
                                    Paramètres
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="email-notifications" className="text-sm font-medium">
                                            Notifications email
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Recevoir les notifications par email
                                        </p>
                                    </div>
                                    <Switch
                                        id="email-notifications"
                                        checked={emailNotifications}
                                        onCheckedChange={setEmailNotifications}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="push-notifications" className="text-sm font-medium">
                                            Notifications push
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Alertes dans l'application
                                        </p>
                                    </div>
                                    <Switch
                                        id="push-notifications"
                                        checked={pushNotifications}
                                        onCheckedChange={setPushNotifications}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Liste des notifications */}
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">
                                    {filter === 'all' && 'Toutes les notifications'}
                                    {filter === 'unread' && 'Notifications non lues'}
                                    {filter === 'important' && 'Notifications importantes'}
                                    {filter === 'license' && 'Notifications de licences'}
                                    {filter === 'download' && 'Notifications de téléchargements'}
                                    {filter === 'course' && 'Notifications de formations'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {filteredNotifications.length === 0 ? (
                                    <div className="text-center py-12">
                                        <IconBell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-foreground mb-2">Aucune notification</h3>
                                        <p className="text-muted-foreground">
                                            {filter === 'all'
                                                ? "Vous n'avez aucune notification pour le moment."
                                                : `Aucune notification ${filter === 'unread' ? 'non lue' : filter} pour le moment.`
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {filteredNotifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 hover:bg-muted/50 transition-colors group ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                                    }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-10 h-10 ${notification.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                        <notification.icon className={`h-5 w-5 ${notification.iconColor}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between mb-1">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className={`font-semibold text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'
                                                                    }`}>
                                                                    {notification.title}
                                                                </h3>
                                                                {notification.important && (
                                                                    <Badge variant="destructive" className="text-xs">
                                                                        Important
                                                                    </Badge>
                                                                )}
                                                                {!notification.read && (
                                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {!notification.read && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0"
                                                                        onClick={() => markAsRead(notification.id)}
                                                                    >
                                                                        <IconCheck className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                    onClick={() => setNotificationToDelete(notification)}
                                                                >
                                                                    <IconTrash className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            {notification.description}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
