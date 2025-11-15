import AppLayout from "@/layouts/app-layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, CheckCircle2, Copy, ArrowLeft, Download } from "lucide-react";
import { useState } from "react";
import { route } from "ziggy-js";

export default function LicenseActivate({ product, license, completed, device_id, machine }: { product: { id: number; name: string }; license: { id: number; key: string; status: string; expires_at: string }; completed?: boolean; device_id?: string; machine?: string }) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Licenses", href: route("licenses") },
    { title: "Activation", href: route("licenses.activation.start") },
  ];

  const [copied, setCopied] = useState(false);
  const copyKey = async () => {
    try { await navigator.clipboard.writeText(license?.key || ""); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Licence activée" />

      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Link href={route("licenses")} className="inline-flex items-center text-sm hover:underline"><ArrowLeft className="h-4 w-4 mr-1" /> Retour</Link>
          </div>
          <div className="mt-3">
            <h1 className="text-3xl font-bold tracking-tight">{completed ? "Licence activée" : "Votre licence"}</h1>
            <p className="text-muted-foreground mt-2">Produit: <Badge variant="outline">{product?.name}</Badge></p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5" /> Détails de la licence</CardTitle>
              <CardDescription>Utilisez cette clé pour activer votre logiciel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <code className="bg-muted px-3 py-2 rounded font-mono text-sm border flex-1">{license?.key}</code>
                <Button variant="outline" onClick={copyKey} className="flex items-center gap-2"><Copy className="h-4 w-4" />{copied ? "Copié!" : "Copier"}</Button>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>Statut: <Badge>{license?.status}</Badge></span>
                <span>Expire le: <Badge variant="secondary">{license?.expires_at}</Badge></span>
                {device_id ? <span>Appareil: <Badge variant="outline">{device_id}</Badge></span> : null}
                {machine ? <span>Machine: <Badge variant="outline">{machine}</Badge></span> : null}
              </div>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">Retournez sur le logiciel WinDev et collez cette clé lorsque demandé.</p>
              </div>
            </CardContent>
          </Card>

          {completed ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <p>Activation terminée avec succès.</p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="flex items-center justify-between">
            <Link href={route("dashboard")}>Retour au dashboard</Link>
            <Button asChild><Link href={route("licenses.certificate", { license: license?.id })} className="flex items-center gap-2"><Download className="h-4 w-4" /> Certificat</Link></Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
