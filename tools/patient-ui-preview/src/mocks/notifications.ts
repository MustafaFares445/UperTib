import { patientAttentionEntries, type PatientAttentionEntry } from './platform';

export const informationalNotification: PatientAttentionEntry = {
  id: 'notification-booking-confirmed',
  title: 'موعدك المؤكد جاهز للمراجعة',
  summary: 'تم تثبيت الموعد في السجل. افتحه لرؤية حالته الحالية وتفاصيله المحدثة.',
  resource: { kind: 'booking', id: 'BK-2033' },
  createdAtIso: '2026-09-10T16:05:00+03:00',
  read: true,
  actionRequired: false,
  status: { machine: 'booking', value: 'CONFIRMED', label: 'مؤكَّد' },
  deadlineKnown: true,
};

/** API-PLATFORM-002 preview projection in newest-first chronological order. */
export const patientNotificationEntries: PatientAttentionEntry[] = [
  informationalNotification,
  ...patientAttentionEntries,
].sort((a, b) => new Date(b.createdAtIso).getTime() - new Date(a.createdAtIso).getTime());

export const unreadPatientNotificationEntries = patientNotificationEntries.filter((entry) => !entry.read);
