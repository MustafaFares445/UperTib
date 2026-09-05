import { View } from 'react-native';
import { Body, BodyStrong, Helper } from '../foundations/Text';
import { borderWidth, chipVisual, color, radius, space, stateTriple } from '../theme/tokens';
import { StateChip } from './StateChip';

interface StateSummaryProps {
  machine: string;
  status: string;
  label: string;
  meaning: string;
  nextStep: string;
  variant?: 'surface' | 'hero';
}

/** CMP-PLATFORM-002 patient variant: current state, meaning, and next step before related history. */
export function StateSummary({ machine, status, label, meaning, nextStep, variant = 'surface' }: StateSummaryProps) {
  const triple = stateTriple(machine, status);
  const visual = chipVisual(triple.tone, 'subtle');
  const hero = variant === 'hero';
  return (
    <View
      accessible
      accessibilityLiveRegion="polite"
      style={{
        gap: space('stack-sm'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: hero ? color('border.subtle') : visual.border,
        backgroundColor: hero ? color('surface.subtle') : visual.background,
      }}
    >
      <StateChip machine={machine} status={status} label={label} />
      <BodyStrong>{meaning}</BodyStrong>
      <View style={{ gap: space('stack-xs') }}>
        <Helper>الخطوة التالية</Helper>
        <Body>{nextStep}</Body>
      </View>
    </View>
  );
}
