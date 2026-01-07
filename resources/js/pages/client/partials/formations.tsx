
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import {
    Search,
    Grid,
    List,
    Star,
    PlayCircle,
    Clock,
    Users,
    BookOpen,
    Award,
    ChevronRight,
    BarChart3,
    ShoppingCart,
    Smartphone,
    Target,
    Download,
    CheckCircle,
    Zap,
    TrendingUp,
    Globe
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

export default function Formations() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Formations',
            href: '/client/partials/formations',
        },
    ];

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [difficulty, setDifficulty] = useState('all');

    const categories = [
        { id: 'all', name: 'Toutes les formations', count: 24, icon: BookOpen },
        { id: 'ecommerce', name: 'E-commerce', count: 8, icon: ShoppingCart },
        { id: 'marketing', name: 'Marketing Digital', count: 6, icon: Target },
        { id: 'reseaux-sociaux', name: 'Réseaux Sociaux', count: 5, icon: Smartphone },
        { id: 'analyse', name: 'Analyse de Données', count: 3, icon: BarChart3 },
        { id: 'developpement', name: 'Développement', count: 2, icon: Globe },
    ];

    const difficultyLevels = [
        { id: 'all', name: 'Tous niveaux' },
        { id: 'debutant', name: 'Débutant' },
        { id: 'intermediaire', name: 'Intermédiaire' },
        { id: 'avance', name: 'Avancé' },
    ];

    const formations = [
        {
            id: 1,
            title: "Masterclass E-commerce - De Zéro à Pro",
            description: "Apprenez à créer et gérer une boutique en ligne rentable avec les meilleures pratiques du marché",
            instructor: "Marie Dubois",
            instructorTitle: "Expert E-commerce - 10 ans d'expérience",
            duration: "15h 30min",
            students: 1247,
            rating: 4.8,
            reviewCount: 423,
            price: "297 FCFA",
            originalPrice: "497 FCFA",
            category: "ecommerce",
            difficulty: "intermediaire",
            modules: 12,
            resources: 34,
            certificate: true,
            tags: ["Populaire", "Certifiante"],
            progress: 0,
            image: "/images/formation-ecommerce.jpg",
            objectives: [
                "Créer une boutique en ligne performante",
                "Optimiser le taux de conversion",
                "Maîtriser la logistique e-commerce",
                "Développer une stratégie marketing"
            ]
        },
        {
            id: 2,
            title: "Marketing Digital Complet 2024",
            description: "Maîtrisez tous les leviers du marketing digital : SEO, réseaux sociaux, email marketing et publicité",
            instructor: "Thomas Martin",
            instructorTitle: "Directeur Marketing Digital",
            duration: "22h 15min",
            students: 2891,
            rating: 4.9,
            reviewCount: 856,
            price: "347 FCFA",
            originalPrice: "547 FCFA",
            category: "marketing",
            difficulty: "debutant",
            modules: 18,
            resources: 45,
            certificate: true,
            tags: ["Best-seller", "Certifiante"],
            progress: 0,
            image: "/images/formation-marketing.jpg",
            objectives: [
                "Définir une stratégie digitale complète",
                "Maîtriser les outils d'analyse",
                "Créer des campagnes publicitaires efficaces",
                "Gérer l'e-réputation"
            ]
        },
        {
            id: 3,
            title: "Expert Facebook & Instagram Ads",
            description: "Devenez expert en publicité sur les réseaux sociaux et multipliez vos ventes",
            instructor: "Sophie Lambert",
            instructorTitle: "Spécialiste Social Media",
            duration: "9h 45min",
            students: 1563,
            rating: 4.7,
            reviewCount: 312,
            price: "197 FCFA",
            category: "reseaux-sociaux",
            difficulty: "intermediaire",
            modules: 8,
            resources: 28,
            certificate: true,
            tags: ["Spécialisation"],
            progress: 0,
            image: "/images/formation-ads.jpg",
            objectives: [
                "Créer des campagnes rentables",
                "Maîtriser le Business Manager",
                "Analyser les performances",
                "Optimiser le ROI"
            ]
        },
        {
            id: 4,
            title: "Google Analytics 4 - Analyse Avancée",
            description: "Exploitez pleinement GA4 pour prendre des décisions data-driven et optimiser vos performances",
            instructor: "Alexandre Petit",
            instructorTitle: "Data Analyst Senior",
            duration: "7h 20min",
            students: 892,
            rating: 4.6,
            reviewCount: 187,
            price: "147 FCFA",
            category: "analyse",
            difficulty: "avance",
            modules: 6,
            resources: 22,
            certificate: true,
            tags: ["Technique", "Certifiante"],
            progress: 0,
            image: "/images/formation-analytics.jpg",
            objectives: [
                "Configurer GA4 correctement",
                "Créer des rapports personnalisés",
                "Analyser le parcours client",
                "Automatiser les rapports"
            ]
        },
        {
            id: 5,
            title: "Dropshipping - Méthode Complète",
            description: "Lancez votre business en dropshipping avec une méthode éprouvée et des cas concrets",
            instructor: "Kevin Rodriguez",
            instructorTitle: "Entrepreneur E-commerce",
            duration: "12h 10min",
            students: 2105,
            rating: 4.5,
            reviewCount: 534,
            price: "247 FCFA",
            originalPrice: "397 FCFA",
            category: "ecommerce",
            difficulty: "debutant",
            modules: 10,
            resources: 38,
            certificate: true,
            tags: ["Pratique", "Nouveau"],
            progress: 0,
            image: "/images/formation-dropshipping.jpg",
            objectives: [
                "Trouver des produits gagnants",
                "Créer une boutique Shopify",
                "Gérer la relation fournisseurs",
                "Scaler son business"
            ]
        },
        {
            id: 6,
            title: "SEO Avancé - Dominez Google",
            description: "Techniques avancées de référencement naturel pour positionner votre site en première page",
            instructor: "Laura Chen",
            instructorTitle: "Consultante SEO International",
            duration: "14h 55min",
            students: 1342,
            rating: 4.8,
            reviewCount: 289,
            price: "297 FCFA",
            category: "marketing",
            difficulty: "avance",
            modules: 11,
            resources: 41,
            certificate: true,
            tags: ["Expertise", "Certifiante"],
            progress: 45,
            image: "/images/formation-seo.jpg",
            objectives: [
                "Auditer un site complètement",
                "Maîtriser le technical SEO",
                "Développer une stratégie de liens",
                "Mesurer l'impact SEO"
            ]
        }
    ];

    const stats = [
        {
            label: "Formations disponibles",
            value: "24",
            icon: BookOpen,
            description: "Cours complets"
        },
        {
            label: "Heures de contenu",
            value: "185h",
            icon: Clock,
            description: "Vidéo + pratique"
        },
        {
            label: "Étudiants actifs",
            value: "12.5K",
            icon: Users,
            description: "Communauté"
        },
        {
            label: "Taux de satisfaction",
            value: "98%",
            icon: Star,
            description: "Avis positifs"
        }
    ];

    const RatingStars = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) => (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"
                        } ${star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30"
                        }`}
                />
            ))}
        </div>
    );

    const getDifficultyColor = (level: string) => {
        switch (level) {
            case 'debutant': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'intermediaire': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'avance': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const filteredFormations = formations.filter(formation => {
        if (activeCategory !== 'all' && formation.category !== activeCategory) return false;
        if (difficulty !== 'all' && formation.difficulty !== difficulty) return false;
        if (searchTerm && !formation.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Formations" />

            {/* En-tête hero */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
                <div className="container px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-none">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Nouveautés 2024
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Devenez Expert du
                            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                                Digital
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                            Formations certifiantes en e-commerce, marketing digital et développement
                            avec des experts du secteur
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                                <PlayCircle className="h-5 w-5 mr-2" />
                                Découvrir les formations
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                Voir le programme détaillé
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistiques */}
            <div className="border-b">
                <div className="container px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => {
                            const IconComponent = stat.icon;
                            return (
                                <div key={index} className="text-center">
                                    <div className="flex justify-center mb-3">
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                            <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                    <div className="text-sm font-medium text-foreground">{stat.label}</div>
                                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="container px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar des filtres */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="sticky top-8 space-y-8">
                            {/* Barre de recherche */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher une formation..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Catégories */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Catégories</h3>
                                <div className="space-y-2">
                                    {categories.map((category) => {
                                        const IconComponent = category.icon;
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => setActiveCategory(category.id)}
                                                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${activeCategory === category.id
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'hover:bg-accent'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <IconComponent className="h-4 w-4" />
                                                    <span className="font-medium">{category.name}</span>
                                                </div>
                                                <Badge variant="secondary" className={
                                                    activeCategory === category.id
                                                        ? 'bg-primary-foreground text-primary'
                                                        : ''
                                                }>
                                                    {category.count}
                                                </Badge>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Niveau de difficulté */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Niveau</h3>
                                <div className="space-y-2">
                                    {difficultyLevels.map((level) => (
                                        <button
                                            key={level.id}
                                            onClick={() => setDifficulty(level.id)}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${difficulty === level.id
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-accent'
                                                }`}
                                        >
                                            <span>{level.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filtres supplémentaires */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Options</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2">
                                        <Checkbox />
                                        <span className="text-sm">Avec certification</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <Checkbox />
                                        <span className="text-sm">Formations populaires</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <Checkbox />
                                        <span className="text-sm">Nouveautés</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section formations */}
                    <div className="flex-1">
                        {/* En-tête résultats */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {filteredFormations.length} formation{filteredFormations.length > 1 ? 's' : ''} disponible{filteredFormations.length > 1 ? 's' : ''}
                                </h2>
                                <p className="text-muted-foreground mt-1">
                                    Développez vos compétences avec nos experts
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Affichage :</span>
                                    <div className="flex border rounded-lg">
                                        <Button
                                            variant={viewMode === 'grid' ? "default" : "ghost"}
                                            size="sm"
                                            onClick={() => setViewMode('grid')}
                                            className="h-9 w-9 p-0"
                                        >
                                            <Grid className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant={viewMode === 'list' ? "default" : "ghost"}
                                            size="sm"
                                            onClick={() => setViewMode('list')}
                                            className="h-9 w-9 p-0"
                                        >
                                            <List className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <Select defaultValue="popular">
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Trier par" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="popular">Populaire</SelectItem>
                                        <SelectItem value="newest">Nouveauté</SelectItem>
                                        <SelectItem value="rating">Meilleures notes</SelectItem>
                                        <SelectItem value="duration">Durée</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Grille de formations */}
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredFormations.map((formation) => (
                                    <Card key={formation.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                                        <CardHeader className="pb-4 relative">
                                            {/* Image et badges */}
                                            <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                                                <BookOpen className="h-12 w-12 text-blue-500/50" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                                {/* Badges */}
                                                <div className="absolute top-3 left-3 flex gap-2">
                                                    {formation.tags.map((tag, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                {/* Niveau */}
                                                <div className="absolute top-3 right-3">
                                                    <Badge className={getDifficultyColor(formation.difficulty)}>
                                                        {formation.difficulty}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                {formation.title}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-2 mt-2">
                                                {formation.description}
                                            </CardDescription>

                                            {/* Formateur */}
                                            <div className="flex items-center gap-3 mt-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                    {formation.instructor.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{formation.instructor}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{formation.instructorTitle}</p>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pb-4 space-y-4">
                                            {/* Métriques */}
                                            <div className="grid grid-cols-3 gap-4 text-center">
                                                <div>
                                                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        {formation.duration}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                                        <BookOpen className="h-3 w-3" />
                                                        {formation.modules} modules
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                                        <Users className="h-3 w-3" />
                                                        {formation.students.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Rating */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <RatingStars rating={Math.floor(formation.rating)} />
                                                    <span className="font-semibold text-sm">{formation.rating}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        ({formation.reviewCount} avis)
                                                    </span>
                                                </div>
                                                {formation.certificate && (
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <Award className="h-3 w-3" />
                                                        Certifiante
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Progression ou objectifs */}
                                            {formation.progress > 0 ? (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span>Progression</span>
                                                        <span className="font-medium">{formation.progress}%</span>
                                                    </div>
                                                    <Progress value={formation.progress} className="h-2" />
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">Vous apprendrez à :</p>
                                                    <ul className="text-xs text-muted-foreground space-y-1">
                                                        {formation.objectives.slice(0, 2).map((objective, index) => (
                                                            <li key={index} className="flex items-center gap-2">
                                                                <CheckCircle className="h-3 w-3 text-green-500" />
                                                                {objective}
                                                            </li>
                                                        ))}
                                                        {formation.objectives.length > 2 && (
                                                            <li className="text-blue-600 dark:text-blue-400">
                                                                +{formation.objectives.length - 2} autres objectifs
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </CardContent>

                                        <CardFooter className="flex flex-col gap-3">
                                            {/* Prix */}
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-2xl font-bold text-foreground">
                                                        {formation.price}
                                                    </div>
                                                    {formation.originalPrice && (
                                                        <div className="text-lg text-muted-foreground line-through">
                                                            {formation.originalPrice}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bouton d'action */}
                                            <Button asChild className="w-full" size="lg">
                                                <Link href={`/client/formations/${formation.id}`}>
                                                    {formation.progress > 0 ? (
                                                        <>
                                                            <PlayCircle className="h-5 w-5 mr-2" />
                                                            Continuer
                                                        </>
                                                    ) : (
                                                        <>
                                                            <PlayCircle className="h-5 w-5 mr-2" />
                                                            Commencer
                                                        </>
                                                    )}
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredFormations.map((formation) => (
                                    <Card key={formation.id} className="group hover:shadow-xl transition-all duration-300">
                                        <div className="flex flex-col lg:flex-row">
                                            <div className="lg:w-64 flex-shrink-0 p-6">
                                                <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center">
                                                    <BookOpen className="h-16 w-16 text-blue-500/50" />
                                                </div>
                                            </div>
                                            <div className="flex-1 p-6 lg:border-l">
                                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {formation.tags.map((tag, index) => (
                                                                <Badge key={index} variant="secondary" className="text-xs">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                            <Badge className={`text-xs ${getDifficultyColor(formation.difficulty)}`}>
                                                                {formation.difficulty}
                                                            </Badge>
                                                        </div>
                                                        <CardTitle className="text-2xl group-hover:text-primary transition-colors mb-2">
                                                            {formation.title}
                                                        </CardTitle>
                                                        <CardDescription className="text-base mb-3">
                                                            {formation.description}
                                                        </CardDescription>

                                                        {/* Formateur */}
                                                        <div className="flex items-center gap-3 mt-4">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                                {formation.instructor.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">{formation.instructor}</p>
                                                                <p className="text-xs text-muted-foreground">{formation.instructorTitle}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-3xl font-bold text-foreground">
                                                            {formation.price}
                                                        </div>
                                                        {formation.originalPrice && (
                                                            <div className="text-lg text-muted-foreground line-through">
                                                                {formation.originalPrice}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4" />
                                                            {formation.duration}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <BookOpen className="h-4 w-4" />
                                                            {formation.modules} modules
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            {formation.students.toLocaleString()} étudiants
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <RatingStars rating={Math.floor(formation.rating)} />
                                                            <span className="font-semibold">{formation.rating}</span>
                                                            <span>({formation.reviewCount})</span>
                                                        </div>
                                                    </div>

                                                    <Button asChild size="lg">
                                                        <Link href={`/client/formations/${formation.id}`}>
                                                            {formation.progress > 0 ? 'Continuer' : 'Démarrer'}
                                                            <ChevronRight className="h-4 w-4 ml-2" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredFormations.length > 0 && (
                            <div className="flex justify-center mt-12">
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                        Précédent
                                    </Button>
                                    <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                                        1
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        2
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        3
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        Suivant
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Section CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mt-16">
                <div className="container px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Prêt à transformer votre carrière ?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Rejoignez plus de 12,500 étudiants qui ont déjà boosté leurs compétences digitales
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                                <Zap className="h-5 w-5 mr-2" />
                                Voir toutes les formations
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                Télécharger le programme
                                <Download className="h-5 w-5 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
