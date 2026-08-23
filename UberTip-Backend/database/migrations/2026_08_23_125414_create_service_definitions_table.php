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
        Schema::create('service_definitions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('service_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->unsignedInteger('version');
            $table->string('status', 24)->index();
            $table->string('audience', 16)->index();
            $table->string('source_reference');
            $table->json('definition');
            $table->char('content_hash', 64)->index();
            $table->timestamp('effective_from')->nullable();
            $table->timestamp('effective_until')->nullable();
            $table->timestamps();

            $table->unique(['service_id', 'version']);
            $table->index(['status', 'audience']);
        });

        $this->createIntegrityTriggers();
    }

    public function down(): void
    {
        $this->dropIntegrityTriggers();
        Schema::dropIfExists('service_definitions');
    }

    private function createIntegrityTriggers(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            DB::unprepared(<<<'SQL'
                CREATE TRIGGER service_definitions_guard_non_funded_insert
                BEFORE INSERT ON service_definitions
                FOR EACH ROW
                WHEN json_extract(NEW.definition, '$.protection.funded') = 1
                BEGIN
                    SELECT RAISE(ABORT, 'Funded protection is forbidden in UberTib V1');
                END
                SQL);
            DB::unprepared(<<<'SQL'
                CREATE TRIGGER service_definitions_guard_non_funded_update
                BEFORE UPDATE ON service_definitions
                FOR EACH ROW
                WHEN json_extract(NEW.definition, '$.protection.funded') = 1
                BEGIN
                    SELECT RAISE(ABORT, 'Funded protection is forbidden in UberTib V1');
                END
                SQL);
            DB::unprepared(<<<'SQL'
                CREATE TRIGGER service_definitions_guard_update
                BEFORE UPDATE ON service_definitions
                FOR EACH ROW
                WHEN (
                    OLD.status IN ('active', 'retired', 'superseded')
                    AND (
                        OLD.service_id IS NOT NEW.service_id
                        OR OLD.version IS NOT NEW.version
                        OR OLD.audience IS NOT NEW.audience
                        OR OLD.source_reference IS NOT NEW.source_reference
                        OR OLD.definition IS NOT NEW.definition
                        OR OLD.content_hash IS NOT NEW.content_hash
                        OR OLD.effective_from IS NOT NEW.effective_from
                    )
                ) OR (
                    OLD.status = 'active'
                    AND NEW.status NOT IN ('active', 'retired', 'superseded')
                ) OR (
                    OLD.status IN ('retired', 'superseded')
                    AND NEW.status IS NOT OLD.status
                )
                BEGIN
                    SELECT RAISE(ABORT, 'Activated service definitions are immutable');
                END
                SQL);
            DB::unprepared(<<<'SQL'
                CREATE TRIGGER service_definitions_guard_delete
                BEFORE DELETE ON service_definitions
                FOR EACH ROW
                WHEN OLD.status <> 'draft'
                BEGIN
                    SELECT RAISE(ABORT, 'Only draft service definitions may be deleted');
                END
                SQL);

            return;
        }

        if (DB::getDriverName() === 'mysql') {
            DB::unprepared(<<<'SQL'
                CREATE TRIGGER service_definitions_guard_non_funded_insert
                BEFORE INSERT ON service_definitions
                FOR EACH ROW
                BEGIN
                    IF JSON_UNQUOTE(JSON_EXTRACT(NEW.definition, '$.protection.funded')) = 'true' THEN
                        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Funded protection is forbidden in UberTib V1';
                    END IF;
                END
                SQL);
            DB::unprepared(<<<'SQL'
                CREATE TRIGGER service_definitions_guard_non_funded_update
                BEFORE UPDATE ON service_definitions
                FOR EACH ROW
                BEGIN
                    IF JSON_UNQUOTE(JSON_EXTRACT(NEW.definition, '$.protection.funded')) = 'true' THEN
                        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Funded protection is forbidden in UberTib V1';
                    END IF;
                END
                SQL);
            DB::unprepared(<<<'SQL'
                CREATE TRIGGER service_definitions_guard_update
                BEFORE UPDATE ON service_definitions
                FOR EACH ROW
                BEGIN
                    IF (
                        OLD.status IN ('active', 'retired', 'superseded')
                        AND (
                            NOT (OLD.service_id <=> NEW.service_id)
                            OR NOT (OLD.version <=> NEW.version)
                            OR NOT (OLD.audience <=> NEW.audience)
                            OR NOT (OLD.source_reference <=> NEW.source_reference)
                            OR NOT (OLD.definition <=> NEW.definition)
                            OR NOT (OLD.content_hash <=> NEW.content_hash)
                            OR NOT (OLD.effective_from <=> NEW.effective_from)
                        )
                    ) OR (
                        OLD.status = 'active'
                        AND NEW.status NOT IN ('active', 'retired', 'superseded')
                    ) OR (
                        OLD.status IN ('retired', 'superseded')
                        AND NOT (NEW.status <=> OLD.status)
                    ) THEN
                        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Activated service definitions are immutable';
                    END IF;
                END
                SQL);
            DB::unprepared(<<<'SQL'
                CREATE TRIGGER service_definitions_guard_delete
                BEFORE DELETE ON service_definitions
                FOR EACH ROW
                BEGIN
                    IF OLD.status <> 'draft' THEN
                        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Only draft service definitions may be deleted';
                    END IF;
                END
                SQL);
        }
    }

    private function dropIntegrityTriggers(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS service_definitions_guard_non_funded_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS service_definitions_guard_non_funded_update');
        DB::unprepared('DROP TRIGGER IF EXISTS service_definitions_guard_update');
        DB::unprepared('DROP TRIGGER IF EXISTS service_definitions_guard_delete');
    }
};
