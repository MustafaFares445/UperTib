<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ServiceGroup;
use Illuminate\Database\Seeder;

final class ServiceGroupSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            [
                'code' => 'G01',
                'name_ar' => 'الجراحة واللثة وزراعة الأسنان',
                'name_en' => 'Oral Surgery, Periodontics and Dental Implants',
                'description_ar' => 'مجموعة أولية لخدمات جراحة الفم واللثة وزراعة الأسنان، وتخضع تفاصيل كل خدمة للمراجعة.',
                'display_order' => 1,
            ],
            [
                'code' => 'G02',
                'name_ar' => 'التركيبات الثابتة والتجميل',
                'name_en' => 'Fixed Prosthodontics and Aesthetic Dentistry',
                'description_ar' => 'مجموعة أولية لخدمات التركيبات الثابتة وإعادة التأهيل والتجميل، وتخضع تفاصيل كل خدمة للمراجعة.',
                'display_order' => 2,
            ],
            [
                'code' => 'G03',
                'name_ar' => 'علاج الجذور وسحب العصب',
                'name_en' => 'Endodontics and Root Canal Treatment',
                'description_ar' => 'مجموعة أولية لخدمات علاج الجذور وسحب العصب ومضاعفاته، وتخضع تفاصيل كل خدمة للمراجعة.',
                'display_order' => 3,
            ],
            [
                'code' => 'G04',
                'name_ar' => 'طب الأسنان العام',
                'name_en' => 'General Dentistry',
                'description_ar' => 'مجموعة أولية لخدمات الفحص والوقاية والعلاج العام والإسعافات السنية، وتخضع تفاصيل كل خدمة للمراجعة.',
                'display_order' => 4,
            ],
        ];

        foreach ($groups as $group) {
            $serviceGroup = ServiceGroup::query()->firstOrNew(['code' => $group['code']]);

            if (! $serviceGroup->exists) {
                $serviceGroup->is_active = true;
            }

            $serviceGroup->fill($group)->save();
        }
    }
}
