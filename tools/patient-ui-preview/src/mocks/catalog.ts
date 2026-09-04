/**
 * Deterministic mock projection of API-CATALOG-001. Stable IDs, Arabic-first, non-diagnostic
 * language per SCR-CATALOG-001/002. No procedure-code catalog is exposed to the patient — only
 * practical service families, per the screen's own prohibition.
 */
export interface ServiceFamily {
  code: string;
  name: string;
  summary: string;
  covers: string;
}

export interface ServiceGroup {
  id: string;
  name: string;
  families: ServiceFamily[];
}

export const CATALOG_MODE: 'evaluation' | 'production' = 'production';

export const serviceCatalog: ServiceGroup[] = [
  {
    id: 'group-prevention',
    name: 'العناية الوقائية',
    families: [
      {
        code: 'svc-cleaning',
        name: 'تنظيف وتلميع الأسنان',
        summary: 'تنظيف دوري لإزالة الجير والترسبات والحفاظ على صحة اللثة.',
        covers: 'يشمل الفحص الأولي، إزالة الجير، وتلميع سطح الأسنان.',
      },
      {
        code: 'svc-checkup',
        name: 'فحص وكشف عام',
        summary: 'فحص شامل لتقييم الحالة العامة للأسنان واللثة.',
        covers: 'يشمل الفحص السريري وتحديد ما إذا كانت هناك حاجة لعلاج إضافي.',
      },
    ],
  },
  {
    id: 'group-restorative',
    name: 'علاج الأسنان',
    families: [
      {
        code: 'svc-filling',
        name: 'حشوات الأسنان',
        summary: 'معالجة التسوس وإعادة بناء السن المتضرر.',
        covers: 'يشمل إزالة التسوس ووضع الحشوة المناسبة.',
      },
      {
        code: 'svc-root-canal',
        name: 'علاج العصب',
        summary: 'معالجة التهاب أو تضرر عصب السن للحفاظ عليه دون خلعه.',
        covers: 'يشمل الفحص، معالجة العصب، والتحضير للترميم النهائي.',
      },
    ],
  },
  {
    id: 'group-cosmetic',
    name: 'التقويم والتجميل',
    families: [
      {
        code: 'svc-whitening',
        name: 'تبييض الأسنان',
        summary: 'تفتيح لون الأسنان بطريقة آمنة تحت إشراف طبي.',
        covers: 'يشمل الفحص المبدئي وجلسة التبييض.',
      },
      {
        code: 'svc-orthodontics',
        name: 'تقويم الأسنان',
        summary: 'تصحيح ترتيب الأسنان وإطباقها على مراحل.',
        covers: 'يشمل التقييم الأولي وخطة المتابعة مع الطبيب.',
      },
    ],
  },
  {
    id: 'group-surgical',
    name: 'الجراحة الفموية',
    families: [
      {
        code: 'svc-extraction',
        name: 'خلع الأسنان',
        summary: 'إزالة سن متضرر لا يمكن علاجه بطرق أخرى.',
        covers: 'يشمل التخدير الموضعي والخلع والمتابعة بعد الإجراء.',
      },
      {
        code: 'svc-implant',
        name: 'زراعة الأسنان',
        summary: 'تعويض سن مفقود بزرعة تحل محل الجذر الطبيعي.',
        covers: 'يشمل الفحص والتقييم؛ التكلفة النهائية تعتمد على الفحص.',
      },
    ],
  },
];

export function findFamily(code: string): ServiceFamily | undefined {
  for (const group of serviceCatalog) {
    const found = group.families.find((f) => f.code === code);
    if (found) return found;
  }
  return undefined;
}
