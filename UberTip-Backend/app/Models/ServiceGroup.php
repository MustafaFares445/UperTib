<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ServiceGroupFactory;
use DomainException;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'code',
    'name_ar',
    'name_en',
    'description_ar',
    'display_order',
    'is_active',
])]
final class ServiceGroup extends Model
{
    /** @use HasFactory<ServiceGroupFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        self::updating(function (ServiceGroup $group): void {
            if ($group->isDirty('code')) {
                throw new DomainException('A public service group code is immutable.');
            }
        });
    }

    /**
     * @return HasMany<Service, $this>
     */
    public function services(): HasMany
    {
        return $this->hasMany(Service::class)->orderBy('display_order');
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
