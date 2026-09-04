import { View } from 'react-native';
import { Icon, type IconName } from '../foundations/Icon';
import { Body, Heading4 } from '../foundations/Text';
import { ActionBar, type ActionSpec } from './ActionBar';
import { color, space } from '../theme/tokens';

export type EmptyStateVariant = 'no-data' | 'filtered-empty' | 'not-yet' | 'between-cases';

interface EmptyStateProps {
  variant: EmptyStateVariant;
  icon?: IconName;
  statement: string;
  reason?: string;
  action?: ActionSpec;
}

/**
 * CMP-PLATFORM-009 — Empty state. Says plainly there is nothing here and gives the one action that
 * changes it. Never rendered during loading and never in place of a failed read (that is
 * RecoveryState) — the separation is deliberate, not an accident of naming.
 */
export function EmptyState({ icon, statement, reason, action }: EmptyStateProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        gap: space('stack-sm'),
        paddingVertical: space('inset-xl'),
        paddingHorizontal: space('inset-lg'),
        backgroundColor: color('surface.default'),
      }}
    >
      {icon ? <Icon name={icon} color={color('text.secondary')} scale="lg" /> : null}
      <Heading4 style={{ textAlign: 'center' }}>{statement}</Heading4>
      {reason ? <Body tone="secondary" style={{ textAlign: 'center' }}>{reason}</Body> : null}
      {action ? <ActionBar actions={[action]} /> : null}
    </View>
  );
}
