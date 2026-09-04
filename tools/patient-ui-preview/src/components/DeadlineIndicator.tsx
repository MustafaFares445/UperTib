import { View } from 'react-native';
import { Bdi } from '../foundations/Bdi';
import { formatRemaining } from '../foundations/format';
import { Icon } from '../foundations/Icon';
import { Body } from '../foundations/Text';
import { chipVisual, space, type Tone } from '../theme/tokens';

interface DeadlineIndicatorProps {
  deadlineIso: string;
  /** e.g. "الرد على طلب الحجز" — the obligation that ends, named rather than left implicit. */
  obligation: string;
  nowIso?: string;
}

/**
 * CMP-PLATFORM-005 — Deadline indicator. A running window is `warning`; a lapsed one is
 * `restricted`, never a punitive "danger" — a non-confirmation is never a punitive cancellation.
 */
export function DeadlineIndicator({ deadlineIso, obligation, nowIso }: DeadlineIndicatorProps) {
  const lapsed = new Date(deadlineIso).getTime() <= new Date(nowIso ?? Date.now()).getTime();
  const tone: Tone = lapsed ? 'restricted' : 'warning';
  const visual = chipVisual(tone, lapsed ? 'outline' : 'solid');
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space('inline-xs'),
        paddingHorizontal: space('inset-sm'),
        paddingVertical: space('inset-xs'),
        backgroundColor: visual.background,
        borderWidth: 1,
        borderColor: visual.border,
      }}
    >
      <Icon name="clock" color={visual.icon} scale="sm" />
      <Body style={{ color: visual.text }}>
        {obligation} — <Bdi style={{ color: visual.text }}>{formatRemaining(deadlineIso, nowIso)}</Bdi>
      </Body>
    </View>
  );
}
