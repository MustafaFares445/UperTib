<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ClinicalReviewerCredentialStatus;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Database\Factories\ClinicalReviewerCredentialFactory;
use DomainException;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int|null $supersedes_credential_id
 * @property int $user_id
 * @property int $verified_by_user_id
 * @property ClinicalReviewerCredentialStatus $status
 * @property string $issuing_authority
 * @property string $practice_scope
 * @property string $registration_hash
 * @property string $verification_evidence_reference
 * @property CarbonImmutable $verified_at
 * @property CarbonImmutable $expires_at
 * @property-read ClinicalReviewerCredential|null $supersededBy
 */
#[Guarded(['*'])]
final class ClinicalReviewerCredential extends Model
{
    /** @use HasFactory<ClinicalReviewerCredentialFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        self::saving(function (ClinicalReviewerCredential $credential): void {
            if ($credential->user_id === $credential->verified_by_user_id) {
                throw new DomainException('A clinical credential requires independent verification.');
            }

            if ($credential->supersedes_credential_id !== null) {
                $prior = self::query()->find($credential->supersedes_credential_id);

                if (
                    ! $prior instanceof self
                    || $prior->user_id !== $credential->user_id
                    || $prior->registration_hash !== $credential->registration_hash
                ) {
                    throw new DomainException('A credential status snapshot must supersede the same license and reviewer.');
                }
            }
        });

        self::updating(static function (): never {
            throw new DomainException('A clinical credential snapshot is immutable.');
        });

        self::deleting(static function (): never {
            throw new DomainException('A clinical credential snapshot is immutable.');
        });
    }

    /**
     * @return HasOne<ClinicalReviewerCredential, $this>
     */
    public function supersededBy(): HasOne
    {
        return $this->hasOne(self::class, 'supersedes_credential_id');
    }

    public function isCurrentFor(User $reviewer, CarbonInterface $at): bool
    {
        $this->loadMissing('supersededBy');

        return $this->status === ClinicalReviewerCredentialStatus::Verified
            && ! $this->supersededBy instanceof self
            && $this->user_id === $reviewer->getKey()
            && $this->verified_by_user_id !== $this->user_id
            && mb_trim($this->issuing_authority) !== ''
            && $this->practice_scope === 'dentistry'
            && preg_match('/\A[a-f0-9]{64}\z/', $this->registration_hash) === 1
            && mb_trim($this->verification_evidence_reference) !== ''
            && ! $this->verified_at->isAfter($at)
            && $this->expires_at->isAfter($at);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'supersedes_credential_id' => 'integer',
            'user_id' => 'integer',
            'verified_by_user_id' => 'integer',
            'status' => ClinicalReviewerCredentialStatus::class,
            'verified_at' => 'immutable_datetime',
            'expires_at' => 'immutable_datetime',
        ];
    }
}
