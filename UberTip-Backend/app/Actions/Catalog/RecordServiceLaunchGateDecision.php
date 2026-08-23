<?php

declare(strict_types=1);

namespace App\Actions\Catalog;

use App\Enums\ServiceLaunchGateStatus;
use App\Enums\ServiceLaunchGateType;
use App\Models\ClinicalReviewerCredential;
use App\Models\ServiceDefinition;
use App\Models\ServiceLaunchGate;
use App\Models\User;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use DomainException;
use Illuminate\Support\Facades\DB;

final readonly class RecordServiceLaunchGateDecision
{
    public function handle(
        ServiceDefinition $definition,
        ServiceLaunchGateType $type,
        ServiceLaunchGateStatus $status,
        User $actor,
        string $reason,
        string $evidenceReference,
        ?CarbonInterface $expiresAt = null,
        ?ClinicalReviewerCredential $clinicalCredential = null,
    ): ServiceLaunchGate {
        $now = CarbonImmutable::now();

        if (mb_trim($reason) === '' || mb_trim($evidenceReference) === '') {
            throw new DomainException('A launch gate decision requires a reason and evidence reference.');
        }

        if ($status === ServiceLaunchGateStatus::Pending) {
            throw new DomainException('Pending is not an accountable launch gate decision.');
        }

        if ($status === ServiceLaunchGateStatus::Approved) {
            if (! $expiresAt instanceof CarbonInterface || ! $expiresAt->isAfter($now)) {
                throw new DomainException('An approval expiry must be in the future.');
            }

            if ($type === ServiceLaunchGateType::Medical) {
                if (
                    ! $clinicalCredential instanceof ClinicalReviewerCredential
                    || ! $clinicalCredential->isCurrentFor($actor, $now)
                ) {
                    throw new DomainException('Medical approval requires a current verified dental credential.');
                }
            } elseif ($clinicalCredential instanceof ClinicalReviewerCredential) {
                throw new DomainException('Only the medical gate accepts a clinical credential.');
            }
        } elseif (
            $expiresAt instanceof CarbonInterface
            || $clinicalCredential instanceof ClinicalReviewerCredential
        ) {
            throw new DomainException('A non-approval decision cannot carry approval expiry or credential data.');
        }

        return DB::transaction(function () use (
            $definition,
            $type,
            $status,
            $actor,
            $reason,
            $evidenceReference,
            $expiresAt,
            $clinicalCredential,
            $now,
        ): ServiceLaunchGate {
            $lockedDefinition = ServiceDefinition::query()
                ->whereKey($definition->getKey())
                ->lockForUpdate()
                ->sole();
            $latestDecision = $lockedDefinition->launchGates()
                ->where('type', $type)
                ->orderByDesc('sequence')
                ->first();
            $sequence = $latestDecision instanceof ServiceLaunchGate
                ? $latestDecision->sequenceNumber() + 1
                : 1;

            return ServiceLaunchGate::unguarded(
                fn (): ServiceLaunchGate => $lockedDefinition->launchGates()->create([
                    'type' => $type,
                    'sequence' => $sequence,
                    'status' => $status,
                    'approved_by_user_id' => $actor->getKey(),
                    'clinical_reviewer_credential_id' => $clinicalCredential?->getKey(),
                    'responsible_role' => $type->responsibleRole(),
                    'approved_content_hash' => $lockedDefinition->contentHash(),
                    'approval_evidence_reference' => $evidenceReference,
                    'decision_reason' => $reason,
                    'decided_at' => $now,
                    'expires_at' => $expiresAt,
                ]),
            );
        });
    }
}
