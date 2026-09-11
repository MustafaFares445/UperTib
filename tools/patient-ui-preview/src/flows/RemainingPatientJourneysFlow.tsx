import { useState } from 'react';
import type { BookingRecord } from '../mocks/booking';
import {
  alternativeAppointmentPending,
  cancellationPolicyNoFee,
  patientBookingSummaries,
  rescheduleCreateProjection,
  reschedulePatientPending,
  type PatientBookingSummary,
  type RescheduleProjection,
} from '../mocks/bookingRemaining';
import { patientCases } from '../mocks/clinical';
import { findOption } from '../mocks/eligibility';
import { patientFollowUps } from '../mocks/followups';
import { patientNotificationEntries } from '../mocks/notifications';
import { patientAttentionEntries } from '../mocks/platform';
import { patientProfile } from '../mocks/profile';
import { activeGivenGrant, activeHeldGrant } from '../mocks/representation';
import { AlternativeAppointmentDecisionScreen } from '../screens/AlternativeAppointmentDecisionScreen';
import { BookingDetailScreen } from '../screens/BookingDetailScreen';
import { CancelBookingScreen } from '../screens/CancelBookingScreen';
import { CaseSummaryScreen } from '../screens/CaseSummaryScreen';
import { FamilyRepresentationScreen } from '../screens/FamilyRepresentationScreen';
import { FollowUpsScreen } from '../screens/FollowUpsScreen';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { NeedsAttentionScreen } from '../screens/NeedsAttentionScreen';
import { NotificationCentreScreen } from '../screens/NotificationCentreScreen';
import { PatientProfileScreen } from '../screens/PatientProfileScreen';
import { RescheduleRequestScreen } from '../screens/RescheduleRequestScreen';

const option = findOption('opt-1')!;

function bookingRecordFromSummary(summary: PatientBookingSummary): BookingRecord {
  const base: BookingRecord = {
    id: summary.id,
    state: summary.state,
    optionId: option.id,
    slotIso: summary.appointmentIso,
    requestedAtIso: '2026-09-09T09:00:00+03:00',
    responseDeadlineIso: summary.deadlineIso ?? '2026-09-12T18:00:00+03:00',
    allowedActions: [],
    history: [{ id: `${summary.id}-evt`, atIso: '2026-09-09T09:00:00+03:00', description: 'تمت إعادة قراءة هذا الحجز من سجله الموثوق.' }],
  };

  if (summary.state === 'ALTERNATIVE_PROPOSED') {
    return {
      ...base,
      allowedActions: ['respond-alternative', 'cancel'],
      alternativeSlotIso: alternativeAppointmentPending.proposedSlotIso,
      alternativeResponseDeadlineIso: alternativeAppointmentPending.responseDeadlineIso,
    };
  }
  if (summary.state === 'CONFIRMED') return { ...base, allowedActions: ['reschedule', 'cancel'] };
  if (summary.state === 'REQUESTED') return { ...base, allowedActions: ['cancel'] };
  return base;
}

const authoritativeReentryBooking: BookingRecord = {
  id: 'BK-2041',
  state: 'CONFIRMED',
  optionId: option.id,
  slotIso: alternativeAppointmentPending.proposedSlotIso,
  requestedAtIso: '2026-09-09T09:00:00+03:00',
  responseDeadlineIso: alternativeAppointmentPending.responseDeadlineIso,
  allowedActions: [],
  history: [
    {
      id: 'BK-2041-authoritative-confirmed',
      atIso: '2026-09-10T20:15:00+03:00',
      description: 'أصبح الموعد البديل مؤكدًا في السجل الموثوق بعد إنشاء عنصر الانتباه القديم.',
    },
  ],
};

function AttentionNotificationReentryFlow() {
  const [screen, setScreen] = useState<'attention' | 'notifications' | 'booking'>('attention');

  if (screen === 'booking') {
    return (
      <BookingDetailScreen
        booking={authoritativeReentryBooking}
        option={option}
        onCancelled={() => {}}
        onDone={() => setScreen('attention')}
      />
    );
  }

  if (screen === 'notifications') {
    return (
      <NotificationCentreScreen
        entries={patientNotificationEntries}
        onOpenNotification={(entry) => {
          if (entry.resource.kind === 'booking') setScreen('booking');
        }}
        onMarkRead={() => {}}
        onRefresh={() => {}}
      />
    );
  }

  return (
    <NeedsAttentionScreen
      entries={patientAttentionEntries}
      onOpenAttention={(entry) => {
        if (entry.resource.kind === 'booking') setScreen('booking');
      }}
      onRefresh={() => {}}
      onFindCare={() => {}}
      onOpenMyCare={() => {}}
      onOpenProfile={() => {}}
      onOpenNotifications={() => setScreen('notifications')}
    />
  );
}

function BookingChangeFlow() {
  const [screen, setScreen] = useState<'list' | 'detail' | 'alternative' | 'cancel' | 'reschedule'>('list');
  const [booking, setBooking] = useState<BookingRecord | undefined>();
  const [reschedule, setReschedule] = useState<RescheduleProjection>(rescheduleCreateProjection);

  const openSummary = (summary: PatientBookingSummary) => {
    setBooking(bookingRecordFromSummary(summary));
    setReschedule({ ...rescheduleCreateProjection, bookingId: summary.id, originalConfirmedSlotIso: summary.appointmentIso });
    setScreen('detail');
  };

  if (screen === 'alternative' && booking) {
    return (
      <AlternativeAppointmentDecisionScreen
        proposal={{ ...alternativeAppointmentPending, bookingId: booking.id, originalSlotIso: booking.slotIso }}
        option={option}
        onAccept={() => {
          setBooking({
            ...booking,
            state: 'CONFIRMED',
            slotIso: alternativeAppointmentPending.proposedSlotIso,
            allowedActions: ['reschedule', 'cancel'],
            alternativeSlotIso: undefined,
            alternativeResponseDeadlineIso: undefined,
            history: [...booking.history, { id: `${booking.id}-accepted`, atIso: '2026-09-10T20:15:00+03:00', description: 'تم قبول الموعد البديل وإعادة قراءة الحجز المحدث.' }],
          });
          setScreen('detail');
        }}
        onDecline={() => {
          setBooking({
            ...booking,
            state: 'CANCELLED',
            stateReason: 'ALTERNATIVE_DECLINED',
            allowedActions: [],
            history: [...booking.history, { id: `${booking.id}-declined`, atIso: '2026-09-10T20:15:00+03:00', description: 'تم رفض الموعد البديل وأُغلق الطلب دون موعد مؤكد.' }],
          });
          setScreen('detail');
        }}
        onFreshRequest={() => setScreen('list')}
        onRefresh={() => {}}
      />
    );
  }

  if (screen === 'cancel' && booking) {
    return (
      <CancelBookingScreen
        policy={{ ...cancellationPolicyNoFee, bookingId: booking.id, appointmentIso: booking.slotIso }}
        option={option}
        onKeepBooking={() => setScreen('detail')}
        onConfirmCancellation={() => {
          setBooking({
            ...booking,
            state: 'CANCELLED',
            stateReason: 'PATIENT_CANCELLED_CONFIRMED',
            allowedActions: [],
            history: [...booking.history, { id: `${booking.id}-cancelled`, atIso: '2026-09-10T20:20:00+03:00', description: 'تم إلغاء الحجز المؤكد بطلب المريض.' }],
          });
          setScreen('detail');
        }}
        onRefresh={() => {}}
      />
    );
  }

  if (screen === 'reschedule' && booking) {
    return (
      <RescheduleRequestScreen
        projection={reschedule}
        option={option}
        onCreateProposal={() => setReschedule({
          ...reschedulePatientPending,
          bookingId: booking.id,
          originalConfirmedSlotIso: booking.slotIso,
        })}
        onWithdrawProposal={() => setReschedule({ ...rescheduleCreateProjection, bookingId: booking.id, originalConfirmedSlotIso: booking.slotIso })}
        onRefresh={() => {}}
      />
    );
  }

  if (screen === 'detail' && booking) {
    return (
      <BookingDetailScreen
        booking={booking}
        option={option}
        onCancelled={() => setScreen('list')}
        onDone={() => setScreen('list')}
        onRespondAlternative={booking.state === 'ALTERNATIVE_PROPOSED' ? () => setScreen('alternative') : undefined}
        onReschedule={booking.state === 'CONFIRMED' ? () => setScreen('reschedule') : undefined}
        onCancelBooking={booking.state === 'CONFIRMED' ? () => setScreen('cancel') : undefined}
        onFindAlternative={() => setScreen('list')}
      />
    );
  }

  return <MyBookingsScreen bookings={patientBookingSummaries} onOpenBooking={openSummary} onRefresh={() => {}} />;
}

function ProfileRepresentationFlow() {
  const [screen, setScreen] = useState<'profile' | 'representation'>('profile');
  if (screen === 'representation') {
    return (
      <FamilyRepresentationScreen
        patientName={patientProfile.displayName}
        grants={[activeGivenGrant, activeHeldGrant]}
        onCreateGrant={() => {}}
        onOpenGrant={() => {}}
        onSwitchPatient={() => {}}
      />
    );
  }

  return (
    <PatientProfileScreen
      profile={patientProfile}
      onOpenRepresentation={() => setScreen('representation')}
      onOpenPendingSubmissions={() => {}}
      onOpenNotifications={() => {}}
      onRefresh={() => {}}
    />
  );
}

function FollowUpReentryFlow() {
  const [caseId, setCaseId] = useState<string | undefined>();
  const selectedCase = patientCases.find((item) => item.id === caseId);
  if (selectedCase) {
    return (
      <CaseSummaryScreen
        item={selectedCase}
        onOpenPlan={() => {}}
        onOpenTimeline={() => {}}
        onActOutstanding={() => {}}
      />
    );
  }

  return (
    <FollowUpsScreen
      followUps={patientFollowUps}
      onOpenFollowUp={(followUp) => setCaseId(followUp.caseId)}
      onRefresh={() => {}}
    />
  );
}

export type RemainingPatientJourney =
  | 'attention-notification-reentry'
  | 'booking-change'
  | 'profile-representation'
  | 'follow-up-reentry';

/** Phase 5 preview-only journey stitching over canonical screens; no production navigation library is selected here. */
export function RemainingPatientJourneysFlow({ journey }: { journey: RemainingPatientJourney }) {
  switch (journey) {
    case 'attention-notification-reentry':
      return <AttentionNotificationReentryFlow />;
    case 'booking-change':
      return <BookingChangeFlow />;
    case 'profile-representation':
      return <ProfileRepresentationFlow />;
    case 'follow-up-reentry':
      return <FollowUpReentryFlow />;
    default:
      return null;
  }
}
