<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\ServiceLaunchGateStatus;
use App\Enums\ServiceLaunchGateType;
use App\Models\ServiceDefinition;
use Illuminate\Database\Seeder;

final class ServiceLaunchGateSeeder extends Seeder
{
    public function run(): void
    {
        ServiceDefinition::query()
            ->orderBy('id')
            ->each(function (ServiceDefinition $serviceDefinition): void {
                foreach (ServiceLaunchGateType::cases() as $type) {
                    $serviceDefinition->launchGates()->firstOrCreate(
                        ['type' => $type, 'sequence' => 1],
                        [
                            'status' => ServiceLaunchGateStatus::Pending,
                            'approved_by_user_id' => null,
                            'clinical_reviewer_credential_id' => null,
                            'responsible_role' => $type->responsibleRole(),
                            'approved_content_hash' => null,
                            'approval_evidence_reference' => null,
                            'decision_reason' => null,
                            'decided_at' => null,
                            'expires_at' => null,
                        ],
                    );
                }
            });
    }
}
