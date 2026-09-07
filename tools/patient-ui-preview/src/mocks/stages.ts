export type TreatmentStageState = 'INCOMPLETE' | 'COMPLETED' | 'REOPENED';

export interface PatientStageRequirement {
  id: string;
  label: string;
  status: 'satisfied' | 'outstanding';
  patientMeaning: string;
}

export interface PatientStageProjection {
  id: string;
  caseId: string;
  title: string;
  sequenceLabel: string;
  state: TreatmentStageState;
  coverage: string[];
  requirements: PatientStageRequirement[];
  completedBy?: string;
  completedAtIso?: string;
  completionBasis?: string;
  reopenedBy?: string;
  reopenedAtIso?: string;
  reopeningReason?: string;
}

const stageRequirements: PatientStageRequirement[] = [
  {
    id: 'req-clinical-check',
    label: 'إكمال الخطوة العلاجية المحددة في الخطة المقبولة',
    status: 'satisfied',
    patientMeaning: 'سجّل الطبيب تنفيذ الخطوة العلاجية المرتبطة بهذه المرحلة.',
  },
  {
    id: 'req-follow-up-check',
    label: 'مراجعة النتيجة قبل إغلاق المرحلة',
    status: 'outstanding',
    patientMeaning: 'لا تزال مراجعة النتيجة مطلوبة قبل اعتبار المرحلة مكتملة من جديد.',
  },
];

export const reopenedPatientStage: PatientStageProjection = {
  id: 'stage-restoration-001',
  caseId: 'case-filling-001',
  title: 'ترميم السن ومراجعة النتيجة',
  sequenceLabel: 'المرحلة 2 من 2',
  state: 'REOPENED',
  coverage: [
    'تنفيذ الترميم المذكور في الخطة المقبولة.',
    'مراجعة النتيجة قبل إغلاق المرحلة نهائيًا.',
  ],
  requirements: stageRequirements,
  completedBy: 'د. رنا الحلبي',
  completedAtIso: '2026-09-02T12:40:00+03:00',
  completionBasis: 'سجّل الطبيب اكتمال المرحلة وفق متطلبات الخطة المقبولة في ذلك الوقت.',
  reopenedBy: 'د. رنا الحلبي',
  reopenedAtIso: '2026-09-04T09:25:00+03:00',
  reopeningReason: 'احتاجت المرحلة إلى متابعة إضافية قبل اعتبارها منتهية.',
};

export const incompletePatientStage: PatientStageProjection = {
  ...reopenedPatientStage,
  id: 'stage-restoration-incomplete',
  state: 'INCOMPLETE',
  completedBy: undefined,
  completedAtIso: undefined,
  completionBasis: undefined,
  reopenedBy: undefined,
  reopenedAtIso: undefined,
  reopeningReason: undefined,
};

export const completedPatientStage: PatientStageProjection = {
  ...reopenedPatientStage,
  id: 'stage-restoration-completed',
  state: 'COMPLETED',
  requirements: stageRequirements.map((requirement) => ({ ...requirement, status: 'satisfied' as const })),
  reopenedBy: undefined,
  reopenedAtIso: undefined,
  reopeningReason: undefined,
};
