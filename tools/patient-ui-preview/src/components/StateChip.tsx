import { View } from 'react-native';
import { Icon, type IconName } from '../foundations/Icon';
import { Label } from '../foundations/Text';
import { chipVisual, radius, space, stateTriple, type Emphasis, type Tone } from '../theme/tokens';

interface StateChipProps {
  machine: string;
  status: string;
  /** The Session 4 TXT-STATE-* label. The state channel itself carries no string. */
  label: string;
}

/**
 * CMP-PLATFORM-001 — State chip. One status of one machine, rendered as tone + icon + label
 * together — never a colour alone. `PENDING_EVALUATION` and `NOT_ELIGIBLE` resolve to different
 * tones and different icons, because conflating them is a requirement violation (FR-ELIG-008).
 */
export function StateChip({ machine, status, label }: StateChipProps) {
  const triple = stateTriple(machine, status);
  const visual = chipVisual(triple.tone, triple.emphasis);
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={label}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: space('inline-xs'),
        paddingHorizontal: space('inset-sm'),
        paddingVertical: space('inset-xs'),
        borderRadius: radius('chip'),
        borderWidth: 1,
        borderColor: visual.border,
        backgroundColor: visual.background,
      }}
    >
      <Icon name={triple.icon as IconName} color={visual.icon} scale="sm" />
      <Label style={{ color: visual.text }}>{label}</Label>
    </View>
  );
}

/** Exposed for components that need the raw triple without rendering a chip (e.g. tone-matched icons). */
export function resolveTriple(machine: string, status: string): { tone: Tone; icon: string; emphasis: Emphasis } {
  return stateTriple(machine, status);
}
