export type ClaimRequestState = 'SUBMITTED' | 'EVIDENCE_INCOMPLETE' | 'UNDER_REVIEW' | 'DECIDED' | 'CLOSED';
export type ClaimType = 'REFUND_REQUEST' | 'PROTECTION_CLAIM';
export type ClaimEvidenceState = 'MISSING' | 'REJECTED' | 'EXPIRED' | 'ACCEPTED';
export type ClaimWindowState = 'running' | 'approaching' | 'lapsed';

export interface ClaimEvidenceRequirement {
  id: string;
  label: string;
  state: ClaimEvidenceState;
  reason: string;
}

export interface ClaimDeadlineEvent {
  id: string;
  kind: 'PAUSE' | 'EXTENSION';
  occurredAtIso: string;
  reason: string;
  effectiveDeadlineIso: string;
}

export interface ClaimDecisionProjection {
  reason: string;
  decidedAtIso: string;
  decidedByLabel: string;
  approvedRefund?: {
    amount: number;
    currency: string;
    externalExecutionStatus: 'PENDING_EXTERNAL_EXECUTION' | 'REPORTED_UNCONFIRMED' | 'CONFIRMED';
  };
}

export interface PatientClaimSummary {
  id: string;
  type: ClaimType;
  serviceLabel: string;
  state: ClaimRequestState;
  missingEvidenceCount: number;
  effectiveDeadlineIso?: string;
  deadlineState?: ClaimWindowState;
  appealEligible: boolean;
  externalExecutionPending?: boolean;
}

export interface PatientClaimDetail extends PatientClaimSummary {
  caseId: string;
  providerName: string;
  governingSnapshotId: string;
  governingSnapshotLabel: string;
  narrative: string;
  submittedAtIso: string;
  requestedAmount?: number;
  currency?: string;
  originalDeadlineIso: string;
  deadlineEvents: ClaimDeadlineEvent[];
  evidenceRequirements: ClaimEvidenceRequirement[];
  decision?: ClaimDecisionProjection;
  appealWindowEndsAtIso?: string;
  idempotencyKey?: string;
  payloadFingerprint?: string;
}

export interface RefundEntitlementProjection {
  caseId: string;
  serviceLabel: string;
  providerName: string;
  governingSnapshotId: string;
  governingSnapshotLabel: string;
  snapshotAvailable: boolean;
  eligible: boolean;
  currency: string;
  maxRequestedAmount: number;
  requestWindowEndsAtIso: string;
  requestWindowState: ClaimWindowState;
  responseDeadlineIso: string;
  requiredEvidence: Array<{ id: string; label: string; satisfied: boolean }>;
}

export interface RefundRequestDraft {
  requestedAmount: string;
  reason: string;
  occurrenceContext?: string;
  evidenceIds: string[];
}

export type RefundSubmissionBlock =
  | 'INVALID_INPUT'
  | 'GOVERNING_SNAPSHOT_UNAVAILABLE'
  | 'INELIGIBLE'
  | 'WINDOW_EXPIRED'
  | 'EVIDENCE_INCOMPLETE'
  | 'IDEMPOTENCY_CONFLICT';

export interface RefundSubmissionResult {
  claim?: PatientClaimDetail;
  blockedBy?: RefundSubmissionBlock;
  reused?: boolean;
}

export interface RefundSubmissionOptions {
  idempotencyKey: string;
  existingClaim?: PatientClaimDetail;
  nowIso?: string;
}

export const CLAIMS_NOW_ISO = '2026-09-07T03:00:00+03:00';

export const defaultRefundEntitlement: RefundEntitlementProjection = {
  caseId: 'case-cleaning-002',
  serviceLabel: 'تنظيف الأسنان',
  providerName: 'مركز الأمل لطب الأسنان',
  governingSnapshotId: 'terms-snapshot-cleaning-v1',
  governingSnapshotLabel: 'الشروط المالية المقبولة — الإصدار 1',
  snapshotAvailable: true,
  eligible: true,
  currency: 'SYP',
  maxRequestedAmount: 120000,
  requestWindowEndsAtIso: '2026-09-12T23:59:59+03:00',
  requestWindowState: 'running',
  responseDeadlineIso: '2026-09-15T18:00:00+03:00',
  requiredEvidence: [
    { id: 'refund-evidence-visit', label: 'مرجع الزيارة المرتبطة بالطلب', satisfied: true },
  ],
};

export const incompleteRefundEntitlement: RefundEntitlementProjection = {
  ...defaultRefundEntitlement,
  caseId: 'case-evidence-needed-006',
  requiredEvidence: [
    { id: 'refund-evidence-visit', label: 'مرجع الزيارة المرتبطة بالطلب', satisfied: true },
    { id: 'refund-evidence-support', label: 'مستند داعم مطلوب حسب السياسة', satisfied: false },
  ],
};

export const expiredRefundEntitlement: RefundEntitlementProjection = {
  ...defaultRefundEntitlement,
  caseId: 'case-expired-refund-007',
  requestWindowEndsAtIso: '2026-09-01T23:59:59+03:00',
  requestWindowState: 'lapsed',
};

export const ineligibleRefundEntitlement: RefundEntitlementProjection = {
  ...defaultRefundEntitlement,
  caseId: 'case-ineligible-refund-008',
  eligible: false,
};

export const unavailableSnapshotRefundEntitlement: RefundEntitlementProjection = {
  ...defaultRefundEntitlement,
  caseId: 'case-unavailable-terms-009',
  snapshotAvailable: false,
};

const evidenceIncompleteRefundClaim: PatientClaimDetail = {
  id: 'claim-refund-evidence-001',
  type: 'REFUND_REQUEST',
  caseId: 'case-restoration-001',
  serviceLabel: 'ترميم سن',
  providerName: 'عيادة النور السنية',
  state: 'EVIDENCE_INCOMPLETE',
  governingSnapshotId: 'terms-restoration-v2',
  governingSnapshotLabel: 'الشروط المالية المقبولة — الإصدار 2',
  narrative: 'أطلب مراجعة استرداد مرتبط بالزيارة المسجلة في هذه الحالة.',
  submittedAtIso: '2026-09-03T12:20:00+03:00',
  requestedAmount: 70000,
  currency: 'SYP',
  originalDeadlineIso: '2026-09-08T18:00:00+03:00',
  effectiveDeadlineIso: '2026-09-10T18:00:00+03:00',
  deadlineState: 'approaching',
  deadlineEvents: [
    {
      id: 'deadline-extension-001',
      kind: 'EXTENSION',
      occurredAtIso: '2026-09-05T09:10:00+03:00',
      reason: 'تم تمديد المهلة لإتاحة استكمال المستند المطلوب.',
      effectiveDeadlineIso: '2026-09-10T18:00:00+03:00',
    },
  ],
  evidenceRequirements: [
    {
      id: 'claim-evidence-001',
      label: 'مرجع الزيارة',
      state: 'ACCEPTED',
      reason: 'تم قبول هذا المرجع ضمن متطلبات الطلب.',
    },
    {
      id: 'claim-evidence-002',
      label: 'مستند داعم يوضح سبب الطلب',
      state: 'REJECTED',
      reason: 'المستند الحالي غير واضح بما يكفي، ويلزم استبداله قبل انتهاء المهلة.',
    },
  ],
  missingEvidenceCount: 1,
  appealEligible: false,
};

const underReviewProtectionClaim: PatientClaimDetail = {
  id: 'claim-protection-002',
  type: 'PROTECTION_CLAIM',
  caseId: 'case-protection-002',
  serviceLabel: 'زيارة متابعة',
  providerName: 'مركز الأمل لطب الأسنان',
  state: 'UNDER_REVIEW',
  governingSnapshotId: 'protection-snapshot-v1',
  governingSnapshotLabel: 'الحماية الفعّالة ضمن الشروط المقبولة',
  narrative: 'تم تقديم مطالبة حماية مرتبطة بالحالة، وكل المتطلبات المطلوبة مني مكتملة حاليًا.',
  submittedAtIso: '2026-09-02T11:15:00+03:00',
  originalDeadlineIso: '2026-09-14T16:00:00+03:00',
  effectiveDeadlineIso: '2026-09-14T16:00:00+03:00',
  deadlineState: 'running',
  deadlineEvents: [],
  evidenceRequirements: [
    {
      id: 'protection-evidence-001',
      label: 'المستند المطلوب من المريض',
      state: 'ACCEPTED',
      reason: 'تم قبول المستند المطلوب لهذه المطالبة.',
    },
  ],
  missingEvidenceCount: 0,
  appealEligible: false,
};

export const decidedRefundClaim: PatientClaimDetail = {
  id: 'claim-refund-decided-003',
  type: 'REFUND_REQUEST',
  caseId: 'case-refund-decided-003',
  serviceLabel: 'فحص أسنان دوري',
  providerName: 'عيادة النور السنية',
  state: 'DECIDED',
  governingSnapshotId: 'terms-exam-v1',
  governingSnapshotLabel: 'الشروط المالية المقبولة — الإصدار 1',
  narrative: 'طلب استرداد مرتبط بالزيارة المسجلة.',
  submittedAtIso: '2026-08-28T10:00:00+03:00',
  requestedAmount: 100000,
  currency: 'SYP',
  originalDeadlineIso: '2026-09-03T18:00:00+03:00',
  effectiveDeadlineIso: '2026-09-04T18:00:00+03:00',
  deadlineState: 'lapsed',
  deadlineEvents: [
    {
      id: 'deadline-pause-003',
      kind: 'PAUSE',
      occurredAtIso: '2026-09-01T14:00:00+03:00',
      reason: 'توقفت المهلة أثناء انتظار تحقق مسجل، ثم استؤنفت بموعد فعّال جديد.',
      effectiveDeadlineIso: '2026-09-04T18:00:00+03:00',
    },
  ],
  evidenceRequirements: [
    {
      id: 'decided-evidence-001',
      label: 'مرجع الزيارة',
      state: 'ACCEPTED',
      reason: 'تم قبول المتطلب.',
    },
  ],
  missingEvidenceCount: 0,
  appealEligible: true,
  appealWindowEndsAtIso: '2026-09-11T23:59:59+03:00',
  externalExecutionPending: true,
  decision: {
    reason: 'تمت الموافقة على تسجيل مبلغ مستحق للتنفيذ الخارجي وفق الشروط التي حكمت الطلب.',
    decidedAtIso: '2026-09-04T13:20:00+03:00',
    decidedByLabel: 'مراجع مطالبات مخوّل',
    approvedRefund: {
      amount: 100000,
      currency: 'SYP',
      externalExecutionStatus: 'PENDING_EXTERNAL_EXECUTION',
    },
  },
};

export const mixedEvidenceClaim: PatientClaimDetail = {
  ...evidenceIncompleteRefundClaim,
  id: 'claim-mixed-evidence-004',
  caseId: 'case-mixed-evidence-004',
  state: 'EVIDENCE_INCOMPLETE',
  evidenceRequirements: [
    {
      id: 'evidence-accepted',
      label: 'مرجع الزيارة',
      state: 'ACCEPTED',
      reason: 'تم قبول هذا المرجع.',
    },
    {
      id: 'evidence-missing',
      label: 'صورة مطلوبة للحالة',
      state: 'MISSING',
      reason: 'لم يصل هذا المستند بعد، ويلزم استكماله ضمن المهلة.',
    },
    {
      id: 'evidence-rejected',
      label: 'مستند داعم',
      state: 'REJECTED',
      reason: 'تم رفض هذا المستند لعدم وضوحه، ويلزم استبداله.',
    },
    {
      id: 'evidence-expired',
      label: 'توثيق سابق',
      state: 'EXPIRED',
      reason: 'انتهت صلاحية هذا التوثيق ولم يعد يحقق المتطلب.',
    },
  ],
  missingEvidenceCount: 3,
};

export const initialPatientClaims: PatientClaimDetail[] = [
  evidenceIncompleteRefundClaim,
  underReviewProtectionClaim,
  decidedRefundClaim,
];

export function claimSummary(claim: PatientClaimDetail): PatientClaimSummary {
  return {
    id: claim.id,
    type: claim.type,
    serviceLabel: claim.serviceLabel,
    state: claim.state,
    missingEvidenceCount: claim.missingEvidenceCount,
    effectiveDeadlineIso: claim.effectiveDeadlineIso,
    deadlineState: claim.deadlineState,
    appealEligible: claim.appealEligible,
    externalExecutionPending: claim.externalExecutionPending,
  };
}

function normalizedRefundDraft(draft: RefundRequestDraft) {
  const requestedAmount = Number(draft.requestedAmount.replace(/,/g, '').trim());
  return {
    requestedAmount,
    reason: draft.reason.trim(),
    occurrenceContext: draft.occurrenceContext?.trim() ?? '',
    evidenceIds: [...new Set(draft.evidenceIds)].sort(),
  };
}

function refundPayloadFingerprint(entitlement: RefundEntitlementProjection, draft: RefundRequestDraft): string {
  const normalized = normalizedRefundDraft(draft);
  return encodeURIComponent(JSON.stringify([
    entitlement.caseId,
    entitlement.governingSnapshotId,
    normalized.requestedAmount,
    entitlement.currency,
    normalized.reason,
    normalized.occurrenceContext,
    normalized.evidenceIds,
  ]));
}

/** Prototype-only projection helper for API-CLAIMS-001. */
export function submitRefundRequest(
  entitlement: RefundEntitlementProjection,
  draft: RefundRequestDraft,
  options: RefundSubmissionOptions,
): RefundSubmissionResult {
  const normalized = normalizedRefundDraft(draft);
  const nowIso = options.nowIso ?? CLAIMS_NOW_ISO;

  if (!Number.isFinite(normalized.requestedAmount) || normalized.requestedAmount <= 0 || !normalized.reason) {
    return { blockedBy: 'INVALID_INPUT' };
  }

  const fingerprint = refundPayloadFingerprint(entitlement, draft);
  const existingClaim = options.existingClaim;
  if (existingClaim && existingClaim.idempotencyKey === options.idempotencyKey) {
    if (existingClaim.payloadFingerprint === fingerprint) return { claim: existingClaim, reused: true };
    return { claim: existingClaim, blockedBy: 'IDEMPOTENCY_CONFLICT' };
  }

  if (!entitlement.snapshotAvailable) return { blockedBy: 'GOVERNING_SNAPSHOT_UNAVAILABLE' };
  if (!entitlement.eligible || normalized.requestedAmount > entitlement.maxRequestedAmount) return { blockedBy: 'INELIGIBLE' };
  if (new Date(entitlement.requestWindowEndsAtIso).getTime() <= new Date(nowIso).getTime()) return { blockedBy: 'WINDOW_EXPIRED' };

  const missingEvidence = entitlement.requiredEvidence.filter((item) => !item.satisfied || !normalized.evidenceIds.includes(item.id));
  if (missingEvidence.length > 0) return { blockedBy: 'EVIDENCE_INCOMPLETE' };

  const claim: PatientClaimDetail = {
    id: `claim-refund:${entitlement.caseId}`,
    type: 'REFUND_REQUEST',
    caseId: entitlement.caseId,
    serviceLabel: entitlement.serviceLabel,
    providerName: entitlement.providerName,
    state: 'SUBMITTED',
    governingSnapshotId: entitlement.governingSnapshotId,
    governingSnapshotLabel: entitlement.governingSnapshotLabel,
    narrative: normalized.reason,
    submittedAtIso: nowIso,
    requestedAmount: normalized.requestedAmount,
    currency: entitlement.currency,
    originalDeadlineIso: entitlement.responseDeadlineIso,
    effectiveDeadlineIso: entitlement.responseDeadlineIso,
    deadlineState: 'running',
    deadlineEvents: [],
    evidenceRequirements: entitlement.requiredEvidence.map((item) => ({
      id: item.id,
      label: item.label,
      state: 'ACCEPTED',
      reason: 'كان هذا المتطلب مستوفيًا عند تقديم الطلب.',
    })),
    missingEvidenceCount: 0,
    appealEligible: false,
    idempotencyKey: options.idempotencyKey,
    payloadFingerprint: fingerprint,
  };

  return { claim };
}
