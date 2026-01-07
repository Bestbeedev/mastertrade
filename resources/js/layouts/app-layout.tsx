import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';


interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string; warning?: string; info?: string } };
    const lastShown = useRef<string>('');

    useEffect(() => {
        const key = JSON.stringify(flash || {});
        if (!flash || lastShown.current === key) return;
        lastShown.current = key;

        if (flash.success) toast.success(String(flash.success));
        if (flash.error) toast.error(String(flash.error));
        if (flash.warning) toast.warning(String(flash.warning));
        if (flash.info) toast.message(String(flash.info));
    }, [flash]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    );
};
