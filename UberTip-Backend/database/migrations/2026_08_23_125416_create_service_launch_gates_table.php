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
        Schema::create('service_launch_gates', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('service_definition_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->string('type', 16);
            $table->unsignedInteger('sequence');
            $table->string('status', 16)->index();
            $table->foreignId('approved_by_user_id')
                ->nullable()
                ->constrained('users')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->foreignId('clinical_reviewer_credential_id')
                ->nullable()
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->string('responsible_role', 64);
            $table->char('approved_content_hash', 64)->nullable();
            $table->string('approval_evidence_reference')->nullable();
            $table->text('decision_reason')->nullable();
            $table->timestamp('decided_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();

            $table->unique(['service_definition_id', 'type', 'sequence']);
            $table->index(['service_definition_id', 'type', 'id']);
        });

        $this->createImmutabilityTriggers();
    }

    public function down(): void
    {
        $this->dropImmutabilityTriggers();
        Schema::dropIfExists('service_launch_gates');
    }

    private function createImmutabilityTriggers(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            DB::unprepared("CREATE TRIGGER service_launch_gates_no_update BEFORE UPDATE ON service_launch_gates BEGIN SELECT RAISE(ABORT, 'Launch gate decisions are append-only'); END");
            DB::unprepared("CREATE TRIGGER service_launch_gates_no_delete BEFORE DELETE ON service_launch_gates BEGIN SELECT RAISE(ABORT, 'Launch gate decisions are append-only'); END");

            return;
        }

        if (DB::getDriverName() === 'mysql') {
            DB::unprepared("CREATE TRIGGER service_launch_gates_no_update BEFORE UPDATE ON service_launch_gates FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Launch gate decisions are append-only'");
            DB::unprepared("CREATE TRIGGER service_launch_gates_no_delete BEFORE DELETE ON service_launch_gates FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Launch gate decisions are append-only'");
        }
    }

    private function dropImmutabilityTriggers(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS service_launch_gates_no_update');
        DB::unprepared('DROP TRIGGER IF EXISTS service_launch_gates_no_delete');
    }
};
