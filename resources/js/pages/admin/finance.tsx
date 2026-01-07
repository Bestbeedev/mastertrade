import AppLayout from "@/layouts/app-layout";
import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { route } from "ziggy-js";
import { formatCFA } from "@/lib/utils";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CartesianGrid, ComposedChart, Line, Bar, XAxis, YAxis, BarChart } from "recharts";

interface FinanceTotals {
    revenue_cents_total: number;
    revenue_cents_range: number;
    orders_range: number;
}

interface TopProduct {
    product_id: string;
    product?: { name: string };
    revenue_cents?: number;
    orders_count?: number;
}

interface RecentOrder {
    id: string;
    user?: { name: string; email: string };
    product?: { name: string };
    amount?: number;
    status?: string;
    created_at?: string;
}

interface FinanceFilters {
    range?: number;
}

export default function AdminFinance({ chartData = [], totals = { revenue_cents_total: 0, revenue_cents_range: 0, orders_range: 0 }, statusCounts = {}, topProducts = [], recentOrders = [], filters = { range: 30 } }: { chartData?: Array<{ date: string; revenue: number; orders: number }>; totals?: FinanceTotals; statusCounts?: Record<string, number>; topProducts?: TopProduct[]; recentOrders?: RecentOrder[]; filters?: FinanceFilters }) {
    const cfg = {
        revenue: {
            label: "Revenus (CFA)",
            color: "hsl(var(--primary))",
        },
        orders: {
            label: "Commandes",
            color: "hsl(var(--muted-foreground))",
        },
    } as const;

    const statusLabel = (s: string) => ({
        pending: "En attente",
        paid: "Payée",
        failed: "Échouée",
        refunded: "Remboursée",
    } as Record<string, string>)[s] || s;

    const currentRange = Number(filters?.range || 30);
    const rangeOptions = [7, 30, 90] as const;
    const topProductsChart = Array.isArray(topProducts)
        ? topProducts.map((p: TopProduct) => ({ name: p.product?.name || "Produit", revenue: (p.revenue_cents || 0) / 100 }))
        : [];

    return (
        <AppLayout breadcrumbs={[{ title: "Admin", href: route("admin") }, { title: "Finances", href: route("admin.finance") }]}>
            <Head title="Admin • Finances" />
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Filtres période */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Période</CardTitle>
                        <CardDescription>Sélectionnez une période d'analyse</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {rangeOptions.map((r) => (
                            <a
                                key={r}
                                href={route("admin.finance", { range: r })}
                                className={`px-3 py-1.5 rounded-md border text-sm ${currentRange === r ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`}
                            >
                                {r} jours
                            </a>
                        ))}
                    </CardContent>
                </Card>

                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total revenus</CardDescription>
                            <CardTitle className="text-2xl">{formatCFA(totals.revenue_cents_total || 0)}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Revenus période</CardDescription>
                            <CardTitle className="text-2xl">{formatCFA(totals.revenue_cents_range || 0)}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Commandes période</CardDescription>
                            <CardTitle className="text-2xl">{totals.orders_range || 0}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Statuts */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Répartition des statuts des commandes</CardTitle>
                        <CardDescription>Mises à jour en temps réel selon la base</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {(["paid", "pending", "failed", "refunded"] as const).map((s) => (
                            <Badge key={s} variant={s === "paid" ? "default" : s === "pending" ? "secondary" : s === "failed" ? "destructive" : "outline"}>
                                {statusLabel(s)}: {statusCounts?.[s] ?? 0}
                            </Badge>
                        ))}
                    </CardContent>
                </Card>

                {/* Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Revenus & Commandes ({currentRange} jours)</CardTitle>
                        <CardDescription>Suivi quotidien</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={cfg} className="w-full">
                            <ComposedChart data={chartData} margin={{ left: 12, right: 12 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={16} />
                                <YAxis yAxisId="left" tickLine={false} axisLine={false} width={40} />
                                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} width={40} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} formatter={(value: number, name: string) => (
                                    <span>{name === "revenue" ? `${(Number(value) || 0).toLocaleString()} CFA` : `${value}`}</span>
                                )} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="orders" yAxisId="right" className="fill-green-400" fill="var(--color-orders)" radius={[4, 4, 0, 0]} />
                                <Line dataKey="revenue" yAxisId="left" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
                            </ComposedChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top produits */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top produits par revenus</CardTitle>
                            <CardDescription>Basé sur les commandes payées</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Mini bar chart top produits */}
                            {topProductsChart.length > 0 && (
                                <div className="mb-6">
                                    <ChartContainer config={{ revenue: { label: "Revenus", color: "hsl(var(--primary))" } }} className="w-full">
                                        <BarChart data={topProductsChart} margin={{ left: 12, right: 12 }}>
                                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                            <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
                                            <YAxis tickLine={false} axisLine={false} width={40} />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} formatter={(value: number) => (
                                                <span>{`${(Number(value) || 0).toLocaleString()} CFA`}</span>
                                            )} />
                                            <Bar dataKey="revenue" fill="var(--color-revenue)" className="fill-green-500" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ChartContainer>
                                </div>
                            )}
                            <div className="space-y-3">
                                {Array.isArray(topProducts) && topProducts.length > 0 ? (
                                    topProducts.map((p: TopProduct) => (
                                        <div key={p.product_id} className="flex items-center justify-between border-b pb-2">
                                            <div className="font-medium">{p.product?.name || "Produit"}</div>
                                            <div className="text-sm text-muted-foreground">{formatCFA(p.revenue_cents || 0)} • {p.orders_count} cmd</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-muted-foreground">Aucune donnée</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Commandes récentes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Commandes récentes</CardTitle>
                            <CardDescription>10 dernières</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {Array.isArray(recentOrders) && recentOrders.length > 0 ? (
                                    recentOrders.map((o: RecentOrder) => (
                                        <div key={o.id} className="flex items-center justify-between border-b pb-2">
                                            <div>
                                                <div className="font-medium">{o.user?.name || "Client"}</div>
                                                <div className="text-xs text-muted-foreground">{o.product?.name || "Produit"}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium">{formatCFA(o.amount || 0)}</div>
                                                <div className="text-xs text-muted-foreground">{o.created_at ? new Date(o.created_at).toLocaleDateString('fr-FR') : ''}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-muted-foreground">Aucune donnée</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
