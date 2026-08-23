<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_groups', function (Blueprint $table): void {
            $table->id();
            $table->string('code', 3)->unique();
            $table->string('name_ar');
            $table->string('name_en');
            $table->text('description_ar');
            $table->unsignedSmallInteger('display_order')->unique();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        if (DB::getDriverName() === 'sqlite') {
            DB::unprepared("CREATE TRIGGER service_groups_code_immutable BEFORE UPDATE OF code ON service_groups FOR EACH ROW WHEN OLD.code IS NOT NEW.code BEGIN SELECT RAISE(ABORT, 'Public service group codes are immutable'); END");
        } elseif (DB::getDriverName() === 'mysql') {
            DB::unprepared("CREATE TRIGGER service_groups_code_immutable BEFORE UPDATE ON service_groups FOR EACH ROW BEGIN IF NOT (OLD.code <=> NEW.code) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Public service group codes are immutable'; END IF; END");
        }
    }

    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS service_groups_code_immutable');
        Schema::dropIfExists('service_groups');
    }
};
