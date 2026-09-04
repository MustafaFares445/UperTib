import { View } from 'react-native';
import { Icon, type IconName } from '../foundations/Icon';
import { Body, Heading4 } from '../foundations/Text';
import { ActionBar, type ActionSpec } from './ActionBar';
import { chipVisual, space, type Tone } from '../theme/tokens';

export type RecoveryVariant =
  | 'fetch-failure'
  | 'stale'
  | 'permission-denied'
  | 'authentication-required'
  | 'unknown-outcome'
  | 'not-retryable';

const VARIANT_TONE: Record<RecoveryVariant, Tone> = {
  'fetch-failure': 'warning',
  stale: 'warning',
  'permission-denied': 'restricted',
  'authentication-required': 'restricted',
  'not-retryable': 'restricted',
  'unknown-outcome': 'info',
};

const VARIANT_ICON: Record<RecoveryVariant, IconName> = {
  'fetch-failure': 'exclamation-triangle',
  stale: 'arrow-path',
  'permission-denied': 'no-symbol',
  'authentication-required': 'lock-closed',
  'not-retryable': 'stop-circle',
  'unknown-outcome': 'exclamation-circle',
};

interface RecoveryStateProps {
  variant: RecoveryVariant;
  /** What failed. The canonical ERR-* message, quoted verbatim, never reworded. */
  whatFailed: string;
  /** What is still true — the preserved safe context. Omit only when nothing survived the failure. */
  stillTrue?: string;
  /** What to do now, matched to this ERR-*'s retry matrix rather than a uniform "try again". */
  guidance?: string;
  action?: ActionSpec;
  asOf?: string;
}

/**
 * CMP-PLATFORM-010 — Recovery state. Says what could not be done, preserves the safe context that
 * is still known, and offers the recovery that actually exists. Permission denial is a designed
 * state here, not an assumed impossibility (COMPONENT_INVENTORY_PLATFORM.md).
 */
export function RecoveryState({ variant, whatFailed, stillTrue, guidance, action, asOf }: RecoveryStateProps) {
  const tone = VARIANT_TONE[variant];
  const visual = chipVisual(tone, 'subtle');
  return (
    <View
      accessible
      accessibilityLiveRegion="assertive"
      style={{
        gap: space('stack-sm'),
        padding: space('inset-lg'),
        backgroundColor: visual.background,
        borderWidth: 1,
        borderColor: visual.border,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space('inline-xs') }}>
        <Icon name={VARIANT_ICON[variant]} color={visual.icon} />
        <Heading4>{whatFailed}</Heading4>
      </View>
      {stillTrue ? <Body>{stillTrue}</Body> : null}
      {asOf ? <Body tone="secondary">{asOf}</Body> : null}
      {guidance ? <Body tone="secondary">{guidance}</Body> : null}
      {action ? <ActionBar actions={[action]} /> : null}
    </View>
  );
}
