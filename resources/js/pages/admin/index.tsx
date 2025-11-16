import AppLayout from "@/layouts/app-layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, GraduationCap, Package, Users, Ticket, Receipt, Download, Clock, AlertCircle, TrendingUp, DollarSign, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { OrdersChart, RevenueChart, DownloadsChart } from "@/components/admin/charts";

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

  const euro = (cents: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((cents ?? 0) / 100);

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
    trend
  }: {
    title: string;
    value: string | number;
    icon: any;
    description?: string;
    action?: React.ReactNode;
    variant?: "default" | "secondary";
    trend?: { value: number; label: string };
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
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value}</div>
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
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
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
          <div className={`uppercase text-xs font-medium ${
            status === 'completed' || status === 'active' ? 'text-green-600' :
            status === 'pending' ? 'text-yellow-600' :
            status === 'cancelled' ? 'text-red-600' : 'text-muted-foreground'
          }`}>
            {status}
          </div>
        )}
        {date && <div className="text-xs text-muted-foreground">{date}</div>}
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard
              title="Formations"
              value={stats.courses}
              icon={GraduationCap}
              action={
                <Button asChild size="sm">
                  <Link href="/admin/courses">Gérer</Link>
                </Button>
              }
            />
            <StatCard
              title="Produits"
              value={stats.products}
              icon={Package}
              action={
                <Button asChild size="sm">
                  <Link href="/admin/products">Gérer</Link>
                </Button>
              }
            />
            <StatCard
              title="Utilisateurs"
              value={stats.users}
              icon={Users}
              action={
                <Button asChild size="sm" variant="outline">
                  <Link href="#">Voir</Link>
                </Button>
              }
            />
            <StatCard
              title="Licences"
              value={stats.licenses.total}
              secondaryValue={`${stats.licenses.active} actives`}
              icon={Receipt}
              action={
                <Button asChild size="sm" variant="outline">
                  <Link href="#">Voir</Link>
                </Button>
              }
            />
            <StatCard
              title="Commandes (30j)"
              value={stats.orders_30d}
              icon={TrendingUp}
              trend="up"
            />
            <StatCard
              title="Revenus (30j)"
              value={`${(stats.revenue_cents_30d / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`}
              icon={DollarSign}
              trend="up"
            />
            <StatCard
              title="Tickets"
              value={stats.tickets.total}
              secondaryValue={`${stats.tickets.open} ouverts`}
              icon={Ticket}
              trend={stats.tickets.open > 0 ? 'down' : 'up'}
            />
            <StatCard
              title="Téléchargements (30j)"
              value={stats.downloads_30d}
              icon={Download}
              trend="up"
            />
          </div>
        </section>

        {/* 📊 Section des graphiques */}
        <section>
          <SectionHeader
            title="Analytiques"
            subtitle="Statistiques et tendances récentes"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrdersChart data={chartData?.map((item: any) => ({
              date: item.date,
              value: item.orders
            }))} />
            <RevenueChart data={chartData?.map((item: any) => ({
              date: item.date,
              value: item.revenue
            }))} />
            <div className="lg:col-span-2">
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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
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
                  value={euro(order.amount ?? 0)}
                  status={order.status}
                  badge={order.product?.type}
                />
              ))}
            </ListCard>

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
        </section>

        {/* 🎯 Section produits et formations */}
        <section>
          <SectionHeader
            title="Contenu & Performances"
            subtitle="Gestion de vos produits et formations"
          />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <ListCard
              title="Top Produits (30j)"
              description="Produits les plus vendus par chiffre d'affaires"
              emptyMessage="Aucune vente de produit enregistrée"
            >
              {(topProducts30 ?? []).map((product: any) => (
                <ListItem
                  key={product.product_id}
                  primary={product.product?.name ?? 'Produit'}
                  value={euro(product.revenue_cents ?? 0)}
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

        {/* ℹ️ Section informations */}
        <section>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Tableau de bord en développement</h3>
                  <p className="text-blue-700 text-sm">
                    Certaines sections peuvent afficher "Aucune donnée disponible" car votre base de données
                    est en cours de peuplement. Les données s'afficheront automatiquement une fois que vous
                    aurez des produits, formations, commandes et tickets.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
