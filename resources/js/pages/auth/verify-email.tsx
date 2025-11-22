// Components
import EmailVerificationNotificationController from '@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';
import { logout } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { route } from 'ziggy-js';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Vérifiez votre adresse email"
            description="Veuillez vérifier votre adresse email en cliquant sur le lien que nous venons de vous envoyer."
        >
            <Head title="Vérification de l'email" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Un nouveau lien de vérification a été envoyé à l'adresse email
                    que vous avez fournie lors de votre inscription.
                </div>
            )}

            <Form
                {...EmailVerificationNotificationController.store.form()}
                className="space-y-6 text-center"
            >
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            )}
                            Renvoyer l'email de vérification
                        </Button>

                        <TextLink
                            href={route('logout')}
                            className="mx-auto block text-sm"
                        >
                            Se déconnecter
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
