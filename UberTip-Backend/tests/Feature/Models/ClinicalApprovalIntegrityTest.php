<?php

declare(strict_types=1);

use App\Actions\Catalog\RecordServiceLaunchGateApproval;
use App\Enums\ClinicalReviewerCredentialStatus;
use App\Enums\ServiceLaunchGateType;
use App\Models\ClinicalReviewerCredential;
use App\Models\ServiceDefinition;
use App\Models\ServiceLaunchGate;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('requires independent credential verification', function (): void {
    $reviewer = User::factory()->create();

    expect(fn (): ClinicalReviewerCredential => ClinicalReviewerCredential::factory()->create([
        'user_id' => $reviewer->getKey(),
        'verified_by_user_id' => $reviewer->getKey(),
    ]))->toThrow(DomainException::class, 'independent verification');
});

it('rejects expired revoked or non-dental credentials', function (array $state): void {
    $reviewer = User::factory()->create();
    $credential = ClinicalReviewerCredential::factory()->create([
        'user_id' => $reviewer->getKey(),
        ...$state,
    ]);

    expect($credential->isCurrentFor($reviewer, now()))->toBeFalse();
})->with([
    'expired' => [['expires_at' => now()->subSecond()]],
    'revoked' => [['status' => ClinicalReviewerCredentialStatus::Revoked]],
    'wrong scope' => [['practice_scope' => 'general_medicine']],
]);

it('invalidates a verified snapshot when an append-only revocation supersedes it', function (): void {
    $reviewer = User::factory()->create();
    $verified = ClinicalReviewerCredential::factory()->create([
        'user_id' => $reviewer->getKey(),
    ]);

    ClinicalReviewerCredential::factory()->create([
        'supersedes_credential_id' => $verified->getKey(),
        'user_id' => $reviewer->getKey(),
        'status' => ClinicalReviewerCredentialStatus::Revoked,
        'registration_hash' => $verified->registration_hash,
    ]);

    expect($verified->refresh()->isCurrentFor($reviewer, now()))->toBeFalse();
});

it('rejects a successor snapshot for a different reviewer or license', function (): void {
    $verified = ClinicalReviewerCredential::factory()->create();

    expect(fn (): ClinicalReviewerCredential => ClinicalReviewerCredential::factory()->create([
        'supersedes_credential_id' => $verified->getKey(),
    ]))->toThrow(DomainException::class, 'same license and reviewer');
});

it('keeps credential snapshots immutable through model and bulk writes', function (): void {
    $credential = ClinicalReviewerCredential::factory()->create();

    $credential->issuing_authority = 'Changed';

    expect(fn (): bool => $credential->save())
        ->toThrow(DomainException::class, 'immutable');

    expect(fn (): int => ClinicalReviewerCredential::query()
        ->whereKey($credential->getKey())
        ->update(['issuing_authority' => 'Changed']))
        ->toThrow(QueryException::class);

    expect(fn (): ?bool => $credential->delete())
        ->toThrow(DomainException::class, 'immutable');
});

it('keeps launch decisions append-only through model and bulk writes', function (): void {
    $gate = ServiceLaunchGate::factory()->create();

    $gate->decision_reason = 'Changed';

    expect(fn (): bool => $gate->save())
        ->toThrow(DomainException::class, 'append-only');

    expect(fn (): int => ServiceLaunchGate::query()
        ->whereKey($gate->getKey())
        ->update(['decision_reason' => 'Changed']))
        ->toThrow(QueryException::class);

    expect(fn (): mixed => ServiceLaunchGate::query()->whereKey($gate->getKey())->delete())
        ->toThrow(QueryException::class);

    expect(fn (): ?bool => $gate->delete())
        ->toThrow(DomainException::class, 'append-only');
});

it('increments the append-only sequence after an existing pending decision', function (): void {
    $definition = ServiceDefinition::factory()->productionCandidate()->create();
    $actor = User::factory()->create();

    ServiceLaunchGate::factory()
        ->for($definition)
        ->forType(ServiceLaunchGateType::Legal)
        ->create(['sequence' => 1]);

    $approved = resolve(RecordServiceLaunchGateApproval::class)->handle(
        $definition,
        ServiceLaunchGateType::Legal,
        $actor,
        'Approved after review.',
        'evidence/legal-sequence',
        now()->addYear(),
    );

    expect($approved->sequenceNumber())->toBe(2);
});

it('validates approval evidence expiry and clinical scope', function (): void {
    $definition = ServiceDefinition::factory()->productionCandidate()->create();
    $actor = User::factory()->create();
    $credential = ClinicalReviewerCredential::factory()->create([
        'user_id' => $actor->getKey(),
    ]);
    $approval = resolve(RecordServiceLaunchGateApproval::class);

    expect(fn (): ServiceLaunchGate => $approval->handle(
        $definition,
        ServiceLaunchGateType::Medical,
        $actor,
        '',
        '',
        now()->addYear(),
        $credential,
    ))->toThrow(DomainException::class, 'reason and evidence');

    expect(fn (): ServiceLaunchGate => $approval->handle(
        $definition,
        ServiceLaunchGateType::Medical,
        $actor,
        'Approved.',
        'evidence/medical',
        now()->subSecond(),
        $credential,
    ))->toThrow(DomainException::class, 'expiry must be in the future');

    expect(fn (): ServiceLaunchGate => $approval->handle(
        $definition,
        ServiceLaunchGateType::Legal,
        $actor,
        'Approved.',
        'evidence/legal',
        now()->addYear(),
        $credential,
    ))->toThrow(DomainException::class, 'Only the medical gate');
});
