import { View } from 'react-native';
import { Bdi } from '../foundations/Bdi';
import { formatDateTime, formatRemaining } from '../foundations/format';
import { Icon } from '../foundations/Icon';
import { BodyStrong, Helper } from '../foundations/Text';
import { borderWidth, chipVisual, radius, space, type Tone } from '../theme/tokens';

interface DeadlineIndicatorProps {
  deadlineIso: string;
  /** e.g. "الرد على طلب الحجز" — the obligation that ends, named rather than left implicit. */
  obligation: string;
  nowIso?: string;
  /** `approaching` comes from versioned policy; this component never invents a threshold. */
  state?: 'running' | 'approaching' | 'lapsed';
}

/**
 * CMP-PLATFORM-005 — Deadline indicator. A running window is informational, a policy-projected
 * approaching window is `warning`, and a lapsed one is `restricted`, never punitive `danger`.
 */
export function DeadlineIndicator({ deadlineIso, obligation, nowIso, state }: DeadlineIndicatorProps) {
  const resolvedState = state ?? (new Date(deadlineIso).getTime() <= new Date(nowIso ?? Date.now()).getTime() ? 'lapsed' : 'running');
  const tone: Tone = resolvedState === 'lapsed' ? 'restricted' : resolvedState === 'approaching' ? 'warning' : 'info';
  const visual = chipVisual(tone, resolvedState === 'lapsed' ? 'outline' : 'subtle');
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: space('inline-xs'),
        padding: space('inset-sm'),
        borderRadius: radius('surface'),
        backgroundColor: visual.background,
        borderWidth: borderWidth('hairline'),
        borderColor: visual.border,
      }}
    >
      <Icon name="clock" color={visual.icon} scale="sm" />
      <View style={{ flex: 1, gap: space('stack-xs') }}>
        <BodyStrong style={{ color: visual.text }}>{obligation}</BodyStrong>
        <Helper style={{ color: visual.text }}>
          {resolvedState === 'lapsed' ? 'انتهت المهلة' : <Bdi style={{ color: visual.text }}>{formatRemaining(deadlineIso, nowIso)}</Bdi>}
          {' · '}
          حتى <Bdi style={{ color: visual.text }}>{formatDateTime(deadlineIso)}</Bdi>
        </Helper>
      </View>
    </View>
  );
}
