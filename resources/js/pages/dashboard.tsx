import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Link } from "@inertiajs/react"
import { route } from "ziggy-js"
import {
    IconBell,
    IconDownload,
    IconFileDescription,
    IconHeadset,
    IconHelp,
    IconLicense,
    IconPhone,
    IconSchool,
    IconTrendingUp,
    IconBuilding,
    IconUsers,
    IconClock,
    IconChevronRight,
} from "@tabler/icons-react"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { User } from "@/types/model"
import { usePage } from "@inertiajs/react"

import { useAuthStore } from "@/stores/auth";
import { Progress } from "@/components/ui/progress";
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useIsAdmin } from "@/hooks/use-is-admin"

export default function Page() {
    const { user_data } = usePage().props;
    const { login } = useAuthStore.getState()
    useEffect(() => {
        if (user_data) {
            login(user_data as User)
        }
    }, [user_data, login])

    const { user, isAuthenticated, logout } = useAuthStore()
    const isAdmin = useIsAdmin()

    if (!isAuthenticated) {
        return <p>Veuillez vous connecter.</p>
    }



    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar user={user!} collapsible="icon" variant="sidebar" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col bg-background">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-6 py-6 md:gap-8 md:py-8">
                            {/* En-tête du dashboard */}
                            <div className="px-6 lg:px-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-foreground">Tableau de Bord</h1>
                                        <p className="text-muted-foreground mt-2">
                                            Bienvenue dans votre espace MasterTrade
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>Accueil</span>
                                        <IconChevronRight className="h-4 w-4" />
                                        <span className="text-foreground">Dashboard</span>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <div className="mt-4 flex items-center justify-end gap-2">
                                        <Button asChild size="sm">
                                            <Link href={route('admin.courses')}>Ajouter une formation</Link>
                                        </Button>
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={route('admin.products')}>Ajouter un produit</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Statistiques principales */}
                            <SectionCards />

                            {/* Sections du dashboard */}
                            <div className="space-y-8 px-6 lg:px-8">
                                <ActiveSoftwareSection />
                                <MyCoursesSection />
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                    <RecentActivitySection />
                                    <RecommendedCoursesSection />
                                </div>
                                <QuickSupportSection />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export function MyCoursesSection() {
    const { myCourses = [] } = usePage().props as any;
    if (!Array.isArray(myCourses)) return null;
    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <IconSchool className="h-5 w-5 text-purple-600" />
                    Mes Formations
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Reprenez où vous vous êtes arrêté
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {myCourses.length === 0 && (
                        <div className="text-sm text-muted-foreground">Vous n'êtes inscrit à aucune formation pour l'instant.</div>
                    )}
                    {myCourses.map((c: any) => (
                        <Link key={c.course_id} href={route('courses.show', c.course_id)} className="border rounded-lg  shadow-lg p-3 hover:scale-100 transition-all duration-200 group">
                            {c.cover_image ? (
                                <img src={`/storage/${c.cover_image}`} alt="Cover" className="h-28 w-full object-cover rounded-md mb-2" />
                            ) : (
                                <div className="h-28 w-full rounded-md bg-muted mb-2" />
                            )}
                            <div className="text-sm font-medium line-clamp-1">{c.title}</div>
                            <div className="mt-2">
                                <div className="flex items-center pb-2 justify-between text-xs text-muted-foreground">
                                    <span>Progression</span>
                                    <span className="font-medium text-foreground">{c.progress_percent ?? 0}%</span>
                                </div>
                                <Progress value={c.progress_percent ?? 0} className="h-1.5" />
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
export function ActiveSoftwareSection() {
    const { activeSoftware: activeSoftwareProp } = usePage().props as any;
    const activeSoftware = (Array.isArray(activeSoftwareProp) ? activeSoftwareProp : []).map((s: any) => ({
        ...s,
        icon: IconTrendingUp,
        iconColor: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/20",
    }));

    return (
        <Card className="">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <IconLicense className="h-5 w-5 text-blue-600" />
                    Mes Logiciels Actifs
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Gérer et télécharger vos logiciels MasterTrade
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeSoftware.length === 0 && (
                        <div className="text-sm text-muted-foreground">Aucun logiciel actif pour le moment.</div>
                    )}
                    {activeSoftware.map((software: any) => (
                        <div key={software.id} className="bg-card shadow-lg hover:scale-105 border rounded-lg p-4 transition-all duration-200 group">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 ${software.bgColor} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                                        <software.icon className={`h-5 w-5 ${software.iconColor}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{software.name}</h3>
                                        <p className="text-xs text-muted-foreground">{software.category}</p>
                                    </div>
                                </div>
                                <Badge variant={
                                    software.status === 'active' ? 'default' :
                                        software.status === 'warning' ? 'secondary' : 'destructive'
                                } className="text-xs">
                                    {software.status === 'active' ? 'Actif' : 'Expire'}
                                </Badge>
                            </div>

                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Version:</span>
                                    <span className="font-medium text-foreground">{software.version}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Expire le:</span>
                                    <span className="font-medium text-foreground">{software.expiry}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {software.download_available && software.product_id ? (
                                    <Button size="sm" variant="default" className="flex-1 text-xs" asChild>
                                        <a href={route('downloads.start', software.product_id)}>
                                            <IconDownload className="h-3 w-3 mr-1" />
                                            Télécharger
                                        </a>
                                    </Button>
                                ) : (
                                    <Button size="sm" variant="outline" className="flex-1 text-xs" disabled>
                                        <IconDownload className="h-3 w-3 mr-1" />
                                        Indisponible
                                    </Button>
                                )}
                                <Button size="sm" variant="outline" className="px-2">
                                    <IconLicense className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export function RecentActivitySection() {
    const { recentActivity = [] } = usePage().props as any;
    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <IconClock className="h-5 w-5 text-blue-600" />
                        Activité Récente
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs">
                        Voir tout
                    </Button>
                </div>
                <CardDescription className="text-muted-foreground">
                    Historique de vos dernières actions
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {(!Array.isArray(recentActivity) || recentActivity.length === 0) ? (
                    <div className="p-6 text-sm text-muted-foreground">Aucune activité récente.</div>
                ) : (
                    <div className="divide-y divide-border">
                        {recentActivity.map((activity: any, idx: number) => (
                            <div key={idx} className="p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg">
                                <div className={`w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                    <IconDownload className={`h-4 w-4 text-blue-600 dark:text-blue-400`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground text-sm truncate">{activity.product}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {activity.type === 'download' ? 'Téléchargement effectué' : 'Commande créée'}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs font-medium text-foreground">
                                        {new Date(activity.date).toLocaleDateString('fr-FR')}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(activity.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export function RecommendedCoursesSection() {
    const { recommendedCourses = [] } = usePage().props as any;
    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <IconSchool className="h-5 w-5 text-blue-600" />
                        Formations Recommandées
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs">
                        Explorer
                    </Button>
                </div>
                <CardDescription className="text-muted-foreground">
                    Améliorez vos compétences avec nos formations
                </CardDescription>
            </CardHeader>
            <CardContent>
                {Array.isArray(recommendedCourses) && recommendedCourses.length > 0 ? (
                    <div className="space-y-4">
                        {recommendedCourses.map((course: any) => (
                            <div key={course.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                                <div className={`w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                                    <IconTrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground text-sm line-clamp-1">{course.title}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{course.description}</p>
                                </div>
                                <Button size="sm" variant="default" className="flex-shrink-0 text-xs">
                                    Démarrer
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground">Aucune recommandation pour le moment.</div>
                )}
            </CardContent>
        </Card>
    )
}

export function QuickSupportSection() {
    const supportActions = [
        {
            title: "Ouvrir un ticket",
            description: "Obtenir de l'aide technique",
            icon: IconHeadset,
            href: "/support/tickets/new",
            iconColor: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
            borderColor: "border-blue-200 dark:border-blue-800"
        },
        {
            title: "Documentation",
            description: "Guides et manuels",
            icon: IconFileDescription,
            href: "/help/documentation",
            iconColor: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-900/20",
            borderColor: "border-green-200 dark:border-green-800"
        },
        {
            title: "Contact urgent",
            description: "Support téléphonique",
            icon: IconPhone,
            href: "tel:+33123456789",
            iconColor: "text-red-600 dark:text-red-400",
            bgColor: "bg-red-100 dark:bg-red-900/20",
            borderColor: "border-red-200 dark:border-red-800"
        },
        {
            title: "FAQ",
            description: "Questions fréquentes",
            icon: IconHelp,
            href: "/help/faq",
            iconColor: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-900/20",
            borderColor: "border-purple-200 dark:border-purple-800"
        }
    ]

    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <IconHeadset className="h-5 w-5 text-blue-600" />
                    Support & Aide
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Accédez rapidement à notre support
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {supportActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            className={`bg-card border ${action.borderColor} rounded-lg p-4 hover:shadow-sm transition-all duration-200 group hover:border-blue-300 dark:hover:border-blue-600`}
                        >
                            <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                <action.icon className={`h-5 w-5 ${action.iconColor}`} />
                            </div>
                            <h3 className="font-semibold text-foreground text-sm mb-1">{action.title}</h3>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
