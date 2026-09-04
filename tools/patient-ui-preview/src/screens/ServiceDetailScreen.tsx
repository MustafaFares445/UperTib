import { View } from 'react-native';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, Heading4, Helper } from '../foundations/Text';
import { ActionBar } from '../components/ActionBar';
import type { ServiceFamily } from '../mocks/catalog';
import { borderWidth, color, space } from '../theme/tokens';

export interface ServiceDetailScreenProps {
  family: ServiceFamily;
  onFindProviders: () => void;
  onBack: () => void;
}

/**
 * SCR-CATALOG-002 — Service detail. Describes one service family in plain, non-diagnostic language
 * and carries its service code into provider search (API-ELIG-001 requires it) without ever
 * showing that code to the patient. No procedure item appears as a selectable or priced option.
 */
export function ServiceDetailScreen({ family, onFindProviders, onBack }: ServiceDetailScreenProps) {
  return (
    <Screen
      centerContent
      footer={
        <ActionBar
          actions={[
            { key: 'find', label: 'البحث عن مقدّمي الخدمة', role: 'primary', availability: { status: 'available' }, onPress: onFindProviders },
            { key: 'back', label: 'رجوع إلى المجموعات', role: 'secondary', availability: { status: 'available' }, onPress: onBack },
          ]}
        />
      }
    >
      <Stack gap="stack-lg">
        <ScreenHeader eyebrow="تفاصيل الخدمة" title={family.name} description={family.summary} />
        <View
          style={{
            gap: space('stack-xs'),
            paddingTop: space('stack-md'),
            borderTopWidth: borderWidth('hairline'),
            borderTopColor: color('border.subtle'),
          }}
        >
          <Heading4>ماذا تشمل هذه الخدمة عادةً؟</Heading4>
          <Body tone="secondary">{family.covers}</Body>
          <Helper>يحدّد الطبيب ما يناسب حالتك بعد الفحص؛ هذه المعلومات لا تُعدّ تشخيصًا.</Helper>
        </View>
      </Stack>
    </Screen>
  );
}
