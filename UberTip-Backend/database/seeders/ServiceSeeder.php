<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServiceGroup;
use Illuminate\Database\Seeder;

final class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->catalog() as $groupCode => $services) {
            $group = ServiceGroup::query()->where('code', $groupCode)->sole();

            foreach ($services as $displayOrder => $serviceData) {
                $service = Service::query()->firstOrNew(['code' => $serviceData['code']]);

                if (! $service->exists) {
                    $service->serviceGroup()->associate($group);
                    $service->slug = $serviceData['slug'];
                    $service->is_active = true;
                }

                $service->fill([
                    'name_ar' => $serviceData['name_ar'],
                    'name_en' => $serviceData['name_en'],
                    'description_ar' => $serviceData['purpose_ar'],
                    'display_order' => $displayOrder + 1,
                ])->save();
            }
        }
    }

    /**
     * @return array<string, list<array{code: string, slug: string, name_ar: string, name_en: string, purpose_ar: string}>>
     */
    private function catalog(): array
    {
        return [
            'G01' => [
                ['code' => 'G01-S01', 'slug' => 'tooth-extraction', 'name_ar' => 'القلع', 'name_en' => 'Tooth Extraction', 'purpose_ar' => 'إزالة سن يقرر طبيب الأسنان بعد الفحص أنه يحتاج إلى القلع، مع توضيح التحضير والمتابعة المتوقعة.'],
                ['code' => 'G01-S02', 'slug' => 'wisdom-teeth', 'name_ar' => 'أضراس العقل', 'name_en' => 'Wisdom Teeth', 'purpose_ar' => 'تقييم ومعالجة مشكلات أضراس العقل عند الحاجة، مع شرح الخيارات والخطوات اللاحقة للمريض.'],
                ['code' => 'G01-S03', 'slug' => 'minor-oral-surgery', 'name_ar' => 'الجراحة الصغرى', 'name_en' => 'Minor Oral Surgery', 'purpose_ar' => 'إجراء تدخلات جراحية فموية محدودة يحددها الطبيب بعد التقييم، مع توثيق التعليمات والمتابعة.'],
                ['code' => 'G01-S04', 'slug' => 'periodontics', 'name_ar' => 'اللثة', 'name_en' => 'Periodontics', 'purpose_ar' => 'العناية بصحة اللثة والأنسجة الداعمة للأسنان وفق خطة يحددها طبيب الأسنان بعد الفحص.'],
                ['code' => 'G01-S05', 'slug' => 'dental-implants', 'name_ar' => 'الزراعة', 'name_en' => 'Dental Implants', 'purpose_ar' => 'تعويض الأسنان المفقودة بزرعات سنية عندما يثبت الطبيب ملاءمة الحالة ويحدد مراحل العلاج والمتابعة.'],
                ['code' => 'G01-S06', 'slug' => 'bone-grafting', 'name_ar' => 'ترقيع العظم', 'name_en' => 'Bone Grafting', 'purpose_ar' => 'دعم العظم في موضع يحدده الطبيب تمهيدا للعلاج المناسب، مع توضيح متطلبات الشفاء والمتابعة.'],
                ['code' => 'G01-S07', 'slug' => 'sinus-lift', 'name_ar' => 'رفع الجيب', 'name_en' => 'Sinus Lift', 'purpose_ar' => 'تهيئة منطقة الفك العلوي لعلاج يقرره الطبيب عند الحاجة، مع بيان المخاطر والتعليمات والمتابعة.'],
                ['code' => 'G01-S08', 'slug' => 'surgical-complications', 'name_ar' => 'المضاعفات', 'name_en' => 'Surgical Complications', 'purpose_ar' => 'متابعة ومعالجة المضاعفات المرتبطة بإجراء جراحي سني وفق تقييم الطبيب وحاجة الحالة.'],
            ],
            'G02' => [
                ['code' => 'G02-S01', 'slug' => 'dental-crowns', 'name_ar' => 'التيجان', 'name_en' => 'Dental Crowns', 'purpose_ar' => 'ترميم وحماية سن يحتاج إلى تاج وفق تقييم الطبيب، مع تحديد المادة والخطوات المتوقعة.'],
                ['code' => 'G02-S02', 'slug' => 'dental-bridges', 'name_ar' => 'الجسور', 'name_en' => 'Dental Bridges', 'purpose_ar' => 'تعويض سن أو أكثر بجسر ثابت عندما تكون الحالة مناسبة، مع توضيح التحضير والعناية اللاحقة.'],
                ['code' => 'G02-S03', 'slug' => 'veneers', 'name_ar' => 'الفينير', 'name_en' => 'Veneers', 'purpose_ar' => 'تحسين مظهر الأسنان بقشور تجميلية بعد تقييم الملاءمة وشرح البدائل والنتيجة المتوقعة.'],
                ['code' => 'G02-S04', 'slug' => 'implant-supported-prostheses', 'name_ar' => 'التركيبات فوق الزرعات', 'name_en' => 'Implant-Supported Prostheses', 'purpose_ar' => 'تركيب تعويض سني مدعوم بزرعات قائمة وفق خطة الطبيب ومتطلبات الثبات والعناية.'],
                ['code' => 'G02-S05', 'slug' => 'oral-rehabilitation-aesthetics', 'name_ar' => 'إعادة التأهيل والتجميل', 'name_en' => 'Oral Rehabilitation and Aesthetics', 'purpose_ar' => 'تنسيق عدة إجراءات ترميمية أو تجميلية ضمن خطة علاج موثقة يراجعها الطبيب مع المريض.'],
            ],
            'G03' => [
                ['code' => 'G03-S01', 'slug' => 'primary-root-canal-treatment', 'name_ar' => 'العلاج الأولي', 'name_en' => 'Primary Root Canal Treatment', 'purpose_ar' => 'معالجة قناة جذر السن للمرة الأولى عندما يقرر الطبيب الحاجة، مع توثيق مراحل العلاج والمتابعة.'],
                ['code' => 'G03-S02', 'slug' => 'root-canal-retreatment', 'name_ar' => 'إعادة العلاج', 'name_en' => 'Root Canal Retreatment', 'purpose_ar' => 'إعادة معالجة قناة جذر سبق علاجها عندما يرى الطبيب أن الحالة تستدعي تدخلا جديدا.'],
                ['code' => 'G03-S03', 'slug' => 'separated-instrument-management', 'name_ar' => 'الأدوات المكسورة', 'name_en' => 'Separated Instrument Management', 'purpose_ar' => 'تقييم والتعامل مع أداة منفصلة داخل قناة الجذر وفق إمكانات الحالة وخطة الطبيب.'],
                ['code' => 'G03-S04', 'slug' => 'perforation-management', 'name_ar' => 'الثقوب', 'name_en' => 'Perforation Management', 'purpose_ar' => 'تقييم ومعالجة انثقاب مرتبط بالسن أو علاج الجذر وفق تشخيص الطبيب وخطة المتابعة.'],
                ['code' => 'G03-S05', 'slug' => 'endodontic-complications', 'name_ar' => 'المضاعفات', 'name_en' => 'Endodontic Complications', 'purpose_ar' => 'متابعة المضاعفات المرتبطة بعلاج الجذور وتحديد الإجراء المناسب بناء على فحص الطبيب.'],
                ['code' => 'G03-S06', 'slug' => 'apical-surgery', 'name_ar' => 'الجراحة الذروية', 'name_en' => 'Apical Surgery', 'purpose_ar' => 'إجراء جراحي في منطقة ذروة الجذر عندما يقرره الطبيب بعد التقييم وشرح البدائل.'],
            ],
            'G04' => [
                ['code' => 'G04-S01', 'slug' => 'examination-and-prevention', 'name_ar' => 'الفحص والوقاية', 'name_en' => 'Examination and Prevention', 'purpose_ar' => 'فحص صحة الفم والأسنان ووضع إرشادات وقائية أو خطة متابعة مناسبة للحالة.'],
                ['code' => 'G04-S02', 'slug' => 'dental-fillings', 'name_ar' => 'الحشوات', 'name_en' => 'Dental Fillings', 'purpose_ar' => 'ترميم جزء متضرر من السن بحشوة يختارها الطبيب بعد الفحص وشرح الخيارات.'],
                ['code' => 'G04-S03', 'slug' => 'dental-cleaning', 'name_ar' => 'التنظيف', 'name_en' => 'Dental Cleaning', 'purpose_ar' => 'إزالة الترسبات والعناية بنظافة الأسنان واللثة وفق الحاجة التي يحددها المختص.'],
                ['code' => 'G04-S04', 'slug' => 'teeth-whitening', 'name_ar' => 'التبييض', 'name_en' => 'Teeth Whitening', 'purpose_ar' => 'تفتيح لون الأسنان بطريقة مهنية بعد تقييم الملاءمة وشرح النتيجة المتوقعة والتعليمات.'],
                ['code' => 'G04-S05', 'slug' => 'pediatric-dentistry', 'name_ar' => 'الأطفال', 'name_en' => 'Pediatric Dentistry', 'purpose_ar' => 'تقديم رعاية سنية مناسبة للأطفال تشمل الفحص والوقاية والعلاج الذي يحدده طبيب الأسنان.'],
                ['code' => 'G04-S06', 'slug' => 'dentures', 'name_ar' => 'الأطقم', 'name_en' => 'Dentures', 'purpose_ar' => 'تعويض الأسنان المفقودة بطقم مناسب بعد تقييم الطبيب وأخذ القياسات وشرح العناية اليومية.'],
                ['code' => 'G04-S07', 'slug' => 'dental-emergency-care', 'name_ar' => 'الإسعافات', 'name_en' => 'Dental Emergency Care', 'purpose_ar' => 'تقييم حالة سنية عاجلة وتقديم الإجراء الأولي أو الإحالة التي يحددها الطبيب.'],
            ],
        ];
    }
}
