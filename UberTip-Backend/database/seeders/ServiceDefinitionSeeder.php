<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\ServiceDefinitionAudience;
use App\Enums\ServiceDefinitionStatus;
use App\Models\Service;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;

final class ServiceDefinitionSeeder extends Seeder
{
    public function run(): void
    {
        Service::query()
            ->orderBy('id')
            ->each(function (Service $service): void {
                $service->serviceDefinitions()->firstOrCreate(
                    ['version' => 1],
                    [
                        'status' => ServiceDefinitionStatus::Active,
                        'audience' => ServiceDefinitionAudience::Evaluation,
                        'source_reference' => 'UberTib-SRS-v1.1-section-5',
                        'definition' => $this->definitionFor($service),
                        'effective_from' => CarbonImmutable::parse('2026-08-22 21:00:00', 'UTC'),
                        'effective_until' => null,
                    ],
                );
            });
    }

    /**
     * @return array<string, mixed>
     */
    private function definitionFor(Service $service): array
    {
        return [
            'schema_version' => 1,
            'patient_purpose_ar' => $service->description_ar,
            'clinical_review_state' => 'pending',
            'risk' => [
                'tier' => 'pending_clinical_review',
            ],
            'doctor_requirements' => [],
            'branch_requirements' => [],
            'required_evidence' => [],
            'follow_up_rules' => [],
            'completion_rules' => [],
            'reference_price' => null,
            'protection' => [
                'level' => 'none',
                'funded' => false,
            ],
            'complaint_refund_escalation_rules' => [],
        ];
    }
}
