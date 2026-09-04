import { TextInput, View } from 'react-native';
import { Helper, Label } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import { color, radius, size, space, typeStyle } from '../theme/tokens';

interface ValidationFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  helper?: string;
  /** Field-bound error, server-authoritative. Input is preserved, never cleared on failure. */
  error?: string;
  placeholder?: string;
  keyboardType?: 'default' | 'phone-pad' | 'number-pad';
  maxLength?: number;
  autoFocus?: boolean;
}

/**
 * The realization of WGT-PLATFORM-010 (validation and correction region) for a single field: a
 * persistent visible label (never a placeholder acting as one — TXT-PLATFORM-003), helper text
 * that stays visible alongside an error rather than being replaced by it, and a field-bound error
 * association (A11Y-PLATFORM-027).
 */
export function ValidationField({
  label,
  value,
  onChangeText,
  helper,
  error,
  placeholder,
  keyboardType = 'default',
  maxLength,
  autoFocus,
}: ValidationFieldProps) {
  const ring = useFocusRing();
  const t = typeStyle('body');
  const borderColor = error ? color('tone.danger.border') : color('border.strong');

  return (
    <View style={{ gap: space('stack-xs') }}>
      <Label>{label}</Label>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={color('text.placeholder')}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoFocus={autoFocus}
        onFocus={ring.onFocus}
        onBlur={ring.onBlur}
        accessibilityLabel={label}
        accessibilityHint={[helper, error].filter(Boolean).join(' ') || undefined}
        style={{
          minHeight: size('control-lg'),
          paddingHorizontal: space('inset-md'),
          borderWidth: 1,
          borderColor,
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
      {helper ? <Helper>{helper}</Helper> : null}
      {error ? (
        <Helper accessibilityRole="alert" tone="secondary" style={{ color: color('tone.danger.text') }}>
          {error}
        </Helper>
      ) : null}
    </View>
  );
}
