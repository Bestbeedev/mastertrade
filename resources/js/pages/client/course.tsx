import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { Play, BookOpen, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { route } from "ziggy-js";

export default function Course({ course }: { course?: any }) {
  const data = course || {
    id: 1,
    title: "Titre du cours",
    description: "Description de la formation.",
    duration: "2h 10min",
    lessons: [
      { id: 1, title: "Introduction", duration: "06:12" },
      { id: 2, title: "Module 1", duration: "18:40" },
      { id: 3, title: "Module 2", duration: "24:03" },
    ],
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Formations", href: route('courses') }, { title: data.title, href: "" }]}>
      <Head title={data.title} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild>
            <a href={route('courses')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Retour
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl">{data.title}</CardTitle>
              <CardDescription>{data.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                <Play className="h-10 w-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contenu du cours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.lessons.map((l: any, i: number) => (
                  <div key={l.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/40">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{i + 1}. {l.title}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {l.duration}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary">Lire</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
