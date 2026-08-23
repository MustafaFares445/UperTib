<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Sleep;
use Illuminate\Testing\ParallelTesting;
use Tests\TestCase;

pest()->extend(TestCase::class)->in('Feature', 'Unit');

beforeEach(function (): void {
    $token = ParallelTesting::token();

    config([
        'filesystems.disks.public.root' => storage_path("framework/testing/disks/public-{$token}"),
        'filesystems.disks.local.root' => storage_path("framework/testing/disks/local-{$token}"),
    ]);

    Http::preventStrayRequests();
    Process::preventStrayProcesses();
    Sleep::fake();

    $this->freezeTime();
});

expect()->extend('toBeOne', fn () => $this->toBe(1));
