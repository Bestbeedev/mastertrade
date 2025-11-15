<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'MasterAdogbe',
                'sku' => 'MA-001',
                'version' => '1.0.0',
                'checksum' => hash('sha256', 'MasterAdogbe@1.0.0'),
                'size' => 120,
                'changelog' => "- Première version\n- Gestion des clients et ventes\n- Rapports de base",
                'description' => 'Solution de gestion commerciale et administrative adaptée aux PME.',
                'category' => 'Gestion Professionnelle',
            ],
            [
                'name' => 'MasterImmo',
                'sku' => 'MI-001',
                'version' => '1.0.0',
                'checksum' => hash('sha256', 'MasterImmo@1.0.0'),
                'size' => 150,
                'changelog' => "- Première version\n- Gestion des biens, locataires, loyers\n- Contrats et quittances",
                'description' => 'Logiciel de gestion immobilière pour administrer biens, baux et loyers.',
                'category' => 'Immobilier',
            ],
            [
                'name' => 'MasterTrade',
                'sku' => 'MT-001',
                'version' => '1.0.0',
                'checksum' => hash('sha256', 'MasterTrade@1.0.0'),
                'size' => 180,
                'changelog' => "- Première version\n- Catalogue, commandes, facturation\n- Tableau de bord",
                'description' => 'Gestion des ventes, achats et facturation avec analyses en temps réel.',
                'category' => 'Commerce',
            ],
            [
                'name' => 'MasterStock',
                'sku' => 'MS-001',
                'version' => '1.0.0',
                'checksum' => hash('sha256', 'MasterStock@1.0.0'),
                'size' => 140,
                'changelog' => "- Première version\n- Suivi des stocks et alertes\n- Inventaires",
                'description' => 'Suivi des stocks, mouvements et inventaires pour entrepôts et boutiques.',
                'category' => 'Logistique',
            ],
            [
                'name' => 'Ecosoft',
                'sku' => 'EC-001',
                'version' => '1.0.0',
                'checksum' => hash('sha256', 'Ecosoft@1.0.0'),
                'size' => 200,
                'changelog' => "- Première version\n- Scolarité, notes, emplois du temps\n- Portail parents/élèves",
                'description' => 'Suite de gestion scolaire pour établissements et centres de formation.',
                'category' => 'Éducation & Scolarité',
            ],
        ];

        foreach ($products as $data) {
            Product::updateOrCreate(
                ['sku' => $data['sku']],
                $data
            );
        }
    }
}
