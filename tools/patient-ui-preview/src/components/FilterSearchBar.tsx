import { Pressable, TextInput, View } from 'react-native';
import { Icon } from '../foundations/Icon';
import { Label } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import { borderWidth, color, radius, size, space, typeStyle } from '../theme/tokens';

interface FilterSearchBarProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

/**
 * CMP-PLATFORM-007 — Filter and search bar (`discovery` variant). A persistent visible label, not
 * a placeholder acting as one. Stays in the reading column rather than behind a drawer on Profile
 * C, so the filter that caused an empty result is always visible on the results screen.
 */
export function FilterSearchBar({ label, value, onChangeText, placeholder, onClear }: FilterSearchBarProps) {
  const ring = useFocusRing();
  const t = typeStyle('body');
  return (
    <View style={{ gap: space('stack-xs') }}>
      <Label>{label}</Label>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space('inline-sm') }}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={color('text.placeholder')}
          onFocus={ring.onFocus}
          onBlur={ring.onBlur}
          accessibilityLabel={label}
          style={{
            flex: 1,
            minHeight: size('control-lg'),
            paddingHorizontal: space('inset-md'),
            borderWidth: borderWidth('hairline'),
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
        {value && onClear ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="مسح البحث"
            onPress={onClear}
            style={({ pressed }) => ({
              width: size('target-primary'),
              height: size('target-primary'),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radius('control'),
              backgroundColor: pressed ? color('action.secondary-hover') : color('surface.default'),
            })}
          >
            <Icon name="x-circle" color={color('text.secondary')} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
