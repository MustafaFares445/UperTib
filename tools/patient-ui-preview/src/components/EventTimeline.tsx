import { View } from 'react-native';
import { Bdi } from '../foundations/Bdi';
import { formatDateTime } from '../foundations/format';
import { Body, Helper } from '../foundations/Text';
import { color, space } from '../theme/tokens';

export interface TimelineEvent {
  id: string;
  atIso: string;
  description: string;
}

/**
 * CMP-PLATFORM-008 — Event timeline. Append-only history; no edit affordance is reachable from
 * it. Renders the booking's cancellation/no-show history on SCR-BOOKING-004.
 */
export function EventTimeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <Helper>لا يوجد سجل أحداث سابق لهذا الحجز.</Helper>;
  }
  return (
    <View style={{ gap: space('stack-sm') }}>
      {events.map((event, index) => (
        <View
          key={event.id}
          style={{
            paddingBottom: space('stack-sm'),
            borderBottomWidth: index === events.length - 1 ? 0 : 1,
            borderBottomColor: color('border.subtle'),
            gap: space('stack-xs'),
          }}
        >
          <Helper>
            <Bdi>{formatDateTime(event.atIso)}</Bdi>
          </Helper>
          <Body>{event.description}</Body>
        </View>
      ))}
    </View>
  );
}
