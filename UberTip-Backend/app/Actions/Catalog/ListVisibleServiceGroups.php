<?php

declare(strict_types=1);

namespace App\Actions\Catalog;

use App\Data\Catalog\CatalogListing;
use App\Enums\ServiceDefinitionAudience;
use App\Enums\ServiceDefinitionStatus;
use App\Models\Service;
use App\Models\ServiceDefinition;
use App\Models\ServiceGroup;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Foundation\Application;
use RuntimeException;

final class ListVisibleServiceGroups
{
    public function __construct(private readonly Application $application) {}

    public function handle(): CatalogListing
    {
        $audience = $this->configuredAudience();
        $at = now()->toImmutable();

        $groups = ServiceGroup::query()
            ->where('is_active', true)
            ->with([
                'services' => function (Relation $relation) use ($at, $audience): void {
                    $query = $relation->getQuery();

                    $query
                        ->where('is_active', true)
                        ->orderBy('display_order')
                        ->with([
                            'serviceDefinitions' => function (Relation $relation) use ($at, $audience): void {
                                $query = $relation->getQuery();

                                $query
                                    ->where(function (Builder $query) use ($at): void {
                                        $query
                                            ->where('status', ServiceDefinitionStatus::Active)
                                            ->orWhere(function (Builder $query) use ($at): void {
                                                $query
                                                    ->where('status', ServiceDefinitionStatus::Superseded)
                                                    ->whereNotNull('effective_until')
                                                    ->where('effective_until', '>', $at);
                                            });
                                    })
                                    ->where('audience', $audience)
                                    ->where(function (Builder $query) use ($at): void {
                                        $query
                                            ->whereNull('effective_from')
                                            ->orWhere('effective_from', '<=', $at);
                                    })
                                    ->where(function (Builder $query) use ($at): void {
                                        $query
                                            ->whereNull('effective_until')
                                            ->orWhere('effective_until', '>', $at);
                                    })
                                    ->with([
                                        'launchGates.approvedBy',
                                        'launchGates.clinicalReviewerCredential.supersededBy',
                                    ])
                                    ->orderByDesc('version');
                            },
                        ]);
                },
            ])
            ->orderBy('display_order')
            ->get();

        foreach ($groups as $group) {
            $visibleServices = $group->services
                ->filter(function (Service $service) use ($at, $audience): bool {
                    $definition = $service->serviceDefinitions->first();

                    if (! $definition instanceof ServiceDefinition) {
                        return false;
                    }

                    $definition->useCatalogEvaluationTime($at);

                    if (
                        $audience === ServiceDefinitionAudience::Production
                        && ! $definition->isProductionReady($at)
                    ) {
                        return false;
                    }

                    $service->setRelation(
                        'serviceDefinitions',
                        new Collection([$definition]),
                    );

                    return true;
                })
                ->values();

            $group->setRelation('services', $visibleServices);
        }

        $visibleGroups = $groups
            ->filter(
                static fn (ServiceGroup $serviceGroup): bool => $serviceGroup->services->isNotEmpty(),
            )
            ->values();

        return new CatalogListing($audience, $visibleGroups);
    }

    private function configuredAudience(): ServiceDefinitionAudience
    {
        $mode = config('ubertib.catalog_mode');

        if (! is_string($mode)) {
            throw new RuntimeException('UberTib catalog mode must be a string.');
        }

        $audience = ServiceDefinitionAudience::tryFrom($mode)
            ?? throw new RuntimeException('UberTib catalog mode must be evaluation or production.');

        if (
            $audience === ServiceDefinitionAudience::Evaluation
            && $this->application->environment('production')
        ) {
            throw new RuntimeException('Evaluation catalog mode is forbidden in production.');
        }

        return $audience;
    }
}
