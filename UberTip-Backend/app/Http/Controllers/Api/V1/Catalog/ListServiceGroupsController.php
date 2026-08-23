<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Catalog;

use App\Actions\Catalog\ListVisibleServiceGroups;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\Catalog\ServiceGroupResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class ListServiceGroupsController extends Controller
{
    public function __invoke(
        ListVisibleServiceGroups $listVisibleServiceGroups,
    ): AnonymousResourceCollection {
        $listing = $listVisibleServiceGroups->handle();

        return ServiceGroupResource::collection($listing->groups)
            ->additional([
                'meta' => [
                    'mode' => $listing->mode->value,
                ],
            ]);
    }
}
