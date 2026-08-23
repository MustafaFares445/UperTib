<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\ServiceGroup;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceGroup>
 */
final class ServiceGroupFactory extends Factory
{
    public function definition(): array
    {
        $number = fake()->unique()->numberBetween(5, 99);

        return [
            'code' => sprintf('G%02d', $number),
            'name_ar' => 'مجموعة خدمات اختبارية',
            'name_en' => fake()->words(3, true),
            'description_ar' => 'وصف عربي لمجموعة خدمات اختبارية.',
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
