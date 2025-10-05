import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Search, Filter, Grid, List, Star, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

    const products = [
        {
            id: 1,
            name: "Application de Gestion",
            description: "Solution complète de gestion d'entreprise avec modules intégrés",
            price: "299€",
            category: "Logiciels",
            image: "/images/app-gestion.jpg",
            rating: 4.5,
            reviewCount: 124,
            tags: ["Populaire", "Nouveau"]
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
            tags: ["Essentiel"]
        },
    ];

    const categories = [
        { id: 'all', name: 'Tous les produits', count: 12 },
        { id: 'logiciels', name: 'Logiciels', count: 5 },
        { id: 'productivite', name: 'Productivité', count: 4 },
        { id: 'securite', name: 'Sécurité', count: 3 },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Catalogue" />

            {/* En-tête */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Catalogue</h1>
                            <p className="text-muted-foreground mt-2">
                                Découvrez nos solutions logicielles professionnelles
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher un produit..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

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

                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Filtres
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu principal */}
            <div className="container px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Navigation latérale */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="space-y-6">
                            {/* Catégories */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Catégories</h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setActiveCategory(category.id)}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                                                activeCategory === category.id
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-accent'
                                            }`}
                                        >
                                            <span>{category.name}</span>
                                            <Badge variant="secondary" className={
                                                activeCategory === category.id
                                                    ? 'bg-primary-foreground text-primary'
                                                    : ''
                                            }>
                                                {category.count}
                                            </Badge>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filtres */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Filtres</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Prix</label>
                                        <Tabs defaultValue="all" className="w-full">
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="all">Tous</TabsTrigger>
                                                <TabsTrigger value="paid">Payants</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Évaluations</label>
                                        <div className="space-y-2">
                                            {[4, 3, 2].map((rating) => (
                                                <label key={rating} className="flex items-center gap-2 text-sm">
                                                    <input type="checkbox" className="rounded" />
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-3 w-3 ${
                                                                    i < rating
                                                                        ? 'fill-yellow-400 text-yellow-400'
                                                                        : 'text-muted-foreground'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-muted-foreground">& plus</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grille de produits */}
                    <div className="flex-1">
                        {/* En-tête des résultats */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-muted-foreground">
                                {products.length} produits trouvés
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Trier par :</span>
                                <select className="bg-background border rounded-md px-3 py-1 text-sm">
                                    <option>Populaire</option>
                                    <option>Nouveauté</option>
                                    <option>Prix croissant</option>
                                    <option>Prix décroissant</option>
                                </select>
                            </div>
                        </div>

                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <Card key={product.id} className="group hover:shadow-lg transition-all">
                                        <CardHeader className="pb-4">
                                            <div className="relative">
                                                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                                                    <div className="text-muted-foreground">Image produit</div>
                                                </div>
                                                <div className="flex gap-2 absolute top-3 left-3">
                                                    {product.tags?.map((tag, index) => (
                                                        <Badge key={index} variant="secondary" className={
                                                            tag === "Populaire"
                                                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                                        }>
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                                {product.name}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {product.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pb-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-medium">{product.rating}</span>
                                                    <span className="text-muted-foreground text-sm">
                                                        ({product.reviewCount})
                                                    </span>
                                                </div>
                                                <Badge variant="outline">{product.category}</Badge>
                                            </div>
                                            <div className="text-2xl font-bold text-foreground">
                                                {product.price}
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button asChild className="w-full">
                                                <Link href={`/client/catalogue/${product.id}`}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Voir les détails
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {products.map((product) => (
                                    <Card key={product.id} className="group hover:shadow-lg transition-all">
                                        <div className="flex">
                                            <div className="w-48 flex-shrink-0 p-6">
                                                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                                    <div className="text-muted-foreground text-sm">Image</div>
                                                </div>
                                            </div>
                                            <div className="flex-1 p-6 border-l">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <CardTitle className="text-xl group-hover:text-primary transition-colors mb-2">
                                                            {product.name}
                                                        </CardTitle>
                                                        <CardDescription className="mb-3">
                                                            {product.description}
                                                        </CardDescription>
                                                    </div>
                                                    <div className="text-2xl font-bold text-foreground">
                                                        {product.price}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                            <span className="font-medium">{product.rating}</span>
                                                            <span className="text-muted-foreground text-sm">
                                                                ({product.reviewCount})
                                                            </span>
                                                        </div>
                                                        <Badge variant="outline">{product.category}</Badge>
                                                        {product.tags?.map((tag, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    <Button asChild>
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
    )
}
