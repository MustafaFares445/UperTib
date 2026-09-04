import { View } from 'react-native';
import { size as tokenSize } from '../theme/tokens';

/**
 * Governed icon vocabulary (semantic.state.json "icon-set": heroicons-2-outline-24), restricted to
 * the subset this Slice 1 journey actually renders. Every name here is one from the canonical
 * icon-vocabulary list; no other icon set is introduced.
 *
 * The concrete Patient icon package (e.g. vendoring the Heroicons React Native port) is a
 * production-stack decision this preview intentionally defers per PATIENT_UI_PREVIEW_SETUP.md.
 * These are simplified outline glyphs drawn in the same 24x24 / 1.5-stroke language as Heroicons
 * Outline so the preview reads correctly without vendoring a production dependency for it.
 */
export type IconName =
  | 'check-circle'
  | 'x-circle'
  | 'no-symbol'
  | 'pause-circle'
  | 'clock'
  | 'magnifying-glass'
  | 'arrows-right-left'
  | 'calendar-days'
  | 'shield-exclamation'
  | 'minus-circle'
  | 'user-minus'
  | 'exclamation-triangle'
  | 'exclamation-circle'
  | 'arrow-path'
  | 'lock-closed'
  | 'stop-circle'
  | 'document-text';

const PATHS: Record<IconName, string> = {
  'check-circle': 'M8 12.5l2.5 2.5L16 9M20.5 12a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z',
  'x-circle': 'M9.5 9.5l5 5m0-5l-5 5M20.5 12a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z',
  'no-symbol': 'M20.5 12a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0zM6.5 6.5l11 11',
  'pause-circle': 'M10 9v6M14 9v6M20.5 12a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z',
  clock: 'M12 7.5V12l3 2M20.5 12a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z',
  'magnifying-glass': 'M20 20l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z',
  'arrows-right-left': 'M7 20l-3.5-3.5L7 13M3.5 16.5h17M17 4l3.5 3.5L17 11M20.5 7.5h-17',
  'calendar-days': 'M6 4v2.5M18 4v2.5M4 9.5h16M5 7h14a1 1 0 011 1v10.5a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1z',
  'shield-exclamation':
    'M12 3.5l7 2.5v5.2c0 4.2-2.9 7.7-7 8.8-4.1-1.1-7-4.6-7-8.8V6l7-2.5zM12 9v4M12 16h.01',
  'minus-circle': 'M8 12h8M20.5 12a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z',
  'user-minus': 'M15 8a3 3 0 11-6 0 3 3 0 016 0zM5 20a7 7 0 0114 0M17 12h5',
  'exclamation-triangle':
    'M12 4.5L21 19.5H3L12 4.5zM12 10v4M12 16.5h.01',
  'exclamation-circle': 'M12 8v5M12 16h.01M20.5 12a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z',
  'arrow-path': 'M4 9a8 8 0 0114.9-3.5M20 4v5h-5M20 15a8 8 0 01-14.9 3.5M4 20v-5h5',
  'lock-closed': 'M7 10.5V8a5 5 0 0110 0v2.5M5.5 10.5h13v9h-13v-9z',
  'stop-circle': 'M9 9h6v6H9zM20.5 12a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z',
  'document-text': 'M7 3.5h7l3.5 3.5v13.5h-10.5v-17zM14 3.5V7h3.5M9 12h6M9 15.5h6M9 8.5h2',
};

export interface IconProps {
  name: IconName;
  color: string;
  /** Defaults to the icon-md control size. Use "lg" for Patient primary/section-header contexts. */
  scale?: 'sm' | 'md' | 'lg';
  /** The label already carries the meaning (A11Y-PLATFORM-010): the icon is decorative to AT. */
  accessibilityLabel?: string;
}

/** One governed icon at a fixed pixel size, colour-driven by the caller's resolved tone colour. */
export function Icon({ name, color, scale = 'md', accessibilityLabel }: IconProps) {
  const px = tokenSize(`icon-${scale}`);
  const path = PATHS[name];
  return (
    <View
      accessible={Boolean(accessibilityLabel)}
      accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={!accessibilityLabel}
      importantForAccessibility={accessibilityLabel ? 'yes' : 'no-hide-descendants'}
      style={{ width: px, height: px }}
    >
      <svg width={px} height={px} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={path} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </View>
  );
}
