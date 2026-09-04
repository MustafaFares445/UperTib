import { Pressable, View } from 'react-native';
import { Body, Helper } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import { color, radius, size, space } from '../theme/tokens';

export type ActionRole = 'primary' | 'secondary' | 'destructive';

export type ActionAvailability =
  | { status: 'available' }
  | { status: 'loading' }
  /** Control renders, inert, with the reason bound to it. Never a silent dead control. */
  | { status: 'disabled'; reason: string }
  /** Control does not render at all; the reason it would take to appear is stated instead. */
  | { status: 'absent'; reason: string };

export interface ActionSpec {
  key: string;
  label: string;
  role: ActionRole;
  availability: ActionAvailability;
  onPress?: () => void;
}

function roleColors(role: ActionRole) {
  switch (role) {
    case 'primary':
      return {
        bg: color('action.primary'),
        bgHover: color('action.primary-hover'),
        text: color('text.on-action'),
        border: 'transparent',
      };
    case 'destructive':
      return {
        bg: color('action.destructive'),
        bgHover: color('action.destructive-hover'),
        text: color('text.on-action'),
        border: 'transparent',
      };
    case 'secondary':
    default:
      return {
        bg: color('action.secondary-surface'),
        bgHover: color('action.secondary-hover'),
        text: color('action.secondary-text'),
        border: color('action.secondary-border'),
      };
  }
}

function ActionControl({ action }: { action: ActionSpec }) {
  const ring = useFocusRing();
  const palette = roleColors(action.role);
  const inert = action.availability.status === 'disabled' || action.availability.status === 'loading';
  const reason = action.availability.status === 'disabled' ? action.availability.reason : undefined;

  return (
    <View style={{ gap: space('stack-xs') }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: inert }}
        accessibilityHint={reason}
        disabled={inert}
        onFocus={ring.onFocus}
        onBlur={ring.onBlur}
        onPress={action.onPress}
        style={({ pressed }) => ({
          minHeight: size('target-primary'),
          paddingHorizontal: space('inset-lg'),
          borderRadius: radius('control'),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: palette.bg,
          borderWidth: action.role === 'secondary' ? 1 : 0,
          borderColor: palette.border,
          opacity: inert ? 0.45 : pressed ? 0.9 : 1,
          ...ring.ringStyle,
        })}
      >
        <Body style={{ color: palette.text, fontWeight: '600' }}>
          {action.availability.status === 'loading' ? 'جارٍ التنفيذ…' : action.label}
        </Body>
      </Pressable>
      {reason ? <Helper>{reason}</Helper> : null}
    </View>
  );
}

/**
 * CMP-PLATFORM-004 — Action bar. Exactly one primary action, or none; a destructive action always
 * uses `action.destructive`, never `action.primary` (token-by-intent, non-negotiable). A removed
 * action is absent-and-explained rather than a disabled control implying an override exists.
 */
export function ActionBar({ actions, sticky = false }: { actions: ActionSpec[]; sticky?: boolean }) {
  const visible = actions.filter((a) => a.availability.status !== 'absent');
  const absent = actions.filter(
    (a): a is ActionSpec & { availability: { status: 'absent'; reason: string } } =>
      a.availability.status === 'absent',
  );
  const primaries = visible.filter((a) => a.role === 'primary');
  if (primaries.length > 1) {
    throw new Error('ActionBar: exactly one primary action, or none. Two primaries is an undecided surface.');
  }

  return (
    <View style={{ gap: space('stack-sm') }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space('inline-md') }}>
        {visible.map((action) => (
          <ActionControl key={action.key} action={action} />
        ))}
      </View>
      {absent.map((action) => (
        <Helper key={action.key}>{action.availability.reason}</Helper>
      ))}
    </View>
  );
}
