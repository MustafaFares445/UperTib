import { View } from 'react-native';
import { Body, BodyStrong, Heading4 } from '../foundations/Text';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

function initials(name: string) {
  return name
    .replace(/^د\.\s*/, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('');
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
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space('inline-sm'), minWidth: 0 }}>
      <ProviderAvatar name={name} compact={compact} />
      <View style={{ flex: 1, minWidth: 0, gap: space('stack-xs') }}>
        {compact ? <BodyStrong>{name}</BodyStrong> : <Heading4>{name}</Heading4>}
        <Body tone="secondary">{area ? `${branch} · ${area}` : branch}</Body>
      </View>
    </View>
  );
}
