<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ServiceFactory;
use DomainException;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use LogicException;

#[Fillable([
    'service_group_id',
    'code',
    'slug',
    'name_ar',
    'name_en',
    'description_ar',
    'display_order',
    'is_active',
])]
final class Service extends Model
{
    /** @use HasFactory<ServiceFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        self::updating(function (Service $service): void {
            if ($service->isDirty(['service_group_id', 'code', 'slug'])) {
                throw new DomainException('A public service identity is immutable.');
            }
        });
    }

    /**
     * @return BelongsTo<ServiceGroup, $this>
     */
    public function serviceGroup(): BelongsTo
    {
        return $this->belongsTo(ServiceGroup::class);
    }

    /**
     * @return HasMany<ServiceDefinition, $this>
     */
    public function serviceDefinitions(): HasMany
    {
        return $this->hasMany(ServiceDefinition::class)->orderByDesc('version');
    }

    public function visibleDefinition(): ServiceDefinition
    {
        if (! $this->relationLoaded('serviceDefinitions')) {
            throw new LogicException('A visible service definition must be loaded explicitly.');
        }

        $definition = $this->serviceDefinitions->first();

        if (! $definition instanceof ServiceDefinition) {
            throw new LogicException('A visible service must have one loaded visible definition.');
        }

        return $definition;
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'display_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
