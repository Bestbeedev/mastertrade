<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->foreignUuid('module_id')->nullable()->after('course_id')->constrained('course_modules')->onDelete('cascade');
            $table->unsignedInteger('position')->default(0)->after('title');
            $table->boolean('is_preview')->default(false)->after('type');
            $table->unsignedInteger('duration_seconds')->nullable()->after('is_preview');
        });
    }

    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropConstrainedForeignId('module_id');
            $table->dropColumn(['position', 'is_preview', 'duration_seconds']);
        });
    }
};
