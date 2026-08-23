<?php

declare(strict_types=1);

namespace App\Http\Resources\Api\V1\Catalog;

use App\Models\ServiceGroup;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin ServiceGroup
 */
final class ServiceGroupResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var ServiceGroup $serviceGroup */
        $serviceGroup = $this->resource;

        return [
            'code' => $serviceGroup->code,
            'name' => [
                'ar' => $serviceGroup->name_ar,
                'en' => $serviceGroup->name_en,
            ],
            'description_ar' => $serviceGroup->description_ar,
            'services' => ServiceResource::collection($serviceGroup->services),
        ];
    }
}
