<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->text('what_you_will_learn')->nullable()->after('intro');
            $table->text('requirements')->nullable()->after('what_you_will_learn');
            $table->text('audience')->nullable()->after('requirements');
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['what_you_will_learn', 'requirements', 'audience']);
        });
    }
};
