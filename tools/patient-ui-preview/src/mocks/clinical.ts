export type TreatmentPlanState = 'PROPOSED' | 'ACCEPTED';

export interface PatientCase {
  id: string;
  serviceLabel: string;
  providerName: string;
  branchName: string;
  areaLabel: string;
  treatingDentist: string;
  statusLabel: string;
  acceptedPlanVersion?: string;
  nextFollowUpIso?: string;
  outstandingAction?: { key: 'accept-plan' | 'review-follow-up'; label: string };
  financialSnapshotAvailable?: boolean;
}

export interface TreatmentLineProjection {
  id: string;
  title: string;
  plainMeaning: string;
  quantity: number;
  unit: string;
  unitAmount: number;
  lineAmount: number;
  includes: string[];
  excludes?: string[];
  modifier?: { categoryLabel: string; reason: string };
}

export interface AmendmentProjection {
  priorVersionLabel: string;
  currentVersionLabel: string;
  summary: string;
  changedLines: string[];
  priorTotal: number;
  currentTotal: number;
}

export interface TreatmentPlanProjection {
  id: string;
  caseId: string;
  versionLabel: string;
  state: TreatmentPlanState;
  serviceFamily: string;
  authorName: string;
  currency: string;
  total: number;
  lines: TreatmentLineProjection[];
  inclusions: string[];
  exclusions: string[];
  termsSummary: string;
  protectionSummary: string;
  expiresAtIso?: string;
  amendment?: AmendmentProjection;
  complete: boolean;
}

export interface PatientTimelineEvent {
  id: string;
  title: string;
  summary: string;
  occurredAtIso: string;
  recordedAtIso?: string;
  attribution: string;
  sourceLabel: string;
  details?: string[];
  owningRecordLabel?: string;
  correctionOf?: string;
}

export const patientCases: PatientCase[] = [
  {
    id: 'case-filling-001',
    serviceLabel: 'حشوات الأسنان',
    providerName: 'عيادة الشهباء لطب الأسنان',
    branchName: 'فرع حلب الجديدة',
    areaLabel: 'حلب الجديدة',
    treatingDentist: 'د. رنا الحلبي',
    statusLabel: 'الخطة بانتظار موافقتك',
    outstandingAction: { key: 'accept-plan', label: 'راجع الخطة المقترحة ووافق عليها إذا كانت مناسبة' },
    nextFollowUpIso: '2026-09-20T09:00:00+03:00',
    financialSnapshotAvailable: false,
  },
  {
    id: 'case-cleaning-002',
    serviceLabel: 'تنظيف الأسنان',
    providerName: 'مركز الأمل لطب الأسنان',
    branchName: 'الفرع الرئيسي',
    areaLabel: 'الجميلية',
    treatingDentist: 'د. سامر حداد',
    statusLabel: 'العلاج جارٍ حسب الخطة المقبولة',
    acceptedPlanVersion: 'الإصدار 1',
    nextFollowUpIso: '2026-09-14T11:30:00+03:00',
    financialSnapshotAvailable: true,
  },
];

const baseLines: TreatmentLineProjection[] = [
  {
    id: 'line-exam',
    title: 'فحص وتقييم السن',
    plainMeaning: 'فحص السن وتحديد ما يلزم قبل بدء الحشوة.',
    quantity: 1,
    unit: 'جلسة',
    unitAmount: 25000,
    lineAmount: 25000,
    includes: ['الفحص السريري', 'شرح الخطة قبل البدء'],
  },
  {
    id: 'line-filling',
    title: 'حشوة تجميلية',
    plainMeaning: 'ترميم السن بمادة حشو تجميلية وفق ما حدده الطبيب في الخطة.',
    quantity: 1,
    unit: 'سن',
    unitAmount: 145000,
    lineAmount: 145000,
    includes: ['مادة الحشو', 'تحضير السن وترميمه'],
    excludes: ['أي إجراء آخر غير مذكور في هذه الخطة'],
  },
];

export const proposedTreatmentPlan: TreatmentPlanProjection = {
  id: 'plan-v2',
  caseId: 'case-filling-001',
  versionLabel: 'الإصدار 2',
  state: 'PROPOSED',
  serviceFamily: 'حشوات الأسنان',
  authorName: 'د. رنا الحلبي',
  currency: 'SYP',
  total: 190000,
  lines: [
    ...baseLines,
    {
      id: 'line-material-upgrade',
      title: 'خيار مادة إضافي',
      plainMeaning: 'خيار مادة مختلف أضافه الطبيب إلى النسخة الجديدة من الخطة.',
      quantity: 1,
      unit: 'خيار',
      unitAmount: 20000,
      lineAmount: 20000,
      includes: ['المادة الإضافية المحددة في هذا الخيار'],
      modifier: { categoryLabel: 'خيار إضافي محدد', reason: 'أضيف بعد إعادة تقييم السن وشرحه ضمن تعديل الخطة.' },
    },
  ],
  inclusions: ['العناصر المذكورة داخل كل بند فقط'],
  exclusions: ['أي خدمة أو مادة غير مذكورة صراحة في الخطة'],
  termsSummary: 'هذه الخطة تصف ما اقترحه طبيبك لهذه الحالة. أي تغيير جوهري لاحقًا يحتاج نسخة جديدة وموافقة جديدة.',
  protectionSummary: 'لا تعني الخطة أن UberTib شخص الحالة أو نفّذ أي دفعة. المعلومات العلاجية كتبها الطبيب المعالج.',
  expiresAtIso: '2026-09-12T18:00:00+03:00',
  complete: true,
  amendment: {
    priorVersionLabel: 'الإصدار 1 المقبول سابقًا',
    currentVersionLabel: 'الإصدار 2 المقترح',
    summary: 'أضاف الطبيب خيار مادة محددًا ولم يغيّر بند الفحص أو الحشوة الأساسيين.',
    changedLines: ['إضافة خيار مادة إضافي بقيمة 20,000 ل.س.'],
    priorTotal: 170000,
    currentTotal: 190000,
  },
};

export const acceptedTreatmentPlan: TreatmentPlanProjection = {
  ...proposedTreatmentPlan,
  id: 'plan-v1',
  versionLabel: 'الإصدار 1',
  state: 'ACCEPTED',
  total: 170000,
  lines: baseLines,
  expiresAtIso: undefined,
  amendment: undefined,
};

export const incompleteTreatmentPlan: TreatmentPlanProjection = {
  ...proposedTreatmentPlan,
  id: 'plan-partial',
  lines: proposedTreatmentPlan.lines.slice(0, 2),
  complete: false,
};

export const caseTimeline: PatientTimelineEvent[] = [
  {
    id: 'evt-booking',
    title: 'تم تأكيد الموعد الأول',
    summary: 'أكدت العيادة الموعد الذي بدأت منه هذه الحالة.',
    occurredAtIso: '2026-08-26T10:00:00+03:00',
    attribution: 'العيادة',
    sourceLabel: 'الحجز',
    owningRecordLabel: 'فتح تفاصيل الحجز',
  },
  {
    id: 'evt-plan-v1',
    title: 'قُبلت خطة العلاج الأولى',
    summary: 'تم تسجيل النسخة الأولى كخطة مقبولة لهذه الحالة.',
    occurredAtIso: '2026-08-28T13:10:00+03:00',
    attribution: 'المريض',
    sourceLabel: 'الخطة العلاجية',
    owningRecordLabel: 'فتح الخطة المقبولة',
  },
  {
    id: 'evt-stage-complete',
    title: 'سُجّل إكمال مرحلة علاجية',
    summary: 'سجّل الطبيب أن المرحلة المحددة في الخطة المقبولة قد اكتملت.',
    occurredAtIso: '2026-09-02T12:40:00+03:00',
    attribution: 'د. رنا الحلبي',
    sourceLabel: 'المرحلة العلاجية',
    details: ['يبقى سجل الإكمال ظاهرًا حتى لو ظهرت لاحقًا حاجة لتصحيح أو إعادة فتح.'],
    owningRecordLabel: 'فتح تفاصيل المرحلة',
  },
  {
    id: 'evt-stage-reopened',
    title: 'أُعيد فتح المرحلة كتعديل مسجّل',
    summary: 'أعيدت المرحلة إلى العمل بعد المراجعة، مع إبقاء حدث الإكمال السابق في السجل.',
    occurredAtIso: '2026-09-04T09:25:00+03:00',
    attribution: 'د. رنا الحلبي',
    sourceLabel: 'المرحلة العلاجية',
    correctionOf: 'evt-stage-complete',
    details: ['سبب إعادة الفتح: احتاجت المرحلة إلى متابعة إضافية قبل اعتبارها منتهية.'],
    owningRecordLabel: 'فتح تفاصيل المرحلة',
  },
  {
    id: 'evt-plan-v2',
    title: 'اقترح الطبيب نسخة جديدة من الخطة',
    summary: 'النسخة الجديدة لا تصبح نافذة بدل النسخة المقبولة إلا بعد موافقتك عليها.',
    occurredAtIso: '2026-09-06T14:15:00+03:00',
    attribution: 'د. رنا الحلبي',
    sourceLabel: 'الخطة العلاجية',
    owningRecordLabel: 'مراجعة النسخة المقترحة',
  },
];