import { findOption } from './eligibility';

export type BookingSummaryState =
  | 'REQUESTED'
  | 'ALTERNATIVE_PROPOSED'
  | 'CONFIRMED'
  | 'ELIGIBILITY_REVIEW'
  | 'REJECTED'
  | 'CANCELLED';

export interface PatientBookingSummary {
  id: string;
  state: BookingSummaryState;
  stateLabel: string;
  providerName: string;
  branchName: string;
  serviceLabel: string;
  appointmentIso: string;
  deadlineIso?: string;
  deadlineState?: 'running' | 'approaching' | 'lapsed';
  actionRequired: boolean;
  actionLabel?: string;
  subjectLabel?: string;
}

export type AlternativeDecisionState =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'expired'
  | 'capacity-conflict'
  | 'eligibility-conflict';

export interface AlternativeAppointmentProjection {
  bookingId: string;
  optionId: string;
  originalSlotIso: string;
  proposedSlotIso: string;
  responseDeadlineIso: string;
  decisionState: AlternativeDecisionState;
  idempotencyKey: string;
  originalRequestReadable: boolean;
}

export interface CancellationPolicyProjection {
  bookingId: string;
  optionId: string;
  appointmentIso: string;
  consequence?: string;
  reasonRequired: boolean;
  idempotencyKey: string;
}

export type RescheduleProposalState = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'WITHDRAWN';
export type RescheduleProposalActor = 'patient' | 'clinic';

export interface RescheduleProjection {
  bookingId: string;
  optionId: string;
  originalConfirmedSlotIso: string;
  proposedSlotIso?: string;
  proposalState?: RescheduleProposalState;
  proposalActor?: RescheduleProposalActor;
  responseDeadlineIso?: string;
  policyAllowsProposal: boolean;
  canRespond: boolean;
  canWithdraw: boolean;
  idempotencyKey?: string;
}

const provider = findOption('opt-1');
if (!provider) {
  throw new Error('Patient booking preview requires deterministic eligibility option opt-1.');
}

export const patientBookingSummaries: PatientBookingSummary[] = [
  {
    id: 'BK-2041',
    state: 'ALTERNATIVE_PROPOSED',
    stateLabel: 'عُرض موعد بديل',
    providerName: provider.providerName,
    branchName: provider.branchName,
    serviceLabel: provider.serviceLabel,
    appointmentIso: '2026-09-11T10:00:00+03:00',
    deadlineIso: '2026-09-10T21:30:00+03:00',
    deadlineState: 'approaching',
    actionRequired: true,
    actionLabel: 'اتخذ قرارًا بشأن الموعد البديل',
  },
  {
    id: 'BK-2033',
    state: 'CONFIRMED',
    stateLabel: 'مؤكَّد',
    providerName: provider.providerName,
    branchName: provider.branchName,
    serviceLabel: 'تنظيف وتلميع الأسنان',
    appointmentIso: '2026-09-14T12:30:00+03:00',
    actionRequired: false,
  },
  {
    id: 'BK-2028',
    state: 'REQUESTED',
    stateLabel: 'بانتظار تأكيد العيادة',
    providerName: provider.providerName,
    branchName: provider.branchName,
    serviceLabel: provider.serviceLabel,
    appointmentIso: '2026-09-16T09:30:00+03:00',
    deadlineIso: '2026-09-11T18:00:00+03:00',
    deadlineState: 'running',
    actionRequired: false,
  },
  {
    id: 'BK-1994',
    state: 'CANCELLED',
    stateLabel: 'لم يُؤكَّد الحجز',
    providerName: provider.providerName,
    branchName: provider.branchName,
    serviceLabel: provider.serviceLabel,
    appointmentIso: '2026-08-30T11:00:00+03:00',
    actionRequired: false,
  },
];

export const alternativeAppointmentPending: AlternativeAppointmentProjection = {
  bookingId: 'BK-2041',
  optionId: 'opt-1',
  originalSlotIso: '2026-09-11T10:00:00+03:00',
  proposedSlotIso: '2026-09-12T15:30:00+03:00',
  responseDeadlineIso: '2026-09-10T21:30:00+03:00',
  decisionState: 'pending',
  idempotencyKey: 'alt-decision-bk-2041',
  originalRequestReadable: true,
};

export const cancellationPolicyNoFee: CancellationPolicyProjection = {
  bookingId: 'BK-2033',
  optionId: 'opt-1',
  appointmentIso: '2026-09-14T12:30:00+03:00',
  consequence: 'وفق شروط هذا الحجز، إلغاؤه الآن يغلق الموعد المؤكد ولا يضيف رسوم إلغاء داخل المنصة.',
  reasonRequired: false,
  idempotencyKey: 'cancel-bk-2033',
};

export const cancellationPolicyReasonRequired: CancellationPolicyProjection = {
  ...cancellationPolicyNoFee,
  bookingId: 'BK-2034',
  reasonRequired: true,
  consequence: 'وفق شروط هذا الحجز، يجب تسجيل سبب الإلغاء قبل إنهاء الموعد. لا تنفذ المنصة أي حركة مالية من هذه الشاشة.',
};

export const rescheduleCreateProjection: RescheduleProjection = {
  bookingId: 'BK-2033',
  optionId: 'opt-1',
  originalConfirmedSlotIso: '2026-09-14T12:30:00+03:00',
  proposedSlotIso: '2026-09-15T16:00:00+03:00',
  policyAllowsProposal: true,
  canRespond: false,
  canWithdraw: false,
  idempotencyKey: 'reschedule-bk-2033-01',
};

export const reschedulePatientPending: RescheduleProjection = {
  ...rescheduleCreateProjection,
  proposalState: 'PENDING',
  proposalActor: 'patient',
  responseDeadlineIso: '2026-09-12T18:00:00+03:00',
  canWithdraw: true,
};

export const rescheduleClinicPending: RescheduleProjection = {
  ...rescheduleCreateProjection,
  proposalState: 'PENDING',
  proposalActor: 'clinic',
  responseDeadlineIso: '2026-09-12T18:00:00+03:00',
  canRespond: true,
};

export const rescheduleAccepted: RescheduleProjection = {
  ...rescheduleClinicPending,
  proposalState: 'ACCEPTED',
  canRespond: false,
  canWithdraw: false,
};

export const rescheduleDeclined: RescheduleProjection = {
  ...rescheduleClinicPending,
  proposalState: 'DECLINED',
  canRespond: false,
};

export const rescheduleExpired: RescheduleProjection = {
  ...rescheduleClinicPending,
  proposalState: 'EXPIRED',
  canRespond: false,
};

export const rescheduleWithdrawn: RescheduleProjection = {
  ...reschedulePatientPending,
  proposalState: 'WITHDRAWN',
  canWithdraw: false,
};
