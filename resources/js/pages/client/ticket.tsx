import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Plus, Search, Filter, MessageCircle, Clock, CheckCircle, AlertCircle, ChevronRight, HelpCircle, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Ticket() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tickets et Support',
            href: '/client/ticket',
        },
    ];

    const pageProps = usePage().props as any;
    const initialStatus = pageProps.filters?.status ?? 'all';
    const initialSearch = pageProps.filters?.search ?? '';
    const initialSort = pageProps.filters?.sort ?? 'recent';
    const [activeFilter, setActiveFilter] = useState<string>(initialStatus);
    const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
    const [sortBy, setSortBy] = useState<string>(initialSort);

    const { tickets: ticketsProp = [], ticketsCounts = null } = usePage().props as any;
    const isAdmin = !!(usePage().props as any)?.isAdmin;
    const paginated = Array.isArray(ticketsProp) ? null : (ticketsProp ?? null);
    const tickets = Array.isArray(ticketsProp) ? ticketsProp : (ticketsProp?.data ?? []);

    const normalizeStatus = (s: string) => s === 'in_progress' ? 'pending' : (s === 'resolved' ? 'closed' : (['open', 'pending', 'closed'].includes(s) ? s : 'open'));

    const computedCounts = ticketsCounts ?? tickets.reduce((acc: any, t: any) => {
        const st = normalizeStatus((t.status ?? 'open') as string);
        acc.all += 1; acc[st] += 1; return acc;
    }, { all: 0, open: 0, pending: 0, closed: 0 });

    const filters = [
        { id: 'all', label: 'Tous les tickets', count: computedCounts.all },
        { id: 'open', label: 'Ouverts', count: computedCounts.open },
        { id: 'pending', label: 'En cours', count: computedCounts.pending },
        { id: 'closed', label: 'Fermés', count: computedCounts.closed },
    ];

    // Helper pour déclencher navigation serveur
    const goWithServer = (params: Record<string, any>) => {
        router.get(route('supportsTickets'), { status: activeFilter, search: searchTerm, sort: sortBy, ...params }, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    // Filtrage côté client (par statut et recherche)
    const term = searchTerm.trim().toLowerCase();
    const filteredTickets = tickets.filter((ticket: any) => {
        const rawStatus = (ticket.status ?? 'open') as string;
        const statusKey = normalizeStatus(rawStatus);
        const matchesFilter = activeFilter === 'all' || statusKey === activeFilter;
        const hay = [ticket.subject, ticket.description, ticket.message, ticket.id]
            .map((v: any) => (v ?? '').toString().toLowerCase())
            .join(' ');
        const matchesSearch = term === '' || hay.includes(term);
        return matchesFilter && matchesSearch;
    });

    type TicketStatus = "open" | "pending" | "closed";
    type TicketPriority = "high" | "medium" | "low";

    const statusConfig: Record<TicketStatus, { variant: "destructive" | "default" | "secondary"; text: string; icon: any }> = {
        open: { variant: "destructive", text: "Ouvert", icon: AlertCircle },
        pending: { variant: "default", text: "En cours", icon: Clock },
        closed: { variant: "secondary", text: "Fermé", icon: CheckCircle }
    };

    const priorityConfig: Record<TicketPriority, { color: string; bg: string; text: string }> = {
        high: { color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20", text: "Élevée" },
        medium: { color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/20", text: "Moyenne" },
        low: { color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20", text: "Basse" }
    };

    const supportStats = [
        {
            title: "Tickets ouverts",
            value: computedCounts.open.toString(),
            description: "En attente de traitement",
            color: "text-orange-600",
            icon: AlertCircle
        },
        {
            title: "Taux de résolution",
            value: computedCounts.all > 0 ? `${Math.round((computedCounts.closed / computedCounts.all) * 100)}%` : "0%",
            description: "Tickets fermés",
            color: "text-green-600",
            icon: CheckCircle
        },
        {
            title: "Temps moyen",
            value: "2h",
            description: "Réponse support",
            color: "text-blue-600",
            icon: Clock
        },
    ];

    const supportContacts = [
        {
            title: "Centre d'aide",
            description: "Documentation et FAQ",
            icon: HelpCircle,
            href: "/client/help",
            color: "text-blue-600"
        },
        {
            title: "Support téléphonique",
            description: "01 23 45 67 89",
            icon: Phone,
            href: "tel:+33123456789",
            color: "text-green-600"
        },
        {
            title: "Email support",
            description: "support@votreentreprise.com",
            icon: Mail,
            href: "mailto:support@votreentreprise.com",
            color: "text-purple-600"
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tickets et Support" />

            {/* En-tête */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Tickets et Support</h1>
                            <p className="text-muted-foreground mt-2">
                                Gérez vos demandes d'assistance et suivez leur résolution
                            </p>
                        </div>

                        <Button asChild>
                            <Link href={route('supportsTickets.create')}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nouveau ticket
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar avec filtres et contacts */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Filtres */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">Filtres</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="space-y-1 p-2">
                                    {filters.map(filter => (
                                        <button
                                            key={filter.id}
                                            onClick={() => {
                                                if (ticketsCounts) {
                                                    setActiveFilter(filter.id);
                                                    goWithServer({ status: filter.id });
                                                } else {
                                                    setActiveFilter(filter.id);
                                                }
                                            }}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${activeFilter === filter.id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-accent'
                                                }`}
                                        >
                                            <span className="text-sm">{filter.label}</span>
                                            <Badge variant="secondary" className={
                                                activeFilter === filter.id
                                                    ? 'bg-primary-foreground text-primary'
                                                    : ''
                                            }>
                                                {filter.count}
                                            </Badge>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contacts support */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">Contact support</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {supportContacts.map((contact, index) => {
                                    const IconComponent = contact.icon;
                                    return (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            className="w-full justify-start h-auto p-3"
                                            asChild
                                        >
                                            <Link href={contact.href}>
                                                <IconComponent className={`h-4 w-4 mr-3 ${contact.color}`} />
                                                <div className="text-left">
                                                    <div className="text-sm font-medium">{contact.title}</div>
                                                    <div className="text-xs text-muted-foreground">{contact.description}</div>
                                                </div>
                                            </Link>
                                        </Button>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Statut support */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">Statut du support</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm font-medium">En ligne</span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <div>• Réponse sous 2h en moyenne</div>
                                    <div>• Disponible 24h/24</div>
                                    <div>• Priorité selon urgence</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contenu principal */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Barre de recherche et actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher dans les tickets..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setSearchTerm(v);
                                        if (ticketsCounts) {
                                            goWithServer({ search: v });
                                        }
                                    }}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Select value={sortBy} onValueChange={(v) => {
                                    setSortBy(v);
                                    if (ticketsCounts) goWithServer({ sort: v });
                                }}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Trier par" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="recent">Plus récent</SelectItem>
                                        <SelectItem value="old">Plus ancien</SelectItem>
                                        <SelectItem value="priority">Priorité</SelectItem>
                                        <SelectItem value="status">Statut</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filtres avancés
                                </Button>
                            </div>
                        </div>

                        {/* Statistiques */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {supportStats.map((stat, index) => {
                                const IconComponent = stat.icon;
                                return (
                                    <Card key={index}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg bg-muted`}>
                                                    <IconComponent className={`h-5 w-5 ${stat.color}`} />
                                                </div>
                                                <div>
                                                    <div className={`text-2xl font-bold ${stat.color}`}>
                                                        {stat.value}
                                                    </div>
                                                    <div className="text-sm font-medium">{stat.title}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {stat.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Liste des tickets */}
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <CardTitle>
                                            {activeFilter === 'all' ? 'Tous les tickets' :
                                                filters.find(f => f.id === activeFilter)?.label}
                                            <span className="text-muted-foreground ml-2 font-normal">
                                                ({filteredTickets.length})
                                            </span>
                                        </CardTitle>
                                        <CardDescription>
                                            Suivez l'avancement de vos demandes de support
                                        </CardDescription>
                                    </div>
                                    {filteredTickets.length > 0 && (
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={route('supportsTickets.create')}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Nouveau ticket
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {filteredTickets.map((ticket: any) => {
                                        const rawStatus = (ticket.status ?? 'open') as string;
                                        const statusKey = normalizeStatus(rawStatus) as TicketStatus;
                                        const status = statusConfig[statusKey];
                                        const priorityKey = (ticket.priority ?? 'medium') as TicketPriority;
                                        const priority = priorityConfig[priorityKey];
                                        const StatusIcon = status.icon;

                                        return (
                                            <Link
                                                key={ticket.id}
                                                href={route('supportsTickets.show', ticket.id)}
                                                className="block p-6 hover:bg-accent/50 transition-colors group"
                                            >
                                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                                        <div className={`p-2 rounded-lg ${priority.bg} flex-shrink-0`}>
                                                            <StatusIcon className={`h-5 w-5 ${priority.color}`} />
                                                        </div>
                                                        <div className="space-y-2 flex-1 min-w-0">
                                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                                                                    {ticket.subject}
                                                                </h3>
                                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                                    <Badge variant={status.variant} className="text-xs">
                                                                        {status.text}
                                                                    </Badge>
                                                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                                                </div>
                                                            </div>

                                                            <p className="text-muted-foreground line-clamp-2 text-sm">
                                                                {ticket.description ?? ticket.message}
                                                            </p>

                                                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                                                {isAdmin && (ticket.user?.name || ticket.user?.email) ? (
                                                                    <>
                                                                        <span className="font-medium">{ticket.user?.name ?? 'Utilisateur'}</span>
                                                                        {ticket.user?.email ? (
                                                                            <>
                                                                                <span>•</span>
                                                                                <span className="font-mono">{ticket.user.email}</span>
                                                                            </>
                                                                        ) : null}
                                                                        <span>•</span>
                                                                    </>
                                                                ) : null}
                                                                <span className="font-mono">#{ticket.id}</span>
                                                                <span>•</span>
                                                                <span>
                                                                    Créé le: {ticket.date ?? (ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('fr-FR') : 'N/A')}
                                                                </span>
                                                                <span>•</span>
                                                                <span className="flex items-center gap-1">
                                                                    <MessageCircle className="h-3 w-3" />
                                                                    {(ticket.messages_count ?? ticket.messages ?? 1)} messages
                                                                </span>
                                                                {ticket.category && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <Badge variant="outline" className="text-xs">{ticket.category}</Badge>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right flex-shrink-0">
                                                        <div className="text-sm text-muted-foreground mb-2">
                                                            {ticket.lastUpdate || (ticket.updated_at ? `Modifié ${new Date(ticket.updated_at).toLocaleDateString('fr-FR')}` : '')}
                                                        </div>
                                                        <div className={`px-2 py-1 rounded text-xs font-medium ${priority.bg} ${priority.color}`}>
                                                            Priorité {priority.text}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Aucun ticket */}
                                {filteredTickets.length === 0 && (
                                    <div className="p-12 text-center">
                                        <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">
                                            {searchTerm || activeFilter !== 'all'
                                                ? "Aucun ticket trouvé"
                                                : "Aucun ticket"
                                            }
                                        </h3>
                                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                            {searchTerm || activeFilter !== 'all'
                                                ? "Aucun ticket ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
                                                : "Vous n'avez pas encore créé de ticket de support. Créez votre premier ticket pour obtenir de l'aide."
                                            }
                                        </p>
                                        <Button asChild size="lg">
                                            <Link href={route('supportsTickets.create')}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Créer un ticket
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Pagination */}
                        {paginated?.links && paginated.links.length > 3 && (
                            <div className="flex items-center justify-center gap-1">
                                {paginated.links.map((ln: any, idx: number) => (
                                    <button
                                        key={idx}
                                        disabled={!ln.url}
                                        onClick={() => {
                                            if (ln.url) router.get(ln.url, {}, { preserveState: true, preserveScroll: true });
                                        }}
                                        className={`px-3 py-2 rounded border text-sm min-w-[40px] ${ln.active ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent border-border'} ${!ln.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: ln.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
