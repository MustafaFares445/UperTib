import type { EvidenceRequirementProjection } from './evidence';
import {
  CLAIMS_NOW_ISO,
  type ClaimEvidenceRequirement,
  type ClaimWindowState,
  type PatientClaimDetail,
} from './claims';

export interface ProtectionEntitlementProjection {
  caseId: string;
  serviceLabel: string;
  providerName: string;
  governingSnapshotId: string;
  governingSnapshotLabel: string;
  snapshotAvailable: boolean;
  eligible: boolean;
  activeProtection: boolean;
  protectionLabel: string;
  protectionSummary: string;
  claimTypeCode: string;
  claimTypeLabel: string;
  claimWindowEndsAtIso: string;
  claimWindowState: ClaimWindowState;
  responseDeadlineIso: string;
  evidenceRequirements: EvidenceRequirementProjection[];
}

export interface ProtectionClaimDraft {
  requestedRemedy: string;
  narrative: string;
  evidenceIds: string[];
}

export type ProtectionSubmissionBlock =
  | 'INVALID_INPUT'
  | 'GOVERNING_SNAPSHOT_UNAVAILABLE'
  | 'ENTITLEMENT_UNAVAILABLE'
  | 'WINDOW_EXPIRED'
  | 'EVIDENCE_INCOMPLETE'
  | 'IDEMPOTENCY_CONFLICT';

export interface ProtectionSubmissionOptions {
  idempotencyKey: string;
  existingClaim?: PatientClaimDetail;
  nowIso?: string;
}

export interface ProtectionSubmissionResult {
  claim?: PatientClaimDetail;
  blockedBy?: ProtectionSubmissionBlock;
  reused?: boolean;
}

const acceptedEvidence: EvidenceRequirementProjection[] = [
  {
    id: 'protection-requirement-visit',
    title: 'مرجع الزيارة المرتبطة بالحالة',
    why: 'هذا المرجع مطلوب وفق لقطة الحماية التي حكمت الحالة عند قبول الشروط.',
    items: [
      {
        id: 'protection-evidence-visit-accepted',
        displayName: 'مرجع الزيارة',
        state: 'ACCEPTED',
        nextStep: 'لا يلزم إجراء آخر لهذا المتطلب.',
      },
    ],
  },
  {
    id: 'protection-requirement-support',
    title: 'مستند يدعم ما حدث',
    why: 'المتطلب مرتبط بهذه المطالبة فقط، ولا يفتح مساحة رفع عامة غير مرتبطة بمتطلب.',
    items: [
      {
        id: 'protection-evidence-support-accepted',
        displayName: 'مستند داعم للحالة',
        state: 'ACCEPTED',
        nextStep: 'تم قبول المستند لهذا المتطلب.',
      },
    ],
  },
];

export const defaultProtectionEntitlement: ProtectionEntitlementProjection = {
  caseId: 'case-protection-new-011',
  serviceLabel: 'زيارة متابعة علاجية',
  providerName: 'مركز الأمل لطب الأسنان',
  governingSnapshotId: 'protection-snapshot-accepted-v2',
  governingSnapshotLabel: 'الحماية الفعّالة ضمن الشروط المقبولة — الإصدار 2',
  snapshotAvailable: true,
  eligible: true,
  activeProtection: true,
  protectionLabel: 'حماية متابعة مرتبطة بالخطة المقبولة',
  protectionSummary: 'تشمل مراجعة الحالة عندما يقع الحدث ضمن النطاق والفترة المسجلين في الشروط المقبولة. الحماية مشروطة وليست تأمينًا أو تعويضًا مضمونًا.',
  claimTypeCode: 'PROTECTION_EVENT',
  claimTypeLabel: 'حالة ضمن الحماية المسجلة',
  claimWindowEndsAtIso: '2026-09-13T23:59:59+03:00',
  claimWindowState: 'running',
  responseDeadlineIso: '2026-09-17T18:00:00+03:00',
  evidenceRequirements: acceptedEvidence,
};

export const retryableProtectionEntitlement: ProtectionEntitlementProjection = {
  ...defaultProtectionEntitlement,
  caseId: 'case-protection-retryable-012',
  evidenceRequirements: [
    acceptedEvidence[0],
    {
      ...acceptedEvidence[1],
      items: [
        {
          id: 'protection-evidence-support-retryable',
          displayName: 'مستند داعم للحالة',
          state: 'FAILED_RETRYABLE',
          progress: 58,
          nextStep: 'أعد محاولة رفع الملف نفسه. فشل النقل لا يعني أن المستند رُفض بعد المراجعة.',
        },
      ],
    },
  ],
};

export const rejectedProtectionEntitlement: ProtectionEntitlementProjection = {
  ...defaultProtectionEntitlement,
  caseId: 'case-protection-rejected-013',
  evidenceRequirements: [
    acceptedEvidence[0],
    {
      ...acceptedEvidence[1],
      items: [
        {
          id: 'protection-evidence-support-rejected',
          displayName: 'مستند داعم للحالة',
          state: 'REJECTED',
          nextStep: 'استبدل المستند بملف يطابق المتطلب المسجل.',
          rejectionReason: 'المستند المرسل لا يوضح الواقعة المطلوبة لهذا المتطلب.',
        },
      ],
    },
  ],
};

export const scanningProtectionEntitlement: ProtectionEntitlementProjection = {
  ...defaultProtectionEntitlement,
  caseId: 'case-protection-scanning-014',
  evidenceRequirements: [
    acceptedEvidence[0],
    {
      ...acceptedEvidence[1],
      items: [
        {
          id: 'protection-evidence-support-scanning',
          displayName: 'مستند داعم للحالة',
          state: 'VALIDATING_SCANNING',
          nextStep: 'الملف قيد الفحص والتحقق ولا يُعد مقبولًا قبل انتهاء هذه الخطوة.',
        },
      ],
    },
  ],
};

export const unavailableProtectionEntitlement: ProtectionEntitlementProjection = {
  ...defaultProtectionEntitlement,
  caseId: 'case-protection-unavailable-015',
  activeProtection: false,
  eligible: false,
};

export const expiredProtectionEntitlement: ProtectionEntitlementProjection = {
  ...defaultProtectionEntitlement,
  caseId: 'case-protection-expired-016',
  claimWindowEndsAtIso: '2026-09-05T23:59:59+03:00',
  claimWindowState: 'lapsed',
};

function normalizedProtectionDraft(draft: ProtectionClaimDraft) {
  return {
    requestedRemedy: draft.requestedRemedy.trim(),
    narrative: draft.narrative.trim(),
    evidenceIds: [...new Set(draft.evidenceIds)].sort(),
  };
}

function protectionPayloadFingerprint(entitlement: ProtectionEntitlementProjection, draft: ProtectionClaimDraft) {
  const normalized = normalizedProtectionDraft(draft);
  return encodeURIComponent(JSON.stringify([
    entitlement.caseId,
    entitlement.governingSnapshotId,
    entitlement.claimTypeCode,
    normalized.requestedRemedy,
    normalized.narrative,
    normalized.evidenceIds,
  ]));
}

export function acceptedProtectionEvidenceIds(entitlement: ProtectionEntitlementProjection): string[] {
  return entitlement.evidenceRequirements.flatMap((requirement) =>
    requirement.items.filter((item) => item.state === 'ACCEPTED').map((item) => item.id),
  );
}

export function protectionEvidenceRequirements(entitlement: ProtectionEntitlementProjection): ClaimEvidenceRequirement[] {
  return entitlement.evidenceRequirements.map((requirement) => {
    const accepted = requirement.items.some((item) => item.state === 'ACCEPTED');
    const rejected = requirement.items.find((item) => item.state === 'REJECTED');
    const scanning = requirement.items.some((item) => item.state === 'VALIDATING_SCANNING' || item.state === 'UPLOADED');
    const retryable = requirement.items.some((item) => item.state === 'FAILED_RETRYABLE' || item.state === 'PAUSED' || item.state === 'UPLOADING');

    if (accepted) {
      return {
        id: requirement.id,
        label: requirement.title,
        state: 'ACCEPTED',
        reason: 'تم قبول مستند يحقق هذا المتطلب.',
      };
    }

    if (rejected) {
      return {
        id: requirement.id,
        label: requirement.title,
        state: 'REJECTED',
        reason: rejected.rejectionReason ?? 'المستند الحالي مرفوض ويلزم استبداله.',
      };
    }

    return {
      id: requirement.id,
      label: requirement.title,
      state: 'MISSING',
      reason: scanning
        ? 'الملف قيد الفحص ولم يُقبل بعد؛ لا يحسب هذا المتطلب كمستوفى الآن.'
        : retryable
          ? 'النقل غير مكتمل بعد؛ يمكنك متابعة الملف نفسه دون اعتباره مرفوضًا.'
          : 'لم يصل بعد مستند مقبول يحقق هذا المتطلب.',
    };
  });
}

/** Prototype-only projection helper for API-CLAIMS-002. */
export function submitProtectionClaim(
  entitlement: ProtectionEntitlementProjection,
  draft: ProtectionClaimDraft,
  options: ProtectionSubmissionOptions,
): ProtectionSubmissionResult {
  const normalized = normalizedProtectionDraft(draft);
  const nowIso = options.nowIso ?? CLAIMS_NOW_ISO;

  if (!normalized.requestedRemedy || !normalized.narrative) return { blockedBy: 'INVALID_INPUT' };

  const fingerprint = protectionPayloadFingerprint(entitlement, draft);
  const existing = options.existingClaim;
  if (existing && existing.idempotencyKey === options.idempotencyKey) {
    if (existing.payloadFingerprint === fingerprint) return { claim: existing, reused: true };
    return { claim: existing, blockedBy: 'IDEMPOTENCY_CONFLICT' };
  }

  if (!entitlement.snapshotAvailable) return { blockedBy: 'GOVERNING_SNAPSHOT_UNAVAILABLE' };
  if (!entitlement.eligible || !entitlement.activeProtection) return { blockedBy: 'ENTITLEMENT_UNAVAILABLE' };
  if (new Date(entitlement.claimWindowEndsAtIso).getTime() <= new Date(nowIso).getTime()) {
    return { blockedBy: 'WINDOW_EXPIRED' };
  }

  const requirementProjection = protectionEvidenceRequirements(entitlement);
  const acceptedIds = acceptedProtectionEvidenceIds(entitlement);
  const everyRequirementAccepted = requirementProjection.every((item) => item.state === 'ACCEPTED');
  const payloadCarriesAcceptedEvidence = acceptedIds.every((id) => normalized.evidenceIds.includes(id));
  if (!everyRequirementAccepted || !payloadCarriesAcceptedEvidence) return { blockedBy: 'EVIDENCE_INCOMPLETE' };

  const claim: PatientClaimDetail = {
    id: `claim-protection:${entitlement.caseId}`,
    type: 'PROTECTION_CLAIM',
    caseId: entitlement.caseId,
    serviceLabel: entitlement.serviceLabel,
    providerName: entitlement.providerName,
    state: 'SUBMITTED',
    governingSnapshotId: entitlement.governingSnapshotId,
    governingSnapshotLabel: entitlement.governingSnapshotLabel,
    narrative: `${entitlement.claimTypeLabel}: ${normalized.narrative}\nالمعالجة المطلوبة: ${normalized.requestedRemedy}`,
    submittedAtIso: nowIso,
    originalDeadlineIso: entitlement.responseDeadlineIso,
    effectiveDeadlineIso: entitlement.responseDeadlineIso,
    deadlineState: 'running',
    deadlineEvents: [],
    evidenceRequirements: requirementProjection,
    missingEvidenceCount: 0,
    appealEligible: false,
    idempotencyKey: options.idempotencyKey,
    payloadFingerprint: fingerprint,
  };

  return { claim };
}
