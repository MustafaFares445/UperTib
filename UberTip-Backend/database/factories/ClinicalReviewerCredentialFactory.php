<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ClinicalReviewerCredentialStatus;
use App\Models\ClinicalReviewerCredential;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ClinicalReviewerCredential>
 */
final class ClinicalReviewerCredentialFactory extends Factory
{
    public function definition(): array
    {
        return [
            'supersedes_credential_id' => null,
            'user_id' => User::factory(),
            'verified_by_user_id' => User::factory(),
            'status' => ClinicalReviewerCredentialStatus::Verified,
            'issuing_authority' => 'Syrian dental licensing authority test fixture',
            'practice_scope' => 'dentistry',
            'registration_hash' => hash('sha256', fake()->unique()->uuid()),
            'verification_evidence_reference' => 'credential-evidence/'.fake()->unique()->uuid(),
            'verified_at' => now()->subDay(),
            'expires_at' => now()->addYear(),
        ];
    }
}
