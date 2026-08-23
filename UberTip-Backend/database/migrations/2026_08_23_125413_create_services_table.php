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
        Schema::create('services', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('service_group_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->string('code', 7)->unique();
            $table->string('slug')->unique();
            $table->string('name_ar');
            $table->string('name_en');
            $table->text('description_ar');
            $table->unsignedSmallInteger('display_order');
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();

            $table->unique(['service_group_id', 'display_order']);
        });

        if (DB::getDriverName() === 'sqlite') {
            DB::unprepared("CREATE TRIGGER services_identity_immutable BEFORE UPDATE OF service_group_id, code, slug ON services FOR EACH ROW WHEN OLD.service_group_id IS NOT NEW.service_group_id OR OLD.code IS NOT NEW.code OR OLD.slug IS NOT NEW.slug BEGIN SELECT RAISE(ABORT, 'Public service identities are immutable'); END");
        } elseif (DB::getDriverName() === 'mysql') {
            DB::unprepared("CREATE TRIGGER services_identity_immutable BEFORE UPDATE ON services FOR EACH ROW BEGIN IF NOT (OLD.service_group_id <=> NEW.service_group_id) OR NOT (OLD.code <=> NEW.code) OR NOT (OLD.slug <=> NEW.slug) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Public service identities are immutable'; END IF; END");
        }
    }

    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS services_identity_immutable');
        Schema::dropIfExists('services');
    }
};
