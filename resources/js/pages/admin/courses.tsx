import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCourses() {
  return (
    <AppLayout breadcrumbs={[{ title: "Admin", href: "/admin" }, { title: "Formations", href: "/admin/courses" }]}>
      <Head title="Admin • Formations" />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle Formation</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Titre</label>
              <Input placeholder="Titre de la formation" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <textarea placeholder="Décrivez la formation" rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
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
