<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1) Créer d'abord les rôles via le RoleSeeder
        $this->call([
            \Database\Seeders\RoleSeeder::class,
        ]);

        // 2) Récupérer l'id UUID du rôle CLIENT créé par RoleSeeder
        $clientRoleId = Role::where('name', 'CLIENT')->value('id');

        // (sécurité) Si pour une raison quelconque le ROLE n'existe pas, on le crée ici
        if (! $clientRoleId) {
            $client = Role::create([
                'id' => Str::uuid(),
                'name' => 'CLIENT',
                'permissions' => json_encode(['download' => true, 'view_courses' => true]),
            ]);
            $clientRoleId = $client->id;
        }

        // 3) Créer l'utilisateur en lui attribuant role_id
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role_id' => $clientRoleId,
            ]
        );

        // 4) Les autres seeders — ProductSeeder (ou autres) après les rôles si nécessaire
        $this->call([
            \Database\Seeders\ProductSeeder::class,
        ]);
    }
}
