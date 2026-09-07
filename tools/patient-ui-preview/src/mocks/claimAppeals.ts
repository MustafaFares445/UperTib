import { CLAIMS_NOW_ISO, type PatientClaimDetail } from './claims';

export type ClaimAppealState = 'SUBMITTED' | 'UNDER_REVIEW' | 'DECIDED';

export interface ClaimAppealProjection {
  id: string;
  claimId: string;
  state: ClaimAppealState;
  submittedAtIso: string;
  governingDecisionAtIso: string;
  governingPolicySnapshotLabel: string;
  appealWindowEndsAtIso: string;
  grounds?: string;
  evidenceIds?: string[];
  decisionReason?: string;
  decidedAtIso?: string;
  decidedByLabel?: string;
}

export interface ClaimAppealRecord extends ClaimAppealProjection {
  grounds: string;
  evidenceIds: string[];
  idempotencyKey: string;
  payloadFingerprint: string;
}

export interface ClaimAppealDraft {
  grounds: string;
  evidenceIds?: string[];
}

export type ClaimAppealBlock =
  | 'INVALID_INPUT'
  | 'DECISION_UNAVAILABLE'
  | 'NOT_AUTHORIZED'
  | 'POLICY_INELIGIBLE'
  | 'WINDOW_EXPIRED'
  | 'ACTIVE_APPEAL_EXISTS'
  | 'IDEMPOTENCY_CONFLICT';

export interface ClaimAppealSubmissionOptions {
  actorAuthorized: boolean;
  idempotencyKey: string;
  existingAppeal?: ClaimAppealRecord;
  projectionAppeal?: ClaimAppealProjection;
  nowIso?: string;
}

export interface ClaimAppealSubmissionResult {
  claim: PatientClaimDetail;
  appeal?: ClaimAppealRecord;
  blockedBy?: ClaimAppealBlock;
  reused?: boolean;
}

export const appealableProtectionDecisionClaim: PatientClaimDetail = {
  id: 'claim-protection-decision-017',
  type: 'PROTECTION_CLAIM',
  caseId: 'case-protection-decision-017',
  serviceLabel: 'زيارة متابعة علاجية',
  providerName: 'مركز الأمل لطب الأسنان',
  state: 'DECIDED',
  governingSnapshotId: 'protection-policy-snapshot-v2',
  governingSnapshotLabel: 'لقطة سياسة الحماية الحاكمة عند قبول الشروط — الإصدار 2',
  narrative: 'طُلبت مراجعة حالة ضمن الحماية المسجلة بعد زيارة المتابعة.',
  submittedAtIso: '2026-09-01T10:20:00+03:00',
  originalDeadlineIso: '2026-09-05T18:00:00+03:00',
  effectiveDeadlineIso: '2026-09-05T18:00:00+03:00',
  deadlineState: 'lapsed',
  deadlineEvents: [],
  evidenceRequirements: [
    {
      id: 'appealable-protection-evidence',
      label: 'المستند الداعم للحالة',
      state: 'ACCEPTED',
      reason: 'كان المتطلب مستوفيًا عند اتخاذ القرار.',
    },
  ],
  missingEvidenceCount: 0,
  appealEligible: true,
  appealWindowEndsAtIso: '2026-09-12T23:59:59+03:00',
  decision: {
    reason: 'لم تُقبل المطالبة لأن الوقائع المسجلة لم تحقق شرط النطاق في لقطة السياسة التي حكمت القرار.',
    decidedAtIso: '2026-09-05T15:40:00+03:00',
    decidedByLabel: 'مراجع مطالبات مخوّل',
  },
};

export const expiredClaimAppealDecision: PatientClaimDetail = {
  ...appealableProtectionDecisionClaim,
  id: 'claim-protection-decision-expired-018',
  caseId: 'case-protection-decision-expired-018',
  appealWindowEndsAtIso: '2026-09-06T23:59:59+03:00',
};

export const policyIneligibleClaimDecision: PatientClaimDetail = {
  ...appealableProtectionDecisionClaim,
  id: 'claim-protection-decision-no-appeal-019',
  caseId: 'case-protection-decision-no-appeal-019',
  appealEligible: false,
};

export const unreadClaimDecision: PatientClaimDetail = {
  ...appealableProtectionDecisionClaim,
  id: 'claim-protection-decision-unread-020',
  caseId: 'case-protection-decision-unread-020',
  decision: undefined,
};

export const defaultClaimAppealDraft: ClaimAppealDraft = {
  grounds: 'أطلب مراجعة تطبيق شرط النطاق على الوقائع المسجلة في هذه المطالبة وفق لقطة السياسة التي حكمت القرار.',
  evidenceIds: [],
};

function normalizeClaimAppealDraft(draft: ClaimAppealDraft) {
  return {
    grounds: draft.grounds.trim(),
    evidenceIds: [...new Set(draft.evidenceIds ?? [])].sort(),
  };
}

export function claimAppealPayloadFingerprint(claimId: string, draft: ClaimAppealDraft) {
  const normalized = normalizeClaimAppealDraft(draft);
  return encodeURIComponent(JSON.stringify([claimId, normalized.grounds, normalized.evidenceIds]));
}

/**
 * Prototype-only projection helper for API-CLAIMS-005.
 * The appeal is append-only. The original claim decision and the historical policy snapshot stay intact.
 */
export function submitClaimAppeal(
  claim: PatientClaimDetail,
  draft: ClaimAppealDraft,
  options: ClaimAppealSubmissionOptions,
): ClaimAppealSubmissionResult {
  const normalized = normalizeClaimAppealDraft(draft);
  const nowIso = options.nowIso ?? CLAIMS_NOW_ISO;

  if (!normalized.grounds) return { claim, blockedBy: 'INVALID_INPUT' };
  if (!claim.decision) return { claim, blockedBy: 'DECISION_UNAVAILABLE' };
  if (!options.actorAuthorized) return { claim, blockedBy: 'NOT_AUTHORIZED' };
  if (!claim.appealEligible) return { claim, blockedBy: 'POLICY_INELIGIBLE' };

  const fingerprint = claimAppealPayloadFingerprint(claim.id, normalized);
  const existing = options.existingAppeal;
  if (existing) {
    if (existing.idempotencyKey === options.idempotencyKey) {
      if (existing.payloadFingerprint === fingerprint) return { claim, appeal: existing, reused: true };
      return { claim, appeal: existing, blockedBy: 'IDEMPOTENCY_CONFLICT' };
    }
    return { claim, appeal: existing, blockedBy: 'ACTIVE_APPEAL_EXISTS' };
  }

  if (options.projectionAppeal) return { claim, blockedBy: 'ACTIVE_APPEAL_EXISTS' };

  const appealWindowEndsAtIso = claim.appealWindowEndsAtIso;
  if (!appealWindowEndsAtIso || new Date(appealWindowEndsAtIso).getTime() <= new Date(nowIso).getTime()) {
    return { claim, blockedBy: 'WINDOW_EXPIRED' };
  }

  const appeal: ClaimAppealRecord = {
    id: `claim-appeal:${claim.id}`,
    claimId: claim.id,
    state: 'SUBMITTED',
    submittedAtIso: nowIso,
    governingDecisionAtIso: claim.decision.decidedAtIso,
    governingPolicySnapshotLabel: claim.governingSnapshotLabel,
    appealWindowEndsAtIso,
    grounds: normalized.grounds,
    evidenceIds: normalized.evidenceIds,
    idempotencyKey: options.idempotencyKey,
    payloadFingerprint: fingerprint,
  };

  return { claim, appeal };
}

export const submittedClaimAppeal: ClaimAppealRecord = {
  id: 'claim-appeal:claim-protection-decision-017',
  claimId: appealableProtectionDecisionClaim.id,
  state: 'SUBMITTED',
  submittedAtIso: '2026-09-07T09:10:00+03:00',
  governingDecisionAtIso: appealableProtectionDecisionClaim.decision!.decidedAtIso,
  governingPolicySnapshotLabel: appealableProtectionDecisionClaim.governingSnapshotLabel,
  appealWindowEndsAtIso: appealableProtectionDecisionClaim.appealWindowEndsAtIso!,
  grounds: defaultClaimAppealDraft.grounds,
  evidenceIds: [],
  idempotencyKey: 'claim-appeal:protection-decision-017:attempt-1',
  payloadFingerprint: claimAppealPayloadFingerprint(appealableProtectionDecisionClaim.id, defaultClaimAppealDraft),
};

export const underReviewClaimAppeal: ClaimAppealProjection = {
  ...submittedClaimAppeal,
  state: 'UNDER_REVIEW',
};

export const decidedClaimAppeal: ClaimAppealProjection = {
  ...submittedClaimAppeal,
  state: 'DECIDED',
  decisionReason: 'أُعيدت مراجعة تطبيق السياسة تاريخيًا، وثُبّت القرار الأصلي مع توضيح سبب تطبيق شرط النطاق.',
  decidedAtIso: '2026-09-09T14:35:00+03:00',
  decidedByLabel: 'مراجع اعتراضات مستقل',
};
