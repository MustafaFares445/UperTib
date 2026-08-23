<?php

declare(strict_types=1);

namespace App\Actions\Catalog;

use App\Enums\ServiceDefinitionAudience;
use App\Enums\ServiceDefinitionStatus;
use App\Models\Service;
use App\Models\ServiceDefinition;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use DomainException;
use Illuminate\Support\Facades\DB;

final readonly class PublishServiceDefinition
{
    public function handle(ServiceDefinition $definition): ServiceDefinition
    {
        return DB::transaction(function () use ($definition): ServiceDefinition {
            $at = CarbonImmutable::now();
            $locked = ServiceDefinition::query()
                ->with([
                    'launchGates.approvedBy',
                    'launchGates.clinicalReviewerCredential.supersededBy',
                ])
                ->whereKey($definition->getKey())
                ->lockForUpdate()
                ->sole();

            if (
                $locked->status() !== ServiceDefinitionStatus::Scheduled
                || $locked->audience() !== ServiceDefinitionAudience::Production
                || ! $locked->isEligibleForProductionPublication($at)
            ) {
                throw new DomainException('The service definition has not satisfied production publication requirements.');
            }

            Service::query()
                ->whereKey($locked->serviceId())
                ->lockForUpdate()
                ->sole();

            $activeDefinitions = ServiceDefinition::query()
                ->where('service_id', $locked->serviceId())
                ->where('audience', ServiceDefinitionAudience::Production)
                ->where('status', ServiceDefinitionStatus::Active)
                ->lockForUpdate()
                ->get();

            if ($activeDefinitions->contains(
                static fn (ServiceDefinition $active): bool => $active->versionNumber() >= $locked->versionNumber(),
            )) {
                throw new DomainException('A published definition must have a higher version than the active definition.');
            }

            $transitionAt = $activeDefinitions->isEmpty() ? $at : $at->addSecond();

            foreach ($activeDefinitions as $activeDefinition) {
                $effectiveFrom = $activeDefinition->getAttribute('effective_from');

                if (
                    $effectiveFrom instanceof CarbonInterface
                    && ! $effectiveFrom->isBefore($transitionAt)
                ) {
                    $transitionAt = $effectiveFrom->toImmutable()->addSecond();
                }
            }

            if (! $locked->isEligibleForProductionPublication($transitionAt)) {
                throw new DomainException('The service definition approvals are not valid at the production transition time.');
            }

            foreach ($activeDefinitions as $activeDefinition) {
                $activeDefinition->update([
                    'status' => ServiceDefinitionStatus::Superseded,
                    'effective_until' => $transitionAt,
                ]);
            }

            $locked->update([
                'status' => ServiceDefinitionStatus::Active,
                'effective_from' => $transitionAt,
                'effective_until' => null,
            ]);

            return $locked->refresh();
        });
    }
}
