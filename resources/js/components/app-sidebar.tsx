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

import { NavDocuments } from "@/components/nav-documents"
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
import { LayoutDashboard } from "lucide-react";

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
            title: "Formations",
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
            badge: "3",
        },
        {
            title: "Support / Tickets",
            url: "supportsTickets",
            icon: IconHeadset,
        },
        {
            title: "Paramètres",
            url: "/settings",
            icon: IconSettings,
        },
        {
            title: "Aide & Documentation",
            url: "/helps",
            icon: IconHelp,
        },
    ],
    quickAccess: [
        {
            name: "MasterAdogbe v2.1",
            url: "/downloads/masteradogbe",
            icon: IconDownload,
            version: "Dernière version",
        },
    ],
}

// Composant pour l'accès rapide avec tooltip en mode collapsed
type QuickAccessItem = {
    name: string
    url: string
    icon: React.ComponentType<IconProps>
    version: string
}

function NavQuickAccess({ items }: { items: QuickAccessItem[] }) {
    const { state } = useSidebar();

    if (state === "collapsed") {
        return (
            <div className="mt-6 border-t border-b pt-6 pb-6">
                <div className="space-y-2">
                    {items.map((item, index) => (
                        <Tooltip key={index} delayDuration={0}>
                            <TooltipTrigger asChild>
                                <a
                                    href={item.url}
                                    className="flex items-center justify-center px-3 py-2 text-sm dark:text-white text-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-400/20 transition-colors"
                                >
                                    <item.icon className="h-4 w-4 text-blue-600" />
                                </a>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="flex flex-col items-start">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-muted-foreground">{item.version}</div>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mt-6 border-t border-b pt-6 pb-6">
            <h3 className="px-4 text-sm font-semibold dark:text-gray-50 text-gray-900 mb-3">
                Accès rapide
            </h3>
            <div className="space-y-2">
                {items.map((item, index) => (
                    <a
                        key={index}
                        href={item.url}
                        className="flex items-center gap-3 px-4 py-2 text-sm dark:text-white text-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-400/20 transition-colors"
                    >
                        <item.icon className="h-4 w-4 text-blue-600" />
                        <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{item.name}</div>
                            <div className="text-xs text-gray-500 truncate">{item.version}</div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}

// Composant pour le header du sidebar avec comportement responsive
function SidebarHeaderContent() {
    const { state } = useSidebar();

    if (state === "collapsed") {
        return (
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <a
                        href="/dashboard"
                        className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 rounded-lg transition-colors"
                    >
                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                            <IconUser className="!size-3 text-gray-900" />
                        </div>
                    </a>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <div className="text-sm font-medium">MasterTrade</div>
                    <div className="text-xs text-muted-foreground">Espace Client</div>
                </TooltipContent>
            </Tooltip>
        );
    }

    return (
        <a
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 rounded-lg transition-colors"
        >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <IconUser className="!size-4 text-gray-900" />
            </div>
            <div className="flex flex-col items-start">
                <span className="text-base font-bold text-gray-100">MasterTrade</span>
                <span className="text-xs text-gray-200">Espace Client</span>
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
                        {/* Accès rapide */}
                        <NavQuickAccess items={data.quickAccess} />
                    {/* Navigation secondaire */}
                    <NavSecondary items={data.navSecondary} className="mt-auto" />
                    </div>

                </SidebarContent>

                <SidebarFooter>
                    <NavUser user={authUser} />
                </SidebarFooter>
            </Sidebar>
        </TooltipProvider>
    );
}
