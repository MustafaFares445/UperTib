import { type ReactNode, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Body, BodyStrong, Heading3 } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

/**
 * Progressive-disclosure wrapper for long authoring flows.
 * Completed steps may collapse because the owning screen must still render one explicit final review
 * with every controlling scope fact before commit. Incomplete steps are always expanded.
 */
export function EditableStepSection({
  title,
  summary,
  complete,
  children,
  testID,
}: {
  title: string;
  summary: string;
  complete: boolean;
  children: ReactNode;
  testID?: string;
}) {
  const [expanded, setExpanded] = useState(!complete);
  const ring = useFocusRing();

  useEffect(() => {
    if (!complete) setExpanded(true);
  }, [complete]);

  return (
    <View
      testID={testID}
      style={{
        gap: space('stack-sm'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('border.subtle'),
        backgroundColor: color('surface.default'),
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: space('inline-sm'),
        }}
      >
        <View style={{ flex: 1, minWidth: 180, gap: space('stack-xs') }}>
          <Heading3>{title}</Heading3>
          {!expanded && complete ? <Body tone="secondary">{summary}</Body> : null}
        </View>
        {complete ? (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded }}
            aria-expanded={expanded}
            accessibilityLabel={`${expanded ? 'إنهاء تعديل' : 'تعديل'} ${title}`}
            onFocus={ring.onFocus}
            onBlur={ring.onBlur}
            onPress={() => setExpanded((value) => !value)}
            style={({ pressed }) => ({
              minWidth: size('target-primary'),
              minHeight: size('target-primary'),
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: space('inset-sm'),
              borderRadius: radius('control'),
              borderWidth: borderWidth('hairline'),
              borderColor: color('action.secondary-border'),
              backgroundColor: pressed ? color('action.secondary-hover') : color('action.secondary-surface'),
              ...ring.ringStyle,
            })}
          >
            <BodyStrong style={{ color: color('action.secondary-text') }}>{expanded ? 'إنهاء التعديل' : 'تعديل'}</BodyStrong>
          </Pressable>
        ) : null}
      </View>

      {expanded ? <View style={{ gap: space('stack-sm') }}>{children}</View> : null}
    </View>
  );
}
