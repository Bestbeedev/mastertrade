import { Head, Link, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import type React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { route } from "ziggy-js";
import { Download, ShieldCheck, CreditCard, BookOpen, BarChart3, Settings, Users, Star, Check, ArrowRight, Play, Zap, Lock, Globe, Cpu, Building, TrendingUp, Package, ArrowLeft, GraduationCap, ChevronLeft, ChevronRight, Bell, Menu, X, MessageCircle, AlertTriangle } from "lucide-react";
import { Button } from '@/components/ui/button'
import { toast } from "sonner";
interface software {
    name: string,
    icon: React.ReactNode,
    category: string,
    description: string,
    features: string[],
    version: string,
    size: string,
    rating: number,
    reviews: number,
    requirements: string,
    lastUpdate: string,
    changelog: string[],
}

export default function Welcome() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [visibleCards, setVisibleCards] = useState(3);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const page = usePage<any>();
    const [selectedSoftware, setSelectedSoftware] = useState<software | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const user = page.props?.auth?.user || null;

    const gradientsMap: Record<string, string> = {
        MasterAdogbe: "from-green-500 to-emerald-600",
        MasterImmo: "from-blue-500 to-cyan-600",
        MasterTrade: "from-purple-500 to-pink-600",
        MasterStock: "from-orange-500 to-red-600",
        Ecosoft: "from-indigo-500 to-blue-600",
    };
    const colorsMap: Record<string, string> = {
        MasterAdogbe: "text-green-600 bg-green-50 border-green-200",
        MasterImmo: "text-blue-600 bg-blue-50 border-blue-200",
        MasterTrade: "text-purple-600 bg-purple-50 border-purple-200",
        MasterStock: "text-orange-600 bg-orange-50 border-orange-200",
        Ecosoft: "text-indigo-600 bg-indigo-50 border-indigo-200",
    };
    const getGradient = (softwareName: string) => gradientsMap[softwareName] || "from-blue-500 to-purple-600";
    const getCategoryColor = (softwareName: string) => colorsMap[softwareName] || "text-blue-600 bg-blue-50 border-blue-200";

    const handleDetailsClick = (soft: software) => {
        setSelectedSoftware(soft);
        setIsDialogOpen(true);
    };

    const handleDownload = (soft: software) => {
        if (!user) {
            router.visit('/login');
            return;
        }
        toast.success(`Téléchargement de ${soft.name} démarré`);
        setIsDialogOpen(false);
        setTimeout(() => {
            router.get(route('dashboard'))
        }, 800);
    };
    // Logiciels data
    const softwareData: software[] = [
        {
            name: "Ecosoft",
            icon: <GraduationCap className="w-8 h-8 text-white" />,
            category: "Éducation & Scolarité",
            description: "Solution complète de gestion scolaire pour établissements d'enseignement et centres de formation",
            features: [
                "Gestion des élèves et enseignants",
                "Planning et emplois du temps",
                "Notes et bulletins scolaires",
                "Communication parents-école"
            ],
            version: "v1.8.3",
            size: "720 MB",
            rating: 4.8,
            reviews: 124,
            requirements: "Windows 10/11, 4GB RAM, 2GB espace libre",
            lastUpdate: "15 Jan 2024",
            changelog: [
                "Nouveau module de communication",
                "Amélioration des performances",
                "Correction de bugs mineurs"
            ]
        },
        {
            name: "MasterTrade",
            icon: <TrendingUp className="w-8 h-8 text-white" />,
            category: "Gestion Commerciale",
            description: "Logiciel de gestion commerciale intégrée pour optimiser vos ventes et relations clients",
            features: ["CRM avancé", "Devis et facturation", "Suivi des commandes", "Analytics commercial"],
            version: "v3.2.1",
            size: "1.1 GB",
            rating: 4.9,
            reviews: 256,
            requirements: "Windows 10/11, 8GB RAM, 5GB espace libre",
            lastUpdate: "20 Jan 2024",
            changelog: [
                "Nouveau tableau de bord analytics",
                "Intégration API améliorée",
                "Rapports personnalisables"
            ]
        },
        {
            name: "MasterStock",
            icon: <Package className="w-8 h-8 text-white" />,
            category: "Gestion de Stock",
            description: "Solution de gestion d'inventaire et d'optimisation des stocks en temps réel",
            features: ["Contrôle des inventaires", "Alertes de réapprovisionnement", "Traçabilité des produits", "Rapports stock/valeur"],
            version: "v2.0.3",
            size: "750 MB",
            rating: 4.7,
            reviews: 89,
            requirements: "Windows 10/11, 4GB RAM, 2GB espace libre",
            lastUpdate: "10 Jan 2024",
            changelog: [
                "Scanner code-barres amélioré",
                "Nouvelles alertes intelligentes",
                "Interface utilisateur optimisée"
            ]
        },
        {
            name: "MasterAdogbe",
            icon: <Users className="w-8 h-8 text-white" />,
            category: "Gestion de Tontines",
            description: "Solution complète de gestion numérique des tontines et systèmes d'épargne collective",
            features: ["Gestion des cotisations", "Calcul automatique des tours", "Alertes de rappel", "Rapports financiers détaillés"],
            version: "v1.5.2",
            size: "680 MB",
            rating: 4.6,
            reviews: 167,
            requirements: "Windows 10/11, 2GB RAM, 1GB espace libre",
            lastUpdate: "5 Jan 2024",
            changelog: [
                "Calcul des intérêts amélioré",
                "Nouveaux modèles de rapports",
                "Synchronisation cloud"
            ]
        },
        {
            name: "MasterImmo",
            icon: <Building className="w-8 h-8 text-white" />,
            category: "Immobilier & Bail",
            description: "Plateforme de gestion immobilière complète pour propriétaires et agents immobiliers",
            features: ["Gestion des baux et loyers", "Suivi des charges", "Maintenance prédictive", "État des lieux numérique"],
            version: "v2.1.0",
            size: "890 MB",
            rating: 4.8,
            reviews: 203,
            requirements: "Windows 10/11, 4GB RAM, 3GB espace libre",
            lastUpdate: "18 Jan 2024",
            changelog: [
                "Nouveau module de maintenance",
                "Gestion des documents numériques",
                "Calculs automatiques des charges"
            ]
        },
    ];

    // Calcul du nombre de cartes visibles selon l'écran
    useEffect(() => {
        const updateVisibleCards = () => {
            if (window.innerWidth < 640) {
                setVisibleCards(1);
            } else if (window.innerWidth < 1024) {
                setVisibleCards(2);
            } else {
                setVisibleCards(3);
            }
        };

        updateVisibleCards();
        window.addEventListener('resize', updateVisibleCards);
        return () => window.removeEventListener('resize', updateVisibleCards);
    }, []);

    const totalSlides = Math.ceil(softwareData.length / visibleCards);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    // Obtenir les cartes visibles pour le slide actuel
    const getVisibleSoftware = () => {
        const startIndex = currentSlide * visibleCards;
        return softwareData.slice(startIndex, startIndex + visibleCards);
    };

    const [currentTestimonialSlide, setCurrentTestimonialSlide] = useState(0);
    const [testimonialsPerSlide, setTestimonialsPerSlide] = useState(3);

    const testimonialsData = [
        {
            name: "Koffi Adjamonsi",
            role: "Président d'Association",
            company: "Tontine Prospérité",
            text: "MasterAdogbe a transformé notre gestion de tontine. Les calculs automatiques et les rappels nous font gagner un temps précieux chaque mois.",
            avatar: "KA",
            software: "MasterAdogbe"
        },
        {
            name: "Chantal Mensah",
            role: "Gérante Immobilière",
            company: "Mensah Properties",
            text: "Avec MasterImmo, je gère 25 propriétés sans stress. Le suivi des loyers et la maintenance sont maintenant automatisés à 100%.",
            avatar: "CM",
            software: "MasterImmo"
        },
        {
            name: "Jean-Luc Béké",
            role: "Directeur Commercial",
            company: "DistriPlus",
            text: "MasterTrade a boosté nos ventes de 35%. La gestion des clients et le suivi des commandes sont d'une simplicité remarquable.",
            avatar: "JB",
            software: "MasterTrade"
        },
        {
            name: "Amina Cissé",
            role: "Responsable Logistique",
            company: "StockPro",
            text: "MasterStock a éliminé nos ruptures de stock. Les alertes intelligentes et le contrôle d'inventaire sont révolutionnaires.",
            avatar: "AC",
            software: "MasterStock"
        },
        {
            name: "Marc Yao",
            role: "Trésorier",
            company: "Solidarité Plus",
            text: "La gestion de nos 150 membres avec MasterAdogbe est devenue un jeu d'enfant. Les rapports financiers sont d'une précision impeccable.",
            avatar: "MY",
            software: "MasterAdogbe"
        },
        {
            name: "Sarah Diop",
            role: "Agent Immobilier",
            company: "Elite Immo",
            text: "MasterImmo m'a permis de doubler mon portefeuille de biens. L'état des lieux numérique est particulièrement apprécié par mes clients.",
            avatar: "SD",
            software: "MasterImmo"
        }
    ];

    // Calcul du nombre de témoignages par slide selon l'écran
    useEffect(() => {
        const updateTestimonialsPerSlide = () => {
            if (window.innerWidth < 768) {
                setTestimonialsPerSlide(1);
            } else if (window.innerWidth < 1024) {
                setTestimonialsPerSlide(2);
            } else {
                setTestimonialsPerSlide(3);
            }
        };

        updateTestimonialsPerSlide();
        window.addEventListener('resize', updateTestimonialsPerSlide);
        return () => window.removeEventListener('resize', updateTestimonialsPerSlide);
    }, []);

    const totalTestimonialSlides = Math.ceil(testimonialsData.length / testimonialsPerSlide);

    const nextTestimonialSlide = () => {
        setCurrentTestimonialSlide((prev) => (prev + 1) % totalTestimonialSlides);
    };

    const prevTestimonialSlide = () => {
        setCurrentTestimonialSlide((prev) => (prev - 1 + totalTestimonialSlides) % totalTestimonialSlides);
    };

    const goToTestimonialSlide = (index: number) => {
        setCurrentTestimonialSlide(index);
    };

    // Obtenir les témoignages visibles pour le slide actuel
    const getVisibleTestimonials = () => {
        const startIndex = currentTestimonialSlide * testimonialsPerSlide;
        return testimonialsData.slice(startIndex, startIndex + testimonialsPerSlide);
    };

    return (
        <>
            <Head title="MasterTrade - Vos Logiciels Professionnels en Centralisé" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
                {/* Header Premium Responsive */}
                <header className="w-full py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <Cpu className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            MasterTrade
                        </h1>
                    </div>

                    {/* Navigation Desktop */}
                    <nav className="hidden lg:flex gap-6 xl:gap-8 text-gray-700 font-medium">
                        <a href="#logiciels" className="hover:text-blue-600 transition-colors py-2">Nos Logiciels</a>
                        <a href="#features" className="hover:text-blue-600 transition-colors py-2">Fonctionnalités</a>
                        <a href="#pricing" className="hover:text-blue-600 transition-colors py-2">Abonnements</a>
                        <a href="#testimonials" className="hover:text-blue-600 transition-colors py-2">Témoignages</a>
                    </nav>

                    {/* Boutons Desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm sm:text-base"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-blue-400 hover:text-blue-600 font-medium transition-colors hover:shadow-lg hover:scale-105 text-sm mr-2 border border-gray-300 rounded-xl px-4 py-2"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm sm:text-base"
                                >
                                    Essai Gratuit
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Menu Mobile */}
                    <div className="flex items-center gap-2 md:hidden">
                        {/* Bouton Connexion visible sur mobile */}
                        {
                            user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm sm:text-base"
                                >
                                    Dashboard
                                </Link>
                            ) : (

                                <Link
                                    href="/login"
                                    className="text-blue-400 hover:text-blue-600 font-medium transition-colors hover:shadow-lg hover:scale-105 text-sm mr-2 border border-gray-300 rounded-xl px-4 py-2"
                                >
                                    Connexion
                                </Link>
                            )
                        }

                        {/* Bouton menu hamburger */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>

                    {/* Menu Mobile Overlay */}
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 top-16 lg:hidden border border-t border-gray-200 bg-white backdrop-blur-lg text-gray-700 h-fit z-40 shadow-xl"
                        >
                            <div className="flex flex-col h-full">
                                {/* Navigation Mobile */}
                                <nav className="flex-1 p-6 space-y-6">
                                    {[
                                        { href: "#logiciels", label: "Nos Logiciels" },
                                        { href: "#features", label: "Fonctionnalités" },
                                        { href: "#pricing", label: "Abonnements" },
                                        { href: "#testimonials", label: "Témoignages" },
                                    ].map((item, index) => (
                                        <motion.a
                                            key={item.href}
                                            href={item.href}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="block text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors py-3 border-b border-gray-100 "
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {item.label}
                                        </motion.a>
                                    ))}
                                </nav>

                                {/* Boutons Mobile */}
                                <div className="p-6 border-t border-gray-200 space-y-4">
                                    {
                                        user ? (
                                            <Link
                                                href={route('dashboard')}
                                                className="block w-full text-center py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Dashboard
                                            </Link>
                                        ) : (
                                            <>
                                                <Link
                                                    href="/login"
                                                    className="block w-full text-center py-3 text-gray-700 font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    Connexion
                                                </Link>
                                                <Link
                                                    href="/register"
                                                    className="block w-full text-center py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    Essai Gratuit
                                                </Link>
                                            </>
                                        )
                                    }

                                </div>

                                {/* Informations de contact mobile */}
                                <div className="p-6 border-t border-gray-200">
                                    <div className="text-center text-gray-500 text-sm">
                                        <p>Support: support@mastertrade.com</p>
                                        <p className="mt-1">📞 +33 1 23 45 67 89</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </header>

                {/* Hero Section Redesign */}
                <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 max-w-6xl"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-100 mb-8">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-semibold text-gray-700">
                                Concepteur de Logiciels depuis 2018
                            </span>
                        </div>

                        <motion.h2
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight"
                        >
                            Vos logiciels
                            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                MasterTrade
                            </span>
                            centralisés
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-8 max-w-3xl text-xl text-gray-600 leading-relaxed mx-auto"
                        >
                            Téléchargez, gérez et maîtrisez tous vos logiciels MasterTrade depuis une plateforme unique.
                            Licences, mises à jour et support en temps réel.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <Link
                                href="/register"
                                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                            >
                                Essai gratuit 30 jours
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <a
                                href="#logiciels"
                                className="group px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border border-gray-200 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                            >
                                <Play className="w-5 h-5 text-blue-600" />
                                Découvrir nos logiciels
                            </a>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
                        >
                            {[
                                { number: "10K+", label: "Utilisateurs actifs" },
                                { number: "15+", label: "Logiciels" },
                                { number: "99.9%", label: "Disponibilité" },
                                { number: "4.9/5", label: "Satisfaction" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center  bg-gray-200/20 backdrop-blur-xs rounded-2xl p-4 border border-black/5 hover:border-black/20 transition-all duration-300">
                                    <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</div>
                                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </section>

                {/* Section Nos Logiciels MasterTrade - Carousel Fonctionnel */}
                <section id="logiciels" className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h3 className="text-5xl font-bold text-gray-900 mb-4">
                                La Suite MasterTrade
                            </h3>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Découvrez notre gamme complète de logiciels professionnels,
                                conçus pour exceller dans chaque domaine d'activité.
                            </p>
                        </motion.div>

                        {/* Carousel Container */}
                        <div className="relative">
                            {/* Flèche gauche */}
                            <button
                                onClick={prevSlide}
                                className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-xl hover:shadow-2xl transition-all z-10 hover:scale-110 border border-gray-200"
                                aria-label="Logiciel précédent"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-700" />
                            </button>

                            {/* Cartes */}
                            <div className="overflow-hidden px-2">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentSlide}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className={`grid pb-18 pt-5 gap-8 mx-auto ${visibleCards === 1
                                            ? 'grid-cols-1 max-w-sm'
                                            : visibleCards === 2
                                                ? 'grid-cols-2 max-w-4xl'
                                                : 'grid-cols-3 max-w-6xl'
                                            }`}
                                    >
                                        {getVisibleSoftware().map((soft, i) => {
                                            const gradient = getGradient(soft.name);
                                            const categoryStyle = getCategoryColor(soft.name);
                                            return (
                                                <motion.div
                                                    key={`${soft.name}-${currentSlide}-${i}`}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                                    whileHover={{ scale: 1.02, y: -5 }}
                                                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 transition-all cursor-pointer overflow-hidden"
                                                >
                                                    {/* Header */}
                                                    <div className={`relative h-32 bg-gradient-to-r ${gradient} p-6`}>
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                                        <div className="relative z-10 h-full flex flex-col justify-between">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <span className={`text-sm font-semibold ${categoryStyle} px-3 py-1 rounded-full border backdrop-blur-sm`}>
                                                                        {soft.category}
                                                                    </span>
                                                                    <h4 className="text-2xl font-bold text-white mt-3 drop-shadow-sm">
                                                                        {soft.name}
                                                                    </h4>
                                                                </div>
                                                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-white/30">
                                                                    <div className="text-white">{soft.icon}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-white/80 text-sm">
                                                                <span>Version {soft.version}</span>
                                                                <span>•</span>
                                                                <span>{soft.size}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Corps */}
                                                    <div className="p-6">
                                                        <p className="text-gray-600 mb-6 leading-relaxed">{soft.description}</p>
                                                        <div className="space-y-3 mb-6">
                                                            {soft.features.map((feature, j) => (
                                                                <div key={j} className="flex items-center gap-3 text-gray-700">
                                                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                                    <span className="text-sm">{feature}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <button onClick={() => handleDownload(soft)} className="flex-1 py-3 bg-neutral-800 text-white rounded-xl font-semibold hover:shadow-lg transition-all group-hover:scale-105 text-center">Télécharger</button>
                                                            <button onClick={() => handleDetailsClick(soft)} className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">Détails</button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Dialog global Détails */}
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    {selectedSoftware ? (
                                        <>
                                            <DialogHeader>
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${getGradient(selectedSoftware.name)}`}>
                                                        {selectedSoftware.icon}
                                                    </div>
                                                    <div>
                                                        <DialogTitle className="text-2xl font-bold">{selectedSoftware.name}</DialogTitle>
                                                        <DialogDescription className="text-lg">{selectedSoftware.description}</DialogDescription>
                                                    </div>
                                                </div>
                                            </DialogHeader>

                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                <div className="lg:col-span-2 space-y-6">
                                                    <div>
                                                        <h3 className="text-lg font-semibold mb-3">Caractéristiques principales</h3>
                                                        <div className="grid gap-3">
                                                            {selectedSoftware.features.map((feature, index) => (
                                                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                                    <span className="text-gray-700">{feature}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold mb-3">Nouveautés de la version {selectedSoftware.version}</h3>
                                                        <div className="space-y-2">
                                                            {selectedSoftware.changelog.map((change, index) => (
                                                                <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
                                                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                                                    {change}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <h3 className="font-semibold mb-3">Informations techniques</h3>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between"><span className="text-gray-600">Version:</span><span className="font-medium">{selectedSoftware.version}</span></div>
                                                            <div className="flex justify-between"><span className="text-gray-600">Taille:</span><span className="font-medium">{selectedSoftware.size}</span></div>
                                                            <div className="flex justify-between"><span className="text-gray-600">Dernière mise à jour:</span><span className="font-medium">{selectedSoftware.lastUpdate}</span></div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <h3 className="font-semibold mb-3">Configuration requise</h3>
                                                        <p className="text-sm text-gray-600">{selectedSoftware.requirements}</p>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <h3 className="font-semibold mb-3">Avis utilisateurs</h3>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="font-semibold">{selectedSoftware.rating}</span></div>
                                                            <span className="text-gray-600">({selectedSoftware.reviews} avis)</span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <div className="flex items-center gap-1"><Users className="w-4 h-4" /><span>+10K téléchargements</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 pt-6 border-t">
                                                <Button onClick={() => handleDownload(selectedSoftware)} className="flex-1 h-12 text-lg" size="lg"><Download className="w-5 h-5 mr-2" />Télécharger {selectedSoftware.name}</Button>
                                                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="h-12">Fermer</Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-8"><p className="text-gray-500">Chargement des détails...</p></div>
                                    )}
                                </DialogContent>
                            </Dialog>

                            {/* Flèche droite */}
                            <button
                                onClick={nextSlide}
                                className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-xl hover:shadow-2xl transition-all z-10 hover:scale-110 border border-gray-200"
                                aria-label="Logiciel suivant"
                            >
                                <ChevronRight className="w-6 h-6 text-gray-700" />
                            </button>
                        </div>

                        {/* Indicateurs de slide */}
                        <div className="flex justify-center  space-x-3">
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? 'bg-blue-600 w-8'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Aller au slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Compteur de slides */}
                        {/* <div className="text-center mt-4 text-gray-500 text-sm">
                            Page {currentSlide + 1} sur {totalSlides}
                        </div> */}

                        {/* View all software CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-center mt-12"
                        >
                            <Link
                                href="/software"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                            >
                                Voir tous nos logiciels
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section - Focus sur la gestion des licences */}

                <section id="features" className="py-24 px-6 relative overflow-hidden">
                    {/* Background sombre avec dégradé */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900"></div>

                    {/* Effets de particules */}
                    <div className="absolute inset-0">
                        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
                    </div>

                    {/* Motif de grille subtil */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-20"
                        >
                            <motion.h3
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl md:text-5xl font-bold text-white mb-6"
                            >
                                Une expérience <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">exceptionnelle</span>
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                            >
                                Découvrez tous les outils dont vous avez besoin pour tirer le meilleur parti
                                de vos logiciels MasterTrade.
                            </motion.p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Download className="w-8 h-8 text-blue-400" />,
                                    title: "Téléchargements Directs",
                                    desc: "Accédez instantanément à tous vos logiciels MasterTrade depuis votre espace personnel sécurisé.",
                                    features: ["Liens sécurisés", "Téléchargement résumable", "Multi-sources optimisées"],
                                    gradient: "from-blue-500/20 to-blue-600/20"
                                },
                                {
                                    icon: <ShieldCheck className="w-8 h-8 text-purple-400" />,
                                    title: "Gestion des Licences",
                                    desc: "Activez, suivez et renouvelez vos licences en temps réel avec notifications intelligentes.",
                                    features: ["Statut en direct", "Renouvellement automatique", "Historique complet"],
                                    gradient: "from-purple-500/20 to-purple-600/20"
                                },
                                {
                                    icon: <BarChart3 className="w-8 h-8 text-green-400" />,
                                    title: "Dashboard Personnalisé",
                                    desc: "Surveillez l'état de tous vos logiciels et licences depuis une interface unifiée.",
                                    features: ["Metrics d'usage", "Alertes proactives", "Rapports détaillés"],
                                    gradient: "from-green-500/20 to-green-600/20"
                                },
                                {
                                    icon: <CreditCard className="w-8 h-8 text-violet-400" />,
                                    title: "Paiements Simplifiés",
                                    desc: "Renouvelez vos abonnements en un clic avec tous vos moyens de paiement préférés.",
                                    features: ["Carte & Mobile Money", "Facturation automatique", "Historique sécurisé"],
                                    gradient: "from-cyan-500/20 to-cyan-600/20"
                                },
                                {
                                    icon: <BookOpen className="w-8 h-8 text-red-400" />,
                                    title: "Formations Intégrées",
                                    desc: "Maîtrisez vos logiciels avec nos tutoriels vidéo et documentation exclusive.",
                                    features: ["Vidéos haute qualité", "Guides pratiques", "Certifications reconnues"],
                                    gradient: "from-blue-500/20 to-fuchsia-600/20"
                                },
                                {
                                    icon: <Users className="w-8 h-8 text-indigo-400" />,
                                    title: "Support Réactif",
                                    desc: "Notre équipe technique vous accompagne pour optimiser votre expérience utilisateur.",
                                    features: ["Support 24h/24", "Assistance technique", "Communauté active"],
                                    gradient: "from-indigo-500/20 to-indigo-600/20"
                                },
                            ].map((f, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -8 }}
                                    className="group relative"
                                >
                                    {/* Carte avec effet de verre - Background statique */}
                                    <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-blue-400/30 transition-all duration-300 h-full flex flex-col">
                                        {/* Background gradient STATIQUE - ne change pas au survol */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} rounded-2xl opacity-30`}></div>

                                        {/* Icône */}
                                        <div className="relative z-10 w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                                            {f.icon}
                                        </div>

                                        {/* Titre */}
                                        <h4 className="relative z-10 text-2xl font-bold text-white mb-4">
                                            {f.title}
                                        </h4>

                                        {/* Description */}
                                        <p className="relative z-10 text-gray-300 mb-6 leading-relaxed flex-1">
                                            {f.desc}
                                        </p>

                                        {/* Features list */}
                                        <div className="relative z-10 space-y-3">
                                            {f.features.map((feature, j) => (
                                                <motion.div
                                                    key={j}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.4, delay: i * 0.1 + j * 0.1 }}
                                                    className="flex items-center gap-3 text-gray-200"
                                                >
                                                    <div className="w-2 h-2 bg-current text-green-400 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                                                    <span className="text-sm group-hover:text-gray-300 transition-colors">{feature}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Ombre portée colorée - plus subtile */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} rounded-2xl blur-xl -z-10 group-hover:blur-2xl transition-all duration-300 opacity-20 group-hover:opacity-40`}></div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Section supplémentaire - Chiffres clés */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
                        >
                            {[
                                { number: "99.9%", label: "Disponibilité", icon: <Zap className="w-6 h-6" /> },
                                { number: "<2min", label: "Installation", icon: <Download className="w-6 h-6" /> },
                                { number: "24/7", label: "Support", icon: <Users className="w-6 h-6" /> },
                                { number: "256-bit", label: "Sécurité", icon: <ShieldCheck className="w-6 h-6" /> }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                                    className="text-center group"
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-2xl border border-white/10 mb-4 group-hover:bg-white/10 transition-colors">
                                        <div className="text-blue-400">
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <div className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.number}</div>
                                    <div className="text-gray-400 text-sm">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Dashboard Preview Avancé */}
                <section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <motion.h3
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                                >
                                    Votre <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">tableau de bord</span> intelligent
                                </motion.h3>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-lg text-gray-600 mb-8 leading-relaxed"
                                >
                                    Gérez tous vos logiciels MasterTrade depuis une interface unifiée.
                                    Suivez vos licences, téléchargez les mises à jour et accédez au support en temps réel.
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="space-y-4"
                                >
                                    {[
                                        {
                                            icon: <ShieldCheck className="w-5 h-5 text-green-500" />,
                                            text: "État des licences en temps réel",
                                            description: "Visualisez le statut de chaque logiciel"
                                        },
                                        {
                                            icon: <Download className="w-5 h-5 text-blue-500" />,
                                            text: "Téléchargements directs et sécurisés",
                                            description: "Accès immédiat à vos applications"
                                        },
                                        {
                                            icon: <Bell className="w-5 h-5 text-orange-500" />,
                                            text: "Notifications de renouvellement",
                                            description: "Alertes avant expiration des licences"
                                        },
                                        {
                                            icon: <BarChart3 className="w-5 h-5 text-purple-500" />,
                                            text: "Historique complet d'activité",
                                            description: "Suivez toutes vos actions"
                                        },
                                        {
                                            icon: <MessageCircle className="w-5 h-5 text-indigo-500" />,
                                            text: "Support intégré et réactif",
                                            description: "Assistance directe depuis le dashboard"
                                        }
                                    ].map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.8 + i * 0.1 }}
                                            className="flex items-start gap-4 p-4 bg-white/50 rounded-xl border border-gray-200/50 backdrop-blur-sm hover:bg-white/80 transition-all"
                                        >
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{feature.text}</div>
                                                <div className="text-gray-600 text-sm mt-1">{feature.description}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="relative"
                            >
                                {/* Mockup du dashboard avancé */}
                                <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-8 shadow-2xl border border-gray-800">
                                    {/* Barre de titre */}
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                                <Cpu className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="text-white font-bold">MasterTrade Dashboard</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* En-tête avec stats */}
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                                            <div className="text-white font-bold text-lg">4</div>
                                            <div className="text-gray-400 text-xs">Logiciels</div>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                                            <div className="text-green-400 font-bold text-lg">3</div>
                                            <div className="text-gray-400 text-xs">Actifs</div>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                                            <div className="text-yellow-400 font-bold text-lg">1</div>
                                            <div className="text-gray-400 text-xs">Bientôt expiré</div>
                                        </div>
                                    </div>

                                    {/* Liste des logiciels */}
                                    <div className="space-y-4">
                                        {[
                                            {
                                                name: "MasterAdogbe",
                                                status: "active",
                                                daysLeft: "365",
                                                icon: <Users className="w-5 h-5" />,
                                                color: "from-green-500 to-emerald-500"
                                            },
                                            {
                                                name: "MasterImmo",
                                                status: "active",
                                                daysLeft: "120",
                                                icon: <Building className="w-5 h-5" />,
                                                color: "from-blue-500 to-cyan-500"
                                            },
                                            {
                                                name: "MasterTrade",
                                                status: "active",
                                                daysLeft: "45",
                                                icon: <TrendingUp className="w-5 h-5" />,
                                                color: "from-purple-500 to-pink-500"
                                            },
                                            {
                                                name: "MasterStock",
                                                status: "warning",
                                                daysLeft: "15",
                                                icon: <Package className="w-5 h-5" />,
                                                color: "from-orange-500 to-red-500"
                                            }
                                        ].map((software, i) => (
                                            <motion.div
                                                key={software.name}
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 + i * 0.1 }}
                                                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 bg-gradient-to-r ${software.color} rounded-lg flex items-center justify-center text-white`}>
                                                        {software.icon}
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-semibold group-hover:text-blue-300 transition-colors">
                                                            {software.name}
                                                        </div>
                                                        <div className="text-gray-400 text-sm">
                                                            {software.status === "active" ? "Licence Active" : "Expire bientôt"} •
                                                            <span className={software.status === "warning" ? "text-yellow-400 ml-1" : "text-green-400 ml-1"}>
                                                                {software.daysLeft} jours
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {software.status === "active" ? (
                                                        <div className="flex items-center gap-1 text-green-400 text-sm">
                                                            <Check className="w-4 h-4" />
                                                            <span>Actif</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 text-yellow-400 text-sm">
                                                            <AlertTriangle className="w-4 h-4" />
                                                            <span>Renouveler</span>
                                                        </div>
                                                    )}
                                                    <button className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors">
                                                        <Download className="w-4 h-4 text-gray-300" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Barre d'actions */}
                                    <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700/50">
                                        <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                            Renouveler
                                        </button>
                                        <button className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors">
                                            Support
                                        </button>
                                    </div>
                                </div>

                                {/* Éléments décoratifs */}
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -z-10"></div>
                                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -z-10"></div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section - Design Professionnel avec Headers Colorés */}
                <section id="pricing" className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-20"
                        >
                            <motion.h3
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                            >
                                Des solutions adaptées à <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">votre entreprise</span>
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                            >
                                Choisissez le plan qui correspond à vos besoins. Tous nos abonnements incluent
                                l'accès à la plateforme MasterTrade et un support technique dédié.
                            </motion.p>
                        </motion.div>

                        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {[
                                {
                                    plan: "Starter",
                                    price: "Gratuit",
                                    period: "30 jours d'essai",
                                    description: "Parfait pour découvrir nos solutions",
                                    popular: false,
                                    features: [
                                        "1 logiciel au choix",
                                        "Support technique de base",
                                        "Accès 30 jours",
                                        "Mises à jour incluses",
                                        "Dashboard personnel"
                                    ],
                                    cta: "Commencer l'essai",
                                    color: "gray",
                                    headerGradient: "from-gray-500 to-gray-600",
                                    headerBg: "bg-gradient-to-r from-gray-500 to-gray-600"
                                },
                                {
                                    plan: "Professionnel",
                                    price: "49 FCFA",
                                    period: "par mois",
                                    description: "Solution complète pour professionnels",
                                    popular: true,
                                    features: [
                                        "3 logiciels au choix",
                                        "Support prioritaire",
                                        "Licences simultanées",
                                        "Formations incluses",
                                        "Dashboard avancé",
                                        "Rapports détaillés",
                                        "Sauvegarde cloud"
                                    ],
                                    cta: "Choisir ce plan",
                                    color: "blue",
                                    headerGradient: "from-blue-500 to-blue-600",
                                    headerBg: "bg-gradient-to-r from-blue-500 to-blue-600"
                                },
                                {
                                    plan: "Enterprise",
                                    price: "99 FCFA",
                                    period: "par mois",
                                    description: "Pour les organisations et équipes",
                                    popular: false,
                                    features: [
                                        "Tous les logiciels inclus",
                                        "Support dédié 24/7",
                                        "Licences illimitées",
                                        "Formations premium",
                                        "API d'intégration",
                                        "Personnalisation avancée",
                                        "SLA garantie 99.9%"
                                    ],
                                    cta: "Contactez-nous",
                                    color: "purple",
                                    headerGradient: "from-purple-500 to-purple-600",
                                    headerBg: "bg-gradient-to-r from-purple-500 to-purple-600"
                                },
                            ].map((p, i) => (
                                <motion.div
                                    key={p.plan}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: i * 0.2 }}
                                    whileHover={{ y: -5 }}
                                    className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${p.popular
                                        ? 'border-blue-200 shadow-2xl scale-105 bg-gradient-to-b from-white to-blue-50'
                                        : 'border-gray-200 shadow-lg bg-white hover:shadow-xl'
                                        }`}
                                >
                                    {/* Header avec dégradé coloré */}
                                    <div className={`${p.headerBg} text-white py-8 px-8 text-center relative overflow-hidden`}>
                                        {/* Effet de brillance */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                        {/* Badge populaire */}
                                        {p.popular && (
                                            <div className="absolute -top-0 -right-2">
                                                <span className="bg-yellow-200 text-gray-900 px-4 py-3 text-center rounded-full text-xs font-bold shadow-lg">
                                                    Populaire
                                                </span>
                                            </div>
                                        )}

                                        {/* Contenu du header */}
                                        <div className="relative z-10">
                                            <h4 className="text-2xl font-bold mb-2 drop-shadow-sm">{p.plan}</h4>
                                            <div className="flex items-baseline justify-center gap-1 mb-2">
                                                <span className="text-4xl font-bold">{p.price}</span>
                                                {p.period && (
                                                    <span className="text-blue-100 text-lg">/{p.period}</span>
                                                )}
                                            </div>
                                            <p className="text-blue-100 text-sm leading-relaxed">
                                                {p.description}
                                            </p>
                                        </div>

                                        {/* Élément décoratif */}
                                        <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                                    </div>

                                    {/* Corps de la carte */}
                                    <div className="p-8">
                                        {/* Séparateur */}
                                        <div className={`h-px bg-gradient-to-r from-transparent via-${p.color}-200 to-transparent mb-8`}></div>

                                        {/* Liste des fonctionnalités */}
                                        <ul className="space-y-4 mb-8">
                                            {p.features.map((f, j) => (
                                                <motion.li
                                                    key={j}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.4, delay: i * 0.2 + j * 0.1 }}
                                                    className="flex items-start gap-3"
                                                >
                                                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${p.popular ? 'text-blue-500' : `text-${p.color}-500`
                                                        }`} />
                                                    <span className="text-gray-700 leading-relaxed text-sm">{f}</span>
                                                </motion.li>
                                            ))}
                                        </ul>

                                        {/* CTA */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full py-4 rounded-xl font-semibold transition-all ${p.popular
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                                                : `bg-gradient-to-r ${p.headerGradient} text-white hover:shadow-lg`
                                                }`}
                                        >
                                            {p.cta}
                                        </motion.button>
                                    </div>

                                    {/* Note de bas de page */}
                                    <div className="px-8 pb-6">
                                        <p className="text-gray-500 text-xs text-center">
                                            {p.plan === "Starter" ? "Aucune carte requise • Installation immédiate" :
                                                p.plan === "Enterprise" ? "Devis personnalisé disponible • Support dédié" :
                                                    "Facturation mensuelle • Support prioritaire"}
                                        </p>
                                    </div>

                                    {/* Effet de bordure colorée subtile */}
                                    <div className={`absolute inset-0 border-2 border-transparent bg-gradient-to-r ${p.headerGradient} rounded-2xl -z-10 opacity-0 hover:opacity-5 transition-opacity duration-300`}></div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Informations supplémentaires */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="mt-16 text-center"
                        >
                            <div className="inline-flex flex-wrap justify-center gap-8 text-gray-600 text-sm">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                    <span>Garantie satisfait ou remboursé 30 jours</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-blue-500" />
                                    <span>Paiement sécurisé SSL</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-purple-500" />
                                    <span>Support technique inclus</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Testimonials Carousel Fonctionnel */}
                <section id="testimonials" className="py-24 px-6 relative overflow-hidden">
                    {/* Background avec dégradé sombre et effet de particules */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900"></div>

                    {/* Effet de particules floues */}
                    <div className="absolute inset-0">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-10"
                        >
                            <motion.h3
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl md:text-5xl font-bold text-white mb-6"
                            >
                                Ils utilisent nos <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">logiciels</span>
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                            >
                                Découvrez comment nos solutions transforment le quotidien
                                des professionnels dans leurs domaines respectifs.
                            </motion.p>
                        </motion.div>

                        {/* Carousel Container */}
                        <div className="relative">
                            {/* Flèche gauche */}
                            <button
                                onClick={prevTestimonialSlide}
                                className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-lg rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all z-10 hover:scale-110 border border-white/20 hover:bg-white/20"
                                aria-label="Témoignage précédent"
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>

                            {/* Container des témoignages */}
                            <div className="overflow-hidden px-2">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentTestimonialSlide}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.5 }}
                                        className="grid grid-cols-1 md:grid-cols-2 pt-10 lg:grid-cols-3 gap-8"
                                    >
                                        {getVisibleTestimonials().map((testimonial, i) => (
                                            <motion.div
                                                key={`${testimonial.name}-${currentTestimonialSlide}-${i}`}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                                whileHover={{ scale: 1.02, y: -5 }}
                                                className="group relative"
                                            >
                                                {/* Carte avec effet de verre */}
                                                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col">
                                                    {/* Badge du logiciel */}
                                                    <div className="mb-4">
                                                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm">
                                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                            {testimonial.software}
                                                        </span>
                                                    </div>

                                                    {/* Note étoilée */}
                                                    <div className="flex items-center gap-1 mb-6">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className="w-5 h-5 text-yellow-400 fill-current drop-shadow-sm"
                                                            />
                                                        ))}
                                                    </div>

                                                    {/* Citation */}
                                                    <div className="relative mb-8 flex-1">
                                                        <div className="text-6xl text-blue-400/20 absolute -top-4 -left-2 font-serif">"</div>
                                                        <p className="text-gray-200 leading-relaxed text-lg relative z-10 italic">
                                                            {testimonial.text}
                                                        </p>
                                                        <div className="text-6xl text-blue-400/20 absolute -bottom-8 -right-2 font-serif">"</div>
                                                    </div>

                                                    {/* Séparateur */}
                                                    <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mb-6 rounded-full"></div>

                                                    {/* Informations utilisateur */}
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                                {testimonial.avatar}
                                                            </div>
                                                            {/* Badge vérifié */}
                                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                                <Check className="w-3 h-3 text-white" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-white text-lg">{testimonial.name}</div>
                                                            <div className="text-blue-300 text-sm">{testimonial.role}</div>
                                                            <div className="text-gray-400 text-sm">{testimonial.company}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Ombre portée */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl -z-10 group-hover:blur-2xl transition-all duration-300 opacity-50 group-hover:opacity-70"></div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Flèche droite */}
                            <button
                                onClick={nextTestimonialSlide}
                                className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-lg rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all z-10 hover:scale-110 border border-white/20 hover:bg-white/20"
                                aria-label="Témoignage suivant"
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        {/* Indicateurs de slide */}
                        <div className="flex justify-center mt-12 space-x-3">
                            {Array.from({ length: totalTestimonialSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToTestimonialSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonialSlide
                                        ? 'bg-white w-8'
                                        : 'bg-white/30 hover:bg-white/50'
                                        }`}
                                    aria-label={`Aller au groupe de témoignages ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Compteur de slides */}
                        {/* <div className="text-center mt-4 text-gray-300 text-sm">
                            Groupe {currentTestimonialSlide + 1} sur {totalTestimonialSlides}
                        </div> */}

                        {/* Statistiques de confiance */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto  w-fit bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
                        >
                            {[
                                { number: "2K+", label: "Tontines gérées" },
                                { number: "500+", label: "Propriétés suivies" },
                                { number: "1.5K+", label: "Entreprises clientes" },
                                { number: "98%", label: "Clients satisfaits" }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1 + i * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.number}</div>
                                    <div className="text-gray-400 text-sm">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Call to Action supplémentaire */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            className="text-center mt-10"
                        >
                            <p className="text-gray-300 mb-6">Rejoignez nos clients satisfaits</p>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                            >
                                <Users className="w-5 h-5" />
                                Commencer maintenant
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Final CTA - Design Clair et Élégant */}
                <section className="py-20 px-6 relative overflow-hidden">
                    {/* Background clair avec dégradé subtil */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>

                    {/* Effets de particules légères */}
                    <div className="absolute inset-0">
                        <div className="absolute top-10 left-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-200/30 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-100/40 rounded-full blur-3xl"></div>
                    </div>

                    {/* Motif de grille subtil */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <motion.h3
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                        >
                            Prêt à <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">optimiser</span> votre productivité ?
                        </motion.h3>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
                        >
                            Rejoignez des milliers de professionnels qui utilisent déjà MasterTrade
                            pour simplifier leur gestion quotidienne.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                        >
                            <Link
                                href="/register"
                                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 overflow-hidden"
                            >
                                {/* Effet de brillance */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                <span className="relative z-10">Essai gratuit 30 jours</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                            </Link>

                            <a
                                href="#logiciels"
                                className="group px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-2 bg-white/80 backdrop-blur-sm"
                            >
                                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Voir la démo
                            </a>
                        </motion.div>

                        {/* Features avec design moderne */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
                        >
                            {[
                                {
                                    icon: <Check className="w-5 h-5 text-green-500" />,
                                    text: "Aucune carte requise",
                                    description: "Commencez sans engagement"
                                },
                                {
                                    icon: <Zap className="w-5 h-5 text-blue-500" />,
                                    text: "Installation immédiate",
                                    description: "Opérationnel en 2 minutes"
                                },
                                {
                                    icon: <ShieldCheck className="w-5 h-5 text-purple-500" />,
                                    text: "Support premium inclus",
                                    description: "Assistance 7j/7"
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 + i * 0.1 }}
                                    className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                        {feature.icon}
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-gray-900 text-sm">{feature.text}</div>
                                        <div className="text-gray-500 text-xs">{feature.description}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Badge de confiance */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.3 }}
                            className="mt-12 flex flex-col items-center"
                        >
                            <div className="flex items-center gap-4 text-gray-500 text-sm">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>10K+ professionnels</span>
                                </div>
                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span>4.9/5 satisfaction</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Footer Corrigé */}
                <footer className="py-16 px-6 bg-gray-900 text-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-4 gap-8 mb-12">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                        <Cpu className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        MasterTrade
                                    </span>
                                </div>
                                <p className="text-gray-400 leading-relaxed mb-4">
                                    Éditeur de logiciels professionnels depuis 2018.
                                    Votre succès, notre technologie.
                                </p>
                                <div className="flex gap-3">
                                    {["Twitter", "LinkedIn", "Facebook", "Instagram"].map((social, i) => (
                                        <a key={i} href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                                            <div className="w-5 h-5 bg-gray-400 rounded"></div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {[
                                {
                                    title: "Logiciels",
                                    links: ["MasterAdogbe", "MasterImmo", "MasterTrade", "MasterStock", "Tous les logiciels"]
                                },
                                {
                                    title: "Ressources",
                                    links: ["Documentation", "Tutoriels", "Blog", "Support", "Formations"]
                                },
                                {
                                    title: "Entreprise",
                                    links: ["À propos", "Contact", "Presse", "Carrières", "Partenaires"]
                                }
                            ].map((column, i) => (
                                <div key={i}>
                                    <h5 className="font-semibold text-white mb-4 text-lg">{column.title}</h5>
                                    <ul className="space-y-3">
                                        {column.links.map((link, j) => (
                                            <li key={j}>
                                                <a href="#" className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform block duration-200">
                                                    {link}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-gray-800 text-center">
                            <p className="text-gray-400">
                                © {new Date().getFullYear()} MasterTrade SAS. Tous droits réservés.
                            </p>
                            <div className="mt-4 flex justify-center gap-6 text-sm text-gray-500">
                                <a href="#" className="hover:text-gray-300 transition-colors">Mentions légales</a>
                                <a href="#" className="hover:text-gray-300 transition-colors">Politique de confidentialité</a>
                                <a href="#" className="hover:text-gray-300 transition-colors">CGU</a>
                                <a href="#" className="hover:text-gray-300 transition-colors">Cookies</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </>
    );
}
