import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus, Search, Filter, MessageCircle, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Ticket() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tickets et Support',
            href: '/client/ticket',
        },
    ];

    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const tickets = [
        {
            id: 'TKT-2024-001',
            subject: "Problème d'installation du logiciel",
            description: "Impossible d'installer la dernière version sur Windows 11, erreur système",
            status: "open",
            priority: "high",
            date: "15 Jan 2024",
            lastUpdate: "Il y a 2 heures",
            messages: 3,
            agent: "Jean Dupont",
            category: "Installation"
        },
        {
            id: 'TKT-2024-002',
            subject: "Question sur la facturation",
            description: "Comprendre les frais supplémentaires sur ma dernière facture de renouvellement",
            status: "in_progress",
            priority: "medium",
            date: "14 Jan 2024",
            lastUpdate: "Il y a 1 jour",
            messages: 5,
            agent: "Marie Martin",
            category: "Facturation"
        },
        {
            id: 'TKT-2024-003',
            subject: "Fonctionnalité manquante",
            description: "La fonction d'export PDF ne fonctionne pas correctement dans le module rapports",
            status: "resolved",
            priority: "medium",
            date: "10 Jan 2024",
            lastUpdate: "Il y a 5 jours",
            messages: 8,
            agent: "Pierre Lambert",
            category: "Fonctionnalité"
        },
    ];

    const filters = [
        { id: 'all', label: 'Tous les tickets', count: 12 },
        { id: 'open', label: 'Ouverts', count: 3 },
        { id: 'in_progress', label: 'En cours', count: 2 },
        { id: 'resolved', label: 'Résolus', count: 7 },
    ];

    type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
    type TicketPriority = "high" | "medium" | "low";


    const statusConfig: Record<TicketStatus, { variant: "destructive" | "default" | "outline" | "secondary"; text: string; icon: any }> = {
        open: { variant: "destructive", text: "Ouvert", icon: AlertCircle },
        in_progress: { variant: "default", text: "En cours", icon: Clock },
        resolved: { variant: "outline", text: "Résolu", icon: CheckCircle },
        closed: { variant: "secondary", text: "Fermé", icon: CheckCircle }
    };

    const priorityConfig: Record<TicketPriority, { color: string; bg: string; text: string }> = {
        high: { color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20", text: "Élevée" },
        medium: { color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/20", text: "Moyenne" },
        low: { color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20", text: "Basse" }
    };


    const stats = [
        {
            title: "Taux de satisfaction",
            value: "98%",
            description: "Clients satisfaits",
            color: "text-green-600"
        },
        {
            title: "Temps de réponse moyen",
            value: "2h",
            description: "Support réactif",
            color: "text-blue-600"
        },
        {
            title: "Disponibilité",
            value: "24/7",
            description: "Support permanent",
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
                            <Link href="/client/ticket/new">
                                <Plus className="h-4 w-4 mr-2" />
                                Nouveau ticket
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar avec filtres */}
                    <div className="lg:w-64 flex-shrink-0">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Filtres</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="space-y-1 p-2">
                                    {filters.map(filter => (
                                        <button
                                            key={filter.id}
                                            onClick={() => setActiveFilter(filter.id)}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${activeFilter === filter.id
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-accent'
                                                }`}
                                        >
                                            <span>{filter.label}</span>
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

                        {/* Informations support */}
                        <Card className="mt-6">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Support</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-sm">En ligne</span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Temps de réponse moyen: <strong>2 heures</strong>
                                </div>
                                <Button variant="outline" size="sm" asChild className="w-full">
                                    <Link href="/client/help">
                                        Centre d'aide
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contenu principal */}
                    <div className="flex-1">
                        {/* Barre de recherche et actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher dans les tickets..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Select defaultValue="recent">
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Trier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="recent">Récent</SelectItem>
                                        <SelectItem value="old">Ancien</SelectItem>
                                        <SelectItem value="priority">Priorité</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filtres
                                </Button>
                            </div>
                        </div>

                        {/* Statistiques */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {stats.map((stat, index) => (
                                <Card key={index}>
                                    <CardContent className="p-6 text-center">
                                        <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                                            {stat.value}
                                        </div>
                                        <div className="text-sm font-medium">{stat.title}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {stat.description}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Liste des tickets */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {activeFilter === 'all' ? 'Tous les tickets' :
                                        filters.find(f => f.id === activeFilter)?.label}
                                </CardTitle>
                                <CardDescription>
                                    Suivez l'avancement de vos demandes
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {tickets.map(ticket => {
                                        const status = statusConfig[ticket.status as TicketStatus];
                                        const priority = priorityConfig[ticket.priority as TicketPriority];
                                        const StatusIcon = status.icon;


                                        return (
                                            <Link
                                                key={ticket.id}
                                                href={`/client/ticket/${ticket.id}`}
                                                className="block p-6 hover:bg-accent/50 transition-colors group"
                                            >
                                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                    <div className="flex items-start gap-4 flex-1">
                                                        <div className={`p-2 rounded-lg ${priority.bg}`}>
                                                            <StatusIcon className={`h-5 w-5 ${priority.color}`} />
                                                        </div>
                                                        <div className="space-y-3 flex-1">
                                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                                                    {ticket.subject}
                                                                </h3>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant={status.variant}>
                                                                        {status.text}
                                                                    </Badge>
                                                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                                                </div>
                                                            </div>

                                                            <p className="text-muted-foreground line-clamp-2">
                                                                {ticket.description}
                                                            </p>

                                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                                <span>#{ticket.id}</span>
                                                                <span>Créé le: {ticket.date}</span>
                                                                <span className="flex items-center gap-1">
                                                                    <MessageCircle className="h-3 w-3" />
                                                                    {ticket.messages} messages
                                                                </span>
                                                                <Badge variant="outline">{ticket.category}</Badge>
                                                                {ticket.agent && (
                                                                    <span>Assigné à: {ticket.agent}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="text-sm text-muted-foreground mb-2">
                                                            {ticket.lastUpdate}
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
                                {tickets.length === 0 && (
                                    <div className="p-12 text-center">
                                        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">Aucun ticket trouvé</h3>
                                        <p className="text-muted-foreground mb-6">
                                            {searchTerm || activeFilter !== 'all'
                                                ? "Aucun ticket ne correspond à vos critères de recherche."
                                                : "Vous n'avez pas encore créé de ticket de support."
                                            }
                                        </p>
                                        <Button asChild>
                                            <Link href="/client/ticket/new">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Créer votre premier ticket
                                            </Link>
                                        </Button>
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
