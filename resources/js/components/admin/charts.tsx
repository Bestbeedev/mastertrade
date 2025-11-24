import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

// Formatteur pour les dates en français sans dépendance externe
const formatDate = (date: string) => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date(date));

type ChartData = Array<{
    date: string;
    value: number;
}>;

// Graphique des commandes des 30 derniers jours
export function OrdersChart({ data }: { data?: ChartData }) {
    if (!data?.length) {
        return (
            <Card className="h-full flex flex-col">
                <CardHeader className="flex-shrink-0">
                    <CardTitle>Commandes (30j)</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 p-0 flex items-center justify-center">
                    <p className="text-muted-foreground">Aucune donnée disponible</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
                <CardTitle>Commandes (30j)</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-0">
                <ChartContainer config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={formatDate}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar
                                dataKey="value"
                                fill="currentColor"
                                className="fill-blue-400"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

// Graphique des revenus mensuels
export function RevenueChart({ data }: { data?: ChartData }) {
    if (!data?.length) {
        return (
            <Card className="h-full flex flex-col">
                <CardHeader className="flex-shrink-0">
                    <CardTitle>Revenus (30j)</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 p-0 flex items-center justify-center">
                    <p className="text-muted-foreground">Aucune donnée disponible</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
                <CardTitle>Revenus (30j)</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-0">
                <ChartContainer config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={formatDate}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `CFA ${value}`}
                            />
                            <ChartTooltip content={<ChartTooltipContent formatter={(value) => [`CFA ${value}`, "Revenu"]} />} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="currentColor"
                                className="text-green-400"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

// Graphique des téléchargements
export function DownloadsChart({ data }: { data?: ChartData }) {
    if (!data?.length) {
        return (
            <Card className="h-full flex flex-col">
                <CardHeader className="flex-shrink-0">
                    <CardTitle>Téléchargements (30j)</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 p-0 flex items-center justify-center">
                    <p className="text-muted-foreground">Aucune donnée disponible</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
                <CardTitle>Téléchargements (30j)</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-0">
                <ChartContainer
                    config={{}}
                    className="h-full w-full [&_.recharts-cartesian-axis-tick]:text-xs"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={formatDate}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <ChartTooltip
                                content={<ChartTooltipContent />}
                                wrapperStyle={{ outline: 'none' }}
                            />
                            <Bar
                                dataKey="value"
                                fill="currentColor"
                                className="fill-red-500"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
