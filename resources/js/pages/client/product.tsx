import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Shield, Download, ShoppingCart, ArrowLeft } from "lucide-react";
import { route } from "ziggy-js";

export default function Product({ product }: { product?: any }) {
  const data = product || {
    id: 1,
    name: "Application de Gestion Professionnelle",
    description: "Solution complète pour gérer votre entreprise avec efficacité.",
    price: "299€",
    version: "2.1.0",
    category: "Logiciels",
    tags: ["Populaire", "Nouveau"],
    features: ["Multi-utilisateurs", "Support 24/7", "Mises à jour"],
    security: ["Licence activable", "Validation hors-ligne"],
  };        

  return (
    <AppLayout breadcrumbs={[{ title: "Catalogue", href: route('catalogs') }, { title: data.name, href: "" }]}>
      <Head title={data.name} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild>
            <a href={route('catalogs')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Retour
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl">{data.name}</CardTitle>
              <CardDescription>{data.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <Package className="h-12 w-12 text-primary" />
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Badge variant="outline">Version {data.version}</Badge>
                <Badge variant="outline">{data.category}</Badge>
                {data.tags?.map((t: string, i: number) => (
                  <Badge key={i} variant="secondary">{t}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Licence & Sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.security?.map((s: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                    <Shield className="h-4 w-4 text-primary" /> {s}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fonctionnalités</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {data.features?.map((f: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div className="text-2xl font-bold">{data.price}</div>
                <div className="flex items-center gap-2">
                  <Button variant="default" className="gap-2">
                    <ShoppingCart className="h-4 w-4" /> Acheter
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" /> Démo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
