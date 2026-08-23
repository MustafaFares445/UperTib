<?php

declare(strict_types=1);

use App\Actions\Catalog\PublishServiceDefinition;
use App\Actions\Catalog\RecordServiceLaunchGateApproval;
use App\Actions\Catalog\RecordServiceLaunchGateDecision;
use App\Domain\Catalog\ServiceDefinitionPayload;
use App\Enums\ServiceDefinitionStatus;
use App\Enums\ServiceLaunchGateStatus;
use App\Enums\ServiceLaunchGateType;
use App\Models\ClinicalReviewerCredential;
use App\Models\Service;
use App\Models\ServiceDefinition;
use App\Models\ServiceLaunchGate;
use App\Models\User;
use Database\Factories\ServiceDefinitionFactory;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

function approveCatalogDefinition(
    ServiceDefinition $definition,
    ?array $types = null,
): ClinicalReviewerCredential {
    $medicalReviewer = User::factory()->create();
    $credential = ClinicalReviewerCredential::factory()->create([
        'user_id' => $medicalReviewer->getKey(),
    ]);
    $approval = resolve(RecordServiceLaunchGateApproval::class);

    foreach ($types ?? ServiceLaunchGateType::cases() as $type) {
        $actor = $type === ServiceLaunchGateType::Medical
            ? $medicalReviewer
            : User::factory()->create();

        $approval->handle(
            $definition,
            $type,
            $actor,
            'The accountable owner approved this immutable definition.',
            'test-evidence/'.$type->value,
            now()->addYear(),
            $type === ServiceLaunchGateType::Medical ? $credential : null,
        );
    }

    return $credential;
}

it('hashes canonical definition content independent of associative key order', function (): void {
    $first = ServiceDefinition::factory()->create([
        'definition' => [
            'risk' => ['tier' => 'low', 'score' => 1],
            'protection' => ['funded' => false, 'level' => 'none'],
        ],
    ]);
    $second = ServiceDefinition::factory()->create([
        'definition' => [
            'protection' => ['level' => 'none', 'funded' => false],
            'risk' => ['score' => 1, 'tier' => 'low'],
        ],
    ]);

    expect($first->contentHash())
        ->toHaveLength(64)
        ->toBe($second->contentHash());
});

it('recalculates a draft hash when its content changes', function (): void {
    $definition = ServiceDefinition::factory()->create();
    $originalHash = $definition->contentHash();

    $definition->update([
        'definition' => [
            'schema_version' => 2,
            'protection' => ['funded' => false],
        ],
    ]);

    expect($definition->refresh()->contentHash())->not->toBe($originalHash);
});

it('publishes only a complete definition with four evidence-bound approvals', function (): void {
    $definition = ServiceDefinition::factory()->productionCandidate()->create();
    approveCatalogDefinition($definition);

    $published = resolve(PublishServiceDefinition::class)->handle($definition);

    expect($published->status())->toBe(ServiceDefinitionStatus::Active)
        ->and($published->isProductionReady())->toBeTrue()
        ->and($published->clinicalReviewState())->toBe('approved');
});

it('does not report unpublished or not-yet-effective definitions as production ready', function (): void {
    $scheduled = ServiceDefinition::factory()->productionCandidate()->create();
    approveCatalogDefinition($scheduled);
    $futureActive = ServiceDefinition::factory()->activeProduction()->create([
        'effective_from' => now()->addMinute(),
    ]);
    approveCatalogDefinition($futureActive);

    expect($scheduled->isProductionReady())->toBeFalse()
        ->and($futureActive->isProductionReady())->toBeFalse();
});

it('rejects publication of a clinically pending incomplete card', function (): void {
    $definition = ServiceDefinition::factory()->productionCandidate()->create([
        'definition' => ServiceDefinitionFactory::pendingClinicalDefinition(),
    ]);
    approveCatalogDefinition($definition);

    expect(fn (): ServiceDefinition => resolve(PublishServiceDefinition::class)->handle($definition))
        ->toThrow(DomainException::class, 'production publication requirements');
});

it('rejects direct activation of an incomplete production card', function (): void {
    expect(fn (): ServiceDefinition => ServiceDefinition::factory()->activeProduction()->create([
        'definition' => ServiceDefinitionFactory::pendingClinicalDefinition(),
    ]))->toThrow(DomainException::class, 'complete approved service card');
});

it('rejects empty or invalid items in mandatory production-card lists', function (array $requirements): void {
    $payload = ServiceDefinitionFactory::completeProductionDefinition();
    $payload['doctor_requirements'] = $requirements;

    expect(ServiceDefinitionPayload::isCompleteForProduction($payload))->toBeFalse();
})->with([
    'empty list' => [[]],
    'blank item' => [['']],
]);

it('rejects publication when a mandatory approval is missing', function (): void {
    $definition = ServiceDefinition::factory()->productionCandidate()->create();
    approveCatalogDefinition($definition, [
        ServiceLaunchGateType::Medical,
        ServiceLaunchGateType::Legal,
        ServiceLaunchGateType::Operational,
    ]);

    expect(fn (): ServiceDefinition => resolve(PublishServiceDefinition::class)->handle($definition))
        ->toThrow(DomainException::class, 'production publication requirements');
});

it('uses the latest append-only gate decision', function (): void {
    $definition = ServiceDefinition::factory()->productionCandidate()->create();
    approveCatalogDefinition($definition);

    resolve(RecordServiceLaunchGateDecision::class)->handle(
        $definition,
        ServiceLaunchGateType::Technical,
        ServiceLaunchGateStatus::Revoked,
        User::factory()->create(),
        'The prior technical approval was withdrawn.',
        'test-evidence/technical-revocation',
    );

    expect($definition->refresh()->isEligibleForProductionPublication())->toBeFalse();
});

it('validates the status-specific fields of append-only launch gate decisions', function (): void {
    $definition = ServiceDefinition::factory()->productionCandidate()->create();
    $decision = resolve(RecordServiceLaunchGateDecision::class);
    $actor = User::factory()->create();

    expect(fn (): ServiceLaunchGate => $decision->handle(
        $definition,
        ServiceLaunchGateType::Legal,
        ServiceLaunchGateStatus::Pending,
        $actor,
        'Waiting for review.',
        'test-evidence/legal-pending',
    ))->toThrow(DomainException::class, 'not an accountable')
        ->and(fn (): ServiceLaunchGate => $decision->handle(
            $definition,
            ServiceLaunchGateType::Legal,
            ServiceLaunchGateStatus::Rejected,
            $actor,
            'The evidence does not satisfy the legal gate.',
            'test-evidence/legal-rejection',
            now()->addMonth(),
        ))->toThrow(DomainException::class, 'cannot carry approval expiry');
});

it('binds every approval to the immutable content hash', function (): void {
    $definition = ServiceDefinition::factory()->productionCandidate()->create();
    approveCatalogDefinition($definition);

    $payload = $definition->definition;
    $payload['patient_purpose_ar'] = 'غرض جديد يحتاج إلى دورة اعتماد جديدة كاملة.';
    $definition->update(['definition' => $payload]);

    expect($definition->refresh()->isEligibleForProductionPublication())->toBeFalse();
});

it('requires a verified current dental credential for medical approval', function (): void {
    $definition = ServiceDefinition::factory()->productionCandidate()->create();
    $ordinaryUser = User::factory()->create();

    expect(fn (): ServiceLaunchGate => resolve(RecordServiceLaunchGateApproval::class)->handle(
        $definition,
        ServiceLaunchGateType::Medical,
        $ordinaryUser,
        'Attempted approval.',
        'test-evidence/medical',
        now()->addYear(),
    ))->toThrow(DomainException::class, 'verified dental credential');
});

it('rejects funded protection in every V1 definition state', function (): void {
    $payload = ServiceDefinitionFactory::pendingClinicalDefinition();
    $payload['protection']['funded'] = true;

    expect(fn (): ServiceDefinition => ServiceDefinition::factory()->create([
        'definition' => $payload,
    ]))->toThrow(DomainException::class, 'Funded protection is forbidden');
});

it('rejects funded protection through raw inserts and mutable-state updates', function (): void {
    $service = Service::factory()->create();
    $fundedPayload = ServiceDefinitionFactory::pendingClinicalDefinition();
    $fundedPayload['protection']['funded'] = true;
    $now = now();

    expect(fn (): bool => DB::table('service_definitions')->insert([
        'service_id' => $service->getKey(),
        'version' => 1,
        'status' => 'draft',
        'audience' => 'evaluation',
        'source_reference' => 'raw-funded-insert',
        'definition' => json_encode($fundedPayload, JSON_THROW_ON_ERROR),
        'content_hash' => str_repeat('a', 64),
        'effective_from' => null,
        'effective_until' => null,
        'created_at' => $now,
        'updated_at' => $now,
    ]))->toThrow(QueryException::class);

    $definition = ServiceDefinition::factory()->create();

    expect(fn (): int => DB::table('service_definitions')
        ->where('id', $definition->getKey())
        ->update([
            'definition' => json_encode($fundedPayload, JSON_THROW_ON_ERROR),
            'content_hash' => str_repeat('b', 64),
        ]))->toThrow(QueryException::class);
});

it('supersedes the prior production version atomically', function (): void {
    $service = Service::factory()->create();
    $versionOne = ServiceDefinition::factory()->for($service)->productionCandidate()->create(['version' => 1]);
    approveCatalogDefinition($versionOne);
    resolve(PublishServiceDefinition::class)->handle($versionOne);

    $versionTwo = ServiceDefinition::factory()->for($service)->productionCandidate()->create(['version' => 2]);
    approveCatalogDefinition($versionTwo);
    resolve(PublishServiceDefinition::class)->handle($versionTwo);

    expect($versionOne->refresh()->status())->toBe(ServiceDefinitionStatus::Superseded)
        ->and($versionTwo->refresh()->status())->toBe(ServiceDefinitionStatus::Active);
});

it('rejects publication when an equal or higher production version is already active', function (): void {
    $service = Service::factory()->create();
    ServiceDefinition::factory()->for($service)->activeProduction()->create(['version' => 2]);
    $candidate = ServiceDefinition::factory()->for($service)->productionCandidate()->create(['version' => 1]);
    approveCatalogDefinition($candidate);

    expect(fn (): ServiceDefinition => resolve(PublishServiceDefinition::class)->handle($candidate))
        ->toThrow(DomainException::class, 'higher version');
});

it('places a new version after an already scheduled active boundary', function (): void {
    $service = Service::factory()->create();
    $prior = ServiceDefinition::factory()->for($service)->activeProduction()->create([
        'version' => 1,
        'effective_from' => now()->addMinute(),
    ]);
    $candidate = ServiceDefinition::factory()->for($service)->productionCandidate()->create(['version' => 2]);
    approveCatalogDefinition($candidate);

    $published = resolve(PublishServiceDefinition::class)->handle($candidate);

    expect($published->effective_from->isAfter($prior->effective_from))->toBeTrue();
});

it('rejects a delayed transition when an approval expires before activation', function (): void {
    $service = Service::factory()->create();
    ServiceDefinition::factory()->for($service)->activeProduction()->create([
        'version' => 1,
        'effective_from' => now()->addMinute(),
    ]);
    $candidate = ServiceDefinition::factory()->for($service)->productionCandidate()->create(['version' => 2]);
    $medicalReviewer = User::factory()->create();
    $credential = ClinicalReviewerCredential::factory()->create(['user_id' => $medicalReviewer->getKey()]);
    $approval = resolve(RecordServiceLaunchGateApproval::class);

    foreach (ServiceLaunchGateType::cases() as $type) {
        $approval->handle(
            $candidate,
            $type,
            $type === ServiceLaunchGateType::Medical ? $medicalReviewer : User::factory()->create(),
            'Time-bounded approval for publication.',
            'test-evidence/'.$type->value.'-timing',
            $type === ServiceLaunchGateType::Technical ? now()->addSeconds(30) : now()->addYear(),
            $type === ServiceLaunchGateType::Medical ? $credential : null,
        );
    }

    expect(fn (): ServiceDefinition => resolve(PublishServiceDefinition::class)->handle($candidate))
        ->toThrow(DomainException::class, 'not valid at the production transition time');
});

it('prevents instance and bulk mutation or deletion of activated definitions', function (): void {
    $definition = ServiceDefinition::factory()->activeEvaluation()->create();

    expect(fn (): bool => $definition->update([
        'definition' => ['changed' => true],
    ]))->toThrow(DomainException::class, 'immutable');

    expect(fn (): int => ServiceDefinition::query()
        ->whereKey($definition->getKey())
        ->update(['definition' => json_encode(['changed' => true], JSON_THROW_ON_ERROR)]))
        ->toThrow(QueryException::class);

    expect(fn (): ?bool => $definition->delete())
        ->toThrow(DomainException::class, 'Only a draft');

    expect(fn (): mixed => ServiceDefinition::query()->whereKey($definition->getKey())->delete())
        ->toThrow(QueryException::class);
});

it('does not allow a terminal definition to become active again', function (): void {
    $definition = ServiceDefinition::factory()->activeEvaluation()->create();
    $definition->update(['status' => ServiceDefinitionStatus::Retired]);

    expect(fn (): bool => $definition->update(['status' => ServiceDefinitionStatus::Active]))
        ->toThrow(DomainException::class, 'transition is not allowed');
});

it('does not allow a superseded definition to become active again', function (): void {
    $definition = ServiceDefinition::factory()->activeEvaluation()->create();
    $definition->update(['status' => ServiceDefinitionStatus::Superseded]);

    expect(fn (): bool => $definition->update(['status' => ServiceDefinitionStatus::Active]))
        ->toThrow(DomainException::class, 'transition is not allowed');
});

it('enforces one version number per service', function (): void {
    $definition = ServiceDefinition::factory()->create();

    expect(fn (): ServiceDefinition => ServiceDefinition::factory()
        ->for($definition->service)
        ->create(['version' => $definition->version]))
        ->toThrow(QueryException::class);
});

it('rejects invalid version and effective periods', function (): void {
    expect(fn (): ServiceDefinition => ServiceDefinition::factory()->create(['version' => 0]))
        ->toThrow(DomainException::class, 'at least one');

    $effectiveFrom = now()->addHour();

    expect(fn (): ServiceDefinition => ServiceDefinition::factory()->create([
        'effective_from' => $effectiveFrom,
        'effective_until' => $effectiveFrom,
    ]))->toThrow(DomainException::class, 'after its start');
});

it('rejects non-array definition content and an invalid financial mode', function (): void {
    expect(fn (): ServiceDefinition => ServiceDefinition::factory()->create([
        'definition' => 'not-json-object',
    ]))->toThrow(DomainException::class, 'content must be an array');

    config(['ubertib.financial_mode' => 'payment_processor']);

    expect(fn (): ServiceDefinition => ServiceDefinition::factory()->create())
        ->toThrow(DomainException::class, 'record-only non-funded');
});

it('fails safely when an original persisted lifecycle state cannot be interpreted', function (): void {
    $definition = ServiceDefinition::factory()->create();
    $attributes = $definition->getAttributes();
    $attributes['status'] = null;
    $definition->setRawAttributes($attributes, true);
    $definition->status = ServiceDefinitionStatus::Draft;
    $definition->source_reference = 'changed-after-invalid-state';

    expect(fn (): bool => $definition->save())
        ->toThrow(UnexpectedValueException::class, 'Original service definition status');
});
