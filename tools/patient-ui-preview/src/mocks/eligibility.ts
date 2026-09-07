import type { ProviderOption } from '../components/ProviderDecisionCard';

/**
 * Deterministic mock projection of API-ELIG-001. Aleppo only, per SCR-ELIG-001. Carries no
 * internal classification value, no service risk level, no comparison value, no sample count, no
 * confidence figure and no market-average label — matching the real contract's own prohibition.
 */
const NOW = '2026-09-03T09:00:00+03:00';

export const eligibilityResults: Record<string, ProviderOption[]> = {
  'svc-filling': [
    {
      id: 'opt-1',
      providerName: 'د. رنا الحلبي',
      branchName: 'عيادة الشهباء لطب الأسنان',
      areaLabel: 'حلب الجديدة',
      serviceLabel: 'حشوات الأسنان',
      eligibility: 'ELIGIBLE',
      price: { mode: 'from', amount_min: 45000, currency: 'SYP' },
      priceIncludes: 'يشمل الفحص والحشوة؛ قد تُضاف تكلفة إضافية حسب حجم التسوس.',
      fundedProtection: false,
      ratingLabel: 'تقييم موثّق: 4.6 من 5 (312 تقييمًا)',
      nearestAppointmentIso: '2026-09-05T11:00:00+03:00',
      assessedAtIso: NOW,
    },
    {
      id: 'opt-2',
      providerName: 'د. عمر قوشجي',
      branchName: 'مركز الفرقان الطبي',
      areaLabel: 'الفرقان',
      serviceLabel: 'حشوات الأسنان',
      eligibility: 'ELIGIBLE',
      price: { mode: 'fixed', amount: 60000, currency: 'SYP' },
      fundedProtection: false,
      ratingLabel: 'تقييم موثّق: 4.2 من 5 (98 تقييمًا)',
      nearestAppointmentIso: '2026-09-04T16:30:00+03:00',
      assessedAtIso: NOW,
    },
    {
      id: 'opt-3',
      providerName: 'د. لمى النجار',
      branchName: 'عيادة السريان',
      areaLabel: 'السريان',
      serviceLabel: 'حشوات الأسنان',
      eligibility: 'ELIGIBLE',
      price: { mode: 'range', amount_min: 40000, amount_max: 80000, currency: 'SYP' },
      priceIncludes: 'يعتمد السعر النهائي على عدد الأسطح المتضررة.',
      fundedProtection: false,
      assessedAtIso: NOW,
    },
  ],
  'svc-cleaning': [
    {
      id: 'opt-4',
      providerName: 'د. رنا الحلبي',
      branchName: 'عيادة الشهباء لطب الأسنان',
      areaLabel: 'حلب الجديدة',
      serviceLabel: 'تنظيف وتلميع الأسنان',
      eligibility: 'ELIGIBLE',
      price: { mode: 'fixed', amount: 25000, currency: 'SYP' },
      fundedProtection: false,
      ratingLabel: 'تقييم موثّق: 4.6 من 5 (312 تقييمًا)',
      nearestAppointmentIso: '2026-09-04T10:00:00+03:00',
      assessedAtIso: NOW,
    },
  ],
};

/** Patient-safe deterministic projection of API-ELIG-002 for one exact option. */
export interface EligibilityExplanation {
  providerName: string;
  branchName: string;
  areaLabel: string;
  serviceLabel: string;
  eligibility: ProviderOption['eligibility'];
  assessedAtIso: string;
  reasonSummary: string;
  nextStep: string;
}

const REASON_BY_STATUS: Record<ProviderOption['eligibility'], { reasonSummary: string; nextStep: string }> = {
  ELIGIBLE: {
    reasonSummary: 'هذا الطبيب وهذا الفرع مستوفيان حاليًا شروط إتاحة هذه الخدمة على UberTib.',
    nextStep: 'يمكنك متابعة اختيار الموعد. يُعاد التحقق من الأهلية والتوفر عند إرسال طلب الحجز.',
  },
  PENDING_EVALUATION: {
    reasonSummary: 'ما زال تقييم هذا الخيار قيد الاستكمال، لذلك لا يظهر كخيار جاهز للحجز الآن.',
    nextStep: 'يمكنك العودة إلى النتائج واختيار خيار متاح حاليًا، أو التحقق من هذا الخيار لاحقًا.',
  },
  SUSPENDED: {
    reasonSummary: 'هذا الخيار موقوف مؤقتًا ضمن هذا الفرع والخدمة، لذلك لا يمكن متابعته للحجز الآن.',
    nextStep: 'ارجع إلى النتائج لاختيار طبيب أو فرع آخر متاح لهذه الخدمة.',
  },
  NOT_ELIGIBLE: {
    reasonSummary: 'هذا الخيار لا يستوفي حاليًا شروط إتاحة هذه الخدمة في هذا الفرع.',
    nextStep: 'ارجع إلى النتائج لاختيار خيار آخر متاح لهذه الخدمة.',
  },
};

export function explanationFor(option: ProviderOption): EligibilityExplanation {
  const copy = REASON_BY_STATUS[option.eligibility];
  return {
    providerName: option.providerName,
    branchName: option.branchName,
    areaLabel: option.areaLabel,
    serviceLabel: option.serviceLabel,
    eligibility: option.eligibility,
    assessedAtIso: option.assessedAtIso,
    reasonSummary: copy.reasonSummary,
    nextStep: copy.nextStep,
  };
}

export function optionsFor(serviceCode: string): ProviderOption[] {
  return eligibilityResults[serviceCode] ?? [];
}

export function findOption(optionId: string): ProviderOption | undefined {
  for (const list of Object.values(eligibilityResults)) {
    const found = list.find((o) => o.id === optionId);
    if (found) return found;
  }
  return undefined;
}
