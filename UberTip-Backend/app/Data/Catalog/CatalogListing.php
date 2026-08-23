<?php

declare(strict_types=1);

namespace App\Data\Catalog;

use App\Enums\ServiceDefinitionAudience;
use App\Models\ServiceGroup;
use Illuminate\Database\Eloquent\Collection;

final readonly class CatalogListing
{
    /**
     * @param Collection<int, ServiceGroup> $groups
     */
    public function __construct(
        public ServiceDefinitionAudience $mode,
        public Collection $groups,
    ) {}
}
