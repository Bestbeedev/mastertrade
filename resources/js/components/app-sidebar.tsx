import * as React from "react"
import {

    IconPackage,
    IconLicense,
    IconShoppingCart,
    IconDownload,
    IconSchool,
    IconBell,
    IconHeadset,
    IconSettings,
    IconHelp,
    IconUser,
    IconProps,
} from "@tabler/icons-react"
import { User } from "@/types/model";

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { usePage } from "@inertiajs/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutDashboard, SquareChevronUpIcon } from "lucide-react";
import { Separator } from "./ui/separator";

const data = {
    user: {
        name: "John Doe",
        email: "john.doe@entreprise.com",
        avatar: "/avatars/user.jpg",
    },
    navMain: [
        {
            title: "Tableau de bord",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
        },
        {
            title: "Catalogue des produits",
            url: "/catalogs",
            icon: IconPackage,
        },
        {
            title: "Mes licences",
            url: "/licenses",
            icon: IconLicense,
        },
        {
            title: "Mes commandes",
            url: "/orders",
            icon: IconShoppingCart,
        },
        {
            title: "Téléchargements",
            url: "/downloads",
            icon: IconDownload,
        },
        {
            title: "Mes Formations",
            url: "/courses",
            icon: IconSchool,
            badge: "Nouveau",
        },
    ],
    navSecondary: [
        {
            title: "Notifications",
            url: "/notifications",
            icon: IconBell,
        },
        {
            title: "Support | Tickets",
            url: "/supportsTickets",
            icon: IconHeadset,
        },
        {
            title: "Paramètres",
            url: "/settings",
            icon: IconSettings,
        },
        {
            title: "Centre d'aide",
            url: "/helps",
            icon: IconHelp,
        },
    ],
}



// Composant pour le header du sidebar avec comportement responsive
function SidebarHeaderContent() {
    const { state } = useSidebar();
    const isAdmin = !!(usePage().props as any)?.auth?.isAdmin;

    if (state === "collapsed") {
        return (
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <a
                        href="/dashboard"
                        className="flex items-center justify-center w-10 h-10 mx-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-colors"
                    >
                        <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                            <IconUser className="!size-4 text-gray-900" />
                        </div>
                    </a>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <div className="text-sm font-bold">MASTERTRADE</div>
                    <div className="text-xs text-muted-foreground">Espace {isAdmin ? 'Admin' : 'Client'}</div>
                </TooltipContent>
            </Tooltip>
        );
    }

    return (
        <a
            href="/"
            className="flex items-center gap-3 px-3 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-colors"
        >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <IconUser className="!size-4 text-gray-900" />
            </div>
            <div className="flex flex-col items-start">
                <span className="text-base font-bold text-gray-100">MASTERTRADE</span>
                <span className="text-xs text-gray-200">Espace {isAdmin ? 'Admin' : 'Client'}</span>
            </div>
        </a>
    );
}

export function AppSidebar({ user, ...props }: { user: User; } & React.ComponentProps<typeof Sidebar>) {
    const authUser = {
        name: user.name,
        email: user.email,
        avatar: "/avatars/user.jpg",
    };
    const isAdmin = !!(usePage().props as any)?.auth?.isAdmin;

    // état du nombre de notifications non lues
    const [unread, setUnread] = React.useState<number>(0);

    React.useEffect(() => {
        let mounted = true;
        fetch("/api/notifications/unread-count")
            .then((r) => r.json())
            .then((d) => {
                if (mounted) setUnread(Number(d?.unread || 0));
            })
            .catch(() => { });
        return () => {
            mounted = false;
        };
    }, []);

    // items secondaires avec badge dynamique
    const secondaryItems = React.useMemo(() => {
        return data.navSecondary.map((it) => {
            if (it.url === "/notifications") {
                const badge = unread > 0 ? String(unread) : undefined;
                return { ...it, badge };
            }
            return it;
        });
    }, [unread]);

    const adminItems = [
        {
            title: "Admin Panels",
            url: "/admin",
            icon: IconSettings,
        },
        {
            title: "Gérer les formations",
            url: "/admin/courses",
            icon: IconSchool,
        },
        {
            title: "Gérer les produits",
            url: "/admin/products",
            icon: IconPackage,
        },
        {
            title: "Gérer les licences",
            url: "/admin/licenses",
            icon: IconLicense,
        },
        {
            title: "Documentation",
            url: "/admin/help-articles",
            icon: IconHelp,
        },
    ];

    return (
        <TooltipProvider>
            <Sidebar collapsible="icon" {...props}>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-0 bg-transparent hover:bg-transparent">
                                <SidebarHeaderContent />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    {/* Navigation principale */}
                    <div className="flex-1 ">
                        <NavMain items={data.navMain} />
                        {isAdmin && <NavMain items={adminItems} />}
                    </div>
                    {/* Navigation secondaire */}
                    <NavSecondary items={secondaryItems} className="mt-auto" />
                </SidebarContent>

                <SidebarFooter>
                    <NavUser user={authUser} />
                </SidebarFooter>
            </Sidebar>
        </TooltipProvider>
    );
}
