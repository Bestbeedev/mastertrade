import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Moon, Sun, Monitor } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppearance, type Appearance } from "@/hooks/use-appearance"

export function SiteHeader() {
    const { appearance, updateAppearance } = useAppearance()

    const getThemeIcon = () => {
        switch (appearance) {
            case "dark":
                return <Moon className="h-4 w-4" />
            case "light":
                return <Sun className="h-4 w-4" />
            default:
                return <Monitor className="h-4 w-4" />
        }
    }

    const getThemeLabel = () => {
        switch (appearance) {
            case "dark":
                return "Sombre"
            case "light":
                return "Clair"
            default:
                return "Système"
        }
    }

    const handleThemeChange = (newAppearance: Appearance) => {
        updateAppearance(newAppearance)
    }

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">Dashboard</h1>
                <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                {getThemeIcon()}
                                <span className="hidden sm:inline">{getThemeLabel()}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => handleThemeChange("light")}
                                className="flex items-center gap-2"
                            >
                                <Sun className="h-4 w-4" />
                                <span>Clair</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleThemeChange("dark")}
                                className="flex items-center gap-2"
                            >
                                <Moon className="h-4 w-4" />
                                <span>Sombre</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleThemeChange("system")}
                                className="flex items-center gap-2"
                            >
                                <Monitor className="h-4 w-4" />
                                <span>Système</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
