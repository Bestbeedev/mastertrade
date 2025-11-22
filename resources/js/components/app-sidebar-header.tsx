import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Monitor ,RefreshCw} from 'lucide-react';
import { useAppearance, type Appearance } from '@/hooks/use-appearance';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { appearance, updateAppearance } = useAppearance();

    const getThemeIcon = () => {
        switch (appearance) {
            case "dark":
                return <Moon className="h-4 w-4" />;
            case "light":
                return <Sun className="h-4 w-4" />;
            default:
                return <Monitor className="h-4 w-4" />;
        }
    };

    const getThemeLabel = () => {
        switch (appearance) {
            case "dark":
                return "Sombre";
            case "light":
                return "Clair";
            default:
                return "Système";
        }
    };

    const handleThemeChange = (newAppearance: Appearance) => {
        updateAppearance(newAppearance);
    };

    return (
        <header className="flex h-16 shrink-0 items-center  gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2 flex-1">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <Button size="sm" onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white">
                <RefreshCw />
            </Button>
            {/* Sélecteur de thème */}
            <div className="flex items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 h-9 w-9 p-0 md:w-auto md:px-2"
                        >
                            {getThemeIcon()}
                            <span className="hidden md:inline text-sm">
                                {getThemeLabel()}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <div className="flex items-center justify-between px-2 py-1.5 text-sm font-semibold">
                            Thème
                            <span className="text-xs font-normal text-muted-foreground">
                                {getThemeLabel()}
                            </span>
                        </div>
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
        </header>
    );
}
