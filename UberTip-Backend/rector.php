<?php

declare(strict_types=1);

use Rector\CodeQuality\Rector\Class_\CompleteDynamicPropertiesRector;
use Rector\Config\RectorConfig;
use RectorLaravel\Set\LaravelSetList;

return RectorConfig::configure()
    ->withPaths([
        __DIR__.'/app',
        __DIR__.'/bootstrap',
        __DIR__.'/config',
        __DIR__.'/database',
        __DIR__.'/routes',
        __DIR__.'/tests',
    ])
    ->withComposerBased(laravel: true)
    ->withPreparedSets(
        deadCode: true,
        codeQuality: true,
        typeDeclarations: true,
        earlyReturn: true,
        codingStyle: true,
    )
    ->withSets([
        LaravelSetList::LARAVEL_CODE_QUALITY,
    ])
    ->withSkip([
        __DIR__.'/bootstrap/cache',
        // Dynamic properties are used intentionally on some Eloquent models/DTOs.
        CompleteDynamicPropertiesRector::class,
    ]);
