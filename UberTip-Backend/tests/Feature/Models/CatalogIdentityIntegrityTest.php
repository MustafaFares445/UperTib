<?php

declare(strict_types=1);

use App\Models\Service;
use App\Models\ServiceGroup;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('keeps public group codes immutable through model and bulk writes', function (): void {
    $group = ServiceGroup::factory()->create();
    $group->code = 'G99';

    expect(fn (): bool => $group->save())
        ->toThrow(DomainException::class, 'group code is immutable');

    expect(fn (): int => ServiceGroup::query()->whereKey($group->getKey())->update(['code' => 'G99']))
        ->toThrow(QueryException::class);
});

it('keeps public service codes slugs and group membership immutable', function (): void {
    $service = Service::factory()->create();
    $otherGroup = ServiceGroup::factory()->create();

    foreach ([
        ['code' => 'G99-S99'],
        ['slug' => 'changed-public-slug'],
        ['service_group_id' => $otherGroup->getKey()],
    ] as $mutation) {
        $fresh = $service->fresh();

        expect(fn (): bool => $fresh->update($mutation))
            ->toThrow(DomainException::class, 'service identity is immutable');
    }

    expect(fn (): int => Service::query()->whereKey($service->getKey())->update([
        'slug' => 'bulk-changed-public-slug',
    ]))->toThrow(QueryException::class);
});

it('requires catalog definitions to be eager loaded before resource selection', function (): void {
    $service = Service::factory()->create();

    expect(fn () => $service->visibleDefinition())
        ->toThrow(LogicException::class, 'loaded explicitly');
});

it('rejects an explicitly loaded catalog service with no visible definition', function (): void {
    $service = Service::factory()->create();
    $service->setRelation('serviceDefinitions', new Collection);

    expect(fn () => $service->visibleDefinition())
        ->toThrow(LogicException::class, 'must have one');
});
