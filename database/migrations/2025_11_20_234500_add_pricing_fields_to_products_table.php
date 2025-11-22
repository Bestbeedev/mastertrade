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
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'price_cents')) {
                $table->integer('price_cents')->default(0)->after('description');
            }
            if (!Schema::hasColumn('products', 'requires_license')) {
                $table->boolean('requires_license')->default(false)->after('price_cents');
            }
            if (!Schema::hasColumn('products', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('requires_license');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'is_active')) {
                $table->dropColumn('is_active');
            }
            if (Schema::hasColumn('products', 'requires_license')) {
                $table->dropColumn('requires_license');
            }
            if (Schema::hasColumn('products', 'price_cents')) {
                $table->dropColumn('price_cents');
            }
        });
    }
};
