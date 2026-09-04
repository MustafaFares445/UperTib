import { View } from 'react-native';
import { Body, Heading3 } from '../foundations/Text';
import { color, space } from '../theme/tokens';

interface SubjectContextHeaderProps {
  /** Whose case this is, e.g. "لحسابك" (self) or the represented patient's name under a grant. */
  subject: string;
  /** On whose authority the actor acts, shown only when acting under representation. */
  authority?: string;
}

/**
 * CMP-PLATFORM-003 — Subject context header. States whose record this is and on whose authority
 * the actor acts. Under representation both the acting and the subject identity are evident.
 */
export function SubjectContextHeader({ subject, authority }: SubjectContextHeaderProps) {
  const representedAuthority = authority && authority !== 'لحسابك' ? authority : undefined;
  return (
    <View
      style={{
        paddingBottom: space('inset-sm'),
        borderBottomWidth: 1,
        borderBottomColor: color('border.subtle'),
        gap: space('stack-xs'),
      }}
    >
      <Heading3>{subject}</Heading3>
      {representedAuthority ? <Body tone="secondary">{representedAuthority}</Body> : null}
    </View>
  );
}
