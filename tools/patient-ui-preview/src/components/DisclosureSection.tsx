import { type ReactNode, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Icon } from '../foundations/Icon';
import { Body, BodyStrong } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

export function DisclosureSection({
  label,
  summary,
  children,
  defaultExpanded = false,
}: {
  label: string;
  summary?: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const ring = useFocusRing();
  return (
    <View style={{ gap: space('stack-sm') }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${expanded ? 'إخفاء' : 'عرض'} ${label}`}
        onPress={() => setExpanded((value) => !value)}
        onFocus={ring.onFocus}
        onBlur={ring.onBlur}
        style={({ pressed }) => ({
          minHeight: size('target-floor'),
          flexDirection: 'row',
          alignItems: 'center',
          gap: space('inline-sm'),
          paddingHorizontal: space('inset-sm'),
          paddingVertical: space('stack-xs'),
          borderRadius: radius('control'),
          borderWidth: borderWidth('hairline'),
          borderColor: color('border.subtle'),
          backgroundColor: pressed ? color('surface.subtle') : color('surface.default'),
          ...ring.ringStyle,
        })}
      >
        <Icon name="eye" color={color('text.secondary')} />
        <View style={{ flex: 1, gap: space('stack-xs') }}>
          <BodyStrong>{label}</BodyStrong>
          {!expanded && summary ? <Body tone="secondary">{summary}</Body> : null}
        </View>
      </Pressable>
      {expanded ? <View style={{ gap: space('stack-sm'), paddingHorizontal: space('inset-sm') }}>{children}</View> : null}
    </View>
  );
}
