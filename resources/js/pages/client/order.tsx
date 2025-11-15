import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Package, ArrowLeft, Download, Receipt } from "lucide-react";
import { route } from "ziggy-js";

export default function OrderPage({ order }: { order?: any }) {
  const data = order || {
    id: "CMD-2024-001",
    product: "Application de Gestion Professionnelle",
    date: "15 Jan 2024",
    amount: "299€",
    status: "completed",
    statusText: "Livrée",
    items: 1,
    licenseKey: "ABCD-EFGH-IJKL-MNOP",
  };

  const statusVariant = {
    completed: "default",
    pending: "secondary",
    processing: "outline",
    cancelled: "destructive",
  } as const;

  return (
    <AppLayout breadcrumbs={[{ title: "Commandes", href: route('orders') }, { title: data.id, href: "" }]}>
      <Head title={`Commande ${data.id}`} />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <a href={route('orders')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Retour aux commandes
            </a>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Détails de la commande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-lg font-semibold">{data.product}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {data.date}
                    </span>
                    <span>Clé de licence: {data.licenseKey}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-xl font-bold">{data.amount}</div>
                <Badge variant={statusVariant[data.status as keyof typeof statusVariant]}> {data.statusText} </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button className="gap-2">
                <Download className="h-4 w-4" /> Télécharger
              </Button>
              <Button variant="outline" className="gap-2">
                <Receipt className="h-4 w-4" /> Facture
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
