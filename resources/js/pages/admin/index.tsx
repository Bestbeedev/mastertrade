import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, GraduationCap, Package, Users } from "lucide-react";

export default function AdminIndex() {
  return (
    <AppLayout breadcrumbs={[{ title: "Admin", href: "/admin" }]}> 
      <Head title="Admin" />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="h-4 w-4" /> Formations
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-3xl font-bold">12</div>
              <Button asChild size="sm"><Link href="/admin/courses">Gérer</Link></Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4" /> Produits
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-3xl font-bold">8</div>
              <Button asChild size="sm"><Link href="/admin/products">Gérer</Link></Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" /> Utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-3xl font-bold">132</div>
              <Button size="sm" variant="outline">Voir</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4" /> Ventes (30j)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3 420€</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
