<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\Catalog\ListServiceGroupsController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->name('api.v1.')
    ->group(function (): void {
        Route::get('catalog/service-groups', ListServiceGroupsController::class)
            ->middleware([
                'throttle:public-catalog',
                'cache.headers:public;max_age=60;etag',
            ])
            ->name('catalog.service-groups.index');
    });
