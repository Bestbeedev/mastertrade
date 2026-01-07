import type { ComponentType } from "react"

import { Link, usePage } from "@inertiajs/react"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: ComponentType<Record<string, unknown>>
    }[]
}) {
    const { url } = usePage() as { url: string }
    const currentPath = (typeof url === 'string' ? url : window.location.pathname) as string
    const isActive = (href: string) => {
        if (!href) return false
        const path = currentPath.split('?')[0]
        return path === href || path.startsWith(href + "/")
    }
    return (
        <SidebarGroup className="mt-4">
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={isActive(item.url)}>
                                <Link href={item.url} aria-current={isActive(item.url) ? 'page' : undefined}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
