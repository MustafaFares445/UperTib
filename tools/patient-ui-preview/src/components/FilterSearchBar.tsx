import { TextInput, View } from 'react-native';
import { Label } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import { color, radius, size, space, typeStyle } from '../theme/tokens';

interface FilterSearchBarProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

/**
 * CMP-PLATFORM-007 — Filter and search bar (`discovery` variant). A persistent visible label, not
 * a placeholder acting as one. Stays in the reading column rather than behind a drawer on Profile
 * C, so the filter that caused an empty result is always visible on the results screen.
 */
export function FilterSearchBar({ label, value, onChangeText, placeholder }: FilterSearchBarProps) {
  const ring = useFocusRing();
  const t = typeStyle('body');
  return (
    <View style={{ gap: space('stack-xs') }}>
      <Label>{label}</Label>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={color('text.placeholder')}
        onFocus={ring.onFocus}
        onBlur={ring.onBlur}
        accessibilityLabel={label}
        style={{
          minHeight: size('control-lg'),
          paddingHorizontal: space('inset-md'),
          borderWidth: 1,
          borderColor: color('border.strong'),
          borderRadius: radius('control'),
          backgroundColor: color('surface.default'),
          color: color('text.primary'),
          fontFamily: t.fontFamily,
          fontSize: t.fontSize,
          textAlign: 'right',
          writingDirection: 'rtl',
          ...ring.ringStyle,
        }}
      />
    </View>
  );
}
