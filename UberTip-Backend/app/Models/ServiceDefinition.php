<?php

declare(strict_types=1);

namespace App\Models;

use App\Domain\Catalog\ServiceDefinitionPayload;
use App\Enums\ServiceDefinitionAudience;
use App\Enums\ServiceDefinitionStatus;
use App\Enums\ServiceLaunchGateType;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Database\Factories\ServiceDefinitionFactory;
use DomainException;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use UnexpectedValueException;

/**
 * @property int $service_id
 * @property int $version
 * @property ServiceDefinitionStatus $status
 * @property ServiceDefinitionAudience $audience
 * @property array<array-key, mixed> $definition
 * @property string $content_hash
 * @property CarbonImmutable|null $effective_from
 * @property CarbonImmutable|null $effective_until
 */
#[Fillable([
    'service_id',
    'version',
    'status',
    'audience',
    'source_reference',
    'definition',
    'effective_from',
    'effective_until',
])]
final class ServiceDefinition extends Model
{
    /** @use HasFactory<ServiceDefinitionFactory> */
    use HasFactory;

    private const array IMMUTABLE_AFTER_ACTIVATION = [
        'service_id',
        'version',
        'audience',
        'source_reference',
        'definition',
        'effective_from',
    ];

    private ?CarbonInterface $catalogEvaluationTime = null;

    protected static function booted(): void
    {
        self::saving(function (ServiceDefinition $serviceDefinition): void {
            $serviceDefinition->validateLifecycle();
            $serviceDefinition->validateNonFinancialBoundary();

            if ($serviceDefinition->isDirty('definition')) {
                $definition = $serviceDefinition->definitionPayload();
                $serviceDefinition->setAttribute('content_hash', self::hashDefinition($definition));
            }

            if (
                $serviceDefinition->status() === ServiceDefinitionStatus::Active
                && $serviceDefinition->audience() === ServiceDefinitionAudience::Production
                && ! $serviceDefinition->hasCompleteProductionCard()
            ) {
                throw new DomainException('An active production definition requires a complete approved service card.');
            }
        });

        self::updating(function (ServiceDefinition $serviceDefinition): void {
            $originalStatus = $serviceDefinition->originalStatus();

            if (
                in_array(
                    $originalStatus,
                    [
                        ServiceDefinitionStatus::Active,
                        ServiceDefinitionStatus::Retired,
                        ServiceDefinitionStatus::Superseded,
                    ],
                    true,
                )
                && $serviceDefinition->isDirty(self::IMMUTABLE_AFTER_ACTIVATION)
            ) {
                throw new DomainException('An activated service definition is immutable.');
            }

            $allowedStatuses = match ($originalStatus) {
                ServiceDefinitionStatus::Draft => [
                    ServiceDefinitionStatus::Draft,
                    ServiceDefinitionStatus::Reviewed,
                ],
                ServiceDefinitionStatus::Reviewed => [
                    ServiceDefinitionStatus::Draft,
                    ServiceDefinitionStatus::Reviewed,
                    ServiceDefinitionStatus::Scheduled,
                ],
                ServiceDefinitionStatus::Scheduled => [
                    ServiceDefinitionStatus::Reviewed,
                    ServiceDefinitionStatus::Scheduled,
                    ServiceDefinitionStatus::Active,
                ],
                ServiceDefinitionStatus::Active => [
                    ServiceDefinitionStatus::Active,
                    ServiceDefinitionStatus::Retired,
                    ServiceDefinitionStatus::Superseded,
                ],
                ServiceDefinitionStatus::Retired => [ServiceDefinitionStatus::Retired],
                ServiceDefinitionStatus::Superseded => [ServiceDefinitionStatus::Superseded],
            };

            if (! in_array($serviceDefinition->status(), $allowedStatuses, true)) {
                throw new DomainException('The service definition lifecycle transition is not allowed.');
            }
        });

        self::deleting(function (ServiceDefinition $serviceDefinition): void {
            if ($serviceDefinition->status() !== ServiceDefinitionStatus::Draft) {
                throw new DomainException('Only a draft service definition may be deleted.');
            }
        });
    }

    /**
     * @return BelongsTo<Service, $this>
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * @return HasMany<ServiceLaunchGate, $this>
     */
    public function launchGates(): HasMany
    {
        return $this->hasMany(ServiceLaunchGate::class)->orderBy('sequence');
    }

    public function useCatalogEvaluationTime(CarbonInterface $at): self
    {
        $this->catalogEvaluationTime = $at;

        return $this;
    }

    public function isEligibleForProductionPublication(?CarbonInterface $at = null): bool
    {
        if (
            $this->audience() !== ServiceDefinitionAudience::Production
            || ! $this->hasCompleteProductionCard()
            || $this->hasFundedProtection()
        ) {
            return false;
        }

        return $this->hasCurrentLaunchApprovals($at ?? $this->evaluationTime());
    }

    public function isProductionReady(?CarbonInterface $at = null): bool
    {
        $evaluatedAt = $at ?? $this->evaluationTime();

        return $this->isPublishedAt($evaluatedAt)
            && $this->isEligibleForProductionPublication($evaluatedAt);
    }

    public function clinicalReviewState(?CarbonInterface $at = null): string
    {
        if (data_get($this->definitionPayload(), 'clinical_review_state') !== 'approved') {
            return 'pending';
        }

        $medicalGate = $this->currentLaunchGate(ServiceLaunchGateType::Medical);

        return $medicalGate instanceof ServiceLaunchGate
            && $medicalGate->isCurrentApproval($at ?? $this->evaluationTime(), $this->contentHash())
                ? 'approved'
                : 'pending';
    }

    public function hasCompleteProductionCard(): bool
    {
        return ServiceDefinitionPayload::isCompleteForProduction($this->definitionPayload());
    }

    public function hasFundedProtection(): bool
    {
        return data_get($this->definitionPayload(), 'protection.funded') === true;
    }

    public function contentHash(): string
    {
        return $this->content_hash;
    }

    public function versionNumber(): int
    {
        return $this->version;
    }

    public function serviceId(): int
    {
        return $this->service_id;
    }

    public function status(): ServiceDefinitionStatus
    {
        return $this->status;
    }

    public function audience(): ServiceDefinitionAudience
    {
        return $this->audience;
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'version' => 'integer',
            'status' => ServiceDefinitionStatus::class,
            'audience' => ServiceDefinitionAudience::class,
            'definition' => 'array',
            'effective_from' => 'immutable_datetime',
            'effective_until' => 'immutable_datetime',
        ];
    }

    private function hasCurrentLaunchApprovals(CarbonInterface $at): bool
    {
        foreach (ServiceLaunchGateType::cases() as $type) {
            $gate = $this->currentLaunchGate($type);

            if (
                ! $gate instanceof ServiceLaunchGate
                || ! $gate->isCurrentApproval($at, $this->contentHash())
            ) {
                return false;
            }
        }

        return true;
    }

    private function currentLaunchGate(ServiceLaunchGateType $type): ?ServiceLaunchGate
    {
        $this->loadMissing('launchGates');

        return $this->launchGates
            ->filter(
                static fn (ServiceLaunchGate $gate): bool => $gate->type() === $type,
            )
            ->sortByDesc(
                static fn (ServiceLaunchGate $gate): int => $gate->sequenceNumber(),
            )
            ->first();
    }

    /**
     * @return array<array-key, mixed>
     */
    private function definitionPayload(): array
    {
        $definition = $this->getAttribute('definition');

        if (! is_array($definition)) {
            throw new DomainException('Service definition content must be an array.');
        }

        return $definition;
    }

    private function evaluationTime(): CarbonInterface
    {
        return $this->catalogEvaluationTime ?? now()->toImmutable();
    }

    private function isPublishedAt(CarbonInterface $at): bool
    {
        if (! in_array(
            $this->status(),
            [ServiceDefinitionStatus::Active, ServiceDefinitionStatus::Superseded],
            true,
        )) {
            return false;
        }

        if (
            $this->effective_from instanceof CarbonInterface
            && $this->effective_from->isAfter($at)
        ) {
            return false;
        }

        return ! $this->effective_until instanceof CarbonInterface
            || $this->effective_until->isAfter($at);
    }

    private function validateNonFinancialBoundary(): void
    {
        if (config('ubertib.financial_mode') !== 'record_only_non_funded') {
            throw new DomainException('UberTib V1 requires the record-only non-funded financial mode.');
        }

        if ($this->hasFundedProtection()) {
            throw new DomainException('Funded protection is forbidden in UberTib V1.');
        }
    }

    private function validateLifecycle(): void
    {
        if ($this->versionNumber() < 1) {
            throw new DomainException('A service definition version must be at least one.');
        }

        if (
            $this->effective_from instanceof CarbonInterface
            && $this->effective_until instanceof CarbonInterface
            && $this->effective_until->lessThanOrEqualTo($this->effective_from)
        ) {
            throw new DomainException('The definition end time must be after its start time.');
        }
    }

    private function originalStatus(): ServiceDefinitionStatus
    {
        $status = $this->getRawOriginal('status');

        if (! is_string($status)) {
            throw new UnexpectedValueException('Original service definition status is invalid.');
        }

        return ServiceDefinitionStatus::from($status);
    }

    /**
     * @param array<array-key, mixed> $definition
     */
    private static function hashDefinition(array $definition): string
    {
        return hash(
            'sha256',
            json_encode(
                self::normalizeForHash($definition),
                JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES,
            ),
        );
    }

    /**
     * @param array<array-key, mixed> $values
     * @return array<array-key, mixed>
     */
    private static function normalizeForHash(array $values): array
    {
        if (! array_is_list($values)) {
            ksort($values);
        }

        foreach ($values as $key => $value) {
            if (is_array($value)) {
                $values[$key] = self::normalizeForHash($value);
            }
        }

        return $values;
    }
}
