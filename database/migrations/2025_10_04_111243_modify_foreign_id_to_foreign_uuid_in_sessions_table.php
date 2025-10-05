<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sessions', function (Blueprint $table) {
            // 1️⃣ Modifier la colonne user_id en UUID
            $table->uuid('user_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sessions', function (Blueprint $table) {
            Schema::table('sessions', function (Blueprint $table) {
                // Retirer la contrainte
                $table->dropForeign(['user_id']);

                // Revenir à BIGINT si rollback
                $table->foreignId('user_id')->nullable()->index()->change();
            });
        });
    }
};
