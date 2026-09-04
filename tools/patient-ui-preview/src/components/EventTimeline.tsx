import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Bdi } from '../foundations/Bdi';
import { formatDateTime } from '../foundations/format';
import { Icon } from '../foundations/Icon';
import { Body, BodyStrong, Helper } from '../foundations/Text';
import { borderWidth, color, size, space } from '../theme/tokens';

export interface TimelineEvent {
  id: string;
  atIso: string;
  description: string;
}

/**
 * CMP-PLATFORM-008 — Event timeline. Append-only history; no edit affordance is reachable from
 * it. Renders the booking's cancellation/no-show history on SCR-BOOKING-004.
 */
export function EventTimeline({ events, defaultExpanded = false }: { events: TimelineEvent[]; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  if (events.length === 0) {
    return <Helper>لا يوجد سجل أحداث سابق لهذا الحجز.</Helper>;
  }
  return (
    <View style={{ gap: space('stack-sm') }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${expanded ? 'إخفاء' : 'عرض'} سجل الحجز، ${events.length} ${events.length === 1 ? 'حدث' : 'أحداث'}`}
        onPress={() => setExpanded((value) => !value)}
        style={({ pressed }) => ({
          minHeight: size('target-primary'),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: space('inline-sm'),
          paddingVertical: space('inset-sm'),
          borderTopWidth: borderWidth('hairline'),
          borderBottomWidth: borderWidth('hairline'),
          borderColor: color('border.subtle'),
          backgroundColor: pressed ? color('action.secondary-hover') : 'transparent',
        })}
      >
        <BodyStrong>سجل الحجز ({events.length})</BodyStrong>
        <Icon name={expanded ? 'minus-circle' : 'plus-circle'} color={color('text.secondary')} />
      </Pressable>
      {expanded ? (
        <View accessibilityRole="list" style={{ gap: space('stack-sm') }}>
          {events.map((event, index) => (
            <View
              key={event.id}
              accessible
              style={{
                paddingBottom: space('stack-sm'),
                borderBottomWidth: index === events.length - 1 ? 0 : borderWidth('hairline'),
                borderBottomColor: color('border.subtle'),
                gap: space('stack-xs'),
              }}
            >
              <Helper><Bdi>{formatDateTime(event.atIso)}</Bdi></Helper>
              <Body>{event.description}</Body>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
