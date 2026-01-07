import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/password';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconLock, IconCheck, IconShield, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sécurité du compte',
        href: edit().url,
    },
];

// Composant pour l'indicateur de force du mot de passe
function PasswordStrengthIndicator({ password }: { password: string }) {
    if (!password) return null;

    const getStrength = (pwd: string) => {
        let score = 0;
        if (pwd.length >= 8) score++;
        if (pwd.match(/[a-z]/) && pwd.match(/[A-Z]/)) score++;
        if (pwd.match(/\d/)) score++;
        if (pwd.match(/[^a-zA-Z\d]/)) score++;
        return score;
    };

    const strength = getStrength(password);
    const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
    const strengthColors = [
        'bg-red-500',
        'bg-orange-500',
        'bg-yellow-500',
        'bg-blue-500',
        'bg-green-500'
    ];

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Force du mot de passe</span>
                <span className={`font-medium ${
                    strength >= 4 ? 'text-green-600' :
                    strength >= 3 ? 'text-blue-600' :
                    strength >= 2 ? 'text-yellow-600' :
                    strength >= 1 ? 'text-orange-600' : 'text-red-600'
                }`}>
                    {strengthLabels[strength]}
                </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                        strengthColors[strength] || 'bg-red-500'
                    }`}
                    style={{ width: `${(strength / 4) * 100}%` }}
                ></div>
            </div>
        </div>
    );
}

// Composant pour le champ de mot de passe avec toggle de visibilité
function PasswordInput({
    id,
    label,
    ref,
    error,
    value,
    onChange,
    placeholder,
    autoComplete
}: {
    id: string;
    label: string;
    ref: React.RefObject<HTMLInputElement | null>;
    error?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    autoComplete: string;
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-medium">
                {label}
            </Label>
            <div className="relative">
                <Input
                    id={id}
                    ref={ref}
                    name={id}
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="pr-10"
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    {showPassword ? (
                        <IconEyeOff className="h-4 w-4" />
                    ) : (
                        <IconEye className="h-4 w-4" />
                    )}
                </button>
            </div>
            <InputError message={error} />
        </div>
    );
}

// Composant principal du formulaire de mot de passe
function PasswordForm({
    processing,
    recentlySuccessful,
    errors,
    formData,
    onFormDataChange
}: {
    processing: boolean;
    recentlySuccessful: boolean;
    errors: Record<string, string>;
    formData: Record<string, string>;
    onFormDataChange: (field: string, value: string) => void;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const passwordConfirmationInput = useRef<HTMLInputElement>(null);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <IconShield className="h-5 w-5 text-blue-600" />
                    <CardTitle>Sécurité du mot de passe</CardTitle>
                </div>
                <CardDescription>
                    Utilisez un mot de passe long et complexe pour protéger votre compte
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Form
                    {...PasswordController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    resetOnError={[
                        'password',
                        'password_confirmation',
                        'current_password',
                    ]}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) {
                            passwordInput.current?.focus();
                        }
                        if (errors.current_password) {
                            currentPasswordInput.current?.focus();
                        }
                    }}
                >
                    <div className="space-y-6">
                        {/* Mot de passe actuel */}
                        <PasswordInput
                            id="current_password"
                            label="Mot de passe actuel"
                            ref={currentPasswordInput}
                            error={errors.current_password}
                            value={formData.current_password}
                            onChange={(value) => onFormDataChange('current_password', value)}
                            placeholder="Entrez votre mot de passe actuel"
                            autoComplete="current-password"
                        />

                        {/* Nouveau mot de passe */}
                        <div className="space-y-4">
                            <PasswordInput
                                id="password"
                                label="Nouveau mot de passe"
                                ref={passwordInput}
                                error={errors.password}
                                value={formData.password}
                                onChange={(value) => onFormDataChange('password', value)}
                                placeholder="Choisissez un nouveau mot de passe"
                                autoComplete="new-password"
                            />

                            <PasswordStrengthIndicator password={formData.password} />
                        </div>

                        {/* Confirmation du mot de passe */}
                        <PasswordInput
                            id="password_confirmation"
                            label="Confirmer le mot de passe"
                            ref={passwordConfirmationInput}
                            error={errors.password_confirmation}
                            value={formData.password_confirmation}
                            onChange={(value) => onFormDataChange('password_confirmation', value)}
                            placeholder="Confirmez votre nouveau mot de passe"
                            autoComplete="new-password"
                        />

                        {/* Actions du formulaire */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="min-w-[140px]"
                                >
                                    <IconLock className="h-4 w-4 mr-2" />
                                    {processing ? 'Mise à jour...' : 'Mettre à jour'}
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
                                        Mot de passe mis à jour
                                    </div>
                                </Transition>
                            </div>
                        </div>
                    </div>
                </Form>
            </CardContent>
        </Card>
    );
}

export default function Password() {
    const [formData, setFormData] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    const handleFormDataChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sécurité du mot de passe" />

            <SettingsLayout>
                <div className="space-y-8">
                    {/* En-tête de la page */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Sécurité du compte
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gérez votre mot de passe et les paramètres de sécurité
                        </p>
                    </div>

                    {/* Conseils de sécurité */}
                    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <IconShield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                                        Conseils pour un mot de passe sécurisé
                                    </h3>
                                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                        <li>• Utilisez au moins 12 caractères</li>
                                        <li>• Combinez lettres, chiffres et symboles</li>
                                        <li>• Évitez les mots du dictionnaire</li>
                                        <li>• Ne réutilisez pas d'anciens mots de passe</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Formulaire de mot de passe */}
                    <Form
                        {...PasswordController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                    >
                        {({ errors, processing, recentlySuccessful }) => (
                            <PasswordForm
                                processing={processing}
                                recentlySuccessful={recentlySuccessful}
                                errors={errors}
                                formData={formData}
                                onFormDataChange={handleFormDataChange}
                            />
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
