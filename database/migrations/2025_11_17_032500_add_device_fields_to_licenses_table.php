<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('licenses', function (Blueprint $table) {
            $table->string('last_device_id')->nullable()->after('activations_count');
            $table->string('last_machine')->nullable()->after('last_device_id');
            $table->string('last_mac_address')->nullable()->after('last_machine');
            $table->timestamp('last_activated_at')->nullable()->after('last_mac_address');
        });
    }

    public function down(): void
    {
        Schema::table('licenses', function (Blueprint $table) {
            $table->dropColumn(['last_device_id', 'last_machine', 'last_mac_address', 'last_activated_at']);
        });
    }
};
