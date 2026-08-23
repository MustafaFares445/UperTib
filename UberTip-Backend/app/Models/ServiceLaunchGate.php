<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ServiceLaunchGateStatus;
use App\Enums\ServiceLaunchGateType;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Database\Factories\ServiceLaunchGateFactory;
use DomainException;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property ServiceLaunchGateType $type
 * @property int $sequence
 * @property ServiceLaunchGateStatus $status
 * @property int|null $approved_by_user_id
 * @property int|null $clinical_reviewer_credential_id
 * @property string $responsible_role
 * @property string|null $approved_content_hash
 * @property string|null $approval_evidence_reference
 * @property string|null $decision_reason
 * @property CarbonImmutable|null $decided_at
 * @property CarbonImmutable|null $expires_at
 * @property-read User|null $approvedBy
 * @property-read ClinicalReviewerCredential|null $clinicalReviewerCredential
 */
#[Guarded(['*'])]
final class ServiceLaunchGate extends Model
{
    /** @use HasFactory<ServiceLaunchGateFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        self::updating(static function (): never {
            throw new DomainException('Launch gate decisions are append-only.');
        });

        self::deleting(static function (): never {
            throw new DomainException('Launch gate decisions are append-only.');
        });
    }

    /**
     * @return BelongsTo<ServiceDefinition, $this>
     */
    public function serviceDefinition(): BelongsTo
    {
        return $this->belongsTo(ServiceDefinition::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by_user_id');
    }

    /**
     * @return BelongsTo<ClinicalReviewerCredential, $this>
     */
    public function clinicalReviewerCredential(): BelongsTo
    {
        return $this->belongsTo(ClinicalReviewerCredential::class);
    }

    public function isCurrentApproval(CarbonInterface $at, string $contentHash): bool
    {
        if (
            $this->status !== ServiceLaunchGateStatus::Approved
            || $this->approved_by_user_id === null
            || $this->responsible_role !== $this->type->responsibleRole()
            || $this->approved_content_hash === null
            || ! hash_equals($contentHash, $this->approved_content_hash)
            || $this->approval_evidence_reference === null
            || mb_trim($this->approval_evidence_reference) === ''
            || $this->decision_reason === null
            || mb_trim($this->decision_reason) === ''
            || ! $this->decided_at instanceof CarbonInterface
            || $this->decided_at->isAfter($at)
            || ($this->expires_at instanceof CarbonInterface && ! $this->expires_at->isAfter($at))
            || ($this->expires_at instanceof CarbonInterface && ! $this->expires_at->isAfter($this->decided_at))
        ) {
            return false;
        }

        if ($this->type !== ServiceLaunchGateType::Medical) {
            return $this->clinical_reviewer_credential_id === null;
        }

        $this->loadMissing(['approvedBy', 'clinicalReviewerCredential']);

        return $this->approvedBy instanceof User
            && $this->clinicalReviewerCredential instanceof ClinicalReviewerCredential
            && $this->clinicalReviewerCredential->isCurrentFor($this->approvedBy, $at);
    }

    public function sequenceNumber(): int
    {
        return $this->sequence;
    }

    public function type(): ServiceLaunchGateType
    {
        return $this->type;
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => ServiceLaunchGateType::class,
            'sequence' => 'integer',
            'status' => ServiceLaunchGateStatus::class,
            'approved_by_user_id' => 'integer',
            'clinical_reviewer_credential_id' => 'integer',
            'decided_at' => 'immutable_datetime',
            'expires_at' => 'immutable_datetime',
        ];
    }
}
