import {
    IconLicense,
    IconShoppingCart,
    IconDownload,
    IconSchool,
    IconClock,
    IconCheck,
    IconTrendingUp,
    IconTrendingDown,
    IconAlertCircle,
    IconChartBar,
    IconMoodHappy
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
import { usePage } from "@inertiajs/react"

interface DashboardStats {
    activeLicenses?: number;
    licenseStatus?: {
        active?: number;
        expired?: number;
    };
    totalDownloads?: number;
    activeCourses?: number;
    courseProgressAvg?: number;
    pendingRenewals?: number;
    supportTickets?: number;
    totalOrders?: number;
}

interface StatConfig {
    icon: React.ComponentType<Record<string, unknown>>;
    bgLight: string;
    iconColor: string;
    badgeColor: string;
    textColor: string;
    trendIcon: React.ComponentType<Record<string, unknown>>;
    statusIcon: React.ComponentType<Record<string, unknown>>;
}

interface StatData {
    total: number;
    trend: 'up' | 'down' | 'stable';
    change: string;
    description: string;
}

export function SectionCards() {
    const { dashboardStats } = usePage().props as { dashboardStats?: DashboardStats };
    const source = dashboardStats ?? {};

    // Calcul des métriques dérivées
    const stats = {
        licenses: {
            total: source.activeLicenses ?? 0,
            trend: (source.activeLicenses ?? 0) > 2 ? 'up' as const : 'stable' as const,
            change: '+1 ce mois-ci',
            description: `${source.licenseStatus?.active ?? 0} actives, ${source.licenseStatus?.expired ?? 0} expirées`
        },
        downloads: {
            total: source.totalDownloads ?? 0,
            trend: (source.totalDownloads ?? 0) > 20 ? 'up' as const : 'stable' as const,
            change: '+3 ce mois-ci',
            description: ''
        },
        courses: {
            total: source.activeCourses ?? 0,
            trend: (source.activeCourses ?? 0) > 0 ? 'up' as const : 'stable' as const,
            change: (source.activeCourses ?? 0) > 0 ? '1 en cours' : 'Aucune',
            description: (source.activeCourses ?? 0) > 0 ? `${source.courseProgressAvg ?? 0}% de complétion moyenne` : '—'
        },
        renewals: {
            total: source.pendingRenewals ?? 0,
            trend: (source.pendingRenewals ?? 0) > 0 ? 'down' as const : 'stable' as const,
            change: (source.pendingRenewals ?? 0) > 0 ? 'À traiter' : 'À jour',
            description: (source.pendingRenewals ?? 0) > 0 ? 'Expire dans 15 jours' : '—'
        },
        support: {
            total: source.supportTickets ?? 0,
            trend: (source.supportTickets ?? 0) > 0 ? 'down' as const : 'stable' as const,
            change: (source.supportTickets ?? 0) > 0 ? 'Nouveaux' : 'Aucun',
            description: (source.supportTickets ?? 0) > 0 ? 'Réponse requise' : '—'
        },
        orders: {
            total: source.totalOrders ?? 0,
            trend: 'up' as const,
            change: '+2 cette année',
            description: 'Dernière commande: 10 Jan'
        }
    }

    const cardConfigs = {
        licenses: {
            icon: IconLicense,
            bgLight: "bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10",
            iconColor: "text-green-600 dark:text-green-400",
            badgeColor: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
            textColor: "text-green-700 dark:text-green-300",
            trendIcon: IconTrendingUp,
            statusIcon: IconMoodHappy
        },
        downloads: {
            icon: IconDownload,
            bgLight: "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10",
            iconColor: "text-blue-600 dark:text-blue-400",
            badgeColor: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
            textColor: "text-blue-700 dark:text-blue-300",
            trendIcon: IconTrendingUp,
            statusIcon: IconChartBar
        },
        courses: {
            icon: IconSchool,
            bgLight: "bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10",
            iconColor: "text-purple-600 dark:text-purple-400",
            badgeColor: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
            textColor: "text-purple-700 dark:text-purple-300",
            trendIcon: IconTrendingUp,
            statusIcon: IconSchool
        },
        renewals: {
            icon: IconClock,
            bgLight: "bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10",
            iconColor: "text-orange-600 dark:text-orange-400",
            badgeColor: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
            textColor: "text-orange-700 dark:text-orange-300",
            trendIcon: IconTrendingDown,
            statusIcon: IconAlertCircle
        },
        support: {
            icon: IconShoppingCart,
            bgLight: "bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10",
            iconColor: "text-red-600 dark:text-red-400",
            badgeColor: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
            textColor: "text-red-700 dark:text-red-300",
            trendIcon: IconTrendingDown,
            statusIcon: IconAlertCircle
        },
        orders: {
            icon: IconShoppingCart,
            bgLight: "bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-950/20 dark:to-cyan-900/10",
            iconColor: "text-cyan-600 dark:text-cyan-400",
            badgeColor: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
            textColor: "text-cyan-700 dark:text-cyan-300",
            trendIcon: IconTrendingUp,
            statusIcon: IconChartBar
        }
    }

    const StatCard = ({ title, stat, config }: { title: string; stat: StatData; config: StatConfig }) => {
        const IconComponent = config.icon;
        const StatusIcon = config.statusIcon;
        const trendIcon = stat.trend === 'up' ?
            <IconTrendingUp className="h-3 w-3" /> :
            stat.trend === 'down' ?
                <IconTrendingDown className="h-3 w-3" /> :
                <IconCheck className="h-3 w-3" />;

        const statusText = stat.trend === 'up' ? 'Hausse récente' :
            stat.trend === 'down' ? 'Attention requise' :
                'Statut stable';

        return (
            <Card className={`@container/card hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
                <CardHeader className="pb-3">
                    <CardDescription className="flex items-center gap-2">
                        <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
                        <span className="font-medium text-gray-700 dark:text-gray-300">{title}</span>
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold tabular-nums @[250px]/card:text-4xl text-gray-900 dark:text-white">
                        {stat.total}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className={config.badgeColor}>
                            {trendIcon}
                            {stat.change}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-2 text-sm pt-0">
                    <div className={`line-clamp-1 flex gap-2 font-semibold ${config.textColor}`}>
                        <StatusIcon className="h-4 w-4" />
                        {statusText}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">
                        {stat.description || 'Aucune activité récente'}
                    </div>
                </CardFooter>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-6 px-4 lg:px-10 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            <StatCard
                title="Licences Actives"
                stat={stats.licenses}
                config={cardConfigs.licenses}
            />

            <StatCard
                title="Téléchargements"
                stat={stats.downloads}
                config={cardConfigs.downloads}
            />

            <StatCard
                title="Formations en Cours"
                stat={stats.courses}
                config={cardConfigs.courses}
            />

            <StatCard
                title="Renouvellements"
                stat={stats.renewals}
                config={cardConfigs.renewals}
            />

            <StatCard
                title="Tickets Support"
                stat={stats.support}
                config={cardConfigs.support}
            />

            <StatCard
                title="Total Commandes"
                stat={stats.orders}
                config={cardConfigs.orders}
            />
        </div>
    )
}
