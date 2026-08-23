<?php

declare(strict_types=1);

namespace App\Http\Resources\Api\V1\Catalog;

use App\Models\ServiceDefinition;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ServiceDefinition
 */
final class ServiceDefinitionSummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var ServiceDefinition $serviceDefinition */
        $serviceDefinition = $this->resource;

        return [
            'version' => $serviceDefinition->versionNumber(),
            'audience' => $serviceDefinition->audience()->value,
            'clinical_review_state' => $serviceDefinition->clinicalReviewState(),
            'production_ready' => $serviceDefinition->isProductionReady(),
            'protection' => [
                'funded' => $serviceDefinition->hasFundedProtection(),
            ],
        ];
    }
}
