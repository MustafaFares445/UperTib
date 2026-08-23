<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ServiceLaunchGateStatus;
use App\Enums\ServiceLaunchGateType;
use App\Models\ClinicalReviewerCredential;
use App\Models\ServiceDefinition;
use App\Models\ServiceLaunchGate;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceLaunchGate>
 */
final class ServiceLaunchGateFactory extends Factory
{
    public function definition(): array
    {
        $type = ServiceLaunchGateType::Medical;

        return [
            'service_definition_id' => ServiceDefinition::factory(),
            'type' => $type,
            'sequence' => 1,
            'status' => ServiceLaunchGateStatus::Pending,
            'approved_by_user_id' => null,
            'clinical_reviewer_credential_id' => null,
            'responsible_role' => $type->responsibleRole(),
            'approved_content_hash' => null,
            'approval_evidence_reference' => null,
            'decision_reason' => null,
            'decided_at' => null,
            'expires_at' => null,
        ];
    }

    public function forType(ServiceLaunchGateType $type): static
    {
        return $this->state(fn (): array => [
            'type' => $type,
            'responsible_role' => $type->responsibleRole(),
        ]);
    }

    public function approved(
        ServiceDefinition $definition,
        User $approvedBy,
        ?ClinicalReviewerCredential $credential = null,
    ): static {
        return $this->state(fn (): array => [
            'service_definition_id' => $definition->getKey(),
            'sequence' => 2,
            'status' => ServiceLaunchGateStatus::Approved,
            'approved_by_user_id' => $approvedBy->getKey(),
            'clinical_reviewer_credential_id' => $credential?->getKey(),
            'approved_content_hash' => $definition->content_hash,
            'approval_evidence_reference' => 'gate-evidence/'.fake()->unique()->uuid(),
            'decision_reason' => 'Approved for automated behavioral verification.',
            'decided_at' => now()->subMinute(),
            'expires_at' => now()->addYear(),
        ]);
    }
}
