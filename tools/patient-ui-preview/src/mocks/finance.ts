export type FinancialEventState = 'REPORTED_UNCONFIRMED' | 'CONFIRMED' | 'DISPUTED';
export type FinancialEventDecision = 'confirm' | 'dispute';

export interface AcceptedFinancialLine {
  id: string;
  title: string;
  amount: number;
  note?: string;
}

export interface AcceptedFinancialTermsSnapshot {
  id: string;
  caseId: string;
  versionLabel: string;
  acceptedAtIso: string;
  serviceLabel: string;
  currency: string;
  lines: AcceptedFinancialLine[];
  total: number;
  complete: boolean;
  missingLabel?: string;
  dueSummary: string;
  cancellationSummary: string;
  refundSummary: string;
  protectionSummary: string;
  governingReferences: string[];
}

export interface FinancialEventResponse {
  label: string;
  atIso: string;
  attribution: string;
  summary: string;
}

export interface FinancialEventProjection {
  id: string;
  title: string;
  summary: string;
  amount: number;
  currency: string;
  status: FinancialEventState;
  occurredAtIso: string;
  recordedAtIso: string;
  attribution: string;
  externalMethodLabel?: string;
  response?: FinancialEventResponse;
  /** Projection-only actionability fact. Authorization is still server-side in production. */
  awaitingResponseByPatient?: boolean;
  /** Links an external refund-execution assertion back to the approved decision it satisfies. */
  approvedRefundDecisionId?: string;
  /** Existing evidence references only; this preview never invents a transfer mechanism. */
  evidenceIds?: string[];
}

export interface FinancialPositionProjection {
  currency: string;
  agreed: number;
  reported: number;
  confirmed: number;
  disputed: number;
  refunded: number;
  pendingExternalExecution: number;
  asOfIso: string;
}

export interface FinancialLedgerProjection {
  snapshot: AcceptedFinancialTermsSnapshot;
  events: FinancialEventProjection[];
  position: FinancialPositionProjection;
  completeHistory: boolean;
  gapLabel?: string;
}

export interface ExternalPaymentReportDraft {
  amount: number;
  currency: string;
  externalMethodCategory: string;
  occurredAtIso: string;
}

export interface ApprovedRefundDecisionProjection {
  id: string;
  caseId: string;
  approvedAtIso: string;
  amount: number;
  currency: string;
  sourceLabel: string;
  reasonSummary: string;
}

export interface ExternalRefundExecutionDraft {
  amount: number;
  currency: string;
  occurredAtIso: string;
  evidenceIds: string[];
}

export const acceptedFinancialTerms: AcceptedFinancialTermsSnapshot = {
  id: 'finance-snapshot-cleaning-v1',
  caseId: 'case-cleaning-002',
  versionLabel: 'الإصدار 1',
  acceptedAtIso: '2026-08-30T12:20:00+03:00',
  serviceLabel: 'تنظيف الأسنان',
  currency: 'SYP',
  lines: [
    {
      id: 'fin-line-cleaning',
      title: 'جلسة تنظيف الأسنان',
      amount: 120000,
      note: 'البند المقبول لهذه الحالة كما سُجّل عند اعتماد الخطة.',
    },
    {
      id: 'fin-line-fluoride',
      title: 'تطبيق الفلورايد',
      amount: 30000,
      note: 'بند إضافي مقبول ضمن نفس اللقطة المالية.',
    },
  ],
  total: 150000,
  complete: true,
  dueSummary: 'السداد يتم خارج UberTib مباشرة وفق الاتفاق مع العيادة؛ هذه الصفحة تسجّل الشروط فقط.',
  cancellationSummary: 'تُطبَّق شروط الإلغاء التي كانت مسجّلة في هذه اللقطة وقت القبول.',
  refundSummary: 'أي استرداد يُنفَّذ خارج UberTib ويظهر هنا لاحقًا كسجل للواقعة الخارجية.',
  protectionSummary: 'الحماية هنا شروط موثَّقة وليست تأمينًا أو ضمانًا لنتيجة مالية.',
  governingReferences: ['شروط الإلغاء — الإصدار 3', 'شروط الحماية — الإصدار 2'],
};

export const partialAcceptedFinancialTerms: AcceptedFinancialTermsSnapshot = {
  ...acceptedFinancialTerms,
  id: 'finance-snapshot-cleaning-v1-partial',
  lines: acceptedFinancialTerms.lines.slice(0, 1),
  complete: false,
  missingLabel: 'تعذّر تحميل أحد البنود المقبولة؛ لن نعرض إجماليًا قد يكون ناقصًا.',
};

export const approvedRefundDecision: ApprovedRefundDecisionProjection = {
  id: 'refund-decision-001',
  caseId: 'case-cleaning-002',
  approvedAtIso: '2026-09-05T10:00:00+03:00',
  amount: 20000,
  currency: 'SYP',
  sourceLabel: 'قرار استرداد معتمد للحالة',
  reasonSummary: 'أُقرّ استرداد هذا المبلغ، ويبقى التنفيذ الفعلي بين المريض والعيادة خارج UberTib.',
};

/** Existing evidence references supplied by the already-governed evidence boundary; no uploader is implied. */
export const refundExecutionEvidenceIds = ['evidence-refund-execution-001'];
export const refundExecutionEvidenceSummary = 'إثبات تنفيذ خارجي مرتبط بالسجل وجاهز كمرجع لهذه الواقعة.';

export const financialEvents: FinancialEventProjection[] = [
  {
    id: 'fin-event-001',
    title: 'سُجّلت واقعة مالية خارجية',
    summary: 'أبلغ المريض عن مبلغ دُفع للعيادة خارج UberTib.',
    amount: 100000,
    currency: 'SYP',
    status: 'CONFIRMED',
    occurredAtIso: '2026-09-01T13:00:00+03:00',
    recordedAtIso: '2026-09-01T13:06:00+03:00',
    attribution: 'المريض',
    externalMethodLabel: 'نقدًا خارج المنصة',
    response: {
      label: 'رد مسجَّل لاحقًا',
      atIso: '2026-09-02T10:15:00+03:00',
      attribution: 'العيادة',
      summary: 'أكدت العيادة صحة الواقعة المسجّلة. التأكيد يخص السجل، وليس تنفيذ دفع داخل UberTib.',
    },
  },
  {
    id: 'fin-event-002',
    title: 'سُجّلت واقعة مالية خارجية أخرى',
    summary: 'سجّلت العيادة واقعة مالية إضافية مرتبطة بهذه الحالة.',
    amount: 50000,
    currency: 'SYP',
    status: 'DISPUTED',
    occurredAtIso: '2026-09-03T16:10:00+03:00',
    recordedAtIso: '2026-09-03T16:18:00+03:00',
    attribution: 'العيادة',
    externalMethodLabel: 'واقعة خارجية مسجَّلة',
    response: {
      label: 'اعتراض مسجَّل لاحقًا',
      atIso: '2026-09-04T09:40:00+03:00',
      attribution: 'المريض',
      summary: 'اعترض المريض على دقة هذه الواقعة، لذلك تبقى منفصلة عن المبالغ المؤكدة.',
    },
  },
  {
    id: 'fin-event-003',
    title: 'أُبلغ عن استرداد نُفِّذ خارج المنصة',
    summary: 'سُجّلت واقعة استرداد خارجية مرتبطة بهذه الحالة وبقي تنفيذها خارج UberTib.',
    amount: 10000,
    currency: 'SYP',
    status: 'REPORTED_UNCONFIRMED',
    occurredAtIso: '2026-09-05T12:30:00+03:00',
    recordedAtIso: '2026-09-05T12:33:00+03:00',
    attribution: 'العيادة',
    externalMethodLabel: 'استرداد خارجي',
  },
];

/** A payment assertion from the clinic that is waiting for the Patient counterparty. */
export const awaitingPatientResponseEvent: FinancialEventProjection = {
  id: 'fin-event-awaiting-patient-001',
  title: 'واقعة مالية أبلغت عنها العيادة',
  summary: 'أبلغت العيادة أن مبلغًا دُفع لها خارج UberTib. يحتاج السجل إلى ردك على دقة هذه الواقعة.',
  amount: 20000,
  currency: 'SYP',
  status: 'REPORTED_UNCONFIRMED',
  occurredAtIso: '2026-09-06T15:20:00+03:00',
  recordedAtIso: '2026-09-06T15:28:00+03:00',
  attribution: 'العيادة',
  externalMethodLabel: 'نقدًا خارج المنصة',
  awaitingResponseByPatient: true,
};

export const financialPosition: FinancialPositionProjection = {
  currency: 'SYP',
  agreed: 150000,
  reported: 160000,
  confirmed: 100000,
  disputed: 50000,
  refunded: 10000,
  pendingExternalExecution: 20000,
  asOfIso: '2026-09-06T18:10:00+03:00',
};

export const financialLedger: FinancialLedgerProjection = {
  snapshot: acceptedFinancialTerms,
  events: financialEvents,
  position: financialPosition,
  completeHistory: true,
};

export const actionableFinancialLedger: FinancialLedgerProjection = {
  ...financialLedger,
  events: [...financialEvents, awaitingPatientResponseEvent],
  position: {
    ...financialPosition,
    reported: financialPosition.reported + awaitingPatientResponseEvent.amount,
  },
};

export const partialFinancialLedger: FinancialLedgerProjection = {
  ...financialLedger,
  events: financialEvents.slice(0, 2),
  completeHistory: false,
  gapLabel: 'تعذّر تحميل أحدث جزء من السجل المالي؛ الوضع المشتق مخفي حتى يكتمل السجل.',
};

export const emptyFinancialLedger: FinancialLedgerProjection = {
  ...financialLedger,
  events: [],
  position: {
    ...financialPosition,
    reported: 0,
    confirmed: 0,
    disputed: 0,
    refunded: 0,
    pendingExternalExecution: 0,
  },
};

function paymentReportCommandId(ledger: FinancialLedgerProjection, draft: ExternalPaymentReportDraft) {
  const commandKey = [
    ledger.snapshot.id,
    String(draft.amount),
    draft.currency.trim().toUpperCase(),
    draft.externalMethodCategory.trim(),
    draft.occurredAtIso.trim(),
  ].join('|');
  return `fin-event-patient-report:${encodeURIComponent(commandKey)}`;
}

/**
 * Prototype-only projection helper for API-FINANCE-002. The deterministic event id is scoped to the
 * governing snapshot plus the complete normalized draft, so only an identical simulated command is
 * deduplicated while a materially different report remains a new append-only event.
 */
export function appendPatientPaymentReport(
  ledger: FinancialLedgerProjection,
  draft: ExternalPaymentReportDraft,
): FinancialLedgerProjection {
  const id = paymentReportCommandId(ledger, draft);
  if (ledger.events.some((event) => event.id === id)) return ledger;

  const event: FinancialEventProjection = {
    id,
    title: 'سُجّلت واقعة مالية خارجية',
    summary: 'أبلغ المريض عن مبلغ دفعه للعيادة خارج UberTib.',
    amount: draft.amount,
    currency: draft.currency.trim().toUpperCase(),
    status: 'REPORTED_UNCONFIRMED',
    occurredAtIso: draft.occurredAtIso.trim(),
    recordedAtIso: '2026-09-06T18:30:00+03:00',
    attribution: 'المريض',
    externalMethodLabel: draft.externalMethodCategory.trim(),
  };

  return {
    ...ledger,
    events: [...ledger.events, event],
    position: {
      ...ledger.position,
      reported: ledger.position.reported + draft.amount,
      asOfIso: event.recordedAtIso,
    },
  };
}

/** Prototype-only projection helper for API-FINANCE-003. The assertion stays present and a response is appended. */
export function appendPatientFinancialResponse(
  ledger: FinancialLedgerProjection,
  eventId: string,
  decision: FinancialEventDecision,
  reason?: string,
): FinancialLedgerProjection {
  const target = ledger.events.find((event) => event.id === eventId);
  if (!target || target.response || !target.awaitingResponseByPatient) return ledger;

  const normalizedReason = reason?.trim();
  if (decision === 'dispute' && !normalizedReason) return ledger;

  const confirmed = decision === 'confirm';
  return {
    ...ledger,
    events: ledger.events.map((event) => event.id !== eventId ? event : {
      ...event,
      status: confirmed ? 'CONFIRMED' : 'DISPUTED',
      awaitingResponseByPatient: false,
      response: {
        label: confirmed ? 'تأكيد مسجَّل لاحقًا' : 'اعتراض مسجَّل لاحقًا',
        atIso: '2026-09-06T18:35:00+03:00',
        attribution: 'المريض',
        summary: confirmed
          ? 'أكد المريض دقة الواقعة كما سُجّلت. هذا يؤكد السجل فقط ولا ينفّذ أي دفع داخل UberTib.'
          : `اعترض المريض على دقة الواقعة. سبب الاعتراض: ${normalizedReason}`,
      },
    }),
    position: {
      ...ledger.position,
      confirmed: ledger.position.confirmed + (confirmed ? target.amount : 0),
      disputed: ledger.position.disputed + (confirmed ? 0 : target.amount),
      asOfIso: '2026-09-06T18:35:00+03:00',
    },
  };
}

function refundExecutionCommandId(
  decision: ApprovedRefundDecisionProjection,
  draft: ExternalRefundExecutionDraft,
) {
  const commandKey = [
    decision.id,
    String(draft.amount),
    draft.currency.trim().toUpperCase(),
    draft.occurredAtIso.trim(),
    [...draft.evidenceIds].sort().join(','),
  ].join('|');
  return `fin-event-refund-execution:${encodeURIComponent(commandKey)}`;
}

/**
 * Prototype-only projection helper for API-FINANCE-004. It appends an assertion only when the
 * approved decision belongs to this case and the reported amount/currency match that decision exactly.
 * One approved decision can own only one execution assertion; retries or changed duplicate attempts
 * remain no-ops in this local projection. The event remains REPORTED_UNCONFIRMED until counterparty response.
 */
export function appendPatientRefundExecution(
  ledger: FinancialLedgerProjection,
  decision: ApprovedRefundDecisionProjection,
  draft: ExternalRefundExecutionDraft,
): FinancialLedgerProjection {
  const normalizedCurrency = draft.currency.trim().toUpperCase();
  const decisionCurrency = decision.currency.trim().toUpperCase();
  const valid = decision.caseId === ledger.snapshot.caseId
    && draft.amount === decision.amount
    && normalizedCurrency === decisionCurrency
    && draft.occurredAtIso.trim().length > 0;
  if (!valid) return ledger;
  if (ledger.events.some((event) => event.approvedRefundDecisionId === decision.id)) return ledger;

  const id = refundExecutionCommandId(decision, draft);
  if (ledger.events.some((event) => event.id === id)) return ledger;

  const event: FinancialEventProjection = {
    id,
    title: 'أُبلغ عن تنفيذ استرداد خارج المنصة',
    summary: 'أبلغ المريض أن الاسترداد المعتمد نُفّذ خارج UberTib. تبقى هذه واقعة غير مؤكدة حتى يرد الطرف الآخر.',
    amount: draft.amount,
    currency: normalizedCurrency,
    status: 'REPORTED_UNCONFIRMED',
    occurredAtIso: draft.occurredAtIso.trim(),
    recordedAtIso: '2026-09-06T19:15:00+03:00',
    attribution: 'المريض',
    externalMethodLabel: 'تنفيذ استرداد خارجي',
    approvedRefundDecisionId: decision.id,
    evidenceIds: [...draft.evidenceIds],
  };

  return {
    ...ledger,
    events: [...ledger.events, event],
    position: {
      ...ledger.position,
      reported: ledger.position.reported + draft.amount,
      refunded: ledger.position.refunded + draft.amount,
      pendingExternalExecution: Math.max(0, ledger.position.pendingExternalExecution - draft.amount),
      asOfIso: event.recordedAtIso,
    },
  };
}
