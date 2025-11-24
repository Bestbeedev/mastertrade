import AppLayout from "@/layouts/app-layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, GraduationCap, Package, Users, Ticket, Receipt, Download, Clock, AlertCircle, TrendingUp, DollarSign, BarChart2, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { OrdersChart, RevenueChart, DownloadsChart } from "@/components/admin/charts";
import { formatCFA } from "@/lib/utils";

export default function AdminIndex() {
    const { adminStats, recentOrders, recentTickets, recentLicenses, topProducts30, recentProducts, recentCourses, chartData } = usePage().props as any;

    const stats = adminStats ?? {
        products: 0,
        courses: 0,
        users: 0,
        licenses: { total: 0, active: 0 },
        orders_30d: 0,
        revenue_cents_30d: 0,
        tickets: { total: 0, open: 0 },
        downloads_30d: 0,
        renewals_due_30d: 0,
    };

    const cfa = (cents: number) => formatCFA(cents ?? 0);

    const EmptyState = ({ message }: { message: string }) => (
        <div className="text-center py-8 border-2 border-dashed rounded-lg bg-muted/20">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );

    const StatCard = ({
        title,
        value,
        icon: Icon,
        description,
        action,
        variant = "default",
        trend,
        secondaryValue,
    }: {
        title: string;
        value: string | number;
        icon: any;
        description?: string;
        action?: React.ReactNode;
        variant?: "default" | "secondary";
        trend?: { value: number; label: string };
        secondaryValue?: string;
    }) => (
        <Card className="relative">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <Icon className="h-4 w-4" />
                        {title}
                    </CardTitle>
                    {trend && (
                        <Badge variant={trend.value >= 0 ? "default" : "destructive"} className="text-xs">
                            {trend.value >= 0 ? "+" : ""}{trend.value}%
                        </Badge>
                    )}
                </div>
                {description && (
                    <CardDescription className="text-xs">{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <div className="flex items-center  justify-between">
                    <div>
                        <div className="text-2xl font-bold text-blue-500">{value}</div>
                        {secondaryValue && (
                            <div className="text-xs text-muted-foreground mt-1">{secondaryValue}</div>
                        )}
                    </div>
                    {variant === "default" && action}
                </div>
                {trend && (
                    <p className="text-xs text-muted-foreground mt-2">{trend.label}</p>
                )}
            </CardContent>
        </Card>
    );

    const ListCard = ({
        title,
        description,
        children,
        emptyMessage = "Aucune donnée disponible pour le moment"
    }: {
        title: string;
        description: string;
        children: React.ReactNode;
        emptyMessage?: string;
    }) => (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-3">
                    {children}
                </div>
                {React.Children.count(children) === 0 && (
                    <EmptyState message={emptyMessage} />
                )}
            </CardContent>
        </Card>
    );

    const ListItem = ({
        primary,
        secondary,
        tertiary,
        value,
        status,
        date,
        badge
    }: {
        primary: string;
        secondary?: string;
        tertiary?: string;
        value?: string;
        status?: string;
        date?: string;
        badge?: string;
    }) => (
        <div className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted/50 transition-colors group">
            <div className="flex-1  min-w-0">
                <div className="flex mb-2 items-center gap-2">
                    <div className="font-medium text-sm truncate">{primary}</div>
                    {badge && (
                        <Badge variant="secondary" className="text-xs">
                            {badge}
                        </Badge>
                    )}
                </div>
                {secondary && (
                    <div className="text-muted-foreground text-sm truncate mt-1">{secondary}</div>
                )}
                {tertiary && (
                    <div className="text-xs text-muted-foreground mt-1">{tertiary}</div>
                )}
            </div>
            <div className="text-right text-sm ml-4 flex-shrink-0">
                {value && <div className="font-semibold">{value}</div>}
                {status && (
                    <Badge
                        className={`uppercase text-xs font-medium px-2 py-1 rounded-md ${status === 'completed' || status === 'active' ? 'text-green-600 bg-green-50 border border-green-200' :
                                status === 'pending' ? 'text-yellow-600 bg-yellow-50 border border-yellow-200' :
                                    status === 'cancelled' ? 'text-red-600 bg-red-50 border border-red-200' :
                                        'text-muted-foreground bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {status}
                    </Badge>
                )}
                {date && <div className="text-xs mt-2 text-muted-foreground">{date}</div>}
            </div>
        </div>
    );

    const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
        <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            {subtitle && (
                <p className="text-muted-foreground mt-1">{subtitle}</p>
            )}
        </div>
    );

    return (
        <AppLayout breadcrumbs={[{ title: "Admin", href: "/admin" }]}>
            <Head title="Tableau de bord Admin" />

            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-12">
                {/* 🔥 Section principale des statistiques */}
                <section>
                    <SectionHeader
                        title="Aperçu général"
                        subtitle="Vue d'ensemble de votre activité"
                    />
                    <div className="space-y-8">
                        {/* 🎯 SECTION PRINCIPALE - ENTITÉS */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Entités principales</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                <StatCard
                                    title="Formations"
                                    value={stats.courses}
                                    icon={GraduationCap}
                                    action={
                                        <Button asChild size="sm" >
                                            <Link href="/admin/courses">Gérer</Link>
                                        </Button>
                                    }
                                    variant="default"
                                />
                                <StatCard
                                    title="Produits"
                                    value={stats.products}
                                    icon={Package}
                                    action={
                                        <Button asChild size="sm" variant="outline">
                                            <Link href="/admin/products">Gérer</Link>
                                        </Button>
                                    }
                                    variant="default"
                                />
                                <StatCard
                                    title="Utilisateurs"
                                    value={stats.users}
                                    icon={Users}
                                    action={
                                        <Button asChild size="sm" variant="outline" >
                                            <Link href="/admin/users">Voir</Link>
                                        </Button>
                                    }
                                    variant="default"
                                />
                                <StatCard
                                    title="Licences"
                                    value={stats.licenses.total}
                                    secondaryValue={`${stats.licenses.active} actives`}
                                    icon={Receipt}
                                    action={
                                        <Button asChild size="sm">
                                            <Link href="/admin/licenses">Voir</Link>
                                        </Button>
                                    }
                                    variant="default"
                                />
                            </div>
                        </div>

                        {/* 📊 SECTION PERFORMANCE - 30 JOURS */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Performance (30 jours)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                                <StatCard
                                    title="Commandes"
                                    value={stats.orders_30d}
                                    icon={TrendingUp}
                                    variant="secondary"
                                    description="Nouvelles commandes"
                                />
                                <StatCard
                                    title="Revenus"
                                    value={cfa(stats.revenue_cents_30d ?? 0)}
                                    icon={DollarSign}
                                    variant="secondary"
                                    description="Chiffre d'affaires"
                                />

                                <StatCard
                                    title="Téléchargements"
                                    value={stats.downloads_30d}
                                    secondaryValue={`${stats.downloads_30d} téléchargements`}
                                    icon={Download}
                                    action={
                                        <Button asChild size="sm" variant="outline">
                                            <Link href="/admin/downloads">Voir</Link>
                                        </Button>
                                    }
                                    variant="default"
                                    description="Fichiers téléchargés"
                                />
                            </div>
                        </div>

                        {/* 🎓 SECTION FORMATIONS */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Formations</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                <StatCard
                                    title="Nouvelles inscriptions"
                                    value={stats.course_enrollments_30d ?? 0}
                                    icon={Users}
                                    variant="secondary"
                                    description="30 derniers jours"
                                />
                                <StatCard
                                    title="Progression moyenne"
                                    value={`${stats.avg_course_progress ?? 0}%`}
                                    icon={BarChart2}
                                    variant="default"
                                    description="Tous les cours"
                                />
                                <StatCard
                                    title="Taux de complétion"
                                    value="--%"
                                    icon={BarChart2}
                                    variant="default"
                                    description="En cours d'analyse"
                                />
                            </div>
                        </div>

                        {/* 🎫 SECTION SUPPORT */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Support & Service</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <StatCard
                                    title="Tickets support"
                                    value={stats.tickets.total}
                                    secondaryValue={`${stats.tickets.open} ouverts`}
                                    icon={Ticket}

                                    action={
                                        <Button asChild size="sm" variant="secondary">
                                            <Link href="supportsTickets">Gérer</Link>
                                        </Button>
                                    }
                                />
                                <StatCard
                                    title="Taux de résolution"
                                    value="--%"
                                    icon={Clock}

                                    description="Temps moyen de réponse"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 📊 Section des graphiques */}
                <section className="w-full overflow-x-auto">
                    <SectionHeader
                        title="Analytiques"
                        subtitle="Statistiques et tendances récentes"
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-[300px]">
                        <div className="w-full min-w-[300px] h-fit">
                            <OrdersChart data={chartData?.map((item: any) => ({
                                date: item.date,
                                value: item.orders
                            }))} />
                        </div>
                        <div className="w-full min-w-[300px] h-fit ">
                            <RevenueChart data={chartData?.map((item: any) => ({
                                date: item.date,
                                value: item.revenue
                            }))} />
                        </div>
                        <div className="lg:col-span-2 w-full min-w-[300px] h-[350px] sm:h-[400px]">
                            <DownloadsChart data={chartData?.map((item: any) => ({
                                date: item.date,
                                value: item.downloads
                            }))} />
                        </div>
                    </div>
                </section>

                {/* 📊 Section métriques détaillées */}
                <section>
                    <SectionHeader
                        title="Métriques détaillées"
                        subtitle="Indicateurs de performance clés"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        <StatCard
                            title="Commandes (30j)"
                            value={stats.orders_30d}
                            icon={Receipt}
                            description={`${stats.licenses?.active ?? 0} licences actives`}
                            variant="secondary"
                            trend={{ value: 8, label: "nouvelles commandes" }}
                        />
                        <StatCard
                            title="Tickets Support"
                            value={`${stats.tickets?.open ?? 0}/${stats.tickets?.total ?? 0}`}
                            icon={Ticket}
                            description="Ouverts / Total"
                            variant="secondary"
                        />
                        <StatCard
                            title="Téléchargements (30j)"
                            value={stats.downloads_30d ?? 0}
                            icon={Download}
                            variant="secondary"
                            trend={{ value: 15, label: "augmentation" }}
                        />
                        <StatCard
                            title="Renouvellements à venir"
                            value={stats.renewals_due_30d ?? 0}
                            icon={Clock}
                            variant="secondary"
                            description="Dans les 30 prochains jours"
                        />
                    </div>
                </section>

                {/* 📈 Section activité récente */}
                <section>
                    <SectionHeader
                        title="Activité récente"
                        subtitle="Dernières actions sur votre plateforme"
                    />
                    <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
                        <ListCard
                            title="Dernières commandes"
                            description="5 commandes les plus récentes"
                            emptyMessage="Aucune commande récente pour le moment"
                        >
                            {(recentOrders ?? []).map((order: any) => (
                                <ListItem
                                    key={order.id}
                                    primary={order.product?.name ?? 'Produit'}
                                    secondary={new Date(order.created_at).toLocaleDateString('fr-FR')}
                                    value={cfa(order.amount ?? 0)}
                                    status={order.status}
                                    badge={order.product?.type}
                                />
                            ))}
                        </ListCard>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ListCard
                                title="Licences récentes"
                                description="5 licences les plus récentes"
                                emptyMessage="Aucune licence créée récemment"
                            >
                                {(recentLicenses ?? []).map((license: any) => (
                                    <ListItem
                                        key={license.id}
                                        primary={license.product?.name ?? 'Produit'}
                                        secondary={license.user?.name ?? 'Utilisateur'}
                                        status={license.status}
                                        date={license.expiry_date ? new Date(license.expiry_date).toLocaleDateString('fr-FR') : '—'}
                                        badge="Licence"
                                    />
                                ))}
                            </ListCard>
                            <ListCard
                                title="Tickets récents"
                                description="5 tickets les plus récents"
                                emptyMessage="Aucun ticket support récent"
                            >
                                {(recentTickets ?? []).map((ticket: any) => (
                                    <ListItem
                                        key={ticket.id}
                                        primary={ticket.subject}
                                        secondary={ticket.user?.name ?? 'Utilisateur'}
                                        status={ticket.status}
                                        date={new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                                        badge={ticket.priority}
                                    />
                                ))}
                            </ListCard>
                        </div>
                    </div>
                </section>

                {/* 🎯 Section produits et formations */}
                <section>
                    <SectionHeader
                        title="Contenu & Performances"
                        subtitle="Gestion de vos produits et formations"
                    />
                    <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
                        <ListCard
                            title="Top Produits (30j)"
                            description="Produits les plus vendus par chiffre d'affaires"
                            emptyMessage="Aucune vente de produit enregistrée"
                        >
                            {(topProducts30 ?? []).map((product: any) => (
                                <ListItem
                                    key={product.product_id}
                                    primary={product.product?.name ?? 'Produit'}
                                    value={cfa(product.revenue_cents ?? 0)}
                                    tertiary={`${product.orders_count} commandes`}
                                    badge="Top"
                                />
                            ))}
                        </ListCard>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ListCard
                                title="Produits récents"
                                description="5 produits ajoutés récemment"
                                emptyMessage="Aucun produit créé pour le moment"
                            >
                                {(recentProducts ?? []).map((product: any) => (
                                    <ListItem
                                        key={product.id}
                                        primary={product.name}
                                        secondary={`SKU ${product.sku} ${product.version ? `• v${product.version}` : ''}`}
                                        date={new Date(product.created_at).toLocaleDateString('fr-FR')}
                                        badge="Nouveau"
                                    />
                                ))}
                            </ListCard>

                            <ListCard
                                title="Formations récentes"
                                description="5 formations ajoutées récemment"
                                emptyMessage="Aucune formation créée pour le moment"
                            >
                                {(recentCourses ?? []).map((course: any) => (
                                    <ListItem
                                        key={course.id}
                                        primary={course.title}
                                        date={new Date(course.created_at).toLocaleDateString('fr-FR')}
                                        badge="Formation"
                                    />
                                ))}
                            </ListCard>
                        </div>
                    </div>
                </section>

                <section>
                    <SectionHeader
                        title="Centre d'aide"
                        subtitle="Gérez les articles de FAQ, documentation et tutoriels affichés dans le centre d'aide client" />
                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                    <HelpCircle className="h-4 w-4" />
                                    Articles du centre d'aide
                                </CardTitle>
                                <CardDescription>
                                    Créez et maintenez les articles d'aide (FAQ, documentation, tutoriels).
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground max-w-xs">
                                    Accédez à l'interface de gestion des articles d'aide.
                                </div>
                                <Button asChild size="sm">
                                    <Link href="/admin/help-articles">Gérer</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
