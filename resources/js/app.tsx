import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import SplashScreen from './components/splash-screen';
import { useSplashScreen } from './hooks/use-splash';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

interface InertiaRootProps {
    App: React.ComponentType<any>;
    props: any;
}

function InertiaRoot({ App, props }: InertiaRootProps) {
    const { visible } = useSplashScreen();
    return (
        <>
            <App {...props} />
            <Toaster richColors theme='light' position="top-right" />
            <SplashScreen visible={visible} />
        </>
    );
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider attribute="class" defaultTheme="system" storageKey="appearance" disableTransitionOnChange>
                <InertiaRoot App={App} props={props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
