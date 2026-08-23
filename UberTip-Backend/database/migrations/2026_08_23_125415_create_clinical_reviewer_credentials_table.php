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
        Schema::create('clinical_reviewer_credentials', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('supersedes_credential_id')
                ->nullable()
                ->constrained('clinical_reviewer_credentials')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('verified_by_user_id')->constrained('users')->cascadeOnUpdate()->restrictOnDelete();
            $table->string('status', 16)->index();
            $table->string('issuing_authority');
            $table->string('practice_scope', 64);
            $table->char('registration_hash', 64)->index();
            $table->string('verification_evidence_reference');
            $table->timestamp('verified_at');
            $table->timestamp('expires_at')->index();
            $table->timestamps();

            $table->unique('supersedes_credential_id');
        });

        $this->createImmutabilityTriggers();
    }

    public function down(): void
    {
        $this->dropImmutabilityTriggers();
        Schema::dropIfExists('clinical_reviewer_credentials');
    }

    private function createImmutabilityTriggers(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            DB::unprepared("CREATE TRIGGER clinical_reviewer_credentials_no_update BEFORE UPDATE ON clinical_reviewer_credentials BEGIN SELECT RAISE(ABORT, 'Clinical credential snapshots are immutable'); END");
            DB::unprepared("CREATE TRIGGER clinical_reviewer_credentials_no_delete BEFORE DELETE ON clinical_reviewer_credentials BEGIN SELECT RAISE(ABORT, 'Clinical credential snapshots are immutable'); END");

            return;
        }

        if (DB::getDriverName() === 'mysql') {
            DB::unprepared("CREATE TRIGGER clinical_reviewer_credentials_no_update BEFORE UPDATE ON clinical_reviewer_credentials FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Clinical credential snapshots are immutable'");
            DB::unprepared("CREATE TRIGGER clinical_reviewer_credentials_no_delete BEFORE DELETE ON clinical_reviewer_credentials FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Clinical credential snapshots are immutable'");
        }
    }

    private function dropImmutabilityTriggers(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS clinical_reviewer_credentials_no_update');
        DB::unprepared('DROP TRIGGER IF EXISTS clinical_reviewer_credentials_no_delete');
    }
};
