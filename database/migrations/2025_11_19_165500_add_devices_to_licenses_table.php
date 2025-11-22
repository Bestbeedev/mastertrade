<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('licenses', 'devices')) {
            Schema::table('licenses', function (Blueprint $table) {
                $table->json('devices')->nullable()->after('last_activated_at');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('licenses', 'devices')) {
            Schema::table('licenses', function (Blueprint $table) {
                $table->dropColumn('devices');
            });
        }
    }
};
