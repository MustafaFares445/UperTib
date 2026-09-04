import { useState } from 'react';
import type { ViewStyle } from 'react-native';
import { color, focusDimension } from '../theme/tokens';

/**
 * A11Y-PLATFORM-004: a visible focus indicator on every interactive element. react-native-web
 * forwards the CSS-only `outline*` style properties (RN's own ViewStyle/TextStyle types don't
 * declare them, hence the cast below), so a keyboard/AT focus renders a real double-ring outline
 * rather than a colour-only affordance.
 */
export function useFocusRing() {
  const [focused, setFocused] = useState(false);
  const ringStyle = (
    focused
      ? {
          outlineStyle: 'solid',
          outlineWidth: 2,
          outlineColor: color('focus.ring'),
          outlineOffset: focusDimension('offset'),
        }
      : {}
  ) as ViewStyle;
  return { focused, onFocus: () => setFocused(true), onBlur: () => setFocused(false), ringStyle };
}
