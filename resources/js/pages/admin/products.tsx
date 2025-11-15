import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminProducts() {
  return (
    <AppLayout breadcrumbs={[{ title: "Admin", href: "/admin" }, { title: "Produits", href: "/admin/products" }]}>
      <Head title="Admin • Produits" />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nouveau Produit</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom</label>
              <Input placeholder="Nom du produit" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SKU</label>
              <Input placeholder="SKU" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Version</label>
              <Input placeholder="Version (ex: 2.1.0)" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Prix</label>
              <Input placeholder="Prix" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <textarea placeholder="Décrivez le produit" rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="sm:col-span-2">
              <Button>Enregistrer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
