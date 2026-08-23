<?php

declare(strict_types=1);

namespace App\Http\Resources\Api\V1\Catalog;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Service
 */
final class ServiceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Service $service */
        $service = $this->resource;

        return [
            'code' => $service->code,
            'slug' => $service->slug,
            'name' => [
                'ar' => $service->name_ar,
                'en' => $service->name_en,
            ],
            'description_ar' => $service->description_ar,
            'definition' => new ServiceDefinitionSummaryResource(
                $service->visibleDefinition(),
            ),
        ];
    }
}
