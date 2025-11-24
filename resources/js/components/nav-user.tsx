import {
    IconCreditCard,
    IconDotsVertical,
    IconLogout,
    IconNotification,
    IconUserCircle,
} from "@tabler/icons-react"
import { usePage, router } from "@inertiajs/react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { route } from "ziggy-js"

export function NavUser({
    user,
}: {
    user: {
        name: string
        email: string
        avatar: string
    }
}) {
    const { isMobile } = useSidebar()

    const getInitials = (name: string, email: string) => {
        if (name.trim().length > 0) {
            return name
                .split(" ")
                .map(n => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
        }
        return email
            .split("@")[0]
            .slice(0, 2)
            .toUpperCase()
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground
                                       hover:bg-accent/50 dark:hover:bg-accent/30
                                       border border-border/50 dark:border-border/70
                                       bg-background/95 dark:bg-background/95
                                       backdrop-blur-sm transition-all duration-200
                                       shadow-xl hover:shadow-xl dark:bg-neutral-800/50"
                        >
                            <Avatar className="h-8 w-8 rounded-lg border-2 border-background shadow-sm">
                                <AvatarImage
                                    src={user.avatar}
                                    alt={user.name}
                                    className="object-cover"
                                />
                                <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold border border-primary/20">
                                    {getInitials(user.name, user.email)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold text-foreground">
                                    {user.name}
                                </span>
                                <span className="text-muted-foreground truncate text-xs font-normal">
                                    {user.email}
                                </span>
                            </div>
                            <IconDotsVertical className="ml-auto size-4 text-muted-foreground" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-xl border bg-background/95 backdrop-blur-sm shadow-xl"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={8}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-3 px-2 py-3 text-left">
                                <Avatar className="h-10 w-10 rounded-lg border-2 border-background shadow-xl">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                                        {getInitials(user.name, user.email)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left leading-tight">
                                    <span className="truncate font-semibold text-foreground">
                                        {user.name}
                                    </span>
                                    <span className="text-muted-foreground truncate text-sm">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border/50" />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={() => router.get(route('account.index'))}
                                className="cursor-pointer flex items-center gap-3 py-2 text-sm transition-colors hover:bg-accent/50 focus:bg-accent/50"
                            >
                                <IconUserCircle className="size-4 text-muted-foreground" />
                                <span>Mon profil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer flex items-center gap-3 py-2 text-sm transition-colors hover:bg-accent/50 focus:bg-accent/50">
                                <IconCreditCard className="size-4 text-muted-foreground" />
                                <span>Facturation</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer flex items-center gap-3 py-2 text-sm transition-colors hover:bg-accent/50 focus:bg-accent/50">
                                <IconNotification className="size-4 text-muted-foreground" />
                                <span>Notifications</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-border/50" />
                        <DropdownMenuItem
                            onClick={() => router.post(route('logout'))}
                            className="cursor-pointer flex items-center gap-3 py-2 text-sm transition-colors
                                       bg-destructive/80 hover:bg-destructive focus:bg-destructive/95
                                       text-white hover:text-white
                                       font-medium mt-1 rounded-md"
                        >
                            <IconLogout className="size-4 text-white " />
                            <span className="text-white">Se déconnecter</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
