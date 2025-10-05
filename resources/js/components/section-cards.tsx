import {
    IconLicense,
    IconShoppingCart,
    IconDownload,
    IconSchool,
    IconClock,
    IconCheck,
    IconTrendingUp,
    IconTrendingDown
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

// Données dynamiques du client
const clientStats = {
    activeLicenses: 3,
    totalOrders: 8,
    totalDownloads: 24,
    activeCourses: 2,
    pendingRenewals: 1,
    supportTickets: 2,
    licenseStatus: {
        active: 3,
        expired: 1,
        trial: 0
    },
    recentActivity: [
        { product: "MasterTrade", action: "Téléchargement", date: "2024-01-15" },
        { product: "MasterImmo", action: "Renouvellement", date: "2024-01-10" }
    ]
}

const products = {
    "MasterAdogbe": { name: "MasterAdogbe", version: "v2.1.0", category: "Tontines" },
    "MasterImmo": { name: "MasterImmo", version: "v1.8.3", category: "Immobilier" },
    "MasterTrade": { name: "MasterTrade", version: "v3.2.1", category: "Commercial" },
    "MasterStock": { name: "MasterStock", version: "v2.0.3", category: "Logistique" },
    "Ecosoft": { name: "Ecosoft", version: "v1.5.2", category: "Éducation" }
}

export function SectionCards() {
    // Calcul des métriques dérivées
    const stats = {
        licenses: {
            total: clientStats.activeLicenses,
            trend: clientStats.activeLicenses > 2 ? 'up' : 'stable',
            change: '+1 ce mois-ci',
            description: `${clientStats.licenseStatus.active} actives, ${clientStats.licenseStatus.expired} expirées`
        },
        downloads: {
            total: clientStats.totalDownloads,
            trend: clientStats.totalDownloads > 20 ? 'up' : 'stable',
            change: '+3 ce mois-ci',
            description: 'Dernier: MasterTrade v3.2.1'
        },
        courses: {
            total: clientStats.activeCourses,
            trend: clientStats.activeCourses > 0 ? 'up' : 'stable',
            change: '1 en cours',
            description: '67% de complétion moyenne'
        },
        renewals: {
            total: clientStats.pendingRenewals,
            trend: clientStats.pendingRenewals > 0 ? 'down' : 'stable',
            change: 'À traiter',
            description: 'Expire dans 15 jours'
        },
        support: {
            total: clientStats.supportTickets,
            trend: clientStats.supportTickets > 0 ? 'down' : 'stable',
            change: '1 en attente',
            description: 'Dernier réponse: 2h'
        },
        orders: {
            total: clientStats.totalOrders,
            trend: 'up',
            change: '+2 cette année',
            description: 'Dernière commande: 10 Jan'
        }
    }

    return (
        <div className="grid grid-cols-1 gap-6 px-4 lg:px-10 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            {/* Mes Licences Actives */}
            <Card className="@container/card border-l-4 border-l-green-500 hover:shadow-lg shadow-xl transition-shadow">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconLicense className="h-4 w-4 text-green-500" />
                        Licences Actives
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats.licenses.total}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className={
                            stats.licenses.trend === 'up'
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                        }>
                            {stats.licenses.trend === 'up' ? <IconTrendingUp className="h-3 w-3" /> : <IconCheck className="h-3 w-3" />}
                            {stats.licenses.change}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className={`line-clamp-1 flex gap-2 font-medium ${stats.licenses.trend === 'up' ? 'text-green-700' : 'text-gray-700'
                        }`}>
                        {stats.licenses.trend === 'up' ? 'Nouvelle licence activée' : 'Statut stable'}
                    </div>
                    <div className="text-muted-foreground">
                        {stats.licenses.description}
                    </div>
                </CardFooter>
            </Card>

            {/* Téléchargements */}
            <Card className="@container/card border-l-4 border-l-blue-500 hover:shadow-lg shadow-xl  transition-shadow">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconDownload className="h-4 w-4 text-blue-500" />
                     Téléchargements
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats.downloads.total}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className={
                            stats.downloads.trend === 'up'
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                        }>
                            {stats.downloads.trend === 'up' ? <IconTrendingUp className="h-3 w-3" /> : <IconCheck className="h-3 w-3" />}
                            {stats.downloads.change}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className={`line-clamp-1 flex gap-2 font-medium ${stats.downloads.trend === 'up' ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                        {stats.downloads.trend === 'up' ? 'Activité récente' : 'Aucun nouveau téléchargement'}
                    </div>
                    <div className="text-muted-foreground">
                        {stats.downloads.description}
                    </div>
                </CardFooter>
            </Card>

            {/* Formations en Cours */}
            <Card className="@container/card border-l-4 border-l-purple-500 hover:shadow-lg shadow-xl  transition-shadow">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconSchool className="h-4 w-4 text-purple-500" />
                        Formations en Cours
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats.courses.total}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className={
                            stats.courses.trend === 'up'
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                        }>
                            <IconCheck className="h-3 w-3" />
                            {stats.courses.change}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className={`line-clamp-1 flex gap-2 font-medium ${stats.courses.trend === 'up' ? 'text-purple-700' : 'text-gray-700'
                        }`}>
                        {stats.courses.trend === 'up' ? 'Formation active' : 'Aucune formation'}
                    </div>
                    <div className="text-muted-foreground">
                        {stats.courses.description}
                    </div>
                </CardFooter>
            </Card>

            {/* Renouvellements en Attente */}
            <Card className="@container/card border-l-4 border-l-orange-500 shadow-xl  hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconClock className="h-4 w-4 text-orange-500" />
                        Renouvellements
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats.renewals.total}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className={
                            stats.renewals.trend === 'down'
                                ? "bg-orange-50 text-orange-700 border-orange-200"
                                : "bg-green-50 text-green-700 border-green-200"
                        }>
                            {stats.renewals.trend === 'down' ? <IconClock className="h-3 w-3" /> : <IconCheck className="h-3 w-3" />}
                            {stats.renewals.change}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className={`line-clamp-1 flex gap-2 font-medium ${stats.renewals.trend === 'down' ? 'text-orange-700' : 'text-green-700'
                        }`}>
                        {stats.renewals.trend === 'down' ? 'Attention requise' : 'Tout est à jour'}
                    </div>
                    <div className="text-muted-foreground">
                        {stats.renewals.description}
                    </div>
                </CardFooter>
            </Card>

            {/* Support & Tickets */}
            <Card className="@container/card border-l-4 border-l-red-500 hover:shadow-lg shadow-xl  transition-shadow">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconShoppingCart className="h-4 w-4 text-red-500" />
                        Tickets Support
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats.support.total}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className={
                            stats.support.trend === 'down'
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-green-50 text-green-700 border-green-200"
                        }>
                            {stats.support.trend === 'down' ? <IconClock className="h-3 w-3" /> : <IconCheck className="h-3 w-3" />}
                            {stats.support.change}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className={`line-clamp-1 flex gap-2 font-medium ${stats.support.trend === 'down' ? 'text-red-700' : 'text-green-700'
                        }`}>
                        {stats.support.trend === 'down' ? 'En attente de réponse' : 'Tous résolus'}
                    </div>
                    <div className="text-muted-foreground">
                        {stats.support.description}
                    </div>
                </CardFooter>
            </Card>

            {/* Historique Commandes */}
            <Card className="@container/card border-l-4 shadow-xl  border-l-cyan-500 hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconShoppingCart className="h-4 w-4 text-cyan-500" />
                        Total Commandes
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats.orders.total}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
                            <IconTrendingUp className="h-3 w-3" />
                            {stats.orders.change}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium text-cyan-700">
                        Historique complet
                    </div>
                    <div className="text-muted-foreground">
                        {stats.orders.description}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
