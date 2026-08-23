<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Service;
use App\Models\ServiceGroup;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
final class ServiceFactory extends Factory
{
    public function definition(): array
    {
        $number = fake()->unique()->numberBetween(1, 99);

        return [
            'service_group_id' => ServiceGroup::factory(),
            'code' => sprintf('G99-S%02d', $number),
            'slug' => fake()->unique()->slug(3),
            'name_ar' => 'خدمة أسنان اختبارية',
            'name_en' => fake()->words(3, true),
            'description_ar' => 'وصف عربي لخدمة أسنان اختبارية.',
            'display_order' => $number,
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (): array => [
            'is_active' => false,
        ]);
    }
}
