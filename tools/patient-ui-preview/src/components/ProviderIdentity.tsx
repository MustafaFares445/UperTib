import { View } from 'react-native';
import { Body, BodyStrong, Heading4 } from '../foundations/Text';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

/**
 * Arabic personal names do not reduce to initials the way Latin ones do. Taking the first letter of
 * each of the first two tokens of "رنا الحلبي" yields "را", whose second glyph is the alef of the
 * definite article "ال" rather than any name initial — a meaningless monogram. Use the opening of
 * the given name instead, which stays recognisable.
 */
function initials(name: string) {
  const given = name.replace(/^د\.\s*/, '').split(/\s+/).filter(Boolean)[0] ?? '';
  return given.slice(0, 2);
}

export function ProviderAvatar({ name, compact = false }: { name: string; compact?: boolean }) {
  const dimension = compact ? size('target-floor') : size('target-primary');
  return (
    <View
      accessible={false}
      style={{
        width: dimension,
        height: dimension,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius('circle'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('state.selected.border'),
        backgroundColor: color('action.primary-subtle'),
      }}
    >
      <BodyStrong tone="link">{initials(name)}</BodyStrong>
    </View>
  );
}

export function ProviderIdentity({
  name,
  branch,
  area,
  compact = false,
}: {
  name: string;
  branch: string;
  area?: string;
  compact?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space('inline-sm'), minWidth: 0 }}>
      <ProviderAvatar name={name} compact={compact} />
      <View style={{ flex: 1, minWidth: 0, gap: space('stack-xs') }}>
        {compact ? <BodyStrong>{name}</BodyStrong> : <Heading4>{name}</Heading4>}
        <Body tone="secondary">{area ? `${branch} · ${area}` : branch}</Body>
      </View>
    </View>
  );
}
