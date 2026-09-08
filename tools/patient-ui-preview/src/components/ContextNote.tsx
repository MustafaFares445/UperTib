import { View } from 'react-native';
import { Icon, type IconName } from '../foundations/Icon';
import { Body, BodyStrong } from '../foundations/Text';
import { color, space } from '../theme/tokens';

/** Lightweight context treatment for a governing fact that should stay visible without becoming another card. */
export function ContextNote({
  title,
  body,
  icon = 'document-check',
}: {
  title: string;
  body?: string;
  icon?: IconName;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space('inline-sm') }}>
      <Icon name={icon} color={color('text.secondary')} />
      <View style={{ flex: 1, gap: space('stack-xs') }}>
        <BodyStrong>{title}</BodyStrong>
        {body ? <Body tone="secondary">{body}</Body> : null}
      </View>
    </View>
  );
}
