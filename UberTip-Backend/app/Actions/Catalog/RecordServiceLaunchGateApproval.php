<?php

declare(strict_types=1);

namespace App\Actions\Catalog;

use App\Enums\ServiceLaunchGateStatus;
use App\Enums\ServiceLaunchGateType;
use App\Models\ClinicalReviewerCredential;
use App\Models\ServiceDefinition;
use App\Models\ServiceLaunchGate;
use App\Models\User;
use Carbon\CarbonInterface;

final readonly class RecordServiceLaunchGateApproval
{
    public function __construct(
        private RecordServiceLaunchGateDecision $recordDecision,
    ) {}

    public function handle(
        ServiceDefinition $definition,
        ServiceLaunchGateType $type,
        User $actor,
        string $reason,
        string $evidenceReference,
        CarbonInterface $expiresAt,
        ?ClinicalReviewerCredential $clinicalCredential = null,
    ): ServiceLaunchGate {
        return $this->recordDecision->handle(
            $definition,
            $type,
            ServiceLaunchGateStatus::Approved,
            $actor,
            $reason,
            $evidenceReference,
            $expiresAt,
            $clinicalCredential,
        );
    }
}
