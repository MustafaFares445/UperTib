import { Text as RNText, type TextProps } from 'react-native';

/**
 * Bidirectional isolation for a Latin/numeric run embedded in Arabic text (A11Y-PLATFORM-030 /
 * DESIGN_TOKENS.md 4.4): amounts with currency, dates, times, service/procedure identifiers and
 * Latin clinic names must read back exactly as written, never reordered by the surrounding RTL
 * paragraph direction. Wraps the run in Unicode FSI/PDI isolates and forces LTR base direction.
 */
export function Bdi({ children, style, ...rest }: TextProps) {
  return (
    <RNText {...rest} style={[{ writingDirection: 'ltr' }, style]}>
      {'⁦'}
      {children}
      {'⁩'}
    </RNText>
  );
}
