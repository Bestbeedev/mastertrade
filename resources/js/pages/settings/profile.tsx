import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconMail, IconUser, IconCheck, IconShield } from '@tabler/icons-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Paramètres du profil',
        href: edit().url,
    },
];

// Composant pour l'état de vérification d'email
function EmailVerificationStatus({
    mustVerifyEmail,
    emailVerified,
    status
}: {
    mustVerifyEmail: boolean;
    emailVerified: boolean | null;
    status?: string;
}) {
    if (!mustVerifyEmail || emailVerified) return null;

    return (
        <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <IconShield className="h-5 w-5 text-orange-500" />
                    <CardTitle className="text-lg">Vérification d'email requise</CardTitle>
                </div>
                <CardDescription>
                    Votre adresse email n'est pas vérifiée. Veuillez vérifier votre email pour accéder à toutes les fonctionnalités.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Link
                    href={send()}
                    as="button"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                    <IconMail className="h-4 w-4" />
                    Renvoyer l'email de vérification
                </Link>

                <Transition
                    show={status === 'verification-link-sent'}
                    enter="transition-all duration-300 ease-out"
                    enterFrom="opacity-0 transform -translate-y-2"
                    enterTo="opacity-100 transform translate-y-0"
                    leave="transition-all duration-300 ease-in"
                    leaveFrom="opacity-100 transform translate-y-0"
                    leaveTo="opacity-0 transform -translate-y-2"
                >
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                        <IconCheck className="h-4 w-4" />
                        Un nouveau lien de vérification a été envoyé à votre adresse email.
                    </div>
                </Transition>
            </CardContent>
        </Card>
    );
}

// Composant pour le formulaire de profil
function ProfileForm({
    user,
    processing,
    recentlySuccessful,
    errors
}: {
    user: any;
    processing: boolean;
    recentlySuccessful: boolean;
    errors: any;
}) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <IconUser className="h-5 w-5 text-blue-600" />
                    <CardTitle>Informations personnelles</CardTitle>
                </div>
                <CardDescription>
                    Mettez à jour votre nom et votre adresse email
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Champ Nom */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Nom complet
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            defaultValue={user.name}
                            required
                            autoComplete="name"
                            placeholder="Votre nom complet"
                            className="w-full"
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Champ Email */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Adresse email
                            </Label>
                            {user.email_verified_at && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                    <IconCheck className="h-3 w-3 mr-1" />
                                    Vérifié
                                </Badge>
                            )}
                        </div>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={user.email}
                            required
                            autoComplete="username"
                            placeholder="votre@email.com"
                            className="w-full"
                        />
                        <InputError message={errors.email} />
                    </div>
                </div>

                {/* Actions du formulaire */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="min-w-[120px]"
                        >
                            {processing ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition-all duration-300 ease-out"
                            enterFrom="opacity-0 transform -translate-x-2"
                            enterTo="opacity-100 transform translate-x-0"
                            leave="transition-all duration-300 ease-in"
                            leaveFrom="opacity-100 transform translate-x-0"
                            leaveTo="opacity-0 transform -translate-x-2"
                        >
                            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                <IconCheck className="h-4 w-4" />
                                Modifications enregistrées
                            </div>
                        </Transition>
                    </div>

                    <Link
                        href="/profile"
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                        Annuler
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Paramètres du profil" />

            <SettingsLayout>
                <div className="space-y-8">
                    {/* En-tête de la page */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Paramètres du profil
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gérez vos informations personnelles et vos préférences de compte
                        </p>
                    </div>

                    {/* Formulaire de profil */}
                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <ProfileForm
                                user={auth.user}
                                processing={processing}
                                recentlySuccessful={recentlySuccessful}
                                errors={errors}
                            />
                        )}
                    </Form>

                    {/* Statut de vérification d'email */}
                    <EmailVerificationStatus
                        mustVerifyEmail={mustVerifyEmail}
                        emailVerified={auth.user.email_verified_at}
                        status={status}
                    />

                    {/* Section suppression de compte */}
                    <div className="space-y-4">
                        <HeadingSmall
                            title="Zone dangereuse"
                            description="Actions irréversibles concernant votre compte"
                        />
                        <DeleteUser />
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
