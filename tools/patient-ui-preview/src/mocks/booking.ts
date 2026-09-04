export interface Slot {
  id: string;
  dayLabel: string;
  timeIso: string;
  available: boolean;
}

/** Deterministic advisory availability (API-ELIG-001). Resolved atomically only at commit. */
export function slotsFor(_optionId: string): Slot[] {
  return [
    { id: 'slot-1', dayLabel: 'الخميس، 4 أيلول', timeIso: '2026-09-04T10:00:00+03:00', available: true },
    { id: 'slot-2', dayLabel: 'الخميس، 4 أيلول', timeIso: '2026-09-04T16:30:00+03:00', available: true },
    { id: 'slot-3', dayLabel: 'الجمعة، 5 أيلول', timeIso: '2026-09-05T11:00:00+03:00', available: true },
    { id: 'slot-4', dayLabel: 'الجمعة، 5 أيلول', timeIso: '2026-09-05T13:00:00+03:00', available: false },
    { id: 'slot-5', dayLabel: 'السبت، 6 أيلول', timeIso: '2026-09-06T09:30:00+03:00', available: true },
  ];
}

export interface BookingRecord {
  id: string;
  state: 'REQUESTED' | 'CONFIRMED' | 'ALTERNATIVE_PROPOSED' | 'ELIGIBILITY_REVIEW' | 'REJECTED' | 'CANCELLED';
  optionId: string;
  slotIso: string;
  requestedAtIso: string;
  responseDeadlineIso: string;
  alternativeSlotIso?: string;
  alternativeResponseDeadlineIso?: string;
  stateReason?: string;
  allowedActions: Array<'cancel' | 'respond-alternative' | 'reschedule'>;
  history: { id: string; atIso: string; description: string }[];
}

let bookingSequence = 0;

/**
 * Mock projection of API-BOOKING-001's commit. Idempotency-keyed: the same key returns the same
 * booking rather than creating a duplicate, matching NFR-AUDIT-002.
 */
const committed = new Map<string, BookingRecord>();

export function submitBooking(optionId: string, slotIso: string, idempotencyKey: string): BookingRecord {
  const existing = committed.get(idempotencyKey);
  if (existing) {
    return existing;
  }
  bookingSequence += 1;
  const requestedAtIso = new Date().toISOString();
  const responseDeadlineIso = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const record: BookingRecord = {
    id: `BK-${1000 + bookingSequence}`,
    state: 'REQUESTED',
    optionId,
    slotIso,
    requestedAtIso,
    responseDeadlineIso,
    allowedActions: ['cancel'],
    history: [{ id: 'evt-1', atIso: requestedAtIso, description: 'تم إرسال طلب الحجز إلى العيادة.' }],
  };
  committed.set(idempotencyKey, record);
  return record;
}

export function getBooking(id: string): BookingRecord | undefined {
  for (const record of committed.values()) {
    if (record.id === id) return record;
  }
  return undefined;
}
