import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { color, resolve, space } from '../theme/tokens';

interface ScreenProps {
  children: ReactNode;
  /** A sticky action bar rendered outside the scrolling reading column (CMP-PLATFORM-004 `sticky`). */
  footer?: ReactNode;
  /**
   * Vertically centres the reading column instead of pinning it to the top. For a screen whose
   * content is short relative to the viewport (e.g. SCR-IDENTITY-001) so it never reads as a title
   * stranded above dead space. Content still scrolls normally if it overflows the viewport.
   */
  centerContent?: boolean;
}

/** profile-c.reading-column-max, in characters — see breakpoints.json. Not a pixel value. */
const readingColumnMax = `${resolve('profile-c.reading-column-max')}ch` as unknown as number;

/**
 * The Patient screen shell: one primary reading column, capped at the Profile C reading-column
 * measure ceiling (docs/ux/03-system/design_tokens/breakpoints.json profile-c.reading-column-max),
 * centred so a wider device produces whitespace rather than a second pane. See
 * SCREEN_SPECS_PATIENT_01.md "Responsive" — repeated verbatim on every Slice 1 screen.
 */
export function Screen({ children, footer, centerContent = false }: ScreenProps) {
  return (
    <View style={{ minHeight: '100%', backgroundColor: color('surface.canvas') }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          paddingHorizontal: space('gutter'),
          paddingTop: space('stack-lg'),
          paddingBottom: footer ? space('stack-xl') : space('stack-lg'),
        }}
      >
        <View
          style={
            centerContent
              ? { width: '100%', maxWidth: readingColumnMax, flex: 1, justifyContent: 'center' }
              : { width: '100%', maxWidth: readingColumnMax }
          }
        >
          {children}
        </View>
      </ScrollView>
      {footer ? (
        <View
          style={{
            width: '100%',
            backgroundColor: color('surface.default'),
            borderTopWidth: 1,
            borderTopColor: color('border.subtle'),
            paddingHorizontal: space('gutter'),
            paddingVertical: space('inset-md'),
            alignItems: 'center',
          }}
        >
          <View style={{ width: '100%', maxWidth: readingColumnMax }}>{footer}</View>
        </View>
      ) : null}
    </View>
  );
}

/** A vertical rhythm block: `semantic.space.stack-*` between children, never an ad-hoc margin. */
export function Stack({ gap = 'stack-md', children }: { gap?: string; children: ReactNode }) {
  return <View style={{ gap: space(gap) }}>{children}</View>;
}

/** A horizontal rhythm row, RTL-aware because React Native mirrors `row` under `I18nManager`. */
export function Row({
  gap = 'inline-sm',
  align = 'center',
  children,
}: {
  gap?: string;
  align?: 'center' | 'flex-start' | 'flex-end';
  children: ReactNode;
}) {
  return <View style={{ flexDirection: 'row', alignItems: align, gap: space(gap) }}>{children}</View>;
}
