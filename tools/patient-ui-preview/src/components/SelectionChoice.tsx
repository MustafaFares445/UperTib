import { Pressable, View } from 'react-native';
import { Icon } from '../foundations/Icon';
import { BodyStrong } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

export interface SelectionChoiceProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  role?: 'checkbox' | 'radio';
  disabled?: boolean;
}

/**
 * Shared Patient selection control. React Native Web does not reliably project
 * accessibilityState.checked onto role=checkbox, so aria-checked is emitted explicitly.
 * The visible selected state uses the governed Heroicons-backed vocabulary rather than a literal glyph.
 */
export function SelectionChoice({
  label,
  selected,
  onPress,
  role = 'checkbox',
  disabled = false,
}: SelectionChoiceProps) {
  const ring = useFocusRing();
  return (
    <Pressable
      accessibilityRole={role}
      aria-checked={selected}
      accessibilityState={role === 'radio' ? { selected, disabled } : { checked: selected, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      style={({ pressed }) => ({
        minHeight: size('target-floor'),
        justifyContent: 'center',
        paddingHorizontal: space('inset-sm'),
        paddingVertical: space('stack-xs'),
        borderRadius: radius('control'),
        borderWidth: borderWidth('hairline'),
        borderColor: selected ? color('border.strong') : color('border.subtle'),
        backgroundColor: selected || pressed ? color('surface.subtle') : color('surface.default'),
        opacity: disabled ? 0.6 : 1,
        ...ring.ringStyle,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space('inline-sm') }}>
        <View style={{ width: size('icon-md'), alignItems: 'center', justifyContent: 'center' }}>
          {selected ? <Icon name="check-circle" color={color('text.primary')} /> : null}
        </View>
        <BodyStrong style={{ flex: 1 }}>{label}</BodyStrong>
      </View>
    </Pressable>
  );
}
