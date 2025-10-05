import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import {
    Search,
    Filter,
    Grid,
    List,
    Star,
    Plus,
    ChevronDown,
    Package,
    Laptop,
    Zap,
    Shield,
    GraduationCap,
    DollarSign,
    Sparkles,
    Tag,
    CheckCircle
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Catalogue() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Catalogue',
            href: '/client/catalogue',
        },
    ];

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

    const products = [
        {
            id: 1,
            name: "Application de Gestion",
            description: "Solution complète de gestion d'entreprise avec modules intégrés",
            price: "299€",
            originalPrice: "399€",
            category: "Logiciels",
            image: "/images/app-gestion.jpg",
            rating: 4.5,
            reviewCount: 124,
            tags: ["Populaire", "Nouveau"],
            features: ["Multi-utilisateurs", "Support 24/7", "Mises à jour gratuites"]
        },
        {
            id: 2,
            name: "Outil de Productivité",
            description: "Boostez votre efficacité au quotidien avec nos outils avancés",
            price: "149€",
            category: "Productivité",
            image: "/images/productivite.jpg",
            rating: 4.2,
            reviewCount: 89,
            tags: ["Essentiel"],
            features: ["Interface intuitive", "Export multiple", "Templates"]
        },
        {
            id: 3,
            name: "Suite Sécurité Pro",
            description: "Protection avancée pour votre entreprise et vos données",
            price: "199€",
            originalPrice: "249€",
            category: "Sécurité",
            image: "/images/securite.jpg",
            rating: 4.8,
            reviewCount: 67,
            tags: ["Promo"],
            features: ["Chiffrement AES-256", "Sauvegarde cloud", "Audit de sécurité"]
        },
    ];

    const categories = [
        { id: 'all', name: 'Tous les produits', count: 12, icon: Package },
        { id: 'logiciels', name: 'Logiciels', count: 5, icon: Laptop },
        { id: 'productivite', name: 'Productivité', count: 4, icon: Zap },
        { id: 'securite', name: 'Sécurité', count: 3, icon: Shield },
        { id: 'formation', name: 'Formations', count: 2, icon: GraduationCap },
    ];

    const toggleRating = (rating: number) => {
        setSelectedRatings(prev =>
            prev.includes(rating)
                ? prev.filter(r => r !== rating)
                : [...prev, rating]
        );
    };

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Catalogue" />

            {/* En-tête amélioré */}
            <div className="border-b bg-gradient-to-r from-background to-background/80">
                <div className="container px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                            Notre Catalogue
                        </h1>
                        <p className="text-xl text-muted-foreground mt-4">
                            Découvrez nos solutions logicielles professionnelles conçues pour booster votre productivité
                        </p>
                    </div>

                    {/* Barre de recherche et contrôles */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
                        <div className="relative w-full max-w-2xl">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher un produit, une catégorie..."
                                className="pl-12 pr-4 py-3 text-base h-12"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex border rounded-lg bg-background">
                                <Button
                                    variant={viewMode === 'grid' ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="h-10 w-10 p-0"
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="h-10 w-10 p-0"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="container px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar des filtres amélioré */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="sticky top-8 space-y-8">
                            {/* En-tête filtres */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Filtres</h2>
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                    Réinitialiser
                                </Button>
                            </div>

                            {/* Catégories avec icônes */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Catégories
                                </h3>
                                <div className="space-y-2">
                                    {categories.map((category) => {
                                        const IconComponent = category.icon;
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => setActiveCategory(category.id)}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-200 ${activeCategory === category.id
                                                        ? 'bg-primary text-primary-foreground shadow-md'
                                                        : 'hover:bg-accent hover:shadow-sm border border-transparent hover:border-border'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <IconComponent className="h-5 w-5" />
                                                    <span className="font-medium">{category.name}</span>
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        activeCategory === category.id
                                                            ? 'bg-primary-foreground text-primary'
                                                            : 'bg-muted'
                                                    }
                                                >
                                                    {category.count}
                                                </Badge>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Filtre prix */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Prix
                                </h3>
                                <Tabs value={priceRange} onValueChange={setPriceRange} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="all">Tous</TabsTrigger>
                                        <TabsTrigger value="paid">Payants</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                                <div className="space-y-2 text-sm">
                                    {[
                                        { label: "Gratuit", value: "free" },
                                        { label: "Moins de 100€", value: "under100" },
                                        { label: "100€ - 500€", value: "100-500" },
                                        { label: "Plus de 500€", value: "over500" }
                                    ].map((range) => (
                                        <label key={range.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer">
                                            <Checkbox />
                                            <span>{range.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Filtre évaluations */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <Star className="h-5 w-5" />
                                    Évaluations
                                </h3>
                                <div className="space-y-3">
                                    {[5, 4, 3].map((rating) => (
                                        <label
                                            key={rating}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                                        >
                                            <Checkbox
                                                checked={selectedRatings.includes(rating)}
                                                onCheckedChange={() => toggleRating(rating)}
                                            />
                                            <div className="flex items-center gap-2 flex-1">
                                                <RatingStars rating={rating} />
                                                <span className="text-sm text-muted-foreground">& plus</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                ({Math.floor(Math.random() * 100) + 50})
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Bouton appliquer les filtres */}
                            <Button className="w-full" size="lg">
                                <Filter className="h-4 w-4 mr-2" />
                                Appliquer les filtres
                            </Button>
                        </div>
                    </div>

                    {/* Section produits */}
                    <div className="flex-1">
                        {/* En-tête résultats */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 p-4 bg-muted/50 rounded-xl">
                            <div>
                                <p className="text-muted-foreground">
                                    <span className="font-semibold text-foreground">{products.length}</span> produits trouvés
                                    {searchTerm && (
                                        <span> pour "<span className="font-semibold">{searchTerm}</span>"</span>
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">Trier par :</span>
                                <Select defaultValue="popular">
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="popular">Populaire</SelectItem>
                                        <SelectItem value="newest">Nouveauté</SelectItem>
                                        <SelectItem value="price-asc">Prix croissant</SelectItem>
                                        <SelectItem value="price-desc">Prix décroissant</SelectItem>
                                        <SelectItem value="rating">Meilleures notes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Grille de produits */}
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                                {products.map((product) => (
                                    <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 overflow-hidden">
                                        <CardHeader className="pb-4 relative">
                                            {/* Badges */}
                                            <div className="flex gap-2 absolute top-4 left-8 z-10">
                                                {product.tags?.map((tag, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        className={
                                                            tag === "Populaire"
                                                                ? "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800"
                                                                : tag === "Promo"
                                                                    ? "bg-green-500/10 text-green-600 border-green-200 dark:border-green-800"
                                                                    : "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800"
                                                        }
                                                    >
                                                        {tag === "Populaire" && <Sparkles className="h-3 w-3 mr-1" />}
                                                        {tag === "Promo" && <Tag className="h-3 w-3 mr-1" />}
                                                        {tag === "Nouveau" && <Zap className="h-3 w-3 mr-1" />}
                                                        {tag === "Essentiel" && <CheckCircle className="h-3 w-3 mr-1" />}
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            {/* Image produit */}
                                            <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                                                <Package className="h-12 w-12 text-muted-foreground/50" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>

                                            <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                                                {product.name}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-2 text-base">
                                                {product.description}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="pb-4 space-y-4">
                                            {/* Rating et catégorie */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <RatingStars rating={Math.floor(product.rating)} size="md" />
                                                    <span className="font-semibold">{product.rating}</span>
                                                    <span className="text-muted-foreground text-sm">
                                                        ({product.reviewCount})
                                                    </span>
                                                </div>
                                                <Badge variant="outline" className="bg-background/50">
                                                    {product.category}
                                                </Badge>
                                            </div>

                                            {/* Prix */}
                                            <div className="flex items-center gap-2">
                                                <div className="text-2xl font-bold text-foreground">
                                                    {product.price}
                                                </div>
                                                {product.originalPrice && (
                                                    <div className="text-lg text-muted-foreground line-through">
                                                        {product.originalPrice}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Features */}
                                            <div className="flex flex-wrap gap-2">
                                                {product.features?.slice(0, 2).map((feature, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs bg-background/50 flex items-center gap-1">
                                                        <CheckCircle className="h-3 w-3" />
                                                        {feature}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>

                                        <CardFooter>
                                            <Button asChild className="w-full h-12 text-base" size="lg">
                                                <Link href={`/client/catalogue/${product.id}`}>
                                                    <Plus className="h-5 w-5 mr-2" />
                                                    Voir les détails
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {products.map((product) => (
                                    <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50">
                                        <div className="flex flex-col lg:flex-row">
                                            <div className="lg:w-64 flex-shrink-0 p-6">
                                                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
                                                    <Package className="h-16 w-16 text-muted-foreground/50" />
                                                </div>
                                            </div>
                                            <div className="flex-1 p-6 lg:border-l">
                                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {product.tags?.map((tag, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="secondary"
                                                                    className="text-xs flex items-center gap-1"
                                                                >
                                                                    {tag === "Populaire" && <Sparkles className="h-3 w-3" />}
                                                                    {tag === "Promo" && <Tag className="h-3 w-3" />}
                                                                    {tag === "Nouveau" && <Zap className="h-3 w-3" />}
                                                                    {tag === "Essentiel" && <CheckCircle className="h-3 w-3" />}
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                        <CardTitle className="text-2xl group-hover:text-primary transition-colors mb-2">
                                                            {product.name}
                                                        </CardTitle>
                                                        <CardDescription className="text-base mb-3">
                                                            {product.description}
                                                        </CardDescription>
                                                    </div>
                                                    <div className="text-3xl font-bold text-foreground">
                                                        {product.price}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center gap-2">
                                                            <RatingStars rating={Math.floor(product.rating)} size="md" />
                                                            <span className="font-semibold">{product.rating}</span>
                                                            <span className="text-muted-foreground text-sm">
                                                                ({product.reviewCount} avis)
                                                            </span>
                                                        </div>
                                                        <Badge variant="outline" className="flex items-center gap-1">
                                                            {product.category === "Logiciels" && <Laptop className="h-3 w-3" />}
                                                            {product.category === "Productivité" && <Zap className="h-3 w-3" />}
                                                            {product.category === "Sécurité" && <Shield className="h-3 w-3" />}
                                                            {product.category}
                                                        </Badge>
                                                    </div>

                                                    <Button asChild size="lg">
                                                        <Link href={`/client/catalogue/${product.id}`}>
                                                            Voir les détails
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
