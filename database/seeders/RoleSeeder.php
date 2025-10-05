<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'ADMIN', 'permissions' => json_encode(['all' => true])],
            ['name' => 'CLIENT', 'permissions' => json_encode(['download' => true, 'view_courses' => true])],
            ['name' => 'SUPPORT', 'permissions' => json_encode(['manage_tickets' => true])],
            ['name' => 'MANAGER', 'permissions' => json_encode(['view_reports' => true])],
        ];

        foreach ($roles as $role) {
            Role::create([
                'id' => Str::uuid(), // UUID si tu utilises le trait
                'name' => $role['name'],
                'permissions' => $role['permissions'],
            ]);
        }
    }
}
