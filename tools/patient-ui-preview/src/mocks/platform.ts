export type AttentionResourceKind = 'booking' | 'case' | 'claim' | 'finance' | 'follow-up';

export interface AttentionResourceReference {
  kind: AttentionResourceKind;
  id: string;
}

export interface PatientAttentionEntry {
  id: string;
  title: string;
  summary: string;
  resource: AttentionResourceReference;
  createdAtIso: string;
  read: boolean;
  actionRequired: boolean;
  status: {
    machine: string;
    value: string;
    label: string;
  };
  dueAtIso?: string;
  deadlineState?: 'running' | 'approaching' | 'lapsed';
  /** false means the governing record is deadline-bearing but its actual due time failed to load. */
  deadlineKnown?: boolean;
  subjectLabel?: string;
}

export type PendingSubmissionReconciliationState = 'unknown' | 'not-committed' | 'retrying' | 'committed';

export interface PendingSubmissionProjection {
  id: string;
  intentLabel: string;
  createdAtIso: string;
  asOfIso: string;
  /** Stored locally and reused for an idempotent retry. It is never rendered as Patient content. */
  idempotencyKey: string;
  reconciliationState: PendingSubmissionReconciliationState;
  resolvedRecord?: {
    resource: AttentionResourceReference;
    label: string;
    statusLabel: string;
  };
  retryConflict?: boolean;
  subjectLabel?: string;
}

export const PLATFORM_NOW_ISO = '2026-09-10T19:00:00+03:00';
export const PLATFORM_AS_OF_ISO = '2026-09-10T18:56:00+03:00';

/**
 * Deterministic preview projection of the requirement-backed reads used by SCR-PLATFORM-001 and
 * SCR-PLATFORM-009. These are safe Patient-facing summaries only; opening an item is expected to
 * re-read the linked authoritative record before showing its current state.
 */
export const patientAttentionEntries: PatientAttentionEntry[] = [
  {
    id: 'attention-booking-alternative',
    title: 'اختر ما إذا كان الموعد البديل يناسبك',
    summary: 'اقترحت العيادة موعدًا بديلًا. راجع الموعد الأصلي والاقتراح قبل اتخاذ القرار.',
    resource: { kind: 'booking', id: 'BK-2041' },
    createdAtIso: '2026-09-10T15:20:00+03:00',
    read: false,
    actionRequired: true,
    status: { machine: 'booking', value: 'ALTERNATIVE_PROPOSED', label: 'عُرض موعد بديل' },
    dueAtIso: '2026-09-10T21:30:00+03:00',
    deadlineState: 'approaching',
    deadlineKnown: true,
  },
  {
    id: 'attention-claim-evidence',
    title: 'أكمل الأدلة المطلوبة للمطالبة',
    summary: 'ما زال أحد الأدلة المطلوبة غير مكتمل. افتح المطالبة لمعرفة المطلوب قبل انتهاء المهلة.',
    resource: { kind: 'claim', id: 'CLM-118' },
    createdAtIso: '2026-09-09T11:05:00+03:00',
    read: true,
    actionRequired: true,
    status: { machine: 'claim-request', value: 'EVIDENCE_INCOMPLETE', label: 'أدلة ناقصة — إجراء مطلوب' },
    dueAtIso: '2026-09-12T17:00:00+03:00',
    deadlineState: 'running',
    deadlineKnown: true,
  },
  {
    id: 'attention-finance-confirmation',
    title: 'راجع واقعة مالية مبلّغًا عنها',
    summary: 'هناك واقعة مالية خارج المنصة ما زالت بانتظار التأكيد. افتح السجل لرؤية حالتها الحالية.',
    resource: { kind: 'finance', id: 'FIN-EVT-77' },
    createdAtIso: '2026-09-08T13:40:00+03:00',
    read: true,
    actionRequired: true,
    status: { machine: 'external-financial-event', value: 'REPORTED_UNCONFIRMED', label: 'مُبلَّغ عنه — غير مؤكَّد' },
    deadlineKnown: false,
  },
];

export const representedPatientAttentionEntries: PatientAttentionEntry[] = patientAttentionEntries.map((entry) => ({
  ...entry,
  id: `represented-${entry.id}`,
  subjectLabel: 'لين',
}));

export const pendingSubmissionUnknown: PendingSubmissionProjection = {
  id: 'submission-booking-unknown',
  intentLabel: 'طلب حجز لزراعة سن',
  createdAtIso: '2026-09-10T18:42:00+03:00',
  asOfIso: '2026-09-10T18:56:00+03:00',
  idempotencyKey: 'preview-booking-intent-01',
  reconciliationState: 'unknown',
};

export const pendingSubmissionStillUnknown: PendingSubmissionProjection = {
  ...pendingSubmissionUnknown,
  id: 'submission-booking-still-unknown',
  asOfIso: '2026-09-10T18:59:00+03:00',
};

export const pendingSubmissionNotCommitted: PendingSubmissionProjection = {
  id: 'submission-finance-not-committed',
  intentLabel: 'الإبلاغ عن واقعة مالية خارج المنصة',
  createdAtIso: '2026-09-10T18:10:00+03:00',
  asOfIso: '2026-09-10T18:58:00+03:00',
  idempotencyKey: 'preview-finance-intent-02',
  reconciliationState: 'not-committed',
};

export const pendingSubmissionRetrying: PendingSubmissionProjection = {
  ...pendingSubmissionNotCommitted,
  id: 'submission-finance-retrying',
  reconciliationState: 'retrying',
};

export const pendingSubmissionCommitted: PendingSubmissionProjection = {
  id: 'submission-claim-committed',
  intentLabel: 'إرسال مطالبة حماية',
  createdAtIso: '2026-09-10T17:35:00+03:00',
  asOfIso: '2026-09-10T18:57:00+03:00',
  idempotencyKey: 'preview-claim-intent-03',
  reconciliationState: 'committed',
  resolvedRecord: {
    resource: { kind: 'claim', id: 'CLM-129' },
    label: 'المطالبة CLM-129',
    statusLabel: 'تم العثور على السجل الملتزم',
  },
};

export const pendingSubmissionRetryConflict: PendingSubmissionProjection = {
  ...pendingSubmissionNotCommitted,
  id: 'submission-retry-conflict',
  retryConflict: true,
};

export const pendingSubmissionExamples: PendingSubmissionProjection[] = [
  pendingSubmissionUnknown,
  pendingSubmissionNotCommitted,
  pendingSubmissionCommitted,
];
