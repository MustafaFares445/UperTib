export type FollowUpDueState = 'due' | 'upcoming' | 'completed';

export interface PatientFollowUpProjection {
  id: string;
  caseId: string;
  stageLabel: string;
  serviceLabel: string;
  dueState: FollowUpDueState;
  dueLabel: string;
  requirement: string;
  dueAtIso?: string;
  deadlineState?: 'running' | 'approaching' | 'lapsed';
  patientActionLabel?: string;
  completedAtIso?: string;
  subjectLabel?: string;
}

/** Patient-safe API-CLINICAL projection: no provider-private notes, storage paths or internal classification. */
export const patientFollowUps: PatientFollowUpProjection[] = [
  {
    id: 'FU-301',
    caseId: 'case-filling-001',
    stageLabel: 'متابعة بعد المرحلة العلاجية',
    serviceLabel: 'حشوات الأسنان',
    dueState: 'due',
    dueLabel: 'متابعة مستحقة',
    requirement: 'راجع موعد المتابعة المطلوب لهذه الحالة وتابع الإجراء المتاح من سجل الحالة الحالي.',
    dueAtIso: '2026-09-11T17:00:00+03:00',
    deadlineState: 'approaching',
    patientActionLabel: 'فتح الحالة والمتابعة المطلوبة',
  },
  {
    id: 'FU-302',
    caseId: 'case-cleaning-002',
    stageLabel: 'متابعة مجدولة',
    serviceLabel: 'تنظيف وتلميع الأسنان',
    dueState: 'upcoming',
    dueLabel: 'قادمة',
    requirement: 'لا يلزم إجراء الآن. راجع الحالة عند حلول موعد المتابعة أو إذا ظهر إجراء مطلوب جديد.',
    dueAtIso: '2026-09-18T10:00:00+03:00',
    deadlineState: 'running',
    patientActionLabel: 'فتح الحالة',
  },
  {
    id: 'FU-289',
    caseId: 'case-filling-001',
    stageLabel: 'متابعة سابقة',
    serviceLabel: 'حشوات الأسنان',
    dueState: 'completed',
    dueLabel: 'مكتملة',
    requirement: 'اكتملت هذه المتابعة ولا يوجد إجراء مطلوب منها الآن.',
    completedAtIso: '2026-08-28T13:20:00+03:00',
    patientActionLabel: 'فتح سجل الحالة',
  },
];
