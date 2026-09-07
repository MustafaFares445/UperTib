import type { EvidenceRequirementProjection } from './evidence';

export type RepresentationGrantStatus = 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
export type RepresentationDirection = 'GIVEN' | 'HELD';
export type GrantPeriodMode = 'BOUNDED' | 'OPEN_ENDED';

export interface RepresentationGrantProjection {
  id: string;
  direction: RepresentationDirection;
  subjectPatientName: string;
  granteeName: string;
  actions: string[];
  dataScope: string[];
  purpose: string;
  effectiveFromIso: string;
  effectiveUntilIso?: string;
  basisLabel: string;
  status: RepresentationGrantStatus;
  scopeResolved: boolean;
  revokedAtIso?: string;
  revocationReason?: string;
  historicalAttribution: string;
  idempotencyKey?: string;
  payloadFingerprint?: string;
}

export interface ConsentGrantDraft {
  subjectPatientName: string;
  granteeName: string;
  actions: string[];
  dataScope: string[];
  purpose: string;
  effectiveFromIso: string;
  periodMode: GrantPeriodMode;
  effectiveUntilIso?: string;
  legalOrGrantBasis: string;
}

export type ConsentGrantBlock =
  | 'INVALID_SCOPE'
  | 'INVALID_PERIOD'
  | 'NOT_AUTHORIZED_GRANTOR'
  | 'IDEMPOTENCY_CONFLICT';

export interface ConsentGrantResult {
  grant?: RepresentationGrantProjection;
  blockedBy?: ConsentGrantBlock;
  reused?: boolean;
}

export interface ActiveRepresentationContext {
  grantId: string;
  actingGuardianName: string;
  subjectPatientName: string;
  scopeSummary: string;
}

export const REPRESENTATION_NOW_ISO = '2026-09-07T09:00:00+03:00';

export const representationActionOptions = [
  { id: 'booking', label: 'إدارة الحجوزات ضمن النطاق' },
  { id: 'clinical-read', label: 'قراءة الحالة والخطة العلاجية' },
  { id: 'claims', label: 'متابعة المطالبات المسموح بها' },
] as const;

export const representationDataScopeOptions = [
  { id: 'appointments', label: 'الحجوزات والمواعيد' },
  { id: 'clinical-case', label: 'الحالة والخطة العلاجية' },
  { id: 'claims-records', label: 'سجلات المطالبات المرتبطة بالحالة' },
] as const;

const commonAttribution = 'كل إجراء سابق يبقى منسوبًا إلى الهوية التي نفّذته حتى بعد انتهاء الصلاحية.';

export const activeGivenGrant: RepresentationGrantProjection = {
  id: 'grant-given-001',
  direction: 'GIVEN',
  subjectPatientName: 'مصطفى فارس',
  granteeName: 'سارة فارس',
  actions: ['إدارة الحجوزات ضمن النطاق', 'قراءة الحالة والخطة العلاجية'],
  dataScope: ['الحجوزات والمواعيد', 'الحالة والخطة العلاجية'],
  purpose: 'المساعدة في متابعة المواعيد والخطة العلاجية أثناء السفر.',
  effectiveFromIso: '2026-08-20T09:00:00+03:00',
  effectiveUntilIso: '2026-10-20T23:59:59+03:00',
  basisLabel: 'موافقة مباشرة من المريض',
  status: 'ACCEPTED',
  scopeResolved: true,
  historicalAttribution: commonAttribution,
};

export const activeHeldGrant: RepresentationGrantProjection = {
  id: 'grant-held-002',
  direction: 'HELD',
  subjectPatientName: 'ليان فارس',
  granteeName: 'مصطفى فارس',
  actions: ['إدارة الحجوزات ضمن النطاق', 'قراءة الحالة والخطة العلاجية'],
  dataScope: ['الحجوزات والمواعيد', 'الحالة والخطة العلاجية'],
  purpose: 'متابعة الرعاية ضمن الصلاحية المعتمدة.',
  effectiveFromIso: '2026-08-15T11:00:00+03:00',
  effectiveUntilIso: '2027-08-15T23:59:59+03:00',
  basisLabel: 'صلاحية تم التحقق منها',
  status: 'ACCEPTED',
  scopeResolved: true,
  historicalAttribution: commonAttribution,
};

export const expiredGrant: RepresentationGrantProjection = {
  ...activeGivenGrant,
  id: 'grant-expired-003',
  granteeName: 'أحمد فارس',
  status: 'EXPIRED',
  effectiveFromIso: '2026-05-01T09:00:00+03:00',
  effectiveUntilIso: '2026-07-01T23:59:59+03:00',
  purpose: 'مساعدة مؤقتة خلال فترة علاج سابقة.',
};

export const revokedGrant: RepresentationGrantProjection = {
  ...activeGivenGrant,
  id: 'grant-revoked-004',
  granteeName: 'نور فارس',
  status: 'REVOKED',
  effectiveFromIso: '2026-06-10T09:00:00+03:00',
  effectiveUntilIso: undefined,
  revokedAtIso: '2026-08-01T14:30:00+03:00',
  revocationReason: 'انتهت الحاجة إلى التمثيل.',
  purpose: 'متابعة مؤقتة للمواعيد.',
};

export const unresolvedScopeGrant: RepresentationGrantProjection = {
  ...activeGivenGrant,
  id: 'grant-unresolved-005',
  granteeName: 'مها فارس',
  scopeResolved: false,
  actions: [],
  dataScope: [],
  purpose: 'تعذّر تحميل النطاق الكامل لهذه الصلاحية.',
};

export const initialRepresentationGrants: RepresentationGrantProjection[] = [
  activeGivenGrant,
  activeHeldGrant,
  expiredGrant,
  revokedGrant,
];

function normalizeGrantDraft(draft: ConsentGrantDraft) {
  return {
    subjectPatientName: draft.subjectPatientName.trim(),
    granteeName: draft.granteeName.trim(),
    actions: [...new Set(draft.actions)].sort(),
    dataScope: [...new Set(draft.dataScope)].sort(),
    purpose: draft.purpose.trim(),
    effectiveFromIso: draft.effectiveFromIso,
    periodMode: draft.periodMode,
    effectiveUntilIso: draft.periodMode === 'BOUNDED' ? draft.effectiveUntilIso : undefined,
    legalOrGrantBasis: draft.legalOrGrantBasis.trim(),
  };
}

function grantFingerprint(draft: ConsentGrantDraft) {
  const normalized = normalizeGrantDraft(draft);
  return encodeURIComponent(JSON.stringify(normalized));
}

/** Prototype-only projection helper for the adult-consent API-IDENTITY-004 path. */
export function createConsentGrant(
  draft: ConsentGrantDraft,
  options: {
    idempotencyKey: string;
    actorIsGrantor: boolean;
    existingGrant?: RepresentationGrantProjection;
  },
): ConsentGrantResult {
  const normalized = normalizeGrantDraft(draft);
  const fingerprint = grantFingerprint(draft);

  if (options.existingGrant?.idempotencyKey === options.idempotencyKey) {
    if (options.existingGrant.payloadFingerprint === fingerprint) {
      return { grant: options.existingGrant, reused: true };
    }
    return { grant: options.existingGrant, blockedBy: 'IDEMPOTENCY_CONFLICT' };
  }

  if (!options.actorIsGrantor) return { blockedBy: 'NOT_AUTHORIZED_GRANTOR' };
  if (
    !normalized.subjectPatientName
    || !normalized.granteeName
    || normalized.actions.length === 0
    || normalized.dataScope.length === 0
    || !normalized.purpose
    || !normalized.effectiveFromIso
    || !normalized.legalOrGrantBasis
  ) {
    return { blockedBy: 'INVALID_SCOPE' };
  }

  if (normalized.periodMode === 'BOUNDED') {
    if (!normalized.effectiveUntilIso) return { blockedBy: 'INVALID_PERIOD' };
    if (new Date(normalized.effectiveUntilIso).getTime() <= new Date(normalized.effectiveFromIso).getTime()) {
      return { blockedBy: 'INVALID_PERIOD' };
    }
  }

  return {
    grant: {
      id: `grant-consent:${encodeURIComponent(normalized.granteeName)}`,
      direction: 'GIVEN',
      subjectPatientName: normalized.subjectPatientName,
      granteeName: normalized.granteeName,
      actions: normalized.actions,
      dataScope: normalized.dataScope,
      purpose: normalized.purpose,
      effectiveFromIso: normalized.effectiveFromIso,
      effectiveUntilIso: normalized.effectiveUntilIso,
      basisLabel: normalized.legalOrGrantBasis,
      status: 'ACCEPTED',
      scopeResolved: true,
      historicalAttribution: commonAttribution,
      idempotencyKey: options.idempotencyKey,
      payloadFingerprint: fingerprint,
    },
  };
}

/**
 * Prototype-only API-IDENTITY-005 projection. `downstreamRecordState` is deliberately ignored:
 * booking, case and claim state may never gate representation revocation.
 */
export function revokeRepresentationGrant(
  grant: RepresentationGrantProjection,
  options: {
    actorAuthorized: boolean;
    reason?: string;
    nowIso?: string;
    downstreamRecordState?: string;
  },
): { grant: RepresentationGrantProjection; blockedBy?: 'NOT_AUTHORIZED' | 'ALREADY_INACTIVE'; reused?: boolean } {
  if (!options.actorAuthorized) return { grant, blockedBy: 'NOT_AUTHORIZED' };
  if (grant.status === 'REVOKED') return { grant, reused: true };
  if (grant.status === 'EXPIRED') return { grant, blockedBy: 'ALREADY_INACTIVE' };

  return {
    grant: {
      ...grant,
      status: 'REVOKED',
      revokedAtIso: options.nowIso ?? REPRESENTATION_NOW_ISO,
      revocationReason: options.reason?.trim() || 'ألغى صاحب الصلاحية التمثيل.',
    },
  };
}

/** Display-context selection only. This helper intentionally creates no grant and no authorization. */
export function selectRepresentationContext(
  grant: RepresentationGrantProjection,
  actingGuardianName: string,
): ActiveRepresentationContext | undefined {
  if (grant.direction !== 'HELD' || grant.status !== 'ACCEPTED' || !grant.scopeResolved) return undefined;
  return {
    grantId: grant.id,
    actingGuardianName,
    subjectPatientName: grant.subjectPatientName,
    scopeSummary: [...grant.actions, ...grant.dataScope].join('، '),
  };
}

export type DependentRepresentationRequestState = 'DRAFT' | 'SUBMITTED' | 'CHANGES_REQUESTED' | 'APPROVED' | 'REJECTED';

export interface DependentRepresentationDraft {
  subjectIdentification: string;
  relationship: string;
  legalBasis: string;
  requestedActions: string[];
  requestedDataScope: string[];
  purpose: string;
  evidenceIds: string[];
}

export interface DependentRepresentationRequest {
  id: string;
  state: DependentRepresentationRequestState;
  draft: DependentRepresentationDraft;
  evidenceRequirements: EvidenceRequirementProjection[];
  submittedAtIso?: string;
  decisionReason?: string;
  idempotencyKey?: string;
  payloadFingerprint?: string;
}

const acceptedDependentEvidence: EvidenceRequirementProjection[] = [
  {
    id: 'dependent-id-requirement',
    title: 'إثبات هوية التابع',
    why: 'هذا المستند مرتبط بطلب التحقق من التمثيل ولا يمنح أي صلاحية بمجرد رفعه.',
    items: [{
      id: 'dependent-id-accepted',
      displayName: 'إثبات هوية التابع',
      state: 'ACCEPTED',
      nextStep: 'تم قبول المستند لهذا المتطلب.',
    }],
  },
  {
    id: 'dependent-basis-requirement',
    title: 'إثبات العلاقة أو الأساس القانوني',
    why: 'يحتاج المراجع البشري إلى هذا الإثبات قبل أن يقرر إنشاء أي صلاحية.',
    items: [{
      id: 'dependent-basis-accepted',
      displayName: 'مستند العلاقة أو الأساس القانوني',
      state: 'ACCEPTED',
      nextStep: 'تم قبول المستند لهذا المتطلب.',
    }],
  },
];

export const defaultDependentEvidenceRequirements = acceptedDependentEvidence;

export const scanningDependentEvidenceRequirements: EvidenceRequirementProjection[] = [
  acceptedDependentEvidence[0],
  {
    ...acceptedDependentEvidence[1],
    items: [{
      id: 'dependent-basis-scanning',
      displayName: 'مستند العلاقة أو الأساس القانوني',
      state: 'VALIDATING_SCANNING',
      nextStep: 'الملف قيد الفحص ولا يحقق المتطلب قبل القبول.',
    }],
  },
];

export const retryableDependentEvidenceRequirements: EvidenceRequirementProjection[] = [
  acceptedDependentEvidence[0],
  {
    ...acceptedDependentEvidence[1],
    items: [{
      id: 'dependent-basis-retryable',
      displayName: 'مستند العلاقة أو الأساس القانوني',
      state: 'FAILED_RETRYABLE',
      progress: 44,
      nextStep: 'استأنف رفع الملف نفسه؛ تعذر النقل لا يعني أن الطلب أو المستند رُفض.',
    }],
  },
];

export const rejectedDependentEvidenceRequirements: EvidenceRequirementProjection[] = [
  acceptedDependentEvidence[0],
  {
    ...acceptedDependentEvidence[1],
    items: [{
      id: 'dependent-basis-rejected',
      displayName: 'مستند العلاقة أو الأساس القانوني',
      state: 'REJECTED',
      nextStep: 'استبدل الملف بمستند يوضح العلاقة المطلوبة.',
      rejectionReason: 'المستند الحالي لا يوضح العلاقة أو الأساس القانوني المطلوب للتحقق.',
    }],
  },
];

export function acceptedDependentEvidenceIds(requirements: EvidenceRequirementProjection[]): string[] {
  return requirements.flatMap((requirement) =>
    requirement.items.filter((item) => item.state === 'ACCEPTED').map((item) => item.id),
  );
}

function everyDependentRequirementAccepted(requirements: EvidenceRequirementProjection[]): boolean {
  return requirements.every((requirement) => requirement.items.some((item) => item.state === 'ACCEPTED'));
}

function dependentFingerprint(draft: DependentRepresentationDraft) {
  return encodeURIComponent(JSON.stringify({
    subjectIdentification: draft.subjectIdentification.trim(),
    relationship: draft.relationship.trim(),
    legalBasis: draft.legalBasis.trim(),
    requestedActions: [...new Set(draft.requestedActions)].sort(),
    requestedDataScope: [...new Set(draft.requestedDataScope)].sort(),
    purpose: draft.purpose.trim(),
    evidenceIds: [...new Set(draft.evidenceIds)].sort(),
  }));
}

/** Prototype-only projection helper for API-IDENTITY-006. Success creates a request, never a grant. */
export function submitDependentRepresentationRequest(
  draft: DependentRepresentationDraft,
  requirements: EvidenceRequirementProjection[],
  options: { idempotencyKey: string; existingRequest?: DependentRepresentationRequest; nowIso?: string },
): { request?: DependentRepresentationRequest; blockedBy?: 'INVALID_INPUT' | 'EVIDENCE_INCOMPLETE' | 'IDEMPOTENCY_CONFLICT'; reused?: boolean } {
  const fingerprint = dependentFingerprint(draft);
  if (options.existingRequest?.idempotencyKey === options.idempotencyKey) {
    if (options.existingRequest.payloadFingerprint === fingerprint) {
      return { request: options.existingRequest, reused: true };
    }
    return { request: options.existingRequest, blockedBy: 'IDEMPOTENCY_CONFLICT' };
  }

  if (
    !draft.subjectIdentification.trim()
    || !draft.relationship.trim()
    || !draft.legalBasis.trim()
    || draft.requestedActions.length === 0
    || draft.requestedDataScope.length === 0
    || !draft.purpose.trim()
  ) {
    return { blockedBy: 'INVALID_INPUT' };
  }

  const acceptedIds = acceptedDependentEvidenceIds(requirements);
  const payloadIncludesAccepted = acceptedIds.every((id) => draft.evidenceIds.includes(id));
  if (!everyDependentRequirementAccepted(requirements) || !payloadIncludesAccepted) {
    return { blockedBy: 'EVIDENCE_INCOMPLETE' };
  }

  return {
    request: {
      id: `dependent-request:${encodeURIComponent(draft.subjectIdentification.trim())}`,
      state: 'SUBMITTED',
      draft: {
        ...draft,
        subjectIdentification: draft.subjectIdentification.trim(),
        relationship: draft.relationship.trim(),
        legalBasis: draft.legalBasis.trim(),
        purpose: draft.purpose.trim(),
        requestedActions: [...new Set(draft.requestedActions)],
        requestedDataScope: [...new Set(draft.requestedDataScope)],
        evidenceIds: [...new Set(draft.evidenceIds)],
      },
      evidenceRequirements: requirements,
      submittedAtIso: options.nowIso ?? REPRESENTATION_NOW_ISO,
      idempotencyKey: options.idempotencyKey,
      payloadFingerprint: fingerprint,
    },
  };
}

export const submittedDependentRequest: DependentRepresentationRequest = {
  id: 'dependent-request-submitted-001',
  state: 'SUBMITTED',
  draft: {
    subjectIdentification: 'ليان فارس — مواليد 2014',
    relationship: 'ولي أمر',
    legalBasis: 'طلب تمثيل تابع يحتاج تحققًا بشريًا',
    requestedActions: ['إدارة الحجوزات ضمن النطاق', 'قراءة الحالة والخطة العلاجية'],
    requestedDataScope: ['الحجوزات والمواعيد', 'الحالة والخطة العلاجية'],
    purpose: 'متابعة الرعاية الصحية للتابع.',
    evidenceIds: acceptedDependentEvidenceIds(acceptedDependentEvidence),
  },
  evidenceRequirements: acceptedDependentEvidence,
  submittedAtIso: '2026-09-07T08:30:00+03:00',
};

export const changesRequestedDependentRequest: DependentRepresentationRequest = {
  ...submittedDependentRequest,
  id: 'dependent-request-changes-002',
  state: 'CHANGES_REQUESTED',
  decisionReason: 'يلزم مستند أوضح يبين العلاقة القانونية بالتابع قبل متابعة التحقق.',
};

export const rejectedDependentRequest: DependentRepresentationRequest = {
  ...submittedDependentRequest,
  id: 'dependent-request-rejected-003',
  state: 'REJECTED',
  decisionReason: 'لم يثبت الطلب أساسًا قانونيًا يتيح إنشاء صلاحية تمثيل.',
};

export const approvedDependentRequest: DependentRepresentationRequest = {
  ...submittedDependentRequest,
  id: 'dependent-request-approved-004',
  state: 'APPROVED',
  decisionReason: 'تم التحقق البشري واعتماد النطاق المطلوب. تظهر الصلاحية المنشأة الآن في شاشة العائلة والتمثيل.',
};
